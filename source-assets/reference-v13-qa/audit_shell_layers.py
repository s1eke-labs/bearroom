"""Read-only layer ordering / projected orientation check from evaluated extraction."""
import json,sys,numpy as np
from pathlib import Path
base=Path(sys.argv[1]);m=json.loads(base.with_suffix('.json').read_text());d=np.load(base.with_suffix('.npz'));out={'sourceSha256':m['sha256'],'checks':[]}
for name in ['anim_sofa_edge','anim_bed_edge','anim_dining_edge','duvet_main']:
 k=m['objects'][name]['arrayKey'];v=d[k+'_world'];ix=d[k+'_tri'];n=len(v)//2;a=v[:n];b=v[n:];r={'name':name,'vertices':len(v)}
 if len(a)!=len(b):r['pairedLayers']=False;r['layerOrderPass']=False
 else:
  dx=np.max(np.abs(a[:,:2]-b[:,:2]));dz=a[:,2]-b[:,2];top=ix[np.max(ix,axis=1)<n];t=v[top];ar=(t[:,1,0]-t[:,0,0])*(t[:,2,1]-t[:,0,1])-(t[:,1,1]-t[:,0,1])*(t[:,2,0]-t[:,0,0]);r.update({'pairedXYMaxErrorM':float(dx),'minimumLayerSeparationM':float(dz.min()),'maximumLayerSeparationM':float(dz.max()),'positiveProjectedTopTriangles':int((ar>1e-12).sum()),'negativeProjectedTopTriangles':int((ar<-1e-12).sum()),'nearVerticalProjectedTopTriangles':int((abs(ar)<=1e-12).sum()),'layerOrderPass':bool(dx<1e-6 and dz.min()>0 and not np.any(ar<-1e-12))})
 out['checks'].append(r)
out['passed']=all(x['layerOrderPass'] for x in out['checks']);Path(sys.argv[2]).write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))
