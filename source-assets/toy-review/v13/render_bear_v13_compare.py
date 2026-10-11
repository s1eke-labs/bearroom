"""Identical-cameras offline source comparisons; no production source mutation."""
import bpy,sys,os
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:];source,out,view=args[:3]
bpy.ops.wm.open_mainfile(filepath=os.path.abspath(source))
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=384;s.cycles.use_denoising=False;s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.003;s.cycles.adaptive_min_samples=96;s.cycles.max_bounces=6;s.render.threads_mode='FIXED';s.render.threads=4
s.world=bpy.data.worlds.new('Matched neutral studio');s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.50,.50,.50,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.4
root=bpy.data.objects['Bear_reference_plush'];origin=root.matrix_world.translation.copy();scale=root.matrix_world.to_scale().x
fixed_visible=set([root,*root.children_recursive])
for name in ['F01_sofa','F02_coffee_table']:
 support=bpy.data.objects.get(name)
 if support:fixed_visible.update([support,*support.children_recursive])
for ob in bpy.data.objects:
 if ob.type=='LIGHT' or ob.name.startswith('plush_fibers_'):ob.hide_render=True
 if ob.name.startswith('cutaway_') or ob.name.startswith(('render_review_','Review_')):ob.hide_render=True
 if view!='fixed' and ob not in [root,*root.children_recursive] and ob.type in ['MESH','CURVE']:ob.hide_render=True
 if view=='fixed' and ob not in fixed_visible and ob.type in ['MESH','CURVE']:ob.hide_render=True

def area(name,pos,target,power,color,size):
 d=bpy.data.lights.new(name,'AREA');o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=origin+Vector(pos)*scale;o.rotation_euler=(origin+Vector(target)*scale-o.location).to_track_quat('-Z','Y').to_euler();d.energy=power*scale*scale;d.color=color;d.shape='DISK';d.size=size*scale
area('Toy_key',(-2,-3,3.6),(0,0,.4),210,(1,.97,.91),3)
area('Toy_rim',(1.6,1.7,2),(0,0,.5),160,(.87,.93,1),2.5)
area('Toy_fill',(2,-1,1),(0,0,.5),40,(1,.97,.92),3)
off={'front':(.0,-2.5,.51),'face':(.0,-2.5,.67),'fixed':(2,-2,2.475),'side':(2.5,0,.51)}[view]
target=origin+Vector((0,-.018,.47 if view not in ['face'] else .66))*scale
bpy.ops.object.camera_add(location=origin+Vector(off)*scale);cam=bpy.context.object;cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=(1.15 if view!='face' else .80)*scale;s.camera=cam
s.render.resolution_x=800;s.render.resolution_y=960
if view=='fixed':
 s.cycles.samples=256;s.cycles.adaptive_threshold=.005;s.cycles.adaptive_min_samples=64;s.render.resolution_x=900;s.render.resolution_y=900;cam.data.ortho_scale=.7325497737787717;target=Vector((-.8498464465,-1.8055961127,.8791130332));cam.location=target+Vector((1,-1,1)).normalized()*35;cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.shift_y=.0158333333
s.render.resolution_percentage=100;s.view_settings.view_transform='AgX';s.view_settings.exposure=0;s.render.image_settings.file_format='PNG';s.render.filepath=os.path.abspath(out)
bpy.ops.render.render(write_still=True)
