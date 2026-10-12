/** Execute the actual fixture-creation function; no rendering claims. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parseAst} from 'rollup/parseAst';
import {LIGHTS} from '../src/lighting.js';
const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const node=parseAst(source).body.find(n=>n.type==='FunctionDeclaration'&&n.id.name==='cv');
test('seated bear keeps the original living light target instead of moving other room illumination',()=>{
 const calls=[];
 const sandbox={Vx:LIGHTS,wi:new Map([['Bear_reference_plush',{changedSeatedBounds:true}]]),L:class {constructor(...v){this.v=v}},Kt:class {setFromObject(){throw Error('Living target must not follow changed bear bounds')}},lv(...args){calls.push(args)}};
 vm.runInNewContext(source.slice(node.start,node.end)+';cv();',sandbox);
 assert.equal(calls.length,Object.keys(LIGHTS).length);
 for(const [name,position,power,color,distance,shadow,target]of calls){
  const spec=LIGHTS[name];assert.deepEqual(position.v,spec.fallback);assert.equal(power,spec.power);assert.equal(color,spec.color||'#ffe7cc');assert.equal(distance,spec.distance);assert.equal(shadow,!!spec.shadow);
  if(name==='living')assert.deepEqual(Array.from(target),[-0.9424259662628174,0.9112450480461121,1.8003298044204712]);else assert.equal(target,null);
 }
});
