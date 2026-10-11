/** Scene taps share the existing piano hit test. Keyboard motion is cosmetic only. */
import { Zu as DynamicDrawUsage } from '../vendor/runtime-v11.js';
import { isWorldVisible, isClipped } from './camera.js';

export const KEYBOARD_CONFIG = Object.freeze({
  rootName: 'F08_computer_desk',
  meshNames: Object.freeze(['F08_computer_desk__lacquer_pearl', 'F08_computer_desk__polymer_dusty_rose']),
  travel: .004, durationMs: 220,
});
const ancestorNamed = (object, name) => { for (; object; object = object.parent) if (object.name === name) return true; return false; };
export const isPcCaseObject = object => ancestorNamed(object, 'F09_computer');

/** Opaque foreground still occludes every target. Case glass itself is clickable. */
export function roomHitIsVisible(hit) {
  const material = Array.isArray(hit.object.material) ? hit.object.material[hit.face?.materialIndex || 0] : hit.object.material;
  return isWorldVisible(hit.object) && material && !isClipped(hit.point, material) &&
    (isPcCaseObject(hit.object) || (material.opacity > .3 && !/glass/i.test(material.name)));
}
export function sceneTapEndsOnCanvas(event, canvas, documentTarget = globalThis.document) {
  const bounds = canvas.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientY < bounds.top || event.clientX >= bounds.left + bounds.width || event.clientY >= bounds.top + bounds.height) return false;
  return !documentTarget?.elementFromPoint || documentTarget.elementFromPoint(event.clientX, event.clientY) === canvas;
}

/** Weld UV/normal seam duplicates for topology indexing, without altering the mesh.
 * Authored caps are disconnected components. Exact dimensions exclude the desk,
 * drawer fronts and mouse wheel that share the same two material batches.
 */
export function keyboardComponents(geometry) {
  const position = geometry.attributes.position, index = geometry.index;
  if (!position || position.itemSize !== 3) return [];
  const parents = Int32Array.from({ length: position.count }, (_, i) => i), points = new Map();
  const find = i => { while (parents[i] !== i) { parents[i] = parents[parents[i]]; i = parents[i]; } return i; };
  const join = (a, b) => { parents[find(a)] = find(b); };
  for (let i = 0; i < position.count; i++) {
    const key = `${position.getX(i).toFixed(6)},${position.getY(i).toFixed(6)},${position.getZ(i).toFixed(6)}`;
    if (points.has(key)) join(i, points.get(key)); else points.set(key, i);
  }
  for (let i = 0, count = index?.count ?? position.count; i < count; i += 3) {
    const a = index ? index.getX(i) : i;
    join(a, index ? index.getX(i + 1) : i + 1); join(a, index ? index.getX(i + 2) : i + 2);
  }
  const components = new Map();
  for (let i = 0; i < position.count; i++) {
    const id = find(i);
    if (!components.has(id)) components.set(id, { vertices: [], min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] });
    const component = components.get(id); component.vertices.push(i);
    for (let axis = 0; axis < 3; axis++) {
      const value = position.array[i * 3 + axis];
      component.min[axis] = Math.min(component.min[axis], value); component.max[axis] = Math.max(component.max[axis], value);
    }
  }
  const near = (a, b) => Math.abs(a - b) < .0001;
  return [...components.values()].filter(({ min, max }) => {
    const x = max[0] - min[0], y = max[1] - min[1], z = max[2] - min[2];
    return (near(x, .034) && near(y, .021) && near(z, .031)) || (near(x, .210) && near(y, .015) && near(z, .032));
  });
}

