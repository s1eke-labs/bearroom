/** Recovered from production v11. Minifier aliases are retained deliberately; this is not the lost original source.
 * Exact pre-recovery segment SHA256: 0c85105a67953f02ea2cf4b5173af32b168a0e1c3504741ec8394d0fdaa23351
 */
import './polyfill.js';
import './style.css';
import { Qc, eh, yt, Zu, en, Ee, L, Kt, we, ii, Mh, Ai, Dh, gf, Ih, tl, Gr, nl, Lf, wo, g0, x0, X0, j0, Cx } from '../vendor/runtime-v11.js';
import { Do, Dx, Ix, Ox } from './camera.js';
import { Bx, kx, zx } from './domain.js';
import { Hx } from './audio.js';
import { Vx, Wx, Xx } from './lighting.js';
import { qx, Yx, jx, Kx, Na } from './performance.js';
import { Qx } from './plush-current.js';
import { Io, sv } from './baked-gi.js';
import { FirstPersonController } from './first-person.js';
import { PcCaseController, PC_CASE_CONFIG } from './pc-case.js';
import { prepareFirstSwitch, preparationFrame } from './first-switch-preparation.js';
import { RoomInteractions, roomHitIsVisible, sceneTapEndsOnCanvas } from './room-interactions.js';
const Ge = (i) => document.querySelector(i), bn = Ge("#room"), jt = new Mh();
jt.background = new we("#192b3b");
let Ot;
try {
  Ot = new g0({ canvas: bn, antialias: true, powerPreference: "high-performance" });
} catch (i) {
  throw Ge("#loading p").textContent = "这个浏览器暂时无法显示三维空间", Ge("#load-detail").textContent = "请使用支持 WebGL 的 Safari 或 Chrome，并开启硬件加速", i;
}
Ot.setPixelRatio(Math.min(devicePixelRatio, 1.65));
Ot.setSize(innerWidth, innerHeight);
Ot.shadowMap.enabled = true;
Ot.shadowMap.type = Qc;
Ot.outputColorSpace = yt;
Ot.toneMapping = eh;
Ot.toneMappingExposure = 1.1;
const $h = new wo(Ot), Jh = new Cx();
jt.environment = $h.fromScene(Jh, 0.04).texture;
Jh.dispose();
$h.dispose();
jt.environmentIntensity = 0.18;
Ot.localClippingEnabled = true;
const Rt = new Gr(-12, 12, 10, -10, 0.1, 100), tn = new x0(Rt, bn);
Ix(tn);
Rt.position.set(20, 20, 20);
tn.target.set(0, 2.8, 0);
tn.update();
let pt, Nr, Fr;
let walk = null;
let pcCase = null;
let roomInteractions = null;
let preparationAbort = new AbortController();
let graphicsAvailable = true, contextWasReady = false;
setRoomReady(false);
const Qh = new gf("#bdcfed", "#a49282", 0.46);
jt.add(Qh);
const It = new nl("#fff0df", 0);
It.position.set(7, 6.4, 2);
It.target.position.set(-1.2, 0, 0.4);
It.castShadow = true;
It.shadow.autoUpdate = false;
It.shadow.mapSize.set(2048, 2048);
Object.assign(It.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 32 });
It.shadow.bias = -3e-4;
It.shadow.normalBias = 0.016;
jt.add(It, It.target);
const ol = new nl("#aecfff", 0.6);
ol.position.set(-4, 7, -10);
jt.add(ol);
const Uo = [], eu = [], tu = [], No = [], Rr = [], wi = /* @__PURE__ */ new Map(), nu = [];
let Ei = true, qc = -1 / 0;
const rv = 1 / 30;
let Qn = null, cs = false, Or = "night", _n = 0, _i = 0, Yc = null;
const Mi = new Hx(), av = new Map(Bx.map((i) => [i.midi, i])), Fo = /* @__PURE__ */ new Map(), oi = { frameTimes: new qx(), noteEvents: [], loadedAt: null, errors: [], switches: 0 }, jc = new Lf(), Kc = new Ee(), Zc = /* @__PURE__ */ new WeakSet();
function ov(i) {
  if (!i.isMeshStandardMaterial || Zc.has(i)) return;
  Zc.add(i);
  const e = i.name.toLowerCase(), t = Math.min(8, Ot.capabilities.getMaxAnisotropy());
  for (const n of /* @__PURE__ */ new Set([i.map, i.normalMap, i.roughnessMap, i.metalnessMap, i.aoMap])) n && (n.anisotropy = t, n.needsUpdate = true);
  /glass/.test(e) && (i.transparent = true, i.opacity = 0.18, i.depthWrite = false, i.roughness = 0.14, i.envMapIntensity = 0.65), (/lamp|glow|emiss|light/.test(e) || i.emissive?.getHex() > 0) && eu.push({ mat: i, base: Math.max(i.emissiveIntensity || 0, 0.4), exterior: /street|city/.test(e) });
}
function lv(i, e, t = 30, n = "#ffe5c8", s = 7, r = false, a = null) {
  const o = r ? new Ih(n, t, s, Math.PI * 0.42, 0.7, 2) : new tl(n, t, s, 2);
  return r && (o.target.position.fromArray(Wx(e.toArray(), a)), jt.add(o.target)), o.position.copy(e), o.castShadow = r, r && (o.shadow.autoUpdate = false, o.shadow.mapSize.set(512, 512), o.shadow.bias = -1e-3, o.shadow.normalBias = 0.025), jt.add(o), Uo.push({ name: i, light: o, power: t }), o;
}
function cv() {
  for (const [i, e] of Object.entries(Vx)) {
    const t = wi.get(`light_${i}`), n = t ? t.getWorldPosition(new L()) : new L(...e.fallback), s = e.focus ? wi.get(e.focus) : null, r = s ? new Kt().setFromObject(s, true).getCenter(new L()).toArray() : null;
    lv(i, n, e.power, e.color || "#ffe7cc", e.distance, !!e.shadow, r);
  }
}
const hv = new Dh();
async function $c(i) {
  const e = await hv.loadAsync(i);
  return e.colorSpace = yt, e.flipY = false, e.anisotropy = Math.min(4, Ot.capabilities.getMaxAnisotropy()), e;
}
function uv(i) {
  const e = { nextMap: { value: i[1] || i[0] }, blend: { value: 0 }, brightness: { value: 0.82 } }, t = new ii({ map: i[0], toneMapped: false });
  return t.onBeforeCompile = (n) => {
    Object.assign(n.uniforms, e), n.fragmentShader = `uniform sampler2D nextMap; uniform float blend; uniform float brightness;
` + n.fragmentShader, n.fragmentShader = n.fragmentShader.replace("#include <map_fragment>", `#ifdef USE_MAP
vec4 texelA=texture2D(map,vMapUv);vec4 texelB=texture2D(nextMap,vMapUv);diffuseColor *= mix(texelA,texelB,blend);diffuseColor.rgb *= brightness;
#endif`);
  }, { material: t, uniforms: e };
}
async function dv() {
  const i = [["screen_PC", "pc", 6, 16, 0], ["screen_TV", "tv", 4, 23, 7]];
  await Promise.all(i.map(async ([e, t, n, s, r]) => {
    const a = await Promise.all(Array.from({ length: n }, (u, h) => $c(`/assets/textures/${t}-${String(h + 1).padStart(2, "0")}.webp`))), o = wi.get(e);
    if (!o) throw Error(`缺少屏幕模型 ${e}`);
    const { material: l, uniforms: c } = uv(a);
    o.material = l, No.push({ object: o, imgs: a, material: l, uniforms: c, hold: s, offset: r });
  })), await Promise.all([1, 2, 3].map(async (e) => {
    const t = wi.get(`frame_${String(e).padStart(2, "0")}`);
    if (!t) throw Error(`缺少相框画面 ${e}`);
    t.material = new Ai({ map: await $c(`/assets/textures/frame-${String(e).padStart(2, "0")}.webp`), roughness: 0.83 });
  }));
}
function fv() {
  const i = [["anim_sofa_edge", "cloth", "y", 35e-4, 11, 1], ["anim_chair_swivel", "rotation", "y", en.degToRad(5.5), 13, 2], ["anim_dining_edge", "cloth", "y", 35e-4, 10, 3], ["anim_bed_edge", "cloth", "y", 4e-3, 12, 4], ["anim_rocker", "rotation", "z", en.degToRad(1.5), 9, 1.5], ["anim_fan_head", "rotation", "y", en.degToRad(15), 16, 3.5], ["anim_purifier_louver", "rotation", "x", en.degToRad(7), 14, 4.5], ["anim_clock_pendulum", "rotation", "z", 0.14, 2, 0], ["anim_hood_fan", "spin", "z", 1.8, 1, 0], ["anim_fan_blades", "spin", "z", 4, 1, 0], ...[1, 2, 3].map((e) => [`anim_pc_fan_0${e}`, "spin", "z", 3.2 + e * 0.2, 1, 0])];
  for (const [e, t, n, s, r, a] of i) {
    const o = wi.get(e);
    if (o) {
      const l = o.userData.animationAxis || n;
      if (t === "cloth" && o.isMesh) {
        o.geometry = o.geometry.clone(), o.geometry.computeBoundingBox();
        const c = o.geometry.attributes.position;
        c.setUsage(Zu);
        const u = o.geometry.boundingBox;
        o.userData.cloth = Yx(c.array, u.min.z, u.max.z), u.expandByScalar(s), o.geometry.computeBoundingSphere(), o.geometry.boundingSphere.radius += s;
      }
      tu.push({ name: e, obj: o, type: t, axis: l, amp: s, period: r, phase: a, base: o[t === "position" ? "position" : "rotation"][l] });
    }
  }
}
function ji(i, e) {
  Ge("#load-progress").style.width = `${i * 100}%`, e && (Ge("#load-detail").textContent = e);
}
async function pv() {
  try {
    ji(0.07);
    const i = await fetch(`/assets/bearroom.glb.gz?rev=${Io.slice(0, 16)}`);
    if (!i.ok) throw new Error(`模型载入失败 ${i.status}`);
    const e = Number(i.headers.get("content-length")) || 0, t = i.body?.getReader();
    let n;
    if (t) {
      const a = [];
      let o = 0;
      for (; ; ) {
        const { done: c, value: u } = await t.read();
        if (c) break;
        a.push(u), o += u.length, e && ji(0.08 + 0.6 * o / e);
      }
      n = new Uint8Array(o);
      let l = 0;
      for (const c of a) n.set(c, l), l += c.length;
    } else n = new Uint8Array(await i.arrayBuffer());
    const s = n[0] === 31 && n[1] === 139 ? X0(n) : n;
    if (ji(0.72, "整理家具与光线"), Qn = (await new j0().parseAsync(s.byteOffset === 0 && s.byteLength === s.buffer.byteLength ? s.buffer : s.buffer.slice(s.byteOffset, s.byteOffset + s.byteLength), "/assets/")).scene, Qn.getObjectByName("Exterior_city")?.removeFromParent(), jt.add(Qn), pt = new Ox(Qn, Rt, tn), pt.applyCutaway(), pt.fit(innerWidth, innerHeight), Qn.traverse((a) => {
      if (wi.set(a.name, a), a.isMesh) {
        a.castShadow = a.userData.noShadowCaster !== true, a.receiveShadow = true, a.name === "window_glass" && (a.material = a.material.clone(), a.material.name = "window_glass");
        const o = Array.isArray(a.material) ? a.material : [a.material];
        for (const l of o) ov(l);
        if (o.some((l) => /glass/i.test(l.name)) && (a.castShadow = false), /^piano_key_\d{3}$/.test(a.name)) {
          const l = Number(a.name.slice(-3));
          a.userData.midi = l, a.userData.restRotation = a.rotation.x, Rr.push(a);
        }
      }
    }), Nr = new Qx(Qn, pt.frame.up), Nr.update(Rt, innerHeight, pt.view), Rr.length !== 88) throw Error(`琴键资产不完整（${Rr.length}/88）`);
    for (const [a, o] of [["anim_clock_second", 60], ["anim_clock_minute", 3600], ["anim_clock_hour", 43200]]) {
      const l = wi.get(a);
      l && nu.push({ object: l, period: o });
    }
    fv(), cv(), ji(0.78, "载入小熊画作"), await dv(), pcCase = wi.has(PC_CASE_CONFIG.screenName) ? new PcCaseController(Qn, { wallpaper: await $c(PC_CASE_CONFIG.wallpaperUrl), genericEmissives: eu }) : null, ji(0.92, "载入烘焙间接光"), Fr = await sv(Qn), Fr.setDay(_n), pt.applyCutaway(), Kx(jt), initializeWalk(), setRoomReady(false), ji(0.94, "准备楼层与昼夜光照"), oi.preparation = await prepareFirstSwitch({
      renderer: Ot, scene: jt, camera: Rt, daylight: It, signal: preparationAbort.signal,
      extraTextures: [...No.flatMap(screen => screen.imgs), ...Fr.textures],
      onProgress: ({ phase, completed, total }) => ji(0.94 + 0.055 * completed / Math.max(1, total), phase === "textures" ? "准备材质与纹理" : "准备楼层与昼夜光照"),
    }), await finishRoomPreparation(), ji(1, "一切就绪"), Yc = performance.now(), oi.loadedAt = Yc, Ge("#loading").classList.add("hidden"), Ge("#loading").setAttribute("aria-hidden", "true");
  } catch (i) {
    cs = false, setRoomReady(false), oi.errors.push(String(i)), Ge("#load-detail").textContent = "载入未完成，请刷新重试", Ge("#loading p").textContent = "小熊的家暂时没有准备好", console.error(i);
  }
}
function setRoomReady(ready) {
  tn.enabled = ready && !walk?.active;
  walk?.setInputEnabled(ready);
  for (const button of document.querySelectorAll("#night, #day, [data-view], #walk-toggle, #zoom-in, #zoom-out, #reset-view")) button.disabled = !ready;
  bn.setAttribute("aria-busy", String(!ready));
}
async function finishRoomPreparation() {
  for (;;) {
    await preparationFrame(preparationAbort.signal);
    // Refit for the latest size; resize events cannot disturb the temporary GPU viewport.
    Ot.setSize(innerWidth, innerHeight);
    walk?.resize(innerWidth, innerHeight);
    if (!walk?.active) pt.fit(innerWidth, innerHeight, { reset: false });
    Ei = true; kr = true;
    // Warm-up batches leave partial shadow maps. The original frame loop must draw
    // the complete restored scene before controls are enabled or loading disappears.
    cancelAnimationFrame(Hs); Hs = null; Cr = performance.now(); cs = true;
    const rendered = vv(Cr);
    if (!rendered) { cs = false; continue; }
    if (Ot.getContext().isContextLost() || preparationAbort.signal.aborted) throw new Error("WebGL interrupted before room readiness");
    setRoomReady(true);
    return;
  }
}
function initializeWalk() {
  walk?.dispose();
  walk = new FirstPersonController({
    root: Qn, scene: jt, room: pt, isometricCamera: Rt, orbitControls: tn, canvas: bn,
    app: Ge("#app"), toggleButton: Ge("#walk-toggle"), joystick: Ge("#walk-stick"),
    joystickKnob: Ge("#walk-stick-knob"), hint: Ge("#hint"), status: Ge("#view-status"),
    doorButton: Ge("#walk-door"),
    onChange: () => { Xr(); Ei = true; },
    onTap: playWalkPiano,
  });
  roomInteractions?.dispose();
  roomInteractions = new RoomInteractions(Qn, {
    pcCase, onDoor: () => walk.interactDoor({ fromScene: true }),
    onPiano: mv, onChange: () => { Ei = true; },
  });
}
function playWalkPiano(event) {
  if (!cs || !walk?.active) return;
  const bounds = bn.getBoundingClientRect();
  Kc.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
  jc.setFromCamera(Kc, walk.getCamera());
  const hit = jc.intersectObject(Qn, true).find(roomHitIsVisible);
  roomInteractions?.interact(hit, performance.now(), _i);
}
function ll(i) {
  if (!cs) return;
  Or = i, kr = true, oi.switches++, Ge("#night").classList.toggle("selected", i === "night"), Ge("#day").classList.toggle("selected", i === "day"), Ge("#night").setAttribute("aria-pressed", String(i === "night")), Ge("#day").setAttribute("aria-pressed", String(i === "day"));
}
Ge("#night").onclick = () => ll("night");
Ge("#day").onclick = () => ll("day");
Ge("#sound").onclick = () => {
  Mi.setMuted(!Mi.muted), Ge("#sound").setAttribute("aria-pressed", String(Mi.muted)), Ge("#sound").setAttribute("aria-label", Mi.muted ? "开启声音" : "静音"), Ge("#sound").firstChild.textContent = Mi.muted ? "♩" : "♫";
};
Ge("#help").onclick = () => { walk?.clearInput(); Xr(); roomInteractions?.resetKeys(); Ge("#help-dialog").showModal(); };
Ge(".close").onclick = () => Ge("#help-dialog").close();
Ge("#help-dialog").onclick = (i) => {
  i.target === Ge("#help-dialog") && Ge("#help-dialog").close();
};
const Ri = /* @__PURE__ */ new Set();
let dt = null;
bn.addEventListener("pointerdown", (i) => {
  if (!cs || walk?.active) return;
  if (Ri.add(i.pointerId), Ri.size > 1) {
    dt && (dt.multi = true);
    return;
  }
  dt = { id: i.pointerId, x: i.clientX, y: i.clientY, time: performance.now(), distance: 0, multi: false, cancelled: false, camera: Rt.position.clone(), target: tn.target.clone(), zoom: Rt.zoom };
}, { capture: true });
bn.addEventListener("pointermove", (i) => {
  if (!cs || walk?.active) return;
  dt && i.pointerId === dt.id && (dt.distance = Math.max(dt.distance, Math.hypot(i.clientX - dt.x, i.clientY - dt.y)));
}, { capture: true });
bn.addEventListener("pointerup", (i) => {
  if (!cs || walk?.active) return;
  if (Ri.delete(i.pointerId), !(!dt || i.pointerId !== dt.id)) {
    if (dt.duration = performance.now() - dt.time, dt.distance = Math.max(dt.distance, Math.hypot(i.clientX - dt.x, i.clientY - dt.y)), kx(dt) && i.button === 0 && cs && sceneTapEndsOnCanvas(i, bn) && !document.querySelector("dialog[open]")) {
      const e = bn.getBoundingClientRect();
      Kc.set((i.clientX - e.left) / e.width * 2 - 1, -(i.clientY - e.top) / e.height * 2 + 1), jc.setFromCamera(Kc, Rt);
      const t = jc.intersectObject(Qn, true).filter(roomHitIsVisible);
      t.length && roomInteractions?.target(t[0]) && (tn.enableDamping = false, tn.update(), tn.enableDamping = true, Rt.zoom = dt.zoom, Rt.updateProjectionMatrix(), Rt.position.copy(dt.camera), tn.target.copy(dt.target), pt?.constrain(), roomInteractions.interact(t[0], performance.now(), _i));
    }
    dt = null;
  }
}, { capture: true });
bn.addEventListener("pointercancel", (i) => {
  if (!cs || walk?.active) return;
  Ri.delete(i.pointerId), dt && (dt.cancelled = true);
});
bn.addEventListener("lostpointercapture", Xr);
window.addEventListener("blur", () => {
  Ri.clear(), dt = null; roomInteractions?.resetKeys();
});
window.addEventListener("pagehide", () => { Xr(); roomInteractions?.resetKeys(); });
function suspendGraphics(event) {
  event.preventDefault();
  contextWasReady = contextWasReady || cs;
  graphicsAvailable = false;
  preparationAbort.abort(new Error("WebGL context lost"));
  cs = false; setRoomReady(false); Xr(); roomInteractions?.resetKeys();
  for (const note of Fo.values()) { note.obj.rotation.x = note.obj.userData.restRotation; Na(note.obj); }
  Fo.clear();
  cancelAnimationFrame(Hs); Hs = null;
  oi.errors.push("WebGL context lost");
  Ge("#note").textContent = "画面暂时中断，正在恢复";
  Ge("#note").classList.add("show");
}
async function restoreGraphics() {
  graphicsAvailable = true;
  if (!contextWasReady || !Qn || !Fr || !walk) {
    Ge("#load-detail").textContent = "图形环境已恢复，请重新载入空间";
    return;
  }
  const controller = preparationAbort = new AbortController();
  Ge("#loading").classList.remove("hidden");
  Ge("#loading").setAttribute("aria-hidden", "false");
  Ge("#load-detail").textContent = "重新准备材质与昼夜光照";
  try {
    oi.preparation = await prepareFirstSwitch({ renderer: Ot, scene: jt, camera: Rt, daylight: It,
      signal: controller.signal, extraTextures: [...No.flatMap(screen => screen.imgs), ...Fr.textures] });
    if (controller.signal.aborted || controller !== preparationAbort) return;
    await finishRoomPreparation();
    contextWasReady = false;
    Ge("#loading").classList.add("hidden");
    Ge("#loading").setAttribute("aria-hidden", "true");
    Ge("#note").textContent = "画面已恢复";
    setTimeout(() => Ge("#note").classList.remove("show"), 2e3);
  } catch (error) {
    cs = false; setRoomReady(false);
    Ge("#load-detail").textContent = "图形恢复未完成，请重新载入空间";
    oi.errors.push(String(error));
  }
}
bn.addEventListener("webglcontextlost", suspendGraphics);
bn.addEventListener("webglcontextrestored", restoreGraphics);
function mv(i) {
  const e = Rr.find((t) => t.userData.midi === i);
  e && (Fo.set(i, { obj: e, time: performance.now() }), Mi.play(i), oi.noteEvents.push({ midi: i, time: performance.now() }), Ge("#note").textContent = av.get(i).name, Ge("#note").classList.add("show"), clearTimeout(window.noteTimer), window.noteTimer = setTimeout(() => Ge("#note").classList.remove("show"), 800));
}
window.addEventListener("resize", () => {
  if (!cs) return;
  Ot.setSize(innerWidth, innerHeight), walk?.resize(innerWidth, innerHeight);
  if (!walk?.active) pt?.fit(innerWidth, innerHeight, { reset: false });
});
function Xr() {
  Ri.clear(), dt = null;
}
function gv(i) {
  if (!cs) return;
  walk?.exit();
  pt && (Xr(), pt.setView(i), Ei = true, pt.fit(innerWidth, innerHeight), Nr?.update(Rt, innerHeight, pt.view), document.querySelectorAll("[data-view]").forEach((e) => {
    const t = e.dataset.view === i;
    e.classList.toggle("selected", t), e.setAttribute("aria-pressed", String(t));
  }), Ge("#view-status").textContent = { overview: "全景 · 双层剖面", lower: "一层 · 生活空间", upper: "二层 · 休息空间", bear: "小熊 · 近看短绒与缝线", piano: "钢琴 · 直接点按琴键" }[i]);
}
document.querySelectorAll("[data-view]").forEach((i) => i.onclick = () => gv(i.dataset.view));
Ge("#reset-view").onclick = () => {
  if (!cs || walk?.active) return;
  Xr(), pt?.reset(innerWidth, innerHeight);
};
function Br(i) {
  if (!cs || walk?.active) return;
  Xr(), Rt.zoom = en.clamp(Rt.zoom * i, tn.minZoom, tn.maxZoom), Rt.updateProjectionMatrix(), pt?.constrain();
}
Ge("#zoom-in").onclick = () => Br(1.25);
Ge("#zoom-out").onclick = () => Br(0.8);
bn.addEventListener("keydown", (i) => {
  if (!cs || walk?.active) return;
  if (pt) {
    if (Xr(), i.key === "0" || i.key === "Home") pt.reset(innerWidth, innerHeight);
    else if (i.key === "ArrowLeft") pt.panByPixels(40, 0);
    else if (i.key === "ArrowRight") pt.panByPixels(-40, 0);
    else if (i.key === "ArrowUp") pt.panByPixels(0, 40);
    else if (i.key === "ArrowDown") pt.panByPixels(0, -40);
    else if (i.key === "+" || i.key === "=") Br(1.25);
    else if (i.key === "-") Br(0.8);
    else return;
    i.preventDefault();
  }
});
let Cr = performance.now(), Hs = null, kr = true;
function cl() {
  graphicsAvailable && Hs === null && document.visibilityState !== "hidden" && (Hs = requestAnimationFrame(vv));
}
document.addEventListener("visibilitychange", () => {
  document.visibilityState === "hidden" ? (cancelAnimationFrame(Hs), Hs = null, Ri.clear(), dt = null, roomInteractions?.resetKeys()) : (Cr = performance.now(), Ei = true, cl());
});
const _v = new we("#192b3b"), xv = new we("#afc8d3");
function vv(i) {
  if (Hs = null, document.visibilityState === "hidden" || !graphicsAvailable) return;
  cl();
  if (!cs) { Cr = i; return; }
  const e = Math.min(0.05, (i - Cr) / 1e3);
  if (cs && document.visibilityState === "visible" && oi.frameTimes.push(i - Cr), Cr = i, _i += e, kr) {
    const t = Or === "day" ? 1 : 0;
    _n = en.damp(_n, t, 2.7, e), Math.abs(_n - t) < 1e-4 && (_n = t, kr = false), jt.background.copy(_v).lerp(xv, _n);
    const n = Xx(_n, { bakedGI: !!Fr });
    Fr?.setDay(_n), Qh.intensity = n.fill, It.intensity = n.sun, ol.intensity = n.moon, jt.environmentIntensity = n.environment, Ot.toneMappingExposure = n.exposure;
    for (const { light: s, power: r } of Uo) s.intensity = r * n.lamps;
    for (const { mat: s, base: r, exterior: a } of eu) s.emissiveIntensity = r * (1 - (a ? 1 : 0.73) * _n);
    for (const s of No) s.uniforms.brightness.value = 0.78 + 0.22 * _n;
  }
  if (cs) {
    for (const t of tu) {
      const n = t.type === "spin" ? _i * t.amp : Math.sin(_i * Math.PI * 2 / t.period + t.phase) * t.amp;
      if (t.type === "cloth") {
        const s = t.obj.geometry.attributes.position, r = t.obj.userData.cloth;
        if (jx(s.array, r, n), r.indices.length) {
          const a = r.indices[0], o = r.indices[r.indices.length - 1];
          s.clearUpdateRanges(), s.addUpdateRange(a, o - a + 1), s.needsUpdate = true;
        }
      } else t.obj[t.type === "position" ? "position" : "rotation"][t.axis] = t.base + n, Na(t.obj);
    }
    for (const { object: t, period: n } of nu) t.rotation.z = -_i * Math.PI * 2 / n, Na(t);
    for (const t of No) {
      const n = zx(_i, t.imgs.length, t.hold, t.offset);
      t.material.map = t.imgs[n.index], t.uniforms.nextMap.value = t.imgs[n.next], t.uniforms.blend.value = n.mix;
    }
    for (const [t, n] of Fo) {
      const s = (i - n.time) / 1e3;
      n.obj.rotation.x = n.obj.userData.restRotation - Math.sin(Math.min(1, s / 0.32) * Math.PI) * 0.045, s > 0.32 && (n.obj.rotation.x = n.obj.userData.restRotation, Fo.delete(t)), Na(n.obj), Ei = true;
    }
  }
  if (walk?.active) walk.update(e);
  else { tn.update(); pt?.constrain(); }
  Nr?.update(walk?.getCamera() || Rt, innerHeight, walk?.active ? "walk" : pt?.view);
  pcCase?.update(_i, walk?.getCamera() || Rt, innerHeight, _n);
  if (roomInteractions?.update(i)) Ei = true;
  if (Ei || _i - qc >= rv - 1e-3) {
    It.shadow.needsUpdate = It.intensity > 0, It.castShadow = It.intensity > 0;
    for (const { light: t } of Uo) t.castShadow && (t.shadow.needsUpdate = true);
    qc = _i, Ei = false;
  }
  Ot.render(jt, walk?.getCamera() || Rt);
  return true;
}
window.addEventListener("error", (i) => oi.errors.push(i.message));
window.addEventListener("unhandledrejection", (i) => oi.errors.push(String(i.reason)));
cl();
pv();
if (document.modelContext?.registerTool) {
  const i = new AbortController();
  window.addEventListener("pagehide", () => i.abort(), { once: true });
  for (const e of [{ name: "get_room_state", description: "Read whether the bearroom has loaded and its current day or warm-night lighting.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: () => ({ loaded: cs, lighting: Or, muted: Mi.muted }) }, { name: "set_room_lighting", description: "Switch the visible bearroom to sunny day or warm night, keeping the camera and animations.", inputSchema: { type: "object", properties: { lighting: { type: "string", enum: ["day", "night"] } }, required: ["lighting"], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: async (t) => {
    if (!t || !["day", "night"].includes(t.lighting) || Object.keys(t).some((n) => n !== "lighting")) throw new Error("lighting must be day or night");
    if (!cs) throw new Error("Room is still loading");
    return ll(t.lighting), await new Promise((n) => setTimeout(n, 1800)), { lighting: Or };
  } }]) try {
    Promise.resolve(document.modelContext.registerTool(e, { signal: i.signal })).catch((t) => console.warn("Optional page tools unavailable", t));
  } catch (t) {
    console.warn("Optional page tools unavailable", t);
  }
}
