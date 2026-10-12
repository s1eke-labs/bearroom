/** Exact, reversible seated-bear revision. No subtree, material or image exemptions. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {deflateSync,inflateSync} from 'node:zlib';
import {hashBytes,stable} from './model-node-snapshot.mjs';

export const SEATED_BEAR_BASELINE_SHA256='8a1a2c47e914ba7a08f014ba5f0ff43383e122f460aee253f26e0fb2d47c1e54';
export const SEATED_BEAR_NODES=Object.freeze(['bear_head_sewn_front_panel','bear_minky_surface_nap','Bear_reference_plush__embroidery_ink','Bear_reference_plush__fabric_bear','Bear_reference_plush__fabric_bear_sewn_thread','Bear_reference_plush']);
export const SEATED_BEAR_GEOMETRY_NODES=Object.freeze(['bear_minky_surface_nap','Bear_reference_plush__fabric_bear','Bear_reference_plush__fabric_bear_sewn_thread']);
const nodeSet=new Set(SEATED_BEAR_NODES),geometrySet=new Set(SEATED_BEAR_GEOMETRY_NODES),directions=new Set(['POSITION','NORMAL','TANGENT']);
const certificatePath=new URL('../recovery/seated-bear-pose.json',import.meta.url);
const equal=(a,b)=>JSON.stringify(stable(a))===JSON.stringify(stable(b));
const digest=(x,label)=>assert.match(x,/^[a-f0-9]{64}$/,label);
const pack=bytes=>deflateSync(bytes,{level:9}).toString('base64');
function unpack(value,limit,label){assert.equal(typeof value,'string',label);assert.ok(value.length<=Math.ceil(limit*1.5)+1024,label+' is oversized');const bytes=inflateSync(Buffer.from(value,'base64'),{maxOutputLength:limit});assert.ok(bytes.length<=limit);return bytes;}
export function loadSeatedBearCertificate(){return fs.existsSync(certificatePath)?JSON.parse(fs.readFileSync(certificatePath)):null;}
function parts(model){
 const {bytes,json}=model;assert.ok(Buffer.isBuffer(bytes),'Canonical GLB bytes required');
 assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(4),2);assert.equal(bytes.readUInt32LE(8),bytes.length);
 const length=bytes.readUInt32LE(12);assert.equal(bytes.readUInt32LE(16),0x4e4f534a);assert.equal(bytes.readUInt32LE(24+length),0x004e4942);assert.equal(bytes.readUInt32LE(20+length)+28+length,bytes.length);
 const jsonBytes=bytes.subarray(20,20+length);assert.ok(equal(JSON.parse(jsonBytes.toString()),json),'GLB JSON does not match its bytes');
 return {jsonBytes,binary:bytes.subarray(28+length)};
}
function assemble(jsonBytes,binary){
 const header=Buffer.alloc(20),binHeader=Buffer.alloc(8);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+jsonBytes.length+binary.length,8);header.writeUInt32LE(jsonBytes.length,12);header.writeUInt32LE(0x4e4f534a,16);binHeader.writeUInt32LE(binary.length);binHeader.writeUInt32LE(0x004e4942,4);return Buffer.concat([header,jsonBytes,binHeader,binary]);
}
function ownedViews(json){
 const uses=new Map();
 for(const node of json.nodes)if(node.mesh!==undefined)for(const primitive of json.meshes[node.mesh].primitives){
  for(const [semantic,index]of Object.entries(primitive.attributes)){
   const accessor=json.accessors[index],view=accessor.bufferView;
   if(!uses.has(view))uses.set(view,[]);uses.get(view).push({node:node.name,semantic,accessor:index});
  }
  if(primitive.indices!==undefined){const view=json.accessors[primitive.indices].bufferView;if(!uses.has(view))uses.set(view,[]);uses.get(view).push({node:node.name,semantic:'INDICES',accessor:primitive.indices});}
 }
 return uses;
}
function scopedJsonChanges(before,after){
 const comparable=structuredClone(after),changes=[];
 assert.equal(after.nodes.length,before.nodes.length,'Node topology changed');
 for(const name of SEATED_BEAR_NODES){
  const i=before.nodes.findIndex(n=>n.name===name);assert.ok(i>=0,'Missing baseline bear node: '+name);assert.equal(after.nodes[i]?.name,name,'Bear node order/name changed');
  for(const key of ['translation','rotation','scale','matrix'])if(!equal(before.nodes[i][key],after.nodes[i][key])){
   const value=after.nodes[i][key];assert.ok(value===undefined||(Array.isArray(value)&&value.length===({translation:3,rotation:4,scale:3,matrix:16}[key])&&value.every(Number.isFinite)),'Invalid bear transform');
   changes.push({path:['nodes',i,key],before:before.nodes[i][key]??null,after:value??null});
   if(before.nodes[i][key]===undefined)delete comparable.nodes[i][key];else comparable.nodes[i][key]=structuredClone(before.nodes[i][key]);
  }
 }
 for(const [view,uses]of ownedViews(before)){
  if(!uses.every(use=>geometrySet.has(use.node)&&use.semantic==='POSITION'))continue;
  for(const index of new Set(uses.map(use=>use.accessor)))for(const key of ['min','max'])if(!equal(before.accessors[index][key],after.accessors[index]?.[key])){
   const value=after.accessors[index][key];assert.ok(Array.isArray(value)&&value.length===3&&value.every(Number.isFinite),'Invalid POSITION bounds');
   changes.push({path:['accessors',index,key],before:before.accessors[index][key]??null,after:value});
   if(before.accessors[index][key]===undefined)delete comparable.accessors[index][key];else comparable.accessors[index][key]=structuredClone(before.accessors[index][key]);
  }
 }
 assert.ok(equal(comparable,before),'Unapproved JSON change: topology, metadata, material, UV, indices, images and buffer layout must stay exact');
 return changes;
}
function assertSnapshotPair(entry){
 assert.ok(nodeSet.has(entry.name),'Snapshot outside finite bear scope');assert.equal(entry.before?.name,entry.name);assert.equal(entry.after?.name,entry.name);
 const comparable=structuredClone(entry.after);assert.equal(comparable.matrixWorld?.length,16);assert.ok(comparable.matrixWorld.every(Number.isFinite));comparable.matrixWorld=entry.before.matrixWorld;
 if(geometrySet.has(entry.name))for(const key of ['position','normal','tangent'])if(entry.before.geometry?.[key]!==undefined){digest(entry.after.geometry?.[key],'After geometry hash');comparable.geometry[key]=entry.before.geometry[key];}
 assert.ok(equal(comparable,entry.before),entry.name+': unapproved snapshot change (face, material, metadata, topology or immutable attributes)');
}
function validateCertificate(certificate){
 assert.equal(certificate.schemaVersion,1);assert.equal(certificate.baselineModelSha256,SEATED_BEAR_BASELINE_SHA256,'Unexpected seated-bear baseline');digest(certificate.modelSha256,'New model SHA');digest(certificate.sourceSha256,'Actual new source SHA');
 assert.notEqual(certificate.modelSha256,certificate.baselineModelSha256,'A pose certificate must represent an actual model revision');
 assert.ok(Array.isArray(certificate.nodes));assert.deepEqual(certificate.nodes.map(n=>n.name).sort(),[...SEATED_BEAR_NODES].sort(),'Exactly six certified bear snapshots required');certificate.nodes.forEach(assertSnapshotPair);
 assert.ok(Array.isArray(certificate.bufferChanges)&&certificate.bufferChanges.length<=9,'Only the three named meshes and three geometry semantics may change');assert.ok(Array.isArray(certificate.jsonChanges));
}
/** Build from canonical GLBs and snapshotScene results. sourceSha256 is never a bake relabel. */
export function createSeatedBearCertificate(before,after,{beforeNodes,afterNodes,sourceSha256,sourceBytes}={}){
 const old=parts(before),now=parts(after);assert.equal(hashBytes(before.bytes),SEATED_BEAR_BASELINE_SHA256,'Use the exact current v19 baseline');digest(sourceSha256,'Actual new source SHA');if(sourceBytes)assert.equal(hashBytes(sourceBytes),sourceSha256,'Source bytes do not match declared identity');
 assert.equal(old.binary.length,now.binary.length,'BIN layout/length must remain exact');
 const jsonChanges=scopedJsonChanges(before.json,after.json),uses=ownedViews(before.json),bufferChanges=[];
 for(const [index,view]of before.json.bufferViews.entries()){
  const offset=view.byteOffset||0,a=old.binary.subarray(offset,offset+view.byteLength),b=now.binary.subarray(offset,offset+view.byteLength);
  if(a.equals(b))continue;
  const owners=uses.get(index);assert.ok(owners?.length===1&&geometrySet.has(owners[0].node)&&directions.has(owners[0].semantic),'Changed view is not an exclusively owned allowed bear attribute: '+index);
  bufferChanges.push({bufferView:index,...owners[0],beforeSha256:hashBytes(a),afterSha256:hashBytes(b),beforeDeflateBase64:pack(a)});
 }
 assert.ok(beforeNodes&&afterNodes,'Both complete decoded snapshot arrays are required');
 const nodes=SEATED_BEAR_NODES.map(name=>({name,before:structuredClone(beforeNodes.find(n=>n.name===name)),after:structuredClone(afterNodes.find(n=>n.name===name))}));
 const certificate={schemaVersion:1,operation:'Finite seated-bear POSITION/NORMAL/TANGENT and transform edit; reversible to exact v19 runtime',baselineModelSha256:hashBytes(before.bytes),modelSha256:hashBytes(after.bytes),sourceSha256,baselineJsonDeflateBase64:pack(old.jsonBytes),jsonChanges,bufferChanges,nodes};
 restoreSeatedBearModel(after,certificate,{expectedSourceSha256:sourceSha256});restoreSeatedBearSnapshots(afterNodes,certificate);
 return certificate;
}
/** Verify the new bytes first, then restore only audited fields; old PNG proof stays unchanged. */
export function restoreSeatedBearModel(model,certificate=loadSeatedBearCertificate(),{expectedSourceSha256}={}){
 if(!certificate)return model;validateCertificate(certificate);
 if(expectedSourceSha256!==undefined)assert.equal(certificate.sourceSha256,expectedSourceSha256,'Seated model and genuine bake source differ');
 const now=parts(model);assert.equal(hashBytes(model.bytes),certificate.modelSha256,'Seated-bear model SHA mismatch');
 const jsonBytes=unpack(certificate.baselineJsonDeflateBase64,4*1024*1024,'Baseline JSON'),before=JSON.parse(jsonBytes.toString());assert.equal(jsonBytes.length%4,0,'Baseline JSON padding');
 assert.deepEqual(scopedJsonChanges(before,model.json),certificate.jsonChanges,'Certified JSON change list differs');
 const binary=Buffer.from(now.binary),uses=ownedViews(before),seen=new Set();
 for(const patch of certificate.bufferChanges){
  assert.ok(Number.isInteger(patch.bufferView)&&!seen.has(patch.bufferView),'Duplicate/invalid patched view');seen.add(patch.bufferView);
  const owners=uses.get(patch.bufferView);assert.ok(owners?.length===1&&geometrySet.has(owners[0].node)&&directions.has(owners[0].semantic),'Patch touches protected geometry');
  assert.deepEqual({node:patch.node,semantic:patch.semantic,accessor:patch.accessor},owners[0],'Patch ownership mismatch');
  const view=before.bufferViews[patch.bufferView],accessor=before.accessors[patch.accessor];
  assert.equal(accessor.componentType,5126,'Only float bear attribute views may be patched');assert.ok(!accessor.sparse&&!view.byteStride&&!accessor.byteOffset,'Only tightly packed bear attributes supported');
  assert.equal(view.byteLength,accessor.count*(accessor.type==='VEC4'?4:3)*4,'Unexpected attribute view size');
  const offset=view.byteOffset||0,after=binary.subarray(offset,offset+view.byteLength);assert.equal(hashBytes(after),patch.afterSha256,'After attribute bytes differ');
  const original=unpack(patch.beforeDeflateBase64,view.byteLength,'Before attribute');assert.equal(original.length,view.byteLength);assert.equal(hashBytes(original),patch.beforeSha256,'Before attribute bytes differ');assert.notEqual(patch.beforeSha256,patch.afterSha256,'Redundant unchanged view certificate');original.copy(binary,offset);
 }
 const bytes=assemble(jsonBytes,binary);assert.equal(hashBytes(bytes),certificate.baselineModelSha256,'Inverse model does not equal exact v19 baseline');return {bytes,json:before};
}
/** Compare every current bear snapshot exactly before mapping back for historical protection. */
export function restoreSeatedBearSnapshots(nodes,certificate=loadSeatedBearCertificate()){
 if(!certificate)return nodes;validateCertificate(certificate);
 const byName=new Map(certificate.nodes.map(entry=>[entry.name,entry]));
 for(const entry of certificate.nodes){const matches=nodes.filter(n=>n.name===entry.name);assert.equal(matches.length,1,'Missing/duplicate certified bear node');assert.ok(equal(matches[0],entry.after),entry.name+': current snapshot differs from reviewed seated pose');}
 return nodes.map(node=>byName.has(node.name)?structuredClone(byName.get(node.name).before):node);
}
