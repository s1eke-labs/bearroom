import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Mh as Scene, _t as Mesh, Hr as PlaneGeometry, ii as MeshBasicMaterial, nl as DirectionalLight, Ih as SpotLight, Gr as OrthographicCamera, L as Vector3, vn as Plane } from '../vendor/runtime-v11.js';
import { FIRST_SWITCH_PREPARATION as CONFIG, prepareFirstSwitch, collectPreparationResources, preparationBatches, preparationFrame } from '../src/first-switch-preparation.js';
import { applyBakedGI } from '../src/baked-gi.js';
import { assetDirectory } from '../scripts/asset-contract.mjs';
import { loadSceneForCPU } from './helpers.mjs';

function fixture(count = 19) {
  const scene = new Scene(), camera = new OrthographicCamera(-12, 12, 10, -10, .1, 100);
  const daylight = new DirectionalLight('#fff0df', 0), spot = new SpotLight('#ffe7cc', 24);
  daylight.castShadow = false; spot.castShadow = true;
  daylight.shadow.autoUpdate = spot.shadow.autoUpdate = false;
  daylight.shadow.mapSize.set(2048, 2048); spot.shadow.mapSize.set(512, 512);
  daylight.shadow.needsUpdate = false; spot.shadow.needsUpdate = true;
  scene.add(daylight, spot);
  const material = new MeshBasicMaterial(); material.clippingPlanes = [new Plane(new Vector3(0, 1, 0), -2.78)]; material.clipShadows = false;
  const geometry = new PlaneGeometry(1, 1), meshes = [];
  for (let index = 0; index < count; index++) {
    const mesh = new Mesh(geometry, material); mesh.name = `original-${index}`;
    mesh.visible = index % 2 === 0; mesh.castShadow = true; mesh.receiveShadow = true; mesh.position.set(index, 1, 2);
    meshes.push(mesh); scene.add(mesh);
  }
  scene.updateMatrixWorld(true); scene.matrixWorldAutoUpdate = false;
  const snapshots = meshes.map(mesh => ({ mesh, visible: mesh.visible, parent: mesh.parent, frustumCulled: mesh.frustumCulled, matrix: mesh.matrixWorld.toArray() }));
  const planes = material.clippingPlanes;
  return { scene, camera, daylight, spot, material, geometry, meshes, snapshots, planes };
}
function fakeRenderer(f, { parallel = true, failAtDraw = 0, waitForever = false, checkStage = () => {} } = {}) {
  let viewport = { x: 9, y: 8, z: 640, w: 480 }, scissor = { x: 7, y: 6, z: 500, w: 400 }, scissorTest = false;
  let target = { name: 'previous-target' }, cubeFace = 3, mip = 2, clipping = 99, draws = 0, lost = false, tick = 0;
  const events = [], props = new Map(), uploads = [], variants = new Set(), originalTarget = target;
  const renderer = {
    extensions: { has: name => name === 'KHR_parallel_shader_compile' && parallel },
    properties: { get: material => props.get(material) },
    getContext: () => ({ isContextLost: () => lost }),
    getViewport: out => out.copy(viewport), getScissor: out => out.copy(scissor), getScissorTest: () => scissorTest,
    getRenderTarget: () => target, getActiveCubeFace: () => cubeFace, getActiveMipmapLevel: () => mip,
    setRenderTarget: (value, face = 0, level = 0) => { target = value; cubeFace = face; mip = level; },
    setViewport: (x, y, z, w) => { viewport = { x, y, z, w }; }, setScissor: (x, y, z, w) => { scissor = { x, y, z, w }; }, setScissorTest: value => { scissorTest = value; },
    initTexture: texture => { uploads.push(texture); events.push('upload'); },
    compile: (root, camera, stage) => {
      assert.equal(camera, f.camera); assert.equal(stage.environment, f.scene.environment);
      const meshes = []; root.traverse(object => { if (object.isMesh) meshes.push(object); });
      assert.ok(meshes.length <= CONFIG.meshesPerBatch);
      const compiled = new Set();
      for (const proxy of meshes) for (const material of Array.isArray(proxy.material) ? proxy.material : [proxy.material]) {
        assert.equal(material.clippingPlanes.length, clipping, 'real seed/draw primed clipping before compile');
        if (!props.has(material)) props.set(material, { programs: new Map() });
        const data = props.get(material), key = `${clipping}:${f.daylight.castShadow}:${proxy.geometry.id}`;
        // The non-current program must be polled too (e.g. double-sided or shared geometry variants).
        if (!data.programs.has(key)) { const readyTick = tick + 2; data.programs.set(key, { isReady: () => !waitForever && tick >= readyTick }); }
        data.currentProgram = { isReady: () => true };
        compiled.add(material);
      }
      events.push('compile'); return compiled;
    },
    render: (stage, camera) => {
      assert.equal(camera, f.camera); assert.equal(target, null);
      assert.deepEqual(viewport, { x: 0, y: 0, z: 1, w: 1 });
      assert.equal(stage.environment, f.scene.environment); assert.equal(stage.background, f.scene.background);
      assert.equal(f.daylight.parent, f.scene); assert.equal(f.spot.parent, f.scene);
      const meshes = stage.children.filter(object => object.isMesh);
      assert.ok(meshes.length <= CONFIG.meshesPerBatch);
      for (const proxy of meshes) {
        assert.equal(proxy.visible, true); assert.equal(proxy.frustumCulled, false);
        clipping = proxy.material.clippingPlanes.length;
        if (proxy.name.startsWith('original-')) {
          const original = f.meshes.find(mesh => mesh.name === proxy.name);
          assert.notEqual(proxy, original); assert.equal(proxy.geometry, original.geometry); assert.equal(proxy.material, original.material);
          assert.deepEqual(proxy.matrixWorld.toArray(), original.matrixWorld.toArray());
          if (parallel) for (const program of props.get(proxy.material).programs.values()) assert.ok(program.isReady(), 'draw must await all programs');
        }
      }
      const batch = meshes[0]?.name.startsWith('original-');
      if (batch) {
        draws++; variants.add(`${f.daylight.castShadow}:${clipping}`);
        assert.equal(f.daylight.shadow.needsUpdate, f.daylight.castShadow); assert.equal(f.spot.shadow.needsUpdate, true);
        if (draws === failAtDraw) throw Error('Synthetic draw failure');
      }
      events.push(batch ? 'draw' : 'seed'); checkStage(stage);
    },
  };
  return { renderer, events, uploads, variants, next: async () => { tick++; events.push('yield'); }, lose: () => { lost = true; },
    restored: () => { assert.equal(target, originalTarget); assert.equal(cubeFace, 3); assert.equal(mip, 2); assert.deepEqual(viewport, { x: 9, y: 8, z: 640, w: 480 }); assert.deepEqual(scissor, { x: 7, y: 6, z: 500, w: 400 }); assert.equal(scissorTest, false); } };
}
function assertRestored(f, r) {
  r.restored(); assert.equal(f.daylight.castShadow, false); assert.equal(f.daylight.shadow.needsUpdate, false); assert.equal(f.spot.shadow.needsUpdate, true);
  assert.equal(f.material.clippingPlanes, f.planes); assert.equal(f.material.clipShadows, false);
  assert.deepEqual(f.daylight.shadow.mapSize.toArray(), [2048, 2048]); assert.deepEqual(f.spot.shadow.mapSize.toArray(), [512, 512]);
  for (const saved of f.snapshots) { assert.equal(saved.mesh.visible, saved.visible); assert.equal(saved.mesh.parent, saved.parent); assert.equal(saved.mesh.frustumCulled, saved.frustumCulled); assert.deepEqual(saved.mesh.matrixWorld.toArray(), saved.matrix); }
}

