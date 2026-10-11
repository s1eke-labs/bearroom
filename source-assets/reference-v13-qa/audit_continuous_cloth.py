"""Independent continuous cloth-triangle collision QA, not a vertex/sample test.
For runtime motion p_i(t)=p_i(0)+t*w_i*amp*(0,0,1), -1<=t<=1,
projected triangle footprints stay fixed. The signed height difference between
cloth and any nonvertical support face is affine over the intersection polygon
at either extreme t. Its extrema therefore occur at polygon vertices and t=+-1.
This checks full triangle interiors across the entire sine-wave motion range.
Vertical support faces are reviewed separately by exact 2D swept-strip clipping.
"""
import sys,json,math,time
from pathlib import Path
from collections import defaultdict,Counter
import numpy as np
EPS=1e-10;TOL=0.00025

def cross(a,b):return a[0]*b[1]-a[1]*b[0]
def area(p):return sum(cross(p[i],p[(i+1)%len(p)]) for i in range(len(p)))*.5 if len(p)>2 else 0

def clip(subject,tri):
 p=[np.asarray(x,dtype=float) for x in subject];sign=1 if area(tri)>=0 else -1
 for i in range(len(tri)):
  a,b=tri[i],tri[(i+1)%len(tri)];e=b-a;prev=p[-1] if p else None;out=[]
  if prev is None:return []
  dp=sign*cross(e,prev-a)
  for cur in p:
   dc=sign*cross(e,cur-a)
   if (dp>=-EPS)!=(dc>=-EPS):out.append(prev+(cur-prev)*(dp/(dp-dc)))
   if dc>=-EPS:out.append(cur)
   prev=cur;dp=dc
  p=out
 return p

def lineclip(a,b,tri):
 lo,hi=0.,1.;sign=1 if area(tri)>=0 else -1
 for i in range(len(tri)):
  v,w=tri[i],tri[(i+1)%len(tri)];d0=sign*cross(w-v,a-v);d1=sign*cross(w-v,b-v);delta=d1-d0
  if abs(delta)<EPS:
   if d0 < -EPS:return None
  elif delta>0:lo=max(lo,(-EPS-d0)/delta)
  else:hi=min(hi,(-EPS-d0)/delta)
  if lo>hi:return None
 return a+(b-a)*lo,a+(b-a)*hi

def hull(points):
 pts=sorted(set(map(tuple,points)))
 if len(pts)<=2:return [np.array(x) for x in pts]
 low=[]
 for p in pts:
  while len(low)>=2 and cross(np.array(low[-1])-low[-2],np.array(p)-low[-1])<=EPS:low.pop()
  low.append(p)
 up=[]
 for p in reversed(pts):
  while len(up)>=2 and cross(np.array(up[-1])-up[-2],np.array(p)-up[-1])<=EPS:up.pop()
  up.append(p)
 return [np.array(x) for x in low[:-1]+up[:-1]]

def gridcells(lo,hi,size):
 a=np.floor(lo/size).astype(int);b=np.floor(hi/size).astype(int)
 for x in range(a[0],b[0]+1):
  for y in range(a[1],b[1]+1):yield (x,y)

