# Runtime model contract

The runtime uses exact glTF node names. Exporters must not rename expected nodes, move pivots, discard `extras`, or turn a directly animated mesh into an unnamed group. The model is Y-up in Three.js.

## Layout and camera

The fixed orthographic camera uses `(1,1,1).normalize()` toward the viewer and looks at its target from distance 35. Screen right is `(1,0,-1).normalize()`; screen up is `(-1,2,-1).normalize()`. Normal/preset zoom is capped at 8; piano at 16. Floor cut is Y=2.78. Presets: `overview`, `lower`, `upper`, `bear`, `piano`. Main loft/bathroom visibility in GI uses unchanged world-space splits: floor Y=2.99, rear Z=-1.84, plus the current bathroom/slab extents in `src/baked-gi.js`.

Exterior city is removed at load. The constructor caches mesh bounds; runtime animation must remain within intended small amplitudes. Added physical details participate in bounding-box fits and cutaway naturally.

## Required semantic names

- Furniture roots `F01_…` through `F23_…`, one authored category per root.
- Piano keys `piano_key_021` through `piano_key_108`, each a direct mesh, pivot and geometry preserved. All 88 are required. Press rotates local X from its rest rotation; a drag must not trigger audio.
- Direct cloth meshes: `anim_sofa_edge`, `anim_dining_edge`, `anim_bed_edge`. Cloth deforms weighted local +Z edge vertices in local Y; preserve local axes.
- Other animation pivots: `anim_chair_swivel`, `anim_rocker`, `anim_fan_head`, `anim_purifier_louver`, `anim_clock_pendulum`, `anim_hood_fan`, `anim_fan_blades`, `anim_pc_fan_01`, `anim_pc_fan_02`.
- Clock hands: `anim_clock_second`, `anim_clock_minute`, `anim_clock_hour`.
- `anim_pc_fan_03` is supported opportunistically by the original runtime, but absent from production v11. It is not a required contract node.
- Preserve any `extras.animationAxis` on pivots. Runtime uses that axis ahead of the default.
- Direct picture meshes: `screen_PC`, `screen_TV`, `frame_01`, `frame_02`, `frame_03`, with usable `TEXCOORD_0` and their authored UV orientation.
- Lamp markers: `light_living`, `light_piano`, `light_desk`, `light_kitchen`, `light_dining`, `light_bed`, `light_reading`, `light_entry`, `light_bath`, `light_stairs`. Original runtime has fallback positions, but correct authored markers are preferable.
- Bathroom privacy meshes: `cutaway_bathroom_rear_privacy`, `cutaway_bathroom_partition`, `cutaway_bathroom_side`. Keep the actual walls and door closed/privacy-complete per the geometry task.
- Plush root `Bear_reference_plush`, containing direct body mesh `Bear_reference_plush__fabric_bear`.
- Plush root `Bear_desk_plush`, containing direct body mesh `Bear_desk_plush__fabric_bear`.

The velvet modifier selects those exact body names under those exact roots, and expects a standard or physical material. Other embroidery/seam meshes remain separate. Legacy fiber meshes, when retained, keep `extras.physicalPlush === true` and `extras.fiberCount`; they stay hidden in the default `velvet` appearance. The sewn-bear update may remove those legacy fibers and add visible authored short nap (`bear_minky_surface_nap` / `desk_bear_minky_surface_nap`) without the `physicalPlush` flag. The primary bear closeup uses the exact `Bear_reference_plush` ancestor.

## GI identity and schema

The bake-source SHA256 identifies the final scene source, conventionally the `.blend` bytes. It differs from GLB-content SHA256. Both live in `src/asset-revision.js` and are checked before building. Runtime also refuses a GI file whose `sourceSha256` differs from the configured bake identity.

Schema version 1, dimensions `[5,2,4]`, four regions (`lower-front`, `lower-rear`, `bathroom`, `upper`), six directional faces per probe, 160 probes. `states.day` and `states.night` each hold exactly 2,880 finite nonnegative radiance values, in `region,z,y,x,face,rgb` order. These remain genuine analytic-source indirect-only bakes, with direct source lighting excluded. The shader multiplies unit-white Lambertian radiance by π once.

The optional `sky` object must retain separately labelled `states.day` and `states.night` arrays in the same order. Required semantics are `quantity: "unit-white Lambertian radiance"`, `method: "Cycles DIFFUSE direct+indirect, world only"`, `analyticLights: false` and `emissiveSurfaces: false`; its `sourceSha256` must match the primary frozen bake source. Sky radiance includes visibility through the actual scene and diffuse bounce, rather than an unoccluded hemisphere fill. Each array must contain exactly 2,880 finite nonnegative values; each analytic-plus-sky sum must be at most 65,504 to remain finite in the existing half-float texture. The CPU adds the two arrays once while packing the same 5×2×192 RGBA volume. No shader fetch, sampler, shadow map or draw is added. Legacy GI files with no `sky` object remain valid.

The analytic black-surface response control should remove analytic indirect light. A sky black-surface control may retain directly visible sky; it is distinct and must not be mislabelled as an indirect-only result. Bake controls/provenance establish transport semantics; source-hash validation alone cannot do so.

## Reference PC v16

`F09_computer` retains its protected root transform and the two original empty `anim_pc_fan_01/02` compatibility anchors. Only four obsolete old fan child-mesh transforms are retired, named exactly in `recovery/pc-case-replacements.json`; no non-PC requirement is removed.

The new portrait screen is `screen_PC_case_v16`, with glTF upper UV v=0 and lower v=1. Its actual material is replaced by a front-sided screen at runtime; it must be directly raycast reachable from fixed and standing views. Preserve nine direct non-mesh `pc16_rotor_*` controls with `pcSpinAxis`, `pcSpinSpeed`, and `pcFanRadius` extras. Side fans use local X, top fans Y, GPU/rear fans Z after glTF export. Moving mesh descendants carry `noShadowCaster=true`; stationary RGB rings stay outside their rotating groups.

Shared emissive materials are `pc16_rgb_side`, `pc16_rgb_top`, `pc16_rgb_rear`, and `pc16_rgb_trim`. Keep `pcNoBatch` and RGB semantic meshes intact during authoring export. Source display artwork stays packed in the editable master, while the exporter removes that single material's image node and the app uses a separate external WebP once. The original monitor/TV/frame materials and pictures are protected independently.
