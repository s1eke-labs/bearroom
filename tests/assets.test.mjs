import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { PIANO_KEYS, FURNITURE } from "../src/domain.js";
const path = new URL("../public/assets/bearroom.glb", import.meta.url);
function gltf() {
  const b = fs.readFileSync(path);
  assert.equal(b.readUInt32LE(0), 0x46546c67);
  assert.equal(b.readUInt32LE(4), 2);
  const length = b.readUInt32LE(12);
  return JSON.parse(
    b
      .subarray(20, 20 + length)
      .toString()
      .trim(),
  );
}
test("production has actual GLB independent keys and all furniture roots", () => {
  const g = gltf();
  const names = g.nodes.map((n) => n.name);
  for (const k of PIANO_KEYS) assert.ok(names.includes(k.node), k.node);
  for (const f of FURNITURE)
    assert.ok(
      names.some((n) => n === f.id || n.startsWith(f.id + "_")),
      f.id,
    );
  assert.equal(names.filter((n) => /^piano_key_\d{3}$/.test(n)).length, 88);
});
test("all thirteen unique generated runtime textures exist", () => {
  const bytes = [];
  for (const [prefix, count] of [
    ["pc", 6],
    ["tv", 4],
    ["frame", 3],
  ])
    for (let i = 1; i <= count; i++) {
      const b = fs.readFileSync(
        new URL(
          `../public/assets/textures/${prefix}-${String(i).padStart(2, "0")}.webp`,
          import.meta.url,
        ),
      );
      assert.ok(b.length > 2000);
      bytes.push(b.toString("base64"));
    }
  assert.equal(new Set(bytes).size, 13);
});
test("animation nodes and independently UV-mapped image surfaces exist", () => {
  const g = gltf();
  for (const name of [
    "anim_sofa_edge",
    "anim_chair_swivel",
    "anim_dining_edge",
    "anim_hood_fan",
    "anim_bed_edge",
    "anim_rocker",
    "anim_fan_head",
    "anim_fan_blades",
    "anim_purifier_louver",
    "anim_clock_pendulum",
    "anim_pc_fan_01",
  ])
    assert.ok(
      g.nodes.some((n) => n.name === name),
      name,
    );
  for (const name of [
    "screen_PC",
    "screen_TV",
    "frame_01",
    "frame_02",
    "frame_03",
  ]) {
    const n = g.nodes.find((n) => n.name === name);
    assert.ok(n, name);
    assert.ok(
      g.meshes[n.mesh].primitives.every(
        (p) => p.attributes.TEXCOORD_0 !== undefined,
      ),
      `${name} UV`,
    );
  }
});

test('lossless network package reconstructs exact original Blender GLB',async()=>{const {gunzipSync}=await import('node:zlib');const raw=fs.readFileSync(path),packed=fs.readFileSync(new URL('../public/assets/bearroom.glb.gz',import.meta.url));assert.ok(gunzipSync(packed).equals(raw));assert.ok(packed.length<raw.length);});
