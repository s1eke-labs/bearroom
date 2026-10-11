"""Read-only PC PBR/transparency/UV audit and unchanged-room material proof."""
import argparse,pathlib,gzip,struct,json,hashlib,math
import numpy as np
ap=argparse.ArgumentParser();ap.add_argument('--glb',required=True);ap.add_argument('--baseline',required=True);ap.add_argument('--output',required=True);a=ap.parse_args()
def read(p):
 raw=pathlib.Path(p).read_bytes()
 if raw[:2]==b'\x1f\x8b':raw=gzip.decompress(raw)
 n=struct.unpack_from('<I',raw,12)[0];j=json.loads(raw[20:20+n]);off=20+n;length=struct.unpack_from('<I',raw,off)[0];return raw,j,raw[off+8:off+8+length]
raw,j,bb=read(a.glb);br,bj,bbb=read(a.baseline);issues=[]
def imagehashes(doc,bin):
 out=[]
 for im in doc.get('images',[]):
  if 'bufferView'not in im:issues.append('External image payload: '+im.get('name',''));out.append('EXTERNAL');continue
  bv=doc['bufferViews'][im['bufferView']];offset=bv.get('byteOffset',0);out.append(hashlib.sha256(bin[offset:offset+bv['byteLength']]).hexdigest())
 return out
hashes=imagehashes(j,bb);bhashes=imagehashes(bj,bbb)
def texture_sources(doc,hashes):return [hashes[t['source']] for t in doc.get('textures',[])]
tx=texture_sources(j,hashes);btx=texture_sources(bj,bhashes)
def normalize(x,tex):
 if isinstance(x,dict):
  if 'index'in x and ('texCoord'in x or set(x).issubset({'index','texCoord','scale','strength','extensions','extras'})):return {k:(tex[v] if k=='index' else normalize(v,tex)) for k,v in x.items() if k!='extras'}
  return {k:normalize(v,tex) for k,v in x.items() if k!='extras'}
 if isinstance(x,list):return [normalize(v,tex) for v in x]
 return x
bm={m['name']:normalize(m,btx) for m in bj['materials']};changed=[];new=[]
for m in j['materials']:
 name=m['name']
 if name not in bm:new.append(name)
 elif normalize(m,tx)!=bm[name]:changed.append(name)
if changed:issues.append({'changedLegacyPortableMaterials':changed})
parents={c:i for i,n in enumerate(j['nodes']) for c in n.get('children',[])}
def root(i):
 while i in parents:i=parents[i]
 return j['nodes'][i].get('name')
def ancestor(i,name):
 while True:
  if j['nodes'][i].get('name')==name:return True
  if i not in parents:return False
  i=parents[i]
usage={m['name']:[] for m in j['materials']}
for ni,n in enumerate(j['nodes']):
 if 'mesh'not in n:continue
 for p in j['meshes'][n['mesh']]['primitives']:
  if 'material'in p:usage[j['materials'][p['material']]['name']].append({'node':n.get('name'),'pc':ancestor(ni,'F09_computer')})
for name in new:
 if any(not u['pc'] for u in usage[name]):issues.append('New PC material used outside case: '+name)
