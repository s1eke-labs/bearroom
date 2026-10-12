import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import zlib from 'node:zlib';import crypto from 'node:crypto';import{transform}from'esbuild';import{parseAst}from'rollup/parseAst';
const provenance=JSON.parse(fs.readFileSync(new URL('../recovery/provenance.json',import.meta.url)));
const original=zlib.gunzipSync(fs.readFileSync(new URL('../recovery/v11-production.js.gz',import.meta.url)));
const formatted=(await transform(original.toString(),{minify:false,format:'esm',target:'es2022',charset:'utf8'})).code;
const fullAst=parseAst(formatted);
const starts=[['polyfill',0],['vendor',fullAst.body[1].start],['camera',formatted.indexOf('const Px =')],['domain',formatted.indexOf('const Bx =')],['audio',formatted.indexOf('class Hx {')],['lighting',formatted.indexOf('const Vx =')],['performance',formatted.indexOf('class qx {')],['plush',formatted.indexOf('const Jn =')],['baked-gi',formatted.indexOf('const Io =')],['main',formatted.indexOf('const Ge =')]];
function clean(n){if(Array.isArray(n))return n.map(clean);if(!n||typeof n!=='object')return n;return Object.fromEntries(Object.entries(n).filter(([k])=>!['start','end','loc','raw'].includes(k)).map(([k,v])=>[k,clean(v)]))}
// This finite patch list is the whole allowed v13 light/sky hook deviation. Apply it to
// the frozen original before comparing ASTs; never discard changed AST branches.
// Any other literal, operation, source count, shadow setting or control still fails.
const reviewedLightingChanges={
 lighting:[
  ['desk: { fallback:', 'desk: { color: "#ffe9d5", fallback:'],
  ['bed: { fallback:', 'bed: { color: "#ffdfbb", fallback:'],
  ['reading: { fallback:', 'reading: { color: "#ffdfbb", fallback:'],
  ['bath: { fallback:', 'bath: { color: "#fff0dd", fallback:'],
  ['moon: 0.32 * (1 - t)', 'moon: 0.18 * (1 - t)'],
 ],
 main:[
  ['new nl("#fff2df", 0)', 'new nl("#fff0df", 0)'],
  ['It.position.set(7, 9, 2)', 'It.position.set(7, 6.4, 2)'],
  ['lv(i, n, e.power, "#ffe7cc", e.distance, !!e.shadow, r)', 'lv(i, n, e.power, e.color || "#ffe7cc", e.distance, !!e.shadow, r)'],
 ],
 'baked-gi':[
  ['return i;\n}\nfunction ev(i)', 'return validateSkyTransport(i);\n}\nfunction ev(i)'],
  ['const l = i.states[a];', 'const l = combinedRadiance(i, a);'],
 ],
};
const reviewedFirstPersonHooks=JSON.parse(fs.readFileSync(new URL('../recovery/first-person-hooks.json',import.meta.url)));
const reviewedPcCaseHooks=JSON.parse(fs.readFileSync(new URL('../recovery/pc-case-hooks.json',import.meta.url)));
const reviewedFirstSwitchHooks=JSON.parse(fs.readFileSync(new URL('../recovery/first-switch-hooks.json',import.meta.url)));
const reviewedRoomInteractionHooks=JSON.parse(fs.readFileSync(new URL('../recovery/room-interaction-hooks.json',import.meta.url)));
const reviewedStartupHooks=JSON.parse(fs.readFileSync(new URL('../recovery/startup-optimization-hooks.json',import.meta.url)));
const reviewedSeatedBearHooks=JSON.parse(fs.readFileSync(new URL('../recovery/seated-bear-hooks.json',import.meta.url)));
const reviewedBoundedOrbitHooks=JSON.parse(fs.readFileSync(new URL('../recovery/bounded-orbit-hooks.json',import.meta.url)));
const reviewedCuratedPresetHooks=JSON.parse(fs.readFileSync(new URL('../recovery/curated-preset-hooks.json',import.meta.url)));
const reviewedAxialPresetHooks=JSON.parse(fs.readFileSync(new URL('../recovery/axial-preset-hooks.json',import.meta.url)));
const reviewedLoadingProgressHooks=JSON.parse(fs.readFileSync(new URL('../recovery/loading-progress-hooks.json',import.meta.url)));
const reviewedHomeUIHooks=JSON.parse(fs.readFileSync(new URL('../recovery/home-ui-hooks.json',import.meta.url)));
function expectedSource(name,source){for(const[before,after]of reviewedLightingChanges[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed lighting patch must match exactly once`);source=source.replace(before,after)}for(const[before,after]of reviewedFirstPersonHooks[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed first-person hook must match exactly once`);source=source.replace(before,after)}for(const[before,after]of reviewedPcCaseHooks[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed PC hook must match exactly once`);source=source.replace(before,after)}for(const[before,after]of reviewedFirstSwitchHooks[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed first-switch hook must match exactly once`);source=source.replace(before,after)}for(const[before,after]of reviewedRoomInteractionHooks[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed room-interaction hook must match exactly once`);source=source.replace(before,after)}for(const[before,after]of reviewedStartupHooks[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed startup hook must match exactly once`);source=source.replace(before,after)}for(const[before,after]of reviewedSeatedBearHooks[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed seated-bear hook must match exactly once`);source=source.replace(before,after)}for(const[before,after]of reviewedBoundedOrbitHooks[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed bounded-orbit hook must match exactly once`);source=source.replace(before,after)}for(const[before,after]of reviewedCuratedPresetHooks[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed curated-preset hook must match exactly once`);source=source.replace(before,after)}for(const[before,after]of reviewedAxialPresetHooks[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed axial-preset hook must match exactly once`);source=source.replace(before,after)}for(const[before,after]of reviewedLoadingProgressHooks[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed loading-progress hook must match exactly once`);source=source.replace(before,after)}for(const[before,after]of reviewedHomeUIHooks[name]||[]){assert.equal(source.split(before).length-1,1,`${name}: reviewed home UI hook must match exactly once`);source=source.replace(before,after)}return source}
test('recovery checkpoint is the exact authoritative v11 bundle',()=>assert.equal(crypto.createHash('sha256').update(original).digest('hex'),provenance.recoveredFrom.bundleSha256));
for(let i=0;i<starts.length;i++){
 const[name,start]=starts[i];const originalBody=parseAst(expectedSource(name,formatted.slice(start,starts[i+1]?.[1]??formatted.length))).body;
 test(`${name}: app/vendor algorithms match v11${reviewedLightingChanges[name]?' plus exact reviewed light/sky hooks':''}`,()=>{
   const filename=name==='vendor'?'vendor/runtime-v11.js':`src/${name}.js`;
   const actual=parseAst(fs.readFileSync(new URL('../'+filename,import.meta.url),'utf8')).body.filter(n=>!['ImportDeclaration','ExportNamedDeclaration'].includes(n.type));
   if(name==='domain'){const at=actual.findIndex(n=>n.type==='VariableDeclaration'&&n.declarations[0]?.id.name==='FURNITURE');actual[at]={type:'ExpressionStatement',expression:actual[at].declarations[0].init};}
   if(name==='baked-gi'){const at=actual.findIndex(n=>n.type==='VariableDeclaration'&&n.declarations[0]?.id.name==='Io');actual[at].declarations[0].init=originalBody[0].declarations[0].init;}
   assert.deepEqual(clean(actual),clean(originalBody));
 });
}

test('recovered module bindings match baseline except documented revision and sewn-plush hooks',()=>{
 for(const module of provenance.modules){
  const filename=module.name==='vendor'?'vendor/runtime-v11.js':`src/${module.name}.js`;
  const actual=parseAst(fs.readFileSync(new URL('../'+filename,import.meta.url),'utf8')).body.filter(n=>n.type==='ImportDeclaration').map(n=>({source:n.source.value,names:n.specifiers.map(s=>s.imported?.name||s.local.name)}));
  const expected=module.imports.map(i=>({source:i.from==='vendor'?'../vendor/runtime-v11.js':`./${module.name==='main'&&i.from==='plush'?'plush-current':i.from}.js`,names:i.names}));
  if(module.name==='main'){expected.unshift({source:'./polyfill.js',names:[]},{source:'./style.css',names:[]});expected.push({source:'./first-person.js',names:['FirstPersonController']},{source:'./pc-case.js',names:['PcCaseController','PC_CASE_CONFIG']},{source:'./first-switch-preparation.js',names:['prepareFirstSwitch','preparationFrame']},{source:'./room-interactions.js',names:['RoomInteractions','roomHitIsVisible','sceneTapEndsOnCanvas']},{source:'./asset-loading.js',names:['fetchUint8Array','decodeGzip','createPhaseTimings']},{source:'./load-resources.js',names:['LoadResources']},{source:'./loading-progress.js',names:['createLoadingProgress','loadingPresentation']},{source:'./orbit-input.js',names:['cancelOrbitGesture']},{source:'./asset-revision.js',names:['ASSET_REVISION']});}
  if(module.name==='camera')expected.push({source:'./orbit-input.js',names:['cancelOrbitGesture']},{source:'./camera-presets.js',names:['CAMERA_LIMITS','CAMERA_PRESETS','DEFAULT_CAMERA_PRESET','PRESET_TRANSITION_MS','getCameraPreset']});
  if(module.name==='baked-gi')expected.unshift({source:'./asset-revision.js',names:['ASSET_REVISION']},{source:'./sky-transport.js',names:['validateSkyTransport','combinedRadiance']});
  assert.deepEqual(actual,expected,module.name);
 }
});
