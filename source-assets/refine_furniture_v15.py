"""Close-range manufactured-furniture construction, applied to frozen v13.
Editable source components; no new textures, modifiers capped at 3 bevel segments.
No architecture, placement roots, lights, toys, padded upholstery, cloth or keys
are changed. Runtime batching remains a separate non-authoring operation.
"""
import bpy, bmesh, math, json, hashlib
from mathutils import Vector, Matrix
CASES={}
FRONTS={}
REPORT={'revision':'furniture-v15','changes':[],'created':[],'replaced':[],'removed':[]}

def mat(name):return bpy.data.materials[name]
def bounds(ob):
 p=[ob.matrix_local@Vector(v) for v in ob.bound_box]
 return Vector([min(v[i] for v in p) for i in range(3)]),Vector([max(v[i] for v in p) for i in range(3)])
def ob(name):return bpy.data.objects[name]
def erase(o):
 REPORT['removed'].append(o.name);bpy.data.objects.remove(o,do_unlink=True)
def ownmesh(name,vs,fs,material,parent,old=None,bevel=0,smooth=False):
 o=old
 if o is None:
  o=bpy.data.objects.new(name,bpy.data.meshes.new(name+'_mesh'));bpy.context.scene.collection.objects.link(o);o.parent=parent;REPORT['created'].append(name)
 else:REPORT['replaced'].append(o.name)
 for md in list(o.modifiers):o.modifiers.remove(md)
 me=bpy.data.meshes.new(name+'_crafted_mesh');me.from_pydata(vs,[],fs);me.update();bm=bmesh.new();bm.from_mesh(me);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(me);bm.free();me.update();me.materials.append(material);o.data=me;o.matrix_local=Matrix.Identity(4)
 for p in me.polygons:p.use_smooth=smooth
 ca=me.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='POINT')
 for a in ca.data:a.color=(1,1,1,1)
 me.color_attributes.active_color=ca;me.color_attributes.render_color_index=0
 if bevel:
  b=o.modifiers.new('Manufactured edge radius','BEVEL');b.width=bevel;b.segments=2
  w=o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL');w.keep_sharp=True
 o['furnitureV15']='Manufactured panel, joint or support in existing furniture envelope'
 physical_uv(o)
 return o

def physical_uv(o,grain_axis=None):
 me=o.data;uv=me.uv_layers.active or me.uv_layers.new(name='UVMap');lo,hi=bounds(o);dims=hi-lo
 wood=any('wood_' in m.name for m in me.materials)
 parent_scale=o.parent.matrix_world.to_scale() if o.parent else Vector((1,1,1))
 for p in me.polygons:
  drop=max(range(3),key=lambda i:abs(p.normal[i]));axes=[i for i in range(3) if i!=drop]
  if wood:
   long=grain_axis if grain_axis in axes else max(axes,key=lambda i:dims[i]);short=next(i for i in axes if i!=long);axes=[short,long];scale=(.35,1.2)
  else:scale=(.12,.12)
  for li in p.loop_indices:
   co=me.vertices[me.loops[li].vertex_index].co;uv.data[li].uv=(co[axes[0]]*abs(parent_scale[axes[0]])/scale[0],co[axes[1]]*abs(parent_scale[axes[1]])/scale[1])
 o['physicalTextureRepeatMetres']='Oak transverse 0.35, longitudinal 1.2; other inherited micro-surface 0.12'

def box(name,lo,hi,material,parent,old=None,bevel=.0012):
 lo,hi=Vector(lo),Vector(hi);assert min(hi-lo)>0,(name,lo,hi)
 vs=[(x,y,z) for x in (lo.x,hi.x) for y in (lo.y,hi.y) for z in (lo.z,hi.z)]
 fs=[(0,2,6,4),(1,5,7,3),(0,4,5,1),(2,3,7,6),(0,1,3,2),(4,6,7,5)]
 return ownmesh(name,vs,fs,material,parent,old,bevel)

