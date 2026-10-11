#!/usr/bin/env python3
"""Match evaluated Blender and runtime triangle soups, preserving multiplicities.

Source: independent phase-fixture.npz and its .json metadata.
Runtime: export-runtime-triangles.mjs output manifest plus binary coordinate files.
Requires NumPy and SciPy. Allows reordering/batching, but no lost/added triangles.
"""
import argparse, hashlib, itertools, json, pathlib
import numpy as np
from scipy.spatial import cKDTree
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import maximum_bipartite_matching

def sha(path):
    return hashlib.sha256(pathlib.Path(path).read_bytes()).hexdigest()

def compare(source, runtime, tolerance):
    count = len(source)
    result = {'sourceTriangles': count, 'runtimeTriangles': len(runtime), 'toleranceMetres': tolerance}
    if source.shape != runtime.shape or not np.all(np.isfinite(source)) or not np.all(np.isfinite(runtime)):
        return {**result, 'passed': False, 'reason': 'Triangle count, shape or finite-coordinate mismatch'}
    # Vertex-equivalent triangles necessarily have centroids within the tolerance.
    candidates = cKDTree(source.mean(axis=1)).query_ball_point(runtime.mean(axis=1), tolerance)
    rows = np.repeat(np.arange(count), [len(v) for v in candidates])
    cols = np.array([v for group in candidates for v in group], dtype=np.int64)
    if not len(cols):
        return {**result, 'passed': False, 'reason': 'No candidate triangles within tolerance'}
    best = np.full(len(rows), np.inf)
    for permutation in itertools.permutations(range(3)):
        error = np.linalg.norm(runtime[rows] - source[cols][:, permutation, :], axis=2).max(axis=1)
        best = np.minimum(best, error)
    allowed = best <= tolerance
    r, c, errors = rows[allowed], cols[allowed], best[allowed]
    graph = csr_matrix((np.ones(len(r), dtype=np.uint8), (r, c)), shape=(count, count))
    matching = maximum_bipartite_matching(graph, perm_type='column')
    unmatched = np.where(matching < 0)[0]
    result.update({'passed': len(unmatched) == 0, 'matchedTriangles': int((matching >= 0).sum()), 'unmatchedTriangles': len(unmatched)})
    if len(unmatched):
        result['unmatchedExamples'] = [{'runtimeTriangle': int(i), 'vertices': runtime[i].tolist()} for i in unmatched[:5]]
    else:
        pairs = {(int(row), int(col)): float(error) for row, col, error in zip(r, c, errors)}
        matched_errors = np.array([pairs[(i, int(j))] for i, j in enumerate(matching)])
        result['maximumMatchedVertexErrorMetres'] = float(matched_errors.max(initial=0))
    return result

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source_npz')
    parser.add_argument('runtime_manifest')
    parser.add_argument('report')
    parser.add_argument('--tolerance', type=float, default=1e-6)
    args = parser.parse_args()
    if not 0 < args.tolerance <= 1e-5:
        parser.error('Export comparison tolerance must be >0 and at most 0.00001 metres')
    source_path, runtime_path = pathlib.Path(args.source_npz), pathlib.Path(args.runtime_manifest)
    source_meta = json.loads(source_path.with_suffix('.json').read_text())
    assert sha(source_path) == source_meta['fixtureSha256'], 'Independent source fixture changed'
    runtime_meta = json.loads(runtime_path.read_text())
    fixtures = np.load(source_path)
    reports = []
    for group in runtime_meta['groups']:
        if group['recursive']:
            source_key = source_meta['supportGroups'][group['objectName']]['key']
        else:
            source_key = source_meta['cloth'][group['objectName']]['phaseKeys'][str(group['phase'])]
        runtime_file = runtime_path.parent / group['file']
        assert sha(runtime_file) == group['sha256'], f"Runtime fixture changed: {group['label']}"
        runtime = np.fromfile(runtime_file, dtype='<f8').reshape(-1, 3, 3)
        reports.append({'group': group['label'], 'sourceKey': source_key, **compare(fixtures[source_key], runtime, args.tolerance)})
    report = {
        'scope': 'One-to-one triangle/vertex equivalence of evaluated Blender and actual CPU runtime geometry at each authored cloth extremum, including triangle multiplicity and static contact supports.',
        'sourceSha256': source_meta['sourceSha256'], 'sourceFixtureSha256': sha(source_path),
        'runtimeModelSha256': runtime_meta['modelSha256'], 'passed': all(r['passed'] for r in reports), 'groups': reports,
    }
    pathlib.Path(args.report).write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
    if not report['passed']:
        raise SystemExit(1)

if __name__ == '__main__':
    main()
