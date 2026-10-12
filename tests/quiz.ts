// Tesztek (vizsgaszimuláció, docs/tudastar-terv.md 7. pont): számolós sablonok 10 000 seedes tulajdonságteszttel (a helyes válasz =
// runCalc, a tévesztők egyediek, legalább 5 %-ban eltérnek egymástól és a helyestől, növekvő sorrend, magyar számformátum), a motor
// determinizmusa, témakvóta (legnagyobb maradék), ismétlésmentesség, súlyozás és „Hibáim”, tesztkód oda-vissza (URL-lel is), pontozás,
// kiadási kapu (a T1-sablon rejtve, amíg a kalkulátora nem közzétett; táblázat-kapu; ujjlenyomat; mutációs próbák), kérdésbank-kapu
// (rejtve 150 alatt; mutációs próba egy ideiglenes másolaton), a kérdésbank forrásának séma-ellenőrzése, azonosítójegyzék (csak bővülhet),
// lektori CSV oda-vissza (UTF-8, Windows-1250, UTF-16LE), tárolás, tiltott kifejezések.
// Futtatás: node --no-warnings --import tsx tests/quiz.ts
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {cpSync,existsSync,mkdirSync,mkdtempSync,readFileSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {runCalc,type CalcDef} from '../lib/calc/core';
import {bySlug,calcFingerprint,releaseInfo as calcReleaseInfo} from '../lib/calc/registry';
import {RELEASES,type ReleaseRecord} from '../lib/calc/release';
import {tablesApproved} from '../lib/sizing-tables';
import {DEF_LOADERS,loadDefs} from '../components/quiz/calc-defs';
import {DISTRACTORS,LENGTHS,MAX_N,TEMPLATE_IDS,allocate,apart,buildBankQuestion,buildMistakes,buildTemplateQuestion,buildTest,canonical,decodeCode,encodeCode,interleave,isCorrect,itemWeight,mistakeCount,questionFor,score,timerFor,tplItem,updateStat,type BankQuestion,type Config,type Pool,type Ref,type Stat} from '../lib/quiz/engine';
import {BANK_MIN_PER_TOPIC,BANK_MIN_TOTAL,BLUEPRINT,PASS_THRESHOLD,QUIZ_SUSPENDED,TEMPLATE_CHECKS,bankLive,templateState} from '../lib/quiz/gate';
import {BANK_LOADERS,BANK_MANIFEST} from '../lib/quiz/release/index';
import {QUIZ_PATH,TEMPLATES,bankState,pendingTemplates,publishedTemplates,quizClientData,quizHref,quizLastModified,quizPublishedCount,quizRelease,staticSample,templateFingerprint,templateInfo,templateSamples,templatesForArticle} from '../lib/quiz/registry';
import {mulberry32,nextSeed,shuffle} from '../lib/quiz/rng';
import {FORBIDDEN,approvedQuestion,forbiddenIn,parseBankFile,questionFingerprint,questionRules,releasedQuestion,type DraftQuestion} from '../lib/quiz/schema';
import {RESULT_MAX,clearSession,quizStorageBlocked,readSession,validResult,validSession,validStat,writeSession,type Session} from '../lib/quiz/storage';
import {T0_TEMPLATES,T1_TEMPLATE_IDS,pickParams,shownValue,validParams,type Template} from '../lib/quiz/templates';
import {T1_TEMPLATES as T1_DEFS} from '../lib/quiz/templates-t1';
import {templateById} from '../lib/quiz/all-templates';
import {QUIZ_NOTICE,TOPICS,TOPIC_IDS,type TopicId} from '../lib/quiz/topics';
import {KB_KEYS,KB_SESSION_KEYS,clearAll,type StorageLike} from '../lib/kb/storage';
import {KB_ARTICLES} from '../lib/kb/content/generated/articles';
import {BANK_DIR,REGISTRY_FILE,allQuestions,extendRegistry,knownTargets,loadBank,readRegistry,registryShrinks,releaseModel,staleRelease} from '../scripts/quiz/bank';
import {PACKAGE_SIZE,applyReviews,readReviewCsv,reviewOutcome,reviewPackages} from '../scripts/quiz/csv';

const ROOT=resolve('.');
const NB='\u00a0';
const def=(t:Template)=>{const d=bySlug(t.calc);assert.ok(d,t.id+': ismeretlen kalkulátor '+t.calc);return d!};
let checks=0;const ok=(c:unknown,m:string)=>{checks++;assert.ok(c,m)};

// ---------------------------------------------------------------------------------------------------- 1. Sablonok: 10 000 seedes tulajdonságteszt
// Magyar számformátum: tizedesvessző, ötjegyűtől ezres csoport nem törő szóközzel (a négyjegyű szám csoportosítás nélkül: „1095 Ft”),
// mértékegység előtt nem törő szóköz; tizedespont és „NaN” nincs.
const HU_NUM=/^(?:\d{1,4}|\d{1,3}(?:\u00a0\d{3})+)(?:,\d+)?\u00a0\S+$/;
const BAD_TEXT=/NaN|Infinity|undefined|null|\[object/;
const SEEDS=10_000;
const models=new Map<string,Set<string>>();
/** A kiírt szám jegyei (vezető és záró nullák, tizedesvessző és ezres tagolás nélkül): „3,833 mA” és „3,833 A” → „3833”. */
const digitsOf=(text:string)=>text.slice(0,text.lastIndexOf(NB)>0?text.lastIndexOf(NB):undefined).replace(/\D/g,'').replace(/^0+/,'').replace(/0+$/,'');
/** Ikerpár a tanuló szemével (a motortól függetlenül): azonos számjegyek, vagy a hányados 10 egész hatványa. */
const twinLike=(a:{text:string;value?:number},b:{text:string;value?:number})=>{const r=Math.log10(a.value!/b.value!),k=Math.round(r);return digitsOf(a.text)===digitsOf(b.text)||(k!==0&&Math.abs(r-k)<Math.log10(1.02))};
for(const t of TEMPLATES){
 const d=def(t);let built=0;
 const used=new Set<string>();models.set(t.id,used);
 // Pozíciós árulkodás (számolás nélküli stratégiák): a helyes válasz helye, és két „tesztírói” stratégia várható találata.
 const pos=[0,0,0,0];let pairGuess=0,outlierGuess=0;
 ok(t.models.length>=DISTRACTORS,t.id+': legalább három hibamodell');
 ok(new Set(t.models.map(m=>m.id)).size===t.models.length&&!t.models.some(m=>m.id==='ok'),t.id+': egyedi hibamodell-azonosítók');
 for(let s=0;s<SEEDS;s++){
  const rng=mulberry32(s),p=pickParams(t,rng),qs=nextSeed(rng);
  ok(validParams(t,p),t.id+': a választott paraméter érvényes');
  const q=buildTemplateQuestion(t,d,p,qs);
  if(!q)continue;
  built++;
  const run=runCalc(d,t.raw(p));
  assert.ok(run.ok,t.id+': runCalc sikeres');
  const res=run.out.results.find(r=>r.id===t.result)!;
  const right=q.choices.filter(c=>c.correct);
  assert.equal(right.length,1,t.id+': pontosan egy helyes');
  assert.equal(q.choices.length,DISTRACTORS+1,t.id+': négy válasz');
  // A helyes érték és a levezetés a kalkulátorból.
  assert.equal(right[0].value,res.value,t.id+': helyes = runCalc');
  assert.equal(right[0].text,t.fmt(res.value,p));
  if(res.text)assert.equal(res.text.replace(/\s*\([^)]*kerekítve\)$/,''),right[0].text,t.id+': a helyes válasz szövege = a kalkulátor eredményszövege');
  assert.deepEqual(q.steps,run.out.steps,t.id+': a levezetés a kalkulátoré');
  assert.ok(q.explanation.includes(right[0].text),t.id+': a magyarázat a helyes értéket mondja');
  // Egyedi, egymástól és a helyestől legalább 5 %-ban eltérő (a pontos és a kiírt értéken is), növekvő sorrend.
  const texts=q.choices.map(c=>c.text),vals=q.choices.map(c=>c.value!),shown=texts.map(x=>t.shown?t.shown(x):shownValue(x,t.unit));
  assert.equal(new Set(texts).size,texts.length,t.id+': egyedi válaszszövegek '+texts.join(' | '));
  for(let i=0;i<vals.length;i++)for(let j=i+1;j<vals.length;j++){
   assert.ok(apart(vals[i],vals[j]),t.id+': legalább 5 % eltérés '+texts[i]+' – '+texts[j]);
   assert.ok(apart(shown[i],shown[j]),t.id+': a kiírt értékek is legalább 5 %-ban eltérnek '+texts[i]+' – '+texts[j]);
  }
  for(let i=1;i<vals.length;i++){assert.ok(vals[i]>vals[i-1],t.id+': növekvő sorrend');assert.ok(shown[i]>shown[i-1],t.id+': a kiírt értékek is növekvők')}
  // Ikerpár (előtaghiba) csak 2 × 2 szerkezetben: vagy nincs, vagy két diszjunkt pár – egyedüli ikerpár a helyes válaszra utalna.
  const k=q.choices.findIndex(c=>c.correct),pairs:[number,number][]=[];pos[k]++;
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)if(twinLike(q.choices[i],q.choices[j]))pairs.push([i,j]);
  assert.ok(!pairs.length||(pairs.length===2&&new Set(pairs.flat()).size===4),t.id+': egyedüli ikerpár '+texts.join(' | '));
  // 1. stratégia (a review mérése): ha van ikerpár, a pár(ok) középső (B/C) tagja, egyébként B vagy C.
  const mid=[...new Set(pairs.flat().filter(x=>x===1||x===2))],g1=mid.length?mid:[1,2];pairGuess+=g1.includes(k)?1/g1.length:0;
  // 2. stratégia: a középértéktől legalább 30-szor távolabbi („kilógó”) válaszok elhagyása, a maradékból véletlen.
  const lg=vals.map(v=>Math.log10(v)),sorted=[...lg].sort((a,b)=>a-b),m=(sorted[1]+sorted[2])/2,keep=[0,1,2,3].filter(i=>Math.abs(lg[i]-m)<Math.log10(30));
  outlierGuess+=keep.includes(k)?1/keep.length:0;
  for(const c of q.choices){
   assert.ok(!BAD_TEXT.test(c.text)&&!/\d\.\d/.test(c.text),t.id+': számformátum '+c.text);
   if(t.unit!=='A'||!t.shown)assert.match(c.text,HU_NUM,t.id+': magyar számformátum '+JSON.stringify(c.text));
   if(!c.correct){assert.ok(c.why?.startsWith('Ez az eredmény jön ki, ha '),t.id+': a tévesztő megnevezett hibamodell');used.add(c.id)}
  }
  for(const s of [q.stem,q.explanation])assert.ok(!BAD_TEXT.test(s)&&!/\d\.\d/.test(s),t.id+': szöveg '+s);
  // Determinizmus: ugyanabból a paraméterből és seedből ugyanaz a kérdés.
  if(s%997===0)assert.deepEqual(buildTemplateQuestion(t,d,p,qs),q,t.id+': determinisztikus');
 }
 // A paraméterhalmazból a kérdések túlnyomó része felépül (a kismegszakítónál a Ib–Iz közé eső névleges áram nem mindig létezik).
 ok(built>=SEEDS*(t.id==='kismegszakito-valasztas'?0.6:0.98),t.id+': elég érvényes kérdés ('+built+'/'+SEEDS+')');
 // A helyes válasz minden helyen (A–D) legalább 10 %-ban és legfeljebb 50 %-ban áll; a számolás nélküli stratégiák legfeljebb 40 %-ot
 // érnek (vak tippelés: 25 %; a review előtti motorral az ohm-aram 98 %, a parhuzamos-eredo helyes válasza 83 %-ban A volt).
 const share=pos.map(x=>x/built);
 ok(share.every(x=>x>=0.1&&x<=0.5),t.id+': a helyes válasz helye A–D: '+share.map(x=>(100*x).toFixed(0)+' %').join(' / '));
 ok(pairGuess/built<=0.4,t.id+': „ikerpár középső tagja, egyébként B vagy C” stratégia: '+(100*pairGuess/built).toFixed(0)+' %');
 ok(outlierGuess/built<=0.4,t.id+': „a kilógó válasz elhagyása” stratégia: '+(100*outlierGuess/built).toFixed(0)+' %');
 ok(used.size>=DISTRACTORS,t.id+': több hibamodell is sorra kerül ('+[...used].join(', ')+')');
}
// Érvénytelen paraméter: nincs kérdés (tárolóból vagy linkből visszaolvasva sem).
{const t=templateById('ohm-aram')!;assert.equal(buildTemplateQuestion(t,def(t),{U:231,R:10},1),null);assert.equal(buildTemplateQuestion(t,def(t),{U:230,R:10,x:1},1),null);assert.equal(buildTemplateQuestion(t,bySlug('teljesitmeny')!,{U:230,R:10},1),null);
 const s=templateById('soros-eredo')!;assert.equal(buildTemplateQuestion(s,def(s),{R:[10,10]},1),null,'ismétlődő ellenállás');assert.equal(buildTemplateQuestion(s,def(s),{R:[10,11]},1),null,'nem E-sorbeli');
 // Valószerű paramétertér (review): 230 V-on legfeljebb 10 A; egész napos üzem csak kis teljesítménnyel; 1,5 mm²-en legfeljebb 16 A.
 for(const [id,p] of [['ohm-aram',{U:230,R:4}],['ohm-aram',{U:230,R:10}],['fogyasztas-koltseg',{P:2200,h:24,c:50}],['fogyasztas-koltseg',{P:2000,h:8,c:50}],['feszultseges-1f',{I:20,L:10,A:1.5}]] as const){
  const tt=templateById(id)!;ok(!validParams(tt,p),id+': valószerűtlen paraméter elutasítva '+JSON.stringify(p));
 }
 ok(validParams(templateById('fogyasztas-koltseg')!,{P:150,h:24,c:50})&&validParams(templateById('feszultseges-1f')!,{I:16,L:10,A:1.5}),'valószerű paraméter elfogadva');}
