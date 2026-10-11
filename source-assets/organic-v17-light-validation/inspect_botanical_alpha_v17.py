"""Read-only normal/control alpha network verification; no production bake."""
import bpy,sys,pathlib,json,importlib.util,hashlib
args=sys.argv[sys.argv.index('--')+1:];source,script,ref,out=map(pathlib.Path,args)
spec=importlib.util.spec_from_file_location('bake',script);bake=importlib.util.module_from_spec(spec);spec.loader.exec_module(bake)
sourcehash=hashlib.sha256(source.read_bytes()).hexdigest();bpy.ops.wm.open_mainfile(filepath=str(source));reference=json.loads(ref.read_text());scene,sources,excluded,emissions=bake.prepare_scene(reference,1)
audit=bake.audit_botanical_alpha(sources);cache={};control=[]
for name in audit['materials']:bake.black_control_material(bpy.data.materials[name],cache,control)
result={'passed':all(x['alphaGraphPreserved'] for x in control),'sourceSha256':sourcehash,'normalTransport':audit,'blackControlAlphaAudit':control,'sourceUnmodified':sourcehash==hashlib.sha256(source.read_bytes()).hexdigest()}
out.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k not in ('normalTransport','blackControlAlphaAudit')}))
