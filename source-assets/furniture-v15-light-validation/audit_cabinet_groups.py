"""Read-only comparison of v13 per-object and v15 panel-union keepouts."""
import bpy,sys,pathlib,importlib.util,json,hashlib
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:];src=pathlib.Path(args[0]).resolve();out=pathlib.Path(args[1]);P=pathlib.Path(__file__).resolve().parent.parent
bpy.ops.wm.open_mainfile(filepath=str(src));ref=json.loads((P/'gi-rebuild/reference-v13.json').read_text())
def mod(file,name):
 s=importlib.util.spec_from_file_location(name,P/'gi-rebuild'/file);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
old=mod('bake_indirect.py','old');new=mod('bake_indirect_v15.py','new');scene,sources,_,_=new.prepare_scene(ref,1)
def rows(m):return [{'name':b['name'],'objects':sorted(b['objects']),'min':m.rvec(Vector((b['lo'].x,b['hi'].y,b['lo'].z))),'max':m.rvec(Vector((b['hi'].x,b['lo'].y,b['hi'].z)))} for b in m.enclosed_probe_keepouts(sources)]
a,b=rows(old),rows(new);probes=new.probe_positions(ref);rel,recon=new.refresh_probe_clearance(probes,sources,ref);r={'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'oldPerObjectKeepouts':a,'newPanelUnionKeepouts':b,'probePlacement':ref['_probePlacementAudit'],'relocations':rel,'reconstruction':recon}
out.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps({'oldKeepouts':[x['name'] for x in a],'newKeepouts':[x['name'] for x in b],'checked':ref['_probePlacementAudit']['checked'],'violations':ref['_probePlacementAudit']['violations'],'relocations':len(rel),'reconstruction':len(recon)},indent=2))
