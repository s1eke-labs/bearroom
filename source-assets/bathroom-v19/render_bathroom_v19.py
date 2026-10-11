"""Offline Cycles inspection; cutaways are explicit review-only visibility changes."""
import bpy,bmesh,sys,json,math,hashlib
from mathutils import Vector
from pathlib import Path
P=Path(__file__).resolve().parent
args=sys.argv[sys.argv.index('--')+1:];src=Path(args[0]);view=args[1] if len(args)>1 else 'interior';tag=args[2] if len(args)>2 else 'candidate'
source_sha=hashlib.sha256(src.read_bytes()).hexdigest();bpy.ops.wm.open_mainfile(filepath=str(src));s=bpy.context.scene
views={
'interior':((6.8,-.3,3.9),(3.60,3.02,1.06),48,True),
'vanity':((4.78,2.58,1.92),(4.30,3.59,1.21),44,True),
'toilet':((4.04,2.55,1.35),(3.40,3.53,.53),48,True),
'shower':((3.90,1.55,2.40),(2.77,2.76,1.15),40,True),
'lower':((6.80,-.3,5.00),(3.70,3.0,1.32),44,False),
'overview':((7.60,-2.0,4.3),(3.72,2.89,1.55),48,False),
'eye':((3.67,2.54,1.65),(3.90,3.62,1.3),24,False),
'uppercorner':((3.67,2.54,1.65),(4.52,3.94,2.73),24,False),
'outside_eye':((3.64,.74,1.65),(3.70,2.9,1.55),25,False)}
pos,target,lens,isolated=views[view]
for o in list(bpy.data.objects):
 if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
for o in s.objects:
 if o.type not in ['MESH','CURVE']:continue
 r=o
 while r.parent:r=r.parent
 is_bath=r.name in ['F20_vanity','Bathroom_architecture'] or 'bath19' in o.name or 'bathroom' in o.name or o.name=='Architecture__plaster_warm_white'
 if isolated:
  o.hide_render=not is_bath
  if isolated and (o.name in ['cutaway_bathroom_partition','Architecture__plaster_warm_white','bathroom_oak_door','bath19_soffit_front','bath19_soffit_east'] or o.name.startswith(('bath19_front_','bath19_door_','bathroom_door_'))):o.hide_render=True
 else:o.hide_render=False
 if view in ['eye','outside_eye','uppercorner'] and r.name not in ['F20_vanity','Bathroom_architecture','Architecture','Architectural_lighting']:o.hide_render=True
 if view in ['lower','overview'] and ('wall_east' in o.name or 'wall_south' in o.name):o.hide_render=True
 if view=='lower':
  bb=[o.matrix_world@Vector(v) for v in o.bound_box]
  if min(v.z for v in bb)>=2.78:o.hide_render=True
  elif max(v.z for v in bb)>2.78 and o.type=='MESH':
   o.data=o.data.copy();bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=1e-7,plane_co=o.matrix_world.inverted()@Vector((0,0,2.78)),plane_no=o.matrix_world.to_3x3().transposed()@Vector((0,0,1)),clear_outer=True,clear_inner=False);bm.to_mesh(o.data);bm.free()
# Open moving door in eye inspection; the authored candidate remains closed.
if view in ['eye','outside_eye','uppercorner']:bpy.data.objects['bathroom_door_hinge'].rotation_euler.z=-math.pi/2
world=bpy.data.worlds.new('v19 inspection world');world.use_nodes=True;world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.42,.46,.50,1);world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.18;s.world=world
for name,loc,power,size in [('soft key',(4,1,5),430,3),('window',(1.6,4.3,2.4),100,1.6),('bath ceiling',(.15,-3.2,2.71),0,.1)]:
 if power==0:continue
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
if view in ['overview','eye','outside_eye','uppercorner']:
 d=bpy.data.lights.new('bath ceiling practical','AREA');d.energy=38;d.shape='DISK';d.size=.32;o=bpy.data.objects.new('bath ceiling practical',d);s.collection.objects.link(o);o.location=(3.65,3.14,2.69);o.rotation_euler=(0,0,0)
bpy.ops.object.camera_add(location=pos);c=bpy.context.object;c.rotation_euler=(Vector(target)-c.location).to_track_quat('-Z','Y').to_euler();c.data.lens=lens;c.data.clip_start=.02;s.camera=c
if view in ['lower','overview']:
 c.location=Vector(target)+Vector((8,-8,8));c.rotation_euler=(Vector(target)-c.location).to_track_quat('-Z','Y').to_euler();c.data.type='ORTHO';c.data.ortho_scale=4.75
s.render.engine='CYCLES';s.cycles.samples=40 if view in ['eye','outside_eye','uppercorner','overview'] else 72;s.cycles.use_denoising=False;s.cycles.max_bounces=6;s.cycles.diffuse_bounces=4;s.render.threads_mode='FIXED';s.render.threads=4;s.view_settings.view_transform='AgX';s.view_settings.exposure=0
s.render.resolution_x=900;s.render.resolution_y=700;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(P/f'{tag}-{view}.png');bpy.ops.render.render(write_still=True)
(P/f'{tag}-{view}.json').write_text(json.dumps({'source':str(src),'sha256':source_sha,'camera':pos,'target':target,'view':view,'limits':['Offline Cycles material/geometry inspection, not browser or live shadow evidence.','Interior/closeups hide front/east privacy walls and corresponding upper trims explicitly. Overview uses runtime east/south wall hide rules; lower uses actual 2.78 m clipping. Eye views keep full architecture.','Inspection lighting is neutral area lighting; production GI validation is independent.']},indent=2))
