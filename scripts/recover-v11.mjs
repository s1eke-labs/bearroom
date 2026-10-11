/** One-time recovery utility. Re-running replaces recovered modules; do not run after editing them. */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseAst } from 'rollup/parseAst';
import { transform } from 'esbuild';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const input=process.argv[2];
if(!input) throw Error('Pass the authoritative v11 production bundle path. This overwrites recovered source.');
const original=fs.readFileSync(input);
const formatted=(await transform(original.toString(),{minify:false,format:'esm',target:'es2022',charset:'utf8'})).code;
const ast=parseAst(formatted);
const starts=[['polyfill',0],['vendor',ast.body[1].start],['camera',formatted.indexOf('const Px =')],['domain',formatted.indexOf('const Bx =')],['audio',formatted.indexOf('class Hx {')],['lighting',formatted.indexOf('const Vx =')],['performance',formatted.indexOf('class qx {')],['plush',formatted.indexOf('const Jn =')],['baked-gi',formatted.indexOf('const Io =')],['main',formatted.indexOf('const Ge =')]];
if(starts.some(([,s])=>s<0))throw Error('Bundle boundary not found');
function names(body) {return body.flatMap(n=>n.id?.name?[n.id.name]:(n.declarations||[]).map(d=>d.id.name).filter(Boolean))}
function identifiers(node,set=new Set()) {
  if(!node||typeof node!=='object')return set;
  if(node.type==='Identifier')set.add(node.name);
  for(const [key,val] of Object.entries(node)) {
    if(key==='parent')continue;
    if(key==='property' && node.type==='MemberExpression' && !node.computed)continue;
    if(key==='key' && ['Property','MethodDefinition','PropertyDefinition'].includes(node.type) && !node.computed && !node.shorthand)continue;
    if(Array.isArray(val))val.forEach(n=>identifiers(n,set));
    else if(val&&typeof val==='object')identifiers(val,set);
  }
  return set;
}
const chunks=starts.map(([name,start],i)=>{const end=starts[i+1]?.[1]??formatted.length;const code=formatted.slice(start,end).trim()+'\n'; const parsed=parseAst(code);return{name,code,names:names(parsed.body),refs:identifiers(parsed),exports:new Set(),imports:[],hash:crypto.createHash('sha256').update(code).digest('hex')}});
for(const c of chunks)for(const other of chunks){if(other===c||other.name==='main')continue; const deps=other.names.filter(n=>c.refs.has(n)&&!c.names.includes(n));if(deps.length){c.imports.push({from:other.name,names:deps});deps.forEach(n=>other.exports.add(n))}}
// Additional descriptive public exports support focused Node tests without starting the browser app.
const publicExports={camera:{Ox:'IsometricRoom',Ix:'configureControls',Do:'isWorldVisible',Dx:'isClipped',jh:'isPrimaryBear'},domain:{Bx:'PIANO_KEYS',kx:'isTap',zx:'slideState'},audio:{Hx:'PianoAudio'},lighting:{Vx:'LIGHTS',Xx:'lightingState',Wx:'lampTarget'},performance:{qx:'FrameTimeBuffer',Yx:'prepareCloth',jx:'updateCloth',Kx:'freezeTransforms',Na:'updateAnimatedTransform'},plush:{Qx:'PlushAppearance',Jn:'VELVET_CONFIG',Jx:'plushDetailVisible',Gc:'makeVelvetMaterial'},'baked-gi':{Zh:'validateIrradiance',ev:'packIrradiance',iv:'patchBakedShader',sv:'applyBakedGI',Io:'BAKE_SOURCE_REVISION'}};
for(const c of chunks){
  const imports=c.imports.map(d=>`import { ${d.names.join(', ')} } from '${d.from==='vendor'?'../vendor/runtime-v11.js':`./${d.from}.js`}';`).join('\n');
  const aliases=Object.entries(publicExports[c.name]||{}).map(([n,a])=>`${n} as ${a}`);
  const exports=[...c.exports,...aliases];
  let code=c.code;
  if(c.name==='domain')code=code.replace('\n[[','\nconst FURNITURE = [['),exports.push('FURNITURE');
  if(c.name==='baked-gi')code=code.replace(/const Io = "[a-f0-9]{64}";/,'const Io = ASSET_REVISION.bakeSourceSha256;');
  const banner=`/** Recovered from production v11. Minifier aliases are retained deliberately; this is not the lost original source.\n * Exact pre-recovery segment SHA256: ${c.hash}\n */\n`;
  const pre=c.name==='main'?"import './polyfill.js';\nimport './style.css';\n":c.name==='baked-gi'?"import { ASSET_REVISION } from './asset-revision.js';\n":'';
  const dest=c.name==='vendor'?path.join(root,'vendor/runtime-v11.js'):path.join(root,`src/${c.name}.js`);
  fs.writeFileSync(dest,banner+pre+imports+'\n'+code+(exports.length?`\nexport { ${exports.join(', ')} };\n`:''));
}
const manifest={recoveredFrom:{siteCommit:'679d19306992b8a895dab5c47da0a8aad0f86e4d',bundle:'index-BQLhr10c.js',bundleSha256:crypto.createHash('sha256').update(original).digest('hex')},toolVersions:{esbuild:'0.28.2',rollup:'4.64.2'},modules:chunks.map(({name,hash,imports})=>({name,preRecoverySegmentSha256:hash,imports})),limitations:['Original pre-bundle sources and source maps were not present in the recovered workspace.','Module variable aliases are recovered minifier aliases, not original author names.','Vendor code is preserved from the deployed build to avoid a dependency-version regression.']};
fs.mkdirSync(path.join(root,'recovery'),{recursive:true});
fs.writeFileSync(path.join(root,'recovery/provenance.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(root,'recovery/v11-production.js.gz'),zlib.gzipSync(original));
console.log(JSON.stringify(manifest,null,2));
