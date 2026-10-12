// A Tudástár-cikk oldala (szerverkomponens; kliens-JS csak a műveleti sziget). Anatómia (docs/tudastar-terv.md 2.4, elméleti cikkre):
// morzsamenü, H1, ellenőrzési jelvény, műveletek, tartalomjegyzék, törzs (Röviden, R2-nél Figyelem-doboz, ábrák, képletek, kidolgozott
// példák, Gyakori tévedések), kapcsolódó kalkulátorok és cikkek, források („kiadás ellenőrzés alatt” jelöléssel), egy tervező-blokk,
// előző/következő, lábléc-meta (verzió, ujjlenyomat, változásnapló, hibajelzés). Az alapfigyelmeztetés a Shell láblécében áll.
import {BadgeCheck,ChevronLeft,ChevronRight,ClipboardCheck,FileWarning} from 'lucide-react';
import {bySlug,isPublished as calcPublished} from '@/lib/calc/registry';
import {CHANGE_LABELS,changesFor} from '@/lib/kb/content/changes';
import {articleHref,categoryArticles,categoryById,categoryHref,prevNext,relatedArticles,resolveLink,type KbReleaseInfo} from '@/lib/kb/content/registry';
import type {KbBody,KbMeta,KbSource} from '@/lib/kb/content/types';
import {CALC_HUB,KB_HOME,calcPath,sectionById} from '@/lib/kb/categories';
import {quizHref,templatesForArticle} from '@/lib/quiz/registry';
import {QUIZ_NOTICE} from '@/lib/quiz/topics';
import {AppBar} from '../shell';
import {PlannerCta} from '../planner-cta';
import {ReportLink} from '../report-link';
import type {DiagramSource} from '../diagram/diagram-figure';
import {ArticleActions} from './article-actions';
import {ArticleBlocks} from './blocks';

export const kbDate=(iso:string)=>new Date(iso+'T12:00:00Z').toLocaleDateString('hu-HU',{year:'numeric',month:'long',day:'numeric',timeZone:'Europe/Budapest'});
export const readingMinutes=(words:number)=>Math.max(1,Math.round(words/200));

/** A kiadás megjelenítése: „szabvány (kiadás) – pont”; ha a kiadás maga is zárójeles részt tartalmaz („2022 (EN IEC 60445:2021)”,
 * „(EU) 2015/1428”), akkor zárójel helyett vesszővel kapcsolódik („MSZ EN IEC 60445, 2022 (EN IEC 60445:2021) – 6.2”), hogy ne legyen
 * kettős zárójel. Csak a megjelenítés változik, a forrásadat (és az ujjlenyomat) nem. */
