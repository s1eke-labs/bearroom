/** Build the exact, reversible pose certificate from two complete models. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parseGLB,sha256} from '../../scripts/asset-contract.mjs';
import {snapshotScene} from '../../scripts/model-node-snapshot.mjs';
import {createSeatedBearCertificate} from '../../scripts/seated-bear-contract.mjs';
import {loadSceneForCPU} from '../../tests/helpers.mjs';
const [beforePath,afterPath,sourcePath,outputPath]=process.argv.slice(2);
assert.ok(beforePath&&afterPath&&sourcePath&&outputPath,'Usage: node certify_runtime.mjs BEFORE AFTER SOURCE.blend CERTIFICATE.json');
const before=parseGLB(fs.readFileSync(beforePath)),after=parseGLB(fs.readFileSync(afterPath)),sourceBytes=fs.readFileSync(sourcePath);
const certificate=createSeatedBearCertificate(before,after,{beforeNodes:snapshotScene(await loadSceneForCPU(beforePath)),afterNodes:snapshotScene(await loadSceneForCPU(afterPath)),sourceSha256:sha256(sourceBytes),sourceBytes});
fs.writeFileSync(outputPath,JSON.stringify(certificate,null,2)+'\n');
console.log(JSON.stringify({baseline:certificate.baselineModelSha256,model:certificate.modelSha256,source:certificate.sourceSha256,changedViews:certificate.bufferChanges.length,changedJson:certificate.jsonChanges.length},null,2));
