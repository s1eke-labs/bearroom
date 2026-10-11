# Bathroom v19 frozen-source GI and sky

## Status

Accepted final-source production bake completed and all source-only checks passed on 2026-10-08. Canonical runtime light/material/alpha pairing and lossless gzip sealing also passed. Preparation-only and superseded outputs are not accepted production evidence.

- Frozen source SHA-256: `96c4f90312490c45489c64a4f836094a2f80d4a7bd077a093494eac72948d173`.
- Bake script SHA-256: `23847b64cd1c16a5e93db4b16cb20f118488c092d1028e1eee3dc6d2a3b24976`.
- Accepted GI SHA-256: `c59a89176e513322673f796dfa788ec1be1a452a072a80142ad94030692008e9`, 104,797 bytes.
- Fresh 96-sample night/day/day-sky and three 32-sample controls all passed. Analytic black-response ratio is 0; sky directional/unit error is 0.0000511553, below 0.003. Separate absolute unit-test maximum relative error is 0.000000487670, below 0.00001.
- All 160 samples pass independent final-source clearance, minimum approximately 20 mm. All 40 bathroom samples stay in their privacy region. There are 17 local relocations and 2 explicit same-region fallbacks (1 inherited lower-rear and 1 bathroom cabinet sample), with 14 enclosed cabinet keepouts.
- All 95 stationary opaque bathroom meshes, including the rebuilt opaque silvered mirror, and all 266 stationary opaque PC meshes are included. Shower glass, PC glass and 27 moving PC rotor meshes remain excluded. All nine rotor roots are recorded.
- All 12 source light-anchor transforms and metric scale are exact v17 matches; actual living target delta is `[0,0,0]`. All five botanical instances retain exact v17 image/alpha graphs and both black controls retain their silhouette.
- Source bytes remain unchanged. Evidence is indexed in `source-only-validation-manifest.json`.

The first v19 trace was rejected by the independent material/inclusion audit because the inherited v17 exclusion list still classified `bath_mirror` as glass. The source had correctly rebuilt it as opaque silvered metal. The bake-only legacy classification was corrected and every endpoint/control was traced again from the same frozen source. Those rejected results are explicitly isolated in `baked-gi-v19-superseded-excluded-opaque-mirror` and `light-validation/superseded-excluded-opaque-mirror`; they are never the accepted GI.

## Exact calibration baseline

- Accepted v17 authoring source: `bearroom-v17-source-persistence/bearroom-organic-v17.blend`, SHA-256 `822b7ad9bda89889530dae32efaf5ecde831c991f6994bed97b7a8c02227afc4`.
- Accepted v17 radiance/calibration reference: `bearroom-v17-source-persistence/baked-gi-v17/irradiance.json`, SHA-256 `107ef50f0ec636d401df4631133ea0061ef14944ab2c325c16b39ea072962971`.
- The bathroom-only revision authorizes no analytic-light anchor, power, color, range, target, sky or runtime-gain changes. The living focus delta must be exactly the zero authorization vector; the existing computed target must agree within the inherited 10 µm numeric tolerance.
- Baseline radiance is read only for delta statistics. Each endpoint is traced freshly; no baseline radiance array is reused in production output.

## Reproduce after explicit freeze

From the workspace root, after receiving the integrator-approved final source hash:

```sh
bash bearroom-bathroom-v19/gi-rebuild/run_frozen_gi_v19.sh FINAL.blend FINAL_SHA256
```

The runner also detects the persisted `source-assets` layout, where old v17 assets remain at the root and new scripts are under `bathroom-v19`. From that root:

```sh
bash bathroom-v19/gi-rebuild/run_frozen_gi_v19.sh bearroom-bathroom-v19.blend FINAL_SHA256
```

The optional third argument is the GI output directory; the optional fourth is the baseline source-assets directory. All Python checks accept explicit input/output paths. The runner resolves paths from its own location and works from any current directory. Persisted-layout GI defaults to `source-assets/baked-gi-v19`; workspace-layout GI defaults to `bearroom-bathroom-v19/baked-gi-v19`.

The runner validates the source hash, runs the read-only placement/calibration preflight, traces production endpoints and controls, and runs independent source-only checks. It never calls a source-save operation. It refuses to silently overwrite an existing production `irradiance.json`. Preserve superseded output before an authorized rerun.

The final canonical runtime GLB is supplied by the integrator. Pair it separately:

```sh
python bearroom-bathroom-v19/gi-rebuild/verify_glb_light_pairing.py \
  --glb CANONICAL.glb \
  --gi bearroom-bathroom-v19/baked-gi-v19/irradiance.json \
  --output bearroom-bathroom-v19/light-validation/final-glb-light-pairing.json
```

Whole-scene runtime geometry equivalence and export provenance remain integrator-owned. Source-only evidence does not claim those gates have passed.

## Physical settings and controls

