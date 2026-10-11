"""Rebuild the reference bear as a sewn short-pile toy.

Import apply_toy() into an already-open production scene, then export/rebake through
that scene's normal pipeline.  Standalone defaults only write under toy-review/.
The original room, furniture, layout, root placement and material images are kept.
Reference silhouettes: ../bearroom-project/docs/1.jpg, 2.jpg and 3.jpg.
"""
import bpy, math, os, sys, json, random
from mathutils import Vector
from math import sin, cos, pi, exp, sqrt
OUT = os.path.dirname(os.path.abspath(__file__))

def signpow(x, e): return math.copysign(abs(x) ** e, x)
def gauss(x, c, w): return exp(-((x-c)/w)**2)

def head_point(lat, phi):
    # phi=0 is front: a broad front panel, a gently squared chin, not a ball.
    cl = max(0, cos(lat))**.89
    z = .684 + (.279 if lat >= 0 else .244) * signpow(sin(lat), .88)
    x = .326 * cl * signpow(sin(phi), .90)
    y = -.246 * cl * signpow(cos(phi), .90)
    # Cloth panel tension: millimetric broad unevenness, concentrated at seams.
    wav = 1 + .004*cos(phi*3+.6)*cos(lat*4) + .0025*sin(phi*7-lat*3)
    x *= wav; y *= wav
    # Shallow front chin dart and back centre seam, actual indentation.
    front_dart = gauss(x, 0, .006) * gauss(z, .507, .066) * max(0, cos(phi))**10
    back_seam = gauss(x, 0, .0045) * max(0, -cos(phi))**10
    # The crown seam is on the back half and stays out of the eyes.
    side_seam = gauss(abs(phi), 1.12, .026)
    groove = .0028*front_dart + .0022*back_seam + .0026*side_seam
    x *= 1-.0026*side_seam/.326
    y *= 1-groove/.246
    z -= .0016*gauss(x,0,.008)*gauss(z,.947,.04)
    return Vector((x,y,z))

def head_front(x,z,offset=0):
    v=max(-.999999,min(.999999,(z-.684)/(.279 if z>=.684 else .244)))
    lat=math.asin(signpow(v,1/.88))
    lo,hi=-pi/2,pi/2
    for _ in range(32):
        phi=(lo+hi)/2
        if head_point(lat,phi).x < x: lo=phi
        else: hi=phi
    p=head_point(lat,(lo+hi)/2)
    return Vector((x,p.y-offset,z))

def material_copy(name,source,roughness=.96):
    old=bpy.data.materials.get(name)
    if old and old.name != source.name: bpy.data.materials.remove(old)
    m=source.copy();m.name=name
    # Imported glTF color attributes are tied to the old mesh. Remove those nodes
    # before creating this revision's explicit tint channel.
    for node in list(m.node_tree.nodes):
        if node.type=='VERTEX_COLOR':
            for output in node.outputs:
                for link in list(output.links):
                    socket=link.to_socket
                    if socket.type=='RGBA':socket.default_value=(1,1,1,1)
                    elif socket.type=='VALUE':socket.default_value=1
            m.node_tree.nodes.remove(node)
    p=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
    if p:
        p.inputs['Roughness'].default_value=roughness
        p.inputs['Specular IOR Level'].default_value=.23
        p.inputs['Sheen Weight'].default_value=.58
        p.inputs['Sheen Tint'].default_value=(.82,.81,.79,1)
        p.inputs['Sheen Roughness'].default_value=.72
        for n in m.node_tree.nodes:
            if n.type=='NORMAL_MAP':
                n.inputs['Strength'].default_value=.38
                n.uv_map='PhysicalSurfaceUV'
    m['toyRealismRevision']='sewn-reference-v12'
    return m

def basic_material(name,color,rough=.95):
    m=bpy.data.materials.get(name) or bpy.data.materials.new(name);m.use_nodes=True
    p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough
    p.inputs['Specular IOR Level'].default_value=.19
    m.diffuse_color=(*color,1);return m


