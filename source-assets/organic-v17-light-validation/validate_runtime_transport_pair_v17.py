"""Read-only canonical GLB/material/lighting provenance pairing for grounded v17."""
import argparse,pathlib,json,hashlib,struct,copy
p=argparse.ArgumentParser()
for key in ('source','glb','gi','source-materials','patch','patch-input','source-proof','export-report','light-pair','output'):p.add_argument('--'+key,required=True)
a=p.parse_args();sha=lambda b:hashlib.sha256(b).hexdigest();load=lambda f:json.loads(pathlib.Path(f).read_text());issues=[]
def check(flag,label):
 if not flag:issues.append(label)
def parse(path):
 raw=pathlib.Path(path).read_bytes();assert struct.unpack_from('<III',raw)==(0x46546c67,2,len(raw));n=struct.unpack_from('<I',raw,12)[0];return raw,json.loads(raw[20:20+n]),raw[20+n:]
raw,j,tail=parse(a.glb);before,jbefore,tailbefore=parse(a.patch_input);data=tail[8:];g=load(a.gi);src=load(a.source_materials);patch=load(a.patch);proof=load(a.source_proof);export=load(a.export_report);light=load(a.light_pair);sourcehash=sha(pathlib.Path(a.source).read_bytes());modelhash=sha(raw)
check(g['sourceSha256']==src['sourceSha256']==patch['sourceSha256']==proof['outputSha256']==sourcehash,'Frozen grounded source lineage mismatch')
check(modelhash==patch['outputModelSha256']==light['modelSha256'],'Canonical runtime model identity mismatch');check(sha(before)==patch['inputModelSha256'],'Root-patch input model mismatch')
check(sha(pathlib.Path(a.source_proof).read_bytes())==patch['sourceProofSha256'],'Source root-patch proof hash mismatch');check(sha(pathlib.Path(a.export_report).read_bytes())==patch['inputExportReportSha256'],'Input export proof hash mismatch')
check(export['sourceSha256']==patch['oldSourceSha256']==proof['sourceSha256'] and export['sourceUnchangedDuringExport'] is True,'Initial Blender export source not frozen')
idx=patch['nodeIndex'];check(j['nodes'][idx]['name']=='F16_reading_rocker','Wrong translated root');check(j['nodes'][idx]['translation']==patch['newTranslation'],'Incorrect final root translation')
reverted=copy.deepcopy(j);reverted['nodes'][idx]['translation']=patch['oldTranslation'];check(reverted==jbefore,'Other GLB JSON values changed');check(tail==tailbefore and sha(tail)==patch['binaryChunkSha256'],'Root patch changed binary geometry/images')
check(patch['translationDelta'][0]==patch['translationDelta'][2]==0 and abs(patch['translationDelta'][1]+.022)<1e-8,'Wrong rigid grounding delta')
check(light['passed'] and light['sourceSha256']==sourcehash,'Runtime light pairing failed')
def texture(idx):
 im=j['images'][j['textures'][idx]['source']];view=j['bufferViews'][im['bufferView']];encoded=data[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']];return {'imageName':im.get('name'),'mimeType':im['mimeType'],'sha256':sha(encoded),'bytes':len(encoded)}
materials={}
for name,s in src['materials'].items():
 m=next(m for m in j['materials'] if m.get('name')==name);pbr=m['pbrMetallicRoughness'];base=texture(pbr['baseColorTexture']['index']);source_node=s['inputs']['Base Color']['links'][0][0];check(base['sha256']==s['images'][source_node]['packedSha256'],name+' source/runtime diffuse bytes differ');check(pbr.get('baseColorFactor',[1,1,1,1])==[1,1,1,1],name+' unexpected albedo gain')
 normal=texture(m['normalTexture']['index']);source_normal=next(v for v in s['images'].values() if 'normal' in v['imageName']);check(normal['sha256']==source_normal['packedSha256'],name+' source/runtime normal image differs');check(abs(m['normalTexture'].get('scale',1)-s['normalStrength'])<1e-6,name+' normal strength differs')
 check(m.get('doubleSided',False)==s['doubleSided'],name+' face-culling differs');check(m.get('emissiveFactor',[0,0,0])==[0,0,0] and s['inputs']['Emission Strength']['value']==0,name+' unexpected emission');check(m.get('extensions',{}).get('KHR_materials_transmission',{}).get('transmissionFactor',0)==0 and s['inputs']['Transmission Weight']['value']==0,name+' unexpected transmission')
 mr=None
 if 'metallicRoughnessTexture' in pbr:
  mr=texture(pbr['metallicRoughnessTexture']['index']);source_mr=next(v for v in s['images'].values() if 'orm' in v['imageName']);check(mr['sha256']==source_mr['packedSha256'],name+' source/runtime packed ORM differs')
 else:check(abs(pbr.get('roughnessFactor',1)-s['inputs']['Roughness']['value'])<1e-6,name+' roughness scalar differs')
 materials[name]={'diffuse':base,'normal':normal,'normalStrength':s['normalStrength'],'metallicRoughness':mr,'sourceTextureBytesExact':True,'doubleSided':m.get('doubleSided',False)}
 if name=='botanical_v17_calathea_scanned':
  mask=g['botanicalAlphaAudit']['materials'][name];check(m.get('alphaMode')=='MASK' and m.get('alphaCutoff',.5)==.5 and m.get('doubleSided') is True and m.get('extras',{}).get('depthWrite') is True,'Botanical exported alpha/depth contract differs');check(base['sha256']==mask['packedDiffuseSha256'],'Actual runtime leaf alpha differs from GI');materials[name]['alphaMode']='MASK';materials[name]['alphaCutoff']=.5;materials[name]['alphaSameAsGIBake']=True
plants=[n for n in j['nodes'] if n.get('extras',{}).get('organicPlantV17')];check(sorted(n['name'] for n in plants)==g['botanicalAlphaAudit']['objects'],'Runtime botanical instance set differs from bake')
check(all(any(n.get('name')==name for n in j['nodes']) for name in g['dynamicPCRotorRootsExcluded']),'Runtime dynamic PC rotor set does not pair')
result={'passed':not issues,'sourceSha256':sourcehash,'modelSha256':modelhash,'giSha256':sha(pathlib.Path(a.gi).read_bytes()),'lineage':'Full Blender export from frozen pre-grounding source; exact-data compaction and scoped organic normals; independently source-proven rigid-only root translation to grounded master. This is not a fresh whole-scene Blender export after grounding.','rootPatchProofSha256':sha(pathlib.Path(a.patch).read_bytes()),'rootPatchOnlyTranslationVerified':reverted==jbefore and tail==tailbefore,'materials':materials,'botanicalInstancesPaired':len(plants),'lightAnchorsPaired':len(light['anchors']),'maxAnchorDeltaMetres':max(x['deltaMetres'] for x in light['anchors']),'livingTargetDeltaMetres':light['livingTarget']['deltaMetres'],'wholeSceneGeometryEquivalence':'Integrator-owned separate check; this audit establishes actual light/material/alpha and strict root-patch lineage.','issues':issues}
pathlib.Path(a.output).write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k!='materials'},indent=2));raise SystemExit(bool(issues))
