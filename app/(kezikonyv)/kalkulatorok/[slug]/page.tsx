import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {BadgeCheck,FileWarning} from 'lucide-react';
import {AppBar} from '@/components/kezikonyv/shell';
import {CalcExample} from '@/components/calc/calc-example';
import {CALC_ISLANDS} from '@/components/calc/islands';
import {JsonLd,breadcrumbLd} from '@/components/kezikonyv/json-ld';
import {PlannerCta} from '@/components/kezikonyv/planner-cta';
import {ReportLink} from '@/components/kezikonyv/report-link';
import {SafetyNotice} from '@/components/kezikonyv/safety-notice';
import {CALCULATORS,bySlug,calcFingerprint,expertMeta,isPublished,releaseInfo,visibleCalcs} from '@/lib/calc/registry';
import {categoryLabel} from '@/lib/calc/categories';
import {CALC_HUB,OG_BASE,calcPath,calcSeoTitle} from '@/lib/kb/categories';
import {Sub} from '@/components/calc/sub';
import {SIZING_DISCLAIMER_SHORT} from '@/lib/sizing-formulas';
import {reviewText} from '@/lib/sizing-tables';
import {kbPreview,siteOrigin} from '@/lib/site-origin';

export const dynamic='force-static';
export const revalidate=3600;
export const dynamicParams=false;

/** Csak a közzétett kalkulátorok (előnézetben a tervezetek is): a kiadatlan T1 kalkulátor nem kap oldalt. */
export function generateStaticParams(){return visibleCalcs(kbPreview()).map(c=>({slug:c.slug}))}
const find=(slug:string)=>visibleCalcs(kbPreview()).find(c=>c.slug===slug);
const date=(iso:string)=>new Date(iso+'T12:00:00Z').toLocaleDateString('hu-HU',{year:'numeric',month:'long',day:'numeric',timeZone:'Europe/Budapest'});

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params,def=find(slug);if(!def)return {};
 const url=calcPath(def.slug),draft=!isPublished(def);
 return {title:{absolute:calcSeoTitle(def.title)},description:def.short,alternates:{canonical:url},openGraph:{...OG_BASE,type:'article',title:def.title+' – Villanyrajz',description:def.short,url},...(draft?{robots:{index:false,follow:false}}:{})};
}

