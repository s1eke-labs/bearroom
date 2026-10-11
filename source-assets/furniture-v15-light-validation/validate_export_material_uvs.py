"""GLB PBR factors, embedded image payloads and explicit texture UV portability."""
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
  if 'index'in x and 'texCoord'in x or 'index'in x and set(x).issubset({'index','texCoord','scale','strength','extensions','extras'}):return {k:(tex[v] if k=='index' else normalize(v,tex)) for k,v in x.items() if k!='extras'}
  return {k:normalize(v,tex) for k,v in x.items() if k!='extras'}
 if isinstance(x,list):return [normalize(v,tex) for v in x]
 return x
bm={m['name']:normalize(m,btx) for m in bj['materials']};changed=[];new=[]
for m in j['materials']:
 name=m['name']
 if name not in bm:new.append(name)
 elif normalize(m,tx)!=bm[name]:changed.append(name)
if changed:issues.append({'changedPortableMaterials':changed})
if new:issues.append({'newMaterialClasses':new})
if set(hashes)!=set(bhashes):issues.append('Changed or new image payloads')
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
checked=0;normal=0;missing=[]
for me in j['meshes']:
 for p in me['primitives']:
  if 'material'not in p:continue
  m=j['materials'][p['material']]
  for name,t in bindings(m):
   checked+=1;normal+=name=='normalTexture';uv='TEXCOORD_'+str(t.get('extensions',{}).get('KHR_texture_transform',{}).get('texCoord',t.get('texCoord',0)))
   if uv not in p['attributes']:missing.append({'mesh':me.get('name'),'material':m['name'],'texture':name,'missingUv':uv})
   elif not np.isfinite(accessor(p['attributes'][uv])).all():issues.append('Nonfinite UV: '+me.get('name',''))
if missing:issues.append({'missingTextureBindings':missing})
report={'passed':not issues,'runtimeSha256':hashlib.sha256(raw).hexdigest(),'materialClassesChecked':len(j['materials']),'textureBindingsChecked':checked,'normalTextureBindingsChecked':normal,'embeddedImages':len(hashes),'uniqueImagePayloads':len(set(hashes)),'unchangedImagePayloads':set(hashes)==set(bhashes),'unchangedPortableMaterialFactors':not changed and not new,'issues':issues}
pathlib.Path(a.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2));raise SystemExit(bool(issues))
