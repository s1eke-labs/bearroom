"""Verify baked source anchors/target against the final actual exported GLB."""
import argparse,struct,json,pathlib,hashlib,math,gzip,re
import numpy as np
ap=argparse.ArgumentParser();ap.add_argument('--glb',required=True);ap.add_argument('--gi',required=True);ap.add_argument('--output',required=True);ap.add_argument('--runtime-main',required=True);ap.add_argument('--baseline-gi',required=True);a=ap.parse_args()
raw=pathlib.Path(a.glb).read_bytes()
if raw[:2]==b'\x1f\x8b':raw=gzip.decompress(raw)
n=struct.unpack_from('<I',raw,12)[0];j=json.loads(raw[20:20+n]);off=20+n;blen,btype=struct.unpack_from('<II',raw,off);bin=raw[off+8:off+8+blen];gi=json.loads(pathlib.Path(a.gi).read_text());nodes=j['nodes'];parents={c:i for i,n in enumerate(nodes) for c in n.get('children',[])};cache={}
def world(i):
 if i in cache:return cache[i]
 n=nodes[i]
 if 'matrix'in n:m=np.array(n['matrix']).reshape(4,4).T
 else:
  x,y,z,w=n.get('rotation',[0,0,0,1]);r=np.array([[1-2*y*y-2*z*z,2*x*y-2*z*w,2*x*z+2*y*w],[2*x*y+2*z*w,1-2*x*x-2*z*z,2*y*z-2*x*w],[2*x*z-2*y*w,2*y*z+2*x*w,1-2*x*x-2*y*y]])
  m=np.eye(4);m[:3,:3]=r@np.diag(n.get('scale',[1,1,1]));m[:3,3]=n.get('translation',[0,0,0])
 if i in parents:m=world(parents[i])@m
 cache[i]=m;return m
def accessor(idx):
 ac=j['accessors'][idx];bv=j['bufferViews'][ac['bufferView']];dt={5126:np.float32,5125:np.uint32,5123:np.uint16,5121:np.uint8}[ac['componentType']];c={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[ac['type']];start=bv.get('byteOffset',0)+ac.get('byteOffset',0);stride=bv.get('byteStride',np.dtype(dt).itemsize*c)
 return np.ndarray((ac['count'],c),dtype=dt,buffer=bin,offset=start,strides=(stride,np.dtype(dt).itemsize))
byname={n.get('name'):i for i,n in enumerate(nodes)};checks=[]
for lamp in gi['lights']['lamps']:
 name='light_'+lamp['name'];idx=byname[name];actual=world(idx)[:3,3];expected=np.array(lamp['position']);delta=float(np.linalg.norm(actual-expected));checks.append({'name':name,'glb':actual.tolist(),'bake':expected.tolist(),'deltaMetres':delta});assert delta<1e-4,(name,delta)
root=byname['Bear_reference_plush'];desc=[]
def descend(i):
 desc.append(i)
 for c in nodes[i].get('children',[]):descend(c)
descend(root);points=[]
for idx in desc:
 if 'mesh'not in nodes[idx]:continue
 for p in j['meshes'][nodes[idx]['mesh']]['primitives']:
  pos=accessor(p['attributes']['POSITION']);points.append((np.c_[pos,np.ones(len(pos))]@world(idx).T)[:,:3])
pts=np.vstack(points);target=(pts.min(axis=0)+pts.max(axis=0))/2;expected=np.array(next(l['target'] for l in gi['lights']['lamps'] if l['name']=='living'));geometry_delta=float(np.linalg.norm(target-expected))
# v20 preserves the product's accepted focus while changing only bear posture.
# Confirm the exact runtime branch, not a relaxed bounding-box tolerance.
main_path=pathlib.Path(a.runtime_main);main=main_path.read_text()
pattern=r'r\s*=\s*e\.focus\s*===\s*"Bear_reference_plush"\s*\?\s*(\[[^\]]+\])\s*:\s*s\s*\?\s*new Kt\(\)\.setFromObject\(s, true\)\.getCenter\(new L\(\)\)\.toArray\(\)\s*:\s*null'
matches=re.findall(pattern,main)
assert len(matches)==1,('Expected exactly one frozen living-focus runtime branch',len(matches))
runtime_target=np.array(json.loads(matches[0]));assert runtime_target.shape==(3,)
assert np.isfinite(runtime_target).all()
baseline_path=pathlib.Path(a.baseline_gi);baseline_raw=baseline_path.read_bytes()
assert hashlib.sha256(baseline_raw).hexdigest()=='107ef50f0ec636d401df4631133ea0061ef14944ab2c325c16b39ea072962971','Unaccepted baseline'
prior=np.array(next(l['target'] for l in json.loads(baseline_raw)['lights']['lamps'] if l['name']=='living'))
assert np.array_equal(runtime_target,prior),('Runtime frozen target differs from accepted pre-edit lighting',runtime_target.tolist())
assert np.array_equal(expected,prior),('Bake target differs from accepted pre-edit lighting',expected.tolist())
delta=float(np.linalg.norm(runtime_target-expected));assert delta==0,('living target',delta)
report={'modelSha256':hashlib.sha256(raw).hexdigest(),'sourceSha256':gi['sourceSha256'],'anchors':checks,'livingTarget':{'runtime':runtime_target.tolist(),'bake':expected.tolist(),'acceptedPreEditTarget':prior.tolist(),'deltaMetres':delta,'editedBearBoundsCenter':target.tolist(),'boundsCenterToFrozenTargetMetres':geometry_delta,'method':'Exact frozen runtime branch; intentional geometry-center change is separately reported, never used as lighting.'},'runtimeMainSha256':hashlib.sha256(main_path.read_bytes()).hexdigest(),'baselineGiSha256':hashlib.sha256(baseline_raw).hexdigest(),'passed':True};pathlib.Path(a.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
