#!/usr/bin/env python3
"""Prove material-texture and geometry equivalence for reference-only image deduplication."""
import gzip, hashlib, json, pathlib, struct, sys
hash_bytes = lambda b: hashlib.sha256(b).hexdigest()
def read(path):
    b = pathlib.Path(path).read_bytes()
    if b[:2] == b'\x1f\x8b': b = gzip.decompress(b)
    n = struct.unpack_from('<I', b, 12)[0]
    return b, json.loads(b[20:20+n]), b[28+n:]
b0, a, bin0 = read(sys.argv[1]); b1, b, bin1 = read(sys.argv[2])
assert bin0 == bin1, 'Binary geometry/image chunk changed'
for key in a:
    if key not in ('images','textures'): assert a[key] == b[key], key

def image(document, binary, texture_index):
    texture = document['textures'][texture_index]
    index = texture.get('source')
    if index is None: index = texture['extensions']['KHR_texture_basisu']['source']
    asset = document['images'][index]; view = document['bufferViews'][asset['bufferView']]
    data = binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']]
    return index, data

def texture_infos(value, trail=''):
    if isinstance(value,dict):
        if 'index' in value and 'texture' in trail.split('.')[-1].lower(): yield trail,value['index']
        for key,child in value.items(): yield from texture_infos(child,trail+'.'+key if trail else key)
    elif isinstance(value,list):
        for index,child in enumerate(value): yield from texture_infos(child,trail+'.'+str(index))
materials=[]
for index, material in enumerate(a.get('materials',[])):
    for channel,texture_index in texture_infos(material):
        old_index,old_bytes=image(a,bin0,texture_index); new_index,new_bytes=image(b,bin1,texture_index)
        assert old_bytes == new_bytes, (material.get('name'),channel)
        materials.append({'materialIndex':index,'material':material.get('name'),'channel':channel,'textureIndex':texture_index,'sourceImageBefore':old_index,'sourceImageAfter':new_index,'imageSha256':hash_bytes(old_bytes),'resolvedBytesEqual':True})
indices=set()
for mesh in a['meshes']:
    for primitive in mesh['primitives']:
        if 'indices' in primitive: indices.add(primitive['indices'])
        indices.update(primitive['attributes'].values())
        for target in primitive.get('targets',[]): indices.update(target.values())
component_bytes={5120:1,5121:1,5122:2,5123:2,5125:4,5126:4};components={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT2':4,'MAT3':9,'MAT4':16}
def accessor_bytes(document,binary,index):
    acc=document['accessors'][index]
    assert 'sparse' not in acc, 'Sparse accessor needs explicit verification'
    view=document['bufferViews'][acc['bufferView']]
    size=component_bytes[acc['componentType']]*components[acc['type']]
    assert not acc['type'].startswith('MAT'), 'Geometry matrix accessor needs alignment verification'
    start=view.get('byteOffset',0)+acc.get('byteOffset',0);stride=view.get('byteStride',size)
    return b''.join(binary[start+i*stride:start+i*stride+size]for i in range(acc['count']))
accessors=[]
for index in sorted(indices):
    old_bytes=accessor_bytes(a,bin0,index);new_bytes=accessor_bytes(b,bin1,index)
    assert old_bytes == new_bytes,index
    acc=a['accessors'][index]
    accessors.append({'accessor':index,'count':acc['count'],'type':acc['type'],'componentType':acc['componentType'],'bytes':len(old_bytes),'sha256':hash_bytes(old_bytes),'bytesEqual':True})
report={'operation':'Prove lossless image-reference deduplication','authoringExportSha256':hash_bytes(b0),'canonicalRuntimeSha256':hash_bytes(b1),'allNonImageTextureJSONEqual':True,'entireBinaryChunkBytesEqual':True,'binarySha256':hash_bytes(bin0),'materialTextureMappingsChecked':len(materials),'geometryAccessorsChecked':len(accessors),'allResolvedMaterialImageBytesEqual':True,'allGeometryAccessorBytesEqual':True,'materialTextureProof':materials,'geometryAccessorProof':accessors}
pathlib.Path(sys.argv[3]).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items()if k not in ['materialTextureProof','geometryAccessorProof']},indent=2))
