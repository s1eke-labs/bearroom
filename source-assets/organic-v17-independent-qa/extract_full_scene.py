"""Read-only extraction for independent v13 source QA. No authoring source is saved."""
import bpy,sys,json,hashlib
from pathlib import Path
import numpy as np
args=sys.argv[sys.argv.index('--')+1:];source=Path(args[0]).resolve();out=Path(args[1]).resolve()
bpy.ops.wm.open_mainfile(filepath=str(source));bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
meta={'source':str(source),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'objects':{},'sceneExtras':{k:v for k,v in bpy.context.scene.items() if isinstance(v,(str,bool,int,float,list))}};arrays={};wanted=[]
for rootname in ['F01_sofa', 'F02_coffee_table', 'F03_television', 'F04_tv_cabinet', 'F05_floor_lamp', 'F06_grand_piano', 'F07_bench', 'F08_computer_desk', 'F09_computer', 'F10_monitor', 'F11_computer_chair', 'F12_desk_lamp', 'F13_dining_group', 'F14_kitchen', 'F15_bed', 'F16_reading_rocker', 'F17_bookshelf', 'F18_wardrobe', 'F19_entry_group', 'F20_vanity', 'F21_circulator', 'F22_purifier', 'F23_pendulum_clock', 'Bear_reference_plush', 'Bear_desk_plush', 'Decor']:
 root=bpy.data.objects.get(rootname)
 if root:wanted.extend([root,*root.children_recursive])
wanted=set(bpy.data.objects)
for o in bpy.data.objects:
 d={'type':o.type,'parent':o.parent.name if o.parent else None,'matrixLocal':[list(r) for r in o.matrix_local],'matrixWorld':[list(r) for r in o.matrix_world],'extras':{k:v for k,v in o.items() if isinstance(v,(str,bool,int,float,list))}}
 if o.type in ['MESH','CURVE']:
  ev=o.evaluated_get(dg);mesh=ev.to_mesh();mesh.calc_loop_triangles()
  p=np.empty((len(mesh.vertices),3));mesh.vertices.foreach_get('co',p.ravel());m=np.array(o.matrix_world);world=p@m[:3,:3].T+m[:3,3]
  tris=np.array([list(t.vertices) for t in mesh.loop_triangles],dtype=np.int32)
  d.update({'vertices':len(p),'triangles':len(tris),'bounds':[world.min(axis=0).tolist(),world.max(axis=0).tolist()],'materials':[{'name':m.name,'alphaMode':getattr(m,'surface_render_method','DITHERED'),'baseAlpha':m.node_tree.nodes.get('Principled BSDF').inputs['Alpha'].default_value if m.use_nodes and m.node_tree.nodes.get('Principled BSDF') else 1} for m in mesh.materials if m]})
  if o in wanted or o.name.startswith('screen_') or 'bathroom' in o.name:
   key=str(sum(x.endswith('_local') for x in arrays));d['arrayKey']=key;arrays[key+'_local']=p;arrays[key+'_world']=world;arrays[key+'_tri']=tris; loopnorm=np.array([tuple(n.vector) for n in mesh.corner_normals]); li=np.array([tuple(t.loops) for t in mesh.loop_triangles]); norm=loopnorm[li]@np.linalg.inv(m[:3,:3]); norm/=np.maximum(np.linalg.norm(norm,axis=2)[:,:,None],1e-30); arrays[key+'_cornerNormals']=norm
  ev.to_mesh_clear()
 meta['objects'][o.name]=d
out.parent.mkdir(parents=True,exist_ok=True);out.with_suffix('.json').write_text(json.dumps(meta,indent=2));np.savez_compressed(out.with_suffix('.npz'),**arrays);print('QA_EXTRACT',str(out),len(meta['objects']),len(arrays)//3)
