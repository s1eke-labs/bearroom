/** Independent CPU actual-asset and actual-listener checks. No browser/GPU claims. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parseAst} from 'rollup/parseAst';
import {loadSceneForCPU} from './helpers.mjs';
import {RoomInteractions,KEYBOARD_CONFIG,roomHitIsVisible,sceneTapEndsOnCanvas} from '../src/room-interactions.js';
import {PcCaseController} from '../src/pc-case.js';
import {isTap} from '../src/domain.js';
import {cancelOrbitGesture} from '../src/orbit-input.js';
import {IsometricRoom,configureControls} from '../src/camera.js';
import {freezeTransforms} from '../src/performance.js';
import {L as Vector3,Lf as Raycaster,Gr as OrthographicCamera} from '../vendor/runtime-v11.js';
import {QAElement,dispatch} from './walk-qa-helpers.mjs';

const root=await loadSceneForCPU();root.updateMatrixWorld(true);
const camera=new OrthographicCamera(-12,12,10,-10,.1,100);
const controls={target:new Vector3(),mouseButtons:{},touches:{},update(){},addEventListener(){}};
configureControls(controls);const room=new IsometricRoom(root,camera,controls);room.setView('lower');room.fit(1440,900);
const controller=new PcCaseController(root);let pianos=0,doors=0,changes=0;
const interactions=new RoomInteractions(root,{pcCase:controller,onPiano:()=>pianos++,onDoor:()=>doors++,onChange:()=>changes++});
freezeTransforms(root);
const ray=new Raycaster();

test('independent interactions: all 76 actual keycaps raycast and move only their own authored vertices',()=>{
 let checked=0;
 for(const [mesh,entry] of interactions.keyMeshes){
  for(const key of entry.keys){
   // The inherited spacebar overlaps five small-cap centres. Their negative-Z
   // quarter remains exposed; use the actually visible portion of each cap.
   const local=new Vector3((key.min[0]+key.max[0])/2,key.max[1]+.03,key.min[2]+(key.max[2]-key.min[2])*.23);
   const direction=new Vector3(0,-1,0).transformDirection(mesh.matrixWorld);ray.set(local.applyMatrix4(mesh.matrixWorld),direction);
   const hit=ray.intersectObject(root,true).find(roomHitIsVisible);assert.ok(hit);const target=interactions.target(hit);assert.equal(target?.type,'keyboard');assert.equal(target.key,key);
   const before=entry.position.array.slice(),original=entry.original.attributes.position.array.slice(),normals=entry.geometry.attributes.normal.array.slice();
   assert.equal(interactions.interact(hit,1000,0),true);interactions.update(1110);
   const vertices=new Set(key.vertices);for(let i=0;i<entry.position.count;i++)for(let axis=0;axis<3;axis++){
    const difference=entry.position.array[i*3+axis]-before[i*3+axis];
    if(axis===1&&vertices.has(i))assert.ok(Math.abs(difference+KEYBOARD_CONFIG.travel)<1e-6);else assert.equal(difference,0);
   }
   assert.deepEqual(entry.geometry.attributes.normal.array,normals);assert.deepEqual(entry.original.attributes.position.array,original);
   interactions.update(1220);assert.deepEqual(entry.position.array,before);checked++;
  }
 }
 assert.equal(checked,76);assert.equal(pianos,0);assert.equal(doors,0);assert.equal(controller.powered,true);
});

test('independent interactions: repeated, simultaneous and interrupted cap taps restore exactly',()=>{
 const [mesh,entry]=interactions.keyMeshes.entries().next().value;const keys=entry.keys.slice(0,2);
 const faces=keys.map(key=>{let face=0;while(entry.vertexToKey[entry.geometry.index.getX(face*3)]!==entry.keys.indexOf(key))face++;return {object:mesh,faceIndex:face};});
 const before=entry.position.array.slice();interactions.interact(faces[0],1000);interactions.update(1100);const depression=keys[0].offset;
 interactions.interact(faces[0],1100);interactions.update(1100);assert.ok(keys[0].offset>=depression-1e-12);
 interactions.interact(faces[1],1100);interactions.update(1200);assert.equal(interactions.activeKeys.size,2);interactions.resetKeys();
 assert.equal(interactions.activeKeys.size,0);assert.deepEqual(entry.position.array,before);
});

test('independent interactions: case front glass is tappable, foreground and clipping still occlude',()=>{
 const pc=root.getObjectByName('F09_computer'),glass=[];pc.traverse(o=>{if(o.isMesh&&/glass/.test(o.material.name))glass.push(o)});assert.ok(glass.length>=2);
 for(const object of glass){const point=object.getWorldPosition(new Vector3());assert.equal(roomHitIsVisible({object,point}),true);assert.equal(interactions.target({object})?.type,'pc');}
 const wall=root.getObjectByName('cutaway_bathroom_rear_privacy');assert.equal(interactions.target({object:wall}),null);
 const hidden=glass[0];hidden.visible=false;assert.equal(roomHitIsVisible({object:hidden,point:hidden.getWorldPosition(new Vector3())}),false);hidden.visible=true;
 room.setView('upper');const visibleGlass=glass[1];assert.equal(roomHitIsVisible({object:visibleGlass,point:visibleGlass.getWorldPosition(new Vector3())}),false);room.setView('lower');
});

test('independent interactions: all nine actual fans and four RGB zones stay off across light/view changes',()=>{
 controller.update(1,camera,900,0);assert.equal(controller.rotors.length,9);assert.equal(controller.zones.length,4);
 const hit={object:controller.root};interactions.interact(hit,0,1);assert.equal(controller.powered,false);
 const angles=controller.rotors.map(r=>r.object.rotation[r.axis]),geometry=[];controller.root.traverse(o=>{if(o.isMesh)geometry.push([o,o.geometry])});
 for(let i=2;i<300;i++){room.setView(i%4===0?'upper':'lower');controller.update(i,camera,900,i%2);assert.deepEqual(controller.rotors.map(r=>r.object.rotation[r.axis]),angles);for(const z of controller.zones)assert.equal(z.material.emissiveIntensity,0);}
 room.setView('lower');interactions.interact(hit,0,300);assert.equal(controller.powered,true);controller.update(300.1,camera,900,0);assert.ok(controller.rotors.some((r,i)=>r.object.rotation[r.axis]!==angles[i]));assert.ok(controller.zones.every(z=>z.material.emissiveIntensity>0));for(const[o,g]of geometry)assert.equal(o.geometry,g);
});

const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8'),ast=parseAst(source);
const pointerEvents=new Set(['pointerdown','pointermove','pointerup','pointercancel','lostpointercapture']);
const handlers=ast.body.filter(n=>n.type==='ExpressionStatement'&&n.expression.type==='CallExpression'&&n.expression.callee.object?.name==='bn'&&n.expression.callee.property?.name==='addEventListener'&&pointerEvents.has(n.expression.arguments[0]?.value));
const clear=ast.body.find(n=>n.type==='FunctionDeclaration'&&n.id.name==='Xr');assert.equal(handlers.length,5);
function pointerFixture(){
 const canvas=new QAElement('canvas');let now=0,hits=0,overlay=false,modal=false;
 const context={bn:canvas,cancelOrbitGesture,syncPresetControls(){},cs:true,walk:{active:false},Rt:new OrthographicCamera(-4,4,3,-3,.1,100),tn:{target:new Vector3(),update(){}},performance:{now:()=>now},Kc:{set(){}},jc:{setFromCamera(){},intersectObject(){return [{}]}},Qn:{},roomHitIsVisible:()=>true,roomInteractions:{target:()=>({type:'pc'}),interact:()=>hits++},_i:0,pt:{constrain(){}},kx:isTap,sceneTapEndsOnCanvas:(e,c)=>sceneTapEndsOnCanvas(e,c,context.document),document:{querySelector:()=>modal?{}:null,elementFromPoint:()=>overlay?{}:canvas}};
 vm.createContext(context);vm.runInContext('const Ri=new Set();let dt=null;'+source.slice(clear.start,clear.end)+'\n'+handlers.map(n=>source.slice(n.start,n.end)).join('\n'),context);
 const fire=(type,id=1,x=400,y=300,button=0)=>dispatch(canvas,type,{pointerId:id,clientX:x,clientY:y,button});
 return {fire,context,get hits(){return hits},setTime:v=>now=v,setOverlay:v=>overlay=v,setModal:v=>modal=v};
}
test('independent actual fixed-view handlers: one stationary tap produces exactly one interaction',()=>{
 const f=pointerFixture();f.fire('pointerdown');f.fire('pointerup');f.fire('lostpointercapture');assert.equal(f.hits,1);
 f.fire('pointerup');assert.equal(f.hits,1);
});
for(const [name,interrupt] of [
 ['drag',f=>f.fire('pointermove',1,450,300)],
 ['up-only displacement',f=>f.fire('pointerup',1,450,300)],
 ['pointercancel',f=>f.fire('pointercancel')],
 ['capture loss',f=>f.fire('lostpointercapture')],
 ['multitouch',f=>{f.fire('pointerdown',2);f.fire('pointerup',2)}],
 ['long press',f=>f.setTime(650)],
 ['overlay release',f=>f.setOverlay(true)],
 ['modal release',f=>f.setModal(true)],
 ['outside release',f=>f.fire('pointerup',1,1800,300)],
])test(`independent actual fixed-view handlers: ${name} cannot toggle`,()=>{
 const f=pointerFixture();f.fire('pointerdown');interrupt(f);f.fire('pointerup');assert.equal(f.hits,0);
});
