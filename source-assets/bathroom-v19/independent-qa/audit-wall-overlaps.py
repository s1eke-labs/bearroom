"""Read-only CPU overlap audit for exported, world-space bathroom triangle data."""
import json, sys
from pathlib import Path
import numpy as np

def area(poly):
    if len(poly)<3:return 0.
    p=np.array(poly);return abs(np.sum(p[:,0]*np.roll(p[:,1],-1)-p[:,1]*np.roll(p[:,0],-1)))*.5

def overlap(a,b):
    # Convex triangle clipping. Shared edges/points are zero-area contacts.
    out=list(a)
    sign=np.sign(np.cross(b[1]-b[0],b[2]-b[0]))
    for e in range(3):
        if not out:return 0.
        p,q=b[e],b[(e+1)%3];old=out;out=[]
        def side(v):return sign*np.cross(q-p,v-p)
        prev=old[-1];sp=side(prev)
        for cur in old:
            sc=side(cur)
            if (sc>=0)!=(sp>=0):out.append(prev+(cur-prev)*sp/(sp-sc))
            if sc>=0:out.append(cur)
            prev,sp=cur,sc
    return area(out)

source=Path(sys.argv[1]);out=Path(sys.argv[2]);meshes=json.loads(source.read_text());triangles=[]
for mesh in meshes:
    if not mesh['name'].startswith('cutaway_bathroom'):continue
    for i,t in enumerate(mesh['triangles']):
        p=np.array(t['points']);n=np.cross(p[1]-p[0],p[2]-p[0]);n/=np.linalg.norm(n)
        axis=np.argmax(abs(n))
        if abs(n[axis])<1-1e-7:continue
        triangles.append((mesh['name'],i,p,axis,p[:,axis].mean(),n))
groups={}
for t in triangles:groups.setdefault((t[3],round(t[4],5)),[]).append(t)
pairs={}
for group in groups.values():
    for i,a in enumerate(group):
        for b in group[i+1:]:
            if abs(a[4]-b[4])>1e-6:continue
            axes=[k for k in range(3) if k!=a[3]];pa=a[2][:,axes];pb=b[2][:,axes]
            if np.any(pa.max(0)<=pb.min(0)+1e-9) or np.any(pb.max(0)<=pa.min(0)+1e-9):continue
            ar=overlap(pa,pb)
            if ar<1e-10:continue
            key=' | '.join(sorted([a[0],b[0]]));d=pairs.setdefault(key,{'pairs':0,'areaMetresSquared':0,'belowLowerClipPairs':0,'sameFacingPairs':0,'oppositeFacingContactPairs':0,'yRange':[float('inf'),-float('inf')],'planes':set()})
            d['pairs']+=1;d['areaMetresSquared']+=float(ar);d['planes'].add((int(a[3]),float(a[4])))
            d['sameFacingPairs' if np.dot(a[5],b[5])>0 else 'oppositeFacingContactPairs']+=1
            d['yRange'][0]=min(d['yRange'][0],float(min(a[2][:,1].min(),b[2][:,1].min())))
            d['yRange'][1]=max(d['yRange'][1],float(max(a[2][:,1].max(),b[2][:,1].max())))
            if min(a[2][:,1].max(),b[2][:,1].max())<2.78:d['belowLowerClipPairs']+=1
for d in pairs.values():d['planes']=sorted(d['planes'])
report={'input':str(source),'method':'Axis-aligned coplanar face projected-triangle overlap, 1 micrometre plane tolerance; shared edges excluded. Opposite-facing contact faces require visibility review and are not by themselves exterior duplicate surfaces.','pairs':pairs,'limit':'Bevel faces and non-coplanar intersections are not counted; no raster/GPU reproduction.'}
out.write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
