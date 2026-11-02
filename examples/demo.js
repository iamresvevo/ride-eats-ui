import {initUI,applyTheme,setTheme,el,siteHeader,tabs,chips,menu,selectControl,searchSelect,openModal,confirmModal,toast,badge,stat,pager,empty,busy} from '../src/index.js';
initUI();applyTheme();
const logo='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="10" fill="#1fa476"/><path d="M9 23V9h8a5 5 0 0 1 0 10h-8m8 0 6 4" fill="none" stroke="white" stroke-width="3"/></svg>');
const header=siteHeader({brand:{name:'UI Kit',href:'#',logoLight:logo,logoDark:logo},items:[{id:'components',label:'Components',icon:'home',href:'#components'},{id:'docs',label:'Docs',icon:'files',href:'../docs/components.md'}],account:{name:'Demo Developer',email:'demo@example.com',verified:true},menuItems:()=>[{type:'sub',id:'theme',label:'Appearance',items:['system','light','dark'].map(value=>({label:value,onSelect:()=>setTheme(value)}))}],onSignOut:async()=>toast('Demo sign out')});
header.setActive('components');document.body.prepend(header.node);
const section=(title,...nodes)=>el('section',{class:'card'},el('h2',{text:title}),...nodes);
const row=(...nodes)=>el('div',{class:'demo-row'},...nodes);
const button=(text,onclick,kind='')=>el('button',{type:'button',class:'btn '+kind,text,onclick});
const panel=el('div',{class:'demo-panel',text:'All items'});
const tab=tabs([{id:'all',label:'All',count:12},{id:'active',label:'Active',count:8}],'all',id=>panel.textContent=id==='all'?'All items':'Active items');
const actions=menu({trigger:button('Open dropdown'),items:()=>[{label:'Edit',onSelect:()=>toast('Edit selected')},{type:'sub',id:'sort',label:'Sort',value:'Newest',items:[{label:'Newest',checked:true},{label:'Oldest'}]},{type:'separator'},{label:'Delete',danger:true,onSelect:async()=>{if(await confirmModal({title:'Delete demo item?',message:'This is a local demonstration.',danger:true}))toast('Deleted','good')}}]});
const select=selectControl([['all','All statuses'],['active','Active'],['draft','Draft']],{label:'Status'});select.addEventListener('change',()=>toast(select.value));
const search=searchSelect({label:'People',load:async q=>[{id:1,label:'Alex Rivera',detail:'alex@example.com'},{id:2,label:'Sam Chen',detail:'sam@example.com'}].filter(p=>p.label.toLowerCase().includes(q.toLowerCase())),onChange:()=>{},max:3});
const page=pager({size:10,onChange:drawRows});const list=el('div');function drawRows(){list.textContent=page.slice(Array.from({length:42},(_,i)=>i+1)).join(', ')}drawRows();
const grid=el('div',{class:'demo-grid'},
section('Buttons and feedback',row(button('Save',()=>toast('Saved','good'),'primary'),button('Secondary',()=>toast('Hello')),button('Busy',e=>busy(e.currentTarget,'Saving…',()=>new Promise(r=>setTimeout(r,700))))),row(badge('Active','good'),badge('Pending','wait'),badge('Failed','bad'))),
section('Tabs and filters',tab.node,panel,chips([{id:'all',label:'All'},{id:'mine',label:'Mine'}],'all',id=>toast(id))),
section('Dropdowns',actions.node,select),section('Async multi-select',search.node),
section('Forms',el('label',{class:'field'},el('span',{text:'Name'}),el('input',{placeholder:'Your name'})),el('label',{class:'field'},el('span',{text:'Notes'}),el('textarea',{placeholder:'Optional notes'}))),
section('Dialogs',button('Open dialog',()=>openModal({title:'Shared dialog',body:el('p',{text:'Same design in every application.'}),footer:button('Show toast',()=>toast('Done','good'),'primary')}))),
section('Pagination',list,page.node),section('Empty state',empty('No results','Try a different filter.')),
section('Table',el('div',{style:'overflow:auto'},el('table',{class:'table'},el('thead',{},el('tr',{},el('th',{text:'Name'}),el('th',{text:'Status'}))),el('tbody',{},el('tr',{},el('td',{text:'Example record'}),el('td',{},badge('Active','good'))))))));
document.body.append(el('main',{class:'site-page stack'},el('h1',{text:'Shared components'}),el('p',{class:'muted',text:'Ride Eats design components. Try the controls and switch Appearance in the account menu.'}),row(...['light','dark','system'].map(t=>button(t,()=>setTheme(t)))),el('div',{class:'stats'},stat({label:'Components',value:'20+',hint:'Browser ES modules'}),stat({label:'Runtime dependencies',value:0})),grid));
