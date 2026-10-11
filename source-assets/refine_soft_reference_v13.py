"""Reference-led v13 upholstery/drapery revision. Apply only to frozen v12 input.
Keeps all furniture roots, animation matrices and piano transforms unchanged.
Broad upholstery volumes and gravity folds; no displacement/noise stand-ins.
"""
import bpy,bmesh,math,os,json
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
from math import sin,cos,pi,exp,sqrt
OUT=os.path.dirname(os.path.abspath(__file__))
REPORT={}
def sp(x,e):return math.copysign(abs(x)**e,x)
def ss(x):x=max(0,min(1,x));return x*x*(3-2*x)
def gauss(x,c,w):return exp(-((x-c)/w)**2)
def mat(n):return bpy.data.materials[n]
def bounds(o):
 p=[v.co for v in o.data.vertices];return Vector([min(v[i] for v in p) for i in range(3)]),Vector([max(v[i] for v in p) for i in range(3)])
def update_mesh(o,vs,fs):
 mats=list(o.data.materials);me=bpy.data.meshes.new(o.name+'_v13_soft_mesh');me.from_pydata(vs,[],fs);me.update()
 for m in mats:me.materials.append(m)
 o.data=me
 for md in list(o.modifiers):o.modifiers.remove(md)
 bm=bmesh.new();bm.from_mesh(me);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(me);bm.free();me.update()
 for p in me.polygons:p.use_smooth=True
 ca=me.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='POINT')
 for d in ca.data:d.color=(1,1,1,1)
 me.color_attributes.active_color=ca;me.color_attributes.render_color_index=0
 uv=me.uv_layers.new(name='UVMap')
 for p in me.polygons:
  ax=max(range(3),key=lambda i:abs(p.normal[i]));ab=[i for i in range(3) if i!=ax]
  for li in p.loop_indices:
   co=me.vertices[me.loops[li].vertex_index].co;uv.data[li].uv=(co[ab[0]]/.18,co[ab[1]]/.18)
 o['referenceRevision']='v13 authored upholstery volumes and weighted folds'
 return o

def new_object(name,parent,material):
 o=bpy.data.objects.get(name)
 if o is None:
  o=bpy.data.objects.new(name,bpy.data.meshes.new(name));bpy.context.scene.collection.objects.link(o);o.parent=parent;o.matrix_local=Matrix.Identity(4)
 o.data.materials.clear();o.data.materials.append(material);bpy.context.view_layer.update();return o

def surface_grid(center,half,thin=2,e=.53,crown=.72,deform=None,N=64,L=32):
 # A closed stuffed panel. Exponents set broad soft edge transition, not box bevels.
 c=Vector(center);h=Vector(half);a,b=[i for i in range(3) if i!=thin];vs=[];fs=[]
 for j in range(1,L):
  t=-pi/2+pi*j/L;ct=max(0,cos(t))**crown
  for i in range(N):
   angle=2*pi*i/N;p=c.copy();p[a]+=h[a]*ct*sp(cos(angle),e);p[b]+=h[b]*ct*sp(sin(angle),e);p[thin]+=h[thin]*sp(sin(t),crown)
   if deform:p=deform(p,c,h)
   vs.append(tuple(p))
 for j in range(L-2):
  for i in range(N):a0=j*N+i;b0=j*N+(i+1)%N;fs.append((a0,b0,b0+N,a0+N))
 for sign in [-1,1]:
  p=c.copy();p[thin]+=sign*h[thin]
  if deform:p=deform(p,c,h)
  end=len(vs);vs.append(tuple(p));ring=0 if sign<0 else (L-2)*N
  for i in range(N):fs.append((end,ring+(i+1)%N,ring+i) if sign<0 else (end,ring+i,ring+(i+1)%N))
 return vs,fs

def composite(o,components,space='local'):
 vs=[];fs=[]
 for c in components:
  a,b=surface_grid(**c);offset=len(vs);vs.extend(a);fs.extend(tuple(i+offset for i in f) for f in b)
 if space=='parent':
  inv=o.matrix_local.inverted_safe();vs=[inv@Vector(p) for p in vs]
 return update_mesh(o,vs,fs)

def comp(lo,hi,thin=2,e=.55,crown=.72,deform=None):
 return dict(center=(Vector(lo)+Vector(hi))*.5,half=(Vector(hi)-Vector(lo))*.5,thin=thin,e=e,crown=crown,deform=deform)
