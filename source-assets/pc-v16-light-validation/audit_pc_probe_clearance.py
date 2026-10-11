"""Audit stored final sampling positions against final source and PC envelope."""
import bpy,sys,pathlib,json,hashlib,math,importlib.util
from mathutils import Vector
from mathutils.bvhtree import BVHTree
args=sys.argv[sys.argv.index('--')+1:];src,gi_path,script,out=map(lambda x:pathlib.Path(x).resolve(),args)
g=json.loads(gi_path.read_text());p=json.loads(gi_path.with_name('probe-placement-audit.json').read_text());spec=importlib.util.spec_from_file_location('bake',script);bake=importlib.util.module_from_spec(spec);spec.loader.exec_module(bake)
bpy.ops.wm.open_mainfile(filepath=str(src));issues=[];root=bpy.data.objects['F09_computer'];pcparts=[o for o in root.children_recursive if o.type=='MESH'];points=[o.matrix_world@Vector(v) for o in pcparts for v in o.bound_box];lo=Vector(tuple(min(p[i] for p in points) for i in range(3)));hi=Vector(tuple(max(p[i] for p in points) for i in range(3)))
scene,sources,excluded,emissions=bake.prepare_scene(g,1);boxes=bake.enclosed_probe_keepouts(sources);cabowners={name for b in boxes for name in b['objects']};verts=[];faces=[];owners=[];dg=bpy.context.evaluated_depsgraph_get()
for obj in sources:
 ob=obj.evaluated_get(dg);me=ob.to_mesh();base=len(verts);verts.extend(obj.matrix_world@v.co for v in me.vertices);faces.extend(tuple(base+i for i in f.vertices) for f in me.polygons);owners.extend([obj.name]*len(me.polygons));ob.to_mesh_clear()
tree=BVHTree.FromPolygons(verts,faces,all_triangles=False)
def inside(q,lo,hi):return all(lo[i]-.014<q[i]<hi[i]+.014 for i in range(3))
interiors=[];invalid=[];closest=[]
for probe in p['samples']:
 q=bake.bvec(probe['sample']);loc,n,idx,d=tree.find_nearest(q);blocked=[b['name'] for b in boxes if inside(q,b['lo'],b['hi'])];outward=(q-loc).dot(n)>=.014 or owners[idx] in cabowners;clear=not blocked and d>=.014 and (d>.45 or outward)
 if not clear:invalid.append({'index':probe['index'],'sample':probe['sample'],'nearest':owners[idx],'distance':d,'enclosures':blocked})
 if inside(q,lo,hi):interiors.append(probe)
 closest.append({'index':probe['index'],'distanceMetres':float(d),'nearest':owners[idx]})
if invalid:issues.append('Stored probe sample fails final geometry clearance')
if interiors:issues.append('Stored probe inside PC case envelope')
def pcAnimated(o):
 while o:
  if o.name.startswith('anim_pc') or (o.get('pcCaseV16',False) and o.get('pcSpinAxis') in ('x','y','z')):return True
  o=o.parent
 return False
fans=[o.name for o in root.children_recursive if o.type=='MESH' and pcAnimated(o)]
if not all(o in excluded for o in fans):issues.append('Moving PC fan rotor not excluded')
pcglass=[o.name for o in pcparts if any(m and 'glass' in m.name.lower() for m in o.data.materials)]
if not all(o in excluded for o in pcglass):issues.append('PC glass not treated consistently with diffuse bake approximation')
stationary=[o.name for o in pcparts if o.name not in fans and o.name not in pcglass]
sourceNames={o.name for o in sources}
if not all(o in sourceNames for o in stationary):issues.append('Stationary PC opaque geometry omitted from bake')
if g['sourceSha256']!=hashlib.sha256(src.read_bytes()).hexdigest():issues.append('Source hash mismatch')
report={'passed':not issues,'sourceSha256':g['sourceSha256'],'probesChecked':len(p['samples']),'invalidSamples':invalid,'samplesInsidePCEnvelope':interiors,'pcBoundsBlender':[list(lo),list(hi)],
'pcCaseSpecificKeepoutNeeded':bool(interiors),'cabinetKeepouts':len(boxes),'pcFanMeshesExcluded':fans,'pcGlassMeshesExcluded':pcglass,'stationaryPCMeshesRetained':stationary,'pcDisabledEmissiveMaterials':[x for x in emissions if x.startswith('pc16_')],
'emissiveTransport':'All visible PC emission disabled in bake; RGB animation is luminous surface detail only, with no animated bounced light or added ambient gain. Changed case reflectance participates under unchanged room lights.',
'nearestSurfaces':closest,'issues':issues}
out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in {'nearestSurfaces','pcFanMeshesExcluded','stationaryPCMeshesRetained'}},indent=2))
if issues:raise RuntimeError('Final PC probe audit failed')
