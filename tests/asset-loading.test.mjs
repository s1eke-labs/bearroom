import test from 'node:test';
import assert from 'node:assert/strict';
import { gzipSync, gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Worker as NodeWorker } from 'node:worker_threads';
import { X0 as frozenGunzipSync } from '../vendor/runtime-v11.js';
import { fetchUint8Array, decodeGzip, createPhaseTimings } from '../src/asset-loading.js';

const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
function fakeClock() {
  let now = 0, next = 0;
  const tasks = new Map();
  return {
    now: () => now,
    setTimeout(fn, delay) { const id = ++next; tasks.set(id, { at: now + delay, fn }); return id; },
    clearTimeout(id) { tasks.delete(id); },
    async advance(ms) {
      const end = now + ms;
      await flush();
      while (true) {
        const first = [...tasks].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!first) break;
        now = first[1].at; tasks.delete(first[0]); first[1].fn(); await flush();
      }
      now = end; await flush();
    },
    get pending() { return tasks.size; },
  };
}
const pending = () => new Promise(() => {});
const response = chunks => new Response(new ReadableStream({ start(c) { for (const chunk of chunks) c.enqueue(Uint8Array.from(chunk)); c.close(); } }));
// Each spread gets an isolated deterministic clock. Cold native Response setup
// and parallel CI scheduling must not consume a simulated 20 ms network budget.
const options = { get clock() { return fakeClock(); }, headerTimeoutMs: 20, stallTimeoutMs: 30, totalTimeoutMs: 100, maxAttempts: 1, retryDelayMs: 0 };
const expectCode = code => e => e.code === code;

test('downloads streaming bytes and gives incremental attempt-local progress', async () => {
  const progress = [];
  const bytes = await fetchUint8Array('/model', { ...options, fetchImpl: async () => response([[1, 2], [3]]), onProgress: p => progress.push(p) });
  assert.deepEqual([...bytes], [1, 2, 3]);
  assert.deepEqual(progress.map(p => p.received), [0, 2, 3]);
});

test('stalled headers reject on budget even if fetch ignores abort', async () => {
  const clock = fakeClock(); let signal;
  const promise = fetchUint8Array('/model', { ...options, clock, fetchImpl: (_url, init) => { signal = init.signal; return pending(); } });
  const check = assert.rejects(promise, expectCode('HEADER_TIMEOUT'));
  await clock.advance(20); await check;
  assert.equal(signal.aborted, true); assert.equal(clock.pending, 0);
});

test('late header response is cancelled after timeout', async () => {
  const clock = fakeClock(); let resolveFetch, cancelled = 0;
  const promise = fetchUint8Array('/model', { ...options, clock, fetchImpl: () => new Promise(r => { resolveFetch = r; }) });
  const check = assert.rejects(promise, expectCode('HEADER_TIMEOUT'));
  await clock.advance(20); await check;
  resolveFetch({ body: { cancel() { cancelled++; } } }); await flush();
  assert.equal(cancelled, 1);
});

test('body stall cancels reader and releases stream lock', async () => {
  const clock = fakeClock(); let cancelled = 0, released = 0;
  const promise = fetchUint8Array('/model', { ...options, clock, fetchImpl: async () => ({ ok: true, body: { getReader: () => ({ read: pending, cancel() { cancelled++; }, releaseLock() { released++; } }) } }) });
  const check = assert.rejects(promise, expectCode('STALL_TIMEOUT'));
  await clock.advance(30); await check;
  assert.equal(cancelled, 1); assert.equal(released, 1); assert.equal(clock.pending, 0);
});

test('503 and stream network failure retry fresh bytes within bounded attempts', async () => {
  let attempts = 0, cancelled = 0;
  const phases = [];
  const bytes = await fetchUint8Array('/model', { ...options, maxAttempts: 3, totalTimeoutMs: 1000, onAttempt: p => phases.push(p.attempt), fetchImpl: async () => {
    attempts++;
    if (attempts === 1) return { ok: false, status: 503, body: { cancel() { cancelled++; } } };
    if (attempts === 2) { let calls = 0; return { ok: true, body: { getReader: () => ({ read() { if (++calls === 1) return { value: Uint8Array.of(99), done: false }; throw new TypeError('connection reset'); }, cancel() { cancelled++; }, releaseLock() {} }) } }; }
    return response([[4, 5]]);
  } });
  assert.deepEqual([...bytes], [4, 5]); assert.deepEqual(phases, [1, 2, 3]); assert.equal(cancelled, 2);
});

test('retries stop at maxAttempts and nontransient errors do not retry', async () => {
  for (const [status, expected] of [[503, 3], [404, 1]]) {
    let attempts = 0;
    await assert.rejects(fetchUint8Array('/model', { ...options, maxAttempts: 3, fetchImpl: async () => { attempts++; return { ok: false, status }; } }), e => e.code === 'HTTP_ERROR' && e.attempt === expected);
    assert.equal(attempts, expected);
  }
});

