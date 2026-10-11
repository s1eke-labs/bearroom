#!/usr/bin/env python3
"""Consolidate byte-identical embedded glTF image references, leaving binary bytes untouched."""
import copy, gzip, hashlib, json, pathlib, struct, sys
source, destination = map(pathlib.Path, sys.argv[1:3])
b = source.read_bytes()
if b[:2] == b'\x1f\x8b': b = gzip.decompress(b)
n = struct.unpack_from('<I', b, 12)[0]
original = json.loads(b[20:20+n])
g = copy.deepcopy(original)
binary_chunk = b[20+n:]
binary = binary_chunk[8:]
def image_bytes(document, index):
    image = document['images'][index]
    if 'bufferView' not in image: return None
    view = document['bufferViews'][image['bufferView']]
    assert view.get('buffer', 0) == 0
    return binary[view.get('byteOffset', 0):view.get('byteOffset', 0)+view['byteLength']]
canonical = {}; image_map = {}; kept = []; duplicates = []
for index, image in enumerate(original.get('images', [])):
    data = image_bytes(original, index)
    key = (image.get('mimeType'), hashlib.sha256(data).hexdigest()) if data is not None else ('external', index)
    if key in canonical:
        image_map[index] = canonical[key]
        duplicates.append({'removedIndex':index,'name':image.get('name'),'canonicalIndex':canonical[key],'encodedBytes':len(data)})
    else:
        canonical[key] = len(kept); image_map[index] = len(kept); kept.append(image)
g['images'] = kept
for texture in g.get('textures', []):
    if 'source' in texture: texture['source'] = image_map[texture['source']]
    for extension in texture.get('extensions', {}).values():
        if isinstance(extension, dict) and 'source' in extension: extension['source'] = image_map[extension['source']]
for before, after in zip(original.get('textures', []), g.get('textures', [])):
    if 'source' in before: assert image_bytes(original,before['source']) == image_bytes(g,after['source'])
    for name, extension in before.get('extensions',{}).items():
        if isinstance(extension,dict) and 'source' in extension: assert image_bytes(original,extension['source']) == image_bytes(g,after['extensions'][name]['source'])
for key in original:
    if key not in ['images','textures']: assert original[key] == g[key], key
j = json.dumps(g, separators=(',',':'),ensure_ascii=False).encode()
j += b' ' * ((-len(j)) % 4)
out = struct.pack('<III',0x46546c67,2,20+len(j)+len(binary_chunk)) + struct.pack('<II',len(j),0x4e4f534a) + j + binary_chunk
assert out[20+len(j):] == binary_chunk
# Unreferenced duplicate image bytes remain in BIN intentionally: geometry and all buffer offsets stay exact.
destination.write_bytes(out)
destination.with_suffix(destination.suffix+'.gz').write_bytes(gzip.compress(out,compresslevel=9,mtime=0))
report={'operation':'Consolidate exact image references only; preserve all geometry, material values, sampler data and BIN bytes','sourceSha256':hashlib.sha256(b).hexdigest(),'outputSha256':hashlib.sha256(out).hexdigest(),'binarySha256Unchanged':hashlib.sha256(binary_chunk).hexdigest(),'originalImageCount':len(original['images']),'outputImageCount':len(g['images']),'duplicates':duplicates,'textureResolvedBytesEqual':True,'gzipBytes':destination.with_suffix(destination.suffix+'.gz').stat().st_size}
destination.with_suffix(destination.suffix+'.dedup.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
