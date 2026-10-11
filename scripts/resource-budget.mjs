import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const files=[];
function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())scan(p);else {const b=fs.readFileSync(p);files.push({file:path.relative('dist',p),bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')});}}}
scan('dist');
const optional=files.filter(f=>f.file==='assets/bearroom.glb');
const required=files.filter(f=>f.file!=='assets/bearroom.glb');
const requiredBytes=required.reduce((n,f)=>n+f.bytes,0),full=files.reduce((n,f)=>n+f.bytes,0);
const b=fs.readFileSync('dist/assets/bearroom.glb');const g=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());
const report={requiredFiles:required,optionalReferenceFiles:optional,requiredStaticBytesUpperBound:requiredBytes,fullPublishedBytes:full,requiredMiB:requiredBytes/1048576,fullPublishedMiB:full/1048576,targets:{firstScreenMaxMiB:20,fullPublishedMaxMiB:50,firstScreenPass:requiredBytes<=20*1048576,fullPublishedPass:full<=50*1048576},embeddedPbrImages:g.images.length,embeddedImageBytes:g.images.reduce((n,i)=>n+g.bufferViews[i.bufferView].byteLength,0),externalArtFiles:required.filter(f=>f.file.startsWith('assets/textures/')).length,loading:'One fetch of bearroom.glb.gz; fflate lossless decode; GLTFLoader parses embedded PBR images. Raw GLB is not requested by app. Thirteen independent screen/frame artworks preload separately. No separate PBR texture fetch or duplicate model load.',note:'Static on-disk upper bound, not observed network timing. JS/CSS transport compression may reduce transfer. Browser and physical mobile performance unverified.'};
fs.writeFileSync('delivery/resource-budget.json',JSON.stringify(report,null,2));console.log({requiredBytes,full,requiredMiB:report.requiredMiB,fullMiB:report.fullPublishedMiB,targets:report.targets});
