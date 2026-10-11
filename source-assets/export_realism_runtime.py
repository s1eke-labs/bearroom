"""Export authoritative combined realism source without replacing its editability.
Runs after offline review and before GI; compaction is a separate exact-data step.
"""
import bpy,os,sys,json
from collections import defaultdict
OUT=os.path.dirname(os.path.abspath(__file__))
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
src=args[0] if args else OUT+'/bearroom-realism.blend';dst=args[1] if len(args)>1 else OUT+'/bearroom-realism-raw.glb'
bpy.ops.wm.open_mainfile(filepath=src)
# Only optimize newly separated furniture; authoritative architecture names stay.
def furniture(o):
 r=o
 while r.parent:r=r.parent
 return (r.name.startswith('F') or r.name in ['Bear_reference_plush','Bear_desk_plush']) and r.type=='EMPTY'
for ob in list(bpy.data.objects):
 if ob.type not in ['MESH','CURVE']:continue
 if ob.type=='CURVE' or len(ob.modifiers):
  bpy.ops.object.select_all(action='DESELECT');ob.select_set(True);bpy.context.view_layer.objects.active=ob;bpy.ops.object.convert(target='MESH')
# A new joined detail without active vertex color must not erase siblings' AO.
for o in bpy.data.objects:
 if o.type!='MESH':continue
 mats=[m for m in o.data.materials if m and m.use_nodes]
 if any(n.type=='VERTEX_COLOR' and not n.layer_name for m in mats for n in m.node_tree.nodes):
  ca=o.data.color_attributes.get('Color')
  if ca is None:
   ca=o.data.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='POINT')
   for v in ca.data:v.color=(1,1,1,1)
  o.data.color_attributes.active_color=ca;o.data.color_attributes.render_color_index=list(o.data.color_attributes).index(ca)
groups=defaultdict(list)
for ob in list(bpy.data.objects):
 if ob.type!='MESH' or not furniture(ob):continue
 if 'surface_nap' in ob.name or ob.name in ['anim_sofa_edge','anim_bed_edge','anim_dining_edge']:continue
 if ob.name.startswith(('piano_key_','screen_','frame_','cutaway_','window_glass','street_ground','pc_glass')):continue
 groups[(ob.parent.name if ob.parent else '',tuple(m.name for m in ob.data.materials))].append(ob)
for (p,m),obs in groups.items():
 if len(obs)<2:continue
 bpy.ops.object.select_all(action='DESELECT')
 for o in obs:o.select_set(True)
 preserve=next((o for o in obs if o.name in ['Bear_reference_plush__fabric_bear','Bear_desk_plush__fabric_bear']),None)
 active=preserve or obs[0];keep=active.name if preserve else p+'__'+(m[0] if m else 'mesh')
 if p in ['Bear_reference_plush','Bear_desk_plush'] and m and m[0].startswith('embroidery_'):keep=p+'__embroidery_ink'
 bpy.context.view_layer.objects.active=active;bpy.ops.object.join();active.name=keep
 if active.data.color_attributes.get('Color'):
  active.data.color_attributes.active_color=active.data.color_attributes['Color'];active.data.color_attributes.render_color_index=list(active.data.color_attributes).index(active.data.color_attributes['Color'])
for ob in bpy.data.objects:ob.hide_render=False
bpy.ops.export_scene.gltf(filepath=dst,export_format='GLB',export_extras=True,export_cameras=False,export_lights=False,export_apply=True,export_draco_mesh_compression_enable=False)
report={'source':os.path.basename(src),'runtime':os.path.basename(dst),'furnitureRoots':len([o for o in bpy.data.objects if o.type=='EMPTY' and o.name.startswith('F')]),'pianoKeys':len([o for o in bpy.data.objects if o.name.startswith('piano_key_')]),'animatedNodes':[o.name for o in bpy.data.objects if o.name.startswith('anim_')],'meshObjects':len([o for o in bpy.data.objects if o.type=='MESH']),'rawBytes':os.path.getsize(dst)}
open(dst+'.report.json','w').write(json.dumps(report,indent=2));print('REALISM_RUNTIME_EXPORTED',report)
