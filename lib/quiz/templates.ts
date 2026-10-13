// Számolós feladatsablonok (docs/tudastar-terv.md 7. pont: a 12 MVP-sablon). Tiszta modul (zod, lib/plan és hálózat nélkül), kliensen is fut.
// A helyes érték és a levezetés MINDIG a kalkulátorból jön: runCalc(def, raw(p)) – a sablon csak a paramétereket, a kérdés szövegét és a
// tévesztőket adja. A definíciót a hívó adja át (a kliens lustán tölti be: components/quiz/calc-defs.ts), így ez a modul egyetlen definíciót sem húz be.
// Paraméterek: diszkrét, valószerű halmazokból. Tévesztők: megnevezett hibamodellekből (√3 kihagyása, fázis/vonali feszültség cseréje,
// cos φ kihagyása, ×2 kihagyása, W/kW, Ω/kΩ, U·R az U/R helyett, rossz m-szorzó …); a válaszok formázás után egyediek, egymástól és a
// helyestől legalább 5 %-ban eltérnek, és növekvő sorrendben jelennek meg (lib/quiz/engine.ts buildTemplateQuestion; tests/quiz.ts).
// A helyes válasz helye ne a hibamodellek irányától függjön: minden sablonnak legyen a helyesnél kisebb és nagyobb értéket adó, valószerű
// hibamodellje is (a motor a helyes válasz tervezett helyéhez választ tévesztőket; tests/quiz.ts sablononként méri a helyek eloszlását).
// Előtaghiba (Model.prefix) csak ikerpárral együtt kerül a válaszok közé (2 × 2), így az ikerpár nem árulja el a helyes választ.
// Közzététel: egy sablon csak akkor látszik, ha a kalkulátora közzétett (lib/calc/release.ts; táblázatosnál tablesApproved() is), és
// a sablon belső ellenőrzési rekordja egyezik (lib/quiz/gate.ts) – a T1-kalkulátorra épülő sablon így a kalkulátorral együtt élesedhet.
// A sorrend a tesztkód bitmaszkjának alapja: új sablon csak a lista VÉGÉRE kerülhet, azonosító nem változhat.
import type {Raw} from '@/lib/calc/core';
import {MATERIALS,NOMINAL} from '@/lib/calc/constants';
import {formatFixed,formatNum,formatSI,parseNum} from '@/lib/calc/number';
import type {TopicId} from './topics';
import {oneOf,randInt,shuffle,type Rng} from './rng';

export type ParamValue=number|string|readonly number[];
export type Params=Readonly<Record<string,ParamValue>>;
/** A kalkulátor eredményei azonosító szerint (alapegységben). */
export type Results=Readonly<Record<string,number>>;
/** Megnevezett hibamodell: `why` a hiba leírása („Ez az eredmény jön ki, ha …”); `value` a hibás számítás eredménye; `fallback`: általános
 * tartalék (helyiérték-hiba), csak akkor kerül sorra, ha a sablon saját hibamodelljeiből nem jön ki három megfelelő tévesztő.
 * `prefix`: előtaghiba – a helyes érték ennyiszerese (1000 vagy 1/1000), a helyes válasz „ikerpárja”. A motor csak úgy teszi a válaszok
 * közé, ha egy másik tévesztő előtaghibás párját is (a két hiba együtt: „…, és <prefix why>”), ezért a `why`-nak bármely hibamodell után
 * helyesnek kell lennie (a végeredményre vagy egy, minden hibamodellben lineárisan szereplő bemenetre vonatkozzon). `solo`: ehhez a
 * hibamodellhez nem képezhető előtaghibás pár (a hibája maga is átváltási hiba). */
export type Model<P>={id:string;why:string;value:(p:P,ok:number,res:Results)=>number;when?:(p:P,res:Results)=>boolean;fallback?:boolean;prefix?:number;solo?:boolean};
export type Template<P=Params>={
 id:string;title:string;short:string;topic:TopicId;
 /** A kalkulátor slugja (lib/calc/defs) és a helyes válasz eredményazonosítója. */
 calc:string;result:string;unit:string;
 difficulty:1|2|3;version:number;
 /** A kapcsolódó Tudástár-cikk és horgony (a link csak közzétett cikkre jelenik meg). */
 article?:{id:string;anchor:string};
 /** Független, diszkrét paraméterhalmazok; ha nincs, a sablon saját `pick`/`valid` párt ad (pl. ellenálláslista). `space` mellett a
  * `valid` szűrő is megadható (pl. 230 V-hoz csak valószerű ellenállás): a választás ekkor a halmazokból, a szűrőnek megfelelőig ismételve. */
 space?:Readonly<Record<string,readonly (number|string)[]>>;
 pick?:(rng:Rng)=>P;valid?:(p:P)=>boolean;
 raw:(p:P)=>Raw;
 stem:(p:P,res:Results)=>string;
 /** A válasz kiírása – a helyesnél azonos a kalkulátor eredményszövegével (tests/quiz.ts). */
 fmt:(v:number,p:P)=>string;
 /** A kiírt szám alapegységben (az 5 %-os eltérés a kiírt értékeken is teljesül); alapból a szám és az SI-előtag a kiírásból. */
 shown?:(text:string)=>number;
 explain:(p:P,ok:string,res:Results)=>string;
 models:readonly Model<P>[];
 /** A válaszlehetőség legkisebb értéke (alapegységben), pl. 10 Ft – a kerekítés ne torzítsa a kiírást. */
 min?:number;
};

