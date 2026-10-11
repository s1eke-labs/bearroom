/** Optional occluded world-sky transport, kept separate from analytic-light bounce.
 * Values are unit-white outgoing radiance. The existing GPU shader applies pi once.
 * Summation happens only while packing the existing volume; no new texture/fetch.
 */
export const SKY_TRANSPORT = Object.freeze({
  quantity: 'unit-white Lambertian radiance',
  method: 'Cycles DIFFUSE direct+indirect, world only',
  valuesPerState: 2880,
  maxPackedRadiance: 65504,
});

export function validateSkyTransport(data) {
  if (data.sky === undefined) return data;
  const sky = data.sky;
  if (!sky || typeof sky !== 'object' ||
      sky.quantity !== SKY_TRANSPORT.quantity || sky.method !== SKY_TRANSPORT.method ||
      sky.analyticLights !== false || sky.emissiveSurfaces !== false) {
    throw new Error('Unsupported sky transport: expected separate world-only radiance');
  }
  if (!/^[a-f0-9]{64}$/.test(sky.sourceSha256 || '') || sky.sourceSha256 !== data.sourceSha256) {
    throw new Error('Sky transport source revision does not match analytic bake source');
  }
  for (const state of ['day', 'night']) {
    const values = sky.states?.[state], indirect = data.states?.[state];
    if (!Array.isArray(values) || values.length !== SKY_TRANSPORT.valuesPerState ||
        !Array.isArray(indirect) || indirect.length !== SKY_TRANSPORT.valuesPerState ||
        !values.every((value, index) => Number.isFinite(value) && value >= 0 &&
          Number.isFinite(indirect[index]) && indirect[index] >= 0 &&
          value + indirect[index] <= SKY_TRANSPORT.maxPackedRadiance)) {
      throw new Error(`Invalid ${state} sky radiance or packed Float16 range`);
    }
  }
  return data;
}

/** Called after volume validation. Never mutate either separately labelled input. */
export function combinedRadiance(data, state) {
  const indirect = data.states[state];
  return data.sky ? indirect.map((value, index) => value + data.sky.states[state][index]) : indirect;
}