def seam(name,points,parent,material,r=.00125,matrix=None):
 d=bpy.data.curves.new(name+'_path','CURVE');d.dimensions='3D';d.bevel_depth=r;d.bevel_resolution=1;s=d.splines.new('POLY');s.points.add(len(points)-1)
 for p,co in zip(s.points,points):p.co=(*co,1)
 s.use_cyclic_u=True;o=bpy.data.objects.new(name,d);bpy.context.scene.collection.objects.link(o);o.parent=parent;d.materials.append(material)
 if matrix is not None:o.matrix_local=matrix
 return o

def panel_seam(o,center,half,thin,e=.55,r=.0012):
 a,b=[i for i in range(3) if i!=thin];p=[]
 for i in range(128):
  t=2*pi*i/128;q=Vector(center);q[a]+=half[a]*sp(cos(t),e);q[b]+=half[b]*sp(sin(t),e);p.append(q)
 return seam(o.name+'_v13_tailored_seam',p,o.parent,mat('fabric_tailored_rose_welt') if 'blush' in o.data.materials[0].name else mat('fabric_tailored_ivory_welt'),r,o.matrix_local.copy())

def bvh(objects):
 vs=[];fs=[];dg=bpy.context.evaluated_depsgraph_get()
 for o in objects:
  if o.type!='MESH':continue
  ob=o.evaluated_get(dg);me=ob.to_mesh();off=len(vs);vs.extend(ob.matrix_world@v.co for v in me.vertices);fs.extend(tuple(off+i for i in p.vertices) for p in me.polygons);ob.to_mesh_clear()
 return BVHTree.FromPolygons(vs,fs)

def grid_cloth(o,world_fn,nx,ny,thick):
 # Closed coherent fabric shell. Matched layers share a projection so contact
 # corrections cannot cause the underside to fold through the visible face.
 top=[Vector(world_fn(i/nx,j/ny)) for j in range(ny+1) for i in range(nx+1)];stride=nx+1;bottom=[]
 for j in range(ny+1):
  for i in range(nx+1):
   dx=top[j*stride+min(nx,i+1)]-top[j*stride+max(0,i-1)];dy=top[min(ny,j+1)*stride+i]-top[max(0,j-1)*stride+i];normal=dx.cross(dy).normalized()
   if normal.z<0:normal=-normal
   bottom.append(top[j*stride+i]-Vector((0,0,thick)))
 vs=top+bottom;fs=[];k=len(top);o['clothShellPairCount']=k
 for j in range(ny):
  for i in range(nx):
   a=j*stride+i;b=a+1;c=b+stride;d=a+stride;fs.append((a,b,c,d));fs.append((a+k,d+k,c+k,b+k))
 edge=list(range(stride))+[j*stride+nx for j in range(1,ny+1)]+[ny*stride+i for i in range(nx-1,-1,-1)]+[j*stride for j in range(ny-1,0,-1)]
 for a,b in zip(edge,edge[1:]+edge[:1]):fs.append((a,a+k,b+k,b))
 inv=o.matrix_world.inverted_safe();update_mesh(o,[inv@p for p in vs],fs)
 o['clothThicknessMetres']=thick;return o

def fit_triangle_sweeps(cloth,supports,amp,clearance=.003):
 o=bpy.data.objects[cloth];bpy.context.view_layer.update();tree=bvh(supports);inv=o.matrix_world.inverted_safe();lo=min(v.co.y for v in o.data.vertices);hi=max(v.co.y for v in o.data.vertices);edge=lo+(hi-lo)*.25
 weights=[ss((edge-v.co.y)/max(edge-lo,1e-9)) for v in o.data.vertices]
 samples=[(1/3,1/3,1/3),(.5,.5,0),(.5,0,.5),(0,.5,.5),(.6,.2,.2),(.2,.6,.2),(.2,.2,.6)];o.data.calc_loop_triangles();largest=0;count=0
 for iteration in range(10):
  world=[o.matrix_world@v.co for v in o.data.vertices];lift={};minimum=1e9
  for tri in o.data.loop_triangles:
   ids=list(tri.vertices);p=[world[i] for i in ids]
   for bary in samples:
    q=sum((p[i]*bary[i] for i in range(3)),Vector());hit,n,ix,d=tree.ray_cast(Vector((q.x,q.y,8)),Vector((0,0,-1)),10)
    if hit is None or n.z<.025:continue
    delta=q.z-sum(weights[ids[i]]*bary[i] for i in range(3))*amp-hit.z;minimum=min(minimum,delta)
    if delta<clearance:
     dz=clearance-delta+.00025
     for index in ids:lift[index]=max(lift.get(index,0),dz)
  if not lift:break
  pairs=o.get('clothShellPairCount',0)
  if pairs:
   for index,dz in list(lift.items()):
    partner=index+pairs if index<pairs else index-pairs
    if partner<len(world):lift[partner]=max(lift.get(partner,0),dz)
  for index,dz in lift.items():p=world[index];p.z+=dz;o.data.vertices[index].co=inv@p;largest=max(largest,dz)
  count+=len(lift);o.data.update()
 REPORT[cloth+'_sweep']={'minimumClearanceM':minimum,'iterations':iteration+1,'adjustedVertices':count,'largestLiftM':largest,'amplitudeM':amp}
 print('V13_CLOTH_SWEEP',cloth,REPORT[cloth+'_sweep'],flush=True)