assert.equal(shownValue('2,07'+NB+'kW','W'),2070);assert.equal(shownValue('6570'+NB+'Ft','Ft'),6570);assert.ok(Number.isNaN(shownValue('2,07 kW','W')));

// ---------------------------------------------------------------------------------------------------- 2. Kapu: sablonok
const T1_TEMPLATES=TEMPLATES.filter(t=>def(t).tier!=='T0').map(t=>t.id);
assert.deepEqual(T1_TEMPLATES.sort(),['feszultseges-1f','kismegszakito-valasztas','zs-max'],'a T1-kalkulátorra épülő sablonok');
// A T1-sablonok külön, lustán töltött modulban (lib/quiz/templates-t1.ts): a T0-modulban csak T0-kalkulátorra épülő sablon van.
assert.deepEqual(T1_DEFS.map(t=>t.id).sort(),[...T1_TEMPLATE_IDS].sort(),'templates-t1.ts = T1_TEMPLATE_IDS');
assert.deepEqual([...T1_TEMPLATE_IDS].sort(),[...T1_TEMPLATES].sort(),'T1_TEMPLATE_IDS = a T1-kalkulátorra épülő sablonok');
ok(T0_TEMPLATES.every(t=>def(t).tier==='T0'),'a T0-modulban csak T0-kalkulátorra épülő sablon');
assert.equal(TEMPLATES.length,T0_TEMPLATES.length+T1_DEFS.length,'minden sablon pontosan egyszer a tesztkód sorrendjében');
// Az elvárt állapot a kalkulátorok kapujából vezetve (nincs beégetett lista): közzétett, ha a kalkulátor közzétett, táblázatosnál
// tablesApproved(), és van egyező belső ellenőrzési rekord.
const expected=TEMPLATES.filter(t=>{const d=def(t);return calcReleaseInfo(d).state==='kozzeteve'&&(!d.tables||tablesApproved())&&TEMPLATE_CHECKS[t.id]?.fingerprint===templateFingerprint(t)&&!QUIZ_SUSPENDED.has(t.id)}).map(t=>t.id);
assert.deepEqual(publishedTemplates().map(t=>t.id),expected,'közzétett sablonok = a kapuból levezetve');
// Minden T0-kalkulátorra épülő sablonnak egyező rekordja van: a sablon vagy a kalkulátor változása itt bukik („újraellenőrzendő”). A T1-kalkulátor
// lektori kiadása után a sablon rekord nélkül „ellenőrzésre vár” – rejtve marad (a szimulált jóváhagyás, tests/approval-simulation.ts, így zöld),
// a belső ellenőrzése után kerül ki; elavult rekord soha nem maradhat.
for(const t of TEMPLATES){
 const d=def(t),i=templateInfo(t),calcOk=calcReleaseInfo(d).state==='kozzeteve'&&(!d.tables||tablesApproved());
 assert.notEqual(i.state,'ujraellenorzendo',t.id+': '+i.reason+' (rögzítendő: '+i.fingerprint+')');
 if(calcOk&&d.tier==='T0')assert.equal(i.state,'kozzeteve',t.id+': '+i.reason+' (rögzítendő: '+i.fingerprint+')');
 else if(calcOk)ok(i.state==='kozzeteve'||i.state==='ellenorzesre-var',t.id+': a T1-kalkulátor kiadása után a sablon belső ellenőrzésre vár vagy közzétett');
 else{assert.notEqual(i.state,'kozzeteve',t.id+': a kalkulátora nem közzétett, a sablon sem lehet');ok(!publishedTemplates().includes(t),t.id+': rejtve')}
 const rec=TEMPLATE_CHECKS[t.id];if(rec){assert.equal(rec.kind,'belso');assert.match(rec.fingerprint,/^[0-9a-f]{8}$/);assert.match(rec.date,/^\d{4}-\d{2}-\d{2}$/)}
}
for(const id of Object.keys(TEMPLATE_CHECKS))ok(templateById(id),'a rekord ismert sablonhoz tartozik: '+id);
// Most: a kilenc T0-sablon közzétett, a három T1-sablon (feszültségesés, kismegszakító-választás, Zs,max) rejtve.
for(const id of T1_TEMPLATES)ok(!publishedTemplates().some(t=>t.id===id)||(calcReleaseInfo(def(templateById(id)!)).state==='kozzeteve'&&!!TEMPLATE_CHECKS[id]),id+': T1-sablon rejtve, amíg a kalkulátora nincs lektorálva (és a sablon belsőleg ellenőrizve)');
ok(publishedTemplates().length===TEMPLATES.length-T1_TEMPLATES.length||Object.values(RELEASES).some(r=>r.kind==='lektoralt'),'a T0-sablonok közzétettek');
assert.deepEqual(pendingTemplates().map(t=>t.id).sort(),TEMPLATES.filter(t=>!publishedTemplates().includes(t)).map(t=>t.id).sort());
// Mutációs próbák (a valódi táblák változatlanok): T1-kalkulátor lektori rekorddal → a sablon belső ellenőrzésre vár; táblázat-kapu; rekorddal közzétett.
{
 const fesz=templateById('feszultseges-1f')!,kis=templateById('kismegszakito-valasztas')!,fd=def(fesz),kd=def(kis);
 const expert=(d:CalcDef):ReleaseRecord=>({kind:'lektoralt',qualification:'próba',date:'2026-10-11',fingerprint:calcFingerprint(d),source:'00000000',approvalRef:'próba'});
 const base:Record<string,ReleaseRecord>={...RELEASES};delete base.feszultseges;delete base.kismegszakito;
 const rec={...base,feszultseges:expert(fd),kismegszakito:expert(kd)};
 assert.equal(templateInfo(fesz,base,true).state,'kalkulatorra-var','lektori rekord nélkül');
 assert.equal(templateInfo(fesz,rec,false).state,fd.tables?'tablazatra-var':'ellenorzesre-var','táblázat-kapu (feszültségesés)');
 assert.equal(templateInfo(kis,rec,false).state,'tablazatra-var','táblázat-kapu (kismegszakító)');
 assert.equal(templateInfo(kis,rec,true).state,'ellenorzesre-var','a kalkulátor kiadása után a sablon is ellenőrzésre vár');
 const chk={[kis.id]:{kind:'belso' as const,by:'próba',date:'2026-10-11',fingerprint:templateFingerprint(kis),note:'próba'}};
 assert.equal(templateInfo(kis,rec,true,chk).state,'kozzeteve','rekorddal közzétett');
 assert.equal(templateInfo(kis,rec,true,chk,new Set([kis.id])).state,'felfuggesztve','felfüggesztés');
 // A sablon (szöveg, hibamodell) vagy a kalkulátor (levezetés) változása új ujjlenyomatot ad → „újraellenőrzendő”.
 const ohm=templateById('ohm-aram')!,od=def(ohm),och={[ohm.id]:{kind:'belso' as const,by:'p',date:'2026-10-11',fingerprint:templateFingerprint(ohm),note:'p'}};
 assert.equal(templateInfo(ohm,RELEASES,true,och).state,'kozzeteve');
 const mutStem={...ohm,stem:(p:Parameters<Template['stem']>[0],r:Parameters<Template['stem']>[1])=>ohm.stem(p,r)+' '};
 assert.notEqual(templateFingerprint(mutStem as Template,od),templateFingerprint(ohm,od),'szövegváltozás → új ujjlenyomat');
 const mutModel={...ohm,models:ohm.models.map((m,i)=>i===0?{...m,why:m.why+'!'}:m)};
 assert.notEqual(templateFingerprint(mutModel as Template,od),templateFingerprint(ohm,od),'hibamodell-változás → új ujjlenyomat');
 const mutDef:CalcDef={...od,compute:i=>{const o=od.compute(i);return {...o,steps:o.steps.map(s=>({...s,label:s.label+' (módosítva)'}))}}};
 assert.notEqual(templateFingerprint(ohm,mutDef),templateFingerprint(ohm,od),'a kalkulátor levezetésének változása → új ujjlenyomat');
 assert.equal(templateState({calcPublished:true,tables:false,tablesOk:false,check:och[ohm.id],fingerprint:'deadbeef',suspended:false}),'ujraellenorzendo');
}

