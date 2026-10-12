import test from 'node:test';
import assert from 'node:assert/strict';
import {deflateSync,inflateSync} from 'node:zlib';
import {loadModelData,loadSceneForCPU} from './helpers.mjs';
import {hashBytes,snapshotScene} from '../scripts/model-node-snapshot.mjs';
import {SEATED_BEAR_BASELINE_SHA256,SEATED_BEAR_NODES,createSeatedBearCertificate,restoreSeatedBearModel,restoreSeatedBearSnapshots,loadSeatedBearCertificate} from '../scripts/seated-bear-contract.mjs';
import {verifyCertifiedModel} from '../scripts/prove-lossless-png.mjs';
import {ASSET_REVISION} from '../src/asset-revision.js';

const current=loadModelData(),installed=loadSeatedBearCertificate(),before=restoreSeatedBearModel(current,installed);
const beforeNodes=restoreSeatedBearSnapshots(snapshotScene(await loadSceneForCPU()),installed);
const sourceSha256=hashBytes('Explicit test source, never production GI');
function rewrap(json,binary){
 let text=Buffer.from(JSON.stringify(json));text=Buffer.concat([text,Buffer.alloc((4-text.length%4)%4,32)]);
 const bytes=Buffer.alloc(28+text.length+binary.length);bytes.writeUInt32LE(0x46546c67);bytes.writeUInt32LE(2,4);bytes.writeUInt32LE(bytes.length,8);bytes.writeUInt32LE(text.length,12);bytes.writeUInt32LE(0x4e4f534a,16);text.copy(bytes,20);bytes.writeUInt32LE(binary.length,20+text.length);bytes.writeUInt32LE(0x004e4942,24+text.length);binary.copy(bytes,28+text.length);return {bytes,json};
}
const binaryOf=model=>model.bytes.subarray(28+model.bytes.readUInt32LE(12));
function fixture({nodeName='Bear_reference_plush__fabric_bear',semantic='POSITION',changeJson}={}){
 const json=structuredClone(before.json),binary=Buffer.from(binaryOf(before));
 const node=json.nodes.find(n=>n.name===nodeName),primitive=json.meshes[node.mesh].primitives[0],accessor=json.accessors[semantic==='INDICES'?primitive.indices:primitive.attributes[semantic]],view=json.bufferViews[accessor.bufferView];
 const offset=view.byteOffset||0;if(accessor.componentType===5126)binary.writeFloatLE(binary.readFloatLE(offset)+.003,offset);else binary[offset]^=1;
 const root=json.nodes.find(n=>n.name==='Bear_reference_plush');root.translation[0]+=.01;
 changeJson?.(json);
 const after=rewrap(json,binary),afterNodes=structuredClone(beforeNodes);
 for(const n of afterNodes)if(SEATED_BEAR_NODES.includes(n.name))n.matrixWorld[12]+=.01;
 const target=afterNodes.find(n=>n.name===nodeName);if(semantic==='POSITION')target.geometry.position=hashBytes(binary.subarray(offset,offset+view.byteLength));
 return {after,afterNodes};
}
const {after,afterNodes}=fixture();
const certificate=createSeatedBearCertificate(before,after,{beforeNodes,afterNodes,sourceSha256});

