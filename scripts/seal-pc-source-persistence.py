#!/usr/bin/env python3
"""Inventory the source-only v16 staging directory and prove previous shipped history preservation."""
from pathlib import Path
import hashlib,json
BASE=Path(__file__).resolve().parents[1];STAGE=BASE.parent/'bearroom-v16-source-persistence';PRIOR=BASE.parent/'bearroom-v15-source-persistence';LIMIT=25*1024*1024
sha=lambda b:hashlib.sha256(b).hexdigest()
prior=[]
for old in sorted(PRIOR.rglob('*')):
    if not old.is_file():continue
    rel=old.relative_to(PRIOR)
    current=STAGE/('history/README-v15.md' if str(rel)=='README.md' else rel)
    assert current.is_file(),f'Missing shipped history: {rel}'
    assert sha(current.read_bytes())==sha(old.read_bytes()),f'Changed shipped history: {rel}'
    prior.append(str(rel))
items=[]
for path in sorted(STAGE.rglob('*')):
    if not path.is_file() or path.name=='source-persistence-manifest-v16.json':continue
    data=path.read_bytes();assert len(data)<LIMIT,f'File over25MiB: {path}'
    assert path.suffix not in ['.glb','.zip','.blend1'],f'Unshipped raw/archive input: {path}'
    items.append({'path':str(path.relative_to(STAGE)),'bytes':len(data),'sha256':sha(data)})
source=STAGE/'bearroom-pc-v16.blend';gi=STAGE/'baked-gi-pc-v16/irradiance.json';revision=json.loads((BASE/'dist/assets/build-contract.json').read_text());gi_data=json.loads(gi.read_text())
assert sha(source.read_bytes())==revision['bakeSourceSha256']==gi_data['sourceSha256']==gi_data['sky']['sourceSha256']
assert (BASE/'dist/assets/baked-gi/irradiance.json').read_bytes()==gi.read_bytes()
manifest={'revision':'reference-panorama-pc-v16','scope':'Current editable source and accepted final evidence plus complete previously shipped history; outside dist. No ZIP, raw oversized GLB, superseded candidate, or reference photograph.','sourceSha256':sha(source.read_bytes()),'canonicalRuntimeSha256':revision['modelSha256'],'gzipSha256':sha((BASE/'dist/assets/bearroom.glb.gz').read_bytes()),'giSha256':sha(gi.read_bytes()),'priorShippedFilesPreserved':len(prior),'historicalReadmeLocation':'history/README-v15.md','manifestNotIncludedInItsOwnInventory':True,'fileCount':len(items),'totalFileBytes':sum(i['bytes']for i in items),'maxFileBytes':max(i['bytes']for i in items),'fileLimitBytes':LIMIT,'files':items}
out=STAGE/'source-persistence-manifest-v16.json';out.write_text(json.dumps(manifest,indent=2)+'\n')
report={k:v for k,v in manifest.items() if k!='files'};report['sourceManifestSha256']=sha(out.read_bytes());(BASE/'docs/source-persistence-v16.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
