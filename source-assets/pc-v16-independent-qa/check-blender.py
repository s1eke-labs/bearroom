import bpy,sys,json,pathlib,hashlib,math
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
P=pathlib.Path(__file__).resolve().parent
source=sys.argv[sys.argv.index('--')+1];source_hash=hashlib.sha256(pathlib.Path(source).read_bytes()).hexdigest();bpy.ops.wm.open_mainfile(filepath=source);s=bpy.context.scene;pc=bpy.data.objects['F09_computer'];dg=bpy.context.evaluated_depsgraph_get();objs=[];cache={}
def evaluate(o):
 eo=o.evaluated_get(dg);me=eo.to_mesh();v=[o.matrix_world@p.co for p in me.vertices];f=[list(p.vertices) for p in me.polygons];eo.to_mesh_clear();return v,f
for o in pc.children_recursive:
 if o.type!='MESH':continue
 v,f=evaluate(o);low=Vector([min(p[i] for p in v) for i in range(3)]);high=Vector([max(p[i] for p in v) for i in range(3)]);cache[o.name]=(v,f,low,high);objs.append(o)
def bbox_overlap(a,b,eps=1e-7):return all(a[2][i]<=b[3][i]+eps and a[3][i]>=b[2][i]-eps for i in range(3))
rotors=[o for o in pc.children_recursive if o.get('pcSpinAxis')]
collisions=[]
statictrees={o.name:BVHTree.FromPolygons(cache[o.name][0],cache[o.name][1]) for o in objs}
for rotor in rotors:
 for blade in [o for o in rotor.children_recursive if 'blades' in o.name]:
  source_a=cache[blade.name];center=rotor.matrix_world.translation;axis={'x':'X','y':'Z','z':'Y'}[rotor['pcSpinAxis']];hits=[]
  for phase in range(24):
   rotation=Matrix.Rotation(phase*math.pi/12,4,axis);vs=[center+rotation.to_3x3()@(v-center) for v in source_a[0]];low=Vector([min(p[i] for p in vs) for i in range(3)]);high=Vector([max(p[i] for p in vs) for i in range(3)]);a=(vs,source_a[1],low,high);at=BVHTree.FromPolygons(vs,a[1])
   for o in objs:
    if o.parent==rotor or o==blade:continue
    b=cache[o.name]
    if bbox_overlap(a,b):
     overlaps=at.overlap(statictrees[o.name])
     if overlaps:hits.append({'object':o.name,'phaseDegrees':phase*15,'intersectingTriangles':len(overlaps)})
  collisions.append({'rotor':rotor.name,'blade':blade.name,'hits':hits})
# Contact of every rubber foot with authored desk; actual desk surface BVH.
desk=bpy.data.objects['F08_computer_desk'] if 'F08_computer_desk' in bpy.data.objects else next(o for o in s.objects if o.name.startswith('F08_'))
deskvs=[];deskfs=[]
for o in desk.children_recursive:
 if o.type=='MESH':
  v,f=evaluate(o);off=len(deskvs);deskvs+=v;deskfs += [[i+off for i in face] for face in f]
dtree=BVHTree.FromPolygons(deskvs,deskfs);feet=[]
for o in objs:
 if not o.name.startswith('pc16_rubber_foot'):continue
 a=cache[o.name];p=(a[2]+a[3])/2;p.z=a[2].z+.00001;hit=dtree.ray_cast(p,Vector((0,0,-1)),.1);feet.append({'foot':o.name,'bottom':a[2].z,'supportZ':float(hit[0].z) if hit[0] else None,'gap':float(p.z-hit[0].z) if hit[0] else None})
report={'source':source,'sourceSha256':source_hash,'rotorCount':len(rotors),'rotorBladeStaticIntersections24Phases':collisions,'footSupport':feet,'scope':'Evaluated Blender mesh/BVH checks; 24 rotation phases per fan versus authored static parts, no render certification.'};(P/'blender-geometry-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
