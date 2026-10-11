// Számolós feladatsablonok (docs/tudastar-terv.md 7. pont: a 12 MVP-sablon). Tiszta modul (zod, lib/plan és hálózat nélkül), kliensen is fut.
// A helyes érték és a levezetés MINDIG a kalkulátorból jön: runCalc(def, raw(p)) – a sablon csak a paramétereket, a kérdés szövegét és a
// tévesztőket adja. A definíciót a hívó adja át (a kliens lustán tölti be: components/quiz/calc-defs.ts), így ez a modul egyetlen definíciót sem húz be.
// Paraméterek: diszkrét, valószerű halmazokból. Tévesztők: megnevezett hibamodellekből (√3 kihagyása, fázis/vonali feszültség cseréje,
// cos φ kihagyása, ×2 kihagyása, W/kW, Ω/kΩ, U·R az U/R helyett, rossz m-szorzó …); a válaszok formázás után egyediek, egymástól és a
// helyestől legalább 5 %-ban eltérnek, és növekvő sorrendben jelennek meg (lib/quiz/engine.ts buildTemplateQuestion; tests/quiz.ts).
// Közzététel: egy sablon csak akkor látszik, ha a kalkulátora közzétett (lib/calc/release.ts; táblázatosnál tablesApproved() is), és
// a sablon belső ellenőrzési rekordja egyezik (lib/quiz/gate.ts) – a T1-kalkulátorra épülő sablon így a kalkulátorral együtt élesedhet.
// A sorrend a tesztkód bitmaszkjának alapja: új sablon csak a lista VÉGÉRE kerülhet, azonosító nem változhat.
import type {Raw} from '@/lib/calc/core';
import {MATERIALS,MCB_RATINGS,NOMINAL} from '@/lib/calc/constants';
import {floorTo,formatFixed,formatNum,formatSI,parseNum} from '@/lib/calc/number';
import type {TopicId} from './topics';
import {oneOf,randInt,shuffle,type Rng} from './rng';

export type ParamValue=number|string|readonly number[];
export type Params=Readonly<Record<string,ParamValue>>;
/** A kalkulátor eredményei azonosító szerint (alapegységben). */
export type Results=Readonly<Record<string,number>>;
/** Megnevezett hibamodell: `why` a hiba leírása („Ez az eredmény jön ki, ha …”); `value` a hibás számítás eredménye; `fallback`: általános
 * tartalék (helyiérték-hiba), csak akkor kerül sorra, ha a sablon saját hibamodelljeiből nem jön ki három megfelelő tévesztő. */
