import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadSceneForCPU } from './helpers.mjs';
import {inOrganicEditScope} from '../scripts/check-organic-preservation.mjs';
import{expectedProtectedWorld}from'../scripts/organic-bear-placement.mjs';
import { prepareCloth, updateCloth } from '../src/performance.js';
import { LIGHTS, lightingState } from '../src/lighting.js';
import { IsometricRoom, configureControls, isWorldVisible, isClipped } from '../src/camera.js';
import { L as Vector3, Gr as Camera, Ee as Vector2, Lf as Raycaster, ii as MeshBasicMaterial } from '../vendor/runtime-v11.js';
import { sha256 } from '../scripts/asset-contract.mjs';
import {snapshotScene} from '../scripts/model-node-snapshot.mjs';
import {restoreSeatedBearSnapshots} from '../scripts/seated-bear-contract.mjs';

const scene = await loadSceneForCPU();
test('reference revision preserves furniture, bear, animation, key and screen world transforms and piano/art geometry', () => {
  const frozen = JSON.parse(fs.readFileSync(new URL('../recovery/v12-runtime-contract.json', import.meta.url)));
  scene.updateMatrixWorld(true);
  const protectedSnapshots=new Map(restoreSeatedBearSnapshots(snapshotScene(scene)).map(node=>[node.name,node]));
  const hashArray = array => sha256(Buffer.from(array.buffer, array.byteOffset, array.byteLength));
  const pcReplacement = JSON.parse(fs.readFileSync(new URL('../recovery/pc-case-replacements.json', import.meta.url)));
  const hasReferencePc = !!scene.getObjectByName(pcReplacement.requiredReplacementScreen);
  const baselineV16=JSON.parse(fs.readFileSync(new URL('../recovery/v16-model-node-snapshot.json',import.meta.url)));
  let hasOrganic=false;scene.traverse(n=>{if(n.isMesh&&(Array.isArray(n.material)?n.material:[n.material]).some(m=>m.name==='fabric_v17_boucle'))hasOrganic=true;});
  const revisedOrganicNodes=new Set(baselineV16.nodes.filter(inOrganicEditScope).map(n=>n.name));
  for (const expected of frozen.nodes) {
    // Explicit organic visual replacements are checked against their new source;
    // every unaffected v16 node remains byte-guarded in organic-assets.test.mjs.
    if(hasOrganic && revisedOrganicNodes.has(expected.name))continue;
    if (hasReferencePc && pcReplacement.retiredLegacyFanChildren.includes(expected.name)) {
      assert.equal(scene.getObjectByName(expected.name), undefined, `${expected.name}: retired legacy rotor child must not coexist with replacement`);
      continue;
    }
    const actual = scene.getObjectByName(expected.name);
    assert.ok(actual, expected.name);
    const expectedMatrix=expectedProtectedWorld(expected.name,expected.matrixWorld,hasOrganic);
    protectedSnapshots.get(expected.name).matrixWorld.forEach((v, i) => assert.ok(Math.abs(v - expectedMatrix[i]) < 1e-6, `${expected.name}: world matrix entry ${i} moved`));
    if (expected.attributes) {
      const attributes = Object.fromEntries(Object.entries(actual.geometry.attributes).map(([name, attribute]) => [name, {itemSize: attribute.itemSize, count: attribute.count, sha256: hashArray(attribute.array)}]));
      assert.deepEqual(attributes, expected.attributes, `${expected.name}: protected geometry changed`);
      if (expected.indexSha256) assert.equal(hashArray(actual.geometry.index.array), expected.indexSha256, expected.name);
    }
  }
});
// These amplitudes, periods and phases remain guarded by the main-module AST test.
for (const [name, amplitude, period, phase] of [
  ['anim_sofa_edge', .0035, 11, 1],
  ['anim_dining_edge', .0035, 10, 3],
  ['anim_bed_edge', .004, 12, 4],
]) test(`${name}: exported mesh retains reversible, bounded weighted-edge cloth deformation`, () => {
  const mesh = scene.getObjectByName(name);
  assert.ok(mesh?.isMesh, `${name} must remain a direct mesh`);
  const geometry = mesh.geometry.clone();
  geometry.computeBoundingBox();
  const positions = geometry.attributes.position.array, rest = positions.slice();
  const { min, max } = geometry.boundingBox;
  assert.ok(max.z > min.z);
  const cloth = prepareCloth(positions, min.z, max.z);
  assert.ok(cloth.indices.length > 0 && cloth.indices.length < positions.length / 3);
  const axis = new Vector3(0, 1, 0).transformDirection(mesh.matrixWorld);
  assert.ok(axis.distanceTo(new Vector3(0, 1, 0)) < 1e-6, 'Local Y must lift the cloth vertically in the exported model');
  const threshold = max.z - (max.z - min.z) * .25;
  const active = new Map([...cloth.indices].map((index, i) => [index, cloth.weights[i]]));
  assert.ok([...cloth.weights].some(weight => weight === 1));
  for (let i = 0; i < rest.length; i += 3) {
    const t = Math.max(0, Math.min(1, (rest[i + 2] - threshold) / (max.z - threshold)));
    const expected = t * t * (3 - 2 * t);
    assert.ok(Math.abs((active.get(i + 1) || 0) - expected) < 1e-12);
  }
  // Visit both extrema, repeated positive/negative motion, and ordinary authored times.
  const displacements = [-amplitude, amplitude, -amplitude, ...[0, period / 4, period / 2, period].map(time => Math.sin(time * Math.PI * 2 / period + phase) * amplitude), 0];
  for (const displacement of displacements) {
    updateCloth(positions, cloth, displacement);
    for (let i = 0; i < positions.length; i++) {
      if (active.has(i)) assert.equal(positions[i], Math.fround(rest[i] + displacement * active.get(i)));
      else assert.equal(positions[i], rest[i], 'Only weighted local-Y coordinates may change');
      assert.ok(Number.isFinite(positions[i]));
      assert.ok(Math.abs(positions[i] - rest[i]) <= amplitude + 1e-6);
    }
  }
  assert.deepEqual(positions, rest, 'Zero displacement restores every authored rest coordinate');
});

