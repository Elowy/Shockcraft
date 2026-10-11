// A Tesztek motorja (tiszta modul, zod és hálózat nélkül; kliensen is fut): kérdésépítés sablonból és a kérdésbankból, determinisztikus
// összeállítás seedből (mulberry32), témakvóta legnagyobb maradék módszerrel, ismétlésmentesség, súlyozás (w = h · r), pontozás és tesztkód.
//
// Ismétlésmentesség egy teszten belül: nincs azonos azonosítójú kérdés (sablonnál: azonos paraméterkészlet) és – a kérdésbanknál –
// azonos családú (family) kérdés. Egy sablon több kérdést adhat (más paraméterekkel); a sablonok egyenletesen oszlanak el, és két
// egymást követő kérdés nem ugyanabból a sablonból származik, ha ez elkerülhető.
// Súlyozás: w = h · r; h = 1 + a hibás válaszok száma (legfeljebb 5), r = 1 / (1 + a sorozatban helyes válaszok száma) (legfeljebb 5);
// a kérdés vagy a sablon verzióváltása nullázza. A „Hibáim” mód ezzel választ; a Gyakorló és a Vizsga mód a tesztkódból egyértelműen
// újraépíthető (csak a seedtől, a beállításoktól és a kiadástól függ), ezért ott nincs személyes súlyozás.
import {runCalc,type CalcDef,type Raw,type Step} from '@/lib/calc/core';
import {BLUEPRINT,PASS_THRESHOLD} from './gate';
import {mulberry32,nextSeed,shuffle,type Rng} from './rng';
import {paramKey,pickParams,shownValue,templateById,validParams,type Params,type Template} from './templates';
import type {TopicId} from './topics';

export type QuestionType='single'|'multi'|'truefalse';
export type Choice={id:string;text:string;correct:boolean;why?:string;value?:number};
export type Question={
 /** Egyedi a teszten belül (sablonnál a paraméterkészlettel). */
 key:string;
 /** A statisztika kulcsa: sablonnál „tpl:<sablon>”, a kérdésbanknál a kérdés azonosítója. */
 item:string;version:number;family?:string;topic:TopicId;type:QuestionType;difficulty:1|2|3;
 stem:string;choices:Choice[];explanation:string;steps?:readonly Step[];
 source:{kind:'tpl';template:string;calc:string;raw:Raw}|{kind:'bank';ref:string;calc?:string};
};
/** A kiadott (jóváhagyott) bankkérdés – a belső lektori mezők (review, source) nélkül (scripts/quiz-release.ts). */
export type BankQuestion={id:string;version:number;topic:TopicId;difficulty:1|2|3;type:QuestionType;stem:string;figure?:{kind:string;id:string};
 choices:readonly {id:string;text:string;correct:boolean;why?:string}[];explanation:string;ref:string;calc?:string;shuffle:boolean;family?:string};

/** Két érték legalább `rel` arányban eltér (a nagyobbikhoz mérve). */
export const apart=(a:number,b:number,rel=0.05)=>Math.abs(a-b)>=rel*Math.max(Math.abs(a),Math.abs(b));
export const DISTRACTORS=3;
export const tplItem=(id:string)=>'tpl:'+id;

/** Kérdés egy sablonból: a helyes érték és a levezetés runCalc-ból; három tévesztő a sablon hibamodelljeiből (a kérdés saját seedjével
 * kiválasztva), mind formázva, egyedi, egymástól és a helyestől legalább 5 %-ban eltérő (a kiírt értéken is), növekvő sorrendben.
 * Ha a paraméterekkel ez nem teljesíthető (vagy a kalkulátor nem számol), null – a hívó másik paraméterkészletet választ. */
