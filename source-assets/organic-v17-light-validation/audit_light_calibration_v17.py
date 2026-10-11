"""Read-only frozen source light/units audit against the final v16 source."""
import bpy,sys,pathlib,json,hashlib,importlib.util
args=sys.argv[sys.argv.index('--')+1:];base,source,reference,script,out=map(pathlib.Path,args[:5]);allowed_delta=list(map(float,args[5:8])) if len(args)>5 else [0,0,0]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def collect(path):
 bpy.ops.wm.open_mainfile(filepath=str(path))
 anchors={o.name:{'matrixWorld':list(float(x) for row in o.matrix_world for x in row),'type':o.type,'parent':o.parent.name if o.parent else None} for o in bpy.context.scene.objects if o.name.startswith('light_')}
 return {'anchors':anchors,'unitSystem':bpy.context.scene.unit_settings.system,'scaleLength':bpy.context.scene.unit_settings.scale_length}
basehash=sha(base);sourcehash=sha(source);old=collect(base);new=collect(source);issues=[]
if sha(base)!=basehash or sha(source)!=sourcehash:issues.append('Source changed during read-only audit')
if old['anchors']!=new['anchors']:issues.append('Source light anchor transform changed')
if old['unitSystem']!=new['unitSystem'] or old['scaleLength']!=new['scaleLength']:issues.append('Source unit calibration changed')
spec=importlib.util.spec_from_file_location('bake',script);bake=importlib.util.module_from_spec(spec);spec.loader.exec_module(bake);ref=json.loads(reference.read_text());scene,sources,excluded,emissions=bake.prepare_scene(ref,96);lights,calibration=bake.configure_lights(ref)
light_audit=bake.validate_light_calibration(calibration,ref['lights'],allowed_delta)
audit=bake.audit_botanical_alpha(sources)
report={'passed':not issues,'sourceSha256':sourcehash,'baselineSourceSha256':basehash,'referenceSha256':sha(reference),'anchorsChecked':len(new['anchors']),'unitSystem':new['unitSystem'],'scaleLength':new['scaleLength'],'anchorsUnchanged':old['anchors']==new['anchors'],'analyticCalibrationUnchangedExceptAuthorizedLivingFocus':light_audit['passed'],'lightCalibrationAudit':light_audit,'calibration':calibration,'botanicalAlphaAudit':audit,'disabledEmissiveMaterials':emissions,'excludedObjectCount':len(excluded),'sourceObjectCount':len(sources),'issues':issues}
out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in ('calibration','botanicalAlphaAudit')},indent=2))
if issues:raise RuntimeError('Source light calibration audit failed')
