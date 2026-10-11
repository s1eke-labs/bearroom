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
    # Photo-derived silhouette: width 0.704 / height 0.622 normalized toy units.
    # These are construction ratios, not a claim to recover photo measurements.
    # The forehead is round, cheeks are gently full, and the lower panel is
    # pulled in by a sewn dart instead of ending in a broad flat capsule edge.
    st,ct=sin(lat),max(0,cos(lat))
    cl=ct**(.98 if lat>=0 else .91)
    z=.662+(.311 if lat>=0 else .311)*signpow(st,.95 if lat>=0 else .92)
    x=.352*cl*signpow(sin(phi),.98)
    y=-.257*cl*signpow(cos(phi),.96)
    # Broad stuffing asymmetry is smooth and deterministic, below 1% of width.
    wav=1+.006*sin(phi*3+.35)*cos(lat*2.3)+.003*sin(phi*5-lat*2.1)
    x*=wav*(1-.022*gauss(lat,-.78,.40))
    y*=1+.004*cos(phi*3+lat*2)+.003*sin(phi*4-lat*3)
    z+=.0028*sin(phi+.25)*ct**2+.0014*sin(phi*3-1.1)*ct
    # Gently flattened lower-front panel: chin seam pinches the fabric and
    # produces small flanking seam fullness, all in the actual mesh.
    front=max(0,cos(phi))**10
    dart=gauss(x,-.004,.0075)*gauss(z,.407,.051)*front
    dart_lips=(gauss(x,-.014,.006)+gauss(x,.005,.006))*gauss(z,.405,.045)*front
    y+=.0052*dart-.0008*dart_lips
    z+=.0018*gauss(x,-.004,.013)*gauss(z,.353,.031)*front
    # Back centre joint and real side panel seam contraction.
    back=gauss(x,0,.008)*max(0,-cos(phi))**10
    panel=gauss(abs(phi),1.28,.031)
    y*=1-(.0028*back+.0025*panel)/.257
    x*=1-.0030*panel/.352
    # A soft pair of tension creases where the head is stitched to the neck.
    neck=gauss(z,.384,.012)*gauss(abs(x),.137,.078)*front
    y+=.0011*neck
    return Vector((x,y,z))

def head_front(x,z,offset=0):
    # Solve both coordinates after asymmetry and seam deformation, so stitches
    # sit on the real textile surface rather than floating over an ideal ball.
    lo,hi=-pi/2,pi/2
    phi=0
    for _ in range(21):
        lat=(lo+hi)/2
        pl,ph=-pi/2,pi/2
        for _ in range(19):
            phi=(pl+ph)/2
            if head_point(lat,phi).x<x:pl=phi
            else:ph=phi
        if head_point(lat,phi).z<z:lo=lat
        else:hi=lat
    p=head_point((lo+hi)/2,phi)
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
        p.inputs['Specular IOR Level'].default_value=.18
        p.inputs['Sheen Weight'].default_value=.42
        p.inputs['Sheen Tint'].default_value=(.82,.81,.79,1)
        p.inputs['Sheen Roughness'].default_value=.72
        for n in m.node_tree.nodes:
            if n.type=='NORMAL_MAP':
                n.inputs['Strength'].default_value=.95 if name.startswith('fabric_bear') else .70
                n.uv_map='PhysicalSurfaceUV'
    m['toyRealismRevision']='photo-reference-v13'
    return m

def basic_material(name,color,rough=.95):
    m=bpy.data.materials.get(name) or bpy.data.materials.new(name);m.use_nodes=True
    p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough
    p.inputs['Specular IOR Level'].default_value=.19
    m.diffuse_color=(*color,1);return m


