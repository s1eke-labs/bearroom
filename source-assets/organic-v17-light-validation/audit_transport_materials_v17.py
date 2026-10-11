"""Read-only source transport-material/image fingerprint for final GLB pairing."""
import bpy,sys,pathlib,json,hashlib
source,out=map(pathlib.Path,sys.argv[sys.argv.index('--')+1:]);sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();sourcehash=sha(source);bpy.ops.wm.open_mainfile(filepath=str(source));materials={}
for m in bpy.data.materials:
 if not (m.name.startswith('fabric_v17_') or m.name.startswith('botanical_v17_')):continue
 p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');record={'inputs':{},'images':{},'doubleSided':not m.use_backface_culling}
 for name in ['Base Color','Roughness','Metallic','Alpha','Transmission Weight','Emission Strength']:
  sock=p.inputs[name];v=sock.default_value
  try:v=list(v)
  except TypeError:pass
  record['inputs'][name]={'value':v,'links':[(l.from_node.name,l.from_socket.name) for l in sock.links]}
 for n in m.node_tree.nodes:
  if n.type=='TEX_IMAGE' and n.image:
   im=n.image;record['images'][n.name]={'imageName':im.name,'colorspace':im.colorspace_settings.name,'size':list(im.size),'packedSha256':hashlib.sha256(im.packed_file.data).hexdigest() if im.packed_file else None}
  elif n.type=='NORMAL_MAP':record['normalStrength']=n.inputs['Strength'].default_value
 materials[m.name]=record
report={'sourceSha256':sourcehash,'sourceUnchanged':sha(source)==sourcehash,'materials':materials};out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'sourceSha256':sourcehash,'sourceUnchanged':report['sourceUnchanged'],'materials':list(materials)}))
