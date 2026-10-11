"""Read-only same-camera source/GLB Cycles diagnostic; not live WebGL evidence."""
import bpy,sys,hashlib,json
from pathlib import Path
from mathutils import Vector
src,out,view=sys.argv[sys.argv.index('--')+1:];src=Path(src);out=Path(out)
if src.suffix=='.blend':bpy.ops.wm.open_mainfile(filepath=str(src))
else:
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(src))
s=bpy.context.scene
views={'sofa':((-4.15,-4.65,2.10),(-.64,-2.14,.73),'F01_sofa',49,.055),'chair':((5.5,.9,1.65),(3.50,-1.15,.82),'F11_computer_chair',49,.055),'rocker':((4.4,-1.2,4.85),(2.4,1.05,3.90),'F16_reading_rocker',57,3.145)}
pos,target,root,lens,floor=views[view]
for o in list(bpy.data.objects):
 if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
for o in s.objects:
 if o.type not in ['MESH','CURVE']:continue
 p=o;found=False
 while p:
  if p.name==root:found=True;break
  p=p.parent
 o.hide_render=not found
world=bpy.data.worlds.new('IndependentQA');world.use_nodes=True;world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.45,.45,.45,1);world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.24;s.world=world
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,floor));o=bpy.context.object;m=bpy.data.materials.new('Inspection floor');m.use_nodes=True;m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(.22,.22,.22,1);m.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.83;o.data.materials.append(m)
for name,delta,power,size in [('key',(-3,-2,4),600,4),('rim',(2,2,3),400,3)]:
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=Vector(target)+Vector(delta);o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=pos);c=bpy.context.object;c.rotation_euler=(Vector(target)-c.location).to_track_quat('-Z','Y').to_euler();c.data.lens=lens;c.data.clip_start=.03;s.camera=c
s.render.engine='CYCLES';s.cycles.samples=80;s.cycles.use_denoising=False;s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.03;s.cycles.max_bounces=6;s.cycles.diffuse_bounces=4;s.render.threads_mode='FIXED';s.render.threads=4;s.view_settings.view_transform='AgX';s.view_settings.exposure=0
s.render.resolution_x=1000;s.render.resolution_y=750;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(out);bpy.ops.render.render(write_still=True)
out.with_suffix('.json').write_text(json.dumps({'source':str(src),'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'view':view,'camera':pos,'target':target,'lens':lens,'limits':['Same-camera offline source/GLB material consistency diagnostic. Not live WebGL, runtime GI, performance or publication evidence.','Neutral area lights, Cycles transport, AgX tonemapping.']},indent=2))
