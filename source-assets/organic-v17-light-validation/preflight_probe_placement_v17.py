"""Read-only probe-placement preflight, without scene baking or source save."""
import bpy,sys,pathlib,json,importlib.util,hashlib
source,script,reference,out=map(pathlib.Path,sys.argv[sys.argv.index('--')+1:])
spec=importlib.util.spec_from_file_location('bake',script);bake=importlib.util.module_from_spec(spec);spec.loader.exec_module(bake)
start=hashlib.sha256(source.read_bytes()).hexdigest();bpy.ops.wm.open_mainfile(filepath=str(source));ref=json.loads(reference.read_text());scene,objects,excluded,emissions=bake.prepare_scene(ref,1);probes=bake.probe_positions(ref);moves,fallbacks=bake.refresh_probe_clearance(probes,objects,ref)
audit=ref['_probePlacementAudit'];result={'sourceSha256':start,'passed':not audit['violations'],'localRelocations':sum(x['method']=='local-clearance' for x in moves),'fallbacks':fallbacks,'audit':audit,'sourceUnchanged':hashlib.sha256(source.read_bytes()).hexdigest()==start};out.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k!='audit'}))
