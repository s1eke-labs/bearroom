import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { spawnSync } from 'node:child_process';

const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bearroom-pack-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const dir of ['scripts', 'src', 'public/assets', 'source-assets/packed']) fs.mkdirSync(path.join(root, dir), { recursive: true });
  fs.writeFileSync(path.join(root, 'package.json'), '{"type":"module"}');
  fs.copyFileSync(new URL('../scripts/pack-runtime-model.mjs', import.meta.url), path.join(root, 'scripts/pack-runtime-model.mjs'));
  fs.copyFileSync(new URL('../scripts/restore-assets.mjs', import.meta.url), path.join(root, 'scripts/restore-assets.mjs'));
  const decoded = Buffer.alloc(12);
  decoded.writeUInt32LE(0x46546c67, 0); decoded.writeUInt32LE(2, 4); decoded.writeUInt32LE(12, 8);
  const packed = zlib.gzipSync(decoded);
  fs.writeFileSync(path.join(root, 'src/asset-revision.js'), `export const ASSET_REVISION = { modelSha256: '${hash(decoded)}' };`);
  const model = path.join(root, 'public/assets/bearroom.glb.gz');
  fs.writeFileSync(model, packed);
  const oldPath = 'source-assets/packed/runtime-model.part01';
  fs.writeFileSync(path.join(root, oldPath), 'old runtime');
  const source = { id: 'source', group: 'source', target: 'source-assets/master.blend', bytes: 6, sha256: hash('source'), parts: [{ path: 'source-assets/packed/master.part01', bytes: 6, sha256: hash('source') }] };
  fs.writeFileSync(path.join(root, source.parts[0].path), 'source');
  const manifest = path.join(root, 'source-assets/packed-manifest.json');
  fs.writeFileSync(manifest, JSON.stringify({ schemaVersion: 1, assets: [{ id: 'runtime-model', group: 'runtime', target: 'public/assets/bearroom.glb.gz', parts: [{ path: oldPath }] }, source] }));
  const run = (...args) => spawnSync(process.execPath, [path.join(root, 'scripts/pack-runtime-model.mjs'), ...args], { encoding: 'utf8' });
  return { root, model, packed, source, manifest, oldPath, run };
}
test('packing validates read-only by default, preserves sources and restores exact runtime bytes', t => {
  const f = fixture(t);
  const original = fs.readFileSync(f.manifest);
  assert.equal(f.run().status, 0);
  assert.deepEqual(fs.readFileSync(f.manifest), original);
  assert.equal(f.run('--write').status, 0);
  const manifest = JSON.parse(fs.readFileSync(f.manifest));
  assert.deepEqual(manifest.assets[1], f.source);
  assert.equal(fs.readFileSync(path.join(f.root, f.source.parts[0].path), 'utf8'), 'source');
  assert.deepEqual(fs.readFileSync(f.model), f.packed);
  assert.equal(fs.existsSync(path.join(f.root, f.oldPath)), false);
  assert.equal(f.run('--write').status, 0);
  fs.unlinkSync(f.model);
  const restored = spawnSync(process.execPath, [path.join(f.root, 'scripts/restore-assets.mjs')]);
  assert.equal(restored.status, 0);
  assert.deepEqual(fs.readFileSync(f.model), f.packed);
});
test('packing rejects an unpaired model before changing manifest or parts', t => {
  const f = fixture(t);
  const original = fs.readFileSync(f.manifest);
  fs.writeFileSync(f.model, zlib.gzipSync(Buffer.from('unapproved model')));
  assert.notEqual(f.run('--write').status, 0);
  assert.deepEqual(fs.readFileSync(f.manifest), original);
  assert.deepEqual(fs.readdirSync(path.join(f.root, 'source-assets/packed')).sort(), ['master.part01', 'runtime-model.part01']);
});
