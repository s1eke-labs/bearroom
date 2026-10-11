"""Reference-led panoramic PC reconstruction with one approved display artwork.
Rebuilds F09 children in place from the frozen v15 source. All non-PC data and
protected controls remain unchanged. Geometry is authored as layered real parts;
static export batching is allowed, semantic RGB/rotor/display nodes are not.
"""
import bpy,bmesh,math,json,hashlib,sys
from mathutils import Vector,Matrix
from pathlib import Path
P=Path(__file__).resolve().parent
BASE_SHA='933b691d355f80b4f660aaf6539f52a1bc298858ce8e3ff2f1de5c46384279b1'
PI=math.pi
ROOT=None
CREATED=[]
M={}

def linear(h):
 return tuple((v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4) for v in [int(h[i:i+2],16)/255 for i in (0,2,4)])
def material(name,color,rough=.35,metal=0,emission=0,alpha=1):
 m=bpy.data.materials.get(name) or bpy.data.materials.new(name);m.use_nodes=True;nt=m.node_tree;nt.nodes.clear();p=nt.nodes.new('ShaderNodeBsdfPrincipled');out=nt.nodes.new('ShaderNodeOutputMaterial');nt.links.new(p.outputs[0],out.inputs[0]);rgb=linear(color);m.diffuse_color=(*rgb,alpha);p.inputs['Base Color'].default_value=(*rgb,1);p.inputs['Alpha'].default_value=alpha;p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 if emission:p.inputs['Emission Color'].default_value=(*rgb,1);p.inputs['Emission Strength'].default_value=emission
 if alpha<1:m.surface_render_method='DITHERED';m.use_transparency_overlap=False;p.inputs['IOR'].default_value=1.45
 else:p.inputs['Coat Weight'].default_value=.18;p.inputs['Coat Roughness'].default_value=.26
 m['pcCaseV16']=True;return m

def mesh(name,vs,fs,mat,parent=None,bevel=0,smooth=False):
 me=bpy.data.meshes.new(name+'_mesh');me.from_pydata(vs,[],fs);me.update();bm=bmesh.new();bm.from_mesh(me);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(me);bm.free();me.materials.append(mat)
 o=bpy.data.objects.new(name,me);bpy.context.scene.collection.objects.link(o);o.parent=parent or ROOT;o['pcCaseV16']=True;CREATED.append(o)
 if parent and parent.name.startswith('pc16_rotor_'):o['noShadowCaster']=True
 for p in me.polygons:p.use_smooth=smooth
 uv=me.uv_layers.new(name='UVMap')
 for p in me.polygons:
  drop=max(range(3),key=lambda k:abs(p.normal[k]));axes=[i for i in range(3) if i!=drop]
  for li in p.loop_indices:
   co=me.vertices[me.loops[li].vertex_index].co;uv.data[li].uv=(co[axes[0]]/.12,co[axes[1]]/.12)
 if bevel:
  mod=o.modifiers.new('Manufactured edge radius','BEVEL');mod.width=bevel;mod.segments=2;mod.affect='EDGES';mod.harden_normals=True
  wn=o.modifiers.new('Weighted face normals','WEIGHTED_NORMAL');wn.keep_sharp=True
 return o

def box(name,c,d,mat,bevel=.001,parent=None):
 c=Vector(c);d=Vector(d)*.5;vs=[tuple(c+Vector((x*d.x,y*d.y,z*d.z))) for x in [-1,1] for y in [-1,1] for z in [-1,1]]
 return mesh(name,vs,[(0,2,6,4),(1,5,7,3),(0,4,5,1),(2,3,7,6),(0,1,3,2),(4,6,7,5)],mat,parent,bevel)

def extrude(name,xy,z0,z1,mat,bevel=.001):
 n=len(xy);vs=[(x,y,z) for z in [z0,z1] for x,y in xy];fs=[tuple(reversed(range(n))),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)];return mesh(name,vs,fs,mat,bevel=bevel)
