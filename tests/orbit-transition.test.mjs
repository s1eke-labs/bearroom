import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { FirstPersonController, captureIsometricState } from '../src/first-person.js';
import { IsometricRoom, configureControls } from '../src/camera.js';
import { CAMERA_PRESETS, PRESET_TRANSITION_MS } from '../src/camera-presets.js';
import { cancelOrbitGesture } from '../src/orbit-input.js';
import { isTap } from '../src/domain.js';
import { sceneTapEndsOnCanvas } from '../src/room-interactions.js';
import { Gr as OrthographicCamera, L as Vector3, Ee as Vector2, x0 as OrbitControls } from '../vendor/runtime-v11.js';
import { qaDOM, dispatch } from './walk-qa-helpers.mjs';
import { loadSceneForCPU } from './helpers.mjs';

// Real, version-pinned OrbitControls and real model geometry; no WebGL or browser.
// Native EventTarget does not model DOM propagation. Register main's capture
// handlers before the vendor, and explicitly forward canvas releases to window.
const source = await loadSceneForCPU();
const mainSource = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const mainInputSource = mainSource.slice(mainSource.indexOf('const Ri ='), mainSource.indexOf('function suspendGraphics'));
const resetInputSource = mainSource.match(/function Xr\(\) \{[\s\S]*?\n\}/)?.[0];
const visibilityInputSource = mainSource.match(/document\.addEventListener\("visibilitychange", \(\) => \{[\s\S]*?\n\}\);/)?.[0];
const suspensionInputSource = mainSource.match(/function suspendGraphics\(event\) \{[\s\S]*?\n\}/)?.[0];
const readyInputSource = mainSource.match(/function setRoomReady\(ready\) \{[\s\S]*?\n\}/)?.[0];
const resizeInputSource = mainSource.match(/window\.addEventListener\("resize", \(\) => \{[\s\S]*?\n\}\);/)?.[0];
const floorInputSource = mainSource.match(/function gv\(i\) \{[\s\S]*?\n\}/)?.[0];


function fixture(view = 'overview', { mainInput = false } = {}) {
  const dom = qaDOM(1440, 900), root = source.clone(true);
  root.getObjectByName('Exterior_city')?.removeFromParent();
  dom.canvas.getRootNode = () => dom.documentTarget;
  dom.documentTarget.elementFromPoint = () => dom.canvas;
  const camera = new OrthographicCamera(-12, 12, 10, -10, .1, 100);
  camera.position.set(20, 20, 20);
  const controls = new OrbitControls(camera);
  configureControls(controls);
  const room = new IsometricRoom(root, camera, controls);
  room.setView(view); room.fit(1440, 900);
  camera.zoom = 2.4; room.constrain();
  let taps = 0, mainContext;
  if (mainInput) {
    assert.ok(resetInputSource, 'test must run the actual main input reset hook');
    mainContext = vm.createContext({
      bn: dom.canvas, window: dom.windowTarget, document: dom.documentTarget,
      performance, cs: true, walk: null, Rt: camera, tn: controls, pt: room,
      Kc: new Vector2(), jc: { setFromCamera() {}, intersectObject() { return [{}]; } },
      Qn: root, roomHitIsVisible: () => true, kx: isTap,
      sceneTapEndsOnCanvas: event => sceneTapEndsOnCanvas(event, dom.canvas, dom.documentTarget),
      cancelOrbitGesture, syncPresetControls() {}, _i: 0, Hs: null, Cr: 0, Ei: false, cancelAnimationFrame() {}, cl() {},
      contextWasReady: false, graphicsAvailable: true, preparationAbort: new AbortController(),
      Fo: new Map(), oi: { errors: [] }, Ge: () => dom.status,
      innerWidth: 1440, innerHeight: 900, Ot: { setSize() {} }, Nr: null,
      roomInteractions: { target() { return true; }, interact() { taps++; }, resetKeys() {} },
    });
    assert.ok(visibilityInputSource, 'test must run the actual visibility interruption hook');
    assert.ok(suspensionInputSource && readyInputSource && resizeInputSource && floorInputSource, 'test must run the actual graphics, resize and floor interruption hooks');
    vm.runInContext(`${mainInputSource}\n${resetInputSource}\n${visibilityInputSource}\n${readyInputSource}\n${suspensionInputSource}\n${resizeInputSource}\n${floorInputSource}\nbn.addEventListener("webglcontextlost", suspendGraphics);`, mainContext);
  }
  controls.connect(dom.canvas);
  const navigation = {
    position: new Vector3(), spawnPoints: { lower: { yaw: 0 }, upper: { yaw: -Math.PI / 2 } },
    reset(floor) { this.position.set(0, floor === 'upper' ? 3.13 : .014, 0); },
    move(dt, input) { this.position.x += input.x * dt; this.position.z += input.z * dt; },
    eyePosition(out) { return out.copy(this.position).add(new Vector3(0, 1.6, 0)); },
  };
  const walk = new FirstPersonController({ ...dom, root, room, isometricCamera: camera, orbitControls: controls, navigation });
  if (mainContext) mainContext.walk = walk;
  return { ...dom, root, room, camera, controls, walk, mainContext, get taps() { return taps; },
    dispose() { walk.dispose(); controls.dispose(); } };
}

