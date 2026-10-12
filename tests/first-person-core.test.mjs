import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { FirstPersonController, WALK_VIEW } from '../src/first-person.js';
import { IsometricRoom, configureControls } from '../src/camera.js';
import { Gr as OrthographicCamera, L as Vector3, Mh as Scene, Kt as Box3 } from '../vendor/runtime-v11.js';
import { loadSceneForCPU } from './helpers.mjs';

class Node {
  constructor() { this.listeners = new Map(); this.attributes = {}; this.style = {}; this.hidden = false; this.innerHTML = 'fixed hint'; this.textContent = 'fixed status'; this.classList = { add() {}, remove() {} }; }
  addEventListener(type, fn) { if (!this.listeners.has(type)) this.listeners.set(type, new Set()); this.listeners.get(type).add(fn); }
  removeEventListener(type, fn) { this.listeners.get(type)?.delete(fn); }
  setAttribute(key, value) { this.attributes[key] = value; }
  focus() {}
  getBoundingClientRect() { return { left: 0, top: 0, width: 112, height: 112 }; }
  emit(type, data = {}) { const event = { preventDefault() {}, stopPropagation() {}, target: this, ...data }; for (const fn of this.listeners.get(type) || []) fn(event); }
}
const source = await loadSceneForCPU();
function fixture(view = 'overview') {
  const root = source.clone(true), camera = new OrthographicCamera(-12, 12, 10, -10, .1, 100);
  const orbit = { target: new Vector3(), enabled: true, mouseButtons: {}, touches: {}, update() {}, addEventListener() {} };
  configureControls(orbit);
  const room = new IsometricRoom(root, camera, orbit);
  room.setView(view); room.fit(1024, 768); camera.zoom = 2.4; room.panByPixels(37, -19);
  const windowTarget = new Node(); windowTarget.innerWidth = 1024; windowTarget.innerHeight = 768;
  const documentTarget = new Node(); documentTarget.visibilityState = 'visible'; documentTarget.querySelector = () => null;
  const navigation = { position: new Vector3(1, .062, 2), spawnPoints: { lower: { yaw: 0 }, upper: { yaw: -Math.PI / 2 } }, reset(floor) { this.floor = floor; this.position.y = floor === 'upper' ? 3.13 : .062; }, eyePosition(out) { return out.copy(this.position).add(new Vector3(0, 1.6, 0)); }, move(dt, v) { this.position.x += v.x * 1.5 * dt; this.position.z += v.z * 1.5 * dt; }, restoreDoor() { this.restored = true; } };
  const canvas = new Node(), hint = new Node(), status = new Node(), toggleButton = new Node(), joystick = new Node(), joystickKnob = new Node();
  const controller = new FirstPersonController({ root, room, isometricCamera: camera, orbitControls: orbit, canvas, windowTarget, documentTarget, navigation, hint, status, toggleButton, joystick, joystickKnob });
  return { controller, root, room, camera, orbit, windowTarget, documentTarget, navigation, canvas, hint, status, toggleButton, joystick, joystickKnob };
}
const image = camera => ({ position: camera.position.toArray(), quaternion: camera.quaternion.toArray(), up: camera.up.toArray(), projection: camera.projectionMatrix.toArray(), zoom: camera.zoom });

