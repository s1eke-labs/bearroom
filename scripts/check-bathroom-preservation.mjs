/** Exact v17 decoded-node and material preservation outside the finite reviewed bathroom edit. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {snapshotScene,stable,hashBytes} from './model-node-snapshot.mjs';
import {materialPayloadSnapshot} from './material-payload-snapshot.mjs';
import {loadSeatedBearCertificate,restoreSeatedBearModel,restoreSeatedBearSnapshots} from './seated-bear-contract.mjs';
import {ASSET_REVISION} from '../src/asset-revision.js';
export const bathroomScope=JSON.parse(fs.readFileSync(new URL('../recovery/bathroom-v19-scope.json',import.meta.url)));
const changed=new Set([...bathroomScope.oldRuntimeNodes,...bathroomScope.newRuntimeNodes]);
export const inBathroomEditScope=n=>changed.has(n.name);
export function checkBathroomPreservation(root,model){
 const baseline=JSON.parse(fs.readFileSync(new URL('../recovery/v17-model-node-snapshot.json',import.meta.url)));
 const materials=JSON.parse(fs.readFileSync(new URL('../recovery/v17-material-payload-snapshot.json',import.meta.url)));
 assert.equal(baseline.modelSha256,'b294de08c3b0cdf4a1db5c144e6a42d66d6ac5129fc65c872fcef4977a3e75a7');
 assert.equal(materials.modelSha256,baseline.modelSha256);
 const seated=loadSeatedBearCertificate();
 if(seated)restoreSeatedBearModel(model,seated,{expectedSourceSha256:ASSET_REVISION.bakeSourceSha256});
 const current=restoreSeatedBearSnapshots(snapshotScene(root),seated),oldProtected=baseline.nodes.filter(n=>!inBathroomEditScope(n)),newProtected=current.filter(n=>!inBathroomEditScope(n));
 assert.deepEqual(newProtected.map(n=>n.name),oldProtected.map(n=>n.name),'Unexpected removed/added node outside the exact bathroom scope');
 const checks=[];
 for(let i=0;i<oldProtected.length;i++){
  const old=oldProtected[i],now=structuredClone(newProtected[i]);
  if(now.name==='Scene'){
   assert.equal(old.userData.bathroomRevisionV19,undefined);
   assert.equal(now.userData.bathroomRevisionV19,bathroomScope.sceneMetadataValue);
   delete now.userData.bathroomRevisionV19;
  }
  assert.deepEqual(stable(now),stable(old),`${old.name}: nonbathroom geometry, attributes, transform, metadata or material binding changed`);
  const pose=seated?.nodes.find(node=>node.name===old.name);
  checks.push({name:old.name,sha256:hashBytes(JSON.stringify(stable(newProtected[i]))),unchanged:!pose||JSON.stringify(stable(pose.before))===JSON.stringify(stable(pose.after)),certifiedSeatedBear:!!pose});
 }
 const used=[...new Set(oldProtected.flatMap(n=>n.materials||[]))].sort(),currentMaterials=materialPayloadSnapshot(model);
 for(const name of used)assert.deepEqual(currentMaterials[name],materials.materials[name],`${name}: a protected material, texture, sampler or image payload changed`);
 const originalNames=new Set(baseline.nodes.map(n=>n.name)),currentNames=new Set(current.map(n=>n.name));
 for(const name of bathroomScope.oldRuntimeNodes)assert.ok(originalNames.has(name),`Invented old scope node: ${name}`);
 for(const name of bathroomScope.newRuntimeNodes)assert.ok(currentNames.has(name),`Missing reviewed new bathroom node: ${name}`);
 return{passed:true,scope:'Finite reviewed bathroom revision, with a separately exact before/after seated-bear certificate when present. Every protected node is compared against the unchanged historical snapshot after only certified bear fields are reversed. Materials, images and all other fields remain exact. New scene metadata is separately named and verified.',baselineModelSha256:baseline.modelSha256,modelSha256:hashBytes(model.bytes),sourceSha256:seated?.sourceSha256||bathroomScope.sourceSha256,bathroomSourceSha256:bathroomScope.sourceSha256,seatedBearRevision:seated?.modelSha256||null,protectedNodes:checks.length,protectedMaterials:used.length,allowedChangedOldNodes:bathroomScope.oldRuntimeNodes,allowedChangedNewNodes:bathroomScope.newRuntimeNodes,checks};
}
