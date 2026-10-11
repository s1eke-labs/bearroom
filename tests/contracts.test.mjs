import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';
import{PIANO_KEYS,FURNITURE,isTap,slideState}from'../src/domain.js';
import{IsometricRoom,configureControls,isWorldVisible,isClipped}from'../src/camera.js';
import{LIGHTS,lightingState}from'../src/lighting.js';
import{PlushAppearance,VELVET_CONFIG,plushDetailVisible}from'../src/plush.js';
import{FrameTimeBuffer,prepareCloth,updateCloth}from'../src/performance.js';
import{validateIrradiance,packIrradiance,applyBakedGI,patchBakedShader}from'../src/baked-gi.js';
import{ASSET_REVISION}from'../src/asset-revision.js';
import{L as Vector3,Gr as OrthographicCamera,Ee as Vector2,Lf as Raycaster}from'../vendor/runtime-v11.js';
import{assetDirectory,checkAssetContract}from'../scripts/asset-contract.mjs';
import{loadSceneForCPU,loadModelData}from'./helpers.mjs';
const gi=JSON.parse(fs.readFileSync(assetDirectory()+'/baked-gi/irradiance.json'));
const scene=await loadSceneForCPU();
function viewFixture(){const root=scene.clone(true);root.getObjectByName('Exterior_city')?.removeFromParent();const camera=new OrthographicCamera(-12,12,10,-10,.1,100);const controls={target:new Vector3(0,2.8,0),mouseButtons:{},touches:{},update(){return false},addEventListener(){}};configureControls(controls);const room=new IsometricRoom(root,camera,controls);return{root,camera,controls,room}}
test('asset contract: 23 furniture, 12 animated categories, 88 keys, texture and GI hashes',()=>{const r=checkAssetContract();assert.equal(r.furniture,23);assert.equal(r.animatedFurniture,12);assert.equal(r.pianoKeys,88);assert.equal(r.uniqueTextures,13);assert.equal(r.giProbes,160)});
test('88 MIDI notes A0–C8 comprise 52 white and 36 black keys',()=>{assert.equal(PIANO_KEYS.length,88);assert.equal(PIANO_KEYS[0].name,'A0');assert.equal(PIANO_KEYS.at(-1).name,'C8');assert.equal(PIANO_KEYS.filter(k=>k.black).length,36);assert.equal(PIANO_KEYS.find(k=>k.midi===69).frequency,440);assert.equal(FURNITURE.filter(f=>f.animated).length,12)});
test('fixed-isometric gesture settings disable rotate and enable bounded pan',()=>{const{controls}=viewFixture();assert.equal(controls.enableRotate,false);assert.equal(controls.enablePan,true);assert.equal(controls.mouseButtons.LEFT,2);assert.equal(controls.touches.ONE,1);assert.equal(controls.touches.TWO,2);assert.equal(controls.minAzimuthAngle,Math.PI/4);assert.equal(controls.maxPolarAngle,Math.acos(1/Math.sqrt(3)));assert.equal(controls.zoomToCursor,false)});
for(const view of['overview','lower','upper','bear','piano'])test(`${view}: real model fit, zoom cap, extreme pan constraints and fixed camera direction`,()=>{
 const{room,root,camera,controls}=viewFixture();room.setView(view);room.fit(390,844);assert.equal(controls.maxZoom,view==='piano'?16:8);camera.zoom=999;room.constrain();assert.equal(camera.zoom,controls.maxZoom);
 for(const[x,y]of[[1e6,1e6],[-1e6,-1e6],[1e6,-1e6],[-1e6,1e6]]){room.panByPixels(x,y);const lim=room.panLimits(),tx=controls.target.dot(room.frame.right),ty=controls.target.dot(room.frame.up);assert.ok(tx>=lim.minX-1e-8&&tx<=lim.maxX+1e-8);assert.ok(ty>=lim.minY-1e-8&&ty<=lim.maxY+1e-8);const direction=camera.position.clone().sub(controls.target).normalize();assert.ok(direction.distanceTo(new Vector3(1,1,1).normalize())<1e-9)}
 room.reset(844,390);assert.equal(camera.zoom,1);assert.equal(room.view,view);assert.ok(!room.bounds().isEmpty());
 if(['lower','bear','piano'].includes(view))for(const{object,bounds}of room.meshes)if(bounds.min.y>=2.78)assert.equal(object.visible,false);
 if(view==='upper')for(const{object,bounds}of room.meshes)if(bounds.max.y<2.78)assert.equal(object.visible,false);
 assert.ok(root.getObjectByName('cutaway_bathroom_rear_privacy'));
});
test('invalid view is ignored and resize keeps active view/zoom',()=>{const{room,camera}=viewFixture();room.setView('piano');room.fit(390,844);camera.zoom=3;room.setView('rotate');room.fit(844,390,{reset:false});assert.equal(room.view,'piano');assert.equal(camera.zoom,3)});
test('tap thresholds reject drags, long presses, cancelled and multitouch gestures',()=>{assert.ok(isTap({distance:7,duration:649}));for(const g of[{distance:7.1,duration:100},{distance:0,duration:650},{distance:0,duration:100,multi:true},{distance:0,duration:100,cancelled:true}])assert.ok(!isTap(g));assert.ok(!isTap(null))});
test('screen slideshow keeps authored hold duration and one-second crossfade',()=>{assert.deepEqual(slideState(16.5,6,16),{index:0,next:1,mix:.5});assert.deepEqual(slideState(17,6,16),{index:1,next:2,mix:0})});
test('light setup retains 10 authored lamp sources and GI-aware day/night intensity',()=>{assert.equal(Object.keys(LIGHTS).length,10);assert.equal(lightingState(0,{bakedGI:true}).fill,0);assert.equal(lightingState(1,{bakedGI:true}).fill,0);assert.equal(lightingState(1).sun,2.7);assert.equal(lightingState(0).lamps,1);assert.ok(Math.abs(lightingState(1).lamps-.12)<1e-9)});
test('velvet stays default on two bears while retained fibers remain hidden',()=>{const{root,room,camera}=viewFixture();room.fit(390,844);const plush=new PlushAppearance(root,room.frame.up);plush.update(camera,844,'bear');const d=plush.diagnostics();assert.equal(d.mode,'velvet');assert.equal(d.bodies,2);assert.equal(d.visibleFiberMeshes,0);assert.ok(d.retainedFibers>=0);assert.equal(VELVET_CONFIG.sheen,.75);assert.equal(plushDetailVisible(false,150),false);assert.equal(plushDetailVisible(true,150),true)});
test('GI validates dimensions, regions and finite radiance values',()=>{assert.equal(validateIrradiance(gi),gi);const bad=structuredClone(gi);bad.states.day[0]=-1;assert.throws(()=>validateIrradiance(bad),/Invalid day/);bad.states.day[0]=NaN;assert.throws(()=>validateIrradiance(bad),/Invalid day/);assert.throws(()=>validateIrradiance({...gi,dimensions:[5,2,3]}),/Unsupported/)});
test('GI packs day/night regional six-face volume into 5×2×192 RGBA texture',()=>{const p=packIrradiance(gi);assert.deepEqual([p.width,p.height,p.depth],[5,2,192]);assert.equal(p.array.length,5*2*192*4);assert.ok(Math.abs(p.array[0]-(gi.states.night[0]+(gi.sky?.states.night[0]||0)))<1e-5);assert.equal(p.array[3],1)});
test('GI refuses mismatched bake source and applies matched source without GPU',async()=>{await assert.rejects(()=>applyBakedGI(scene,{data:{...gi,sourceSha256:'0'.repeat(64)}}),/source revision/);const baked=await applyBakedGI(scene.clone(true),{data:gi});assert.equal(baked.diagnostics().sourceSha256,ASSET_REVISION.bakeSourceSha256);assert.equal(baked.diagnostics().active,true);baked.setDay(0);assert.equal(baked.diagnostics().day,0);baked.setDay(2);assert.equal(baked.diagnostics().day,1);baked.dispose()});
test('GI shader keeps bathroom/slab visibility and velvet indirect sheen',()=>{const shader={uniforms:{},fragmentShader:'#include <lights_fragment_begin>\n#include <lights_fragment_maps>'};patchBakedShader(shader,{}, {indirectSheen:true});for(const text of['giBathVisibility','giSlabVisibility','sheenSpecularIndirect','IBLSheenBRDF','3.141592653589793'])assert.ok(shader.fragmentShader.includes(text));assert.ok(shader.fragmentShader.includes('Diffuse ambient replaced by scene-bounced irradiance'))});
test('cloth updates only weighted edge vertices and restores rest values at zero',()=>{const positions=new Float32Array([0,1,0,0,1,1,0,1,.5]);const c=prepareCloth(positions,0,1);const old=positions.slice();updateCloth(positions,c,.2);assert.equal(positions[1],1);assert.ok(positions[4]>1);updateCloth(positions,c,0);assert.deepEqual(positions,old)});
test('frame-time history is bounded and chronological',()=>{const ring=new FrameTimeBuffer(3);[1,2,3,4,5].forEach(n=>ring.push(n));assert.equal(ring.length,3);assert.deepEqual([...ring],[3,4,5])});
test('piano keys and animated transforms retain runtime extras and parenting',()=>{const{json}=loadModelData();for(const n of json.nodes.filter(n=>/^piano_key_\d{3}$/.test(n.name||'')))assert.ok(n.mesh!==undefined);assert.ok(json.nodes.some(n=>n.name==='Bear_reference_plush__fabric_bear'));assert.ok(json.nodes.some(n=>n.name==='Bear_desk_plush__fabric_bear'));assert.ok(json.nodes.some(n=>n.name==='anim_chair_swivel'))});

test('all88keys have a reachable raycast target from the fixed piano view',()=>{
 const{room,root,camera}=viewFixture();room.setView('piano');room.fit(1440,900);const ray=new Raycaster();
 for(const definition of PIANO_KEYS){
  const key=root.getObjectByName(definition.node);key.geometry.computeBoundingBox();const bounds=key.geometry.boundingBox;let reachable=false;
  for(const fraction of[.15,.35,.5,.7,.9]){
   const sample=key.localToWorld(new Vector3((bounds.min.x+bounds.max.x)/2,bounds.max.y+1e-5,bounds.min.z+(bounds.max.z-bounds.min.z)*fraction)).project(camera);ray.setFromCamera(new Vector2(sample.x,sample.y),camera);
   const hit=ray.intersectObject(root,true).filter(n=>{const mat=Array.isArray(n.object.material)?n.object.material[n.face?.materialIndex||0]:n.object.material;return isWorldVisible(n.object)&&mat&&!isClipped(n.point,mat)&&mat.opacity>.3&&!/glass/i.test(mat.name)})[0];
   if(hit?.object===key){reachable=true;break}
  }
  assert.ok(reachable,`${definition.node} is blocked from the fixed piano camera`);
 }
});
