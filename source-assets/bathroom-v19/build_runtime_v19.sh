#!/usr/bin/env bash
# Final-only source export and exact packing. Leaves all input sources unchanged.
set -euo pipefail
if [[ $# != 2 ]]; then echo 'Usage: build_runtime_v19.sh FINAL.blend FROZEN_SHA256' >&2; exit 2; fi
BASE="$(cd "$(dirname "$0")" && pwd)"
if [[ -d "$BASE/../bearroom-current-project" ]]; then
  PROJECT="$BASE/../bearroom-current-project"
  PRIOR="$BASE/../bearroom-v17-source-persistence"
  BASELINE="$BASE/runtime/baseline-v17.glb.gz"
else
  PROJECT="$(cd "$BASE/../.." && pwd)"
  PRIOR="$BASE/.."
  BASELINE="$PRIOR/history/runtime-baselines/bearroom-organic-v17.glb.gz"
fi
SOURCE="$(realpath "$1")"; SHA="$2"; OUT="${BATHROOM_RUNTIME_OUT:-$BASE/runtime}"
[[ "$(sha256sum "$SOURCE" | cut -d' ' -f1)" == "$SHA" ]]
mkdir -p "$OUT"
printf '%s  %s\n' "$SHA" "$SOURCE" > "$OUT/export-source.sha256"
blender -b --factory-startup --python-exit-code 1 --python "$BASE/export_bathroom_runtime_v19.py" -- "$SOURCE" "$OUT/bearroom-bathroom-v19-raw.glb" > "$OUT/export.log" 2>&1
python "$PRIOR/compact_recovered_runtime.py" "$OUT/bearroom-bathroom-v19-raw.glb" "$OUT/bearroom-bathroom-v19-compact.glb" --restore-unchanged-source "$BASELINE" | tee "$OUT/compact.log"
python "$PROJECT/scripts/deduplicate-images.py" "$OUT/bearroom-bathroom-v19-compact.glb" "$OUT/bearroom-bathroom-v19-images.glb" | tee "$OUT/dedup.log"
python "$PROJECT/scripts/verify-image-dedup.py" "$OUT/bearroom-bathroom-v19-compact.glb" "$OUT/bearroom-bathroom-v19-images.glb" "$OUT/image-equivalence.json" | tee "$OUT/image-equivalence.log"
python "$PROJECT/scripts/compact-exact-buffers.py" "$OUT/bearroom-bathroom-v19-images.glb" "$OUT/bearroom-bathroom-v19-float.glb" | tee "$OUT/compact-exact-first.log"
# This retained, previously approved step affects only organic NORMAL/TANGENTs.
# It leaves bathroom normals, float cloth positions, UVs and all other data exact.
python "$PROJECT/scripts/quantize-runtime-directions.py" "$OUT/bearroom-bathroom-v19-float.glb" "$OUT/bearroom-bathroom-v19-normals.glb" --scope organic --approved-organic-runtime | tee "$OUT/normal-quantization.log"
python "$PROJECT/scripts/compact-exact-buffers.py" "$OUT/bearroom-bathroom-v19-normals.glb" "$OUT/bearroom-bathroom-v19.glb" | tee "$OUT/compact-exact-final.log"
/usr/bin/python3 "$PROJECT/scripts/optimize-gzip.py" "$OUT/bearroom-bathroom-v19.glb" "$OUT/bearroom-bathroom-v19.glb.gz" --iterations 15 | tee "$OUT/gzip.log"
[[ "$(sha256sum "$SOURCE" | cut -d' ' -f1)" == "$SHA" ]]
sha256sum "$SOURCE" "$OUT/bearroom-bathroom-v19.glb" "$OUT/bearroom-bathroom-v19.glb.gz"