export const NB='\u00a0';
export const si=(n:number,unit:string)=>formatSI(n,unit);
/** Szám és mértékegység nem törő szóközzel („230 V”): a szöveg sem a szám és a mértékegység között törik (320 px-en sem). */
export const uu=(n:number,unit:string,d?:number)=>formatNum(n,d)+NB+unit;
const huf=(n:number)=>formatFixed(n,0)+NB+'Ft';
const num=(n:number)=>formatNum(n);
export const SQRT3=Math.sqrt(3),SQRT2=Math.SQRT2;
export const U1=NOMINAL.phase,UV=NOMINAL.line;
export const V1=uu(U1,'V'),VV=uu(UV,'V');
const sinOf=(cos:number)=>Math.sqrt(Math.max(0,1-cos*cos));
/** „a, b és c” felsorolás. */
const list=(xs:readonly string[])=>xs.length<2?xs.join(''):xs.slice(0,-1).join(', ')+' és '+xs[xs.length-1];
const COUNT=['','egy','két','három','négy'];

const PREFIX:Readonly<Record<string,number>>={G:1e9,M:1e6,k:1e3,'':1,m:1e-3,'µ':1e-6,n:1e-9,p:1e-12};
/** A kiírt érték visszaolvasása („2,07 kW” → 2070; „6570 Ft” → 6570): a szám és az SI-előtag a mértékegység előtt. Hibánál NaN. */
export function shownValue(text:string,unit:string):number{
 const i=text.lastIndexOf(NB);if(i<0)return NaN;
 const n=parseNum(text.slice(0,i)),tail=text.slice(i+1);
 if(!n.ok||!tail.endsWith(unit))return NaN;
 const f=PREFIX[tail.slice(0,tail.length-unit.length)];
 return f===undefined?NaN:n.value*f;
}

/** Típusos sablondefiníció (a paramétertípus a sablonon belül ellenőrzött; a listában közös alakban tároljuk). */
export function template<P extends Params>(t:Template<P>):Template{return t as unknown as Template}
/** Előtaghiba (a helyes érték ezerszerese vagy ezredrésze) – csak ikerpárral együtt kerül a válaszok közé (lib/quiz/engine.ts). */
const prefixError=<P,>(id:string,factor:number,why:string,when?:(p:P,res:Results)=>boolean):Model<P>=>({id,why,value:(_p,ok)=>ok*factor,prefix:factor,...(when?{when}:{})});
/** A végeredmény előtaghibájának leírása, a kiíráshoz illő példával (pl. 0,2 A = „200 mA” → „mA helyett A”). */
const resultPrefix=(factor:number,example:string)=>'az eredmény előtagját elvétjük ('+(factor>1?'ezerszeres érték':'ezredrész')+', például '+example+')';

const sum=(xs:readonly number[])=>xs.reduce((s,x)=>s+x,0);
const parallel=(xs:readonly number[])=>1/xs.reduce((s,x)=>s+1/x,0);
/** A kiírt mantissza (kΩ-nál az ezredrész): a „csak a számokat adjuk össze” hiba modellje. */
const mantissa=(r:number)=>r>=1000?r/1000:r;
const mixedPrefix=(xs:readonly number[])=>xs.some(x=>x>=1000)&&xs.some(x=>x<1000);
/** Különböző elemű ellenálláslista egy E-sorból (2–`max` tag). */
function pickDistinct(rng:Rng,values:readonly number[],min:number,max:number){
 const k=min+randInt(rng,max-min+1);return shuffle(values,rng).slice(0,k);
}
const validList=(p:{R:readonly number[]},values:readonly number[],min:number,max:number)=>Array.isArray(p.R)&&p.R.length>=min&&p.R.length<=max&&new Set(p.R).size===p.R.length&&p.R.every(r=>values.includes(r));

