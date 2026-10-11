import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gunzipSync } from "fflate";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import { PIANO_KEYS, FURNITURE, isTap, slideState } from "./domain.js";
import { PianoAudio } from "./audio.js";

const $ = (s) => document.querySelector(s),
  canvas = $("#room");
const scene = new THREE.Scene();
scene.background = new THREE.Color("#192b3b");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
} catch (error) {
  $("#loading p").textContent = "这个浏览器暂时无法显示三维空间";
  $("#load-detail").textContent =
    "请使用支持 WebGL 的 Safari 或 Chrome，并开启硬件加速";
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
const pmrem = new THREE.PMREMGenerator(renderer),
  environment = new RoomEnvironment();
scene.environment = pmrem.fromScene(environment, 0.04).texture;
environment.dispose();
pmrem.dispose();
scene.environmentIntensity = 0.18;
const camera = new THREE.PerspectiveCamera(
  innerWidth < innerHeight ? 49 : 40,
  innerWidth / innerHeight,
  0.025,
  150,
);
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 2, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.rotateSpeed = 0.6;
controls.zoomSpeed = 0.7;
controls.panSpeed = 0.8;
controls.minDistance = 0.18;
controls.maxDistance = 42;
controls.minPolarAngle = 0.16;
controls.maxPolarAngle = 1.52;
controls.touches.ONE = THREE.TOUCH.ROTATE;
controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
controls.screenSpacePanning = true;
function initialCamera() {
  const portrait = innerWidth < innerHeight;
  camera.position.set(
    portrait ? 17 : 12,
    portrait ? 14 : 10,
    portrait ? 23 : 15,
  );
  controls.target.set(0, 2, 0);
  controls.update();
}
initialCamera();
const fill = new THREE.HemisphereLight("#bdcfed", "#a49282", 0.46);
scene.add(fill);
const sun = new THREE.DirectionalLight("#fff2df", 0);
sun.position.set(-5, 9, -9);
sun.target.position.set(1, 0, 1.5);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, {
  left: -9,
  right: 9,
  top: 9,
  bottom: -9,
  near: 1,
  far: 32,
});
sun.shadow.bias = -0.0003;
sun.shadow.normalBias = 0.016;
scene.add(sun, sun.target);
const moon = new THREE.DirectionalLight("#aecfff", 0.6);
moon.position.set(-4, 7, -10);
scene.add(moon);
const weatherUniforms = { uRainTime: { value: 0 }, uRainAmount: { value: 1 } };
const lights = [],
  emissions = [],
  cutaways = [],
  animations = [],
  screens = [],
  keyObjects = [];
const nodes = new Map();
let root = null,
  ready = false,
  mode = "night",
  dayValue = 0,
  elapsed = 0,
  reflection = null,
  streetSurface = null;
let initialReadyTime = null;
const audio = new PianoAudio();
const keys = new Map(PIANO_KEYS.map((k) => [k.midi, k]));
const pressed = new Map();
const metrics = {
  frameTimes: [],
  noteEvents: [],
  loadedAt: null,
  errors: [],
  switches: 0,
};
const ray = new THREE.Raycaster(),
  pointer = new THREE.Vector2();