def cylinder(name,center,normal,r,depth,mat,n=24,parent=None,r2=None):
 c=Vector(center);w=Vector(normal).normalized();u=w.cross(Vector((0,0,1)))
 if u.length<.1:u=w.cross(Vector((0,1,0)))
 u.normalize();v=w.cross(u);r2=r if r2 is None else r2
 vs=[tuple(c+w*z+(u*math.cos(2*PI*i/n)+v*math.sin(2*PI*i/n))*rad) for z,rad in [(-depth*.5,r),(depth*.5,r2)] for i in range(n)];fs=[tuple(reversed(range(n))),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)];o=mesh(name,vs,fs,mat,parent,smooth=True)
 for f in o.data.polygons[:2]:f.use_smooth=False
 return o

def ring(name,c,u,v,r,t,depth,mat,parent=None,n=40):
 c,u,v=Vector(c),Vector(u),Vector(v);w=u.cross(v).normalized();vs=[]
 for z,rad in [(-depth/2,r-t/2),(-depth/2,r+t/2),(depth/2,r-t/2),(depth/2,r+t/2)]:
  vs.extend(tuple(c+w*z+(u*math.cos(2*PI*i/n)+v*math.sin(2*PI*i/n))*rad) for i in range(n))
 fs=[]
 for i in range(n):
  j=(i+1)%n;fs.extend([(i,j,j+n,i+n),(i+2*n,i+3*n,j+3*n,j+2*n),(i,i+2*n,j+2*n,j),(i+n,j+n,j+3*n,i+3*n)])
 return mesh(name,vs,fs,mat,parent,smooth=True)

def tube(name,points,r,mat,n=8):
 pts=[Vector(p) for p in points];vs=[]
 for j,c in enumerate(pts):
  w=(pts[min(j+1,len(pts)-1)]-pts[max(j-1,0)]).normalized();u=w.cross(Vector((0,0,1)))
  if u.length<.05:u=w.cross(Vector((0,1,0)))
  u.normalize();v=w.cross(u)
  for i in range(n):vs.append(tuple(c+(u*math.cos(i*2*PI/n)+v*math.sin(i*2*PI/n))*r))
 fs=[tuple(reversed(range(n))),tuple(range((len(pts)-1)*n,len(pts)*n))]
 for j in range(len(pts)-1):
  for i in range(n):a=j*n+i;b=j*n+(i+1)%n;fs.append((a,b,b+n,a+n))
 return mesh(name,vs,fs,mat,smooth=True)

def bezier_points(points,n=20):
 # Piecewise Catmull-Rom interpolation preserves intentional cable waypoints.
 p=[Vector(points[0])]+[Vector(x) for x in points]+[Vector(points[-1])];out=[]
 for i in range(1,len(p)-2):
  a,b,c,d=p[i-1:i+3]
  for j in range(n):
   t=j/n;out.append(.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t))
 out.append(p[-2]);return out

def planar_box(name,c,u,v,width,height,depth,mat,bevel=.001):
 c,u,v=Vector(c),Vector(u),Vector(v);w=u.cross(v).normalized();vs=[tuple(c+u*x*width/2+v*y*height/2+w*z*depth/2) for x in [-1,1] for y in [-1,1] for z in [-1,1]]
 return mesh(name,vs,[(0,2,6,4),(1,5,7,3),(0,4,5,1),(2,3,7,6),(0,1,3,2),(4,6,7,5)],mat,bevel=bevel)

