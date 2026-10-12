import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parseAst } from 'rollup/parseAst';
import { LoadResources } from '../src/load-resources.js';
import { createPhaseTimings } from '../src/asset-loading.js';
import { createLoadingProgress, formatLoadingBytes } from '../src/loading-progress.js';
import { prepareFirstSwitch } from '../src/first-switch-preparation.js';
import { Mh as Scene, _t as Mesh, Hr as PlaneGeometry, ii as MeshBasicMaterial, nl as DirectionalLight, Gr as OrthographicCamera } from '../vendor/runtime-v11.js';

const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const names = ['loadRoom', 'measurePhase', 'cleanupRoom', 'showLoadFailure', 'setRoomReady', 'syncPresetControls', 'finishRoomPreparation', 'createLoadProgress', 'renderLoadingProgress', 'reportPreparationProgress'];
const source = parseAst(main).body.filter(node => node.type === 'FunctionDeclaration' && names.includes(node.id.name)).map(node => main.slice(node.start, node.end)).join('\n');
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const tick = () => new Promise(resolve => setImmediate(resolve));
const bytes = value => new TextEncoder().encode(value);

function fixture() {
  const elements = new Map(), events = [], snapshots = [], announcements = [], fetches = [], textures = [];
  const Ge = id => {
    if (id === '#loading p') id = '#load-stage';
    if (!elements.has(id)) elements.set(id, { hidden: false, disabled: false, textContent: '', style: {}, attributes: new Map(),
      classList: { add() {}, remove() {}, toggle() {} },
      setAttribute(key, value) { this.attributes.set(key, value); }, removeAttribute(key) { this.attributes.delete(key); } });
    return elements.get(id);
  };
  const resource = { dispose() {} };
  const meshes = Array.from({ length: 88 }, (_, index) => ({ name: `piano_key_${String(index).padStart(3, '0')}`, isMesh: true, userData: {}, rotation: { x: 0 }, geometry: resource, material: { name: 'key' } }));
  const root = { getObjectByName() { return null; }, traverse(fn) { meshes.forEach(fn); }, removeFromParent() {} };
  const c = {
    AbortController, DOMException, Error, Map, Set, TextDecoder, Uint8Array, LoadResources, createPhaseTimings,
    performance, setTimeout, clearTimeout, cancelAnimationFrame() {}, Ge,
    document: { querySelectorAll: () => [] }, bn: { dataset: { modelWorker: 'worker.js' }, setAttribute() {} },
    runtimeResources: null, textureTasks: new Map(), loadProgress: null, preparationAbort: new AbortController(),
    graphicsAvailable: true, contextWasReady: false, cs: false, walk: null, roomInteractions: null, pcCase: null, Fr: null, Qn: null, pt: null, Nr: null,
    Uo: [], eu: [], tu: [], No: [], Rr: [], nu: [], wi: new Map(), Fo: new Map(), _i: 0, _n: 0, qc: 0, Hs: null,
    tn: { enabled: false }, oi: { errors: [] }, phaseNames: { download: '空间下载', textures: '画作载入', parse: '家具解析' },
    Xr() {}, ASSET_REVISION: { modelSha256: 'a'.repeat(64) }, Io: 'b'.repeat(64),
    PC_CASE_CONFIG: { wallpaperUrl: '/wall.webp', screenName: 'screen' },
    fetchUint8Array: async (url, options) => { fetches.push({ url, options }); return bytes(url.includes('irradiance') ? '{}' : 'model'); },
    loadTexture: async url => { textures.push(url); return {}; },
    decodeGzip: async (_packed, options) => { events.push(['decode']); await options.onDecodeStage({ mode: 'worker' }); return Uint8Array.of(1); },
    j0: class { async parseAsync() { events.push(['parse']); return { scene: root }; } },
    jt: { add() { events.push(['scene']); } }, Rt: {}, It: {},
    Ot: { setSize() {}, getContext() { return { isContextLost: () => false }; } }, innerWidth: 800, innerHeight: 600, Ei: false, kr: false, Cr: 0,
    Ox: class { constructor() { this.frame = { up: {} }; } applyCutaway() {} fit() {} }, Qx: class { update() {} },
    ov() {}, fv() {}, cv() {}, dv: async () => { events.push(['screens']); }, $c: async () => ({}),
    sv: async () => { events.push(['gi-apply']); return { textures: [], setDay() {}, dispose() {} }; }, Kx() {},
    initializeWalk() { events.push(['walk']); c.walk = { active: false, setInputEnabled(value) { events.push(['input', value]); }, resize() {}, dispose() {} }; },
    prepareFirstSwitch: async ({ onProgress }) => {
      events.push(['prepare']);
      onProgress({ phase: 'textures', uploadedTextures: 0, totalTextures: 2, drawnBatches: 0, totalBatches: 4 });
      onProgress({ phase: 'textures', uploadedTextures: 2, totalTextures: 2, drawnBatches: 0, totalBatches: 4 });
      onProgress({ phase: 'shader-wait', uploadedTextures: 2, totalTextures: 2, drawnBatches: 1, totalBatches: 4 });
      onProgress({ phase: 'shaders', uploadedTextures: 2, totalTextures: 2, drawnBatches: 4, totalBatches: 4 });
      return {};
    },
    preparationFrame: async () => { events.push(['paint', c.loadProgress?.snapshot().stage]); },
    vv() { events.push(['frame']); return true; }, Yc: null,
  };
  vm.createContext(c); vm.runInContext(source, c);
  c.loadingProgressManager = createLoadingProgress({
    clock: { now: () => 0, setTimeout: () => 1, clearTimeout() {} },
    onChange: snapshot => { snapshots.push(snapshot); c.renderLoadingProgress(snapshot); },
    onAnnounce: text => { announcements.push(text); },
  });
  return { c, Ge, events, snapshots, announcements, fetches, textures, root };
}

