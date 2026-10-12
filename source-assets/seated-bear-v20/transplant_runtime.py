#!/usr/bin/env python3
"""Transplant only authored bear pose values into the frozen runtime layout.
Old/new Blender exports establish indexed-corner correspondence. Every unrelated
byte, index, UV, color, material and image remains from the production baseline.
No input is overwritten. No topology, normal precision or texture change allowed.
"""
import argparse,copy,gzip,hashlib,json,struct
from pathlib import Path
import numpy as np
ROOT='Bear_reference_plush'
NAMES=[ROOT,'bear_head_sewn_front_panel','bear_minky_surface_nap',ROOT+'__embroidery_ink',ROOT+'__fabric_bear',ROOT+'__fabric_bear_sewn_thread']
EDIT_GEOMETRY={'bear_minky_surface_nap',ROOT+'__fabric_bear',ROOT+'__fabric_bear_sewn_thread'}
DIMS={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}
DT={5120:'i1',5121:'u1',5122:'<i2',5123:'<u2',5125:'<u4',5126:'<f4'}
def read(path):
 raw=Path(path).read_bytes();raw=gzip.decompress(raw) if raw[:2]==b'\x1f\x8b' else raw
 size=struct.unpack_from('<I',raw,12)[0];return raw,json.loads(raw[20:20+size]),raw[28+size:]
def arr(j,b,i):
 a=j['accessors'][i];v=j['bufferViews'][a['bufferView']];w=DIMS[a['type']];dt=np.dtype(DT[a['componentType']]);assert not a.get('sparse')
 x=np.ndarray((a['count'],w),dt,b,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',w*dt.itemsize),dt.itemsize))
 return x

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('baseline');p.add_argument('old_export');p.add_argument('new_export');p.add_argument('output');a=p.parse_args()
 assert len({Path(x).resolve() for x in vars(a).values()})==4
 raw,j,b=read(a.baseline);_,oj,ob=read(a.old_export);_,nj,nb=read(a.new_export)
 before=copy.deepcopy(j);out=bytearray(b);om={n['name']:n for n in oj['nodes']};nm={n['name']:n for n in nj['nodes']};report=[]
 for node in j['nodes']:
  name=node.get('name');
  if name not in NAMES:continue
  old,new=om[name],nm[name]
  for key,default in [('translation',[0,0,0]),('rotation',[0,0,0,1]),('scale',[1,1,1])]:
   assert np.allclose(node.get(key,default),old.get(key,default),atol=2e-6,rtol=0),(name,key,'baseline/export transform mismatch')
   if not np.allclose(old.get(key,default),new.get(key,default),atol=1e-9,rtol=0):
    if key in new:node[key]=new[key]
    else:node.pop(key,None)
  if 'mesh' not in node:continue
  pp=j['meshes'][node['mesh']]['primitives'];qq=oj['meshes'][old['mesh']]['primitives'];rr=nj['meshes'][new['mesh']]['primitives'];assert len(pp)==len(qq)==len(rr)==1
  dst,src,revised=pp[0],qq[0],rr[0]
  ix=arr(j,b,dst['indices']).ravel();iy=arr(oj,ob,src['indices']).ravel();iz=arr(nj,nb,revised['indices']).ravel()
  assert np.array_equal(iy,iz),(name,'authoring export topology changed')
  assert len(ix)==len(iy),(name,'runtime/source corner count mismatch')
  x=arr(j,b,dst['attributes']['POSITION']);y=arr(oj,ob,src['attributes']['POSITION'])
  delta=float(np.abs(x[ix]-y[iy]).max());assert delta<2e-6,(name,'baseline source correspondence',delta)
  for key in set(src['attributes'])|set(revised['attributes']):
   if key in ['POSITION','NORMAL','TANGENT']:continue
   assert key in src['attributes'] and key in revised['attributes'],(name,key)
   assert np.array_equal(arr(oj,ob,src['attributes'][key]),arr(nj,nb,revised['attributes'][key])),(name,key,'source UV/color changed')
  changed=[]
  for key in ['POSITION','NORMAL','TANGENT']:
   if key not in dst['attributes']:continue
   assert key in src['attributes'] and key in revised['attributes']
   old_data=arr(oj,ob,src['attributes'][key]);new_data=arr(nj,nb,revised['attributes'][key]);assert old_data.shape==new_data.shape
   if np.array_equal(old_data,new_data):continue
   if name not in EDIT_GEOMETRY:
    limit=2e-6 if key=='POSITION' else 2.5e-4
    assert float(np.abs(old_data-new_data).max())<limit,(name,key,'face exporter roundoff exceeds rigid-source allowance')
    continue # Preserve original face bytes despite exporter float roundoff.
   target=arr(j,out,dst['attributes'][key]);assert target.dtype==new_data.dtype==np.dtype('<f4');assert np.isfinite(new_data).all()
   # A runtime vertex may serve multiple corners. All mapped new values must agree.
   mapped=np.empty_like(target);mapped[ix]=new_data[iy];assert np.array_equal(mapped[ix],new_data[iy]),(name,key,'ambiguous indexed mapping')
   assert len(np.unique(ix))==len(target),(name,'unreferenced runtime vertex')
   target[:]=mapped
   ac=j['accessors'][dst['attributes'][key]]
   if 'min'in ac:ac['min']=target.min(axis=0).tolist()
   if 'max'in ac:ac['max']=target.max(axis=0).tolist()
   changed.append(key)
  report.append({'name':name,'sourcePositionAgreementMax':delta,'vertices':len(x),'changed':changed})
 assert report and any(x['changed'] for x in report),'Pose made no geometry change'
 encoded=json.dumps(j,separators=(',',':'),ensure_ascii=False).encode();encoded+=b' '*((-len(encoded))%4)
 result=struct.pack('<III',0x46546c67,2,28+len(encoded)+len(out))+struct.pack('<II',len(encoded),0x4e4f534a)+encoded+struct.pack('<II',len(out),0x004e4942)+out
 Path(a.output).write_bytes(result);Path(a.output+'.report.json').write_text(json.dumps({'baselineSha256':hashlib.sha256(raw).hexdigest(),'modelSha256':hashlib.sha256(result).hexdigest(),'scope':NAMES,'nodes':report},indent=2)+'\n')
 print(json.dumps(report,indent=2))
if __name__=='__main__':main()