def analyze(base):
 base=Path(base);meta=json.loads(base.with_suffix('.json').read_text());data=np.load(base.with_suffix('.npz'));obs=meta['objects'];report={'source':meta['source'],'sha256':meta['sha256'],'scope':'Offline source evaluated meshes. Exact projected triangle intersections across full runtime scalar phase [-1,1], including triangle interiors. Surface clearance is signed height, not physical material thickness. No WebGL claim.','toleranceM':TOL,'cloth':{}}
 def mesh(name):
  k=obs[name]['arrayKey'];return data[k+'_world'],data[k+'_tri'],data[k+'_local']
 def descendants(root):
  chosen=[]
  for n,o in obs.items():
   p=n
   while p in obs:
    if p==root:chosen.append(n);break
    p=obs[p]['parent']
  return chosen
 for name,root,amp in [('anim_sofa_edge','F01_sofa',.0035),('anim_bed_edge','F15_bed',.004),('anim_dining_edge','F13_dining_group',.0035),('duvet_main','F15_bed',0.)]:
  if len(sys.argv)>3 and name not in sys.argv[3:]:continue
  started=time.time();p,ix,local=mesh(name);m=np.array(obs[name]['matrixWorld']);motion=m[:3,2]
  if np.linalg.norm(motion[:2])>1e-7:raise ValueError('Cloth deformation not world vertical: '+name)
  ymin,ymax=local[:,1].min(),local[:,1].max();edge=ymin+.25*(ymax-ymin);q=np.clip((edge-local[:,1])/(edge-ymin),0,1);weights=q*q*(3-2*q)*amp*motion[2]
  supportnames=[n for n in descendants(root) if 'arrayKey' in obs[n] and n!=name and not n.startswith('anim_')]
  if name=='duvet_main':supportnames=[n for n in supportnames if n in ['bed_mattress','bed_oak_frame','mattress_piping']]
  support=[];owners=[]
  for n in supportnames:
   v,t,_=mesh(n);support.extend(v[t]);owners.extend([n]*len(t))
  support=np.array(support);slo=support[:,:,:2].min(axis=1);shi=support[:,:,:2].max(axis=1);szlo=support[:,:,2].min(axis=1);szhi=support[:,:,2].max(axis=1);grid=defaultdict(list);size=.06
  for i in range(len(support)):
   for cell in gridcells(slo[i],shi[i],size):grid[cell].append(i)
  issues=[];worstissues={};counts=Counter();worst=defaultdict(lambda:{'gap':float('inf'),'face':None});testedpairs=0;projected=0;verticalpairs=0;skippedclothvertical=0
  for ti,ids in enumerate(ix):
   t=p[ids];w=weights[ids];lo=t[:,:2].min(axis=0);hi=t[:,:2].max(axis=0);low=(t[:,2]-w).min();high=(t[:,2]+w).max();candidates=set(i for cell in gridcells(lo,hi,size) for i in grid[cell]);
   if abs(area(t[:,:2]))<1e-13:
    lengths=[(np.linalg.norm(t[a,:2]-t[b,:2]),a,b) for a,b in [(0,1),(1,2),(2,0)]];length,a,b=max(lengths)
    if length<1e-10:continue
    axis=(t[b,:2]-t[a,:2])/length;sp=(t[:,:2]-t[a,:2])@axis;swept=hull(np.vstack([np.c_[sp,t[:,2]-w],np.c_[sp,t[:,2]+w]]))
    for si in candidates:
     if np.any(slo[si]>hi+EPS) or np.any(shi[si]<lo-EPS) or szlo[si]>high+EPS or szhi[si]<low-EPS:continue
     st=support[si];testedpairs+=1;verticalpairs+=1
     if abs(area(st[:,:2]))>1e-12:
      ab=lineclip(t[a,:2],t[b,:2],st[:,:2])
      if ab is None:continue
      xy=np.array(ab);sbary=np.c_[xy,np.ones(2)]@np.linalg.inv(np.vstack((st[:,:2].T,np.ones(3)))).T;z=sbary@st[:,2];line=np.c_[(xy-t[a,:2])@axis,z];hit=lineclip(line[0],line[1],swept) if len(swept)>=3 else None
     else:
      # Coplanar vertical triangles only. Distinct XY lines cannot meet except
      # at their shared endpoints, already covered by adjacent nonvertical faces.
      off=abs(cross(axis,st[0,:2]-t[a,:2]))
      if off>1e-7:continue
      support2=np.c_[(st[:,:2]-t[a,:2])@axis,st[:,2]];inter=clip(swept,support2);hit=inter if inter and abs(area(inter))>1e-12 else None
     if hit is not None:
      key=owners[si];counts[key]+=1;record={'clothTriangle':ti,'support':key,'supportTriangle':si,'verticalClothIntersection':True,'clothTriangleWorld':t.tolist()};worstissues.setdefault(key,record)
      if len(issues)<80:issues.append(record)
    continue
   inv=np.linalg.inv(np.vstack((t[:,:2].T,np.ones(3))))
   for si in candidates:
    if np.any(slo[si]>hi+EPS) or np.any(shi[si]<lo-EPS):continue
    # Face comparisons within 12 cm give useful clearance, farther faces cannot intersect.
    if szlo[si]>high+.12 or szhi[si]<low-.12:continue
    st=support[si];testedpairs+=1;poly=clip(t[:,:2],st[:,:2]) if abs(area(st[:,:2]))>1e-12 else None
    if poly is not None:
     if not poly or abs(area(poly))<1e-15:continue
     projected+=1;poly=np.array(poly);bary=np.c_[poly,np.ones(len(poly))]@inv.T;sbary=np.c_[poly,np.ones(len(poly))]@np.linalg.inv(np.vstack((st[:,:2].T,np.ones(3)))).T;z=bary@t[:,2]-sbary@st[:,2];dw=bary@w;gmin=float(np.min(z-dw));gmax=float(np.max(z+dw));normal=np.cross(st[1]-st[0],st[2]-st[0]);normal/=np.linalg.norm(normal)
     if normal[2]>.05 and gmin>-0.05 and gmin<worst[owners[si]]['gap']:worst[owners[si]]={'gap':gmin,'face':ti}
     if gmin < -TOL and gmax > TOL:
      key=owners[si];counts[key]+=1
      record={'clothTriangle':ti,'support':key,'supportTriangle':si,'minSignedHeightM':gmin,'maxSignedHeightM':gmax,'overlapXY':poly.tolist(),'clothTriangleWorld':t.tolist()}
      if key not in worstissues or gmin<worstissues[key].get('minSignedHeightM',0):worstissues[key]=record
      if len(issues)<80:issues.append(record)
    else:
     # A truly vertical support triangle projects to a line. Intersect that line
     # with the cloth footprint; its full vertical swept strip is a quadrilateral.
     verticalpairs+=1;dist=((st[:,:2,None]-st[:,:2].T[None,:,:])**2).sum(axis=1) if False else None
     lengths=[(np.linalg.norm(st[a,:2]-st[b,:2]),a,b) for a,b in [(0,1),(1,2),(2,0)]];length,a,b=max(lengths)
     if length<1e-10:continue
     ab=lineclip(st[a,:2],st[b,:2],t[:,:2])
     if ab is None:continue
     xy=np.array(ab);bary=np.c_[xy,np.ones(2)]@inv.T;zz=bary@t[:,2];ww=bary@w;axis=(st[b,:2]-st[a,:2])/length;sparam=(xy-st[a,:2])@axis;strip=np.array([[sparam[0],zz[0]-ww[0]],[sparam[1],zz[1]-ww[1]],[sparam[1],zz[1]+ww[1]],[sparam[0],zz[0]+ww[0]]]);support2=np.c_[(st[:,:2]-st[a,:2])@axis,st[:,2]]
     if abs(area(strip))>1e-15:
      inter=clip(strip,support2);hit=bool(inter and abs(area(inter))>1e-12)
     else:hit=lineclip(strip[0],strip[1],support2) is not None
     if hit:
      key=owners[si];counts[key]+=1
      if len(issues)<80:issues.append({'clothTriangle':ti,'support':key,'supportTriangle':si,'verticalSupportIntersection':True})
  report['cloth'][name]={'amplitudeM':amp,'vertices':len(p),'triangles':len(ix),'supportObjects':supportnames,'supportTriangles':len(support),'testedPairs':testedpairs,'projectedOverlapPairs':projected,'verticalSupportPairs':verticalpairs,'verticalClothTrianglesNotCovered':skippedclothvertical,'intersectionPairsAboveTolerance':sum(counts.values()),'intersectionCountsBySupport':dict(counts),'minimumNearSupportSignedHeightByObject':dict(worst),'worstIssueBySupport':worstissues,'firstIssues':issues,'elapsedSeconds':time.time()-started}
  base.with_name(base.name+'-continuous-progress').with_suffix('.json').write_text(json.dumps(report,indent=2))
  print(name,report['cloth'][name]['intersectionCountsBySupport'],'vertical cloth',skippedclothvertical,'seconds',time.time()-started,flush=True)
 report['passed']=all(not x['intersectionPairsAboveTolerance'] and not x['verticalClothTrianglesNotCovered'] for x in report['cloth'].values())
 return report
if __name__=='__main__':
 r=analyze(sys.argv[1]);Path(sys.argv[2]).write_text(json.dumps(r,indent=2));print('PASSED',r['passed'])
