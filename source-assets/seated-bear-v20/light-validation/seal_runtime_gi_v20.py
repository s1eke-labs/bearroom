"""Seal the final frozen source/GI and canonical lossless runtime light/material pair."""
import argparse,pathlib,json,hashlib,gzip,os,datetime
ap=argparse.ArgumentParser()
for key in ['source','gi','glb','gzip','light-pair','materials-pair','source-manifest','output']:ap.add_argument('--'+key,required=True)
a=ap.parse_args();sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();load=lambda p:json.loads(p.read_text());paths={k:pathlib.Path(getattr(a,k.replace('-','_'))).resolve() for k in ['source','gi','glb','gzip','light-pair','materials-pair','source-manifest','output']};out=paths['output'];base=out.parent
sourcehash=sha(paths['source']);gihash=sha(paths['gi']);model_file_bytes=paths['glb'].read_bytes();model_is_gzip=model_file_bytes[:2]==b'\x1f\x8b';canonical_model_bytes=gzip.decompress(model_file_bytes) if model_is_gzip else model_file_bytes;modelhash=hashlib.sha256(canonical_model_bytes).hexdigest();g=load(paths['gi']);light=load(paths['light-pair']);materials=load(paths['materials-pair']);source_manifest=load(paths['source-manifest']);issues=[]
def check(flag,label):
 if not flag:issues.append(label)
check(sourcehash==g['sourceSha256']==light['sourceSha256']==materials['sourceSha256']==source_manifest['sourceSha256'],'Source identity mismatch')
check(gihash==materials['giSha256']==source_manifest['giSha256'],'GI identity mismatch')
check(modelhash==light['modelSha256']==materials['modelSha256'],'Model identity mismatch')
check(light['passed'] and materials['passed'] and source_manifest['passed'],'A required pairing report did not pass')
check(gzip.decompress(paths['gzip'].read_bytes())==canonical_model_bytes,'Runtime gzip is not a lossless wrapper of canonical GLB')
for filename,entry in source_manifest['files'].items():
 p=paths['source-manifest'].parent.parent/filename
 check(p.exists() and sha(p)==entry['sha256'],'Source evidence hash mismatch: '+filename)
result={'passed':not issues,'createdAtUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourceSha256':sourcehash,'giSha256':gihash,'modelSha256':modelhash,'modelInputCompression':'gzip' if model_is_gzip else 'none','modelInputSha256':sha(paths['glb']),'canonicalModelBytes':len(canonical_model_bytes),'gzipSha256':sha(paths['gzip']),'gzipDecompressesExactlyToCanonicalGlb':not issues,'lightAnchorsPaired':len(light['anchors']),'maxLightAnchorDeltaMetres':max(x['deltaMetres'] for x in light['anchors']),'livingTargetDeltaMetres':light['livingTarget']['deltaMetres'],'bathroomMaterialsPaired':materials['bathroomMaterialsPaired'],'botanicalInstancesPaired':materials['botanicalInstancesPaired'],'files':{k:{'path':os.path.relpath(p,base),'sha256':sha(p),'bytes':p.stat().st_size} for k,p in paths.items() if k!='output'},'scope':'Fresh source-only GI, exact actual light/material/alpha pairing, and lossless runtime gzip. Full mesh/export-provenance equivalence remains the integrator-owned separate gate.','issues':issues}
out.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k!='files'},indent=2));raise SystemExit(bool(issues))
