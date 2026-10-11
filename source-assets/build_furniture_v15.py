"""Reproducibly build the v15 close-up furniture source from frozen v13."""
import bpy,sys,os,json,hashlib
from pathlib import Path
P=Path(__file__).resolve().parent;sys.path.insert(0,str(P))
from refine_furniture_v15 import apply_furniture_v15
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
src=P/'bearroom-reference-v13.blend';dst=Path(args[0]).resolve() if args else P/'bearroom-furniture-v15.blend'
assert hashlib.sha256(src.read_bytes()).hexdigest()=='6ccd7fb444fb3016e0301931e34127ac56f0fa9c112747db03647eedd2ebcf1f','Wrong frozen v13 baseline'
bpy.ops.wm.open_mainfile(filepath=str(src))
protected={o.name:tuple(x for row in o.matrix_local for x in row) for o in bpy.data.objects if (o.type=='EMPTY' and (o.name.startswith(('F','anim_','Bear_')))) or o.name.startswith('piano_key_')}
def geom(o):
 if o.type=='MESH':return hashlib.sha256(b''.join(__import__('struct').pack('3f',*v.co) for v in o.data.vertices)).hexdigest()
 return None
immutable={o.name:geom(o) for o in bpy.data.objects if o.type=='MESH' and (o.name.startswith(('anim_sofa_edge','anim_bed_edge','anim_dining_edge','piano_key_','Bear_')) or o.parent and o.parent.name in ['F01_sofa','Bear_reference_plush','Bear_desk_plush'])}
r=apply_furniture_v15()
assert all(o in bpy.data.objects and tuple(x for row in bpy.data.objects[o].matrix_local for x in row)==v for o,v in protected.items()),'Protected root/pivot moved'
assert all(o in bpy.data.objects and geom(bpy.data.objects[o])==v for o,v in immutable.items()),'Protected soft goods/toy/key geometry changed'
r.update({'protectedTransformsUnchanged':len(protected),'immutableGeometryUnchanged':len(immutable),'furnitureRoots':len([o for o in bpy.data.objects if o.type=='EMPTY' and o.name.startswith('F')]),'pianoKeys':len([o for o in bpy.data.objects if o.name.startswith('piano_key_')]),'newImages':0,'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'source':str(src),'output':str(dst)})
bpy.ops.wm.save_as_mainfile(filepath=str(dst),compress=True)
r['outputSha256']=hashlib.sha256(dst.read_bytes()).hexdigest();(P/'furniture-v15-review').mkdir(exist_ok=True);(P/'furniture-v15-review/build-report.json').write_text(json.dumps(r,indent=2));print('V15_BUILT',str(dst),r['outputSha256'],len(r['created']),len(r['replaced']))
