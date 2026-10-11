// A Tesztek vendégtárolása (docs/tudastar-terv.md 3.5): csak a böngészőben, fiók és süti nélkül, a lib/kb/storage.ts mintájára (kézi
// validálás, minden hozzáférés try/catch-ben, sérült JSON → alaphelyzet, kivételt dobó tároló → memóriabeli tartalék és jelzés).
//  - shockcraft-kb-quiz-v1 (localStorage): `results` – legfeljebb 50 teszteredmény; `stats` – kérdésenkénti (sablonnál sablononkénti)
//    statisztika a „Hibáim” módhoz és a súlyozáshoz (w = h · r).
//  - shockcraft-kb-quiz-session (sessionStorage): a futó teszt (újratöltés-álló; a lap bezárásával törlődik).
// A „Minden Tudástár-adat törlése” (lib/kb/storage.ts clearAll) mindkettőt törli. Személyes adat nincs benne: csak kérdés-
// azonosítók, válaszok, pontszámok és időpontok.
import {KB_KEYS,KB_SESSION_KEYS,createStore,type StorageLike} from '@/lib/kb/storage';
import type {Config,Mode,Ref,Stat} from './engine';
import type {Params} from './templates';

export const RESULT_MAX=50;
export const STAT_MAX=2000;
export type ResultMode=Mode|'hibaim';
/** Egy befejezett teszt eredménye (a pontszám és a beállítás, kérdésszöveg nélkül). */
export type QuizResult={at:number;mode:ResultMode;n:number;ok:number;pct:number;pass:boolean;code?:string;label:string};
const MODES:readonly ResultMode[]=['gyakorlo','vizsga','hibaim'];
const CODE_RE=/^[a-z0-9-]{8,60}$/;
const ITEM_RE=/^(?:tpl:[a-z0-9-]{1,60}|q-[a-z]{2,4}-\d{4})$/;
const int=(x:unknown,min:number,max:number):x is number=>typeof x==='number'&&Number.isInteger(x)&&x>=min&&x<=max;

export function validResult(x:unknown):QuizResult|null{
 if(!x||typeof x!=='object')return null;
 const o=x as Record<string,unknown>;
 if(typeof o.at!=='number'||!Number.isFinite(o.at)||!MODES.includes(o.mode as ResultMode)||!int(o.n,1,100)||!int(o.ok,0,o.n as number)||!int(o.pct,0,100)||typeof o.pass!=='boolean')return null;
 if(typeof o.label!=='string'||!o.label.trim()||o.label.length>120)return null;
 const r:QuizResult={at:o.at,mode:o.mode as ResultMode,n:o.n as number,ok:o.ok as number,pct:o.pct as number,pass:o.pass,label:o.label.trim()};
 if(typeof o.code==='string'&&CODE_RE.test(o.code))r.code=o.code;
 return r;
}
export function validStat(x:unknown):Stat|null{
 if(!x||typeof x!=='object')return null;
 const o=x as Record<string,unknown>;
 if(typeof o.id!=='string'||!ITEM_RE.test(o.id)||!int(o.v,1,999)||!int(o.n,1,1e6)||!int(o.w,0,o.n as number)||!int(o.s,0,o.n as number)||typeof o.t!=='number'||!Number.isFinite(o.t))return null;
 return {id:o.id,v:o.v as number,n:o.n as number,w:o.w as number,s:o.s as number,t:o.t};
}

const local=():StorageLike|null=>{try{return typeof window!=='undefined'?window.localStorage:null}catch{return null}};
export const resultStore=createStore<QuizResult>({key:KB_KEYS.quiz,field:'results',version:1,validate:validResult,max:RESULT_MAX,storage:local});
export const statStore=createStore<Stat>({key:KB_KEYS.quiz,field:'stats',version:1,validate:validStat,max:STAT_MAX,storage:local,dedupe:(a,b)=>a.id===b.id});
export const addResult=(r:QuizResult)=>resultStore.set([r,...resultStore.get()]);
/** A statisztika frissítése (a legutóbb érintett tételek elöl; a korlát felett a legrégebbi esik ki). */
export function mergeStats(updated:readonly Stat[]){
 const ids=new Set(updated.map(s=>s.id));
 statStore.set([...updated,...statStore.get().filter(s=>!ids.has(s.id))]);
}
/** Csak a Tesztek adatai (a többi Tudástár-adat – kedvencek, előzmények – megmarad). */
export function clearQuiz(storage:()=>StorageLike|null=local){
 try{storage()?.removeItem(KB_KEYS.quiz)}catch{}
 resultStore.reset();statStore.reset();
}