export const editionText=(kiadas:string)=>/[()]/.test(kiadas)?', '+kiadas:' ('+kiadas+')';
/** Egy forrásmegjelölés: „szabvány (kiadás) – pont”; ha a kiadás vagy a pontszám ellenőrzésre vár, visszafogott jelöléssel. */
export function SourceItem({s}:{s:KbSource}){
 return <li>
  <span className="kk-source-std">{s.standard}</span><span className="kk-source-ed">{editionText(s.kiadas)}</span> – <span className="kk-source-pt">{s.pont}</span>
  {s.check&&<> <span className="kk-check-pending" title="A kiadás vagy a pontszám a szakmai lektor ellenőrzésére vár.">kiadás ellenőrzés alatt</span></>}
 </li>;
}
export function SourcesSection({sources}:{sources:readonly KbSource[]}){
 const pending=sources.some(s=>s.check);
 return <section id="forrasok" className="kk-sources" aria-labelledby="forrasok-cim"><h2 id="forrasok-cim">Források</h2>
  <ul>{sources.map((s,i)=><SourceItem key={i} s={s}/>)}</ul>
  <p className="kk-muted">Szabványszöveget nem idézünk; a tényadatok saját megfogalmazásban, hivatkozással szerepelnek.{pending&&' A „kiadás ellenőrzés alatt” jelölésű hivatkozások kiadását vagy pontszámát a szakmai lektor még ellenőrzi.'}</p>
 </section>;
}
export function ChangesSection({meta}:{meta:KbMeta}){
 return <details className="kk-changes" id="valtozasok"><summary>Változásnapló</summary>
  <ul>{changesFor(meta).map((c,i)=><li key={i}><b>v{c.version}</b> · {kbDate(c.date)} · {CHANGE_LABELS[c.kind]}: {c.summary}</li>)}</ul>
 </details>;
}
export function ReviewLine({meta,info,draft}:{meta:KbMeta;info:KbReleaseInfo;draft:boolean}){
 return <p className="kk-review">{draft?<span className="kk-badge draft">Tervezet</span>:<a className="kk-badge" href={KB_HOME+'#ellenorzes'}><BadgeCheck aria-hidden="true"/>{info.badge}</a>}<span>v{meta.version} · {kbDate(info.record?.date??meta.updated)} · kb. {readingMinutes(meta.words)} perc olvasás</span></p>;
}
export function MetaLine({meta,info,draft,url}:{meta:KbMeta;info:KbReleaseInfo;draft:boolean;url:string}){
 const check=info.record?.kind==='lektoralt'?'Szakmai lektor: '+info.record.qualification:'Ellenőrzés: '+(draft?'folyamatban':'belső kettős ellenőrzés (szerzői vázlat és független szakmai ellenőrzés); szakmai lektorálásra vár');
 return <p className="kk-meta">Verzió: v{meta.version} · ujjlenyomat: {meta.fingerprint}{meta.figures?' · ábrák: '+meta.figures:''} · frissítve: {kbDate(meta.updated)} · {check}{meta.ai==='vázlat'?' · MI-segítséggel készült vázlatból, emberi szerkesztéssel':''} · <ReportLink kind="kb" id={meta.id} version={meta.version} fingerprint={meta.fingerprint} url={url}/></p>;
}

