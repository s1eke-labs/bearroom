"""Independent oriented multiset matching. Legacy v17 matching algorithm is reused."""
import sys,json,hashlib,importlib.util
from pathlib import Path
import numpy as np
source,runtime,out=map(Path,sys.argv[1:4]);matcher=Path(__file__).resolve().parents[3]/'bearroom-v17-source-persistence/organic-v17-independent-qa/verify_with_exception_indices.py'
spec=importlib.util.spec_from_file_location('triangle_matching',matcher);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
sm=json.loads(source.with_suffix('.json').read_text());rm=json.loads(Path(str(runtime)+'.json').read_text())
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(source.with_suffix('.npz'))==sm['fixtureSha256']
assert sha(str(runtime)+'.points.f64')==rm['pointSha256'];assert sha(str(runtime)+'.normals.f64')==rm['normalSha256']
s=np.load(source.with_suffix('.npz'));r=np.fromfile(str(runtime)+'.points.f64',dtype='<f8').reshape(-1,3,3);rn=np.fromfile(str(runtime)+'.normals.f64',dtype='<f8').reshape(-1,3,3)
result=module.compare(s['triangles'],r,2e-6,s['normals'],rn)
report={'scope':'Complete bathroom source-to-runtime world triangles, multiplicity, winding and every corner normal; cyclic-only triangle correspondence','sourceSha256':sm['sourceSha256'],'modelSha256':rm['modelSha256'],'sourceFixtureSha256':sm['fixtureSha256'],**result}
out.write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));sys.exit(0 if result['passed'] else 1)
