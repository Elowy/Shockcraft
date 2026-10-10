// Villanyrajz – lektori csomag generátora (szakmai lektornak szóló ellenőrzőcsomag).
// A tartalom a kódból készül: a lib/sizing-tables.ts exportjaiból (értékek, források, reviewText), a program
// „Mit nem vizsgál” listájából (SIZING_NOT_COVERED, a lib/sizing publikus exportja), a lib/phase-load.ts becsült
// teljesítményeiből, valamint a 3. részben a T1 kalkulátorok definícióiból (lib/calc: mezők, képletek, feltételezések,
// állandók, ujjlenyomatok). A képleteket és döntéseket leíró szövegek itt vannak; a tests/lektori-csomag.ts veti össze
// őket a program függvényeivel, a beépített mintaterv számításával és a kalkulátorok futtatásával (runCalc).
// A kimenetet kézzel ne szerkeszd.
//
// Futtatás a repó gyökeréből:
//   node --import tsx scripts/lektori-csomag.ts          → docs/lektori-csomag.md és docs/lektori-csomag.pdf
//   node --import tsx scripts/lektori-csomag.ts --check  → nem ír; 1-es kóddal kilép, ha a docs/ fájlok elavultak
// A folyamat (küldés, javítások, a jóváhagyás rögzítése): docs/lektoralas.md.
//
// Új rész (ábrák, cikkek, vizsgakérdések): írj egy `() => Part` függvényt (minta: calculatorsPart), és cseréld le vele a
// helyőrzőt a PARTS tömbben. A tételek azonosítója egyedi legyen; a tests/lektori-csomag.ts ellenőrzi.
import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {jsPDF} from 'jspdf';
import {CLAUSES,INSTALL_METHODS,INSULATIONS,SIZING_REVIEW,SIZING_TABLES as T,SOURCES,fingerprint,insulationLabels,methodLabels,reviewText,reviewedContent,tablesApproved,tablesFingerprint,type InstallMethod,type Insulation,type IzOverride,type SizingReview,type SourceKey} from '../lib/sizing-tables';
import type {CircuitSizing,PlanSizing} from '../lib/sizing-schema';
import {estimatedPower} from '../lib/phase-load';
import {SIZING_DISCLAIMER_SHORT,SIZING_NOT_COVERED} from '../lib/sizing';
import {runCalc,type CalcDef,type FieldDef,type NumberField,type Raw} from '../lib/calc/core';
import {bySlug,calcFingerprint,expertMeta,releaseInfo} from '../lib/calc/registry';
import {RELEASES,T1_SLUGS,TABLE_GATED,type ExpertReview,type ReleaseRecord} from '../lib/calc/release';
import {HP_W,LE_W,MCB_RATINGS,PSU_SIZES} from '../lib/calc/constants';
import {UNITS,unitById,type Unit,type UnitKind} from '../lib/calc/units';
import {SAFETY} from '../lib/kb/safety';
import {sourceFingerprint} from './calc-source';

// ---------------------------------------------------------------- Kiadások
export type Edition={number:number;date:string;content:string;note?:string};
/**
 * A csomag kiadásainak előzménylistája; a legutolsó az aktuális. Meglévő bejegyzést soha ne írj át.
 * Ha a csomag tartalma (bármely szöveg, tétel, érték vagy űrlapelem) változik, a generátor megáll, és új bejegyzést
 * kér a lista végére: number + 1, a mai dátum, az új csomag-ujjlenyomat. A dátum szándékosan rögzített (nem a futás
 * napja), így a kimenet determinisztikus és a --check megbízható. A már commitolt kiadás tartalmának átírását a
 * generátor a git HEAD-ben lévő docs/lektori-csomag.md-vel összevetve is jelzi.
 */
export const EDITIONS:readonly Edition[]=[
 {number:1,date:'2026-10-10',content:'48479e60',note:'belső tervezet, lektornak nem küldve; az ujjlenyomat még csak a tételeket fedte'},
 {number:2,date:'2026-10-10',content:'4f9723b6',note:'belső tervezet, lektornak nem küldve'},
 {number:3,date:'2026-10-10',content:'d8648424'},
];
export const EDITION=EDITIONS[EDITIONS.length-1];
export const PATHS={md:'docs/lektori-csomag.md',pdf:'docs/lektori-csomag.pdf',font:'public/fonts/NotoSans-Regular.ttf',sizingDoc:'docs/meretezes.md'} as const;
export const TITLE='Villanyrajz – lektori csomag';
const SUBTITLE='Szakmai lektori ellenőrzőcsomag a méretezési segédszámításhoz és a szabványhoz kötött kalkulátorokhoz: táblázatok, képletek, programozott döntések és kalkulátorok';

// ---------------------------------------------------------------- Modell
/** Pontokkal elválasztott útvonal a reviewedContent()-ben, pl. „tables.ampacity.PVC.2.B2.1”. */
export type Path=string;
/**
 * Mintaterv-számítás: a program beépített mintatervének (lib/plan seed) egy áramkörét a megadott módosításokkal
 * a lib/sizing circuitSizing() függvénye számolja végig (tests/lektori-csomag.ts).
 */
export type Scenario={
 circuit:'c1'|'c2'|'c3';
 set?:{cable?:string;rcd?:string;rating?:number;curve?:'B'|'C'|'D';phase?:'L1'|'3P';load?:number};
 /** Az áramkör összes nyomvonalának kábeljelölése. */
 routeCable?:string;
 /** Az áramkör első nyomvonalával azonos geometriájú második szakasz ezzel a kábeljelöléssel. */
 extraRoute?:string;
 sizing?:CircuitSizing;plan?:Omit<PlanSizing,'boards'>;board?:{upstreamDrop?:number;zs?:number};
 /** Az áramkör védelmi modulja: RCBO-ra cserélve, vagy null = nincs modul. */
 module?:'RCBO'|null;
 /** Az áramkör szerelvényeinek leválasztása (nincs becsülhető terhelés). */
 noDevices?:boolean;
};
/**
 * Elvárt eredmény kulcsonként: mezőútvonal (pl. „iz”, „governing.method.source”), „check:<kód>” (állapot),
 * „detail:<kód>” / „clause:<kód>” (részszöveg), „ref:<címke>” (forrás állapota), „assumes” / „assumesStrong” (feltételezés-részszöveg).
 */
export type Expect=Record<string,string|number|boolean|null>;
/** A program függvényével való összevetés (tests/lektori-csomag.ts): a kézzel számolt példa a programmal azonos-e. */
export type ProgramCheck=
 |{fn:'designCurrent';args:[number,'L1'|'3P',number];expect:number}
 |{fn:'correctedIz';args:[number,number,number];expect:number}
 |{fn:'voltageDropPercent';args:[{b:number;length:number;current:number;section:number;cosPhi:number}];expect:number}
 |{fn:'loopResistance';args:[number,number];expect:number}
 |{fn:'maxLoopImpedance';args:['B'|'C'|'D',number];expect:number}
 |{fn:'maxLengthForDrop';args:[number,number,number,number,number];expect:number}
 |{fn:'minSectionFor';args:[number,InstallMethod,Insulation,2|3,number,number]|[number,InstallMethod,Insulation,2|3,number,number,IzOverride[]];expect:number|null}
 |{fn:'atMost';args:[number,number];expect:boolean}
 |{fn:'parseCable';args:[string];expect:{ok:true;section:number;insulation:Insulation|null}|{ok:false;code:string}}
 |{fn:'temperatureFactor';args:[Insulation,number];expect:number}
 |{fn:'groupingFactor';args:[number];expect:number}
 |{fn:'circuitSizing';args:[Scenario];expect:Expect}
 |{fn:'schema';args:['circuit'|'plan'|'board'|'override',string,unknown];expect:boolean}
 |{fn:'notCovered';args:[];expect:string[]}
 |{fn:'labels';args:[];expect:{ok:string;warn:string;fail:string;na:string;checkOk:string;skipped:string}}
 /** Kalkulátorfuttatás (lib/calc runCalc) a megadott nyers bemenettel; az elvárásokat lásd CalcExpect. */
 |{fn:'calc';args:[string,Raw];expect:CalcExpect}
 /** Bemeneti korlát: a mező értékét a kalkulátor elfogadja-e (nincs a mezőhöz kötött bemeneti hiba). */
 |{fn:'calcField';args:[string,Raw,string];expect:boolean}
 /** A kalkulátor „Nem vizsgált” listája. */
 |{fn:'calcNotCovered';args:[string];expect:string[]};
/**
 * Kalkulátorfuttatás elvárt eredménye kulcsonként: eredményazonosító → szám (relatív 10⁻⁹ tűréssel) vagy null (nincs ilyen eredmény);
 * „text:<id>” a kiírt szöveg (pontosan); „ok” (van-e eredmény), „error” / „errorField” (bemeneti vagy számítási hiba szövegrésze / mezője),
 * „verdict” (a feltétel teljesül-e), „verdictText”, „issue” (figyelmeztetés vagy tájékoztatás szövegrésze), „issues” (darabszám),
 * „assumption” (feltételezés szövegrésze), „primary” (a fő eredmények azonosítói vesszővel).
 */
export type CalcExpect=Record<string,string|number|boolean|null>;
/** Táblázati érték vagy szöveges tétel: azonosító, megnevezés, érték, és hogy a jóváhagyandó tartalom mely leveleit fedi. */
export type ValueItem={kind:'value';id:string;label:string;value:string;paths:Path[];checks?:ProgramCheck[]};
/** Képlet vagy programozott döntés: szabály, indoklás, kézzel számolt példa, (kérdés a lektorhoz), forrás. */
export type RuleItem={kind:'rule';id:string;title:string;rule:string;rationale:string;example:string;question?:string;source:string;checks:ProgramCheck[]};
export type Item=ValueItem|RuleItem;
export type Matrix={corner:string;columns:string[];rows:{label:string;cells:string[]}[]};
/** `layout`: a PDF-táblázat oszlopszélességei mm-ben (azonosító, megnevezés, érték, helyes érték; a ✓ és ✗ oszlop 7–7 mm) és az érték igazítása. */
export type Block={id:string;title:string;source:string;intro:string[];minutes:number;columns?:[string,string];layout?:{widths:[number,number,number,number];align:'left'|'right'};matrix?:Matrix;questions?:{id:string;text:string}[];items:Item[]};
export type Part={no:number;title:string;intro:string[];blocks:Block[];placeholder?:{prefix:string;planned:string[]}};
/** A 3. rész egy kalkulátora a jóváhagyó laphoz: tartalmi és forrás-ujjlenyomat, táblázat-kapu, jelenlegi kiadási állapot. */
export type CalcRow={slug:string;title:string;id:string;fingerprint:string;source:string;gated:boolean;state:string};
export type Package={edition:Edition;parts:Part[];fingerprints:{tables:string;formulas:string;calculators:string;content:string};review:SizingReview;approved:boolean;tablesVersion:string;notCovered:string[];calcs:CalcRow[]};

// ---------------------------------------------------------------- Formázás
/** Kerekített szám a kézzel számolt példákhoz. */
const hu=(n:number,d=5)=>n.toLocaleString('hu-HU',{maximumFractionDigits:d});
/** Táblázati érték kerekítés nélkül: ha a kiírt szöveg nem pontosan a programban tárolt szám, a generátor megáll. */
export function exact(n:number):string{
 const s=n.toLocaleString('hu-HU',{maximumFractionDigits:10,useGrouping:false});
 if(Number(s.replace(',','.'))!==n)throw Error(`A(z) ${n} érték nem írható ki pontosan (${s}); a csomag nem mutathat kerekített táblázatértéket.`);
 return s;
}
const pct=(n:number,d=2)=>hu(n,d)+'%';
const dateHu=(iso:string)=>{const [y,m,d]=iso.split('-');return `${y}. ${m}. ${d}.`};
const tableNo=(k:SourceKey)=>SOURCES[k].item.split(/[\s,]/)[0];
const src=(k:SourceKey)=>SOURCES[k].standard+' – '+SOURCES[k].item;
const duration=(min:number)=>(min>=60?Math.floor(min/60)+' óra ':'')+(min%60?min%60+' perc':'').trim();
/** Ugyanaz a tűrés, mint a programban (D-TURES): a ≤ b + 1e-9 · max(1, |b|). */
const le=(a:number,b:number)=>a<=b+1e-9*Math.max(1,Math.abs(b));
const rel=(a:number,b:number)=>le(a,b)?'≤':'>';
const ge=(a:number,b:number)=>le(b,a)?'≥':'<';
const verdict=(ok:boolean)=>ok?'megfelel':'nem felel meg';
export const editionLabel=(e:{number:number;date:string}=EDITION)=>`LK-${e.number} (${dateHu(e.date)})`;
/** k = I2 / In; a program a 433.1 (2) Iz-szorzójaként is ezt használja (T-K-I2). */
const K2=exact(T.conventionalFactor);

// ---------------------------------------------------------------- Táblázati segédek (a generátor saját, a programtól független számítása)
const idx=(s:number)=>{const i=T.sections.indexOf(s);if(i<0)throw Error('Nincs ilyen keresztmetszet a táblázatban: '+s);return i};
const iz0=(loaded:2|3,m:InstallMethod,s:number)=>T.ampacity.PVC[loaded][m][idx(s)];
const step=<V,>(steps:readonly number[],values:readonly V[],x:number)=>{const i=steps.findIndex(v=>v>=x);const j=i<0?steps.length-1:i;return {step:steps[j],value:values[j]}};
const kTemp=(θ:number)=>step(T.ambient.steps,T.ambient.PVC,θ);
const kGroup=(n:number)=>step(T.grouping.counts,T.grouping.factors,n);
const sinOf=(c:number)=>Math.sqrt(Math.max(0,1-c*c));
const drop=(b:number,L:number,I:number,A:number,c:number)=>b*L*I*(T.rho1*c/A+T.lambda*sinOf(c))/T.u0*100;
const loopR=(L:number,A:number,pe=A)=>T.rho1*L*(1/A+1/pe);
const zsMax=(curve:'B'|'C'|'D',In:number)=>T.cmin*T.u0/(T.instantaneous[curve]*In);
const designI=(P:number,n:1|3,c:number)=>P/(n*T.u0*c);

// ---------------------------------------------------------------- 1. rész – Méretezési táblázatok
const value=(id:string,label:string,v:string,paths:Path[],checks?:ProgramCheck[]):ValueItem=>({kind:'value',id,label,value:v,paths,...(checks?{checks}:{})});
const supplyNames={public:{id:'KOZ',label:'Közcélú kisfeszültségű hálózatról táplált berendezés'},private:{id:'SAJ',label:'Saját kisfeszültségű táppontról táplált berendezés'}} as const;
const usageNames={lighting:{id:'VIL',label:'világítás'},other:{id:'EGY',label:'egyéb fogyasztó'}} as const;
const clauseLabels:Record<string,string>={rho1:'ρ1 (réz fajlagos ellenállása) a számítási sorban',lambda:'λ (fajlagos reaktancia) a számítási sorban',cmin:'cmin és a hurokimpedancia-feltétel',overload:`Túlterhelés-védelem: Ib ≤ In ≤ Iz és I2 ≤ ${K2} · Iz`,minSection:'Legkisebb keresztmetszet',dropLimit:'Feszültségesés-határ'};

function ampacityBlocks(ins:Insulation):Block[]{
 const table=T.ampacity[ins];
 if(!table)return [];
 return ([2,3] as const).map(loaded=>{
  const key:SourceKey=ins==='PVC'?(loaded===2?'pvc2':'pvc3'):(loaded===2?'xlpe2':'xlpe3'),id='T-'+ins+loaded;
  const items:ValueItem[]=[];
  T.sections.forEach((s,i)=>{for(const m of INSTALL_METHODS)items.push(value(`${id}-${m}-${s}`,`${m} · ${exact(s)} mm²`,exact(table[loaded][m][i])+' A',[`tables.ampacity.${ins}.${loaded}.${m}.${i}`]))});
  return {id,title:`Terhelhetőség Iz0 – ${ins}, réz, ${loaded} terhelt ér`,source:src(key),minutes:12,layout:{widths:[30,40,22,72],align:'right'},
   intro:[`Rézvezető, ${ins==='PVC'?'70':'90'} °C-os vezetőhőmérséklet, 30 °C-os levegő, egyetlen áramkör. Sorok: keresztmetszet; oszlopok: szerelési mód (leírásuk az L blokkban). Az áttekintő mátrix sorai a szabvány táblázatának soraival vethetők össze; eltérésnél az alatta lévő tétellistában kell az azonosítót ✗-szel jelölni.`],
   matrix:{corner:'mm²',columns:[...INSTALL_METHODS],rows:T.sections.map((s,i)=>({label:exact(s),cells:INSTALL_METHODS.map(m=>exact(table[loaded][m][i]))}))},items} satisfies Block;
 });
}

function tablesPart():Part{
 const blocks:Block[]=[];
 blocks.push({id:'T-KM',title:'Keresztmetszet-lépcsők',source:SOURCES.pvc2.standard+' '+tableNo('pvc2')+', '+tableNo('pvc3')+' (keresztmetszet-oszlop)',minutes:1,layout:{widths:[26,32,56,50],align:'left'},
  intro:['A rézvezető névleges keresztmetszetei, amelyekre a program terhelhetőséget tárol. Más keresztmetszettel a program nem számol (D-BLOKK).'],
  items:[value('T-KM-SOR','Keresztmetszetek (réz)',T.sections.map(exact).join('; ')+' mm²',T.sections.map((_,i)=>'tables.sections.'+i))]});
 blocks.push(...ampacityBlocks('PVC'),...ampacityBlocks('XLPE'));
 const xlpeNull:ValueItem[]=[];
 if(!T.ampacity.XLPE)xlpeNull.push(value('T-XLPE-IZ0',`XLPE/EPR terhelhetőség (${tableNo('xlpe2')}, ${tableNo('xlpe3')})`,'nincs rögzítve – PVC-értékkel számol (D-XLPE)',['tables.ampacity.XLPE']));
 if(!T.ambient.XLPE)xlpeNull.push(value('T-XLPE-KT',`XLPE/EPR hőmérsékleti tényező (${tableNo('ambient')})`,'nincs rögzítve – PVC-sorral, 30 °C alatt 1-re korlátozva (D-XLPE)',['tables.ambient.XLPE']));
 if(xlpeNull.length)blocks.push({id:'T-XLPE',title:'XLPE/EPR-táblázatok (szándékosan üres)',source:src('xlpe2')+'; '+src('xlpe3'),minutes:2,layout:{widths:[26,48,50,40],align:'left'},
  intro:['A program XLPE-táblázatot nem tartalmaz. Jóváhagyás (✓) esetén a lektor elfogadja, hogy üres marad (a program a kedvezőtlenebb PVC-értékkel számol). Ha a kitöltését javasolja, a teljes táblázatot külön mellékletben kérjük megadni (a tételazonosítóra hivatkozva); ide elég a „melléklet” jelzés.'],items:xlpeNull});
 const ambientRows:{ins:Insulation;row:number[]}[]=[{ins:'PVC',row:T.ambient.PVC},...(T.ambient.XLPE?[{ins:'XLPE' as const,row:T.ambient.XLPE}]:[])];
 for(const {ins,row} of ambientRows){
  const id=ins==='PVC'?'T-KT':'T-KT-XLPE';
  blocks.push({id,title:`Hőmérsékleti tényező kθ – ${ins}, levegőben`,source:src('ambient'),minutes:4,layout:{widths:[30,40,22,72],align:'right'},
   intro:['A környezeti levegő hőmérséklete szerinti csökkentő (30 °C alatt növelő) tényező. A program a lépcsők között nem interpolál, hanem a következő, nagyobb vagy egyenlő lépcsőt veszi (D-KEREK).'],
   items:T.ambient.steps.map((θ,i)=>value(`${id}-${θ}`,`${ins} · ${θ} °C`,exact(row[i]),ins==='PVC'?[`tables.ambient.steps.${i}`,`tables.ambient.PVC.${i}`]:[`tables.ambient.XLPE.${i}`]))});
 }
 blocks.push({id:'T-KCS',title:'Csoportosítási tényező kcs',source:src('grouping'),minutes:4,layout:{widths:[30,40,22,72],align:'right'},
  intro:['Együtt vezetett (terhelt) áramkörök száma szerinti tényező, kizárólag a táblázat 1. sora szerint (kötegelve, felületen, beágyazva vagy zártan). Lépcsők között a következő nagyobb oszlop (D-KEREK).'],
  items:T.grouping.counts.map((n,i)=>value(`T-KCS-${n}`,`${n} áramkör`,exact(T.grouping.factors[i]),[`tables.grouping.counts.${i}`,`tables.grouping.factors.${i}`]))});
 const du:ValueItem[]=[];
 for(const s of Object.keys(T.dropLimits) as (keyof typeof T.dropLimits)[])for(const u of Object.keys(T.dropLimits[s]) as (keyof typeof T.dropLimits.public)[])
  du.push(value(`T-DU-${supplyNames[s].id}-${usageNames[u].id}`,`${supplyNames[s].label} · ${usageNames[u].label}`,exact(T.dropLimits[s][u])+'%',[`tables.dropLimits.${s}.${u}`]));
 blocks.push({id:'T-DU',title:'Feszültségesés-határ',source:SOURCES.voltageDrop.standard+' '+CLAUSES.dropLimit+' (tájékoztató melléklet)',minutes:3,layout:{widths:[30,66,18,50],align:'right'},
  intro:['A berendezés kezdőpontjától (csatlakozási pont) a fogyasztóig megengedett legnagyobb feszültségesés, U0-ra vonatkoztatott százalékban.'],items:du});
 const k:ValueItem[]=[
  value('T-K-U0','Névleges fázis–föld feszültség, U0',exact(T.u0)+' V',['tables.u0']),
  value('T-K-RHO1','Réz fajlagos ellenállása üzemi hőmérsékleten, ρ1 (a feszültségeséshez és a hurokellenálláshoz is; lásd K-ZS)',exact(T.rho1)+' Ω·mm²/m',['tables.rho1']),
  value('T-K-LAMBDA','Vezető fajlagos reaktanciája, λ',exact(T.lambda)+' Ω/m ('+hu(T.lambda*1000)+' mΩ/m)',['tables.lambda']),
  value('T-K-CMIN','Feszültségtényező a hurokimpedancia-feltételben, cmin (a program képletének tényezője; lásd a kérdést és K-ZS)',exact(T.cmin),['tables.cmin']),
  value('T-K-AMIN','Legkisebb keresztmetszet (réz, erősáramú és világítási áramkör)',exact(T.minSection)+' mm²',['tables.minSection']),
  value('T-K-I2','k = I2 / In, két szerepben: (1) a kismegszakító és az RCBO megállapodás szerinti kioldóárama az In szorzójaként (termékszabvány); (2) ugyanez a szám a 433.1 (2) feltétel Iz-szorzója (I2 ≤ k · Iz)',K2,['tables.conventionalFactor']),
  ...(Object.keys(T.instantaneous) as (keyof typeof T.instantaneous)[]).map(c=>value(`T-K-M-${c}`,`Pillanatkioldás felső határa, ${c} jelleggörbe (m)`,exact(T.instantaneous[c])+' · In',[`tables.instantaneous.${c}`])),
 ];
 blocks.push({id:'T-K',title:'Állandók',source:`${SOURCES.voltage.standard} (U0); ${SOURCES.voltageDrop.standard} ${CLAUSES.lambda} (ρ1, λ); ${SOURCES.loop.standard} ${CLAUSES.cmin} (cmin); ${SOURCES.minSection.standard} ${CLAUSES.minSection} (legkisebb keresztmetszet); ${SOURCES.mcb.standard}, ${SOURCES.rcbo.standard} (I2/In, m); ${SOURCES.overload.standard} ${CLAUSES.overload} (Iz-szorzó)`,minutes:8,layout:{widths:[24,62,28,50],align:'right'},
  intro:['A képletekben (2. rész) használt állandók. A forrásuk tételesen az F- és SZP- tételeknél ellenőrizhető.'],
  questions:[
   {id:'T-K-CMIN',text:`A hatályos MSZ HD 60364-4-41 kiadás 411.4.4 pontja Zs · Ia ≤ U0 · Cmin alakú, Cmin = 0,95 értékkel? A program az ${SOURCES.loop.standard} alakjának (Zs · Ia ≤ U0) megfelelően cmin = ${exact(T.cmin)} értékkel számol. Ha igen: a tételt ✗-szel kérjük jelölni, helyes érték 0,95, és az F-LOOP tételnél a kiadás és a feltétel is javítandó.`},
   {id:'T-K-I2',text:`A program a termékszabvány szerinti I2/In-t és a 433.1 (2) feltétel Iz-szorzóját ugyanazzal az egy értékkel (${K2}) kezeli; ha a tétel javításakor a két szerep eltérő értéket kívánna, kérjük mindkettőt külön megadni.`},
  ],items:k});
 blocks.push({id:'F',title:'Forrásmegjelölések',source:'A programban rögzített forrásmegjelölések (szabvány, kiadás, pont vagy táblázat)',minutes:15,columns:['Szabvány (kiadás)','Hivatkozott pont / táblázat'],layout:{widths:[28,32,54,50],align:'left'},
  intro:['A felületen és a PDF-ben a számítási sorok ezekre hivatkoznak. Ellenőrizendő a szabvány jelzete és kiadásának éve (ha már nem hatályos: ✗ és a hatályos kiadás), a pont- és táblázatszám, valamint a leírás – a leírás szövege (pl. a készülék megnevezése) a felületen is így jelenik meg.'],
  items:(Object.keys(SOURCES) as SourceKey[]).map(key=>value('F-'+key.toUpperCase(),SOURCES[key].standard,SOURCES[key].item,[`sources.${key}.standard`,`sources.${key}.item`]))});
 blocks.push({id:'SZP',title:'Számítási sorokban hivatkozott szabványpontok',source:'A programban rögzített rövid hivatkozások (a fenti forrásmegjelölések pontjai)',minutes:4,columns:['Mire vonatkozik','Hivatkozott pont'],layout:{widths:[30,56,28,50],align:'left'},
  intro:['A számítási sorok végén álló rövid hivatkozások. Ellenőrizendő, hogy a pont a megadott szabályt tartalmazza.'],
  items:(Object.keys(CLAUSES) as (keyof typeof CLAUSES)[]).map(key=>value('SZP-'+key.toUpperCase(),clauseLabels[key]??key,CLAUSES[key],['clauses.'+key]))});
 blocks.push({id:'L',title:'Szerelésimód- és szigetelésleírások',source:src('methods'),minutes:5,columns:['Kód','Leírás a felületen'],layout:{widths:[26,14,74,50],align:'left'},
  intro:['A felhasználó ezek közül választ; a leírásnak egyértelműen a szabvány szerinti referencia-szerelési módot kell azonosítania.'],
  items:[...INSTALL_METHODS.map(m=>value('L-MOD-'+m,m,methodLabels[m],['methodLabels.'+m])),...INSULATIONS.map(i=>value('L-SZIG-'+i,i,insulationLabels[i],['insulationLabels.'+i]))]});
 return {no:1,title:'Méretezési táblázatok',blocks,intro:[
  'A program a méretezési segédszámításban kizárólag az alábbi értékekkel számol. Minden érték, forrásmegjelölés és leírás a programban egyetlen helyen van rögzítve; a jóváhagyás ezek összességére vonatkozik, és a program a táblázat-ujjlenyomathoz köti: ha bármelyik megváltozik, a program magától „ellenőrizendő” állapotra áll vissza.',
  'Az értékek nem a hiteles MSZ HD szövegből kerültek át, ezért mindegyiket a szabvány hatályos kiadásával kell összevetni. A táblázatszámok az IEC 60364-5-52:2009 B mellékletével azonos számozást feltételeznek; ez maga is ellenőrizendő (F- tételek). A számértékek kerekítés nélkül, a programban tárolt pontossággal szerepelnek.',
 ]};
}
/** A jóváhagyandó tartalom útvonalai, amelyek nem tételek, hanem a csomag fejlécében szerepelnek. */
export const META_PATHS:Path[]=['tables.version'];

// ---------------------------------------------------------------- 2. rész – Képletek és programozott döntések
const rule=(id:string,title:string,r:string,rationale:string,example:string,source:string,checks:ProgramCheck[]=[],question?:string):RuleItem=>({kind:'rule',id,title,rule:r,rationale,example,...(question?{question}:{}),source,checks});
/** Mintaterv-számítás (rövidítés). */
const sc=(s:Scenario,expect:Expect):ProgramCheck=>({fn:'circuitSizing',args:[s],expect});
const schema=(scope:'circuit'|'plan'|'board'|'override',field:string,ok:unknown[],bad:unknown[]):ProgramCheck[]=>[...ok.map(v=>({fn:'schema' as const,args:[scope,field,v] as ['circuit'|'plan'|'board'|'override',string,unknown],expect:true})),...bad.map(v=>({fn:'schema' as const,args:[scope,field,v] as ['circuit'|'plan'|'board'|'override',string,unknown],expect:false}))];
const pc=(text:string,expect:Extract<ProgramCheck,{fn:'parseCable'}>['expect']):ProgramCheck=>({fn:'parseCable',args:[text],expect});
const pvcOk=(text:string,section:number,insulation:Insulation|null):ProgramCheck=>pc(text,{ok:true,section,insulation});

