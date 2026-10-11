#!/usr/bin/env python3
"""Inventory the source-only v19 staging directory and prove previous shipped history preservation."""
from pathlib import Path
import hashlib,json
BASE=Path(__file__).resolve().parents[1];STAGE=BASE.parent/'bearroom-v19-source-persistence';PRIOR=BASE.parent/'bearroom-v17-source-persistence';LIMIT=25*1024*1024
sha=lambda b:hashlib.sha256(b).hexdigest()
prior=[]
# The v17 immutable shipped inventory is authoritative; later Python imports can
# create local __pycache__ files that were never part of any shipped package.
prior_manifest=PRIOR/'source-persistence-manifest-v17.json'
prior_items=json.loads(prior_manifest.read_text())['files']
for entry in prior_items+[{'path':prior_manifest.name,'sha256':sha(prior_manifest.read_bytes())}]:
    rel=Path(entry['path']);old=PRIOR/rel
    assert old.is_file() and sha(old.read_bytes())==entry['sha256'],f'Prior shipped history itself changed: {rel}'
    current=STAGE/('history/README-v17.md' if str(rel)=='README.md' else rel)
    assert current.is_file(),f'Missing shipped history: {rel}'
    assert sha(current.read_bytes())==entry['sha256'],f'Changed shipped history: {rel}'
    prior.append(str(rel))
items=[]
for path in sorted(STAGE.rglob('*')):
    if not path.is_file() or path.name=='source-persistence-manifest-v19.json':continue
    data=path.read_bytes();assert len(data)<LIMIT,f'File over25MiB: {path}'
    assert path.suffix not in ['.glb','.zip','.blend1'],f'Unshipped raw/archive input: {path}'
    items.append({'path':str(path.relative_to(STAGE)),'bytes':len(data),'sha256':sha(data)})
source=STAGE/'bearroom-bathroom-v19.blend';gi=STAGE/'baked-gi-v19/irradiance.json';revision=json.loads((BASE/'dist/assets/build-contract.json').read_text());gi_data=json.loads(gi.read_text())
assert sha(source.read_bytes())==revision['bakeSourceSha256']==gi_data['sourceSha256']==gi_data['sky']['sourceSha256']
assert (BASE/'dist/assets/baked-gi/irradiance.json').read_bytes()==gi.read_bytes()
manifest={'revision':'bathroom-click-interactions-v19','scope':'Current editable source and accepted final evidence plus complete previously shipped history; outside dist. No ZIP, raw oversized GLB, superseded candidate, or reference photograph.','sourceSha256':sha(source.read_bytes()),'canonicalRuntimeSha256':revision['modelSha256'],'gzipSha256':sha((BASE/'dist/assets/bearroom.glb.gz').read_bytes()),'giSha256':sha(gi.read_bytes()),'priorShippedFilesPreserved':len(prior),'historicalReadmeLocation':'history/README-v17.md','manifestNotIncludedInItsOwnInventory':True,'fileCount':len(items),'totalFileBytes':sum(i['bytes']for i in items),'maxFileBytes':max(i['bytes']for i in items),'fileLimitBytes':LIMIT,'files':items}
out=STAGE/'source-persistence-manifest-v19.json';out.write_text(json.dumps(manifest,indent=2)+'\n')
report={k:v for k,v in manifest.items() if k!='files'};report['sourceManifestSha256']=sha(out.read_bytes());(BASE/'docs/source-persistence-v19.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
