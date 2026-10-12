/** Export actual curated runtime camera endpoints without a browser or renderer.
 * Usage: node source-assets/preset-review/export_cameras.mjs [repo] [output.json]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const repo = path.resolve(process.argv[2] || '.');
const output = path.resolve(process.argv[3] || '/tmp/bearroom-preset-preview/final-cameras.json');
if (output === repo || output.startsWith(repo + path.sep)) throw Error('Generated review artifacts must stay outside the repository');
const local = name => import(pathToFileURL(path.join(repo, name)));
const { loadSceneForCPU } = await local('tests/helpers.mjs');
const { IsometricRoom, configureControls } = await local('src/camera.js');
const { CAMERA_PRESETS } = await local('src/camera-presets.js');
const { Gr: OrthographicCamera, L: Vector3 } = await local('vendor/runtime-v11.js');
const { ASSET_REVISION } = await local('src/asset-revision.js');
const source = await loadSceneForCPU();
const degrees = radians => radians * 180 / Math.PI;
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, file))).digest('hex');
const frozenFiles = ['source-assets/bearroom-seated-v20.blend', 'public/assets/bearroom.glb.gz', 'public/assets/baked-gi/irradiance.json'];
const frozenFileSha256 = Object.fromEntries(frozenFiles.map(file => [file, sha256(file)]));
const frames = [];
for (const [width, height] of [[1440, 900], [390, 844]]) {
  for (const view of ['overview', 'lower', 'upper']) {
    for (const preset of CAMERA_PRESETS) {
      const root = source.clone(true);
      const camera = new OrthographicCamera(-12, 12, 10, -10, .1, 100);
      const controls = {
        target: new Vector3(0, 2.8, 0), enabled: true,
        mouseButtons: {}, touches: {}, update() {}, addEventListener() {},
      };
      configureControls(controls);
      camera.position.set(20, 20, 20);
      const room = new IsometricRoom(root, camera, controls);
      room.setView(view);
      room.fit(width, height);
      room.selectPreset(preset.id, 0, { reducedMotion: true });
      camera.updateMatrixWorld(true);
      const projection = Object.fromEntries(['left', 'right', 'top', 'bottom', 'zoom'].map(key => [key, camera[key]]));
      const direction = room.direction();
      const expected = new Vector3(Math.sin(preset.azimuth) * Math.cos(preset.elevation), Math.sin(preset.elevation), Math.cos(preset.azimuth) * Math.cos(preset.elevation));
      if (direction.distanceTo(expected) > 1e-9) throw Error(`Unexpected preset endpoint: ${view} ${preset.id}`);
      const aspect = (projection.right - projection.left) / (projection.top - projection.bottom);
      if (Math.abs(aspect - width / height) > 1e-9) throw Error('Orthographic frustum would distort the viewport');
      const projectedUnitAxisLengths = [direction.x, direction.y, direction.z].map(value => Math.sqrt(1 - value * value));
      const floorAxisRatio = Math.max(projectedUnitAxisLengths[0], projectedUnitAxisLengths[2]) / Math.min(projectedUnitAxisLengths[0], projectedUnitAxisLengths[2]);
      room.projectedRoom();
      const points = room.roomCorners.map(point => point.clone().project(camera));
      const projectedBoundsPixels = {
        left: (Math.min(...points.map(point => point.x)) + 1) * width / 2,
        right: (Math.max(...points.map(point => point.x)) + 1) * width / 2,
        top: (1 - Math.max(...points.map(point => point.y))) * height / 2,
        bottom: (1 - Math.min(...points.map(point => point.y))) * height / 2,
      };
      const b = projectedBoundsPixels;
      if (b.left < -1e-6 || b.right > width + 1e-6 || b.top < -1e-6 || b.bottom > height + 1e-6) throw Error(`Preset clips outside viewport: ${view} ${preset.id} ${width}x${height}`);
      const bounds = room.bounds();
      frames.push({
        name: `${view}-${preset.id}-${width}x${height}`,
        view, preset: preset.id, label: preset.label, yaw: degrees(preset.azimuth), elevation: degrees(preset.elevation), width, height,
        projection, position: camera.position.toArray(), target: controls.target.toArray(), direction: direction.toArray(),
        bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
        projectedUnitAxisLengths, floorAxisRatio, projectedBoundsPixels, viewport: room.viewport,
        clipping: view === 'lower' ? { axis: 'y', keep: 'below', value: 2.78 } : view === 'upper' ? { axis: 'y', keep: 'above', value: 2.78 } : null,
        hiddenMeshNames: room.meshes.filter(entry => !entry.object.visible).map(entry => entry.object.name),
        visibleMeshNames: room.meshes.filter(entry => entry.object.visible).map(entry => entry.object.name),
      });
    }
  }
}
for (const [file, hash] of Object.entries(frozenFileSha256)) if (sha256(file) !== hash) throw Error(`Frozen asset changed: ${file}`);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({
  source: 'Actual runtime GLB, CPU scene loader, fit, curated preset endpoint and cutaway. No WebGL renderer or browser.',
  sourceModelSha256: ASSET_REVISION.modelSha256,
  frozenFileSha256,
  sourceCodeSha256: Object.fromEntries(['src/camera.js', 'src/camera-presets.js'].map(file => [file, sha256(file)])),
  coordinateMap: 'Three [x,y,z] -> Blender [x,-z,y]',
  limits: ['CPU camera/visibility fixture only; not browser input, production WebGL/GI, runtime shadows or performance evidence.'],
  frames,
}, null, 2) + '\n');
console.log(`Wrote ${frames.length} camera fixtures to ${output}`);
for (const frame of frames) console.log(frame.name, `floor-axis ratio ${frame.floorAxisRatio.toFixed(4)}`, JSON.stringify(frame.projectedBoundsPixels));