/** A docs/meretezes.md „## Mit nem vizsgál” felsorolása (a teszt ezt veti össze a program listájával, és eltérésnél figyelmeztet). */
export function notCoveredFrom(md:string):string[]{
 const lines=md.split(/\r?\n/),start=lines.findIndex(l=>l.trim()==='## Mit nem vizsgál');
 if(start<0)throw Error(PATHS.sizingDoc+': nem található a „## Mit nem vizsgál” szakasz.');
 const out:string[]=[];
 for(const l of lines.slice(start+1)){if(l.startsWith('## '))break;if(l.startsWith('- '))out.push(l.slice(2).replace(/`/g,'').trim())}
 if(!out.length)throw Error(PATHS.sizingDoc+': a „Mit nem vizsgál” szakasz üres.');
 return out;
}

/** A program eredmény- és ellenőrzéscímkéi (D-ALLAPOT; a teszt veti össze a statusLabels / checkStatusLabels exporttal). */
const LABELS={ok:'Számítás szerint megfelel',warn:'Figyelmeztetés',fail:'Nem felel meg',na:'Nem számítható',checkOk:'Rendben',skipped:'Nem vizsgált'};
/** A mintaterv (a program beépített példaterve, „Családi ház”) áramkörei, ahogy a 2. rész példái hivatkoznak rájuk. */
const MT={c1:{length:23.4,watts:(estimatedPower.double??0)+(estimatedPower.socket??0)},c3:{length:9}};

function formulasPart(notCovered:string[]):Part{
 const ov=SOURCES.overload.standard,ss=SOURCES.pvc2.standard,lp=SOURCES.loop.standard,k=T.conventionalFactor;
 // Kézzel számolt példák (a generátor saját számítása a táblázatértékekből; a teszt a program függvényeivel és a mintatervvel veti össze).
 const ib1=designI(3680,1,1),ib3=designI(11000,3,0.85);
 const izA=iz0(2,'B2',2.5),kt35=kTemp(35),kc3=kGroup(3),izEx=izA*kt35.value*kc3.value;
 const iz4=iz0(2,'B2',4),iz4Ex=iz4*kt35.value*kc3.value,minA=T.sections.find(s=>le(16,iz0(2,'B2',s)*kt35.value*kc3.value))??null;
 const du1=drop(2,MT.c1.length,16,2.5,1),du3=drop(1,20,ib3,4,0.85);
 const lmax=(lim0:number)=>lim0/100*T.u0/(2*10*(T.rho1/1.5));
 const r234=loopR(MT.c1.length,2.5),zs=0.35+r234,zB16=zsMax('B',16),zC16=zsMax('C',16),zsAvk=1.2+r234;
 const kt40=kTemp(40),kc4=kGroup(4),kt33=kTemp(33),kc10=kGroup(10),kt25=kTemp(25);
 const segA=drop(2,10,10,2.5,1),segB=drop(2,5,10,1.5,1),segO=drop(2,15,10,1.5,1);
 const ibEst=MT.c1.watts/T.u0;
 const est=Object.entries(estimatedPower).map(([key,w])=>({socket:'dugalj',double:'kettős dugalj',light:'lámpakiállás'} as Record<string,string>)[key]+' '+w+' W').join(', ');
 const lim=T.dropLimits,du1up=du1+1.5;
 const ovr:IzOverride={method:'B2',insulation:'PVC',loaded:2,section:2.5,iz:30,note:'gyártói adatlap'};
 const izOvr=ovr.iz*kt40.value*kc3.value,izNoOvr=izA*kt40.value*kc3.value;
 const minOvr=T.sections.find(s=>le(16,(s===2.5?ovr.iz:iz0(2,'B2',s))*kt40.value*kc3.value))??null,minNoOvr=T.sections.find(s=>le(16,iz0(2,'B2',s)*kt40.value*kc3.value))??null;
 const seg2=[drop(2,MT.c1.length,16,2.5,1),drop(2,MT.c1.length,16,1.5,1)],iz15=iz0(2,'B2',1.5);
 const K:RuleItem[]=[
  rule('K-IB','Tervezett áram (Ib)',
   'Ib = P / (n · U0 · cos φ); n = 1 egyfázisú, n = 3 háromfázisú áramkörnél. Háromfázisnál ez a (szimmetrikusnak feltételezett) fázisáram, ami azonos a P / (√3 · U · cos φ) alakkal (U = √3 · U0).',
   'A terhelés a tervben wattban adott; a túlterhelés-védelem vizsgálatához a fázisáram kell. A program a fázis–föld feszültséggel (T-K-U0) számol.',
   `Egyfázis, P = 3680 W, cos φ = 1: Ib = 3680 / (1 · ${exact(T.u0)} · 1) = ${hu(ib1,2)} A. Háromfázis, P = 11 000 W, cos φ = 0,85: Ib = 11 000 / (3 · ${exact(T.u0)} · 0,85) = ${hu(ib3,2)} A.`,
   ov+' '+CLAUSES.overload+' (1)',
   [{fn:'designCurrent',args:[3680,'L1',1],expect:ib1},{fn:'designCurrent',args:[11000,'3P',0.85],expect:ib3},sc({circuit:'c1',set:{load:3680}},{ib:ib1,ibSource:'megadott'})]),
  rule('K-IZ','Javított terhelhetőség (Iz)',
   'Iz = Iz0 · kθ · kcs. Iz0 a szerelési mód, a szigetelés, a terhelt erek száma (egyfázis: 2, háromfázis: 3) és a keresztmetszet szerinti táblázati érték (T-PVC2, T-PVC3) vagy projekt-felülírás (D-FELULIR), kθ a környezeti hőmérséklet (T-KT), kcs az együtt vezetett áramkörök száma szerinti tényező (T-KCS). A szorzatot a program nem kerekíti, csak a kijelzés kerekít két tizedesre.',
   'A táblázati terhelhetőség a referencia-körülményekre (30 °C, egyetlen áramkör) vonatkozik; az eltérést a két tényező szorzata veszi figyelembe. A nullavezető terhelését a program nem vizsgálja (háromfázisnál 3 terhelt ér).',
   `B2, 2,5 mm², 2 terhelt ér, PVC: Iz0 = ${exact(izA)} A (T-PVC2-B2-2.5); 35 °C: kθ = ${exact(kt35.value)} (T-KT-35); 3 áramkör: kcs = ${exact(kc3.value)} (T-KCS-3). Iz = ${exact(izA)} · ${exact(kt35.value)} · ${exact(kc3.value)} = ${hu(izEx,3)} A.`,
   `${ss} 523; ${tableNo('pvc2')}, ${tableNo('pvc3')}, ${tableNo('ambient')}, ${tableNo('grouping')}`,
   [{fn:'correctedIz',args:[izA,kt35.value,kc3.value],expect:izEx},sc({circuit:'c1',sizing:{ambient:35,grouped:3}},{iz:izEx,kTemp:kt35.value,kGroup:kc3.value})]),
  rule('K-TUL','Túlterhelés-védelem: Ib ≤ In ≤ Iz',
   'Mindkét egyenlőtlenséget vizsgálja. Megadott terhelésnél Ib > In „Nem felel meg”, becsült terhelésnél „Figyelmeztetés” (D-BECSULT); In > Iz mindig „Nem felel meg”. Több szakasznál a legkisebb Iz-jű szakasz a mértékadó (D-SZAKASZ).',
   'Az MSZ HD 60364-4-43 433.1 (1) feltétele. In a tervben megadott kismegszakító-névleges áram; állítható kioldót a program nem kezel.',
   `Az előző Iz = ${hu(izEx,2)} A mellett B16 kismegszakító, P = 2300 W: Ib = 2300 / ${exact(T.u0)} = ${hu(designI(2300,1,1),2)} A ${rel(designI(2300,1,1),16)} In = 16 A, és In = 16 A ${rel(16,izEx)} Iz = ${hu(izEx,2)} A → ${verdict(le(16,izEx))}.`,
   ov+' '+CLAUSES.overload+' (1)',
   [{fn:'atMost',args:[16,izEx],expect:le(16,izEx)},sc({circuit:'c1',set:{load:2300},sizing:{ambient:35,grouped:3}},{'check:design-current':'ok','check:overload':le(16,izEx)?'ok':'fail'}),sc({circuit:'c1',set:{load:4600}},{'check:design-current':'fail'})]),
  rule('K-JAV','Javasolt keresztmetszet In > Iz esetén',
   `Ha In > Iz, a program javaslatként kiírja a legkisebb táblázati keresztmetszetet, amelynél In ≤ Iz0 · kθ · kcs ugyanazzal a szerelési móddal, szigeteléssel és terhelt érszámmal (projekt-felülírás esetén azzal, D-FELULIR); ha ${exact(T.sections[T.sections.length-1])} mm²-ig nincs ilyen, keresztmetszetet nem javasol. A választás és az ellenőrzés a tervezőé.`,
   'A javaslat a K-IZ képlet visszafelé alkalmazása a táblázat lépcsőin; más feltételt (feszültségesés, hurokimpedancia) a javaslat nem vizsgál.',
   `Az előző áramkör (B2, 35 °C, 3 áramkör, kθ · kcs = ${hu(kt35.value*kc3.value,4)}), B16: 2,5 mm²: ${exact(izA)} · ${hu(kt35.value*kc3.value,4)} = ${hu(izEx,2)} A ${ge(izEx,16)} 16 A; 4 mm²: ${exact(iz4)} · ${hu(kt35.value*kc3.value,4)} = ${hu(iz4Ex,2)} A ${ge(iz4Ex,16)} 16 A → javaslat: ${minA===null?'nincs':exact(minA)+' mm²'}.`,
   ov+' '+CLAUSES.overload+' (1)',
   [{fn:'minSectionFor',args:[16,'B2','PVC',2,kt35.value,kc3.value],expect:minA},...(minA===null?[]:[sc({circuit:'c1',sizing:{ambient:35,grouped:3}},{'detail:overload':`legalább ${exact(minA)} mm²`})])]),
  rule('K-I2',`A védelem működési árama: I2 ≤ ${K2} · Iz`,
   `I2 = k · In ≤ k · Iz, ahol k = ${K2} (T-K-I2) mindkét helyen: kismegszakítónál és túláramvédelemmel egybeépített áram-védőkapcsolónál (RCBO) a termékszabvány szerinti I2/In, egyben a 433.1 (2) feltétel Iz-szorzója. A program a két szerepben ugyanazt az egy értéket használja, ezért a feltétel az In ≤ Iz-vel együtt teljesül vagy sérül; a program külön sorban is kiírja.`,
   `${ov} ${CLAUSES.overload} (2); a megállapodás szerinti kioldóáram a termékszabvány (${SOURCES.mcb.standard}, RCBO: ${SOURCES.rcbo.standard}) szerint. Olvadóbiztosítót és állítható kioldót a program nem kezel (D-KESZ). Ha a T-K-I2 értéke változik, a program mindkét szerepben az új értéket használja.`,
   `In = 16 A, Iz = ${exact(izA)} A: I2 = ${K2} · 16 = ${hu(k*16,2)} A ${rel(k*16,k*izA)} ${K2} · ${exact(izA)} = ${hu(k*izA,2)} A.`,
   `${ov} ${CLAUSES.overload} (2); ${SOURCES.mcb.standard}; ${SOURCES.rcbo.standard}`,
   [{fn:'atMost',args:[k*16,k*izA],expect:le(k*16,k*izA)},sc({circuit:'c1'},{'check:i2':'ok','clause:i2':SOURCES.mcb.standard}),sc({circuit:'c1',sizing:{ambient:35,grouped:3}},{'check:i2':le(16,izEx)?'ok':'fail'})]),
  rule('K-DU1','Feszültségesés, egyfázisú áramkör',
   'ΔU% = 2 · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100, ahol L a mértékadó hossz (m), I a számítási áram (Ib; becsült terhelésnél D-BECSULT), A a keresztmetszet (mm²), sin φ = √(1 − cos² φ).',
   `${CLAUSES.lambda} szerinti képlet b = 2 tényezővel (oda- és visszavezető); ρ1: T-K-RHO1, λ: T-K-LAMBDA. A százalék U0-ra vonatkozik.`,
   `L = ${hu(MT.c1.length)} m, I = 16 A, A = 2,5 mm², cos φ = 1: ΔU = 2 · ${hu(MT.c1.length)} · 16 · ${exact(T.rho1)} / 2,5 / ${exact(T.u0)} · 100 = ${pct(du1)}.`,
   SOURCES.voltageDrop.standard+' 525, '+CLAUSES.lambda,
   [{fn:'voltageDropPercent',args:[{b:2,length:MT.c1.length,current:16,section:2.5,cosPhi:1}],expect:du1},sc({circuit:'c1',set:{load:3680}},{drop:du1})]),
  rule('K-DU3','Feszültségesés, háromfázisú áramkör',
   'ΔU% = 1 · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100 (b = 1), ahol I a fázisáram. A százalék a fázis–föld feszültségre (U0) vonatkozik; szimmetrikus terhelésnél ez azonos a vonali feszültségre vonatkoztatott százalékkal.',
   `${CLAUSES.lambda} szerint háromfázisú, szimmetrikus áramkörnél b = 1 (a nullavezetőn nincs esés). Aszimmetrikus terhelést a program nem vizsgál.`,
   `L = 20 m, I = ${hu(ib3,2)} A (K-IB), A = 4 mm², cos φ = 0,85, sin φ = ${hu(sinOf(0.85),3)}: ΔU = 20 · ${hu(ib3,2)} · (${exact(T.rho1)} · 0,85 / 4 + ${exact(T.lambda)} · ${hu(sinOf(0.85),3)}) / ${exact(T.u0)} · 100 = ${pct(du3)}.`,
   SOURCES.voltageDrop.standard+' 525, '+CLAUSES.lambda,
   [{fn:'voltageDropPercent',args:[{b:1,length:20,current:ib3,section:4,cosPhi:0.85}],expect:du3},sc({circuit:'c1',set:{phase:'3P',load:11000,rating:20,cable:'5 × 4 mm²'},routeCable:'5 × 4 mm²',sizing:{cosPhi:0.85,length:20}},{drop:du3,ib:ib3})]),
  rule('K-DUOSSZ','Összesített feszültségesés és határ',
   'ΔU,össz = ΔU,elosztó előtt + Σ ΔU,szakasz ≤ ΔU,határ, ahol a határ a táplálás (közcélú hálózat / saját táppont) és a felhasználás (világítás / egyéb) szerinti érték (T-DU). Megadott terhelésnél a túllépés „Nem felel meg”, becsültnél „Figyelmeztetés”.',
   'A határ a berendezés kezdőpontjától értendő; a fővezeték esését a felhasználó az elosztó beállításainál adhatja meg (0–10%), alapértéke 0% (D-ALAP-TAP).',
   `ΔU = ${pct(du1)} (K-DU1), elosztó előtt 1,5%: ${pct(du1up)} ${rel(du1up,lim.public.other)} ${pct(lim.public.other)} (közcélú, egyéb) → ${verdict(le(du1up,lim.public.other))}; világítási áramkörnél: ${pct(du1up)} ${rel(du1up,lim.public.lighting)} ${pct(lim.public.lighting)} → ${verdict(le(du1up,lim.public.lighting))}.`,
   SOURCES.voltageDrop.standard+' 525, '+CLAUSES.dropLimit,
   [sc({circuit:'c1',set:{load:3680},board:{upstreamDrop:1.5}},{dropTotal:du1up,dropLimit:lim.public.other,'check:voltage-drop':le(du1up,lim.public.other)?'ok':'fail'}),
    sc({circuit:'c1',set:{load:3680},board:{upstreamDrop:1.5},sizing:{usage:'lighting'}},{dropLimit:lim.public.lighting,'check:voltage-drop':le(du1up,lim.public.lighting)?'ok':'fail'}),
    sc({circuit:'c1',board:{upstreamDrop:1.5},sizing:{usage:'lighting'}},{'check:voltage-drop':le(du1up,lim.public.lighting)?'ok':'warn'})]),
  rule('K-LMAX','Megengedhető legnagyobb hossz (javaslat)',
   'Túllépésnél javaslat: L,max = (ΔU,határ − ΔU,elosztó előtt) / 100 · U0 / (b · I · (ρ1 · cos φ / A + λ · sin φ)), 0,1 m-re lefelé kerekítve; vegyes keresztmetszetnél a legkisebbel.',
   'A K-DU1/K-DU3 képlet átrendezése; a lefelé kerekítés és a legkisebb keresztmetszet a kedvezőtlen irány.',
   `Világítás, határ ${pct(lim.public.lighting)}, elosztó előtt 0%, I = 10 A, A = 1,5 mm², cos φ = 1: L,max = ${hu(lim.public.lighting/100)} · ${exact(T.u0)} / (2 · 10 · ${exact(T.rho1)} / 1,5) = ${hu(lmax(lim.public.lighting),1)} m; elosztó előtt 1%: (${exact(lim.public.lighting)} − 1) / 100 · ${exact(T.u0)} / (2 · 10 · ${exact(T.rho1)} / 1,5) = ${hu(lmax(lim.public.lighting-1),3)} → ${hu(Math.floor(lmax(lim.public.lighting-1)*10)/10,1)} m.`,
   SOURCES.voltageDrop.standard+' '+CLAUSES.lambda,
   [{fn:'maxLengthForDrop',args:[lim.public.lighting,2,10,1.5,1],expect:lmax(lim.public.lighting)},sc({circuit:'c3',sizing:{length:60},board:{upstreamDrop:1}},{'check:voltage-drop':'warn','detail:voltage-drop':`legfeljebb kb. ${hu(Math.floor(lmax(lim.public.lighting-1)*10)/10,1)} m`})]),
  rule('K-ZS','Hurokimpedancia (TN-rendszer)',
   'Ha az elosztónál a Zs meg van adva (0,01–20 Ω) és a rendszer TN: Zs = Zs,elosztó + ρ1 · L · (1/A + 1/A_PE) ≤ Zs,max = cmin · U0 / (m · In), ahol m a jelleggörbe szerinti pillanatkioldási szorzó (T-K-M-B, T-K-M-C, T-K-M-D), A_PE = A (D-PE).',
   `${lp} ${CLAUSES.cmin} (F-LOOP): Zs · Ia ≤ U0, ahol Ia = m · In a pillanatkioldás felső határa (így a kikapcsolási idő teljesül). A program képlete a jobb oldalt a cmin tényezővel szorozza (Zs · m · In ≤ cmin · U0; T-K-CMIN = ${exact(T.cmin)})${T.cmin===1?'; 1-gyel ez a fenti alakkal azonos':''}. A vezeték ellenállását ugyanazzal a ρ1-gyel számolja, mint a feszültségesést (T-K-RHO1, a G.52.2 szerinti üzemi hőmérsékleti érték), reaktancia és zárlati melegedés szerinti korrekció nélkül. Zs nélkül vagy TT-rendszerben az ellenőrzés „Nem vizsgált”.`,
   `Mintaterv „Nappali dugaljak” (c1): Zs,elosztó = 0,35 Ω, L = ${hu(MT.c1.length)} m, A = 2,5 mm²: Zs = 0,35 + ${exact(T.rho1)} · ${hu(MT.c1.length)} · (1/2,5 + 1/2,5) = 0,35 + ${hu(r234,4)} = ${hu(zs,4)} Ω. B16: Zs,max = ${exact(T.cmin)} · ${exact(T.u0)} / (${exact(T.instantaneous.B)} · 16) = ${hu(zB16,4)} Ω → ${verdict(le(zs,zB16))}; C16: ${hu(zC16,4)} Ω → ${verdict(le(zs,zC16))}.`,
   `${lp} ${CLAUSES.cmin}; ${SOURCES.mcb.standard}`,
   [{fn:'loopResistance',args:[MT.c1.length,2.5],expect:r234},{fn:'maxLoopImpedance',args:['B',16],expect:zB16},{fn:'maxLoopImpedance',args:['C',16],expect:zC16},
    sc({circuit:'c1',board:{zs:0.35}},{zs,zsMax:zB16,'check:loop':le(zs,zB16)?'ok':'fail'}),sc({circuit:'c1'},{'check:loop':'skipped'}),...schema('board','zs',[0.01,20],[0.005,20.5])],
   `1) A hatályos MSZ HD 60364-4-41 kiadás szerint a feltétel Zs · Ia ≤ U0 · Cmin, Cmin = 0,95? Ha igen: T-K-CMIN ✗, helyes érték 0,95, és az F-LOOP kiadása is javítandó. 2) Elfogadható-e a hurokellenálláshoz a feszültségeséshez megadott G.52.2 szerinti ρ1 (T-K-RHO1), zárlati melegedés szerinti korrekció nélkül? Ha nem, kérjük a helyes értéket vagy módszert megadni.`),
 ];
 const DA:RuleItem[]=[
  rule('D-ALAP-MOD','Alapérték: szerelési mód B2',
   'Ha sem az áramkörnél, sem a projektben nincs megadva, a szerelési mód B2 – falon belüli és falon kívüli nyomvonalon, valamint nyomvonal nélküli áramkörnél egyaránt. Falon belüli nyomvonalnál ez kiemelt (nem a biztonság javára közelítő) feltételezésként jelenik meg. Elsőbbség: áramköri érték (minden szakaszra) → projekt-alapérték (falon belüli / falon kívüli nyomvonalra külön) → B2.',
   'Lakóépületben a falban, védőcsőben vezetett többeres kábel a jellemző; hőszigetelt falban (A1, A2) kisebb a terhelhetőség, ezért a feltételezés kiemelt.',
   `2,5 mm², 2 terhelt ér: B2 → Iz0 = ${exact(izA)} A; A1 → ${exact(iz0(2,'A1',2.5))} A; A2 → ${exact(iz0(2,'A2',2.5))} A. B16-tal: 16 ${rel(16,izA)} ${exact(izA)} (B2), 16 ${rel(16,iz0(2,'A2',2.5))} ${exact(iz0(2,'A2',2.5))} (A2).`,
   src('methods'),
   [sc({circuit:'c1'},{'governing.method.value':'B2','governing.method.source':'alapérték',iz:izA,assumesStrong:'Szerelési mód: B2'}),
    sc({circuit:'c3'},{'governing.method.value':'B2','governing.method.source':'alapérték',assumes:'falon kívüli nyomvonal'}),
    sc({circuit:'c1',plan:{methodInside:'A2'}},{'governing.method.source':'projekt',iz:iz0(2,'A2',2.5)}),
    sc({circuit:'c1',plan:{methodInside:'A2'},sizing:{method:'C'}},{'governing.method.source':'megadott',iz:iz0(2,'C',2.5)})]),
  rule('D-ALAP-SZIG','Alapérték: PVC szigetelés (70 °C)',
   'Elsőbbség: áramkörnél megadott → a kábeljelölésből felismert (D-JEL) → projekt-alapérték → PVC, 70 °C. A PVC alapérték kiemelt feltételezés.',
   'A PVC 70 °C a lakásban jellemző. A 60 °C-os (gumiszigetelésű) vezeték terhelhetősége kisebb; ezt a program nem számolja (D-BLOKK).',
   '„NYM-J 3x2,5” → PVC; „N2XH 3×4” → XLPE (D-XLPE szerint PVC-értékkel); „3 × 2,5 mm²” → nem ismerhető fel → PVC (alapérték, kiemelt feltételezés).',
   src('pvc2'),
   [pvcOk('NYM-J 3x2,5',2.5,'PVC'),pvcOk('N2XH 3×4',4,'XLPE'),pvcOk('3 × 2,5 mm²',2.5,null),
    sc({circuit:'c1'},{'governing.insulation.value':'PVC','governing.insulation.source':'alapérték',assumesStrong:'Szigetelés: PVC'}),
    sc({circuit:'c1',plan:{insulation:'XLPE'}},{'governing.insulation.value':'XLPE','governing.insulation.source':'projekt'}),
    sc({circuit:'c1',set:{cable:'NYM-J 3x2,5'},routeCable:'NYM-J 3x2,5',plan:{insulation:'XLPE'}},{'governing.insulation.value':'PVC','governing.insulation.source':'kábeljelölés'})]),
  rule('D-ALAP-TEMP','Alapérték: környezeti hőmérséklet 30 °C',
   'Ha nincs megadva, 30 °C (kθ = 1), kiemelt feltételezésként. Megadható 10–60 °C között, egész fokban; áramkörönként egy érték, minden szakaszra (D-SZAKASZ).',
   '30 °C a táblázatok referencia-hőmérséklete; melegebb környezetben (padlás, kazánház) kisebb a terhelhetőség.',
   `30 °C → kθ = ${exact(kTemp(30).value)}; 40 °C → kθ = ${exact(kt40.value)}: B2, 2,5 mm²: Iz = ${exact(izA)} · ${exact(kt40.value)} = ${hu(izA*kt40.value,2)} A.`,
   src('ambient'),
   [{fn:'temperatureFactor',args:['PVC',40],expect:kt40.value},sc({circuit:'c1'},{'ambient.source':'alapérték',kTemp:kTemp(30).value,assumesStrong:'Környezeti hőmérséklet: 30 °C'}),sc({circuit:'c1',sizing:{ambient:40}},{iz:izA*kt40.value}),
    ...schema('circuit','ambient',[10,60],[9,61,30.5])]),
  rule('D-ALAP-CSOP','Alapérték: 1 áramkör (nincs csoportosítás)',
   'Ha nincs megadva, az együtt vezetett terhelt áramkörök száma 1 (kcs = 1), kiemelt feltételezésként. Megadható 1–20 között, egész számként; áramkörönként egy érték, minden szakaszra (D-SZAKASZ). Csak a táblázat 1. sora (kötegelve, felületen, beágyazva vagy zártan) használható; más elrendezést (egy rétegben falon, kábeltálcán) a program nem kínál.',
   'Az 1. sor a lakóépületben jellemző, legkedvezőtlenebb elrendezés; más elrendezéshez kedvezőbb tényező tartozna, így ez a biztonság javára téved. Az 1 áramkör alapérték viszont nem a biztonság javára közelít, ezért kiemelt.',
   `4 áramkör közös védőcsőben: kcs = ${exact(kc4.value)}; B2, 2,5 mm²: Iz = ${exact(izA)} · ${exact(kc4.value)} = ${hu(izA*kc4.value,2)} A ${ge(izA*kc4.value,16)} 16 A (B16) → ${verdict(le(16,izA*kc4.value))}.`,
   src('grouping'),
   [{fn:'groupingFactor',args:[4],expect:kc4.value},sc({circuit:'c1'},{'grouped.source':'alapérték',kGroup:1,assumesStrong:'Együtt vezetett áramkörök: 1'}),sc({circuit:'c1',sizing:{grouped:4}},{iz:izA*kc4.value,'check:overload':le(16,izA*kc4.value)?'ok':'fail'}),
    ...schema('circuit','grouped',[1,20],[0,21,2.5])]),
  rule('D-ALAP-COS','Alapérték: cos φ = 1',
   'Megadott terhelésnél a cos φ alapértéke 1, kiemelt feltételezésként; megadható 0,5–1 között. Becsült terhelésnél is 1.',
   'Ohmos terhelésnél pontos; induktív terhelésnél nagyobb a valós áram, és a λ-tag miatt a feszültségesés is.',
   `P = 2300 W: cos φ = 1 → Ib = ${hu(designI(2300,1,1),2)} A; cos φ = 0,8 → Ib = 2300 / (${exact(T.u0)} · 0,8) = ${hu(designI(2300,1,0.8),2)} A.`,
   ov+' '+CLAUSES.overload+' (1)',
   [{fn:'designCurrent',args:[2300,'L1',0.8],expect:designI(2300,1,0.8)},sc({circuit:'c1',set:{load:2300}},{ib:designI(2300,1,1),assumesStrong:'cos φ = 1'}),sc({circuit:'c1',set:{load:2300},sizing:{cosPhi:0.8}},{ib:designI(2300,1,0.8)}),
    ...schema('circuit','cosPhi',[0.5,1],[0.49,1.01])]),
  rule('D-ALAP-FELH','Alapérték: felhasználás (világítás / egyéb)',
   'A feszültségesés-határhoz: ha az áramkörhöz lámpakiállás tartozik → világítás, különben egyéb (kiemelt feltételezés). Az áramkörnél felülírható.',
   'Lámpát is tartalmazó áramkörre a szigorúbb világítási határ vonatkozik; lámpa nélküli áramkörnél az „egyéb” az enyhébb határ, ezért kiemelt.',
   `Közcélú hálózat: dugaljáramkör → ${pct(lim.public.other)} (T-DU-KOZ-EGY); lámpakiállást is tartalmazó áramkör → ${pct(lim.public.lighting)} (T-DU-KOZ-VIL).`,
   SOURCES.voltageDrop.standard+' '+CLAUSES.dropLimit,
   [sc({circuit:'c1'},{'usage.value':'other','usage.source':'alapérték',dropLimit:lim.public.other,assumesStrong:'Felhasználás: egyéb fogyasztó'}),sc({circuit:'c3'},{'usage.value':'lighting','usage.source':'automatikus',dropLimit:lim.public.lighting}),
    sc({circuit:'c1',sizing:{usage:'lighting'}},{'usage.source':'megadott',dropLimit:lim.public.lighting})]),
  rule('D-ALAP-TAP','Alapérték: közcélú táplálás, TN, 0% elosztó előtti esés',
   'Táplálás: közcélú kisfeszültségű hálózat; földelési rendszer: TN; az elosztó előtti (fővezeték) feszültségesés 0% (kiemelt feltételezés), megadható 0–10% között.',
   'Lakóépületnél a közcélú hálózatról táplálás a jellemző. A fővezeték esése a tervből nem számolható; 0%-kal a teljes keret az áramkörre jut, ami nem a biztonság javára közelít.',
   `Saját táppont választásakor a határ ${pct(lim.private.lighting)} (világítás) / ${pct(lim.private.other)} (egyéb); 1,5% elosztó előtti eséssel egy ${pct(lim.public.other)}-os keretből ${pct(lim.public.other-1.5)} marad az áramkörre.`,
   SOURCES.voltageDrop.standard+' '+CLAUSES.dropLimit+'; '+lp+' '+CLAUSES.cmin,
   [sc({circuit:'c1'},{dropLimit:lim.public.other,'upstreamDrop.source':'alapérték',assumesStrong:'elosztó előtti (fővezeték) feszültségesés nincs megadva',assumes:'Táplálás: közcélú'}),
    sc({circuit:'c1',plan:{supply:'private'}},{dropLimit:lim.private.other}),sc({circuit:'c1',board:{zs:0.35}},{assumes:'Földelési rendszer: TN'}),sc({circuit:'c1',plan:{earthing:'TT'},board:{zs:0.35}},{'check:loop':'skipped'}),
    ...schema('board','upstreamDrop',[0,10],[-0.1,10.1])]),
 ];
 const JEL:ValueItem[]=[
  value('D-JEL-AL','Al, alu, alumínium, aluminium, NAYY…, NA2X…, AYKY…, AMKA','alumínium → „Nem számítható” (D-BLOKK)',[],
   [...['Al 4x16','alu 3x2,5','alumínium 4x16','aluminium 4x16','NAYY 4x16','NA2XY 4x16','AYKY 4x10','AMKA 4x16'].map(t=>pc(t,{ok:false,code:'aluminium'})),pvcOk('alá 3x2,5',2.5,null)]),
  value('D-JEL-GUMI','H03R…, H05R…, H07R… (RN, RR, RT), GT, gumi… (szó elején, ékezetes folytatással is: gumis, gumikábel, gumiszigetelésű, Gumi-kábel)','gumiszigetelés (60 °C) → „Nem számítható” (D-BLOKK)',[],
   [...['H07RN-F 3G2,5','H05RR-F 3G1,5','H07RT 3x2,5','GT 3x2,5','gumi 3x2,5','GUMI 3x2,5','gumis 3x2,5','gumikábel 3x2,5','gumiszigetelésű 3x2,5','Gumi kábel 3x2,5','gumikabel 3x2,5','Gumi-kábel 3x2,5'].map(t=>pc(t,{ok:false,code:'rubber'})),pvcOk('ragumi 3x2,5',2.5,null)]),
  value('D-JEL-XLPE','N2X…, 2XY, XLPE, EPR','XLPE (90 °C; D-XLPE szerint PVC-értékkel)',[],
   [pvcOk('N2XH 3×4',4,'XLPE'),pvcOk('N2XY 3x2,5',2.5,'XLPE'),pvcOk('2XY 3x2,5',2.5,'XLPE'),pvcOk('XLPE 3x2,5',2.5,'XLPE'),pvcOk('EPR 3x2,5',2.5,'XLPE')]),
  value('D-JEL-PVC','NYM…, NYY…, NYCWY, MBCu, MCu, MKCu, MT, MYY, YKY…, CYKY…, H03V…, H05V…, H07V…, PVC','PVC (70 °C)',[],
   [pvcOk('NYM-J 3x2,5',2.5,'PVC'),pvcOk('NYY-J 3x2,5',2.5,'PVC'),pvcOk('NYCWY 4x10',10,'PVC'),pvcOk('MBCu 3x2,5',2.5,'PVC'),pvcOk('MCu 2,5',2.5,'PVC'),pvcOk('MKCu 2,5',2.5,'PVC'),pvcOk('MT 3x1,5',1.5,'PVC'),pvcOk('MYY 3x2,5',2.5,'PVC'),pvcOk('YKY 3x2,5',2.5,'PVC'),pvcOk('CYKY 3x2,5',2.5,'PVC'),pvcOk('H03VV-F 3x0,75',0.75,'PVC'),pvcOk('H05VV-F 3x1,5',1.5,'PVC'),pvcOk('H07V-U 2,5 mm²',2.5,'PVC'),pvcOk('PVC 3x2,5',2.5,'PVC')]),
  value('D-JEL-NINCS','Más vagy hiányzó jelölés (pl. NHXH, „3 × 2,5 mm²”)','nem ismerhető fel → áramköri, majd projekt-alapérték, végül PVC (D-ALAP-SZIG)',[],
   [pvcOk('NHXH-J 3x1,5',1.5,null),pvcOk('3 × 2,5 mm²',2.5,null)]),
  value('D-JEL-SORREND','Több kulcsszó egy jelölésben','az első egyező: alumínium, gumi, XLPE, PVC',[],
   [pc('Al/PVC 4x16',{ok:false,code:'aluminium'}),pc('gumi/PVC 3x2,5',{ok:false,code:'rubber'}),pvcOk('XLPE/PVC 3x2,5',2.5,'XLPE')]),
 ];
 const D:RuleItem[]=[
  rule('D-KEREK','Lépcsőre kerekítés iránya',
   'Táblázati lépcsők közötti bemenetnél a program a kedvezőtlenebb lépcsőt választja, interpoláció nélkül: környezeti hőmérséklet → a következő nagyobb vagy egyenlő lépcső (T-KT), áramkörszám → a következő nagyobb vagy egyenlő oszlop (T-KCS). A számított értékeket (Ib, Iz, ΔU, Zs) nem kerekíti; a kijelzés 2, Zs-nél 3 tizedes.',
   'A nagyobb hőmérséklethez és áramkörszámhoz kisebb tényező tartozik, így a kerekítés a biztonság javára téved. A bemenet korlátai (10–60 °C, 1–20 áramkör) miatt a táblázat széle nem léphető túl.',
   `33 °C → ${kt33.step} °C → kθ = ${exact(kt33.value)}; 10 áramkör → ${kc10.step} → kcs = ${exact(kc10.value)}.`,
   src('ambient')+'; '+src('grouping'),
   [{fn:'temperatureFactor',args:['PVC',33],expect:kt33.value},{fn:'groupingFactor',args:[10],expect:kc10.value},sc({circuit:'c1',sizing:{ambient:33,grouped:10}},{kTemp:kt33.value,kGroup:kc10.value})]),
  rule('D-XLPE','XLPE: PVC-tartalék és a 30 °C alatti korlát',
   'Amíg az XLPE-táblázat nincs rögzítve (T-XLPE), XLPE kábelnél a program a PVC Iz0-val és a PVC kθ-sorral számol, de 30 °C alatt a kθ-t 1-re korlátozza; erről feltételezés-sor jelenik meg. Projekt-felülírt XLPE Iz0 mellett is ez a korlátozott kθ érvényes (D-FELULIR).',
   'A PVC Iz0 kisebb az XLPE-énél, és 30 °C felett a PVC kθ is kisebb – ez a biztonság javára téved. 30 °C alatt viszont a PVC kθ nagyobb lenne az XLPE-énél, ezért ott 1-gyel számol. Ha az XLPE-sorokat kitöltik, a korlátozás magától megszűnik.',
   `XLPE, 25 °C: a PVC-sor ${exact(kt25.value)} értéke helyett kθ = 1; XLPE, 40 °C: kθ = ${exact(kt40.value)} (PVC-sor). XLPE, B2, 2,5 mm², 2 terhelt ér: Iz0 = ${exact(izA)} A (PVC-érték).`,
   src('xlpe2')+'; '+src('ambient'),
   [{fn:'temperatureFactor',args:['XLPE',25],expect:T.ambient.XLPE?step(T.ambient.steps,T.ambient.XLPE,25).value:Math.min(1,kt25.value)},{fn:'temperatureFactor',args:['XLPE',40],expect:T.ambient.XLPE?step(T.ambient.steps,T.ambient.XLPE,40).value:kt40.value},
    ...(T.ampacity.XLPE?[]:[sc({circuit:'c1',set:{cable:'N2XH 3x2,5'},routeCable:'N2XH 3x2,5',sizing:{ambient:25}},{'governing.iz0':izA,kTemp:Math.min(1,kt25.value),assumes:'XLPE-szigetelés: a programban nincs rögzített XLPE-táblázat'})])]),
  rule('D-BLOKK','Nem kezelt kábelek; helyettesítés a másik forrás kábelével',
   `A program csak rézvezetős, PVC- vagy XLPE-szigetelésű, azonos keresztmetszetű erekből álló kábelt számol, ${exact(T.sections[0])}–${exact(T.sections[T.sections.length-1])} mm² között. Szakaszonként a nyomvonal kábeljelölése érvényes; ha az nem értelmezhető vagy üres, az áramköré (és fordítva). Nem helyettesít, hanem „Nem számítható” lesz, ha bármelyik forrás (áramkör vagy nyomvonal) kábele alumínium (D-JEL-AL), gumiszigetelésű (D-JEL-GUMI), csökkentett N/PE-erű (pl. 3x25+16, 3x2,5/1,5) vagy ${exact(T.sections[T.sections.length-1])} mm² feletti keresztmetszetű. Más értelmezhetetlen jelölésnél – nem szabványos keresztmetszet (pl. 3 mm²), ellentmondó vagy keresztmetszet nélküli jelölés – a program a másik forrás értelmezhető kábelével számol, „Figyelmeztetés” mellett; ha egyik forrás sem értelmezhető, „Nem számítható”. Üres nyomvonal-jelölésnél figyelmeztetés nélkül az áramkör kábelével számol. A 0,5–1 mm² értelmezhető, de a legkisebb keresztmetszet ellenőrzésén elbukik (D-MINKM).`,
   'A táblázatok csak rézre, 70 °C-os (PVC) vezetőre és a fenti tartományra érvényesek; csökkentett PE-nél a hurokszámítás A_PE = A feltételezése (D-PE) nem állna meg. Ilyen kábelnél a másik forrás (réz) kábelével számolni más vezetőről szólna, ezért a program megáll. Elírásnak tekinthető jelölésnél (pl. 3 mm²) a másik forrás adata a valószínű, de a figyelmeztetés ellenőrzést kér.',
   `„NAYY 4x16” → alumínium; „H07RN-F 3G2,5” → gumiszigetelés; „3 × 2,5 + 1 × 1,5” → csökkentett ér; „3 × 50 mm²” → túl nagy keresztmetszet: mind „Nem számítható”. Mintaterv „Nappali dugaljak” (c1, 3 × 2,5 mm²): ha a nyomvonalé „3 × 3 mm²” (nem szabványos), a program az áramkör kábelével számol (Iz = ${exact(izA)} A, „Figyelmeztetés”); ha mindkettő „3 × 3 mm²”, „Nem számítható”; ha a nyomvonalé „NAYY 3x2,5”, „Nem számítható”.`,
   src('pvc2')+'; '+src('minSection'),
   [pc('NAYY 4x16',{ok:false,code:'aluminium'}),pc('H07RN-F 3G2,5',{ok:false,code:'rubber'}),pc('3 × 2,5 + 1 × 1,5',{ok:false,code:'reduced'}),pc('3 × 50 mm²',{ok:false,code:'large'}),pc('3 × 3 mm²',{ok:false,code:'nonstandard'}),pvcOk('2 × 0,75',0.75,null),
    sc({circuit:'c1',routeCable:'3 × 3 mm²'},{status:'warn','check:cable':'warn',iz:izA,'detail:cable':'az áramkör kábelével számoltunk'}),
    sc({circuit:'c1',set:{cable:'3 × 3 mm²'}},{status:'warn','check:cable':'warn',iz:izA,'detail:cable':'A nyomvonalak kábelével számoltunk'}),
    sc({circuit:'c1',set:{cable:'3 × 3 mm²'},routeCable:'3 × 3 mm²'},{status:'na','check:cable':'na',iz:null}),
    sc({circuit:'c1',routeCable:'Cat6'},{status:'warn',iz:izA}),
    sc({circuit:'c1',routeCable:''},{'check:cable':'ok',iz:izA}),
    sc({circuit:'c1',routeCable:'NAYY 3x2,5'},{status:'na','check:cable':'na',iz:null}),
    sc({circuit:'c1',set:{cable:'NAYY 3x2,5'}},{status:'na','check:cable':'na',iz:null}),
    sc({circuit:'c1',routeCable:'H07RN-F 3G2,5'},{status:'na',iz:null}),
    sc({circuit:'c1',set:{cable:'3 × 2,5 + 1 × 1,5'}},{status:'na',iz:null}),
    sc({circuit:'c1',routeCable:'3 × 50 mm²'},{status:'na',iz:null})]),
  rule('D-MINKM','Legkisebb keresztmetszet minden áramkörre',
   `Minden áramkörre (erősáramú és világítási) a legkisebb rézkeresztmetszet ${exact(T.minSection)} mm² (T-K-AMIN); kisebbnél „Nem felel meg”. Jelző- és vezérlőáramkört a program nem különböztet meg.`,
   'A tervező áramkörei erősáramú és világítási áramkörök; a jelzőáramkörökre vonatkozó kisebb érték itt nem alkalmazható.',
   `„2 × 0,75” → A = 0,75 mm² < ${exact(T.minSection)} mm² → nem felel meg; „3 × 1,5” → ${verdict(le(T.minSection,1.5))}.`,
   src('minSection'),
   [{fn:'atMost',args:[T.minSection,1.5],expect:le(T.minSection,1.5)},{fn:'atMost',args:[T.minSection,0.75],expect:le(T.minSection,0.75)},
    sc({circuit:'c1',set:{cable:'2 × 0,75'},routeCable:'2 × 0,75'},{'check:section':le(T.minSection,0.75)?'ok':'fail'}),sc({circuit:'c1',set:{cable:'3 × 1,5'},routeCable:'3 × 1,5'},{'check:section':le(T.minSection,1.5)?'ok':'fail'})]),
  rule('D-SZAKASZ','Több nyomvonalszakasz',
   'Az áramkörhöz rendelt nyomvonalak szakaszonként számítanak: kábel = a nyomvonal értelmezhető kábeljelölése, különben az áramköré (D-BLOKK); Iz = a szakaszok legkisebb Iz-je (mértékadó szakasz); ΔU és Zs = a szakaszok összege a saját keresztmetszetükkel. Ha a mértékadó hossz meg van adva, az egész hosszt a legkisebb keresztmetszettel számolja. A környezeti hőmérséklet és a csoportszám áramkörönként egyetlen érték, és minden szakaszra érvényes (a kθ szakaszonként csak a szigetelés miatt térhet el, D-XLPE); a szerelési mód szakaszonként a nyomvonal falon belüli / falon kívüli jellege szerinti projekt-alapérték, áramköri megadásnál minden szakaszra ugyanaz.',
   'A soros szakaszok esései összeadódnak, a terhelhetőséget a leggyengébb szakasz korlátozza. Megadott hossznál a szakaszok aránya nem ismert, ezért a legkisebb keresztmetszet a kedvezőtlen eset. A szakaszonként eltérő környezetet (pl. egy rövid padlásszakasz) a program nem kezeli: ilyenkor az egész áramkörre a kedvezőtlenebb hőmérsékletet és csoportszámot kell megadni.',
   `10 m 2,5 mm² + 5 m 1,5 mm², I = 10 A, cos φ = 1: ΔU = 2 · 10 · 10 · ${exact(T.rho1)} / 2,5 / ${exact(T.u0)} · 100 + 2 · 5 · 10 · ${exact(T.rho1)} / 1,5 / ${exact(T.u0)} · 100 = ${pct(segA)} + ${pct(segB)} = ${pct(segA+segB)}; megadott 15 m hossznál: 2 · 15 · 10 · ${exact(T.rho1)} / 1,5 / ${exact(T.u0)} · 100 = ${pct(segO)}.`,
   SOURCES.voltageDrop.standard+' '+CLAUSES.lambda,
   [{fn:'voltageDropPercent',args:[{b:2,length:10,current:10,section:2.5,cosPhi:1}],expect:segA},{fn:'voltageDropPercent',args:[{b:2,length:5,current:10,section:1.5,cosPhi:1}],expect:segB},{fn:'voltageDropPercent',args:[{b:2,length:15,current:10,section:1.5,cosPhi:1}],expect:segO},
    sc({circuit:'c1',extraRoute:'3 × 1,5 mm²'},{iz:iz15,drop:seg2[0]+seg2[1],'governing.cable.section':1.5}),
    sc({circuit:'c1',extraRoute:'3 × 1,5 mm²',sizing:{length:15}},{drop:drop(2,15,16,1.5,1)}),
    sc({circuit:'c1',extraRoute:'3 × 1,5 mm²',sizing:{ambient:35}},{iz:iz15*kt35.value,kTemp:kt35.value})]),
  rule('D-FELULIR','Projekt-felülírás (saját Iz0)',
   'A projektben szerelési mód, szigetelés, terhelt érszám és keresztmetszet szerint saját Iz0 adható meg (pl. gyártói adat), 1–1000 A között, kötelező, legalább 3 karakteres forrásmegjegyzéssel. Ha van ilyen, a program a táblázati érték helyett ezt használja (elsőbbség: felülírás → táblázat), és a kθ és a kcs erre is rászorzódik: Iz = Iz0,felülírt · kθ · kcs. A számítási sorban „projekt-felülírás” állapotú forrásként jelenik meg a megjegyzéssel. A keresztmetszet-javaslat (K-JAV) is a felülírt értékkel számol. XLPE felülírásnál a kθ a D-XLPE szerinti korlátozott PVC-sor.',
   'A felülírt érték a tervező döntése és felelőssége; a program nem vizsgálja, milyen körülményekre vonatkozik. Ha a gyártói érték már tartalmaz környezeti vagy csoportosítási csökkentést, a kθ és a kcs ismételt alkalmazása a biztonság javára téved (kisebb Iz). Kérjük megítélni, hogy ez a viselkedés és a jelölés elfogadható-e.',
   `B2, PVC, 2 terhelt ér, 2,5 mm² felülírva ${exact(ovr.iz)} A-re („${ovr.note}”), 40 °C, 3 áramkör: Iz = ${exact(ovr.iz)} · ${exact(kt40.value)} · ${exact(kc3.value)} = ${hu(izOvr,3)} A (táblázattal: ${exact(izA)} · ${exact(kt40.value)} · ${exact(kc3.value)} = ${hu(izNoOvr,3)} A). B16-hoz a keresztmetszet-javaslat felülírással ${minOvr===null?'nincs':exact(minOvr)+' mm²'}, nélküle ${minNoOvr===null?'nincs':exact(minNoOvr)+' mm²'}.`,
   'Programozott döntés; a felülírás forrása a tervező által megadott adat',
   [{fn:'correctedIz',args:[ovr.iz,kt40.value,kc3.value],expect:izOvr},{fn:'minSectionFor',args:[16,'B2','PVC',2,kt40.value,kc3.value,[ovr]],expect:minOvr},{fn:'minSectionFor',args:[16,'B2','PVC',2,kt40.value,kc3.value],expect:minNoOvr},
    sc({circuit:'c1',plan:{overrides:[ovr]},sizing:{ambient:40,grouped:3}},{iz:izOvr,'ref:Iz0':'projekt-felülírás','check:overload':le(16,izOvr)?'ok':'fail'}),
    sc({circuit:'c1',sizing:{ambient:40,grouped:3}},{iz:izNoOvr,'check:overload':le(16,izNoOvr)?'ok':'fail'}),
    ...schema('override','iz',[1,1000],[0.9,1001]),...schema('override','note',['abc'],['ab','  ab  '])]),
  rule('D-HOSSZ','Mértékadó hossz',
   'A mértékadó hossz az áramkörhöz rendelt alaprajzi nyomvonalak soros összege (vízszintes hossz + a két végpont fel-/leállása, ráhagyás nélkül), vagy a felhasználó által megadott hossz (0,1–1000 m). Ha egyik nyomvonal sem csatlakozik az elosztó jeléhez, vagy az áramkör több szinten fut: „Figyelmeztetés”; nyomvonal és megadott hossz nélkül „Nem számítható”.',
   'A feszültségesés és a hurokimpedancia a hosszal arányos; elágazó nyomvonalnál a soros összeg felülbecsül (a biztonság javára), a hiányos hosszra figyelmeztet.',
   `Mintaterv „Nappali dugaljak” (c1): vízszintes 20 m, fel-/leállás (2,6 − 1,5) + (2,6 − 0,3) = 3,4 m → L = ${hu(MT.c1.length)} m.`,
   SOURCES.voltageDrop.standard+' 525',
   [sc({circuit:'c1'},{length:MT.c1.length,lengthSource:'nyomvonalak','check:length':'ok'}),sc({circuit:'c3'},{length:MT.c3.length,'check:length':'warn'}),sc({circuit:'c2'},{length:null,'check:length':'na'}),
    sc({circuit:'c2',sizing:{length:12}},{length:12,lengthSource:'megadott'}),...schema('circuit','length',[0.1,1000],[0.09,1000.5])]),
  rule('D-BECSULT','Becsült terhelés',
   `Ha az áramkörnél nincs megadott terhelés, a program a hozzárendelt szerelvényekből becsül (${est}). Ilyenkor Ib > In csak „Figyelmeztetés”; a feszültségesést max(In; Ib,becsült) árammal számolja; becsülhető szerelvény nélkül (0 W) az Ib ≤ In „Nem vizsgált”.`,
   'A becslés nem tervezői adat, ezért nem minősít „Nem felel meg”-nek; a feszültségesésnél az In a kedvezőtlen eset.',
   `Mintaterv „Nappali dugaljak” (c1: kettős dugalj + dugalj + kötődoboz, B16, terhelés nincs megadva): P ≈ ${MT.c1.watts} W, Ib ≈ ${MT.c1.watts} / ${exact(T.u0)} = ${hu(ibEst,2)} A; a feszültségeséshez I = max(16; ${hu(ibEst,2)}) = ${hu(Math.max(16,ibEst),2)} A.`,
   ov+' '+CLAUSES.overload+' (1)',
   [{fn:'designCurrent',args:[MT.c1.watts,'L1',1],expect:ibEst},sc({circuit:'c1'},{watts:MT.c1.watts,ib:ibEst,ibSource:'becsült',dropCurrent:Math.max(16,ibEst),dropCurrentSource:16>=ibEst?'In':'Ib'}),sc({circuit:'c1',noDevices:true},{'check:design-current':'skipped'})]),
  rule('D-PE','Hurokszámítás: A_PE = A, reaktancia nélkül',
   'A hurokszámításban a védővezető keresztmetszete azonos a fázisvezetőével (A_PE = A); a vezeték reaktanciáját a program elhanyagolja; a Zs,elosztó a felhasználó által megadott (mért vagy szolgáltatói) érték.',
   'Csökkentett PE-erű kábelt a program nem számol (D-BLOKK), így azonos keresztmetszetű kábelnél az A_PE = A pontos. A reaktancia elhanyagolását a lektor ítélje meg a kezelt (legfeljebb 35 mm²-es) tartományban.',
   `L = 10 m, A = 2,5 mm²: ${exact(T.rho1)} · 10 · (1/2,5 + 1/2,5) = ${hu(loopR(10,2.5),4)} Ω. (1,5 mm²-es PE-vel ${hu(loopR(10,2.5,1.5),4)} Ω lenne – ezért nem számolja a csökkentett PE-erű kábelt.)`,
   lp+' '+CLAUSES.cmin,
   [{fn:'loopResistance',args:[10,2.5],expect:loopR(10,2.5)},sc({circuit:'c1',board:{zs:0.35}},{assumes:'PE-keresztmetszet = fázisvezető-keresztmetszet'})]),
  rule('D-KESZ','Védelmi készülék: kismegszakító vagy RCBO',
   `A védelem az áramkörhöz rendelt kismegszakító (MCB) vagy túláramvédelemmel egybeépített áram-védőkapcsoló (RCBO) modul (a felületen „kombinált védelem (RCBO)”; a szabatos megnevezést az F-RCBO tételnél lehet javítani); ha nincs ilyen modul, ${SOURCES.mcb.standard} szerinti kismegszakítót feltételez (feltételezés-sor). RCBO-nál a forrás ${SOURCES.rcbo.standard}, az értékek (I2 = ${K2} · In; m = ${Object.values(T.instantaneous).map(exact).join(' / ')}) a kismegszakítóéval azonosak. Olvadóbiztosítót és állítható kioldót a program nem kezel.`,
   'Lakáselosztóban a végáramkörök védelme jellemzően kismegszakító vagy RCBO; a két termékszabvány a vizsgált jellemzőkben azonos.',
   `C16 RCBO: I2 = ${K2} · 16 = ${hu(k*16,2)} A; Zs,max = ${exact(T.cmin)} · ${exact(T.u0)} / (${exact(T.instantaneous.C)} · 16) = ${hu(zC16,4)} Ω (mint C16 kismegszakítónál).`,
   src('mcb')+'; '+src('rcbo'),
   [sc({circuit:'c1'},{device:'MCB',deviceAssumed:false}),sc({circuit:'c1',module:'RCBO',set:{curve:'C'},board:{zs:0.35}},{device:'RCBO','clause:i2':SOURCES.rcbo.standard,zsMax:zC16}),
    sc({circuit:'c1',module:null},{device:'MCB',deviceAssumed:true,assumes:'Nincs hozzárendelt kismegszakító-modul'})]),
  rule('D-AVK','Hurok-túllépés áram-védőkapcsolóval védett áramkörnél; TT-rendszer',
   'Ha Zs > Zs,max, és az áramkörhöz bármilyen áram-védőkapcsoló (ÁVK, FI-relé) hozzá van rendelve (az áramkör ÁVK-mezője nem üres), vagy a védelem RCBO, az eredmény „Figyelmeztetés”; egyébként „Nem felel meg”. Az ÁVK érzékenységét (IΔn) és típusát a program nem vizsgálja, és a 411.4.4 ÁVK-ra vonatkozó feltételét (Ia = az ÁVK kioldását okozó áram) sem számolja. TT-rendszerben a hurokellenőrzés nem készül („Nem vizsgált”).',
   `${lp} 411.3 / ${CLAUSES.cmin}: ÁVK-val a kikapcsolási feltétel más módon is teljesülhet; ennek igazolása a tervező feladata, ezért a program csak figyelmeztet. TT-rendszerben a földelési ellenállás a mértékadó, ezt a program nem vizsgálja.`,
   `Mintaterv c1, C16, Zs,elosztó = 1,2 Ω: Zs = 1,2 + ${hu(r234,4)} = ${hu(zsAvk,4)} Ω ${rel(zsAvk,zC16)} Zs,max = ${hu(zC16,4)} Ω → ÁVK nélkül nem felel meg; bármely hozzárendelt ÁVK-val vagy RCBO-val – érzékenységétől függetlenül – figyelmeztetés.`,
   lp+' '+CLAUSES.cmin,
   [sc({circuit:'c1',set:{curve:'C'},board:{zs:1.2}},{zs:zsAvk,'check:loop':le(zsAvk,zC16)?'ok':'warn'}),sc({circuit:'c1',set:{curve:'C',rcd:''},board:{zs:1.2}},{'check:loop':le(zsAvk,zC16)?'ok':'fail'}),
    sc({circuit:'c1',set:{curve:'C',rcd:'bármi'},board:{zs:1.2}},{'check:loop':le(zsAvk,zC16)?'ok':'warn'}),sc({circuit:'c1',set:{curve:'C',rcd:''},module:'RCBO',board:{zs:1.2}},{'check:loop':le(zsAvk,zC16)?'ok':'warn'})]),
  rule('D-EREK','Erek száma',
   'Egyfázisnál legalább 3 ér (L, N, PE), háromfázisnál 5 ér (L1, L2, L3, N, PE); kevesebb érnél „Figyelmeztetés” (N nélküli háromfázisú fogyasztónál 4 ér is elegendő lehet). Egyerű vezetékeknél (pl. MCu) nem ellenőrizhető („Nem vizsgált”).',
   'Az érszám a kábeljelölésből nem mindig egyértelmű, és N nélküli háromfázisú fogyasztó is lehet, ezért a program csak figyelmeztet.',
   'Egyfázis, „2 × 2,5”: 2 ér < 3 → figyelmeztetés; háromfázis, „4 × 4”: 4 ér < 5 → figyelmeztetés.',
   '– (programozott ellenőrzés, szabványpont nélkül)',
   [sc({circuit:'c1',set:{cable:'2 × 2,5'},routeCable:'2 × 2,5'},{'check:cores':'warn'}),sc({circuit:'c1',set:{phase:'3P',cable:'4 × 4'},routeCable:'4 × 4'},{'check:cores':'warn'}),
    sc({circuit:'c1',set:{phase:'3P',cable:'5 × 4'},routeCable:'5 × 4'},{'check:cores':'ok'}),sc({circuit:'c1',set:{cable:'MCu 2,5'},routeCable:'MCu 2,5'},{'check:cores':'skipped'})]),
  rule('D-TURES','Összehasonlítás tűréssel',
   'Határérték-összehasonlításnál a ≤ b akkor is teljesül, ha a ≤ b + 10⁻⁹ · max(1, |b|). Ha a kétjegyű kijelzés egyenlőséget mutatna, de a feltétel nem teljesül, a két oldal több tizedessel jelenik meg (pl. „63,001 > 63”).',
   'A lebegőpontos számábrázolás miatt a pontos egyenlőség is teljesüljön (90 · 0,7 a gépben 62,99999999999999); a tűrés a táblázatértékek pontosságánál nagyságrendekkel kisebb.',
   'Iz = 90 · 0,7 = 63 A, In = 63 A → teljesül (63 ≤ 63); In = 63,001 A → nem teljesül.',
   '– (programozott döntés)',
   [{fn:'atMost',args:[63,90*0.7],expect:true},{fn:'atMost',args:[63.001,63],expect:false}]),
  rule('D-ALLAPOT','Állapotok és az eredmény címkéje',
   `Ellenőrzésenként öt állapot: „${LABELS.checkOk}”, „${LABELS.warn}”, „${LABELS.fail}”, „${LABELS.na}”, „${LABELS.skipped}”. Az áramkör eredménye a vizsgált ellenőrzések legrosszabb állapota, ebben a sorrendben: ${LABELS.fail} > ${LABELS.na} > ${LABELS.warn} > ${LABELS.checkOk}; a „${LABELS.skipped}” ellenőrzés az eredményt nem rontja. Az eredmény címkéje: „${LABELS.ok}”, „${LABELS.warn}”, „${LABELS.fail}” vagy „${LABELS.na}”. A „${LABELS.ok}” címke kiegészül: „– feltételezésekkel”, ha bármely feltételezés-sor megjelenik (alapérték, D-ALAP; XLPE-tartalék, D-XLPE; feltételezett kismegszakító, D-KESZ; A_PE = A, D-PE; becsült terhelés, D-BECSULT); „nem vizsgált: …”, ha az Ib ≤ In (terhelés nélkül) vagy a hurokimpedancia (Zs nélkül vagy TT-rendszerben) nem készült. Más nem vizsgált ellenőrzést (pl. az érszámot egyerű vezetéknél) a címke nem említ.`,
   `A „megfelel” mellé mindig a „Számítás szerint” előtag kerül, a feltételezések és az el nem végzett ellenőrzések jelzésével, hogy a felhasználó ne olvassa teljes megfelelőségnek. A „${LABELS.skipped}” azért nem ront, mert hiányzó adat (pl. Zs) mellett a többi ellenőrzés eredménye érvényes marad. Kérjük megítélni, hogy ez a megfogalmazás – különösen az el nem végzett hurokellenőrzés melletti „${LABELS.ok}” – elfogadható-e.`,
   `Mintaterv „Nappali dugaljak” (c1; B16, 3 × 2,5 mm², ${hu(MT.c1.length)} m, terhelés és az elosztó Zs-e nincs megadva): a vizsgált ellenőrzések „${LABELS.checkOk}”, a hurokimpedancia „${LABELS.skipped}”, alapértékek érvényesek → „${LABELS.ok} – feltételezésekkel; nem vizsgált: hurokimpedancia”. Ha a kábel „2 × 0,75”: a legkisebb keresztmetszet „${LABELS.fail}”, az In ≤ Iz „${LABELS.na}” (0,75 mm² nincs a táblázatban) → „${LABELS.fail}”.`,
   '– (programozott döntés; a felületen és a PDF-ben megjelenő címkék)',
   [{fn:'labels',args:[],expect:LABELS},
    sc({circuit:'c1'},{status:'ok',label:`${LABELS.ok} – feltételezésekkel; nem vizsgált: hurokimpedancia`,'check:loop':'skipped'}),
    sc({circuit:'c1',set:{cable:'2 × 0,75'},routeCable:'2 × 0,75'},{status:'fail',label:LABELS.fail,'check:section':'fail','check:overload':'na'}),
    sc({circuit:'c2'},{status:'na',label:LABELS.na}),sc({circuit:'c3'},{status:'warn',label:LABELS.warn}),
    sc({circuit:'c1',noDevices:true},{label:`${LABELS.ok} – feltételezésekkel; nem vizsgált: Ib ≤ In, hurokimpedancia`}),
    sc({circuit:'c1',set:{cable:'MCu 2,5'},routeCable:'MCu 2,5'},{'check:cores':'skipped',label:`${LABELS.ok} – feltételezésekkel; nem vizsgált: hurokimpedancia`})]),
  rule('D-HATOKOR','A segédszámítás hatóköre',
   'A segédszámítás nem vizsgálja: '+notCovered.join('; ')+'.',
   'A program ezt a listát a Méretezés fülön („Mit nem vizsgál a számítás”) és a PDF „méretezés indoklása” táblájának „Nem vizsgált” sorában mutatja; a fenti szöveg a program listájából készül. Kérjük jelezni, ha a lista biztonsági szempontból hiányos, vagy ha egy tétel megfogalmazása félrevezető.',
   `Egy 3 × 2,5 mm²-es, B16-os áramkör „${LABELS.ok}” eredménye mellett is ellenőrizetlen marad a zárlati szilárdság és a szelektivitás.`,
   'A program „Mit nem vizsgál” listája (felület és PDF)',
   [{fn:'notCovered',args:[],expect:notCovered}]),
 ];
 return {no:2,title:'Képletek és programozott döntések',intro:[
  'A tételek a program képleteit, alapértékeit és döntéseit írják le kódolvasás nélkül. Mindegyikhez rövid indoklás és egy kézzel számolt példa tartozik; a példák számai az 1. rész értékeiből készülnek.',
  'A tétel végén az „Összevetés” sor jelzi, hány esetet vet össze automatikus teszt a programmal: a képletfüggvényekkel, a kábeljelölés-értelmezővel, a bemeneti korlátokkal, illetve a program beépített mintatervének (Családi ház) végigszámolt áramköreivel („mintaterv-számítás”). Az összevetés csak a felsorolt esetekre vonatkozik, nem a szabály minden ágára; a szabály szövegét a lektor ítéli meg.',
  'Ellenőrizendő: a képlet helyes-e, a feltételezés iránya (biztonság javára vagy kiemelt jelöléssel) elfogadható-e egy tervezői ellenőrzést segítő számításhoz, és a hivatkozott szabványpont helyes-e. Ahol „Kérdés a lektorhoz” áll, arra kérjük külön választ.',
 ],blocks:[
  {id:'K',title:'Képletek',source:SOURCES.overload.standard+'; '+SOURCES.voltageDrop.standard+'; '+SOURCES.loop.standard,minutes:K.length*3,intro:[],items:K},
  {id:'D-ALAP',title:'Alapértékek (ha a felhasználó nem ad meg adatot)',source:'Programozott alapértékek; a felület mindegyiket a „Feltételezések” listán jelzi',minutes:DA.length*2,intro:['A kiemelt feltételezések nem a biztonság javára közelítenek; ezeket a felület és a PDF külön jelöli, és a tényleges érték megadását kéri.'],items:DA},
  {id:'D-JEL',title:'Kábeljelölés-felismerés',source:'Programozott döntés (a kábeljelölés értelmezése)',minutes:4,columns:['Kulcsszó a jelölésben','Besorolás'],layout:{widths:[29,45,42,48],align:'left'},
   intro:['A kábeljelölésből a program a szigetelést és a vezetőanyagot az alábbi kulcsszavak alapján ismeri fel. A kulcsszó önálló szóként (kis- és nagybetűtől függetlenül) számít, a „…” tetszőleges folytatást jelöl (pl. NYM-J, NYM-O). Ellenőrizendő, hogy a besorolás helyes-e, és hiányzik-e gyakori jelölés. Minden sor néhány példáját automatikus teszt veti össze a programmal.'],items:JEL},
  {id:'D',title:'Programozott döntések',source:'Programozott döntések (kerekítés, tartalék, korlátok, állapotok)',minutes:D.length*3,intro:[],items:D},
 ]};
}

// ---------------------------------------------------------------- 3. rész – Szabványhoz kötött kalkulátorok (T1)
/** A 3. rész kalkulátorai a csomagbeli sorrendben; a tests/lektori-csomag.ts egyezteti a lib/calc/release.ts T1_SLUGS listájával. */
export const T1_ORDER=['feszultseges','motor-aram','led-szalag-tapegyseg','fazisjavitas','keresztmetszet','kismegszakito','hurokimpedancia','terhelhetoseg-tablazat'] as const;
type T1Slug=typeof T1_ORDER[number];
/** A kalkulátor blokkjának azonosítója: KAL-<slug nagybetűvel>, pl. „KAL-MOTOR-ARAM”; tételei: KAL-<SLUG>-<tétel>. */
export const kalId=(slug:string)=>'KAL-'+slug.toUpperCase();
const calc=(slug:string,input:Raw,expect:CalcExpect):ProgramCheck=>({fn:'calc',args:[slug,input],expect});
/** Szám a tartományleírásokban (ezres csoportosítással). */
const fmtN=(n:number)=>n.toLocaleString('hu-HU',{maximumFractionDigits:6});
/** Szám a kalkulátor nyers bemenetéhez (tizedesvesszővel, csoportosítás nélkül). */
const rawN=(n:number)=>String(+n.toPrecision(12)).replace('.',',');
/** Állandó teljes pontossággal (a legrövidebb, visszaolvasható alak); a generátor megáll, ha nem írható ki pontosan. */
function full(n:number):string{const s=String(n).replace('.',',');if(Number(s.replace(',','.'))!==n||/e/i.test(s))throw Error('Nem írható ki pontosan: '+n);return s}
const defOf=(slug:string):CalcDef=>{const d=bySlug(slug);if(!d||d.tier!=='T1')throw Error('Nincs ilyen T1 kalkulátor: '+slug);return d};
const baseUnit=(kind:UnitKind)=>(UNITS[kind] as readonly Unit[]).find(u=>u.factor===1)!;
const sameNumbers=(a:readonly {value:string}[],b:readonly number[])=>a.length===b.length&&a.every((o,i)=>Number(o.value)===b[i]);
const S3=Math.sqrt(3);
/** Lefelé kerekítés 0,1 m-re, ahogy a kalkulátor kiírja (a lebegőpontos zaj levágásával). */
const floor1=(x:number)=>Math.floor(+(x*10).toPrecision(15))/10;
/** A hossz kiírása a kalkulátor szerint: „39,9 m (lefelé kerekítve)”, ha a kerekítés látható. */
const lenText=(x:number)=>{const f=floor1(x);return hu(f,1)+' m'+(hu(x,3)!==hu(f,1)?' (lefelé kerekítve)':'')};
const listText=(xs:readonly number[],unit:string)=>xs.map(full).join('; ')+' '+unit;

/** A számmező bemeneti korlátai a tartomány szélein: a határ elfogadott, a határon túli és az üres (kötelező) érték elutasított. */
function numberFieldChecks(def:CalcDef,f:NumberField):ProgramCheck[]{
 const base:Raw={};
 if(f.showIf)base[f.showIf.field]=f.showIf.is[0];
 if(f.units)base[f.id+'.e']=baseUnit(f.units).id;
 const at=(v:string,ok:boolean):ProgramCheck=>({fn:'calcField',args:[def.slug,{...base,[f.id]:v},f.id],expect:ok});
 const out:ProgramCheck[]=[at('',!!f.optional)];
 if(f.positive)out.push(at('0',false));
 if(f.min!==undefined)out.push(at(rawN(f.min),true),at(rawN(f.integer?f.min-1:f.min-Math.max(Math.abs(f.min)*0.001,0.001)),false));
 if(f.max!==undefined)out.push(at(rawN(f.max),true),at(rawN(f.integer?f.max+1:f.max*1.001),false));
 if(f.integer)out.push(at(rawN((f.min??0)+0.5),false));
 return out;
}
/** Egy mező tétele: megnevezés, alapérték, tartomány, egység, láthatóság és súgó – a definícióból. `special`: választómező leírása (pl. 1. részbeli azonosítókkal). */
function fieldItem(def:CalcDef,f:FieldDef,special:Record<string,string>):ValueItem{
 const parts:string[]=[];
 let label=f.label;
 if(f.kind==='number'){
  const unit=f.units?baseUnit(f.units).label:f.unit??'',defUnit=f.units?(unitById(f.units,f.defaultUnit)??UNITS[f.units][0]).label:unit,u=unit?' '+unit:'';
  label=(f.symbol?f.symbol+' – ':'')+f.label+(unit?(f.label.endsWith(')')?', ':' (')+unit+(f.label.endsWith(')')?'':')'):'');
  parts.push(f.default?'alapérték: '+f.default+(defUnit?' '+defUnit:''):'alapérték: nincs (üres)');
  if(f.min!==undefined&&f.max!==undefined)parts.push(`megengedett: ${fmtN(f.min)} … ${fmtN(f.max)}${u}`);
  else if(f.positive&&f.max!==undefined)parts.push(`megengedett: > 0 és ≤ ${fmtN(f.max)}${u}`);
  else if(f.max!==undefined)parts.push(`megengedett: ≤ ${fmtN(f.max)}${u}`);
  if(f.integer)parts.push('egész szám');
  if(f.units)parts.push('egység: '+UNITS[f.units].map(x=>x.label).join(', ')+' (a korlát '+unit+' egységben értendő)');
  if(f.optional)parts.push('nem kötelező');
 }else if(f.kind==='select'){
  parts.push('választható: '+(special[f.id]??f.options.map(o=>o.label).join('; ')));
  parts.push('alapérték: '+(special[f.id+'.default']??f.options.find(o=>o.value===f.default)?.label??f.default));
 }else throw Error(`${def.slug}.${f.id}: lista- vagy sormezőt a 3. rész nem ír le`);
 const ctl=f.showIf?def.fields.find(x=>x.id===f.showIf!.field):undefined;
 if(ctl?.kind==='select')parts.push('csak: '+f.showIf!.is.map(v=>ctl.options.find(o=>o.value===v)?.label??v).join(', '));
 if(f.help)parts.push('súgó: „'+f.help+'”');
 return value(kalId(def.slug)+'-BEM-'+f.id.toUpperCase(),label,parts.join('; '),[],f.kind==='number'?numberFieldChecks(def,f):undefined);
}
/** A közös (lib/calc/sizing-fields) választómezők leírása az 1. rész azonosítóival, értékek ismétlése nélkül. */
function sharedSelects(def:CalcDef):Record<string,string>{
 const out:Record<string,string>={};
 for(const f of def.fields){
  if(f.kind!=='select')continue;
  if(f.id==='mod'){out.mod=INSTALL_METHODS.join(', ')+' – leírásuk: L-MOD-'+INSTALL_METHODS.join(', L-MOD-');out['mod.default']=f.default+' (L-MOD-'+f.default+')'}
  else if(f.id==='szig'){out.szig=INSULATIONS.join(', ')+' – leírásuk: L-SZIG-PVC, L-SZIG-XLPE (XLPE a D-XLPE szerint PVC-értékkel)';out['szig.default']=f.default}
  else if(f.id==='gorbe'){out.gorbe='B, C, D – pillanatkioldás: T-K-M-B, T-K-M-C, T-K-M-D';out['gorbe.default']=f.default}
  else if(sameNumbers(f.options,T.sections)){out[f.id]=T.sections.map(exact).join('; ')+' mm² (T-KM-SOR)';out[f.id+'.default']=exact(Number(f.default))+' mm²'}
  else if(sameNumbers(f.options,MCB_RATINGS.value)){out[f.id]='a KAL-KOZOS-MCB szerinti előnyös névleges áramok';out[f.id+'.default']=f.default+' A'}
 }
 return out;
}
/** A kalkulátoroldalon a számítás mellett megjelenő feltételezések (a definíció példáinak futtatásából, első előfordulás szerint). */
function assumptionsOf(def:CalcDef,extra:Raw[]=[]):string[]{
 const seen:string[]=[];
 for(const input of [...def.examples.map(e=>e.input),...extra]){const r=runCalc(def,input);if(r.ok)for(const a of r.out.assumptions??[])if(!seen.includes(a))seen.push(a)}
 return seen;
}
type KalBody={special?:Record<string,string>;extraInputs?:Raw[];consts?:ValueItem[];rules:RuleItem[]};

function kalBlock(slug:T1Slug,body:KalBody):Block{
 const def=defOf(slug),P=kalId(slug),gated=TABLE_GATED.has(slug),sizing=SIZING_NOT_COVERED;
 const nc=def.notCovered??[],sameNc=nc.length>=sizing.length&&sizing.every((x,i)=>nc[i]===x),extraNc=sameNc?nc.slice(sizing.length):nc;
 const special={...sharedSelects(def),...body.special};
 const values:ValueItem[]=[
  value(P+'-HAT','Mire jó / mire nem (a kalkulátoroldalon)','Mire jó: '+def.notes.good.join(' ')+' Mire nem: '+def.notes.bad.join(' '),[]),
  value(P+'-NV','Nem vizsgált (a kalkulátoroldalon)',sameNc?'a méretezési segédszámítással azonos lista (D-HATOKOR)'+(extraNc.length?', kiegészítve: '+extraNc.map(x=>'„'+x+'”').join(', '):''):nc.join('; '),[],sameNc?[{fn:'calcNotCovered',args:[slug],expect:[...sizing,...extraNc]}]:undefined),
  value(P+'-KEPLET','Képletek (a kalkulátoroldal „Képletek” szakasza)',def.formulas.join(' · '),[]),
  value(P+'-FELT','Feltételezések (a számítás mellett)',assumptionsOf(def,body.extraInputs).map((a,i)=>`${i+1}) ${a}`).join(' '),[]),
  ...def.fields.map(f=>fieldItem(def,f,special)),
  ...(body.consts??[]),
 ];
 const rules=body.rules;
 return {id:P,title:def.title,source:def.sources.join('; '),minutes:Math.ceil(values.length*0.75+rules.length*3+2),columns:['Tétel','Leírás / érték'],layout:{widths:[30,34,72,28],align:'left'},
  intro:[
   'Cél: '+def.short,
   `Kiadás: ${def.tier} (csak szakmai lektori jóváhagyással), verzió v${def.version} (${dateHu(def.updated)}); táblázat-kapu: ${gated?'igen – a kalkulátor az 1. rész jóváhagyása nélkül akkor sem jelenik meg, ha ez a blokk jóvá van hagyva':'nem – a kiadáshoz a kalkulátor jóváhagyása elég'}. Tartalmi ujjlenyomat: ${calcFingerprint(def)}; forrás-ujjlenyomat: ${sourceFingerprint(slug)}. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.`,
  ],items:[...values,...rules]};
}

/** A kalkulátorok blokkjai (KAL-KOZOS és kalkulátoronként egy). A kézzel számolt példák a generátor saját számításai az 1. rész
 * értékeiből; a tests/lektori-csomag.ts a kalkulátor tényleges futtatásával (runCalc) veti össze őket. */
function calculatorsPart():Part{
 const lim=T.dropLimits,k=T.conventionalFactor,tables=T1_ORDER.map(defOf).filter(d=>d.tables).map(d=>d.title),notTables=T1_ORDER.map(defOf).filter(d=>!d.tables).map(d=>d.title);
 const interv=T1_ORDER.map(defOf).filter(d=>d.safety.includes('beavatkozas')).map(d=>d.title);
 // ---- KAL-KOZOS
 const fz=(L:number)=>drop(2,L,16,2.5,1),pEdge=fz(39.931),in1={rendszer:'1f',I:'16',L:'23,4',A:'2,5',cos:'1',hatar:'public-other'};
 const p1=fz(23.4),v1=p1/100*T.u0,l1=lim.public.other/100*T.u0/(2*16*T.rho1/2.5);
 const kozos:Block={id:'KAL-KOZOS',title:'Közös működés (minden T1 kalkulátor)',source:'A kalkulátorok közös számítómotorja (számbevitel, kiírás, szóhasználat, figyelmeztetések) és közös állandói',minutes:0,columns:['Tétel','Érték / szöveg'],layout:{widths:[30,34,72,28],align:'left'},
  intro:['Az itt leírt viselkedés és szövegek minden T1 kalkulátorra érvényesek; a kalkulátoronkénti blokkok erre hivatkoznak. Ha ebben a blokkban eltérés van, egyik kalkulátor sem jelölhető jóváhagyottnak a javításig.'],
  items:[
   value('KAL-KOZOS-MCB','Kismegszakítók előnyös névleges áramai (a választható és a javasolt In)',listText(MCB_RATINGS.value,'A')+' – '+MCB_RATINGS.source,[]),
   value('KAL-KOZOS-FIGY-MERETEZES',`Figyelmeztetés a táblázatokat használó kalkulátoroknál (${tables.join(', ')}); nem zárható`,`„${SAFETY.meretezes.title}. ${SAFETY.meretezes.text}” + „${SIZING_DISCLAIMER_SHORT} Az eredmény „számítás szerinti” érték a megadott adatokkal és a lent felsorolt feltételezésekkel.”`,[]),
   value('KAL-KOZOS-FIGY-KALKULATOR',`Figyelmeztetés a többi T1 kalkulátornál (${notTables.join(', ')}); nem zárható`,`„${SAFETY.kalkulator.title}. ${SAFETY.kalkulator.text}” + „Tájékoztató számítás – nem tervezői döntés. Az eredmény „számítás szerinti” érték a megadott adatokkal és a lent felsorolt feltételezésekkel.”`,[]),
   value('KAL-KOZOS-FIGY-BEAVATKOZAS',`Figyelmeztetés a beavatkozással járó témáknál (${interv.join(', ')})`,`„${SAFETY.beavatkozas.title}. ${SAFETY.beavatkozas.text}”`,[]),
   value('KAL-KOZOS-FIGY-ALAP','Alapfigyelmeztetés (minden oldal alján)',`„${SAFETY.alap.text}”`,[]),
   rule('KAL-KOZOS-BEVITEL','Számbevitel és bemeneti korlátok',
    'A számmezők tizedesvesszőt és tizedespontot is elfogadnak; ha csak pont vagy csak vessző szerepel, az a tizedesjel („1.500” = 1,5). Szóközös ezres csoport („1 000”), unicode mínuszjel és normálalak („1e3”) is megadható. Nem szám, hiányzó kötelező érték vagy tartományon kívüli érték esetén a mező alatt magyar hibaüzenet jelenik meg, és eredmény nem készül: a program a bevitelt nem igazítja a tartományba. A tartományokat kalkulátoronként a …-BEM- tételek sorolják fel; a tételek összevetése a tartomány szélein elfogadott és a határon túl elutasított értéket próbál.',
    'A csendes korrekció (pl. a tartomány szélére állítás) félrevezető eredményt adna. A „1.500” = 1,5 értelmezés a tizedespontot használó bevitel (pl. másolt érték) miatt választott; ezres csoport csak szóközzel adható meg.',
    `Feszültségesés, terhelőáram (megengedett: > 0 és ≤ 1000 A): „16,0” és „16.0” → 16 A; „1 000” → 1000 A; „1001” → „Legfeljebb 1000 A lehet.”; „0” → „Nullánál nagyobb számot adj meg.”; „abc” → „Csak számot írj; a mértékegységet mellette választhatod.”; vezetékhossz „23.4” → 23,4 m (ΔU% = ${pct(p1,4)}, mint „23,4”-nél).`,
    '– (programozott döntés: a kalkulátorok számbevitele)',
    [calc('feszultseges',{...in1,I:'16.0'},{pct:p1}),calc('feszultseges',{...in1,L:'23.4'},{pct:p1}),calc('feszultseges',{...in1,I:'1 000'},{ok:true,pct:drop(2,23.4,1000,2.5,1)}),
     calc('feszultseges',{...in1,I:'1001'},{ok:false,errorField:'I',error:'Legfeljebb 1000 A lehet.'}),calc('feszultseges',{...in1,I:'0'},{ok:false,errorField:'I',error:'Nullánál nagyobb számot adj meg.'}),
     calc('feszultseges',{...in1,I:'abc'},{ok:false,errorField:'I',error:'Csak számot írj'}),calc('feszultseges',{...in1,L:'1.500'},{pct:fz(1.5)}),calc('feszultseges',{...in1,I:''},{ok:false,errorField:'I',error:'Add meg az értéket.'})]),
   rule('KAL-KOZOS-KIIRAS','Kerekítés és kiírás',
    'A számítás kerekítés nélkül fut, csak a kiírás kerekít: 1 alatt és 1–10 között 4 értékes jegy, 10 fölött legfeljebb 3 tizedes (10 000-ig 5 értékes jegy), afölött egész szám; 10⁻⁶ alatt normálalak. A hosszakat (Lmax) 0,1 m-re lefelé kerekítve írja ki, „(lefelé kerekítve)” jelöléssel, ha a kerekítés látható. Határérték-összevetésnél, ha a kerekített kiírás egyenlőséget mutatna, de a feltétel nem teljesül, a két oldal több tizedessel jelenik meg.',
    'A lefelé kerekített hossz a biztonság javára téved; a több tizedes azt akadályozza meg, hogy a kiírás „5 % > 5 %” alakú, ellentmondásosnak látszó szöveget adjon.',
    `Feszültségesés, 16 A, 23,4 m, 2,5 mm² (KAL-FESZULTSEGES-K1): ΔU% = ${hu(p1,6)} → „${hu(p1,2)} %”; ΔU = ${hu(v1,5)} V → „${hu(v1,3)} V”; Lmax = ${hu(l1,4)} m → „${lenText(l1)}”. 39,931 m-nél ΔU% = ${hu(pEdge,6)} → „Számítás szerint meghaladja a határt: ${hu(pEdge,4)} % > 5 %.”`,
    '– (programozott döntés: a kalkulátorok kiírása)',
    [calc('feszultseges',in1,{'text:pct':hu(p1,2)+' %','text:dU':hu(v1,3)+' V','text:Lmax':lenText(l1)}),calc('feszultseges',{...in1,L:'39,931'},{verdict:false,verdictText:`${hu(pEdge,4)} % > 5 %`})]),
   rule('KAL-KOZOS-SZOVEG','Szóhasználat és figyelmeztetések',
    `Az eredmény „számítás szerinti”: ahol a kalkulátor feltételt értékel, a verdikt „Számítás szerint …” kezdetű; a „megfelel”, „szabványos”, „MSZ szerint” kifejezést a T1 kalkulátorok nem használják. Minden T1 kalkulátoroldalon nem zárható figyelmeztetés áll (KAL-KOZOS-FIGY-MERETEZES vagy KAL-KOZOS-FIGY-KALKULATOR), alatta a „Nem vizsgált” lista, a számítás mellett a feltételezések, a táblázatokat használóknál a táblázatok állapota (a jóváhagyásig „Ellenőrizendő: …”), a beavatkozással járó témáknál a KAL-KOZOS-FIGY-BEAVATKOZAS is. A kalkulátoroldal a levezetést (képlet → behelyettesítés → eredmény → forrás) és a kidolgozott példát is mutatja.`,
    'A szabványhoz kötött számítás eredménye nem minősülhet megfelelőségi nyilatkozatnak; a felhasználónak látnia kell a feltételezéseket és az el nem végzett vizsgálatokat.',
    `Keresztmetszet-választás, In = 20 A, B2: „Számítás szerint 2,5 mm² a legkisebb keresztmetszet, amelyre In ≤ Iz teljesül (20 A ≤ ${exact(iz0(2,'B2',2.5))} A).” Kismegszakító-választás, Ib = 22 A, 2,5 mm²: „Számítás szerint nincs olyan előnyös névleges áram …”.`,
    '– (programozott döntés: a kalkulátoroldal szövegei)',
    [calc('keresztmetszet',{In:'20'},{verdict:true,verdictText:'Számítás szerint 2,5 mm² a legkisebb keresztmetszet'}),calc('kismegszakito',{Ib:'22',A:'2.5'},{verdict:false,verdictText:'Számítás szerint nincs olyan előnyös névleges áram'}),calc('hurokimpedancia',{},{verdictText:'Számítás szerint'}),calc('feszultseges',in1,{verdictText:'Számítás szerint'})]),
  ]};
 kozos.minutes=Math.ceil(kozos.items.filter(i=>i.kind==='value').length*0.75+kozos.items.filter(i=>i.kind==='rule').length*3+2);

 // ---- Feszültségesés
 const s9=sinOf(0.9),p3=drop(1,50,32,6,0.9),v3=p3/100*400;
 const vd=2*10*5*T.rho1/1.5,pd=vd/24*100,ld=5/100*24/(2*5*T.rho1/1.5);
 const pv=drop(2,30,10,1.5,1),lv=lim.public.lighting/100*T.u0/(2*10*T.rho1/1.5),p3mm=drop(2,23.4,16,3,1);
 const in3={rendszer:'3f',I:'32',L:'50',A:'6',cos:'0,9',hatar:'public-other'},inD={rendszer:'dc',I:'5',L:'10',A:'1,5',Udc:'24',hatarDc:'5'},inV={rendszer:'1f',I:'10',L:'30',A:'1,5',cos:'1',hatar:'public-lighting'};
 const fesz=kalBlock('feszultseges',{
  special:{hatar:'a négy G.52.1 szerinti határ: T-DU-KOZ-EGY, T-DU-KOZ-VIL, T-DU-SAJ-EGY, T-DU-SAJ-VIL (közcélú hálózat / saját táppont; egyéb fogyasztó / világítás)','hatar.default':'közcélú hálózat, egyéb fogyasztó (T-DU-KOZ-EGY)'},
  rules:[
   rule('KAL-FESZULTSEGES-K1','Feszültségesés egy- és háromfázisú körben',
    'ΔU% = b · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100, ahol b = 2 egyfázisú, b = 1 (szimmetrikus) háromfázisú körben, sin φ = √(1 − cos² φ). Ugyanaz a programfüggvény, mint a tervező Méretezés fülén (K-DU1, K-DU3). A voltban kiírt esés egyfázisnál ΔU = ΔU% · U0, háromfázisnál ΔU = ΔU% · 400 V (vonali feszültség).',
    'A százalék U0-ra vonatkozik (T-K-U0); ρ1: T-K-RHO1, λ: T-K-LAMBDA. A teljes terhelést a vezeték végén feltételezi, és elosztó előtti (fővezeték) esést nem ad hozzá – ezt a feltételezés-sor kimondja.',
    `Egyfázis, I = 16 A, L = 23,4 m, A = 2,5 mm², cos φ = 1: ΔU% = 2 · 23,4 · 16 · ${exact(T.rho1)} / 2,5 / ${exact(T.u0)} · 100 = ${pct(p1,4)}; ΔU = ${pct(p1,4)} · ${exact(T.u0)} V = ${hu(v1,4)} V. Háromfázis, I = 32 A, L = 50 m, A = 6 mm², cos φ = 0,9, sin φ = ${hu(s9,5)}: ΔU% = 1 · 50 · 32 · (${exact(T.rho1)} · 0,9 / 6 + ${exact(T.lambda)} · ${hu(s9,5)}) / ${exact(T.u0)} · 100 = ${pct(p3,4)}; ΔU = ${pct(p3,4)} · 400 V = ${hu(v3,4)} V.`,
    'T-K-RHO1, T-K-LAMBDA, T-K-U0 (1. rész); K-DU1, K-DU3 (2. rész); '+SOURCES.voltageDrop.standard+' '+CLAUSES.lambda,
    [calc('feszultseges',in1,{pct:p1,dU:v1,limit:lim.public.other,verdict:le(p1,lim.public.other)}),calc('feszultseges',in3,{pct:p3,dU:v3,verdict:le(p3,lim.public.other)})]),
   rule('KAL-FESZULTSEGES-K2','Feszültségesés egyenáramú körben',
    'ΔU = 2 · L · I · ρ1 / A (oda- és visszavezető, reaktancia nélkül); ΔU% = ΔU / U · 100, ahol U a megadott névleges feszültség. Egyenáramnál a határ a felhasználó által megadott százalék (alapértéke 3%); a G.52.1 határok (T-DU) itt nem választhatók.',
    'Törpefeszültségű egyenáramú körben (LED, akkumulátoros rendszer) a kis névleges feszültség miatt a százalékos esés nagy; a programban erre nincs szabványos határ, ezért a felhasználó adja meg. ρ1 ugyanaz az üzemi hőmérsékletű érték (T-K-RHO1), mint váltakozó áramnál.',
    `U = 24 V, I = 5 A, L = 10 m, A = 1,5 mm²: ΔU = 2 · 10 · 5 · ${exact(T.rho1)} / 1,5 = ${hu(vd,4)} V; ΔU% = ${hu(vd,4)} / 24 · 100 = ${pct(pd)}; megadott határ 5% → ${pct(pd)} ${rel(pd,5)} 5% → „Számítás szerint meghaladja a határt”.`,
    'T-K-RHO1 (1. rész); egyenáramú alapösszefüggés (U = R · I)',
    [calc('feszultseges',inD,{dU:vd,pct:pd,limit:5,verdict:le(pd,5)})],
    'Elfogadható-e egyenáramnál az üzemi hőmérsékletű ρ1 (T-K-RHO1) és a felhasználó által megadott határ 3%-os alapértéke?'),
   rule('KAL-FESZULTSEGES-K3','Legnagyobb hossz a határig',
    'Lmax = ΔU%határ · U0 / (100 · b · I · (ρ1 · cos φ / A + λ · sin φ)); egyenáramnál Lmax = ΔU%határ / 100 · U / (2 · I · ρ1 / A). Mindkettő azonos a ΔU%határ / ΔU% · L aránnyal, mert az esés a hosszal arányos (a levezetés ezt az alakot mutatja). Kiírás 0,1 m-re lefelé kerekítve (KAL-KOZOS-KIIRAS).',
    'A K1, K2 képlet átrendezése (K-LMAX); a lefelé kerekítés a biztonság javára téved. Elosztó előtti esést nem von le.',
    `Egyfázis, 16 A, 2,5 mm², határ ${pct(lim.public.other)}: Lmax = ${hu(lim.public.other/100)} · ${exact(T.u0)} / (2 · 16 · ${exact(T.rho1)} / 2,5) = ${hu(l1,4)} m → ${lenText(l1)}. Világítás, 10 A, 30 m, 1,5 mm², határ ${pct(lim.public.lighting)}: ΔU% = ${pct(pv,4)}; Lmax = ${hu(lim.public.lighting/100)} · ${exact(T.u0)} / (2 · 10 · ${exact(T.rho1)} / 1,5) = ${hu(lv,4)} m → ${lenText(lv)}. Egyenáram (K2), határ 5%: Lmax = 0,05 · 24 / (2 · 5 · ${exact(T.rho1)} / 1,5) = ${hu(ld,4)} m.`,
    'T-DU-KOZ-EGY, T-DU-KOZ-VIL (1. rész); K-LMAX (2. rész)',
    [calc('feszultseges',in1,{Lmax:l1,'text:Lmax':lenText(l1)}),calc('feszultseges',inV,{pct:pv,Lmax:lv,'text:Lmax':lenText(lv),verdict:le(pv,lim.public.lighting)}),calc('feszultseges',inD,{Lmax:ld,'text:Lmax':lenText(ld)})]),
   rule('KAL-FESZULTSEGES-D1','Határérték és eredmény',
    'Egy- és háromfázisú körben a határ a négy G.52.1 érték közül választható (alapérték: közcélú hálózat, egyéb fogyasztó); egyenáramnál megadott százalék. A feltétel ΔU% ≤ határ, relatív 10⁻⁹ tűréssel (D-TURES). Eredmény: „Számítás szerint a határon belül: x % ≤ y %.” vagy „Számítás szerint meghaladja a határt: x % > y %.”. A határ mellett a forrás rövid hivatkozása és a táblázatok állapota áll („ellenőrizendő” a jóváhagyásig); egyenáramnál „(megadott)”.',
    'A határ a berendezés kezdőpontjától értendő (K-DUOSSZ); a kalkulátor csak a megadott vezetéket számolja, ezért a fővezeték esését a felhasználónak kell figyelembe vennie – a feltételezés-sor ezt kimondja.',
    `Világítás (T-DU-KOZ-VIL), 10 A, 30 m, 1,5 mm²: ${pct(pv,3)} ${rel(pv,lim.public.lighting)} ${pct(lim.public.lighting)} → „Számítás szerint meghaladja a határt”; ugyanez egyéb fogyasztóként (T-DU-KOZ-EGY): ${pct(pv,3)} ${rel(pv,lim.public.other)} ${pct(lim.public.other)} → „Számítás szerint a határon belül”. Saját táppont, világítás: határ ${pct(lim.private.lighting)} (T-DU-SAJ-VIL).`,
    'T-DU-KOZ-EGY, T-DU-KOZ-VIL, T-DU-SAJ-EGY, T-DU-SAJ-VIL (1. rész); D-TURES, K-DUOSSZ (2. rész)',
    [calc('feszultseges',inV,{verdict:le(pv,lim.public.lighting),verdictText:'Számítás szerint meghaladja a határt',limit:lim.public.lighting}),calc('feszultseges',{...inV,hatar:'public-other'},{verdict:le(pv,lim.public.other),verdictText:'Számítás szerint a határon belül'}),
     calc('feszultseges',{...inV,hatar:'private-lighting'},{limit:lim.private.lighting}),calc('feszultseges',{...inV,hatar:'private-other'},{limit:lim.private.other}),calc('feszultseges',inD,{'text:limit':'5 % (megadott)'})]),
   rule('KAL-FESZULTSEGES-D2','Szabad keresztmetszet, háromfázisú voltérték, kiadási feltétel',
    'A keresztmetszet szabadon megadható (> 0 és ≤ 1000 mm²), nem csak a T-KM-SOR lépcsői; a kalkulátor sem a terhelhetőséget, sem a legkisebb keresztmetszetet nem vizsgálja. Háromfázisnál a voltban kiírt esés a 400 V-os vonali névleges feszültségre vonatkozik. A kalkulátor nem táblázat-kapus: lektori jóváhagyással az 1. rész jóváhagyása nélkül is kiadható; a felhasznált T-K-RHO1, T-K-LAMBDA, T-K-U0 és T-DU értékeket az oldal a táblázatok állapotával együtt mutatja.',
    'A feszültségesés a keresztmetszettel fordítottan arányos, a táblázati lépcsőhöz nem kötött; a terhelhetőséget a Keresztmetszet-választás és a Terhelhetőségi táblázat kalkulátor vizsgálja. A 400 V a vonali névleges feszültség (MSZ EN 60038); √3 · 230 V = 398,4 V-tal a kiírt érték 0,4%-kal kisebb lenne.',
    `3 mm², egyfázis, 16 A, 23,4 m: ΔU% = 2 · 23,4 · 16 · ${exact(T.rho1)} / 3 / ${exact(T.u0)} · 100 = ${pct(p3mm,4)} (a Méretezés fül a nem szabványos keresztmetszettel nem számol, D-BLOKK). Háromfázis (K1): ${pct(p3,4)} · 400 V = ${hu(v3,4)} V.`,
    'MSZ EN 60038 (400 V); T-KM-SOR (1. rész); D-BLOKK (2. rész)',
    [calc('feszultseges',{...in1,A:'3'},{ok:true,pct:p3mm}),calc('feszultseges',in3,{dU:v3})],
    '1) Elfogadható-e, hogy a Feszültségesés kalkulátor a táblázatok (1. rész) jóváhagyása nélkül, a táblázatállapot kiírásával is kiadható? 2) Elfogadható-e háromfázisnál a 400 V-hoz viszonyított voltérték? 3) A „Nem vizsgált” lista (D-HATOKOR) a 35 mm² feletti keresztmetszetet is említi, a kalkulátor viszont 1000 mm²-ig enged bevitelt – elegendő-e a lista, vagy korlátozni kell a bevitelt?'),
  ]});

 // ---- Motoráram
 const i3=5500/(S3*400*0.85*0.87),pin3=5500/0.87,sva3=pin3/0.85,i1=750/(230*0.8*0.7),pin1=750/0.7;
 const i7=7500/(S3*400*0.86*0.89),pLE=10*LE_W,iLE=pLE/(S3*400*0.85*0.88),pHP=10*HP_W,iHP=pHP/(S3*400*0.85*0.88);
 const motor=kalBlock('motor-aram',{
  consts:[
   value('KAL-MOTOR-ARAM-LE','1 LE (metrikus lóerő), a teljesítmény mértékegysége',full(LE_W)+' W (75 kp · m/s; definíció)',[],[calc('motor-aram',{rendszer:'3f',P:'1','P.e':'LE',Uv:'400',cos:'1',eta:'1'},{Pin:LE_W})]),
   value('KAL-MOTOR-ARAM-HP','1 hp (angolszász mechanikai lóerő), a teljesítmény mértékegysége',full(HP_W)+' W (550 ft · lbf/s; definíció)',[],[calc('motor-aram',{rendszer:'3f',P:'1','P.e':'hp',Uv:'400',cos:'1',eta:'1'},{Pin:HP_W})]),
  ],
  rules:[
   rule('KAL-MOTOR-ARAM-K1','Névleges áram, háromfázisú motor',
    'In = P / (√3 · U · cos φ · η), ahol P a leadott (tengely-) teljesítmény, U a vonali feszültség. Mellékeredmény: felvett hatásos teljesítmény P1 = P / η, látszólagos teljesítmény S = P1 / cos φ.',
    'A tengelyteljesítményből a felvett teljesítmény P1 = P / η; a szimmetrikus háromfázisú terhelés áramára P1 = √3 · U · I · cos φ. A becslés a névleges munkapontra érvényes; a valós névleges áram motoronként eltér, ezért az adattábla az irányadó (KAL-MOTOR-ARAM-D1).',
    `P = 5,5 kW, U = 400 V, cos φ = 0,85, η = 0,87: In = 5500 / (√3 · 400 · 0,85 · 0,87) = 5500 / ${hu(S3*400*0.85*0.87,3)} = ${hu(i3,4)} A; P1 = 5500 / 0,87 = ${hu(pin3,2)} W; S = ${hu(pin3,2)} / 0,85 = ${hu(sva3,2)} VA.`,
    'Villamos gépek teljesítmény-összefüggése (P = √3 · U · I · cos φ · η); MSZ EN 60038 (400 V)',
    [calc('motor-aram',{rendszer:'3f',P:'5,5','P.e':'kW',Uv:'400',cos:'0,85',eta:'0,87'},{I:i3,Pin:pin3,S:sva3,Ia:null})]),
   rule('KAL-MOTOR-ARAM-K2','Névleges áram, egyfázisú motor',
    'In = P / (U · cos φ · η), U a fázisfeszültség (alapértéke 230 V).',
    'Az egyfázisú teljesítmény-összefüggés P1 = U · I · cos φ; a kondenzátoros egyfázisú motor sajátosságait (segédfázis) a kalkulátor nem vizsgálja (Nem vizsgált).',
    `P = 0,75 kW, U = 230 V, cos φ = 0,8, η = 0,7: In = 750 / (230 · 0,8 · 0,7) = 750 / 128,8 = ${hu(i1,4)} A; P1 = 750 / 0,7 = ${hu(pin1,2)} W.`,
    'Villamos gépek teljesítmény-összefüggése (P = U · I · cos φ · η); MSZ EN 60038 (230 V)',
    [calc('motor-aram',{rendszer:'1f',P:'0,75','P.e':'kW',U:'230',cos:'0,8',eta:'0,7'},{I:i1,Pin:pin1})]),
   rule('KAL-MOTOR-ARAM-K3','Indítási áram (nem kötelező)',
    'Ha az indítási áramarány (Ia/In, 1–15) meg van adva: Ia = (Ia/In) · In. Üresen indítási áram nem készül.',
    'Az arány az adattábláról vagy a katalógusból vehető; közvetlen indításnál jellemzően 5–8 (a mező súgója). Az indítás módját a kalkulátor nem vizsgálja (Nem vizsgált).',
    `P = 7,5 kW, U = 400 V, cos φ = 0,86, η = 0,89, Ia/In = 7: In = 7500 / (√3 · 400 · 0,86 · 0,89) = ${hu(i7,4)} A; Ia = 7 · ${hu(i7,4)} = ${hu(7*i7,3)} A.`,
    'Villamos gépek teljesítmény-összefüggése; az arány a gyártó adata',
    [calc('motor-aram',{rendszer:'3f',P:'7,5','P.e':'kW',Uv:'400',cos:'0,86',eta:'0,89',k:'7'},{I:i7,Ia:7*i7})]),
   rule('KAL-MOTOR-ARAM-D1','Alapértékek és tájékoztatás',
    'Alapértékek: háromfázisú, 400 V, cos φ = 0,85, η = 0,87, P = 5,5 kW; a felhasználó mindegyiket módosíthatja. Az eredmény „Becsült névleges áram”, verdikt nincs; a számítás mellett mindig megjelenik: „A motor adattábláján szereplő névleges áram az irányadó; ez a számítás csak becslés, ha az adattábla nem olvasható.”',
    'A cos φ és az η motoronként (teljesítmény, pólusszám, gyártó) eltér; az alapértékek csak a mezők kitöltését könnyítik, ezért a tájékoztató sor minden eredmény mellett megjelenik.',
    `Alapértékekkel: In = 5500 / (√3 · 400 · 0,85 · 0,87) = ${hu(i3,4)} A, a tájékoztató sorral.`,
    '– (programozott döntés: alapértékek)',
    [calc('motor-aram',{},{I:i3,issue:'A motor adattábláján szereplő névleges áram az irányadó'})],
    'Elfogadhatók-e a cos φ = 0,85 és η = 0,87 alapértékek, vagy a mezőket alapérték nélkül (kötelező kitöltéssel) kellene kínálni?'),
   rule('KAL-MOTOR-ARAM-D2','Teljesítmény-mértékegységek',
    'A teljesítmény kW-ban (alapérték), W-ban, LE-ben vagy hp-ben adható meg; a számítás W-ban fut (KAL-MOTOR-ARAM-LE, KAL-MOTOR-ARAM-HP). A megengedett tartomány W-ban értendő (> 0 és ≤ 10 000 000 W).',
    'Régi adattáblákon a teljesítmény LE-ben vagy hp-ben is szerepelhet.',
    `10 LE = 10 · ${full(LE_W)} = ${hu(pLE,4)} W; 400 V, 0,85, 0,88: In = ${hu(pLE,4)} / (√3 · 400 · 0,85 · 0,88) = ${hu(iLE,4)} A. 10 hp = ${hu(pHP,4)} W → In = ${hu(iHP,4)} A.`,
    '1 LE = 735,49875 W; 1 hp ≈ 745,7 W (definíció)',
    [calc('motor-aram',{rendszer:'3f',P:'10','P.e':'LE',Uv:'400',cos:'0,85',eta:'0,88'},{I:iLE}),calc('motor-aram',{rendszer:'3f',P:'10','P.e':'hp',Uv:'400',cos:'0,85',eta:'0,88'},{I:iHP})]),
  ]});

 // ---- LED-szalag tápegysége
 const psu=(x:number)=>PSU_SIZES.value.find(v=>v>=x*(1-1e-9))??null;
 const led=(L:number,pm:number,U:number,r:number)=>{const P=L*pm;return {P,I:P/U,Pmin:P*(1+r/100),psu:psu(P*(1+r/100))}};
 const e1=led(5,14.4,24,20),e2=led(10,9.6,12,20),e3=led(50,14.4,24,20),e4=led(5,16,24,25);
 const ledB=kalBlock('led-szalag-tapegyseg',{
  consts:[
   value('KAL-LED-SZALAG-TAPEGYSEG-PSU','Jellemző tápegység-teljesítmények (a javaslat ebből választ)',listText(PSU_SIZES.value,'W')+' – '+PSU_SIZES.source,[]),
   value('KAL-LED-SZALAG-TAPEGYSEG-BETAP','Betáplálási távolság, amely felett tájékoztató sor jelenik meg','szalagfeszültség ≤ 5 V: 2 m (kiírva: „1–2 m-enként”); ≤ 12 V: 5 m; ≤ 24 V: 10 m; 24 V felett: 10 m (kiírva: „a gyártói adatlap adja meg”) – programozott tájékoztató érték, forrás nélkül',[],
    [calc('led-szalag-tapegyseg',{L:'3',pm:'4,8',U:'5',r:'20'},{issue:'1–2 m-enként'}),calc('led-szalag-tapegyseg',{L:'2',pm:'4,8',U:'5',r:'20'},{issues:0}),calc('led-szalag-tapegyseg',{L:'6',pm:'4,8',U:'12',r:'20'},{issue:'5 m-enként'}),
     calc('led-szalag-tapegyseg',{L:'10',pm:'4,8',U:'24',r:'20'},{issues:0}),calc('led-szalag-tapegyseg',{L:'11',pm:'4,8',U:'24',r:'20'},{issue:'10 m-enként'}),calc('led-szalag-tapegyseg',{L:'12',pm:'4,8',U:'48',r:'20'},{issue:'a gyártói adatlap adja meg'})]),
  ],
  rules:[
   rule('KAL-LED-SZALAG-TAPEGYSEG-K1','Teljesítmény, áram, szükséges tápegység',
    'P = L · P/m; I = P / U; Pmin = P · (1 + t / 100), ahol t a teljesítménytartalék %-ban (alapértéke 20%). Javasolt tápegység: a KAL-LED-SZALAG-TAPEGYSEG-PSU sor legkisebb, Pmin-nél nem kisebb eleme.',
    'Állandó feszültségű (CV) szalagnál a méterenkénti teljesítmény a névleges feszültségen érvényes; a tartalék a tápegység tartós terhelését csökkenti.',
    `L = 5 m, P/m = 14,4 W/m, U = 24 V, t = 20%: P = 5 · 14,4 = ${hu(e1.P)} W; I = ${hu(e1.P)} / 24 = ${hu(e1.I)} A; Pmin = ${hu(e1.P)} · 1,2 = ${hu(e1.Pmin)} W → ${e1.psu} W. L = 10 m, 9,6 W/m, 12 V, 20%: P = ${hu(e2.P)} W; I = ${hu(e2.I)} A; Pmin = ${hu(e2.Pmin)} W → ${e2.psu} W.`,
    'Teljesítmény-összefüggés (P = U · I); '+PSU_SIZES.source,
    [calc('led-szalag-tapegyseg',{L:'5',pm:'14,4',U:'24',r:'20'},{P:e1.P,I:e1.I,Pmin:e1.Pmin,psu:e1.psu,primary:'psu'}),calc('led-szalag-tapegyseg',{L:'10',pm:'9,6',U:'12',r:'20'},{P:e2.P,I:e2.I,Pmin:e2.Pmin,psu:e2.psu})]),
   rule('KAL-LED-SZALAG-TAPEGYSEG-D1','Tápegység-javaslat és túl nagy terhelés',
    'A javaslat a jellemző teljesítménysor legkisebb, Pmin-nél nem kisebb eleme (relatív 10⁻⁹ tűréssel, így pontos egyezésnél az adott érték). Ha Pmin nagyobb a sor legnagyobb eleménél (600 W), javaslat nincs: a fő eredmény a szükséges teljesítmény, és figyelmeztetés jelenik meg: „Ehhez a terheléshez egy tápegység helyett több szakaszra bontott betáplálás javasolt.”',
    'A teljesítménysor gyártónként eltér, ezért „jellemző érték”; nagy terhelésnél egy tápegység helyett a szakaszolás a szokásos megoldás.',
    `5 m × 16 W/m, 25%: Pmin = 80 · 1,25 = ${hu(e4.Pmin)} W → ${e4.psu} W (pontos egyezés). 50 m × 14,4 W/m, 24 V, 20%: P = ${hu(e3.P)} W, Pmin = ${hu(e3.Pmin)} W > 600 W → javaslat nincs, figyelmeztetés.`,
    PSU_SIZES.source,
    [calc('led-szalag-tapegyseg',{L:'5',pm:'16',U:'24',r:'25'},{Pmin:e4.Pmin,psu:e4.psu}),calc('led-szalag-tapegyseg',{L:'50',pm:'14,4',U:'24',r:'20'},{P:e3.P,Pmin:e3.Pmin,psu:null,primary:'Pmin',issue:'több szakaszra bontott betáplálás'})]),
   rule('KAL-LED-SZALAG-TAPEGYSEG-D2','Betáplálási tájékoztatás',
    'Ha a szalaghossz a KAL-LED-SZALAG-TAPEGYSEG-BETAP szerinti távolságnál nagyobb, tájékoztató sor jelenik meg: a feszültségesés miatt a túlsó vég halványabb lehet, és a szalagfeszültségtől függően jellemzően ennyi méterenként javasolt betáplálni – a gyártói adatlap az irányadó. 24 V felett csak az adatlapra utal.',
    'A szalag menti feszültségesést a kalkulátor nem számolja (Nem vizsgált); a tájékoztató sor csak felhívja rá a figyelmet.',
    `10 m, 12 V: 10 m > 5 m → „…12 V-os szalagnál jellemzően 5 m-enként javasolt betáplálni…”. 5 m, 24 V: 5 m ≤ 10 m → nincs tájékoztató sor.`,
    '– (programozott tájékoztató érték)',
    [calc('led-szalag-tapegyseg',{L:'10',pm:'9,6',U:'12',r:'20'},{issue:'5 m-enként javasolt betáplálni'}),calc('led-szalag-tapegyseg',{L:'5',pm:'14,4',U:'24',r:'20'},{issues:0})],
    'Elfogadhatók-e a programozott betáplálási távolságok (KAL-LED-SZALAG-TAPEGYSEG-BETAP) és a 20%-os tartalék-alapérték tájékoztató értékként?'),
  ]});

 // ---- Fázisjavítás
 const tan=(c:number)=>Math.sqrt(1-c*c)/c,w=2*Math.PI*50,t1=tan(0.7),t2=tan(0.95),qc=10000*(t1-t2),cD=qc/(3*w*400*400),cY=qc/(w*400*400),fi1=10000/(S3*400*0.7),fi2=10000/(S3*400*0.95);
 const t6=tan(0.6),qc1=1000*(t6-t2),c1=qc1/(w*230*230),j1=1000/(230*0.6),j2=1000/(230*0.95);
 const fzIn={P:'10','P.e':'kW',cos1:'0,7',cos2:'0,95',kotes:'delta',Uv:'400',f:'50'};
 const fazis=kalBlock('fazisjavitas',{
  rules:[
   rule('KAL-FAZISJAVITAS-K1','Kondenzátorteljesítmény',
    'Qc = P · (tan φ1 − tan φ2), tan φ = √(1 − cos² φ) / cos φ; P a hatásos teljesítmény, cos φ1 a jelenlegi, cos φ2 a kívánt teljesítménytényező.',
    'A hatásos teljesítmény a kompenzálás előtt és után azonos; a meddőteljesítmény Q = P · tan φ, így a kondenzátornak a különbséget kell fedeznie.',
    `P = 10 kW, cos φ1 = 0,7 → tan φ1 = ${hu(t1,5)}; cos φ2 = 0,95 → tan φ2 = ${hu(t2,5)}; Qc = 10 000 · (${hu(t1,5)} − ${hu(t2,5)}) = ${hu(qc,2)} var.`,
    'Meddőteljesítmény-kompenzálás alapösszefüggése',
    [calc('fazisjavitas',fzIn,{Qc:qc})]),
   rule('KAL-FAZISJAVITAS-K2','Kapacitás kondenzátoronként és áramok',
    'Delta (Δ): C = Qc / (3 · ω · U²); csillag (Y): C = Qc / (ω · U²) (kondenzátoronként, U/√3 feszültségen); egyfázisú: C = Qc / (ω · U²); ω = 2π · f. Áram a kompenzálás előtt és után: I = P / (k · U · cos φ), k = √3 háromfázisnál (U a vonali feszültség), 1 egyfázisnál.',
    'Deltában minden kondenzátor a vonali feszültségre kapcsolódik és Qc/3-ot ad; csillagban a fázisfeszültségre, így ugyanahhoz a Qc-hez háromszoros kapacitás kell.',
    `Az előző Qc = ${hu(qc,2)} var, U = 400 V, f = 50 Hz, ω = ${hu(w,4)} 1/s: Δ: C = ${hu(qc,2)} / (3 · ${hu(w,4)} · 400²) = ${hu(cD*1e6,3)} µF; Y: C = ${hu(qc,2)} / (${hu(w,4)} · 400²) = ${hu(cY*1e6,3)} µF. I1 = 10 000 / (√3 · 400 · 0,7) = ${hu(fi1,3)} A; I2 = 10 000 / (√3 · 400 · 0,95) = ${hu(fi2,3)} A.`,
    'Váltakozó áramú alapösszefüggések (Q = U² · ω · C)',
    [calc('fazisjavitas',fzIn,{C:cD,I1:fi1,I2:fi2}),calc('fazisjavitas',{...fzIn,kotes:'csillag'},{C:cY,Qc:qc})]),
   rule('KAL-FAZISJAVITAS-K3','Egyfázisú fázisjavítás',
    'Ugyanaz a Qc-képlet (K1); C = Qc / (ω · U²), U a fázisfeszültség (alapértéke 230 V); I = P / (U · cos φ).',
    'Egyedi fogyasztó (pl. egyfázisú motor vagy előtétes lámpa) párhuzamos kondenzátora.',
    `P = 1 kW, cos φ1 = 0,6 → tan φ1 = ${hu(t6,5)}; cos φ2 = 0,95: Qc = 1000 · (${hu(t6,5)} − ${hu(t2,5)}) = ${hu(qc1,2)} var; C = ${hu(qc1,2)} / (${hu(w,4)} · 230²) = ${hu(c1*1e6,3)} µF; I1 = 1000 / (230 · 0,6) = ${hu(j1,3)} A; I2 = 1000 / (230 · 0,95) = ${hu(j2,3)} A.`,
    'Meddőteljesítmény-kompenzálás alapösszefüggése',
    [calc('fazisjavitas',{P:'1','P.e':'kW',cos1:'0,6',cos2:'0,95',kotes:'1f',U:'230',f:'50'},{Qc:qc1,C:c1,I1:j1,I2:j2})]),
   rule('KAL-FAZISJAVITAS-D1','Hibás cél és túlkompenzálás',
    'Ha a kívánt cos φ nem nagyobb a jelenleginél, nincs eredmény, a cos φ2 mező alatt: „A kívánt cos φ legyen nagyobb a jelenleginél.” Ha a cél 0,98 fölött van (0,98-nál még nem), figyelmeztetés: „0,98 fölötti cél esetén kis terhelésnél túlkompenzálás (kapacitív üzem) léphet fel; jellemzően fokozatszabályozott telep kell.”',
    'Fázisrontó irányú vagy nulla kompenzálásnak nincs értelme; a teljes kompenzálás közelében kis terhelésnél a hálózat kapacitívvá válhat.',
    `cos φ1 = cos φ2 = 0,9 → hiba; 0,7 → 0,99: Qc = 10 000 · (${hu(t1,5)} − ${hu(tan(0.99),5)}) = ${hu(10000*(t1-tan(0.99)),2)} var, figyelmeztetéssel; 0,7 → 0,98: figyelmeztetés nélkül.`,
    '– (programozott döntés)',
    [calc('fazisjavitas',{...fzIn,cos1:'0,9',cos2:'0,9'},{ok:false,errorField:'cos2',error:'A kívánt cos φ legyen nagyobb a jelenleginél.'}),calc('fazisjavitas',{...fzIn,cos2:'0,99'},{Qc:10000*(t1-tan(0.99)),issue:'túlkompenzálás'}),calc('fazisjavitas',{...fzIn,cos2:'0,98'},{issues:0})]),
  ]});

 // ---- Keresztmetszet-választás
 const pick=(In:number,m:InstallMethod,loaded:2|3,kt:number,kg:number)=>T.sections.find(s=>le(In,iz0(loaded,m,s)*kt*kg))??null;
 const kt33=kTemp(33),kc3=kGroup(3),a20=pick(20,'B2',2,1,1),a20g=pick(20,'B2',2,1,kc3.value),a25=pick(25,'B2',2,kt33.value,1),a32=pick(32,'C',3,1,1),aBig=pick(125,'A2',3,1,1);
 const kerIn={In:'20',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1'};
 const ker=kalBlock('keresztmetszet',{
  rules:[
   rule('KAL-KERESZTMETSZET-K1','Javított terhelhetőség és a legkisebb keresztmetszet',
    'Iz = Iz0 · kθ · kcs (K-IZ), Iz0 a szerelési mód, a szigetelés, a terhelt erek száma és a keresztmetszet szerint (T-PVC2, T-PVC3), kθ (T-KT), kcs (T-KCS). Eredmény: a T-KM-SOR legkisebb keresztmetszete, amelyre In ≤ Iz (relatív 10⁻⁹ tűréssel); ugyanaz a programfüggvény, mint a Méretezés fül keresztmetszet-javaslata (K-JAV). Mellékeredmény: Iz, Iz0, kθ, kcs és keresztmetszetenkénti táblázat („In ≤ Iz?” oszloppal).',
    'Az In ≤ Iz a túlterhelés elleni védelem feltétele (433.1); a kalkulátor bemenete a védelem névleges árama, ezért az Ib ≤ In feltételt nem vizsgálja (D1).',
    `In = 20 A, B2, PVC, 2 terhelt ér, 30 °C (kθ = 1, T-KT-30), 1 áramkör (kcs = 1, T-KCS-1): 1,5 mm²: Iz = ${exact(iz0(2,'B2',1.5))} A (T-PVC2-B2-1.5) < 20 A; 2,5 mm²: Iz = ${exact(iz0(2,'B2',2.5))} · 1 · 1 = ${exact(iz0(2,'B2',2.5))} A (T-PVC2-B2-2.5) ≥ 20 A → ${a20===null?'nincs':exact(a20)+' mm²'}. 3 áramkör együtt (kcs = ${exact(kc3.value)}, T-KCS-3): 2,5 mm²: ${exact(iz0(2,'B2',2.5))} · ${exact(kc3.value)} = ${hu(iz0(2,'B2',2.5)*kc3.value,3)} A < 20 A; 4 mm²: ${exact(iz0(2,'B2',4))} (T-PVC2-B2-4) · ${exact(kc3.value)} = ${hu(iz0(2,'B2',4)*kc3.value,3)} A ≥ 20 A → ${a20g===null?'nincs':exact(a20g)+' mm²'}.`,
    'T-PVC2-B2-1.5, T-PVC2-B2-2.5, T-PVC2-B2-4, T-KT-30, T-KCS-1, T-KCS-3 (1. rész); K-IZ, K-JAV (2. rész); '+SOURCES.overload.standard+' '+CLAUSES.overload,
    [calc('keresztmetszet',kerIn,{A:a20,Iz:iz0(2,'B2',2.5),Iz0:iz0(2,'B2',2.5),kt:1,kg:1}),calc('keresztmetszet',{...kerIn,csop:'3'},{A:a20g,Iz:iz0(2,'B2',4)*kc3.value,Iz0:iz0(2,'B2',4),kg:kc3.value})]),
   rule('KAL-KERESZTMETSZET-K2','Egyenlőség és hőmérsékleti lépcső',
    'A határon (In = Iz) a feltétel teljesül (D-TURES). A környezeti hőmérséklet a következő nagyobb vagy egyenlő lépcsőre kerekít, interpoláció nélkül (D-KEREK).',
    'A kedvezőtlenebb lépcső a biztonság javára téved; a pontos egyenlőség lebegőpontos hibával is teljesül.',
    `In = 32 A, C, 3 terhelt ér: 4 mm²: Iz0 = ${exact(iz0(3,'C',4))} A (T-PVC3-C-4) → 32 ${rel(32,iz0(3,'C',4))} ${exact(iz0(3,'C',4))} → ${a32===null?'nincs':exact(a32)+' mm²'}. In = 25 A, B2, 33 °C → ${kt33.step} °C, kθ = ${exact(kt33.value)} (T-KT-35): 2,5 mm²: ${exact(iz0(2,'B2',2.5))} (T-PVC2-B2-2.5) · ${exact(kt33.value)} = ${hu(iz0(2,'B2',2.5)*kt33.value,3)} A < 25 A; 4 mm²: ${exact(iz0(2,'B2',4))} (T-PVC2-B2-4) · ${exact(kt33.value)} = ${hu(iz0(2,'B2',4)*kt33.value,3)} A → ${a25===null?'nincs':exact(a25)+' mm²'}.`,
    'T-PVC3-C-4, T-PVC2-B2-2.5, T-PVC2-B2-4, T-KT-35 (1. rész); D-TURES, D-KEREK (2. rész)',
    [calc('keresztmetszet',{In:'32',mod:'C',szig:'PVC',erek:'3',temp:'30',csop:'1'},{A:a32,Iz:iz0(3,'C',4)}),calc('keresztmetszet',{In:'25',mod:'B2',szig:'PVC',erek:'2',temp:'33',csop:'1'},{A:a25,kt:kt33.value,Iz:iz0(2,'B2',4)*kt33.value})]),
   rule('KAL-KERESZTMETSZET-D1','Nincs elegendő keresztmetszet; csak In ≤ Iz',
    `Ha a T-KM-SOR legnagyobb (${exact(T.sections[T.sections.length-1])} mm²) keresztmetszete sem elegendő, nincs eredmény, az In mező alatt: „A segédszámítás táblázatában (legfeljebb ${exact(T.sections[T.sections.length-1])} mm²) nincs olyan keresztmetszet, amely ezzel a szerelési móddal elegendő. …”. A kalkulátor csak az In ≤ Iz feltételt vizsgálja (az I2 feltétel kismegszakítónál ezzel együtt teljesül, K-I2); a feszültségesést, a hurokimpedanciát és az Ib ≤ In-t nem – ezt a feltételezés-sor kimondja. A legkisebb keresztmetszet a táblázat első sora (${exact(T.sections[0])} mm², T-K-AMIN).`,
    'Nagyobb keresztmetszetre a táblázat nem tartalmaz értéket; a többi feltételt a Feszültségesés, a Hurokimpedancia és a Kismegszakító-választás kalkulátor vizsgálja.',
    `In = 125 A, A2, 3 terhelt ér, 30 °C: ${exact(T.sections[T.sections.length-1])} mm²: Iz0 = ${exact(iz0(3,'A2',T.sections[T.sections.length-1]))} A < 125 A → ${aBig===null?'nincs eredmény (hibaüzenet)':exact(aBig)+' mm²'}.`,
    `T-PVC3-A2-${exact(T.sections[T.sections.length-1])}, T-K-AMIN (1. rész); K-I2 (2. rész)`,
    [calc('keresztmetszet',{In:'125',mod:'A2',szig:'PVC',erek:'3',temp:'30',csop:'1'},{ok:false,errorField:'In',error:'nincs olyan keresztmetszet'}),calc('keresztmetszet',kerIn,{assumption:'Csak a túlterhelés elleni védelem feltétele (In ≤ Iz)'})]),
   rule('KAL-KERESZTMETSZET-D2','XLPE-szigetelés',
    'XLPE választásakor a D-XLPE szerint számol: PVC Iz0, PVC kθ-sor, 30 °C alatt kθ = 1; erről feltételezés-sor jelenik meg.',
    'Amíg az XLPE-táblázat nincs rögzítve (T-XLPE-IZ0, T-XLPE-KT), a kedvezőtlenebb PVC-értékkel számol (D-XLPE).',
    `In = 20 A, XLPE, B2, 25 °C: kθ = 1 (a PVC-sor ${exact(kTemp(25).value)} értéke helyett) → 2,5 mm², Iz = ${exact(iz0(2,'B2',2.5))} A (PVC-érték).`,
    'T-XLPE-IZ0, T-XLPE-KT (1. rész); D-XLPE (2. rész)',
    [calc('keresztmetszet',{...kerIn,szig:'XLPE',temp:'25'},{A:2.5,kt:Math.min(1,kTemp(25).value),Iz:iz0(2,'B2',2.5),assumption:'XLPE-szigetelés'})]),
  ]});

 // ---- Kismegszakító-választás
 const mcb=(Ib:number,iz:number)=>MCB_RATINGS.value.filter(r=>le(Ib,r)&&le(r,iz));
 const izK1=iz0(2,'B2',2.5),cand1=mcb(14,izK1),izK2=iz0(2,'B2',1.5),cand2=mcb(10,izK2),cand3=mcb(22,izK1),cand4=mcb(16,izK1);
 const kisIn={Ib:'14',A:'2.5',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1',gorbe:'B'};
 const kis=kalBlock('kismegszakito',{
  rules:[
   rule('KAL-KISMEGSZAKITO-K1','Névleges áram: Ib ≤ In ≤ Iz',
    'Iz = Iz0 · kθ · kcs a választott keresztmetszetre (K-IZ). A választható névleges áramok a KAL-KOZOS-MCB sor azon elemei, amelyekre Ib ≤ In ≤ Iz (relatív 10⁻⁹ tűréssel); eredmény a legkisebb (fő eredmény, a jelleggörbével, pl. „B16”) és a legnagyobb ilyen érték.',
    'A 433.1 (1) feltétel (K-TUL) az előnyös értéksorra alkalmazva; a legkisebb választható In a legnagyobb tartalékot hagyja a vezetékre.',
    `Ib = 14 A, 2,5 mm², B2, PVC, 2 terhelt ér, 30 °C, 1 áramkör: Iz = ${exact(izK1)} A (T-PVC2-B2-2.5, kθ = kcs = 1); 14 ≤ In ≤ ${exact(izK1)} → ${cand1.join(', ')} A → In = ${cand1[0]} A (legfeljebb ${cand1[cand1.length-1]} A). Ib = 10 A, 1,5 mm²: Iz = ${exact(izK2)} A (T-PVC2-B2-1.5) → ${cand2.join(', ')} A → In = ${cand2[0]} A (legfeljebb ${cand2[cand2.length-1]} A).`,
    'KAL-KOZOS-MCB; T-PVC2-B2-2.5, T-PVC2-B2-1.5 (1. rész); K-IZ, K-TUL (2. rész)',
    [calc('kismegszakito',kisIn,{In:cand1[0],InMax:cand1[cand1.length-1],Iz:izK1,'text:In':'B'+cand1[0]+' ('+cand1[0]+' A)'}),calc('kismegszakito',{...kisIn,Ib:'10',A:'1.5',gorbe:'C'},{In:cand2[0],InMax:cand2[cand2.length-1],Iz:izK2})]),
   rule('KAL-KISMEGSZAKITO-K2','Kioldási áram és megengedett hurokimpedancia',
    `I2 = k · In (T-K-I2, k = ${K2}); a feltétel I2 ≤ ${K2} · Iz kismegszakítónál az In ≤ Iz-vel együtt teljesül (K-I2), a levezetés ezt külön sorban írja ki. Zs,max = cmin · U0 / (m · In) a legkisebb választható In-re (K-ZS), m a jelleggörbe szerint (T-K-M-B, T-K-M-C, T-K-M-D).`,
    'A hurokimpedancia-határ a választott védelemhez tartozik; a tényleges Zs-t a kalkulátor nem ismeri, ezért a verdikt felhívja a mérésre vagy számításra (Hurokimpedancia kalkulátor).',
    `B16: I2 = ${K2} · 16 = ${hu(k*16,2)} A; Zs,max = ${exact(T.cmin)} · ${exact(T.u0)} / (${exact(T.instantaneous.B)} · 16) = ${hu(zsMax('B',16),4)} Ω. C10: I2 = ${hu(k*10,2)} A; Zs,max = ${exact(T.cmin)} · ${exact(T.u0)} / (${exact(T.instantaneous.C)} · 10) = ${hu(zsMax('C',10),4)} Ω.`,
    'T-K-I2, T-K-CMIN, T-K-U0, T-K-M-B, T-K-M-C (1. rész); K-I2, K-ZS (2. rész)',
    [calc('kismegszakito',kisIn,{I2:k*16,ZsMax:zsMax('B',16),verdictText:'A hurokimpedanciát'}),calc('kismegszakito',{...kisIn,Ib:'10',A:'1.5',gorbe:'C'},{I2:k*10,ZsMax:zsMax('C',10)})],
    'A Zs,max a cmin tényezővel számol (T-K-CMIN); ha a lektor a T-K-CMIN kérdésre 0,95-öt ad meg, a kalkulátor értékei is változnak. Elfogadható-e, hogy a Zs,max csak a legkisebb választható In-re jelenik meg?'),
   rule('KAL-KISMEGSZAKITO-D1','Nincs választható névleges áram; egyenlőség',
    'Ha az előnyös sorban nincs Ib ≤ In ≤ Iz érték, a verdikt: „Számítás szerint nincs olyan előnyös névleges áram (MSZ EN 60898-1), amelyre … teljesül: nagyobb keresztmetszet, kedvezőbb szerelési mód vagy kisebb terhelés szükséges.”; ilyenkor csak Iz jelenik meg. Ib = In (és In = Iz) megengedett. A jelleggörbét a felhasználó választja; a bekapcsolási áramot a kalkulátor nem vizsgálja (feltételezés-sor).',
    'A megoldás kiválasztása (keresztmetszet, szerelési mód, terhelés) a tervező döntése, a kalkulátor csak a lehetőségeket nevezi meg.',
    `Ib = 22 A, 2,5 mm² (Iz = ${exact(izK1)} A): 22 ≤ In ≤ ${exact(izK1)} → ${cand3.length?cand3.join(', '):'nincs előnyös érték'}. Ib = 16 A: In = ${cand4[0]} A (16 ≤ 16).`,
    'KAL-KOZOS-MCB; T-PVC2-B2-2.5 (1. rész); D-TURES (2. rész)',
    [calc('kismegszakito',{...kisIn,Ib:'22'},{verdict:cand3.length>0,In:cand3.length?cand3[0]:null,Iz:izK1}),calc('kismegszakito',{...kisIn,Ib:'16'},{In:cand4[0]}),calc('kismegszakito',kisIn,{assumption:'A jelleggörbét a fogyasztó bekapcsolási árama határozza meg'})]),
  ]});

 // ---- Hurokimpedancia
 const hz=(Ze:number,L:number,A:number,Ape:number,curve:'B'|'C'|'D',In:number)=>{const R=loopR(L,A,Ape),Zs=Ze+R,max=zsMax(curve,In),per=T.rho1*(1/A+1/Ape);return {R,Zs,Ik:T.cmin*T.u0/Zs,max,per,Lmax:Math.max(0,(max-Ze)/per)}};
 const h1=hz(0.35,25,2.5,2.5,'B',16),h2=hz(0.5,40,1.5,1.5,'B',10),h3=hz(0.3,20,2.5,1.5,'B',16),h4=hz(0.35,100,1.5,1.5,'C',16),h5=hz(3,25,2.5,2.5,'B',16);
 const hurIn={Ze:'0,35',L:'25',A:'2,5',gorbe:'B',In:'16'};
 const hurok=kalBlock('hurokimpedancia',{
  rules:[
   rule('KAL-HUROKIMPEDANCIA-K1','Hurokimpedancia és zárlati áram',
    'R = ρ1 · L · (1/A + 1/A_PE) (K-ZS, ugyanaz a programfüggvény); Zs = Ze + R, ahol Ze a megadott hurokimpedancia az elosztónál; Ik = cmin · U0 / Zs. A_PE üresen = A.',
    'TN-rendszerben a hibahurok a fázis- és a védővezetőn záródik; a vezeték reaktanciáját a kalkulátor elhanyagolja (D-PE), ρ1 az üzemi hőmérsékletű érték (T-K-RHO1).',
    `Ze = 0,35 Ω, L = 25 m, A = A_PE = 2,5 mm²: R = ${exact(T.rho1)} · 25 · (1/2,5 + 1/2,5) = ${hu(h1.R,4)} Ω; Zs = 0,35 + ${hu(h1.R,4)} = ${hu(h1.Zs,4)} Ω; Ik = ${exact(T.cmin)} · ${exact(T.u0)} / ${hu(h1.Zs,4)} = ${hu(h1.Ik,2)} A. Ze = 0,5 Ω, 40 m, 1,5 mm²: R = ${exact(T.rho1)} · 40 · (2/1,5) = ${hu(h2.R,4)} Ω; Zs = ${hu(h2.Zs,4)} Ω; Ik = ${hu(h2.Ik,3)} A.`,
    'T-K-RHO1, T-K-CMIN, T-K-U0 (1. rész); K-ZS, D-PE (2. rész)',
    [calc('hurokimpedancia',hurIn,{Zs:h1.Zs,Ik:h1.Ik}),calc('hurokimpedancia',{Ze:'0,5',L:'40',A:'1,5',gorbe:'B',In:'10'},{Zs:h2.Zs,Ik:h2.Ik})]),
   rule('KAL-HUROKIMPEDANCIA-K2','Megengedett hurokimpedancia és legnagyobb hossz',
    'Zs,max = cmin · U0 / (m · In) (K-ZS; m: T-K-M-B, T-K-M-C, T-K-M-D; In a KAL-KOZOS-MCB sorból). Feltétel: Zs ≤ Zs,max (relatív 10⁻⁹ tűréssel). Lmax = max(0; (Zs,max − Ze) / (ρ1 · (1/A + 1/A_PE))), kiírás 0,1 m-re lefelé kerekítve.',
    'A pillanatkioldás felső határán (m · In) a kismegszakító a kikapcsolási időn belül old; az Lmax a feltétel átrendezése a hosszra.',
    `B16: Zs,max = ${exact(T.cmin)} · ${exact(T.u0)} / (${exact(T.instantaneous.B)} · 16) = ${hu(h1.max,4)} Ω; ${hu(h1.Zs,4)} ${rel(h1.Zs,h1.max)} ${hu(h1.max,4)} → „Számítás szerint a pillanatkioldás feltétele teljesül”; Lmax = (${hu(h1.max,4)} − 0,35) / (${exact(T.rho1)} · 0,8) = ${hu(h1.Lmax,4)} m → ${lenText(h1.Lmax)}. B10, Ze = 0,5 Ω, 1,5 mm²: Zs,max = ${hu(h2.max,4)} Ω; Lmax = (${hu(h2.max,4)} − 0,5) / ${hu(h2.per,4)} = ${hu(h2.Lmax,4)} m → ${lenText(h2.Lmax)}.`,
    'T-K-CMIN, T-K-U0, T-K-M-B (1. rész); K-ZS (2. rész)',
    [calc('hurokimpedancia',hurIn,{ZsMax:h1.max,Lmax:h1.Lmax,'text:Lmax':lenText(h1.Lmax),verdict:le(h1.Zs,h1.max)}),calc('hurokimpedancia',{Ze:'0,5',L:'40',A:'1,5',gorbe:'B',In:'10'},{ZsMax:h2.max,Lmax:h2.Lmax,'text:Lmax':lenText(h2.Lmax)})],
    'A számítás a cmin tényezővel fut (T-K-CMIN = '+exact(T.cmin)+'); ha a T-K-CMIN kérdésre adott válasz 0,95, a Zs,max, az Ik és az Lmax is változik.'),
   rule('KAL-HUROKIMPEDANCIA-D1','Nem teljesülő feltétel',
    'Ha Zs > Zs,max: „Számítás szerint a pillanatkioldás feltétele nem teljesül: … Lehetséges megoldás: nagyobb keresztmetszet, rövidebb vezeték, B jelleggörbe vagy ÁVK – a döntés a tervező feladata.” ÁVK-val védett áramkört és TT-rendszert a kalkulátor nem igazol (Mire nem).',
    'A kalkulátor nem dönti el, melyik megoldás alkalmazható; csak a lehetőségeket sorolja fel.',
    `Ze = 0,35 Ω, L = 100 m, A = 1,5 mm², C16: R = ${exact(T.rho1)} · 100 · (2/1,5) = ${hu(h4.R,4)} Ω; Zs = ${hu(h4.Zs,4)} Ω ${rel(h4.Zs,h4.max)} Zs,max = ${hu(h4.max,4)} Ω → nem teljesül; Lmax = (${hu(h4.max,4)} − 0,35) / ${hu(h4.per,4)} = ${hu(h4.Lmax,4)} m → ${lenText(h4.Lmax)}.`,
    'T-K-M-C (1. rész); K-ZS, D-AVK (2. rész)',
    [calc('hurokimpedancia',{Ze:'0,35',L:'100',A:'1,5',gorbe:'C',In:'16'},{Zs:h4.Zs,verdict:le(h4.Zs,h4.max),verdictText:'Lehetséges megoldás',Lmax:h4.Lmax})]),
   rule('KAL-HUROKIMPEDANCIA-D2','Csökkentett védővezető és túl nagy Ze',
    'A védővezető keresztmetszete külön megadható (A_PE); üresen a fázisvezetővel azonos. Ha már Ze ≥ Zs,max, figyelmeztetés: „Már az elosztónál mért hurokimpedancia is eléri a megengedett értéket: ezzel a védelemmel az áramkör nem rövidíthető le eléggé.”, és Lmax = 0. Ze = 0 is megadható.',
    'A tervező Méretezés füle a csökkentett PE-erű kábelt nem számolja (D-BLOKK, D-PE), a kalkulátor viszont a megadott A_PE-vel számol – a „Nem vizsgált” lista (D-HATOKOR) ugyanakkor a csökkentett N- vagy PE-eret is felsorolja.',
    `A = 2,5 mm², A_PE = 1,5 mm², L = 20 m, Ze = 0,3 Ω, B16: R = ${exact(T.rho1)} · 20 · (1/2,5 + 1/1,5) = ${hu(h3.R,4)} Ω; Zs = ${hu(h3.Zs,4)} Ω; Lmax = (${hu(h3.max,4)} − 0,3) / (${exact(T.rho1)} · (1/2,5 + 1/1,5)) = ${hu(h3.Lmax,3)} m → ${lenText(h3.Lmax)}. Ze = 3 Ω, B16 (Zs,max = ${hu(h5.max,4)} Ω): figyelmeztetés, Lmax = 0 m.`,
    'D-BLOKK, D-PE, D-HATOKOR (2. rész)',
    [calc('hurokimpedancia',{Ze:'0,3',L:'20',A:'2,5',Ape:'1,5',gorbe:'B',In:'16'},{Zs:h3.Zs,Ik:h3.Ik,Lmax:h3.Lmax,'text:Lmax':lenText(h3.Lmax)}),calc('hurokimpedancia',{...hurIn,Ze:'3'},{Lmax:0,'text:Lmax':'0 m',verdict:le(h5.Zs,h5.max),issue:'Már az elosztónál mért hurokimpedancia'}),calc('hurokimpedancia',{...hurIn,Ze:'0'},{Zs:h1.R})],
    'A „Nem vizsgált” lista a csökkentett keresztmetszetű N- vagy PE-eret is felsorolja, a kalkulátor pedig A_PE megadását engedi. Elfogadható-e ez így (a lista a méretezési segédszámítással közös), vagy a kalkulátor listáját módosítani kell?'),
  ]});

 // ---- Terhelhetőségi táblázat
 const kt35=kTemp(35),secId=(s:number)=>'s'+String(s).replace('.','_');
 const tIn={mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1'};
 const terh=kalBlock('terhelhetoseg-tablazat',{
  rules:[
   rule('KAL-TERHELHETOSEG-TABLAZAT-K1','Javított terhelhetőség keresztmetszetenként',
    'Minden T-KM-SOR keresztmetszetre Iz = Iz0 · kθ · kcs (K-IZ); a táblázat soronként az Iz0-t, az Iz-t és a forrást (táblázatszám, szerelési mód, keresztmetszet, terhelt erek, szigetelés, a táblázat állapota) mutatja. kθ és kcs egyszer, forrással.',
    'Áttekintő táblázat a választott körülményekre; az értékek ugyanazok, mint a Méretezés fülön és a Keresztmetszet-választásnál.',
    `B2, PVC, 2 terhelt ér, 30 °C, 1 áramkör: kθ = ${exact(kTemp(30).value)} (T-KT-30), kcs = ${exact(kGroup(1).value)} (T-KCS-1), így minden sorban Iz = Iz0, azaz a T-PVC2 tábla B2 oszlopa; például 2,5 mm²: Iz = ${exact(iz0(2,'B2',2.5))} · 1 · 1 = ${exact(iz0(2,'B2',2.5))} A (T-PVC2-B2-2.5). A teszt mind a ${T.sections.length} sort összeveti.`,
    'T-PVC2 (B2 oszlop), T-KT-30, T-KCS-1 (1. rész); K-IZ (2. rész)',
    [calc('terhelhetoseg-tablazat',tIn,{...Object.fromEntries(T.sections.map(s=>[secId(s),iz0(2,'B2',s)])),kt:1,kg:1})]),
   rule('KAL-TERHELHETOSEG-TABLAZAT-K2','Csökkentő tényezőkkel',
    'Ugyanaz a képlet (K1); a hőmérséklet a következő nagyobb vagy egyenlő lépcsőre, az áramkörszám a következő nagyobb vagy egyenlő oszlopra kerekít (D-KEREK). Háromfázisnál (3 terhelt ér) a T-PVC3 sorai.',
    'A kedvezőtlenebb lépcső a biztonság javára téved.',
    `B2, 35 °C, 3 áramkör: kθ = ${exact(kt35.value)} (T-KT-35), kcs = ${exact(kc3.value)} (T-KCS-3), kθ · kcs = ${hu(kt35.value*kc3.value,4)}: 1,5 mm²: ${exact(iz0(2,'B2',1.5))} (T-PVC2-B2-1.5) · ${hu(kt35.value*kc3.value,4)} = ${hu(iz0(2,'B2',1.5)*kt35.value*kc3.value,4)} A; 2,5 mm²: ${exact(iz0(2,'B2',2.5))} (T-PVC2-B2-2.5) · ${hu(kt35.value*kc3.value,4)} = ${hu(iz0(2,'B2',2.5)*kt35.value*kc3.value,4)} A; ${exact(T.sections[T.sections.length-1])} mm²: ${exact(iz0(2,'B2',T.sections[T.sections.length-1]))} (T-PVC2-B2-${exact(T.sections[T.sections.length-1])}) · ${hu(kt35.value*kc3.value,4)} = ${hu(iz0(2,'B2',T.sections[T.sections.length-1])*kt35.value*kc3.value,4)} A. C, 3 terhelt ér, 30 °C (kθ = kcs = 1): 1,5 mm²: Iz = Iz0 (T-PVC3-C-1.5); 6 mm²: Iz = Iz0 (T-PVC3-C-6).`,
    `T-KT-35, T-KCS-3, T-PVC2-B2-1.5, T-PVC2-B2-2.5, T-PVC2-B2-${exact(T.sections[T.sections.length-1])}, T-PVC3-C-1.5, T-PVC3-C-6 (1. rész); D-KEREK (2. rész)`,
    [calc('terhelhetoseg-tablazat',{...tIn,temp:'35',csop:'3'},{s1_5:iz0(2,'B2',1.5)*kt35.value*kc3.value,s2_5:iz0(2,'B2',2.5)*kt35.value*kc3.value,[secId(T.sections[T.sections.length-1])]:iz0(2,'B2',T.sections[T.sections.length-1])*kt35.value*kc3.value,kt:kt35.value,kg:kc3.value}),
     calc('terhelhetoseg-tablazat',{mod:'C',szig:'PVC',erek:'3',temp:'30',csop:'1'},{s1_5:iz0(3,'C',1.5),s6:iz0(3,'C',6)})]),
   rule('KAL-TERHELHETOSEG-TABLAZAT-D1','XLPE és a forrásoszlop',
    'XLPE választásakor a D-XLPE szerint PVC-értékekkel számol (30 °C alatt kθ = 1), erről feltételezés-sor jelenik meg. A forrásoszlop a táblázat állapotát is kiírja („ellenőrizendő” az 1. rész jóváhagyásáig, utána „jóváhagyott”).',
    'A felhasználó minden értéknél lássa, hogy a táblázatérték jóváhagyott-e.',
    `XLPE, B2, 2 terhelt ér, 25 °C: kθ = 1 → 2,5 mm²: ${exact(iz0(2,'B2',2.5))} A (PVC-érték).`,
    'T-XLPE-IZ0, T-XLPE-KT (1. rész); D-XLPE (2. rész)',
    [calc('terhelhetoseg-tablazat',{...tIn,szig:'XLPE',temp:'25'},{s2_5:iz0(2,'B2',2.5),kt:Math.min(1,kTemp(25).value),assumption:'XLPE-szigetelés'})]),
  ]});

 const blocks=[kozos,fesz,motor,ledB,fazis,ker,kis,hurok,terh];
 if(blocks.length!==T1_ORDER.length+1)throw Error('A 3. rész blokkjai hiányosak');
 return {no:3,title:'Szabványhoz kötött kalkulátorok (T1)',blocks,intro:[
  'A Villanyszerelő Tudástár szabványhoz vagy biztonsághoz kötött (T1) kalkulátorai csak szakmai lektori jóváhagyás után jelennek meg. Kalkulátoronként egy blokk: cél és kiadási adatok, mire jó és mire nem, a „Nem vizsgált” lista, a képletek a kalkulátoroldalon megjelenő alakban, a feltételezések, a bemenetek érvényességi tartománya, a felhasznált állandók forrással, majd a képletek behelyettesíthető alakban és a programozott döntések, kézzel számolt példákkal. A közös működést (számbevitel, kiírás, szóhasználat, figyelmeztetések) a KAL-KOZOS blokk írja le.',
  'A táblázatértékekre (ρ1, λ, U0, Iz0, kθ, kcs, G.52.1 határok, m, cmin, I2/In) csak az 1. rész azonosítójával hivatkozunk: ezek helyességét az 1. rész jóváhagyása fedi, itt nem kell újra összevetni. Ahol a kalkulátor a méretezési segédszámítás programfüggvényét használja, a blokk a 2. rész tételére is hivatkozik.',
  'Minden példát és bemeneti korlátot automatikus teszt vet össze a kalkulátor tényleges futtatásával (ugyanazzal a számítómotorral, amely a kalkulátoroldalon fut). A blokk elején álló tartalmi és forrás-ujjlenyomat azonosítja a jóváhagyott kalkulátort: a program csak az ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé, és ha a kalkulátor bármiben változik, új kiadás és új jóváhagyás kell. A jóváhagyás kalkulátoronként a Jóváhagyó lap „3. rész – kalkulátoronkénti döntés” táblázatában jelölhető.',
 ]};
}

// ---------------------------------------------------------------- 4–6. rész – helyőrzők
const placeholder=(no:number,title:string,prefix:string,text:string,planned:string[]):Part=>({no,title,intro:[text],blocks:[],placeholder:{prefix,planned}});
/**
 * A csomag részei, sorrendben. Új rész: cseréld le a helyőrzőt egy `() => Part` függvény eredményére
 * (blokkok, tételek egyedi azonosítóval). A helyőrző részek nem jóváhagyhatók.
 */
export const PARTS:((ctx:{notCovered:string[]})=>Part)[]=[
 ()=>tablesPart(),
 ({notCovered})=>formulasPart(notCovered),
 ()=>calculatorsPart(),
 ()=>placeholder(4,'Bekötési ábrák (R3)','ABR','A Sémák ábráinak elkészülte után kerül be: ábránként a kapcsolási rajz, a kapcsolóállás-táblázat és a kapocsjelölési megjegyzés. Biztonságkritikus (R3) tartalom: lektor és második olvasó hagyja jóvá.',
  ['101–107 kapcsolások','dugalj bekötése','földelési rendszerek és PEN-szétválasztás','áram-védőkapcsoló (FI-relé) bekötése']),
 ()=>placeholder(5,'Biztonsági cikkek (R3)','CIK','A Tudástár biztonsági (R3) cikkeinek elkészülte után kerül be: cikkenként az állítások, a figyelmeztetések és a források tételes listája.',
  ['a feszültségmentesítés öt szabálya','áram-védőkapcsoló (FI-relé) alapjai','kismegszakító (B/C/D) és Ib ≤ In ≤ Iz','földelési rendszerek']),
 ()=>placeholder(6,'Vizsgakérdések','VK','A vizsgaszimuláció kérdésbankjának elkészülte után kerül be (szakoktatóval vagy vizsgáztatóval együtt): kérdésenként a helyes válasz, a disztraktorok és az indoklás.',
  ['villanyszerelő szakmai kérdésbank']),
];

// ---------------------------------------------------------------- Programmal való összevetés jelölése
const CHECK_KINDS:Record<ProgramCheck['fn'],string>={designCurrent:'képlet',correctedIz:'képlet',voltageDropPercent:'képlet',loopResistance:'képlet',maxLoopImpedance:'képlet',maxLengthForDrop:'képlet',minSectionFor:'keresztmetszet-javaslat',atMost:'összehasonlítás',parseCable:'kábeljelölés',temperatureFactor:'táblázati lépcső',groupingFactor:'táblázati lépcső',circuitSizing:'mintaterv-számítás',schema:'bemeneti korlát',notCovered:'a program listája',labels:'a program címkéi',calc:'kalkulátor-futtatás',calcField:'bemeneti korlát',calcNotCovered:'a program listája'};
/** Az „Összevetés” sor szövege: hány esetet és milyen módon vet össze automatikus teszt a programmal. */
export function verifiedText(checks:readonly ProgramCheck[]|undefined):string{
 if(!checks?.length)return 'Programmal összevetve: nem – a tételt csak ez a leírás rögzíti.';
 return `Programmal összevetve: igen – ${checks.length} eset (${[...new Set(checks.map(c=>CHECK_KINDS[c.fn]))].join(', ')}), automatikus tesztben.`;
}

// ---------------------------------------------------------------- Közös szövegek (Markdown és PDF)
type Para={kind:'p';text:string}|{kind:'ul'|'ol';items:string[]}|{kind:'table';headers:string[];widths:number[];rows:string[][];right?:number[];ids?:number[]};
type Section={title:string;body:Para[]};
const P=(text:string):Para=>({kind:'p',text});
/** A jóváhagyás megjelenő szövege a programban, jóváhagyás után – a reviewText() pontos szövegével, helyőrzőkkel: a jóváhagyó
 * hozzájárulásával névvel (showName: true), anélkül név nélkül. */
export const approvedTexts=()=>{
 const r:SizingReview={status:'jóváhagyott',reviewer:'[név]',registry:'[névjegyzéki szám]',date:'[dátum]',fingerprint:tablesFingerprint(),showName:true,note:''};
 return {named:reviewText(r),anonymous:reviewText({...r,showName:false})};
};
/** A 3. rész jóváhagyott kalkulátorainak lektori jelölése a kalkulátoroldalon (jelvény; lábléc-sor) – a program pontos szövegével,
 * helyőrzőkkel: hozzájárulással névvel, anélkül a minősítéssel (lib/calc/registry.ts expertShown). */
export const calcBadgeTexts=()=>{
 const d=defOf(T1_ORDER[0]),r:ExpertReview={kind:'lektoralt',reviewer:'[név]',qualification:'[minősítés]',registry:'[névjegyzéki szám]',date:'[dátum]',fingerprint:calcFingerprint(d),source:'',showName:true};
 const text=(x:ExpertReview)=>releaseInfo(d,{[d.slug]:x},true).badge+'; '+expertMeta(x);
 return {named:text(r),anonymous:text({...r,showName:false})};
};
/** Ahol a reviewText() megjelenik (a tests/lektori-csomag.ts a forráskódból ellenőrzi, hogy új hely nem került be e felsorolás nélkül). */
export const NAME_PLACES=()=>`a tervező Méretezés fülén (Eszközök → Tervsegéd → Méretezés) minden felhasználónak; minden felhasználó exportált terv-PDF-jében, ha a méretezési táblákat bekapcsolja, az elosztóoldalak „méretezés indoklása” táblájának „Táblázatok – Állapot” sorában (ugyanennek a táblának az utolsó sora a terv tervezőjének „Tervezői ellenőrzés” aláírósora); a nyilvános, keresőkben is megtalálható kalkulátoroldalakon a táblázatokat használó kalkulátorok (${T1_ORDER.map(defOf).filter(d=>d.tables).map(d=>d.title).join(', ')}) „Táblázatok állapota” sorában és a Vezeték-ellenállás kalkulátor ρ1 szerinti tájékoztató sorában`;
const FORM={blockOk:'A blokk minden tétele egyezik',blockNote:'Megjegyzés a blokkhoz (forrás, kiadás)',fix:'Helyes érték / megjegyzés',question:'Kérdés a lektorhoz',verified:'Összevetés'};
/** A bevezető állandó szakaszai (a becsült ráfordítás nélkül; a csomag-ujjlenyomat része). */
function staticIntroSections():Section[]{
 return [
  {title:'Mi a Villanyrajz?',body:[
   P('A Villanyrajz magyar nyelvű, böngészőben futó villamos tervszerkesztő villanyszerelőknek és lakóépületek villamos tervezőinek: alaprajz, szerelvények, kábelnyomvonalak, lakáselosztó, anyaglista, árajánlat és PDF-tervdokumentáció.'),
   P(`A „Méretezési segédszámítás” áramkörönként tervezői ellenőrzést segítő, tájékoztató számítást készít: legkisebb keresztmetszet, Ib ≤ In ≤ Iz, I2 ≤ ${K2} · Iz, feszültségesés, és megadott Zs mellett hurokimpedancia. A számítás minden táblázatértéke és forrásmegjelölése a programban egy helyen van rögzítve; ez a csomag ezeket, valamint a képleteket és a programozott döntéseket gyűjti össze kódolvasás nélkül ellenőrizhető formában.`),
   P(`A Villanyszerelő Tudástár ingyenes, belépés nélkül használható kalkulátorai közül a szabványhoz vagy biztonsághoz kötöttek (T1: ${T1_ORDER.map(defOf).map(d=>d.title).join(', ')}) csak szakmai lektori jóváhagyás után jelennek meg. A táblázatokat és a méretezési képleteket a segédszámítással közösen használják; leírásuk a 3. részben van.`),
  ]},
  {title:'Mire használjuk a jóváhagyott tartalmat?',body:[{kind:'ul',items:[
   'Jóváhagyásig a program minden táblázatértéket „ellenőrizendő” állapotúként jelöl a felületen, a számítási sorokban és a PDF-ben.',
   `Jóváhagyás után ${NAME_PLACES()} a következő szöveg jelenik meg – a jóváhagyó kifejezett hozzájárulásával: „${approvedTexts().named}”; hozzájárulás nélkül: „${approvedTexts().anonymous}” A szöveg a táblázatértékek lektorálását jelzi, nem az adott terv jóváhagyását. A 3. részből jóváhagyott kalkulátorok oldalán (jelvény; lábléc-sor) hozzájárulással „${calcBadgeTexts().named}”, anélkül „${calcBadgeTexts().anonymous}” áll. A név csak hozzájárulással jelenik meg (Jóváhagyó lap); a jóváhagyás érvénye ettől nem függ.`,
   `A 3. rész T1 kalkulátorai kalkulátoronként, a jóváhagyott tartalmi és forrás-ujjlenyomattal rögzített lektori rekorddal jelennek meg a nyilvános kalkulátoroldalakon; a táblázat-kapus kalkulátorok (${T1_ORDER.filter(s=>TABLE_GATED.has(s)).map(s=>defOf(s).title).join(', ')}) ezen felül csak az 1. rész jóváhagyása után. Ha egy kalkulátor a jóváhagyás után bármiben változik, a program nem teszi közzé, illetve az automatikus teszt elbukik, amíg új jóváhagyás nem készül.`,
   'Az 1. rész jóváhagyása a programban ujjlenyomathoz kötött: ha később bármely táblázatérték, forrásmegjelölés, szabványpont vagy leírás megváltozik, a program automatikusan „ellenőrizendő” állapotra áll vissza.',
   'A 2. rész (képletek, döntések) jóváhagyását a program állapota nem követi. Ezt a fejlesztési folyamat biztosítja: jóváhagyott állapotban az automatikus teszt elbukik, ha a 2. rész a jóváhagyott ujjlenyomattól eltér; ilyenkor új kiadás és új jóváhagyás kell.',
  ]}]},
  {title:'Mit jelent a jóváhagyás – és mit nem?',body:[
   P('A jóváhagyás jelenti:'),
   {kind:'ul',items:[
    'az 1. rész értékei, táblázatszámai, kiadásai és leírásai a hivatkozott szabványok hatályos kiadásával egyeznek (vagy a lektor megadta a helyes értéket);',
    'a 2. rész képletei helyesek, és a programozott döntések, alapértékek iránya és jelölése elfogadható egy tervezői ellenőrzést segítő számításhoz;',
    'a 3. rész „Jóváhagyom” jelölésű kalkulátorainak képletei, bemeneti korlátai, alapértékei, figyelmeztetései és szóhasználata helyesek, illetve elfogadhatók egy tájékoztató, „számítás szerinti” kalkulátorhoz.',
   ]},
   P('A jóváhagyás nem jelenti:'),
   {kind:'ul',items:[
    'tervezői felelősségvállalást az egyes, a programmal készült tervekért vagy a kalkulátorokkal végzett egyes számításokért: az eredmény továbbra is „tervezői ellenőrzést segítő”, illetve „számítás szerinti” érték, nem tervezői méretezés; a tervért annak tervezője felel – a programban megjelenő jóváhagyási szöveg is csak a táblázatértékekre vonatkozik;',
    'a program egészének (forráskód, felület, más funkciók) vizsgálatát vagy minősítését;',
    'a felhasználó által megadott adatok (terhelés, hossz, szerelési mód, Zs, projekt-felülírás) helyességének igazolását, illetve a kész berendezés mérésének kiváltását;',
    'a hatókörön kívüli esetek (D-HATOKOR és a kalkulátorok „Nem vizsgált” listái) vizsgálatát, és a 4–6. részt, amely jelenleg helyőrző.',
   ]},
  ]},
  {title:'Hogyan kell kitölteni?',body:[{kind:'ol',items:[
   'A csomagot a hivatkozott szabványok hatályos kiadásával kell összevetni; a program kódjának olvasása nem szükséges.',
   `Tételenként: ✓ = az érték vagy állítás helyes; ✗ = eltér vagy hibás – ilyenkor a „${FORM.fix}” mezőbe a helyes értéket kérjük beírni. A forrást (szabvány, kiadás, pont vagy táblázat) blokkonként elég egyszer megadni, a blokk végén álló „${FORM.blockNote}” mezőben; ha egy tételé ettől eltér, a tételnél.`,
   `Gyorsítás: ha a blokk minden tétele egyezik, elég a blokk végén „${FORM.blockOk}” négyzetet jelölni; a tételeket nem kell egyenként pipálni. Ha bármelyik tétel eltér, a blokk négyzetét ne jelölje; az eltérő tételeket jelölje ✗-szel, a többi, pipálatlanul hagyott tétel egyezőnek számít. A terhelhetőségi táblák elején álló áttekintő mátrix soronként vethető össze a szabvány táblázatával.`,
   `A 2. és a 3. részben minden szabálytétel egy szabályt, indoklást és kézzel számolt példát tartalmaz; a példát érdemes újraszámolni. A „${FORM.question}” pontokra kérjük külön választ a megjegyzés mezőben.`,
   'A 3. részben a táblázatértékeket nem kell újra összevetni (az 1. rész azonosítóival hivatkozunk rájuk). A kalkulátorok kalkulátoronként hagyhatók jóvá (Jóváhagyó lap, „3. rész – kalkulátoronkénti döntés”). A kalkulátorok előnézetben ki is próbálhatók (a hozzáférést a megbízó adja), de a csomag önmagában is ellenőrizhető.',
   'Ha két forrás egy értékre eltérő számot ad, mindkettőt kérjük a megjegyzésbe írni a forrással; az érték a tisztázásig „ellenőrizendő” marad.',
   'Terjedelmesebb javítást (pl. egy teljes táblázat javasolt értékeit) külön mellékletben kérjük, a tételazonosítókra hivatkozva.',
   'Végül a Jóváhagyó lapot kell kitölteni és aláírni (a lapokat a láblécben szignálni), és a jelölt csomaggal együtt (papíron vagy szkennelve) visszaküldeni.',
  ]},P('A csomag belső munkaanyag, nem nyilvános. A benne szereplő számértékek a program jelenlegi értékei, amelyeket a szabvánnyal össze kell vetni; nem a szabvány szövegének másolatai.')]},
  {title:'Jelölések',body:[{kind:'ul',items:[
   'Ib – tervezett (terhelési) áram; In – a védelem névleges árama; I2 – a védelem megállapodás szerinti kioldóárama (a működést biztosító áram)',
   'Iz0 – táblázati terhelhetőség; Iz – javított terhelhetőség; kθ – hőmérsékleti tényező; kcs – csoportosítási tényező',
   'U0 – névleges fázis–föld feszültség; ΔU – feszültségesés; ρ1 – fajlagos ellenállás üzemi hőmérsékleten; λ – fajlagos reaktancia',
   'Zs – hibahurok-impedancia; m – a pillanatkioldás felső határának szorzója; cmin – feszültségtényező; A, A_PE – fázis- és védővezető-keresztmetszet',
   'MCB – kismegszakító; RCBO – túláramvédelemmel egybeépített áram-védőkapcsoló; ÁVK – áram-védőkapcsoló (FI-relé)',
   'Kalkulátoroknál: Ze – hurokimpedancia az elosztónál; Ik – zárlati (hiba-) áram; Lmax – legnagyobb hossz; η – hatásfok; Qc – kondenzátorteljesítmény; ω = 2π · f – körfrekvencia',
  ]}]},
 ];
}
const reviewable=(pkg:Package)=>pkg.parts.filter(p=>!p.placeholder);
const APPROVAL_MINUTES=10;
const minutes=(pkg:Package)=>reviewable(pkg).flatMap(p=>p.blocks).reduce((s,b)=>s+b.minutes,0)+APPROVAL_MINUTES;
function effortSection(pkg:Package):Section{
 const blocks=reviewable(pkg).flatMap(p=>p.blocks);
 return {title:'Becsült ráfordítás',body:[
  P('A becslés a szabványok kéznél lévő, hatályos kiadását és a csomag egyszeri átnézését feltételezi. Eltérések esetén a javított kiadás visszaellenőrzése (csak a változott tételek) külön kb. 15–30 perc.'),
  {kind:'table',headers:['Blokk','Tartalom','Tételek','Becsült idő'],widths:[34,90,20,30],right:[2,3],ids:[0],rows:[
   ...blocks.map(b=>[b.id,b.title,String(b.items.length),duration(b.minutes)]),
   ['–','Jóváhagyó lap kitöltése','–',duration(APPROVAL_MINUTES)],
   ['','Összesen',String(blocks.reduce((s,b)=>s+b.items.length,0)),'kb. '+duration(minutes(pkg))],
  ]},
 ]};
}
const introSections=(pkg:Package)=>[...staticIntroSections(),effortSection(pkg)];
/** A részek jelenlegi állapota (a csomag-ujjlenyomatnak nem része: jóváhagyás vagy kiadás rögzítése után sem kell új kiadás). */
const partStatus=(pkg:Package,no:number):string[]=>no===1?[
 `Jelenlegi állapot: ${pkg.approved?'jóváhagyott':'ellenőrizendő'}. Táblázatváltozat: ${pkg.tablesVersion}; táblázat-ujjlenyomat: ${pkg.fingerprints.tables}.`,
 'A rögzítés körülményei (a programban rögzített megjegyzés): '+pkg.review.note,
]:no===3?['Jelenlegi kiadási állapot: '+pkg.calcs.map(c=>`${c.title}: ${c.state}`).join('; ')+'.']:[];
const RELEASE_STATES:Record<string,string>={kozzeteve:'közzétéve',kiadatlan:'kiadatlan (lektori jóváhagyásra vár)',ujraellenorzendo:'újraellenőrzendő',['tablazatra-var']:'lektorálva, a táblázatok jóváhagyására vár',tiltott:'tiltott'};
const DECISIONS=['Az 1–2. részt eltérés nélkül jóváhagyom.','Az 1–2. részt a jelölt eltérések javítása után hagyom jóvá; a javított kiadás változott tételeit ellenőrzöm.','Az 1–2. részt nem hagyom jóvá (indoklás a megjegyzésben).'];
const CALC_DECISION_NOTE='A 3. rész kalkulátoronként hagyható jóvá. „Jóváhagyom”: a kalkulátor blokkja és a KAL-KOZOS blokk eltérés nélkül egyezik; a program a kalkulátort a sorban álló ujjlenyomat-párral rögzített lektori rekorddal teszi közzé, a táblázat-kapus kalkulátort csak az 1. rész jóváhagyása után. „Javítás után / nem”: a kalkulátor a javított kiadásban (a változott tételek ellenőrzése után) vagy egyáltalán nem hagyható jóvá; az okot kérjük a megjegyzésbe írni. Jelöletlen sor: nem jóváhagyott.';
const DECLARATION_TEMPLATE='Alulírott kijelentem, hogy a Villanyrajz lektori csomag ezen a lapon megjelölt, {oldal} oldalas kiadásának 1. (méretezési táblázatok), 2. (képletek és programozott döntések) és 3. (szabványhoz kötött kalkulátorok) részét a hivatkozott szabványok hatályos kiadásával összevetettem, és a tételeket a fenti döntés, valamint a kalkulátoronkénti döntés szerint jelöltem. A 3. részből kizárólag a kalkulátoronkénti döntésben „Jóváhagyom” jelölésű kalkulátorokat hagyom jóvá. A jóváhagyás kizárólag a csomagban, a megjelölt ujjlenyomatokkal azonosított tartalomra vonatkozik; nem minősül a programmal készült egyes tervekért vagy a kalkulátorokkal végzett egyes számításokért vállalt tervezői felelősségnek, és nem terjed ki a csomag 4–6. részére.';
export const declaration=(pages:number)=>DECLARATION_TEMPLATE.replace('{oldal}',String(pages));
const BINDING='Az 1. rész ujjlenyomatát a program maga ellenőrzi: eltérésnél „ellenőrizendő” állapotra áll vissza. A 2. rész ujjlenyomatát a fejlesztési folyamat automatikus tesztje veti össze a jóváhagyottal. A 3. részben kalkulátoronként a tartalmi és a forrás-ujjlenyomat kerül a kiadási rekordba: tartalmi eltérésnél a program a kalkulátort nem teszi közzé, forráseltérésnél az automatikus teszt elbukik. Bármelyik eltérésénél új kiadás és új jóváhagyás kell.';
const CONSENT=()=>`Hozzájárulok, hogy nevem, névjegyzéki számom és a jóváhagyás dátuma ${NAME_PLACES()} – ezzel a szöveggel megjelenjen: „${approvedTexts().named}”; továbbá hogy a 3. részből általam jóváhagyott kalkulátorok oldalán nevem és minősítésem így megjelenjen: „${calcBadgeTexts().named}”. Hozzájárulás hiányában a program a nevem nélkül jelzi a lektorálást: „${approvedTexts().anonymous}”, illetve „${calcBadgeTexts().anonymous}”. A jóváhagyás érvénye a hozzájárulástól nem függ.`;
const FIELDS=['Jóváhagyó neve','Kamarai / névjegyzéki szám','Jogosultság megnevezése','Hely','Dátum','Aláírás'];
const FIELD_HINT='Jogosultság például: épületvillamossági tervező (MMK-névjegyzék) vagy érintésvédelmi szabványossági felülvizsgáló.';
const DEVIATION_STEPS=[
 `A lektor az eltérő tételt ✗-szel jelöli, és a „${FORM.fix}” mezőbe beírja a helyes értéket; a forrást (szabvány, kiadás, pont vagy táblázat) a „${FORM.blockNote}” mezőben vagy a tételnél adja meg.`,
 'A Jóváhagyó lapon az 1–2. résznél a második lehetőséget („javítás után hagyom jóvá”), a 3. résznél az érintett kalkulátor sorában a „Javítás után / nem” négyzetet jelöli, és aláírja. Az eltéréssel érintett részre, illetve kalkulátorra ennél a kiadásnál jóváhagyás nem rögzíthető: a jóváhagyás mindig egy pontos ujjlenyomathoz tartozik.',
 'A fejlesztő a javításokat a programban bevezeti, és új kiadást (új csomagverzió és ujjlenyomatok) készít; a változott tételek listáját megküldi a lektornak.',
 'A lektor csak a változott tételeket ellenőrzi, és az új kiadás Jóváhagyó lapját írja alá; a program ennek ujjlenyomatait rögzíti.',
 'Ha két forrás vagy két ellenőr eltérő értéket ad, mindkét érték a forrásával a megjegyzésbe kerül; az érték a tisztázásig „ellenőrizendő” marad.',
 'Biztonsági jelentőségű hibát (pl. a valósnál nagyobb terhelhetőség, kisebb feszültségesés vagy nagyobb megengedett hurokimpedancia) kérjük a csomag visszaküldése előtt is haladéktalanul jelezni a megbízónak; a program ilyenkor a jóváhagyásig változatlanul „ellenőrizendő” jelölést mutat.',
];
const COVER_NOTE='Belső munkaanyag a szakmai lektor részére – nem nyilvános. A csomagot a program generálja; a táblázatértékek a program jelenlegi értékei, amelyeket a szabvánnyal kell összevetni.';
/** A tételeken kívüli, a csomagban megjelenő összes szöveg (bevezető, űrlapelemek, jóváhagyó lap) – a csomag-ujjlenyomat része. */
export const packageTexts=()=>({title:TITLE,subtitle:SUBTITLE,cover:COVER_NOTE,intro:staticIntroSections(),form:FORM,approval:{decisions:DECISIONS,calcNote:CALC_DECISION_NOTE,declaration:DECLARATION_TEMPLATE,binding:BINDING,consent:CONSENT(),fields:FIELDS,hint:FIELD_HINT,deviation:DEVIATION_STEPS}});

// ---------------------------------------------------------------- Csomag
/** Az ujjlenyomat a megjelenő tartalomra (azonosítók, szövegek, értékek, mátrixok, kérdések, összevetés-jelölés); a jóváhagyási állapot, a becsült idő és az oldalszám nem része. */
const projectItem=(i:Item)=>i.kind==='value'?{id:i.id,label:i.label,value:i.value,verified:i.checks?verifiedText(i.checks):null}:{id:i.id,title:i.title,rule:i.rule,rationale:i.rationale,example:i.example,question:i.question??null,source:i.source,verified:verifiedText(i.checks)};
const project=(parts:Part[])=>parts.map(p=>({no:p.no,title:p.title,intro:p.intro,placeholder:p.placeholder??null,blocks:p.blocks.map(b=>({id:b.id,title:b.title,source:b.source,intro:b.intro,columns:b.columns??null,matrix:b.matrix??null,questions:b.questions??null,items:b.items.map(projectItem)}))}));
export const partFingerprint=(part:Part)=>fingerprint(project([part]));
export const contentFingerprint=(parts:Part[],texts:unknown=packageTexts())=>fingerprint({parts:project(parts),texts});
export function buildPackage():Package{
 const notCovered=[...SIZING_NOT_COVERED],parts=PARTS.map(f=>f({notCovered}));
 const formulas=parts.find(p=>p.no===2)!,calculators=parts.find(p=>p.no===3)!;
 const calcs=T1_ORDER.map(slug=>{const d=defOf(slug);return {slug,title:d.title,id:kalId(slug),fingerprint:calcFingerprint(d),source:sourceFingerprint(slug),gated:TABLE_GATED.has(slug),state:RELEASE_STATES[releaseInfo(d).state]}});
 return {edition:EDITION,parts,notCovered,review:SIZING_REVIEW,approved:tablesApproved(),tablesVersion:T.version,calcs,
  fingerprints:{tables:tablesFingerprint(),formulas:partFingerprint(formulas),calculators:partFingerprint(calculators),content:contentFingerprint(parts)}};
}
export const allItems=(pkg:Package)=>pkg.parts.flatMap(p=>p.blocks.flatMap(b=>b.items));
export const allIds=(pkg:Package)=>[...pkg.parts.flatMap(p=>p.blocks.map(b=>b.id)),...allItems(pkg).map(i=>i.id)];
/** Az azonosítók előtagjai: 1. rész T, F, SZP, L; 2. rész K, D; a helyőrző részek előtagjai előre lefoglalva. */
export const ID_PREFIXES=['T','F','SZP','L','K','D','KAL','ABR','CIK','VK'] as const;
/** Azonosító-hivatkozások a szövegekben (pl. „T-PVC2-B2-2.5”, „D-XLPE”). */
export const ID_REF=new RegExp(`(?<![\\p{L}\\d-])(?:${ID_PREFIXES.join('|')})-[A-Z0-9](?:[A-Z0-9.-]*[A-Z0-9])?(?![\\p{L}\\d])`,'gu');
/** A levelek (szám, szöveg vagy null) útvonalai, pontokkal elválasztva. */
export function leafPaths(v:unknown,prefix=''):Path[]{
 if(v!==null&&typeof v==='object')return Object.entries(v as Record<string,unknown>).flatMap(([k,x])=>leafPaths(x,prefix?prefix+'.'+k:k));
 return [prefix];
}
/** A csomag belső hibái: lefedetlen jóváhagyandó tartalom, ismétlődő vagy nem létező azonosító. Üres lista: rendben. */
export function packageProblems(pkg:Package,content:unknown):string[]{
 const problems:string[]=[],ids=allIds(pkg),seen=new Set<string>();
 for(const id of ids){if(seen.has(id))problems.push('Ismétlődő azonosító: '+id);seen.add(id)}
 const covered=new Set([...META_PATHS,...allItems(pkg).flatMap(i=>i.kind==='value'?i.paths:[])]);
 for(const p of leafPaths(content))if(!covered.has(p))problems.push('A csomag nem tartalmazza: '+p);
 for(const i of allItems(pkg)){
  const text=i.kind==='value'?i.label+' '+i.value:[i.rule,i.rationale,i.example,i.question??'',i.source].join(' ');
  for(const ref of text.match(ID_REF)??[])if(!seen.has(ref))problems.push(`${i.id}: nem létező azonosítóra hivatkozik: ${ref}`);
 }
 for(const b of pkg.parts.flatMap(p=>p.blocks))for(const ref of [...b.intro,b.source,...(b.questions??[]).flatMap(q=>[q.id,q.text])].join(' ').match(ID_REF)??[])if(!seen.has(ref))problems.push(`${b.id}: nem létező azonosítóra hivatkozik: ${ref}`);
 for(const ref of JSON.stringify(packageTexts()).match(ID_REF)??[])if(!seen.has(ref))problems.push(`Bevezető vagy jóváhagyó lap: nem létező azonosítóra hivatkozik: ${ref}`);
 return problems;
}
function metaRows(pkg:Package):[string,string][]{
 const c=reviewable(pkg).map(p=>({no:p.no,n:p.blocks.reduce((s,b)=>s+b.items.length,0)})),r=pkg.review;
 return [
  ['Csomagverzió',editionLabel(pkg.edition)],
  ['Csomag-ujjlenyomat',pkg.fingerprints.content+' (a csomag teljes szövegéé: bevezető, tételek, jóváhagyó lap)'],
  ['Táblázatváltozat',pkg.tablesVersion],
  ['1. rész – táblázat-ujjlenyomat',pkg.fingerprints.tables+' (ehhez köti a program a jóváhagyást)'],
  ['2. rész – képlet-ujjlenyomat',pkg.fingerprints.formulas+' (a fejlesztési folyamat automatikus tesztje ellenőrzi)'],
  ['3. rész – kalkulátor-ujjlenyomat',pkg.fingerprints.calculators+' (a 3. rész egészéé; kalkulátoronként: a döntési táblázatban)'],
  ['Jóváhagyási állapot (1. rész)',pkg.approved?`jóváhagyott – ${r.reviewer} (${r.registry}), ${r.date}; a név megjelenik a programban: ${r.showName?'igen':'nem'}`:'ellenőrizendő – jogosult tervező még nem hagyta jóvá'],
  ['Ellenőrizendő tételek',c.map(x=>`${x.no}. rész: ${x.n}`).join('; ')+` (összesen ${c.reduce((s,x)=>s+x.n,0)})`],
  ['Becsült ráfordítás','kb. '+duration(minutes(pkg))],
 ];
}

// ---------------------------------------------------------------- Markdown
const cell=(s:string)=>s.replace(/\|/g,'\\|').replace(/\n/g,' ');
const BOX='☐';
function mdPara(x:Para):string[]{
 if(x.kind==='p')return [x.text,''];
 if(x.kind==='table')return ['| '+x.headers.join(' | ')+' |','|'+x.headers.map((_,i)=>x.right?.includes(i)?'---:':'---').join('|')+'|',...x.rows.map(r=>'| '+r.map(cell).join(' | ')+' |'),''];
 return [...x.items.map((i,n)=>(x.kind==='ul'?'- ':`${n+1}. `)+i),''];
}
const blockChecks=(b:Block)=>b.items.flatMap(i=>i.kind==='value'?i.checks??[]:[]);
/** A jóváhagyó lapon előre kitöltött kiadás és ujjlenyomatok (a kalkulátoronkéntiek a kalkulátoronkénti döntés táblázatában). */
export const approvedFingerprints=(pkg:Package)=>`${editionLabel(pkg.edition)}; csomag: ${pkg.fingerprints.content}; 1. rész: ${pkg.fingerprints.tables}; 2. rész: ${pkg.fingerprints.formulas}; 3. rész: ${pkg.fingerprints.calculators}`;
/** A Markdown-változat; `pages` a PDF oldalszáma (a nyilatkozat hivatkozik rá). */
export function renderMarkdown(pkg:Package,pages:number):string{
 const o:string[]=[];
 o.push('<!-- Generált fájl – kézzel ne szerkeszd. Forrás: scripts/lektori-csomag.ts; folyamat: docs/lektoralas.md. -->','');
 o.push('# '+TITLE,'',SUBTITLE,'','| Adat | Érték |','|---|---|',...metaRows(pkg).map(([k,v])=>`| ${k} | ${cell(v)} |`),'');
 o.push('> '+COVER_NOTE,'');
 o.push('## Tartalom','','- Bevezető',...pkg.parts.map(p=>`- ${p.no}. rész – ${p.title}${p.placeholder?' (helyőrző)':''}`),'- Jóváhagyó lap','');
 o.push('## Bevezető','');
 for(const s of introSections(pkg))o.push('### '+s.title,'',...s.body.flatMap(mdPara));
 for(const part of pkg.parts){
  o.push(`## ${part.no}. rész – ${part.title}${part.placeholder?' (helyőrző)':''}`,'');
  if(part.placeholder){o.push('> **Helyőrző.** '+part.intro.join(' '),'',`Tervezett tartalom: ${part.placeholder.planned.join(', ')}. Azonosító-előtag: \`${part.placeholder.prefix}-\`.`,'');continue}
  for(const t of part.intro)o.push(t,'');
  for(const t of partStatus(pkg,part.no))o.push(t,'');
  for(const b of part.blocks){
   o.push(`### ${b.id} – ${b.title}`,'','Forrás: '+b.source,'',...b.intro.flatMap(t=>[t,'']));
   for(const q of b.questions??[])o.push(`**${FORM.question} (${q.id}).** ${q.text}`,'');
   if(b.matrix){o.push('Áttekintés:','','| '+[b.matrix.corner,...b.matrix.columns].join(' | ')+' |','|'+[b.matrix.corner,...b.matrix.columns].map(()=>'---:').join('|')+'|',...b.matrix.rows.map(r=>'| '+[r.label,...r.cells].join(' | ')+' |'),'')}
   const values=b.items.filter((i):i is ValueItem=>i.kind==='value');
   if(values.length){
    const [l,v]=b.columns??['Tétel','Érték'];
    o.push(`| Azonosító | ${l} | ${v} | ✓ | ✗ | ${FORM.fix} |`,'|---|---|---|:-:|:-:|---|',...values.map(i=>`| ${i.id} | ${cell(i.label)} | ${cell(i.value)} | ${BOX} | ${BOX} | |`),'');
    const checks=blockChecks(b);if(checks.length)o.push(verifiedText(checks),'');
   }
   for(const i of b.items)if(i.kind==='rule')o.push(`#### ${i.id} – ${i.title}`,'',`**Szabály.** ${i.rule}`,'',`**Indoklás.** ${i.rationale}`,'',`**Kézzel számolt példa.** ${i.example}`,'',...(i.question?[`**${FORM.question}.** ${i.question}`,'']:[]),`**Forrás.** ${i.source}`,'',`**${FORM.verified}.** ${verifiedText(i.checks)}`,'',`| Azonosító | ✓ | ✗ | ${FORM.fix} |`,'|---|:-:|:-:|---|',`| ${i.id} | ${BOX} | ${BOX} | |`,'');
   o.push(`${BOX} ${FORM.blockOk} (${b.id}).`,'',`${FORM.blockNote}:`,'');
  }
 }
 o.push('## Jóváhagyó lap','','Blokkösszesítő:','','| Blokk | Megnevezés | Tételek | Mind rendben | Eltérő tételek (db) |','|---|---|---:|:-:|---|',...reviewable(pkg).flatMap(p=>p.blocks).map(b=>`| ${b.id} | ${cell(b.title)} | ${b.items.length} | ${BOX} | |`),'');
 o.push('### 3. rész – kalkulátoronkénti döntés','',CALC_DECISION_NOTE,'','| Kalkulátor | Blokk | Tartalmi ujjlenyomat | Forrás-ujjlenyomat | Táblázat-kapu | Döntés |','|---|---|---|---|---|---|',...pkg.calcs.map(c=>`| ${cell(c.title)} | ${c.id} | ${c.fingerprint} | ${c.source} | ${c.gated?'igen':'nem'} | ${BOX} Jóváhagyom · ${BOX} Javítás után / nem |`),'');
 o.push('### Teendő eltérés esetén','',...DEVIATION_STEPS.map((s,n)=>`${n+1}. ${s}`),'');
 o.push('### Döntés és aláírás','','A jóváhagyott csomag:','','| Adat | Érték |','|---|---|',...metaRows(pkg).slice(0,6).map(([k,v])=>`| ${k} | ${cell(v)} |`),'');
 o.push('Döntés:','',...DECISIONS.map(d=>`- ${BOX} ${d}`),'',declaration(pages),'',BINDING,'',FIELD_HINT,'','| Adat | Kitöltés |','|---|---|',...FIELDS.map(f=>`| ${f} | |`),`| Jóváhagyott csomagverzió és ujjlenyomatok | ${approvedFingerprints(pkg)} |`,'| Megjegyzések | |','');
 o.push(`${BOX} ${CONSENT()}`,'');
 return o.join('\n');
}

