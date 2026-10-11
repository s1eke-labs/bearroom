import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { PIANO_KEYS, FURNITURE } from "../src/domain.js";
const files = [];
function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) scan(p);
    else {
      const b = fs.readFileSync(p);
      files.push({
        file: p,
        bytes: b.length,
        sha256: crypto.createHash("sha256").update(b).digest("hex"),
      });
    }
  }
}
scan("public/assets");
fs.mkdirSync("delivery", { recursive: true });
fs.writeFileSync(
  "delivery/runtime-manifest.json",
  JSON.stringify(
    {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      files,
      totalBytes: files.reduce((s, f) => s + f.bytes, 0),
      furniture: FURNITURE,
      keys: PIANO_KEYS.map((k) => ({
        ...k,
        mapping: "程序测试",
        directMobileTap: "未验证",
      })),
      claims: {
        physicalMobile: "未验证",
        sourceGeometry: "Blender",
        referenceImagesAreRuntimeProof: false,
      },
    },
    null,
    2,
  ),
);
