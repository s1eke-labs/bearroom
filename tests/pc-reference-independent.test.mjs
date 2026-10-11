/** Independent actual-asset reference-PC checks. These are CPU checks, not WebGL or mobile-FPS certification. */
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {loadSceneForCPU} from './helpers.mjs';
import {checkOrganicPreservation} from '../scripts/check-organic-preservation.mjs';
import {WalkNavigation} from '../src/walk-navigation.js';
import {IsometricRoom,configureControls,isWorldVisible,isClipped} from '../src/camera.js';
import {freezeTransforms} from '../src/performance.js';
import {PcCaseController,PC_CASE_CONFIG} from '../src/pc-case.js';
import {L as Vector3,Lf as Raycaster,Kt as Box3,Gr as OrthographicCamera} from '../vendor/runtime-v11.js';
const root=await loadSceneForCPU();root.updateMatrixWorld(true);
const pc=root.getObjectByName(PC_CASE_CONFIG.rootName),screen=root.getObjectByName(PC_CASE_CONFIG.screenName);
assert.ok(pc,'reference PC root');assert.ok(screen,'reference portrait screen');
const pcSet=new Set();pc.traverse(n=>pcSet.add(n));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const stable=x=>x&&typeof x==='object'?(Array.isArray(x)?x.map(stable):Object.fromEntries(Object.keys(x).sort().map(k=>[k,stable(x[k])]))):x;
function snapshot(n){const p={name:n.name,type:n.type,parent:n.parent?.name,matrixWorld:n.matrixWorld.toArray(),userData:n.userData};if(n.isMesh){p.geometry={};for(const [key,a]of Object.entries(n.geometry.attributes))p.geometry[key]=hash(Buffer.from(a.array.buffer,a.array.byteOffset,a.array.byteLength));if(n.geometry.index){const a=n.geometry.index.array;p.geometry.index=hash(Buffer.from(a.buffer,a.byteOffset,a.byteLength))}p.materials=(Array.isArray(n.material)?n.material:[n.material]).map(m=>m.name)}return p}
const outside=[];root.traverse(n=>{if(!pcSet.has(n))outside.push(snapshot(n))});outside.sort((a,b)=>a.name.localeCompare(b.name));
// Independent frozen-v15 snapshot, captured before any v16 model was installed.
const baselineOutsideSha='6ad250ab2e1ddaca00ef8aeaa25c164711a08ae52e41f9895f89deb28b642a52';
const outsideSha=hash(JSON.stringify(stable(outside)));
const hasOrganicSeating=outside.some(n=>n.materials?.some(m=>m.startsWith('fabric_v17_')));
// Capture the unaffected v16 nodes before controllers mutate their scene copies.
const organicPreservation=hasOrganicSeating?checkOrganicPreservation(root):null;
const nav=new WalkNavigation(root),camera=new OrthographicCamera(-12,12,10,-10,.1,100),controls={target:new Vector3(),mouseButtons:{},touches:{},update(){},addEventListener(){}};
configureControls(controls);const room=new IsometricRoom(root,camera,controls);room.setView('lower');room.fit(1440,900);
class TestTexture{constructor(image){this.image=image;this.source={}}dispose(){}}
const canvas={getContext:()=>({clearRect(){},fillRect(){},drawImage(){},fillText(){}})};
const controller=new PcCaseController(root,{wallpaper:new TestTexture({width:256,height:976}),canvasFactory:()=>canvas,now:()=>Date.UTC(2026,9,8,11,0)});freezeTransforms(root);

