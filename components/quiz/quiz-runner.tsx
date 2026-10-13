// A Tesztek futtatója – a kliensszigete (quiz-app.tsx) csak a teszt indításakor vagy egy megkezdett teszt folytatásakor tölti be, dinamikus
// importtal: a motor (lib/quiz/engine.ts), a sablonok, a kalkulátorok (a saját szigetükből, components/quiz/calc-defs.ts) és a kérdésbank
// (élesedés után) így nem kerülnek a tesztoldal kezdeti JS-ébe. Futó teszt (Gyakorló: azonnali magyarázat, levezetés és cikklink; Vizsga:
// kikapcsolható/hosszabbítható időkorlát, jelzés 5 és 1 perccel a vége előtt, kérdéstérkép; Hibáim) és eredmény.
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,Check,CircleX,ClipboardCheck,Clock,Flag,Link2,RotateCcw,Sigma,Timer} from 'lucide-react';
import type {CalcDef} from '@/lib/calc/core';
import {encodeState} from '@/lib/calc/url';
import {buildMistakes,buildTest,encodeCode,isCorrect,mistakeCount,questionFor,score,updateStat,type BankQuestion,type Config,type Pool,type Question,type Stat} from '@/lib/quiz/engine';
import {PASS_THRESHOLD} from '@/lib/quiz/gate';
import type {QuizClientData,QuizTemplateMeta} from '@/lib/quiz/registry';
import {BANK_LOADERS} from '@/lib/quiz/release/index';
import {addResult,mergeStats,statStore,type Session} from '@/lib/quiz/storage';
import {T0_TEMPLATES,T1_TEMPLATE_IDS} from '@/lib/quiz/templates';
import {QUIZ_NOTICE} from '@/lib/quiz/topics';
// A levezetés a kalkulátor saját komponense: így a futtató a kalkulátoroldalak meglévő „calculator” csomagját használja, és nem darabolja szét
// a közös modulokat (lib/calc/core, number, url, sub) külön csomagokra – a kalkulátoroldalak JS-e nem nő (docs/tudastar.md „Tesztek”).
import {StepList} from '@/components/calc/calculator';
// Csomagolási jelzés: a kalkulátordefiníciók közös mezőleírói (lib/calc/fields) – amelyeket minden kalkulátorsziget használ – így ugyanabba
// a „calculator” csomagba kerülnek, mint a kalkulátoroldalakon (nélküle külön csomagba szakadnának, +0,3 KB gz minden kalkulátoroldalon).
import '@/lib/calc/fields';
import {showToast} from '@/components/kezikonyv/kb-client';
import {loadDefs} from './calc-defs';
import {MIN,MODE_LABEL,PATH,randomSeed,toTop} from './quiz-shared';

// ---- Betöltés: a közzétett sablonok kalkulátordefiníciói és (élesedés után) a kérdésbank témakörei.
let defsLoaded:Record<string,CalcDef>={};
/** A kérdéskészlet: a szerver által átadott (közzétett) sablonok, a definícióik és a kiadott kérdésbank. Hiba esetén a Promise elutasul. */
export async function loadPool(data:QuizClientData):Promise<Pool>{
 // A T1-kalkulátorra épülő sablonok külön csomagban: csak akkor töltődnek be, ha a szerver valamelyiket közzétettként adja át.
 const t1=data.templates.some(m=>(T1_TEMPLATE_IDS as readonly string[]).includes(m.id))?(await import('@/lib/quiz/templates-t1')).T1_TEMPLATES:[];
 const templates=[...T0_TEMPLATES,...t1].filter(t=>data.templates.some(m=>m.id===t.id));
 const [defs,bank]=await Promise.all([loadDefs([...new Set(templates.map(t=>t.calc))]),
  Promise.all(data.bank.topics.map(t=>t.id).filter(t=>BANK_LOADERS[t]).map(t=>BANK_LOADERS[t]()))]);
 defsLoaded=defs;
 return {templates,defs,bank:bank.flat() as BankQuestion[]};
}
/** A tárolt teszt kérdései (null, ha egy feladat azóta nem érhető el). */
export const questionsOf=(s:Session,pool:Pool)=>s.refs.map(r=>questionFor(r,pool));
const blank=(refs:Session['refs'])=>({answers:refs.map(()=>null),checked:refs.map(()=>false),flagged:refs.map(()=>false),cur:0,extended:0,done:false,saved:false});
/** Új teszt a beállításból (null, ha nincs hozzá kérdés). */
export function testSession(cfg:Config,label:string,release:string,pool:Pool):Session|null{
 const refs=buildTest(cfg,pool);if(!refs.length)return null;
 const now=Date.now();
 return {v:1,release,code:encodeCode(cfg),mode:cfg.mode,label,refs,...blank(refs),startedAt:now,deadline:cfg.mode==='vizsga'&&cfg.timer>0?now+cfg.timer*MIN:null};
}
/** „Hibáim”: a korábban elrontott feladatokból (null, ha nincs ilyen). */
export function mistakesSession(n:number,release:string,pool:Pool):Session|null{
 const refs=buildMistakes(n,statStore.get(),pool,randomSeed());if(!refs.length)return null;
 return {v:1,release,mode:'hibaim',label:'Hibáim · '+refs.length+' kérdés',refs,...blank(refs),startedAt:Date.now(),deadline:null};
}
/** A teszt lezárása: kérdésenkénti (sablonnál sablononkénti) statisztika és az eredmény a böngészőbe; a lezárt teszt. `expired`: az
 * időkorlát lejárt, a tesztet a program adta be (az eredményoldal jelzi). */
