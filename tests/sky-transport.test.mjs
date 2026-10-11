import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { assetDirectory } from '../scripts/asset-contract.mjs';
import { validateIrradiance, packIrradiance, patchBakedShader, applyBakedGI } from '../src/baked-gi.js';
import { SKY_TRANSPORT, combinedRadiance } from '../src/sky-transport.js';

const current = JSON.parse(fs.readFileSync(assetDirectory() + '/baked-gi/irradiance.json'));
function legacy() { const data = structuredClone(current); delete data.sky; return data; }
function fixture() {
  const data = legacy();
  data.sky = {
    sourceSha256: data.sourceSha256,
    quantity: SKY_TRANSPORT.quantity, method: SKY_TRANSPORT.method,
    analyticLights: false, emissiveSurfaces: false,
    states: {
      day: Array.from({ length: 2880 }, (_, i) => (i % 31) / 100),
      night: Array.from({ length: 2880 }, (_, i) => (i % 17) / 200),
    },
  };
  return data;
}

test('legacy GI remains supported and zero-sky transport produces byte-identical packed radiance', () => {
  const data = fixture();
  data.sky.states.day.fill(0); data.sky.states.night.fill(0);
  assert.equal(validateIrradiance(data), data);
  const original = legacy();
  assert.equal(validateIrradiance(original), original);
  assert.equal(combinedRadiance(original, 'day'), original.states.day);
  assert.deepEqual(packIrradiance(data), packIrradiance(original));
});

test('separate sky and analytic arrays sum exactly once for every endpoint, region, face and channel', () => {
  const data = fixture(), before = structuredClone(data), packed = packIrradiance(data);
  assert.deepEqual([packed.width, packed.height, packed.depth], [5, 2, 192]);
  assert.equal(packed.array.length, 5 * 2 * 192 * 4);
  for (const [stateIndex, state] of ['night', 'day'].entries()) {
    for (let region = 0; region < 4; region++) for (let z = 0; z < 4; z++) for (let y = 0; y < 2; y++) for (let x = 0; x < 5; x++) for (let face = 0; face < 6; face++) {
      const from = ((((region * 4 + z) * 2 + y) * 5 + x) * 6 + face) * 3;
      const to = ((((stateIndex * 4 + region) * 6 + face) * 4 + z) * 2 * 5 + y * 5 + x) * 4;
      for (let channel = 0; channel < 3; channel++) assert.equal(packed.array[to + channel], Math.fround(data.states[state][from + channel] + data.sky.states[state][from + channel]));
      assert.equal(packed.array[to + 3], 1);
    }
  }
  assert.deepEqual(data, before, 'Packing cannot merge away or alter the separately labelled bake arrays');
});

test('sky validation rejects mismatched sources, analytic duplication and unsupported transport semantics', () => {
  for (const mutate of [
    data => { data.sky = null; },
    data => { data.sky.sourceSha256 = '0'.repeat(64); },
    data => { delete data.sky.sourceSha256; },
    data => { data.sky.analyticLights = true; },
    data => { delete data.sky.analyticLights; },
    data => { data.sky.emissiveSurfaces = true; },
    data => { data.sky.method = 'unoccluded hemisphere fill'; },
    data => { data.sky.quantity = 'irradiance already multiplied by pi'; },
  ]) {
    const data = fixture(); mutate(data); assert.throws(() => validateIrradiance(data), /sky transport|Sky transport/i);
  }
});

test('sky validation rejects malformed arrays and non-finite, negative or half-float-overflowing sums', () => {
  for (const state of ['day', 'night']) {
    for (const value of [-.01, NaN, Infinity, 65505]) {
      const data = fixture(); data.sky.states[state][0] = value;
      assert.throws(() => validateIrradiance(data), /sky radiance|Float16/);
    }
    for (const mutate of [
      data => { data.sky.states[state].pop(); },
      data => { data.sky.states[state].push(0); },
      data => { delete data.sky.states[state]; },
      data => { data.sky.states[state] = new Float32Array(2880); },
      data => { data.sky.states[state][0] = 65504; data.states[state][0] = 1; },
    ]) {
      const data = fixture(); mutate(data); assert.throws(() => validateIrradiance(data), /sky radiance|Float16/);
    }
  }
});

test('sky transport uses the unchanged one-texture GI shader and existing half-float volume allocation', async () => {
  const data = fixture(), baked = await applyBakedGI({ traverse() {} }, { data });
  assert.equal(baked.diagnostics().textureBytes, 5 * 2 * 192 * 4 * 2);
  baked.setDay(.5); assert.equal(baked.diagnostics().day, .5); baked.dispose();
  const shader = { uniforms: {}, fragmentShader: '#include <lights_fragment_begin>\n#include <lights_fragment_maps>' };
  patchBakedShader(shader, {});
  assert.equal((shader.fragmentShader.match(/uniform highp sampler3D bakedGIVolume/g) || []).length, 1);
  assert.equal((shader.fragmentShader.match(/texture\(bakedGIVolume,/g) || []).length, 1);
  assert.equal((shader.fragmentShader.match(/3\.141592653589793/g) || []).length, 1);
  assert.ok(!shader.fragmentShader.includes('sampler3D sky'));
});
