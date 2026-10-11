import fs from 'node:fs';
import{assetDirectory,parseGLB}from'../scripts/asset-contract.mjs';
import{j0 as GLTFLoader}from'../vendor/runtime-v11.js';
export function loadModelData(file=process.env.BEARROOM_MODEL||assetDirectory()+'/bearroom.glb.gz'){return parseGLB(fs.readFileSync(file))}
export async function loadSceneForCPU(file){
 const {bytes,json}=loadModelData(file);
 const authoredMaterials=structuredClone(json.materials||[]);
 const removeTextures=o=>{if(!o||typeof o!=='object')return;for(const k of Object.keys(o)){if(/Texture$/.test(k))delete o[k];else removeTextures(o[k]);}};
 // CPU-only loading preserves mesh geometry, hierarchy, names, transforms and material names.
 // Texture references are omitted only from this in-memory test fixture; no renderer is created.
 for(const m of json.materials||[])removeTextures(m);
 delete json.images;delete json.textures;delete json.samplers;
 const oldJsonLength=bytes.readUInt32LE(12);const tail=bytes.subarray(20+oldJsonLength);
 let text=JSON.stringify(json);text+=' '.repeat((4-Buffer.byteLength(text)%4)%4);const j=Buffer.from(text);const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(20+j.length+tail.length,8);header.writeUInt32LE(j.length,12);header.writeUInt32LE(0x4e4f534a,16);const payload=Buffer.concat([header,j,tail]);
 const scene=(await new GLTFLoader().parseAsync(payload.buffer.slice(payload.byteOffset,payload.byteOffset+payload.byteLength),'')).scene;
 scene.traverse(mesh=>{if(!mesh.isMesh)return;for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material]){const authored=authoredMaterials.find(m=>m.name===material.name);if(authored?.normalTexture&&material.normalScale){const scale=authored.normalTexture.scale??1;material.normalScale.set(Math.sign(material.normalScale.x)*scale,Math.sign(material.normalScale.y)*scale);}}});
 return scene;
}
