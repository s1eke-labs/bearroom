#!/usr/bin/env python3
"""Lossless GLB gzip coding only; verify exact bytes after decompression.

Requires the optional reputable python-zopfli package (preinstalled in this
workspace's /usr/bin/python3). This script never installs dependencies.
Example: /usr/bin/python3 scripts/optimize-gzip.py model.glb model.glb.gz --iterations 1
"""
import argparse, gzip, hashlib, json, pathlib, struct, time

def sha(data):
    return hashlib.sha256(data).hexdigest()

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input')
    parser.add_argument('output')
    parser.add_argument('--iterations', type=int, default=1)
    args = parser.parse_args()
    source, destination = pathlib.Path(args.input), pathlib.Path(args.output)
    if source.resolve() == destination.resolve():
        parser.error('Input and output must differ')
    if not 1 <= args.iterations <= 50:
        parser.error('Iterations must be between 1 and 50')
    try:
        import zopfli.gzip
    except ImportError as error:
        raise SystemExit('python-zopfli is unavailable in this interpreter; use an existing interpreter that provides it.') from error
    data = source.read_bytes()
    if data[:2] == b'\x1f\x8b':
        data = gzip.decompress(data)
    assert struct.unpack_from('<III', data) == (0x46546c67, 2, len(data)), 'Valid GLB v2 required'
    start = time.monotonic()
    baseline = gzip.compress(data, compresslevel=9, mtime=0)
    candidate = zopfli.gzip.compress(data, numiterations=args.iterations)
    encoded, encoder = (candidate, 'Zopfli') if len(candidate) < len(baseline) else (baseline, 'zlib')
    assert gzip.decompress(encoded) == data, 'Lossless gzip verification failed'
    destination.write_bytes(encoded)
    assert gzip.decompress(destination.read_bytes()) == data, 'Written file verification failed'
    report = {
        'operation': 'Lossless gzip coding only; uncompressed GLB bytes are exactly unchanged',
        'input': source.name, 'output': destination.name, 'encoder': encoder,
        'iterations': args.iterations, 'glbBytes': len(data), 'modelSha256': sha(data),
        'gzipSha256': sha(encoded), 'gzipBytes': len(encoded),
        'baselineZlibBytes': len(baseline), 'savedBytes': len(baseline) - len(encoded),
        'decodedBytesEqual': True, 'elapsedSeconds': round(time.monotonic() - start, 3),
    }
    destination.with_suffix(destination.suffix + '.compression.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))

if __name__ == '__main__':
    main()
