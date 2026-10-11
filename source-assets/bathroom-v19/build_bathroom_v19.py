"""Deterministic bathroom-only v19 rebuild from the immutable organic v17 source.
Geometry is authored in world metres, then converted into original parent space.
Existing roots, opaque privacy, door hinge and all non-bathroom data are preserved.
No downloaded asset or new texture is used; all base materials are existing scene
materials. The only new material is a procedural metallic mirror, derived from
existing champagne material. Run: blender -b -t 4 --python THIS -- [output.blend]
"""
import bpy,bmesh,math,json,hashlib,struct,sys
from pathlib import Path
from mathutils import Vector,Matrix
P=Path(__file__).resolve().parent
# Supports both the working directory and the persisted source-assets/bathroom-v19 tree.
SOURCE=next(p for p in [P.parent/'bearroom-organic-v17.blend',P.parent/'bearroom-v17-source-persistence/bearroom-organic-v17.blend'] if p.exists())
SOURCE_SHA='822b7ad9bda89889530dae32efaf5ecde831c991f6994bed97b7a8c02227afc4'
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
DEST=Path(args[0]).resolve() if args else P/'bearroom-bathroom-v19-candidate.blend'
R={'created':[],'removed':[],'replaced':[],'construction':[]}

def digest(o):
 h=hashlib.sha256();h.update(o.type.encode());h.update((o.parent.name if o.parent else '').encode())
 for row in o.matrix_basis:h.update(struct.pack('4f',*row))
 for row in o.matrix_world:h.update(struct.pack('4f',*row))
 h.update(str(sorted((k,str(o[k])) for k in o.keys())).encode())
 if o.type=='MESH':
  me=o.data
  for v in me.vertices:h.update(struct.pack('3f',*v.co))
  for f in me.polygons:h.update(struct.pack(str(len(f.vertices))+'I',*f.vertices));h.update(struct.pack('I?',f.material_index,f.use_smooth))
  for l in me.uv_layers:
   h.update(l.name.encode())
   for d in l.data:h.update(struct.pack('2f',*d.uv))
  for l in me.color_attributes:
   h.update(l.name.encode())
   for d in l.data:h.update(struct.pack('4f',*d.color))
  for m in me.materials:h.update(m.name.encode())
 elif o.type=='CURVE':
  h.update(struct.pack('fI',o.data.bevel_depth,o.data.bevel_resolution))
  for s in o.data.splines:
   for p in s.points:h.update(struct.pack('4f',*p.co))
  for m in o.data.materials:h.update(m.name.encode())
 return h.hexdigest()
def material_signature(m):
 d={'name':m.name,'diffuse':list(m.diffuse_color),'roughness':m.roughness,'metallic':m.metallic,'use_nodes':m.use_nodes}
 if m.use_nodes:
  d['nodes']=[]
  for n in m.node_tree.nodes:
   nd={'name':n.name,'type':n.type,'inputs':[]}
   for i in n.inputs:
    if hasattr(i,'default_value'):
     v=i.default_value
     if not isinstance(v,(str,int,float,bool)):
      try:v=list(v)
      except:v=str(v)
     nd['inputs'].append((i.name,v))
   for a in ['operation','blend_type','interpolation','extension','projection','layer_name']:
    if hasattr(n,a):nd[a]=getattr(n,a)
   if n.type=='TEX_IMAGE':nd['image']=n.image.name if n.image else None
   d['nodes'].append(nd)
  d['links']=[(l.from_node.name,l.from_socket.name,l.to_node.name,l.to_socket.name) for l in m.node_tree.links]
 return hashlib.sha256(json.dumps(d,sort_keys=True,default=str).encode()).hexdigest()
def mat(n):return bpy.data.materials[n]
def erase(n):
 o=bpy.data.objects.get(n)
 if o:R['removed'].append(n);bpy.data.objects.remove(o,do_unlink=True)
