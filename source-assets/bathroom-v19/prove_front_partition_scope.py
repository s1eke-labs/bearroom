import bpy,bmesh,json,hashlib,importlib.util
from pathlib import Path
P=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('build19',P/'build_bathroom_v19.py');b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
bpy.ops.wm.open_mainfile(filepath=str(b.SOURCE));o=bpy.data.objects['Architecture__plaster_warm_white'];coords=[o.matrix_world@v.co for v in o.data.vertices]
bounds=[[min(v[k] for v in coords),max(v[k] for v in coords)] for k in range(3)]
inside=all(2.41999<=v.x<=4.92001 and 1.93699<=v.y<=2.05701 and -.00001<=v.z<=2.82001 for v in coords)
bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.remove_doubles(bm,verts=bm.verts,dist=1e-5);remaining=set(bm.verts);parts=[]
while remaining:
 todo=[next(iter(remaining))];part=set()
 while todo:
  v=todo.pop()
  if v in part:continue
  part.add(v);todo.extend(e.other_vert(v) for e in v.link_edges if e.other_vert(v) not in part)
 remaining-=part;vs=[o.matrix_world@v.co for v in part];parts.append({'verticesAfterWeld':len(vs),'bounds':[[min(v[k] for v in vs),max(v[k] for v in vs)] for k in range(3)]})
bm.free()
r={'sourceSha256':b.SOURCE_SHA,'node':'Architecture__plaster_warm_white','originalVertices':len(coords),'originalFaces':len(o.data.polygons),'allVerticesInsideBathroomFrontPartition':inside,'bounds':bounds,'weldedComponents':parts,'nonBathroomSubsetCount':0,'scope':'This node contains only the bathroom front-wall/lintel assembly. It is not a scene-wide mixed plaster mesh. All other Architecture nodes are bitwise preserved by the primary build assertions.'}
(P/'front-partition-scope-proof.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2));assert inside
