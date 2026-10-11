"""v13 reference-led surface separation; import apply_materials_v13 after geometry.
Keeps shared packed textures/UVs and portable glTF PBR. No shader-only noise,
new lights, geometry, texture resolution, or bear material changes.
"""
import bpy,json,pathlib
P=pathlib.Path(__file__).resolve().parent

def linear(h):
 return tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in [int(h[i:i+2],16)/255 for i in (0,2,4)])

def apply_materials_v13(report_path=None):
 if bpy.context.scene.get('referenceMaterialSeparationVersion')==13:
  raise RuntimeError('v13 material patch already applied')
 report=[]
 palette={
  'fabric_tailored_boucle':dict(color='F2EADC',rough=.94,normal=.58,sheen=.23,sheenRough=.78),
  'fabric_tailored_fine_linen':dict(color='F5F0E7',rough=.88,normal=.22,sheen=.11,sheenRough=.67),
  'fabric_blush':dict(color='D6ABA5',rough=.94,normal=.34,sheen=.18,sheenRough=.76),
  'fabric_rug_loop_pile':dict(color='E5D9C6',rough=.98,normal=.82,sheen=.27,sheenRough=.84),
  'wood_oak_satin_furniture':dict(color='D2B18A',rough=.42,normal=.17,coat=.12,coatRough=.32),
  'wood_honey_oiled_furniture':dict(color='BC966C',rough=.52,normal=.15,coat=.06,coatRough=.36),
  'lacquer_pearl':dict(rough=.25,coat=.16,coatRough=.24),
  'piano_ivory_lacquer':dict(rough=.20,coat=.32,coatRough=.20),
  'metal_champagne':dict(rough=.25,metal=.9),
  'metal_graphite':dict(rough=.34,metal=.84),
  'plaster_warm_white':dict(rough=.94),
 }
 for name,q in palette.items():
  m=bpy.data.materials.get(name)
  if not m:raise RuntimeError('Missing material '+name)
  nt=m.node_tree;p=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED')
  def set_socket(k,val):
   for l in list(p.inputs[k].links):nt.links.remove(l)
   p.inputs[k].default_value=val
  if 'color' in q:
   rgb=(*linear(q['color']),1)
   # Recovered glTF has texture*factor, then vertex color. Preserve both links.
   fac=next((n for n in nt.nodes if n.type=='MIX' and n.data_type=='RGBA' and n.blend_type=='MULTIPLY' and n.inputs[6].is_linked and not n.inputs[7].is_linked),None)
   if fac:fac.inputs[7].default_value=rgb
   elif not p.inputs['Base Color'].is_linked:p.inputs['Base Color'].default_value=rgb
   else:raise RuntimeError('Unknown exportable factor path '+name)
   m.diffuse_color=rgb
  for key,sock in [('rough','Roughness'),('metal','Metallic'),('coat','Coat Weight'),('coatRough','Coat Roughness'),('sheenRough','Sheen Roughness')]:
   if key in q:set_socket(sock,q[key])
  if 'sheen' in q:
   set_socket('Sheen Weight',1);set_socket('Sheen Tint',(q['sheen'],q['sheen'],q['sheen'],1))
  if 'normal' in q:
   for n in nt.nodes:
    if n.type=='NORMAL_MAP':n.inputs['Strength'].default_value=q['normal']
  m['referenceSeparationV13']=json.dumps(q,sort_keys=True)
  report.append({'material':name,**q,'objects':sum(1 for o in bpy.data.objects if o.type in ['MESH','CURVE'] and m.name in o.data.materials)})
 bpy.context.scene['referenceMaterialSeparationVersion']=13
 data={'version':13,'changes':report,'preserved':['Existing packed PBR texture images and UVs','All bear materials','All object transforms and mesh counts','No new texture dimensions or postprocessing'],'reference':['docs/references/loft-day-v1.png','docs/references/loft-night-v1.png','docs/references/computer-corner-v1.png']}
 if report_path is not False:pathlib.Path(report_path or P/'material-light-v13-review/material-separation-report.json').write_text(json.dumps(data,indent=2)+'\n')
 return data
