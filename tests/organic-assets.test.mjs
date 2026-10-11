/** Organic v17 source/export semantics. These are CPU checks, not GPU visual acceptance. */
import test from 'node:test';
import fs from 'node:fs';
import{soilTriangleSnapshot}from'../scripts/soil-triangle-snapshot.mjs';
import assert from 'node:assert/strict';
import {loadModelData,loadSceneForCPU} from './helpers.mjs';
import {checkOrganicPreservation} from '../scripts/check-organic-preservation.mjs';
const {json:g,bytes}=loadModelData(),scene=await loadSceneForCPU();
const organic=g.materials?.some(m=>m.name==='fabric_v17_boucle');
const binary=bytes.subarray(28+bytes.readUInt32LE(12));
const imageFor=index=>{const tex=g.textures[index],im=g.images[tex.source],v=g.bufferViews[im.bufferView];return{...im,bytes:binary.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength)}};

test('organic: unaffected v16 architecture, control roots, bears, PC and unrelated geometry remain exact across reviewed revisions',{skip:!organic},()=>{
 const result=checkOrganicPreservation(scene);assert.ok(result.protectedNodes+result.explicitLaterRevisionExcludedOriginalNodes.length>=380);
 for(const name of ['anim_chair_swivel','anim_rocker','F01_sofa','F09_computer','screen_PC_case_v16','bathroom_door_hinge','Decor__ceramic_ivory'])assert.ok(result.checks.some(n=>n.name===name),name);
});
test('organic: both tailored fabric materials carry authored color, tangent normal and roughness maps',{skip:!organic},()=>{
 for(const name of ['fabric_v17_boucle','fabric_v17_rose_linen']){
  const m=g.materials.find(m=>m.name===name);assert.ok(m,name);
  assert.ok(m.pbrMetallicRoughness.baseColorTexture,name+': albedo');
  assert.ok(m.normalTexture,name+': tangent normal');assert.ok(m.normalTexture.scale>0&&m.normalTexture.scale<=1,name+': bounded normal strength');
  assert.ok(m.pbrMetallicRoughness.metallicRoughnessTexture,name+': roughness');
  assert.equal(m.alphaMode||'OPAQUE','OPAQUE');assert.equal(m.extensions?.KHR_materials_transmission,undefined);
  const meshes=g.meshes.filter(mesh=>mesh.primitives.some(p=>g.materials[p.material]?.name===name));assert.ok(meshes.length);
  for(const mesh of meshes)for(const p of mesh.primitives)if(g.materials[p.material]?.name===name){assert.ok(p.attributes.TEXCOORD_0!==undefined,name+': UV');assert.equal(g.accessors[p.attributes.TEXCOORD_0].count,g.accessors[p.attributes.POSITION].count);}
 }
});
test('organic: five real botanical variants use one shared cutout material and one alpha-bearing atlas',{skip:!organic},()=>{
 const plants=g.nodes.filter(n=>n.extras?.organicPlantV17===true);assert.equal(plants.length,5);
 const materialIndices=new Set();for(const n of plants){assert.equal(n.extras.plantNoBatch,true);assert.ok(n.mesh!==undefined);for(const p of g.meshes[n.mesh].primitives)materialIndices.add(p.material);}
 assert.equal(materialIndices.size,1);const m=g.materials[[...materialIndices][0]];
 assert.equal(m.alphaMode,'MASK');assert.equal(m.alphaCutoff??.5,.5);assert.equal(m.doubleSided,true);
 assert.equal(m.extensions?.KHR_materials_transmission,undefined);assert.equal(m.extensions?.KHR_materials_volume,undefined);
 const image=imageFor(m.pbrMetallicRoughness.baseColorTexture.index);assert.equal(image.mimeType,'image/png');
 assert.ok(image.bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
 assert.ok([4,6].includes(image.bytes[25])||image.bytes.includes(Buffer.from('tRNS')),'Leaf base-color atlas must actually carry alpha');
 assert.ok(m.normalTexture);assert.ok(m.pbrMetallicRoughness.metallicRoughnessTexture);
 for(const n of plants){const mesh=scene.getObjectByName(n.name);assert.ok(mesh?.isMesh,n.name);assert.equal(mesh.material.transparent,false);assert.equal(mesh.material.alphaTest,.5);assert.equal(mesh.material.depthWrite,true);assert.equal(mesh.material.side,2);}
 const triangles=plants.reduce((sum,n)=>sum+g.meshes[n.mesh].primitives.reduce((v,p)=>v+g.accessors[p.indices].count/3,0),0);assert.ok(triangles<=18000);
});

test('organic: five darker soil inserts change only material while retaining exact world triangle multiset',{skip:!organic},()=>{
 const expected=JSON.parse(fs.readFileSync(new URL('../recovery/v16-soil-triangle-snapshot.json',import.meta.url)));
 assert.deepEqual(soilTriangleSnapshot(scene),expected);
 const soil=g.materials.findIndex(m=>m.name==='botanical_v17_potting_soil');assert.ok(soil>=0);
 const primitives=g.meshes.flatMap(m=>m.primitives).filter(p=>p.material===soil);assert.equal(primitives.length,1);
 assert.equal(primitives.reduce((sum,p)=>sum+g.accessors[p.indices].count/3,0),1900);
 assert.equal(g.materials[soil].alphaMode||'OPAQUE','OPAQUE');
});
