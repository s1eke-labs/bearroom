"""Read-only source PBR/light-anchor audit for the reference PC revision."""
import bpy,sys,pathlib,json,hashlib,math
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:]
base,source,out=map(lambda x:pathlib.Path(x).resolve(),args)

def values(v):
    if hasattr(v,'to_list'):return v.to_list()
    if hasattr(v,'__len__') and not isinstance(v,str):return list(v)
    return v

def animated(o):
    while o:
        if o.name.startswith('anim_') or (o.get('pcCaseV16',False) and o.get('pcSpinAxis') in ('x','y','z')):return True
        o=o.parent
    return False

def collect(path):
    bpy.ops.wm.open_mainfile(filepath=str(path));dg=bpy.context.evaluated_depsgraph_get();mats={};anchors={};pcs=[];issues=[]
    for m in bpy.data.materials:
        p=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None) if m.use_nodes else None
        factors={}
        if p:
            for key in ['Base Color','Roughness','Metallic','Alpha','Transmission Weight','IOR','Coat Weight','Coat Roughness','Sheen Weight','Sheen Roughness','Emission Color','Emission Strength']:
                s=p.inputs.get(key)
                if s:factors[key]={'value':values(s.default_value),'linked':s.is_linked}
        mats[m.name]={'principled':factors,'diffuseColor':list(m.diffuse_color),'renderMethod':m.surface_render_method,'backfaceCulling':m.use_backface_culling,
            'textures':[{'node':n.name,'image':n.image.name,'packed':bool(n.image.packed_file),'dimensions':list(n.image.size),'colorspace':n.image.colorspace_settings.name} for n in m.node_tree.nodes if n.type=='TEX_IMAGE' and n.image] if m.use_nodes else [],
            'links':sorted((l.from_node.name,l.from_socket.name,l.to_node.name,l.to_socket.name) for l in m.node_tree.links) if m.use_nodes else []}
    for o in bpy.data.objects:
        if o.name.startswith('light_'):
            anchors[o.name]={'matrix':[float(q) for row in o.matrix_world for q in row],'type':o.type,'parent':o.parent.name if o.parent else None}
        r=o
        while r.parent:r=r.parent
        if r.name!='F09_computer' or o.type not in {'MESH','CURVE'}:continue
        eo=o.evaluated_get(dg);me=eo.to_mesh();points=[o.matrix_world@v.co for v in me.vertices]
        rec={'name':o.name,'parent':o.parent.name if o.parent else None,'materials':[m.name for m in o.data.materials if m],'uvLayers':[l.name for l in me.uv_layers],
            'vertices':len(me.vertices),'polygons':len(me.polygons),'boundsBlender':[list(map(min,zip(*points))),list(map(max,zip(*points)))] if points else None,
            'animated':animated(o)}
        for uv in me.uv_layers:
            if not all(math.isfinite(q) for l in uv.data for q in l.uv):issues.append('Nonfinite PC UV: '+o.name)
        textured=any(m and m.use_nodes and any(n.type=='TEX_IMAGE' and n.image for n in m.node_tree.nodes) for m in o.data.materials)
        if textured and not me.uv_layers:issues.append('Textured PC part without UV: '+o.name)
        pcs.append(rec);eo.to_mesh_clear()
    return {'materials':mats,'anchors':anchors,'pcObjects':pcs,'issues':issues}
old=collect(base);new=collect(source);issues=list(new['issues'])
changed=[name for name,data in old['materials'].items() if name not in new['materials'] or new['materials'][name]!=data]
if changed:issues.append({'changedLegacyMaterials':changed})
if old['anchors']!=new['anchors']:issues.append('Legacy light anchor transforms changed')
newmats={name:data for name,data in new['materials'].items() if name not in old['materials']}
pcbounds=[o['boundsBlender'] for o in new['pcObjects'] if o['boundsBlender']]
bounds=[list(map(min,zip(*(b[0] for b in pcbounds)))),list(map(max,zip(*(b[1] for b in pcbounds))))] if pcbounds else None
report={'passed':not issues,'source':source.name,'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'baselineSha256':hashlib.sha256(base.read_bytes()).hexdigest(),
'legacyMaterialsChecked':len(old['materials']),'legacyMaterialsUnchanged':not changed,'legacyLightAnchorsChecked':len(old['anchors']),'legacyLightAnchorsUnchanged':old['anchors']==new['anchors'],
'newMaterials':newmats,'pcBoundsBlender':bounds,'pcObjectCount':len(new['pcObjects']),'pcObjects':new['pcObjects'],'actualLightAnchors':new['anchors'],'issues':issues}
out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in {'newMaterials','pcObjects','actualLightAnchors'}},indent=2))
if issues:raise RuntimeError('PC source material/UV/light audit failed')
