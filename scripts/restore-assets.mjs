import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'source-assets/packed-manifest.json'), 'utf8'));
const includeSources = process.argv.includes('--sources');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const localPath = relative => {
  const full = path.resolve(root, relative);
  if (!full.startsWith(root + path.sep)) throw new Error('Asset path escapes the project');
  return full;
};
for (const asset of manifest.assets) {
  if (asset.group !== 'runtime' && !includeSources) continue;
  const target = localPath(asset.target);
  if (fs.existsSync(target)) {
    const existing = fs.readFileSync(target);
    if (existing.length === asset.bytes && sha256(existing) === asset.sha256) continue;
    throw new Error(`Existing asset differs from the canonical version: ${asset.target}. Preserve your edits and move it aside before restoring.`);
  }
  const parts = asset.parts.map(part => {
    const bytes = fs.readFileSync(localPath(part.path));
    if (bytes.length !== part.bytes || sha256(bytes) !== part.sha256) throw new Error(`Corrupt asset part: ${part.path}`);
    return bytes;
  });
  const bytes = Buffer.concat(parts);
  if (bytes.length !== asset.bytes || sha256(bytes) !== asset.sha256) throw new Error(`Asset integrity check failed: ${asset.id}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes, { flag: 'wx' });
  console.log(`Restored and SHA-256 verified: ${asset.target} (${bytes.length} bytes)`);
}
