/** Preserve exact v16 runtime mechanics while replacing the genuinely paired visual source. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {sha256} from './asset-contract.mjs';
const baseline=JSON.parse(fs.readFileSync(new URL('../recovery/v16-organic-runtime-preservation.json',import.meta.url)));
const checks=[];
for(const item of baseline.checks){
 const currentSha256=sha256(fs.readFileSync(new URL('../'+item.path,import.meta.url)));
 const unchanged=currentSha256===item.sha256;
 if(item.path!=='src/asset-revision.js')assert.ok(unchanged,item.path+' changed outside the organic asset scope');
 checks.push({...item,currentSha256,unchanged,...(!unchanged?{authorized:'Genuinely matched source/model identities only'}:{})});
}
const report={scope:'Exact v16 interaction, camera, navigation, lighting, PC, vendor, recovered source and slideshow bytes; only source/model asset revision changes.',passed:true,unchangedFiles:checks.filter(c=>c.unchanged).length,checks};
fs.writeFileSync(new URL('../docs/runtime-preservation-v17.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:true,unchangedFiles:report.unchangedFiles,allowedChanges:checks.filter(c=>!c.unchanged).map(c=>c.path)},null,2));
