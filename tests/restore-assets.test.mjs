import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const hash = b => crypto.createHash('sha256').update(b).digest('hex');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bearroom-assets-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'scripts'));
  fs.mkdirSync(path.join(root, 'source-assets/packed'), { recursive: true });
  fs.copyFileSync(new URL('../scripts/restore-assets.mjs', import.meta.url), path.join(root, 'scripts/restore-assets.mjs'));
  const bytes = Buffer.from('canonical exact binary\0payload');
  const parts = [bytes.subarray(0, 10), bytes.subarray(10)].map((b, i) => {
    const relative = `source-assets/packed/part${i}`;
    fs.writeFileSync(path.join(root, relative), b);
    return { path: relative, bytes: b.length, sha256: hash(b) };
  });
  const asset = { id: 'fixture', group: 'runtime', target: 'public/assets/model.gz', bytes: bytes.length, sha256: hash(bytes), parts };
  const save = () => fs.writeFileSync(path.join(root, 'source-assets/packed-manifest.json'), JSON.stringify({ assets: [asset] }));
  save();
  const run = (...args) => spawnSync(process.execPath, [path.join(root, 'scripts/restore-assets.mjs'), ...args], { encoding: 'utf8' });
  return { root, asset, bytes, save, run, output: path.join(root, asset.target) };
}
test('asset parts restore byte for byte and repeated restore is idempotent', t => {
  const f = fixture(t);
  assert.equal(f.run().status, 0);
  assert.deepEqual(fs.readFileSync(f.output), f.bytes);
  assert.equal(f.run().status, 0);
});
test('asset restore rejects corrupt parts before writing output', t => {
  const f = fixture(t);
  fs.writeFileSync(path.join(f.root, f.asset.parts[0].path), 'corrupt');
  assert.notEqual(f.run().status, 0);
  assert.equal(fs.existsSync(f.output), false);
});
test('asset restore preserves differing existing user output', t => {
  const f = fixture(t);
  fs.mkdirSync(path.dirname(f.output), { recursive: true });
  fs.writeFileSync(f.output, 'user edits');
  assert.notEqual(f.run().status, 0);
  assert.equal(fs.readFileSync(f.output, 'utf8'), 'user edits');
});
test('source assets are opt-in and unsafe targets are rejected', t => {
  const f = fixture(t);
  f.asset.group = 'source'; f.save();
  assert.equal(f.run().status, 0);
  assert.equal(fs.existsSync(f.output), false);
  assert.equal(f.run('--sources').status, 0);
  f.asset.target = '../escape'; f.save();
  assert.notEqual(f.run('--sources').status, 0);
});