function pointer(f, type, id, x = 500, y = 350, extras = {}) {
  const values = { pointerId: id, pointerType: 'touch', button: 0, clientX: x, clientY: y, pageX: x, pageY: y, ...extras };
  dispatch(f.canvas, type, values);
  if (type === 'pointerup' || type === 'pointercancel') {
    dispatch(f.windowTarget, type, values);
    // Browsers also release the ended pointer's capture, including when it was
    // the first of a two-finger gesture. QAElement intentionally does not fake it.
    if (f.canvas.hasPointerCapture(id)) {
      f.canvas.releasePointerCapture(id);
      dispatch(f.canvas, 'lostpointercapture', values);
    }
  }
}
function drag(f, id = 1, extras = {}) {
  pointer(f, 'pointerdown', id, 500, 350, extras);
  pointer(f, 'pointermove', id, 560, 378, extras);
}
function frame(f) { f.controls.update(); f.room.constrain(); }
function direction(f) { return f.camera.position.clone().sub(f.controls.target).normalize(); }
function snapshot(f) { return captureIsometricState(f.room, f.camera, f.controls); }
function nearVector(actual, expected, label) {
  assert.ok(actual.distanceTo(expected) < 1e-9, `${label}: ${actual.toArray()} != ${expected.toArray()}`);
}
function nearProjection(f, expected, label) {
  assert.equal(f.camera.zoom, expected.zoom, `${label}: zoom must remain exact`);
  for (const [field, value] of Object.entries(expected)) assert.ok(Math.abs(f.camera[field] - value) < 1e-10, `${label}: ${field} must not jump`);
  for (const value of f.camera.projectionMatrix.elements) assert.ok(Number.isFinite(value));
}
function assertRest(f) {
  assert.deepEqual(f.controls._pointers, []);
  assert.deepEqual(f.controls._pointerPositions, {});
  assert.equal(f.controls.state, -1);
  assert.equal(f.controls._sphericalDelta.theta, 0);
  assert.equal(f.controls._sphericalDelta.phi, 0);
  assert.equal(f.controls._panOffset.lengthSq(), 0);
  assert.equal(f.controls._scale, 1);
  assert.equal(f.controls._performCursorZoom, false);
  assert.equal(f.canvas.captured.size, 0);
}

