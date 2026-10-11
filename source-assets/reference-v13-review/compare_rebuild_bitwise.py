import bpy,hashlib,json,numpy as np
from pathlib import Path
P=Path('/workspace/scratch/2ea1830e5ccf/bearroom-model-assets')
def signature(path):
 bpy.ops.wm.open_mainfile(filepath=str(path));bpy.context.view_layer.update();r={}
 for o in bpy.data.objects:
  h=hashlib.sha256();h.update(np.array(o.matrix_local,dtype='<f4').tobytes());h.update((o.parent.name if o.parent else '').encode());meta={'type':o.type}
  if o.type=='MESH':
   v=np.empty((len(o.data.vertices),3),dtype=np.float32);o.data.vertices.foreach_get('co',v.ravel());h.update(v.tobytes());h.update(str([list(p.vertices) for p in o.data.polygons]).encode());h.update(str([m.name for m in o.data.materials]).encode());meta['vertices']=len(v);meta['polygons']=len(o.data.polygons)
   for uv in o.data.uv_layers:
    u=np.empty(len(uv.data)*2,dtype=np.float32);uv.data.foreach_get('uv',u);h.update(uv.name.encode()+u.tobytes())
  elif o.type=='CURVE':
   for s in o.data.splines:
    for p in s.points:h.update(np.array(p.co,dtype='<f4').tobytes())
   h.update(str((o.data.bevel_depth,o.data.bevel_resolution,[m.name for m in o.data.materials])).encode())
  meta['sha256']=h.hexdigest();r[o.name]=meta
 return r
a=signature(P/'bearroom-reference-v13.blend');b=signature('/tmp/bearroom-v13-rebuild-verification.blend');onlya=sorted(set(a)-set(b));onlyb=sorted(set(b)-set(a));changed=[{'name':n,'final':a[n],'rebuilt':b[n]} for n in a.keys()&b.keys() if a[n]!=b[n]]
r={'final':'bearroom-reference-v13.blend','rebuilt':'Clean deterministic build from exact frozen v12 with build_reference_v13.py','objectCount':len(a),'onlyFinal':onlya,'onlyRebuilt':onlyb,'changedObjects':changed,'passed':not(onlya or onlyb or changed),'scope':'Every object parent/local transform; all authored mesh vertex/face data, UV coordinates and material slot names; curve path/bevel/slots. Does not require byte-identical Blender file serialization.'}
(P/'reference-v13-review/rebuild-equivalence.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2))