// ---------------------------------------------------------------- PDF
/** ASCII-közeli szöveg (a PDF metaadataihoz): a NotoSans-ból hiányzó jelek cseréje. */
export const pdfText=(s:string)=>s.replace(/[\u0000-\u001f]/g,' ').replace(/[  ]/g,' ').replace(/[‐-‒]/g,'-').replace(/−/g,'-').replace(/→/g,'->').replace(/≤/g,'<=').replace(/≥/g,'>=').replace(/≈/g,'~').replace(/√/g,'gyök ').replace(/✓/g,'pipa').replace(/✗/g,'X').replace(/☐/g,'[ ]');
/**
 * A NotoSans-ból hiányzó jeleket a PDF rajzolja ki. A szövegben egy-egy cirill helyőrző betű áll helyettük
 * (a szélesség méréséhez; a csomag szövege nem tartalmaz cirill betűt), amelyet a kiírás vonalas jelre cserél.
 */
const INLINE={'≤':'в','≥':'л','≈':'е','√':'я','→':'ф','−':'б','✓':'ж','✗':'м','☐':'ы'} as const;
export const PDF_PLACEHOLDERS:string[]=Object.values(INLINE);
const PH_TEST=new RegExp('['+PDF_PLACEHOLDERS.join('')+']','u'),PH_SPLIT=new RegExp('(['+PDF_PLACEHOLDERS.join('')+'])','u');
const pdfInline=(s:string)=>s.replace(/[\u0000-\u001f]/g,' ').replace(/[  ]/g,' ').replace(/[‐-‒]/g,'-').replace(/[≤≥≈√→−✓✗☐]/gu,c=>INLINE[c as keyof typeof INLINE]);
const pdfDate=(iso:string)=>`D:${iso.replace(/-/g,'')}000000+00'00'`;
const C={text:'#263b49',muted:'#5d7180',accent:'#1f5f6e',rule:'#d6e0e5',head:'#e3eeeb',zebra:'#f6f8fa',bar:'#eef3f5',note:'#fbf6ea',noteLine:'#e3cf9f'};
type Toc=Record<string,number>;