def shell(o,depth_axis=1,front_sign=-1,thick=.018,top=.022,front_extension=0):
 lo,hi=bounds(o);parent=o.parent;material=o.data.materials[0];w=1-depth_axis;d=depth_axis
 if front_sign<0:lo[d]-=front_extension
 else:hi[d]+=front_extension
 CASES[o.name]=(lo.copy(),hi.copy(),depth_axis,front_sign,thick,top)
 specs=[]
 a,b=lo.copy(),hi.copy();b[w]=lo[w]+thick;specs.append(('side_L',a,b))
 a,b=lo.copy(),hi.copy();a[w]=hi[w]-thick;specs.append(('side_R',a,b))
 a,b=lo.copy(),hi.copy();a[w]+=thick;b[w]-=thick;a.z=hi.z-top;specs.append(('top',a,b))
 a,b=lo.copy(),hi.copy();a[w]+=thick;b[w]-=thick;b.z=lo.z+top;specs.append(('bottom',a,b))
 a,b=lo.copy(),hi.copy();a[w]+=thick;b[w]-=thick;a.z+=top;b.z-=top
 if front_sign<0:a[d]=hi[d]-.007
 else:b[d]=lo[d]+.007
 specs.append(('rebated_back',a,b))
 # A recessed continuous backing to the 3 mm front reveals is the actual back,
 # not a false overlay decal. Opening remains physically enclosed by doors.
 name=o.name
 for i,(part,a,b) in enumerate(specs):
  out=box(name if i==0 else name+'_v15_'+part,a,b,material,parent,o if i==0 else None,bevel=.001)
  out['panelThicknessMetres']=thick if i<2 else (top if i<4 else .007)
 REPORT['changes'].append({'object':name,'construction':'Separate side, top, bottom and rebated back panels','side_mm':thick*1000,'top_bottom_mm':top*1000,'back_mm':7})
 return lo,hi

def face_frame(case_name,front_names):
 """Real 18 mm face-frame rails fill margins inherited from the solid case.
 Door-covered apertures remain hollow; avoids accidental open front slots.
 """
 o=ob(case_name);lo,hi,d,sign,thick,top=CASES[case_name];w=1-d
 left,right=lo[w]+thick,hi[w]-thick;bottom,upper=lo.z+top,hi.z-top
 holes=[]
 for name in front_names:
  a,b=FRONTS.get(name,bounds(ob(name)));holes.append((a[w]+.003,b[w]-.003,a.z+.003,b.z-.003))
 xs=sorted(set([left,right]+[max(left,min(right,h[i])) for h in holes for i in [0,1]]))
 zs=sorted(set([bottom,upper]+[max(bottom,min(upper,h[i])) for h in holes for i in [2,3]]))
 n=0
 for zl,zh in zip(zs,zs[1:]):
  if zh-zl<1e-5:continue
  run=None
  for j,(xl,xh) in enumerate(zip(xs,xs[1:])):
   x,z=(xl+xh)*.5,(zl+zh)*.5;hole=any(h[0]<x<h[1] and h[2]<z<h[3] for h in holes)
   if not hole and run is None:run=xl
   if run is not None and (hole or j==len(xs)-2):
    end=xl if hole else xh
    if end-run>1e-5:
     a,b=lo.copy(),hi.copy();a[w]=run;b[w]=end;a.z=zl;b.z=zh
     if sign>0:a[d]=hi[d]-.019;b[d]=hi[d]-.001
     else:a[d]=lo[d]+.001;b[d]=lo[d]+.019
     box(case_name+'_v15_faceframe_'+str(n),a,b,o.data.materials[0],o.parent,None,.0008);n+=1
    run=None
 REPORT['changes'].append({'object':case_name,'construction':'Real 18 mm face-frame rails behind existing front margins, enclosed apertures, no open slits','rails':n})


