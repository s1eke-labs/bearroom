import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { ASSET_REVISION } from '../src/asset-revision.js';
import { FURNITURE, PIANO_KEYS } from '../src/domain.js';
import { validateIrradiance } from '../src/baked-gi.js';
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
export function assetDirectory(){return path.join(ROOT,'public/assets')}
export function parseGLB(packed){
 const bytes=packed[0]===31&&packed[1]===139?zlib.gunzipSync(packed):packed;
 assert.equal(bytes.readUInt32LE(0),0x46546c67,'GLB magic');assert.equal(bytes.readUInt32LE(4),2,'GLB version');assert.equal(bytes.readUInt32LE(8),bytes.length,'GLB length');
 const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString().trim());return{bytes,json};
}
export function checkAssetContract(directory=assetDirectory(),revision=ASSET_REVISION){
 const {bytes,json}=parseGLB(fs.readFileSync(path.join(directory,'bearroom.glb.gz')));
 const gi=JSON.parse(fs.readFileSync(path.join(directory,'baked-gi/irradiance.json')));
 assert.equal(sha256(bytes),revision.modelSha256,'GLB content SHA does not match src/asset-revision.js');
 assert.equal(gi.sourceSha256,revision.bakeSourceSha256,'GI bake source SHA does not match src/asset-revision.js');
 validateIrradiance(gi);
 const names=json.nodes.map(n=>n.name||'');
 for(const key of PIANO_KEYS)assert.ok(names.includes(key.node),`Missing ${key.node}`);
 assert.equal(names.filter(n=>/^piano_key_\d{3}$/.test(n)).length,88,'Independent piano key count');
 for(const furniture of FURNITURE){assert.ok(names.some(n=>n===furniture.id||n.startsWith(furniture.id+'_')),`Missing furniture ${furniture.id}`);if(furniture.node)assert.ok(names.includes(furniture.node),`Missing animated target ${furniture.node}`)}
 const animationNodes=['anim_sofa_edge','anim_chair_swivel','anim_dining_edge','anim_bed_edge','anim_rocker','anim_fan_head','anim_purifier_louver','anim_clock_pendulum','anim_hood_fan','anim_fan_blades','anim_pc_fan_01','anim_pc_fan_02','anim_clock_second','anim_clock_minute','anim_clock_hour'];
 for(const n of [...animationNodes,'screen_PC','screen_TV','frame_01','frame_02','frame_03','Bear_reference_plush','Bear_desk_plush','cutaway_bathroom_rear_privacy','cutaway_bathroom_partition','cutaway_bathroom_side'])assert.ok(names.includes(n),`Missing runtime node ${n}`);

 for(const [parentName,bodyName] of [['Bear_reference_plush','Bear_reference_plush__fabric_bear'],['Bear_desk_plush','Bear_desk_plush__fabric_bear']]){
  const body=json.nodes.find(n=>n.name===bodyName);assert.ok(body&&body.mesh!==undefined,`Velvet shader requires direct mesh ${bodyName}`);
  const parent=json.nodes.find(n=>n.name===parentName);const descendants=new Set();const visit=n=>{for(const index of n.children||[]){descendants.add(index);visit(json.nodes[index])}};visit(parent);assert.ok([...descendants].some(i=>json.nodes[i]===body),`Velvet body is not under ${parentName}`);
 }
 for(const n of ['anim_sofa_edge','anim_dining_edge','anim_bed_edge'])assert.ok(json.nodes.find(x=>x.name===n)?.mesh!==undefined,`Cloth target ${n} must remain a direct mesh`);
 const frozenSlides=JSON.parse(fs.readFileSync(path.join(ROOT,'recovery/v12-slide-textures.json'))).files;
 const textureHashes=[];for(const[prefix,count]of[['pc',6],['tv',4],['frame',3]])for(let i=1;i<=count;i++){const name=`${prefix}-${String(i).padStart(2,'0')}.webp`,b=fs.readFileSync(path.join(directory,'textures',name)),hash=sha256(b);assert.ok(b.length>2000);assert.equal(hash,frozenSlides.find(file=>file.path===name)?.sha256,`Existing slide art changed: ${name}`);textureHashes.push(hash)}assert.equal(new Set(textureHashes).size,13);
 return{modelBytes:bytes.length,modelSha256:sha256(bytes),bakeSourceSha256:gi.sourceSha256,nodes:json.nodes.length,furniture:FURNITURE.length,animatedFurniture:FURNITURE.filter(f=>f.animated).length,pianoKeys:88,runtimeAnimationNodes:animationNodes.length,uniqueTextures:textureHashes.length,giRegions:gi.regions.map(r=>r.name),giProbes:160,giMethod:gi.method,giSamples:gi.samples,giSkyMethod:gi.sky?.method||null,giSkySourceSha256:gi.sky?.sourceSha256||null,giTextureBytes:5*2*192*4*2};
}
