import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { loadSceneForCPU } from './helpers.mjs';
import { WalkNavigation, WALK_CONFIG } from '../src/walk-navigation.js';

let scene, nav;
before(async () => { scene = await loadSceneForCPU(); nav = new WalkNavigation(scene); });
const walk = (x, z, frames = 180) => { for (let i=0;i<frames;i++) nav.move(1/60,{x,z}); };
const close = (a,b,tolerance=1e-5) => assert.ok(Math.abs(a-b)<tolerance, `${a} ≉ ${b}`);

test('grounded spawn/eye use full physical geometry and bounded compact acceleration', () => {
  nav.reset('lower');
  close(nav.position.x,.45); close(nav.position.z,3.35);
  const eye=nav.eyePosition(); close(eye.y-nav.position.y,1.60);
  assert.ok(nav.stats.triangleCount>650_000);
  assert.ok(nav.stats.collisionBytes<30*1024*1024, `${nav.stats.collisionBytes} bytes`);
  assert.ok(nav.bvh.nodeBounds instanceof Float32Array);
  assert.ok(nav.bvh.nodeLinks instanceof Int32Array);
  assert.equal(nav.capsuleBlocked(nav.position.x,nav.position.y,nav.position.z),false);
  nav.reset('upper'); close(nav.position.y,3.13);
  assert.ok(nav.floorHeight(-3.45,-1.82,3.13)>3.1);
});

test('all actual stair treads can be climbed and descended without a ramp, teleport or fall', () => {
  assert.equal(nav.setPosition({x:-4.4,y:.014,z:3.55}),true);
  let lastY=nav.position.y,maxQueries=0;const levels=new Set();
  for(let i=0;i<214;i++){
    nav.move(1/60,{z:-1});
    assert.ok(nav.position.y-lastY<=WALK_CONFIG.stepHeight+1e-6);
    assert.ok(lastY-nav.position.y<=WALK_CONFIG.maxDrop+1e-6);
    assert.equal(nav.capsuleBlocked(nav.position.x,nav.position.y,nav.position.z),false);
    levels.add(nav.position.y.toFixed(3));lastY=nav.position.y;
    maxQueries=Math.max(maxQueries,nav.stats.triangleTests);
  }
  close(nav.position.y,3.13);assert.ok(nav.position.z<-1.79);assert.ok(levels.size>=19);
  assert.ok(maxQueries<10_000, `${maxQueries} candidates compared with ~695k scene triangles`);
  for(let i=0;i<214;i++){
    nav.move(1/60,{z:1});
    assert.ok(Math.abs(nav.position.y-lastY)<=WALK_CONFIG.maxDrop+1e-6);lastY=nav.position.y;
  }
  close(nav.position.y,.014);close(nav.position.z,3.55);
});

test('hidden exterior walls and open entry perimeter remain impermeable, including delayed frames', () => {
  const wall=scene.getObjectByName('cutaway_wall_east');const visible=wall.visible;wall.visible=false;
  assert.equal(nav.setPosition({x:4.5,y:.014,z:1.8}),true);
  for(let i=0;i<30;i++)nav.move(99,{x:1,z:1});
  assert.ok(nav.position.x<=5-WALK_CONFIG.radius);
  assert.ok(nav.position.z<=4-WALK_CONFIG.radius);
  wall.visible=visible;
  nav.reset('lower');walk(0,1,300);assert.ok(nav.position.z<3.78);
  assert.equal(nav.setPosition({x:100,y:.014,z:0}),false);
});

test('thin bathroom door is solid, opens on its real hinge, and refuses to close through a person', () => {
  nav.restoreDoor();assert.equal(nav.setPosition({x:3.78,y:.014,z:-1.2}),true);
  walk(0,-1,120);assert.ok(nav.position.z>-1.74);
  assert.equal(nav.doorAction().label,'打开浴室门');
  assert.deepEqual(nav.toggleDoor(),{changed:true,blocked:false,open:true});
  walk(0,-1,38);assert.ok(nav.position.z<-2.5);close(nav.position.y,.044);
  assert.equal(nav.doorAction().label,'关闭浴室门');
  assert.deepEqual(nav.toggleDoor(),{changed:false,blocked:true,open:true});
  walk(0,1,70);assert.ok(nav.position.z>-1.2);
  assert.deepEqual(nav.toggleDoor(),{changed:true,blocked:false,open:false});
  close(scene.getObjectByName('bathroom_door_hinge').rotation.y,0);
  assert.deepEqual(nav.toggleDoor(),{changed:true,blocked:false,open:true});
  nav.restoreDoor();close(scene.getObjectByName('bathroom_door_hinge').rotation.y,0);
  nav.reset('upper');assert.equal(nav.doorAction(),null);
});

test('actual curved piano hull and overhead stairs stop the capsule instead of using room-size boxes', () => {
  assert.equal(nav.setPosition({x:.5,y:.014,z:1.5}),true);
  walk(1,0,160);assert.ok(nav.position.x>0.9&&nav.position.x<1.1);
  assert.equal(nav.capsuleBlocked(nav.position.x,nav.position.y,nav.position.z),false);
  assert.equal(nav.setPosition({x:-4.4,y:.014,z:1.2}),false,'a human cannot stand beneath the low stair treads');
  assert.equal(nav.setPosition({x:-4.4,y:.014,z:-1.2}),true,'high stairs leave real headroom below');
  assert.equal(nav.setPosition({x:-3.90,y:2.4,z:-.3}),false,'loft/stair side structure is solid');
});

test('loft edge, diagonal corners, and frame/input clamping cannot cause free-flying or tunneling', () => {
  nav.reset('upper');walk(1,1,600);
  assert.ok(nav.position.y>3.1);
  assert.ok(nav.position.z<.8);
  assert.equal(nav.capsuleBlocked(nav.position.x,nav.position.y,nav.position.z),false);
  nav.reset('lower');const initial=nav.position.clone();nav.move(100,{x:0,z:-1});
  assert.ok(nav.position.distanceTo(initial)<=WALK_CONFIG.speed*WALK_CONFIG.maxDelta+1e-6);
  const p=nav.position.clone();for(const dt of [NaN,Infinity,-1,0])nav.move(dt,{x:1,z:1});
  assert.deepEqual(nav.position.toArray(),p.toArray());
  nav.move(.1,{x:Infinity,z:1});assert.deepEqual(nav.position.toArray(),p.toArray());
  assert.equal(nav.setPosition({x:NaN,y:0,z:0}),false);
});

test('movement is deterministic and collision build is never repeated per frame', () => {
  const bvh=nav.bvh, bytes=nav.stats.collisionBytes;
  const run=()=>{nav.reset('lower');for(let i=0;i<300;i++)nav.move(1/60,{x:Math.sin(i*.07),z:-1});return nav.position.toArray();};
  assert.deepEqual(run(),run());assert.equal(nav.bvh,bvh);assert.equal(nav.stats.collisionBytes,bytes);
  assert.ok(nav.stats.substeps<=Math.ceil(WALK_CONFIG.speed*WALK_CONFIG.maxDelta/WALK_CONFIG.maxSubstep));
});