export class RoomInteractions {
  constructor(root, { pcCase = null, onDoor = () => {}, onPiano = () => {}, onChange = () => {} } = {}) {
    Object.assign(this, { pcCase, onDoor, onPiano, onChange });
    this.keyMeshes = new Map(); this.activeKeys = new Map(); this.disposed = false;
    const keyboard = root.getObjectByName(KEYBOARD_CONFIG.rootName);
    for (const name of KEYBOARD_CONFIG.meshNames) {
      const mesh = keyboard?.getObjectByName(name);
      if (!mesh?.isMesh) continue;
      const groups = keyboardComponents(mesh.geometry);
      if (!groups.length) continue;
      // Own every geometry/typed array being modified; other scene instances and
      // the original asset remain byte-exact. No mesh or material is added.
      const original = mesh.geometry, geometry = original.clone(); mesh.geometry = geometry;
      const position = geometry.attributes.position; position.setUsage(DynamicDrawUsage);
      const base = position.array.slice(), vertexToKey = new Int16Array(position.count).fill(-1);
      geometry.computeBoundingBox(); geometry.boundingBox.expandByScalar(KEYBOARD_CONFIG.travel);
      geometry.computeBoundingSphere(); geometry.boundingSphere.radius += KEYBOARD_CONFIG.travel;
      const entry = { mesh, original, geometry, position, base, vertexToKey, keys: [] };
      for (const group of groups) {
        const key = { entry, vertices: Uint32Array.from(group.vertices), started: 0, offset: 0, min: group.min, max: group.max };
        for (const vertex of group.vertices) vertexToKey[vertex] = entry.keys.length;
        entry.keys.push(key);
      }
      this.keyMeshes.set(mesh, entry);
    }
  }
  target(hit) {
    if (this.disposed || !hit?.object) return null;
    if (ancestorNamed(hit.object, 'bathroom_door_hinge')) return { type: 'door' };
    if (isPcCaseObject(hit.object) && this.pcCase) return { type: 'pc' };
    const entry = this.keyMeshes.get(hit.object);
    if (entry && Number.isInteger(hit.faceIndex)) {
      const vertex = entry.geometry.index ? entry.geometry.index.getX(hit.faceIndex * 3) : hit.faceIndex * 3;
      const key = entry.keys[entry.vertexToKey[vertex]];
      if (key) return { type: 'keyboard', key };
    }
    if (Number.isInteger(hit.object.userData.midi)) return { type: 'piano', midi: hit.object.userData.midi };
    return null;
  }
  interact(hit, now = performance.now(), sceneTime = 0) {
    const target = this.target(hit);
    if (!target) return false;
    if (target.type === 'door') this.onDoor();
    else if (target.type === 'pc') this.pcCase.togglePower(sceneTime);
    else if (target.type === 'piano') this.onPiano(target.midi);
    else {
      // A fresh tap restarts from its current depression, never from accumulated
      // offsets. No text, keyboard events, navigation or sound are generated.
      target.key.started = now; target.key.startOffset = target.key.offset;
      this.activeKeys.set(target.key, target.key);
    }
    this.onChange(); return true;
  }
  update(now) {
    if (!this.activeKeys.size || this.disposed) return false;
    const dirty = new Set();
    for (const key of this.activeKeys.values()) {
      const phase = Math.min(1, Math.max(0, (now - key.started) / KEYBOARD_CONFIG.durationMs));
      const down = Math.sin(phase * Math.PI) * KEYBOARD_CONFIG.travel;
      key.offset = phase === 1 ? 0 : Math.max(down, key.startOffset * (1 - phase));
      const { position, base } = key.entry;
      if (!dirty.has(key.entry)) { position.clearUpdateRanges(); dirty.add(key.entry); }
      // Existing keyboard cap faces and chassis share local +Y as their normal.
      // Translating only Y preserves every bevel, UV and original normal.
      for (const vertex of key.vertices) position.array[vertex * 3 + 1] = base[vertex * 3 + 1] - key.offset;
      const first = key.vertices[0], last = key.vertices[key.vertices.length - 1];
      position.addUpdateRange(first * 3, (last - first + 1) * 3);
      if (phase === 1) this.activeKeys.delete(key);
    }
    for (const entry of dirty) entry.position.needsUpdate = true;
    return true;
  }
  resetKeys() {
    for (const key of this.activeKeys.values()) key.started = -Infinity;
    this.update(0);
  }
  dispose() {
    if (this.disposed) return;
    this.resetKeys(); this.disposed = true;
    for (const entry of this.keyMeshes.values()) { entry.mesh.geometry = entry.original; entry.geometry.dispose(); }
    this.keyMeshes.clear();
  }
}
