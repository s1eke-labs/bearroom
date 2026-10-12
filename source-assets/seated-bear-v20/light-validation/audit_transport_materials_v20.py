"""Read-only transport fingerprint of final-source bathroom and organic materials."""
import bpy,sys,pathlib,json,hashlib
source,out=map(pathlib.Path,sys.argv[sys.argv.index('--')+1:]);sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();sourcehash=sha(source);bpy.ops.wm.open_mainfile(filepath=str(source));materials={};bath_materials=set()
def root_name(o):
 while o.parent:o=o.parent
 return o.name
def mul(a,b):
 if isinstance(a,list) or isinstance(b,list):
  if not isinstance(a,list):a=[a]*len(b)
  if not isinstance(b,list):b=[b]*len(a)
  return [x*y for x,y in zip(a,b)]
 return a*b
def expression(sock):
 if not sock.is_linked:
  value=sock.default_value
  try:value=list(value)
  except TypeError:pass
  return {'factor':value,'textures':[],'vertexColors':[]}
 link=sock.links[0];node=link.from_node;output=link.from_socket
 if node.type=='TEX_IMAGE':return {'factor':[1,1,1,1] if output.name=='Color' else 1,'textures':[{'node':node.name,'channel':'RGBA' if output.name=='Color' else 'A'}],'vertexColors':[]}
 if node.type=='VERTEX_COLOR':return {'factor':[1,1,1,1],'textures':[],'vertexColors':[node.layer_name]}
 if node.type=='SEPARATE_COLOR':
  q=expression(node.inputs['Color']);i=['Red','Green','Blue'].index(output.name)
  if isinstance(q['factor'],list):q['factor']=q['factor'][i]
  for t in q['textures']:t['channel']='RGB'[i]
  return q
 if node.type=='MATH' and node.operation=='MULTIPLY':aa,bb=[expression(x) for x in list(node.inputs)[:2]]
 elif node.type=='MIX' and node.data_type=='RGBA' and node.blend_type=='MULTIPLY':
  enabled=[x for x in node.inputs if x.enabled]
  factor=next(x for x in enabled if x.name=='Factor')
  if factor.is_linked or factor.default_value!=1:raise ValueError('Unsupported partial mix factor')
  aa=expression(next(x for x in enabled if x.name=='A'));bb=expression(next(x for x in enabled if x.name=='B'))
 else:raise ValueError('Unsupported source PBR factor graph: '+node.type)
 return {'factor':mul(aa['factor'],bb['factor']),'textures':aa['textures']+bb['textures'],'vertexColors':aa['vertexColors']+bb['vertexColors']}
for ob in bpy.context.scene.objects:
 if ob.type=='MESH' and (root_name(ob) in {'F20_vanity','F21_bathroom','Bathroom_architecture'} or ob.name.startswith(('cutaway_bathroom','bathroom_')) or ob.get('bathroomV19',False)):
  bath_materials.update(m.name for m in ob.data.materials if m)
for m in bpy.data.materials:
 if not (m.name.startswith(('fabric_v17_','botanical_v17_')) or m.name in bath_materials):continue
 principals=[n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'] if m.use_nodes else []
 record={'inputs':{},'images':{},'doubleSided':not m.use_backface_culling,'bathroomMaterial':m.name in bath_materials,'principalNodeCount':len(principals),'transportRole':'excluded glass approximation' if 'glass' in m.name.lower() else 'retained stationary surface','alphaMode':m.get('alphaMode','OPAQUE'),'alphaCutoff':m.get('alphaCutoff',.5)}
 if len(principals)==1:
  p=principals[0]
  for name in ['Base Color','Roughness','Metallic','Alpha','Transmission Weight','Emission Color','Emission Strength','IOR']:
   sock=p.inputs[name];v=sock.default_value
   try:v=list(v)
   except TypeError:pass
   record['inputs'][name]={'value':v,'links':[(l.from_node.name,l.from_socket.name) for l in sock.links]}
 if len(principals)==1:record['pbrExpressions']={name:expression(p.inputs[name]) for name in ['Base Color','Roughness','Metallic']}
 if m.use_nodes:
  for n in m.node_tree.nodes:
   if n.type=='TEX_IMAGE' and n.image:
    im=n.image;record['images'][n.name]={'imageName':im.name,'colorspace':im.colorspace_settings.name,'size':list(im.size),'packedSha256':hashlib.sha256(im.packed_file.data).hexdigest() if im.packed_file else None}
   elif n.type=='NORMAL_MAP':record['normalStrength']=n.inputs['Strength'].default_value
 materials[m.name]=record
unchanged=sha(source)==sourcehash
report={'passed':unchanged,'sourceSha256':sourcehash,'sourceUnchanged':unchanged,'bathroomMaterialNames':sorted(bath_materials),'materials':materials};out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'sourceSha256':sourcehash,'sourceUnchanged':unchanged,'materials':list(materials)}))
if not unchanged:raise RuntimeError('Source changed during material fingerprinting')
