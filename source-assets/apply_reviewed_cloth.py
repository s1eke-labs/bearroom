"""Restore the accepted cloth fit exactly, after verifying topology and transforms.
Coordinate snapshot is authored source data, analogous to the editable mesh itself.
"""
from pathlib import Path
import bpy,json,hashlib,numpy as np

def apply_reviewed_cloth():
 root=Path(__file__).resolve().parent/'furniture-realism-review';meta=json.loads((root/'reviewed-cloth-coordinates.json').read_text());blob=(root/'reviewed-cloth-coordinates.bin').read_bytes();assert hashlib.sha256(blob).hexdigest()==meta['sha256']
 for row in meta['objects']:
  ob=bpy.data.objects[row['name']];me=ob.data;assert len(me.vertices)==row['vertexCount'];loops=np.array([l.vertex_index for l in me.loops],dtype='<u4');sizes=np.array([len(p.vertices) for p in me.polygons],dtype='<u4');assert hashlib.sha256(loops.tobytes()+sizes.tobytes()).hexdigest()==row['topologySha256'],'Cloth topology changed before snapshot application'
  assert max(abs(ob.matrix_local[i][j]-row['localMatrix'][i][j]) for i in range(4) for j in range(4))<2e-5,'Cloth pivot changed'
  a=np.frombuffer(blob,dtype='<f4',count=row['vertexCount']*3,offset=row['offset']);me.vertices.foreach_set('co',a);me.update();ob['reviewedClothFit']='Topology-checked accepted v12 coordinates'
 print('EXACT_REVIEWED_CLOTH_RESTORED',len(meta['objects']))
