// A Tesztek oldala (docs/tudastar-terv.md 2.2 és 7. pont): statikus oldalváz (ISR) + a csak itt töltődő kliensszigete (components/quiz).
// Csak akkor létezik, ha van közzétett tartalma (lib/quiz/gate.ts: a közzétett kalkulátorra épülő, belsőleg ellenőrzött számolós sablonok;
// a statikus kérdésbank csak élesedése után). Az URL-paramétereket (?kod=, ?mod=, ?feladat=, ?tema=, ?hossz=) a sziget olvassa.
// JS nélkül: mit tud az oldal, a feladattípusok a kalkulátor- és cikklinkekkel, egy kidolgozott mintafeladat.
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {BookOpen,Calculator,ClipboardCheck,Flag,ListChecks,RotateCcw,Share2,Timer} from 'lucide-react';
import {AppBar} from '@/components/kezikonyv/shell';
import {JsonLd,breadcrumbLd} from '@/components/kezikonyv/json-ld';
import {PlannerCta} from '@/components/kezikonyv/planner-cta';
import {SafetyNotice} from '@/components/kezikonyv/safety-notice';
import {Sub} from '@/components/calc/sub';
import {QuizApp} from '@/components/quiz/quiz-app';
import {CALC_HUB,KB_HOME,OG_BASE,kbSeoTitle} from '@/lib/kb/categories';
import {PASS_THRESHOLD} from '@/lib/quiz/gate';
import {QUIZ_PATH,bankState,pendingTemplates,quizClientData,quizPublishedCount,staticSample,templateMeta,visibleTemplates} from '@/lib/quiz/registry';
import {QUIZ_NOTICE,TOPICS} from '@/lib/quiz/topics';
import {kbPreview,siteOrigin} from '@/lib/site-origin';

export const dynamic='force-static';
export const revalidate=3600;

const TITLE='Gyakorló tesztek villanyszerelőknek';
const DESCRIPTION='Ingyenes számolós gyakorló tesztek villanyszerelőknek belépés nélkül: Ohm-törvény, teljesítmény, áram, eredő ellenállás, energiaköltség – magyarázattal.';
export async function generateMetadata():Promise<Metadata>{
 if(!quizPublishedCount(kbPreview()))return {};
 return {title:{absolute:kbSeoTitle(TITLE,'Gyakorló tesztek')},description:DESCRIPTION,alternates:{canonical:QUIZ_PATH},
  openGraph:{...OG_BASE,type:'website',title:TITLE+' – Villanyrajz',description:DESCRIPTION,url:QUIZ_PATH},...(kbPreview()?{robots:{index:false,follow:false}}:{})};
}

