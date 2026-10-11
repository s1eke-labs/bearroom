"""Independent v16 diagnostic images; offline Cycles only, never WebGL/FPS certification."""
import bpy,sys,argparse,json,pathlib,hashlib,importlib.util,math
from mathutils import Vector
P=pathlib.Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--source',required=True);ap.add_argument('--view',choices=['fixed','standing','back','isolated'],default='fixed');ap.add_argument('--samples',type=int,default=24);ap.add_argument('--width',type=int,default=900);a=ap.parse_args(sys.argv[sys.argv.index('--')+1:])
source_hash=hashlib.sha256(pathlib.Path(a.source).read_bytes()).hexdigest();bpy.ops.wm.open_mainfile(filepath=a.source);s=bpy.context.scene;pc=bpy.data.objects['F09_computer'];dg=bpy.context.evaluated_depsgraph_get();pts=[]
for o in pc.children_recursive:
 if o.type in ['MESH','CURVE','FONT']:
  eo=o.evaluated_get(dg);me=eo.to_mesh();pts.extend(o.matrix_world@v.co for v in me.vertices);eo.to_mesh_clear()
lo=Vector([min(v[i] for v in pts) for i in range(3)]);hi=Vector([max(v[i] for v in pts) for i in range(3)]);target=(lo+hi)/2
for o in list(bpy.data.objects):
 if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
for o in s.objects:
 if o.type=='MESH':
  if a.view in ['fixed','isolated'] and (any(k in o.name for k in ['wall_east','wall_south','Exterior_city','street_']) or min((o.matrix_world@Vector(v)).z for v in o.bound_box)>=2.78):o.hide_render=True
  if a.view=='isolated' and o not in set(pc.children_recursive):o.hide_render=True
  if any(m and 'glass' in m.name.lower() for m in o.data.materials):o.visible_shadow=False
# Recreate actual production light positions/powers and occluded sky. Emission only reaches camera,
# matching the frozen diffuse-GI exclusion rather than introducing extra unbudgeted glow lights.
for m in bpy.data.materials:
 if not m.use_nodes:continue
 for n in list(m.node_tree.nodes):
  if n.type=='BSDF_PRINCIPLED' and n.inputs['Emission Strength'].default_value>0:
   v=n.inputs['Emission Strength'].default_value;lp=m.node_tree.nodes.new('ShaderNodeLightPath');mul=m.node_tree.nodes.new('ShaderNodeMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=v;m.node_tree.links.new(lp.outputs['Is Camera Ray'],mul.inputs[0]);m.node_tree.links.new(mul.outputs[0],n.inputs['Emission Strength'])
spec=importlib.util.spec_from_file_location('gi',P.parent/'gi-rebuild/bake_indirect.py');gi=importlib.util.module_from_spec(spec);spec.loader.exec_module(gi);ref=json.loads((P.parent/'gi-rebuild/reference-v13.json').read_text());lights,desc=gi.configure_lights(ref)
for light,night,day in lights:light.data.energy=day
gi.configure_sky_world(ref,None)
if a.view=='fixed':pos=target+Vector((1,-1,1)).normalized()*35
elif a.view=='standing':pos=Vector((4.5,-.8,1.614))
elif a.view=='back':pos=Vector((4.5,.8,1.614))
else:pos=target+Vector((1,-1,.6)).normalized()*2
bpy.ops.object.camera_add(location=pos);c=bpy.context.object;c.rotation_euler=(target-pos).to_track_quat('-Z','Y').to_euler();c.data.type='ORTHO' if a.view in ['fixed','isolated'] else 'PERSP';c.data.ortho_scale=.9;c.data.lens=27;c.data.clip_start=.025;s.camera=c
s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=a.samples;s.cycles.use_denoising=False;s.cycles.use_adaptive_sampling=False;s.cycles.max_bounces=6;s.cycles.diffuse_bounces=4;s.render.threads_mode='FIXED';s.render.threads=6;s.view_settings.view_transform='AgX';s.view_settings.exposure=0;s.render.resolution_x=a.width;s.render.resolution_y=a.width;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(P/f'independent-{a.view}.png');bpy.ops.render.render(write_still=True)
(P/f'independent-{a.view}.json').write_text(json.dumps({'source':a.source,'sourceSha256':source_hash,'cameraBlenderXYZ':list(pos),'targetBlenderXYZ':list(target),'view':a.view,'type':c.data.type,'orthoScale':c.data.ortho_scale,'cameraLensMM':c.data.lens,'lights':desc,'limitations':['Offline Cycles diagnostic, not WebGL acceptance.','Fixed view preserves actual isometric direction but crops tightly for inspection.','Production direct lights/occluded sky; Cycles reflection, light cutoff and AgX differ from runtime.','First-person ceiling is a runtime mesh and is absent in source.']},indent=2))
