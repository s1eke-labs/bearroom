/** Export actual runtime camera fixtures without a browser or renderer.
 * Usage: node source-assets/orbit-review/export_cameras.mjs [repo] [output.json]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const repo = path.resolve(process.argv[2] || '.');
const output = path.resolve(process.argv[3] || '/tmp/bearroom-orbit-preview/cameras.json');
const local = name => import(pathToFileURL(path.join(repo, name)));
const { loadSceneForCPU } = await local('tests/helpers.mjs');
const { IsometricRoom, configureControls, ROOM_ORBIT } = await local('src/camera.js');
const { Gr: OrthographicCamera, L: Vector3 } = await local('vendor/runtime-v11.js');
const { ASSET_REVISION } = await local('src/asset-revision.js');
const source = await loadSceneForCPU();
const degrees = radians => radians * 180 / Math.PI;
const label = value => String(Math.round(value * 1000) / 1000);
const angles = [
  [ROOM_ORBIT.defaultAzimuth, Math.PI / 2 - ROOM_ORBIT.defaultPolar],
  [ROOM_ORBIT.minAzimuth, ROOM_ORBIT.minElevation],
  [ROOM_ORBIT.minAzimuth, ROOM_ORBIT.maxElevation],
  [ROOM_ORBIT.maxAzimuth, ROOM_ORBIT.minElevation],
  [ROOM_ORBIT.maxAzimuth, ROOM_ORBIT.maxElevation],
];
const frames = [];
for (const view of ['overview', 'lower', 'upper']) {
  for (const [yaw, elevation] of angles) {
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
    // Reproduce normal interaction: default fit exactly once, then orbit.
    // Never refit/reset at an extreme to hide potential framing failures.
    room.fit(1440, 900);
    const projection = Object.fromEntries(['left', 'right', 'top', 'bottom', 'zoom'].map(key => [key, camera[key]]));
    const direction = new Vector3(Math.sin(yaw) * Math.cos(elevation), Math.sin(elevation), Math.cos(yaw) * Math.cos(elevation));
    camera.position.copy(controls.target).addScaledVector(direction, ROOM_ORBIT.distance);
    camera.lookAt(controls.target);
    camera.updateMatrixWorld(true);
    room.constrain();
    for (const [key, value] of Object.entries(projection)) {
      if (Math.abs(camera[key] - value) > 1e-12) throw Error(`Orbit changed ${key} for ${view}`);
    }
    const actualDirection = room.direction();
    if (actualDirection.distanceTo(direction) > 1e-9) throw Error(`Requested angle was clamped for ${view}`);
    const bounds = room.bounds();
    frames.push({
      name: `${view}-yaw${label(degrees(yaw))}-elev${label(degrees(elevation))}`,
      view, yaw: degrees(yaw), elevation: degrees(elevation), width: 1440, height: 900,
      projection, position: camera.position.toArray(), target: controls.target.toArray(), direction: actualDirection.toArray(),
      bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
      clipping: view === 'lower' ? { axis: 'y', keep: 'below', value: 2.78 } : view === 'upper' ? { axis: 'y', keep: 'above', value: 2.78 } : null,
      hiddenMeshNames: room.meshes.filter(entry => !entry.object.visible).map(entry => entry.object.name),
      visibleMeshNames: room.meshes.filter(entry => entry.object.visible).map(entry => entry.object.name),
    });
  }
}
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, file))).digest('hex');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({
  source: 'Actual runtime GLB, CPU scene loader, camera fit and cutaway; default fit once, move camera relative to its target, then constrain without refitting.',
  sourceModelSha256: ASSET_REVISION.modelSha256,
  sourceCodeSha256: { 'src/camera.js': sha256('src/camera.js'), 'src/orbit-input.js': sha256('src/orbit-input.js') },
  coordinateMap: 'Three [x,y,z] -> Blender [x,-z,y]',
  limits: ['CPU camera/visibility fixture only; not browser input, WebGL/GI, runtime shadows or performance evidence.'],
  frames,
}, null, 2) + '\n');
console.log(`Wrote ${frames.length} camera fixtures to ${output}`);
