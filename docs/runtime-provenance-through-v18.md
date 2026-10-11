# v18 runtime update over frozen v17 assets

Runtime release **18.0.0** adds startup-only, bounded preparation of the existing first-switch GPU resource paths. All asset identities and authoring evidence below remain unchanged. The v17 release counts and source-persistence records below describe that frozen asset release; current runtime verification and distribution size are in `verification-first-switch-v18.txt` and `resource-budget.json`. See `first-switch-preparation-v18.md` for the exact runtime changes, startup tradeoff and absent device/GPU evidence.

# Frozen organic seating and botanicals v17

Release **17.0.0**. The previous v16 provenance and README are preserved in `archive-v16/`.

## Exact identities

- Full-precision editable master, delivered as `source-assets/bearroom-organic-v17.blend`: `822b7ad9bda89889530dae32efaf5ecde831c991f6994bed97b7a8c02227afc4`, **22,593,260 bytes**. This is a byte-identical canonical copy of the frozen `bearroom-organic-v17-grounded.blend` used for validation and the actual bake.
- Canonical decoded GLB: `b294de08c3b0cdf4a1db5c144e6a42d66d6ac5129fc65c872fcef4977a3e75a7`, **35,780,460 bytes**.
- `assets/bearroom.glb.gz`: `a0253d9d4afac2d49a9f94bb74811585847f0dd14daaf2c50f8cf12b926e404f`, **18,688,107 bytes**.
- Actual fresh GI JSON: `107ef50f0ec636d401df4631133ea0061ef14944ab2c325c16b39ea072962971`, **104,063 bytes**.

The guarded installer verified the frozen source bytes and both analytic/sky source identities before installing the model/GI pair. No Site checkout, commit, deployment or ZIP was made by the integration worker.

## Authored changes

The sofa now has a connected upholstered frame, boxed seats and backs, sewn seams, filled loose cushions with restrained pressure-settled folds, and a gravity-settled throw. The office chair and rocker retain their mechanisms while replacing assembled-looking padding with coherent shaped upholstery. Scanned CC0 Teddy and linen maps carry albedo, OpenGL tangent normals and packed ORM. Textures are shared across applicable objects.

Five existing plant locations use five distinct curved-leaf/petiole Calathea variants. One shared 512px alpha-bearing atlas, normal map and packed ORM serve all five; their geometry is not baked into repeated copies. Leaves are double-sided `MASK` at 0.5, with depth writes, no transparent sorting pass and no transmission/subsurface model. Exactly 1,900 existing soil triangles receive an opaque dark soil material; the soil carrier's entire 2,088-triangle world-space multiset is unchanged. Pot geometry and the two flower arrangements remain protected. See `asset-attributions-v17.md` and retained source manifests.

Two finite rigid placement adjustments are explicit:

- Main bear: one whole-root fit, with unchanged part geometry, materials and local pose. Runtime root translation changes by approximately [-0.0715084672, +0.0229337811, 0] m, with the reported 5.25° world-space Blender-Y rigid tilt about its foot pivot. The exact matrix is in `recovery/organic-v17-bear-placement.json`.
- Rocker: `F16_reading_rocker` moves downward by exactly the representable 22mm step, preserving XY, rotation, scale, all local geometry and the existing ±1.5° controller. 301 sampled phases retain approximately 0.89–2mm floor clearance. The exact allowance is in `recovery/organic-v17-rocker-placement.json`.

## Preservation and runtime mechanics

All **44** non-revision files in the pinned v16 runtime/vendor/recovery/art/HTML baseline remain byte-identical; only `src/asset-revision.js` changes in that set. There are no new app hooks, shader patches, controls, lights, postprocessing, loading architecture or per-frame geometry paths. Existing PC nine-fan controls, four RGB zones, portrait local clock, slideshow assets, walking/stairs/bathroom door, temporary ceiling, fixed views, audio and piano remain guarded.

The scene guard checks **386 protected nodes**, including all local geometry/material bytes and root controls. Nine exported protected nodes have their world matrices explained solely by the two documented rigid root adjustments; 377 remain wholly unchanged. Authoring-only scene descriptions are the only metadata additions permitted. Edited seating/botanical meshes and the separately geometry-checked soil material split are enumerated, never replaced with a new blanket golden snapshot. Source reconstruction independently verifies all **1,912 authored objects**.

## Export and representation

The established compactor retains prior UNORM8 colors and restores unchanged attributes against the pinned v16 GLB. Exact image and buffer sharing remove duplicate byte payloads without altering decoded semantics.