for (const pointerType of ['touch', 'mouse']) test(`vendor input: ${pointerType} single-pointer drag pans without changing any curated angle`, () => {
  const f = fixture();
  for (const preset of CAMERA_PRESETS) {
    f.room.selectPreset(preset.id, 1000, { reducedMotion: true });
    const before = direction(f), target = f.controls.target.clone(), projection = snapshot(f).projection;
    assert.ok(Math.abs(Math.atan2(before.x, before.z) - ({ classic: Math.PI / 4, left: 0, right: Math.PI / 2 }[preset.id])) < 1e-12, 'Real controls reach the exact preset before a gesture');
    drag(f, 1, { pointerType });
    assert.ok(f.controls.target.distanceTo(target) > .001, 'Primary drag moves the screen-space target');
    nearVector(direction(f), before, 'Primary drag preserves preset direction');
    nearProjection(f, projection, 'Primary drag preserves the per-angle frustum');
    for (const [x, y] of [[1e6, 1e6], [-1e6, -1e6]]) {
      pointer(f, 'pointermove', 1, x, y, { pointerType }); frame(f);
      nearVector(direction(f), before, 'Even extreme primary drag cannot rotate');
      const limits = f.room.panLimits(), xTarget = f.controls.target.dot(f.room.frame.right), yTarget = f.controls.target.dot(f.room.frame.up);
      assert.ok(xTarget >= limits.minX - 1e-7 && xTarget <= limits.maxX + 1e-7);
      assert.ok(yTarget >= limits.minY - 1e-7 && yTarget <= limits.maxY + 1e-7);
      assert.equal(f.room.selectedPreset, preset.id);
    }
    cancelOrbitGesture(f.controls); assertRest(f);
  }
  f.dispose();
});

test('vendor input: two-finger pan and pinch preserve orientation and both remain usable after cancellation', () => {
  const f = fixture(), before = direction(f), target = f.controls.target.clone(), zoom = f.camera.zoom;
  pointer(f, 'pointerdown', 1, 450, 350); pointer(f, 'pointerdown', 2, 650, 350);
  pointer(f, 'pointermove', 1, 400, 380); pointer(f, 'pointermove', 2, 720, 380);
  assert.notEqual(f.camera.zoom, zoom);
  assert.ok(f.controls.target.distanceTo(target) > .001);
  nearVector(direction(f), before, 'pinch must not orbit');
  cancelOrbitGesture(f.controls); assertRest(f);
  const afterPinchTarget = f.controls.target.clone();
  drag(f, 3); assert.ok(f.controls.target.distanceTo(afterPinchTarget) > .001);
  nearVector(direction(f), before, 'Fresh single-finger pan must not orbit');
  cancelOrbitGesture(f.controls); f.dispose();
});

test('cancelOrbitGesture clears every capture, modifier and listener without camera motion or recursive cancellation', () => {
  const f = fixture(); drag(f);
  pointer(f, 'pointerdown', 2, 720, 350); f.canvas.setPointerCapture(2);
  dispatch(f.documentTarget, 'keydown', { key: 'Control' });
  assert.equal(f.controls._controlActive, true);
  f.controls._scale = 1.5; f.controls._performCursorZoom = true;
  const before = snapshot(f);
  let captureLosses = 0, endings = 0;
  f.controls.addEventListener('end', () => { endings++; cancelOrbitGesture(f.controls); });
  f.canvas.addEventListener('lostpointercapture', () => { captureLosses++; cancelOrbitGesture(f.controls); });
  const release = f.canvas.releasePointerCapture.bind(f.canvas);
  f.canvas.releasePointerCapture = id => { release(id); dispatch(f.canvas, 'lostpointercapture', { pointerId: id }); };
  cancelOrbitGesture(f.controls);
  assert.deepEqual(snapshot(f), before, 'cancel must never call update or consume damping');
  assertRest(f); assert.equal(captureLosses, 2); assert.equal(endings, 1);
  assert.equal(f.controls._controlActive, false);
  pointer(f, 'pointermove', 1, 900, 700); pointer(f, 'pointermove', 2, 200, 100);
  assert.deepEqual(snapshot(f), before, 'late pointer moves cannot resume a cancelled gesture');
  for (let i = 0; i < 5; i++) frame(f);
  nearVector(f.camera.position, before.position, 'later frames stay at the saved position');
  nearVector(f.controls.target, before.target, 'later frames stay at the saved target');
  f.dispose();
});

