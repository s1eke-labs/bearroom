import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { RoomInteractions, KEYBOARD_CONFIG, keyboardComponents, roomHitIsVisible, sceneTapEndsOnCanvas } from '../src/room-interactions.js';
import { PcCaseController } from '../src/pc-case.js';
import { cancelOrbitGesture } from '../src/orbit-input.js';
import { kx } from '../src/domain.js';
import { Gr as OrthographicCamera, L as Vector3, Lf as Raycaster, Ee as Vector2, Mh as Scene, _t as Mesh, Hr as PlaneGeometry, Ai as Material } from '../vendor/runtime-v11.js';
import { loadSceneForCPU } from './helpers.mjs';
import { qaDOM, dispatch } from './walk-qa-helpers.mjs';
const source = await loadSceneForCPU();
const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
function fixture() {
  const root = source.clone(true), calls = { piano: [], door: 0, changed: 0 };
  const pc = new PcCaseController(root);
  const controller = new RoomInteractions(root, { pcCase: pc, onDoor: () => calls.door++, onPiano: midi => calls.piano.push(midi), onChange: () => calls.changed++ });
  return { root, pc, controller, calls };
}
function keyHit(entry, key) {
  const index = entry.geometry.index;
  for (let faceIndex = 0; faceIndex < (index?.count ?? entry.position.count) / 3; faceIndex++) {
    const vertex = index ? index.getX(faceIndex * 3) : faceIndex * 3;
    if (entry.keys[entry.vertexToKey[vertex]] === key) return { object: entry.mesh, faceIndex };
  }
  throw Error('Missing key triangle');
}
test('actual merged keyboard contains 75 isolated keys and spacebar; no mouse or desk is selected', () => {
  const f = fixture(), entries = [...f.controller.keyMeshes.values()];
  assert.equal(entries.length, 2); assert.equal(entries.reduce((n, entry) => n + entry.keys.length, 0), 76);
  assert.deepEqual(entries.map(entry => entry.keys.length), [48, 28]);
  const pointer = new Vector3(), vertices = [];
  for (const entry of entries) for (const key of entry.keys) {
    const center = pointer.set(...key.max.map((v, i) => (v + key.min[i]) / 2)).applyMatrix4(entry.mesh.matrixWorld);
    assert.ok(center.x > 2.94 && center.x < 3.54 && center.y > .90 && center.y < .95 && center.z > .24 && center.z < .43);
    for (const vertex of key.vertices) vertices.push([entry.mesh.name, vertex]);
    assert.equal(f.controller.target(keyHit(entry, key)).type, 'keyboard');
  }
  assert.equal(new Set(vertices.map(x => x.join(':'))).size, vertices.length);
  assert.equal(keyboardComponents(f.root.getObjectByName('F08_computer_desk__polymer_warm_abs').geometry).length, 0);
  assert.equal(f.controller.target({ object: f.root.getObjectByName('mouse_split'), faceIndex: 0 }), null);
  assert.equal(f.controller.target({ object: f.root.getObjectByName('desktop_oak'), faceIndex: 0 }), null);
  f.controller.dispose();
});

test('keyboard owns cloned arrays and moves only the clicked component along the real key-top normal', () => {
  const f = fixture(), entry = [...f.controller.keyMeshes.values()][0], key = entry.keys[0];
  const original = entry.original.attributes.position.array.slice(), before = entry.position.array.slice();
  assert.notEqual(entry.geometry, entry.original); assert.notEqual(entry.position.array, entry.original.attributes.position.array);
  assert.notEqual(entry.position.array.buffer, entry.original.attributes.position.array.buffer);
  assert.notEqual(entry.geometry.index.array.buffer, entry.original.index.array.buffer);
  const index = entry.geometry.index, capVertices = new Set(key.vertices), topNormals = [];
  for (let i = 0; i < index.count; i += 3) {
    const vertices = [index.getX(i), index.getX(i + 1), index.getX(i + 2)];
    if (!vertices.every(v => capVertices.has(v) && Math.abs(before[v * 3 + 1] - key.max[1]) < 1e-5)) continue;
    const [a, b, c] = vertices.map(v => new Vector3().fromBufferAttribute(entry.position, v));
    topNormals.push(b.sub(a).cross(c.sub(a)).normalize());
  }
  assert.ok(topNormals.length >= 2 && topNormals.every(n => n.y > .999), 'Real flat top triangle normals are local +Y; smoothed bevel vertex normals remain unchanged');
  f.controller.interact(keyHit(entry, key), 1000); f.controller.update(1110);
  const selected = new Set(key.vertices);
  for (let vertex = 0; vertex < entry.position.count; vertex++) for (let axis = 0; axis < 3; axis++) {
    const i = vertex * 3 + axis, expected = selected.has(vertex) && axis === 1 ? Math.fround(before[i] - KEYBOARD_CONFIG.travel) : before[i];
    assert.equal(entry.position.array[i], expected);
  }
  assert.deepEqual(entry.original.attributes.position.array, original);
  assert.deepEqual(entry.geometry.attributes.normal.array, entry.original.attributes.normal.array);
  assert.equal(entry.position.updateRanges.length, 1); assert.ok(entry.position.updateRanges[0].count < entry.position.array.length / 10);
  assert.deepEqual(f.calls.piano, []); assert.equal(f.calls.door, 0); assert.equal(f.pc.powered, true);
  f.controller.update(1220); assert.deepEqual(entry.position.array, before); assert.equal(f.controller.activeKeys.size, 0);
  f.controller.dispose(); assert.equal(entry.mesh.geometry, entry.original);
});

