# First-switch preparation v18

Runtime-only change for the reported first floor/day-night switch stutter. The frozen v17 model, images, six corrected normal-texture interpretations, genuine paired GI, lights, camera/controllers and animation algorithms are unchanged.

## Source-established causes

1. `camera.applyCutaway()` changes material local clipping from zero planes in overview to one plane in floor/detail views. Three.js r180 includes `numClippingPlanes` in the program cache key. Plane direction/constant are uniforms, so lower and upper do not need distinct shader topologies.
2. The existing frame loop disables sun shadow casting at zero sun intensity and enables it when daylight becomes positive. This changes the directional-shadow program key. The first sun shadow render also creates its 2048×2048 render target.
3. Startup previously marked the room loaded without preparing those paths. Asset decoding is not GPU texture/geometry upload. Invisible walls/ceiling, later slideshow images and the packed GI volume can otherwise first reach the GPU during use.
4. GI itself is already one packed 15,360-byte 3D texture containing both endpoints. Day/night blends a uniform; this change does not download, fake or rebake GI.

These are source-proven cold paths, not a device profiler's attribution. A separate CPU-only reviewer found ordinary camera switching around 1 ms median in this cloud environment; that is not phone performance evidence.

## Scoped implementation

`src/first-switch-preparation.js` runs once before interaction is enabled. It prepares the four original combinations of zero/one clipping plane and sun shadows off/on, preserving the original night shadow toggle and its steady-state GPU cost. A permanent night sun shadow would still be sampled by the pinned shader despite zero sun intensity, so that alternative was deliberately avoided.

- Material textures, all slideshow frames, the PC canvas and the genuine GI volume are deduplicated and uploaded. Each upload slice stops after two textures or 4 ms observed CPU work, whichever comes first.
- Geometry preparation uses at most eight meshes and approximately 2 MiB of geometry typed-array views per batch. An individual geometry/driver operation cannot be split or preempted. Today's 342 runtime meshes, including the roaming ceiling, produce 44 batches per topology.
- Shallow renderable copies share original geometry/material identities and world matrices. They are temporarily visible and uncullable only in the preparation scene. The original scene hierarchy, visibility, camera and transforms are never changed by preparation.
- Actual light objects and shadow maps are borrowed without reparenting. Their original powers, positions, resolutions and shadow algorithms remain intact.
- The default framebuffer uses a one-pixel viewport/scissor under the loading overlay. The canvas size and camera projection are unchanged. An ordinary offscreen target would produce different color-space/tone-mapping program keys, so it is not used.
- A tiny disposable basic-material draw seeds the renderer's clipping state for each topology. The frozen renderer's `compile()`/`compileAsync()` do not initialize local clipping by themselves.
- Compilation traverses only the current batch. The full-scene compile path would traverse invisible meshes too. Where parallel compilation is available, every cached program for each batch material is polled, including non-current programs for shared geometry layouts and transparent sides. This follows the pinned renderer's readiness protocol with cancellable frame yields and a 15-second visible-active wait deadline, rather than an uncancellable timer.
- A real draw of each batch prepares the depth-shadow programs, geometry buffers/VAOs and render targets that material compilation alone does not cover.
- Already-ready programs may compile and draw in the same slice when measured CPU compilation stays below 4 ms. Each drawn batch yields after a browser paint. Pending programs and slow compile slices yield before drawing too.

This is progressive preparation of actual resources, not a delayed cover over an unchanged interactive freeze. It does add startup work: the minimum scheduling cost for 176 draw batches, four seeds and texture slices is several seconds at 60 Hz, potentially more on slower devices or without parallel shader compilation. No duration is promised. The loading message explicitly says it is preparing materials and floor/day-night lighting. The 4 ms slice target is a scheduling heuristic, not a hard GPU/frame-time guarantee.

## Readiness and interruption

Normal drawing, animation and scene controls remain locked while loading/preparation is incomplete. Day/night, floor, zoom/reset, keyboard and pointer paths have explicit readiness guards, and OrbitControls are disabled. Resize cannot overwrite the temporary viewport; the final frame refits to the latest dimensions. The walking collision structure and ceiling are created before preparation.

Material clipping-array references, clip-shadow flags, sides, light shadow flags, render target and viewport/scissor state are restored in `finally`, including failure paths. Preparation never runs in the interactive frame loop. Its temporary seed resources are disposed.

Batch shadows contain only part of the room. After restoration, the original full frame loop refreshes the complete visible scene/shadows before controls are unlocked and the loading overlay disappears. A hidden tab cannot count as that final rendered frame. Paint-yield completion rechecks visibility after its RAF/timer gap, and shader deadlines exclude hidden-tab suspension.

Context loss or a preparation failure rejects readiness and retains the existing refresh/retry UI. A context loss after a successfully loaded session continues using the existing browser restoration behavior; this revision does not claim to prewarm a newly restored GPU context automatically.

## Preservation and verification

- Frozen vendor algorithms, camera, lighting, performance/cloth, plush, walking/navigation and PC controller files remain unchanged. The existing `It.castShadow = It.intensity > 0` and shadow cadence are unchanged.
- GI adds only a read-only frozen texture-reference list for preparation. Radiance bytes, shader source, validation, sampling and day/night calculations remain unchanged.
- All new integration deviations are finite, exact substitutions in `recovery/first-switch-hooks.json`. Full recovered AST comparisons still run. Two existing walking-entry source assertions now additionally require the exact readiness guard before the original `walk.exit()` call.
- Dedicated CPU/mocked-renderer regressions cover four topology combinations, bounded submissions, all-program readiness, texture deduplication, state restoration, failures, cancellation, hidden-tab timing and startup integration. Independent VM tests execute the actual final-readiness functions rather than relying only on source regexes.
- Full verification and distribution checks: `docs/verification-first-switch-v18.txt`. Independent review: `docs/first-switch-independent-v18.md`.

No supported actual WebGL/browser rendering or phone performance measurement was available. A prior browser policy denial and unavailable cloud WebGL were respected; no graphics/security bypass was used. Passing CPU/source tests establishes control/resource-planning correctness, not visual equivalence, measured FPS, GPU memory or a proven millisecond improvement. User-device acceptance should compare a fresh reload's first floor/day switch with subsequent switches, include both directions and rapid repeated inputs, and check hidden-tab/resizing interruptions.
