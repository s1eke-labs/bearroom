"""Independent actual-GLB botanical/fabric material and finite-geometry audit."""
import json,sys,gzip,struct,hashlib,io
from pathlib import Path
import numpy as np
from PIL import Image
src,out=map(Path,sys.argv[1:3]);raw=src.read_bytes();raw=gzip.decompress(raw) if raw[:2]==b'\x1f\x8b' else raw
assert raw[:4]==b'glTF';ln=struct.unpack_from('<I',raw,12)[0];g=json.loads(raw[20:20+ln]);binary=raw[28+ln:];issues=[]
def imagebytes(i):
 im=g['images'][i];bv=g['bufferViews'][im['bufferView']];p=bv.get('byteOffset',0);return binary[p:p+bv['byteLength']]
def imageinfo(i):
 data=imagebytes(i);im=Image.open(io.BytesIO(data));d={'name':g['images'][i].get('name'),'size':list(im.size),'mode':im.mode,'encodedBytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
 if im.mode in ['RGBA','P']:
  a=np.array(im.convert('RGBA'))[:,:,3];d['alphaValues']=np.unique(a).tolist();d['transparentFraction']=float((a<128).mean())
 return d
def texinfo(t):
 tex=g['textures'][t['index']];return imageinfo(tex['source'])
def accessor(i):
 ac=g['accessors'][i];bv=g['bufferViews'][ac['bufferView']];ct={5126:np.float32,5120:np.int8,5121:np.uint8,5122:np.int16,5123:np.uint16,5125:np.uint32}[ac['componentType']];n={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[ac['type']];offset=bv.get('byteOffset',0)+ac.get('byteOffset',0);stride=bv.get('byteStride',n*np.dtype(ct).itemsize);ar=np.ndarray((ac['count'],n),dtype=ct,buffer=binary,offset=offset,strides=(stride,np.dtype(ct).itemsize)).copy()
 if ac.get('normalized'):
  ar=ar.astype(float)/np.iinfo(ct).max
  if np.issubdtype(ct,np.signedinteger):ar=np.maximum(ar,-1)
 return ar
materials=[];wanted=set()
for i,m in enumerate(g.get('materials',[])):
 if not m.get('name','').startswith(('botanical_v17','fabric_v17')):continue
 wanted.add(i);r={'index':i,'material':m,'textures':{}}
 for k,v in m.items():
  if k.endswith('Texture'):r['textures'][k]=texinfo(v)
 for k,v in m.get('pbrMetallicRoughness',{}).items():
  if k.endswith('Texture'):r['textures'][k]=texinfo(v)
 spec=m.get('extensions',{}).get('KHR_materials_specular',{})
 if any(v<0 or v>1 for v in spec.get('specularColorFactor',[1,1,1])):issues.append(m['name']+': illegal specularColorFactor')
 if m['name']=='botanical_v17_calathea_scanned':
  if m.get('alphaMode')!='MASK' or not m.get('doubleSided') or m.get('alphaCutoff',.5)!=.5:issues.append(m['name']+': bad alpha contract')
  al=r['textures'].get('baseColorTexture',{}).get('alphaValues',[])
  if al!=[0,255]:issues.append(m['name']+': missing binary leaf alpha')
  if m.get('extensions',{}).get('KHR_materials_transmission',{}).get('transmissionFactor',0)>0:issues.append(m['name']+': unnecessary transmission')
 else:
  if m.get('alphaMode','OPAQUE')!='OPAQUE':issues.append(m['name']+': unexpected fabric transparency')
 if not m.get('normalTexture'):issues.append(m['name']+': no normal map')
 if m['name']!='botanical_v17_potting_soil' and not m.get('pbrMetallicRoughness',{}).get('metallicRoughnessTexture'):issues.append(m['name']+': no roughness map')
 materials.append(r)
meshes=[]
for nd in g['nodes']:
 if 'mesh' not in nd:continue
 for p in g['meshes'][nd['mesh']]['primitives']:
  if p.get('material') not in wanted:continue
  at={k:accessor(v) for k,v in p['attributes'].items()};d={'name':nd.get('name'),'material':g['materials'][p['material']]['name'],'attributes':{k:{'count':len(v),'finite':bool(np.isfinite(v).all()),'min':v.min(axis=0).tolist(),'max':v.max(axis=0).tolist()} for k,v in at.items()}}
  for k,v in at.items():
   if not np.isfinite(v).all():issues.append(nd.get('name')+': nonfinite '+k)
  if 'NORMAL' in at:
   lengths=np.linalg.norm(at['NORMAL'],axis=1);d['normalLengthRange']=[float(lengths.min()),float(lengths.max())]
   if np.abs(lengths-1).max()>.001:issues.append(nd.get('name')+': nonunit normals')
  if 'TEXCOORD_0' not in at:issues.append(nd.get('name')+': missing UVs')
  meshes.append(d)
r={'model':str(src),'modelSha256':hashlib.sha256(raw).hexdigest(),'materials':materials,'meshes':meshes,'issues':issues,'passed':not issues};out.write_text(json.dumps(r,indent=2));print(json.dumps({'sha256':r['modelSha256'],'materials':len(materials),'meshes':len(meshes),'issues':issues},indent=2))
