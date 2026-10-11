import test from 'node:test';
import assert from 'node:assert/strict';
import {WalkNavigation,WALK_CONFIG} from '../src/walk-navigation.js';
import {L as Vector3,Lf as Raycaster} from '../vendor/runtime-v11.js';
import {loadSceneForCPU} from './helpers.mjs';
const scene=await loadSceneForCPU();scene.getObjectByName('Exterior_city')?.removeFromParent();scene.updateMatrixWorld(true);
const nav=new WalkNavigation(scene);
const close=(a,b,e=.012)=>Math.abs(a-b)<e;
function moveTo(x,z,trace=[]){
 let previous=nav.position.clone();
 for(let i=0;i<800;i++){
  const dx=x-nav.position.x,dz=z-nav.position.z,distance=Math.hypot(dx,dz);
  if(distance<.01)return trace;
  nav.move(Math.min(1/60,distance/nav.config.speed),{x:dx/distance,z:dz/distance});
  assert.ok(Math.abs(nav.position.y-previous.y)<=nav.config.stepHeight+1e-5,`illegal step ${previous.toArray()} -> ${nav.position.toArray()}`);
  assert.ok(!nav.capsuleBlocked(nav.position.x,nav.position.y,nav.position.z),'capsule intersects authored geometry');
  if(Math.abs(nav.position.y-previous.y)>.05||i%60===0)trace.push(nav.position.clone());
  previous.copy(nav.position);
 }
 assert.fail(`Route blocked to (${x},${z}) at ${nav.position.toArray()}`);
}
function assertRealSupport(feet){
 // Independent Three.js raycasts at the actual circular footprint: every sampled
 // elevated foot position must coincide with an authored triangle, never a fake ramp.
 const ray=new Raycaster(),ys=[];
 for(let i=-1;i<8;i++){
  const angle=i*Math.PI/4,r=i<0?0:nav.config.radius*.99,x=feet.x+Math.cos(angle)*r,z=feet.z+Math.sin(angle)*r;
  ray.set(new Vector3(x,feet.y+.003,z),new Vector3(0,-1,0));ray.far=.5;
  for(const hit of ray.intersectObject(scene,true))if(Math.abs(hit.point.y-feet.y)<.004)ys.push(hit.point.y);
 }
 assert.ok(ys.length,`No authored foot support at ${feet.toArray()}`);
}
test('walk QA: safe authored lower/upper spawns, invalid placement rejected, all hidden geometry retained',()=>{
 for(const floor of ['lower','upper']){nav.reset(floor);assert.equal(nav.capsuleBlocked(nav.position.x,nav.position.y,nav.position.z),false);assertRealSupport(nav.position);assert.ok(floor==='lower'?nav.position.y<.1:nav.position.y>3.1);}
 const before=nav.position.clone();for(const p of [{x:NaN,y:0,z:0},{x:0,y:Infinity,z:0},{x:50,y:0,z:0},{x:0,y:10,z:0},{x:3.78,y:.014,z:-1.98}]){assert.equal(nav.setPosition(p),false);assert.deepEqual(nav.position,before);}
 for(const name of ['cutaway_wall_east','cutaway_wall_south_east','cutaway_upper_slab','window_glass_lower','bathroom_oak_door'])assert.ok(scene.getObjectByName(name),name);
 assert.ok(nav.capsuleBlocked(5.05,.014,2.2));assert.ok(nav.capsuleBlocked(3.78,.014,-1.98));
 assert.ok(nav.stats.triangleCount>600000);assert.ok(nav.stats.nodeCount>1000);
});
test('walk QA: continuous lower circulation, real 18-tread ascent, upper bed/reading loop and full stair descent',()=>{
 nav.reset('lower');const trace=[];
 for(const[x,z]of [[.5,.2],[-3.5,.2],[-3.5,3.55],[-4.4,3.55],[-4.4,-1.8],[-3.45,-1.8],[-3.45,0],[4.2,0],[4.2,-2],[1.5,-2],[1.5,-3.4],[3.5,-3.4],[4.2,-2],[4.2,0],[-3.45,0],[-3.45,-1.8],[-4.4,-1.8],[-4.4,3.55],[-3.5,3.55],[-3.5,.2],[.5,.2]])moveTo(x,z,trace);
 assert.ok(close(nav.position.y,.014));assert.ok(close(nav.position.x,.5));assert.ok(close(nav.position.z,.2));
 const stairHeights=new Set(trace.filter(p=>Math.abs(p.x+4.4)<.01&&p.y>.1&&p.y<3.13).map(p=>p.y.toFixed(2)));assert.ok(stairHeights.size>=18,`${stairHeights.size} stair surfaces observed`);
 for(const point of trace)assertRealSupport(point);
});
test('walk QA: desk and piano are reachable from common room without crossing furniture',()=>{
 nav.reset('lower');for(const[x,z]of [[.6,.2],[1.1,-.8],[3.5,-.8],[1.1,-.8],[.6,.2],[.6,3.6],[3.5,3.6],[3.5,2.2],[4.5,2.2],[4.5,1.8]])moveTo(x,z);
 assert.ok(nav.position.y<.1);
});
test('walk QA: thin walls, glass, closed door, furniture, bed and loft rail stop movement',()=>{
 const cases=[
  ['piano',[.65,.014,1.7],[1,0],p=>p.x<1.1],
  ['desk',[3.5,.014,-1],[0,1],p=>p.z<-.55],
  ['closed bathroom door',[3.78,.014,-1.25],[0,-1],p=>p.z>-1.8],
  ['east exterior',[4.4,.014,2.2],[1,0],p=>p.x<4.78],
  ['window',[1.3,.014,-3.2],[0,-1],p=>p.z>-3.8],
  ['front entrance',[.45,.014,3.35],[0,1],p=>p.z<3.8],
  ['loft guardrail',[.5,3.13,0],[0,1],p=>p.z<.55&&p.y>3.1],
  ['bed',[0,3.13,-.6],[0,-1],p=>p.z>-.9],
 ];
 for(const[label,start,direction,valid]of cases){assert.ok(nav.setPosition({x:start[0],y:start[1],z:start[2]}),label+' fixture');for(let i=0;i<240;i++)nav.move(1/60,{x:direction[0],z:direction[1]});assert.ok(valid(nav.position),`${label}: ${nav.position.toArray()}`);assert.equal(nav.capsuleBlocked(nav.position.x,nav.position.y,nav.position.z),false,label);}
});
test('walk QA: long dt cannot tunnel, diagonal speed is bounded, malformed input is harmless',()=>{
 const start={x:.7,y:.014,z:.2};assert.ok(nav.setPosition(start));const a=nav.position.clone();nav.move(.02,{x:1,z:0});const straight=nav.position.distanceTo(a);assert.ok(nav.setPosition(start));const b=nav.position.clone();nav.move(.02,{x:1,z:1});assert.ok(Math.abs(nav.position.distanceTo(b)-straight)<1e-6);
 assert.ok(nav.setPosition(start));const c=nav.position.clone();nav.move(500,{x:1,z:0});assert.ok(nav.position.distanceTo(c)<=WALK_CONFIG.speed*WALK_CONFIG.maxDelta+1e-6);assert.ok(nav.stats.substeps<=4);
 const before=nav.position.clone();for(const dt of [0,-1,NaN,Infinity])nav.move(dt,{x:1,z:1});nav.move(.05,{x:Infinity,z:1});assert.deepEqual(nav.position,before);
});
test('walk QA: upper-floor perimeter random exploration never falls, penetrates or leaves house',()=>{
 assert.ok(nav.setPosition({x:.5,y:3.13,z:0}));let seed=0x12456;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2**32;};
 for(let i=0;i<1500;i++){const angle=random()*Math.PI*2;nav.move(.05,{x:Math.cos(angle),z:Math.sin(angle)});const p=nav.position;assert.ok(p.x>=-4.78&&p.x<=4.78&&p.z>=-3.78&&p.z<=3.78);assert.ok(p.y>=3.1||(p.x< -3.95&&p.x> -4.97&&p.z> -1.4&&p.z<3.6),'lower height only allowed on real stairs');assert.equal(nav.capsuleBlocked(p.x,p.y,p.z),false);}
});