export function finishedSession(s:Session,qs:readonly Question[],expired=false):Session{
 if(s.done)return s;
 const sc=score(qs,s.answers),now=Date.now();
 const prev=new Map(statStore.get().map(x=>[x.id,x])),next=new Map<string,Stat>();
 qs.forEach((q,i)=>{const st=updateStat(next.get(q.item)??prev.get(q.item),q.item,q.version,isCorrect(q,s.answers[i]),now);next.set(q.item,st)});
 mergeStats([...next.values()]);
 addResult({at:now,mode:s.mode,n:sc.n,ok:sc.ok,pct:sc.pct,pass:sc.pass,label:s.label,...(s.code?{code:s.code}:{})});
 return {...s,done:true,saved:true,cur:0,...(expired?{expired:true}:{})};
}
export const hasMistakes=(pool:Pool)=>mistakeCount(statStore.get(),pool)>0;

// ---- Óra (csak futó, időkorlátos vizsgánál iratkozik fel).
let clockNow=0;const clockListeners=new Set<()=>void>();let clockTimer:ReturnType<typeof setInterval>|null=null;
function subscribeClock(f:()=>void){
 clockListeners.add(f);
 if(!clockTimer){clockNow=Date.now();clockTimer=setInterval(()=>{clockNow=Date.now();clockListeners.forEach(g=>g())},1000)}
 return ()=>{clockListeners.delete(f);if(!clockListeners.size&&clockTimer){clearInterval(clockTimer);clockTimer=null}};
}
const getClock=()=>{if(!clockNow)clockNow=Date.now();return clockNow};
const noSubscribe=()=>()=>{};
const pad=(n:number)=>String(n).padStart(2,'0');
const clock=(ms:number)=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+pad(s%60)};
/** Szám és százalékjel nem törő szóközzel („60 %”). */
export const pctText=(n:number)=>n+'\u00a0%';

