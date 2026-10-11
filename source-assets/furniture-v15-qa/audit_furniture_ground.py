"""Read-only authored floor/rug contact rays for construction support components."""
import bpy,sys,json,hashlib
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
args=sys.argv[sys.argv.index('--')+1:];source=Path(args[0]).resolve();out=Path(args[1]).resolve();bpy.ops.wm.open_mainfile(filepath=str(source));bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get();meshes={};ground={}
for o in bpy.data.objects:
 if o.type not in ['MESH','CURVE']:continue
 p=o;isf=False
 while p:
  if 'furnitureId' in p or p.name.startswith('Bear_'):isf=True;break
  p=p.parent
 pick=any(x in o.name for x in ['chair_castor','chair_v15_caster_outer','desk_pedestal','coffee_leg','table_splayed_leg','dining_leg','leveling_glide','leveling_foot','credenza_leg','kitchen_plinth','return_plinth']) or o.name in ['nightstand','nightstand.001','F18_wardrobe__wood_oak_part_002']
 if isf and not pick:continue
 if not isf and any(x in o.name.lower() for x in ['wall','window','street','exterior','plant','bear']):continue
 ev=o.evaluated_get(dg);me=ev.to_mesh();me.calc_loop_triangles();vs=[o.matrix_world@v.co for v in me.vertices];tri=[tuple(t.vertices) for t in me.loop_triangles];ev.to_mesh_clear()
 if pick:meshes[o.name]=(vs,tri)
 if not isf:ground[o.name]=(vs,tri)
v=[];f=[];owners=[]
for n,(vs,ts) in ground.items():
 off=len(v);v.extend(vs);f.extend(tuple(x+off for x in t) for t in ts);owners.extend([n]*len(ts))
bvh=BVHTree.FromPolygons(v,f,all_triangles=True);result=[]
for n,(vs,ts) in meshes.items():
 bottom=min(p.z for p in vs);pts=[p for p in vs if p.z<bottom+.0001];c=sum(pts,Vector())/len(pts);samples=[c]+pts[:16];hits=[]
 for p in samples:
  hit,normal,index,d=bvh.ray_cast(p+Vector((0,0,.12)),Vector((0,0,-1)),.5)
  if hit is not None:hits.append({'clearanceM':p.z-hit.z,'support':owners[index],'worldXY':[p.x,p.y],'surfaceZ':hit.z})
 result.append({'name':n,'bottomZ':bottom,'sampleCount':len(samples),'hits':hits,'minimumClearanceM':min((x['clearanceM'] for x in hits),default=None),'maximumClearanceM':max((x['clearanceM'] for x in hits),default=None)})
r={'source':str(source),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'scope':'Vertical source-space bottom-sample rays against authored non-furniture floor/rug/architecture, excludes internal assembly supports and dynamic movement. Negative is penetration; positive is gap.','contacts':result};out.write_text(json.dumps(r,indent=2))
for x in result:print(x['name'],x['minimumClearanceM'],x['maximumClearanceM'],x['hits'][0]['support'] if x['hits'] else None)
