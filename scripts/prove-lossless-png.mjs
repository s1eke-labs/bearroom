/** Independently prove the Python PNG conversion using Node's zlib and PNG filters. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {parseGLB} from './asset-contract.mjs';
import {stable} from './model-node-snapshot.mjs';
import {decodeRGB8PNG,pngEquivalence} from './lossless-png-contract.mjs';
import {loadSeatedBearCertificate,restoreSeatedBearModel} from './seated-bear-contract.mjs';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
export function modelProof(model,certificate=pngEquivalence){
 const {json,bytes}=model,binary=bytes.subarray(28+bytes.readUInt32LE(12));
 const omitted=new Set(certificate.images.map(image=>image.bufferView));
 const digest=crypto.createHash('sha256');
 for(const [index,view]of json.bufferViews.entries()){
  if(omitted.has(index))continue;
  const payload=binary.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);
  const header=Buffer.alloc(8);header.writeUInt32LE(index,0);header.writeUInt32LE(payload.length,4);digest.update(header).update(payload);
 }
 const semantic=structuredClone(json);
 semantic.buffers=semantic.buffers.map(({byteLength,...rest})=>rest);
 semantic.bufferViews=semantic.bufferViews.map(({byteOffset,byteLength,...rest},index)=>omitted.has(index)?rest:{...rest,byteLength});
 return {nonImageBufferViewsSha256:digest.digest('hex'),nonLayoutJsonSha256:sha(JSON.stringify(stable(semantic)))};
}
export function verifyCertifiedModel(model,certificate=pngEquivalence,seatedCertificate=loadSeatedBearCertificate()){
 // The original PNG certificate remains historical and byte-exact. A later pose
 // must first reverse to its original model; it cannot rewrite the PNG proof.
 if(seatedCertificate&&sha(model.bytes)!==certificate.modelSha256)model=restoreSeatedBearModel(model,seatedCertificate);
 const proof=modelProof(model,certificate);
 for(const key of Object.keys(proof))assert.equal(proof[key],certificate[key],`${key}: unexpected model change`);
 const binary=model.bytes.subarray(28+model.bytes.readUInt32LE(12));
 for(const image of certificate.images){
  assert.equal(model.json.images[image.imageIndex].bufferView,image.bufferView);
  assert.equal(model.json.images[image.imageIndex].mimeType,'image/png');
  const view=model.json.bufferViews[image.bufferView],data=binary.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);
  assert.equal(sha(data),image.afterSha256);assert.equal(data.length,image.afterBytes);
  const decoded=decodeRGB8PNG(data);
  for(const key of Object.keys(decoded))assert.equal(decoded[key],image[key],`${image.name}: ${key}`);
 }
 return proof;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [beforePath,afterPath,reportPath]=process.argv.slice(2);
 assert.ok(beforePath&&afterPath&&reportPath,'Usage: node scripts/prove-lossless-png.mjs BEFORE AFTER CERTIFICATE');
 const before=parseGLB(fs.readFileSync(beforePath)),after=parseGLB(fs.readFileSync(afterPath));
 const certificate=JSON.parse(fs.readFileSync(reportPath));
 assert.equal(sha(before.bytes),certificate.baselineModelSha256);assert.equal(sha(after.bytes),certificate.modelSha256);
 const oldProof=modelProof(before,certificate),newProof=modelProof(after,certificate);assert.deepEqual(newProof,oldProof);
 const binary=before.bytes.subarray(28+before.bytes.readUInt32LE(12));
 for(const image of certificate.images){
  const view=before.json.bufferViews[image.bufferView],data=binary.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);
  assert.equal(sha(data),image.beforeSha256);assert.equal(data.length,image.beforeBytes);
  const decoded=decodeRGB8PNG(data);
  for(const key of Object.keys(decoded))assert.equal(decoded[key],image[key],`${image.name}: original ${key}`);
 }
 Object.assign(certificate,newProof,{independentlyVerifiedWith:'Node.js zlib + PNG unfilter; all non-IDAT chunks hashed verbatim'});
 verifyCertifiedModel(after,certificate);
 const packed=fs.readFileSync(afterPath);certificate.afterGzipBytes=packed.length;certificate.savedGzipBytes=certificate.beforeGzipBytes-packed.length;
 fs.writeFileSync(reportPath,JSON.stringify(certificate,null,2)+'\n');
 console.log(JSON.stringify({images:certificate.images.length,savedGzipBytes:certificate.savedGzipBytes,...newProof},null,2));
}