test('walk QA: low stair ceiling blocks a standing capsule; tall step cannot be climbed from below',()=>{
 assert.ok(nav.setPosition({x:-4.4,y:.014,z:-.6}));for(let i=0;i<150;i++)nav.move(1/60,{x:0,z:1});assert.ok(nav.position.z<.55);assert.ok(nav.position.y<.02);
 for(const z of [.6,.8,1])assert.equal(nav.setPosition({x:-4.4,y:.014,z}),false);
});
test('walk QA: authored bathroom door opens, admits entry/exit, blocks closed passage and restores exact hinge',()=>{
 nav.restoreDoor();const hinge=scene.getObjectByName('bathroom_door_hinge'),rest=hinge.quaternion.clone();
 assert.ok(nav.setPosition({x:3.78,y:.014,z:-1.25}));assert.equal(nav.doorAction().open,false);assert.equal(nav.toggleDoor().changed,true);
 moveTo(3.78,-2.7);assert.ok(nav.position.y>.04);assert.equal(nav.doorOpen,true);
 moveTo(3.78,-1.25);assert.equal(nav.toggleDoor().changed,true);assert.deepEqual(hinge.quaternion.toArray(),rest.toArray());
 for(let i=0;i<60;i++)nav.move(1/60,{x:0,z:-1});assert.ok(nav.position.z> -1.8);
 assert.equal(nav.toggleDoor().changed,true);moveTo(3.78,-2.05);const blocked=nav.toggleDoor();assert.equal(blocked.changed,false);assert.equal(blocked.blocked,true);assert.equal(nav.doorOpen,true);
 moveTo(3.78,-1.25);nav.restoreDoor();assert.deepEqual(hinge.quaternion.toArray(),rest.toArray());assert.equal(nav.doorOpen,false);
});
test('walk QA: all 88 piano keys are reachable by raycasts from a valid standing viewpoint',async()=>{
 const {PIANO_KEYS}=await import('../src/domain.js');nav.restoreDoor();assert.ok(nav.setPosition({x:2.05,y:.014,z:3.55}));
 const origin=nav.eyePosition(),ray=new Raycaster();let reachable=0;
 for(const definition of PIANO_KEYS){
  const key=scene.getObjectByName(definition.node);key.geometry.computeBoundingBox();const b=key.geometry.boundingBox;let found=false;
  for(const fraction of [.15,.35,.5,.7,.9]){
   const point=key.localToWorld(new Vector3((b.min.x+b.max.x)/2,b.max.y+1e-5,b.min.z+(b.max.z-b.min.z)*fraction));ray.set(origin,point.sub(origin).normalize());
   const hit=ray.intersectObject(scene,true).find(h=>{const m=Array.isArray(h.object.material)?h.object.material[h.face?.materialIndex||0]:h.object.material;return m&&m.opacity>.3&&!/glass/i.test(m.name)&&!h.object.userData.toyNap;});
   if(hit?.object===key){found=true;break;}
  }
  assert.ok(found,definition.node);reachable++;
 }
 assert.equal(reachable,88);
});
test('walk QA: real navigation and controller integrate after runtime transform freeze, including door and exact exit',async()=>{
 const {FirstPersonController,captureIsometricState}=await import('../src/first-person.js');
 const {IsometricRoom,configureControls}=await import('../src/camera.js');
 const {Gr:OrthographicCamera}=await import('../vendor/runtime-v11.js');
 const {freezeTransforms}=await import('../src/performance.js');
 const {qaDOM,dispatch,QAElement}=await import('./walk-qa-helpers.mjs');
 const camera=new OrthographicCamera(-12,12,10,-10,.1,100),controls={target:new Vector3(0,2.8,0),enabled:true,mouseButtons:{},touches:{},update(){},addEventListener(){}};
 configureControls(controls);const room=new IsometricRoom(scene,camera,controls);room.setView('lower');room.fit(1440,900);camera.zoom=2;room.panByPixels(24,35);freezeTransforms(scene);
 const dom=qaDOM(),doorButton=new QAElement('door'),before=captureIsometricState(room,camera,controls),controller=new FirstPersonController({root:scene,room,isometricCamera:camera,orbitControls:controls,...dom,doorButton,navigation:nav});controller.enter();let minEyeOffset=Infinity,maxEyeOffset=-Infinity;
 const go=(x,z)=>{
  dispatch(dom.windowTarget,'keydown',{code:'KeyW',key:'w'});
  for(let i=0;i<800;i++){
   const dx=x-nav.position.x,dz=z-nav.position.z,distance=Math.hypot(dx,dz);if(distance<.01){dispatch(dom.windowTarget,'keyup',{code:'KeyW',key:'w'});return;}
   controller.yaw=Math.atan2(-dx,-dz);controller.update(Math.min(1/60,distance/nav.config.speed));
   const offset=controller.camera.position.y-nav.position.y;minEyeOffset=Math.min(minEyeOffset,offset);maxEyeOffset=Math.max(maxEyeOffset,offset);assert.ok(Math.abs(offset-1.6)<.30,'stair eye smoothing remains bounded');assert.ok(offset<=nav.config.height-.06+1e-9,'rendered eye and near plane stay inside checked headroom');assert.equal(controller.camera.position.x,nav.position.x);assert.equal(controller.camera.position.z,nav.position.z);assert.equal(controller.camera.rotation.z,0);
  }
  assert.fail(`Integrated controller route blocked to ${x},${z} at ${nav.position.toArray()}`);
 };
 for(const[x,z]of [[.5,.2],[-3.5,.2],[-3.5,3.55],[-4.4,3.55],[-4.4,-1.8],[-3.45,-1.8],[-3.45,0],[4.2,0],[-3.45,0],[-3.45,-1.8],[-4.4,-1.8],[-4.4,3.55],[-3.5,3.55],[-3.5,.2],[.5,.2],[1.1,-1.2],[3.78,-1.2]])go(x,z);
 controller.refreshDoorAction();assert.equal(doorButton.hidden,false);assert.match(doorButton.textContent,/打开/);dispatch(dom.windowTarget,'keydown',{code:'KeyE',key:'e'});assert.equal(nav.doorOpen,true);go(3.78,-2.7);go(3.78,-1.2);controller.exit();
 assert.equal(nav.doorOpen,true,'latest door state persists after roaming');assert.deepEqual(captureIsometricState(room,camera,controls),before);controller.dispose();assert.ok(minEyeOffset>1.3);assert.ok(maxEyeOffset<=1.69+1e-9);
});

