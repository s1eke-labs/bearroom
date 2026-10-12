/** Per-attempt ownership: cancellation never lets late parser/texture results leak into a new room. */
export class LoadResources {
  constructor(signal) { this.signal=signal; this.resources=new Set(); this.roots=new Set(); this.disposed=new Set(); this.closed=false; this.abort=()=>this.dispose();signal?.addEventListener('abort',this.abort,{once:true}); }
  check(){if(this.closed||this.signal?.aborted)throw this.signal?.reason||new Error('Loading cancelled');}
  own(resource){if(this.closed||this.signal?.aborted){this.disposeResource(resource);this.check();}if(resource?.dispose)this.resources.add(resource);return resource;}
  ownRoot(root){if(this.closed||this.signal?.aborted){this.disposeRoot(root);this.check();}this.roots.add(root);this.collect(root);return root;}
  collect(root){root?.traverse?.(object=>{if(object.geometry)this.resources.add(object.geometry);for(const material of Array.isArray(object.material)?object.material:[object.material]){if(!material)continue;this.resources.add(material);for(const value of Object.values(material))if(value?.isTexture)this.resources.add(value);}});}
  disposeResource(resource){if(!resource||this.disposed.has(resource))return;this.disposed.add(resource);try{resource.dispose?.();}catch{/* Continue releasing other resources. */}const image=resource.isTexture?resource.source?.data:null;if(image?.close&&!this.disposed.has(image)){this.disposed.add(image);try{image.close();}catch{}}}
  disposeRoot(root){this.collect(root);root?.removeFromParent?.();for(const resource of this.resources)this.disposeResource(resource);}
  wait(promise,{lateDispose,timeoutMs=45000}={}){
    this.check();return new Promise((resolve,reject)=>{let settled=false;const finish=(error,value)=>{if(settled)return false;settled=true;clearTimeout(timer);this.signal?.removeEventListener('abort',abort);error?reject(error):resolve(value);return true;};const abort=()=>finish(this.signal.reason||new Error('Loading cancelled'));const timer=setTimeout(()=>finish(new Error('Asset decode timed out')),timeoutMs);this.signal?.addEventListener('abort',abort,{once:true});if(this.signal?.aborted)abort();Promise.resolve(promise).then(value=>{if(!finish(null,value))lateDispose?.(value);},error=>finish(error));});
  }
  retain(){this.check();this.signal?.removeEventListener('abort',this.abort);}
  dispose(){if(this.closed)return;this.closed=true;this.signal?.removeEventListener('abort',this.abort);for(const root of this.roots){this.collect(root);root.removeFromParent?.();}for(const resource of this.resources)this.disposeResource(resource);this.resources.clear();this.roots.clear();}
}
