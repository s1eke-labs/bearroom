import bpy,json,struct,hashlib,os,math
from pathlib import Path
P=Path(__file__).resolve().parent;src=P/'bearroom-realism.blend';rt=P/'bearroom-realism.glb';bpy.ops.wm.open_mainfile(filepath=str(src));issues=[];checked=0
for o in bpy.data.objects:
 if o.type!='MESH':continue
 for m in o.data.materials:
  if not m or not m.use_nodes:continue
  for n in m.node_tree.nodes:
   if n.type=='NORMAL_MAP' and n.outputs['Normal'].is_linked:
    checked+=1
    if n.uv_map and n.uv_map not in o.data.uv_layers:issues.append({'object':o.name,'material':m.name,'missingNormalUv':n.uv_map})
raw=rt.read_bytes();n=struct.unpack_from('<I',raw,12)[0];j=json.loads(raw[20:20+n]);texchecks=0
for me in j['meshes']:
 for p in me['primitives']:
  m=j['materials'][p['material']]
  if m.get('normalTexture'):
   texchecks+=1;uv='TEXCOORD_'+str(m['normalTexture'].get('texCoord',0))
   if uv not in p['attributes']:issues.append({'mesh':me.get('name'),'material':m['name'],'missingExportNormalUv':uv})
report={'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'runtimeSha256':hashlib.sha256(raw).hexdigest(),'sourceNormalBindingsChecked':checked,'exportNormalTexturePrimitivesChecked':texchecks,'packedImages':sum(1 for i in bpy.data.images if i.packed_file),'issues':issues,'passed':not issues}
(P/'furniture-realism-review/final-material-binding-validation.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
