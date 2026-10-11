"""Validate the frozen source pair, radiance, occluders and unchanged light design."""
import argparse,pathlib,json,hashlib,math,copy
p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--allowed-living-target-delta',nargs=3,type=float,default=[0,0,0]);p.add_argument('--gi',required=True);p.add_argument('--baseline',required=True);p.add_argument('--script',required=True);p.add_argument('--output',required=True);a=p.parse_args()
sha=lambda f:hashlib.sha256(pathlib.Path(f).read_bytes()).hexdigest()
g=json.loads(pathlib.Path(a.gi).read_text());b=json.loads(pathlib.Path(a.baseline).read_text());issues=[]
def check(flag,label):
 if not flag:issues.append(label)
check(g.get('productionRevision')=='bathroom-v19','Incorrect production revision');check(g.get('frozenSourceVerified') is True,'Frozen source guard absent');check(g.get('referenceSha256')==sha(a.baseline),'Baseline hash mismatch');check(len(g.get('dynamicPCRotorRootsExcluded',[]))==9,'Nine dynamic PC rotors not excluded');check(g.get('residualEmissiveTransportMaterials')==[],'Residual emissions');check(g['sourceSha256']==sha(a.source),'GI source SHA mismatch');check(g['sky']['sourceSha256']==sha(a.source),'Sky source SHA mismatch');check(g['bakeScriptSha256']==sha(a.script),'Bake script SHA mismatch')
for k in ['version','dimensions','regions','bathroomSelection','rearSplit','floorSplit','directions','sampleOrder','quantity','samples','engine','device','useDenoising','passDirect','passIndirect','passColor','atlasSize','runtimeGain','maxBounces','diffuseBounces','seed','worldStrength']:
 check(g[k]==b[k],'Changed GI contract/settings: '+k)
calibration=copy.deepcopy(g['lights']);living=next(q for q in calibration['lamps'] if q['name']=='living');prior=next(q for q in b['lights']['lamps'] if q['name']=='living');delta=[living['target'][i]-prior['target'][i] for i in range(3)]
check(max(abs(delta[i]-a.allowed_living_target_delta[i]) for i in range(3))<1e-5,'Living target differs from authorized bear translation');light_audit=g.get('lightCalibrationAudit',{});check(light_audit.get('authorizedLivingTargetDeltaRuntimeXYZ')==a.allowed_living_target_delta and light_audit.get('passed') is True,'Missing authorized living target audit');living['target']=copy.deepcopy(prior['target']);check(calibration==b['lights'],'Changed other direct light positions/powers/targets');check(g['sky']['world']==b['sky']['world'],'Changed sky source')
for k in ['quantity','method','analyticLights','emissiveSurfaces','samples','passDirect','passIndirect','passColor','runtimeGain']:
 check(g['sky'][k]==b['sky'][k],'Changed sky transport '+k)
occluders=g['displayedSceneOccluderAudit'];prior_occluders=b['displayedSceneOccluderAudit']
for key in ('invariantCutawayExcluded','retainedLoftSlabs'):check(sorted(occluders[key])==sorted(prior_occluders[key]),'Changed invariant cutaway/loft occluder set: '+key)
check(set(prior_occluders['retainedBathroom']).issubset(occluders['retainedBathroom']),'Required bathroom privacy occluder omitted');check(occluders['temporaryFloorClippingApplied'] is False,'Temporary runtime clipping contaminated bake');check(occluders.get('finalOpaqueReclassifiedFromLegacyGlass')==['bath_mirror'] and 'bath_mirror' not in g['excluded'],'Rebuilt opaque silvered mirror wrongly excluded by legacy glass classification');check(g['enclosedCabinetSampleViolations']==0,'Cabinet-envelope sample violation')
check(sha(a.baseline)=='107ef50f0ec636d401df4631133ea0061ef14944ab2c325c16b39ea072962971','Accepted v17 baseline differs');check(a.allowed_living_target_delta==[0,0,0],'Bathroom-only revision cannot alter living focus')
alpha=g.get('botanicalAlphaAudit',{});check(alpha==b['botanicalAlphaAudit'],'Botanical source alpha contract changed from accepted v17');check(len(alpha.get('objects',[]))==5,'Five botanical instances not audited');check(alpha.get('allRetainedInTransport') is True,'Botanicals excluded');check(alpha.get('alphaSilhouetteTracedByCycles') is True,'Botanical alpha not traced')
black_alpha=g.get('blackControlAlphaAudit',{});check(black_alpha.get('botanicalSilhouettePreserved') is True,'Black control silhouette changed')
for name,record in alpha.get('materials',{}).items():
 check(record['alphaMode']=='MASK' and record['alphaCutoff']==.5 and record['doubleSided'] is True,'Botanical alpha settings changed')
 matches=[x for x in black_alpha.get('materials',[]) if x['material']==name]
 check(len(matches)==1 and matches[0]['alphaGraphPreserved'] and matches[0]['alphaGraphSha256']==record['alphaGraphSha256'],'Botanical alpha graph mismatch in black control')
 check(0<record['alphaStats']['transparentFraction']<1 and record['alphaStats']['min']==0 and record['alphaStats']['max']==1,'Botanical alpha image invalid')