export default function TesztekPage(){
 const preview=kbPreview();
 if(!quizPublishedCount(preview))notFound();
 const origin=siteOrigin(),data=quizClientData(preview),bank=bankState();
 const metas=visibleTemplates(preview).map(t=>templateMeta(t,preview));
 const groups=TOPICS.map(t=>({...t,items:metas.filter(m=>m.topic===t.id)})).filter(g=>g.items.length);
 const pending=pendingTemplates(preview),sample=staticSample(preview),pct=Math.round(PASS_THRESHOLD*100);
 return <>
  <AppBar title="Tesztek" home={KB_HOME}/>
  <div className="kk-page kk-page-single">
   <main id="tartalom" className="kk-main kk-quiz-page">
    <nav className="kk-crumbs" aria-label="Morzsamenü"><ol><li><a href={KB_HOME}>Tudástár</a></li><li aria-current="page">Tesztek</li></ol></nav>
    {preview&&<p className="kk-preview-banner" role="note">Lektori előnézet: a még nem közzétett (tervezet) feladattípusok is választhatók. Élesben ez a mód soha nem kapcsolható be.</p>}
    <h1>Gyakorló tesztek</h1>
    <p className="kk-lead">Számolós gyakorló feladatok a Tudástár belsőleg ellenőrzött kalkulátoraiból: minden kérdés más számokkal, azonnali magyarázattal, levezetéssel és a kapcsolódó cikkre mutató linkkel. Ingyen, belépés és regisztráció nélkül.</p>
    <SafetyNotice id="teszt"/>
    <section id="teszt" className="kk-quiz-host" aria-label="Teszt">
     <noscript><p className="kk-callout kk-callout-info"><span>A tesztek kitöltéséhez JavaScript szükséges. Nélküle is olvashatod a lenti mintafeladatot és a feladattípusok leírását, a <a href={CALC_HUB}>kalkulátoroknál</a> pedig a képleteket és a kidolgozott példákat.</span></p></noscript>
     <div className="kk-quiz-island"><QuizApp data={data}/></div>
    </section>
    {sample&&<section className="kk-quiz-nojs kk-quiz-sample" aria-labelledby="minta-cim">
     <h2 id="minta-cim">Mintafeladat: {sample.title}</h2>
     <p className="kk-quiz-notice-inline"><ClipboardCheck aria-hidden="true"/>{QUIZ_NOTICE}</p>
     <p className="kk-quiz-sample-stem">{sample.q.stem}</p>
     <ol className="kk-quiz-sample-choices" type="A">{sample.q.choices.map(c=><li key={c.id}>{c.text}</li>)}</ol>
     <details><summary>Megoldás és levezetés</summary>
      <p><b>Helyes válasz: {sample.q.choices.find(c=>c.correct)?.text}</b></p>
      <p>{sample.q.explanation}</p>
      {!!sample.q.steps?.length&&<ol className="kk-steps">{sample.q.steps.map((s,i)=><li key={i}><b>{s.label}</b><code><Sub text={s.formula}/></code><span><Sub text={s.substituted}/></span><strong>= <Sub text={s.result}/></strong>{s.ref&&<small>Forrás: {s.ref}</small>}</li>)}</ol>}
      <ul className="kk-quiz-sample-why">{sample.q.choices.filter(c=>!c.correct&&c.why).map(c=><li key={c.id}>{c.text}: {c.why}</li>)}</ul>
     </details>
    </section>}
    <section className="kk-quiz-types-list" aria-labelledby="feladatok-cim">
     <h2 id="feladatok-cim">Feladattípusok</h2>
     <p className="kk-muted">A helyes válasz és a levezetés minden feladatnál a kapcsolódó kalkulátorból jön; a rossz válaszlehetőségek tipikus számolási hibákból (például a √3 vagy a cos φ kihagyása, a W és a kW összekeverése) adódnak, és a magyarázat megmondja, melyikből.</p>
     {groups.map(g=><section key={g.id} aria-labelledby={'tema-'+g.id}>
      <h3 id={'tema-'+g.id}>{g.label}</h3>
      <ul className="kk-related-grid">{g.items.map(m=><li key={m.id}><div className="kk-quiz-type">
       <b>{m.title}{m.draft&&<span className="kk-badge draft">Tervezet</span>}</b><small>{m.short}</small>
       <span className="kk-quiz-type-links"><a href={QUIZ_PATH+'?feladat='+m.id}>Gyakorlás</a><a href={m.calcHref}><Calculator aria-hidden="true"/>{m.calcTitle}</a>{m.article&&<a href={m.article.href}><BookOpen aria-hidden="true"/>{m.article.title}</a>}</span>
      </div></li>)}</ul>
     </section>)}
     {(!!pending.length||!bank.live)&&<p className="kk-muted">Hamarosan – szakmai lektorálás alatt: {pending.length?'számolós feladat a szabványhoz kötött számításokból ('+pending.map(t=>t.title.replace(/ \(.*\)$/,'').toLocaleLowerCase('hu')).join(', ')+'), a kalkulátoruk lektori kiadása után':''}{pending.length&&!bank.live?'; ':''}{!bank.live?'témakörönkénti elméleti kérdések (kapcsolások, védelmi eszközök, érintésvédelem, mérés és a többi), a kérdésbank lektorálása után':''}.</p>}
    </section>
    <section className="kk-method" id="hogyan" aria-labelledby="hogyan-cim">
     <h2 id="hogyan-cim">Hogyan működik?</h2>
     <ul>
      <li><ListChecks aria-hidden="true"/><span><b>Gyakorló:</b> minden kérdés után azonnal látod, jó-e a válaszod, a magyarázatot, a kalkulátor levezetését, és linket a kapcsolódó cikkre és kalkulátorra.</span></li>
      <li><Timer aria-hidden="true"/><span><b>Vizsga:</b> időre megy (kérdésenként másfél perc, kikapcsolható vagy hosszabbítható; 5 és 1 perccel a vége előtt jelzünk), a kérdéstérképen szabadon lépkedhetsz és megjelölhetsz kérdéseket; a válaszokat a végén értékeljük. A lap frissítése után is folytatható.</span></li>
      <li><RotateCcw aria-hidden="true"/><span><b>Hibáim:</b> azok a feladattípusok, amelyeknél korábban hibáztál – új számokkal, a gyakrabban elrontottak nagyobb eséllyel.</span></li>
      <li><Share2 aria-hidden="true"/><span><b>Tesztkód:</b> a teszt linkjét elküldheted; aki megnyitja, ugyanazt a kérdéssort kapja.</span></li>
      <li><Flag aria-hidden="true"/><span>Saját, nem hivatalos gyakorlási küszöb: {pct} %. Ranglista, tanúsítvány és pontgyűjtés nincs; az eredmény nem igazolás. Az eredményeidet csak ez a böngésző tárolja (legfeljebb 50-et), fiók és süti nélkül; a Menü „Minden Tudástár-adat törlése” gombja ezeket is törli.</span></li>
      <li><span>Hibás feladatot találtál? Minden kérdés magyarázata alatt előre kitöltött e-mailben jelezheted, vagy írj az <a href="mailto:info@luiz-tech.hu?subject=Tud%C3%A1st%C3%A1r%20teszt%20hiba">info@luiz-tech.hu</a> címre.</span></li>
     </ul>
    </section>
    <PlannerCta/>
   </main>
  </div>
  <JsonLd data={breadcrumbLd(origin,[{name:'Tudástár',path:KB_HOME},{name:'Tesztek',path:QUIZ_PATH}])}/>
 </>;
}