test('preparation batches cap mesh count and geometry bytes without changing assets', () => {
  const meshes = [50, 60, 90, 250, 20, 20, 20].map(size => ({ geometry: { attributes: { position: { array: new Uint8Array(size) } } } }));
  const batches = preparationBatches(meshes, { meshesPerBatch: 2, geometryBytesPerBatch: 100 });
  assert.deepEqual(batches.map(batch => batch.map(mesh => meshes.indexOf(mesh))), [[0], [1], [2], [3], [4, 5], [6]]);
  assert.deepEqual(batches.flat(), meshes, 'a single oversized geometry stays indivisible and is documented');
});
test('all material slots and extra slideshow/GI textures are deduplicated, render-target textures excluded', () => {
  const f = fixture(2), a = { isTexture: true }, b = { isTexture: true }, c = { isTexture: true }, rt = { isTexture: true, isRenderTargetTexture: true };
  Object.assign(f.material, { map: a, normalMap: a, sheenColorMap: b, envMap: rt });
  assert.deepEqual(collectPreparationResources(f.scene, [c, a, rt]).textures, [a, b, c]);
});
test('bounded real draws cover all four original shader topologies, all meshes and all programs', async () => {
  const f = fixture(), r = fakeRenderer(f), texture = { isTexture: true }, progress = [];
  const before = f.camera.projectionMatrix.toArray();
  const result = await prepareFirstSwitch({ ...f, renderer: r.renderer, extraTextures: [texture], yieldFrame: r.next, onProgress: value => progress.push(value) });
  assert.equal(result.meshes, 19); assert.equal(result.variants, 4); assert.equal(result.batches, 12); assert.equal(result.parallelShaderCompile, true);
  assert.deepEqual([...r.variants], ['true:1', 'true:0', 'false:1', 'false:0']); assert.deepEqual(r.uploads, [texture]);
  assert.equal(r.events.filter(event => event === 'seed').length, 4);
  assert.equal(progress.at(-1).completed, progress.at(-1).total);
  assert.deepEqual(f.camera.projectionMatrix.toArray(), before); assertRestored(f, r);
});
test('a one-batch topology compiles and draws before its transition yield', async () => {
  const f = fixture(3), r = fakeRenderer(f, { parallel: false });
  const result = await prepareFirstSwitch({ ...f, renderer: r.renderer, yieldFrame: r.next });
  assert.equal(result.parallelShaderCompile, false);
  for (let index = 0; index < r.events.length; index++) if (r.events[index] === 'compile') assert.deepEqual(r.events.slice(index, index + 3), ['compile', 'draw', 'yield']);
  assertRestored(f, r);
});
test('texture slices yield at the count limit before shader/draw work', async () => {
  const f = fixture(1), r = fakeRenderer(f), textures = Array.from({ length: 5 }, () => ({ isTexture: true }));
  await prepareFirstSwitch({ ...f, renderer: r.renderer, extraTextures: textures, yieldFrame: r.next, now: () => 0 });
  assert.deepEqual(r.events.slice(0, 9), ['yield', 'upload', 'upload', 'yield', 'upload', 'upload', 'yield', 'upload', 'yield']);
});
test('drawing failure restores scene/material/light/renderer state and rejects readiness', async () => {
  const f = fixture(), r = fakeRenderer(f, { failAtDraw: 2 });
  await assert.rejects(prepareFirstSwitch({ ...f, renderer: r.renderer, yieldFrame: r.next }), /Synthetic draw failure/);
  assertRestored(f, r);
});
test('context loss during a frame yield stops preparation without declaring completion', async () => {
  const f = fixture(), r = fakeRenderer(f); let count = 0;
  await assert.rejects(prepareFirstSwitch({ ...f, renderer: r.renderer, yieldFrame: async () => { await r.next(); if (++count === 5) r.lose(); } }), /WebGL context lost/);
  assertRestored(f, r);
});
test('explicit abort stops shader readiness polling and restores state', async () => {
  const f = fixture(), r = fakeRenderer(f, { waitForever: true }), controller = new AbortController(); let count = 0;
  await assert.rejects(prepareFirstSwitch({ ...f, renderer: r.renderer, signal: controller.signal, yieldFrame: async () => { await r.next(); if (++count === 5) controller.abort(Error('Interrupted')); } }), /Interrupted/);
  assertRestored(f, r);
});
test('shader readiness wait has a finite deadline and no uncancellable vendor timer', async () => {
  const f = fixture(), r = fakeRenderer(f, { waitForever: true }); let now = 0;
  await assert.rejects(prepareFirstSwitch({ ...f, renderer: r.renderer, yieldFrame: async () => { await r.next(); now += 10000; }, now: () => now }), /timed out/);
  assertRestored(f, r);
});
test('paint-yield can be cancelled while requestAnimationFrame is suspended in a hidden tab', async () => {
  const oldRAF = globalThis.requestAnimationFrame, oldCancel = globalThis.cancelAnimationFrame, controller = new AbortController(); let cancelled = 0;
  globalThis.requestAnimationFrame = () => 123; globalThis.cancelAnimationFrame = id => { if (id === 123) cancelled++; };
  try { const pending = preparationFrame(controller.signal); controller.abort(Error('Tab interrupted')); await assert.rejects(pending, /Tab interrupted/); assert.equal(cancelled, 1); }
  finally { globalThis.requestAnimationFrame = oldRAF; globalThis.cancelAnimationFrame = oldCancel; }
});
test('real v19 model and genuine packed GI are enumerable for preparation without editing buffers or shaders', async () => {
  const scene = await loadSceneForCPU(), gi = JSON.parse(fs.readFileSync(assetDirectory() + '/baked-gi/irradiance.json'));
  const baked = await applyBakedGI(scene, { data: gi }), before = JSON.stringify(baked.diagnostics());
  const resources = collectPreparationResources(scene, baked.textures), batches = preparationBatches(resources.meshes);
  assert.equal(resources.meshes.length, 365); assert.equal(batches.length, 47); assert.ok(batches.every(batch => batch.length <= CONFIG.meshesPerBatch));
  assert.ok(Object.isFrozen(baked.textures)); assert.equal(baked.textures.length, 1); assert.equal(baked.textures[0].image.data.byteLength, 15360);
  assert.equal(resources.textures[0], baked.textures[0]); assert.equal(JSON.stringify(baked.diagnostics()), before);
  baked.dispose();
});
test('startup integration locks input/render/resize, preserves shadow toggle, and reveals after a full frame', () => {
  const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const start = main.includes('async function loadRoom()') ? main.indexOf('async function loadRoom()') : main.indexOf('async function pv()');
  const startup = main.slice(start, main.indexOf('function setRoomReady'));
  const prepare = startup.indexOf('prepareFirstSwitch('), frame = startup.indexOf('finishRoomPreparation()'), reveal = startup.lastIndexOf('classList.add("hidden")');
  assert.ok(prepare >= 0 && frame > prepare && reveal > frame, 'prepare all variants, complete a full frame, then reveal');
  assert.match(main, /if \(!cs\) \{ Cr = i; return; \}/);
  for (const fn of ['ll', 'gv']) assert.match(main, new RegExp(`function ${fn}\\(i\\) \\{\\n  if \\(!cs\\) return;`));
  assert.match(main, /window.addEventListener\("resize", \(\) => \{\n  if \(!cs\) return;/);
  assert.match(main, /cancelAnimationFrame\(Hs\); Hs = null; Cr = performance.now\(\); cs = true;\n    const rendered = vv\(Cr\);[\s\S]+?setRoomReady\(true\);/);
  assert.match(main, /It.shadow.needsUpdate = It.intensity > 0, It.castShadow = It.intensity > 0;/);
  assert.match(main, /extraTextures: \[\.\.\.No.flatMap\(screen => screen.imgs\), \.\.\.Fr.textures\]/);
});

test('a tab hidden between RAF and its timer does not resolve the paint-yield until visible', async () => {
  const oldRAF = globalThis.requestAnimationFrame, oldCancel = globalThis.cancelAnimationFrame, oldDocument = globalThis.document;
  const callbacks = []; globalThis.document = { visibilityState: 'visible' };
  globalThis.requestAnimationFrame = callback => { callbacks.push(callback); return callbacks.length; }; globalThis.cancelAnimationFrame = () => {};
  try {
    let resolved = false; const pending = preparationFrame().then(() => { resolved = true; });
    callbacks.shift()(0); globalThis.document.visibilityState = 'hidden';
    await new Promise(resolve => setTimeout(resolve, 5));
    assert.equal(resolved, false); assert.equal(callbacks.length, 1);
    globalThis.document.visibilityState = 'visible'; callbacks.shift()(16); await pending; assert.equal(resolved, true);
  } finally { globalThis.requestAnimationFrame = oldRAF; globalThis.cancelAnimationFrame = oldCancel; globalThis.document = oldDocument; }
});
test('hidden-tab wall time is excluded from the shader readiness deadline', async () => {
  const f = fixture(1), r = fakeRenderer(f), documentTarget = new EventTarget(); documentTarget.visibilityState = 'visible';
  let time = 0, yields = 0;
  const result = await prepareFirstSwitch({ ...f, renderer: r.renderer, documentTarget, now: () => time, yieldFrame: async () => {
    await r.next();
    if (++yields === 3) {
      documentTarget.visibilityState = 'hidden'; documentTarget.dispatchEvent(new Event('visibilitychange'));
      time += 60000;
      documentTarget.visibilityState = 'visible'; documentTarget.dispatchEvent(new Event('visibilitychange'));
    }
  } });
  assert.equal(result.variants, 4); assertRestored(f, r);
});
test('expensive observed compile slices yield before rendering even when shaders are ready', async () => {
  const f = fixture(1), r = fakeRenderer(f, { parallel: false }); let time = 0;
  const compile = r.renderer.compile; r.renderer.compile = (...args) => { const result = compile(...args); time += 5; return result; };
  await prepareFirstSwitch({ ...f, renderer: r.renderer, yieldFrame: r.next, now: () => time });
  for (let index = 0; index < r.events.length; index++) if (r.events[index] === 'compile') assert.deepEqual(r.events.slice(index, index + 4), ['compile', 'yield', 'draw', 'yield']);
});

test('shared geometry views are counted once per batch but all mesh draws remain', () => {
  const array = new Uint8Array(70), geometry = { attributes: { position: { array }, normal: { array } } };
  const meshes = Array.from({ length: 5 }, () => ({ geometry }));
  assert.deepEqual(preparationBatches(meshes, { meshesPerBatch: 4, geometryBytesPerBatch: 100 }).map(batch => batch.length), [4, 1]);
});

for (const [label, compileCost, drawCost, expectedYields, expectedMaxBatches] of [
  ['cheap ready batches', .125, .25, 53, 4],
  ['expensive ready batches', 2, 2, 193, 1],
]) {
  test(`366-mesh CPU scheduling simulation: ${label} preserves 188 draws`, async () => {
    const f = fixture(366), model = collectPreparationResources(await loadSceneForCPU());
    model.meshes.forEach((mesh, index) => { f.meshes[index].geometry = mesh.geometry; });
    const r = fakeRenderer(f, { parallel: false });
    let time = 0;
    const compile = r.renderer.compile, render = r.renderer.render;
    r.renderer.compile = (...args) => { const value = compile(...args); time += compileCost; return value; };
    r.renderer.render = (...args) => { render(...args); time += drawCost; };
    const result = await prepareFirstSwitch({ ...f, renderer: r.renderer, now: () => time,
      yieldFrame: async () => { await r.next(); time += 1000 / 60; } });
    assert.equal(result.meshes, 366); assert.equal(result.batches, 188);
    assert.equal(result.metrics.compileCalls, 188); assert.equal(result.metrics.seedDraws, 4);
    assert.equal(result.metrics.frameYields, expectedYields);
    assert.equal(result.metrics.maxBatchesPerSlice, expectedMaxBatches);
    assert.ok(result.metrics.maxSliceCpuMilliseconds <= 4.000001);
    assert.equal(result.metrics.compileCpuMilliseconds, 188 * compileCost);
    assert.equal(result.metrics.drawCpuMilliseconds, 192 * drawCost);
    assert.equal(r.variants.size, 4); assertRestored(f, r);
    // A synthetic 60 Hz schedule is a deterministic planning comparison, not FPS evidence.
    const oldYields = 1 + 4 + 188;
    assert.equal(oldYields - result.metrics.frameYields, label.startsWith('cheap') ? 140 : 0);
  });
}

test('adaptive prediction yields before starting a batch that would exceed the CPU target', async () => {
  const f = fixture(32), r = fakeRenderer(f, { parallel: false }); let time = 0;
  const render = r.renderer.render;
  r.renderer.render = (...args) => { render(...args); time += 1.5; };
  const result = await prepareFirstSwitch({ ...f, renderer: r.renderer, now: () => time, yieldFrame: r.next });
  assert.equal(result.metrics.maxBatchesPerSlice, 2);
  assert.equal(result.metrics.maxSliceCpuMilliseconds, 3);
  assert.equal(result.metrics.frameYields, 13);
  assert.equal(result.batches, 16); assertRestored(f, r);
});

test('adaptive grouping remains bounded with a coarse clock and stops on a synchronous abort', async () => {
  const f = fixture(366), controller = new AbortController(); let draws = 0;
  const r = fakeRenderer(f, { parallel: false, checkStage(stage) {
    if (stage.children.some(mesh => mesh.name?.startsWith('original-')) && ++draws === 2) controller.abort(Error('Stop grouped work'));
  } });
  await assert.rejects(prepareFirstSwitch({ ...f, renderer: r.renderer, signal: controller.signal, now: () => 0, yieldFrame: r.next }), /Stop grouped work/);
  assert.equal(draws, 2); assertRestored(f, r);
});

test('progress metrics are immutable snapshots and hidden yields cannot schedule GPU work', async () => {
  const f = fixture(8), r = fakeRenderer(f, { parallel: false }), documentTarget = new EventTarget();
  documentTarget.visibilityState = 'hidden'; const progress = []; let yields = 0;
  const result = await prepareFirstSwitch({ ...f, renderer: r.renderer, documentTarget, now: () => 0,
    onProgress: value => progress.push(value), yieldFrame: async () => {
      await r.next(); if (++yields <= 2) assert.deepEqual(r.events, Array(yields).fill('yield'));
      if (yields === 2) { documentTarget.visibilityState = 'visible'; documentTarget.dispatchEvent(new Event('visibilitychange')); }
    } });
  assert.equal(progress[0].metrics.frameYields, 0);
  assert.deepEqual(progress[0].metrics.yieldReasons, {});
  assert.equal(result.metrics.frameYields, 10);
  assert.equal(progress.at(-1).metrics.frameYields, 10);
  assertRestored(f, r);
});
