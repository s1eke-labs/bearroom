/** Reference PC detail: shared emissive zones, bounded fan transforms, minute-only display uploads. */
import { L as Vector3, Kt as Box3, ii as MeshBasicMaterial, we as Color, yt as SRGBColorSpace, Ht as LinearFilter } from '../vendor/runtime-v11.js';
import { isWorldVisible, isClipped } from './camera.js';
import { updateAnimatedTransform } from './performance.js';

export const PC_CASE_CONFIG = Object.freeze({
  revision: 'reference-panorama-pc-v16', wallpaperUrl: '/assets/textures/pc-case-v16.webp',
  rootName: 'F09_computer', screenName: 'screen_PC_case_v16',
  rotorPrefix: 'pc16_rotor_', zoneNames: Object.freeze(['pc16_rgb_side', 'pc16_rgb_top', 'pc16_rgb_rear', 'pc16_rgb_trim']),
  displayWidth: 192, displayHeight: 733, displayCheckSeconds: 1,
  breathSeconds: 8, colorSeconds: 18, nearHz: 30, mediumHz: 15, farHz: 8,
});
const TAU = Math.PI * 2;
const PALETTE = Object.freeze(['#ffb5d8', '#c9b8ff', '#e4f6ff']);
const finiteTime = value => Number.isFinite(value) ? Math.max(0, value) : 0;

/** Continuous lighting with a strictly positive floor; no flash, strobe, or hard hue jumps. */
export function pcLightSample(time, zone = 0, day = 0, result = {}) {
  const t = finiteTime(time), phase = ((zone % 3) + 3) % 3;
  result.mix = .5 - .5 * Math.cos(TAU * t / PC_CASE_CONFIG.colorSeconds + phase * TAU / 3);
  result.intensity = (.87 + .12 * Math.sin(TAU * t / PC_CASE_CONFIG.breathSeconds - phase * .55)) * (1 - .38 * Math.min(1, Math.max(0, Number.isFinite(day) ? day : 0)));
  return result;
}
export function pcFanAngle(time, speed = 3.5, base = 0) {
  const rate = Number.isFinite(speed) ? Math.min(6, Math.max(.5, speed)) : 3.5;
  return (Number.isFinite(base) ? base : 0) + (finiteTime(time) * rate % TAU);
}
export function pcUpdateInterval(projectedPixels, distance, perspective = false) {
  if (!Number.isFinite(projectedPixels) || projectedPixels < 3 || (perspective && distance > 18)) return Infinity;
  return 1 / (projectedPixels >= 90 && (!perspective || distance <= 5) ? PC_CASE_CONFIG.nearHz : projectedPixels >= 24 ? PC_CASE_CONFIG.mediumHz : PC_CASE_CONFIG.farHz);
}
export function pcClockMinute(epochMilliseconds) { return Math.floor(epochMilliseconds / 60000); }
export function pcClockText(epochMilliseconds) {
  const date = new Date(epochMilliseconds);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** Canvas is technical UI only. The background is an existing/generated image, never code-drawn art. */
export function drawPcDisplay(context, image, epochMilliseconds, width = PC_CASE_CONFIG.displayWidth, height = PC_CASE_CONFIG.displayHeight) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#e5d8ed'; context.fillRect(0, 0, width, height);
  if (image?.width && image?.height) {
    const scale = Math.max(width / image.width, height / image.height);
    const sourceWidth = width / scale, sourceHeight = height / scale;
    context.drawImage(image, (image.width - sourceWidth) / 2, (image.height - sourceHeight) / 2, sourceWidth, sourceHeight, 0, 0, width, height);
  }
  context.fillStyle = 'rgba(250,246,255,.87)'; context.fillRect(10, 18, width - 20, 111);
  context.textAlign = 'center'; context.textBaseline = 'middle';
  context.fillStyle = '#69557c'; context.font = '500 12px system-ui, sans-serif';
  context.fillText('BEARROOM', width / 2, 40);
  context.font = '500 44px ui-monospace, monospace'; context.fillText(pcClockText(epochMilliseconds), width / 2, 80);
  context.font = '500 10px system-ui, sans-serif'; context.fillText('LOCAL TIME', width / 2, 112);
  context.fillStyle = 'rgba(250,246,255,.86)'; context.fillRect(10, height - 92, width - 20, 72);
  context.fillStyle = '#6a567b'; context.font = '600 12px system-ui, sans-serif';
  context.fillText('PASTEL LIGHT', width / 2, height - 68);
  context.font = '500 10px system-ui, sans-serif'; context.fillText(new Date(epochMilliseconds).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(), width / 2, height - 43);
}

