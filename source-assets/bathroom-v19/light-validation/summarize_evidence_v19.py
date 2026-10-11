"""Write independently hashed source-only evidence manifest after all final checks."""
import argparse,pathlib,json,hashlib,math,datetime,os
ap=argparse.ArgumentParser()
for key in ('source','gi','baseline'):ap.add_argument('--'+key,required=True)
a=ap.parse_args()
root=pathlib.Path(__file__).resolve().parents[1];src=pathlib.Path(a.source).resolve();out=root/'light-validation';baseline=pathlib.Path(a.baseline).resolve();gi=pathlib.Path(a.gi).resolve()
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();load=lambda p:json.loads(p.read_text());g=load(gi);b=load(baseline);checks={}
for kind,label in [('light','LIGHT_UNIT_VALIDATION'),('radiance','RADIANCE_UNITS_VALIDATION')]:
 line=next(x[len(label)+1:] for x in (out/f'test-{kind}-units.log').read_text().splitlines() if x.startswith(label+' '));checks[label]=json.loads(line)
ratios=[x['ratio'] for x in checks['LIGHT_UNIT_VALIDATION'].values()]+[checks['RADIANCE_UNITS_VALIDATION']['ratio']]
units={'passed':all(abs(x-1)<1e-5 for x in ratios),'relativeTolerance':1e-5,'maxRelativeError':max(abs(x-1) for x in ratios),'checks':checks};(out/'unit-validation.json').write_text(json.dumps(units,indent=2)+'\n');assert units['passed']
deltas={}
for layer in ['analyticNight','analyticDay','skyDay']:
 key='night' if layer=='analyticNight' else 'day';new=g['sky']['states'][key] if layer=='skyDay' else g['states'][key];old=b['sky']['states'][key] if layer=='skyDay' else b['states'][key]
 regions={}
 for i,r in enumerate(g['regions']):
  aa=new[i*720:(i+1)*720];bb=old[i*720:(i+1)*720];regions[r['name']]={'newMean':sum(aa)/720,'priorMean':sum(bb)/720,'meanAbsoluteDelta':sum(abs(x-y) for x,y in zip(aa,bb))/720,'changedValues':sum(x!=y for x,y in zip(aa,bb))}
 deltas[layer]={'newMean':sum(new)/len(new),'priorMean':sum(old)/len(old),'maxAbsoluteDelta':max(abs(x-y) for x,y in zip(new,old)),'changedValues':sum(x!=y for x,y in zip(new,old)),'regions':regions}
(out/'final-radiance-delta.json').write_text(json.dumps({'sourceSha256':sha(src),'giSha256':sha(gi),'baselineGiSha256':sha(baseline),'freshRadianceArrayDifferences':deltas},indent=2)+'\n')
reports=['final-preflight-probe-placement.json','final-calibration-alpha-audit.json','final-gi-pair-validation.json','final-probe-clearance-audit.json','final-source-transport-materials.json','unit-validation.json']
for name in reports:
 report=load(out/name);assert report['passed'],name
 if 'sourceSha256' in report:assert report['sourceSha256']==sha(src),name
files=[gi,gi.with_name('validation.json'),root/'gi-rebuild/bake_indirect_v19.py',root/'gi-rebuild/bake-v19-final.log']
files+=sorted(gi.parent.glob('*'))+[out/name for name in reports]+[out/'final-radiance-delta.json']
files+=sorted((root/'gi-rebuild').glob('*.py'))+sorted((root/'gi-rebuild').glob('*.sh'))+sorted(out.glob('*.py'))
files+=[out/'test-light-units.log',out/'test-radiance-units.log']
files=list(dict.fromkeys(files))
manifest={'passed':True,'scope':'Accepted source-only GI. Canonical exported runtime geometry/light/material pairing is a separate gate and is not claimed here.','createdAtUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourcePath':os.path.relpath(src,root.parent),'sourceSha256':sha(src),'giSha256':sha(gi),'sourceUnmodified':sha(src)==g['sourceSha256'],'baselineSourceSha256':'822b7ad9bda89889530dae32efaf5ecde831c991f6994bed97b7a8c02227afc4','baselineGiSha256':sha(baseline),'productionSamples':96,'controlSamples':32,'files':{os.path.relpath(p,root):{'sha256':sha(p),'bytes':p.stat().st_size} for p in files}}
assert manifest['sourceUnmodified'];(out/'source-only-validation-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print(json.dumps({k:v for k,v in manifest.items() if k!='files'},indent=2))