test('walk QA: fixed-view and walking door clicks share one persistent state across camera transitions',async()=>{
 const {FirstPersonController}=await import('../src/first-person.js');
 const {IsometricRoom,configureControls}=await import('../src/camera.js');
 const {Gr:OrthographicCamera}=await import('../vendor/runtime-v11.js');
 const {qaDOM,QAElement}=await import('./walk-qa-helpers.mjs');
 const camera=new OrthographicCamera(-12,12,10,-10,.1,100),controls={target:new Vector3(),enabled:true,mouseButtons:{},touches:{},update(){},addEventListener(){}};
 configureControls(controls);const room=new IsometricRoom(scene,camera,controls);room.setView('lower');room.fit(1440,900);
 const controller=new FirstPersonController({root:scene,room,isometricCamera:camera,orbitControls:controls,...qaDOM(),doorButton:new QAElement('door'),navigation:nav});
 nav.restoreDoor();assert.equal(controller.interactDoor({fromScene:true}).open,true);
 controller.enter();assert.equal(nav.doorOpen,true);assert.ok(nav.setPosition({x:3.78,y:.014,z:-1.2}));
 assert.equal(controller.interactDoor({fromScene:true}).open,false);controller.exit();assert.equal(nav.doorOpen,false);
 room.setView('upper');room.setView('lower');controller.enter();assert.ok(nav.setPosition({x:3.78,y:.014,z:-1.2}));
 assert.equal(controller.interactDoor({fromScene:true}).open,true);controller.exit();assert.equal(nav.doorOpen,true);
 controller.dispose();assert.equal(nav.doorOpen,true);nav.restoreDoor();
});

