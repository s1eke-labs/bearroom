import test from "node:test";
import assert from "node:assert/strict";
import { PIANO_KEYS, FURNITURE, isTap, slideState } from "../src/domain.js";
test("88 independent MIDI notes cover A0 through C8, 52 white and 36 black", () => {
  assert.equal(PIANO_KEYS.length, 88);
  assert.equal(new Set(PIANO_KEYS.map((k) => k.node)).size, 88);
  assert.equal(PIANO_KEYS.filter((k) => !k.black).length, 52);
  assert.equal(PIANO_KEYS.filter((k) => k.black).length, 36);
  assert.equal(PIANO_KEYS[0].name, "A0");
  assert.equal(PIANO_KEYS.at(-1).name, "C8");
  for (let i = 1; i < 88; i++) {
    assert.equal(PIANO_KEYS[i].midi, PIANO_KEYS[i - 1].midi + 1);
    assert.ok(PIANO_KEYS[i].frequency > PIANO_KEYS[i - 1].frequency);
  }
  assert.equal(PIANO_KEYS.find((k) => k.midi === 69).frequency, 440);
});
test("full furniture denominator is 23 with exactly 12 autonomous objects", () => {
  assert.equal(FURNITURE.length, 23);
  assert.equal(FURNITURE.filter((f) => f.animated).length, 12);
  assert.equal(FURNITURE[5].animated, false);
  assert.deepEqual(
    FURNITURE.filter((f) => f.animated).map((f) => f.id),
    [
      "F01",
      "F03",
      "F09",
      "F10",
      "F11",
      "F13",
      "F14",
      "F15",
      "F16",
      "F21",
      "F22",
      "F23",
    ],
  );
});
test("tap rejects drag, pinch, pan, cancellation and hold", () => {
  const tap = { distance: 2, duration: 120, multi: false, cancelled: false };
  assert.ok(isTap(tap));
  for (const patch of [
    { distance: 8 },
    { duration: 900 },
    { multi: true },
    { cancelled: true },
  ])
    assert.ok(!isTap({ ...tap, ...patch }));
});
test("wallpaper and TV keep separate holds and one second crossfades", () => {
  assert.deepEqual(slideState(16.5, 6, 16), { index: 0, next: 1, mix: 0.5 });
  assert.equal(slideState(17, 6, 16).index, 1);
  assert.equal(slideState(17, 4, 23, 7).index, 1);
  for (let t = 0; t < 300; t += 0.1) {
    const s = slideState(t, 6, 16);
    assert.ok(s.index >= 0 && s.index < 6 && s.mix >= 0 && s.mix <= 1);
  }
});
