import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const b=fs.readFileSync(new URL('../public/assets/bearroom.glb',import.meta.url));
const g=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());
test('portable PBR: distinct upholstery, plush, linen, rug, wood and embroidery carry real image maps',()=>{
 for(const name of ['fabric_bear','fabric_sofa_boucle','fabric_ivory_linen','fabric_rug_loop_pile','fabric_blush','embroidery_ink','wood_oak','wood_honey','piano_spruce_soundboard']){
  const m=g.materials.find(m=>m.name===name); assert.ok(m,name);
  assert.ok(m.normalTexture,`${name}: tangent-space normal missing`);
  assert.ok(m.pbrMetallicRoughness.baseColorTexture,`${name}: albedo missing`);
  assert.ok(m.pbrMetallicRoughness.metallicRoughnessTexture,`${name}: roughness missing`);
 }
 assert.ok(g.images.length>=12,'embedded material images');
 assert.ok(g.images.every(i=>Number.isInteger(i.bufferView)),'images embedded in GLB');
});
test('hard rose keycaps and matte plaster are separated from cloth and ceramics',()=>{
 for(const name of ['polymer_dusty_rose','plaster_warm_white','ceramic_ivory','lacquer_pearl']) assert.ok(g.materials.some(m=>m.name===name),name);
 const plaster=g.materials.find(m=>m.name==='plaster_warm_white');
 assert.ok(plaster.pbrMetallicRoughness.roughnessFactor>.85);
});
test('glTF preserves reference albedo tints instead of exporting white textures',()=>{
 const oak=g.materials.find(m=>m.name==='wood_oak').pbrMetallicRoughness.baseColorFactor;
 const rose=g.materials.find(m=>m.name==='fabric_blush').pbrMetallicRoughness.baseColorFactor;
 assert.ok(oak && oak[0]>oak[1] && oak[1]>oak[2], 'warm oak factor survives export');
 assert.ok(rose && rose[0]>rose[1] && rose[1]>rose[2], 'dusty rose factor survives export');
});
