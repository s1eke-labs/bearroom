"""Read-only independent contact + fixed-isometric view obstruction checks."""
import bpy,sys,json,hashlib,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import numpy as np
args=sys.argv[sys.argv.index('--')+1:];source=Path(args[0]).resolve();out=Path(args[1]).resolve();bpy.ops.wm.open_mainfile(filepath=str(source));bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
M={}
for o in bpy.data.objects:
 if o.type not in ['MESH','CURVE'] or o.name.startswith(('plush_fibers_','bear_fiber')):continue
 ev=o.evaluated_get(dg);me=ev.to_mesh();me.calc_loop_triangles();v=[o.matrix_world@x.co for x in me.vertices];tri=[tuple(x.vertices) for x in me.loop_triangles];M[o.name]=(v,tri);ev.to_mesh_clear()
def tree_for(names,lower=False):
 vs=[];fs=[];owners=[]
 for name in names:
  if name not in M:continue
  v,tri=M[name];off=len(vs);vs.extend(v)
  for t in tri:
   if lower and min(v[i].z for i in t)>=2.78:continue
   fs.append(tuple(i+off for i in t));owners.append(name)
 return BVHTree.FromPolygons(vs,fs,all_triangles=True),owners
report={'source':str(source),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'soleContacts':[],'faceVisibility':[],'screenVisibility':[],'scope':'Evaluated source meshes, fixed runtime isometric direction, opaque mesh obstruction rays. Offline only.'}
for root,support in [('Bear_reference_plush','F01_sofa'),('Bear_desk_plush','F08_computer_desk')]:
 r=bpy.data.objects[root];names=[o.name for o in bpy.data.objects[support].children_recursive];tree,owners=tree_for(names)
 for o in r.children_recursive:
  if 'bear_foot_' not in o.name or o.name not in M:continue
  pts=M[o.name][0];bottom=min(pts,key=lambda v:v.z);hit,n,ix,d=tree.ray_cast(bottom+Vector((0,0,.06)),Vector((0,0,-1)),.25);clear=d-.06 if hit is not None else None;near=sorted(pts,key=lambda v:v.z)[:20];ranges=[]
  for p in near:
   hh,nn,ii,dd=tree.ray_cast(p+Vector((0,0,.06)),Vector((0,0,-1)),.25)
   if hh is not None:ranges.append(dd-.06)
  report['soleContacts'].append({'name':o.name,'lowestPointWorld':list(bottom),'support':owners[ix] if hit is not None else None,'lowestPointSignedClearanceM':clear,'nearSole20SamplesMinM':min(ranges) if ranges else None,'nearSole20SamplesMaxM':max(ranges) if ranges else None,'passed':clear is not None and -.005<=clear<=.002})
# Runtime camera is +X,+Y,+Z in glTF: +X,-Y,+Z in Blender; lower-view clip is Z<=2.78.
direction=Vector((1,-1,1)).normalized();visible=[]
for n in M:
 if n.startswith(('Exterior_city','street_')) or 'wall_east' in n or 'wall_south' in n:continue
 ob=bpy.data.objects[n];opaque=True
 for m in ob.data.materials:
  if m and m.use_nodes:
   for node in m.node_tree.nodes:
    if node.type=='BSDF_PRINCIPLED' and (node.inputs['Alpha'].default_value<.999 or node.inputs['Transmission Weight'].default_value>.5):opaque=False
 if opaque:visible.append(n)
tree,owners=tree_for(visible,lower=True)
def blockers(point,exclude,maxdist=35):
 origin=point+direction*.001;travel=0
 for _ in range(40):
  hit,n,ix,dist=tree.ray_cast(origin,direction,maxdist-travel)
  if hit is None:return None
  name=owners[ix]
  if name not in exclude and hit.z<2.78-1e-6:return {'object':name,'distanceM':travel+dist,'world':list(hit)}
  travel+=dist+.0001;origin=hit+direction*.0001
 return {'iterationLimit':True}
for root in ['Bear_reference_plush','Bear_desk_plush']:
 for o in bpy.data.objects[root].children_recursive:
  if o.name not in M or not any(k in o.name for k in ['eye_L_embroidery','eye_R_embroidery','nose_rounded_triangle','mouth_stitched_W']):continue
  vs,tri=M[o.name];a=np.array(vs);center=Vector(a.mean(axis=0));front=max(p.dot(direction) for p in vs);center+=direction*(front-center.dot(direction));hit=blockers(center,{o.name});report['faceVisibility'].append({'name':o.name,'fixedViewBlocker':hit})
for name in ['screen_PC','screen_TV']:
 if name not in M:continue
 vs,tri=M[name];a=np.array(vs);center=a.mean(axis=0);_,_,basis=np.linalg.svd(a-center,full_matrices=False);u,v=basis[:2];ext=np.max(abs((a-center)@np.array([u,v]).T),axis=0);tests=[]
 for x in [-.6,0,.6]:
  for y in [-.6,0,.6]:
   p=Vector(center+u*x*ext[0]+v*y*ext[1]);tests.append({'uv':[x,y],'fixedViewBlocker':blockers(p,{name})})
 report['screenVisibility'].append({'name':name,'samples':tests,'blockedSamples':sum(t['fixedViewBlocker'] is not None for t in tests)})
report['passed']=all(x['passed'] for x in report['soleContacts']) and not any(x['fixedViewBlocker'] for x in report['faceVisibility']) and not any(x['blockedSamples'] for x in report['screenVisibility']);out.write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