for (const view of ['overview', 'lower', 'upper', 'bear', 'piano']) test(`${view}: real vendor repeated walking transitions preserve the selected preset, pan, zoom and controls exactly`, () => {
  const f = fixture(view);
  for (let round = 0; round < 3; round++) {
    const preset = CAMERA_PRESETS[round];
    f.room.selectPreset(preset.id, 1000, { reducedMotion: true });
    drag(f, round + 1); f.room.panByPixels(12, -8);
    const before = snapshot(f), beforeDirection = direction(f);
    f.walk.enter();
    assert.equal(f.walk.active, true); assert.equal(f.controls.enabled, false);
    assertRest(f);
    f.walk.yaw += .2; f.walk.pitch += .1; f.walk.update(.03);
    f.walk.exit();
    assert.deepEqual(snapshot(f), before); assert.equal(f.room.selectedPreset, preset.id);
    nearVector(f.room.frame.right, new Vector3(1, 0, 0).applyQuaternion(f.camera.quaternion), 'restored horizontal frame');
    for (let i = 0; i < 5; i++) frame(f);
    nearVector(direction(f), beforeDirection, 'rotation cannot spring after exit');
    nearVector(f.camera.position, before.position, 'pan cannot drift after exit');
    nearVector(f.controls.target, before.target, 'target cannot drift after exit');
    nearProjection(f, before.projection, 'Later exterior frames retain the saved frustum and zoom'); assertRest(f);
  }
  f.dispose();
});

test('walking resize preserves the selected preset and zoom; subsequent floor and reset discard old gestures', () => {
  const f = fixture('piano'); f.room.selectPreset('left', 1000, { reducedMotion: true }); drag(f);
  const beforeDirection = direction(f), zoom = f.camera.zoom;
  f.walk.enter(); f.walk.resize(390, 844); f.walk.exit();
  assert.equal(f.room.view, 'piano'); assert.equal(f.camera.zoom, zoom);
  assert.equal(f.room.viewport.width, 390); assert.equal(f.room.viewport.height, 844);
  nearVector(direction(f), beforeDirection, 'resize must preserve selected angle');
  assert.equal(f.room.selectedPreset, 'left');
  assertRest(f);
  drag(f, 2); f.walk.enter(); f.walk.exit(); f.room.setView('upper'); f.room.fit(390, 844);
  const canonical = new Vector3(1, 1, 1).normalize();
  nearVector(direction(f), canonical, 'floor button restores classic preset');
  assert.equal(f.room.selectedPreset, 'classic');
  assertRest(f);
  drag(f, 3); f.room.reset(390, 844); const reset = snapshot(f);
  pointer(f, 'pointermove', 3, 900, 700); for (let i = 0; i < 5; i++) frame(f);
  nearVector(direction(f), canonical, 'reset keeps classic direction');
  assert.equal(f.room.selectedPreset, 'classic');
  nearVector(f.camera.position, reset.position, 'old gesture cannot move reset camera');
  assertRest(f); f.dispose();
});

test('context-style input suspension keeps roaming active and requires fresh input after recovery', () => {
  const f = fixture(); drag(f); const exterior = snapshot(f); f.walk.enter();
  pointer(f, 'pointerdown', 8); pointer(f, 'pointermove', 8, 540, 390);
  dispatch(f.windowTarget, 'keydown', { code: 'KeyW' });
  const walkImage = f.walk.camera.matrixWorld.toArray();
  f.walk.setInputEnabled(false); cancelOrbitGesture(f.controls);
  f.walk.update(.04); assert.equal(f.walk.active, true);
  assert.deepEqual(f.walk.camera.matrixWorld.toArray(), walkImage);
  f.walk.setInputEnabled(true);
  pointer(f, 'pointermove', 8, 900, 700); pointer(f, 'pointerup', 8, 900, 700);
  dispatch(f.windowTarget, 'keydown', { code: 'KeyW', repeat: true });
  assert.equal(f.walk.keys.size, 0); assert.equal(f.walk.lookPointers.size, 0);
  f.walk.exit(); assert.deepEqual(snapshot(f), exterior); assertRest(f); f.dispose();
});

