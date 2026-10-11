# Bearroom v19 source assets

This GitHub snapshot is restored from the complete published v19 source (commit `eb070d43f1cc602fa32acdeae1fa5c0f58be8f4d`). It preserves the current application, exact runtime, paired GI, editable master and the baselines required to reproduce the current model. Old Site Git history, hosting configuration, generated builds, renders and verification reports are excluded.

## Lossless parts

`packed-manifest.json` lists ordered parts, byte counts, output paths and SHA-256 identities. Each part is at most 8 MiB. Splitting changes no asset bytes and makes large files transferable through the repository connector. No base64 files or lossy conversions are stored.

- `npm run restore:assets`: reconstructs only `public/assets/bearroom.glb.gz`; called automatically before tests and builds.
- `npm run restore:sources`: also reconstructs `bearroom-bathroom-v19.blend`, `bearroom-organic-v17.blend` and `history/runtime-baselines/bearroom-organic-v17.glb.gz`.
- Existing matching files are retained. A differing existing output is rejected, never overwritten.
- Restored copies are ignored by Git. Do not commit duplicate raw GLB/gzip/Blender copies.

The v19 master SHA-256 is `96c4f90312490c45489c64a4f836094a2f80d4a7bd077a093494eac72948d173`. The decoded runtime model SHA-256 is `1f1fcc773da5cf4d44a314d3c5063b8d1a2a1f6486dfe158228eb4abdbb4269e`.

## Model reproduction

After restoring sources, use Blender 4.3.2 plus the Python/NumPy and python-zopfli dependencies documented in the preserved pipeline:

    BATHROOM_RUNTIME_OUT=/tmp/bearroom-v19-runtime bash source-assets/bathroom-v19/build_runtime_v19.sh source-assets/bearroom-bathroom-v19.blend 96c4f90312490c45489c64a4f836094a2f80d4a7bd077a093494eac72948d173

`bathroom-v19/build_bathroom_v19.py` can rebuild the authored bathroom from the included v17 master. `bathroom-v19/gi-rebuild/` contains the fresh-bake pipeline, with `baked-gi-v17/irradiance.json` retained as its reference. Current published GI is `public/assets/baked-gi/irradiance.json`.

Authoring and audit scripts retain their original behavior. Historical scripts for earlier revisions may require their original archived assets/evidence, which are not part of this current snapshot. The complete original Site source remains the historical archive; this snapshot does not claim to reproduce every prior release. Runtime CPU tests use the frozen `recovery/` fixtures, which must remain tracked.

No current model geometry, textures, GI, or interaction behavior is simplified by this transfer. Browser/device visual and performance acceptance is separate from CPU verification.

## Updating the runtime model

Install a genuinely matched model/GI pair with `scripts/update-assets.mjs` as documented in the root README. Before running tests or builds, run `node scripts/pack-runtime-model.mjs` for a read-only validation, then `node scripts/pack-runtime-model.mjs --write` to update the packed runtime representation. The decoded model must match `src/asset-revision.js`; otherwise packing fails before writing. The command preserves the exact gzip bytes, the editable Blender files, and every source-group manifest entry. It writes content-addressed parts before switching the manifest, then removes only obsolete runtime-model parts. Do not run concurrent pack operations.

Run `npm run verify` afterward. Review and commit the new parts, manifest, paired GI and asset revision together. The restored raw model remains ignored. If authoring also changes editable source files, preserve and package those separately before publishing; this command intentionally does not update the source archive. Never change a manifest hash merely to silence a verification failure.
