/** Grounded, world-space indoor walking against the frozen authored model.
 * The draw/cutaway state is deliberately ignored. A static BVH is built once;
 * neither movement nor floor queries rescan the scene's ~715k triangles.
 */
import { L as Vector3 } from '../vendor/runtime-v11.js';

export const WALK_CONFIG = Object.freeze({
  radius: 0.22, height: 1.75, eyeHeight: 1.60, speed: 1.5,
  stepHeight: 0.22, maxDrop: 0.23, maxDelta: 0.1, maxSubstep: 0.04,
  skin: 0.004,
});
const EPS = 1e-7;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const FLOOR_MESH = /^(Architecture__wood_|cutaway_upper_slab|cutaway_upper_detail__wood_oak(?:_board_\d+)?$|cutaway_upper_rug|Soft_decor__fabric_rug_loop_pile|bathroom_tile_floor)/;
const SPIN_ROOT = /^(anim_fan_blades|anim_hood_fan|anim_pc_fan_0[123])$/;
const MOTION_PADDING = Object.freeze({
  anim_chair_swivel: 0.09, anim_rocker: 0.05, anim_fan_head: 0.12,
  anim_fan_blades: 0.12, anim_clock_pendulum: 0.11, anim_purifier_louver: 0.035,
  anim_sofa_edge: 0.006, anim_dining_edge: 0.006, anim_bed_edge: 0.007,
});
function paddingFor(mesh) {
  let padding = 0;
  for (let o = mesh; o; o = o.parent) padding = Math.max(padding, MOTION_PADDING[o.name] || 0);
  return padding;
}
function excluded(mesh) {
  for (let o = mesh; o; o = o.parent) if (/^Exterior_city|^street_/.test(o.name)) return true;
  // Micrometre nap/fibres cannot affect a 22 cm walking capsule. Their solid
  // sewn bodies remain collidable. All furniture, glass and hidden walls stay.
  return mesh.userData.physicalPlush === true || /minky_surface_nap/.test(mesh.name);
}