export type Model<P>={id:string;why:string;value:(p:P,ok:number,res:Results)=>number;when?:(p:P,res:Results)=>boolean;fallback?:boolean};
export type Template<P=Params>={
 id:string;title:string;short:string;topic:TopicId;
 /** A kalkulátor slugja (lib/calc/defs) és a helyes válasz eredményazonosítója. */
 calc:string;result:string;unit:string;
 difficulty:1|2|3;version:number;
 /** A kapcsolódó Tudástár-cikk és horgony (a link csak közzétett cikkre jelenik meg). */
 article?:{id:string;anchor:string};
 /** Független, diszkrét paraméterhalmazok; ha nincs, a sablon saját `pick`/`valid` párt ad (pl. ellenálláslista). */
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

const NB='\u00a0';
const si=(n:number,unit:string)=>formatSI(n,unit);
const uu=(n:number,unit:string,d?:number)=>formatNum(n,d)+NB+unit;
const huf=(n:number)=>formatFixed(n,0)+NB+'Ft';
const num=(n:number)=>formatNum(n);
const SQRT3=Math.sqrt(3);
const U1=NOMINAL.phase,UV=NOMINAL.line;
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
function template<P extends Params>(t:Template<P>):Template{return t as unknown as Template}
/** Általános „tízszeres / tizedrész” helyiérték-hiba – tartalék, ha a sablon saját hibamodelljeiből nem jön ki három megfelelő tévesztő. */
const placeValue=<P,>():Model<P>[]=>[
 {id:'tizszeres',why:'helyiérték-hibát vétünk (tízszeres érték)',value:(_p,ok)=>ok*10,fallback:true},
 {id:'tized',why:'helyiérték-hibát vétünk (tizedrész)',value:(_p,ok)=>ok/10,fallback:true},
];

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

const SERIES_R=[10,22,33,47,68,100,150,220,330,470,680,1000,1500,2200,3300,4700] as const;
const PARALLEL_R=[10,12,15,20,22,30,33,47,56,68,100,120,150,220,330,470,1000] as const;
const RHO_CU=MATERIALS.Cu.rho20,RHO_AL=MATERIALS.Al.rho20;
/** A pillanatkioldás szokásos szorzója (MSZ EN 60898-1: B 5 · In, C 10 · In, D 20 · In) – csak a tévesztők modelljéhez. */
const M_FACTOR:Readonly<Record<string,number>>={B:5,C:10,D:20};

export const TEMPLATES:readonly Template[]=[
 template<{U:number;R:number}>({
  id:'ohm-aram',title:'Áram Ohm törvényével',short:'Feszültségből és ellenállásból az áram: I = U / R.',topic:'alapfogalmak-szamitasok',
  calc:'ohm-torveny',result:'I',unit:'A',difficulty:1,version:1,article:{id:'ohm-torvenye',anchor:'az-osszefugges'},
  space:{U:[12,24,230],R:[4,6,8,10,12,15,20,24,30,40,46,60,100,115,230]},
  raw:p=>({ismert:'UR',U:String(p.U),'U.e':'V',R:String(p.R),'R.e':'ohm'}),
  stem:p=>`Egy ${si(p.R,'Ω')} ellenállású ohmos fogyasztóra ${uu(p.U,'V')} feszültséget kapcsolunk. Mekkora áram folyik át rajta?`,
  fmt:v=>si(v,'A'),
  explain:(p,ok)=>`Ohm törvénye szerint az áram a feszültség és az ellenállás hányadosa: I = U / R. Itt I = ${uu(p.U,'V')} / ${si(p.R,'Ω')} = ${ok}.`,
  models:[
   {id:'szorzas',why:'a feszültséget és az ellenállást összeszorozzuk (U · R) osztás helyett',value:p=>p.U*p.R},
   {id:'forditott',why:'fordítva osztunk (R / U)',value:p=>p.R/p.U},
   {id:'kohm',why:'az ellenállást kΩ-nak vesszük (az Ω és a kΩ összekeverése)',value:p=>p.U/(p.R*1000)},
   {id:'teljesitmeny',why:'az áram helyett a teljesítményt számoljuk ki (U² / R)',value:p=>p.U*p.U/p.R},
   ...placeValue<{U:number;R:number}>(),
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
   {id:'ma',why:'az áramot mA-nek vesszük (az A és a mA összekeverése)',value:p=>p.U/(p.I/1000)},
   ...placeValue<{U:number;I:number}>(),
  ],
 }),
 template<{I:number;cos:number}>({
  id:'teljesitmeny-1f',title:'Egyfázisú hatásos teljesítmény',short:'P = U · I · cos φ egyfázisú, 230 V-os körben.',topic:'alapfogalmak-szamitasok',
  calc:'teljesitmeny',result:'P',unit:'W',difficulty:1,version:1,article:{id:'elektromos-teljesitmeny',anchor:'egyfazisu-valtakozo-aram-p-q-s-es-cos'},
  space:{I:[2,3,4,5,6,8,10,12,13,16],cos:[0.8,0.85,0.9,0.95]},
  raw:p=>({rendszer:'1f',U:String(U1),I:String(p.I),'I.e':'A',cos:String(p.cos)}),
  stem:p=>`Egy egyfázisú, ${U1} V-os fogyasztó ${uu(p.I,'A')} áramot vesz fel, a teljesítménytényezője cos φ = ${num(p.cos)}. Mekkora a hatásos teljesítménye?`,
  fmt:v=>si(v,'W'),
  explain:(p,ok)=>`Egyfázisú váltakozó áramú körben a hatásos teljesítmény P = U · I · cos φ. Itt P = ${U1} V · ${uu(p.I,'A')} · ${num(p.cos)} = ${ok}.`,
  models:[
   {id:'cos-nelkul',why:'elhagyjuk a cos φ-t – ez a látszólagos teljesítmény (VA)',value:p=>U1*p.I},
   {id:'cos-osztas',why:'cos φ-vel osztunk szorzás helyett',value:p=>U1*p.I/p.cos},
   {id:'sqrt3',why:'a háromfázisú képlet √3-as szorzóját is alkalmazzuk',value:p=>SQRT3*U1*p.I*p.cos},
   {id:'vonali',why:`a ${UV} V-os vonali feszültséggel számolunk a ${U1} V-os fázisfeszültség helyett`,value:p=>UV*p.I*p.cos},
   {id:'kw',why:'összekeverjük a W-ot és a kW-ot (ezredrész)',value:(_p,ok)=>ok/1000},
   {id:'sin',why:'cos φ helyett sin φ-vel szorzunk – ez a meddő teljesítmény',value:p=>U1*p.I*sinOf(p.cos)},
  ],
 }),
 template<{P:number;cos:number}>({
  id:'aram-1f-cosfi',title:'Áram teljesítményből (egyfázisú, cos φ)',short:'I = P / (U · cos φ) egyfázisú, 230 V-os fogyasztónál.',topic:'alapfogalmak-szamitasok',
  calc:'aram-teljesitmenybol',result:'I',unit:'A',difficulty:2,version:1,article:{id:'elektromos-teljesitmeny',anchor:'aram-a-teljesitmenybol'},
  space:{P:[1000,1200,1500,1800,2000,2200,2500,3000,3500],cos:[0.8,0.85,0.9,0.95]},
  raw:p=>({rendszer:'1f',P:String(p.P),'P.e':'W',U:String(U1),cos:String(p.cos),eta:'1'}),
  stem:p=>`Egy egyfázisú, ${U1} V-os fogyasztó hatásos teljesítménye ${si(p.P,'W')}, a teljesítménytényezője cos φ = ${num(p.cos)}. Mekkora áramot vesz fel?`,
  fmt:v=>si(v,'A'),
  explain:(p,ok)=>`Egyfázisú körben a felvett áram I = P / (U · cos φ). Itt I = ${uu(p.P,'W')} / (${U1} V · ${num(p.cos)}) = ${ok}.`,
  models:[
   {id:'cos-nelkul',why:'elhagyjuk a cos φ-t',value:p=>p.P/U1},
   {id:'cos-szorzas',why:'cos φ-vel szorzunk osztás helyett',value:p=>p.P*p.cos/U1},
   {id:'sqrt3',why:'a háromfázisú képlet √3-as osztóját is alkalmazzuk',value:p=>p.P/(SQRT3*U1*p.cos)},
   {id:'vonali',why:`a ${UV} V-os vonali feszültséggel számolunk a ${U1} V-os fázisfeszültség helyett`,value:p=>p.P/(UV*p.cos)},
   {id:'kw',why:'a kW-ot nem váltjuk át W-ra',value:p=>p.P/1000/(U1*p.cos)},
   {id:'sin',why:'cos φ helyett sin φ-vel osztunk',value:p=>p.P/(U1*sinOf(p.cos))},
   {id:'fazis',why:`a ${U1} V-ot vonali feszültségnek vesszük, és √3-mal osztjuk`,value:p=>p.P/(U1/SQRT3*p.cos)},
  ],
 }),
 template<{P:number;cos:number}>({
  id:'aram-3f',title:'Háromfázisú vonali áram',short:'I = P / (√3 · U · cos φ) szimmetrikus, 400 V-os háromfázisú terhelésnél.',topic:'alapfogalmak-szamitasok',
  calc:'aram-teljesitmenybol',result:'I',unit:'A',difficulty:2,version:1,article:{id:'elektromos-teljesitmeny',anchor:'haromfazisu-teljesitmeny'},
  space:{P:[3,4,5.5,7.5,9,11,15,18.5,22],cos:[0.8,0.85,0.9,0.95,1]},
  raw:p=>({rendszer:'3f',P:String(p.P),'P.e':'kW',Uv:String(UV),cos:String(p.cos),eta:'1'}),
  stem:p=>`Egy szimmetrikus háromfázisú fogyasztó a ${UV} V-os (vonali feszültségű) hálózatból ${uu(p.P,'kW')} hatásos teljesítményt vesz fel, cos φ = ${num(p.cos)}. Mekkora a vonali áram?`,
  fmt:v=>si(v,'A'),
  explain:(p,ok)=>`Szimmetrikus háromfázisú terhelésnél I = P / (√3 · U · cos φ), ahol U a vonali feszültség. Itt I = ${uu(p.P*1000,'W')} / (√3 · ${UV} V · ${num(p.cos)}) = ${ok}.`,
  models:[
   {id:'sqrt3-nelkul',why:'elhagyjuk a √3-at',value:p=>p.P*1000/(UV*p.cos)},
   {id:'harom',why:'√3 helyett 3-mal osztunk',value:p=>p.P*1000/(3*UV*p.cos)},
   {id:'fazisfesz',why:`a ${U1} V-os fázisfeszültséggel, √3 nélkül számolunk`,value:p=>p.P*1000/(U1*p.cos)},
   {id:'fazis-vonali',why:`felcseréljük a fázis- és a vonali feszültséget (${U1} V a ${UV} V helyett)`,value:p=>p.P*1000/(SQRT3*U1*p.cos)},
   {id:'cos-nelkul',why:'elhagyjuk a cos φ-t',value:p=>p.P*1000/(SQRT3*UV),when:p=>p.cos<1},
   {id:'kw',why:'a kW-ot nem váltjuk át W-ra',value:p=>p.P/(SQRT3*UV*p.cos)},
   {id:'sqrt3-szorzas',why:'√3-mal szorzunk osztás helyett',value:p=>p.P*1000*SQRT3/(UV*p.cos)},
  ],
 }),
 template<{L:number;A:number}>({
  id:'vezetek-ellenallas',title:'Vezeték ellenállása (oda-vissza)',short:'R = ρ · 2 · l / A rézvezetékre, 20 °C-on.',topic:'kabelek-vezetekek',
  calc:'vezetek-ellenallas',result:'R',unit:'Ω',difficulty:2,version:1,article:{id:'elektromos-ellenallas',anchor:'a-vezetek-ellenallasa-r-l-a'},
  space:{L:[10,15,20,25,30,40,50,60,75,100],A:[1.5,2.5,4,6,10]},
  raw:p=>({anyag:'Cu',mod:'rho20',L:String(p.L),'L.e':'m',A:String(p.A),theta:'20',ut:'2'}),
  stem:p=>`Egy ${uu(p.L,'m')} hosszú áramkört ${uu(p.A,'mm²')}-es rézvezeték táplál. Mekkora az oda- és a visszavezető együttes ellenállása 20 °C-on? A réz fajlagos ellenállása ρ = ${uu(RHO_CU,'Ω·mm²/m',6)}.`,
  fmt:v=>uu(v,'Ω'),
  explain:(p,ok)=>`A vezeték ellenállása R = ρ · l / A; mivel az áram az oda- és a visszavezetőn is átfolyik, a hossz kétszeresével kell számolni: R = ρ · 2 · l / A. Itt R = ${uu(RHO_CU,'Ω·mm²/m',6)} · 2 · ${uu(p.L,'m')} / ${uu(p.A,'mm²')} = ${ok}.`,
  models:[
   {id:'egy-vezeto',why:'csak az egyik vezetővel számolunk (kimarad a ×2)',value:(_p,ok)=>ok/2},
   {id:'negyszeres',why:'kétszer is duplázzuk a hosszt (×4)',value:(_p,ok)=>ok*2},
   {id:'aluminium',why:'az alumínium fajlagos ellenállásával számolunk',value:(_p,ok)=>ok*RHO_AL/RHO_CU},
   {id:'szorzas-A',why:'a keresztmetszettel szorzunk osztás helyett',value:p=>RHO_CU*2*p.L*p.A},
   {id:'osztas-2',why:'a hosszt 2-vel osztjuk szorzás helyett',value:(_p,ok)=>ok/4},
   ...placeValue<{L:number;A:number}>(),
  ],
 }),
 template<{I:number;L:number;A:number}>({
  id:'feszultseges-1f',title:'Feszültségesés (egyfázisú)',short:'ΔU = 2 · L · I · ρ1 / A egyfázisú, ohmos terhelésű körben.',topic:'kabelek-vezetekek',
  calc:'feszultseges',result:'dU',unit:'V',difficulty:2,version:1,
  space:{I:[10,13,16,20],L:[10,15,20,25,30,40],A:[1.5,2.5,4]},
  raw:p=>({rendszer:'1f',I:String(p.I),L:String(p.L),'L.e':'m',A:String(p.A),cos:'1',hatar:'public-other'}),
  stem:p=>`Egyfázisú, ${U1} V-os áramkörben ${uu(p.I,'A')} áramú ohmos terhelés (cos φ = 1) van egy ${uu(p.L,'m')} hosszú, ${uu(p.A,'mm²')}-es rézvezeték végén. Mekkora a feszültségesés voltban, a méretezési táblázat ρ1 értékével (üzemi hőmérséklet) számolva?`,
  fmt:v=>uu(v,'V'),
  explain:(_p,ok)=>`Egyfázisú körben az áram az oda- és a visszavezetőn is átfolyik, ezért ΔU = 2 · L · I · ρ1 / A (cos φ = 1 mellett a reaktancia hatása elhanyagolható). Az eredmény ${ok}; a behelyettesítés a levezetésben látható.`,
  models:[
   {id:'egy-vezeto',why:'csak az egyik vezetővel számolunk (kimarad a ×2)',value:(_p,ok)=>ok/2},
   {id:'negyszeres',why:'kétszer is duplázzuk a hosszt (×4)',value:(_p,ok)=>ok*2},
   {id:'szazalek',why:'a százalékos esést adjuk meg voltként',value:(_p,ok)=>ok/U1*100},
   {id:'sqrt3',why:'a háromfázisú √3-as szorzót is alkalmazzuk',value:(_p,ok)=>ok*SQRT3},
   {id:'szorzas-A',why:'a keresztmetszettel szorzunk osztás helyett',value:(p,ok)=>ok*p.A*p.A},
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
   {id:'elotag',why:'figyelmen kívül hagyjuk a kΩ előtagot, és csak a számokat adjuk össze',value:p=>sum(p.R.map(mantissa)),when:p=>mixedPrefix(p.R)},
   {id:'kihagyott',why:'kihagyjuk a legkisebb tagot',value:p=>sum(p.R)-Math.min(...p.R),when:p=>p.R.length>2},
   {id:'atlag',why:'az összeg helyett az átlagot számoljuk',value:p=>sum(p.R)/p.R.length},
   {id:'legnagyobb',why:'a legnagyobb tagot vesszük eredőnek',value:p=>Math.max(...p.R)},
   {id:'szorzat',why:'összeadás helyett összeszorozzuk a két ellenállást',value:p=>p.R[0]*p.R[1],when:p=>p.R.length===2},
   {id:'kohm',why:'az Ω-ot kΩ-nak vesszük',value:p=>sum(p.R)*1000},
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
   {id:'reciprok',why:'elfelejtjük venni a reciprokok összegének reciprokát (1/Re-t adjuk meg)',value:p=>p.R.reduce((s,r)=>s+1/r,0)},
   {id:'atlag',why:'az ellenállások átlagát számoljuk',value:p=>sum(p.R)/p.R.length},
   {id:'legkisebb',why:'a legkisebb tagot vesszük eredőnek',value:p=>Math.min(...p.R)},
   {id:'ket-tag-keplet',why:'a két tagra érvényes R1 · R2 / (R1 + R2) képletet alkalmazzuk három tagra (szorzat / összeg)',value:p=>p.R.reduce((s,r)=>s*r,1)/sum(p.R),when:p=>p.R.length===3},
   {id:'osszeg-reciprok',why:'az ellenállások összegének reciprokát vesszük',value:p=>1/sum(p.R)},
  ],
 }),
 template<{P:number;h:number;c:number}>({
  id:'fogyasztas-koltseg',title:'Éves energiaköltség',short:'Éves energia és költség: E = P · t · 365, költség = E · áramdíj.',topic:'alapfogalmak-szamitasok',
  calc:'fogyasztas-koltseg',result:'ft_ev',unit:'Ft',difficulty:1,version:1,article:{id:'elektromos-teljesitmeny',anchor:'energia-es-fogyasztas'},
  space:{P:[60,100,150,500,800,1000,1500,2000,2200],h:[0.5,1,2,3,4,6,8,24],c:[36,40,50,60,70]},min:10,
  raw:p=>({sorok:p.P+'*'+p.h+'*1',ar:String(p.c)}),
  stem:p=>`Egy ${uu(p.P,'W')} teljesítményű készülék ${p.h===24?'egész nap (napi 24 órát)':'naponta átlagosan '+uu(p.h,'órát')} működik. Mennyi az éves energiaköltsége ${p.c} Ft/kWh áramdíjjal (példaérték), 365 nappal számolva?`,
  fmt:v=>huf(v),
  explain:(p,ok)=>{const kwh=p.P*p.h*365/1000;return `Az éves energia E = P · t · 365 / 1000 (kWh), a költség K = E · áramdíj. Itt E = ${uu(p.P,'W')} · ${uu(p.h,'h')} · 365 / 1000 = ${uu(kwh,'kWh')}, K = ${uu(kwh,'kWh')} · ${p.c} Ft/kWh = ${ok}. Az áramdíj példaérték: a saját tarifádat a villanyszámládon találod.`},
  models:[
   {id:'kw',why:'a W-ot nem váltjuk át kW-ra (kimarad az 1000-rel való osztás)',value:(_p,ok)=>ok*1000},
   {id:'napi',why:'csak egy nap költségét számoljuk ki',value:(_p,ok)=>ok/365},
   {id:'havi',why:'az éves helyett a havi költséget adjuk meg',value:(_p,ok)=>ok/12},
   {id:'egesz-nap',why:'úgy számolunk, mintha a készülék egész nap működne',value:(p,ok)=>ok*24/p.h,when:p=>p.h<24},
   {id:'heti',why:'csak egy hét költségét számoljuk ki',value:(_p,ok)=>ok*7/365},
  ],
 }),
 template<{Ib:number;A:string;gorbe:string}>({
  id:'kismegszakito-valasztas',title:'Kismegszakító-választás (Ib ≤ In ≤ Iz)',short:'A legkisebb előnyös névleges áram a terhelőáram és a vezeték terhelhetősége között.',topic:'vedelmi-eszkozok',
  calc:'kismegszakito',result:'In',unit:'A',difficulty:3,version:1,article:{id:'kismegszakito',anchor:'az-ib-in-iz-elve'},
  space:{Ib:[6,8,9,10,11,12,14,15,16,18,20,24,28,30],A:['1.5','2.5','4','6'],gorbe:['B','C']},
  raw:p=>({Ib:String(p.Ib),A:p.A,mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1',gorbe:p.gorbe}),
  stem:(p,res)=>`Egy egyfázisú áramkör tervezett terhelőárama Ib = ${uu(p.Ib,'A')}. A ${uu(Number(p.A),'mm²')}-es, PVC-szigetelésű rézvezeték javított terhelhetősége a szerelési körülmények között Iz = ${uu(res.Iz,'A')}. Melyik a legkisebb választható ${p.gorbe} jelleggörbéjű kismegszakító?`,
  fmt:(v,p)=>p.gorbe+v+' ('+v+NB+'A)',
  shown:text=>Number(/^[A-Z](\d+)/.exec(text)?.[1]??NaN),
  explain:(p,ok,res)=>`A kismegszakító névleges árama a terhelőáram és a vezeték terhelhetősége közé essen: Ib ≤ In ≤ Iz. Itt ${uu(p.Ib,'A')} ≤ In ≤ ${uu(res.Iz,'A')}, ebből a legkisebb előnyös érték ${ok}.`,
  models:[
   {id:'ib-alatt',why:'Ib-nél kisebb névleges áramot választunk – ez a tartós terhelést sem viselné',value:p=>[...MCB_RATINGS.value].reverse().find(r=>r<p.Ib)??NaN},
   {id:'ib-alatt-2',why:'Ib-nél jóval kisebb névleges áramot választunk',value:p=>MCB_RATINGS.value.filter(r=>r<p.Ib).at(-2)??NaN},
   {id:'iz-felett',why:'Iz-nél nagyobb névleges áramot választunk – ez a vezetéket nem védené a túlterhelés ellen',value:(_p,_ok,res)=>MCB_RATINGS.value.find(r=>r>res.Iz)??NaN},
   {id:'iz-felett-2',why:'Iz-nél jóval nagyobb névleges áramot választunk',value:(_p,_ok,res)=>MCB_RATINGS.value.filter(r=>r>res.Iz)[1]??NaN},
  ],
 }),
 template<{gorbe:string;In:number}>({
  id:'zs-max',title:'Megengedett hurokimpedancia (Zs,max)',short:'Zs,max = cmin · U0 / (m · In) kismegszakítóval védett körben, TN-rendszerben.',topic:'erintesvedelem',
  calc:'hurokimpedancia',result:'ZsMax',unit:'Ω',difficulty:3,version:1,article:{id:'kismegszakito',anchor:'b-c-es-d-jelleggorbe'},
  space:{gorbe:['B','C'],In:[6,10,13,16,20,25,32]},
  raw:p=>({Ze:'0,35',L:'25',A:'2,5',gorbe:p.gorbe,In:String(p.In)}),
  stem:p=>`Mekkora a megengedett legnagyobb hurokimpedancia (Zs,max) TN-rendszerben egy ${p.gorbe}${p.In} kismegszakítóval védett áramkörben, ha a kismegszakító pillanatkioldási tartományának felső határával számolunk (U0 = ${U1} V)?`,
  fmt:v=>formatNum(floorTo(v,3),3)+NB+'Ω',
  explain:(_p,ok)=>`A lekapcsolás feltétele, hogy a hibaáram elérje a kismegszakító pillanatkioldási áramát: Zs,max = cmin · U0 / (m · In), ahol m = 5 a B és 10 a C jelleggörbénél. Az eredmény ${ok} (a felső határt lefelé kerekítjük); a behelyettesítés a levezetésben látható.`,
  models:[
   {id:'rossz-m',why:'felcseréljük a B és a C jelleggörbe m-szorzóját (B: 5, C: 10)',value:(p,ok)=>ok*M_FACTOR[p.gorbe]/(p.gorbe==='B'?M_FACTOR.C:M_FACTOR.B)},
   {id:'m-nelkul',why:'kihagyjuk az m-szorzót, és csak a névleges árammal osztunk',value:(p,ok)=>ok*M_FACTOR[p.gorbe]},
   {id:'vonali',why:`a ${UV} V-os vonali feszültséggel számolunk a ${U1} V-os U0 helyett`,value:(_p,ok)=>ok*UV/U1},
   {id:'d-gorbe',why:'a D jelleggörbe szorzójával (20) számolunk',value:(p,ok)=>ok*M_FACTOR[p.gorbe]/M_FACTOR.D},
  ],
 }),
];
// A kismegszakító- és a Zs,max-sablon cikke („kismegszakito”) R3 – lektorra vár; a link csak a cikk közzététele után jelenik meg.

export const templateById=(id:string)=>TEMPLATES.find(t=>t.id===id);
/** A paraméterek érvényessége (tárolóból vagy linkből visszaolvasva): csak a sablon saját halmazaiból választott érték fogadható el. */
export function validParams(t:Template,p:unknown):p is Params{
 if(!p||typeof p!=='object'||Array.isArray(p))return false;
 const o=p as Record<string,unknown>;
 if(t.space){
  const keys=Object.keys(t.space);
  return Object.keys(o).length===keys.length&&keys.every(k=>(t.space![k] as readonly unknown[]).includes(o[k]));
 }
 return !!t.valid&&t.valid(o as Params);
}
/** Véletlen paraméterkészlet a sablon halmazaiból. */
export function pickParams(t:Template,rng:Rng):Params{
 if(t.pick)return t.pick(rng);
 const out:Record<string,number|string>={};
 for(const [k,vals] of Object.entries(t.space??{}))out[k]=oneOf(rng,vals);
 return out;
}
/** A paraméterkészlet kulcsa (egy teszten belül azonos paraméterű kérdés nem ismétlődik); a lista sorrendje nem számít. */
export const paramKey=(p:Params)=>Object.keys(p).sort().map(k=>{const v=p[k];return k+'='+(Array.isArray(v)?[...v].sort((a,b)=>a-b).join(';'):String(v))}).join('&');