if not set(bhashes).issubset(set(hashes)):issues.append('Removed baseline image payloads')
def accessor(idx):
 ac=j['accessors'][idx];bv=j['bufferViews'][ac['bufferView']];dt={5126:'<f4',5125:'<u4',5123:'<u2',5122:'<i2',5121:'u1',5120:'i1'}[ac['componentType']];c={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[ac['type']];start=bv.get('byteOffset',0)+ac.get('byteOffset',0);stride=bv.get('byteStride',np.dtype(dt).itemsize*c);return np.ndarray((ac['count'],c),dtype=dt,buffer=bb,offset=start,strides=(stride,np.dtype(dt).itemsize))
def bindings(m):
 out=[]
 def visit(x,path):
  if not isinstance(x,dict):return
  for key,val in x.items():
   if isinstance(val,dict):
    if key.endswith('Texture') and 'index'in val:out.append((path+key,val))
    else:visit(val,path+key+'.')
 visit(m,'');return out
checked=0;normal=0;missing=[];pc=[];glass=[];emissive=[]
for ni,n in enumerate(j['nodes']):
 if 'mesh'not in n:continue
 ispc=ancestor(ni,'F09_computer')
 for p in j['meshes'][n['mesh']]['primitives']:
  if 'material'not in p:continue
  m=j['materials'][p['material']]
  for name,t in bindings(m):
   checked+=1;normal+=name=='normalTexture';uv='TEXCOORD_'+str(t.get('extensions',{}).get('KHR_texture_transform',{}).get('texCoord',t.get('texCoord',0)))
   if uv not in p['attributes']:missing.append({'mesh':n.get('name'),'material':m['name'],'texture':name,'missingUv':uv})
   elif not np.isfinite(accessor(p['attributes'][uv])).all():issues.append('Nonfinite UV: '+n.get('name',''))
  if not ispc:continue
  for attr,idx in p['attributes'].items():
   if not np.isfinite(accessor(idx)).all():issues.append('Nonfinite PC attribute: '+n.get('name','')+'/'+attr)
  row={'node':n.get('name'),'material':m['name'],'attributes':list(p['attributes']),'vertices':j['accessors'][p['attributes']['POSITION']]['count']}
  pc.append(row)
  if 'glass' in m['name'].lower():
   pbr=m.get('pbrMetallicRoughness',{});trans=m.get('extensions',{}).get('KHR_materials_transmission',{}).get('transmissionFactor',0)
   row={**row,'alphaMode':m.get('alphaMode','OPAQUE'),'alpha':pbr.get('baseColorFactor',[1,1,1,1])[3],'transmission':trans,'doubleSided':m.get('doubleSided',False),'roughness':pbr.get('roughnessFactor',1),'baseColor':pbr.get('baseColorFactor',[1,1,1,1])}
   glass.append(row)
   if trans>0:issues.append('PC glass uses full-screen transmission path: '+m['name'])
   if row['alphaMode']!='BLEND' or not .005<row['alpha']<.4:issues.append('PC glass is not clear alpha blend: '+m['name'])
  if max(m.get('emissiveFactor',[0,0,0]))>0:
   emissive.append({**row,'factor':m['emissiveFactor'],'strength':m.get('extensions',{}).get('KHR_materials_emissive_strength',{}).get('emissiveStrength',1)})
if missing:issues.append({'missingTextureBindings':missing})
if not glass:issues.append('No PC glazing found')
for name in ['pc16_rgb_side','pc16_rgb_top','pc16_rgb_rear','pc16_rgb_trim']:
 if not any(e['material']==name for e in emissive):issues.append('Missing RGB zone '+name)
report={'passed':not issues,'runtimeSha256':hashlib.sha256(raw).hexdigest(),'materialClassesChecked':len(j['materials']),'textureBindingsChecked':checked,'normalTextureBindingsChecked':normal,
'embeddedImages':len(hashes),'uniqueImagePayloads':len(set(hashes)),'preservedBaselineImagePayloads':set(bhashes).issubset(set(hashes)),'newImagePayloads':list(set(hashes)-set(bhashes)),
'unchangedLegacyPortableMaterialFactors':not changed,'newPCMaterials':new,'newPCMaterialFactors':[m for m in j['materials'] if m['name'] in new],'pcPrimitiveCount':len(pc),'pcPrimitives':pc,'pcGlass':glass,
'pcEmissive':emissive,'pcEmissiveMaterialCount':len(set(e['material'] for e in emissive)),'issues':issues}
pathlib.Path(a.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in {'newPCMaterialFactors','pcPrimitives','pcEmissive'}},indent=2));raise SystemExit(bool(issues))
