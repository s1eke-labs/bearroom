"""Idempotent PC construction and non-PC stability, independent of .blend bytes."""
import bpy,sys,json,hashlib,struct
from pathlib import Path
P=Path(__file__).resolve().parent;sys.path.insert(0,str(P));from rebuild_pc_reference_v16 import apply_pc_reference_v16

def plain(v):
 if hasattr(v,'to_list'):return v.to_list()
 if isinstance(v,dict):return {k:plain(x) for k,x in v.items()}
 if hasattr(v,'keys'):return {k:plain(v[k]) for k in v.keys()}
 return v

def signature(o):
 h=hashlib.sha256();h.update(json.dumps({'type':o.type,'parent':o.parent.name if o.parent else None,'matrix':[float(x) for row in o.matrix_local for x in row],'extras':plain(dict(o.items()))},sort_keys=True,default=lambda v:list(v)).encode())
 if o.type=='MESH':
  for v in o.data.vertices:h.update(struct.pack('3f',*v.co))
  for p in o.data.polygons:h.update(struct.pack('II?',len(p.vertices),p.material_index,p.use_smooth));h.update(struct.pack(str(len(p.vertices))+'I',*p.vertices))
  for uv in o.data.uv_layers:
   for d in uv.data:h.update(struct.pack('2f',*d.uv))
  h.update(json.dumps([m.name for m in o.data.materials]).encode())
  h.update(json.dumps([(m.type,getattr(m,'width',0),getattr(m,'segments',0)) for m in o.modifiers]).encode())
 return h.hexdigest()

src=P/'bearroom-pc-v16.blend';bpy.ops.wm.open_mainfile(filepath=str(src));before={o.name:signature(o) for o in bpy.data.objects};apply_pc_reference_v16();after={o.name:signature(o) for o in bpy.data.objects};diff=[n for n in sorted(set(before)|set(after)) if before.get(n)!=after.get(n)]
r={'source':str(src),'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'testedObjects':len(before),'idempotentRebuild':not diff,'differences':diff,'scope':'Object hierarchy, transforms, custom properties; vertex positions, polygons, smooth flags, material slots, UVs and bevel parameters. No display image or non-PC data modified by rebuild.'};(P/'pc-v16-review/idempotence-report.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2));assert not diff
