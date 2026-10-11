import bpy,sys,math,json
import numpy as np
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
from pathlib import Path
P=Path(__file__).resolve().parent.parent;sys.path.insert(0,str(P));import rebuild_soft_furniture_v17 as soft
bpy.ops.wm.open_mainfile(filepath=str(P/'bearroom-pc-v16.blend'));soft.apply_soft_v17();bpy.context.view_layer.update()
feet=[bpy.data.objects[n] for n in ['bear_foot_L_soft','bear_foot_R_soft']];points=[np.array([o.matrix_world@v.co for v in o.data.vertices],dtype=float) for o in feet];anchors=[p[np.argmin(p[:,2])] for p in points];pivot=np.mean(anchors,axis=0)
vs=[];fs=[]
for o in bpy.data.objects:
 if o.type=='MESH' and o.name.startswith('sofa_v17_seat_'):
  off=len(vs);vs.extend(o.matrix_world@v.co for v in o.data.vertices);fs.extend(tuple(off+i for i in p.vertices) for p in o.data.polygons)
tree=BVHTree.FromPolygons(vs,fs);results=[]
for deg in np.linspace(-8,8,65):
 rot=np.array(Matrix.Rotation(math.radians(deg),3,'Y'));q=[(p-pivot)@rot.T+pivot for p in points];low=[p[np.argmin(p[:,2])] for p in q]
 for dx in np.linspace(-.080,.080,161):
  shifts=[]
  for a in low:
   hit,n,i,d=tree.ray_cast(Vector((float(a[0]+dx),float(a[1]),1)),Vector((0,0,-1)),1)
   if hit is None:break
   shifts.append(hit.z-a[2])
  if len(shifts)!=2:continue
  error=abs(shifts[0]-shifts[1]);dz=sum(shifts)/2+.0001
  if error<.0005:
   objective=dx*dx+dz*dz+(math.radians(deg)*.40)**2
   results.append((objective,error,float(dx),float(dz),float(deg)))
results.sort();print('BEST',results[:10],flush=True)
best=results[0];_,error,dx,dz,deg=best;root=bpy.data.objects['Bear_reference_plush'];old=root.matrix_world.copy();rotation=Matrix.Rotation(math.radians(deg),4,'Y');transform=Matrix.Translation(Vector((dx,0,dz)))@Matrix.Translation(Vector(pivot))@rotation@Matrix.Translation(-Vector(pivot));new=transform@old
record={'worldTransform':list(map(list,transform)),'oldRootMatrix':list(map(list,old)),'newRootMatrix':list(map(list,new)),'rootTranslationDelta':list(new.translation-old.translation),'footPivotWorld':pivot.tolist(),'footPivotTranslation':[dx,0,dz],'worldYRotationDegrees':deg,'soleHeightMismatch':error,'geometryUnchanged':True}
(P/'soft-v17-work/bear-rigid-fit.json').write_text(json.dumps(record,indent=2));print(json.dumps(record,indent=2))
