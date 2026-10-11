"""Build hash-pinned world-space triangle fixtures from read-only Blender extraction."""
import sys,json,hashlib
from pathlib import Path
import numpy as np
base=Path(sys.argv[1]);out=Path(sys.argv[2]);meta=json.loads(base.with_suffix('.json').read_text());data=np.load(base.with_suffix('.npz'));arrays={};info={'source':meta['source'],'sourceSha256':meta['sha256'],'convention':'Blender (X,Y,Z) -> glTF world (X,Z,-Y); Blender local +Z animation becomes glTF local +Y. Weight=smoothstep(clamp((lowLocalY+range*.25-localY)/(range*.25),0,1)); glTF equivalent weight=smoothstep on high local Z quarter. Triangle winding index order retained from evaluated Blender loop triangles.','cloth':{}}
C=np.array([[1,0,0,0],[0,0,1,0],[0,-1,0,0],[0,0,0,1.]])
for name,amp in [('anim_sofa_edge',.0035),('anim_bed_edge',.004),('anim_dining_edge',.0035)]:
 o=meta['objects'][name];k=o['arrayKey'];local=data[k+'_local'];idx=data[k+'_tri'];world=data[k+'_world'];m=np.array(o['matrixWorld']);lo,hi=local[:,1].min(),local[:,1].max();q=np.clip((lo+.25*(hi-lo)-local[:,1])/(.25*(hi-lo)),0,1);weights=q*q*(3-2*q);info['cloth'][name]={'triangles':len(idx),'vertices':len(local),'amplitudeMetres':amp,'blenderMatrixWorld':m.tolist(),'gltfMatrixWorld':(C@m@C.T).tolist(),'phaseKeys':{},'localAxis':'Blender+Z/glTF+Y','runtimeEdgeAxis':'glTF+Z, high quarter'}
 for phase in [-1,0,1]:
  xyz=(world+phase*amp*weights[:,None]*m[:3,2])@C[:3,:3].T;key=name+'_'+str(phase);arrays[key]=xyz[idx];info['cloth'][name]['phaseKeys'][str(phase)]=key
info['supportGroups']={}
for root in ['F01_sofa','F15_bed','F13_dining_group','F08_computer_desk','Bear_reference_plush','Bear_desk_plush']:
 tris=[];names=[]
 for name,o in meta['objects'].items():
  if name.startswith('anim_') or 'arrayKey' not in o:continue
  par=name
  while par in meta['objects']:
   if par==root:
    k=o['arrayKey'];tris.append((data[k+'_world']@C[:3,:3].T)[data[k+'_tri']]);names.append(name);break
   par=meta['objects'][par]['parent']
 key=root+'_static_world';arrays[key]=np.concatenate(tris);info['supportGroups'][root]={'key':key,'objects':names,'triangles':len(arrays[key]),'excludes':'Direct anim_* meshes; separately included at all phases.'}
np.savez_compressed(out.with_suffix('.npz'),**arrays);info['fixtureSha256']=hashlib.sha256(out.with_suffix('.npz').read_bytes()).hexdigest();out.with_suffix('.json').write_text(json.dumps(info,indent=2));print(json.dumps(info,indent=2))
