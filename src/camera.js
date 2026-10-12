/** Recovered from production v11. Minifier aliases are retained deliberately; this is not the lost original source.
 * Exact pre-recovery segment SHA256: f2471a92684ef3609f950d260daa98e1e2d64206bc9889af43e9ae6a5ca6f8bd
 */
import { kn, ti, en, Ee, L, Kt, vn, Df } from '../vendor/runtime-v11.js';
import { cancelOrbitGesture } from './orbit-input.js';
import { CAMERA_LIMITS, CAMERA_PRESETS, DEFAULT_CAMERA_PRESET, PRESET_TRANSITION_MS, getCameraPreset } from './camera-presets.js';
const Px = Math.acos(1 / Math.sqrt(3)), $n = 2.78, Lx = ["overview", "lower", "upper", "bear", "piano"];
// Stay in the open southeast corner of the cutaway. Elevation is measured
// above the floor; OrbitControls measures its polar angle down from world +Y.
// The closed azimuth interval includes both true axial views, not just diagonals.
const ROOM_ORBIT = Object.freeze({
  defaultAzimuth: Math.PI / 4, defaultPolar: Px,
  ...CAMERA_LIMITS,
  minPolar: Math.PI / 2 - CAMERA_LIMITS.maxElevation,
  maxPolar: Math.PI / 2 - CAMERA_LIMITS.minElevation, distance: 35,
});
const defaultDirection = () => new L(1, 1, 1).normalize();
const directionForAngles = (azimuth, elevation) => new L(Math.cos(elevation) * Math.sin(azimuth), Math.sin(elevation), Math.cos(elevation) * Math.cos(azimuth));
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
  i.enableRotate = false, i.autoRotate = false, i.enablePan = true, i.screenSpacePanning = true;
  i.enableDamping = true, i.dampingFactor = 0.12;
  i.zoomSpeed = 0.8, i.zoomToCursor = false, i.minZoom = 0.8, i.maxZoom = 8;
  i.minAzimuthAngle = ROOM_ORBIT.minAzimuth, i.maxAzimuthAngle = ROOM_ORBIT.maxAzimuth;
  i.minPolarAngle = ROOM_ORBIT.minPolar, i.maxPolarAngle = ROOM_ORBIT.maxPolar;
  // The bounds remain a range so update() cannot snap a preset animation back
  // to one fixed direction. User rotation is disabled independently.
  i.mouseButtons.LEFT = kn.PAN, i.mouseButtons.MIDDLE = kn.DOLLY, i.mouseButtons.RIGHT = kn.PAN;
  i.touches.ONE = ti.PAN, i.touches.TWO = ti.DOLLY_PAN;
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
    this.root = e, this.camera = t, this.controls = n, this.view = "overview", this.frame = { right: new L(1, 0, -1).normalize(), up: new L(-1, 2, -1).normalize() };
    this.selectedPreset = DEFAULT_CAMERA_PRESET;
    this.transition = null;
    this.onControlsChange = () => this.constrain();
    this.onControlsStart = () => this.cancelTransition();
    n.addEventListener?.("change", this.onControlsChange);
    n.addEventListener?.("start", this.onControlsStart);
    const s = /* @__PURE__ */ new WeakMap();
    this.meshes = [], e.updateMatrixWorld(true), e.traverse((r) => {
      if (!r.isMesh) return;
      const a = new Kt().setFromObject(r, true), o = (l) => (s.has(l) || s.set(l, l.clone()), s.get(l));
      r.material = Array.isArray(r.material) ? r.material.map(o) : o(r.material), this.meshes.push({ object: r, bounds: a });
    });
  }
  dispose() {
    // Controls survive room-loading retries. Do not let their listeners retain
    // or constrain a discarded room, and do not dispose the shared controls.
    this.controls.removeEventListener?.("change", this.onControlsChange);
    this.controls.removeEventListener?.("start", this.onControlsStart);
    this.cancelTransition();
  }
  get transitioning() {
    return this.transition !== null;
  }
  selectPreset(id, time = globalThis.performance?.now() || 0, { reducedMotion = false } = {}) {
    const preset = getCameraPreset(id);
    if (!preset || !this.viewport || !this.orbitCenter) return false;
    // Snapshot the last visible frame, even when retargeting an unfinished
    // transition. Advancing the old timeline here would introduce a jump.
    this.cancelTransition();
    cancelOrbitGesture(this.controls);
    const direction = this.boundedDirection(), target = this.controls.target.clone();
    const destinationDirection = directionForAngles(preset.azimuth, preset.elevation);
    const destinationTarget = target.clone();
    // Preserve the world-space pan focus. Only remove the hidden depth axis;
    // ordinary viewport bounds are applied continuously along the transition.
    destinationTarget.addScaledVector(destinationDirection, this.orbitCenter.clone().sub(target).dot(destinationDirection));
    const zoom = en.clamp(Number.isFinite(this.camera.zoom) ? this.camera.zoom : 1, this.controls.minZoom, this.controls.maxZoom);
    this.selectedPreset = id;
    this.transition = {
      startedAt: Number.isFinite(time) ? time : globalThis.performance?.now() || 0,
      fromAzimuth: Math.atan2(direction.x, direction.z),
      fromElevation: Math.asin(en.clamp(direction.y, -1, 1)),
      toAzimuth: preset.azimuth, toElevation: preset.elevation,
      fromTarget: target, toTarget: destinationTarget,
      fromZoom: zoom, toZoom: zoom,
      fromFrustum: Object.fromEntries(["left", "right", "top", "bottom"].map(key => [key, this.camera[key]])),
    };
    if (reducedMotion || direction.distanceToSquared(destinationDirection) < 1e-20) this.finishTransition();
    return true;
  }
  updateTransition(time) {
    if (!this.transition || typeof time !== 'number' || Number.isNaN(time)) return false;
    const progress = en.clamp((time - this.transition.startedAt) / PRESET_TRANSITION_MS, 0, 1);
    this.applyTransition(progress);
    if (progress === 1) this.transition = null;
    return true;
  }
  applyTransition(progress) {
    const transition = this.transition;
    if (!transition) return;
    const eased = progress * progress * (3 - 2 * progress);
    const azimuth = en.lerp(transition.fromAzimuth, transition.toAzimuth, eased);
    const elevation = en.lerp(transition.fromElevation, transition.toElevation, eased);
    const target = this.controls.target.copy(transition.fromTarget).lerp(transition.toTarget, eased);
    this.camera.zoom = transition.fromZoom + (transition.toZoom - transition.fromZoom) * eased;
    this.camera.position.copy(target).addScaledVector(directionForAngles(azimuth, elevation), ROOM_ORBIT.distance);
    // Refit the current eased angle, not a linear blend of endpoint sizes:
    // the room can be widest halfway between the two axial views.
    this.constrain(progress === 0 ? transition.fromFrustum : null);
  }
  finishTransition() {
    if (!this.transition) return false;
    this.applyTransition(1);
    this.transition = null;
    return true;
  }
  cancelTransition() {
    if (!this.transition) return false;
    this.transition = null;
    const direction = this.direction();
    this.selectedPreset = CAMERA_PRESETS.find(preset => direction.distanceToSquared(directionForAngles(preset.azimuth, preset.elevation)) < 1e-16)?.id || null;
    return true;
  }
  direction() {
    const direction = this.camera.position.clone().sub(this.controls.target);
    return Number.isFinite(direction.lengthSq()) && direction.lengthSq() > 1e-12 ? direction.normalize() : defaultDirection();
  }
  boundedDirection() {
    const direction = this.direction(), azimuth = Math.atan2(direction.x, direction.z), polar = Math.acos(en.clamp(direction.y, -1, 1));
    const yaw = en.clamp(azimuth, ROOM_ORBIT.minAzimuth, ROOM_ORBIT.maxAzimuth), pitch = en.clamp(polar, ROOM_ORBIT.minPolar, ROOM_ORBIT.maxPolar);
    if (yaw === azimuth && pitch === polar) return direction;
    return new L(Math.sin(pitch) * Math.sin(yaw), Math.cos(pitch), Math.sin(pitch) * Math.cos(yaw));
  }
  syncFrame(direction = this.direction()) {
    const right = new L(direction.z, 0, -direction.x).normalize(), up = direction.clone().cross(right).normalize();
    if (this.frame.right.distanceToSquared(right) > 1e-20 || this.frame.up.distanceToSquared(up) > 1e-20) {
      // Keep these objects alive: the plush detail controller holds frame.up.
      this.frame.right.copy(right), this.frame.up.copy(up), this.projected = null;
    }
  }
  panByPixels(e, t) {
    if (!this.viewport || !Number.isFinite(e) || !Number.isFinite(t)) return;
    this.cancelTransition();
    this.syncFrame();
    const { width: n, height: s } = this.viewport, r = this.camera, a = this.frame.right.clone().multiplyScalar(-e * (r.right - r.left) / r.zoom / n).addScaledVector(this.frame.up, t * (r.top - r.bottom) / r.zoom / s);
    this.controls.target.add(a), r.position.add(a), this.constrain();
  }
  setView(e) {
    Lx.includes(e) && (this.cancelTransition(), this.view = e, this.applyCutaway());
  }
  applyCutaway() {
    const t = ["lower", "piano", "bear"].includes(this.view), n = t ? [new vn(new L(0, -1, 0), $n)] : this.view === "upper" ? [new vn(new L(0, 1, 0), -$n)] : [];
    for (const { object: s, bounds: r } of this.meshes) {
      const a = s.name;
      let o = !/^Exterior_city|^street_/.test(a);
      t && r.min.y >= $n && (o = false), this.view === "upper" && r.max.y < $n && (o = false), /wall_east|wall_south/.test(a) && (o = false), s.userData.cutawayVisible = o, s.visible = o && s.userData.plushDetailVisible !== false;
      const l = Array.isArray(s.material) ? s.material : [s.material];
      for (const c of l) c.clippingPlanes = n, c.clipShadows = true;
    }
    this.root.updateMatrixWorld(true), this.projected = null, this.roomCorners = null;
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
    // Visibility changes only on a view/mode transition. Cache world corners,
    // while rebuilding their screen-space hull whenever the camera rotates.
    if (!this.roomCorners) {
      this.roomCorners = [];
      for (const { object, bounds } of this.meshes) {
        if (!Do(object)) continue;
        const box = bounds.clone();
        if (["lower", "piano", "bear"].includes(this.view)) box.max.y = Math.min(box.max.y, $n);
        if (this.view === "upper") box.min.y = Math.max(box.min.y, $n);
        if (!box.isEmpty()) for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) this.roomCorners.push(new L(x, y, z));
      }
    }
    const points = this.roomCorners.map(point => new Ee(point.dot(this.frame.right), point.dot(this.frame.up)));
    const polygon = Ux(points), box = new Df().setFromPoints(points);
    return this.projected = { polygon, box };
  }
  fittedFrustum() {
    const { width, height, side, top, bottom } = this.viewport;
    let box = this.projectedRoom().box;
    if (this.focusBounds) {
      const points = [], { min, max } = this.focusBounds;
      for (const x of [min.x, max.x]) for (const y of [min.y, max.y]) for (const z of [min.z, max.z]) {
        const point = new L(x, y, z);
        points.push(new Ee(point.dot(this.frame.right), point.dot(this.frame.up)));
      }
      box = new Df().setFromPoints(points);
    }
    const halfHeight = Math.max(
      (box.max.y - box.min.y) * .5 * height / (height - top - bottom),
      (box.max.x - box.min.x) * .5 * height / (width - 2 * side),
      1e-6,
    ) * 1.08;
    const halfWidth = halfHeight * width / height, offset = (top - bottom) / height * halfHeight;
    return { left: -halfWidth, right: halfWidth, top: halfHeight + offset, bottom: -halfHeight + offset };
  }
  panLimits() {
    if (!this.viewport) return null;
    const { width: e, height: t, top: n, bottom: s, side: r } = this.viewport, a = this.camera, o = (a.left + a.right) / 2, l = (a.top + a.bottom) / 2, c = (a.right - a.left) / 2 / a.zoom, u = (a.top - a.bottom) / 2 / a.zoom, h = o + (-1 + 2 * r / e) * c, d = o + (1 - 2 * r / e) * c, p = l + (-1 + 2 * s / t) * u, g = l + (1 - 2 * n / t) * u, { box: _ } = this.projectedRoom(), m = (w, C, R, N) => C - w <= N - R ? [(w + C - R - N) / 2, (w + C - R - N) / 2] : [w - R, C - N], [f, b] = m(_.min.x, _.max.x, h, d), [E, y] = m(_.min.y, _.max.y, p, g);
    return { minX: f, maxX: b, minY: E, maxY: y, left: h, right: d, low: p, high: g };
  }
  constrain(frustum = null) {
    if (!this.viewport || this.constraining) return;
    this.constraining = true;
    try {
      const camera = this.camera, target = this.controls.target, direction = this.boundedDirection();
      this.syncFrame(direction);
      // At the first transition frame retain the exact projection snapshot.
      // Subsequent angles derive their own fit continuously, including the
      // larger diagonal between axial endpoints.
      Object.assign(camera, frustum || this.fittedFrustum());
      camera.zoom = en.clamp(typeof camera.zoom === "number" && !Number.isNaN(camera.zoom) ? camera.zoom : 1, this.controls.minZoom, this.controls.maxZoom);
      camera.updateProjectionMatrix();
      const limits = this.panLimits(), { minX, maxX, minY, maxY, left, right, low, high } = limits;
      const viewportCenter = new Ee((left + right) / 2, (low + high) / 2);
      let polygon = this.projectedRoom().polygon.map(point => point.clone().sub(viewportCenter));
      for (const [axis, bound, sign] of [["x", minX, 1], ["x", maxX, -1], ["y", minY, 1], ["y", maxY, -1]]) polygon = Nx(polygon, axis, bound, sign);
      const projectedTarget = new Ee(target.dot(this.frame.right), target.dot(this.frame.up));
      const bounded = Fx(new Ee(en.clamp(projectedTarget.x, minX, maxX), en.clamp(projectedTarget.y, minY, maxY)), polygon);
      const next = target.clone().addScaledVector(this.frame.right, bounded.x - projectedTarget.x).addScaledVector(this.frame.up, bounded.y - projectedTarget.y);
      // Two projected pan axes alone leave a hidden depth degree of freedom.
      // Anchor it to the selected room/floor center so repeated orbit + pan
      // cannot drift the target (and the near/far planes) away from the house.
      next.addScaledVector(direction, this.orbitCenter.clone().sub(next).dot(direction));
      if (bounded.distanceToSquared(projectedTarget) > 1e-14) {
        // The pinned OrbitControls pan impulse can be cancelled independently.
        // Never call update() with damping disabled here: that consumes all
        // remaining rotation in one frame and breaks the bounded orbit gesture.
        this.controls._panOffset?.set(0, 0, 0);
      }
      target.copy(next), camera.position.copy(target).addScaledVector(direction, ROOM_ORBIT.distance);
      camera.lookAt(target), camera.updateMatrixWorld(true);
    } finally {
      this.constraining = false;
    }
  }
  reset(e, t) {
    this.fit(e, t, { reset: true });
  }
  fit(e, t, { reset: n = true } = {}) {
    this.cancelTransition();
    const s = this.camera, r = this.bounds(), a = r.getCenter(new L());
    this.controls.maxZoom = this.view === "piano" ? 16 : 8;
    cancelOrbitGesture(this.controls);
    this.orbitCenter = a.clone();
    // View buttons and Home reset to the familiar isometric composition;
    // resize keeps the current direction, zoom and bounded screen-space position.
    n && (this.selectedPreset = DEFAULT_CAMERA_PRESET, this.controls.target.copy(a), s.position.copy(a).addScaledVector(defaultDirection(), ROOM_ORBIT.distance), s.zoom = 1);
    this.syncFrame(this.boundedDirection()), s.lookAt(this.controls.target), s.updateMatrixWorld(true);
    // Detail views retain their subject-specific composition. Whole-floor views
    // fit the actual visible mesh projections, avoiding empty composite-AABB
    // corners and the large reservation formerly shared by the whole orbit arc.
    this.focusBounds = ["bear", "piano"].includes(this.view) ? r.clone() : null;
    e = Number.isFinite(e) ? Math.max(1, e) : this.viewport?.width || 1;
    t = Number.isFinite(t) ? Math.max(1, t) : this.viewport?.height || 1;
    const topPadding = t < 500 ? e <= 600 ? 180 : 122 : e <= 600 ? 216 : 150, bottomPadding = t < 500 ? 64 : 112;
    const paddingScale = Math.min(1, t * 0.65 / (topPadding + bottomPadding));
    const u = topPadding * paddingScale, h = bottomPadding * paddingScale;
    const p = Math.max(e * 0.65, e - (e < 600 ? 28 : 100));
    this.viewport = { width: e, height: t, side: (e - p) / 2, top: u, bottom: h };
    this.constrain(), this.controls.update(), this.constrain();
  }
}

export { ROOM_ORBIT, jh, Do, Dx, Ix, Ox, Ox as IsometricRoom, Ix as configureControls, Do as isWorldVisible, Dx as isClipped, jh as isPrimaryBear };