// ---------------------------------------------------------------------------------------------------- Futó teszt (sessionStorage)
/** A futó teszt: a beállítás, a kérdések újraépíthető leírása (sablon + paraméterek + seed, vagy bankkérdés + seed), a válaszok és az idő. */
export type Session={
 v:1;release:string;
 /** A tesztkód (Gyakorló, Vizsga); „Hibáim” módban nincs (személyes válogatás). */
 code?:string;mode:ResultMode;label:string;
 refs:Ref[];answers:(string[]|null)[];
 /** Gyakorló módban: a kérdés ellenőrizve (a magyarázat látszik). */
 checked:boolean[];
 /** Vizsga módban: megjelölve későbbre. */
 flagged:boolean[];
 cur:number;startedAt:number;
 /** Vizsga: a határidő (ms) vagy null, ha nincs (kikapcsolt) időkorlát; `extended`: hány perccel hosszabbították. */
 deadline:number|null;extended:number;
 /** Befejezett teszt (az eredményoldal is újratöltés-álló); `saved`: az eredmény már a statisztikában van. */
 done:boolean;saved:boolean;
};
const MAX_Q=50;
function validParamsShape(p:unknown):p is Params{
 if(!p||typeof p!=='object'||Array.isArray(p))return false;
 const vals=Object.values(p as Record<string,unknown>);
 return Object.keys(p).length<=8&&vals.every(v=>typeof v==='number'&&Number.isFinite(v)||typeof v==='string'&&v.length<=20||Array.isArray(v)&&v.length<=20&&v.every(x=>typeof x==='number'&&Number.isFinite(x)));
}
function validRef(x:unknown):Ref|null{
 if(!x||typeof x!=='object')return null;
 const o=x as Record<string,unknown>;
 if(!int(o.s,0,0xffffffff))return null;
 if(typeof o.t==='string'&&/^[a-z0-9-]{1,60}$/.test(o.t)&&validParamsShape(o.p))return {t:o.t,p:o.p,s:o.s as number};
 if(typeof o.q==='string'&&/^q-[a-z]{2,4}-\d{4}$/.test(o.q))return {q:o.q,s:o.s as number};
 return null;
}
const ANSWER_ID=/^[a-z0-9-]{1,20}$/;
export function validSession(x:unknown):Session|null{
 if(!x||typeof x!=='object')return null;
 const o=x as Record<string,unknown>;
 if(o.v!==1||typeof o.release!=='string'||!/^[0-9a-f]{8}$/.test(o.release)||!MODES.includes(o.mode as ResultMode)||typeof o.label!=='string'||o.label.length>120)return null;
 if(!Array.isArray(o.refs)||!o.refs.length||o.refs.length>MAX_Q)return null;
 const refs=o.refs.map(validRef);if(refs.some(r=>!r))return null;
 const n=refs.length,arr=(a:unknown)=>Array.isArray(a)&&a.length===n;
 if(!arr(o.answers)||!arr(o.checked)||!arr(o.flagged))return null;
 const answers=(o.answers as unknown[]).map(a=>a===null?null:Array.isArray(a)&&a.length<=5&&a.every(x=>typeof x==='string'&&ANSWER_ID.test(x))?[...a as string[]]:undefined);
 if(answers.some(a=>a===undefined))return null;
 if(!(o.checked as unknown[]).every(b=>typeof b==='boolean')||!(o.flagged as unknown[]).every(b=>typeof b==='boolean'))return null;
 if(!int(o.cur,0,n-1)||typeof o.startedAt!=='number'||!Number.isFinite(o.startedAt)||!(o.deadline===null||typeof o.deadline==='number'&&Number.isFinite(o.deadline))||!int(o.extended,0,600)||typeof o.done!=='boolean'||typeof o.saved!=='boolean')return null;
 if(o.code!==undefined&&(typeof o.code!=='string'||!CODE_RE.test(o.code)))return null;
 return {v:1,release:o.release,...(o.code?{code:o.code as string}:{}),mode:o.mode as ResultMode,label:o.label,refs:refs as Ref[],answers:answers as (string[]|null)[],
  checked:[...o.checked as boolean[]],flagged:[...o.flagged as boolean[]],cur:o.cur as number,startedAt:o.startedAt,deadline:o.deadline as number|null,extended:o.extended as number,done:o.done,saved:o.saved};
}

const session=():StorageLike|null=>{try{return typeof window!=='undefined'?window.sessionStorage:null}catch{return null}};
/** Memóriabeli tartalék, ha a böngésző nem engedi a sessionStorage-et (a teszt így is fut, csak újratöltés után nem folytatható). */
let memory:string|null=null,sessionBlocked=false;
export const sessionStorageBlocked=()=>sessionBlocked;
export function readSession(storage:()=>StorageLike|null=session):Session|null{
 let raw:string|null=memory;
 if(raw===null){try{raw=storage()?.getItem(KB_SESSION_KEYS.quizSession)??null}catch{sessionBlocked=true;raw=null}}
 if(!raw)return null;
 try{return validSession(JSON.parse(raw))}catch{return null}
}
export function writeSession(s:Session,storage:()=>StorageLike|null=session){
 const raw=JSON.stringify(s);
 try{const st=storage();if(!st)throw new Error('nincs tároló');st.setItem(KB_SESSION_KEYS.quizSession,raw);memory=null;sessionBlocked=false}
 catch{memory=raw;sessionBlocked=true}
}
export function clearSession(storage:()=>StorageLike|null=session){
 memory=null;
 try{storage()?.removeItem(KB_SESSION_KEYS.quizSession)}catch{}
}

/** A tesztkódhoz tartozó beállítás és a felirat (eredménylista): „Gyakorló · 10 kérdés”. */
export const configLabel=(c:Pick<Config,'mode'|'n'>,what:string)=>(c.mode==='vizsga'?'Vizsga':'Gyakorló')+' · '+what+' · '+c.n+' kérdés';