for (const view of ['overview', 'lower', 'upper', 'bear', 'piano']) test(`${view}: walking restores exact fixed-view camera, target, materials, visibility and hint`, () => {
  const f = fixture(view), before = image(f.camera), target = f.orbit.target.toArray(), meshes = [], materials = new Map();
  f.root.traverse(o => { if (o.isMesh) { meshes.push({ o, visible: o.visible, cutaway: o.userData.cutawayVisible, matrix: o.matrixWorld.toArray() }); for (const m of Array.isArray(o.material) ? o.material : [o.material]) materials.set(m, { clippingPlanes: m.clippingPlanes, clipShadows: m.clipShadows }); } });
  f.controller.enter();
  assert.equal(f.controller.getCamera().isPerspectiveCamera, true);
  assert.equal(f.orbit.enabled, false);
  assert.equal(f.navigation.floor, view === 'upper' ? 'upper' : 'lower');
  assert.ok(Math.abs(f.controller.camera.position.y - f.navigation.position.y - WALK_VIEW.eyeHeight) < 1e-12);
  assert.ok(meshes.filter(({o}) => /wall_east|wall_south/.test(o.name)).every(({o}) => o.visible));
  for (const m of materials.keys()) assert.deepEqual(m.clippingPlanes, []);
  f.controller.yaw += 1; f.controller.keys.add('KeyW'); f.controller.update(.03); f.controller.exit();
  assert.deepEqual(image(f.camera), before);
  assert.deepEqual(f.orbit.target.toArray(), target);
  assert.equal(f.room.view, view);
  assert.equal(f.orbit.enabled, true);
  assert.equal(f.navigation.restored, undefined, "Changing camera mode must not reset the shared door state");
  assert.equal(f.hint.innerHTML, 'fixed hint'); assert.equal(f.status.textContent, 'fixed status');
  for (const {o, visible, cutaway, matrix} of meshes) { assert.equal(o.visible, visible); assert.equal(o.userData.cutawayVisible, cutaway); assert.deepEqual(o.matrixWorld.toArray(), matrix); }
  for (const [m, saved] of materials) { assert.equal(m.clippingPlanes, saved.clippingPlanes); assert.equal(m.clipShadows, saved.clipShadows); }
  f.controller.dispose();
});

test('eye smooths stair heights only; grounded body and horizontal motion remain exact', () => {
  const f = fixture(); f.controller.enter(); const eye = f.controller.camera.position.y;
  f.navigation.position.y += .173; f.controller.keys.add('KeyW');
  const z = f.navigation.position.z; f.controller.update(.02);
  assert.equal(f.navigation.position.y, .235);
  assert.ok(f.controller.camera.position.y > eye && f.controller.camera.position.y < eye + .173);
  assert.ok(Math.abs(f.controller.camera.position.z - (z - .03)) < 1e-12);
  const smooth = f.controller.camera.position.y;
  f.controller.syncCamera(); assert.equal(f.controller.camera.position.y, smooth, 'look drag must not cancel smoothing');
  f.controller.keys.clear(); for (let i = 0; i < 60; i++) f.controller.update(1 / 60);
  assert.ok(Math.abs(f.controller.camera.position.y - (f.navigation.position.y + 1.6)) < 1e-5);
  f.controller.exit();
});

test('movement is frame-independent, diagonal-normalized, grounded and cannot catch up a hidden-tab gap', () => {
  const measure = (fps, diagonal = false) => { const f = fixture(); f.controller.enter(); const p = f.navigation.position.clone(); f.controller.keys.add('KeyW'); if (diagonal) f.controller.keys.add('KeyD'); for(let i=0;i<fps;i++) f.controller.update(1/fps); const distance=f.navigation.position.distanceTo(p); f.controller.dispose(); return distance; };
  assert.ok(Math.abs(measure(30) - 1.5) < 1e-10); assert.ok(Math.abs(measure(120) - 1.5) < 1e-10); assert.ok(Math.abs(measure(60,true) - 1.5) < 1e-10);
  const f=fixture(); f.controller.enter(); f.controller.keys.add('KeyW'); const p=f.navigation.position.clone(); f.controller.update(99); assert.ok(f.navigation.position.distanceTo(p) <= .07500001); f.controller.update(NaN); assert.ok(Number.isFinite(f.controller.camera.position.y)); f.controller.dispose();
});

test('door action preserves user-controlled lighting and announces blocked swing without a fleeting frame', () => {
  const f=fixture(), doorButton=new Node(); f.controller.doorButton=doorButton;
  f.navigation.doorAction=()=>({label:'打开浴室门'}); f.navigation.toggleDoor=()=>({changed:false,blocked:true});
  f.controller.enter(); f.controller.interactDoor(); f.controller.update(1/60);
  assert.equal(doorButton.hidden,false); assert.equal(doorButton.textContent,'请退开一点再开关门');
  f.controller.exit(); assert.equal(doorButton.hidden,true);
});

