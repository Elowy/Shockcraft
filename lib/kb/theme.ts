// Megjelenés: világos / sötét / rendszer szerint, a tervezővel közös `shockcraft-theme` kulccsal.
// A „Rendszer” törli a kulcsot – ez kompatibilis a tervező (plan-editor.tsx) és a megosztott nézet (share-viewer.tsx) logikájával.
export const THEME_KEY='shockcraft-theme';
export type ThemeChoice='light'|'dark'|'system';
export const THEME_EVENT='shockcraft-theme-change';

/** Az inline indítószkript (a layout első eleme): villanás nélkül állítja be a <html data-theme> értékét, és `js` osztályt tesz a <html>-re
 * (a csak JavaScripttel működő vezérlők JS nélkül rejtve maradnak). Statikus szöveg. A tárolóolvasás külön try-ban van: ha a böngésző
 * tiltja a localStorage-ot (privát mód, letiltott webhelyadat), a rendszer szerinti téma akkor is érvényesül. */
export const THEME_BOOT_SCRIPT=`(function(){var h=document.documentElement,t=null;try{h.classList.add('js')}catch(e){}try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}try{var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;h.dataset.theme=d?'dark':'light'}catch(e){}})();`;

export function readTheme():ThemeChoice{try{const v=localStorage.getItem(THEME_KEY);return v==='dark'||v==='light'?v:'system'}catch{return 'system'}}
export const systemDark=()=>{try{return window.matchMedia('(prefers-color-scheme: dark)').matches}catch{return false}};
export function applyTheme(choice:ThemeChoice){const dark=choice==='system'?systemDark():choice==='dark';document.documentElement.dataset.theme=dark?'dark':'light';return dark}
export function writeTheme(choice:ThemeChoice){
 try{if(choice==='system')localStorage.removeItem(THEME_KEY);else localStorage.setItem(THEME_KEY,choice)}catch{}
 applyTheme(choice);
 try{window.dispatchEvent(new Event(THEME_EVENT))}catch{}
}
