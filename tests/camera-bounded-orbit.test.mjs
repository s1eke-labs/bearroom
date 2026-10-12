import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { ROOM_ORBIT, IsometricRoom, configureControls } from '../src/camera.js';
import { CAMERA_PRESETS, PRESET_TRANSITION_MS } from '../src/camera-presets.js';
import { L as Vector3, Gr as OrthographicCamera, x0 as OrbitControls, kn as MOUSE, ti as TOUCH } from '../vendor/runtime-v11.js';
import { loadSceneForCPU } from './helpers.mjs';

const source = await loadSceneForCPU();
const views = ['overview', 'lower', 'upper', 'bear', 'piano'];
const angles = [
  [ROOM_ORBIT.defaultAzimuth, ROOM_ORBIT.defaultPolar],
  ...[ROOM_ORBIT.minAzimuth, ROOM_ORBIT.maxAzimuth].flatMap(yaw => [ROOM_ORBIT.minPolar, ROOM_ORBIT.maxPolar].map(polar => [yaw, polar])),
];
function fixture(view = 'overview', width = 1440, height = 900) {
  const root = source.clone(true);
  root.getObjectByName('Exterior_city')?.removeFromParent();
  const camera = new OrthographicCamera(-12, 12, 10, -10, .1, 100), controls = new OrbitControls(camera);
  configureControls(controls);
  const room = new IsometricRoom(root, camera, controls);
  room.setView(view); room.fit(width, height);
  return { root, camera, controls, room };
}
function orbitTo(f, yaw, polar) {
  const offset = new Vector3(Math.sin(polar) * Math.sin(yaw), Math.cos(polar), Math.sin(polar) * Math.cos(yaw));
  f.camera.position.copy(f.controls.target).addScaledVector(offset, ROOM_ORBIT.distance);
  f.room.constrain();
}
const near = (actual, expected, epsilon = 1e-8) => assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} != ${expected}`);
function assertBounded({ camera, controls, room }) {
  const direction = room.direction(), yaw = Math.atan2(direction.x, direction.z), polar = Math.acos(direction.y);
  assert.ok(yaw >= ROOM_ORBIT.minAzimuth - 1e-10 && yaw <= ROOM_ORBIT.maxAzimuth + 1e-10);
  assert.ok(polar >= ROOM_ORBIT.minPolar - 1e-10 && polar <= ROOM_ORBIT.maxPolar + 1e-10);
  assert.ok(direction.x > 0 && direction.y > 0 && direction.z > 0, 'No rear, below-floor or straight-down angle');
  near(direction.length(), 1); near(room.frame.right.length(), 1); near(room.frame.up.length(), 1);
  near(room.frame.right.dot(room.frame.up), 0); near(direction.dot(room.frame.right), 0); near(direction.dot(room.frame.up), 0);
  near(camera.position.distanceTo(controls.target), ROOM_ORBIT.distance);
  near(controls.target.clone().sub(room.orbitCenter).dot(direction), 0);
  assert.ok(controls.target.distanceTo(room.orbitCenter) < 25, 'The orbit pivot cannot drift away through an unconstrained depth axis');
  const limits = room.panLimits(), x = controls.target.dot(room.frame.right), y = controls.target.dot(room.frame.up);
  assert.ok(x >= limits.minX - 1e-7 && x <= limits.maxX + 1e-7, `${x} outside x bounds`);
  assert.ok(y >= limits.minY - 1e-7 && y <= limits.maxY + 1e-7, `${y} outside y bounds`);
  const center = { x: x + (limits.left + limits.right) / 2, y: y + (limits.low + limits.high) / 2 };
  const polygon = room.projectedRoom().polygon;
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i], b = polygon[(i + 1) % polygon.length];
    assert.ok((b.x - a.x) * (center.y - a.y) - (b.y - a.y) * (center.x - a.x) >= -1e-6, 'The usable viewport center stays inside the projected room hull');
  }
  for (const value of [...camera.position, ...controls.target, ...camera.projectionMatrix.elements]) assert.ok(Number.isFinite(value));
}
function corners(box) {
  return [box.min.x, box.max.x].flatMap(x => [box.min.y, box.max.y].flatMap(y => [box.min.z, box.max.z].map(z => new Vector3(x, y, z))));
}
function geometryFingerprint(root) {
  const hash = createHash('sha256'), geometries = new Set();
  root.traverse(object => { if (object.isMesh) geometries.add(object.geometry); });
  for (const geometry of geometries) {
    for (const attribute of [geometry.index, ...Object.values(geometry.attributes)]) if (attribute?.array) hash.update(new Uint8Array(attribute.array.buffer, attribute.array.byteOffset, attribute.array.byteLength));
  }
  return hash.digest('hex');
}

test('curated dollhouse mapping keeps primary/single-finger pan and wheel/pinch zoom inside the safe preset envelope', () => {
  const { controls } = fixture();
  assert.equal(controls.enableRotate, false); assert.equal(controls.enablePan, true);
  assert.equal(controls.mouseButtons.LEFT, MOUSE.PAN); assert.equal(controls.mouseButtons.RIGHT, MOUSE.PAN);
  assert.equal(controls.mouseButtons.MIDDLE, MOUSE.DOLLY); assert.equal(controls.touches.ONE, TOUCH.PAN);
  assert.equal(controls.touches.TWO, TOUCH.DOLLY_PAN); assert.equal(controls.zoomToCursor, false);
  near(controls.minAzimuthAngle, 35 * Math.PI / 180); near(controls.maxAzimuthAngle, 55 * Math.PI / 180);
  near(controls.minPolarAngle, 52 * Math.PI / 180); near(controls.maxPolarAngle, 58 * Math.PI / 180);
  assert.ok(Object.isFrozen(ROOM_ORBIT)); assert.ok(controls.enableDamping);
});

test('initial cutaway is correct before camera placement, including an uninitialized downward-looking camera', () => {
  const root = source.clone(true), camera = new OrthographicCamera(-12, 12, 10, -10, .1, 100);
  const controls = { target: new Vector3(0, 2.8, 0), mouseButtons: {}, touches: {}, update() {}, addEventListener() {} };
  configureControls(controls);
  const room = new IsometricRoom(root, camera, controls);
  room.setView('piano');
  for (const { object } of room.meshes) if (/wall_east|wall_south/.test(object.name)) assert.equal(object.visible, false);
  room.fit(1440, 900); assertBounded({ room, camera, controls });
});

test('programmatic presets reach their exact curated angles with stable frame references and fresh projected bounds', () => {
  const f = fixture(), up = f.room.frame.up, right = f.room.frame.right, firstProjection = f.room.projectedRoom();
  for (const preset of CAMERA_PRESETS) {
    assert.equal(f.room.selectPreset(preset.id, 1000), true);
    f.room.updateTransition(1000 + PRESET_TRANSITION_MS);
    assert.equal(f.room.selectedPreset, preset.id);
    assert.equal(f.room.transitioning, false);
    assertBounded(f);
    near(Math.atan2(f.room.direction().x, f.room.direction().z), preset.azimuth);
    near(Math.PI / 2 - Math.acos(f.room.direction().y), preset.elevation);
    const before = f.room.direction(); f.room.constrain(); assert.ok(before.distanceTo(f.room.direction()) < 1e-12);
  }
  assert.equal(f.room.frame.up, up); assert.equal(f.room.frame.right, right);
  assert.notEqual(f.room.projectedRoom(), firstProjection);
});

test('room constraints independently normalize externally supplied rear, overhead, below-floor and zero-length directions', () => {
  const f = fixture();
  for (const offset of [new Vector3(-20, -20, -20), new Vector3(0, 100, 0), new Vector3(0, -100, 0), new Vector3(100, 0, -100), new Vector3()]) {
    f.camera.position.copy(f.controls.target).add(offset);
    f.room.constrain(); assertBounded(f);
  }
});

test('hitting a pan boundary clears pan momentum without changing the curated angle or interrupting a preset transition', () => {
  const f = fixture(); f.camera.zoom = 3;
  f.room.selectPreset('right', 1000); f.room.updateTransition(1105);
  const before = f.room.direction();
  f.controls._panOffset.copy(f.room.frame.right).multiplyScalar(1e6);
  f.controls.update();
  assert.ok(f.room.direction().distanceTo(before) < 1e-12, 'Pan damping never changes the current angle');
  near(f.controls._sphericalDelta.theta, 0); near(f.controls._sphericalDelta.phi, 0);
  near(f.controls._panOffset.length(), 0); assert.equal(f.controls.enableDamping, true);
  assert.equal(f.room.transitioning, true);
  assert.equal(f.room.updateTransition(1210), true);
  assert.ok(f.room.direction().distanceTo(before) > .001, 'The next programmatic frame continues the preset transition');
  f.room.updateTransition(1000 + PRESET_TRANSITION_MS);
  assert.equal(f.room.selectedPreset, 'right'); assert.equal(f.room.transitioning, false);
  assertBounded(f);
});

for (const view of views) test(`${view}: rotated extreme pan/zoom keeps all original screen-space and depth escape limits`, () => {
  const f = fixture(view, 390, 844);
  for (const [yaw, polar] of angles) for (const requestedZoom of [-1e99, 1e99]) {
    orbitTo(f, yaw, polar); f.camera.zoom = requestedZoom; f.room.constrain();
    assert.equal(f.camera.zoom, requestedZoom < 0 ? .8 : view === 'piano' ? 16 : 8);
    for (const [x, y] of [[1e6, 1e6], [-1e6, -1e6], [1e6, -1e6], [-1e6, 1e6]]) {
      f.room.panByPixels(x, y); assertBounded(f);
    }
  }
  f.camera.zoom = NaN; f.room.constrain(); assert.equal(f.camera.zoom, 1); assertBounded(f);
  f.room.reset(844, 390); assert.equal(f.camera.zoom, 1); assert.equal(f.room.view, view);
  assert.ok(f.room.direction().distanceTo(new Vector3(1, 1, 1).normalize()) < 1e-12);
});

for (const view of ['overview', 'lower', 'upper']) test(`${view}: fitting once contains the whole room across the full angular range without changing the frustum`, () => {
  const f = fixture(view);
  for (const [width, height] of [[1440, 900], [390, 844], [844, 390]]) {
    f.room.fit(width, height);
    const frustum = [f.camera.left, f.camera.right, f.camera.top, f.camera.bottom];
    for (let yaw = ROOM_ORBIT.minAzimuth; yaw <= ROOM_ORBIT.maxAzimuth + 1e-10; yaw += (ROOM_ORBIT.maxAzimuth - ROOM_ORBIT.minAzimuth) / 6) {
      for (let polar = ROOM_ORBIT.minPolar; polar <= ROOM_ORBIT.maxPolar + 1e-10; polar += (ROOM_ORBIT.maxPolar - ROOM_ORBIT.minPolar) / 4) {
        orbitTo(f, yaw, polar);
        assert.deepEqual([f.camera.left, f.camera.right, f.camera.top, f.camera.bottom], frustum);
        const { side, top, bottom } = f.room.viewport;
        for (const point of f.room.roomCorners) {
          const projected = point.clone().project(f.camera);
          assert.ok(projected.x >= -1 + 2 * side / width - 1e-8 && projected.x <= 1 - 2 * side / width + 1e-8, 'Room width fits usable viewport');
          assert.ok(projected.y >= -1 + 2 * bottom / height - 1e-8 && projected.y <= 1 - 2 * top / height + 1e-8, 'Room height fits usable viewport');
          assert.ok(projected.z > -1 && projected.z < 1, 'All room depths remain between near and far');
        }
      }
    }
  }
});

test('resize preserves the rotated angle and zoom, with finite nonnegative padding even in a collapsed viewport', () => {
  const f = fixture('lower'); orbitTo(f, 53 * Math.PI / 180, 57 * Math.PI / 180); f.camera.zoom = 2.7;
  f.room.panByPixels(57, -31);
  const direction = f.room.direction();
  for (const size of [[390, 844], [844, 390], [320, 180], [1, 1], [0, 0], [NaN, Infinity], [1440, 900]]) {
    f.controls._sphericalDelta.theta = .1; f.controls._panOffset.set(1, 2, 3);
    f.room.fit(...size, { reset: false });
    assert.ok(f.room.direction().distanceTo(direction) < 1e-10);
    assert.equal(f.camera.zoom, 2.7); assert.equal(f.room.view, 'lower');
    assert.ok(f.room.viewport.top >= 0 && f.room.viewport.bottom >= 0);
    assert.ok(f.room.viewport.top + f.room.viewport.bottom <= f.room.viewport.height);
    near(f.controls._sphericalDelta.theta, 0); near(f.controls._panOffset.length(), 0);
    assertBounded(f);
  }
});

test('repeated orbit/pan cycles cannot accumulate invisible target depth or push the house beyond clipping planes', () => {
  const f = fixture(); f.camera.zoom = 8;
  for (let i = 0; i < 100; i++) {
    orbitTo(f, ...angles[1 + i % 4]);
    f.room.panByPixels(i % 2 ? 1e5 : -1e5, i % 3 ? 1e5 : -1e5);
    assertBounded(f);
    for (const point of corners(f.room.bounds())) {
      const depth = point.clone().sub(f.camera.position).dot(f.room.direction().negate());
      assert.ok(depth > f.camera.near && depth < f.camera.far);
    }
  }
});

test('view switches explicitly reset orbit and retain floor cutaways without changing any geometry or authored transforms', () => {
  const f = fixture(), geometryBefore = geometryFingerprint(f.root), transforms = new Map();
  f.root.traverse(object => transforms.set(object, object.matrix.toArray()));
  for (const view of views) {
    orbitTo(f, ROOM_ORBIT.maxAzimuth, ROOM_ORBIT.minPolar); f.camera.zoom = 3;
    f.room.setView(view); f.room.fit(1024, 768);
    assert.equal(f.room.view, view); assert.equal(f.camera.zoom, 1);
    assert.ok(f.room.direction().distanceTo(new Vector3(1, 1, 1).normalize()) < 1e-12);
    for (const { object, bounds } of f.room.meshes) {
      if (['lower', 'bear', 'piano'].includes(view) && bounds.min.y >= 2.78) assert.equal(object.visible, false);
      if (view === 'upper' && bounds.max.y < 2.78) assert.equal(object.visible, false);
      if (/wall_east|wall_south/.test(object.name)) assert.equal(object.visible, false);
    }
  }
  f.room.setView('free-orbit'); assert.equal(f.room.view, 'piano');
  assert.equal(geometryFingerprint(f.root), geometryBefore);
  for (const [object, matrix] of transforms) assert.deepEqual(object.matrix.toArray(), matrix);
});
