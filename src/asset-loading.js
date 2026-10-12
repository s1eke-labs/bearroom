/** Bounded, retry-safe asset I/O. All budgets are wall-clock (including hidden tabs).
 * Timers may be throttled by a browser, so elapsed time is also checked after awaits.
 * Each retry is a new GET; partial bytes are discarded and no ranges are resumed.
 */
export class AssetLoadError extends Error {
  constructor(message, { stage, code, attempt = 1, retryable = false, cause, status } = {}) {
    super(message, { cause });
    this.name = 'AssetLoadError';
    Object.assign(this, { stage, code, attempt, retryable, status });
  }
}
const defaultClock = { now: () => performance.now(), setTimeout: (...args) => setTimeout(...args), clearTimeout: id => clearTimeout(id) };
const fail = (stage, code, message, extra = {}) => new AssetLoadError(message, { stage, code, ...extra });
const report = (fn, value) => { try { fn?.(value); } catch { /* Diagnostics must not fail a load. */ } };
const cancel = (reader, reason) => { try { Promise.resolve(reader?.cancel(reason)).catch(() => {}); } catch { /* Already closed. */ } };
const positive = (value, name) => { if (!Number.isFinite(value) || value <= 0) throw new TypeError(`${name} must be positive and finite`); return value; };

function budget({ signal, timeoutMs, clock, stage }) {
  const end = clock.now() + positive(timeoutMs, 'timeoutMs');
  const check = () => {
    if (signal?.aborted) throw fail(stage, 'ABORTED', 'Asset operation cancelled', { cause: signal.reason });
    if (clock.now() >= end) throw fail(stage, 'TOTAL_TIMEOUT', `${stage} total time budget exceeded`);
  };
  const wait = (operation, ms, waitStage, timeoutCode) => {
    check();
    const remaining = end - clock.now();
    const duration = Math.min(positive(ms, 'stage timeout'), remaining);
    const stageEnd = clock.now() + duration;
    const timeoutError = () => fail(waitStage, remaining <= ms ? 'TOTAL_TIMEOUT' : timeoutCode, `${waitStage} time budget exceeded`, { retryable: remaining > ms });
    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = (error, value) => {
        if (settled) return;
        settled = true;
        clock.clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
        if (error) reject(error); else { try { check(); if (clock.now() >= stageEnd) throw timeoutError(); resolve(value); } catch (e) { reject(e); } }
      };
      const onAbort = () => finish(fail(waitStage, 'ABORTED', 'Asset operation cancelled', { cause: signal.reason }));
      const timer = clock.setTimeout(() => finish(timeoutError()), duration);
      signal?.addEventListener('abort', onAbort, { once: true });
      if (signal?.aborted) { onAbort(); return; }
      try { Promise.resolve(operation()).then(value => finish(null, value), error => finish(error)); } catch (error) { finish(error); }
    });
  };
  return { check, wait };
}

export async function fetchUint8Array(url, {
  signal, fetchImpl = globalThis.fetch, headerTimeoutMs = 15000, stallTimeoutMs = 15000,
  totalTimeoutMs = 90000, maxAttempts = 3, retryDelayMs = 400, maxBytes = 256 * 1024 * 1024,
  onProgress, onAttempt, clock = defaultClock,
} = {}) {
  positive(headerTimeoutMs, 'headerTimeoutMs'); positive(stallTimeoutMs, 'stallTimeoutMs'); positive(maxBytes, 'maxBytes');
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10) throw new TypeError('maxAttempts must be an integer from 1 to 10');
  if (!Number.isFinite(retryDelayMs) || retryDelayMs < 0) throw new TypeError('retryDelayMs must be finite and nonnegative');
  const limits = budget({ signal, timeoutMs: totalTimeoutMs, clock, stage: 'download' });
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    limits.check();
    const controller = new AbortController();
    let reader, response, stage = 'headers';
    report(onAttempt, { attempt, maxAttempts, url });
    try {
      response = await limits.wait(async () => {
        const result = await fetchImpl(url, { signal: controller.signal });
        response = result;
        if (controller.signal.aborted) { cancel(result.body, controller.signal.reason); throw controller.signal.reason; }
        return result;
      }, headerTimeoutMs, stage, 'HEADER_TIMEOUT');
      if (!response.ok) throw fail(stage, 'HTTP_ERROR', `Asset request failed: HTTP ${response.status}`, { status: response.status, retryable: [408, 429, 500, 502, 503, 504].includes(response.status) });
      stage = 'download';
      const total = Number(response.headers?.get('content-length')) || 0;
      if (total > maxBytes) throw fail(stage, 'SIZE_LIMIT', 'Asset exceeds download size limit');
      let bytes;
      if (response.body?.getReader) {
        reader = response.body.getReader();
        const chunks = [];
        let received = 0;
        report(onProgress, { received, total, attempt });
        while (true) {
          const { done, value } = await limits.wait(() => reader.read(), stallTimeoutMs, stage, 'STALL_TIMEOUT');
          if (done) break;
          if (!(value instanceof Uint8Array)) throw fail(stage, 'INVALID_CHUNK', 'Asset stream returned invalid bytes');
          received += value.byteLength;
          if (received > maxBytes) throw fail(stage, 'SIZE_LIMIT', 'Asset exceeds download size limit');
          chunks.push(value);
          report(onProgress, { received, total, attempt });
        }
        bytes = new Uint8Array(received);
        let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      } else {
        bytes = new Uint8Array(await limits.wait(() => response.arrayBuffer(), stallTimeoutMs, stage, 'STALL_TIMEOUT'));
        if (bytes.byteLength > maxBytes) throw fail(stage, 'SIZE_LIMIT', 'Asset exceeds download size limit');
        report(onProgress, { received: bytes.byteLength, total, attempt });
      }
      limits.check();
      return bytes;
    } catch (cause) {
      controller.abort(cause);
      cancel(reader || response?.body, cause);
      const error = cause instanceof AssetLoadError ? cause : fail(stage, 'NETWORK_ERROR', `Asset ${stage} failed`, { cause, retryable: true });
      error.attempt = attempt;
      if (!error.retryable || attempt === maxAttempts) throw error;
      if (retryDelayMs) {
        let delayTimer;
        try { await limits.wait(() => new Promise(resolve => { delayTimer = clock.setTimeout(resolve, retryDelayMs * attempt); }), totalTimeoutMs, 'retry', 'TOTAL_TIMEOUT'); }
        finally { clock.clearTimeout(delayTimer); }
      }
    } finally {
      try { reader?.releaseLock(); } catch { /* A cancelled pending read may still own the lock. */ }
    }
  }
}

