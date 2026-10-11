import bpy, math, json
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=64;s.cycles.use_denoising=False;s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs['Strength'].default_value=0
s.render.bake.use_pass_color=False;s.render.bake.use_pass_direct=True;s.render.bake.use_pass_indirect=False;s.render.bake.margin=0
bpy.ops.mesh.primitive_plane_add(size=.001);p=bpy.context.object
m=bpy.data.materials.new('receiver');m.use_nodes=True;n=m.node_tree.nodes;n.clear();bs=n.new('ShaderNodeBsdfDiffuse');bs.inputs['Color'].default_value=(1,1,1,1);out=n.new('ShaderNodeOutputMaterial');m.node_tree.links.new(bs.outputs['BSDF'],out.inputs['Surface']);p.data.materials.append(m)
im=bpy.data.images.new('bake',width=8,height=8,float_buffer=True);im.colorspace_settings.name='Non-Color';n=m.node_tree.nodes.new('ShaderNodeTexImage');n.image=im;m.node_tree.nodes.active=n
result={}
for kind in ['POINT','SPOT']:
 bpy.ops.object.light_add(type=kind,location=(0,0,1));o=bpy.context.object;o.data.energy=4*math.pi;o.data.shadow_soft_size=.0
 if kind=='SPOT':o.data.spot_size=math.pi*.84;o.data.spot_blend=.7
 bpy.ops.object.select_all(action='DESELECT');p.select_set(True);bpy.context.view_layer.objects.active=p;bpy.ops.object.bake(type='DIFFUSE');v=list(im.pixels);mean=sum(v[i] for i in range(len(v)) if i%4!=3)/(8*8*3)
 result[kind]={'measured':mean,'expected':1/math.pi,'ratio':mean*math.pi};bpy.data.objects.remove(o,do_unlink=True)
print('LIGHT_UNIT_VALIDATION',json.dumps(result))
