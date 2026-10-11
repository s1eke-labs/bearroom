#!/usr/bin/env python3
"""Opt-in runtime representation prototype. Positions/UVs/transforms are never changed.
Signed normalized int16 NORMAL/TANGENT; original authoring source stays float.
Reports angular/component error; a separate exact buffer compaction drops orphaned views.
"""
import argparse,copy,gzip,hashlib,json,struct
from pathlib import Path
import numpy as np

def sha(x):return hashlib.sha256(x).hexdigest()
def read(p):
 b=Path(p).read_bytes();b=gzip.decompress(b) if b[:2]==b'\x1f\x8b' else b
 s=struct.unpack_from('<I',b,12)[0];return b,json.loads(b[20:20+s]),b[28+s:]
def arr(j,b,i):
 a=j['accessors'][i];v=j['bufferViews'][a['bufferView']];w={'VEC3':3,'VEC4':4}[a['type']]
 assert a['componentType']==5126 and not a.get('normalized') and not a.get('sparse')
 return np.ndarray((a['count'],w),'<f4',b,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',w*4),4)).copy()
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('source');ap.add_argument('output');ap.add_argument('--scope',required=True,choices=['all','organic']);ap.add_argument('--approved-organic-runtime',action='store_true');a=ap.parse_args()
 if a.approved_organic_runtime:assert a.scope=='organic','Approval is limited to new organic primitives'
 assert Path(a.source).resolve()!=Path(a.output).resolve()
 raw,j,b=read(a.source);original=copy.deepcopy(j);selected={};mesh_nodes={}
 for n in j['nodes']:
  if 'mesh' in n:mesh_nodes.setdefault(n['mesh'],[]).append(n)
 for mi,mesh in enumerate(j['meshes']):
  nodes=mesh_nodes.get(mi,[])
  for p in mesh['primitives']:
   mat=j.get('materials',[])[p['material']] if 'material' in p else {}
   new=mat.get('name','').startswith('fabric_v17_') or any(n.get('extras',{}).get('organicPlantV17') for n in nodes)
   if a.scope=='organic' and not new:continue
   for semantic in ['NORMAL','TANGENT']:
    if semantic in p['attributes']:selected.setdefault(p['attributes'][semantic],{'semantic':semantic,'nodes':[]})['nodes']+=sorted(n.get('name','') for n in nodes)
 chunks=[b];offset=len(b);reports=[]
 for ai,info in sorted(selected.items()):
  ac=j['accessors'][ai]
  if ac['componentType']!=5126:continue
  data=arr(j,b,ai).astype(np.float64);assert np.isfinite(data).all()
  q=np.round(np.clip(data,-1,1)*32767).astype('<i2');decoded=np.maximum(q.astype(np.float64)/32767,-1)
  v=data[:,:3];w=decoded[:,:3];vn=np.linalg.norm(v,axis=1);wn=np.linalg.norm(w,axis=1);ok=(vn>1e-10)&(wn>1e-10)
  cross=np.linalg.norm(np.cross(v[ok]/vn[ok,None],w[ok]/wn[ok,None]),axis=1);dot=np.sum(v[ok]*w[ok],axis=1)/(vn[ok]*wn[ok]);angle=np.degrees(np.arctan2(cross,np.clip(dot,-1,1)))
  pad=(-offset)%4;chunks.append(b'\0'*pad);offset+=pad;stride=((q.shape[1]*2+3)//4)*4
  packed=np.zeros((len(q),stride),np.uint8);packed[:,:q.shape[1]*2]=q.view(np.uint8).reshape(len(q),-1);payload=packed.tobytes()
  vi=len(j['bufferViews']);j['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(payload),'byteStride':stride,'target':34962});chunks.append(payload);offset+=len(payload)
  ac['bufferView']=vi;ac.pop('byteOffset',None);ac.pop('min',None);ac.pop('max',None);ac['componentType']=5122;ac['normalized']=True
  reports.append({'accessor':ai,**info,'count':len(data),'originalComponentType':5126,'runtimeComponentType':5122,'normalized':True,'maxComponentError':float(abs(data-decoded).max(initial=0)),'maxAngularErrorDegrees':float(angle.max(initial=0)),'rmsAngularErrorDegrees':float(np.sqrt(np.mean(angle**2))) if len(angle) else 0,'zeroNormalCount':int((~ok).sum())})
 for key in ['extensionsUsed','extensionsRequired']:
  if 'KHR_mesh_quantization' not in j.setdefault(key,[]):j[key].append('KHR_mesh_quantization')
 j['buffers']=[{'byteLength':offset}];binary=b''.join(chunks);binary+=b'\0'*((-len(binary))%4);text=json.dumps(j,separators=(',',':')).encode();text+=b' '*((-len(text))%4)
 out=struct.pack('<III',0x46546c67,2,28+len(text)+len(binary))+struct.pack('<II',len(text),0x4e4f534a)+text+struct.pack('<II',len(binary),0x004e4942)+binary
 Path(a.output).write_bytes(out)
 # Every non-direction accessor and all node transforms/mesh assignments exact.
 assert j['nodes']==original['nodes'] and j['meshes']==original['meshes']
 for i,(before,after) in enumerate(zip(original['accessors'],j['accessors'])):
  if i not in selected:assert before==after
 if a.approved_organic_runtime:assert max((r['maxAngularErrorDegrees'] for r in reports),default=0)<=.0015,'Approved angular-error bound exceeded'
 report={'scope':a.scope,'purpose':('Approved new-organic-only runtime normal representation; full-precision source retained' if a.approved_organic_runtime else 'Prototype only; parent review required before installation'),'approvedAngularLimitDegrees':(.0015 if a.approved_organic_runtime else None),'inputSha256':sha(raw),'outputSha256':sha(out),'positionsUVsColorsIndicesMaterialsImagesNodesUnchanged':True,'attributeCount':len(reports),'attributeVertexCount':sum(r['count'] for r in reports),'maxComponentError':max((r['maxComponentError'] for r in reports),default=0),'maxAngularErrorDegrees':max((r['maxAngularErrorDegrees'] for r in reports),default=0),'requiresExtension':'KHR_mesh_quantization','accessors':reports}
 Path(a.output+'.quantization.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='accessors'},indent=2))
if __name__=='__main__':main()
