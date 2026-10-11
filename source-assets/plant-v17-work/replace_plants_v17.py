'''Idempotent, narrowly scoped vegetation replacement. Does not open/save unless CLI.
Five existing leafy pot positions receive five different CC0 Poly Haven variants.
Original pot/soil geometry and two flower arrangements are preserved exactly.
'''
import bpy,bmesh,json,math,hashlib,sys,argparse
from pathlib import Path
from mathutils import Vector,Matrix
P=Path(__file__).resolve().parent
PREFIX='botanical_v17_'
PLACEMENTS=[
 {'id':'floor_corner','root':[-4.55,3.52,.284],'variant':'a','desiredScale':1.12,'yaw':.4},
 {'id':'loft_bedside','root':[-3.25,3.45,3.319],'variant':'c','desiredScale':.90,'yaw':2.1},
 {'id':'loft_reading','root':[3.53,.57,3.352],'variant':'b','desiredScale':1.13,'yaw':-1.0},
 {'id':'desk','root':[2.56,.20,.961],'variant':'d','desiredScale':.93,'yaw':1.0},
 {'id':'kitchen','root':[-2.,3.60,1.031],'variant':'e','desiredScale':.83,'yaw':-2.2},
]
def bounds(points):return [[min(v[i] for v in points) for i in range(3)],[max(v[i] for v in points) for i in range(3)]]
def object_hash(o):
 h=hashlib.sha256();h.update(str(list(map(list,o.matrix_world))).encode());h.update(bytes(str([(tuple(v.co)) for v in o.data.vertices]),'utf8'));h.update(bytes(str([tuple(f.vertices) for f in o.data.polygons]),'utf8'));return h.hexdigest()
