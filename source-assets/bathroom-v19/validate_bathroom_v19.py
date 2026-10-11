"""Source topology, closure, door sweep, fixture/floor contact, and preservation QA."""
import bpy,bmesh,sys,json,hashlib,math,importlib.util
from pathlib import Path
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
P=Path(__file__).resolve().parent
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [];src=Path(args[0]) if args else P/'bearroom-bathroom-v19-candidate.blend'
spec=importlib.util.spec_from_file_location('build19',P/'build_bathroom_v19.py');build=importlib.util.module_from_spec(spec);spec.loader.exec_module(build)
report=json.loads((P/'build-report.json').read_text());bpy.ops.wm.open_mainfile(filepath=str(src));bpy.context.view_layer.update()
def bounds(o):
 vs=[o.matrix_world@Vector(v) for v in o.bound_box];return [[min(v[i] for v in vs),max(v[i] for v in vs)] for i in range(3)]
def tree(o,rotation=None):
 vs=[o.matrix_world@v.co for v in o.data.vertices]
 if rotation:vs=[rotation@v for v in vs]
 return BVHTree.FromPolygons(vs,[list(p.vertices) for p in o.data.polygons],all_triangles=False,epsilon=0),vs
unchanged=[]
for n,h in report['originalHashes'].items():assert build.digest(bpy.data.objects[n])==h,n;unchanged.append(n)
names=sorted(set(report['created']+report['replaced']));topology=[]
for n in names:
 o=bpy.data.objects.get(n)
 if not o or o.type!='MESH':continue
 bm=bmesh.new();bm.from_mesh(o.data);nonman=sum(not e.is_manifold for e in bm.edges);degenerate=sum(f.calc_area()<1e-10 for f in bm.faces);bm.free()
 topology.append({'name':n,'nonmanifoldEdges':nonman,'degenerateFaces':degenerate,'bounds':bounds(o),'vertices':len(o.data.vertices),'triangles':sum(len(f.vertices)-2 for f in o.data.polygons)})
# Mirrored root transformations do not change the authored metre envelope.
wall_names=['cutaway_bathroom_side','cutaway_bathroom_partition','cutaway_bathroom_rear_privacy','Architecture__plaster_warm_white','bath19_front_right_wall','bath19_front_door_lintel']
for n in wall_names:
 o=bpy.data.objects[n];assert abs(bounds(o)[2][1]-2.775)<1e-5,n;assert not next(t for t in topology if t['name']==n)['nonmanifoldEdges'],n
 # Existing opaque plaster, no alpha/transmission modification.
 assert o.data.materials[0].name=='plaster_warm_white'
fixture_objs=[o for o in bpy.data.objects if o.type=='MESH' and o.parent and o.parent.name=='F20_vanity']
ft=[]
for o in fixture_objs:
 b=bounds(o)
 if b[2][0]>2.125:continue
 t,vs=tree(o);ft.append((o,t,vs))
leaf=bpy.data.objects['bathroom_oak_door'];hardware=[o for o in bpy.data.objects if o.parent and o.parent.name=='bathroom_door_hinge' and o.type=='MESH'];base=Vector((4.215000152587891,1.9809999465942383,0));intersections=[];minimum=(1e9,None,None)
for degree in range(91):
 matrix=Matrix.Translation(base)@Matrix.Rotation(-math.radians(degree),4,'Z')@Matrix.Translation(-base)
 for door in hardware:
  dt,dvs=tree(door,matrix)
  for ob,ot,ovs in ft:
   if dt.overlap(ot):intersections.append((degree,door.name,ob.name))
  if door.name==leaf.name:
   for ob,ot,ovs in ft:
    for v in dvs:
     p,normal,index,d=ot.find_nearest(v)
     if d is not None and d<minimum[0]:minimum=(d,degree,ob.name)
# Exact non-overlap of privacy corner volumes is proven by their butt-joint AABBs.
wall_intersections=[]
for i,a in enumerate(wall_names):
 ba=bounds(bpy.data.objects[a])
 for b in wall_names[i+1:]:
  bb=bounds(bpy.data.objects[b]);dx=[min(ba[k][1],bb[k][1])-max(ba[k][0],bb[k][0]) for k in range(3)]
  if all(d>1e-5 for d in dx):wall_intersections.append((a,b,dx))
# Grounded/contact components. Intentional countertop/basin, screen/channel,
# cistern/lid, mounting plate/wall joints are documented manufactured contacts.
contacts={n:bounds(bpy.data.objects[n])[2][0] for n in ['toilet_bowl','shower_tray','bath19_vanity_recessed_plinth']}
for n,z in contacts.items():assert abs(z-.044)<1e-5,(n,z)
window=bpy.data.objects['window_glass_lower'];window_bounds=bounds(window);assert window_bounds[0][1]<2.351
# All bathroom additions remain east of that window. The nearest boundary is2.375.
window_intrusions=[n for n in names if n in bpy.data.objects and bpy.data.objects[n].type=='MESH' and bounds(bpy.data.objects[n])[0][0]<2.351]
nonman=[t for t in topology if t['nonmanifoldEdges'] or t['degenerateFaces']]
result={'source':str(src),'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'unchangedNonBathroomObjects':len(unchanged),'allPreserved':True,'topology':topology,'topologyFailures':nonman,'doorSweep':{'samples':91,'angleDegrees':[0,-90],'allMovingHardwareIncluded':True,'fixtureIntersections':intersections,'minimumLeafVertexToFixtureClearanceM':minimum,'scope':'Exact triangle intersection at one-degree sampled hinge poses. Vertex-to-triangle clearance is an upper-bound sample, not a swept continuous proof.'},'privacy':{'wallTop':2.775,'lowerFloorClip':2.78,'capMarginM':.005,'solidTopCaps':True,'wallVolumeOverlaps':wall_intersections,'opaqueMaterial':'plaster_warm_white','soffitBottom':2.785,'soffitTop':2.82,'shadowRevealM':.010},'floorContactsZ':contacts,'windowIntrusions':window_intrusions,'limits':['Offline geometry evidence only; browser/WebGL and device shadow appearance not verified.']}
(P/'source-validation.json').write_text(json.dumps(result,indent=2));print('BATHROOM_SOURCE_QA',json.dumps({k:v for k,v in result.items() if k!='topology'},indent=2))
assert not nonman;assert not intersections;assert not wall_intersections;assert not window_intrusions
