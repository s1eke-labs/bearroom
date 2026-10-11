"""Check that the source material patch survives portable GLB export."""
import argparse,ast,struct,json,pathlib,gzip
ap=argparse.ArgumentParser();ap.add_argument('--glb',required=True);ap.add_argument('--output',required=True);a=ap.parse_args();P=pathlib.Path(__file__).resolve().parent
raw=pathlib.Path(a.glb).read_bytes()
if raw[:2]==b'\x1f\x8b':raw=gzip.decompress(raw)
j=json.loads(raw[20:20+struct.unpack_from('<I',raw,12)[0]]);tree=ast.parse((P/'refine_materials_v13.py').read_text());palette_node=next(n.value for n in ast.walk(tree) if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='palette' for t in n.targets));palette={ast.literal_eval(k):{x.arg:ast.literal_eval(x.value) for x in v.keywords} for k,v in zip(palette_node.keys,palette_node.values)};mats={m['name']:m for m in j['materials']};checks=[]
def eq(actual,expected,label):
 assert actual is not None and abs(actual-expected)<1e-5,(label,actual,expected)
for name,q in palette.items():
 m=mats[name];p=m.get('pbrMetallicRoughness',{});e=m.get('extensions',{})
 for k,key,default in [('rough','roughnessFactor',1),('metal','metallicFactor',1)]:
  if k in q:eq(p.get(key,default),q[k],name+'.'+k)
 if 'normal'in q:eq(m.get('normalTexture',{}).get('scale',1),q['normal'],name+'.normal')
 if 'sheen'in q:
  for c in e.get('KHR_materials_sheen',{}).get('sheenColorFactor',[0,0,0]):eq(c,q['sheen'],name+'.sheen')
 if 'coat'in q:eq(e.get('KHR_materials_clearcoat',{}).get('clearcoatFactor',0),q['coat'],name+'.coat')
 if 'color'in q:
  srgb=[int(q['color'][i:i+2],16)/255 for i in (0,2,4)];linear=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in srgb]
  for c,d in zip(p.get('baseColorFactor',[1,1,1,1])[:3],linear):eq(c,d,name+'.color')
 checks.append({'material':name,'passed':True,'pbr':p,'normalScale':m.get('normalTexture',{}).get('scale'),'extensions':e})
report={'passed':True,'materialClassesChecked':len(checks),'imageEntries':len(j.get('images',[])),'textureEntries':len(j.get('textures',[])),'checks':checks};pathlib.Path(a.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
