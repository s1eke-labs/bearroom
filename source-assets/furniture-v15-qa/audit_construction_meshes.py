"""Read-only closed construction inventory. Baseline comparison separates inherited surfaces from added/changed parts."""
import bpy,sys,json,hashlib
from pathlib import Path
import numpy as np
args=sys.argv[sys.argv.index('--')+1:];source=Path(args[0]).resolve();out=Path(args[1]).resolve();baseline=Path(args[2]) if len(args)>2 else None
bpy.ops.wm.open_mainfile(filepath=str(source));bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get();objects={}
for o in bpy.data.objects:
 root=o
 while root.parent:root=root.parent
 # Furniture can sit under room/group empties. Find its designated root.
 p=o;found=None
 while p:
  if 'furnitureId' in p:found=p.name;break
  p=p.parent
 if not found or o.type not in ['MESH','CURVE']:continue
 ev=o.evaluated_get(dg);me=ev.to_mesh();me.calc_loop_triangles();p=np.empty((len(me.vertices),3));me.vertices.foreach_get('co',p.ravel());t=np.array([x.vertices for x in me.loop_triangles],dtype=np.int32)
 m=np.array(o.matrix_world);w=p@m[:3,:3].T+m[:3,3];_,weld=np.unique(np.round(w,6),axis=0,return_inverse=True);wt=weld[t];edges=np.sort(np.concatenate([wt[:,[0,1]],wt[:,[1,2]],wt[:,[2,0]]]),axis=1);e,counts=np.unique(edges,axis=0,return_counts=True)
 ar=np.linalg.norm(np.cross(w[t[:,1]]-w[t[:,0]],w[t[:,2]]-w[t[:,0]]),axis=1);signedVolume=float(np.einsum('ij,ij->i',w[t[:,0]],np.cross(w[t[:,1]],w[t[:,2]])).sum()/6)
 objects[o.name]={'root':found,'vertices':len(p),'triangles':len(t),'bounds':[w.min(0).tolist(),w.max(0).tolist()],'worldGeometrySha256':hashlib.sha256(w.tobytes()+t.tobytes()).hexdigest(),'boundaryEdgesWeldedAtMicrometre':int((counts==1).sum()),'nonManifoldEdgesWeldedAtMicrometre':int((counts>2).sum()),'zeroAreaTrianglesBelow1e12':int((ar<1e-12).sum()),'signedVolumeM3':signedVolume}
 ev.to_mesh_clear()
r={'source':str(source),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'scope':'Evaluated furniture meshes; welded 1 micrometre topology. Decorative tubes/sheets and meshes split by material can intentionally have boundary edges. Geometry hashes are comparison inventory, not proof of universal self-intersection freedom.','objects':objects}
if baseline:
 old=json.loads(baseline.read_text())['objects'];changed={n:o for n,o in objects.items() if n not in old or old[n]['worldGeometrySha256']!=o['worldGeometrySha256']};r['changedOrAdded']=changed;r['removed']=sorted(set(old)-set(objects));r['changedTopologyReview']=[{'name':n,**o} for n,o in changed.items() if o['boundaryEdgesWeldedAtMicrometre'] or o['nonManifoldEdgesWeldedAtMicrometre'] or o['zeroAreaTrianglesBelow1e12'] or o['signedVolumeM3']<=0]
out.write_text(json.dumps(r,indent=2));print('CONSTRUCTION',len(objects),'changed',len(r.get('changedOrAdded',{})),'topology review',len(r.get('changedTopologyReview',[])))