def frame_door(o,lo,hi,depth_axis=1,front_sign=-1,frame=.055,recess=.006):
 lo,hi=Vector(lo),Vector(hi);FRONTS[o.name]=(lo.copy(),hi.copy());p=o.parent;m=mat('lacquer_pearl');w=1-depth_axis;d=depth_axis
 front=lo[d] if front_sign<0 else hi[d];back=hi[d] if front_sign<0 else lo[d]
 specs=[]
 a,b=lo.copy(),hi.copy();b[w]=lo[w]+frame;specs.append(('stile_L',a,b))
 a,b=lo.copy(),hi.copy();a[w]=hi[w]-frame;specs.append(('stile_R',a,b))
 a,b=lo.copy(),hi.copy();a[w]+=frame;b[w]-=frame;b.z=lo.z+frame;specs.append(('rail_lower',a,b))
 a,b=lo.copy(),hi.copy();a[w]+=frame;b[w]-=frame;a.z=hi.z-frame;specs.append(('rail_upper',a,b))
 a,b=lo.copy(),hi.copy();a[w]+=frame-.004;b[w]-=frame-.004;a.z+=frame-.004;b.z-=frame-.004
 if front_sign<0:a[d]=front+recess
 else:b[d]=front-recess
 specs.append(('recessed_panel',a,b))
 name=o.name
 for i,(part,a,b) in enumerate(specs):box(name if i==0 else name+'_v15_'+part,a,b,m,p,o if i==0 else None,.0009)
 REPORT['changes'].append({'object':name,'construction':'Five-piece frame-and-panel front','panel_recess_mm':recess*1000,'frame_width_mm':frame*1000})

def cylinder(name,a,b,r,material,parent,old=None,n=16,r2=None):
 a,b=Vector(a),Vector(b);axis=(b-a).normalized();u=axis.cross(Vector((0,0,1)))
 if u.length<.1:u=axis.cross(Vector((0,1,0)))
 u.normalize();v=axis.cross(u);r2=r if r2 is None else r2
 vs=[tuple(c+rad*(u*math.cos(2*math.pi*i/n)+v*math.sin(2*math.pi*i/n))) for c,rad in [(a,r),(b,r2)] for i in range(n)]
 fs=[tuple(reversed(range(n))),tuple(range(n,n*2))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
 out=ownmesh(name,vs,fs,material,parent,old,0,True)
 for f in out.data.polygons[:2]:f.use_smooth=False
 return out

def notch_drawer(o,lo,hi,r=.046):
 lo,hi=Vector(lo),Vector(hi);c=(lo.x+hi.x)/2;n=12
 # Actual concave top edge in the 22 mm-thick drawer front. No boolean or decal.
 outline=[(lo.x,lo.z),(hi.x,lo.z),(hi.x,hi.z),(c+r,hi.z)]
 outline += [(c+r*math.cos(math.pi*i/n),hi.z-r*.52*math.sin(math.pi*i/n)) for i in range(1,n+1)]
 outline += [(lo.x,hi.z)]
 vs=[(x,y,z) for y in [lo.y,hi.y] for x,z in outline];N=len(outline)
 fs=[tuple(range(N)),tuple(reversed(range(N,2*N)))]+[(i,(i+1)%N,(i+1)%N+N,i+N) for i in range(N)]
 ownmesh(o.name,vs,fs,mat('lacquer_pearl'),o.parent,o,.001)
 # The finger pocket is recessed 13 mm behind the cut, so it reads as an inset.
 box(o.name+'_v15_finger_pocket',(c-r-.004,hi.y+.012,hi.z-r*.6),(c+r+.004,hi.y+.018,hi.z-.001),mat('joinery_soft_recess'),o.parent,None,.001)


def ellipse_profile(o,levels,segments=80):
 lo,hi=bounds(o);c=(lo+hi)/2;rx=(hi.x-lo.x)/2;ry=(hi.y-lo.y)/2;vs=[];fs=[]
 for inset,z in levels:
  for i in range(segments):
   a=2*math.pi*i/segments;vs.append((c.x+(rx-inset)*math.cos(a),c.y+(ry-inset)*math.sin(a),z))
 for j in range(len(levels)-1):
  for i in range(segments):a=j*segments+i;b=j*segments+(i+1)%segments;fs.append((a,b,b+segments,a+segments))
 fs+=[tuple(reversed(range(segments))),tuple(range((len(levels)-1)*segments,len(levels)*segments))]
 out=ownmesh(o.name,vs,fs,o.data.materials[0],o.parent,o,0,True)
 for p in out.data.polygons[-2:]:p.use_smooth=False
 physical_uv(out,0)


def roundrect_top(o,radius=.07):
 lo,hi=bounds(o);vs=[];fs=[];N=48
 for inset,z in [(.006,lo.z),(.001,lo.z+.005),(0,hi.z-.005),(.005,hi.z)]:
  for cx,cy,start in [(hi.x-radius,hi.y-radius,0),(lo.x+radius,hi.y-radius,math.pi/2),(lo.x+radius,lo.y+radius,math.pi),(hi.x-radius,lo.y+radius,3*math.pi/2)]:
   for k in range(12):
    a=start+k*math.pi/22;vs.append((cx+(radius-inset)*math.cos(a),cy+(radius-inset)*math.sin(a),z))
 for j in range(3):
  for i in range(N):a=j*N+i;b=j*N+(i+1)%N;fs.append((a,b,b+N,a+N))
 fs+=[tuple(reversed(range(N))),tuple(range(N*3,N*4))]
 out=ownmesh(o.name,vs,fs,o.data.materials[0],o.parent,o,0,True)
 for f in out.data.polygons[-2:]:f.use_smooth=False
 physical_uv(out,0)
 REPORT['changes'].append({'object':o.name,'construction':'70 mm plan corner radius and separate 5 mm underside/top edge easing; original top height preserved'})


def trim_support_bottom(o,z):
 """Trim the support only at a horizontal contact plane; upper shaft unchanged."""
 me=o.data.copy();bm=bmesh.new();bm.from_mesh(me);bmesh.ops.transform(bm,matrix=o.matrix_local,verts=list(bm.verts));bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=1e-7)
 bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=1e-7,plane_co=(0,0,z),plane_no=(0,0,1),clear_inner=True,clear_outer=False)
 cut=[e for e in bm.edges if e.is_boundary and all(abs(v.co.z-z)<1e-5 for v in e.verts)]
 filled=bmesh.ops.holes_fill(bm,edges=cut,sides=0)
 for f in filled.get('faces',[]):f.smooth=False
 bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(me);bm.free();o.data=me;o.matrix_local=Matrix.Identity(4);me.update();physical_uv(o)
 o['furnitureV15']='Existing support trimmed to measured contact plane; upper shaft and cabinet unchanged';REPORT['replaced'].append(o.name)
 REPORT['changes'].append({'object':o.name,'construction':'Lower support trimmed and capped at measured rug contact; top/shaft/cabinet placement unchanged','bottomZ':z})