/** Ohm-törvény: törpefeszültségen (12/24 V) kis ellenállás is valószerű (legfeljebb 12 A); 230 V-on legfeljebb 10 A (2,3 kW) folyik,
 * a legkisebb terhelés egy kb. 23 W-os fogyasztó (2,3 kΩ). */
const R_LOW=[2,3,4,6,8,10,12,15,20,24,30,40,48,60,80,100,120] as const;
const R_230=[23,30,40,46,50,60,75,92,100,115,150,230,330,460,529,1000,2300] as const;
const SERIES_R=[10,22,33,47,68,100,150,220,330,470,680,1000,1500,2200,3300,4700] as const;
const PARALLEL_R=[10,12,15,20,22,30,33,47,56,68,100,120,150,220,330,470,1000] as const;
const RHO_CU=MATERIALS.Cu.rho20,RHO_AL=MATERIALS.Al.rho20,ALPHA_CU=MATERIALS.Cu.alpha;
/** A keresztmetszet értékét átmérőnek véve (mm² ↔ mm) a felület π · d² / 4 – a „mm és mm² összekeverése” hiba modellje. */
export const asDiameter=(A:number)=>Math.PI*A*A/4;

/** A T1-kalkulátorra épülő sablonok azonosítói (a definíciójuk a lib/quiz/templates-t1.ts-ben, amelyet a böngésző csak akkor tölt be,
 * ha a szerver valamelyiket közzétettként adja át – components/quiz/quiz-runner.tsx). Kérdésszöveg nincs itt. */
