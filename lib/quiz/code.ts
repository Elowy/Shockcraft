// A teszt beállítása és a tesztkód (tiszta, kicsi modul, kliensen is fut): a Tesztek oldalának kezdeti csomagja ezt használja (a ?kod=
// linkek értelmezése, a beállítás), a motor (lib/quiz/engine.ts), a sablonok és a kalkulátorok csak a teszt indításakor töltődnek be.
// A tesztkód a sablonok és a témakörök rögzített sorrendjére épülő bitmaszkot tartalmaz: új sablon csak a lista VÉGÉRE kerülhet.
import {TOPIC_IDS,type TopicId} from './topics';

/** A számolós sablonok azonosítói a rögzített sorrendben – azonos a lib/quiz/templates.ts TEMPLATES sorrendjével (tests/quiz.ts). */
export const TEMPLATE_IDS=['ohm-aram','ohm-ellenallas','teljesitmeny-1f','aram-1f-cosfi','aram-3f','vezetek-ellenallas','feszultseges-1f','soros-eredo','parhuzamos-eredo','fogyasztas-koltseg','kismegszakito-valasztas','zs-max'] as const;

// ---------------------------------------------------------------------------------------------------- Beállítás, tesztkód
export type Mode='gyakorlo'|'vizsga';
export type Scope={kind:'sablon';ids:readonly string[]}|{kind:'tema';topics:readonly TopicId[]};
/** A teszt teljes leírása: a tesztkód ebből készül, és ebből (a kiadás tartalmával) a kérdéssor egyértelműen újraépíthető. */
export type Config={mode:Mode;n:number;timer:number;scope:Scope;seed:number;release:string};
export const LENGTHS=[5,10,20] as const;
export const MAX_N=50;
/** Az alapértelmezett időkorlát (perc): kérdésenként másfél perc, felfelé kerekítve. */
export const timerFor=(n:number)=>Math.ceil(n*1.5);
const maskOf=(ids:readonly string[],order:readonly string[])=>order.reduce((m,id,i)=>ids.includes(id)?m+2**i:m,0);
const idsOf=(mask:number,order:readonly string[])=>order.filter((_,i)=>Math.floor(mask/2**i)%2===1);
/** Kanonikus alak: a sablonok és a témakörök a rögzített sorrendben, ismétlés nélkül. */
export function canonical(c:Config):Config{
 const scope:Scope=c.scope.kind==='sablon'?{kind:'sablon',ids:TEMPLATE_IDS.filter(id=>c.scope.kind==='sablon'&&c.scope.ids.includes(id))}:{kind:'tema',topics:TOPIC_IDS.filter(t=>c.scope.kind==='tema'&&c.scope.topics.includes(t))};
 return {mode:c.mode,n:c.n,timer:c.mode==='vizsga'?c.timer:0,scope,seed:c.seed>>>0,release:c.release};
}
/** Tesztkód: „<mód><kérdésszám>[t<perc>]-<s|t><bitmaszk>-<seed>-<kiadás>”, pl. „g10-s1ff-1kx9q2-7f3a1c2b”. Csak [a-z0-9-], URL-be írható. */
export function encodeCode(c:Config):string{
 const k=canonical(c),mask=k.scope.kind==='sablon'?'s'+maskOf(k.scope.ids,TEMPLATE_IDS).toString(36):'t'+maskOf(k.scope.topics,TOPIC_IDS).toString(36);
 return (k.mode==='vizsga'?'v':'g')+k.n+(k.mode==='vizsga'&&k.timer>0?'t'+k.timer:'')+'-'+mask+'-'+k.seed.toString(36)+'-'+k.release;
}
const CODE=/^([gv])(\d{1,2})(?:t(\d{1,3}))?-([st])([0-9a-z]{1,4})-([0-9a-z]{1,7})-([0-9a-f]{8})$/;
/** A tesztkód értelmezése; érvénytelen kódra null (ismeretlen bit, túl nagy szám, időkorlát gyakorló módban …). */
export function decodeCode(raw:string):Config|null{
 const m=CODE.exec((raw??'').trim().toLowerCase());if(!m)return null;
 const mode:Mode=m[1]==='v'?'vizsga':'gyakorlo',n=Number(m[2]),timer=m[3]===undefined?0:Number(m[3]),mask=parseInt(m[5],36),seed=parseInt(m[6],36);
 if(n<1||n>MAX_N||String(n)!==m[2]||(m[3]!==undefined&&(mode!=='vizsga'||timer<1||timer>300||String(timer)!==m[3])))return null;
 if(!(seed>=0&&seed<=0xffffffff)||seed.toString(36)!==m[6])return null;
 const order=m[4]==='s'?TEMPLATE_IDS:TOPIC_IDS;
 if(!(mask>0)||mask>=2**order.length||mask.toString(36)!==m[5])return null;
 const scope:Scope=m[4]==='s'?{kind:'sablon',ids:idsOf(mask,TEMPLATE_IDS)}:{kind:'tema',topics:idsOf(mask,TOPIC_IDS) as TopicId[]};
 return {mode,n,timer,scope,seed,release:m[7]};
}