export function buildTemplateQuestion(t:Template,def:CalcDef,p:Params,seed:number):Question|null{
 if(def.slug!==t.calc||!validParams(t,p))return null;
 const raw=t.raw(p),run=runCalc(def,raw);
 if(!run.ok)return null;
 const res:Record<string,number>=Object.fromEntries(run.out.results.map(r=>[r.id,r.value]));
 const ok=res[t.result];
 if(!(ok>0)||!Number.isFinite(ok))return null;
 const shown=(text:string)=>t.shown?t.shown(text):shownValue(text,t.unit);
 const okText=t.fmt(ok,p),picked:{id:string;why:string;value:number;text:string}[]=[];
 if(!(shown(okText)>0))return null;
 // A tévesztők sorrendje a kérdés seedjéből; előbb a valószerű nagyságrendűek (legfeljebb 30-szoros eltérés, vagy azonos számjegyek más
 // előtaggal: „2,841 W” a „2,841 kW” mellett), utána a többi saját hibamodell, végül a helyiérték-hiba tartaléka.
 const rng=mulberry32(seed),mant=(s:string)=>s.slice(0,s.lastIndexOf('\u00a0'));
 const cands=shuffle(t.models.filter(m=>!m.when||m.when(p,res)),rng).map(m=>({m,v:m.value(p,ok,res)}))
  .filter(c=>Number.isFinite(c.v)&&c.v>0&&(t.min===undefined||c.v>=t.min)).map(c=>({...c,text:t.fmt(c.v,p)}));
 const plausible=(c:{v:number;text:string})=>Math.max(c.v/ok,ok/c.v)<=30||mant(c.text)===mant(okText);
 for(const c of [...cands.filter(c=>!c.m.fallback&&plausible(c)),...cands.filter(c=>!c.m.fallback&&!plausible(c)),...cands.filter(c=>c.m.fallback)]){
  if(picked.length>=DISTRACTORS)break;
  const sv=shown(c.text);
  if(!(sv>0)||[{value:ok,text:okText},...picked].some(x=>x.text===c.text||!apart(x.value,c.v)||!apart(shown(x.text),sv)))continue;
  picked.push({id:c.m.id,why:c.m.why,value:c.v,text:c.text});
 }
 if(picked.length<DISTRACTORS)return null;
 const choices:Choice[]=[{id:'ok',text:okText,correct:true,value:ok},...picked.map(c=>({id:c.id,text:c.text,correct:false,why:'Ez az eredmény jön ki, ha '+c.why+'.',value:c.value}))].sort((a,b)=>a.value!-b.value!);
 return {key:t.id+':'+paramKey(p),item:tplItem(t.id),version:t.version,topic:t.topic,type:'single',difficulty:t.difficulty,
  stem:t.stem(p,res),choices,explanation:t.explain(p,okText,res),steps:run.out.steps,source:{kind:'tpl',template:t.id,calc:t.calc,raw}};
}

/** Kérdés a kérdésbankból: a válaszok sorrendje a kérdés seedjével keverve (shuffle: true), különben a rögzített sorrend. */
export function buildBankQuestion(q:BankQuestion,seed:number):Question{
 const choices=q.choices.map(c=>({id:c.id,text:c.text,correct:c.correct,...(c.why?{why:c.why}:{})}));
 return {key:q.id,item:q.id,version:q.version,...(q.family?{family:q.family}:{}),topic:q.topic,type:q.type,difficulty:q.difficulty,stem:q.stem,
  choices:q.shuffle?shuffle(choices,mulberry32(seed)):choices,explanation:q.explanation,source:{kind:'bank',ref:q.ref,...(q.calc?{calc:q.calc}:{})}};
}

// ---------------------------------------------------------------------------------------------------- Kvóta (legnagyobb maradék)
/** `n` elem elosztása a súlyok arányában, legnagyobb maradék módszerrel; a felső korlátot (`caps`) elérő tétel kiesik, a maradék a
 * többi között oszlik el újra. Döntetlennél a seedből kevert sorrend dönt. Az eredmény összege min(n, Σ korlát a pozitív súlyúakra). */
export function allocate(weights:readonly number[],n:number,rng:Rng,caps?:readonly number[]):number[]{
 const k=weights.length,out=new Array<number>(k).fill(0),cap=(i:number)=>caps?Math.max(0,caps[i]):Infinity;
 const rank=new Array<number>(k);shuffle([...Array(k).keys()],rng).forEach((i,r)=>{rank[i]=r});
 let left=Math.max(0,Math.floor(n));
 for(let round=0;left>0&&round<=k;round++){
  const open=[...Array(k).keys()].filter(i=>weights[i]>0&&out[i]<cap(i));
  if(!open.length)break;
  const W=open.reduce((s,i)=>s+weights[i],0),quota=open.map(i=>left*weights[i]/W),add=quota.map(Math.floor);
  let rest=left-add.reduce((s,x)=>s+x,0);
  for(const j of open.map((_,j)=>j).sort((a,b)=>(quota[b]-add[b])-(quota[a]-add[a])||rank[open[a]]-rank[open[b]])){if(rest<=0)break;add[j]++;rest--}
  let given=0;open.forEach((i,j)=>{const g=Math.min(add[j],cap(i)-out[i]);out[i]+=g;given+=g});
  left-=given;if(!given)break;
 }
 return out;
}

