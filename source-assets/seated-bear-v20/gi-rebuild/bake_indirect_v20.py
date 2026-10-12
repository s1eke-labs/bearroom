"""Reproducible seated-bear v20 frozen-source, unit-calibrated diffuse indirect and sky bake.

Run after geometry freeze:
blender -b --factory-startup --python bake_indirect_v20.py -- \
  --source FINAL.blend --expected-source-sha256 FROZEN_SHA \
  --reference ../../bearroom-v17-source-persistence/baked-gi-v17/irradiance.json --output ../baked-gi-v20

The source .blend is read, never overwritten. Its exact bytes and this script are
hashed in the output. Receiver faces are invisible to all secondary/shadow rays.
Cycles DIFFUSE pass uses INDIRECT only; COLOR and DIRECT are explicitly disabled.
Data is unit-white Lambertian outgoing radiance L, not E: runtime applies E=pi*L.
"""
import argparse, hashlib, json, math, pathlib, sys, time
import bpy
import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree

ATLAS=256
TILE=8
COLS=32
FACE_HALF=.004
DIRECTIONS=((1,0,0),(-1,0,0),(0,1,0),(0,-1,0),(0,0,1),(0,0,-1))
RUNTIME_RANGES={'living':7,'piano':6,'desk':3.4,'kitchen':4.5,'dining':4,'bed':4,'reading':4,'entry':3,'bath':3.5,'stairs':5}


def sha(path):
    return hashlib.sha256(pathlib.Path(path).read_bytes()).hexdigest()


def bvec(v):
    """Runtime Three y-up to imported Blender z-up."""
    return Vector((v[0],-v[2],v[1]))


def rvec(v):
    return [float(v[0]),float(v[2]),float(-v[1])]


def linear_color(h):
    c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    return tuple(x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in c)


def diffuse_material(name,color):
    m=bpy.data.materials.new(name);m.use_nodes=True;n=m.node_tree.nodes;n.clear()
    bs=n.new('ShaderNodeBsdfDiffuse');bs.inputs['Color'].default_value=(*color,1)
    bs.inputs['Roughness'].default_value=0
    out=n.new('ShaderNodeOutputMaterial');m.node_tree.links.new(bs.outputs['BSDF'],out.inputs['Surface'])
    return m


def alpha_network_signature(socket):
    """Describe the actual upstream alpha network without evaluating its shading."""
    seen=set();records=[]
    def val(value):
        try:return list(value)
        except TypeError:return value
    def visit(node):
        if node.name in seen:return
        seen.add(node.name)
        record={'name':node.name,'type':node.type,'operation':getattr(node,'operation',None),'inputs':[]}
        if node.type=='TEX_IMAGE' and node.image:
            im=node.image
            record['image']={'name':im.name,'size':list(im.size),'packed':bool(im.packed_file),'packedSha256':hashlib.sha256(im.packed_file.data).hexdigest() if im.packed_file else None}
        for input in node.inputs:
            if not input.enabled:continue
            links=[(l.from_node.name,l.from_socket.name) for l in input.links]
            record['inputs'].append({'name':input.name,'value':val(input.default_value) if hasattr(input,'default_value') else None,'links':links})
            for link in input.links:visit(link.from_node)
        records.append(record)
    for link in socket.links:visit(link.from_node)
    return {'default':float(socket.default_value),'links':[(l.from_node.name,l.from_socket.name) for l in socket.links],'nodes':sorted(records,key=lambda r:r['name'])}


def audit_botanical_alpha(sources):
    """Require final scanned leaf silhouettes in actual normal GI transport."""
    plants=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.get('organicPlantV17',False)]
    if len(plants)!=5:raise ValueError('Expected five scanned botanical instances in frozen v19')
    included={o.name for o in sources};materials={}
    for o in plants:
        if o.name not in included:raise ValueError('Scanned foliage wrongly excluded from GI: '+o.name)
        for material in o.data.materials:
            if material.name in materials:continue
            principal=[n for n in material.node_tree.nodes if n.type=='BSDF_PRINCIPLED']
            if len(principal)!=1:raise ValueError('Unexpected botanical shader graph')
            alpha=principal[0].inputs['Alpha'];network=alpha_network_signature(alpha)
            if not alpha.is_linked:raise ValueError('Botanical opacity not driven by scanned texture')
            if material.get('alphaMode')!='MASK' or abs(material.get('alphaCutoff',-1)-.5)>1e-9 or material.use_backface_culling:raise ValueError('Botanical source MASK/double-sided contract differs')
            threshold=[n for n in network['nodes'] if n['type']=='MATH' and n['operation'] in ('GREATER_THAN','LESS_THAN') and len(n['inputs'])>1 and not n['inputs'][1]['links'] and abs(n['inputs'][1]['value']-.5)<1e-9]
            if not threshold:raise ValueError('Botanical source Cycles alpha lacks MASK threshold')
            images=[n.image for n in material.node_tree.nodes if n.type=='TEX_IMAGE' and n.image and n.image.channels==4 and 'diffuse_alpha' in n.image.name]
            if len(images)!=1 or not images[0].packed_file:raise ValueError('Botanical RGBA diffuse image is not packed')
            im=images[0];pixels=np.array(im.pixels[:],dtype=np.float32).reshape(-1,4);opacity=pixels[:,3]
            stats={'min':float(opacity.min()),'max':float(opacity.max()),'transparentFraction':float(np.mean(opacity<.5)),'opaqueFraction':float(np.mean(opacity>=.5))}
            if not 0<stats['transparentFraction']<1 or stats['max']<.99:raise ValueError('Botanical texture has no effective leaf cutout')
            materials[material.name]={'alphaNetwork':network,'packedDiffuseImage':im.name,'packedDiffuseSha256':hashlib.sha256(im.packed_file.data).hexdigest(),'alphaStats':stats,'doubleSided':True,'alphaMode':'MASK','alphaCutoff':.5,'normalTransportRetained':True}
    return {'objects':sorted(o.name for o in plants),'materials':materials,'allRetainedInTransport':True,'alphaSilhouetteTracedByCycles':True}


