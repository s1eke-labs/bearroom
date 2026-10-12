import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parseAst } from 'rollup/parseAst';
import { LoadResources } from '../src/load-resources.js';
import { createPhaseTimings } from '../src/asset-loading.js';
import { createLoadingProgress, formatLoadingBytes, loadingPresentation } from '../src/loading-progress.js';
import { prepareFirstSwitch } from '../src/first-switch-preparation.js';
import { Mh as Scene, _t as Mesh, Hr as PlaneGeometry, ii as MeshBasicMaterial, nl as DirectionalLight, Gr as OrthographicCamera } from '../vendor/runtime-v11.js';

const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const names = ['loadRoom', 'measurePhase', 'cleanupRoom', 'showLoadFailure', 'setRoomReady', 'syncPresetControls', 'finishRoomPreparation', 'createLoadProgress', 'renderLoadingProgress', 'reportPreparationProgress'];
const source = parseAst(main).body.filter(node => node.type === 'FunctionDeclaration' && names.includes(node.id.name)).map(node => main.slice(node.start, node.end)).join('\n');
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const tick = () => new Promise(resolve => setImmediate(resolve));
const bytes = value => new TextEncoder().encode(value);

function fixture() {
  const elements = new Map(), events = [], snapshots = [], presentations = [], announcements = [], fetches = [], textures = [];
  const Ge = id => {
    if (id === '#loading p') id = '#load-stage';
    if (id === '#load-secondary') return null;
    if (!elements.has(id)) elements.set(id, { hidden: ['#load-detail', '#load-retry', '#load-cancel'].includes(id), disabled: false, textContent: '', style: {}, attributes: new Map(),
      classList: { add() {}, remove() {}, toggle() {} },
      setAttribute(key, value) { this.attributes.set(key, value); }, removeAttribute(key) { this.attributes.delete(key); } });
    return elements.get(id);
  };
  const resource = { dispose() {} };
  const meshes = Array.from({ length: 88 }, (_, index) => ({ name: `piano_key_${String(index).padStart(3, '0')}`, isMesh: true, userData: {}, rotation: { x: 0 }, geometry: resource, material: { name: 'key' } }));
  const root = { getObjectByName() { return null; }, traverse(fn) { meshes.forEach(fn); }, removeFromParent() {} };
  const c = {
    AbortController, DOMException, Error, Map, Set, TextDecoder, Uint8Array, LoadResources, createPhaseTimings, loadingPresentation,
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
    onChange: snapshot => {
      snapshots.push(snapshot); c.renderLoadingProgress(snapshot);
      presentations.push({ state: snapshot, label: Ge('#load-stage').textContent,
        detail: Ge('#load-detail').textContent, detailHidden: Ge('#load-detail').hidden,
        valueText: Ge('#load-meter').attributes.get('aria-valuetext'), width: Ge('#load-progress').style.width });
    },
    onAnnounce: text => { announcements.push(text); },
  });
  return { c, Ge, events, snapshots, presentations, announcements, fetches, textures, root };
}

function assertMinimalPresentations(f) {
  assert.equal(f.presentations.length, f.snapshots.length, 'every state renders successfully without a secondary node');
  for (const ui of f.presentations.filter(value => value.state.status === 'loading')) {
    assert.equal(ui.label, loadingPresentation(ui.state).label);
    assert.equal(ui.detail, '', `no diagnostic text leaks into ${ui.state.stage}`);
    assert.equal(ui.detailHidden, true, `no empty detail row during ${ui.state.stage}`);
    assert.equal(ui.valueText, ui.label, 'progressbar speech contains only the stage');
    assert.equal(ui.width, `${ui.state.workProgress * 100}%`, 'bar still follows actual retained work');
    assert.doesNotMatch(ui.label, /\d|KB|MB|批|总大小|细分进度|尝试/);
  }
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
  assertMinimalPresentations(f);
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
  assert.match(f.c.loadProgress.snapshot().secondary, /3\s*\/\s*14/);
  assert.equal(f.Ge('#load-secondary'), null);
  assert.equal(f.Ge('#load-stage').textContent, '下载房间');
  const options = f.fetches.find(record => record.url.includes('.glb.gz')).options;
  options.onAttempt({ attempt: 2, maxAttempts: 3 }); options.onProgress({ received: 4096, total: 0, attempt: 2 });
  assert.ok(f.c.loadProgress.snapshot().detail.includes(formatLoadingBytes(4096)));
  assert.match(f.c.loadProgress.snapshot().detail, /2\s*\/\s*3/);
  assert.equal(f.Ge('#load-detail').textContent, '');
  assert.equal(f.Ge('#load-detail').hidden, true);
  assert.equal(f.Ge('#load-retry').hidden, true);
  assert.equal(f.Ge('#load-cancel').hidden, true);
  assert.equal(f.c.loadProgress.snapshot().indeterminate, true);
  assert.equal(f.Ge('#load-meter').attributes.has('aria-valuenow'), false);
  imageTasks.slice(3).forEach(image => image.resolve({})); gi.resolve(bytes('{}')); model.resolve(bytes('model'));
  await task; assert.equal(f.c.cs, true);
  assertMinimalPresentations(f);
});

