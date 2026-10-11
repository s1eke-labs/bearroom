"""Re-create the exact shader-input JPEG set from reviewed compact CC0 maps.
The separate Poly Haven SOURCE-LICENSE / MANIFEST records contain the original
URLs, hashes and documented color/resize processing. This step packs ORM to
avoid glTF synthesizing a much larger roughness PNG.
"""
from pathlib import Path
from PIL import Image
import numpy as np,hashlib,json
P=Path(__file__).resolve().parent/'textures';S=P/'pbr-512-jpeg'
for source,target in [('teddy','boucle'),('linen-rose','linen')]:
 for inp,out in [('albedo','color'),('normal','normal'),('roughness','roughness')]:
  (P/f'{target}_{out}.jpg').write_bytes((S/f'{source}-{inp}-512.jpg').read_bytes())
 g=np.asarray(Image.open(P/f'{target}_roughness.jpg').convert('L'));orm=np.stack([np.full_like(g,255),g,np.zeros_like(g)],axis=-1)
 Image.fromarray(orm).save(P/f'{target}_orm.jpg',quality=85,subsampling=0,optimize=True)
files=[]
for prefix,asset in [('boucle','curly_teddy_natural'),('linen','rough_linen')]:
 for semantic in ['color','normal','orm']:
  f=P/f'{prefix}_{semantic}.jpg';im=Image.open(f);files.append({'path':f.name,'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'size':im.size,'assetURL':'https://polyhaven.com/a/'+asset,'license':'CC0-1.0','colorSpace':'sRGB' if semantic=='color' else 'Non-Color','channels':'R=255, G=roughness, B=0 metallic' if semantic=='orm' else semantic})
report={'files':files,'totalBytes':sum(x['bytes'] for x in files),'physicalRepeatMetres':.30,'sourceLicense':'https://polyhaven.com/license','shader':'Principled, restrained sheen; tangent-space GL normal strength0.80 boucle /0.65 linen; separate ORM G/B to roughness/metallic.'}
(P/'FINAL-MATERIAL-MANIFEST.json').write_text(json.dumps(report,indent=2));print(report['totalBytes'])