// ---------------------------------------------------------------------------------------------------- Futó teszt
export function RunView({sess,qs,metaOf,update,finish,expire,onAbort}:{sess:Session;qs:readonly Question[];metaOf:ReadonlyMap<string,QuizTemplateMeta>;update:(s:Session)=>void;finish:()=>void;expire:()=>void;onAbort:()=>void}){
 const exam=sess.mode==='vizsga',i=sess.cur,q=qs[i],n=qs.length,answer=sess.answers[i],checked=sess.checked[i];
 const timed=exam&&sess.deadline!==null;
 const now=useSyncExternalStore(timed?subscribeClock:noSubscribe,timed?getClock:()=>0,()=>0);
 const left=timed&&now?sess.deadline!-now:null;
 const [confirm,setConfirm]=useState<'submit'|'abort'|null>(null);
 // Fókuszkezelés (billentyűzet és képernyőolvasó, WCAG 2.4.3): a megerősítés megnyitásakor a fókusz a gombjára kerül (a beadásnál az
 // „Igen, beadom”, a megszakításnál a biztonságos „Folytatom”), mégsénél vissza a kiváltó gombra; az időkorlát kikapcsolása után az
 // „Időkorlát nélkül” szövegre. A fókusz így sosem esik vissza a dokumentum elejére (BODY).
 const confirmRef=useRef<HTMLButtonElement>(null),keepRef=useRef<HTMLButtonElement>(null),abortRef=useRef<HTMLButtonElement>(null),noTimerRef=useRef<HTMLParagraphElement>(null);
 const returnTo=useRef<HTMLElement|null>(null);
 // A visszaadandó fókusz célja a következő renderelés után (a kiváltó művelet maga renderel újra; ref, nem állapot).
 const refocus=useRef<'abort'|'timer'|null>(null);
 useEffect(()=>{if(confirm==='submit')confirmRef.current?.focus();else if(confirm==='abort')keepRef.current?.focus()},[confirm]);
 useEffect(()=>{const r=refocus.current;if(!r)return;refocus.current=null;(r==='abort'?abortRef:noTimerRef).current?.focus()});
 const askSubmit=(e:React.MouseEvent<HTMLElement>)=>{if(!unanswered){finish();return}returnTo.current=e.currentTarget;setConfirm('submit')};
 const cancelSubmit=()=>{setConfirm(null);const r=returnTo.current;(r?.isConnected?r:headRef.current)?.focus()};
 const headRef=useRef<HTMLHeadingElement>(null);
 const expireRef=useRef(expire);
 useEffect(()=>{expireRef.current=expire});
 // Lejárt idő: automatikus beadás (újratöltés után is, a tárolt határidő szerint); az eredményoldal jelzi, hogy lejárt az idő.
 useEffect(()=>{
  if(!timed)return;
  const deadline=sess.deadline!;
  const id=setInterval(()=>{if(Date.now()>=deadline)expireRef.current()},1000);
  return ()=>clearInterval(id);
 },[timed,sess.deadline]);
 // Induláskor és kérdésváltáskor a teszt teteje a képernyő tetejére, a fókusz a kérdés címére kerül (képernyőolvasó és billentyűzet).
 useEffect(()=>{toTop(headRef.current)},[i]);
 const set=(patch:Partial<Session>)=>update({...sess,...patch});
 const choose=(id:string)=>{
  if(!exam&&checked)return;
  const prev=answer??[],next=q.type==='multi'?(prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]):[id];
  set({answers:sess.answers.map((a,k)=>k===i?(next.length?next:null):a)});
 };
 const go=(k:number)=>{setConfirm(null);set({cur:Math.max(0,Math.min(n-1,k))})};
 const unanswered=sess.answers.filter(a=>!a?.length).length;
 const warn=left===null?'':left<=MIN?'Már csak 1 perc van hátra!':left<=5*MIN?'Már csak 5 perc van hátra.':'';
 const correct=checked&&isCorrect(q,answer);
 return <section className="kk-quiz kk-quiz-run" aria-labelledby="kerdes-cim">
  <div className="kk-quiz-bar">
   <p><b>{MODE_LABEL[sess.mode]}</b> · {i+1}. kérdés / {n}</p>
   <progress max={n} value={exam?n-unanswered:sess.checked.filter(Boolean).length} aria-label={exam?'Megválaszolt kérdések':'Ellenőrzött kérdések'}/>
   {timed&&<p className={'kk-quiz-timer'+(left!==null&&left<=5*MIN?' low':'')}><Timer aria-hidden="true"/><span><span className="sr-only">Hátralévő idő: </span>{left===null?'–':clock(left)}</span></p>}
  </div>
  {exam&&sess.deadline!==null&&<p className="kk-quiz-timer-actions"><button type="button" className="kk-link" onClick={()=>set({deadline:sess.deadline!+5*MIN,extended:sess.extended+5})}>Időkorlát +5 perc</button> · <button type="button" className="kk-link" onClick={()=>{refocus.current='timer';set({deadline:null})}}>Időkorlát kikapcsolása</button></p>}
  {exam&&sess.deadline===null&&<p className="kk-quiz-timer-actions kk-muted" ref={noTimerRef} tabIndex={-1}>Időkorlát nélkül{sess.extended?' (hosszabbítva)':''}.</p>}
  {/* Élő régió: üresen is az akadálymentességi fában van (CSS: vizuálisan rejtve, nem display:none), így az első jelzés is elhangzik. */}
  <p className="kk-quiz-alert" aria-live="assertive" aria-atomic="true">{warn&&<><Clock aria-hidden="true"/>{warn}</>}</p>
  <p className="kk-quiz-notice-inline"><ClipboardCheck aria-hidden="true"/>{QUIZ_NOTICE}</p>
  <div className="kk-quiz-card">
   <h2 id="kerdes-cim" ref={headRef} tabIndex={-1}><span className="kk-quiz-num">{i+1}.</span> {q.stem}</h2>
   {q.type==='multi'&&<p className="kk-quiz-hint" id="kerdes-tipus">Több válasz is helyes lehet – jelöld meg mindet.</p>}
   {/* A csoport neve a kérdés (aria-labelledby); a többválaszos jelzés és a visszajelzés leírásként kapcsolódik (a legend itt nem számít). */}
   <fieldset className="kk-quiz-choices" aria-labelledby="kerdes-cim" aria-describedby={[q.type==='multi'?'kerdes-tipus':'',checked?'visszajelzes':''].filter(Boolean).join(' ')||undefined}>
    <legend className="sr-only">Válaszlehetőségek</legend>
    {q.choices.map((c,k)=>{
     const picked=!!answer?.includes(c.id),mark=checked?(c.correct?'ok':picked?'bad':''):'';
     return <label key={c.id} className={'kk-quiz-choice'+(picked?' picked':'')+(mark?' '+mark:'')}>
      <input type={q.type==='multi'?'checkbox':'radio'} name={'valasz-'+i} value={c.id} checked={picked} disabled={!exam&&checked} onChange={()=>choose(c.id)}/>
      <span className="kk-quiz-letter" aria-hidden="true">{'ABCDE'[k]}</span><span className="kk-quiz-text">{c.text}</span>
      {mark==='ok'&&<span className="kk-quiz-mark"><Check aria-hidden="true"/> helyes válasz</span>}
      {mark==='bad'&&<span className="kk-quiz-mark"><CircleX aria-hidden="true"/> a te válaszod</span>}
     </label>;
    })}
   </fieldset>
   {/* Udvarias élő régió: csak az ítélet és a helyes válasz hangzik el; a magyarázat, a levezetés és a linkek olvasási sorrendben következnek. */}
   <p className="sr-only" aria-live="polite" aria-atomic="true">{checked?(correct?'Helyes!':(answer?.length?'Nem helyes.':'Nem válaszoltál.')+' A helyes válasz: '+q.choices.filter(c=>c.correct).map(c=>c.text).join(', ')+'.'):''}</p>
   {checked&&<Feedback q={q} answer={answer} correct={correct} meta={q.source.kind==='tpl'?metaOf.get(q.source.template):undefined} code={sess.code}/>}
   <div className="kk-quiz-actions">
    {exam?<>
     <button type="button" className="kk-button" onClick={()=>go(i-1)} disabled={i===0}><ArrowLeft aria-hidden="true"/> Előző</button>
     <button type="button" className={'kk-button'+(sess.flagged[i]?' on':'')} aria-pressed={sess.flagged[i]} onClick={()=>set({flagged:sess.flagged.map((f,k)=>k===i?!f:f)})}><Flag aria-hidden="true"/> {sess.flagged[i]?'Megjelölve':'Megjelölés későbbre'}</button>
     {i<n-1?<button type="button" className="kk-button primary" onClick={()=>go(i+1)}>Következő <ArrowRight aria-hidden="true"/></button>
      :<button type="button" className="kk-button primary" onClick={askSubmit}>Teszt beadása</button>}
    </>:!checked?<button type="button" className="kk-button primary" disabled={!answer?.length} onClick={()=>set({checked:sess.checked.map((c,k)=>k===i||c)})}>Ellenőrzés</button>
     :i<n-1?<button type="button" className="kk-button primary" onClick={()=>go(i+1)}>Következő kérdés <ArrowRight aria-hidden="true"/></button>
     :<button type="button" className="kk-button primary" onClick={()=>finish()}>Eredmény</button>}
   </div>
   {confirm==='submit'&&<div className="kk-confirm" role="alertdialog" aria-label="Beadás megerősítése" aria-describedby="beadas-kerdes"><span id="beadas-kerdes">Még {unanswered} kérdés megválaszolatlan (ezek hibásnak számítanak). Beadod a tesztet?</span><button type="button" className="kk-button primary" ref={confirmRef} onClick={()=>finish()}>Igen, beadom</button><button type="button" className="kk-button" onClick={cancelSubmit}>Vissza a kérdésekhez</button></div>}
  </div>
  {exam&&<nav className="kk-quiz-map" aria-label="Kérdéstérkép">
   <p className="kk-muted">Kérdéstérkép · {n-unanswered}/{n} megválaszolva{sess.flagged.some(Boolean)?' · zászló: megjelölve':''}</p>
   <ol>{qs.map((_,k)=>{const done=!!sess.answers[k]?.length,flag=sess.flagged[k];
    return <li key={k}><button type="button" className={(done?'done':'')+(flag?' flag':'')} aria-current={k===i?'step':undefined} onClick={()=>go(k)} aria-label={(k+1)+'. kérdés: '+(done?'megválaszolva':'megválaszolatlan')+(flag?', megjelölve':'')}>{k+1}{flag&&<Flag aria-hidden="true"/>}</button></li>})}</ol>
   <p><button type="button" className="kk-button" onClick={askSubmit}>Teszt beadása</button></p>
  </nav>}
  <p className="kk-quiz-abort">{confirm==='abort'?<span className="kk-confirm" role="alertdialog" aria-label="Megszakítás megerősítése" aria-describedby="megszakitas-kerdes"><span id="megszakitas-kerdes">Megszakítod a tesztet? Az eddigi válaszok nem kerülnek az eredmények közé.</span><button type="button" className="kk-button danger" onClick={onAbort}>Igen, megszakítom</button><button type="button" className="kk-button" ref={keepRef} onClick={()=>{refocus.current='abort';setConfirm(null)}}>Folytatom</button></span>
   :<button type="button" className="kk-link" ref={abortRef} onClick={()=>setConfirm('abort')}>Teszt megszakítása</button>}</p>
 </section>;
}

