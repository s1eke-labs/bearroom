# Reference PC runtime v16

The case is one animated furniture category, preserving the existing 23 furniture / 12 animated-category denominator. The two old `anim_pc_fan_01/02` controls remain unchanged empty compatibility anchors. Nine separate `pc16_rotor_*` controls rotate actual blades/hubs using their authored `pcSpinAxis` and `pcSpinSpeed` extras. Mesh descendants are never registered as extra rotors.

## Display and material behavior

The new `screen_PC_case_v16` is independent of the original monitor and its six-image slideshow. A newly generated portrait pastel skyline is downloaded once as `assets/textures/pc-case-v16.webp` (29,838 bytes). A 192 × 733 canvas adds actual local HH:MM time and local date only. The technical overlay is not a hardware monitor and invents no temperature/load statistics. It uploads once initially and when the displayed minute changes; the clock is checked at most once per visible second. No mipmap chain is generated for this small canvas.

The texture has a new independent Source, correct glTF `flipY=false`, and a front-sided, non-tonemapped basic screen material. Neither the wallpaper input nor any of the 13 pre-existing monitor/TV/frame images changes.

Four shared emissive materials drive side/top/rear/trim RGB. A continuous 8-second breathing curve and 18-second palette wave blend pastel pink, lilac and icy white. Emission is positive and bounded, with no black-to-bright flashing or strobing. These materials are removed only from the generic day/night emissive list so two loops cannot fight over their intensity. The new controller adds no realtime light or shadow map. Animated colored bounce is not claimed; genuine static GI captures the new physical case reflectance/occlusion under the same room sources.

Only `pc16_glass_low_iron` restores its authored alpha .075 and roughness .08 after the legacy generic glass preset. It is transparent, depth-write disabled and single-pass to avoid drawing both sides of each flat pane. Other glass materials retain recovered behavior.

## Cost and throttling

The controller adds no meshes, per-frame geometry allocation, independent animation loop or postprocessing. Its main-loop hook uses the currently active fixed or walking camera. It skips hidden/cutaway/off-screen cases and cases below 3 projected pixels; distant perspective views over 18 metres are skipped. Visible updates use 30, 15 or 8 Hz according to projected size/distance. Fans use finite modulo-one-turn angles and preserved authored axes. Static geometry and buffers are never rewritten by this controller.

The generated clock texture is 562,944 RGBA8 bytes without mipmaps. This estimate is explicitly included in `resource-budget.json`; it is not measured GPU memory. Asset primitive counts do not constitute a draw-call trace. Existing animation categories, piano, controls, navigation, room lamp settings, shaders and shadow allocations remain protected.

## Verification boundaries

The narrow main hooks are recorded in `recovery/pc-case-hooks.json` and applied only after the pre-existing first-person hook list in the full recovery AST comparison. No broad branch exclusion was added. Focused controller tests cover smooth finite colors, bounded fan rotations, unique pivots/shared materials, independent screen source/orientation, minute uploads, visibility/cadence, unchanged geometry and idempotent cleanup. Independent actual-export tests cover preserved non-PC attributes, geometry contracts, actual front-face raycasts, support and frozen-transform animation.

Offline Cycles renders and CPU tests are separate from browser WebGL appearance. No supported browser WebGL session was available for this release, and no bypass was used. No phone FPS, acoustic behavior or measured GPU allocation is claimed.
