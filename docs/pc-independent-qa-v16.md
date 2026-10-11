# Reference PC v16: independent QA

Result: CPU/model checks pass for the installed final model. No remaining tested geometry or navigation blocker. Actual WebGL rendering, browser glass sorting and mobile FPS remain unverified.

## Frozen identities

- Editable source and genuine GI source SHA256: `63ca5916d3982867c263a3d5ed0af7a2b22a3764635c9c6afa8d9825e43519d6`
- Decoded installed GLB SHA256: `f807437d38d9d30ddb9fff68ef8be6a526f3dafe7fd5b9a3ec750e7733f520ce`
- Compressed GLB SHA256: `96d96bff163b62e24a38f963e8440cf9918ff13d8baea318ce5d5245cd174a7b`
- All final reports and the two final independent images below refer to these identities. Candidate reports are not acceptance evidence.

## Verified

- 57 focused CPU tests pass: real reference-PC assets, light/clock controller, indoor navigation, first-person controls, stair traversal, collision, door, ceiling and exact fixed-view restoration.
- 12 additional actual-export checks pass. General model QA passes all 88 piano-key raycasts, the five fixed camera views, 23 furniture categories and 12 animated categories.
- All 344 non-PC nodes retain their exact v15 transforms, hierarchy, mesh attribute/index bytes, extras and material names. The shipped test contains an independently captured, stable-key-order baseline digest.
- Nine actual fan pivots use the correct exported local axes: GPU/rear Z, side X, roof Y. Moving mesh children carry `noShadowCaster=true`; four shared emissive materials are controlled. There are no added light objects or shadow maps.
- A separate anti-flapping regression derives the thin plane from each actual exported blade mesh, independently checks that it matches the configured axis, then samples 49 animation states over more than three complete turns. Every fan retains its world-space plane normal, center, blade axial depths and radial distances.
- Evaluated editable-source BVHs test every fan at 24 angular phases, 216 poses in total, against all other PC geometry. Zero moving blade/static intersections remain. This is sampled swept-volume evidence, not a formal continuous collision proof.
- Every foot is supported by the authored desk within 0.06 micrometres of source-coordinate precision. Export tests also raycast all lowest contact vertices to the desk. Case bounds are approximately 0.43 × 0.34 × 0.63 m. Monitor and desk lamp bounding volumes remain clear.
- Floor vent ribs and backing remain inside the actual diagonal chamfer. The earlier black comb was confirmed as protruding vent geometry, repaired by clipping it, and confirmed absent in the final image. Open roof ribs replace the earlier buried decorative slots.
- Portrait screen normal points to the visible +X/+Z corner. Runtime material is single-sided; UV top V=0 matches `flipY=false`. The screen is the first opaque raycast target from the actual fixed camera direction and a reachable standing viewpoint at eye height 1.6 m above the authored floor. Backface raycast is rejected.
- Source visibility rays omit only low-alpha glass and respect opaque chassis/hardware. Final fixed-view visible hose samples are 103/204 and 102/204; standing-view samples are 158/204 and 145/204. These are triangle-centroid sample counts, not projected image-area fractions. The white pump, lower motherboard armor and three GPU fans are visible; the roof naturally hides some upper components from the steep fixed view.
- An actual frozen-transform 20-second simulation leaves pivot centers, child local rotations and all vertex arrays unchanged. It performs 300 updates at the chosen fixed framing (15 Hz), stays under the 30 Hz cap and stops when the PC is hidden by the upper-floor view. The portrait canvas uploads once within the simulated minute. Its RGBA8 size is 562,944 bytes, with mipmaps disabled.
- The 8-second breathing and 18-second color interpolation have no hue jumps or zero-intensity flashes. Maximum tested normalized intensity slope is below 0.095 per second. Main-loop integration adds no separate frame loop, lights or per-frame geometry allocation.
- Final model uses 333 geometries; geometry typed-array view lengths total 29,963,376 bytes. Navigation allocates 28,728,874 collision-array bytes for 717,450 triangles. These exclude textures, temporary construction memory, JavaScript overhead, backing-buffer sharing and driver memory, and are not device-memory or FPS measurements.
- Exact buffer-view sharing reports unchanged resolved accessors/images and all other JSON. Gzip decoding matches the final GLB exactly. Installed GLB, editable source and GI identities were independently re-read after installation.

## Independent render review

`independent-fixed.png`: exact fixed isometric direction, tightly cropped for geometry inspection. Final pixels show the pink chamfered glass enclosure, portrait skyline, three side fans, rear/pump lighting, all three GPU fans, visible twin coolant loop, open roof grille, clean lower ports and seated feet.

`independent-standing.png`: reachable Blender camera [4.5, -0.8, 1.614], equivalent Three camera [4.5, 1.614, 0.8]. The image uses restored physical room walls and production source lighting. Hardware sightlines pass even though this full-wall Cycles image is darker than runtime's invariant cutaway-baked GI.

Both are offline Cycles evidence, not WebGL screenshots. They do not reproduce the runtime clock overlay, dynamic RGB state, room environment reflections, ACES tone mapping, glass-opacity override or finite-range light behavior. The walking-only runtime ceiling is absent in the editable source. Final browser glass sorting, desktop/touch interaction appearance and real mobile performance require supported-browser testing; no alternate browser or software-WebGL bypass was used.

## Reproducible artifacts

- `final-runtime-report.json`: 12 independent actual-model checks, identities, rotor/camera/material/collision diagnostics
- `final-focused-tests.txt`: 57 passing focused CPU tests
- `final-general-model-report.json`: complete fixed camera/furniture/piano model QA
- `final-navigation-budget.json`: final exported geometry and collision typed-array counts
- `blender-geometry-report.json`: final source 216-pose fan checks and authored desk support
- `visibility-report.json`: final source main-window sightlines and diagonal vent containment
- `independent-fixed.png` / `.json`, `independent-standing.png` / `.json`: reviewed image pixels and source/camera/lighting provenance
- `final-plane-invariance-tests.txt`: six passing independent asset tests, including the explicit geometry-derived anti-flapping check
- `baseline.json`: captured pre-v16 non-PC preservation fixture
- `check-runtime.mjs`, `check-blender.py`, `check-visibility.py`, `render-pc.py`: independent verification scripts
- Shipped regression suite: `bearroom-current-project/tests/pc-reference-independent.test.mjs`