/** „Hibás a kérdés?” – előre kitöltött e-mail a feladattípussal, a paraméterekkel és a tesztkóddal. */
function reportHref(q:Question,code?:string){
 const id=q.source.kind==='tpl'?q.source.template:q.item;
 const body=['Oldal: '+window.location.origin+PATH+(code?'?kod='+code:''),'Feladat: '+id+' v'+q.version,...(q.source.kind==='tpl'?['Paraméterek: '+Object.entries(q.source.raw).map(([k,v])=>k+'='+v).join(', ')]:[]),'Kérdés: '+q.stem,'Mi a hiba? ',''].join('\n');
 return 'mailto:info@luiz-tech.hu?subject='+encodeURIComponent('Tudástár teszt – hibás kérdés: '+id+' v'+q.version)+'&body='+encodeURIComponent(body);
}
function Feedback({q,answer,correct,meta,code}:{q:Question;answer:readonly string[]|null;correct:boolean;meta?:QuizTemplateMeta;code?:string}){
 const right=q.choices.filter(c=>c.correct),wrong=q.choices.filter(c=>!c.correct&&answer?.includes(c.id));
 const def=q.source.kind==='tpl'?defsLoaded[q.source.calc]:undefined;
 const calcHref=meta&&def&&q.source.kind==='tpl'?meta.calcHref+encodeState(def,q.source.raw):null;
 return <div className={'kk-quiz-feedback '+(correct?'ok':'bad')} id="visszajelzes">
  <p className="kk-quiz-verdict">{correct?<><Check aria-hidden="true"/> Helyes!</>:<><CircleX aria-hidden="true"/> {answer?.length?'Nem helyes.':'Nem válaszoltál.'} A helyes válasz: <b>{right.map(c=>c.text).join(', ')}</b></>}</p>
  {wrong.map(c=>c.why&&<p key={c.id} className="kk-quiz-why">{c.text}: {c.why}</p>)}
  <p>{q.explanation}</p>
  {!!q.steps?.length&&<details className="kk-derivation" open><summary>Levezetés (a kalkulátorból)</summary><StepList steps={q.steps}/></details>}
  <p className="kk-quiz-links">
   {meta?.article&&<a href={meta.article.href}><BookOpen aria-hidden="true"/> Olvasd el: {meta.article.title}</a>}
   {calcHref&&<a href={calcHref}><Sigma aria-hidden="true"/> Számold újra: {meta!.calcTitle}</a>}
   <a className="kk-report" href={reportHref(q,code)}>Hibás a kérdés? Írd meg</a>
  </p>
 </div>;
}

