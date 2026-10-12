"""Read-only proof that a real bear edit preserves the accepted room lighting."""
import argparse, hashlib, json, pathlib, sys
import bpy
from mathutils import Vector, Matrix
p=argparse.ArgumentParser()
for k in ('previous-source','source','baseline','gi','output'):p.add_argument('--'+k,required=True)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:])
sha=lambda f:hashlib.sha256(pathlib.Path(f).read_bytes()).hexdigest()
old_path=pathlib.Path(a.previous_source);new_path=pathlib.Path(a.source)
old_hash=sha(old_path);new_hash=sha(new_path)
assert old_hash=='96c4f90312490c45489c64a4f836094a2f80d4a7bd077a093494eac72948d173','Prior source is not the accepted v19 source'
assert new_hash!=old_hash,'Seated source unexpectedly reuses prior source bytes'
assert sha(a.baseline)=='107ef50f0ec636d401df4631133ea0061ef14944ab2c325c16b39ea072962971'
ref=json.loads(pathlib.Path(a.baseline).read_text());g=json.loads(pathlib.Path(a.gi).read_text())
target=next(x['target'] for x in ref['lights']['lamps'] if x['name']=='living')
def collect(path):
 bpy.ops.wm.open_mainfile(filepath=str(path));root=bpy.data.objects['Bear_reference_plush'];dg=bpy.context.evaluated_depsgraph_get();points=[];meshes={}
 for obj in (root,*root.children_recursive):
  if obj.type not in {'MESH','CURVE'}:continue
  evaluated=obj.evaluated_get(dg);mesh=evaluated.to_mesh();pts=[obj.matrix_world@v.co for v in mesh.vertices];points.extend(pts)
  meshes[obj.name]={'protectedRigid':obj.name=='bear_head_sewn_front_panel' or any(m and m.name.startswith('embroidery_') for m in mesh.materials),'sourceLocalVerticesSha256':hashlib.sha256(b''.join(__import__('struct').pack('<3f',*v.co) for v in obj.data.vertices)).hexdigest() if obj.type=='MESH' else None,'vertices':len(mesh.vertices),'polygons':len(mesh.polygons),'matrixWorld':[float(x) for row in obj.matrix_world for x in row],'evaluatedWorldVerticesSha256':hashlib.sha256(b''.join(__import__('struct').pack('<3f',*v) for v in pts)).hexdigest(),'materials':[m.name if m else None for m in mesh.materials]}
  evaluated.to_mesh_clear()
 low=Vector([min(v[i] for v in points) for i in range(3)]);high=Vector([max(v[i] for v in points) for i in range(3)]);center=(low+high)/2
 anchors={o.name:{'type':o.type,'matrixWorld':[float(x) for row in o.matrix_world for x in row],'parent':o.parent.name if o.parent else None} for o in bpy.context.scene.objects if o.name.startswith('light_')}
 return {'bearBoundsCenterRuntimeXYZ':[float(center.x),float(center.z),float(-center.y)],'bearBoundsBlender':[list(low),list(high)],'bearMeshes':meshes,'anchors':anchors,'unitSystem':bpy.context.scene.unit_settings.system,'scaleLength':bpy.context.scene.unit_settings.scale_length}
old=collect(old_path);new=collect(new_path);issues=[]
def check(v,m):
 if not v:issues.append(m)
check((Vector(old['bearBoundsCenterRuntimeXYZ'])-Vector(target)).length<1e-5,'Prior source does not produce the accepted lighting target')
check(g['lights']==ref['lights'],'A baked analytic fixture parameter differs from accepted lighting')
check(g['sourceSha256']==new_hash and g['sky']['sourceSha256']==new_hash,'Fresh GI source provenance mismatch')
check(old['anchors']==new['anchors'],'A source light-anchor transform changed')
check(old['unitSystem']==new['unitSystem'] and old['scaleLength']==new['scaleLength'],'Metric units changed')
check(old['bearMeshes'].keys()==new['bearMeshes'].keys(),'Bear source mesh names changed')
changed=[];rigid_transform=None;protected=[];max_rigid_error=0.0
for name,x in old['bearMeshes'].items():
 y=new['bearMeshes'].get(name,{})
 for k in ('vertices','polygons','materials','protectedRigid'):check(x[k]==y.get(k),'Bear topology/material changed: '+name+'/'+k)
 if x['protectedRigid']:
  protected.append(name)
  check(x['sourceLocalVerticesSha256']==y.get('sourceLocalVerticesSha256'),'Protected head/embroidery local geometry changed: '+name)
  oldmat=Matrix([x['matrixWorld'][i:i+4] for i in range(0,16,4)]);newmat=Matrix([y['matrixWorld'][i:i+4] for i in range(0,16,4)]);transform=newmat@oldmat.inverted()
  if rigid_transform is None:rigid_transform=transform
  error=max(abs(transform[i][j]-rigid_transform[i][j]) for i in range(4) for j in range(4));max_rigid_error=max(max_rigid_error,error)
  check(error<1e-5,'Protected head/embroidery did not move together rigidly: '+name)
  rotation=transform.to_3x3();orthogonal=rotation.transposed()@rotation
  check(max(abs(orthogonal[i][j]-(1 if i==j else 0)) for i in range(3) for j in range(3))<1e-5 and abs(rotation.determinant()-1)<1e-5,'Head/embroidery transform is not rigid: '+name)
 else:check(x['matrixWorld']==y.get('matrixWorld'),'Unapproved object matrix changed: '+name)
 if x['evaluatedWorldVerticesSha256']!=y.get('evaluatedWorldVerticesSha256'):changed.append(name)
check(bool(changed),'No actual bear geometry changed')
retained=[name for name in changed if name not in g['excluded']]
check(bool(retained),'Changed bear geometry was not retained in physical light transport')
check(sha(old_path)==old_hash and sha(new_path)==new_hash,'Source changed during audit')
report={'passed':not issues,'sourceSha256':new_hash,'previousSourceSha256':old_hash,'giSha256':sha(a.gi),'baselineGiSha256':sha(a.baseline),'acceptedTargetRuntimeXYZ':target,'previousBearBoundsCenterRuntimeXYZ':old['bearBoundsCenterRuntimeXYZ'],'newBearBoundsCenterRuntimeXYZ':new['bearBoundsCenterRuntimeXYZ'],'newBoundsCenterToFrozenTargetMetres':(Vector(new['bearBoundsCenterRuntimeXYZ'])-Vector(target)).length,'allAnalyticLightingUnchanged':g['lights']==ref['lights'],'anchorsChecked':len(new['anchors']),'sourceAnchorTransformsUnchanged':old['anchors']==new['anchors'],'sourceBytesUnmodified':sha(old_path)==old_hash and sha(new_path)==new_hash,'geometryChangedMeshes':changed,'protectedRigidHeadAndEmbroideryObjects':protected,'protectedRigidTransformMaxError':max_rigid_error,'changedMeshesIncludedInTransport':retained,'oldBearMeshes':old['bearMeshes'],'newBearMeshes':new['bearMeshes'],'issues':issues}
pathlib.Path(a.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in ('oldBearMeshes','newBearMeshes')},indent=2))
assert not issues,issues
