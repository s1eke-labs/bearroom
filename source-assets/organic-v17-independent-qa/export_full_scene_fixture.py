"""Build hash-pinned world-space triangle fixtures from read-only Blender extraction."""
import sys,json,hashlib
from pathlib import Path
import numpy as np
base=Path(sys.argv[1]);out=Path(sys.argv[2]);changedMeta=json.loads(Path(sys.argv[3]).read_text());changed=set(changedMeta['changedOrAdded']);meta=json.loads(base.with_suffix('.json').read_text());data=np.load(base.with_suffix('.npz'));assert changedMeta['sha256']==meta['sha256'],'Construction inventory source hash mismatch';arrays={};info={'source':meta['source'],'sourceSha256':meta['sha256'],'convention':'Blender (X,Y,Z) -> glTF world (X,Z,-Y); Blender local +Z animation becomes glTF local +Y. Weight=smoothstep(clamp((lowLocalY+range*.25-localY)/(range*.25),0,1)); glTF equivalent weight=smoothstep on high local Z quarter. Triangle winding index order retained from evaluated Blender loop triangles.','cloth':{}}
C=np.array([[1,0,0,0],[0,0,1,0],[0,-1,0,0],[0,0,0,1.]])
for name,amp in [('anim_sofa_edge',.0035),('anim_bed_edge',.004),('anim_dining_edge',.0035)]:
 o=meta['objects'][name];k=o['arrayKey'];local=data[k+'_local'];idx=data[k+'_tri'];world=data[k+'_world'];m=np.array(o['matrixWorld']);lo,hi=local[:,1].min(),local[:,1].max();q=np.clip((lo+.25*(hi-lo)-local[:,1])/(.25*(hi-lo)),0,1);weights=q*q*(3-2*q);info['cloth'][name]={'triangles':len(idx),'vertices':len(local),'amplitudeMetres':amp,'blenderMatrixWorld':m.tolist(),'gltfMatrixWorld':(C@m@C.T).tolist(),'phaseKeys':{},'localAxis':'Blender+Z/glTF+Y','runtimeEdgeAxis':'glTF+Z, high quarter'}
 for phase in [-1,0,1]:
  xyz=(world+phase*amp*weights[:,None]*m[:3,2])@C[:3,:3].T;key=name+'_'+str(phase);arrays[key]=xyz[idx];info['cloth'][name]['phaseKeys'][str(phase)]=key
info['supportGroups']={}
for root in ['F01_sofa', 'F02_coffee_table', 'F03_television', 'F04_tv_cabinet', 'F05_floor_lamp', 'F06_grand_piano', 'F07_bench', 'F08_computer_desk', 'F09_computer', 'F10_monitor', 'F11_computer_chair', 'F12_desk_lamp', 'F13_dining_group', 'F14_kitchen', 'F15_bed', 'F16_reading_rocker', 'F17_bookshelf', 'F18_wardrobe', 'F19_entry_group', 'F20_vanity', 'F21_circulator', 'F22_purifier', 'F23_pendulum_clock', 'Bear_reference_plush', 'Bear_desk_plush', 'Decor', '__all_scene_static__']:
 tris=[];names=[];norms=[];changedFlags=[]
 for name,o in meta['objects'].items():
  if name in ['anim_sofa_edge','anim_bed_edge','anim_dining_edge'] or 'arrayKey' not in o:continue
  par=name
  while par in meta['objects']:
   if par==root or root=="__all_scene_static__":
    k=o['arrayKey'];tris.append((data[k+'_world']@C[:3,:3].T)[data[k+'_tri']]);names.append(name);norms.append(data[k+'_cornerNormals']@C[:3,:3].T);changedFlags.extend([name in changed]*len(data[k+'_tri']));break
   par=meta['objects'][par]['parent']
 key=root+'_static_world';arrays[key]=np.concatenate(tris);arrays[key+'_normals']=np.concatenate(norms);arrays[key+'_changed']=np.array(changedFlags,dtype=bool);info['supportGroups'][root]={'key':key,'objects':names,'triangles':len(arrays[key]),'changedNormalTriangles':int(np.sum(changedFlags)),'excludes':'Three cloth meshes only; separately included at all phases. All other dynamic furniture included at rest.'}
np.savez_compressed(out.with_suffix('.npz'),**arrays);info['fixtureSha256']=hashlib.sha256(out.with_suffix('.npz').read_bytes()).hexdigest();out.with_suffix('.json').write_text(json.dumps(info,indent=2));print(json.dumps(info,indent=2))
