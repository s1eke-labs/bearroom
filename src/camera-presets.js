/** Curated exterior compositions, expressed as radians above the room floor. */
const radians = Math.PI / 180;

export const DEFAULT_CAMERA_PRESET = 'classic';
export const PRESET_TRANSITION_MS = 420;
export const CAMERA_LIMITS = Object.freeze({
  minAzimuth: 35 * radians,
  maxAzimuth: 55 * radians,
  minElevation: 32 * radians,
  maxElevation: 38 * radians,
});

export const CAMERA_PRESETS = Object.freeze([
  Object.freeze({ id: 'classic', label: '经典', azimuth: Math.PI / 4, elevation: Math.asin(1 / Math.sqrt(3)) }),
  Object.freeze({ id: 'left', label: '偏左', azimuth: 35 * radians, elevation: 35 * radians }),
  Object.freeze({ id: 'right', label: '偏右', azimuth: 55 * radians, elevation: 35 * radians }),
]);

export function getCameraPreset(id) {
  return CAMERA_PRESETS.find(preset => preset.id === id) || null;
}