def conform_soft_soles(root, feet_names, support_tree, compression):
    """Resolve residual crown contact using stuffed-foot compliance, not head tilt.

    Keep the capped assembled pose. Translate each soft foot to its local support
    and fit only intersections of its underside to that support. Move its authored
    nap roots by the exact same interpolated deformation. No other parts change.
    """
    from mathutils.bvhtree import BVHTree
    from mathutils.geometry import barycentric_transform
    records=[];nap=bpy.data.objects.get('desk_bear_minky_surface_nap' if root.name=='Bear_desk_plush' else 'bear_minky_surface_nap')
    maps=[]
    def ground(p):
        hit,normal,index,distance=support_tree.ray_cast(p+Vector((0,0,.065)),Vector((0,0,-1)),.30)
        if hit is None:raise RuntimeError('Missing soft-foot support at '+str(tuple(p)))
        return hit.z
    for name in feet_names:
        foot=bpy.data.objects[name];foot.data.calc_loop_triangles()
        old=[foot.matrix_world@v.co for v in foot.data.vertices]
        tris=[tuple(t.vertices) for t in foot.data.loop_triangles]
        oldtree=BVHTree.FromPolygons(old,tris,all_triangles=True)
        new=[p.copy() for p in old]
        start=min(new,key=lambda p:p.z);initial=start.z-ground(start)
        shift=-initial-compression
        for p in new:p.z+=shift
        # Iterate because the lowest world vertex may change on a sloping crown.
        for iteration in range(16):
            for p in new:p.z=max(p.z,ground(p)-compression)
            low=min(new,key=lambda p:p.z);clear=low.z-ground(low)
            if abs(clear+compression)<.0000006:break
            shift=-clear-compression
            for p in new:p.z+=shift
        for p in new:p.z=max(p.z,ground(p)-compression)
        inverse=foot.matrix_world.inverted()
        for v,p in zip(foot.data.vertices,new):v.co=inverse@p
        foot.data.update()
        maps.append((oldtree,tris,old,new))
        final=min(new,key=lambda p:p.z)
        records.append({'foot':name,'initialSoleClearanceMm':initial*1000,'finalSoleClearanceMm':(final.z-ground(final))*1000,'maximumFootDeformationMm':max((a-b).length for a,b in zip(old,new))*1000,'minimumAllVertexSupportClearanceMm':min(p.z-ground(p) for p in new)*1000})
    if nap:
        # Geometry was authored as separate triangles with their root at (a+b)/2.
        inverse=nap.matrix_world.inverted();moved=0
        for poly in nap.data.polygons:
            if len(poly.vertices)!=3:continue
            ids=list(poly.vertices);points=[nap.matrix_world@nap.data.vertices[i].co for i in ids]
            base=(points[0]+points[1])*.5
            hits=[]
            for tree,tris,old,new in maps:
                loc,normal,index,distance=tree.find_nearest(base,.00020)
                if loc is not None:hits.append((distance,loc,index,tris,old,new))
            if not hits:continue
            distance,loc,index,tris,old,new=min(hits,key=lambda h:h[0]);i,j,k=tris[index]
            delta=barycentric_transform(loc,old[i],old[j],old[k],new[i],new[j],new[k])-loc
            if delta.length<.00000001:continue
            for vi,p in zip(ids,points):nap.data.vertices[vi].co=inverse@(p+delta)
            moved+=1
        nap.data.update()
        for r in records:r['napTrianglesMovedTotal']=moved
    return records


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
        # Existing settled candidates may be called again after support updates.
        # Recover their global-Y child pose so the 10 degree cap never compounds.
        child=bpy.data.objects[feet_names[0]]
        relative=child.matrix_world.to_quaternion() @ r.matrix_world.to_quaternion().inverted()
        accumulated_roll=-relative.to_euler('XYZ').y
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
        soft_foot_fit=conform_soft_soles(r,feet_names,bvh,compression)
        bpy.context.view_layer.update()
        final=contacts()
        r['toySettledOnSupport']=support_name
        results.append({'root':root_name,'support':support_name,'initialSoleClearanceMm':[c[2]*1000 for c in initial],'finalSoleClearanceMm':[c[2]*1000 for c in final],'childRollDegrees':math.degrees(accumulated_roll),'rootTransformUnchanged':True,'softFootConformance':soft_foot_fit})
    return results

