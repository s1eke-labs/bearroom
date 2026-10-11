import bpy,sys,json,pathlib,hashlib,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
P=pathlib.Path(__file__).resolve().parent;source=sys.argv[sys.argv.index('--')+1];sha=hashlib.sha256(pathlib.Path(source).read_bytes()).hexdigest();bpy.ops.wm.open_mainfile(filepath=source);dg=bpy.context.evaluated_depsgraph_get();pc=bpy.data.objects['F09_computer'];vs=[];fs=[];names=[];targets={};outside=[]
for o in pc.children_recursive:
 if o.type!='MESH' or any(m and 'glass' in m.name.lower() for m in o.data.materials):continue
 eo=o.evaluated_get(dg);me=eo.to_mesh();me.calc_loop_triangles();v=[o.matrix_world@p.co for p in me.vertices];off=len(vs);vs+=v
 for f in me.loop_triangles:fs.append([off+i for i in f.vertices]);names.append(o.name)
 if any(o.name.startswith(n) for n in ['pc16_motherboard','pc16_cpu_pump','pc16_white_coolant','pc16_memory','pc16_gpu_heatsink','pc16_cpu_sleeved']):targets[o.name]=[(sum((v[i] for i in f.vertices),Vector())/3) for f in me.loop_triangles]
 if o.name.startswith(('pc16_base_vent','pc16_base_intake')):
  # World Y includes root offset -.13. Correct chamber front chamfer: x-(y+.13)<=4.489
  violations=[(p.x-(p.y+.13)-4.489) for p in v if p.z>.922 and p.x>4.449]
  outside.append({'name':o.name,'maxChamferProtrusionMetres':max(violations,default=0)})
 eo.to_mesh_clear()
tree=BVHTree.FromPolygons(vs,fs,all_triangles=True);report={'sourceSha256':sha,'scope':'PC-only direct-ray visibility; low-alpha glass omitted, all opaque shell and hardware respected. Not a lighting test. Rays sample triangle centroids; fraction is sampling evidence, not projected screen area.','views':{},'floorVentChamferViolations':[x for x in outside if x['maxChamferProtrusionMetres']>.001]}
for view in ['fixed','standing']:
 result={}
 for name,pts in targets.items():
  counts=collections.Counter();visible=0;n=0
  for target in pts[::max(1,len(pts)//200)]:
   origin=target+Vector((1,-1,1)).normalized()*35 if view=='fixed' else Vector((4.5,-.8,1.614));direction=(target-origin).normalized();hit=tree.ray_cast(origin,direction,40);first=names[hit[2]] if hit[2] is not None else None;counts[first]+=1;n+=1
   if first==name:visible+=1
  result[name]={'visibleSamples':visible,'samples':n,'firstHits':dict(counts.most_common(4))}
 report['views'][view]=result
(P/'visibility-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
