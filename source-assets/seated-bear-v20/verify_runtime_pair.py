#!/usr/bin/env python3
"""Verify all indexed world-space bear vertices against the reviewed source export."""
import argparse,json
import numpy as np
from transplant_runtime import read,arr,NAMES

def worlds(g):
 parents={c:i for i,n in enumerate(g['nodes']) for c in n.get('children',[])};cache={}
 def world(i):
  if i in cache:return cache[i]
  n=g['nodes'][i]
  if 'matrix'in n:m=np.array(n['matrix']).reshape((4,4),order='F')
  else:
   x,y,z,w=n.get('rotation',[0,0,0,1]);m=np.eye(4);m[:3,:3]=[[1-2*y*y-2*z*z,2*x*y-2*z*w,2*x*z+2*y*w],[2*x*y+2*z*w,1-2*x*x-2*z*z,2*y*z-2*x*w],[2*x*z-2*y*w,2*y*z+2*x*w,1-2*x*x-2*y*y]];m[:3,:3]=m[:3,:3]@np.diag(n.get('scale',[1,1,1]));m[:3,3]=n.get('translation',[0,0,0])
  cache[i]=world(parents[i])@m if i in parents else m;return cache[i]
 return {n['name']:world(i) for i,n in enumerate(g['nodes'])}
def points(g,b,n,m):
 p=g['meshes'][n['mesh']]['primitives'][0];ix=arr(g,b,p['indices']).ravel();v=arr(g,b,p['attributes']['POSITION'])[ix];return (m@np.c_[v,np.ones(len(v))].T).T[:,:3]
p=argparse.ArgumentParser(description=__doc__);p.add_argument('runtime');p.add_argument('reviewed_export');p.add_argument('report');a=p.parse_args()
_,g,b=read(a.runtime);_,h,c=read(a.reviewed_export);gm=worlds(g);hm=worlds(h);hn={n['name']:n for n in h['nodes']};rows=[]
for n in g['nodes']:
 if n.get('name')not in NAMES or 'mesh'not in n:continue
 name=n['name'];v=points(g,b,n,gm[name]);w=points(h,c,hn[name],hm[name]);assert v.shape==w.shape;error=float(np.linalg.norm(v-w,axis=1).max());assert error<2e-6,(name,error);rows.append(dict(name=name,corners=len(v),maxWorldPositionErrorMeters=error))
report={'scope':'All indexed bear world-space vertices agree with the offline-reviewed source export, maximum allowed 2 micrometers. Face normals remain exact old runtime bytes; no image/GPU acceptance claim.','meshes':rows,'passed':True};open(a.report,'w').write(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
