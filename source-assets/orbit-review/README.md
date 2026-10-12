# Bounded dollhouse orbit: historical v20.1 review

Free rotation was replaced by curated presets in v20.2; use `../preset-review/README.md` for current review. The 20–70° / 25–40° evidence below refers to commit `d96c691a`. These helpers read runtime constants, so reproducing those exact historical angles requires that commit rather than the current camera limits.

These read-only helpers inspect the current runtime camera framing against the editable source. They never save a Blender file or alter the published model/GI. The source master is hashed before and after rendering.

From the repository root, restore the current source assets if needed:

```sh
npm run restore:sources
node source-assets/orbit-review/export_cameras.mjs . /tmp/bearroom-orbit-preview/final-cameras.json
blender -b -t 6 --python-exit-code 1 --python source-assets/orbit-review/render_bounded_orbit.py -- \
  source-assets/bearroom-seated-v20.blend \
  /tmp/bearroom-orbit-preview/final-cameras.json \
  /tmp/bearroom-orbit-preview/final-images
```

The exporter reads `ROOM_ORBIT` and the real runtime model, then emits the default angle plus four bounds for overview, lower and upper. Each fixture fits the default view once, moves the camera around the same target, and calls the actual runtime `constrain()`. It asserts that rotation leaves the orthographic frustum and zoom unchanged. It does not refit each extreme. Resolution is 1440 × 900.

The renderer uses Three-to-Blender coordinates `[x, y, z] → [x, -z, y]`, east/south front-wall removal, and the runtime 2.78 m floor clipping plane. Source furniture remains unbatched. Any needed geometry slicing, lights and cameras exist only in the temporary review scene. Add frame names after the output directory to render a subset, for example `overview-yaw70-elev40`.

Inspect the generated PNGs directly. Default 45° yaw / 35.264° elevation is preserved. The selected 20–70° yaw / 25–40° elevation range stays within the open corner, looking downward. Whole-room views retain some inherent upper-floor occlusion; the lower/upper presets isolate individual floors for closer inspection. Do not use offline images to claim browser interaction acceptance, production GI or shadows, or frame-rate results: they use neutral review lights and CPU Cycles rather than the runtime renderer.

Keep all generated PNGs, JSON manifests, logs and reports outside the repository. Only these reproducible scripts and this explanation belong in source control.
