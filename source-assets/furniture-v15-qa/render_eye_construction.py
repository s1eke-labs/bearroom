"""Offline Blender diagnostic evidence; no source write or runtime/WebGL claim."""
import bpy,sys,json,hashlib
from pathlib import Path
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:];source=Path(args[0]).resolve();out=Path(args[1]).resolve();selected=args[2:]
sourceHash=hashlib.sha256(source.read_bytes()).hexdigest();bpy.ops.wm.open_mainfile(filepath=str(source));s=bpy.context.scene
for o in list(bpy.data.objects):
 if o.type in {'LIGHT','CAMERA'}:bpy.data.objects.remove(o,do_unlink=True)
for o in bpy.data.objects:
 if o.name.startswith(('bear_fiber','bear_silhouette')):o.hide_render=True
# Readable geometry lighting rather than an approximation claimed as runtime.
s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=False;s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.07;s.render.threads_mode='FIXED';s.render.threads=6
s.world=bpy.data.worlds.new('QA diffuse world');s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.5,.53,.57,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.6
for name,pos,energy,size in [('QA high',(1,-1,7),900,7),('QA window',(2,-4,3),450,5),('QA back',(-3,2,5),450,4)]:
 d=bpy.data.lights.new(name,'AREA');o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=pos;o.rotation_euler=(Vector((0,0,1.8))-o.location).to_track_quat('-Z','Y').to_euler();d.energy=energy;d.shape='DISK';d.size=size
views={
 'sofa':((-3.2,-1.3,1.614),(-.65,-2.1,.65),['F01_sofa','F02_coffee_table','Bear_reference_plush']),
 'desk':((4.5,-1.8,1.614),(3.5,-.1,.9),['F08_computer_desk','F11_computer_chair','Bear_desk_plush','F10_monitor','F09_computer']),
 'desk-back':((3.5,.8,1.614),(3.5,0,.65),['F08_computer_desk','F11_computer_chair','Bear_desk_plush','F10_monitor','F09_computer']),
 'dining':((.6,-.2,1.614),(-.7,1.15,.6),['F13_dining_group']),
 'kitchen':((-3.5,-.2,1.614),(-1.6,3.4,.9),['F14_kitchen']),
 'bed':((1.5,2,4.73),(-.75,2.5,3.8),['F15_bed']),
 'wardrobe':((-3.45,1.8,4.73),(-4.45,3.1,4.25),['F18_wardrobe']),
 'wardrobe-top':((-2.7,1.0,6.4),(-4.45,3.1,5.1),['F18_wardrobe']),
 'tv-cabinet':((-3.5,-3.55,1.614),(-2.7,-2.2,.4),['F04_tv_cabinet']),
 'desk-under':((3.5,-1.9,.25),(3.5,0,.50),['F08_computer_desk','F11_computer_chair']),
 'sofa-back':((1,-2,.60),(-.6,-2,.60),['F01_sofa','F02_coffee_table']),
 'dining-under':((.6,-.2,.25),(-.7,1.15,.4),['F13_dining_group']),
}
out.mkdir(parents=True,exist_ok=True);bpy.ops.object.camera_add();c=bpy.context.object;c.data.type='PERSP';c.data.lens=26;c.data.clip_start=.03;s.camera=c
s.render.resolution_x=800;s.render.resolution_y=600;s.render.resolution_percentage=100;s.view_settings.view_transform='AgX';s.render.image_settings.file_format='PNG'
for name,(pos,target,roots) in views.items():
 if selected and name not in selected:continue
 include=set()
 for root in roots:
  r=bpy.data.objects.get(root)
  if r:include.update([r,*r.children_recursive])
 for o in bpy.data.objects:
  if o.type not in {'LIGHT','CAMERA'}:o.hide_render=o not in include
 c.location=pos;c.rotation_euler=(Vector(target)-c.location).to_track_quat('-Z','Y').to_euler();s.render.filepath=str(out/(name+'.png'));bpy.ops.render.render(write_still=True)
(out/'render-scope.json').write_text(json.dumps({'source':str(source),'sourceSha256':sourceHash,'scope':'Offline isolated construction diagnostics; eight normal-view eye locations checked separately by the CPU final-eye-positions report, isolated geometry is not actual rendered room. Under/back diagnostic cameras intentionally non-walk mode. No source edited.','views':views},indent=2))
