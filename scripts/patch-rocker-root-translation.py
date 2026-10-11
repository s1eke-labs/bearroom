#!/usr/bin/env python3
"""One approved, source-proven GLB root translation. No other JSON or BIN change.
Preserves the standard full-source Blender exporter; this is a bounded equivalent
finalization step after an independently proven rigid-only source correction.
"""
import argparse,copy,hashlib,json,struct
from pathlib import Path
sha=lambda b:hashlib.sha256(b).hexdigest()
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('input');p.add_argument('output');p.add_argument('--source-proof',required=True);p.add_argument('--old-source',required=True);p.add_argument('--new-source',required=True);p.add_argument('--export-report',required=True);a=p.parse_args()
 assert Path(a.input).resolve()!=Path(a.output).resolve()
 old=Path(a.input).read_bytes();assert struct.unpack_from('<III',old)==(0x46546c67,2,len(old));n=struct.unpack_from('<I',old,12)[0];assert struct.unpack_from('<I',old,16)[0]==0x4e4f534a
 j=json.loads(old[20:20+n]);before=copy.deepcopy(j);tail=old[20+n:];proof=json.loads(Path(a.source_proof).read_text());export=json.loads(Path(a.export_report).read_text())
 assert proof['root']=='F16_reading_rocker' and proof['rootCustomPropertiesUnchanged'] is True
 assert sha(Path(a.old_source).read_bytes())==proof['sourceSha256']==export['sourceSha256']
 assert export['sourceUnchangedDuringExport'] is True
 assert sha(Path(a.new_source).read_bytes())==proof['outputSha256']
 old_basis=proof['oldRootBasis'];new_basis=proof['newRootBasis']
 for row in range(4):
  for col in range(4):
   if (row,col)!=(2,3):assert old_basis[row][col]==new_basis[row][col]
 assert abs(new_basis[2][3]-old_basis[2][3]+.022)<1e-8
 for basis in [old_basis,new_basis]:
  for row in range(4):
   for col in range(4):
    if col==3 and row<3:continue
    assert basis[row][col]==(1 if row==col else 0),'Rigid translation only; no transform decomposition'
 matches=[i for i,node in enumerate(j['nodes']) if node.get('name')==proof['root']];assert len(matches)==1;i=matches[0];node=j['nodes'][i]
 assert not any(i in other.get('children',[]) for other in j['nodes']),'Authored source root must map directly to exported scene root'
 assert i in j['scenes'][j.get('scene',0)]['nodes'];assert 'matrix' not in node and 'rotation' not in node and 'scale' not in node
 old_t=[old_basis[0][3],old_basis[2][3],-old_basis[1][3]];new_t=[new_basis[0][3],new_basis[2][3],-new_basis[1][3]]
 assert node['translation']==old_t;node['translation']=new_t
 reverted=copy.deepcopy(j);reverted['nodes'][i]['translation']=old_t;assert reverted==before,'Unapproved JSON change'
 text=json.dumps(j,separators=(',',':')).encode();text+=b' '*((-len(text))%4)
 out=struct.pack('<III',0x46546c67,2,20+len(text)+len(tail))+struct.pack('<II',len(text),0x4e4f534a)+text+tail
 Path(a.output).write_bytes(out);verify=Path(a.output).read_bytes();size=struct.unpack_from('<I',verify,12)[0];assert verify[20+size:]==tail,'BIN chunk changed';check=json.loads(verify[20:20+size]);check['nodes'][i]['translation']=old_t;assert check==before
 report={'scope':'Exactly one source-proven F16 scene-root translation; no other JSON values or binary chunk bytes changed. Independent full evaluated final-source/world-triangle+normal verification is additionally required.','operation':'rigid-root-translation-only','inputModelSha256':sha(old),'outputModelSha256':sha(out),'oldSourceSha256':proof['sourceSha256'],'sourceSha256':proof['outputSha256'],'sourceProofSha256':sha(Path(a.source_proof).read_bytes()),'inputExportReportSha256':sha(Path(a.export_report).read_bytes()),'nodeIndex':i,'nodeName':node['name'],'directSceneRoot':True,'oldTranslation':old_t,'newTranslation':new_t,'translationDelta':[new_t[k]-old_t[k] for k in range(3)],'otherJSONValuesExact':True,'entireBINChunkByteIdentical':True,'binaryChunkSha256':sha(tail),'oldBytes':len(old),'newBytes':len(out)}
 Path(a.output+'.root-patch.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if __name__=='__main__':main()
