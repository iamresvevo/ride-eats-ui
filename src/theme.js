// Port of Send's lib/theme.js: System, Light or Dark, resolved onto <html data-theme>.
const KEY='rideEatsUI.theme';
const system=matchMedia('(prefers-color-scheme: dark)');

export const THEMES=[{value:'system',label:'System'},{value:'light',label:'Light'},{value:'dark',label:'Dark'}];

/** 'system' | 'light' | 'dark' */
export function getTheme(){
  let saved=null;try{saved=localStorage.getItem(KEY)}catch{}
  return saved==='light'||saved==='dark'?saved:'system';
}

/** Puts the resolved theme on <html>, where the stylesheet reads it. */
export function applyTheme(theme=getTheme()){
  document.documentElement.dataset.theme=theme==='system'?(system.matches?'dark':'light'):theme;
}

export function setTheme(theme){
  try{if(theme==='system')localStorage.removeItem(KEY);else localStorage.setItem(KEY,theme)}catch{}
  applyTheme(theme);
}

// Follow the system while no explicit choice is saved.
system.addEventListener('change',()=>applyTheme());