def apply_toy(include_desk=True):
    root=bpy.data.objects.get('Bear_reference_plush')
    if root is None: raise RuntimeError('Expected Bear_reference_plush root; do not change the room coordinate system.')
    for o in list(root.children_recursive): bpy.data.objects.remove(o,do_unlink=True)
    # Stable source prevents name collisions and tint-stack drift on repeated
    # calls against an already-authored v12/v13 master, whose original material
    # may have been compacted away. This unused authoring seed is not exported.
    src=bpy.data.materials.get('V13_plush_authoring_seed')
    if src is None:
        basis=bpy.data.materials.get('fabric_bear') or bpy.data.materials.get('fabric_bear_sewn_plush')
        if basis is None:
            basis=next((m for m in bpy.data.materials if m.name.startswith('fabric_bear') and 'nap' not in m.name),None)
        if basis is None:basis=basic_material('fabric_bear',(.886,.876,.844))
        src=basis.copy();src.name='V13_plush_authoring_seed';src.use_fake_user=True
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
                phi=-pi+2*pi*j/n
                if fn==head_point:phi-=.34*sin(2*phi)
                vs.append(tuple(fn(lat,phi)));uvs.append(((phi+pi)/(2*pi)*up,i/r*vp))
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
    head=surface('bear_head_sewn_front_panel',head_point,headmat,128,88)
    colors=head.data.color_attributes.new(name='ToyFabricTint',type='FLOAT_COLOR',domain='POINT')
    for v,c in zip(head.data.vertices,colors.data):
        x,y,z=v.co
        a=.33*(gauss(x,-.188,.059)+gauss(x,.191,.057))*gauss(z,.590,.051)*max(0,min(1,(-y-.105)/.07))
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
                z=max(-rz+.007,z)
                y*=1-.017*gauss(x,.006,.014)*max(0,-cos(phi))**8
                # Slightly fuller lower belly, contracted neckline and arm joins.
                x*=1+.015*gauss(z,-.045,.11)-.021*gauss(z,.18,.035)
                y+=.0022*gauss(z,-.13,.012)*max(0,cos(phi))**6*gauss(x,.015,.17)
                z+=.0025*sin(phi*2+.4)*max(0,cos(lat))**2
            if role=='arm':
                # Lightly stuffed hanging pouch: fuller shoulder, tapered tip.
                x*=.82+.18*gauss(z,rz*.34,rz*.65)
                y*=.79+.21*gauss(z,rz*.32,rz*.69)
                x*=1-.055*gauss(z,rz*.58,rz*.15)
            if role=='foot':z=max(-rz+.004,z)
            xx=x*cos(tilt)+z*sin(tilt);zz=-x*sin(tilt)+z*cos(tilt)
            return Vector((cx+xx,cy+y,cz+zz))
        return surface(name,point,material or plush,64 if role=='body' else 40,44 if role=='body' else 30)
    volume('Bear_reference_plush__fabric_bear',(0,.006,.219),(.253,.181,.189),.86,.82,role='body')
    for side,label in [(-1,'L'),(1,'R')]:
        volume('bear_ear_'+label+'_padded',(side*(.247 if side<0 else .244),.002,.908 if side<0 else .902),(.050 if side<0 else .048,.031,.052 if side<0 else .048),.93,.92,tilt=side*(.30 if side<0 else .42),role='ear')
        volume('bear_arm_'+label+'_tucked',(side*.245,-.024,.274 if side<0 else .268),(.031,.047,.074 if side<0 else .077),.93,.95,tilt=side*-.20,role='arm')
        volume('bear_foot_'+label+'_soft',(side*.091,-.026,.018),(.052,.067,.067),.99,1.0,tilt=side*-.07,role='foot')
    volume('bear_tail_padded',(0,.176,.146),(.043,.037,.043),.9,.9)
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
        x,z=side*.085,.723+(.0015 if side<0 else -.0015)
        outline=[]
        for i in range(128):
            a=i*2*pi/128;w=1+.006*sin(a*7+.4*side)+.004*cos(a*13)+.002*sin(a*37)
            outline.append((x+.0215*w*cos(a),z+.024*w*sin(a)))
        patch('bear_eye_'+label+'_embroidery',outline,black,.00055)
        # Satin stitches follow the embroidered disk in closely spaced, flat thread rows.
        for j in range(-17,18):
            zz=z+j*.00131;dx=.0211*sqrt(max(0,1-((zz-z)/.024)**2))
            # Each satin row arches very slightly across the stuffed panel.
            pts=[head_front(x-dx+2*dx*t,zz+.00013*sin(t*pi+j),.00080+.00025*sin(t*pi)) for t in [0,.25,.5,.75,1]]
            tube('bear_eye_'+label+'_satin_%02d'%(j+17),pts,.00052,black,.52)
    nose_outline=[(-.023,.653),(-.025,.660),(-.021,.668),(-.009,.672),(.009,.672),(.021,.668),(.025,.660),(.023,.651),(.011,.628),(0,.622),(-.011,.628)]
    nose_outline=[(x*1.15,z-.008) for x,z in nose_outline]
    # A sewn rounded triangle, with a continuous edge rather than a faceted icon.
    rounded=[]
    for i in range(len(nose_outline)):
        p0,p1,p2,p3=[Vector(nose_outline[j%len(nose_outline)]) for j in [i-1,i,i+1,i+2]]
        for step in range(6):
            t=step/6
            pt=.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t)
            rounded.append(tuple(pt))
    patch('bear_nose_rounded_triangle',rounded,black,.00065)
    for j in range(1,41):
        z=.614+j*.00118;xs=[]
        for a,b in zip(rounded,rounded[1:]+rounded[:1]):
            if (a[1]<=z<b[1]) or (b[1]<=z<a[1]):xs.append(a[0]+(z-a[1])*(b[0]-a[0])/(b[1]-a[1]))
        if len(xs)>=2:
            tube('bear_nose_satin_%02d'%j,[head_front(min(xs),z,.0010),head_front(max(xs),z,.0010)],.00048,black,.50)
    # Smooth stitched W with vertical nose stem. Thin depth is cloth embroidery.
    def bezier2(a,b,c,d,steps=16):
        return [((1-t)**3*a[0]+3*(1-t)**2*t*b[0]+3*(1-t)*t*t*c[0]+t**3*d[0],(1-t)**3*a[1]+3*(1-t)**2*t*b[1]+3*(1-t)*t*t*c[1]+t**3*d[1]) for t in [i/steps for i in range(steps+1)]]
    mouth=bezier2((-.060,.616),(-.053,.587),(-.021,.587),(0,.610))+bezier2((0,.610),(.021,.587),(.053,.587),(.060,.616))[1:]
    mouth=[(x*1.12*(1+.02*sin(z*173)),z-.008+.001*sin(x*31)) for x,z in mouth]
    tube('bear_mouth_stitched_W',[head_front(x,z,.00065) for x,z in mouth],.0078,black,.10)
    tube('bear_mouth_stitched_stem',[head_front(0,z,.00070) for z in [.627,.620,.611,.602]],.0065,black,.12)
    for label,(x,z) in [('L',mouth[0]),('R',mouth[-1])]:
        patch('bear_mouth_'+label+'_rounded_tip',[(x+.0078*cos(i*2*pi/32),z+.0078*sin(i*2*pi/32)) for i in range(32)],black,.00080)

    # Small diagonal thread sections create satin-stitch breakup without frayed spikes.
    for j in range(1,len(mouth)-1):
        x,z=mouth[j];dx,dz=mouth[j+1][0]-mouth[j-1][0],mouth[j+1][1]-mouth[j-1][1];ln=math.hypot(dx,dz)
        if ln:
            nx,nz=-dz/ln*.0068,dx/ln*.0068
            tube('bear_mouth_satin_%02d'%j,[head_front(x-nx,z-nz,.0010),head_front(x+nx,z+nz,.0010)],.00048,black,.55)
    # Tiny cream construction stitches catch grazing light; the groove supplies shadow.
    for i in range(28):
        z=.358+i*.0045
        # Offset centre and irregular lengths are construction, not drawn stripes.
        xx=-.004+.00035*sin(i*1.9)
        tube('bear_chin_dart_stitch_%02d'%i,[head_front(xx-.0010,z,.00012),head_front(xx+.0010,z+.0008,.00012)],.00042,thread,.55)
    for i in range(48):
        lat=-1.30+i*2.56/47
        a=head_point(lat,pi-.007);b=head_point(lat+.010,pi+.007)
        a.y+=.0004;b.y+=.0004
        tube('bear_back_panel_stitch_%02d'%i,[a,b],.00043,thread,.7)
    for side,label in [(-1,'L'),(1,'R')]:
        pts=[]
        for i in range(44):
            p=head_point(-1.12+i*2.13/43,side*1.28)
            normal=Vector((p.x/.352,p.y/.257,(p.z-.662)/.311)).normalized()
            pts.append(p+normal*.00018)
        tube('bear_head_'+label+'_panel_join',pts,.00038,thread,.65)
    # The ear seam follows the compressed pouch and is buried in the rim.
    # No decorative nested hoop, which made the old ears look manufactured.
    for side,label in [(-1,'L'),(1,'R')]:
        ear=next(o for o in made if o.name=='bear_ear_'+label+'_padded')
        # A handful of minute thread bridges at the insertion, not a drawn rim.
        for j in range(9):
            xx=side*.247+(j-4)*.006
            zz=.925-abs(j-4)*.002
            tube('bear_ear_'+label+'_insertion_%02d'%j,
                 [(xx,-.020,zz),(xx+.0010,-.0204,zz+.0005)],.00034,thread,.5)

    # A sparse, sub-millimetre minky nap is authored as one bounded triangle mesh.
    # Root scale in the final scene makes these fibres approximately 0.24-0.72 mm.
    # This is intentionally much shorter and lighter than the retired 68k fibres.
    import bisect
    rng=random.Random(2917)
    napmat=basic_material('fabric_bear_short_nap',(.865,.849,.811),.98)
    np=next(n for n in napmat.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    np.inputs['Sheen Weight'].default_value=.42;np.inputs['Sheen Roughness'].default_value=.76
    napverts=[];napfaces=[]
    padded=[o for o in made if o.data.materials[0] in [plush,headmat]]
    for obj in padded:
        obj.data.calc_loop_triangles();tris=list(obj.data.loop_triangles)
        areas=[];total=0
        for tri in tris:
            a,b,c=[obj.data.vertices[i].co for i in tri.vertices]
            total+=(b-a).cross(c-a).length*.5;areas.append(total)
        count=max(120,int(total*8500))
        for _ in range(count):
            tri=tris[bisect.bisect_left(areas,rng.random()*total)]
            a,b,c=[obj.data.vertices[i] for i in tri.vertices]
            u=sqrt(rng.random());v=rng.random();weights=(1-u,u*(1-v),u*v)
            p=a.co*weights[0]+b.co*weights[1]+c.co*weights[2]
            n=(a.normal*weights[0]+b.normal*weights[1]+c.normal*weights[2]).normalized()
            if obj==head and p.y<-.16:
                if (abs(abs(p.x)-.085)<.026 and abs(p.z-.723)<.029) or (abs(p.x)<.075 and .572<p.z<.676):continue
            t=n.cross(Vector((0,0,1)))
            if t.length<.1:t=n.cross(Vector((1,0,0)))
            t.normalize();b=n.cross(t).normalized();angle=rng.random()*2*pi
            axis=t*cos(angle)+b*sin(angle)
            length=.0007+rng.random()**1.7*.0014
            width=.00009+rng.random()*.00008
            p+=n*.00003
            base=len(napverts)
            napverts.extend([tuple(p-axis*width),tuple(p+axis*width),tuple(p+n*length+axis*length*.33)])
            napfaces.append((base,base+1,base+2))
    nap=mesh('bear_minky_surface_nap',napverts,napfaces,napmat)
    nap['toyNap']='Portable short-pile geometry, 0.24-0.72mm at final root scale; one mesh'

    bpy.context.view_layer.update()
    root['toyRealismRevision']='photo-reference-v13'
    root['toyReference']='Photos docs/1.jpg, docs/2.jpg, docs/3.jpg; ordinary smile'
    root['toyConstruction']='Padded sewn panels, flat satin embroidery, cloth-dyed blush, tucked short limbs'
    report={'revision':'photo-reference-v13','root':root.name,'location':list(root.location),'headWidth':.704,'headHeight':.622,'headWidthHeightRatio':.704/.622,'bodyWidth':.506,'headBodyWidthRatio':.704/.506,'meshObjects':len(made),'vertices':sum(len(o.data.vertices) for o in made),'triangles':sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in made),'changes':['Photo-proportioned round head, taller cranium and shortened torso, pinched chin dart and asymmetric stuffing','Smaller compressed and asymmetric ears sunk into the head','Squat belly and tucked flattened short limbs','Nearly flush satin-stitched eyes, triangular nose and W mouth','Diffuse dyed-in vertex-color blush, no raised cheek discs','Actual millimetric chin/back seam indentation and pale stitches'],'runtimeVerification':'Offline geometry only. Re-export and rebake production GI; actual browser appearance requires WebGL validation.'}
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
        desk['toyRealismRevision']='photo-reference-v13';desk['toyConstruction']=root['toyConstruction'];desk['toyTextureScaleMetres']=.09
        report['deskToy']={'root':desk.name,'rootLocation':list(desk.location),'rootScale':list(desk.scale),'textureScaleMetres':.09,'triangles':sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in deskobjects)}
    report['textureScaleMetres']=.09
    report['supportContacts']=settle_toys_on_support()
    return report

apply_toy_realism = apply_toy

if __name__=='__main__':
    args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
    source=args[0] if args else os.path.join(OUT,'bearroom-realism.blend')
    dest=args[1] if len(args)>1 else os.path.join(OUT,'toy-review','v13','bear-v13-review.blend')
    if os.path.abspath(source)==os.path.abspath(dest):raise RuntimeError('Standalone review refuses to overwrite the input scene; integrate apply_toy explicitly.')
    if source.endswith('.glb'):
        bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=os.path.abspath(source))
    else:bpy.ops.wm.open_mainfile(filepath=os.path.abspath(source))
    report=apply_toy();os.makedirs(os.path.dirname(dest),exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(dest),compress=True)
    open(os.path.splitext(dest)[0]+'.json','w').write(json.dumps(report,indent=2))
    print('TOY_GEOMETRY_REVIEW',json.dumps(report))
