import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PcCaseController, PC_CASE_CONFIG, pcLightSample, pcFanAngle, pcUpdateInterval, pcClockText } from '../src/pc-case.js';
import { Mh as Scene, _t as Mesh, Hr as PlaneGeometry, Ai as Material, Gr as Camera, L as Vector3 } from '../vendor/runtime-v11.js';

function fixture() {
  const scene = new Scene(), root = new Scene(); root.name = PC_CASE_CONFIG.rootName; scene.add(root);
  const screen = new Mesh(new PlaneGeometry(.119, .454), new Material()); screen.name = PC_CASE_CONFIG.screenName; root.add(screen);
  const materials = PC_CASE_CONFIG.zoneNames.map(name => new Material({ name, emissive: '#ddbbee', emissiveIntensity: 1.7 }));
  const rotors = [];
  for (let index = 0; index < 9; index++) {
    const rotor = new Scene(); rotor.name = PC_CASE_CONFIG.rotorPrefix + index;
    rotor.userData.pcSpinAxis = ['x', 'y', 'z'][index % 3]; rotor.userData.pcSpinSpeed = 3.6 + index * .1;
    const blade = new Mesh(new PlaneGeometry(.08, .08), materials[index % 4]); blade.name = rotor.name + '_blade'; rotor.add(blade); root.add(rotor); rotors.push(rotor);
  }
  scene.updateMatrixWorld(true);
  const camera = new Camera(-1, 1, 1, -1, .01, 100); camera.position.set(0, 0, 3); camera.lookAt(new Vector3()); camera.updateMatrixWorld(true);
  const calls = [];
  const context = new Proxy({}, { get(target, key) { if (['clearRect', 'fillRect', 'drawImage', 'fillText'].includes(key)) return (...args) => calls.push({ operation: key, args }); return target[key]; } });
  const canvas = { getContext: () => context };
  class TestTexture { constructor(image) { this.image = image; this.source = {}; this.uploads = 0; } set needsUpdate(value) { if (value) this.uploads++; } dispose() { this.disposed = true; } }
  const wallpaper = new TestTexture({ width: 256, height: 768 }), originalImage = wallpaper.image;
  let epoch = new Date(2026, 9, 8, 11, 2, 0).getTime();
  const unrelated = { mat: new Material({ name: 'lamp_warm' }) }, genericEmissives = [unrelated, ...materials.map(mat => ({ mat }))];
  const controller = new PcCaseController(scene, { wallpaper, genericEmissives, canvasFactory: () => canvas, now: () => epoch });
  return { scene, root, screen, materials, rotors, camera, calls, canvas, wallpaper, originalImage, controller, genericEmissives, unrelated, setEpoch(value) { epoch = value; }, epoch };
}
test('PC lighting is smooth, finite, bounded and slower than visible flashing', () => {
  for (let zone = 0; zone < 4; zone++) for (const day of [0, .5, 1]) {
    let previous = pcLightSample(0, zone, day);
    for (let frame = 1; frame <= 18 * 120; frame++) {
      const value = pcLightSample(frame / 120, zone, day);
      assert.ok(value.intensity >= .46 && value.intensity <= .99);
      assert.ok(value.mix >= 0 && value.mix <= 1);
      assert.ok(Math.abs(value.intensity - previous.intensity) < .001);
      assert.ok(Math.abs(value.mix - previous.mix) < .002);
      previous = value;
    }
  }
  assert.ok(Number.isFinite(pcLightSample(NaN, 0, Infinity).intensity));
});
test('PC fan angles remain finite modulo one turn even after long sessions', () => {
  for (const t of [0, 1, 100, 1e9, Infinity, NaN, -5]) for (const speed of [0, 3.6, 10, NaN]) {
    const angle = pcFanAngle(t, speed, .3);
    assert.ok(Number.isFinite(angle) && angle >= .3 && angle <= .3 + 2 * Math.PI);
  }
});
test('PC controller animates only nine pivot objects and four shared zones', () => {
  const f = fixture(), before = f.rotors.map(r => r.children[0].rotation.toArray());
  assert.equal(f.controller.rotors.length, 9); assert.equal(f.controller.zones.length, 4);
  assert.deepEqual(f.genericEmissives, [f.unrelated]);
  assert.equal(f.controller.update(1, f.camera, 900, .3), true);
  f.rotors.forEach((rotor, index) => {
    const axis = rotor.userData.pcSpinAxis;
    assert.equal(rotor.rotation[axis], pcFanAngle(1, rotor.userData.pcSpinSpeed, 0));
    assert.deepEqual(rotor.children[0].rotation.toArray(), before[index]);
    assert.ok(rotor.matrixWorld.elements.every(Number.isFinite));
  });
  assert.deepEqual(f.controller.diagnostics().newLights, 0); assert.equal(f.controller.diagnostics().newMeshes, 0);
});
test('PC screen owns its texture source, correct glTF orientation and no mipmap overhead', () => {
  const f = fixture();
  assert.notEqual(f.controller.texture, f.wallpaper); assert.notEqual(f.controller.texture.source, f.wallpaper.source);
  assert.equal(f.wallpaper.image, f.originalImage); assert.equal(f.wallpaper.uploads, 0);
  assert.equal(f.controller.texture.flipY, false); assert.equal(f.controller.texture.generateMipmaps, false);
  assert.equal(f.screen.material.side, 0); assert.equal(f.screen.material.toneMapped, false);
  assert.deepEqual([f.canvas.width, f.canvas.height], [192, 733]);
  assert.ok(f.calls.some(call => call.operation === 'drawImage'));
  assert.ok(f.calls.some(call => call.operation === 'fillText' && call.args[0] === '11:02'));
  assert.equal(pcClockText(f.epoch), '11:02');
});
test('PC display uploads only on minute changes and sleeps when hidden/off-screen', () => {
  const f = fixture(); assert.equal(f.controller.textureUploads, 1);
  for (let index = 0; index < 600; index++) f.controller.update(index / 60, f.camera, 900, 0);
  assert.equal(f.controller.textureUploads, 1);
  f.setEpoch(f.epoch + 60000); f.controller.update(10, f.camera, 900, 0);
  assert.equal(f.controller.textureUploads, 2);
  const before = f.controller.frameUpdates;
  f.root.visible = false; f.setEpoch(f.epoch + 120000); f.controller.update(12, f.camera, 900, 0);
  assert.equal(f.controller.textureUploads, 2); assert.equal(f.controller.frameUpdates, before);
  f.root.visible = true; f.camera.position.x = 10; f.camera.lookAt(10, 0, 0); f.camera.updateMatrixWorld(true);
  f.controller.update(13, f.camera, 900, 0); assert.equal(f.controller.frameUpdates, before);
  f.camera.position.set(0, 0, 3); f.camera.lookAt(0, 0, 0); f.camera.updateMatrixWorld(true);
  f.controller.update(14, f.camera, 900, 0); assert.equal(f.controller.textureUploads, 3);
});
test('PC small-screen and distant animation has explicit throttling, without changing geometry', () => {
  assert.equal(pcUpdateInterval(100, 2, true), 1 / 30);
  assert.equal(pcUpdateInterval(40, 3, true), 1 / 15);
  assert.equal(pcUpdateInterval(10, 5, true), 1 / 8);
  assert.equal(pcUpdateInterval(2, 5), Infinity); assert.equal(pcUpdateInterval(100, 19, true), Infinity);
  const f = fixture(), attributes = f.rotors.map(r => r.children[0].geometry.attributes.position.array.slice());
  for (let index = 0; index <= 600; index++) f.controller.update(index / 60, f.camera, 900, .5);
  assert.ok(f.controller.frameUpdates <= 301);
  f.rotors.forEach((r, index) => assert.deepEqual(r.children[0].geometry.attributes.position.array, attributes[index]));
});
test('PC cleanup is idempotent and restores static rest transforms/material', () => {
  const f = fixture(), original = f.controller.originalMaterial;
  f.controller.update(1, f.camera, 900, .5); f.controller.dispose(); f.controller.dispose();
  assert.equal(f.screen.material, original); assert.equal(f.controller.texture.disposed, true);
  f.rotors.forEach(r => assert.equal(r.rotation[r.userData.pcSpinAxis], 0));
  assert.equal(f.controller.update(2, f.camera, 900, 0), false);
});
test('PC update path adds no renderer, scene lighting, geometry allocation or independent frame loop', () => {
  const source = fs.readFileSync(new URL('../src/pc-case.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /PointLight|SpotLight|requestAnimationFrame|setInterval|new Mesh\(/);
  const update = source.slice(source.indexOf('  update(time,'), source.indexOf('  diagnostics()'));
  assert.doesNotMatch(update, /new |\.clone\(|\.map\(/);
});

test('case power off freezes all nine rotor matrices and suppresses every RGB zone across day/night', () => {
  const f = fixture(); f.controller.update(1, f.camera, 900, 0);
  assert.equal(f.controller.setPower(false, 1), true);
  const matrices = f.rotors.map(rotor => rotor.matrixWorld.toArray()), frames = f.controller.frameUpdates;
  assert.ok(f.materials.every(material => material.emissiveIntensity === 0));
  for (let frame = 0; frame < 600; frame++) f.controller.update(2 + frame / 60, f.camera, 900, frame % 2);
  assert.equal(f.controller.frameUpdates, frames);
  assert.ok(f.materials.every(material => material.emissiveIntensity === 0));
  f.rotors.forEach((rotor, i) => assert.deepEqual(rotor.matrixWorld.toArray(), matrices[i]));
  assert.deepEqual(f.genericEmissives, [f.unrelated], 'The general light loop cannot restore RGB while off');
  f.setEpoch(f.epoch + 60000); f.controller.update(13, f.camera, 900, 1);
  assert.equal(f.controller.textureUploads, 2, 'The existing local clock remains active');
  assert.equal(f.controller.togglePower(13), true);
  f.controller.update(13.1, f.camera, 900, 1);
  f.rotors.forEach(rotor => assert.ok(Math.abs(rotor.rotation[rotor.userData.pcSpinAxis] - pcFanAngle(1.1, rotor.userData.pcSpinSpeed)) < 1e-10));
  assert.ok(f.materials.every(material => material.emissiveIntensity > 0));
  assert.equal(f.controller.diagnostics().powered, true);
});

test('power state survives hidden/offscreen periods and repeated toggles without stored state', () => {
  const f = fixture(); f.controller.update(2, f.camera, 900, 0);
  f.controller.togglePower(2); f.root.visible = false;
  f.controller.update(200, f.camera, 900, 1); f.root.visible = true;
  f.controller.update(201, f.camera, 900, 1);
  assert.equal(f.controller.powered, false); assert.ok(f.materials.every(material => material.emissiveIntensity === 0));
  for (let i = 0; i < 10; i++) f.controller.togglePower(201);
  assert.equal(f.controller.powered, false); assert.equal(f.controller.powerTime, 2);
  const source = fs.readFileSync(new URL('../src/pc-case.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|document\.cookie/);
});