export default async function CalculatorPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,def=find(slug);
 if(!def)notFound();
 const info=releaseInfo(def),draft=info.state!=='kozzeteve',Island=CALC_ISLANDS[def.slug],origin=siteOrigin(),url=calcPath(def.slug),fp=calcFingerprint(def);
 if(!Island)notFound();
 const siblings=CALCULATORS.filter(c=>c.category===def.category&&isPublished(c));
 const related=def.related.map(bySlug).filter((c):c is NonNullable<typeof c>=>!!c&&isPublished(c));
 const t1=def.tier!=='T0';
 // A tartalomjegyzék az oldal sorrendjét követi.
 const toc:[string,string][]=[['szamitas','Számítás'],['levezetes','Levezetés'],['kepletek','Képletek'],['mire-jo','Mire jó, mire nem'],...(t1&&def.notCovered?[['nem-vizsgalt','Nem vizsgált'] as [string,string]]:[]),['pelda','Kidolgozott példa'],...(related.length?[['kapcsolodo','Kapcsolódó kalkulátorok'] as [string,string]]:[]),['forrasok','Források']];
 // T1: a táblázatalapú számításhoz a „szabványhoz kötött” (táblázatokat említő) figyelmeztetés, a többihez a kalkulátor-figyelmeztetés kiemelt formában.
 const t1Notice=def.safety.includes('meretezes')?'meretezes' as const:'kalkulator' as const;
 return <>
  <AppBar title="Kalkulátorok" back={{href:CALC_HUB,label:'Kalkulátorok'}}/>
  <div className="kk-page kk-page-calc">
   <aside className="kk-side" aria-label={categoryLabel(def.category)}>
    <p className="kk-side-title">{categoryLabel(def.category)}</p>
    <ul>{siblings.map(c=><li key={c.slug}><a href={calcPath(c.slug)} aria-current={c.slug===def.slug?'page':undefined}>{c.title}</a></li>)}</ul>
    <a className="kk-side-all" href={CALC_HUB}>Összes kalkulátor</a>
   </aside>
   <main id="tartalom" className="kk-main">
    <nav className="kk-crumbs" aria-label="Morzsamenü"><ol><li><a href={CALC_HUB}>Kalkulátorok</a></li><li><a href={CALC_HUB+'#'+def.category}>{categoryLabel(def.category)}</a></li><li aria-current="page">{def.title}</li></ol></nav>
    {draft&&<p className="kk-preview-banner" role="note"><FileWarning aria-hidden="true"/> Tervezet – nem lektorált. Ez az oldal csak lektori előnézetben látszik ({info.reason}).</p>}
    <h1>{def.title}</h1>
    <p className="kk-lead">{def.short}</p>
    <p className="kk-review">{draft?<span className="kk-badge draft">Tervezet</span>:<a className="kk-badge" href={CALC_HUB+'#modszertan'}><BadgeCheck aria-hidden="true"/>{info.badge}</a>}<span>v{def.version} · {date(info.record?.date??def.updated)}</span></p>
    {t1&&<SafetyNotice id={t1Notice} tone="danger" extra={<p><b>{def.tables?SIZING_DISCLAIMER_SHORT:'Tájékoztató számítás – nem tervezői döntés.'}</b> Az eredmény „számítás szerinti” érték a megadott adatokkal és a lent felsorolt feltételezésekkel.</p>}/>}
    <section id="szamitas" aria-label="Számítás"><noscript><p className="kk-callout kk-callout-info">A számításhoz JavaScript szükséges. A képletek és a lenti kidolgozott példa nélküle is olvashatók.</p></noscript><Island/></section>
    <section id="kepletek" className="kk-formulas" aria-labelledby="kepletek-cim"><h2 id="kepletek-cim">Képletek</h2><ul>{def.formulas.map(f=><li key={f}><code><Sub text={f}/></code></li>)}</ul></section>
    <section id="mire-jo" className="kk-notes" aria-labelledby="mire-jo-cim"><h2 id="mire-jo-cim">Mire jó, mire nem</h2>
     <div><h3>Mire jó</h3><ul>{def.notes.good.map(n=><li key={n}>{n}</li>)}</ul></div>
     <div><h3>Mire nem</h3><ul>{def.notes.bad.map(n=><li key={n}>{n}</li>)}</ul></div>
    </section>
    {t1&&def.notCovered&&<section id="nem-vizsgalt" className="kk-notcovered" aria-labelledby="nem-vizsgalt-cim"><h2 id="nem-vizsgalt-cim">Nem vizsgált</h2><ul>{def.notCovered.map(n=><li key={n}>{n}</li>)}</ul></section>}
    {def.tables&&<p className="kk-table-status" role="note"><b>Táblázatok állapota:</b> {reviewText()}</p>}
    {!t1&&<SafetyNotice id="kalkulator"/>}
    {def.safety.includes('beavatkozas')&&<SafetyNotice id="beavatkozas" tone="warn"/>}
    <CalcExample def={def}/>
    {!!related.length&&<section id="kapcsolodo" className="kk-related" aria-labelledby="kapcsolodo-cim"><h2 id="kapcsolodo-cim">Kapcsolódó kalkulátorok</h2><ul>{related.map(c=><li key={c.slug}><a href={calcPath(c.slug)}><b>{c.title}</b><small>{c.short}</small></a></li>)}</ul></section>}
    <section id="forrasok" className="kk-sources" aria-labelledby="forrasok-cim"><h2 id="forrasok-cim">Források</h2><ul>{def.sources.map(s=><li key={s}><Sub text={s}/></li>)}</ul></section>
    <p className="kk-meta">Verzió: v{def.version} · ujjlenyomat: {fp} · frissítve: {date(def.updated)} · {info.record?.kind==='lektoralt'?expertMeta(info.record):'Ellenőrzés: '+(draft?'folyamatban':'két független számítás egyezése (automatikus teszt)')} · <ReportLink id={def.slug} version={def.version} fingerprint={fp} url={(origin??'')+url}/></p>
    <PlannerCta/>
   </main>
   <nav className="kk-toc" aria-label="Tartalom"><p className="kk-side-title">Tartalom</p><ul>{toc.map(([id,l])=><li key={id}><a href={'#'+id}>{l}</a></li>)}</ul></nav>
  </div>
  <JsonLd data={breadcrumbLd(origin,[{name:'Kalkulátorok',path:CALC_HUB},{name:def.title,path:url}])}/>
  <JsonLd data={{'@context':'https://schema.org','@type':'WebApplication',name:def.title,description:def.short,url:(origin??'')+url,applicationCategory:'UtilitiesApplication',operatingSystem:'Böngésző',inLanguage:'hu',isAccessibleForFree:true,offers:{'@type':'Offer',price:0,priceCurrency:'HUF'},publisher:{'@type':'Organization',name:'Villanyrajz'}}}/>
 </>;
}
