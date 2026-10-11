import bpy,json,sys,hashlib,importlib.util
from pathlib import Path
P=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('build19',P/'build_bathroom_v19.py');b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
a,c=[Path(p) for p in sys.argv[sys.argv.index('--')+1:]]
def snap(p):
 bpy.ops.wm.open_mainfile(filepath=str(p));bpy.context.view_layer.update()
 return {'objects':{o.name:b.digest(o) for o in bpy.data.objects},'materials':{m.name:b.material_signature(m) for m in bpy.data.materials},'roots':{o.name:list(map(list,o.matrix_world)) for o in bpy.data.objects if o.type=='EMPTY'}}
x,y=snap(a),snap(c);diff={k:[n for n in sorted(set(x[k])|set(y[k])) if x[k].get(n)!=y[k].get(n)] for k in x}
r={'source':str(a),'sourceSha256':hashlib.sha256(a.read_bytes()).hexdigest(),'rebuild':str(c),'rebuildSha256':hashlib.sha256(c.read_bytes()).hexdigest(),'exactAuthoredDataEquivalent':not any(diff.values()),'differences':diff,'scope':'Object types, transforms, parenting, all mesh topology/positions/material slots/smooth flags, UVs/colors, curve paths/radii, custom properties, material inputs/link definitions, all root transforms.'}
(P/'rebuild-equivalence.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2));assert r['exactAuthoredDataEquivalent']
