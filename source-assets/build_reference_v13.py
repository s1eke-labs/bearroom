"""Reproduce v13 from the frozen, verified v12 authoring master.
No changes are made to the input master. Geometry, exact cloth fitting, toys and
materials are applied in that order. Freeze this compressed output before GI.
"""
import bpy,os,sys,json,hashlib
P=os.path.dirname(os.path.abspath(__file__));sys.path.insert(0,P)
from refine_soft_reference_v13 import apply_soft_reference_v13
from fit_reference_cloth_exact import fit_all
from refine_bear_reference_v13 import apply_toy
from refine_materials_v13 import apply_materials_v13
from finalize_reference_trim import finalize_mattress_piping
src=P+'/bearroom-realism.blend'
assert hashlib.sha256(open(src,'rb').read()).hexdigest()=='5fb12e22903db5b2aa757ae18b3112a80fbb223f45f2193feaaf63c8e441a48e','Wrong v12 master'
bpy.ops.wm.open_mainfile(filepath=src)
apply_soft_reference_v13();r=fit_all();finalize_mattress_piping();apply_toy(include_desk=True);apply_materials_v13()
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
dst=os.path.abspath(args[0]) if args else P+'/bearroom-reference-v13.blend'
bpy.ops.wm.save_as_mainfile(filepath=dst,compress=True)
open(P+'/reference-v13-review/exact-fit-report.json','w').write(json.dumps(r,indent=2))
print('V13_MASTER_SAVED',dst)