/** Squared distance from a point to a triangle (all Voronoi regions). */
function pointTriangle(px, py, pz, t, k) {
  const ax=t[k], ay=t[k+1], az=t[k+2], bx=t[k+3], by=t[k+4], bz=t[k+5], cx=t[k+6], cy=t[k+7], cz=t[k+8];
  const abx=bx-ax, aby=by-ay, abz=bz-az, acx=cx-ax, acy=cy-ay, acz=cz-az;
  const apx=px-ax, apy=py-ay, apz=pz-az, d1=abx*apx+aby*apy+abz*apz, d2=acx*apx+acy*apy+acz*apz;
  let qx, qy, qz;
  if (d1<=0 && d2<=0) { qx=ax; qy=ay; qz=az; }
  else {
    const bpx=px-bx, bpy=py-by, bpz=pz-bz, d3=abx*bpx+aby*bpy+abz*bpz, d4=acx*bpx+acy*bpy+acz*bpz;
    if (d3>=0 && d4<=d3) { qx=bx; qy=by; qz=bz; }
    else {
      const vc=d1*d4-d3*d2;
      if (vc<=0 && d1>=0 && d3<=0) { const v=d1/(d1-d3); qx=ax+v*abx; qy=ay+v*aby; qz=az+v*abz; }
      else {
        const cpx=px-cx, cpy=py-cy, cpz=pz-cz, d5=abx*cpx+aby*cpy+abz*cpz, d6=acx*cpx+acy*cpy+acz*cpz;
        if (d6>=0 && d5<=d6) { qx=cx; qy=cy; qz=cz; }
        else {
          const vb=d5*d2-d1*d6;
          if (vb<=0 && d2>=0 && d6<=0) { const w=d2/(d2-d6); qx=ax+w*acx; qy=ay+w*acy; qz=az+w*acz; }
          else {
            const va=d3*d6-d5*d4;
            if (va<=0 && d4-d3>=0 && d5-d6>=0) { const w=(d4-d3)/((d4-d3)+(d5-d6)); qx=bx+w*(cx-bx); qy=by+w*(cy-by); qz=bz+w*(cz-bz); }
            else { const denom=1/(va+vb+vc), v=vb*denom, w=vc*denom; qx=ax+v*abx+w*acx; qy=ay+v*aby+w*acy; qz=az+v*abz+w*acz; }
          }
        }
      }
    }
  }
  return (px-qx)**2+(py-qy)**2+(pz-qz)**2;
}
/** Upright axis segment to a triangle edge; endpoints and clamped interior. */
function axisEdge(x, low, high, z, ax, ay, az, bx, by, bz) {
  const dx=bx-ax, dy=by-ay, dz=bz-az;
  let best=Infinity;
  // On each vertical interval the distance is a quadratic in the edge's t.
  const knots=[0,1];
  if (Math.abs(dy)>EPS) { const a=(low-ay)/dy, b=(high-ay)/dy; if(a>0&&a<1)knots.push(a);if(b>0&&b<1)knots.push(b); }
  knots.sort((a,b)=>a-b);
  for(let i=1;i<knots.length;i++){
    const a=knots[i-1],b=knots[i],mid=ay+(a+b)*.5*dy;
    let denom=dx*dx+dz*dz, numerator=(ax-x)*dx+(az-z)*dz;
    if(mid<low){denom+=dy*dy;numerator+=(ay-low)*dy;}
    else if(mid>high){denom+=dy*dy;numerator+=(ay-high)*dy;}
    const u=clamp(denom>EPS?-numerator/denom:a,a,b), ey=ay+u*dy;
    best=Math.min(best,(ax+u*dx-x)**2+(az+u*dz-z)**2+(ey-clamp(ey,low,high))**2);
  }
  return best;
}
function heightOnTriangle(x,z,t,k,tolerance=1e-6) {
  const ax=t[k],az=t[k+2],bx=t[k+3],bz=t[k+5],cx=t[k+6],cz=t[k+8];
  const d=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);
  if(Math.abs(d)<EPS)return null;
  const a=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/d, b=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/d;
  if(a < -tolerance || b < -tolerance || a+b>1+tolerance)return null;
  return a*t[k+1]+b*t[k+4]+(1-a-b)*t[k+7];
}
function capsuleTriangle(x,low,high,z,t,k) {
  const y=heightOnTriangle(x,z,t,k);
  if(y!==null&&y>=low&&y<=high)return 0;
  let d=Math.min(pointTriangle(x,low,z,t,k),pointTriangle(x,high,z,t,k));
  for(let e=0;e<3;e++){const a=k+e*3,b=k+((e+1)%3)*3;d=Math.min(d,axisEdge(x,low,high,z,t[a],t[a+1],t[a+2],t[b],t[b+1],t[b+2]));}
  return d;
}

