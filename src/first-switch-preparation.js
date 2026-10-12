/** Prepare the existing renderer's cold resources before the room becomes interactive.
 * Assets, material hooks, light powers, shadow sizes and steady-state rendering stay unchanged.
 */
import { Mh as Scene, _t as Mesh, Hr as PlaneGeometry, ii as MeshBasicMaterial, vn as Plane, L as Vector3 } from '../vendor/runtime-v11.js';

export const FIRST_SWITCH_PREPARATION = Object.freeze({
  revision: 'first-switch-preparation-v19-adaptive', meshesPerBatch: 8, geometryBytesPerBatch: 2 * 1024 * 1024,
  batchesPerSlice: 4,
  texturesPerSlice: 2, sliceMilliseconds: 4, shaderWaitMilliseconds: 15000,
  // Plane direction and GI day/night are uniforms, not additional program variants.
  variants: Object.freeze([
    Object.freeze({ sunShadow: true, clipped: true }), Object.freeze({ sunShadow: true, clipped: false }),
    Object.freeze({ sunShadow: false, clipped: true }), Object.freeze({ sunShadow: false, clipped: false }),
  ]),
});
const materialsOf = mesh => Array.isArray(mesh.material) ? mesh.material : [mesh.material];
const aborted = signal => { if (signal?.aborted) throw signal.reason || new Error('Room preparation interrupted'); };

/** Yield after a browser paint; hidden tabs pause rather than doing background GPU work. */
export function preparationFrame(signal) {
  return new Promise((resolve, reject) => {
    let frame, timer;
    const cancel = () => { cancelAnimationFrame(frame); clearTimeout(timer); signal?.removeEventListener('abort', cancel); reject(signal.reason || new Error('Room preparation interrupted')); };
    if (signal?.aborted) return cancel();
    signal?.addEventListener('abort', cancel, { once: true });
    const schedule = () => { frame = requestAnimationFrame(() => { timer = setTimeout(() => {
      if (globalThis.document?.visibilityState === 'hidden') { schedule(); return; }
      signal?.removeEventListener('abort', cancel); resolve();
    }, 0); }); };
    schedule();
  });
}
export function collectPreparationResources(scene, extraTextures = []) {
  const meshes = [], materials = new Set(), textures = new Set();
  const addTexture = texture => { if (texture?.isTexture && !texture.isRenderTargetTexture) textures.add(texture); };
  scene.traverse(object => {
    if (!object.isMesh) return;
    meshes.push(object);
    for (const material of materialsOf(object)) {
      if (!material || materials.has(material)) continue;
      materials.add(material);
      for (const value of Object.values(material)) addTexture(value);
    }
  });
  for (const texture of extraTextures) addTexture(texture);
  return { meshes, materials: [...materials], textures: [...textures] };
}
function geometryArrays(geometry) {
  const arrays = new Set();
  for (const attribute of [...Object.values(geometry.attributes), geometry.index, ...Object.values(geometry.morphAttributes || {}).flat()]) {
    if (attribute) arrays.add(attribute.isInterleavedBufferAttribute ? attribute.data.array : attribute.array);
  }
  return [...arrays].filter(Boolean);
}
export function preparationBatches(meshes, config = FIRST_SWITCH_PREPARATION) {
  const batches = []; let batch = [], bytes = 0, arrays = new Set();
  for (const mesh of meshes) {
    const views = geometryArrays(mesh.geometry);
    let size = views.reduce((sum, array) => sum + (arrays.has(array) ? 0 : array.byteLength), 0);
    if (batch.length && (batch.length >= config.meshesPerBatch || bytes + size > config.geometryBytesPerBatch)) {
      batches.push(batch); batch = []; bytes = 0; arrays = new Set();
      size = views.reduce((sum, array) => sum + array.byteLength, 0);
    }
    batch.push(mesh); bytes += size; views.forEach(array => arrays.add(array));
  }
  if (batch.length) batches.push(batch);
  return batches;
}
function viewportOf(renderer, method) {
  return renderer[method]({ copy: value => ({ x: value.x, y: value.y, z: value.z, w: value.w }) });
}