test('walk QA: opening sweep rejects occupied positions near hinge and door front without moving player',()=>{
 const hinge=scene.getObjectByName('bathroom_door_hinge');nav.restoreDoor();const rest=hinge.quaternion.toArray();
 for(const[x,z]of [[3.4,-2.4],[3.7,-2.5],[4,-2.3],[4.1,-2.25],[4.4,-2.3]]){
  nav.restoreDoor();assert.ok(nav.setPosition({x,y:.0425,z}));const before=nav.position.toArray();const result=nav.toggleDoor();assert.equal(result.blocked,true);assert.equal(result.changed,false);assert.equal(nav.doorOpen,false);assert.deepEqual(nav.position.toArray(),before);assert.deepEqual(hinge.quaternion.toArray(),rest);assert.equal(nav.capsuleBlocked(...before),false);
 }
 nav.restoreDoor();assert.ok(nav.setPosition({x:4.3,y:.014,z:-1.6}));assert.equal(nav.toggleDoor().changed,true);nav.restoreDoor();
});
test('walk QA: all walkable actual-asset triangles reject steep or downward-facing surfaces',()=>{
 const t=new Float32Array(9);let checked=0;
 for(let id=0;id<nav.bvh.count;id++)if(nav.bvh.walkable[id]){
  nav.bvh.readTriangle(id,t);const ax=t[3]-t[0],ay=t[4]-t[1],az=t[5]-t[2],bx=t[6]-t[0],by=t[7]-t[1],bz=t[8]-t[2],nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx;
  assert.ok(ny/Math.hypot(nx,ny,nz)>.70-1e-7);checked++;
 }
 assert.ok(checked>1000);
});