/** Sorrend, amelyben két szomszédos elem nem ugyanabból a csoportból származik, ha ez elkerülhető (a csoporton belüli sorrend megmarad). */
export function interleave<T>(groups:ReadonlyMap<string,readonly T[]>,rng:Rng):T[]{
 const left=new Map([...groups].map(([k,v])=>[k,[...v]] as [string,T[]]).filter(([,v])=>v.length)),out:T[]=[];let prev:string|null=null;
 while(left.size){
  const total=[...left.values()].reduce((s,v)=>s+v.length,0),keys=[...left.keys()];
  const forced=keys.find(k=>k!==prev&&2*left.get(k)!.length>total);
  let pick=forced;
  if(!pick){
   const cand=keys.filter(k=>k!==prev),from=cand.length?cand:keys,W=from.reduce((s,k)=>s+left.get(k)!.length,0);
   let r=rng()*W;pick=from[from.length-1];
   for(const k of from){r-=left.get(k)!.length;if(r<0){pick=k;break}}
  }
  const list=left.get(pick)!;out.push(list.shift()!);if(!list.length)left.delete(pick);prev=pick;
 }
 return out;
}

// ---------------------------------------------------------------------------------------------------- Beállítás, tesztkód (lib/quiz/code.ts)
export {LENGTHS,MAX_N,TEMPLATE_IDS,canonical,decodeCode,encodeCode,timerFor,type Config,type Mode,type Scope} from './code';
import type {Config} from './code';

// ---------------------------------------------------------------------------------------------------- Összeállítás
/** Egy kérdés újraépíthető leírása (a futó teszt ezt tárolja): sablon + paraméterek + seed, vagy bankkérdés + seed. */
export type Ref={t:string;p:Params;s:number}|{q:string;s:number};
export type Pool={templates:readonly Template[];defs:Readonly<Record<string,CalcDef>>;bank:readonly BankQuestion[];blueprint?:Readonly<Record<string,number>>};

export function questionFor(ref:Ref,pool:Pool):Question|null{
 if('t' in ref){const t=pool.templates.find(x=>x.id===ref.t),def=t&&pool.defs[t.calc];return t&&def?buildTemplateQuestion(t,def,ref.p,ref.s):null}
 const q=pool.bank.find(x=>x.id===ref.q);return q?buildBankQuestion(q,ref.s):null;
}

/** `count` különböző, érvényes paraméterkészlet egy sablonhoz (a már használt kulcsok kihagyásával). */
function drawTemplate(t:Template,def:CalcDef,count:number,rng:Rng,used:Set<string>):Ref[]{
 const out:Ref[]=[];
 for(let tries=0;out.length<count&&tries<count*60+60;tries++){
  const p=pickParams(t,rng),key=t.id+':'+paramKey(p);
  if(used.has(key))continue;
  const s=nextSeed(rng);
  if(!buildTemplateQuestion(t,def,p,s))continue;
  used.add(key);out.push({t:t.id,p,s});
 }
 return out;
}

/** A kérdéssor a beállításból és a kiadás tartalmából (determinisztikus: ugyanaz a seed ugyanazt a sort adja). */
export function buildTest(cfg:Config,pool:Pool):Ref[]{
 const rng=mulberry32(cfg.seed);
 if(cfg.scope.kind==='sablon'){
  const ids=cfg.scope.ids,list=pool.templates.filter(t=>ids.includes(t.id)&&pool.defs[t.calc]);
  if(!list.length)return [];
  const counts=allocate(list.map(()=>1),cfg.n,rng),used=new Set<string>(),groups=new Map<string,Ref[]>();
  list.forEach((t,i)=>groups.set(t.id,drawTemplate(t,pool.defs[t.calc],counts[i],rng,used)));
  // Ritka hiány (kevés érvényes paraméterkészlet): a többi sablon pótolja.
  let missing=cfg.n-[...groups.values()].reduce((s,v)=>s+v.length,0);
  for(const t of list){if(missing<=0)break;const extra=drawTemplate(t,pool.defs[t.calc],missing,rng,used);groups.get(t.id)!.push(...extra);missing-=extra.length}
  return interleave(groups,rng);
 }
 const topics=cfg.scope.topics.filter(t=>pool.bank.some(q=>q.topic===t));
 const byTopic=topics.map(t=>shuffle(pool.bank.filter(q=>q.topic===t),rng));
 const caps=byTopic.map(qs=>new Set(qs.map(q=>q.family??q.id)).size);
 const counts=allocate(topics.map(t=>(pool.blueprint??BLUEPRINT)[t]??1),cfg.n,rng,caps);
 const ids=new Set<string>(),families=new Set<string>(),out:Ref[]=[];
 const take=(q:BankQuestion)=>{const f=q.family??q.id;if(ids.has(q.id)||families.has(f))return false;ids.add(q.id);families.add(f);out.push({q:q.id,s:nextSeed(rng)});return true};
 topics.forEach((_,i)=>{let c=counts[i];for(const q of byTopic[i]){if(c<=0)break;if(take(q))c--}});
 // Ha egy család több témakörbe is átnyúlt, a hiányt a megmaradt kérdések pótolják.
 for(const qs of byTopic)for(const q of qs){if(out.length>=cfg.n)break;take(q)}
 return shuffle(out,rng);
}