export async function prepareFirstSwitch({ renderer, scene, camera, daylight, extraTextures = [], signal,
  onProgress = () => {}, yieldFrame = preparationFrame, now = () => performance.now(), documentTarget = globalThis.document }) {
  const config = FIRST_SWITCH_PREPARATION, started = now();
  let pausedMilliseconds = 0, hiddenSince = null;
  const visibilityChanged = () => {
    if (documentTarget?.visibilityState === 'hidden') { if (hiddenSince === null) hiddenSince = now(); }
    else if (hiddenSince !== null) { pausedMilliseconds += now() - hiddenSince; hiddenSince = null; }
  };
  const activeNow = () => now() - pausedMilliseconds - (hiddenSince === null ? 0 : now() - hiddenSince);
  const check = () => { aborted(signal); if (renderer.getContext().isContextLost()) throw new Error('WebGL context lost during room preparation'); };
  const metrics = { frameYields: 0, yieldReasons: {}, compileCalls: 0, seedDraws: 0,
    textureCpuMilliseconds: 0, compileCpuMilliseconds: 0, drawCpuMilliseconds: 0,
    maxSliceCpuMilliseconds: 0, maxBatchesPerSlice: 0 };
  let sliceStarted = now(), sliceBatches = 0, estimatedBatchMilliseconds = 0;
  const snapshotMetrics = () => ({ ...metrics, yieldReasons: { ...metrics.yieldReasons } });
  const nextFrame = async (reason = 'phase') => {
    metrics.maxSliceCpuMilliseconds = Math.max(metrics.maxSliceCpuMilliseconds, now() - sliceStarted);
    metrics.maxBatchesPerSlice = Math.max(metrics.maxBatchesPerSlice, sliceBatches);
    do {
      metrics.frameYields++; metrics.yieldReasons[reason] = (metrics.yieldReasons[reason] || 0) + 1;
      await yieldFrame(signal); check();
    } while (documentTarget?.visibilityState === 'hidden');
    sliceStarted = now(); sliceBatches = 0;
  };
  const measure = (key, work) => { const start = now(); try { return work(); } finally { metrics[key] += now() - start; } };
  check();
  const resources = collectPreparationResources(scene, extraTextures);
  const batches = preparationBatches(resources.meshes);
  const lights = []; scene.traverseVisible(object => { if (object.isLight) lights.push(object); });
  const shadowLights = lights.filter(light => light.shadow);
  const saved = {
    viewport: viewportOf(renderer, 'getViewport'), scissor: viewportOf(renderer, 'getScissor'), scissorTest: renderer.getScissorTest(),
    target: renderer.getRenderTarget(), cubeFace: renderer.getActiveCubeFace(), mip: renderer.getActiveMipmapLevel(),
    sunShadow: daylight.castShadow,
    shadows: shadowLights.map(light => [light, light.shadow.needsUpdate]),
    materials: resources.materials.map(material => [material, material.clippingPlanes, material.clipShadows, material.side]),
  };
  // Shallow renderable copies share the exact geometry/material, but preserve the
  // original scene's hierarchy, visibility, matrices, callbacks and LOD state.
  const proxies = new Map(resources.meshes.map(object => {
    const proxy = object.clone(false);
    proxy.matrixWorld.copy(object.matrixWorld); proxy.matrixWorldAutoUpdate = false; proxy.matrixAutoUpdate = false;
    proxy.visible = true; proxy.frustumCulled = false;
    return [object, proxy];
  }));
  const stage = new Scene(), compileRoot = new Scene();
  stage.matrixWorldAutoUpdate = false;
  stage.environment = scene.environment; stage.environmentIntensity = scene.environmentIntensity;
  stage.environmentRotation.copy(scene.environmentRotation); stage.background = scene.background; stage.fog = scene.fog;
  // The pinned r180 compile() does not initialize local clipping. A tiny real
  // draw seeds its clipping state before each variant's bounded compilations.
  const seed = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial());
  seed.frustumCulled = false; seed.matrixAutoUpdate = false; seed.matrixWorldAutoUpdate = false;
  const clipped = [new Plane(new Vector3(0, -1, 0), 2.78)];
  const parallel = renderer.extensions.has('KHR_parallel_shader_compile');
  let uploadedTextures = 0, drawnBatches = 0;
  const total = resources.textures.length + config.variants.length * batches.length;
  const report = phase => onProgress({ phase, completed: uploadedTextures + drawnBatches, total, metrics: snapshotMetrics() });
  try {
    visibilityChanged(); documentTarget?.addEventListener('visibilitychange', visibilityChanged);
    report('textures'); await nextFrame();
    // One texture upload cannot be preempted; cap both count and observed CPU
    // time before yielding. No texture quality, dimensions or mipmaps change.
    for (let index = 0; index < resources.textures.length;) {
      const sliceStart = now(); let count = 0;
      do { check(); measure('textureCpuMilliseconds', () => renderer.initTexture(resources.textures[index++])); uploadedTextures++; count++; }
      while (index < resources.textures.length && count < config.texturesPerSlice && now() - sliceStart < config.sliceMilliseconds);
      report('textures'); await nextFrame('textures');
    }
    // Default framebuffer is essential: offscreen render targets use different
    // output-colour/tone-mapping program keys. Only the viewport/scissor shrink;
    // the camera, canvas resolution and authored shadow maps do not.
    renderer.setRenderTarget(null); renderer.setViewport(0, 0, 1, 1); renderer.setScissor(0, 0, 1, 1); renderer.setScissorTest(true);
    for (const variant of config.variants) {
      check(); daylight.castShadow = variant.sunShadow;
      const planes = variant.clipped ? clipped : [];
      for (const material of resources.materials) { material.clippingPlanes = planes; material.clipShadows = true; }
      for (const light of shadowLights) light.shadow.needsUpdate = false;
      seed.material.clippingPlanes = planes;
      // Borrow lights without changing their real parents. Their matrices,
      // targets and shadow maps are the actual runtime resources.
      stage.children = [...lights, seed]; measure('drawCpuMilliseconds', () => renderer.render(stage, camera)); metrics.seedDraws++; await nextFrame('seed');
      for (const batch of batches) {
        check();
        // A conservative cost estimate avoids starting another known-expensive
        // batch; the count cap bounds work even when clock precision is coarse.
        if (sliceBatches && (sliceBatches >= config.batchesPerSlice || now() - sliceStarted + estimatedBatchMilliseconds >= config.sliceMilliseconds)) {
          await nextFrame('budget');
        }
        const beforeCpu = metrics.compileCpuMilliseconds + metrics.drawCpuMilliseconds;
        compileRoot.children = batch.map(mesh => proxies.get(mesh));
        // Do not compile the full scene: compile() traverses hidden meshes too.
        const compiled = measure('compileCpuMilliseconds', () => renderer.compile(compileRoot, camera, stage));
        metrics.compileCalls++;
        if (parallel) {
          // Same readiness check as frozen r180 compileAsync, with cancellable
          // frame yields and a deadline instead of its unbounded 10 ms timer.
          const waitStart = activeNow();
          while ([...compiled].some(material => [...renderer.properties.get(material).programs.values()].some(program => !program.isReady()))) {
            if (activeNow() - waitStart > config.shaderWaitMilliseconds) throw new Error('Room shader preparation timed out');
            await nextFrame('shader-wait');
          }
        }
        // Already-ready programs can draw in this slice. Yield first only when
        // observed compile CPU work used the budget. No draw is skipped.
        if (now() - sliceStarted >= config.sliceMilliseconds) await nextFrame('compile-budget');
        stage.children = [...lights, ...compileRoot.children];
        for (const light of shadowLights) light.shadow.needsUpdate = light.castShadow;
        // Real draws also prepare shadow-depth variants, buffers/VAOs and maps.
        measure('drawCpuMilliseconds', () => renderer.render(stage, camera)); drawnBatches++; sliceBatches++;
        const batchCpu = metrics.compileCpuMilliseconds + metrics.drawCpuMilliseconds - beforeCpu;
        estimatedBatchMilliseconds = Math.max(batchCpu, estimatedBatchMilliseconds * .75);
        report('shaders');
        if (sliceBatches >= config.batchesPerSlice || now() - sliceStarted >= config.sliceMilliseconds) await nextFrame('budget');
      }
      // Keep topology transitions and the final real draw behind a paint boundary.
      if (sliceBatches) await nextFrame('topology');
      report('shaders');
    }
    check();
    return { revision: config.revision, meshes: resources.meshes.length, textures: uploadedTextures,
      variants: config.variants.length, batches: drawnBatches, parallelShaderCompile: parallel, elapsedMilliseconds: now() - started,
      activeElapsedMilliseconds: activeNow() - started, metrics: snapshotMetrics() };
  } finally {
    documentTarget?.removeEventListener('visibilitychange', visibilityChanged);
    for (const [material, planes, clipShadows, side] of saved.materials) {
      material.clippingPlanes = planes; material.clipShadows = clipShadows; material.side = side;
    }
    daylight.castShadow = saved.sunShadow;
    for (const [light, needsUpdate] of saved.shadows) light.shadow.needsUpdate = needsUpdate;
    stage.children = []; compileRoot.children = [];
    seed.geometry.dispose(); seed.material.dispose();
    renderer.setRenderTarget(saved.target, saved.cubeFace, saved.mip);
    renderer.setViewport(saved.viewport.x, saved.viewport.y, saved.viewport.z, saved.viewport.w);
    renderer.setScissor(saved.scissor.x, saved.scissor.y, saved.scissor.z, saved.scissor.w); renderer.setScissorTest(saved.scissorTest);
  }
}
