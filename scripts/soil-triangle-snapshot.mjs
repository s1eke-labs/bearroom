/** Material-only soil change: canonical world-space triangle multiset, independent of primitive splitting. */
import{L as Vector3}from'../vendor/runtime-v11.js';
import{hashBytes}from'./model-node-snapshot.mjs';
export function soilTriangleSnapshot(root){
 const object=root.getObjectByName('Decor__wood_honey');if(!object)throw Error('Missing source soil carrier');
 root.updateMatrixWorld(true);const triangles=[],point=new Vector3();
 object.traverse(mesh=>{if(!mesh.isMesh)return;const p=mesh.geometry.attributes.position,ix=mesh.geometry.index;for(let k=0;k<(ix?.count||p.count);k+=3){const vertices=[];for(let v=0;v<3;v++){point.fromBufferAttribute(p,ix?ix.getX(k+v):k+v).applyMatrix4(mesh.matrixWorld);vertices.push(point.toArray().map(x=>Math.round(x*1e6)/1e6).join(','));}triangles.push(vertices.sort().join(';'));}});
 triangles.sort();return{node:'Decor__wood_honey',coordinatePrecisionMetres:1e-6,triangleCount:triangles.length,triangleMultisetSha256:hashBytes(triangles.join('\n'))};
}
