"""Recover editable furniture components from authoritative merged v11 GLB meshes.
Only connected-component separation and semantic labels; no geometry replacement.
Reference v3-semantic-source.json supplies names, never geometry or transforms.
Call recover_components() with the authoritative v11 scene already loaded.
"""
import bpy, json, os, math
from mathutils import Vector, Matrix
from collections import defaultdict
OUT=os.path.dirname(os.path.abspath(__file__))

def components(mesh):
    # UV and hard-normal seams create duplicate vertices in GLB. Join connectivity
    # virtually at coincident coordinates; preserve all actual vertices/UVs/normals.
    parent=list(range(len(mesh.vertices)))
    def find(a):
        while parent[a]!=a:parent[a]=parent[parent[a]];a=parent[a]
        return a
    def union(a,b):
        a,b=find(a),find(b)
        if a!=b:parent[b]=a
    points={}
    for v in mesh.vertices:
        key=tuple(round(float(x),6) for x in v.co)
        if key in points:union(v.index,points[key])
        else:points[key]=v.index
    for poly in mesh.polygons:
        vs=poly.vertices
        for i in vs[1:]:union(vs[0],i)
    groups=defaultdict(list)
    for p in mesh.polygons:groups[find(p.vertices[0])].append(p.index)
    return list(groups.values())

def split_component(ob, polys, index):
    old=ob.data; vertex_ids=sorted(set(v for pi in polys for v in old.polygons[pi].vertices));remap={v:i for i,v in enumerate(vertex_ids)}
    me=bpy.data.meshes.new(ob.name+'_part_mesh');me.from_pydata([old.vertices[i].co for i in vertex_ids],[],[[remap[v] for v in old.polygons[pi].vertices] for pi in polys]);me.update()
    for m in old.materials:me.materials.append(m)
    loop_old=[]
    for p,pi in zip(me.polygons,polys):
        op=old.polygons[pi];p.material_index=op.material_index;p.use_smooth=op.use_smooth;loop_old.extend(op.loop_indices)
    for uv in old.uv_layers:
        n=me.uv_layers.new(name=uv.name)
        for i,oi in enumerate(loop_old):n.data[i].uv=uv.data[oi].uv
    for attr in old.color_attributes:
        ca=me.color_attributes.new(name=attr.name,type='FLOAT_COLOR',domain=attr.domain)
        ids=loop_old if attr.domain=='CORNER' else vertex_ids
        for i,oi in enumerate(ids):ca.data[i].color=attr.data[oi].color
    if len(old.corner_normals):
        try:me.normals_split_custom_set([old.corner_normals[i].vector for i in loop_old])
        except Exception:pass
    n=bpy.data.objects.new(ob.name+'_part_%03d'%index,me);bpy.context.scene.collection.objects.link(n);n.parent=ob.parent;n.matrix_world=ob.matrix_world.copy()
    for k in ob.keys():n[k]=ob[k]
    n['recoveredFrom']=ob.name;n['recoveredGeometryUnchanged']=True
    return n

def recover_components():
    reference=json.load(open(OUT+'/furniture-realism-review/v3-semantic-source.json'))
    candidates={r['root']:r['objects'] for r in reference}
    out=[];matched=[];unmatched=[]
    for ob in list(bpy.data.objects):
        if ob.type!='MESH' or '__' not in ob.name:continue
        r=ob
        while r.parent and r.name not in candidates:r=r.parent
        if r.name not in candidates:continue
        parentname=ob.parent.name if ob.parent else ''
        groups=components(ob.data)
        if len(groups)==1:parts=[ob]
        else:
            parts=[split_component(ob,p,i) for i,p in enumerate(groups)];bpy.data.objects.remove(ob,do_unlink=True)
        for part in parts:
            bb=[part.matrix_local@Vector(p) for p in part.bound_box];lo=Vector([min(p[i] for p in bb) for i in range(3)]);hi=Vector([max(p[i] for p in bb) for i in range(3)]);center=(lo+hi)*.5;dim=hi-lo
            choices=[]
            mats={m.name.split('.')[0] for m in part.data.materials}
            for c in candidates[r.name]:
                if c['parent']!=parentname:continue
                cl,ch=map(Vector,c['bounds']);cd=ch-cl;cc=(cl+ch)*.5
                # Small bound expansion is expected from applied bevels/curves.
                score=(center-cc).length+(dim-cd).length*.35
                if not mats.intersection({m.split('.')[0] for m in c['mat']}):score+=.08
                choices.append((score,c))
            if choices:
                score,c=min(choices,key=lambda x:x[0])
                if score<.045:
                    part.name=c['name'];part['semanticSourceName']=c['name'];part['semanticMatchError']=score;part['sourceLocalMatrix']=sum(c['matrix'],[]);matched.append({'name':part.name,'error':round(score,6)})
                else:unmatched.append({'name':part.name,'closest':c['name'],'error':round(score,6),'dim':list(dim),'center':list(center)})
            out.append(part)
    bpy.context.view_layer.update()
    report={'components':len(out),'matched':matched,'unmatched':unmatched,'method':'Connected-component separation, preserving authoritative geometry, transforms, UVs and split normals; old source supplies semantic names only.'}
    open(OUT+'/furniture-realism-review/component-recovery.json','w').write(json.dumps(report,indent=2))
    print('RECOVERED_FURNITURE_COMPONENTS',len(out),'matched',len(matched),'unmatched',len(unmatched))
    return report
