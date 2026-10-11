/** Recovered from production v11. Minifier aliases are retained deliberately; this is not the lost original source.
 * Exact pre-recovery segment SHA256: f52b638a1cb521b1a288d6608b540fe65af2c6e9a9faff86ad369a7b05269482
 */
import { Ct, L, Kt, Ai, pn } from '../vendor/runtime-v11.js';
import { jh } from './camera.js';
const Jn = Object.freeze({ revision: "bear-velvet-v1", sheen: 0.75, sheenColorLinear: Object.freeze([0.85, 0.8, 0.72]), sheenRoughness: 0.88, specularIntensity: 0.25, normalStrength: 0.18 }), yr = /* @__PURE__ */ new WeakMap();
function Gc(i) {
  if (!i.isMeshStandardMaterial) return i;
  if (yr.has(i)) return yr.get(i);
  const e = i.isMeshPhysicalMaterial ? i.clone() : new pn();
  i.isMeshPhysicalMaterial || (Ai.prototype.copy.call(e, i), e.defines = { ...e.defines, PHYSICAL: "" });
  const t = i.onBeforeCompile, n = i.customProgramCacheKey();
  return e.onBeforeCompile = function(s, r) {
    t.call(this, s, r);
  }, e.customProgramCacheKey = () => `${n}|${Jn.revision}`, e.userData.bearVelvet = true, e.sheen = Jn.sheen, e.sheenColor.setRGB(...Jn.sheenColorLinear, Ct), e.sheenRoughness = Jn.sheenRoughness, e.specularIntensity = Jn.specularIntensity, e.clearcoat = 0, i.normalMap && (e.normalMap = i.normalMap.clone(), e.normalMap.needsUpdate = true, e.normalScale.set(Math.sign(i.normalScale.x) * Jn.normalStrength, Math.sign(i.normalScale.y) * Jn.normalStrength)), yr.set(i, e), yr.set(e, e), e;
}
function Zx(i) {
  const e = [];
  for (const t of ["Bear_reference_plush", "Bear_desk_plush"]) {
    const s = i.getObjectByName(t)?.getObjectByName(`${t}__fabric_bear`);
    s?.isMesh && (s.material = Array.isArray(s.material) ? s.material.map(Gc) : Gc(s.material), e.push(s));
  }
  return e;
}
const $x = "velvet", Wc = Object.freeze({ show: 160, hide: 120 });
function Jx(i, e) {
  return e >= (i ? Wc.hide : Wc.show);
}
const Mr = /* @__PURE__ */ new WeakMap();
function Xc(i) {
  if (Mr.has(i)) return Mr.get(i);
  const e = i.clone(), t = i.onBeforeCompile, n = i.customProgramCacheKey();
  return e.onBeforeCompile = function(s, r) {
    t.call(this, s, r), s.fragmentShader = s.fragmentShader.replace("#include <normal_fragment_begin>", `#include <normal_fragment_begin>
#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
  normal *= faceDirection;
  nonPerturbedNormal = normal;
#endif`);
  }, e.customProgramCacheKey = () => `${n}|plush-outward-normal-v1`, Mr.set(i, e), Mr.set(e, e), e;
}
class Qx {
  constructor(e, t, { mode: n = $x } = {}) {
    if (!["velvet", "fibers"].includes(n)) throw new Error(`Unknown plush appearance: ${n}`);
    this.mode = n, this.bodies = n === "velvet" ? Zx(e) : [], this.details = [], e.updateMatrixWorld(true), e.traverse((s) => {
      if (!s.isMesh || s.userData.physicalPlush !== true) return;
      s.castShadow = false, s.raycast = () => {
      }, n === "fibers" && (s.material = Array.isArray(s.material) ? s.material.map(Xc) : Xc(s.material));
      const r = new Kt().setFromObject(s.parent, true);
      let a = 1 / 0, o = -1 / 0;
      for (const l of [r.min.x, r.max.x]) for (const c of [r.min.y, r.max.y]) for (const u of [r.min.z, r.max.z]) {
        const h = new L(l, c, u).dot(t);
        a = Math.min(a, h), o = Math.max(o, h);
      }
      this.details.push({ object: s, height: o - a, primary: jh(s), visible: false }), s.userData.plushDetailVisible = false, s.visible = false;
    });
  }
  update(e, t, n) {
    const s = t * e.zoom / (e.top - e.bottom);
    for (const r of this.details) r.visible = this.mode === "fibers" && (n === "bear" && r.primary || Jx(r.visible, r.height * s)), r.object.userData.plushDetailVisible = r.visible, r.object.visible = r.visible && r.object.userData.cutawayVisible !== false;
  }
  diagnostics() {
    return { mode: this.mode, revision: this.mode === "velvet" ? Jn.revision : "plush-outward-normal-v1", bodies: this.bodies.length, retainedFibers: this.details.reduce((e, t) => e + (t.object.userData.fiberCount || 0), 0), visibleFiberMeshes: this.details.filter((e) => e.object.visible).length };
  }
}

export { Qx, Qx as PlushAppearance, Jn as VELVET_CONFIG, Jx as plushDetailVisible, Gc as makeVelvetMaterial };
