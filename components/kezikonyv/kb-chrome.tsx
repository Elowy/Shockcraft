'use client';
// A kézikönyv kliensoldali „kerete”: kereső, menü, könyvjelzők (oldalfiókok), téma, gyorsbillentyűk és értesítés.
// A fejlécek gombjai egyszerű linkek/gombok `data-kb-open` jelöléssel (JS nélkül is működő tartalékcéllal); ez a sziget egyszer, oldalanként fut.
// Bezáráskor a fókusz a megnyitó gombra tér vissza (WCAG 2.4.3); a „/” gyorsbillentyű a Menüben kikapcsolható (WCAG 2.1.4).
import {useEffect,useId,useMemo,useRef,useState} from 'react';
import {Dialog} from 'radix-ui';
import {ArrowUpRight,Bookmark,Clock,Search,Trash2,X} from 'lucide-react';
import {search,suggest,type SearchItem} from '@/lib/kb/search';
import {addSearch,bookmarkStore,clearAll,prefStore,recentStore,removeBookmark,removeRecent,searchStore,setSlashShortcut,slashShortcutOn,type KbEntry} from '@/lib/kb/storage';
import {applyTheme,readTheme,writeTheme,type ThemeChoice} from '@/lib/kb/theme';
import {HOME,KB_NAME} from '@/lib/kb/categories';
import {hideToast,useKbStore,useThemeChoice,useToast} from './kb-client';

type Panel='search'|'menu'|'bookmarks'|null;
export type ChromeLink={label:string;href:string};
/** „Gyakori” keresések: csak közzétett (linkkel rendelkező) kalkulátorra mutató javaslat jelenik meg. [kalkulátor, keresőszó] */
const QUICK:readonly [string,string][]=[['feszultseges','Feszültségesés'],['ohm-torveny','Ohm-törvény'],['teljesitmeny','Teljesítmény'],['fazisterheles','Fázisterhelés'],['kismegszakito','Kismegszakító'],['mertekegyseg-atvalto','AWG'],['fogyasztas-koltseg','Fogyasztás'],['aram-teljesitmenybol','Áram']];

function Sheet({open,onOpenChange,title,side,children,description,onCloseAutoFocus}:{open:boolean;onOpenChange:(o:boolean)=>void;title:string;side:'right'|'top';description?:string;children:React.ReactNode;onCloseAutoFocus:(e:Event)=>void}){
 return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal>
  <Dialog.Overlay className="kk-layer kk-overlay"/>
  <Dialog.Content className={'kk-layer kk-sheet kk-sheet-'+side} onCloseAutoFocus={onCloseAutoFocus}>
   <div className="kk-sheet-head"><Dialog.Title>{title}</Dialog.Title><Dialog.Close className="kk-icon-btn" aria-label="Bezárás"><X aria-hidden="true"/></Dialog.Close></div>
   {description?<Dialog.Description className="kk-sheet-desc">{description}</Dialog.Description>:<Dialog.Description className="sr-only">{title}</Dialog.Description>}
   {children}
  </Dialog.Content>
 </Dialog.Portal></Dialog.Root>;
}

function SearchPanel({items,onClose}:{items:readonly SearchItem[];onClose:()=>void}){
 const [q,setQ]=useState(''),[active,setActive]=useState(0),listId=useId();
 const recent=useKbStore(searchStore);
 const hits=useMemo(()=>q.trim()?search(items,q,24):[],[items,q]);
 const hint=useMemo(()=>q.trim()&&!hits.length?suggest(items,q):null,[items,q,hits.length]);
 const quick=useMemo(()=>QUICK.filter(([slug])=>items.some(i=>i.id===slug&&i.href)).map(([,label])=>label),[items]);
 const go=(item:SearchItem)=>{if(!item.href)return;addSearch(q);onClose();window.location.href=item.href};
 const optId=(i:number)=>listId+'-o'+i;
 function onKey(e:React.KeyboardEvent){
  if(e.key==='ArrowDown'){e.preventDefault();setActive(a=>Math.min(hits.length-1,a+1))}
  else if(e.key==='ArrowUp'){e.preventDefault();setActive(a=>Math.max(0,a-1))}
  else if(e.key==='Enter'){const h=hits[active];if(h){e.preventDefault();go(h.item)}}
 }
 return <div className="kk-search">
  <label className="kk-search-box"><Search aria-hidden="true"/><span className="sr-only">Keresés</span>
   <input autoFocus type="search" role="combobox" aria-expanded={hits.length>0} aria-controls={listId} aria-autocomplete="list" aria-activedescendant={hits[active]?optId(active):undefined} placeholder="Keresés: Ohm-törvény, fázisterhelés, AWG…" value={q} onChange={e=>{setQ(e.target.value);setActive(0)}} onKeyDown={onKey} autoComplete="off" spellCheck={false}/>
  </label>
  {!q.trim()&&<div className="kk-search-empty">
   {!!recent.length&&<><h3>Legutóbbi keresések</h3><div className="kk-chips">{recent.map(s=><button type="button" key={s} onClick={()=>setQ(s)}><Clock aria-hidden="true"/>{s}</button>)}</div></>}
   {!!quick.length&&<><h3>Gyakori</h3><div className="kk-chips">{quick.map(s=><button type="button" key={s} onClick={()=>setQ(s)}>{s}</button>)}</div></>}
  </div>}
  <div role="listbox" id={listId} aria-label="Találatok" className="kk-search-results">
   {!!hits.length&&<div role="presentation" className="kk-search-group">Kalkulátorok</div>}
   {hits.map((h,i)=><div key={h.item.id} id={optId(i)} role="option" aria-selected={i===active} aria-disabled={!h.item.href} className={'kk-search-hit'+(i===active?' active':'')+(h.item.href?'':' soon')} onMouseEnter={()=>setActive(i)} onClick={()=>go(h.item)}>
    <b>{h.item.title}</b><small>{h.item.href?h.item.summary:h.item.note}</small>
   </div>)}
  </div>
  {!!q.trim()&&!hits.length&&<div className="kk-search-none" role="status">
   <p>Nincs találat erre: „{q.trim()}”.</p>
   {hint&&<p>Erre gondoltál? <button type="button" className="kk-link" onClick={()=>setQ(hint.title)}>{hint.title}</button></p>}
   <p>Hiányzik egy téma? <a href={'mailto:info@luiz-tech.hu?subject='+encodeURIComponent(KB_NAME+' – hiányzó téma: '+q.trim())}>Írd meg nekünk</a>.</p>
  </div>}
 </div>;
}

