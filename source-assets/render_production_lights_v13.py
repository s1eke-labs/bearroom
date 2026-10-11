"""Offline Cycles inspection using production source positions/intensities.
This is modeling evidence only, never a WebGL/FPS verification. Sources match
reference JSON; finite-range cutoff, specular room environment and ACES differ.
No area-light fill or world diffuse energy is added.
"""
import argparse,json,pathlib,sys,math,importlib.util
import bpy
from mathutils import Vector
P=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('gi',P/'gi-rebuild/bake_indirect.py');gi=importlib.util.module_from_spec(spec);spec.loader.exec_module(gi)
ap=argparse.ArgumentParser();ap.add_argument('--sky',action='store_true');ap.add_argument('--source',required=True);ap.add_argument('--reference',required=True);ap.add_argument('--mode',default='day');ap.add_argument('--view',default='overview');ap.add_argument('--tag',required=True);ap.add_argument('--patch-materials',action='store_true');ap.add_argument('--samples',type=int,default=48);ap.add_argument('--width',type=int,default=1000)
a=ap.parse_args(sys.argv[sys.argv.index('--')+1:]);bpy.ops.wm.open_mainfile(filepath=a.source);s=bpy.context.scene
if a.patch_materials:
 sys.path.insert(0,str(P));from refine_materials_v13 import apply_materials_v13;apply_materials_v13()
ref=json.loads(pathlib.Path(a.reference).read_text())
for o in list(bpy.data.objects):
 if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
for o in s.objects:
 if o.type=='MESH':
  # Match visible dollhouse east/south cutaway, without exposing exterior.
  if any(k in o.name for k in ['wall_east','wall_south','Exterior_city','street_']):o.hide_render=True
  if any(m and 'glass' in m.name.lower() for m in o.data.materials):o.visible_shadow=False
  if a.view=='living' and (o.name.startswith(('cutaway_upper','cutaway_loft')) or 'wall_' in o.name):o.hide_render=True
  if a.view=='living' and o.parent and o.parent.name=='F03_television':o.hide_render=True
# Lamp emissive meshes stay visible without creating unbudgeted bounce sources.
for m in bpy.data.materials:
 if not m.use_nodes:continue
 for n in list(m.node_tree.nodes):
  if n.type=='BSDF_PRINCIPLED' and n.inputs['Emission Strength'].default_value>0:
   v=n.inputs['Emission Strength'].default_value;lp=m.node_tree.nodes.new('ShaderNodeLightPath');mul=m.node_tree.nodes.new('ShaderNodeMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=v
   m.node_tree.links.new(lp.outputs['Is Camera Ray'],mul.inputs[0]);m.node_tree.links.new(mul.outputs[0],n.inputs['Emission Strength'])
world=bpy.data.worlds.new('Production light inspection world');world.use_nodes=True;nodes=world.node_tree.nodes;nodes.clear();lp=nodes.new('ShaderNodeLightPath');bg=nodes.new('ShaderNodeBackground');bg.inputs['Color'].default_value=(.05,.065,.085,1);mul=nodes.new('ShaderNodeMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=1;out=nodes.new('ShaderNodeOutputWorld');world.node_tree.links.new(lp.outputs['Is Camera Ray'],mul.inputs[0]);world.node_tree.links.new(mul.outputs[0],bg.inputs['Strength']);world.node_tree.links.new(bg.outputs[0],out.inputs[0]);s.world=world
lights,desc=gi.configure_lights(ref)
for light,night,day in lights:light.data.energy=day if a.mode=='day' else night
if a.sky:
 gi.configure_sky_world(ref,None if a.mode=='day' else 0)
 nt=s.world.node_tree;out=next(n for n in nt.nodes if n.type=='OUTPUT_WORLD');src=out.inputs['Surface'].links[0].from_socket
 camera=nt.nodes.new('ShaderNodeBackground');camera.inputs['Color'].default_value=(.05,.065,.085,1);lp=nt.nodes.new('ShaderNodeLightPath');mix=nt.nodes.new('ShaderNodeMixShader');nt.links.new(lp.outputs['Is Camera Ray'],mix.inputs[0]);nt.links.new(src,mix.inputs[1]);nt.links.new(camera.outputs[0],mix.inputs[2]);nt.links.new(mix.outputs[0],out.inputs[0])
if a.view=='overview':pos,target,scale=(16,-16,18.78),(0,0,2.78),15.3
elif a.view=='bear':
 root=bpy.data.objects['Bear_reference_plush'];pts=[];dg=bpy.context.evaluated_depsgraph_get()
 for ob in root.children_recursive:
  if ob.type not in ['MESH','CURVE']:continue
  eo=ob.evaluated_get(dg);me=eo.to_mesh();pts.extend(ob.matrix_world@v.co for v in me.vertices);eo.to_mesh_clear()
 lo=Vector([min(v[i] for v in pts) for i in range(3)]);hi=Vector([max(v[i] for v in pts) for i in range(3)]);target=(lo+hi)*.5;direction=Vector((.12,-1,.13)).normalized();pos=target+direction*2
 rot=(target-pos).to_track_quat('-Z','Y');right=rot@Vector((1,0,0));up=rot@Vector((0,1,0));width=max(v.dot(right) for v in pts)-min(v.dot(right) for v in pts);height=max(v.dot(up) for v in pts)-min(v.dot(up) for v in pts);scale=max(width,height/.8)*1.14
elif a.view=='living':pos,target,scale=(-3.5,.7,3.3),(-1.5,-1.3,.8),4.5
elif a.view=='desk':pos,target,scale=(7,-5,4.3),(3.55,-.1,1.0),4.2
else:pos,target,scale=(5,-10,9),(-1.1,-1.8,3.8),8.5
bpy.ops.object.camera_add(location=pos);c=bpy.context.object;c.rotation_euler=(Vector(target)-c.location).to_track_quat('-Z','Y').to_euler();c.data.type='ORTHO';c.data.ortho_scale=scale;s.camera=c
s.render.engine='CYCLES';s.cycles.samples=a.samples;s.cycles.use_denoising=False;s.cycles.use_adaptive_sampling=False;s.cycles.max_bounces=6;s.cycles.diffuse_bounces=4;s.render.threads_mode='FIXED';s.render.threads=8;s.view_settings.view_transform='AgX';s.view_settings.exposure=0
s.render.resolution_x=a.width;s.render.resolution_y=int(a.width*.8);s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(P/'material-light-v13-review'/f'{a.tag}-{a.view}-{a.mode}.png');bpy.ops.render.render(write_still=True)
(P/'material-light-v13-review'/f'{a.tag}-{a.view}-{a.mode}.json').write_text(json.dumps({'source':a.source,'lightReference':a.reference,'view':a.view,'mode':a.mode,'lights':desc,'samples':a.samples,'sky':ref.get('skyReference') if a.sky else None,'limitations':['Offline Cycles render, not WebGL evidence.','Production direct-light positions, colors and inverse-square intensity; Cycles range/spot penumbra differs.','No ambient/fill flood. Optional upper-hemisphere world sky uses actual occluded transport. Runtime specular room environment and ACES tone mapping are not reproduced.']},indent=2))
