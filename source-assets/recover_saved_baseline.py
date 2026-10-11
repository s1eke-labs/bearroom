"""Recover the archived, exact v11 baseline without fetching or using current Site dist.
Run before build_realism_scene.py when recovered-v11.blend is absent.
Every path is relative to this script; source image bytes remain embedded in GLB.
"""
import bpy,json,struct,hashlib,os,gzip,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parent
source=ROOT/'recovery-v11'/'authoritative-v11.glb.gz'
raw=gzip.decompress(source.read_bytes());expected='8709a311dd262eb39d112e06a356b2271ac3ec56f7310730ca953cb9196d60f2'
assert hashlib.sha256(raw).hexdigest()==expected,'Archived production v11 baseline changed'
n=struct.unpack_from('<I',raw,12)[0];j=json.loads(raw[20:20+n])
bpy.ops.wm.read_factory_settings(use_empty=True)
with tempfile.TemporaryDirectory(prefix='bearroom-v11-recovery-') as temporary:
 glb=Path(temporary)/'authoritative-v11.glb';glb.write_bytes(raw)
 bpy.ops.import_scene.gltf(filepath=str(glb),merge_vertices=False,import_shading='NORMALS',import_pack_images=True)
s=bpy.context.scene;s.unit_settings.system='METRIC';s.unit_settings.length_unit='METERS';s.unit_settings.scale_length=1
for k,v in j['scenes'][j.get('scene',0)].get('extras',{}).items():s[k]=v
for image in bpy.data.images:
 if image.source=='FILE' and not image.packed_file:image.pack()
assert all(bpy.data.objects.get(node['name']) is not None for node in j['nodes'])
s['recoverySourceSha256']=expected;s['authoringProvenance']='Editable reconstruction of archived production v11 GLB; original pre-v11 authoring modifiers were not recoverable.'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'recovered-v11.blend'),compress=True)
print('ARCHIVED_BASELINE_RECOVERED',ROOT/'recovered-v11.blend')