test('abort during headers, body or retry delay stops without another attempt', async () => {
  for (const phase of ['headers', 'body', 'retry']) {
    const clock = fakeClock(), controller = new AbortController(); let attempts = 0, cancelled = 0;
    const promise = fetchUint8Array('/model', { ...options, maxAttempts: 3, retryDelayMs: 50, clock, signal: controller.signal, fetchImpl: async () => {
      attempts++;
      if (phase === 'headers') return pending();
      if (phase === 'retry') return { ok: false, status: 503 };
      return { ok: true, body: { getReader: () => ({ read: pending, cancel() { cancelled++; }, releaseLock() {} }) } };
    } });
    const check = assert.rejects(promise, expectCode('ABORTED'));
    await flush(); controller.abort('user retry'); await check;
    assert.equal(attempts, 1); assert.equal(clock.pending, 0);
    if (phase === 'body') assert.equal(cancelled, 1);
  }
});

test('total budget bounds all retries and hidden time is deliberately wall clock', async () => {
  const clock = fakeClock(); let attempts = 0;
  const promise = fetchUint8Array('/model', { ...options, totalTimeoutMs: 55, maxAttempts: 5, clock, fetchImpl: () => { attempts++; return pending(); } });
  const check = assert.rejects(promise, expectCode('TOTAL_TIMEOUT'));
  await clock.advance(55); await check;
  assert.equal(attempts, 3); assert.equal(clock.pending, 0);
});

test('already aborted requests never fetch; a later invocation has fresh budgets', async () => {
  const controller = new AbortController(); controller.abort(); let calls = 0;
  const fetchImpl = async () => { calls++; return response([[7]]); };
  await assert.rejects(fetchUint8Array('/model', { ...options, fetchImpl, signal: controller.signal }), expectCode('ABORTED'));
  assert.equal(calls, 0);
  assert.deepEqual([...await fetchUint8Array('/model', { ...options, fetchImpl })], [7]);
});

test('download size limit aborts without retry', async () => {
  let attempts = 0;
  await assert.rejects(fetchUint8Array('/model', { ...options, maxBytes: 2, fetchImpl: async () => { attempts++; return response([[1, 2, 3]]); } }), expectCode('SIZE_LIMIT'));
  assert.equal(attempts, 1);
});

class BrowserNodeWorker {
  constructor(url) {
    const source = `const { parentPort } = require('node:worker_threads'); globalThis.self = { postMessage: (data, transfers) => parentPort.postMessage(data, transfers) }; import(${JSON.stringify(String(url))}).then(() => parentPort.on('message', data => self.onmessage({data})));`;
    this.worker = new NodeWorker(source, { eval: true });
    this.worker.on('message', data => this.onmessage?.({ data }));
    this.worker.on('error', error => this.onerror?.({ message: error.message }));
  }
  postMessage(data, transfer) { this.worker.postMessage(data, transfer); }
  terminate() { this.worker.terminate(); }
}
const workerUrl = new URL('../src/model-decode-worker.js', import.meta.url);

test('real worker decodes exact gzip bytes and preserves compressed retry input', async () => {
  const raw = Buffer.from('model bytes 🐻 '.repeat(5000));
  const gzip = gzipSync(raw), original = Buffer.from(gzip);
  for (let i = 0; i < 2; i++) {
    const decoded = await decodeGzip(gzip, { workerUrl, WorkerImpl: BrowserNodeWorker });
    assert.deepEqual(Buffer.from(decoded), raw); assert.deepEqual(gzip, original);
  }
});

test('worker corrupt input reports decode stage and does not fall back', async () => {
  let fallback = 0;
  await assert.rejects(decodeGzip(Uint8Array.of(1, 2, 3), { workerUrl, WorkerImpl: BrowserNodeWorker, DecompressionStreamImpl: class { constructor() { fallback++; } } }), e => e.code === 'INVALID_GZIP' && e.stage === 'decode');
  assert.equal(fallback, 0);
});

test('worker stalls and aborts terminate workers and remove handlers', async () => {
  for (const abort of [false, true]) {
    const clock = fakeClock(), controller = new AbortController(); let instance, terminated = 0;
    class Worker { constructor() { instance = this; } postMessage() {} terminate() { terminated++; } }
    const promise = decodeGzip(Uint8Array.of(1), { workerUrl, WorkerImpl: Worker, clock, timeoutMs: 25, signal: controller.signal });
    const check = assert.rejects(promise, expectCode(abort ? 'ABORTED' : 'TOTAL_TIMEOUT'));
    if (abort) controller.abort(); else await clock.advance(25);
    await check;
    assert.equal(terminated, 1); assert.equal(instance.onmessage, null); assert.equal(clock.pending, 0);
  }
});

