#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(dirname "$DIR")"
SOURCE="${1:?Pass the canonical frozen source blend}"
SOURCE="$(realpath "$SOURCE")"
FROZEN_SHA="${2:?Pass the integrator-approved final SHA-256}"
# Workspace: ROOT/bearroom-v17-source-persistence. Persisted bundle: ROOT itself.
if [[ -f "$ROOT/bearroom-v17-source-persistence/baked-gi-v17/irradiance.json" ]]; then
 DEFAULT_BASE="$ROOT/bearroom-v17-source-persistence"
 DEFAULT_GI="$DIR/baked-gi-v20"
else
 DEFAULT_BASE="$ROOT"
 DEFAULT_GI="$ROOT/baked-gi-v20"
fi
GI="${3:-$DEFAULT_GI}"
BASE="${4:-$DEFAULT_BASE}"
GI="$(realpath -m "$GI")"
BASE="$(realpath "$BASE")"
PREVIOUS_SOURCE="${5:-$BASE/bearroom-bathroom-v19.blend}"
SCRIPT="$DIR/gi-rebuild/bake_indirect_v20.py"
AUDIT="$DIR/light-validation"
[[ "$(sha256sum "$SOURCE" | cut -d' ' -f1)" == "$FROZEN_SHA" ]]
# No existing production output is silently overwritten.
[[ ! -e "$GI/irradiance.json" ]] || { echo "Existing v20 production output; preserve it before rerunning." >&2; exit 1; }
blender -b --factory-startup --python-exit-code 1 --python "$AUDIT/preflight_probe_placement_v20.py" -- "$SOURCE" "$SCRIPT" "$BASE/baked-gi-v17/irradiance.json" "$AUDIT/final-preflight-probe-placement.json" > "$AUDIT/final-preflight-probe-placement.log" 2>&1
blender -b --factory-startup --python-exit-code 1 --python "$AUDIT/audit_light_calibration_v20.py" -- "$BASE/bearroom-organic-v17.blend" "$SOURCE" "$BASE/baked-gi-v17/irradiance.json" "$SCRIPT" "$AUDIT/final-calibration-alpha-audit.json" > "$AUDIT/final-calibration-alpha-audit.log" 2>&1
blender -b --factory-startup --python-exit-code 1 --python "$SCRIPT" -- --source "$SOURCE" --expected-source-sha256 "$FROZEN_SHA" --reference "$BASE/baked-gi-v17/irradiance.json" --output "$GI" --samples 96 --control-samples 32 > "$DIR/gi-rebuild/bake-v20-final.log" 2>&1
python "$AUDIT/validate_gi_pair_v20.py" --source "$SOURCE" --gi "$GI/irradiance.json" --baseline "$BASE/baked-gi-v17/irradiance.json" --script "$SCRIPT" --output "$AUDIT/final-gi-pair-validation.json" > "$AUDIT/final-gi-pair-validation.log" 2>&1
blender -b --factory-startup --python-exit-code 1 --python "$AUDIT/audit_probe_clearance_v20.py" -- "$SOURCE" "$GI/irradiance.json" "$SCRIPT" "$AUDIT/final-probe-clearance-audit.json" > "$AUDIT/final-probe-clearance-audit.log" 2>&1
blender -b --factory-startup --python-exit-code 1 --python "$AUDIT/audit_transport_materials_v20.py" -- "$SOURCE" "$AUDIT/final-source-transport-materials.json" > "$AUDIT/final-source-transport-materials.log" 2>&1
blender -b --factory-startup --python-exit-code 1 --python "$AUDIT/audit_frozen_focus_v20.py" -- --previous-source "$PREVIOUS_SOURCE" --source "$SOURCE" --baseline "$BASE/baked-gi-v17/irradiance.json" --gi "$GI/irradiance.json" --output "$AUDIT/final-frozen-focus-audit.json" > "$AUDIT/final-frozen-focus-audit.log" 2>&1
blender -b --factory-startup --python-exit-code 1 --python "$AUDIT/audit_raw_bake_v20.py" -- --gi "$GI/irradiance.json" --output "$AUDIT/final-raw-bake-audit.json" > "$AUDIT/final-raw-bake-audit.log" 2>&1
for kind in light radiance; do
 blender -b --factory-startup --python-exit-code 1 --python "$DIR/gi-rebuild/test_${kind}_units.py" > "$AUDIT/test-${kind}-units.log" 2>&1
done
python "$AUDIT/summarize_evidence_v20.py" --source "$SOURCE" --gi "$GI/irradiance.json" --baseline "$BASE/baked-gi-v17/irradiance.json"
[[ "$(sha256sum "$SOURCE" | cut -d' ' -f1)" == "$FROZEN_SHA" ]]
echo "Frozen v20 source-only GI validation complete. Runtime pairing remains separate."
