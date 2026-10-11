'use client';
// A Tesztek kliensszigete (/tudastar/tesztek; docs/tudastar-terv.md 7. pont): beállítás, tesztkód, korábbi eredmények. Csak ezen az oldalon
// töltődik, és kicsi: a futtatót (components/quiz/quiz-runner.tsx – motor, sablonok, kalkulátorok, futó teszt, eredmény) csak a teszt
// indításakor vagy egy megkezdett teszt folytatásakor tölti be, dinamikus importtal. Hálózati kérés (a saját JS-darabokon túl), fiók és süti nincs.
// A futó teszt a sessionStorage-ben (shockcraft-kb-quiz-session) újratöltés-álló; az eredmények és a kérdésenkénti statisztika a
// localStorage-ben (shockcraft-kb-quiz-v1). Privát módban (tiltott tárhely) mentés nélkül is fut.
// Az URL-paramétereket (?kod=, ?mod=, ?feladat=, ?tema=, ?hossz=) kliensoldalon olvassuk: a statikus oldal minden lekérdezésre azonos.
import {useEffect,useId,useMemo,useRef,useState,useSyncExternalStore} from 'react';
import {ArrowRight,ClipboardCheck,Trash2} from 'lucide-react';
import {KB_CLEARED_EVENT} from '@/lib/kb/storage';
import {LENGTHS,decodeCode,encodeCode,timerFor,type Config,type Mode} from '@/lib/quiz/code';
import type {Pool,Stat} from '@/lib/quiz/engine';
import {PASS_THRESHOLD} from '@/lib/quiz/gate';
import type {QuizClientData} from '@/lib/quiz/registry';
import {clearQuiz,clearSession,readSession,resultStore,sessionStorageBlocked,statStore,writeSession,type QuizResult,type ResultMode,type Session} from '@/lib/quiz/storage';
import {QUIZ_NOTICE,TOPICS,isTopic,topicLabel,type TopicId} from '@/lib/quiz/topics';
import {showToast,useKbStore} from '@/components/kezikonyv/kb-client';
import {MODE_LABEL,PATH,randomSeed,toTop} from './quiz-shared';
import type * as RunnerModule from './quiz-runner';

const TIMER_CHOICES=[1,1.5,2] as const;

// ---- URL-pillanatkép (mint a kalkulátornál): az első olvasáskor és visszalépéskor frissül, a saját replaceState-ünkre nem.
let urlSnap:string|null=null;
const getSearch=()=>{if(urlSnap===null)urlSnap=window.location.search;return urlSnap};
const subscribeUrl=(fn:()=>void)=>{const h=()=>{urlSnap=window.location.search;fn()};window.addEventListener('popstate',h);return ()=>window.removeEventListener('popstate',h)};
const setUrl=(search:string)=>{try{window.history.replaceState(window.history.state,'',PATH+search)}catch{}};

// ---- A futtató lusta betöltése (egyszer; hibánál újrapróbálható): a modul és a kérdéskészlet.
type Runner=typeof RunnerModule;
type Runtime={mod:Runner;pool:Pool};
let runtime:Runtime|null=null,runtimeFailed=false,runtimeLoading:Promise<Runtime>|null=null;
const runtimeListeners=new Set<()=>void>();
const emitRuntime=()=>runtimeListeners.forEach(f=>f());
function loadRuntime(data:QuizClientData):Promise<Runtime>{
 if(runtime)return Promise.resolve(runtime);
 if(!runtimeLoading){
  runtimeFailed=false;emitRuntime();
  runtimeLoading=import('./quiz-runner').then(async mod=>{runtime={mod,pool:await mod.loadPool(data)};emitRuntime();return runtime})
   .catch(e=>{runtimeFailed=true;runtimeLoading=null;emitRuntime();throw e});
 }
 return runtimeLoading;
}
const subscribeRuntime=(f:()=>void)=>{runtimeListeners.add(f);return ()=>{runtimeListeners.delete(f)}};
/** Előtöltés (pl. az űrlap első érintésekor), hogy az indítás gyors legyen; a hibát az indítás jelzi. */
const prefetch=(data:QuizClientData)=>{loadRuntime(data).catch(()=>{})};

