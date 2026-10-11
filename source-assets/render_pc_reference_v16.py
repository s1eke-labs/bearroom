"""Production-light offline Cycles inspection; no WebGL/FPS inference."""
import bpy,json,sys,math,hashlib,importlib.util,argparse
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('gi',P/'gi-rebuild/bake_indirect.py');gi=importlib.util.module_from_spec(spec);spec.loader.exec_module(gi)
ap=argparse.ArgumentParser();ap.add_argument('--source',default=str(P/'bearroom-pc-v16.blend'));ap.add_argument('--view',default='closeup');ap.add_argument('--tag',default='draft');ap.add_argument('--samples',type=int,default=32);ap.add_argument('--width',type=int,default=900);a=ap.parse_args(sys.argv[sys.argv.index('--')+1:]);sha=hashlib.sha256(Path(a.source).read_bytes()).hexdigest();bpy.ops.wm.open_mainfile(filepath=a.source);s=bpy.context.scene
for o in list(bpy.data.objects):
 if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
for o in s.objects:
 if o.type=='MESH' and any(k in o.name for k in ['wall_east','wall_south']):o.hide_render=True
for m in bpy.data.materials:
 if not m.use_nodes:continue
 for n in list(m.node_tree.nodes):
  if n.type=='BSDF_PRINCIPLED' and n.inputs['Emission Strength'].default_value>0:
   e=n.inputs['Emission Strength'].default_value;lp=m.node_tree.nodes.new('ShaderNodeLightPath');mul=m.node_tree.nodes.new('ShaderNodeMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=e;m.node_tree.links.new(lp.outputs['Is Camera Ray'],mul.inputs[0]);m.node_tree.links.new(mul.outputs[0],n.inputs['Emission Strength'])
ref=json.loads((P/'gi-rebuild/reference-v13.json').read_text());lights,desc=gi.configure_lights(ref)
for light,night,day in lights:light.data.energy=day
gi.configure_sky_world(ref,None)
if a.view=='closeup':pos,target,lens=(5.08,-1.15,1.74),(4.34,.015,1.168),56
elif a.view=='walkup':pos,target,lens=(4.5,-.8,1.614),(4.335,.060,1.170),43
elif a.view=='desk':pos,target,lens=(4.5,-1.8,1.614),(3.5,-.1,.9),27
elif a.view=='construction':
 pc=bpy.data.objects['F09_computer'];children=set(pc.children_recursive)
 for o in s.objects:
  if o.type in ['MESH','CURVE'] and o not in children:o.hide_render=True
 pos,target,lens=(5.15,-1.10,1.650),(4.34,.015,1.167),59
 # This explicitly labeled geometry inspection uses a soft studio key.
 bpy.ops.object.light_add(type='AREA',location=(4.4,-1.2,2.5));key=bpy.context.object;key.data.energy=70;key.data.shape='DISK';key.data.size=1.8;key.rotation_euler=(Vector(target)-key.location).to_track_quat('-Z','Y').to_euler()
else:raise ValueError(a.view)
bpy.ops.object.camera_add(location=pos);c=bpy.context.object;c.rotation_euler=(Vector(target)-c.location).to_track_quat('-Z','Y').to_euler();c.data.type='PERSP';c.data.lens=lens;c.data.clip_start=.025;s.camera=c
s.render.engine='CYCLES';s.cycles.samples=a.samples;s.cycles.use_denoising=False;s.cycles.max_bounces=6;s.render.threads_mode='FIXED';s.render.threads=8;s.view_settings.view_transform='AgX';s.view_settings.exposure=0;s.render.resolution_x=a.width;s.render.resolution_y=a.width;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';out=P/'pc-v16-review'/f'{a.tag}-{a.view}.png';s.render.filepath=str(out);bpy.ops.render.render(write_still=True)
out.with_suffix('.json').write_text(json.dumps({'source':a.source,'sourceSha256':sha,'view':a.view,'cameraBlenderXYZ':list(pos),'targetBlenderXYZ':list(target),'lensMM':lens,'lights':desc,'limitations':['Offline Cycles only, not WebGL/performance evidence.','Production source positions/direct-light intensity; transport, tone mapping and environment differ.','Construction view includes explicitly labeled studio key; other views have no supplemental fill.','Source includes approved generated wallpaper; runtime adds actual local clock/date.','East/south exterior cutaway walls excluded, matching production/bake visibility.']},indent=2))
