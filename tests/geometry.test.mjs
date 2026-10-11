import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PIANO_KEYS } from "../src/domain.js";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
let room;
async function scene() {
  if (room) return room;
  let b = fs.readFileSync(
    new URL("../public/assets/bearroom.glb", import.meta.url),
  );
  const header = JSON.parse(
    b
      .subarray(20, 20 + b.readUInt32LE(12))
      .toString()
      .trim(),
  );
  if (header.extensionsRequired?.includes("KHR_draco_mesh_compression")) {
    const io = new NodeIO()
      .registerExtensions(ALL_EXTENSIONS)
      .registerDependencies({
        "draco3d.decoder": await draco3d.createDecoderModule(),
      });
    const document = await io.readBinary(b);
    for (const extension of document.getRoot().listExtensionsUsed())
      if (extension.extensionName === "KHR_draco_mesh_compression")
        extension.dispose();
    b = Buffer.from(await io.writeBinary(document));
  }
  const gltf = await new GLTFLoader()
    .register(() => ({
      name: "GeometryOnlyTestMaterial",
      loadMaterial: () => Promise.resolve(new THREE.MeshStandardMaterial()),
    }))
    .parseAsync(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength), "");
  room = gltf.scene;
  room.updateMatrixWorld(true);
  return room;
}
test("Blender key geometry is distinct and laid out ascending across physical keyboard", async () => {
  const root = await scene();
  let x = -Infinity;
  const spans = [];
  for (const k of PIANO_KEYS) {
    const mesh = root.getObjectByName(k.node);
    assert.ok(mesh?.isMesh);
    const bounds = new THREE.Box3().setFromObject(mesh);
    assert.ok(bounds.min.x > x, `${k.node} ordered left to right`);
    x = bounds.min.x;
    assert.ok(bounds.max.y - bounds.min.y > 0.003);
    spans.push([k.midi, bounds.min.toArray(), bounds.max.toArray()]);
  }
  fs.writeFileSync(
    "delivery/piano-geometry.json",
    JSON.stringify(spans, null, 2),
  );
});
test("88 physically modeled key surfaces individually raycast from immediately above/front", async () => {
  const root = await scene();
  const notes = PIANO_KEYS.map((k) => root.getObjectByName(k.node));
  const results = [];
  for (const k of PIANO_KEYS) {
    const bounds = new THREE.Box3().setFromObject(root.getObjectByName(k.node));
    const p = bounds.getCenter(new THREE.Vector3());
    p.y = bounds.max.y - 0.001;
    if (!k.black) p.z = bounds.max.z - 0.025;
    const origin = p.clone().add(new THREE.Vector3(0, 0.5, 0.05));
    const ray = new THREE.Raycaster(origin, p.clone().sub(origin).normalize());
    const hits = ray
      .intersectObject(root, true)
      .filter((h) => !/glass|cutaway/.test(h.object.name));
    results.push({
      midi: k.midi,
      expected: k.node,
      actual: hits[0]?.object.name,
      pass: hits[0]?.object.name === k.node,
    });
  }
  fs.writeFileSync(
    "delivery/piano-raycast.json",
    JSON.stringify(
      {
        method:
          "Node Three.js full-scene GLB geometry raycast; excludes glass/cutaway; not browser touch",
        results,
      },
      null,
      2,
    ),
  );
  assert.ok(
    results.every((r) => r.pass),
    JSON.stringify(results.filter((r) => !r.pass)),
  );
});

test("black key tops are above adjacent white key tops", async () => {
  const root = await scene();
  for (let i = 1; i < PIANO_KEYS.length - 1; i++) {
    if (!PIANO_KEYS[i].black) continue;
    const b = new THREE.Box3().setFromObject(
      root.getObjectByName(PIANO_KEYS[i].node),
    );
    for (const n of [PIANO_KEYS[i - 1], PIANO_KEYS[i + 1]])
      if (!n.black) {
        const w = new THREE.Box3().setFromObject(root.getObjectByName(n.node));
        assert.ok(
          b.max.y > w.max.y + 0.006,
          `${PIANO_KEYS[i].node} raised above ${n.node}`,
        );
      }
  }
});
