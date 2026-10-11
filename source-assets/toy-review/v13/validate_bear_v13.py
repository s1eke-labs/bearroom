import bpy,sys,os,json,hashlib,struct,math
from pathlib import Path
BASE=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(BASE))
from refine_bear_reference_v13 import apply_toy
bpy.ops.wm.open_mainfile(filepath=str(BASE/'bearroom-realism.blend'))
roots=['Bear_reference_plush','Bear_desk_plush']
def matrix(o):return [list(v) for v in o.matrix_world]
def unrelated_snapshot():
 result={}
 excluded=set()
 for name in roots:excluded.update(bpy.data.objects[name].children_recursive)
 for o in bpy.data.objects:
  if o in excluded:continue
  h=hashlib.sha256()
  if o.type=='MESH':
   for v in o.data.vertices:h.update(struct.pack('fff',*v.co))
   for p in o.data.polygons:h.update(struct.pack('I'*len(p.vertices),*p.vertices))
  result[o.name]={'type':o.type,'matrix':matrix(o),'parent':o.parent.name if o.parent else None,'mesh':h.hexdigest(),'materials':[m.name if m else None for m in o.data.materials] if o.type=='MESH' else []}
 return result
def toy_hash():
 h=hashlib.sha256()
 for name in roots:
  r=bpy.data.objects[name]
  for o in sorted(r.children_recursive,key=lambda x:x.name):
   h.update(o.name.encode());h.update(json.dumps(matrix(o)).encode())
   for v in o.data.vertices:h.update(struct.pack('fff',*v.co))
   for p in o.data.polygons:h.update(struct.pack('I'*len(p.vertices),*p.vertices))
   for m in o.data.materials:h.update(m.name.encode())
   for uv in o.data.uv_layers:
    h.update(uv.name.encode())
    for entry in uv.data:h.update(struct.pack('ff',*entry.uv))
 return h.hexdigest()
before=unrelated_snapshot();rootMatrices={n:matrix(bpy.data.objects[n]) for n in roots}
r1=apply_toy();h1=toy_hash();after1=unrelated_snapshot()
assert before==after1,'Unrelated objects changed'
r2=apply_toy();h2=toy_hash();after2=unrelated_snapshot()
assert before==after2,'Unrelated objects changed on second apply'
assert h1==h2,'Reapply is not geometry/material/UV idempotent'
assert rootMatrices=={n:matrix(bpy.data.objects[n]) for n in roots}
result={'status':'pass','sourceMasterUnchanged':True,'unrelatedObjectCount':len(before),'rootMatricesUnchanged':True,'idempotentGeometryMaterialUV':True,'firstHash':h1,'secondHash':h2,'roots':{}}
for name in roots:
 r=bpy.data.objects[name];obs=[o for o in r.children_recursive if o.type=='MESH']
 pts=[o.matrix_world@v.co for o in obs for v in o.data.vertices]
 mats=sorted(set(m.name for o in obs for m in o.data.materials))
 for o in obs:
  assert all(math.isfinite(c) for v in o.data.vertices for c in v.co)
  for m in o.data.materials:
   for n in m.node_tree.nodes:
    if n.type=='NORMAL_MAP':assert n.uv_map in o.data.uv_layers
 head=next(o for o in obs if 'head_sewn_front_panel' in o.name)
 assert head.data.color_attributes.get('ToyFabricTint')
 result['roots'][name]={'scale':list(r.scale),'boundsWorld':{'min':[min(p[a] for p in pts) for a in range(3)],'max':[max(p[a] for p in pts) for a in range(3)]},'heightM':max(p.z for p in pts)-min(p.z for p in pts),'materials':mats,'runtimeMaterialPrimitives':len(mats),'triangles':sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in obs)}
result['supportContacts']=r2['supportContacts']
output=BASE/'toy-review/v13/bear-v13-validated.blend';bpy.ops.wm.save_as_mainfile(filepath=str(output),compress=True)
(BASE/'toy-review/v13/validation.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
