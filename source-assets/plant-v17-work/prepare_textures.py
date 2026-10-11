'''Deterministic downsampled copies of CC0 scans; originals remain untouched.'''
from PIL import Image
from pathlib import Path
import json,hashlib
P=Path(__file__).resolve().parent;S=P/'source-polyhaven'/'textures';D=P/'runtime-textures';D.mkdir(exist_ok=True)
diff=Image.open(S/'calathea_orbifolia_01_diff_1k.jpg').convert('RGB').resize((512,512),Image.Resampling.LANCZOS)
alpha=Image.open(S/'calathea_orbifolia_01_alpha_1k.jpg').convert('L').resize((512,512),Image.Resampling.LANCZOS)
# Binary glTF MASK alpha has deterministic conservative edges; no sorting/transmission.
alpha=alpha.point(lambda x:255 if x>=128 else 0);diff.putalpha(alpha)
diff.quantize(colors=192,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE).save(D/'calathea_diffuse_alpha_512.png',optimize=True)
for src,dst,size,q in [('calathea_orbifolia_01_nor_gl_1k.jpg','calathea_normal_512.jpg',512,85),('calathea_orbifolia_01_arm_1k.jpg','calathea_orm_256.jpg',256,82)]:
 Image.open(S/src).convert('RGB').resize((size,size),Image.Resampling.LANCZOS).save(D/dst,quality=q,optimize=True,subsampling=0)
r={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'size':Image.open(p).size} for p in D.glob('*') if p.suffix in ['.png','.jpg']};(P/'runtime-textures.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2));print('TOTAL',sum(x['bytes'] for x in r.values()))
# Authored procedural potting-soil scan substitute: scoped to the five inserts.
# Deterministic multiscale organic grains, no external texture dependency.
import numpy as np
from PIL import ImageFilter
rng=np.random.default_rng(170508);n=256
fine=rng.random((n,n));coarse=np.array(Image.fromarray((rng.random((32,32))*255).astype('uint8')).resize((n,n),Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(2)),dtype=float)/255
v=.52*coarse+.48*fine;v=(v-.5)*.48
base=np.array([58.,42.,28.]);rgb=np.clip(base[None,None,:]*(1+v[:,:,None]),0,255)
speck=rng.random((n,n));rgb[speck>.997]=[99,83,60];rgb[speck<.006]=[27,23,17]
Image.fromarray(rgb.astype('uint8'),'RGB').save(D/'soil_earth_color_256.jpg',quality=80,optimize=True,subsampling=0)
h=np.array(Image.fromarray((fine*255).astype('uint8')).resize((128,128),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(.65)),dtype=float)/255
gy,gx=np.gradient(h);normal=np.dstack((-gx*1.2,-gy*1.2,np.ones_like(gx)));normal/=np.linalg.norm(normal,axis=2)[:,:,None]
Image.fromarray(((normal+1)*127.5).astype('uint8'),'RGB').save(D/'soil_earth_normal_128.jpg',quality=80,optimize=True,subsampling=0)
r={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'size':Image.open(p).size} for p in D.glob('*') if p.suffix in ['.png','.jpg']};(P/'runtime-textures.json').write_text(json.dumps(r,indent=2));print('TOTAL_WITH_SOIL',sum(x['bytes'] for x in r.values()))
