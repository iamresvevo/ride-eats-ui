// Reusable UI pieces so every tool looks and behaves the same.
import {el} from './dom.js';
import {svg} from './icons.js';

export function searchField(input,{className='',tag='label',...attributes}={}){
 return el(tag,{...attributes,class:('search-field '+className).trim()},svg('search',16),input);
}


export function badge(label,tone='neutral'){return el('span',{class:'badge '+tone,text:label})}

export function stat({label,value,hint,tone}){
  return el('div',{class:'stat'+(tone?' '+tone:'')},
    el('span',{class:'stat-label',text:label}),
    el('strong',{class:'stat-value',text:value??'–'}),
    hint&&el('span',{class:'stat-hint',text:hint}));
}

// Tabs: items [{id,label,count}] ; returns {node,set(id)}
export function tabs(items,active,onChange){
  const node=el('div',{class:'tabs',role:'tablist'});
  const draw=()=>node.replaceChildren(...items.map(t=>el('button',{
    class:'tab'+(t.id===active?' active':''),role:'tab','aria-selected':String(t.id===active),
    onclick:()=>{if(t.id!==active){active=t.id;draw();onChange(t.id)}}},
    t.label,t.count!=null&&el('span',{class:'tab-count',text:String(t.count)}))));
  draw();
  return{node,set(id){active=id;draw()},update(next){items=next;draw()}};
}

// Pill filter: options [{id,label}]
export function chips(options,active,onChange,{scrollable=false}={}){
  const node=el('div',{class:'chips'+(scrollable?' scrollable':'')});
  const draw=()=>{const left=node.scrollLeft;node.replaceChildren(...options.map(o=>el('button',{class:'chip'+(o.id===active?' active':''),type:'button',text:o.label,onclick:()=>{active=o.id;draw();onChange(o.id)}})));node.scrollLeft=left;};
  draw();return node;
}

export function empty(title,text,action){
  return el('div',{class:'empty'},el('div',{class:'empty-ico',text:'○'}),el('strong',{text:title}),text&&el('p',{class:'muted',text}),action);
}

// Pager: slices a list and renders "1–10 of 42" with page buttons. Keeps its page across redraws.
export function pager({size=10,sizes=[10,25,50],onChange}){
  let page=1;
  const info=el('span',{class:'pager-info'});
  const select=el('select',{onchange:e=>{size=Number(e.target.value);page=1;onChange()}},sizes.map(n=>el('option',{value:n,text:String(n),selected:n===size})));
  const buttons=el('div',{class:'pager-pages'});
  const node=el('div',{class:'pager'},info,el('label',{class:'pager-size'},'Rows',select),buttons);
  return{
    node,
    reset(){page=1},
    slice(rows){
      const pages=Math.max(1,Math.ceil(rows.length/size));
      if(page>pages)page=pages;
      const from=(page-1)*size;
      const go=p=>{page=p;onChange()};
      const nums=[];
      for(let i=1;i<=pages;i++)if(i===1||i===pages||Math.abs(i-page)<=1)nums.push(i);else if(nums.at(-1)!=='…')nums.push('…');
      node.classList.toggle('hidden',rows.length<=sizes[0]);
      info.textContent=`${from+1}–${Math.min(from+size,rows.length)} of ${rows.length}`;
      buttons.replaceChildren(
          el('button',{class:'pager-btn',text:'‹','aria-label':'Previous page',disabled:page===1,onclick:()=>go(page-1)}),
          ...nums.map(n=>n==='…'?el('span',{class:'pager-gap',text:'…'}):el('button',{class:'pager-btn'+(n===page?' active':''),text:String(n),'aria-current':n===page?'page':null,onclick:()=>go(n)})),
          el('button',{class:'pager-btn',text:'›','aria-label':'Next page',disabled:page===pages,onclick:()=>go(page+1)}));
      return rows.slice(from,from+size);
    },
  };
}

/** A toolbar that sticks to the top of the page; it gains a shadow once it is stuck. */
export function stickyBar(...children){
  const sentinel=el('div',{class:'sticky-sentinel'});
  const bar=el('div',{class:'sticky-bar'},...children);
  // It sticks just below the shell's sticky header.
  const offset=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))||0;
  const check=()=>{
    if(!sentinel.isConnected)return stop();
    bar.classList.toggle('stuck',sentinel.getBoundingClientRect().top<offset());
  };
  // Capture phase catches the scroll whichever element actually scrolls.
  document.addEventListener('scroll',check,{capture:true,passive:true});
  const observer=new IntersectionObserver(check,{threshold:1});
  const stop=()=>{document.removeEventListener('scroll',check,{capture:true});observer.disconnect()};
  requestAnimationFrame(()=>{observer.observe(sentinel);check()});
  // Returned as siblings: a wrapper would limit how far the bar can stick.
  return [sentinel,bar];
}

