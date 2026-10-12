// A Sémák gyűjtőoldala (/tudastar/semak – docs/tudastar-terv.md 2.4 „A /tudastar/semak gyűjtőoldal”): tartalomjegyzékes összefoglaló,
// saját canonicallal; a részletoldalak a kanonikusak. Szakaszai a kategóriák (Világítási kapcsolások és dugaljak, Földelési
// rendszerek), kártyánként mini-ábra (a cikk első netlistás ábrájának Bekötés nézete), a „Röviden” szöveg és mélylink, a végén a
// kapcsolódó kalkulátorok. A felső, nem zárható veszély-doboz a figyelmeztetés-könyvtárból (lib/kb/safety.ts `bekotes`).
// Szerverkomponens, adatvezérelt (a route a regiszterből adja az adatot; a tests/kb-semak.ts nem közzétett mintán rendereli).
import {ShieldAlert} from 'lucide-react';
import {inlinePlain} from '@/lib/kb/content/inline';
import type {KbCategory} from '@/lib/kb/content/categories';
import type {KbBody,KbMeta} from '@/lib/kb/content/types';
import {CALC_HUB,calcPath} from '@/lib/kb/categories';
import {SAFETY} from '@/lib/kb/safety';
import {BekotesSvg} from '../diagram/bekotes';
import type {DiagramSource} from '../diagram/diagram-figure';
import {buildScene} from '../diagram/scene';

export type SemakItem={meta:KbMeta;body:KbBody;href:string;listBadge:string;diagrams:Readonly<Record<string,readonly DiagramSource[]>>};
export type SemakCalc={slug:string;title:string;short:string};

/** Egy séma kártyája: mini-ábra (ha van közzétett netlistás ábrája), a „Röviden” (vagy az összefoglaló), mélylink. */
export function SemakCard({item}:{item:SemakItem}){
 const {meta,body}=item,first=Object.values(item.diagrams)[0]?.[0];
 const rovid=body.blocks.find(b=>b.t==='rovid');
 const scene=first?buildScene(first.netlist,first.layout):null;
 return <article className="kk-semak-card" aria-labelledby={'sema-'+meta.id}>
  {scene&&<div className="kk-semak-mini" aria-hidden="true"><BekotesSvg scene={scene} uid={'mini-'+meta.id} title={meta.title}/></div>}
  <h3 id={'sema-'+meta.id}><a href={item.href}>{meta.title}</a></h3>
  <p>{rovid&&rovid.t==='rovid'?inlinePlain(rovid.text):meta.summary}</p>
  <p className="kk-semak-meta"><span className="kk-badge">{item.listBadge}</span> <a href={item.href}>Bekötési rajz, működés és vezetéktábla</a></p>
 </article>;
}

export function SemakIndex({categories,items,calcs}:{categories:readonly KbCategory[];items:readonly SemakItem[];calcs:readonly SemakCalc[]}){
 const bekotes=SAFETY.bekotes;
 return <>
  <aside className="kk-callout kk-callout-danger" role="note" aria-label={bekotes.title}><ShieldAlert aria-hidden="true"/><div><p><strong>{bekotes.title}:</strong> {bekotes.text}</p></div></aside>
  <nav className="kk-toc-inline-static" aria-label="A Sémák tartalma"><ol>{categories.map(c=><li key={c.id}><a href={'#'+c.id}>{c.label}</a></li>)}{!!calcs.length&&<li><a href="#szamitasok">Számítások</a></li>}</ol></nav>
  {categories.map(c=>{const list=items.filter(i=>i.meta.category===c.id);return list.length?<section key={c.id} className="kk-category" id={c.id} aria-labelledby={'kat-'+c.id}>
   <h2 id={'kat-'+c.id}>{c.label}</h2><p className="kk-muted">{c.description}</p>
   <div className="kk-semak-cards">{list.map(i=><SemakCard key={i.meta.id} item={i}/>)}</div>
  </section>:null})}
  {!!calcs.length&&<section className="kk-category" id="szamitasok" aria-labelledby="szamitasok-cim"><h2 id="szamitasok-cim">Számítások</h2>
   <ul className="kk-related-grid">{calcs.map(c=><li key={c.slug}><a href={calcPath(c.slug)}><b>{c.title}</b><small>{c.short}</small></a></li>)}</ul>
   <p className="kk-related-more"><a href={CALC_HUB}>Összes kalkulátor</a></p>
  </section>}
 </>;
}
