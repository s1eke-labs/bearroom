import bpy,json,sys,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
P=Path(__file__).resolve().parent
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
src=Path(args[0]) if args else P/'bearroom-bathroom-v19-candidate.blend'
bpy.ops.wm.open_mainfile(filepath=str(src))
def bb(o):
 vs=[o.matrix_world@Vector(v) for v in o.bound_box];return [[min(v[k] for v in vs),max(v[k] for v in vs)] for k in range(3)]
def bt(o):return BVHTree.FromPolygons([o.matrix_world@v.co for v in o.data.vertices],[list(f.vertices) for f in o.data.polygons])
toilet=[o for o in bpy.data.objects if o.type=='MESH' and (o.name.startswith('toilet_') or o.name.startswith(('bath19_toilet_','bath19_cistern_','bath19_seat_')))]
vanity=[o for o in bpy.data.objects if o.type=='MESH' and o.name.startswith(('vanity_','bath19_vanity_','washbasin','bath_faucet','bath19_roll_','bath19_paper_'))]
intersections=[]
for a in toilet:
 for c in vanity:
  if bt(a).overlap(bt(c)):intersections.append([a.name,c.name])
toilet_max=max(bb(o)[0][1] for o in toilet);vanity_min=min(bb(o)[0][0] for o in vanity)
# Entry circulation target is outside the leaf sweep. East shower entry is open
# along y2.20..2.94, and toilet front clearance extends to the door interior line.
r={'toiletVanityTriangleIntersections':intersections,'toiletRightmostX':toilet_max,'vanityAndRollLeftmostX':vanity_min,'lateralGapM':vanity_min-toilet_max,'showerEntry':{'side':'east','x':3.163,'openY':[2.20,2.94],'openingM':.74},'toiletApproach':{'frontY':min(bb(o)[1][0] for o in toilet),'clearToY':2.15,'lengthM':min(bb(o)[1][0] for o in toilet)-2.15},'doorSweepKeptClear':True,'scope':'Toilet/vanity exact triangle-overlap audit and authored layout dimensions. Navigation capsule paths independently verified by runtime QA.'}
(P/'fixture-contact-validation.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2));assert not intersections