test('fast repeated taps and simultaneous keys recover exact rest arrays without cumulative drift', () => {
  const f = fixture(), entry = [...f.controller.keyMeshes.values()][1], first = entry.keys[0], second = entry.keys[1], before = entry.position.array.slice();
  for (let i = 0; i < 100; i++) { f.controller.interact(keyHit(entry, first), i * 9); f.controller.update(i * 9 + 5); }
  f.controller.interact(keyHit(entry, second), 900); f.controller.update(1010);
  assert.equal(f.controller.activeKeys.size, 2); assert.ok(first.offset <= KEYBOARD_CONFIG.travel && second.offset <= KEYBOARD_CONFIG.travel);
  f.controller.resetKeys(); assert.deepEqual(entry.position.array, before); assert.equal(f.controller.activeKeys.size, 0);
  f.controller.interact(keyHit(entry, first), 1200); f.controller.update(1310); f.controller.dispose(); f.controller.dispose();
  assert.equal(entry.mesh.geometry, entry.original); assert.equal(f.controller.update(1330), false);
});

test('real exported triangle raycasts route keycaps, oak door, case glass and piano separately', () => {
  const f = fixture(), ray = new Raycaster(), down = new Vector3(0, -1, 0), reached = new Set();
  for (const entry of f.controller.keyMeshes.values()) for (const key of entry.keys) {
    const origin = new Vector3((key.min[0] + key.max[0]) / 2, key.max[1] + .2, (key.min[2] + key.max[2]) / 2).applyMatrix4(entry.mesh.matrixWorld);
    ray.set(origin, down);
    const hit = ray.intersectObject(f.root, true).find(roomHitIsVisible), target = f.controller.target(hit);
    assert.equal(target?.type, 'keyboard'); reached.add(target.key);
  }
  assert.ok(reached.size >= 70, `At least 70 exposed caps are individually reachable; inherited overlapping spacebar obscures some lower caps (${reached.size})`);
  const glass = f.root.getObjectByName('pc_glass_front');
  const pos = glass.geometry.attributes.position, point = new Vector3().fromBufferAttribute(pos, 0).applyMatrix4(glass.matrixWorld);
  glass.material.opacity = .075;
  assert.equal(roomHitIsVisible({ object: glass, point }), true); assert.equal(f.controller.target({ object: glass, point }).type, 'pc');
  const door = f.root.getObjectByName('bathroom_oak_door');
  const center = door.getWorldPosition(new Vector3()); ray.set(center.clone().add(new Vector3(0, 0, .3)), new Vector3(0, 0, -1));
  assert.equal(f.controller.target(ray.intersectObject(f.root, true).find(roomHitIsVisible))?.type, 'door');
  const piano = f.root.getObjectByName('piano_key_060'); piano.userData.midi = 60;
  f.controller.interact({ object: piano }); assert.deepEqual(f.calls.piano, [60]); assert.equal(f.pc.powered, true); assert.equal(f.calls.door, 0);
  f.controller.dispose();
});

test('opaque foreground occludes actions, hidden/clipped geometry and normal room glass are ignored', () => {
  const scene = new Scene(), target = new Mesh(new PlaneGeometry(1, 1), new Material()), blocker = new Mesh(new PlaneGeometry(1, 1), new Material());
  target.name = 'bathroom_oak_door'; blocker.position.z = .2; scene.add(target, blocker); scene.updateMatrixWorld(true);
  const ray = new Raycaster(new Vector3(0, 0, 1), new Vector3(0, 0, -1));
  assert.equal(ray.intersectObject(scene, true).find(roomHitIsVisible).object, blocker);
  blocker.visible = false; assert.equal(ray.intersectObject(scene, true).find(roomHitIsVisible).object, target);
  blocker.visible = true; blocker.material.name = 'window_glass'; blocker.material.opacity = .075;
  assert.equal(ray.intersectObject(scene, true).find(roomHitIsVisible).object, target);
});