// ---------------------------------------------------------------------------------------------------- 3. Motor: összeállítás, kvóta, ismétlés, kód
const defs=Object.fromEntries(TEMPLATES.map(t=>[t.calc,def(t)]));
const pool:Pool={templates:TEMPLATES,defs,bank:[]};
const tplCfg=(seed:number,ids:readonly string[],n=10,mode:Config['mode']='gyakorlo'):Config=>({mode,n,timer:mode==='vizsga'?timerFor(n):0,scope:{kind:'sablon',ids},seed,release:'0123abcd'});
for(let s=0;s<300;s++){
 const rng=mulberry32(s*31+7),ids=shuffle(TEMPLATES.map(t=>t.id),rng).slice(0,1+(s%TEMPLATES.length)),n=LENGTHS[s%LENGTHS.length];
 const cfg=tplCfg(s,ids,n),a=buildTest(cfg,pool),b=buildTest(cfg,pool);
 assert.deepEqual(a,b,'determinisztikus');
 assert.equal(a.length,n,'a kért számú kérdés ('+ids.join(',')+')');
 const qs=a.map(r=>questionFor(r,pool));
 assert.ok(qs.every(Boolean),'minden kérdés felépül');
 assert.equal(new Set(qs.map(q=>q!.key)).size,n,'nincs ismétlődő kérdés (azonos sablon + paraméter)');
 assert.ok(a.every(r=>'t' in r&&ids.includes(r.t)),'csak a kiválasztott sablonokból');
 // A sablonok egyenletesen oszlanak el (legnagyobb maradék), és két szomszédos kérdés nem ugyanabból a sablonból, ha elkerülhető.
 const per=new Map<string,number>();for(const r of a)if('t' in r)per.set(r.t,(per.get(r.t)??0)+1);
 const counts=[...per.values()];if(ids.length<=n)ok(Math.max(...counts)-Math.min(...counts)<=1||ids.length===1,'egyenletes elosztás');
 const max=Math.max(...counts);if(2*max<=n+1)for(let i=1;i<a.length;i++)assert.notEqual((a[i] as {t:string}).t,(a[i-1] as {t:string}).t,'két szomszédos kérdés nem ugyanabból a sablonból');
}
assert.notDeepEqual(buildTest(tplCfg(1,['ohm-aram','aram-3f']),pool),buildTest(tplCfg(2,['ohm-aram','aram-3f']),pool),'más seed → más teszt');
// Egyetlen sablon, a maximális kérdésszámmal: legfeljebb annyi kérdés, ahány különböző paraméterkészlet van, ismétlés nélkül.
{const r=buildTest(tplCfg(5,['teljesitmeny-1f'],MAX_N),pool);ok(r.length<=40&&r.length>=30,'kevés paraméterkészletnél sem ismétel ('+r.length+')');assert.equal(new Set(r.map(x=>JSON.stringify(x))).size,r.length)}
// Legnagyobb maradék: összeg, arányosság, felső korlát, döntetlen a seedtől.
for(let s=0;s<2000;s++){
 const rng=mulberry32(s),k=1+Math.floor(rng()*10),w=Array.from({length:k},()=>Math.floor(rng()*20)),n=Math.floor(rng()*60),caps=Array.from({length:k},()=>Math.floor(rng()*15));
 const a=allocate(w,n,mulberry32(s)),W=w.reduce((x,y)=>x+y,0);
 assert.equal(a.reduce((x,y)=>x+y,0),W>0?n:0,'összeg');
 if(W>0)a.forEach((x,i)=>assert.ok(Math.abs(x-n*w[i]/W)<1,'arányos: '+x+' ~ '+n*w[i]/W));
 const c=allocate(w,n,mulberry32(s),caps);
 c.forEach((x,i)=>assert.ok(x<=caps[i]&&(w[i]>0||x===0),'korlát'));
 assert.equal(c.reduce((x,y)=>x+y,0),Math.min(n,w.reduce((x,y,i)=>x+(y>0?caps[i]:0),0)),'a maradék a többi között oszlik el');
}
assert.deepEqual(allocate([15,12,12,12,8,10,8,8,7,8],20,mulberry32(1)).reduce((a,b)=>a+b,0),20);
{const g=interleave(new Map([['a',[1,2,3]],['b',[4]],['c',[5,6]]]),mulberry32(3));assert.equal(g.length,6);for(let i=1;i<g.length;i++)assert.ok(!((g[i]<=3)&&(g[i-1]<=3)),'nincs két szomszédos azonos csoport')}
// Tesztkód: oda-vissza (URL-ben is), kanonikus alak, érvénytelen kódok.
for(let s=0;s<10_000;s++){
 const rng=mulberry32(s+99),mode=rng()<0.5?'gyakorlo':'vizsga' as const;
 const scope=rng()<0.6?{kind:'sablon' as const,ids:shuffle(TEMPLATES.map(t=>t.id),rng).slice(0,1+Math.floor(rng()*TEMPLATES.length))}:{kind:'tema' as const,topics:shuffle([...TOPIC_IDS],rng).slice(0,1+Math.floor(rng()*TOPIC_IDS.length)) as TopicId[]};
 const cfg:Config={mode,n:1+Math.floor(rng()*MAX_N),timer:mode==='vizsga'&&rng()<0.8?1+Math.floor(rng()*300):0,scope,seed:Math.floor(rng()*2**32)>>>0,release:Math.floor(rng()*2**32).toString(16).padStart(8,'0')};
 const code=encodeCode(cfg);
 assert.match(code,/^[a-z0-9-]+$/,'URL-be írható');
 assert.deepEqual(decodeCode(code),canonical(cfg),'oda-vissza');
 const url=new URL('https://example.test'+QUIZ_PATH+'?kod='+code);
 assert.deepEqual(decodeCode(url.searchParams.get('kod')!),canonical(cfg),'oda-vissza URL-lel');
 assert.equal(encodeCode(decodeCode(code)!),code,'kanonikus');
}
for(const bad of ['','g10','g0-s1-1-0123abcd','g51-s1-1-0123abcd','g10t5-s1-1-0123abcd','v10t0-s1-1-0123abcd','g10-s0-1-0123abcd','g10-s'+(2**TEMPLATES.length).toString(36)+'-1-0123abcd','g10-s1-1-0123abcg','g10-s1-1-0123abc','g10-x1-1-0123abcd','g010-s1-1-0123abcd','g10-s01-1-0123abcd','g10-s1-01-0123abcd','g10-s1-'+(2**32).toString(36)+'-0123abcd','<script>'])assert.equal(decodeCode(bad),null,'érvénytelen kód: '+bad);
assert.deepEqual(decodeCode(' G10-S1-1-0123ABCD '),decodeCode('g10-s1-1-0123abcd'),'kis- és nagybetű, szóköz');
assert.equal(timerFor(10),15);assert.equal(timerFor(5),8);
assert.deepEqual([...TEMPLATE_IDS],TEMPLATES.map(t=>t.id),'a tesztkód sablonsorrendje (lib/quiz/code.ts) = a TEMPLATES sorrendje (új sablon csak a végére)');

