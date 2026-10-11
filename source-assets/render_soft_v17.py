"""Unobstructed same-camera offline inspection. Never live WebGL evidence."""
import bpy,sys,json,hashlib,math
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parent;W=P/'soft-v17-work'
args=sys.argv[sys.argv.index('--')+1:];src=Path(args[0]);tag=args[1];view=args[2] if len(args)>2 else 'sofa';mode=args[3] if len(args)>3 else 'studio'
bpy.ops.wm.open_mainfile(filepath=str(src));s=bpy.context.scene
views={
 'sofa':((-4.15,-4.65,2.10),(-.64,-2.14,.73),'F01_sofa'),
 'sofaeye':((-3.10,-3.7,1.614),(-.6,-2.10,.78),'F01_sofa'),
 'chaireye':((2.10,-.50,1.614),(3.50,-1.15,.88),'F11_computer_chair'),
 'chair':((5.6,1.0,1.614),(3.50,-1.15,.79),'F11_computer_chair'),
 'chairback':((5.5,-3.9,1.614),(3.50,-1.15,.79),'F11_computer_chair'),
 'rockereye':((4.2,.2,4.73),(2.4,1.05,3.88),'F16_reading_rocker'),
 'rockerback':((4.3,3.5,4.78),(2.4,1.05,3.90),'F16_reading_rocker'),
 'rockerside':((5.3,1.0,4.78),(2.4,1.05,3.90),'F16_reading_rocker'),
 'rocker':((4.4,-1.2,4.85),(2.4,1.05,3.90),'F16_reading_rocker')}
pos,target,root=views[view]
for o in list(bpy.data.objects):
 if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
for o in s.objects:
 if o.type not in ['MESH','CURVE']:continue
 if mode=='studio':
  r=o
  while r.parent:r=r.parent
  o.hide_render=r.name!=root
  if root=='F01_sofa' and r.name=='Bear_reference_plush':o.hide_render=False
 else:
  o.hide_render=False
  if any(k in o.name for k in ['wall_east','wall_south']):o.hide_render=True
  # Accurate geometry, selected cutaway to inspect the living seating.
  if view.startswith('sofa') and (o.name.startswith(('cutaway_upper','cutaway_loft')) or (o.parent and o.parent.name=='F03_television')):o.hide_render=True
if mode!='studio':
 for material in bpy.data.materials:
  if not material.use_nodes:continue
  for node in list(material.node_tree.nodes):
   if node.type=='BSDF_PRINCIPLED' and node.inputs['Emission Strength'].default_value>0:
    energy=node.inputs['Emission Strength'].default_value;lp=material.node_tree.nodes.new('ShaderNodeLightPath');mul=material.node_tree.nodes.new('ShaderNodeMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=energy;material.node_tree.links.new(lp.outputs['Is Camera Ray'],mul.inputs[0]);material.node_tree.links.new(mul.outputs[0],node.inputs['Emission Strength'])
world=bpy.data.worlds.new('v17 inspection world');world.use_nodes=True;world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.45,.45,.45,1);world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.24 if mode=='studio' else .0;s.world=world
if mode=='studio':
 z=3.130 if view.startswith('rocker') else (.014 if view.startswith('chair') else .065)
 bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,z));o=bpy.context.object;m=bpy.data.materials.new('neutral inspection floor');m.diffuse_color=(.22,.22,.22,1);m.use_nodes=True;m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(.22,.22,.22,1);m.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.83;o.data.materials.append(m)
 for name,loc,power,size in [('key',Vector(target)+Vector((-3,-2,4)),600,4),('rim',Vector(target)+Vector((2,2,3)),400,3)]:
  d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
else:
 sys.path.insert(0,str(P/'gi-rebuild'));import bake_indirect as gi
 ref=json.loads((P/'gi-rebuild/reference-v13.json').read_text());lights,desc=gi.configure_lights(ref)
 for light,night,day in lights:light.data.energy=night if mode=='production-night' else day
 gi.configure_sky_world(ref,0 if mode=='production-night' else None)
bpy.ops.object.camera_add(location=pos);c=bpy.context.object;c.rotation_euler=(Vector(target)-c.location).to_track_quat('-Z','Y').to_euler();c.data.lens=34 if view in ['chaireye','rockereye'] else 49;c.data.clip_start=.03;s.camera=c
s.render.engine='CYCLES';s.cycles.samples=144;s.cycles.use_denoising=False;s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.03;s.cycles.max_bounces=6;s.cycles.diffuse_bounces=4;s.render.threads_mode='FIXED';s.render.threads=6;s.view_settings.view_transform='AgX';s.view_settings.exposure=0
s.render.resolution_x=1100;s.render.resolution_y=820;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(W/f'{tag}-{view}-{mode}.png');bpy.ops.render.render(write_still=True)
(W/f'{tag}-{view}-{mode}.json').write_text(json.dumps({'source':str(src),'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'camera':pos,'target':target,'mode':mode,'view':view,'limits':['Offline Cycles geometry/material study, not WebGL or performance evidence.','Studio mode intentionally uses isolated geometry and neutral area lights. Production mode keeps actual source positions/intensities with Cycles transport and AgX.']},indent=2))
