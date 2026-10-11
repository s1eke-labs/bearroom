"""Prove the only main-bear change is a single rigid root transform."""
import json,sys,numpy as np
from pathlib import Path
a,b=map(lambda p:json.loads(Path(p).read_text()),sys.argv[1:3]);out=Path(sys.argv[3]);ao,bo=a['objects'],b['objects'];root=sys.argv[4] if len(sys.argv)>4 else 'Bear_reference_plush';old=np.array(ao[root]['worldMatrix']);new=np.array(bo[root]['worldMatrix']);delta=new@np.linalg.inv(old);issues=[];checks=[]
oldNames={n for n,o in ao.items() if o['root']==root};newNames={n for n,o in bo.items() if o['root']==root}
if oldNames!=newNames:issues.append('Main bear subtree node set changed')
for n in sorted(oldNames&newNames):
 x,y=ao[n],bo[n];allowed={'worldMatrix','worldBounds','matrix'};changed=[k for k in x if k not in allowed and x[k]!=y.get(k)]
 localError=0.0 if n==root else float(abs(np.array(x['matrix'])-np.array(y['matrix'])).max())
 if localError>2e-6:changed.append('matrix')
 if changed:issues.append(n+': non-rigid payload/local change '+str(changed))
 error=float(abs(np.array(y['worldMatrix'])-delta@np.array(x['worldMatrix'])).max());checks.append({'name':n,'worldMatrixResidual':error,'payloadExactAndRelativeTransformWithinTolerance':not changed,'relativeMatrixMaxError':localError})
 if error>2e-6:issues.append(n+': world matrix not explained by root delta')
r=delta[:3,:3];rigidError=float(abs(r.T@r-np.eye(3)).max());det=float(np.linalg.det(r));
if rigidError>2e-6 or abs(det-1)>2e-6:issues.append('Root transform introduces scale/shear/reflection')
angle=float(np.degrees(np.arccos(np.clip((np.trace(r)-1)/2,-1,1))))
report={'baselineSourceSha256':a['sourceSha256'],'candidateSourceSha256':b['sourceSha256'],'root':root,'rootMatrixBefore':old.tolist(),'rootMatrixAfter':new.tolist(),'rootWorldDelta':delta.tolist(),'rotationAngleDegrees':angle,'rootOriginShiftWorldM':(new[:3,3]-old[:3,3]).tolist(),'rotationOrthogonalityError':rigidError,'rotationDeterminant':det,'nodesVerified':len(checks),'checks':checks,'issues':issues,'passed':not issues};out.write_text(json.dumps(report,indent=2));print(json.dumps({k:report[k] for k in ['passed','nodesVerified','rotationAngleDegrees','rootOriginShiftWorldM','issues']},indent=2))
