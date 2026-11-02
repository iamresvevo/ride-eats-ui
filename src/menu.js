// Port of Send's ui/Menu.jsx (send.ride-eats.com): the app's one dropdown.
import {el} from './dom.js';
import {svg} from './icons.js';

// Rows that can take focus: shown, enabled, and not inside a collapsed group.
const visibleItems=root=>[...root.querySelectorAll('[role="menuitem"]:not(:disabled)')].filter(item=>item.offsetParent&&!item.closest('[inert]'));

/**
 * `trigger` is the button that opens it. `items()` runs on every draw and returns rows:
 *   {label,icon,checked,danger,disabled,closesMenu,onSelect}   one action; `checked` marks the current choice
 *   {type:'label',label} · {type:'separator'} · {type:'profile',title,detail,badge}
 *   {type:'sub',id,label,value,icon,items:[...]}               a row showing its current value
 * Falsy rows are skipped.
 *
 * A sub row's options expand in place, directly under the row; choosing it again collapses them.
 * Picking an option collapses the group and leaves the menu open, so the new value is visible on the row.
 * `closesMenu` on an option closes the whole menu instead (for an option that opens a dialog).
 *
 * Closes on selection, outside click and Escape; arrow keys move between items.
 * It opens upwards when there is no room below. Opening and closing are animated.
 */
