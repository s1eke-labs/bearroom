# Bearroom current runtime

This is the **current production-v11 runtime recovered into editable modules**, not the older `bearroom-project/src` implementation. The recovered baseline is Site commit `679d19306992b8a895dab5c47da0a8aad0f86e4d`, originally deployed as `index-BQLhr10c.js`.

The original source files and source maps for that revision were unavailable after workspace recovery. We preserved the deployed code and split its app layer at existing declaration boundaries. Minifier aliases remain in function bodies deliberately, avoiding risky rewrites. Public module exports have descriptive names for tests and future work. Vendor code is frozen from the deployment so dependency changes cannot silently change rendering or controls.

Current release: **v20.1 bounded dollhouse rotation**. Primary mouse drag or one-finger drag rotates the external view within 20–70° azimuth and 25–40° elevation; secondary/two-finger drag pans and wheel/pinch zooms inside the existing room bounds. Reset and floor presets return to the original default direction; leaving walking restores the exact prior external view. Full verification passes 258 CPU tests; the distribution is 19,801,946 bytes with 1,169,574 bytes of headroom. Nine offline Blender angle previews were reviewed; browser/device acceptance was not run. See `docs/bounded-orbit.md` for controls, regression coverage and remaining occlusion limits.

The v20 seated plush, case screen power, paired GI and all model assets remain unchanged (`docs/seated-bear-v20.md`). Previous startup and lossless texture optimizations remain in place (`docs/runtime-optimization.md`).

## Build and verify

Requires Node 20+ and npm.

```
npm ci
npm run verify
npm run preview
```

`verify` runs CPU tests, creates `dist`, and verifies all referenced artifacts and asset hashes. The built-in preview server uses port 5173, or `PORT=...`. No browser automation or software-WebGL bypass is used by this project.

Runtime assets are read from `public/assets`. The canonical compressed model is stored once as lossless binary parts in `source-assets/packed/`; `pretest` and `prebuild` restore it and verify each part plus the complete SHA-256. Textures and paired GI are tracked directly. `dist/` and restored binary copies are generated and never committed. `npm run restore:sources` additionally restores the editable v19 Blender master, its v17 authoring baseline, and the exact prior runtime required by the export pipeline. See `source-assets/README.md`. GitHub Actions verifies the complete project before deploying `dist` to EdgeOne; publication is triggered only by master.

## Source map

- `src/camera.js`: bounded external rotation, rotation-safe fit, room-constrained pan, 5 presets, cutaway. `Ox` → `IsometricRoom`, `Ix` → `configureControls`.
- `src/domain.js`: 88 MIDI keys, 23 furniture categories, 12 animated categories, tap and slideshow behavior.
- `src/audio.js`: Web Audio piano voices. `Hx` → `PianoAudio`.
- `src/lighting.js`: 10 lamps and blended day/night settings. The reviewed v13 patch changes four fixture colors and the night moon coefficient; all lamp powers/ranges, day lamp coefficients and shadow allocations remain recovered behavior.
- `src/performance.js`: bounded metrics, weighted cloth deformation, frozen transforms.
- `src/plush.js`: unchanged recovered default velvet shader and retained optional fiber detail. `Qx` → `PlushAppearance`.
- `src/plush-current.js`: narrowly scoped sewn-bear material refinement wrapper, preserving authored normal scale and maps. Reviewed v13 `fabric_bear_sewn_*` materials under either authored bear root use sheen 0.42, sheen roughness 0.96 and specular intensity 0.18; the authored short-nap material and normals are untouched. Tagged short nap follows floor cutaway, does not cast shadows and does not intercept raycasts.
- `src/baked-gi.js`: genuine indirect volume loading, strict bake-source match, regional selection, bathroom/slab visibility and indirect velvet sheen.
- `src/sky-transport.js`: optional separately baked, geometry-occluded world-only sky transport. Validated sky and analytic indirect radiance are added on the CPU into the existing 15,360-byte half-float volume; shader sampling and the single multiplication by pi are unchanged. Legacy files without sky remain supported.
- `src/main.js`: original scene startup, asset loading, gestures, audio, day/night UI and animation loop, with narrow reviewed active-camera and PC-detail hooks.
- `src/pc-case.js`: nine authored fan pivots, four shared pastel emissive zones, session-only case power, exact low-iron glass override and a separate minute-updated portrait local clock. Visibility/distance cadence stays in the existing frame loop; no new lights, shadow maps or postprocessing.
- `src/room-interactions.js`: frontmost scene-tap dispatch and isolated cosmetic computer-keycap motion, without text input, commands or piano changes.
- `src/first-switch-preparation.js`: bounded startup-only texture, clipping/shadow shader and real-draw preparation for the four existing floor/day-night topologies, with interruption-safe restoration and guarded readiness.
- `src/room-interactions.js`: shared external-view door/PC/keyboard click handling and visual keyboard feedback.
- `src/first-person.js`: separate perspective indoor walking camera, exact external-view snapshot restoration, independent keyboard/look/joystick input, safe interruption handling and bathroom-door UI.
- `src/walk-navigation.js`: world-space grounded capsule navigation using a once-built geometry BVH, stair support and a separate dynamic bathroom-door collider.
- `src/asset-revision.js`: explicit model-content SHA256 and separate GI bake-source SHA256.
- `vendor/runtime-v11.js`: preserved Three.js r180, OrbitControls, GLTFLoader, RoomEnvironment and fflate code. Licenses are copied into runtime assets.
- `recovery/`: original production bundle compressed for audit and provenance. `tests/recovery-fidelity.test.mjs` compares recovered algorithm ASTs against that exact baseline.

