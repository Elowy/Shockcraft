'use client';
// Cikkoldal kliensszigete: Kedvenc (könyvjelző, aria-pressed, „Visszavonás”), Megosztás (Web Share, ha nincs: link másolása), Nyomtatás,
// és az olvasási előzmény: a cikk csak legalább 15 másodperc látható olvasás után kerül a „Legutóbbiak” közé (a puszta megnyitás nem ír),
// és csak ha a felhasználó a Menüben nem kapcsolta ki. Minden adat csak a böngészőben (lib/kb/storage.ts).
import {useEffect,useState} from 'react';
import {Printer,Share2,Star} from 'lucide-react';
import {addBookmark,addRecent,bookmarkStore,historyOn,isBookmarked,prefStore,removeBookmark,type KbEntry} from '@/lib/kb/storage';
import {showToast,useKbStore} from '../kb-client';

const READ_MS=15000;

export function ArticleActions({id,title,href}:{id:string;title:string;href:string}){
 const favs=useKbStore(bookmarkStore),fav=isBookmarked(favs,'article',id);
 const [printed,setPrinted]=useState<string|null>(null);
 const entry=():KbEntry=>({type:'article',id,href,title,at:Date.now()});
 useEffect(()=>{
  // Olvasási előzmény: 15 s látható idő után (rejtett lapon az óra áll).
  let left=READ_MS,start=document.visibilityState==='visible'?Date.now():0,timer:ReturnType<typeof setTimeout>|null=null;
  const fire=()=>{if(historyOn(prefStore.get()))addRecent({type:'article',id,href,title,at:Date.now()})};
  const arm=()=>{if(timer===null&&left>0){start=Date.now();timer=setTimeout(()=>{left=0;timer=null;fire()},left)}};
  const pause=()=>{if(timer!==null){clearTimeout(timer);timer=null;left=Math.max(0,left-(Date.now()-start))}};
  const onVis=()=>{if(document.visibilityState==='visible')arm();else pause()};
  if(start)arm();
  document.addEventListener('visibilitychange',onVis);
  const before=()=>setPrinted(new Date().toLocaleString('hu-HU'));
  window.addEventListener('beforeprint',before);
  return ()=>{pause();document.removeEventListener('visibilitychange',onVis);window.removeEventListener('beforeprint',before)};
 },[id,href,title]);
 function toggleFav(){
  if(fav){removeBookmark('article',id);showToast('Eltávolítva a kedvencek közül.',{label:'Visszavonás',run:()=>addBookmark(entry())})}
  else{addBookmark(entry());showToast('Hozzáadva a kedvencekhez.',{label:'Visszavonás',run:()=>removeBookmark('article',id)})}
 }
 async function share(){
  const url=window.location.origin+href;
  try{if(typeof navigator.share==='function'){await navigator.share({title,url});return}}catch(e){if((e as Error)?.name==='AbortError')return}
  try{await navigator.clipboard.writeText(url);showToast('A link a vágólapra került.')}catch{showToast('A böngésző nem engedte a másolást.')}
 }
 return <>
  <div className="kk-actions" role="group" aria-label="Műveletek">
   <button type="button" className={'kk-button'+(fav?' on':'')} aria-pressed={fav} onClick={toggleFav}><Star aria-hidden="true"/> Kedvenc</button>
   <button type="button" className="kk-button" onClick={share}><Share2 aria-hidden="true"/> Megosztás</button>
   <button type="button" className="kk-button" onClick={()=>window.print()}><Printer aria-hidden="true"/> Nyomtatás</button>
  </div>
  {printed&&<p className="kk-print-only">Nyomtatva: {printed}</p>}
 </>;
}
