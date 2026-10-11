import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import * as THREE from "three";

// Exercise the exact runtime preparation function without starting WebGL/DOM.
const source = fs.readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
function harness() {
  const emissions = [];
  const context = vm.createContext({
    renderer: { capabilities: { getMaxAnisotropy: () => 16 } },
    emissions,
    weatherUniforms: {},
  });
  vm.runInContext(source.slice(source.indexOf("const preparedMaterials"), source.indexOf("function addLight(")), context);
  return { prepare: context.materialDetail, emissions };
}

test("runtime preserves authored textile and timber PBR response", () => {
  const { prepare } = harness();
  for (const name of ["fabric_bear", "fabric_sofa_boucle", "fabric_oat", "fabric_blush", "fabric_seam", "wood_oak", "wood_honey"]) {
    const material = new THREE.MeshStandardMaterial({
      name, color: "#f0d5c1", roughness: 0.83, metalness: 0.02,
      normalScale: new THREE.Vector2(0.4, 0.4),
      map: new THREE.Texture(), normalMap: new THREE.Texture(),
      roughnessMap: new THREE.Texture(),
    });
    material.map.colorSpace = THREE.SRGBColorSpace;
    const before = {
      roughness: material.roughness, metalness: material.metalness,
      color: material.color.getHex(), normalScale: material.normalScale.toArray(),
      map: material.map, normalMap: material.normalMap, roughnessMap: material.roughnessMap,
      shader: material.onBeforeCompile, envMapIntensity: material.envMapIntensity,
    };
    prepare(material);
    for (const field of ["roughness", "metalness", "map", "normalMap", "roughnessMap", "envMapIntensity"])
      assert.equal(material[field], before[field], `${name}: ${field}`);
    assert.equal(material.color.getHex(), before.color);
    assert.deepEqual(material.normalScale.toArray(), before.normalScale);
    assert.equal(material.onBeforeCompile, before.shader);
    assert.equal(material.map.colorSpace, THREE.SRGBColorSpace);
    assert.equal(material.normalMap.colorSpace, THREE.NoColorSpace);
    assert.equal(material.map.anisotropy, 8);
  }
});

test("shared emissive materials are registered only once", () => {
  const { prepare, emissions } = harness();
  const material = new THREE.MeshStandardMaterial({ emissive: "#ffe0bc", emissiveIntensity: 1.3 });
  prepare(material);
  prepare(material);
  assert.equal(emissions.length, 1);
  assert.equal(emissions[0].base, 1.3);
});
