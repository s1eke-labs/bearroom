import bpy, math, json
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=64;s.cycles.max_bounces=6;s.cycles.diffuse_bounces=4;s.cycles.use_denoising=False;s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs['Strength'].default_value=0
s.render.bake.use_pass_color=False;s.render.bake.use_pass_direct=False;s.render.bake.use_pass_indirect=True;s.render.bake.margin=0
# Infinite-plane limit, white sun 2.7 and 50% diffuse ground: L_indirect=2.7*0.5/pi.
def mat(name,color):
 m=bpy.data.materials.new(name);m.use_nodes=True;n=m.node_tree.nodes;n.clear();bs=n.new('ShaderNodeBsdfDiffuse');bs.inputs['Color'].default_value=(*color,1);out=n.new('ShaderNodeOutputMaterial');m.node_tree.links.new(bs.outputs['BSDF'],out.inputs['Surface']);return m
bpy.ops.mesh.primitive_plane_add(size=2000);g=bpy.context.object;g.data.materials.append(mat('ground',(0.5,0.5,0.5)))
bpy.ops.object.light_add(type='SUN',location=(0,0,10));bpy.context.object.data.energy=2.7;bpy.context.object.data.angle=0
bpy.ops.mesh.primitive_plane_add(size=.01,location=(0,0,1),rotation=(math.pi,0,0));p=bpy.context.object;p.data.materials.append(mat('receiver',(1,1,1)));p.visible_diffuse=False;p.visible_glossy=False;p.visible_transmission=False;p.visible_shadow=False
im=bpy.data.images.new('bake',width=8,height=8,float_buffer=True);im.colorspace_settings.name='Non-Color';n=p.active_material.node_tree.nodes.new('ShaderNodeTexImage');n.image=im;p.active_material.node_tree.nodes.active=n
bpy.ops.object.select_all(action='DESELECT');p.select_set(True);bpy.context.view_layer.objects.active=p;bpy.ops.object.bake(type='DIFFUSE');v=list(im.pixels);mean=sum(v[i] for i in range(len(v)) if i%4!=3)/(8*8*3)
print('RADIANCE_UNITS_VALIDATION',json.dumps({'measured':mean,'expected':2.7*.5/math.pi,'ratio':mean/(2.7*.5/math.pi)}))
