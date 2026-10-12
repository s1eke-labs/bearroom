import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { FirstPersonController, captureIsometricState } from '../src/first-person.js';
import { IsometricRoom, configureControls } from '../src/camera.js';
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
      cancelOrbitGesture, _i: 0, Hs: null, Cr: 0, Ei: false, cancelAnimationFrame() {}, cl() {},
      roomInteractions: { target() { return true; }, interact() { taps++; }, resetKeys() {} },
    });
    assert.ok(visibilityInputSource, 'test must run the actual visibility interruption hook');
    vm.runInContext(`${mainInputSource}\n${resetInputSource}\n${visibilityInputSource}`, mainContext);
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

for (const pointerType of ['touch', 'mouse']) test(`vendor input: ${pointerType} single-pointer drag rotates the dollhouse within both limits`, () => {
  const f = fixture(), before = direction(f);
  drag(f, 1, { pointerType });
  assert.ok(direction(f).distanceTo(before) > .001);
  for (const [x, y] of [[1e6, 1e6], [-1e6, -1e6]]) {
    pointer(f, 'pointermove', 1, x, y, { pointerType }); frame(f);
    assert.ok(f.controls.getAzimuthalAngle() >= f.controls.minAzimuthAngle - 1e-10);
    assert.ok(f.controls.getAzimuthalAngle() <= f.controls.maxAzimuthAngle + 1e-10);
    assert.ok(f.controls.getPolarAngle() >= f.controls.minPolarAngle - 1e-10);
    assert.ok(f.controls.getPolarAngle() <= f.controls.maxPolarAngle + 1e-10);
  }
  cancelOrbitGesture(f.controls); f.dispose();
});

test('vendor input: two-finger pan and pinch preserve orientation and both remain usable after cancellation', () => {
  const f = fixture(), before = direction(f), target = f.controls.target.clone(), zoom = f.camera.zoom;
  pointer(f, 'pointerdown', 1, 450, 350); pointer(f, 'pointerdown', 2, 650, 350);
  pointer(f, 'pointermove', 1, 400, 380); pointer(f, 'pointermove', 2, 720, 380);
  assert.notEqual(f.camera.zoom, zoom);
  assert.ok(f.controls.target.distanceTo(target) > .001);
  nearVector(direction(f), before, 'pinch must not orbit');
  cancelOrbitGesture(f.controls); assertRest(f);
  drag(f, 3); assert.ok(direction(f).distanceTo(before) > .001);
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

for (const view of ['overview', 'lower', 'upper', 'bear', 'piano']) test(`${view}: real vendor repeated walking transitions preserve the current rotation, pan, zoom and controls exactly`, () => {
  const f = fixture(view);
  for (let round = 0; round < 3; round++) {
    drag(f, round + 1); f.room.panByPixels(12, -8);
    const before = snapshot(f), beforeDirection = direction(f);
    f.walk.enter();
    assert.equal(f.walk.active, true); assert.equal(f.controls.enabled, false);
    assertRest(f);
    f.walk.yaw += .2; f.walk.pitch += .1; f.walk.update(.03);
    f.walk.exit();
    assert.deepEqual(snapshot(f), before);
    nearVector(f.room.frame.right, new Vector3(1, 0, 0).applyQuaternion(f.camera.quaternion), 'restored horizontal frame');
    for (let i = 0; i < 5; i++) frame(f);
    nearVector(direction(f), beforeDirection, 'rotation cannot spring after exit');
    nearVector(f.camera.position, before.position, 'pan cannot drift after exit');
    nearVector(f.controls.target, before.target, 'target cannot drift after exit');
    assert.equal(f.camera.zoom, before.projection.zoom); assertRest(f);
  }
  f.dispose();
});

test('walking resize preserves the rotated direction and zoom; subsequent floor and reset discard old gestures', () => {
  const f = fixture('piano'); drag(f);
  const beforeDirection = direction(f), zoom = f.camera.zoom;
  f.walk.enter(); f.walk.resize(390, 844); f.walk.exit();
  assert.equal(f.room.view, 'piano'); assert.equal(f.camera.zoom, zoom);
  assert.equal(f.room.viewport.width, 390); assert.equal(f.room.viewport.height, 844);
  nearVector(direction(f), beforeDirection, 'resize must preserve selected rotation');
  assertRest(f);
  drag(f, 2); f.walk.enter(); f.walk.exit(); f.room.setView('upper'); f.room.fit(390, 844);
  const canonical = new Vector3(1, 1, 1).normalize();
  nearVector(direction(f), canonical, 'floor button resets rotation');
  assertRest(f);
  drag(f, 3); f.room.reset(390, 844); const reset = snapshot(f);
  pointer(f, 'pointermove', 3, 900, 700); for (let i = 0; i < 5; i++) frame(f);
  nearVector(direction(f), canonical, 'reset discards prior angular momentum');
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
  assert.equal(f.taps, 0, 'rotation is not an object tap');
  cancelOrbitGesture(f.controls);
  const beforeTap = snapshot(f);
  pointer(f, 'pointerdown', 2); pointer(f, 'pointermove', 2, 503, 352); pointer(f, 'pointerup', 2, 503, 352);
  assert.equal(f.taps, 1, 'short stationary object tap still works');
  nearVector(f.camera.position, beforeTap.position, 'tap restores position');
  nearVector(f.controls.target, beforeTap.target, 'tap restores target');
  assert.ok(f.camera.quaternion.angleTo(beforeTap.quaternion) < 1e-7, 'tap restores orientation');
  for (let i = 0; i < 5; i++) frame(f);
  nearVector(f.camera.position, beforeTap.position, 'tap cannot leak angular inertia');
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
  const before = direction(f);
  pointer(f, 'pointermove', 2, 710, 360);
  assert.ok(direction(f).distanceTo(before) > .001, 'the survivor resumes single-finger rotation');
  pointer(f, 'pointerup', 2, 710, 360);
  assert.equal(f.taps, 0, 'a two-finger gesture cannot become a scene tap');
  drag(f, 3); dispatch(f.canvas, 'lostpointercapture', { pointerId: 3 });
  assertRest(f); assert.equal(f.taps, 0, 'unexpected capture loss still cancels every pending action');
  f.dispose();
});