## Updating model and baked GI

Wait until geometry is frozen and real GI is rebaked from the corresponding scene. Then:

```
node scripts/update-assets.mjs --model /path/final.glb --gi /path/irradiance.json --source-sha FINAL_BLEND_SHA256 --source-blend /path/final.blend
npm run verify
```

`--source-blend` is optional if source bytes are not local, but recommended. The script verifies the provided hash when supplied. It never changes the bake's recorded source hash to manufacture a match. The model-content SHA is computed independently from the uncompressed GLB. A GI hash is a bake-source identity, not the GLB hash.

The pipeline stages both files, checks the schema and model contract, and only then installs them. All 88 keys, the 23 furniture roots, animation pivots, required picture surfaces, bathroom walls and velvet-body nodes must remain present. See `docs/model-contract.md` for names and assumptions.

For frozen realism asset identities, exact-image deduplication proof and final verification, see `docs/final-runtime-provenance.md`.

## Verification scope and limitations

The current CPU suite evaluates the actual recovered camera class against real model geometry, including every preset, portrait/landscape resizing, extreme panning, 8× normal zoom, 16× piano zoom, bounded rotation, default-direction reset and cutaway. It also covers velvet/fiber selection, GI loading/packing/shader hooks, exact asset hashes, tap thresholds, all 88 physically reachable piano raycast targets from the fixed view, single-sided screen-face visibility, slideshow transitions, real exported cloth deformation and bounded metrics. Frozen v12 records guard 153 protected world transforms, piano/art geometry, and all 13 slideshow asset hashes. Sky tests cover every packed face/channel, zero-sky equivalence, source identity, semantic separation and Float16 limits. Structural recovery checks cover every recovered app module plus vendor code.

These are not GPU rendering, acoustic, touch-device performance, occlusion or visual-realism acceptance tests. A separate supported-browser and rendered-scene review remains necessary for a new model. CPU test fixtures omit image loading in memory only, without altering shipped assets.

The fidelity tests intentionally reject changes relative to the v11 baseline except a finite list of exact reviewed v13 light substitutions, two sky validation/packing hooks, the explicit main-only indoor-walking hooks recorded in `recovery/first-person-hooks.json`, three exact PC initialization/update hooks in `recovery/pc-case-hooks.json`, the exact v18 startup/readiness and GI texture-access hooks in `recovery/first-switch-hooks.json`, the finite post-v19 startup/context/input hooks in `recovery/startup-optimization-hooks.json`, seated-bear provenance hooks, and the exact camera/input changes in `recovery/bounded-orbit-hooks.json`. The existing vendor PerspectiveCamera, Mesh and PlaneGeometry are newly exported without changing their implementations. Every other AST branch, all GPU shader text, and vendor code remain compared in full. An authorized change should be a narrowly documented hook or an explicitly reviewed test update; never remove broad recovery checks just to make a changed build pass. Do not re-run `scripts/recover-v11.mjs` after intentional source edits: it is an audit/recovery utility that overwrites recovered modules.

