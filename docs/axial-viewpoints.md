# Classic and true axial viewpoints (v20.3)

## Exact camera directions

The UI is **经典 / 正左 / 正右**. This corrects the previous 35°/55° oblique presets rather than renaming them.

- 经典: azimuth 45°, elevation 35.2643897°, the original equal-axis isometric direction.
- 正左: azimuth 0°, from +Z toward −Z. The horizontal X room axis projects exactly horizontally; Z depth projects vertically on screen.
- 正右: azimuth 90°, from +X toward −X. The horizontal Z room axis projects exactly horizontally; X depth projects vertically on screen.

All three have the same downward elevation, keeping the interior visible. They are axis-aligned in plan, not zero-elevation architectural elevations. In classic, the screen-right basis is `(1, 0, -1) / sqrt(2)`: the south +Z opening is the image's left side, and the east +X opening is its right side. This establishes the labels from room geometry rather than guessing from a small yaw offset. Floor unit axes meet at right angles in the two side views; camera foreshortening is expected and is not CSS or model scaling.

The whole 0–90° interval is available to the transition; no previous 35–55° or 20–70° clamp remains. Pointer rotation stays disabled. Dragging pans, wheel/pinch zooms, and walking remains separate.

## Framing and transition

Each direction fits its own actual visible mesh projections, with a consistent orthographic aspect ratio and UI padding. The camera frustum adapts continuously during the 420 ms smoothstep transition while preserving the user's zoom multiplier and bounded pan focus. The diagonal midpoint can be wider than either axial endpoint, so fitting is evaluated along the actual angle rather than merely interpolating endpoint sizes. Close-up bear/piano views retain subject-specific bounds.

Rapid retargets start from the last visible pose and projection. Input, resize, floor/reset, walking, hidden/blur and context interruption retain the existing safe cancellation behavior; reduced motion selects the endpoint directly. Exact camera/projection snapshots remain covered for walking and interrupted transitions. Camera listeners are still detached on retry cleanup.

Both east and south cutaway walls stay hidden for the entire external open quadrant, including exact zero components at 0°/90°. North/west walls and authored interior partitions remain. Walking restores the enclosed view through its existing separate visibility snapshot. No model, texture, material, source master or GI data changed.

## Offline review and limits

Clean `npm ci` and final `npm run verify` pass 302 tests, with zero failures or skipped tests. Distribution size is 19,808,120 bytes; remaining headroom is 1,163,400 bytes below 20 MiB, exceeding the required 1 MiB reserve. The release is 139 bytes larger than v20.2.

`source-assets/axial-review/README.md` reproduces the review. The three strict-axis candidate views were inspected before publication; final runtime fixtures cover all three viewpoints in overview/lower/upper at 1440 × 900 and 390 × 844. Geometry checks verify perpendicular projected floor axes, open cuts, matching viewport/frustum aspect and bounded framing.

The right overview naturally has a narrower silhouette, reflecting the room's dimensions. Upper-floor slabs hide part of the lower interior; use 一层 to inspect it. Interior bathroom walls remain occluders. These are intentional architectural occlusions, not reasons to deform the model.

Blender previews use neutral review lights and CPU Cycles. They do not establish browser/WebGL appearance, production GI/shadows, real touch behavior or device frame rate. The exact reviewed source delta is recorded in `recovery/axial-preset-hooks.json`; full AST, protected geometry, asset and vendor checks remain enabled.
