# v20: seated plush and case display power

## Runtime and editable source

- Frozen editable master: `source-assets/bearroom-seated-v20.blend`, 22,627,321 bytes; SHA-256 `a52b85508b36419f019ab3afc0a684aad2641124412a9b4955747c0413fcc041`.
- Decoded runtime: 34,733,200 bytes; SHA-256 `1dd9a211538747e36a0e132f78cdfb50c6248ea08be5fd31273c2b430bed258c`.
- Shipped gzip: 17,538,872 bytes; SHA-256 `5527e5d8e340f5e96b5c3b2c011bca96262a3946f95012037e39f4428bde7e57`.
- Fresh indirect/sky GI: 104,856 bytes; SHA-256 `89303bdab076205d294920d02eb2caa4fccb8367c57533f78180fd8f3ac1edd6`.
- Complete distribution: 19,799,512 bytes; 1,172,008 bytes of the 20 MiB budget remain. The 1 MiB CI safety threshold remains enforced.

The v19 master and its actual bake-source identity remain intact. The new master is kept in three SHA-256-checked source parts and restored with `npm run restore:sources`; there is no tracked duplicate raw GLB/gzip/Blender file. The old source is a necessary deterministic authoring baseline, not a second current master.

## Pose boundary and review

The sofa bear now rests on its lower stuffed body with feet forward and an 8-degree backward lean. Lower-body stuffing follows the actual unmodified cushion rather than moving the whole standing bear through it. The root remains fixed. 1,746 unrelated source objects, materials, textures, mesh topology, vertex order, UVs and colors stay unchanged. Face/head-panel and embroidery mesh bytes remain exact; they receive one shared rigid transform. Nap follows its original bound sewn surfaces.

The authoring checks find 345 body vertices within 0.40 mm of the cushion, spanning approximately 76 × 65 mm. Minimum vertex clearance is approximately 0.30 mm. All bear geometry, including 17,191 nap triangles, was checked against evaluated sofa meshes and seam curves: zero intersecting surface triangles. Under a uniform-relative-stuffing-density approximation, the projected center lies inside the support polygon with a 5.18 mm minimum margin. This is a geometry sanity check, not measured real-world mass/friction physics.

Blender 4.3.2 CPU Cycles front, side, three-quarter and sofa-context images were actually inspected. They show buttock support and forward feet without changing face identity. These neutral-studio offline images are not browser screenshots or evidence of WebGL/device performance.

Runtime integration changes only six POSITION/NORMAL buffer views in three named bear meshes and ten explicit JSON fields. Face geometry, all index/UV/color data, materials, textures and unrelated nodes remain exact. Every indexed runtime bear world vertex agrees with the reviewed source export to at most 0.000000169 m. The face's original exact normals are retained rather than accepting tiny exporter join roundoff.

`recovery/seated-bear-pose.json` is a bounded reversible certificate: it checks the new complete model/source identities, enumerates only the reviewed changes, and restores the exact pre-pose GLB SHA `8a1a2c47…`. Existing organic/bathroom/material/PNG proofs then run on that exact historical representation. No historical snapshot or broad subtree exemption was rewritten.

## Lighting

Fresh Cycles indirect and sky baking ran for the actual frozen new master, using the existing 160 probes, 256×256 atlas, three 96-sample endpoints and three 32-sample controls. Independent raw-EXR checks reproduce all final six-decimal radiance arrays. This is genuinely rebaked data, not a relabelled old bake.

The old living spotlight target `[-0.9424259662628174, 0.9112450480461121, 1.8003298044204712]` is fixed in both runtime and baking. A shorter seated bear must not implicitly redirect the room's lamp through a changed bounding-box center. Other light parameters remain unchanged. See the portable GI reproduction and validation scripts under `source-assets/seated-bear-v20`.

## Case power

Power-off retains a solid, opaque, pure-black screen mesh and stops clock reads, canvas painting and texture uploads. Day/night or a late forced refresh cannot turn it back on. Power-on immediately redraws the current local time even within the same minute or when off-screen. Material swaps preserve current cutaway planes. The separate desktop monitor slideshow is unaffected. Disposal and repeated power toggles are guarded.

## Acceptance

Clean install and full verification pass 228 CPU tests, asset contracts, production build and budget. Tests cover screen power, restoration, strict pose/tamper proof and actual light-target creation. Actual browser/mobile rendering and interaction were not executed; no FPS or live-device visual improvement is claimed.
