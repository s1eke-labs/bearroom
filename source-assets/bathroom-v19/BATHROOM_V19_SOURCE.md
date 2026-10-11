# Bathroom v19 source package

## Frozen source

- File: `bearroom-bathroom-v19-candidate.blend`
- SHA-256: `96c4f90312490c45489c64a4f836094a2f80d4a7bd077a093494eac72948d173`
- Bytes: 22,593,333
- Blender: 4.3.2
- Baseline: `bearroom-organic-v17.blend`
- Baseline SHA-256: `822b7ad9bda89889530dae32efaf5ecde831c991f6994bed97b7a8c02227afc4`
- Builder: `build_bathroom_v19.py`
- Builder SHA-256: `4b704a9e60de565e0f4b1a4622a4cf5abf802726f755f69e380db974fa52a0a4`

No model changes are permitted after the frozen source hash without repeating source/export/GI QA.

## Rebuild

Place the builder under `source-assets/bathroom-v19/`, and retain the verified baseline at `source-assets/bearroom-organic-v17.blend`. The builder also supports the original working-directory layout with `bearroom-v17-source-persistence/bearroom-organic-v17.blend` beside the bathroom directory.

Run:

```
blender -b -t 4 --python source-assets/bathroom-v19/build_bathroom_v19.py -- /absolute/path/bathroom-rebuilt.blend
```

Dependencies are Blender's bundled Python, `bpy`, `bmesh`, `mathutils`, and Python standard-library modules. No third-party Python package, network fetch, separate model, or new image texture is required. Existing packed material/image data comes from the frozen v17 baseline. The existing materials and their licensed textures are reused without modification. The sole new material, `bath19_silvered_mirror`, is a procedural derivative of the existing brass node tree, with silver base color, metallic 0.8, roughness 0.12, and full opacity. Runtime mirror appearance remains an approximation; the runtime does not gain a reflection capture/SSR system.

A second complete rebuild has passed exact authored-data equivalence. Its `.blend` container hash differs because Blender serialization includes container state; all compared authored object/material/root data is equivalent. See `rebuild-equivalence.json`.

## Change boundary and preservation

Only the bathroom fixture subtree under the unchanged `F20_vanity`, bathroom wall/floor meshes under the unchanged `Bathroom_architecture`, bathroom rear privacy wall, bathroom front partition, and moving door leaf/hardware are changed or added. Existing animation and furniture roots, all `light_*` anchors, the door hinge, and all non-bathroom objects are unchanged.

The exact finite old/new allowlist is in `build-report-frozen.json`, fields `allowedOriginalObjects`, `created`, `replaced`, and `removed`. The only new scene metadata field is `bathroomRevisionV19`.

- 1,889 non-bathroom objects pass exact original-data digest equality.
- All 71 existing materials pass original-input/link-definition equality.
- The combined old `Architecture__plaster_warm_white` mesh is exclusively the bathroom front-wall/lintel assembly. Every original vertex lies in x 2.42–4.92, y 1.937–2.057, z 0–2.82. It has no non-bathroom subset. See `front-partition-scope-proof.json`.
- All other `Architecture` nodes are preserved, including the original merged oak door frame, room floor, windows, exterior walls and upper slab.
- Authored bathroom vertices: 12,317 → 7,986.
- Authored bathroom triangles: 9,904 → 15,536. Smooth fixture detail replaces dense recovered/split wall geometry. No texture payload is added. Final runtime compressed size is established independently by integration.

Digest coverage is object type, parenting, local/world transforms, custom properties, mesh positions/topology/material slots/smooth flags, UVs/colors, curve paths/radii/material assignments, and existing material node input/link definitions. Read the validator for exact coverage.

## Construction

- Basin: continuous closed porcelain shell with an actual hollow interior, rolled rim, pop-up waste and connected gooseneck faucet.
- Vanity: radiused quartz counter and backsplash, oak carcass with separate drawer fronts/pulls, 8 mm drawer reveal and recessed plinth. Cabinet and drawer panels expose `giKeepoutGroup='vanity_cabinet'` for precise indirect-light masking.
- Toilet: continuous skirted bowl and internal cavity, independent hollow seat, raised lid, cistern/lid, hinges and flush control. It does not intersect the vanity or roll holder.
- Shower: formed tray with sloped well and drain, true-thickness glass and connected wall/floor channels, mixer/riser, shower head, spray nozzles, handheld shower/hose and a small soap shelf.
- Door: same leaf name, hinge transform and closed leaf envelope, with two-sided mounted levers and hinge knuckles. Original oak frame remains untouched.

