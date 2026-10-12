# True axial dollhouse cameras: read-only review

These helpers review the exact `经典 / 正左 / 正右` camera endpoints against the unchanged seated-v20 editable source. Generated JSON, PNG, logs and reports belong outside the repository. The renderer never saves a Blender file, exports a model, or changes production GI.

## Coordinate and label definition

Runtime Three coordinates are Y-up. The actual cutaway walls identify the room axes:

- South opening: `cutaway_wall_south_*` lies at Z = +4.1 m.
- East opening: `cutaway_wall_east` lies at X = +5.1 m.
- Retained north and west walls lie at Z = −4.1 m and X = −5.1 m.

Azimuth is measured from +Z toward +X. The normalized offset from target to camera is `(cos(elevation) sin(azimuth), sin(elevation), cos(elevation) cos(azimuth))`.

- `经典`: azimuth 45°, elevation asin(1/√3) = 35.26438968275466°.
- `正左`: azimuth 0°, same elevation; camera is on +Z, looking toward −Z through the south opening. Screen-right is world +X.
- `正右`: azimuth 90°, same elevation; camera is on +X, looking toward −X through the east opening. Screen-right is world −Z.

The left/right labels describe the two openings visible in the classic image. In that image, screen-right is `(1, 0, −1)/√2`; the south opening therefore projects to the left of the center, and the east opening projects to the right. This is not a claim that +Z is the room's geographic west.

These are exact axial views in plan, with the original downward elevation retained. They are not zero-elevation facade drawings. Both east and south cutaway walls must remain hidden at the 0° and 90° boundaries and throughout the transition. Otherwise a zero direction component could incorrectly restore an occluding wall.

## Projection checks

The orthographic camera preserves physical proportions, with frustum aspect equal to viewport aspect. Side views deliberately change which world axis is foreshortened:

- At 0°, X projects horizontally with length 1; Y projects vertically with length √(2/3); Z projects vertically with length 1/√3.
- At 90°, Z projects horizontally with length 1; Y projects vertically with length √(2/3); X projects vertically with length 1/√3.
- At 45° with the classic elevation, all three unit-axis projection lengths equal √(2/3).

The side-view floor-axis length ratio is therefore √3, not 1. This is the expected orthographic depth foreshortening at the retained elevation, not aspect stretching or geometry scaling. A true axial view cannot preserve the equal X/Z projected lengths of the classic isometric view at this elevation. Floor grid axes are screen-horizontal/vertical at both side endpoints; physically sloped objects such as the staircase can still have sloped edges.

The exporter asserts the exact camera direction, perpendicular screen basis, house-axis alignment, viewport aspect, visible-room bounds inside the reserved UI area, and the invariant cutaway. It exports all eighteen combinations of overview/lower/upper, classic/left/right, and 1440×900/390×844.

## Actual runtime review

Run only after the intended camera implementation is ready and frozen:

```sh
node source-assets/axial-review/export_cameras.mjs . /tmp/bearroom-axial-preview/final-cameras.json
blender -b -t 6 --python-exit-code 1 --python source-assets/axial-review/render_axial_presets.py -- \
  source-assets/bearroom-seated-v20.blend \
  /tmp/bearroom-axial-preview/final-cameras.json \
  /tmp/bearroom-axial-preview/final-images
```

This path exports the actual runtime GLB, `IsometricRoom.fit()` and `selectPreset(..., { reducedMotion: true })` endpoints. Each frame records camera pose, frustum, cutaway visibility, projected axes and room bounds. The renderer maps Three `[x,y,z]` to Blender `[x,−z,y]`. The floor cut is the runtime Y = 2.78 m plane.

The source, compressed runtime model and production irradiance JSON are SHA-256 checked before and after rendering. The exported camera manifest is also checked for changes, and a runtime review rejects camera-code hash drift between export and completion.

For a subset, append exact frame names after the output directory, for example `overview-left-1440x900 overview-right-1440x900`.

## Candidate review before implementation

For early visual approval only, the optional `candidate` argument uses the unchanged runtime scene/cutaway with the proposed exact 0°/45°/90° poses and a temporary orientation-specific orthographic fit:

```sh
node source-assets/axial-review/export_cameras.mjs . /tmp/bearroom-axial-preview/candidates.json candidate
blender -b -t 6 --python-exit-code 1 --python source-assets/axial-review/render_axial_presets.py -- \
  source-assets/bearroom-seated-v20.blend \
  /tmp/bearroom-axial-preview/candidates.json \
  /tmp/bearroom-axial-preview/candidates \
  overview-classic-1440x900 overview-left-1440x900 overview-right-1440x900
```

Candidate files are explicitly marked `previewStage: candidate`. They verify the requested viewing directions against source geometry, but cannot substitute for the final runtime endpoint review. Re-export and render the runtime path after implementation.

## Visual acceptance and limits

Inspect the PNGs directly before publication. Overview retains real architectural occlusion: the upper slab hides part of the rear ground floor, and the bathroom enclosure remains an occluder. The lower-floor mode removes the upper slab; it does not delete the bathroom. No extra furniture or wall removal is authorized by camera selection.

The source furniture is unbatched. These are offline CPU Cycles framing/geometry previews using neutral review lights and 48 samples. They do not prove production WebGL appearance, GI or runtime shadows, browser input, transition animation, performance, or actual browser-UI overlap. Camera/visibility fixtures and source renders should be reported separately from browser acceptance.
