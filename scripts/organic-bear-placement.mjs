/** Explicit, finite whole-bear placement allowance. Local geometry/materials are never exempt. */
import fs from'node:fs';
import assert from'node:assert/strict';
const location=new URL('../recovery/organic-v17-bear-placement.json',import.meta.url);
export const bearPlacement=fs.existsSync(location)?JSON.parse(fs.readFileSync(location)):null;
const baseline=JSON.parse(fs.readFileSync(new URL('../recovery/v16-model-node-snapshot.json',import.meta.url)));
const parents=new Map(baseline.nodes.map(n=>[n.name,n.parent]));
export function isRigidMainBearNode(name){for(let n=name;n;n=parents.get(n))if(n==='Bear_reference_plush')return true;return false;}
export function applyMatrixToWorld(delta,matrix){const out=new Array(16).fill(0);for(let column=0;column<4;column++)for(let row=0;row<4;row++)for(let k=0;k<4;k++)out[column*4+row]+=delta[k*4+row]*matrix[column*4+k];return out;}
export function expectedBearWorld(name,original,active=true){
 if(!active||!bearPlacement||!isRigidMainBearNode(name))return original;
 assert.equal(bearPlacement.root,'Bear_reference_plush');assert.equal(bearPlacement.baselineModelSha256,baseline.modelSha256);
 const d=bearPlacement.runtimeWorldDelta;assert.equal(d.length,16);assert.ok(d.every(Number.isFinite));
 assert.ok(Math.abs(d[3])+Math.abs(d[7])+Math.abs(d[11])+Math.abs(d[15]-1)<1e-7);
 for(let i=0;i<3;i++)for(let j=0;j<3;j++){let dot=0;for(let k=0;k<3;k++)dot+=d[i*4+k]*d[j*4+k];assert.ok(Math.abs(dot-(i===j?1:0))<1e-6,'Whole-bear delta must be rigid');}
 const determinant=d[0]*(d[5]*d[10]-d[9]*d[6])-d[4]*(d[1]*d[10]-d[9]*d[2])+d[8]*(d[1]*d[6]-d[5]*d[2]);assert.ok(Math.abs(determinant-1)<1e-6,'No mirror or scale in bear placement');
 return applyMatrixToWorld(d,original);
}

const rockerLocation=new URL('../recovery/organic-v17-rocker-placement.json',import.meta.url);
export const rockerPlacement=fs.existsSync(rockerLocation)?JSON.parse(fs.readFileSync(rockerLocation)):null;
export function isRigidRockerNode(name){for(let n=name;n;n=parents.get(n))if(n==='F16_reading_rocker')return true;return false;}
export function expectedProtectedWorld(name,original,active=true){
 const bear=expectedBearWorld(name,original,active);
 if(!active||!rockerPlacement||!isRigidRockerNode(name))return bear;
 assert.equal(rockerPlacement.root,'F16_reading_rocker');assert.equal(rockerPlacement.baselineModelSha256,baseline.modelSha256);
 assert.deepEqual(rockerPlacement.runtimeWorldDelta,[1,0,0,0,0,1,0,0,0,0,1,0,0,-.022,0,1],'Rocker allowance is exactly a22mm downward translation');
 return applyMatrixToWorld(rockerPlacement.runtimeWorldDelta,bear);
}
