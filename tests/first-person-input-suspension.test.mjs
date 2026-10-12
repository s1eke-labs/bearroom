import test from 'node:test';
import assert from 'node:assert/strict';
import { FirstPersonController } from '../src/first-person.js';
import { Gr as OrthographicCamera, L as Vector3, Mh as Scene } from '../vendor/runtime-v11.js';
import { qaDOM, dispatch, QAElement } from './walk-qa-helpers.mjs';

function fixture() {
  const dom = qaDOM(), root = new Scene(), doorButton = new QAElement('door');
  const navigation = {
    position: new Vector3(), moves: 0, toggles: 0, reset() {},
    move(dt, input) { this.moves++; this.position.x += input.x * dt; this.position.z += input.z * dt; },
    eyePosition(out) { return out.copy(this.position).add(new Vector3(0, 1.6, 0)); },
    doorAction() { return { label: 'Open door' }; },
    toggleDoor() { this.toggles++; return { changed: true }; },
  };
  let taps = 0;
  const controller = new FirstPersonController({
    ...dom, root, doorButton, navigation, room: { view: 'overview' },
    isometricCamera: new OrthographicCamera(-12, 12, 10, -10, .1, 100),
    orbitControls: { target: new Vector3(), enabled: true }, onTap() { taps++; },
  });
  return { ...dom, doorButton, navigation, controller, get taps() { return taps; } };
}
function pointer(target, type, id, x = 400, y = 300) {
  dispatch(target, type, { pointerId: id, clientX: x, clientY: y, button: 0, pointerType: 'touch' });
}
function assertRest(f) {
  assert.equal(f.controller.keys.size, 0);
  assert.equal(f.controller.lookPointers.size, 0);
  assert.equal(f.controller.lookPointerId, null);
  assert.equal(f.controller.joystickPointerId, null);
  assert.deepEqual(f.controller.stick, { x: 0, z: 0 });
  assert.equal(f.canvas.captured.size, 0);
  assert.equal(f.joystick.captured.size, 0);
}

test('input suspension clears all held inputs without changing roaming mode, camera or door', () => {
  const f = fixture(), c = f.controller; c.enter();
  dispatch(f.windowTarget, 'keydown', { code: 'KeyW' });
  pointer(f.canvas, 'pointerdown', 1);
  pointer(f.canvas, 'pointermove', 1, 430, 310);
  pointer(f.joystick, 'pointerdown', 2, 80, 610);
  const camera = c.camera.matrixWorld.toArray(), position = f.navigation.position.clone();
  c.setInputEnabled(false);
  assertRest(f);
  assert.equal(c.active, true);
  assert.equal(c.getCamera(), c.camera);
  for (const code of ['KeyW', 'KeyD', 'KeyE', 'Escape']) dispatch(f.windowTarget, 'keydown', { code });
  pointer(f.canvas, 'pointerdown', 3);
  pointer(f.canvas, 'pointermove', 3, 800, 700);
  pointer(f.joystick, 'pointerdown', 4, 80, 610);
  pointer(f.joystick, 'pointermove', 4, 120, 660);
  dispatch(f.toggleButton, 'click'); dispatch(f.doorButton, 'click');
  c.interactDoor({ fromScene: true }); c.update(.05);
  assertRest(f);
  assert.equal(c.active, true);
  assert.equal(f.navigation.moves, 0);
  assert.equal(f.navigation.toggles, 0);
  assert.deepEqual(f.navigation.position, position);
  assert.deepEqual(c.camera.matrixWorld.toArray(), camera);
  assert.equal(f.taps, 0);
  c.dispose();
});

test('recovery needs fresh input; stale moves, releases and held-key repeats cannot resume motion', () => {
  const f = fixture(), c = f.controller; c.enter();
  dispatch(f.windowTarget, 'keydown', { code: 'KeyW' });
  pointer(f.canvas, 'pointerdown', 1);
  pointer(f.joystick, 'pointerdown', 2, 80, 610);
  c.setInputEnabled(false);
  dispatch(f.windowTarget, 'keydown', { code: 'KeyD' });
  c.setInputEnabled(true);
  dispatch(f.windowTarget, 'keydown', { code: 'KeyW', repeat: true });
  dispatch(f.windowTarget, 'keydown', { code: 'KeyD', repeat: true });
  pointer(f.canvas, 'pointermove', 1, 800, 700);
  pointer(f.joystick, 'pointermove', 2, 80, 610);
  pointer(f.windowTarget, 'pointerup', 1);
  pointer(f.windowTarget, 'pointerup', 2);
  const position = f.navigation.position.clone(); c.update(.05);
  assertRest(f);
  assert.deepEqual(f.navigation.position, position);
  assert.equal(c.yaw, 0);
  assert.equal(f.taps, 0);
  dispatch(f.windowTarget, 'keyup', { code: 'KeyW' });
  dispatch(f.windowTarget, 'keydown', { code: 'KeyW' }); c.update(.05);
  assert.ok(f.navigation.position.z < position.z);
  pointer(f.canvas, 'pointerdown', 3);
  pointer(f.canvas, 'pointermove', 3, 410, 300);
  assert.ok(c.yaw < 0);
  c.setInputEnabled(true); assertRest(f);
  c.dispose();
});

test('suspended fixed view cannot enter walking or change doors, and resumes on fresh toggle', () => {
  const f = fixture(), c = f.controller;
  c.setInputEnabled(false);
  dispatch(f.toggleButton, 'click'); c.enter();
  c.interactDoor({ fromScene: true });
  assert.equal(c.active, false);
  assert.equal(f.navigation.toggles, 0);
  c.setInputEnabled(true); dispatch(f.toggleButton, 'click');
  assert.equal(c.active, true);
  dispatch(f.doorButton, 'click'); assert.equal(f.navigation.toggles, 1);
  c.dispose();
});