test('main integration routes render and walk piano raycasts through active camera; fixed controls remain guarded',()=>{
  const main=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
  assert.match(main,/Ot\.render\(jt, walk\?\.getCamera\(\) \|\| Rt\)/);
  assert.match(main,/jc\.setFromCamera\(Kc, walk\.getCamera\(\)\)/);
  assert.match(main,/if \(walk\?\.active\) walk\.update\(e\);\s*else \{ tn\.update\(\); pt\?\.constrain\(\); \}/);
  assert.match(main,/function gv\(i\) \{\s*if \(!cs \|\| !\["overview", "lower", "upper"\]\.includes\(i\)\) return;\s*walk\?\.exit\(\);/);
  const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for(const id of ['walk-toggle','walk-stick','walk-stick-knob','walk-door','walk-instructions']) assert.ok(html.includes(`id="${id}"`));
  assert.ok(html.includes('aria-describedby="walk-instructions"'));
});

test('browser keyboard shortcuts and editable fields never become walking input', () => {
  const f=fixture(); f.controller.enter();
  for(const modifier of ['ctrlKey','metaKey','altKey']) f.windowTarget.emit('keydown',{code:'KeyW',[modifier]:true});
  f.windowTarget.emit('keydown',{code:'KeyW',target:{matches:()=>true}});
  assert.equal(f.controller.keys.size,0);
  f.windowTarget.emit('keydown',{code:'KeyW'}); assert.equal(f.controller.keys.size,1);
  f.windowTarget.emit('keyup',{code:'KeyW',ctrlKey:true}); assert.equal(f.controller.keys.size,0); f.controller.dispose();
});

test('roaming-only ceiling closes upstairs sky without changing model bounds, material, shadow casting or lifecycle', () => {
  const f=fixture('upper'); f.controller.dispose();
  const scene=new Scene(); scene.add(f.root);
  const before=new Box3().setFromObject(f.root,true), wall=f.root.getObjectByName('cutaway_wall_east');
  const material=wall.material; let disposed=0; material.addEventListener('dispose',()=>disposed++);
  const controller=new FirstPersonController({root:f.root,scene,room:f.room,isometricCamera:f.camera,orbitControls:f.orbit,canvas:f.canvas,windowTarget:f.windowTarget,documentTarget:f.documentTarget,navigation:f.navigation});
  const ceiling=controller.ceiling; assert.ok(ceiling); assert.equal(ceiling.parent,scene); assert.equal(ceiling.material,material); assert.equal(ceiling.visible,false); assert.equal(ceiling.castShadow,false);
  const bounds=new Box3().setFromObject(ceiling,true);
  assert.ok(Math.abs(bounds.min.x+5)<1e-6 && Math.abs(bounds.max.x-5)<1e-6);
  assert.ok(Math.abs(bounds.min.z+4)<1e-6 && Math.abs(bounds.max.z-4)<1e-6);
  assert.ok(Math.abs(bounds.min.y-5.8)<1e-6 && Math.abs(bounds.max.y-5.8)<1e-6);
  let geometryDisposed=0; ceiling.geometry.addEventListener('dispose',()=>geometryDisposed++);
  for(let i=0;i<3;i++){controller.enter();assert.equal(ceiling.visible,true);assert.deepEqual(new Box3().setFromObject(f.root,true),before);controller.exit();assert.equal(ceiling.visible,false);}
  controller.dispose();assert.equal(ceiling.parent,null);assert.equal(geometryDisposed,1);assert.equal(disposed,0);
});

test('descending stairs keep smoothed eye plus near-plane clearance inside the grounded body', () => {
  const f=fixture('upper');f.controller.enter();
  for(let step=0;step<15;step++){f.navigation.position.y-=.173;for(let frame=0;frame<6;frame++){f.controller.update(1/60);assert.ok(f.controller.camera.position.y<=f.navigation.position.y+1.69+1e-12);}}
  f.controller.dispose();
});

test('hybrid devices expose touch walking controls even when their primary pointer is a mouse', () => {
  const css=fs.readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
  assert.match(css, /@media\(pointer:coarse\),\(any-pointer:coarse\),\(max-width:800px\)\{\.is-walking #walk-stick,\.is-walking \.walk-look-hint\{display:block\}/);
});
