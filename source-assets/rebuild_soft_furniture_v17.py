"""Panel-constructed upholstery, connected carcasses, fitted cloth.
Deterministic patch from the immutable v16 scene. Original furniture roots and
animation controllers stay in place. No textures or topology are added to the
old soft bodies; those meshes are replaced. Review using render_soft_v17.py.
"""
import bpy,bmesh,math,json,hashlib,sys,struct
from pathlib import Path
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
P=Path(__file__).resolve().parent
W=P/'soft-v17-work';W.mkdir(exist_ok=True)
REPORT={'created':[],'removed':[],'construction':[]}
PI=math.pi

def gauss(x,c,w):return math.exp(-((x-c)/w)**2)
def ss(x):x=max(0,min(1,x));return x*x*(3-2*x)
def lerp(a,b,t):return a*(1-t)+b*t
def mat(name):return bpy.data.materials[name]
def erase(o):
 if isinstance(o,str):o=bpy.data.objects.get(o)
 if o:REPORT['removed'].append(o.name);bpy.data.objects.remove(o,do_unlink=True)
def own(name,verts,faces,parent,material,world=False,old=None):
 if old is None:old=bpy.data.objects.get(name)
 if old:
  o=old;me=bpy.data.meshes.new(name+'_panel_topology');o.data=me
  for m in list(o.modifiers):o.modifiers.remove(m)
 else:
  me=bpy.data.meshes.new(name+'_panel_topology');o=bpy.data.objects.new(name,me);bpy.context.scene.collection.objects.link(o);o.parent=parent;o.matrix_local=Matrix.Identity(4)
 bpy.context.view_layer.update()
 transform=o.matrix_world.inverted_safe() if world else o.matrix_local.inverted_safe()
 me.from_pydata([transform@Vector(v) for v in verts],[],faces);me.update();me.materials.append(material)
 bm=bmesh.new();bm.from_mesh(me);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(me);bm.free()
 for f in me.polygons:f.use_smooth=True
 ca=me.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='POINT')
 for d in ca.data:d.color=(1,1,1,1)
 me.color_attributes.active_color=ca
 uv=me.uv_layers.new(name='UVMap')
 # World-size triplanar authoring UVs, actual fibre repeat about 22 cm.
 # Per-face orientation keeps grain consistent across sewn panels.
 for f in me.polygons:
  normal=(o.matrix_world.to_3x3()@f.normal).normalized();ax=max(range(3),key=lambda j:abs(normal[j]));axes=[i for i in range(3) if i!=ax]
  for li in f.loop_indices:
   co=o.matrix_world@me.vertices[me.loops[li].vertex_index].co;uv.data[li].uv=(co[axes[0]]/.30,co[axes[1]]/.30)
 o['softConstructionV17']='Connected sewn panel geometry, restrained pressure/contact deformation'
 REPORT['created'].append(name);return o

def seam(name,points,parent,material,r=.0012,world=False,cyclic=False):
 points=points[::2] if len(points)>60 else points
 d=bpy.data.curves.new(name+'_stitch_path','CURVE');d.dimensions='3D';d.resolution_u=1;d.bevel_depth=r;d.bevel_resolution=0;s=d.splines.new('POLY');s.points.add(len(points)-1)
 inv=parent.matrix_world.inverted_safe() if world else Matrix.Identity(4)
 for a,p in zip(s.points,points):a.co=(*(inv@Vector(p)),1)
 s.use_cyclic_u=cyclic;o=bpy.data.objects.new(name,d);bpy.context.scene.collection.objects.link(o);o.parent=parent;o.matrix_local=Matrix.Identity(4);bpy.context.view_layer.update();d.materials.append(material);o['softConstructionV17']='Fine sewn welt';REPORT['created'].append(name);return o

def catmull(points,steps=8,closed=False):
 pp=[Vector(p) for p in points];out=[];N=len(pp)
 for i in range(N if closed else N-1):
  a,b,c,d=[pp[j%N] if closed else pp[max(0,min(N-1,j))] for j in [i-1,i,i+1,i+2]]
  for k in range(steps):
   t=k/steps;out.append(.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t))
 if not closed:out.append(pp[-1])
 return out