def settle_toys_on_support():
    """Fit both padded soles to the actual supporting scene, keeping roots fixed."""
    from mathutils.bvhtree import BVHTree
    from mathutils import Matrix
    results=[];dg=bpy.context.evaluated_depsgraph_get()
    for root_name,support_name,feet_names,compression in [
        ('Bear_reference_plush','F01_sofa',('bear_foot_L_soft','bear_foot_R_soft'),.0004),
        ('Bear_desk_plush','F08_computer_desk',('desk_bear_foot_L_soft','desk_bear_foot_R_soft'),.0002),
    ]:
        r=bpy.data.objects.get(root_name);support=bpy.data.objects.get(support_name)
        if r is None or support is None:continue
        vs=[];fs=[]
        for ob in support.children_recursive:
            if ob.type!='MESH':continue
            evaluated=ob.evaluated_get(dg);me=evaluated.to_mesh();base=len(vs)
            vs.extend(tuple(evaluated.matrix_world@v.co) for v in me.vertices)
            fs.extend(tuple(base+i for i in p.vertices) for p in me.polygons)
            evaluated.to_mesh_clear()
        bvh=BVHTree.FromPolygons(vs,fs,all_triangles=False)
        accumulated_roll=0
        def contacts():
            answer=[]
            for name in feet_names:
                foot=bpy.data.objects[name]
                pts=[foot.matrix_world@v.co for v in foot.data.vertices]
                z=min(p.z for p in pts);sole=min(pts,key=lambda p:p.z).copy()
                hit,normal,index,distance=bvh.ray_cast(sole+Vector((0,0,.055)),Vector((0,0,-1)),.30)
                if hit is None:raise RuntimeError('No support below '+name)
                answer.append((sole,hit,sole.z-hit.z))
            return answer
        initial=contacts()
        for iteration in range(4):
            c=contacts();a,b=c[0][0],c[1][0];ta,tb=c[0][1],c[1][1]
            dx=b.x-a.x
            if abs(dx)<1e-5:break
            angle=math.atan2(tb.z-ta.z,dx)-math.atan2(b.z-a.z,dx)
            angle=max(-math.radians(10)-accumulated_roll,min(math.radians(10)-accumulated_roll,angle))
            accumulated_roll+=angle
            pivot=(a+b)*.5
            correction=Matrix.Translation(Vector((0,0,-(c[0][2]+c[1][2])*.5-compression))) @ Matrix.Translation(pivot) @ Matrix.Rotation(-angle,4,'Y') @ Matrix.Translation(-pivot)
            for ob in list(r.children):ob.matrix_world=correction@ob.matrix_world
            bpy.context.view_layer.update()
        final=contacts()
        r['toySettledOnSupport']=support_name
        results.append({'root':root_name,'support':support_name,'initialSoleClearanceMm':[c[2]*1000 for c in initial],'finalSoleClearanceMm':[c[2]*1000 for c in final],'childRollDegrees':math.degrees(accumulated_roll),'rootTransformUnchanged':True})
    return results

