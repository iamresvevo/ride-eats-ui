// Send's Header.jsx + AccountMenu.jsx (send.ride-eats.com), ported 1:1 as a reusable, configurable header.
// Styles: css/site-header.css. Any Ride Eats app can mount it with its own brand, tabs and menu rows.
import {el,busy} from './dom.js';
import {menu} from './menu.js';

// Send's Icon.jsx paths, stroke 1.7.
const ICONS={
  home:'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  bag:'M6 7h12l-1 14H7L6 7M9 7a3 3 0 0 1 6 0',
  card:'M3 6h18v12H3V6M3 10h18M7 15h3',
  plug:'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8M12 17v4',
  bell:'M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2M10 21h4',
  upload:'M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5',
  files:'M8 3h8l4 4v14H8V3M16 3v5h4M4 7v14',
  chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',
  team:'M4 21V5h10v16M14 9h6v12M2 21h20M8 9h2M8 13h2M8 17h2',
  chevron:'m6 9 6 6 6-6',
};
export function icon(name){
  const s=document.createElementNS('http://www.w3.org/2000/svg','svg');
  s.setAttribute('class','icon');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');
  s.innerHTML=`<path d="${ICONS[name]||''}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  return s;
}

/** The blue verification mark used beside Ride Eats account names (Send's VerificationBadge). */
export function verificationBadge(verified){
  if(!verified)return null;
  const b=el('span',{class:'verification-badge',role:'img','aria-label':'Verified account',title:'Verified account'});
  b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 1 2.4 2.7 3.6-.6.8 3.6 3.3 1.5-1.4 3.4 1.4 3.4-3.3 1.5-.8 3.6-3.6-.6L12 23l-2.4-2.9-3.6.6-.8-3.6-3.3-1.5L3.3 12 1.9 8.6l3.3-1.5L6 3.5l3.6.6Z"/><path d="m7.5 12 3 3 6-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  return b;
}

const initials=name=>name.split(/\s+/).map(w=>w[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
export function avatar({name,avatar}){
  return el('span',{class:'account-avatar','aria-hidden':'true'},initials(name),
    avatar&&el('img',{src:avatar,alt:'',referrerpolicy:'no-referrer',onerror:e=>e.target.remove()}));
}

/**
 * brand: {name, href, logoLight, logoDark}       logoLight shows on light surfaces
 * items: [{id, label, icon, href}]               icon is a key of ICONS or an element
 * account: {name, email, avatar, verified}, or null while the account is still loading
 * menuItems(): extra rows for the account menu (core/menu.js rows), shown between the profile and Sign out
 * onSignOut(): async; the account button shows "Signing out…" while it runs
 * extras: nodes shown before the account button (Send shows its notification bell there)
 * Returns {node, setActive(id), setAccount(account), close(), destroy()}.
 */
export function siteHeader({brand,items,account=null,menuItems=()=>[],onSignOut,extras=[]}){
  const pill=el('span',{class:'nav-pill','aria-hidden':'true'});
  const navItems=el('div',{class:'site-nav-items'});
  const nav=el('nav',{class:'site-nav','aria-label':brand.name},pill,navItems);
  let active=null,accountMenu=null;

  // Send's AccountShell: the slot starts as a 42px loader and grows into the account pill.
  // Only the outer width animates, so the centred tabs never move.
  const content=el('div',{class:'account-content'});
  const shell=el('div',{class:'account-wrap account-shell'},content);
  let width=42,reveal=null;
  const measureAccount=()=>{
    const next=Math.ceil(content.getBoundingClientRect().width);
    if(!next||next===width)return;
    const previous=width;width=next;shell.style.width=next+'px';
    reveal?.cancel();
    if(next>previous&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
      reveal=content.animate([{opacity:0,clipPath:`inset(0 0 0 ${next-previous}px round 24px)`},{opacity:1,clipPath:'inset(0 0 0 0 round 24px)'}],{duration:280,easing:'cubic-bezier(.2,.7,.2,1)'});
  };
  const resizeAccount=new ResizeObserver(measureAccount);resizeAccount.observe(content);
  requestAnimationFrame(()=>{if(content.isConnected)measureAccount()});

  function loading(){
    return el('div',{class:'account account-placeholder',role:'status','aria-busy':'true','aria-label':'Checking account…'},el('span',{class:'spinner','aria-hidden':'true'}));
  }
  function signedIn(a){
    const label=a.name||'Your account';
    const trigger=el('button',{type:'button',class:'account','aria-label':`Account: ${label}`},
      avatar(a),el('span',{class:'account-label',text:label}),verificationBadge(a.verified),icon('chevron'));
    const signOut=()=>busy(trigger,'Signing out…',onSignOut);
    accountMenu=menu({trigger,className:'account-menu',items:()=>[
      {type:'profile',title:label,detail:a.email,badge:verificationBadge(a.verified)},
      {type:'separator'},
      ...menuItems(),
      onSignOut&&{type:'separator'},
      onSignOut&&{label:'Sign out',icon:'logout',danger:true,onSelect:signOut},
    ]});
    return accountMenu.node;
  }
  // Measured right away when the slot changes; the observer covers later changes (sign-out label, viewport).
  function setAccount(a){accountMenu?.close();accountMenu=null;content.replaceChildren(a?signedIn(a):loading());if(content.isConnected)measureAccount()}
  setAccount(account);

  const blur=el('div',{class:'header-blur','aria-hidden':'true'});
  const node=el('header',{class:'site-header site-header-scope'},blur,
    el('a',{class:'brand',href:brand.href||'#','aria-label':`${brand.name} home`},
      el('img',{class:'logo-light',src:brand.logoLight,width:36,height:36,alt:''}),
      el('img',{class:'logo-dark',src:brand.logoDark,width:36,height:36,alt:''}),
      el('span',{class:'brand-name',text:brand.name})),
    nav,
    el('div',{class:'header-account'},...extras,shell));

  // Paint the backdrop from scroll position, as Send does, so content never shows behind the controls.
  let previous=-1;
  const paint=()=>{
    const opacity=Math.round(Math.min(1,Math.max(0,scrollY)/40)*100)/100;
    if(opacity!==previous){previous=opacity;node.style.setProperty('--header-blur-opacity',String(opacity))}
  };
  addEventListener('scroll',paint,{passive:true});paint();
  // Pages read the header height to place sticky toolbars below it.
  const measure=()=>document.documentElement.style.setProperty('--header-height',node.offsetHeight+'px');
  const resizeHeader=new ResizeObserver(measure);resizeHeader.observe(node);

  // One pill slides to the active tab, like the app's tab bar.
  const place=()=>{
    const current=navItems.querySelector('.nav-active');
    if(!current){pill.style.opacity='0';return}
    const animate=pill.style.opacity==='1';
    if(!animate)pill.style.transition='none';
    pill.style.width=current.offsetWidth+'px';pill.style.transform=`translateX(${current.offsetLeft}px)`;pill.style.opacity='1';
    if(!animate){void pill.offsetWidth;pill.style.transition=''}
    current.scrollIntoView({block:'nearest',inline:'nearest'});
  };
  const resizeNav=new ResizeObserver(place);resizeNav.observe(nav);
  const draw=()=>{
    navItems.replaceChildren(...items.map(item=>el('a',{href:item.href,class:item.id===active?'nav-active':null,'aria-current':item.id===active?'page':null},
      typeof item.icon==='string'?icon(item.icon):item.icon,item.label)));
    place();
  };
  draw();
  return{
    node,
    setActive(id){active=id;draw()},
    setAccount,
    close:()=>accountMenu?.close(),
    destroy(){removeEventListener('scroll',paint);resizeHeader.disconnect();resizeNav.disconnect();resizeAccount.disconnect();reveal?.cancel();accountMenu?.close()},
  };
}