function EntryList({items,empty,onRemove,removeLabel}:{items:readonly KbEntry[];empty:string;onRemove?:(e:KbEntry)=>void;removeLabel?:string}){
 if(!items.length)return <p className="kk-muted">{empty}</p>;
 return <ul className="kk-entry-list">{items.map(e=><li key={e.type+e.id}><a href={e.href}><b>{e.title}</b>{e.detail&&<small>{e.detail}</small>}</a>{onRemove&&<button type="button" className="kk-icon-btn" aria-label={(removeLabel??'Törlés')+': '+e.title} onClick={()=>onRemove(e)}><X aria-hidden="true"/></button>}</li>)}</ul>;
}

function BookmarksPanel(){
 const favs=useKbStore(bookmarkStore),recent=useKbStore(recentStore),[confirm,setConfirm]=useState(false);
 return <div className="kk-sheet-body">
  <section aria-labelledby="kk-favs"><h3 id="kk-favs"><Bookmark aria-hidden="true"/> Kedvencek</h3><EntryList items={favs} empty="Még nincs kedvenced. A kalkulátoroknál a csillaggal jelölheted meg." onRemove={e=>removeBookmark(e.type,e.id)} removeLabel="Eltávolítás a kedvencek közül"/></section>
  <section aria-labelledby="kk-recent"><h3 id="kk-recent"><Clock aria-hidden="true"/> Legutóbbiak</h3><EntryList items={recent} empty="Itt jelennek meg a legutóbb használt kalkulátorok (a bemenet módosítása után)." onRemove={e=>removeRecent(e.type,e.id)} removeLabel="Törlés az előzményekből"/></section>
  <p className="kk-muted">Csak ebben a böngészőben tároljuk; fiók nem kell. A böngészőadatok törlésekor elvesznek.{(bookmarkStore.blocked()||recentStore.blocked())&&' A böngésző most nem engedi a mentést: a lista csak ennek a lapnak a bezárásáig marad meg.'}</p>
  {confirm?<div className="kk-confirm" role="group" aria-label="Törlés megerősítése"><span>Biztosan törlöd a kedvenceket, az előzményeket és a kereséseket?</span><button type="button" className="kk-button danger" onClick={()=>{clearAll();setConfirm(false)}}><Trash2 aria-hidden="true"/> Igen, törlöm</button><button type="button" className="kk-button" onClick={()=>setConfirm(false)}>Mégse</button></div>
   :<button type="button" className="kk-button" onClick={()=>setConfirm(true)} disabled={!favs.length&&!recent.length}><Trash2 aria-hidden="true"/> Minden {KB_NAME}-adat törlése</button>}
 </div>;
}

function ThemeChoiceGroup(){
 const choice=useThemeChoice();
 const opts:[ThemeChoice,string][]=[['light','Világos'],['dark','Sötét'],['system','Rendszer szerint']];
 return <fieldset className="kk-theme-choice"><legend>Megjelenés</legend>{opts.map(([v,l])=><label key={v}><input type="radio" name="kk-theme" value={v} checked={choice===v} onChange={()=>writeTheme(v)}/>{l}</label>)}</fieldset>;
}

function SlashToggle(){
 const off=useKbStore(prefStore),on=slashShortcutOn(off);
 return <label className="kk-check"><input type="checkbox" checked={on} onChange={e=>setSlashShortcut(e.target.checked)}/><span>A „/” billentyű megnyitja a keresést <small>(a Ctrl+K mindig működik)</small></span></label>;
}