def panel(name,parent,material,center,hx,hy,thickness,axis='z',N=30,M=26,settle=.025,pillow=False,rotation=0,lean=0,world=False,side_material=None,style='seat',seed=0):
 """Two cut fabric panels and a shaped boxing strip, one closed mesh.
 A broad pressure-compressed central surface replaces latitude/pole blobs.
 Corner-origin seam tension is directional, never white-noise displacement.
 """
 c=Vector(center);verts=[];faces=[];uvcoords=[]
 def shape(u,v,side):
  # Corner rounding only affects the flat sewing pattern; no spherical poles.
  corner=.19 if pillow else .28
  x=u*hx*math.sqrt(1-corner*v*v);y=v*hy*math.sqrt(1-corner*u*u)
  interior=max(0,(1-u*u)*(1-v*v))
  if pillow:
   depth=(thickness*.49)*interior**.58+.003
   z=side*depth
   # The lower edge bears weight and the tips are pulled toward the seam.
   y-=.018*(1-v)*gauss(u,.13,.6);x+=.013*v*(1-u*u)
   z-=side*.011*gauss(u,.42,.10)*gauss(v,-.55,.42)
   z-=side*.006*gauss(u,-.52,.13)*gauss(v,-.38,.49)
   for ox,oy,dx,dy,amp,length in [(-.80,-.91,.50,.86,.017,.61),(-.94,-.64,.90,.44,.011,.51),(.80,-.93,-.57,.82,.019,.67),(.95,-.62,-.91,.4,.010,.49),(-.89,.87,.72,-.69,.008,.48),(.86,.90,-.54,-.84,.009,.50)]:
    pu=u-ox;pv=v-oy;along=pu*dx+pv*dy;across=-pu*dy+pv*dx
    if along>0:
     width=.025+.042*along;fall=ss(along/.10)*math.exp(-(along/length)**2)
     crease=(math.exp(-(across/width)**2)-.36*math.exp(-((abs(across)-width*1.6)/(width*.75))**2))*amp*fall
     z-=side*crease
   y-=.026*gauss(v,-.65,.39)*gauss(u,.10,.65)
  else:
   edge=(1-max(abs(u),abs(v)))
   top=thickness*.50-min(.062,thickness*.35)*math.exp(-max(0,edge)/.155)
   top-=settle*gauss(u,.08+seed*.05,.68)*gauss(v,.15,.68)
   top+=.006*math.sin(PI*u*.7+seed)*interior
   z=top if side>0 else -thickness*.49+.009*interior
   # Short puckers radiate from corners where top cloth meets boxing.
   for su,sv,amp in [(-1,-1,.006),(1,-1,.004),(-1,1,.004),(1,1,.007)]:
    du=(u-su);dv=(v-sv);long=(du+dv)/1.414;cross=(du-dv)/1.414
    z-=side*amp*gauss(cross,.035,.07)*gauss(long,(-su-sv)*.15,.35)*ss(abs(u)*abs(v))
  if style=='office_seat':
   # Anatomical pan: broad front waterfall, hip relief, modest side bolsters.
   z+=.014*abs(u)**4*ss((v+1)*.7)-.018*gauss(u,0,.53)*gauss(v,.3,.7)
   x*=1-.05*(v+1)/2
  if style=='office_back':
   x*=.92+.08*gauss(v,.42,.6)
   z+=.029*gauss(v,-.48,.34)*(1-.35*u*u)-.015*gauss(v,.3,.55)+.026*u*u
  if style=='back':z+=.013*u*u-.010*gauss(v,-.65,.16)*(1-u*u)
  # Map padding depth to y for back cushions. Front is negative local y.
  if axis=='z':p=Vector((x,y,z))
  else:p=Vector((x,-z,y));p.y+=lean*y/max(hy,1e-9)
  if rotation:p=Matrix.Rotation(rotation,3,'Y' if axis=='y' else 'Z')@p
  return c+p
 for side in [1,-1]:
  for j in range(M+1):
   for i in range(N+1):verts.append(tuple(shape(-1+2*i/N,-1+2*j/M,side)))
 K=(N+1)*(M+1)
 for layer in range(2):
  for j in range(M):
   for i in range(N):
    a=layer*K+j*(N+1)+i;f=(a,a+1,a+N+2,a+N+1);faces.append(f if layer==0 else tuple(reversed(f)))
 edge=list(range(N+1))+[j*(N+1)+N for j in range(1,M+1)]+[M*(N+1)+i for i in range(N-1,-1,-1)]+[j*(N+1) for j in range(M-1,0,-1)]
 rings=[edge]
 for r in [1,2,3]:
  ids=[];t=r/4
  for idx in edge:
   a=Vector(verts[idx]);b=Vector(verts[K+idx]);q=a.lerp(b,t);out=q-c
   if axis=='z':out.z=0
   else:out.y=0
   if out.length:q+=out.normalized()*(.004 if pillow else .023)*math.sin(PI*t)
   ids.append(len(verts));verts.append(tuple(q))
  rings.append(ids)
 rings.append([K+i for i in edge])
 for a,b in zip(rings,rings[1:]):
  for i in range(len(edge)):k=(i+1)%len(edge);faces.append((a[i],b[i],b[k],a[k]))
 o=own(name,verts,faces,parent,material,world=world)
 if side_material:
  o.data.materials.append(side_material)
  for f in o.data.polygons[N*M:]:f.material_index=1
 # A seam at the upper boxing edge is visibly attached rather than floating.
 seam(name+'_seam', [verts[i] for i in rings[0 if not pillow else 2]], parent, mat('fabric_tailored_rose_welt') if 'rose' in material.name else mat('fabric_tailored_ivory_welt'), .0011,world,True)
 return o

