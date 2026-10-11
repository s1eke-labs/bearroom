"""Compact a Blender export without applying geometry simplification.
- Strip the TWO legacy hidden-fiber nodes only when explicitly requested.
- Restore source attributes only on exact/near-exact unchanged indexed geometry,
  UVs and colors, retaining new material assignment and node transforms.
- Quantize COLOR attributes to UNORM8, at most 1/510 linear channel error.
- Rebuild live buffers, dropping orphaned fiber geometry and padding deterministically.
Never writes the input or production directories.
"""
import argparse,copy,gzip,hashlib,json,struct
from pathlib import Path
import numpy as np
DIMS={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT2':4,'MAT3':9,'MAT4':16}
DT={5120:'i1',5121:'u1',5122:'<i2',5123:'<u2',5125:'<u4',5126:'<f4'}
def load(path):
 b=Path(path).read_bytes()
 if b[:2]==b'\x1f\x8b':b=gzip.decompress(b)
 n=struct.unpack_from('<I',b,12)[0];return json.loads(b[20:20+n]),b[28+n:]
def raw_accessor(j,b,i):
 a=j['accessors'][i];v=j['bufferViews'][a['bufferView']];dtype=np.dtype(DT[a['componentType']]);w=DIMS[a['type']]
 if 'sparse' in a:raise ValueError('Sparse accessor unsupported')
 return np.ndarray((a['count'],w),dtype=dtype,buffer=b,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',w*dtype.itemsize),dtype.itemsize)).copy()
def decoded(j,b,i):
 a=j['accessors'][i];x=raw_accessor(j,b,i)
 if a.get('normalized'):x=np.maximum(x.astype(np.float64)/{5120:127,5121:255,5122:32767,5123:65535}[a['componentType']],-1)
 return x

def compact(srcpath,outpath,strip=False,sourcepath=None,exclude=()):
 j,b=load(srcpath);before=len(b);report={'input':str(srcpath),'output':str(outpath),'removedLegacyNodes':[],'restoredUnchangedMeshes':[],'preservedEditedMeshes':[],'colorMaxQuantizationError':0}
 if j.get('animations') or j.get('skins'):raise ValueError('This scene-specific compactor refuses animated/skinned glTF')
 if strip:
  names={'plush_fibers_Bear_reference_plush','plush_fibers_Bear_desk_plush'}
  drop={i for i,n in enumerate(j['nodes']) if n.get('name') in names};report['removedLegacyNodes']=[j['nodes'][i]['name'] for i in sorted(drop)]
  remap={i:k for k,i in enumerate(i for i in range(len(j['nodes'])) if i not in drop)}
  j['nodes']=[n for i,n in enumerate(j['nodes']) if i not in drop]
  for n in j['nodes']:
   if 'children' in n:n['children']=[remap[i] for i in n['children'] if i not in drop]
  for sc in j['scenes']:sc['nodes']=[remap[i] for i in sc.get('nodes',[]) if i not in drop]
 # Every live primitive is assigned an origin source; unchanged meshes can reuse
 # exact original normal/color/index bytes instead of Blender's lossy custom normals.
 origins={};sj=sb=None
 if sourcepath:sj,sb=load(sourcepath);sn={n['name']:n for n in sj['nodes']}
 for n in j['nodes']:
  if 'mesh' not in n:continue
  mi=n['mesh'];m=j['meshes'][mi]
  for pi,p in enumerate(m['primitives']):origins[(mi,pi)]=(j,b,p)
  if not sourcepath or n['name'] in exclude or n['name'] not in sn or len(m['primitives'])!=1:continue
  so=sn[n['name']]
  if 'mesh' not in so:continue
  sm=sj['meshes'][so['mesh']]
  if len(sm['primitives'])!=1:continue
  p=m['primitives'][0];q=sm['primitives'][0]
  try:
   ix=decoded(j,b,p['indices']).ravel();iy=decoded(sj,sb,q['indices']).ravel()
   same=len(ix)==len(iy) and len(ix)>0
   names=set(p['attributes'])|set(q['attributes'])
   for a in sorted(names-{'NORMAL','TANGENT'}):
    if not same:break
    if a not in p['attributes'] or a not in q['attributes']:same=False;break
    x=decoded(j,b,p['attributes'][a])[ix];y=decoded(sj,sb,q['attributes'][a])[iy]
    if a.startswith('COLOR'):
     if x.shape[1]==3:x=np.c_[x,np.ones(len(x))]
     if y.shape[1]==3:y=np.c_[y,np.ones(len(y))]
    same=x.shape==y.shape and bool(np.max(np.abs(x-y))<2e-6)
   if same:origins[(mi,0)]=(sj,sb,q);report['restoredUnchangedMeshes'].append(n['name'])
   else:report['preservedEditedMeshes'].append(n['name'])
  except (KeyError,ValueError):report['preservedEditedMeshes'].append(n['name'])
 live=sorted({n['mesh'] for n in j['nodes'] if 'mesh' in n});meshmap={old:new for new,old in enumerate(live)}
 accessors=[];views=[];chunks=[];offset=0;meshes=[]
 def add_bytes(payload,target=None):
  nonlocal offset
  pad=(-offset)%4
  if pad:chunks.append(b'\0'*pad);offset+=pad
  vi=len(views);v={'buffer':0,'byteOffset':offset,'byteLength':len(payload)}
  if target:v['target']=target
  views.append(v);chunks.append(payload);offset+=len(payload);return vi
 def add_accessor(oj,ob,oi,semantic):
  old=oj['accessors'][oi];a=copy.deepcopy(old);arr=raw_accessor(oj,ob,oi)
  if semantic.startswith('COLOR'):
   d=decoded(oj,ob,oi).astype(np.float64);arr=np.round(np.clip(d,0,1)*255).astype(np.uint8);err=float(np.max(np.abs(arr.astype(np.float64)/255-d)))
   report['colorMaxQuantizationError']=max(err,report['colorMaxQuantizationError']);a['componentType']=5121;a['normalized']=True;a.pop('min',None);a.pop('max',None)
   if arr.shape[1]==3:arr=np.c_[arr,np.full(len(arr),255,dtype=np.uint8)];a['type']='VEC4'
  a.pop('byteOffset',None)
  element_bytes=arr.shape[1]*arr.dtype.itemsize
  if semantic!='INDICES' and element_bytes%4:
   stride=(element_bytes+3)//4*4;packed=np.zeros((len(arr),stride),dtype=np.uint8);packed[:,:element_bytes]=arr.view(np.uint8).reshape(len(arr),element_bytes);vi=add_bytes(packed.tobytes(),34962);views[vi]['byteStride']=stride
  else:vi=add_bytes(arr.tobytes(),34963 if semantic=='INDICES' else 34962)
  a['bufferView']=vi
  idx=len(accessors);accessors.append(a);return idx
 for oldmi in live:
  m=copy.deepcopy(j['meshes'][oldmi]);ps=[]
  for pi,p in enumerate(m['primitives']):
   oj,ob,q=origins[(oldmi,pi)];new=copy.deepcopy(p);new['attributes']={k:add_accessor(oj,ob,v,k) for k,v in q['attributes'].items()};new['indices']=add_accessor(oj,ob,q['indices'],'INDICES');ps.append(new)
  m['primitives']=ps;meshes.append(m)
 for n in j['nodes']:
  if 'mesh' in n:n['mesh']=meshmap[n['mesh']]
 for im in j.get('images',[]):
  if 'bufferView' in im:
   v=j['bufferViews'][im['bufferView']];im['bufferView']=add_bytes(b[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']])
 j['meshes']=meshes;j['accessors']=accessors;j['bufferViews']=views;j['buffers']=[{'byteLength':offset}]
 needs_quant=any(a['componentType']!=5126 and key in ('POSITION','NORMAL','TANGENT') for m in meshes for p in m['primitives'] for key,i in p['attributes'].items() for a in [accessors[i]])
 for k in ('extensionsUsed','extensionsRequired'):
  ex=j.get(k,[])
  if needs_quant and 'KHR_mesh_quantization' not in ex:ex.append('KHR_mesh_quantization')
  if not needs_quant:ex=[x for x in ex if x!='KHR_mesh_quantization']
  if ex:j[k]=ex
  else:j.pop(k,None)
 js=json.dumps(j,separators=(',',':')).encode();js+=b' '*((-len(js))%4);binary=b''.join(chunks);binary+=b'\0'*((-len(binary))%4)
 out=struct.pack('<III',0x46546c67,2,12+8+len(js)+8+len(binary))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(binary),0x004e4942)+binary
 path=Path(outpath);path.write_bytes(out);compressed=gzip.compress(out,compresslevel=9,mtime=0);Path(str(path)+'.gz').write_bytes(compressed)
 report.update({'glbBytes':len(out),'gzipBytes':len(compressed),'gzipMiB':len(compressed)/1048576,'sha256':hashlib.sha256(out).hexdigest(),'nodes':len(j['nodes']),'meshes':len(meshes),'triangles':sum(accessors[p['indices']]['count']//3 for m in meshes for p in m['primitives'])})
 Path(str(path)+'.report.json').write_text(json.dumps(report,indent=2));return report
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('input');p.add_argument('output');p.add_argument('--strip-legacy-fibers',action='store_true');p.add_argument('--restore-unchanged-source');p.add_argument('--exclude-restore',action='append',default=[]);a=p.parse_args()
 if Path(a.input).resolve()==Path(a.output).resolve():p.error('Input and output must differ')
 r=compact(a.input,a.output,a.strip_legacy_fibers,a.restore_unchanged_source,a.exclude_restore);print(json.dumps({k:v for k,v in r.items() if not isinstance(v,list)},indent=2));print('RESTORED',len(r['restoredUnchangedMeshes']),'REMOVED',r['removedLegacyNodes'])
