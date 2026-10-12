/** Check unaffected v16 scene nodes against the pre-edit decoded baseline. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {snapshotScene,stable,hashBytes} from './model-node-snapshot.mjs';
import {bearPlacement,rockerPlacement,expectedProtectedWorld} from './organic-bear-placement.mjs';
import {inBathroomEditScope,bathroomScope} from './check-bathroom-preservation.mjs';
import {restoreSeatedBearSnapshots} from './seated-bear-contract.mjs';
export function inOrganicEditScope(n){
 // Only mesh payloads for the three rebuilt seats, their seams/cloth contact,
 // and the combined old botanical mesh. Their control/root nodes stay exact.
 if(n.name==='Decor__wood_honey'||n.parent==='Decor__wood_honey')return true; // Exact material-only triangle multiset separately checked.
 if(n.name.startsWith('chair_v17_') || n.name.startsWith('rocker_v17_'))return true;
 if(n.type!=='Mesh')return false;
 return (n.parent==='F01_sofa'&&n.name.startsWith('F01_sofa__fabric_')) || n.name==='anim_sofa_edge' ||
 (n.parent==='anim_chair_swivel'&&/^anim_chair_swivel__(?:fabric_|ceramic_ivory$|polymer_warm_abs$)/.test(n.name)) ||
 (n.parent==='anim_rocker'&&/^anim_rocker__fabric_/.test(n.name)) ||
 ['rocker_pillow','rocker_pillow_v13_tailored_seam'].includes(n.name) ||
 n.name==='Decor__botanical_sage' || n.userData?.organicPlantV17===true;
}
export function checkOrganicPreservation(root){
 const baseline=JSON.parse(fs.readFileSync(new URL('../recovery/v16-model-node-snapshot.json',import.meta.url)));
 assert.equal(baseline.modelSha256,'f807437d38d9d30ddb9fff68ef8be6a526f3dafe7fd5b9a3ec750e7733f520ce');
 const current=restoreSeatedBearSnapshots(snapshotScene(root)),oldProtected=baseline.nodes.filter(n=>!inOrganicEditScope(n)&&!inBathroomEditScope(n)),newProtected=current.filter(n=>!inOrganicEditScope(n)&&!inBathroomEditScope(n));
 assert.deepEqual(newProtected.map(n=>n.name),oldProtected.map(n=>n.name),'Unexpected removed/added node outside organic scope');
 const checks=[];
 for(let i=0;i<oldProtected.length;i++){
  const old=oldProtected[i],now=structuredClone(newProtected[i]);
  if(now.name==='Scene')for(const key of ['plantV17OriginalBounds','plantV17Report','organicRevisionV17','bathroomRevisionV19']){
   assert.equal(old.userData[key],undefined,'New authoring metadata must not overwrite baseline scene data');
   delete now.userData[key];
  }
  const expectedMatrix=expectedProtectedWorld(now.name,old.matrixWorld);
  if(expectedMatrix!==old.matrixWorld){
   now.matrixWorld.forEach((v,k)=>assert.ok(Math.abs(v-expectedMatrix[k])<1e-6,`${now.name}: world transform is not explained by the approved finite rigid-placement delta`));
   now.matrixWorld=old.matrixWorld;
  }
  assert.deepEqual(stable(now),stable(old),`${old.name}: v16 geometry, transform, metadata or material binding changed outside organic scope`);
  checks.push({name:old.name,sha256:hashBytes(JSON.stringify(stable(newProtected[i]))),rigidlyMoved:expectedMatrix!==old.matrixWorld,unchangedLocalGeometryAndMaterials:true});
 }
 return {scope:'Frozen v16 node geometry and attributes, transforms, metadata and material bindings; only enumerated seating/cloth-contact/botanical mesh changes and the separately geometry-checked soil carrier material split excluded. All furniture controls, architecture, bear geometry/materials, PC hardware, pot meshes, flowers, piano and navigation geometry remain checked. A separately exact seated-bear before/after certificate, when present, is verified before reversing its finite fields to historical snapshots. If supplied, only the explicitly reported rigid main-bear and22mm rocker-root world transforms are allowed.',baselineModelSha256:baseline.modelSha256,rigidBearPlacement:bearPlacement,rigidRockerPlacement:rockerPlacement,explicitLaterRevisionExcludedOriginalNodes:baseline.nodes.filter(n=>!inOrganicEditScope(n)&&inBathroomEditScope(n)).map(n=>n.name),laterRevisionScope:bathroomScope.scope,protectedNodes:checks.length,unchangedNodes:checks.filter(n=>!n.rigidlyMoved).length,rigidlyMovedNodes:checks.filter(n=>n.rigidlyMoved).map(n=>n.name),excludedOriginalNodes:baseline.nodes.filter(inOrganicEditScope).map(n=>n.name),excludedNewNodes:current.filter(inOrganicEditScope).map(n=>n.name),checks};
}
