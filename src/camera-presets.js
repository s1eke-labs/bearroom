/** Curated exterior compositions, expressed as radians above the room floor. */
const radians = Math.PI / 180;
const isometricElevation = Math.asin(1 / Math.sqrt(3));

export const DEFAULT_CAMERA_PRESET = 'classic';
export const PRESET_TRANSITION_MS = 420;
export const CAMERA_LIMITS = Object.freeze({
  minAzimuth: 0,
  maxAzimuth: Math.PI / 2,
  minElevation: 32 * radians,
  maxElevation: 38 * radians,
});

export const CAMERA_PRESETS = Object.freeze([
  Object.freeze({ id: 'classic', label: '经典', azimuth: Math.PI / 4, elevation: isometricElevation }),
  // The south (+Z) opening is on the classic view's screen-left; east (+X) is screen-right.
  Object.freeze({ id: 'left', label: '正左', azimuth: 0, elevation: isometricElevation }),
  Object.freeze({ id: 'right', label: '正右', azimuth: Math.PI / 2, elevation: isometricElevation }),
]);

export function getCameraPreset(id) {
  return CAMERA_PRESETS.find(preset => preset.id === id) || null;
}
