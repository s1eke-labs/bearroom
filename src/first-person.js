/** Indoor walking is deliberately separate from the recovered fixed-isometric controller.
 * Positions are world-space feet. There is no avatar, flying, model edit or GI rebake.
 */
import { zt as PerspectiveCamera, L as Vector3, _t as Mesh, Hr as PlaneGeometry } from '../vendor/runtime-v11.js';
import { WalkNavigation } from './walk-navigation.js';
import { sceneTapEndsOnCanvas } from './room-interactions.js';
import { cancelOrbitGesture } from './orbit-input.js';

export const WALK_CEILING = Object.freeze({ width: 10, depth: 8, height: 5.8 });
export const WALK_VIEW = Object.freeze({ eyeHeight: 1.6, fov: 68, near: 0.045, far: 80, pitchLimit: 80 * Math.PI / 180, lookSensitivity: 0.0032 });
const KEY_CODES = { w: 'KeyW', a: 'KeyA', s: 'KeyS', d: 'KeyD', ArrowUp: 'ArrowUp', ArrowLeft: 'ArrowLeft', ArrowDown: 'ArrowDown', ArrowRight: 'ArrowRight', e: 'KeyE' };
const inputCode = event => event.code || KEY_CODES[event.key?.length === 1 ? event.key.toLowerCase() : event.key];
const MOVEMENT_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']);
const PROJECTION_FIELDS = ['left', 'right', 'top', 'bottom', 'near', 'far', 'zoom'];
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const materialsOf = object => Array.isArray(object.material) ? object.material : [object.material];
const isExterior = object => {
  for (let node = object; node; node = node.parent) if (/^Exterior_city|^street_/.test(node.name)) return true;
  return false;
};

export function captureIsometricState(room, camera, controls) {
  return {
    view: room.view, selectedPreset: room.selectedPreset, position: camera.position.clone(), quaternion: camera.quaternion.clone(), up: camera.up.clone(),
    target: controls.target.clone(), enabled: controls.enabled, damping: controls.enableDamping,
    minZoom: controls.minZoom, maxZoom: controls.maxZoom,
    projection: Object.fromEntries(PROJECTION_FIELDS.map(key => [key, camera[key]])),
    viewport: room.viewport ? { ...room.viewport } : null,
  };
}
export function restoreIsometricState(room, camera, controls, saved) {
  room.cancelTransition?.();
  room.view = saved.view;
  room.selectedPreset = saved.selectedPreset;
  room.viewport = saved.viewport ? { ...saved.viewport } : null;
  room.projected = null;
  camera.position.copy(saved.position);
  camera.quaternion.copy(saved.quaternion);
  camera.up.copy(saved.up);
  Object.assign(camera, saved.projection);
  controls.target.copy(saved.target);
  controls.enabled = saved.enabled;
  controls.enableDamping = saved.damping;
  controls.minZoom = saved.minZoom;
  controls.maxZoom = saved.maxZoom;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  room.syncFrame?.();
}

