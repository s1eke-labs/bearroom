import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {ROOT,checkAssetContract}from'./asset-contract.mjs';
const report=checkAssetContract(path.join(ROOT,'dist/assets'));const html=fs.readFileSync(path.join(ROOT,'dist/index.html'),'utf8');
assert.ok(!html.includes('__RUNTIME_'));
for(const [,url]of html.matchAll(/(?:src|href)="(\/(?:assets\/[^\"]+|favicon\.svg))"/g))assert.ok(fs.existsSync(path.join(ROOT,'dist',url)),url);
for(const view of ['overview','lower','upper','bear','piano'])assert.ok(html.includes(`data-view="${view}"`));
console.log('Distribution verified:',JSON.stringify(report));
