#!/usr/bin/env python3
"""Losslessly re-encode RGB8 PNG IDAT only; preserve every other PNG chunk.
Requires Pillow. Never installs dependencies or edits authoring masters.
Usage: python scripts/optimize-embedded-png.py input.glb.gz output.glb.gz
Produces an independently testable equivalence certificate beside the output.
"""
import argparse, copy, gzip, hashlib, io, json, struct, zlib
from pathlib import Path
from PIL import Image

def sha(data): return hashlib.sha256(data).hexdigest()
def chunks(data):
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    result, offset = [], 8
    while offset < len(data):
        size = struct.unpack_from('>I', data, offset)[0]
        chunk = data[offset:offset + size + 12]
        assert len(chunk) == size + 12
        assert zlib.crc32(chunk[4:-4]) == struct.unpack('>I', chunk[-4:])[0]
        result.append(chunk)
        offset += len(chunk)
    assert result[-1][4:8] == b'IEND'
    return result

def decode(data):
    raw = gzip.decompress(data) if data[:2] == b'\x1f\x8b' else data
    assert struct.unpack_from('<III', raw) == (0x46546c67, 2, len(raw))
    size = struct.unpack_from('<I', raw, 12)[0]
    return raw, json.loads(raw[20:20 + size]), raw[28 + size:]

def payload(view, binary):
    offset = view.get('byteOffset', 0)
    return binary[offset:offset + view['byteLength']]

def optimize(source, destination):
    assert source.resolve() != destination.resolve(), 'Use a separate output path'
    packed = source.read_bytes()
    old, original, binary = decode(packed)
    document = copy.deepcopy(original)
    replacements, images = {}, []
    for index, image in enumerate(original['images']):
        if image.get('mimeType') != 'image/png' or 'bufferView' not in image:
            continue
        view_index = image['bufferView']
        before = payload(original['bufferViews'][view_index], binary)
        before_chunks = chunks(before)
        # Only RGB8, non-interlaced PNGs. No palette, bit-depth or channel conversion.
        header = before_chunks[0][8:-4]
        if header[8:] != bytes([8, 2, 0, 0, 0]):
            continue
        decoded = Image.open(io.BytesIO(before))
        output = io.BytesIO()
        decoded.save(output, format='PNG', optimize=True)
        encoded_chunks = chunks(output.getvalue())
        assert encoded_chunks[0] == before_chunks[0], 'IHDR changed'
        idat = b''.join(c for c in encoded_chunks if c[4:8] == b'IDAT')
        merged, inserted = [before[:8]], False
        for chunk in before_chunks:
            if chunk[4:8] == b'IDAT':
                if not inserted:
                    merged.append(idat)
                    inserted = True
            else:
                merged.append(chunk)
        after = b''.join(merged)
        if len(after) >= len(before):
            continue
        after_chunks = chunks(after)
        ancillary = lambda cs: b''.join(c for c in cs if c[4:8] != b'IDAT')
        assert ancillary(after_chunks) == ancillary(before_chunks), 'PNG metadata changed'
        candidate = Image.open(io.BytesIO(after))
        assert candidate.mode == decoded.mode and candidate.size == decoded.size
        assert candidate.tobytes() == decoded.tobytes(), 'Decoded image channels changed'
        replacements[view_index] = after
        images.append({'imageIndex': index, 'name': image.get('name'), 'bufferView': view_index,
                       'beforeSha256': sha(before), 'afterSha256': sha(after),
                       'beforeBytes': len(before), 'afterBytes': len(after),
                       'width': decoded.width, 'height': decoded.height, 'bitDepth': 8, 'colorType': 2,
                       'decodedChannelSha256': sha(decoded.tobytes()),
                       'nonIdatChunksSha256': sha(ancillary(before_chunks))})
    parts, offset = [], 0
    for index, view in enumerate(document['bufferViews']):
        assert view.get('buffer', 0) == 0
        data = replacements.get(index, payload(original['bufferViews'][index], binary))
        padding = (-offset) % 4
        parts.append(b'\0' * padding)
        offset += padding
        view['byteOffset'], view['byteLength'] = offset, len(data)
        parts.append(data)
        offset += len(data)
    assert len(document['buffers']) == 1 and 'uri' not in document['buffers'][0]
    document['buffers'][0]['byteLength'] = offset
    data = b''.join(parts)
    data += b'\0' * ((-len(data)) % 4)
    text = json.dumps(document, separators=(',', ':'), ensure_ascii=False).encode()
    text += b' ' * ((-len(text)) % 4)
    result = (struct.pack('<III', 0x46546c67, 2, 28 + len(text) + len(data)) +
              struct.pack('<II', len(text), 0x4e4f534a) + text +
              struct.pack('<II', len(data), 0x004e4942) + data)
    # Exact JSON aside from binary layout, and exact every non-image buffer byte.
    restored = copy.deepcopy(document)
    restored['bufferViews'], restored['buffers'] = original['bufferViews'], original['buffers']
    assert restored == original
    for index, view in enumerate(document['bufferViews']):
        if index not in replacements:
            assert payload(view, data) == payload(original['bufferViews'][index], binary)
    # No accessor is allowed to reference a re-encoded image view.
    def refs(value):
        if isinstance(value, dict):
            for key, item in value.items():
                if key == 'bufferView':
                    assert item not in replacements, 'Non-image reference to image buffer'
                else: refs(item)
        elif isinstance(value, list):
            for item in value: refs(item)
    non_images = {key: value for key, value in original.items() if key != 'images'}
    refs(non_images)
    encoded = gzip.compress(result, compresslevel=9, mtime=0)
    assert gzip.decompress(encoded) == result
    destination.write_bytes(encoded)
    report = {'operation': 'RGB8 PNG IDAT recompression only; original non-IDAT chunks and decoded channel bytes exact',
              'baselineModelSha256': sha(old), 'modelSha256': sha(result),
              'beforeGzipBytes': len(packed), 'afterGzipBytes': len(encoded),
              'savedGzipBytes': len(packed) - len(encoded), 'beforeModelBytes': len(old),
              'afterModelBytes': len(result), 'nonImageBufferViewsByteExact': True,
              'nonLayoutJsonExact': True, 'images': images}
    destination.with_suffix(destination.suffix + '.png-equivalence.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    optimize(args.input, args.output)