// ---------------------------------------------------------------------------------------------------- 4. Kérdésbank a motorban (szintetikus bank)
const mkQ=(topic:TopicId,i:number,o:Partial<BankQuestion>={}):BankQuestion=>({id:'q-'+topic.slice(0,4).replace(/-/g,'x')+'-'+String(i).padStart(4,'0'),version:1,topic,difficulty:1,type:'single',stem:'Kérdés '+topic+' '+i+'?',
 choices:[{id:'a',text:'Első',correct:true},{id:'b',text:'Második',correct:false,why:'Mert.'},{id:'c',text:'Harmadik',correct:false}],explanation:'Első mondat. Második mondat.',ref:'ohm-torvenye#az-osszefugges',shuffle:true,...o});
const synth:BankQuestion[]=TOPIC_IDS.flatMap((t,ti)=>Array.from({length:12+ti},(_,i)=>mkQ(t,i+1,i<4?{family:t+'-csalad-'+(i%2)}:{})));
const bankPool:Pool={templates:[],defs:{},bank:synth};
for(let s=0;s<200;s++){
 const topics=shuffle([...TOPIC_IDS],mulberry32(s)).slice(0,1+(s%TOPIC_IDS.length)) as TopicId[],n=LENGTHS[s%3];
 const cfg:Config={mode:'vizsga',n,timer:timerFor(n),scope:{kind:'tema',topics},seed:s,release:'0123abcd'};
 const a=buildTest(cfg,bankPool);
 assert.deepEqual(a,buildTest(cfg,bankPool),'determinisztikus (bank)');
 const qs=a.map(r=>questionFor(r,bankPool)!);
 assert.equal(new Set(qs.map(q=>q.item)).size,qs.length,'nincs azonosító-ismétlés');
 const fams=qs.map(q=>q.family).filter(Boolean);assert.equal(new Set(fams).size,fams.length,'nincs családismétlés');
 assert.ok(qs.every(q=>topics.includes(q.topic)),'csak a kiválasztott témakörök');
 const capTotal=topics.reduce((x,t)=>x+new Set(synth.filter(q=>q.topic===t).map(q=>q.family??q.id)).size,0);
 assert.equal(a.length,Math.min(n,capTotal));
 // Témakvóta: a blueprint arányában, legnagyobb maradékkal (a seedből kevert döntetlen-sorrenddel).
 // Ha egy témakör eléri a felső korlátját (a különböző családok számát), a maradék a többi között oszlik el.
 const per=topics.map(t=>qs.filter(q=>q.topic===t).length),W=topics.reduce((x,t)=>x+BLUEPRINT[t],0);
 const caps=topics.map(t=>new Set(synth.filter(q=>q.topic===t).map(q=>q.family??q.id)).size);
 per.forEach((c,i)=>assert.ok(c<=caps[i],'korlát: '+topics[i]));
 if(per.every((c,i)=>c<caps[i]))per.forEach((c,i)=>assert.ok(Math.abs(c-n*BLUEPRINT[topics[i]]/W)<1+1e-9,'kvóta: '+topics[i]+' '+c));
 else checks++;
}
{const q=mkQ('meres',1,{shuffle:false,choices:[{id:'a',text:'A',correct:false},{id:'b',text:'B',correct:false},{id:'c',text:'Egyik sem',correct:true}]});
 assert.deepEqual(buildBankQuestion(q,5).choices.map(c=>c.id),['a','b','c'],'shuffle: false → rögzített sorrend');
 const sh=mkQ('meres',2);const orders=new Set(Array.from({length:30},(_,s)=>buildBankQuestion(sh,s).choices.map(c=>c.id).join('')));ok(orders.size>1,'shuffle: true → kevert sorrend');
 assert.deepEqual(buildBankQuestion(sh,7),buildBankQuestion(sh,7),'a keverés a seedtől függ');}

