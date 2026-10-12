import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parseAst } from 'rollup/parseAst';
import { createPhaseTimings } from '../src/asset-loading.js';
import { createLoadingProgress } from '../src/loading-progress.js';
const main=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const wanted=['measurePhase','createLoadProgress','reportPreparationProgress','suspendGraphics','restoreGraphics','setRoomReady','syncPresetControls','vv','cl'];
const source=parseAst(main).body.filter(n=>n.type==='FunctionDeclaration'&&wanted.includes(n.id.name)).map(n=>main.slice(n.start,n.end)).join('\n');
function fixture(){
 const log=[],elements=new Map();
 const element=id=>{if(!elements.has(id))elements.set(id,{classList:{add(){},remove(){}},setAttribute(){}});return elements.get(id)};
 const snapshots=[];
 const c={AbortController,Error,Map,createPhaseTimings,loadProgress:null,Ge:element,graphicsAvailable:true,contextWasReady:false,cs:true,preparationAbort:new AbortController(),
  tn:{enabled:false},walk:{active:true,setInputEnabled(v){this.enabled=v;log.push(['input',v])}},bn:{setAttribute(){}},
  document:{visibilityState:'visible',querySelectorAll:()=>[]},Xr(){log.push(['clear-taps'])},roomInteractions:{resetKeys(){log.push(['reset-keys'])}},
  Fo:new Map(),Na(){},cancelAnimationFrame(){},requestAnimationFrame(){log.push(['scheduled']);return 2},Hs:1,oi:{errors:[]},setTimeout(){},
  pt:null,Qn:{},Fr:{textures:[]},No:[],Ot:{},jt:{},Rt:{},It:{},performance:{now:()=>5},Cr:0,
  preparationFrame:async()=>{},
  prepareFirstSwitch:async options=>{log.push(['prepare',options.signal]);return{}},
  showLoadFailure(error){c.cs=false;c.setRoomReady(false);c.oi.errors.push(String(error))},
  async finishRoomPreparation(){log.push(['final-frame']);c.cs=true;c.setRoomReady(true)},
 };
 c.loadingProgressManager=createLoadingProgress({onChange(state){snapshots.push(state)}});
 vm.createContext(c);vm.runInContext(source,c);return{c,log,snapshots};
}
test('context loss immediately freezes simulation, input and scene controls',()=>{
 const{c,log}=fixture();let prevented=false;c.suspendGraphics({preventDefault(){prevented=true}});
 assert.equal(prevented,true);assert.equal(c.cs,false);assert.equal(c.graphicsAvailable,false);assert.equal(c.walk.enabled,false);
 assert.equal(c.contextWasReady,true);assert.equal(c.preparationAbort.signal.aborted,true);
 c.vv(1000);assert.equal(c.Hs,null);assert.equal(log.some(x=>x[0]==='scheduled'),false);
 assert.ok(log.some(x=>x[0]==='clear-taps'));assert.ok(log.some(x=>x[0]==='reset-keys'));
});
test('restoration performs fresh preparation before final frame/input unlock',async()=>{
 const{c,log}=fixture();c.suspendGraphics({preventDefault(){}});const previous=c.preparationAbort;
 await c.restoreGraphics();assert.notEqual(c.preparationAbort,previous);assert.equal(c.cs,true);assert.equal(c.contextWasReady,false);
 assert.equal(c.tn.enabled,false,'walking keeps orbit controls off');assert.deepEqual(log.slice(-3).map(x=>x[0]),['prepare','final-frame','input']);
});
test('second loss during preparation cannot resume a stale generation',async()=>{
 const{c,log}=fixture();let finish;c.prepareFirstSwitch=()=>new Promise(resolve=>{finish=resolve});
 c.suspendGraphics({preventDefault(){}});const promise=c.restoreGraphics();await new Promise(resolve=>setImmediate(resolve));c.suspendGraphics({preventDefault(){}});finish({});await promise;
 assert.equal(c.cs,false);assert.equal(c.walk.enabled,false);assert.equal(log.some(x=>x[0]==='final-frame'),false);
});
test('failed graphics preparation keeps controls suspended',async()=>{
 const{c}=fixture();c.prepareFirstSwitch=async()=>{throw Error('compile failed')};c.suspendGraphics({preventDefault(){}});await c.restoreGraphics();
 assert.equal(c.cs,false);assert.equal(c.walk.enabled,false);assert.ok(c.oi.errors.includes('Error: compile failed'));
});

test('recovery exposes only real upload/warm/frame work and reaches 100 only after readiness', async () => {
 const {c,snapshots}=fixture();
 c.suspendGraphics({preventDefault(){}});
 c.prepareFirstSwitch=async ({onProgress})=>{
  onProgress({phase:'textures',uploadedTextures:1,totalTextures:2,drawnBatches:0,totalBatches:4});
  onProgress({phase:'shader-wait',uploadedTextures:2,totalTextures:2,drawnBatches:1,totalBatches:4});
  assert.ok(snapshots.at(-1).indeterminate);
  assert.ok(snapshots.every(state=>state.workProgress<1));
  return {};
 };
 c.finishRoomPreparation=async()=>{
  assert.equal(snapshots.at(-1).stage,'frame');
  assert.ok(snapshots.every(state=>state.workProgress<1));
  c.cs=true;c.setRoomReady(true);
 };
 await c.restoreGraphics();
 assert.equal(snapshots.at(-1).workProgress,1);
 assert.equal(snapshots.at(-1).status,'ready');
 assert.equal(snapshots.at(-1).totalStages,4,'Three restored work checkpoints plus explicit readiness');
});

test('late recovery callbacks cannot overwrite a newer successful progress generation', async () => {
 const {c,snapshots}=fixture();c.suspendGraphics({preventDefault(){}});
 let rejectOld,oldProgress,calls=0;
 c.prepareFirstSwitch=options=>{
  if (++calls===1) {oldProgress=options.onProgress;return new Promise((_,reject)=>{rejectOld=reject;});}
  return Promise.resolve({});
 };
 const old=c.restoreGraphics();
 await c.restoreGraphics();
 const count=snapshots.length,latest=snapshots.at(-1);
 oldProgress({phase:'textures',uploadedTextures:0,totalTextures:99,drawnBatches:0,totalBatches:99});
 rejectOld(Error('old recovery failure'));await old;
 assert.equal(snapshots.length,count);
 assert.equal(snapshots.at(-1),latest);
 assert.equal(latest.status,'ready');assert.equal(c.cs,true);
});