function drawPdf(pkg:Package,font:string,tocIn:Toc,pagesIn:number):{doc:jsPDF;toc:Toc;texts:string[]}{
 const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true,putOnlyUsedFonts:true});
 doc.addFileToVFS('NotoSans.ttf',font);doc.addFont('NotoSans.ttf','NotoSans','normal');doc.setFont('NotoSans');
 doc.setProperties({title:pdfText(TITLE+' '+editionLabel(pkg.edition)),subject:pdfText(SUBTITLE),creator:'Villanyrajz',author:'Villanyrajz'});
 doc.setCreationDate(pdfDate(pkg.edition.date));
 doc.setFileId((pkg.fingerprints.content+pkg.fingerprints.tables+pkg.fingerprints.formulas+pkg.edition.number.toString(16).padStart(8,'0')).toUpperCase());
 const W=210,H=297,M=16,CW=W-2*M,TOP=23,BOTTOM=H-19,toc:Toc={},texts:string[]=[];
 let y=TOP,pages=0;
 const lh=(size:number)=>size*0.3528*1.3;
 /** Egy hiányzó jel kirajzolása a helyőrző dobozában (x: bal szél, yy: alapvonal, w: a helyőrző szélessége). */
 const symbol=(ph:string,x:number,yy:number,w:number,size:number,color:string)=>{
  const em=size*0.3528,L=(pts:[number,number][])=>{for(let i=1;i<pts.length;i++)doc.line(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1])};
  doc.setDrawColor(color);doc.setLineWidth(em*0.075);doc.setLineCap('round');doc.setLineJoin('round');
  const X=(f:number)=>x+f*w,Y=(f:number)=>yy-f*em;
  switch(ph){
   case INLINE['≤']:L([[X(.8),Y(.62)],[X(.2),Y(.42)],[X(.8),Y(.22)]]);L([[X(.2),Y(.04)],[X(.8),Y(.04)]]);break;
   case INLINE['≥']:L([[X(.2),Y(.62)],[X(.8),Y(.42)],[X(.2),Y(.22)]]);L([[X(.2),Y(.04)],[X(.8),Y(.04)]]);break;
   case INLINE['≈']:{doc.setTextColor(color);const tw=doc.getTextWidth('~');texts.push('~');doc.text('~',x+(w-tw)/2,yy-0.1*em);doc.text('~',x+(w-tw)/2,yy+0.12*em);break}
   case INLINE['√']:L([[X(.04),Y(.34)],[X(.2),Y(.42)],[X(.42),Y(.02)],[X(.8),Y(.8)],[X(1),Y(.8)]]);break;
   case INLINE['→']:L([[X(.08),Y(.3)],[X(.92),Y(.3)]]);L([[X(.92)-.24*em,Y(.5)],[X(.92),Y(.3)],[X(.92)-.24*em,Y(.1)]]);break;
   case INLINE['−']:L([[X(.12),Y(.3)],[X(.88),Y(.3)]]);break;
   case INLINE['✓']:L([[X(.15),Y(.33)],[X(.4),Y(.08)],[X(.88),Y(.66)]]);break;
   case INLINE['✗']:L([[X(.2),Y(.62)],[X(.8),Y(.06)]]);L([[X(.2),Y(.06)],[X(.8),Y(.62)]]);break;
   case INLINE['☐']:{const s=0.62*em;doc.setLineWidth(em*0.06);doc.rect(x+(w-s)/2,yy-0.66*em,s,s,'S');break}
  }
  doc.setLineCap('butt');doc.setLineJoin('miter');
 };
 const write=(s:string,x:number,yy:number,size:number,color=C.text,align:'left'|'right'|'center'='left')=>{
  const t=pdfInline(s);doc.setFontSize(size);doc.setTextColor(color);
  if(!PH_TEST.test(t)){texts.push(t);doc.text(t,x,yy,{align});return}
  const total=doc.getTextWidth(t);let cx=align==='right'?x-total:align==='center'?x-total/2:x;
  for(const part of t.split(PH_SPLIT)){
   if(!part)continue;
   const w=doc.getTextWidth(part);
   if(PDF_PLACEHOLDERS.includes(part))symbol(part,cx,yy,w,size,color);else{texts.push(part);doc.setTextColor(color);doc.text(part,cx,yy)}
   cx+=w;
  }
 };
 const split=(s:string,width:number,size:number)=>{doc.setFontSize(size);return doc.splitTextToSize(pdfInline(s),width) as string[]};
 const header=()=>{write(TITLE,M,12,10,C.accent);write(editionLabel(pkg.edition)+' · csomag-ujjlenyomat '+pkg.fingerprints.content,W-M,12,8,C.muted,'right');doc.setDrawColor(C.rule);doc.setLineWidth(.3);doc.line(M,15,W-M,15)};
 const newPage=()=>{if(pages++)doc.addPage('a4','portrait');header();y=TOP};
 const ensure=(h:number)=>{if(y+h>BOTTOM)newPage()};
 /** Új oldal, ha a `h` magasságú egység nem fér el, de egy üres oldalon elférne. */
 const keep=(h:number)=>{if(y+h>BOTTOM&&h<=BOTTOM-TOP)newPage()};
 const atTop=()=>y<=TOP+0.01;
 const paraH=(s:string,size=9.5,gap=1.8,width=CW)=>split(s,width,size).length*lh(size)+gap;
 const para=(s:string,o:{size?:number;color?:string;indent?:number;gap?:number;width?:number}={})=>{const size=o.size??9.5,indent=o.indent??0,h=lh(size);for(const l of split(s,(o.width??CW)-indent,size)){ensure(h);write(l,M+indent,y+h*0.74,size,o.color??C.text);y+=h}y+=o.gap??1.8};
 const list=(items:string[],ordered:boolean)=>items.forEach((s,i)=>{const size=9.5,h=lh(size),ls=split(s,CW-7,size);ensure(h*Math.min(ls.length,2));write(ordered?(i+1)+'.':'•',M+1.5,y+h*0.74,size);ls.forEach(l=>{ensure(h);write(l,M+7,y+h*0.74,size);y+=h});y+=1});
 const h1=(s:string,key?:string)=>{if(!atTop())newPage();if(key)toc[key]=pages;write(s,M,y+7,16,C.accent);y+=10.5;doc.setDrawColor(C.accent);doc.setLineWidth(.5);doc.line(M,y,M+30,y);y+=5};
 const h2H=(s:string)=>2.5+split(s,CW,12).length*lh(12)+2;
 const h2=(s:string,keepH=22)=>{keep(Math.max(keepH,h2H(s)));if(!atTop())y+=2.5;for(const l of split(s,CW,12)){write(l,M,y+lh(12)*0.74,12,C.accent);y+=lh(12)}y+=2};
 const box=(cx:number,cy:number,s=3.4)=>{doc.setDrawColor(C.text);doc.setLineWidth(.3);doc.rect(cx-s/2,cy-s/2,s,s,'S')};
 const okIcon=(cx:number,cy:number)=>{doc.setDrawColor(C.text);doc.setLineWidth(.45);doc.line(cx-1.5,cy,cx-0.5,cy+1.1);doc.line(cx-0.5,cy+1.1,cx+1.5,cy-1.3)};
 const noIcon=(cx:number,cy:number)=>{doc.setDrawColor(C.text);doc.setLineWidth(.45);doc.line(cx-1.2,cy-1.2,cx+1.2,cy+1.2);doc.line(cx-1.2,cy+1.2,cx+1.2,cy-1.2)};
 const dashed=(x1:number,x2:number,yy:number)=>{doc.setDrawColor(C.muted);doc.setLineWidth(.2);doc.setLineDashPattern([0.6,0.9],0);doc.line(x1,yy,x2,yy);doc.setLineDashPattern([],0)};
 /** Azonosító tördelése kötőjelnél (a szóköz nélküli hosszú azonosító, pl. KAL-LED-SZALAG-TAPEGYSEG-BEM-PM, így nem törik szó közben); ami elfér, változatlan. */
 const splitId=(s:string,width:number,size:number):string[]=>{
  doc.setFontSize(size);
  const fits=(t:string)=>doc.getTextWidth(pdfInline(t))<=width;
  if(!s||fits(s))return split(s,width,size);
  const out:string[]=[];let cur='';
  for(const t of s.split(/(?<=-)/)){if(cur&&!fits(cur+t)){out.push(cur);cur=t}else cur+=t}
  if(cur)out.push(cur);
  return out.flatMap(l=>fits(l)?[l]:split(l,width,size));
 };
 type Col={title:string;w:number;align?:'left'|'right'|'center';box?:boolean;icon?:'ok'|'no';id?:boolean};
 /** `tail`: az utolsó sor csak az utána következő `tail` magasságú elemmel (pl. a blokk záró mezőjével) együtt kerül az oldalra. */
 const table=(cols:Col[],rows:string[][],o:{size?:number;minRow?:number;tail?:number}={})=>{
  const size=o.size??8.5,total=cols.reduce((s,c)=>s+c.w,0),ws=cols.map(c=>c.w/total*CW),line=lh(size),minRow=o.minRow??6;
  const head=()=>{
   const hl=cols.map((c,i)=>c.icon?[]:split(c.title,ws[i]-3,7.8)),hh=Math.max(7,...hl.map(l=>l.length*lh(7.8)+3));
   doc.setFillColor(C.head);doc.rect(M,y,CW,hh,'F');let x=M;
   cols.forEach((c,i)=>{if(c.icon){(c.icon==='ok'?okIcon:noIcon)(x+ws[i]/2,y+hh/2)}else hl[i].forEach((l,k)=>write(l,c.align==='right'?x+ws[i]-1.5:c.align==='center'?x+ws[i]/2:x+1.5,y+3+lh(7.8)*(k+0.74),7.8,C.text,c.align??'left'));x+=ws[i]});
   y+=hh;
  };
  ensure(7+minRow*2);head();
  rows.forEach((row,n)=>{
   const cells=row.map((s,i)=>cols[i].box?[]:cols[i].id?splitId(s,ws[i]-3,size):split(s,ws[i]-3,size)),h=Math.max(minRow,...cells.map(l=>l.length*line+2.4));
   if(y+h+(n===rows.length-1?o.tail??0:0)>BOTTOM){newPage();head()}
   if(n%2===1){doc.setFillColor(C.zebra);doc.rect(M,y,CW,h,'F')}
   let x=M;
   cols.forEach((c,i)=>{if(c.box)box(x+ws[i]/2,y+h/2);else{const top=y+(h-cells[i].length*line)/2;cells[i].forEach((l,k)=>write(l,c.align==='right'?x+ws[i]-1.5:c.align==='center'?x+ws[i]/2:x+1.5,top+line*(k+0.74),size,C.text,c.align??'left'))}x+=ws[i]});
   y+=h;doc.setDrawColor(C.rule);doc.setLineWidth(.2);doc.line(M,y,W-M,y);
  });
  y+=3;
 };
 const checkLine=(s:string,size=9.5)=>{const ls=split(s,CW-8,size),h=lh(size);ensure(ls.length*h+1);box(M+2,y+h*0.45);ls.forEach(l=>{write(l,M+7,y+h*0.74,size);y+=h});y+=1.6};
 const fieldRow=(label:string,o:{height?:number;value?:string}={})=>{
  const L=lh(8.5),ls=label?split(label,58,8.5):[],vs=o.value?split(o.value,CW-64,8.5):[],hh=Math.max(o.height??10,Math.max(ls.length,vs.length)*L+4),base=y+hh-3;
  ensure(hh);
  ls.forEach((l,k)=>write(l,M,base-(ls.length-1-k)*L,8.5,C.muted));vs.forEach((l,k)=>write(l,M+63,base-(vs.length-1-k)*L,8.5));
  if(!vs.length)dashed(M+62,W-M,base+0.8);
  y+=hh;
 };
 const noteH=(lines:string[],size=9.5)=>lines.flatMap(s=>split(s,CW-8,size)).length*lh(size)+8;
 const note=(lines:string[],size=9.5)=>{const ls=lines.flatMap(s=>split(s,CW-8,size)),h=ls.length*lh(size)+5;ensure(h);doc.setFillColor(C.note);doc.setDrawColor(C.noteLine);doc.setLineWidth(.3);doc.rect(M,y,CW,h,'FD');ls.forEach((l,k)=>write(l,M+4,y+2.5+lh(size)*(k+0.74),size));y+=h+3};
 const paraBlock=(x:Para)=>{if(x.kind==='p')para(x.text);else if(x.kind==='table')table(x.headers.map((t,i)=>({title:t,w:x.widths[i],align:x.right?.includes(i)?'right' as const:'left' as const,id:x.ids?.includes(i)})),x.rows);else list(x.items,x.kind==='ol')};
 /** Kézírásos mező: címke, alatta `n` szaggatott sor. */
 const COMMENT_LINE=7;
 const commentH=(n:number)=>5+n*COMMENT_LINE+2;
 const commentField=(label:string,n:number)=>{ensure(commentH(n));write(label,M+1.5,y+4,8,C.muted);for(let k=1;k<=n;k++)dashed(M+1.5,W-M,y+4+k*COMMENT_LINE);y+=commentH(n)};

 // Címlap
 newPage();
 write('Lektori csomag',M,y+9,22,C.accent);y+=14;
 para(SUBTITLE,{size:11,color:C.muted,gap:4});
 table([{title:'Adat',w:55},{title:'Érték',w:123}],metaRows(pkg),{size:9});
 h2('Tartalom',30);
 const tocRows:[string,string][]=[['Bevezető','intro'],...pkg.parts.map(p=>[`${p.no}. rész – ${p.title}${p.placeholder?' (helyőrző)':''}`,'part'+p.no] as [string,string]),['Jóváhagyó lap','approval']];
 for(const [label,key] of tocRows){const h=lh(10);ensure(h);write(label,M+2,y+h*0.74,10);doc.setFontSize(10);doc.setDrawColor(C.rule);doc.setLineWidth(.2);doc.setLineDashPattern([0.4,1],0);doc.line(M+4+doc.getTextWidth(pdfInline(label)),y+h*0.7,W-M-10,y+h*0.7);doc.setLineDashPattern([],0);write(String(tocIn[key]??''),W-M,y+h*0.74,10,C.text,'right');y+=h+1}
 y+=3;
 note([COVER_NOTE],9);

 // Bevezető
 h1('Bevezető','intro');
 for(const s of introSections(pkg)){h2(s.title,s.body[0]?.kind==='table'?40:20);s.body.forEach(paraBlock)}

 // Részek
 const LABEL_W=25,TEXT_W=CW-LABEL_W-2;
 const valueCols=(b:Block):Col[]=>{const [l,v]=b.columns??['Tétel','Érték'],{widths:[wi,wl,wv,wf],align}=b.layout??{widths:[30,40,22,72],align:'right'};return [{title:'Azonosító',w:wi,id:true},{title:l,w:wl},{title:v,w:wv,align},{title:'✓',w:7,box:true,icon:'ok'},{title:'✗',w:7,box:true,icon:'no'},{title:FORM.fix,w:wf}]};
 const ruleFields=(i:RuleItem)=>([['Szabály',i.rule],['Indoklás',i.rationale],['Példa',i.example],...(i.question?[['Kérdés',i.question]]:[]),['Forrás',i.source],[FORM.verified,verifiedText(i.checks)]] as [string,string][]).map(([k,v])=>({k,ls:split(v,TEXT_W,9)}));
 const FIX_LINES=2;
 const ruleItemH=(i:RuleItem)=>{const titleH=split(i.id+' – '+i.title,CW-34,10.5).length*lh(10.5)+3.4;return titleH+2+ruleFields(i).reduce((s,f)=>s+f.ls.length*lh(9)+1.3,0)+commentH(FIX_LINES)+2};
 const ruleItem=(i:RuleItem,tail=0)=>{
  const size=9,line=lh(size),fields=ruleFields(i);
  const titleLs=split(i.id+' – '+i.title,CW-34,10.5),titleH=titleLs.length*lh(10.5)+3.4;
  keep(ruleItemH(i)+tail);
  ensure(titleH+10);
  doc.setFillColor(C.bar);doc.rect(M,y,CW,titleH,'F');
  titleLs.forEach((l,k)=>write(l,M+2,y+1.7+lh(10.5)*(k+0.74),10.5,C.accent));
  const cy=y+titleH/2;okIcon(W-M-27,cy);box(W-M-21.5,cy);noIcon(W-M-12,cy);box(W-M-6.5,cy);
  y+=titleH+2;
  for(const f of fields){ensure(line);write(f.k,M+1.5,y+line*0.74,8,f.k==='Kérdés'?C.accent:C.muted);f.ls.forEach(l=>{ensure(line);write(l,M+LABEL_W,y+line*0.74,size,f.k===FORM.verified?C.muted:C.text);y+=line});y+=1.3}
  commentField(FORM.fix,FIX_LINES);
  doc.setDrawColor(C.rule);doc.setLineWidth(.3);doc.line(M,y-0.5,W-M,y-0.5);y+=2;
 };
 const VALUE_ROW=8.5;
 for(const part of pkg.parts){
  const title=`${part.no}. rész – ${part.title}${part.placeholder?' (helyőrző)':''}`;
  if(part.placeholder){
   if(part.no===pkg.parts.find(p=>p.placeholder)!.no)h1('Tervezett részek (helyőrzők)');
   toc['part'+part.no]=pages;h2(title,30);
   note(['Helyőrző. '+part.intro.join(' ')]);
   para(`Tervezett tartalom: ${part.placeholder.planned.join(', ')}. Azonosító-előtag: ${part.placeholder.prefix}-.`,{size:9,color:C.muted,gap:3});
   continue;
  }
  h1(title,'part'+part.no);
  part.intro.forEach(t=>para(t));
  const status=partStatus(pkg,part.no);if(status.length)note(status,9);
  for(const b of part.blocks){
   const values=b.items.filter((i):i is ValueItem=>i.kind==='value'),rules=b.items.filter((i):i is RuleItem=>i.kind==='rule');
   const qs=(b.questions??[]).map(q=>`${FORM.question} (${q.id}): ${q.text}`);
   // A blokk fejléce csak az első tartalmi elemmel (mátrix, táblázat eleje vagy első szabálytétel) együtt kerül egy oldalra.
   const headH=h2H(`${b.id} – ${b.title}`)+paraH('Forrás: '+b.source,8.5,1.2)+b.intro.reduce((s,t)=>s+paraH(t,9),0)+qs.reduce((s,q)=>s+noteH([q],9),0);
   const firstH=b.matrix?7+6*3:values.length?7+VALUE_ROW*2:rules.length?ruleItemH(rules[0]):0;
   keep(headH+firstH);
   h2(`${b.id} – ${b.title}`,0);
   para('Forrás: '+b.source,{size:8.5,color:C.muted,gap:1.2});
   b.intro.forEach(t=>para(t,{size:9}));
   for(const q of qs)note([q],9);
   if(b.matrix)table([{title:b.matrix.corner,w:20,align:'right'},...b.matrix.columns.map(c=>({title:c,w:20,align:'right' as const}))],b.matrix.rows.map(r=>[r.label,...r.cells]),{size:9});
   // A blokk záró mezője (négyzet és megjegyzés) az utolsó táblázatsorral vagy szabálytétellel együtt marad.
   const checks=blockChecks(b),footH=(checks.length?paraH(verifiedText(checks),8.5,2):0)+lh(9)+0.6+commentH(3)+2;
   if(values.length){
    table(valueCols(b),values.map(i=>[i.id,i.label,i.value,'','','']),{minRow:VALUE_ROW,tail:rules.length?0:footH});
    if(checks.length)para(verifiedText(checks),{size:8.5,color:C.muted,gap:2});
   }
   rules.forEach((i,n)=>ruleItem(i,n===rules.length-1?footH:0));
   keep(lh(9)+0.6+commentH(3));
   y-=1;checkLine(`${FORM.blockOk} (${b.id}).`,9);
   commentField(FORM.blockNote,3);
   y+=2;
  }
 }

 // Jóváhagyó lap: előbb a blokkösszesítő, a kalkulátoronkénti döntés és a teendők eltérés esetén; utána egy lapon a döntés,
 // a nyilatkozat, az adatok, az aláírás és a hozzájárulás.
 h1('Jóváhagyó lap','approval');
 para('Blokkonként: „Mind rendben”, ha a blokk minden tétele egyezik; különben az eltérő (✗) tételek száma.',{size:9.5,gap:2});
 table([{title:'Blokk',w:32,id:true},{title:'Megnevezés',w:72},{title:'Tételek',w:16,align:'right'},{title:'Mind rendben',w:22,box:true},{title:'Eltérő tételek (db)',w:36}],reviewable(pkg).flatMap(p=>p.blocks).map(b=>[b.id,b.title,String(b.items.length),'','']),{minRow:7.5});
 h2('3. rész – kalkulátoronkénti döntés',60);
 para(CALC_DECISION_NOTE,{size:9,gap:2});
 table([{title:'Kalkulátor',w:42},{title:'Blokk',w:34,id:true},{title:'Tartalom (ujjlenyomat)',w:23},{title:'Forrás (ujjlenyomat)',w:23},{title:'Táblázat-kapu',w:16},{title:'Jóváhagyom',w:20,box:true},{title:'Javítás után / nem',w:20,box:true}],pkg.calcs.map(c=>[c.title,c.id,c.fingerprint,c.source,c.gated?'igen':'nem','','']),{minRow:9});
 h2('Teendő eltérés esetén',40);
 list(DEVIATION_STEPS,true);
 newPage();
 h2('Jóváhagyó lap – döntés és aláírás',0);
 table([{title:'A jóváhagyott csomag',w:55},{title:'Érték (előre kitöltve)',w:123}],metaRows(pkg).slice(0,6),{size:8.5});
 DECISIONS.forEach(d=>checkLine(d));
 y+=1;para(declaration(pagesIn),{size:9,gap:2});
 para(BINDING,{size:8.5,color:C.muted,gap:2});
 para(FIELD_HINT,{size:8.5,color:C.muted,gap:0});
 FIELDS.forEach(f=>fieldRow(f,{height:f==='Aláírás'?15:9}));
 fieldRow('Megjegyzések',{height:9});fieldRow('',{height:7.5});
 y+=2;checkLine(CONSENT(),8);

 const n=doc.getNumberOfPages();
 for(let i=1;i<=n;i++){
  doc.setPage(i);doc.setDrawColor(C.rule);doc.setLineWidth(.3);doc.line(M,H-14,W-M,H-14);
  write('Belső munkaanyag – nem nyilvános · táblázat-ujjlenyomat '+pkg.fingerprints.tables,M,H-9,7.5,C.muted);
  write('Szignó:',122,H-9,7.5,C.muted);dashed(132,166,H-8.6);
  write(i+' / '+n+'. oldal',W-M,H-9,8,C.text,'right');
 }
 return {doc,toc,texts};
}
/** Több menetben rajzol, amíg a tartalomjegyzék oldalszámai és a nyilatkozat oldalszáma állandó. */
export function renderPdf(pkg:Package,font:string):{doc:jsPDF;pages:number;texts:string[]}{
 let toc:Toc={},pages=99;
 for(let pass=0;pass<5;pass++){
  const r=drawPdf(pkg,font,toc,pages),n=r.doc.getNumberOfPages();
  if(n===pages&&JSON.stringify(r.toc)===JSON.stringify(toc))return {doc:r.doc,pages:n,texts:r.texts};
  toc=r.toc;pages=n;
 }
 throw Error('A PDF oldalszáma nem állandósult.');
}
export function render(pkg:Package,font:string){
 const {doc,pages,texts}=renderPdf(pkg,font),md=renderMarkdown(pkg,pages);
 if(/[Ѐ-ӿ]/u.test(md))throw Error('A csomag szövege cirill betűt tartalmaz; ezek a PDF-ben a hiányzó jelek helyőrzői.');
 return {md,pdf:Buffer.from(doc.output('arraybuffer')),pages,texts};
}
export const readFont=()=>readFileSync(PATHS.font).toString('base64');

