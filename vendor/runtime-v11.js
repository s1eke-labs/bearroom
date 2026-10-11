/** Recovered from production v11. Minifier aliases are retained deliberately; this is not the lost original source.
 * Exact pre-recovery segment SHA256: 19d027e85a26882b52dca0a6a25e0f250df578c37db0b78ade2ed2024696817b
 */

const Oo = "180", kn = { ROTATE: 0, DOLLY: 1, PAN: 2 }, ti = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 }, cu = 0, gl = 1, hu = 2, Jc = 1, Qc = 2, Nn = 3, Vn = 0, Ut = 1, Mn = 2, si = 0, $i = 1, _l = 2, xl = 3, vl = 4, uu = 5, vi = 100, du = 101, fu = 102, pu = 103, mu = 104, gu = 200, _u = 201, xu = 202, vu = 203, Fa = 204, Oa = 205, yu = 206, Mu = 207, Su = 208, Eu = 209, Tu = 210, bu = 211, Au = 212, wu = 213, Ru = 214, Ba = 0, ka = 1, za = 2, es = 3, Ha = 4, Va = 5, Ga = 6, Wa = 7, Bo = 0, Cu = 1, Pu = 2, ri = 0, Lu = 1, Du = 2, Iu = 3, eh = 4, Uu = 5, Nu = 6, Fu = 7, yl = "attached", Ou = "detached", th = 300, ts = 301, ns = 302, Xa = 303, qa = 304, zr = 306, is = 1e3, ni = 1001, Pr = 1002, Nt = 1003, nh = 1004, ws = 1005, Ht = 1006, Sr = 1007, On = 1008, En = 1009, ih = 1010, sh = 1011, Is = 1012, ko = 1013, Ti = 1014, hn = 1015, hs = 1016, zo = 1017, Ho = 1018, Us = 1020, rh = 35902, ah = 35899, oh = 1021, lh = 1022, Yt = 1023, Ns = 1026, Fs = 1027, Vo = 1028, Go = 1029, ch = 1030, Wo = 1031, Xo = 1033, Er = 33776, Tr = 33777, br = 33778, Ar = 33779, Ya = 35840, ja = 35841, Ka = 35842, Za = 35843, $a = 36196, Ja = 37492, Qa = 37496, eo = 37808, to = 37809, no = 37810, io = 37811, so = 37812, ro = 37813, ao = 37814, oo = 37815, lo = 37816, co = 37817, ho = 37818, uo = 37819, fo = 37820, po = 37821, mo = 36492, go = 36494, _o = 36495, xo = 36283, vo = 36284, yo = 36285, Mo = 36286, Os = 2300, Bs = 2301, jr = 2302, Ml = 2400, Sl = 2401, El = 2402, Bu = 2500, ku = 0, hh = 1, So = 2, zu = 3200, Hu = 3201, qo = 0, Vu = 1, ei = "", yt = "srgb", Ct = "srgb-linear", Lr = "linear", et = "srgb", Li = 7680, Tl = 519, Gu = 512, Wu = 513, Xu = 514, uh = 515, qu = 516, Yu = 517, ju = 518, Ku = 519, Eo = 35044, Zu = 35048, bl = "300 es", Sn = 2e3, Dr = 2001;
class Ci {
  addEventListener(e, t) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    n[e] === void 0 && (n[e] = []), n[e].indexOf(t) === -1 && n[e].push(t);
  }
  hasEventListener(e, t) {
    const n = this._listeners;
    return n === void 0 ? false : n[e] !== void 0 && n[e].indexOf(t) !== -1;
  }
  removeEventListener(e, t) {
    const n = this._listeners;
    if (n === void 0) return;
    const s = n[e];
    if (s !== void 0) {
      const r = s.indexOf(t);
      r !== -1 && s.splice(r, 1);
    }
  }
  dispatchEvent(e) {
    const t = this._listeners;
    if (t === void 0) return;
    const n = t[e.type];
    if (n !== void 0) {
      e.target = this;
      const s = n.slice(0);
      for (let r = 0, a = s.length; r < a; r++) s[r].call(this, e);
      e.target = null;
    }
  }
}
const At = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
let Al = 1234567;
const Cs = Math.PI / 180, ss = 180 / Math.PI;
function un() {
  const i = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (At[i & 255] + At[i >> 8 & 255] + At[i >> 16 & 255] + At[i >> 24 & 255] + "-" + At[e & 255] + At[e >> 8 & 255] + "-" + At[e >> 16 & 15 | 64] + At[e >> 24 & 255] + "-" + At[t & 63 | 128] + At[t >> 8 & 255] + "-" + At[t >> 16 & 255] + At[t >> 24 & 255] + At[n & 255] + At[n >> 8 & 255] + At[n >> 16 & 255] + At[n >> 24 & 255]).toLowerCase();
}
function ze(i, e, t) {
  return Math.max(e, Math.min(t, i));
}
function Yo(i, e) {
  return (i % e + e) % e;
}
function $u(i, e, t, n, s) {
  return n + (i - e) * (s - n) / (t - e);
}
function Ju(i, e, t) {
  return i !== e ? (t - i) / (e - i) : 0;
}
function Ps(i, e, t) {
  return (1 - t) * i + t * e;
}
function Qu(i, e, t, n) {
  return Ps(i, e, 1 - Math.exp(-t * n));
}
function ed(i, e = 1) {
  return e - Math.abs(Yo(i, e * 2) - e);
}
function td(i, e, t) {
  return i <= e ? 0 : i >= t ? 1 : (i = (i - e) / (t - e), i * i * (3 - 2 * i));
}
function nd(i, e, t) {
  return i <= e ? 0 : i >= t ? 1 : (i = (i - e) / (t - e), i * i * i * (i * (i * 6 - 15) + 10));
}
function id(i, e) {
  return i + Math.floor(Math.random() * (e - i + 1));
}
function sd(i, e) {
  return i + Math.random() * (e - i);
}
function rd(i) {
  return i * (0.5 - Math.random());
}
function ad(i) {
  i !== void 0 && (Al = i);
  let e = Al += 1831565813;
  return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
}
function od(i) {
  return i * Cs;
}
function ld(i) {
  return i * ss;
}
function cd(i) {
  return (i & i - 1) === 0 && i !== 0;
}
function hd(i) {
  return Math.pow(2, Math.ceil(Math.log(i) / Math.LN2));
}
function ud(i) {
  return Math.pow(2, Math.floor(Math.log(i) / Math.LN2));
}
function dd(i, e, t, n, s) {
  const r = Math.cos, a = Math.sin, o = r(t / 2), l = a(t / 2), c = r((e + n) / 2), u = a((e + n) / 2), h = r((e - n) / 2), d = a((e - n) / 2), p = r((n - e) / 2), g = a((n - e) / 2);
  switch (s) {
    case "XYX":
      i.set(o * u, l * h, l * d, o * c);
      break;
    case "YZY":
      i.set(l * d, o * u, l * h, o * c);
      break;
    case "ZXZ":
      i.set(l * h, l * d, o * u, o * c);
      break;
    case "XZX":
      i.set(o * u, l * g, l * p, o * c);
      break;
    case "YXY":
      i.set(l * p, o * u, l * g, o * c);
      break;
    case "ZYZ":
      i.set(l * g, l * p, o * u, o * c);
      break;
    default:
      console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + s);
  }
}
function ln(i, e) {
  switch (e.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return i / 4294967295;
    case Uint16Array:
      return i / 65535;
    case Uint8Array:
      return i / 255;
    case Int32Array:
      return Math.max(i / 2147483647, -1);
    case Int16Array:
      return Math.max(i / 32767, -1);
    case Int8Array:
      return Math.max(i / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function $e(i, e) {
  switch (e.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return Math.round(i * 4294967295);
    case Uint16Array:
      return Math.round(i * 65535);
    case Uint8Array:
      return Math.round(i * 255);
    case Int32Array:
      return Math.round(i * 2147483647);
    case Int16Array:
      return Math.round(i * 32767);
    case Int8Array:
      return Math.round(i * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const en = { DEG2RAD: Cs, RAD2DEG: ss, generateUUID: un, clamp: ze, euclideanModulo: Yo, mapLinear: $u, inverseLerp: Ju, lerp: Ps, damp: Qu, pingpong: ed, smoothstep: td, smootherstep: nd, randInt: id, randFloat: sd, randFloatSpread: rd, seededRandom: ad, degToRad: od, radToDeg: ld, isPowerOfTwo: cd, ceilPowerOfTwo: hd, floorPowerOfTwo: ud, setQuaternionFromProperEuler: dd, normalize: $e, denormalize: ln };
class Ee {
  constructor(e = 0, t = 0) {
    Ee.prototype.isVector2 = true, this.x = e, this.y = t;
  }
  get width() {
    return this.x;
  }
  set width(e) {
    this.x = e;
  }
  get height() {
    return this.y;
  }
  set height(e) {
    this.y = e;
  }
  set(e, t) {
    return this.x = e, this.y = t, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this;
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  applyMatrix3(e) {
    const t = this.x, n = this.y, s = e.elements;
    return this.x = s[0] * t + s[3] * n + s[6], this.y = s[1] * t + s[4] * n + s[7], this;
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
  }
  clamp(e, t) {
    return this.x = ze(this.x, e.x, t.x), this.y = ze(this.y, e.y, t.y), this;
  }
  clampScalar(e, t) {
    return this.x = ze(this.x, e, t), this.y = ze(this.y, e, t), this;
  }
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(ze(n, e, t));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y;
  }
  cross(e) {
    return this.x * e.y - this.y * e.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const n = this.dot(e) / t;
    return Math.acos(ze(n, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const t = this.x - e.x, n = this.y - e.y;
    return t * t + n * n;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
  }
  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this;
  }
  rotateAround(e, t) {
    const n = Math.cos(t), s = Math.sin(t), r = this.x - e.x, a = this.y - e.y;
    return this.x = r * n - a * s + e.x, this.y = r * s + a * n + e.y, this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class Tn {
  constructor(e = 0, t = 0, n = 0, s = 1) {
    this.isQuaternion = true, this._x = e, this._y = t, this._z = n, this._w = s;
  }
  static slerpFlat(e, t, n, s, r, a, o) {
    let l = n[s + 0], c = n[s + 1], u = n[s + 2], h = n[s + 3];
    const d = r[a + 0], p = r[a + 1], g = r[a + 2], _ = r[a + 3];
    if (o === 0) {
      e[t + 0] = l, e[t + 1] = c, e[t + 2] = u, e[t + 3] = h;
      return;
    }
    if (o === 1) {
      e[t + 0] = d, e[t + 1] = p, e[t + 2] = g, e[t + 3] = _;
      return;
    }
    if (h !== _ || l !== d || c !== p || u !== g) {
      let m = 1 - o;
      const f = l * d + c * p + u * g + h * _, b = f >= 0 ? 1 : -1, E = 1 - f * f;
      if (E > Number.EPSILON) {
        const w = Math.sqrt(E), C = Math.atan2(w, f * b);
        m = Math.sin(m * C) / w, o = Math.sin(o * C) / w;
      }
      const y = o * b;
      if (l = l * m + d * y, c = c * m + p * y, u = u * m + g * y, h = h * m + _ * y, m === 1 - o) {
        const w = 1 / Math.sqrt(l * l + c * c + u * u + h * h);
        l *= w, c *= w, u *= w, h *= w;
      }
    }
    e[t] = l, e[t + 1] = c, e[t + 2] = u, e[t + 3] = h;
  }
  static multiplyQuaternionsFlat(e, t, n, s, r, a) {
    const o = n[s], l = n[s + 1], c = n[s + 2], u = n[s + 3], h = r[a], d = r[a + 1], p = r[a + 2], g = r[a + 3];
    return e[t] = o * g + u * h + l * p - c * d, e[t + 1] = l * g + u * d + c * h - o * p, e[t + 2] = c * g + u * p + o * d - l * h, e[t + 3] = u * g - o * h - l * d - c * p, e;
  }
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(e) {
    this._w = e, this._onChangeCallback();
  }
  set(e, t, n, s) {
    return this._x = e, this._y = t, this._z = n, this._w = s, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(e) {
    return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
  }
  setFromEuler(e, t = true) {
    const n = e._x, s = e._y, r = e._z, a = e._order, o = Math.cos, l = Math.sin, c = o(n / 2), u = o(s / 2), h = o(r / 2), d = l(n / 2), p = l(s / 2), g = l(r / 2);
    switch (a) {
      case "XYZ":
        this._x = d * u * h + c * p * g, this._y = c * p * h - d * u * g, this._z = c * u * g + d * p * h, this._w = c * u * h - d * p * g;
        break;
      case "YXZ":
        this._x = d * u * h + c * p * g, this._y = c * p * h - d * u * g, this._z = c * u * g - d * p * h, this._w = c * u * h + d * p * g;
        break;
      case "ZXY":
        this._x = d * u * h - c * p * g, this._y = c * p * h + d * u * g, this._z = c * u * g + d * p * h, this._w = c * u * h - d * p * g;
        break;
      case "ZYX":
        this._x = d * u * h - c * p * g, this._y = c * p * h + d * u * g, this._z = c * u * g - d * p * h, this._w = c * u * h + d * p * g;
        break;
      case "YZX":
        this._x = d * u * h + c * p * g, this._y = c * p * h + d * u * g, this._z = c * u * g - d * p * h, this._w = c * u * h - d * p * g;
        break;
      case "XZY":
        this._x = d * u * h - c * p * g, this._y = c * p * h - d * u * g, this._z = c * u * g + d * p * h, this._w = c * u * h + d * p * g;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a);
    }
    return t === true && this._onChangeCallback(), this;
  }
  setFromAxisAngle(e, t) {
    const n = t / 2, s = Math.sin(n);
    return this._x = e.x * s, this._y = e.y * s, this._z = e.z * s, this._w = Math.cos(n), this._onChangeCallback(), this;
  }
  setFromRotationMatrix(e) {
    const t = e.elements, n = t[0], s = t[4], r = t[8], a = t[1], o = t[5], l = t[9], c = t[2], u = t[6], h = t[10], d = n + o + h;
    if (d > 0) {
      const p = 0.5 / Math.sqrt(d + 1);
      this._w = 0.25 / p, this._x = (u - l) * p, this._y = (r - c) * p, this._z = (a - s) * p;
    } else if (n > o && n > h) {
      const p = 2 * Math.sqrt(1 + n - o - h);
      this._w = (u - l) / p, this._x = 0.25 * p, this._y = (s + a) / p, this._z = (r + c) / p;
    } else if (o > h) {
      const p = 2 * Math.sqrt(1 + o - n - h);
      this._w = (r - c) / p, this._x = (s + a) / p, this._y = 0.25 * p, this._z = (l + u) / p;
    } else {
      const p = 2 * Math.sqrt(1 + h - n - o);
      this._w = (a - s) / p, this._x = (r + c) / p, this._y = (l + u) / p, this._z = 0.25 * p;
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(e, t) {
    let n = e.dot(t) + 1;
    return n < 1e-8 ? (n = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = n)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = n), this.normalize();
  }
  angleTo(e) {
    return 2 * Math.acos(Math.abs(ze(this.dot(e), -1, 1)));
  }
  rotateTowards(e, t) {
    const n = this.angleTo(e);
    if (n === 0) return this;
    const s = Math.min(1, t / n);
    return this.slerp(e, s), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  dot(e) {
    return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let e = this.length();
    return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this;
  }
  multiply(e) {
    return this.multiplyQuaternions(this, e);
  }
  premultiply(e) {
    return this.multiplyQuaternions(e, this);
  }
  multiplyQuaternions(e, t) {
    const n = e._x, s = e._y, r = e._z, a = e._w, o = t._x, l = t._y, c = t._z, u = t._w;
    return this._x = n * u + a * o + s * c - r * l, this._y = s * u + a * l + r * o - n * c, this._z = r * u + a * c + n * l - s * o, this._w = a * u - n * o - s * l - r * c, this._onChangeCallback(), this;
  }
  slerp(e, t) {
    if (t === 0) return this;
    if (t === 1) return this.copy(e);
    const n = this._x, s = this._y, r = this._z, a = this._w;
    let o = a * e._w + n * e._x + s * e._y + r * e._z;
    if (o < 0 ? (this._w = -e._w, this._x = -e._x, this._y = -e._y, this._z = -e._z, o = -o) : this.copy(e), o >= 1) return this._w = a, this._x = n, this._y = s, this._z = r, this;
    const l = 1 - o * o;
    if (l <= Number.EPSILON) {
      const p = 1 - t;
      return this._w = p * a + t * this._w, this._x = p * n + t * this._x, this._y = p * s + t * this._y, this._z = p * r + t * this._z, this.normalize(), this;
    }
    const c = Math.sqrt(l), u = Math.atan2(c, o), h = Math.sin((1 - t) * u) / c, d = Math.sin(t * u) / c;
    return this._w = a * h + this._w * d, this._x = n * h + this._x * d, this._y = s * h + this._y * d, this._z = r * h + this._z * d, this._onChangeCallback(), this;
  }
  slerpQuaternions(e, t, n) {
    return this.copy(e).slerp(t, n);
  }
  random() {
    const e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), n = Math.random(), s = Math.sqrt(1 - n), r = Math.sqrt(n);
    return this.set(s * Math.sin(e), s * Math.cos(e), r * Math.sin(t), r * Math.cos(t));
  }
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
  }
  fromArray(e, t = 0) {
    return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
  }
  fromBufferAttribute(e, t) {
    return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class L {
  constructor(e = 0, t = 0, n = 0) {
    L.prototype.isVector3 = true, this.x = e, this.y = t, this.z = n;
  }
  set(e, t, n) {
    return n === void 0 && (n = this.z), this.x = e, this.y = t, this.z = n, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setZ(e) {
    return this.z = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this;
  }
  multiplyVectors(e, t) {
    return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
  }
  applyEuler(e) {
    return this.applyQuaternion(wl.setFromEuler(e));
  }
  applyAxisAngle(e, t) {
    return this.applyQuaternion(wl.setFromAxisAngle(e, t));
  }
  applyMatrix3(e) {
    const t = this.x, n = this.y, s = this.z, r = e.elements;
    return this.x = r[0] * t + r[3] * n + r[6] * s, this.y = r[1] * t + r[4] * n + r[7] * s, this.z = r[2] * t + r[5] * n + r[8] * s, this;
  }
  applyNormalMatrix(e) {
    return this.applyMatrix3(e).normalize();
  }
  applyMatrix4(e) {
    const t = this.x, n = this.y, s = this.z, r = e.elements, a = 1 / (r[3] * t + r[7] * n + r[11] * s + r[15]);
    return this.x = (r[0] * t + r[4] * n + r[8] * s + r[12]) * a, this.y = (r[1] * t + r[5] * n + r[9] * s + r[13]) * a, this.z = (r[2] * t + r[6] * n + r[10] * s + r[14]) * a, this;
  }
  applyQuaternion(e) {
    const t = this.x, n = this.y, s = this.z, r = e.x, a = e.y, o = e.z, l = e.w, c = 2 * (a * s - o * n), u = 2 * (o * t - r * s), h = 2 * (r * n - a * t);
    return this.x = t + l * c + a * h - o * u, this.y = n + l * u + o * c - r * h, this.z = s + l * h + r * u - a * c, this;
  }
  project(e) {
    return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
  }
  unproject(e) {
    return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
  }
  transformDirection(e) {
    const t = this.x, n = this.y, s = this.z, r = e.elements;
    return this.x = r[0] * t + r[4] * n + r[8] * s, this.y = r[1] * t + r[5] * n + r[9] * s, this.z = r[2] * t + r[6] * n + r[10] * s, this.normalize();
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
  }
  clamp(e, t) {
    return this.x = ze(this.x, e.x, t.x), this.y = ze(this.y, e.y, t.y), this.z = ze(this.z, e.z, t.z), this;
  }
  clampScalar(e, t) {
    return this.x = ze(this.x, e, t), this.y = ze(this.y, e, t), this.z = ze(this.z, e, t), this;
  }
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(ze(n, e, t));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
  }
  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this;
  }
  cross(e) {
    return this.crossVectors(this, e);
  }
  crossVectors(e, t) {
    const n = e.x, s = e.y, r = e.z, a = t.x, o = t.y, l = t.z;
    return this.x = s * l - r * o, this.y = r * a - n * l, this.z = n * o - s * a, this;
  }
  projectOnVector(e) {
    const t = e.lengthSq();
    if (t === 0) return this.set(0, 0, 0);
    const n = e.dot(this) / t;
    return this.copy(e).multiplyScalar(n);
  }
  projectOnPlane(e) {
    return Kr.copy(this).projectOnVector(e), this.sub(Kr);
  }
  reflect(e) {
    return this.sub(Kr.copy(e).multiplyScalar(2 * this.dot(e)));
  }
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const n = this.dot(e) / t;
    return Math.acos(ze(n, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const t = this.x - e.x, n = this.y - e.y, s = this.z - e.z;
    return t * t + n * n + s * s;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
  }
  setFromSpherical(e) {
    return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
  }
  setFromSphericalCoords(e, t, n) {
    const s = Math.sin(t) * e;
    return this.x = s * Math.sin(n), this.y = Math.cos(t) * e, this.z = s * Math.cos(n), this;
  }
  setFromCylindrical(e) {
    return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
  }
  setFromCylindricalCoords(e, t, n) {
    return this.x = e * Math.sin(t), this.y = n, this.z = e * Math.cos(t), this;
  }
  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this;
  }
  setFromMatrixScale(e) {
    const t = this.setFromMatrixColumn(e, 0).length(), n = this.setFromMatrixColumn(e, 1).length(), s = this.setFromMatrixColumn(e, 2).length();
    return this.x = t, this.y = n, this.z = s, this;
  }
  setFromMatrixColumn(e, t) {
    return this.fromArray(e.elements, t * 4);
  }
  setFromMatrix3Column(e, t) {
    return this.fromArray(e.elements, t * 3);
  }
  setFromEuler(e) {
    return this.x = e._x, this.y = e._y, this.z = e._z, this;
  }
  setFromColor(e) {
    return this.x = e.r, this.y = e.g, this.z = e.b, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  randomDirection() {
    const e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, n = Math.sqrt(1 - t * t);
    return this.x = n * Math.cos(e), this.y = t, this.z = n * Math.sin(e), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const Kr = new L(), wl = new Tn();
class Oe {
  constructor(e, t, n, s, r, a, o, l, c) {
    Oe.prototype.isMatrix3 = true, this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1], e !== void 0 && this.set(e, t, n, s, r, a, o, l, c);
  }
  set(e, t, n, s, r, a, o, l, c) {
    const u = this.elements;
    return u[0] = e, u[1] = s, u[2] = o, u[3] = t, u[4] = r, u[5] = l, u[6] = n, u[7] = a, u[8] = c, this;
  }
  identity() {
    return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
  }
  copy(e) {
    const t = this.elements, n = e.elements;
    return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], this;
  }
  extractBasis(e, t, n) {
    return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
  }
  setFromMatrix4(e) {
    const t = e.elements;
    return this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]), this;
  }
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, t) {
    const n = e.elements, s = t.elements, r = this.elements, a = n[0], o = n[3], l = n[6], c = n[1], u = n[4], h = n[7], d = n[2], p = n[5], g = n[8], _ = s[0], m = s[3], f = s[6], b = s[1], E = s[4], y = s[7], w = s[2], C = s[5], R = s[8];
    return r[0] = a * _ + o * b + l * w, r[3] = a * m + o * E + l * C, r[6] = a * f + o * y + l * R, r[1] = c * _ + u * b + h * w, r[4] = c * m + u * E + h * C, r[7] = c * f + u * y + h * R, r[2] = d * _ + p * b + g * w, r[5] = d * m + p * E + g * C, r[8] = d * f + p * y + g * R, this;
  }
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
  }
  determinant() {
    const e = this.elements, t = e[0], n = e[1], s = e[2], r = e[3], a = e[4], o = e[5], l = e[6], c = e[7], u = e[8];
    return t * a * u - t * o * c - n * r * u + n * o * l + s * r * c - s * a * l;
  }
  invert() {
    const e = this.elements, t = e[0], n = e[1], s = e[2], r = e[3], a = e[4], o = e[5], l = e[6], c = e[7], u = e[8], h = u * a - o * c, d = o * l - u * r, p = c * r - a * l, g = t * h + n * d + s * p;
    if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const _ = 1 / g;
    return e[0] = h * _, e[1] = (s * c - u * n) * _, e[2] = (o * n - s * a) * _, e[3] = d * _, e[4] = (u * t - s * l) * _, e[5] = (s * r - o * t) * _, e[6] = p * _, e[7] = (n * l - c * t) * _, e[8] = (a * t - n * r) * _, this;
  }
  transpose() {
    let e;
    const t = this.elements;
    return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
  }
  getNormalMatrix(e) {
    return this.setFromMatrix4(e).invert().transpose();
  }
  transposeIntoArray(e) {
    const t = this.elements;
    return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
  }
  setUvTransform(e, t, n, s, r, a, o) {
    const l = Math.cos(r), c = Math.sin(r);
    return this.set(n * l, n * c, -n * (l * a + c * o) + a + e, -s * c, s * l, -s * (-c * a + l * o) + o + t, 0, 0, 1), this;
  }
  scale(e, t) {
    return this.premultiply(Zr.makeScale(e, t)), this;
  }
  rotate(e) {
    return this.premultiply(Zr.makeRotation(-e)), this;
  }
  translate(e, t) {
    return this.premultiply(Zr.makeTranslation(e, t)), this;
  }
  makeTranslation(e, t) {
    return e.isVector2 ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1) : this.set(1, 0, e, 0, 1, t, 0, 0, 1), this;
  }
  makeRotation(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(t, -n, 0, n, t, 0, 0, 0, 1), this;
  }
  makeScale(e, t) {
    return this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this;
  }
  equals(e) {
    const t = this.elements, n = e.elements;
    for (let s = 0; s < 9; s++) if (t[s] !== n[s]) return false;
    return true;
  }
  fromArray(e, t = 0) {
    for (let n = 0; n < 9; n++) this.elements[n] = e[n + t];
    return this;
  }
  toArray(e = [], t = 0) {
    const n = this.elements;
    return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e;
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const Zr = new Oe();
function dh(i) {
  for (let e = i.length - 1; e >= 0; --e) if (i[e] >= 65535) return true;
  return false;
}
function ks(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function fd() {
  const i = ks("canvas");
  return i.style.display = "block", i;
}
const Rl = {};
function zs(i) {
  i in Rl || (Rl[i] = true, console.warn(i));
}
function pd(i, e, t) {
  return new Promise(function(n, s) {
    function r() {
      switch (i.clientWaitSync(e, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case i.WAIT_FAILED:
          s();
          break;
        case i.TIMEOUT_EXPIRED:
          setTimeout(r, t);
          break;
        default:
          n();
      }
    }
    setTimeout(r, t);
  });
}
const Cl = new Oe().set(0.4123908, 0.3575843, 0.1804808, 0.212639, 0.7151687, 0.0721923, 0.0193308, 0.1191948, 0.9505322), Pl = new Oe().set(3.2409699, -1.5373832, -0.4986108, -0.9692436, 1.8759675, 0.0415551, 0.0556301, -0.203977, 1.0569715);
function md() {
  const i = { enabled: true, workingColorSpace: Ct, spaces: {}, convert: function(s, r, a) {
    return this.enabled === false || r === a || !r || !a || (this.spaces[r].transfer === et && (s.r = zn(s.r), s.g = zn(s.g), s.b = zn(s.b)), this.spaces[r].primaries !== this.spaces[a].primaries && (s.applyMatrix3(this.spaces[r].toXYZ), s.applyMatrix3(this.spaces[a].fromXYZ)), this.spaces[a].transfer === et && (s.r = Ji(s.r), s.g = Ji(s.g), s.b = Ji(s.b))), s;
  }, workingToColorSpace: function(s, r) {
    return this.convert(s, this.workingColorSpace, r);
  }, colorSpaceToWorking: function(s, r) {
    return this.convert(s, r, this.workingColorSpace);
  }, getPrimaries: function(s) {
    return this.spaces[s].primaries;
  }, getTransfer: function(s) {
    return s === ei ? Lr : this.spaces[s].transfer;
  }, getToneMappingMode: function(s) {
    return this.spaces[s].outputColorSpaceConfig.toneMappingMode || "standard";
  }, getLuminanceCoefficients: function(s, r = this.workingColorSpace) {
    return s.fromArray(this.spaces[r].luminanceCoefficients);
  }, define: function(s) {
    Object.assign(this.spaces, s);
  }, _getMatrix: function(s, r, a) {
    return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ);
  }, _getDrawingBufferColorSpace: function(s) {
    return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace;
  }, _getUnpackColorSpace: function(s = this.workingColorSpace) {
    return this.spaces[s].workingColorSpaceConfig.unpackColorSpace;
  }, fromWorkingColorSpace: function(s, r) {
    return zs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."), i.workingToColorSpace(s, r);
  }, toWorkingColorSpace: function(s, r) {
    return zs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."), i.colorSpaceToWorking(s, r);
  } }, e = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], t = [0.2126, 0.7152, 0.0722], n = [0.3127, 0.329];
  return i.define({ [Ct]: { primaries: e, whitePoint: n, transfer: Lr, toXYZ: Cl, fromXYZ: Pl, luminanceCoefficients: t, workingColorSpaceConfig: { unpackColorSpace: yt }, outputColorSpaceConfig: { drawingBufferColorSpace: yt } }, [yt]: { primaries: e, whitePoint: n, transfer: et, toXYZ: Cl, fromXYZ: Pl, luminanceCoefficients: t, outputColorSpaceConfig: { drawingBufferColorSpace: yt } } }), i;
}
const qe = md();
function zn(i) {
  return i < 0.04045 ? i * 0.0773993808 : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function Ji(i) {
  return i < 31308e-7 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
let Di;
class gd {
  static getDataURL(e, t = "image/png") {
    if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u") return e.src;
    let n;
    if (e instanceof HTMLCanvasElement) n = e;
    else {
      Di === void 0 && (Di = ks("canvas")), Di.width = e.width, Di.height = e.height;
      const s = Di.getContext("2d");
      e instanceof ImageData ? s.putImageData(e, 0, 0) : s.drawImage(e, 0, 0, e.width, e.height), n = Di;
    }
    return n.toDataURL(t);
  }
  static sRGBToLinear(e) {
    if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
      const t = ks("canvas");
      t.width = e.width, t.height = e.height;
      const n = t.getContext("2d");
      n.drawImage(e, 0, 0, e.width, e.height);
      const s = n.getImageData(0, 0, e.width, e.height), r = s.data;
      for (let a = 0; a < r.length; a++) r[a] = zn(r[a] / 255) * 255;
      return n.putImageData(s, 0, 0), t;
    } else if (e.data) {
      const t = e.data.slice(0);
      for (let n = 0; n < t.length; n++) t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[n] = Math.floor(zn(t[n] / 255) * 255) : t[n] = zn(t[n]);
      return { data: t, width: e.width, height: e.height };
    } else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
  }
}
let _d = 0;
class jo {
  constructor(e = null) {
    this.isSource = true, Object.defineProperty(this, "id", { value: _d++ }), this.uuid = un(), this.data = e, this.dataReady = true, this.version = 0;
  }
  getSize(e) {
    const t = this.data;
    return typeof HTMLVideoElement < "u" && t instanceof HTMLVideoElement ? e.set(t.videoWidth, t.videoHeight, 0) : t instanceof VideoFrame ? e.set(t.displayHeight, t.displayWidth, 0) : t !== null ? e.set(t.width, t.height, t.depth || 0) : e.set(0, 0, 0), e;
  }
  set needsUpdate(e) {
    e === true && this.version++;
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.images[this.uuid] !== void 0) return e.images[this.uuid];
    const n = { uuid: this.uuid, url: "" }, s = this.data;
    if (s !== null) {
      let r;
      if (Array.isArray(s)) {
        r = [];
        for (let a = 0, o = s.length; a < o; a++) s[a].isDataTexture ? r.push($r(s[a].image)) : r.push($r(s[a]));
      } else r = $r(s);
      n.url = r;
    }
    return t || (e.images[this.uuid] = n), n;
  }
}
function $r(i) {
  return typeof HTMLImageElement < "u" && i instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && i instanceof ImageBitmap ? gd.getDataURL(i) : i.data ? { data: Array.from(i.data), width: i.width, height: i.height, type: i.data.constructor.name } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let xd = 0;
const Jr = new L();
class bt extends Ci {
  constructor(e = bt.DEFAULT_IMAGE, t = bt.DEFAULT_MAPPING, n = ni, s = ni, r = Ht, a = On, o = Yt, l = En, c = bt.DEFAULT_ANISOTROPY, u = ei) {
    super(), this.isTexture = true, Object.defineProperty(this, "id", { value: xd++ }), this.uuid = un(), this.name = "", this.source = new jo(e), this.mipmaps = [], this.mapping = t, this.channel = 0, this.wrapS = n, this.wrapT = s, this.magFilter = r, this.minFilter = a, this.anisotropy = c, this.format = o, this.internalFormat = null, this.type = l, this.offset = new Ee(0, 0), this.repeat = new Ee(1, 1), this.center = new Ee(0, 0), this.rotation = 0, this.matrixAutoUpdate = true, this.matrix = new Oe(), this.generateMipmaps = true, this.premultiplyAlpha = false, this.flipY = true, this.unpackAlignment = 4, this.colorSpace = u, this.userData = {}, this.updateRanges = [], this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = false, this.isArrayTexture = !!(e && e.depth && e.depth > 1), this.pmremVersion = 0;
  }
  get width() {
    return this.source.getSize(Jr).x;
  }
  get height() {
    return this.source.getSize(Jr).y;
  }
  get depth() {
    return this.source.getSize(Jr).z;
  }
  get image() {
    return this.source.data;
  }
  set image(e = null) {
    this.source.data = e;
  }
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.renderTarget = e.renderTarget, this.isRenderTargetTexture = e.isRenderTargetTexture, this.isArrayTexture = e.isArrayTexture, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = true, this;
  }
  setValues(e) {
    for (const t in e) {
      const n = e[t];
      if (n === void 0) {
        console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);
        continue;
      }
      const s = this[t];
      if (s === void 0) {
        console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);
        continue;
      }
      s && n && s.isVector2 && n.isVector2 || s && n && s.isVector3 && n.isVector3 || s && n && s.isMatrix3 && n.isMatrix3 ? s.copy(n) : this[t] = n;
    }
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.textures[this.uuid] !== void 0) return e.textures[this.uuid];
    const n = { metadata: { version: 4.7, type: "Texture", generator: "Texture.toJSON" }, uuid: this.uuid, name: this.name, image: this.source.toJSON(e).uuid, mapping: this.mapping, channel: this.channel, repeat: [this.repeat.x, this.repeat.y], offset: [this.offset.x, this.offset.y], center: [this.center.x, this.center.y], rotation: this.rotation, wrap: [this.wrapS, this.wrapT], format: this.format, internalFormat: this.internalFormat, type: this.type, colorSpace: this.colorSpace, minFilter: this.minFilter, magFilter: this.magFilter, anisotropy: this.anisotropy, flipY: this.flipY, generateMipmaps: this.generateMipmaps, premultiplyAlpha: this.premultiplyAlpha, unpackAlignment: this.unpackAlignment };
    return Object.keys(this.userData).length > 0 && (n.userData = this.userData), t || (e.textures[this.uuid] = n), n;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(e) {
    if (this.mapping !== th) return e;
    if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1) switch (this.wrapS) {
      case is:
        e.x = e.x - Math.floor(e.x);
        break;
      case ni:
        e.x = e.x < 0 ? 0 : 1;
        break;
      case Pr:
        Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x = e.x - Math.floor(e.x);
        break;
    }
    if (e.y < 0 || e.y > 1) switch (this.wrapT) {
      case is:
        e.y = e.y - Math.floor(e.y);
        break;
      case ni:
        e.y = e.y < 0 ? 0 : 1;
        break;
      case Pr:
        Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y = e.y - Math.floor(e.y);
        break;
    }
    return this.flipY && (e.y = 1 - e.y), e;
  }
  set needsUpdate(e) {
    e === true && (this.version++, this.source.needsUpdate = true);
  }
  set needsPMREMUpdate(e) {
    e === true && this.pmremVersion++;
  }
}
bt.DEFAULT_IMAGE = null;
bt.DEFAULT_MAPPING = th;
bt.DEFAULT_ANISOTROPY = 1;
class Ke {
  constructor(e = 0, t = 0, n = 0, s = 1) {
    Ke.prototype.isVector4 = true, this.x = e, this.y = t, this.z = n, this.w = s;
  }
  get width() {
    return this.z;
  }
  set width(e) {
    this.z = e;
  }
  get height() {
    return this.w;
  }
  set height(e) {
    this.w = e;
  }
  set(e, t, n, s) {
    return this.x = e, this.y = t, this.z = n, this.w = s, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this.w = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setZ(e) {
    return this.z = e, this;
  }
  setW(e) {
    return this.w = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      case 3:
        this.w = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w !== void 0 ? e.w : 1, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this.w += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
  }
  applyMatrix4(e) {
    const t = this.x, n = this.y, s = this.z, r = this.w, a = e.elements;
    return this.x = a[0] * t + a[4] * n + a[8] * s + a[12] * r, this.y = a[1] * t + a[5] * n + a[9] * s + a[13] * r, this.z = a[2] * t + a[6] * n + a[10] * s + a[14] * r, this.w = a[3] * t + a[7] * n + a[11] * s + a[15] * r, this;
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this.w /= e.w, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  setAxisAngleFromQuaternion(e) {
    this.w = 2 * Math.acos(e.w);
    const t = Math.sqrt(1 - e.w * e.w);
    return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
  }
  setAxisAngleFromRotationMatrix(e) {
    let t, n, s, r;
    const l = e.elements, c = l[0], u = l[4], h = l[8], d = l[1], p = l[5], g = l[9], _ = l[2], m = l[6], f = l[10];
    if (Math.abs(u - d) < 0.01 && Math.abs(h - _) < 0.01 && Math.abs(g - m) < 0.01) {
      if (Math.abs(u + d) < 0.1 && Math.abs(h + _) < 0.1 && Math.abs(g + m) < 0.1 && Math.abs(c + p + f - 3) < 0.1) return this.set(1, 0, 0, 0), this;
      t = Math.PI;
      const E = (c + 1) / 2, y = (p + 1) / 2, w = (f + 1) / 2, C = (u + d) / 4, R = (h + _) / 4, N = (g + m) / 4;
      return E > y && E > w ? E < 0.01 ? (n = 0, s = 0.707106781, r = 0.707106781) : (n = Math.sqrt(E), s = C / n, r = R / n) : y > w ? y < 0.01 ? (n = 0.707106781, s = 0, r = 0.707106781) : (s = Math.sqrt(y), n = C / s, r = N / s) : w < 0.01 ? (n = 0.707106781, s = 0.707106781, r = 0) : (r = Math.sqrt(w), n = R / r, s = N / r), this.set(n, s, r, t), this;
    }
    let b = Math.sqrt((m - g) * (m - g) + (h - _) * (h - _) + (d - u) * (d - u));
    return Math.abs(b) < 1e-3 && (b = 1), this.x = (m - g) / b, this.y = (h - _) / b, this.z = (d - u) / b, this.w = Math.acos((c + p + f - 1) / 2), this;
  }
  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this.w = t[15], this;
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
  }
  clamp(e, t) {
    return this.x = ze(this.x, e.x, t.x), this.y = ze(this.y, e.y, t.y), this.z = ze(this.z, e.z, t.z), this.w = ze(this.w, e.w, t.w), this;
  }
  clampScalar(e, t) {
    return this.x = ze(this.x, e, t), this.y = ze(this.y, e, t), this.z = ze(this.z, e, t), this.w = ze(this.w, e, t), this;
  }
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(ze(n, e, t));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
  }
  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this.w = e.w + (t.w - e.w) * n, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class vd extends Ci {
  constructor(e = 1, t = 1, n = {}) {
    super(), n = Object.assign({ generateMipmaps: false, internalFormat: null, minFilter: Ht, depthBuffer: true, stencilBuffer: false, resolveDepthBuffer: true, resolveStencilBuffer: true, depthTexture: null, samples: 0, count: 1, depth: 1, multiview: false }, n), this.isRenderTarget = true, this.width = e, this.height = t, this.depth = n.depth, this.scissor = new Ke(0, 0, e, t), this.scissorTest = false, this.viewport = new Ke(0, 0, e, t);
    const s = { width: e, height: t, depth: n.depth }, r = new bt(s);
    this.textures = [];
    const a = n.count;
    for (let o = 0; o < a; o++) this.textures[o] = r.clone(), this.textures[o].isRenderTargetTexture = true, this.textures[o].renderTarget = this;
    this._setTextureOptions(n), this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this._depthTexture = null, this.depthTexture = n.depthTexture, this.samples = n.samples, this.multiview = n.multiview;
  }
  _setTextureOptions(e = {}) {
    const t = { minFilter: Ht, generateMipmaps: false, flipY: false, internalFormat: null };
    e.mapping !== void 0 && (t.mapping = e.mapping), e.wrapS !== void 0 && (t.wrapS = e.wrapS), e.wrapT !== void 0 && (t.wrapT = e.wrapT), e.wrapR !== void 0 && (t.wrapR = e.wrapR), e.magFilter !== void 0 && (t.magFilter = e.magFilter), e.minFilter !== void 0 && (t.minFilter = e.minFilter), e.format !== void 0 && (t.format = e.format), e.type !== void 0 && (t.type = e.type), e.anisotropy !== void 0 && (t.anisotropy = e.anisotropy), e.colorSpace !== void 0 && (t.colorSpace = e.colorSpace), e.flipY !== void 0 && (t.flipY = e.flipY), e.generateMipmaps !== void 0 && (t.generateMipmaps = e.generateMipmaps), e.internalFormat !== void 0 && (t.internalFormat = e.internalFormat);
    for (let n = 0; n < this.textures.length; n++) this.textures[n].setValues(t);
  }
  get texture() {
    return this.textures[0];
  }
  set texture(e) {
    this.textures[0] = e;
  }
  set depthTexture(e) {
    this._depthTexture !== null && (this._depthTexture.renderTarget = null), e !== null && (e.renderTarget = this), this._depthTexture = e;
  }
  get depthTexture() {
    return this._depthTexture;
  }
  setSize(e, t, n = 1) {
    if (this.width !== e || this.height !== t || this.depth !== n) {
      this.width = e, this.height = t, this.depth = n;
      for (let s = 0, r = this.textures.length; s < r; s++) this.textures[s].image.width = e, this.textures[s].image.height = t, this.textures[s].image.depth = n, this.textures[s].isArrayTexture = this.textures[s].image.depth > 1;
      this.dispose();
    }
    this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
    for (let t = 0, n = e.textures.length; t < n; t++) {
      this.textures[t] = e.textures[t].clone(), this.textures[t].isRenderTargetTexture = true, this.textures[t].renderTarget = this;
      const s = Object.assign({}, e.textures[t].image);
      this.textures[t].source = new jo(s);
    }
    return this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class bi extends vd {
  constructor(e = 1, t = 1, n = {}) {
    super(e, t, n), this.isWebGLRenderTarget = true;
  }
}
class fh extends bt {
  constructor(e = null, t = 1, n = 1, s = 1) {
    super(null), this.isDataArrayTexture = true, this.image = { data: e, width: t, height: n, depth: s }, this.magFilter = Nt, this.minFilter = Nt, this.wrapR = ni, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
  }
  addLayerUpdate(e) {
    this.layerUpdates.add(e);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class ph extends bt {
  constructor(e = null, t = 1, n = 1, s = 1) {
    super(null), this.isData3DTexture = true, this.image = { data: e, width: t, height: n, depth: s }, this.magFilter = Nt, this.minFilter = Nt, this.wrapR = ni, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
  }
}
class Kt {
  constructor(e = new L(1 / 0, 1 / 0, 1 / 0), t = new L(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = true, this.min = e, this.max = t;
  }
  set(e, t) {
    return this.min.copy(e), this.max.copy(t), this;
  }
  setFromArray(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t += 3) this.expandByPoint(nn.fromArray(e, t));
    return this;
  }
  setFromBufferAttribute(e) {
    this.makeEmpty();
    for (let t = 0, n = e.count; t < n; t++) this.expandByPoint(nn.fromBufferAttribute(e, t));
    return this;
  }
  setFromPoints(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
    return this;
  }
  setFromCenterAndSize(e, t) {
    const n = nn.copy(t).multiplyScalar(0.5);
    return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
  }
  setFromObject(e, t = false) {
    return this.makeEmpty(), this.expandByObject(e, t);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  getCenter(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
  }
  expandByPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }
  expandByVector(e) {
    return this.min.sub(e), this.max.add(e), this;
  }
  expandByScalar(e) {
    return this.min.addScalar(-e), this.max.addScalar(e), this;
  }
  expandByObject(e, t = false) {
    e.updateWorldMatrix(false, false);
    const n = e.geometry;
    if (n !== void 0) {
      const r = n.getAttribute("position");
      if (t === true && r !== void 0 && e.isInstancedMesh !== true) for (let a = 0, o = r.count; a < o; a++) e.isMesh === true ? e.getVertexPosition(a, nn) : nn.fromBufferAttribute(r, a), nn.applyMatrix4(e.matrixWorld), this.expandByPoint(nn);
      else e.boundingBox !== void 0 ? (e.boundingBox === null && e.computeBoundingBox(), qs.copy(e.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), qs.copy(n.boundingBox)), qs.applyMatrix4(e.matrixWorld), this.union(qs);
    }
    const s = e.children;
    for (let r = 0, a = s.length; r < a; r++) this.expandByObject(s[r], t);
    return this;
  }
  containsPoint(e) {
    return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
  }
  containsBox(e) {
    return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
  }
  getParameter(e, t) {
    return t.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y), (e.z - this.min.z) / (this.max.z - this.min.z));
  }
  intersectsBox(e) {
    return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
  }
  intersectsSphere(e) {
    return this.clampPoint(e.center, nn), nn.distanceToSquared(e.center) <= e.radius * e.radius;
  }
  intersectsPlane(e) {
    let t, n;
    return e.normal.x > 0 ? (t = e.normal.x * this.min.x, n = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, n = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, n += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, n += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, n += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, n += e.normal.z * this.min.z), t <= -e.constant && n >= -e.constant;
  }
  intersectsTriangle(e) {
    if (this.isEmpty()) return false;
    this.getCenter(xs), Ys.subVectors(this.max, xs), Ii.subVectors(e.a, xs), Ui.subVectors(e.b, xs), Ni.subVectors(e.c, xs), Gn.subVectors(Ui, Ii), Wn.subVectors(Ni, Ui), hi.subVectors(Ii, Ni);
    let t = [0, -Gn.z, Gn.y, 0, -Wn.z, Wn.y, 0, -hi.z, hi.y, Gn.z, 0, -Gn.x, Wn.z, 0, -Wn.x, hi.z, 0, -hi.x, -Gn.y, Gn.x, 0, -Wn.y, Wn.x, 0, -hi.y, hi.x, 0];
    return !Qr(t, Ii, Ui, Ni, Ys) || (t = [1, 0, 0, 0, 1, 0, 0, 0, 1], !Qr(t, Ii, Ui, Ni, Ys)) ? false : (js.crossVectors(Gn, Wn), t = [js.x, js.y, js.z], Qr(t, Ii, Ui, Ni, Ys));
  }
  clampPoint(e, t) {
    return t.copy(e).clamp(this.min, this.max);
  }
  distanceToPoint(e) {
    return this.clampPoint(e, nn).distanceTo(e);
  }
  getBoundingSphere(e) {
    return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(nn).length() * 0.5), e;
  }
  intersect(e) {
    return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }
  applyMatrix4(e) {
    return this.isEmpty() ? this : (Cn[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), Cn[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), Cn[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), Cn[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), Cn[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), Cn[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), Cn[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), Cn[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(Cn), this);
  }
  translate(e) {
    return this.min.add(e), this.max.add(e), this;
  }
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
  toJSON() {
    return { min: this.min.toArray(), max: this.max.toArray() };
  }
  fromJSON(e) {
    return this.min.fromArray(e.min), this.max.fromArray(e.max), this;
  }
}
const Cn = [new L(), new L(), new L(), new L(), new L(), new L(), new L(), new L()], nn = new L(), qs = new Kt(), Ii = new L(), Ui = new L(), Ni = new L(), Gn = new L(), Wn = new L(), hi = new L(), xs = new L(), Ys = new L(), js = new L(), ui = new L();
function Qr(i, e, t, n, s) {
  for (let r = 0, a = i.length - 3; r <= a; r += 3) {
    ui.fromArray(i, r);
    const o = s.x * Math.abs(ui.x) + s.y * Math.abs(ui.y) + s.z * Math.abs(ui.z), l = e.dot(ui), c = t.dot(ui), u = n.dot(ui);
    if (Math.max(-Math.max(l, c, u), Math.min(l, c, u)) > o) return false;
  }
  return true;
}
const yd = new Kt(), vs = new L(), ea = new L();
class An {
  constructor(e = new L(), t = -1) {
    this.isSphere = true, this.center = e, this.radius = t;
  }
  set(e, t) {
    return this.center.copy(e), this.radius = t, this;
  }
  setFromPoints(e, t) {
    const n = this.center;
    t !== void 0 ? n.copy(t) : yd.setFromPoints(e).getCenter(n);
    let s = 0;
    for (let r = 0, a = e.length; r < a; r++) s = Math.max(s, n.distanceToSquared(e[r]));
    return this.radius = Math.sqrt(s), this;
  }
  copy(e) {
    return this.center.copy(e.center), this.radius = e.radius, this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  containsPoint(e) {
    return e.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(e) {
    return e.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(e) {
    const t = this.radius + e.radius;
    return e.center.distanceToSquared(this.center) <= t * t;
  }
  intersectsBox(e) {
    return e.intersectsSphere(this);
  }
  intersectsPlane(e) {
    return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(e, t) {
    const n = this.center.distanceToSquared(e);
    return t.copy(e), n > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
  }
  getBoundingBox(e) {
    return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
  }
  applyMatrix4(e) {
    return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this;
  }
  translate(e) {
    return this.center.add(e), this;
  }
  expandByPoint(e) {
    if (this.isEmpty()) return this.center.copy(e), this.radius = 0, this;
    vs.subVectors(e, this.center);
    const t = vs.lengthSq();
    if (t > this.radius * this.radius) {
      const n = Math.sqrt(t), s = (n - this.radius) * 0.5;
      this.center.addScaledVector(vs, s / n), this.radius += s;
    }
    return this;
  }
  union(e) {
    return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === true ? this.radius = Math.max(this.radius, e.radius) : (ea.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(vs.copy(e.center).add(ea)), this.expandByPoint(vs.copy(e.center).sub(ea))), this);
  }
  equals(e) {
    return e.center.equals(this.center) && e.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    return { radius: this.radius, center: this.center.toArray() };
  }
  fromJSON(e) {
    return this.radius = e.radius, this.center.fromArray(e.center), this;
  }
}
const Pn = new L(), ta = new L(), Ks = new L(), Xn = new L(), na = new L(), Zs = new L(), ia = new L();
class us {
  constructor(e = new L(), t = new L(0, 0, -1)) {
    this.origin = e, this.direction = t;
  }
  set(e, t) {
    return this.origin.copy(e), this.direction.copy(t), this;
  }
  copy(e) {
    return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
  }
  at(e, t) {
    return t.copy(this.origin).addScaledVector(this.direction, e);
  }
  lookAt(e) {
    return this.direction.copy(e).sub(this.origin).normalize(), this;
  }
  recast(e) {
    return this.origin.copy(this.at(e, Pn)), this;
  }
  closestPointToPoint(e, t) {
    t.subVectors(e, this.origin);
    const n = t.dot(this.direction);
    return n < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, n);
  }
  distanceToPoint(e) {
    return Math.sqrt(this.distanceSqToPoint(e));
  }
  distanceSqToPoint(e) {
    const t = Pn.subVectors(e, this.origin).dot(this.direction);
    return t < 0 ? this.origin.distanceToSquared(e) : (Pn.copy(this.origin).addScaledVector(this.direction, t), Pn.distanceToSquared(e));
  }
  distanceSqToSegment(e, t, n, s) {
    ta.copy(e).add(t).multiplyScalar(0.5), Ks.copy(t).sub(e).normalize(), Xn.copy(this.origin).sub(ta);
    const r = e.distanceTo(t) * 0.5, a = -this.direction.dot(Ks), o = Xn.dot(this.direction), l = -Xn.dot(Ks), c = Xn.lengthSq(), u = Math.abs(1 - a * a);
    let h, d, p, g;
    if (u > 0) if (h = a * l - o, d = a * o - l, g = r * u, h >= 0) if (d >= -g) if (d <= g) {
      const _ = 1 / u;
      h *= _, d *= _, p = h * (h + a * d + 2 * o) + d * (a * h + d + 2 * l) + c;
    } else d = r, h = Math.max(0, -(a * d + o)), p = -h * h + d * (d + 2 * l) + c;
    else d = -r, h = Math.max(0, -(a * d + o)), p = -h * h + d * (d + 2 * l) + c;
    else d <= -g ? (h = Math.max(0, -(-a * r + o)), d = h > 0 ? -r : Math.min(Math.max(-r, -l), r), p = -h * h + d * (d + 2 * l) + c) : d <= g ? (h = 0, d = Math.min(Math.max(-r, -l), r), p = d * (d + 2 * l) + c) : (h = Math.max(0, -(a * r + o)), d = h > 0 ? r : Math.min(Math.max(-r, -l), r), p = -h * h + d * (d + 2 * l) + c);
    else d = a > 0 ? -r : r, h = Math.max(0, -(a * d + o)), p = -h * h + d * (d + 2 * l) + c;
    return n && n.copy(this.origin).addScaledVector(this.direction, h), s && s.copy(ta).addScaledVector(Ks, d), p;
  }
  intersectSphere(e, t) {
    Pn.subVectors(e.center, this.origin);
    const n = Pn.dot(this.direction), s = Pn.dot(Pn) - n * n, r = e.radius * e.radius;
    if (s > r) return null;
    const a = Math.sqrt(r - s), o = n - a, l = n + a;
    return l < 0 ? null : o < 0 ? this.at(l, t) : this.at(o, t);
  }
  intersectsSphere(e) {
    return e.radius < 0 ? false : this.distanceSqToPoint(e.center) <= e.radius * e.radius;
  }
  distanceToPlane(e) {
    const t = e.normal.dot(this.direction);
    if (t === 0) return e.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(e.normal) + e.constant) / t;
    return n >= 0 ? n : null;
  }
  intersectPlane(e, t) {
    const n = this.distanceToPlane(e);
    return n === null ? null : this.at(n, t);
  }
  intersectsPlane(e) {
    const t = e.distanceToPoint(this.origin);
    return t === 0 || e.normal.dot(this.direction) * t < 0;
  }
  intersectBox(e, t) {
    let n, s, r, a, o, l;
    const c = 1 / this.direction.x, u = 1 / this.direction.y, h = 1 / this.direction.z, d = this.origin;
    return c >= 0 ? (n = (e.min.x - d.x) * c, s = (e.max.x - d.x) * c) : (n = (e.max.x - d.x) * c, s = (e.min.x - d.x) * c), u >= 0 ? (r = (e.min.y - d.y) * u, a = (e.max.y - d.y) * u) : (r = (e.max.y - d.y) * u, a = (e.min.y - d.y) * u), n > a || r > s || ((r > n || isNaN(n)) && (n = r), (a < s || isNaN(s)) && (s = a), h >= 0 ? (o = (e.min.z - d.z) * h, l = (e.max.z - d.z) * h) : (o = (e.max.z - d.z) * h, l = (e.min.z - d.z) * h), n > l || o > s) || ((o > n || n !== n) && (n = o), (l < s || s !== s) && (s = l), s < 0) ? null : this.at(n >= 0 ? n : s, t);
  }
  intersectsBox(e) {
    return this.intersectBox(e, Pn) !== null;
  }
  intersectTriangle(e, t, n, s, r) {
    na.subVectors(t, e), Zs.subVectors(n, e), ia.crossVectors(na, Zs);
    let a = this.direction.dot(ia), o;
    if (a > 0) {
      if (s) return null;
      o = 1;
    } else if (a < 0) o = -1, a = -a;
    else return null;
    Xn.subVectors(this.origin, e);
    const l = o * this.direction.dot(Zs.crossVectors(Xn, Zs));
    if (l < 0) return null;
    const c = o * this.direction.dot(na.cross(Xn));
    if (c < 0 || l + c > a) return null;
    const u = -o * Xn.dot(ia);
    return u < 0 ? null : this.at(u / a, r);
  }
  applyMatrix4(e) {
    return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
  }
  equals(e) {
    return e.origin.equals(this.origin) && e.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Be {
  constructor(e, t, n, s, r, a, o, l, c, u, h, d, p, g, _, m) {
    Be.prototype.isMatrix4 = true, this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], e !== void 0 && this.set(e, t, n, s, r, a, o, l, c, u, h, d, p, g, _, m);
  }
  set(e, t, n, s, r, a, o, l, c, u, h, d, p, g, _, m) {
    const f = this.elements;
    return f[0] = e, f[4] = t, f[8] = n, f[12] = s, f[1] = r, f[5] = a, f[9] = o, f[13] = l, f[2] = c, f[6] = u, f[10] = h, f[14] = d, f[3] = p, f[7] = g, f[11] = _, f[15] = m, this;
  }
  identity() {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  clone() {
    return new Be().fromArray(this.elements);
  }
  copy(e) {
    const t = this.elements, n = e.elements;
    return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], this;
  }
  copyPosition(e) {
    const t = this.elements, n = e.elements;
    return t[12] = n[12], t[13] = n[13], t[14] = n[14], this;
  }
  setFromMatrix3(e) {
    const t = e.elements;
    return this.set(t[0], t[3], t[6], 0, t[1], t[4], t[7], 0, t[2], t[5], t[8], 0, 0, 0, 0, 1), this;
  }
  extractBasis(e, t, n) {
    return e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this;
  }
  makeBasis(e, t, n) {
    return this.set(e.x, t.x, n.x, 0, e.y, t.y, n.y, 0, e.z, t.z, n.z, 0, 0, 0, 0, 1), this;
  }
  extractRotation(e) {
    const t = this.elements, n = e.elements, s = 1 / Fi.setFromMatrixColumn(e, 0).length(), r = 1 / Fi.setFromMatrixColumn(e, 1).length(), a = 1 / Fi.setFromMatrixColumn(e, 2).length();
    return t[0] = n[0] * s, t[1] = n[1] * s, t[2] = n[2] * s, t[3] = 0, t[4] = n[4] * r, t[5] = n[5] * r, t[6] = n[6] * r, t[7] = 0, t[8] = n[8] * a, t[9] = n[9] * a, t[10] = n[10] * a, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }
  makeRotationFromEuler(e) {
    const t = this.elements, n = e.x, s = e.y, r = e.z, a = Math.cos(n), o = Math.sin(n), l = Math.cos(s), c = Math.sin(s), u = Math.cos(r), h = Math.sin(r);
    if (e.order === "XYZ") {
      const d = a * u, p = a * h, g = o * u, _ = o * h;
      t[0] = l * u, t[4] = -l * h, t[8] = c, t[1] = p + g * c, t[5] = d - _ * c, t[9] = -o * l, t[2] = _ - d * c, t[6] = g + p * c, t[10] = a * l;
    } else if (e.order === "YXZ") {
      const d = l * u, p = l * h, g = c * u, _ = c * h;
      t[0] = d + _ * o, t[4] = g * o - p, t[8] = a * c, t[1] = a * h, t[5] = a * u, t[9] = -o, t[2] = p * o - g, t[6] = _ + d * o, t[10] = a * l;
    } else if (e.order === "ZXY") {
      const d = l * u, p = l * h, g = c * u, _ = c * h;
      t[0] = d - _ * o, t[4] = -a * h, t[8] = g + p * o, t[1] = p + g * o, t[5] = a * u, t[9] = _ - d * o, t[2] = -a * c, t[6] = o, t[10] = a * l;
    } else if (e.order === "ZYX") {
      const d = a * u, p = a * h, g = o * u, _ = o * h;
      t[0] = l * u, t[4] = g * c - p, t[8] = d * c + _, t[1] = l * h, t[5] = _ * c + d, t[9] = p * c - g, t[2] = -c, t[6] = o * l, t[10] = a * l;
    } else if (e.order === "YZX") {
      const d = a * l, p = a * c, g = o * l, _ = o * c;
      t[0] = l * u, t[4] = _ - d * h, t[8] = g * h + p, t[1] = h, t[5] = a * u, t[9] = -o * u, t[2] = -c * u, t[6] = p * h + g, t[10] = d - _ * h;
    } else if (e.order === "XZY") {
      const d = a * l, p = a * c, g = o * l, _ = o * c;
      t[0] = l * u, t[4] = -h, t[8] = c * u, t[1] = d * h + _, t[5] = a * u, t[9] = p * h - g, t[2] = g * h - p, t[6] = o * u, t[10] = _ * h + d;
    }
    return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }
  makeRotationFromQuaternion(e) {
    return this.compose(Md, e, Sd);
  }
  lookAt(e, t, n) {
    const s = this.elements;
    return Wt.subVectors(e, t), Wt.lengthSq() === 0 && (Wt.z = 1), Wt.normalize(), qn.crossVectors(n, Wt), qn.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Wt.x += 1e-4 : Wt.z += 1e-4, Wt.normalize(), qn.crossVectors(n, Wt)), qn.normalize(), $s.crossVectors(Wt, qn), s[0] = qn.x, s[4] = $s.x, s[8] = Wt.x, s[1] = qn.y, s[5] = $s.y, s[9] = Wt.y, s[2] = qn.z, s[6] = $s.z, s[10] = Wt.z, this;
  }
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, t) {
    const n = e.elements, s = t.elements, r = this.elements, a = n[0], o = n[4], l = n[8], c = n[12], u = n[1], h = n[5], d = n[9], p = n[13], g = n[2], _ = n[6], m = n[10], f = n[14], b = n[3], E = n[7], y = n[11], w = n[15], C = s[0], R = s[4], N = s[8], S = s[12], M = s[1], P = s[5], k = s[9], V = s[13], j = s[2], q = s[6], W = s[10], K = s[14], z = s[3], ne = s[7], ce = s[11], Me = s[15];
    return r[0] = a * C + o * M + l * j + c * z, r[4] = a * R + o * P + l * q + c * ne, r[8] = a * N + o * k + l * W + c * ce, r[12] = a * S + o * V + l * K + c * Me, r[1] = u * C + h * M + d * j + p * z, r[5] = u * R + h * P + d * q + p * ne, r[9] = u * N + h * k + d * W + p * ce, r[13] = u * S + h * V + d * K + p * Me, r[2] = g * C + _ * M + m * j + f * z, r[6] = g * R + _ * P + m * q + f * ne, r[10] = g * N + _ * k + m * W + f * ce, r[14] = g * S + _ * V + m * K + f * Me, r[3] = b * C + E * M + y * j + w * z, r[7] = b * R + E * P + y * q + w * ne, r[11] = b * N + E * k + y * W + w * ce, r[15] = b * S + E * V + y * K + w * Me, this;
  }
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
  }
  determinant() {
    const e = this.elements, t = e[0], n = e[4], s = e[8], r = e[12], a = e[1], o = e[5], l = e[9], c = e[13], u = e[2], h = e[6], d = e[10], p = e[14], g = e[3], _ = e[7], m = e[11], f = e[15];
    return g * (+r * l * h - s * c * h - r * o * d + n * c * d + s * o * p - n * l * p) + _ * (+t * l * p - t * c * d + r * a * d - s * a * p + s * c * u - r * l * u) + m * (+t * c * h - t * o * p - r * a * h + n * a * p + r * o * u - n * c * u) + f * (-s * o * u - t * l * h + t * o * d + s * a * h - n * a * d + n * l * u);
  }
  transpose() {
    const e = this.elements;
    let t;
    return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
  }
  setPosition(e, t, n) {
    const s = this.elements;
    return e.isVector3 ? (s[12] = e.x, s[13] = e.y, s[14] = e.z) : (s[12] = e, s[13] = t, s[14] = n), this;
  }
  invert() {
    const e = this.elements, t = e[0], n = e[1], s = e[2], r = e[3], a = e[4], o = e[5], l = e[6], c = e[7], u = e[8], h = e[9], d = e[10], p = e[11], g = e[12], _ = e[13], m = e[14], f = e[15], b = h * m * c - _ * d * c + _ * l * p - o * m * p - h * l * f + o * d * f, E = g * d * c - u * m * c - g * l * p + a * m * p + u * l * f - a * d * f, y = u * _ * c - g * h * c + g * o * p - a * _ * p - u * o * f + a * h * f, w = g * h * l - u * _ * l - g * o * d + a * _ * d + u * o * m - a * h * m, C = t * b + n * E + s * y + r * w;
    if (C === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const R = 1 / C;
    return e[0] = b * R, e[1] = (_ * d * r - h * m * r - _ * s * p + n * m * p + h * s * f - n * d * f) * R, e[2] = (o * m * r - _ * l * r + _ * s * c - n * m * c - o * s * f + n * l * f) * R, e[3] = (h * l * r - o * d * r - h * s * c + n * d * c + o * s * p - n * l * p) * R, e[4] = E * R, e[5] = (u * m * r - g * d * r + g * s * p - t * m * p - u * s * f + t * d * f) * R, e[6] = (g * l * r - a * m * r - g * s * c + t * m * c + a * s * f - t * l * f) * R, e[7] = (a * d * r - u * l * r + u * s * c - t * d * c - a * s * p + t * l * p) * R, e[8] = y * R, e[9] = (g * h * r - u * _ * r - g * n * p + t * _ * p + u * n * f - t * h * f) * R, e[10] = (a * _ * r - g * o * r + g * n * c - t * _ * c - a * n * f + t * o * f) * R, e[11] = (u * o * r - a * h * r - u * n * c + t * h * c + a * n * p - t * o * p) * R, e[12] = w * R, e[13] = (u * _ * s - g * h * s + g * n * d - t * _ * d - u * n * m + t * h * m) * R, e[14] = (g * o * s - a * _ * s - g * n * l + t * _ * l + a * n * m - t * o * m) * R, e[15] = (a * h * s - u * o * s + u * n * l - t * h * l - a * n * d + t * o * d) * R, this;
  }
  scale(e) {
    const t = this.elements, n = e.x, s = e.y, r = e.z;
    return t[0] *= n, t[4] *= s, t[8] *= r, t[1] *= n, t[5] *= s, t[9] *= r, t[2] *= n, t[6] *= s, t[10] *= r, t[3] *= n, t[7] *= s, t[11] *= r, this;
  }
  getMaxScaleOnAxis() {
    const e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], s = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
    return Math.sqrt(Math.max(t, n, s));
  }
  makeTranslation(e, t, n) {
    return e.isVector3 ? this.set(1, 0, 0, e.x, 0, 1, 0, e.y, 0, 0, 1, e.z, 0, 0, 0, 1) : this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, n, 0, 0, 0, 1), this;
  }
  makeRotationX(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(1, 0, 0, 0, 0, t, -n, 0, 0, n, t, 0, 0, 0, 0, 1), this;
  }
  makeRotationY(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(t, 0, n, 0, 0, 1, 0, 0, -n, 0, t, 0, 0, 0, 0, 1), this;
  }
  makeRotationZ(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(t, -n, 0, 0, n, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  makeRotationAxis(e, t) {
    const n = Math.cos(t), s = Math.sin(t), r = 1 - n, a = e.x, o = e.y, l = e.z, c = r * a, u = r * o;
    return this.set(c * a + n, c * o - s * l, c * l + s * o, 0, c * o + s * l, u * o + n, u * l - s * a, 0, c * l - s * o, u * l + s * a, r * l * l + n, 0, 0, 0, 0, 1), this;
  }
  makeScale(e, t, n) {
    return this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
  }
  makeShear(e, t, n, s, r, a) {
    return this.set(1, n, r, 0, e, 1, a, 0, t, s, 1, 0, 0, 0, 0, 1), this;
  }
  compose(e, t, n) {
    const s = this.elements, r = t._x, a = t._y, o = t._z, l = t._w, c = r + r, u = a + a, h = o + o, d = r * c, p = r * u, g = r * h, _ = a * u, m = a * h, f = o * h, b = l * c, E = l * u, y = l * h, w = n.x, C = n.y, R = n.z;
    return s[0] = (1 - (_ + f)) * w, s[1] = (p + y) * w, s[2] = (g - E) * w, s[3] = 0, s[4] = (p - y) * C, s[5] = (1 - (d + f)) * C, s[6] = (m + b) * C, s[7] = 0, s[8] = (g + E) * R, s[9] = (m - b) * R, s[10] = (1 - (d + _)) * R, s[11] = 0, s[12] = e.x, s[13] = e.y, s[14] = e.z, s[15] = 1, this;
  }
  decompose(e, t, n) {
    const s = this.elements;
    let r = Fi.set(s[0], s[1], s[2]).length();
    const a = Fi.set(s[4], s[5], s[6]).length(), o = Fi.set(s[8], s[9], s[10]).length();
    this.determinant() < 0 && (r = -r), e.x = s[12], e.y = s[13], e.z = s[14], sn.copy(this);
    const c = 1 / r, u = 1 / a, h = 1 / o;
    return sn.elements[0] *= c, sn.elements[1] *= c, sn.elements[2] *= c, sn.elements[4] *= u, sn.elements[5] *= u, sn.elements[6] *= u, sn.elements[8] *= h, sn.elements[9] *= h, sn.elements[10] *= h, t.setFromRotationMatrix(sn), n.x = r, n.y = a, n.z = o, this;
  }
  makePerspective(e, t, n, s, r, a, o = Sn, l = false) {
    const c = this.elements, u = 2 * r / (t - e), h = 2 * r / (n - s), d = (t + e) / (t - e), p = (n + s) / (n - s);
    let g, _;
    if (l) g = r / (a - r), _ = a * r / (a - r);
    else if (o === Sn) g = -(a + r) / (a - r), _ = -2 * a * r / (a - r);
    else if (o === Dr) g = -a / (a - r), _ = -a * r / (a - r);
    else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return c[0] = u, c[4] = 0, c[8] = d, c[12] = 0, c[1] = 0, c[5] = h, c[9] = p, c[13] = 0, c[2] = 0, c[6] = 0, c[10] = g, c[14] = _, c[3] = 0, c[7] = 0, c[11] = -1, c[15] = 0, this;
  }
  makeOrthographic(e, t, n, s, r, a, o = Sn, l = false) {
    const c = this.elements, u = 2 / (t - e), h = 2 / (n - s), d = -(t + e) / (t - e), p = -(n + s) / (n - s);
    let g, _;
    if (l) g = 1 / (a - r), _ = a / (a - r);
    else if (o === Sn) g = -2 / (a - r), _ = -(a + r) / (a - r);
    else if (o === Dr) g = -1 / (a - r), _ = -r / (a - r);
    else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return c[0] = u, c[4] = 0, c[8] = 0, c[12] = d, c[1] = 0, c[5] = h, c[9] = 0, c[13] = p, c[2] = 0, c[6] = 0, c[10] = g, c[14] = _, c[3] = 0, c[7] = 0, c[11] = 0, c[15] = 1, this;
  }
  equals(e) {
    const t = this.elements, n = e.elements;
    for (let s = 0; s < 16; s++) if (t[s] !== n[s]) return false;
    return true;
  }
  fromArray(e, t = 0) {
    for (let n = 0; n < 16; n++) this.elements[n] = e[n + t];
    return this;
  }
  toArray(e = [], t = 0) {
    const n = this.elements;
    return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e[t + 9] = n[9], e[t + 10] = n[10], e[t + 11] = n[11], e[t + 12] = n[12], e[t + 13] = n[13], e[t + 14] = n[14], e[t + 15] = n[15], e;
  }
}
const Fi = new L(), sn = new Be(), Md = new L(0, 0, 0), Sd = new L(1, 1, 1), qn = new L(), $s = new L(), Wt = new L(), Ll = new Be(), Dl = new Tn();
class fn {
  constructor(e = 0, t = 0, n = 0, s = fn.DEFAULT_ORDER) {
    this.isEuler = true, this._x = e, this._y = t, this._z = n, this._order = s;
  }
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(e) {
    this._order = e, this._onChangeCallback();
  }
  set(e, t, n, s = this._order) {
    return this._x = e, this._y = t, this._z = n, this._order = s, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(e) {
    return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
  }
  setFromRotationMatrix(e, t = this._order, n = true) {
    const s = e.elements, r = s[0], a = s[4], o = s[8], l = s[1], c = s[5], u = s[9], h = s[2], d = s[6], p = s[10];
    switch (t) {
      case "XYZ":
        this._y = Math.asin(ze(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-u, p), this._z = Math.atan2(-a, r)) : (this._x = Math.atan2(d, c), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-ze(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._y = Math.atan2(o, p), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-h, r), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(ze(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._y = Math.atan2(-h, p), this._z = Math.atan2(-a, c)) : (this._y = 0, this._z = Math.atan2(l, r));
        break;
      case "ZYX":
        this._y = Math.asin(-ze(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._x = Math.atan2(d, p), this._z = Math.atan2(l, r)) : (this._x = 0, this._z = Math.atan2(-a, c));
        break;
      case "YZX":
        this._z = Math.asin(ze(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._x = Math.atan2(-u, c), this._y = Math.atan2(-h, r)) : (this._x = 0, this._y = Math.atan2(o, p));
        break;
      case "XZY":
        this._z = Math.asin(-ze(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(d, c), this._y = Math.atan2(o, r)) : (this._x = Math.atan2(-u, p), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
    }
    return this._order = t, n === true && this._onChangeCallback(), this;
  }
  setFromQuaternion(e, t, n) {
    return Ll.makeRotationFromQuaternion(e), this.setFromRotationMatrix(Ll, t, n);
  }
  setFromVector3(e, t = this._order) {
    return this.set(e.x, e.y, e.z, t);
  }
  reorder(e) {
    return Dl.setFromEuler(this), this.setFromQuaternion(Dl, e);
  }
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
  }
  fromArray(e) {
    return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
fn.DEFAULT_ORDER = "XYZ";
class Ko {
  constructor() {
    this.mask = 1;
  }
  set(e) {
    this.mask = (1 << e | 0) >>> 0;
  }
  enable(e) {
    this.mask |= 1 << e | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(e) {
    this.mask ^= 1 << e | 0;
  }
  disable(e) {
    this.mask &= ~(1 << e | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(e) {
    return (this.mask & e.mask) !== 0;
  }
  isEnabled(e) {
    return (this.mask & (1 << e | 0)) !== 0;
  }
}
let Ed = 0;
const Il = new L(), Oi = new Tn(), Ln = new Be(), Js = new L(), ys = new L(), Td = new L(), bd = new Tn(), Ul = new L(1, 0, 0), Nl = new L(0, 1, 0), Fl = new L(0, 0, 1), Ol = { type: "added" }, Ad = { type: "removed" }, Bi = { type: "childadded", child: null }, sa = { type: "childremoved", child: null };
class ot extends Ci {
  constructor() {
    super(), this.isObject3D = true, Object.defineProperty(this, "id", { value: Ed++ }), this.uuid = un(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = ot.DEFAULT_UP.clone();
    const e = new L(), t = new fn(), n = new Tn(), s = new L(1, 1, 1);
    function r() {
      n.setFromEuler(t, false);
    }
    function a() {
      t.setFromQuaternion(n, void 0, false);
    }
    t._onChange(r), n._onChange(a), Object.defineProperties(this, { position: { configurable: true, enumerable: true, value: e }, rotation: { configurable: true, enumerable: true, value: t }, quaternion: { configurable: true, enumerable: true, value: n }, scale: { configurable: true, enumerable: true, value: s }, modelViewMatrix: { value: new Be() }, normalMatrix: { value: new Oe() } }), this.matrix = new Be(), this.matrixWorld = new Be(), this.matrixAutoUpdate = ot.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = false, this.layers = new Ko(), this.visible = true, this.castShadow = false, this.receiveShadow = false, this.frustumCulled = true, this.renderOrder = 0, this.animations = [], this.customDepthMaterial = void 0, this.customDistanceMaterial = void 0, this.userData = {};
  }
  onBeforeShadow() {
  }
  onAfterShadow() {
  }
  onBeforeRender() {
  }
  onAfterRender() {
  }
  applyMatrix4(e) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(e) {
    return this.quaternion.premultiply(e), this;
  }
  setRotationFromAxisAngle(e, t) {
    this.quaternion.setFromAxisAngle(e, t);
  }
  setRotationFromEuler(e) {
    this.quaternion.setFromEuler(e, true);
  }
  setRotationFromMatrix(e) {
    this.quaternion.setFromRotationMatrix(e);
  }
  setRotationFromQuaternion(e) {
    this.quaternion.copy(e);
  }
  rotateOnAxis(e, t) {
    return Oi.setFromAxisAngle(e, t), this.quaternion.multiply(Oi), this;
  }
  rotateOnWorldAxis(e, t) {
    return Oi.setFromAxisAngle(e, t), this.quaternion.premultiply(Oi), this;
  }
  rotateX(e) {
    return this.rotateOnAxis(Ul, e);
  }
  rotateY(e) {
    return this.rotateOnAxis(Nl, e);
  }
  rotateZ(e) {
    return this.rotateOnAxis(Fl, e);
  }
  translateOnAxis(e, t) {
    return Il.copy(e).applyQuaternion(this.quaternion), this.position.add(Il.multiplyScalar(t)), this;
  }
  translateX(e) {
    return this.translateOnAxis(Ul, e);
  }
  translateY(e) {
    return this.translateOnAxis(Nl, e);
  }
  translateZ(e) {
    return this.translateOnAxis(Fl, e);
  }
  localToWorld(e) {
    return this.updateWorldMatrix(true, false), e.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(e) {
    return this.updateWorldMatrix(true, false), e.applyMatrix4(Ln.copy(this.matrixWorld).invert());
  }
  lookAt(e, t, n) {
    e.isVector3 ? Js.copy(e) : Js.set(e, t, n);
    const s = this.parent;
    this.updateWorldMatrix(true, false), ys.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? Ln.lookAt(ys, Js, this.up) : Ln.lookAt(Js, ys, this.up), this.quaternion.setFromRotationMatrix(Ln), s && (Ln.extractRotation(s.matrixWorld), Oi.setFromRotationMatrix(Ln), this.quaternion.premultiply(Oi.invert()));
  }
  add(e) {
    if (arguments.length > 1) {
      for (let t = 0; t < arguments.length; t++) this.add(arguments[t]);
      return this;
    }
    return e === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(Ol), Bi.child = e, this.dispatchEvent(Bi), Bi.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", e), this);
  }
  remove(e) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++) this.remove(arguments[n]);
      return this;
    }
    const t = this.children.indexOf(e);
    return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(Ad), sa.child = e, this.dispatchEvent(sa), sa.child = null), this;
  }
  removeFromParent() {
    const e = this.parent;
    return e !== null && e.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(e) {
    return this.updateWorldMatrix(true, false), Ln.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(true, false), Ln.multiply(e.parent.matrixWorld)), e.applyMatrix4(Ln), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(false, true), e.dispatchEvent(Ol), Bi.child = e, this.dispatchEvent(Bi), Bi.child = null, this;
  }
  getObjectById(e) {
    return this.getObjectByProperty("id", e);
  }
  getObjectByName(e) {
    return this.getObjectByProperty("name", e);
  }
  getObjectByProperty(e, t) {
    if (this[e] === t) return this;
    for (let n = 0, s = this.children.length; n < s; n++) {
      const a = this.children[n].getObjectByProperty(e, t);
      if (a !== void 0) return a;
    }
  }
  getObjectsByProperty(e, t, n = []) {
    this[e] === t && n.push(this);
    const s = this.children;
    for (let r = 0, a = s.length; r < a; r++) s[r].getObjectsByProperty(e, t, n);
    return n;
  }
  getWorldPosition(e) {
    return this.updateWorldMatrix(true, false), e.setFromMatrixPosition(this.matrixWorld);
  }
  getWorldQuaternion(e) {
    return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(ys, e, Td), e;
  }
  getWorldScale(e) {
    return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(ys, bd, e), e;
  }
  getWorldDirection(e) {
    this.updateWorldMatrix(true, false);
    const t = this.matrixWorld.elements;
    return e.set(t[8], t[9], t[10]).normalize();
  }
  raycast() {
  }
  traverse(e) {
    e(this);
    const t = this.children;
    for (let n = 0, s = t.length; n < s; n++) t[n].traverse(e);
  }
  traverseVisible(e) {
    if (this.visible === false) return;
    e(this);
    const t = this.children;
    for (let n = 0, s = t.length; n < s; n++) t[n].traverseVisible(e);
  }
  traverseAncestors(e) {
    const t = this.parent;
    t !== null && (e(t), t.traverseAncestors(e));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = true;
  }
  updateMatrixWorld(e) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = false, e = true);
    const t = this.children;
    for (let n = 0, s = t.length; n < s; n++) t[n].updateMatrixWorld(e);
  }
  updateWorldMatrix(e, t) {
    const n = this.parent;
    if (e === true && n !== null && n.updateWorldMatrix(true, false), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), t === true) {
      const s = this.children;
      for (let r = 0, a = s.length; r < a; r++) s[r].updateWorldMatrix(false, true);
    }
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string", n = {};
    t && (e = { geometries: {}, materials: {}, textures: {}, images: {}, shapes: {}, skeletons: {}, animations: {}, nodes: {} }, n.metadata = { version: 4.7, type: "Object", generator: "Object3D.toJSON" });
    const s = {};
    s.uuid = this.uuid, s.type = this.type, this.name !== "" && (s.name = this.name), this.castShadow === true && (s.castShadow = true), this.receiveShadow === true && (s.receiveShadow = true), this.visible === false && (s.visible = false), this.frustumCulled === false && (s.frustumCulled = false), this.renderOrder !== 0 && (s.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (s.userData = this.userData), s.layers = this.layers.mask, s.matrix = this.matrix.toArray(), s.up = this.up.toArray(), this.matrixAutoUpdate === false && (s.matrixAutoUpdate = false), this.isInstancedMesh && (s.type = "InstancedMesh", s.count = this.count, s.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (s.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (s.type = "BatchedMesh", s.perObjectFrustumCulled = this.perObjectFrustumCulled, s.sortObjects = this.sortObjects, s.drawRanges = this._drawRanges, s.reservedRanges = this._reservedRanges, s.geometryInfo = this._geometryInfo.map((o) => ({ ...o, boundingBox: o.boundingBox ? o.boundingBox.toJSON() : void 0, boundingSphere: o.boundingSphere ? o.boundingSphere.toJSON() : void 0 })), s.instanceInfo = this._instanceInfo.map((o) => ({ ...o })), s.availableInstanceIds = this._availableInstanceIds.slice(), s.availableGeometryIds = this._availableGeometryIds.slice(), s.nextIndexStart = this._nextIndexStart, s.nextVertexStart = this._nextVertexStart, s.geometryCount = this._geometryCount, s.maxInstanceCount = this._maxInstanceCount, s.maxVertexCount = this._maxVertexCount, s.maxIndexCount = this._maxIndexCount, s.geometryInitialized = this._geometryInitialized, s.matricesTexture = this._matricesTexture.toJSON(e), s.indirectTexture = this._indirectTexture.toJSON(e), this._colorsTexture !== null && (s.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (s.boundingSphere = this.boundingSphere.toJSON()), this.boundingBox !== null && (s.boundingBox = this.boundingBox.toJSON()));
    function r(o, l) {
      return o[l.uuid] === void 0 && (o[l.uuid] = l.toJSON(e)), l.uuid;
    }
    if (this.isScene) this.background && (this.background.isColor ? s.background = this.background.toJSON() : this.background.isTexture && (s.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== true && (s.environment = this.environment.toJSON(e).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      s.geometry = r(e.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const l = o.shapes;
        if (Array.isArray(l)) for (let c = 0, u = l.length; c < u; c++) {
          const h = l[c];
          r(e.shapes, h);
        }
        else r(e.shapes, l);
      }
    }
    if (this.isSkinnedMesh && (s.bindMode = this.bindMode, s.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (r(e.skeletons, this.skeleton), s.skeleton = this.skeleton.uuid)), this.material !== void 0) if (Array.isArray(this.material)) {
      const o = [];
      for (let l = 0, c = this.material.length; l < c; l++) o.push(r(e.materials, this.material[l]));
      s.material = o;
    } else s.material = r(e.materials, this.material);
    if (this.children.length > 0) {
      s.children = [];
      for (let o = 0; o < this.children.length; o++) s.children.push(this.children[o].toJSON(e).object);
    }
    if (this.animations.length > 0) {
      s.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const l = this.animations[o];
        s.animations.push(r(e.animations, l));
      }
    }
    if (t) {
      const o = a(e.geometries), l = a(e.materials), c = a(e.textures), u = a(e.images), h = a(e.shapes), d = a(e.skeletons), p = a(e.animations), g = a(e.nodes);
      o.length > 0 && (n.geometries = o), l.length > 0 && (n.materials = l), c.length > 0 && (n.textures = c), u.length > 0 && (n.images = u), h.length > 0 && (n.shapes = h), d.length > 0 && (n.skeletons = d), p.length > 0 && (n.animations = p), g.length > 0 && (n.nodes = g);
    }
    return n.object = s, n;
    function a(o) {
      const l = [];
      for (const c in o) {
        const u = o[c];
        delete u.metadata, l.push(u);
      }
      return l;
    }
  }
  clone(e) {
    return new this.constructor().copy(this, e);
  }
  copy(e, t = true) {
    if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === true) for (let n = 0; n < e.children.length; n++) {
      const s = e.children[n];
      this.add(s.clone());
    }
    return this;
  }
}
ot.DEFAULT_UP = new L(0, 1, 0);
ot.DEFAULT_MATRIX_AUTO_UPDATE = true;
ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
const rn = new L(), Dn = new L(), ra = new L(), In = new L(), ki = new L(), zi = new L(), Bl = new L(), aa = new L(), oa = new L(), la = new L(), ca = new Ke(), ha = new Ke(), ua = new Ke();
class cn {
  constructor(e = new L(), t = new L(), n = new L()) {
    this.a = e, this.b = t, this.c = n;
  }
  static getNormal(e, t, n, s) {
    s.subVectors(n, t), rn.subVectors(e, t), s.cross(rn);
    const r = s.lengthSq();
    return r > 0 ? s.multiplyScalar(1 / Math.sqrt(r)) : s.set(0, 0, 0);
  }
  static getBarycoord(e, t, n, s, r) {
    rn.subVectors(s, t), Dn.subVectors(n, t), ra.subVectors(e, t);
    const a = rn.dot(rn), o = rn.dot(Dn), l = rn.dot(ra), c = Dn.dot(Dn), u = Dn.dot(ra), h = a * c - o * o;
    if (h === 0) return r.set(0, 0, 0), null;
    const d = 1 / h, p = (c * l - o * u) * d, g = (a * u - o * l) * d;
    return r.set(1 - p - g, g, p);
  }
  static containsPoint(e, t, n, s) {
    return this.getBarycoord(e, t, n, s, In) === null ? false : In.x >= 0 && In.y >= 0 && In.x + In.y <= 1;
  }
  static getInterpolation(e, t, n, s, r, a, o, l) {
    return this.getBarycoord(e, t, n, s, In) === null ? (l.x = 0, l.y = 0, "z" in l && (l.z = 0), "w" in l && (l.w = 0), null) : (l.setScalar(0), l.addScaledVector(r, In.x), l.addScaledVector(a, In.y), l.addScaledVector(o, In.z), l);
  }
  static getInterpolatedAttribute(e, t, n, s, r, a) {
    return ca.setScalar(0), ha.setScalar(0), ua.setScalar(0), ca.fromBufferAttribute(e, t), ha.fromBufferAttribute(e, n), ua.fromBufferAttribute(e, s), a.setScalar(0), a.addScaledVector(ca, r.x), a.addScaledVector(ha, r.y), a.addScaledVector(ua, r.z), a;
  }
  static isFrontFacing(e, t, n, s) {
    return rn.subVectors(n, t), Dn.subVectors(e, t), rn.cross(Dn).dot(s) < 0;
  }
  set(e, t, n) {
    return this.a.copy(e), this.b.copy(t), this.c.copy(n), this;
  }
  setFromPointsAndIndices(e, t, n, s) {
    return this.a.copy(e[t]), this.b.copy(e[n]), this.c.copy(e[s]), this;
  }
  setFromAttributeAndIndices(e, t, n, s) {
    return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, n), this.c.fromBufferAttribute(e, s), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
  }
  getArea() {
    return rn.subVectors(this.c, this.b), Dn.subVectors(this.a, this.b), rn.cross(Dn).length() * 0.5;
  }
  getMidpoint(e) {
    return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  getNormal(e) {
    return cn.getNormal(this.a, this.b, this.c, e);
  }
  getPlane(e) {
    return e.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(e, t) {
    return cn.getBarycoord(e, this.a, this.b, this.c, t);
  }
  getInterpolation(e, t, n, s, r) {
    return cn.getInterpolation(e, this.a, this.b, this.c, t, n, s, r);
  }
  containsPoint(e) {
    return cn.containsPoint(e, this.a, this.b, this.c);
  }
  isFrontFacing(e) {
    return cn.isFrontFacing(this.a, this.b, this.c, e);
  }
  intersectsBox(e) {
    return e.intersectsTriangle(this);
  }
  closestPointToPoint(e, t) {
    const n = this.a, s = this.b, r = this.c;
    let a, o;
    ki.subVectors(s, n), zi.subVectors(r, n), aa.subVectors(e, n);
    const l = ki.dot(aa), c = zi.dot(aa);
    if (l <= 0 && c <= 0) return t.copy(n);
    oa.subVectors(e, s);
    const u = ki.dot(oa), h = zi.dot(oa);
    if (u >= 0 && h <= u) return t.copy(s);
    const d = l * h - u * c;
    if (d <= 0 && l >= 0 && u <= 0) return a = l / (l - u), t.copy(n).addScaledVector(ki, a);
    la.subVectors(e, r);
    const p = ki.dot(la), g = zi.dot(la);
    if (g >= 0 && p <= g) return t.copy(r);
    const _ = p * c - l * g;
    if (_ <= 0 && c >= 0 && g <= 0) return o = c / (c - g), t.copy(n).addScaledVector(zi, o);
    const m = u * g - p * h;
    if (m <= 0 && h - u >= 0 && p - g >= 0) return Bl.subVectors(r, s), o = (h - u) / (h - u + (p - g)), t.copy(s).addScaledVector(Bl, o);
    const f = 1 / (m + _ + d);
    return a = _ * f, o = d * f, t.copy(n).addScaledVector(ki, a).addScaledVector(zi, o);
  }
  equals(e) {
    return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
  }
}
const mh = { aliceblue: 15792383, antiquewhite: 16444375, aqua: 65535, aquamarine: 8388564, azure: 15794175, beige: 16119260, bisque: 16770244, black: 0, blanchedalmond: 16772045, blue: 255, blueviolet: 9055202, brown: 10824234, burlywood: 14596231, cadetblue: 6266528, chartreuse: 8388352, chocolate: 13789470, coral: 16744272, cornflowerblue: 6591981, cornsilk: 16775388, crimson: 14423100, cyan: 65535, darkblue: 139, darkcyan: 35723, darkgoldenrod: 12092939, darkgray: 11119017, darkgreen: 25600, darkgrey: 11119017, darkkhaki: 12433259, darkmagenta: 9109643, darkolivegreen: 5597999, darkorange: 16747520, darkorchid: 10040012, darkred: 9109504, darksalmon: 15308410, darkseagreen: 9419919, darkslateblue: 4734347, darkslategray: 3100495, darkslategrey: 3100495, darkturquoise: 52945, darkviolet: 9699539, deeppink: 16716947, deepskyblue: 49151, dimgray: 6908265, dimgrey: 6908265, dodgerblue: 2003199, firebrick: 11674146, floralwhite: 16775920, forestgreen: 2263842, fuchsia: 16711935, gainsboro: 14474460, ghostwhite: 16316671, gold: 16766720, goldenrod: 14329120, gray: 8421504, green: 32768, greenyellow: 11403055, grey: 8421504, honeydew: 15794160, hotpink: 16738740, indianred: 13458524, indigo: 4915330, ivory: 16777200, khaki: 15787660, lavender: 15132410, lavenderblush: 16773365, lawngreen: 8190976, lemonchiffon: 16775885, lightblue: 11393254, lightcoral: 15761536, lightcyan: 14745599, lightgoldenrodyellow: 16448210, lightgray: 13882323, lightgreen: 9498256, lightgrey: 13882323, lightpink: 16758465, lightsalmon: 16752762, lightseagreen: 2142890, lightskyblue: 8900346, lightslategray: 7833753, lightslategrey: 7833753, lightsteelblue: 11584734, lightyellow: 16777184, lime: 65280, limegreen: 3329330, linen: 16445670, magenta: 16711935, maroon: 8388608, mediumaquamarine: 6737322, mediumblue: 205, mediumorchid: 12211667, mediumpurple: 9662683, mediumseagreen: 3978097, mediumslateblue: 8087790, mediumspringgreen: 64154, mediumturquoise: 4772300, mediumvioletred: 13047173, midnightblue: 1644912, mintcream: 16121850, mistyrose: 16770273, moccasin: 16770229, navajowhite: 16768685, navy: 128, oldlace: 16643558, olive: 8421376, olivedrab: 7048739, orange: 16753920, orangered: 16729344, orchid: 14315734, palegoldenrod: 15657130, palegreen: 10025880, paleturquoise: 11529966, palevioletred: 14381203, papayawhip: 16773077, peachpuff: 16767673, peru: 13468991, pink: 16761035, plum: 14524637, powderblue: 11591910, purple: 8388736, rebeccapurple: 6697881, red: 16711680, rosybrown: 12357519, royalblue: 4286945, saddlebrown: 9127187, salmon: 16416882, sandybrown: 16032864, seagreen: 3050327, seashell: 16774638, sienna: 10506797, silver: 12632256, skyblue: 8900331, slateblue: 6970061, slategray: 7372944, slategrey: 7372944, snow: 16775930, springgreen: 65407, steelblue: 4620980, tan: 13808780, teal: 32896, thistle: 14204888, tomato: 16737095, turquoise: 4251856, violet: 15631086, wheat: 16113331, white: 16777215, whitesmoke: 16119285, yellow: 16776960, yellowgreen: 10145074 }, Yn = { h: 0, s: 0, l: 0 }, Qs = { h: 0, s: 0, l: 0 };
function da(i, e, t) {
  return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? i + (e - i) * 6 * t : t < 1 / 2 ? e : t < 2 / 3 ? i + (e - i) * 6 * (2 / 3 - t) : i;
}
class we {
  constructor(e, t, n) {
    return this.isColor = true, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, n);
  }
  set(e, t, n) {
    if (t === void 0 && n === void 0) {
      const s = e;
      s && s.isColor ? this.copy(s) : typeof s == "number" ? this.setHex(s) : typeof s == "string" && this.setStyle(s);
    } else this.setRGB(e, t, n);
    return this;
  }
  setScalar(e) {
    return this.r = e, this.g = e, this.b = e, this;
  }
  setHex(e, t = yt) {
    return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, qe.colorSpaceToWorking(this, t), this;
  }
  setRGB(e, t, n, s = qe.workingColorSpace) {
    return this.r = e, this.g = t, this.b = n, qe.colorSpaceToWorking(this, s), this;
  }
  setHSL(e, t, n, s = qe.workingColorSpace) {
    if (e = Yo(e, 1), t = ze(t, 0, 1), n = ze(n, 0, 1), t === 0) this.r = this.g = this.b = n;
    else {
      const r = n <= 0.5 ? n * (1 + t) : n + t - n * t, a = 2 * n - r;
      this.r = da(a, r, e + 1 / 3), this.g = da(a, r, e), this.b = da(a, r, e - 1 / 3);
    }
    return qe.colorSpaceToWorking(this, s), this;
  }
  setStyle(e, t = yt) {
    function n(r) {
      r !== void 0 && parseFloat(r) < 1 && console.warn("THREE.Color: Alpha component of " + e + " will be ignored.");
    }
    let s;
    if (s = /^(\w+)\(([^\)]*)\)/.exec(e)) {
      let r;
      const a = s[1], o = s[2];
      switch (a) {
        case "rgb":
        case "rgba":
          if (r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(r[4]), this.setRGB(Math.min(255, parseInt(r[1], 10)) / 255, Math.min(255, parseInt(r[2], 10)) / 255, Math.min(255, parseInt(r[3], 10)) / 255, t);
          if (r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(r[4]), this.setRGB(Math.min(100, parseInt(r[1], 10)) / 100, Math.min(100, parseInt(r[2], 10)) / 100, Math.min(100, parseInt(r[3], 10)) / 100, t);
          break;
        case "hsl":
        case "hsla":
          if (r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(r[4]), this.setHSL(parseFloat(r[1]) / 360, parseFloat(r[2]) / 100, parseFloat(r[3]) / 100, t);
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + e);
      }
    } else if (s = /^\#([A-Fa-f\d]+)$/.exec(e)) {
      const r = s[1], a = r.length;
      if (a === 3) return this.setRGB(parseInt(r.charAt(0), 16) / 15, parseInt(r.charAt(1), 16) / 15, parseInt(r.charAt(2), 16) / 15, t);
      if (a === 6) return this.setHex(parseInt(r, 16), t);
      console.warn("THREE.Color: Invalid hex color " + e);
    } else if (e && e.length > 0) return this.setColorName(e, t);
    return this;
  }
  setColorName(e, t = yt) {
    const n = mh[e.toLowerCase()];
    return n !== void 0 ? this.setHex(n, t) : console.warn("THREE.Color: Unknown color " + e), this;
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(e) {
    return this.r = e.r, this.g = e.g, this.b = e.b, this;
  }
  copySRGBToLinear(e) {
    return this.r = zn(e.r), this.g = zn(e.g), this.b = zn(e.b), this;
  }
  copyLinearToSRGB(e) {
    return this.r = Ji(e.r), this.g = Ji(e.g), this.b = Ji(e.b), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(e = yt) {
    return qe.workingToColorSpace(wt.copy(this), e), Math.round(ze(wt.r * 255, 0, 255)) * 65536 + Math.round(ze(wt.g * 255, 0, 255)) * 256 + Math.round(ze(wt.b * 255, 0, 255));
  }
  getHexString(e = yt) {
    return ("000000" + this.getHex(e).toString(16)).slice(-6);
  }
  getHSL(e, t = qe.workingColorSpace) {
    qe.workingToColorSpace(wt.copy(this), t);
    const n = wt.r, s = wt.g, r = wt.b, a = Math.max(n, s, r), o = Math.min(n, s, r);
    let l, c;
    const u = (o + a) / 2;
    if (o === a) l = 0, c = 0;
    else {
      const h = a - o;
      switch (c = u <= 0.5 ? h / (a + o) : h / (2 - a - o), a) {
        case n:
          l = (s - r) / h + (s < r ? 6 : 0);
          break;
        case s:
          l = (r - n) / h + 2;
          break;
        case r:
          l = (n - s) / h + 4;
          break;
      }
      l /= 6;
    }
    return e.h = l, e.s = c, e.l = u, e;
  }
  getRGB(e, t = qe.workingColorSpace) {
    return qe.workingToColorSpace(wt.copy(this), t), e.r = wt.r, e.g = wt.g, e.b = wt.b, e;
  }
  getStyle(e = yt) {
    qe.workingToColorSpace(wt.copy(this), e);
    const t = wt.r, n = wt.g, s = wt.b;
    return e !== yt ? `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})` : `rgb(${Math.round(t * 255)},${Math.round(n * 255)},${Math.round(s * 255)})`;
  }
  offsetHSL(e, t, n) {
    return this.getHSL(Yn), this.setHSL(Yn.h + e, Yn.s + t, Yn.l + n);
  }
  add(e) {
    return this.r += e.r, this.g += e.g, this.b += e.b, this;
  }
  addColors(e, t) {
    return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
  }
  addScalar(e) {
    return this.r += e, this.g += e, this.b += e, this;
  }
  sub(e) {
    return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
  }
  multiply(e) {
    return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
  }
  multiplyScalar(e) {
    return this.r *= e, this.g *= e, this.b *= e, this;
  }
  lerp(e, t) {
    return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
  }
  lerpColors(e, t, n) {
    return this.r = e.r + (t.r - e.r) * n, this.g = e.g + (t.g - e.g) * n, this.b = e.b + (t.b - e.b) * n, this;
  }
  lerpHSL(e, t) {
    this.getHSL(Yn), e.getHSL(Qs);
    const n = Ps(Yn.h, Qs.h, t), s = Ps(Yn.s, Qs.s, t), r = Ps(Yn.l, Qs.l, t);
    return this.setHSL(n, s, r), this;
  }
  setFromVector3(e) {
    return this.r = e.x, this.g = e.y, this.b = e.z, this;
  }
  applyMatrix3(e) {
    const t = this.r, n = this.g, s = this.b, r = e.elements;
    return this.r = r[0] * t + r[3] * n + r[6] * s, this.g = r[1] * t + r[4] * n + r[7] * s, this.b = r[2] * t + r[5] * n + r[8] * s, this;
  }
  equals(e) {
    return e.r === this.r && e.g === this.g && e.b === this.b;
  }
  fromArray(e, t = 0) {
    return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
  }
  fromBufferAttribute(e, t) {
    return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const wt = new we();
we.NAMES = mh;
let wd = 0;
class dn extends Ci {
  constructor() {
    super(), this.isMaterial = true, Object.defineProperty(this, "id", { value: wd++ }), this.uuid = un(), this.name = "", this.type = "Material", this.blending = $i, this.side = Vn, this.vertexColors = false, this.opacity = 1, this.transparent = false, this.alphaHash = false, this.blendSrc = Fa, this.blendDst = Oa, this.blendEquation = vi, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new we(0, 0, 0), this.blendAlpha = 0, this.depthFunc = es, this.depthTest = true, this.depthWrite = true, this.stencilWriteMask = 255, this.stencilFunc = Tl, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = Li, this.stencilZFail = Li, this.stencilZPass = Li, this.stencilWrite = false, this.clippingPlanes = null, this.clipIntersection = false, this.clipShadows = false, this.shadowSide = null, this.colorWrite = true, this.precision = null, this.polygonOffset = false, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = false, this.alphaToCoverage = false, this.premultipliedAlpha = false, this.forceSinglePass = false, this.allowOverride = true, this.visible = true, this.toneMapped = true, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(e) {
    this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
  }
  onBeforeRender() {
  }
  onBeforeCompile() {
  }
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(e) {
    if (e !== void 0) for (const t in e) {
      const n = e[t];
      if (n === void 0) {
        console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);
        continue;
      }
      const s = this[t];
      if (s === void 0) {
        console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);
        continue;
      }
      s && s.isColor ? s.set(n) : s && s.isVector3 && n && n.isVector3 ? s.copy(n) : this[t] = n;
    }
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    t && (e = { textures: {}, images: {} });
    const n = { metadata: { version: 4.7, type: "Material", generator: "Material.toJSON" } };
    n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.sheenColorMap && this.sheenColorMap.isTexture && (n.sheenColorMap = this.sheenColorMap.toJSON(e).uuid), this.sheenRoughnessMap && this.sheenRoughnessMap.isTexture && (n.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(e).uuid), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(e).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(e).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(e).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(e).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(e).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== $i && (n.blending = this.blending), this.side !== Vn && (n.side = this.side), this.vertexColors === true && (n.vertexColors = true), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === true && (n.transparent = true), this.blendSrc !== Fa && (n.blendSrc = this.blendSrc), this.blendDst !== Oa && (n.blendDst = this.blendDst), this.blendEquation !== vi && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== es && (n.depthFunc = this.depthFunc), this.depthTest === false && (n.depthTest = this.depthTest), this.depthWrite === false && (n.depthWrite = this.depthWrite), this.colorWrite === false && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== Tl && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== Li && (n.stencilFail = this.stencilFail), this.stencilZFail !== Li && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== Li && (n.stencilZPass = this.stencilZPass), this.stencilWrite === true && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === true && (n.polygonOffset = true), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === true && (n.dithering = true), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === true && (n.alphaHash = true), this.alphaToCoverage === true && (n.alphaToCoverage = true), this.premultipliedAlpha === true && (n.premultipliedAlpha = true), this.forceSinglePass === true && (n.forceSinglePass = true), this.wireframe === true && (n.wireframe = true), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === true && (n.flatShading = true), this.visible === false && (n.visible = false), this.toneMapped === false && (n.toneMapped = false), this.fog === false && (n.fog = false), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
    function s(r) {
      const a = [];
      for (const o in r) {
        const l = r[o];
        delete l.metadata, a.push(l);
      }
      return a;
    }
    if (t) {
      const r = s(e.textures), a = s(e.images);
      r.length > 0 && (n.textures = r), a.length > 0 && (n.images = a);
    }
    return n;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
    const t = e.clippingPlanes;
    let n = null;
    if (t !== null) {
      const s = t.length;
      n = new Array(s);
      for (let r = 0; r !== s; ++r) n[r] = t[r].clone();
    }
    return this.clippingPlanes = n, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(e) {
    e === true && this.version++;
  }
}
class ii extends dn {
  constructor(e) {
    super(), this.isMeshBasicMaterial = true, this.type = "MeshBasicMaterial", this.color = new we(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new fn(), this.combine = Bo, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = true, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
  }
}
const Fn = Rd();
function Rd() {
  const i = new ArrayBuffer(4), e = new Float32Array(i), t = new Uint32Array(i), n = new Uint32Array(512), s = new Uint32Array(512);
  for (let l = 0; l < 256; ++l) {
    const c = l - 127;
    c < -27 ? (n[l] = 0, n[l | 256] = 32768, s[l] = 24, s[l | 256] = 24) : c < -14 ? (n[l] = 1024 >> -c - 14, n[l | 256] = 1024 >> -c - 14 | 32768, s[l] = -c - 1, s[l | 256] = -c - 1) : c <= 15 ? (n[l] = c + 15 << 10, n[l | 256] = c + 15 << 10 | 32768, s[l] = 13, s[l | 256] = 13) : c < 128 ? (n[l] = 31744, n[l | 256] = 64512, s[l] = 24, s[l | 256] = 24) : (n[l] = 31744, n[l | 256] = 64512, s[l] = 13, s[l | 256] = 13);
  }
  const r = new Uint32Array(2048), a = new Uint32Array(64), o = new Uint32Array(64);
  for (let l = 1; l < 1024; ++l) {
    let c = l << 13, u = 0;
    for (; (c & 8388608) === 0; ) c <<= 1, u -= 8388608;
    c &= -8388609, u += 947912704, r[l] = c | u;
  }
  for (let l = 1024; l < 2048; ++l) r[l] = 939524096 + (l - 1024 << 13);
  for (let l = 1; l < 31; ++l) a[l] = l << 23;
  a[31] = 1199570944, a[32] = 2147483648;
  for (let l = 33; l < 63; ++l) a[l] = 2147483648 + (l - 32 << 23);
  a[63] = 3347054592;
  for (let l = 1; l < 64; ++l) l !== 32 && (o[l] = 1024);
  return { floatView: e, uint32View: t, baseTable: n, shiftTable: s, mantissaTable: r, exponentTable: a, offsetTable: o };
}
function Cd(i) {
  Math.abs(i) > 65504 && console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."), i = ze(i, -65504, 65504), Fn.floatView[0] = i;
  const e = Fn.uint32View[0], t = e >> 23 & 511;
  return Fn.baseTable[t] + ((e & 8388607) >> Fn.shiftTable[t]);
}
function Pd(i) {
  const e = i >> 10;
  return Fn.uint32View[0] = Fn.mantissaTable[Fn.offsetTable[e] + (i & 1023)] + Fn.exponentTable[e], Fn.floatView[0];
}
class Ld {
  static toHalfFloat(e) {
    return Cd(e);
  }
  static fromHalfFloat(e) {
    return Pd(e);
  }
}
const gt = new L(), er = new Ee();
let Dd = 0;
class Ft {
  constructor(e, t, n = false) {
    if (Array.isArray(e)) throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = true, Object.defineProperty(this, "id", { value: Dd++ }), this.name = "", this.array = e, this.itemSize = t, this.count = e !== void 0 ? e.length / t : 0, this.normalized = n, this.usage = Eo, this.updateRanges = [], this.gpuType = hn, this.version = 0;
  }
  onUploadCallback() {
  }
  set needsUpdate(e) {
    e === true && this.version++;
  }
  setUsage(e) {
    return this.usage = e, this;
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(e) {
    return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
  }
  copyAt(e, t, n) {
    e *= this.itemSize, n *= t.itemSize;
    for (let s = 0, r = this.itemSize; s < r; s++) this.array[e + s] = t.array[n + s];
    return this;
  }
  copyArray(e) {
    return this.array.set(e), this;
  }
  applyMatrix3(e) {
    if (this.itemSize === 2) for (let t = 0, n = this.count; t < n; t++) er.fromBufferAttribute(this, t), er.applyMatrix3(e), this.setXY(t, er.x, er.y);
    else if (this.itemSize === 3) for (let t = 0, n = this.count; t < n; t++) gt.fromBufferAttribute(this, t), gt.applyMatrix3(e), this.setXYZ(t, gt.x, gt.y, gt.z);
    return this;
  }
  applyMatrix4(e) {
    for (let t = 0, n = this.count; t < n; t++) gt.fromBufferAttribute(this, t), gt.applyMatrix4(e), this.setXYZ(t, gt.x, gt.y, gt.z);
    return this;
  }
  applyNormalMatrix(e) {
    for (let t = 0, n = this.count; t < n; t++) gt.fromBufferAttribute(this, t), gt.applyNormalMatrix(e), this.setXYZ(t, gt.x, gt.y, gt.z);
    return this;
  }
  transformDirection(e) {
    for (let t = 0, n = this.count; t < n; t++) gt.fromBufferAttribute(this, t), gt.transformDirection(e), this.setXYZ(t, gt.x, gt.y, gt.z);
    return this;
  }
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  getComponent(e, t) {
    let n = this.array[e * this.itemSize + t];
    return this.normalized && (n = ln(n, this.array)), n;
  }
  setComponent(e, t, n) {
    return this.normalized && (n = $e(n, this.array)), this.array[e * this.itemSize + t] = n, this;
  }
  getX(e) {
    let t = this.array[e * this.itemSize];
    return this.normalized && (t = ln(t, this.array)), t;
  }
  setX(e, t) {
    return this.normalized && (t = $e(t, this.array)), this.array[e * this.itemSize] = t, this;
  }
  getY(e) {
    let t = this.array[e * this.itemSize + 1];
    return this.normalized && (t = ln(t, this.array)), t;
  }
  setY(e, t) {
    return this.normalized && (t = $e(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
  }
  getZ(e) {
    let t = this.array[e * this.itemSize + 2];
    return this.normalized && (t = ln(t, this.array)), t;
  }
  setZ(e, t) {
    return this.normalized && (t = $e(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
  }
  getW(e) {
    let t = this.array[e * this.itemSize + 3];
    return this.normalized && (t = ln(t, this.array)), t;
  }
  setW(e, t) {
    return this.normalized && (t = $e(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
  }
  setXY(e, t, n) {
    return e *= this.itemSize, this.normalized && (t = $e(t, this.array), n = $e(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this;
  }
  setXYZ(e, t, n, s) {
    return e *= this.itemSize, this.normalized && (t = $e(t, this.array), n = $e(n, this.array), s = $e(s, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = s, this;
  }
  setXYZW(e, t, n, s, r) {
    return e *= this.itemSize, this.normalized && (t = $e(t, this.array), n = $e(n, this.array), s = $e(s, this.array), r = $e(r, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = s, this.array[e + 3] = r, this;
  }
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const e = { itemSize: this.itemSize, type: this.array.constructor.name, array: Array.from(this.array), normalized: this.normalized };
    return this.name !== "" && (e.name = this.name), this.usage !== Eo && (e.usage = this.usage), e;
  }
}
class gh extends Ft {
  constructor(e, t, n) {
    super(new Uint16Array(e), t, n);
  }
}
class _h extends Ft {
  constructor(e, t, n) {
    super(new Uint32Array(e), t, n);
  }
}
class Hn extends Ft {
  constructor(e, t, n) {
    super(new Float32Array(e), t, n);
  }
}
let Id = 0;
const Jt = new Be(), fa = new ot(), Hi = new L(), Xt = new Kt(), Ms = new Kt(), Tt = new L();
class wn extends Ci {
  constructor() {
    super(), this.isBufferGeometry = true, Object.defineProperty(this, "id", { value: Id++ }), this.uuid = un(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = false, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  getIndex() {
    return this.index;
  }
  setIndex(e) {
    return Array.isArray(e) ? this.index = new (dh(e) ? _h : gh)(e, 1) : this.index = e, this;
  }
  setIndirect(e) {
    return this.indirect = e, this;
  }
  getIndirect() {
    return this.indirect;
  }
  getAttribute(e) {
    return this.attributes[e];
  }
  setAttribute(e, t) {
    return this.attributes[e] = t, this;
  }
  deleteAttribute(e) {
    return delete this.attributes[e], this;
  }
  hasAttribute(e) {
    return this.attributes[e] !== void 0;
  }
  addGroup(e, t, n = 0) {
    this.groups.push({ start: e, count: t, materialIndex: n });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(e, t) {
    this.drawRange.start = e, this.drawRange.count = t;
  }
  applyMatrix4(e) {
    const t = this.attributes.position;
    t !== void 0 && (t.applyMatrix4(e), t.needsUpdate = true);
    const n = this.attributes.normal;
    if (n !== void 0) {
      const r = new Oe().getNormalMatrix(e);
      n.applyNormalMatrix(r), n.needsUpdate = true;
    }
    const s = this.attributes.tangent;
    return s !== void 0 && (s.transformDirection(e), s.needsUpdate = true), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  applyQuaternion(e) {
    return Jt.makeRotationFromQuaternion(e), this.applyMatrix4(Jt), this;
  }
  rotateX(e) {
    return Jt.makeRotationX(e), this.applyMatrix4(Jt), this;
  }
  rotateY(e) {
    return Jt.makeRotationY(e), this.applyMatrix4(Jt), this;
  }
  rotateZ(e) {
    return Jt.makeRotationZ(e), this.applyMatrix4(Jt), this;
  }
  translate(e, t, n) {
    return Jt.makeTranslation(e, t, n), this.applyMatrix4(Jt), this;
  }
  scale(e, t, n) {
    return Jt.makeScale(e, t, n), this.applyMatrix4(Jt), this;
  }
  lookAt(e) {
    return fa.lookAt(e), fa.updateMatrix(), this.applyMatrix4(fa.matrix), this;
  }
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(Hi).negate(), this.translate(Hi.x, Hi.y, Hi.z), this;
  }
  setFromPoints(e) {
    const t = this.getAttribute("position");
    if (t === void 0) {
      const n = [];
      for (let s = 0, r = e.length; s < r; s++) {
        const a = e[s];
        n.push(a.x, a.y, a.z || 0);
      }
      this.setAttribute("position", new Hn(n, 3));
    } else {
      const n = Math.min(e.length, t.count);
      for (let s = 0; s < n; s++) {
        const r = e[s];
        t.setXYZ(s, r.x, r.y, r.z || 0);
      }
      e.length > t.count && console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), t.needsUpdate = true;
    }
    return this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new Kt());
    const e = this.attributes.position, t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(new L(-1 / 0, -1 / 0, -1 / 0), new L(1 / 0, 1 / 0, 1 / 0));
      return;
    }
    if (e !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(e), t) for (let n = 0, s = t.length; n < s; n++) {
        const r = t[n];
        Xt.setFromBufferAttribute(r), this.morphTargetsRelative ? (Tt.addVectors(this.boundingBox.min, Xt.min), this.boundingBox.expandByPoint(Tt), Tt.addVectors(this.boundingBox.max, Xt.max), this.boundingBox.expandByPoint(Tt)) : (this.boundingBox.expandByPoint(Xt.min), this.boundingBox.expandByPoint(Xt.max));
      }
    } else this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new An());
    const e = this.attributes.position, t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new L(), 1 / 0);
      return;
    }
    if (e) {
      const n = this.boundingSphere.center;
      if (Xt.setFromBufferAttribute(e), t) for (let r = 0, a = t.length; r < a; r++) {
        const o = t[r];
        Ms.setFromBufferAttribute(o), this.morphTargetsRelative ? (Tt.addVectors(Xt.min, Ms.min), Xt.expandByPoint(Tt), Tt.addVectors(Xt.max, Ms.max), Xt.expandByPoint(Tt)) : (Xt.expandByPoint(Ms.min), Xt.expandByPoint(Ms.max));
      }
      Xt.getCenter(n);
      let s = 0;
      for (let r = 0, a = e.count; r < a; r++) Tt.fromBufferAttribute(e, r), s = Math.max(s, n.distanceToSquared(Tt));
      if (t) for (let r = 0, a = t.length; r < a; r++) {
        const o = t[r], l = this.morphTargetsRelative;
        for (let c = 0, u = o.count; c < u; c++) Tt.fromBufferAttribute(o, c), l && (Hi.fromBufferAttribute(e, c), Tt.add(Hi)), s = Math.max(s, n.distanceToSquared(Tt));
      }
      this.boundingSphere.radius = Math.sqrt(s), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  computeTangents() {
    const e = this.index, t = this.attributes;
    if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
      console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const n = t.position, s = t.normal, r = t.uv;
    this.hasAttribute("tangent") === false && this.setAttribute("tangent", new Ft(new Float32Array(4 * n.count), 4));
    const a = this.getAttribute("tangent"), o = [], l = [];
    for (let N = 0; N < n.count; N++) o[N] = new L(), l[N] = new L();
    const c = new L(), u = new L(), h = new L(), d = new Ee(), p = new Ee(), g = new Ee(), _ = new L(), m = new L();
    function f(N, S, M) {
      c.fromBufferAttribute(n, N), u.fromBufferAttribute(n, S), h.fromBufferAttribute(n, M), d.fromBufferAttribute(r, N), p.fromBufferAttribute(r, S), g.fromBufferAttribute(r, M), u.sub(c), h.sub(c), p.sub(d), g.sub(d);
      const P = 1 / (p.x * g.y - g.x * p.y);
      isFinite(P) && (_.copy(u).multiplyScalar(g.y).addScaledVector(h, -p.y).multiplyScalar(P), m.copy(h).multiplyScalar(p.x).addScaledVector(u, -g.x).multiplyScalar(P), o[N].add(_), o[S].add(_), o[M].add(_), l[N].add(m), l[S].add(m), l[M].add(m));
    }
    let b = this.groups;
    b.length === 0 && (b = [{ start: 0, count: e.count }]);
    for (let N = 0, S = b.length; N < S; ++N) {
      const M = b[N], P = M.start, k = M.count;
      for (let V = P, j = P + k; V < j; V += 3) f(e.getX(V + 0), e.getX(V + 1), e.getX(V + 2));
    }
    const E = new L(), y = new L(), w = new L(), C = new L();
    function R(N) {
      w.fromBufferAttribute(s, N), C.copy(w);
      const S = o[N];
      E.copy(S), E.sub(w.multiplyScalar(w.dot(S))).normalize(), y.crossVectors(C, S);
      const P = y.dot(l[N]) < 0 ? -1 : 1;
      a.setXYZW(N, E.x, E.y, E.z, P);
    }
    for (let N = 0, S = b.length; N < S; ++N) {
      const M = b[N], P = M.start, k = M.count;
      for (let V = P, j = P + k; V < j; V += 3) R(e.getX(V + 0)), R(e.getX(V + 1)), R(e.getX(V + 2));
    }
  }
  computeVertexNormals() {
    const e = this.index, t = this.getAttribute("position");
    if (t !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0) n = new Ft(new Float32Array(t.count * 3), 3), this.setAttribute("normal", n);
      else for (let d = 0, p = n.count; d < p; d++) n.setXYZ(d, 0, 0, 0);
      const s = new L(), r = new L(), a = new L(), o = new L(), l = new L(), c = new L(), u = new L(), h = new L();
      if (e) for (let d = 0, p = e.count; d < p; d += 3) {
        const g = e.getX(d + 0), _ = e.getX(d + 1), m = e.getX(d + 2);
        s.fromBufferAttribute(t, g), r.fromBufferAttribute(t, _), a.fromBufferAttribute(t, m), u.subVectors(a, r), h.subVectors(s, r), u.cross(h), o.fromBufferAttribute(n, g), l.fromBufferAttribute(n, _), c.fromBufferAttribute(n, m), o.add(u), l.add(u), c.add(u), n.setXYZ(g, o.x, o.y, o.z), n.setXYZ(_, l.x, l.y, l.z), n.setXYZ(m, c.x, c.y, c.z);
      }
      else for (let d = 0, p = t.count; d < p; d += 3) s.fromBufferAttribute(t, d + 0), r.fromBufferAttribute(t, d + 1), a.fromBufferAttribute(t, d + 2), u.subVectors(a, r), h.subVectors(s, r), u.cross(h), n.setXYZ(d + 0, u.x, u.y, u.z), n.setXYZ(d + 1, u.x, u.y, u.z), n.setXYZ(d + 2, u.x, u.y, u.z);
      this.normalizeNormals(), n.needsUpdate = true;
    }
  }
  normalizeNormals() {
    const e = this.attributes.normal;
    for (let t = 0, n = e.count; t < n; t++) Tt.fromBufferAttribute(e, t), Tt.normalize(), e.setXYZ(t, Tt.x, Tt.y, Tt.z);
  }
  toNonIndexed() {
    function e(o, l) {
      const c = o.array, u = o.itemSize, h = o.normalized, d = new c.constructor(l.length * u);
      let p = 0, g = 0;
      for (let _ = 0, m = l.length; _ < m; _++) {
        o.isInterleavedBufferAttribute ? p = l[_] * o.data.stride + o.offset : p = l[_] * u;
        for (let f = 0; f < u; f++) d[g++] = c[p++];
      }
      return new Ft(d, u, h);
    }
    if (this.index === null) return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const t = new wn(), n = this.index.array, s = this.attributes;
    for (const o in s) {
      const l = s[o], c = e(l, n);
      t.setAttribute(o, c);
    }
    const r = this.morphAttributes;
    for (const o in r) {
      const l = [], c = r[o];
      for (let u = 0, h = c.length; u < h; u++) {
        const d = c[u], p = e(d, n);
        l.push(p);
      }
      t.morphAttributes[o] = l;
    }
    t.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let o = 0, l = a.length; o < l; o++) {
      const c = a[o];
      t.addGroup(c.start, c.count, c.materialIndex);
    }
    return t;
  }
  toJSON() {
    const e = { metadata: { version: 4.7, type: "BufferGeometry", generator: "BufferGeometry.toJSON" } };
    if (e.uuid = this.uuid, e.type = this.type, this.name !== "" && (e.name = this.name), Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0) {
      const l = this.parameters;
      for (const c in l) l[c] !== void 0 && (e[c] = l[c]);
      return e;
    }
    e.data = { attributes: {} };
    const t = this.index;
    t !== null && (e.data.index = { type: t.array.constructor.name, array: Array.prototype.slice.call(t.array) });
    const n = this.attributes;
    for (const l in n) {
      const c = n[l];
      e.data.attributes[l] = c.toJSON(e.data);
    }
    const s = {};
    let r = false;
    for (const l in this.morphAttributes) {
      const c = this.morphAttributes[l], u = [];
      for (let h = 0, d = c.length; h < d; h++) {
        const p = c[h];
        u.push(p.toJSON(e.data));
      }
      u.length > 0 && (s[l] = u, r = true);
    }
    r && (e.data.morphAttributes = s, e.data.morphTargetsRelative = this.morphTargetsRelative);
    const a = this.groups;
    a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
    const o = this.boundingSphere;
    return o !== null && (e.data.boundingSphere = o.toJSON()), e;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const t = {};
    this.name = e.name;
    const n = e.index;
    n !== null && this.setIndex(n.clone());
    const s = e.attributes;
    for (const c in s) {
      const u = s[c];
      this.setAttribute(c, u.clone(t));
    }
    const r = e.morphAttributes;
    for (const c in r) {
      const u = [], h = r[c];
      for (let d = 0, p = h.length; d < p; d++) u.push(h[d].clone(t));
      this.morphAttributes[c] = u;
    }
    this.morphTargetsRelative = e.morphTargetsRelative;
    const a = e.groups;
    for (let c = 0, u = a.length; c < u; c++) {
      const h = a[c];
      this.addGroup(h.start, h.count, h.materialIndex);
    }
    const o = e.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const l = e.boundingSphere;
    return l !== null && (this.boundingSphere = l.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const kl = new Be(), di = new us(), tr = new An(), zl = new L(), nr = new L(), ir = new L(), sr = new L(), pa = new L(), rr = new L(), Hl = new L(), ar = new L();
class _t extends ot {
  constructor(e = new wn(), t = new ii()) {
    super(), this.isMesh = true, this.type = "Mesh", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.count = 1, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const s = t[n[0]];
      if (s !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = s.length; r < a; r++) {
          const o = s[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
  getVertexPosition(e, t) {
    const n = this.geometry, s = n.attributes.position, r = n.morphAttributes.position, a = n.morphTargetsRelative;
    t.fromBufferAttribute(s, e);
    const o = this.morphTargetInfluences;
    if (r && o) {
      rr.set(0, 0, 0);
      for (let l = 0, c = r.length; l < c; l++) {
        const u = o[l], h = r[l];
        u !== 0 && (pa.fromBufferAttribute(h, e), a ? rr.addScaledVector(pa, u) : rr.addScaledVector(pa.sub(t), u));
      }
      t.add(rr);
    }
    return t;
  }
  raycast(e, t) {
    const n = this.geometry, s = this.material, r = this.matrixWorld;
    s !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), tr.copy(n.boundingSphere), tr.applyMatrix4(r), di.copy(e.ray).recast(e.near), !(tr.containsPoint(di.origin) === false && (di.intersectSphere(tr, zl) === null || di.origin.distanceToSquared(zl) > (e.far - e.near) ** 2)) && (kl.copy(r).invert(), di.copy(e.ray).applyMatrix4(kl), !(n.boundingBox !== null && di.intersectsBox(n.boundingBox) === false) && this._computeIntersections(e, t, di)));
  }
  _computeIntersections(e, t, n) {
    let s;
    const r = this.geometry, a = this.material, o = r.index, l = r.attributes.position, c = r.attributes.uv, u = r.attributes.uv1, h = r.attributes.normal, d = r.groups, p = r.drawRange;
    if (o !== null) if (Array.isArray(a)) for (let g = 0, _ = d.length; g < _; g++) {
      const m = d[g], f = a[m.materialIndex], b = Math.max(m.start, p.start), E = Math.min(o.count, Math.min(m.start + m.count, p.start + p.count));
      for (let y = b, w = E; y < w; y += 3) {
        const C = o.getX(y), R = o.getX(y + 1), N = o.getX(y + 2);
        s = or(this, f, e, n, c, u, h, C, R, N), s && (s.faceIndex = Math.floor(y / 3), s.face.materialIndex = m.materialIndex, t.push(s));
      }
    }
    else {
      const g = Math.max(0, p.start), _ = Math.min(o.count, p.start + p.count);
      for (let m = g, f = _; m < f; m += 3) {
        const b = o.getX(m), E = o.getX(m + 1), y = o.getX(m + 2);
        s = or(this, a, e, n, c, u, h, b, E, y), s && (s.faceIndex = Math.floor(m / 3), t.push(s));
      }
    }
    else if (l !== void 0) if (Array.isArray(a)) for (let g = 0, _ = d.length; g < _; g++) {
      const m = d[g], f = a[m.materialIndex], b = Math.max(m.start, p.start), E = Math.min(l.count, Math.min(m.start + m.count, p.start + p.count));
      for (let y = b, w = E; y < w; y += 3) {
        const C = y, R = y + 1, N = y + 2;
        s = or(this, f, e, n, c, u, h, C, R, N), s && (s.faceIndex = Math.floor(y / 3), s.face.materialIndex = m.materialIndex, t.push(s));
      }
    }
    else {
      const g = Math.max(0, p.start), _ = Math.min(l.count, p.start + p.count);
      for (let m = g, f = _; m < f; m += 3) {
        const b = m, E = m + 1, y = m + 2;
        s = or(this, a, e, n, c, u, h, b, E, y), s && (s.faceIndex = Math.floor(m / 3), t.push(s));
      }
    }
  }
}
function Ud(i, e, t, n, s, r, a, o) {
  let l;
  if (e.side === Ut ? l = n.intersectTriangle(a, r, s, true, o) : l = n.intersectTriangle(s, r, a, e.side === Vn, o), l === null) return null;
  ar.copy(o), ar.applyMatrix4(i.matrixWorld);
  const c = t.ray.origin.distanceTo(ar);
  return c < t.near || c > t.far ? null : { distance: c, point: ar.clone(), object: i };
}
function or(i, e, t, n, s, r, a, o, l, c) {
  i.getVertexPosition(o, nr), i.getVertexPosition(l, ir), i.getVertexPosition(c, sr);
  const u = Ud(i, e, t, n, nr, ir, sr, Hl);
  if (u) {
    const h = new L();
    cn.getBarycoord(Hl, nr, ir, sr, h), s && (u.uv = cn.getInterpolatedAttribute(s, o, l, c, h, new Ee())), r && (u.uv1 = cn.getInterpolatedAttribute(r, o, l, c, h, new Ee())), a && (u.normal = cn.getInterpolatedAttribute(a, o, l, c, h, new L()), u.normal.dot(n.direction) > 0 && u.normal.multiplyScalar(-1));
    const d = { a: o, b: l, c, normal: new L(), materialIndex: 0 };
    cn.getNormal(nr, ir, sr, d.normal), u.face = d, u.barycoord = h;
  }
  return u;
}
class ds extends wn {
  constructor(e = 1, t = 1, n = 1, s = 1, r = 1, a = 1) {
    super(), this.type = "BoxGeometry", this.parameters = { width: e, height: t, depth: n, widthSegments: s, heightSegments: r, depthSegments: a };
    const o = this;
    s = Math.floor(s), r = Math.floor(r), a = Math.floor(a);
    const l = [], c = [], u = [], h = [];
    let d = 0, p = 0;
    g("z", "y", "x", -1, -1, n, t, e, a, r, 0), g("z", "y", "x", 1, -1, n, t, -e, a, r, 1), g("x", "z", "y", 1, 1, e, n, t, s, a, 2), g("x", "z", "y", 1, -1, e, n, -t, s, a, 3), g("x", "y", "z", 1, -1, e, t, n, s, r, 4), g("x", "y", "z", -1, -1, e, t, -n, s, r, 5), this.setIndex(l), this.setAttribute("position", new Hn(c, 3)), this.setAttribute("normal", new Hn(u, 3)), this.setAttribute("uv", new Hn(h, 2));
    function g(_, m, f, b, E, y, w, C, R, N, S) {
      const M = y / R, P = w / N, k = y / 2, V = w / 2, j = C / 2, q = R + 1, W = N + 1;
      let K = 0, z = 0;
      const ne = new L();
      for (let ce = 0; ce < W; ce++) {
        const Me = ce * P - V;
        for (let Ne = 0; Ne < q; Ne++) {
          const Ye = Ne * M - k;
          ne[_] = Ye * b, ne[m] = Me * E, ne[f] = j, c.push(ne.x, ne.y, ne.z), ne[_] = 0, ne[m] = 0, ne[f] = C > 0 ? 1 : -1, u.push(ne.x, ne.y, ne.z), h.push(Ne / R), h.push(1 - ce / N), K += 1;
        }
      }
      for (let ce = 0; ce < N; ce++) for (let Me = 0; Me < R; Me++) {
        const Ne = d + Me + q * ce, Ye = d + Me + q * (ce + 1), nt = d + (Me + 1) + q * (ce + 1), We = d + (Me + 1) + q * ce;
        l.push(Ne, Ye, We), l.push(Ye, nt, We), z += 6;
      }
      o.addGroup(p, z, S), p += z, d += K;
    }
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  static fromJSON(e) {
    return new ds(e.width, e.height, e.depth, e.widthSegments, e.heightSegments, e.depthSegments);
  }
}
function rs(i) {
  const e = {};
  for (const t in i) {
    e[t] = {};
    for (const n in i[t]) {
      const s = i[t][n];
      s && (s.isColor || s.isMatrix3 || s.isMatrix4 || s.isVector2 || s.isVector3 || s.isVector4 || s.isTexture || s.isQuaternion) ? s.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), e[t][n] = null) : e[t][n] = s.clone() : Array.isArray(s) ? e[t][n] = s.slice() : e[t][n] = s;
    }
  }
  return e;
}
function Dt(i) {
  const e = {};
  for (let t = 0; t < i.length; t++) {
    const n = rs(i[t]);
    for (const s in n) e[s] = n[s];
  }
  return e;
}
function Nd(i) {
  const e = [];
  for (let t = 0; t < i.length; t++) e.push(i[t].clone());
  return e;
}
function xh(i) {
  const e = i.getRenderTarget();
  return e === null ? i.outputColorSpace : e.isXRRenderTarget === true ? e.texture.colorSpace : qe.workingColorSpace;
}
const Fd = { clone: rs, merge: Dt };
var Od = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, Bd = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class ai extends dn {
  constructor(e) {
    super(), this.isShaderMaterial = true, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Od, this.fragmentShader = Bd, this.linewidth = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.fog = false, this.lights = false, this.clipping = false, this.forceSinglePass = true, this.extensions = { clipCullDistance: false, multiDraw: false }, this.defaultAttributeValues = { color: [1, 1, 1], uv: [0, 0], uv1: [0, 0] }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = false, this.glslVersion = null, e !== void 0 && this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = rs(e.uniforms), this.uniformsGroups = Nd(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    t.glslVersion = this.glslVersion, t.uniforms = {};
    for (const s in this.uniforms) {
      const a = this.uniforms[s].value;
      a && a.isTexture ? t.uniforms[s] = { type: "t", value: a.toJSON(e).uuid } : a && a.isColor ? t.uniforms[s] = { type: "c", value: a.getHex() } : a && a.isVector2 ? t.uniforms[s] = { type: "v2", value: a.toArray() } : a && a.isVector3 ? t.uniforms[s] = { type: "v3", value: a.toArray() } : a && a.isVector4 ? t.uniforms[s] = { type: "v4", value: a.toArray() } : a && a.isMatrix3 ? t.uniforms[s] = { type: "m3", value: a.toArray() } : a && a.isMatrix4 ? t.uniforms[s] = { type: "m4", value: a.toArray() } : t.uniforms[s] = { value: a };
    }
    Object.keys(this.defines).length > 0 && (t.defines = this.defines), t.vertexShader = this.vertexShader, t.fragmentShader = this.fragmentShader, t.lights = this.lights, t.clipping = this.clipping;
    const n = {};
    for (const s in this.extensions) this.extensions[s] === true && (n[s] = true);
    return Object.keys(n).length > 0 && (t.extensions = n), t;
  }
}
class vh extends ot {
  constructor() {
    super(), this.isCamera = true, this.type = "Camera", this.matrixWorldInverse = new Be(), this.projectionMatrix = new Be(), this.projectionMatrixInverse = new Be(), this.coordinateSystem = Sn, this._reversedDepth = false;
  }
  get reversedDepth() {
    return this._reversedDepth;
  }
  copy(e, t) {
    return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
  }
  getWorldDirection(e) {
    return super.getWorldDirection(e).negate();
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(e, t) {
    super.updateWorldMatrix(e, t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const jn = new L(), Vl = new Ee(), Gl = new Ee();
class zt extends vh {
  constructor(e = 50, t = 1, n = 0.1, s = 2e3) {
    super(), this.isPerspectiveCamera = true, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = n, this.far = s, this.focus = 10, this.aspect = t, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
  }
  setFocalLength(e) {
    const t = 0.5 * this.getFilmHeight() / e;
    this.fov = ss * 2 * Math.atan(t), this.updateProjectionMatrix();
  }
  getFocalLength() {
    const e = Math.tan(Cs * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / e;
  }
  getEffectiveFOV() {
    return ss * 2 * Math.atan(Math.tan(Cs * 0.5 * this.fov) / this.zoom);
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  getViewBounds(e, t, n) {
    jn.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), t.set(jn.x, jn.y).multiplyScalar(-e / jn.z), jn.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(jn.x, jn.y).multiplyScalar(-e / jn.z);
  }
  getViewSize(e, t) {
    return this.getViewBounds(e, Vl, Gl), t.subVectors(Gl, Vl);
  }
  setViewOffset(e, t, n, s, r, a) {
    this.aspect = e / t, this.view === null && (this.view = { enabled: true, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }), this.view.enabled = true, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = s, this.view.width = r, this.view.height = a, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const e = this.near;
    let t = e * Math.tan(Cs * 0.5 * this.fov) / this.zoom, n = 2 * t, s = this.aspect * n, r = -0.5 * s;
    const a = this.view;
    if (this.view !== null && this.view.enabled) {
      const l = a.fullWidth, c = a.fullHeight;
      r += a.offsetX * s / l, t -= a.offsetY * n / c, s *= a.width / l, n *= a.height / c;
    }
    const o = this.filmOffset;
    o !== 0 && (r += e * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(r, r + s, t, t - n, e, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, this.view !== null && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t;
  }
}
const Vi = -90, Gi = 1;
class kd extends ot {
  constructor(e, t, n) {
    super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const s = new zt(Vi, Gi, e, t);
    s.layers = this.layers, this.add(s);
    const r = new zt(Vi, Gi, e, t);
    r.layers = this.layers, this.add(r);
    const a = new zt(Vi, Gi, e, t);
    a.layers = this.layers, this.add(a);
    const o = new zt(Vi, Gi, e, t);
    o.layers = this.layers, this.add(o);
    const l = new zt(Vi, Gi, e, t);
    l.layers = this.layers, this.add(l);
    const c = new zt(Vi, Gi, e, t);
    c.layers = this.layers, this.add(c);
  }
  updateCoordinateSystem() {
    const e = this.coordinateSystem, t = this.children.concat(), [n, s, r, a, o, l] = t;
    for (const c of t) this.remove(c);
    if (e === Sn) n.up.set(0, 1, 0), n.lookAt(1, 0, 0), s.up.set(0, 1, 0), s.lookAt(-1, 0, 0), r.up.set(0, 0, -1), r.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), l.up.set(0, 1, 0), l.lookAt(0, 0, -1);
    else if (e === Dr) n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), s.up.set(0, -1, 0), s.lookAt(1, 0, 0), r.up.set(0, 0, 1), r.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), l.up.set(0, -1, 0), l.lookAt(0, 0, -1);
    else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
    for (const c of t) this.add(c), c.updateMatrixWorld();
  }
  update(e, t) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: s } = this;
    this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
    const [r, a, o, l, c, u] = this.children, h = e.getRenderTarget(), d = e.getActiveCubeFace(), p = e.getActiveMipmapLevel(), g = e.xr.enabled;
    e.xr.enabled = false;
    const _ = n.texture.generateMipmaps;
    n.texture.generateMipmaps = false, e.setRenderTarget(n, 0, s), e.render(t, r), e.setRenderTarget(n, 1, s), e.render(t, a), e.setRenderTarget(n, 2, s), e.render(t, o), e.setRenderTarget(n, 3, s), e.render(t, l), e.setRenderTarget(n, 4, s), e.render(t, c), n.texture.generateMipmaps = _, e.setRenderTarget(n, 5, s), e.render(t, u), e.setRenderTarget(h, d, p), e.xr.enabled = g, n.texture.needsPMREMUpdate = true;
  }
}
class yh extends bt {
  constructor(e = [], t = ts, n, s, r, a, o, l, c, u) {
    super(e, t, n, s, r, a, o, l, c, u), this.isCubeTexture = true, this.flipY = false;
  }
  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}
class zd extends bi {
  constructor(e = 1, t = {}) {
    super(e, e, t), this.isWebGLCubeRenderTarget = true;
    const n = { width: e, height: e, depth: 1 }, s = [n, n, n, n, n, n];
    this.texture = new yh(s), this._setTextureOptions(t), this.texture.isRenderTargetTexture = true;
  }
  fromEquirectangularTexture(e, t) {
    this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
    const n = { uniforms: { tEquirect: { value: null } }, vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`, fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			` }, s = new ds(5, 5, 5), r = new ai({ name: "CubemapFromEquirect", uniforms: rs(n.uniforms), vertexShader: n.vertexShader, fragmentShader: n.fragmentShader, side: Ut, blending: si });
    r.uniforms.tEquirect.value = t;
    const a = new _t(s, r), o = t.minFilter;
    return t.minFilter === On && (t.minFilter = Ht), new kd(1, 10, this).update(e, a), t.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
  }
  clear(e, t = true, n = true, s = true) {
    const r = e.getRenderTarget();
    for (let a = 0; a < 6; a++) e.setRenderTarget(this, a), e.clear(t, n, s);
    e.setRenderTarget(r);
  }
}
class Si extends ot {
  constructor() {
    super(), this.isGroup = true, this.type = "Group";
  }
}
const Hd = { type: "move" };
class ma {
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  getHandSpace() {
    return this._hand === null && (this._hand = new Si(), this._hand.matrixAutoUpdate = false, this._hand.visible = false, this._hand.joints = {}, this._hand.inputState = { pinching: false }), this._hand;
  }
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new Si(), this._targetRay.matrixAutoUpdate = false, this._targetRay.visible = false, this._targetRay.hasLinearVelocity = false, this._targetRay.linearVelocity = new L(), this._targetRay.hasAngularVelocity = false, this._targetRay.angularVelocity = new L()), this._targetRay;
  }
  getGripSpace() {
    return this._grip === null && (this._grip = new Si(), this._grip.matrixAutoUpdate = false, this._grip.visible = false, this._grip.hasLinearVelocity = false, this._grip.linearVelocity = new L(), this._grip.hasAngularVelocity = false, this._grip.angularVelocity = new L()), this._grip;
  }
  dispatchEvent(e) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this;
  }
  connect(e) {
    if (e && e.hand) {
      const t = this._hand;
      if (t) for (const n of e.hand.values()) this._getHandJoint(t, n);
    }
    return this.dispatchEvent({ type: "connected", data: e }), this;
  }
  disconnect(e) {
    return this.dispatchEvent({ type: "disconnected", data: e }), this._targetRay !== null && (this._targetRay.visible = false), this._grip !== null && (this._grip.visible = false), this._hand !== null && (this._hand.visible = false), this;
  }
  update(e, t, n) {
    let s = null, r = null, a = null;
    const o = this._targetRay, l = this._grip, c = this._hand;
    if (e && t.session.visibilityState !== "visible-blurred") {
      if (c && e.hand) {
        a = true;
        for (const _ of e.hand.values()) {
          const m = t.getJointPose(_, n), f = this._getHandJoint(c, _);
          m !== null && (f.matrix.fromArray(m.transform.matrix), f.matrix.decompose(f.position, f.rotation, f.scale), f.matrixWorldNeedsUpdate = true, f.jointRadius = m.radius), f.visible = m !== null;
        }
        const u = c.joints["index-finger-tip"], h = c.joints["thumb-tip"], d = u.position.distanceTo(h.position), p = 0.02, g = 5e-3;
        c.inputState.pinching && d > p + g ? (c.inputState.pinching = false, this.dispatchEvent({ type: "pinchend", handedness: e.handedness, target: this })) : !c.inputState.pinching && d <= p - g && (c.inputState.pinching = true, this.dispatchEvent({ type: "pinchstart", handedness: e.handedness, target: this }));
      } else l !== null && e.gripSpace && (r = t.getPose(e.gripSpace, n), r !== null && (l.matrix.fromArray(r.transform.matrix), l.matrix.decompose(l.position, l.rotation, l.scale), l.matrixWorldNeedsUpdate = true, r.linearVelocity ? (l.hasLinearVelocity = true, l.linearVelocity.copy(r.linearVelocity)) : l.hasLinearVelocity = false, r.angularVelocity ? (l.hasAngularVelocity = true, l.angularVelocity.copy(r.angularVelocity)) : l.hasAngularVelocity = false));
      o !== null && (s = t.getPose(e.targetRaySpace, n), s === null && r !== null && (s = r), s !== null && (o.matrix.fromArray(s.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = true, s.linearVelocity ? (o.hasLinearVelocity = true, o.linearVelocity.copy(s.linearVelocity)) : o.hasLinearVelocity = false, s.angularVelocity ? (o.hasAngularVelocity = true, o.angularVelocity.copy(s.angularVelocity)) : o.hasAngularVelocity = false, this.dispatchEvent(Hd)));
    }
    return o !== null && (o.visible = s !== null), l !== null && (l.visible = r !== null), c !== null && (c.visible = a !== null), this;
  }
  _getHandJoint(e, t) {
    if (e.joints[t.jointName] === void 0) {
      const n = new Si();
      n.matrixAutoUpdate = false, n.visible = false, e.joints[t.jointName] = n, e.add(n);
    }
    return e.joints[t.jointName];
  }
}
class Mh extends ot {
  constructor() {
    super(), this.isScene = true, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new fn(), this.environmentIntensity = 1, this.environmentRotation = new fn(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(e, t) {
    return super.copy(e, t), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.fog !== null && (t.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (t.object.backgroundIntensity = this.backgroundIntensity), t.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (t.object.environmentIntensity = this.environmentIntensity), t.object.environmentRotation = this.environmentRotation.toArray(), t;
  }
}
class Vd {
  constructor(e, t) {
    this.isInterleavedBuffer = true, this.array = e, this.stride = t, this.count = e !== void 0 ? e.length / t : 0, this.usage = Eo, this.updateRanges = [], this.version = 0, this.uuid = un();
  }
  onUploadCallback() {
  }
  set needsUpdate(e) {
    e === true && this.version++;
  }
  setUsage(e) {
    return this.usage = e, this;
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(e) {
    return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this;
  }
  copyAt(e, t, n) {
    e *= this.stride, n *= t.stride;
    for (let s = 0, r = this.stride; s < r; s++) this.array[e + s] = t.array[n + s];
    return this;
  }
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  clone(e) {
    e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = un()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
    const t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]), n = new this.constructor(t, this.stride);
    return n.setUsage(this.usage), n;
  }
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  toJSON(e) {
    return e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = un()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), { uuid: this.uuid, buffer: this.array.buffer._uuid, type: this.array.constructor.name, stride: this.stride };
  }
}
const Lt = new L();
class Zo {
  constructor(e, t, n, s = false) {
    this.isInterleavedBufferAttribute = true, this.name = "", this.data = e, this.itemSize = t, this.offset = n, this.normalized = s;
  }
  get count() {
    return this.data.count;
  }
  get array() {
    return this.data.array;
  }
  set needsUpdate(e) {
    this.data.needsUpdate = e;
  }
  applyMatrix4(e) {
    for (let t = 0, n = this.data.count; t < n; t++) Lt.fromBufferAttribute(this, t), Lt.applyMatrix4(e), this.setXYZ(t, Lt.x, Lt.y, Lt.z);
    return this;
  }
  applyNormalMatrix(e) {
    for (let t = 0, n = this.count; t < n; t++) Lt.fromBufferAttribute(this, t), Lt.applyNormalMatrix(e), this.setXYZ(t, Lt.x, Lt.y, Lt.z);
    return this;
  }
  transformDirection(e) {
    for (let t = 0, n = this.count; t < n; t++) Lt.fromBufferAttribute(this, t), Lt.transformDirection(e), this.setXYZ(t, Lt.x, Lt.y, Lt.z);
    return this;
  }
  getComponent(e, t) {
    let n = this.array[e * this.data.stride + this.offset + t];
    return this.normalized && (n = ln(n, this.array)), n;
  }
  setComponent(e, t, n) {
    return this.normalized && (n = $e(n, this.array)), this.data.array[e * this.data.stride + this.offset + t] = n, this;
  }
  setX(e, t) {
    return this.normalized && (t = $e(t, this.array)), this.data.array[e * this.data.stride + this.offset] = t, this;
  }
  setY(e, t) {
    return this.normalized && (t = $e(t, this.array)), this.data.array[e * this.data.stride + this.offset + 1] = t, this;
  }
  setZ(e, t) {
    return this.normalized && (t = $e(t, this.array)), this.data.array[e * this.data.stride + this.offset + 2] = t, this;
  }
  setW(e, t) {
    return this.normalized && (t = $e(t, this.array)), this.data.array[e * this.data.stride + this.offset + 3] = t, this;
  }
  getX(e) {
    let t = this.data.array[e * this.data.stride + this.offset];
    return this.normalized && (t = ln(t, this.array)), t;
  }
  getY(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 1];
    return this.normalized && (t = ln(t, this.array)), t;
  }
  getZ(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 2];
    return this.normalized && (t = ln(t, this.array)), t;
  }
  getW(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 3];
    return this.normalized && (t = ln(t, this.array)), t;
  }
  setXY(e, t, n) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = $e(t, this.array), n = $e(n, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this;
  }
  setXYZ(e, t, n, s) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = $e(t, this.array), n = $e(n, this.array), s = $e(s, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = s, this;
  }
  setXYZW(e, t, n, s, r) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = $e(t, this.array), n = $e(n, this.array), s = $e(s, this.array), r = $e(r, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = s, this.data.array[e + 3] = r, this;
  }
  clone(e) {
    if (e === void 0) {
      console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let n = 0; n < this.count; n++) {
        const s = n * this.data.stride + this.offset;
        for (let r = 0; r < this.itemSize; r++) t.push(this.data.array[s + r]);
      }
      return new Ft(new this.array.constructor(t), this.itemSize, this.normalized);
    } else return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.clone(e)), new Zo(e.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
  }
  toJSON(e) {
    if (e === void 0) {
      console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let n = 0; n < this.count; n++) {
        const s = n * this.data.stride + this.offset;
        for (let r = 0; r < this.itemSize; r++) t.push(this.data.array[s + r]);
      }
      return { itemSize: this.itemSize, type: this.array.constructor.name, array: t, normalized: this.normalized };
    } else return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)), { isInterleavedBufferAttribute: true, itemSize: this.itemSize, data: this.data.uuid, offset: this.offset, normalized: this.normalized };
  }
}
const Wl = new L(), Xl = new Ke(), ql = new Ke(), Gd = new L(), Yl = new Be(), lr = new L(), ga = new An(), jl = new Be(), _a = new us();
class Wd extends _t {
  constructor(e, t) {
    super(e, t), this.isSkinnedMesh = true, this.type = "SkinnedMesh", this.bindMode = yl, this.bindMatrix = new Be(), this.bindMatrixInverse = new Be(), this.boundingBox = null, this.boundingSphere = null;
  }
  computeBoundingBox() {
    const e = this.geometry;
    this.boundingBox === null && (this.boundingBox = new Kt()), this.boundingBox.makeEmpty();
    const t = e.getAttribute("position");
    for (let n = 0; n < t.count; n++) this.getVertexPosition(n, lr), this.boundingBox.expandByPoint(lr);
  }
  computeBoundingSphere() {
    const e = this.geometry;
    this.boundingSphere === null && (this.boundingSphere = new An()), this.boundingSphere.makeEmpty();
    const t = e.getAttribute("position");
    for (let n = 0; n < t.count; n++) this.getVertexPosition(n, lr), this.boundingSphere.expandByPoint(lr);
  }
  copy(e, t) {
    return super.copy(e, t), this.bindMode = e.bindMode, this.bindMatrix.copy(e.bindMatrix), this.bindMatrixInverse.copy(e.bindMatrixInverse), this.skeleton = e.skeleton, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
  }
  raycast(e, t) {
    const n = this.material, s = this.matrixWorld;
    n !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), ga.copy(this.boundingSphere), ga.applyMatrix4(s), e.ray.intersectsSphere(ga) !== false && (jl.copy(s).invert(), _a.copy(e.ray).applyMatrix4(jl), !(this.boundingBox !== null && _a.intersectsBox(this.boundingBox) === false) && this._computeIntersections(e, t, _a)));
  }
  getVertexPosition(e, t) {
    return super.getVertexPosition(e, t), this.applyBoneTransform(e, t), t;
  }
  bind(e, t) {
    this.skeleton = e, t === void 0 && (this.updateMatrixWorld(true), this.skeleton.calculateInverses(), t = this.matrixWorld), this.bindMatrix.copy(t), this.bindMatrixInverse.copy(t).invert();
  }
  pose() {
    this.skeleton.pose();
  }
  normalizeSkinWeights() {
    const e = new Ke(), t = this.geometry.attributes.skinWeight;
    for (let n = 0, s = t.count; n < s; n++) {
      e.fromBufferAttribute(t, n);
      const r = 1 / e.manhattanLength();
      r !== 1 / 0 ? e.multiplyScalar(r) : e.set(1, 0, 0, 0), t.setXYZW(n, e.x, e.y, e.z, e.w);
    }
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e), this.bindMode === yl ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === Ou ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : console.warn("THREE.SkinnedMesh: Unrecognized bindMode: " + this.bindMode);
  }
  applyBoneTransform(e, t) {
    const n = this.skeleton, s = this.geometry;
    Xl.fromBufferAttribute(s.attributes.skinIndex, e), ql.fromBufferAttribute(s.attributes.skinWeight, e), Wl.copy(t).applyMatrix4(this.bindMatrix), t.set(0, 0, 0);
    for (let r = 0; r < 4; r++) {
      const a = ql.getComponent(r);
      if (a !== 0) {
        const o = Xl.getComponent(r);
        Yl.multiplyMatrices(n.bones[o].matrixWorld, n.boneInverses[o]), t.addScaledVector(Gd.copy(Wl).applyMatrix4(Yl), a);
      }
    }
    return t.applyMatrix4(this.bindMatrixInverse);
  }
}
class Sh extends ot {
  constructor() {
    super(), this.isBone = true, this.type = "Bone";
  }
}
class Eh extends bt {
  constructor(e = null, t = 1, n = 1, s, r, a, o, l, c = Nt, u = Nt, h, d) {
    super(null, a, o, l, c, u, s, r, h, d), this.isDataTexture = true, this.image = { data: e, width: t, height: n }, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
  }
}
const Kl = new Be(), Xd = new Be();
class $o {
  constructor(e = [], t = []) {
    this.uuid = un(), this.bones = e.slice(0), this.boneInverses = t, this.boneMatrices = null, this.boneTexture = null, this.init();
  }
  init() {
    const e = this.bones, t = this.boneInverses;
    if (this.boneMatrices = new Float32Array(e.length * 16), t.length === 0) this.calculateInverses();
    else if (e.length !== t.length) {
      console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."), this.boneInverses = [];
      for (let n = 0, s = this.bones.length; n < s; n++) this.boneInverses.push(new Be());
    }
  }
  calculateInverses() {
    this.boneInverses.length = 0;
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = new Be();
      this.bones[e] && n.copy(this.bones[e].matrixWorld).invert(), this.boneInverses.push(n);
    }
  }
  pose() {
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = this.bones[e];
      n && n.matrixWorld.copy(this.boneInverses[e]).invert();
    }
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = this.bones[e];
      n && (n.parent && n.parent.isBone ? (n.matrix.copy(n.parent.matrixWorld).invert(), n.matrix.multiply(n.matrixWorld)) : n.matrix.copy(n.matrixWorld), n.matrix.decompose(n.position, n.quaternion, n.scale));
    }
  }
  update() {
    const e = this.bones, t = this.boneInverses, n = this.boneMatrices, s = this.boneTexture;
    for (let r = 0, a = e.length; r < a; r++) {
      const o = e[r] ? e[r].matrixWorld : Xd;
      Kl.multiplyMatrices(o, t[r]), Kl.toArray(n, r * 16);
    }
    s !== null && (s.needsUpdate = true);
  }
  clone() {
    return new $o(this.bones, this.boneInverses);
  }
  computeBoneTexture() {
    let e = Math.sqrt(this.bones.length * 4);
    e = Math.ceil(e / 4) * 4, e = Math.max(e, 4);
    const t = new Float32Array(e * e * 4);
    t.set(this.boneMatrices);
    const n = new Eh(t, e, e, Yt, hn);
    return n.needsUpdate = true, this.boneMatrices = t, this.boneTexture = n, this;
  }
  getBoneByName(e) {
    for (let t = 0, n = this.bones.length; t < n; t++) {
      const s = this.bones[t];
      if (s.name === e) return s;
    }
  }
  dispose() {
    this.boneTexture !== null && (this.boneTexture.dispose(), this.boneTexture = null);
  }
  fromJSON(e, t) {
    this.uuid = e.uuid;
    for (let n = 0, s = e.bones.length; n < s; n++) {
      const r = e.bones[n];
      let a = t[r];
      a === void 0 && (console.warn("THREE.Skeleton: No bone found with UUID:", r), a = new Sh()), this.bones.push(a), this.boneInverses.push(new Be().fromArray(e.boneInverses[n]));
    }
    return this.init(), this;
  }
  toJSON() {
    const e = { metadata: { version: 4.7, type: "Skeleton", generator: "Skeleton.toJSON" }, bones: [], boneInverses: [] };
    e.uuid = this.uuid;
    const t = this.bones, n = this.boneInverses;
    for (let s = 0, r = t.length; s < r; s++) {
      const a = t[s];
      e.bones.push(a.uuid);
      const o = n[s];
      e.boneInverses.push(o.toArray());
    }
    return e;
  }
}
class To extends Ft {
  constructor(e, t, n, s = 1) {
    super(e, t, n), this.isInstancedBufferAttribute = true, this.meshPerAttribute = s;
  }
  copy(e) {
    return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this;
  }
  toJSON() {
    const e = super.toJSON();
    return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = true, e;
  }
}
const Wi = new Be(), Zl = new Be(), cr = [], $l = new Kt(), qd = new Be(), Ss = new _t(), Es = new An();
class Th extends _t {
  constructor(e, t, n) {
    super(e, t), this.isInstancedMesh = true, this.instanceMatrix = new To(new Float32Array(n * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = n, this.boundingBox = null, this.boundingSphere = null;
    for (let s = 0; s < n; s++) this.setMatrixAt(s, qd);
  }
  computeBoundingBox() {
    const e = this.geometry, t = this.count;
    this.boundingBox === null && (this.boundingBox = new Kt()), e.boundingBox === null && e.computeBoundingBox(), this.boundingBox.makeEmpty();
    for (let n = 0; n < t; n++) this.getMatrixAt(n, Wi), $l.copy(e.boundingBox).applyMatrix4(Wi), this.boundingBox.union($l);
  }
  computeBoundingSphere() {
    const e = this.geometry, t = this.count;
    this.boundingSphere === null && (this.boundingSphere = new An()), e.boundingSphere === null && e.computeBoundingSphere(), this.boundingSphere.makeEmpty();
    for (let n = 0; n < t; n++) this.getMatrixAt(n, Wi), Es.copy(e.boundingSphere).applyMatrix4(Wi), this.boundingSphere.union(Es);
  }
  copy(e, t) {
    return super.copy(e, t), this.instanceMatrix.copy(e.instanceMatrix), e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()), e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
  }
  getColorAt(e, t) {
    t.fromArray(this.instanceColor.array, e * 3);
  }
  getMatrixAt(e, t) {
    t.fromArray(this.instanceMatrix.array, e * 16);
  }
  getMorphAt(e, t) {
    const n = t.morphTargetInfluences, s = this.morphTexture.source.data.data, r = n.length + 1, a = e * r + 1;
    for (let o = 0; o < n.length; o++) n[o] = s[a + o];
  }
  raycast(e, t) {
    const n = this.matrixWorld, s = this.count;
    if (Ss.geometry = this.geometry, Ss.material = this.material, Ss.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), Es.copy(this.boundingSphere), Es.applyMatrix4(n), e.ray.intersectsSphere(Es) !== false)) for (let r = 0; r < s; r++) {
      this.getMatrixAt(r, Wi), Zl.multiplyMatrices(n, Wi), Ss.matrixWorld = Zl, Ss.raycast(e, cr);
      for (let a = 0, o = cr.length; a < o; a++) {
        const l = cr[a];
        l.instanceId = r, l.object = this, t.push(l);
      }
      cr.length = 0;
    }
  }
  setColorAt(e, t) {
    this.instanceColor === null && (this.instanceColor = new To(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), t.toArray(this.instanceColor.array, e * 3);
  }
  setMatrixAt(e, t) {
    t.toArray(this.instanceMatrix.array, e * 16);
  }
  setMorphAt(e, t) {
    const n = t.morphTargetInfluences, s = n.length + 1;
    this.morphTexture === null && (this.morphTexture = new Eh(new Float32Array(s * this.count), s, this.count, Vo, hn));
    const r = this.morphTexture.source.data.data;
    let a = 0;
    for (let c = 0; c < n.length; c++) a += n[c];
    const o = this.geometry.morphTargetsRelative ? 1 : 1 - a, l = s * e;
    r[l] = o, r.set(n, l + 1);
  }
  updateMorphTargets() {
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null);
  }
}
const xa = new L(), Yd = new L(), jd = new Oe();
class vn {
  constructor(e = new L(1, 0, 0), t = 0) {
    this.isPlane = true, this.normal = e, this.constant = t;
  }
  set(e, t) {
    return this.normal.copy(e), this.constant = t, this;
  }
  setComponents(e, t, n, s) {
    return this.normal.set(e, t, n), this.constant = s, this;
  }
  setFromNormalAndCoplanarPoint(e, t) {
    return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
  }
  setFromCoplanarPoints(e, t, n) {
    const s = xa.subVectors(n, t).cross(Yd.subVectors(e, t)).normalize();
    return this.setFromNormalAndCoplanarPoint(s, e), this;
  }
  copy(e) {
    return this.normal.copy(e.normal), this.constant = e.constant, this;
  }
  normalize() {
    const e = 1 / this.normal.length();
    return this.normal.multiplyScalar(e), this.constant *= e, this;
  }
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  distanceToPoint(e) {
    return this.normal.dot(e) + this.constant;
  }
  distanceToSphere(e) {
    return this.distanceToPoint(e.center) - e.radius;
  }
  projectPoint(e, t) {
    return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
  }
  intersectLine(e, t) {
    const n = e.delta(xa), s = this.normal.dot(n);
    if (s === 0) return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
    const r = -(e.start.dot(this.normal) + this.constant) / s;
    return r < 0 || r > 1 ? null : t.copy(e.start).addScaledVector(n, r);
  }
  intersectsLine(e) {
    const t = this.distanceToPoint(e.start), n = this.distanceToPoint(e.end);
    return t < 0 && n > 0 || n < 0 && t > 0;
  }
  intersectsBox(e) {
    return e.intersectsPlane(this);
  }
  intersectsSphere(e) {
    return e.intersectsPlane(this);
  }
  coplanarPoint(e) {
    return e.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(e, t) {
    const n = t || jd.getNormalMatrix(e), s = this.coplanarPoint(xa).applyMatrix4(e), r = this.normal.applyMatrix3(n).normalize();
    return this.constant = -s.dot(r), this;
  }
  translate(e) {
    return this.constant -= e.dot(this.normal), this;
  }
  equals(e) {
    return e.normal.equals(this.normal) && e.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const fi = new An(), Kd = new Ee(0.5, 0.5), hr = new L();
class Jo {
  constructor(e = new vn(), t = new vn(), n = new vn(), s = new vn(), r = new vn(), a = new vn()) {
    this.planes = [e, t, n, s, r, a];
  }
  set(e, t, n, s, r, a) {
    const o = this.planes;
    return o[0].copy(e), o[1].copy(t), o[2].copy(n), o[3].copy(s), o[4].copy(r), o[5].copy(a), this;
  }
  copy(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) t[n].copy(e.planes[n]);
    return this;
  }
  setFromProjectionMatrix(e, t = Sn, n = false) {
    const s = this.planes, r = e.elements, a = r[0], o = r[1], l = r[2], c = r[3], u = r[4], h = r[5], d = r[6], p = r[7], g = r[8], _ = r[9], m = r[10], f = r[11], b = r[12], E = r[13], y = r[14], w = r[15];
    if (s[0].setComponents(c - a, p - u, f - g, w - b).normalize(), s[1].setComponents(c + a, p + u, f + g, w + b).normalize(), s[2].setComponents(c + o, p + h, f + _, w + E).normalize(), s[3].setComponents(c - o, p - h, f - _, w - E).normalize(), n) s[4].setComponents(l, d, m, y).normalize(), s[5].setComponents(c - l, p - d, f - m, w - y).normalize();
    else if (s[4].setComponents(c - l, p - d, f - m, w - y).normalize(), t === Sn) s[5].setComponents(c + l, p + d, f + m, w + y).normalize();
    else if (t === Dr) s[5].setComponents(l, d, m, y).normalize();
    else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
    return this;
  }
  intersectsObject(e) {
    if (e.boundingSphere !== void 0) e.boundingSphere === null && e.computeBoundingSphere(), fi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
    else {
      const t = e.geometry;
      t.boundingSphere === null && t.computeBoundingSphere(), fi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);
    }
    return this.intersectsSphere(fi);
  }
  intersectsSprite(e) {
    fi.center.set(0, 0, 0);
    const t = Kd.distanceTo(e.center);
    return fi.radius = 0.7071067811865476 + t, fi.applyMatrix4(e.matrixWorld), this.intersectsSphere(fi);
  }
  intersectsSphere(e) {
    const t = this.planes, n = e.center, s = -e.radius;
    for (let r = 0; r < 6; r++) if (t[r].distanceToPoint(n) < s) return false;
    return true;
  }
  intersectsBox(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) {
      const s = t[n];
      if (hr.x = s.normal.x > 0 ? e.max.x : e.min.x, hr.y = s.normal.y > 0 ? e.max.y : e.min.y, hr.z = s.normal.z > 0 ? e.max.z : e.min.z, s.distanceToPoint(hr) < 0) return false;
    }
    return true;
  }
  containsPoint(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) if (t[n].distanceToPoint(e) < 0) return false;
    return true;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class bh extends dn {
  constructor(e) {
    super(), this.isLineBasicMaterial = true, this.type = "LineBasicMaterial", this.color = new we(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = true, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
  }
}
const Ir = new L(), Ur = new L(), Jl = new Be(), Ts = new us(), ur = new An(), va = new L(), Ql = new L();
class Qo extends ot {
  constructor(e = new wn(), t = new bh()) {
    super(), this.isLine = true, this.type = "Line", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position, n = [0];
      for (let s = 1, r = t.count; s < r; s++) Ir.fromBufferAttribute(t, s - 1), Ur.fromBufferAttribute(t, s), n[s] = n[s - 1], n[s] += Ir.distanceTo(Ur);
      e.setAttribute("lineDistance", new Hn(n, 1));
    } else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
  raycast(e, t) {
    const n = this.geometry, s = this.matrixWorld, r = e.params.Line.threshold, a = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), ur.copy(n.boundingSphere), ur.applyMatrix4(s), ur.radius += r, e.ray.intersectsSphere(ur) === false) return;
    Jl.copy(s).invert(), Ts.copy(e.ray).applyMatrix4(Jl);
    const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = o * o, c = this.isLineSegments ? 2 : 1, u = n.index, d = n.attributes.position;
    if (u !== null) {
      const p = Math.max(0, a.start), g = Math.min(u.count, a.start + a.count);
      for (let _ = p, m = g - 1; _ < m; _ += c) {
        const f = u.getX(_), b = u.getX(_ + 1), E = dr(this, e, Ts, l, f, b, _);
        E && t.push(E);
      }
      if (this.isLineLoop) {
        const _ = u.getX(g - 1), m = u.getX(p), f = dr(this, e, Ts, l, _, m, g - 1);
        f && t.push(f);
      }
    } else {
      const p = Math.max(0, a.start), g = Math.min(d.count, a.start + a.count);
      for (let _ = p, m = g - 1; _ < m; _ += c) {
        const f = dr(this, e, Ts, l, _, _ + 1, _);
        f && t.push(f);
      }
      if (this.isLineLoop) {
        const _ = dr(this, e, Ts, l, g - 1, p, g - 1);
        _ && t.push(_);
      }
    }
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const s = t[n[0]];
      if (s !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = s.length; r < a; r++) {
          const o = s[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
}
function dr(i, e, t, n, s, r, a) {
  const o = i.geometry.attributes.position;
  if (Ir.fromBufferAttribute(o, s), Ur.fromBufferAttribute(o, r), t.distanceSqToSegment(Ir, Ur, va, Ql) > n) return;
  va.applyMatrix4(i.matrixWorld);
  const c = e.ray.origin.distanceTo(va);
  if (!(c < e.near || c > e.far)) return { distance: c, point: Ql.clone().applyMatrix4(i.matrixWorld), index: a, face: null, faceIndex: null, barycoord: null, object: i };
}
const ec = new L(), tc = new L();
class Zd extends Qo {
  constructor(e, t) {
    super(e, t), this.isLineSegments = true, this.type = "LineSegments";
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position, n = [];
      for (let s = 0, r = t.count; s < r; s += 2) ec.fromBufferAttribute(t, s), tc.fromBufferAttribute(t, s + 1), n[s] = s === 0 ? 0 : n[s - 1], n[s + 1] = n[s] + ec.distanceTo(tc);
      e.setAttribute("lineDistance", new Hn(n, 1));
    } else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
}
class $d extends Qo {
  constructor(e, t) {
    super(e, t), this.isLineLoop = true, this.type = "LineLoop";
  }
}
class Ah extends dn {
  constructor(e) {
    super(), this.isPointsMaterial = true, this.type = "PointsMaterial", this.color = new we(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = true, this.fog = true, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
  }
}
const nc = new Be(), bo = new us(), fr = new An(), pr = new L();
class Jd extends ot {
  constructor(e = new wn(), t = new Ah()) {
    super(), this.isPoints = true, this.type = "Points", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  raycast(e, t) {
    const n = this.geometry, s = this.matrixWorld, r = e.params.Points.threshold, a = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), fr.copy(n.boundingSphere), fr.applyMatrix4(s), fr.radius += r, e.ray.intersectsSphere(fr) === false) return;
    nc.copy(s).invert(), bo.copy(e.ray).applyMatrix4(nc);
    const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = o * o, c = n.index, h = n.attributes.position;
    if (c !== null) {
      const d = Math.max(0, a.start), p = Math.min(c.count, a.start + a.count);
      for (let g = d, _ = p; g < _; g++) {
        const m = c.getX(g);
        pr.fromBufferAttribute(h, m), ic(pr, m, l, s, e, t, this);
      }
    } else {
      const d = Math.max(0, a.start), p = Math.min(h.count, a.start + a.count);
      for (let g = d, _ = p; g < _; g++) pr.fromBufferAttribute(h, g), ic(pr, g, l, s, e, t, this);
    }
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const s = t[n[0]];
      if (s !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = s.length; r < a; r++) {
          const o = s[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
}
function ic(i, e, t, n, s, r, a) {
  const o = bo.distanceSqToPoint(i);
  if (o < t) {
    const l = new L();
    bo.closestPointToPoint(i, l), l.applyMatrix4(n);
    const c = s.ray.origin.distanceTo(l);
    if (c < s.near || c > s.far) return;
    r.push({ distance: c, distanceToRay: Math.sqrt(o), point: l, index: e, face: null, faceIndex: null, barycoord: null, object: a });
  }
}
class wh extends bt {
  constructor(e, t, n = Ti, s, r, a, o = Nt, l = Nt, c, u = Ns, h = 1) {
    if (u !== Ns && u !== Fs) throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    const d = { width: e, height: t, depth: h };
    super(d, s, r, a, o, l, u, n, c), this.isDepthTexture = true, this.flipY = false, this.generateMipmaps = false, this.compareFunction = null;
  }
  copy(e) {
    return super.copy(e), this.source = new jo(Object.assign({}, e.image)), this.compareFunction = e.compareFunction, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.compareFunction !== null && (t.compareFunction = this.compareFunction), t;
  }
}
class Rh extends bt {
  constructor(e = null) {
    super(), this.sourceTexture = e, this.isExternalTexture = true;
  }
  copy(e) {
    return super.copy(e), this.sourceTexture = e.sourceTexture, this;
  }
}
class Hr extends wn {
  constructor(e = 1, t = 1, n = 1, s = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = { width: e, height: t, widthSegments: n, heightSegments: s };
    const r = e / 2, a = t / 2, o = Math.floor(n), l = Math.floor(s), c = o + 1, u = l + 1, h = e / o, d = t / l, p = [], g = [], _ = [], m = [];
    for (let f = 0; f < u; f++) {
      const b = f * d - a;
      for (let E = 0; E < c; E++) {
        const y = E * h - r;
        g.push(y, -b, 0), _.push(0, 0, 1), m.push(E / o), m.push(1 - f / l);
      }
    }
    for (let f = 0; f < l; f++) for (let b = 0; b < o; b++) {
      const E = b + c * f, y = b + c * (f + 1), w = b + 1 + c * (f + 1), C = b + 1 + c * f;
      p.push(E, y, C), p.push(y, w, C);
    }
    this.setIndex(p), this.setAttribute("position", new Hn(g, 3)), this.setAttribute("normal", new Hn(_, 3)), this.setAttribute("uv", new Hn(m, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  static fromJSON(e) {
    return new Hr(e.width, e.height, e.widthSegments, e.heightSegments);
  }
}
class Ai extends dn {
  constructor(e) {
    super(), this.isMeshStandardMaterial = true, this.type = "MeshStandardMaterial", this.defines = { STANDARD: "" }, this.color = new we(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new we(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = qo, this.normalScale = new Ee(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new fn(), this.envMapIntensity = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = false, this.fog = true, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.defines = { STANDARD: "" }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
  }
}
class pn extends Ai {
  constructor(e) {
    super(), this.isMeshPhysicalMaterial = true, this.defines = { STANDARD: "", PHYSICAL: "" }, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new Ee(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", { get: function() {
      return ze(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
    }, set: function(t) {
      this.ior = (1 + 0.4 * t) / (1 - 0.4 * t);
    } }), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [100, 400], this.iridescenceThicknessMap = null, this.sheenColor = new we(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = 1 / 0, this.attenuationColor = new we(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new we(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._dispersion = 0, this._iridescence = 0, this._sheen = 0, this._transmission = 0, this.setValues(e);
  }
  get anisotropy() {
    return this._anisotropy;
  }
  set anisotropy(e) {
    this._anisotropy > 0 != e > 0 && this.version++, this._anisotropy = e;
  }
  get clearcoat() {
    return this._clearcoat;
  }
  set clearcoat(e) {
    this._clearcoat > 0 != e > 0 && this.version++, this._clearcoat = e;
  }
  get iridescence() {
    return this._iridescence;
  }
  set iridescence(e) {
    this._iridescence > 0 != e > 0 && this.version++, this._iridescence = e;
  }
  get dispersion() {
    return this._dispersion;
  }
  set dispersion(e) {
    this._dispersion > 0 != e > 0 && this.version++, this._dispersion = e;
  }
  get sheen() {
    return this._sheen;
  }
  set sheen(e) {
    this._sheen > 0 != e > 0 && this.version++, this._sheen = e;
  }
  get transmission() {
    return this._transmission;
  }
  set transmission(e) {
    this._transmission > 0 != e > 0 && this.version++, this._transmission = e;
  }
  copy(e) {
    return super.copy(e), this.defines = { STANDARD: "", PHYSICAL: "" }, this.anisotropy = e.anisotropy, this.anisotropyRotation = e.anisotropyRotation, this.anisotropyMap = e.anisotropyMap, this.clearcoat = e.clearcoat, this.clearcoatMap = e.clearcoatMap, this.clearcoatRoughness = e.clearcoatRoughness, this.clearcoatRoughnessMap = e.clearcoatRoughnessMap, this.clearcoatNormalMap = e.clearcoatNormalMap, this.clearcoatNormalScale.copy(e.clearcoatNormalScale), this.dispersion = e.dispersion, this.ior = e.ior, this.iridescence = e.iridescence, this.iridescenceMap = e.iridescenceMap, this.iridescenceIOR = e.iridescenceIOR, this.iridescenceThicknessRange = [...e.iridescenceThicknessRange], this.iridescenceThicknessMap = e.iridescenceThicknessMap, this.sheen = e.sheen, this.sheenColor.copy(e.sheenColor), this.sheenColorMap = e.sheenColorMap, this.sheenRoughness = e.sheenRoughness, this.sheenRoughnessMap = e.sheenRoughnessMap, this.transmission = e.transmission, this.transmissionMap = e.transmissionMap, this.thickness = e.thickness, this.thicknessMap = e.thicknessMap, this.attenuationDistance = e.attenuationDistance, this.attenuationColor.copy(e.attenuationColor), this.specularIntensity = e.specularIntensity, this.specularIntensityMap = e.specularIntensityMap, this.specularColor.copy(e.specularColor), this.specularColorMap = e.specularColorMap, this;
  }
}
class Qd extends dn {
  constructor(e) {
    super(), this.isMeshLambertMaterial = true, this.type = "MeshLambertMaterial", this.color = new we(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new we(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = qo, this.normalScale = new Ee(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new fn(), this.combine = Bo, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = false, this.fog = true, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
  }
}
class ef extends dn {
  constructor(e) {
    super(), this.isMeshDepthMaterial = true, this.type = "MeshDepthMaterial", this.depthPacking = zu, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = false, this.wireframeLinewidth = 1, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
  }
}
class tf extends dn {
  constructor(e) {
    super(), this.isMeshDistanceMaterial = true, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
  }
}
function mr(i, e) {
  return !i || i.constructor === e ? i : typeof e.BYTES_PER_ELEMENT == "number" ? new e(i) : Array.prototype.slice.call(i);
}
function nf(i) {
  return ArrayBuffer.isView(i) && !(i instanceof DataView);
}
function sf(i) {
  function e(s, r) {
    return i[s] - i[r];
  }
  const t = i.length, n = new Array(t);
  for (let s = 0; s !== t; ++s) n[s] = s;
  return n.sort(e), n;
}
function sc(i, e, t) {
  const n = i.length, s = new i.constructor(n);
  for (let r = 0, a = 0; a !== n; ++r) {
    const o = t[r] * e;
    for (let l = 0; l !== e; ++l) s[a++] = i[o + l];
  }
  return s;
}
function Ch(i, e, t, n) {
  let s = 1, r = i[0];
  for (; r !== void 0 && r[n] === void 0; ) r = i[s++];
  if (r === void 0) return;
  let a = r[n];
  if (a !== void 0) if (Array.isArray(a)) do
    a = r[n], a !== void 0 && (e.push(r.time), t.push(...a)), r = i[s++];
  while (r !== void 0);
  else if (a.toArray !== void 0) do
    a = r[n], a !== void 0 && (e.push(r.time), a.toArray(t, t.length)), r = i[s++];
  while (r !== void 0);
  else do
    a = r[n], a !== void 0 && (e.push(r.time), t.push(a)), r = i[s++];
  while (r !== void 0);
}
class Vs {
  constructor(e, t, n, s) {
    this.parameterPositions = e, this._cachedIndex = 0, this.resultBuffer = s !== void 0 ? s : new t.constructor(n), this.sampleValues = t, this.valueSize = n, this.settings = null, this.DefaultSettings_ = {};
  }
  evaluate(e) {
    const t = this.parameterPositions;
    let n = this._cachedIndex, s = t[n], r = t[n - 1];
    n: {
      e: {
        let a;
        t: {
          i: if (!(e < s)) {
            for (let o = n + 2; ; ) {
              if (s === void 0) {
                if (e < r) break i;
                return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
              }
              if (n === o) break;
              if (r = s, s = t[++n], e < s) break e;
            }
            a = t.length;
            break t;
          }
          if (!(e >= r)) {
            const o = t[1];
            e < o && (n = 2, r = o);
            for (let l = n - 2; ; ) {
              if (r === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
              if (n === l) break;
              if (s = r, r = t[--n - 1], e >= r) break e;
            }
            a = n, n = 0;
            break t;
          }
          break n;
        }
        for (; n < a; ) {
          const o = n + a >>> 1;
          e < t[o] ? a = o : n = o + 1;
        }
        if (s = t[n], r = t[n - 1], r === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
        if (s === void 0) return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
      }
      this._cachedIndex = n, this.intervalChanged_(n, r, s);
    }
    return this.interpolate_(n, r, e, s);
  }
  getSettings_() {
    return this.settings || this.DefaultSettings_;
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, n = this.sampleValues, s = this.valueSize, r = e * s;
    for (let a = 0; a !== s; ++a) t[a] = n[r + a];
    return t;
  }
  interpolate_() {
    throw new Error("call to abstract method");
  }
  intervalChanged_() {
  }
}
class rf extends Vs {
  constructor(e, t, n, s) {
    super(e, t, n, s), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = { endingStart: Ml, endingEnd: Ml };
  }
  intervalChanged_(e, t, n) {
    const s = this.parameterPositions;
    let r = e - 2, a = e + 1, o = s[r], l = s[a];
    if (o === void 0) switch (this.getSettings_().endingStart) {
      case Sl:
        r = e, o = 2 * t - n;
        break;
      case El:
        r = s.length - 2, o = t + s[r] - s[r + 1];
        break;
      default:
        r = e, o = n;
    }
    if (l === void 0) switch (this.getSettings_().endingEnd) {
      case Sl:
        a = e, l = 2 * n - t;
        break;
      case El:
        a = 1, l = n + s[1] - s[0];
        break;
      default:
        a = e - 1, l = t;
    }
    const c = (n - t) * 0.5, u = this.valueSize;
    this._weightPrev = c / (t - o), this._weightNext = c / (l - n), this._offsetPrev = r * u, this._offsetNext = a * u;
  }
  interpolate_(e, t, n, s) {
    const r = this.resultBuffer, a = this.sampleValues, o = this.valueSize, l = e * o, c = l - o, u = this._offsetPrev, h = this._offsetNext, d = this._weightPrev, p = this._weightNext, g = (n - t) / (s - t), _ = g * g, m = _ * g, f = -d * m + 2 * d * _ - d * g, b = (1 + d) * m + (-1.5 - 2 * d) * _ + (-0.5 + d) * g + 1, E = (-1 - p) * m + (1.5 + p) * _ + 0.5 * g, y = p * m - p * _;
    for (let w = 0; w !== o; ++w) r[w] = f * a[u + w] + b * a[c + w] + E * a[l + w] + y * a[h + w];
    return r;
  }
}
class af extends Vs {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  interpolate_(e, t, n, s) {
    const r = this.resultBuffer, a = this.sampleValues, o = this.valueSize, l = e * o, c = l - o, u = (n - t) / (s - t), h = 1 - u;
    for (let d = 0; d !== o; ++d) r[d] = a[c + d] * h + a[l + d] * u;
    return r;
  }
}
class of extends Vs {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  interpolate_(e) {
    return this.copySampleValue_(e - 1);
  }
}
class mn {
  constructor(e, t, n, s) {
    if (e === void 0) throw new Error("THREE.KeyframeTrack: track name is undefined");
    if (t === void 0 || t.length === 0) throw new Error("THREE.KeyframeTrack: no keyframes in track named " + e);
    this.name = e, this.times = mr(t, this.TimeBufferType), this.values = mr(n, this.ValueBufferType), this.setInterpolation(s || this.DefaultInterpolation);
  }
  static toJSON(e) {
    const t = e.constructor;
    let n;
    if (t.toJSON !== this.toJSON) n = t.toJSON(e);
    else {
      n = { name: e.name, times: mr(e.times, Array), values: mr(e.values, Array) };
      const s = e.getInterpolation();
      s !== e.DefaultInterpolation && (n.interpolation = s);
    }
    return n.type = e.ValueTypeName, n;
  }
  InterpolantFactoryMethodDiscrete(e) {
    return new of(this.times, this.values, this.getValueSize(), e);
  }
  InterpolantFactoryMethodLinear(e) {
    return new af(this.times, this.values, this.getValueSize(), e);
  }
  InterpolantFactoryMethodSmooth(e) {
    return new rf(this.times, this.values, this.getValueSize(), e);
  }
  setInterpolation(e) {
    let t;
    switch (e) {
      case Os:
        t = this.InterpolantFactoryMethodDiscrete;
        break;
      case Bs:
        t = this.InterpolantFactoryMethodLinear;
        break;
      case jr:
        t = this.InterpolantFactoryMethodSmooth;
        break;
    }
    if (t === void 0) {
      const n = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
      if (this.createInterpolant === void 0) if (e !== this.DefaultInterpolation) this.setInterpolation(this.DefaultInterpolation);
      else throw new Error(n);
      return console.warn("THREE.KeyframeTrack:", n), this;
    }
    return this.createInterpolant = t, this;
  }
  getInterpolation() {
    switch (this.createInterpolant) {
      case this.InterpolantFactoryMethodDiscrete:
        return Os;
      case this.InterpolantFactoryMethodLinear:
        return Bs;
      case this.InterpolantFactoryMethodSmooth:
        return jr;
    }
  }
  getValueSize() {
    return this.values.length / this.times.length;
  }
  shift(e) {
    if (e !== 0) {
      const t = this.times;
      for (let n = 0, s = t.length; n !== s; ++n) t[n] += e;
    }
    return this;
  }
  scale(e) {
    if (e !== 1) {
      const t = this.times;
      for (let n = 0, s = t.length; n !== s; ++n) t[n] *= e;
    }
    return this;
  }
  trim(e, t) {
    const n = this.times, s = n.length;
    let r = 0, a = s - 1;
    for (; r !== s && n[r] < e; ) ++r;
    for (; a !== -1 && n[a] > t; ) --a;
    if (++a, r !== 0 || a !== s) {
      r >= a && (a = Math.max(a, 1), r = a - 1);
      const o = this.getValueSize();
      this.times = n.slice(r, a), this.values = this.values.slice(r * o, a * o);
    }
    return this;
  }
  validate() {
    let e = true;
    const t = this.getValueSize();
    t - Math.floor(t) !== 0 && (console.error("THREE.KeyframeTrack: Invalid value size in track.", this), e = false);
    const n = this.times, s = this.values, r = n.length;
    r === 0 && (console.error("THREE.KeyframeTrack: Track is empty.", this), e = false);
    let a = null;
    for (let o = 0; o !== r; o++) {
      const l = n[o];
      if (typeof l == "number" && isNaN(l)) {
        console.error("THREE.KeyframeTrack: Time is not a valid number.", this, o, l), e = false;
        break;
      }
      if (a !== null && a > l) {
        console.error("THREE.KeyframeTrack: Out of order keys.", this, o, l, a), e = false;
        break;
      }
      a = l;
    }
    if (s !== void 0 && nf(s)) for (let o = 0, l = s.length; o !== l; ++o) {
      const c = s[o];
      if (isNaN(c)) {
        console.error("THREE.KeyframeTrack: Value is not a valid number.", this, o, c), e = false;
        break;
      }
    }
    return e;
  }
  optimize() {
    const e = this.times.slice(), t = this.values.slice(), n = this.getValueSize(), s = this.getInterpolation() === jr, r = e.length - 1;
    let a = 1;
    for (let o = 1; o < r; ++o) {
      let l = false;
      const c = e[o], u = e[o + 1];
      if (c !== u && (o !== 1 || c !== e[0])) if (s) l = true;
      else {
        const h = o * n, d = h - n, p = h + n;
        for (let g = 0; g !== n; ++g) {
          const _ = t[h + g];
          if (_ !== t[d + g] || _ !== t[p + g]) {
            l = true;
            break;
          }
        }
      }
      if (l) {
        if (o !== a) {
          e[a] = e[o];
          const h = o * n, d = a * n;
          for (let p = 0; p !== n; ++p) t[d + p] = t[h + p];
        }
        ++a;
      }
    }
    if (r > 0) {
      e[a] = e[r];
      for (let o = r * n, l = a * n, c = 0; c !== n; ++c) t[l + c] = t[o + c];
      ++a;
    }
    return a !== e.length ? (this.times = e.slice(0, a), this.values = t.slice(0, a * n)) : (this.times = e, this.values = t), this;
  }
  clone() {
    const e = this.times.slice(), t = this.values.slice(), n = this.constructor, s = new n(this.name, e, t);
    return s.createInterpolant = this.createInterpolant, s;
  }
}
mn.prototype.ValueTypeName = "";
mn.prototype.TimeBufferType = Float32Array;
mn.prototype.ValueBufferType = Float32Array;
mn.prototype.DefaultInterpolation = Bs;
class fs extends mn {
  constructor(e, t, n) {
    super(e, t, n);
  }
}
fs.prototype.ValueTypeName = "bool";
fs.prototype.ValueBufferType = Array;
fs.prototype.DefaultInterpolation = Os;
fs.prototype.InterpolantFactoryMethodLinear = void 0;
fs.prototype.InterpolantFactoryMethodSmooth = void 0;
class Ph extends mn {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
}
Ph.prototype.ValueTypeName = "color";
class as extends mn {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
}
as.prototype.ValueTypeName = "number";
class lf extends Vs {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  interpolate_(e, t, n, s) {
    const r = this.resultBuffer, a = this.sampleValues, o = this.valueSize, l = (n - t) / (s - t);
    let c = e * o;
    for (let u = c + o; c !== u; c += 4) Tn.slerpFlat(r, 0, a, c - o, a, c, l);
    return r;
  }
}
class os extends mn {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  InterpolantFactoryMethodLinear(e) {
    return new lf(this.times, this.values, this.getValueSize(), e);
  }
}
os.prototype.ValueTypeName = "quaternion";
os.prototype.InterpolantFactoryMethodSmooth = void 0;
class ps extends mn {
  constructor(e, t, n) {
    super(e, t, n);
  }
}
ps.prototype.ValueTypeName = "string";
ps.prototype.ValueBufferType = Array;
ps.prototype.DefaultInterpolation = Os;
ps.prototype.InterpolantFactoryMethodLinear = void 0;
ps.prototype.InterpolantFactoryMethodSmooth = void 0;
class ls extends mn {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
}
ls.prototype.ValueTypeName = "vector";
class cf {
  constructor(e = "", t = -1, n = [], s = Bu) {
    this.name = e, this.tracks = n, this.duration = t, this.blendMode = s, this.uuid = un(), this.userData = {}, this.duration < 0 && this.resetDuration();
  }
  static parse(e) {
    const t = [], n = e.tracks, s = 1 / (e.fps || 1);
    for (let a = 0, o = n.length; a !== o; ++a) t.push(uf(n[a]).scale(s));
    const r = new this(e.name, e.duration, t, e.blendMode);
    return r.uuid = e.uuid, r.userData = JSON.parse(e.userData || "{}"), r;
  }
  static toJSON(e) {
    const t = [], n = e.tracks, s = { name: e.name, duration: e.duration, tracks: t, uuid: e.uuid, blendMode: e.blendMode, userData: JSON.stringify(e.userData) };
    for (let r = 0, a = n.length; r !== a; ++r) t.push(mn.toJSON(n[r]));
    return s;
  }
  static CreateFromMorphTargetSequence(e, t, n, s) {
    const r = t.length, a = [];
    for (let o = 0; o < r; o++) {
      let l = [], c = [];
      l.push((o + r - 1) % r, o, (o + 1) % r), c.push(0, 1, 0);
      const u = sf(l);
      l = sc(l, 1, u), c = sc(c, 1, u), !s && l[0] === 0 && (l.push(r), c.push(c[0])), a.push(new as(".morphTargetInfluences[" + t[o].name + "]", l, c).scale(1 / n));
    }
    return new this(e, -1, a);
  }
  static findByName(e, t) {
    let n = e;
    if (!Array.isArray(e)) {
      const s = e;
      n = s.geometry && s.geometry.animations || s.animations;
    }
    for (let s = 0; s < n.length; s++) if (n[s].name === t) return n[s];
    return null;
  }
  static CreateClipsFromMorphTargetSequences(e, t, n) {
    const s = {}, r = /^([\w-]*?)([\d]+)$/;
    for (let o = 0, l = e.length; o < l; o++) {
      const c = e[o], u = c.name.match(r);
      if (u && u.length > 1) {
        const h = u[1];
        let d = s[h];
        d || (s[h] = d = []), d.push(c);
      }
    }
    const a = [];
    for (const o in s) a.push(this.CreateFromMorphTargetSequence(o, s[o], t, n));
    return a;
  }
  static parseAnimation(e, t) {
    if (console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"), !e) return console.error("THREE.AnimationClip: No animation in JSONLoader data."), null;
    const n = function(h, d, p, g, _) {
      if (p.length !== 0) {
        const m = [], f = [];
        Ch(p, m, f, g), m.length !== 0 && _.push(new h(d, m, f));
      }
    }, s = [], r = e.name || "default", a = e.fps || 30, o = e.blendMode;
    let l = e.length || -1;
    const c = e.hierarchy || [];
    for (let h = 0; h < c.length; h++) {
      const d = c[h].keys;
      if (!(!d || d.length === 0)) if (d[0].morphTargets) {
        const p = {};
        let g;
        for (g = 0; g < d.length; g++) if (d[g].morphTargets) for (let _ = 0; _ < d[g].morphTargets.length; _++) p[d[g].morphTargets[_]] = -1;
        for (const _ in p) {
          const m = [], f = [];
          for (let b = 0; b !== d[g].morphTargets.length; ++b) {
            const E = d[g];
            m.push(E.time), f.push(E.morphTarget === _ ? 1 : 0);
          }
          s.push(new as(".morphTargetInfluence[" + _ + "]", m, f));
        }
        l = p.length * a;
      } else {
        const p = ".bones[" + t[h].name + "]";
        n(ls, p + ".position", d, "pos", s), n(os, p + ".quaternion", d, "rot", s), n(ls, p + ".scale", d, "scl", s);
      }
    }
    return s.length === 0 ? null : new this(r, l, s, o);
  }
  resetDuration() {
    const e = this.tracks;
    let t = 0;
    for (let n = 0, s = e.length; n !== s; ++n) {
      const r = this.tracks[n];
      t = Math.max(t, r.times[r.times.length - 1]);
    }
    return this.duration = t, this;
  }
  trim() {
    for (let e = 0; e < this.tracks.length; e++) this.tracks[e].trim(0, this.duration);
    return this;
  }
  validate() {
    let e = true;
    for (let t = 0; t < this.tracks.length; t++) e = e && this.tracks[t].validate();
    return e;
  }
  optimize() {
    for (let e = 0; e < this.tracks.length; e++) this.tracks[e].optimize();
    return this;
  }
  clone() {
    const e = [];
    for (let n = 0; n < this.tracks.length; n++) e.push(this.tracks[n].clone());
    const t = new this.constructor(this.name, this.duration, e, this.blendMode);
    return t.userData = JSON.parse(JSON.stringify(this.userData)), t;
  }
  toJSON() {
    return this.constructor.toJSON(this);
  }
}
function hf(i) {
  switch (i.toLowerCase()) {
    case "scalar":
    case "double":
    case "float":
    case "number":
    case "integer":
      return as;
    case "vector":
    case "vector2":
    case "vector3":
    case "vector4":
      return ls;
    case "color":
      return Ph;
    case "quaternion":
      return os;
    case "bool":
    case "boolean":
      return fs;
    case "string":
      return ps;
  }
  throw new Error("THREE.KeyframeTrack: Unsupported typeName: " + i);
}
function uf(i) {
  if (i.type === void 0) throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");
  const e = hf(i.type);
  if (i.times === void 0) {
    const t = [], n = [];
    Ch(i.keys, t, n, "value"), i.times = t, i.values = n;
  }
  return e.parse !== void 0 ? e.parse(i) : new e(i.name, i.times, i.values, i.interpolation);
}
const Bn = { enabled: false, files: {}, add: function(i, e) {
  this.enabled !== false && (this.files[i] = e);
}, get: function(i) {
  if (this.enabled !== false) return this.files[i];
}, remove: function(i) {
  delete this.files[i];
}, clear: function() {
  this.files = {};
} };
class df {
  constructor(e, t, n) {
    const s = this;
    let r = false, a = 0, o = 0, l;
    const c = [];
    this.onStart = void 0, this.onLoad = e, this.onProgress = t, this.onError = n, this.abortController = new AbortController(), this.itemStart = function(u) {
      o++, r === false && s.onStart !== void 0 && s.onStart(u, a, o), r = true;
    }, this.itemEnd = function(u) {
      a++, s.onProgress !== void 0 && s.onProgress(u, a, o), a === o && (r = false, s.onLoad !== void 0 && s.onLoad());
    }, this.itemError = function(u) {
      s.onError !== void 0 && s.onError(u);
    }, this.resolveURL = function(u) {
      return l ? l(u) : u;
    }, this.setURLModifier = function(u) {
      return l = u, this;
    }, this.addHandler = function(u, h) {
      return c.push(u, h), this;
    }, this.removeHandler = function(u) {
      const h = c.indexOf(u);
      return h !== -1 && c.splice(h, 2), this;
    }, this.getHandler = function(u) {
      for (let h = 0, d = c.length; h < d; h += 2) {
        const p = c[h], g = c[h + 1];
        if (p.global && (p.lastIndex = 0), p.test(u)) return g;
      }
      return null;
    }, this.abort = function() {
      return this.abortController.abort(), this.abortController = new AbortController(), this;
    };
  }
}
const ff = new df();
class ms {
  constructor(e) {
    this.manager = e !== void 0 ? e : ff, this.crossOrigin = "anonymous", this.withCredentials = false, this.path = "", this.resourcePath = "", this.requestHeader = {};
  }
  load() {
  }
  loadAsync(e, t) {
    const n = this;
    return new Promise(function(s, r) {
      n.load(e, s, t, r);
    });
  }
  parse() {
  }
  setCrossOrigin(e) {
    return this.crossOrigin = e, this;
  }
  setWithCredentials(e) {
    return this.withCredentials = e, this;
  }
  setPath(e) {
    return this.path = e, this;
  }
  setResourcePath(e) {
    return this.resourcePath = e, this;
  }
  setRequestHeader(e) {
    return this.requestHeader = e, this;
  }
  abort() {
    return this;
  }
}
ms.DEFAULT_MATERIAL_NAME = "__DEFAULT";
const Un = {};
class pf extends Error {
  constructor(e, t) {
    super(e), this.response = t;
  }
}
class Lh extends ms {
  constructor(e) {
    super(e), this.mimeType = "", this.responseType = "", this._abortController = new AbortController();
  }
  load(e, t, n, s) {
    e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const r = Bn.get(`file:${e}`);
    if (r !== void 0) return this.manager.itemStart(e), setTimeout(() => {
      t && t(r), this.manager.itemEnd(e);
    }, 0), r;
    if (Un[e] !== void 0) {
      Un[e].push({ onLoad: t, onProgress: n, onError: s });
      return;
    }
    Un[e] = [], Un[e].push({ onLoad: t, onProgress: n, onError: s });
    const a = new Request(e, { headers: new Headers(this.requestHeader), credentials: this.withCredentials ? "include" : "same-origin", signal: typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal }), o = this.mimeType, l = this.responseType;
    fetch(a).then((c) => {
      if (c.status === 200 || c.status === 0) {
        if (c.status === 0 && console.warn("THREE.FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || c.body === void 0 || c.body.getReader === void 0) return c;
        const u = Un[e], h = c.body.getReader(), d = c.headers.get("X-File-Size") || c.headers.get("Content-Length"), p = d ? parseInt(d) : 0, g = p !== 0;
        let _ = 0;
        const m = new ReadableStream({ start(f) {
          b();
          function b() {
            h.read().then(({ done: E, value: y }) => {
              if (E) f.close();
              else {
                _ += y.byteLength;
                const w = new ProgressEvent("progress", { lengthComputable: g, loaded: _, total: p });
                for (let C = 0, R = u.length; C < R; C++) {
                  const N = u[C];
                  N.onProgress && N.onProgress(w);
                }
                f.enqueue(y), b();
              }
            }, (E) => {
              f.error(E);
            });
          }
        } });
        return new Response(m);
      } else throw new pf(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`, c);
    }).then((c) => {
      switch (l) {
        case "arraybuffer":
          return c.arrayBuffer();
        case "blob":
          return c.blob();
        case "document":
          return c.text().then((u) => new DOMParser().parseFromString(u, o));
        case "json":
          return c.json();
        default:
          if (o === "") return c.text();
          {
            const h = /charset="?([^;"\s]*)"?/i.exec(o), d = h && h[1] ? h[1].toLowerCase() : void 0, p = new TextDecoder(d);
            return c.arrayBuffer().then((g) => p.decode(g));
          }
      }
    }).then((c) => {
      Bn.add(`file:${e}`, c);
      const u = Un[e];
      delete Un[e];
      for (let h = 0, d = u.length; h < d; h++) {
        const p = u[h];
        p.onLoad && p.onLoad(c);
      }
    }).catch((c) => {
      const u = Un[e];
      if (u === void 0) throw this.manager.itemError(e), c;
      delete Un[e];
      for (let h = 0, d = u.length; h < d; h++) {
        const p = u[h];
        p.onError && p.onError(c);
      }
      this.manager.itemError(e);
    }).finally(() => {
      this.manager.itemEnd(e);
    }), this.manager.itemStart(e);
  }
  setResponseType(e) {
    return this.responseType = e, this;
  }
  setMimeType(e) {
    return this.mimeType = e, this;
  }
  abort() {
    return this._abortController.abort(), this._abortController = new AbortController(), this;
  }
}
const Xi = /* @__PURE__ */ new WeakMap();
class mf extends ms {
  constructor(e) {
    super(e);
  }
  load(e, t, n, s) {
    this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const r = this, a = Bn.get(`image:${e}`);
    if (a !== void 0) {
      if (a.complete === true) r.manager.itemStart(e), setTimeout(function() {
        t && t(a), r.manager.itemEnd(e);
      }, 0);
      else {
        let h = Xi.get(a);
        h === void 0 && (h = [], Xi.set(a, h)), h.push({ onLoad: t, onError: s });
      }
      return a;
    }
    const o = ks("img");
    function l() {
      u(), t && t(this);
      const h = Xi.get(this) || [];
      for (let d = 0; d < h.length; d++) {
        const p = h[d];
        p.onLoad && p.onLoad(this);
      }
      Xi.delete(this), r.manager.itemEnd(e);
    }
    function c(h) {
      u(), s && s(h), Bn.remove(`image:${e}`);
      const d = Xi.get(this) || [];
      for (let p = 0; p < d.length; p++) {
        const g = d[p];
        g.onError && g.onError(h);
      }
      Xi.delete(this), r.manager.itemError(e), r.manager.itemEnd(e);
    }
    function u() {
      o.removeEventListener("load", l, false), o.removeEventListener("error", c, false);
    }
    return o.addEventListener("load", l, false), o.addEventListener("error", c, false), e.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (o.crossOrigin = this.crossOrigin), Bn.add(`image:${e}`, o), r.manager.itemStart(e), o.src = e, o;
  }
}
class Dh extends ms {
  constructor(e) {
    super(e);
  }
  load(e, t, n, s) {
    const r = new bt(), a = new mf(this.manager);
    return a.setCrossOrigin(this.crossOrigin), a.setPath(this.path), a.load(e, function(o) {
      r.image = o, r.needsUpdate = true, t !== void 0 && t(r);
    }, n, s), r;
  }
}
class Vr extends ot {
  constructor(e, t = 1) {
    super(), this.isLight = true, this.type = "Light", this.color = new we(e), this.intensity = t;
  }
  dispose() {
  }
  copy(e, t) {
    return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, this.groundColor !== void 0 && (t.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (t.object.distance = this.distance), this.angle !== void 0 && (t.object.angle = this.angle), this.decay !== void 0 && (t.object.decay = this.decay), this.penumbra !== void 0 && (t.object.penumbra = this.penumbra), this.shadow !== void 0 && (t.object.shadow = this.shadow.toJSON()), this.target !== void 0 && (t.object.target = this.target.uuid), t;
  }
}
class gf extends Vr {
  constructor(e, t, n) {
    super(e, n), this.isHemisphereLight = true, this.type = "HemisphereLight", this.position.copy(ot.DEFAULT_UP), this.updateMatrix(), this.groundColor = new we(t);
  }
  copy(e, t) {
    return super.copy(e, t), this.groundColor.copy(e.groundColor), this;
  }
}
const ya = new Be(), rc = new L(), ac = new L();
class el {
  constructor(e) {
    this.camera = e, this.intensity = 1, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new Ee(512, 512), this.mapType = En, this.map = null, this.mapPass = null, this.matrix = new Be(), this.autoUpdate = true, this.needsUpdate = false, this._frustum = new Jo(), this._frameExtents = new Ee(1, 1), this._viewportCount = 1, this._viewports = [new Ke(0, 0, 1, 1)];
  }
  getViewportCount() {
    return this._viewportCount;
  }
  getFrustum() {
    return this._frustum;
  }
  updateMatrices(e) {
    const t = this.camera, n = this.matrix;
    rc.setFromMatrixPosition(e.matrixWorld), t.position.copy(rc), ac.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(ac), t.updateMatrixWorld(), ya.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), this._frustum.setFromProjectionMatrix(ya, t.coordinateSystem, t.reversedDepth), t.reversedDepth ? n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 1, 0, 0, 0, 0, 1) : n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), n.multiply(ya);
  }
  getViewport(e) {
    return this._viewports[e];
  }
  getFrameExtents() {
    return this._frameExtents;
  }
  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }
  copy(e) {
    return this.camera = e.camera.clone(), this.intensity = e.intensity, this.bias = e.bias, this.radius = e.radius, this.autoUpdate = e.autoUpdate, this.needsUpdate = e.needsUpdate, this.normalBias = e.normalBias, this.blurSamples = e.blurSamples, this.mapSize.copy(e.mapSize), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    const e = {};
    return this.intensity !== 1 && (e.intensity = this.intensity), this.bias !== 0 && (e.bias = this.bias), this.normalBias !== 0 && (e.normalBias = this.normalBias), this.radius !== 1 && (e.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(false).object, delete e.camera.matrix, e;
  }
}
class _f extends el {
  constructor() {
    super(new zt(50, 1, 0.5, 500)), this.isSpotLightShadow = true, this.focus = 1, this.aspect = 1;
  }
  updateMatrices(e) {
    const t = this.camera, n = ss * 2 * e.angle * this.focus, s = this.mapSize.width / this.mapSize.height * this.aspect, r = e.distance || t.far;
    (n !== t.fov || s !== t.aspect || r !== t.far) && (t.fov = n, t.aspect = s, t.far = r, t.updateProjectionMatrix()), super.updateMatrices(e);
  }
  copy(e) {
    return super.copy(e), this.focus = e.focus, this;
  }
}
class Ih extends Vr {
  constructor(e, t, n = 0, s = Math.PI / 3, r = 0, a = 2) {
    super(e, t), this.isSpotLight = true, this.type = "SpotLight", this.position.copy(ot.DEFAULT_UP), this.updateMatrix(), this.target = new ot(), this.distance = n, this.angle = s, this.penumbra = r, this.decay = a, this.map = null, this.shadow = new _f();
  }
  get power() {
    return this.intensity * Math.PI;
  }
  set power(e) {
    this.intensity = e / Math.PI;
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(e, t) {
    return super.copy(e, t), this.distance = e.distance, this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay, this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
  }
}
const oc = new Be(), bs = new L(), Ma = new L();
class xf extends el {
  constructor() {
    super(new zt(90, 1, 0.5, 500)), this.isPointLightShadow = true, this._frameExtents = new Ee(4, 2), this._viewportCount = 6, this._viewports = [new Ke(2, 1, 1, 1), new Ke(0, 1, 1, 1), new Ke(3, 1, 1, 1), new Ke(1, 1, 1, 1), new Ke(3, 0, 1, 1), new Ke(1, 0, 1, 1)], this._cubeDirections = [new L(1, 0, 0), new L(-1, 0, 0), new L(0, 0, 1), new L(0, 0, -1), new L(0, 1, 0), new L(0, -1, 0)], this._cubeUps = [new L(0, 1, 0), new L(0, 1, 0), new L(0, 1, 0), new L(0, 1, 0), new L(0, 0, 1), new L(0, 0, -1)];
  }
  updateMatrices(e, t = 0) {
    const n = this.camera, s = this.matrix, r = e.distance || n.far;
    r !== n.far && (n.far = r, n.updateProjectionMatrix()), bs.setFromMatrixPosition(e.matrixWorld), n.position.copy(bs), Ma.copy(n.position), Ma.add(this._cubeDirections[t]), n.up.copy(this._cubeUps[t]), n.lookAt(Ma), n.updateMatrixWorld(), s.makeTranslation(-bs.x, -bs.y, -bs.z), oc.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse), this._frustum.setFromProjectionMatrix(oc, n.coordinateSystem, n.reversedDepth);
  }
}
class tl extends Vr {
  constructor(e, t, n = 0, s = 2) {
    super(e, t), this.isPointLight = true, this.type = "PointLight", this.distance = n, this.decay = s, this.shadow = new xf();
  }
  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(e) {
    this.intensity = e / (4 * Math.PI);
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(e, t) {
    return super.copy(e, t), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this;
  }
}
class Gr extends vh {
  constructor(e = -1, t = 1, n = 1, s = -1, r = 0.1, a = 2e3) {
    super(), this.isOrthographicCamera = true, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = t, this.top = n, this.bottom = s, this.near = r, this.far = a, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this;
  }
  setViewOffset(e, t, n, s, r, a) {
    this.view === null && (this.view = { enabled: true, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }), this.view.enabled = true, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = s, this.view.width = r, this.view.height = a, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const e = (this.right - this.left) / (2 * this.zoom), t = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, s = (this.top + this.bottom) / 2;
    let r = n - e, a = n + e, o = s + t, l = s - t;
    if (this.view !== null && this.view.enabled) {
      const c = (this.right - this.left) / this.view.fullWidth / this.zoom, u = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      r += c * this.view.offsetX, a = r + c * this.view.width, o -= u * this.view.offsetY, l = o - u * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(r, a, o, l, this.near, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, this.view !== null && (t.object.view = Object.assign({}, this.view)), t;
  }
}
class vf extends el {
  constructor() {
    super(new Gr(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = true;
  }
}
class nl extends Vr {
  constructor(e, t) {
    super(e, t), this.isDirectionalLight = true, this.type = "DirectionalLight", this.position.copy(ot.DEFAULT_UP), this.updateMatrix(), this.target = new ot(), this.shadow = new vf();
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(e) {
    return super.copy(e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
  }
}
class Ls {
  static extractUrlBase(e) {
    const t = e.lastIndexOf("/");
    return t === -1 ? "./" : e.slice(0, t + 1);
  }
  static resolveURL(e, t) {
    return typeof e != "string" || e === "" ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e);
  }
}
const Sa = /* @__PURE__ */ new WeakMap();
class yf extends ms {
  constructor(e) {
    super(e), this.isImageBitmapLoader = true, typeof createImageBitmap > "u" && console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."), typeof fetch > "u" && console.warn("THREE.ImageBitmapLoader: fetch() not supported."), this.options = { premultiplyAlpha: "none" }, this._abortController = new AbortController();
  }
  setOptions(e) {
    return this.options = e, this;
  }
  load(e, t, n, s) {
    e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const r = this, a = Bn.get(`image-bitmap:${e}`);
    if (a !== void 0) {
      if (r.manager.itemStart(e), a.then) {
        a.then((c) => {
          if (Sa.has(a) === true) s && s(Sa.get(a)), r.manager.itemError(e), r.manager.itemEnd(e);
          else return t && t(c), r.manager.itemEnd(e), c;
        });
        return;
      }
      return setTimeout(function() {
        t && t(a), r.manager.itemEnd(e);
      }, 0), a;
    }
    const o = {};
    o.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include", o.headers = this.requestHeader, o.signal = typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal;
    const l = fetch(e, o).then(function(c) {
      return c.blob();
    }).then(function(c) {
      return createImageBitmap(c, Object.assign(r.options, { colorSpaceConversion: "none" }));
    }).then(function(c) {
      return Bn.add(`image-bitmap:${e}`, c), t && t(c), r.manager.itemEnd(e), c;
    }).catch(function(c) {
      s && s(c), Sa.set(l, c), Bn.remove(`image-bitmap:${e}`), r.manager.itemError(e), r.manager.itemEnd(e);
    });
    Bn.add(`image-bitmap:${e}`, l), r.manager.itemStart(e);
  }
  abort() {
    return this._abortController.abort(), this._abortController = new AbortController(), this;
  }
}
class Mf extends zt {
  constructor(e = []) {
    super(), this.isArrayCamera = true, this.isMultiViewCamera = false, this.cameras = e;
  }
}
const il = "\\[\\]\\.:\\/", Sf = new RegExp("[" + il + "]", "g"), sl = "[^" + il + "]", Ef = "[^" + il.replace("\\.", "") + "]", Tf = /((?:WC+[\/:])*)/.source.replace("WC", sl), bf = /(WCOD+)?/.source.replace("WCOD", Ef), Af = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", sl), wf = /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", sl), Rf = new RegExp("^" + Tf + bf + Af + wf + "$"), Cf = ["material", "materials", "bones", "map"];
class Pf {
  constructor(e, t, n) {
    const s = n || Je.parseTrackName(t);
    this._targetGroup = e, this._bindings = e.subscribe_(t, s);
  }
  getValue(e, t) {
    this.bind();
    const n = this._targetGroup.nCachedObjects_, s = this._bindings[n];
    s !== void 0 && s.getValue(e, t);
  }
  setValue(e, t) {
    const n = this._bindings;
    for (let s = this._targetGroup.nCachedObjects_, r = n.length; s !== r; ++s) n[s].setValue(e, t);
  }
  bind() {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].bind();
  }
  unbind() {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].unbind();
  }
}
class Je {
  constructor(e, t, n) {
    this.path = t, this.parsedPath = n || Je.parseTrackName(t), this.node = Je.findNode(e, this.parsedPath.nodeName), this.rootNode = e, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
  }
  static create(e, t, n) {
    return e && e.isAnimationObjectGroup ? new Je.Composite(e, t, n) : new Je(e, t, n);
  }
  static sanitizeNodeName(e) {
    return e.replace(/\s/g, "_").replace(Sf, "");
  }
  static parseTrackName(e) {
    const t = Rf.exec(e);
    if (t === null) throw new Error("PropertyBinding: Cannot parse trackName: " + e);
    const n = { nodeName: t[2], objectName: t[3], objectIndex: t[4], propertyName: t[5], propertyIndex: t[6] }, s = n.nodeName && n.nodeName.lastIndexOf(".");
    if (s !== void 0 && s !== -1) {
      const r = n.nodeName.substring(s + 1);
      Cf.indexOf(r) !== -1 && (n.nodeName = n.nodeName.substring(0, s), n.objectName = r);
    }
    if (n.propertyName === null || n.propertyName.length === 0) throw new Error("PropertyBinding: can not parse propertyName from trackName: " + e);
    return n;
  }
  static findNode(e, t) {
    if (t === void 0 || t === "" || t === "." || t === -1 || t === e.name || t === e.uuid) return e;
    if (e.skeleton) {
      const n = e.skeleton.getBoneByName(t);
      if (n !== void 0) return n;
    }
    if (e.children) {
      const n = function(r) {
        for (let a = 0; a < r.length; a++) {
          const o = r[a];
          if (o.name === t || o.uuid === t) return o;
          const l = n(o.children);
          if (l) return l;
        }
        return null;
      }, s = n(e.children);
      if (s) return s;
    }
    return null;
  }
  _getValue_unavailable() {
  }
  _setValue_unavailable() {
  }
  _getValue_direct(e, t) {
    e[t] = this.targetObject[this.propertyName];
  }
  _getValue_array(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, r = n.length; s !== r; ++s) e[t++] = n[s];
  }
  _getValue_arrayElement(e, t) {
    e[t] = this.resolvedProperty[this.propertyIndex];
  }
  _getValue_toArray(e, t) {
    this.resolvedProperty.toArray(e, t);
  }
  _setValue_direct(e, t) {
    this.targetObject[this.propertyName] = e[t];
  }
  _setValue_direct_setNeedsUpdate(e, t) {
    this.targetObject[this.propertyName] = e[t], this.targetObject.needsUpdate = true;
  }
  _setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
    this.targetObject[this.propertyName] = e[t], this.targetObject.matrixWorldNeedsUpdate = true;
  }
  _setValue_array(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, r = n.length; s !== r; ++s) n[s] = e[t++];
  }
  _setValue_array_setNeedsUpdate(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, r = n.length; s !== r; ++s) n[s] = e[t++];
    this.targetObject.needsUpdate = true;
  }
  _setValue_array_setMatrixWorldNeedsUpdate(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, r = n.length; s !== r; ++s) n[s] = e[t++];
    this.targetObject.matrixWorldNeedsUpdate = true;
  }
  _setValue_arrayElement(e, t) {
    this.resolvedProperty[this.propertyIndex] = e[t];
  }
  _setValue_arrayElement_setNeedsUpdate(e, t) {
    this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.needsUpdate = true;
  }
  _setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
    this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.matrixWorldNeedsUpdate = true;
  }
  _setValue_fromArray(e, t) {
    this.resolvedProperty.fromArray(e, t);
  }
  _setValue_fromArray_setNeedsUpdate(e, t) {
    this.resolvedProperty.fromArray(e, t), this.targetObject.needsUpdate = true;
  }
  _setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
    this.resolvedProperty.fromArray(e, t), this.targetObject.matrixWorldNeedsUpdate = true;
  }
  _getValue_unbound(e, t) {
    this.bind(), this.getValue(e, t);
  }
  _setValue_unbound(e, t) {
    this.bind(), this.setValue(e, t);
  }
  bind() {
    let e = this.node;
    const t = this.parsedPath, n = t.objectName, s = t.propertyName;
    let r = t.propertyIndex;
    if (e || (e = Je.findNode(this.rootNode, t.nodeName), this.node = e), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !e) {
      console.warn("THREE.PropertyBinding: No target node found for track: " + this.path + ".");
      return;
    }
    if (n) {
      let c = t.objectIndex;
      switch (n) {
        case "materials":
          if (!e.material) {
            console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!e.material.materials) {
            console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
            return;
          }
          e = e.material.materials;
          break;
        case "bones":
          if (!e.skeleton) {
            console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
            return;
          }
          e = e.skeleton.bones;
          for (let u = 0; u < e.length; u++) if (e[u].name === c) {
            c = u;
            break;
          }
          break;
        case "map":
          if ("map" in e) {
            e = e.map;
            break;
          }
          if (!e.material) {
            console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!e.material.map) {
            console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
            return;
          }
          e = e.material.map;
          break;
        default:
          if (e[n] === void 0) {
            console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.", this);
            return;
          }
          e = e[n];
      }
      if (c !== void 0) {
        if (e[c] === void 0) {
          console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, e);
          return;
        }
        e = e[c];
      }
    }
    const a = e[s];
    if (a === void 0) {
      const c = t.nodeName;
      console.error("THREE.PropertyBinding: Trying to update property for track: " + c + "." + s + " but it wasn't found.", e);
      return;
    }
    let o = this.Versioning.None;
    this.targetObject = e, e.isMaterial === true ? o = this.Versioning.NeedsUpdate : e.isObject3D === true && (o = this.Versioning.MatrixWorldNeedsUpdate);
    let l = this.BindingType.Direct;
    if (r !== void 0) {
      if (s === "morphTargetInfluences") {
        if (!e.geometry) {
          console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
          return;
        }
        if (!e.geometry.morphAttributes) {
          console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
          return;
        }
        e.morphTargetDictionary[r] !== void 0 && (r = e.morphTargetDictionary[r]);
      }
      l = this.BindingType.ArrayElement, this.resolvedProperty = a, this.propertyIndex = r;
    } else a.fromArray !== void 0 && a.toArray !== void 0 ? (l = this.BindingType.HasFromToArray, this.resolvedProperty = a) : Array.isArray(a) ? (l = this.BindingType.EntireArray, this.resolvedProperty = a) : this.propertyName = s;
    this.getValue = this.GetterByBindingType[l], this.setValue = this.SetterByBindingTypeAndVersioning[l][o];
  }
  unbind() {
    this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
  }
}
Je.Composite = Pf;
Je.prototype.BindingType = { Direct: 0, EntireArray: 1, ArrayElement: 2, HasFromToArray: 3 };
Je.prototype.Versioning = { None: 0, NeedsUpdate: 1, MatrixWorldNeedsUpdate: 2 };
Je.prototype.GetterByBindingType = [Je.prototype._getValue_direct, Je.prototype._getValue_array, Je.prototype._getValue_arrayElement, Je.prototype._getValue_toArray];
Je.prototype.SetterByBindingTypeAndVersioning = [[Je.prototype._setValue_direct, Je.prototype._setValue_direct_setNeedsUpdate, Je.prototype._setValue_direct_setMatrixWorldNeedsUpdate], [Je.prototype._setValue_array, Je.prototype._setValue_array_setNeedsUpdate, Je.prototype._setValue_array_setMatrixWorldNeedsUpdate], [Je.prototype._setValue_arrayElement, Je.prototype._setValue_arrayElement_setNeedsUpdate, Je.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate], [Je.prototype._setValue_fromArray, Je.prototype._setValue_fromArray_setNeedsUpdate, Je.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];
const lc = new Be();
class Lf {
  constructor(e, t, n = 0, s = 1 / 0) {
    this.ray = new us(e, t), this.near = n, this.far = s, this.camera = null, this.layers = new Ko(), this.params = { Mesh: {}, Line: { threshold: 1 }, LOD: {}, Points: { threshold: 1 }, Sprite: {} };
  }
  set(e, t) {
    this.ray.set(e, t);
  }
  setFromCamera(e, t) {
    t.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(e.x, e.y, 0.5).unproject(t).sub(this.ray.origin).normalize(), this.camera = t) : t.isOrthographicCamera ? (this.ray.origin.set(e.x, e.y, (t.near + t.far) / (t.near - t.far)).unproject(t), this.ray.direction.set(0, 0, -1).transformDirection(t.matrixWorld), this.camera = t) : console.error("THREE.Raycaster: Unsupported camera type: " + t.type);
  }
  setFromXRController(e) {
    return lc.identity().extractRotation(e.matrixWorld), this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(lc), this;
  }
  intersectObject(e, t = true, n = []) {
    return Ao(e, this, n, t), n.sort(cc), n;
  }
  intersectObjects(e, t = true, n = []) {
    for (let s = 0, r = e.length; s < r; s++) Ao(e[s], this, n, t);
    return n.sort(cc), n;
  }
}
function cc(i, e) {
  return i.distance - e.distance;
}
function Ao(i, e, t, n) {
  let s = true;
  if (i.layers.test(e.layers) && i.raycast(e, t) === false && (s = false), s === true && n === true) {
    const r = i.children;
    for (let a = 0, o = r.length; a < o; a++) Ao(r[a], e, t, true);
  }
}
class hc {
  constructor(e = 1, t = 0, n = 0) {
    this.radius = e, this.phi = t, this.theta = n;
  }
  set(e, t, n) {
    return this.radius = e, this.phi = t, this.theta = n, this;
  }
  copy(e) {
    return this.radius = e.radius, this.phi = e.phi, this.theta = e.theta, this;
  }
  makeSafe() {
    return this.phi = ze(this.phi, 1e-6, Math.PI - 1e-6), this;
  }
  setFromVector3(e) {
    return this.setFromCartesianCoords(e.x, e.y, e.z);
  }
  setFromCartesianCoords(e, t, n) {
    return this.radius = Math.sqrt(e * e + t * t + n * n), this.radius === 0 ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(e, n), this.phi = Math.acos(ze(t / this.radius, -1, 1))), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const uc = new Ee();
class Df {
  constructor(e = new Ee(1 / 0, 1 / 0), t = new Ee(-1 / 0, -1 / 0)) {
    this.isBox2 = true, this.min = e, this.max = t;
  }
  set(e, t) {
    return this.min.copy(e), this.max.copy(t), this;
  }
  setFromPoints(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
    return this;
  }
  setFromCenterAndSize(e, t) {
    const n = uc.copy(t).multiplyScalar(0.5);
    return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = 1 / 0, this.max.x = this.max.y = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y;
  }
  getCenter(e) {
    return this.isEmpty() ? e.set(0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(e) {
    return this.isEmpty() ? e.set(0, 0) : e.subVectors(this.max, this.min);
  }
  expandByPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }
  expandByVector(e) {
    return this.min.sub(e), this.max.add(e), this;
  }
  expandByScalar(e) {
    return this.min.addScalar(-e), this.max.addScalar(e), this;
  }
  containsPoint(e) {
    return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y;
  }
  containsBox(e) {
    return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y;
  }
  getParameter(e, t) {
    return t.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y));
  }
  intersectsBox(e) {
    return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y;
  }
  clampPoint(e, t) {
    return t.copy(e).clamp(this.min, this.max);
  }
  distanceToPoint(e) {
    return this.clampPoint(e, uc).distanceTo(e);
  }
  intersect(e) {
    return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }
  translate(e) {
    return this.min.add(e), this.max.add(e), this;
  }
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
}
class If extends Ci {
  constructor(e, t = null) {
    super(), this.object = e, this.domElement = t, this.enabled = true, this.state = -1, this.keys = {}, this.mouseButtons = { LEFT: null, MIDDLE: null, RIGHT: null }, this.touches = { ONE: null, TWO: null };
  }
  connect(e) {
    if (e === void 0) {
      console.warn("THREE.Controls: connect() now requires an element.");
      return;
    }
    this.domElement !== null && this.disconnect(), this.domElement = e;
  }
  disconnect() {
  }
  dispose() {
  }
  update() {
  }
}
function dc(i, e, t, n) {
  const s = Uf(n);
  switch (t) {
    case oh:
      return i * e;
    case Vo:
      return i * e / s.components * s.byteLength;
    case Go:
      return i * e / s.components * s.byteLength;
    case ch:
      return i * e * 2 / s.components * s.byteLength;
    case Wo:
      return i * e * 2 / s.components * s.byteLength;
    case lh:
      return i * e * 3 / s.components * s.byteLength;
    case Yt:
      return i * e * 4 / s.components * s.byteLength;
    case Xo:
      return i * e * 4 / s.components * s.byteLength;
    case Er:
    case Tr:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case br:
    case Ar:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case ja:
    case Za:
      return Math.max(i, 16) * Math.max(e, 8) / 4;
    case Ya:
    case Ka:
      return Math.max(i, 8) * Math.max(e, 8) / 2;
    case $a:
    case Ja:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case Qa:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case eo:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case to:
      return Math.floor((i + 4) / 5) * Math.floor((e + 3) / 4) * 16;
    case no:
      return Math.floor((i + 4) / 5) * Math.floor((e + 4) / 5) * 16;
    case io:
      return Math.floor((i + 5) / 6) * Math.floor((e + 4) / 5) * 16;
    case so:
      return Math.floor((i + 5) / 6) * Math.floor((e + 5) / 6) * 16;
    case ro:
      return Math.floor((i + 7) / 8) * Math.floor((e + 4) / 5) * 16;
    case ao:
      return Math.floor((i + 7) / 8) * Math.floor((e + 5) / 6) * 16;
    case oo:
      return Math.floor((i + 7) / 8) * Math.floor((e + 7) / 8) * 16;
    case lo:
      return Math.floor((i + 9) / 10) * Math.floor((e + 4) / 5) * 16;
    case co:
      return Math.floor((i + 9) / 10) * Math.floor((e + 5) / 6) * 16;
    case ho:
      return Math.floor((i + 9) / 10) * Math.floor((e + 7) / 8) * 16;
    case uo:
      return Math.floor((i + 9) / 10) * Math.floor((e + 9) / 10) * 16;
    case fo:
      return Math.floor((i + 11) / 12) * Math.floor((e + 9) / 10) * 16;
    case po:
      return Math.floor((i + 11) / 12) * Math.floor((e + 11) / 12) * 16;
    case mo:
    case go:
    case _o:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 16;
    case xo:
    case vo:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 8;
    case yo:
    case Mo:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 16;
  }
  throw new Error(`Unable to determine texture byte length for ${t} format.`);
}
function Uf(i) {
  switch (i) {
    case En:
    case ih:
      return { byteLength: 1, components: 1 };
    case Is:
    case sh:
    case hs:
      return { byteLength: 2, components: 1 };
    case zo:
    case Ho:
      return { byteLength: 2, components: 4 };
    case Ti:
    case ko:
    case hn:
      return { byteLength: 4, components: 1 };
    case rh:
    case ah:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${i}.`);
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: { revision: Oo } }));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = Oo);
function Uh() {
  let i = null, e = false, t = null, n = null;
  function s(r, a) {
    t(r, a), n = i.requestAnimationFrame(s);
  }
  return { start: function() {
    e !== true && t !== null && (n = i.requestAnimationFrame(s), e = true);
  }, stop: function() {
    i.cancelAnimationFrame(n), e = false;
  }, setAnimationLoop: function(r) {
    t = r;
  }, setContext: function(r) {
    i = r;
  } };
}
function Nf(i) {
  const e = /* @__PURE__ */ new WeakMap();
  function t(o, l) {
    const c = o.array, u = o.usage, h = c.byteLength, d = i.createBuffer();
    i.bindBuffer(l, d), i.bufferData(l, c, u), o.onUploadCallback();
    let p;
    if (c instanceof Float32Array) p = i.FLOAT;
    else if (typeof Float16Array < "u" && c instanceof Float16Array) p = i.HALF_FLOAT;
    else if (c instanceof Uint16Array) o.isFloat16BufferAttribute ? p = i.HALF_FLOAT : p = i.UNSIGNED_SHORT;
    else if (c instanceof Int16Array) p = i.SHORT;
    else if (c instanceof Uint32Array) p = i.UNSIGNED_INT;
    else if (c instanceof Int32Array) p = i.INT;
    else if (c instanceof Int8Array) p = i.BYTE;
    else if (c instanceof Uint8Array) p = i.UNSIGNED_BYTE;
    else if (c instanceof Uint8ClampedArray) p = i.UNSIGNED_BYTE;
    else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + c);
    return { buffer: d, type: p, bytesPerElement: c.BYTES_PER_ELEMENT, version: o.version, size: h };
  }
  function n(o, l, c) {
    const u = l.array, h = l.updateRanges;
    if (i.bindBuffer(c, o), h.length === 0) i.bufferSubData(c, 0, u);
    else {
      h.sort((p, g) => p.start - g.start);
      let d = 0;
      for (let p = 1; p < h.length; p++) {
        const g = h[d], _ = h[p];
        _.start <= g.start + g.count + 1 ? g.count = Math.max(g.count, _.start + _.count - g.start) : (++d, h[d] = _);
      }
      h.length = d + 1;
      for (let p = 0, g = h.length; p < g; p++) {
        const _ = h[p];
        i.bufferSubData(c, _.start * u.BYTES_PER_ELEMENT, u, _.start, _.count);
      }
      l.clearUpdateRanges();
    }
    l.onUploadCallback();
  }
  function s(o) {
    return o.isInterleavedBufferAttribute && (o = o.data), e.get(o);
  }
  function r(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    const l = e.get(o);
    l && (i.deleteBuffer(l.buffer), e.delete(o));
  }
  function a(o, l) {
    if (o.isInterleavedBufferAttribute && (o = o.data), o.isGLBufferAttribute) {
      const u = e.get(o);
      (!u || u.version < o.version) && e.set(o, { buffer: o.buffer, type: o.type, bytesPerElement: o.elementSize, version: o.version });
      return;
    }
    const c = e.get(o);
    if (c === void 0) e.set(o, t(o, l));
    else if (c.version < o.version) {
      if (c.size !== o.array.byteLength) throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      n(c.buffer, o, l), c.version = o.version;
    }
  }
  return { get: s, remove: r, update: a };
}
var Ff = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, Of = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, Bf = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, kf = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, zf = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, Hf = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, Vf = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, Gf = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, Wf = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`, Xf = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, qf = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, Yf = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, jf = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, Kf = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, Zf = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, $f = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, Jf = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, Qf = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, ep = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, tp = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, np = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, ip = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`, sp = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`, rp = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, ap = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, op = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, lp = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, cp = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, hp = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, up = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, dp = "gl_FragColor = linearToOutputTexel( gl_FragColor );", fp = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, pp = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, mp = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, gp = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, _p = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, xp = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, vp = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, yp = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, Mp = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, Sp = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, Ep = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, Tp = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, bp = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, Ap = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, wp = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, Rp = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, Cp = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, Pp = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, Lp = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, Dp = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, Ip = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, Up = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, Np = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, Fp = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, Op = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, Bp = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, kp = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, zp = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Hp = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, Vp = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, Gp = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, Wp = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, Xp = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, qp = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, Yp = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, jp = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, Kp = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, Zp = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, $p = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`, Jp = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, Qp = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, em = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, tm = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, nm = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, im = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, sm = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, rm = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, am = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, om = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, lm = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, cm = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, hm = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, um = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, dm = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, fm = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, pm = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, mm = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, gm = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, _m = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`, xm = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, vm = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, ym = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, Mm = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, Sm = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, Em = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, Tm = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, bm = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, Am = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, wm = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, Rm = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, Cm = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, Pm = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, Lm = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Dm = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Im = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, Um = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const Nm = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, Fm = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Om = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, Bm = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, km = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, zm = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Hm = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, Vm = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`, Gm = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, Wm = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, Xm = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, qm = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Ym = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, jm = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Km = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, Zm = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, $m = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Jm = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Qm = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, eg = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, tg = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, ng = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, ig = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, sg = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, rg = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, ag = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, og = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, lg = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, cg = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, hg = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, ug = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, dg = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, fg = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, pg = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Ue = { alphahash_fragment: Ff, alphahash_pars_fragment: Of, alphamap_fragment: Bf, alphamap_pars_fragment: kf, alphatest_fragment: zf, alphatest_pars_fragment: Hf, aomap_fragment: Vf, aomap_pars_fragment: Gf, batching_pars_vertex: Wf, batching_vertex: Xf, begin_vertex: qf, beginnormal_vertex: Yf, bsdfs: jf, iridescence_fragment: Kf, bumpmap_pars_fragment: Zf, clipping_planes_fragment: $f, clipping_planes_pars_fragment: Jf, clipping_planes_pars_vertex: Qf, clipping_planes_vertex: ep, color_fragment: tp, color_pars_fragment: np, color_pars_vertex: ip, color_vertex: sp, common: rp, cube_uv_reflection_fragment: ap, defaultnormal_vertex: op, displacementmap_pars_vertex: lp, displacementmap_vertex: cp, emissivemap_fragment: hp, emissivemap_pars_fragment: up, colorspace_fragment: dp, colorspace_pars_fragment: fp, envmap_fragment: pp, envmap_common_pars_fragment: mp, envmap_pars_fragment: gp, envmap_pars_vertex: _p, envmap_physical_pars_fragment: Rp, envmap_vertex: xp, fog_vertex: vp, fog_pars_vertex: yp, fog_fragment: Mp, fog_pars_fragment: Sp, gradientmap_pars_fragment: Ep, lightmap_pars_fragment: Tp, lights_lambert_fragment: bp, lights_lambert_pars_fragment: Ap, lights_pars_begin: wp, lights_toon_fragment: Cp, lights_toon_pars_fragment: Pp, lights_phong_fragment: Lp, lights_phong_pars_fragment: Dp, lights_physical_fragment: Ip, lights_physical_pars_fragment: Up, lights_fragment_begin: Np, lights_fragment_maps: Fp, lights_fragment_end: Op, logdepthbuf_fragment: Bp, logdepthbuf_pars_fragment: kp, logdepthbuf_pars_vertex: zp, logdepthbuf_vertex: Hp, map_fragment: Vp, map_pars_fragment: Gp, map_particle_fragment: Wp, map_particle_pars_fragment: Xp, metalnessmap_fragment: qp, metalnessmap_pars_fragment: Yp, morphinstance_vertex: jp, morphcolor_vertex: Kp, morphnormal_vertex: Zp, morphtarget_pars_vertex: $p, morphtarget_vertex: Jp, normal_fragment_begin: Qp, normal_fragment_maps: em, normal_pars_fragment: tm, normal_pars_vertex: nm, normal_vertex: im, normalmap_pars_fragment: sm, clearcoat_normal_fragment_begin: rm, clearcoat_normal_fragment_maps: am, clearcoat_pars_fragment: om, iridescence_pars_fragment: lm, opaque_fragment: cm, packing: hm, premultiplied_alpha_fragment: um, project_vertex: dm, dithering_fragment: fm, dithering_pars_fragment: pm, roughnessmap_fragment: mm, roughnessmap_pars_fragment: gm, shadowmap_pars_fragment: _m, shadowmap_pars_vertex: xm, shadowmap_vertex: vm, shadowmask_pars_fragment: ym, skinbase_vertex: Mm, skinning_pars_vertex: Sm, skinning_vertex: Em, skinnormal_vertex: Tm, specularmap_fragment: bm, specularmap_pars_fragment: Am, tonemapping_fragment: wm, tonemapping_pars_fragment: Rm, transmission_fragment: Cm, transmission_pars_fragment: Pm, uv_pars_fragment: Lm, uv_pars_vertex: Dm, uv_vertex: Im, worldpos_vertex: Um, background_vert: Nm, background_frag: Fm, backgroundCube_vert: Om, backgroundCube_frag: Bm, cube_vert: km, cube_frag: zm, depth_vert: Hm, depth_frag: Vm, distanceRGBA_vert: Gm, distanceRGBA_frag: Wm, equirect_vert: Xm, equirect_frag: qm, linedashed_vert: Ym, linedashed_frag: jm, meshbasic_vert: Km, meshbasic_frag: Zm, meshlambert_vert: $m, meshlambert_frag: Jm, meshmatcap_vert: Qm, meshmatcap_frag: eg, meshnormal_vert: tg, meshnormal_frag: ng, meshphong_vert: ig, meshphong_frag: sg, meshphysical_vert: rg, meshphysical_frag: ag, meshtoon_vert: og, meshtoon_frag: lg, points_vert: cg, points_frag: hg, shadow_vert: ug, shadow_frag: dg, sprite_vert: fg, sprite_frag: pg }, re = { common: { diffuse: { value: new we(16777215) }, opacity: { value: 1 }, map: { value: null }, mapTransform: { value: new Oe() }, alphaMap: { value: null }, alphaMapTransform: { value: new Oe() }, alphaTest: { value: 0 } }, specularmap: { specularMap: { value: null }, specularMapTransform: { value: new Oe() } }, envmap: { envMap: { value: null }, envMapRotation: { value: new Oe() }, flipEnvMap: { value: -1 }, reflectivity: { value: 1 }, ior: { value: 1.5 }, refractionRatio: { value: 0.98 } }, aomap: { aoMap: { value: null }, aoMapIntensity: { value: 1 }, aoMapTransform: { value: new Oe() } }, lightmap: { lightMap: { value: null }, lightMapIntensity: { value: 1 }, lightMapTransform: { value: new Oe() } }, bumpmap: { bumpMap: { value: null }, bumpMapTransform: { value: new Oe() }, bumpScale: { value: 1 } }, normalmap: { normalMap: { value: null }, normalMapTransform: { value: new Oe() }, normalScale: { value: new Ee(1, 1) } }, displacementmap: { displacementMap: { value: null }, displacementMapTransform: { value: new Oe() }, displacementScale: { value: 1 }, displacementBias: { value: 0 } }, emissivemap: { emissiveMap: { value: null }, emissiveMapTransform: { value: new Oe() } }, metalnessmap: { metalnessMap: { value: null }, metalnessMapTransform: { value: new Oe() } }, roughnessmap: { roughnessMap: { value: null }, roughnessMapTransform: { value: new Oe() } }, gradientmap: { gradientMap: { value: null } }, fog: { fogDensity: { value: 25e-5 }, fogNear: { value: 1 }, fogFar: { value: 2e3 }, fogColor: { value: new we(16777215) } }, lights: { ambientLightColor: { value: [] }, lightProbe: { value: [] }, directionalLights: { value: [], properties: { direction: {}, color: {} } }, directionalLightShadows: { value: [], properties: { shadowIntensity: 1, shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {} } }, directionalShadowMap: { value: [] }, directionalShadowMatrix: { value: [] }, spotLights: { value: [], properties: { color: {}, position: {}, direction: {}, distance: {}, coneCos: {}, penumbraCos: {}, decay: {} } }, spotLightShadows: { value: [], properties: { shadowIntensity: 1, shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {} } }, spotLightMap: { value: [] }, spotShadowMap: { value: [] }, spotLightMatrix: { value: [] }, pointLights: { value: [], properties: { color: {}, position: {}, decay: {}, distance: {} } }, pointLightShadows: { value: [], properties: { shadowIntensity: 1, shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {}, shadowCameraNear: {}, shadowCameraFar: {} } }, pointShadowMap: { value: [] }, pointShadowMatrix: { value: [] }, hemisphereLights: { value: [], properties: { direction: {}, skyColor: {}, groundColor: {} } }, rectAreaLights: { value: [], properties: { color: {}, position: {}, width: {}, height: {} } }, ltc_1: { value: null }, ltc_2: { value: null } }, points: { diffuse: { value: new we(16777215) }, opacity: { value: 1 }, size: { value: 1 }, scale: { value: 1 }, map: { value: null }, alphaMap: { value: null }, alphaMapTransform: { value: new Oe() }, alphaTest: { value: 0 }, uvTransform: { value: new Oe() } }, sprite: { diffuse: { value: new we(16777215) }, opacity: { value: 1 }, center: { value: new Ee(0.5, 0.5) }, rotation: { value: 0 }, map: { value: null }, mapTransform: { value: new Oe() }, alphaMap: { value: null }, alphaMapTransform: { value: new Oe() }, alphaTest: { value: 0 } } }, yn = { basic: { uniforms: Dt([re.common, re.specularmap, re.envmap, re.aomap, re.lightmap, re.fog]), vertexShader: Ue.meshbasic_vert, fragmentShader: Ue.meshbasic_frag }, lambert: { uniforms: Dt([re.common, re.specularmap, re.envmap, re.aomap, re.lightmap, re.emissivemap, re.bumpmap, re.normalmap, re.displacementmap, re.fog, re.lights, { emissive: { value: new we(0) } }]), vertexShader: Ue.meshlambert_vert, fragmentShader: Ue.meshlambert_frag }, phong: { uniforms: Dt([re.common, re.specularmap, re.envmap, re.aomap, re.lightmap, re.emissivemap, re.bumpmap, re.normalmap, re.displacementmap, re.fog, re.lights, { emissive: { value: new we(0) }, specular: { value: new we(1118481) }, shininess: { value: 30 } }]), vertexShader: Ue.meshphong_vert, fragmentShader: Ue.meshphong_frag }, standard: { uniforms: Dt([re.common, re.envmap, re.aomap, re.lightmap, re.emissivemap, re.bumpmap, re.normalmap, re.displacementmap, re.roughnessmap, re.metalnessmap, re.fog, re.lights, { emissive: { value: new we(0) }, roughness: { value: 1 }, metalness: { value: 0 }, envMapIntensity: { value: 1 } }]), vertexShader: Ue.meshphysical_vert, fragmentShader: Ue.meshphysical_frag }, toon: { uniforms: Dt([re.common, re.aomap, re.lightmap, re.emissivemap, re.bumpmap, re.normalmap, re.displacementmap, re.gradientmap, re.fog, re.lights, { emissive: { value: new we(0) } }]), vertexShader: Ue.meshtoon_vert, fragmentShader: Ue.meshtoon_frag }, matcap: { uniforms: Dt([re.common, re.bumpmap, re.normalmap, re.displacementmap, re.fog, { matcap: { value: null } }]), vertexShader: Ue.meshmatcap_vert, fragmentShader: Ue.meshmatcap_frag }, points: { uniforms: Dt([re.points, re.fog]), vertexShader: Ue.points_vert, fragmentShader: Ue.points_frag }, dashed: { uniforms: Dt([re.common, re.fog, { scale: { value: 1 }, dashSize: { value: 1 }, totalSize: { value: 2 } }]), vertexShader: Ue.linedashed_vert, fragmentShader: Ue.linedashed_frag }, depth: { uniforms: Dt([re.common, re.displacementmap]), vertexShader: Ue.depth_vert, fragmentShader: Ue.depth_frag }, normal: { uniforms: Dt([re.common, re.bumpmap, re.normalmap, re.displacementmap, { opacity: { value: 1 } }]), vertexShader: Ue.meshnormal_vert, fragmentShader: Ue.meshnormal_frag }, sprite: { uniforms: Dt([re.sprite, re.fog]), vertexShader: Ue.sprite_vert, fragmentShader: Ue.sprite_frag }, background: { uniforms: { uvTransform: { value: new Oe() }, t2D: { value: null }, backgroundIntensity: { value: 1 } }, vertexShader: Ue.background_vert, fragmentShader: Ue.background_frag }, backgroundCube: { uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 }, backgroundBlurriness: { value: 0 }, backgroundIntensity: { value: 1 }, backgroundRotation: { value: new Oe() } }, vertexShader: Ue.backgroundCube_vert, fragmentShader: Ue.backgroundCube_frag }, cube: { uniforms: { tCube: { value: null }, tFlip: { value: -1 }, opacity: { value: 1 } }, vertexShader: Ue.cube_vert, fragmentShader: Ue.cube_frag }, equirect: { uniforms: { tEquirect: { value: null } }, vertexShader: Ue.equirect_vert, fragmentShader: Ue.equirect_frag }, distanceRGBA: { uniforms: Dt([re.common, re.displacementmap, { referencePosition: { value: new L() }, nearDistance: { value: 1 }, farDistance: { value: 1e3 } }]), vertexShader: Ue.distanceRGBA_vert, fragmentShader: Ue.distanceRGBA_frag }, shadow: { uniforms: Dt([re.lights, re.fog, { color: { value: new we(0) }, opacity: { value: 1 } }]), vertexShader: Ue.shadow_vert, fragmentShader: Ue.shadow_frag } };
yn.physical = { uniforms: Dt([yn.standard.uniforms, { clearcoat: { value: 0 }, clearcoatMap: { value: null }, clearcoatMapTransform: { value: new Oe() }, clearcoatNormalMap: { value: null }, clearcoatNormalMapTransform: { value: new Oe() }, clearcoatNormalScale: { value: new Ee(1, 1) }, clearcoatRoughness: { value: 0 }, clearcoatRoughnessMap: { value: null }, clearcoatRoughnessMapTransform: { value: new Oe() }, dispersion: { value: 0 }, iridescence: { value: 0 }, iridescenceMap: { value: null }, iridescenceMapTransform: { value: new Oe() }, iridescenceIOR: { value: 1.3 }, iridescenceThicknessMinimum: { value: 100 }, iridescenceThicknessMaximum: { value: 400 }, iridescenceThicknessMap: { value: null }, iridescenceThicknessMapTransform: { value: new Oe() }, sheen: { value: 0 }, sheenColor: { value: new we(0) }, sheenColorMap: { value: null }, sheenColorMapTransform: { value: new Oe() }, sheenRoughness: { value: 1 }, sheenRoughnessMap: { value: null }, sheenRoughnessMapTransform: { value: new Oe() }, transmission: { value: 0 }, transmissionMap: { value: null }, transmissionMapTransform: { value: new Oe() }, transmissionSamplerSize: { value: new Ee() }, transmissionSamplerMap: { value: null }, thickness: { value: 0 }, thicknessMap: { value: null }, thicknessMapTransform: { value: new Oe() }, attenuationDistance: { value: 0 }, attenuationColor: { value: new we(0) }, specularColor: { value: new we(1, 1, 1) }, specularColorMap: { value: null }, specularColorMapTransform: { value: new Oe() }, specularIntensity: { value: 1 }, specularIntensityMap: { value: null }, specularIntensityMapTransform: { value: new Oe() }, anisotropyVector: { value: new Ee() }, anisotropyMap: { value: null }, anisotropyMapTransform: { value: new Oe() } }]), vertexShader: Ue.meshphysical_vert, fragmentShader: Ue.meshphysical_frag };
const gr = { r: 0, b: 0, g: 0 }, pi = new fn(), mg = new Be();
function gg(i, e, t, n, s, r, a) {
  const o = new we(0);
  let l = r === true ? 0 : 1, c, u, h = null, d = 0, p = null;
  function g(E) {
    let y = E.isScene === true ? E.background : null;
    return y && y.isTexture && (y = (E.backgroundBlurriness > 0 ? t : e).get(y)), y;
  }
  function _(E) {
    let y = false;
    const w = g(E);
    w === null ? f(o, l) : w && w.isColor && (f(w, 1), y = true);
    const C = i.xr.getEnvironmentBlendMode();
    C === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : C === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (i.autoClear || y) && (n.buffers.depth.setTest(true), n.buffers.depth.setMask(true), n.buffers.color.setMask(true), i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil));
  }
  function m(E, y) {
    const w = g(y);
    w && (w.isCubeTexture || w.mapping === zr) ? (u === void 0 && (u = new _t(new ds(1, 1, 1), new ai({ name: "BackgroundCubeMaterial", uniforms: rs(yn.backgroundCube.uniforms), vertexShader: yn.backgroundCube.vertexShader, fragmentShader: yn.backgroundCube.fragmentShader, side: Ut, depthTest: false, depthWrite: false, fog: false, allowOverride: false })), u.geometry.deleteAttribute("normal"), u.geometry.deleteAttribute("uv"), u.onBeforeRender = function(C, R, N) {
      this.matrixWorld.copyPosition(N.matrixWorld);
    }, Object.defineProperty(u.material, "envMap", { get: function() {
      return this.uniforms.envMap.value;
    } }), s.update(u)), pi.copy(y.backgroundRotation), pi.x *= -1, pi.y *= -1, pi.z *= -1, w.isCubeTexture && w.isRenderTargetTexture === false && (pi.y *= -1, pi.z *= -1), u.material.uniforms.envMap.value = w, u.material.uniforms.flipEnvMap.value = w.isCubeTexture && w.isRenderTargetTexture === false ? -1 : 1, u.material.uniforms.backgroundBlurriness.value = y.backgroundBlurriness, u.material.uniforms.backgroundIntensity.value = y.backgroundIntensity, u.material.uniforms.backgroundRotation.value.setFromMatrix4(mg.makeRotationFromEuler(pi)), u.material.toneMapped = qe.getTransfer(w.colorSpace) !== et, (h !== w || d !== w.version || p !== i.toneMapping) && (u.material.needsUpdate = true, h = w, d = w.version, p = i.toneMapping), u.layers.enableAll(), E.unshift(u, u.geometry, u.material, 0, 0, null)) : w && w.isTexture && (c === void 0 && (c = new _t(new Hr(2, 2), new ai({ name: "BackgroundMaterial", uniforms: rs(yn.background.uniforms), vertexShader: yn.background.vertexShader, fragmentShader: yn.background.fragmentShader, side: Vn, depthTest: false, depthWrite: false, fog: false, allowOverride: false })), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", { get: function() {
      return this.uniforms.t2D.value;
    } }), s.update(c)), c.material.uniforms.t2D.value = w, c.material.uniforms.backgroundIntensity.value = y.backgroundIntensity, c.material.toneMapped = qe.getTransfer(w.colorSpace) !== et, w.matrixAutoUpdate === true && w.updateMatrix(), c.material.uniforms.uvTransform.value.copy(w.matrix), (h !== w || d !== w.version || p !== i.toneMapping) && (c.material.needsUpdate = true, h = w, d = w.version, p = i.toneMapping), c.layers.enableAll(), E.unshift(c, c.geometry, c.material, 0, 0, null));
  }
  function f(E, y) {
    E.getRGB(gr, xh(i)), n.buffers.color.setClear(gr.r, gr.g, gr.b, y, a);
  }
  function b() {
    u !== void 0 && (u.geometry.dispose(), u.material.dispose(), u = void 0), c !== void 0 && (c.geometry.dispose(), c.material.dispose(), c = void 0);
  }
  return { getClearColor: function() {
    return o;
  }, setClearColor: function(E, y = 1) {
    o.set(E), l = y, f(o, l);
  }, getClearAlpha: function() {
    return l;
  }, setClearAlpha: function(E) {
    l = E, f(o, l);
  }, render: _, addToRenderList: m, dispose: b };
}
function _g(i, e) {
  const t = i.getParameter(i.MAX_VERTEX_ATTRIBS), n = {}, s = d(null);
  let r = s, a = false;
  function o(M, P, k, V, j) {
    let q = false;
    const W = h(V, k, P);
    r !== W && (r = W, c(r.object)), q = p(M, V, k, j), q && g(M, V, k, j), j !== null && e.update(j, i.ELEMENT_ARRAY_BUFFER), (q || a) && (a = false, y(M, P, k, V), j !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, e.get(j).buffer));
  }
  function l() {
    return i.createVertexArray();
  }
  function c(M) {
    return i.bindVertexArray(M);
  }
  function u(M) {
    return i.deleteVertexArray(M);
  }
  function h(M, P, k) {
    const V = k.wireframe === true;
    let j = n[M.id];
    j === void 0 && (j = {}, n[M.id] = j);
    let q = j[P.id];
    q === void 0 && (q = {}, j[P.id] = q);
    let W = q[V];
    return W === void 0 && (W = d(l()), q[V] = W), W;
  }
  function d(M) {
    const P = [], k = [], V = [];
    for (let j = 0; j < t; j++) P[j] = 0, k[j] = 0, V[j] = 0;
    return { geometry: null, program: null, wireframe: false, newAttributes: P, enabledAttributes: k, attributeDivisors: V, object: M, attributes: {}, index: null };
  }
  function p(M, P, k, V) {
    const j = r.attributes, q = P.attributes;
    let W = 0;
    const K = k.getAttributes();
    for (const z in K) if (K[z].location >= 0) {
      const ce = j[z];
      let Me = q[z];
      if (Me === void 0 && (z === "instanceMatrix" && M.instanceMatrix && (Me = M.instanceMatrix), z === "instanceColor" && M.instanceColor && (Me = M.instanceColor)), ce === void 0 || ce.attribute !== Me || Me && ce.data !== Me.data) return true;
      W++;
    }
    return r.attributesNum !== W || r.index !== V;
  }
  function g(M, P, k, V) {
    const j = {}, q = P.attributes;
    let W = 0;
    const K = k.getAttributes();
    for (const z in K) if (K[z].location >= 0) {
      let ce = q[z];
      ce === void 0 && (z === "instanceMatrix" && M.instanceMatrix && (ce = M.instanceMatrix), z === "instanceColor" && M.instanceColor && (ce = M.instanceColor));
      const Me = {};
      Me.attribute = ce, ce && ce.data && (Me.data = ce.data), j[z] = Me, W++;
    }
    r.attributes = j, r.attributesNum = W, r.index = V;
  }
  function _() {
    const M = r.newAttributes;
    for (let P = 0, k = M.length; P < k; P++) M[P] = 0;
  }
  function m(M) {
    f(M, 0);
  }
  function f(M, P) {
    const k = r.newAttributes, V = r.enabledAttributes, j = r.attributeDivisors;
    k[M] = 1, V[M] === 0 && (i.enableVertexAttribArray(M), V[M] = 1), j[M] !== P && (i.vertexAttribDivisor(M, P), j[M] = P);
  }
  function b() {
    const M = r.newAttributes, P = r.enabledAttributes;
    for (let k = 0, V = P.length; k < V; k++) P[k] !== M[k] && (i.disableVertexAttribArray(k), P[k] = 0);
  }
  function E(M, P, k, V, j, q, W) {
    W === true ? i.vertexAttribIPointer(M, P, k, j, q) : i.vertexAttribPointer(M, P, k, V, j, q);
  }
  function y(M, P, k, V) {
    _();
    const j = V.attributes, q = k.getAttributes(), W = P.defaultAttributeValues;
    for (const K in q) {
      const z = q[K];
      if (z.location >= 0) {
        let ne = j[K];
        if (ne === void 0 && (K === "instanceMatrix" && M.instanceMatrix && (ne = M.instanceMatrix), K === "instanceColor" && M.instanceColor && (ne = M.instanceColor)), ne !== void 0) {
          const ce = ne.normalized, Me = ne.itemSize, Ne = e.get(ne);
          if (Ne === void 0) continue;
          const Ye = Ne.buffer, nt = Ne.type, We = Ne.bytesPerElement, X = nt === i.INT || nt === i.UNSIGNED_INT || ne.gpuType === ko;
          if (ne.isInterleavedBufferAttribute) {
            const Z = ne.data, ue = Z.stride, Re = ne.offset;
            if (Z.isInstancedInterleavedBuffer) {
              for (let xe = 0; xe < z.locationSize; xe++) f(z.location + xe, Z.meshPerAttribute);
              M.isInstancedMesh !== true && V._maxInstanceCount === void 0 && (V._maxInstanceCount = Z.meshPerAttribute * Z.count);
            } else for (let xe = 0; xe < z.locationSize; xe++) m(z.location + xe);
            i.bindBuffer(i.ARRAY_BUFFER, Ye);
            for (let xe = 0; xe < z.locationSize; xe++) E(z.location + xe, Me / z.locationSize, nt, ce, ue * We, (Re + Me / z.locationSize * xe) * We, X);
          } else {
            if (ne.isInstancedBufferAttribute) {
              for (let Z = 0; Z < z.locationSize; Z++) f(z.location + Z, ne.meshPerAttribute);
              M.isInstancedMesh !== true && V._maxInstanceCount === void 0 && (V._maxInstanceCount = ne.meshPerAttribute * ne.count);
            } else for (let Z = 0; Z < z.locationSize; Z++) m(z.location + Z);
            i.bindBuffer(i.ARRAY_BUFFER, Ye);
            for (let Z = 0; Z < z.locationSize; Z++) E(z.location + Z, Me / z.locationSize, nt, ce, Me * We, Me / z.locationSize * Z * We, X);
          }
        } else if (W !== void 0) {
          const ce = W[K];
          if (ce !== void 0) switch (ce.length) {
            case 2:
              i.vertexAttrib2fv(z.location, ce);
              break;
            case 3:
              i.vertexAttrib3fv(z.location, ce);
              break;
            case 4:
              i.vertexAttrib4fv(z.location, ce);
              break;
            default:
              i.vertexAttrib1fv(z.location, ce);
          }
        }
      }
    }
    b();
  }
  function w() {
    N();
    for (const M in n) {
      const P = n[M];
      for (const k in P) {
        const V = P[k];
        for (const j in V) u(V[j].object), delete V[j];
        delete P[k];
      }
      delete n[M];
    }
  }
  function C(M) {
    if (n[M.id] === void 0) return;
    const P = n[M.id];
    for (const k in P) {
      const V = P[k];
      for (const j in V) u(V[j].object), delete V[j];
      delete P[k];
    }
    delete n[M.id];
  }
  function R(M) {
    for (const P in n) {
      const k = n[P];
      if (k[M.id] === void 0) continue;
      const V = k[M.id];
      for (const j in V) u(V[j].object), delete V[j];
      delete k[M.id];
    }
  }
  function N() {
    S(), a = true, r !== s && (r = s, c(r.object));
  }
  function S() {
    s.geometry = null, s.program = null, s.wireframe = false;
  }
  return { setup: o, reset: N, resetDefaultState: S, dispose: w, releaseStatesOfGeometry: C, releaseStatesOfProgram: R, initAttributes: _, enableAttribute: m, disableUnusedAttributes: b };
}
function xg(i, e, t) {
  let n;
  function s(c) {
    n = c;
  }
  function r(c, u) {
    i.drawArrays(n, c, u), t.update(u, n, 1);
  }
  function a(c, u, h) {
    h !== 0 && (i.drawArraysInstanced(n, c, u, h), t.update(u, n, h));
  }
  function o(c, u, h) {
    if (h === 0) return;
    e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, c, 0, u, 0, h);
    let p = 0;
    for (let g = 0; g < h; g++) p += u[g];
    t.update(p, n, 1);
  }
  function l(c, u, h, d) {
    if (h === 0) return;
    const p = e.get("WEBGL_multi_draw");
    if (p === null) for (let g = 0; g < c.length; g++) a(c[g], u[g], d[g]);
    else {
      p.multiDrawArraysInstancedWEBGL(n, c, 0, u, 0, d, 0, h);
      let g = 0;
      for (let _ = 0; _ < h; _++) g += u[_] * d[_];
      t.update(g, n, 1);
    }
  }
  this.setMode = s, this.render = r, this.renderInstances = a, this.renderMultiDraw = o, this.renderMultiDrawInstances = l;
}
function vg(i, e, t, n) {
  let s;
  function r() {
    if (s !== void 0) return s;
    if (e.has("EXT_texture_filter_anisotropic") === true) {
      const R = e.get("EXT_texture_filter_anisotropic");
      s = i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else s = 0;
    return s;
  }
  function a(R) {
    return !(R !== Yt && n.convert(R) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function o(R) {
    const N = R === hs && (e.has("EXT_color_buffer_half_float") || e.has("EXT_color_buffer_float"));
    return !(R !== En && n.convert(R) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) && R !== hn && !N);
  }
  function l(R) {
    if (R === "highp") {
      if (i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision > 0) return "highp";
      R = "mediump";
    }
    return R === "mediump" && i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  let c = t.precision !== void 0 ? t.precision : "highp";
  const u = l(c);
  u !== c && (console.warn("THREE.WebGLRenderer:", c, "not supported, using", u, "instead."), c = u);
  const h = t.logarithmicDepthBuffer === true, d = t.reversedDepthBuffer === true && e.has("EXT_clip_control"), p = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), g = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS), _ = i.getParameter(i.MAX_TEXTURE_SIZE), m = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE), f = i.getParameter(i.MAX_VERTEX_ATTRIBS), b = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS), E = i.getParameter(i.MAX_VARYING_VECTORS), y = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS), w = g > 0, C = i.getParameter(i.MAX_SAMPLES);
  return { isWebGL2: true, getMaxAnisotropy: r, getMaxPrecision: l, textureFormatReadable: a, textureTypeReadable: o, precision: c, logarithmicDepthBuffer: h, reversedDepthBuffer: d, maxTextures: p, maxVertexTextures: g, maxTextureSize: _, maxCubemapSize: m, maxAttributes: f, maxVertexUniforms: b, maxVaryings: E, maxFragmentUniforms: y, vertexTextures: w, maxSamples: C };
}
function yg(i) {
  const e = this;
  let t = null, n = 0, s = false, r = false;
  const a = new vn(), o = new Oe(), l = { value: null, needsUpdate: false };
  this.uniform = l, this.numPlanes = 0, this.numIntersection = 0, this.init = function(h, d) {
    const p = h.length !== 0 || d || n !== 0 || s;
    return s = d, n = h.length, p;
  }, this.beginShadows = function() {
    r = true, u(null);
  }, this.endShadows = function() {
    r = false;
  }, this.setGlobalState = function(h, d) {
    t = u(h, d, 0);
  }, this.setState = function(h, d, p) {
    const g = h.clippingPlanes, _ = h.clipIntersection, m = h.clipShadows, f = i.get(h);
    if (!s || g === null || g.length === 0 || r && !m) r ? u(null) : c();
    else {
      const b = r ? 0 : n, E = b * 4;
      let y = f.clippingState || null;
      l.value = y, y = u(g, d, E, p);
      for (let w = 0; w !== E; ++w) y[w] = t[w];
      f.clippingState = y, this.numIntersection = _ ? this.numPlanes : 0, this.numPlanes += b;
    }
  };
  function c() {
    l.value !== t && (l.value = t, l.needsUpdate = n > 0), e.numPlanes = n, e.numIntersection = 0;
  }
  function u(h, d, p, g) {
    const _ = h !== null ? h.length : 0;
    let m = null;
    if (_ !== 0) {
      if (m = l.value, g !== true || m === null) {
        const f = p + _ * 4, b = d.matrixWorldInverse;
        o.getNormalMatrix(b), (m === null || m.length < f) && (m = new Float32Array(f));
        for (let E = 0, y = p; E !== _; ++E, y += 4) a.copy(h[E]).applyMatrix4(b, o), a.normal.toArray(m, y), m[y + 3] = a.constant;
      }
      l.value = m, l.needsUpdate = true;
    }
    return e.numPlanes = _, e.numIntersection = 0, m;
  }
}
function Mg(i) {
  let e = /* @__PURE__ */ new WeakMap();
  function t(a, o) {
    return o === Xa ? a.mapping = ts : o === qa && (a.mapping = ns), a;
  }
  function n(a) {
    if (a && a.isTexture) {
      const o = a.mapping;
      if (o === Xa || o === qa) if (e.has(a)) {
        const l = e.get(a).texture;
        return t(l, a.mapping);
      } else {
        const l = a.image;
        if (l && l.height > 0) {
          const c = new zd(l.height);
          return c.fromEquirectangularTexture(i, a), e.set(a, c), a.addEventListener("dispose", s), t(c.texture, a.mapping);
        } else return null;
      }
    }
    return a;
  }
  function s(a) {
    const o = a.target;
    o.removeEventListener("dispose", s);
    const l = e.get(o);
    l !== void 0 && (e.delete(o), l.dispose());
  }
  function r() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return { get: n, dispose: r };
}
const Ki = 4, fc = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], yi = 20, Ea = new Gr(), pc = new we();
let Ta = null, ba = 0, Aa = 0, wa = false;
const xi = (1 + Math.sqrt(5)) / 2, qi = 1 / xi, mc = [new L(-xi, qi, 0), new L(xi, qi, 0), new L(-qi, 0, xi), new L(qi, 0, xi), new L(0, xi, -qi), new L(0, xi, qi), new L(-1, 1, -1), new L(1, 1, -1), new L(-1, 1, 1), new L(1, 1, 1)], Sg = new L();
class wo {
  constructor(e) {
    this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
  }
  fromScene(e, t = 0, n = 0.1, s = 100, r = {}) {
    const { size: a = 256, position: o = Sg } = r;
    Ta = this._renderer.getRenderTarget(), ba = this._renderer.getActiveCubeFace(), Aa = this._renderer.getActiveMipmapLevel(), wa = this._renderer.xr.enabled, this._renderer.xr.enabled = false, this._setSize(a);
    const l = this._allocateTargets();
    return l.depthBuffer = true, this._sceneToCubeUV(e, n, s, l, o), t > 0 && this._blur(l, 0, 0, t), this._applyPMREM(l), this._cleanup(l), l;
  }
  fromEquirectangular(e, t = null) {
    return this._fromTexture(e, t);
  }
  fromCubemap(e, t = null) {
    return this._fromTexture(e, t);
  }
  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = xc(), this._compileMaterial(this._cubemapMaterial));
  }
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = _c(), this._compileMaterial(this._equirectMaterial));
  }
  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
  }
  _setSize(e) {
    this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let e = 0; e < this._lodPlanes.length; e++) this._lodPlanes[e].dispose();
  }
  _cleanup(e) {
    this._renderer.setRenderTarget(Ta, ba, Aa), this._renderer.xr.enabled = wa, e.scissorTest = false, _r(e, 0, 0, e.width, e.height);
  }
  _fromTexture(e, t) {
    e.mapping === ts || e.mapping === ns ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), Ta = this._renderer.getRenderTarget(), ba = this._renderer.getActiveCubeFace(), Aa = this._renderer.getActiveMipmapLevel(), wa = this._renderer.xr.enabled, this._renderer.xr.enabled = false;
    const n = t || this._allocateTargets();
    return this._textureToCubeUV(e, n), this._applyPMREM(n), this._cleanup(n), n;
  }
  _allocateTargets() {
    const e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, n = { magFilter: Ht, minFilter: Ht, generateMipmaps: false, type: hs, format: Yt, colorSpace: Ct, depthBuffer: false }, s = gc(e, t, n);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = gc(e, t, n);
      const { _lodMax: r } = this;
      ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = Eg(r)), this._blurMaterial = Tg(r, e, t);
    }
    return s;
  }
  _compileMaterial(e) {
    const t = new _t(this._lodPlanes[0], e);
    this._renderer.compile(t, Ea);
  }
  _sceneToCubeUV(e, t, n, s, r) {
    const l = new zt(90, 1, t, n), c = [1, -1, 1, 1, 1, 1], u = [1, 1, 1, -1, -1, -1], h = this._renderer, d = h.autoClear, p = h.toneMapping;
    h.getClearColor(pc), h.toneMapping = ri, h.autoClear = false, h.state.buffers.depth.getReversed() && (h.setRenderTarget(s), h.clearDepth(), h.setRenderTarget(null));
    const _ = new ii({ name: "PMREM.Background", side: Ut, depthWrite: false, depthTest: false }), m = new _t(new ds(), _);
    let f = false;
    const b = e.background;
    b ? b.isColor && (_.color.copy(b), e.background = null, f = true) : (_.color.copy(pc), f = true);
    for (let E = 0; E < 6; E++) {
      const y = E % 3;
      y === 0 ? (l.up.set(0, c[E], 0), l.position.set(r.x, r.y, r.z), l.lookAt(r.x + u[E], r.y, r.z)) : y === 1 ? (l.up.set(0, 0, c[E]), l.position.set(r.x, r.y, r.z), l.lookAt(r.x, r.y + u[E], r.z)) : (l.up.set(0, c[E], 0), l.position.set(r.x, r.y, r.z), l.lookAt(r.x, r.y, r.z + u[E]));
      const w = this._cubeSize;
      _r(s, y * w, E > 2 ? w : 0, w, w), h.setRenderTarget(s), f && h.render(m, l), h.render(e, l);
    }
    m.geometry.dispose(), m.material.dispose(), h.toneMapping = p, h.autoClear = d, e.background = b;
  }
  _textureToCubeUV(e, t) {
    const n = this._renderer, s = e.mapping === ts || e.mapping === ns;
    s ? (this._cubemapMaterial === null && (this._cubemapMaterial = xc()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === false ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = _c());
    const r = s ? this._cubemapMaterial : this._equirectMaterial, a = new _t(this._lodPlanes[0], r), o = r.uniforms;
    o.envMap.value = e;
    const l = this._cubeSize;
    _r(t, 0, 0, 3 * l, 2 * l), n.setRenderTarget(t), n.render(a, Ea);
  }
  _applyPMREM(e) {
    const t = this._renderer, n = t.autoClear;
    t.autoClear = false;
    const s = this._lodPlanes.length;
    for (let r = 1; r < s; r++) {
      const a = Math.sqrt(this._sigmas[r] * this._sigmas[r] - this._sigmas[r - 1] * this._sigmas[r - 1]), o = mc[(s - r - 1) % mc.length];
      this._blur(e, r - 1, r, a, o);
    }
    t.autoClear = n;
  }
  _blur(e, t, n, s, r) {
    const a = this._pingPongRenderTarget;
    this._halfBlur(e, a, t, n, s, "latitudinal", r), this._halfBlur(a, e, n, n, s, "longitudinal", r);
  }
  _halfBlur(e, t, n, s, r, a, o) {
    const l = this._renderer, c = this._blurMaterial;
    a !== "latitudinal" && a !== "longitudinal" && console.error("blur direction must be either latitudinal or longitudinal!");
    const u = 3, h = new _t(this._lodPlanes[s], c), d = c.uniforms, p = this._sizeLods[n] - 1, g = isFinite(r) ? Math.PI / (2 * p) : 2 * Math.PI / (2 * yi - 1), _ = r / g, m = isFinite(r) ? 1 + Math.floor(u * _) : yi;
    m > yi && console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${yi}`);
    const f = [];
    let b = 0;
    for (let R = 0; R < yi; ++R) {
      const N = R / _, S = Math.exp(-N * N / 2);
      f.push(S), R === 0 ? b += S : R < m && (b += 2 * S);
    }
    for (let R = 0; R < f.length; R++) f[R] = f[R] / b;
    d.envMap.value = e.texture, d.samples.value = m, d.weights.value = f, d.latitudinal.value = a === "latitudinal", o && (d.poleAxis.value = o);
    const { _lodMax: E } = this;
    d.dTheta.value = g, d.mipInt.value = E - n;
    const y = this._sizeLods[s], w = 3 * y * (s > E - Ki ? s - E + Ki : 0), C = 4 * (this._cubeSize - y);
    _r(t, w, C, 3 * y, 2 * y), l.setRenderTarget(t), l.render(h, Ea);
  }
}
function Eg(i) {
  const e = [], t = [], n = [];
  let s = i;
  const r = i - Ki + 1 + fc.length;
  for (let a = 0; a < r; a++) {
    const o = Math.pow(2, s);
    t.push(o);
    let l = 1 / o;
    a > i - Ki ? l = fc[a - i + Ki - 1] : a === 0 && (l = 0), n.push(l);
    const c = 1 / (o - 2), u = -c, h = 1 + c, d = [u, u, h, u, h, h, u, u, h, h, u, h], p = 6, g = 6, _ = 3, m = 2, f = 1, b = new Float32Array(_ * g * p), E = new Float32Array(m * g * p), y = new Float32Array(f * g * p);
    for (let C = 0; C < p; C++) {
      const R = C % 3 * 2 / 3 - 1, N = C > 2 ? 0 : -1, S = [R, N, 0, R + 2 / 3, N, 0, R + 2 / 3, N + 1, 0, R, N, 0, R + 2 / 3, N + 1, 0, R, N + 1, 0];
      b.set(S, _ * g * C), E.set(d, m * g * C);
      const M = [C, C, C, C, C, C];
      y.set(M, f * g * C);
    }
    const w = new wn();
    w.setAttribute("position", new Ft(b, _)), w.setAttribute("uv", new Ft(E, m)), w.setAttribute("faceIndex", new Ft(y, f)), e.push(w), s > Ki && s--;
  }
  return { lodPlanes: e, sizeLods: t, sigmas: n };
}
function gc(i, e, t) {
  const n = new bi(i, e, t);
  return n.texture.mapping = zr, n.texture.name = "PMREM.cubeUv", n.scissorTest = true, n;
}
function _r(i, e, t, n, s) {
  i.viewport.set(e, t, n, s), i.scissor.set(e, t, n, s);
}
function Tg(i, e, t) {
  const n = new Float32Array(yi), s = new L(0, 1, 0);
  return new ai({ name: "SphericalGaussianBlur", defines: { n: yi, CUBEUV_TEXEL_WIDTH: 1 / e, CUBEUV_TEXEL_HEIGHT: 1 / t, CUBEUV_MAX_MIP: `${i}.0` }, uniforms: { envMap: { value: null }, samples: { value: 1 }, weights: { value: n }, latitudinal: { value: false }, dTheta: { value: 0 }, mipInt: { value: 0 }, poleAxis: { value: s } }, vertexShader: rl(), fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`, blending: si, depthTest: false, depthWrite: false });
}
function _c() {
  return new ai({ name: "EquirectangularToCubeUV", uniforms: { envMap: { value: null } }, vertexShader: rl(), fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`, blending: si, depthTest: false, depthWrite: false });
}
function xc() {
  return new ai({ name: "CubemapToCubeUV", uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 } }, vertexShader: rl(), fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`, blending: si, depthTest: false, depthWrite: false });
}
function rl() {
  return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`;
}
function bg(i) {
  let e = /* @__PURE__ */ new WeakMap(), t = null;
  function n(o) {
    if (o && o.isTexture) {
      const l = o.mapping, c = l === Xa || l === qa, u = l === ts || l === ns;
      if (c || u) {
        let h = e.get(o);
        const d = h !== void 0 ? h.texture.pmremVersion : 0;
        if (o.isRenderTargetTexture && o.pmremVersion !== d) return t === null && (t = new wo(i)), h = c ? t.fromEquirectangular(o, h) : t.fromCubemap(o, h), h.texture.pmremVersion = o.pmremVersion, e.set(o, h), h.texture;
        if (h !== void 0) return h.texture;
        {
          const p = o.image;
          return c && p && p.height > 0 || u && p && s(p) ? (t === null && (t = new wo(i)), h = c ? t.fromEquirectangular(o) : t.fromCubemap(o), h.texture.pmremVersion = o.pmremVersion, e.set(o, h), o.addEventListener("dispose", r), h.texture) : null;
        }
      }
    }
    return o;
  }
  function s(o) {
    let l = 0;
    const c = 6;
    for (let u = 0; u < c; u++) o[u] !== void 0 && l++;
    return l === c;
  }
  function r(o) {
    const l = o.target;
    l.removeEventListener("dispose", r);
    const c = e.get(l);
    c !== void 0 && (e.delete(l), c.dispose());
  }
  function a() {
    e = /* @__PURE__ */ new WeakMap(), t !== null && (t.dispose(), t = null);
  }
  return { get: n, dispose: a };
}
function Ag(i) {
  const e = {};
  function t(n) {
    if (e[n] !== void 0) return e[n];
    let s;
    switch (n) {
      case "WEBGL_depth_texture":
        s = i.getExtension("WEBGL_depth_texture") || i.getExtension("MOZ_WEBGL_depth_texture") || i.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        s = i.getExtension("EXT_texture_filter_anisotropic") || i.getExtension("MOZ_EXT_texture_filter_anisotropic") || i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        s = i.getExtension("WEBGL_compressed_texture_s3tc") || i.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        s = i.getExtension("WEBGL_compressed_texture_pvrtc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        s = i.getExtension(n);
    }
    return e[n] = s, s;
  }
  return { has: function(n) {
    return t(n) !== null;
  }, init: function() {
    t("EXT_color_buffer_float"), t("WEBGL_clip_cull_distance"), t("OES_texture_float_linear"), t("EXT_color_buffer_half_float"), t("WEBGL_multisampled_render_to_texture"), t("WEBGL_render_shared_exponent");
  }, get: function(n) {
    const s = t(n);
    return s === null && zs("THREE.WebGLRenderer: " + n + " extension not supported."), s;
  } };
}
function wg(i, e, t, n) {
  const s = {}, r = /* @__PURE__ */ new WeakMap();
  function a(h) {
    const d = h.target;
    d.index !== null && e.remove(d.index);
    for (const g in d.attributes) e.remove(d.attributes[g]);
    d.removeEventListener("dispose", a), delete s[d.id];
    const p = r.get(d);
    p && (e.remove(p), r.delete(d)), n.releaseStatesOfGeometry(d), d.isInstancedBufferGeometry === true && delete d._maxInstanceCount, t.memory.geometries--;
  }
  function o(h, d) {
    return s[d.id] === true || (d.addEventListener("dispose", a), s[d.id] = true, t.memory.geometries++), d;
  }
  function l(h) {
    const d = h.attributes;
    for (const p in d) e.update(d[p], i.ARRAY_BUFFER);
  }
  function c(h) {
    const d = [], p = h.index, g = h.attributes.position;
    let _ = 0;
    if (p !== null) {
      const b = p.array;
      _ = p.version;
      for (let E = 0, y = b.length; E < y; E += 3) {
        const w = b[E + 0], C = b[E + 1], R = b[E + 2];
        d.push(w, C, C, R, R, w);
      }
    } else if (g !== void 0) {
      const b = g.array;
      _ = g.version;
      for (let E = 0, y = b.length / 3 - 1; E < y; E += 3) {
        const w = E + 0, C = E + 1, R = E + 2;
        d.push(w, C, C, R, R, w);
      }
    } else return;
    const m = new (dh(d) ? _h : gh)(d, 1);
    m.version = _;
    const f = r.get(h);
    f && e.remove(f), r.set(h, m);
  }
  function u(h) {
    const d = r.get(h);
    if (d) {
      const p = h.index;
      p !== null && d.version < p.version && c(h);
    } else c(h);
    return r.get(h);
  }
  return { get: o, update: l, getWireframeAttribute: u };
}
function Rg(i, e, t) {
  let n;
  function s(d) {
    n = d;
  }
  let r, a;
  function o(d) {
    r = d.type, a = d.bytesPerElement;
  }
  function l(d, p) {
    i.drawElements(n, p, r, d * a), t.update(p, n, 1);
  }
  function c(d, p, g) {
    g !== 0 && (i.drawElementsInstanced(n, p, r, d * a, g), t.update(p, n, g));
  }
  function u(d, p, g) {
    if (g === 0) return;
    e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, p, 0, r, d, 0, g);
    let m = 0;
    for (let f = 0; f < g; f++) m += p[f];
    t.update(m, n, 1);
  }
  function h(d, p, g, _) {
    if (g === 0) return;
    const m = e.get("WEBGL_multi_draw");
    if (m === null) for (let f = 0; f < d.length; f++) c(d[f] / a, p[f], _[f]);
    else {
      m.multiDrawElementsInstancedWEBGL(n, p, 0, r, d, 0, _, 0, g);
      let f = 0;
      for (let b = 0; b < g; b++) f += p[b] * _[b];
      t.update(f, n, 1);
    }
  }
  this.setMode = s, this.setIndex = o, this.render = l, this.renderInstances = c, this.renderMultiDraw = u, this.renderMultiDrawInstances = h;
}
function Cg(i) {
  const e = { geometries: 0, textures: 0 }, t = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
  function n(r, a, o) {
    switch (t.calls++, a) {
      case i.TRIANGLES:
        t.triangles += o * (r / 3);
        break;
      case i.LINES:
        t.lines += o * (r / 2);
        break;
      case i.LINE_STRIP:
        t.lines += o * (r - 1);
        break;
      case i.LINE_LOOP:
        t.lines += o * r;
        break;
      case i.POINTS:
        t.points += o * r;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", a);
        break;
    }
  }
  function s() {
    t.calls = 0, t.triangles = 0, t.points = 0, t.lines = 0;
  }
  return { memory: e, render: t, programs: null, autoReset: true, reset: s, update: n };
}
function Pg(i, e, t) {
  const n = /* @__PURE__ */ new WeakMap(), s = new Ke();
  function r(a, o, l) {
    const c = a.morphTargetInfluences, u = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, h = u !== void 0 ? u.length : 0;
    let d = n.get(o);
    if (d === void 0 || d.count !== h) {
      let M = function() {
        N.dispose(), n.delete(o), o.removeEventListener("dispose", M);
      };
      var p = M;
      d !== void 0 && d.texture.dispose();
      const g = o.morphAttributes.position !== void 0, _ = o.morphAttributes.normal !== void 0, m = o.morphAttributes.color !== void 0, f = o.morphAttributes.position || [], b = o.morphAttributes.normal || [], E = o.morphAttributes.color || [];
      let y = 0;
      g === true && (y = 1), _ === true && (y = 2), m === true && (y = 3);
      let w = o.attributes.position.count * y, C = 1;
      w > e.maxTextureSize && (C = Math.ceil(w / e.maxTextureSize), w = e.maxTextureSize);
      const R = new Float32Array(w * C * 4 * h), N = new fh(R, w, C, h);
      N.type = hn, N.needsUpdate = true;
      const S = y * 4;
      for (let P = 0; P < h; P++) {
        const k = f[P], V = b[P], j = E[P], q = w * C * 4 * P;
        for (let W = 0; W < k.count; W++) {
          const K = W * S;
          g === true && (s.fromBufferAttribute(k, W), R[q + K + 0] = s.x, R[q + K + 1] = s.y, R[q + K + 2] = s.z, R[q + K + 3] = 0), _ === true && (s.fromBufferAttribute(V, W), R[q + K + 4] = s.x, R[q + K + 5] = s.y, R[q + K + 6] = s.z, R[q + K + 7] = 0), m === true && (s.fromBufferAttribute(j, W), R[q + K + 8] = s.x, R[q + K + 9] = s.y, R[q + K + 10] = s.z, R[q + K + 11] = j.itemSize === 4 ? s.w : 1);
        }
      }
      d = { count: h, texture: N, size: new Ee(w, C) }, n.set(o, d), o.addEventListener("dispose", M);
    }
    if (a.isInstancedMesh === true && a.morphTexture !== null) l.getUniforms().setValue(i, "morphTexture", a.morphTexture, t);
    else {
      let g = 0;
      for (let m = 0; m < c.length; m++) g += c[m];
      const _ = o.morphTargetsRelative ? 1 : 1 - g;
      l.getUniforms().setValue(i, "morphTargetBaseInfluence", _), l.getUniforms().setValue(i, "morphTargetInfluences", c);
    }
    l.getUniforms().setValue(i, "morphTargetsTexture", d.texture, t), l.getUniforms().setValue(i, "morphTargetsTextureSize", d.size);
  }
  return { update: r };
}
function Lg(i, e, t, n) {
  let s = /* @__PURE__ */ new WeakMap();
  function r(l) {
    const c = n.render.frame, u = l.geometry, h = e.get(l, u);
    if (s.get(h) !== c && (e.update(h), s.set(h, c)), l.isInstancedMesh && (l.hasEventListener("dispose", o) === false && l.addEventListener("dispose", o), s.get(l) !== c && (t.update(l.instanceMatrix, i.ARRAY_BUFFER), l.instanceColor !== null && t.update(l.instanceColor, i.ARRAY_BUFFER), s.set(l, c))), l.isSkinnedMesh) {
      const d = l.skeleton;
      s.get(d) !== c && (d.update(), s.set(d, c));
    }
    return h;
  }
  function a() {
    s = /* @__PURE__ */ new WeakMap();
  }
  function o(l) {
    const c = l.target;
    c.removeEventListener("dispose", o), t.remove(c.instanceMatrix), c.instanceColor !== null && t.remove(c.instanceColor);
  }
  return { update: r, dispose: a };
}
const Nh = new bt(), vc = new wh(1, 1), Fh = new fh(), Oh = new ph(), Bh = new yh(), yc = [], Mc = [], Sc = new Float32Array(16), Ec = new Float32Array(9), Tc = new Float32Array(4);
function gs(i, e, t) {
  const n = i[0];
  if (n <= 0 || n > 0) return i;
  const s = e * t;
  let r = yc[s];
  if (r === void 0 && (r = new Float32Array(s), yc[s] = r), e !== 0) {
    n.toArray(r, 0);
    for (let a = 1, o = 0; a !== e; ++a) o += t, i[a].toArray(r, o);
  }
  return r;
}
function Mt(i, e) {
  if (i.length !== e.length) return false;
  for (let t = 0, n = i.length; t < n; t++) if (i[t] !== e[t]) return false;
  return true;
}
function St(i, e) {
  for (let t = 0, n = e.length; t < n; t++) i[t] = e[t];
}
function Wr(i, e) {
  let t = Mc[e];
  t === void 0 && (t = new Int32Array(e), Mc[e] = t);
  for (let n = 0; n !== e; ++n) t[n] = i.allocateTextureUnit();
  return t;
}
function Dg(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1f(this.addr, e), t[0] = e);
}
function Ig(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y) && (i.uniform2f(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (Mt(t, e)) return;
    i.uniform2fv(this.addr, e), St(t, e);
  }
}
function Ug(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3f(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else if (e.r !== void 0) (t[0] !== e.r || t[1] !== e.g || t[2] !== e.b) && (i.uniform3f(this.addr, e.r, e.g, e.b), t[0] = e.r, t[1] = e.g, t[2] = e.b);
  else {
    if (Mt(t, e)) return;
    i.uniform3fv(this.addr, e), St(t, e);
  }
}
function Ng(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4f(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (Mt(t, e)) return;
    i.uniform4fv(this.addr, e), St(t, e);
  }
}
function Fg(i, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (Mt(t, e)) return;
    i.uniformMatrix2fv(this.addr, false, e), St(t, e);
  } else {
    if (Mt(t, n)) return;
    Tc.set(n), i.uniformMatrix2fv(this.addr, false, Tc), St(t, n);
  }
}
function Og(i, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (Mt(t, e)) return;
    i.uniformMatrix3fv(this.addr, false, e), St(t, e);
  } else {
    if (Mt(t, n)) return;
    Ec.set(n), i.uniformMatrix3fv(this.addr, false, Ec), St(t, n);
  }
}
function Bg(i, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (Mt(t, e)) return;
    i.uniformMatrix4fv(this.addr, false, e), St(t, e);
  } else {
    if (Mt(t, n)) return;
    Sc.set(n), i.uniformMatrix4fv(this.addr, false, Sc), St(t, n);
  }
}
function kg(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1i(this.addr, e), t[0] = e);
}
function zg(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y) && (i.uniform2i(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (Mt(t, e)) return;
    i.uniform2iv(this.addr, e), St(t, e);
  }
}
function Hg(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3i(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else {
    if (Mt(t, e)) return;
    i.uniform3iv(this.addr, e), St(t, e);
  }
}
function Vg(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4i(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (Mt(t, e)) return;
    i.uniform4iv(this.addr, e), St(t, e);
  }
}
function Gg(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1ui(this.addr, e), t[0] = e);
}
function Wg(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y) && (i.uniform2ui(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (Mt(t, e)) return;
    i.uniform2uiv(this.addr, e), St(t, e);
  }
}
function Xg(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3ui(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else {
    if (Mt(t, e)) return;
    i.uniform3uiv(this.addr, e), St(t, e);
  }
}
function qg(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4ui(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (Mt(t, e)) return;
    i.uniform4uiv(this.addr, e), St(t, e);
  }
}
function Yg(i, e, t) {
  const n = this.cache, s = t.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s);
  let r;
  this.type === i.SAMPLER_2D_SHADOW ? (vc.compareFunction = uh, r = vc) : r = Nh, t.setTexture2D(e || r, s);
}
function jg(i, e, t) {
  const n = this.cache, s = t.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), t.setTexture3D(e || Oh, s);
}
function Kg(i, e, t) {
  const n = this.cache, s = t.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), t.setTextureCube(e || Bh, s);
}
function Zg(i, e, t) {
  const n = this.cache, s = t.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), t.setTexture2DArray(e || Fh, s);
}
function $g(i) {
  switch (i) {
    case 5126:
      return Dg;
    case 35664:
      return Ig;
    case 35665:
      return Ug;
    case 35666:
      return Ng;
    case 35674:
      return Fg;
    case 35675:
      return Og;
    case 35676:
      return Bg;
    case 5124:
    case 35670:
      return kg;
    case 35667:
    case 35671:
      return zg;
    case 35668:
    case 35672:
      return Hg;
    case 35669:
    case 35673:
      return Vg;
    case 5125:
      return Gg;
    case 36294:
      return Wg;
    case 36295:
      return Xg;
    case 36296:
      return qg;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return Yg;
    case 35679:
    case 36299:
    case 36307:
      return jg;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return Kg;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return Zg;
  }
}
function Jg(i, e) {
  i.uniform1fv(this.addr, e);
}
function Qg(i, e) {
  const t = gs(e, this.size, 2);
  i.uniform2fv(this.addr, t);
}
function e_(i, e) {
  const t = gs(e, this.size, 3);
  i.uniform3fv(this.addr, t);
}
function t_(i, e) {
  const t = gs(e, this.size, 4);
  i.uniform4fv(this.addr, t);
}
function n_(i, e) {
  const t = gs(e, this.size, 4);
  i.uniformMatrix2fv(this.addr, false, t);
}
function i_(i, e) {
  const t = gs(e, this.size, 9);
  i.uniformMatrix3fv(this.addr, false, t);
}
function s_(i, e) {
  const t = gs(e, this.size, 16);
  i.uniformMatrix4fv(this.addr, false, t);
}
function r_(i, e) {
  i.uniform1iv(this.addr, e);
}
function a_(i, e) {
  i.uniform2iv(this.addr, e);
}
function o_(i, e) {
  i.uniform3iv(this.addr, e);
}
function l_(i, e) {
  i.uniform4iv(this.addr, e);
}
function c_(i, e) {
  i.uniform1uiv(this.addr, e);
}
function h_(i, e) {
  i.uniform2uiv(this.addr, e);
}
function u_(i, e) {
  i.uniform3uiv(this.addr, e);
}
function d_(i, e) {
  i.uniform4uiv(this.addr, e);
}
function f_(i, e, t) {
  const n = this.cache, s = e.length, r = Wr(t, s);
  Mt(n, r) || (i.uniform1iv(this.addr, r), St(n, r));
  for (let a = 0; a !== s; ++a) t.setTexture2D(e[a] || Nh, r[a]);
}
function p_(i, e, t) {
  const n = this.cache, s = e.length, r = Wr(t, s);
  Mt(n, r) || (i.uniform1iv(this.addr, r), St(n, r));
  for (let a = 0; a !== s; ++a) t.setTexture3D(e[a] || Oh, r[a]);
}
function m_(i, e, t) {
  const n = this.cache, s = e.length, r = Wr(t, s);
  Mt(n, r) || (i.uniform1iv(this.addr, r), St(n, r));
  for (let a = 0; a !== s; ++a) t.setTextureCube(e[a] || Bh, r[a]);
}
function g_(i, e, t) {
  const n = this.cache, s = e.length, r = Wr(t, s);
  Mt(n, r) || (i.uniform1iv(this.addr, r), St(n, r));
  for (let a = 0; a !== s; ++a) t.setTexture2DArray(e[a] || Fh, r[a]);
}
function __(i) {
  switch (i) {
    case 5126:
      return Jg;
    case 35664:
      return Qg;
    case 35665:
      return e_;
    case 35666:
      return t_;
    case 35674:
      return n_;
    case 35675:
      return i_;
    case 35676:
      return s_;
    case 5124:
    case 35670:
      return r_;
    case 35667:
    case 35671:
      return a_;
    case 35668:
    case 35672:
      return o_;
    case 35669:
    case 35673:
      return l_;
    case 5125:
      return c_;
    case 36294:
      return h_;
    case 36295:
      return u_;
    case 36296:
      return d_;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return f_;
    case 35679:
    case 36299:
    case 36307:
      return p_;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return m_;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return g_;
  }
}
class x_ {
  constructor(e, t, n) {
    this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.setValue = $g(t.type);
  }
}
class v_ {
  constructor(e, t, n) {
    this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = __(t.type);
  }
}
class y_ {
  constructor(e) {
    this.id = e, this.seq = [], this.map = {};
  }
  setValue(e, t, n) {
    const s = this.seq;
    for (let r = 0, a = s.length; r !== a; ++r) {
      const o = s[r];
      o.setValue(e, t[o.id], n);
    }
  }
}
const Ra = /(\w+)(\])?(\[|\.)?/g;
function bc(i, e) {
  i.seq.push(e), i.map[e.id] = e;
}
function M_(i, e, t) {
  const n = i.name, s = n.length;
  for (Ra.lastIndex = 0; ; ) {
    const r = Ra.exec(n), a = Ra.lastIndex;
    let o = r[1];
    const l = r[2] === "]", c = r[3];
    if (l && (o = o | 0), c === void 0 || c === "[" && a + 2 === s) {
      bc(t, c === void 0 ? new x_(o, i, e) : new v_(o, i, e));
      break;
    } else {
      let h = t.map[o];
      h === void 0 && (h = new y_(o), bc(t, h)), t = h;
    }
  }
}
class wr {
  constructor(e, t) {
    this.seq = [], this.map = {};
    const n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
    for (let s = 0; s < n; ++s) {
      const r = e.getActiveUniform(t, s), a = e.getUniformLocation(t, r.name);
      M_(r, a, this);
    }
  }
  setValue(e, t, n, s) {
    const r = this.map[t];
    r !== void 0 && r.setValue(e, n, s);
  }
  setOptional(e, t, n) {
    const s = t[n];
    s !== void 0 && this.setValue(e, n, s);
  }
  static upload(e, t, n, s) {
    for (let r = 0, a = t.length; r !== a; ++r) {
      const o = t[r], l = n[o.id];
      l.needsUpdate !== false && o.setValue(e, l.value, s);
    }
  }
  static seqWithValue(e, t) {
    const n = [];
    for (let s = 0, r = e.length; s !== r; ++s) {
      const a = e[s];
      a.id in t && n.push(a);
    }
    return n;
  }
}
function Ac(i, e, t) {
  const n = i.createShader(e);
  return i.shaderSource(n, t), i.compileShader(n), n;
}
const S_ = 37297;
let E_ = 0;
function T_(i, e) {
  const t = i.split(`
`), n = [], s = Math.max(e - 6, 0), r = Math.min(e + 6, t.length);
  for (let a = s; a < r; a++) {
    const o = a + 1;
    n.push(`${o === e ? ">" : " "} ${o}: ${t[a]}`);
  }
  return n.join(`
`);
}
const wc = new Oe();
function b_(i) {
  qe._getMatrix(wc, qe.workingColorSpace, i);
  const e = `mat3( ${wc.elements.map((t) => t.toFixed(4))} )`;
  switch (qe.getTransfer(i)) {
    case Lr:
      return [e, "LinearTransferOETF"];
    case et:
      return [e, "sRGBTransferOETF"];
    default:
      return console.warn("THREE.WebGLProgram: Unsupported color space: ", i), [e, "LinearTransferOETF"];
  }
}
function Rc(i, e, t) {
  const n = i.getShaderParameter(e, i.COMPILE_STATUS), r = (i.getShaderInfoLog(e) || "").trim();
  if (n && r === "") return "";
  const a = /ERROR: 0:(\d+)/.exec(r);
  if (a) {
    const o = parseInt(a[1]);
    return t.toUpperCase() + `

` + r + `

` + T_(i.getShaderSource(e), o);
  } else return r;
}
function A_(i, e) {
  const t = b_(e);
  return [`vec4 ${i}( vec4 value ) {`, `	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`, "}"].join(`
`);
}
function w_(i, e) {
  let t;
  switch (e) {
    case Lu:
      t = "Linear";
      break;
    case Du:
      t = "Reinhard";
      break;
    case Iu:
      t = "Cineon";
      break;
    case eh:
      t = "ACESFilmic";
      break;
    case Nu:
      t = "AgX";
      break;
    case Fu:
      t = "Neutral";
      break;
    case Uu:
      t = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", e), t = "Linear";
  }
  return "vec3 " + i + "( vec3 color ) { return " + t + "ToneMapping( color ); }";
}
const xr = new L();
function R_() {
  qe.getLuminanceCoefficients(xr);
  const i = xr.x.toFixed(4), e = xr.y.toFixed(4), t = xr.z.toFixed(4);
  return ["float luminance( const in vec3 rgb ) {", `	const vec3 weights = vec3( ${i}, ${e}, ${t} );`, "	return dot( weights, rgb );", "}"].join(`
`);
}
function C_(i) {
  return [i.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "", i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""].filter(Rs).join(`
`);
}
function P_(i) {
  const e = [];
  for (const t in i) {
    const n = i[t];
    n !== false && e.push("#define " + t + " " + n);
  }
  return e.join(`
`);
}
function L_(i, e) {
  const t = {}, n = i.getProgramParameter(e, i.ACTIVE_ATTRIBUTES);
  for (let s = 0; s < n; s++) {
    const r = i.getActiveAttrib(e, s), a = r.name;
    let o = 1;
    r.type === i.FLOAT_MAT2 && (o = 2), r.type === i.FLOAT_MAT3 && (o = 3), r.type === i.FLOAT_MAT4 && (o = 4), t[a] = { type: r.type, location: i.getAttribLocation(e, a), locationSize: o };
  }
  return t;
}
function Rs(i) {
  return i !== "";
}
function Cc(i, e) {
  const t = e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
  return i.replace(/NUM_DIR_LIGHTS/g, e.numDirLights).replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, t).replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, e.numPointLights).replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows);
}
function Pc(i, e) {
  return i.replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, e.numClippingPlanes - e.numClipIntersection);
}
const D_ = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Ro(i) {
  return i.replace(D_, U_);
}
const I_ = /* @__PURE__ */ new Map();
function U_(i, e) {
  let t = Ue[e];
  if (t === void 0) {
    const n = I_.get(e);
    if (n !== void 0) t = Ue[n], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', e, n);
    else throw new Error("Can not resolve #include <" + e + ">");
  }
  return Ro(t);
}
const N_ = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Lc(i) {
  return i.replace(N_, F_);
}
function F_(i, e, t, n) {
  let s = "";
  for (let r = parseInt(e); r < parseInt(t); r++) s += n.replace(/\[\s*i\s*\]/g, "[ " + r + " ]").replace(/UNROLLED_LOOP_INDEX/g, r);
  return s;
}
function Dc(i) {
  let e = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;
  return i.precision === "highp" ? e += `
#define HIGH_PRECISION` : i.precision === "mediump" ? e += `
#define MEDIUM_PRECISION` : i.precision === "lowp" && (e += `
#define LOW_PRECISION`), e;
}
function O_(i) {
  let e = "SHADOWMAP_TYPE_BASIC";
  return i.shadowMapType === Jc ? e = "SHADOWMAP_TYPE_PCF" : i.shadowMapType === Qc ? e = "SHADOWMAP_TYPE_PCF_SOFT" : i.shadowMapType === Nn && (e = "SHADOWMAP_TYPE_VSM"), e;
}
function B_(i) {
  let e = "ENVMAP_TYPE_CUBE";
  if (i.envMap) switch (i.envMapMode) {
    case ts:
    case ns:
      e = "ENVMAP_TYPE_CUBE";
      break;
    case zr:
      e = "ENVMAP_TYPE_CUBE_UV";
      break;
  }
  return e;
}
function k_(i) {
  let e = "ENVMAP_MODE_REFLECTION";
  return i.envMap && i.envMapMode === ns && (e = "ENVMAP_MODE_REFRACTION"), e;
}
function z_(i) {
  let e = "ENVMAP_BLENDING_NONE";
  if (i.envMap) switch (i.combine) {
    case Bo:
      e = "ENVMAP_BLENDING_MULTIPLY";
      break;
    case Cu:
      e = "ENVMAP_BLENDING_MIX";
      break;
    case Pu:
      e = "ENVMAP_BLENDING_ADD";
      break;
  }
  return e;
}
function H_(i) {
  const e = i.envMapCubeUVHeight;
  if (e === null) return null;
  const t = Math.log2(e) - 2, n = 1 / e;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, t), 112)), texelHeight: n, maxMip: t };
}
function V_(i, e, t, n) {
  const s = i.getContext(), r = t.defines;
  let a = t.vertexShader, o = t.fragmentShader;
  const l = O_(t), c = B_(t), u = k_(t), h = z_(t), d = H_(t), p = C_(t), g = P_(r), _ = s.createProgram();
  let m, f, b = t.glslVersion ? "#version " + t.glslVersion + `
` : "";
  t.isRawShaderMaterial ? (m = ["#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, g].filter(Rs).join(`
`), m.length > 0 && (m += `
`), f = ["#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, g].filter(Rs).join(`
`), f.length > 0 && (f += `
`)) : (m = [Dc(t), "#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, g, t.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "", t.batching ? "#define USE_BATCHING" : "", t.batchingColor ? "#define USE_BATCHING_COLOR" : "", t.instancing ? "#define USE_INSTANCING" : "", t.instancingColor ? "#define USE_INSTANCING_COLOR" : "", t.instancingMorph ? "#define USE_INSTANCING_MORPH" : "", t.useFog && t.fog ? "#define USE_FOG" : "", t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "", t.map ? "#define USE_MAP" : "", t.envMap ? "#define USE_ENVMAP" : "", t.envMap ? "#define " + u : "", t.lightMap ? "#define USE_LIGHTMAP" : "", t.aoMap ? "#define USE_AOMAP" : "", t.bumpMap ? "#define USE_BUMPMAP" : "", t.normalMap ? "#define USE_NORMALMAP" : "", t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "", t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "", t.displacementMap ? "#define USE_DISPLACEMENTMAP" : "", t.emissiveMap ? "#define USE_EMISSIVEMAP" : "", t.anisotropy ? "#define USE_ANISOTROPY" : "", t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "", t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "", t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "", t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "", t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "", t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "", t.specularMap ? "#define USE_SPECULARMAP" : "", t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "", t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "", t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "", t.metalnessMap ? "#define USE_METALNESSMAP" : "", t.alphaMap ? "#define USE_ALPHAMAP" : "", t.alphaHash ? "#define USE_ALPHAHASH" : "", t.transmission ? "#define USE_TRANSMISSION" : "", t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "", t.thicknessMap ? "#define USE_THICKNESSMAP" : "", t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "", t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "", t.mapUv ? "#define MAP_UV " + t.mapUv : "", t.alphaMapUv ? "#define ALPHAMAP_UV " + t.alphaMapUv : "", t.lightMapUv ? "#define LIGHTMAP_UV " + t.lightMapUv : "", t.aoMapUv ? "#define AOMAP_UV " + t.aoMapUv : "", t.emissiveMapUv ? "#define EMISSIVEMAP_UV " + t.emissiveMapUv : "", t.bumpMapUv ? "#define BUMPMAP_UV " + t.bumpMapUv : "", t.normalMapUv ? "#define NORMALMAP_UV " + t.normalMapUv : "", t.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + t.displacementMapUv : "", t.metalnessMapUv ? "#define METALNESSMAP_UV " + t.metalnessMapUv : "", t.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + t.roughnessMapUv : "", t.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + t.anisotropyMapUv : "", t.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + t.clearcoatMapUv : "", t.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + t.clearcoatNormalMapUv : "", t.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + t.clearcoatRoughnessMapUv : "", t.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + t.iridescenceMapUv : "", t.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + t.iridescenceThicknessMapUv : "", t.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + t.sheenColorMapUv : "", t.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + t.sheenRoughnessMapUv : "", t.specularMapUv ? "#define SPECULARMAP_UV " + t.specularMapUv : "", t.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + t.specularColorMapUv : "", t.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + t.specularIntensityMapUv : "", t.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + t.transmissionMapUv : "", t.thicknessMapUv ? "#define THICKNESSMAP_UV " + t.thicknessMapUv : "", t.vertexTangents && t.flatShading === false ? "#define USE_TANGENT" : "", t.vertexColors ? "#define USE_COLOR" : "", t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "", t.vertexUv1s ? "#define USE_UV1" : "", t.vertexUv2s ? "#define USE_UV2" : "", t.vertexUv3s ? "#define USE_UV3" : "", t.pointsUvs ? "#define USE_POINTS_UV" : "", t.flatShading ? "#define FLAT_SHADED" : "", t.skinning ? "#define USE_SKINNING" : "", t.morphTargets ? "#define USE_MORPHTARGETS" : "", t.morphNormals && t.flatShading === false ? "#define USE_MORPHNORMALS" : "", t.morphColors ? "#define USE_MORPHCOLORS" : "", t.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + t.morphTextureStride : "", t.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + t.morphTargetsCount : "", t.doubleSided ? "#define DOUBLE_SIDED" : "", t.flipSided ? "#define FLIP_SIDED" : "", t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", t.shadowMapEnabled ? "#define " + l : "", t.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "", t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "", t.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "", t.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "", "uniform mat4 modelMatrix;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat3 normalMatrix;", "uniform vec3 cameraPosition;", "uniform bool isOrthographic;", "#ifdef USE_INSTANCING", "	attribute mat4 instanceMatrix;", "#endif", "#ifdef USE_INSTANCING_COLOR", "	attribute vec3 instanceColor;", "#endif", "#ifdef USE_INSTANCING_MORPH", "	uniform sampler2D morphTexture;", "#endif", "attribute vec3 position;", "attribute vec3 normal;", "attribute vec2 uv;", "#ifdef USE_UV1", "	attribute vec2 uv1;", "#endif", "#ifdef USE_UV2", "	attribute vec2 uv2;", "#endif", "#ifdef USE_UV3", "	attribute vec2 uv3;", "#endif", "#ifdef USE_TANGENT", "	attribute vec4 tangent;", "#endif", "#if defined( USE_COLOR_ALPHA )", "	attribute vec4 color;", "#elif defined( USE_COLOR )", "	attribute vec3 color;", "#endif", "#ifdef USE_SKINNING", "	attribute vec4 skinIndex;", "	attribute vec4 skinWeight;", "#endif", `
`].filter(Rs).join(`
`), f = [Dc(t), "#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, g, t.useFog && t.fog ? "#define USE_FOG" : "", t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "", t.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "", t.map ? "#define USE_MAP" : "", t.matcap ? "#define USE_MATCAP" : "", t.envMap ? "#define USE_ENVMAP" : "", t.envMap ? "#define " + c : "", t.envMap ? "#define " + u : "", t.envMap ? "#define " + h : "", d ? "#define CUBEUV_TEXEL_WIDTH " + d.texelWidth : "", d ? "#define CUBEUV_TEXEL_HEIGHT " + d.texelHeight : "", d ? "#define CUBEUV_MAX_MIP " + d.maxMip + ".0" : "", t.lightMap ? "#define USE_LIGHTMAP" : "", t.aoMap ? "#define USE_AOMAP" : "", t.bumpMap ? "#define USE_BUMPMAP" : "", t.normalMap ? "#define USE_NORMALMAP" : "", t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "", t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "", t.emissiveMap ? "#define USE_EMISSIVEMAP" : "", t.anisotropy ? "#define USE_ANISOTROPY" : "", t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "", t.clearcoat ? "#define USE_CLEARCOAT" : "", t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "", t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "", t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "", t.dispersion ? "#define USE_DISPERSION" : "", t.iridescence ? "#define USE_IRIDESCENCE" : "", t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "", t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "", t.specularMap ? "#define USE_SPECULARMAP" : "", t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "", t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "", t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "", t.metalnessMap ? "#define USE_METALNESSMAP" : "", t.alphaMap ? "#define USE_ALPHAMAP" : "", t.alphaTest ? "#define USE_ALPHATEST" : "", t.alphaHash ? "#define USE_ALPHAHASH" : "", t.sheen ? "#define USE_SHEEN" : "", t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "", t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "", t.transmission ? "#define USE_TRANSMISSION" : "", t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "", t.thicknessMap ? "#define USE_THICKNESSMAP" : "", t.vertexTangents && t.flatShading === false ? "#define USE_TANGENT" : "", t.vertexColors || t.instancingColor || t.batchingColor ? "#define USE_COLOR" : "", t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "", t.vertexUv1s ? "#define USE_UV1" : "", t.vertexUv2s ? "#define USE_UV2" : "", t.vertexUv3s ? "#define USE_UV3" : "", t.pointsUvs ? "#define USE_POINTS_UV" : "", t.gradientMap ? "#define USE_GRADIENTMAP" : "", t.flatShading ? "#define FLAT_SHADED" : "", t.doubleSided ? "#define DOUBLE_SIDED" : "", t.flipSided ? "#define FLIP_SIDED" : "", t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", t.shadowMapEnabled ? "#define " + l : "", t.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "", t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "", t.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "", t.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "", t.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "", t.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "", "uniform mat4 viewMatrix;", "uniform vec3 cameraPosition;", "uniform bool isOrthographic;", t.toneMapping !== ri ? "#define TONE_MAPPING" : "", t.toneMapping !== ri ? Ue.tonemapping_pars_fragment : "", t.toneMapping !== ri ? w_("toneMapping", t.toneMapping) : "", t.dithering ? "#define DITHERING" : "", t.opaque ? "#define OPAQUE" : "", Ue.colorspace_pars_fragment, A_("linearToOutputTexel", t.outputColorSpace), R_(), t.useDepthPacking ? "#define DEPTH_PACKING " + t.depthPacking : "", `
`].filter(Rs).join(`
`)), a = Ro(a), a = Cc(a, t), a = Pc(a, t), o = Ro(o), o = Cc(o, t), o = Pc(o, t), a = Lc(a), o = Lc(o), t.isRawShaderMaterial !== true && (b = `#version 300 es
`, m = [p, "#define attribute in", "#define varying out", "#define texture2D texture"].join(`
`) + `
` + m, f = ["#define varying in", t.glslVersion === bl ? "" : "layout(location = 0) out highp vec4 pc_fragColor;", t.glslVersion === bl ? "" : "#define gl_FragColor pc_fragColor", "#define gl_FragDepthEXT gl_FragDepth", "#define texture2D texture", "#define textureCube texture", "#define texture2DProj textureProj", "#define texture2DLodEXT textureLod", "#define texture2DProjLodEXT textureProjLod", "#define textureCubeLodEXT textureLod", "#define texture2DGradEXT textureGrad", "#define texture2DProjGradEXT textureProjGrad", "#define textureCubeGradEXT textureGrad"].join(`
`) + `
` + f);
  const E = b + m + a, y = b + f + o, w = Ac(s, s.VERTEX_SHADER, E), C = Ac(s, s.FRAGMENT_SHADER, y);
  s.attachShader(_, w), s.attachShader(_, C), t.index0AttributeName !== void 0 ? s.bindAttribLocation(_, 0, t.index0AttributeName) : t.morphTargets === true && s.bindAttribLocation(_, 0, "position"), s.linkProgram(_);
  function R(P) {
    if (i.debug.checkShaderErrors) {
      const k = s.getProgramInfoLog(_) || "", V = s.getShaderInfoLog(w) || "", j = s.getShaderInfoLog(C) || "", q = k.trim(), W = V.trim(), K = j.trim();
      let z = true, ne = true;
      if (s.getProgramParameter(_, s.LINK_STATUS) === false) if (z = false, typeof i.debug.onShaderError == "function") i.debug.onShaderError(s, _, w, C);
      else {
        const ce = Rc(s, w, "vertex"), Me = Rc(s, C, "fragment");
        console.error("THREE.WebGLProgram: Shader Error " + s.getError() + " - VALIDATE_STATUS " + s.getProgramParameter(_, s.VALIDATE_STATUS) + `

Material Name: ` + P.name + `
Material Type: ` + P.type + `

Program Info Log: ` + q + `
` + ce + `
` + Me);
      }
      else q !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", q) : (W === "" || K === "") && (ne = false);
      ne && (P.diagnostics = { runnable: z, programLog: q, vertexShader: { log: W, prefix: m }, fragmentShader: { log: K, prefix: f } });
    }
    s.deleteShader(w), s.deleteShader(C), N = new wr(s, _), S = L_(s, _);
  }
  let N;
  this.getUniforms = function() {
    return N === void 0 && R(this), N;
  };
  let S;
  this.getAttributes = function() {
    return S === void 0 && R(this), S;
  };
  let M = t.rendererExtensionParallelShaderCompile === false;
  return this.isReady = function() {
    return M === false && (M = s.getProgramParameter(_, S_)), M;
  }, this.destroy = function() {
    n.releaseStatesOfProgram(this), s.deleteProgram(_), this.program = void 0;
  }, this.type = t.shaderType, this.name = t.shaderName, this.id = E_++, this.cacheKey = e, this.usedTimes = 1, this.program = _, this.vertexShader = w, this.fragmentShader = C, this;
}
let G_ = 0;
class W_ {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(e) {
    const t = e.vertexShader, n = e.fragmentShader, s = this._getShaderStage(t), r = this._getShaderStage(n), a = this._getShaderCacheForMaterial(e);
    return a.has(s) === false && (a.add(s), s.usedTimes++), a.has(r) === false && (a.add(r), r.usedTimes++), this;
  }
  remove(e) {
    const t = this.materialCache.get(e);
    for (const n of t) n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
    return this.materialCache.delete(e), this;
  }
  getVertexShaderID(e) {
    return this._getShaderStage(e.vertexShader).id;
  }
  getFragmentShaderID(e) {
    return this._getShaderStage(e.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(e) {
    const t = this.materialCache;
    let n = t.get(e);
    return n === void 0 && (n = /* @__PURE__ */ new Set(), t.set(e, n)), n;
  }
  _getShaderStage(e) {
    const t = this.shaderCache;
    let n = t.get(e);
    return n === void 0 && (n = new X_(e), t.set(e, n)), n;
  }
}
class X_ {
  constructor(e) {
    this.id = G_++, this.code = e, this.usedTimes = 0;
  }
}
function q_(i, e, t, n, s, r, a) {
  const o = new Ko(), l = new W_(), c = /* @__PURE__ */ new Set(), u = [], h = s.logarithmicDepthBuffer, d = s.vertexTextures;
  let p = s.precision;
  const g = { MeshDepthMaterial: "depth", MeshDistanceMaterial: "distanceRGBA", MeshNormalMaterial: "normal", MeshBasicMaterial: "basic", MeshLambertMaterial: "lambert", MeshPhongMaterial: "phong", MeshToonMaterial: "toon", MeshStandardMaterial: "physical", MeshPhysicalMaterial: "physical", MeshMatcapMaterial: "matcap", LineBasicMaterial: "basic", LineDashedMaterial: "dashed", PointsMaterial: "points", ShadowMaterial: "shadow", SpriteMaterial: "sprite" };
  function _(S) {
    return c.add(S), S === 0 ? "uv" : `uv${S}`;
  }
  function m(S, M, P, k, V) {
    const j = k.fog, q = V.geometry, W = S.isMeshStandardMaterial ? k.environment : null, K = (S.isMeshStandardMaterial ? t : e).get(S.envMap || W), z = K && K.mapping === zr ? K.image.height : null, ne = g[S.type];
    S.precision !== null && (p = s.getMaxPrecision(S.precision), p !== S.precision && console.warn("THREE.WebGLProgram.getParameters:", S.precision, "not supported, using", p, "instead."));
    const ce = q.morphAttributes.position || q.morphAttributes.normal || q.morphAttributes.color, Me = ce !== void 0 ? ce.length : 0;
    let Ne = 0;
    q.morphAttributes.position !== void 0 && (Ne = 1), q.morphAttributes.normal !== void 0 && (Ne = 2), q.morphAttributes.color !== void 0 && (Ne = 3);
    let Ye, nt, We, X;
    if (ne) {
      const Ze = yn[ne];
      Ye = Ze.vertexShader, nt = Ze.fragmentShader;
    } else Ye = S.vertexShader, nt = S.fragmentShader, l.update(S), We = l.getVertexShaderID(S), X = l.getFragmentShaderID(S);
    const Z = i.getRenderTarget(), ue = i.state.buffers.depth.getReversed(), Re = V.isInstancedMesh === true, xe = V.isBatchedMesh === true, He = !!S.map, xt = !!S.matcap, A = !!K, lt = !!S.aoMap, Ie = !!S.lightMap, Pe = !!S.bumpMap, me = !!S.normalMap, ct = !!S.displacementMap, ge = !!S.emissiveMap, ke = !!S.metalnessMap, Et = !!S.roughnessMap, mt = S.anisotropy > 0, T = S.clearcoat > 0, x = S.dispersion > 0, F = S.iridescence > 0, G = S.sheen > 0, $ = S.transmission > 0, H = mt && !!S.anisotropyMap, Se = T && !!S.clearcoatMap, ie = T && !!S.clearcoatNormalMap, _e = T && !!S.clearcoatRoughnessMap, ve = F && !!S.iridescenceMap, ee = F && !!S.iridescenceThicknessMap, le = G && !!S.sheenColorMap, Ce = G && !!S.sheenRoughnessMap, ye = !!S.specularMap, ae = !!S.specularColorMap, Fe = !!S.specularIntensityMap, D = $ && !!S.transmissionMap, te = $ && !!S.thicknessMap, se = !!S.gradientMap, de = !!S.alphaMap, J = S.alphaTest > 0, Y = !!S.alphaHash, pe = !!S.extensions;
    let De = ri;
    S.toneMapped && (Z === null || Z.isXRRenderTarget === true) && (De = i.toneMapping);
    const st = { shaderID: ne, shaderType: S.type, shaderName: S.name, vertexShader: Ye, fragmentShader: nt, defines: S.defines, customVertexShaderID: We, customFragmentShaderID: X, isRawShaderMaterial: S.isRawShaderMaterial === true, glslVersion: S.glslVersion, precision: p, batching: xe, batchingColor: xe && V._colorsTexture !== null, instancing: Re, instancingColor: Re && V.instanceColor !== null, instancingMorph: Re && V.morphTexture !== null, supportsVertexTextures: d, outputColorSpace: Z === null ? i.outputColorSpace : Z.isXRRenderTarget === true ? Z.texture.colorSpace : Ct, alphaToCoverage: !!S.alphaToCoverage, map: He, matcap: xt, envMap: A, envMapMode: A && K.mapping, envMapCubeUVHeight: z, aoMap: lt, lightMap: Ie, bumpMap: Pe, normalMap: me, displacementMap: d && ct, emissiveMap: ge, normalMapObjectSpace: me && S.normalMapType === Vu, normalMapTangentSpace: me && S.normalMapType === qo, metalnessMap: ke, roughnessMap: Et, anisotropy: mt, anisotropyMap: H, clearcoat: T, clearcoatMap: Se, clearcoatNormalMap: ie, clearcoatRoughnessMap: _e, dispersion: x, iridescence: F, iridescenceMap: ve, iridescenceThicknessMap: ee, sheen: G, sheenColorMap: le, sheenRoughnessMap: Ce, specularMap: ye, specularColorMap: ae, specularIntensityMap: Fe, transmission: $, transmissionMap: D, thicknessMap: te, gradientMap: se, opaque: S.transparent === false && S.blending === $i && S.alphaToCoverage === false, alphaMap: de, alphaTest: J, alphaHash: Y, combine: S.combine, mapUv: He && _(S.map.channel), aoMapUv: lt && _(S.aoMap.channel), lightMapUv: Ie && _(S.lightMap.channel), bumpMapUv: Pe && _(S.bumpMap.channel), normalMapUv: me && _(S.normalMap.channel), displacementMapUv: ct && _(S.displacementMap.channel), emissiveMapUv: ge && _(S.emissiveMap.channel), metalnessMapUv: ke && _(S.metalnessMap.channel), roughnessMapUv: Et && _(S.roughnessMap.channel), anisotropyMapUv: H && _(S.anisotropyMap.channel), clearcoatMapUv: Se && _(S.clearcoatMap.channel), clearcoatNormalMapUv: ie && _(S.clearcoatNormalMap.channel), clearcoatRoughnessMapUv: _e && _(S.clearcoatRoughnessMap.channel), iridescenceMapUv: ve && _(S.iridescenceMap.channel), iridescenceThicknessMapUv: ee && _(S.iridescenceThicknessMap.channel), sheenColorMapUv: le && _(S.sheenColorMap.channel), sheenRoughnessMapUv: Ce && _(S.sheenRoughnessMap.channel), specularMapUv: ye && _(S.specularMap.channel), specularColorMapUv: ae && _(S.specularColorMap.channel), specularIntensityMapUv: Fe && _(S.specularIntensityMap.channel), transmissionMapUv: D && _(S.transmissionMap.channel), thicknessMapUv: te && _(S.thicknessMap.channel), alphaMapUv: de && _(S.alphaMap.channel), vertexTangents: !!q.attributes.tangent && (me || mt), vertexColors: S.vertexColors, vertexAlphas: S.vertexColors === true && !!q.attributes.color && q.attributes.color.itemSize === 4, pointsUvs: V.isPoints === true && !!q.attributes.uv && (He || de), fog: !!j, useFog: S.fog === true, fogExp2: !!j && j.isFogExp2, flatShading: S.flatShading === true && S.wireframe === false, sizeAttenuation: S.sizeAttenuation === true, logarithmicDepthBuffer: h, reversedDepthBuffer: ue, skinning: V.isSkinnedMesh === true, morphTargets: q.morphAttributes.position !== void 0, morphNormals: q.morphAttributes.normal !== void 0, morphColors: q.morphAttributes.color !== void 0, morphTargetsCount: Me, morphTextureStride: Ne, numDirLights: M.directional.length, numPointLights: M.point.length, numSpotLights: M.spot.length, numSpotLightMaps: M.spotLightMap.length, numRectAreaLights: M.rectArea.length, numHemiLights: M.hemi.length, numDirLightShadows: M.directionalShadowMap.length, numPointLightShadows: M.pointShadowMap.length, numSpotLightShadows: M.spotShadowMap.length, numSpotLightShadowsWithMaps: M.numSpotLightShadowsWithMaps, numLightProbes: M.numLightProbes, numClippingPlanes: a.numPlanes, numClipIntersection: a.numIntersection, dithering: S.dithering, shadowMapEnabled: i.shadowMap.enabled && P.length > 0, shadowMapType: i.shadowMap.type, toneMapping: De, decodeVideoTexture: He && S.map.isVideoTexture === true && qe.getTransfer(S.map.colorSpace) === et, decodeVideoTextureEmissive: ge && S.emissiveMap.isVideoTexture === true && qe.getTransfer(S.emissiveMap.colorSpace) === et, premultipliedAlpha: S.premultipliedAlpha, doubleSided: S.side === Mn, flipSided: S.side === Ut, useDepthPacking: S.depthPacking >= 0, depthPacking: S.depthPacking || 0, index0AttributeName: S.index0AttributeName, extensionClipCullDistance: pe && S.extensions.clipCullDistance === true && n.has("WEBGL_clip_cull_distance"), extensionMultiDraw: (pe && S.extensions.multiDraw === true || xe) && n.has("WEBGL_multi_draw"), rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"), customProgramCacheKey: S.customProgramCacheKey() };
    return st.vertexUv1s = c.has(1), st.vertexUv2s = c.has(2), st.vertexUv3s = c.has(3), c.clear(), st;
  }
  function f(S) {
    const M = [];
    if (S.shaderID ? M.push(S.shaderID) : (M.push(S.customVertexShaderID), M.push(S.customFragmentShaderID)), S.defines !== void 0) for (const P in S.defines) M.push(P), M.push(S.defines[P]);
    return S.isRawShaderMaterial === false && (b(M, S), E(M, S), M.push(i.outputColorSpace)), M.push(S.customProgramCacheKey), M.join();
  }
  function b(S, M) {
    S.push(M.precision), S.push(M.outputColorSpace), S.push(M.envMapMode), S.push(M.envMapCubeUVHeight), S.push(M.mapUv), S.push(M.alphaMapUv), S.push(M.lightMapUv), S.push(M.aoMapUv), S.push(M.bumpMapUv), S.push(M.normalMapUv), S.push(M.displacementMapUv), S.push(M.emissiveMapUv), S.push(M.metalnessMapUv), S.push(M.roughnessMapUv), S.push(M.anisotropyMapUv), S.push(M.clearcoatMapUv), S.push(M.clearcoatNormalMapUv), S.push(M.clearcoatRoughnessMapUv), S.push(M.iridescenceMapUv), S.push(M.iridescenceThicknessMapUv), S.push(M.sheenColorMapUv), S.push(M.sheenRoughnessMapUv), S.push(M.specularMapUv), S.push(M.specularColorMapUv), S.push(M.specularIntensityMapUv), S.push(M.transmissionMapUv), S.push(M.thicknessMapUv), S.push(M.combine), S.push(M.fogExp2), S.push(M.sizeAttenuation), S.push(M.morphTargetsCount), S.push(M.morphAttributeCount), S.push(M.numDirLights), S.push(M.numPointLights), S.push(M.numSpotLights), S.push(M.numSpotLightMaps), S.push(M.numHemiLights), S.push(M.numRectAreaLights), S.push(M.numDirLightShadows), S.push(M.numPointLightShadows), S.push(M.numSpotLightShadows), S.push(M.numSpotLightShadowsWithMaps), S.push(M.numLightProbes), S.push(M.shadowMapType), S.push(M.toneMapping), S.push(M.numClippingPlanes), S.push(M.numClipIntersection), S.push(M.depthPacking);
  }
  function E(S, M) {
    o.disableAll(), M.supportsVertexTextures && o.enable(0), M.instancing && o.enable(1), M.instancingColor && o.enable(2), M.instancingMorph && o.enable(3), M.matcap && o.enable(4), M.envMap && o.enable(5), M.normalMapObjectSpace && o.enable(6), M.normalMapTangentSpace && o.enable(7), M.clearcoat && o.enable(8), M.iridescence && o.enable(9), M.alphaTest && o.enable(10), M.vertexColors && o.enable(11), M.vertexAlphas && o.enable(12), M.vertexUv1s && o.enable(13), M.vertexUv2s && o.enable(14), M.vertexUv3s && o.enable(15), M.vertexTangents && o.enable(16), M.anisotropy && o.enable(17), M.alphaHash && o.enable(18), M.batching && o.enable(19), M.dispersion && o.enable(20), M.batchingColor && o.enable(21), M.gradientMap && o.enable(22), S.push(o.mask), o.disableAll(), M.fog && o.enable(0), M.useFog && o.enable(1), M.flatShading && o.enable(2), M.logarithmicDepthBuffer && o.enable(3), M.reversedDepthBuffer && o.enable(4), M.skinning && o.enable(5), M.morphTargets && o.enable(6), M.morphNormals && o.enable(7), M.morphColors && o.enable(8), M.premultipliedAlpha && o.enable(9), M.shadowMapEnabled && o.enable(10), M.doubleSided && o.enable(11), M.flipSided && o.enable(12), M.useDepthPacking && o.enable(13), M.dithering && o.enable(14), M.transmission && o.enable(15), M.sheen && o.enable(16), M.opaque && o.enable(17), M.pointsUvs && o.enable(18), M.decodeVideoTexture && o.enable(19), M.decodeVideoTextureEmissive && o.enable(20), M.alphaToCoverage && o.enable(21), S.push(o.mask);
  }
  function y(S) {
    const M = g[S.type];
    let P;
    if (M) {
      const k = yn[M];
      P = Fd.clone(k.uniforms);
    } else P = S.uniforms;
    return P;
  }
  function w(S, M) {
    let P;
    for (let k = 0, V = u.length; k < V; k++) {
      const j = u[k];
      if (j.cacheKey === M) {
        P = j, ++P.usedTimes;
        break;
      }
    }
    return P === void 0 && (P = new V_(i, M, S, r), u.push(P)), P;
  }
  function C(S) {
    if (--S.usedTimes === 0) {
      const M = u.indexOf(S);
      u[M] = u[u.length - 1], u.pop(), S.destroy();
    }
  }
  function R(S) {
    l.remove(S);
  }
  function N() {
    l.dispose();
  }
  return { getParameters: m, getProgramCacheKey: f, getUniforms: y, acquireProgram: w, releaseProgram: C, releaseShaderCache: R, programs: u, dispose: N };
}
function Y_() {
  let i = /* @__PURE__ */ new WeakMap();
  function e(a) {
    return i.has(a);
  }
  function t(a) {
    let o = i.get(a);
    return o === void 0 && (o = {}, i.set(a, o)), o;
  }
  function n(a) {
    i.delete(a);
  }
  function s(a, o, l) {
    i.get(a)[o] = l;
  }
  function r() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return { has: e, get: t, remove: n, update: s, dispose: r };
}
function j_(i, e) {
  return i.groupOrder !== e.groupOrder ? i.groupOrder - e.groupOrder : i.renderOrder !== e.renderOrder ? i.renderOrder - e.renderOrder : i.material.id !== e.material.id ? i.material.id - e.material.id : i.z !== e.z ? i.z - e.z : i.id - e.id;
}
function Ic(i, e) {
  return i.groupOrder !== e.groupOrder ? i.groupOrder - e.groupOrder : i.renderOrder !== e.renderOrder ? i.renderOrder - e.renderOrder : i.z !== e.z ? e.z - i.z : i.id - e.id;
}
function Uc() {
  const i = [];
  let e = 0;
  const t = [], n = [], s = [];
  function r() {
    e = 0, t.length = 0, n.length = 0, s.length = 0;
  }
  function a(h, d, p, g, _, m) {
    let f = i[e];
    return f === void 0 ? (f = { id: h.id, object: h, geometry: d, material: p, groupOrder: g, renderOrder: h.renderOrder, z: _, group: m }, i[e] = f) : (f.id = h.id, f.object = h, f.geometry = d, f.material = p, f.groupOrder = g, f.renderOrder = h.renderOrder, f.z = _, f.group = m), e++, f;
  }
  function o(h, d, p, g, _, m) {
    const f = a(h, d, p, g, _, m);
    p.transmission > 0 ? n.push(f) : p.transparent === true ? s.push(f) : t.push(f);
  }
  function l(h, d, p, g, _, m) {
    const f = a(h, d, p, g, _, m);
    p.transmission > 0 ? n.unshift(f) : p.transparent === true ? s.unshift(f) : t.unshift(f);
  }
  function c(h, d) {
    t.length > 1 && t.sort(h || j_), n.length > 1 && n.sort(d || Ic), s.length > 1 && s.sort(d || Ic);
  }
  function u() {
    for (let h = e, d = i.length; h < d; h++) {
      const p = i[h];
      if (p.id === null) break;
      p.id = null, p.object = null, p.geometry = null, p.material = null, p.group = null;
    }
  }
  return { opaque: t, transmissive: n, transparent: s, init: r, push: o, unshift: l, finish: u, sort: c };
}
function K_() {
  let i = /* @__PURE__ */ new WeakMap();
  function e(n, s) {
    const r = i.get(n);
    let a;
    return r === void 0 ? (a = new Uc(), i.set(n, [a])) : s >= r.length ? (a = new Uc(), r.push(a)) : a = r[s], a;
  }
  function t() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return { get: e, dispose: t };
}
function Z_() {
  const i = {};
  return { get: function(e) {
    if (i[e.id] !== void 0) return i[e.id];
    let t;
    switch (e.type) {
      case "DirectionalLight":
        t = { direction: new L(), color: new we() };
        break;
      case "SpotLight":
        t = { position: new L(), direction: new L(), color: new we(), distance: 0, coneCos: 0, penumbraCos: 0, decay: 0 };
        break;
      case "PointLight":
        t = { position: new L(), color: new we(), distance: 0, decay: 0 };
        break;
      case "HemisphereLight":
        t = { direction: new L(), skyColor: new we(), groundColor: new we() };
        break;
      case "RectAreaLight":
        t = { color: new we(), position: new L(), halfWidth: new L(), halfHeight: new L() };
        break;
    }
    return i[e.id] = t, t;
  } };
}
function $_() {
  const i = {};
  return { get: function(e) {
    if (i[e.id] !== void 0) return i[e.id];
    let t;
    switch (e.type) {
      case "DirectionalLight":
        t = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new Ee() };
        break;
      case "SpotLight":
        t = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new Ee() };
        break;
      case "PointLight":
        t = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new Ee(), shadowCameraNear: 1, shadowCameraFar: 1e3 };
        break;
    }
    return i[e.id] = t, t;
  } };
}
let J_ = 0;
function Q_(i, e) {
  return (e.castShadow ? 2 : 0) - (i.castShadow ? 2 : 0) + (e.map ? 1 : 0) - (i.map ? 1 : 0);
}
function e0(i) {
  const e = new Z_(), t = $_(), n = { version: 0, hash: { directionalLength: -1, pointLength: -1, spotLength: -1, rectAreaLength: -1, hemiLength: -1, numDirectionalShadows: -1, numPointShadows: -1, numSpotShadows: -1, numSpotMaps: -1, numLightProbes: -1 }, ambient: [0, 0, 0], probe: [], directional: [], directionalShadow: [], directionalShadowMap: [], directionalShadowMatrix: [], spot: [], spotLightMap: [], spotShadow: [], spotShadowMap: [], spotLightMatrix: [], rectArea: [], rectAreaLTC1: null, rectAreaLTC2: null, point: [], pointShadow: [], pointShadowMap: [], pointShadowMatrix: [], hemi: [], numSpotLightShadowsWithMaps: 0, numLightProbes: 0 };
  for (let c = 0; c < 9; c++) n.probe.push(new L());
  const s = new L(), r = new Be(), a = new Be();
  function o(c) {
    let u = 0, h = 0, d = 0;
    for (let S = 0; S < 9; S++) n.probe[S].set(0, 0, 0);
    let p = 0, g = 0, _ = 0, m = 0, f = 0, b = 0, E = 0, y = 0, w = 0, C = 0, R = 0;
    c.sort(Q_);
    for (let S = 0, M = c.length; S < M; S++) {
      const P = c[S], k = P.color, V = P.intensity, j = P.distance, q = P.shadow && P.shadow.map ? P.shadow.map.texture : null;
      if (P.isAmbientLight) u += k.r * V, h += k.g * V, d += k.b * V;
      else if (P.isLightProbe) {
        for (let W = 0; W < 9; W++) n.probe[W].addScaledVector(P.sh.coefficients[W], V);
        R++;
      } else if (P.isDirectionalLight) {
        const W = e.get(P);
        if (W.color.copy(P.color).multiplyScalar(P.intensity), P.castShadow) {
          const K = P.shadow, z = t.get(P);
          z.shadowIntensity = K.intensity, z.shadowBias = K.bias, z.shadowNormalBias = K.normalBias, z.shadowRadius = K.radius, z.shadowMapSize = K.mapSize, n.directionalShadow[p] = z, n.directionalShadowMap[p] = q, n.directionalShadowMatrix[p] = P.shadow.matrix, b++;
        }
        n.directional[p] = W, p++;
      } else if (P.isSpotLight) {
        const W = e.get(P);
        W.position.setFromMatrixPosition(P.matrixWorld), W.color.copy(k).multiplyScalar(V), W.distance = j, W.coneCos = Math.cos(P.angle), W.penumbraCos = Math.cos(P.angle * (1 - P.penumbra)), W.decay = P.decay, n.spot[_] = W;
        const K = P.shadow;
        if (P.map && (n.spotLightMap[w] = P.map, w++, K.updateMatrices(P), P.castShadow && C++), n.spotLightMatrix[_] = K.matrix, P.castShadow) {
          const z = t.get(P);
          z.shadowIntensity = K.intensity, z.shadowBias = K.bias, z.shadowNormalBias = K.normalBias, z.shadowRadius = K.radius, z.shadowMapSize = K.mapSize, n.spotShadow[_] = z, n.spotShadowMap[_] = q, y++;
        }
        _++;
      } else if (P.isRectAreaLight) {
        const W = e.get(P);
        W.color.copy(k).multiplyScalar(V), W.halfWidth.set(P.width * 0.5, 0, 0), W.halfHeight.set(0, P.height * 0.5, 0), n.rectArea[m] = W, m++;
      } else if (P.isPointLight) {
        const W = e.get(P);
        if (W.color.copy(P.color).multiplyScalar(P.intensity), W.distance = P.distance, W.decay = P.decay, P.castShadow) {
          const K = P.shadow, z = t.get(P);
          z.shadowIntensity = K.intensity, z.shadowBias = K.bias, z.shadowNormalBias = K.normalBias, z.shadowRadius = K.radius, z.shadowMapSize = K.mapSize, z.shadowCameraNear = K.camera.near, z.shadowCameraFar = K.camera.far, n.pointShadow[g] = z, n.pointShadowMap[g] = q, n.pointShadowMatrix[g] = P.shadow.matrix, E++;
        }
        n.point[g] = W, g++;
      } else if (P.isHemisphereLight) {
        const W = e.get(P);
        W.skyColor.copy(P.color).multiplyScalar(V), W.groundColor.copy(P.groundColor).multiplyScalar(V), n.hemi[f] = W, f++;
      }
    }
    m > 0 && (i.has("OES_texture_float_linear") === true ? (n.rectAreaLTC1 = re.LTC_FLOAT_1, n.rectAreaLTC2 = re.LTC_FLOAT_2) : (n.rectAreaLTC1 = re.LTC_HALF_1, n.rectAreaLTC2 = re.LTC_HALF_2)), n.ambient[0] = u, n.ambient[1] = h, n.ambient[2] = d;
    const N = n.hash;
    (N.directionalLength !== p || N.pointLength !== g || N.spotLength !== _ || N.rectAreaLength !== m || N.hemiLength !== f || N.numDirectionalShadows !== b || N.numPointShadows !== E || N.numSpotShadows !== y || N.numSpotMaps !== w || N.numLightProbes !== R) && (n.directional.length = p, n.spot.length = _, n.rectArea.length = m, n.point.length = g, n.hemi.length = f, n.directionalShadow.length = b, n.directionalShadowMap.length = b, n.pointShadow.length = E, n.pointShadowMap.length = E, n.spotShadow.length = y, n.spotShadowMap.length = y, n.directionalShadowMatrix.length = b, n.pointShadowMatrix.length = E, n.spotLightMatrix.length = y + w - C, n.spotLightMap.length = w, n.numSpotLightShadowsWithMaps = C, n.numLightProbes = R, N.directionalLength = p, N.pointLength = g, N.spotLength = _, N.rectAreaLength = m, N.hemiLength = f, N.numDirectionalShadows = b, N.numPointShadows = E, N.numSpotShadows = y, N.numSpotMaps = w, N.numLightProbes = R, n.version = J_++);
  }
  function l(c, u) {
    let h = 0, d = 0, p = 0, g = 0, _ = 0;
    const m = u.matrixWorldInverse;
    for (let f = 0, b = c.length; f < b; f++) {
      const E = c[f];
      if (E.isDirectionalLight) {
        const y = n.directional[h];
        y.direction.setFromMatrixPosition(E.matrixWorld), s.setFromMatrixPosition(E.target.matrixWorld), y.direction.sub(s), y.direction.transformDirection(m), h++;
      } else if (E.isSpotLight) {
        const y = n.spot[p];
        y.position.setFromMatrixPosition(E.matrixWorld), y.position.applyMatrix4(m), y.direction.setFromMatrixPosition(E.matrixWorld), s.setFromMatrixPosition(E.target.matrixWorld), y.direction.sub(s), y.direction.transformDirection(m), p++;
      } else if (E.isRectAreaLight) {
        const y = n.rectArea[g];
        y.position.setFromMatrixPosition(E.matrixWorld), y.position.applyMatrix4(m), a.identity(), r.copy(E.matrixWorld), r.premultiply(m), a.extractRotation(r), y.halfWidth.set(E.width * 0.5, 0, 0), y.halfHeight.set(0, E.height * 0.5, 0), y.halfWidth.applyMatrix4(a), y.halfHeight.applyMatrix4(a), g++;
      } else if (E.isPointLight) {
        const y = n.point[d];
        y.position.setFromMatrixPosition(E.matrixWorld), y.position.applyMatrix4(m), d++;
      } else if (E.isHemisphereLight) {
        const y = n.hemi[_];
        y.direction.setFromMatrixPosition(E.matrixWorld), y.direction.transformDirection(m), _++;
      }
    }
  }
  return { setup: o, setupView: l, state: n };
}
function Nc(i) {
  const e = new e0(i), t = [], n = [];
  function s(u) {
    c.camera = u, t.length = 0, n.length = 0;
  }
  function r(u) {
    t.push(u);
  }
  function a(u) {
    n.push(u);
  }
  function o() {
    e.setup(t);
  }
  function l(u) {
    e.setupView(t, u);
  }
  const c = { lightsArray: t, shadowsArray: n, camera: null, lights: e, transmissionRenderTarget: {} };
  return { init: s, state: c, setupLights: o, setupLightsView: l, pushLight: r, pushShadow: a };
}
function t0(i) {
  let e = /* @__PURE__ */ new WeakMap();
  function t(s, r = 0) {
    const a = e.get(s);
    let o;
    return a === void 0 ? (o = new Nc(i), e.set(s, [o])) : r >= a.length ? (o = new Nc(i), a.push(o)) : o = a[r], o;
  }
  function n() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return { get: t, dispose: n };
}
const n0 = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, i0 = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function s0(i, e, t) {
  let n = new Jo();
  const s = new Ee(), r = new Ee(), a = new Ke(), o = new ef({ depthPacking: Hu }), l = new tf(), c = {}, u = t.maxTextureSize, h = { [Vn]: Ut, [Ut]: Vn, [Mn]: Mn }, d = new ai({ defines: { VSM_SAMPLES: 8 }, uniforms: { shadow_pass: { value: null }, resolution: { value: new Ee() }, radius: { value: 4 } }, vertexShader: n0, fragmentShader: i0 }), p = d.clone();
  p.defines.HORIZONTAL_PASS = 1;
  const g = new wn();
  g.setAttribute("position", new Ft(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3));
  const _ = new _t(g, d), m = this;
  this.enabled = false, this.autoUpdate = true, this.needsUpdate = false, this.type = Jc;
  let f = this.type;
  this.render = function(C, R, N) {
    if (m.enabled === false || m.autoUpdate === false && m.needsUpdate === false || C.length === 0) return;
    const S = i.getRenderTarget(), M = i.getActiveCubeFace(), P = i.getActiveMipmapLevel(), k = i.state;
    k.setBlending(si), k.buffers.depth.getReversed() === true ? k.buffers.color.setClear(0, 0, 0, 0) : k.buffers.color.setClear(1, 1, 1, 1), k.buffers.depth.setTest(true), k.setScissorTest(false);
    const V = f !== Nn && this.type === Nn, j = f === Nn && this.type !== Nn;
    for (let q = 0, W = C.length; q < W; q++) {
      const K = C[q], z = K.shadow;
      if (z === void 0) {
        console.warn("THREE.WebGLShadowMap:", K, "has no shadow.");
        continue;
      }
      if (z.autoUpdate === false && z.needsUpdate === false) continue;
      s.copy(z.mapSize);
      const ne = z.getFrameExtents();
      if (s.multiply(ne), r.copy(z.mapSize), (s.x > u || s.y > u) && (s.x > u && (r.x = Math.floor(u / ne.x), s.x = r.x * ne.x, z.mapSize.x = r.x), s.y > u && (r.y = Math.floor(u / ne.y), s.y = r.y * ne.y, z.mapSize.y = r.y)), z.map === null || V === true || j === true) {
        const Me = this.type !== Nn ? { minFilter: Nt, magFilter: Nt } : {};
        z.map !== null && z.map.dispose(), z.map = new bi(s.x, s.y, Me), z.map.texture.name = K.name + ".shadowMap", z.camera.updateProjectionMatrix();
      }
      i.setRenderTarget(z.map), i.clear();
      const ce = z.getViewportCount();
      for (let Me = 0; Me < ce; Me++) {
        const Ne = z.getViewport(Me);
        a.set(r.x * Ne.x, r.y * Ne.y, r.x * Ne.z, r.y * Ne.w), k.viewport(a), z.updateMatrices(K, Me), n = z.getFrustum(), y(R, N, z.camera, K, this.type);
      }
      z.isPointLightShadow !== true && this.type === Nn && b(z, N), z.needsUpdate = false;
    }
    f = this.type, m.needsUpdate = false, i.setRenderTarget(S, M, P);
  };
  function b(C, R) {
    const N = e.update(_);
    d.defines.VSM_SAMPLES !== C.blurSamples && (d.defines.VSM_SAMPLES = C.blurSamples, p.defines.VSM_SAMPLES = C.blurSamples, d.needsUpdate = true, p.needsUpdate = true), C.mapPass === null && (C.mapPass = new bi(s.x, s.y)), d.uniforms.shadow_pass.value = C.map.texture, d.uniforms.resolution.value = C.mapSize, d.uniforms.radius.value = C.radius, i.setRenderTarget(C.mapPass), i.clear(), i.renderBufferDirect(R, null, N, d, _, null), p.uniforms.shadow_pass.value = C.mapPass.texture, p.uniforms.resolution.value = C.mapSize, p.uniforms.radius.value = C.radius, i.setRenderTarget(C.map), i.clear(), i.renderBufferDirect(R, null, N, p, _, null);
  }
  function E(C, R, N, S) {
    let M = null;
    const P = N.isPointLight === true ? C.customDistanceMaterial : C.customDepthMaterial;
    if (P !== void 0) M = P;
    else if (M = N.isPointLight === true ? l : o, i.localClippingEnabled && R.clipShadows === true && Array.isArray(R.clippingPlanes) && R.clippingPlanes.length !== 0 || R.displacementMap && R.displacementScale !== 0 || R.alphaMap && R.alphaTest > 0 || R.map && R.alphaTest > 0 || R.alphaToCoverage === true) {
      const k = M.uuid, V = R.uuid;
      let j = c[k];
      j === void 0 && (j = {}, c[k] = j);
      let q = j[V];
      q === void 0 && (q = M.clone(), j[V] = q, R.addEventListener("dispose", w)), M = q;
    }
    if (M.visible = R.visible, M.wireframe = R.wireframe, S === Nn ? M.side = R.shadowSide !== null ? R.shadowSide : R.side : M.side = R.shadowSide !== null ? R.shadowSide : h[R.side], M.alphaMap = R.alphaMap, M.alphaTest = R.alphaToCoverage === true ? 0.5 : R.alphaTest, M.map = R.map, M.clipShadows = R.clipShadows, M.clippingPlanes = R.clippingPlanes, M.clipIntersection = R.clipIntersection, M.displacementMap = R.displacementMap, M.displacementScale = R.displacementScale, M.displacementBias = R.displacementBias, M.wireframeLinewidth = R.wireframeLinewidth, M.linewidth = R.linewidth, N.isPointLight === true && M.isMeshDistanceMaterial === true) {
      const k = i.properties.get(M);
      k.light = N;
    }
    return M;
  }
  function y(C, R, N, S, M) {
    if (C.visible === false) return;
    if (C.layers.test(R.layers) && (C.isMesh || C.isLine || C.isPoints) && (C.castShadow || C.receiveShadow && M === Nn) && (!C.frustumCulled || n.intersectsObject(C))) {
      C.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse, C.matrixWorld);
      const V = e.update(C), j = C.material;
      if (Array.isArray(j)) {
        const q = V.groups;
        for (let W = 0, K = q.length; W < K; W++) {
          const z = q[W], ne = j[z.materialIndex];
          if (ne && ne.visible) {
            const ce = E(C, ne, S, M);
            C.onBeforeShadow(i, C, R, N, V, ce, z), i.renderBufferDirect(N, null, V, ce, C, z), C.onAfterShadow(i, C, R, N, V, ce, z);
          }
        }
      } else if (j.visible) {
        const q = E(C, j, S, M);
        C.onBeforeShadow(i, C, R, N, V, q, null), i.renderBufferDirect(N, null, V, q, C, null), C.onAfterShadow(i, C, R, N, V, q, null);
      }
    }
    const k = C.children;
    for (let V = 0, j = k.length; V < j; V++) y(k[V], R, N, S, M);
  }
  function w(C) {
    C.target.removeEventListener("dispose", w);
    for (const N in c) {
      const S = c[N], M = C.target.uuid;
      M in S && (S[M].dispose(), delete S[M]);
    }
  }
}
const r0 = { [Ba]: ka, [za]: Ga, [Ha]: Wa, [es]: Va, [ka]: Ba, [Ga]: za, [Wa]: Ha, [Va]: es };
function a0(i, e) {
  function t() {
    let D = false;
    const te = new Ke();
    let se = null;
    const de = new Ke(0, 0, 0, 0);
    return { setMask: function(J) {
      se !== J && !D && (i.colorMask(J, J, J, J), se = J);
    }, setLocked: function(J) {
      D = J;
    }, setClear: function(J, Y, pe, De, st) {
      st === true && (J *= De, Y *= De, pe *= De), te.set(J, Y, pe, De), de.equals(te) === false && (i.clearColor(J, Y, pe, De), de.copy(te));
    }, reset: function() {
      D = false, se = null, de.set(-1, 0, 0, 0);
    } };
  }
  function n() {
    let D = false, te = false, se = null, de = null, J = null;
    return { setReversed: function(Y) {
      if (te !== Y) {
        const pe = e.get("EXT_clip_control");
        Y ? pe.clipControlEXT(pe.LOWER_LEFT_EXT, pe.ZERO_TO_ONE_EXT) : pe.clipControlEXT(pe.LOWER_LEFT_EXT, pe.NEGATIVE_ONE_TO_ONE_EXT), te = Y;
        const De = J;
        J = null, this.setClear(De);
      }
    }, getReversed: function() {
      return te;
    }, setTest: function(Y) {
      Y ? Z(i.DEPTH_TEST) : ue(i.DEPTH_TEST);
    }, setMask: function(Y) {
      se !== Y && !D && (i.depthMask(Y), se = Y);
    }, setFunc: function(Y) {
      if (te && (Y = r0[Y]), de !== Y) {
        switch (Y) {
          case Ba:
            i.depthFunc(i.NEVER);
            break;
          case ka:
            i.depthFunc(i.ALWAYS);
            break;
          case za:
            i.depthFunc(i.LESS);
            break;
          case es:
            i.depthFunc(i.LEQUAL);
            break;
          case Ha:
            i.depthFunc(i.EQUAL);
            break;
          case Va:
            i.depthFunc(i.GEQUAL);
            break;
          case Ga:
            i.depthFunc(i.GREATER);
            break;
          case Wa:
            i.depthFunc(i.NOTEQUAL);
            break;
          default:
            i.depthFunc(i.LEQUAL);
        }
        de = Y;
      }
    }, setLocked: function(Y) {
      D = Y;
    }, setClear: function(Y) {
      J !== Y && (te && (Y = 1 - Y), i.clearDepth(Y), J = Y);
    }, reset: function() {
      D = false, se = null, de = null, J = null, te = false;
    } };
  }
  function s() {
    let D = false, te = null, se = null, de = null, J = null, Y = null, pe = null, De = null, st = null;
    return { setTest: function(Ze) {
      D || (Ze ? Z(i.STENCIL_TEST) : ue(i.STENCIL_TEST));
    }, setMask: function(Ze) {
      te !== Ze && !D && (i.stencilMask(Ze), te = Ze);
    }, setFunc: function(Ze, Rn, gn) {
      (se !== Ze || de !== Rn || J !== gn) && (i.stencilFunc(Ze, Rn, gn), se = Ze, de = Rn, J = gn);
    }, setOp: function(Ze, Rn, gn) {
      (Y !== Ze || pe !== Rn || De !== gn) && (i.stencilOp(Ze, Rn, gn), Y = Ze, pe = Rn, De = gn);
    }, setLocked: function(Ze) {
      D = Ze;
    }, setClear: function(Ze) {
      st !== Ze && (i.clearStencil(Ze), st = Ze);
    }, reset: function() {
      D = false, te = null, se = null, de = null, J = null, Y = null, pe = null, De = null, st = null;
    } };
  }
  const r = new t(), a = new n(), o = new s(), l = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap();
  let u = {}, h = {}, d = /* @__PURE__ */ new WeakMap(), p = [], g = null, _ = false, m = null, f = null, b = null, E = null, y = null, w = null, C = null, R = new we(0, 0, 0), N = 0, S = false, M = null, P = null, k = null, V = null, j = null;
  const q = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let W = false, K = 0;
  const z = i.getParameter(i.VERSION);
  z.indexOf("WebGL") !== -1 ? (K = parseFloat(/^WebGL (\d)/.exec(z)[1]), W = K >= 1) : z.indexOf("OpenGL ES") !== -1 && (K = parseFloat(/^OpenGL ES (\d)/.exec(z)[1]), W = K >= 2);
  let ne = null, ce = {};
  const Me = i.getParameter(i.SCISSOR_BOX), Ne = i.getParameter(i.VIEWPORT), Ye = new Ke().fromArray(Me), nt = new Ke().fromArray(Ne);
  function We(D, te, se, de) {
    const J = new Uint8Array(4), Y = i.createTexture();
    i.bindTexture(D, Y), i.texParameteri(D, i.TEXTURE_MIN_FILTER, i.NEAREST), i.texParameteri(D, i.TEXTURE_MAG_FILTER, i.NEAREST);
    for (let pe = 0; pe < se; pe++) D === i.TEXTURE_3D || D === i.TEXTURE_2D_ARRAY ? i.texImage3D(te, 0, i.RGBA, 1, 1, de, 0, i.RGBA, i.UNSIGNED_BYTE, J) : i.texImage2D(te + pe, 0, i.RGBA, 1, 1, 0, i.RGBA, i.UNSIGNED_BYTE, J);
    return Y;
  }
  const X = {};
  X[i.TEXTURE_2D] = We(i.TEXTURE_2D, i.TEXTURE_2D, 1), X[i.TEXTURE_CUBE_MAP] = We(i.TEXTURE_CUBE_MAP, i.TEXTURE_CUBE_MAP_POSITIVE_X, 6), X[i.TEXTURE_2D_ARRAY] = We(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1), X[i.TEXTURE_3D] = We(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1), r.setClear(0, 0, 0, 1), a.setClear(1), o.setClear(0), Z(i.DEPTH_TEST), a.setFunc(es), Pe(false), me(gl), Z(i.CULL_FACE), lt(si);
  function Z(D) {
    u[D] !== true && (i.enable(D), u[D] = true);
  }
  function ue(D) {
    u[D] !== false && (i.disable(D), u[D] = false);
  }
  function Re(D, te) {
    return h[D] !== te ? (i.bindFramebuffer(D, te), h[D] = te, D === i.DRAW_FRAMEBUFFER && (h[i.FRAMEBUFFER] = te), D === i.FRAMEBUFFER && (h[i.DRAW_FRAMEBUFFER] = te), true) : false;
  }
  function xe(D, te) {
    let se = p, de = false;
    if (D) {
      se = d.get(te), se === void 0 && (se = [], d.set(te, se));
      const J = D.textures;
      if (se.length !== J.length || se[0] !== i.COLOR_ATTACHMENT0) {
        for (let Y = 0, pe = J.length; Y < pe; Y++) se[Y] = i.COLOR_ATTACHMENT0 + Y;
        se.length = J.length, de = true;
      }
    } else se[0] !== i.BACK && (se[0] = i.BACK, de = true);
    de && i.drawBuffers(se);
  }
  function He(D) {
    return g !== D ? (i.useProgram(D), g = D, true) : false;
  }
  const xt = { [vi]: i.FUNC_ADD, [du]: i.FUNC_SUBTRACT, [fu]: i.FUNC_REVERSE_SUBTRACT };
  xt[pu] = i.MIN, xt[mu] = i.MAX;
  const A = { [gu]: i.ZERO, [_u]: i.ONE, [xu]: i.SRC_COLOR, [Fa]: i.SRC_ALPHA, [Tu]: i.SRC_ALPHA_SATURATE, [Su]: i.DST_COLOR, [yu]: i.DST_ALPHA, [vu]: i.ONE_MINUS_SRC_COLOR, [Oa]: i.ONE_MINUS_SRC_ALPHA, [Eu]: i.ONE_MINUS_DST_COLOR, [Mu]: i.ONE_MINUS_DST_ALPHA, [bu]: i.CONSTANT_COLOR, [Au]: i.ONE_MINUS_CONSTANT_COLOR, [wu]: i.CONSTANT_ALPHA, [Ru]: i.ONE_MINUS_CONSTANT_ALPHA };
  function lt(D, te, se, de, J, Y, pe, De, st, Ze) {
    if (D === si) {
      _ === true && (ue(i.BLEND), _ = false);
      return;
    }
    if (_ === false && (Z(i.BLEND), _ = true), D !== uu) {
      if (D !== m || Ze !== S) {
        if ((f !== vi || y !== vi) && (i.blendEquation(i.FUNC_ADD), f = vi, y = vi), Ze) switch (D) {
          case $i:
            i.blendFuncSeparate(i.ONE, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
            break;
          case _l:
            i.blendFunc(i.ONE, i.ONE);
            break;
          case xl:
            i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
            break;
          case vl:
            i.blendFuncSeparate(i.DST_COLOR, i.ONE_MINUS_SRC_ALPHA, i.ZERO, i.ONE);
            break;
          default:
            console.error("THREE.WebGLState: Invalid blending: ", D);
            break;
        }
        else switch (D) {
          case $i:
            i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
            break;
          case _l:
            i.blendFuncSeparate(i.SRC_ALPHA, i.ONE, i.ONE, i.ONE);
            break;
          case xl:
            console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");
            break;
          case vl:
            console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");
            break;
          default:
            console.error("THREE.WebGLState: Invalid blending: ", D);
            break;
        }
        b = null, E = null, w = null, C = null, R.set(0, 0, 0), N = 0, m = D, S = Ze;
      }
      return;
    }
    J = J || te, Y = Y || se, pe = pe || de, (te !== f || J !== y) && (i.blendEquationSeparate(xt[te], xt[J]), f = te, y = J), (se !== b || de !== E || Y !== w || pe !== C) && (i.blendFuncSeparate(A[se], A[de], A[Y], A[pe]), b = se, E = de, w = Y, C = pe), (De.equals(R) === false || st !== N) && (i.blendColor(De.r, De.g, De.b, st), R.copy(De), N = st), m = D, S = false;
  }
  function Ie(D, te) {
    D.side === Mn ? ue(i.CULL_FACE) : Z(i.CULL_FACE);
    let se = D.side === Ut;
    te && (se = !se), Pe(se), D.blending === $i && D.transparent === false ? lt(si) : lt(D.blending, D.blendEquation, D.blendSrc, D.blendDst, D.blendEquationAlpha, D.blendSrcAlpha, D.blendDstAlpha, D.blendColor, D.blendAlpha, D.premultipliedAlpha), a.setFunc(D.depthFunc), a.setTest(D.depthTest), a.setMask(D.depthWrite), r.setMask(D.colorWrite);
    const de = D.stencilWrite;
    o.setTest(de), de && (o.setMask(D.stencilWriteMask), o.setFunc(D.stencilFunc, D.stencilRef, D.stencilFuncMask), o.setOp(D.stencilFail, D.stencilZFail, D.stencilZPass)), ge(D.polygonOffset, D.polygonOffsetFactor, D.polygonOffsetUnits), D.alphaToCoverage === true ? Z(i.SAMPLE_ALPHA_TO_COVERAGE) : ue(i.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function Pe(D) {
    M !== D && (D ? i.frontFace(i.CW) : i.frontFace(i.CCW), M = D);
  }
  function me(D) {
    D !== cu ? (Z(i.CULL_FACE), D !== P && (D === gl ? i.cullFace(i.BACK) : D === hu ? i.cullFace(i.FRONT) : i.cullFace(i.FRONT_AND_BACK))) : ue(i.CULL_FACE), P = D;
  }
  function ct(D) {
    D !== k && (W && i.lineWidth(D), k = D);
  }
  function ge(D, te, se) {
    D ? (Z(i.POLYGON_OFFSET_FILL), (V !== te || j !== se) && (i.polygonOffset(te, se), V = te, j = se)) : ue(i.POLYGON_OFFSET_FILL);
  }
  function ke(D) {
    D ? Z(i.SCISSOR_TEST) : ue(i.SCISSOR_TEST);
  }
  function Et(D) {
    D === void 0 && (D = i.TEXTURE0 + q - 1), ne !== D && (i.activeTexture(D), ne = D);
  }
  function mt(D, te, se) {
    se === void 0 && (ne === null ? se = i.TEXTURE0 + q - 1 : se = ne);
    let de = ce[se];
    de === void 0 && (de = { type: void 0, texture: void 0 }, ce[se] = de), (de.type !== D || de.texture !== te) && (ne !== se && (i.activeTexture(se), ne = se), i.bindTexture(D, te || X[D]), de.type = D, de.texture = te);
  }
  function T() {
    const D = ce[ne];
    D !== void 0 && D.type !== void 0 && (i.bindTexture(D.type, null), D.type = void 0, D.texture = void 0);
  }
  function x() {
    try {
      i.compressedTexImage2D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function F() {
    try {
      i.compressedTexImage3D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function G() {
    try {
      i.texSubImage2D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function $() {
    try {
      i.texSubImage3D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function H() {
    try {
      i.compressedTexSubImage2D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function Se() {
    try {
      i.compressedTexSubImage3D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function ie() {
    try {
      i.texStorage2D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function _e() {
    try {
      i.texStorage3D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function ve() {
    try {
      i.texImage2D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function ee() {
    try {
      i.texImage3D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function le(D) {
    Ye.equals(D) === false && (i.scissor(D.x, D.y, D.z, D.w), Ye.copy(D));
  }
  function Ce(D) {
    nt.equals(D) === false && (i.viewport(D.x, D.y, D.z, D.w), nt.copy(D));
  }
  function ye(D, te) {
    let se = c.get(te);
    se === void 0 && (se = /* @__PURE__ */ new WeakMap(), c.set(te, se));
    let de = se.get(D);
    de === void 0 && (de = i.getUniformBlockIndex(te, D.name), se.set(D, de));
  }
  function ae(D, te) {
    const de = c.get(te).get(D);
    l.get(te) !== de && (i.uniformBlockBinding(te, de, D.__bindingPointIndex), l.set(te, de));
  }
  function Fe() {
    i.disable(i.BLEND), i.disable(i.CULL_FACE), i.disable(i.DEPTH_TEST), i.disable(i.POLYGON_OFFSET_FILL), i.disable(i.SCISSOR_TEST), i.disable(i.STENCIL_TEST), i.disable(i.SAMPLE_ALPHA_TO_COVERAGE), i.blendEquation(i.FUNC_ADD), i.blendFunc(i.ONE, i.ZERO), i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO), i.blendColor(0, 0, 0, 0), i.colorMask(true, true, true, true), i.clearColor(0, 0, 0, 0), i.depthMask(true), i.depthFunc(i.LESS), a.setReversed(false), i.clearDepth(1), i.stencilMask(4294967295), i.stencilFunc(i.ALWAYS, 0, 4294967295), i.stencilOp(i.KEEP, i.KEEP, i.KEEP), i.clearStencil(0), i.cullFace(i.BACK), i.frontFace(i.CCW), i.polygonOffset(0, 0), i.activeTexture(i.TEXTURE0), i.bindFramebuffer(i.FRAMEBUFFER, null), i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), i.bindFramebuffer(i.READ_FRAMEBUFFER, null), i.useProgram(null), i.lineWidth(1), i.scissor(0, 0, i.canvas.width, i.canvas.height), i.viewport(0, 0, i.canvas.width, i.canvas.height), u = {}, ne = null, ce = {}, h = {}, d = /* @__PURE__ */ new WeakMap(), p = [], g = null, _ = false, m = null, f = null, b = null, E = null, y = null, w = null, C = null, R = new we(0, 0, 0), N = 0, S = false, M = null, P = null, k = null, V = null, j = null, Ye.set(0, 0, i.canvas.width, i.canvas.height), nt.set(0, 0, i.canvas.width, i.canvas.height), r.reset(), a.reset(), o.reset();
  }
  return { buffers: { color: r, depth: a, stencil: o }, enable: Z, disable: ue, bindFramebuffer: Re, drawBuffers: xe, useProgram: He, setBlending: lt, setMaterial: Ie, setFlipSided: Pe, setCullFace: me, setLineWidth: ct, setPolygonOffset: ge, setScissorTest: ke, activeTexture: Et, bindTexture: mt, unbindTexture: T, compressedTexImage2D: x, compressedTexImage3D: F, texImage2D: ve, texImage3D: ee, updateUBOMapping: ye, uniformBlockBinding: ae, texStorage2D: ie, texStorage3D: _e, texSubImage2D: G, texSubImage3D: $, compressedTexSubImage2D: H, compressedTexSubImage3D: Se, scissor: le, viewport: Ce, reset: Fe };
}
function o0(i, e, t, n, s, r, a) {
  const o = e.has("WEBGL_multisampled_render_to_texture") ? e.get("WEBGL_multisampled_render_to_texture") : null, l = typeof navigator > "u" ? false : /OculusBrowser/g.test(navigator.userAgent), c = new Ee(), u = /* @__PURE__ */ new WeakMap();
  let h;
  const d = /* @__PURE__ */ new WeakMap();
  let p = false;
  try {
    p = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function g(T, x) {
    return p ? new OffscreenCanvas(T, x) : ks("canvas");
  }
  function _(T, x, F) {
    let G = 1;
    const $ = mt(T);
    if (($.width > F || $.height > F) && (G = F / Math.max($.width, $.height)), G < 1) if (typeof HTMLImageElement < "u" && T instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && T instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && T instanceof ImageBitmap || typeof VideoFrame < "u" && T instanceof VideoFrame) {
      const H = Math.floor(G * $.width), Se = Math.floor(G * $.height);
      h === void 0 && (h = g(H, Se));
      const ie = x ? g(H, Se) : h;
      return ie.width = H, ie.height = Se, ie.getContext("2d").drawImage(T, 0, 0, H, Se), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + $.width + "x" + $.height + ") to (" + H + "x" + Se + ")."), ie;
    } else return "data" in T && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + $.width + "x" + $.height + ")."), T;
    return T;
  }
  function m(T) {
    return T.generateMipmaps;
  }
  function f(T) {
    i.generateMipmap(T);
  }
  function b(T) {
    return T.isWebGLCubeRenderTarget ? i.TEXTURE_CUBE_MAP : T.isWebGL3DRenderTarget ? i.TEXTURE_3D : T.isWebGLArrayRenderTarget || T.isCompressedArrayTexture ? i.TEXTURE_2D_ARRAY : i.TEXTURE_2D;
  }
  function E(T, x, F, G, $ = false) {
    if (T !== null) {
      if (i[T] !== void 0) return i[T];
      console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + T + "'");
    }
    let H = x;
    if (x === i.RED && (F === i.FLOAT && (H = i.R32F), F === i.HALF_FLOAT && (H = i.R16F), F === i.UNSIGNED_BYTE && (H = i.R8)), x === i.RED_INTEGER && (F === i.UNSIGNED_BYTE && (H = i.R8UI), F === i.UNSIGNED_SHORT && (H = i.R16UI), F === i.UNSIGNED_INT && (H = i.R32UI), F === i.BYTE && (H = i.R8I), F === i.SHORT && (H = i.R16I), F === i.INT && (H = i.R32I)), x === i.RG && (F === i.FLOAT && (H = i.RG32F), F === i.HALF_FLOAT && (H = i.RG16F), F === i.UNSIGNED_BYTE && (H = i.RG8)), x === i.RG_INTEGER && (F === i.UNSIGNED_BYTE && (H = i.RG8UI), F === i.UNSIGNED_SHORT && (H = i.RG16UI), F === i.UNSIGNED_INT && (H = i.RG32UI), F === i.BYTE && (H = i.RG8I), F === i.SHORT && (H = i.RG16I), F === i.INT && (H = i.RG32I)), x === i.RGB_INTEGER && (F === i.UNSIGNED_BYTE && (H = i.RGB8UI), F === i.UNSIGNED_SHORT && (H = i.RGB16UI), F === i.UNSIGNED_INT && (H = i.RGB32UI), F === i.BYTE && (H = i.RGB8I), F === i.SHORT && (H = i.RGB16I), F === i.INT && (H = i.RGB32I)), x === i.RGBA_INTEGER && (F === i.UNSIGNED_BYTE && (H = i.RGBA8UI), F === i.UNSIGNED_SHORT && (H = i.RGBA16UI), F === i.UNSIGNED_INT && (H = i.RGBA32UI), F === i.BYTE && (H = i.RGBA8I), F === i.SHORT && (H = i.RGBA16I), F === i.INT && (H = i.RGBA32I)), x === i.RGB && (F === i.UNSIGNED_INT_5_9_9_9_REV && (H = i.RGB9_E5), F === i.UNSIGNED_INT_10F_11F_11F_REV && (H = i.R11F_G11F_B10F)), x === i.RGBA) {
      const Se = $ ? Lr : qe.getTransfer(G);
      F === i.FLOAT && (H = i.RGBA32F), F === i.HALF_FLOAT && (H = i.RGBA16F), F === i.UNSIGNED_BYTE && (H = Se === et ? i.SRGB8_ALPHA8 : i.RGBA8), F === i.UNSIGNED_SHORT_4_4_4_4 && (H = i.RGBA4), F === i.UNSIGNED_SHORT_5_5_5_1 && (H = i.RGB5_A1);
    }
    return (H === i.R16F || H === i.R32F || H === i.RG16F || H === i.RG32F || H === i.RGBA16F || H === i.RGBA32F) && e.get("EXT_color_buffer_float"), H;
  }
  function y(T, x) {
    let F;
    return T ? x === null || x === Ti || x === Us ? F = i.DEPTH24_STENCIL8 : x === hn ? F = i.DEPTH32F_STENCIL8 : x === Is && (F = i.DEPTH24_STENCIL8, console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : x === null || x === Ti || x === Us ? F = i.DEPTH_COMPONENT24 : x === hn ? F = i.DEPTH_COMPONENT32F : x === Is && (F = i.DEPTH_COMPONENT16), F;
  }
  function w(T, x) {
    return m(T) === true || T.isFramebufferTexture && T.minFilter !== Nt && T.minFilter !== Ht ? Math.log2(Math.max(x.width, x.height)) + 1 : T.mipmaps !== void 0 && T.mipmaps.length > 0 ? T.mipmaps.length : T.isCompressedTexture && Array.isArray(T.image) ? x.mipmaps.length : 1;
  }
  function C(T) {
    const x = T.target;
    x.removeEventListener("dispose", C), N(x), x.isVideoTexture && u.delete(x);
  }
  function R(T) {
    const x = T.target;
    x.removeEventListener("dispose", R), M(x);
  }
  function N(T) {
    const x = n.get(T);
    if (x.__webglInit === void 0) return;
    const F = T.source, G = d.get(F);
    if (G) {
      const $ = G[x.__cacheKey];
      $.usedTimes--, $.usedTimes === 0 && S(T), Object.keys(G).length === 0 && d.delete(F);
    }
    n.remove(T);
  }
  function S(T) {
    const x = n.get(T);
    i.deleteTexture(x.__webglTexture);
    const F = T.source, G = d.get(F);
    delete G[x.__cacheKey], a.memory.textures--;
  }
  function M(T) {
    const x = n.get(T);
    if (T.depthTexture && (T.depthTexture.dispose(), n.remove(T.depthTexture)), T.isWebGLCubeRenderTarget) for (let G = 0; G < 6; G++) {
      if (Array.isArray(x.__webglFramebuffer[G])) for (let $ = 0; $ < x.__webglFramebuffer[G].length; $++) i.deleteFramebuffer(x.__webglFramebuffer[G][$]);
      else i.deleteFramebuffer(x.__webglFramebuffer[G]);
      x.__webglDepthbuffer && i.deleteRenderbuffer(x.__webglDepthbuffer[G]);
    }
    else {
      if (Array.isArray(x.__webglFramebuffer)) for (let G = 0; G < x.__webglFramebuffer.length; G++) i.deleteFramebuffer(x.__webglFramebuffer[G]);
      else i.deleteFramebuffer(x.__webglFramebuffer);
      if (x.__webglDepthbuffer && i.deleteRenderbuffer(x.__webglDepthbuffer), x.__webglMultisampledFramebuffer && i.deleteFramebuffer(x.__webglMultisampledFramebuffer), x.__webglColorRenderbuffer) for (let G = 0; G < x.__webglColorRenderbuffer.length; G++) x.__webglColorRenderbuffer[G] && i.deleteRenderbuffer(x.__webglColorRenderbuffer[G]);
      x.__webglDepthRenderbuffer && i.deleteRenderbuffer(x.__webglDepthRenderbuffer);
    }
    const F = T.textures;
    for (let G = 0, $ = F.length; G < $; G++) {
      const H = n.get(F[G]);
      H.__webglTexture && (i.deleteTexture(H.__webglTexture), a.memory.textures--), n.remove(F[G]);
    }
    n.remove(T);
  }
  let P = 0;
  function k() {
    P = 0;
  }
  function V() {
    const T = P;
    return T >= s.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + T + " texture units while this GPU supports only " + s.maxTextures), P += 1, T;
  }
  function j(T) {
    const x = [];
    return x.push(T.wrapS), x.push(T.wrapT), x.push(T.wrapR || 0), x.push(T.magFilter), x.push(T.minFilter), x.push(T.anisotropy), x.push(T.internalFormat), x.push(T.format), x.push(T.type), x.push(T.generateMipmaps), x.push(T.premultiplyAlpha), x.push(T.flipY), x.push(T.unpackAlignment), x.push(T.colorSpace), x.join();
  }
  function q(T, x) {
    const F = n.get(T);
    if (T.isVideoTexture && ke(T), T.isRenderTargetTexture === false && T.isExternalTexture !== true && T.version > 0 && F.__version !== T.version) {
      const G = T.image;
      if (G === null) console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
      else if (G.complete === false) console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        X(F, T, x);
        return;
      }
    } else T.isExternalTexture && (F.__webglTexture = T.sourceTexture ? T.sourceTexture : null);
    t.bindTexture(i.TEXTURE_2D, F.__webglTexture, i.TEXTURE0 + x);
  }
  function W(T, x) {
    const F = n.get(T);
    if (T.isRenderTargetTexture === false && T.version > 0 && F.__version !== T.version) {
      X(F, T, x);
      return;
    }
    t.bindTexture(i.TEXTURE_2D_ARRAY, F.__webglTexture, i.TEXTURE0 + x);
  }
  function K(T, x) {
    const F = n.get(T);
    if (T.isRenderTargetTexture === false && T.version > 0 && F.__version !== T.version) {
      X(F, T, x);
      return;
    }
    t.bindTexture(i.TEXTURE_3D, F.__webglTexture, i.TEXTURE0 + x);
  }
  function z(T, x) {
    const F = n.get(T);
    if (T.version > 0 && F.__version !== T.version) {
      Z(F, T, x);
      return;
    }
    t.bindTexture(i.TEXTURE_CUBE_MAP, F.__webglTexture, i.TEXTURE0 + x);
  }
  const ne = { [is]: i.REPEAT, [ni]: i.CLAMP_TO_EDGE, [Pr]: i.MIRRORED_REPEAT }, ce = { [Nt]: i.NEAREST, [nh]: i.NEAREST_MIPMAP_NEAREST, [ws]: i.NEAREST_MIPMAP_LINEAR, [Ht]: i.LINEAR, [Sr]: i.LINEAR_MIPMAP_NEAREST, [On]: i.LINEAR_MIPMAP_LINEAR }, Me = { [Gu]: i.NEVER, [Ku]: i.ALWAYS, [Wu]: i.LESS, [uh]: i.LEQUAL, [Xu]: i.EQUAL, [ju]: i.GEQUAL, [qu]: i.GREATER, [Yu]: i.NOTEQUAL };
  function Ne(T, x) {
    if (x.type === hn && e.has("OES_texture_float_linear") === false && (x.magFilter === Ht || x.magFilter === Sr || x.magFilter === ws || x.magFilter === On || x.minFilter === Ht || x.minFilter === Sr || x.minFilter === ws || x.minFilter === On) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), i.texParameteri(T, i.TEXTURE_WRAP_S, ne[x.wrapS]), i.texParameteri(T, i.TEXTURE_WRAP_T, ne[x.wrapT]), (T === i.TEXTURE_3D || T === i.TEXTURE_2D_ARRAY) && i.texParameteri(T, i.TEXTURE_WRAP_R, ne[x.wrapR]), i.texParameteri(T, i.TEXTURE_MAG_FILTER, ce[x.magFilter]), i.texParameteri(T, i.TEXTURE_MIN_FILTER, ce[x.minFilter]), x.compareFunction && (i.texParameteri(T, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE), i.texParameteri(T, i.TEXTURE_COMPARE_FUNC, Me[x.compareFunction])), e.has("EXT_texture_filter_anisotropic") === true) {
      if (x.magFilter === Nt || x.minFilter !== ws && x.minFilter !== On || x.type === hn && e.has("OES_texture_float_linear") === false) return;
      if (x.anisotropy > 1 || n.get(x).__currentAnisotropy) {
        const F = e.get("EXT_texture_filter_anisotropic");
        i.texParameterf(T, F.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(x.anisotropy, s.getMaxAnisotropy())), n.get(x).__currentAnisotropy = x.anisotropy;
      }
    }
  }
  function Ye(T, x) {
    let F = false;
    T.__webglInit === void 0 && (T.__webglInit = true, x.addEventListener("dispose", C));
    const G = x.source;
    let $ = d.get(G);
    $ === void 0 && ($ = {}, d.set(G, $));
    const H = j(x);
    if (H !== T.__cacheKey) {
      $[H] === void 0 && ($[H] = { texture: i.createTexture(), usedTimes: 0 }, a.memory.textures++, F = true), $[H].usedTimes++;
      const Se = $[T.__cacheKey];
      Se !== void 0 && ($[T.__cacheKey].usedTimes--, Se.usedTimes === 0 && S(x)), T.__cacheKey = H, T.__webglTexture = $[H].texture;
    }
    return F;
  }
  function nt(T, x, F) {
    return Math.floor(Math.floor(T / F) / x);
  }
  function We(T, x, F, G) {
    const H = T.updateRanges;
    if (H.length === 0) t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, x.width, x.height, F, G, x.data);
    else {
      H.sort((ee, le) => ee.start - le.start);
      let Se = 0;
      for (let ee = 1; ee < H.length; ee++) {
        const le = H[Se], Ce = H[ee], ye = le.start + le.count, ae = nt(Ce.start, x.width, 4), Fe = nt(le.start, x.width, 4);
        Ce.start <= ye + 1 && ae === Fe && nt(Ce.start + Ce.count - 1, x.width, 4) === ae ? le.count = Math.max(le.count, Ce.start + Ce.count - le.start) : (++Se, H[Se] = Ce);
      }
      H.length = Se + 1;
      const ie = i.getParameter(i.UNPACK_ROW_LENGTH), _e = i.getParameter(i.UNPACK_SKIP_PIXELS), ve = i.getParameter(i.UNPACK_SKIP_ROWS);
      i.pixelStorei(i.UNPACK_ROW_LENGTH, x.width);
      for (let ee = 0, le = H.length; ee < le; ee++) {
        const Ce = H[ee], ye = Math.floor(Ce.start / 4), ae = Math.ceil(Ce.count / 4), Fe = ye % x.width, D = Math.floor(ye / x.width), te = ae, se = 1;
        i.pixelStorei(i.UNPACK_SKIP_PIXELS, Fe), i.pixelStorei(i.UNPACK_SKIP_ROWS, D), t.texSubImage2D(i.TEXTURE_2D, 0, Fe, D, te, se, F, G, x.data);
      }
      T.clearUpdateRanges(), i.pixelStorei(i.UNPACK_ROW_LENGTH, ie), i.pixelStorei(i.UNPACK_SKIP_PIXELS, _e), i.pixelStorei(i.UNPACK_SKIP_ROWS, ve);
    }
  }
  function X(T, x, F) {
    let G = i.TEXTURE_2D;
    (x.isDataArrayTexture || x.isCompressedArrayTexture) && (G = i.TEXTURE_2D_ARRAY), x.isData3DTexture && (G = i.TEXTURE_3D);
    const $ = Ye(T, x), H = x.source;
    t.bindTexture(G, T.__webglTexture, i.TEXTURE0 + F);
    const Se = n.get(H);
    if (H.version !== Se.__version || $ === true) {
      t.activeTexture(i.TEXTURE0 + F);
      const ie = qe.getPrimaries(qe.workingColorSpace), _e = x.colorSpace === ei ? null : qe.getPrimaries(x.colorSpace), ve = x.colorSpace === ei || ie === _e ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, x.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, x.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, x.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, ve);
      let ee = _(x.image, false, s.maxTextureSize);
      ee = Et(x, ee);
      const le = r.convert(x.format, x.colorSpace), Ce = r.convert(x.type);
      let ye = E(x.internalFormat, le, Ce, x.colorSpace, x.isVideoTexture);
      Ne(G, x);
      let ae;
      const Fe = x.mipmaps, D = x.isVideoTexture !== true, te = Se.__version === void 0 || $ === true, se = H.dataReady, de = w(x, ee);
      if (x.isDepthTexture) ye = y(x.format === Fs, x.type), te && (D ? t.texStorage2D(i.TEXTURE_2D, 1, ye, ee.width, ee.height) : t.texImage2D(i.TEXTURE_2D, 0, ye, ee.width, ee.height, 0, le, Ce, null));
      else if (x.isDataTexture) if (Fe.length > 0) {
        D && te && t.texStorage2D(i.TEXTURE_2D, de, ye, Fe[0].width, Fe[0].height);
        for (let J = 0, Y = Fe.length; J < Y; J++) ae = Fe[J], D ? se && t.texSubImage2D(i.TEXTURE_2D, J, 0, 0, ae.width, ae.height, le, Ce, ae.data) : t.texImage2D(i.TEXTURE_2D, J, ye, ae.width, ae.height, 0, le, Ce, ae.data);
        x.generateMipmaps = false;
      } else D ? (te && t.texStorage2D(i.TEXTURE_2D, de, ye, ee.width, ee.height), se && We(x, ee, le, Ce)) : t.texImage2D(i.TEXTURE_2D, 0, ye, ee.width, ee.height, 0, le, Ce, ee.data);
      else if (x.isCompressedTexture) if (x.isCompressedArrayTexture) {
        D && te && t.texStorage3D(i.TEXTURE_2D_ARRAY, de, ye, Fe[0].width, Fe[0].height, ee.depth);
        for (let J = 0, Y = Fe.length; J < Y; J++) if (ae = Fe[J], x.format !== Yt) if (le !== null) if (D) {
          if (se) if (x.layerUpdates.size > 0) {
            const pe = dc(ae.width, ae.height, x.format, x.type);
            for (const De of x.layerUpdates) {
              const st = ae.data.subarray(De * pe / ae.data.BYTES_PER_ELEMENT, (De + 1) * pe / ae.data.BYTES_PER_ELEMENT);
              t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, J, 0, 0, De, ae.width, ae.height, 1, le, st);
            }
            x.clearLayerUpdates();
          } else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, J, 0, 0, 0, ae.width, ae.height, ee.depth, le, ae.data);
        } else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY, J, ye, ae.width, ae.height, ee.depth, 0, ae.data, 0, 0);
        else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
        else D ? se && t.texSubImage3D(i.TEXTURE_2D_ARRAY, J, 0, 0, 0, ae.width, ae.height, ee.depth, le, Ce, ae.data) : t.texImage3D(i.TEXTURE_2D_ARRAY, J, ye, ae.width, ae.height, ee.depth, 0, le, Ce, ae.data);
      } else {
        D && te && t.texStorage2D(i.TEXTURE_2D, de, ye, Fe[0].width, Fe[0].height);
        for (let J = 0, Y = Fe.length; J < Y; J++) ae = Fe[J], x.format !== Yt ? le !== null ? D ? se && t.compressedTexSubImage2D(i.TEXTURE_2D, J, 0, 0, ae.width, ae.height, le, ae.data) : t.compressedTexImage2D(i.TEXTURE_2D, J, ye, ae.width, ae.height, 0, ae.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : D ? se && t.texSubImage2D(i.TEXTURE_2D, J, 0, 0, ae.width, ae.height, le, Ce, ae.data) : t.texImage2D(i.TEXTURE_2D, J, ye, ae.width, ae.height, 0, le, Ce, ae.data);
      }
      else if (x.isDataArrayTexture) if (D) {
        if (te && t.texStorage3D(i.TEXTURE_2D_ARRAY, de, ye, ee.width, ee.height, ee.depth), se) if (x.layerUpdates.size > 0) {
          const J = dc(ee.width, ee.height, x.format, x.type);
          for (const Y of x.layerUpdates) {
            const pe = ee.data.subarray(Y * J / ee.data.BYTES_PER_ELEMENT, (Y + 1) * J / ee.data.BYTES_PER_ELEMENT);
            t.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, Y, ee.width, ee.height, 1, le, Ce, pe);
          }
          x.clearLayerUpdates();
        } else t.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, 0, ee.width, ee.height, ee.depth, le, Ce, ee.data);
      } else t.texImage3D(i.TEXTURE_2D_ARRAY, 0, ye, ee.width, ee.height, ee.depth, 0, le, Ce, ee.data);
      else if (x.isData3DTexture) D ? (te && t.texStorage3D(i.TEXTURE_3D, de, ye, ee.width, ee.height, ee.depth), se && t.texSubImage3D(i.TEXTURE_3D, 0, 0, 0, 0, ee.width, ee.height, ee.depth, le, Ce, ee.data)) : t.texImage3D(i.TEXTURE_3D, 0, ye, ee.width, ee.height, ee.depth, 0, le, Ce, ee.data);
      else if (x.isFramebufferTexture) {
        if (te) if (D) t.texStorage2D(i.TEXTURE_2D, de, ye, ee.width, ee.height);
        else {
          let J = ee.width, Y = ee.height;
          for (let pe = 0; pe < de; pe++) t.texImage2D(i.TEXTURE_2D, pe, ye, J, Y, 0, le, Ce, null), J >>= 1, Y >>= 1;
        }
      } else if (Fe.length > 0) {
        if (D && te) {
          const J = mt(Fe[0]);
          t.texStorage2D(i.TEXTURE_2D, de, ye, J.width, J.height);
        }
        for (let J = 0, Y = Fe.length; J < Y; J++) ae = Fe[J], D ? se && t.texSubImage2D(i.TEXTURE_2D, J, 0, 0, le, Ce, ae) : t.texImage2D(i.TEXTURE_2D, J, ye, le, Ce, ae);
        x.generateMipmaps = false;
      } else if (D) {
        if (te) {
          const J = mt(ee);
          t.texStorage2D(i.TEXTURE_2D, de, ye, J.width, J.height);
        }
        se && t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, le, Ce, ee);
      } else t.texImage2D(i.TEXTURE_2D, 0, ye, le, Ce, ee);
      m(x) && f(G), Se.__version = H.version, x.onUpdate && x.onUpdate(x);
    }
    T.__version = x.version;
  }
  function Z(T, x, F) {
    if (x.image.length !== 6) return;
    const G = Ye(T, x), $ = x.source;
    t.bindTexture(i.TEXTURE_CUBE_MAP, T.__webglTexture, i.TEXTURE0 + F);
    const H = n.get($);
    if ($.version !== H.__version || G === true) {
      t.activeTexture(i.TEXTURE0 + F);
      const Se = qe.getPrimaries(qe.workingColorSpace), ie = x.colorSpace === ei ? null : qe.getPrimaries(x.colorSpace), _e = x.colorSpace === ei || Se === ie ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, x.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, x.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, x.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, _e);
      const ve = x.isCompressedTexture || x.image[0].isCompressedTexture, ee = x.image[0] && x.image[0].isDataTexture, le = [];
      for (let Y = 0; Y < 6; Y++) !ve && !ee ? le[Y] = _(x.image[Y], true, s.maxCubemapSize) : le[Y] = ee ? x.image[Y].image : x.image[Y], le[Y] = Et(x, le[Y]);
      const Ce = le[0], ye = r.convert(x.format, x.colorSpace), ae = r.convert(x.type), Fe = E(x.internalFormat, ye, ae, x.colorSpace), D = x.isVideoTexture !== true, te = H.__version === void 0 || G === true, se = $.dataReady;
      let de = w(x, Ce);
      Ne(i.TEXTURE_CUBE_MAP, x);
      let J;
      if (ve) {
        D && te && t.texStorage2D(i.TEXTURE_CUBE_MAP, de, Fe, Ce.width, Ce.height);
        for (let Y = 0; Y < 6; Y++) {
          J = le[Y].mipmaps;
          for (let pe = 0; pe < J.length; pe++) {
            const De = J[pe];
            x.format !== Yt ? ye !== null ? D ? se && t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, pe, 0, 0, De.width, De.height, ye, De.data) : t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, pe, Fe, De.width, De.height, 0, De.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : D ? se && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, pe, 0, 0, De.width, De.height, ye, ae, De.data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, pe, Fe, De.width, De.height, 0, ye, ae, De.data);
          }
        }
      } else {
        if (J = x.mipmaps, D && te) {
          J.length > 0 && de++;
          const Y = mt(le[0]);
          t.texStorage2D(i.TEXTURE_CUBE_MAP, de, Fe, Y.width, Y.height);
        }
        for (let Y = 0; Y < 6; Y++) if (ee) {
          D ? se && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, 0, 0, 0, le[Y].width, le[Y].height, ye, ae, le[Y].data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, 0, Fe, le[Y].width, le[Y].height, 0, ye, ae, le[Y].data);
          for (let pe = 0; pe < J.length; pe++) {
            const st = J[pe].image[Y].image;
            D ? se && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, pe + 1, 0, 0, st.width, st.height, ye, ae, st.data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, pe + 1, Fe, st.width, st.height, 0, ye, ae, st.data);
          }
        } else {
          D ? se && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, 0, 0, 0, ye, ae, le[Y]) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, 0, Fe, ye, ae, le[Y]);
          for (let pe = 0; pe < J.length; pe++) {
            const De = J[pe];
            D ? se && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, pe + 1, 0, 0, ye, ae, De.image[Y]) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, pe + 1, Fe, ye, ae, De.image[Y]);
          }
        }
      }
      m(x) && f(i.TEXTURE_CUBE_MAP), H.__version = $.version, x.onUpdate && x.onUpdate(x);
    }
    T.__version = x.version;
  }
  function ue(T, x, F, G, $, H) {
    const Se = r.convert(F.format, F.colorSpace), ie = r.convert(F.type), _e = E(F.internalFormat, Se, ie, F.colorSpace), ve = n.get(x), ee = n.get(F);
    if (ee.__renderTarget = x, !ve.__hasExternalTextures) {
      const le = Math.max(1, x.width >> H), Ce = Math.max(1, x.height >> H);
      $ === i.TEXTURE_3D || $ === i.TEXTURE_2D_ARRAY ? t.texImage3D($, H, _e, le, Ce, x.depth, 0, Se, ie, null) : t.texImage2D($, H, _e, le, Ce, 0, Se, ie, null);
    }
    t.bindFramebuffer(i.FRAMEBUFFER, T), ge(x) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, G, $, ee.__webglTexture, 0, ct(x)) : ($ === i.TEXTURE_2D || $ >= i.TEXTURE_CUBE_MAP_POSITIVE_X && $ <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z) && i.framebufferTexture2D(i.FRAMEBUFFER, G, $, ee.__webglTexture, H), t.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function Re(T, x, F) {
    if (i.bindRenderbuffer(i.RENDERBUFFER, T), x.depthBuffer) {
      const G = x.depthTexture, $ = G && G.isDepthTexture ? G.type : null, H = y(x.stencilBuffer, $), Se = x.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, ie = ct(x);
      ge(x) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, ie, H, x.width, x.height) : F ? i.renderbufferStorageMultisample(i.RENDERBUFFER, ie, H, x.width, x.height) : i.renderbufferStorage(i.RENDERBUFFER, H, x.width, x.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, Se, i.RENDERBUFFER, T);
    } else {
      const G = x.textures;
      for (let $ = 0; $ < G.length; $++) {
        const H = G[$], Se = r.convert(H.format, H.colorSpace), ie = r.convert(H.type), _e = E(H.internalFormat, Se, ie, H.colorSpace), ve = ct(x);
        F && ge(x) === false ? i.renderbufferStorageMultisample(i.RENDERBUFFER, ve, _e, x.width, x.height) : ge(x) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, ve, _e, x.width, x.height) : i.renderbufferStorage(i.RENDERBUFFER, _e, x.width, x.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function xe(T, x) {
    if (x && x.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
    if (t.bindFramebuffer(i.FRAMEBUFFER, T), !(x.depthTexture && x.depthTexture.isDepthTexture)) throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    const G = n.get(x.depthTexture);
    G.__renderTarget = x, (!G.__webglTexture || x.depthTexture.image.width !== x.width || x.depthTexture.image.height !== x.height) && (x.depthTexture.image.width = x.width, x.depthTexture.image.height = x.height, x.depthTexture.needsUpdate = true), q(x.depthTexture, 0);
    const $ = G.__webglTexture, H = ct(x);
    if (x.depthTexture.format === Ns) ge(x) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, $, 0, H) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, $, 0);
    else if (x.depthTexture.format === Fs) ge(x) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, $, 0, H) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, $, 0);
    else throw new Error("Unknown depthTexture format");
  }
  function He(T) {
    const x = n.get(T), F = T.isWebGLCubeRenderTarget === true;
    if (x.__boundDepthTexture !== T.depthTexture) {
      const G = T.depthTexture;
      if (x.__depthDisposeCallback && x.__depthDisposeCallback(), G) {
        const $ = () => {
          delete x.__boundDepthTexture, delete x.__depthDisposeCallback, G.removeEventListener("dispose", $);
        };
        G.addEventListener("dispose", $), x.__depthDisposeCallback = $;
      }
      x.__boundDepthTexture = G;
    }
    if (T.depthTexture && !x.__autoAllocateDepthBuffer) {
      if (F) throw new Error("target.depthTexture not supported in Cube render targets");
      const G = T.texture.mipmaps;
      G && G.length > 0 ? xe(x.__webglFramebuffer[0], T) : xe(x.__webglFramebuffer, T);
    } else if (F) {
      x.__webglDepthbuffer = [];
      for (let G = 0; G < 6; G++) if (t.bindFramebuffer(i.FRAMEBUFFER, x.__webglFramebuffer[G]), x.__webglDepthbuffer[G] === void 0) x.__webglDepthbuffer[G] = i.createRenderbuffer(), Re(x.__webglDepthbuffer[G], T, false);
      else {
        const $ = T.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, H = x.__webglDepthbuffer[G];
        i.bindRenderbuffer(i.RENDERBUFFER, H), i.framebufferRenderbuffer(i.FRAMEBUFFER, $, i.RENDERBUFFER, H);
      }
    } else {
      const G = T.texture.mipmaps;
      if (G && G.length > 0 ? t.bindFramebuffer(i.FRAMEBUFFER, x.__webglFramebuffer[0]) : t.bindFramebuffer(i.FRAMEBUFFER, x.__webglFramebuffer), x.__webglDepthbuffer === void 0) x.__webglDepthbuffer = i.createRenderbuffer(), Re(x.__webglDepthbuffer, T, false);
      else {
        const $ = T.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, H = x.__webglDepthbuffer;
        i.bindRenderbuffer(i.RENDERBUFFER, H), i.framebufferRenderbuffer(i.FRAMEBUFFER, $, i.RENDERBUFFER, H);
      }
    }
    t.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function xt(T, x, F) {
    const G = n.get(T);
    x !== void 0 && ue(G.__webglFramebuffer, T, T.texture, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, 0), F !== void 0 && He(T);
  }
  function A(T) {
    const x = T.texture, F = n.get(T), G = n.get(x);
    T.addEventListener("dispose", R);
    const $ = T.textures, H = T.isWebGLCubeRenderTarget === true, Se = $.length > 1;
    if (Se || (G.__webglTexture === void 0 && (G.__webglTexture = i.createTexture()), G.__version = x.version, a.memory.textures++), H) {
      F.__webglFramebuffer = [];
      for (let ie = 0; ie < 6; ie++) if (x.mipmaps && x.mipmaps.length > 0) {
        F.__webglFramebuffer[ie] = [];
        for (let _e = 0; _e < x.mipmaps.length; _e++) F.__webglFramebuffer[ie][_e] = i.createFramebuffer();
      } else F.__webglFramebuffer[ie] = i.createFramebuffer();
    } else {
      if (x.mipmaps && x.mipmaps.length > 0) {
        F.__webglFramebuffer = [];
        for (let ie = 0; ie < x.mipmaps.length; ie++) F.__webglFramebuffer[ie] = i.createFramebuffer();
      } else F.__webglFramebuffer = i.createFramebuffer();
      if (Se) for (let ie = 0, _e = $.length; ie < _e; ie++) {
        const ve = n.get($[ie]);
        ve.__webglTexture === void 0 && (ve.__webglTexture = i.createTexture(), a.memory.textures++);
      }
      if (T.samples > 0 && ge(T) === false) {
        F.__webglMultisampledFramebuffer = i.createFramebuffer(), F.__webglColorRenderbuffer = [], t.bindFramebuffer(i.FRAMEBUFFER, F.__webglMultisampledFramebuffer);
        for (let ie = 0; ie < $.length; ie++) {
          const _e = $[ie];
          F.__webglColorRenderbuffer[ie] = i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, F.__webglColorRenderbuffer[ie]);
          const ve = r.convert(_e.format, _e.colorSpace), ee = r.convert(_e.type), le = E(_e.internalFormat, ve, ee, _e.colorSpace, T.isXRRenderTarget === true), Ce = ct(T);
          i.renderbufferStorageMultisample(i.RENDERBUFFER, Ce, le, T.width, T.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ie, i.RENDERBUFFER, F.__webglColorRenderbuffer[ie]);
        }
        i.bindRenderbuffer(i.RENDERBUFFER, null), T.depthBuffer && (F.__webglDepthRenderbuffer = i.createRenderbuffer(), Re(F.__webglDepthRenderbuffer, T, true)), t.bindFramebuffer(i.FRAMEBUFFER, null);
      }
    }
    if (H) {
      t.bindTexture(i.TEXTURE_CUBE_MAP, G.__webglTexture), Ne(i.TEXTURE_CUBE_MAP, x);
      for (let ie = 0; ie < 6; ie++) if (x.mipmaps && x.mipmaps.length > 0) for (let _e = 0; _e < x.mipmaps.length; _e++) ue(F.__webglFramebuffer[ie][_e], T, x, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + ie, _e);
      else ue(F.__webglFramebuffer[ie], T, x, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + ie, 0);
      m(x) && f(i.TEXTURE_CUBE_MAP), t.unbindTexture();
    } else if (Se) {
      for (let ie = 0, _e = $.length; ie < _e; ie++) {
        const ve = $[ie], ee = n.get(ve);
        let le = i.TEXTURE_2D;
        (T.isWebGL3DRenderTarget || T.isWebGLArrayRenderTarget) && (le = T.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY), t.bindTexture(le, ee.__webglTexture), Ne(le, ve), ue(F.__webglFramebuffer, T, ve, i.COLOR_ATTACHMENT0 + ie, le, 0), m(ve) && f(le);
      }
      t.unbindTexture();
    } else {
      let ie = i.TEXTURE_2D;
      if ((T.isWebGL3DRenderTarget || T.isWebGLArrayRenderTarget) && (ie = T.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY), t.bindTexture(ie, G.__webglTexture), Ne(ie, x), x.mipmaps && x.mipmaps.length > 0) for (let _e = 0; _e < x.mipmaps.length; _e++) ue(F.__webglFramebuffer[_e], T, x, i.COLOR_ATTACHMENT0, ie, _e);
      else ue(F.__webglFramebuffer, T, x, i.COLOR_ATTACHMENT0, ie, 0);
      m(x) && f(ie), t.unbindTexture();
    }
    T.depthBuffer && He(T);
  }
  function lt(T) {
    const x = T.textures;
    for (let F = 0, G = x.length; F < G; F++) {
      const $ = x[F];
      if (m($)) {
        const H = b(T), Se = n.get($).__webglTexture;
        t.bindTexture(H, Se), f(H), t.unbindTexture();
      }
    }
  }
  const Ie = [], Pe = [];
  function me(T) {
    if (T.samples > 0) {
      if (ge(T) === false) {
        const x = T.textures, F = T.width, G = T.height;
        let $ = i.COLOR_BUFFER_BIT;
        const H = T.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, Se = n.get(T), ie = x.length > 1;
        if (ie) for (let ve = 0; ve < x.length; ve++) t.bindFramebuffer(i.FRAMEBUFFER, Se.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ve, i.RENDERBUFFER, null), t.bindFramebuffer(i.FRAMEBUFFER, Se.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ve, i.TEXTURE_2D, null, 0);
        t.bindFramebuffer(i.READ_FRAMEBUFFER, Se.__webglMultisampledFramebuffer);
        const _e = T.texture.mipmaps;
        _e && _e.length > 0 ? t.bindFramebuffer(i.DRAW_FRAMEBUFFER, Se.__webglFramebuffer[0]) : t.bindFramebuffer(i.DRAW_FRAMEBUFFER, Se.__webglFramebuffer);
        for (let ve = 0; ve < x.length; ve++) {
          if (T.resolveDepthBuffer && (T.depthBuffer && ($ |= i.DEPTH_BUFFER_BIT), T.stencilBuffer && T.resolveStencilBuffer && ($ |= i.STENCIL_BUFFER_BIT)), ie) {
            i.framebufferRenderbuffer(i.READ_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, Se.__webglColorRenderbuffer[ve]);
            const ee = n.get(x[ve]).__webglTexture;
            i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, ee, 0);
          }
          i.blitFramebuffer(0, 0, F, G, 0, 0, F, G, $, i.NEAREST), l === true && (Ie.length = 0, Pe.length = 0, Ie.push(i.COLOR_ATTACHMENT0 + ve), T.depthBuffer && T.resolveDepthBuffer === false && (Ie.push(H), Pe.push(H), i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, Pe)), i.invalidateFramebuffer(i.READ_FRAMEBUFFER, Ie));
        }
        if (t.bindFramebuffer(i.READ_FRAMEBUFFER, null), t.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), ie) for (let ve = 0; ve < x.length; ve++) {
          t.bindFramebuffer(i.FRAMEBUFFER, Se.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ve, i.RENDERBUFFER, Se.__webglColorRenderbuffer[ve]);
          const ee = n.get(x[ve]).__webglTexture;
          t.bindFramebuffer(i.FRAMEBUFFER, Se.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ve, i.TEXTURE_2D, ee, 0);
        }
        t.bindFramebuffer(i.DRAW_FRAMEBUFFER, Se.__webglMultisampledFramebuffer);
      } else if (T.depthBuffer && T.resolveDepthBuffer === false && l) {
        const x = T.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
        i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [x]);
      }
    }
  }
  function ct(T) {
    return Math.min(s.maxSamples, T.samples);
  }
  function ge(T) {
    const x = n.get(T);
    return T.samples > 0 && e.has("WEBGL_multisampled_render_to_texture") === true && x.__useRenderToTexture !== false;
  }
  function ke(T) {
    const x = a.render.frame;
    u.get(T) !== x && (u.set(T, x), T.update());
  }
  function Et(T, x) {
    const F = T.colorSpace, G = T.format, $ = T.type;
    return T.isCompressedTexture === true || T.isVideoTexture === true || F !== Ct && F !== ei && (qe.getTransfer(F) === et ? (G !== Yt || $ !== En) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", F)), x;
  }
  function mt(T) {
    return typeof HTMLImageElement < "u" && T instanceof HTMLImageElement ? (c.width = T.naturalWidth || T.width, c.height = T.naturalHeight || T.height) : typeof VideoFrame < "u" && T instanceof VideoFrame ? (c.width = T.displayWidth, c.height = T.displayHeight) : (c.width = T.width, c.height = T.height), c;
  }
  this.allocateTextureUnit = V, this.resetTextureUnits = k, this.setTexture2D = q, this.setTexture2DArray = W, this.setTexture3D = K, this.setTextureCube = z, this.rebindTextures = xt, this.setupRenderTarget = A, this.updateRenderTargetMipmap = lt, this.updateMultisampleRenderTarget = me, this.setupDepthRenderbuffer = He, this.setupFrameBufferTexture = ue, this.useMultisampledRTT = ge;
}
function l0(i, e) {
  function t(n, s = ei) {
    let r;
    const a = qe.getTransfer(s);
    if (n === En) return i.UNSIGNED_BYTE;
    if (n === zo) return i.UNSIGNED_SHORT_4_4_4_4;
    if (n === Ho) return i.UNSIGNED_SHORT_5_5_5_1;
    if (n === rh) return i.UNSIGNED_INT_5_9_9_9_REV;
    if (n === ah) return i.UNSIGNED_INT_10F_11F_11F_REV;
    if (n === ih) return i.BYTE;
    if (n === sh) return i.SHORT;
    if (n === Is) return i.UNSIGNED_SHORT;
    if (n === ko) return i.INT;
    if (n === Ti) return i.UNSIGNED_INT;
    if (n === hn) return i.FLOAT;
    if (n === hs) return i.HALF_FLOAT;
    if (n === oh) return i.ALPHA;
    if (n === lh) return i.RGB;
    if (n === Yt) return i.RGBA;
    if (n === Ns) return i.DEPTH_COMPONENT;
    if (n === Fs) return i.DEPTH_STENCIL;
    if (n === Vo) return i.RED;
    if (n === Go) return i.RED_INTEGER;
    if (n === ch) return i.RG;
    if (n === Wo) return i.RG_INTEGER;
    if (n === Xo) return i.RGBA_INTEGER;
    if (n === Er || n === Tr || n === br || n === Ar) if (a === et) if (r = e.get("WEBGL_compressed_texture_s3tc_srgb"), r !== null) {
      if (n === Er) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
      if (n === Tr) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
      if (n === br) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
      if (n === Ar) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
    } else return null;
    else if (r = e.get("WEBGL_compressed_texture_s3tc"), r !== null) {
      if (n === Er) return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
      if (n === Tr) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
      if (n === br) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
      if (n === Ar) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
    } else return null;
    if (n === Ya || n === ja || n === Ka || n === Za) if (r = e.get("WEBGL_compressed_texture_pvrtc"), r !== null) {
      if (n === Ya) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
      if (n === ja) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
      if (n === Ka) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
      if (n === Za) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
    } else return null;
    if (n === $a || n === Ja || n === Qa) if (r = e.get("WEBGL_compressed_texture_etc"), r !== null) {
      if (n === $a || n === Ja) return a === et ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
      if (n === Qa) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : r.COMPRESSED_RGBA8_ETC2_EAC;
    } else return null;
    if (n === eo || n === to || n === no || n === io || n === so || n === ro || n === ao || n === oo || n === lo || n === co || n === ho || n === uo || n === fo || n === po) if (r = e.get("WEBGL_compressed_texture_astc"), r !== null) {
      if (n === eo) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
      if (n === to) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
      if (n === no) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
      if (n === io) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
      if (n === so) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
      if (n === ro) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
      if (n === ao) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
      if (n === oo) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
      if (n === lo) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
      if (n === co) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
      if (n === ho) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
      if (n === uo) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
      if (n === fo) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
      if (n === po) return a === et ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : r.COMPRESSED_RGBA_ASTC_12x12_KHR;
    } else return null;
    if (n === mo || n === go || n === _o) if (r = e.get("EXT_texture_compression_bptc"), r !== null) {
      if (n === mo) return a === et ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
      if (n === go) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
      if (n === _o) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
    } else return null;
    if (n === xo || n === vo || n === yo || n === Mo) if (r = e.get("EXT_texture_compression_rgtc"), r !== null) {
      if (n === xo) return r.COMPRESSED_RED_RGTC1_EXT;
      if (n === vo) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
      if (n === yo) return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
      if (n === Mo) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
    } else return null;
    return n === Us ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
  }
  return { convert: t };
}
const c0 = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, h0 = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class u0 {
  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }
  init(e, t) {
    if (this.texture === null) {
      const n = new Rh(e.texture);
      (e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = n;
    }
  }
  getMesh(e) {
    if (this.texture !== null && this.mesh === null) {
      const t = e.cameras[0].viewport, n = new ai({ vertexShader: c0, fragmentShader: h0, uniforms: { depthColor: { value: this.texture }, depthWidth: { value: t.z }, depthHeight: { value: t.w } } });
      this.mesh = new _t(new Hr(20, 20), n);
    }
    return this.mesh;
  }
  reset() {
    this.texture = null, this.mesh = null;
  }
  getDepthTexture() {
    return this.texture;
  }
}
class d0 extends Ci {
  constructor(e, t) {
    super();
    const n = this;
    let s = null, r = 1, a = null, o = "local-floor", l = 1, c = null, u = null, h = null, d = null, p = null, g = null;
    const _ = typeof XRWebGLBinding < "u", m = new u0(), f = {}, b = t.getContextAttributes();
    let E = null, y = null;
    const w = [], C = [], R = new Ee();
    let N = null;
    const S = new zt();
    S.viewport = new Ke();
    const M = new zt();
    M.viewport = new Ke();
    const P = [S, M], k = new Mf();
    let V = null, j = null;
    this.cameraAutoUpdate = true, this.enabled = false, this.isPresenting = false, this.getController = function(X) {
      let Z = w[X];
      return Z === void 0 && (Z = new ma(), w[X] = Z), Z.getTargetRaySpace();
    }, this.getControllerGrip = function(X) {
      let Z = w[X];
      return Z === void 0 && (Z = new ma(), w[X] = Z), Z.getGripSpace();
    }, this.getHand = function(X) {
      let Z = w[X];
      return Z === void 0 && (Z = new ma(), w[X] = Z), Z.getHandSpace();
    };
    function q(X) {
      const Z = C.indexOf(X.inputSource);
      if (Z === -1) return;
      const ue = w[Z];
      ue !== void 0 && (ue.update(X.inputSource, X.frame, c || a), ue.dispatchEvent({ type: X.type, data: X.inputSource }));
    }
    function W() {
      s.removeEventListener("select", q), s.removeEventListener("selectstart", q), s.removeEventListener("selectend", q), s.removeEventListener("squeeze", q), s.removeEventListener("squeezestart", q), s.removeEventListener("squeezeend", q), s.removeEventListener("end", W), s.removeEventListener("inputsourceschange", K);
      for (let X = 0; X < w.length; X++) {
        const Z = C[X];
        Z !== null && (C[X] = null, w[X].disconnect(Z));
      }
      V = null, j = null, m.reset();
      for (const X in f) delete f[X];
      e.setRenderTarget(E), p = null, d = null, h = null, s = null, y = null, We.stop(), n.isPresenting = false, e.setPixelRatio(N), e.setSize(R.width, R.height, false), n.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(X) {
      r = X, n.isPresenting === true && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(X) {
      o = X, n.isPresenting === true && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return c || a;
    }, this.setReferenceSpace = function(X) {
      c = X;
    }, this.getBaseLayer = function() {
      return d !== null ? d : p;
    }, this.getBinding = function() {
      return h === null && _ && (h = new XRWebGLBinding(s, t)), h;
    }, this.getFrame = function() {
      return g;
    }, this.getSession = function() {
      return s;
    }, this.setSession = async function(X) {
      if (s = X, s !== null) {
        if (E = e.getRenderTarget(), s.addEventListener("select", q), s.addEventListener("selectstart", q), s.addEventListener("selectend", q), s.addEventListener("squeeze", q), s.addEventListener("squeezestart", q), s.addEventListener("squeezeend", q), s.addEventListener("end", W), s.addEventListener("inputsourceschange", K), b.xrCompatible !== true && await t.makeXRCompatible(), N = e.getPixelRatio(), e.getSize(R), _ && "createProjectionLayer" in XRWebGLBinding.prototype) {
          let ue = null, Re = null, xe = null;
          b.depth && (xe = b.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, ue = b.stencil ? Fs : Ns, Re = b.stencil ? Us : Ti);
          const He = { colorFormat: t.RGBA8, depthFormat: xe, scaleFactor: r };
          h = this.getBinding(), d = h.createProjectionLayer(He), s.updateRenderState({ layers: [d] }), e.setPixelRatio(1), e.setSize(d.textureWidth, d.textureHeight, false), y = new bi(d.textureWidth, d.textureHeight, { format: Yt, type: En, depthTexture: new wh(d.textureWidth, d.textureHeight, Re, void 0, void 0, void 0, void 0, void 0, void 0, ue), stencilBuffer: b.stencil, colorSpace: e.outputColorSpace, samples: b.antialias ? 4 : 0, resolveDepthBuffer: d.ignoreDepthValues === false, resolveStencilBuffer: d.ignoreDepthValues === false });
        } else {
          const ue = { antialias: b.antialias, alpha: true, depth: b.depth, stencil: b.stencil, framebufferScaleFactor: r };
          p = new XRWebGLLayer(s, t, ue), s.updateRenderState({ baseLayer: p }), e.setPixelRatio(1), e.setSize(p.framebufferWidth, p.framebufferHeight, false), y = new bi(p.framebufferWidth, p.framebufferHeight, { format: Yt, type: En, colorSpace: e.outputColorSpace, stencilBuffer: b.stencil, resolveDepthBuffer: p.ignoreDepthValues === false, resolveStencilBuffer: p.ignoreDepthValues === false });
        }
        y.isXRRenderTarget = true, this.setFoveation(l), c = null, a = await s.requestReferenceSpace(o), We.setContext(s), We.start(), n.isPresenting = true, n.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (s !== null) return s.environmentBlendMode;
    }, this.getDepthTexture = function() {
      return m.getDepthTexture();
    };
    function K(X) {
      for (let Z = 0; Z < X.removed.length; Z++) {
        const ue = X.removed[Z], Re = C.indexOf(ue);
        Re >= 0 && (C[Re] = null, w[Re].disconnect(ue));
      }
      for (let Z = 0; Z < X.added.length; Z++) {
        const ue = X.added[Z];
        let Re = C.indexOf(ue);
        if (Re === -1) {
          for (let He = 0; He < w.length; He++) if (He >= C.length) {
            C.push(ue), Re = He;
            break;
          } else if (C[He] === null) {
            C[He] = ue, Re = He;
            break;
          }
          if (Re === -1) break;
        }
        const xe = w[Re];
        xe && xe.connect(ue);
      }
    }
    const z = new L(), ne = new L();
    function ce(X, Z, ue) {
      z.setFromMatrixPosition(Z.matrixWorld), ne.setFromMatrixPosition(ue.matrixWorld);
      const Re = z.distanceTo(ne), xe = Z.projectionMatrix.elements, He = ue.projectionMatrix.elements, xt = xe[14] / (xe[10] - 1), A = xe[14] / (xe[10] + 1), lt = (xe[9] + 1) / xe[5], Ie = (xe[9] - 1) / xe[5], Pe = (xe[8] - 1) / xe[0], me = (He[8] + 1) / He[0], ct = xt * Pe, ge = xt * me, ke = Re / (-Pe + me), Et = ke * -Pe;
      if (Z.matrixWorld.decompose(X.position, X.quaternion, X.scale), X.translateX(Et), X.translateZ(ke), X.matrixWorld.compose(X.position, X.quaternion, X.scale), X.matrixWorldInverse.copy(X.matrixWorld).invert(), xe[10] === -1) X.projectionMatrix.copy(Z.projectionMatrix), X.projectionMatrixInverse.copy(Z.projectionMatrixInverse);
      else {
        const mt = xt + ke, T = A + ke, x = ct - Et, F = ge + (Re - Et), G = lt * A / T * mt, $ = Ie * A / T * mt;
        X.projectionMatrix.makePerspective(x, F, G, $, mt, T), X.projectionMatrixInverse.copy(X.projectionMatrix).invert();
      }
    }
    function Me(X, Z) {
      Z === null ? X.matrixWorld.copy(X.matrix) : X.matrixWorld.multiplyMatrices(Z.matrixWorld, X.matrix), X.matrixWorldInverse.copy(X.matrixWorld).invert();
    }
    this.updateCamera = function(X) {
      if (s === null) return;
      let Z = X.near, ue = X.far;
      m.texture !== null && (m.depthNear > 0 && (Z = m.depthNear), m.depthFar > 0 && (ue = m.depthFar)), k.near = M.near = S.near = Z, k.far = M.far = S.far = ue, (V !== k.near || j !== k.far) && (s.updateRenderState({ depthNear: k.near, depthFar: k.far }), V = k.near, j = k.far), k.layers.mask = X.layers.mask | 6, S.layers.mask = k.layers.mask & 3, M.layers.mask = k.layers.mask & 5;
      const Re = X.parent, xe = k.cameras;
      Me(k, Re);
      for (let He = 0; He < xe.length; He++) Me(xe[He], Re);
      xe.length === 2 ? ce(k, S, M) : k.projectionMatrix.copy(S.projectionMatrix), Ne(X, k, Re);
    };
    function Ne(X, Z, ue) {
      ue === null ? X.matrix.copy(Z.matrixWorld) : (X.matrix.copy(ue.matrixWorld), X.matrix.invert(), X.matrix.multiply(Z.matrixWorld)), X.matrix.decompose(X.position, X.quaternion, X.scale), X.updateMatrixWorld(true), X.projectionMatrix.copy(Z.projectionMatrix), X.projectionMatrixInverse.copy(Z.projectionMatrixInverse), X.isPerspectiveCamera && (X.fov = ss * 2 * Math.atan(1 / X.projectionMatrix.elements[5]), X.zoom = 1);
    }
    this.getCamera = function() {
      return k;
    }, this.getFoveation = function() {
      if (!(d === null && p === null)) return l;
    }, this.setFoveation = function(X) {
      l = X, d !== null && (d.fixedFoveation = X), p !== null && p.fixedFoveation !== void 0 && (p.fixedFoveation = X);
    }, this.hasDepthSensing = function() {
      return m.texture !== null;
    }, this.getDepthSensingMesh = function() {
      return m.getMesh(k);
    }, this.getCameraTexture = function(X) {
      return f[X];
    };
    let Ye = null;
    function nt(X, Z) {
      if (u = Z.getViewerPose(c || a), g = Z, u !== null) {
        const ue = u.views;
        p !== null && (e.setRenderTargetFramebuffer(y, p.framebuffer), e.setRenderTarget(y));
        let Re = false;
        ue.length !== k.cameras.length && (k.cameras.length = 0, Re = true);
        for (let A = 0; A < ue.length; A++) {
          const lt = ue[A];
          let Ie = null;
          if (p !== null) Ie = p.getViewport(lt);
          else {
            const me = h.getViewSubImage(d, lt);
            Ie = me.viewport, A === 0 && (e.setRenderTargetTextures(y, me.colorTexture, me.depthStencilTexture), e.setRenderTarget(y));
          }
          let Pe = P[A];
          Pe === void 0 && (Pe = new zt(), Pe.layers.enable(A), Pe.viewport = new Ke(), P[A] = Pe), Pe.matrix.fromArray(lt.transform.matrix), Pe.matrix.decompose(Pe.position, Pe.quaternion, Pe.scale), Pe.projectionMatrix.fromArray(lt.projectionMatrix), Pe.projectionMatrixInverse.copy(Pe.projectionMatrix).invert(), Pe.viewport.set(Ie.x, Ie.y, Ie.width, Ie.height), A === 0 && (k.matrix.copy(Pe.matrix), k.matrix.decompose(k.position, k.quaternion, k.scale)), Re === true && k.cameras.push(Pe);
        }
        const xe = s.enabledFeatures;
        if (xe && xe.includes("depth-sensing") && s.depthUsage == "gpu-optimized" && _) {
          h = n.getBinding();
          const A = h.getDepthInformation(ue[0]);
          A && A.isValid && A.texture && m.init(A, s.renderState);
        }
        if (xe && xe.includes("camera-access") && _) {
          e.state.unbindTexture(), h = n.getBinding();
          for (let A = 0; A < ue.length; A++) {
            const lt = ue[A].camera;
            if (lt) {
              let Ie = f[lt];
              Ie || (Ie = new Rh(), f[lt] = Ie);
              const Pe = h.getCameraImage(lt);
              Ie.sourceTexture = Pe;
            }
          }
        }
      }
      for (let ue = 0; ue < w.length; ue++) {
        const Re = C[ue], xe = w[ue];
        Re !== null && xe !== void 0 && xe.update(Re, Z, c || a);
      }
      Ye && Ye(X, Z), Z.detectedPlanes && n.dispatchEvent({ type: "planesdetected", data: Z }), g = null;
    }
    const We = new Uh();
    We.setAnimationLoop(nt), this.setAnimationLoop = function(X) {
      Ye = X;
    }, this.dispose = function() {
    };
  }
}
const mi = new fn(), f0 = new Be();
function p0(i, e) {
  function t(m, f) {
    m.matrixAutoUpdate === true && m.updateMatrix(), f.value.copy(m.matrix);
  }
  function n(m, f) {
    f.color.getRGB(m.fogColor.value, xh(i)), f.isFog ? (m.fogNear.value = f.near, m.fogFar.value = f.far) : f.isFogExp2 && (m.fogDensity.value = f.density);
  }
  function s(m, f, b, E, y) {
    f.isMeshBasicMaterial || f.isMeshLambertMaterial ? r(m, f) : f.isMeshToonMaterial ? (r(m, f), h(m, f)) : f.isMeshPhongMaterial ? (r(m, f), u(m, f)) : f.isMeshStandardMaterial ? (r(m, f), d(m, f), f.isMeshPhysicalMaterial && p(m, f, y)) : f.isMeshMatcapMaterial ? (r(m, f), g(m, f)) : f.isMeshDepthMaterial ? r(m, f) : f.isMeshDistanceMaterial ? (r(m, f), _(m, f)) : f.isMeshNormalMaterial ? r(m, f) : f.isLineBasicMaterial ? (a(m, f), f.isLineDashedMaterial && o(m, f)) : f.isPointsMaterial ? l(m, f, b, E) : f.isSpriteMaterial ? c(m, f) : f.isShadowMaterial ? (m.color.value.copy(f.color), m.opacity.value = f.opacity) : f.isShaderMaterial && (f.uniformsNeedUpdate = false);
  }
  function r(m, f) {
    m.opacity.value = f.opacity, f.color && m.diffuse.value.copy(f.color), f.emissive && m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity), f.map && (m.map.value = f.map, t(f.map, m.mapTransform)), f.alphaMap && (m.alphaMap.value = f.alphaMap, t(f.alphaMap, m.alphaMapTransform)), f.bumpMap && (m.bumpMap.value = f.bumpMap, t(f.bumpMap, m.bumpMapTransform), m.bumpScale.value = f.bumpScale, f.side === Ut && (m.bumpScale.value *= -1)), f.normalMap && (m.normalMap.value = f.normalMap, t(f.normalMap, m.normalMapTransform), m.normalScale.value.copy(f.normalScale), f.side === Ut && m.normalScale.value.negate()), f.displacementMap && (m.displacementMap.value = f.displacementMap, t(f.displacementMap, m.displacementMapTransform), m.displacementScale.value = f.displacementScale, m.displacementBias.value = f.displacementBias), f.emissiveMap && (m.emissiveMap.value = f.emissiveMap, t(f.emissiveMap, m.emissiveMapTransform)), f.specularMap && (m.specularMap.value = f.specularMap, t(f.specularMap, m.specularMapTransform)), f.alphaTest > 0 && (m.alphaTest.value = f.alphaTest);
    const b = e.get(f), E = b.envMap, y = b.envMapRotation;
    E && (m.envMap.value = E, mi.copy(y), mi.x *= -1, mi.y *= -1, mi.z *= -1, E.isCubeTexture && E.isRenderTargetTexture === false && (mi.y *= -1, mi.z *= -1), m.envMapRotation.value.setFromMatrix4(f0.makeRotationFromEuler(mi)), m.flipEnvMap.value = E.isCubeTexture && E.isRenderTargetTexture === false ? -1 : 1, m.reflectivity.value = f.reflectivity, m.ior.value = f.ior, m.refractionRatio.value = f.refractionRatio), f.lightMap && (m.lightMap.value = f.lightMap, m.lightMapIntensity.value = f.lightMapIntensity, t(f.lightMap, m.lightMapTransform)), f.aoMap && (m.aoMap.value = f.aoMap, m.aoMapIntensity.value = f.aoMapIntensity, t(f.aoMap, m.aoMapTransform));
  }
  function a(m, f) {
    m.diffuse.value.copy(f.color), m.opacity.value = f.opacity, f.map && (m.map.value = f.map, t(f.map, m.mapTransform));
  }
  function o(m, f) {
    m.dashSize.value = f.dashSize, m.totalSize.value = f.dashSize + f.gapSize, m.scale.value = f.scale;
  }
  function l(m, f, b, E) {
    m.diffuse.value.copy(f.color), m.opacity.value = f.opacity, m.size.value = f.size * b, m.scale.value = E * 0.5, f.map && (m.map.value = f.map, t(f.map, m.uvTransform)), f.alphaMap && (m.alphaMap.value = f.alphaMap, t(f.alphaMap, m.alphaMapTransform)), f.alphaTest > 0 && (m.alphaTest.value = f.alphaTest);
  }
  function c(m, f) {
    m.diffuse.value.copy(f.color), m.opacity.value = f.opacity, m.rotation.value = f.rotation, f.map && (m.map.value = f.map, t(f.map, m.mapTransform)), f.alphaMap && (m.alphaMap.value = f.alphaMap, t(f.alphaMap, m.alphaMapTransform)), f.alphaTest > 0 && (m.alphaTest.value = f.alphaTest);
  }
  function u(m, f) {
    m.specular.value.copy(f.specular), m.shininess.value = Math.max(f.shininess, 1e-4);
  }
  function h(m, f) {
    f.gradientMap && (m.gradientMap.value = f.gradientMap);
  }
  function d(m, f) {
    m.metalness.value = f.metalness, f.metalnessMap && (m.metalnessMap.value = f.metalnessMap, t(f.metalnessMap, m.metalnessMapTransform)), m.roughness.value = f.roughness, f.roughnessMap && (m.roughnessMap.value = f.roughnessMap, t(f.roughnessMap, m.roughnessMapTransform)), f.envMap && (m.envMapIntensity.value = f.envMapIntensity);
  }
  function p(m, f, b) {
    m.ior.value = f.ior, f.sheen > 0 && (m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen), m.sheenRoughness.value = f.sheenRoughness, f.sheenColorMap && (m.sheenColorMap.value = f.sheenColorMap, t(f.sheenColorMap, m.sheenColorMapTransform)), f.sheenRoughnessMap && (m.sheenRoughnessMap.value = f.sheenRoughnessMap, t(f.sheenRoughnessMap, m.sheenRoughnessMapTransform))), f.clearcoat > 0 && (m.clearcoat.value = f.clearcoat, m.clearcoatRoughness.value = f.clearcoatRoughness, f.clearcoatMap && (m.clearcoatMap.value = f.clearcoatMap, t(f.clearcoatMap, m.clearcoatMapTransform)), f.clearcoatRoughnessMap && (m.clearcoatRoughnessMap.value = f.clearcoatRoughnessMap, t(f.clearcoatRoughnessMap, m.clearcoatRoughnessMapTransform)), f.clearcoatNormalMap && (m.clearcoatNormalMap.value = f.clearcoatNormalMap, t(f.clearcoatNormalMap, m.clearcoatNormalMapTransform), m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale), f.side === Ut && m.clearcoatNormalScale.value.negate())), f.dispersion > 0 && (m.dispersion.value = f.dispersion), f.iridescence > 0 && (m.iridescence.value = f.iridescence, m.iridescenceIOR.value = f.iridescenceIOR, m.iridescenceThicknessMinimum.value = f.iridescenceThicknessRange[0], m.iridescenceThicknessMaximum.value = f.iridescenceThicknessRange[1], f.iridescenceMap && (m.iridescenceMap.value = f.iridescenceMap, t(f.iridescenceMap, m.iridescenceMapTransform)), f.iridescenceThicknessMap && (m.iridescenceThicknessMap.value = f.iridescenceThicknessMap, t(f.iridescenceThicknessMap, m.iridescenceThicknessMapTransform))), f.transmission > 0 && (m.transmission.value = f.transmission, m.transmissionSamplerMap.value = b.texture, m.transmissionSamplerSize.value.set(b.width, b.height), f.transmissionMap && (m.transmissionMap.value = f.transmissionMap, t(f.transmissionMap, m.transmissionMapTransform)), m.thickness.value = f.thickness, f.thicknessMap && (m.thicknessMap.value = f.thicknessMap, t(f.thicknessMap, m.thicknessMapTransform)), m.attenuationDistance.value = f.attenuationDistance, m.attenuationColor.value.copy(f.attenuationColor)), f.anisotropy > 0 && (m.anisotropyVector.value.set(f.anisotropy * Math.cos(f.anisotropyRotation), f.anisotropy * Math.sin(f.anisotropyRotation)), f.anisotropyMap && (m.anisotropyMap.value = f.anisotropyMap, t(f.anisotropyMap, m.anisotropyMapTransform))), m.specularIntensity.value = f.specularIntensity, m.specularColor.value.copy(f.specularColor), f.specularColorMap && (m.specularColorMap.value = f.specularColorMap, t(f.specularColorMap, m.specularColorMapTransform)), f.specularIntensityMap && (m.specularIntensityMap.value = f.specularIntensityMap, t(f.specularIntensityMap, m.specularIntensityMapTransform));
  }
  function g(m, f) {
    f.matcap && (m.matcap.value = f.matcap);
  }
  function _(m, f) {
    const b = e.get(f).light;
    m.referencePosition.value.setFromMatrixPosition(b.matrixWorld), m.nearDistance.value = b.shadow.camera.near, m.farDistance.value = b.shadow.camera.far;
  }
  return { refreshFogUniforms: n, refreshMaterialUniforms: s };
}
function m0(i, e, t, n) {
  let s = {}, r = {}, a = [];
  const o = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
  function l(b, E) {
    const y = E.program;
    n.uniformBlockBinding(b, y);
  }
  function c(b, E) {
    let y = s[b.id];
    y === void 0 && (g(b), y = u(b), s[b.id] = y, b.addEventListener("dispose", m));
    const w = E.program;
    n.updateUBOMapping(b, w);
    const C = e.render.frame;
    r[b.id] !== C && (d(b), r[b.id] = C);
  }
  function u(b) {
    const E = h();
    b.__bindingPointIndex = E;
    const y = i.createBuffer(), w = b.__size, C = b.usage;
    return i.bindBuffer(i.UNIFORM_BUFFER, y), i.bufferData(i.UNIFORM_BUFFER, w, C), i.bindBuffer(i.UNIFORM_BUFFER, null), i.bindBufferBase(i.UNIFORM_BUFFER, E, y), y;
  }
  function h() {
    for (let b = 0; b < o; b++) if (a.indexOf(b) === -1) return a.push(b), b;
    return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function d(b) {
    const E = s[b.id], y = b.uniforms, w = b.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, E);
    for (let C = 0, R = y.length; C < R; C++) {
      const N = Array.isArray(y[C]) ? y[C] : [y[C]];
      for (let S = 0, M = N.length; S < M; S++) {
        const P = N[S];
        if (p(P, C, S, w) === true) {
          const k = P.__offset, V = Array.isArray(P.value) ? P.value : [P.value];
          let j = 0;
          for (let q = 0; q < V.length; q++) {
            const W = V[q], K = _(W);
            typeof W == "number" || typeof W == "boolean" ? (P.__data[0] = W, i.bufferSubData(i.UNIFORM_BUFFER, k + j, P.__data)) : W.isMatrix3 ? (P.__data[0] = W.elements[0], P.__data[1] = W.elements[1], P.__data[2] = W.elements[2], P.__data[3] = 0, P.__data[4] = W.elements[3], P.__data[5] = W.elements[4], P.__data[6] = W.elements[5], P.__data[7] = 0, P.__data[8] = W.elements[6], P.__data[9] = W.elements[7], P.__data[10] = W.elements[8], P.__data[11] = 0) : (W.toArray(P.__data, j), j += K.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          i.bufferSubData(i.UNIFORM_BUFFER, k, P.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function p(b, E, y, w) {
    const C = b.value, R = E + "_" + y;
    if (w[R] === void 0) return typeof C == "number" || typeof C == "boolean" ? w[R] = C : w[R] = C.clone(), true;
    {
      const N = w[R];
      if (typeof C == "number" || typeof C == "boolean") {
        if (N !== C) return w[R] = C, true;
      } else if (N.equals(C) === false) return N.copy(C), true;
    }
    return false;
  }
  function g(b) {
    const E = b.uniforms;
    let y = 0;
    const w = 16;
    for (let R = 0, N = E.length; R < N; R++) {
      const S = Array.isArray(E[R]) ? E[R] : [E[R]];
      for (let M = 0, P = S.length; M < P; M++) {
        const k = S[M], V = Array.isArray(k.value) ? k.value : [k.value];
        for (let j = 0, q = V.length; j < q; j++) {
          const W = V[j], K = _(W), z = y % w, ne = z % K.boundary, ce = z + ne;
          y += ne, ce !== 0 && w - ce < K.storage && (y += w - ce), k.__data = new Float32Array(K.storage / Float32Array.BYTES_PER_ELEMENT), k.__offset = y, y += K.storage;
        }
      }
    }
    const C = y % w;
    return C > 0 && (y += w - C), b.__size = y, b.__cache = {}, this;
  }
  function _(b) {
    const E = { boundary: 0, storage: 0 };
    return typeof b == "number" || typeof b == "boolean" ? (E.boundary = 4, E.storage = 4) : b.isVector2 ? (E.boundary = 8, E.storage = 8) : b.isVector3 || b.isColor ? (E.boundary = 16, E.storage = 12) : b.isVector4 ? (E.boundary = 16, E.storage = 16) : b.isMatrix3 ? (E.boundary = 48, E.storage = 48) : b.isMatrix4 ? (E.boundary = 64, E.storage = 64) : b.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", b), E;
  }
  function m(b) {
    const E = b.target;
    E.removeEventListener("dispose", m);
    const y = a.indexOf(E.__bindingPointIndex);
    a.splice(y, 1), i.deleteBuffer(s[E.id]), delete s[E.id], delete r[E.id];
  }
  function f() {
    for (const b in s) i.deleteBuffer(s[b]);
    a = [], s = {}, r = {};
  }
  return { bind: l, update: c, dispose: f };
}
class g0 {
  constructor(e = {}) {
    const { canvas: t = fd(), context: n = null, depth: s = true, stencil: r = false, alpha: a = false, antialias: o = false, premultipliedAlpha: l = true, preserveDrawingBuffer: c = false, powerPreference: u = "default", failIfMajorPerformanceCaveat: h = false, reversedDepthBuffer: d = false } = e;
    this.isWebGLRenderer = true;
    let p;
    if (n !== null) {
      if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext) throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      p = n.getContextAttributes().alpha;
    } else p = a;
    const g = new Uint32Array(4), _ = new Int32Array(4);
    let m = null, f = null;
    const b = [], E = [];
    this.domElement = t, this.debug = { checkShaderErrors: true, onShaderError: null }, this.autoClear = true, this.autoClearColor = true, this.autoClearDepth = true, this.autoClearStencil = true, this.sortObjects = true, this.clippingPlanes = [], this.localClippingEnabled = false, this.toneMapping = ri, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
    const y = this;
    let w = false;
    this._outputColorSpace = yt;
    let C = 0, R = 0, N = null, S = -1, M = null;
    const P = new Ke(), k = new Ke();
    let V = null;
    const j = new we(0);
    let q = 0, W = t.width, K = t.height, z = 1, ne = null, ce = null;
    const Me = new Ke(0, 0, W, K), Ne = new Ke(0, 0, W, K);
    let Ye = false;
    const nt = new Jo();
    let We = false, X = false;
    const Z = new Be(), ue = new L(), Re = new Ke(), xe = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: true };
    let He = false;
    function xt() {
      return N === null ? z : 1;
    }
    let A = n;
    function lt(v, I) {
      return t.getContext(v, I);
    }
    try {
      const v = { alpha: true, depth: s, stencil: r, antialias: o, premultipliedAlpha: l, preserveDrawingBuffer: c, powerPreference: u, failIfMajorPerformanceCaveat: h };
      if ("setAttribute" in t && t.setAttribute("data-engine", `three.js r${Oo}`), t.addEventListener("webglcontextlost", se, false), t.addEventListener("webglcontextrestored", de, false), t.addEventListener("webglcontextcreationerror", J, false), A === null) {
        const I = "webgl2";
        if (A = lt(I, v), A === null) throw lt(I) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
    } catch (v) {
      throw console.error("THREE.WebGLRenderer: " + v.message), v;
    }
    let Ie, Pe, me, ct, ge, ke, Et, mt, T, x, F, G, $, H, Se, ie, _e, ve, ee, le, Ce, ye, ae, Fe;
    function D() {
      Ie = new Ag(A), Ie.init(), ye = new l0(A, Ie), Pe = new vg(A, Ie, e, ye), me = new a0(A, Ie), Pe.reversedDepthBuffer && d && me.buffers.depth.setReversed(true), ct = new Cg(A), ge = new Y_(), ke = new o0(A, Ie, me, ge, Pe, ye, ct), Et = new Mg(y), mt = new bg(y), T = new Nf(A), ae = new _g(A, T), x = new wg(A, T, ct, ae), F = new Lg(A, x, T, ct), ee = new Pg(A, Pe, ke), ie = new yg(ge), G = new q_(y, Et, mt, Ie, Pe, ae, ie), $ = new p0(y, ge), H = new K_(), Se = new t0(Ie), ve = new gg(y, Et, mt, me, F, p, l), _e = new s0(y, F, Pe), Fe = new m0(A, ct, Pe, me), le = new xg(A, Ie, ct), Ce = new Rg(A, Ie, ct), ct.programs = G.programs, y.capabilities = Pe, y.extensions = Ie, y.properties = ge, y.renderLists = H, y.shadowMap = _e, y.state = me, y.info = ct;
    }
    D();
    const te = new d0(y, A);
    this.xr = te, this.getContext = function() {
      return A;
    }, this.getContextAttributes = function() {
      return A.getContextAttributes();
    }, this.forceContextLoss = function() {
      const v = Ie.get("WEBGL_lose_context");
      v && v.loseContext();
    }, this.forceContextRestore = function() {
      const v = Ie.get("WEBGL_lose_context");
      v && v.restoreContext();
    }, this.getPixelRatio = function() {
      return z;
    }, this.setPixelRatio = function(v) {
      v !== void 0 && (z = v, this.setSize(W, K, false));
    }, this.getSize = function(v) {
      return v.set(W, K);
    }, this.setSize = function(v, I, O = true) {
      if (te.isPresenting) {
        console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      W = v, K = I, t.width = Math.floor(v * z), t.height = Math.floor(I * z), O === true && (t.style.width = v + "px", t.style.height = I + "px"), this.setViewport(0, 0, v, I);
    }, this.getDrawingBufferSize = function(v) {
      return v.set(W * z, K * z).floor();
    }, this.setDrawingBufferSize = function(v, I, O) {
      W = v, K = I, z = O, t.width = Math.floor(v * O), t.height = Math.floor(I * O), this.setViewport(0, 0, v, I);
    }, this.getCurrentViewport = function(v) {
      return v.copy(P);
    }, this.getViewport = function(v) {
      return v.copy(Me);
    }, this.setViewport = function(v, I, O, B) {
      v.isVector4 ? Me.set(v.x, v.y, v.z, v.w) : Me.set(v, I, O, B), me.viewport(P.copy(Me).multiplyScalar(z).round());
    }, this.getScissor = function(v) {
      return v.copy(Ne);
    }, this.setScissor = function(v, I, O, B) {
      v.isVector4 ? Ne.set(v.x, v.y, v.z, v.w) : Ne.set(v, I, O, B), me.scissor(k.copy(Ne).multiplyScalar(z).round());
    }, this.getScissorTest = function() {
      return Ye;
    }, this.setScissorTest = function(v) {
      me.setScissorTest(Ye = v);
    }, this.setOpaqueSort = function(v) {
      ne = v;
    }, this.setTransparentSort = function(v) {
      ce = v;
    }, this.getClearColor = function(v) {
      return v.copy(ve.getClearColor());
    }, this.setClearColor = function() {
      ve.setClearColor(...arguments);
    }, this.getClearAlpha = function() {
      return ve.getClearAlpha();
    }, this.setClearAlpha = function() {
      ve.setClearAlpha(...arguments);
    }, this.clear = function(v = true, I = true, O = true) {
      let B = 0;
      if (v) {
        let U = false;
        if (N !== null) {
          const Q = N.texture.format;
          U = Q === Xo || Q === Wo || Q === Go;
        }
        if (U) {
          const Q = N.texture.type, oe = Q === En || Q === Ti || Q === Is || Q === Us || Q === zo || Q === Ho, fe = ve.getClearColor(), he = ve.getClearAlpha(), Ae = fe.r, Le = fe.g, Te = fe.b;
          oe ? (g[0] = Ae, g[1] = Le, g[2] = Te, g[3] = he, A.clearBufferuiv(A.COLOR, 0, g)) : (_[0] = Ae, _[1] = Le, _[2] = Te, _[3] = he, A.clearBufferiv(A.COLOR, 0, _));
        } else B |= A.COLOR_BUFFER_BIT;
      }
      I && (B |= A.DEPTH_BUFFER_BIT), O && (B |= A.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), A.clear(B);
    }, this.clearColor = function() {
      this.clear(true, false, false);
    }, this.clearDepth = function() {
      this.clear(false, true, false);
    }, this.clearStencil = function() {
      this.clear(false, false, true);
    }, this.dispose = function() {
      t.removeEventListener("webglcontextlost", se, false), t.removeEventListener("webglcontextrestored", de, false), t.removeEventListener("webglcontextcreationerror", J, false), ve.dispose(), H.dispose(), Se.dispose(), ge.dispose(), Et.dispose(), mt.dispose(), F.dispose(), ae.dispose(), Fe.dispose(), G.dispose(), te.dispose(), te.removeEventListener("sessionstart", gn), te.removeEventListener("sessionend", hl), li.stop();
    };
    function se(v) {
      v.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), w = true;
    }
    function de() {
      console.log("THREE.WebGLRenderer: Context Restored."), w = false;
      const v = ct.autoReset, I = _e.enabled, O = _e.autoUpdate, B = _e.needsUpdate, U = _e.type;
      D(), ct.autoReset = v, _e.enabled = I, _e.autoUpdate = O, _e.needsUpdate = B, _e.type = U;
    }
    function J(v) {
      console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", v.statusMessage);
    }
    function Y(v) {
      const I = v.target;
      I.removeEventListener("dispose", Y), pe(I);
    }
    function pe(v) {
      De(v), ge.remove(v);
    }
    function De(v) {
      const I = ge.get(v).programs;
      I !== void 0 && (I.forEach(function(O) {
        G.releaseProgram(O);
      }), v.isShaderMaterial && G.releaseShaderCache(v));
    }
    this.renderBufferDirect = function(v, I, O, B, U, Q) {
      I === null && (I = xe);
      const oe = U.isMesh && U.matrixWorld.determinant() < 0, fe = iu(v, I, O, B, U);
      me.setMaterial(B, oe);
      let he = O.index, Ae = 1;
      if (B.wireframe === true) {
        if (he = x.getWireframeAttribute(O), he === void 0) return;
        Ae = 2;
      }
      const Le = O.drawRange, Te = O.attributes.position;
      let Xe = Le.start * Ae, Qe = (Le.start + Le.count) * Ae;
      Q !== null && (Xe = Math.max(Xe, Q.start * Ae), Qe = Math.min(Qe, (Q.start + Q.count) * Ae)), he !== null ? (Xe = Math.max(Xe, 0), Qe = Math.min(Qe, he.count)) : Te != null && (Xe = Math.max(Xe, 0), Qe = Math.min(Qe, Te.count));
      const ft = Qe - Xe;
      if (ft < 0 || ft === 1 / 0) return;
      ae.setup(U, B, fe, O, he);
      let rt, it = le;
      if (he !== null && (rt = T.get(he), it = Ce, it.setIndex(rt)), U.isMesh) B.wireframe === true ? (me.setLineWidth(B.wireframeLinewidth * xt()), it.setMode(A.LINES)) : it.setMode(A.TRIANGLES);
      else if (U.isLine) {
        let be = B.linewidth;
        be === void 0 && (be = 1), me.setLineWidth(be * xt()), U.isLineSegments ? it.setMode(A.LINES) : U.isLineLoop ? it.setMode(A.LINE_LOOP) : it.setMode(A.LINE_STRIP);
      } else U.isPoints ? it.setMode(A.POINTS) : U.isSprite && it.setMode(A.TRIANGLES);
      if (U.isBatchedMesh) if (U._multiDrawInstances !== null) zs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."), it.renderMultiDrawInstances(U._multiDrawStarts, U._multiDrawCounts, U._multiDrawCount, U._multiDrawInstances);
      else if (Ie.get("WEBGL_multi_draw")) it.renderMultiDraw(U._multiDrawStarts, U._multiDrawCounts, U._multiDrawCount);
      else {
        const be = U._multiDrawStarts, ht = U._multiDrawCounts, je = U._multiDrawCount, Vt = he ? T.get(he).bytesPerElement : 1, Pi = ge.get(B).currentProgram.getUniforms();
        for (let Gt = 0; Gt < je; Gt++) Pi.setValue(A, "_gl_DrawID", Gt), it.render(be[Gt] / Vt, ht[Gt]);
      }
      else if (U.isInstancedMesh) it.renderInstances(Xe, ft, U.count);
      else if (O.isInstancedBufferGeometry) {
        const be = O._maxInstanceCount !== void 0 ? O._maxInstanceCount : 1 / 0, ht = Math.min(O.instanceCount, be);
        it.renderInstances(Xe, ft, ht);
      } else it.render(Xe, ft);
    };
    function st(v, I, O) {
      v.transparent === true && v.side === Mn && v.forceSinglePass === false ? (v.side = Ut, v.needsUpdate = true, Xs(v, I, O), v.side = Vn, v.needsUpdate = true, Xs(v, I, O), v.side = Mn) : Xs(v, I, O);
    }
    this.compile = function(v, I, O = null) {
      O === null && (O = v), f = Se.get(O), f.init(I), E.push(f), O.traverseVisible(function(U) {
        U.isLight && U.layers.test(I.layers) && (f.pushLight(U), U.castShadow && f.pushShadow(U));
      }), v !== O && v.traverseVisible(function(U) {
        U.isLight && U.layers.test(I.layers) && (f.pushLight(U), U.castShadow && f.pushShadow(U));
      }), f.setupLights();
      const B = /* @__PURE__ */ new Set();
      return v.traverse(function(U) {
        if (!(U.isMesh || U.isPoints || U.isLine || U.isSprite)) return;
        const Q = U.material;
        if (Q) if (Array.isArray(Q)) for (let oe = 0; oe < Q.length; oe++) {
          const fe = Q[oe];
          st(fe, O, U), B.add(fe);
        }
        else st(Q, O, U), B.add(Q);
      }), f = E.pop(), B;
    }, this.compileAsync = function(v, I, O = null) {
      const B = this.compile(v, I, O);
      return new Promise((U) => {
        function Q() {
          if (B.forEach(function(oe) {
            ge.get(oe).currentProgram.isReady() && B.delete(oe);
          }), B.size === 0) {
            U(v);
            return;
          }
          setTimeout(Q, 10);
        }
        Ie.get("KHR_parallel_shader_compile") !== null ? Q() : setTimeout(Q, 10);
      });
    };
    let Ze = null;
    function Rn(v) {
      Ze && Ze(v);
    }
    function gn() {
      li.stop();
    }
    function hl() {
      li.start();
    }
    const li = new Uh();
    li.setAnimationLoop(Rn), typeof self < "u" && li.setContext(self), this.setAnimationLoop = function(v) {
      Ze = v, te.setAnimationLoop(v), v === null ? li.stop() : li.start();
    }, te.addEventListener("sessionstart", gn), te.addEventListener("sessionend", hl), this.render = function(v, I) {
      if (I !== void 0 && I.isCamera !== true) {
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (w === true) return;
      if (v.matrixWorldAutoUpdate === true && v.updateMatrixWorld(), I.parent === null && I.matrixWorldAutoUpdate === true && I.updateMatrixWorld(), te.enabled === true && te.isPresenting === true && (te.cameraAutoUpdate === true && te.updateCamera(I), I = te.getCamera()), v.isScene === true && v.onBeforeRender(y, v, I, N), f = Se.get(v, E.length), f.init(I), E.push(f), Z.multiplyMatrices(I.projectionMatrix, I.matrixWorldInverse), nt.setFromProjectionMatrix(Z, Sn, I.reversedDepth), X = this.localClippingEnabled, We = ie.init(this.clippingPlanes, X), m = H.get(v, b.length), m.init(), b.push(m), te.enabled === true && te.isPresenting === true) {
        const Q = y.xr.getDepthSensingMesh();
        Q !== null && qr(Q, I, -1 / 0, y.sortObjects);
      }
      qr(v, I, 0, y.sortObjects), m.finish(), y.sortObjects === true && m.sort(ne, ce), He = te.enabled === false || te.isPresenting === false || te.hasDepthSensing() === false, He && ve.addToRenderList(m, v), this.info.render.frame++, We === true && ie.beginShadows();
      const O = f.state.shadowsArray;
      _e.render(O, v, I), We === true && ie.endShadows(), this.info.autoReset === true && this.info.reset();
      const B = m.opaque, U = m.transmissive;
      if (f.setupLights(), I.isArrayCamera) {
        const Q = I.cameras;
        if (U.length > 0) for (let oe = 0, fe = Q.length; oe < fe; oe++) {
          const he = Q[oe];
          dl(B, U, v, he);
        }
        He && ve.render(v);
        for (let oe = 0, fe = Q.length; oe < fe; oe++) {
          const he = Q[oe];
          ul(m, v, he, he.viewport);
        }
      } else U.length > 0 && dl(B, U, v, I), He && ve.render(v), ul(m, v, I);
      N !== null && R === 0 && (ke.updateMultisampleRenderTarget(N), ke.updateRenderTargetMipmap(N)), v.isScene === true && v.onAfterRender(y, v, I), ae.resetDefaultState(), S = -1, M = null, E.pop(), E.length > 0 ? (f = E[E.length - 1], We === true && ie.setGlobalState(y.clippingPlanes, f.state.camera)) : f = null, b.pop(), b.length > 0 ? m = b[b.length - 1] : m = null;
    };
    function qr(v, I, O, B) {
      if (v.visible === false) return;
      if (v.layers.test(I.layers)) {
        if (v.isGroup) O = v.renderOrder;
        else if (v.isLOD) v.autoUpdate === true && v.update(I);
        else if (v.isLight) f.pushLight(v), v.castShadow && f.pushShadow(v);
        else if (v.isSprite) {
          if (!v.frustumCulled || nt.intersectsSprite(v)) {
            B && Re.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Z);
            const oe = F.update(v), fe = v.material;
            fe.visible && m.push(v, oe, fe, O, Re.z, null);
          }
        } else if ((v.isMesh || v.isLine || v.isPoints) && (!v.frustumCulled || nt.intersectsObject(v))) {
          const oe = F.update(v), fe = v.material;
          if (B && (v.boundingSphere !== void 0 ? (v.boundingSphere === null && v.computeBoundingSphere(), Re.copy(v.boundingSphere.center)) : (oe.boundingSphere === null && oe.computeBoundingSphere(), Re.copy(oe.boundingSphere.center)), Re.applyMatrix4(v.matrixWorld).applyMatrix4(Z)), Array.isArray(fe)) {
            const he = oe.groups;
            for (let Ae = 0, Le = he.length; Ae < Le; Ae++) {
              const Te = he[Ae], Xe = fe[Te.materialIndex];
              Xe && Xe.visible && m.push(v, oe, Xe, O, Re.z, Te);
            }
          } else fe.visible && m.push(v, oe, fe, O, Re.z, null);
        }
      }
      const Q = v.children;
      for (let oe = 0, fe = Q.length; oe < fe; oe++) qr(Q[oe], I, O, B);
    }
    function ul(v, I, O, B) {
      const U = v.opaque, Q = v.transmissive, oe = v.transparent;
      f.setupLightsView(O), We === true && ie.setGlobalState(y.clippingPlanes, O), B && me.viewport(P.copy(B)), U.length > 0 && Ws(U, I, O), Q.length > 0 && Ws(Q, I, O), oe.length > 0 && Ws(oe, I, O), me.buffers.depth.setTest(true), me.buffers.depth.setMask(true), me.buffers.color.setMask(true), me.setPolygonOffset(false);
    }
    function dl(v, I, O, B) {
      if ((O.isScene === true ? O.overrideMaterial : null) !== null) return;
      f.state.transmissionRenderTarget[B.id] === void 0 && (f.state.transmissionRenderTarget[B.id] = new bi(1, 1, { generateMipmaps: true, type: Ie.has("EXT_color_buffer_half_float") || Ie.has("EXT_color_buffer_float") ? hs : En, minFilter: On, samples: 4, stencilBuffer: r, resolveDepthBuffer: false, resolveStencilBuffer: false, colorSpace: qe.workingColorSpace }));
      const Q = f.state.transmissionRenderTarget[B.id], oe = B.viewport || P;
      Q.setSize(oe.z * y.transmissionResolutionScale, oe.w * y.transmissionResolutionScale);
      const fe = y.getRenderTarget(), he = y.getActiveCubeFace(), Ae = y.getActiveMipmapLevel();
      y.setRenderTarget(Q), y.getClearColor(j), q = y.getClearAlpha(), q < 1 && y.setClearColor(16777215, 0.5), y.clear(), He && ve.render(O);
      const Le = y.toneMapping;
      y.toneMapping = ri;
      const Te = B.viewport;
      if (B.viewport !== void 0 && (B.viewport = void 0), f.setupLightsView(B), We === true && ie.setGlobalState(y.clippingPlanes, B), Ws(v, O, B), ke.updateMultisampleRenderTarget(Q), ke.updateRenderTargetMipmap(Q), Ie.has("WEBGL_multisampled_render_to_texture") === false) {
        let Xe = false;
        for (let Qe = 0, ft = I.length; Qe < ft; Qe++) {
          const rt = I[Qe], it = rt.object, be = rt.geometry, ht = rt.material, je = rt.group;
          if (ht.side === Mn && it.layers.test(B.layers)) {
            const Vt = ht.side;
            ht.side = Ut, ht.needsUpdate = true, fl(it, O, B, be, ht, je), ht.side = Vt, ht.needsUpdate = true, Xe = true;
          }
        }
        Xe === true && (ke.updateMultisampleRenderTarget(Q), ke.updateRenderTargetMipmap(Q));
      }
      y.setRenderTarget(fe, he, Ae), y.setClearColor(j, q), Te !== void 0 && (B.viewport = Te), y.toneMapping = Le;
    }
    function Ws(v, I, O) {
      const B = I.isScene === true ? I.overrideMaterial : null;
      for (let U = 0, Q = v.length; U < Q; U++) {
        const oe = v[U], fe = oe.object, he = oe.geometry, Ae = oe.group;
        let Le = oe.material;
        Le.allowOverride === true && B !== null && (Le = B), fe.layers.test(O.layers) && fl(fe, I, O, he, Le, Ae);
      }
    }
    function fl(v, I, O, B, U, Q) {
      v.onBeforeRender(y, I, O, B, U, Q), v.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse, v.matrixWorld), v.normalMatrix.getNormalMatrix(v.modelViewMatrix), U.onBeforeRender(y, I, O, B, v, Q), U.transparent === true && U.side === Mn && U.forceSinglePass === false ? (U.side = Ut, U.needsUpdate = true, y.renderBufferDirect(O, I, B, U, v, Q), U.side = Vn, U.needsUpdate = true, y.renderBufferDirect(O, I, B, U, v, Q), U.side = Mn) : y.renderBufferDirect(O, I, B, U, v, Q), v.onAfterRender(y, I, O, B, U, Q);
    }
    function Xs(v, I, O) {
      I.isScene !== true && (I = xe);
      const B = ge.get(v), U = f.state.lights, Q = f.state.shadowsArray, oe = U.state.version, fe = G.getParameters(v, U.state, Q, I, O), he = G.getProgramCacheKey(fe);
      let Ae = B.programs;
      B.environment = v.isMeshStandardMaterial ? I.environment : null, B.fog = I.fog, B.envMap = (v.isMeshStandardMaterial ? mt : Et).get(v.envMap || B.environment), B.envMapRotation = B.environment !== null && v.envMap === null ? I.environmentRotation : v.envMapRotation, Ae === void 0 && (v.addEventListener("dispose", Y), Ae = /* @__PURE__ */ new Map(), B.programs = Ae);
      let Le = Ae.get(he);
      if (Le !== void 0) {
        if (B.currentProgram === Le && B.lightsStateVersion === oe) return ml(v, fe), Le;
      } else fe.uniforms = G.getUniforms(v), v.onBeforeCompile(fe, y), Le = G.acquireProgram(fe, he), Ae.set(he, Le), B.uniforms = fe.uniforms;
      const Te = B.uniforms;
      return (!v.isShaderMaterial && !v.isRawShaderMaterial || v.clipping === true) && (Te.clippingPlanes = ie.uniform), ml(v, fe), B.needsLights = ru(v), B.lightsStateVersion = oe, B.needsLights && (Te.ambientLightColor.value = U.state.ambient, Te.lightProbe.value = U.state.probe, Te.directionalLights.value = U.state.directional, Te.directionalLightShadows.value = U.state.directionalShadow, Te.spotLights.value = U.state.spot, Te.spotLightShadows.value = U.state.spotShadow, Te.rectAreaLights.value = U.state.rectArea, Te.ltc_1.value = U.state.rectAreaLTC1, Te.ltc_2.value = U.state.rectAreaLTC2, Te.pointLights.value = U.state.point, Te.pointLightShadows.value = U.state.pointShadow, Te.hemisphereLights.value = U.state.hemi, Te.directionalShadowMap.value = U.state.directionalShadowMap, Te.directionalShadowMatrix.value = U.state.directionalShadowMatrix, Te.spotShadowMap.value = U.state.spotShadowMap, Te.spotLightMatrix.value = U.state.spotLightMatrix, Te.spotLightMap.value = U.state.spotLightMap, Te.pointShadowMap.value = U.state.pointShadowMap, Te.pointShadowMatrix.value = U.state.pointShadowMatrix), B.currentProgram = Le, B.uniformsList = null, Le;
    }
    function pl(v) {
      if (v.uniformsList === null) {
        const I = v.currentProgram.getUniforms();
        v.uniformsList = wr.seqWithValue(I.seq, v.uniforms);
      }
      return v.uniformsList;
    }
    function ml(v, I) {
      const O = ge.get(v);
      O.outputColorSpace = I.outputColorSpace, O.batching = I.batching, O.batchingColor = I.batchingColor, O.instancing = I.instancing, O.instancingColor = I.instancingColor, O.instancingMorph = I.instancingMorph, O.skinning = I.skinning, O.morphTargets = I.morphTargets, O.morphNormals = I.morphNormals, O.morphColors = I.morphColors, O.morphTargetsCount = I.morphTargetsCount, O.numClippingPlanes = I.numClippingPlanes, O.numIntersection = I.numClipIntersection, O.vertexAlphas = I.vertexAlphas, O.vertexTangents = I.vertexTangents, O.toneMapping = I.toneMapping;
    }
    function iu(v, I, O, B, U) {
      I.isScene !== true && (I = xe), ke.resetTextureUnits();
      const Q = I.fog, oe = B.isMeshStandardMaterial ? I.environment : null, fe = N === null ? y.outputColorSpace : N.isXRRenderTarget === true ? N.texture.colorSpace : Ct, he = (B.isMeshStandardMaterial ? mt : Et).get(B.envMap || oe), Ae = B.vertexColors === true && !!O.attributes.color && O.attributes.color.itemSize === 4, Le = !!O.attributes.tangent && (!!B.normalMap || B.anisotropy > 0), Te = !!O.morphAttributes.position, Xe = !!O.morphAttributes.normal, Qe = !!O.morphAttributes.color;
      let ft = ri;
      B.toneMapped && (N === null || N.isXRRenderTarget === true) && (ft = y.toneMapping);
      const rt = O.morphAttributes.position || O.morphAttributes.normal || O.morphAttributes.color, it = rt !== void 0 ? rt.length : 0, be = ge.get(B), ht = f.state.lights;
      if (We === true && (X === true || v !== M)) {
        const Pt = v === M && B.id === S;
        ie.setState(B, v, Pt);
      }
      let je = false;
      B.version === be.__version ? (be.needsLights && be.lightsStateVersion !== ht.state.version || be.outputColorSpace !== fe || U.isBatchedMesh && be.batching === false || !U.isBatchedMesh && be.batching === true || U.isBatchedMesh && be.batchingColor === true && U.colorTexture === null || U.isBatchedMesh && be.batchingColor === false && U.colorTexture !== null || U.isInstancedMesh && be.instancing === false || !U.isInstancedMesh && be.instancing === true || U.isSkinnedMesh && be.skinning === false || !U.isSkinnedMesh && be.skinning === true || U.isInstancedMesh && be.instancingColor === true && U.instanceColor === null || U.isInstancedMesh && be.instancingColor === false && U.instanceColor !== null || U.isInstancedMesh && be.instancingMorph === true && U.morphTexture === null || U.isInstancedMesh && be.instancingMorph === false && U.morphTexture !== null || be.envMap !== he || B.fog === true && be.fog !== Q || be.numClippingPlanes !== void 0 && (be.numClippingPlanes !== ie.numPlanes || be.numIntersection !== ie.numIntersection) || be.vertexAlphas !== Ae || be.vertexTangents !== Le || be.morphTargets !== Te || be.morphNormals !== Xe || be.morphColors !== Qe || be.toneMapping !== ft || be.morphTargetsCount !== it) && (je = true) : (je = true, be.__version = B.version);
      let Vt = be.currentProgram;
      je === true && (Vt = Xs(B, I, U));
      let Pi = false, Gt = false, _s = false;
      const ut = Vt.getUniforms(), Zt = be.uniforms;
      if (me.useProgram(Vt.program) && (Pi = true, Gt = true, _s = true), B.id !== S && (S = B.id, Gt = true), Pi || M !== v) {
        me.buffers.depth.getReversed() && v.reversedDepth !== true && (v._reversedDepth = true, v.updateProjectionMatrix()), ut.setValue(A, "projectionMatrix", v.projectionMatrix), ut.setValue(A, "viewMatrix", v.matrixWorldInverse);
        const Bt = ut.map.cameraPosition;
        Bt !== void 0 && Bt.setValue(A, ue.setFromMatrixPosition(v.matrixWorld)), Pe.logarithmicDepthBuffer && ut.setValue(A, "logDepthBufFC", 2 / (Math.log(v.far + 1) / Math.LN2)), (B.isMeshPhongMaterial || B.isMeshToonMaterial || B.isMeshLambertMaterial || B.isMeshBasicMaterial || B.isMeshStandardMaterial || B.isShaderMaterial) && ut.setValue(A, "isOrthographic", v.isOrthographicCamera === true), M !== v && (M = v, Gt = true, _s = true);
      }
      if (U.isSkinnedMesh) {
        ut.setOptional(A, U, "bindMatrix"), ut.setOptional(A, U, "bindMatrixInverse");
        const Pt = U.skeleton;
        Pt && (Pt.boneTexture === null && Pt.computeBoneTexture(), ut.setValue(A, "boneTexture", Pt.boneTexture, ke));
      }
      U.isBatchedMesh && (ut.setOptional(A, U, "batchingTexture"), ut.setValue(A, "batchingTexture", U._matricesTexture, ke), ut.setOptional(A, U, "batchingIdTexture"), ut.setValue(A, "batchingIdTexture", U._indirectTexture, ke), ut.setOptional(A, U, "batchingColorTexture"), U._colorsTexture !== null && ut.setValue(A, "batchingColorTexture", U._colorsTexture, ke));
      const $t = O.morphAttributes;
      if (($t.position !== void 0 || $t.normal !== void 0 || $t.color !== void 0) && ee.update(U, O, Vt), (Gt || be.receiveShadow !== U.receiveShadow) && (be.receiveShadow = U.receiveShadow, ut.setValue(A, "receiveShadow", U.receiveShadow)), B.isMeshGouraudMaterial && B.envMap !== null && (Zt.envMap.value = he, Zt.flipEnvMap.value = he.isCubeTexture && he.isRenderTargetTexture === false ? -1 : 1), B.isMeshStandardMaterial && B.envMap === null && I.environment !== null && (Zt.envMapIntensity.value = I.environmentIntensity), Gt && (ut.setValue(A, "toneMappingExposure", y.toneMappingExposure), be.needsLights && su(Zt, _s), Q && B.fog === true && $.refreshFogUniforms(Zt, Q), $.refreshMaterialUniforms(Zt, B, z, K, f.state.transmissionRenderTarget[v.id]), wr.upload(A, pl(be), Zt, ke)), B.isShaderMaterial && B.uniformsNeedUpdate === true && (wr.upload(A, pl(be), Zt, ke), B.uniformsNeedUpdate = false), B.isSpriteMaterial && ut.setValue(A, "center", U.center), ut.setValue(A, "modelViewMatrix", U.modelViewMatrix), ut.setValue(A, "normalMatrix", U.normalMatrix), ut.setValue(A, "modelMatrix", U.matrixWorld), B.isShaderMaterial || B.isRawShaderMaterial) {
        const Pt = B.uniformsGroups;
        for (let Bt = 0, Yr = Pt.length; Bt < Yr; Bt++) {
          const ci = Pt[Bt];
          Fe.update(ci, Vt), Fe.bind(ci, Vt);
        }
      }
      return Vt;
    }
    function su(v, I) {
      v.ambientLightColor.needsUpdate = I, v.lightProbe.needsUpdate = I, v.directionalLights.needsUpdate = I, v.directionalLightShadows.needsUpdate = I, v.pointLights.needsUpdate = I, v.pointLightShadows.needsUpdate = I, v.spotLights.needsUpdate = I, v.spotLightShadows.needsUpdate = I, v.rectAreaLights.needsUpdate = I, v.hemisphereLights.needsUpdate = I;
    }
    function ru(v) {
      return v.isMeshLambertMaterial || v.isMeshToonMaterial || v.isMeshPhongMaterial || v.isMeshStandardMaterial || v.isShadowMaterial || v.isShaderMaterial && v.lights === true;
    }
    this.getActiveCubeFace = function() {
      return C;
    }, this.getActiveMipmapLevel = function() {
      return R;
    }, this.getRenderTarget = function() {
      return N;
    }, this.setRenderTargetTextures = function(v, I, O) {
      const B = ge.get(v);
      B.__autoAllocateDepthBuffer = v.resolveDepthBuffer === false, B.__autoAllocateDepthBuffer === false && (B.__useRenderToTexture = false), ge.get(v.texture).__webglTexture = I, ge.get(v.depthTexture).__webglTexture = B.__autoAllocateDepthBuffer ? void 0 : O, B.__hasExternalTextures = true;
    }, this.setRenderTargetFramebuffer = function(v, I) {
      const O = ge.get(v);
      O.__webglFramebuffer = I, O.__useDefaultFramebuffer = I === void 0;
    };
    const au = A.createFramebuffer();
    this.setRenderTarget = function(v, I = 0, O = 0) {
      N = v, C = I, R = O;
      let B = true, U = null, Q = false, oe = false;
      if (v) {
        const he = ge.get(v);
        if (he.__useDefaultFramebuffer !== void 0) me.bindFramebuffer(A.FRAMEBUFFER, null), B = false;
        else if (he.__webglFramebuffer === void 0) ke.setupRenderTarget(v);
        else if (he.__hasExternalTextures) ke.rebindTextures(v, ge.get(v.texture).__webglTexture, ge.get(v.depthTexture).__webglTexture);
        else if (v.depthBuffer) {
          const Te = v.depthTexture;
          if (he.__boundDepthTexture !== Te) {
            if (Te !== null && ge.has(Te) && (v.width !== Te.image.width || v.height !== Te.image.height)) throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
            ke.setupDepthRenderbuffer(v);
          }
        }
        const Ae = v.texture;
        (Ae.isData3DTexture || Ae.isDataArrayTexture || Ae.isCompressedArrayTexture) && (oe = true);
        const Le = ge.get(v).__webglFramebuffer;
        v.isWebGLCubeRenderTarget ? (Array.isArray(Le[I]) ? U = Le[I][O] : U = Le[I], Q = true) : v.samples > 0 && ke.useMultisampledRTT(v) === false ? U = ge.get(v).__webglMultisampledFramebuffer : Array.isArray(Le) ? U = Le[O] : U = Le, P.copy(v.viewport), k.copy(v.scissor), V = v.scissorTest;
      } else P.copy(Me).multiplyScalar(z).floor(), k.copy(Ne).multiplyScalar(z).floor(), V = Ye;
      if (O !== 0 && (U = au), me.bindFramebuffer(A.FRAMEBUFFER, U) && B && me.drawBuffers(v, U), me.viewport(P), me.scissor(k), me.setScissorTest(V), Q) {
        const he = ge.get(v.texture);
        A.framebufferTexture2D(A.FRAMEBUFFER, A.COLOR_ATTACHMENT0, A.TEXTURE_CUBE_MAP_POSITIVE_X + I, he.__webglTexture, O);
      } else if (oe) {
        const he = I;
        for (let Ae = 0; Ae < v.textures.length; Ae++) {
          const Le = ge.get(v.textures[Ae]);
          A.framebufferTextureLayer(A.FRAMEBUFFER, A.COLOR_ATTACHMENT0 + Ae, Le.__webglTexture, O, he);
        }
      } else if (v !== null && O !== 0) {
        const he = ge.get(v.texture);
        A.framebufferTexture2D(A.FRAMEBUFFER, A.COLOR_ATTACHMENT0, A.TEXTURE_2D, he.__webglTexture, O);
      }
      S = -1;
    }, this.readRenderTargetPixels = function(v, I, O, B, U, Q, oe, fe = 0) {
      if (!(v && v.isWebGLRenderTarget)) {
        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let he = ge.get(v).__webglFramebuffer;
      if (v.isWebGLCubeRenderTarget && oe !== void 0 && (he = he[oe]), he) {
        me.bindFramebuffer(A.FRAMEBUFFER, he);
        try {
          const Ae = v.textures[fe], Le = Ae.format, Te = Ae.type;
          if (!Pe.textureFormatReadable(Le)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!Pe.textureTypeReadable(Te)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          I >= 0 && I <= v.width - B && O >= 0 && O <= v.height - U && (v.textures.length > 1 && A.readBuffer(A.COLOR_ATTACHMENT0 + fe), A.readPixels(I, O, B, U, ye.convert(Le), ye.convert(Te), Q));
        } finally {
          const Ae = N !== null ? ge.get(N).__webglFramebuffer : null;
          me.bindFramebuffer(A.FRAMEBUFFER, Ae);
        }
      }
    }, this.readRenderTargetPixelsAsync = async function(v, I, O, B, U, Q, oe, fe = 0) {
      if (!(v && v.isWebGLRenderTarget)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
      let he = ge.get(v).__webglFramebuffer;
      if (v.isWebGLCubeRenderTarget && oe !== void 0 && (he = he[oe]), he) if (I >= 0 && I <= v.width - B && O >= 0 && O <= v.height - U) {
        me.bindFramebuffer(A.FRAMEBUFFER, he);
        const Ae = v.textures[fe], Le = Ae.format, Te = Ae.type;
        if (!Pe.textureFormatReadable(Le)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
        if (!Pe.textureTypeReadable(Te)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
        const Xe = A.createBuffer();
        A.bindBuffer(A.PIXEL_PACK_BUFFER, Xe), A.bufferData(A.PIXEL_PACK_BUFFER, Q.byteLength, A.STREAM_READ), v.textures.length > 1 && A.readBuffer(A.COLOR_ATTACHMENT0 + fe), A.readPixels(I, O, B, U, ye.convert(Le), ye.convert(Te), 0);
        const Qe = N !== null ? ge.get(N).__webglFramebuffer : null;
        me.bindFramebuffer(A.FRAMEBUFFER, Qe);
        const ft = A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE, 0);
        return A.flush(), await pd(A, ft, 4), A.bindBuffer(A.PIXEL_PACK_BUFFER, Xe), A.getBufferSubData(A.PIXEL_PACK_BUFFER, 0, Q), A.deleteBuffer(Xe), A.deleteSync(ft), Q;
      } else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
    }, this.copyFramebufferToTexture = function(v, I = null, O = 0) {
      const B = Math.pow(2, -O), U = Math.floor(v.image.width * B), Q = Math.floor(v.image.height * B), oe = I !== null ? I.x : 0, fe = I !== null ? I.y : 0;
      ke.setTexture2D(v, 0), A.copyTexSubImage2D(A.TEXTURE_2D, O, 0, 0, oe, fe, U, Q), me.unbindTexture();
    };
    const ou = A.createFramebuffer(), lu = A.createFramebuffer();
    this.copyTextureToTexture = function(v, I, O = null, B = null, U = 0, Q = null) {
      Q === null && (U !== 0 ? (zs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."), Q = U, U = 0) : Q = 0);
      let oe, fe, he, Ae, Le, Te, Xe, Qe, ft;
      const rt = v.isCompressedTexture ? v.mipmaps[Q] : v.image;
      if (O !== null) oe = O.max.x - O.min.x, fe = O.max.y - O.min.y, he = O.isBox3 ? O.max.z - O.min.z : 1, Ae = O.min.x, Le = O.min.y, Te = O.isBox3 ? O.min.z : 0;
      else {
        const $t = Math.pow(2, -U);
        oe = Math.floor(rt.width * $t), fe = Math.floor(rt.height * $t), v.isDataArrayTexture ? he = rt.depth : v.isData3DTexture ? he = Math.floor(rt.depth * $t) : he = 1, Ae = 0, Le = 0, Te = 0;
      }
      B !== null ? (Xe = B.x, Qe = B.y, ft = B.z) : (Xe = 0, Qe = 0, ft = 0);
      const it = ye.convert(I.format), be = ye.convert(I.type);
      let ht;
      I.isData3DTexture ? (ke.setTexture3D(I, 0), ht = A.TEXTURE_3D) : I.isDataArrayTexture || I.isCompressedArrayTexture ? (ke.setTexture2DArray(I, 0), ht = A.TEXTURE_2D_ARRAY) : (ke.setTexture2D(I, 0), ht = A.TEXTURE_2D), A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL, I.flipY), A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL, I.premultiplyAlpha), A.pixelStorei(A.UNPACK_ALIGNMENT, I.unpackAlignment);
      const je = A.getParameter(A.UNPACK_ROW_LENGTH), Vt = A.getParameter(A.UNPACK_IMAGE_HEIGHT), Pi = A.getParameter(A.UNPACK_SKIP_PIXELS), Gt = A.getParameter(A.UNPACK_SKIP_ROWS), _s = A.getParameter(A.UNPACK_SKIP_IMAGES);
      A.pixelStorei(A.UNPACK_ROW_LENGTH, rt.width), A.pixelStorei(A.UNPACK_IMAGE_HEIGHT, rt.height), A.pixelStorei(A.UNPACK_SKIP_PIXELS, Ae), A.pixelStorei(A.UNPACK_SKIP_ROWS, Le), A.pixelStorei(A.UNPACK_SKIP_IMAGES, Te);
      const ut = v.isDataArrayTexture || v.isData3DTexture, Zt = I.isDataArrayTexture || I.isData3DTexture;
      if (v.isDepthTexture) {
        const $t = ge.get(v), Pt = ge.get(I), Bt = ge.get($t.__renderTarget), Yr = ge.get(Pt.__renderTarget);
        me.bindFramebuffer(A.READ_FRAMEBUFFER, Bt.__webglFramebuffer), me.bindFramebuffer(A.DRAW_FRAMEBUFFER, Yr.__webglFramebuffer);
        for (let ci = 0; ci < he; ci++) ut && (A.framebufferTextureLayer(A.READ_FRAMEBUFFER, A.COLOR_ATTACHMENT0, ge.get(v).__webglTexture, U, Te + ci), A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER, A.COLOR_ATTACHMENT0, ge.get(I).__webglTexture, Q, ft + ci)), A.blitFramebuffer(Ae, Le, oe, fe, Xe, Qe, oe, fe, A.DEPTH_BUFFER_BIT, A.NEAREST);
        me.bindFramebuffer(A.READ_FRAMEBUFFER, null), me.bindFramebuffer(A.DRAW_FRAMEBUFFER, null);
      } else if (U !== 0 || v.isRenderTargetTexture || ge.has(v)) {
        const $t = ge.get(v), Pt = ge.get(I);
        me.bindFramebuffer(A.READ_FRAMEBUFFER, ou), me.bindFramebuffer(A.DRAW_FRAMEBUFFER, lu);
        for (let Bt = 0; Bt < he; Bt++) ut ? A.framebufferTextureLayer(A.READ_FRAMEBUFFER, A.COLOR_ATTACHMENT0, $t.__webglTexture, U, Te + Bt) : A.framebufferTexture2D(A.READ_FRAMEBUFFER, A.COLOR_ATTACHMENT0, A.TEXTURE_2D, $t.__webglTexture, U), Zt ? A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER, A.COLOR_ATTACHMENT0, Pt.__webglTexture, Q, ft + Bt) : A.framebufferTexture2D(A.DRAW_FRAMEBUFFER, A.COLOR_ATTACHMENT0, A.TEXTURE_2D, Pt.__webglTexture, Q), U !== 0 ? A.blitFramebuffer(Ae, Le, oe, fe, Xe, Qe, oe, fe, A.COLOR_BUFFER_BIT, A.NEAREST) : Zt ? A.copyTexSubImage3D(ht, Q, Xe, Qe, ft + Bt, Ae, Le, oe, fe) : A.copyTexSubImage2D(ht, Q, Xe, Qe, Ae, Le, oe, fe);
        me.bindFramebuffer(A.READ_FRAMEBUFFER, null), me.bindFramebuffer(A.DRAW_FRAMEBUFFER, null);
      } else Zt ? v.isDataTexture || v.isData3DTexture ? A.texSubImage3D(ht, Q, Xe, Qe, ft, oe, fe, he, it, be, rt.data) : I.isCompressedArrayTexture ? A.compressedTexSubImage3D(ht, Q, Xe, Qe, ft, oe, fe, he, it, rt.data) : A.texSubImage3D(ht, Q, Xe, Qe, ft, oe, fe, he, it, be, rt) : v.isDataTexture ? A.texSubImage2D(A.TEXTURE_2D, Q, Xe, Qe, oe, fe, it, be, rt.data) : v.isCompressedTexture ? A.compressedTexSubImage2D(A.TEXTURE_2D, Q, Xe, Qe, rt.width, rt.height, it, rt.data) : A.texSubImage2D(A.TEXTURE_2D, Q, Xe, Qe, oe, fe, it, be, rt);
      A.pixelStorei(A.UNPACK_ROW_LENGTH, je), A.pixelStorei(A.UNPACK_IMAGE_HEIGHT, Vt), A.pixelStorei(A.UNPACK_SKIP_PIXELS, Pi), A.pixelStorei(A.UNPACK_SKIP_ROWS, Gt), A.pixelStorei(A.UNPACK_SKIP_IMAGES, _s), Q === 0 && I.generateMipmaps && A.generateMipmap(ht), me.unbindTexture();
    }, this.initRenderTarget = function(v) {
      ge.get(v).__webglFramebuffer === void 0 && ke.setupRenderTarget(v);
    }, this.initTexture = function(v) {
      v.isCubeTexture ? ke.setTextureCube(v, 0) : v.isData3DTexture ? ke.setTexture3D(v, 0) : v.isDataArrayTexture || v.isCompressedArrayTexture ? ke.setTexture2DArray(v, 0) : ke.setTexture2D(v, 0), me.unbindTexture();
    }, this.resetState = function() {
      C = 0, R = 0, N = null, me.reset(), ae.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  get coordinateSystem() {
    return Sn;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(e) {
    this._outputColorSpace = e;
    const t = this.getContext();
    t.drawingBufferColorSpace = qe._getDrawingBufferColorSpace(e), t.unpackColorSpace = qe._getUnpackColorSpace();
  }
}
const Fc = { type: "change" }, al = { type: "start" }, kh = { type: "end" }, vr = new us(), Oc = new vn(), _0 = Math.cos(70 * en.DEG2RAD), vt = new L(), kt = 2 * Math.PI, tt = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_PAN: 4, TOUCH_DOLLY_PAN: 5, TOUCH_DOLLY_ROTATE: 6 }, Ca = 1e-6;
class x0 extends If {
  constructor(e, t = null) {
    super(e, t), this.state = tt.NONE, this.target = new L(), this.cursor = new L(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = false, this.dampingFactor = 0.05, this.enableZoom = true, this.zoomSpeed = 1, this.enableRotate = true, this.rotateSpeed = 1, this.keyRotateSpeed = 1, this.enablePan = true, this.panSpeed = 1, this.screenSpacePanning = true, this.keyPanSpeed = 7, this.zoomToCursor = false, this.autoRotate = false, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: kn.ROTATE, MIDDLE: kn.DOLLY, RIGHT: kn.PAN }, this.touches = { ONE: ti.ROTATE, TWO: ti.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new L(), this._lastQuaternion = new Tn(), this._lastTargetPosition = new L(), this._quat = new Tn().setFromUnitVectors(e.up, new L(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new hc(), this._sphericalDelta = new hc(), this._scale = 1, this._panOffset = new L(), this._rotateStart = new Ee(), this._rotateEnd = new Ee(), this._rotateDelta = new Ee(), this._panStart = new Ee(), this._panEnd = new Ee(), this._panDelta = new Ee(), this._dollyStart = new Ee(), this._dollyEnd = new Ee(), this._dollyDelta = new Ee(), this._dollyDirection = new L(), this._mouse = new Ee(), this._performCursorZoom = false, this._pointers = [], this._pointerPositions = {}, this._controlActive = false, this._onPointerMove = y0.bind(this), this._onPointerDown = v0.bind(this), this._onPointerUp = M0.bind(this), this._onContextMenu = R0.bind(this), this._onMouseWheel = T0.bind(this), this._onKeyDown = b0.bind(this), this._onTouchStart = A0.bind(this), this._onTouchMove = w0.bind(this), this._onMouseDown = S0.bind(this), this._onMouseMove = E0.bind(this), this._interceptControlDown = C0.bind(this), this._interceptControlUp = P0.bind(this), this.domElement !== null && this.connect(this.domElement), this.update();
  }
  connect(e) {
    super.connect(e), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: false }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, { passive: true, capture: true }), this.domElement.style.touchAction = "none";
  }
  disconnect() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, { capture: true }), this.domElement.style.touchAction = "auto";
  }
  dispose() {
    this.disconnect();
  }
  getPolarAngle() {
    return this._spherical.phi;
  }
  getAzimuthalAngle() {
    return this._spherical.theta;
  }
  getDistance() {
    return this.object.position.distanceTo(this.target);
  }
  listenToKeyEvents(e) {
    e.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = e;
  }
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
  }
  saveState() {
    this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
  }
  reset() {
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(Fc), this.update(), this.state = tt.NONE;
  }
  update(e = null) {
    const t = this.object.position;
    vt.copy(t).sub(this.target), vt.applyQuaternion(this._quat), this._spherical.setFromVector3(vt), this.autoRotate && this.state === tt.NONE && this._rotateLeft(this._getAutoRotationAngle(e)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let n = this.minAzimuthAngle, s = this.maxAzimuthAngle;
    isFinite(n) && isFinite(s) && (n < -Math.PI ? n += kt : n > Math.PI && (n -= kt), s < -Math.PI ? s += kt : s > Math.PI && (s -= kt), n <= s ? this._spherical.theta = Math.max(n, Math.min(s, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (n + s) / 2 ? Math.max(n, this._spherical.theta) : Math.min(s, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === true ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let r = false;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera) this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const a = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), r = a != this._spherical.radius;
    }
    if (vt.setFromSpherical(this._spherical), vt.applyQuaternion(this._quatInverse), t.copy(this.target).add(vt), this.object.lookAt(this.target), this.enableDamping === true ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let a = null;
      if (this.object.isPerspectiveCamera) {
        const o = vt.length();
        a = this._clampDistance(o * this._scale);
        const l = o - a;
        this.object.position.addScaledVector(this._dollyDirection, l), this.object.updateMatrixWorld(), r = !!l;
      } else if (this.object.isOrthographicCamera) {
        const o = new L(this._mouse.x, this._mouse.y, 0);
        o.unproject(this.object);
        const l = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), r = l !== this.object.zoom;
        const c = new L(this._mouse.x, this._mouse.y, 0);
        c.unproject(this.object), this.object.position.sub(c).add(o), this.object.updateMatrixWorld(), a = vt.length();
      } else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = false;
      a !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position) : (vr.origin.copy(this.object.position), vr.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(vr.direction)) < _0 ? this.object.lookAt(this.target) : (Oc.setFromNormalAndCoplanarPoint(this.object.up, this.target), vr.intersectPlane(Oc, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const a = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), a !== this.object.zoom && (this.object.updateProjectionMatrix(), r = true);
    }
    return this._scale = 1, this._performCursorZoom = false, r || this._lastPosition.distanceToSquared(this.object.position) > Ca || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > Ca || this._lastTargetPosition.distanceToSquared(this.target) > Ca ? (this.dispatchEvent(Fc), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), true) : false;
  }
  _getAutoRotationAngle(e) {
    return e !== null ? kt / 60 * this.autoRotateSpeed * e : kt / 60 / 60 * this.autoRotateSpeed;
  }
  _getZoomScale(e) {
    const t = Math.abs(e * 0.01);
    return Math.pow(0.95, this.zoomSpeed * t);
  }
  _rotateLeft(e) {
    this._sphericalDelta.theta -= e;
  }
  _rotateUp(e) {
    this._sphericalDelta.phi -= e;
  }
  _panLeft(e, t) {
    vt.setFromMatrixColumn(t, 0), vt.multiplyScalar(-e), this._panOffset.add(vt);
  }
  _panUp(e, t) {
    this.screenSpacePanning === true ? vt.setFromMatrixColumn(t, 1) : (vt.setFromMatrixColumn(t, 0), vt.crossVectors(this.object.up, vt)), vt.multiplyScalar(e), this._panOffset.add(vt);
  }
  _pan(e, t) {
    const n = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const s = this.object.position;
      vt.copy(s).sub(this.target);
      let r = vt.length();
      r *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * e * r / n.clientHeight, this.object.matrix), this._panUp(2 * t * r / n.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(e * (this.object.right - this.object.left) / this.object.zoom / n.clientWidth, this.object.matrix), this._panUp(t * (this.object.top - this.object.bottom) / this.object.zoom / n.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = false);
  }
  _dollyOut(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = false);
  }
  _dollyIn(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = false);
  }
  _updateZoomParameters(e, t) {
    if (!this.zoomToCursor) return;
    this._performCursorZoom = true;
    const n = this.domElement.getBoundingClientRect(), s = e - n.left, r = t - n.top, a = n.width, o = n.height;
    this._mouse.x = s / a * 2 - 1, this._mouse.y = -(r / o) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(e) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, e));
  }
  _handleMouseDownRotate(e) {
    this._rotateStart.set(e.clientX, e.clientY);
  }
  _handleMouseDownDolly(e) {
    this._updateZoomParameters(e.clientX, e.clientX), this._dollyStart.set(e.clientX, e.clientY);
  }
  _handleMouseDownPan(e) {
    this._panStart.set(e.clientX, e.clientY);
  }
  _handleMouseMoveRotate(e) {
    this._rotateEnd.set(e.clientX, e.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const t = this.domElement;
    this._rotateLeft(kt * this._rotateDelta.x / t.clientHeight), this._rotateUp(kt * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
  }
  _handleMouseMoveDolly(e) {
    this._dollyEnd.set(e.clientX, e.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
  }
  _handleMouseMovePan(e) {
    this._panEnd.set(e.clientX, e.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
  }
  _handleMouseWheel(e) {
    this._updateZoomParameters(e.clientX, e.clientY), e.deltaY < 0 ? this._dollyIn(this._getZoomScale(e.deltaY)) : e.deltaY > 0 && this._dollyOut(this._getZoomScale(e.deltaY)), this.update();
  }
  _handleKeyDown(e) {
    let t = false;
    switch (e.code) {
      case this.keys.UP:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(kt * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, this.keyPanSpeed), t = true;
        break;
      case this.keys.BOTTOM:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(-kt * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, -this.keyPanSpeed), t = true;
        break;
      case this.keys.LEFT:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(kt * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(this.keyPanSpeed, 0), t = true;
        break;
      case this.keys.RIGHT:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(-kt * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(-this.keyPanSpeed, 0), t = true;
        break;
    }
    t && (e.preventDefault(), this.update());
  }
  _handleTouchStartRotate(e) {
    if (this._pointers.length === 1) this._rotateStart.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e), n = 0.5 * (e.pageX + t.x), s = 0.5 * (e.pageY + t.y);
      this._rotateStart.set(n, s);
    }
  }
  _handleTouchStartPan(e) {
    if (this._pointers.length === 1) this._panStart.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e), n = 0.5 * (e.pageX + t.x), s = 0.5 * (e.pageY + t.y);
      this._panStart.set(n, s);
    }
  }
  _handleTouchStartDolly(e) {
    const t = this._getSecondPointerPosition(e), n = e.pageX - t.x, s = e.pageY - t.y, r = Math.sqrt(n * n + s * s);
    this._dollyStart.set(0, r);
  }
  _handleTouchStartDollyPan(e) {
    this.enableZoom && this._handleTouchStartDolly(e), this.enablePan && this._handleTouchStartPan(e);
  }
  _handleTouchStartDollyRotate(e) {
    this.enableZoom && this._handleTouchStartDolly(e), this.enableRotate && this._handleTouchStartRotate(e);
  }
  _handleTouchMoveRotate(e) {
    if (this._pointers.length == 1) this._rotateEnd.set(e.pageX, e.pageY);
    else {
      const n = this._getSecondPointerPosition(e), s = 0.5 * (e.pageX + n.x), r = 0.5 * (e.pageY + n.y);
      this._rotateEnd.set(s, r);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const t = this.domElement;
    this._rotateLeft(kt * this._rotateDelta.x / t.clientHeight), this._rotateUp(kt * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(e) {
    if (this._pointers.length === 1) this._panEnd.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e), n = 0.5 * (e.pageX + t.x), s = 0.5 * (e.pageY + t.y);
      this._panEnd.set(n, s);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(e) {
    const t = this._getSecondPointerPosition(e), n = e.pageX - t.x, s = e.pageY - t.y, r = Math.sqrt(n * n + s * s);
    this._dollyEnd.set(0, r), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const a = (e.pageX + t.x) * 0.5, o = (e.pageY + t.y) * 0.5;
    this._updateZoomParameters(a, o);
  }
  _handleTouchMoveDollyPan(e) {
    this.enableZoom && this._handleTouchMoveDolly(e), this.enablePan && this._handleTouchMovePan(e);
  }
  _handleTouchMoveDollyRotate(e) {
    this.enableZoom && this._handleTouchMoveDolly(e), this.enableRotate && this._handleTouchMoveRotate(e);
  }
  _addPointer(e) {
    this._pointers.push(e.pointerId);
  }
  _removePointer(e) {
    delete this._pointerPositions[e.pointerId];
    for (let t = 0; t < this._pointers.length; t++) if (this._pointers[t] == e.pointerId) {
      this._pointers.splice(t, 1);
      return;
    }
  }
  _isTrackingPointer(e) {
    for (let t = 0; t < this._pointers.length; t++) if (this._pointers[t] == e.pointerId) return true;
    return false;
  }
  _trackPointer(e) {
    let t = this._pointerPositions[e.pointerId];
    t === void 0 && (t = new Ee(), this._pointerPositions[e.pointerId] = t), t.set(e.pageX, e.pageY);
  }
  _getSecondPointerPosition(e) {
    const t = e.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[t];
  }
  _customWheelEvent(e) {
    const t = e.deltaMode, n = { clientX: e.clientX, clientY: e.clientY, deltaY: e.deltaY };
    switch (t) {
      case 1:
        n.deltaY *= 16;
        break;
      case 2:
        n.deltaY *= 100;
        break;
    }
    return e.ctrlKey && !this._controlActive && (n.deltaY *= 10), n;
  }
}
function v0(i) {
  this.enabled !== false && (this._pointers.length === 0 && (this.domElement.setPointerCapture(i.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(i) && (this._addPointer(i), i.pointerType === "touch" ? this._onTouchStart(i) : this._onMouseDown(i)));
}
function y0(i) {
  this.enabled !== false && (i.pointerType === "touch" ? this._onTouchMove(i) : this._onMouseMove(i));
}
function M0(i) {
  switch (this._removePointer(i), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(i.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(kh), this.state = tt.NONE;
      break;
    case 1:
      const e = this._pointers[0], t = this._pointerPositions[e];
      this._onTouchStart({ pointerId: e, pageX: t.x, pageY: t.y });
      break;
  }
}
function S0(i) {
  let e;
  switch (i.button) {
    case 0:
      e = this.mouseButtons.LEFT;
      break;
    case 1:
      e = this.mouseButtons.MIDDLE;
      break;
    case 2:
      e = this.mouseButtons.RIGHT;
      break;
    default:
      e = -1;
  }
  switch (e) {
    case kn.DOLLY:
      if (this.enableZoom === false) return;
      this._handleMouseDownDolly(i), this.state = tt.DOLLY;
      break;
    case kn.ROTATE:
      if (i.ctrlKey || i.metaKey || i.shiftKey) {
        if (this.enablePan === false) return;
        this._handleMouseDownPan(i), this.state = tt.PAN;
      } else {
        if (this.enableRotate === false) return;
        this._handleMouseDownRotate(i), this.state = tt.ROTATE;
      }
      break;
    case kn.PAN:
      if (i.ctrlKey || i.metaKey || i.shiftKey) {
        if (this.enableRotate === false) return;
        this._handleMouseDownRotate(i), this.state = tt.ROTATE;
      } else {
        if (this.enablePan === false) return;
        this._handleMouseDownPan(i), this.state = tt.PAN;
      }
      break;
    default:
      this.state = tt.NONE;
  }
  this.state !== tt.NONE && this.dispatchEvent(al);
}
function E0(i) {
  switch (this.state) {
    case tt.ROTATE:
      if (this.enableRotate === false) return;
      this._handleMouseMoveRotate(i);
      break;
    case tt.DOLLY:
      if (this.enableZoom === false) return;
      this._handleMouseMoveDolly(i);
      break;
    case tt.PAN:
      if (this.enablePan === false) return;
      this._handleMouseMovePan(i);
      break;
  }
}
function T0(i) {
  this.enabled === false || this.enableZoom === false || this.state !== tt.NONE || (i.preventDefault(), this.dispatchEvent(al), this._handleMouseWheel(this._customWheelEvent(i)), this.dispatchEvent(kh));
}
function b0(i) {
  this.enabled !== false && this._handleKeyDown(i);
}
function A0(i) {
  switch (this._trackPointer(i), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case ti.ROTATE:
          if (this.enableRotate === false) return;
          this._handleTouchStartRotate(i), this.state = tt.TOUCH_ROTATE;
          break;
        case ti.PAN:
          if (this.enablePan === false) return;
          this._handleTouchStartPan(i), this.state = tt.TOUCH_PAN;
          break;
        default:
          this.state = tt.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case ti.DOLLY_PAN:
          if (this.enableZoom === false && this.enablePan === false) return;
          this._handleTouchStartDollyPan(i), this.state = tt.TOUCH_DOLLY_PAN;
          break;
        case ti.DOLLY_ROTATE:
          if (this.enableZoom === false && this.enableRotate === false) return;
          this._handleTouchStartDollyRotate(i), this.state = tt.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = tt.NONE;
      }
      break;
    default:
      this.state = tt.NONE;
  }
  this.state !== tt.NONE && this.dispatchEvent(al);
}
function w0(i) {
  switch (this._trackPointer(i), this.state) {
    case tt.TOUCH_ROTATE:
      if (this.enableRotate === false) return;
      this._handleTouchMoveRotate(i), this.update();
      break;
    case tt.TOUCH_PAN:
      if (this.enablePan === false) return;
      this._handleTouchMovePan(i), this.update();
      break;
    case tt.TOUCH_DOLLY_PAN:
      if (this.enableZoom === false && this.enablePan === false) return;
      this._handleTouchMoveDollyPan(i), this.update();
      break;
    case tt.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === false && this.enableRotate === false) return;
      this._handleTouchMoveDollyRotate(i), this.update();
      break;
    default:
      this.state = tt.NONE;
  }
}
function R0(i) {
  this.enabled !== false && i.preventDefault();
}
function C0(i) {
  i.key === "Control" && (this._controlActive = true, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: true, capture: true }));
}
function P0(i) {
  i.key === "Control" && (this._controlActive = false, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: true, capture: true }));
}
var qt = Uint8Array, Zi = Uint16Array, L0 = Int32Array, zh = new qt([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), Hh = new qt([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), D0 = new qt([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Vh = function(i, e) {
  for (var t = new Zi(31), n = 0; n < 31; ++n) t[n] = e += 1 << i[n - 1];
  for (var s = new L0(t[30]), n = 1; n < 30; ++n) for (var r = t[n]; r < t[n + 1]; ++r) s[r] = r - t[n] << 5 | n;
  return { b: t, r: s };
}, Gh = Vh(zh, 2), Wh = Gh.b, I0 = Gh.r;
Wh[28] = 258, I0[258] = 28;
var U0 = Vh(Hh, 0), N0 = U0.b, Co = new Zi(32768);
for (var at = 0; at < 32768; ++at) {
  var Kn = (at & 43690) >> 1 | (at & 21845) << 1;
  Kn = (Kn & 52428) >> 2 | (Kn & 13107) << 2, Kn = (Kn & 61680) >> 4 | (Kn & 3855) << 4, Co[at] = ((Kn & 65280) >> 8 | (Kn & 255) << 8) >> 1;
}
var Ds = (function(i, e, t) {
  for (var n = i.length, s = 0, r = new Zi(e); s < n; ++s) i[s] && ++r[i[s] - 1];
  var a = new Zi(e);
  for (s = 1; s < e; ++s) a[s] = a[s - 1] + r[s - 1] << 1;
  var o;
  if (t) {
    o = new Zi(1 << e);
    var l = 15 - e;
    for (s = 0; s < n; ++s) if (i[s]) for (var c = s << 4 | i[s], u = e - i[s], h = a[i[s] - 1]++ << u, d = h | (1 << u) - 1; h <= d; ++h) o[Co[h] >> l] = c;
  } else for (o = new Zi(n), s = 0; s < n; ++s) i[s] && (o[s] = Co[a[i[s] - 1]++] >> 15 - i[s]);
  return o;
}), Gs = new qt(288);
for (var at = 0; at < 144; ++at) Gs[at] = 8;
for (var at = 144; at < 256; ++at) Gs[at] = 9;
for (var at = 256; at < 280; ++at) Gs[at] = 7;
for (var at = 280; at < 288; ++at) Gs[at] = 8;
var Xh = new qt(32);
for (var at = 0; at < 32; ++at) Xh[at] = 5;
var F0 = Ds(Gs, 9, 1), O0 = Ds(Xh, 5, 1), Pa = function(i) {
  for (var e = i[0], t = 1; t < i.length; ++t) i[t] > e && (e = i[t]);
  return e;
}, an = function(i, e, t) {
  var n = e / 8 | 0;
  return (i[n] | i[n + 1] << 8) >> (e & 7) & t;
}, La = function(i, e) {
  var t = e / 8 | 0;
  return (i[t] | i[t + 1] << 8 | i[t + 2] << 16) >> (e & 7);
}, B0 = function(i) {
  return (i + 7) / 8 | 0;
}, k0 = function(i, e, t) {
  return (t == null || t > i.length) && (t = i.length), new qt(i.subarray(e, t));
}, z0 = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler", , "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"], on = function(i, e, t) {
  var n = new Error(e || z0[i]);
  if (n.code = i, Error.captureStackTrace && Error.captureStackTrace(n, on), !t) throw n;
  return n;
}, H0 = function(i, e, t, n) {
  var s = i.length, r = 0;
  if (!s || e.f && !e.l) return t || new qt(0);
  var a = !t, o = a || e.i != 2, l = e.i;
  a && (t = new qt(s * 3));
  var c = function(He) {
    var xt = t.length;
    if (He > xt) {
      var A = new qt(Math.max(xt * 2, He));
      A.set(t), t = A;
    }
  }, u = e.f || 0, h = e.p || 0, d = e.b || 0, p = e.l, g = e.d, _ = e.m, m = e.n, f = s * 8;
  do {
    if (!p) {
      u = an(i, h, 1);
      var b = an(i, h + 1, 3);
      if (h += 3, b) if (b == 1) p = F0, g = O0, _ = 9, m = 5;
      else if (b == 2) {
        var C = an(i, h, 31) + 257, R = an(i, h + 10, 15) + 4, N = C + an(i, h + 5, 31) + 1;
        h += 14;
        for (var S = new qt(N), M = new qt(19), P = 0; P < R; ++P) M[D0[P]] = an(i, h + P * 3, 7);
        h += R * 3;
        for (var k = Pa(M), V = (1 << k) - 1, j = Ds(M, k, 1), P = 0; P < N; ) {
          var q = j[an(i, h, V)];
          h += q & 15;
          var E = q >> 4;
          if (E < 16) S[P++] = E;
          else {
            var W = 0, K = 0;
            for (E == 16 ? (K = 3 + an(i, h, 3), h += 2, W = S[P - 1]) : E == 17 ? (K = 3 + an(i, h, 7), h += 3) : E == 18 && (K = 11 + an(i, h, 127), h += 7); K--; ) S[P++] = W;
          }
        }
        var z = S.subarray(0, C), ne = S.subarray(C);
        _ = Pa(z), m = Pa(ne), p = Ds(z, _, 1), g = Ds(ne, m, 1);
      } else on(1);
      else {
        var E = B0(h) + 4, y = i[E - 4] | i[E - 3] << 8, w = E + y;
        if (w > s) {
          l && on(0);
          break;
        }
        o && c(d + y), t.set(i.subarray(E, w), d), e.b = d += y, e.p = h = w * 8, e.f = u;
        continue;
      }
      if (h > f) {
        l && on(0);
        break;
      }
    }
    o && c(d + 131072);
    for (var ce = (1 << _) - 1, Me = (1 << m) - 1, Ne = h; ; Ne = h) {
      var W = p[La(i, h) & ce], Ye = W >> 4;
      if (h += W & 15, h > f) {
        l && on(0);
        break;
      }
      if (W || on(2), Ye < 256) t[d++] = Ye;
      else if (Ye == 256) {
        Ne = h, p = null;
        break;
      } else {
        var nt = Ye - 254;
        if (Ye > 264) {
          var P = Ye - 257, We = zh[P];
          nt = an(i, h, (1 << We) - 1) + Wh[P], h += We;
        }
        var X = g[La(i, h) & Me], Z = X >> 4;
        X || on(3), h += X & 15;
        var ne = N0[Z];
        if (Z > 3) {
          var We = Hh[Z];
          ne += La(i, h) & (1 << We) - 1, h += We;
        }
        if (h > f) {
          l && on(0);
          break;
        }
        o && c(d + 131072);
        var ue = d + nt;
        if (d < ne) {
          var Re = r - ne, xe = Math.min(ne, ue);
          for (Re + d < 0 && on(3); d < xe; ++d) t[d] = n[Re + d];
        }
        for (; d < ue; ++d) t[d] = t[d - ne];
      }
    }
    e.l = p, e.p = Ne, e.b = d, e.f = u, p && (u = 1, e.m = _, e.d = g, e.n = m);
  } while (!u);
  return d != t.length && a ? k0(t, 0, d) : t.subarray(0, d);
}, V0 = new qt(0), G0 = function(i) {
  (i[0] != 31 || i[1] != 139 || i[2] != 8) && on(6, "invalid gzip data");
  var e = i[3], t = 10;
  e & 4 && (t += (i[10] | i[11] << 8) + 2);
  for (var n = (e >> 3 & 1) + (e >> 4 & 1); n > 0; n -= !i[t++]) ;
  return t + (e & 2);
}, W0 = function(i) {
  var e = i.length;
  return (i[e - 4] | i[e - 3] << 8 | i[e - 2] << 16 | i[e - 1] << 24) >>> 0;
};
function X0(i, e) {
  var t = G0(i);
  return t + 8 > i.length && on(6, "invalid gzip data"), H0(i.subarray(t, -8), { i: 2 }, new qt(W0(i)), e);
}
var q0 = typeof TextDecoder < "u" && new TextDecoder(), Y0 = 0;
try {
  q0.decode(V0, { stream: true }), Y0 = 1;
} catch {
}
function Bc(i, e) {
  if (e === ku) return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), i;
  if (e === So || e === hh) {
    let t = i.getIndex();
    if (t === null) {
      const a = [], o = i.getAttribute("position");
      if (o !== void 0) {
        for (let l = 0; l < o.count; l++) a.push(l);
        i.setIndex(a), t = i.getIndex();
      } else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), i;
    }
    const n = t.count - 2, s = [];
    if (e === So) for (let a = 1; a <= n; a++) s.push(t.getX(0)), s.push(t.getX(a)), s.push(t.getX(a + 1));
    else for (let a = 0; a < n; a++) a % 2 === 0 ? (s.push(t.getX(a)), s.push(t.getX(a + 1)), s.push(t.getX(a + 2))) : (s.push(t.getX(a + 2)), s.push(t.getX(a + 1)), s.push(t.getX(a)));
    s.length / 3 !== n && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const r = i.clone();
    return r.setIndex(s), r.clearGroups(), r;
  } else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), i;
}
class j0 extends ms {
  constructor(e) {
    super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new Q0(t);
    }), this.register(function(t) {
      return new ex(t);
    }), this.register(function(t) {
      return new cx(t);
    }), this.register(function(t) {
      return new hx(t);
    }), this.register(function(t) {
      return new ux(t);
    }), this.register(function(t) {
      return new nx(t);
    }), this.register(function(t) {
      return new ix(t);
    }), this.register(function(t) {
      return new sx(t);
    }), this.register(function(t) {
      return new rx(t);
    }), this.register(function(t) {
      return new J0(t);
    }), this.register(function(t) {
      return new ax(t);
    }), this.register(function(t) {
      return new tx(t);
    }), this.register(function(t) {
      return new lx(t);
    }), this.register(function(t) {
      return new ox(t);
    }), this.register(function(t) {
      return new Z0(t);
    }), this.register(function(t) {
      return new dx(t);
    }), this.register(function(t) {
      return new fx(t);
    });
  }
  load(e, t, n, s) {
    const r = this;
    let a;
    if (this.resourcePath !== "") a = this.resourcePath;
    else if (this.path !== "") {
      const c = Ls.extractUrlBase(e);
      a = Ls.resolveURL(c, this.path);
    } else a = Ls.extractUrlBase(e);
    this.manager.itemStart(e);
    const o = function(c) {
      s ? s(c) : console.error(c), r.manager.itemError(e), r.manager.itemEnd(e);
    }, l = new Lh(this.manager);
    l.setPath(this.path), l.setResponseType("arraybuffer"), l.setRequestHeader(this.requestHeader), l.setWithCredentials(this.withCredentials), l.load(e, function(c) {
      try {
        r.parse(c, a, function(u) {
          t(u), r.manager.itemEnd(e);
        }, o);
      } catch (u) {
        o(u);
      }
    }, n, o);
  }
  setDRACOLoader(e) {
    return this.dracoLoader = e, this;
  }
  setKTX2Loader(e) {
    return this.ktx2Loader = e, this;
  }
  setMeshoptDecoder(e) {
    return this.meshoptDecoder = e, this;
  }
  register(e) {
    return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
  }
  unregister(e) {
    return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
  }
  parse(e, t, n, s) {
    let r;
    const a = {}, o = {}, l = new TextDecoder();
    if (typeof e == "string") r = JSON.parse(e);
    else if (e instanceof ArrayBuffer) if (l.decode(new Uint8Array(e, 0, 4)) === qh) {
      try {
        a[Ve.KHR_BINARY_GLTF] = new px(e);
      } catch (h) {
        s && s(h);
        return;
      }
      r = JSON.parse(a[Ve.KHR_BINARY_GLTF].content);
    } else r = JSON.parse(l.decode(e));
    else r = e;
    if (r.asset === void 0 || r.asset.version[0] < 2) {
      s && s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const c = new wx(r, { path: t || this.resourcePath || "", crossOrigin: this.crossOrigin, requestHeader: this.requestHeader, manager: this.manager, ktx2Loader: this.ktx2Loader, meshoptDecoder: this.meshoptDecoder });
    c.fileLoader.setRequestHeader(this.requestHeader);
    for (let u = 0; u < this.pluginCallbacks.length; u++) {
      const h = this.pluginCallbacks[u](c);
      h.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), o[h.name] = h, a[h.name] = true;
    }
    if (r.extensionsUsed) for (let u = 0; u < r.extensionsUsed.length; ++u) {
      const h = r.extensionsUsed[u], d = r.extensionsRequired || [];
      switch (h) {
        case Ve.KHR_MATERIALS_UNLIT:
          a[h] = new $0();
          break;
        case Ve.KHR_DRACO_MESH_COMPRESSION:
          a[h] = new mx(r, this.dracoLoader);
          break;
        case Ve.KHR_TEXTURE_TRANSFORM:
          a[h] = new gx();
          break;
        case Ve.KHR_MESH_QUANTIZATION:
          a[h] = new _x();
          break;
        default:
          d.indexOf(h) >= 0 && o[h] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + h + '".');
      }
    }
    c.setExtensions(a), c.setPlugins(o), c.parse(n, s);
  }
  parseAsync(e, t) {
    const n = this;
    return new Promise(function(s, r) {
      n.parse(e, t, s, r);
    });
  }
}
function K0() {
  let i = {};
  return { get: function(e) {
    return i[e];
  }, add: function(e, t) {
    i[e] = t;
  }, remove: function(e) {
    delete i[e];
  }, removeAll: function() {
    i = {};
  } };
}
const Ve = { KHR_BINARY_GLTF: "KHR_binary_glTF", KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression", KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual", KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat", KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion", KHR_MATERIALS_IOR: "KHR_materials_ior", KHR_MATERIALS_SHEEN: "KHR_materials_sheen", KHR_MATERIALS_SPECULAR: "KHR_materials_specular", KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission", KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence", KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy", KHR_MATERIALS_UNLIT: "KHR_materials_unlit", KHR_MATERIALS_VOLUME: "KHR_materials_volume", KHR_TEXTURE_BASISU: "KHR_texture_basisu", KHR_TEXTURE_TRANSFORM: "KHR_texture_transform", KHR_MESH_QUANTIZATION: "KHR_mesh_quantization", KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength", EXT_MATERIALS_BUMP: "EXT_materials_bump", EXT_TEXTURE_WEBP: "EXT_texture_webp", EXT_TEXTURE_AVIF: "EXT_texture_avif", EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression", EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing" };
class Z0 {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const e = this.parser, t = this.parser.json.nodes || [];
    for (let n = 0, s = t.length; n < s; n++) {
      const r = t[n];
      r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser, n = "light:" + e;
    let s = t.cache.get(n);
    if (s) return s;
    const r = t.json, l = ((r.extensions && r.extensions[this.name] || {}).lights || [])[e];
    let c;
    const u = new we(16777215);
    l.color !== void 0 && u.setRGB(l.color[0], l.color[1], l.color[2], Ct);
    const h = l.range !== void 0 ? l.range : 0;
    switch (l.type) {
      case "directional":
        c = new nl(u), c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      case "point":
        c = new tl(u), c.distance = h;
        break;
      case "spot":
        c = new Ih(u), c.distance = h, l.spot = l.spot || {}, l.spot.innerConeAngle = l.spot.innerConeAngle !== void 0 ? l.spot.innerConeAngle : 0, l.spot.outerConeAngle = l.spot.outerConeAngle !== void 0 ? l.spot.outerConeAngle : Math.PI / 4, c.angle = l.spot.outerConeAngle, c.penumbra = 1 - l.spot.innerConeAngle / l.spot.outerConeAngle, c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + l.type);
    }
    return c.position.set(0, 0, 0), xn(c, l), l.intensity !== void 0 && (c.intensity = l.intensity), c.name = t.createUniqueName(l.name || "light_" + e), s = Promise.resolve(c), t.cache.add(n, s), s;
  }
  getDependency(e, t) {
    if (e === "light") return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this, n = this.parser, r = n.json.nodes[e], o = (r.extensions && r.extensions[this.name] || {}).light;
    return o === void 0 ? null : this._loadLight(o).then(function(l) {
      return n._getNodeRef(t.cache, o, l);
    });
  }
}
class $0 {
  constructor() {
    this.name = Ve.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return ii;
  }
  extendParams(e, t, n) {
    const s = [];
    e.color = new we(1, 1, 1), e.opacity = 1;
    const r = t.pbrMetallicRoughness;
    if (r) {
      if (Array.isArray(r.baseColorFactor)) {
        const a = r.baseColorFactor;
        e.color.setRGB(a[0], a[1], a[2], Ct), e.opacity = a[3];
      }
      r.baseColorTexture !== void 0 && s.push(n.assignTexture(e, "map", r.baseColorTexture, yt));
    }
    return Promise.all(s);
  }
}
class J0 {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(e, t) {
    const s = this.parser.json.materials[e];
    if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
    const r = s.extensions[this.name].emissiveStrength;
    return r !== void 0 && (t.emissiveIntensity = r), Promise.resolve();
  }
}
class Q0 {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
    const r = [], a = s.extensions[this.name];
    if (a.clearcoatFactor !== void 0 && (t.clearcoat = a.clearcoatFactor), a.clearcoatTexture !== void 0 && r.push(n.assignTexture(t, "clearcoatMap", a.clearcoatTexture)), a.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = a.clearcoatRoughnessFactor), a.clearcoatRoughnessTexture !== void 0 && r.push(n.assignTexture(t, "clearcoatRoughnessMap", a.clearcoatRoughnessTexture)), a.clearcoatNormalTexture !== void 0 && (r.push(n.assignTexture(t, "clearcoatNormalMap", a.clearcoatNormalTexture)), a.clearcoatNormalTexture.scale !== void 0)) {
      const o = a.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new Ee(o, o);
    }
    return Promise.all(r);
  }
}
class ex {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pn;
  }
  extendMaterialParams(e, t) {
    const s = this.parser.json.materials[e];
    if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
    const r = s.extensions[this.name];
    return t.dispersion = r.dispersion !== void 0 ? r.dispersion : 0, Promise.resolve();
  }
}
class tx {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
    const r = [], a = s.extensions[this.name];
    return a.iridescenceFactor !== void 0 && (t.iridescence = a.iridescenceFactor), a.iridescenceTexture !== void 0 && r.push(n.assignTexture(t, "iridescenceMap", a.iridescenceTexture)), a.iridescenceIor !== void 0 && (t.iridescenceIOR = a.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), a.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = a.iridescenceThicknessMinimum), a.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = a.iridescenceThicknessMaximum), a.iridescenceThicknessTexture !== void 0 && r.push(n.assignTexture(t, "iridescenceThicknessMap", a.iridescenceThicknessTexture)), Promise.all(r);
  }
}
class nx {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
    const r = [];
    t.sheenColor = new we(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1;
    const a = s.extensions[this.name];
    if (a.sheenColorFactor !== void 0) {
      const o = a.sheenColorFactor;
      t.sheenColor.setRGB(o[0], o[1], o[2], Ct);
    }
    return a.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = a.sheenRoughnessFactor), a.sheenColorTexture !== void 0 && r.push(n.assignTexture(t, "sheenColorMap", a.sheenColorTexture, yt)), a.sheenRoughnessTexture !== void 0 && r.push(n.assignTexture(t, "sheenRoughnessMap", a.sheenRoughnessTexture)), Promise.all(r);
  }
}
class ix {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
    const r = [], a = s.extensions[this.name];
    return a.transmissionFactor !== void 0 && (t.transmission = a.transmissionFactor), a.transmissionTexture !== void 0 && r.push(n.assignTexture(t, "transmissionMap", a.transmissionTexture)), Promise.all(r);
  }
}
class sx {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
    const r = [], a = s.extensions[this.name];
    t.thickness = a.thicknessFactor !== void 0 ? a.thicknessFactor : 0, a.thicknessTexture !== void 0 && r.push(n.assignTexture(t, "thicknessMap", a.thicknessTexture)), t.attenuationDistance = a.attenuationDistance || 1 / 0;
    const o = a.attenuationColor || [1, 1, 1];
    return t.attenuationColor = new we().setRGB(o[0], o[1], o[2], Ct), Promise.all(r);
  }
}
class rx {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_MATERIALS_IOR;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pn;
  }
  extendMaterialParams(e, t) {
    const s = this.parser.json.materials[e];
    if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
    const r = s.extensions[this.name];
    return t.ior = r.ior !== void 0 ? r.ior : 1.5, Promise.resolve();
  }
}
class ax {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
    const r = [], a = s.extensions[this.name];
    t.specularIntensity = a.specularFactor !== void 0 ? a.specularFactor : 1, a.specularTexture !== void 0 && r.push(n.assignTexture(t, "specularIntensityMap", a.specularTexture));
    const o = a.specularColorFactor || [1, 1, 1];
    return t.specularColor = new we().setRGB(o[0], o[1], o[2], Ct), a.specularColorTexture !== void 0 && r.push(n.assignTexture(t, "specularColorMap", a.specularColorTexture, yt)), Promise.all(r);
  }
}
class ox {
  constructor(e) {
    this.parser = e, this.name = Ve.EXT_MATERIALS_BUMP;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
    const r = [], a = s.extensions[this.name];
    return t.bumpScale = a.bumpFactor !== void 0 ? a.bumpFactor : 1, a.bumpTexture !== void 0 && r.push(n.assignTexture(t, "bumpMap", a.bumpTexture)), Promise.all(r);
  }
}
class lx {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
    const r = [], a = s.extensions[this.name];
    return a.anisotropyStrength !== void 0 && (t.anisotropy = a.anisotropyStrength), a.anisotropyRotation !== void 0 && (t.anisotropyRotation = a.anisotropyRotation), a.anisotropyTexture !== void 0 && r.push(n.assignTexture(t, "anisotropyMap", a.anisotropyTexture)), Promise.all(r);
  }
}
class cx {
  constructor(e) {
    this.parser = e, this.name = Ve.KHR_TEXTURE_BASISU;
  }
  loadTexture(e) {
    const t = this.parser, n = t.json, s = n.textures[e];
    if (!s.extensions || !s.extensions[this.name]) return null;
    const r = s.extensions[this.name], a = t.options.ktx2Loader;
    if (!a) {
      if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0) throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, r.source, a);
  }
}
class hx {
  constructor(e) {
    this.parser = e, this.name = Ve.EXT_TEXTURE_WEBP;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, s = n.json, r = s.textures[e];
    if (!r.extensions || !r.extensions[t]) return null;
    const a = r.extensions[t], o = s.images[a.source];
    let l = n.textureLoader;
    if (o.uri) {
      const c = n.options.manager.getHandler(o.uri);
      c !== null && (l = c);
    }
    return n.loadTextureImage(e, a.source, l);
  }
}
class ux {
  constructor(e) {
    this.parser = e, this.name = Ve.EXT_TEXTURE_AVIF;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, s = n.json, r = s.textures[e];
    if (!r.extensions || !r.extensions[t]) return null;
    const a = r.extensions[t], o = s.images[a.source];
    let l = n.textureLoader;
    if (o.uri) {
      const c = n.options.manager.getHandler(o.uri);
      c !== null && (l = c);
    }
    return n.loadTextureImage(e, a.source, l);
  }
}
class dx {
  constructor(e) {
    this.name = Ve.EXT_MESHOPT_COMPRESSION, this.parser = e;
  }
  loadBufferView(e) {
    const t = this.parser.json, n = t.bufferViews[e];
    if (n.extensions && n.extensions[this.name]) {
      const s = n.extensions[this.name], r = this.parser.getDependency("buffer", s.buffer), a = this.parser.options.meshoptDecoder;
      if (!a || !a.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0) throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return r.then(function(o) {
        const l = s.byteOffset || 0, c = s.byteLength || 0, u = s.count, h = s.byteStride, d = new Uint8Array(o, l, c);
        return a.decodeGltfBufferAsync ? a.decodeGltfBufferAsync(u, h, d, s.mode, s.filter).then(function(p) {
          return p.buffer;
        }) : a.ready.then(function() {
          const p = new ArrayBuffer(u * h);
          return a.decodeGltfBuffer(new Uint8Array(p), u, h, d, s.mode, s.filter), p;
        });
      });
    } else return null;
  }
}
class fx {
  constructor(e) {
    this.name = Ve.EXT_MESH_GPU_INSTANCING, this.parser = e;
  }
  createNodeMesh(e) {
    const t = this.parser.json, n = t.nodes[e];
    if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
    const s = t.meshes[n.mesh];
    for (const c of s.primitives) if (c.mode !== Qt.TRIANGLES && c.mode !== Qt.TRIANGLE_STRIP && c.mode !== Qt.TRIANGLE_FAN && c.mode !== void 0) return null;
    const a = n.extensions[this.name].attributes, o = [], l = {};
    for (const c in a) o.push(this.parser.getDependency("accessor", a[c]).then((u) => (l[c] = u, l[c])));
    return o.length < 1 ? null : (o.push(this.parser.createNodeMesh(e)), Promise.all(o).then((c) => {
      const u = c.pop(), h = u.isGroup ? u.children : [u], d = c[0].count, p = [];
      for (const g of h) {
        const _ = new Be(), m = new L(), f = new Tn(), b = new L(1, 1, 1), E = new Th(g.geometry, g.material, d);
        for (let y = 0; y < d; y++) l.TRANSLATION && m.fromBufferAttribute(l.TRANSLATION, y), l.ROTATION && f.fromBufferAttribute(l.ROTATION, y), l.SCALE && b.fromBufferAttribute(l.SCALE, y), E.setMatrixAt(y, _.compose(m, f, b));
        for (const y in l) if (y === "_COLOR_0") {
          const w = l[y];
          E.instanceColor = new To(w.array, w.itemSize, w.normalized);
        } else y !== "TRANSLATION" && y !== "ROTATION" && y !== "SCALE" && g.geometry.setAttribute(y, l[y]);
        ot.prototype.copy.call(E, g), this.parser.assignFinalMaterial(E), p.push(E);
      }
      return u.isGroup ? (u.clear(), u.add(...p), u) : p[0];
    }));
  }
}
const qh = "glTF", As = 12, kc = { JSON: 1313821514, BIN: 5130562 };
class px {
  constructor(e) {
    this.name = Ve.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(e, 0, As), n = new TextDecoder();
    if (this.header = { magic: n.decode(new Uint8Array(e.slice(0, 4))), version: t.getUint32(4, true), length: t.getUint32(8, true) }, this.header.magic !== qh) throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2) throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const s = this.header.length - As, r = new DataView(e, As);
    let a = 0;
    for (; a < s; ) {
      const o = r.getUint32(a, true);
      a += 4;
      const l = r.getUint32(a, true);
      if (a += 4, l === kc.JSON) {
        const c = new Uint8Array(e, As + a, o);
        this.content = n.decode(c);
      } else if (l === kc.BIN) {
        const c = As + a;
        this.body = e.slice(c, c + o);
      }
      a += o;
    }
    if (this.content === null) throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class mx {
  constructor(e, t) {
    if (!t) throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = Ve.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(e, t) {
    const n = this.json, s = this.dracoLoader, r = e.extensions[this.name].bufferView, a = e.extensions[this.name].attributes, o = {}, l = {}, c = {};
    for (const u in a) {
      const h = Po[u] || u.toLowerCase();
      o[h] = a[u];
    }
    for (const u in e.attributes) {
      const h = Po[u] || u.toLowerCase();
      if (a[u] !== void 0) {
        const d = n.accessors[e.attributes[u]], p = Qi[d.componentType];
        c[h] = p.name, l[h] = d.normalized === true;
      }
    }
    return t.getDependency("bufferView", r).then(function(u) {
      return new Promise(function(h, d) {
        s.decodeDracoFile(u, function(p) {
          for (const g in p.attributes) {
            const _ = p.attributes[g], m = l[g];
            m !== void 0 && (_.normalized = m);
          }
          h(p);
        }, o, c, Ct, d);
      });
    });
  }
}
class gx {
  constructor() {
    this.name = Ve.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = true), e;
  }
}
class _x {
  constructor() {
    this.name = Ve.KHR_MESH_QUANTIZATION;
  }
}
class Yh extends Vs {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, n = this.sampleValues, s = this.valueSize, r = e * s * 3 + s;
    for (let a = 0; a !== s; a++) t[a] = n[r + a];
    return t;
  }
  interpolate_(e, t, n, s) {
    const r = this.resultBuffer, a = this.sampleValues, o = this.valueSize, l = o * 2, c = o * 3, u = s - t, h = (n - t) / u, d = h * h, p = d * h, g = e * c, _ = g - c, m = -2 * p + 3 * d, f = p - d, b = 1 - m, E = f - d + h;
    for (let y = 0; y !== o; y++) {
      const w = a[_ + y + o], C = a[_ + y + l] * u, R = a[g + y + o], N = a[g + y] * u;
      r[y] = b * w + E * C + m * R + f * N;
    }
    return r;
  }
}
const xx = new Tn();
class vx extends Yh {
  interpolate_(e, t, n, s) {
    const r = super.interpolate_(e, t, n, s);
    return xx.fromArray(r).normalize().toArray(r), r;
  }
}
const Qt = { POINTS: 0, LINES: 1, LINE_LOOP: 2, LINE_STRIP: 3, TRIANGLES: 4, TRIANGLE_STRIP: 5, TRIANGLE_FAN: 6 }, Qi = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array }, zc = { 9728: Nt, 9729: Ht, 9984: nh, 9985: Sr, 9986: ws, 9987: On }, Hc = { 33071: ni, 33648: Pr, 10497: is }, Da = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 }, Po = { POSITION: "position", NORMAL: "normal", TANGENT: "tangent", TEXCOORD_0: "uv", TEXCOORD_1: "uv1", TEXCOORD_2: "uv2", TEXCOORD_3: "uv3", COLOR_0: "color", WEIGHTS_0: "skinWeight", JOINTS_0: "skinIndex" }, Zn = { scale: "scale", translation: "position", rotation: "quaternion", weights: "morphTargetInfluences" }, yx = { CUBICSPLINE: void 0, LINEAR: Bs, STEP: Os }, Ia = { OPAQUE: "OPAQUE", MASK: "MASK", BLEND: "BLEND" };
function Mx(i) {
  return i.DefaultMaterial === void 0 && (i.DefaultMaterial = new Ai({ color: 16777215, emissive: 0, metalness: 1, roughness: 1, transparent: false, depthTest: true, side: Vn })), i.DefaultMaterial;
}
function gi(i, e, t) {
  for (const n in t.extensions) i[n] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[n] = t.extensions[n]);
}
function xn(i, e) {
  e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(i.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
}
function Sx(i, e, t) {
  let n = false, s = false, r = false;
  for (let c = 0, u = e.length; c < u; c++) {
    const h = e[c];
    if (h.POSITION !== void 0 && (n = true), h.NORMAL !== void 0 && (s = true), h.COLOR_0 !== void 0 && (r = true), n && s && r) break;
  }
  if (!n && !s && !r) return Promise.resolve(i);
  const a = [], o = [], l = [];
  for (let c = 0, u = e.length; c < u; c++) {
    const h = e[c];
    if (n) {
      const d = h.POSITION !== void 0 ? t.getDependency("accessor", h.POSITION) : i.attributes.position;
      a.push(d);
    }
    if (s) {
      const d = h.NORMAL !== void 0 ? t.getDependency("accessor", h.NORMAL) : i.attributes.normal;
      o.push(d);
    }
    if (r) {
      const d = h.COLOR_0 !== void 0 ? t.getDependency("accessor", h.COLOR_0) : i.attributes.color;
      l.push(d);
    }
  }
  return Promise.all([Promise.all(a), Promise.all(o), Promise.all(l)]).then(function(c) {
    const u = c[0], h = c[1], d = c[2];
    return n && (i.morphAttributes.position = u), s && (i.morphAttributes.normal = h), r && (i.morphAttributes.color = d), i.morphTargetsRelative = true, i;
  });
}
function Ex(i, e) {
  if (i.updateMorphTargets(), e.weights !== void 0) for (let t = 0, n = e.weights.length; t < n; t++) i.morphTargetInfluences[t] = e.weights[t];
  if (e.extras && Array.isArray(e.extras.targetNames)) {
    const t = e.extras.targetNames;
    if (i.morphTargetInfluences.length === t.length) {
      i.morphTargetDictionary = {};
      for (let n = 0, s = t.length; n < s; n++) i.morphTargetDictionary[t[n]] = n;
    } else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function Tx(i) {
  let e;
  const t = i.extensions && i.extensions[Ve.KHR_DRACO_MESH_COMPRESSION];
  if (t ? e = "draco:" + t.bufferView + ":" + t.indices + ":" + Ua(t.attributes) : e = i.indices + ":" + Ua(i.attributes) + ":" + i.mode, i.targets !== void 0) for (let n = 0, s = i.targets.length; n < s; n++) e += ":" + Ua(i.targets[n]);
  return e;
}
function Ua(i) {
  let e = "";
  const t = Object.keys(i).sort();
  for (let n = 0, s = t.length; n < s; n++) e += t[n] + ":" + i[t[n]] + ";";
  return e;
}
function Lo(i) {
  switch (i) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function bx(i) {
  return i.search(/\.jpe?g($|\?)/i) > 0 || i.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : i.search(/\.webp($|\?)/i) > 0 || i.search(/^data\:image\/webp/) === 0 ? "image/webp" : i.search(/\.ktx2($|\?)/i) > 0 || i.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
const Ax = new Be();
class wx {
  constructor(e = {}, t = {}) {
    this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new K0(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let n = false, s = -1, r = false, a = -1;
    if (typeof navigator < "u") {
      const o = navigator.userAgent;
      n = /^((?!chrome|android).)*safari/i.test(o) === true;
      const l = o.match(/Version\/(\d+)/);
      s = n && l ? parseInt(l[1], 10) : -1, r = o.indexOf("Firefox") > -1, a = r ? o.match(/Firefox\/([0-9]+)\./)[1] : -1;
    }
    typeof createImageBitmap > "u" || n && s < 17 || r && a < 98 ? this.textureLoader = new Dh(this.options.manager) : this.textureLoader = new yf(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new Lh(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(true);
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const n = this, s = this.json, r = this.extensions;
    this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(a) {
      return a._markDefs && a._markDefs();
    }), Promise.all(this._invokeAll(function(a) {
      return a.beforeRoot && a.beforeRoot();
    })).then(function() {
      return Promise.all([n.getDependencies("scene"), n.getDependencies("animation"), n.getDependencies("camera")]);
    }).then(function(a) {
      const o = { scene: a[0][s.scene || 0], scenes: a[0], animations: a[1], cameras: a[2], asset: s.asset, parser: n, userData: {} };
      return gi(r, o, s), xn(o, s), Promise.all(n._invokeAll(function(l) {
        return l.afterRoot && l.afterRoot(o);
      })).then(function() {
        for (const l of o.scenes) l.updateMatrixWorld();
        e(o);
      });
    }).catch(t);
  }
  _markDefs() {
    const e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
    for (let s = 0, r = t.length; s < r; s++) {
      const a = t[s].joints;
      for (let o = 0, l = a.length; o < l; o++) e[a[o]].isBone = true;
    }
    for (let s = 0, r = e.length; s < r; s++) {
      const a = e[s];
      a.mesh !== void 0 && (this._addNodeRef(this.meshCache, a.mesh), a.skin !== void 0 && (n[a.mesh].isSkinnedMesh = true)), a.camera !== void 0 && this._addNodeRef(this.cameraCache, a.camera);
    }
  }
  _addNodeRef(e, t) {
    t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }
  _getNodeRef(e, t, n) {
    if (e.refs[t] <= 1) return n;
    const s = n.clone(), r = (a, o) => {
      const l = this.associations.get(a);
      l != null && this.associations.set(o, l);
      for (const [c, u] of a.children.entries()) r(u, o.children[c]);
    };
    return r(n, s), s.name += "_instance_" + e.uses[t]++, s;
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let n = 0; n < t.length; n++) {
      const s = e(t[n]);
      if (s) return s;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const n = [];
    for (let s = 0; s < t.length; s++) {
      const r = e(t[s]);
      r && n.push(r);
    }
    return n;
  }
  getDependency(e, t) {
    const n = e + ":" + t;
    let s = this.cache.get(n);
    if (!s) {
      switch (e) {
        case "scene":
          s = this.loadScene(t);
          break;
        case "node":
          s = this._invokeOne(function(r) {
            return r.loadNode && r.loadNode(t);
          });
          break;
        case "mesh":
          s = this._invokeOne(function(r) {
            return r.loadMesh && r.loadMesh(t);
          });
          break;
        case "accessor":
          s = this.loadAccessor(t);
          break;
        case "bufferView":
          s = this._invokeOne(function(r) {
            return r.loadBufferView && r.loadBufferView(t);
          });
          break;
        case "buffer":
          s = this.loadBuffer(t);
          break;
        case "material":
          s = this._invokeOne(function(r) {
            return r.loadMaterial && r.loadMaterial(t);
          });
          break;
        case "texture":
          s = this._invokeOne(function(r) {
            return r.loadTexture && r.loadTexture(t);
          });
          break;
        case "skin":
          s = this.loadSkin(t);
          break;
        case "animation":
          s = this._invokeOne(function(r) {
            return r.loadAnimation && r.loadAnimation(t);
          });
          break;
        case "camera":
          s = this.loadCamera(t);
          break;
        default:
          if (s = this._invokeOne(function(r) {
            return r != this && r.getDependency && r.getDependency(e, t);
          }), !s) throw new Error("Unknown type: " + e);
          break;
      }
      this.cache.add(n, s);
    }
    return s;
  }
  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const n = this, s = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      t = Promise.all(s.map(function(r, a) {
        return n.getDependency(e, a);
      })), this.cache.add(e, t);
    }
    return t;
  }
  loadBuffer(e) {
    const t = this.json.buffers[e], n = this.fileLoader;
    if (t.type && t.type !== "arraybuffer") throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[Ve.KHR_BINARY_GLTF].body);
    const s = this.options;
    return new Promise(function(r, a) {
      n.load(Ls.resolveURL(t.uri, s.path), r, void 0, function() {
        a(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency("buffer", t.buffer).then(function(n) {
      const s = t.byteLength || 0, r = t.byteOffset || 0;
      return n.slice(r, r + s);
    });
  }
  loadAccessor(e) {
    const t = this, n = this.json, s = this.json.accessors[e];
    if (s.bufferView === void 0 && s.sparse === void 0) {
      const a = Da[s.type], o = Qi[s.componentType], l = s.normalized === true, c = new o(s.count * a);
      return Promise.resolve(new Ft(c, a, l));
    }
    const r = [];
    return s.bufferView !== void 0 ? r.push(this.getDependency("bufferView", s.bufferView)) : r.push(null), s.sparse !== void 0 && (r.push(this.getDependency("bufferView", s.sparse.indices.bufferView)), r.push(this.getDependency("bufferView", s.sparse.values.bufferView))), Promise.all(r).then(function(a) {
      const o = a[0], l = Da[s.type], c = Qi[s.componentType], u = c.BYTES_PER_ELEMENT, h = u * l, d = s.byteOffset || 0, p = s.bufferView !== void 0 ? n.bufferViews[s.bufferView].byteStride : void 0, g = s.normalized === true;
      let _, m;
      if (p && p !== h) {
        const f = Math.floor(d / p), b = "InterleavedBuffer:" + s.bufferView + ":" + s.componentType + ":" + f + ":" + s.count;
        let E = t.cache.get(b);
        E || (_ = new c(o, f * p, s.count * p / u), E = new Vd(_, p / u), t.cache.add(b, E)), m = new Zo(E, l, d % p / u, g);
      } else o === null ? _ = new c(s.count * l) : _ = new c(o, d, s.count * l), m = new Ft(_, l, g);
      if (s.sparse !== void 0) {
        const f = Da.SCALAR, b = Qi[s.sparse.indices.componentType], E = s.sparse.indices.byteOffset || 0, y = s.sparse.values.byteOffset || 0, w = new b(a[1], E, s.sparse.count * f), C = new c(a[2], y, s.sparse.count * l);
        o !== null && (m = new Ft(m.array.slice(), m.itemSize, m.normalized)), m.normalized = false;
        for (let R = 0, N = w.length; R < N; R++) {
          const S = w[R];
          if (m.setX(S, C[R * l]), l >= 2 && m.setY(S, C[R * l + 1]), l >= 3 && m.setZ(S, C[R * l + 2]), l >= 4 && m.setW(S, C[R * l + 3]), l >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
        m.normalized = g;
      }
      return m;
    });
  }
  loadTexture(e) {
    const t = this.json, n = this.options, r = t.textures[e].source, a = t.images[r];
    let o = this.textureLoader;
    if (a.uri) {
      const l = n.manager.getHandler(a.uri);
      l !== null && (o = l);
    }
    return this.loadTextureImage(e, r, o);
  }
  loadTextureImage(e, t, n) {
    const s = this, r = this.json, a = r.textures[e], o = r.images[t], l = (o.uri || o.bufferView) + ":" + a.sampler;
    if (this.textureCache[l]) return this.textureCache[l];
    const c = this.loadImageSource(t, n).then(function(u) {
      u.flipY = false, u.name = a.name || o.name || "", u.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === false && (u.name = o.uri);
      const d = (r.samplers || {})[a.sampler] || {};
      return u.magFilter = zc[d.magFilter] || Ht, u.minFilter = zc[d.minFilter] || On, u.wrapS = Hc[d.wrapS] || is, u.wrapT = Hc[d.wrapT] || is, u.generateMipmaps = !u.isCompressedTexture && u.minFilter !== Nt && u.minFilter !== Ht, s.associations.set(u, { textures: e }), u;
    }).catch(function() {
      return null;
    });
    return this.textureCache[l] = c, c;
  }
  loadImageSource(e, t) {
    const n = this, s = this.json, r = this.options;
    if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((h) => h.clone());
    const a = s.images[e], o = self.URL || self.webkitURL;
    let l = a.uri || "", c = false;
    if (a.bufferView !== void 0) l = n.getDependency("bufferView", a.bufferView).then(function(h) {
      c = true;
      const d = new Blob([h], { type: a.mimeType });
      return l = o.createObjectURL(d), l;
    });
    else if (a.uri === void 0) throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const u = Promise.resolve(l).then(function(h) {
      return new Promise(function(d, p) {
        let g = d;
        t.isImageBitmapLoader === true && (g = function(_) {
          const m = new bt(_);
          m.needsUpdate = true, d(m);
        }), t.load(Ls.resolveURL(h, r.path), g, void 0, p);
      });
    }).then(function(h) {
      return c === true && o.revokeObjectURL(l), xn(h, a), h.userData.mimeType = a.mimeType || bx(a.uri), h;
    }).catch(function(h) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", l), h;
    });
    return this.sourceCache[e] = u, u;
  }
  assignTexture(e, t, n, s) {
    const r = this;
    return this.getDependency("texture", n.index).then(function(a) {
      if (!a) return null;
      if (n.texCoord !== void 0 && n.texCoord > 0 && (a = a.clone(), a.channel = n.texCoord), r.extensions[Ve.KHR_TEXTURE_TRANSFORM]) {
        const o = n.extensions !== void 0 ? n.extensions[Ve.KHR_TEXTURE_TRANSFORM] : void 0;
        if (o) {
          const l = r.associations.get(a);
          a = r.extensions[Ve.KHR_TEXTURE_TRANSFORM].extendTexture(a, o), r.associations.set(a, l);
        }
      }
      return s !== void 0 && (a.colorSpace = s), e[t] = a, a;
    });
  }
  assignFinalMaterial(e) {
    const t = e.geometry;
    let n = e.material;
    const s = t.attributes.tangent === void 0, r = t.attributes.color !== void 0, a = t.attributes.normal === void 0;
    if (e.isPoints) {
      const o = "PointsMaterial:" + n.uuid;
      let l = this.cache.get(o);
      l || (l = new Ah(), dn.prototype.copy.call(l, n), l.color.copy(n.color), l.map = n.map, l.sizeAttenuation = false, this.cache.add(o, l)), n = l;
    } else if (e.isLine) {
      const o = "LineBasicMaterial:" + n.uuid;
      let l = this.cache.get(o);
      l || (l = new bh(), dn.prototype.copy.call(l, n), l.color.copy(n.color), l.map = n.map, this.cache.add(o, l)), n = l;
    }
    if (s || r || a) {
      let o = "ClonedMaterial:" + n.uuid + ":";
      s && (o += "derivative-tangents:"), r && (o += "vertex-colors:"), a && (o += "flat-shading:");
      let l = this.cache.get(o);
      l || (l = n.clone(), r && (l.vertexColors = true), a && (l.flatShading = true), s && (l.normalScale && (l.normalScale.y *= -1), l.clearcoatNormalScale && (l.clearcoatNormalScale.y *= -1)), this.cache.add(o, l), this.associations.set(l, this.associations.get(n))), n = l;
    }
    e.material = n;
  }
  getMaterialType() {
    return Ai;
  }
  loadMaterial(e) {
    const t = this, n = this.json, s = this.extensions, r = n.materials[e];
    let a;
    const o = {}, l = r.extensions || {}, c = [];
    if (l[Ve.KHR_MATERIALS_UNLIT]) {
      const h = s[Ve.KHR_MATERIALS_UNLIT];
      a = h.getMaterialType(), c.push(h.extendParams(o, r, t));
    } else {
      const h = r.pbrMetallicRoughness || {};
      if (o.color = new we(1, 1, 1), o.opacity = 1, Array.isArray(h.baseColorFactor)) {
        const d = h.baseColorFactor;
        o.color.setRGB(d[0], d[1], d[2], Ct), o.opacity = d[3];
      }
      h.baseColorTexture !== void 0 && c.push(t.assignTexture(o, "map", h.baseColorTexture, yt)), o.metalness = h.metallicFactor !== void 0 ? h.metallicFactor : 1, o.roughness = h.roughnessFactor !== void 0 ? h.roughnessFactor : 1, h.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(o, "metalnessMap", h.metallicRoughnessTexture)), c.push(t.assignTexture(o, "roughnessMap", h.metallicRoughnessTexture))), a = this._invokeOne(function(d) {
        return d.getMaterialType && d.getMaterialType(e);
      }), c.push(Promise.all(this._invokeAll(function(d) {
        return d.extendMaterialParams && d.extendMaterialParams(e, o);
      })));
    }
    r.doubleSided === true && (o.side = Mn);
    const u = r.alphaMode || Ia.OPAQUE;
    if (u === Ia.BLEND ? (o.transparent = true, o.depthWrite = false) : (o.transparent = false, u === Ia.MASK && (o.alphaTest = r.alphaCutoff !== void 0 ? r.alphaCutoff : 0.5)), r.normalTexture !== void 0 && a !== ii && (c.push(t.assignTexture(o, "normalMap", r.normalTexture)), o.normalScale = new Ee(1, 1), r.normalTexture.scale !== void 0)) {
      const h = r.normalTexture.scale;
      o.normalScale.set(h, h);
    }
    if (r.occlusionTexture !== void 0 && a !== ii && (c.push(t.assignTexture(o, "aoMap", r.occlusionTexture)), r.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = r.occlusionTexture.strength)), r.emissiveFactor !== void 0 && a !== ii) {
      const h = r.emissiveFactor;
      o.emissive = new we().setRGB(h[0], h[1], h[2], Ct);
    }
    return r.emissiveTexture !== void 0 && a !== ii && c.push(t.assignTexture(o, "emissiveMap", r.emissiveTexture, yt)), Promise.all(c).then(function() {
      const h = new a(o);
      return r.name && (h.name = r.name), xn(h, r), t.associations.set(h, { materials: e }), r.extensions && gi(s, h, r), h;
    });
  }
  createUniqueName(e) {
    const t = Je.sanitizeNodeName(e || "");
    return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
  }
  loadGeometries(e) {
    const t = this, n = this.extensions, s = this.primitiveCache;
    function r(o) {
      return n[Ve.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o, t).then(function(l) {
        return Vc(l, o, t);
      });
    }
    const a = [];
    for (let o = 0, l = e.length; o < l; o++) {
      const c = e[o], u = Tx(c), h = s[u];
      if (h) a.push(h.promise);
      else {
        let d;
        c.extensions && c.extensions[Ve.KHR_DRACO_MESH_COMPRESSION] ? d = r(c) : d = Vc(new wn(), c, t), s[u] = { primitive: c, promise: d }, a.push(d);
      }
    }
    return Promise.all(a);
  }
  loadMesh(e) {
    const t = this, n = this.json, s = this.extensions, r = n.meshes[e], a = r.primitives, o = [];
    for (let l = 0, c = a.length; l < c; l++) {
      const u = a[l].material === void 0 ? Mx(this.cache) : this.getDependency("material", a[l].material);
      o.push(u);
    }
    return o.push(t.loadGeometries(a)), Promise.all(o).then(function(l) {
      const c = l.slice(0, l.length - 1), u = l[l.length - 1], h = [];
      for (let p = 0, g = u.length; p < g; p++) {
        const _ = u[p], m = a[p];
        let f;
        const b = c[p];
        if (m.mode === Qt.TRIANGLES || m.mode === Qt.TRIANGLE_STRIP || m.mode === Qt.TRIANGLE_FAN || m.mode === void 0) f = r.isSkinnedMesh === true ? new Wd(_, b) : new _t(_, b), f.isSkinnedMesh === true && f.normalizeSkinWeights(), m.mode === Qt.TRIANGLE_STRIP ? f.geometry = Bc(f.geometry, hh) : m.mode === Qt.TRIANGLE_FAN && (f.geometry = Bc(f.geometry, So));
        else if (m.mode === Qt.LINES) f = new Zd(_, b);
        else if (m.mode === Qt.LINE_STRIP) f = new Qo(_, b);
        else if (m.mode === Qt.LINE_LOOP) f = new $d(_, b);
        else if (m.mode === Qt.POINTS) f = new Jd(_, b);
        else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + m.mode);
        Object.keys(f.geometry.morphAttributes).length > 0 && Ex(f, r), f.name = t.createUniqueName(r.name || "mesh_" + e), xn(f, r), m.extensions && gi(s, f, m), t.assignFinalMaterial(f), h.push(f);
      }
      for (let p = 0, g = h.length; p < g; p++) t.associations.set(h[p], { meshes: e, primitives: p });
      if (h.length === 1) return r.extensions && gi(s, h[0], r), h[0];
      const d = new Si();
      r.extensions && gi(s, d, r), t.associations.set(d, { meshes: e });
      for (let p = 0, g = h.length; p < g; p++) d.add(h[p]);
      return d;
    });
  }
  loadCamera(e) {
    let t;
    const n = this.json.cameras[e], s = n[n.type];
    if (!s) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return n.type === "perspective" ? t = new zt(en.radToDeg(s.yfov), s.aspectRatio || 1, s.znear || 1, s.zfar || 2e6) : n.type === "orthographic" && (t = new Gr(-s.xmag, s.xmag, s.ymag, -s.ymag, s.znear, s.zfar)), n.name && (t.name = this.createUniqueName(n.name)), xn(t, n), Promise.resolve(t);
  }
  loadSkin(e) {
    const t = this.json.skins[e], n = [];
    for (let s = 0, r = t.joints.length; s < r; s++) n.push(this._loadNodeShallow(t.joints[s]));
    return t.inverseBindMatrices !== void 0 ? n.push(this.getDependency("accessor", t.inverseBindMatrices)) : n.push(null), Promise.all(n).then(function(s) {
      const r = s.pop(), a = s, o = [], l = [];
      for (let c = 0, u = a.length; c < u; c++) {
        const h = a[c];
        if (h) {
          o.push(h);
          const d = new Be();
          r !== null && d.fromArray(r.array, c * 16), l.push(d);
        } else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[c]);
      }
      return new $o(o, l);
    });
  }
  loadAnimation(e) {
    const t = this.json, n = this, s = t.animations[e], r = s.name ? s.name : "animation_" + e, a = [], o = [], l = [], c = [], u = [];
    for (let h = 0, d = s.channels.length; h < d; h++) {
      const p = s.channels[h], g = s.samplers[p.sampler], _ = p.target, m = _.node, f = s.parameters !== void 0 ? s.parameters[g.input] : g.input, b = s.parameters !== void 0 ? s.parameters[g.output] : g.output;
      _.node !== void 0 && (a.push(this.getDependency("node", m)), o.push(this.getDependency("accessor", f)), l.push(this.getDependency("accessor", b)), c.push(g), u.push(_));
    }
    return Promise.all([Promise.all(a), Promise.all(o), Promise.all(l), Promise.all(c), Promise.all(u)]).then(function(h) {
      const d = h[0], p = h[1], g = h[2], _ = h[3], m = h[4], f = [];
      for (let E = 0, y = d.length; E < y; E++) {
        const w = d[E], C = p[E], R = g[E], N = _[E], S = m[E];
        if (w === void 0) continue;
        w.updateMatrix && w.updateMatrix();
        const M = n._createAnimationTracks(w, C, R, N, S);
        if (M) for (let P = 0; P < M.length; P++) f.push(M[P]);
      }
      const b = new cf(r, void 0, f);
      return xn(b, s), b;
    });
  }
  createNodeMesh(e) {
    const t = this.json, n = this, s = t.nodes[e];
    return s.mesh === void 0 ? null : n.getDependency("mesh", s.mesh).then(function(r) {
      const a = n._getNodeRef(n.meshCache, s.mesh, r);
      return s.weights !== void 0 && a.traverse(function(o) {
        if (o.isMesh) for (let l = 0, c = s.weights.length; l < c; l++) o.morphTargetInfluences[l] = s.weights[l];
      }), a;
    });
  }
  loadNode(e) {
    const t = this.json, n = this, s = t.nodes[e], r = n._loadNodeShallow(e), a = [], o = s.children || [];
    for (let c = 0, u = o.length; c < u; c++) a.push(n.getDependency("node", o[c]));
    const l = s.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", s.skin);
    return Promise.all([r, Promise.all(a), l]).then(function(c) {
      const u = c[0], h = c[1], d = c[2];
      d !== null && u.traverse(function(p) {
        p.isSkinnedMesh && p.bind(d, Ax);
      });
      for (let p = 0, g = h.length; p < g; p++) u.add(h[p]);
      return u;
    });
  }
  _loadNodeShallow(e) {
    const t = this.json, n = this.extensions, s = this;
    if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
    const r = t.nodes[e], a = r.name ? s.createUniqueName(r.name) : "", o = [], l = s._invokeOne(function(c) {
      return c.createNodeMesh && c.createNodeMesh(e);
    });
    return l && o.push(l), r.camera !== void 0 && o.push(s.getDependency("camera", r.camera).then(function(c) {
      return s._getNodeRef(s.cameraCache, r.camera, c);
    })), s._invokeAll(function(c) {
      return c.createNodeAttachment && c.createNodeAttachment(e);
    }).forEach(function(c) {
      o.push(c);
    }), this.nodeCache[e] = Promise.all(o).then(function(c) {
      let u;
      if (r.isBone === true ? u = new Sh() : c.length > 1 ? u = new Si() : c.length === 1 ? u = c[0] : u = new ot(), u !== c[0]) for (let h = 0, d = c.length; h < d; h++) u.add(c[h]);
      if (r.name && (u.userData.name = r.name, u.name = a), xn(u, r), r.extensions && gi(n, u, r), r.matrix !== void 0) {
        const h = new Be();
        h.fromArray(r.matrix), u.applyMatrix4(h);
      } else r.translation !== void 0 && u.position.fromArray(r.translation), r.rotation !== void 0 && u.quaternion.fromArray(r.rotation), r.scale !== void 0 && u.scale.fromArray(r.scale);
      if (!s.associations.has(u)) s.associations.set(u, {});
      else if (r.mesh !== void 0 && s.meshCache.refs[r.mesh] > 1) {
        const h = s.associations.get(u);
        s.associations.set(u, { ...h });
      }
      return s.associations.get(u).nodes = e, u;
    }), this.nodeCache[e];
  }
  loadScene(e) {
    const t = this.extensions, n = this.json.scenes[e], s = this, r = new Si();
    n.name && (r.name = s.createUniqueName(n.name)), xn(r, n), n.extensions && gi(t, r, n);
    const a = n.nodes || [], o = [];
    for (let l = 0, c = a.length; l < c; l++) o.push(s.getDependency("node", a[l]));
    return Promise.all(o).then(function(l) {
      for (let u = 0, h = l.length; u < h; u++) r.add(l[u]);
      const c = (u) => {
        const h = /* @__PURE__ */ new Map();
        for (const [d, p] of s.associations) (d instanceof dn || d instanceof bt) && h.set(d, p);
        return u.traverse((d) => {
          const p = s.associations.get(d);
          p != null && h.set(d, p);
        }), h;
      };
      return s.associations = c(r), r;
    });
  }
  _createAnimationTracks(e, t, n, s, r) {
    const a = [], o = e.name ? e.name : e.uuid, l = [];
    Zn[r.path] === Zn.weights ? e.traverse(function(d) {
      d.morphTargetInfluences && l.push(d.name ? d.name : d.uuid);
    }) : l.push(o);
    let c;
    switch (Zn[r.path]) {
      case Zn.weights:
        c = as;
        break;
      case Zn.rotation:
        c = os;
        break;
      case Zn.translation:
      case Zn.scale:
        c = ls;
        break;
      default:
        n.itemSize === 1 ? c = as : c = ls;
        break;
    }
    const u = s.interpolation !== void 0 ? yx[s.interpolation] : Bs, h = this._getArrayFromAccessor(n);
    for (let d = 0, p = l.length; d < p; d++) {
      const g = new c(l[d] + "." + Zn[r.path], t.array, h, u);
      s.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(g), a.push(g);
    }
    return a;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const n = Lo(t.constructor), s = new Float32Array(t.length);
      for (let r = 0, a = t.length; r < a; r++) s[r] = t[r] * n;
      t = s;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    e.createInterpolant = function(n) {
      const s = this instanceof os ? vx : Yh;
      return new s(this.times, this.values, this.getValueSize() / 3, n);
    }, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
  }
}
function Rx(i, e, t) {
  const n = e.attributes, s = new Kt();
  if (n.POSITION !== void 0) {
    const o = t.json.accessors[n.POSITION], l = o.min, c = o.max;
    if (l !== void 0 && c !== void 0) {
      if (s.set(new L(l[0], l[1], l[2]), new L(c[0], c[1], c[2])), o.normalized) {
        const u = Lo(Qi[o.componentType]);
        s.min.multiplyScalar(u), s.max.multiplyScalar(u);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else return;
  const r = e.targets;
  if (r !== void 0) {
    const o = new L(), l = new L();
    for (let c = 0, u = r.length; c < u; c++) {
      const h = r[c];
      if (h.POSITION !== void 0) {
        const d = t.json.accessors[h.POSITION], p = d.min, g = d.max;
        if (p !== void 0 && g !== void 0) {
          if (l.setX(Math.max(Math.abs(p[0]), Math.abs(g[0]))), l.setY(Math.max(Math.abs(p[1]), Math.abs(g[1]))), l.setZ(Math.max(Math.abs(p[2]), Math.abs(g[2]))), d.normalized) {
            const _ = Lo(Qi[d.componentType]);
            l.multiplyScalar(_);
          }
          o.max(l);
        } else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    s.expandByVector(o);
  }
  i.boundingBox = s;
  const a = new An();
  s.getCenter(a.center), a.radius = s.min.distanceTo(s.max) / 2, i.boundingSphere = a;
}
function Vc(i, e, t) {
  const n = e.attributes, s = [];
  function r(a, o) {
    return t.getDependency("accessor", a).then(function(l) {
      i.setAttribute(o, l);
    });
  }
  for (const a in n) {
    const o = Po[a] || a.toLowerCase();
    o in i.attributes || s.push(r(n[a], o));
  }
  if (e.indices !== void 0 && !i.index) {
    const a = t.getDependency("accessor", e.indices).then(function(o) {
      i.setIndex(o);
    });
    s.push(a);
  }
  return qe.workingColorSpace !== Ct && "COLOR_0" in n && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${qe.workingColorSpace}" not supported.`), xn(i, e), Rx(i, e, t), Promise.all(s).then(function() {
    return e.targets !== void 0 ? Sx(i, e.targets, t) : i;
  });
}
class Cx extends Mh {
  constructor() {
    super();
    const e = new ds();
    e.deleteAttribute("uv");
    const t = new Ai({ side: Ut }), n = new Ai(), s = new tl(16777215, 900, 28, 2);
    s.position.set(0.418, 16.199, 0.3), this.add(s);
    const r = new _t(e, t);
    r.position.set(-0.757, 13.219, 0.717), r.scale.set(31.713, 28.305, 28.591), this.add(r);
    const a = new Th(e, n, 6), o = new ot();
    o.position.set(-10.906, 2.009, 1.846), o.rotation.set(0, -0.195, 0), o.scale.set(2.328, 7.905, 4.651), o.updateMatrix(), a.setMatrixAt(0, o.matrix), o.position.set(-5.607, -0.754, -0.758), o.rotation.set(0, 0.994, 0), o.scale.set(1.97, 1.534, 3.955), o.updateMatrix(), a.setMatrixAt(1, o.matrix), o.position.set(6.167, 0.857, 7.803), o.rotation.set(0, 0.561, 0), o.scale.set(3.927, 6.285, 3.687), o.updateMatrix(), a.setMatrixAt(2, o.matrix), o.position.set(-2.017, 0.018, 6.124), o.rotation.set(0, 0.333, 0), o.scale.set(2.002, 4.566, 2.064), o.updateMatrix(), a.setMatrixAt(3, o.matrix), o.position.set(2.291, -0.756, -2.621), o.rotation.set(0, -0.286, 0), o.scale.set(1.546, 1.552, 1.496), o.updateMatrix(), a.setMatrixAt(4, o.matrix), o.position.set(-2.193, -0.369, -5.547), o.rotation.set(0, 0.516, 0), o.scale.set(3.875, 3.487, 2.986), o.updateMatrix(), a.setMatrixAt(5, o.matrix), this.add(a);
    const l = new _t(e, Yi(50));
    l.position.set(-16.116, 14.37, 8.208), l.scale.set(0.1, 2.428, 2.739), this.add(l);
    const c = new _t(e, Yi(50));
    c.position.set(-16.109, 18.021, -8.207), c.scale.set(0.1, 2.425, 2.751), this.add(c);
    const u = new _t(e, Yi(17));
    u.position.set(14.904, 12.198, -1.832), u.scale.set(0.15, 4.265, 6.331), this.add(u);
    const h = new _t(e, Yi(43));
    h.position.set(-0.462, 8.89, 14.52), h.scale.set(4.38, 5.441, 0.088), this.add(h);
    const d = new _t(e, Yi(20));
    d.position.set(3.235, 11.486, -12.541), d.scale.set(2.5, 2, 0.1), this.add(d);
    const p = new _t(e, Yi(100));
    p.position.set(0, 20, 0), p.scale.set(1, 0.1, 1), this.add(p);
  }
  dispose() {
    const e = /* @__PURE__ */ new Set();
    this.traverse((t) => {
      t.isMesh && (e.add(t.geometry), e.add(t.material));
    });
    for (const t of e) t.dispose();
  }
}
function Yi(i) {
  return new Qd({ color: 0, emissive: 16777215, emissiveIntensity: i });
}

export { zt, _t, Hr, kn, ti, en, Ee, L, Kt, vn, Df, Ct, Ai, pn, Ht, hs, Yt, ph, Ld, Ue, Qc, eh, yt, Zu, we, ii, Mh, Dh, gf, Ih, tl, Gr, nl, Lf, wo, g0, x0, X0, j0, Cx };