// A shared glTF material is visited by many meshes. Prepare it once so authored
// PBR factors and emission baselines remain stable throughout the traversal.
const preparedMaterials = new WeakSet();
function materialDetail(mat) {
  if (!mat.isMeshStandardMaterial || preparedMaterials.has(mat)) return;
  preparedMaterials.add(mat);
  const name = mat.name.toLowerCase();
  // GLTFLoader already configures UVs, color spaces and normal-map conventions.
  // Preserve Blender's base color, roughness, metalness and normal strength;
  // world-space procedural grain would swim when furniture animates.
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  for (const map of new Set([
    mat.map, mat.normalMap, mat.roughnessMap, mat.metalnessMap, mat.aoMap,
  ])) {
    if (!map) continue;
    map.anisotropy = anisotropy;
    map.needsUpdate = true;
  }
  if (/glass/.test(name)) {
    mat.transparent = true;
    mat.opacity = 0.18;
    mat.depthWrite = false;
    mat.roughness = 0.14;
    mat.envMapIntensity = 0.65;
    if (/window/.test(name)) {
      mat.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, weatherUniforms);
        shader.vertexShader =
          "varying vec2 vRainUv;\n" +
          shader.vertexShader.replace(
            "#include <uv_vertex>",
            "#include <uv_vertex>\nvRainUv=uv;",
          );
        shader.fragmentShader =
          "varying vec2 vRainUv;uniform float uRainTime;uniform float uRainAmount;\n" +
          shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <roughnessmap_fragment>",
          "#include <roughnessmap_fragment>\nvec2 cell=vRainUv*vec2(54.,13.);float id=floor(cell.x);float speed=.2+fract(sin(id*15.73)*482.6)*.45;vec2 drop=fract(cell-vec2(0.,uRainTime*speed));float drip=(1.-smoothstep(0.,.075,abs(drop.x-.5)))*(1.-smoothstep(.05,.6,drop.y));roughnessFactor+=drip*.2*uRainAmount;diffuseColor.a+=drip*.25*uRainAmount;",
        );
      };
    }
  }
  if (/lamp|glow|emiss|light/.test(name) || mat.emissive?.getHex() > 0) {
    emissions.push({
      mat,
      base: Math.max(mat.emissiveIntensity || 0, 0.4),
      exterior: /street|city/.test(name),
    });
  }
}
function addLight(
  name,
  pos,
  power = 30,
  color = "#ffe5c8",
  distance = 7,
  shadow = false,
) {
  const l = shadow
    ? new THREE.SpotLight(color, power, distance, Math.PI * 0.42, 0.7, 2)
    : new THREE.PointLight(color, power, distance, 2);
  if (shadow) {
    l.target.position.set(pos.x, 0, pos.z);
    scene.add(l.target);
  }
  l.position.copy(pos);
  l.castShadow = shadow;
  if (shadow) {
    l.shadow.mapSize.set(512, 512);
    l.shadow.bias = -0.001;
    l.shadow.normalBias = 0.025;
  }
  scene.add(l);
  lights.push({ name, light: l, power });
  return l;
}
function createLighting() {
  const defaults = {
    living: [-1, 2.4, -2, 35],
    piano: [3.5, 2.6, -2.7, 24],
    desk: [4, 1.7, 0.5, 13],
    kitchen: [-3.8, 2.5, 2.6, 24],
    dining: [-2.8, 2.6, 1.2, 22],
    bed: [-3.1, 4.1, 2.5, 16],
    reading: [2.7, 4.3, 0.1, 20],
    entry: [3.5, 2, 3.2, 12],
    bath: [0.4, 2.4, 3, 15],
    stairs: [-4.3, 2.5, -1, 18],
  };
  for (const [name, xyz] of Object.entries(defaults)) {
    const anchor = nodes.get(`light_${name}`);
    const pos = anchor
      ? anchor.getWorldPosition(new THREE.Vector3())
      : new THREE.Vector3(...xyz.slice(0, 3));
    addLight(
      name,
      pos,
      xyz[3],
      "#ffe5c8",
      name === "living" ? 8 : 5,
      name === "living" || name === "piano",
    );
  }
}
const textureLoader = new THREE.TextureLoader();
async function texture(path) {
  const t = await textureLoader.loadAsync(path);
  t.colorSpace = THREE.SRGBColorSpace;
  t.flipY = false;
  t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  return t;
}
function screenMaterial(textures) {
  const uniforms = {
    nextMap: { value: textures[1] || textures[0] },
    blend: { value: 0 },
    brightness: { value: 0.82 },
  };
  const material = new THREE.MeshBasicMaterial({
    map: textures[0],
    toneMapped: false,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader =
      "uniform sampler2D nextMap; uniform float blend; uniform float brightness;\n" +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      "#ifdef USE_MAP\nvec4 texelA=texture2D(map,vMapUv);vec4 texelB=texture2D(nextMap,vMapUv);diffuseColor *= mix(texelA,texelB,blend);diffuseColor.rgb *= brightness;\n#endif",
    );
  };
  return { material, uniforms };
}
async function setupImages() {
  const groups = [
    ["screen_PC", "pc", 6, 16, 0],
    ["screen_TV", "tv", 4, 23, 7],
  ];
  await Promise.all(
    groups.map(async ([node, prefix, count, hold, offset]) => {
      const imgs = await Promise.all(
        Array.from({ length: count }, (_, i) =>
          texture(
            `/assets/textures/${prefix}-${String(i + 1).padStart(2, "0")}.webp`,
          ),
        ),
      );
      const object = nodes.get(node);
      if (!object) throw Error(`缺少屏幕模型 ${node}`);
      const { material, uniforms } = screenMaterial(imgs);
      object.material = material;
      screens.push({ object, imgs, material, uniforms, hold, offset });
    }),
  );
  await Promise.all(
    [1, 2, 3].map(async (i) => {
      const obj = nodes.get(`frame_${String(i).padStart(2, "0")}`);
      if (!obj) throw Error(`缺少相框画面 ${i}`);
      obj.material = new THREE.MeshStandardMaterial({
        map: await texture(
          `/assets/textures/frame-${String(i).padStart(2, "0")}.webp`,
        ),
        roughness: 0.83,
      });
    }),
  );
}
function registerAnimations() {
  const specs = [
    ["anim_sofa_edge", "cloth", "y", 0.0035, 11, 1],
    [
      "anim_chair_swivel",
      "rotation",
      "y",
      THREE.MathUtils.degToRad(5.5),
      13,
      2,
    ],
    ["anim_dining_edge", "cloth", "y", 0.0035, 10, 3],
    ["anim_bed_edge", "cloth", "y", 0.004, 12, 4],
    ["anim_rocker", "rotation", "z", THREE.MathUtils.degToRad(1.5), 9, 1.5],
    ["anim_fan_head", "rotation", "y", THREE.MathUtils.degToRad(15), 16, 3.5],
    [
      "anim_purifier_louver",
      "rotation",
      "x",
      THREE.MathUtils.degToRad(7),
      14,
      4.5,
    ],
    ["anim_clock_pendulum", "rotation", "z", 0.14, 2, 0],
    ["anim_hood_fan", "spin", "z", 1.8, 1, 0],
    ["anim_fan_blades", "spin", "z", 4, 1, 0],
    ...[1, 2, 3].map((i) => [
      `anim_pc_fan_0${i}`,
      "spin",
      "z",
      3.2 + i * 0.2,
      1,
      0,
    ]),
  ];
  for (const [name, type, axis, amp, period, phase] of specs) {
    const obj = nodes.get(name);
    if (obj) {
      const actualAxis = obj.userData.animationAxis || axis;
      if (type === "cloth" && obj.isMesh) {
        obj.geometry = obj.geometry.clone();
        obj.geometry.computeBoundingBox();
        obj.userData.restVertices =
          obj.geometry.attributes.position.array.slice();
      }
      animations.push({
        name,
        obj,
        type,
        axis: actualAxis,
        amp,
        period,
        phase,
        base: obj[type === "position" ? "position" : "rotation"][actualAxis],
      });
    }
  }
}
let rain, rainPositions;
function createWeather() {
  const count = 560,
    geo = new THREE.BufferGeometry();
  rainPositions = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 15 - 7.5,
      y = Math.random() * 9,
      z = -4.25 - Math.random() * 7;
    rainPositions.set([x, y, z, x - 0.015, y - 0.12, z], i * 6);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
  rain = new THREE.LineSegments(
    geo,
    new THREE.LineBasicMaterial({
      color: "#c9deed",
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    }),
  );
  rain.frustumCulled = false;
  scene.add(rain);
}
function createReflection() {
  const street = [...nodes.values()].find(
    (o) => o.isMesh && /wet_ground|street_ground|street_road/.test(o.name),
  );
  if (!street) return;
  streetSurface = street;
  street.material.roughness = 0.17;
  street.material.metalness = 0.42;
  const refl = new Reflector(street.geometry, {
    textureWidth: 512,
    textureHeight: 512,
    color: 0x536276,
    clipBias: 0.004,
  });
  street.updateWorldMatrix(true, false);
  refl.matrix.copy(street.matrixWorld);
  refl.matrix.elements[13] += 0.008; // Separate reflection layer from the opaque road.
  refl.matrixAutoUpdate = false;
  refl.material.transparent = true;
  refl.material.uniforms.uReflectionOpacity = { value: 0.32 };
  refl.material.fragmentShader =
    "uniform float uReflectionOpacity;\n" +
    refl.material.fragmentShader.replace(
      "blendOverlay( base.rgb, color ), 1.0",
      "blendOverlay( base.rgb, color ), uReflectionOpacity",
    );
  refl.material.depthWrite = false;
  refl.renderOrder = 2;
  scene.add(refl);
  reflection = refl;
}
function loadProgress(ratio, text) {
  $("#load-progress").style.width = `${ratio * 100}%`;
  if (text) $("#load-detail").textContent = text;
}
async function load() {
  try {
    loadProgress(0.07);
    const response = await fetch("/assets/bearroom.glb.gz");
    if (!response.ok) throw new Error(`模型载入失败 ${response.status}`);
    const total = Number(response.headers.get("content-length")) || 0;
    const reader = response.body?.getReader();
    let compressed;
    if (reader) {
      const chunks = [];
      let received = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total) loadProgress(0.08 + (0.6 * received) / total);
      }
      compressed = new Uint8Array(received);
      let offset = 0;
      for (const chunk of chunks) {
        compressed.set(chunk, offset);
        offset += chunk.length;
      }
    } else compressed = new Uint8Array(await response.arrayBuffer());
    const bytes =
      compressed[0] === 0x1f && compressed[1] === 0x8b
        ? gunzipSync(compressed)
        : compressed;
    loadProgress(0.72, "整理家具与光线");
    const gltf = await new GLTFLoader().parseAsync(
      bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      "/assets/",
    );
    root = gltf.scene;
    scene.add(root);
    root.traverse((o) => {
      nodes.set(o.name, o);
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (o.name === "window_glass") {
          o.material = o.material.clone();
          o.material.name = "window_glass";
        }
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const mat of mats) materialDetail(mat);
        if (mats.some((m) => /glass/i.test(m.name))) o.castShadow = false;
        if (/^piano_key_\d{3}$/.test(o.name)) {
          const midi = Number(o.name.slice(-3));
          o.userData.midi = midi;
          o.userData.restRotation = o.rotation.x;
          keyObjects.push(o);
        }
        if (/cutaway|wall_south|wall_east|mezzanine_slab/.test(o.name)) {
          o.material = o.material.clone();
          cutaways.push(o);
        }
      }
    });
    if (keyObjects.length !== 88)
      throw Error(`琴键资产不完整（${keyObjects.length}/88）`);
    registerAnimations();
    createLighting();
    createWeather();
    createReflection();
    loadProgress(0.78, "载入小熊画作");
    await setupImages();
    loadProgress(1, "一切就绪");
    ready = true;
    initialReadyTime = performance.now();
    metrics.loadedAt = initialReadyTime;
    $("#loading").classList.add("hidden");
    setTimeout(() => $("#loading").remove(), 1000);
  } catch (e) {
    metrics.errors.push(String(e));
    $("#load-detail").textContent = "载入未完成，请刷新重试";
    $("#loading p").textContent = "小熊的家暂时没有准备好";
    console.error(e);
  }
}
function setMode(next) {
  mode = next;
  metrics.switches++;
  $("#night").classList.toggle("selected", next === "night");
  $("#day").classList.toggle("selected", next === "day");
  $("#night").setAttribute("aria-pressed", String(next === "night"));
  $("#day").setAttribute("aria-pressed", String(next === "day"));
}
$("#night").onclick = () => setMode("night");
$("#day").onclick = () => setMode("day");
$("#sound").onclick = () => {
  audio.setMuted(!audio.muted);
  $("#sound").setAttribute("aria-pressed", String(audio.muted));
  $("#sound").setAttribute("aria-label", audio.muted ? "开启声音" : "静音");
  $("#sound").firstChild.textContent = audio.muted ? "♩" : "♫";
};
$("#help").onclick = () => $("#help-dialog").showModal();
$(".close").onclick = () => $("#help-dialog").close();
$("#help-dialog").onclick = (e) => {
  if (e.target === $("#help-dialog")) $("#help-dialog").close();
};
const active = new Set();
let gesture = null;
canvas.addEventListener(
  "pointerdown",
  (e) => {
    active.add(e.pointerId);
    if (active.size > 1) {
      if (gesture) gesture.multi = true;
      return;
    }
    gesture = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
      distance: 0,
      multi: false,
      cancelled: false,
      camera: camera.position.clone(),
      target: controls.target.clone(),
    };
  },
  { capture: true },
);
canvas.addEventListener(
  "pointermove",
  (e) => {
    if (gesture && e.pointerId === gesture.id)
      gesture.distance = Math.max(
        gesture.distance,
        Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y),
      );
  },
  { capture: true },
);
canvas.addEventListener(
  "pointerup",
  (e) => {
    active.delete(e.pointerId);
    if (!gesture || e.pointerId !== gesture.id) return;
    gesture.duration = performance.now() - gesture.time;
    if (isTap(gesture) && e.button === 0 && ready) {
      const rect = canvas.getBoundingClientRect();
      pointer.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        (-(e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      ray.setFromCamera(pointer, camera);
      const hits = ray.intersectObject(root, true).filter((hit) => {
        const mat = Array.isArray(hit.object.material)
          ? hit.object.material[hit.face?.materialIndex || 0]
          : hit.object.material;
        return mat && mat.opacity > 0.3 && !/glass/i.test(mat.name);
      });
      if (hits.length && hits[0].object.userData.midi) {
        camera.position.copy(gesture.camera);
        controls.target.copy(gesture.target);
        playKey(hits[0].object.userData.midi);
      }
    }
    gesture = null;
  },
  { capture: true },
);
canvas.addEventListener("pointercancel", (e) => {
  active.delete(e.pointerId);
  if (gesture) gesture.cancelled = true;
});
window.addEventListener("blur", () => {
  active.clear();
  gesture = null;
});
canvas.addEventListener("webglcontextlost", (e) => {
  e.preventDefault();
  metrics.errors.push("WebGL context lost");
  $("#note").textContent = "画面暂时中断，正在恢复";
  $("#note").classList.add("show");
});
canvas.addEventListener("webglcontextrestored", () => {
  $("#note").textContent = "画面已恢复";
  setTimeout(() => $("#note").classList.remove("show"), 2000);
});
function playKey(midi) {
  const obj = keyObjects.find((k) => k.userData.midi === midi);
  if (!obj) return;
  pressed.set(midi, { obj, time: performance.now() });
  audio.play(midi);
  metrics.noteEvents.push({ midi, time: performance.now() });
  $("#note").textContent = keys.get(midi).name;
  $("#note").classList.add("show");
  clearTimeout(window.noteTimer);
  window.noteTimer = setTimeout(() => $("#note").classList.remove("show"), 800);
}
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.fov = innerWidth < innerHeight ? 49 : 40;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
const previousCamera = camera.position.clone(),
  collisionRay = new THREE.Raycaster();
let last = performance.now();
const darkColor = new THREE.Color("#192b3b"),
  dayColor = new THREE.Color("#afc8d3");
function tick(now) {
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, (now - last) / 1000);
  if (ready && document.visibilityState === "visible") {
    metrics.frameTimes.push(now - last);
    if (metrics.frameTimes.length > 40000) metrics.frameTimes.shift();
  }
  last = now;
  elapsed += dt;
  weatherUniforms.uRainTime.value = elapsed;
  weatherUniforms.uRainAmount.value = 1 - dayValue;
  dayValue = THREE.MathUtils.damp(dayValue, mode === "day" ? 1 : 0, 2.7, dt);
  scene.background.copy(darkColor).lerp(dayColor, dayValue);
  // Keep broad fill restrained: warm lamps model textile relief at night,
  // and neutral sunlight leaves blush/cream colors legible in the daytime.
  fill.intensity = THREE.MathUtils.lerp(0.46, 1.15, dayValue);
  sun.intensity = 3.6 * dayValue;
  moon.intensity = 0.55 * (1 - dayValue);
  scene.environmentIntensity = 0.18 + 0.18 * dayValue;
  renderer.toneMappingExposure = 1.1 - 0.1 * dayValue;
  for (const { light, power } of lights)
    light.intensity = power * (1 - 0.91 * dayValue);
  for (const { mat, base, exterior } of emissions)
    mat.emissiveIntensity = base * (1 - (exterior ? 1 : 0.73) * dayValue);
  if (streetSurface) {
    streetSurface.material.roughness = 0.17 + 0.61 * dayValue;
    streetSurface.material.metalness = 0.42 * (1 - dayValue);
  }
  if (ready) {
    for (const a of animations) {
      const value =
        a.type === "spin"
          ? elapsed * a.amp
          : Math.sin((elapsed * Math.PI * 2) / a.period + a.phase) * a.amp;
      if (a.type === "cloth") {
        const attr = a.obj.geometry.attributes.position,
          bounds = a.obj.geometry.boundingBox,
          rest = a.obj.userData.restVertices;
        for (let j = 0; j < attr.count; j++) {
          const weight = THREE.MathUtils.smoothstep(
            rest[j * 3 + 2],
            bounds.max.z - (bounds.max.z - bounds.min.z) * 0.25,
            bounds.max.z,
          );
          attr.array[j * 3 + 1] = rest[j * 3 + 1] + value * weight;
        }
        attr.needsUpdate = true;
      } else
        a.obj[a.type === "position" ? "position" : "rotation"][a.axis] =
          a.base + value;
    }
    for (const [n, period] of [
      ["anim_clock_second", 60],
      ["anim_clock_minute", 3600],
      ["anim_clock_hour", 43200],
    ]) {
      const o = nodes.get(n);
      if (o) o.rotation.z = (-elapsed * Math.PI * 2) / period;
    }
    for (const s of screens) {
      const state = slideState(elapsed, s.imgs.length, s.hold, s.offset);
      s.material.map = s.imgs[state.index];
      s.uniforms.nextMap.value = s.imgs[state.next];
      s.uniforms.blend.value = state.mix;
      s.uniforms.brightness.value = 0.78 + 0.22 * dayValue;
    }
    for (const [midi, p] of pressed) {
      const t = (now - p.time) / 1000;
      p.obj.rotation.x =
        p.obj.userData.restRotation -
        Math.sin(Math.min(1, t / 0.32) * Math.PI) * 0.045;
      if (t > 0.32) {
        p.obj.rotation.x = p.obj.userData.restRotation;
        pressed.delete(midi);
      }
    }
    rain.visible = dayValue < 0.99;
    rain.material.opacity = 0.28 * (1 - dayValue);
    if (rain.visible) {
      for (let i = 0; i < rainPositions.length; i += 6) {
        rainPositions[i + 1] -= dt * 4;
        rainPositions[i + 4] -= dt * 4;
        if (rainPositions[i + 1] < -0.05) {
          rainPositions[i + 1] += 9;
          rainPositions[i + 4] += 9;
        }
      }
      rain.geometry.attributes.position.needsUpdate = true;
    }
    if (reflection) {
      reflection.visible = dayValue < 0.97;
      reflection.material.uniforms.uReflectionOpacity.value =
        0.32 * (1 - dayValue);
    }
    updateCutaway(dt);
  }
  controls.target.x = THREE.MathUtils.clamp(controls.target.x, -5, 5);
  controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0.15, 5.6);
  controls.target.z = THREE.MathUtils.clamp(controls.target.z, -4.2, 4.2);
  controls.update();
  if (ready) {
    const delta = camera.position.clone().sub(previousCamera),
      distance = delta.length();
    if (distance > 0.0001 && distance < 3) {
      collisionRay.set(previousCamera, delta.normalize());
      collisionRay.far = distance + 0.07;
      const hit = collisionRay.intersectObject(root, true).find((h) => {
        const m = Array.isArray(h.object.material)
          ? h.object.material[0]
          : h.object.material;
        return (
          m && m.opacity > 0.8 && !/glass|cutaway|wall_/i.test(h.object.name)
        );
      });
      if (hit)
        camera.position
          .copy(previousCamera)
          .addScaledVector(delta, Math.max(0, hit.distance - 0.075));
    }
  }
  previousCamera.copy(camera.position);
  renderer.render(scene, camera);
}
function updateCutaway(dt) {
  for (const o of cutaways) {
    const slab = /slab|mezzanine|upper_finish|upper_rug/.test(o.name);
    const pos = o.getWorldPosition(new THREE.Vector3());
    const shouldFade = slab
      ? controls.target.y < 2.8 && camera.position.y > 3.2
      : (/south/.test(o.name) && camera.position.z > pos.z) ||
        (/east/.test(o.name) && camera.position.x > pos.x) ||
        (/west/.test(o.name) && camera.position.x < pos.x) ||
        (/bathroom/.test(o.name) && controls.target.z > 1.5);
    const desired = shouldFade ? (slab ? 0.16 : 0.07) : 1;
    o.material.transparent = true;
    o.material.opacity = THREE.MathUtils.damp(
      o.material.opacity,
      desired,
      6,
      dt,
    );
    o.material.depthWrite = o.material.opacity > 0.5;
    o.castShadow = true;
  }
}
if (import.meta.env.DEV)
  window.__bearroom = {
    get ready() {
      return ready;
    },
    get mode() {
      return mode;
    },
    get metrics() {
      return metrics;
    },
    get camera() {
      return {
        position: camera.position.toArray(),
        target: controls.target.toArray(),
        fov: camera.fov,
        aspect: camera.aspect,
      };
    },
    get assets() {
      return [...nodes.keys()];
    },
    get animations() {
      return animations.map((a) => a.name);
    },
    get keyCount() {
      return keyObjects.length;
    },
    get furniture() {
      return FURNITURE;
    },
    get screens() {
      return screens.map((s) => ({
        name: s.object.name,
        index: slideState(elapsed, s.imgs.length, s.hold, s.offset).index,
        count: s.imgs.length,
      }));
    },
    setMode,
    playKey,
    setCamera(position, target) {
      camera.position.fromArray(position);
      controls.target.fromArray(target);
      controls.update();
    },
    projectKey(midi) {
      const o = keyObjects.find((k) => k.userData.midi === midi);
      if (!o) return null;
      const b = new THREE.Box3().setFromObject(o);
      const v = b.getCenter(new THREE.Vector3());
      v.y = b.max.y;
      v.project(camera);
      return {
        x: ((v.x + 1) * innerWidth) / 2,
        y: ((1 - v.y) * innerHeight) / 2,
      };
    },
    get audioEvents() {
      return audio.events;
    },
    report() {
      const sorted = [...metrics.frameTimes].sort((a, b) => a - b);
      return {
        ready,
        mode,
        keyCount: keyObjects.length,
        furniture: FURNITURE.length,
        animated: FURNITURE.filter((f) => f.animated).length,
        frames: sorted.length,
        averageFPS: sorted.length
          ? 1000 / (sorted.reduce((s, n) => s + n, 0) / sorted.length)
          : 0,
        p95: sorted[Math.floor(sorted.length * 0.95)],
        renderer: renderer.info,
        userAgent: navigator.userAgent,
        viewport: [innerWidth, innerHeight],
        pixelRatio: renderer.getPixelRatio(),
        physicalMobile: "未验证",
        errors: metrics.errors,
      };
    },
  };