// ---------------------------------------------------------------- Ellenőrzés és futtatás
/** A legutóbbi commitban lévő csomag kiadása és ujjlenyomata (git HEAD:docs/lektori-csomag.md); ha nem olvasható: null. */
export function committedEdition():{number:number;content:string}|null{
 try{
  const md=execFileSync('git',['show','HEAD:'+PATHS.md],{encoding:'utf8',stdio:['ignore','pipe','ignore']});
  const n=md.match(/^\| Csomagverzió \| LK-(\d+) /m),c=md.match(/^\| Csomag-ujjlenyomat \| ([0-9a-f]{8}) /m);
  return n&&c?{number:Number(n[1]),content:c[1]}:null;
 }catch{return null}
}
/** A kiadások (EDITIONS) és a tartalom összhangja; `committed`: a legutóbb commitolt kiadás (lásd committedEdition). */
export function editionProblems(pkg:Package,committed:{number:number;content:string}|null=committedEdition(),editions:readonly Edition[]=EDITIONS):string[]{
 const problems:string[]=[],last=editions[editions.length-1];
 editions.forEach((e,i)=>{
  if(e.number!==i+1)problems.push(`EDITIONS: a(z) ${i+1}. bejegyzés száma ${e.number}; a kiadások száma 1-től egyesével nő.`);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||(i>0&&e.date<editions[i-1].date))problems.push(`EDITIONS: LK-${e.number} dátuma (${e.date}) érvénytelen vagy korábbi az előzőénél.`);
  if(!/^[0-9a-f]{8}$/.test(e.content))problems.push(`EDITIONS: LK-${e.number} ujjlenyomata érvénytelen: ${e.content}`);
  if(editions.findIndex(x=>x.content===e.content)!==i)problems.push(`EDITIONS: LK-${e.number} ujjlenyomata egy korábbi kiadásé is.`);
 });
 if(last.content!==pkg.fingerprints.content){
  const released=committed!==null&&committed.number>=last.number;
  problems.push(`A csomag tartalma megváltozott az LK-${last.number} kiadáshoz képest (rögzített ujjlenyomat: ${last.content}, jelenlegi: ${pkg.fingerprints.content}). `+(released
   ?`Az LK-${last.number} már commitolva van: vegyél fel új bejegyzést az EDITIONS végére: {number:${last.number+1},date:'<mai dátum>',content:'${pkg.fingerprints.content}'} (scripts/lektori-csomag.ts), majd futtasd újra a generátort.`
   :`Ha az LK-${last.number} még nincs commitolva és nem ment ki a lektorhoz, írd át a content-jét erre; ha már kiment, vegyél fel új bejegyzést: {number:${last.number+1},date:'<mai dátum>',content:'${pkg.fingerprints.content}'} (scripts/lektori-csomag.ts). Utána futtasd újra a generátort.`));
 }
 if(committed){
  const same=editions.find(e=>e.number===committed.number);
  if(committed.number>last.number)problems.push(`A legutóbbi commitban már LK-${committed.number} kiadás szerepel; az EDITIONS nem mehet vissza (jelenleg LK-${last.number}).`);
  else if(same&&same.content!==committed.content)problems.push(`Az LK-${committed.number} kiadás a legutóbbi commitban ${committed.content} ujjlenyomattal szerepel, az EDITIONS-ben ${same.content}-tal: kiadott kiadás tartalma nem írható át – vegyél fel új kiadást.`);
 }
 return problems;
}
/**
 * A T1 kalkulátorok lektori kiadási rekordjai (lib/calc/release.ts) és a csomagkiadások összhangja: az `approvalRef` pontosan egy
 * kiadást nevez meg (LK-n, önálló jelként), az szerepel az EDITIONS-ben, és a hivatkozás tartalmazza annak csomag-ujjlenyomatát.
 * (A rekord tartalmi és forrás-ujjlenyomatának egyezését a tests/calc.ts ellenőrzi.) Üres lista: rendben.
 */
