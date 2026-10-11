/** Stage model and genuinely corresponding baked GI together, verify, then install. */
import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';import assert from 'node:assert/strict';
import{ROOT,assetDirectory,checkAssetContract,parseGLB,sha256}from'./asset-contract.mjs';
const args=process.argv.slice(2);const value=flag=>{const i=args.indexOf(flag);return i<0?null:args[i+1]};
const model=value('--model'),giPath=value('--gi'),sourceSha=value('--source-sha');
if(!model||!giPath||!sourceSha)throw Error('Usage: node scripts/update-assets.mjs --model PATH.glb[.gz] --gi PATH/irradiance.json --source-sha FINAL_BLEND_SHA256');
assert.match(sourceSha,/^[a-f0-9]{64}$/,'Bake source SHA256 must identify actual frozen bake source');
const sourceBlend=value('--source-blend');if(sourceBlend)assert.equal(sha256(fs.readFileSync(sourceBlend)),sourceSha,'Frozen Blender source SHA mismatch');
const modelInput=fs.readFileSync(model);const {bytes}=parseGLB(modelInput);const gi=JSON.parse(fs.readFileSync(giPath));assert.equal(gi.sourceSha256,sourceSha,'GI JSON must already record the genuine bake source; this tool never relabels it');
const revision={bakeSourceSha256:sourceSha,modelSha256:sha256(bytes)};
const stage=path.join(ROOT,'.asset-stage');fs.rmSync(stage,{recursive:true,force:true});fs.cpSync(assetDirectory(),stage,{recursive:true});
fs.writeFileSync(path.join(stage,'bearroom.glb.gz'),modelInput[0]===31&&modelInput[1]===139?modelInput:zlib.gzipSync(bytes,{level:9,mtime:0}));fs.mkdirSync(path.join(stage,'baked-gi'),{recursive:true});fs.copyFileSync(giPath,path.join(stage,'baked-gi/irradiance.json'));
const report=checkAssetContract(stage,revision);
const target=assetDirectory();fs.copyFileSync(path.join(stage,'bearroom.glb.gz'),path.join(target,'bearroom.glb.gz'));fs.copyFileSync(path.join(stage,'baked-gi/irradiance.json'),path.join(target,'baked-gi/irradiance.json'));
fs.writeFileSync(path.join(ROOT,'src/asset-revision.js'),`/** Bake source revision identifies the source scene used for the actual indirect bake. */\nexport const ASSET_REVISION = Object.freeze(${JSON.stringify(revision,null,2)});\n`);
fs.rmSync(stage,{recursive:true,force:true});console.log('Installed matched assets. Run npm run verify before publication.\n'+JSON.stringify(report,null,2));