def apply_plants_v17():
 s=bpy.context.scene
 # Existing geometry is matched by spatial location, not fragile vertex indices.
 old=bpy.data.objects.get('Decor__botanical_sage');assert old and old.type=='MESH'
 protected={name:object_hash(bpy.data.objects[name]) for name in ['Decor__ceramic_ivory','Decor__wood_honey','Decor__lacquer_pearl']}
 previous=json.loads(s.get('plantV17OriginalBounds','{}'))
 verts_by_plant={};remove=set()
 for p in PLACEMENTS:
  root=Vector(p['root']);ids=[];pts=[]
  for v in old.data.vertices:
   q=old.matrix_world@v.co
   if (Vector((q.x-root.x,q.y-root.y,0)).length<.65 and root.z-.06<q.z<root.z+1.1):ids.append(v.index);pts.append(q)
  verts_by_plant[p['id']]=ids;remove.update(ids)
  if pts:previous[p['id']]=bounds(pts)
  assert p['id'] in previous,'Could not establish original plant footprint'
 s['plantV17OriginalBounds']=json.dumps(previous)
 before_triangles=sum(len(f.vertices)-2 for f in old.data.polygons)
 if remove:
  bm=bmesh.new();bm.from_mesh(old.data);bm.verts.ensure_lookup_table();bmesh.ops.delete(bm,geom=[bm.verts[i] for i in sorted(remove)],context='VERTS');bm.to_mesh(old.data);bm.free();old.data.update()
 for o in list(bpy.data.objects):
  if o.name.startswith(PREFIX):
   owned_mesh=o.data if o.type=='MESH' else None
   bpy.data.objects.remove(o,do_unlink=True)
   if owned_mesh is not None and owned_mesh.users==0:bpy.data.meshes.remove(owned_mesh)
 # Remove prior material only after all owned objects are gone; never touch others.
 for m in list(bpy.data.materials):
  if m.name.startswith('botanical_v17') and m.users==0:bpy.data.materials.remove(m)
 known=set(bpy.data.objects)
 bpy.ops.import_scene.gltf(filepath=str(P/'source-polyhaven/calathea_orbifolia_01_1k.gltf'))
 imported=[o for o in bpy.data.objects if o not in known]
 plants={o.name.rsplit('_',1)[-1]:o for o in imported if o.type=='MESH'}
 mat=plants['a'].data.materials[0];mat.name='botanical_v17_calathea_scanned';mat.use_backface_culling=False;mat.surface_render_method='DITHERED';mat.alpha_threshold=.5
 mat['alphaMode']='MASK';mat['alphaCutoff']=.5;mat['organicPlantV17']=True;mat['depthWrite']=True;mat['sourceURL']='https://polyhaven.com/a/calathea_orbifolia_01';mat['license']='CC0-1.0'
 nt=mat.node_tree;bsdf=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED');bsdf.inputs['Subsurface Weight'].default_value=0;bsdf.inputs['Transmission Weight'].default_value=0;bsdf.inputs['Metallic'].default_value=0;bsdf.inputs['Specular IOR Level'].default_value=.35;bsdf.inputs['Specular Tint'].default_value=(1,1,1,1)
 for node in nt.nodes:
  if node.type!='TEX_IMAGE':continue
  oldname=node.image.name
  filename='calathea_diffuse_alpha_512.png' if '_diff' in oldname else 'calathea_normal_512.jpg' if '_nor_' in oldname else 'calathea_orm_256.jpg'
  im=bpy.data.images.load(str(P/'runtime-textures'/filename),check_existing=True);im.name='botanical_v17_'+filename;im.colorspace_settings.name='sRGB' if '_diffuse_' in filename else 'Non-Color';node.image=im;im.pack()
 # Keep source MASK comparator, which round-trips through glTF as alphaCutoff=.5.
 output=[]
 for p in PLACEMENTS:
  o=plants[p['variant']];o.name=PREFIX+p['id'];o.parent=bpy.data.objects['Decor'];o.rotation_mode='XYZ';o.location=p['root'];o.rotation_euler=(0,0,p['yaw']);o.scale=(1,1,1)
  local=[v.co.copy() for v in o.data.vertices];oldb=previous[p['id']]
  # Fit only within the old foliage's XY footprint; no walking/glazing expansion.
  best=None
  for k in range(72):
   angle=p['yaw']+k*math.tau/72;rot=Matrix.Rotation(angle,3,'Z');bp=bounds([rot@v for v in local]);cap=p['desiredScale']
   for axis in [0,1]:
    if bp[0][axis]<-1e-6:cap=min(cap,(p['root'][axis]-oldb[0][axis]-.006)/(-bp[0][axis]))
    if bp[1][axis]>1e-6:cap=min(cap,(oldb[1][axis]-p['root'][axis]-.006)/bp[1][axis])
   score=cap-.001*k
   if best is None or score>best[0]:best=(score,cap,angle)
  scale=best[1];assert scale>.45
  o.scale=(scale,scale,scale);o.rotation_euler.z=best[2]
  o.data['organicPlantV17']=True;o['organicPlantV17']=True;o['plantNoBatch']=True;o['plantPlacement']=p['id'];o['plantSpecies']='Goeppertia orbifolia (Calathea orbifolia)';o['plantVariant']=p['variant'];o['sourceURL']='https://polyhaven.com/a/calathea_orbifolia_01';o['license']='CC0-1.0';o['plantRootXYZ']=p['root'];o['alphaMode']='MASK';o['alphaCutoff']=.5
  for f in o.data.polygons:f.use_smooth=True
  bpy.context.view_layer.update();nb=bounds([o.matrix_world@v.co for v in o.data.vertices]);root=p['root']
  output.append({'id':p['id'],'object':o.name,'rootBlenderXYZ':root,'variant':p['variant'],'scale':scale,'yaw':best[2],'vertices':len(o.data.vertices),'triangles':sum(len(f.vertices)-2 for f in o.data.polygons),'oldFoliageBounds':oldb,'newFoliageBounds':nb,'insideOriginalXYFootprint':all(nb[0][i]>=oldb[0][i]-.0001 and nb[1][i]<=oldb[1][i]+.0001 for i in [0,1]),'rootSubmergenceBelowSoilM':root[2]-nb[0][2]})
 for o in imported:
  if o.type!='MESH':bpy.data.objects.remove(o,do_unlink=True)
 # Scope a cloned earthy material only to the five existing soil surfaces.
 soil=bpy.data.materials.get('botanical_v17_potting_soil') or bpy.data.materials.new('botanical_v17_potting_soil');soil.use_nodes=True
 sn=soil.node_tree;sn.nodes.clear();sp=sn.nodes.new('ShaderNodeBsdfPrincipled');so=sn.nodes.new('ShaderNodeOutputMaterial');sn.links.new(sp.outputs['BSDF'],so.inputs['Surface']);sp.inputs['Roughness'].default_value=.96;sp.inputs['Specular IOR Level'].default_value=.2;sp.inputs['IOR'].default_value=1.45
 for filename,semantic in [('soil_earth_color_256.jpg','color'),('soil_earth_normal_128.jpg','normal')]:
  im=bpy.data.images.load(str(P/'runtime-textures'/filename),check_existing=True);im.colorspace_settings.name='sRGB' if semantic=='color' else 'Non-Color';im.pack();tex=sn.nodes.new('ShaderNodeTexImage');tex.image=im
  if semantic=='color':sn.links.new(tex.outputs['Color'],sp.inputs['Base Color'])
  else:
   nor=sn.nodes.new('ShaderNodeNormalMap');nor.inputs['Strength'].default_value=.5;sn.links.new(tex.outputs['Color'],nor.inputs['Color']);sn.links.new(nor.outputs['Normal'],sp.inputs['Normal'])
 soil['organicPlantSoilV17']=True;soil['source']='Authored deterministic procedural organic-grain texture';soil['scope']='Only the five original pot soil surfaces; shared wood material unchanged'
 wo=bpy.data.objects['Decor__wood_honey'];slots=[m.name for m in wo.data.materials]
 if soil.name not in slots:wo.data.materials.append(soil)
 soil_index=list(wo.data.materials).index(soil);soil_changes=[]
 for p in PLACEMENTS:
  root=Vector(p['root']);indices=[]
  for face in wo.data.polygons:
   pts=[wo.matrix_world@wo.data.vertices[i].co for i in face.vertices]
   if all(abs(q.z-root.z)<.012 and ((q.x-root.x)**2+(q.y-root.y)**2)**.5<.17 for q in pts):
    face.material_index=soil_index;indices.append(face.index)
  assert indices,'Missing soil surface '+p['id']
  soil_changes.append({'placement':p['id'],'object':'Decor__wood_honey','material':soil.name,'faceIndices':indices,'faceCount':len(indices),'geometryChanged':False})
 after_triangles=sum(len(f.vertices)-2 for f in old.data.polygons)
 protected_after={n:object_hash(bpy.data.objects[n]) for n in protected}
 assert protected==protected_after,'Pot, soil or flower-head geometry changed'
 assert all(x['insideOriginalXYFootprint'] for x in output)
 r={'version':17,'source':'https://polyhaven.com/a/calathea_orbifolia_01','license':'CC0-1.0','placements':output,'removedOriginalVertices':len(remove),'removedOriginalTriangles':before_triangles-after_triangles,'addedVertices':sum(x['vertices'] for x in output),'addedTriangles':sum(x['triangles'] for x in output),'foliageMaterials':1,'soilMaterials':1,'soilMaterialChanges':soil_changes,'uniqueMeshVariants':5,'textureSharedAcrossAllPlants':True,'textureBytes':sum(f.stat().st_size for f in (P/'runtime-textures').glob('*') if f.is_file()),'protectedGeometryHashes':protected,'potsSoilAndFlowersGeometryPreserved':True,'soilMaterialCorrectedOnFiveSurfaces':True,'trailingBookcasePlant':'Not added: no existing plant/pot placement there in source.','animatedCategoriesUnchanged':True,'runtimeMaterialRequirements':{'alphaMode':'MASK','alphaCutoff':.5,'doubleSided':True,'depthWrite':True,'transparent':False,'transmission':0,'subsurface':0}}
 s['plantV17Report']=json.dumps(r);return r
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--source',default=str(P.parent/'bearroom-pc-v16.blend'));ap.add_argument('--output',default=str(P/'plants-v17-review.blend'));a=ap.parse_args(sys.argv[sys.argv.index('--')+1:]);assert Path(a.source).resolve()!=Path(a.output).resolve();bpy.ops.wm.open_mainfile(filepath=a.source);r=apply_plants_v17();bpy.ops.wm.save_as_mainfile(filepath=a.output);(P/'plant-replacement-report.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2))
