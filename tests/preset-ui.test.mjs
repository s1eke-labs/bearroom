/** Actual main-handler integration on CPU DOM substitutes, not browser/GPU QA. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parseAst } from 'rollup/parseAst';
import { IsometricRoom, configureControls } from '../src/camera.js';
import { CAMERA_PRESETS, PRESET_TRANSITION_MS } from '../src/camera-presets.js';
import { FirstPersonController, captureIsometricState } from '../src/first-person.js';
import { cancelOrbitGesture } from '../src/orbit-input.js';
import { isTap } from '../src/domain.js';
import { sceneTapEndsOnCanvas } from '../src/room-interactions.js';
import { Gr as OrthographicCamera, x0 as OrbitControls, L as Vector3, Ee as Vector2 } from '../vendor/runtime-v11.js';
import { loadSceneForCPU } from './helpers.mjs';
import { qaDOM, QAElement, dispatch } from './walk-qa-helpers.mjs';

const model = await loadSceneForCPU();
const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const ast = parseAst(main);
const functionNames = new Set(['syncPresetControls', 'setRoomReady', 'selectRoomPreset', 'finishReducedMotionTransition', 'Xr', 'gv', 'Br', 'vv', 'cl', 'suspendGraphics']);
const events = new Set(['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'lostpointercapture', 'wheel', 'keydown', 'resize', 'blur', 'pagehide', 'visibilitychange', 'webglcontextlost']);
const actualHandlers = ast.body.filter(node => {
  if (node.type === 'FunctionDeclaration') return functionNames.has(node.id.name);
  const text = main.slice(node.start, node.end);
  if (node.type === 'IfStatement') return text.startsWith('if (reducedMotionQuery?.addEventListener)');
  if (node.type !== 'ExpressionStatement') return false;
  const call = node.expression;
  if (call.type === 'CallExpression' && call.callee.property?.name === 'addEventListener') {
    return ['bn', 'window', 'document'].includes(call.callee.object?.name) && events.has(call.arguments[0]?.value);
  }
  return /^(?:Ge\("#(?:reset-view|zoom-in|zoom-out|help)"\)\.onclick|document\.querySelectorAll\("\[data-(?:view|preset)\]"\)\.forEach)/.test(text);
}).map(node => main.slice(node.start, node.end)).join('\n');

function fixture({ reduced = false, width = 1440, height = 900 } = {}) {
  const dom = qaDOM(width, height), root = model.clone(true);
  root.getObjectByName('Exterior_city')?.removeFromParent();
  dom.canvas.getRootNode = () => dom.documentTarget;
  dom.documentTarget.elementFromPoint = () => dom.canvas;
  const elements = new Map(), element = selector => {
    if (!elements.has(selector)) elements.set(selector, new QAElement(selector));
    return elements.get(selector);
  };
  const buttons = CAMERA_PRESETS.map(preset => { const button = new QAElement(preset.id); button.dataset.preset = preset.id; return button; });
  const floors = ['overview', 'lower', 'upper', 'bear', 'piano'].map(view => { const button = new QAElement(view); button.dataset.view = view; return button; });
  let dialog = false, now = 1000, taps = 0;
  element('#help-dialog').showModal = () => { dialog = true; };
  dom.documentTarget.querySelector = selector => selector === 'dialog[open]' ? dialog ? element('#help-dialog') : null : element(selector);
  dom.documentTarget.querySelectorAll = selector => selector === '[data-preset]' ? buttons : selector === '[data-view]' ? floors : [...floors, ...['#night', '#day', '#walk-toggle', '#zoom-in', '#zoom-out', '#reset-view'].map(element)];
  const camera = new OrthographicCamera(-12, 12, 10, -10, .1, 100);
  camera.position.set(20, 20, 20);
  // Main capture listeners must be registered before vendor bubbling listeners.
  const controls = new OrbitControls(camera);
  configureControls(controls);
  const room = new IsometricRoom(root, camera, controls); room.fit(width, height);
  camera.zoom = 2; room.constrain();
  const media = new QAElement('media'); media.matches = reduced;
  const context = {
    window: dom.windowTarget, document: dom.documentTarget, bn: dom.canvas, Ge: element,
    pt: room, tn: controls, Rt: camera, Qn: root, walk: null, Nr: null, pcCase: null,
    performance: { now: () => now }, innerWidth: width, innerHeight: height,
    reducedMotionQuery: media, cs: true, graphicsAvailable: true, contextWasReady: false,
    cancelOrbitGesture, sceneTapEndsOnCanvas: event => sceneTapEndsOnCanvas(event, dom.canvas, dom.documentTarget), kx: isTap,
    Kc: new Vector2(), jc: { setFromCamera() {}, intersectObject() { return [{}]; } }, roomHitIsVisible: () => true,
    roomInteractions: { target: () => ({}), interact() { taps++; }, resetKeys() {}, update: () => false },
    _i: 0, _n: 0, Cr: 0, Hs: null, Ei: false, kr: false, qc: 0, rv: 1 / 30,
    tu: [], nu: [], No: [], Fo: new Map(), Uo: [], jt: {}, It: { intensity: 0, shadow: {} },
    Ot: { setSize() {}, render() {} }, oi: { frameTimes: [], errors: [] },
    en: { clamp: (value, low, high) => Math.max(low, Math.min(high, value)) },
    preparationAbort: new AbortController(), Error, DOMException,
    requestAnimationFrame: () => 1, cancelAnimationFrame() {},
  };
  vm.createContext(context);
  vm.runInContext(`const Ri = new Set(); let dt = null;\n${actualHandlers}`, context);
  controls.connect(dom.canvas);
  const navigation = {
    position: new Vector3(), spawnPoints: { lower: { yaw: 0 }, upper: { yaw: 0 } },
    reset(floor) { this.position.set(0, floor === 'upper' ? 3.13 : .014, 0); },
    eyePosition(out) { return out.copy(this.position).add(new Vector3(0, 1.6, 0)); }, move() {},
  };
  const walk = new FirstPersonController({ ...dom, root, room, isometricCamera: camera, orbitControls: controls, navigation, onChange: () => context.Xr() });
  context.walk = walk; context.setRoomReady(true);
  return { ...dom, context, room, camera, controls, walk, media, element, buttons, floors,
    get taps() { return taps; }, setTime(time) { now = time; },
    click(id) { buttons.find(button => button.dataset.preset === id).onclick(); },
    frame(time) { now = time; context.vv(time); },
    dispose() { walk.dispose(); controls.dispose(); },
  };
}
const pose = f => ({ position: f.camera.position.toArray(), quaternion: f.camera.quaternion.toArray(), target: f.controls.target.toArray(), zoom: f.camera.zoom, frustum: [f.camera.left, f.camera.right, f.camera.top, f.camera.bottom], projection: f.camera.projectionMatrix.toArray() });
const pressed = f => f.buttons.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => button.dataset.preset);
function samePose(actual, expected) {
  for (const field of ['position', 'quaternion', 'target', 'frustum', 'projection']) {
    for (let i = 0; i < actual[field].length; i++) assert.ok(Math.abs(actual[field][i] - expected[field][i]) < 1e-10, `${field}[${i}] must not drift`);
  }
  assert.equal(actual.zoom, expected.zoom);
}
function pointer(f, type, id = 1, x = 500, y = 350) {
  dispatch(f.canvas, type, { pointerId: id, pointerType: 'touch', button: 0, clientX: x, clientY: y, pageX: x, pageY: y });
}

test('preset UI: native buttons expose labels, selected state and loading/walking availability', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.deepEqual(CAMERA_PRESETS.map(({ id, label }) => [id, label]), [['classic', '经典'], ['left', '正左'], ['right', '正右']]);
  for (const { id, label } of CAMERA_PRESETS) assert.match(html, new RegExp(`<button type="button" data-preset="${id}"[^>]*aria-pressed="(?:true|false)"[^>]*>${label}</button>`));
  assert.match(html, /id="preset-control"[^>]*role="group"[^>]*aria-label="预设视角"[^>]*hidden/);
  assert.doesNotMatch(html, /有限旋转|偏左|偏右/);
  const f = fixture();
  assert.deepEqual(pressed(f), ['classic']); assert.equal(f.element('#preset-control').hidden, false);
  f.context.setRoomReady(false); f.context.cs = false;
  assert.equal(f.element('#preset-control').hidden, true); assert.ok(f.buttons.every(button => button.disabled));
  f.click('left'); assert.equal(f.room.transitioning, false);
  f.context.cs = true; f.context.setRoomReady(true); f.walk.enter();
  assert.equal(f.element('#preset-control').hidden, true); assert.ok(f.buttons.every(button => button.disabled));
  f.click('right'); assert.equal(f.room.transitioning, false);
  f.walk.exit(); assert.equal(f.element('#preset-control').hidden, false); assert.ok(f.buttons.every(button => !button.disabled));
  assert.deepEqual(pressed(f), ['classic']); f.dispose();
});

test('preset UI: repeated button activation retargets current pose, completes through main frames and never leaves stale busy state', () => {
  const f = fixture(), before = pose(f);
  f.click('left'); assert.equal(f.room.transitioning, true); assert.deepEqual(pose(f), before);
  assert.deepEqual(pressed(f), ['left']); assert.equal(f.element('#preset-control').getAttribute('aria-busy'), 'true');
  f.frame(1160); const midway = pose(f); assert.notDeepEqual(midway, before);
  f.click('right'); assert.deepEqual(pose(f), midway); assert.deepEqual(pressed(f), ['right']);
  f.frame(1160 + PRESET_TRANSITION_MS);
  assert.equal(f.room.transitioning, false); assert.deepEqual(pressed(f), ['right']);
  assert.equal(f.element('#preset-control').getAttribute('aria-busy'), 'false');
  assert.equal(f.camera.zoom, before.zoom);
  assert.ok(Math.abs(f.room.direction().z) < 1e-12, 'The actual right button reaches the exact axial side');
  assert.notDeepEqual(pose(f).frustum, before.frustum, 'The actual frame loop updates orthographic framing');
  const destination = pose(f); f.frame(3000); samePose(pose(f), destination); f.dispose();
});

test('preset UI: initial and runtime reduced-motion preferences finish without a stale animation', () => {
  const initial = fixture({ reduced: true }); initial.click('left');
  assert.equal(initial.room.transitioning, false); assert.deepEqual(pressed(initial), ['left']); assert.ok(Math.abs(initial.room.direction().x) < 1e-12); initial.dispose();
  const f = fixture(); f.click('right'); f.frame(1150);
  f.media.matches = true; dispatch(f.media, 'change', { matches: true });
  assert.equal(f.room.transitioning, false); assert.deepEqual(pressed(f), ['right']);
  assert.ok(Math.abs(f.room.direction().z) < 1e-12, 'Reduced motion still lands exactly at the right axial endpoint');
  const finished = pose(f); f.frame(5000); samePose(pose(f), finished);
  f.media.matches = false; dispatch(f.media, 'change', { matches: false }); f.frame(6000); samePose(pose(f), finished); f.dispose();
});

for (const interruption of ['wheel', 'blur', 'pagehide', 'visibilitychange', 'resize', 'help', 'webglcontextlost']) test(`preset UI: ${interruption} freezes the visible frame and clears selection/busy state`, () => {
  const f = fixture(); f.click('left'); f.frame(1160); const interrupted = pose(f);
  if (interruption === 'help') f.element('#help').onclick();
  else if (interruption === 'visibilitychange') { f.documentTarget.visibilityState = 'hidden'; dispatch(f.documentTarget, interruption); }
  else dispatch(['wheel', 'webglcontextlost'].includes(interruption) ? f.canvas : f.windowTarget, interruption);
  assert.equal(f.room.transitioning, false); assert.deepEqual(pressed(f), []);
  assert.equal(f.element('#preset-control').getAttribute('aria-busy'), 'false');
  samePose(pose(f), interrupted); f.room.updateTransition(99999); samePose(pose(f), interrupted); f.dispose();
});

test('preset UI: first canvas pointer freezes before tap snapshot while second pointer remains owned', () => {
  const f = fixture(); f.click('right'); f.frame(1170); const interrupted = pose(f);
  pointer(f, 'pointerdown'); assert.equal(f.room.transitioning, false); assert.deepEqual(pressed(f), []);
  pointer(f, 'pointerup'); assert.equal(f.taps, 1); samePose(pose(f), interrupted);
  pointer(f, 'pointerdown', 2); pointer(f, 'pointerdown', 3, 650, 350);
  assert.deepEqual(f.controls._pointers, [2, 3]); pointer(f, 'pointerup', 2);
  assert.deepEqual(f.controls._pointers, [3]); pointer(f, 'pointerup', 3, 650, 350);
  assert.equal(f.taps, 1); f.dispose();
});

test('preset UI: floor, home, keyboard pan and button zoom cancel transitions without resuming them', () => {
  const f = fixture();
  for (const act of [() => f.floors[2].onclick(), () => f.element('#reset-view').onclick(), () => dispatch(f.canvas, 'keydown', { key: 'Home' })]) {
    f.setTime(1000); f.click('left'); f.frame(1160); act();
    assert.equal(f.room.transitioning, false); assert.deepEqual(pressed(f), ['classic']);
    const stopped = pose(f); f.frame(9999); samePose(pose(f), stopped);
  }
  for (const act of [() => f.element('#zoom-in').onclick(), () => dispatch(f.canvas, 'keydown', { key: 'ArrowLeft' })]) {
    f.setTime(1000); f.click('right'); f.frame(1160); act();
    assert.equal(f.room.transitioning, false); assert.deepEqual(pressed(f), []);
    const stopped = pose(f); f.room.updateTransition(99999); assert.deepEqual(pose(f), stopped);
  }
  f.dispose();
});

test('preset UI: entering walk cancels before snapshot; exit restores exact pose and selection', () => {
  const f = fixture();
  for (const interrupted of [false, true]) {
    f.setTime(1000); f.click('left'); f.frame(interrupted ? 1170 : 1420);
    const before = pose(f); f.walk.enter();
    assert.equal(f.room.transitioning, false); assert.deepEqual(pose(f), before);
    assert.equal(f.walk.saved.selectedPreset, interrupted ? null : 'left');
    const saved = f.walk.saved; f.walk.exit();
    assert.deepEqual(captureIsometricState(f.room, f.camera, f.controls), saved);
    assert.deepEqual(pressed(f), interrupted ? [] : ['left']);
    f.frame(99999); samePose(pose(f), before);
    f.element('#reset-view').onclick();
  }
  f.dispose();
});

test('preset UI: portrait row dimensions fit 320px and keep 44px native targets', () => {
  const css = fs.readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
  assert.match(css, /grid-template-columns:auto auto/);
  assert.match(css, /\.preset-control button\{[^}]*min-width:58px;min-height:44px/);
  assert.match(css, /\.preset-control\[hidden\],\.is-walking \.preset-control\{display:none\}/);
  const presetWidth = 3 * 58 + 2 * 3 + 2, walkWidth = 88, gap = 8;
  assert.ok(presetWidth + walkWidth + gap <= 320 - 28);
  const f = fixture({ width: 320, height: 844 });
  assert.ok(f.room.viewport.top >= 202, 'camera safe area clears the two-row toolbar');
  f.dispose();
});
