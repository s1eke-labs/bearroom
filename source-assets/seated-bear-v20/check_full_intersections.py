import bpy,sys,json
from pathlib import Path
from mathutils.bvhtree import BVHTree
p=Path(sys.argv[sys.argv.index('--')+1]);bpy.ops.wm.open_mainfile(filepath=str(p));vs=[];fs=[];part_for=[]
for o in bpy.data.objects['Bear_reference_plush'].children_recursive:
 if o.type!='MESH':continue
 off=len(vs);vs.extend(o.matrix_world@v.co for v in o.data.vertices)
 for q in o.data.polygons:fs.append(tuple(off+i for i in q.vertices));part_for.append(o.name)
bear=BVHTree.FromPolygons(vs,fs);hits=[];dg=bpy.context.evaluated_depsgraph_get()
for o in bpy.data.objects['F01_sofa'].children_recursive:
 if o.type not in ['MESH','CURVE']:continue
 eo=o.evaluated_get(dg);me=eo.to_mesh();tree=BVHTree.FromPolygons([eo.matrix_world@v.co for v in me.vertices],[tuple(q.vertices) for q in me.polygons]);pairs=bear.overlap(tree)
 if pairs:hits.append({'sofaObject':o.name,'pairCount':len(pairs),'bearObjects':sorted(set(part_for[a] for a,b in pairs))})
 eo.to_mesh_clear()
report={'allBearSurfacesIncludingNap':True,'allEvaluatedSofaMeshesAndSeams':True,'intersectionPairs':hits,'passed':not hits};(p.parent/'full-intersection-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report));assert not hits