def rounded_box(name,lo,hi,parent,material,radius):
 lo=Vector(lo);hi=Vector(hi);vs=[(x,y,z) for x in [lo.x,hi.x] for y in [lo.y,hi.y] for z in [lo.z,hi.z]];fs=[(0,2,6,4),(1,5,7,3),(0,4,5,1),(2,3,7,6),(0,1,3,2),(4,6,7,5)]
 o=own(name,vs,fs,parent,material);mod=o.modifiers.new('Upholstered substrate radii','BEVEL');mod.width=radius;mod.segments=4
 bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name);return o

def swept_carcass(name,parent,path,material,bottom=.21,depth=.21):
 # Swept asymmetric upholstery section: broad outer side, turned top shoulder,
 # narrower inner face, physical thickness. This is not a round cylinder.
 points=catmull(path,8);section=catmull([(1,.00),(1.10,.17),(1.10,.58),(.92,.86),(.58,.985),(.05,1),(-.45,.94),(-.83,.75),(-.83,.44),(-.68,.06)],3,True)
 verts=[];faces=[];L=len(section)
 for i,p in enumerate(points):
  d=points[min(i+1,len(points)-1)]-points[max(i-1,0)];d.z=0;d.normalize();n=Vector((-d.y,d.x,0))
  # End faces contract only over the last 8cm, producing finished sewn caps.
  taper=.65+.35*ss(min(i,len(points)-1-i)/3)
  for s in section:
   q=Vector((p.x,p.y,bottom))+n*s.x*depth*taper;q.z=bottom+s.y*(p.z-bottom)
   q+=n*.0022*math.sin(i*.67)*math.sin(s.y*PI)**2
   verts.append(tuple(q))
 for j in range(len(points)-1):
  for i in range(L):a=j*L+i;b=j*L+(i+1)%L;faces.append((a,b,b+L,a+L))
 faces.append(tuple(reversed(range(L))));faces.append(tuple(range((len(points)-1)*L,len(points)*L)))
 return own(name,verts,faces,parent,material)

def union_meshes(objects,name,parent,material,voxel=.022):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:o.select_set(True)
 bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();o=objects[0];o.name=name
 mod=o.modifiers.new('Connected upholstered carcass','REMESH');mod.mode='VOXEL';mod.voxel_size=voxel;mod.use_smooth_shade=True;bpy.ops.object.modifier_apply(modifier=mod.name)
 smooth=o.modifiers.new('Tailored substrate relaxation','SMOOTH');smooth.factor=.70;smooth.iterations=3;bpy.ops.object.modifier_apply(modifier=smooth.name)
 dec=o.modifiers.new('Efficient carcass tessellation','DECIMATE');dec.ratio=.18;bpy.ops.object.modifier_apply(modifier=dec.name)
 # Regenerate physical-scale UVs after remesh.
 vs=[o.matrix_local@v.co for v in o.data.vertices];fs=[tuple(f.vertices) for f in o.data.polygons];return own(name,vs,fs,parent,material,old=o)