class StaticTriangleBVH {
  constructor(scene, includeMesh = () => true) {
    scene.updateMatrixWorld(true);
    const meshes=[];let count=0,vertexCount=0;
    scene.traverse(o=>{if(o.isMesh&&o.geometry?.attributes.position&&!excluded(o)&&includeMesh(o)){meshes.push(o);count+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;vertexCount+=o.geometry.attributes.position.count;}});
    // Shared indexed world vertices, compact BVH links, and millimetre motion
    // padding avoid hundreds of thousands of JS/Three.js object allocations.
    this.vertices=new Float32Array(vertexCount*3);this.triangles=new Uint32Array(count*3);
    this.padding=new Uint8Array(count);this.walkable=new Uint8Array(count);
    this.order=new Uint32Array(count);
    const bounds=new Float32Array(count*6),points=[new Vector3(),new Vector3(),new Vector3()];
    let id=0,vertexOffset=0;this.floorBounds={minX:Infinity,maxX:-Infinity,minZ:Infinity,maxZ:-Infinity};
    for(const mesh of meshes){
      const p=mesh.geometry.attributes.position,index=mesh.geometry.index,pad=paddingFor(mesh),floor=FLOOR_MESH.test(mesh.name);
      for(let v=0;v<p.count;v++)points[0].fromBufferAttribute(p,v).applyMatrix4(mesh.matrixWorld).toArray(this.vertices,(vertexOffset+v)*3);
      for(let j=0;j<(index?.count??p.count);j+=3,id++){
        this.order[id]=id;this.padding[id]=Math.ceil(pad*1000);
        for(let v=0;v<3;v++){const vi=vertexOffset+(index?index.getX(j+v):j+v);this.triangles[id*3+v]=vi;points[v].fromArray(this.vertices,vi*3);}
        const [a,b,c]=points,abx=b.x-a.x,aby=b.y-a.y,abz=b.z-a.z,acx=c.x-a.x,acy=c.y-a.y,acz=c.z-a.z;
        const nx=aby*acz-abz*acy,ny=abz*acx-abx*acz,nz=abx*acy-aby*acx;
        this.walkable[id]=floor&&ny>Math.hypot(nx,ny,nz)*.70?1:0;
        const k=id*6;
        bounds[k]=Math.min(a.x,b.x,c.x)-pad;bounds[k+1]=Math.min(a.y,b.y,c.y)-pad;bounds[k+2]=Math.min(a.z,b.z,c.z)-pad;
        bounds[k+3]=Math.max(a.x,b.x,c.x)+pad;bounds[k+4]=Math.max(a.y,b.y,c.y)+pad;bounds[k+5]=Math.max(a.z,b.z,c.z)+pad;
        if(/^Architecture__wood_oak_board_/.test(mesh.name)){
          this.floorBounds.minX=Math.min(this.floorBounds.minX,bounds[k]);this.floorBounds.maxX=Math.max(this.floorBounds.maxX,bounds[k+3]);
          this.floorBounds.minZ=Math.min(this.floorBounds.minZ,bounds[k+2]);this.floorBounds.maxZ=Math.max(this.floorBounds.maxZ,bounds[k+5]);
        }
      }
      vertexOffset+=p.count;
    }
    let capacity=Math.max(64,Math.ceil(count/4));
    this.nodeBounds=new Float32Array(capacity*6);this.nodeLinks=new Int32Array(capacity*4);this.nodeFloor=new Uint8Array(capacity);this.nodeCount=0;
    const allocateNode=()=>{
      if(this.nodeCount===capacity){capacity*=2;for(const [key,width,Type]of [['nodeBounds',6,Float32Array],['nodeLinks',4,Int32Array],['nodeFloor',1,Uint8Array]]){const next=new Type(capacity*width);next.set(this[key]);this[key]=next;}}
      return this.nodeCount++;
    };
    const centroid=(id,axis)=>bounds[id*6+axis]+bounds[id*6+axis+3];
    const partition=(start,end,axis,pivot)=>{let l=start,r=end-1;while(l<=r){while(l<=r&&centroid(this.order[l],axis)<pivot)l++;while(l<=r&&centroid(this.order[r],axis)>=pivot)r--;if(l<r){const t=this.order[l];this.order[l++]=this.order[r];this.order[r--]=t;}}return l;};
    const build=(start,end)=>{
      const index=allocateNode();let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity,floor=false;
      for(let j=start;j<end;j++){const id=this.order[j],k=id*6;minX=Math.min(minX,bounds[k]);minY=Math.min(minY,bounds[k+1]);minZ=Math.min(minZ,bounds[k+2]);maxX=Math.max(maxX,bounds[k+3]);maxY=Math.max(maxY,bounds[k+4]);maxZ=Math.max(maxZ,bounds[k+5]);floor ||= !!this.walkable[id];}
      this.nodeBounds.set([minX,minY,minZ,maxX,maxY,maxZ],index*6);this.nodeFloor[index]=floor?1:0;
      if(end-start<=12){this.nodeLinks.set([-1,-1,start,end],index*4);return index;}
      const ext=[maxX-minX,maxY-minY,maxZ-minZ],axis=ext.indexOf(Math.max(...ext));
      const min=[minX,minY,minZ][axis],max=[maxX,maxY,maxZ][axis];let mid=partition(start,end,axis,min+max);
      // Highly overlapping detail may not split geometrically. A balanced
      // fallback makes construction and every traversal strictly finite.
      if(mid===start||mid===end)mid=(start+end)>>1;
      const left=build(start,mid),right=build(mid,end);this.nodeLinks.set([left,right,start,end],index*4);return index;
    };
    build(0,count);this.count=count;
    this.nodeBounds=this.nodeBounds.slice(0,this.nodeCount*6);this.nodeLinks=this.nodeLinks.slice(0,this.nodeCount*4);this.nodeFloor=this.nodeFloor.slice(0,this.nodeCount);
    this.byteLength=['vertices','triangles','padding','walkable','order','nodeBounds','nodeLinks','nodeFloor'].reduce((sum,k)=>sum+this[k].byteLength,0);
  }
  readTriangle(id,target) {
    for(let i=0;i<3;i++){const v=this.triangles[id*3+i]*3;target[i*3]=this.vertices[v];target[i*3+1]=this.vertices[v+1];target[i*3+2]=this.vertices[v+2];}
    return target;
  }
  query(minX,minY,minZ,maxX,maxY,maxZ,floorOnly,callback,stats) {
    const stack=[0],bounds=this.nodeBounds,links=this.nodeLinks;
    while(stack.length){const node=stack.pop(),k=node*6,l=node*4;stats.nodesVisited++;
      if((floorOnly&&!this.nodeFloor[node])||bounds[k]>maxX||bounds[k+3]<minX||bounds[k+1]>maxY||bounds[k+4]<minY||bounds[k+2]>maxZ||bounds[k+5]<minZ)continue;
      if(links[l]>=0){stack.push(links[l],links[l+1]);continue;}
      for(let j=links[l+2];j<links[l+3];j++){const id=this.order[j];if(floorOnly&&!this.walkable[id])continue;stats.triangleTests++;if(callback(id)===false)return false;}
    }
    return true;
  }
}

