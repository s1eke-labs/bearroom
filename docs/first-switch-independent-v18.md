# Independent first-switch preparation review

This is the historical v18 review. Its mesh/batch counts are not current: the v19 scene has 365 model meshes plus the roaming ceiling, 47 batches per topology and 188 batch draws across four topologies. Current adaptive scheduling and deterministic evidence are documented in `first-switch-preparation-v18.md` and `runtime-optimization.md`.

## Result and limits

The reviewed patch covers the identified cold-resource paths without changing the v17 scene assets, existing material/GI shader behavior, camera controls, light powers, shadow resolution, or steady-state sun-shadow toggle. Independent CPU lifecycle tests pass. This supports source-level acceptance, subject to the final aggregate build/asset/budget checks.

No supported WebGL execution was available. This review does not establish measured frame rate, GPU memory, real-browser visual equivalence, mobile behavior, or a measured reduction in the first-switch stall. No browser or graphics restriction was bypassed.

## Source findings

- Floor cutaway changes the material clipping-plane count between zero and one; the pinned renderer includes that count in its program key. Upper/lower plane direction is a uniform, so both use the one-plane topology.
- The existing night/day transition changes the sun's `castShadow`, which changes the directional-shadow count in the program key. First daytime use also allocates the 2048 × 2048 sun shadow map. Both original sun-shadow states are prepared; nighttime GPU work is not increased by forcing an always-on sun-shadow topology.
- The genuine day/night GI is already packed in one 5 × 2 × 192 half-float volume. Switching GI is a uniform change. The new accessor exposes the same texture for preparation and does not alter radiance packing or shader injection.
- The pinned renderer's compilation helper does not initialize local clipping, upload geometry/textures, or draw shadow-depth passes. The patch performs a real seed draw, bounded compilation, and real draws using the default framebuffer's color/tone-mapping pipeline.
- Shallow mesh copies share the original geometry and materials. Actual v17 meshes have no custom before/after render or shadow callbacks; their material-level GI and other shader hooks remain shared. Original mesh hierarchy, matrices, visibility and camera state are not repurposed for the temporary rendering stage.
- Four combinations cover zero/one clipping plane and sun-shadow off/on. All mesh/material layouts participate, rather than deduplicating only by material identity. All cached programs of each compiled material are polled; previously ready programs remain ready in this pinned renderer.
- Real shadow draws use the existing sun and spotlight maps. Intermediate maps contain partial batches. On the normal visible completion path, the original frame loop consumes the forced dirty flag, refreshes complete active spotlight shadows, and renders the restored whole scene before controls are unlocked. The sun remains off for the initial night frame; its first active daytime update draws its complete map through the unchanged runtime cadence.

## Independent lifecycle checks

`tests/first-switch-independent.test.mjs` extracts and executes the actual main readiness and frame functions with CPU-only dependencies. Its four tests cover:

1. A final frame hidden by a tab transition retries without unlocking. The first successful render uses the original complete scene/camera, updates complete active shadow maps, and uses the latest window dimensions.
2. While loading, the ordinary frame loop cannot mutate lights, animation, camera controls or rendering-stage state.
3. A lost context cannot unlock controls after the attempted final frame.
4. An abort during that frame cannot unlock controls.

The hidden-final-frame race was found during review and corrected. The preparation scheduler now rechecks visibility after the RAF/timer handoff. Shader waiting excludes hidden-tab wall time.

The combined preparation and independent focused suites pass 19 tests. Module tests additionally cover four-topology coverage, hidden meshes, shared material layouts, texture deduplication, bounded submission, program readiness, exceptions, abort, context loss, renderer/material restoration, and hidden-tab timing. These simulated checks do not replace actual GPU execution.

## CPU observation and startup tradeoff

A separate CPU-only cloud Node run on the actual 341-mesh model measured the first lower cutaway/fit at 2.65 ms and the first upper cutaway/fit at 1.29 ms. Across 25 switches, median was 0.99 ms and maximum was 3.55 ms. This excludes GPU work, image decoding, browser scheduling and actual OrbitControls; it supports focusing on cold renderer work rather than claiming device speed.

The model plus existing walking ceiling contains 342 meshes. Current 8-mesh/2-MiB grouping produces 44 batches and 176 batch draws across four variants. After the review refinement that combines already-ready compile/draw work, shader preparation still requires at least 180 RAF yields, approximately 3 seconds at 60 Hz, plus texture slices, final readiness, shader waiting and actual work. This is a scheduling lower bound, not measured loading time. An individual driver compilation/upload cannot be preempted by the batch limit.

The fix intentionally moves first-use preparation into the loading screen and therefore lengthens startup. GPU memory allocation and shader caching also occur earlier. No geometry, texture quality, GI fidelity, shadow resolution or steady-state effects are reduced.

## Preservation evidence

An independent before/after SHA-256 snapshot confirms all 16 files under `public/assets`, the pinned vendor renderer, and the camera, first-person, navigation, lighting and PC controller files are unchanged (22 protected files total). Existing exact recovery-AST comparisons remain the appropriate check for the narrow main/GI integration hooks.

Protected model gzip SHA-256: `a0253d9d4afac2d49a9f94bb74811585847f0dd14daaf2c50f8cf12b926e404f`

Protected GI JSON SHA-256: `107ef50f0ec636d401df4631133ea0061ef14944ab2c325c16b39ea072962971`