test('actual startup adds only three CPU-stage paints and reserves ready until the complete first frame', async () => {
  const f = fixture(); await f.c.loadRoom();
  for (const [work, stage] of [['parse', 'parse'], ['scene', 'scene'], ['walk', 'walk'], ['frame', 'frame']]) {
    const index = f.events.findIndex(event => event[0] === work);
    assert.ok(index >= 0, `${work} ran`);
    const paint = f.events.slice(0, index).findLast(event => event[0] === 'paint');
    assert.equal(paint?.[1], stage, `${stage} painted before its operation`);
  }
  assert.deepEqual(f.events.filter(event => event[0] === 'paint').map(event => event[1]), ['parse', 'scene', 'walk', 'frame']);
  assert.equal(f.c.cs, true); assert.equal(f.snapshots.at(-1).status, 'ready');
  assert.equal(f.snapshots.at(-1).workProgress, 1);
  assert.ok(f.snapshots.slice(0, -1).every(state => state.workProgress < 1));
  for (const phase of ['download', 'decompress', 'parse', 'scene', 'textures', 'screens', 'pc', 'gi', 'gi-apply', 'walk', 'preparation', 'frame', 'startup-total', 'textures-wait', 'gi-wait']) {
    assert.equal(f.c.oi.startup.filter(timing => timing.phase === phase).length, 1, `one ${phase} timing`);
  }
});

test('all 14 external images and GI start alongside the model and update parallel counts without changing stage', async () => {
  const f = fixture(), model = deferred(), gi = deferred(), imageTasks = [];
  f.c.fetchUint8Array = (url, options) => { f.fetches.push({ url, options }); return url.includes('irradiance') ? gi.promise : model.promise; };
  f.c.loadTexture = url => { f.textures.push(url); const task = deferred(); imageTasks.push(task); return task.promise; };
  const task = f.c.loadRoom(); await tick();
  assert.equal(f.fetches.length, 2); assert.equal(f.textures.length, 14);
  assert.equal(new Set(f.textures).size, 14); assert.ok(f.textures.includes('/wall.webp'));
  imageTasks.slice(0, 3).forEach(image => image.resolve({})); await tick();
  assert.equal(f.c.loadProgress.snapshot().stage, 'download');
  assert.match(f.Ge('#load-secondary').textContent, /3\s*\/\s*14/);
  const options = f.fetches.find(record => record.url.includes('.glb.gz')).options;
  options.onAttempt({ attempt: 2, maxAttempts: 3 }); options.onProgress({ received: 4096, total: 0, attempt: 2 });
  assert.ok(f.Ge('#load-detail').textContent.includes(formatLoadingBytes(4096))); assert.match(f.Ge('#load-detail').textContent, /2\s*\/\s*3/);
  assert.equal(f.c.loadProgress.snapshot().indeterminate, true);
  assert.equal(f.Ge('#load-meter').attributes.has('aria-valuenow'), false);
  imageTasks.slice(3).forEach(image => image.resolve({})); gi.resolve(bytes('{}')); model.resolve(bytes('model'));
  await task; assert.equal(f.c.cs, true);
});

test('actual upload/batch counts remain truthful during indeterminate shader waiting', async () => {
  const f = fixture(); await f.c.loadRoom();
  const upload = f.snapshots.find(state => state.stage === 'upload' && state.stageProgress?.completed === 2);
  assert.equal(upload.stageProgress.total, 2); assert.match(upload.detail, /2\s*\/\s*2/);
  const waiting = f.snapshots.find(state => state.stage === 'warm' && state.indeterminate && state.stageProgress?.completed === 1);
  assert.equal(waiting.stageProgress.total, 4); assert.match(waiting.detail, /等待显卡/); assert.match(waiting.detail, /1\s*\/\s*4/);
  assert.ok(f.snapshots.filter(state => state.stage === 'warm').every(state => state.workProgress < 1));
});

