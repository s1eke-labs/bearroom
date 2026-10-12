# Final runtime provenance: v19

Post-v19 lossless repacking now ships a 17,610,286-byte gzip (SHA256 `0462ad7e7b4fa4adda27a484d97cc86187cb66731dfd2224d8f0823d079342d7`), decoding to 34,733,080 bytes (SHA256 `8a1a2c47e914ba7a08f014ba5f0ff43383e122f460aee253f26e0fb2d47c1e54`). The identities below record the original export, not the current packed runtime. Editable source and GI identities are unchanged. Exact decoded pixels, color chunks and nonimage payloads are checked by the certificate described in `lossless-asset-budget.md`; startup changes and current totals are in `runtime-optimization.md`.

The current runtime descends from deployed v11 commit `679d19306992b8a895dab5c47da0a8aad0f86e4d`. Original authored v11 app sources/maps were lost during workspace recovery; its deployed code was retained and split at declaration boundaries. This is recovered provenance, not a claim that the lost originals were recovered. The immediately preceding v18 production commit is `f36da3ed604406e259f264a8458f56eb18de1b51`. Earlier source history and reports remain preserved, including `runtime-provenance-through-v18.md`.

## Original v19 frozen identities

- Editable source: `source-assets/bearroom-bathroom-v19.blend`, 22,593,333 bytes; SHA256 `96c4f90312490c45489c64a4f836094a2f80d4a7bd077a093494eac72948d173`.
- Canonical decoded GLB: 35,915,484 bytes; SHA256 `1f1fcc773da5cf4d44a314d3c5063b8d1a2a1f6486dfe158228eb4abdbb4269e`.
- Shipped gzip: 18,713,768 bytes; SHA256 `7169a4e69d9a0d86829f31f495185951c4f6f1491f6acdb514d290ef7f2c12e4`.
- Fresh GI: 104,797 bytes; SHA256 `c59a89176e513322673f796dfa788ec1be1a452a072a80142ad94030692008e9`.

The working filename ending `-candidate.blend` in execution evidence is an identical-byte alias of the canonical delivered master. Export, rendering and GI never resaved that file. A second complete builder run passed exact authored object/material/root-data equivalence.

## Change boundary and packing

The bathroom revision replaces the sink, vanity, toilet, shower, moving door leaf/hardware and bathroom enclosure surfaces. Closed wall caps sit below the 2.78 m lower-view clip; the separate upper closure retains a deliberate 10 mm reveal. Privacy walls stay opaque and shadow-casting. The mirror is an approximate metallic surface; no runtime reflection-capture system was added.

All 1,889 non-bathroom source objects and 71 existing material definitions remain unchanged. Runtime guards verify every attribute byte, transform, metadata field and material binding on all 398 protected v17 nodes, plus all 70 protected material/image payloads. Fourteen old and 38 new bathroom runtime nodes form the finite reviewed edit scope; all roots, the door hinge and lights stay protected. See `protected-scene-v19.json` and `recovery/bathroom-v19-scope.json`.

The canonical model is a complete export of the final frozen source followed by exact unchanged-attribute restoration, image-reference deduplication and shared-buffer packing. Existing v17 organic-normal representation is retained exactly; the two re-exported multi-material chair normal accessors reproduce their prior packed values. No new bathroom normal quantization, geometry simplification or texture-quality reduction was used. Cloth positions remain float.

Zopfli 15-iteration gzip reduced the initial lossless candidate by another 59,435 bytes in about 83 seconds. Decompression is byte-identical to the canonical GLB. No raw oversized GLB or archive is included in source persistence.

## Genuine GI

The accepted bake freshly traced 96-sample analytic night/day indirect light and 96-sample day-sky transport, with three 32-sample controls. All existing physical light/sky calibrations remain unchanged. Analytic black response is zero; sky unit error is 0.0000511553 against the 0.003 limit.

All 160 samples pass final-source clearance, with 17 local relocations and two explicit same-region fallbacks. Fourteen cabinet keepouts and bathroom/floor privacy isolation pass. Scanned botanical alpha silhouettes are preserved. The rebuilt opaque mirror participates in transport; a preliminary run using the stale glass-era exclusion was rejected and fully rebaked. Nine dynamic PC rotors, glass, animated emissions and established exclusions remain omitted. All ten runtime light anchors match exactly, and the living-light target agrees within 1.094e-7 m. The source/runtime material checker covers nine bathroom materials, four organic materials and five botanical instances.

Low-frequency probe leakage, moving-prop indirect occlusion, dynamic emissive bounce and glass caustics remain renderer limitations. No brightness gain or relabeled AO replaces transport.

## Runtime and verification

The three click behaviors use the existing fixed-view tap path. Door state persists into walking, with occupied-sweep rejection; PC fan/RGB state persists without stopping its display; keyboard feedback is visual and does not type, play audio or send data. The original camera, GI shader, calibrated lighting, other animations, vendor code and v18 preparation stay exact. `runtime-preservation-v19.json` records the bounded source change.

- `npm run verify`: **154/154 tests, zero skips, actual exit 0**, production build, source/model/GI contracts and budget.
- Independent final-model suite: **42/42**. Complete routes, real door collision/state, 88 piano keys, 76 computer keycaps, pointer interruption and v18 readiness are covered.
- Bathroom export equivalence: **15,536/15,536 oriented triangles and all corner normals**; maximum world-vertex discrepancy 0.112 micrometres.
- Continuous conservative door clearance: 90 one-degree swept envelopes, ten moving meshes, zero possible fixture overlaps.
- Wall checks: six closed opaque wall segments, actual upward-cap hits in all five fixed views, all four upper closures hidden in lower view, 25 blocked privacy rays, no duplicate/degenerate wall triangles.
- Distribution: **20,957,846 / 20,971,520 bytes**, headroom **13,674 bytes**.
- Model: 431 nodes, 363 meshes, 365 primitives, 678,196 triangles. Geometry-array views: 28,475,512 bytes. Separate collision arrays: 26,652,154 bytes.

These are source, offline Cycles and CPU checks. No supported real WebGL session or real-phone performance validation was available. The source cap repair addresses the diagnosed open-rim mechanism; live device flicker and frame time remain unverified. Counts and allocation estimates are not measured draw calls, GPU memory or FPS.

## Persistence

`source-assets` holds the full-precision master, portable deterministic builder, final accepted renders/checks, complete fresh GI evidence, compressed canonical model and reproduction helpers. All previously shipped v17 source-package files are preserved byte-for-byte, with its README at `history/README-v17.md`. Every file is below 25 MiB. No new draft render, supplied reference photo or ZIP is included. Final inventory: `source-persistence-manifest-v19.json`; summary: `docs/source-persistence-v19.json`.
