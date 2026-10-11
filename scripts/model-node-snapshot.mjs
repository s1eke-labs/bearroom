/** Deterministic decoded node geometry snapshots; no rendering or texture mutation. */
import {createHash} from 'node:crypto';
export const hashBytes=x=>createHash('sha256').update(x).digest('hex');
export const stable=x=>x&&typeof x==='object'?(Array.isArray(x)?x.map(stable):Object.fromEntries(Object.keys(x).filter(k=>x[k]!==undefined).sort().map(k=>[k,stable(x[k])]))):x;
export function snapshotNode(n){
 const p={name:n.name,type:n.type,parent:n.parent?.name,matrixWorld:n.matrixWorld.toArray(),userData:structuredClone(n.userData)};
 if(n.isMesh){
  p.geometry={};for(const [key,a]of Object.entries(n.geometry.attributes))p.geometry[key]=hashBytes(Buffer.from(a.array.buffer,a.array.byteOffset,a.array.byteLength));
  if(n.geometry.index){const a=n.geometry.index.array;p.geometry.index=hashBytes(Buffer.from(a.buffer,a.byteOffset,a.byteLength));}
  p.materials=(Array.isArray(n.material)?n.material:[n.material]).map(m=>m.name);
 }
 return p;
}
export function snapshotScene(root){root.updateMatrixWorld(true);const nodes=[];root.traverse(n=>nodes.push(snapshotNode(n)));return nodes.sort((a,b)=>a.name.localeCompare(b.name));}
