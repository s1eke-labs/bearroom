/** Recovered from production v11. Minifier aliases are retained deliberately; this is not the lost original source.
 * Exact pre-recovery segment SHA256: f2471a92684ef3609f950d260daa98e1e2d64206bc9889af43e9ae6a5ca6f8bd
 */
import { kn, ti, en, Ee, L, Kt, vn, Df } from '../vendor/runtime-v11.js';
const Px = Math.acos(1 / Math.sqrt(3)), $n = 2.78, Lx = ["overview", "lower", "upper", "bear", "piano"];
function jh(i) {
  for (let e = i; e; e = e.parent) if (e.name === "Bear_reference_plush") return true;
  return false;
}
function Do(i) {
  for (let e = i; e; e = e.parent) if (!e.visible) return false;
  return true;
}
function Dx(i, e) {
  return e.clippingPlanes?.some((t) => t.distanceToPoint(i) < 0) || false;
}
function Ix(i) {
  i.enableRotate = false, i.enablePan = true, i.screenSpacePanning = true, i.enableDamping = true, i.dampingFactor = 0.12, i.zoomSpeed = 0.8, i.zoomToCursor = false, i.minZoom = 0.8, i.maxZoom = 8, i.minAzimuthAngle = i.maxAzimuthAngle = Math.PI / 4, i.minPolarAngle = i.maxPolarAngle = Px, i.mouseButtons.LEFT = kn.PAN, i.mouseButtons.MIDDLE = kn.DOLLY, i.mouseButtons.RIGHT = kn.PAN, i.touches.ONE = ti.PAN, i.touches.TWO = ti.DOLLY_PAN;
}
const Kh = (i, e, t) => (e.x - i.x) * (t.y - i.y) - (e.y - i.y) * (t.x - i.x);
function Ux(i) {
  i.sort((t, n) => t.x - n.x || t.y - n.y);
  const e = (t) => {
    const n = [];
    for (const s of t) {
      for (; n.length > 1 && Kh(n.at(-2), n.at(-1), s) <= 0; ) n.pop();
      n.push(s);
    }
    return n;
  };
  return [...e(i).slice(0, -1), ...e([...i].reverse()).slice(0, -1)];
}
function Nx(i, e, t, n) {
  const s = [];
  for (let r = 0; r < i.length; r++) {
    const a = i[r], o = i[(r + 1) % i.length], l = (a[e] - t) * n, c = (o[e] - t) * n;
    l >= -1e-10 && s.push(a), l < 0 != c < 0 && s.push(a.clone().lerp(o, l / (l - c)));
  }
  return s;
}
function Fx(i, e) {
  if (!e.length || e.length > 2 && e.every((s, r) => Kh(s, e[(r + 1) % e.length], i) >= -1e-9)) return i;
  let t = e[0], n = 1 / 0;
  for (let s = 0; s < e.length; s++) {
    const r = e[s], a = e[(s + 1) % e.length], o = a.clone().sub(r), l = r.clone().addScaledVector(o, en.clamp(i.clone().sub(r).dot(o) / (o.lengthSq() || 1), 0, 1)), c = l.distanceToSquared(i);
    c < n && (t = l, n = c);
  }
  return t;
}
class Ox {
  constructor(e, t, n) {
    this.root = e, this.camera = t, this.controls = n, this.view = "overview", this.frame = { right: new L(1, 0, -1).normalize(), up: new L(-1, 2, -1).normalize() }, n.addEventListener?.("change", () => this.constrain());
    const s = /* @__PURE__ */ new WeakMap();
    this.meshes = [], e.updateMatrixWorld(true), e.traverse((r) => {
      if (!r.isMesh) return;
      const a = new Kt().setFromObject(r, true), o = (l) => (s.has(l) || s.set(l, l.clone()), s.get(l));
      r.material = Array.isArray(r.material) ? r.material.map(o) : o(r.material), this.meshes.push({ object: r, bounds: a });
    });
  }
  direction() {
    return new L(1, 1, 1).normalize();
  }
  panByPixels(e, t) {
    if (!this.viewport) return;
    const { width: n, height: s } = this.viewport, r = this.camera, a = this.frame.right.clone().multiplyScalar(-e * (r.right - r.left) / r.zoom / n).addScaledVector(this.frame.up, t * (r.top - r.bottom) / r.zoom / s);
    this.controls.target.add(a), r.position.add(a), this.constrain();
  }
  setView(e) {
    Lx.includes(e) && (this.view = e, this.applyCutaway());
  }
  applyCutaway() {
    const e = this.direction(), t = ["lower", "piano", "bear"].includes(this.view), n = t ? [new vn(new L(0, -1, 0), $n)] : this.view === "upper" ? [new vn(new L(0, 1, 0), -$n)] : [];
    for (const { object: s, bounds: r } of this.meshes) {
      const a = s.name;
      let o = !/^Exterior_city|^street_/.test(a);
      t && r.min.y >= $n && (o = false), this.view === "upper" && r.max.y < $n && (o = false), /wall_east/.test(a) && e.x > 0 && (o = false), /wall_west/.test(a) && e.x < 0 && (o = false), /wall_south/.test(a) && e.z > 0 && (o = false), /window_glass|Architecture__metal_graphite|Architecture__fabric_ivory_linen/.test(a) && e.z < 0 && (o = false), s.userData.cutawayVisible = o, s.visible = o && s.userData.plushDetailVisible !== false;
      const l = Array.isArray(s.material) ? s.material : [s.material];
      for (const c of l) c.clippingPlanes = n, c.clipShadows = true;
    }
    this.root.updateMatrixWorld(true), this.projected = null;
  }
  bounds() {
    const e = new Kt();
    if (this.view === "bear") {
      for (const { object: t, bounds: n } of this.meshes) jh(t) && e.union(n);
      if (!e.isEmpty()) return e.expandByScalar(0.025);
    }
    if (this.view === "piano") {
      for (const { object: t, bounds: n } of this.meshes) /^piano_key_\d{3}$/.test(t.name) && e.union(n);
      return e.expandByScalar(0.015);
    }
    for (const { object: t, bounds: n } of this.meshes) {
      if (!Do(t)) continue;
      const s = n.clone();
      (this.view === "lower" || this.view === "bear") && (s.max.y = Math.min(s.max.y, $n)), this.view === "upper" && (s.min.y = Math.max(s.min.y, $n)), s.isEmpty() || e.union(s);
    }
    return e;
  }
  projectedRoom() {
    if (this.projected) return this.projected;
    const e = [];
    for (const { object: s, bounds: r } of this.meshes) {
      if (!Do(s)) continue;
      const a = r.clone();
      if (["lower", "piano", "bear"].includes(this.view) && (a.max.y = Math.min(a.max.y, $n)), this.view === "upper" && (a.min.y = Math.max(a.min.y, $n)), !a.isEmpty()) for (const o of [a.min.x, a.max.x]) for (const l of [a.min.y, a.max.y]) for (const c of [a.min.z, a.max.z]) {
        const u = new L(o, l, c);
        e.push(new Ee(u.dot(this.frame.right), u.dot(this.frame.up)));
      }
    }
    const t = Ux(e), n = new Df().setFromPoints(e);
    return this.projected = { polygon: t, box: n };
  }
  panLimits() {
    if (!this.viewport) return null;
    const { width: e, height: t, top: n, bottom: s, side: r } = this.viewport, a = this.camera, o = (a.left + a.right) / 2, l = (a.top + a.bottom) / 2, c = (a.right - a.left) / 2 / a.zoom, u = (a.top - a.bottom) / 2 / a.zoom, h = o + (-1 + 2 * r / e) * c, d = o + (1 - 2 * r / e) * c, p = l + (-1 + 2 * s / t) * u, g = l + (1 - 2 * n / t) * u, { box: _ } = this.projectedRoom(), m = (w, C, R, N) => C - w <= N - R ? [(w + C - R - N) / 2, (w + C - R - N) / 2] : [w - R, C - N], [f, b] = m(_.min.x, _.max.x, h, d), [E, y] = m(_.min.y, _.max.y, p, g);
    return { minX: f, maxX: b, minY: E, maxY: y, left: h, right: d, low: p, high: g };
  }
  constrain() {
    if (!this.viewport || this.constraining) return;
    this.constraining = true;
    const e = this.camera, t = this.controls.target;
    e.zoom = en.clamp(e.zoom, this.controls.minZoom, this.controls.maxZoom), e.updateProjectionMatrix();
    const n = this.panLimits(), { minX: s, maxX: r, minY: a, maxY: o, left: l, right: c, low: u, high: h } = n, d = new Ee((l + c) / 2, (u + h) / 2);
    let p = this.projectedRoom().polygon.map((f) => f.clone().sub(d));
    for (const [f, b, E] of [["x", s, 1], ["x", r, -1], ["y", a, 1], ["y", o, -1]]) p = Nx(p, f, b, E);
    const g = new Ee(t.dot(this.frame.right), t.dot(this.frame.up)), _ = Fx(new Ee(en.clamp(g.x, s, r), en.clamp(g.y, a, o)), p), m = t.clone().addScaledVector(this.frame.right, _.x - g.x).addScaledVector(this.frame.up, _.y - g.y);
    _.distanceToSquared(g) > 1e-14 && this.controls.enableDamping && (this.controls.enableDamping = false, this.controls.update(), this.controls.enableDamping = true), t.copy(m), e.position.copy(t).addScaledVector(this.direction(), 35), e.lookAt(t), e.updateMatrixWorld(true), this.constraining = false;
  }
  reset(e, t) {
    this.fit(e, t, { reset: true });
  }
  fit(e, t, { reset: n = true } = {}) {
    const s = this.camera, r = this.bounds(), a = r.getCenter(new L());
    this.controls.maxZoom = this.view === "piano" ? 16 : 8;
    const o = this.controls.enableDamping;
    this.controls.enableDamping = false, this.controls.update(), this.controls.enableDamping = o, n && (this.controls.target.copy(a), s.position.copy(a).addScaledVector(this.direction(), 35), s.zoom = 1), s.lookAt(this.controls.target), s.updateMatrixWorld(true);
    let l = 0, c = 0;
    for (const f of [r.min.x, r.max.x]) for (const b of [r.min.y, r.max.y]) for (const E of [r.min.z, r.max.z]) {
      const y = new L(f, b, E).sub(a);
      l = Math.max(l, Math.abs(y.dot(this.frame.right))), c = Math.max(c, Math.abs(y.dot(this.frame.up)));
    }
    const u = t < 500 ? 112 : 150, h = t < 500 ? 64 : 112, d = Math.max(t * 0.35, t - u - h), p = Math.max(e * 0.65, e - (e < 600 ? 28 : 100)), g = e / t, _ = Math.max(c * t / d, l * e / p / g) * 1.08;
    s.left = -_ * g, s.right = _ * g;
    const m = (u - h) / t * _;
    s.top = _ + m, s.bottom = -_ + m, this.viewport = { width: e, height: t, side: (e - p) / 2, top: (t - d + u - h) / 2, bottom: (t - d - u + h) / 2 }, s.updateProjectionMatrix(), this.constrain(), this.controls.update(), this.constrain();
  }
}

export { jh, Do, Dx, Ix, Ox, Ox as IsometricRoom, Ix as configureControls, Do as isWorldVisible, Dx as isClipped, jh as isPrimaryBear };
