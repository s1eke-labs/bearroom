/** Recovered from production v11. Minifier aliases are retained deliberately; this is not the lost original source.
 * Exact pre-recovery segment SHA256: 777c179025ba02beec7d9a54c3ef82ab71570d9a143f6dc818081d064686c456
 */
import { ASSET_REVISION } from './asset-revision.js';
import { validateSkyTransport, combinedRadiance } from './sky-transport.js';
import { Ht, hs, Yt, L, ph, Ld, Ue } from '../vendor/runtime-v11.js';
const Io = ASSET_REVISION.bakeSourceSha256;
function Zh(i) {
  if (i.version !== 1 || i.dimensions.join(",") !== "5,2,4" || i.regions.length !== 4) throw new Error("Unsupported baked irradiance volume");
  const e = 960 * 3;
  for (const t of ["day", "night"]) {
    const n = i.states[t];
    if (n.length !== e || !n.every((s) => Number.isFinite(s) && s >= 0)) throw new Error(`Invalid ${t} baked radiance`);
  }
  return validateSkyTransport(i);
}
function ev(i) {
  Zh(i);
  const [e, t, n] = i.dimensions, s = n * 6 * 4 * 2, r = new Float32Array(e * t * s * 4);
  return ["night", "day"].forEach((a, o) => {
    const l = combinedRadiance(i, a);
    for (let c = 0; c < 4; c++) for (let u = 0; u < n; u++) for (let h = 0; h < t; h++) for (let d = 0; d < e; d++) for (let p = 0; p < 6; p++) {
      const g = ((((c * n + u) * t + h) * e + d) * 6 + p) * 3, _ = ((((o * 4 + c) * 6 + p) * n + u) * t * e + h * e + d) * 4;
      r.set(l.slice(g, g + 3), _), r[_ + 3] = 1;
    }
  }), { array: r, width: e, height: t, depth: s };
}
const tv = `
uniform highp sampler3D bakedGIVolume;
uniform float bakedGIDay;
uniform vec3 bakedGIMin[4];
uniform vec3 bakedGIMax[4];

vec3 giFace(vec3 p, int region, float face, float state) {
  vec3 q = clamp((p-bakedGIMin[region])/(bakedGIMax[region]-bakedGIMin[region]),0.0,1.0);
  vec3 texel = vec3(q.x*4.0+0.5,q.y+0.5,q.z*3.0+0.5);
  texel.z += ((state*4.0+float(region))*6.0+face)*4.0;
  return texture(bakedGIVolume, texel/vec3(5.0,2.0,192.0)).rgb;
}
vec3 giSample(vec3 p, vec3 n) {
  int r = p.y >= 2.99 ? 3 : ((p.x >= 2.42 && p.x <= 5.1 && p.y <= 2.82 && p.z >= -4.1 && p.z <= -1.96) ? 2 : (p.z < -1.84 ? 1 : 0));
  vec3 w=n*n;
  float fx=n.x>=0.0?0.0:1.0, fy=n.y>=0.0?2.0:3.0, fz=n.z>=0.0?4.0:5.0;
  vec3 nightGI=vec3(0.0),dayGI=vec3(0.0);
  if(bakedGIDay<1.0) nightGI=giFace(p,r,fx,0.0)*w.x+giFace(p,r,fy,0.0)*w.y+giFace(p,r,fz,0.0)*w.z;
  if(bakedGIDay>0.0) dayGI=giFace(p,r,fx,1.0)*w.x+giFace(p,r,fy,1.0)*w.y+giFace(p,r,fz,1.0)*w.z;
  return mix(nightGI,dayGI,bakedGIDay)*3.141592653589793;
}
`, nv = `
bool giInsideBath(vec3 p) {
  return all(greaterThan(p,vec3(2.465,0.045,-3.950))) && all(lessThan(p,vec3(4.875,2.82,-2.057)));
}
vec3 giViewToWorld(vec3 p) { return (vec4(p,0.0)*viewMatrix).xyz+cameraPosition; }
float giSlabVisibility(vec3 p, vec3 l) {
  float dy=l.y-p.y;
  if(abs(dy)<0.00001)return 1.0;
  float t=(2.97-p.y)/dy;
  if(t<=0.001 || t>=0.999)return 1.0;
  vec3 hit=mix(p,l,t);
  bool mainSlab=hit.x>=-3.8 && hit.x<=5.0 && hit.z>=-4.0 && hit.z<=0.7522727;
  bool westLanding=hit.x>=-5.0 && hit.x< -3.8 && hit.z>=-4.0 && hit.z<=-1.35;
  return mainSlab || westLanding ? 0.0 : 1.0;
}
float giBathVisibility(vec3 viewP, vec3 viewL, vec3 viewN) {
  vec3 p=giViewToWorld(viewP)+(vec4(viewN,0.0)*viewMatrix).xyz*0.025;
  vec3 l=giViewToWorld(viewL);
  if(giSlabVisibility(p,l)<0.5)return 0.0;
  bool a=giInsideBath(p),b=giInsideBath(l);
  if(a && b)return 1.0;
  if(a != b)return 0.0;
  vec3 d=l-p;
  vec3 safeD=mix(vec3(0.000001),d,greaterThan(abs(d),vec3(0.000001)));
  vec3 t0=(vec3(2.465,0.045,-3.950)-p)/safeD;
  vec3 t1=(vec3(4.875,2.82,-2.057)-p)/safeD;
  vec3 lo=min(t0,t1),hi=max(t0,t1);
  float enter=max(max(lo.x,lo.y),max(lo.z,0.001));
  float leave=min(min(hi.x,hi.y),min(hi.z,0.999));
  return enter < leave ? 0.0 : 1.0;
}
`;
function iv(i, e, { indirectSheen: t = false } = {}) {
  Object.assign(i.uniforms, e), i.fragmentShader = tv + nv + i.fragmentShader;
  const n = Ue.lights_fragment_begin.replace("getPointLightInfo( pointLight, geometryPosition, directLight );", "getPointLightInfo( pointLight, geometryPosition, directLight ); directLight.color *= giBathVisibility(geometryPosition, pointLight.position, geometryNormal);").replace("getSpotLightInfo( spotLight, geometryPosition, directLight );", "getSpotLightInfo( spotLight, geometryPosition, directLight ); directLight.color *= giBathVisibility(geometryPosition, spotLight.position, geometryNormal);").replace("getDirectionalLightInfo( directionalLight, directLight );", "getDirectionalLightInfo( directionalLight, directLight ); directLight.color *= giBathVisibility(geometryPosition, geometryPosition+directionalLight.direction*100.0, geometryNormal);");
  i.fragmentShader = i.fragmentShader.replace("#include <lights_fragment_begin>", n);
  const s = t ? `
    vec3 bearBakedIrradiance = giSample(giViewToWorld(geometryPosition),normalize((vec4(geometryNormal,0.0)*viewMatrix).xyz));
    irradiance += bearBakedIrradiance;
#ifdef USE_SHEEN
    sheenSpecularIndirect += bearBakedIrradiance * material.sheenColor * IBLSheenBRDF(geometryNormal, geometryViewDir, material.sheenRoughness);
#endif` : `
    irradiance += giSample(giViewToWorld(geometryPosition),normalize((vec4(geometryNormal,0.0)*viewMatrix).xyz));`;
  i.fragmentShader = i.fragmentShader.replace("#include <lights_fragment_maps>", `${Ue.lights_fragment_maps.replace("iblIrradiance += getIBLIrradiance( geometryNormal );", "/* Diffuse ambient replaced by scene-bounced irradiance; specular IBL stays. */")}
#if defined(RE_IndirectDiffuse)
${s}
#endif`);
}
async function sv(i, { url: e = `/assets/baked-gi/irradiance.json?v=${Io.slice(0, 16)}`, data: t } = {}) {
  if (!t) {
    const c = await fetch(e);
    if (!c.ok) throw new Error(`Baked GI unavailable (${c.status})`);
    t = await c.json();
  }
  if (Zh(t), t.sourceSha256 !== Io) throw new Error("Baked GI source revision does not match this model build");
  const n = ev(t), s = new Uint16Array(n.array.length);
  n.array.forEach((c, u) => {
    s[u] = Ld.toHalfFloat(c);
  });
  const r = new ph(s, n.width, n.height, n.depth);
  r.format = Yt, r.type = hs, r.minFilter = r.magFilter = Ht, r.unpackAlignment = 1, r.generateMipmaps = false, r.needsUpdate = true;
  const a = { bakedGIVolume: { value: r }, bakedGIDay: { value: 1 }, bakedGIMin: { value: t.regions.map((c) => new L(...c.min)) }, bakedGIMax: { value: t.regions.map((c) => new L(...c.max)) } }, o = /* @__PURE__ */ new Set();
  let l = 0;
  return i.traverse((c) => {
    if (c.isMesh) {
      for (const u of Array.isArray(c.material) ? c.material : [c.material]) {
        if (!u.isMeshStandardMaterial || o.has(u)) continue;
        o.add(u);
        const h = u.onBeforeCompile, d = u.customProgramCacheKey(), p = u.userData.bearVelvet === true;
        u.onBeforeCompile = function(g, _) {
          h.call(this, g, _), iv(g, a, { indirectSheen: p });
        }, u.customProgramCacheKey = () => `${d}|cycles-indirect-volume-v1${p ? "|bear-indirect-sheen-v1" : ""}`, u.needsUpdate = true;
      }
      l++;
    }
  }), { textures: Object.freeze([r]), setDay(c) {
    a.bakedGIDay.value = Math.max(0, Math.min(1, c));
  }, diagnostics() {
    return { active: true, method: t.method, sourceSha256: t.sourceSha256, materials: o.size, meshes: l, day: a.bakedGIDay.value, regions: t.regions.map((c) => c.name), probes: 160, textureBytes: s.byteLength, samples: t.samples, diffuseBounces: t.diffuseBounces };
  }, dispose() {
    r.dispose();
  } };
}

export { Io, sv, Zh as validateIrradiance, ev as packIrradiance, iv as patchBakedShader, sv as applyBakedGI, Io as BAKE_SOURCE_REVISION };
