import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {loadModelData} from './helpers.mjs';
import {pngEquivalence,certifiedOriginalImageHash,decodeRGB8PNG} from '../scripts/lossless-png-contract.mjs';
import {verifyCertifiedModel} from '../scripts/prove-lossless-png.mjs';
import {restoreSeatedBearModel} from '../scripts/seated-bear-contract.mjs';
import {ASSET_REVISION} from '../src/asset-revision.js';
const model=loadModelData(),binary=model.bytes.subarray(28+model.bytes.readUInt32LE(12));
const imageBytes=entry=>{const view=model.json.bufferViews[entry.bufferView];return binary.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);};
test('lossless PNG: every pixel, channel, dimension and metadata chunk is independently exact',()=>{
 assert.equal(pngEquivalence.baselineModelSha256,'1f1fcc773da5cf4d44a314d3c5063b8d1a2a1f6486dfe158228eb4abdbb4269e');
 assert.equal(pngEquivalence.images.length,10);
 assert.equal(crypto.createHash('sha256').update(model.bytes).digest('hex'),ASSET_REVISION.modelSha256);
 assert.equal(crypto.createHash('sha256').update(restoreSeatedBearModel(model).bytes).digest('hex'),pngEquivalence.modelSha256);
 verifyCertifiedModel(model);
});
test('lossless PNG: only ten exact certified encoded hashes receive legacy preservation identity',()=>{
 for(const entry of pngEquivalence.images){
  const bytes=imageBytes(entry);assert.equal(certifiedOriginalImageHash(bytes),entry.beforeSha256);
  const tampered=Buffer.from(bytes);tampered[tampered.length-1]^=1;
  assert.equal(certifiedOriginalImageHash(tampered),crypto.createHash('sha256').update(tampered).digest('hex'));
  assert.notEqual(certifiedOriginalImageHash(tampered),entry.beforeSha256);
 }
});
test('lossless PNG: pixel-certificate tampering and any nonimage/model semantic mutation fail',()=>{
 const incorrect=structuredClone(pngEquivalence);incorrect.images[0].decodedChannelSha256='0'.repeat(64);
 assert.throws(()=>verifyCertifiedModel(model,incorrect),/decodedChannelSha256/);
 const changed={bytes:model.bytes,json:structuredClone(model.json)};changed.json.nodes[0].name+=' altered';
 assert.throws(()=>verifyCertifiedModel(changed),/nonLayoutJsonSha256|GLB JSON does not match its bytes/);
 const geometry={json:model.json,bytes:Buffer.from(model.bytes)};
 const imageViews=new Set(pngEquivalence.images.map(image=>image.bufferView));
 const view=model.json.bufferViews.find((view,index)=>!imageViews.has(index));
 geometry.bytes[28+model.bytes.readUInt32LE(12)+(view.byteOffset||0)]^=1;
 assert.throws(()=>verifyCertifiedModel(geometry),/nonImageBufferViewsSha256|Seated-bear model SHA mismatch/);
 const corrupt=Buffer.from(imageBytes(pngEquivalence.images[0]));corrupt[24]=16;
 assert.throws(()=>decodeRGB8PNG(corrupt),/RGB8/);
});
