import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";

const source = "source-assets/bearroom.glb.br";
const model = "public/assets/bearroom.glb";
const target = "public/assets/bearroom.glb.gz";
const expectedSha256 = "b8bfc48bc6bb5bfa0678b99e01def6892a0febd725d46f5641b7d46f9fcd725c";
const raw = zlib.brotliDecompressSync(fs.readFileSync(source));
const sha256 = crypto.createHash("sha256").update(raw).digest("hex");
if (sha256 !== expectedSha256)
  throw Error("Canonical model SHA-256 verification failed");
const compressed = zlib.gzipSync(raw, { level: 9 });
if (!zlib.gunzipSync(compressed).equals(raw))
  throw Error("Lossless gzip verification failed");
fs.mkdirSync(path.dirname(model), { recursive: true });
fs.writeFileSync(model, raw);
fs.writeFileSync(target, compressed);
const report = {
  method: "Brotli source decoded and SHA-256 verified; gzip level9; original GLB reconstructed byte for byte",
  canonicalSource: source,
  sourceBytes: raw.length,
  transferredModelBytes: compressed.length,
  sha256,
  geometryChanged: false,
};
fs.mkdirSync("delivery", { recursive: true });
fs.writeFileSync(
  "delivery/compression-report.json",
  JSON.stringify(report, null, 2),
);
console.log(report);
