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

def compare(source, runtime, tolerance, source_normals=None, runtime_normals=None, changed_mask=None):
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
    best_normals = np.full(len(rows), np.inf)
    for permutation in [(0,1,2),(1,2,0),(2,0,1)]:
        error = np.linalg.norm(runtime[rows] - source[cols][:, permutation, :], axis=2).max(axis=1)
        if source_normals is not None:
            ne = np.linalg.norm(runtime_normals[rows] - source_normals[cols][:, permutation, :], axis=2).max(axis=1)
            if changed_mask is not None: ne = np.where(changed_mask[cols],ne,0)
            valid = error <= tolerance
            best_normals = np.minimum(best_normals, np.where(valid, ne, np.inf))
        best = np.minimum(best, error)
    allowed = best <= tolerance
    if source_normals is not None:
        allowed &= best_normals <= .005
    r, c, errors = rows[allowed], cols[allowed], best[allowed]
    graph = csr_matrix((np.ones(len(r), dtype=np.uint8), (r, c)), shape=(count, count))
    matching = maximum_bipartite_matching(graph, perm_type='column')
    unmatched = np.where(matching < 0)[0]
    result.update({'passed': len(unmatched) == 0, 'matchedTriangles': int((matching >= 0).sum()), 'unmatchedTriangles': len(unmatched)})
    if len(unmatched):
        result['unmatchedIndices'] = unmatched.tolist()
        result['unmatchedExamples'] = [{'runtimeTriangle': int(i), 'vertices': runtime[i].tolist()} for i in unmatched[:5]]
    else:
        pairs = {(int(row), int(col)): float(error) for row, col, error in zip(r, c, errors)}
        matched_errors = np.array([pairs[(i, int(j))] for i, j in enumerate(matching)])
        result['maximumMatchedVertexErrorMetres'] = float(matched_errors.max(initial=0))
        if source_normals is not None:
            npairs = {(int(row), int(col)): float(error) for row, col, error in zip(rows[allowed], cols[allowed], best_normals[allowed])}
            result['maximumMatchedCornerNormalVectorError'] = max(npairs[(i, int(j))] for i, j in enumerate(matching))
            result['changedCornerNormalsPassedAtVectorTolerance'] = .005
            result['changedNormalTrianglesChecked'] = int(np.sum(changed_mask)) if changed_mask is not None else len(source)
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
        if group['recursive']: assert sha(runtime_path.parent/group['normalFile']) == group['normalSha256'],'Runtime normal fixture changed'
        sn=fixtures[source_key+'_normals'] if group['recursive'] else None
        rn=np.fromfile(runtime_path.parent/group['normalFile'],dtype='<f8').reshape(-1,3,3) if group['recursive'] else None
        reports.append({'group': group['label'], 'sourceKey': source_key, **compare(fixtures[source_key], runtime, args.tolerance,sn,rn,fixtures[source_key+'_changed'] if group['recursive'] else None)})
    report = {
        'scope': 'One-to-one triangle/vertex equivalence of evaluated Blender and actual CPU runtime geometry at each authored cloth extremum, including triangle multiplicity and static contact supports. Cyclic-only vertex matching additionally proves oriented winding is preserved. Added/changed source triangles also match corresponding corner normals within vector error .005 (about 0.29 degrees); legacy unedited/degenerate normals are outside this added-normal check.',
        'sourceSha256': source_meta['sourceSha256'], 'sourceFixtureSha256': sha(source_path),
        'runtimeModelSha256': runtime_meta['modelSha256'], 'passed': all(r['passed'] for r in reports), 'groups': reports,
    }
    pathlib.Path(args.report).write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
    if not report['passed']:
        raise SystemExit(1)

if __name__ == '__main__':
    main()
