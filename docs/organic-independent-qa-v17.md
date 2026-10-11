# Organic v17 independent QA

Verdict: PASS for this revision’s offline source/export and CPU verification scope. No new blockers.

## Final identities
- Editable grounded source: `822b7ad9bda89889530dae32efaf5ecde831c991f6994bed97b7a8c02227afc4`
- Actual shipped GLB: `b294de08c3b0cdf4a1db5c144e6a42d66d6ac5129fc65c872fcef4977a3e75a7`
- Installed GI: `107ef50f0ec636d401df4631133ea0061ef14944ab2c325c16b39ea072962971`; recorded source matches the grounded source.
- Public and built distribution model bytes both match the exact reviewed GLB.

## Verified
- One-to-one oriented geometry correspondence for all 642,396 static scene triangles, including architecture and context, plus all three animated cloth meshes at negative/rest/positive extrema. Maximum world-vertex error: 1.411 µm.
- All 94,092 changed static triangle normals match; maximum corner-normal difference is 0.0168 degrees. The entire rocker subtree was compared to actual evaluated final-source geometry and normals, not merely its nominal root delta.
- Independent JSON/BIN comparison: only F16 root Y changes; all binary bytes and all other JSON values stay exact.
- Protected runtime nodes, PC, piano and unrelated geometry remain checked. Main bear’s 255-node local authored data is exact under its one authorized rigid root move. Rocker’s 15-node subtree moves down22mm only.
- Full sofa/bed/dining cloth motion and duvet triangle interiors: zero support intersections. Main bear sole clearances are approximately−0.30mm and+0.50mm. Rocker runners retain approximately0.89–2.00mm floor clearance over301 sampled animation phases.
- Five original plant positions/planters retained. Curved leaves use a real binary-alpha atlas, MASK0.5, two-sided opaque cutout rendering, normal/roughness maps and no transmission. Only1900 existing soil faces change material.
-35/35 independent final-GLB tests passed, covering real routes/stairs/bathroom/all88keys, cloth, asset protection and PC checks. Reviewed parent/integration complete verification logs also pass108/108.
- Final static distribution: 20,919,947 B; 51,573 B below20MiB. This is not a GPU-memory or FPS measurement.

## Visual review
Actual reference pixels, same-camera sofa iterations, all five plant placements, source/export chair pair, final eye-level furniture, and grounded final overview were inspected. Connected upholstery, sewn edging, filled cushions with restrained compression, supported drape and thin scanned foliage resolve the targeted primitive-block appearance. Exact822b grounded rocker and overview images are under the paths in FINAL-QA.json. Sofa/office images keep truthful pre-grounding metadata; their subject geometry is independently unchanged.

## Explicit limitations
- No real supported-browser WebGL verification was available, and no bypass was used. No live GPU, FPS, device-memory, mobile-input or acoustic acceptance is claimed.
- Cycles/AgX inspection is modeling evidence and does not reproduce runtime rendering/GI exactly.
- The extra all-legacy-normal diagnostic found213 nondegenerate protected legacy triangles with pre-existing source/export corner-normal differences across six unchanged kitchen/pot/piano nodes. All are protected exact versus v16.2327 zero-area legacy triangles have no meaningful surface normal. These are inherited, introduce no new visible change in this revision, and are not a release blocker. No legacy-normal fix was attempted.
- Generic ground rays contain inherited non-target rug/furniture penetrations. They remain outside this narrowly scoped revision.

See FINAL-QA.json for exact coverage, identities, artifact paths and evidence.
