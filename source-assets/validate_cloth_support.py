import bpy,os,json
from mathutils import Vector
from mathutils.bvhtree import BVHTree
P=os.path.dirname(os.path.abspath(__file__));bpy.ops.wm.open_mainfile(filepath=P+'/bearroom-realism.blend');results={}
for cloth,root,amp in [('anim_sofa_edge','F01_sofa',.0035),('anim_bed_edge','F15_bed',.004)]:
 o=bpy.data.objects[cloth];r=bpy.data.objects[root];vs=[];fs=[]
 supports=[x for x in r.children_recursive if x.type=='MESH' and x.name!=cloth and (x.name in ['F01_sofa__fabric_sofa_boucle_part_000','F01_sofa__fabric_sofa_boucle_part_001','F01_sofa__fabric_sofa_boucle_part_002','F01_sofa__fabric_sofa_boucle_part_003'] if root=='F01_sofa' else x.name in ['duvet_main','bed_mattress'])]
 for s in supports:
  ix=len(vs);vs.extend(s.matrix_world@v.co for v in s.data.vertices);fs.extend(tuple(ix+i for i in p.vertices) for p in s.data.polygons)
 tree=BVHTree.FromPolygons(vs,fs);lo=min(v.co.y for v in o.data.vertices);hi=max(v.co.y for v in o.data.vertices);a=lo+(hi-lo)*.25;ph=[]
 for phase in [-1,0,1]:
  values=[];bad=[]
  for v in o.data.vertices:
   c=max(0,min(1,(a-v.co.y)/max(a-lo,1e-9)));wgt=c*c*(3-2*c);co=v.co.copy();co.z+=phase*amp*wgt;w=o.matrix_world@co;hit,n,idx,d=tree.ray_cast(Vector((w.x,w.y,8)),Vector((0,0,-1)),10)
   if hit is None:continue
   # The back/arm may validly occlude a blanket behind it; query seat top/base only.
   delta=w.z-hit.z
   values.append(delta)
   if delta<-.001:bad.append({'vertex':v.index,'clearance':delta,'world':list(w),'surface':list(hit)})
  ph.append({'phase':phase,'minClearance':min(values) if values else None,'negativeCount':len(bad),'worst':sorted(bad,key=lambda x:x['clearance'])[:12]})
 results[cloth]=ph
open(P+'/furniture-realism-review/cloth-support-audit.json','w').write(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
