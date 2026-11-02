// Inline SVG icons (stroke = currentColor) so they follow the theme. No icon font or emoji.
import {el} from './dom.js';
const PATHS={
  'chevron-down':'<path d="m6 9 6 6 6-6"/>',
  move:'<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>',
  rotate:'<path d="M20 7v5h-5M20 12a8 8 0 1 0-2 6"/>',
  scale:'<path d="M14 3h7v7M21 3l-8 8M10 21H3v-7M3 21l8-8"/>',
  undo:'<path d="M3 10h10a7 7 0 0 1 0 14M3 10l5-5M3 10l5 5" transform="translate(0 -3)"/>',
  redo:'<path d="M21 7H11a7 7 0 0 0 0 14M21 7l-5-5M21 7l-5 5"/>',
  save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2Z"/><path d="M7 3v6h10V3M7 21v-8h10v8"/>',
  edit:'<path d="m16 3 5 5L8 21H3v-5L16 3ZM13 6l5 5"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m21 15-5-5L5 21"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  orders:'<path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/><path d="M9.5 12.5l1.8 1.8 3.2-3.6"/>',
  plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',
  more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  select:'<path d="m8 9 4-4 4 4M8 15l4 4 4-4"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  trash:'<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/>',
  refresh:'<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16"/><path d="M20 20v-4h-4"/>',
  download:'<path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
  logout:'<path d="M10 4H5v16h5M9 12h12m-4-4 4 4-4 4"/>',
  sidebar:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/>',
};
export function svg(name,size=18){
  const s=el('span',{class:'svg-icon','aria-hidden':'true'});
  s.innerHTML=`<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]||''}</svg>`;
  return s;
}
/** A tool's tile: its logo image, or an icon on a brand tile. */
export function toolIcon(tool,cls){
  if(typeof tool==='string')return el('span',{class:(cls||'')+' icon-tile'},svg(tool,22));
  return tool.logo?el('img',{src:tool.logo,alt:'',class:cls}):el('span',{class:(cls||'')+' icon-tile'},svg(tool.icon,cls==='nav-ico'?14:22));
}