Only **55,518 new organic vertex normals across 14 accessors** use signed normalized int16 with `KHR_mesh_quantization`. Worst component error is **0.0000152591**, and worst angular error is **0.00146057°**, below the approved 0.0015° bound. Position, UV, color, index, material, image and node-transform data are untouched by this representation step. All old protected normals remain exact. The editable master stays full precision. No position/UV quantization, lazy loading or blanket normal quantization was used. See `normal-quantization-v17.json`.

After the first complete export, the final source changed only the rocker root translation. The final canonical GLB therefore applies only that source-proven translation to the verified export: all other parsed JSON values and the **entire binary chunk** are byte-identical. `root-translation-patch-v17.json` records the old/new source and model hashes, exact node/hierarchy mapping and binary hash; `scripts/patch-rocker-root-translation.py` reproduces that bounded operation. The normal full-source Blender export route remains valid and is documented separately.

Zopfli1 saves **273,307 bytes** over zlib for the final GLB and verifies exact decoded equality. Raw oversized GLBs and scratch candidates are excluded from source delivery.

## Genuine lighting

Fresh 96-sample Cycles analytic indirect-only day/night endpoints and a separate 96-sample occluded sky transport were baked from the final **822b7ad9** source. Three 32-sample controls and six hashed raw EXRs establish the transport. Analytic black response is zero; sky unit/direction error is **0.0000511553** against a 0.003 limit. All 160 samples meet clearance, with 19 local relocations and one documented same-region fallback.

All five leaf silhouettes participate in transport; black controls preserve their exact alpha graphs. Stationary opaque PC geometry participates while nine moving rotor roots, display/RGB emission, glass and other established exclusions remain omitted. All ten exported lamp anchors match the bake exactly. The living target follows the existing bounds-center behavior for the rigidly seated bear, agreeing within **1.09e-7m**; every other source calibration remains unchanged. All four new materials' texture payloads and normal strengths match the frozen source.

Low-frequency probes can leak across thin surfaces. Dynamic emissive bounce, glass caustics, moving-prop indirect occlusion and rebaking the temporary walking ceiling remain outside this renderer's scope. The fresh bake is not relabeled AO or a brightness tint.

## Final checks and resource scope

`npm run verify` passes **108/108 tests, zero skips**, production build, paired source/model/GI hashes and the strict static budget. The independent focused runtime suite also covers the actual final model. All 88 piano keys and five fixed presets pass general model QA. Full continuous cloth-motion checks have zero crossings; original bear data, approved rigid contacts, rocker grounding, source scope, opaque soil geometry, leaf alpha and PBR payloads are independently checked.

Independent source/export correspondence covers the whole scene's **642,396 static triangles**, plus all three cloth meshes at their extrema. Maximum world-vertex error is **1.41µm**; all **94,092 current-revision static triangle normals** pass (maximum full source/export corner-normal difference0.016835°, distinct from the isolated quantization-step error above). An additional diagnostic identifies inherited corner-normal discrepancies on 213 nondegenerate protected triangles, plus degenerate normals. Those legacy attributes are unchanged from v16 and are explicitly reported rather than silently repaired or excluded from the preserved-data guards. See the independent final QA report for owner-level details.

- Distribution: **20,919,947 bytes**, below **20,971,520 bytes (20 MiB)**; headroom **51,573 bytes**.
- Asset: **407 nodes, 339 meshes, 341 primitives, 672,916 triangles**. These are asset counts, not measured GPU draw calls.
- Geometry typed-array views: **28,374,728 bytes**.
- Collision arrays: **26,494,534 bytes**, 653,246 triangles and 169,993 BVH nodes; built once.
- Total decoded-image RGBA8 estimate, including slideshows and generated clock: **117,430,016 bytes**. Approximate full-mip image estimate: **156,385,707 bytes**; clock canvas has no mip chain.
- Active cloth work: **4,685 weighted Y writes** and **145,500 bytes** of position upload ranges per active frame.

Memory figures exclude JS objects, temporary allocations, shared backing-buffer behavior, render targets, shadow maps and driver overhead. No supported actual WebGL browser or real-phone performance verification was available; no bypass was used. Offline Cycles images and CPU/source checks are not claimed as browser screenshots or measured FPS.

## Source persistence

The source staging retains the full-precision canonical master, deterministic builder and exact rebuild proof, final rest meshes, material preparation, CC0 attribution/reproduction records, final lighting execution and controls, final accepted QA, bounded export/compression helpers, and all previously shipped source files unchanged. The v16 runtime is additionally pinned as the attribute-restoration baseline. Every file must remain below 25 MiB; final inventory is in `source-persistence-v17.json` and `source-persistence-manifest-v17.json`.

The parent owns copying the staged source/documents into the Site repository and any publication. Local preparation alone is not a claim of saved Site source or deployment.