export const T1_TEMPLATE_IDS=['feszultseges-1f','kismegszakito-valasztas','zs-max'] as const;
/** A T0 (belsőleg ellenőrzött) kalkulátorokra épülő sablonok. Az összes sablon a tesztkód sorrendjében: lib/quiz/all-templates.ts. */
export const T0_TEMPLATES:readonly Template[]=[
 template<{U:number;R:number}>({
  id:'ohm-aram',title:'Áram Ohm törvényével',short:'Feszültségből és ellenállásból az áram: I = U / R.',topic:'alapfogalmak-szamitasok',
  calc:'ohm-torveny',result:'I',unit:'A',difficulty:1,version:1,article:{id:'ohm-torvenye',anchor:'az-osszefugges'},
  space:{U:[12,24,230],R:[...new Set([...R_LOW,...R_230])].sort((a,b)=>a-b)},valid:p=>(p.U===U1?R_230:R_LOW).some(r=>r===p.R),
  raw:p=>({ismert:'UR',U:String(p.U),'U.e':'V',R:String(p.R),'R.e':'ohm'}),
  stem:p=>`Egy ${si(p.R,'Ω')} ellenállású ohmos fogyasztóra ${uu(p.U,'V')} feszültséget kapcsolunk. Mekkora áram folyik át rajta?`,
  fmt:v=>si(v,'A'),
  explain:(p,ok)=>`Ohm törvénye szerint az áram a feszültség és az ellenállás hányadosa: I = U / R. Itt I = ${uu(p.U,'V')} / ${si(p.R,'Ω')} = ${ok}.`,
  models:[
   {id:'szorzas',why:'a feszültséget és az ellenállást összeszorozzuk (U · R) osztás helyett',value:p=>p.U*p.R},
   {id:'forditott',why:'fordítva osztunk (R / U)',value:p=>p.R/p.U},
   {id:'teljesitmeny',why:'az áram helyett a teljesítményt számoljuk ki (U² / R)',value:p=>p.U*p.U/p.R},
   {id:'negyzet',why:'az ellenállás négyzetével osztunk (U / R²)',value:p=>p.U/(p.R*p.R)},
   {id:'csucs',why:`a ${V1}-os effektív érték helyett a csúcsértékkel (${V1} · √2 ≈ ${uu(325,'V')}) számolunk`,value:p=>p.U*SQRT2/p.R,when:p=>p.U===U1},
   {id:'effektiv',why:`a ${V1}-ot csúcsértéknek véve még √2-vel osztjuk`,value:p=>p.U/SQRT2/p.R,when:p=>p.U===U1},
   prefixError<{U:number;R:number}>('ma',1/1000,resultPrefix(1/1000,'A helyett mA'),(_p,r)=>r.I>=1),
   prefixError<{U:number;R:number}>('a',1000,resultPrefix(1000,'mA helyett A'),(_p,r)=>r.I<1),
   prefixError<{U:number;R:number}>('ua',1/1000,resultPrefix(1/1000,'mA helyett µA'),(_p,r)=>r.I<1),
  ],
 }),
 template<{U:number;I:number}>({
  id:'ohm-ellenallas',title:'Ellenállás Ohm törvényével',short:'Feszültségből és áramból az ellenállás: R = U / I.',topic:'alapfogalmak-szamitasok',
  calc:'ohm-torveny',result:'R',unit:'Ω',difficulty:1,version:1,article:{id:'ohm-torvenye',anchor:'az-osszefugges'},
  space:{U:[12,24,230],I:[0.5,1,1.5,2,2.5,4,5,8,10,16]},
  raw:p=>({ismert:'UI',U:String(p.U),'U.e':'V',I:String(p.I),'I.e':'A'}),
  stem:p=>`Egy ohmos fogyasztó ${uu(p.U,'V')} feszültségen ${uu(p.I,'A')} áramot vesz fel. Mekkora az ellenállása?`,
  fmt:v=>si(v,'Ω'),
  explain:(p,ok)=>`Ohm törvényéből az ellenállás a feszültség és az áram hányadosa: R = U / I. Itt R = ${uu(p.U,'V')} / ${uu(p.I,'A')} = ${ok}.`,
  models:[
   {id:'szorzas',why:'a feszültséget és az áramot összeszorozzuk (U · I) – ez a teljesítmény, nem az ellenállás',value:p=>p.U*p.I},
   {id:'forditott',why:'fordítva osztunk (I / U)',value:p=>p.I/p.U},
   {id:'negyzet',why:'az áram négyzetével osztunk (U / I²)',value:p=>p.U/(p.I*p.I)},
   {id:'u-negyzet',why:'a feszültség négyzetével számolunk (U² / I)',value:p=>p.U*p.U/p.I},
   {id:'csucs',why:`a ${V1}-os effektív érték helyett a csúcsértékkel (${V1} · √2 ≈ ${uu(325,'V')}) számolunk`,value:p=>p.U*SQRT2/p.I,when:p=>p.U===U1},
   {id:'effektiv',why:`a ${V1}-ot csúcsértéknek véve még √2-vel osztjuk`,value:p=>p.U/SQRT2/p.I,when:p=>p.U===U1},
   prefixError<{U:number;I:number}>('kohm',1000,resultPrefix(1000,'Ω helyett kΩ')),
   prefixError<{U:number;I:number}>('mohm',1/1000,resultPrefix(1/1000,'Ω helyett mΩ'),(_p,r)=>r.R>=1),
  ],
 }),
 template<{I:number;cos:number}>({
  id:'teljesitmeny-1f',title:'Egyfázisú hatásos teljesítmény',short:'P = U · I · cos φ egyfázisú, 230\u00a0V-os körben.',topic:'alapfogalmak-szamitasok',
  calc:'teljesitmeny',result:'P',unit:'W',difficulty:1,version:1,article:{id:'elektromos-teljesitmeny',anchor:'egyfazisu-valtakozo-aram-p-q-s-es-cos'},
  space:{I:[2,3,4,5,6,8,10,12,13,16],cos:[0.8,0.85,0.9,0.95]},
  raw:p=>({rendszer:'1f',U:String(U1),I:String(p.I),'I.e':'A',cos:String(p.cos)}),
  stem:p=>`Egy egyfázisú, ${V1}-os fogyasztó ${uu(p.I,'A')} áramot vesz fel, a teljesítménytényezője cos φ = ${num(p.cos)}. Mekkora a hatásos teljesítménye?`,
  fmt:v=>si(v,'W'),
  explain:(p,ok)=>`Egyfázisú váltakozó áramú körben a hatásos teljesítmény P = U · I · cos φ. Itt P = ${V1} · ${uu(p.I,'A')} · ${num(p.cos)} = ${ok}.`,
  models:[
   {id:'cos-nelkul',why:'elhagyjuk a cos φ-t – ez a látszólagos teljesítmény (VA)',value:p=>U1*p.I},
   {id:'cos-osztas',why:'cos φ-vel osztunk szorzás helyett',value:p=>U1*p.I/p.cos},
   {id:'sqrt3',why:'a háromfázisú képlet √3-as szorzóját is alkalmazzuk',value:p=>SQRT3*U1*p.I*p.cos},
   {id:'vonali',why:`a ${VV}-os vonali feszültséggel számolunk a ${V1}-os fázisfeszültség helyett`,value:p=>UV*p.I*p.cos},
   {id:'sin',why:'cos φ helyett sin φ-vel szorzunk – ez a meddő teljesítmény',value:p=>U1*p.I*sinOf(p.cos)},
   {id:'fazis',why:`a ${V1}-ot vonali feszültségnek véve √3-mal osztjuk`,value:p=>U1/SQRT3*p.I*p.cos},
   prefixError<{I:number;cos:number}>('kw',1/1000,'összekeverjük a W-ot és a kW-ot (ezredrész)'),
  ],
 }),
 template<{P:number;cos:number}>({
  id:'aram-1f-cosfi',title:'Áram teljesítményből (egyfázisú, cos φ)',short:'I = P / (U · cos φ) egyfázisú, 230\u00a0V-os fogyasztónál.',topic:'alapfogalmak-szamitasok',
  calc:'aram-teljesitmenybol',result:'I',unit:'A',difficulty:2,version:1,article:{id:'elektromos-teljesitmeny',anchor:'aram-a-teljesitmenybol'},
  space:{P:[1000,1200,1500,1800,2000,2200,2500,3000,3500],cos:[0.8,0.85,0.9,0.95]},
  raw:p=>({rendszer:'1f',P:String(p.P),'P.e':'W',U:String(U1),cos:String(p.cos),eta:'1'}),
  stem:p=>`Egy egyfázisú, ${V1}-os fogyasztó hatásos teljesítménye ${si(p.P,'W')}, a teljesítménytényezője cos φ = ${num(p.cos)}. Mekkora áramot vesz fel?`,
  fmt:v=>si(v,'A'),
  explain:(p,ok)=>`Egyfázisú körben a felvett áram I = P / (U · cos φ). Itt I = ${uu(p.P,'W')} / (${V1} · ${num(p.cos)}) = ${ok}.`,
  models:[
   {id:'cos-nelkul',why:'elhagyjuk a cos φ-t',value:p=>p.P/U1},
   {id:'cos-szorzas',why:'cos φ-vel szorzunk osztás helyett',value:p=>p.P*p.cos/U1},
   {id:'sqrt3',why:'a háromfázisú képlet √3-as osztóját is alkalmazzuk',value:p=>p.P/(SQRT3*U1*p.cos)},
   {id:'vonali',why:`a ${VV}-os vonali feszültséggel számolunk a ${V1}-os fázisfeszültség helyett`,value:p=>p.P/(UV*p.cos)},
   {id:'sin',why:'cos φ helyett sin φ-vel osztunk',value:p=>p.P/(U1*sinOf(p.cos))},
   {id:'fazis',why:`a ${V1}-ot vonali feszültségnek véve √3-mal osztjuk`,value:p=>p.P/(U1/SQRT3*p.cos)},
   {id:'csucs',why:'az effektív érték helyett az áram csúcsértékét adjuk meg (· √2)',value:p=>p.P/(U1*p.cos)*SQRT2},
   prefixError<{P:number;cos:number}>('kw',1/1000,'a kW-ot nem váltjuk át W-ra'),
  ],
 }),
 template<{P:number;cos:number}>({
  id:'aram-3f',title:'Háromfázisú vonali áram',short:'I = P / (√3 · U · cos φ) szimmetrikus, 400\u00a0V-os háromfázisú terhelésnél.',topic:'alapfogalmak-szamitasok',
  calc:'aram-teljesitmenybol',result:'I',unit:'A',difficulty:2,version:1,article:{id:'elektromos-teljesitmeny',anchor:'haromfazisu-teljesitmeny'},
  space:{P:[3,4,5.5,7.5,9,11,15,18.5,22],cos:[0.8,0.85,0.9,0.95,1]},
  raw:p=>({rendszer:'3f',P:String(p.P),'P.e':'kW',Uv:String(UV),cos:String(p.cos),eta:'1'}),
  stem:p=>`Egy szimmetrikus háromfázisú fogyasztó a ${VV}-os (vonali feszültségű) hálózatból ${uu(p.P,'kW')} hatásos teljesítményt vesz fel, cos φ = ${num(p.cos)}. Mekkora a vonali áram?`,
  fmt:v=>si(v,'A'),
  explain:(p,ok)=>`Szimmetrikus háromfázisú terhelésnél I = P / (√3 · U · cos φ), ahol U a vonali feszültség. Itt I = ${uu(p.P*1000,'W')} / (√3 · ${VV} · ${num(p.cos)}) = ${ok}.`,
  models:[
   {id:'sqrt3-nelkul',why:'elhagyjuk a √3-at',value:p=>p.P*1000/(UV*p.cos)},
   {id:'harom',why:'√3 helyett 3-mal osztunk',value:p=>p.P*1000/(3*UV*p.cos)},
   {id:'fazisfesz',why:`a ${V1}-os fázisfeszültséggel, √3 nélkül számolunk`,value:p=>p.P*1000/(U1*p.cos)},
   {id:'fazis-vonali',why:`felcseréljük a fázis- és a vonali feszültséget (${V1} a ${VV} helyett)`,value:p=>p.P*1000/(SQRT3*U1*p.cos)},
   {id:'cos-nelkul',why:'elhagyjuk a cos φ-t',value:p=>p.P*1000/(SQRT3*UV),when:p=>p.cos<1},
   {id:'cos-szorzas',why:'cos φ-vel szorzunk osztás helyett',value:p=>p.P*1000*p.cos/(SQRT3*UV),when:p=>p.cos<1},
   {id:'sin',why:'cos φ helyett sin φ-vel osztunk',value:p=>p.P*1000/(SQRT3*UV*sinOf(p.cos)),when:p=>p.cos<1},
   {id:'sqrt3-szorzas',why:'√3-mal szorzunk osztás helyett',value:p=>p.P*1000*SQRT3/(UV*p.cos)},
   prefixError<{P:number;cos:number}>('kw',1/1000,'a kW-ot nem váltjuk át W-ra'),
  ],
 }),
 template<{L:number;A:number}>({
  id:'vezetek-ellenallas',title:'Vezeték ellenállása (oda-vissza)',short:'R = ρ · 2 · l / A rézvezetékre, 20\u00a0°C-on.',topic:'kabelek-vezetekek',
  calc:'vezetek-ellenallas',result:'R',unit:'Ω',difficulty:2,version:1,article:{id:'elektromos-ellenallas',anchor:'a-vezetek-ellenallasa-r-l-a'},
  space:{L:[10,15,20,25,30,40,50,60,75,100],A:[1.5,2.5,4,6,10]},
  raw:p=>({anyag:'Cu',mod:'rho20',L:String(p.L),'L.e':'m',A:String(p.A),theta:'20',ut:'2'}),
  stem:p=>`Egy ${uu(p.L,'m')} hosszú áramkört ${uu(p.A,'mm²')}-es rézvezeték táplál. Mekkora az oda- és a visszavezető együttes ellenállása ${uu(20,'°C')}-on? A réz fajlagos ellenállása ρ = ${uu(RHO_CU,'Ω·mm²/m',6)}.`,
  fmt:v=>uu(v,'Ω'),
  explain:(p,ok)=>`A vezeték ellenállása R = ρ · l / A; mivel az áram az oda- és a visszavezetőn is átfolyik, a hossz kétszeresével kell számolni: R = ρ · 2 · l / A. Itt R = ${uu(RHO_CU,'Ω·mm²/m',6)} · 2 · ${uu(p.L,'m')} / ${uu(p.A,'mm²')} = ${ok}.`,
  models:[
   {id:'egy-vezeto',why:'csak az egyik vezetővel számolunk (kimarad a ×2)',value:(_p,ok)=>ok/2},
   {id:'negyszeres',why:'kétszer is duplázzuk a hosszt (×4)',value:(_p,ok)=>ok*2},
   {id:'aluminium',why:'az alumínium fajlagos ellenállásával számolunk',value:(_p,ok)=>ok*RHO_AL/RHO_CU},
   {id:'szorzas-A',why:'a keresztmetszettel szorzunk osztás helyett',value:p=>RHO_CU*2*p.L*p.A},
   {id:'osztas-2',why:'a hosszt 2-vel osztjuk szorzás helyett',value:(_p,ok)=>ok/4},
   {id:'atmero',why:'a keresztmetszet (mm²) értékét átmérőnek (mm) vesszük, és abból számolunk felületet',value:p=>RHO_CU*2*p.L/asDiameter(p.A)},
   {id:'meleg',why:`a ${uu(70,'°C')}-os üzemi hőmérsékletre átszámolt fajlagos ellenállással számolunk a kért ${uu(20,'°C')} helyett`,value:(_p,ok)=>ok*(1+ALPHA_CU*50)},
  ],
 }),
 template<{R:readonly number[]}>({
  id:'soros-eredo',title:'Soros eredő ellenállás',short:'Soros kapcsolás: Re = R1 + R2 + … + Rn.',topic:'alapfogalmak-szamitasok',
  calc:'eredo-ellenallas',result:'Re',unit:'Ω',difficulty:1,version:1,article:{id:'soros-es-parhuzamos-kapcsolas',anchor:'soros-kapcsolas'},
  pick:rng=>({R:pickDistinct(rng,SERIES_R,2,4)}),valid:p=>validList(p,SERIES_R,2,4),
  raw:p=>({mod:'soros',R:p.R.join('; '),'R.e':'ohm'}),
  stem:p=>`${COUNT[p.R.length][0].toUpperCase()+COUNT[p.R.length].slice(1)} ellenállást (${list(p.R.map(r=>si(r,'Ω')))}) sorosan kapcsolunk. Mekkora az eredő ellenállás?`,
  fmt:v=>si(v,'Ω'),
  explain:(p,ok)=>`Soros kapcsolásnál az eredő ellenállás a tagok összege: Re = R1 + R2 + … + Rn. Itt Re = ${p.R.map(r=>si(r,'Ω')).join(' + ')} = ${ok}; az eredő mindig nagyobb a legnagyobb tagnál.`,
  models:[
   {id:'parhuzamos',why:'párhuzamos kapcsolásként számolunk',value:p=>parallel(p.R)},
   {id:'elotag',why:'figyelmen kívül hagyjuk a kΩ előtagot, és csak a számokat adjuk össze',value:p=>sum(p.R.map(mantissa)),when:p=>mixedPrefix(p.R),solo:true},
   {id:'kihagyott',why:'kihagyjuk a legkisebb tagot',value:p=>sum(p.R)-Math.min(...p.R),when:p=>p.R.length>2},
   {id:'atlag',why:'az összeg helyett az átlagot számoljuk',value:p=>sum(p.R)/p.R.length},
   {id:'legnagyobb',why:'a legnagyobb tagot vesszük eredőnek',value:p=>Math.max(...p.R)},
   {id:'szorzat',why:'összeadás helyett összeszorozzuk a két ellenállást',value:p=>p.R[0]*p.R[1],when:p=>p.R.length===2},
   {id:'n-legnagyobb',why:'úgy számolunk, mintha mindegyik ellenállás a legnagyobbal lenne egyenlő (n · Rmax)',value:p=>p.R.length*Math.max(...p.R)},
   {id:'kohm-tag',why:'az Ω-ban megadott tagokat is kΩ-nak vesszük',value:p=>sum(p.R.map(r=>r<1000?r*1000:r)),when:p=>mixedPrefix(p.R),solo:true},
   prefixError<{R:readonly number[]}>('kohm',1000,resultPrefix(1000,'Ω helyett kΩ, kΩ helyett MΩ')),
  ],
 }),
 template<{R:readonly number[]}>({
  id:'parhuzamos-eredo',title:'Párhuzamos eredő ellenállás',short:'Párhuzamos kapcsolás: 1/Re = 1/R1 + 1/R2 + … + 1/Rn.',topic:'alapfogalmak-szamitasok',
  calc:'eredo-ellenallas',result:'Re',unit:'Ω',difficulty:2,version:1,article:{id:'soros-es-parhuzamos-kapcsolas',anchor:'parhuzamos-kapcsolas'},
  pick:rng=>({R:pickDistinct(rng,PARALLEL_R,2,3)}),valid:p=>validList(p,PARALLEL_R,2,3),
  raw:p=>({mod:'parhuzamos',R:p.R.join('; '),'R.e':'ohm'}),
  stem:p=>`${COUNT[p.R.length][0].toUpperCase()+COUNT[p.R.length].slice(1)} ellenállást (${list(p.R.map(r=>si(r,'Ω')))}) párhuzamosan kapcsolunk. Mekkora az eredő ellenállás?`,
  fmt:v=>si(v,'Ω'),
  explain:(p,ok)=>`Párhuzamos kapcsolásnál az eredő reciproka a tagok reciprokainak összege: 1/Re = ${p.R.map(r=>'1/'+si(r,'Ω')).join(' + ')}. Ebből Re = ${ok}; az eredő mindig kisebb a legkisebb tagnál.`,
  models:[
   {id:'soros',why:'soros kapcsolásként számolunk (összeadjuk az ellenállásokat)',value:p=>sum(p.R)},
   {id:'reciprok',why:'elfelejtjük venni a reciprokok összegének reciprokát (1/Re-t adjuk meg)',value:p=>p.R.reduce((s,r)=>s+1/r,0),solo:true},
   {id:'atlag',why:'az ellenállások átlagát számoljuk',value:p=>sum(p.R)/p.R.length},
   {id:'legkisebb',why:'a legkisebb tagot vesszük eredőnek',value:p=>Math.min(...p.R)},
   {id:'ket-tag-keplet',why:'a két tagra érvényes R1 · R2 / (R1 + R2) képletet alkalmazzuk három tagra (szorzat / összeg)',value:p=>p.R.reduce((s,r)=>s*r,1)/sum(p.R),when:p=>p.R.length===3},
   {id:'osszeg-reciprok',why:'az ellenállások összegének reciprokát vesszük',value:p=>1/sum(p.R),solo:true},
   {id:'legkisebb-n',why:'úgy számolunk, mintha mindegyik ellenállás a legkisebbel lenne egyenlő (Rmin / n)',value:p=>Math.min(...p.R)/p.R.length},
   {id:'legkisebb-fele',why:'a két egyforma ellenállásra érvényes „fele” szabályt a legkisebb tagra alkalmazzuk (Rmin / 2)',value:p=>Math.min(...p.R)/2,when:p=>p.R.length===3},
   prefixError<{R:readonly number[]}>('mohm',1/1000,resultPrefix(1/1000,'Ω helyett mΩ')),
  ],
 }),
 template<{P:number;h:number;c:number}>({
  id:'fogyasztas-koltseg',title:'Éves energiaköltség',short:'Éves energia és költség: E = P · t · 365, költség = E · áramdíj.',topic:'alapfogalmak-szamitasok',
  calc:'fogyasztas-koltseg',result:'ft_ev',unit:'Ft',difficulty:1,version:1,article:{id:'elektromos-teljesitmeny',anchor:'energia-es-fogyasztas'},
  // Valószerű használat: egész nap (24 h) csak kis teljesítményű készülék (router, hűtő) működik, és a napi energia legfeljebb 6 kWh.
  space:{P:[60,100,150,500,800,1000,1500,2000,2200],h:[0.5,1,2,3,4,6,8,24],c:[36,40,50,60,70]},valid:p=>p.h===24?p.P<=150:p.P*p.h<=6000,min:10,
  raw:p=>({sorok:p.P+'*'+p.h+'*1',ar:String(p.c)}),
  stem:p=>`Egy ${uu(p.P,'W')} teljesítményű készülék ${p.h===24?'egész nap (napi'+NB+'24'+NB+'órát)':'naponta átlagosan '+uu(p.h,'órát')} működik. Mennyi az éves energiaköltsége ${uu(p.c,'Ft/kWh')} áramdíjjal (példaérték), 365 nappal számolva?`,
  fmt:v=>huf(v),
  explain:(p,ok)=>{const kwh=p.P*p.h*365/1000;return `Az éves energia E = P · t · 365 / 1000 (kWh), a költség K = E · áramdíj. Itt E = ${uu(p.P,'W')} · ${uu(p.h,'h')} · 365 / 1000 = ${uu(kwh,'kWh')}, K = ${uu(kwh,'kWh')} · ${uu(p.c,'Ft/kWh')} = ${ok}. Az áramdíj példaérték: a saját tarifádat a villanyszámládon találod.`},
  models:[
   {id:'napi',why:'csak egy nap költségét számoljuk ki',value:(_p,ok)=>ok/365},
   {id:'havi',why:'az éves helyett a havi költséget adjuk meg',value:(_p,ok)=>ok/12},
   {id:'egesz-nap',why:'úgy számolunk, mintha a készülék egész nap működne',value:(p,ok)=>ok*24/p.h,when:p=>p.h<24},
   {id:'heti',why:'csak egy hét költségét számoljuk ki',value:(_p,ok)=>ok*7/365},
   {id:'ora-nelkul',why:'kimarad a napi üzemidő (mintha a készülék naponta csak 1 órát működne)',value:(p,ok)=>ok/p.h,when:p=>p.h!==1},
   {id:'napi-ezer',why:'kimarad a 365 nappal való szorzás és a kW-ra váltás (1000-rel való osztás) is',value:p=>p.P*p.h*p.c,solo:true},
   prefixError<{P:number;h:number;c:number}>('kw',1000,'a W-ot nem váltjuk át kW-ra (kimarad az 1000-rel való osztás)'),
  ],
 }),
];

