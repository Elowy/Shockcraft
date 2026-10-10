// Megjelenés: világos / sötét / rendszer szerint, a tervezővel közös `shockcraft-theme` kulccsal.
// A „Rendszer” törli a kulcsot – ez kompatibilis a tervező (plan-editor.tsx) és a megosztott nézet (share-viewer.tsx) logikájával.
export const THEME_KEY='shockcraft-theme';
export type ThemeChoice='light'|'dark'|'system';
export const THEME_EVENT='shockcraft-theme-change';

/** Az inline indítószkript (a layout első eleme): villanás nélkül állítja be a <html data-theme> értékét. Statikus szöveg. */
export const THEME_BOOT_SCRIPT=`(function(){try{var t=localStorage.getItem('${THEME_KEY}');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})();`;

export function readTheme():ThemeChoice{try{const v=localStorage.getItem(THEME_KEY);return v==='dark'||v==='light'?v:'system'}catch{return 'system'}}
export const systemDark=()=>{try{return window.matchMedia('(prefers-color-scheme: dark)').matches}catch{return false}};
export function applyTheme(choice:ThemeChoice){const dark=choice==='system'?systemDark():choice==='dark';document.documentElement.dataset.theme=dark?'dark':'light';return dark}
export function writeTheme(choice:ThemeChoice){
 try{if(choice==='system')localStorage.removeItem(THEME_KEY);else localStorage.setItem(THEME_KEY,choice)}catch{}
 applyTheme(choice);
 try{window.dispatchEvent(new Event(THEME_EVENT))}catch{}
}
