'''Production-light, human-eye-height offline plant comparison. No runtime/WebGL claim.'''
import bpy,sys,json,argparse,importlib.util,hashlib
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];W=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--source',default=str(P/'bearroom-pc-v16.blend'));ap.add_argument('--tag',default='before');ap.add_argument('--view',default='floor');ap.add_argument('--width',type=int,default=850);ap.add_argument('--samples',type=int,default=40);ap.add_argument('--diagnostic-fill',action='store_true');a=ap.parse_args(sys.argv[sys.argv.index('--')+1:]);source_hash=hashlib.sha256(Path(a.source).read_bytes()).hexdigest();bpy.ops.wm.open_mainfile(filepath=a.source);s=bpy.context.scene
spec=importlib.util.spec_from_file_location('gi',P/'gi-rebuild/bake_indirect.py');gi=importlib.util.module_from_spec(spec);spec.loader.exec_module(gi)
for ob in list(s.objects):
 if ob.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(ob,do_unlink=True)
for ob in s.objects:
 if ob.type=='MESH' and any(k in ob.name for k in ['wall_east','wall_south']):ob.hide_render=True
for m in bpy.data.materials:
 if not m.use_nodes:continue
 for n in list(m.node_tree.nodes):
  if n.type=='BSDF_PRINCIPLED' and n.inputs['Emission Strength'].default_value>0:
   v=n.inputs['Emission Strength'].default_value;lp=m.node_tree.nodes.new('ShaderNodeLightPath');mul=m.node_tree.nodes.new('ShaderNodeMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=v;m.node_tree.links.new(lp.outputs['Is Camera Ray'],mul.inputs[0]);m.node_tree.links.new(mul.outputs[0],n.inputs['Emission Strength'])
ref=json.loads((P/'gi-rebuild/reference-v13.json').read_text());lights,desc=gi.configure_lights(ref)
for light,night,day in lights:light.data.energy=day
gi.configure_sky_world(ref,None)
views={
 'floor':((-3.72,1.88,1.62),(-4.53,3.5,.61),58),
 'loft':((2.2,-.95,4.76),(3.53,.57,3.53),58),
 'desk':((2.1,-.68,1.62),(2.56,.20,1.08),58),
 'bedside':((-2.0,2.00,4.76),(-3.25,3.45,3.52),60),
 'kitchen':((-1.60,2.54,1.62),(-2.,3.6,1.14),60),
}
pos,target,lens=views[a.view];bpy.ops.object.camera_add(location=pos);cam=bpy.context.object;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='PERSP';cam.data.lens=lens;cam.data.clip_start=.025;s.camera=cam
if a.diagnostic_fill:
 bpy.ops.object.light_add(type='AREA',location=Vector(pos)+Vector((-.7,-.2,.7)));key=bpy.context.object;key.data.energy=70;key.data.shape='DISK';key.data.size=1.4;key.rotation_euler=(Vector(target)-key.location).to_track_quat('-Z','Y').to_euler()
s.render.engine='CYCLES';s.cycles.samples=a.samples;s.cycles.use_denoising=False;s.cycles.max_bounces=6;s.render.threads_mode='FIXED';s.render.threads=6;s.view_settings.view_transform='AgX';s.view_settings.exposure=0;s.render.resolution_x=a.width;s.render.resolution_y=a.width;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';out=W/f'{a.tag}-{a.view}.png';s.render.filepath=str(out);bpy.ops.render.render(write_still=True)
out.with_suffix('.json').write_text(json.dumps({'source':a.source,'sourceSHA256':source_hash,'camera':pos,'target':target,'lens':lens,'diagnosticFill':a.diagnostic_fill,'eyeHeightAboveFloor':pos[2]-(3.14 if a.view in ['loft','bedside'] else 0),'lights':desc,'limitations':['Offline Cycles; no WebGL or runtime performance claim.','No denoising; production light positions/intensities and occluded sky, with Cycles differences.']},indent=2))