export class PcCaseController {
  constructor(root, { wallpaper = null, genericEmissives = [], canvasFactory = () => document.createElement('canvas'), now = () => Date.now() } = {}) {
    this.root = root.getObjectByName(PC_CASE_CONFIG.rootName);
    this.screen = root.getObjectByName(PC_CASE_CONFIG.screenName);
    this.rotors = []; this.zones = []; this.now = now; this.disposed = false;
    this.elapsed = -Infinity; this.nextClockCheck = 0; this.minute = null;
    this.powered = true; this.powerTime = 0; this.lastTime = 0; this.day = 0;
    this.frameUpdates = 0; this.textureUploads = 0; this.visible = false;
    this.center = new Vector3(); this.projected = new Vector3(); this.edge = new Vector3(); this.cameraPosition = new Vector3(); this.up = new Vector3();
    this.radius = .5; this.palette = PALETTE.map(value => new Color(value)); this.sample = {};
    if (!this.root || !this.screen) return;
    this.root.updateWorldMatrix(true, true);
    const bounds = new Box3().setFromObject(this.root, true);
    bounds.getCenter(this.center); this.radius = Math.max(.1, bounds.min.distanceTo(bounds.max) / 2);
    const seen = new Set();
    this.root.traverse(object => {
      if (!object.isMesh && object.name.startsWith(PC_CASE_CONFIG.rotorPrefix) && object.userData.pcSpinAxis) {
        const axis = object.userData.pcSpinAxis || object.userData.animationAxis || 'y';
        if (!['x', 'y', 'z'].includes(axis)) throw Error(`Invalid PC rotor axis: ${object.name}`);
        this.rotors.push({ object, axis, base: object.rotation[axis], speed: Number.isFinite(object.userData.pcSpinSpeed) ? object.userData.pcSpinSpeed : 3.4 + this.rotors.length * .09 });
      }
      for (const material of Array.isArray(object.material) ? object.material : object.material ? [object.material] : []) {
        if (material.name === 'pc16_glass_low_iron') {
          material.transparent = true; material.opacity = .075; material.roughness = .08;
          material.depthWrite = false; material.forceSinglePass = true;
        }
        const zone = PC_CASE_CONFIG.zoneNames.indexOf(material.name);
        if (zone < 0 || seen.has(material)) continue;
        seen.add(material);
        this.zones.push({ material, zone, base: Math.min(1.8, Math.max(.4, material.emissiveIntensity || 1)) });
      }
    });
    // The general day/night loop must not overwrite these same four emissive materials.
    for (let index = genericEmissives.length - 1; index >= 0; index--) {
      if (this.zones.some(zone => zone.material === genericEmissives[index].mat)) genericEmissives.splice(index, 1);
    }
    this.originalMaterial = this.screen.material;
    // Keep the physical panel and its occlusion/raycast surface when power is off.
    // A map-free material also prevents a late wallpaper refresh from lighting it.
    this.offMaterial = new MeshBasicMaterial({ name: 'PC_Case_Display_Off', color: 0x000000, toneMapped: false, fog: false, side: this.originalMaterial.side });
    if (!wallpaper?.image) return;
    this.canvas = canvasFactory(); this.canvas.width = PC_CASE_CONFIG.displayWidth; this.canvas.height = PC_CASE_CONFIG.displayHeight;
    this.context = this.canvas.getContext('2d');
    if (!this.context) throw Error('PC display canvas is unavailable');
    this.wallpaperImage = wallpaper.image;
    // A new Texture owns a separate Source; cloning a Texture would share the monitor's Source.
    this.texture = new wallpaper.constructor(this.canvas);
    this.texture.name = 'PC_Case_Clock_Texture'; this.texture.colorSpace = SRGBColorSpace; this.texture.flipY = false;
    this.texture.generateMipmaps = false; this.texture.minFilter = LinearFilter; this.texture.magFilter = LinearFilter;
    this.texture.anisotropy = 1;
    this.material = new MeshBasicMaterial({ name: 'PC_Case_Display_Runtime', map: this.texture, toneMapped: false });
    this.setDisplayMaterial(this.material);
    this.updateClock(0, true);
  }
  setDisplayMaterial(material) {
    // Cutaway changes apply to the active material; carry them across each swap.
    const current = this.screen.material;
    material.clippingPlanes = current.clippingPlanes;
    material.clipIntersection = current.clipIntersection; material.clipShadows = current.clipShadows;
    this.screen.material = material;
  }
  advancePowerTime(time) {
    const t = finiteTime(time);
    if (this.powered) this.powerTime += Math.max(0, t - this.lastTime);
    this.lastTime = t;
  }
  setPower(powered, time = this.lastTime) {
    if (this.disposed || !this.root || this.powered === !!powered) return false;
    this.advancePowerTime(time);
    this.powered = !!powered; this.elapsed = -Infinity;
    if (this.offMaterial) {
      if (this.powered) {
        this.updateClock(this.lastTime, true);
        if (this.material) this.material.color.setScalar(.80 + .15 * Math.min(1, Math.max(0, this.day)));
      }
      this.setDisplayMaterial(this.powered ? this.material || this.originalMaterial : this.offMaterial);
    }
    for (const { material, zone, base } of this.zones) {
      pcLightSample(this.powerTime, zone, this.day, this.sample);
      material.emissiveIntensity = this.powered ? base * this.sample.intensity : 0;
    }
    return true;
  }
  togglePower(time = this.lastTime) { this.setPower(!this.powered, time); return this.powered; }
  updateClock(time, force = false) {
    if (this.disposed || !this.powered || !this.texture || (!force && time < this.nextClockCheck)) return;
    this.nextClockCheck = time + PC_CASE_CONFIG.displayCheckSeconds;
    const epoch = this.now(), minute = pcClockMinute(epoch);
    if (!force && minute === this.minute) return;
    drawPcDisplay(this.context, this.wallpaperImage, epoch);
    this.minute = minute; this.texture.needsUpdate = true; this.textureUploads++;
  }
  update(time, camera, viewportHeight, day = 0) {
    if (this.disposed || !this.root || !this.screen || !camera) return false;
    const t = finiteTime(time);
    this.advancePowerTime(t); this.day = day;
    this.visible = false;
    if (!isWorldVisible(this.screen) || isClipped(this.center, this.screen.material)) return false;
    this.projected.copy(this.center).project(camera);
    this.up.setFromMatrixColumn(camera.matrixWorld, 1);
    this.edge.copy(this.center).addScaledVector(this.up, this.radius).project(camera);
    const normalizedRadius = Math.abs(this.edge.y - this.projected.y);
    if (this.projected.z < -1 || this.projected.z > 1 || Math.abs(this.projected.x) > 1 + normalizedRadius * 2 || Math.abs(this.projected.y) > 1 + normalizedRadius) return false;
    camera.getWorldPosition(this.cameraPosition);
    const interval = pcUpdateInterval(normalizedRadius * viewportHeight, this.center.distanceTo(this.cameraPosition), camera.isPerspectiveCamera === true);
    if (!Number.isFinite(interval)) return false;
    this.visible = true;
    // Power-off sleeps the entire case, including canvas draws and GPU uploads.
    if (!this.powered) return false;
    this.updateClock(t);
    if (this.material) this.material.color.setScalar(.80 + .15 * Math.min(1, Math.max(0, day)));
    if (t >= this.elapsed && t - this.elapsed < interval - 1e-6) return false;
    this.elapsed = t;
    for (const rotor of this.rotors) {
      rotor.object.rotation[rotor.axis] = pcFanAngle(this.powerTime, rotor.speed, rotor.base);
      updateAnimatedTransform(rotor.object);
    }
    for (const { material, zone, base } of this.zones) {
      pcLightSample(this.powerTime, zone, day, this.sample);
      material.emissive.copy(this.palette[zone % 3]).lerp(this.palette[(zone + 1) % 3], this.sample.mix);
      material.emissiveIntensity = base * this.sample.intensity;
    }
    this.frameUpdates++;
    return true;
  }
  diagnostics() {
    return { revision: PC_CASE_CONFIG.revision, powered: this.powered, rotorCount: this.rotors.length, emissiveMaterialCount: this.zones.length, textureUploads: this.textureUploads, frameUpdates: this.frameUpdates, visible: this.visible, canvasRGBA8Bytes: this.texture ? PC_CASE_CONFIG.displayWidth * PC_CASE_CONFIG.displayHeight * 4 : 0, newLights: 0, newMeshes: 0 };
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const rotor of this.rotors) { rotor.object.rotation[rotor.axis] = rotor.base; updateAnimatedTransform(rotor.object); }
    if (this.screen && this.originalMaterial) this.setDisplayMaterial(this.originalMaterial);
    this.texture?.dispose(); this.material?.dispose(); this.offMaterial?.dispose();
  }
}
