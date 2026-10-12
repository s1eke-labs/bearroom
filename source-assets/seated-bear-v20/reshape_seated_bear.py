"""Conservative seated pose from the editable v19 master (Blender 4.3.2).
Only Bear_reference_plush descendant poses change. Protected head and face
meshes keep original vertices and use a common rigid object transform. Topology,
vertex order, UVs, vertex colors, materials, source metadata,
and every unrelated object remain unchanged. Skin nap follows each bound part.
Usage: blender -b -t 6 --python reshape_seated_bear.py -- source.blend output_dir
"""
import bpy, sys, json, math, hashlib, struct
from pathlib import Path
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
args=sys.argv[sys.argv.index('--')+1:];src=Path(args[0]);out=Path(args[1]);out.mkdir(parents=True,exist_ok=True)
source_hash=hashlib.sha256(src.read_bytes()).hexdigest()
bpy.ops.wm.open_mainfile(filepath=str(src));root=bpy.data.objects['Bear_reference_plush'];body=bpy.data.objects['Bear_reference_plush__fabric_bear'];nap=bpy.data.objects['bear_minky_surface_nap'];children=list(root.children_recursive);names={o.name for o in children};bpy.context.view_layer.update()
def mesh_hash(o,coordinates=True):
 h=hashlib.sha256()
 if o.type=='MESH':
  if coordinates:
   for v in o.data.vertices:h.update(struct.pack('<3f',*v.co))
  for p in o.data.polygons:h.update(struct.pack('<'+'I'*len(p.vertices),*p.vertices));h.update(struct.pack('<?I',p.use_smooth,p.material_index))
  for uv in o.data.uv_layers:
   h.update(uv.name.encode())
   for d in uv.data:h.update(struct.pack('<2f',*d.uv))
  for ca in o.data.color_attributes:
   h.update((ca.name+ca.domain+ca.data_type).encode())
   for d in ca.data:h.update(struct.pack('<4f',*d.color))
  h.update('|'.join(m.name if m else '' for m in o.data.materials).encode())
 return h.hexdigest()
def identity(o,coords=True):
 return {'matrix':list(map(list,o.matrix_world)),'data':mesh_hash(o,coords),'custom':repr(sorted(o.items())),'parent':o.parent.name if o.parent else None,'dataName':o.data.name if o.data else None,'type':o.type}
old_identity={o.name:identity(o) for o in bpy.data.objects};old_invariants={o.name:identity(o,False) for o in children};old={o.name:[v.co.copy() for v in o.data.vertices] for o in children if o.type=='MESH'}
# Each source mesh keeps its original local matrix; canonical authoring space is
# the body mesh's space and all children are verified to share that exact pose.
M=body.matrix_world.copy();Mi=M.inverted();
assert all(max(abs(o.matrix_world[i][j]-M[i][j]) for i in range(4) for j in range(4))<1e-6 for o in children if o.type=='MESH')
scale=M.to_scale().x;pivot=Vector((0,.025,.068));lean=Matrix.Rotation(math.radians(-8),3,'X')
seat_objects=[o for o in bpy.data.objects if o.type=='MESH' and o.name.startswith('sofa_v17_seat_') and not o.name.endswith('_seam')]
vs=[];fs=[]
for o in seat_objects:
 offset=len(vs);vs.extend(o.matrix_world@v.co for v in o.data.vertices);fs.extend(tuple(offset+i for i in p.vertices) for p in o.data.polygons)
seat=BVHTree.FromPolygons(vs,fs)
def support(p, required=True):
 hit,n,i,d=seat.ray_cast(Vector((p.x,p.y,1.4)),Vector((0,0,-1)),2)
 if hit is None:
  if required:raise RuntimeError('Bear surface outside actual seat footprint '+str(tuple(p)))
  return None
 return hit.z
# Part bindings are authored once from the original surfaces before moving any
# vertices. Separate nap triangles retain their source part through articulation.
padded=[o for o in children if o.type=='MESH' and o!=nap and any(m and m.name in ['fabric_bear_sewn_plush','fabric_bear_sewn_head'] for m in o.data.materials)]
trees={}
for o in padded:trees[o.name]=BVHTree.FromPolygons(old[o.name],[tuple(p.vertices) for p in o.data.polygons])
bindings=[];bind_distances=[]
for poly in nap.data.polygons:
 ids=list(poly.vertices);base=(old[nap.name][ids[0]]+old[nap.name][ids[1]])*.5
 choices=[]
 for name,tree in trees.items():
  loc,no,ind,dist=tree.find_nearest(base);choices.append((dist,name))
 dist,name=min(choices);bindings.append((ids,name));bind_distances.append(dist*scale)
