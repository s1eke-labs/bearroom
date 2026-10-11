"""Independent read-only Blender snapshots. Writes reports, never models."""
import bpy,bmesh,numpy as np,json,hashlib,sys,math
from pathlib import Path
src,out=map(Path,sys.argv[sys.argv.index('--')+1:]);bpy.ops.wm.open_mainfile(filepath=str(src));dg=bpy.context.evaluated_depsgraph_get()
def hbytes(a):return hashlib.sha256(a).hexdigest()
def arr(seq,attr,n,typ=np.float32):
 a=np.empty(len(seq)*n,dtype=typ);seq.foreach_get(attr,a);return a
materials={}
for m in bpy.data.materials:
 ns=[];links=[]
 if m.use_nodes:
  for n in m.node_tree.nodes:
   inputs={}
   for i in n.inputs:
    if hasattr(i,'default_value'):
     try:inputs[i.name]=list(i.default_value)
     except:inputs[i.name]=i.default_value
   d={'name':n.name,'type':n.type,'inputs':inputs}
   if n.type=='TEX_IMAGE':
    im=n.image;d['image']={'name':im.name,'size':list(im.size),'space':im.colorspace_settings.name,'sha256':hbytes(im.packed_file.data) if im.packed_file else None} if im else None
   ns.append(d)
  links=sorted((l.from_node.name,l.from_socket.name,l.to_node.name,l.to_socket.name) for l in m.node_tree.links)
 payload={'nodes':ns,'links':links,'backfaceCulling':m.use_backface_culling,'alphaThreshold':m.alpha_threshold,'surfaceMethod':m.surface_render_method}
 materials[m.name]={'sha256':hbytes(json.dumps(payload,sort_keys=True).encode()),**payload} if m.name.startswith(('fabric_v17','botanical_v17')) else {'sha256':hbytes(json.dumps(payload,sort_keys=True).encode())}
objects={}
for o in bpy.data.objects:
 r=o
 while r.parent:r=r.parent
 d={'type':o.type,'root':r.name,'parent':o.parent.name if o.parent else None,'matrix':list(map(list,o.matrix_local)),'worldMatrix':list(map(list,o.matrix_world))}
 if o.type in ['MESH','CURVE']:
  eo=o.evaluated_get(dg);me=eo.to_mesh();vs=arr(me.vertices,'co',3);loops=arr(me.loops,'vertex_index',1,np.int32);pn=arr(me.polygons,'normal',3)
  d.update({'vertices':len(me.vertices),'polygons':len(me.polygons),'triangles':sum(len(f.vertices)-2 for f in me.polygons),'vertexHash':hbytes(vs.tobytes()),'loopHash':hbytes(loops.tobytes()),'normalHash':hbytes(pn.tobytes()),'materials':[m.name if m else None for m in me.materials],'uvHashes':{u.name:hbytes(arr(u.data,'uv',2).tobytes()) for u in me.uv_layers}})
  points=[o.matrix_world@v.co for v in me.vertices]
  if points:d['worldBounds']=[[min(v[i] for v in points) for i in range(3)],[max(v[i] for v in points) for i in range(3)]]
  if '_v17_' in o.name or o.name.startswith('botanical_v17'):
   bm=bmesh.new();bm.from_mesh(me)
   d['meshQuality']={'looseVerts':sum(not v.link_faces for v in bm.verts),'boundaryEdges':sum(e.is_boundary for e in bm.edges),'nonManifoldEdges':sum(not e.is_manifold for e in bm.edges),'degenerateFaces':sum(f.calc_area()<1e-12 for f in bm.faces),'signedVolumeLocal':bm.calc_volume(signed=True),'allFinite':bool(np.isfinite(vs).all()),'uvLayers':len(me.uv_layers)};bm.free()
  eo.to_mesh_clear()
 objects[o.name]=d
payload={'source':str(src),'sourceSha256':hbytes(src.read_bytes()),'objects':objects,'materials':materials};out.write_text(json.dumps(payload,indent=2));print('SNAPSHOT',out,len(objects),len(materials))
