"""Apply BEFORE editing recovered v11 meshes. Never open or save a blend automatically.
Usage inside Blender: exec(compile(open(PATH).read(),PATH,'exec')); apply_recovery_precision()
Restores original linear COLOR_0 as FLOAT_COLOR, retaining precise normal references.
Source normals also go through Blender custom normal storage, which is not bit-exact.
"""
from pathlib import Path
import json, struct, gzip
import bpy
import numpy as np
DEFAULT_SOURCE=Path(__file__).resolve().parent/'recovery-v11'/'authoritative-v11.glb.gz'
def read_accessor(j,b,i):
 a=j['accessors'][i];v=j['bufferViews'][a['bufferView']];dt={5120:'i1',5121:'u1',5122:'<i2',5123:'<u2',5125:'<u4',5126:'<f4'}[a['componentType']];width={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']];size=np.dtype(dt).itemsize
 out=np.ndarray((a['count'],width),dtype=dt,buffer=b,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',width*size),size)).copy()
 if a.get('normalized'):out=np.maximum(out.astype(np.float64)/{5120:127,5121:255,5122:32767,5123:65535}[a['componentType']],-1)
 return out

def apply_recovery_precision(source=DEFAULT_SOURCE,strict=True):
 raw=Path(source).read_bytes()
 if raw[:2]==b'\x1f\x8b':raw=gzip.decompress(raw)
 n=struct.unpack_from('<I',raw,12)[0];j=json.loads(raw[20:20+n]);b=raw[28+n:];changed=[];skipped=[]
 for node in j['nodes']:
  if 'mesh' not in node:continue
  ob=bpy.data.objects.get(node['name'])
  if ob is None or ob.type!='MESH':skipped.append((node['name'],'object missing'));continue
  mesh=ob.data;p=j['meshes'][node['mesh']]['primitives'][0];positions=read_accessor(j,b,p['attributes']['POSITION']);positions=positions[:,[0,2,1]].copy();positions[:,1]*=-1
  actual=np.empty((len(mesh.vertices),3),dtype=np.float32);mesh.vertices.foreach_get('co',actual.ravel())
  if actual.shape!=positions.shape or np.max(np.abs(actual-positions))>2e-6:skipped.append((node['name'],'geometry already modified'));continue
  if 'COLOR_0' in p['attributes']:
   colors=read_accessor(j,b,p['attributes']['COLOR_0']);colors=colors.astype(np.float32)
   if colors.shape[1]==3:colors=np.c_[colors,np.ones(len(colors),dtype=np.float32)]
   name=mesh.color_attributes.active_color.name if mesh.color_attributes.active_color else 'Color'
   if name in mesh.color_attributes:mesh.color_attributes.remove(mesh.color_attributes[name])
   color=mesh.color_attributes.new(name=name,type='FLOAT_COLOR',domain='POINT');color.data.foreach_set('color',colors.ravel());mesh.color_attributes.active_color=color
  if 'NORMAL' in p['attributes']:
   normals=read_accessor(j,b,p['attributes']['NORMAL']);normals=normals[:,[0,2,1]].astype(np.float32).copy();normals[:,1]*=-1
   name='recovered_source_normal'
   if name in mesh.attributes:mesh.attributes.remove(mesh.attributes[name])
   exact=mesh.attributes.new(name=name,type='FLOAT_VECTOR',domain='POINT');exact.data.foreach_set('vector',normals.ravel())
   mesh.normals_split_custom_set_from_vertices(normals.tolist())
  changed.append(node['name'])
 if strict and skipped:raise RuntimeError('Precision restoration must precede geometry editing: '+repr(skipped))
 result={'restored':len(changed),'skipped':skipped,'linearFloatColor':True,'normalStorage':'Exact original normals retained in recovered_source_normal POINT attribute; Blender custom normal export still subject to internal precision.'}
 print('RECOVERY_PRECISION',json.dumps(result));return result