test('main capture hooks with real controls distinguish drags, taps, multitouch and interruption without false object clicks', () => {
  const f = fixture('overview', { mainInput: true });
  drag(f); pointer(f, 'pointerup', 1, 560, 378);
  assert.equal(f.taps, 0, 'panning is not an object tap');
  cancelOrbitGesture(f.controls);
  const beforeTap = snapshot(f);
  pointer(f, 'pointerdown', 2); pointer(f, 'pointermove', 2, 503, 352); pointer(f, 'pointerup', 2, 503, 352);
  assert.equal(f.taps, 1, 'short stationary object tap still works');
  nearVector(f.camera.position, beforeTap.position, 'tap restores position');
  nearVector(f.controls.target, beforeTap.target, 'tap restores target');
  assert.ok(f.camera.quaternion.angleTo(beforeTap.quaternion) < 1e-7, 'tap restores orientation');
  for (let i = 0; i < 5; i++) frame(f);
  nearVector(f.camera.position, beforeTap.position, 'tap cannot leak pan inertia');
  pointer(f, 'pointerdown', 3); pointer(f, 'pointerdown', 4, 700, 350);
  pointer(f, 'pointerup', 3); pointer(f, 'pointerup', 4, 700, 350);
  assert.equal(f.taps, 1, 'multitouch is never an object tap');
  for (const interruptedBy of ['pointercancel', 'blur', 'pagehide', 'visibilitychange']) {
    drag(f, 5);
    if (interruptedBy === 'pointercancel') pointer(f, interruptedBy, 5, 560, 378);
    else if (interruptedBy === 'visibilitychange') {
      f.documentTarget.visibilityState = 'hidden'; dispatch(f.documentTarget, interruptedBy);
      f.documentTarget.visibilityState = 'visible'; dispatch(f.documentTarget, interruptedBy);
    } else dispatch(f.windowTarget, interruptedBy);
    assertRest(f); const stopped = snapshot(f);
    pointer(f, 'pointermove', 5, 900, 700); pointer(f, 'pointerup', 5, 900, 700);
    for (let i = 0; i < 5; i++) frame(f);
    assert.equal(f.taps, 1, `${interruptedBy} cannot synthesize a click`);
    nearVector(f.camera.position, stopped.position, `${interruptedBy} stops all drift`);
    drag(f, 6); assert.ok(f.controls._pointers.includes(6), 'fresh gestures reconnect after interruption');
    cancelOrbitGesture(f.controls); vm.runInContext('Xr()', f.mainContext);
  }
  pointer(f, 'pointerdown', 7); pointer(f, 'pointerup', 7);
  assert.equal(f.taps, 2, 'fresh taps still work after interrupted gestures');
  f.dispose();
});

test('main capture hooks preserve the remaining finger after a normal two-touch release and still reject taps', () => {
  const f = fixture('overview', { mainInput: true });
  pointer(f, 'pointerdown', 1, 450, 350); pointer(f, 'pointerdown', 2, 650, 350);
  pointer(f, 'pointermove', 1, 420, 360); pointer(f, 'pointermove', 2, 680, 360);
  pointer(f, 'pointerup', 1, 420, 360);
  assert.deepEqual(f.controls._pointers, [2], 'normal lost capture must not cancel the surviving finger');
  const before = direction(f), target = f.controls.target.clone();
  pointer(f, 'pointermove', 2, 710, 360);
  assert.ok(f.controls.target.distanceTo(target) > .001, 'the survivor resumes single-finger pan');
  nearVector(direction(f), before, 'The surviving finger cannot change the curated angle');
  pointer(f, 'pointerup', 2, 710, 360);
  assert.equal(f.taps, 0, 'a two-finger gesture cannot become a scene tap');
  drag(f, 3); dispatch(f.canvas, 'lostpointercapture', { pointerId: 3 });
  assertRest(f); assert.equal(f.taps, 0, 'unexpected capture loss still cancels every pending action');
  f.dispose();
});