`npm run budget` enforces the static distribution limit of less than 20 MiB and at least 1 MiB of release headroom. Embedded image estimates are reported separately from the existing screen/slide images, with total RGBA8 and approximate full-mipmap estimates. These exclude geometry buffers, shadow maps, render targets and driver overhead, and do not establish actual device memory or FPS.

## Indoor walking

Choose **进入漫游** after loading. WASD / arrow keys walk, dragging looks around, Escape or **退出漫游** returns to the exact previous external view. On touch devices the lower-left stick moves while a different finger drags the scene to look. Movement stays on floors and stairs; no avatar, jump or free flight is added. Pitch is limited to ±80°, with no head bob and a short eye-height smoothing on stairs. Floor presets exit walking before selecting the requested view. Day/night and stationary piano taps continue working.

The bathroom door can be opened or closed by clicking its leaf or handle. While walking, E and the contextual button also work near the doorway. The authored hinge is reused and the swept leaf cannot cut through the player's capsule. Its current open/closed state persists across camera changes.

Walking temporarily restores the existing room walls/floor meshes and removes floor cutaway clipping. Because the cutaway asset has no roof, one roaming-only visual ceiling at the authored wall-top height (5.8 m) closes the sky. It is outside the model root, reuses the existing plaster/GI material, does not cast new shadows, and is hidden on exit and disposed with its controller. No exterior city is added. Direct-light shadows refresh for the restored walls. The walking controller does not alter the model, textures or GI. The v16 GI is baked for the cutaway scene, so it remains an approximation for the enclosed walking view rather than a new enclosed-room bake.

Collision geometry is prepared once while the existing loading overlay is visible; entering walking never rebuilds it. Keyboard, touch, tab-hide, blur and pointer-cancel flows have CPU/event-target regression coverage. Real mobile layout, GPU rendering, browser audio and device performance still require supported-browser acceptance.

## Scene clicks

Click or tap the bathroom door to open/close it, the PC case to stop/resume all nine fans and its four RGB zones, or an individual computer keycap for a short down/up animation. The case screen goes black and its clock stops while powered off; power-on immediately redraws the current time. The separate monitor slideshow continues unchanged. The computer keyboard has cosmetic feedback only; it never types, runs commands, plays piano notes or changes navigation. Case power stays in session memory without added storage.

Only completed stationary taps activate these targets. Drags, walking/look gestures, multitouch, cancelled pointers, UI overlays and help dialogs do not. See `docs/room-interactions-v19.md` for the exact geometry, input, collision, recovery-hook and test scope.

## Early candidate and collision budgets

`node scripts/inspect-candidate-budget.mjs MODEL.glb.gz REPORT.json [MATCHED-GI.json]` projects candidate distribution size without installing it. Until a GI file is provided, it explicitly uses the existing GI file size only as a placeholder. The final build and paired-asset contract still determine release acceptance.

`node scripts/navigation-budget.mjs MODEL.glb.gz REPORT.json` reports actual exported geometry typed-array view lengths and the navigation collision-array allocation. Those counts exclude textures, JavaScript overhead, peak build memory and driver costs; they are not device memory or FPS measurements.

## Reference PC details

See `docs/pc-case-runtime-v16.md` for animation/display behavior, true clock semantics, scoped glass settings, update cadence and verification limits. The generated case skyline is separate from all 13 unchanged monitor/TV/frame images. Static GI does not simulate changing colored bounce from the emissive RGB animation.

## First-switch preparation

Before the room becomes interactive, v18 progressively prepares the original four floor/day-night shader combinations, texture uploads, geometry and existing shadow targets. It keeps the original night shadow cost and all visuals/assets intact. The loading indicator includes this preparation, so startup may take several additional seconds; a single driver compile/upload cannot be preempted. Full device/GPU performance and visual acceptance remain unverified. See `docs/first-switch-preparation-v18.md` for source evidence, bounded work, cancellation and the precise verification scope.
