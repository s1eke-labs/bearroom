"""Exact authored scene-data equivalence, independent of .blend container bytes."""
import bpy,sys,hashlib,struct,json
from pathlib import Path
P=Path(__file__).resolve().parent
args=sys.argv[sys.argv.index('--')+1:]
def signature(path):
 bpy.ops.wm.open_mainfile(filepath=str(path));result={}
 for o in bpy.data.objects:
  h=hashlib.sha256();h.update(o.type.encode());h.update((o.parent.name if o.parent else '').encode())
  for row in o.matrix_basis:h.update(struct.pack('4f',*row))
  for row in o.matrix_world:h.update(struct.pack('4f',*row))
  h.update(str(sorted((k,str(o[k])) for k in o.keys())).encode())
  if o.type=='MESH':
   me=o.data
   for v in me.vertices:h.update(struct.pack('3f',*v.co))
   for f in me.polygons:h.update(struct.pack(str(len(f.vertices))+'I',*f.vertices));h.update(struct.pack('I?',f.material_index,f.use_smooth))
   for layer in me.uv_layers:
    h.update(layer.name.encode())
    for d in layer.data:h.update(struct.pack('2f',*d.uv))
   for layer in me.color_attributes:
    h.update(layer.name.encode())
    for d in layer.data:h.update(struct.pack('4f',*d.color))
   for m in me.materials:h.update(m.name.encode())
  elif o.type=='CURVE':
   h.update(struct.pack('fI',o.data.bevel_depth,o.data.bevel_resolution))
   for s in o.data.splines:
    for p in s.points:h.update(struct.pack('4f',*p.co))
   for m in o.data.materials:h.update(m.name.encode())
  result[o.name]=h.hexdigest()
 return result
src=Path(args[0]);rebuilt=Path(args[1]);a=signature(src);b=signature(rebuilt);diff=[n for n in sorted(set(a)|set(b)) if a.get(n)!=b.get(n)];report={'source':str(src),'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'rebuilt':str(rebuilt),'rebuiltSha256':hashlib.sha256(rebuilt.read_bytes()).hexdigest(),'sourceObjects':len(a),'rebuiltObjects':len(b),'exactAuthoredDataEquivalent':not diff,'differences':diff,'scope':'Exact basis/world transforms, parentage, object custom properties, mesh positions/topology/smooth flags/material slots/UV/color data, curve paths/radii/materials.'}
(P/'soft-v17-work/rebuild-equivalence.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));assert not diff
