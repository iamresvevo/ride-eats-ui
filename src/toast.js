import {el,$} from './dom.js';
export function toast(text,tone='neutral'){
  const t=el('div',{class:'toast '+tone,role:'status',text});
  $('toast-root').append(t);
  requestAnimationFrame(()=>t.classList.add('in'));
  setTimeout(()=>{t.classList.remove('in');setTimeout(()=>t.remove(),250)},3200);
}
