"""Rebuild the v12 authoring master from verified production v11 recovery.
Uses recovered-v11.blend, its exact precision-restoration data, and deterministic
furniture/toy patches. No room-placement substitutions from earlier versions.
"""
import bpy,os,sys
OUT=os.path.dirname(os.path.abspath(__file__));sys.path.insert(0,OUT)
bpy.ops.wm.open_mainfile(filepath=OUT+'/recovered-v11.blend')
from recovery_precision import apply_recovery_precision
from recover_furniture_components import recover_components
from refine_furniture_realism import apply_furniture_realism
from refine_toy_geometry import apply_toy_realism
from apply_reviewed_cloth import apply_reviewed_cloth
apply_recovery_precision();recover_components();apply_furniture_realism();apply_reviewed_cloth();apply_toy_realism()
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/bearroom-realism.blend',compress=True)
print('REALISM_MASTER_COMPLETE',OUT+'/bearroom-realism.blend')
