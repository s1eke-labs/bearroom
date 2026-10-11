/** Actual v19 source/model semantics; CPU regression evidence, never GPU acceptance. */
import test from 'node:test';import assert from 'node:assert/strict';
import{loadSceneForCPU,loadModelData}from'./helpers.mjs';
import{checkBathroomPreservation,bathroomScope}from'../scripts/check-bathroom-preservation.mjs';
import{ASSET_REVISION}from'../src/asset-revision.js';
const model=loadModelData(),root=await loadSceneForCPU();
test('bathroom: all398 protected v17 runtime nodes and70 material/image payloads stay exact',()=>{
 const r=checkBathroomPreservation(root,model);assert.equal(r.protectedNodes,398);assert.equal(r.protectedMaterials,70);assert.equal(r.sourceSha256,ASSET_REVISION.bakeSourceSha256);assert.equal(r.modelSha256,ASSET_REVISION.modelSha256);
});
test('bathroom: finite reviewed scope retains original roots and new physically separate fixture meshes',()=>{
 assert.equal(bathroomScope.oldRuntimeNodes.length,14);assert.equal(bathroomScope.newRuntimeNodes.length,38);
 for(const n of ['bathroom_door_hinge','Architecture','Bathroom_architecture','F20_vanity','light_bath']){assert.ok(root.getObjectByName(n),n);assert.ok(!bathroomScope.oldRuntimeNodes.includes(n)&&!bathroomScope.newRuntimeNodes.includes(n),n+': root must stay protected');}
 for(const n of ['washbasin','toilet_bowl','toilet_seat','toilet_cistern','shower_tray','shower_glass','bath_mirror','vanity_top','vanity_cabinet'])assert.ok(root.getObjectByName(n)?.isMesh,n);
});