// ---------------------------------------------------------------------------------------------------- 5. Pontozás, súlyozás, „Hibáim”
{
 const q=buildTemplateQuestion(templateById('ohm-aram')!,def(templateById('ohm-aram')!),{U:230,R:46},1)!;
 assert.ok(isCorrect(q,['ok']));assert.ok(!isCorrect(q,[q.choices.find(c=>!c.correct)!.id]));assert.ok(!isCorrect(q,null));assert.ok(!isCorrect(q,[]));assert.ok(!isCorrect(q,['ok','x']));
 const qs=Array.from({length:10},()=>q);
 assert.equal(PASS_THRESHOLD,0.6);
 assert.deepEqual(score(qs,[...Array(6).fill(['ok']),...Array(4).fill(null)]),{ok:6,n:10,ratio:0.6,pct:60,pass:true},'60 % = megfelelt (saját küszöb)');
 assert.equal(score(qs,[...Array(5).fill(['ok']),...Array(5).fill(['x'])]).pass,false);
 assert.equal(score([],[]).pass,false);
 // w = h · r
 assert.equal(itemWeight(undefined,1),1);
 let st=updateStat(undefined,'tpl:ohm-aram',1,false,1);st=updateStat(st,'tpl:ohm-aram',1,false,2);
 assert.deepEqual(st,{id:'tpl:ohm-aram',v:1,n:2,w:2,s:0,t:2});assert.equal(itemWeight(st,1),3,'a rossz válasz növeli');
 const st2=updateStat(st,'tpl:ohm-aram',1,true,3);assert.equal(st2.s,1);assert.equal(itemWeight(st2,1),1.5,'a helyes sorozat csökkenti');
 assert.equal(itemWeight(st2,2),1,'a verzióváltás nullázza');assert.deepEqual(updateStat(st2,'tpl:ohm-aram',2,true,4),{id:'tpl:ohm-aram',v:2,n:1,w:0,s:1,t:4});
 const stats:Stat[]=[st,{id:tplItem('aram-3f'),v:1,n:3,w:0,s:3,t:1},{id:tplItem('vezetek-ellenallas'),v:9,n:2,w:2,s:0,t:1},{id:synth[0].id,v:1,n:1,w:1,s:0,t:1}];
 const mp:Pool={...pool,bank:synth};
 assert.equal(mistakeCount(stats,mp),2,'csak a hibás és a mostani verziójú tételek');
 const m=buildMistakes(10,stats,mp,42);
 assert.deepEqual(m,buildMistakes(10,stats,mp,42),'determinisztikus');
 ok(m.length>=2&&m.every(r=>'t' in r?r.t==='ohm-aram':r.q===synth[0].id),'csak a hibás tételekből');
 assert.equal(m.filter(r=>'q' in r).length,1,'bankkérdés egyszer');
 assert.equal(new Set(m.map(r=>JSON.stringify(r))).size,m.length,'nincs ismétlés');
 assert.deepEqual(buildMistakes(10,[],mp,1),[]);
}

// ---------------------------------------------------------------------------------------------------- 6. Kérdésbank-kapu és kiadás
assert.equal(BANK_MIN_TOTAL,150);assert.equal(BANK_MIN_PER_TOPIC,10);
{
 const c=(n:number)=>Object.fromEntries(TOPIC_IDS.map(t=>[t,n]));
 ok(!bankLive(c(14),TOPIC_IDS),'140 kérdés: nem él');ok(bankLive(c(15),TOPIC_IDS),'150, témakörönként 15: él');
 ok(!bankLive({...c(20),meres:9},TOPIC_IDS),'egy témakör 10 alatt: nem él');
 ok(!bankLive({...c(10),'alapfogalmak-szamitasok':59},TOPIC_IDS),'149: nem él');ok(bankLive({...c(10),'alapfogalmak-szamitasok':60},TOPIC_IDS),'150: él');
}
// A repó mostani kiadása: a bank NEM él, egyetlen kérdésszöveg sem került a build bemeneteibe.
const bank=loadBank(ROOT),model=releaseModel(bank);
assert.deepEqual(bank.errors,[],'a kérdésbank forrása érvényes (séma, szabályok, hivatkozások)');
assert.deepEqual(staleRelease(ROOT,model.files),[],'a lib/quiz/release kiadás naprakész (node_modules/.bin/tsx scripts/quiz-release.ts build)');
assert.equal(BANK_MANIFEST.live,model.live);assert.equal(BANK_MANIFEST.release,model.manifest.release);
if(!model.live){
 assert.equal(bankState().live,false);assert.deepEqual(Object.keys(BANK_LOADERS),[],'élesedés előtt nincs kérdésbetöltő');
 assert.deepEqual(readdirSync('lib/quiz/release').sort(),['index.ts','manifest.json'],'élesedés előtt nincs témaköri kérdésfájl');
 const outText=readFileSync('lib/quiz/release/index.ts','utf8')+readFileSync('lib/quiz/release/manifest.json','utf8');
 for(const q of allQuestions(bank))ok(!outText.includes(q.stem.slice(0,40)),'a kiadásban nincs kérdésszöveg: '+q.id);
 assert.deepEqual(quizClientData().bank,{live:false,topics:[]},'a kliens adatai között nincs bank');
}
// A build bemenetei (lib, components, app) egyetlen kiadatlan kérdés szövegét sem tartalmazzák (a build kimenetét a tests/kb-dist.mjs,
// a kiszolgált oldalakat a tests/kb-routes.mjs nézi ugyanezekkel a mintákkal: tests/kb-quiz-needles.mjs).
{
 const {quizNeedles,unreleasedQuestions}=await import('./kb-quiz-needles.mjs') as {quizNeedles:()=>string[];unreleasedQuestions:()=>{id:string}[]};
 const released=new Set(Object.values(model.approved).flat().map(q=>q.id)),un=unreleasedQuestions();
 assert.deepEqual(un.map(q=>q.id).sort(),allQuestions(bank).filter(q=>!model.live||!released.has(q.id)).map(q=>q.id).sort(),'a szivárgásőr mintái = a kiadatlan kérdések');
 const walkSrc=(d:string):string[]=>existsSync(d)?readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walkSrc(join(d,e.name)):/\.(ts|tsx|json|css|mjs)$/.test(e.name)?[join(d,e.name)]:[]):[];
 const src=['lib','components','app'].flatMap(walkSrc).map(f=>readFileSync(f,'utf8').replace(/\s+/g,' ')).join('\n');
 const needles=quizNeedles();ok(!un.length||needles.length>=un.length,'szövegminták: '+needles.length);
 for(const n of needles)ok(!src.includes(n),'kiadatlan kérdésszöveg a build bemeneteiben: „'+n.slice(0,60)+'…”');
}
// Mutációs próba egy ideiglenes másolaton: szintetikus jóváhagyott kérdésekkel 150 alatt nem él, 150-nél él, és csak a jóváhagyottak kerülnek ki.
{
 const tmp=mkdtempSync(join(tmpdir(),'quiz-bank-'));
 try{
  if(existsSync(join(ROOT,BANK_DIR)))cpSync(join(ROOT,BANK_DIR),join(tmp,BANK_DIR),{recursive:true});
  const approve=(q:DraftQuestion):DraftQuestion=>({...q,source:'saját',review:{state:'jovahagyott',qualification:'próba lektor',date:'2026-10-11',approvalRef:'próba',fingerprint:questionFingerprint(q)}});
  const write=(perTopic:Record<string,number>)=>{
   for(const t of TOPIC_IDS){
    const f=join(tmp,BANK_DIR,t+'.json'),existing=existsSync(f)?JSON.parse(readFileSync(f,'utf8')):[];
    const drafts=(Array.isArray(existing)?existing:existing.questions) as DraftQuestion[];
    // A valódi kérdések a másolatban vázlatként szerepelnek: a darabszámokat csak a szintetikus jóváhagyottak adják, így a próba a
    // valódi bank lektori jóváhagyásai után is ugyanazt méri (különben az első valódi jóváhagyás hamis bukást okozna).
    const real=drafts.filter(q=>!q.id.startsWith('q-zz-')).map(q=>({...q,review:'lektorra-var',source:'AI-tervezet'}) as DraftQuestion);
    const extra=Array.from({length:perTopic[t]??0},(_,i)=>{const b=mkQ(t,9000+i);return approve({...b,id:'q-zz-'+String(1000*TOPIC_IDS.indexOf(t)+i).padStart(4,'0'),choices:b.choices.map(c=>({...c})),review:'lektorra-var',source:'AI-tervezet'} as unknown as DraftQuestion)});
    writeFileSync(f,JSON.stringify([...real,...extra],null,1));
   }
  };
  write(Object.fromEntries(TOPIC_IDS.map(t=>[t,t==='meres'?9:20])));
  let b=loadBank(tmp);assert.deepEqual(b.errors,[],'a másolat érvényes');let m=releaseModel(b);
  ok(!m.live,'egy témakör 9 kérdéssel: nem él');assert.deepEqual(Object.keys(m.files).sort(),['lib/quiz/release/index.ts','lib/quiz/release/manifest.json']);
  for(const q of allQuestions(b).filter(approvedQuestion))ok(!Object.values(m.files).join('').includes(q.stem),'élesedés előtt kérdésszöveg nincs a kiadásban');
  write(Object.fromEntries(TOPIC_IDS.map(t=>[t,15])));
  b=loadBank(tmp);m=releaseModel(b);
  ok(m.live,'150 jóváhagyott, témakörönként 15: él');assert.equal(m.manifest.total,150);
  assert.equal(Object.keys(m.files).filter(f=>f.endsWith('.json')&&!f.endsWith('manifest.json')).length,TOPIC_IDS.length,'témaköri fájlok');
  const released=JSON.parse(m.files['lib/quiz/release/meres.json']) as Record<string,unknown>[];
  ok(released.every(q=>!('review' in q)&&!('source' in q)&&!('note' in q)&&!('retired' in q)),'a kiadásban nincsenek belső lektori mezők');
  ok(released.every(q=>String(q.id).startsWith('q-zz-')),'csak jóváhagyott kérdés kerül ki (a vázlat nem)');
  assert.match(m.files['lib/quiz/release/index.ts'],/'meres':\(\)=>import\('\.\/meres\.json'\)/,'élesedés után lusta betöltő');
  // A jóváhagyás a tartalomra szól: a szöveg módosítása után a kérdés nem kerül ki.
  const one=allQuestions(b).find(approvedQuestion)!;ok(!approvedQuestion({...one,stem:one.stem+' (módosítva)'}),'módosított kérdés: a jóváhagyás érvénytelen');
  ok(!approvedQuestion({...one,source:'AI-tervezet'}),'„AI-tervezet” forrás nem közzétehető');ok(!approvedQuestion({...one,retired:true}),'visszavont kérdés nem közzétehető');
  ok(!approvedQuestion({...one,review:'lektorra-var'}),'lektorra váró nem közzétehető');
 }finally{rmSync(tmp,{recursive:true,force:true})}
}
// Séma és szabályok.
{
 const base=(o:Record<string,unknown>={})=>({id:'q-alap-9999',version:1,topic:'alapfogalmak-szamitasok',difficulty:1,type:'single',stem:'Mekkora az áram?',choices:[{id:'a',text:'1 A',correct:true},{id:'b',text:'2 A',correct:false},{id:'c',text:'3 A',correct:false}],explanation:'Első mondat. Második mondat.',ref:'ohm-torvenye#az-osszefugges',shuffle:true,review:'lektorra-var',source:'AI-tervezet',...o});
 const errs=(o:Record<string,unknown>)=>{const r=parseBankFile('alapfogalmak-szamitasok.json','alapfogalmak-szamitasok',[base(o)]);return r.errors.join(' | ')};
 assert.equal(errs({}),'');
 for(const [o,re] of [
  [{id:'Q-1'},/id/],[{difficulty:4},/difficulty/],[{choices:[{id:'a',text:'x',correct:true}]},/choices/],[{ref:'ohm-torvenye'},/ref/],[{source:'kitalált'},/source/],[{review:{state:'jovahagyott'}},/review/],[{extra:1},/extra|Unrecognized/],
  [{choices:[{id:'a',text:'1 A',correct:true},{id:'b',text:'2 A',correct:true},{id:'c',text:'3 A',correct:false}]},/pontosan 1 helyes/],
  [{type:'multi'},/legalább 2 helyes/],[{type:'truefalse'},/pontosan 2 válasz/],
  [{choices:[{id:'a',text:'1 A',correct:true},{id:'b',text:'Egyik sem',correct:false},{id:'c',text:'3 A',correct:false}]},/shuffle: false/],
  [{stem:'Melyik állítás nem igaz?'},/NEM/],[{explanation:'Csak egy mondat.'},/két mondat/],[{stem:'Melyik a szabványos megoldás?'},/tiltott kifejezés/],
  [{choices:[{id:'a',text:'1 A',correct:true},{id:'a',text:'2 A',correct:false},{id:'c',text:'3 A',correct:false}]},/ismétlődő válaszazonosító/],
  [{topic:'kapcsolasok'},/eltér a fájlnévtől/],
 ] as [Record<string,unknown>,RegExp][])assert.match(errs(o),re,JSON.stringify(o));
 assert.equal(errs({stem:'Melyik állítás NEM igaz?'}),'','kiemelt NEM rendben');
 assert.equal(errs({shuffle:false,choices:[{id:'a',text:'1 A',correct:true},{id:'b',text:'Egyik sem',correct:false},{id:'c',text:'3 A',correct:false}]}),'','„egyik sem” rögzített sorrenddel rendben');
 // A ref célja: ismert cikk és horgony (a H2 mellett a H3-ak és az ábrák is); R3 csonkra horgony nélkül is.
 const known=knownTargets();
 ok(known.articles.get('kirchhoff-torvenyei')?.includes('szampelda-aram-a-lakaseloszto-fazissinjen'),'H3-horgony is ismert');
 ok(known.articles.has('kismegszakito')&&known.articles.get('kismegszakito')===null,'R3 csonk: horgony nélkül');
 const draft=parseBankFile('x.json','alapfogalmak-szamitasok',[base({ref:'ohm-torvenye#nincs-ilyen'})]);
 assert.equal(draft.errors.length,0);
}
// A forrás: ha van, minden fájl érvényes (fent), az azonosítók egyediek, és egyetlen kérdés sem jóváhagyott a hozzá tartozó ujjlenyomat nélkül.
for(const q of allQuestions(bank)){
 if(typeof q.review==='object')ok(approvedQuestion(q)||q.retired,q.id+': jóváhagyott, de az ujjlenyomat vagy a forrás nem egyezik – újra kell lektorálni');
 assert.deepEqual(questionRules(q),[],q.id);
 assert.deepEqual(forbiddenIn([q.stem,q.explanation,...q.choices.flatMap(c=>[c.text,c.why??''])].join(' ')),[],q.id+': tiltott kifejezés');
 const r=releasedQuestion(q);ok(!('review' in r)&&!('source' in r)&&!('note' in r),'releasedQuestion belső mezők nélkül');
}

