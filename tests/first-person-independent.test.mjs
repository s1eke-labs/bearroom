import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {FirstPersonController,WALK_VIEW,captureIsometricState} from '../src/first-person.js';
import {IsometricRoom,configureControls} from '../src/camera.js';
import {CAMERA_PRESETS} from '../src/camera-presets.js';
import {L as Vector3,Gr as OrthographicCamera,Mh as Scene} from '../vendor/runtime-v11.js';
import {loadSceneForCPU} from './helpers.mjs';
import {qaDOM,dispatch,QAElement} from './walk-qa-helpers.mjs';
const sourceScene=await loadSceneForCPU();
class InputNavigation {
 constructor(){this.position=new Vector3();this.calls=[];this.spawnPoints={lower:{yaw:0},upper:{yaw:-Math.PI/2}};}
 reset(floor){this.floor=floor;this.position.set(0,floor==='upper'?3.13:.014,0);return this.position;}
 eyePosition(target){return target.copy(this.position).add(new Vector3(0,1.6,0));}
 move(dt,input){this.calls.push({dt,...input});this.position.x+=input.x*dt*1.5;this.position.z+=input.z*dt*1.5;return this.position;}
}
function fixture(view='overview'){
 const root=sourceScene.clone(true);root.getObjectByName('Exterior_city')?.removeFromParent();const scene=new Scene();scene.add(root);
 const isometricCamera=new OrthographicCamera(-12,12,10,-10,.1,100);
 const orbitControls={target:new Vector3(0,2.8,0),enabled:true,mouseButtons:{},touches:{},update(){},addEventListener(){},_panOffset:new Vector3(0,0,0),_sphericalDelta:{set(...args){this.value=args;}},_scale:1,_performCursorZoom:false,state:-1,_pointers:[]};
 configureControls(orbitControls);const room=new IsometricRoom(root,isometricCamera,orbitControls);room.setView(view);room.fit(1440,900);isometricCamera.zoom=view==='piano'?4:2;room.panByPixels(37,-28);
 const dom=qaDOM();dom.hint.innerHTML='Original hint';dom.status.textContent=view;const navigation=new InputNavigation();let taps=0;
 const controller=new FirstPersonController({root,scene,room,isometricCamera,orbitControls,...dom,navigation,onTap(){taps++;}});
 return{root,scene,room,isometricCamera,orbitControls,...dom,navigation,controller,get taps(){return taps;}};
}
function snapshot(f){return captureIsometricState(f.room,f.isometricCamera,f.orbitControls);}
function key(f,code,type='keydown'){dispatch(f.windowTarget,type,{code,key:code.startsWith('Key')?code.slice(3).toLowerCase():code});}
function pointer(target,type,id,x=400,y=300,extras={}){dispatch(target,type,{pointerId:id,clientX:x,clientY:y,button:0,pointerType:'touch',...extras});}
for(const view of ['overview','lower','upper','bear','piano'])test(`walk QA: ${view} repeated entry/exit restores exact camera, clipping, visibility, pan and zoom`,()=>{
 const f=fixture(view),visibility=[],materials=new Map();f.root.traverse(o=>{if(!o.isMesh)return;visibility.push([o,o.visible,o.userData.cutawayVisible]);for(const m of Array.isArray(o.material)?o.material:[o.material])materials.set(m,[m.clippingPlanes,m.clipShadows]);});
 const count=[];f.root.traverse(o=>count.push(o));
 for(let i=0;i<3;i++){
  const preset=CAMERA_PRESETS[i];f.room.selectPreset(preset.id,1000,{reducedMotion:true});f.room.panByPixels(37,-28);const before=snapshot(f);
  assert.ok(Math.abs(Math.atan2(f.room.direction().x,f.room.direction().z)-({classic:Math.PI/4,left:0,right:Math.PI/2}[preset.id]))<1e-12);
  f.orbitControls._panOffset.set(1,2,3);f.orbitControls._scale=1.5;
  f.controller.enter();assert.equal(f.controller.active,true);assert.equal(f.orbitControls.enabled,false);assert.equal(f.navigation.floor,view==='upper'?'upper':'lower');assert.equal(f.controller.getCamera().isPerspectiveCamera,true);assert.equal(f.controller.ceiling.visible,true);assert.equal(f.controller.ceiling.castShadow,false);assert.equal(f.controller.ceiling.parent,f.scene);
  f.root.traverse(o=>{if(o.isMesh&&!/^Exterior_city|^street_/.test(o.name)){assert.equal(o.userData.cutawayVisible,true);if(o.userData.plushDetailVisible!==false)assert.equal(o.visible,true);}});
  for(const m of materials.keys())assert.deepEqual(m.clippingPlanes,[]);
  key(f,'KeyW');f.controller.update(.03);pointer(f.canvas,'pointerdown',1);pointer(f.canvas,'pointermove',1,510,420);f.controller.exit();
  assert.equal(f.controller.ceiling.visible,false);assert.deepEqual(snapshot(f),before);assert.equal(f.room.selectedPreset,preset.id);assert.equal(f.controller.getCamera(),f.isometricCamera);assert.equal(f.orbitControls._panOffset.length(),0);assert.equal(f.orbitControls._scale,1);
  for(const[o,v,c]of visibility){assert.equal(o.visible,v);assert.equal(o.userData.cutawayVisible,c);}
  for(const[m,[planes,shadow]]of materials){assert.equal(m.clippingPlanes,planes);assert.equal(m.clipShadows,shadow);}
  assert.equal(f.controller.keys.size,0);assert.equal(f.controller.lookPointers.size,0);assert.equal(f.hint.innerHTML,'Original hint');assert.equal(f.status.textContent,view);
 }
 const after=[];f.root.traverse(o=>after.push(o));assert.deepEqual(after,count,'No avatar or new authored-root mesh may be added');assert.equal(f.scene.children.length,2);f.controller.dispose();assert.equal(f.scene.children.length,1);
});
test('walk QA: normalized keyboard diagonals, yaw-relative motion, 50ms cap and finite dt',()=>{
 const f=fixture();f.controller.enter();key(f,'KeyW');f.controller.update(.016);const straight=f.navigation.calls.at(-1);key(f,'KeyD');f.controller.update(.016);const diagonal=f.navigation.calls.at(-1);assert.ok(Math.abs(Math.hypot(straight.x,straight.z)-Math.hypot(diagonal.x,diagonal.z))<1e-12);
 f.controller.update(40);assert.equal(f.navigation.calls.at(-1).dt,.05);f.controller.update(NaN);assert.equal(f.navigation.calls.at(-1).dt,0);
 f.controller.clearInput();dispatch(f.windowTarget,'keydown',{key:'w'});f.controller.yaw=Math.PI/2;f.controller.update(.01);assert.ok(f.navigation.calls.at(-1).x<-.999);assert.ok(Math.abs(f.navigation.calls.at(-1).z)<1e-12);f.controller.dispose();
});
test('walk QA: dual-touch joystick movement and look are independent; pointer cancellation and lost capture stop drift',()=>{
 const f=fixture();f.controller.enter();pointer(f.joystick,'pointerdown',11,80,610);pointer(f.canvas,'pointerdown',12,500,400);pointer(f.canvas,'pointermove',12,620,10000);assert.ok(f.controller.stick.z<-.99);assert.equal(f.controller.pitch,-WALK_VIEW.pitchLimit);assert.notEqual(f.controller.yaw,0);f.controller.update(.016);assert.ok(Math.hypot(f.navigation.calls.at(-1).x,f.navigation.calls.at(-1).z)>.99);
 pointer(f.windowTarget,'pointercancel',11);assert.deepEqual(f.controller.stick,{x:0,z:0});f.controller.update(.016);assert.equal(Math.hypot(f.navigation.calls.at(-1).x,f.navigation.calls.at(-1).z),0);
 pointer(f.windowTarget,'pointercancel',12);assert.equal(f.taps,0);assert.equal(f.controller.lookPointers.size,0);
 pointer(f.joystick,'pointerdown',13,110,660);pointer(f.joystick,'lostpointercapture',13);assert.deepEqual(f.controller.stick,{x:0,z:0});assert.equal(f.controller.joystickPointerId,null);f.controller.dispose();
});
test('walk QA: blur, visibility, modal help and pagehide clear held inputs',()=>{
 const f=fixture();f.controller.enter();for(const event of ['blur','pagehide']){key(f,'KeyW');pointer(f.joystick,'pointerdown',5,80,610);dispatch(f.windowTarget,event);assert.equal(f.controller.hasMovement(),false);assert.equal(f.controller.joystickPointerId,null);}
 key(f,'KeyW');f.documentTarget.visibilityState='hidden';dispatch(f.documentTarget,'visibilitychange');f.controller.update(.016);assert.equal(f.controller.hasMovement(),false);f.documentTarget.visibilityState='visible';
 key(f,'KeyW');f.documentTarget.querySelector=()=>({open:true});f.controller.update(.016);assert.equal(f.controller.hasMovement(),false);key(f,'KeyW');assert.equal(f.controller.hasMovement(),false);f.controller.dispose();
});
test('walk QA: walking, dragging, multitouch and cancelled gestures never play piano notes; stationary taps do',()=>{
 const f=fixture();f.controller.enter();pointer(f.canvas,'pointerdown',1);pointer(f.windowTarget,'pointerup',1);assert.equal(f.taps,1);
 key(f,'KeyW');pointer(f.canvas,'pointerdown',2);pointer(f.windowTarget,'pointerup',2);key(f,'KeyW','keyup');assert.equal(f.taps,1);
 pointer(f.canvas,'pointerdown',3);key(f,'KeyW');key(f,'KeyW','keyup');pointer(f.windowTarget,'pointerup',3);assert.equal(f.taps,1);
 pointer(f.canvas,'pointerdown',4);pointer(f.canvas,'pointermove',4,450,400);pointer(f.windowTarget,'pointerup',4,450,400);assert.equal(f.taps,1);
 pointer(f.canvas,'pointerdown',5);pointer(f.canvas,'pointerdown',6);pointer(f.windowTarget,'pointerup',5);pointer(f.windowTarget,'pointerup',6);assert.equal(f.taps,1);
 pointer(f.canvas,'pointerdown',7);pointer(f.windowTarget,'pointercancel',7);assert.equal(f.taps,1);f.controller.dispose();
});
for(const preset of ['left','right'])test(`walk QA: resize retains ${preset} axial floor preset and zoom, sets perspective aspect, and Escape exits`,()=>{
 const f=fixture('piano');f.room.selectPreset(preset,1000,{reducedMotion:true});const direction=f.room.direction(),zoom=f.isometricCamera.zoom;f.controller.enter();f.controller.resize(390,844);assert.equal(f.controller.camera.aspect,390/844);key(f,'Escape');assert.equal(f.controller.active,false);assert.equal(f.room.view,'piano');assert.equal(f.isometricCamera.zoom,zoom);assert.equal(f.room.viewport.width,390);assert.equal(f.room.viewport.height,844);assert.equal(f.orbitControls.enableRotate,false);assert.equal(f.room.selectedPreset,preset);assert.ok(f.room.direction().distanceTo(direction)<1e-12);assert.ok(Math.abs((f.isometricCamera.right-f.isometricCamera.left)/(f.isometricCamera.top-f.isometricCamera.bottom)-390/844)<1e-12);f.controller.dispose();
});
test('walk QA: day/night, preset and piano integration retain explicit guarded source hooks',()=>{
 const main=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8'),html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),css=fs.readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
 assert.match(main,/function gv\(i\) \{\s*if \(!cs\) return;\s*walk\?\.exit\(\)/);assert.match(main,/Ot\.render\(jt, walk\?\.getCamera\(\) \|\| Rt\)/);assert.match(main,/function playWalkPiano[\s\S]*jc\.setFromCamera\(Kc, walk\.getCamera\(\)\)/);assert.match(main,/Ge\("#help"\)\.onclick = \(\) => \{ walk\?\.clearInput\(\)/);assert.match(html,/id="walk-toggle"[^>]*aria-pressed="false"[^>]*disabled/);assert.match(html,/id="walk-instructions"/);assert.match(css,/safe-area-inset-bottom/);assert.match(css,/\.is-walking \.zoom-control\{display:none\}/);
});