def black_control_material(material,cache,audit):
    """Zero reflected energy while retaining original texture/threshold alpha."""
    if material.name in cache:return cache[material.name]
    principal=[n for n in material.node_tree.nodes if n.type=='BSDF_PRINCIPLED'] if material.use_nodes else []
    alpha=principal[0].inputs['Alpha'] if len(principal)==1 else None
    if alpha is None or (not alpha.is_linked and alpha.default_value>=1):
        black=cache.setdefault('__opaque__',diffuse_material('GI_black_opaque_control',(0,0,0))) if '__opaque__' not in cache else cache['__opaque__']
        cache[material.name]=black;return black
    before=alpha_network_signature(alpha)
    black=material.copy();black.name='GI_black_cutout_'+material.name;nt=black.node_tree
    original=nt.nodes[principal[0].name];cloned_alpha=original.inputs['Alpha']
    after=alpha_network_signature(cloned_alpha)
    if before!=after:raise ValueError('Alpha graph changed during black control clone')
    diffuse=nt.nodes.new('ShaderNodeBsdfDiffuse');diffuse.inputs['Color'].default_value=(0,0,0,1);diffuse.inputs['Roughness'].default_value=0
    transparent=nt.nodes.new('ShaderNodeBsdfTransparent');transparent.inputs['Color'].default_value=(1,1,1,1)
    mixed=nt.nodes.new('ShaderNodeMixShader');mixed.inputs[0].default_value=cloned_alpha.default_value
    for link in cloned_alpha.links:nt.links.new(link.from_socket,mixed.inputs[0])
    nt.links.new(transparent.outputs[0],mixed.inputs[1]);nt.links.new(diffuse.outputs[0],mixed.inputs[2])
    for link in list(original.outputs['BSDF'].links):nt.links.new(mixed.outputs[0],link.to_socket)
    audit.append({'material':material.name,'blackMaterial':black.name,'alphaGraphPreserved':before==after,'alphaNetwork':before})
    cache[material.name]=black;return black


