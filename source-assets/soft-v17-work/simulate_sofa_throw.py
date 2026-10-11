import bpy,sys,json,math,hashlib
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
P=Path(__file__).resolve().parent.parent;sys.path.insert(0,str(P));from rebuild_soft_furniture_v17 import own,fabric_materials
bpy.ops.wm.open_mainfile(filepath=str(P/'bearroom-soft-v17-draft.blend'));s=bpy.context.scene;root=bpy.data.objects['F01_sofa'];orig=bpy.data.objects['anim_sofa_edge'];M=root.matrix_world.copy();supports=[o for o in root.children if o.type=='MESH' and o.name.startswith(('sofa_v17_connected','sofa_v17_seat','sofa_v17_back','sofa_v17_rose_pillow'))]
# Dedicated collision surfaces; original scene objects are left untouched.
coll=[]
for ob in supports:
 o=ob.copy();o.data=ob.data.copy();s.collection.objects.link(o);o.name='sim_collider_'+ob.name;mw=ob.matrix_world.copy();o.parent=None;o.matrix_world=mw;mod=o.modifiers.new('Real upholstery collision','COLLISION');o.collision.thickness_outer=.006;o.collision.cloth_friction=8;coll.append(o)
vs=[];fs=[]
for ob in supports:
 off=len(vs);vs.extend(ob.matrix_world@v.co for v in ob.data.vertices);fs.extend(tuple(off+i for i in p.vertices) for p in ob.data.polygons)
tree=BVHTree.FromPolygons(vs,fs)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,.065));floor=bpy.context.object;floor.modifiers.new('Ground collision','COLLISION');floor.collision.thickness_outer=.004;coll.append(floor)
N=32;K=48;verts=[];faces=[]
# Extra length is laid across the arm. Small coherent pre-folds break symmetry;
# collision and gravity produce the final pose, rather than a support-height map.
for j in range(K+1):
 v=j/K
 for i in range(N+1):
  u=i/N;x=(-3.24+.62*u)*(1-v)+(-3.095+.225*u)*v;y=-2.25+.87*v
  z=.30+.67*(max(0,min(1,v/.50))**2)*(3-2*max(0,min(1,v/.50)))+.025*math.sin(u*4*math.pi+.2)*math.sin(v*math.pi)
  q=M@Vector((x,y,z));hit,normal,index,dist=tree.ray_cast(Vector((q.x,q.y,4)),Vector((0,0,-1)),6)
  if hit:q.z=max(q.z,hit.z+.020)
  if j==K and hit:q.z=hit.z+.018
  verts.append(q)
for j in range(K):
 for i in range(N):a=j*(N+1)+i;faces.append((a,a+1,a+N+2,a+N+1))
o=own('sim_throw',verts,faces,None,fabric_materials()['linen'],world=True)
vg=o.vertex_groups.new(name='Tucked rear seam');vg.add([K*(N+1)+i for i in range(N+1)],1.0,'REPLACE')
md=o.modifiers.new('Gravity cloth solve','CLOTH');st=md.settings;st.vertex_group_mass=vg.name;st.pin_stiffness=1;st.quality=8;st.mass=.18;st.tension_stiffness=18;st.compression_stiffness=18;st.shear_stiffness=9;st.bending_stiffness=.10;st.air_damping=2;st.tension_damping=5;st.compression_damping=5;st.shear_damping=5;st.bending_damping=.5
cs=md.collision_settings;cs.use_collision=True;cs.distance_min=.005;cs.collision_quality=5;cs.use_self_collision=True;cs.self_distance_min=.004;cs.self_friction=6
md.point_cache.frame_start=1;md.point_cache.frame_end=100
s.frame_start=1;s.frame_end=100;s.render.fps=24
for f in range(1,101):
 s.frame_set(f);dg=bpy.context.evaluated_depsgraph_get();ev=o.evaluated_get(dg);me=ev.to_mesh();_ =len(me.vertices);ev.to_mesh_clear()
 if f%10==0:print('CLOTH_FRAME',f,flush=True)
# Bake simulation to editable, ordinary mesh, then create thin closed cloth shell.
dg=bpy.context.evaluated_depsgraph_get();ev=o.evaluated_get(dg);me=ev.to_mesh();top=[o.matrix_world@v.co for v in me.vertices];polys=[tuple(f.vertices) for f in me.polygons];ev.to_mesh_clear()
lo=min(p.z for p in top);print('CLOTH_MIN',lo,flush=True)
# Preserve animated object and its original local matrix; geometry changes only.
normal=[]
for j in range(K+1):
 for i in range(N+1):
  dx=top[j*(N+1)+min(N,i+1)]-top[j*(N+1)+max(0,i-1)];dy=top[min(K,j+1)*(N+1)+i]-top[max(0,j-1)*(N+1)+i];normal.append(dx.cross(dy).normalized())
vs=top+[p-normal[k]*.003 for k,p in enumerate(top)];L=len(top);fs=polys+[tuple(reversed([i+L for i in f])) for f in polys]
edge=list(range(N+1))+[j*(N+1)+N for j in range(1,K+1)]+[K*(N+1)+i for i in range(N-1,-1,-1)]+[j*(N+1) for j in range(K-1,0,-1)]
for a,b in zip(edge,edge[1:]+edge[:1]):fs.append((a,b,b+L,a+L))
own('anim_sofa_edge',vs,fs,root,fabric_materials()['linen'],world=True,old=orig)
orig['clothShellPairCount']=L;
# Continuous independent triangle audit owns the final collision check; avoid
# projecting cloth that is legitimately behind a back or arm onto its top.
vs=[orig.matrix_world@v.co for v in orig.data.vertices]
orig['clothShellPairCount']=L;orig['clothThicknessMetres']=.003;orig['softConstructionV17']='Gravity simulated woven throw; 100-frame offline cloth settle, baked editable mesh.'
result={'method':'Blender cloth, gravity and upholstery collisions, 100 frames at24fps; baked authored rest pose','sourceSha256':hashlib.sha256((P/'bearroom-soft-v17-draft.blend').read_bytes()).hexdigest(),'verticesWorld':[list(p) for p in vs],'faces':fs,'pairCount':L,'thickness':.003,'frame':100,'minimumZ':lo,'edge':edge}
(P/'soft-v17-work/sofa-throw-restmesh.json').write_text(json.dumps(result,separators=(',',':')))
for a in coll+[o]:bpy.data.objects.remove(a,do_unlink=True)
s.frame_set(1);bpy.ops.wm.save_as_mainfile(filepath=str(P/'bearroom-soft-v17-cloth.blend'),compress=True)