// ---------------------------------------------------------------------------------------------------- Statisztika, súlyozás, „Hibáim”
/** Kérdésenkénti (sablonnál sablononkénti) statisztika: v = a kérdés verziója, n = válaszok, w = hibás válaszok, s = helyes sorozat, t = utolsó válasz ideje. */
export type Stat={id:string;v:number;n:number;w:number;s:number;t:number};
export function itemWeight(stat:Stat|undefined,version:number){
 if(!stat||stat.v!==version)return 1;
 return (1+Math.min(stat.w,5))/(1+Math.min(stat.s,5));
}
export function updateStat(prev:Stat|undefined,id:string,version:number,correct:boolean,now:number):Stat{
 const base=prev&&prev.v===version?prev:{id,v:version,n:0,w:0,s:0,t:now};
 return {id,v:version,n:base.n+1,w:base.w+(correct?0:1),s:correct?base.s+1:0,t:now};
}
/** A „Hibáim” kérdéssora: azok a tételek, amelyekre (a mostani verzióban) volt hibás válasz, súlyozott véletlen sorrendben (w = h · r);
 * sablon többször is sorra kerülhet (más paraméterekkel, a súlya minden húzás után feleződik), bankkérdés egyszer. */
export function buildMistakes(n:number,stats:readonly Stat[],pool:Pool,seed:number):Ref[]{
 const rng=mulberry32(seed),used=new Set<string>(),out:Ref[]=[];
 type Item={st:Stat;t?:Template;q?:BankQuestion;left:number;w:number};
 const items=stats.flatMap((st):Item[]=>{
  if(st.w<=0)return [];
  if(st.id.startsWith('tpl:')){const t=pool.templates.find(x=>tplItem(x.id)===st.id);return t&&pool.defs[t.calc]&&st.v===t.version?[{st,t,left:Math.ceil(n/2),w:itemWeight(st,t.version)}]:[]}
  const q=pool.bank.find(x=>x.id===st.id);return q&&st.v===q.version?[{st,q,left:1,w:itemWeight(st,q.version)}]:[];
 });
 while(out.length<n){
  const open=items.filter(i=>i.left>0);if(!open.length)break;
  let r=rng()*open.reduce((s,i)=>s+i.w,0),pick=open[open.length-1];
  for(const i of open){r-=i.w;if(r<0){pick=i;break}}
  if(pick.t){const got=drawTemplate(pick.t,pool.defs[pick.t.calc],1,rng,used);if(got.length){out.push(got[0]);pick.left--;pick.w/=2}else pick.left=0}
  else{out.push({q:pick.q!.id,s:nextSeed(rng)});pick.left=0}
 }
 return out;
}
export const mistakeCount=(stats:readonly Stat[],pool:Pool)=>stats.filter(st=>st.w>0&&(st.id.startsWith('tpl:')?pool.templates.some(t=>tplItem(t.id)===st.id&&t.version===st.v&&!!pool.defs[t.calc]):pool.bank.some(q=>q.id===st.id&&q.version===st.v))).length;

// ---------------------------------------------------------------------------------------------------- Pontozás
const sameSet=(a:readonly string[],b:readonly string[])=>a.length===b.length&&a.every(x=>b.includes(x));
/** Helyes-e a válasz: pontosan a helyes válaszlehetőségek vannak megjelölve (egyválasztósnál egy). A megválaszolatlan kérdés hibás. */
export const isCorrect=(q:Question,answer:readonly string[]|null|undefined)=>!!answer&&answer.length>0&&sameSet(answer,q.choices.filter(c=>c.correct).map(c=>c.id));
export function score(qs:readonly Question[],answers:readonly (readonly string[]|null)[]){
 const ok=qs.filter((q,i)=>isCorrect(q,answers[i])).length,n=qs.length,ratio=n?ok/n:0;
 return {ok,n,ratio,pct:Math.round(ratio*100),pass:n>0&&ratio>=PASS_THRESHOLD-1e-9};
}
/** Egy sablon – a kliens a kiadott sablonok közül választ (a szerver adja át a listát), ez csak a tárolóból visszaolvasott hivatkozás ellenőrzése. */
export const knownTemplate=(id:string)=>!!templateById(id);