test('real vendor gestures are fully discarded when selecting or retargeting a preset', () => {
  const f = fixture('overview', { mainInput: true });
  drag(f); pointer(f, 'pointerdown', 2, 700, 350);
  assert.equal(f.controls._pointers.length, 2);
  const beforeSelection = snapshot(f);
  f.room.selectPreset('left', 1000);
  assertRest(f); assert.equal(f.room.transitioning, true);
  nearVector(f.camera.position, beforeSelection.position, 'Selection starts at the visible frame');
  assert.deepEqual(snapshot(f).projection, beforeSelection.projection, 'Selection cannot jump the frustum');
  pointer(f, 'pointermove', 1, 1100, 750); pointer(f, 'pointermove', 2, 300, 100);
  nearVector(f.camera.position, beforeSelection.position, 'Old pointer owners cannot alter a new transition');
  f.room.updateTransition(1210);
  const beforeRetarget = snapshot(f);
  f.room.selectPreset('right', 1210);
  assertRest(f); assert.equal(f.room.selectedPreset, 'right');
  nearVector(f.camera.position, beforeRetarget.position, 'Retargeting does not jump position');
  nearVector(f.controls.target, beforeRetarget.target, 'Retargeting does not jump focus');
  assert.deepEqual(snapshot(f).projection, beforeRetarget.projection, 'Retargeting cannot jump scale or zoom');
  f.room.updateTransition(1210 + PRESET_TRANSITION_MS);
  assert.equal(f.room.transitioning, false);
  const stopped = snapshot(f);
  pointer(f, 'pointerup', 1, 1100, 750); pointer(f, 'pointerup', 2, 300, 100);
  for (let i = 0; i < 5; i++) frame(f);
  assert.equal(f.taps, 0); nearVector(f.camera.position, stopped.position, 'Late release cannot leak previous pan momentum');
  f.dispose();
});

test('main pointer capture freezes a preset tween before tap snapshot and never resumes it after release', () => {
  const f = fixture('overview', { mainInput: true });
  f.room.selectPreset('right', 1000); f.room.updateTransition(1210);
  const visible = snapshot(f), visibleDirection = direction(f);
  pointer(f, 'pointerdown', 1);
  assert.equal(f.room.transitioning, false); assert.equal(f.room.selectedPreset, null);
  nearVector(f.camera.position, visible.position, 'Pointer capture freezes the visible position');
  nearVector(direction(f), visibleDirection, 'Pointer capture freezes the visible angle');
  nearProjection(f, visible.projection, 'Pointer capture freezes the interpolated frustum');
  pointer(f, 'pointerup', 1); assert.equal(f.taps, 1); assertRest(f);
  assert.equal(f.room.updateTransition(100000), false);
  for (let i = 0; i < 5; i++) frame(f);
  nearVector(f.camera.position, visible.position, 'Completed tap cannot resume the cancelled tween');
  nearProjection(f, visible.projection, 'Completed tap cannot resume fitting');
  f.dispose();
});

for (const event of ['blur', 'pagehide', 'visibilitychange', 'webglcontextlost']) test(`main ${event} hook freezes an unfinished preset and clears real vendor inputs`, () => {
  const f = fixture('overview', { mainInput: true });
  f.room.selectPreset('right', 1000); f.room.updateTransition(1210);
  const before = snapshot(f);
  if (event === 'visibilitychange') {
    f.documentTarget.visibilityState = 'hidden'; dispatch(f.documentTarget, event);
  } else if (event === 'webglcontextlost') {
    const lost = dispatch(f.canvas, event);
    assert.equal(lost.defaultPrevented, true);
    assert.equal(f.mainContext.cs, false); assert.equal(f.mainContext.graphicsAvailable, false);
    assert.equal(f.mainContext.preparationAbort.signal.aborted, true); assert.equal(f.controls.enabled, false);
  } else dispatch(f.windowTarget, event);
  assert.equal(f.room.transitioning, false); assert.equal(f.room.selectedPreset, null); assertRest(f);
  assert.equal(f.room.updateTransition(100000), false);
  for (let i = 0; i < 5; i++) frame(f);
  nearVector(f.camera.position, before.position, `${event} preserves the last visible camera position`);
  nearVector(f.controls.target, before.target, `${event} preserves the last visible focus`);
  nearProjection(f, before.projection, `${event} preserves the last visible frustum`);
  assert.equal(f.taps, 0);
  if (event === 'visibilitychange') {
    f.documentTarget.visibilityState = 'visible'; dispatch(f.documentTarget, event);
  } else if (event === 'webglcontextlost') {
    // Re-enable only the actual input-ready hook; no GPU/context restore claim.
    vm.runInContext('cs = true; graphicsAvailable = true; setRoomReady(true)', f.mainContext);
  }
  assert.equal(f.room.transitioning, false);
  pointer(f, 'pointerdown', 2); pointer(f, 'pointerup', 2);
  assert.equal(f.taps, 1, 'A fresh scene tap still works after input recovery');
  f.dispose();
});

