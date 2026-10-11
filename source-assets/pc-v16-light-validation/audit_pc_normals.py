import bpy,bmesh,json,pathlib,hashlib,sys
args=sys.argv[sys.argv.index('--')+1:];p=pathlib.Path(args[0]).resolve();bpy.ops.wm.open_mainfile(filepath=str(p));rows=[]
for o in bpy.data.objects['F09_computer'].children_recursive:
 if o.type!='MESH':continue
 bm=bmesh.new();bm.from_mesh(o.data);bm.normal_update();volume=bm.calc_volume(signed=True);boundary=sum(e.is_boundary for e in bm.edges);nonmanifold=sum(not e.is_manifold for e in bm.edges)
 if not boundary or any(x in o.name for x in ['hose','armour','gpu_top','gpu_lower']):rows.append({'name':o.name,'volume':volume,'boundaryEdges':boundary,'nonmanifoldEdges':nonmanifold})
 bm.free()
issues=[o for o in rows if o['boundaryEdges']==0 and o['volume']< -1e-12]
r={'sourceSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'closedComponentsChecked':len(rows),'inwardWoundClosedComponents':issues,'passed':not issues,'objects':rows};pathlib.Path(args[1]).write_text(json.dumps(r,indent=2));print('PC_NORMALS',json.dumps({k:v for k,v in r.items() if k!='objects'}))

if issues:raise RuntimeError("Inward PC component normals")
