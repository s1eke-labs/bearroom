"""Exact source protection comparison, independent of runtime exceptions."""
import json,sys
from pathlib import Path
a,b=map(lambda p:json.loads(Path(p).read_text()),sys.argv[1:3]);out=Path(sys.argv[3]);ao,bo=a['objects'],b['objects'];changes={n:[k for k in ao[n] if ao[n][k]!=bo[n].get(k)] for n in sorted(ao.keys()&bo.keys()) if any(ao[n][k]!=bo[n].get(k) for k in ao[n])};removed=sorted(ao.keys()-bo.keys());added=sorted(bo.keys()-ao.keys());mats=[n for n in a['materials'].keys()&b['materials'].keys() if a['materials'][n]!=b['materials'][n]]
issues=[]
bearProof=json.loads(Path(sys.argv[4]).read_text()) if len(sys.argv)>4 else None
if bearProof:assert bearProof['passed'] and bearProof['candidateSourceSha256']==b['sourceSha256']
for n,keys in changes.items():
 if bearProof and ao[n]['root']=='Bear_reference_plush' and set(keys)<={'matrix','worldMatrix','worldBounds'}:continue
 if n not in ['anim_sofa_edge','Decor__botanical_sage','Decor__wood_honey']:issues.append('Unexpected common object changed: '+n+' '+str(keys))
 if n=='Decor__wood_honey' and set(keys)-{'materials'}:issues.append('Soil geometry/transform changed: '+str(keys))
 if set(keys)&{'matrix','worldMatrix','parent','root','type'}:issues.append('Protected transform/parent changed: '+n)
for n in removed:
 r=ao[n]['root']
 if not (r=='F01_sofa' and n.startswith('F01_sofa__fabric_') or r=='F11_computer_chair' and n.startswith('chair_') or r=='F16_reading_rocker' and n.startswith(('rocker_seat','rocker_back','rocker_pillow','rocker_arm'))):issues.append('Unexpected removed source object: '+n)
for n in added:
 if not n.startswith(('sofa_v17_','chair_v17_','rocker_v17_','botanical_v17_')):issues.append('Unexpected added source object: '+n)
if mats:issues.append('Existing material graphs changed: '+str(mats))
quality={n:d['meshQuality'] for n,d in bo.items() if 'meshQuality'in d}
for n,d in quality.items():
 if not d['allFinite'] or d['looseVerts'] or d['degenerateFaces']:issues.append(n+': malformed new mesh')
 if not n.startswith('botanical') and not n.endswith('shoulder_seam') and (d['nonManifoldEdges'] or d['signedVolumeLocal']<=0):issues.append(n+': open/inverted solid')
r={'baselineSha256':a['sourceSha256'],'candidateSha256':b['sourceSha256'],'unchangedObjects':len(ao.keys()&bo.keys())-len(changes),'changes':changes,'removed':removed,'added':added,'changedExistingMaterials':mats,'newMeshQuality':quality,'bearRigidProof':bearProof['candidateSourceSha256'] if bearProof else None,'issues':issues,'passed':not issues};out.write_text(json.dumps(r,indent=2));print(json.dumps({'unchanged':r['unchangedObjects'],'changes':changes,'removed':len(removed),'added':len(added),'issues':issues},indent=2))