def prepare_scene(ref,samples):
    s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.device='CPU'
    s.cycles.samples=samples;s.cycles.seed=1729;s.cycles.use_denoising=False
    s.cycles.max_bounces=6;s.cycles.diffuse_bounces=4
    s.cycles.glossy_bounces=4;s.cycles.transmission_bounces=4
    s.cycles.use_adaptive_sampling=False
    s.render.bake.use_pass_color=False;s.render.bake.use_pass_direct=False;s.render.bake.use_pass_indirect=True
    s.render.bake.use_selected_to_active=False;s.render.bake.margin=0;s.render.bake.use_clear=True
    s.render.bake.target='IMAGE_TEXTURES'
    if not s.world:s.world=bpy.data.worlds.new('GI_world')
    s.world.use_nodes=True;n=s.world.node_tree.nodes;n.clear()
    bg=n.new('ShaderNodeBackground');bg.inputs['Color'].default_value=(0,0,0,1);bg.inputs['Strength'].default_value=0
    out=n.new('ShaderNodeOutputWorld');s.world.node_tree.links.new(bg.outputs[0],out.inputs[0])
    for o in list(bpy.data.objects):
        if o.type=='LIGHT':bpy.data.objects.remove(o,do_unlink=True)
    excluded=set(ref.get('excluded',[]));actual=[];sources=[]
    # The v17 mirror was a glass surface and therefore appears in its historical
    # exclusion list. The rebuilt v19 mirror is opaque silvered metal. Determine
    # that case from the final source; do not let the old material classification
    # silently omit the new stationary opaque reflector from transport.
    mirror=bpy.data.objects.get('bath_mirror');reclassified=[]
    if mirror and mirror.type=='MESH' and mirror.data.materials and all(m and m.name=='bath19_silvered_mirror' for m in mirror.data.materials):
        for m in mirror.data.materials:
            principal=[n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'] if m.use_nodes else []
            if len(principal)!=1 or principal[0].inputs['Transmission Weight'].is_linked or principal[0].inputs['Transmission Weight'].default_value!=0 or principal[0].inputs['Alpha'].is_linked or principal[0].inputs['Alpha'].default_value!=1:raise ValueError('Rebuilt silvered mirror is not fully opaque')
        if mirror.name in excluded:excluded.remove(mirror.name);reclassified.append(mirror.name)
    def exclude(o):
        # Exact mesh-name predicate from fixed-camera applyCutaway: x>0,z>0.
        # This is independent of temporary lower/upper view clipping.
        if 'wall_east' in o.name or 'wall_south' in o.name:return True
        p=o
        while p:
            if (p.name in excluded or p.name.startswith('anim_') or p.name.startswith('plush_fibers_')
                or p.name.startswith('piano_key_') or p.name=='Exterior_city'
                or p.get('physicalPlush',False) or p.get('toyNap',False)
                or (p.get('pcCaseV16',False) and p.get('pcSpinAxis') in ('x','y','z'))):
                return True
            p=p.parent
        if o.type=='MESH' and any(m and 'glass' in m.name.lower() for m in o.data.materials):return True
        return False
    for o in s.objects:
        if exclude(o):
            o.hide_render=True;actual.append(o.name)
        elif o.type in {'MESH','CURVE','SURFACE','FONT','META'} and not o.hide_render:sources.append(o)
    # Animated emissions do not participate in the frozen indirect bake.
    disabled=[]
    for m in bpy.data.materials:
        if not m.use_nodes:continue
        for n in m.node_tree.nodes:
            if n.type=='BSDF_PRINCIPLED' and 'Emission Strength' in n.inputs:
                sock=n.inputs['Emission Strength']
                for link in list(sock.links):m.node_tree.links.remove(link)
                if sock.default_value!=0:disabled.append(m.name)
                sock.default_value=0
            elif n.type=='EMISSION':
                sock=n.inputs['Strength']
                for link in list(sock.links):m.node_tree.links.remove(link)
                sock.default_value=0;disabled.append(m.name)
    occluders={'invariantCutawayExcluded':[o.name for o in s.objects if o.type=='MESH' and ('wall_east' in o.name or 'wall_south' in o.name)],'retainedBathroom':[o.name for o in sources if 'cutaway_bathroom' in o.name],'retainedLoftSlabs':[o.name for o in sources if 'slab' in o.name],'temporaryFloorClippingApplied':False}
    required=['cutaway_bathroom_partition','cutaway_bathroom_rear_privacy','cutaway_bathroom_side','cutaway_upper_slab']
    source_names={o.name for o in sources}
    for name in required:
        if bpy.data.objects.get(name) and name not in source_names:raise ValueError('Required privacy/slab occluder omitted: '+name)
    occluders['finalOpaqueReclassifiedFromLegacyGlass']=reclassified
    ref['_occluderAudit']=occluders
    return s,sources,sorted(actual),sorted(set(disabled))


def add_light(name,kind,pos,target,color):
    d=bpy.data.lights.new('GI_'+name,kind);o=bpy.data.objects.new('GI_'+name,d);bpy.context.scene.collection.objects.link(o)
    o.location=bvec(pos);o.rotation_euler=(bvec(target)-o.location).to_track_quat('-Z','Y').to_euler()
    d.color=linear_color(color)
    if kind=='SUN':d.angle=math.radians(.526)
    else:d.shadow_soft_size=.025
    if kind=='SPOT':d.spot_size=math.pi*.84;d.spot_blend=.7
    return o


def configure_lights(ref):
    lights=[]
    for name in ('sun','moon'):
        q=ref['lights'][name];o=add_light(name,'SUN',q['position'],q['target'],q['color'])
        lights.append((o,q['night'],q['day']))
    desc=json.loads(json.dumps(ref['lights']))
    for q in desc['lamps']:
        anchor=bpy.data.objects.get('light_'+q['name'])
        if anchor:
            actual=rvec(anchor.matrix_world.translation)
            delta=(Vector(actual)-Vector(q['position'])).length
            if delta>1e-4:
                q['position']=actual
                q['anchorRelocationFromReference']=round(delta,6)
                # Runtime default aim remains floor below; living focuses bear bound.
                if q['name']!='living':q['target']=[actual[0],3.12 if actual[1]>3.2 else .12,actual[2]]
        if q['name']=='living':
            # The seated-bear edit must not re-aim the existing room fixture.
            # This is the accepted v17/v19 target, independently paired to the
            # pre-edit source and runtime before tracing the new geometry.
            q['target']=list(next(l['target'] for l in ref['lights']['lamps'] if l['name']=='living'))
        o=add_light(q['name'],'SPOT' if q['spot'] else 'POINT',q['position'],q['target'],q['color'])
        # Cycles point/spot energy is radiant power: I = P/(4*pi).
        lights.append((o,q['nightCandela']*4*math.pi,q['dayCandela']*4*math.pi))
        q['cyclesPowerFactor']=4*math.pi
        q['runtimeRange']=RUNTIME_RANGES[q['name']]
    return lights,desc


def validate_light_calibration(actual,baseline,allowed_living_target_delta=(0,0,0)):
    """Only the explicitly authorized rigid-bear pose focus delta may vary."""
    normalized=json.loads(json.dumps(actual));current=next(q for q in normalized['lamps'] if q['name']=='living');prior=next(q for q in baseline['lamps'] if q['name']=='living')
    newtarget=list(current['target']);delta=[newtarget[i]-prior['target'][i] for i in range(3)]
    if max(abs(delta[i]-allowed_living_target_delta[i]) for i in range(3))>1e-5:raise ValueError('Living-light focus delta is not the explicitly authorized bear pose: '+repr(delta))
    current['target']=list(prior['target'])
    if normalized!=baseline:raise ValueError('A room light value other than the authorized living focus changed')
    return {'passed':True,'roomLightAnchorsPowersColorsRangesUnchanged':True,'livingTargetReference':prior['target'],'livingTargetActual':newtarget,'livingTargetDeltaRuntimeXYZ':delta,'authorizedLivingTargetDeltaRuntimeXYZ':list(allowed_living_target_delta),'maximumDeltaErrorToleranceMetres':1e-5,'reason':'Seated-bear v20 revision: every analytic light anchor, power, color, range and target is unchanged from accepted v17/v19. The established living target is frozen instead of following the edited geometry bounds.'}


def configure_sky_world(ref,strength=None):
    """Calibrated uniform upper-hemisphere sky, black lower hemisphere.

    Analytic environment-map source, generated in linear radiance. It contains
    no scene lighting or occlusion; both are computed by Cycles transport.
    This image exists only during bake/review and is never exported to runtime.
    """
    sky=ref.get('skyReference',ref.get('sky',{}).get('world',{}))
    color=sky.get('colorLinear',[.78,.86,1.0])
    strength=sky.get('dayStrength',.12) if strength is None else strength
    s=bpy.context.scene
    if not s.world:s.world=bpy.data.worlds.new('GI_sky_world')
    s.world.use_nodes=True;nt=s.world.node_tree;nt.nodes.clear()
    w,h=64,32
    img=bpy.data.images.get('GI_analytic_upper_sky') or bpy.data.images.new('GI_analytic_upper_sky',width=w,height=h,float_buffer=True)
    img.colorspace_settings.name='Non-Color'
    pixels=[]
    for y in range(h):
        rgb=color if y>=h//2 else [0,0,0]
        for x in range(w):pixels.extend([*rgb,1])
    img.pixels[:]=pixels;img.update()
    tex=nt.nodes.new('ShaderNodeTexEnvironment');tex.image=img;tex.projection='EQUIRECTANGULAR';tex.interpolation='Closest'
    bg=nt.nodes.new('ShaderNodeBackground');bg.inputs['Strength'].default_value=strength
    out=nt.nodes.new('ShaderNodeOutputWorld');nt.links.new(tex.outputs['Color'],bg.inputs['Color']);nt.links.new(bg.outputs[0],out.inputs[0])
    return {'model':'uniform upper-hemisphere diffuse sky; black lower hemisphere; full geometry visibility traced by Cycles','colorLinear':color,'dayStrength':strength,'nightStrength':0,'environmentResolution':[w,h]}


def probe_positions(ref):
    nx,ny,nz=ref['dimensions'];probes=[]
    old=ref.get('probeRelocations',[])
    for ri,reg in enumerate(ref['regions']):
        for z in range(nz):
            for y in range(ny):
                for x in range(nx):
                    p=[reg['min'][i]+(reg['max'][i]-reg['min'][i])*v/(n-1) for i,v,n in zip(range(3),(x,y,z),(nx,ny,nz))]
                    q=p.copy()
                    for move in old:
                        if (Vector(move['grid'])-Vector(p)).length<1e-5:q=list(move['sample']);break
                    probes.append({'region':ri,'index':len(probes),'grid':p,'sample':q})
    return probes


def enclosed_probe_keepouts(sources):
    """Actual final-scene cabinet envelopes, including hollow unlit interiors.

    Nearest-face orientation cannot distinguish an interior cabinet air pocket
    from room air. The retained authoring components provide explicit envelopes.
    Do not use a whole kitchen/furniture group which includes occupied room air.
    """
    roots={'F18_wardrobe'}
    prefixes=('desk_pedestal','nightstand','tv_oak_cabinet','upper_cabinet','vanity_cabinet','shoe_cabinet','kitchen_base','F14_kitchen__ceramic_ivory_part_000','F14_kitchen__ceramic_ivory_part_005')
    groups={}
    for o in sources:
        parent=o
        while parent.parent:parent=parent.parent
        # v15 authoring retains the original cabinet name on its first panel;
        # thin siblings use <original>_v15_<part>. Their UNION is the enclosed
        # carcass air envelope. Per-panel keepouts would disappear below 0.10m.
        component_group=o.name.split('_v15_',1)[0]
        key=parent.name if parent.name in roots else (component_group if component_group.startswith(prefixes) else None)
        # Explicit final-source cabinet tags include v19 drawer/front panels in
        # the same enclosure without swallowing unrelated bathroom room air.
        authored_group=o.get('giKeepoutGroup')
        if authored_group:
            if authored_group!='vanity_cabinet':raise ValueError('Unknown authored v19 cabinet keepout group: '+repr(authored_group))
            key=authored_group
        if key:groups.setdefault(key,[]).append(o)
    keepouts=[]
    for name,objects in sorted(groups.items()):
        pts=[o.matrix_world@Vector(v) for o in objects for v in o.bound_box]
        lo=Vector(tuple(min(p[i] for p in pts) for i in range(3)))
        hi=Vector(tuple(max(p[i] for p in pts) for i in range(3)))
        if min(hi-lo)<.10:continue
        exits=None
        # Avoid moving into closed back-wall gaps merely because they are nearer.
        if name=='F18_wardrobe':exits=((0,'hi'),)
        elif name.startswith(('upper_cabinet','kitchen_base','F14_kitchen__ceramic_ivory_part_000','F14_kitchen__ceramic_ivory_part_005')):exits=((1,'lo'),(2,'hi'))
        elif name=='vanity_cabinet' and any(o.get('giKeepoutGroup')=='vanity_cabinet' for o in objects):
            # Rebuilt vanity drawers face Blender -Y (runtime +Z). Permit the
            # actual open room-facing exit, left side and above, never the
            # narrow rear/east wall gap. Final-source BVH still verifies each.
            exits=((1,'lo'),(0,'lo'),(2,'hi'))
        elif name.startswith(('vanity_cabinet','shoe_cabinet')):exits=((0,'lo'),(2,'hi'))
        keepouts.append({'name':name,'lo':lo,'hi':hi,'objects':{o.name for o in objects},'exitFaces':exits})
    return keepouts


def refresh_probe_clearance(probes,sources,ref):
    """Keep interpolation grid fixed; sample only clear room air.

    Enclosed cabinet envelopes are explicit exclusion volumes, even where their
    interiors are hollow. Other nearby surfaces retain the signed-face test.
    Local moves stay within 450 mm and preserve floor/bathroom region. Unresolved
    locations are physically sampled at the nearest clear same-region location;
    both sample relocation and reconstruction are recorded, never sampled inside.
    """
    verts=[];faces=[];owners=[];dg=bpy.context.evaluated_depsgraph_get()
    for obj in sources:
        ob=obj.evaluated_get(dg);me=ob.to_mesh();base=len(verts)
        verts.extend(obj.matrix_world@v.co for v in me.vertices)
        faces.extend(tuple(base+i for i in p.vertices) for p in me.polygons)
        owners.extend([obj.name]*len(me.polygons));ob.to_mesh_clear()
    tree=BVHTree.FromPolygons(verts,faces,all_triangles=False)
    keepouts=enclosed_probe_keepouts(sources)
    cabinet_owners={name for box in keepouts for name in box['objects']}
    moved=[];invalid=[];valid=[]
    def bath(p):
        q=rvec(p)
        return 2.465<q[0]<4.875 and .045<q[1]<2.82 and -3.95<q[2]<-2.057
    def inside(p,box,margin=.014):
        return all(box['lo'][i]-margin<p[i]<box['hi'][i]+margin for i in range(3))
    def blocked(p):return [b for b in keepouts if inside(p,b)]
    def permitted(q,origin):
        return (q-origin).length<=.45 and (q.z>=2.99)==(origin.z>=2.99) and bath(q)==bath(origin)
    def clear(q):
        loc,n,idx,d=tree.find_nearest(q)
        # Cabinet shell winding can face its interior. Outside the explicit
        # envelope, its backface orientation is not evidence of solid interior.
        outward=(q-loc).dot(n)>=.014 or owners[idx] in cabinet_owners
        return not blocked(q) and d>=.014 and (d>.45 or outward)
    for p in probes:
        origin=bvec(p['grid']);q=origin.copy();ok=False
        for attempt in range(20):
            boxes=blocked(q)
            if boxes:
                candidates=[]
                for box in boxes:
                    for axis,side in box['exitFaces'] or tuple((i,j) for i in range(3) for j in ('lo','hi')):
                        candidate=q.copy();candidate[axis]=box[side][axis]+(-.025 if side=='lo' else .025)
                        if permitted(candidate,origin) and clear(candidate):candidates.append(candidate)
                if not candidates:break
                q=min(candidates,key=lambda v:(v-origin).length_squared);ok=True;break
            if clear(q):ok=True;break
            loc,n,idx,d=tree.find_nearest(q);candidate=loc+n*.025
            if not permitted(candidate,origin):break
            q=candidate
        p['sample']=rvec(q if ok else origin)
        if not ok:invalid.append(p)
        else:
            valid.append(p)
            if (q-origin).length>1e-5:
                moved.append({'grid':p['grid'],'sample':p['sample'],'distance':round((q-origin).length,6),'method':'local-clearance'})
    reconstruction=[];count=math.prod(ref['dimensions'])
    for p in invalid:
        candidates=[v for v in valid if v['region']==p['region']]
        if not candidates:raise ValueError('No valid probes in region')
        nearest=min(candidates,key=lambda v:(Vector(v['grid'])-Vector(p['grid'])).length_squared)
        p['sample']=nearest['sample'].copy()
        reconstruction.append({'region':ref['regions'][p['region']]['name'],'probe':p['index']%count,'nearestValid':nearest['index']%count,'grid':p['grid'],'sample':p['sample']})
        moved.append({'grid':p['grid'],'sample':p['sample'],'distance':round((bvec(p['sample'])-bvec(p['grid'])).length,6),'method':'same-region-nearest-clear-fallback'})
    violations=[{'index':p['index'],'sample':p['sample'],'enclosures':[b['name'] for b in blocked(bvec(p['sample']))]} for p in probes if not clear(bvec(p['sample']))]
    if violations:raise ValueError('Probe clearance audit failed: '+json.dumps(violations))
    ref['_probePlacementAudit']={'checked':len(probes),'clearanceMetres':.014,'maxLocalMoveMetres':.45,'enclosedKeepouts':[{'name':b['name'],'min':rvec(Vector((b['lo'].x,b['hi'].y,b['lo'].z))),'max':rvec(Vector((b['hi'].x,b['lo'].y,b['hi'].z)))} for b in keepouts],'insideEnclosedCabinetSamples':0,'violations':violations,'samples':[{'index':p['index'],'grid':p['grid'],'sample':p['sample']} for p in probes]}
    return moved,reconstruction


def make_receivers(probes):
    verts=[];faces=[];uvs=[]
    for p in probes:
        for face,d in enumerate(DIRECTIONS):
            n=bvec(d);helper=Vector((0,0,1)) if abs(n.z)<.9 else Vector((0,1,0))
            u=helper.cross(n).normalized();v=n.cross(u).normalized()
            center=bvec(p['sample'])+n*FACE_HALF
            base=len(verts)
            verts.extend(tuple(center+(u*a+v*b)*FACE_HALF) for a,b in ((-1,-1),(1,-1),(1,1),(-1,1)))
            faces.append(tuple(range(base,base+4)))
            tile=(p['index']*6+face);tx=tile%COLS*TILE;ty=tile//COLS*TILE
            # Four-by-four inner texels sampled; two-pixel gutters avoid atlas bleed.
            uvs.extend(((tx+a)/ATLAS,(ty+b)/ATLAS) for a,b in ((2,2),(6,2),(6,6),(2,6)))
    mesh=bpy.data.meshes.new('GI_probe_receivers');mesh.from_pydata(verts,[],faces);mesh.update()
    uv=mesh.uv_layers.new(name='BakeUV')
    for loop,coord in zip(uv.data,uvs):loop.uv=coord
    o=bpy.data.objects.new('GI_probe_receivers',mesh);bpy.context.scene.collection.objects.link(o)
    for key in ('visible_camera','visible_diffuse','visible_glossy','visible_transmission','visible_shadow'):
        setattr(o,key,False)
    m=diffuse_material('GI_unit_white_receivers',(1,1,1));mesh.materials.append(m)
    image=bpy.data.images.new('GI_indirect_atlas',width=ATLAS,height=ATLAS,float_buffer=True)
    image.colorspace_settings.name='Non-Color'
    tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image;m.node_tree.nodes.active=tex
    return o,image


def extract(image,probes):
    a=np.array(image.pixels[:],dtype=np.float64).reshape(ATLAS,ATLAS,4)
    result=[]
    for p in probes:
        for face in range(6):
            tile=p['index']*6+face;x=tile%COLS*TILE;y=tile//COLS*TILE
            sample=a[y+2:y+6,x+2:x+6,:3].mean(axis=(0,1))
            if not np.isfinite(sample).all():raise ValueError('Non-finite Cycles radiance')
            result.extend(float(max(0,q)) for q in sample)
    return result


def reconstruct_invalid(values,ref):
    out=values.copy();count=math.prod(ref['dimensions']);regions=[r['name'] for r in ref['regions']]
    for entry in ref.get('invalidProbeReconstruction',[]):
        offset=regions.index(entry['region'])*count*18
        dest=offset+entry['probe']*18;src=offset+entry['nearestValid']*18
        out[dest:dest+18]=values[src:src+18]
    return out


def bake_state(scene,receiver,image,probes,outdir,name,samples):
    scene.cycles.samples=samples
    bpy.ops.object.select_all(action='DESELECT');receiver.hide_set(False);receiver.select_set(True)
    bpy.context.view_layer.objects.active=receiver
    start=time.monotonic();bpy.ops.object.bake(type='DIFFUSE')
    values=extract(image,probes)
    image.filepath_raw=str(outdir/(name+'-radiance.exr'));image.file_format='OPEN_EXR';image.save()
    print('GI_BAKE_STATE',json.dumps({'state':name,'seconds':round(time.monotonic()-start,3),'mean':sum(values)/len(values),'max':max(values)}),flush=True)
    return values


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--source',required=True);ap.add_argument('--expected-source-sha256',required=True);ap.add_argument('--allowed-living-target-delta',nargs=3,type=float,default=[0,0,0]);ap.add_argument('--reference',required=True);ap.add_argument('--output',required=True);ap.add_argument('--samples',type=int,default=96);ap.add_argument('--control-samples',type=int,default=32)
    args=ap.parse_args(sys.argv[sys.argv.index('--')+1:]);source=pathlib.Path(args.source).resolve();refpath=pathlib.Path(args.reference).resolve();outdir=pathlib.Path(args.output).resolve();outdir.mkdir(parents=True,exist_ok=True)
    sourcehash=sha(source)
    if args.allowed_living_target_delta!=[0,0,0]:raise ValueError('Seated-bear v20 authorizes no living focus delta')
    if sourcehash!=args.expected_source_sha256.lower():raise RuntimeError('Source is not the explicitly approved frozen SHA')
    if args.samples!=96 or args.control_samples!=32:raise ValueError('Production seated-bear v20 requires genuine 96-sample endpoints and 32-sample controls')
    refhash=sha(refpath)
    if refhash!='107ef50f0ec636d401df4631133ea0061ef14944ab2c325c16b39ea072962971':raise RuntimeError('Reference is not the accepted frozen v17 GI baseline')
    ref=json.loads(refpath.read_text());bpy.ops.wm.open_mainfile(filepath=str(source))
    start=time.monotonic();scene,sources,excluded,emissions=prepare_scene(ref,args.samples)
    lights,lightdesc=configure_lights(ref)
    light_calibration_audit=validate_light_calibration(lightdesc,ref['lights'],args.allowed_living_target_delta)
    rotor_roots=sorted(o.name for o in scene.objects if o.get('pcCaseV16',False) and o.get('pcSpinAxis') in ('x','y','z'))
    if len(rotor_roots)!=9:raise ValueError('Expected all nine dynamic PC rotor roots')
    if not all(n in excluded for n in rotor_roots):raise ValueError('A dynamic PC rotor participates in bake')
    live_emissions=[]
    for m in bpy.data.materials:
        if not m.use_nodes:continue
        for node in m.node_tree.nodes:
            socket=node.inputs.get('Emission Strength') if node.type=='BSDF_PRINCIPLED' else (node.inputs.get('Strength') if node.type=='EMISSION' else None)
            if socket and (socket.is_linked or socket.default_value!=0):live_emissions.append(m.name)
    if live_emissions:raise ValueError('Residual emissive transport: '+repr(live_emissions))
    botanical_audit=audit_botanical_alpha(sources)
    probes=probe_positions(ref)
    relocations,reconstructions=refresh_probe_clearance(probes,sources,ref)
    placement_ref={**ref,'invalidProbeReconstruction':reconstructions}
    print('GI_PROBE_CLEARANCE',json.dumps({'relocations':relocations,'reconstructions':reconstructions}),flush=True)
    (outdir/'probe-placement-audit.json').write_text(json.dumps(ref['_probePlacementAudit'],indent=2)+'\n')
    receiver,image=make_receivers(probes)
    data={k:ref[k] for k in ('version','method','dimensions','regions','bathroomSelection','rearSplit','floorSplit','directions','sampleOrder','quantity')}
    data.update(sourceSha256=sourcehash,sourceFilename=source.name,bakeScriptSha256=sha(__file__),referenceSha256=refhash,referenceFilename=refpath.name,productionRevision='seated-bear-v20',frozenSourceVerified=True,dynamicPCRotorRootsExcluded=rotor_roots,residualEmissiveTransportMaterials=live_emissions,botanicalAlphaAudit=botanical_audit,lightCalibrationAudit=light_calibration_audit,blenderVersion=bpy.app.version_string,samples=args.samples,engine='CYCLES',device='CPU',useDenoising=False,passDirect=False,passIndirect=True,passColor=False,atlasSize=[ATLAS,ATLAS],runtimeGain=1,maxBounces=6,diffuseBounces=4,seed=1729,worldStrength=0,excluded=excluded,disabledEmissiveMaterials=emissions,probeRelocations=relocations,invalidProbeReconstruction=reconstructions,probePlacementMethod='Published interpolation grid; local samples have at least 14mm clearance, use 25mm target clearance and at most 450mm displacement, and exclude actual final-source enclosed cabinet volumes. Unresolved locations are physically sampled at the nearest clear same-region location and explicitly reconstructed.',enclosedCabinetSampleViolations=0,probePlacementAuditSha256=sha(outdir/'probe-placement-audit.json'),lights=lightdesc,displayedSceneOccluderAudit=ref['_occluderAudit'],states={})
    raw={}
    for si,name in enumerate(('night','day')):
        for light,night,day in lights:light.data.energy=(night,day)[si]
        raw[name]=bake_state(scene,receiver,image,probes,outdir,name,args.samples)
        data['states'][name]=[round(v,6) for v in reconstruct_invalid(raw[name],placement_ref)]
    # Separate, occluded sky transport: no analytic or emissive source energy.
    for light,night,day in lights:light.data.energy=0
    skyconfig=configure_sky_world(ref)
    scene.render.bake.use_pass_direct=True
    skyday=bake_state(scene,receiver,image,probes,outdir,'sky-day',args.samples)
    skyday=reconstruct_invalid(skyday,placement_ref)
    data['sky']={'sourceSha256':sourcehash,'quantity':'unit-white Lambertian radiance','method':'Cycles DIFFUSE direct+indirect, world only','analyticLights':False,'emissiveSurfaces':False,'samples':args.samples,'passDirect':True,'passIndirect':True,'passColor':False,'runtimeGain':1,'world':skyconfig,'states':{'day':[round(v,6) for v in skyday],'night':[0.0]*len(skyday)}}
    if max(skyday)<=0:raise ValueError('Sky bake produced no radiance')
    # Black-surface response control proves ANALYTIC INDIRECT is bounced energy.
    black_cache={};alpha_control_audit=[]
    for o in sources:
        if len(o.data.materials):
            for i in range(len(o.data.materials)):
                material=o.data.materials[i]
                if material and material.name.startswith('GI_black_'):continue
                o.data.materials[i]=black_control_material(material,black_cache,alpha_control_audit) if material else diffuse_material('GI_black_empty_slot',(0,0,0))
        else:o.data.materials.append(diffuse_material('GI_black_empty',(0,0,0)))
    botanical_materials=set(botanical_audit['materials'])
    if not botanical_materials.issubset({x['material'] for x in alpha_control_audit}):raise ValueError('Botanical alpha silhouette not preserved in black control')
    data['blackControlAlphaAudit']={'method':'All reflecting closures become zero-albedo diffuse; original opacity texture and MASK threshold graphs are copied unchanged into transparent/black-diffuse mix shaders. Cutout silhouettes remain unchanged in both controls.','materials':alpha_control_audit,'botanicalSilhouettePreserved':True}
    configure_sky_world(ref,0)
    for light,night,day in lights:light.data.energy=day
    scene.render.bake.use_pass_direct=False
    ctrl=bake_state(scene,receiver,image,probes,outdir,'black-control',args.control_samples)
    mean=sum(ctrl)/len(ctrl);original=sum(raw['day'])/len(raw['day']);ratio=mean/max(original,1e-12)
    data['materialResponseControl']={'method':'identical day analytic sources with all source surfaces replaced by black diffuse with original alpha cutouts preserved; world zero; direct disabled','samples':args.control_samples,'meanRadiance':mean,'originalDayMeanRadiance':original,'ratio':ratio,'passed':ratio<.001}
    if not data['materialResponseControl']['passed']:raise ValueError('Material-response control failed')
    # Direct sky correctly survives black surroundings. It is not bounced-only GI.
    for light,night,day in lights:light.data.energy=0
    configure_sky_world(ref)
    scene.render.bake.use_pass_direct=True
    skyctrl=bake_state(scene,receiver,image,probes,outdir,'sky-black-surroundings',args.control_samples)
    skymean=sum(skyctrl)/len(skyctrl)
    data['sky']['blackSurroundingsControl']={'method':'same sky source; analytic lights zero; all surroundings black with original alpha cutouts preserved; direct sky intentionally retained','samples':args.control_samples,'meanRadiance':skymean,'originalSkyMeanRadiance':sum(skyday)/len(skyday),'passed':skymean>0 and all(math.isfinite(v) and v>=0 for v in skyctrl)}
    if not data['sky']['blackSurroundingsControl']['passed']:raise ValueError('Sky direct transport control failed')
    # Absolute unit/direction calibration with geometry removed: upper facing
    # receiver must return L=world radiance; lower facing receiver returns zero.
    for o in sources:o.hide_render=True
    unoccluded=bake_state(scene,receiver,image,probes,outdir,'sky-unoccluded-calibration',args.control_samples)
    face_means=[[sum(unoccluded[k*18+f*3+c] for k in range(len(probes)))/len(probes) for c in range(3)] for f in range(6)]
    factors=[.5,.5,1,0,.5,.5]
    expected=[[skyconfig['colorLinear'][c]*skyconfig['dayStrength']*factors[f] for c in range(3)] for f in range(6)]
    error=max(abs(face_means[f][c]-expected[f][c]) for f in range(6) for c in range(3))
    data['sky']['unoccludedCalibration']={'method':'all source geometry hidden; same upper-hemisphere sky; unit-white receivers; L equals world radiance on upward face','samples':args.control_samples,'faceRadianceRGB':face_means,'expectedFaceRadianceRGB':expected,'maxAbsoluteError':error,'tolerance':.003,'passed':error<.003}
    if not data['sky']['unoccludedCalibration']['passed']:raise ValueError('Sky hemisphere/unit calibration failed')
    for name in ('night','day'):
        if any(a+b>65504 for a,b in zip(data['states'][name],data['sky']['states'][name])):raise ValueError('Combined radiance exceeds runtime Float16 range')
    data['seconds']=round(time.monotonic()-start,2)
    data['limitations']=[
        'Low-frequency directional probes, not per-surface lightmaps; bathroom uses an isolated volume. Thin furniture leakage remains possible. Analytic indirect and separately labeled occluded sky direct+indirect are summed on CPU into the same volume.',
        'Moving props and fine fur do not occlude baked indirect; realtime direct shadows remain.',
        'Blender spot penumbra and finite-range cutoff approximate Three lights; linear inverse-square source intensity matches. Cycles does not apply the Three finite-range attenuation.',
        'Glass treated as unoccluding for this diffuse bounce bake; no caustics.',
        'No baked emissive-screen or RGB-PC illumination: all PC display and RGB emission strengths are disabled in the bake. RGB waves are luminous surface animation only, without animated bounced light or hidden ambient gain. Changed PC pink/white reflectance participates under the unchanged room lights.',
        'Fixed-camera east/south cutaway walls are excluded consistently with runtime visibility; north/west walls and privacy partitions retain occlusion.',
        'Source reconstructed from the published v11 GLB, then updated; the historical original authoring scene is not available.',
        'Grid samples inside rebuilt furniture/cabinet envelopes are relocated locally where possible; unresolved samples physically use explicitly documented nearest-clear same-region positions. Interpolation grid remains unchanged.'
    ]
    # Detect changes during the bake before claiming pairing with the frozen source.
    if sha(source)!=sourcehash:raise RuntimeError('Source .blend changed during bake; results not paired')
    for name in ('night','day'):
        if len(data['states'][name])!=2880 or not all(math.isfinite(v) and v>=0 for v in data['states'][name]):raise ValueError('Invalid runtime data')
    if sha(refpath)!=refhash:raise RuntimeError('Reference calibration changed during bake')
    # Detailed alpha graph evidence stays external; runtime retains checked
    # summaries and exact audit-file/graph hashes to respect the asset budget.
    for key,filename in (('botanicalAlphaAudit','botanical-alpha-audit.json'),('blackControlAlphaAudit','black-control-alpha-audit.json')):
        auditfile=outdir/filename
        auditfile.write_text(json.dumps({'sourceSha256':sourcehash,'audit':data[key]},indent=2)+'\n')
        data[key+'Sha256']=sha(auditfile)
        summary_audit=json.loads(json.dumps(data[key]))
        records=summary_audit['materials'].values() if isinstance(summary_audit['materials'],dict) else summary_audit['materials']
        for entry in records:
            network=entry.pop('alphaNetwork',None)
            if network is not None:entry['alphaGraphSha256']=hashlib.sha256(json.dumps(network,sort_keys=True,separators=(',',':')).encode()).hexdigest()
        data[key]=summary_audit
    data['rawBakeAtlases']={name:{'filename':name+'-radiance.exr','sha256':sha(outdir/(name+'-radiance.exr')),'samples':args.samples if name in ('night','day','sky-day') else args.control_samples} for name in ('night','day','sky-day','black-control','sky-black-surroundings','sky-unoccluded-calibration')}
    output=outdir/'irradiance.json';output.write_text(json.dumps(data,separators=(',',':'))+'\n')
    summary={k:data[k] for k in ('sourceSha256','bakeScriptSha256','seconds','materialResponseControl')}
    summary['states']={name:{'count':len(data['states'][name]),'mean':sum(data['states'][name])/2880,'max':max(data['states'][name]),'priorMean':sum(ref['states'][name])/2880} for name in ('night','day')}
    summary['sky']={'world':data['sky']['world'],'blackSurroundingsControl':data['sky']['blackSurroundingsControl'],'dayMeanRadiance':sum(data['sky']['states']['day'])/2880,'nightMeanRadiance':sum(data['sky']['states']['night'])/2880}
    summary['output']=str(output);(outdir/'validation.json').write_text(json.dumps(summary,indent=2)+'\n')
    print('GI_COMPLETE',json.dumps(summary),flush=True)

if __name__=='__main__':main()
