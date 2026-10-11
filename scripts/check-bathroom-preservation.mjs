/** Exact v17 decoded-node and material preservation outside the finite reviewed bathroom edit. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {snapshotScene,stable,hashBytes} from './model-node-snapshot.mjs';
import {materialPayloadSnapshot} from './material-payload-snapshot.mjs';
export const bathroomScope=JSON.parse(fs.readFileSync(new URL('../recovery/bathroom-v19-scope.json',import.meta.url)));
const changed=new Set([...bathroomScope.oldRuntimeNodes,...bathroomScope.newRuntimeNodes]);
export const inBathroomEditScope=n=>changed.has(n.name);
export function checkBathroomPreservation(root,model){
 const baseline=JSON.parse(fs.readFileSync(new URL('../recovery/v17-model-node-snapshot.json',import.meta.url)));
 const materials=JSON.parse(fs.readFileSync(new URL('../recovery/v17-material-payload-snapshot.json',import.meta.url)));
 assert.equal(baseline.modelSha256,'b294de08c3b0cdf4a1db5c144e6a42d66d6ac5129fc65c872fcef4977a3e75a7');
 assert.equal(materials.modelSha256,baseline.modelSha256);
 const current=snapshotScene(root),oldProtected=baseline.nodes.filter(n=>!inBathroomEditScope(n)),newProtected=current.filter(n=>!inBathroomEditScope(n));
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
  checks.push({name:old.name,sha256:hashBytes(JSON.stringify(stable(newProtected[i]))),unchanged:true});
 }
 const used=[...new Set(oldProtected.flatMap(n=>n.materials||[]))].sort(),currentMaterials=materialPayloadSnapshot(model);
 for(const name of used)assert.deepEqual(currentMaterials[name],materials.materials[name],`${name}: a protected material, texture, sampler or image payload changed`);
 const originalNames=new Set(baseline.nodes.map(n=>n.name)),currentNames=new Set(current.map(n=>n.name));
 for(const name of bathroomScope.oldRuntimeNodes)assert.ok(originalNames.has(name),`Invented old scope node: ${name}`);
 for(const name of bathroomScope.newRuntimeNodes)assert.ok(currentNames.has(name),`Missing reviewed new bathroom node: ${name}`);
 return{passed:true,scope:'Finite reviewed bathroom-only source/model revision. Every other v17 decoded node, attribute byte, matrix, control, metadata and material payload is exact. New scene metadata is separately named and verified.',baselineModelSha256:baseline.modelSha256,modelSha256:hashBytes(model.bytes),sourceSha256:bathroomScope.sourceSha256,protectedNodes:checks.length,protectedMaterials:used.length,allowedChangedOldNodes:bathroomScope.oldRuntimeNodes,allowedChangedNewNodes:bathroomScope.newRuntimeNodes,checks};
}
