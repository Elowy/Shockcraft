import type {Metadata} from 'next';
import {BadgeCheck,BookOpen,BookText,Calculator,ClipboardCheck,Search,ShieldAlert,ShieldCheck} from 'lucide-react';
import {AppBar,Shell} from '@/components/kezikonyv/shell';
import {JsonLd,breadcrumbLd} from '@/components/kezikonyv/json-ld';
import {KbContinue} from '@/components/kezikonyv/kb-continue';
import {PlannerCta} from '@/components/kezikonyv/planner-cta';
import {calcMetas} from '@/lib/calc/registry';
import {articleHref,articlePages,categoriesWithArticles,categoryArticles,categoryHref,glossaryTerms,pendingCount,visibleArticles} from '@/lib/kb/content/registry';
import {CALC_HUB,KB_GLOSSARY,KB_HOME,KB_TITLE,OG_BASE,calcPath} from '@/lib/kb/categories';
import {QUIZ_PATH,bankState,quizPublishedCount,visibleTemplates} from '@/lib/quiz/registry';
import {kbPreview,siteOrigin} from '@/lib/site-origin';

export const dynamic='force-static';
export const revalidate=3600;

const DESCRIPTION='Ingyenes villanyszerelő tudástár belépés nélkül: villamos alapfogalmak, vezetékszínek, IP-védettség, világítás, szakszótár és kalkulátorok.';
export async function generateMetadata():Promise<Metadata>{
 return {title:{absolute:KB_TITLE+' – ingyenes | Villanyrajz'},description:DESCRIPTION,alternates:{canonical:KB_HOME},
  openGraph:{...OG_BASE,type:'website',title:KB_TITLE+' – Villanyrajz',description:DESCRIPTION,url:KB_HOME},...(kbPreview()?{robots:{index:false,follow:false}}:{})};
}

/** A kezdőlapon kiemelt kalkulátorok (csak a közzétettek kapnak linket). */
const FEATURED_CALCS=['ohm-torveny','teljesitmeny','aram-teljesitmenybol','fazisterheles','fogyasztas-koltseg','vezetek-ellenallas','mertekegyseg-atvalto','lumen-lux'];
/** Gyakran keresett cikkek. */
const POPULAR=['vezetekek-szinjelolese','ip-vedettseg','ohm-torvenye','elektromos-teljesitmeny','rovidzarlat-es-tulterheles','vezetek-es-kabeljelolesek'];