def apply_toy(include_desk=True):
    root=bpy.data.objects.get('Bear_reference_plush')
    if root is None: raise RuntimeError('Expected Bear_reference_plush root; do not change the room coordinate system.')
    for o in list(root.children_recursive): bpy.data.objects.remove(o,do_unlink=True)
    src=bpy.data.materials.get('fabric_bear')
    if src is None:
        src=next((m for m in bpy.data.materials if m.name.startswith('fabric_bear') and 'seam' not in m.name and 'blush' not in m.name),None)
    if src is None:src=basic_material('fabric_bear',(.886,.876,.844))
    plush=material_copy('fabric_bear_sewn_plush',src)
    headmat=material_copy('fabric_bear_sewn_head',src)
    thread=material_copy('fabric_bear_sewn_thread',src)
    blacksrc=bpy.data.materials.get('embroidery_ink')
    black=material_copy('embroidery_bear_stitched',blacksrc) if blacksrc else basic_material('embroidery_bear_stitched',(.011,.013,.014))
    blackp=next(n for n in black.node_tree.nodes if n.type=='BSDF_PRINCIPLED');blackp.inputs['Sheen Weight'].default_value=.15
    # Vertex-dyed blush does not create raised discs or a separate shiny surface.
    nt=headmat.node_tree;p=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED')
    tint=nt.nodes.new('ShaderNodeVertexColor');tint.layer_name='ToyFabricTint'
    mix=nt.nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1
    if p.inputs['Base Color'].links: nt.links.new(p.inputs['Base Color'].links[0].from_socket,mix.inputs[1])
    else: mix.inputs[1].default_value=p.inputs['Base Color'].default_value
    nt.links.new(tint.outputs['Color'],mix.inputs[2]);nt.links.new(mix.outputs[0],p.inputs['Base Color'])
    made=[]
    def mesh(name,verts,faces,mat,uvs=None,uv_period=1):
        me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update()
        o=bpy.data.objects.new(name,me);bpy.context.scene.collection.objects.link(o);o.parent=root;me.materials.append(mat)
        for poly in me.polygons:poly.use_smooth=True
        if uvs:
            uv=me.uv_layers.new(name='PhysicalSurfaceUV')
            for poly in me.polygons:
                us=[uvs[me.loops[li].vertex_index] for li in poly.loop_indices]
                seam=max(u[0] for u in us)-min(u[0] for u in us)>uv_period*.5
                for li,u in zip(poly.loop_indices,us):uv.data[li].uv=(u[0]+(uv_period if seam and u[0]<uv_period*.5 else 0),u[1])
        elif mat.use_nodes and any(n.type=='TEX_IMAGE' for n in mat.node_tree.nodes):
            uv=me.uv_layers.new(name='PhysicalSurfaceUV')
            metres=sum(abs(v) for v in root.matrix_world.to_scale())/3
            tile=.01 if mat.name.startswith('embroidery_') else .09
            for poly in me.polygons:
                axis=max(range(3),key=lambda a:abs(poly.normal[a]));axes=[a for a in range(3) if a!=axis]
                for li in poly.loop_indices:
                    v=me.vertices[me.loops[li].vertex_index].co
                    uv.data[li].uv=(v[axes[0]]*metres/tile,v[axes[1]]*metres/tile)
        o['toyPart']='sewn-plush';made.append(o);return o
    def surface(name,fn,mat,n=64,r=44):
        vs=[];uvs=[]
        # One albedo tile covers 90 mm in the actual installed toy, not local
        # mesh units. This lets the short fibres survive a real close-up.
        worldscale=sum(abs(v) for v in root.matrix_world.to_scale())/3
        equator=[fn(0,-pi+2*pi*j/128) for j in range(129)]
        meridian=[fn(-pi/2+pi*j/128,0) for j in range(129)]
        up=sum((b-a).length for a,b in zip(equator,equator[1:]))*worldscale/.09
        vp=sum((b-a).length for a,b in zip(meridian,meridian[1:]))*worldscale/.09
        for i in range(1,r):
            lat=-pi/2+pi*i/r
            for j in range(n):
                phi=-pi+2*pi*j/n;vs.append(tuple(fn(lat,phi)));uvs.append((j/n*up,i/r*vp))
        vs.extend([tuple(fn(-pi/2,0)),tuple(fn(pi/2,0))]);uvs.extend([(up/2,0),(up/2,vp)])
        fs=[]
        for i in range(r-2):
            for j in range(n):fs.append((i*n+j,i*n+(j+1)%n,(i+1)*n+(j+1)%n,(i+1)*n+j))
        bottom,top=len(vs)-2,len(vs)-1
        for j in range(n):
            fs.append((bottom,(j+1)%n,j));fs.append((top,(r-2)*n+j,(r-2)*n+(j+1)%n))
        # Parametric front orientation is clockwise; fix outward normals explicitly.
        o=mesh(name,vs,fs,mat,uvs,up)
        bpy.ops.object.select_all(action='DESELECT');bpy.context.view_layer.objects.active=o;o.select_set(True)
        bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.normals_make_consistent(inside=False);bpy.ops.object.mode_set(mode='OBJECT');o.select_set(False)
        return o
    head=surface('bear_head_sewn_front_panel',head_point,headmat,96,64)
    colors=head.data.color_attributes.new(name='ToyFabricTint',type='FLOAT_COLOR',domain='POINT')
    for v,c in zip(head.data.vertices,colors.data):
        x,y,z=v.co
        a=.33*(gauss(x,-.184,.054)+gauss(x,.184,.054))*gauss(z,.617,.042)*max(0,min(1,(-y-.105)/.07))
        # Multiplier in linear space, subtle diffuse fabric dye.
        c.color=(1,1-a*.61,1-a*.67,1)
    def volume(name,center,radii,ex=.9,ez=.9,material=None,tilt=0,role=None):
        cx,cy,cz=center;rx,ry,rz=radii
        def point(lat,phi):
            cl=max(0,cos(lat))**ez
            x=rx*cl*signpow(sin(phi),ex);y=-ry*cl*signpow(cos(phi),ex);z=rz*signpow(sin(lat),ez)
            # Tension at the limb root, slight flattening where stuffed fabric meets a seam.
            mod=1+.007*cos(phi*3+lat*4)+.004*sin(phi*7-lat*2)
            x*=mod;y*=mod
            if role=='body':
                z=max(-rz+.006,z)
                y*=1-.014*gauss(x,0,.012)*max(0,-cos(phi))**8
            if role=='foot':z=max(-rz+.004,z)
            xx=x*cos(tilt)+z*sin(tilt);zz=-x*sin(tilt)+z*cos(tilt)
            return Vector((cx+xx,cy+y,cz+zz))
        return surface(name,point,material or plush,64 if role=='body' else 40,44 if role=='body' else 30)
    volume('Bear_reference_plush__fabric_bear',(0,.006,.270),(.230,.177,.232),.81,.78,role='body')
    for side,label in [(-1,'L'),(1,'R')]:
        volume('bear_ear_'+label+'_padded',(side*.245,-.003,.910),(.057,.042,.064),.88,.84,tilt=side*.12)
        volume('bear_arm_'+label+'_tucked',(side*.218,-.006,.309),(.046,.061,.092),.93,.95,tilt=side*-.16)
        volume('bear_foot_'+label+'_soft',(side*.091,-.026,.026),(.059,.076,.083),.99,1.0,tilt=side*-.07,role='foot')
    volume('bear_tail_padded',(0,.164,.198),(.050,.043,.050),.9,.9)
    def tube(name,pts,r,mat,flatten=1):
        pts=[Vector(v) for v in pts];vs=[];fs=[];sides=6
        for i,p in enumerate(pts):
            tangent=(pts[min(i+1,len(pts)-1)]-pts[max(0,i-1)]).normalized()
            a=tangent.cross(Vector((0,-1,0))).normalized()
            if a.length<.1:a=tangent.cross(Vector((0,0,1))).normalized()
            b=tangent.cross(a).normalized()
            for k in range(sides):vs.append(tuple(p+r*(a*cos(k*2*pi/sides)+b*sin(k*2*pi/sides)*flatten)))
        for i in range(len(pts)-1):
            for k in range(sides):fs.append((i*sides+k,i*sides+(k+1)%sides,(i+1)*sides+(k+1)%sides,(i+1)*sides+k))
        fs.append(tuple(reversed(range(sides))));fs.append(tuple(range((len(pts)-1)*sides,len(pts)*sides)))
        return mesh(name,vs,fs,mat)
    def patch(name,outline,mat,depth=.0008):
        # Convex low relief satin embroidery with no spherical button highlight.
        center=(sum(p[0] for p in outline)/len(outline),sum(p[1] for p in outline)/len(outline))
        vs=[tuple(head_front(center[0],center[1],depth+.0003))]+[tuple(head_front(x,z,depth)) for x,z in outline]
        fs=[(0,i+1,(i+1)%len(outline)+1) for i in range(len(outline))]
        return mesh(name,vs,fs,mat)
    for side,label in [(-1,'L'),(1,'R')]:
        x,z=side*.085,.721
        outline=[]
        for i in range(72):
            a=i*2*pi/72;w=1+.004*sin(a*7)+.0025*cos(a*13)
            outline.append((x+.019*w*cos(a),z+.022*w*sin(a)))
        patch('bear_eye_'+label+'_embroidery',outline,black,.001)
        # Satin stitches follow the embroidered disk in closely spaced, flat thread rows.
        for j in range(-7,8):
            zz=z+j*.0026;dx=.018*sqrt(max(0,1-((zz-z)/.022)**2))
            tube('bear_eye_'+label+'_satin_%02d'%(j+7),[head_front(x-dx,zz,.0014),head_front(x+dx,zz,.0014)],.00032,black,.45)
    nose_outline=[(-.023,.653),(-.025,.660),(-.021,.668),(-.009,.672),(.009,.672),(.021,.668),(.025,.660),(.023,.651),(.011,.628),(0,.622),(-.011,.628)]
    # A sewn rounded triangle, with a continuous edge rather than a faceted icon.
    rounded=[]
    for i in range(len(nose_outline)):
        p0,p1,p2,p3=[Vector(nose_outline[j%len(nose_outline)]) for j in [i-1,i,i+1,i+2]]
        for step in range(6):
            t=step/6
            pt=.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t)
            rounded.append(tuple(pt))
    patch('bear_nose_rounded_triangle',rounded,black,.0012)
    for j in range(1,17):
        z=.622+j*.003;xs=[]
        for a,b in zip(rounded,rounded[1:]+rounded[:1]):
            if (a[1]<=z<b[1]) or (b[1]<=z<a[1]):xs.append(a[0]+(z-a[1])*(b[0]-a[0])/(b[1]-a[1]))
        if len(xs)>=2:
            tube('bear_nose_satin_%02d'%j,[head_front(min(xs),z,.0016),head_front(max(xs),z,.0016)],.00024,black,.45)
    # Smooth stitched W with vertical nose stem. Thin depth is cloth embroidery.
    def bezier2(a,b,c,d,steps=16):
        return [((1-t)**3*a[0]+3*(1-t)**2*t*b[0]+3*(1-t)*t*t*c[0]+t**3*d[0],(1-t)**3*a[1]+3*(1-t)**2*t*b[1]+3*(1-t)*t*t*c[1]+t**3*d[1]) for t in [i/steps for i in range(steps+1)]]
    mouth=bezier2((-.060,.616),(-.053,.587),(-.021,.587),(0,.610))+bezier2((0,.610),(.021,.587),(.053,.587),(.060,.616))[1:]
    tube('bear_mouth_stitched_W',[head_front(x,z,.0016) for x,z in mouth],.0067,black,.24)
    tube('bear_mouth_stitched_stem',[head_front(0,z,.0017) for z in [.635,.628,.619,.610]],.0054,black,.24)
    for label,(x,z) in [('L',mouth[0]),('R',mouth[-1])]:
        patch('bear_mouth_'+label+'_rounded_tip',[(x+.0067*cos(i*2*pi/32),z+.0067*sin(i*2*pi/32)) for i in range(32)],black,.0019)

    # Small diagonal thread sections create satin-stitch breakup without frayed spikes.
    for j in range(1,len(mouth)-1,2):
        x,z=mouth[j];dx,dz=mouth[j+1][0]-mouth[j-1][0],mouth[j+1][1]-mouth[j-1][1];ln=math.hypot(dx,dz)
        if ln:
            nx,nz=-dz/ln*.0058,dx/ln*.0058
            tube('bear_mouth_satin_%02d'%j,[head_front(x-nx,z-nz,.0021),head_front(x+nx,z+nz,.0021)],.00028,black,.42)
    # Tiny cream construction stitches catch grazing light; the groove supplies shadow.
    for i in range(21):
        z=.449+i*.0050
        tube('bear_chin_dart_stitch_%02d'%i,[head_front(-.0015,z,.00008),head_front(.0011,z+.0012,.00008)],.00045,thread,.5)
    for i in range(48):
        lat=-1.30+i*2.56/47
        a=head_point(lat,pi-.007);b=head_point(lat+.010,pi+.007)
        a.y+=.0004;b.y+=.0004
        tube('bear_back_panel_stitch_%02d'%i,[a,b],.00043,thread,.7)
    for side,label in [(-1,'L'),(1,'R')]:
        pts=[]
        for i in range(44):
            p=head_point(-1.12+i*2.13/43,side*1.12)
            normal=Vector((p.x/.326,p.y/.246,(p.z-.684)/.26)).normalized()
            pts.append(p+normal*.00018)
        tube('bear_head_'+label+'_panel_join',pts,.00038,thread,.65)
    # Ear contour and limb insertion seams are near-white and partially buried.
    for side,label in [(-1,'L'),(1,'R')]:
        pts=[]
        for i in range(20):
            a=.12*pi+i*.76*pi/19
            pts.append((side*.245+.049*cos(a),-.031,.910+.055*sin(a)))
        tube('bear_ear_'+label+'_edge_seam',pts,.0008,thread,.65)

    # A sparse, sub-millimetre minky nap is authored as one bounded triangle mesh.
    # Root scale in the final scene makes these fibres approximately 0.5-1.2 mm.
    # This is intentionally much shorter and lighter than the retired 68k fibres.
    import bisect
    rng=random.Random(2917)
    napmat=basic_material('fabric_bear_short_nap',(.865,.849,.811),.98)
    np=next(n for n in napmat.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    np.inputs['Sheen Weight'].default_value=.75;np.inputs['Sheen Roughness'].default_value=.76
    napverts=[];napfaces=[]
    padded=[o for o in made if o.data.materials[0] in [plush,headmat]]
    for obj in padded:
        obj.data.calc_loop_triangles();tris=list(obj.data.loop_triangles)
        areas=[];total=0
        for tri in tris:
            a,b,c=[obj.data.vertices[i].co for i in tri.vertices]
            total+=(b-a).cross(c-a).length*.5;areas.append(total)
        count=max(120,int(total*10500))
        for _ in range(count):
            tri=tris[bisect.bisect_left(areas,rng.random()*total)]
            a,b,c=[obj.data.vertices[i] for i in tri.vertices]
            u=sqrt(rng.random());v=rng.random();weights=(1-u,u*(1-v),u*v)
            p=a.co*weights[0]+b.co*weights[1]+c.co*weights[2]
            n=(a.normal*weights[0]+b.normal*weights[1]+c.normal*weights[2]).normalized()
            if obj==head and p.y<-.16:
                if (abs(abs(p.x)-.085)<.026 and abs(p.z-.721)<.029) or (abs(p.x)<.075 and .579<p.z<.680):continue
            t=n.cross(Vector((0,0,1)))
            if t.length<.1:t=n.cross(Vector((1,0,0)))
            t.normalize();b=n.cross(t).normalized();angle=rng.random()*2*pi
            axis=t*cos(angle)+b*sin(angle)
            length=.0014+rng.random()**1.7*.0021
            width=.00022+rng.random()*.00019
            p+=n*.00003
            base=len(napverts)
            napverts.extend([tuple(p-axis*width),tuple(p+axis*width),tuple(p+n*length+axis*length*.33)])
            napfaces.append((base,base+1,base+2))
    nap=mesh('bear_minky_surface_nap',napverts,napfaces,napmat)
    nap['toyNap']='Portable short-pile geometry, 0.48-1.2mm at final root scale; one mesh'

    bpy.context.view_layer.update()
    root['toyRealismRevision']='sewn-reference-v12'
    root['toyReference']='Photos docs/1.jpg, docs/2.jpg, docs/3.jpg; ordinary smile'
    root['toyConstruction']='Padded sewn panels, flat satin embroidery, cloth-dyed blush, tucked short limbs'
    report={'revision':'sewn-reference-v12','root':root.name,'location':list(root.location),'headWidth':.652,'bodyWidth':.460,'headBodyWidthRatio':.652/.460,'meshObjects':len(made),'vertices':sum(len(o.data.vertices) for o in made),'triangles':sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in made),'changes':['Sewn broad head with a gently squared chin','Small padded ears sunk into the head','Squat belly and tucked flattened short limbs','Nearly flush satin-stitched eyes, triangular nose and W mouth','Diffuse dyed-in vertex-color blush, no raised cheek discs','Actual millimetric chin/back seam indentation and pale stitches'],'runtimeVerification':'Offline geometry only. Re-export and rebake production GI; actual browser appearance requires WebGL validation.'}
    if include_desk and bpy.data.objects.get('Bear_desk_plush'):
        desk=bpy.data.objects['Bear_desk_plush']
        for old in list(desk.children_recursive):bpy.data.objects.remove(old,do_unlink=True)
        ratio=desk.matrix_world.to_scale().x/root.matrix_world.to_scale().x
        deskobjects=[]
        for ob in made:
            dupe=ob.copy();dupe.data=ob.data.copy();bpy.context.scene.collection.objects.link(dupe);dupe.parent=desk
            dupe.name='Bear_desk_plush__fabric_bear' if ob.name=='Bear_reference_plush__fabric_bear' else 'desk_'+ob.name
            for uv in dupe.data.uv_layers:
                for entry in uv.data:entry.uv*=ratio
            if ob.name=='bear_minky_surface_nap':
                # Equal-world-density nap, with sub-millimetre length at the tiny root.
                keep=max(1,round(1/(ratio*ratio)));vs=[];fs=[]
                for index,poly in enumerate(ob.data.polygons):
                    if index%keep:continue
                    a,b,c=[ob.data.vertices[i].co.copy() for i in poly.vertices]
                    base=(a+b)*.5
                    width_scale=min(2.0,1/ratio);length_scale=min(2.0,1/ratio)
                    i=len(vs);vs.extend([base+(a-base)*width_scale,base+(b-base)*width_scale,base+(c-base)*length_scale]);fs.append((i,i+1,i+2))
                me=bpy.data.meshes.new('Desk toy world-scale nap');me.from_pydata(vs,[],fs);me.update();me.materials.append(napmat);dupe.data=me
            elif ob.data.materials[0] in [plush,headmat]:
                bpy.ops.object.select_all(action='DESELECT');dupe.select_set(True);bpy.context.view_layer.objects.active=dupe
                mod=dupe.modifiers.new('Small toy sewn surface tessellation','DECIMATE');mod.ratio=.60;bpy.ops.object.modifier_apply(modifier=mod.name);dupe.select_set(False)
            deskobjects.append(dupe)
        desk['toyRealismRevision']='sewn-reference-v12';desk['toyConstruction']=root['toyConstruction'];desk['toyTextureScaleMetres']=.09
        report['deskToy']={'root':desk.name,'rootLocation':list(desk.location),'rootScale':list(desk.scale),'textureScaleMetres':.09,'triangles':sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in deskobjects)}
    report['textureScaleMetres']=.09
    report['supportContacts']=settle_toys_on_support()
    return report

apply_toy_realism = apply_toy

if __name__=='__main__':
    args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
    source=args[0] if args else os.path.join(OUT,'bearroom.blend')
    dest=args[1] if len(args)>1 else os.path.join(OUT,'toy-review','sewn-toy-review.blend')
    if os.path.abspath(source)==os.path.abspath(dest):raise RuntimeError('Standalone review refuses to overwrite the input scene; integrate apply_toy explicitly.')
    if source.endswith('.glb'):
        bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=os.path.abspath(source))
    else:bpy.ops.wm.open_mainfile(filepath=os.path.abspath(source))
    report=apply_toy();os.makedirs(os.path.dirname(dest),exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(dest))
    open(os.path.splitext(dest)[0]+'.json','w').write(json.dumps(report,indent=2))
    print('TOY_GEOMETRY_REVIEW',json.dumps(report))