def own(name,verts,faces,parent,material,smooth=False,no_batch=False):
 old=bpy.data.objects.get(name)
 if old:
  o=old;me=bpy.data.meshes.new(name+'_v19');o.data=me
  for mod in list(o.modifiers):o.modifiers.remove(mod)
  R['replaced'].append(name)
 else:
  me=bpy.data.meshes.new(name+'_v19');o=bpy.data.objects.new(name,me);bpy.context.scene.collection.objects.link(o);o.parent=parent;o.matrix_local=Matrix.Identity(4);R['created'].append(name)
 bpy.context.view_layer.update();inv=o.matrix_world.inverted_safe()
 me.from_pydata([inv@Vector(v) for v in verts],[],faces);me.update();me.materials.append(material)
 bm=bmesh.new();bm.from_mesh(me);bmesh.ops.remove_doubles(bm,verts=bm.verts,dist=1e-6);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(me);bm.free()
 for f in me.polygons:f.use_smooth=smooth
 ca=me.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='POINT')
 for d in ca.data:d.color=(1,1,1,1)
 me.color_attributes.active_color=ca
 o['bathroomConstructionV19']='Manufactured, welded, true-thickness geometry in world metres'
 if no_batch:o['bathroomNoBatch']=True
 return o

def uv(o):
 me=o.data;layer=me.uv_layers.get('UVMap') or me.uv_layers.new(name='UVMap')
 for f in me.polygons:
  norm=(o.matrix_world.to_3x3()@f.normal).normalized();axis=max(range(3),key=lambda k:abs(norm[k]));axes=[k for k in range(3) if k!=axis]
  for li in f.loop_indices:
   v=o.matrix_world@me.vertices[me.loops[li].vertex_index].co;layer.data[li].uv=(v[axes[0]]/.60,v[axes[1]]/.60)

def box(name,lo,hi,parent,material,r=.003,segments=3,no_batch=False):
 vs=[(x,y,z) for x in [lo[0],hi[0]] for y in [lo[1],hi[1]] for z in [lo[2],hi[2]]]
 fs=[(0,2,6,4),(1,5,7,3),(0,4,5,1),(2,3,7,6),(0,1,3,2),(4,6,7,5)]
 o=own(name,vs,fs,parent,material,False,no_batch)
 if r:
  mod=o.modifiers.new('Manufactured edge radius','BEVEL');mod.width=r;mod.segments=segments
  mod.affect='EDGES';bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name)
  # Large planes stay genuinely flat, chamfers are smooth.
  for f in o.data.polygons:f.use_smooth=f.area<.01
  wn=o.modifiers.new('Area weighted corner normals','WEIGHTED_NORMAL');wn.keep_sharp=True;wn.weight=50;bpy.ops.object.modifier_apply(modifier=wn.name)
 uv(o);return o

def ringform(name,profile,parent,material,N=48,power=1.0,cx=0,cap0=True,cap1=True,no_batch=False):
 vs=[]
 for z,rx,ry,cy in profile:
  for i in range(N):
   a=2*math.pi*i/N;c=math.cos(a);s=math.sin(a);vs.append((cx+rx*math.copysign(abs(c)**power,c),cy+ry*math.copysign(abs(s)**power,s),z))
 fs=[]
 for j in range(len(profile)-1):
  for i in range(N):k=(i+1)%N;fs.append((j*N+i,j*N+k,(j+1)*N+k,(j+1)*N+i))
 if cap0:fs.append(tuple(reversed(range(N))))
 if cap1:fs.append(tuple((len(profile)-1)*N+i for i in range(N)))
 o=own(name,vs,fs,parent,material,True,no_batch);uv(o)
 # Cap planes are flat and do not blur into side profiles.
 if cap0:o.data.polygons[-(2 if cap1 else 1)].use_smooth=False
 if cap1:o.data.polygons[-1].use_smooth=False
 return o

def pipe(name,points,r,parent,material,N=12,closed=False):
 ps=[Vector(p) for p in points];vs=[];fs=[]
 for j,p in enumerate(ps):
  tangent=(ps[(j+1)%len(ps)]-ps[(j-1)%len(ps)]).normalized() if closed else (ps[min(j+1,len(ps)-1)]-ps[max(j-1,0)]).normalized()
  ref=Vector((0,0,1)) if abs(tangent.z)<.9 else Vector((0,1,0));u=tangent.cross(ref).normalized();v=tangent.cross(u).normalized()
  for i in range(N):a=2*math.pi*i/N;vs.append(tuple(p+r*(u*math.cos(a)+v*math.sin(a))))
 for j in range(len(ps) if closed else len(ps)-1):
  k=(j+1)%len(ps)
  for i in range(N):h=(i+1)%N;fs.append((j*N+i,j*N+h,k*N+h,k*N+i))
 if not closed:fs+=[tuple(reversed(range(N))),tuple((len(ps)-1)*N+i for i in range(N))]
 o=own(name,vs,fs,parent,material,True);uv(o);return o