def fan(name,c,u,v,size,led=None,speed=3.6,frame=True):
 c,u,v=Vector(c),Vector(u),Vector(v);w=u.cross(v).normalized();r=size*.39
 if frame:
  # Four separated arms and broad radial surround enclose a genuinely open fan.
  for sign in [-1,1]:
   planar_box('pc16_'+name+'_frame_h'+str(sign),c+v*sign*size*.455,u,v,size,size*.09,.013,M['white'],.0015)
   planar_box('pc16_'+name+'_frame_v'+str(sign),c+u*sign*size*.455,u,v,size*.09,size*.82,.013,M['white'],.0015)
  ring('pc16_'+name+'_housing',c,u,v,size*.415,size*.08,.015,M['white'],n=32)
  for i in [-1,1]:
   for j in [-1,1]:cylinder('pc16_'+name+'_screw'+str(i)+str(j),c+(u*i+v*j)*size*.406+w*.009,w,size*.018,.002,M['silver'],n=8)
 if led:
  o=ring('pc16_rgb_'+name,c+w*.009,u,v,r,size*.048,.004,M[led],n=40);o['pcRgbGroup']=led;o['pcRgbPhase']={'rgb_side':0,'rgb_top':.23,'rgb_rear':.48,'rgb_trim':.7}.get(led,0);o['pcNoBatch']=True
 rotor=bpy.data.objects.new('pc16_rotor_'+name,None);bpy.context.scene.collection.objects.link(rotor);rotor.parent=ROOT;rotor.location=c;rotor['pcCaseV16']=True;rotor['pcSpinAxis']=['x','z','y'][max(range(3),key=lambda i:abs(w[i]))];rotor['pcSpinSpeed']=speed;rotor['pcFanRadius']=r;CREATED.append(rotor)
 # Seven swept, pitched blades: actual 3D profile with rounded radial silhouette.
 vs=[];fs=[]
 blade=[(.16,-.05),(.37,-.16),(.71,-.15),(.91,.05),(.91,.25),(.72,.41),(.48,.38),(.21,.14)]
 for j in range(7):
  a=j*2*PI/7;start=len(vs)
  for z in [-.0012,.0012]:
   for x,y in blade:
    xx=x*math.cos(a)-y*math.sin(a);yy=x*math.sin(a)+y*math.cos(a);vs.append(tuple(u*xx*r+v*yy*r+w*(z+.004*(x-.3))))
  n=len(blade);fs.extend([tuple(start+i for i in reversed(range(n))),tuple(start+n+i for i in range(n))]);fs.extend((start+i,start+(i+1)%n,start+(i+1)%n+n,start+i+n) for i in range(n))
 o=mesh('pc16_rotor_'+name+'_blades',vs,fs,M['blade'],rotor,smooth=False);o['pcNoBatch']=True
 cylinder('pc16_rotor_'+name+'_hub',(0,0,.0),w,r*.24,.012,M['white'],n=24,parent=rotor)
 cylinder('pc16_rotor_'+name+'_cap',w*.008,w,r*.155,.002,M['silver'],n=20,parent=rotor)
 return rotor

