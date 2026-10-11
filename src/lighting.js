/** Recovered from production v11. Minifier aliases are retained deliberately; this is not the lost original source.
 * Exact pre-recovery segment SHA256: 13ef0de2abf1796d451a94aeb4e7cdd4b90b6dd7f30d02748780cbdea95c9e6a
 */

// v13 reference-light revision: four fixture color temperatures and restrained moon.
const Vx = { living: { fallback: [-1.7, 1.32, 3.55], power: 24, distance: 7, shadow: true, focus: "Bear_reference_plush" }, piano: { fallback: [2.05, 2.45, 1.62], power: 21, distance: 6, shadow: true }, desk: { color: "#ffe9d5", fallback: [2.73, 1.1925, 0.33], power: 8, distance: 3.4 }, kitchen: { fallback: [-1.9, 2.6, -2.75], power: 19, distance: 4.5 }, dining: { fallback: [-0.7, 2.41, -1.15], power: 18, distance: 4 }, bed: { color: "#ffdfbb", fallback: [-0.75, 5.47, -2.2], power: 12, distance: 4 }, reading: { color: "#ffdfbb", fallback: [2.4, 5.2, -1.05], power: 13, distance: 4 }, entry: { fallback: [0.325, 2.6, 3.4], power: 7, distance: 3 }, bath: { color: "#fff0dd", fallback: [3.6, 2.59, -2.95], power: 11, distance: 3.5 }, stairs: { fallback: [-4.3, 4.35, 0.25], power: 12, distance: 5 } }, Gx = (i) => i > 3.2 ? 3.12 : 0.12;
function Wx(i, e) {
  return e ? [...e] : [i[0], Gx(i[1]), i[2]];
}
function Xx(i, { bakedGI: e = false } = {}) {
  const t = Math.max(0, Math.min(1, i));
  return { fill: e ? 0 : 0.23 + 0.41 * t, sun: 2.7 * t, moon: 0.18 * (1 - t), environment: 0.3 + 0.12 * t, exposure: 1.02 - 0.02 * t, lamps: 1 - 0.88 * t };
}

export { Vx, Wx, Xx, Vx as LIGHTS, Xx as lightingState, Wx as lampTarget };
