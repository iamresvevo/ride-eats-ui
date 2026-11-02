// Modal manager. One persistent overlay (#modal-root) holds every sheet, so stacking a
// second modal never re-fades the backdrop. Esc / overlay click close the top sheet.
import {el,$} from './dom.js';
import {svg} from './icons.js';
const stack=[];
let root=null;
const pendingPaints=new Set();
let backdropClosing=false,settleTimer;
// Data keeps updating; obscured pages repaint once after the backdrop disappears.
export function deferModalBackground(draw){
  let disposed=false;
  const paint=()=>{
    if(disposed)return;
    if(stack.length||backdropClosing){pendingPaints.add(paint);return}
    pendingPaints.delete(paint);draw();
  };
  paint.dispose=()=>{disposed=true;pendingPaints.delete(paint)};
  return paint;
}
function layer(){
  if(root)return root;
  root=$('modal-root');
  root.addEventListener('mousedown',e=>{const top=stack.at(-1);if(e.target===root&&top?.dismissible)top.close()});
  document.addEventListener('keydown',e=>{const top=stack.at(-1);if(e.key==='Escape'&&top?.dismissible&&top.closeOnEscape)top.close()});
  return root;
}
function sync(){
  const open=stack.length>0;
  clearTimeout(settleTimer);
  backdropClosing=!open;
  if(!open)settleTimer=setTimeout(()=>{
    backdropClosing=false;
    const paints=[...pendingPaints];pendingPaints.clear();paints.forEach(paint=>paint());
  },200);
  layer().classList.toggle('open',open);
  document.body.classList.toggle('modal-open',open);
  stack.forEach((m,i)=>{m.sheet.classList.toggle('behind',i<stack.length-1);m.sheet.inert=i<stack.length-1});
}

export function openModal({title,body,footer,size='md',dismissible=true,closeOnEscape=true,onClose,beforeClose}={}){
  const returnFocus=document.activeElement;
  const titleNode=el('h2',{class:'modal-title',text:title||''});
  const bodyNode=el('div',{class:'modal-body'});
  const footNode=el('div',{class:'modal-foot'});
  const clean=kids=>kids.flat(Infinity).filter(k=>k!=null&&k!==false);
  const sheet=el('div',{class:'modal '+size,role:'dialog','aria-modal':'true',tabindex:'-1'},
    el('div',{class:'modal-head'},titleNode,dismissible&&el('button',{type:'button',class:'icon-btn','aria-label':'Close',onclick:()=>handle.close()},svg('x',18))),
    bodyNode,footNode);
  let closePending=false;
  const closeNow=()=>{const i=stack.indexOf(handle);if(i<0)return;stack.splice(i,1);sheet.classList.remove('in');sync();setTimeout(()=>sheet.remove(),200);onClose?.();returnFocus?.focus?.({preventScroll:true});};
  const handle={
    sheet,dismissible,closeOnEscape,
    get node(){return sheet},
    setTitle(t){titleNode.textContent=t},
    setBody(...kids){bodyNode.replaceChildren(...clean(kids))},
    setFooter(...kids){footNode.replaceChildren(...clean(kids));footNode.classList.toggle('empty',!footNode.childNodes.length)},
    close(){
      if(!beforeClose){closeNow();return;}
      if(closePending)return;closePending=true;
      Promise.resolve(beforeClose()).then(allowed=>{if(allowed!==false)closeNow();}).finally(()=>{closePending=false;});
    },
  };
  handle.setBody(body||[]);handle.setFooter(footer||[]);
  layer().append(sheet);stack.push(handle);sync();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{if(!stack.includes(handle))return;sheet.classList.add('in');sheet.focus({preventScroll:true})}));
  return handle;
}

// tone: 'danger' for destructive actions, 'neutral' for everyday ones (sign out, clear), 'primary' for positive ones.
export function confirmModal({title,message,confirmLabel='Confirm',cancelLabel='Cancel',tone='neutral',danger}){
  if(danger)tone='danger';
  return new Promise(resolve=>{
    let done=false;const finish=v=>{if(!done){done=true;resolve(v)}};
    const m=openModal({title,size:'sm',body:el('p',{class:'modal-text',text:message}),onClose:()=>finish(false)});
    m.setFooter(
      el('button',{class:'btn secondary',text:cancelLabel,onclick:()=>m.close()}),
      el('button',{class:'btn '+(tone==='danger'?'danger':tone==='primary'?'primary':'strong'),text:confirmLabel,onclick:()=>{finish(true);m.close()}}));
  });
}
