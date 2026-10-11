/** Recovered from production v11. Minifier aliases are retained deliberately; this is not the lost original source.
 * Exact pre-recovery segment SHA256: 44aa2d16a79a9a43cf7ac759f92d45dc217eb58536fcf381ff6d5b59b25e91ad
 */

class Hx {
  constructor() {
    this.context = null, this.muted = false, this.voices = [], this.events = [];
  }
  async play(e) {
    const t = performance.now(), n = window.AudioContext || window.webkitAudioContext;
    if (!n) return;
    this.context ??= new n({ latencyHint: "interactive" });
    const s = this.context;
    if (s.state !== "running" && await s.resume(), this.muted) return;
    const r = s.currentTime + 3e-3, a = 440 * 2 ** ((e - 69) / 12), o = s.createGain();
    o.connect(s.destination), o.gain.setValueAtTime(1e-4, r), o.gain.exponentialRampToValueAtTime(0.16, r + 8e-3), o.gain.exponentialRampToValueAtTime(0.07, r + 0.14), o.gain.exponentialRampToValueAtTime(1e-4, r + Math.max(1.1, 3.4 - (e - 21) * 0.019));
    const l = [];
    for ([1, 2, 3, 4, 5, 7].forEach((c, u) => {
      const h = s.createOscillator(), d = s.createGain();
      h.type = "sine", h.frequency.value = a * c * Math.sqrt(1 + 9e-5 * c * c), d.gain.setValueAtTime([1, 0.43, 0.22, 0.13, 0.07, 0.035][u], r), d.gain.exponentialRampToValueAtTime(1e-5, r + Math.max(0.12, 2.6 / (1 + u * 0.8))), h.connect(d).connect(o), h.start(r), h.stop(r + 3.6), h.onended = () => {
        h.disconnect(), d.disconnect();
      }, l.push(h);
    }), this.voices.push({ voice: o, oscillators: l }); this.voices.length > 18; ) {
      const c = this.voices.shift();
      c.voice.gain.cancelScheduledValues(r), c.voice.gain.setTargetAtTime(1e-5, r, 0.02), setTimeout(() => c.voice.disconnect(), 140);
    }
    setTimeout(() => {
      o.disconnect(), this.voices = this.voices.filter((c) => c.voice !== o);
    }, 3800), this.events.push({ midi: e, frequency: a, requested: t, scheduled: performance.now(), audioTime: r }), this.events.length > 1e3 && this.events.shift();
  }
  setMuted(e) {
    this.muted = e, e && this.context && this.voices.forEach((t) => t.voice.gain.setTargetAtTime(1e-5, this.context.currentTime, 0.03));
  }
}

export { Hx, Hx as PianoAudio };
