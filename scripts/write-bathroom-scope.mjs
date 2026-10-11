/** Derive a finite reviewed scope from the source builder report, never from arbitrary differences. */
import fs from 'node:fs';import assert from 'node:assert/strict';
import{loadSceneForCPU,loadModelData}from'../tests/helpers.mjs';import{snapshotScene}from'./model-node-snapshot.mjs';import{sha256}from'./asset-contract.mjs';
const[modelPath,reportPath]=process.argv.slice(2);if(!modelPath||!reportPath)throw Error('Usage: write-bathroom-scope.mjs FINAL.glb[.gz] FINAL_BUILD_REPORT.json');
const report=JSON.parse(fs.readFileSync(reportPath)),baseline=JSON.parse(fs.readFileSync(new URL('../recovery/v17-model-node-snapshot.json',import.meta.url)));
assert.equal(report.sourceSha256, '822b7ad9bda89889530dae32efaf5ecde831c991f6994bed97b7a8c02227afc4');
assert.equal(report.allNonBathroomExactUnchanged,true);assert.equal(report.allExistingMaterialsExactUnchanged,true);
const clean=n=>n.replace(/\s/g,'_').replace(/[\[\].:/]/g,'');
const sourceAllowed=new Set([...report.allowedOriginalObjects,...report.created,...report.replaced].map(clean));
const oldRuntimeNodes=baseline.nodes.filter(n=>sourceAllowed.has(n.name)||(n.parent==='F20_vanity'&&n.type==='Mesh')).map(n=>n.name);
const model=loadModelData(modelPath),current=snapshotScene(await loadSceneForCPU(modelPath));
const newRuntimeNodes=current.filter(n=>sourceAllowed.has(n.name)||(n.parent==='F20_vanity'&&n.type==='Mesh')).map(n=>n.name);
const originalSet=new Set(baseline.nodes.map(n=>n.name));for(const n of current)if(!originalSet.has(n.name))assert.ok(newRuntimeNodes.includes(n.name),'New node not explained by reviewed builder: '+n.name);
for(const critical of['Scene','Architecture','Bathroom_architecture','bathroom_door_hinge','F20_vanity','light_bath'])assert.ok(!oldRuntimeNodes.includes(critical)&&!newRuntimeNodes.includes(critical),'Control/root/lighting may not be excluded: '+critical);
const scope={scope:'Only source-builder-enumerated bathroom object changes and their finite exported material batches. Roots, light, door pivot, other room geometry and all nonbathroom data stay protected.',sourceSha256:report.outputSha256,modelSha256:sha256(model.bytes),sourceBuildReportSha256:sha256(fs.readFileSync(reportPath)),sourceAllowedOriginalObjects:report.allowedOriginalObjects,oldRuntimeNodes,newRuntimeNodes,sceneMetadataValue:'True-thickness manufactured fixtures and opaque non-overlapping privacy walls'};
fs.writeFileSync(new URL('../recovery/bathroom-v19-scope.json',import.meta.url),JSON.stringify(scope,null,2)+'\n');console.log(JSON.stringify(scope,null,2));