export function menu({trigger,items,align='end',className='',portal=false,matchTriggerWidth=false,openOnClick=true,onOpen,onClose,searchable=trigger.classList.contains('menu-select')}){
  let panel=null,sub=null;
  const node=el('div',{class:('menu '+className).trim()},trigger);
  trigger.setAttribute('aria-haspopup','menu');trigger.setAttribute('aria-expanded','false');
  if(openOnClick)trigger.addEventListener('click',()=>panel?close():open());

  function row(item,inGroup){
    if(!item)return null;
    if(item.type==='content')return el('div',{'data-menu-content':'true'},typeof item.render==='function'?item.render():item.node);
    if(item.type==='label')return el('div',{class:'menu-label',text:item.label});
    if(item.type==='profile')return el('div',{class:'menu-profile'},el('strong',{},el('span',{class:'verified-name-text',text:item.title}),item.badge),item.detail&&el('span',{text:item.detail}));
    if(item.type==='separator')return el('div',{class:'menu-separator',role:'separator'});
    if(item.type==='sub')return el('div',{class:'menu-sub'},
      el('button',{type:'button',role:'menuitem','aria-expanded':'false',class:'menu-item',onclick:()=>{sub=sub===item.id?null:item.id;sync()}},
        item.icon&&svg(item.icon,15),el('span',{text:item.label}),item.value&&el('small',{class:'menu-value',text:item.value}),svg('select',13)),
      // Always rendered so it can animate both ways; `inert` keeps it out of reach while collapsed.
      el('div',{class:'menu-options',role:'group','aria-label':item.label,'data-sub':item.id,inert:true},el('div',{},...item.items.map(option=>row(option,true)))));
    return el('button',{type:'button',role:'menuitem',class:item.danger?'menu-item menu-item-danger':'menu-item',disabled:item.disabled,onclick:()=>{
      if(inGroup&&!item.closesMenu){item.onSelect();collapse()}
      else{close(true);item.onSelect()}
    }},item.icon&&svg(item.icon,15),el('span',{text:item.label}),item.checked&&svg('check',15));
  }
  function sync(){
    if(!panel)return;
    panel.toggleAttribute('data-sub',!!sub);
    for(const group of panel.querySelectorAll('.menu-options')){
      const on=group.dataset.sub===String(sub);
      group.classList.toggle('is-open',on);group.inert=!on;group.previousElementSibling.setAttribute('aria-expanded',String(on));
    }
  }
  function draw(){
    const entries=items().filter(Boolean);
    if(!searchable){panel.replaceChildren(...entries.map(item=>row(item)));sync();return;}
    const input=el('input',{type:'search',class:'menu-search',placeholder:'Search…','aria-label':'Search '+(trigger.getAttribute('aria-label')||'choices'),autocomplete:'off'});
    const results=el('div',{class:'menu-search-results'});
    const filter=()=>{
      const words=input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      const shown=words.length?entries.filter(item=>item.label&&item.type!=='separator'&&words.every(word=>item.label.toLocaleLowerCase().includes(word))):entries;
      results.replaceChildren(...(shown.length?shown.map(item=>row(item)):[el('div',{class:'menu-label',role:'status',text:'No matches found.'})]));
      sync();if(portal||scroller)float();
    };
    input.oninput=filter;
    panel.replaceChildren(el('div',{class:'menu-search-head'},svg('search',15),input),results);filter();
  }
  // Redraw with the group still open, then let it fold away so the new value shows on its row.
  function collapse(){const id=sub;draw();sub=id;sync();requestAnimationFrame(()=>{sub=null;sync();panel?.querySelector(`.menu-options[data-sub="${CSS.escape(String(id))}"]`)?.previousElementSibling.focus()})}

  const onPointer=e=>{if(!node.contains(e.target)&&!panel?.contains(e.target))close()};
  const onKey=e=>{
    if(!panel)return;
    if(e.target.closest?.('[data-menu-content]')&&!['Escape','Tab'].includes(e.key))return;
    if(!openOnClick&&trigger.contains(e.target)&&!['Escape','Tab'].includes(e.key))return;
    const inPicker=panel.hasAttribute('data-sub');
    if(e.key==='Escape'||(e.key==='ArrowLeft'&&inPicker)){
      e.preventDefault();e.stopImmediatePropagation();
      // Collapse an expanded group first; close the menu after that.
      if(inPicker){sub=null;sync();return}
      close(true);
    }else if(e.key==='ArrowDown'||e.key==='ArrowUp'){
      e.preventDefault();
      const list=visibleItems(panel),next=list.indexOf(document.activeElement)+(e.key==='ArrowDown'?1:-1);
      list[(next+list.length)%list.length]?.focus();
    }else if(e.key==='Tab')close();
  };
  // Inside a dialog the panel floats above the dialog's scroll area instead of being clipped by it.
  let scroller=null;
  const onScroll=()=>close();
  function float(){
    if(!panel)return;if(!trigger.isConnected||!trigger.getClientRects().length){close();return;}
    const r=trigger.getBoundingClientRect(),gap=8,edge=12;
    panel.classList.add('menu-float');
    if(matchTriggerWidth||(align==='start'&&className.includes('menu-block')))panel.style.width=r.width+'px';
    const h=panel.offsetHeight,w=panel.offsetWidth;
    const up=r.bottom+gap+h+edge>innerHeight&&r.top-gap-h-edge>0;
    panel.classList.toggle('menu-up',up);
    panel.style.top=(up?r.top-gap-h:Math.min(r.bottom+gap,innerHeight-edge-h))+'px';
    panel.style.left=Math.max(edge,Math.min(innerWidth-edge-w,align==='end'?r.right-w:r.left))+'px';
  }
  function open(){
    if(panel)return;sub=null;panel=el('div',{class:`menu-panel menu-${align}`,role:'menu'});draw();(portal?document.body:node).append(panel);
    scroller=trigger.closest('.modal-body,.season-form');
    if(scroller||portal){float();scroller?.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',float)}
    // No room below the trigger: flip above it.
    else panel.classList.toggle('menu-up',trigger.getBoundingClientRect().bottom+panel.offsetHeight+16>innerHeight);
    trigger.setAttribute('aria-expanded','true');
    document.addEventListener('pointerdown',onPointer);document.addEventListener('keydown',onKey,true);
    // Opening the menu puts focus on its first row.
    if(searchable)panel.querySelector('.menu-search')?.focus({preventScroll:true});else if(openOnClick)visibleItems(panel)[0]?.focus();onOpen?.();
  }
  function close(focus){
    if(!panel)return;
    const closing=panel;panel=null;sub=null;
    scroller?.removeEventListener('scroll',onScroll);scroller=null;window.removeEventListener('resize',float);
    document.removeEventListener('pointerdown',onPointer);document.removeEventListener('keydown',onKey,true);
    trigger.setAttribute('aria-expanded','false');onClose?.();
    // Keep the panel mounted until its own exit animation ends.
    closing.classList.add('is-closing');closing.inert=true;
    closing.addEventListener('animationend',e=>{if(e.target===closing)closing.remove()});setTimeout(()=>closing.remove(),300);
    if(focus)trigger.focus();
  }
  return{node,open,close,reposition(){if(panel&&(portal||scroller))float()},refresh(){if(panel){draw();if(portal||scroller)float()}}};
}

/** A field-like trigger for choosing one value from a menu. */
export function selectButton({label,value,placeholder='Choose',disabled}){
  return el('button',{type:'button',class:'menu-select','aria-label':label,disabled},el('span',{class:value?'':'muted',text:value||placeholder}),svg('select',14));
}

// Field wrapper around the shared menu; keeps value changes compatible with forms.
export function selectControl(options,{label='Choose',value=options[0]?.[0]}={}){
  let current=String(value??'');
  const trigger=selectButton({label,value:options.find(([v])=>String(v)===current)?.[1]});
  const control=menu({trigger,align:'start',className:'menu-block',portal:true,matchTriggerWidth:true,items:()=>options.map(([id,text])=>({label:text,checked:String(id)===current,onSelect:()=>{control.node.value=String(id);control.node.dispatchEvent(new Event('change',{bubbles:true}));}}))});
  control.node.setOptions=next=>{options=next;control.node.value=String(options[0]?.[0]??'');control.refresh()};
  Object.defineProperty(control.node,'disabled',{get:()=>trigger.disabled,set:value=>{trigger.disabled=!!value;if(value)control.close()}});
  Object.defineProperty(control.node,'value',{get:()=>current,set:next=>{current=String(next);trigger.firstChild.textContent=options.find(([id])=>String(id)===current)?.[1]||'Choose';}});
  return control.node;
}