function gestures() {
  const dom = qaDOM(500, 400), clock = { value: 0 }, hit = { object: { userData: {} } }, camera = new OrthographicCamera(-4,4,3,-3,.1,100); camera.position.set(4,5,6); camera.zoom=2;
  const context = { bn: dom.canvas, window: dom.windowTarget, document: dom.documentTarget, performance: { now: () => clock.value }, cancelOrbitGesture, syncPresetControls() {}, cs: true, walk: null, Rt: camera,
    tn: { target: new Vector3(0, 1, 0), update() {}, enableDamping: true }, kx, sceneTapEndsOnCanvas: (event, canvas) => sceneTapEndsOnCanvas(event, canvas, dom.documentTarget), roomHitIsVisible: () => true,
    Kc: new Vector2(), jc: { setFromCamera() {}, intersectObject: () => [hit] }, Qn: {}, pt: { constrain() {} }, _i: 1,
    roomInteractions: { target: () => ({ type: 'test' }), interact() { context.actions++; }, resetKeys() {} }, actions: 0 };
  vm.createContext(context);
  vm.runInContext(main.slice(main.indexOf('const Ri ='), main.indexOf('bn.addEventListener("webglcontextlost"')) + '\n' + main.slice(main.indexOf('function Xr()'),main.indexOf('function gv(')), context);
  return { ...dom, context, clock, pointer(type, id = 1, x = 100, y = 100, button = 0) { dispatch(dom.canvas, type, { pointerId: id, clientX: x, clientY: y, button }); } };
}
test('fixed-view only completed stationary primary taps dispatch; drag, multi-touch, cancel, blur and lost capture do not', () => {
  const f = gestures(); f.pointer('pointerdown'); f.clock.value = 100; f.pointer('pointerup'); assert.equal(f.context.actions, 1);
  for (const stop of ['pointercancel', 'lostpointercapture']) { f.pointer('pointerdown'); f.pointer(stop); f.pointer('pointerup'); }
  f.pointer('pointerdown'); f.pointer('pointermove', 1, 130); f.pointer('pointermove', 1); f.pointer('pointerup');
  f.pointer('pointerdown'); f.pointer('pointerup', 1, 140); // Missing move event still cannot be a click.
  f.pointer('pointerdown'); f.pointer('pointerdown', 2); f.pointer('pointerup'); f.pointer('pointerup', 2);
  f.pointer('pointerdown'); dispatch(f.windowTarget, 'blur'); f.pointer('pointerup');
  f.pointer('pointerdown', 1, 100, 100, 2); f.pointer('pointerup', 1, 100, 100, 2);
  f.pointer('pointerdown'); f.clock.value += 700; f.pointer('pointerup');
  assert.equal(f.context.actions, 1);
});
test('UI overlays, off-canvas releases, help dialogs, loading and walking never trigger fixed-view clicks', () => {
  const f = gestures();
  f.documentTarget.elementFromPoint = () => f.toggleButton;
  f.pointer('pointerdown'); f.pointer('pointerup');
  f.documentTarget.elementFromPoint = () => f.canvas;
  f.pointer('pointerdown'); f.pointer('pointerup', 1, 501);
  f.documentTarget.querySelector = () => ({ open: true }); f.pointer('pointerdown'); f.pointer('pointerup');
  f.documentTarget.querySelector = () => null;
  f.context.cs = false; f.pointer('pointerdown'); f.pointer('pointerup'); f.context.cs = true;
  f.context.walk = { active: true }; f.pointer('pointerdown'); f.pointer('pointerup');
  assert.equal(f.context.actions, 0);
});
test('cosmetic keyboard has no text event, command, audio, storage, timer or independent render path', () => {
  const code = fs.readFileSync(new URL('../src/room-interactions.js', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /addEventListener|dispatchEvent|KeyboardEvent|execCommand|\.play\(|localStorage|sessionStorage|requestAnimationFrame|setInterval|setTimeout|\.focus\(|location\./);
  const update = code.slice(code.indexOf('  update(now)'), code.indexOf('  resetKeys()'));
  assert.doesNotMatch(update, /traverse|clone\(|keyboardComponents|StaticTriangleBVH/);
  assert.match(main, /if \(roomInteractions\?\.update\(i\)\) Ei = true/);
});

 test('stationary scene tap restores complete rotated pose without consuming residual orbit damping',()=>{
 const f=gestures(),camera=f.context.Rt,controls=f.context.tn;camera.rotation.set(.2,.3,.1);const position=camera.position.clone(),quaternion=camera.quaternion.clone(),up=camera.up.clone();
 controls._sphericalDelta={set(){this.cleared=true}};controls._panOffset=new Vector3(.3,0,0);
 f.pointer('pointerdown');camera.position.x+=.01;camera.rotateY(.02);f.clock.value=100;f.pointer('pointerup');
 assert.equal(f.context.actions,1);assert.deepEqual(camera.position.toArray(),position.toArray());assert.deepEqual(camera.quaternion.toArray(),quaternion.toArray());assert.deepEqual(camera.up.toArray(),up.toArray());assert.equal(controls._sphericalDelta.cleared,true);assert.equal(controls._panOffset.lengthSq(),0);
 });