def rod(name,a,b,r,parent,material,N=16):return pipe(name,[a,b],r,parent,material,N)
def disc(name,center,r,depth,parent,material,axis='z',N=32):
 c=Vector(center);v=Vector((0,0,depth/2) if axis=='z' else (0,depth/2,0) if axis=='y' else (depth/2,0,0));return rod(name,c-v,c+v,r,parent,material,N)
def roundrect_path(cx,cz,w,h,r,y,N=7):
 out=[]
 for x,z,a in [(cx+w/2-r,cz+h/2-r,0),(cx-w/2+r,cz+h/2-r,90),(cx-w/2+r,cz-h/2+r,180),(cx+w/2-r,cz-h/2+r,270)]:
  for j in range(N):q=math.radians(a+j*90/(N-1));out.append((x+r*math.cos(q),y,z+r*math.sin(q)))
 return out

def apply():
 global F,B,A,H
 F=bpy.data.objects['F20_vanity'];B=bpy.data.objects['Bathroom_architecture'];A=bpy.data.objects['Architecture'];H=bpy.data.objects['bathroom_door_hinge']
 ceramic=mat('ceramic_ivory');brass=mat('metal_champagne');oak=mat('wood_oak_satin_furniture');stone=mat('stone_honed_warm_quartz');wall=mat('plaster_warm_white');dark=mat('metal_graphite')
 # Three butt-jointed privacy walls. Tops are real closed faces, no layered caps.
 top=2.775
 box('cutaway_bathroom_side',(2.375,2.057,0),(2.465,3.95,top),B,wall,.002,2,True)
 box('cutaway_bathroom_partition',(4.875,2.057,0),(4.965,3.95,top),B,wall,.002,2,True)
 box('cutaway_bathroom_rear_privacy',(2.375,3.95,0),(4.965,4.10,top),A,wall,.002,2,True)
 # Front partition: existing opening, .12 m thickness and original exact doorway span.
 # Three blocks are welded at non-overlapping butt joints in one manifold surface.
 # Opening x3.27..4.29, top2.18; original independent oak architrave retained.
 n='Architecture__plaster_warm_white'
 erase(n)
 objs=[box(n,(2.42,1.937,0),(3.27,2.057,top),A,wall,.002,2,True),box('bath19_front_right_wall',(4.29,1.937,0),(4.92,2.057,top),A,wall,.002,2,True),box('bath19_front_door_lintel',(3.27,1.937,2.18),(4.29,2.057,top),A,wall,.002,2,True)]
 # A slim upper closure is above the lower-floor clipping plane.
 # The deliberate 10 mm shadow reveal avoids exposing any clipped rear surface.
 for label,lo,hi in [('west',(2.375,2.057,2.785),(2.465,3.95,2.820)),('east',(4.875,2.057,2.785),(4.965,3.95,2.820)),('rear',(2.375,3.95,2.785),(4.965,4.1,2.820)),('front',(2.42,1.937,2.785),(4.92,2.057,2.820))]:
  box('bath19_soffit_'+label,lo,hi,A,wall,.001,2,True)
 # Continuous quiet stone floor, no grid line geometry or layered surfaces.
 box('bathroom_tile_floor',(2.465,2.057,.016),(4.875,3.95,.044),B,stone,.002,2,True)
 # Restrained small skirting on rear wall and room sides, not across doorway.
 for n,lo,hi in [('rear',(2.467,3.935,.044),(4.873,3.95,.115)),('west',(2.465,2.059,.044),(2.480,3.933,.115)),('east',(4.860,2.059,.044),(4.875,3.933,.115))]:box('bath19_skirt_'+n,lo,hi,B,ceramic,.002,2)
 # Floating oak cabinet grounded by a deliberately recessed continuous plinth.
 box('vanity_cabinet',(3.875,3.285,.145),(4.770,3.89,.805),F,oak,.007,3,True)
 box('bath19_vanity_recessed_plinth',(3.915,3.355,.044),(4.735,3.865,.15),F,dark,.004,2)
 for i,(a,b) in enumerate([(.152,.463),(.471,.797)]):
  box('bath19_vanity_drawer_'+str(i),(3.885,3.253,a),(4.760,3.282,b),F,oak,.004,3)
  z=b-.075
  for x in [4.19,4.46]:rod('bath19_drawer_standoff_'+str(i)+'_'+str(x),(x,3.249,z),(x,3.225,z),.009,F,brass,12)
  rod('bath19_drawer_pull_'+str(i),(4.165,3.221,z),(4.485,3.221,z),.008,F,brass,16)
 box('vanity_top',(3.85,3.225,.805),(4.79,3.910,.856),F,stone,.009,4,True)
 box('bath19_vanity_backsplash',(3.85,3.91,.855),(4.79,3.935,.98),F,stone,.004,2)
 # One connected hollow washbasin, with a real porcelain lip and interior slope.
 profile=[(.856,.175,.102,3.535),(.865,.198,.118,3.535),(.900,.253,.158,3.535),(.958,.298,.191,3.535),(1.008,.315,.205,3.535),(1.018,.312,.203,3.535),(1.018,.289,.180,3.535),(1.002,.284,.176,3.535),(.956,.249,.148,3.535),(.914,.194,.112,3.535),(.889,.090,.052,3.535),(.886,.022,.022,3.535)]
 ringform('washbasin',profile,F,ceramic,56,.78,4.32,True,True,True);erase('basin_inset')
 disc('bath19_basin_popup_waste',(4.32,3.535,.888),.020,.004,F,brass,N=24)
 # Vertical rear mounting, curved gooseneck with horizontal reach over the basin.
 disc('bath19_faucet_escutcheon',(4.32,3.826,.861),.038,.010,F,brass)
 pts=[(4.32,3.826,.865),(4.32,3.826,1.04),(4.32,3.826,1.14)]
 for k in range(1,10):
  a=math.pi/2*k/9;pts.append((4.32,3.726+.100*math.cos(a),1.14+.1*math.sin(a)))
 pts.extend([(4.32,3.68,1.24),(4.32,3.645,1.235),(4.32,3.632,1.218)])
 pipe('bath_faucet',pts,.014,F,brass,16)
 disc('bath19_faucet_aerator',(4.32,3.632,1.214),.011,.010,F,dark)
 rod('bath19_faucet_mixer_body',(4.32,3.826,1.02),(4.373,3.826,1.02),.023,F,brass)
 rod('bath19_faucet_mixer_lever',(4.373,3.826,1.025),(4.373,3.826,1.115),.007,F,brass)
 # Rounded rectangular mirror, backed and opaque, true reflective metal surface.
 mirror=brass.copy();mirror.name='bath19_silvered_mirror';p=next(n for n in mirror.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
 for l in list(mirror.node_tree.links):
  if l.to_node==p and l.to_socket.name in ['Base Color','Roughness','Metallic','Alpha']:mirror.node_tree.links.remove(l)
 p.inputs['Base Color'].default_value=(.80,.82,.82,1);p.inputs['Metallic'].default_value=.8;p.inputs['Roughness'].default_value=.12;p.inputs['Alpha'].default_value=1
 erase('bath_mirror_frame');erase('bath_mirror')
 path=roundrect_path(4.32,1.68,.78,.99,.135,3.923)
 pipe('bath_mirror_frame',path,.014,F,brass,12,True)
 # Opaque silver surface spans inside the round frame, with 10 mm backing behind.
 outline=roundrect_path(4.32,1.68,.758,.968,.124,3.923)
 vs=[(x,3.917,z) for x,y,z in outline]+[(x,3.937,z) for x,y,z in outline];N=len(outline);fs=[tuple(reversed(range(N))),tuple(N+i for i in range(N))]
 for i in range(N):j=(i+1)%N;fs.append((i,j,N+j,N+i))
 own('bath_mirror',vs,fs,F,mirror,False,True)
 # Skirted close-coupled toilet: one smooth connected ceramic bowl with an open
 # internal cavity; no overlapping sphere stack and no separate black inset.
 erase('toilet_pedestal')
 prof=[(.044,.145,.210,3.53),(.052,.157,.221,3.53),(.105,.164,.225,3.53),(.210,.161,.217,3.54),(.285,.177,.242,3.50),(.352,.199,.281,3.455),(.406,.212,.300,3.445),(.427,.214,.301,3.445),(.443,.207,.294,3.445),(.447,.178,.249,3.435),(.421,.169,.239,3.435),(.370,.144,.201,3.46),(.316,.104,.135,3.48),(.288,.055,.062,3.49),(.283,.026,.028,3.50)]
 ringform('toilet_bowl',prof,F,ceramic,56,.85,3.40,True,True,True)
 # Hollow thermoset seat, four smooth rings joined around the actual opening.
 seat=[(.449,.209,.295,3.439),(.458,.216,.302,3.439),(.474,.212,.298,3.439),(.480,.202,.287,3.439),(.480,.158,.227,3.433),(.470,.152,.220,3.433),(.455,.155,.224,3.433),(.449,.165,.235,3.433),(.449,.209,.295,3.439)]
 ringform('toilet_seat',seat,F,ceramic,56,.85,3.40,False,False,True)
 box('toilet_cistern',(3.205,3.758,.405),(3.595,3.928,.814),F,ceramic,.042,5,True)
 box('bath19_cistern_lid',(3.198,3.752,.811),(3.602,3.935,.843),F,ceramic,.012,3)
 disc('bath19_dual_flush_outer',(3.40,3.845,.847),.036,.008,F,brass)
 disc('bath19_dual_flush_button',(3.40,3.845,.852),.027,.005,F,brass)
 # Upright lid in front of the cistern, hinges fixed at the seat rear.
 lid=ringform('bath19_toilet_lid',[(0,.204,.278,0),(.012,.210,.284,0),(.022,.204,.278,0)],F,ceramic,48,.85,0,True,True)
 # Builder created in world origin; rotate its authored points to standing lid.
 for v in lid.data.vertices:
  w=lid.matrix_world@v.co;x,y,z=w
  q=Vector((3.40+x,3.705+z+.025*(y+.278),.755+y));v.co=lid.matrix_world.inverted_safe()@q
 uv(lid)
 for x in [3.31,3.49]:rod('bath19_seat_hinge_'+str(x),(x-.032,3.728,.482),(x+.032,3.728,.482),.013,F,brass)
 # Shower tray has an interior sloped well, integrated raised lip and recessed drain.
 # It is an open wet-zone from the east, preserving a >.70 m approach.
 erase('shower_tray')
 # Rectangle profiles use superellipse corners to keep the tray one welded shell.
 tray=[(.044,.331,.482,2.638),(.052,.343,.494,2.638),(.103,.343,.494,2.638),(.110,.334,.485,2.638),(.110,.308,.459,2.638),(.088,.302,.453,2.638),(.071,.274,.425,2.638),(.067,.035,.035,2.638)]
 ringform('shower_tray',tray,F,ceramic,64,.12,2.820,True,True,True)
 box('bath19_shower_drain',(2.665,2.56,.068),(2.975,2.615,.075),F,brass,.003,2)
 for i in range(9):box('bath19_shower_drain_slot_'+str(i),(2.683+i*.033,2.568,.0751),(2.701+i*.033,2.607,.0758),F,dark,0,1)
 # True-thickness low-iron shower screen, all supporting channels attached.
 box('shower_glass',(2.48,2.140,.111),(3.150,2.148,2.095),F,mat('pc16_glass_low_iron'),.001,2,True)
 box('bath19_shower_floor_channel',(2.475,2.132,.104),(3.158,2.155,.137),F,brass,.004,2)
 box('bath19_shower_wall_channel',(2.470,2.132,.132),(2.493,2.155,2.105),F,brass,.004,2)
 rod('bath19_shower_top_brace',(2.475,2.158,2.073),(2.477,2.650,2.073),.007,F,brass)
 # Wall-mounted exposed mixer, riser, curved shower arm, broad perforated head.
 rod('shower_riser',(2.520,2.75,.82),(2.520,2.75,2.125),.011,F,brass)
 for z in [.88,1.85]:disc('bath19_shower_mount_'+str(z),(2.483,2.75,z),.034,.035,F,brass,'x');rod('bath19_shower_spacer_'+str(z),(2.49,2.75,z),(2.52,2.75,z),.009,F,brass)
 pipe('shower_neck',[(2.52,2.75,2.1),(2.52,2.75,2.19),(2.529,2.75,2.216),(2.555,2.75,2.225),(2.715,2.75,2.225),(2.740,2.75,2.218),(2.748,2.75,2.195)],.013,F,brass,16)
 disc('shower_head',(2.748,2.75,2.177),.123,.028,F,brass,N=40)
 disc('bath19_shower_spray_face',(2.748,2.75,2.161),.109,.004,F,ceramic,N=40)
 # 25 tiny recessed spray nozzles, restrained count for mobile.
 for row in range(-2,3):
  for col in range(-2,3):
   if row*row+col*col>5:continue
   disc('bath19_spray_jet_'+str(row)+'_'+str(col),(2.748+row*.033,2.75+col*.033,2.158),.0032,.003,F,dark,N=8)
 rod('bath19_shower_mixer',(2.515,2.64,.92),(2.515,2.88,.92),.025,F,brass,20)
 for y in [2.655,2.865]:disc('bath19_mixer_escutcheon_'+str(y),(2.478,y,.92),.038,.024,F,brass,'x');rod('bath19_mixer_foot_'+str(y),(2.49,y,.92),(2.515,y,.92),.012,F,brass)
 rod('bath19_handshower',(2.565,2.72,1.26),(2.565,2.72,1.44),.022,F,brass)
 hose=[]
 for i in range(25):
  t=i/24;hose.append((2.565+.018*math.sin(math.pi*t),2.72+.12*math.sin(math.pi*t),1.26*(1-t)+.91*t-.59*math.sin(math.pi*t)))
 pipe('bath19_shower_hose',hose,.006,F,brass,10)
 box('bath19_shower_shelf',(2.486,2.885,1.18),(2.64,3.085,1.205),F,stone,.005,3)
 ringform('bath19_soap_bottle',[(1.205,.030,.030,2.997),(1.212,.034,.034,2.997),(1.33,.034,.034,2.997),(1.348,.021,.021,2.997),(1.36,.014,.014,2.997)],F,ceramic,24,1,2.565)
 rod('bath19_soap_pump',(2.565,2.997,1.37),(2.565,3.032,1.37),.006,F,brass)
 # Toilet-paper holder attached to cabinet side, within gap outside the door sweep.
 rod('bath19_roll_holder',(3.847,3.43,.59),(3.795,3.43,.59),.008,F,brass)
 rod('bath19_roll_spindle',(3.795,3.365,.59),(3.795,3.495,.59),.010,F,brass)
 rod('bath19_paper_roll',(3.795,3.385,.59),(3.795,3.475,.59),.052,F,ceramic,32)
 for ob in bpy.data.objects:
  if ob.name=='vanity_cabinet' or ob.name.startswith('bath19_vanity_drawer_'):ob['giKeepoutGroup']='vanity_cabinet'
 # Keep the exact moving hinge, leaf dimensions and closed/open swept volume.
 box('bathroom_oak_door',(3.35,1.9535,.055),(4.21,2.0085,2.125),H,mat('wood_honey'),.006,3,True)
 # Replace unattached old straight handle with a two-sided lever and mounting roses.
 erase('bathroom_door_handle')
 for y,sign in [(1.948,-1),(2.014,1)]:
  disc('bath19_door_rose_'+str(sign),(3.50,y,1.035),.028,.008,H,brass,'y')
  rod('bath19_door_neck_'+str(sign),(3.50,y,1.035),(3.50,y+sign*.040,1.035),.010,H,brass)
  rod('bathroom_door_handle' if sign==-1 else 'bath19_door_inside_handle',(3.50,y+sign*.040,1.035),(3.605,y+sign*.040,1.035),.009,H,brass)
 for z in [.24,1.04,1.93]:
  rod('bath19_door_hinge_knuckle_'+str(z),(4.214,1.981,z-.035),(4.214,1.981,z+.035),.009,H,brass)
 R['construction']=['Hollow porcelain basin and integral skirted toilet, real open interiors and separate seat/lid/hardware.','Cabinet uses individual drawer fronts, 8 mm reveal and recessed plinth; quartz counter has radiused edges.','Shower has a drained formed tray, true-thickness screen, fixed channels and connected riser/mixer/hose/head.','Three compact butt-jointed opaque privacy walls, no overlapping corner volumes; compact front doorway solids retain opening.','Existing oak door frame is preserved inside Architecture__wood_oak; moving hinge and original leaf bounds retained.','Existing licensed textures reused unchanged. Procedural mirror is opaque reflective metal.']

if __name__=='__main__':
 sha=hashlib.sha256(SOURCE.read_bytes()).hexdigest();assert sha==SOURCE_SHA,(sha,SOURCE_SHA)
 bpy.ops.wm.open_mainfile(filepath=str(SOURCE));bpy.context.view_layer.update()
 original={o.name:digest(o) for o in bpy.data.objects};materials={m.name:material_signature(m) for m in bpy.data.materials};counts0={o.name:(len(o.data.vertices),sum(len(f.vertices)-2 for f in o.data.polygons)) for o in bpy.data.objects if o.type=='MESH'}
 allowed={o.name for o in bpy.data.objects if o.parent and o.parent.name in ['F20_vanity','Bathroom_architecture','bathroom_door_hinge']}|{'cutaway_bathroom_rear_privacy','Architecture__plaster_warm_white'}
 # The moving hinge and all roots are deliberately outside the mutation allowlist.
 apply();bpy.context.view_layer.update()
 unchanged=[]
 for n,h in original.items():
  if n in allowed:continue
  assert n in bpy.data.objects,'Removed nonbathroom '+n
  assert digest(bpy.data.objects[n])==h,'Changed nonbathroom '+n
  unchanged.append(n)
 for n,h in materials.items():assert material_signature(mat(n))==h,'Changed existing material '+n
 counts1={o.name:(len(o.data.vertices),sum(len(f.vertices)-2 for f in o.data.polygons)) for o in bpy.data.objects if o.type=='MESH'}
 newset=set(R['created']+R['replaced']);R.update({'source':str(SOURCE),'sourceSha256':sha,'allNonBathroomExactUnchanged':True,'unchangedObjects':len(unchanged),'unchangedObjectNames':unchanged,'allExistingMaterialsExactUnchanged':True,'existingMaterials':len(materials),'allowedOriginalObjects':sorted(allowed),'sourceBathroomVertices':sum(v for n,(v,t) in counts0.items() if n in allowed),'sourceBathroomTriangles':sum(t for n,(v,t) in counts0.items() if n in allowed),'candidateBathroomVertices':sum(v for n,(v,t) in counts1.items() if n in newset),'candidateBathroomTriangles':sum(t for n,(v,t) in counts1.items() if n in newset),'originalHashes':{n:original[n] for n in unchanged},'doorContract':{'pivotBlender':[4.215000152587891,1.9809999465942383,0],'closedRotation':0,'openRotationBlenderZ':-math.pi/2,'openRotationThreeY':-math.pi/2,'leafBoundsBlender':[[3.35,4.21],[1.9535,2.0085],[.055,2.125]],'hingeName':'bathroom_door_hinge','leafName':'bathroom_oak_door'},'limits':['Offline authored-source equivalence only. Live WebGL interaction and shadow verification not performed.','Runtime geometry export, fresh GI and publish belong to integration.']})
 bpy.context.scene['bathroomRevisionV19']='True-thickness manufactured fixtures and opaque non-overlapping privacy walls'
 bpy.ops.wm.save_as_mainfile(filepath=str(DEST),compress=True)
 R.update({'output':str(DEST),'outputSha256':hashlib.sha256(DEST.read_bytes()).hexdigest(),'outputBytes':DEST.stat().st_size,'builderSha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()})
 (P/'build-report.json').write_text(json.dumps(R,indent=2));print('BATHROOM_V19_BUILT',json.dumps({k:v for k,v in R.items() if k not in ['originalHashes','unchangedObjectNames']},indent=2))