// ---------------------------------------------------------------------------------------------------- 7. Azonosítójegyzék (csak bővülhet)
{
 const reg=readRegistry(ROOT);
 for(const q of allQuestions(bank).filter(approvedQuestion))assert.equal(reg.ids[q.id],q.topic,q.id+': jóváhagyott kérdés a jegyzékben');
 let head:string|null=null;try{head=execFileSync('git',['show','HEAD:'+REGISTRY_FILE],{encoding:'utf8',stdio:['ignore','pipe','ignore']})}catch{head=null}
 if(head)assert.deepEqual(registryShrinks(JSON.parse(head),reg),[],'a jegyzék a HEAD-hez képest csak bővülhet');
 const prev={version:1 as const,ids:{'q-alap-0001':'alapfogalmak-szamitasok'}};
 assert.deepEqual(registryShrinks(prev,{version:1,ids:{}}),['q-alap-0001 (alapfogalmak-szamitasok) eltűnt']);
 assert.equal(registryShrinks(prev,{version:1,ids:{'q-alap-0001':'meres'}}).length,1,'témakörváltás');
 const d=parseBankFile('meres.json','meres',[{id:'q-alap-0001',version:1,topic:'meres',difficulty:1,type:'truefalse',stem:'Igaz?',choices:[{id:'i',text:'Igaz',correct:true},{id:'h',text:'Hamis',correct:false}],explanation:'Egy. Kettő.',ref:'ohm-torvenye#az-osszefugges',shuffle:false,review:'lektorra-var',source:'AI-tervezet'}]).questions;
 assert.equal(extendRegistry(prev,d).errors.length,1,'jegyzékbeli azonosító más témakörben (vázlatban sem)');
 assert.deepEqual(extendRegistry(prev,[]).registry,prev,'a régi bejegyzések megmaradnak');
}