All coordinates below are Blender Z-up world metres. Runtime conversion is x, z, -y.

## Wall rim repair

Independent inspection identified that lower-floor runtime clipping at 2.78 m cut the old 2.82 m closed walls into open, uncapped cross-sections. Their double-sided far faces were visible through that rim. Wall-corner positive-area overlaps also existed at the old top plane. Exact duplicate/degenerate wall triangles were not the root cause. A shadow-depth/back-face bias contribution was suspected from shader/raycast evidence, but was not visually confirmed on WebGL.

The replacement walls are welded, closed and opaque, with non-overlapping butt joints. Their intact cap is at 2.775 m, 5 mm below the lower-floor clipping plane. A separate shallow closure at 2.785–2.82 m, fully above that clipping plane, meets the upper slab through a deliberate 10 mm dark reveal. This is source geometry, without polygon-offset masking, transparent privacy walls, or disabled wall shadows.

The actual final cap, overview finish and eye-height top corner were rendered and visually reviewed. No broad open void or bright leak is visible. Live WebGL flicker remains device-validation work; offline renders do not prove it absent.

## Door and navigation contract

- Hinge name: `bathroom_door_hinge`
- Hinge world position: (4.2150001526, 1.9809999466, 0)
- Hinge transform: preserved exactly from v17
- Leaf name: `bathroom_oak_door`
- Closed leaf bounds: x 3.35–4.21, y 1.9535–2.0085, z 0.055–2.125
- Open rotation: −π/2 around Blender local Z, corresponding to Three local Y
- All moving leaf and hardware were tested at 91 one-degree poses. No fixture triangle intersections occur.
- Sampled minimum leaf-vertex to fixture clearance: 0.208448 m, at 7 degrees, to shower floor channel. This is a sampled upper-bound clearance, not a continuous analytical swept-volume certificate.
- Toilet to vanity/roll-holder lateral gap: 0.127 m minimum; no exact triangle intersections.
- Shower east-side opening: x 3.163, y 2.20–2.94, width 0.74 m.
- Toilet front: y 3.137; clear authored approach extends toward y 2.15.
- Toilet, shower tray and vanity plinth sit at finished floor z 0.044.
- Existing lower window ends at x 2.35; all bathroom additions remain east of it. No intrusion.

The source checks are in `source-validation.json` and `fixture-contact-validation.json`. Final runtime capsule navigation, click safety and matching model-node tests are separate integration/independent-QA responsibilities.

## Evidence to persist

Authoritative reports and reproducible checks:

- `build-report-frozen.json`
- `source-validation.json`
- `fixture-contact-validation.json`
- `front-partition-scope-proof.json`
- `rebuild-equivalence.json`
- `validate_bathroom_v19.py`
- `verify_contact_v19.py`
- `prove_front_partition_scope.py`
- `verify_rebuild_v19.py`
- `render_bathroom_v19.py`

Exact final-source images, each with its same-stem JSON camera/provenance:

- `final-lower.png`: actual 2.78 m cut, runtime east/south shell visibility, surrounding context and original frame.
- `final-overview.png`: fixed-isometric overview with loft and bathroom facade, no lower cut.
- `final-uppercorner.png`: eye-height internal upper corner, full walls/ceiling and reveal.
- `final-interior.png`: fixture study with review-only front/east wall removal. This is an intentional inspection cutaway, not privacy behavior.

Use only the `final-*` set as final-source evidence. Draft `candidate-*` and `refined-*` images are developmental reviews and should not be shipped as final evidence. The predecessor used for `refined-*` is retained only as the local `.blend1`, SHA `02f2309db74c9992986df520416e09d1ccf1c6f17380e0b28ae5bd88a6547597`; it differs from final only in nine tiny drain-slot bevels. Draft render JSONs are explicitly labeled with that predecessor.

## Verification limits

These renders use offline Cycles inspection lighting and no denoiser. The lower/overview visibility rules match source runtime rules, but they do not reproduce its WebGL shading or shadow maps. Production lights and fresh indirect lighting must be separately baked from the frozen source and checked by the integration pipeline. No browser WebGL run, mobile performance test, interaction acceptance or deployment is claimed by this source package.