export class FirstPersonController {
  constructor({ root, scene = root.parent, room, isometricCamera, orbitControls, canvas, app, toggleButton, joystick, joystickKnob,
    hint, status, doorButton, onChange = () => {}, onTap = () => {}, windowTarget = globalThis.window,
    documentTarget = globalThis.document, navigation = new WalkNavigation(root) }) {
    Object.assign(this, { root, scene, room, isometricCamera, orbitControls, canvas, app, toggleButton, joystick,
      joystickKnob, hint, status, doorButton, onChange, onTap, windowTarget, documentTarget, navigation });
    this.camera = new PerspectiveCamera(WALK_VIEW.fov, 1, WALK_VIEW.near, WALK_VIEW.far);
    this.camera.rotation.order = 'YXZ';
    // This cutaway model has no roof. A visual-only ceiling closes the sky in
    // roaming, outside the authored root so fixed-view bounds stay unchanged.
    // Reuse the exact plaster material, including its existing GI shader hook.
    // It never casts new blanket shadows or claims an enclosed-scene rebake.
    const wall = root.getObjectByName('cutaway_wall_east');
    if (scene && wall?.material && !Array.isArray(wall.material)) {
      this.ceiling = new Mesh(new PlaneGeometry(WALK_CEILING.width, WALK_CEILING.depth), wall.material);
      this.ceiling.name = 'walk_visual_ceiling';
      this.ceiling.userData.walkOnlyVisualClosure = true;
      this.ceiling.position.set(0, WALK_CEILING.height, 0);
      this.ceiling.rotation.x = Math.PI / 2;
      this.ceiling.castShadow = false;
      this.ceiling.receiveShadow = true;
      this.ceiling.visible = false;
      this.ceiling.updateMatrix();
      this.ceiling.matrixAutoUpdate = false;
      scene.add(this.ceiling);
      this.ceiling.updateMatrixWorld(true);
    }
    this.desiredEye = new Vector3();
    this.eyeY = NaN;
    this.active = false;
    this.inputEnabled = true;
    this.yaw = 0;
    this.pitch = 0;
    this.keys = new Set();
    this.lookPointers = new Map();
    this.joystickPointerId = null;
    this.stick = { x: 0, z: 0 };
    this.inputSerial = 0;
    this.listeners = [];
    this.size = { width: windowTarget?.innerWidth || 1, height: windowTarget?.innerHeight || 1 };
    this.resize(this.size.width, this.size.height);
    this.bindInputs();
    if (toggleButton) toggleButton.disabled = false;
  }
  getCamera() { return this.active ? this.camera : this.isometricCamera; }
  listen(target, name, handler, options) {
    if (!target) return;
    target.addEventListener(name, handler, options);
    this.listeners.push(() => target.removeEventListener(name, handler, options));
  }
  enter() {
    if (this.active || !this.inputEnabled) return;
    // Preserve the last frame the user actually saw, never a tween endpoint
    // that could resume invisibly while roaming or after returning outside.
    this.room.cancelTransition?.();
    this.saved = captureIsometricState(this.room, this.isometricCamera, this.orbitControls);
    this.savedSize = { ...this.size };
    cancelOrbitGesture(this.orbitControls);
    // Cancelling a prior gesture must not alter the exact visible frame being saved.
    restoreIsometricState(this.room, this.isometricCamera, this.orbitControls, this.saved);
    this.orbitControls.enabled = false;
    this.savedVisibility = [];
    this.savedMaterials = new Map();
    this.root.traverse(object => {
      if (!object.isMesh) return;
      this.savedVisibility.push({ object, visible: object.visible, cutaway: object.userData.cutawayVisible });
      const visible = !isExterior(object);
      object.userData.cutawayVisible = visible;
      object.visible = visible && object.userData.plushDetailVisible !== false;
      for (const material of materialsOf(object)) {
        if (!material || this.savedMaterials.has(material)) continue;
        this.savedMaterials.set(material, { clippingPlanes: material.clippingPlanes, clipShadows: material.clipShadows });
        material.clippingPlanes = [];
        material.clipShadows = true;
      }
    });
    const floor = this.saved.view === 'upper' ? 'upper' : 'lower';
    this.navigation.reset(floor);
    this.yaw = this.navigation.spawnPoints?.[floor]?.yaw ?? 0;
    this.pitch = -0.03;
    this.clearInput();
    this.active = true;
    if (this.ceiling) this.ceiling.visible = true;
    this.syncCamera(0, true);
    this.savedHint = this.hint?.innerHTML;
    this.savedStatus = this.status?.textContent;
    this.app?.classList.add('is-walking');
    this.toggleButton?.setAttribute('aria-pressed', 'true');
    if (this.toggleButton) this.toggleButton.textContent = '退出漫游';
    if (this.hint) this.hint.innerHTML = 'WASD / 方向键行走 · 拖动环顾<br /><span>手机左侧摇杆移动 · 右侧拖动环顾 · Esc 退出</span>';
    if (this.status) this.status.textContent = '第一人称 · 室内漫游';
    this.canvas.setAttribute('aria-label', '室内漫游：WASD 或方向键行走，拖动环顾，轻点琴键弹奏，Escape 退出漫游');
    this.canvas.focus?.({ preventScroll: true });
    this.onChange(true);
  }
  exit() {
    if (!this.active) return;
    this.clearInput();
    this.active = false;
    if (this.ceiling) this.ceiling.visible = false;
    for (const { object, visible, cutaway } of this.savedVisibility) {
      object.visible = visible;
      if (cutaway === undefined) delete object.userData.cutawayVisible;
      else object.userData.cutawayVisible = cutaway;
    }
    for (const [material, saved] of this.savedMaterials) Object.assign(material, saved);
    cancelOrbitGesture(this.orbitControls);
    restoreIsometricState(this.room, this.isometricCamera, this.orbitControls, this.saved);
    // Rotation changes the viewport, not the saved view or zoom. Refit only when needed.
    if (this.size.width !== this.savedSize.width || this.size.height !== this.savedSize.height) {
      this.room.fit(this.size.width, this.size.height, { reset: false });
    }
    if (this.doorButton) this.doorButton.hidden = true;
    this.app?.classList.remove('is-walking');
    this.toggleButton?.setAttribute('aria-pressed', 'false');
    if (this.toggleButton) this.toggleButton.textContent = '进入漫游';
    if (this.hint) this.hint.innerHTML = this.savedHint;
    if (this.status) this.status.textContent = this.savedStatus;
    this.canvas.setAttribute('aria-label', '小熊的三维 Loft，经典、正左和正右预设视角，单指或鼠标拖动平移，捏合或滚轮缩放，直接轻点琴键弹奏');
    this.canvas.focus?.({ preventScroll: true });
    this.onChange(false);
  }
  resize(width, height) {
    this.size = { width: Math.max(1, width), height: Math.max(1, height) };
    this.camera.aspect = this.size.width / this.size.height;
    this.camera.updateProjectionMatrix();
  }
  syncCamera(dt = 0, snap = false) {
    this.navigation.eyePosition(this.desiredEye);
    if (snap || !Number.isFinite(this.eyeY)) this.eyeY = this.desiredEye.y;
    else if (dt > 0) this.eyeY += (this.desiredEye.y - this.eyeY) * (1 - Math.exp(-dt / 0.09));
    // Keep the rendered eye and its near plane inside the checked capsule
    // during descent; smoothing must never look through overhead geometry.
    const headHeight = this.navigation.config?.height ?? 1.75;
    this.eyeY = Math.min(this.eyeY, this.navigation.position.y + headHeight - 0.06);
    this.camera.position.copy(this.desiredEye);
    this.camera.position.y = this.eyeY;
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    this.camera.updateMatrixWorld(true);
  }
  hasMovement() { return this.keys.size > 0 || Math.hypot(this.stick.x, this.stick.z) > 0; }
  dialogOpen() { return !!this.documentTarget?.querySelector?.('dialog[open]'); }
  update(dt) {
    if (!this.active || !this.inputEnabled) return;
    if (this.dialogOpen() || this.documentTarget?.visibilityState === 'hidden') { this.clearInput(); return; }
    const right = Number(this.keys.has('KeyD') || this.keys.has('ArrowRight')) - Number(this.keys.has('KeyA') || this.keys.has('ArrowLeft')) + this.stick.x;
    const forward = Number(this.keys.has('KeyW') || this.keys.has('ArrowUp')) - Number(this.keys.has('KeyS') || this.keys.has('ArrowDown')) - this.stick.z;
    const length = Math.max(1, Math.hypot(right, forward));
    const x = (right * Math.cos(this.yaw) - forward * Math.sin(this.yaw)) / length;
    const z = (-right * Math.sin(this.yaw) - forward * Math.cos(this.yaw)) / length;
    this.navigation.move(Number.isFinite(dt) ? clamp(dt, 0, 0.05) : 0, { x, z });
    this.syncCamera(Number.isFinite(dt) ? clamp(dt, 0, 0.05) : 0);
    this.refreshDoorAction();
  }
  refreshDoorAction() {
    if (!this.doorButton) return;
    const action = this.active ? this.navigation.doorAction?.() : null;
    this.doorButton.hidden = !action;
    if (action) {
      this.doorButton.textContent = performance.now() < (this.doorBlockedUntil || 0) ? "请退开一点再开关门" : action.label;
      this.doorButton.setAttribute("aria-label", `${action.label}，电脑也可按 E`);
    }
  }
  interactDoor({ fromScene = false } = {}) {
    if (!this.inputEnabled || (!this.active && !fromScene) || this.dialogOpen() || (this.active && !this.navigation.doorAction?.())) return;
    this.clearInput();
    const result = this.navigation.toggleDoor({ checkPlayer: this.active });
    this.doorBlockedUntil = result?.blocked ? performance.now() + 1600 : 0;
    if (result?.changed) this.onChange(this.active);
    this.refreshDoorAction();
    if (result?.blocked && this.doorButton) this.doorButton.textContent = "请退开一点再开关门";
    return result;
  }
  setInputEnabled(enabled) {
    this.inputEnabled = !!enabled;
    // Both suspension and recovery start from rest. Keep the current mode,
    // camera and shared door state intact until a fresh gesture arrives.
    this.clearInput();
  }
  clearInput() {
    this.keys.clear();
    this.inputSerial++;
    for (const id of this.lookPointers.keys()) this.release(this.canvas, id);
    this.lookPointers.clear();
    this.lookPointerId = null;
    if (this.joystickPointerId !== null) this.release(this.joystick, this.joystickPointerId);
    this.joystickPointerId = null;
    this.stick.x = this.stick.z = 0;
    this.paintStick(0, 0);
  }
  release(element, id) {
    try { if (element?.hasPointerCapture?.(id)) element.releasePointerCapture(id); } catch { /* Pointer already cancelled by the browser. */ }
  }
  capture(element, id) {
    try { element?.setPointerCapture?.(id); } catch { /* Off-screen interruption still resets through global up/blur. */ }
  }
  paintStick(x, y) {
    if (this.joystickKnob) this.joystickKnob.style.transform = `translate(${x}px, ${y}px)`;
  }
  setStick(event) {
    const rect = this.joystick.getBoundingClientRect();
    const radius = Math.max(1, Math.min(rect.width, rect.height) * 0.32);
    const x = event.clientX - (rect.left + rect.width / 2), y = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(x, y), factor = distance > radius ? radius / distance : 1;
    this.paintStick(x * factor, y * factor);
    const strength = clamp((distance / radius - 0.12) / 0.88, 0, 1);
    this.stick.x = distance ? x / distance * strength : 0;
    this.stick.z = distance ? y / distance * strength : 0;
  }
  bindInputs() {
    this.listen(this.toggleButton, 'click', () => {
      if (this.inputEnabled) this.active ? this.exit() : this.enter();
    });
    this.listen(this.doorButton, 'click', () => this.interactDoor());
    this.listen(this.windowTarget, 'keydown', event => {
      if (!this.inputEnabled || !this.active || this.dialogOpen() || event.target?.matches?.('input, textarea, select, [contenteditable="true"]')) return;
      if (event.code === 'Escape' || event.key === 'Escape') { event.preventDefault(); this.exit(); return; }
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const code = inputCode(event);
      if (code === 'KeyE') { event.preventDefault(); if (!event.repeat) this.interactDoor(); return; }
      if (!MOVEMENT_KEYS.has(code)) return;
      if (event.repeat && !this.keys.has(code)) return;
      event.preventDefault();
      if (!this.keys.has(code)) this.inputSerial++;
      this.keys.add(code);
    });
    this.listen(this.windowTarget, 'keyup', event => {
      const code = inputCode(event);
      if (MOVEMENT_KEYS.has(code)) { this.keys.delete(code); if (this.active && this.inputEnabled) event.preventDefault(); }
    });
    this.listen(this.windowTarget, 'blur', () => this.clearInput());
    this.listen(this.windowTarget, 'pagehide', () => this.clearInput());
    this.listen(this.documentTarget, 'visibilitychange', () => this.clearInput());
    this.listen(this.canvas, 'contextmenu', event => { if (this.active && this.inputEnabled) event.preventDefault(); });
    this.listen(this.canvas, 'wheel', event => { if (this.active && this.inputEnabled) event.preventDefault(); }, { passive: false });
    this.listen(this.canvas, 'pointerdown', event => {
      if (!this.inputEnabled || !this.active || this.dialogOpen()) return;
      event.preventDefault();
      const gesture = { x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY,
        at: performance.now(), distance: 0, button: event.button, multi: this.lookPointers.size > 0,
        serial: this.inputSerial, moving: this.hasMovement() || this.joystickPointerId !== null };
      for (const other of this.lookPointers.values()) other.multi = true;
      this.lookPointers.set(event.pointerId, gesture);
      if (this.lookPointers.size === 1) this.lookPointerId = event.pointerId;
      this.capture(this.canvas, event.pointerId);
    });
    this.listen(this.canvas, 'pointermove', event => {
      if (!this.inputEnabled || !this.active) return;
      const gesture = this.lookPointers.get(event.pointerId);
      if (!gesture) return;
      event.preventDefault();
      gesture.distance = Math.max(gesture.distance, Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y));
      if (this.lookPointers.size === 1 && this.lookPointerId === event.pointerId) {
        this.yaw -= (event.clientX - gesture.lastX) * WALK_VIEW.lookSensitivity;
        this.yaw = ((this.yaw + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
        this.pitch = clamp(this.pitch - (event.clientY - gesture.lastY) * WALK_VIEW.lookSensitivity, -WALK_VIEW.pitchLimit, WALK_VIEW.pitchLimit);
        this.syncCamera();
      }
      gesture.lastX = event.clientX; gesture.lastY = event.clientY;
    });
    const finishLook = (event, cancelled) => {
      const gesture = this.lookPointers.get(event.pointerId);
      if (!gesture) return;
      gesture.distance = Math.max(gesture.distance, Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y));
      this.lookPointers.delete(event.pointerId);
      if (this.lookPointerId === event.pointerId) this.lookPointerId = null;
      if (this.lookPointers.size === 1) {
        const [id, remaining] = this.lookPointers.entries().next().value;
        this.lookPointerId = id;
        // Moves keep lastX/lastY current even while multitouch pauses looking.
        // Resume from that pointer's latest position, never the lifted finger's.
        // The whole gesture remains multitouch and must not become a scene tap.
        remaining.multi = true;
      }
      this.release(this.canvas, event.pointerId);
      if (!cancelled && this.inputEnabled && this.active && !this.dialogOpen() && sceneTapEndsOnCanvas(event, this.canvas, this.documentTarget) && !gesture.multi && !gesture.moving && !this.hasMovement() && this.joystickPointerId === null &&
        gesture.serial === this.inputSerial && gesture.button === 0 && gesture.distance <= 7 && performance.now() - gesture.at < 650) this.onTap(event);
    };
    this.listen(this.windowTarget, 'pointerup', event => finishLook(event, false));
    this.listen(this.windowTarget, 'pointercancel', event => finishLook(event, true));
    this.listen(this.canvas, 'lostpointercapture', event => finishLook(event, true));
    this.listen(this.joystick, 'pointerdown', event => {
      if (!this.inputEnabled || !this.active || this.joystickPointerId !== null || this.dialogOpen()) return;
      event.preventDefault(); event.stopPropagation();
      this.joystickPointerId = event.pointerId;
      this.inputSerial++;
      this.capture(this.joystick, event.pointerId);
      this.setStick(event);
    });
    this.listen(this.joystick, 'pointermove', event => {
      if (!this.inputEnabled || event.pointerId !== this.joystickPointerId) return;
      event.preventDefault(); event.stopPropagation(); this.setStick(event);
    });
    const finishStick = event => {
      if (event.pointerId !== this.joystickPointerId) return;
      this.joystickPointerId = null;
      this.stick.x = this.stick.z = 0;
      this.paintStick(0, 0);
      this.release(this.joystick, event.pointerId);
    };
    this.listen(this.windowTarget, 'pointerup', finishStick);
    this.listen(this.windowTarget, 'pointercancel', finishStick);
    this.listen(this.joystick, 'lostpointercapture', finishStick);
  }
  dispose() {
    this.exit();
    for (const remove of this.listeners) remove();
    this.listeners.length = 0;
    if (this.ceiling) {
      this.ceiling.removeFromParent();
      this.ceiling.geometry.dispose();
      this.ceiling = null;
    }
    // The ceiling borrows the wall material; disposing it would break the room.
  }
}
