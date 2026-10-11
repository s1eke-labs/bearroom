"""Independent exact stored matrix_basis + geometry protection for rigid bear movement."""
import bpy,json,sys,hashlib,numpy as np
from pathlib import Path
base,src,out=map(Path,sys.argv[sys.argv.index('--')+1:])
def inventory(p):
 bpy.ops.wm.open_mainfile(filepath=str(p));root=bpy.data.objects['Bear_reference_plush'];d={}
 for o in [root,*root.children_recursive]:
  h=hashlib.sha256();basis=list(map(list,o.matrix_basis));x={'basis':basis,'parent':o.parent.name if o.parent else None,'type':o.type}
  if o.type=='MESH':
   vs=np.empty(len(o.data.vertices)*3,np.float32);o.data.vertices.foreach_get('co',vs);ids=np.empty(len(o.data.loops),np.int32);o.data.loops.foreach_get('vertex_index',ids);h.update(vs.tobytes());h.update(ids.tobytes());x['geometryHash']=h.hexdigest();x['materials']=[m.name for m in o.data.materials]
  d[o.name]=x
 return d
a=inventory(base);b=inventory(src);issues=[]
for n,x in a.items():
 if n not in b:issues.append(n+': missing');continue
 for k,v in x.items():
  if n=='Bear_reference_plush' and k=='basis':continue
  if v!=b[n].get(k):issues.append(n+': changed '+k)
if set(a)!=set(b):issues.append('Subtree node set changed')
r={'baselineSha256':hashlib.sha256(base.read_bytes()).hexdigest(),'candidateSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'checkedNodes':len(a),'scope':'Exact stored matrix_basis, local mesh vertices/topology/material assignments and parents for every main-bear descendant. Only root basis may change; world rigidity separately verified.','issues':issues,'passed':not issues};out.write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2))
