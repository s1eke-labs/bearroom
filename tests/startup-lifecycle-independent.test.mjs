import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parseAst } from 'rollup/parseAst';
import { LoadResources } from '../src/load-resources.js';
import { AssetLoadError, createPhaseTimings } from '../src/asset-loading.js';

const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const names = ['pv', 'loadRoom', 'measurePhase', 'cleanupRoom', 'showLoadFailure', 'setRoomReady', 'syncPresetControls', 'suspendGraphics', 'restoreGraphics', 'finishRoomPreparation'];
const source = parseAst(main).body.filter(n => n.type === 'FunctionDeclaration' && names.includes(n.id.name)).map(n => main.slice(n.start, n.end)).join('\n');
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; };
const tick = () => new Promise(resolve => setImmediate(resolve));
function fixture() {
  const elements = new Map(), log = [], counts = { parsed: 0, disposed: 0, detached: 0 };
  const Ge = id => { if (!elements.has(id)) elements.set(id, { hidden:false, disabled:false, textContent:'', classList:{add(){},remove(){}}, setAttribute(){} }); return elements.get(id); };
  const resource = { dispose() { counts.disposed++; } };
  const meshes = Array.from({length:88}, (_,i) => ({ name:`piano_key_${String(i).padStart(3,'0')}`, isMesh:true, userData:{}, rotation:{x:0}, geometry:resource, material:{name:'key'} }));
  const root = { getObjectByName(){return null;}, traverse(fn){meshes.forEach(fn);}, removeFromParent(){counts.detached++;} };
  const c = {
    AbortController, DOMException, Error, Map, Set, TextDecoder, Uint8Array, LoadResources, createPhaseTimings,
    performance, setTimeout(){return 1;}, clearTimeout(){}, cancelAnimationFrame(){},
    Ge, document:{querySelectorAll:()=>[]}, bn:{dataset:{modelWorker:'worker.js'},setAttribute(){}},
    loadTask:null, runtimeResources:null, textureTasks:new Map(), phaseTimings:null, preparationAbort:new AbortController(),
    graphicsAvailable:true, contextWasReady:false, cs:false, walk:null, roomInteractions:null, pcCase:null, Fr:null, Qn:null, pt:null, Nr:null,
    Uo:[], eu:[], tu:[], No:[], Rr:[], nu:[], wi:new Map(), Fo:new Map(), _i:0, _n:0, qc:0, Hs:null,
    tn:{enabled:false}, oi:{errors:[]}, phaseNames:{download:'空间下载',textures:'画作载入',parse:'家具解析'},
    Xr(){}, Na(){}, ji(){}, ASSET_REVISION:{modelSha256:'a'.repeat(64)}, Io:'b'.repeat(64),
    PC_CASE_CONFIG:{wallpaperUrl:'/wall.webp',screenName:'screen'},
    fetchUint8Array: async url => new TextEncoder().encode(url.includes('irradiance') ? '{}' : 'model'),
    loadTexture:async () => ({}), decodeGzip:async () => new Uint8Array([1]),
    j0:class { async parseAsync(){counts.parsed++;return {scene:root};} },
    jt:{add(){}}, Rt:{}, It:{}, Ot:{setSize(){},getContext(){return {isContextLost:()=>false};}}, innerWidth:800,innerHeight:600, Ei:false, kr:false, Cr:0,
    Ox:class {constructor(){this.frame={up:{}};}applyCutaway(){}fit(){}}, Qx:class {update(){}},
    ov(){}, fv(){}, cv(){}, dv:async()=>{}, $c:async()=>({}),
    sv:async()=>({textures:[],setDay(){},dispose(){}}), Kx(){},
    initializeWalk(){c.walk={active:false,setInputEnabled(value){log.push(['input',value]);},resize(){},dispose(){}};},
    prepareFirstSwitch:async()=>({}),
    preparationFrame:async()=>{}, vv(){log.push(['frame']);return true;}, Yc:null,
  };
  vm.createContext(c);vm.runInContext(source,c);
  return {c,Ge,log,counts,root,resource};
}

test('actual pv shares one startup promise and clears its latch after completion',async()=>{
  const {c,counts}=fixture(), parse=deferred();
  c.j0=class {parseAsync(){counts.parsed++;return parse.promise;}};
  const first=c.pv(),second=c.pv();assert.equal(first,second);await tick();assert.equal(counts.parsed,1);
  parse.resolve({scene:fixture().root});await first;assert.equal(c.cs,true);assert.equal(c.loadTask,null);
});

