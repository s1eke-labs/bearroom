"""Read-only final v19 source/material/light/alpha pairing with a canonical GLB.

Full mesh equivalence/export provenance is a separate integrator-owned gate.
"""
import argparse,pathlib,json,hashlib,struct,gzip,math,io
from PIL import Image
import numpy as np
ap=argparse.ArgumentParser()
for key in ('source','glb','gi','source-materials','light-pair','output'):ap.add_argument('--'+key,required=True)
a=ap.parse_args();sha=lambda b:hashlib.sha256(b).hexdigest();load=lambda f:json.loads(pathlib.Path(f).read_text());issues=[]
def check(flag,label):
 if not flag:issues.append(label)
raw=pathlib.Path(a.glb).read_bytes()
if raw[:2]==b'\x1f\x8b':raw=gzip.decompress(raw)
assert struct.unpack_from('<III',raw)==(0x46546c67,2,len(raw));n=struct.unpack_from('<I',raw,12)[0];j=json.loads(raw[20:20+n]);bsize,btype=struct.unpack_from('<II',raw,20+n);data=raw[28+n:28+n+bsize]
g=load(a.gi);src=load(a.source_materials);light=load(a.light_pair);sourcehash=sha(pathlib.Path(a.source).read_bytes());modelhash=sha(raw)
check(g['sourceSha256']==src['sourceSha256']==light['sourceSha256']==sourcehash,'Final frozen source identity mismatch');check(modelhash==light['modelSha256'],'Canonical runtime model identity mismatch');check(src['sourceUnchanged'] is True,'Source changed during fingerprinting');check(light['passed'] is True,'Runtime light pairing failed')
def texture(idx):
 im=j['images'][j['textures'][idx]['source']];view=j['bufferViews'][im['bufferView']];encoded=data[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']];return {'imageName':im.get('name'),'mimeType':im['mimeType'],'sha256':sha(encoded),'bytes':len(encoded)}
def close(a,b,tol=1e-6):
 if isinstance(a,list):return isinstance(b,list) and len(a)==len(b) and all(close(x,y,tol) for x,y in zip(a,b))
 return abs(a-b)<=tol
byname={m.get('name'):m for m in j['materials']};materials={}
for name,s in src['materials'].items():
 if name not in byname:check(False,'Source material absent in runtime: '+name);continue
 m=byname[name];pbr=m.get('pbrMetallicRoughness',{});inputs=s['inputs'];record={'doubleSided':m.get('doubleSided',False),'transportRole':s['transportRole'],'bathroomMaterial':s['bathroomMaterial'],'sourceTextureBytesExact':True}
 if s['principalNodeCount']!=1:check(False,name+' has unsupported principal closure count');continue
 check(m.get('doubleSided',False)==s['doubleSided'],name+' face culling differs')
 expressions=s['pbrExpressions'];base_expr=expressions['Base Color'];factor=base_expr['factor'];base_factor=list(factor) if isinstance(factor,list) else [factor]*4
 if not inputs['Alpha']['links']:base_factor[3]=inputs['Alpha']['value']
 check(close(pbr.get('baseColorFactor',[1,1,1,1]),base_factor),name+' base factor differs from actual source multiplier graph')
 record['baseColorFactor']=base_factor;record['sourceVertexColorMultiplication']=base_expr['vertexColors']
 if base_expr['textures']:
  idx=pbr.get('baseColorTexture',{}).get('index');check(idx is not None,name+' runtime diffuse image missing')
  if idx is not None:
   base=texture(idx);source_images=[s['images'][x['node']] for x in base_expr['textures']];check(len(source_images)==1 and base['sha256']==source_images[0]['packedSha256'],name+' diffuse bytes differ');record['diffuse']=base
 else:check('baseColorTexture' not in pbr,name+' unexpected runtime diffuse texture')
 for prop,source_input,default in [('roughnessFactor','Roughness',1),('metallicFactor','Metallic',1)]:
  check(close(pbr.get(prop,default),expressions[source_input]['factor']),name+' '+source_input+' multiplier differs')
 if 'normalStrength' in s:
  idx=m.get('normalTexture',{}).get('index');check(idx is not None,name+' normal image missing')
  if idx is not None:
   normal=texture(idx);candidates=[v for v in s['images'].values() if 'normal' in v['imageName'].lower()];check(any(normal['sha256']==v['packedSha256'] for v in candidates),name+' normal bytes differ');check(close(m['normalTexture'].get('scale',1),s['normalStrength']),name+' normal strength differs');record['normal']=normal
 if 'metallicRoughnessTexture' in pbr:
  idx=pbr['metallicRoughnessTexture']['index'];mr=texture(idx);im=j['images'][j['textures'][idx]['source']];view=j['bufferViews'][im['bufferView']];encoded=data[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']];pixels=np.asarray(Image.open(io.BytesIO(encoded)).convert('RGB'));channel_checks={}
  for source_input,channel in [('Roughness',1),('Metallic',2)]:
   expr=expressions[source_input]
   if expr['factor']==0:channel_checks[source_input]='Zero multiplier: encoded channel cannot affect response';continue
   if expr['textures']:
    candidates=[s['images'][x['node']] for x in expr['textures']];check(len(candidates)==1 and mr['sha256']==candidates[0]['packedSha256'],name+' '+source_input+' source/runtime image bytes differ');channel_checks[source_input]='Exact packed source image'
   else:
    check(bool(np.all(pixels[:,:,channel]==255)),name+' constant '+source_input+' changed by nonwhite runtime packed channel');channel_checks[source_input]='Constant source: runtime packed channel verified all 255'
  record['metallicRoughness']=mr;record['packedChannelChecks']=channel_checks
 else:
  check(all(not expressions[key]['textures'] or expressions[key]['factor']==0 for key in ['Roughness','Metallic']),name+' source PBR texture missing at runtime')
 transmission=m.get('extensions',{}).get('KHR_materials_transmission',{}).get('transmissionFactor',0)
 if not inputs['Transmission Weight']['links']:check(close(transmission,inputs['Transmission Weight']['value']),name+' transmission differs')
 if inputs['Emission Strength']['value']==0:check(m.get('emissiveFactor',[0,0,0])==[0,0,0],name+' unexpected emitted runtime energy')
 if name=='botanical_v17_calathea_scanned':
  mask=g['botanicalAlphaAudit']['materials'][name];check(m.get('alphaMode')=='MASK' and m.get('alphaCutoff',.5)==.5 and m.get('doubleSided') is True and m.get('extras',{}).get('depthWrite') is True,'Botanical runtime alpha/depth contract differs');check(record.get('diffuse',{}).get('sha256')==mask['packedDiffuseSha256'],'Actual runtime alpha differs from GI');record['alphaSameAsGIBake']=True
 materials[name]=record
plants=[x for x in j['nodes'] if x.get('extras',{}).get('organicPlantV17')];check(sorted(x['name'] for x in plants)==g['botanicalAlphaAudit']['objects'],'Botanical instance set differs from GI');check(all(any(x.get('name')==name for x in j['nodes']) for name in g['dynamicPCRotorRootsExcluded']),'Dynamic PC rotor set does not pair')
result={'passed':not issues,'sourceSha256':sourcehash,'modelSha256':modelhash,'giSha256':sha(pathlib.Path(a.gi).read_bytes()),'sourceMaterialsSha256':sha(pathlib.Path(a.source_materials).read_bytes()),'materials':materials,'bathroomMaterialsPaired':sum(x['bathroomMaterial'] for x in materials.values()),'botanicalInstancesPaired':len(plants),'lightAnchorsPaired':len(light['anchors']),'maxAnchorDeltaMetres':max(x['deltaMetres'] for x in light['anchors']),'livingTargetDeltaMetres':light['livingTarget']['deltaMetres'],'wholeSceneGeometryEquivalence':'Separate integrator-owned gate; this check establishes actual light/material/alpha pairing only.','issues':issues}
pathlib.Path(a.output).write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k!='materials'},indent=2));raise SystemExit(bool(issues))
