# Curated dollhouse cameras: offline review

These read-only helpers export the actual runtime preset endpoints and review them against the editable seated-v20 source in CPU Blender. They never save a Blender file or alter the model, materials, geometry or baked GI. All generated JSON, PNG, logs and reports stay outside the repository.

From the repository root, after restoring assets if necessary:

```sh
npm run restore:sources
node source-assets/preset-review/export_cameras.mjs . /tmp/bearroom-preset-preview/final-cameras.json
blender -b -t 6 --python-exit-code 1 --python source-assets/preset-review/render_camera_presets.py -- \
  source-assets/bearroom-seated-v20.blend \
  /tmp/bearroom-preset-preview/final-cameras.json \
  /tmp/bearroom-preset-preview/final-images
```

The exporter uses `CAMERA_PRESETS`, the actual runtime GLB, `IsometricRoom.fit()` and immediate `selectPreset()` endpoints. It emits overview, lower and upper views for every preset at 1440 × 900 and portrait 390 × 844: eighteen fixtures. Each fixture includes the exact camera frustum, pose, cutaway mesh visibility, projected room bounds and unit-axis projection lengths. Assertions reject a wrong endpoint, a frustum/viewport aspect mismatch or room bounds outside the viewport.

The renderer maps Three coordinates `[x, y, z]` to Blender `[x, -z, y]`, removes the same east/south front walls and slices floor views at the runtime 2.78 m plane. Source furniture remains unbatched. Temporary slicing, lights and cameras exist only in memory. Source, compressed runtime model and GI hashes are verified against the manifest before and after review; the source itself is also hashed independently. To render a subset, add exact frame names after the output directory, for example `overview-left-390x844`.

## Angle selection

The source was visually compared at yaw 35°, 38°, 45°, 52° and 55°, with elevation 35° except for the exact classic isometric elevation 35.2643897°. Selected presets:

- Classic: 45° yaw, 35.2643897° elevation; equal projected unit-axis lengths.
- Left: 35° yaw, 35° elevation; clearer frontal reading of the piano and desk.
- Right: 55° yaw, 35° elevation; a distinct reading of the staircase and left-side room.

For a unit axis `a` and normalized camera direction `d`, orthographic projected length is `sqrt(1 - dot(a,d)^2)`. The selected side views have a maximum floor-axis length ratio of 1.1906:1. The tighter 38°/52° candidates lower it to 1.1306:1 but provide a less distinct change. The former 20°/70°, 25° orbit extremes reached approximately 1.8:1. These ratios describe projection foreshortening, not geometry scaling.

All three retain near-isometric proportions in the reviewed model. Furniture, both floors and the staircase remain inside the camera frame. In overview, the upper slab still occludes rear lower-floor contents; choosing the lower view removes this architectural occlusion. Angle changes alone cannot expose all downstairs contents. The retained bathroom enclosure also remains a real occluder.

## Limits

Inspect the PNGs directly before accepting changes. These are offline framing and geometry previews, using neutral lights and CPU Cycles with 48 samples. They do not prove browser input behavior, smooth animation, WebGL appearance, production GI, runtime shadows or frame-rate results. Portrait framing assertions cover the projected model; actual browser UI overlap still needs browser acceptance. Camera code hashes in the manifest make stale previews detectable.
