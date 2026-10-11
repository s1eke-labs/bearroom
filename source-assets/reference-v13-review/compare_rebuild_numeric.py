import bpy,json,numpy as np
from pathlib import Path
P=Path('/workspace/scratch/2ea1830e5ccf/bearroom-model-assets')
def read(path):
 bpy.ops.wm.open_mainfile(filepath=str(path));bpy.context.view_layer.update();r={}
 for o in bpy.data.objects:
  if 'bear' not in o.name.lower():continue
  d={'matrix':np.array(o.matrix_local),'world':np.array(o.matrix_world)}
  if o.type=='MESH':d['vertices']=np.array([list(v.co) for v in o.data.vertices]);d['uvs']={u.name:np.array([list(x.uv) for x in u.data]) for u in o.data.uv_layers}
  r[o.name]=d
 return r
a=read(P/'bearroom-reference-v13.blend');b=read('/tmp/bearroom-v13-rebuild-verification.blend');diff=[]
for n,x in a.items():
 y=b[n];d={'name':n,'localMatrixMaxDelta':float(np.max(abs(x['matrix']-y['matrix']))),'worldMatrixMaxDelta':float(np.max(abs(x['world']-y['world'])))}
 if 'vertices' in x:d['localVertexMaxDelta']=float(np.max(abs(x['vertices']-y['vertices']))) if x['vertices'].shape==y['vertices'].shape else 999;d['uvMaxDelta']=max([float(np.max(abs(x['uvs'][k]-y['uvs'][k]))) for k in x['uvs']]+[0])
 diff.append(d)
r={'maxLocalMatrixDelta':max(d['localMatrixMaxDelta'] for d in diff),'maxWorldMatrixDelta':max(d['worldMatrixMaxDelta'] for d in diff),'maxVertexDelta':max(d.get('localVertexMaxDelta',0) for d in diff),'maxUVDelta':max(d.get('uvMaxDelta',0) for d in diff),'differences':sorted(diff,key=lambda x:max(x.values()-{'name'}) if False else x.get('localVertexMaxDelta',0),reverse=True)}
(P/'reference-v13-review/rebuild-toy-numeric-deltas.json').write_text(json.dumps(r,indent=2));print({k:v for k,v in r.items() if k!='differences'});print(diff[:10])
