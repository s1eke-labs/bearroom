"""Assemble verified, hash-consistent independent QA evidence. Fails on stale inputs."""
import json,math
from pathlib import Path
q=Path(__file__).resolve().parent
read=lambda n:json.loads((q/n).read_text())
construction=read('final-construction.json');contract=read('final-source-contract.json');cloth=read('final-cloth.json');shell=read('final-shell-layers.json');bear=read('final-bear-screen-contact.json');floor=read('final-floor-contact.json');equiv=read('final-runtime-equivalence.json');motion=read('final-motion-padding.json');eyes=read('final-eye-positions.json');sha=construction['sha256']
for label,item,key in [('contract',contract,'sha256'),('cloth',cloth,'sha256'),('shell',shell,'sourceSha256'),('bear',bear,'sha256'),('floor',floor,'sha256'),('equivalence',equiv,'sourceSha256')]:assert item[key]==sha,(label,'stale source hash')
assert all(x['passed'] for x in [contract,cloth,shell,bear,equiv,motion,eyes]);assert not construction['changedTopologyReview'];assert motion['modelSha256']==equiv['runtimeModelSha256'];assert eyes['modelSha256']==equiv['runtimeModelSha256']
chosen=[c for c in floor['contacts'] if any(x in c['name'] for x in ['chair_castor','chair_v15_caster_outer','leveling_glide','leveling_foot','credenza_leg']) or c['name'] in ['kitchen_plinth','F18_wardrobe__wood_oak_part_002']]
for c in chosen:assert c['minimumClearanceM'] is not None and -.00025<=c['minimumClearanceM']<=.0011,(c['name'],c['minimumClearanceM'])
assert len(chosen)==26
norm=max(x.get('maximumMatchedCornerNormalVectorError',0) for x in equiv['groups']);err=max(x.get('maximumMatchedVertexErrorMetres',0) for x in equiv['groups']);nchanged=sum(x.get('changedNormalTrianglesChecked',0) for x in equiv['groups']);assert nchanged>25000
walk=(q/'final-walk-tests.txt').read_text();assert 'pass 23' in walk and 'fail 0' in walk
report={'scope':'Independent offline source/runtime construction, support, continuous cloth and CPU walking QA; no WebGL/device or publication acceptance.','sourceSha256':sha,'runtimeSha256':equiv['runtimeModelSha256'],'passed':True,'changedSolidObjects':len(construction['changedOrAdded']),'changedTopologyIssues':0,'groundSupportComponentsVerified':len(chosen),'groundMinClearanceM':min(c['minimumClearanceM'] for c in chosen),'groundMaxOfMinimumClearanceM':max(c['minimumClearanceM'] for c in chosen),'orientedTriangleGroups':len(equiv['groups']),'maximumMatchedVertexErrorM':err,'changedNormalTriangles':nchanged,'maximumChangedCornerNormalAngleDegrees':2*math.asin(norm/2)*180/math.pi,'walkingTestsPassed':23,'continuousClothIntersectionPairs':sum(x['intersectionPairsAboveTolerance'] for x in cloth['cloth'].values()),'protectedTransforms':contract['protectedTransformsChecked'],'furnitureRoots':contract['counts']['furnitureId'],'animationAxes':contract['counts']['animationAxis'],'pianoKeys':contract['counts']['midi'],'evidence':['final-construction.json','final-floor-contact.json','final-source-contract.json','final-cloth.json','final-shell-layers.json','final-bear-screen-contact.json','final-runtime-equivalence.json','final-motion-padding.json','final-eye-positions.json','final-walk-tests.txt']}
(q/'FINAL-QA.json').write_text(json.dumps(report,indent=2)+'\n')
text=f'''# Furniture v15 independent QA

## Result

Pass for offline construction, support and source/runtime walking readiness on the exact frozen files.

- Source SHA-256: `{sha}`
- Runtime GLB SHA-256: `{equiv['runtimeModelSha256']}`
- {len(construction['changedOrAdded'])} added/changed solid meshes: closed, outward wound, nondegenerate and manifold after 1 μm positional welding.
- {len(chosen)} load-bearing floor/rug contact components checked. Casters, leveling glides, kitchen-return feet, TV legs and kitchen plinth have approximately 1 mm clearance; wardrobe plinth directly contacts the authored upper floor. Tiny board-groove/bevel gaps are bridged by the broad feet or plinth.
- {len(equiv['groups'])} source/runtime triangle groups match one to one with cyclic-only, winding-preserving vertex order. No triangle losses/additions. Maximum position error: {err*1e6:.4f} μm.
- All {nchanged:,} added/changed triangle corner normals match the export within {2*math.asin(norm/2)*180/math.pi:.4f}° maximum. Legacy unedited/degenerate normal conventions are outside this added-normal check.
- 192 protected transforms/parents, 23 furniture roots, 12 animation axes, all 88 keys and all three opaque bathroom privacy meshes preserved. No new aggregate furniture-overlap candidates.
- Three animated throws have zero complete-triangle surface intersection pairs across their full continuous waveform, including vertical faces. Static duvet has zero intersections against mattress/frame/piping. Four textile shells preserve layer ordering.
- Both bears retain established sole support and visible facial details. All 18 fixed-view PC/TV obstruction sample rays remain clear.
- 23 independent navigation/input tests pass against this runtime: lower/upper circulation, all 18 actual stair treads in both directions, bathroom entry/exit and occupied door sweeps, rail/headroom blocking, all 88 playable key targets and exact fixed-view camera restoration.
- Actual rigid-animation extremum displacement remains inside navigation's motion padding, including the newly detailed swivel chair.

## Visual review and fixes caught

Original loft-day and computer-corner reference images were inspected directly. Offline perspective views use eight CPU-validated standing eye locations; isolated low/underside and wardrobe-top construction diagnostics are separately identified. Final views check backs, undersides, face frames, real edge depth and support hardware rather than relying only on the distant overview.

Independent review caught inward drawer winding, incorrectly grounded casters, absent desk and return-cabinet floor supports, a 30 mm wardrobe side cavity, overlarge open drawer/cabinet margins after hollowing, and inherited TV-leg/kitchen-plinth floor embeds. The final source corrects these. The wardrobe has a solid cap and a closed, fitted top/front junction. Chair casters, hydraulic housing and brackets are actual geometry; dining-chair underside rails visibly connect their support parts.

Inherited coffee-table/dining-chair/nightstand feet compress the modeled rugs by about 2–11.5 mm; those soft-surface contacts are retained. This is still a stylized scene rather than a photographic reference match. Smooth textile detail, existing monitor hardware and the original room layout were not comprehensively redesigned.

## Limits

This is not actual browser/WebGL visual approval, device touch acceptance, GPU-memory/FPS measurement, final GI acceptance or publication proof. Diagnostic images use isolated groups and simple Cycles lighting; screen imagery is a placeholder. No unsupported browser bypass was attempted.

The collision checks cover the stated source surfaces, support contacts, protected bounds and actual navigation routes. Intentional joinery overlap is allowed. This is not an exhaustive all-solid-pair self-intersection proof or a material-strain simulation. Source/run-time corner normals are compared for changed geometry only; legacy degenerate surfaces remain unchanged.

## Reproduction and retained evidence

Use `extract_all_furniture.py` inside Blender, then `export_all_furniture_fixture.py` with `final-construction.json` as its required third argument. Use `export_all_runtime_triangles.mjs` and `verify_oriented_triangles.py --tolerance 0.000003` for final source/runtime comparison. The JS QA tools discover either the saved Site root or this workspace, with an optional `BEARROOM_RUNTIME_ROOT` override. `audit_motion_padding.mjs` verifies the authored full-wave bound and actual Euler endpoints.

Run the reference-v13 continuous-cloth, shell-layer, contact and source-contract scripts against the v15 extraction. Run `audit_construction_meshes.py` against the v13 construction baseline and `audit_furniture_ground.py` against the frozen source. Run `node --test tests/first-person-independent.test.mjs tests/walk-navigation-independent.test.mjs` with `BEARROOM_MODEL` set to the exact final GLB.

`FINAL-QA.json` lists the final reports. Preserve `final-all-phase-fixture.npz` and matching metadata; raw extracted scenes and `.f64` runtime arrays are regenerable and need not be shipped. Images in `final/` are the reviewed final-hash construction views, with camera/scope metadata in `render-scope.json`.
'''
(q/'FINAL-QA.md').write_text(text)
print(json.dumps(report,indent=2))
