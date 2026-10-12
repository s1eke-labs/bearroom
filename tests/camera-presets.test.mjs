import test from 'node:test';
import assert from 'node:assert/strict';
import { CAMERA_LIMITS, CAMERA_PRESETS, DEFAULT_CAMERA_PRESET, PRESET_TRANSITION_MS, getCameraPreset } from '../src/camera-presets.js';
import { IsometricRoom, ROOM_ORBIT, configureControls } from '../src/camera.js';
import { Gr as OrthographicCamera, x0 as OrbitControls, L as Vector3 } from '../vendor/runtime-v11.js';
import { loadSceneForCPU } from './helpers.mjs';

const source = await loadSceneForCPU();
const radians = Math.PI / 180;
const near = (actual, expected, epsilon = 1e-9) => assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} != ${expected}`);
const nearVector = (actual, expected, epsilon = 1e-9) => assert.ok(actual.distanceTo(expected) <= epsilon, `${actual.toArray()} != ${expected.toArray()}`);
function fixture(view = 'overview', width = 1440, height = 900) {
  const root = source.clone(true);
  root.getObjectByName('Exterior_city')?.removeFromParent();
  const camera = new OrthographicCamera(-12, 12, 10, -10, .1, 100);
  const controls = new OrbitControls(camera);
  configureControls(controls);
  const room = new IsometricRoom(root, camera, controls);
  room.setView(view); room.fit(width, height);
  return { root, camera, controls, room };
}
function pose({ camera, controls }) {
  return { position: camera.position.clone(), target: controls.target.clone(), quaternion: camera.quaternion.clone(), zoom: camera.zoom, frustum: Object.fromEntries(["left", "right", "top", "bottom"].map(key => [key, camera[key]])) };
}
function assertPose(f, expected) {
  nearVector(f.camera.position, expected.position);
  nearVector(f.controls.target, expected.target);
  for (const axis of ['x', 'y', 'z', 'w']) near(f.camera.quaternion[axis], expected.quaternion[axis]);
  assert.equal(f.camera.zoom, expected.zoom);
  for (const [key, value] of Object.entries(expected.frustum)) near(f.camera[key], value);
}
function assertSafe(f) {
  const { camera, controls, room } = f, direction = room.direction();
  const yaw = Math.atan2(direction.x, direction.z), elevation = Math.asin(direction.y);
  assert.ok(yaw >= CAMERA_LIMITS.minAzimuth - 1e-12 && yaw <= CAMERA_LIMITS.maxAzimuth + 1e-12);
  assert.ok(elevation >= CAMERA_LIMITS.minElevation - 1e-12 && elevation <= CAMERA_LIMITS.maxElevation + 1e-12);
  for (const number of [...camera.position, ...controls.target, ...camera.projectionMatrix.elements, camera.zoom]) assert.ok(Number.isFinite(number));
  near(camera.position.distanceTo(controls.target), ROOM_ORBIT.distance);
  near(controls.target.clone().sub(room.orbitCenter).dot(direction), 0);
  near(room.frame.right.dot(room.frame.up), 0);
  const limits = room.panLimits(), x = controls.target.dot(room.frame.right), y = controls.target.dot(room.frame.up);
  assert.ok(x >= limits.minX - 1e-7 && x <= limits.maxX + 1e-7);
  assert.ok(y >= limits.minY - 1e-7 && y <= limits.maxY + 1e-7);
}
function assertPreset(f, id) {
  const preset = getCameraPreset(id), direction = f.room.direction();
  near(Math.atan2(direction.x, direction.z), preset.azimuth);
  near(Math.asin(direction.y), preset.elevation);
  assert.equal(f.room.selectedPreset, id);
  assert.equal(f.room.transitioning, false);
  assertSafe(f);
}

test('the three immutable compositions expose the classic diagonal and true orthogonal axial views', () => {
  assert.equal(DEFAULT_CAMERA_PRESET, 'classic');
  assert.equal(PRESET_TRANSITION_MS, 420);
  assert.deepEqual(CAMERA_PRESETS.map(preset => preset.id), ['classic', 'left', 'right']);
  assert.ok(Object.isFrozen(CAMERA_PRESETS)); assert.ok(Object.isFrozen(CAMERA_LIMITS));
  for (const preset of CAMERA_PRESETS) {
    assert.ok(Object.isFrozen(preset));
    assert.ok(preset.azimuth >= CAMERA_LIMITS.minAzimuth && preset.azimuth <= CAMERA_LIMITS.maxAzimuth);
    assert.ok(preset.elevation >= CAMERA_LIMITS.minElevation && preset.elevation <= CAMERA_LIMITS.maxElevation);
  }
  near(getCameraPreset('classic').azimuth, 45 * radians);
  near(getCameraPreset('classic').elevation, Math.asin(1 / Math.sqrt(3)));
  assert.deepEqual(CAMERA_PRESETS.map(preset => preset.label), ['经典', '正左', '正右']);
  near(getCameraPreset('left').azimuth, 0);
  near(getCameraPreset('right').azimuth, Math.PI / 2);
  for (const preset of CAMERA_PRESETS) near(preset.elevation, getCameraPreset('classic').elevation);
  near(CAMERA_LIMITS.minAzimuth, 0); near(CAMERA_LIMITS.maxAzimuth, Math.PI / 2);
  assert.equal(getCameraPreset('free-orbit'), null);
});

test('preset transitions are finite, smooth, exact at 420ms and unaffected by vendor update', () => {
  const f = fixture(), { room, camera, controls } = f;
  camera.zoom = 2.8; room.constrain(); room.panByPixels(60, -35);
  const original = pose(f), frameUp = room.frame.up, frameRight = room.frame.right;
  const originalHalfHeight = (camera.top - camera.bottom) / 2;
  let previousHalfHeight = originalHalfHeight;
  assert.equal(room.selectPreset('left', 1000), true);
  assertPose(f, original); assert.equal(room.transitioning, true); assert.equal(room.selectedPreset, 'left');
  let previousYaw = Math.atan2(room.direction().x, room.direction().z);
  for (let elapsed = 0; elapsed <= PRESET_TRANSITION_MS; elapsed += 14) {
    assert.equal(room.updateTransition(1000 + elapsed), true);
    const beforeControls = room.direction();
    controls.update(); room.constrain();
    nearVector(room.direction(), beforeControls);
    const yaw = Math.atan2(room.direction().x, room.direction().z);
    assert.ok(yaw <= previousYaw + 1e-12);
    assert.ok(Math.abs(yaw - previousYaw) < 2.3 * radians, 'No one-frame angular jump');
    previousYaw = yaw;
    assert.equal(camera.zoom, original.zoom);
    const halfHeight = (camera.top - camera.bottom) / 2;
    assert.ok(Math.abs(halfHeight / previousHalfHeight - 1) < .03, "The per-angle fit changes continuously");
    previousHalfHeight = halfHeight;
    near((camera.right - camera.left) / (camera.top - camera.bottom), 1440 / 900);
    assertSafe(f);
  }
  assertPreset(f, 'left');
  assert.ok(Math.abs(previousHalfHeight - originalHalfHeight) > .1, 'Axial endpoint receives its own framing');
  assert.equal(room.frame.up, frameUp); assert.equal(room.frame.right, frameRight);
  assert.equal(room.updateTransition(2000), false);
  const completed = pose(f); controls.update(); room.constrain(); assertPose(f, completed);
});

test('switching presets preserves the existing world pan focus and user zoom while refitting its base projection', () => {
  const f = fixture(); f.camera.zoom = 4; f.room.constrain(); f.room.panByPixels(65, -30);
  const focus = f.controls.target.clone(), zoom = f.camera.zoom;
  f.room.selectPreset('right', 0, { reducedMotion: true });
  assertPreset(f, 'right'); assert.equal(f.camera.zoom, zoom);
  // The old focus differs only along the invisible view depth axis, so it
  // stays under the same screen-space camera target at the new angle.
  near(focus.dot(f.room.frame.right), f.controls.target.dot(f.room.frame.right));
  near(focus.dot(f.room.frame.up), f.controls.target.dot(f.room.frame.up));
  assert.ok(f.controls.target.distanceTo(f.room.orbitCenter) > .1, 'Pan was not reset to the room center');
});

test('rapid retargeting starts at the current visible frame without advancing the previous animation', () => {
  const f = fixture(); f.room.selectPreset('left', 100); f.room.updateTransition(240);
  const visible = pose(f), direction = f.room.direction();
  // Even if an old timeline would have completed, the last rendered pose wins.
  f.room.selectPreset('right', 2000);
  assertPose(f, visible); nearVector(f.room.direction(), direction);
  f.room.updateTransition(2000); assertPose(f, visible);
  f.room.updateTransition(2001);
  assert.ok(f.camera.position.distanceTo(visible.position) < .001);
  f.room.updateTransition(2420); assertPreset(f, 'right');
  for (let i = 0; i < 20; i++) {
    const before = pose(f), now = 3000 + i * 50;
    f.room.selectPreset(i % 2 ? 'right' : 'left', now); assertPose(f, before);
    f.room.updateTransition(now + 16); assertSafe(f);
  }
  f.room.finishTransition(); assertPreset(f, 'right');
});

test('cancellation freezes an intermediate frame and does not falsely mark a preset as reached', () => {
  const f = fixture(); f.room.selectPreset('left', 100); f.room.updateTransition(220);
  const visible = pose(f);
  assert.equal(f.room.cancelTransition(), true);
  assert.equal(f.room.transitioning, false); assert.equal(f.room.selectedPreset, null);
  assertPose(f, visible); assert.equal(f.room.updateTransition(10000), false); assertPose(f, visible);
  assert.equal(f.room.cancelTransition(), false);
  f.room.selectPreset('right', 300); f.room.cancelTransition();
  assertPose(f, visible); assert.equal(f.room.selectedPreset, null);
  f.room.selectPreset('classic', 400, { reducedMotion: true });
  f.room.selectPreset('left', 500); f.room.cancelTransition();
  assertPreset(f, 'classic');
});

test('reduced motion and finishing reach exactly the same endpoint as an animated transition', () => {
  const f = fixture();
  for (const preset of CAMERA_PRESETS) {
    f.room.reset(1440, 900); f.camera.zoom = 2.3; f.room.constrain(); f.room.panByPixels(45, -25);
    f.room.selectPreset(preset.id, 0); f.room.updateTransition(420);
    const animated = pose(f);
    f.room.reset(1440, 900); f.camera.zoom = 2.3; f.room.constrain(); f.room.panByPixels(45, -25);
    f.room.selectPreset(preset.id, 999, { reducedMotion: true });
    assertPose(f, animated); assertPreset(f, preset.id);
  }
  f.room.selectPreset('left', 0); f.room.updateTransition(100);
  assert.equal(f.room.finishTransition(), true); assertPreset(f, 'left');
  assert.equal(f.room.finishTransition(), false);
});

test('invalid IDs and invalid update timestamps cannot corrupt or replace a pending transition', () => {
  const f = fixture(); f.room.selectPreset('right', 0); f.room.updateTransition(100);
  const visible = pose(f);
  assert.equal(f.room.selectPreset('rear', 120), false); assertPose(f, visible);
  assert.equal(f.room.selectedPreset, 'right'); assert.equal(f.room.transitioning, true);
  for (const time of [NaN, undefined, null, '200']) {
    assert.equal(f.room.updateTransition(time), false); assertPose(f, visible);
  }
  f.room.updateTransition(Infinity); assertPreset(f, 'right');
  f.room.selectPreset('left', NaN); f.room.updateTransition(Infinity); assertPreset(f, 'left');
});

test('pointer starts and keyboard pan interrupt the transition without later camera replay', () => {
  const f = fixture(); f.room.selectPreset('right', 0); f.room.updateTransition(180);
  const visible = pose(f);
  f.controls.dispatchEvent({ type: 'start' });
  assertPose(f, visible); assert.equal(f.room.transitioning, false); assert.equal(f.room.selectedPreset, null);
  f.room.selectPreset('left', 300); f.room.updateTransition(480);
  const direction = f.room.direction(); f.room.panByPixels(50, 20);
  assert.equal(f.room.transitioning, false); nearVector(f.room.direction(), direction);
  assert.equal(f.room.updateTransition(10000), false); assertSafe(f);
});

test('resize cancels safely at the visible direction and reset or floor changes restore classic', () => {
  const f = fixture(); f.camera.zoom = 2.7; f.room.constrain();
  f.room.selectPreset('left', 0); f.room.updateTransition(175);
  const direction = f.room.direction();
  f.room.fit(390, 844, { reset: false });
  nearVector(f.room.direction(), direction); assert.equal(f.camera.zoom, 2.7);
  assert.equal(f.room.transitioning, false); assert.equal(f.room.selectedPreset, null);
  assert.equal(f.room.updateTransition(10000), false); assertSafe(f);
  f.room.selectPreset('right', 0, { reducedMotion: true });
  f.room.fit(844, 390, { reset: false }); assertPreset(f, 'right'); assert.equal(f.camera.zoom, 2.7);
  for (const view of ['lower', 'upper', 'bear', 'piano', 'overview']) {
    f.room.selectPreset('left', 0); f.room.updateTransition(200);
    f.room.setView(view); assert.equal(f.room.transitioning, false);
    f.room.fit(1440, 900); assertPreset(f, 'classic'); assert.equal(f.camera.zoom, 1);
    assert.equal(f.room.view, view);
  }
  f.room.selectPreset('right', 0); f.room.updateTransition(100); f.room.reset(1440, 900);
  assertPreset(f, 'classic'); assert.equal(f.camera.zoom, 1);
});

test('all presets and their intermediate frames retain room bounds at extreme pan and zoom', () => {
  const f = fixture();
  for (const view of ['overview', 'lower', 'upper', 'bear', 'piano']) {
    f.room.setView(view); f.room.fit(390, 844);
    for (const preset of CAMERA_PRESETS) {
      f.camera.zoom = f.controls.maxZoom; f.room.panByPixels(1e6, -1e6);
      f.room.selectPreset(preset.id, 0);
      for (const time of [0, 70, 140, 210, 280, 350, 420]) {
        f.room.updateTransition(time); f.controls.update(); f.room.constrain(); assertSafe(f);
      }
      assertPreset(f, preset.id);
    }
  }
});

test('disposing a room releases both singleton-control subscriptions across retries without moving the camera', () => {
  const f = fixture(), { controls, camera } = f;
  let room = f.room, staleChanges = 0, staleStarts = 0;
  for (let attempt = 0; attempt < 3; attempt++) {
    room.selectPreset('left', 0); room.updateTransition(160);
    const visible = pose(f);
    assert.ok(controls.hasEventListener('change', room.onControlsChange));
    assert.ok(controls.hasEventListener('start', room.onControlsStart));
    room.dispose(); room.dispose();
    assertPose(f, visible); assert.equal(room.transitioning, false);
    assert.equal(controls.hasEventListener('change', room.onControlsChange), false);
    assert.equal(controls.hasEventListener('start', room.onControlsStart), false);
    room.constrain = () => { staleChanges++; };
    room.cancelTransition = () => { staleStarts++; };
    const root = source.clone(true); root.getObjectByName('Exterior_city')?.removeFromParent();
    room = new IsometricRoom(root, camera, controls); room.setView('overview'); room.fit(1440, 900);
    room.selectPreset('right', 0); room.updateTransition(160);
    controls.dispatchEvent({ type: 'change' });
    controls.dispatchEvent({ type: 'start' });
    assert.equal(room.transitioning, false, 'The active room keeps its own input cancellation');
    assert.equal(staleChanges, 0); assert.equal(staleStarts, 0);
  }
  room.dispose();
});

test('axial presets physically align the horizontal viewing vector with perpendicular room axes', () => {
  const f = fixture();
  for (const [id, axis, screenRight] of [
    ['left', new Vector3(0, 0, 1), new Vector3(1, 0, 0)],
    ['right', new Vector3(1, 0, 0), new Vector3(0, 0, -1)],
  ]) {
    f.room.selectPreset(id, 0, { reducedMotion: true });
    const direction = f.room.direction(), horizontal = direction.clone().setY(0).normalize();
    nearVector(horizontal, axis, 1e-12);
    nearVector(f.room.frame.right, screenRight, 1e-12);
    // Orthographic axes use one physical pixel scale, never CSS/nonuniform scale.
    near((f.camera.right - f.camera.left) / 1440, (f.camera.top - f.camera.bottom) / 900);
    f.room.applyCutaway();
    for (const { object, bounds } of f.room.meshes) {
      if (/wall_east|wall_south/.test(object.name)) assert.equal(object.visible, false, object.name);
      if (/wall_west/.test(object.name) && bounds.max.y >= 0) assert.equal(object.visible, true, object.name);
    }
  }
});

test('each preset independently fills the usable viewport for portrait and nonuniform room footprints', () => {
  for (const [scaleX, scaleZ] of [[1, 1], [1.8, .55], [.6, 1.7]]) {
    const root = source.clone(true);
    root.getObjectByName('Exterior_city')?.removeFromParent();
    // A non-square fixture detects accidental reuse of classic or whole-arc fit.
    root.scale.set(scaleX, 1, scaleZ); root.updateMatrixWorld(true);
    const camera = new OrthographicCamera(-12, 12, 10, -10, .1, 100), controls = new OrbitControls(camera);
    configureControls(controls);
    const room = new IsometricRoom(root, camera, controls);
    for (const view of ['overview', 'lower', 'upper']) {
      room.setView(view);
      for (const [width, height] of [[1440, 900], [390, 844], [844, 390]]) {
        room.fit(width, height);
        for (const preset of CAMERA_PRESETS) {
          room.selectPreset(preset.id, 0, { reducedMotion: true });
          assertPreset({ room, camera, controls }, preset.id);
          const { side, top, bottom } = room.viewport;
          const usableWidth = width - 2 * side, usableHeight = height - top - bottom;
          const points = room.roomCorners.map(point => point.clone().project(camera));
          const minX = Math.min(...points.map(point => (point.x + 1) * width / 2));
          const maxX = Math.max(...points.map(point => (point.x + 1) * width / 2));
          const minY = Math.min(...points.map(point => (1 - point.y) * height / 2));
          const maxY = Math.max(...points.map(point => (1 - point.y) * height / 2));
          assert.ok(minX >= side - 1e-7 && maxX <= width - side + 1e-7);
          assert.ok(minY >= top - 1e-7 && maxY <= height - bottom + 1e-7);
          near(Math.max((maxX - minX) / usableWidth, (maxY - minY) / usableHeight), 1 / 1.08, 1e-8);
          near((camera.right - camera.left) / (camera.top - camera.bottom), width / height);
        }
      }
    }
    room.dispose();
  }
});

test('an axial-to-axial transition grows its frustum for the diagonal midpoint without clipping', () => {
  const f = fixture('lower', 390, 844), { room, camera } = f;
  room.selectPreset('left', 0, { reducedMotion: true });
  const leftHalfHeight = (camera.top - camera.bottom) / 2;
  room.selectPreset('right', 1000);
  for (let elapsed = 0; elapsed <= PRESET_TRANSITION_MS; elapsed += 7) {
    room.updateTransition(1000 + elapsed);
    assertSafe(f);
    const { width, height, side, top, bottom } = room.viewport;
    for (const point of room.roomCorners) {
      const projected = point.clone().project(camera);
      assert.ok(projected.x >= -1 + 2 * side / width - 1e-8 && projected.x <= 1 - 2 * side / width + 1e-8);
      assert.ok(projected.y >= -1 + 2 * bottom / height - 1e-8 && projected.y <= 1 - 2 * top / height + 1e-8);
    }
  }
  const rightHalfHeight = (camera.top - camera.bottom) / 2;
  room.selectPreset('left', 2000); room.updateTransition(2210);
  near(Math.atan2(room.direction().x, room.direction().z), Math.PI / 4);
  assert.ok((camera.top - camera.bottom) / 2 > Math.max(leftHalfHeight, rightHalfHeight), 'The widest diagonal is fit during the transition');
});