// ---------------------------------------------------------------------------------------------------- 8. Lektori CSV (25 kérdéses csomagok, oda-vissza)
{
 const qs:DraftQuestion[]=Array.from({length:60},(_,i)=>{const b=mkQ('meres',i+1);return {...b,id:'q-mer-'+String(i+1).padStart(4,'0'),choices:b.choices.map(c=>({...c})),stem:i===3?'=HYPERLINK("x") – Mekkora; "idézőjel", ékezet: őű?':b.stem,review:'lektorra-var',source:'AI-tervezet'} as DraftQuestion});
 const pk=reviewPackages(qs,'2026-10-11');
 assert.deepEqual(pk.map(p=>[p.file,p.questions.length]),[['meres-01.csv',25],['meres-02.csv',25],['meres-03.csv',10]],'25 kérdéses csomagok');
 ok(pk.every(p=>p.questions.length<=PACKAGE_SIZE),'≤ 25');
 const csv=pk[0].csv;ok(csv.startsWith('\uFEFF')&&csv.includes('\r\n')&&csv.includes(';'),'Excel-barát CSV');
 ok(csv.includes('"\'=HYPERLINK'),'képletvédelem');
 // Kitöltés: fejléc + döntések; oda-vissza UTF-8, Windows-1250 (pontosvessző) és UTF-16LE (tabulátor) kódolásban.
 const filled=csv.replace('"Lektor jogosultsága";""','"Lektor jogosultsága";"villamos tervező (próba)"').replace('"Dátum (ÉÉÉÉ-HH-NN)";""','"Dátum (ÉÉÉÉ-HH-NN)";"2026-10-12"').replace('"Jóváhagyó lap hivatkozása";""','"Jóváhagyó lap hivatkozása";"LK-T1 jóváhagyó lap"')
  .split('\r\n').map(l=>{const m=/^"(\d+)";"(q-mer-\d{4})"/.exec(l);if(!m)return l;const n=Number(m[1]);const dec=n<=20?'jóváhagyom':n<=22?'javítandó':n===23?'Elvetem':'';return l.replace(/;"";""$/,';"'+dec+'";"'+(n===21?'pontosítsd a kérdést':'')+'"')}).join('\r\n');
 const enc1250=(s:string)=>{const map:Record<string,number>={'ő':0xf5,'ű':0xfb,'Ő':0xd5,'Ű':0xdb,'á':0xe1,'é':0xe9,'í':0xed,'ó':0xf3,'ö':0xf6,'ú':0xfa,'ü':0xfc,'Á':0xc1,'É':0xc9,'Í':0xcd,'Ó':0xd3,'Ö':0xd6,'Ú':0xda,'Ü':0xdc,'–':0x96,'„':0x84,'”':0x94,'·':0xb7};return Uint8Array.from([...s.replace(/^\uFEFF/,'')].map(ch=>ch.charCodeAt(0)<128?ch.charCodeAt(0):map[ch]??0x3f))};
 const utf16=(s:string)=>{const b=Buffer.from(s.replace(/^\uFEFF/,'').replace(/";"/g,'"\t"'),'utf16le');return Uint8Array.from([0xff,0xfe,...b])};
 const variants:[string,Uint8Array][]=[['utf-8',new TextEncoder().encode(filled)],['windows-1250',enc1250(filled)],['utf-16le',utf16(filled)]];
 for(const [enc,bytes] of variants){
  const sheet=readReviewCsv(bytes);
  assert.equal(sheet.encoding,enc);assert.deepEqual(sheet.errors,[],enc);
  assert.equal(sheet.package,'meres-01');assert.equal(sheet.qualification,'villamos tervező (próba)');assert.equal(sheet.date,'2026-10-12');
  assert.equal(sheet.rows.length,25);assert.deepEqual(sheet.rows.map(r=>r.id),pk[0].questions.map(q=>q.id),enc+': azonosítók');
  assert.deepEqual(sheet.rows.map(r=>r.fingerprint),pk[0].questions.map(questionFingerprint),enc+': ujjlenyomatok');
  const out=reviewOutcome(sheet,qs);
  assert.deepEqual(out.errors,[]);assert.equal(Object.keys(out.approved).length,20);assert.equal(out.fix.length,2);assert.equal(out.rejected.length,1);assert.equal(out.open.length,2);
  assert.equal(out.fix[0].comment,'pontosítsd a kérdést');
  const a=out.approved['q-mer-0001'];assert.equal(a.fingerprint,questionFingerprint(qs[0]));assert.match(a.approvalRef,/LK-T1 jóváhagyó lap · csomag: meres-01 · \d+\. sor/);
 }
 // A kérdés változott a csomag óta → nem vihető át (és a csomag többi jóváhagyása sem, amíg hibás).
 const changed=qs.map((q,i)=>i===0?{...q,stem:q.stem+'!'}:q);
 const out=reviewOutcome(readReviewCsv(new TextEncoder().encode(filled)),changed);
 ok(out.errors.some(e=>/változott/.test(e))&&!Object.keys(out.approved).length,'módosult kérdés: hiba, nincs átvitel');
 const noMeta=reviewOutcome(readReviewCsv(new TextEncoder().encode(filled.replace('villamos tervező (próba)',''))),qs);
 ok(noMeta.errors.some(e=>/jogosultsága/.test(e)),'kitöltetlen lektori fejléc: hiba');
 assert.match(readReviewCsv(new TextEncoder().encode(filled.replace('"jóváhagyom"','"talán"'))).errors.join(' '),/ismeretlen döntés/);
 // --apply egy ideiglenes másolaton: a review beíródik, a forrás „AI-tervezet, lektorált” lesz, és a kérdés jóváhagyottá válik.
 const tmp=mkdtempSync(join(tmpdir(),'quiz-csv-'));
 try{
  const dir=join(tmp,BANK_DIR);mkdirSync(dir,{recursive:true});
  writeFileSync(join(dir,'meres.json'),JSON.stringify(qs.map(q=>({...q,ref:'ohm-torvenye#az-osszefugges'})),null,2)+'\n');
  const res=reviewOutcome(readReviewCsv(new TextEncoder().encode(filled)),qs);
  assert.deepEqual(applyReviews(tmp,res.approved),[BANK_DIR+'/meres.json']);
  const after=parseBankFile('meres.json','meres',JSON.parse(readFileSync(join(dir,'meres.json'),'utf8')));
  assert.deepEqual(after.errors,[]);
  assert.equal(after.questions.filter(approvedQuestion).length,20,'20 jóváhagyott');
  assert.equal(after.questions.find(q=>q.id==='q-mer-0001')!.source,'AI-tervezet, lektorált');
  assert.equal(after.questions.find(q=>q.id==='q-mer-0021')!.review,'lektorra-var','a javítandó változatlan');
 }finally{rmSync(tmp,{recursive:true,force:true})}
 // A valódi forrás csomagjai (ha van): minden lektorálandó kérdés pontosan egy csomagban.
 const real=reviewPackages(allQuestions(bank),'2026-10-11');
 assert.equal(real.reduce((s,p)=>s+p.questions.length,0),allQuestions(bank).filter(q=>!q.retired&&!approvedQuestion(q)).length);
 for(const p of real){const sheet=readReviewCsv(new TextEncoder().encode(p.csv));assert.deepEqual(sheet.rows.map(r=>r.id),p.questions.map(q=>q.id));assert.deepEqual(sheet.rows.map(r=>r.fingerprint),p.questions.map(questionFingerprint))}
}

// ---------------------------------------------------------------------------------------------------- 9. Tárolás (böngésző nélkül, ál-tárolóval)
class Fake implements StorageLike{m=new Map<string,string>();getItem(k:string){return this.m.get(k)??null}setItem(k:string,v:string){this.m.set(k,v)}removeItem(k:string){this.m.delete(k)}}
class Throwing implements StorageLike{getItem():string|null{throw new DOMException('denied','SecurityError')}setItem(){throw new DOMException('quota','QuotaExceededError')}removeItem(){throw new DOMException('denied','SecurityError')}}
{
 assert.equal(KB_KEYS.quiz,'shockcraft-kb-quiz-v1');assert.equal(KB_SESSION_KEYS.quizSession,'shockcraft-kb-quiz-session');assert.equal(RESULT_MAX,50);
 const r={at:1,mode:'vizsga',n:10,ok:7,pct:70,pass:true,label:'Vizsga · 10 kérdés',code:'v10t15-s1-1-0123abcd'};
 assert.deepEqual(validResult(r),r);
 for(const bad of [{...r,ok:11},{...r,mode:'x'},{...r,pct:101},{...r,label:''},null,42])assert.equal(validResult(bad),null);
 assert.equal(validResult({...r,code:'<script>'})?.code,undefined,'érvénytelen kód eldobva');
 assert.deepEqual(validStat({id:'tpl:ohm-aram',v:1,n:2,w:1,s:0,t:5}),{id:'tpl:ohm-aram',v:1,n:2,w:1,s:0,t:5});
 for(const bad of [{id:'evil',v:1,n:1,w:0,s:0,t:1},{id:'tpl:x',v:0,n:1,w:0,s:0,t:1},{id:'tpl:x',v:1,n:1,w:2,s:0,t:1}])assert.equal(validStat(bad),null);
 const refs:Ref[]=buildTest(tplCfg(9,['ohm-aram','aram-3f'],5),pool);
 const sess:Session={v:1,release:'0123abcd',code:'g5-s11-9-0123abcd',mode:'gyakorlo',label:'Gyakorló',refs,answers:[['ok'],null,null,null,null],checked:[true,false,false,false,false],flagged:[false,false,false,false,false],cur:1,startedAt:1,deadline:null,extended:0,done:false,saved:false};
 assert.deepEqual(validSession(JSON.parse(JSON.stringify(sess))),sess,'a futó teszt oda-vissza');
 for(const bad of [{...sess,cur:5},{...sess,answers:[['ok']]},{...sess,refs:[]},{...sess,release:'x'},{...sess,refs:[{t:'<x>',p:{},s:1}]},{...sess,answers:[['<b>'],null,null,null,null]}])assert.equal(validSession(bad),null);
 const f=new Fake();writeSession(sess,()=>f);assert.deepEqual(readSession(()=>f),sess);
 f.setItem(KB_SESSION_KEYS.quizSession,'{sérült');assert.equal(readSession(()=>f),null,'sérült JSON → nincs futó teszt');
 clearSession(()=>f);assert.equal(f.getItem(KB_SESSION_KEYS.quizSession),null);
 // Lejárt idő: a befejezett teszt jelzője oda-vissza; hibás típus elutasítva.
 assert.deepEqual(validSession(JSON.parse(JSON.stringify({...sess,done:true,expired:true}))),{...sess,done:true,expired:true},'lejárt idő jelzője');
 assert.equal(validSession({...sess,expired:'igen'}),null);
 // Próbaírás (privát mód már induláskor): tiltott tárolónál igaz; működőnél hamis, és nem hagy új kulcsot, a meglévő értéket nem írja át.
 ok(quizStorageBlocked(()=>new Throwing(),()=>new Fake())&&quizStorageBlocked(()=>new Fake(),()=>new Throwing())&&quizStorageBlocked(()=>null,()=>new Fake()),'próbaírás: tiltott tároló');
 {const l=new Fake(),ss=new Fake();ss.setItem(KB_SESSION_KEYS.quizSession,'{"x":1}');ok(!quizStorageBlocked(()=>l,()=>ss),'próbaírás: működő tároló');
  assert.equal(l.getItem(KB_KEYS.quiz),null,'a próba nem hagy új kulcsot');assert.equal(ss.getItem(KB_SESSION_KEYS.quizSession),'{"x":1}','a meglévő értéket megőrzi');}
 // Privát mód: nem dob, a lap memóriájában él tovább.
 assert.doesNotThrow(()=>writeSession(sess,()=>new Throwing()));assert.deepEqual(readSession(()=>new Throwing()),sess);clearSession(()=>new Throwing());assert.equal(readSession(()=>new Throwing()),null);
 // „Minden Tudástár-adat törlése”: a teszteredmények és a futó teszt is.
 const loc=new Fake(),ses=new Fake();loc.setItem(KB_KEYS.quiz,'{"v":1,"results":[]}');loc.setItem('shockcraft-theme','dark');ses.setItem(KB_SESSION_KEYS.quizSession,'{}');
 clearAll(()=>loc,()=>ses);assert.equal(loc.getItem(KB_KEYS.quiz),null);assert.equal(ses.getItem(KB_SESSION_KEYS.quizSession),null);assert.equal(loc.getItem('shockcraft-theme'),'dark','a téma megmarad');
 const legal=readFileSync('components/legal-page.tsx','utf8');for(const k of [KB_KEYS.quiz,KB_SESSION_KEYS.quizSession])ok(legal.includes("'"+k+"'"),'sütitáblázat: '+k);
}