def apply_pc_reference_v16():
 global ROOT,CREATED,M
 ROOT=bpy.data.objects['F09_computer'];CREATED=[]
 protected={o.name:(o.matrix_local.copy(),dict(o.items())) for o in ROOT.children_recursive if 'animationAxis' in o}
 old=[o.name for o in ROOT.children_recursive if o.name not in protected]
 for o in list(ROOT.children_recursive):
  if o.name not in protected:
   data=o.data;bpy.data.objects.remove(o,do_unlink=True)
   if data and data.users==0:
    if isinstance(data,bpy.types.Mesh):bpy.data.meshes.remove(data)
    elif isinstance(data,bpy.types.Curve):bpy.data.curves.remove(data)
 for m in list(bpy.data.materials):
  if m.name.startswith('pc16_') and m.users==0:bpy.data.materials.remove(m)
 M={'pink':material('pc16_powdercoat_blush','EDB6C5',.37,.08),'pinkdark':material('pc16_edge_rose','CB8B9C',.43,.12),'white':material('pc16_white_components','F0F2F1',.3,.08),'blade':material('pc16_frosted_fan_blade','E4EBEF',.46,.02),'silver':material('pc16_brushed_aluminium','BBC5CD',.36,.68),'board':material('pc16_pcb_ivory','D5DCDF',.65,.08),'dark':material('pc16_connector_graphite','343B46',.56,.12),'glass':material('pc16_glass_low_iron','CED9E1',.08,0,alpha=.075),'rgb_side':material('pc16_rgb_side','B6DFFF',.22,emission=1.7),'rgb_top':material('pc16_rgb_top','DDC9FF',.22,emission=1.7),'rgb_rear':material('pc16_rgb_rear','F0C3FF',.22,emission=1.7),'rgb_trim':material('pc16_rgb_trim','AFBFFF',.25,emission=1.3),'display':material('pc16_display','A299D8',.3,emission=.8)}
 for name in ['rgb_side','rgb_top','rgb_rear','rgb_trim']:M[name]['pcRgbGroup']=name
 # 430 x 340 mm reference-proportioned case inside the original footprint; feet reach the actual desktop at z .8425.
 xy=[(4.125,-.04),(4.449,-.04),(4.555,.066),(4.555,.30),(4.125,.30)]
 inset=[(4.133,-.032),(4.446,-.032),(4.547,.069),(4.547,.292),(4.133,.292)]
 extrude('pc16_chassis_base',xy,.881,.921,M['pink'],.003)
 extrude('pc16_chassis_lower_gasket',inset,.920,.924,M['pinkdark'],.0008)
 # A real central roof aperture with narrow ribs; no buried decorative slots.
 roof_panels=[[(4.125,-.04),(4.449,-.04),(4.555,.066),(4.555,.092),(4.125,.092)],[(4.125,.092),(4.164,.092),(4.164,.261),(4.125,.261)],[(4.511,.092),(4.555,.092),(4.555,.261),(4.511,.261)],[(4.125,.261),(4.555,.261),(4.555,.30),(4.125,.30)]]
 for i,outline in enumerate(roof_panels):
  extrude('pc16_chassis_roof_'+str(i),outline,1.437,1.4725,M['pink'],.002)
  extrude('pc16_chassis_roof_lower_gasket_'+str(i),outline,1.432,1.437,M['pinkdark'],.0006)
 for i in range(31):box('pc16_roof_intake_rib',(4.171+i*.011,.1765,1.468),(.006,.169,.009),M['pink'],.0007)
 for x in [4.164,4.505]:
  for y in [.013,.251]:box('pc16_rubber_foot',(x,y,.86275),(.056,.06,.0405),M['dark'],.004)
 # Rear opaque powder-coated cable compartment; left/rear framing has real depth.
 box('pc16_rear_chassis',(4.34,.289,1.177),(.409,.018,.510),M['pink'],.002)
 box('pc16_left_chassis',(4.137,.167,1.177),(.018,.239,.510),M['pink'],.002)
 for c,d in [((4.14,-.025,1.179),(.021,.018,.51)),((4.542,.283,1.179),(.016,.022,.51))]:box('pc16_structural_post',c,d,M['pink'],.0015)
 # Chamfered vertical display pillar with actual four-sided extrusion.
 chamfer=[(4.445,-.035),(4.552,.072),(4.537,.085),(4.432,-.020)]
 extrude('pc16_chamfer_display_pillar',chamfer,.919,1.440,M['pink'],.0016)
 U=Vector((1,1,0)).normalized();V=Vector((0,0,1));N=U.cross(V);C=Vector((4.501,.0185,1.185))
 planar_box('pc16_display_black_bezel',C+N*.003,U,V,.127,.469,.003,M['pinkdark'],.001)
 dc=C+N*.005;vs=[tuple(dc+U*x*.119/2+V*z*.454/2) for x,z in [(-1,-1),(1,-1),(1,1),(-1,1)]]
 display=mesh('screen_PC_case_v16',vs,[(0,1,2,3)],M['display']);uv=display.data.uv_layers.active
 for li,p in enumerate([(0,0),(1,0),(1,1),(0,1)]):uv.data[li].uv=p
 display['pcDisplay']=True;display['pcNoBatch']=True;display['pcDisplayAspect']=.119/.454;display['pcDisplayNormalBlender']=list(N);display['pcDisplayArtwork']='Original generated pastel city wallpaper, runtime overlays actual local clock; no case-reference photograph texture'
 art=P/'pc-v16-review/pc-case-v16.webp'
 assert art.exists(),'Approved display art missing'
 image=bpy.data.images.load(str(art),check_existing=True);image.pack();image.colorspace_settings.name='sRGB'
 nt=M['display'].node_tree;tex=nt.nodes.new('ShaderNodeTexImage');tex.name='PC16_Approved_Display_Artwork';tex.image=image;tex.extension='EXTEND';ps=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED')
 nt.links.new(tex.outputs['Color'],ps.inputs['Base Color']);nt.links.new(tex.outputs['Color'],ps.inputs['Emission Color']);ps.inputs['Emission Strength'].default_value=.8
 # Center crop matches the runtime portrait aspect rather than squashing art.
 uvnode=nt.nodes.new('ShaderNodeTexCoord');mapping=nt.nodes.new('ShaderNodeMapping');mapping.inputs['Scale'].default_value=(.7863436,1,1);mapping.inputs['Location'].default_value=(.1068282,0,0);nt.links.new(uvnode.outputs['UV'],mapping.inputs['Vector']);nt.links.new(mapping.outputs['Vector'],tex.inputs['Vector'])
 # Distinct transparent glass panes face the viewer, with edge strips and screws.
 front=mesh('pc_glass_front',[(4.153,-.031,.925),(4.436,-.031,.925),(4.436,-.031,1.430),(4.153,-.031,1.430)],[(0,1,2,3)],M['glass']);front.visible_shadow=False
 side=mesh('pc_glass_side_v16',[(4.546,.079,.925),(4.546,.273,.925),(4.546,.273,1.430),(4.546,.079,1.430)],[(0,1,2,3)],M['glass']);side.visible_shadow=False
 for x in [4.159,4.428]:
  for z in [.934,1.420]:cylinder('pc16_glass_front_screw',(x,-.033,z),(0,-1,0),.0033,.002,M['silver'],n=10)
 # Low-profile intake grate at base: open gaps between separate ribs.
 extrude('pc16_base_vent_shadow',[(4.151,-.016),(4.448,-.016),(4.517,.053),(4.517,.228),(4.151,.228)],.923,.927,M['dark'],0)
 for i in range(27):
  x=4.157+i*.0136;front=max(-.0105,x-4.469);back=.2185
  box('pc16_base_intake_rib',(x,(front+back)/2,.929),(.006,back-front,.005),M['pink'],.0005)
 # Main motherboard and stacked heatsinks, enough breathing room behind GPU.
 box('pc16_motherboard_pcb',(4.315,.377,1.205),(.238,.012,.343),M['board'],.002)
 box('pc16_socket_backplate',(4.304,.363,1.270),(.105,.012,.108),M['silver'],.002)
 for x,z,w,h in [(4.256,1.361,.11,.052),(4.221,1.291,.033,.091),(4.277,1.105,.157,.043)]:
  box('pc16_motherboard_armour',(x,.348,z),(w,.019,h),M['white'],.002)
  for i in range(5):box('pc16_armour_ridge',(x-w*.38+i*w*.185,.336,z),(.003,.003,h*.85),M['silver'],.0003)
 for x,z in [(4.213,1.066),(4.416,1.067),(4.215,1.355),(4.417,1.355)]:cylinder('pc16_board_mount',(x,.365,z),(0,-1,0),.0034,.003,M['silver'],n=10)
 # Memory sticks with separate fins and light bars.
 for j,x in enumerate([4.383,4.402]):
  box('pc16_memory_slot',(x,.355,1.278),(.012,.027,.116),M['dark'],.0008)
  box('pc16_memory_spreader',(x,.337,1.278),(.011,.014,.109),M['white'],.001)
  box('pc16_memory_rgb_bar',(x,.327,1.280),(.007,.003,.097),M['rgb_top'],.0005)
  for i in range(6):box('pc16_memory_accent',(x,.326,1.240+i*.014),(.01,.002,.003),M['pink'],.0003)
 # Actual pump block plus twin coolant hoses routed to the ceiling radiator.
 box('pc16_cpu_pump',(4.30,.306,1.277),(.079,.065,.080),M['white'],.009)
 cylinder('pc16_cpu_pump_face',(4.30,.271,1.277),(0,-1,0),.029,.006,M['silver'],n=32)
 ring('pc16_cpu_pump_glow',(4.30,.266,1.277),(1,0,0),(0,0,1),.024,.003,.002,M['rgb_rear'],n=32)
 cylinder('pc16_cpu_pump_center',(4.30,.264,1.277),(0,-1,0),.020,.003,M['pink'],n=24)
 for i in range(2):
  pts=[(4.335,.254,1.267+i*.027),(4.354,.215,1.235+i*.023),(4.305,.185,1.205+i*.023),(4.256,.192,1.245+i*.023),(4.250,.156,1.343+i*.016),(4.262+i*.025,.128,1.425)]
  tube('pc16_white_coolant_hose',bezier_points(pts,8),.0072,M['white'],n=10)
  cylinder('pc16_pump_hose_collar',pts[0],(1,0,0),.0095,.017,M['silver'],n=16)
 # Large horizontal white triple-fan GPU: real inset body, heatsink and mounting.
 box('pc16_gpu_heatsink',(4.285,.184,1.030),(.266,.098,.087),M['silver'],.0015)
 for i in range(24):box('pc16_gpu_heatsink_fin',(4.159+i*.011,.125,1.031),(.003,.014,.077),M['dark'],0)
 box('pc16_gpu_top_rail',(4.285,.116,1.078),(.280,.027,.012),M['white'],.002)
 box('pc16_gpu_lower_rail',(4.285,.116,.982),(.280,.027,.012),M['white'],.002)
 for x in [4.144,4.426]:box('pc16_gpu_endcap',(x,.152,1.030),(.013,.084,.105),M['white'],.002)
 for i,x in enumerate([4.194,4.284,4.374]):
  fan('gpu_%02d'%(i+1),(x,.110,1.030),(1,0,0),(0,0,1),.080,led=None,speed=2.5+i*.1,frame=False)
  ring('pc16_gpu_fan_recess',(x,.114,1.030),(1,0,0),(0,0,1),.0355,.007,.005,M['white'],n=32)
 box('pc16_gpu_support',(4.413,.190,.953),(.016,.025,.049),M['silver'],.001)
 box('pc16_gpu_pcie_riser',(4.300,.250,1.074),(.196,.016,.032),M['dark'],.001)
 # Reference's three vertically stacked side fans, two roof fans and one rear fan.
 for i,z in enumerate([1.009,1.184,1.359]):fan('side_%02d'%(i+1),(4.525,.263,z),(0,1,0),(0,0,1),.159,'rgb_side',3.5+i*.24)
 for i,x in enumerate([4.228,4.389]):fan('top_%02d'%(i+1),(x,.242,1.421),(1,0,0),(0,-1,0),.148,'rgb_top',3.9+i*.22)
 fan('rear_01',(4.200,.220,1.268),(1,0,0),(0,0,1),.119,'rgb_rear',3.75)
 # Rear grilles visible through the case, independently modeled negative spaces.
 for i in range(11):box('pc16_rear_exhaust_slot',(4.150+i*.0107,.414,1.267),(.004,.004,.155),M['pinkdark'],0)
 # Bundled sleeved white/pink leads curve into headers rather than float freely.
 for j in range(8):
  x=4.381+j*.006
  pts=[(x,.278,1.361),(x,.269,1.392),(x-.014,.225,1.394),(x-.025,.212,1.367)]
  tube('pc16_cpu_sleeved_cable',bezier_points(pts,5),.0024,M['pink'] if j%2==0 else M['white'],n=6)
 for j in range(8):
  pts=[(4.408+j*.0036,.255,1.216),(4.426+j*.0036,.223,1.200),(4.414+j*.0036,.200,1.154),(4.372+j*.004,.227,1.078)]
  tube('pc16_gpu_sleeved_cable',bezier_points(pts,5),.0023,M['pink'] if j%2==0 else M['white'],n=6)
 for z in [1.180,1.218]:box('pc16_cable_comb',(4.433,.222,z),(.049,.008,.008),M['white'],.0007)
 # Chamfer bottom I/O: power switch, USB-A, USB-C, audio jack.
 io=Vector((4.502,.013,.902))+N*.0007
 for k,dx in enumerate([-.044,-.021,.022,.043]):
  cc=io+U*dx
  planar_box('pc16_front_io_recess',cc,U,V,.008 if k!=1 else .005,.010 if k!=1 else .006,.001,M['dark'],.0003)
  if k in [0,2]:planar_box('pc16_usb_contact',cc+N*.001,U,V,.005,.002,.001,M['silver'],0)
 cylinder('pc16_power_button',io+N*.001,N,.007,.003,M['silver'],n=20)
 ring('pc16_rgb_power',io+N*.003,U,V,.0048,.0014,.001,M['rgb_trim'],n=20)
 o=tube('pc16_rgb_floor_strip',[(4.164,-.028,.926),(4.429,-.028,.926)],.0014,M['rgb_trim'],n=6);o['pcRgbGroup']='rgb_trim';o['pcNoBatch']=True

 # Reference case is shallower than the inherited tower. Shift component groups
 # without anisotropic scaling, retaining round fan apertures and GPU proportions.
 for o in CREATED:
  if o.parent != ROOT or o.name=='pc16_rear_chassis':continue
  name=o.name;dy=0
  if name.startswith(('pc16_rotor_top_','pc16_top_','pc16_rgb_top_')):dy=-.068
  elif name.startswith(('pc16_rotor_side_','pc16_side_','pc16_rgb_side_')):dy=-.083
  elif name.startswith(('pc16_rotor_rear_','pc16_rear_','pc16_rgb_rear_')):dy=-.14
  elif name.startswith(('pc16_rotor_gpu_','pc16_gpu_heatsink','pc16_gpu_top','pc16_gpu_lower','pc16_gpu_endcap','pc16_gpu_fan_recess','pc16_gpu_support')):dy=-.125
  elif name.startswith(('pc16_motherboard','pc16_socket','pc16_armour','pc16_board','pc16_memory','pc16_cpu','pc16_white_coolant','pc16_pump_hose','pc16_gpu_pcie','pc16_gpu_sleeved','pc16_cable_comb')):dy=-.14
  # Frontward component layers make real white geometry visible through glass.
  if name.startswith(('pc16_motherboard','pc16_socket','pc16_armour','pc16_board','pc16_memory')):dy=-.24
  elif name.startswith('pc16_cpu_pump'):dy=-.19
  if dy:
   if o.type=='MESH':
    for v in o.data.vertices:v.co.y+=dy
   else:o.location.y+=dy

 # Stable preserved controllers remain as the original furniture animation hooks.
 for name,(matrix,props) in protected.items():
  o=bpy.data.objects[name];assert max(abs(a-b) for row1,row2 in zip(o.matrix_local,matrix) for a,b in zip(row1,row2))==0;assert dict(o.items())==props
 bpy.context.view_layer.update()
 pts=[];dg=bpy.context.evaluated_depsgraph_get()
 for o in CREATED:
  if o.type=='MESH':
   eo=o.evaluated_get(dg);pts.extend(eo.matrix_world@Vector(v) for v in eo.bound_box)
 lo=[min(v[i] for v in pts) for i in range(3)];hi=[max(v[i] for v in pts) for i in range(3)]
 # Chamfer screen and tiny bolt heads remain within original safe case envelope.
 assert lo[0]>=4.124 and hi[0]<=4.556 and lo[1]>=-.174 and hi[1]<=.311 and lo[2]>=.8424 and hi[2]<=1.474,(lo,hi)
 return {'revision':'pc-v16','referenceImage':'image(20261008-105744).png','removedChildren':old,'createdObjects':len(CREATED),'createdMeshes':sum(o.type=='MESH' for o in CREATED),'runtimeRotors':[o.name for o in CREATED if o.type=='EMPTY'],'protectedAnimationControllers':list(protected),'worldBoundsBlenderXYZ':[lo,hi],'rootTransformUnchanged':True,'caseDepthRefinedMetres':.34,'originalDeskSafeDepthMetres':.48,'newImages':1,'displayArtwork':str(art),'displayArtworkSha256':hashlib.sha256(art.read_bytes()).hexdigest(),'display':{'node':display.name,'material':'pc16_display','dimensionsMetres':[.119,.454],'normalBlenderXYZ':list(N),'uv':'lower left (0,0), upper right (1,1)'},'rgbMaterials':['pc16_rgb_side','pc16_rgb_top','pc16_rgb_rear','pc16_rgb_trim'],'constructions':['beveled chamfered powdercoat shell','separate transparent front/side glass','portrait corner display','open fan frames and 3D pitched swept blades','triple-fan horizontal GPU and fin-stack','motherboard with socket, heatsinks, DIMM lightbars','twin cooling loops with fittings','curved individually sleeved white/pink leads','base vents, feet and front I/O'],'notes':['No third-party logo or entire-reference-photo texture.','No light objects added. Emissive materials and runtime animation only.','Source retains component editability; runtime may batch static parts by material.']}