export function releaseRefProblems(records:Readonly<Record<string,ReleaseRecord>>=RELEASES,editions:readonly Edition[]=EDITIONS):string[]{
 const problems:string[]=[];
 for(const [slug,rec] of Object.entries(records)){
  if(rec.kind!=='lektoralt'||!T1_SLUGS.has(slug))continue;
  const ref=rec.approvalRef??'',named=[...ref.matchAll(/(?<![\p{L}\d])LK-(\d+)(?![\p{L}\d])/gu)].map(m=>Number(m[1]));
  if(named.length!==1){problems.push(`${slug}: az approvalRef pontosan egy csomagkiadást (LK-n) nevezzen meg (most: ${named.length})`);continue}
  const e=editions.find(x=>x.number===named[0]);
  if(!e){problems.push(`${slug}: az approvalRef-ben szereplő LK-${named[0]} nincs az EDITIONS-ben`);continue}
  if(!ref.includes(e.content))problems.push(`${slug}: az approvalRef-ben szerepeljen az LK-${e.number} csomag-ujjlenyomata (${e.content})`);
 }
 return problems;
}
/** Sorvégek egységesítése (Windows alatt core.autocrlf=true-val klónozott repóban a Markdown CRLF-fel jön le). */
export const eol=(s:string)=>s.replace(/\r\n/g,'\n');
/** A generált fájlok naprakészsége. Üres lista: minden rendben. A Markdown-összevetés a sorvégektől független. */
export function checkOutputs(pkg:Package=buildPackage(),font:string=readFont()):string[]{
 const problems=[...editionProblems(pkg),...packageProblems(pkg,reviewedContent())];
 const out=render(pkg,font);
 if(!existsSync(PATHS.md)||eol(readFileSync(PATHS.md,'utf8'))!==out.md)problems.push(PATHS.md+' elavult vagy hiányzik.');
 if(!existsSync(PATHS.pdf)||!readFileSync(PATHS.pdf).equals(out.pdf))problems.push(PATHS.pdf+' elavult vagy hiányzik.');
 return problems;
}

