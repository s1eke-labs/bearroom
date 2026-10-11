import test from'node:test';import assert from'node:assert/strict';
import{CurrentPlushAppearance,SEWN_BEAR_CONFIG}from'../src/plush-current.js';
import{loadSceneForCPU}from'./helpers.mjs';import{L as Vector3,Gr as Camera}from'../vendor/runtime-v11.js';import{IsometricRoom,configureControls}from'../src/camera.js';
const scene=await loadSceneForCPU();
function baselineFixture(){
 const root=scene.clone(true),remove=[];
 root.traverse(mesh=>{
  if(!mesh.isMesh)return;
  if(mesh.userData.toyNap){remove.push(mesh);return;}
  const clone=m=>{const copy=m.clone();if(copy.name.startsWith('fabric_bear_sewn_'))copy.name='fixture_original_'+copy.name;return copy;};
  mesh.material=Array.isArray(mesh.material)?mesh.material.map(clone):clone(mesh.material);
 });
 remove.forEach(mesh=>mesh.removeFromParent());return root;
}
test('baseline model stays visually unchanged when no sewn material is present',()=>{const p=new CurrentPlushAppearance(baselineFixture(),new Vector3(-1,2,-1).normalize());assert.equal(p.diagnostics().sewnMaterials,0);assert.equal(p.diagnostics().bodies,2)});
test('sewn fabric gets the scoped velvet parameters without losing authored normals or vertex colors',()=>{
 const root=baselineFixture();const torso=root.getObjectByName('Bear_reference_plush__fabric_bear');torso.material=torso.material.clone();torso.material.name='fabric_bear_sewn_plush';torso.material.normalScale.set(.38,.38);torso.material.vertexColors=true;
 const primary=root.getObjectByName('Bear_reference_plush');const head=torso.clone();head.name='bear_sewn_head';head.material=torso.material.clone();head.material.name='fabric_bear_sewn_head';primary.add(head);
 const nap=torso.clone();nap.name='bear_minky_surface_nap';nap.material=torso.material.clone();nap.material.name='fabric_bear_short_nap';const napMaterial=nap.material;primary.add(nap);
 const appearance=new CurrentPlushAppearance(root,new Vector3(-1,2,-1).normalize());
 for(const mesh of[torso,head]){assert.equal(mesh.material.sheen,.42);assert.equal(mesh.material.sheenRoughness,.96);assert.equal(mesh.material.specularIntensity,.18);assert.deepEqual(mesh.material.normalScale.toArray(),[.38,.38]);assert.equal(mesh.material.vertexColors,true);assert.equal(mesh.material.userData.bearVelvet,true);assert.ok(mesh.material.customProgramCacheKey().includes(SEWN_BEAR_CONFIG.revision))}
 assert.equal(nap.material,napMaterial);assert.equal(nap.visible,true);assert.equal(appearance.diagnostics().sewnMaterials,2);
 const desk=root.getObjectByName('Bear_desk_plush__fabric_bear');assert.equal(desk.material.sheen,.75);
});

test('authored toy nap does not shadow or raycast and follows floor cutaway without legacy normal patching',()=>{
 const root=baselineFixture(),primary=root.getObjectByName('Bear_reference_plush'),torso=root.getObjectByName('Bear_reference_plush__fabric_bear');
 const nap=torso.clone();nap.name='bear_minky_surface_nap';nap.userData={toyNap:'short pile'};nap.material=torso.material.clone();nap.material.name='fabric_bear_short_nap';nap.castShadow=true;const cacheBefore=nap.material.customProgramCacheKey();primary.add(nap);
 const camera=new Camera(-12,12,10,-10,.1,100),controls={target:new Vector3(),mouseButtons:{},touches:{},update(){},addEventListener(){}};configureControls(controls);const room=new IsometricRoom(root,camera,controls),appearance=new CurrentPlushAppearance(root,room.frame.up);
 assert.equal(nap.castShadow,false);const hits=[];nap.raycast({},hits);assert.equal(hits.length,0);assert.equal(nap.material.customProgramCacheKey(),cacheBefore);
 for(const view of['overview','bear','upper','lower','piano','overview']){room.setView(view);room.fit(390,844);appearance.update(camera,844,view);assert.equal(nap.visible,view!=='upper',view);assert.equal(nap.userData.plushDetailVisible,true)}
 assert.equal(appearance.diagnostics().authoredNapMeshes,1);assert.equal(appearance.diagnostics().napShadowCasters,0);
});