test('PC and TV authored front faces remain visible and raycast reachable with the actual single-sided screen material', () => {
  const root = scene.clone(true);
  root.getObjectByName('Exterior_city')?.removeFromParent();
  const camera = new Camera(-12, 12, 10, -10, .1, 100);
  const controls = { target: new Vector3(), mouseButtons: {}, touches: {}, update() {}, addEventListener() {} };
  configureControls(controls);
  const room = new IsometricRoom(root, camera, controls), ray = new Raycaster();
  for (const name of ['screen_PC', 'screen_TV']) {
    const screen = root.getObjectByName(name);
    assert.ok(screen?.isMesh);
    assert.equal(screen.geometry.attributes.uv.count, screen.geometry.attributes.position.count);
    // dv() replaces the authored double-sided material with this front-sided type.
    screen.material = new MeshBasicMaterial({ toneMapped: false });
  }
  for (const view of ['overview', 'lower']) {
    room.setView(view); room.fit(1440, 900);
    for (const name of ['screen_PC', 'screen_TV']) {
      const screen = root.getObjectByName(name);
      screen.geometry.computeBoundingBox();
      const point = screen.localToWorld(screen.geometry.boundingBox.getCenter(new Vector3())).project(camera);
      ray.setFromCamera(new Vector2(point.x, point.y), camera);
      const hit = ray.intersectObject(root, true).find(hit => {
        const mat = Array.isArray(hit.object.material) ? hit.object.material[hit.face?.materialIndex || 0] : hit.object.material;
        return isWorldVisible(hit.object) && mat && !isClipped(hit.point, mat) && mat.opacity > .3 && !/glass/i.test(mat.name);
      });
      assert.equal(hit?.object, screen, `${name} front face is blocked in ${view}`);
    }
  }
});

test('reviewed light profile preserves continuous day/night transitions and zero baked-GI diffuse fill', () => {
  assert.equal(lightingState(0).moon, .18);
  assert.equal(lightingState(1).moon, 0);
  assert.deepEqual(lightingState(-10), lightingState(0));
  assert.deepEqual(lightingState(10), lightingState(1));
  const night = lightingState(0), day = lightingState(1);
  for (let i = 0; i <= 100; i++) {
    const t = i / 100, state = lightingState(t);
    assert.equal(lightingState(t, { bakedGI: true }).fill, 0);
    for (const key of Object.keys(state)) {
      assert.ok(Number.isFinite(state[key]) && state[key] >= 0);
      assert.ok(Math.abs(state[key] - (night[key] * (1 - t) + day[key] * t)) < 1e-12, key);
    }
  }
  assert.deepEqual(Object.fromEntries(Object.entries(LIGHTS).filter(([,light]) => light.color).map(([name,light]) => [name,light.color])), {
    desk: '#ffe9d5', bed: '#ffdfbb', reading: '#ffdfbb', bath: '#fff0dd',
  });
});
