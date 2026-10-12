"""Independent solid-volume support-polygon sanity check; no source mutation."""
import bpy,json,sys,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
p=Path(sys.argv[sys.argv.index('--')+1]);bpy.ops.wm.open_mainfile(filepath=str(p));root=bpy.data.objects['Bear_reference_plush'];vs=[];fs=[]
for o in bpy.data.objects:
 if o.type=='MESH' and o.name.startswith('sofa_v17_seat_'):
  k=len(vs);vs.extend(o.matrix_world@v.co for v in o.data.vertices);fs.extend(tuple(k+i for i in q.vertices) for q in o.data.polygons)
seat=BVHTree.FromPolygons(vs,fs)
support_points=[];volumes=[]
for o in root.children_recursive:
 if o.type!='MESH' or not any(m and m.name in ['fabric_bear_sewn_plush','fabric_bear_sewn_head'] for m in o.data.materials):continue
 o.data.calc_loop_triangles();points=[o.matrix_world@v.co for v in o.data.vertices];ref=sum(points,Vector())/len(points);volume=0;moment=Vector()
 for tri in o.data.loop_triangles:
  a,b,c=[points[i]-ref for i in tri.vertices];vol=a.dot(b.cross(c))/6;volume+=vol;moment+=(a+b+c)*(vol/4)
 center=ref+moment/volume;volumes.append((o.name,abs(volume),center))
 for a in points:
  hit,*_=seat.ray_cast(Vector((a.x,a.y,1.4)),Vector((0,0,-1)),2)
  if hit is not None and a.z-hit.z<=.00040:support_points.append((a.x,a.y))
def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
pts=sorted(set(support_points));lo=[];hi=[]
for a in pts:
 while len(lo)>=2 and cross(lo[-2],lo[-1],a)<=0:lo.pop()
 lo.append(a)
for a in reversed(pts):
 while len(hi)>=2 and cross(hi[-2],hi[-1],a)<=0:hi.pop()
 hi.append(a)
hull=lo[:-1]+hi[:-1];total=sum(v for n,v,c in volumes);center=sum((c*v for n,v,c in volumes),Vector())/total
margins=[]
for a,b in zip(hull,hull[1:]+hull[:1]):margins.append(cross(a,b,center)/math.hypot(b[0]-a[0],b[1]-a[1]))
report={'assumption':'Uniform relative stuffing density for closed padded meshes; sanity check, not physical simulation.','solidVolumeM3':total,'estimatedCenterOfMass':list(center),'supportPolygonXY':hull,'projectedCenterInsideSupportPolygon':min(margins)>=0,'minimumEdgeMarginMm':min(margins)*1000,'paddedPartVolumes':[{'part':n,'volumeM3':v,'center':list(c)} for n,v,c in volumes]}
(p.parent/'support-balance-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report));assert min(margins)>=0