- Blender 4.3.2, Cycles CPU. Night, day and separately labeled day-sky endpoints: 96 samples, seed 1729, no denoising, no adaptive sampling; six total and four diffuse bounces.
- Analytic GI is DIFFUSE INDIRECT only; DIRECT and COLOR passes are explicitly disabled. World strength is zero, and all material emissions are disabled.
- Point/spot source radiant power is 4π times the calibrated runtime candela value. Runtime inverse-square source intensity is preserved. Finite runtime attenuation and spot penumbra remain the documented approximation.
- Day sky uses the unchanged linear RGB `[0.78, 0.86, 1.0]`, strength 0.12 upper-hemisphere source with black lower hemisphere. Analytic light energies are zero. This separate layer intentionally contains sky direct + indirect transport. Night sky is exactly zero by source definition.
- Stored signal is unit-white Lambertian outgoing radiance L. Runtime applies E = πL once, gain 1. The data is not AO or fabricated ambient tint.
- Three controls run at 32 samples: zero-albedo analytic response ratio below 0.001, surviving direct sky with black surroundings, and geometry-free sky orientation/unit error below 0.003.
- Separate fresh point/spot and diffuse-bounce unit tests verify absolute radiance conversion within 1e-5 relative error.
- Six raw Cycles EXR atlases, the exact source/script/reference and detailed alpha/control audit files are hashed.

## Geometry, privacy and alpha

- The fixed published interpolation grid and 160 probes remain unchanged, including an isolated 40-probe bathroom volume.
- Final-source sample placement is rebuilt against evaluated geometry. Local shifts have at least 14 mm clearance, target 25 mm, at most 450 mm displacement, and remain on the same floor and side of the bathroom boundary.
- Enclosed cabinet air volumes are prohibited. Final-source vanity carcass/drawer tags define its exact envelope; its actual room-facing negative-Blender-Y front, left side and top are allowed local exits, avoiding narrow rear/east wall gaps. Unresolved samples are physically traced at explicitly recorded nearest-clear locations in the same interpolation region, with matching reconstruction metadata. They are not traced inside an enclosure.
- Independent final-source BVH checks verify stored positions, cabinet keepouts, PC-case interior, all bathroom opaque/glass meshes, required privacy walls and floor/bath isolation.
- Stationary opaque PC geometry is retained. All nine dynamic PC rotor roots and their moving meshes, glass, animated props, fine fur and fixed-camera east/south cutaway walls are excluded. Privacy walls and loft slabs remain occluders; temporary walkthrough/floor clipping is not applied.
- All five scanned botanical instances remain included, retaining the exact accepted v17 packed RGBA image, 0.5 MASK comparator and double-sided shading. Cycles rays trace the actual leaf alpha.
- Both black controls preserve the original opacity texture/threshold graph in a transparent/black-diffuse mix. They do not turn leaf cards into opaque rectangles.
- Clearance calculations conservatively use full triangle surfaces for cutout cards; the actual lighting transport uses their alpha shader.

## Final source-only evidence

After completion, `source-only-validation-manifest.json` lists hashes of production GI, six EXRs, probe/material/alpha checks and calibration tests. Important reports:

- `final-gi-pair-validation.json`: source/script/reference pairing, samples and transport flags, unchanged lighting/sky/runtime contract, alpha identity, controls and fresh radiance arrays.
- `final-probe-clearance-audit.json`: independent evaluated-source clearance, 40 bathroom probes, privacy walls, cabinet/PC interior and actual opaque/glass inclusion.
- `final-calibration-alpha-audit.json`: all actual light-anchor transforms and scene units compared with accepted v17.
- `final-source-transport-materials.json`: source bathroom and organic material/packed-image fingerprints for canonical runtime pairing.
- `final-radiance-delta.json`: fresh radiance differences from v17 overall and per room volume.

## Limitations

Low-frequency directional probes can leak across thin furniture. Glass caustics, dynamic prop indirect occlusion, and dynamic emissive bounce are omitted. Realtime direct shadows and runtime lighting are separate. These limitations remain explicit in the production metadata.

## Final canonical runtime pair

- Canonical GLB SHA-256: `1f1fcc773da5cf4d44a314d3c5063b8d1a2a1f6486dfe158228eb4abdbb4269e`.
- Lossless Zopfli gzip SHA-256: `7169a4e69d9a0d86829f31f495185951c4f6f1491f6acdb514d290ef7f2c12e4`. Decompression is byte-exact to the canonical GLB. No new bathroom normal quantization was required for final packing.
- All 10 runtime fixture-anchor positions are exact. Living target error is 0.000000109352 m.
- Nine bathroom materials and four organic materials pair, including all five plants and exact alpha. The checker evaluates inherited image/vertex-color multiplication and metallic/roughness factors; constant source roughness verifies all-white runtime packed channels rather than incorrectly requiring an unused source texture.
- `final-runtime-transport-pair.json` and `final-canonical-gi-seal.json` record the accepted pairing. The independent source-only manifest intentionally excludes runtime-specific reports so its scope remains explicit.
- Full mesh equivalence and protected non-bathroom payload preservation are validated separately by the integrator; this light/material seal does not substitute for those checks.

`seal_runtime_gi_v19.py --glb` accepts either raw GLB or gzip-compressed GLB (detected by magic bytes). Model identity is always the decompressed canonical-byte SHA-256. `--gzip` is compared against those same canonical bytes; the shipped compressed-only layout requires no raw GLB file. Both input routes passed validation.
