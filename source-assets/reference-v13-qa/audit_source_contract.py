import json,sys
from pathlib import Path
import numpy as np
old=json.loads(Path(sys.argv[1]).read_text());new=json.loads(Path(sys.argv[2]).read_text());a=old['objects'];b=new['objects'];r={'source':new['source'],'sha256':new['sha256'],'baselineSha256':old['sha256'],'transformParentIssues':[],'protectedMetadataIssues':[],'counts':{},'privacy':[],'envelopes':[],'newAggregateOverlapReviews':[]}
for key in ['furnitureId','animationAxis','midi','clothAxis']:
 am={n:o['extras'][key] for n,o in a.items() if key in o['extras']};bm={n:o['extras'][key] for n,o in b.items() if key in o['extras']};r['counts'][key]=len(bm)
 if am!=bm:r['protectedMetadataIssues'].append({'key':key,'error':'Name/value mapping changed'})
protected=[n for n,o in a.items() if o['type']=='EMPTY' or n.startswith(('piano_key_','anim_','cutaway_bathroom','bathroom_door'))];r['protectedTransformsChecked']=len(protected)
for n in protected:
 if n not in b:r['transformParentIssues'].append({'name':n,'error':'missing'});continue
 for k in ['matrixLocal','matrixWorld']:
  e=float(np.max(abs(np.array(a[n][k])-b[n][k])))
  if e>2e-6:r['transformParentIssues'].append({'name':n,'key':k,'maxError':e})
 if a[n]['parent']!=b[n]['parent']:r['transformParentIssues'].append({'name':n,'error':'parent'})
 for k,v in a[n]['extras'].items():
  if k=='toyRealismRevision':continue
  if b[n]['extras'].get(k)!=v:r['protectedMetadataIssues'].append({'name':n,'key':k})
for n,o in b.items():
 if n.startswith('cutaway_bathroom') and 'bounds' in o:
  eq=n in a and np.allclose(o['bounds'],a[n]['bounds'],atol=2e-6);opaque=all(m['baseAlpha']==1 for m in o['materials']);r['privacy'].append({'name':n,'geometryBoundsUnchanged':bool(eq),'allMaterialBaseAlphaOne':opaque})
roots=[n for n,o in a.items() if 'furnitureId' in o['extras'] or n in ['Bear_reference_plush','Bear_desk_plush']]
def bounds(root,objects):
 bb=[]
 for n,o in objects.items():
  p=n
  while p in objects:
   if p==root:
    if 'bounds' in o and not n.startswith('plush_fibers_'):bb.append(o['bounds'])
    break
   p=objects[p]['parent']
 x=np.array(bb);return np.array([x[:,0].min(axis=0),x[:,1].max(axis=0)])
oldbounds={n:bounds(n,a) for n in roots};newbounds={n:bounds(n,b) for n in roots}
for n in roots:
 oldb=oldbounds[n];newb=newbounds[n];expand=np.maximum(np.r_[oldb[0]-newb[0],newb[1]-oldb[1]],0);r['envelopes'].append({'name':n,'original':oldb.tolist(),'current':newb.tolist(),'maximumExpansionM':float(expand.max()),'maxHorizontalExpansionM':float(np.maximum(oldb[0,:2]-newb[0,:2],newb[1,:2]-oldb[1,:2]).max())})
for i,n in enumerate(roots):
 for k in roots[i+1:]:
  oa=np.minimum(oldbounds[n][1],oldbounds[k][1])-np.maximum(oldbounds[n][0],oldbounds[k][0]);na=np.minimum(newbounds[n][1],newbounds[k][1])-np.maximum(newbounds[n][0],newbounds[k][0]);
  if np.any(oa<-.01) and np.all(na>.005):r['newAggregateOverlapReviews'].append({'a':n,'b':k,'priorOverlap':oa.tolist(),'currentOverlap':na.tolist()})
r['passed']=not r['transformParentIssues'] and not r['protectedMetadataIssues'] and all(x['geometryBoundsUnchanged'] and x['allMaterialBaseAlphaOne'] for x in r['privacy']) and not r['newAggregateOverlapReviews'];Path(sys.argv[3]).write_text(json.dumps(r,indent=2));print(json.dumps({k:v for k,v in r.items() if k!='envelopes'},indent=2))
