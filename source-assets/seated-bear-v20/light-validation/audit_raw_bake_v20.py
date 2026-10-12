"""Independently compare published radiance arrays to the actual Cycles EXR pixels."""
import argparse, hashlib, json, math, pathlib, sys
import bpy
import numpy as np
p=argparse.ArgumentParser();p.add_argument('--gi',required=True);p.add_argument('--output',required=True)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);path=pathlib.Path(a.gi);g=json.loads(path.read_text());regions=[r['name'] for r in g['regions']];issues=[];stats={}
for state in ('night','day','sky-day'):
 item=g['rawBakeAtlases'][state];file=path.parent/item['filename'];h=hashlib.sha256(file.read_bytes()).hexdigest()
 if h!=item['sha256']:issues.append('Atlas identity differs: '+state)
 image=bpy.data.images.load(str(file));image.colorspace_settings.name='Non-Color';pixels=np.array(image.pixels[:],dtype=np.float64).reshape(256,256,4);values=[]
 for k in range(160*6):
  x=k%32*8;y=k//32*8;values.extend(np.maximum(0,pixels[y+2:y+6,x+2:x+6,:3].mean(axis=(0,1))).tolist())
 for move in g['invalidProbeReconstruction']:
  base=regions.index(move['region'])*40*18;dest=base+move['probe']*18;src=base+move['nearestValid']*18;values[dest:dest+18]=values[src:src+18]
 expected=g['sky']['states']['day'] if state=='sky-day' else g['states'][state]
 error=max(abs(x-y) for x,y in zip(values,expected));passed=error<=.000000501
 if not passed:issues.append('Runtime radiance does not match raw EXR + declared reconstruction: '+state)
 stats[state]={'atlasSha256':h,'pixelQuantity':'unit-white Lambertian radiance','valueCount':len(values),'maxAbsoluteDeltaAfterReconstruction':error,'roundingTolerance':.000000501,'passed':passed}
 bpy.data.images.remove(image)
report={'passed':not issues,'sourceSha256':g['sourceSha256'],'giSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'checks':stats,'issues':issues}
pathlib.Path(a.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2));assert not issues,issues
