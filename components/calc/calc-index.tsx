'use client';
// A /kalkulatorok index kliensszigete: ékezetfüggetlen kereső szinonimákkal, Kedvencek és Legutóbbiak (csak hidratálás után, üresen rejtve),
// kategóriakártyák. JS nélkül a teljes kategorizált lista SSR-ben látszik.
import {useMemo,useState} from 'react';
import {BadgeCheck,Clock,Search,Star} from 'lucide-react';
import type {CalcMeta} from '@/lib/calc/registry';
import {search,type SearchItem} from '@/lib/kb/search';
import {bookmarkStore,recentStore,type KbEntry} from '@/lib/kb/storage';
import {useKbStore} from '@/components/kezikonyv/kb-client';

type Category={id:string;label:string;description:string};

function Card({m}:{m:CalcMeta}){
 if(!m.href)return <div className="kk-card soon" aria-disabled="true"><b>{m.title}</b><p>{m.short}</p><span className="kk-badge soon">{m.note}</span>{m.detail&&<small>{m.detail}</small>}</div>;
 return <a className={'kk-card'+(m.status==='tervezet'?' draft':'')} href={m.href}><b>{m.title}</b><p>{m.short}</p><span className={'kk-badge'+(m.status==='tervezet'?' draft':'')}>{m.status==='kozzeteve'&&<BadgeCheck aria-hidden="true"/>}{m.note}</span></a>;
}
function Shortcuts({title,icon,items,id}:{title:string;icon:React.ReactNode;items:readonly KbEntry[];id:string}){
 if(!items.length)return null;
 return <section className="kk-shortcuts" aria-labelledby={id}><h2 id={id}>{icon}{title}</h2><ul>{items.slice(0,8).map(e=><li key={e.type+e.id}><a href={e.href}><b>{e.title}</b>{e.detail&&<small>{e.detail}</small>}</a></li>)}</ul></section>;
}

export function CalcIndex({metas,categories}:{metas:readonly CalcMeta[];categories:readonly Category[]}){
 const [q,setQ]=useState('');
 const favs=useKbStore(bookmarkStore).filter(e=>e.type==='calc'&&metas.some(m=>m.slug===e.id&&m.href));
 const recent=useKbStore(recentStore).filter(e=>e.type==='calc'&&metas.some(m=>m.slug===e.id&&m.href));
 const items=useMemo<SearchItem[]>(()=>metas.map(m=>({id:m.slug,title:m.title,href:m.href,group:'Kalkulátorok',keywords:m.keywords,synonyms:m.synonyms,summary:m.short,note:m.note})),[metas]);
 const hits=useMemo(()=>q.trim()?search(items,q,40):null,[items,q]);
 const bySlug=useMemo(()=>new Map(metas.map(m=>[m.slug,m])),[metas]);
 return <>
  <div className="kk-index-search" role="search">
   <label htmlFor="kereses"><Search aria-hidden="true"/><span className="sr-only">Kalkulátor keresése</span></label>
   <input id="kereses" type="search" placeholder="Keresés: Ohm-törvény, teljesítmény, fogyasztás, AWG…" value={q} onChange={e=>setQ(e.target.value)} autoComplete="off" spellCheck={false}/>
  </div>
  {hits?<section aria-label="Találatok" className="kk-category">
   <p role="status" className="kk-muted">{hits.length?hits.length+' találat':'Nincs találat. Próbáld másképp (pl. „esés”, „amper”, „kábel”).'}</p>
   <div className="kk-cards">{hits.map(h=><Card key={h.item.id} m={bySlug.get(h.item.id)!}/>)}</div>
  </section>:<>
   <div id="kedvencek" className="kk-shortcut-grid">
    <Shortcuts id="kk-fav-title" title="Kedvencek" icon={<Star aria-hidden="true"/>} items={favs}/>
    <Shortcuts id="kk-recent-title" title="Legutóbbiak" icon={<Clock aria-hidden="true"/>} items={recent}/>
   </div>
   {categories.map(c=>{const list=metas.filter(m=>m.category===c.id);if(!list.length)return null;return <section key={c.id} className="kk-category" id={c.id} aria-labelledby={'kat-'+c.id}>
    <h2 id={'kat-'+c.id}>{c.label}</h2><p className="kk-muted">{c.description}</p>
    <div className="kk-cards">{list.map(m=><Card key={m.slug} m={m}/>)}</div>
   </section>})}
  </>}
 </>;
}
