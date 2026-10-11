import bpy,math,json
from pathlib import Path
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
P=Path(__file__).resolve().parent.parent;bpy.ops.wm.open_mainfile(filepath=str(P/'bearroom-organic-v17.blend'));pivot=bpy.data.objects['anim_rocker'];root=bpy.data.objects['F16_reading_rocker'];print('PIVOT',dict(pivot.items()),list(map(list,pivot.matrix_local)),list(map(list,root.matrix_local)),flush=True)
vs=[];fs=[];names=[]
for o in bpy.data.objects:
 if o.type!='MESH':continue
 r=o
 while r.parent:r=r.parent
 if r.name=='F16_reading_rocker':continue
 off=len(vs);vs.extend(o.matrix_world@v.co for v in o.data.vertices);fs.extend(tuple(off+i for i in f.vertices) for f in o.data.polygons);names.extend([o.name]*len(o.data.polygons))
tree=BVHTree.FromPolygons(vs,fs)
# glTF conversion at the root maps Blender(x,y,z) to Three(x,z,-y).
runtime_axis=pivot.get('animationAxis','z');axis={'x':'X','y':'Z','z':'Y'}[runtime_axis];sign=-1 if runtime_axis=='z' else 1
base=pivot.matrix_world.copy();points=[]
for o in pivot.children_recursive:
 if o.name.startswith('rocker_curved_runner'):
  points.extend(base.inverted_safe()@o.matrix_world@v.co for v in o.data.vertices)
result=[]
for deg in [i*.05 for i in range(-30,31)]:
 trans=base@Matrix.Rotation(math.radians(deg)*sign,4,axis);delta=[]
 for p in points:
  q=trans@p;hit,n,idx,d=tree.ray_cast(Vector((q.x,q.y,3.50)),Vector((0,0,-1)),.7)
  if hit and 3.0<hit.z<3.2:delta.append((q.z-hit.z,tuple(q),tuple(hit),names[idx]))
 result.append({'degrees':deg,'minimumClearance':min(delta)[0],'point':min(delta)[1],'supportPoint':min(delta)[2],'support':min(delta)[3]})
report={'source':'bearroom-organic-v17.blend','runtimeAxis':runtime_axis,'blenderAxis':axis,'sign':sign,'rest':result[30],'minimumAcrossCycle':min(result,key=lambda a:a['minimumClearance']),'maximumOfLowestContactAcrossCycle':max(result,key=lambda a:a['minimumClearance']),'allPhases':result,'rootMatrix':list(map(list,root.matrix_world)),'pivotMatrix':list(map(list,pivot.matrix_world))}
(P/'soft-v17-work/rocker-ground-cycle.json').write_text(json.dumps(report,indent=2));print(json.dumps({k:v for k,v in report.items() if k!='allPhases'},indent=2),flush=True)
