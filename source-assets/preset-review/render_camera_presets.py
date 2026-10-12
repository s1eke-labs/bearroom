"""Read-only CPU Cycles review of curated camera presets in the editable source.
Never saves a blend. PNGs and JSON metadata go only to the requested review directory.
This is an offline framing/geometry check, not WebGL, runtime GI, shadow or performance QA.
Usage: blender -b -t 6 --python-exit-code 1 --python render_camera_presets.py -- SOURCE.blend CAMERAS.json OUT [frame names...]
"""
import bpy,bmesh,sys,json,hashlib,math,re
from pathlib import Path
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:]
src=Path(args[0]).resolve(); manifest=Path(args[1]).resolve();out=Path(args[2]).resolve()
repo=Path(__file__).resolve().parents[2]
if out == repo or repo in out.parents:raise ValueError('Generated review artifacts must stay outside the repository')
out.mkdir(parents=True,exist_ok=True)
selected=set(args[3:]);data=json.loads(manifest.read_text());known={x['name']for x in data['frames']}
if selected-known:raise ValueError('Unknown review frame(s): '+', '.join(sorted(selected-known)))
frames=[x for x in data['frames'] if not selected or x['name'] in selected]
if not frames:raise ValueError('No camera frames were supplied')
if any(x['direction'][0]<=0 or x['direction'][1]<=0 or x['direction'][2]<=0 for x in frames):raise ValueError('This source review supports only the open southeast/downward cutaway')
source_hash=hashlib.sha256(src.read_bytes()).hexdigest()
frozen=data.get('frozenFileSha256',{})
def verify_frozen_assets():
 for relative,expected in frozen.items():
  file=(repo/relative).resolve()
  if repo not in file.parents:raise ValueError('Frozen asset paths must be repository-relative')
  actual=hashlib.sha256(file.read_bytes()).hexdigest()
  if actual!=expected:raise AssertionError('Frozen asset changed: '+relative)
verify_frozen_assets()
def bvec(values):return Vector((values[0],-values[2],values[1]))
for view in sorted(set(x['view']for x in frames)):
 bpy.ops.wm.open_mainfile(filepath=str(src));s=bpy.context.scene
 for o in list(bpy.data.objects):
  if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
 visible=[];hidden=[];clipped=[]
 for o in s.objects:
  if o.type not in ['MESH','CURVE']:continue
  bb=[o.matrix_world@Vector(v)for v in o.bound_box];low=min(v.z for v in bb);high=max(v.z for v in bb)
  # All reviewed directions remain +X/+Z in Three: east and south are the front cutaway.
  hide=bool(re.search(r'^Exterior_city|^street_|wall_east|wall_south',o.name))
  hide|=view=='lower' and low>=2.78
  hide|=view=='upper' and high<2.78
  o.hide_render=hide
  if hide:hidden.append(o.name);continue
  visible.append(o.name)
  if view!='overview' and low<2.78<high:
   if o.type=='CURVE' or len(o.modifiers):
    bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')
   o.data=o.data.copy();bm=bmesh.new();bm.from_mesh(o.data)
   bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=1e-7,plane_co=o.matrix_world.inverted()@Vector((0,0,2.78)),plane_no=o.matrix_world.to_3x3().transposed()@Vector((0,0,1)),clear_outer=view=='lower',clear_inner=view=='upper')
   bm.to_mesh(o.data);bm.free();clipped.append(o.name)
 world=bpy.data.worlds.new('Offline geometry review world');world.use_nodes=True
 world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.34,.38,.43,1);world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.6;s.world=world
 target=Vector((0,0,2.2))
 for name,location,power,size in [('review key',(6,-8,12),2400,7),('review fill',(-4,-4,8),1800,6),('review rim',(0,8,10),1200,5)]:
  light=bpy.data.lights.new(name,'AREA');light.energy=power;light.shape='DISK';light.size=size;o=bpy.data.objects.new(name,light);s.collection.objects.link(o);o.location=location;o.rotation_euler=(target-o.location).to_track_quat('-Z','Y').to_euler()
 bpy.ops.object.camera_add();camera=bpy.context.object;camera.data.type='ORTHO';camera.data.sensor_fit='HORIZONTAL';camera.data.clip_start=.1;camera.data.clip_end=100;s.camera=camera
 s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=48;s.cycles.use_denoising=False;s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.08;s.cycles.max_bounces=4;s.cycles.diffuse_bounces=3
 s.render.threads_mode='FIXED';s.render.threads=6;s.view_settings.view_transform='AgX';s.view_settings.exposure=.5;s.render.image_settings.file_format='PNG';s.render.resolution_percentage=100
 for frame in [x for x in frames if x['view']==view]:
  p=frame['projection'];camera.location=bvec(frame['position']);target=bvec(frame['target']);camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
  camera.data.ortho_scale=(p['right']-p['left'])/p['zoom'];camera.data.shift_x=(p['right']+p['left'])/(2*(p['right']-p['left']));camera.data.shift_y=(p['top']+p['bottom'])/(2*(p['right']-p['left']))
  s.render.resolution_x=frame['width'];s.render.resolution_y=frame['height'];s.render.filepath=str(out/(frame['name']+'.png'));bpy.ops.render.render(write_still=True)
  record={'frame':frame,'source':str(src),'sourceSha256':source_hash,'cameraManifest':str(manifest),'cameraManifestSha256':hashlib.sha256(manifest.read_bytes()).hexdigest(),'engine':'CPU Cycles','samples':s.cycles.samples,'sourceHiddenObjects':hidden,'sourceClippedObjects':clipped,'coordinateMap':data['coordinateMap'],'limits':['Read-only Blender source preview. No blend is saved.','Actual runtime cutaway rules with evaluated source geometry; source furniture is unbatched.','Neutral review lighting and Cycles transport; not production WebGL/GI, live shadows, browser interactions or frame-rate evidence.']}
  (out/(frame['name']+'.json')).write_text(json.dumps(record,indent=2));print('REVIEW_FRAME_COMPLETE',frame['name'],flush=True)
assert hashlib.sha256(src.read_bytes()).hexdigest()==source_hash,'Source file changed during review'
verify_frozen_assets()
print('READ_ONLY_SOURCE_SHA256',source_hash,flush=True)
