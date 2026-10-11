/** Export CPU-evaluated runtime triangle soups for independent source equivalence.
 * No rendering, geometry edits to assets, quantization, or material changes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadSceneForCPU, loadModelData } from '../tests/helpers.mjs';
import { prepareCloth, updateCloth } from '../src/performance.js';
import { sha256 } from './asset-contract.mjs';
import { L as Vector3 } from '../vendor/runtime-v11.js';

const [file, output] = process.argv.slice(2);
if (!file || !output) throw Error('Usage: node scripts/export-runtime-triangles.mjs MODEL.glb[.gz] OUTPUT_DIRECTORY');
fs.mkdirSync(output, { recursive: true });
const { bytes } = loadModelData(file), scene = await loadSceneForCPU(file);
scene.updateMatrixWorld(true);
const groups = [];
function extract(objectName, phase, amplitude, label, recursive = false) {
  const root = scene.getObjectByName(objectName);
  if (!root) throw Error(`Missing triangle fixture object ${objectName}`);
  const meshes = [];
  if (recursive) root.traverse(object => { if (object.isMesh && !object.name.startsWith('anim_')) meshes.push(object); });
  else { if (!root.isMesh) throw Error(`${objectName} is not a direct mesh`); meshes.push(root); }
  const count = meshes.reduce((sum, mesh) => sum + (mesh.geometry.index?.count || mesh.geometry.attributes.position.count) / 3, 0);
  const triangles = new Float64Array(count * 9), point = new Vector3();
  let cursor = 0;
  for (const mesh of meshes) {
    const geometry = mesh.geometry;
    const array = geometry.attributes.position.array.slice();
    if (amplitude) {
      geometry.computeBoundingBox();
      const { min, max } = geometry.boundingBox;
      updateCloth(array, prepareCloth(array, min.z, max.z), phase * amplitude);
    }
    const index = geometry.index?.array, length = index?.length || array.length / 3;
    for (let i = 0; i < length; i++) {
      const at = (index ? index[i] : i) * 3;
      point.fromArray(array, at).applyMatrix4(mesh.matrixWorld);
      triangles[cursor++] = point.x; triangles[cursor++] = point.y; triangles[cursor++] = point.z;
    }
  }
  const binary = Buffer.from(triangles.buffer), filename = label + '.f64';
  fs.writeFileSync(path.join(output, filename), binary);
  groups.push({ label, objectName, phase, amplitude, recursive, triangles: count, file: filename, sha256: sha256(binary), matrixWorld: root.matrixWorld.toArray() });
}
for (const [name, amplitude] of [['anim_sofa_edge', .0035], ['anim_dining_edge', .0035], ['anim_bed_edge', .004]]) {
  for (const [phase, suffix] of [[-1, 'negative'], [0, 'rest'], [1, 'positive']]) extract(name, phase, amplitude, `${name}__${suffix}`);
}
for (const name of ['F01_sofa', 'F15_bed', 'F13_dining_group', 'F08_computer_desk', 'Bear_reference_plush', 'Bear_desk_plush']) extract(name, 0, 0, `${name}__static`, true);
const manifest = { format: 'little-endian float64 triangle coordinates; N x 3 vertices x XYZ', coordinateSystem: 'Three.js runtime world XYZ, Y-up', modelSha256: sha256(bytes), groups };
fs.writeFileSync(path.join(output, 'runtime-triangles.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ modelSha256: manifest.modelSha256, groups: groups.map(({ label, triangles }) => ({ label, triangles })) }, null, 2));
