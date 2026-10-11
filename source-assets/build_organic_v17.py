"""Assemble deterministic v17 upholstery + CC0 botanical patch from frozen v16."""
import bpy,sys,json,hashlib,struct,importlib.util
from pathlib import Path
P=Path(__file__).resolve().parent;sys.path.insert(0,str(P));import rebuild_soft_furniture_v17 as soft
spec=importlib.util.spec_from_file_location('plants17',P/'plant-v17-work/replace_plants_v17.py');plants=importlib.util.module_from_spec(spec);spec.loader.exec_module(plants)
source=P/'bearroom-pc-v16.blend';args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [];dst=Path(args[0]).resolve() if args else P/'bearroom-organic-v17-candidate.blend'
assert hashlib.sha256(source.read_bytes()).hexdigest()=='63ca5916d3982867c263a3d5ed0af7a2b22a3764635c9c6afa8d9825e43519d6'
bpy.ops.wm.open_mainfile(filepath=str(source))
original={o.name:soft.digest(o) for o in bpy.data.objects};transforms={o.name:list(map(list,o.matrix_local)) for o in bpy.data.objects if o.type=='EMPTY'}
r=soft.apply_soft_v17();p=plants.apply_plants_v17()
bpy.data.objects['F16_reading_rocker'].location.z-=.022
bpy.context.view_layer.update()
allowed=set(r['created']+r['removed'])|{'anim_sofa_edge','Decor__botanical_sage','Decor__wood_honey','Bear_reference_plush','F16_reading_rocker'}
changed=[]
for name,h in original.items():
 if name in allowed:continue
 assert name in bpy.data.objects,'Unexpected object removed: '+name
 assert soft.digest(bpy.data.objects[name])==h,'Unexpected geometry/transform change: '+name
 changed.append(name)
for name,m in transforms.items():
 if name in ['Bear_reference_plush','F16_reading_rocker']:continue
 assert list(map(list,bpy.data.objects[name].matrix_local))==m,'Original root/animation controller moved: '+name
bpy.context.scene['organicRevisionV17']='Seam-built upholstery and gravity-settled cloth; scanned CC0 fabric and botanical leaves.'
bpy.ops.wm.save_as_mainfile(filepath=str(dst),compress=True)
report={'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'output':str(dst),'outputSha256':hashlib.sha256(dst.read_bytes()).hexdigest(),'outputBytes':dst.stat().st_size,'allUnchangedObjects':len(changed),'unchangedRootsAndControllers':len(transforms),'soft':r,'plants':p,'limits':['Offline source and render QA only. Runtime/WebGL behavior belongs to integration QA.']}
(P/'soft-v17-work'/('combined-build-report.json' if dst.name=='bearroom-organic-v17-candidate.blend' else dst.stem+'-build-report.json')).write_text(json.dumps(report,indent=2,default=str));print('COMBINED_V17',dst,report['outputSha256'],report['outputBytes'])
