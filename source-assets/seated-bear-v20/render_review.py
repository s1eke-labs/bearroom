"""CPU Cycles review. Isolates bear+sofa; does not save review scene changes."""
import bpy,sys,json,hashlib
from pathlib import Path
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:];src=Path(args[0]);out=Path(args[1]);tag=args[2];views=args[3:] or ['front','side','threequarter'];out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(src));s=bpy.context.scene
for o in list(bpy.data.objects):
 if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
for o in s.objects:
 if o.type not in ['MESH','CURVE']:continue
 r=o
 while r.parent:r=r.parent
 o.hide_render=r.name not in ['Bear_reference_plush','F01_sofa']
w=bpy.data.worlds.new('seated-bear review world');w.use_nodes=True;w.node_tree.nodes.get('Background').inputs['Color'].default_value=(.42,.44,.47,1);w.node_tree.nodes.get('Background').inputs['Strength'].default_value=.28;s.world=w
target=Vector((-.945,-1.80,.90))
for name,offset,power,size in [('key',(-1.8,-2,2.5),220,2.2),('fill',(1.8,-.4,1.3),100,1.5),('rim',(0,2,2),180,1.7)]:
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=target+Vector(offset);o.rotation_euler=(target-o.location).to_track_quat('-Z','Y').to_euler()
s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=48;s.cycles.use_denoising=False;s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.04;s.cycles.max_bounces=5;s.cycles.diffuse_bounces=3;s.render.threads_mode='FIXED';s.render.threads=6;s.view_settings.view_transform='AgX';s.view_settings.exposure=0;s.render.resolution_x=860;s.render.resolution_y=800;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG'
settings={'front':((0,-2.6,.3),.57),'side':((-2.6,0,.23),.59),'threequarter':((-2.1,-2.6,1.0),.62),'sofa':((-3.6,-3.5,2.2),3.6)}
bpy.ops.object.camera_add();c=bpy.context.object;c.data.type='ORTHO';c.data.clip_start=.01;s.camera=c
for view in views:
 off,scale=settings[view];t=target if view!='sofa' else Vector((-.65,-2.12,.69));c.location=t+Vector(off);c.rotation_euler=(t-c.location).to_track_quat('-Z','Y').to_euler();c.data.ortho_scale=scale;s.render.filepath=str(out/f'{tag}-{view}.png');bpy.ops.render.render(write_still=True)
 (out/f'{tag}-{view}.json').write_text(json.dumps({'source':str(src),'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'camera':list(c.location),'target':list(t),'orthoScale':scale,'view':view,'engine':'CPU Cycles','samples':s.cycles.samples,'inspection':'Isolated bear and unchanged sofa, neutral studio lights; not WebGL/GI/performance evidence.'},indent=2))