window.addEventListener("error", (e) => metrics.errors.push(e.message));
window.addEventListener("unhandledrejection", (e) =>
  metrics.errors.push(String(e.reason)),
);
requestAnimationFrame(tick);
load();
// Optional page-native tools use the same lighting state as the two visible buttons.
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
  for (const tool of [
    {
      name: "get_room_state",
      description:
        "Read whether the bearroom has loaded and its current day or rainy-night lighting.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => ({ loaded: ready, lighting: mode, muted: audio.muted }),
    },
    {
      name: "set_room_lighting",
      description:
        "Switch the visible bearroom to sunny day or rainy night, keeping the camera and animations.",
      inputSchema: {
        type: "object",
        properties: { lighting: { type: "string", enum: ["day", "night"] } },
        required: ["lighting"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: async (input) => {
        if (
          !input ||
          !["day", "night"].includes(input.lighting) ||
          Object.keys(input).some((k) => k !== "lighting")
        )
          throw new Error("lighting must be day or night");
        if (!ready) throw new Error("Room is still loading");
        setMode(input.lighting);
        await new Promise((r) => setTimeout(r, 1800));
        return { lighting: mode };
      },
    },
  ]) {
    try {
      Promise.resolve(
        document.modelContext.registerTool(tool, { signal: lifecycle.signal }),
      ).catch((e) => console.warn("Optional page tools unavailable", e));
    } catch (e) {
      console.warn("Optional page tools unavailable", e);
    }
  }
}
