"""Validate the frozen source pair, radiance, occluders and unchanged light design."""
import argparse,pathlib,json,hashlib,math
p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--gi',required=True);p.add_argument('--baseline',required=True);p.add_argument('--script',required=True);p.add_argument('--output',required=True);a=p.parse_args()
sha=lambda f:hashlib.sha256(pathlib.Path(f).read_bytes()).hexdigest()
g=json.loads(pathlib.Path(a.gi).read_text());b=json.loads(pathlib.Path(a.baseline).read_text());issues=[]
def check(flag,label):
 if not flag:issues.append(label)
check(g['sourceSha256']==sha(a.source),'GI source SHA mismatch');check(g['sky']['sourceSha256']==sha(a.source),'Sky source SHA mismatch');check(g['bakeScriptSha256']==sha(a.script),'Bake script SHA mismatch')
for k in ['version','dimensions','regions','bathroomSelection','rearSplit','floorSplit','directions','sampleOrder','quantity','samples','engine','device','useDenoising','passDirect','passIndirect','passColor','atlasSize','runtimeGain','maxBounces','diffuseBounces','seed','worldStrength']:
 check(g[k]==b[k],'Changed GI contract/settings: '+k)
check(g['lights']==b['lights'],'Changed direct light positions/powers/targets');check(g['sky']['world']==b['sky']['world'],'Changed sky source')
for k in ['quantity','method','analyticLights','emissiveSurfaces','samples','passDirect','passIndirect','passColor','runtimeGain']:
 check(g['sky'][k]==b['sky'][k],'Changed sky transport '+k)
check(g['displayedSceneOccluderAudit']==b['displayedSceneOccluderAudit'],'Cutaway/privacy/slab occluder changes');check(g['enclosedCabinetSampleViolations']==0,'Cabinet-envelope sample violation')
counts={};stats={}
for name in ['night','day']:
 for layer in ['states','sky']:
  vs=g['states'][name] if layer=='states' else g['sky']['states'][name]
  check(len(vs)==2880,f'{layer}/{name} value count');check(all(math.isfinite(v) and v>=0 for v in vs),f'{layer}/{name} invalid radiance');stats[f'{layer}/{name}']={'count':len(vs),'mean':sum(vs)/len(vs),'max':max(vs)}
 combined=[x+y for x,y in zip(g['states'][name],g['sky']['states'][name])];check(all(v<=65504 for v in combined),name+' exceeds Float16 range')
check(all(v==0 for v in g['sky']['states']['night']),'Nonzero night sky');check(max(g['sky']['states']['day'])>0,'No day sky')
for label,c in [('indirect-black',g['materialResponseControl']),('sky-black',g['sky']['blackSurroundingsControl']),('sky-unoccluded',g['sky']['unoccludedCalibration'])]:
 check(c['passed'] is True,label+' control failed');check(c['samples']==32,label+' control sample count changed')
check(g['materialResponseControl']['ratio']<.001,'Indirect black ratio too high');check(g['sky']['unoccludedCalibration']['maxAbsoluteError']<.003,'Sky absolute calibration failed')
audit=pathlib.Path(a.gi).with_name('probe-placement-audit.json');pl=json.loads(audit.read_text());check(sha(audit)==g['probePlacementAuditSha256'],'Probe audit hash mismatch');check(pl['checked']==160 and len(pl['samples'])==160,'Probe count changed');check(pl['insideEnclosedCabinetSamples']==0 and not pl['violations'],'Probe placement violations')
regions=[r['name'] for r in g['regions']];fallback={regions.index(x['region'])*40+x['probe']:regions.index(x['region'])*40+x['nearestValid'] for x in g['invalidProbeReconstruction']};sample={x['index']:x for x in pl['samples']}
for x in pl['samples']:
 d=math.dist(x['grid'],x['sample'])
 if x['index'] not in fallback:check(d<=.450001,'Excess local relocation '+str(x['index']))
 else:
  y=sample[fallback[x['index']]];check(math.dist(x['sample'],y['sample'])<1e-5,'Fallback did not use clear actual sample '+str(x['index']));check(x['index']//40==y['index']//40,'Fallback crosses region')
for e in g['invalidProbeReconstruction']:
 idx=regions.index(e['region'])*40+e['probe'];src=regions.index(e['region'])*40+e['nearestValid']
 for layer in [g['states'],g['sky']['states']]:
  for name in ['night','day']:check(layer[name][idx*18:idx*18+18]==layer[name][src*18:src*18+18],'Fallback array mismatch')
report={'passed':not issues,'sourceSha256':sha(a.source),'giSha256':sha(a.gi),'bakeScriptSha256':sha(a.script),'unchangedLightingAndRuntimeContract':not issues,'probeCount':160,'localRelocations':sum(x['method']=='local-clearance' for x in g['probeRelocations']),'explicitSameRegionFallbacks':len(fallback),'enclosedKeepoutCount':len(pl['enclosedKeepouts']),'stats':stats,'materialResponseRatio':g['materialResponseControl']['ratio'],'skyCalibrationMaxAbsoluteError':g['sky']['unoccludedCalibration']['maxAbsoluteError'],'issues':issues}
pathlib.Path(a.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2));raise SystemExit(bool(issues))
