export class PianoAudio {
  constructor() {
    this.context = null;
    this.muted = false;
    this.voices = [];
    this.events = [];
  }
  async play(midi) {
    const requested = performance.now();
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    this.context ??= new Audio({ latencyHint: "interactive" });
    const ctx = this.context;
    if (ctx.state !== "running") await ctx.resume();
    if (this.muted) return;
    const time = ctx.currentTime + 0.003,
      freq = 440 * 2 ** ((midi - 69) / 12);
    const voice = ctx.createGain();
    voice.connect(ctx.destination);
    voice.gain.setValueAtTime(0.0001, time);
    voice.gain.exponentialRampToValueAtTime(0.16, time + 0.008);
    voice.gain.exponentialRampToValueAtTime(0.07, time + 0.14);
    voice.gain.exponentialRampToValueAtTime(
      0.0001,
      time + Math.max(1.1, 3.4 - (midi - 21) * 0.019),
    );
    const oscillators = [];
    // Inharmonic, independently decaying partials provide a struck-string timbre.
    [1, 2, 3, 4, 5, 7].forEach((p, i) => {
      const osc = ctx.createOscillator(),
        gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * p * Math.sqrt(1 + 0.00009 * p * p);
      gain.gain.setValueAtTime([1, 0.43, 0.22, 0.13, 0.07, 0.035][i], time);
      gain.gain.exponentialRampToValueAtTime(
        0.00001,
        time + Math.max(0.12, 2.6 / (1 + i * 0.8)),
      );
      osc.connect(gain).connect(voice);
      osc.start(time);
      osc.stop(time + 3.6);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
      oscillators.push(osc);
    });
    this.voices.push({ voice, oscillators });
    while (this.voices.length > 18) {
      const old = this.voices.shift();
      old.voice.gain.cancelScheduledValues(time);
      old.voice.gain.setTargetAtTime(0.00001, time, 0.02);
      setTimeout(() => old.voice.disconnect(), 140);
    }
    setTimeout(() => {
      voice.disconnect();
      this.voices = this.voices.filter((v) => v.voice !== voice);
    }, 3800);
    this.events.push({
      midi,
      frequency: freq,
      requested,
      scheduled: performance.now(),
      audioTime: time,
    });
    if (this.events.length > 1000) this.events.shift();
  }
  setMuted(muted) {
    this.muted = muted;
    if (muted && this.context)
      this.voices.forEach((v) =>
        v.voice.gain.setTargetAtTime(0.00001, this.context.currentTime, 0.03),
      );
  }
}