def fabric_materials():
 # Texture files are actual CC0 fabric photographs / scanned normal maps.
 T=W/'textures';out={}
 for name,color,prefix in [('fabric_v17_boucle',(0.79,.75,.68,1),'boucle'),('fabric_v17_rose_linen',(.60,.37,.35,1),'linen')]:
  m=bpy.data.materials.get(name) or bpy.data.materials.new(name);m.use_nodes=True;nt=m.node_tree;nt.nodes.clear();bs=nt.nodes.new('ShaderNodeBsdfPrincipled');outnode=nt.nodes.new('ShaderNodeOutputMaterial');nt.links.new(bs.outputs['BSDF'],outnode.inputs['Surface']);bs.inputs['Base Color'].default_value=color;bs.inputs['Roughness'].default_value=.88;bs.inputs['Sheen Weight'].default_value=.16;bs.inputs['Sheen Roughness'].default_value=.7;m.diffuse_color=color
  for suffix,socket,space in [('color','Base Color','sRGB'),('orm','Roughness','Non-Color'),('normal',None,'Non-Color')]:
   paths=list(T.glob(prefix+'_'+suffix+'.*'))
   if not paths:continue
   im=bpy.data.images.load(str(paths[0]),check_existing=True);im.colorspace_settings.name=space;im.pack();n=nt.nodes.new('ShaderNodeTexImage');n.image=im;n.interpolation='Linear'
   if suffix=='normal':
    nm=nt.nodes.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.80 if prefix=='boucle' else .65;nt.links.new(n.outputs['Color'],nm.inputs['Color']);nt.links.new(nm.outputs[0],bs.inputs['Normal'])
   elif suffix=='orm':
    split=nt.nodes.new('ShaderNodeSeparateColor');nt.links.new(n.outputs['Color'],split.inputs['Color']);nt.links.new(split.outputs['Green'],bs.inputs['Roughness']);nt.links.new(split.outputs['Blue'],bs.inputs['Metallic'])
   else:nt.links.new(n.outputs['Color'],bs.inputs[socket])
  out[prefix]=m
 return out

def preserve_bear_contact(seat,old_tree):
 # Keep the accepted toy at its exact transform. Locally preserve the supporting
 # seat contour under its soles; this produces a small coherent pressure dent.
 feet=[bpy.data.objects[n] for n in ['bear_foot_L_soft','bear_foot_R_soft']]
 anchors=[min((o.matrix_world@v.co for v in o.data.vertices),key=lambda q:q.z) for o in feet]
 bm=bmesh.new();bm.from_mesh(seat.data);mw=seat.matrix_world;edges=set()
 for f in bm.faces:
  q=mw@f.calc_center_median()
  if q.z>.64 and min(math.hypot(q.x-a.x,q.y-a.y) for a in anchors)<.13:edges.update(f.edges)
 if edges:bmesh.ops.subdivide_edges(bm,edges=list(edges),cuts=3,use_grid_fill=True)
 inv=mw.inverted_safe();count=0
 for v in bm.verts:
  q=mw@v.co;distance=min(math.hypot(q.x-a.x,q.y-a.y) for a in anchors)
  if q.z<.64 or distance>.15:continue
  hit,n,index,d=old_tree.ray_cast(Vector((q.x,q.y,.9)),Vector((0,0,-1)),.55)
  if hit is None:continue
  weight=1-ss((distance-.055)/.085);q.z=lerp(q.z,hit.z,weight);v.co=inv@q;count+=1
 bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(seat.data);bm.free();seat.data.update();seat['preservedBearContactVertices']=count
 REPORT['construction'].append('Existing bear geometry and transform unchanged; local cushion pressure contour preserves the accepted sole support heights.')

