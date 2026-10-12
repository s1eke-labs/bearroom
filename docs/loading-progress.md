# Truthful granular loading status (v20.4)

## What changed

The previous “载入空间与画作” label remained active while the model download occupied its 5–65% interval. The following “整理家具与光线” label covered GLTF parsing, scene construction, external-image wait, screen binding, PC setup, GI and synchronous walking-collision construction. These were presentation and timing-attribution gaps; this release does not claim a faster network, parser, GPU or phone.

The internal stages still follow these real operations (the visible labels are shortened):

1. 下载空间模型
2. 解压空间模型
3. 解析家具模型
4. 整理家具与场景
5. 载入画作与屏幕图像
6. 设置画作与屏幕
7. 准备机箱
8. 载入间接光数据
9. 应用间接光
10. 准备漫游路径
11. 上传材质与纹理
12. 准备楼层与昼夜光照
13. 绘制首帧, then 一切就绪 only after readiness validation

The loading page preserves the original ʕ•ᴥ•ʔ logo and its breathing animation, with one short current-stage sentence and the work bar. Labels are 下载房间、展开房间、整理家具、布置房间、载入画作、布置画作、准备机箱、载入光照、布置光照、准备漫游、准备材质、准备光照、呈现房间. Errors reveal their reason and a retry button. No detail toggle, numeric diagnostics, background-task line or step list is shown.

Real bytes, attempts, decoded image counts, uploads and warm-up batches remain in the internal snapshots and diagnostics. Unknown work remains semantically indeterminate; completion is still tied to real events, never a timer.

## Progress semantics and lifecycle

The bar represents equally weighted completed work checkpoints, not elapsed or remaining time. Retained image/upload/batch counts can contribute part of their checkpoint; disposable partial download bytes never do. A separate readiness checkpoint keeps the bar below 100 until the first complete validated frame and controls are ready. A normal load has thirteen work checkpoints plus readiness; context restoration has upload/warm/frame plus readiness. There is no timer-driven progress, artificial delay or invented ETA.

Model, GI and all fourteen external images still start concurrently. Each load captures its own controller, task map, progress generation and timing collector. Old attempts and late callbacks cannot repaint a replacement generation, declare readiness, overwrite its error or mix timing records. Automatic network retries reset their own byte count; the overall retained-work meter does not fall backward. Cancellation, failure, context interruption and duplicate Retry clicks preserve the existing resource/timeout guards.

The sole screen-reader live region announces only the short current stage at most once per second; final success/failure/cancellation is announced immediately, including actionable error details. Numeric/background diagnostics are not announced. The live region is outside the loading overlay so hiding the overlay cannot suppress the ready announcement. Unknown steps omit aria-valuenow. Reduced-motion preferences disable the activity pulse and progress-width animation.

Only parse, scene construction and walking-collision preparation add a paint boundary before potentially synchronous CPU work. Ordinary worker loading therefore adds three boundaries, not one delay per label. Native decompression fallback may add one more, bounded by its original cancellation/deadline budget. Existing GPU preparation and first-frame paint boundaries are reused unchanged. A boundary can make the current label visible; it does not split a long parser/BVH/driver call into smaller tasks.

## Timing evidence and diagnostics

At the unchanged model revision `1dd9a211538747e3`, verified startup asset file sizes are:

- Model gzip: 17,538,872 bytes; decoded GLB: 34,733,200 bytes.
- GI: 104,856 bytes.
- Fourteen external WebPs: 1,439,998 bytes (six PC, four TV, three frames and the case wallpaper).
- These compressed startup assets total 19,083,726 bytes, of which the model is 91.90%. This excludes JavaScript and is not a measured network transfer total.

A seven-run cloud Node v24.19.0/Linux x64 CPU-only audit found median fflate decoding 179.9 ms, image-reference-stripped GLTF parsing 56.1 ms, room construction 19.9 ms and WalkNavigation construction 346.4 ms (338.2–463.0 ms). It was neither a cold process nor a browser benchmark. It omitted image decoding, network, GPU upload/compilation, device layout and phone behavior. The in-memory stripped copy was used only for measurement; on-disk assets were unchanged. These observations justify identifying the work, not promising those times on a user device.

Startup diagnostics now retain distinct scene/screens/walk phases, concurrent download/textures/GI durations, residual textures-wait/gi-wait and one startup-total wall-clock measurement. Work-phase timing begins after its paint boundary; total includes all waits. Recovery has a separate recovery-total and collector. Parallel durations overlap and must never be added to estimate overall load time. Existing diagnostics remain available through the diagnostics query option.

Exact main-module changes are recorded in `recovery/loading-progress-hooks.json`. Assets, materials, model, GI, camera presets, renderer scheduling and vendor code remain protected. No browser/WebGL/mobile performance acceptance was performed.

## Release verification

The original detailed-status release passed 333 tests and the 1 MiB reserve requirement. The minimal presentation retains those loading lifecycle guards and adds visible-content regression coverage. Regression coverage includes real/unknown totals, parallel completion, bounded announcements, retries and stale callbacks, cancellation/timeout, duplicate retry clicks, context-loss restoration and readiness-only completion. Asset contracts and recovery fidelity also pass.

Minimal UI release verification: `npm run verify` passes 339 tests with zero failures/skips. With the original logo restored: distribution 19,818,455 bytes; headroom 1,153,065 bytes, still above the required 1 MiB reserve. No browser/device visual acceptance was performed.