const dateText=(at:number)=>new Date(at).toLocaleString('hu-HU',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
const LOAD_ERROR='A feladatok betöltése nem sikerült (hálózati hiba?). Próbáld újra; a kalkulátorok addig is elérhetők.';

/** `explicit`: a link előválasztást vagy tesztkódot ad (?kod, ?mod, ?feladat, ?tema, ?hossz); `rawCode`: a tesztkód kisbetűsen. */
type Prefill={mode:ResultMode;ids:string[];n:number;topics:TopicId[];code:Config|null;badCode:boolean;explicit:boolean;rawCode:string|null};
function parseSearch(search:string,data:QuizClientData):Prefill{
 let p:URLSearchParams;try{p=new URLSearchParams(search)}catch{p=new URLSearchParams()}
 const all=data.templates.map(t=>t.id);
 const topics=(p.get('tema')??'').split(',').map(x=>x.trim()).filter(isTopic);
 const listed=(p.get('feladat')??'').split(',').map(x=>x.trim()).filter(x=>all.includes(x));
 const byTopic=topics.length?data.templates.filter(t=>(topics as string[]).includes(t.topic)).map(t=>t.id):[];
 const ids=listed.length?listed:byTopic.length?byTopic:all;
 const m=p.get('mod'),mode:ResultMode=m==='vizsga'||m==='hibaim'?m:'gyakorlo';
 const h=Number(p.get('hossz')),n=(LENGTHS as readonly number[]).includes(h)?h:10;
 const raw=p.get('kod'),code=raw?decodeCode(raw):null;
 const explicit=['kod','mod','feladat','tema','hossz'].some(k=>p.has(k));
 return {mode,ids,n,topics,code,badCode:!!raw&&!code,explicit,rawCode:raw?raw.trim().toLowerCase():null};
}


/** A sziget: az URL-ből (kliensoldalon) újramountolt űrlap; SSR-en és hidratáláskor az alapállapot. */
export function QuizApp({data}:{data:QuizClientData}){
 const search=useSyncExternalStore(subscribeUrl,getSearch,()=>null);
 return <QuizInner key={search??'ssr'} data={data} prefill={parseSearch(search??'',data)} client={search!==null}/>;
}

function QuizInner({data,prefill,client}:{data:QuizClientData;prefill:Prefill;client:boolean}){
 const rt=useSyncExternalStore(subscribeRuntime,()=>runtime,()=>null);
 const failed=useSyncExternalStore(subscribeRuntime,()=>runtimeFailed,()=>false);
 const metaOf=useMemo(()=>new Map(data.templates.map(m=>[m.id,m])),[data]);
 const stats=useKbStore(statStore),results=useKbStore(resultStore);
 const [busy,setBusy]=useState(false);

 // A futó vagy befejezett teszt a sessionStorage-ből (ha ugyanahhoz a kiadáshoz tartozik). Újratöltéskor (az URL a teszt saját kódja vagy
 // ?mod=hibaim, illetve nincs paraméter) folytatódik; ha egy link mást kér (pl. „Teszteld magad”, másik tesztkód), a befejezett teszt
 // eredménye helyett az új beállítás jelenik meg, a megkezdett teszt pedig nem vész el: „Folytatás” gombbal visszavehető.
 const [restored]=useState(()=>{
  const none={sess:null as Session|null,stale:false,paused:null as Session|null};
  if(!client)return none;
  const s=readSession();
  if(!s)return none;
  if(s.release!==data.release){clearSession();return {...none,stale:true}}
  const own=!prefill.explicit||(!!prefill.rawCode&&prefill.rawCode===s.code)||(!prefill.rawCode&&s.mode==='hibaim'&&prefill.mode==='hibaim');
  if(own)return {...none,sess:s};
  if(s.done){clearSession();return none}
  return {...none,paused:s};
 });
 const [sess,setSess]=useState<Session|null>(restored.sess);
 const [paused,setPaused]=useState<Session|null>(restored.paused);
 const [codeView,setCodeView]=useState<Config|null>(()=>restored.sess?null:prefill.code);
 const persist=(s:Session|null)=>{setSess(s);if(s)writeSession(s);else clearSession()};
 // Megkezdett vagy befejezett teszthez a futtató azonnal kell; tesztkódos linknél előtöltjük (az indítás valószínű).
 useEffect(()=>{if(sess||codeView)prefetch(data)},[sess,codeView,data]);

 // A „Minden Tudástár-adat törlése” a futó tesztet is törli.
 useEffect(()=>{const h=()=>{clearSession();resultStore.reset();statStore.reset();setSess(null);setPaused(null)};window.addEventListener(KB_CLEARED_EVENT,h);return ()=>window.removeEventListener(KB_CLEARED_EVENT,h)},[]);

 const questions=useMemo(()=>sess&&rt?rt.mod.questionsOf(sess,rt.pool):null,[sess,rt]);
 const broken=!!questions&&questions.some(q=>!q);

 /** A futtató betöltése után új teszt (vagy „Hibáim”) indul; a betöltés idejére a gomb foglalt. */
 function launch(make:(r:Runtime)=>Session|null,empty:string,url:(s:Session)=>string){
  setBusy(true);
  loadRuntime(data).then(r=>{
   const s=make(r);
   if(!s){showToast(empty);return}
   setPaused(null);persist(s);setCodeView(null);setUrl(url(s));
  },()=>showToast(LOAD_ERROR)).finally(()=>setBusy(false));
 }
 const start=(cfg:Config,label:string)=>launch(r=>r.mod.testSession(cfg,label,data.release,r.pool),'Ehhez a beállításhoz most nincs kérdés.',s=>'?kod='+s.code);
 const startMistakes=(n:number)=>launch(r=>r.mod.mistakesSession(n,data.release,r.pool),'Nincs hibás válaszod a mostani feladatokban.',()=>'?mod=hibaim');
 function newTest(){persist(null);setCodeView(null);setUrl('')}

 if(!client)return <div className="kk-quiz" aria-busy="true"><p className="kk-muted">A teszt betöltése…</p></div>;
 if(sess){
  if(!rt)return failed?<div className="kk-quiz"><p className="kk-callout kk-callout-warn" role="alert">{LOAD_ERROR}</p><p><button type="button" className="kk-button primary" onClick={()=>prefetch(data)}>Újra</button></p></div>
   :<div className="kk-quiz" aria-busy="true"><p className="kk-muted">A teszt betöltése…</p></div>;
  if(broken||!questions)return <div className="kk-quiz"><p className="kk-callout kk-callout-warn" role="alert">A megkezdett teszt egy feladata már nem érhető el (a feladatok azóta frissültek).</p><button type="button" className="kk-button primary" onClick={newTest}>Új teszt</button></div>;
  const qs=questions.filter(q=>!!q);
  const {RunView,ResultView}=rt.mod;
  return sess.done?<ResultView sess={sess} qs={qs} metaOf={metaOf} onNew={newTest} onRepeat={()=>{const c=sess.code?decodeCode(sess.code):null;if(c)start({...c,release:data.release},sess.label)}} onMistakes={()=>startMistakes(Math.min(10,Math.max(5,sess.refs.length)))} hasMistakes={rt.mod.hasMistakes(rt.pool)}/>
   :<RunView sess={sess} qs={qs} metaOf={metaOf} update={persist} finish={()=>persist(rt.mod.finishedSession(sess,qs))} onAbort={newTest}/>;
 }
 const mistakes=stats.filter(st=>st.w>0&&(st.id.startsWith('tpl:')?data.templates.some(m=>'tpl:'+m.id===st.id&&m.version===st.v):data.bank.live)).length;
 return <SetupView data={data} prefill={prefill} mistakes={mistakes} busy={busy} stats={stats} results={results} stale={restored.stale} codeView={codeView} badCode={prefill.badCode}
  paused={paused} onResume={()=>{if(!paused)return;setSess(paused);setPaused(null);setCodeView(null);setUrl(paused.code?'?kod='+paused.code:paused.mode==='hibaim'?'?mod=hibaim':'')}} onDiscard={()=>{clearSession();setPaused(null)}}
  onStart={start} onMistakes={startMistakes} onPrefetch={()=>prefetch(data)} onOpenCode={(c,raw)=>{setCodeView(c);setUrl('?kod='+raw)}} onCloseCode={()=>{setCodeView(null);setUrl('')}}/>;
}

// ---------------------------------------------------------------------------------------------------- Beállítás
function SetupView({data,prefill,mistakes,busy,stats,results,stale,codeView,badCode,paused,onResume,onDiscard,onStart,onMistakes,onPrefetch,onOpenCode,onCloseCode}:{data:QuizClientData;prefill:Prefill;mistakes:number;busy:boolean;stats:readonly Stat[];results:readonly QuizResult[];stale:boolean;codeView:Config|null;badCode:boolean;paused:Session|null;onResume:()=>void;onDiscard:()=>void;onStart:(c:Config,label:string)=>void;onMistakes:(n:number)=>void;onPrefetch:()=>void;onOpenCode:(c:Config,raw:string)=>void;onCloseCode:()=>void}){
 const ids=data.templates.map(t=>t.id);
 const [mode,setMode]=useState<ResultMode>(prefill.mode);
 const [chosen,setChosen]=useState<string[]>(prefill.ids);
 const [n,setN]=useState(prefill.n);
 const [timerOn,setTimerOn]=useState(true);
 const [factor,setFactor]=useState<number>(1);
 const [codeText,setCodeText]=useState('');const [codeError,setCodeError]=useState('');
 const [confirmClear,setConfirmClear]=useState(false);
 const effMode:ResultMode=mode==='hibaim'&&!mistakes?'gyakorlo':mode;
 const minutes=Math.ceil(timerFor(n)*factor);
 const uid=useId();
 const byTopic=TOPICS.map(t=>({...t,items:data.templates.filter(m=>m.topic===t.id)})).filter(t=>t.items.length);
 const toggle=(id:string)=>setChosen(c=>c.includes(id)?c.filter(x=>x!==id):[...c,id]);
 const what=chosen.length===ids.length?'Számolós feladatok':chosen.length===1?data.templates.find(t=>t.id===chosen[0])!.title:chosen.length+' feladattípus';
 const submit=(e:React.FormEvent)=>{
  e.preventDefault();
  if(effMode==='hibaim'){onMistakes(n);return}
  if(!chosen.length)return;
  onStart({mode:effMode as Mode,n,timer:effMode==='vizsga'&&timerOn?minutes:0,scope:{kind:'sablon',ids:chosen},seed:randomSeed(),release:data.release},(effMode==='vizsga'?'Vizsga':'Gyakorló')+' · '+what+' · '+n+' kérdés');
 };
 const openCode=(e:React.FormEvent)=>{
  e.preventDefault();
  const raw=codeText.trim().replace(/^.*[?&]kod=/,'').replace(/[&#].*$/,'');
  const cfg=decodeCode(raw);
  if(!cfg){setCodeError('Ez nem érvényes tesztkód. Formája például: g10-s1ff-1kx9q2-7f3a1c2b.');return}
  setCodeText('');onOpenCode(cfg,encodeCode(cfg));
 };
 const blocked=sessionStorageBlocked()||resultStore.blocked()||statStore.blocked();
 return <div className="kk-quiz">
  {stale&&<p className="kk-callout kk-callout-info" role="status">A korábban megkezdett teszt a feladatok egy régebbi kiadásához tartozott, ezért nem folytatható. Kezdj újat!</p>}
  {paused&&<div className="kk-callout kk-callout-info kk-quiz-paused" role="status"><div><p><b>Van egy megkezdett teszted:</b> {paused.label} – {paused.answers.filter(a=>a?.length).length}/{paused.refs.length} megválaszolva.</p>
   <p className="kk-quiz-actions"><button type="button" className="kk-button primary" onClick={onResume}>Folytatom</button><button type="button" className="kk-button" onClick={onDiscard}>Elvetem</button></p></div></div>}
  {badCode&&<p className="kk-callout kk-callout-warn" role="alert">A linkben szereplő tesztkód érvénytelen. Állíts össze új tesztet, vagy ellenőrizd a kódot.</p>}
  {codeView&&<CodePanel cfg={codeView} data={data} busy={busy} onStart={onStart} onClose={onCloseCode}/>}
  {!codeView&&<form className="kk-quiz-setup" onSubmit={submit} aria-labelledby={uid+'-h'} onFocus={onPrefetch} onPointerDown={onPrefetch} aria-busy={busy||undefined}>
   <h2 id={uid+'-h'}>Új teszt</h2>
   <fieldset className="kk-field kk-seg"><legend>Mód</legend><div>
    {(['gyakorlo','vizsga','hibaim'] as const).map(m=><label key={m} className={effMode===m?'on':undefined}><input type="radio" name={uid+'-mod'} value={m} checked={effMode===m} disabled={m==='hibaim'&&!mistakes} onChange={()=>setMode(m)}/>{MODE_LABEL[m]}{m==='hibaim'&&<span className="kk-opt">{' ('+mistakes+')'}</span>}</label>)}
   </div>
    <p className="kk-help">{effMode==='gyakorlo'?'Minden kérdés után azonnal látod, jó-e a válaszod, a magyarázatot, a levezetést és a kapcsolódó cikket.':effMode==='vizsga'?'Időre megy, a válaszokat a végén értékeljük; közben a kérdések között szabadon lépkedhetsz, és megjelölheted, amire vissza akarsz térni.':'Azok a feladattípusok, amelyeknél korábban hibáztál – más számokkal, a gyakrabban elrontottak nagyobb eséllyel.'}</p>
   </fieldset>
   {effMode!=='hibaim'&&<fieldset className="kk-field kk-quiz-types"><legend>Feladattípusok <span className="kk-opt">({chosen.length}/{ids.length})</span></legend>
    <p className="kk-quiz-all"><button type="button" className="kk-link" onClick={()=>setChosen(ids)}>Mind</button> · <button type="button" className="kk-link" onClick={()=>setChosen([])}>Egyik sem</button></p>
    {byTopic.map(t=><div key={t.id} className="kk-quiz-topic"><p className="kk-quiz-topic-title">{t.label}</p>
     {t.items.map(m=><label key={m.id} className="kk-check"><input type="checkbox" checked={chosen.includes(m.id)} onChange={()=>toggle(m.id)}/><span>{m.title}{m.draft&&<span className="kk-badge draft">Tervezet</span>}<small><br/>{m.short}</small></span></label>)}
    </div>)}
    {!chosen.length&&<p className="kk-field-error" role="alert">Válassz legalább egy feladattípust.</p>}
   </fieldset>}
   <fieldset className="kk-field kk-seg"><legend>Kérdések száma</legend><div>
    {LENGTHS.map(x=><label key={x} className={n===x?'on':undefined}><input type="radio" name={uid+'-n'} value={x} checked={n===x} onChange={()=>setN(x)}/>{x}</label>)}
   </div></fieldset>
   {effMode==='vizsga'&&<fieldset className="kk-field"><legend>Időkorlát</legend>
    <label className="kk-check"><input type="checkbox" checked={timerOn} onChange={e=>setTimerOn(e.target.checked)}/><span>Időkorlát bekapcsolva <small>(5 és 1 perccel a vége előtt jelzünk; menet közben hosszabbítható vagy kikapcsolható)</small></span></label>
    {timerOn&&<label className="kk-quiz-minutes"><span>Idő:</span><select className="kk-select" value={factor} onChange={e=>setFactor(Number(e.target.value))}>{TIMER_CHOICES.map(f=><option key={f} value={f}>{Math.ceil(timerFor(n)*f)} perc{f===1?' (alap: kérdésenként másfél perc)':''}</option>)}</select></label>}
   </fieldset>}
   <p className="kk-help">Saját, nem hivatalos gyakorlási küszöb: {Math.round(PASS_THRESHOLD*100)} %. Az eredményt csak ez a böngésző tárolja.</p>
   <p><button type="submit" className="kk-button primary" disabled={busy||effMode!=='hibaim'&&!chosen.length}>{effMode==='vizsga'?'Vizsga indítása':effMode==='hibaim'?'Hibáim gyakorlása':'Gyakorlás indítása'} <ArrowRight aria-hidden="true"/></button></p>
   {blocked&&<p className="kk-muted" role="note">A böngésző most nem engedi a mentést: a teszt működik, de az eredmény és a megkezdett teszt a lap bezárásával elvész.</p>}
  </form>}
  <form className="kk-quiz-code" onSubmit={openCode}>
   <label htmlFor={uid+'-code'}>Van tesztkódod? <small className="kk-muted">Ugyanazt a kérdéssort kapod, amit a küldője.</small></label>
   <div className="kk-input-row"><input id={uid+'-code'} value={codeText} onChange={e=>{setCodeText(e.target.value);setCodeError('')}} autoComplete="off" spellCheck={false} inputMode="text" placeholder="g10-s1ff-…" aria-invalid={codeError?true:undefined} aria-describedby={codeError?uid+'-code-err':undefined}/><button type="submit" className="kk-button">Megnyitás</button></div>
   {codeError&&<p className="kk-field-error" id={uid+'-code-err'}>{codeError}</p>}
  </form>
  <History results={results} stats={stats} data={data} confirm={confirmClear} setConfirm={setConfirmClear}/>
 </div>;
}

function CodePanel({cfg,data,busy,onStart,onClose}:{cfg:Config;data:QuizClientData;busy:boolean;onStart:(c:Config,label:string)=>void;onClose:()=>void}){
 const ids=cfg.scope.kind==='sablon'?cfg.scope.ids.filter(id=>data.templates.some(t=>t.id===id)):[];
 const titles=ids.map(id=>data.templates.find(t=>t.id===id)!.title);
 const missing=cfg.scope.kind==='sablon'?cfg.scope.ids.length-ids.length:0;
 const topicsOk=cfg.scope.kind==='tema'?cfg.scope.topics.filter(t=>data.bank.topics.some(b=>b.id===t)):[];
 const usable=cfg.scope.kind==='sablon'?ids.length>0:topicsOk.length>0;
 const sameRelease=cfg.release===data.release;
 const label=(cfg.mode==='vizsga'?'Vizsga':'Gyakorló')+' · tesztkódból · '+cfg.n+' kérdés';
 const headRef=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{toTop(headRef.current)},[]);
 const go=()=>onStart({...cfg,scope:cfg.scope.kind==='sablon'?{kind:'sablon',ids}:{kind:'tema',topics:topicsOk},release:data.release},label);
 return <section className="kk-quiz-codepanel" aria-labelledby="kodpanel-cim">
  <h2 id="kodpanel-cim" ref={headRef} tabIndex={-1}>Teszt tesztkódból</h2>
  <dl className="kk-quiz-facts">
   <div><dt>Mód</dt><dd>{cfg.mode==='vizsga'?'Vizsga':'Gyakorló'}</dd></div>
   <div><dt>Kérdések</dt><dd>{cfg.n}</dd></div>
   {cfg.mode==='vizsga'&&<div><dt>Időkorlát</dt><dd>{cfg.timer?cfg.timer+' perc':'nincs'}</dd></div>}
   <div><dt>Feladatok</dt><dd>{cfg.scope.kind==='sablon'?titles.join(', ')||'–':topicsOk.map(topicLabel).join(', ')||'–'}</dd></div>
  </dl>
  {!sameRelease&&<p className="kk-callout kk-callout-info" role="note">A kód a feladatok egy korábbi kiadásához készült: ugyanazzal a beállítással indul, de a kérdések eltérhetnek a küldőétől.</p>}
  {missing>0&&<p className="kk-muted">{missing} feladattípus azóta nem érhető el, ezért kimarad.</p>}
  {!usable&&<p className="kk-callout kk-callout-warn" role="alert">A kódban szereplő feladatok most nem érhetők el.</p>}
  <p className="kk-quiz-notice-inline"><ClipboardCheck aria-hidden="true"/>{QUIZ_NOTICE}</p>
  <p className="kk-quiz-actions"><button type="button" className="kk-button primary" disabled={busy||!usable} onClick={go}>Teszt indítása <ArrowRight aria-hidden="true"/></button><button type="button" className="kk-button" onClick={onClose}>Inkább új tesztet állítok össze</button></p>
 </section>;
}

function History({results,stats,data,confirm,setConfirm}:{results:readonly QuizResult[];stats:readonly Stat[];data:QuizClientData;confirm:boolean;setConfirm:(b:boolean)=>void}){
 if(!results.length&&!stats.length)return null;
 const per=data.templates.map(m=>({m,st:stats.find(s=>s.id==='tpl:'+m.id)})).filter(x=>x.st);
 return <section className="kk-quiz-history" aria-labelledby="eredmenyek-cim">
  <h2 id="eredmenyek-cim">Korábbi eredményeid</h2>
  <p className="kk-muted">Csak ebben a böngészőben tároljuk (legfeljebb 50 eredmény); fiók nem kell, a szerverre nem kerül.</p>
  {!!results.length&&<ul className="kk-quiz-results">{results.slice(0,10).map(r=><li key={r.at}><span><b>{r.pct} %</b> · {r.ok}/{r.n}{r.pass?' · küszöb felett':''}</span><small>{r.label} · {dateText(r.at)}</small>{r.code&&<a href={PATH+'?kod='+r.code}>Újra ezzel a kóddal</a>}</li>)}</ul>}
  {!!per.length&&<details className="kk-quiz-stats"><summary>Feladattípusonként</summary>
   <div className="kk-table-wrap" tabIndex={0} role="region" aria-label="Feladattípusonkénti statisztika"><table className="kk-table"><thead><tr><th scope="col">Feladattípus</th><th scope="col">Válasz</th><th scope="col">Hibás</th><th scope="col">Helyes sorozat</th></tr></thead>
    <tbody>{per.map(({m,st})=><tr key={m.id}><th scope="row">{m.title}</th><td>{st!.n}</td><td>{st!.w}</td><td>{st!.s}</td></tr>)}</tbody></table></div>
  </details>}
  {confirm?<div className="kk-confirm" role="group" aria-label="Törlés megerősítése"><span>Biztosan törlöd a teszteredményeidet és a statisztikát?</span><button type="button" className="kk-button danger" onClick={()=>{clearQuiz();setConfirm(false);showToast('A teszteredmények törölve.')}}><Trash2 aria-hidden="true"/> Igen, törlöm</button><button type="button" className="kk-button" onClick={()=>setConfirm(false)}>Mégse</button></div>
   :<button type="button" className="kk-button" onClick={()=>setConfirm(true)}><Trash2 aria-hidden="true"/> Eredmények törlése</button>}
 </section>;
}