test('actual upload/batch counts remain truthful during indeterminate shader waiting', async () => {
  const f = fixture(); await f.c.loadRoom();
  const upload = f.snapshots.find(state => state.stage === 'upload' && state.stageProgress?.completed === 2);
  assert.equal(upload.stageProgress.total, 2); assert.match(upload.detail, /2\s*\/\s*2/);
  const waiting = f.snapshots.find(state => state.stage === 'warm' && state.indeterminate && state.stageProgress?.completed === 1);
  assert.equal(waiting.stageProgress.total, 4); assert.match(waiting.detail, /等待显卡/); assert.match(waiting.detail, /1\s*\/\s*4/);
  assert.ok(f.snapshots.filter(state => state.stage === 'warm').every(state => state.workProgress < 1));
  assertMinimalPresentations(f);
});

test('failure reveals actionable detail and retry, then a new load hides and clears the old reason', async () => {
  const f = fixture();
  f.c.fetchUint8Array = async () => { throw Object.assign(new Error('HTTP 503'), { status: 503, code: 'HTTP_ERROR' }); };
  await f.c.loadRoom();
  assert.equal(f.c.loadProgress.snapshot().status, 'failed');
  assert.equal(f.Ge('#load-detail').hidden, false);
  assert.match(f.Ge('#load-detail').textContent, /服务器 503/);
  assert.match(f.Ge('#load-detail').textContent, /重试/);
  assert.equal(f.Ge('#load-retry').hidden, false);
  assert.equal(f.Ge('#load-retry').disabled, false);
  assert.equal(f.Ge('#load-cancel').hidden, true);
  assert.match(f.announcements.at(-1), /服务器 503/);
  const model = deferred();
  f.c.fetchUint8Array = async url => url.includes('irradiance') ? bytes('{}') : model.promise;
  const retry = f.c.loadRoom(); await tick();
  assert.equal(f.c.loadProgress.snapshot().status, 'loading');
  assert.equal(f.Ge('#load-stage').textContent, '下载房间');
  assert.equal(f.Ge('#load-detail').textContent, '');
  assert.equal(f.Ge('#load-detail').hidden, true);
  assert.equal(f.Ge('#load-retry').hidden, true);
  assert.equal(f.Ge('#load-cancel').hidden, true);
  assert.equal(f.Ge('#load-meter').attributes.get('aria-valuetext'), '下载房间');
  model.resolve(bytes('model')); await retry;
  assert.equal(f.c.loadProgress.snapshot().status, 'ready');
  assertMinimalPresentations(f);
});

test('cancelled loading retains its recovery message without exposing progress diagnostics', async () => {
  const f = fixture(), model = deferred();
  f.c.fetchUint8Array = async url => url.includes('irradiance') ? bytes('{}') : model.promise;
  const task = f.c.loadRoom(); await tick();
  f.c.preparationAbort.abort(new DOMException('Cancelled', 'AbortError'));
  model.resolve(bytes('model')); await task;
  assert.equal(f.c.loadProgress.snapshot().status, 'cancelled');
  assert.equal(f.Ge('#load-stage').textContent, '载入已取消');
  assert.equal(f.Ge('#load-detail').textContent, '可以随时重新载入');
  assert.equal(f.Ge('#load-detail').hidden, false);
  assert.equal(f.Ge('#load-retry').hidden, false);
  assert.equal(f.Ge('#load-cancel').hidden, true);
  assert.equal(f.announcements.at(-1), '载入已取消。可以随时重新载入');
  assertMinimalPresentations(f);
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
  assert.doesNotMatch(overlay, /load-secondary/);
  assert.match(overlay, /<div class="loading-bear">ʕ•ᴥ•ʔ<\/div>/);
  assert.equal((overlay.match(/class="loading-bear"/g) || []).length, 1);
  assert.ok(overlay.indexOf('class="loading-bear"') < overlay.indexOf('id="load-stage"'));
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{\.loading-bear,#load-meter\.is-indeterminate:after\{animation:none\}/);
  assert.match(css, /\.loading-bear\{font:64px Georgia;color:#e4d8c7;animation:breathe 3s infinite\}/);
  assert.match(css, /@keyframes breathe\{50%\{transform:translateY\(-8px\)\}\}/);
  assert.match(css, /#loading\{[^}]*display:flex;flex-direction:column;align-items:center;justify-content:center/);
  assert.match(css, /#loading #load-stage\{max-width:calc\(100vw - 40px\)/);
  assert.match(css, /#load-meter\{[^}]*width:min\(280px,calc\(100vw - 48px\)\)/);
  assert.doesNotMatch(css, /\.loading-bear\s*\{[^}]*(?:display:none|visibility:hidden|opacity:0)/);
  assert.match(overlay, /<p id="load-stage">下载房间<\/p>/);
  assert.match(overlay, /<small id="load-detail" hidden><\/small>/);
  assert.match(overlay, /<button id="load-retry" hidden>/);
  assert.match(overlay, /<button id="load-cancel" hidden>/);
  assert.match(css, /#load-detail\[hidden\]\s*\{\s*display:\s*none/);
  assert.match(css, /\.loading-actions button\[hidden\]\s*\{\s*display:\s*none/);
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