def apply_soft_reference_v13():
 protected={o.name:[list(row) for row in o.matrix_local] for o in bpy.data.objects if o.type=='EMPTY' or o.name.startswith(('piano_key_','anim_'))}
 # Remove old piping on parts whose shells change, but keep all other construction.
 for o in list(bpy.data.objects):
  if o.type=='CURVE' and ('_tailored_welt' in o.name) and o.name.startswith(('F01_sofa','bed_pillow','chair_','rocker_')):bpy.data.objects.remove(o,do_unlink=True)
 root=bpy.data.objects['F01_sofa'];boucle=mat('fabric_tailored_boucle')
 # Low upholstered bases are visibly submerged beneath inflated seat cushions.
 composite(bpy.data.objects['F01_sofa__fabric_sofa_boucle_part_001'],[comp((-3.00,-1.89,.17),(.14,-.70,.59),e=.57,crown=.8)],'parent')
 composite(bpy.data.objects['F01_sofa__fabric_sofa_boucle_part_003'],[comp((-1.285,-2.355,.29),(-.075,-.905,.65),e=.72,crown=.82)],'parent')
 def seat_press(p,c,h):
  if p.z>c.z:p.z-=.025*gauss(p.x,c.x,h.x*.60)*gauss(p.y,c.y+.035,h.y*.65)*(p.z-c.z)/h.z
  return p
 composite(bpy.data.objects['F01_sofa__fabric_sofa_boucle_part_002'],[
  comp((-2.83,-1.97,.43),(-1.99,-.91,.77),e=.55,crown=.76,deform=seat_press),
  comp((-2.005,-1.93,.43),(-1.155,-.91,.79),e=.55,crown=.76,deform=seat_press)],'parent')
 composite(bpy.data.objects['F01_sofa__fabric_sofa_boucle_part_000'],[comp((-1.24,-2.335,.48),(-.12,-.92,.80),e=.65,crown=.80,deform=seat_press)],'parent')
 def back_tilt(p,c,h):
  p.y+=.038*(p.z-c.z)/h.z;return p
 # Independently plumped back panels and bulbous arms replace continuous slab.
 composite(bpy.data.objects['F01_sofa__fabric_sofa_boucle_part_004'],[
  comp((-3.23,-1.94,.26),(-2.65,-.71,1.175),thin=0,e=.70,crown=.92),
  comp((-.35,-1.86,.26),(.227,-.685,1.175),thin=0,e=.70,crown=.92),
  comp((-2.83,-1.185,.60),(-1.965,-.72,1.23),thin=1,e=.64,crown=.88,deform=back_tilt),
  comp((-1.99,-1.18,.61),(-1.115,-.72,1.225),thin=1,e=.64,crown=.88,deform=back_tilt),
  comp((-1.14,-1.18,.61),(-.245,-.72,1.225),thin=1,e=.64,crown=.88,deform=back_tilt)],'parent')
 # Pillows retain their positions but get true stuffed depth, corner tension and asymmetry.
 for i in range(3):
  o=bpy.data.objects[f'F01_sofa__fabric_blush_part_{i:03d}'];lo,hi=bounds(o);center=(lo+hi)/2;half=(hi-lo)/2
  half.y*=1.12;half.x*=.98
  def pillow(p,c,h,index=i):
   x=(p.x-c.x)/h.x;z=(p.z-c.z)/h.z;p.y-=.018*gauss(x,.45,.17)*gauss(z,-.47,.33);p.z+=.017*x*(1-z*z);p.x+=.010*z*(1-x*x);return p
  composite(o,[dict(center=center,half=half,thin=1,e=.36,crown=.67,deform=pillow)]);panel_seam(o,center,half,1,.36)
 # Chair padding is contoured and overstuffed within its existing usable envelope.
 for o in list(bpy.data.objects):
  if o.type!='MESH' or not o.name.startswith(('chair_seat','chair_back','chair_lumbar','chair_arm_pad','rocker_seat','rocker_back','rocker_arm','rocker_pillow','bed_pillow')):continue
  if o.name=='chair_seat_piping':bpy.data.objects.remove(o,do_unlink=True);continue
  lo,hi=bounds(o);c=(lo+hi)/2;h=(hi-lo)/2;thin=min(range(3),key=lambda a:h[a]);e=.58;crown=.79
  if o.name.startswith('chair_lumbar'):h.z*=1.40;c.z+=.045;h.y*=1.25;e=.77
  if o.name.startswith('chair_back'):h.y*=1.22;e=.67;crown=.85
  if o.name.startswith('chair_arm_pad'):h.z*=1.20;e=.70
  if o.name.startswith('rocker_arm'):
   dx=h.x*.35;h.x+=dx;c.x+=dx if o.name=='rocker_arm' else -dx;h.z*=1.50;c.z-=.025;e=.7
  if o.name.startswith('rocker_back'):h.y*=1.18;e=.7
  if o.name.startswith('bed_pillow'):h.z*=1.35;h.y*=1.05;c.z+=.021;e=.32;crown=.62
  def contour(p,c,h,name=o.name,axis=thin):
   if name.startswith(('chair_seat','rocker_seat')) and p.z>c.z:p.z-=.018*gauss(p.x,c.x,h.x*.65)*gauss(p.y,c.y+.06,h.y*.62)
   if name.startswith(('chair_back','rocker_back')):
    p.x*=.96+.04*gauss(p.z,c.z+h.z*.4,h.z*.7);p.y-=.021*gauss(p.z,c.z-h.z*.35,h.z*.4)
   if name.startswith('bed_pillow'):p.z+=.012*sin((p.x-c.x)/h.x*pi)*gauss(p.y,c.y,h.y)
   return p
  composite(o,[dict(center=c,half=h,thin=thin,e=e,crown=crown,deform=contour)]);panel_seam(o,c,h,thin,e)
 # Broad overlapping back pillows, plus the two modest rose cushions visible
 # in the reference. These stay inside the existing bed envelope.
 bedroot=bpy.data.objects['F15_bed'];bpy.context.view_layer.update()
 for i,xx in enumerate([-1.245,-.255]):
  o=new_object('bed_pillow_back_v13_'+str(i),bedroot,mat('fabric_tailored_fine_linen'))
  def lean(p,c,h):p.y+=.045*(p.z-c.z)/h.z;return p
  vs,fs=surface_grid((xx,3.105,3.99),(.475,.13,.265),1,.38,.67,lean)
  inv=o.matrix_world.inverted_safe();update_mesh(o,[inv@Vector(p) for p in vs],fs)
 for i,xx in enumerate([-1.03,-.47]):
  o=new_object('bed_pillow_rose_v13_'+str(i),bedroot,mat('fabric_blush'))
  vs,fs=surface_grid((xx,2.765,3.945),(.205,.10,.173),1,.37,.66)
  inv=o.matrix_world.inverted_safe();update_mesh(o,[inv@Vector(p) for p in vs],fs)
 # Weighted comforter. Its bottom actually rests on the mattress; exposed hems
 # hang at the sides and foot with broad, directed folds.
 bpy.context.view_layer.update();bed_supports=[bpy.data.objects[n] for n in ['bed_mattress','bed_oak_frame','mattress_piping']];matt=bvh(bed_supports);duvet=bpy.data.objects['duvet_main']
 def duvet_fn(u,v):
  x=-1.885+2.27*u;y=1.115+1.70*v+.024*abs(2*u-1)**8*(1-v)**5
  # Held top near pillow seam, filled middle, hanging foot/sides.
  middle=sin(pi*u)**2*sin(pi*v)**2
  z=3.782+.088*middle-.245*ss((abs(x+.75)-.99)/.145)-.225*ss((1.37-y)/.255)
  folds=(.067*gauss(u,.17+.095*v,.048)+.052*gauss(u,.41-.13*v,.065)+.075*gauss(u,.73+.065*v,.047))*(.50+.50*sin(pi*v))
  z+=folds+.050*gauss(v,.89,.065)*sin(pi*u)**2
  hit,n,ix,d=matt.ray_cast(Vector((x,y,6)),Vector((0,0,-1)),4)
  if hit is not None:z=max(z,hit.z+.027)
  return x,y,z
 grid_cloth(duvet,duvet_fn,96,76,.022);fit_triangle_sweeps('duvet_main',bed_supports,0,.003);bpy.context.view_layer.update();duvettree=bvh([duvet]+bed_supports)
 throw=bpy.data.objects['anim_bed_edge']
 def bed_throw(u,v):
  x=-1.89+2.28*u;y=1.105+.84*v+.024*abs(2*u-1)**8*(1-v)**5
  z=3.81-.245*ss((abs(x+.75)-.99)/.15)-.230*ss((1.36-y)/.255)
  hit,n,ix,d=duvettree.ray_cast(Vector((x,y,6)),Vector((0,0,-1)),4)
  if hit is not None:z=hit.z+.014
  z+=.018*gauss(u,.17+.055*v,.036)+.027*gauss(u,.40-.07*v,.045)+.022*gauss(u,.76+.03*v,.04)
  return x,y,z
 grid_cloth(throw,bed_throw,96,42,.006)
 # Left throw is laid over the arm and allowed to hang down its rounded front.
 bpy.context.view_layer.update();supports=[bpy.data.objects[f'F01_sofa__fabric_sofa_boucle_part_{i:03d}'] for i in range(5)];tree=bvh(supports);throw=bpy.data.objects['anim_sofa_edge']
 def sofa_throw(u,v):
  x=-3.075+.645*u;y=-2.075+.775*v;z=.30+.89*ss(v/.36)-.38*ss((u-.40)/.60)*ss(v/.50)-.075*ss((.22-u)/.22)*ss(v/.50)
  p=root.matrix_world@Vector((x,y,z));hit,n,ix,d=tree.ray_cast(Vector((p.x,p.y,3)),Vector((0,0,-1)),4)
  if hit is not None:p.z=max(p.z,hit.z+.020)
  p.z+=.018*gauss(u,.18+.06*v,.06)+.027*gauss(u,.52-.065*v,.07)+.019*gauss(u,.83,.052)
  return p
 grid_cloth(throw,sofa_throw,48,76,.006)
 # Repair inherited dining-chair throw with a coherent fitted shell; the
 # original 0.325 x 0.345 m placement and animated object matrix are retained.
 dining=bpy.data.objects['anim_dining_edge'];ds=[bpy.data.objects['dining_seat.002']];dt=bvh(ds)
 def dining_fn(u,v):
  x=-3.75+.322*u;y=-1.616+.34*v;z=.35+.19*ss(v/.38)
  p=dining.matrix_world@Vector((x,y,z));hit,n,ix,d=dt.ray_cast(Vector((p.x,p.y,2)),Vector((0,0,-1)),3)
  if hit is not None:p.z=max(p.z,hit.z+.018)
  p.z+=.007*gauss(u,.25+.08*v,.085)+.006*gauss(u,.72-.06*v,.07)
  return p
 grid_cloth(dining,dining_fn,40,44,.005)
 fit_triangle_sweeps('anim_dining_edge',ds,.0035)
 fit_triangle_sweeps('anim_sofa_edge',supports,.0035)
 fit_triangle_sweeps('anim_bed_edge',[duvet]+bed_supports,.004)
 fit_triangle_sweeps('duvet_main',bed_supports,0,.003)
 bpy.context.view_layer.update()
 for n,m in protected.items():
  o=bpy.data.objects.get(n)
  assert o is not None,'Missing protected '+n
  assert max(abs(o.matrix_local[i][j]-m[i][j]) for i in range(4) for j in range(4))<2e-5,'Changed protected '+n
 REPORT['protectedTransforms']=len(protected);REPORT['intent']='Segmented bulbous sofa, compressed filled seats, plump asymmetric pillows, weighted full comforter and flowing throws, padded ergonomic seating; fixed layout.'
 bpy.context.scene['softReferenceRevision']='v13-segmented-and-weighted'
 os.makedirs(OUT+'/reference-v13-review',exist_ok=True);open(OUT+'/reference-v13-review/soft-patch-report.json','w').write(json.dumps(REPORT,indent=2));return REPORT
if __name__=='__main__':
 bpy.ops.wm.open_mainfile(filepath=OUT+'/bearroom-realism.blend');apply_soft_reference_v13();bpy.ops.wm.save_as_mainfile(filepath=OUT+'/reference-v13-review/soft-draft6-v13.blend',compress=True)