def apply_soft_v17():
 # Capture accepted seating contact before the legacy sofa meshes are removed.
 ovs=[];ofs=[]
 for name in ['F01_sofa__fabric_sofa_boucle_part_000','F01_sofa__fabric_sofa_boucle_part_002']:
  ob=bpy.data.objects[name];off=len(ovs);ovs.extend(ob.matrix_world@v.co for v in ob.data.vertices);ofs.extend(tuple(off+i for i in f.vertices) for f in ob.data.polygons)
 old_contact_tree=BVHTree.FromPolygons(ovs,ofs)
 materials=fabric_materials();ivory=materials['boucle'];rose=materials['linen'];root=bpy.data.objects['F01_sofa']
 # All legacy inflated parts and floating duplicate piping are removed.
 for o in list(root.children):
  if o.name.startswith('F01_sofa__fabric_'):erase(o)
 path=[(-3.00,-1.79,.89),(-3.01,-1.48,.99),(-2.98,-1.14,1.12),(-2.76,-.91,1.17),(-2.18,-.885,1.18),(-1.47,-.885,1.17),(-.72,-.885,1.18),(-.25,-.92,1.16),(-.05,-1.12,1.09),(-.035,-1.46,.95),(-.035,-1.72,.88)]
 frame=swept_carcass('sofa_v17_wrap_frame',root,path,ivory,.20,.20)
 deck=rounded_box('sofa_v17_deck',(-3.10,-1.96,.20),(.13,-.74,.51),root,ivory,.085)
 chaise=rounded_box('sofa_v17_chaise_deck',(-1.24,-2.335,.20),(-.11,-1.10,.52),root,ivory,.095)
 carcass=union_meshes([frame,deck,chaise],'sofa_v17_connected_carcass',root,ivory,.026)
 # A continuous shoulder seam around the wrapped frame.
 points=catmull(path,10);welt=[]
 for i,p in enumerate(points):
  d=points[min(i+1,len(points)-1)]-points[max(i-1,0)];d.z=0;d.normalize();n=Vector((-d.y,d.x,0));welt.append(p+n*.115-Vector((0,0,.028)))
 seam('sofa_v17_shoulder_seam',welt,root,mat('fabric_tailored_ivory_welt'),.0014)
 for i,(cx,hx,hy,cy) in enumerate([(-2.47,.381,.44,-1.52),(-1.65,.472,.44,-1.52),(-.665,.481,.648,-1.64)]):
  panel('sofa_v17_seat_'+str(i+1),root,ivory,(cx,cy,.633 if i==1 else .603),hx,hy,.252 if i==1 else .235,settle=.031 if i!=1 else .035,N=24,M=28 if i==2 else 22,seed=i)
 # The toy will be rigidly settled after cushion construction; no deep dents.
 for i,cx in enumerate([-2.43,-1.535,-.64]):
  panel('sofa_v17_back_'+str(i+1),root,ivory,(cx,-1.086,.929),.438,.279,.22,'y',N=24,M=24,settle=.018,lean=.055,style='back',seed=i)
 # Three sewn cushions: held corners, pinched seam and compressed lower edge.
 for i,(cx,cy,cz,ang) in enumerate([(-2.43,-1.30,.919,-.12),(-1.51,-1.325,.93,.055),(-.51,-1.32,.905,.18)]):
  panel('sofa_v17_rose_pillow_'+str(i+1),root,rose,(cx,cy,cz),.251,.229,.290,'y',N=28,M=28,pillow=True,lean=.065,rotation=ang,seed=i)
 if (W/'sofa-throw-restmesh.json').exists():
  data=json.loads((W/'sofa-throw-restmesh.json').read_text())
  assert data['minimumZ']>.05,'Invalid cloth rest pose'
  cloth=own('anim_sofa_edge',data['verticesWorld'],data['faces'],root,rose,world=True)
  cloth['clothShellPairCount']=data['pairCount'];cloth['clothThicknessMetres']=data['thickness'];cloth['softConstructionV17']='Gravity/collision simulated throw, baked editable rest pose'
 REPORT['construction'].append('Sofa: one connected wraparound upholstered carcass, three pressure-settled boxed seats, seam-pinched back panels and cloth-pattern pillows. Replaced old superellipsoid assemblies.')
 # Office chair is authored in world frame then converted under its intact pivot.
 parent=bpy.data.objects['anim_chair_swivel']
 names=['chair_seat','chair_seat_pad','chair_back','chair_lumbar','chair_arm_pad','chair_arm_pad.001','chair_arm_support','chair_arm_support.001','chair_v15_arm_attachment_-1','chair_v15_arm_attachment_1']
 for o in list(parent.children):
  if o.name in names or 'v13_tailored_seam' in o.name:erase(o)
 # broad waterfall pan, one boxing strip (rose upper panel / ivory side)
 panel('chair_v17_tailored_seat',parent,rose,(3.50,-1.155,.568),.33,.317,.188,'z',N=26,M=24,settle=.023,world=True,side_material=ivory,style='office_seat')
 # Back front points toward +world y. Mapping axis y fronts negative; mirror y
 # afterward, preserving the exact parent/pivot placement.
 ob=panel('chair_v17_anatomical_back',parent,ivory,(3.50,-1.440,1.025),.316,.394,.135,'y',N=24,M=30,settle=.01,lean=.043,world=True,style='office_back')
 # Thin rose lumbar insert closely follows the supporting back.
 panel('chair_v17_lumbar_insert',parent,rose,(3.50,-1.344,.872),.220,.208,.059,'y',N=22,M=24,settle=.006,lean=.027,world=True,style='back')
 # All back panel meshes/seams are flipped to present to desk, not out of chair.
 bpy.context.view_layer.update()
 for o in list(parent.children):
  if o.name.startswith(('chair_v17_anatomical_back','chair_v17_lumbar_insert')):
   if o.type=='MESH':
    inv=o.matrix_world.inverted_safe();c=-1.440 if 'anatomical' in o.name else -1.344
    for v in o.data.vertices:q=o.matrix_world@v.co;q.y=2*c-q.y;v.co=inv@q
    bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(o.data);bm.free();o.data.update()
   elif o.type=='CURVE':
    inv=o.matrix_world.inverted_safe();c=-1.440 if 'anatomical' in o.name else -1.344
    for s in o.data.splines:
     for p in s.points:q=o.matrix_world@Vector(p.co[:3]);q.y=2*c-q.y;p.co=(*(inv@q),1)
 for sign in [-1,1]:
  x=3.5+sign*.366
  panel('chair_v17_arm_top_'+str(sign),parent,ivory,(x,-1.137,.802),.064,.199,.064,'z',N=10,M=18,settle=.003,world=True)
  # Molded continuous curved support joins seat shell to the arm cushion.
  points=[(x,-1.29,.786),(x,-1.31,.735),(x-sign*.01,-1.305,.62),(x-sign*.045,-1.27,.51),(x-sign*.085,-1.21,.504)]
  curve=catmull(points,6);vs=[];fs=[];sec=[(-.021,-.014),(.021,-.014),(.024,-.009),(.024,.009),(.021,.014),(-.021,.014),(-.024,.009),(-.024,-.009)]
  for j,q in enumerate(curve):
   tangent=(curve[min(j+1,len(curve)-1)]-curve[max(j-1,0)]).normalized(); normal=Vector((0,tangent.z,-tangent.y)).normalized()
   for a,b in sec:vs.append(tuple(q+Vector((a,0,0))+normal*b))
  for j in range(len(curve)-1):
   for i in range(8):a=j*8+i;b=j*8+(i+1)%8;fs.append((a,b,b+8,a+8))
  fs += [tuple(reversed(range(8))),tuple(range((len(curve)-1)*8,len(curve)*8))]
  own('chair_v17_molded_arm_'+str(sign),vs,fs,parent,mat('polymer_warm_abs'),world=True)
 REPORT['construction'].append('Office chair: anatomical back shell, close-set lumbar insert, broad settled seat with continuous sewn boxing and shaped molded arm supports. Original swivel/feet preserved.')
 # Reading chair: one wrapped tub replaces four unrelated arm/back capsules.
 parent=bpy.data.objects['anim_rocker']
 for o in list(parent.children):
  if o.name.startswith(('rocker_arm','rocker_back','rocker_pillow','rocker_seat')):erase(o)
 # Local to the unchanged rocking pivot: former seat z .405–.624.
 path=[(-.357,-.275,.72),(-.367,-.04,.84),(-.332,.24,1.05),(-.225,.319,1.235),(0,.335,1.255),(.225,.319,1.235),(.332,.24,1.05),(.367,-.04,.84),(.357,-.275,.72)]
 tub=swept_carcass('rocker_v17_wrap',parent,path,ivory,.385,.091)
 deck=rounded_box('rocker_v17_deck',(-.37,-.335,.385),(.37,.34,.545),parent,ivory,.06)
 union_meshes([tub,deck],'rocker_v17_continuous_tub',parent,ivory,.016)
 panel('rocker_v17_seat',parent,ivory,(0,-.024,.558),.314,.305,.145,N=24,M=22,settle=.021)
 panel('rocker_v17_back',parent,ivory,(0,.217,.954),.286,.273,.121,'y',N=24,M=24,settle=.012,lean=.026,style='back')
 panel('rocker_v17_pillow',parent,rose,(.008,.085,.845),.211,.181,.112,'y',N=26,M=26,pillow=True,rotation=.085,lean=.040)
 REPORT['construction'].append('Reading rocker: connected sculpted tub, separate sewn seat/back cushions, original wooden rocking structure retained.')
 if (W/'pillow-restmesh.json').exists():
  for name,data in json.loads((W/'pillow-restmesh.json').read_text()).items():
   ob=bpy.data.objects[name];verts=[ob.matrix_local@ob.data.vertices[i].co.lerp(Vector(v),.28) for i,v in enumerate(data['verticesLocal'])];own(name,verts,data['faces'],ob.parent,ob.data.materials[0],old=ob)
  REPORT['construction'].append('Loose accent cushions preserve filled padding volume, with28% pressure-simulated fabric deformation for restrained seam/contact wrinkles.')
 if (W/'bear-rigid-fit.json').exists():
  fit=json.loads((W/'bear-rigid-fit.json').read_text());bear=bpy.data.objects['Bear_reference_plush'];assert max(abs(bear.matrix_world[i][j]-fit['oldRootMatrix'][i][j]) for i in range(4) for j in range(4))<1e-6
  bear.matrix_world=Matrix(fit['newRootMatrix']);REPORT['bearRigidFit']=fit
 return REPORT

