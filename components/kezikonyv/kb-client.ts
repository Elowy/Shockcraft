'use client';
// Közös kliensoldali segédek a kézikönyv szigeteinek: tároló-hook, értesítés (toast), téma-hook.
import {useSyncExternalStore} from 'react';
import type {Store} from '@/lib/kb/storage';
import {THEME_EVENT,readTheme,systemDark,type ThemeChoice} from '@/lib/kb/theme';

/** Böngészőtároló a React-ben: SSR-en és hidratáláskor üres, utána a tárolt lista (nincs setState effectben). */
export const useKbStore=<T,>(store:Store<T>)=>useSyncExternalStore(store.subscribe,store.get,()=>store.serverSnapshot);

// ---- Értesítés (egy élő régió, „Visszavonás” gombbal)
export type Toast={id:number;text:string;action?:{label:string;run:()=>void}};
let current:Toast|null=null;let seq=0;const toastListeners=new Set<()=>void>();
const emitToast=()=>{for(const fn of [...toastListeners])fn()};
export function showToast(text:string,action?:Toast['action']){current={id:++seq,text,action};emitToast()}
export function hideToast(id?:number){if(!current||id!==undefined&&current.id!==id)return;current=null;emitToast()}
const subscribeToast=(fn:()=>void)=>{toastListeners.add(fn);return ()=>{toastListeners.delete(fn)}};
export const useToast=()=>useSyncExternalStore(subscribeToast,()=>current,()=>null);

// ---- Téma (a <html data-theme> és a shockcraft-theme kulcs)
function subscribeTheme(fn:()=>void){
 window.addEventListener(THEME_EVENT,fn);window.addEventListener('storage',fn);
 let mq:MediaQueryList|null=null;try{mq=window.matchMedia('(prefers-color-scheme: dark)');mq.addEventListener('change',fn)}catch{}
 return ()=>{window.removeEventListener(THEME_EVENT,fn);window.removeEventListener('storage',fn);mq?.removeEventListener('change',fn)};
}
export const useThemeChoice=()=>useSyncExternalStore<ThemeChoice>(subscribeTheme,readTheme,()=>'system');
export const useDarkTheme=()=>useSyncExternalStore(subscribeTheme,()=>{const c=readTheme();return c==='system'?systemDark():c==='dark'},()=>false);
