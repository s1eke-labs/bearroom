# Bounded external view (v20.1)

## Controls and limits

- Left mouse / one finger: rotate. Azimuth is 20–70° (default 45°, ±25°); elevation is 25–40° (default 35.264°). The view always looks down through the open corner.
- Right mouse / two-finger drag: pan. Middle drag, wheel or pinch: zoom. Existing arrow keys pan and +/− zoom remain available.
- Reset, Home/0 and floor/preset changes restore the original default angle, fitted zoom and center. Resize preserves the selected angle, zoom and bounded pan. Walking entry/exit preserves the exact external pose; walking movement is unchanged.
- Room hull bounds still constrain pan and zoom. Target depth is anchored to the selected room region, preventing drift after repeated orbit/pan cycles. Fit conservatively encloses the room throughout the allowed rotation range without changing the frustum during a drag.
- Only completed stationary taps activate objects. Accepted taps restore the complete pre-gesture camera pose and discard residual orbit motion. Multitouch, drag, cancellation, blur, hidden page and unexpected lost capture cannot become clicks. Normal two-finger release safely hands control to the remaining finger.

## Evidence

Clean `npm ci` and `npm run verify`: 258 tests passed, zero failures/skips. Tests execute the pinned real OrbitControls with CPU event fixtures and the real model geometry: angle extremes, repeated orbit/pan, reset, all floor presets, tiny/portrait/landscape resize, 88 piano targets, walking round trips, pointer ownership/handoff, click versus drag, cancellation and context interruption. Exact recovery AST checks remain enabled through `recovery/bounded-orbit-hooks.json`; vendor code and shader text are unchanged.

Distribution: 19,801,946 bytes; remaining headroom below the 20 MiB limit: 1,169,574 bytes (2,434 bytes larger than v20). All model, texture, source Blender and GI bytes remain unchanged.

Offline review helpers are in `source-assets/orbit-review/`. Fifteen camera fixtures checked conservative visible-bounds depth 27.919–42.081 m inside the 0.1–100 m clipping range. Nine CPU Cycles previews cover the default, all four overview extremes, and lower/upper floor extremes. Camera height stays at least 16.042 m. No reviewed default-zoom frame exposes the back/bottom or clips the room outside the image. A proposed 50° elevation was rejected after previews showed excessive upper-floor occlusion; 40° was selected.

Whole-room views still have inherent upper-floor occlusion, especially near 70° azimuth / 40° elevation. Use the lower-floor preset for unobstructed lower-floor inspection. Offline neutral-light previews are not production WebGL, GI/shadow, mobile interaction or frame-rate acceptance. No device/browser performance improvement is claimed.
