/** Capture the unchanged v18 runtime (v17 visual asset) before the v19 bathroom revision. */
import fs from 'node:fs';
import {loadModelData,loadSceneForCPU} from '../tests/helpers.mjs';
import {snapshotScene,hashBytes} from './model-node-snapshot.mjs';
const {bytes}=loadModelData();
if(hashBytes(bytes)!=='b294de08c3b0cdf4a1db5c144e6a42d66d6ac5129fc65c872fcef4977a3e75a7')throw Error('Expected immutable v17 baseline before v19 asset integration');
const scene=await loadSceneForCPU();
const report={revision:'v17 visual source, shipped in v18',modelSha256:hashBytes(bytes),nodes:snapshotScene(scene)};
fs.writeFileSync(new URL('../recovery/v17-model-node-snapshot.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log('Captured',report.nodes.length,'nodes',report.modelSha256);
