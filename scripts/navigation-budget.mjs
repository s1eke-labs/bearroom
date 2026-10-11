/** CPU array allocation counts on the real exported model; never an FPS estimate. */
import fs from 'node:fs';
import {loadSceneForCPU,loadModelData} from '../tests/helpers.mjs';
import {WalkNavigation} from '../src/walk-navigation.js';
import {sha256} from './asset-contract.mjs';

const [model,output]=process.argv.slice(2);
const root=await loadSceneForCPU(model);
root.getObjectByName('Exterior_city')?.removeFromParent();root.updateMatrixWorld(true);
const arrays=new Set(),geometries=new Set();let geometryAttributeBytes=0,geometryIndexBytes=0;
root.traverse(object=>{if(!object.isMesh||geometries.has(object.geometry))return;const g=object.geometry;geometries.add(g);
  for(const attr of Object.values(g.attributes)){const a=attr.isInterleavedBufferAttribute?attr.data.array:attr.array;if(!arrays.has(a)){arrays.add(a);geometryAttributeBytes+=a.byteLength}}
  if(g.index&&!arrays.has(g.index.array)){arrays.add(g.index.array);geometryIndexBytes+=g.index.array.byteLength}
});
const nav=new WalkNavigation(root),{bytes}=loadModelData(model);
const report={
  scope:'CPU model-geometry typed-array view lengths and separately allocated collision arrays. Excludes textures, backing-buffer sharing, JavaScript object overhead, temporary build memory, render targets, shadow maps and driver allocation. This is not measured device memory or FPS. Build time applies only to this run in this environment.',
  modelSha256:sha256(bytes),modelGeometries:geometries.size,geometryAttributeBytes,geometryIndexBytes,
  geometryArrayViewBytes:geometryAttributeBytes+geometryIndexBytes,
  collision:{...nav.stats,collisionMiB:nav.stats.collisionBytes/1048576},
};
if(output)fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
