"""Deterministic contact fit using all projected triangle-overlap extrema.
A uniform upward displacement of a triangle is bounded by its worst affine
clearance over each clipped support footprint, including the animation extreme.
Paired shell vertices always move together to preserve physical cloth thickness.
"""
import bpy, numpy as np, math, json,os
from collections import defaultdict
from mathutils import Vector
EPS=1e-10
def cross(a,b):return a[0]*b[1]-a[1]*b[0]
def area(p):return sum(cross(p[i],p[(i+1)%len(p)]) for i in range(len(p)))*.5 if len(p)>2 else 0

def clip(subject,tri):
 p=[np.asarray(x,dtype=float) for x in subject];sign=1 if area(tri)>=0 else -1
 for i in range(3):
  a,b=tri[i],tri[(i+1)%3];e=b-a;prev=p[-1] if p else None;out=[]
  if prev is None:return []
  dp=sign*cross(e,prev-a)
  for cur in p:
   dc=sign*cross(e,cur-a)
   if (dp>=-EPS)!=(dc>=-EPS):out.append(prev+(cur-prev)*(dp/(dp-dc)))
   if dc>=-EPS:out.append(cur)
   prev=cur;dp=dc
  p=out
 return p

def cells(lo,hi,size=.08):
 a=np.floor(lo/size).astype(int);b=np.floor(hi/size).astype(int)
 for x in range(a[0],b[0]+1):
  for y in range(a[1],b[1]+1):yield x,y

def fit_exact(cloth,supports,amplitude,clearance=.004):
 bpy.context.view_layer.update();o=bpy.data.objects[cloth];me=o.data;dg=bpy.context.evaluated_depsgraph_get();support=[];normal=[]
 for ob in supports:
  ev=ob.evaluated_get(dg);em=ev.to_mesh();em.calc_loop_triangles();v=np.array([list(ev.matrix_world@x.co) for x in em.vertices]);t=np.array([list(x.vertices) for x in em.loop_triangles],dtype=np.int32);st=v[t];n=np.cross(st[:,1]-st[:,0],st[:,2]-st[:,0]);length=np.linalg.norm(n,axis=1);n/=np.maximum(length[:,None],1e-20);sel=n[:,2]>1e-5;support.extend(st[sel]);ev.to_mesh_clear()
 support=np.array(support);lo=support[:,:,:2].min(1);hi=support[:,:,:2].max(1);high=support[:,:,2].max(1);grid=defaultdict(list);sinv=[]
 for i,st in enumerate(support):
  sinv.append(np.linalg.inv(np.vstack((st[:,:2].T,np.ones(3)))))
  for c in cells(lo[i],hi[i]):grid[c].append(i)
 p=np.array([list(o.matrix_world@v.co) for v in me.vertices]);local=np.array([list(v.co) for v in me.vertices]);ymin,ymax=local[:,1].min(),local[:,1].max();edge=ymin+.25*(ymax-ymin);q=np.clip((edge-local[:,1])/(edge-ymin),0,1);w=q*q*(3-2*q)*amplitude;me.calc_loop_triangles();lift=np.zeros(len(p));pairs=0;worst=100.
 for tri in me.loop_triangles:
  ids=np.array(tri.vertices);t=p[ids];xy=t[:,:2]
  if abs(area(xy))<1e-13:continue
  tlo=xy.min(0);thi=xy.max(0);tlow=(t[:,2]-w[ids]).min();inv=np.linalg.inv(np.vstack((xy.T,np.ones(3))));delta=0
  candidates=set(i for c in cells(tlo,thi) for i in grid[c])
  for si in candidates:
   if high[si]<tlow-clearance or np.any(lo[si]>thi+EPS) or np.any(hi[si]<tlo-EPS):continue
   poly=clip(xy,support[si][:,:2])
   if not poly or abs(area(poly))<1e-15:continue
   poly=np.array(poly);b=np.c_[poly,np.ones(len(poly))]@inv.T;sb=np.c_[poly,np.ones(len(poly))]@sinv[si].T;gap=b@(t[:,2]-w[ids])-sb@support[si][:,2];gmin=float(gap.min());worst=min(worst,gmin);pairs+=1;delta=max(delta,clearance-gmin+.0001)
  if delta>0:lift[ids]=np.maximum(lift[ids],delta)
 k=o.get('clothShellPairCount',0)
 if k and len(lift)==2*k:lift[:k]=np.maximum(lift[:k],lift[k:]);lift[k:]=lift[:k]
 invworld=o.matrix_world.inverted_safe()
 for i in np.nonzero(lift>0)[0]:q=Vector(p[i]);q.z+=float(lift[i]);me.vertices[int(i)].co=invworld@q
 me.update();report={'cloth':cloth,'amplitudeM':amplitude,'clearanceTargetM':clearance,'overlapConstraints':pairs,'beforeMinimumM':worst,'liftedVertices':int((lift>0).sum()),'maximumLiftM':float(lift.max()),'p95LiftM':float(np.percentile(lift[lift>0],95)) if np.any(lift>0) else 0,'shellLayersMoveTogether':bool(k)};print('EXACT_CLOTH_FIT',report,flush=True);return report

def fit_all():
 so=[bpy.data.objects[f'F01_sofa__fabric_sofa_boucle_part_{i:03d}'] for i in range(5)];bed=[bpy.data.objects[n] for n in ['bed_mattress','bed_oak_frame','mattress_piping']];r=[]
 r.append(fit_exact('duvet_main',bed,0))
 r.append(fit_exact('anim_sofa_edge',so,.0035))
 r.append(fit_exact('anim_bed_edge',[bpy.data.objects['duvet_main']]+bed,.004))
 r.append(fit_exact('anim_dining_edge',[bpy.data.objects['dining_seat.002']],.0035))
 return r
