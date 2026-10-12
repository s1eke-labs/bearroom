import test from 'node:test';
import assert from 'node:assert/strict';
import { FirstPersonController, WALK_VIEW } from '../src/first-person.js';
import { Gr as OrthographicCamera, L as Vector3, Mh as Scene } from '../vendor/runtime-v11.js';
import { qaDOM, dispatch } from './walk-qa-helpers.mjs';

// Input-only fixtures deliberately avoid browser/GPU and model dependencies.
function fixture() {
  const dom = qaDOM(), root = new Scene();
  const navigation = {
    position: new Vector3(), reset() {}, move() {},
    eyePosition(out) { return out.copy(this.position).add(new Vector3(0, 1.6, 0)); },
  };
  let taps = 0;
  const controller = new FirstPersonController({
    ...dom, root, navigation, room: { view: 'overview' },
    isometricCamera: new OrthographicCamera(-12, 12, 10, -10, .1, 100),
    orbitControls: { target: new Vector3(), enabled: true },
    onTap() { taps++; },
  });
  controller.enter();
  return { ...dom, controller, get taps() { return taps; } };
}
function pointer(target, type, id, x = 400, y = 300) {
  dispatch(target, type, { pointerId: id, clientX: x, clientY: y, button: 0, pointerType: 'touch' });
}
const orientation = controller => [controller.yaw, controller.pitch];
function near(actual, expected) { assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} != ${expected}`); }

for (const end of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  for (const lifted of [1, 2]) test(`touch handoff: ${end} of pointer ${lifted} resumes the survivor without jumping`, () => {
    const f = fixture(), c = f.controller, survivor = lifted === 1 ? 2 : 1;
    pointer(f.canvas, 'pointerdown', 1, 400, 300);
    pointer(f.canvas, 'pointerdown', 2, 850, 550);
    pointer(f.canvas, 'pointermove', survivor, 700, 450);
    const before = orientation(c);
    pointer(end === 'lostpointercapture' ? f.canvas : f.windowTarget, end, lifted, 1100, 800);
    assert.equal(c.lookPointerId, survivor);
    assert.deepEqual(orientation(c), before, 'handoff itself cannot rotate the camera');
    assert.equal(c.lookPointers.get(survivor).multi, true);
    pointer(f.canvas, 'pointermove', survivor, 710, 445);
    near(c.yaw, before[0] - 10 * WALK_VIEW.lookSensitivity);
    near(c.pitch, before[1] + 5 * WALK_VIEW.lookSensitivity);
    pointer(f.windowTarget, 'pointerup', survivor, 710, 445);
    assert.equal(f.taps, 0);
    assert.equal(c.lookPointers.size, 0);
    assert.equal(c.lookPointerId, null);
    c.dispose();
  });
}

test('touch handoff: repeated three-pointer gestures resume only when one remains and never tap', () => {
  const f = fixture(), c = f.controller;
  for (let round = 0; round < 4; round++) {
    pointer(f.canvas, 'pointerdown', 1);
    pointer(f.canvas, 'pointerdown', 2);
    pointer(f.canvas, 'pointerdown', 3);
    const before = orientation(c);
    pointer(f.windowTarget, 'pointerup', 1);
    pointer(f.canvas, 'pointermove', 2, 403, 301);
    assert.deepEqual(orientation(c), before, 'two remaining pointers must still pause looking');
    pointer(f.windowTarget, 'pointerup', 3);
    assert.equal(c.lookPointerId, 2);
    pointer(f.canvas, 'pointermove', 2, 405, 302);
    near(c.yaw, before[0] - 2 * WALK_VIEW.lookSensitivity);
    pointer(f.windowTarget, 'pointerup', 2, 405, 302);
    assert.equal(f.taps, 0, 'even a small resumed gesture is not a tap');
    assert.equal(f.canvas.captured.size, 0);
  }
  pointer(f.canvas, 'pointerdown', 4);
  pointer(f.windowTarget, 'pointerup', 4);
  assert.equal(f.taps, 1, 'a fresh single-pointer tap still works');
  c.dispose();
});

test('touch handoff: joystick stays independent while canvas ownership transfers', () => {
  const f = fixture(), c = f.controller;
  pointer(f.joystick, 'pointerdown', 10, 80, 610);
  const stick = { ...c.stick };
  pointer(f.canvas, 'pointerdown', 1);
  pointer(f.canvas, 'pointerdown', 2);
  pointer(f.windowTarget, 'pointerup', 1);
  pointer(f.canvas, 'pointermove', 2, 420, 300);
  near(c.yaw, -20 * WALK_VIEW.lookSensitivity);
  assert.deepEqual(c.stick, stick);
  assert.equal(c.joystickPointerId, 10);
  assert.equal(f.joystick.hasPointerCapture(10), true);
  pointer(f.windowTarget, 'pointercancel', 10);
  assert.equal(c.lookPointerId, 2);
  pointer(f.canvas, 'pointermove', 2, 430, 300);
  near(c.yaw, -30 * WALK_VIEW.lookSensitivity);
  pointer(f.windowTarget, 'pointerup', 2, 430, 300);
  assert.equal(f.taps, 0);
  assert.deepEqual(c.stick, { x: 0, z: 0 });
  c.dispose();
});

for (const interrupt of ['clearInput', 'blur', 'pagehide', 'visibilitychange', 'exit']) test(`touch handoff: ${interrupt} clears ownership and late events cannot revive gestures`, () => {
  const f = fixture(), c = f.controller;
  pointer(f.canvas, 'pointerdown', 1);
  pointer(f.canvas, 'pointerdown', 2);
  pointer(f.windowTarget, 'pointerup', 1);
  if (interrupt === 'clearInput' || interrupt === 'exit') c[interrupt]();
  else dispatch(interrupt === 'visibilitychange' ? f.documentTarget : f.windowTarget, interrupt);
  const before = orientation(c);
  pointer(f.canvas, 'pointermove', 2, 800, 500);
  pointer(f.canvas, 'lostpointercapture', 1);
  pointer(f.windowTarget, 'pointerup', 2, 800, 500);
  assert.deepEqual(orientation(c), before);
  assert.equal(c.lookPointerId, null);
  assert.equal(c.lookPointers.size, 0);
  assert.equal(f.canvas.captured.size, 0);
  assert.equal(f.taps, 0);
  c.enter();
  pointer(f.canvas, 'pointerdown', 3);
  pointer(f.canvas, 'pointermove', 3, 410, 300);
  near(c.yaw, before[0] - 10 * WALK_VIEW.lookSensitivity);
  c.dispose();
});
