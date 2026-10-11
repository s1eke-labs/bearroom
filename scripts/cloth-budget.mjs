/** Deterministic operation/upload counts, not measured frame times. */
import { prepareCloth } from '../src/performance.js';
export function measureClothBudget(scene) {
  const cloth = [];
  for (const [name, amplitudeMetres] of [['anim_sofa_edge', .0035], ['anim_dining_edge', .0035], ['anim_bed_edge', .004]]) {
    const mesh = scene.getObjectByName(name);
    if (!mesh?.isMesh) throw Error(`Missing cloth budget mesh ${name}`);
    mesh.geometry.computeBoundingBox();
    const position = mesh.geometry.attributes.position, { min, max } = mesh.geometry.boundingBox;
    const weights = prepareCloth(position.array, min.z, max.z);
    cloth.push({
      name, amplitudeMetres, vertices: position.count,
      triangles: (mesh.geometry.index?.count || position.count) / 3,
      weightedVertices: weights.indices.length,
      positionAttributeBytes: position.array.byteLength,
      dirtyPositionUploadRangeBytes: weights.indices.length ? (weights.indices.at(-1) - weights.indices[0] + 1) * position.array.BYTES_PER_ELEMENT : 0,
    });
  }
  return {
    scope: 'Counts for each active animation frame: one Y-coordinate write per weighted vertex and one bounded GPU position-buffer update range per cloth mesh. Excludes draw, shader, driver and timing costs; not measured CPU/GPU milliseconds or FPS.',
    cloth,
    totalWeightedVertices: cloth.reduce((sum, item) => sum + item.weightedVertices, 0),
    totalPositionUploadRangeBytes: cloth.reduce((sum, item) => sum + item.dirtyPositionUploadRangeBytes, 0),
  };
}