/** `diagrams`: a netlistás bekötési ábrák (R3 – csak közzétett cikknél, lib/kb/content/registry.ts diagramsOf). */
export function ArticleView({meta,body,info,preview,origin,glossary=false,diagrams}:{meta:KbMeta;body:KbBody;info:KbReleaseInfo;preview:boolean;origin:string|null;glossary?:boolean;diagrams?:Readonly<Record<string,readonly DiagramSource[]>>}){
 const draft=info.state!=='kozzeteve',cat=categoryById(meta.category),sec=sectionById(meta.section);
 const href=articleHref(meta),resolve=(id:string,anchor:string|null)=>resolveLink(id,anchor,preview);
 const siblings=categoryArticles(meta.category,preview),{prev,next}=prevNext(meta,preview),rel=relatedArticles(meta,preview);
 const calcs=meta.calculators.map(bySlug).filter((c):c is NonNullable<typeof c>=>!!c&&calcPublished(c));
 // „Teszteld magad” (terv 2.4/9.): csak ha a cikkhez van közzétett számolós sablon (lib/quiz/gate.ts).
 const quiz=templatesForArticle(meta.id,preview);
 const toc:[string,string][]=[...meta.anchors.map(a=>[a.id,a.title] as [string,string]),...(calcs.length||rel.items.length||quiz.length?[['kapcsolodo','Kapcsolódó'] as [string,string]]:[]),['forrasok','Források']];
 const back=cat?{href:categoryHref(cat),label:cat.label}:{href:sec.href,label:sec.label};
 return <>
  <AppBar title={glossary?meta.navTitle:sec.label} back={glossary?{href:sec.href,label:sec.label}:back} home={KB_HOME}/>
  <div className="kk-page kk-page-article">
   <aside className="kk-side" aria-label={cat?.label??sec.label}>
    <p className="kk-side-title">{cat?.label??sec.label}</p>
    <ul>{siblings.map(a=><li key={a.id}><a href={articleHref(a)} aria-current={a.id===meta.id?'page':undefined}>{a.navTitle}</a></li>)}</ul>
    <a className="kk-side-all" href={sec.href}>{sec.label}: összes cikk</a>
   </aside>
   <main id="tartalom" className="kk-main kk-article">
    <nav className="kk-crumbs" aria-label="Morzsamenü"><ol><li><a href={KB_HOME}>Tudástár</a></li><li><a href={sec.href}>{sec.label}</a></li>{cat&&<li><a href={categoryHref(cat)}>{cat.label}</a></li>}<li aria-current="page">{meta.navTitle}</li></ol></nav>
    {draft&&<p className="kk-preview-banner" role="note"><FileWarning aria-hidden="true"/> Tervezet – nem közzétett. Ez az oldal csak lektori előnézetben látszik ({info.reason}).</p>}
    <h1>{meta.title}</h1>
    <ReviewLine meta={meta} info={info} draft={draft}/>
    <ArticleActions id={meta.id} title={meta.title} href={href}/>
    {glossary?<nav className="kk-letters" aria-label="Betűk">{toc.map(([id,l])=><a key={id} href={'#'+id}>{l}</a>)}</nav>
     :<details className="kk-toc-inline"><summary>Tartalom</summary><ol>{toc.map(([id,l])=><li key={id}><a href={'#'+id}>{l}</a></li>)}</ol></details>}
    <ArticleBlocks blocks={body.blocks} ctx={{slug:meta.slug,resolve,...(diagrams?{diagrams}:{})}}/>
    {(!!calcs.length||!!rel.items.length||rel.pending>0||!!quiz.length)&&<section id="kapcsolodo" className="kk-related" aria-labelledby="kapcsolodo-cim">
     <h2 id="kapcsolodo-cim">Kapcsolódó</h2>
     {!!calcs.length&&<><h3>Kalkulátorok</h3><ul className="kk-related-grid">{calcs.map(c=><li key={c.slug}><a href={calcPath(c.slug)}><b>{c.title}</b><small>{c.short}</small></a></li>)}</ul>
      <p className="kk-related-more"><a href={CALC_HUB}>Összes kalkulátor</a></p></>}
     {!!quiz.length&&<div className="kk-selftest"><h3 id="teszteld-magad">Teszteld magad</h3>
      <p><a className="kk-button" href={quizHref({feladat:quiz.map(t=>t.id),hossz:5})}><ClipboardCheck aria-hidden="true"/> 5 számolós gyakorló feladat</a></p>
      <p className="kk-muted">{quiz.map(t=>t.title).join(', ')} – minden kérdés után magyarázattal és levezetéssel. {QUIZ_NOTICE}</p></div>}
     {!!rel.items.length&&<><h3>Cikkek</h3><ul className="kk-related-grid">{rel.items.map(a=><li key={a.id}><a href={articleHref(a)}><b>{a.title}</b><small>{a.summary}</small></a></li>)}</ul></>}
     {rel.pending>0&&<p className="kk-muted">További {rel.pending} kapcsolódó cikk hamarosan – szakmai lektorálás alatt.</p>}
    </section>}
    <SourcesSection sources={body.sources}/>
    <PlannerCta/>
    {(prev||next)&&<nav className="kk-prevnext" aria-label="Előző és következő cikk">
     {prev?<a href={articleHref(prev)} rel="prev"><ChevronLeft aria-hidden="true"/><span><small>Előző</small>{prev.navTitle}</span></a>:<span/>}
     {next?<a href={articleHref(next)} rel="next" className="next"><span><small>Következő</small>{next.navTitle}</span><ChevronRight aria-hidden="true"/></a>:<span/>}
    </nav>}
    <ChangesSection meta={meta}/>
    <MetaLine meta={meta} info={info} draft={draft} url={(origin??'')+href}/>
    <p className="kk-print-only">{(origin??'')+href} · v{meta.version} · ujjlenyomat: {meta.fingerprint} · {draft?'Tervezet':info.badge}</p>
   </main>
   <nav className={'kk-toc'+(glossary?' kk-toc-letters':'')} aria-label="Tartalom"><p className="kk-side-title">Tartalom</p><ul>{toc.map(([id,l])=><li key={id}><a href={'#'+id}>{l}</a></li>)}</ul></nav>
  </div>
 </>;
}