/** Position is the feet, in scene world coordinates. move() never changes yaw. */
export class WalkNavigation {
  constructor(scene,options={}) {
    this.config={...WALK_CONFIG,...options};this.position=new Vector3();
    const start=globalThis.performance?.now?.()??Date.now();
    this.doorHinge=scene.getObjectByName('bathroom_door_hinge');
    this.doorRest=this.doorHinge?.quaternion.clone();this.doorOpen=false;
    this.doorCentre=scene.getObjectByName('bathroom_oak_door')?.getWorldPosition(new Vector3());
    const isDoor=o=>{for(;o;o=o.parent)if(o===this.doorHinge)return true;return false;};
    this.bvh=new StaticTriangleBVH(scene,o=>!isDoor(o));
    this.doorBVH=this.doorHinge?new StaticTriangleBVH(this.doorHinge):null;
    this.stats={triangleCount:this.bvh.count,nodeCount:this.bvh.nodeCount,collisionBytes:this.bvh.byteLength+(this.doorBVH?.byteLength||0),buildMs:(globalThis.performance?.now?.()??Date.now())-start,nodesVisited:0,triangleTests:0,substeps:0,blocked:false};
    this.bounds={...this.bvh.floorBounds};this._triangle=new Float32Array(9);
    this.spinEnvelopes=[];
    // A rotor's whole swept volume stays solid even between its individual
    // blades. Tiny motor rotors use a conservative sphere; parent fan-head
    // yaw shares the blade centre, so the bound covers both rotations.
    scene.traverse(root=>{
      if(!SPIN_ROOT.test(root.name))return;
      const centre=root.getWorldPosition(new Vector3()),point=new Vector3();let radius=0;
      root.traverse(mesh=>{if(!mesh.isMesh)return;const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++)radius=Math.max(radius,point.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld).distanceTo(centre));});
      this.spinEnvelopes.push({centre,radius:radius+.005});
    });
    // Authored, open circulation points. reset() validates against the actual
    // triangles and searches nearby if a later asset occupies a seed point.
    this.spawnPoints={lower:{x:.45,y:.062,z:3.35,yaw:0},upper:{x:-3.45,y:3.13,z:-1.82,yaw:-Math.PI/2}};
    this.reset('lower');
  }
  eyePosition(target=new Vector3()) {target.copy(this.position);target.y+=this.config.eyeHeight;return target;}
  floorHeight(x,z,referenceY=this.position.y,drop=this.config.maxDrop,step=this.config.stepHeight) {
    const ceiling=referenceY+step+EPS,bottom=referenceY-drop-EPS,t=this._triangle;let highest=null;
    this.bvh.query(x,bottom,z,x,ceiling,z,true,id=>{const y=heightOnTriangle(x,z,this.bvh.readTriangle(id,t),0);if(y!==null&&y<=ceiling&&y>=bottom&&(highest===null||y>highest))highest=y;},this.stats);
    return highest;
  }
  _floorAt(x,z,y,drop,step) {
    let h=this.floorHeight(x,z,y,drop,step);
    if(h!==null)return h;
    // Authored 2–3 mm board/tread joints aren't holes to the storey below.
    for(const [dx,dz]of [[.004,0],[-.004,0],[0,.004],[0,-.004]]){const f=this.floorHeight(x+dx,z+dz,y,drop,step);if(f!==null&&(h===null||f>h))h=f;}
    return h;
  }
  _inside(x,z) {const r=this.config.radius+this.config.skin,b=this.bounds;return x>=b.minX+r&&x<=b.maxX-r&&z>=b.minZ+r&&z<=b.maxZ-r;}
  _blockedAgainst(bvh,x,y,z) {
    const {radius:r,height,skin}=this.config,t=this._triangle;
    // Feet are kept one skin above their support. Static motion envelopes
    // cover the maximum authored chair/rocker/fan/cloth excursions.
    const low=y+r+skin,high=y+height-r;
    return !bvh.query(x-r,y,z-r,x+r,y+height,z+r,false,id=>{
      const pad=bvh.padding[id]*.001,rr=r+pad;
      if(capsuleTriangle(x,low,high,z,bvh.readTriangle(id,t),0)<(rr-skin*.25)**2)return false;
    },this.stats);
  }
  capsuleBlocked(x,y,z) {
    const {radius,height}=this.config;
    for(const envelope of this.spinEnvelopes){const c=envelope.centre,nearestY=clamp(c.y,y+radius,y+height-radius);if((c.x-x)**2+(c.z-z)**2+(c.y-nearestY)**2<(radius+envelope.radius)**2)return true;}
    return this._blockedAgainst(this.bvh,x,y,z)||(this.doorBVH&&this._blockedAgainst(this.doorBVH,x,y,z));
  }
  doorAction() {
    if(!this.doorHinge||this.position.y>.30||Math.hypot(this.position.x-this.doorCentre.x,this.position.z-this.doorCentre.z)>1.50)return null;
    return {label:this.doorOpen?'关闭浴室门':'打开浴室门',canInteract:true,open:this.doorOpen};
  }
  _setDoorAngle(angle) {
    this.doorHinge.quaternion.copy(this.doorRest);
    this.doorHinge.rotateY(angle);this.doorHinge.updateMatrix();this.doorHinge.updateMatrixWorld(true);
    this.doorBVH=new StaticTriangleBVH(this.doorHinge);
  }
  toggleDoor({checkPlayer=true}={}) {
    if(!this.doorHinge||(checkPlayer&&!this.doorAction()))return {changed:false,blocked:false,open:this.doorOpen};
    const from=this.doorOpen?-Math.PI/2:0,to=this.doorOpen?0:-Math.PI/2, p=this.position;
    // A fixed-view scene click has no active player; retain the same hinge and collider.
    if(!checkPlayer){this._setDoorAngle(to);this.doorOpen=!this.doorOpen;return {changed:true,blocked:false,open:this.doorOpen};}
    // A discrete swing sweep has <7.6 cm tip motion per sample, much smaller
    // than the avatar diameter. No instantaneous door can pass through them.
    for(let i=1;i<=18;i++){
      this._setDoorAngle(from+(to-from)*i/18);
      if(this._blockedAgainst(this.doorBVH,p.x,p.y,p.z)){
        this._setDoorAngle(from);return {changed:false,blocked:true,open:this.doorOpen};
      }
    }
    this.doorOpen=!this.doorOpen;return {changed:true,blocked:false,open:this.doorOpen};
  }
  restoreDoor() {
    if(this.doorHinge){this._setDoorAngle(0);this.doorOpen=false;}
  }
  _candidate(x,z,oldY) {
    if(!this._inside(x,z))return null;
    const {radius,stepHeight,maxDrop}=this.config;
    const centre=this._floorAt(x,z,oldY,maxDrop,stepHeight);
    if(centre===null)return null;
    let height=centre;
    const ring=radius*.99;
    // The leading edge of the foot lifts onto a real tread before the capsule
    // meets its riser. The whole footprint needs nearby support, preventing
    // stepping off the mezzanine; two adjacent stair risers are allowed under
    // the footprint, but the centre can only change by one normal step.
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4,h=this._floorAt(x+Math.cos(a)*ring,z+Math.sin(a)*ring,oldY,maxDrop+stepHeight,stepHeight);
      if(h===null)return null;
      height=Math.max(height,h);
    }
    if(height-oldY>stepHeight+EPS||oldY-height>maxDrop+EPS)return null;
    if(this.capsuleBlocked(x,height,z))return null;
    return height;
  }
  setPosition(point) {
    if(!point||![point.x,point.y,point.z].every(Number.isFinite))return false;
    const h=this._candidate(point.x,point.z,point.y);
    if(h===null)return false;
    this.position.set(point.x,h,point.z);return true;
  }
  reset(which='lower') {
    const seed=this.spawnPoints[which]||this.spawnPoints.lower;
    if(!this.setPosition(seed)){
      let found=false;
      for(let r=.1;r<=.8&&!found;r+=.1)for(let i=0;i<16&&!found;i++){const a=i*Math.PI/8;found=this.setPosition({x:seed.x+Math.cos(a)*r,y:seed.y,z:seed.z+Math.sin(a)*r});}
      if(!found)throw new Error(`No safe indoor walking spawn for ${which}`);
    }
    this.yaw=seed.yaw;return this.position;
  }
  move(dt,input={}) {
    this.stats.nodesVisited=0;this.stats.triangleTests=0;this.stats.substeps=0;this.stats.blocked=false;
    if(!Number.isFinite(dt)||dt<=0)return this.position;
    let x=Number(input.x)||0,z=Number(input.z)||0;
    if(!Number.isFinite(x)||!Number.isFinite(z))return this.position;
    const len=Math.hypot(x,z);if(len<EPS)return this.position;
    if(len>1){x/=len;z/=len;}
    const distance=this.config.speed*Math.min(dt,this.config.maxDelta),steps=Math.ceil(Math.hypot(x,z)*distance/this.config.maxSubstep);
    x*=distance/steps;z*=distance/steps;
    for(let i=0;i<steps;i++){
      this.stats.substeps++;
      let h=this._candidate(this.position.x+x,this.position.z+z,this.position.y);
      if(h!==null){this.position.x+=x;this.position.y=h;this.position.z+=z;continue;}
      this.stats.blocked=true;
      // Axis sliding is deterministic and each leg receives the same full
      // geometry/support check. It cannot cut a diagonal corner.
      if(Math.abs(x)>EPS){h=this._candidate(this.position.x+x,this.position.z,this.position.y);if(h!==null){this.position.x+=x;this.position.y=h;}}
      if(Math.abs(z)>EPS){h=this._candidate(this.position.x,this.position.z+z,this.position.y);if(h!==null){this.position.z+=z;this.position.y=h;}}
    }
    return this.position;
  }
}
export const createWalkNavigation=(scene,options)=>new WalkNavigation(scene,options);