feet={n for n in old if n.startswith('bear_foot_')};centers={}
for n in feet:centers[n]=Vector(tuple((min(p[i] for p in old[n])+max(p[i] for p in old[n]))*.5 for i in range(3)))
def preliminary(name,p):
 p=p.copy()
 if name in feet:
  c=centers[name];q=p-c
  # Preserve original topology/seams and reshape the short pouch as a forward
  # soft leg. Heels overlap the original lower belly rather than detaching.
  q=Vector((q.x*1.12,q.y*1.60,q.z*.84))
  p=q+Vector((-.123 if '_L_' in name else .123,-.170,.105))
 return M@(pivot+lean@(p-pivot))
body_pre=[preliminary(body.name,p) for p in old[body.name]]
# Body supplies the primary support contact. Flatten only the lowest 6.5mm of
# stuffing against the measured seat surface, leaving a positive 0.30mm clearance.
body_initial_clearance=min(p.z-support(p) for p in body_pre)
dz=-body_initial_clearance-.0065
foot_shifts={}
for n in feet:
 pts=[preliminary(n,p)+Vector((0,0,dz)) for p in old[n]]
 foot_shifts[n]=-min(p.z-support(p) for p in pts)-.00055
compression={body.name:.0065,**{n:.00055 for n in feet}}
changed_local=[]
def deform_world(name,p):
 q=preliminary(name,p)+Vector((0,0,dz+foot_shifts.get(name,0)))
 if name in compression:q.z=max(q.z,support(q)+.00030)
 return q
def deform(name,p):return Mi@deform_world(name,p)
protected={o.name for o in children if o.type=='MESH' and (o.name=='bear_head_sewn_front_panel' or any(m and m.name.startswith('embroidery_') for m in o.data.materials))}
rigid_world=Matrix.Translation(Vector((0,0,dz)))@M@Matrix.Translation(pivot)@lean.to_4x4()@Matrix.Translation(-pivot)@Mi
for o in children:
 if o.type!='MESH' or o==nap:continue
 if o.name in protected:
  o.matrix_world=rigid_world@o.matrix_world
  continue
 for v,p in zip(o.data.vertices,old[o.name]):v.co=deform(o.name,p)
 o.data.update()
for ids,name in bindings:
 for i in ids:nap.data.vertices[i].co=deform(name,old[nap.name][i])
nap.data.update();bpy.context.view_layer.update()
# Quantitative support and non-penetration checks use actual surface vertices,
# not object bounds. Broad support is confirmed by vertices within 0.40mm.
def support_metrics(o):
 pts=[o.matrix_world@v.co for v in o.data.vertices];heights=[support(p,False) for p in pts];clear=[p.z-h if h is not None else 10.0 for p,h in zip(pts,heights)]
 near=[p for p,c in zip(pts,clear) if c<.00040]
 return {'vertices':len(pts),'verticesBeyondSeatFootprint':sum(h is None for h in heights),'minimumSeatClearanceMm':min(clear)*1000,'contactVerticesWithin0_40mm':len(near),'contactSpanMm':[1000*(max(p[i] for p in near)-min(p[i] for p in near)) if near else 0 for i in range(3)],'maxZ':max(p.z for p in pts),'minZ':min(p.z for p in pts)}
metrics={n:support_metrics(bpy.data.objects[n]) for n in [body.name,*sorted(feet)]}
assert metrics[body.name]['contactVerticesWithin0_40mm']>=300
assert metrics[body.name]['contactSpanMm'][0]>=70 and metrics[body.name]['contactSpanMm'][1]>=60
assert all(m['minimumSeatClearanceMm']>=.29 for m in metrics.values())
# All remaining bear surface vertices must be above the seat. This includes
# nap, embroidery, head, ears, tail, and hands and prevents buried strands.
all_support={n:support_metrics(bpy.data.objects[n])['minimumSeatClearanceMm'] for n in old}
assert min(all_support.values())>=-.025,(min(all_support.items(),key=lambda x:x[1]))
unrelated_changed=[n for n,r in old_identity.items() if n not in names and identity(bpy.data.objects[n])!=r]
invariant_changed=[]
for n,r in old_invariants.items():
 now=identity(bpy.data.objects[n],False)
 if n in protected:now['matrix']=r['matrix']
 if now!=r:invariant_changed.append(n)