/** A paraméterek érvényessége (tárolóból vagy linkből visszaolvasva): csak a sablon saját halmazaiból választott érték fogadható el. */
export function validParams(t:Template,p:unknown):p is Params{
 if(!p||typeof p!=='object'||Array.isArray(p))return false;
 const o=p as Record<string,unknown>;
 if(t.space){
  const keys=Object.keys(t.space);
  return Object.keys(o).length===keys.length&&keys.every(k=>(t.space![k] as readonly unknown[]).includes(o[k]))&&(!t.valid||t.valid(o as Params));
 }
 return !!t.valid&&t.valid(o as Params);
}
/** Véletlen paraméterkészlet a sablon halmazaiból. */
export function pickParams(t:Template,rng:Rng):Params{
 if(t.pick)return t.pick(rng);
 for(let tries=0;;tries++){
  const out:Record<string,number|string>={};
  for(const [k,vals] of Object.entries(t.space??{}))out[k]=oneOf(rng,vals);
  if(!t.valid||t.valid(out)||tries>=200)return out;
 }
}
/** A paraméterkészlet kulcsa (egy teszten belül azonos paraméterű kérdés nem ismétlődik); a lista sorrendje nem számít. */
export const paramKey=(p:Params)=>Object.keys(p).sort().map(k=>{const v=p[k];return k+'='+(Array.isArray(v)?[...v].sort((a,b)=>a-b).join(';'):String(v))}).join('&');
