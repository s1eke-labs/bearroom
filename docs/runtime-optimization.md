# Post-v19 startup and reliability optimization

## Verified outcome

218 CPU tests pass without skips. The full distribution is 19,870,238 bytes, compared with 20,957,846 before this update: 1,087,608 bytes saved and 1,101,282 bytes of remaining 20 MiB budget. CI additionally requires at least 1 MiB headroom. Embedded PNG re-encoding alone saves 1,103,482 model-gzip bytes. Exact unfiltered pixels, dimensions, bit depth, color type, color-profile/other non-IDAT chunks and all nonimage model data remain protected. Bear textures, organic normals, geometry, GI and authoring masters retain their quality. See `lossless-asset-budget.md`.

## Loading and recovery

The model, paired GI and external screen textures begin loading concurrently. Gzip decoding uses a same-origin hashed module worker with isolated, pinned fflate 0.8.3 (4,434-byte worker), transferring a copy so fallback remains possible. If a worker cannot start, native asynchronous DecompressionStream is used; there is no synchronous main-thread JavaScript gunzip fallback. Real old/current asset bytes are compared with both the frozen decoder and Node zlib in automated tests.

Downloads have 15-second header/stall deadlines, bounded total wall-clock budgets (model 180 seconds), byte caps and at most three attempts for transient network/408/429/500/502/503/504 failures. Decode and resource parsing have bounded waits. Hidden-page time still counts; throttled timers are checked after awaited work returns. Cancellation aborts pending readers, worker, peers and preparation. Corrupt decode errors are not retried as compatibility failures. Repeated retry activation is single-flight. A labelled status region, keyboard-focusable retry/cancel controls and visible stage-specific errors replace a stuck loading screen. No download resumes automatically after pagehide cancellation.

Attempt-owned scene geometry, material, texture, bitmap, object URL and dynamic controller resources are cleaned on failure. Late parser/texture completion is disposed. Ready resources detach from the startup abort owner, so context loss does not destroy the live scene. Stale recovery callbacks cannot revoke a newer ready state. GI application failures retain their own phase label.

Context loss suspends walking and clears all input; readiness stays locked until complete preparation and a successful full frame after restoration. Held-key auto-repeat cannot silently resume movement. Lifting the primary look pointer safely transfers to the remaining scene finger at its most recent coordinates, retaining multitouch tap suppression.

## Preparation and evidence

All four floor/day-night topology seeds and all 188 batch draws remain. Up to four cheap ready batches share a scheduling slice within a conservative 4 ms observed-CPU budget. Expensive work, unready compilation or page hiding yields; it does not remove first-switch protection or make individual driver work preemptible. Actual scene: 365 model meshes plus ceiling; 47 batches per topology. Deterministic cheap-work tests reduce frame waits from 193 to 53; simulated expensive work keeps 193. These are scheduling simulations, not real GPU timing or FPS improvements.

For a read-only diagnostic snapshot, open the app with `?diagnostics=1` and inspect `window.bearroomDiagnostics.startup()`. This reports phase durations, readiness/graphics availability and preparation counters, including frame yields, compile/draw/texture CPU times, maximum slice duration and active elapsed time. No telemetry is sent. Concurrent phase durations overlap and must not be added as total elapsed time; CPU submission time is not GPU completion time.

## Acceptance boundary

Automated verification covers real assets, exact decoding, mocked network timeouts/stalls/503/abort, cleanup, stale recovery, pointer events, startup ordering and build contracts. Real WebGL rendering, touch-device interaction, phone memory and FPS testing were explicitly excluded from this update. No browser acceptance or visual/FPS improvement is claimed.
