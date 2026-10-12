/** Independent execution of the actual main readiness/frame functions.
 * CPU-only stubs establish sequencing; this is not WebGL visual/performance QA.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parseAst } from 'rollup/parseAst';

const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const names = ['finishRoomPreparation', 'vv', 'cl'];
const declarations = parseAst(main).body.filter(node => node.type === 'FunctionDeclaration' && names.includes(node.id.name));
assert.equal(declarations.length, names.length);
const source = declarations.map(node => main.slice(node.start, node.end)).join('\n');

function fixture({ loss = false, abortOnRender = false } = {}) {
  const events = [];
  const sun = { intensity: 0, castShadow: true, shadow: { needsUpdate: false } };
  const spot = { intensity: 1, castShadow: true, shadow: { needsUpdate: false } };
  const context = {
    document: { visibilityState: 'hidden' }, preparationAbort: new AbortController(),
    innerWidth: 800, innerHeight: 600, graphicsAvailable: true, cs: false, Ei: false, kr: false, Hs: 98, Cr: 0,
    _i: 0, _n: 0, Or: 'night', qc: 0, rv: 1 / 30, Fr: null, Qh: {}, It: sun, ol: {},
    Uo: [{ light: spot, power: 24 }], eu: [], No: [], tu: [], nu: [], Fo: new Map(),
    Nr: null, pcCase: null, roomInteractions: null, Rt: {}, _v: 0, xv: 1,
    jt: { background: { copy() { return this; }, lerp() { return this; } } },
    oi: { frameTimes: { push() {} } }, en: { damp: (value, target) => target },
    Xx: () => ({ fill: 0, sun: 0, moon: .18, environment: .3, exposure: 1.02, lamps: 1 }),
    walk: { active: false, resize(width, height) { events.push(['walk-size', width, height]); }, getCamera() { return context.Rt; } },
    tn: { update() { events.push(['controls-update']); } },
    pt: { view: 'overview', fit(width, height, options) { events.push(['fit', width, height, options.reset]); }, constrain() {} },
    Ot: {
      setSize(width, height) { events.push(['renderer-size', width, height]); },
      getContext() { return { isContextLost: () => loss }; },
      render(scene, camera) {
        assert.equal(scene, context.jt, 'final render uses the original complete scene');
        assert.equal(camera, context.Rt, 'final render uses the actual restored camera');
        assert.equal(spot.shadow.needsUpdate, true, 'partial warm-up shadow map receives a complete refresh');
        assert.equal(sun.castShadow, false, 'the original steady night sun topology remains');
        assert.equal(sun.shadow.needsUpdate, false);
        events.push(['render']);
        if (abortOnRender) context.preparationAbort.abort(Error('Synthetic context interruption'));
      },
    },
    performance: { now: () => 42 }, cancelAnimationFrame() {}, requestAnimationFrame() { return 99; },
    setRoomReady(ready) { assert.equal(events.filter(event => event[0] === 'render').length, 1); events.push(['ready', ready]); },
  };
  let yields = 0;
  context.preparationFrame = async () => {
    yields++;
    assert.equal(events.filter(event => event[0] === 'ready').length, 0);
    assert.equal(context.cs, false, 'unrendered hidden attempt must reset readiness');
    if (yields === 1) context.document.visibilityState = 'hidden';
    else {
      context.document.visibilityState = 'visible';
      context.innerWidth = 1200; context.innerHeight = 900;
    }
  };
  vm.createContext(context); vm.runInContext(source, context);
  return { context, events, sun, spot, yields: () => yields };
}

test('independent actual main: hidden final frame retries; complete restored scene renders before unlock', async () => {
  const { context, events, yields } = fixture();
  await context.finishRoomPreparation();
  assert.equal(yields(), 2);
  assert.equal(events.filter(event => event[0] === 'render').length, 1);
  assert.deepEqual(events.at(-1), ['ready', true]);
  assert.equal(context.cs, true);
  assert.equal(context.Ei, false, 'the final normal frame consumed the forced shadow refresh');
  assert.deepEqual(events.filter(event => event[0] === 'renderer-size').at(-1), ['renderer-size', 1200, 900]);
  assert.deepEqual(events.filter(event => event[0] === 'walk-size').at(-1), ['walk-size', 1200, 900]);
  assert.deepEqual(events.filter(event => event[0] === 'fit').at(-1), ['fit', 1200, 900, false]);
});

test('independent actual main: loading frame cannot render or mutate lighting, animation or controls', () => {
  const { context, events, sun, spot } = fixture();
  context.document.visibilityState = 'visible';
  context.kr = true; context.Ei = true; context.Or = 'day';
  const before = JSON.stringify({ sun, spot, time: context._i, day: context._n });
  assert.equal(context.vv(1234), undefined);
  assert.equal(JSON.stringify({ sun, spot, time: context._i, day: context._n }), before);
  assert.equal(context.Cr, 1234);
  assert.deepEqual(events, []);
});

for (const [name, options] of [['context loss', { loss: true }], ['abort during final render', { abortOnRender: true }]]) {
  test(`independent actual main: ${name} cannot unlock controls`, async () => {
    const { context, events } = fixture(options);
    await assert.rejects(context.finishRoomPreparation(), /WebGL interrupted before room readiness/);
    assert.equal(events.filter(event => event[0] === 'render').length, 1);
    assert.equal(events.filter(event => event[0] === 'ready').length, 0);
  });
}
