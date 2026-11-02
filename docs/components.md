# Quick component reference

Import from `src/index.js`; include `css/index.css`. Call `initUI()` once after the body exists, then `applyTheme()`.

| Component | API / use |
| --- | --- |
| Header | `siteHeader({brand, items, account, menuItems, onSignOut, extras})` → `{node,setActive(id),setAccount(account),close(),destroy()}`. Brand: `{name,href,logoLight,logoDark}`; tabs: `{id,label,icon,href}`. |
| Dropdown | `menu({trigger,items:()=>rows,align:'start',portal:true})` → `{node,open(),close(),refresh(),reposition()}`. Append `node`, not the trigger separately. |
| Menu rows | `{label,icon,onSelect,checked,disabled,danger}`; `{type:'separator'}`; `{type:'label',label}`; `{type:'sub',id,label,value,items:[...]}`; `{type:'content',node}`; `{type:'profile',title,detail}`. |
| Single select | `selectControl([['all','All'],['open','Open']],{label:'Status',value:'all'})` → DOM node with `.value`, `.disabled`, `.setOptions(options)` and bubbling `change` event. |
| Select trigger | `selectButton({label,value,placeholder,disabled})` → button for a custom dropdown. |
| Async search/select | `searchSelect({label,load:async query=>[{id,label,detail}],onChange:items=>{},max:1})` → `{node,value,setValue(items),reset(),setDisabled(bool),destroy()}`; default max is 50. Supply your own data loader. |
| Tabs | `tabs([{id,label,count}],active,onChange)` → `{node,set(id),update(items)}`. Render matching content in your callback. |
| Filter chips | `chips([{id,label}],active,onChange,{scrollable:true})` → node. |
| Dialog | `openModal({title,body,footer,size:'md',dismissible:true,onClose,beforeClose})` → `{node,setTitle(),setBody(...nodes),setFooter(...nodes),close()}`. Sizes sm/md/lg. `beforeClose` may return/resolve false to block dismissal. |
| Confirmation | `await confirmModal({title,message,confirmLabel,cancelLabel,tone,danger})` → boolean. |
| Toast | `toast('Saved','good')`; neutral/good/bad CSS tones. |
| Badge | `badge('Active','good')` → node; neutral/good/wait/bad. |
| Stat | `stat({label,value,hint,tone})` → node. Group in `.stats`. |
| Empty state | `empty(title,description,actionNode)` → node. |
| Pagination | `pager({size:10,sizes:[10,25,50],onChange:render})` → `{node,slice(rows),reset()}`. Use `slice` each render, append pager node. Client-side only. |
| Search field | `searchField(el('input',{type:'search',placeholder:'Search'}))` → labeled search wrapper. Supply an accessible input label. |
| Sticky toolbar | `stickyBar(...nodes)` → sibling nodes; append both. Reads `--header-height`. |
| DOM helper | `el(tag,attributes,...children)` → node; `text` sets safe text, `onclick` handles events. |
| Busy button | `await busy(button,'Saving…',async()=>save())` disables repeat clicks and restores content. |
| Icons | `svg(name,size=18)` → node. See src/icons.js for names; `icon(name)` supplies header icons. |
| Avatar / verification | `avatar({name,avatar})`, `verificationBadge(verified)` → node (badge returns null when false). |
| Theme | `getTheme()`, `setTheme('system'|'light'|'dark')`, `applyTheme()`, `THEMES`; preference saved under rideEatsUI.theme. |
| Deferred redraw | `const paint=deferModalBackground(render)`; call `paint()` on changes, `paint.dispose()` on cleanup. |

## Dropdown and form example

```js
const trigger = el('button', {type:'button',class:'btn',text:'Actions'});
const actions = menu({trigger, items:()=>[
  {label:'Edit',icon:'edit',onSelect:()=>toast('Edit selected')},
  {type:'separator'},
  {label:'Archive',danger:true,onSelect:()=>toast('Archived')},
]});
const status = selectControl([['all','All'],['open','Open']], {label:'Status'});
status.addEventListener('change', () => console.log(status.value));
document.body.append(actions.node, status);
// On unmount: actions.close(); actions.node.remove();
```

## CSS building blocks

| Need | Classes |
| --- | --- |
| Buttons | `btn`, `btn primary`, `btn strong`, `btn danger`, `btn small`, `icon-btn` |
| Fields | `field` label wrapper with span + input/textarea; `field-row` |
| Layout | `site-page`, `stack`, `split`, `card`, `card-head`, `card-actions` |
| Typography | `muted`, `mono`, `nowrap` |
| Table | `table` on a semantic table; `num` for numeric cells. Wrap in an overflow container on mobile. |
| Loading | `spinner`, `loading`; prefer `busy()` for async buttons |
| Utility | `hidden`, `stats`, `toolbar` |

Close dropdowns before removing their nodes. Call `header.destroy()` and `searchSelect.destroy()` on unmount. Keep only one modal root and toast root. Tabs expose tab roles but the consuming app must associate panels and implement any additional keyboard/panel behavior it requires.
