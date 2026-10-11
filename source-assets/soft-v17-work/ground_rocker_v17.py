import bpy,json,hashlib,sys
from pathlib import Path
from mathutils import Matrix
P=Path(__file__).resolve().parent.parent;sys.path.insert(0,str(P));from rebuild_soft_furniture_v17 import digest
src=P/'bearroom-organic-v17.blend';dst=P/'bearroom-organic-v17-grounded.blend';assert hashlib.sha256(src.read_bytes()).hexdigest()=='5c6bd204e4b7395b8a5ae49250f7c515f1bee3efb1b01b94c51a249d44db5c07'
bpy.ops.wm.open_mainfile(filepath=str(src));before={o.name:digest(o) for o in bpy.data.objects};root=bpy.data.objects['F16_reading_rocker'];oldbasis=root.matrix_basis.copy();oldworld=root.matrix_world.copy();oldprops=str(dict(root.items()));root.location.z-=.022;bpy.context.view_layer.update();newbasis=root.matrix_basis.copy();newworld=root.matrix_world.copy();assert str(dict(root.items()))==oldprops
for o in bpy.data.objects:
 if o.name!='F16_reading_rocker':assert digest(o)==before[o.name],o.name
report={'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'root':'F16_reading_rocker','oldRootBasis':list(map(list,oldbasis)),'newRootBasis':list(map(list,newbasis)),'oldRootMatrix':list(map(list,oldworld)),'newRootMatrix':list(map(list,newworld)),'worldTranslationDeltaBlenderXYZ':list(newworld.translation-oldworld.translation),'runtimeTranslationDeltaXYZ':[0,-.022,0],'unchangedObjectData':len(before)-1,'rootCustomPropertiesUnchanged':True,'scope':'Exactly22mm rigid downward translation; every local mesh/curve/material/relative stored transform unchanged. Existing±1.5degree animation retained.'}
bpy.ops.wm.save_as_mainfile(filepath=str(dst),compress=True);report['outputSha256']=hashlib.sha256(dst.read_bytes()).hexdigest();report['outputBytes']=dst.stat().st_size;(P/'soft-v17-work/rocker-rigid-grounding.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
