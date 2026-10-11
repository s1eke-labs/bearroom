/** Authorized sewn-bear realism hook, layered around the unchanged recovered v11 controller. */
import { PlushAppearance, makeVelvetMaterial } from './plush.js';
export const SEWN_BEAR_CONFIG = Object.freeze({
  revision: 'sewn-bear-reference-v13',
  roots: Object.freeze(['Bear_reference_plush', 'Bear_desk_plush']),
  materialPrefix: 'fabric_bear_sewn_',
  sheen: 0.42,
  sheenRoughness: 0.96,
  specularIntensity: 0.18,
});
function collectAuthoredMaterials(root) {
  const targets=[];
  for(const name of SEWN_BEAR_CONFIG.roots)root.getObjectByName(name)?.traverse(mesh=>{
    if(!mesh.isMesh)return;
    const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
    if(materials.some(m=>m.isMeshStandardMaterial&&m.name.startsWith(SEWN_BEAR_CONFIG.materialPrefix)))targets.push({mesh,materials:materials.map(material=>({material,normalScale:material.normalScale?.clone()})),array:Array.isArray(mesh.material)});
  });
  return targets;
}
function ignoreNapRaycast() {}
export class CurrentPlushAppearance extends PlushAppearance {
  constructor(root,screenUp,options={}) {
    // Capture authored normal scale before the baseline's primary body conversion.
    const authored=collectAuthoredMaterials(root);
    super(root,screenUp,options);
    const refined=new Set();
    if(this.mode==='velvet')for(const {mesh,materials,array} of authored){
      const updated=materials.map(({material,normalScale})=>{
        if(!material.isMeshStandardMaterial||!material.name.startsWith(SEWN_BEAR_CONFIG.materialPrefix))return material;
        const velvet=makeVelvetMaterial(material);
        velvet.sheen=SEWN_BEAR_CONFIG.sheen;
        velvet.sheenRoughness=SEWN_BEAR_CONFIG.sheenRoughness;
        velvet.specularIntensity=SEWN_BEAR_CONFIG.specularIntensity;
        if(normalScale)velvet.normalScale.copy(normalScale);
        if(!refined.has(velvet)){
          const cacheKey=velvet.customProgramCacheKey();
          velvet.customProgramCacheKey=()=>`${cacheKey}|${SEWN_BEAR_CONFIG.revision}`;
          velvet.userData.sewnBearRealism=SEWN_BEAR_CONFIG.revision;
          velvet.needsUpdate=true;
          refined.add(velvet);
        }
        return velvet;
      });
      mesh.material=array?updated:updated[0];
    }
    this.refinedMaterialCount=refined.size;
    this.napMeshes=[];
    for(const name of SEWN_BEAR_CONFIG.roots)root.getObjectByName(name)?.traverse(mesh=>{
      if(!mesh.isMesh||!mesh.userData.toyNap)return;
      // Solid sewn bodies cast shadows. Tiny pile triangles must not shadow or intercept taps.
      mesh.castShadow=false;
      mesh.raycast=ignoreNapRaycast;
      mesh.userData.plushDetailVisible=true;
      mesh.visible=mesh.userData.cutawayVisible!==false;
      this.napMeshes.push(mesh);
    });
  }
  update(camera,height,view){
    super.update(camera,height,view);
    // Authored short nap follows ordinary floor cutaway, independently from legacy fiber LOD.
    for(const mesh of this.napMeshes){mesh.userData.plushDetailVisible=true;mesh.visible=mesh.userData.cutawayVisible!==false;}
  }
  diagnostics(){return{...super.diagnostics(),sewnRealismRevision:this.refinedMaterialCount?SEWN_BEAR_CONFIG.revision:null,sewnMaterials:this.refinedMaterialCount,authoredNapMeshes:this.napMeshes.length,napShadowCasters:this.napMeshes.filter(m=>m.castShadow).length}}
}
// Preserve the recovered main module's binding without renaming any algorithm body.
export { CurrentPlushAppearance as Qx };
