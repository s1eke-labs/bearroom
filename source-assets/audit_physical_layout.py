"""Independent offline geometry QA against authoritative production layout.
Checks fixed-root transforms, world envelopes/support minima, new AABB overlaps,
and screen-front clearance rays. AABB alerts are review candidates, not collision proof.
"""
import argparse,json
from pathlib import Path
import numpy as np
from compact_recovered_runtime import load,decoded

def matrix(n):
 if 'matrix' in n:return np.array(n['matrix'],dtype=float).reshape(4,4).T
 x,y,z,w=n.get('rotation',[0,0,0,1]);q=np.array([x,y,z,w],dtype=float);q/=np.linalg.norm(q);x,y,z,w=q
 r=np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
 m=np.eye(4);m[:3,:3]=r@np.diag(n.get('scale',[1,1,1]));m[:3,3]=n.get('translation',[0,0,0]);return m

def scene(path):
 j,b=load(path);nodes=j['nodes'];parents={c:i for i,n in enumerate(nodes) for c in n.get('children',[])};world={}
 def wm(i):
  if i not in world:world[i]=(wm(parents[i]) if i in parents else np.eye(4))@matrix(nodes[i])
  return world[i]
 objs={};groups={};roots={}
 for i,n in enumerate(nodes):
  if n.get('extras',{}).get('furnitureId') or n.get('name','').startswith('Bear_') and 'mesh' not in n:roots[n['name']]=wm(i)
  if 'mesh' not in n or n.get('name','').startswith('plush_fibers_'):continue
  pos=[];tri=[];opaque=[]
  for p in j['meshes'][n['mesh']]['primitives']:
   x=decoded(j,b,p['attributes']['POSITION']);x=x@wm(i)[:3,:3].T+wm(i)[:3,3];ix=decoded(j,b,p['indices']).ravel();pos.append(x);tris=x[ix].reshape(-1,3,3);tri.append(tris)
   mat=j['materials'][p['material']] if 'material' in p else {}
   if mat.get('alphaMode','OPAQUE')=='OPAQUE':opaque.append(tris)
  x=np.concatenate(pos);t=np.concatenate(tri);bounds=np.array([x.min(axis=0),x.max(axis=0)])
  objs[n['name']]={'positions':x,'triangles':t,'opaqueTriangles':np.concatenate(opaque) if opaque else np.empty((0,3,3)),'bounds':bounds}
  p=i
  while True:
   pn=nodes[p]['name']
   if pn in roots:groups.setdefault(pn,[]).append(bounds)
   if p not in parents:break
   p=parents[p]
 # roots may appear after their children in glTF order. Rebuild grouping by names.
 groups={k:[] for k in roots}
 for i,n in enumerate(nodes):
  if n['name'] not in objs:continue
  p=i
  while True:
   if nodes[p]['name'] in groups:groups[nodes[p]['name']].append(objs[n['name']]['bounds'])
   if p not in parents:break
   p=parents[p]
 bounds={name:np.array([np.min(np.array(a)[:,0,:],axis=0),np.max(np.array(a)[:,1,:],axis=0)]) for name,a in groups.items() if a}
 return {'objects':objs,'roots':roots,'groups':bounds}

def ray_first(sc,origin,direction,maxdist,exclude):
 best=maxdist;name=None
 for key,ob in sc['objects'].items():
  if key in exclude:continue
  t=ob['opaqueTriangles']
  if not len(t):continue
  lo,hi=ob['bounds'];end=origin+direction*maxdist
  if np.any(np.maximum(origin,end)<lo-1e-5) or np.any(np.minimum(origin,end)>hi+1e-5):continue
  e1=t[:,1]-t[:,0];e2=t[:,2]-t[:,0];h=np.cross(np.broadcast_to(direction,e2.shape),e2);a=np.einsum('ij,ij->i',e1,h);valid=np.abs(a)>1e-10;f=np.zeros(len(a));f[valid]=1/a[valid];s=origin-t[:,0];u=f*np.einsum('ij,ij->i',s,h);q=np.cross(s,e1);v=f*np.einsum('j,ij->i',direction,q);dist=f*np.einsum('ij,ij->i',e2,q);valid &= (u>=-1e-7)&(v>=-1e-7)&(u+v<=1+1e-7)&(dist>1e-5)&(dist<best)
  if np.any(valid):best=float(dist[valid].min());name=key
 return {'object':name,'distance':best}