function MenuPanel({sections,onBookmarks}:{sections:readonly ChromeLink[];onBookmarks:()=>void}){
 return <nav className="kk-sheet-body kk-menu" aria-label="Menü">
  <ul>{sections.map(s=><li key={s.href}><a href={s.href}>{s.label}</a></li>)}<li><button type="button" className="kk-link" onClick={onBookmarks}>Kedvencek és előzmények</button></li></ul>
  <ThemeChoiceGroup/>
  <SlashToggle/>
  <ul><li><a href={'mailto:info@luiz-tech.hu?subject='+encodeURIComponent(KB_NAME+' – hibajelzés')}>Hibát találtál?</a></li></ul>
  <ul><li><a href={HOME}>Villanyrajz főoldal</a></li><li><a href="/tervezo">Tervező <small>(ingyenes fiókkal)</small> <ArrowUpRight aria-hidden="true"/></a></li></ul>
  <ul className="kk-menu-legal"><li><a href="/aszf">ÁSZF</a></li><li><a href="/adatvedelem">Adatvédelem</a></li><li><a href="/sutik">Sütik</a></li><li><button type="button" className="kk-link" onClick={()=>window.dispatchEvent(new Event('shockcraft-cookie-settings'))}>Sütibeállítások</button></li></ul>
 </nav>;
}

function ToastRegion(){
 const t=useToast(),[hold,setHold]=useState(false);
 // 6 s után eltűnik, de amíg az egér vagy a fókusz rajta van, nem (WCAG 2.2.1).
 useEffect(()=>{if(!t||hold)return;const h=setTimeout(()=>hideToast(t.id),6000);return ()=>clearTimeout(h)},[t,hold]);
 return <div className="kk-toast-region" role="status" aria-live="polite" onMouseEnter={()=>setHold(true)} onMouseLeave={()=>setHold(false)} onFocus={()=>setHold(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null))setHold(false)}}>{t&&<div className="kk-toast"><span>{t.text}</span>{t.action&&<button type="button" onClick={()=>{t.action!.run();hideToast(t.id)}}>{t.action.label}</button>}<button type="button" className="kk-icon-btn" aria-label="Értesítés bezárása" onClick={()=>hideToast(t.id)}><X aria-hidden="true"/></button></div>}</div>;
}

export function KbChrome({items,sections}:{items:readonly SearchItem[];sections:readonly ChromeLink[]}){
 const [panel,setPanel]=useState<Panel>(null);
 /** A fiókot megnyitó elem: bezáráskor ide tér vissza a fókusz (a Radix csak a saját Trigger-ére tenné, ilyen itt nincs). */
 const opener=useRef<HTMLElement|null>(null);
 const restoreFocus=(e:Event)=>{const o=opener.current;if(o&&o.isConnected){e.preventDefault();o.focus()}};
 useEffect(()=>{
  const open=(p:Panel,from:Element|null)=>{if(from instanceof HTMLElement&&from!==document.body&&!from.closest('.kk-layer'))opener.current=from;setPanel(p)};
  const onClick=(e:MouseEvent)=>{
   const el=(e.target as HTMLElement|null)?.closest<HTMLElement>('[data-kb-open]');if(!el)return;
   const p=el.dataset.kbOpen as Panel;if(p==='search'||p==='menu'||p==='bookmarks'){e.preventDefault();open(p,el)}
  };
  const typing=(t:EventTarget|null)=>t instanceof HTMLElement&&(t.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(t.tagName));
  const onKey=(e:KeyboardEvent)=>{
   if((e.key==='k'||e.key==='K')&&(e.ctrlKey||e.metaKey)){e.preventDefault();open('search',document.activeElement)}
   else if(e.key==='/'&&slashShortcutOn(prefStore.get())&&!typing(e.target)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();open('search',document.activeElement)}
  };
  // „Rendszer szerint” módban a rendszerbeállítás változását követjük (a <html data-theme> külső állapot).
  let mq:MediaQueryList|null=null;const onScheme=()=>{if(readTheme()==='system')applyTheme('system')};
  try{mq=window.matchMedia('(prefers-color-scheme: dark)');mq.addEventListener('change',onScheme)}catch{}
  document.addEventListener('click',onClick);document.addEventListener('keydown',onKey);
  return ()=>{document.removeEventListener('click',onClick);document.removeEventListener('keydown',onKey);mq?.removeEventListener('change',onScheme)};
 },[]);
 const set=(p:Panel)=>(o:boolean)=>setPanel(o?p:null);
 return <>
  <Sheet open={panel==='search'} onOpenChange={set('search')} title="Keresés" side="top" onCloseAutoFocus={restoreFocus}><SearchPanel items={items} onClose={()=>setPanel(null)}/></Sheet>
  <Sheet open={panel==='menu'} onOpenChange={set('menu')} title="Menü" side="right" onCloseAutoFocus={restoreFocus}><MenuPanel sections={sections} onBookmarks={()=>setPanel('bookmarks')}/></Sheet>
  <Sheet open={panel==='bookmarks'} onOpenChange={set('bookmarks')} title="Kedvencek és előzmények" side="right" onCloseAutoFocus={restoreFocus}><BookmarksPanel/></Sheet>
  <ToastRegion/>
 </>;
}