test('seated bear: an exact finite patch reverses to the historical model and all original PNG evidence',()=>{
 const restored=restoreSeatedBearModel(after,certificate,{expectedSourceSha256:sourceSha256});
 assert.equal(hashBytes(restored.bytes),SEATED_BEAR_BASELINE_SHA256);assert.deepEqual(restored.bytes,before.bytes);assert.deepEqual(restoreSeatedBearSnapshots(afterNodes,certificate),beforeNodes);
 verifyCertifiedModel(after,undefined,certificate);
 assert.equal(certificate.bufferChanges.length,1);assert.ok(certificate.jsonChanges.every(change=>change.path[0]==='nodes'));
});
test('seated bear: the installed model, source and certificate identities agree when present',()=>{
 if(installed){assert.equal(installed.sourceSha256,ASSET_REVISION.bakeSourceSha256);assert.equal(installed.modelSha256,ASSET_REVISION.modelSha256);assert.equal(hashBytes(restoreSeatedBearModel(current,installed,{expectedSourceSha256:ASSET_REVISION.bakeSourceSha256}).bytes),SEATED_BEAR_BASELINE_SHA256);}
 else assert.equal(hashBytes(current.bytes),SEATED_BEAR_BASELINE_SHA256);
});
test('seated bear: new model bytes, source identity and after snapshots cannot be relabeled',()=>{
 const corrupt={json:after.json,bytes:Buffer.from(after.bytes)};corrupt.bytes[corrupt.bytes.length-1]^=1;
 assert.throws(()=>restoreSeatedBearModel(corrupt,certificate),/model SHA mismatch/);
 assert.throws(()=>restoreSeatedBearModel(after,certificate,{expectedSourceSha256:'0'.repeat(64)}),/genuine bake source differ/);
 const changed=structuredClone(afterNodes);changed.find(n=>n.name==='Bear_reference_plush__fabric_bear').geometry.position='0'.repeat(64);
 assert.throws(()=>restoreSeatedBearSnapshots(changed,certificate),/current snapshot differs/);
 const metadata=structuredClone(certificate);metadata.nodes[0].after.userData.injected=true;
 assert.throws(()=>restoreSeatedBearSnapshots(afterNodes,metadata),/unapproved snapshot change/);
});
test('seated bear: head, embroidery, desk bear, topology and material changes remain prohibited',()=>{
 for(const nodeName of ['bear_head_sewn_front_panel','Bear_reference_plush__embroidery_ink','Bear_desk_plush__fabric_bear']){
  const f=fixture({nodeName});assert.throws(()=>createSeatedBearCertificate(before,f.after,{beforeNodes,afterNodes:f.afterNodes,sourceSha256}),/exclusively owned allowed bear attribute/);
 }
 for(const semantic of ['TEXCOORD_0','INDICES']){const f=fixture({semantic});assert.throws(()=>createSeatedBearCertificate(before,f.after,{beforeNodes,afterNodes:f.afterNodes,sourceSha256}),/exclusively owned allowed bear attribute/);}
 for(const changeJson of [g=>g.materials[0].name+=' changed',g=>g.nodes[0].name+=' changed',g=>g.nodes.find(n=>n.name==='Bear_reference_plush').extras.injected=true,g=>g.images[0].mimeType='image/jpeg']){
  const f=fixture({changeJson});assert.throws(()=>createSeatedBearCertificate(before,f.after,{beforeNodes,afterNodes:f.afterNodes,sourceSha256}),/Unapproved JSON change/);
 }
});
test('seated bear: image bytes, omitted patches, duplicate patches and false inverse evidence fail',()=>{
 const imageBinary=Buffer.from(binaryOf(after)),imageView=after.json.bufferViews[after.json.images[0].bufferView];imageBinary[imageView.byteOffset||0]^=1;
 assert.throws(()=>createSeatedBearCertificate(before,rewrap(after.json,imageBinary),{beforeNodes,afterNodes,sourceSha256}),/exclusively owned allowed bear attribute/);
 const missing=structuredClone(certificate);missing.bufferChanges=[];assert.throws(()=>restoreSeatedBearModel(after,missing),/Inverse model/);
 const duplicate=structuredClone(certificate);duplicate.bufferChanges.push(duplicate.bufferChanges[0]);assert.throws(()=>restoreSeatedBearModel(after,duplicate),/Duplicate/);
 const falseBefore=structuredClone(certificate),patch=falseBefore.bufferChanges[0],bytes=inflateSync(Buffer.from(patch.beforeDeflateBase64,'base64'));bytes[0]^=1;patch.beforeDeflateBase64=deflateSync(bytes).toString('base64');patch.beforeSha256=hashBytes(bytes);
 assert.throws(()=>restoreSeatedBearModel(after,falseBefore),/Inverse model/);
 const falseBaseline=structuredClone(certificate);falseBaseline.baselineModelSha256='0'.repeat(64);assert.throws(()=>restoreSeatedBearModel(after,falseBaseline),/Unexpected seated-bear baseline/);
});
