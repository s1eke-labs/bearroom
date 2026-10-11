"""Validate recovered/edited GLB's protected production scene contract, offline.
Usage: python validate_runtime_contract.py candidate.glb [--other-assets-bytes N]
This is structural/data validation, not rendered visual or FPS acceptance.
"""
import argparse,collections,json,struct,hashlib,gzip
from pathlib import Path
import numpy as np
from compact_recovered_runtime import load,decoded
ROOT=Path(__file__).resolve().parent

def validate(path,source=None,other=0):
 sj,sb=load(source or ROOT/'recovery-v11/authoritative-v11.glb.gz');j,b=load(path);sn={n['name']:n for n in sj['nodes']};nn={n['name']:n for n in j['nodes']};issues=[]
 if len(nn)!=len(j['nodes']):issues.append('Node names are not unique')
 def chosen(nodes,key):return {n['name']:n['extras'][key] for n in nodes if key in n.get('extras',{})}
 for key in ['furnitureId','animationAxis','midi']:
  if chosen(sj['nodes'],key)!=chosen(j['nodes'],key):issues.append('Protected '+key+' controls differ')
 source_parents={c:sj['nodes'][i]['name'] for i,n in enumerate(sj['nodes']) for c in n.get('children',[])}
 current_parents={c:j['nodes'][i]['name'] for i,n in enumerate(j['nodes']) for c in n.get('children',[])}
 protected={n['name'] for n in sj['nodes'] if any(x in n.get('extras',{}) for x in ['furnitureId','animationAxis','midi','clothAxis'])}
 protected.update(n['name'] for n in sj['nodes'] if n['name'].startswith(('cutaway_bathroom','bathroom_door')))
 for name in sorted(protected):
  if name not in nn:issues.append('Missing protected node '+name);continue
  a=sn[name];z=nn[name]
  for key,default in [('translation',[0,0,0]),('scale',[1,1,1]),('rotation',[0,0,0,1])]:
   if not np.allclose(a.get(key,default),z.get(key,default),rtol=0,atol=2e-5):issues.append('Changed protected '+key+' on '+name)
  ia=sj['nodes'].index(a);iz=j['nodes'].index(z)
  if source_parents.get(ia)!=current_parents.get(iz):issues.append('Changed protected parent '+name)
  for key,value in a.get('extras',{}).items():
   if z.get('extras',{}).get(key)!=value:issues.append('Changed protected metadata '+name+'/'+key)
 for name in ['cutaway_bathroom_rear_privacy','cutaway_bathroom_partition','cutaway_bathroom_side']:
  n=nn.get(name)
  if not n or 'mesh' not in n:issues.append('Missing bathroom opaque mesh '+name);continue
  for p in j['meshes'][n['mesh']]['primitives']:
   m=j['materials'][p['material']]
   if m.get('alphaMode','OPAQUE')!='OPAQUE':issues.append('Nonopaque bathroom material '+name)
 errors=[];triangles=0
 for m in j['meshes']:
  for p in m['primitives']:
   ix=decoded(j,b,p['indices']).ravel();positions=decoded(j,b,p['attributes']['POSITION']);triangles+=len(ix)//3
   if len(ix)%3 or int(ix.max())>=len(positions):issues.append('Invalid triangle indices '+m.get('name',''))
   for semantic,ai in p['attributes'].items():
    a=decoded(j,b,ai)
    if len(a)!=len(positions) or not np.isfinite(a).all():issues.append('Invalid attribute '+m.get('name','')+'/'+semantic)
 for key,value in sj['scenes'][sj.get('scene',0)].get('extras',{}).items():
  if j['scenes'][j.get('scene',0)].get('extras',{}).get(key)!=value:issues.append('Changed layout scene metadata '+key)
 gzlen=len(gzip.compress(Path(path).read_bytes(),compresslevel=9,mtime=0))
 if other and gzlen+other>=20*1048576:issues.append('Whole-site bytes exceed or equal20MiB')
 r={'passed':not issues,'issues':issues,'path':str(path),'nodes':len(j['nodes']),'meshes':len(j['meshes']),'triangles':triangles,'furniture':len(chosen(j['nodes'],'furnitureId')),'axisControllers':len(chosen(j['nodes'],'animationAxis')),'pianoKeys':len(chosen(j['nodes'],'midi')),'gzipBytes':gzlen,'otherAssetsBytes':other,'wholeSiteMiB':(gzlen+other)/1048576,'sha256':hashlib.sha256(Path(path).read_bytes()).hexdigest(),'validationScope':'Offline structural, transform, metadata, opacity, geometry and bytes. No WebGL/browser visual or FPS claims.'}
 return r
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('candidate');p.add_argument('--source');p.add_argument('--other-assets-bytes',type=int,default=0);p.add_argument('--report');a=p.parse_args();r=validate(a.candidate,a.source,a.other_assets_bytes);print(json.dumps(r,indent=2))
 if a.report:Path(a.report).write_text(json.dumps(r,indent=2))
 raise SystemExit(0 if r['passed'] else 1)