if __name__=='__main__':
 args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [];src=P/'bearroom-furniture-v15.blend';dst=Path(args[0]).resolve() if args else P/'bearroom-pc-v16.blend'
 assert hashlib.sha256(src.read_bytes()).hexdigest()==BASE_SHA,'Baseline is not the frozen furniture v15'
 bpy.ops.wm.open_mainfile(filepath=str(src));pc=set(bpy.data.objects['F09_computer'].children_recursive)
 untouched={o.name:(o.as_pointer(),o.data.as_pointer() if o.data else None,tuple(x for row in o.matrix_local for x in row),o.parent.name if o.parent else None) for o in bpy.data.objects if o not in pc}
 report=apply_pc_reference_v16()
 assert all(n in bpy.data.objects and (bpy.data.objects[n].as_pointer(),bpy.data.objects[n].data.as_pointer() if bpy.data.objects[n].data else None,tuple(x for row in bpy.data.objects[n].matrix_local for x in row),bpy.data.objects[n].parent.name if bpy.data.objects[n].parent else None)==v for n,v in untouched.items()),'Non-PC object modified'
 report.update({'source':str(src),'sourceSha256':BASE_SHA,'output':str(dst),'untouchedNonPCObjects':len(untouched),'furnitureRoots':len([o for o in bpy.data.objects if 'furnitureId' in o]),'axisControllers':len([o for o in bpy.data.objects if 'animationAxis' in o]),'pianoKeys':len([o for o in bpy.data.objects if 'midi' in o])})
 bpy.ops.wm.save_as_mainfile(filepath=str(dst),compress=True);report['outputSha256']=hashlib.sha256(dst.read_bytes()).hexdigest();(P/'pc-v16-review').mkdir(exist_ok=True);(P/'pc-v16-review/build-report.json').write_text(json.dumps(report,indent=2));print('PC_V16_BUILT',json.dumps(report,indent=2))
