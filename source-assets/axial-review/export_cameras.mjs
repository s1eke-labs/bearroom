/** Export actual axial runtime camera endpoints without a browser or renderer.
 * Usage: node source-assets/axial-review/export_cameras.mjs [repo] [output.json] [candidate]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const repo = path.resolve(process.argv[2] || '.');
const output = path.resolve(process.argv[3] || '/tmp/bearroom-axial-preview/final-cameras.json');
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
const sourceCodeSha256 = Object.fromEntries(['src/camera.js', 'src/camera-presets.js'].map(file => [file, sha256(file)]));
const candidate = process.argv[4] === 'candidate';
const reviewPresets = candidate ? [
  { id: 'classic', label: '经典', azimuth: Math.PI / 4, elevation: Math.asin(1 / Math.sqrt(3)) },
  { id: 'left', label: '正左', azimuth: 0, elevation: Math.asin(1 / Math.sqrt(3)) },
  { id: 'right', label: '正右', azimuth: Math.PI / 2, elevation: Math.asin(1 / Math.sqrt(3)) },
] : CAMERA_PRESETS;
const expectedYaw = { classic: Math.PI / 4, left: 0, right: Math.PI / 2 };
if (reviewPresets.length !== 3 || new Set(reviewPresets.map(preset => preset.id)).size !== 3 || reviewPresets.some(preset => !(preset.id in expectedYaw))) throw Error('Expected exactly classic/left/right presets');
for (const preset of reviewPresets) {
  if (Math.abs(preset.azimuth - expectedYaw[preset.id]) > 1e-12 || Math.abs(preset.elevation - Math.asin(1 / Math.sqrt(3))) > 1e-12) throw Error('Runtime axial presets are not ready');
}
const frames = [];
for (const [width, height] of [[1440, 900], [390, 844]]) {
  for (const view of ['overview', 'lower', 'upper']) {
    for (const preset of reviewPresets) {
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
      if (candidate) {
        // Proposed axial pose with a temporary orientation-specific orthographic fit.
        // This is explicitly a candidate, not evidence of the runtime implementation.
        const d = new Vector3(Math.sin(preset.azimuth) * Math.cos(preset.elevation), Math.sin(preset.elevation), Math.cos(preset.azimuth) * Math.cos(preset.elevation));
        room.syncFrame(d);
        const extent = room.projectedRoom().box.max.clone().sub(room.projectedRoom().box.min);
        const v = room.viewport, aspect = width / height;
        const halfHeight = Math.max(extent.y * height / (height - v.top - v.bottom), extent.x * width / (width - 2 * v.side) / aspect) * 0.54;
        const offset = (v.top - v.bottom) / height * halfHeight;
        camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
        camera.top = halfHeight + offset; camera.bottom = -halfHeight + offset;
        camera.position.copy(controls.target).addScaledVector(d, 35);
        camera.lookAt(controls.target); camera.updateProjectionMatrix();
      } else room.selectPreset(preset.id, 0, { reducedMotion: true });
      camera.updateMatrixWorld(true);
      const projection = Object.fromEntries(['left', 'right', 'top', 'bottom', 'zoom'].map(key => [key, camera[key]]));
      const direction = room.direction();
      const basisRight = new Vector3(direction.z, 0, -direction.x).normalize();
      const basisUp = direction.clone().cross(basisRight).normalize();
      const axisScreen = Object.fromEntries(['x', 'y', 'z'].map((axis, index) => {
        const unit = new Vector3().setComponent(index, 1);
        return [axis, [unit.dot(basisRight), unit.dot(basisUp)]];
      }));
      if (preset.id !== 'classic') {
        const horizontal = preset.id === 'left' ? axisScreen.x : axisScreen.z;
        const depth = preset.id === 'left' ? axisScreen.z : axisScreen.x;
        if (Math.abs(horizontal[1]) > 1e-12 || Math.abs(depth[0]) > 1e-12 || Math.abs(axisScreen.y[0]) > 1e-12) throw Error('Side preset is not aligned to the house axes');
      }
      if (room.meshes.some(entry => /wall_east|wall_south/.test(entry.object.name) && entry.object.visible)) throw Error('A front cutaway wall is visible');
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
      const v = room.viewport;
      const reservedAreaMarginsPixels = { left: b.left - v.side, right: width - v.side - b.right, top: b.top - v.top, bottom: height - v.bottom - b.bottom };
      if (Object.values(reservedAreaMarginsPixels).some(value => value < -1e-6)) throw Error(`Preset clips into reserved UI area: ${view} ${preset.id} ${width}x${height}`);
      const bounds = room.bounds();
      frames.push({
        name: `${view}-${preset.id}-${width}x${height}`,
        view, preset: preset.id, label: preset.label, yaw: degrees(preset.azimuth), elevation: degrees(preset.elevation), width, height,
        projection, position: camera.position.toArray(), target: controls.target.toArray(), direction: direction.toArray(),
        bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
        projectedUnitAxisLengths, floorAxisRatio, axisScreen, projectedBoundsPixels, reservedAreaMarginsPixels, viewport: room.viewport,
        clipping: view === 'lower' ? { axis: 'y', keep: 'below', value: 2.78 } : view === 'upper' ? { axis: 'y', keep: 'above', value: 2.78 } : null,
        hiddenMeshNames: room.meshes.filter(entry => !entry.object.visible).map(entry => entry.object.name),
        visibleMeshNames: room.meshes.filter(entry => entry.object.visible).map(entry => entry.object.name),
      });
    }
  }
}
for (const [file, hash] of Object.entries({ ...frozenFileSha256, ...sourceCodeSha256 })) if (sha256(file) !== hash) throw Error(`Frozen review input changed: ${file}`);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({
  previewStage: candidate ? 'candidate' : 'runtime',
  source: candidate ? 'Actual runtime GLB and cutaway, with proposed axial pose and temporary per-angle orthographic fit. Not runtime endpoint evidence.' : 'Actual runtime GLB, CPU scene loader, fit, exact axial preset endpoint and cutaway. No WebGL renderer or browser.',
  axialDefinition: {
    classic: '45 degrees from +Z toward +X; original isometric elevation',
    left: '0 degrees: from +Z toward -Z, through south opening, classic image-left face',
    right: '90 degrees: from +X toward -X, through east opening, classic image-right face',
    elevation: degrees(Math.asin(1 / Math.sqrt(3))),
    projection: 'Orthographic. Side views are axial in plan, with a downward view; not zero-elevation facade views.',
  },
  sourceModelSha256: ASSET_REVISION.modelSha256,
  frozenFileSha256,
  sourceCodeSha256,
  coordinateMap: 'Three [x,y,z] -> Blender [x,-z,y]',
  limits: ['CPU camera/visibility fixture only; not browser input, production WebGL/GI, runtime shadows or performance evidence.'],
  frames,
}, null, 2) + '\n');
console.log(`Wrote ${frames.length} camera fixtures to ${output}`);
for (const frame of frames) console.log(frame.name, `floor-axis ratio ${frame.floorAxisRatio.toFixed(4)}`, JSON.stringify(frame.projectedBoundsPixels));