test('real wheel zoom cancels a preset tween while preserving its visible angle', () => {
  const f = fixture('overview', { mainInput: true });
  f.room.selectPreset('left', 1000); f.room.updateTransition(1210);
  const before = direction(f), zoom = f.camera.zoom;
  dispatch(f.canvas, 'wheel', { deltaY: 120, deltaMode: 0, clientX: 500, clientY: 350, ctrlKey: false });
  assert.equal(f.room.transitioning, false); assert.equal(f.room.selectedPreset, null);
  assert.notEqual(f.camera.zoom, zoom);
  nearVector(direction(f), before, 'Wheel zoom preserves the interpolated angle');
  assert.equal(f.room.updateTransition(100000), false); assert.equal(f.taps, 0);
  cancelOrbitGesture(f.controls); f.dispose();
});

test('actual resize and floor hooks cancel a tween, preserve resize pose, then restore classic floor framing', () => {
  const f = fixture('piano', { mainInput: true });
  f.room.selectPreset('left', 1000); f.room.updateTransition(1210);
  const before = direction(f), zoom = f.camera.zoom;
  f.mainContext.innerWidth = 390; f.mainContext.innerHeight = 844;
  dispatch(f.windowTarget, 'resize');
  assert.equal(f.room.transitioning, false); assert.equal(f.room.selectedPreset, null);
  assert.equal(f.room.viewport.width, 390); assert.equal(f.room.viewport.height, 844);
  nearVector(direction(f), before, 'Resize preserves the visible direction'); assert.equal(f.camera.zoom, zoom);
  f.room.selectPreset('right', 2000); f.room.updateTransition(2210);
  vm.runInContext('gv("upper")', f.mainContext);
  assert.equal(f.room.transitioning, false); assert.equal(f.room.selectedPreset, 'classic');
  assert.equal(f.room.view, 'upper'); assert.equal(f.camera.zoom, 1);
  nearVector(direction(f), new Vector3(1, 1, 1).normalize(), 'Floor navigation restores the classic preset');
  assert.equal(f.room.updateTransition(100000), false); assertRest(f); f.dispose();
});

test('walking halfway through a preset saves exactly that visible frame and never resumes the tween on exit', () => {
  const f = fixture('lower');
  f.room.selectPreset('left', 1000); f.room.updateTransition(1210);
  const visible = snapshot(f); visible.selectedPreset = null;
  f.walk.enter(); assert.equal(f.walk.active, true); assert.equal(f.room.transitioning, false);
  assert.equal(f.room.selectedPreset, null); assertRest(f);
  f.walk.update(.03); f.walk.exit();
  assert.deepEqual(snapshot(f), visible);
  assert.equal(f.room.updateTransition(100000), false);
  for (let i = 0; i < 5; i++) frame(f);
  nearVector(f.camera.position, visible.position, 'Walking exit preserves the mid-transition camera exactly');
  nearVector(f.controls.target, visible.target, 'Walking exit preserves the mid-transition focus exactly');
  nearProjection(f, visible.projection, 'Walking exit preserves the interrupted per-angle frustum');
  f.dispose();
});
