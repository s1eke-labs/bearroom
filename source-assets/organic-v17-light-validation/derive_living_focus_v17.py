"""Derive approved bounds-center focus from the exact reported rigid bear pose."""
import bpy,sys,pathlib,json,hashlib,importlib.util
import numpy as np
from mathutils import Matrix
base,source,script,reference,fitpath,out=map(pathlib.Path,sys.argv[sys.argv.index('--')+1:])
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
basehash=sha(base);sourcehash=sha(source);fit=json.loads(fitpath.read_text());ref=json.loads(reference.read_text())
def collect(path):
 bpy.ops.wm.open_mainfile(filepath=str(path));root=bpy.data.objects['Bear_reference_plush'];dg=bpy.context.evaluated_depsgraph_get();children={}
 for o in root.children_recursive:
  h=hashlib.sha256();record={'matrixLocal':[float(q) for row in o.matrix_local for q in row],'type':o.type}
  if o.type in {'MESH','CURVE'}:
   e=o.evaluated_get(dg);me=e.to_mesh();vs=np.empty(len(me.vertices)*3,dtype=np.float32);me.vertices.foreach_get('co',vs);loops=np.empty(len(me.loops),dtype=np.int32);me.loops.foreach_get('vertex_index',loops);h.update(vs.tobytes());h.update(loops.tobytes())
   for layer in me.uv_layers:
    uvs=np.empty(len(layer.data)*2,dtype=np.float32);layer.data.foreach_get('uv',uvs);h.update(uvs.tobytes())
   record['geometryHash']=h.hexdigest();record['materials']=[m.name if m else None for m in o.data.materials];e.to_mesh_clear()
  children[o.name]=record
 return {'rootMatrix':[list(row) for row in root.matrix_world],'children':children}
old=collect(base);new=collect(source);issues=[]
changes=[{'object':name,'fields':[k for k in a if a[k]!=new['children'].get(name,{}).get(k)],'matrixLocalMaxError':float(np.max(np.abs(np.array(a['matrixLocal'])-np.array(new['children'].get(name,a)['matrixLocal']))))} for name,a in old['children'].items() if a!=new['children'].get(name)]
invalid_changes=[x for x in changes if any(k!='matrixLocal' for k in x['fields']) or x['matrixLocalMaxError']>1e-6]
if invalid_changes or old['children'].keys()!=new['children'].keys():issues.append('Bear descendant local transforms/geometry/UV/material assignments changed beyond float tolerance')
for expected,actual,label in [(fit['oldRootMatrix'],old['rootMatrix'],'baselineRoot'),(fit['newRootMatrix'],new['rootMatrix'],'newRoot')]:
 if np.max(np.abs(np.array(expected)-np.array(actual)))>1e-6:issues.append('Bear root does not match approved fit: '+label)
if np.max(np.abs(np.array(fit['worldTransform'])@np.array(old['rootMatrix'])-np.array(new['rootMatrix'])))>1e-6:issues.append('Bear world transform differs from approved fit')
spec=importlib.util.spec_from_file_location('bake',script);bake=importlib.util.module_from_spec(spec);spec.loader.exec_module(bake);scene,sources,excluded,emissions=bake.prepare_scene(ref,96);lights,actual=bake.configure_lights(ref);previous=next(l for l in ref['lights']['lamps'] if l['name']=='living')['target'];current=next(l for l in actual['lamps'] if l['name']=='living')['target'];delta=[current[i]-previous[i] for i in range(3)];calibration=bake.validate_light_calibration(actual,ref['lights'],delta)
if sha(source)!=sourcehash or sha(base)!=basehash:issues.append('Source changed during read-only audit')
report={'passed':not issues,'sourceSha256':sourcehash,'baselineSourceSha256':basehash,'fitReportSha256':sha(fitpath),'rootWorldTransformReportMatches':not issues,'bearDescendantsChecked':len(new['children']),'descendantGeometryUVMaterialsBitExact':not any(any(k!='matrixLocal' for k in x['fields']) for x in changes),'descendantTransformsWithinFloatTolerance':not invalid_changes,'localTransformTolerance':1e-6,'maxLocalTransformFloatError':max((x['matrixLocalMaxError'] for x in changes),default=0),'lightCalibrationAudit':calibration,'allowedLivingTargetDeltaRuntimeXYZ':delta,'differencesBeyondTolerance':invalid_changes,'issues':issues}
out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if issues:raise RuntimeError('Rigid-bear focus derivation failed')
