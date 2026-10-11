import bpy,bmesh,sys,json,math
from pathlib import Path
from mathutils import Vector,Matrix
P=Path(__file__).resolve().parent.parent;sys.path.insert(0,str(P));import rebuild_soft_furniture_v17 as soft
bpy.ops.wm.open_mainfile(filepath=str(P/'bearroom-soft-v17-draft.blend'));s=bpy.context.scene;s.gravity=(0,0,0)
origins=[bpy.data.objects[n] for n in ['sofa_v17_rose_pillow_1','sofa_v17_rose_pillow_2','sofa_v17_rose_pillow_3','rocker_v17_pillow']]
coll=[]
for rootn in ['F01_sofa','anim_rocker']:
 for ob in bpy.data.objects[rootn].children:
  if ob.type!='MESH' or ob in origins or ob.name=='anim_sofa_edge':continue
  o=ob.copy();o.data=ob.data.copy();s.collection.objects.link(o);mw=ob.matrix_world.copy();o.parent=None;o.matrix_world=mw;o.name='pillow_collider_'+ob.name;o.modifiers.new('Cushion contact','COLLISION');o.collision.thickness_outer=.003;coll.append(o)
sims=[]
for orig in origins:
 vs=[orig.matrix_world@v.co for v in orig.data.vertices];fs=[tuple(f.vertices) for f in orig.data.polygons];o=soft.own('pressure_'+orig.name,vs,fs,None,orig.data.materials[0],world=True)
 bm=bmesh.new();bm.from_mesh(o.data);vol=abs(bm.calc_volume());bm.free()
 N=M=26 if orig.name.startswith('rocker') else 28;K=(N+1)*(M+1);E=2*(N+M);vg=o.vertex_groups.new(name='Sewn perimeter');vg.add(list(range(2*K+E,2*K+E*2)),1,'REPLACE')
 mod=o.modifiers.new('Sewn cushion pressure','CLOTH');st=mod.settings;st.quality=10;st.mass=.18;st.vertex_group_mass=vg.name;st.pin_stiffness=1;st.tension_stiffness=32;st.compression_stiffness=12;st.shear_stiffness=18;st.bending_stiffness=.08;st.air_damping=4
 st.use_pressure=True;st.use_pressure_volume=True;st.target_volume=vol*1.50;st.pressure_factor=.25;st.uniform_pressure_force=0
 cs=mod.collision_settings;cs.use_collision=True;cs.distance_min=.003;cs.collision_quality=5;cs.use_self_collision=True;cs.self_distance_min=.002
 mod.point_cache.frame_start=1;mod.point_cache.frame_end=70;sims.append((orig,o,vol))
 print('PILLOW_START',orig.name,vol,flush=True)
for f in range(1,71):
 s.frame_set(f);dg=bpy.context.evaluated_depsgraph_get()
 for orig,o,vol in sims:
  ev=o.evaluated_get(dg);me=ev.to_mesh();_=len(me.vertices);ev.to_mesh_clear()
 if f%10==0:print('PILLOW_FRAME',f,flush=True)
result={};dg=bpy.context.evaluated_depsgraph_get()
for orig,o,vol in sims:
 ev=o.evaluated_get(dg);me=ev.to_mesh();vs=[o.matrix_world@v.co for v in me.vertices];fs=[tuple(f.vertices) for f in me.polygons];ev.to_mesh_clear();inv=orig.matrix_world.inverted_safe();local=[inv@v for v in vs]
 result[orig.name]={'verticesLocal':[list(v) for v in local],'faces':fs,'startingVolume':vol,'targetVolume':vol*1.5,'method':'Closed sewn-panel cloth pressure, fixed perimeter, supporting furniture collision,70 frames'}
 soft.own(orig.name,vs,fs,orig.parent,orig.data.materials[0],world=True,old=orig)
for o in coll+[q[1] for q in sims]:bpy.data.objects.remove(o,do_unlink=True)
s.frame_set(1);s.gravity=(0,0,-9.81)
(P/'soft-v17-work/pillow-restmesh.json').write_text(json.dumps(result,separators=(',',':')));bpy.ops.wm.save_as_mainfile(filepath=str(P/'bearroom-soft-v17-pressure.blend'),compress=True)