protected_geometry_changed=[n for n in protected if mesh_hash(bpy.data.objects[n])!=old_identity[n]['data']]
assert not protected_geometry_changed,protected_geometry_changed
assert not unrelated_changed,unrelated_changed
assert not invariant_changed,invariant_changed
before={};after={}
for n in [body.name,*sorted(feet),'bear_head_sewn_front_panel']:
 pp=[M@p for p in old[n]];qq=[bpy.data.objects[n].matrix_world@v.co for v in bpy.data.objects[n].data.vertices]
 before[n]={'center':[sum(p[i] for p in pp)/len(pp) for i in range(3)],'size':[max(p[i] for p in pp)-min(p[i] for p in pp) for i in range(3)]}
 after[n]={'center':[sum(p[i] for p in qq)/len(qq) for i in range(3)],'size':[max(p[i] for p in qq)-min(p[i] for p in qq) for i in range(3)]}
# Additional furniture intersections are checked via actual surface triangle
# overlap; contact with the intended seat is excluded by positive clearance.
bear_vs=[];bear_fs=[]
for o in children:
 if o.type!='MESH' or o==nap:continue
 off=len(bear_vs);bear_vs.extend(o.matrix_world@v.co for v in o.data.vertices);bear_fs.extend(tuple(off+i for i in p.vertices) for p in o.data.polygons)
bear_tree=BVHTree.FromPolygons(bear_vs,bear_fs);collisions=[]
for o in bpy.data.objects['F01_sofa'].children_recursive:
 if o.type!='MESH':continue
 tree=BVHTree.FromPolygons([o.matrix_world@v.co for v in o.data.vertices],[tuple(p.vertices) for p in o.data.polygons])
 overlaps=bear_tree.overlap(tree)
 if overlaps:collisions.append({'object':o.name,'triangleIntersectionPairs':len(overlaps)})
assert not collisions,collisions
report={'revision':'seated-bear-v20','input':str(src),'inputSha256':source_hash,'pose':{'torsoBackwardLeanDegrees':8,'bodyVerticalSettlementMm':dz*1000,'footWorldZCorrectionsMm':{k:v*1000 for k,v in foot_shifts.items()},'footPouchScale':[1.12,1.6,.84],'primarySupport':'buttocks on actual sofa_v17_seat_2 geometry','rootTransformUnchanged':True,'protectedRigidWorldTransform':list(map(list,rigid_world)),'protectedRigidObjects':sorted(protected)},'preserved':{'allOtherObjects':len(old_identity)-len(names),'unrelatedChanges':unrelated_changed,'rootTransform':True,'unchangedChildMatricesExceptProtectedRigidParts':True,'protectedHeadEmbroideryGeometryByteIdentical':True,'meshTopologyVertexOrderUvsColorsMaterials':True,'headFaceGeometryRigidOnly':True,'sourceMetadataUnchanged':True},'support':metrics,'minimumAllBearVertexSeatClearanceMm':min(all_support.values()),'sofaTriangleIntersections':collisions,'nap':{'triangles':len(bindings),'maximumOriginalBindingDistanceMm':max(bind_distances)*1000,'meanOriginalBindingDistanceMm':sum(bind_distances)/len(bind_distances)*1000},'before':before,'after':after,'verificationLimits':['Offline geometric and Cycles review only. Browser, live shadow, GI matching, interaction and device performance are independent integration checks.']}
# Source is saved before export-only batching. No review lights or cameras have
# been introduced. Keep the original v19 file untouched beside this candidate.
master=out/'bearroom-seated-v20.blend';bpy.ops.wm.save_as_mainfile(filepath=str(master),compress=True);report['output']=str(master);report['outputSha256']=hashlib.sha256(master.read_bytes()).hexdigest();assert hashlib.sha256(src.read_bytes()).hexdigest()==source_hash
(out/'seated-pose-report.json').write_text(json.dumps(report,indent=2))
# Source-local vertex mapping also permits an exact surgical integration into an
# existing runtime without re-exporting any room or changing materials/images.
payload={'root':'Bear_reference_plush','sourceSha256':source_hash,'outputSha256':report['outputSha256'],'objects':{}}
for o in children:
 if o.type=='MESH':payload['objects'][o.name]={'matrixWorld':list(map(list,o.matrix_world)),'positions':[list(v.co) for v in o.data.vertices],'normals':[list(v.normal) for v in o.data.vertices],'vertexCount':len(o.data.vertices),'preservedTopologyUvMaterialsSha256':mesh_hash(o,False)}
(out/'bear-source-vertex-map.json').write_text(json.dumps(payload,separators=(',',':')))
print('SEATED_BEAR_COMPLETE',json.dumps(report),flush=True)