// ---------------------------------------------------------------------------------------------------- Eredmény
export function ResultView({sess,qs,metaOf,onNew,onRepeat,onMistakes,hasMistakes}:{sess:Session;qs:readonly Question[];metaOf:ReadonlyMap<string,QuizTemplateMeta>;onNew:()=>void;onRepeat:()=>void;onMistakes:()=>void;hasMistakes:boolean}){
 const sc=score(qs,sess.answers);
 const headRef=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{toTop(headRef.current)},[]);
 async function copy(){
  try{await navigator.clipboard.writeText(window.location.origin+PATH+'?kod='+sess.code);showToast('A teszt linkje a vágólapon: aki megnyitja, ugyanezt a kérdéssort kapja.')}
  catch{showToast('A böngésző nem engedte a másolást. A tesztkód: '+sess.code)}
 }
 return <section className="kk-quiz kk-quiz-result" aria-labelledby="eredmeny-cim">
  <h2 id="eredmeny-cim" ref={headRef} tabIndex={-1}>Eredmény: {sc.ok}/{sc.n} helyes ({pctText(sc.pct)})</h2>
  {sess.expired&&<p className="kk-callout kk-callout-warn" role="alert"><Clock aria-hidden="true"/>Lejárt az idő – a tesztet automatikusan beadtuk. A megválaszolatlan kérdések hibásnak számítanak.</p>}
  <p className={'kk-verdict '+(sc.pass?'ok':'bad')}>{sc.pass?'Elérted a saját gyakorlási küszöböt ('+pctText(Math.round(PASS_THRESHOLD*100))+').':'Még nem érted el a saját gyakorlási küszöböt ('+pctText(Math.round(PASS_THRESHOLD*100))+') – nézd át a magyarázatokat, és próbáld újra!'}</p>
  <p className="kk-quiz-notice-inline"><ClipboardCheck aria-hidden="true"/>{QUIZ_NOTICE} A küszöb saját, nem hivatalos érték.</p>
  <p className="kk-muted">{sess.label}{sess.code?' · tesztkód: '+sess.code:''}</p>
  <p className="kk-quiz-actions">
   <button type="button" className="kk-button primary" onClick={onNew}><RotateCcw aria-hidden="true"/> Új teszt</button>
   {sess.code&&<button type="button" className="kk-button" onClick={onRepeat}>Ugyanez a kérdéssor újra</button>}
   {hasMistakes&&<button type="button" className="kk-button" onClick={onMistakes}>Hibáim gyakorlása</button>}
   {sess.code&&<button type="button" className="kk-button" onClick={copy}><Link2 aria-hidden="true"/> Teszt linkjének másolása</button>}
  </p>
  <h3>Kérdésenként</h3>
  <ol className="kk-quiz-review">{qs.map((q,k)=>{const ans=sess.answers[k],good=isCorrect(q,ans),meta=q.source.kind==='tpl'?metaOf.get(q.source.template):undefined;
   return <li key={k} className={good?'ok':'bad'}>
    <p className="kk-quiz-review-head">{good?<><Check aria-hidden="true"/><span className="sr-only">Helyes: </span></>:<><CircleX aria-hidden="true"/><span className="sr-only">Hibás: </span></>}<span>{q.stem}</span></p>
    <p className="kk-quiz-review-ans">Válaszod: <b>{ans?.length?q.choices.filter(c=>ans.includes(c.id)).map(c=>c.text).join(', '):'nincs'}</b>{!good&&<> · helyes: <b>{q.choices.filter(c=>c.correct).map(c=>c.text).join(', ')}</b></>}</p>
    <details><summary>Magyarázat és levezetés</summary><Feedback q={q} answer={ans} correct={good} meta={meta} code={sess.code}/></details>
   </li>})}</ol>
 </section>;
}