function main(){
 const check=process.argv.includes('--check');
 const pkg=buildPackage(),font=readFont();
 if(check){
  const problems=checkOutputs(pkg,font);
  if(problems.length){console.error('A lektori csomag nem naprakész:\n- '+problems.join('\n- ')+'\nJavítás: node --import tsx scripts/lektori-csomag.ts');process.exit(1)}
  console.log(`A lektori csomag naprakész: ${editionLabel()}, csomag-ujjlenyomat ${pkg.fingerprints.content}, táblázat-ujjlenyomat ${pkg.fingerprints.tables}, képlet-ujjlenyomat ${pkg.fingerprints.formulas}.`);
  return;
 }
 const problems=[...editionProblems(pkg),...packageProblems(pkg,reviewedContent())];
 if(problems.length){console.error('A lektori csomag nem generálható:\n- '+problems.join('\n- '));process.exit(1)}
 const out=render(pkg,font);
 writeFileSync(PATHS.md,out.md);writeFileSync(PATHS.pdf,out.pdf);
 console.log(`Kész: ${PATHS.md}, ${PATHS.pdf} (${out.pages} oldal). ${editionLabel()}; csomag ${pkg.fingerprints.content}, 1. rész ${pkg.fingerprints.tables}, 2. rész ${pkg.fingerprints.formulas}.`);
}
if((process.argv[1]??'').replace(/\\/g,'/').endsWith('scripts/lektori-csomag.ts')){
 if(!existsSync(PATHS.font)){console.error('Futtasd a repó gyökeréből: node --import tsx scripts/lektori-csomag.ts');process.exit(1)}
 main();
}