test('native gzip fallback covers missing Worker and constructor/runtime failure', async () => {
  const raw = Buffer.from('fallback exact bytes'); const gzip = gzipSync(raw);
  class BrokenConstructor { constructor() { throw new Error('Blocked by browser'); } }
  class BrokenRuntime { postMessage() { queueMicrotask(() => this.onerror({ message: 'worker unavailable' })); } terminate() {} }
  for (const WorkerImpl of [null, BrokenConstructor, BrokenRuntime]) {
    const bytes = await decodeGzip(gzip, { WorkerImpl, workerUrl });
    assert.deepEqual(Buffer.from(bytes), raw);
  }
  await assert.rejects(decodeGzip(gzip, { WorkerImpl: null, DecompressionStreamImpl: null }), expectCode('DECODE_UNSUPPORTED'));
});

test('native gzip fallback is bounded and cancels stalled reader', async () => {
  const clock = fakeClock(); let cancelled = false;
  class StalledNative {
    constructor() {
      this.readable = new ReadableStream({ cancel() { cancelled = true; } });
      this.writable = new WritableStream();
    }
  }
  const promise = decodeGzip(Uint8Array.of(1), { WorkerImpl: null, DecompressionStreamImpl: StalledNative, timeoutMs: 25, clock });
  const check = assert.rejects(promise, expectCode('TOTAL_TIMEOUT'));
  await clock.advance(25); await check;
  assert.equal(cancelled, true);
});

test('phase timings are monotonic and finish is idempotent', () => {
  let now = 10; const events = [];
  const timer = createPhaseTimings({ now: () => now, onTiming: p => events.push(p) });
  const finish = timer.start('decode'); now = 24;
  assert.deepEqual(finish(), { phase: 'decode', startedAt: 10, durationMs: 14 });
  now = 30; finish(); assert.equal(events.length, 1); assert.equal(timer.measurements.length, 1);
});

test('real worker matches frozen decoder and zlib for the full production model', async t => {
  const packed = readFileSync(new URL('../public/assets/bearroom.glb.gz', import.meta.url));
  const expected = gunzipSync(packed);
  const actual = await decodeGzip(packed, { workerUrl, WorkerImpl: BrowserNodeWorker });
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  assert.equal(actual.byteLength, expected.byteLength);
  assert.equal(hash(actual), hash(expected));
  assert.equal(hash(actual), hash(frozenGunzipSync(packed)));
  t.diagnostic(`Decoded ${actual.byteLength} bytes; SHA-256 ${hash(actual)}`);
});

test('decode stage callback names worker and native fallback without changing bytes', async () => {
  const raw = Buffer.from('visible stages preserve exact bytes'), gzip = gzipSync(raw), stages = [];
  class BrokenWorker { constructor() { stages.push('construct'); throw Error('Worker unavailable'); } }
  const actual = await decodeGzip(gzip, {
    WorkerImpl: BrokenWorker, workerUrl,
    onDecodeStage: async ({ mode }) => { stages.push(mode); if (mode === 'worker') throw Error('Broken presentation'); },
  });
  assert.deepEqual(stages, ['worker', 'construct', 'native']);
  assert.deepEqual(Buffer.from(actual), raw);
});

test('native decode stage can paint before allocation while sharing the decode deadline', async () => {
  const raw = Buffer.from('yield before fallback'), gzip = gzipSync(raw), events = [];
  let paint;
  class Native { constructor(format) { events.push('allocate'); return new DecompressionStream(format); } }
  const task = decodeGzip(gzip, { WorkerImpl: null, DecompressionStreamImpl: Native,
    onDecodeStage: ({ mode }) => { events.push(mode); return new Promise(resolve => { paint = resolve; }); } });
  await flush(); assert.deepEqual(events, ['native']);
  paint(); assert.deepEqual(Buffer.from(await task), raw); assert.deepEqual(events, ['native', 'allocate']);
});

for (const stop of ['abort', 'timeout']) test(`pending decode stage callback is bounded by ${stop} and never starts late work`, async () => {
  const clock = fakeClock(), controller = new AbortController(); let allocated = 0, finishPaint;
  class Native { constructor(format) { allocated++; return new DecompressionStream(format); } }
  const task = decodeGzip(gzipSync(Buffer.from('late stage')), {
    WorkerImpl: null, DecompressionStreamImpl: Native, clock, timeoutMs: 25, signal: controller.signal,
    onDecodeStage: () => new Promise(resolve => { finishPaint = resolve; }),
  });
  const check = assert.rejects(task, expectCode(stop === 'abort' ? 'ABORTED' : 'TOTAL_TIMEOUT'));
  await flush();
  if (stop === 'abort') controller.abort(); else await clock.advance(25);
  await check; finishPaint(); await flush();
  assert.equal(allocated, 0); assert.equal(clock.pending, 0);
});
