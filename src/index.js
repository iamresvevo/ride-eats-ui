export * from './dom.js';
export * from './icons.js';
export * from './menu.js';
export * from './modal.js';
export * from './search-select.js';
export * from './site-header.js';
export * from './theme.js';
export * from './toast.js';
export * from './ui.js';
export function initUI(){
  for(const id of ['modal-root','toast-root']){
    if(!document.getElementById(id)){const node=document.createElement('div');node.id=id;document.body.append(node);}
  }
}