/** workerUrl is the caller's built, same-origin module worker URL.
 * A copy is transferred so the caller retains compressed bytes for retries.
 * With no Worker support, native streaming gzip is used, never synchronous JS.
 */
export async function decodeGzip(bytes, {
  workerUrl, signal, timeoutMs = 45000, WorkerImpl = globalThis.Worker,
  DecompressionStreamImpl = globalThis.DecompressionStream, onDecodeStage, clock = defaultClock,
} = {}) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError('decodeGzip requires Uint8Array');
  const limits = budget({ signal, timeoutMs, clock, stage: 'decode' });
  limits.check();
  let worker, reader, outputStream, workerFailure;
  // A native fallback can ask the UI to paint its label before allocation. The
  // callback remains inside the same cancellation/deadline budget as decoding.
  const announce = mode => limits.wait(async () => {
    try { await onDecodeStage?.({ mode }); } catch { /* Presentation must not fail an asset. */ }
  }, timeoutMs, 'decode', 'DECODE_TIMEOUT');
  try {
    if (typeof WorkerImpl === 'function') {
      if (!workerUrl) throw fail('decode', 'WORKER_URL_REQUIRED', 'A built model decode worker URL is required');
      try {
        if (onDecodeStage) await announce('worker');
        worker = new WorkerImpl(workerUrl, { type: 'module', name: 'bearroom-model-decode' });
        return await limits.wait(() => new Promise((resolve, reject) => {
          worker.onmessage = ({ data }) => {
            if (data?.error) reject(fail('decode', 'INVALID_GZIP', data.error));
            else if (data?.bytes instanceof ArrayBuffer) resolve(new Uint8Array(data.bytes));
            else reject(fail('decode', 'INVALID_WORKER_RESULT', 'Model decoder returned invalid bytes'));
          };
          worker.onerror = event => { event.preventDefault?.(); reject(fail('decode', 'WORKER_ERROR', event.message || 'Model decode worker failed')); };
          worker.onmessageerror = () => reject(fail('decode', 'WORKER_MESSAGE_ERROR', 'Model decoder message could not be read'));
          const copy = new Uint8Array(bytes);
          worker.postMessage({ bytes: copy.buffer }, [copy.buffer]);
        }), timeoutMs, 'decode', 'DECODE_TIMEOUT');
      } catch (error) {
        if (['ABORTED', 'TOTAL_TIMEOUT', 'DECODE_TIMEOUT', 'INVALID_GZIP'].includes(error?.code)) throw error;
        workerFailure = error;
        limits.check();
      } finally {
        if (worker) { worker.onmessage = worker.onerror = worker.onmessageerror = null; worker.terminate(); worker = null; }
      }
    }
    if (typeof DecompressionStreamImpl !== 'function') throw fail('decode', 'DECODE_UNSUPPORTED', 'No usable worker or native gzip decompression is available', { cause: workerFailure });
    if (onDecodeStage) await announce('native');
    outputStream = new Blob([bytes]).stream().pipeThrough(new DecompressionStreamImpl('gzip'));
    reader = outputStream.getReader();
    const chunks = []; let length = 0;
    while (true) {
      const { done, value } = await limits.wait(() => reader.read(), timeoutMs, 'decode', 'DECODE_TIMEOUT');
      if (done) break;
      chunks.push(value); length += value.byteLength;
    }
    const result = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.byteLength; }
    limits.check();
    return result;
  } catch (cause) {
    cancel(reader || outputStream, cause);
    if (cause instanceof AssetLoadError) throw cause;
    throw fail('decode', worker ? 'WORKER_ERROR' : 'DECODE_ERROR', 'Model gzip decompression failed', { cause });
  } finally {
    if (worker) { worker.onmessage = worker.onerror = worker.onmessageerror = null; worker.terminate(); }
    try { reader?.releaseLock(); } catch { /* Pending cancellation. */ }
  }
}

/** Monotonic, repeatable measurements; finish() is idempotent per phase. */
export function createPhaseTimings({ now = () => performance.now(), onTiming } = {}) {
  const measurements = [];
  return {
    measurements,
    start(phase) {
      const startedAt = now(); let result;
      return () => {
        if (!result) {
          result = Object.freeze({ phase, startedAt, durationMs: Math.max(0, now() - startedAt) });
          measurements.push(result); report(onTiming, result);
        }
        return result;
      };
    },
  };
}
