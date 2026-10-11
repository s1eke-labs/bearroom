"""Correct inherited oversized mattress piping after reviewed cloth fitting.
The old trim extended 117 mm beyond the actual mattress. Retain its identity and
transform, fit its 1.5 mm sewn cord into the mattress mid-plane perimeter.
"""
import bpy
from mathutils import Vector

def finalize_mattress_piping():
 o=bpy.data.objects['mattress_piping']
 if o.get('referencePipingFitV13'):return
 p=[v.co for v in o.data.vertices];lo=Vector([min(v[i] for v in p) for i in range(3)]);hi=Vector([max(v[i] for v in p) for i in range(3)]);c=(lo+hi)*.5;dims=hi-lo;target=Vector((2.036,2.076,.003))
 for v in o.data.vertices:
  for i in range(3):v.co[i]=c[i]+(v.co[i]-c[i])*target[i]/dims[i]
 o.data.update();o['referencePipingFitV13']=True;o['referenceTrimConstruction']='1.5 mm mattress seam cord fitted within actual mattress perimeter'
 return {'part':o.name,'oldDimensionsM':list(dims),'newDimensionsM':list(target),'transformUnchanged':True}
