"""Compare two editable sources without relying on Blender serialization bytes."""
import bpy,hashlib,struct,json,sys
from pathlib import Path
args=sys.argv[sys.argv.index('--')+1:]
def sig(path):
 bpy.ops.wm.open_mainfile(filepath=str(Path(path).resolve()));out={}
 for o in bpy.data.objects:
  r={'type':o.type,'parent':o.parent.name if o.parent else None,'matrixLocal':[float(x) for row in o.matrix_local for x in row]}
  if o.type=='MESH':
   h=hashlib.sha256()
   for v in o.data.vertices:h.update(struct.pack('3f',*v.co))
   for p in o.data.polygons:h.update(struct.pack('II?',len(p.vertices),p.material_index,p.use_smooth));h.update(struct.pack(str(len(p.vertices))+'I',*p.vertices))
   for uv in o.data.uv_layers:
    h.update(uv.name.encode())
    for v in uv.data:h.update(struct.pack('2f',*v.uv))
   for ca in o.data.color_attributes:
    h.update((ca.name+ca.domain+ca.data_type).encode())
    for v in ca.data:h.update(struct.pack('4f',*v.color))
   r['meshHash']=h.hexdigest();r['vertices']=len(o.data.vertices);r['faces']=len(o.data.polygons)
  elif o.type=='CURVE':
   r['curve']={'depth':o.data.bevel_depth,'resolution':o.data.bevel_resolution,'splines':[{'type':s.type,'cyclic':s.use_cyclic_u,'points':[tuple(p.co) for p in s.points],'beziers':[(tuple(p.co),tuple(p.handle_left),tuple(p.handle_right)) for p in s.bezier_points]} for s in o.data.splines]}
  if o.type in ['MESH','CURVE']:r['materials']=[m.name for m in o.data.materials]
  r['modifiers']=[{'type':m.type,'name':m.name,'width':getattr(m,'width',None),'segments':getattr(m,'segments',None),'levels':getattr(m,'levels',None),'render_levels':getattr(m,'render_levels',None)} for m in o.modifiers]
  out[o.name]=r
 return out
x,y=sig(args[0]),sig(args[1]);differences=[k for k in sorted(set(x)|set(y)) if x.get(k)!=y.get(k)]
r={'baselineSource':args[0],'rebuiltSource':args[1],'baselineSha256':hashlib.sha256(Path(args[0]).read_bytes()).hexdigest(),'rebuiltSha256':hashlib.sha256(Path(args[1]).read_bytes()).hexdigest(),'objects':len(x),'rebuiltObjects':len(y),'differences':differences,'exactAuthoredEquivalence':not differences,'scope':'Exact object hierarchy/local transforms, all mesh positions/polygons/smooth flags/material slots/UV/color arrays, curve paths and key modifier parameters; different compressed Blender serialization is allowed.'}
Path(args[2]).write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2));assert not differences
