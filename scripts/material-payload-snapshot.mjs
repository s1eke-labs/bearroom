/** Canonical glTF material, sampler and embedded-image payloads, independent of index order. */
import {stable} from './model-node-snapshot.mjs';
import {certifiedOriginalImageHash} from './lossless-png-contract.mjs';
export function materialPayloadSnapshot({bytes,json:g}){
 const binary=bytes.subarray(28+bytes.readUInt32LE(12));
 const image=index=>{
  const im=g.images[index];
  if(im.bufferView===undefined)return{uri:im.uri,mimeType:im.mimeType};
  const v=g.bufferViews[im.bufferView];
  return{mimeType:im.mimeType,payloadSha256:certifiedOriginalImageHash(binary.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength))};
 };
 const texture=index=>{const t=g.textures[index];return{image:image(t.source),sampler:t.sampler===undefined?null:g.samplers[t.sampler],extensions:t.extensions,extras:t.extras};};
 function resolve(o){
  if(!o||typeof o!=='object')return o;
  if(Array.isArray(o))return o.map(resolve);
  return Object.fromEntries(Object.entries(o).map(([key,value])=>[key,/Texture$/.test(key)&&value&&typeof value.index==='number'?{...value,index:texture(value.index)}:resolve(value)]));
 }
 return stable(Object.fromEntries((g.materials||[]).map(m=>[m.name,resolve(m)])));
}
