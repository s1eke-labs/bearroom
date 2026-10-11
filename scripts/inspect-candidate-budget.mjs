/** Read-only early size check. A candidate does not replace the current model/GI. */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {ROOT,parseGLB,sha256} from './asset-contract.mjs';

const [model,output,giPath]=process.argv.slice(2);
if(!model)throw Error('Usage: node scripts/inspect-candidate-budget.mjs MODEL.glb[.gz] [REPORT.json] [PAIRED-GI.json]');
const supplied=fs.readFileSync(model),{bytes,json:g}=parseGLB(supplied);
const compressed=supplied[0]===31&&supplied[1]===139?supplied:zlib.gzipSync(bytes,{level:9,mtime:0});
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else files.push({path:path.relative(path.join(ROOT,'dist'),p),bytes:fs.statSync(p).size})}}
walk(path.join(ROOT,'dist'));
const oldModel=files.find(f=>f.path==='assets/bearroom.glb.gz').bytes;
const oldGi=files.find(f=>f.path==='assets/baked-gi/irradiance.json').bytes;
const giBytes=giPath?fs.statSync(giPath).size:oldGi;
const distributionBytes=files.reduce((sum,f)=>sum+f.bytes,0)-oldModel-oldGi+compressed.length+giBytes;
const primitives=g.meshes.flatMap(m=>m.primitives),binary=bytes.subarray(28+bytes.readUInt32LE(12));
const images=(g.images||[]).map(image=>{const view=g.bufferViews[image.bufferView];return view?{name:image.name,encodedBytes:view.byteLength,sha256:sha256(binary.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength))}:{name:image.name,external:image.uri}});
const report={
  scope:'Read-only candidate projection using the currently built non-model files. A final build and paired-GI verification are still required. This is not GPU memory or FPS.',
  model:path.basename(model),modelSha256:sha256(bytes),glbBytes:bytes.length,compressedModelBytes:compressed.length,
  compression:supplied===compressed?'supplied gzip bytes':'zlib level 9 estimate',
  nodes:g.nodes.length,meshes:g.meshes.length,primitives:primitives.length,
  triangles:primitives.filter(p=>(p.mode??4)===4).reduce((sum,p)=>sum+g.accessors[p.indices??p.attributes.POSITION].count/3,0),
  embeddedImageIdentities:images.filter(i=>!i.external).length,
  uniqueEmbeddedImageContents:new Set(images.filter(i=>!i.external).map(i=>i.sha256)).size,
  embeddedImages:images,
  gi:giPath?path.basename(giPath):'current GI size placeholder only; candidate GI is not installed or claimed matched',
  projectedDistributionBytes:distributionBytes,distributionLimitBytes:20*1024*1024,
  projectedHeadroomBytes:20*1024*1024-distributionBytes,
};
if(output)fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