def audit(source,candidate):
 s=scene(source);d=scene(candidate);result={'candidate':str(candidate),'rootTransformChanges':[],'envelopeReviews':[],'newAggregateOverlapReviews':[],'screenClearance':[],'notes':['Y-up world coordinates; envelope/overlap flags require review, not automatic collision conclusions.','Screen tests cover central3x3 front-surface samples with20cm ray segment.','Hidden legacy fiber objects excluded from all physical bounds.']}
 for name,sm in s['roots'].items():
  if name not in d['roots']:result['rootTransformChanges'].append({'name':name,'error':'missing'});continue
  err=float(np.max(abs(sm-d['roots'][name])))
  if err>2e-5:result['rootTransformChanges'].append({'name':name,'maxError':err})
 for name,a in s['groups'].items():
  if name not in d['groups']:continue
  b=d['groups'][name];exp=np.maximum(np.r_[a[0]-b[0],b[1]-a[1]],0);shift=b-a
  result['envelopeReviews'].append({'name':name,'originalBounds':a.tolist(),'candidateBounds':b.tolist(),'maxOutwardExpansionM':float(exp.max()),'supportMinimumDeltaM':float(shift[0,1]),'review':bool(exp.max()>.02 or abs(shift[0,1])>.01)})
 names=sorted(set(s['groups'])&set(d['groups']))
 for i,a in enumerate(names):
  for bb in names[i+1:]:
   ba=s['groups'][a];bc=s['groups'][bb];oa=np.minimum(ba[1],bc[1])-np.maximum(ba[0],bc[0]);da=d['groups'][a];dc=d['groups'][bb];ob=np.minimum(da[1],dc[1])-np.maximum(da[0],dc[0]);
   if np.any(oa<-.01) and np.all(ob>.005):result['newAggregateOverlapReviews'].append({'a':a,'b':bb,'originalAxesOverlapM':oa.tolist(),'candidateAxesOverlapM':ob.tolist()})
 for name in ['screen_PC','screen_TV']:
  if name not in s['objects'] or name not in d['objects']:result['screenClearance'].append({'name':name,'missing':True});continue
  ob=s['objects'][name];points=ob['positions'];center=points.mean(axis=0);_,_,basis=np.linalg.svd(points-center,full_matrices=False);u,v,n=basis;triangle=ob['triangles'][0];face=np.cross(triangle[1]-triangle[0],triangle[2]-triangle[0]);n*=1 if np.dot(n,face)>0 else -1
  ext=np.max(abs((points-center)@np.array([u,v]).T),axis=0);samples=[]
  for a in [-.65,0,.65]:
   for b in [-.65,0,.65]:
    origin=center+u*a*ext[0]+v*b*ext[1]+n*.2;before=ray_first(s,origin,-n,.195,{name});after=ray_first(d,origin,-n,.195,{name});samples.append({'uv':[a,b],'before':before,'after':after,'newBlocker':after['object'] is not None and (before['object'] is None or after['distance']<before['distance']-.01)})
  result['screenClearance'].append({'name':name,'normal':n.tolist(),'samples':samples,'newBlockerCount':sum(x['newBlocker'] for x in samples)})
 result['faceClearance']=[]
 for root,prefix in [('Bear_reference_plush',''),('Bear_desk_plush','desk_')]:
  if root not in d['roots']:continue
  forward=d['roots'][root][:3,:3]@np.array([0.,0.,1.]);forward/=np.linalg.norm(forward)
  for suffix in ['bear_eye_L_embroidery','bear_eye_R_embroidery','bear_nose_rounded_triangle','bear_mouth_stitched_W']:
   name=prefix+suffix
   if name not in d['objects']:continue
   pts=d['objects'][name]['positions'];front=(pts@forward).max();center=pts.mean(axis=0);center+=forward*(front-center@forward);hit=ray_first(d,center+forward*.015,-forward,.0145,{name});result['faceClearance'].append({'name':name,'frontOccluder':hit['object'],'distance':hit['distance']})
 result['protectedToyVolumes']=[]
 for name,volume in d['objects'].items():
  if name not in ['Bear_reference_plush__fabric_bear','Bear_desk_plush__fabric_bear'] and not ('bear' in name.lower() and 'head' in name):continue
  candidates=[]
  for environment,ob in d['objects'].items():
   if environment.startswith(('Bear_','bear_','desk_bear_','plush_')):continue
   triangles=ob['triangles'];lo=triangles.min(axis=1);hi=triangles.max(axis=1);mask=np.all((lo<volume['bounds'][1])&(hi>volume['bounds'][0]),axis=1)
   if np.any(mask):candidates.append({'name':environment,'triangleBoundsOverlapCount':int(mask.sum())})
  result['protectedToyVolumes'].append({'name':name,'possibleEnvironmentIntersections':candidates})
 result['toySupportContacts']=[]
 exclude={key for key in d['objects'] if key.startswith(('Bear_','bear_','desk_bear_','plush_'))}
 for name,foot in d['objects'].items():
  if 'bear_foot_' not in name:continue
  pts=foot['positions'];bottom=pts[pts[:,1].argmin()];origin=bottom.copy();origin[1]+=.05;hit=ray_first(d,origin,np.array([0.,-1.,0.]),.2,exclude);gap=hit['distance']-.05 if hit['object'] else None
  result['toySupportContacts'].append({'name':name,'soleWorld':bottom.tolist(),'surface':hit['object'],'soleClearanceM':gap,'review':gap is None or gap>.002 or gap<-.005})
 result['requiresReview']=bool(result['rootTransformChanges'] or result['newAggregateOverlapReviews'] or any(x['review'] for x in result['envelopeReviews']) or any(x.get('newBlockerCount',0) for x in result['screenClearance']) or any(x['frontOccluder'] for x in result['faceClearance']) or any(x['review'] for x in result['toySupportContacts']) or any(x['possibleEnvironmentIntersections'] for x in result['protectedToyVolumes']))
 return result
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('candidate');p.add_argument('report');a=p.parse_args();r=audit(a.source,a.candidate);Path(a.report).write_text(json.dumps(r,indent=2));print(json.dumps({k:v for k,v in r.items() if k not in ['envelopeReviews','screenClearance']},indent=2));print('ENVELOPE FLAGS',[x['name'] for x in r['envelopeReviews'] if x['review']]);print('SCREEN',[(x['name'],x.get('newBlockerCount')) for x in r['screenClearance']])
