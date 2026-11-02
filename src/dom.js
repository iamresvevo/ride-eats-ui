// Tiny element builder shared by every screen.
export function el(tag,attrs={},...kids){
  const e=document.createElement(tag);
  for(const[k,v]of Object.entries(attrs||{})){
    if(v==null||v===false)continue;
    if(k==='class')e.className=v;
    else if(k==='text')e.textContent=v;
    else if(k.startsWith('on'))e[k]=v;
    else e.setAttribute(k,v===true?'':v);
  }
  for(const k of kids.flat(Infinity))if(k!=null&&k!==false)e.append(k);
  return e;
}
export const $=id=>document.getElementById(id);
export function store(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
export function persist(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}

// Shared loading state: spinner + label on the button, blocks double clicks, restores afterwards.
export async function busy(button,label,fn){
  if(!button||button.classList.contains('loading'))return;
  const kids=[...button.childNodes];
  button.classList.add('loading');button.disabled=true;
  button.replaceChildren(el('span',{class:'spinner','aria-hidden':'true'}),label);
  button.setAttribute('aria-busy','true');
  try{return await fn()}
  finally{if(button.isConnected){button.classList.remove('loading');button.disabled=false;button.removeAttribute('aria-busy');button.replaceChildren(...kids)}}
}
