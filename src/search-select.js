import {el} from './dom.js';
import {svg} from './icons.js';
import {menu} from './menu.js';

/** Searchable choices rendered by the shared dropdown. Existing multi-select API is preserved. */
export function searchSelect({label,placeholder='Search or select',load,onChange,max=50}){
 const uid='select-'+crypto.randomUUID();let selected=[],rows=[],open=false,active=-1,revision=0,timer=null,disposed=false,disabled=false;
 const chips=el('div',{class:'search-select-chips'}),list=el('div',{id:uid,role:'listbox','aria-label':label,'aria-multiselectable':String(max>1)}),status=el('div',{class:'search-select-status',role:'status'});
 const input=el('input',{type:'text',role:'combobox','aria-label':label,'aria-autocomplete':'list','aria-controls':uid,'aria-expanded':'false',placeholder,autocomplete:'off'});
 const toggle=el('button',{type:'button',class:'search-select-toggle','aria-label':'Show '+label.toLowerCase(),onclick:()=>{if(open)close();else{input.focus();if(!open)show();}}},svg('chevron-down',16));
 const inputRow=el('div',{class:'search-select-input'},input,toggle),results=el('div',{class:'search-select-results','data-menu-content':'true'},status,list);
 const dropdown=menu({trigger:inputRow,align:'start',className:'search-select-menu',portal:true,matchTriggerWidth:true,openOnClick:false,items:()=>[{type:'content',node:results}],onOpen:()=>{open=true;input.setAttribute('aria-expanded','true');search();},onClose:()=>{open=false;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');}});
 const node=el('div',{class:'search-select'+(max===1?' single':'')},chips,dropdown.node);
 function close(){dropdown.close()}
 function draw(){
  inputRow.hidden=max===1&&selected.length>0;
  chips.replaceChildren(...selected.map(item=>el('span',{class:'search-select-chip'},el('span',{text:item.label}),el('button',{type:'button',disabled,'aria-label':'Remove '+item.label,text:'×',onclick:()=>choose(item)}))));
  list.replaceChildren(...rows.map((item,i)=>el('div',{class:'search-select-option'+(active===i?' focused':''),id:uid+'-'+i,role:'option','aria-selected':String(selected.some(s=>s.id===item.id)),onmousedown:e=>e.preventDefault(),onclick:()=>choose(item)},el('span',{class:'search-select-label'},el('strong',{text:item.label}),item.detail&&el('small',{class:'muted',text:item.detail})),el('span',{class:'search-select-check','aria-hidden':'true'},selected.some(s=>s.id===item.id)?svg('check',15):null))));
  if(active>=0&&rows[active]){input.setAttribute('aria-activedescendant',uid+'-'+active);list.children[active]?.scrollIntoView({block:'nearest'})}else input.removeAttribute('aria-activedescendant');dropdown.reposition();
 }
 function choose(item){if(disabled)return;const i=selected.findIndex(s=>s.id===item.id);if(i>=0)selected.splice(i,1);else if(selected.length<max)selected.push(item);else{status.textContent=`Select up to ${max} people.`;return;}revision++;clearTimeout(timer);input.value='';rows=[];active=-1;close();draw();onChange?.([...selected]);}
 async function search(){const current=++revision;status.textContent='Loading…';list.replaceChildren();dropdown.reposition();try{const result=await load(input.value.trim());if(disposed||current!==revision)return;rows=result.filter(item=>!selected.some(s=>s.id===item.id));active=-1;status.textContent=rows.length?'':'No matches found.';draw();}catch(e){if(!disposed&&current===revision){rows=[];status.textContent=e.message||'Could not load choices.';draw();}}}
 function show(){if(disabled||disposed)return;dropdown.open();}
 input.onfocus=()=>{if(!open)show()};input.oninput=()=>{revision++;clearTimeout(timer);if(!open)show();timer=setTimeout(search,200);};
 input.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();close();return;}if(e.key==='Tab'){close();return;}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!open){show();return;}active=rows.length?(active+(e.key==='ArrowDown'?1:-1)+rows.length)%rows.length:-1;draw();}else if(e.key==='Enter'){e.preventDefault();if(open&&rows[active])choose(rows[active]);else if(!open)show();}else if(e.key==='Backspace'&&!input.value&&selected.length)choose(selected.at(-1));};
 return {node,get value(){return [...selected]},setValue(items){selected=Array.isArray(items)?items.slice(0,max):[];if(max===1&&selected.length)close();draw();},reset(){revision++;selected=[];rows=[];input.value='';close();draw();onChange?.([])},setDisabled(value){disabled=value;input.disabled=value;toggle.disabled=value;if(value)close();draw()},destroy(){disposed=true;revision++;clearTimeout(timer);close();}};
}
