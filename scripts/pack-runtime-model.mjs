/** Explicit, lossless repacking after update-assets.mjs. Never edits the model or source assets. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { ASSET_REVISION } from '../src/asset-revision.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const manifestPath = path.join(root, 'source-assets/packed-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const index = manifest.assets.findIndex(asset => asset.id === 'runtime-model');
assert.equal(manifest.assets.filter(asset => asset.id === 'runtime-model').length, 1, 'Expected exactly one runtime-model entry');
const previous = manifest.assets[index];
assert.equal(previous.group, 'runtime');
assert.equal(previous.target, 'public/assets/bearroom.glb.gz');
const packed = fs.readFileSync(path.join(root, previous.target));
assert.equal(packed[0], 31, 'Expected gzip model');
assert.equal(packed[1], 139, 'Expected gzip model');
const decoded = zlib.gunzipSync(packed);
assert.equal(hash(decoded), ASSET_REVISION.modelSha256, 'Model differs from src/asset-revision.js; install a matched model/GI pair first');
assert.equal(decoded.readUInt32LE(0), 0x46546c67, 'Expected GLB');
assert.equal(decoded.readUInt32LE(4), 2, 'Expected GLB version 2');
assert.equal(decoded.readUInt32LE(8), decoded.length, 'GLB length mismatch');
assert.ok(process.argv.slice(2).every(arg => arg === '--write'), 'Usage: node scripts/pack-runtime-model.mjs [--write]');
const sha256 = hash(packed);
const parts = [];
for (let offset = 0; offset < packed.length; offset += 8 * 1024 * 1024) {
  const bytes = packed.subarray(offset, offset + 8 * 1024 * 1024);
  parts.push({ path: `source-assets/packed/runtime-model-${sha256}.part${String(parts.length + 1).padStart(2, '0')}`, bytes: bytes.length, sha256: hash(bytes) });
}
if (!process.argv.includes('--write')) {
  console.log(`Validated ${packed.length} bytes; ${parts.length} lossless parts. Pass --write to update runtime parts and manifest.`);
} else {
  // Content-addressed names keep the old manifest usable until the atomic switch.
  fs.mkdirSync(path.join(root, 'source-assets/packed'), { recursive: true });
  let offset = 0;
  for (const part of parts) {
    const target = path.join(root, part.path);
    const bytes = packed.subarray(offset, offset + part.bytes);
    if (fs.existsSync(target)) assert.equal(hash(fs.readFileSync(target)), part.sha256, `Existing part is corrupt: ${part.path}`);
    else fs.writeFileSync(target, bytes, { flag: 'wx' });
    offset += part.bytes;
  }
  manifest.assets[index] = { ...previous, bytes: packed.length, sha256, parts };
  const temporary = `${manifestPath}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  fs.renameSync(temporary, manifestPath);
  // Remove only former runtime parts, never paths referenced by another asset.
  const retained = new Set(manifest.assets.flatMap(asset => asset.parts.map(part => part.path)));
  for (const part of previous.parts) {
    if (!retained.has(part.path) && /^source-assets\/packed\/runtime-model(?:-[a-f0-9]{64})?\.part\d+$/.test(part.path)) {
      fs.rmSync(path.join(root, part.path), { force: true });
    }
  }
  console.log(`Packed runtime model losslessly: ${sha256}. Review and commit packed parts, manifest, paired GI and asset revision together.`);
}