test('PC independent: protected nodes preserve frozen source outside explicit organic and reviewed bathroom meshes',()=>{
 if(hasOrganicSeating){assert.ok(organicPreservation.protectedNodes+organicPreservation.explicitLaterRevisionExcludedOriginalNodes.length>=380);assert.ok(organicPreservation.checks.some(n=>n.name==='screen_PC_case_v16'));}
 else {assert.equal(outside.length,344);assert.equal(outsideSha,baselineOutsideSha);}
});
test('PC independent: actual nine rotor controls have correct exported local axes and share only four RGB materials',()=>{
 assert.equal(controller.rotors.length,9);assert.equal(controller.zones.length,4);
 const names=new Set();for(const r of controller.rotors){assert.equal(r.axis,r.object.name.includes('side')?'x':r.object.name.includes('top')?'y':'z');assert.ok(r.speed>=.5&&r.speed<=6);assert.equal(r.object.isMesh,undefined);names.add(r.object.name);r.object.traverse(o=>{if(o.isMesh)assert.equal(o.userData.noShadowCaster,true,`${o.name} must not animate tiny room-light shadows`)})}assert.equal(names.size,9);
 assert.equal(new Set(controller.zones.map(z=>z.material)).size,4);let lights=0;pc.traverse(o=>{if(o.isLight)lights++});assert.equal(lights,0);
});
test('PC independent: screen winding, canvas UV orientation and fixed/standing direct raycasts are valid',()=>{
 room.setView('lower');const p=screen.geometry.attributes.position,uv=screen.geometry.attributes.uv,index=screen.geometry.index,vs=[];
 for(let i=0;i<3;i++)vs.push(new Vector3().fromBufferAttribute(p,index?index.getX(i):i).applyMatrix4(screen.matrixWorld));
 const normal=vs[1].clone().sub(vs[0]).cross(vs[2].clone().sub(vs[0])).normalize();assert.ok(normal.x>.7&&normal.z>.7&&Math.abs(normal.y)<1e-5);assert.equal(screen.material.side,0);assert.equal(controller.texture.flipY,false);
 const ys=[];for(let i=0;i<p.count;i++)ys.push(new Vector3().fromBufferAttribute(p,i).applyMatrix4(screen.matrixWorld).y);const lo=Math.min(...ys),hi=Math.max(...ys);for(let i=0;i<p.count;i++){assert.ok(uv.getX(i)>=0&&uv.getX(i)<=1);if(Math.abs(ys[i]-hi)<1e-6)assert.equal(uv.getY(i),0);if(Math.abs(ys[i]-lo)<1e-6)assert.equal(uv.getY(i),1)}
 const center=new Box3().setFromObject(screen,true).getCenter(new Vector3()),ray=new Raycaster();assert.ok(nav.setPosition({x:4.5,y:.014,z:.8}));assert.ok(Math.abs(nav.eyePosition().y-nav.position.y-1.6)<1e-9);
 for(const origin of [center.clone().addScaledVector(new Vector3(1,1,1).normalize(),35),nav.eyePosition()]){ray.set(origin,center.clone().sub(origin).normalize());const hit=ray.intersectObject(root,true).find(h=>{const m=Array.isArray(h.object.material)?h.object.material[h.face?.materialIndex||0]:h.object.material;return isWorldVisible(h.object)&&m&&!isClipped(h.point,m)&&m.opacity>.3&&!/glass/i.test(m.name)&&!h.object.userData.toyNap});assert.equal(hit?.object,screen)}
 ray.set(center.clone().addScaledVector(normal,-.1),normal);assert.equal(ray.intersectObject(screen).length,0,'back face must not render');
});
test('PC independent: authored case is desk-scale, all lowest contacts are supported and nearby lamp/monitor stay clear',()=>{
 const bounds=new Box3().setFromObject(pc,true);assert.ok(bounds.min.x>=4.124&&bounds.max.x<=4.556);assert.ok(bounds.min.z>=-.311&&bounds.max.z<=.175);assert.ok(bounds.max.y-bounds.min.y>.5&&bounds.max.y-bounds.min.y<.65);
 for(const name of ['F10_monitor','F12_desk_lamp'])assert.equal(bounds.intersectsBox(new Box3().setFromObject(root.getObjectByName(name),true)),false,name);
 const desk=root.getObjectByName('F08_computer_desk'),ray=new Raycaster(),point=new Vector3();let contacts=0;
 pc.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){point.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);if(Math.abs(point.y-bounds.min.y)>1e-6)continue;const foot=point.clone();ray.set(point.clone().add(new Vector3(0,.0001,0)),new Vector3(0,-1,0));ray.far=.02;const hit=ray.intersectObject(desk,true)[0];assert.ok(hit,`no desktop below ${foot.toArray()}`);assert.ok(Math.abs(hit.point.y-foot.y)<.00001,'feet must be seated, not floating');contacts++}});assert.ok(contacts>=4);
 // Check the actual diagonal hull, not just its AABB: floor ribs must not poke through the LCD corner.
 pc.traverse(o=>{if(!o.isMesh)return;const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){point.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);if(point.x>4.449&&point.y>.923&&point.y<.936)assert.ok(point.x+point.z<=4.620,`base grate protrudes outside chamfer: ${point.toArray()}`)}});
 for(const[x,z]of [[4.5,.8],[4.5,1.8],[4.5,-.8],[4.2,-.6]])assert.ok(nav.setPosition({x,y:.014,z}),'near-PC walk position');
});
test('PC independent: actual frozen scene rotates at most30Hz without modifying geometry, children or pivot centers',()=>{
 room.setView('lower');const centers=controller.rotors.map(r=>r.object.getWorldPosition(new Vector3())),children=controller.rotors.map(r=>r.object.children.map(c=>({object:c,rotation:c.rotation.toArray(),geometry:c.geometry,positions:c.geometry?.attributes.position.array.slice()})));
 const count=controller.frameUpdates;for(let i=0;i<1200;i++)controller.update(i/60,camera,900,(1+Math.sin(i/180))/2);
 assert.ok(controller.frameUpdates-count<=601);assert.equal(controller.textureUploads,1);controller.rotors.forEach((r,i)=>{assert.ok(r.object.getWorldPosition(new Vector3()).distanceTo(centers[i])<1e-8);for(const c of children[i]){assert.deepEqual(c.object.rotation.toArray(),c.rotation);assert.equal(c.object.geometry,c.geometry);assert.deepEqual(c.object.geometry?.attributes.position.array,c.positions)}});
 const previous=controller.frameUpdates;room.setView('upper');controller.update(30,camera,900,0);assert.equal(controller.frameUpdates,previous);room.setView('lower');
});

