/** Independent CPU-only DOM substitutes. These do not certify browser layout or GPU rendering. */
export class QAElement extends EventTarget {
  constructor(id = '') {
    super(); this.id=id; this.style={}; this.attributes=new Map(); this.dataset={};
    this.textContent=''; this.innerHTML=''; this.hidden=false; this.disabled=false;
    this.captured=new Set(); this.children=[]; this.clientWidth=1440; this.clientHeight=900;
    const values=new Set(); this.classList={add:(...v)=>v.forEach(x=>values.add(x)),remove:(...v)=>v.forEach(x=>values.delete(x)),contains:v=>values.has(v),toggle:(v,on)=>{const yes=on??!values.has(v);yes?values.add(v):values.delete(v);return yes;}};
  }
  setAttribute(k,v){this.attributes.set(k,String(v));}
  getAttribute(k){return this.attributes.get(k)??null;}
  removeAttribute(k){this.attributes.delete(k);}
  hasAttribute(k){return this.attributes.has(k);}
  getBoundingClientRect(){return this.rect||{x:0,y:0,left:0,top:0,right:this.clientWidth,bottom:this.clientHeight,width:this.clientWidth,height:this.clientHeight};}
  focus(){if(this.ownerDocument)this.ownerDocument.activeElement=this;}
  blur(){if(this.ownerDocument?.activeElement===this)this.ownerDocument.activeElement=null;}
  setPointerCapture(id){this.captured.add(id);}
  releasePointerCapture(id){this.captured.delete(id);}
  hasPointerCapture(id){return this.captured.has(id);}
  contains(el){return el===this||this.children.includes(el);}
  closest(selector){if(selector==='button'&&this.tagName==='BUTTON')return this;return null;}
  querySelector(){return null;}
  querySelectorAll(){return [];}
}
export function dispatch(target,type,values={}) {
  const e=new Event(type,{bubbles:true,cancelable:true});
  for(const[k,v]of Object.entries(values))Object.defineProperty(e,k,{value:v,configurable:true});
  target.dispatchEvent(e);return e;
}
export function qaDOM(width=1440,height=900){
  const windowTarget=new QAElement('window'); windowTarget.innerWidth=width;windowTarget.innerHeight=height;windowTarget.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
  const documentTarget=new QAElement('document');documentTarget.visibilityState='visible';documentTarget.hidden=false;documentTarget.activeElement=null;documentTarget.pointerLockElement=null;
  documentTarget.exitPointerLock=()=>{documentTarget.pointerLockElement=null;dispatch(documentTarget,'pointerlockchange');};
  const result={windowTarget,documentTarget};
  for(const id of ['canvas','app','toggleButton','joystick','joystickKnob','hint','status']){const e=result[id]=new QAElement(id);e.ownerDocument=documentTarget;e.clientWidth=width;e.clientHeight=height;}
  result.toggleButton.tagName='BUTTON';result.canvas.tagName='CANVAS';result.joystick.rect={left:20,top:600,right:140,bottom:720,width:120,height:120};
  result.canvas.requestPointerLock=async()=>{documentTarget.pointerLockElement=result.canvas;dispatch(documentTarget,'pointerlockchange');};
  documentTarget.querySelector=selector=>selector==='dialog[open]'?null:null;
  return result;
}