test('final frame may wait but neither the bar nor input reports readiness early', async () => {
  const f = fixture(), frame = deferred();
  f.c.finishRoomPreparation = async () => { await frame.promise; f.events.push(['frame']); f.c.cs = true; f.c.setRoomReady(true); };
  const task = f.c.loadRoom(); await tick();
  assert.equal(f.c.loadProgress.snapshot().stage, 'frame'); assert.ok(f.c.loadProgress.snapshot().workProgress < 1);
  assert.equal(f.c.cs, false); assert.equal(f.c.tn.enabled, false);
  frame.resolve(); await task; assert.equal(f.c.loadProgress.snapshot().status, 'ready'); assert.equal(f.c.tn.enabled, true);
});

test('late previous-generation fetch callbacks and phase finish cannot replace new progress or timings', async () => {
  const f = fixture(), lateGI = deferred(); let oldDownloadOptions;
  f.c.fetchUint8Array = (url, options) => {
    if (url.includes('irradiance')) return lateGI.promise;
    oldDownloadOptions = options; return Promise.resolve(bytes('model'));
  };
  f.c.j0 = class { async parseAsync() { throw Error('old parser failed'); } };
  await f.c.loadRoom(); const oldTimings = f.c.oi.startup;
  f.c.fetchUint8Array = async url => bytes(url.includes('irradiance') ? '{}' : 'model');
  f.c.j0 = class { async parseAsync() { return { scene: f.root }; } };
  await f.c.loadRoom(); const currentTimings = f.c.oi.startup, count = currentTimings.length, state = f.c.loadProgress.snapshot();
  oldDownloadOptions.onProgress({ received: 8000, total: 10000, attempt: 1 });
  lateGI.resolve(bytes('{}')); await tick();
  assert.equal(f.c.loadProgress.snapshot().generation, state.generation); assert.equal(f.c.loadProgress.snapshot().status, 'ready');
  assert.equal(currentTimings.length, count); assert.equal(oldTimings.filter(timing => timing.phase === 'gi').length, 1);
});

test('only the dedicated status node announces loading; it survives hidden overlay and supports reduced motion', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
  const overlay = html.slice(html.indexOf('<div id="loading"'), html.indexOf('<span id="load-announcement"'));
  assert.doesNotMatch(overlay, /aria-live=|role="status"/);
  assert.match(html, /<span id="load-announcement"[^>]+role="status"[^>]+aria-live="polite"[^>]+aria-atomic="true"/);
  assert.match(html, /id="load-meter"[^>]+role="progressbar"[^>]+aria-label="已完成的准备步骤"/);
  assert.match(html, /aria-describedby="load-meter-description"/);
  assert.match(html, /准备步骤与就绪确认，不表示已用时间或剩余时间/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /#load-secondary[^}]*font-size:11px/);
});

test('real preparation emits separate actual upload and batch totals, with no invented shader-wait completion', async () => {
  const scene = new Scene(), camera = new OrthographicCamera(), daylight = new DirectionalLight(), material = new MeshBasicMaterial();
  scene.add(daylight, new Mesh(new PlaneGeometry(), material));
  const textures = [{ isTexture: true }, { isTexture: true }], progress = [];
  let ready = true, uploads = 0, batchDraws = 0;
  const renderer = {
    extensions: { has: () => true }, getContext: () => ({ isContextLost: () => false }),
    getViewport: out => out.copy({ x: 0, y: 0, z: 10, w: 10 }), getScissor: out => out.copy({ x: 0, y: 0, z: 10, w: 10 }),
    getScissorTest: () => false, getRenderTarget: () => null, getActiveCubeFace: () => 0, getActiveMipmapLevel: () => 0,
    setRenderTarget() {}, setViewport() {}, setScissor() {}, setScissorTest() {},
    initTexture() { uploads++; },
    compile() { ready = false; return new Set([material]); },
    properties: { get: () => ({ programs: new Map([['program', { isReady: () => ready }]]) }) },
    render(stage) { if (stage.children.some(child => child.isMesh && child.material === material)) batchDraws++; },
  };
  const result = await prepareFirstSwitch({ renderer, scene, camera, daylight, extraTextures: textures,
    now: () => 0, yieldFrame: async () => { ready = true; },
    onProgress: event => {
      assert.equal(event.uploadedTextures, uploads); assert.equal(event.drawnBatches, batchDraws);
      assert.equal(event.totalTextures, 2); assert.equal(event.totalBatches, 4);
      progress.push(event);
    },
  });
  assert.equal(result.textures, 2); assert.equal(result.batches, 4);
  assert.deepEqual(progress.filter(event => event.phase === 'shader-wait').map(event => event.drawnBatches), [0, 1, 2, 3]);
  assert.equal(progress.at(-1).drawnBatches, 4); assert.equal(progress.at(-1).variantIndex, 4);
});