// ---------------------------------------------------------------------------------------------------- 10. Kliensadat, kalkulátor-betöltők, cikklinkek
{
 const data=quizClientData(),json=JSON.stringify(data);
 assert.deepEqual(data.templates.map(t=>t.id),publishedTemplates().map(t=>t.id),'a kliens csak a közzétett sablonokat kapja');
 assert.equal(data.release,quizRelease());assert.match(data.release,/^[0-9a-f]{8}$/);
 for(const t of TEMPLATES.filter(t=>!publishedTemplates().includes(t)))ok(!json.includes(t.title),'a rejtett sablon címe sincs a kliensadatban: '+t.id);
 for(const m of data.templates){ok(m.calcHref==='/kalkulatorok/'+m.calc,'kalkulátorlink');ok(!m.article||m.article.href.startsWith('/tudastar/elmelet/'),'cikklink csak közzétett cikkre');ok(!m.draft,'nem tervezet: '+m.id)}
 assert.equal(quizPublishedCount(),publishedTemplates().length+(bankState().live?BANK_MANIFEST.total:0));
 for(const t of TEMPLATES)ok(DEF_LOADERS[t.calc],'lusta definíció-betöltő: '+t.calc);
 const loaded=await loadDefs(publishedTemplates().map(t=>t.calc));
 for(const t of publishedTemplates())assert.equal(calcFingerprint(loaded[t.calc]),calcFingerprint(def(t)),'a lustán betöltött definíció azonos');
 await assert.rejects(loadDefs(['nincs-ilyen']));
 // „Teszteld magad”: a cikkhez kötött közzétett sablonok; a link célja létező, közzétett cikk és horgony.
 for(const t of TEMPLATES)if(t.article){const a=KB_ARTICLES.find(x=>x.id===t.article!.id);if(a)ok(a.anchors.some(x=>x.id===t.article!.anchor),t.id+': ismert horgony '+t.article.anchor)}
 ok(templatesForArticle('ohm-torvenye').length>=2||!publishedTemplates().length,'az Ohm-törvény cikkhez van gyakorló feladat');
 assert.deepEqual(templatesForArticle('kismegszakito'),[],'R3/T1: nincs „Teszteld magad”');
 // „Teszteld magad” csak közzétett cikkre és csak közzétett sablonnal; a link a sziget előválasztása.
 for(const a of KB_ARTICLES)for(const t of templatesForArticle(a.id))ok(publishedTemplates().includes(t),a.id+': csak közzétett sablon');
 assert.equal(quizHref({feladat:['ohm-aram','ohm-ellenallas'],hossz:5}),QUIZ_PATH+'?feladat=ohm-aram,ohm-ellenallas&hossz=5#teszt','előválasztásnál az űrlapra visz (#teszt)');
 assert.equal(quizHref(),QUIZ_PATH);
 // A JS nélküli mintafeladat: közzétett sablonból, determinisztikus; a sitemap dátuma a rekordokból.
 const sample=staticSample();
 if(publishedTemplates().length){ok(sample&&publishedTemplates().some(t=>t.title===sample.title)&&sample.q.choices.filter(c=>c.correct).length===1,'mintafeladat');assert.deepEqual(staticSample(),sample,'determinisztikus');assert.match(quizLastModified()!,/^\d{4}-\d{2}-\d{2}$/)}
 else assert.equal(sample,null);
}

// ---------------------------------------------------------------------------------------------------- 11. Tiltott kifejezések, kötelező jelölés
{
 assert.equal(QUIZ_NOTICE,'Gyakorló teszt – nem hivatalos vizsgakérdések; az eredmény nem igazolás.');
 assert.deepEqual(forbiddenIn(QUIZ_NOTICE),[],'a kötelező jelölés nem tiltott');
 ok(forbiddenIn('Ezek hivatalos vizsgakérdések.').length>0&&forbiddenIn('szabványos bekötés').length>0&&forbiddenIn('120 V-os hálózat').length>0,'a szűrő működik');
 for(const t of TEMPLATES){
  const texts=[t.title,t.short,...t.models.map(m=>m.why),...templateSamples(t,def(t),20).flatMap(q=>[q.stem,q.explanation,...q.choices.map(c=>c.text+' '+(c.why??''))])];
  for(const s of texts)assert.deepEqual(forbiddenIn(s),[],t.id+': '+s);
 }
 for(const f of ['app/(kezikonyv)/tudastar/tesztek/page.tsx','components/quiz/quiz-app.tsx','components/quiz/quiz-runner.tsx']){
  const src=readFileSync(f,'utf8');
  assert.deepEqual(forbiddenIn(src.replace(/\/\/.*$/gm,'')),[],f+': tiltott kifejezés');
  ok(/QUIZ_NOTICE/.test(src),f+': a kötelező jelölés („'+QUIZ_NOTICE+'”)');
 }
 ok(FORBIDDEN.length>=10,'tiltólista');
 assert.deepEqual(TOPICS.map(t=>t.id),[...TOPIC_IDS]);
}
console.log('PASS: '+TEMPLATES.length+' számolós sablon × '+SEEDS.toLocaleString('hu-HU')+' seed (helyes = runCalc, levezetés a kalkulátorból, 3 tévesztő megnevezett hibamodellből, egyedi, ≥ 5 % eltérés a pontos és a kiírt értéken, növekvő sorrend, magyar számformátum; a helyes válasz helye A–D egyenként 10–50 %, számolás nélküli stratégia ≤ 40 %, ikerpár csak 2 × 2), kapu ('+publishedTemplates().length+' közzétett, rejtve: '+T1_TEMPLATES.join(', ')+'; mutációs próbák), motor (determinizmus, kvóta, ismétlésmentesség, szomszédos sablon, Hibáim, w = h · r), tesztkód oda-vissza (10 000, URL), bank-kapu (150 / 10, ideiglenes másolaton), forrás: '+allQuestions(bank).length+' kérdés, 0 hiba, '+allQuestions(bank).filter(approvedQuestion).length+' jóváhagyott; azonosítójegyzék, lektori CSV (UTF-8, Windows-1250, UTF-16LE), tárolás, tiltott kifejezések ('+checks+' további ellenőrzés).');
