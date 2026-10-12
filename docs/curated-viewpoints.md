# Curated external viewpoints (v20.2, historical)

Superseded by the requested true axial 正左/正右 views in v20.3. See `axial-viewpoints.md`; the 35°/55° oblique angles below are historical and are no longer the current presets.

## Composition and controls

Three named viewpoints replace v20.1 free pointer rotation:

- 经典: 45° azimuth, 35.2643897° elevation, the original equal-axis isometric direction.
- 偏左: 35° azimuth, 35° elevation, a more frontal piano/desk composition.
- 偏右: 55° azimuth, 35° elevation, a different staircase/left-room composition.

Primary mouse and one-finger drags now pan without changing angle. Secondary/two-finger drags also pan; wheel, middle drag and pinch zoom. Existing arrows, +/−, Home/0 and floor controls remain. Pan/zoom stay bounded near the current room region.

A preset changes the real orthographic camera pose over 420 ms with smoothstep easing, never a CSS transform. The current zoom and world-space pan focus are preserved rather than refitting on each choice; one conservative frustum contains every preset. Rapid choices retarget the last visible frame without advancing the previous timeline. The selected button indicates the target while its group is busy; interruption between presets clears the selected state instead of claiming an endpoint was reached.

Pointer drag/tap, wheel, keyboard navigation, help, resize, hidden page, blur, pagehide, context loss and walking entry stop the transition at the visible frame. Floor selection/reset restores the classic composition. Walking exit restores its exact saved external pose and preset state. Reduced-motion preferences select the endpoint immediately; enabling the preference during a transition finishes it without residual animation. Camera control subscriptions are detached during room cleanup so retries cannot retain obsolete rooms.

The three native buttons support keyboard focus/activation and a non-color-only selected indicator. Mobile widths up to 600 px use two explicit toolbar rows with at least 44 px button targets; camera top padding reserves their space. Source arithmetic and projection fixtures cover 320 px and portrait/landscape layouts; browser layout acceptance remains unperformed.

## Evidence and limitations

Clean `npm ci` and final `npm run verify`: 293 tests passed, zero failures/skips. The production distribution is 19,807,981 bytes with 1,163,539 bytes of headroom below 20 MiB, retaining the required 1 MiB reserve. This is 6,035 bytes larger than v20.1. Tests include actual pinned OrbitControls events, repeated/aborted transitions, all floor presets, resize, reduced motion, walking round trips, retry listener cleanup, asset contracts and all 88 piano targets.

The source was rendered offline at 35°, 38°, 45°, 52° and 55° azimuth. The chosen side views have projected equal-length floor-axis ratio at most 1.1906:1, versus approximately 1.8:1 at the former most oblique low-elevation extremes. This measures camera foreshortening, not model deformation or CSS scaling. All model, material, texture, Blender master and GI bytes are unchanged.

Current helpers and reproducible review commands: `source-assets/preset-review/README.md`. Eighteen endpoint fixtures cover all three viewpoints on overview/lower/upper at 1440 × 900 and 390 × 844, with exact runtime camera pose/frustum, asset hashes and cutaway visibility. Offline previews use neutral lights and CPU Cycles; they do not validate production WebGL appearance, GI/shadows, device interaction, animation frame rate or FPS improvement.

The upper slab still naturally hides some lower-floor contents in overview. Use 一层 to inspect them. Bathroom walls likewise remain real occluders; presets do not alter architecture to remove occlusion.

Exact reviewed source changes are recorded in `recovery/curated-preset-hooks.json`, applied after the historical bounded-orbit hooks. Full AST comparisons, frozen vendor code, asset contracts and protected geometry remain enforced.
