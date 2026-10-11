/** Recovered from production v11. Minifier aliases are retained deliberately; this is not the lost original source.
 * Exact pre-recovery segment SHA256: 17ec94f666c5d30752367bd031189f8f097649d6b9983dab64eacbff72618e54
 */

class qx {
  constructor(e = 3600) {
    this.values = new Float64Array(e), this.length = 0, this.cursor = 0;
  }
  push(e) {
    this.values[this.cursor] = e, this.cursor = (this.cursor + 1) % this.values.length, this.length = Math.min(this.length + 1, this.values.length);
  }
  *[Symbol.iterator]() {
    const e = this.length === this.values.length ? this.cursor : 0;
    for (let t = 0; t < this.length; t++) yield this.values[(e + t) % this.values.length];
  }
}
function Yx(i, e, t) {
  const n = [], s = [], r = [], a = t - (t - e) * 0.25;
  for (let o = 0; o < i.length; o += 3) {
    const l = i[o + 2], c = l <= a ? 0 : l >= t ? 1 : (l - a) / (t - a), u = c * c * (3 - 2 * c);
    u !== 0 && (n.push(o + 1), s.push(u), r.push(i[o + 1]));
  }
  return { indices: Uint32Array.from(n), weights: Float64Array.from(s), base: Float64Array.from(r) };
}
function jx(i, e, t) {
  for (let n = 0; n < e.indices.length; n++) i[e.indices[n]] = e.base[n] + t * e.weights[n];
}
function Kx(i) {
  i.updateMatrixWorld(true), i.traverse((e) => {
    e.matrixAutoUpdate = false;
  }), i.matrixWorldAutoUpdate = false;
}
function Na(i) {
  i.updateMatrix(), i.updateMatrixWorld(true);
}

export { qx, Yx, jx, Kx, Na, qx as FrameTimeBuffer, Yx as prepareCloth, jx as updateCloth, Kx as freezeTransforms, Na as updateAnimatedTransform };