def digest(o):
 h=hashlib.sha256();h.update(str(list(map(list,o.matrix_basis))).encode())
 if o.type=='MESH':
  for v in o.data.vertices:h.update(struct.pack('3f',*v.co))
  for f in o.data.polygons:h.update(struct.pack(str(len(f.vertices))+'I',*f.vertices))
 return h.hexdigest()

def main():
 args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
 src=Path(args[0]).resolve() if args else P/'bearroom-pc-v16.blend';dst=Path(args[1]).resolve() if len(args)>1 else P/'bearroom-soft-v17-draft.blend'
 assert hashlib.sha256(src.read_bytes()).hexdigest()=='63ca5916d3982867c263a3d5ed0af7a2b22a3764635c9c6afa8d9825e43519d6'
 bpy.ops.wm.open_mainfile(filepath=str(src));protected={o.name:digest(o) for o in bpy.data.objects if o.name!='Bear_reference_plush' and ( (o.type=='EMPTY' and o.name!='Bear_reference_plush') or o.name.startswith(('piano_key_','pc16_','screen_PC_case','Bear_')))}
 r=apply_soft_v17();assert all(n in bpy.data.objects and digest(bpy.data.objects[n])==h for n,h in protected.items()),'Protected object changed'
 r['protectedObjectsUnchanged']=len(protected);r['sourceSha256']=hashlib.sha256(src.read_bytes()).hexdigest();r['geometryOnlyStage']='Cloth fitting and final scanned fabric are next review stages.'
 bpy.ops.wm.save_as_mainfile(filepath=str(dst),compress=True);r['outputSha256']=hashlib.sha256(dst.read_bytes()).hexdigest();(W/'build-report.json').write_text(json.dumps(r,indent=2));print('SOFT_V17_BUILT',dst,r['outputSha256'])
if __name__=='__main__':main()