def apply_furniture_v15():
 # Wardrobe: true carcass and inset painted doors; repair former 25 mm overlap
 # between the bottom drawers and full-height doors while retaining footprint.
 shell(ob('F18_wardrobe__wood_oak_part_001'),1,-1,.022,.024,.027)
 for idx in [1,2]:
  o=ob(f'F18_wardrobe__ceramic_ivory_part_{idx:03d}');lo,hi=bounds(o);lo.z=3.411;lo.y=3.170;hi.y=3.195;lo.x=3.035 if idx==1 else 3.8815;hi.x=3.8785 if idx==1 else 4.725
  frame_door(o,lo,hi,1,-1,.055,.006)
 for idx in [0,1]:erase(ob(f'F18_wardrobe__lacquer_pearl_part_{idx:03d}'))
 for idx in [0,3]:
  o=ob(f'F18_wardrobe__ceramic_ivory_part_{idx:03d}');lo,hi=bounds(o);hi.z=3.405;lo.x=3.035 if idx==0 else 3.8815;hi.x=3.8785 if idx==0 else 4.725;box(o.name,lo,hi,mat('lacquer_pearl'),o.parent,o,.0013)
 REPORT['changes'].append({'object':'wardrobe_and_credenza_fronts','construction':'3 mm central reveals between leaves/drawer fronts, within unchanged carcass envelope'})
 face_frame('F18_wardrobe__wood_oak_part_001',[f'F18_wardrobe__ceramic_ivory_part_{i:03d}' for i in range(4)])
 # Existing handles gain two physically attached posts instead of floating rods.
 for name in ['F18_wardrobe__metal_champagne_part_000','F18_wardrobe__metal_champagne_part_002']:
  o=ob(name);lo,hi=bounds(o);cx=(lo.x+hi.x)/2
  for i,z in enumerate([lo.z+.034,hi.z-.034]):cylinder(name+'_v15_mount_'+str(i),(cx,hi.y-.001,z),(cx,3.179,z),.0048,mat('metal_champagne'),o.parent,n=12)
 # Desk carcasses and six functional finger cutouts.
 for name in ['desk_pedestal','desk_pedestal.001']:
  o=ob(name);lo,hi=shell(o,1,-1,.018,.018,.006)
  for i,(x,y) in enumerate([(lo.x+.03,lo.y+.04),(lo.x+.03,hi.y-.04),(hi.x-.03,lo.y+.04),(hi.x-.03,hi.y-.04)]):
   cylinder(name+'_v15_leveling_glide_'+str(i),(x,y,.015),(x,y,.052),.012,mat('polymer_graphite_abs'),o.parent,n=12)
 drawers=sorted([o for o in bpy.data.objects if o.name.startswith('desk_drawer')],key=lambda o:o.name)
 for i,o in enumerate(drawers):
  lo,hi=bounds(o);j=i%3;step=(.774-.061-.006)/3+.003;lo.z=.061+j*step;hi.z=lo.z+step-.003;cx=(lo.x+hi.x)*.5;lo.x=cx-.154;hi.x=cx+.154;notch_drawer(o,lo,hi)
 for o in list(bpy.data.objects):
  if o.name.startswith('desk_recess_pull'):erase(o)
 roundrect_top(ob('desktop_oak'),.065)
 REPORT['changes'].append({'object':'desk_drawers','construction':'Six real semicircular finger cutouts with recessed pockets; 3 mm vertical reveals; 18 mm carcasses'})
 # TV cabinet and nightstands use real panel construction and fine front gaps.
 shell(ob('tv_oak_cabinet'),1,-1,.022,.024)
 for name in ['nightstand','nightstand.001']:shell(ob(name),1,1,.018,.022)
 for i in range(4):
  name='bedside_drawer'+('' if i==0 else f'.{i:03d}');o=ob(name);lo,hi=bounds(o);j=i%2;step=(3.750-3.190-.003)/2+.003;lo.z=3.190+j*step;hi.z=lo.z+step-.003;cx=(lo.x+hi.x)*.5;lo.x=cx-.279;hi.x=cx+.279
  box(o.name,lo,hi,mat('lacquer_pearl'),o.parent,o,.0012)
 # Three inset oak dividers visible in credenza reveals, plus supported handles.
 p=ob('F04_tv_cabinet')
 for i,x in enumerate([-.79,-.01]):box('tv_v15_internal_divider_'+str(i),(x-.009,-.493,.089),(x+.009,-.112,.671),mat('wood_oak_satin_furniture'),p,None,.0009)
 for i,o in enumerate(sorted([o for o in bpy.data.objects if o.name.startswith('credenza_front')],key=lambda o:o.name)):
  lo,hi=bounds(o);width=(2.400-.006)/3;lo.x=-1.600+i*(width+.003);hi.x=lo.x+width;lo.z=.092;hi.z=.668;box(o.name,lo,hi,mat('lacquer_pearl'),o.parent,o,.0012)
 for o in [o for o in bpy.data.objects if o.name.startswith('credenza_pull')]:
  lo,hi=bounds(o);z=(lo.z+hi.z)/2
  for i,x in enumerate([lo.x+.025,hi.x-.025]):cylinder(o.name+'_v15_mount_'+str(i),(x,lo.y+.004,z),(x,-.537,z),.0035,mat('metal_champagne'),o.parent,n=12)
 # Kitchen fronts: slim Shaker frames, true cabinet depth and attached handles.
 # Leave oven/front overlaps on legacy doors 2/3 alone; only doors 0/1 framed.
 shell(ob('kitchen_base'),0,1,.018,.020)
 o=ob('F14_kitchen__ceramic_ivory_part_005');lo,hi=shell(o,1,-1,.018,.020)
 for i,(x,y) in enumerate([(lo.x+.065,lo.y+.070),(lo.x+.065,hi.y-.070),(hi.x-.065,lo.y+.070),(hi.x-.065,hi.y-.070)]):
  cylinder('kitchen_return_v15_leveling_foot_'+str(i),(x,y,.015),(x,y,.085),.017,mat('polymer_graphite_abs'),o.parent,n=12)
 for name in ['F14_kitchen__lacquer_pearl_part_009','F14_kitchen__lacquer_pearl_part_010']:
  o=ob(name);lo,hi=bounds(o);frame_door(o,lo,hi,1,-1,.038,.004)
 for o in [o for o in bpy.data.objects if o.name in ['cabinet_door','cabinet_door.001']]:
  lo,hi=bounds(o);frame_door(o,lo,hi,0,1,.042,.004)
 for o in [o for o in bpy.data.objects if o.name.startswith('upper_cabinet')]:shell(o,0,1,.018,.018)
 for o in [o for o in bpy.data.objects if o.name.startswith('upper_door')]:
  lo,hi=bounds(o);frame_door(o,lo,hi,0,1,.037,.004)
 for o in [o for o in bpy.data.objects if o.name.startswith('cabinet_handle')]:
  lo,hi=bounds(o);z=(lo.z+hi.z)/2
  for i,y in enumerate([lo.y+.023,hi.y-.023]):cylinder(o.name+'_v15_mount_'+str(i),(lo.x+.004,y,z),(-4.154,y,z),.0035,mat('metal_champagne'),o.parent,n=12)
 face_frame('kitchen_base',['cabinet_door','cabinet_door.001','cabinet_door.002','cabinet_door.003'])
 face_frame('F14_kitchen__ceramic_ivory_part_005',['F14_kitchen__lacquer_pearl_part_009','F14_kitchen__lacquer_pearl_part_010'])
 for i in range(3):
  suffix='' if i==0 else f'.{i:03d}'
  face_frame('upper_cabinet'+suffix,['upper_door'+suffix])
 # Coffee and dining tabletops have a thinner, believable undercut edge while
 # retaining their authored top surfaces and all objects placed on them.
 o=ob('oval_oak_top');lo,hi=bounds(o);ellipse_profile(o,[(.015,hi.z-.043),(.002,hi.z-.036),(0,hi.z-.007),(.006,hi.z)])
 for i,(x,y) in enumerate([(-.97,1.20),(-.02,1.20),(-.50,.72)]):box('coffee_v15_leg_mount_'+str(i),(x-.065,y-.064,.398),(x+.065,y+.064,.438),mat('wood_honey_oiled_furniture'),o.parent,None,.003)
 box('coffee_v15_underrail',(-1.01,1.167,.404),(.025,1.233,.438),mat('wood_honey_oiled_furniture'),o.parent,None,.002)
 o=ob('dining_oak_top');lo,hi=bounds(o);ellipse_profile(o,[(.034,lo.z),(.007,hi.z-.030),(0,hi.z-.008),(.005,hi.z)])
 REPORT['changes'].append({'object':'coffee_and_dining_tops','construction':'Profiled solid-wood edges with real undercut, coffee-leg mounting blocks and rail, top heights preserved'})
 # Dining-chair rails connect the four legs and both back stays into the seat.
 for i,name in enumerate(['dining_seat','dining_seat.001','dining_seat.002','dining_seat.003']):
  o=ob(name);lo,hi=bounds(o);a=lo+Vector((.027,.027,0));b=hi-Vector((.027,.027,0));z0,z1=.383,.428
  for j,(al,ah) in enumerate([((a.x,a.y,z0),(a.x+.026,b.y,z1)),((b.x-.026,a.y,z0),(b.x,b.y,z1)),((a.x+.026,a.y,z0),(b.x-.026,a.y+.026,z1)),((a.x+.026,b.y-.026,z0),(b.x-.026,b.y,z1))]):
   box(f'dining_v15_seat_rail_{i}_{j}',al,ah,mat('wood_honey_oiled_furniture'),o.parent,None,.002)
 REPORT['changes'].append({'object':'dining_chairs','construction':'Four joined timber seat-apron rails on each chair, connected to legs and back stays'})
 # Chair mechanism and true twin-wheel casters: replace high-poly ellipsoids
 # and distorted legacy radial spokes with low-poly continuous hardware.
 p=ob('F11_computer_chair');center=Vector((3.5,-1.02,0));warm=mat('polymer_warm_abs');dark=mat('polymer_graphite_abs');metal=mat('metal_champagne')
 castors=sorted([o for o in bpy.data.objects if o.name.startswith('chair_castor')],key=lambda o:o.name)
 for i,o in enumerate(castors):
  lo,hi=bounds(o);c=(lo+hi)/2;rad=Vector((c.x-center.x,c.y-center.y,0)).normalized();axis=Vector((-rad.y,rad.x,0));r=.049;floor_z=.014 if i==1 else .0475;c.z=floor_z+.001+r
  a=c-axis*.034;b=c-axis*.008;cylinder(o.name,a,b,r,dark,p,o,n=20)
  cylinder('chair_v15_caster_outer_'+str(i),c+axis*.008,c+axis*.034,r,dark,p,n=20)
  cylinder('chair_v15_caster_axle_'+str(i),c-axis*.013,c+axis*.013,.020,warm,p,n=12)
  cylinder('chair_v15_caster_pin_'+str(i),(c.x,c.y,c.z+.005),(c.x,c.y,.146),.010,dark,p,n=12)
  # Tapered cast-metal spoke with supported caster pin.
  spoke=ob('chair_star'+('' if i==0 else f'.{i:03d}'))
  a=center+rad*.045+Vector((0,0,.188));b=Vector((c.x,c.y,.140))
  cylinder(spoke.name,a,b,.024,warm,p,spoke,n=12,r2=.020)
 cylinder('chair_hydraulic',(3.5,-1.02,.160),(3.5,-1.02,.365),.050,dark,p,ob('chair_hydraulic'),n=20)
 cylinder('chair_v15_polished_piston',(3.5,-1.02,.355),(3.5,-1.02,.460),.022,metal,p,n=20)
 # Swiveling parts remain under the existing animation pivot.
 a=ob('anim_chair_swivel')
 box('chair_v15_tilt_housing',(-.12,-.14,-.066),(.12,.13,-.011),dark,a,None,.005)
 cylinder('chair_v15_adjust_lever',(.09,-.09,-.034),(.263,-.10,-.035),.006,metal,a,n=12)
 box('chair_v15_lever_grip',(.236,-.125,-.052),(.300,-.075,-.018),dark,a,None,.008)
 for sx in [-1,1]:
  box('chair_v15_arm_attachment_'+str(sx),(min(sx*.275,sx*.377),-.044,-.002),(max(sx*.275,sx*.377),.044,.061),warm,a,None,.003)
 # Back-to-seat bracket behind the existing upholstery and within its envelope.
 box('chair_v15_back_bracket',(-.072,.214,-.015),(.072,.254,.17),warm,a,None,.006)
 REPORT['changes'].append({'object':'computer_chair','construction':'Five twin-wheel casters, continuous tapered spokes, gas-lift collar and piston, tilt housing, lever, arm/back brackets; swivel pivot unchanged'})
 # Remove old faux hairline overlays now superseded by actual carcass joints.
 for o in list(bpy.data.objects):
  if o.name.startswith(('tv_oak_cabinet_panel_joint_','nightstand_panel_joint_','nightstand.001_panel_joint_')):erase(o)
 # Final exact-source support audit: retain cabinet height, fit only the feet.
 for name in ['credenza_leg','credenza_leg.001']:trim_support_bottom(ob(name),.063)
 o=ob('kitchen_plinth');lo,hi=bounds(o);lo.z=.015;box(o.name,lo,hi,o.data.materials[0],o.parent,o,.004)
 REPORT['changes'].append({'object':'kitchen_plinth','construction':'Flat plinth bottom fitted to measured wood floor plus1 mm; top remains0.105 m','bottomZ':.015,'topZ':.105})
 bpy.context.view_layer.update()
 return REPORT
