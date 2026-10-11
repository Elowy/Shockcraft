'use client';
// „Folytasd” a Tudástár kezdőlapján: a legutóbbi cikkek és kalkulátorok, valamint a kedvencek a böngészőből (lib/kb/storage.ts).
// Csak hidratálás után és csak nem üres listával jelenik meg; csak közzétett célra mutató tétel látszik (a szerver adja a listát).
import {Clock,Star} from 'lucide-react';
import {bookmarkStore,recentStore,type KbEntry} from '@/lib/kb/storage';
import {useKbStore} from './kb-client';

function Chips({items}:{items:readonly KbEntry[]}){
 return <ul className="kk-chiplist">{items.map(e=><li key={e.type+e.id}><a href={e.href}><b>{e.title}</b>{e.detail&&<small>{e.detail}</small>}</a></li>)}</ul>;
}
export function KbContinue({valid}:{valid:readonly string[]}){
 const ok=(e:KbEntry)=>valid.includes(e.type+':'+e.id);
 const recent=useKbStore(recentStore).filter(ok).slice(0,6),favs=useKbStore(bookmarkStore).filter(ok).slice(0,8);
 if(!recent.length&&!favs.length)return null;
 return <section className="kk-continue" aria-labelledby="kk-continue-title">
  <h2 id="kk-continue-title">Folytasd</h2>
  {!!recent.length&&<><h3><Clock aria-hidden="true"/> Legutóbbiak</h3><Chips items={recent}/></>}
  {!!favs.length&&<><h3><Star aria-hidden="true"/> Kedvencek</h3><Chips items={favs}/></>}
 </section>;
}
