"""Read-only independent extraction of the complete bathroom scope, evaluated in Blender."""
import bpy,sys,json,hashlib
from pathlib import Path
import numpy as np
source,out=map(Path,sys.argv[sys.argv.index('--')+1:][:2])
source_sha=hashlib.sha256(source.read_bytes()).hexdigest()
bpy.ops.wm.open_mainfile(filepath=str(source.resolve()));bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
C=np.array([[1,0,0],[0,0,1],[0,-1,0.]])
def selected(o):
    if o.name=='Architecture__plaster_warm_white' or o.name=='cutaway_bathroom_rear_privacy' or o.name.startswith('bath19_'):return True
    p=o
    while p:
        if p.name in ['F20_vanity','Bathroom_architecture','bathroom_door_hinge']:return True
        p=p.parent
    return False
triangles=[];normals=[];objects=[]
for o in bpy.data.objects:
    if o.type not in ['MESH','CURVE'] or not selected(o):continue
    ev=o.evaluated_get(dg);me=ev.to_mesh();me.calc_loop_triangles()
    p=np.empty((len(me.vertices),3));me.vertices.foreach_get('co',p.ravel());m=np.array(o.matrix_world)
    world=(p@m[:3,:3].T+m[:3,3])@C.T
    ids=np.array([tuple(t.vertices) for t in me.loop_triangles]);ls=np.array([tuple(t.loops) for t in me.loop_triangles])
    ns=np.array([tuple(n.vector) for n in me.corner_normals])[ls]@np.linalg.inv(m[:3,:3]);ns/=np.maximum(np.linalg.norm(ns,axis=2)[:,:,None],1e-30);ns=ns@C.T
    triangles.append(world[ids]);normals.append(ns)
    objects.append({'name':o.name,'triangles':len(ids),'bounds':[world.min(0).tolist(),world.max(0).tolist()]})
    ev.to_mesh_clear()
out.parent.mkdir(parents=True,exist_ok=True);np.savez_compressed(out.with_suffix('.npz'),triangles=np.concatenate(triangles),normals=np.concatenate(normals))
assert hashlib.sha256(source.read_bytes()).hexdigest()==source_sha,'Source changed during read-only extraction'
meta={'source':str(source),'sourceSha256':source_sha,'fixtureSha256':hashlib.sha256(out.with_suffix('.npz').read_bytes()).hexdigest(),'objects':objects,'triangles':sum(o['triangles'] for o in objects)}
out.with_suffix('.json').write_text(json.dumps(meta,indent=2));print(json.dumps({k:v for k,v in meta.items() if k!='objects'},indent=2))