export default function TudastarHome(){
 const preview=kbPreview(),origin=siteOrigin();
 const articles=visibleArticles(preview,'elmelet'),cats=categoriesWithArticles('elmelet',preview),terms=glossaryTerms(preview),pending=pendingCount();
 const calcs=calcMetas(preview).filter(m=>m.href),featured=FEATURED_CALCS.map(s=>calcs.find(c=>c.slug===s)).filter((c):c is NonNullable<typeof c>=>!!c);
 const popular=POPULAR.map(id=>articles.find(a=>a.id===id)).filter((a):a is NonNullable<typeof a>=>!!a);
 const valid=[...articles.map(a=>'article:'+a.id),...calcs.map(c=>'calc:'+c.slug)];
 const quiz=quizPublishedCount(preview),quizTypes=visibleTemplates(preview).length,bankLive=bankState().live;
 return <Shell section="tudastar">
  <AppBar title="Tudástár" home={KB_HOME}/>
  <div className="kk-page kk-page-single">
   <main id="tartalom" className="kk-main kk-home">
    {preview&&<p className="kk-preview-banner" role="note">Lektori előnézet: a még nem közzétett tervezetek is látszanak. Élesben ez a mód soha nem kapcsolható be.</p>}
    <h1>{KB_TITLE}</h1>
    <p className="kk-lead">Villamos alapfogalmak, gyakorlati tudnivalók, szakszótár és kalkulátorok – ingyen, belépés és regisztráció nélkül, saját ábrákkal és kidolgozott példákkal.</p>
    <p id="kereses"><a className="kk-home-search" href={KB_HOME+'#kereses'} data-kb-open="search"><Search aria-hidden="true"/><span>Keresés: színjelölés, IP65, Ohm-törvény, FI-relé…</span><kbd>/</kbd></a></p>
    <noscript><p className="kk-muted">A kereséshez JavaScript szükséges; a tartalom az alábbi listákból JS nélkül is elérhető.</p></noscript>
    <div id="kedvencek"><KbContinue valid={valid}/></div>
    <section aria-labelledby="reszek-cim" className="kk-home-sections">
     <h2 id="reszek-cim" className="sr-only">A Tudástár részei</h2>
     <ul className="kk-section-cards">
      {!!articles.length&&<li><a href={KB_HOME+'/elmelet'}><BookOpen aria-hidden="true"/><b>Elmélet</b><small>{articlePages(preview,'elmelet').length} cikk: alapfogalmak, vezetékek, világítás, IP-védettség</small></a></li>}
      <li className="featured"><a href={CALC_HUB}><Calculator aria-hidden="true"/><b>Kalkulátorok</b><small>{calcs.length} ingyenes számítás képlettel és levezetéssel</small></a></li>
      {quiz>0&&<li><a href={QUIZ_PATH}><ClipboardCheck aria-hidden="true"/><b>Tesztek</b><small>{bankLive?'Gyakorló és vizsga mód, témakörönkénti kérdésekkel':quizTypes+' számolós feladattípus gyakorló és vizsga módban, magyarázattal'}</small></a></li>}
      {!!terms.length&&<li><a href={KB_GLOSSARY}><BookText aria-hidden="true"/><b>Szakszótár</b><small>{terms.length} kifejezés A–Z, a cikkekre mutató linkekkel</small></a></li>}
     </ul>
     {pending>0&&<p className="kk-muted">Hamarosan – szakmai lektorálás alatt: bekötési sémák (101–107 kapcsolók, dugalj, földelési rendszerek) és a biztonságkritikus elméleti témák, összesen {pending} tétel.</p>}
    </section>
    {!!featured.length&&<section aria-labelledby="kalk-cim" className="kk-home-calcs">
     <h2 id="kalk-cim"><a href={CALC_HUB}>Kalkulátorok</a></h2>
     <ul className="kk-chiplist">{featured.map(c=><li key={c.slug}><a href={calcPath(c.slug)}><b>{c.title}</b><small>{c.short}</small></a></li>)}</ul>
     <p><a className="kk-button" href={CALC_HUB}>Összes kalkulátor</a></p>
    </section>}
    {!!popular.length&&<section aria-labelledby="nepszeru-cim">
     <h2 id="nepszeru-cim">Népszerű</h2>
     <ul className="kk-chiplist">{popular.map(a=><li key={a.id}><a href={articleHref(a)}><b>{a.navTitle}</b></a></li>)}</ul>
    </section>}
    {!!cats.length&&<section aria-labelledby="elmelet-cim">
     <h2 id="elmelet-cim"><a href={KB_HOME+'/elmelet'}>Elmélet</a></h2>
     <div className="kk-cat-grid">{cats.map(c=><section key={c.id} aria-labelledby={'h-'+c.id}>
      <h3 id={'h-'+c.id}><a href={categoryHref(c)}>{c.label}</a></h3>
      <ul>{categoryArticles(c.id,preview).map(a=><li key={a.id}><a href={articleHref(a)}>{a.navTitle}</a></li>)}</ul>
     </section>)}</div>
    </section>}
    <p className="kk-safety-band" role="note"><ShieldAlert aria-hidden="true"/><span>Villamos szerelést csak szakképzett személy végezhet. A Tudástár tájékoztató ismeretanyag – <a href="#fontos">fontos tudnivaló</a>.</span></p>
    <section className="kk-method" id="ellenorzes" aria-labelledby="ellenorzes-cim">
     <h2 id="ellenorzes-cim">Hogyan ellenőrizzük a tartalmat?</h2>
     <ul>
      <li><BadgeCheck aria-hidden="true"/><span><b>Belsőleg ellenőrizve:</b> alacsony kockázatú elméleti és gyakorlati tudnivaló (például Ohm-törvény, teljesítmény, színjelölés, IP-kód) és tankönyvi kalkulátor. A szerzői vázlatot tőle független szakmai ellenőrzés nézte át, a számpéldákat újraszámoltuk. Ha a tartalom bármiben megváltozik, az ellenőrzés érvényét veszti, és újra el kell végezni.</span></li>
      <li><ShieldCheck aria-hidden="true"/><span><b>Szakmailag lektorált:</b> bekötések, védelmi eszközök, földelés, feszültségmentesítés és a szabványhoz kötött számítások csak jogosult szakember jóváhagyása után jelennek meg. Addig „hamarosan – szakmai lektorálás alatt” jelzéssel szerepelnek, link nélkül.</span></li>
      <li><span>A forrásoknál a „kiadás ellenőrzés alatt” jelölés azt mutatja, hogy a hivatkozott szabvány vagy jogszabály kiadását, illetve pontszámát a szakmai lektor még ellenőrzi. Szabványszöveget nem idézünk. A cikkek vázlata MI-segítséggel készült, emberi szerkesztéssel és ellenőrzéssel.</span></li>
      <li><span>Hibát találtál? Minden oldal alján előre kitöltött e-mailben jelezheted, vagy írj az <a href="mailto:info@luiz-tech.hu?subject=Tud%C3%A1st%C3%A1r%20hiba">info@luiz-tech.hu</a> címre.</span></li>
     </ul>
    </section>
    <PlannerCta/>
   </main>
  </div>
  <JsonLd data={breadcrumbLd(origin,[{name:'Villanyrajz',path:'/'},{name:'Tudástár',path:KB_HOME}])}/>
 </Shell>;
}
