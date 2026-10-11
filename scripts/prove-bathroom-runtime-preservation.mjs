/** Verify the approved runtime delta against the exact v18 production baseline. */
import fs from 'node:fs';import assert from 'node:assert/strict';
import{sha256,ROOT}from'./asset-contract.mjs';
const baseline=JSON.parse(fs.readFileSync(new URL('../recovery/v18-runtime-preservation.json',import.meta.url)));
const allowed={
 'src/asset-revision.js':'Genuinely matched frozen v19 source and canonical model identities',
 'src/main.js':'One shared fixed-view tap router; loading/walking/UI guards and current help text',
 'src/first-person.js':'Share persistent door/navigation state across fixed and walking views',
 'src/walk-navigation.js':'Shared door state and safe open/close player sweep checks',
 'src/pc-case.js':'Direct-click toggle for the existing nine fan rotors and their RGB, leaving display unchanged',
};
const checks=baseline.checks.map(old=>{
 const currentSha256=sha256(fs.readFileSync(new URL('../'+old.path,import.meta.url))),unchanged=currentSha256===old.sha256;
 assert.ok(unchanged||allowed[old.path],old.path+' changed outside the current request');
 return{...old,currentSha256,unchanged,...(!unchanged?{authorizedChange:allowed[old.path]}:{})};
});
const original=new Set(baseline.checks.map(c=>c.path)),added=fs.readdirSync(ROOT+'/src').map(n=>'src/'+n).filter(p=>!original.has(p));assert.deepEqual(added,['src/room-interactions.js']);
const report={passed:true,baselineProductionCommit:baseline.productionCommit,scope:'Only three requested click behaviors and shared door safety/state. Original camera, lighting, GI shader, all other animations, vendor code, recovery files and v18 first-switch preparation remain byte-identical. Asset-source pairing is the only asset-revision change.',unchangedFiles:checks.filter(c=>c.unchanged).length,changedFiles:checks.filter(c=>!c.unchanged).length,addedFiles:added.map(path=>({path,sha256:sha256(fs.readFileSync(ROOT+'/'+path)),purpose:'Shared door/PC/keyboard interaction dispatcher and visual key spring feedback; no text entry, audio, telemetry or network action'})),checks};
fs.writeFileSync(ROOT+'/docs/runtime-preservation-v19.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,unchangedFiles:report.unchangedFiles,changedFiles:report.changedFiles,added},null,2));