test('actual startup abort cleans a late parser result and permits a fresh retry',async()=>{
  const {c,counts,root}=fixture(), parse=deferred();c.j0=class {parseAsync(){return parse.promise;}};
  const first=c.pv();await tick();c.preparationAbort.abort(new DOMException('Cancelled','AbortError'));await first;
  assert.equal(c.cs,false);assert.equal(c.Qn,null);assert.equal(c.loadTask,null);
  parse.resolve({scene:root});await tick();assert.equal(counts.disposed,1);assert.equal(counts.detached,1);
  c.j0=class {async parseAsync(){return {scene:fixture().root};}};await c.pv();assert.equal(c.cs,true);
});

for (const failedStage of ['download','textures']) test(`actual startup reports ${failedStage} failure and releases attempt resources`,async()=>{
  const {c,Ge}=fixture();const error=new AssetLoadError('HTTP 503',{stage:'headers',code:'HTTP_ERROR',status:503});
  if(failedStage==='download') { const original=c.fetchUint8Array;c.fetchUint8Array=async url=>{if(url.includes('.glb.gz'))throw error;return original(url);}; }
  else c.loadTexture=async()=>{throw error;};
  await c.pv();assert.equal(c.cs,false);assert.equal(c.runtimeResources,null);assert.equal(c.loadTask,null);
  assert.equal(error.roomStage,failedStage);assert.equal(Ge('#load-retry').hidden,false);assert.equal(Ge('#load-retry').disabled,false);
  assert.ok(Ge('#load-detail').textContent.startsWith(failedStage==='download'?'空间下载':'画作载入'));
});

test('ready assets survive context loss, and restoration waits for new preparation before unlocking',async()=>{
  const {c,counts}=fixture();await c.pv();const root=c.Qn,scope=c.runtimeResources,prep=deferred();
  c.suspendGraphics({preventDefault(){}});assert.equal(scope.closed,false);assert.equal(counts.disposed,0);assert.equal(c.cs,false);
  c.prepareFirstSwitch=()=>prep.promise;const restoration=c.restoreGraphics();await tick();assert.equal(c.cs,false);assert.equal(c.Qn,root);
  prep.resolve({});await restoration;assert.equal(c.cs,true);assert.equal(c.runtimeResources,scope);assert.equal(counts.disposed,0);
});

test('stale restoration rejection cannot disable a newer successful restoration',async()=>{
  const {c}=fixture();await c.pv();const first=deferred();let calls=0;c.prepareFirstSwitch=()=>++calls===1?first.promise:Promise.resolve({});
  c.suspendGraphics({preventDefault(){}});const old=c.restoreGraphics();c.suspendGraphics({preventDefault(){}});
  await c.restoreGraphics();assert.equal(c.cs,true);first.reject(Error('old context lost'));await old;
  assert.equal(c.cs,true,'A stale recovery catch must not revoke current readiness');
});


test('actual final frame gate keeps input disabled until a successful restored draw',async()=>{
  const {c,log}=fixture();await c.pv();c.suspendGraphics({preventDefault(){}});
  const frame=deferred();c.preparationFrame=()=>frame.promise;
  const task=c.restoreGraphics();await tick();assert.equal(c.cs,false);const count=log.filter(x=>x[0]==='frame').length;
  frame.resolve();await task;assert.equal(c.cs,true);assert.equal(log.filter(x=>x[0]==='frame').length,count+1);
  assert.deepEqual(log.slice(-2),[['frame'],['input',true]]);
});

test('early texture failure cancels a still-pending model and preserves the texture diagnosis', {timeout:1000}, async()=>{
  const {c,Ge}=fixture();const original=c.fetchUint8Array;let aborted=false;
  c.fetchUint8Array=(url,{signal})=>url.includes('.glb.gz')?new Promise((resolve,reject)=>signal.addEventListener('abort',()=>{aborted=true;reject(signal.reason);},{once:true})):original(url);
  c.loadTexture=async()=>{throw Error('broken texture');};await c.pv();
  assert.equal(aborted,true);assert.equal(c.cs,false);assert.equal(c.loadTask,null);assert.ok(Ge('#load-detail').textContent.startsWith('画作载入'));
});

test('actual cleanup detaches room control listeners once before a retry replaces the room', () => {
  const { c } = fixture();
  let disposed = 0;
  c.pt = { dispose() { disposed++; } };
  c.cleanupRoom();
  assert.equal(disposed, 1);
  assert.equal(c.pt, null);
  c.cleanupRoom();
  assert.equal(disposed, 1, 'A repeated cleanup cannot dispose an already detached room');
});
