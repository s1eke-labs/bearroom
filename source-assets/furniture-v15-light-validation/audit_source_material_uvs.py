"""Read-only source texture/UV audit; records physical UV scale without changing it."""
import bpy, pathlib, sys, json, hashlib, math
import numpy as np
ap=sys.argv[sys.argv.index('--')+1:];src=pathlib.Path(ap[0]).resolve();dst=pathlib.Path(ap[1]).resolve()
bpy.ops.wm.open_mainfile(filepath=str(src));dg=bpy.context.evaluated_depsgraph_get();issues=[];objects=[]
def quant(v,w,q):
 if not len(v):return None
 ix=np.argsort(v);v=v[ix];w=w[ix];return float(v[np.searchsorted(np.cumsum(w),q*sum(w),side='left').clip(0,len(v)-1)])
for o in bpy.context.scene.objects:
 if o.type not in {'MESH','CURVE'}:continue
 mats=[m for m in o.data.materials if m and m.use_nodes]
 textured=[m for m in mats if any(n.type=='TEX_IMAGE' and n.image for n in m.node_tree.nodes)]
 if not textured:continue
 eo=o.evaluated_get(dg);me=eo.to_mesh();me.calc_loop_triangles();tri=list(me.loop_triangles)
 rec={'object':o.name,'materials':[m.name for m in mats],'uvLayers':[u.name for u in me.uv_layers],'normalMaps':[]}
 for m in mats:
  for n in m.node_tree.nodes:
   if n.type=='NORMAL_MAP' and n.outputs['Normal'].is_linked:
    rec['normalMaps'].append({'material':m.name,'uvMap':n.uv_map,'strength':n.inputs['Strength'].default_value})
    if n.uv_map and n.uv_map not in me.uv_layers:issues.append({'object':o.name,'material':m.name,'missingNormalUv':n.uv_map})
 if not me.uv_layers:issues.append({'object':o.name,'missingAllTextureUvs':True})
 if me.uv_layers and tri and any(m.name.startswith(('wood_','fabric_')) for m in mats):
  uv=me.uv_layers.active;coords=np.array([o.matrix_world@v.co for v in me.vertices]);inds=np.array([t.vertices[:] for t in tri]);lis=np.array([t.loops[:] for t in tri]);p=coords[inds];u=np.array([l.uv[:] for l in uv.data])[lis];a=p[:,1]-p[:,0];b=p[:,2]-p[:,0];la=np.linalg.norm(a,axis=1);area=np.linalg.norm(np.cross(a,b),axis=1)/2;ok=(la>1e-8)&(area>1e-12);a=a[ok];b=b[ok];la=la[ok];area=area[ok];u=u[ok];dot=np.sum(a*b,axis=1)/la;height=2*area/la
  Ainv=np.zeros((len(a),2,2));Ainv[:,0,0]=1/la;Ainv[:,0,1]=-dot/la/height;Ainv[:,1,1]=1/height;B=np.stack((u[:,1]-u[:,0],u[:,2]-u[:,0]),axis=2);J=B@Ainv;s=np.linalg.svd(J,compute_uv=False);nz=s[:,1]>1e-7
  rec['physicalUv']={'active':uv.name,'surfaceAreaM2':float(sum(area)),'nondegenerateTriangles':int(sum(ok)),'collapsedUvAreaFraction':float(sum(area[~nz])/sum(area)) if sum(area)>0 else 0,'cyclesPerMetreMajorMedian':quant(s[:,0],area,.5),'cyclesPerMetreMinorMedian':quant(s[:,1],area,.5),'anisotropyMedian':quant(s[nz,0]/s[nz,1],area[nz],.5),'majorP10':quant(s[:,0],area,.1),'majorP90':quant(s[:,0],area,.9)}
  if not np.isfinite(u).all():issues.append({'object':o.name,'nonFiniteUV':True})
 objects.append(rec);eo.to_mesh_clear()
materials=[]
for m in bpy.data.materials:
 if not m.use_nodes:continue
 ps=[n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'];p=ps[0] if ps else None
 textures=[{'node':n.name,'image':n.image.name,'dimensions':list(n.image.size),'packed':bool(n.image.packed_file),'colorspace':n.image.colorspace_settings.name,'vectorSource':[(l.from_node.type,l.from_node.name) for l in n.inputs['Vector'].links]} for n in m.node_tree.nodes if n.type=='TEX_IMAGE' and n.image]
 vals={}
 if p:
  for name in ['Base Color','Roughness','Metallic','Coat Weight','Coat Roughness','Sheen Weight','Sheen Tint','Sheen Roughness','Emission Strength']:
   v=p.inputs[name].default_value;vals[name]={'value':list(v) if hasattr(v,'__len__') else v,'linked':p.inputs[name].is_linked}
 materials.append({'name':m.name,'principled':vals,'textures':textures})
report={'source':src.name,'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'texturedObjectsChecked':len(objects),'materials':materials,'objects':objects,'issues':issues,'passed':not issues,'note':'UV scale is diagnostic, not a universal strict target. Curved cushions, narrow edge faces, and seams have legitimate anisotropic/singular patches.'}
dst.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in ['materials','objects']},indent=2))