for key,filename in [('botanicalAlphaAudit','botanical-alpha-audit.json'),('blackControlAlphaAudit','black-control-alpha-audit.json')]:
 auditfile=pathlib.Path(a.gi).parent/filename;check(auditfile.exists() and sha(auditfile)==g.get(key+'Sha256'),'External alpha audit hash mismatch: '+key)
 detail=json.loads(auditfile.read_text());check(detail['sourceSha256']==g['sourceSha256'],'External alpha audit source mismatch')
 records=detail['audit']['materials'].items() if isinstance(detail['audit']['materials'],dict) else [(x['material'],x) for x in detail['audit']['materials']]
 compact=g[key]['materials']
 for name,entry in records:
  expected=hashlib.sha256(json.dumps(entry['alphaNetwork'],sort_keys=True,separators=(',',':')).encode()).hexdigest();actual=compact[name] if isinstance(compact,dict) else next(x for x in compact if x['material']==name)
  check(actual['alphaGraphSha256']==expected,'Alpha graph summary hash mismatch')
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
def bathroom(v):return 2.465<v[0]<4.875 and .045<v[1]<2.82 and -3.95<v[2]<-2.057
for x in pl['samples']:
 check((x['grid'][1]>=g['floorSplit'])==(x['sample'][1]>=g['floorSplit']),'Probe crosses floor isolation '+str(x['index']));check(bathroom(x['grid'])==bathroom(x['sample']),'Probe crosses bathroom privacy region '+str(x['index']))
 d=math.dist(x['grid'],x['sample'])
 if x['index'] not in fallback:check(d<=.450001,'Excess local relocation '+str(x['index']))
 else:
  y=sample[fallback[x['index']]];check(math.dist(x['sample'],y['sample'])<1e-5,'Fallback did not use clear actual sample '+str(x['index']));check(x['index']//40==y['index']//40,'Fallback crosses region')
for e in g['invalidProbeReconstruction']:
 idx=regions.index(e['region'])*40+e['probe'];src=regions.index(e['region'])*40+e['nearestValid']
 for layer in [g['states'],g['sky']['states']]:
  for name in ['night','day']:check(layer[name][idx*18:idx*18+18]==layer[name][src*18:src*18+18],'Fallback array mismatch')
for name,entry in g.get('rawBakeAtlases',{}).items():
 file=pathlib.Path(a.gi).parent/entry['filename'];check(file.exists() and sha(file)==entry['sha256'],'Raw bake atlas missing or hash mismatch: '+name)
 check(entry['samples']==(96 if name in ('night','day','sky-day') else 32),'Atlas sample mismatch: '+name)
check(len(g.get('rawBakeAtlases',{}))==6,'Expected six raw Cycles bake atlases')
for layer in ('states','sky'):
 values=g['states'] if layer=='states' else g['sky']['states'];prior=b['states'] if layer=='states' else b['sky']['states']
 if layer=='states' or max(prior['day'])>0:check(values['day']!=prior['day'],'Prior day radiance reused: '+layer)
report={'passed':not issues,'sourceSha256':sha(a.source),'giSha256':sha(a.gi),'bakeScriptSha256':sha(a.script),'unchangedLightingAndRuntimeContract':not issues,'authorizedLivingTargetDeltaRuntimeXYZ':a.allowed_living_target_delta,'actualLivingTargetDeltaRuntimeXYZ':delta,'probeCount':160,'localRelocations':sum(x['method']=='local-clearance' for x in g['probeRelocations']),'explicitSameRegionFallbacks':len(fallback),'enclosedKeepoutCount':len(pl['enclosedKeepouts']),'stats':stats,'materialResponseRatio':g['materialResponseControl']['ratio'],'skyCalibrationMaxAbsoluteError':g['sky']['unoccludedCalibration']['maxAbsoluteError'],'issues':issues}
pathlib.Path(a.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2));raise SystemExit(bool(issues))