test('PC independent: actual blade planes keep their world normals, centers and axial depths through full spins',()=>{
 room.setView('lower');
 const axisNames=['x','y','z'],point=new Vector3();
 const frames=controller.rotors.map(r=>{
  const blade=r.object.children.find(o=>o.isMesh&&o.name.includes('_blades'));assert.ok(blade,`${r.object.name} actual blade mesh`);
  const a=blade.geometry.attributes.position,low=[Infinity,Infinity,Infinity],high=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<a.count;i++){point.fromBufferAttribute(a,i).applyMatrix4(blade.matrixWorld);r.object.worldToLocal(point);for(let k=0;k<3;k++){low[k]=Math.min(low[k],point.getComponent(k));high[k]=Math.max(high[k],point.getComponent(k))}}
  const spans=high.map((v,i)=>v-low[i]),normalAxis=spans.indexOf(Math.min(...spans));assert.equal(axisNames[normalAxis],r.axis,`${r.object.name} geometry plane must match its configured spin axis`);assert.ok(spans[normalAxis]<Math.max(...spans)*.2,'blade set must have a distinct thin rotation plane');
  const localNormal=new Vector3().setComponent(normalAxis,1),normal=localNormal.clone().transformDirection(r.object.matrixWorld),center=r.object.getWorldPosition(new Vector3()),samples=[];
  for(let i=0;i<a.count;i+=Math.max(1,Math.floor(a.count/32))){const delta=new Vector3().fromBufferAttribute(a,i).applyMatrix4(blade.matrixWorld).sub(center),depth=delta.dot(normal);samples.push({i,depth,radiusSquared:delta.lengthSq()-depth*depth})}
  return {r,blade,localNormal,normal,center,samples};
 });
 // Eight simulated seconds cover more than three full turns even for the slowest fan.
 for(let frame=0;frame<49;frame++){
  controller.update(60+frame/6,camera,900,0);
  for(const f of frames){const center=f.r.object.getWorldPosition(new Vector3()),normal=f.localNormal.clone().transformDirection(f.r.object.matrixWorld);assert.ok(center.distanceTo(f.center)<1e-8,`${f.r.object.name} center moved`);assert.ok(normal.distanceTo(f.normal)<1e-8,`${f.r.object.name} plane flapped`);
   for(const sample of f.samples){point.fromBufferAttribute(f.blade.geometry.attributes.position,sample.i).applyMatrix4(f.blade.matrixWorld).sub(center);const depth=point.dot(f.normal);assert.ok(Math.abs(depth-sample.depth)<1e-7,`${f.r.object.name} blade left its plane`);assert.ok(Math.abs(point.lengthSq()-depth*depth-sample.radiusSquared)<1e-8,`${f.r.object.name} blade radius changed`)}}
 }
});
