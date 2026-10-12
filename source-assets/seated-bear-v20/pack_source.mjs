/** Preserve the new editable master without altering the original v19 bake source. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {ROOT,sha256} from '../../scripts/asset-contract.mjs';
const [input,expected]=process.argv.slice(2);
assert.ok(input&&/^[a-f0-9]{64}$/.test(expected),'Usage: node pack_source.mjs SOURCE.blend EXPECTED_SHA256');
const bytes=fs.readFileSync(input);assert.equal(sha256(bytes),expected,'Frozen master identity differs');
const file=path.join(ROOT,'source-assets/packed-manifest.json'),manifest=JSON.parse(fs.readFileSync(file));
assert.ok(!manifest.assets.some(a=>a.id==='blender-seated-v20'),'Master already packaged; use a new revision for future edits');
const parts=[];
for(let start=0;start<bytes.length;start+=8*1024*1024){const data=bytes.subarray(start,start+8*1024*1024),relative=`source-assets/packed/blender-seated-v20-${expected}.part${String(parts.length+1).padStart(2,'0')}`,target=path.join(ROOT,relative);if(fs.existsSync(target))assert.equal(sha256(fs.readFileSync(target)),sha256(data));else fs.writeFileSync(target,data,{flag:'wx'});parts.push({path:relative,bytes:data.length,sha256:sha256(data)});}
manifest.assets.push({id:'blender-seated-v20',group:'source',target:'source-assets/bearroom-seated-v20.blend',bytes:bytes.length,sha256:expected,parts});
const temporary=file+'.'+process.pid+'.tmp';fs.writeFileSync(temporary,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});fs.renameSync(temporary,file);
console.log(JSON.stringify({source:expected,bytes:bytes.length,parts:parts.length}));
