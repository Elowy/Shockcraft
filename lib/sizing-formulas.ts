// Méretezési képletek és szövegek – tiszta modul, kiemelve a lib/sizing.ts-ből (viselkedésváltozás nélkül).
// Csak a lib/sizing-tables.ts-t importálja: zod és lib/plan nélkül a kalkulátorok kliensoldalán is használható.
// A lib/sizing.ts minden itt definiált nevet változatlanul re-exportál.
import {SIZING_TABLES as T,SECTIONS,SMALL_SECTIONS,LARGE_SECTIONS,capacity,type InstallMethod,type Insulation,type IzOverride} from './sizing-tables';

/** Az áramkör fázisa és a kismegszakító jelleggörbéje (a lib/plan sémájával azonos értékkészlet). */
export type Phase='L1'|'L2'|'L3'|'3P';export type Curve='B'|'C'|'D';
export const SIZING_DISCLAIMER='Tervezői ellenőrzést segítő, tájékoztató számítás. Az eredmény a tervben megadott és a feltüntetett feltételezett adatokból, a programban rögzített, forrásmegjelöléssel ellátott táblázatértékekkel készül. Nem minősül tervezői méretezésnek, szabványossági igazolásnak vagy szakvéleménynek, és nem helyettesíti a jogosult villamos tervező számítását, döntését és felelősségét. A bemenő adatokat, a feltételezéseket és a táblázatértékeket a tervezőnek a hatályos MSZ HD 60364 szabványsorozattal és a gyártói adatokkal kell ellenőriznie; a kész berendezés megfelelőségét méréssel kell igazolni.';
export const SIZING_DISCLAIMER_SHORT='Tervezői ellenőrzést segítő számítás – nem tervezői méretezés.';
const formatters=new Map<number,Intl.NumberFormat>();
/** Magyar számformátum, legfeljebb `d` tizedessel (számjegyszámonként gyorsítótárazott formázóval). */
export const fmtNum=(n:number,d=2)=>{let f=formatters.get(d);if(!f){f=new Intl.NumberFormat('hu-HU',{maximumFractionDigits:d});formatters.set(d,f)}return f.format(n)};
const LARGEST=SECTIONS[SECTIONS.length-1];
export const SIZING_NOT_COVERED:string[]=[
 'zárlati szilárdság (k²S² ≥ I²t, 434.5.2)',
 'szelektivitás és egyidejűség',
 'felharmonikusok és a nullavezető terhelése',
 'motorok, indítási áramok',
 'aszimmetrikus háromfázisú terhelés',
 'földben (D), szabad levegőn (E, F, G) vezetett kábel; hőszigetelésben futó hosszú szakasz (523.9)',
 'alumínium vezető, '+fmtNum(LARGEST)+' mm² feletti keresztmetszet, gumiszigetelésű (60 °C-os) vezeték, csökkentett keresztmetszetű N- vagy PE-ér',
 'TT-rendszer hurokellenőrzése, földelési ellenállás, EPH',
 'ÁVK kiválasztása (típus, érzékenység), túlfeszültség-védelem',
 'különleges helyiségek (pl. fürdőszoba, MSZ HD 60364-7-701)',
 'a fővezeték és a telki nyomvonalak méretezése; a 100 m feletti esés-pótlék',
];
/** Relatív tűrés a határérték-összehasonlításhoz: a pontos egyenlőség (pl. 90 · 0,7 = 63) lebegőpontos hibával is teljesül. */
const EPS=1e-9;
export const atMost=(a:number,b:number)=>a<=b+EPS*Math.max(1,Math.abs(b));
/** Két szám kiírása: ha a kerekítés egyenlőséget mutatna, de az összehasonlítás eltérést talált, több tizedessel. */
export function fmtPair(a:number,b:number,d=2):[string,string]{
 let x=fmtNum(a,d),y=fmtNum(b,d);
 for(let k=d+1;x===y&&atMost(a,b)!==atMost(b,a)&&k<=6;k++){x=fmtNum(a,k);y=fmtNum(b,k)}
 return [x,y];
}
export type CableSpec={text:string;cores:number|null;section:number;insulation:'PVC'|'XLPE'|null};
export type CableParse={ok:true;cable:CableSpec}|{ok:false;code:CableError;message:string};
export const cableLabel=(c:CableSpec)=>(c.cores!==null?c.cores+' × ':'')+fmtNum(c.section)+' mm²';

// ---------------------------------------------------------------- Kábeljelölés értelmezése
// A \b a magyar ékezetes betűkkel hibásan működik, ezért saját szóhatárt használunk (u flag).
const B='(?:^|[^\\p{L}\\d])',E='(?=$|[^\\p{L}\\d])';
const AL=new RegExp(B+'(?:al|alu|alumínium|aluminium|nayy\\w*|na2x\\w*|ayky\\w*|amka)'+E,'iu');
const XLPE=new RegExp(B+'(?:n2x\\w*|2xy|xlpe|epr)'+E,'iu');
const PVC=new RegExp(B+'(?:nym\\w*|nyy\\w*|nycwy|mbcu|mcu|mkcu|mt|myy|yky\\w*|cyky\\w*|h0[357]v\\w*|pvc)'+E,'iu');
/** Gumiszigetelés (60 °C-os vezetőhőmérséklet): H05RR-F, H07RN-F, GT, „gumi…”. */
const RUBBER=new RegExp(B+'(?:h0[357]r[nrt]\\w*|gumi\\w*|gt)'+E,'iu');
/** Egy ér × keresztmetszet pár után közvetlenül álló további ér („+16”, „/1.5”, „+1x6”); a feszültségjelölés („/1 kV”) nem az. */
const EXTRA=/^\s*[+/]\s*(?:\d{1,2}\s*[xg]\s*)?(\d{1,3}(?:\.\d{1,2})?)(?![\d.]*\d)(?!\s*k?v(?!\p{L}))/iu;
const PAIR=/(?<![\p{L}\d.])(\d{1,2})\s*[xg]\s*(\d{1,3}(?:\.\d{1,2})?)(?![\d.]*\d)/giu;
const MM=/(?<![\p{L}\d.])(\d{1,3}(?:\.\d{1,2})?)\s*mm(?!\p{L})/giu;
const SINGLE=/(?:^|[^\p{L}\d])(?:mcu|mkcu|mkh|h0[57]v-?[urk]|h07z1?-?[urk])\s+(\d{1,3}(?:\.\d{1,2})?)(?![\d.])/iu;
export const cableMessages={
 empty:'Nincs megadva kábeljelölés.',
 unknown:'A kábeljelölésből nem olvasható ki a keresztmetszet. Írd így: „3 × 2,5 mm²”.',
 ambiguous:'A kábeljelölés több, egymásnak ellentmondó ér- vagy keresztmetszet-adatot tartalmaz; add meg egyértelműen (pl. „3 × 2,5 mm²”).',
 reduced:'A kábeljelölés eltérő keresztmetszetű (pl. csökkentett N- vagy PE-) eret is tartalmaz; ilyen kábelt a segédszámítás nem kezel.',
 aluminium:'Alumínium vezetőt a segédszámítás nem kezel.',
 rubber:'Gumiszigetelésű (60 °C-os) vezetéket a segédszámítás nem kezel.',
 nonstandard:'Nem szabványos keresztmetszet (a segédszámítás táblázatában: '+SECTIONS.map(v=>fmtNum(v)).join('; ')+' mm²).',
 large:fmtNum(LARGEST)+' mm² feletti keresztmetszetet a segédszámítás nem kezel.',
} as const;
export type CableError=keyof typeof cableMessages;
const fail=(code:CableError):CableParse=>({ok:false,code,message:cableMessages[code]});
/** Rézvezetős kábeljelölés értelmezése („3 × 2,5 mm²”, „NYM-J 3x1,5”, „5G6”, „H07V-U 2,5 mm²”, „MCu 2,5”). Nem talál ki semmit. */
export function parseCable(text:string):CableParse{
 const t=text.normalize('NFKC').trim();if(!t)return fail('empty');
 if(AL.test(t))return fail('aluminium');
 if(RUBBER.test(t))return fail('rubber');
 const s=t.replace(/,/g,'.').replace(/[×✕*]/g,'x').replace(/mm\s*\^?2(?![\d.])/gi,'mm');
 const matches=[...s.matchAll(PAIR)];
 // Eltérő keresztmetszetű további ér („3x25+16”, „3x2,5/1,5”, „3x10+1x6”): a PE-t nem tekinthetjük a fázisvezetővel azonosnak.
 for(const m of matches){const x=s.slice(m.index+m[0].length).match(EXTRA);if(x&&Number(x[1])!==Number(m[2]))return fail('reduced')}
 const pairs=matches.map(m=>({cores:Number(m[1]),section:Number(m[2])}));
 const mms=[...s.matchAll(MM)].map(m=>Number(m[1]));
 let cores:number|null=null,section:number|null=null;
 if(pairs.length){
  if(new Set(pairs.map(p=>p.section)).size>1||new Set(pairs.map(p=>p.cores)).size>1)return fail('ambiguous');
  ({cores,section}=pairs[0]);
  if(mms.some(v=>v!==section))return fail('ambiguous');
 }else if(mms.length){if(new Set(mms).size>1)return fail('ambiguous');section=mms[0]}
 else{const m=s.match(SINGLE);if(m)section=Number(m[1])}
 if(section===null)return fail('unknown');
 if((LARGE_SECTIONS as readonly number[]).includes(section))return fail('large');
 if(!(SECTIONS as readonly number[]).includes(section)&&!(SMALL_SECTIONS as readonly number[]).includes(section))return fail('nonstandard');
 if(cores!==null&&cores<1)return fail('unknown');
 const insulation=XLPE.test(t)?'XLPE':PVC.test(t)?'PVC':null;
 return {ok:true,cable:{text:text.trim(),cores,section,insulation}};
}

// ---------------------------------------------------------------- Képletek
/** Tervezett áram: Ib = P / (n · U0 · cos φ), n = 3 háromfázisnál (fázisáram). MSZ HD 60364-4-43 433.1 (1). */
export function designCurrent(watts:number,phase:Phase,cosPhi:number){return watts/((phase==='3P'?3:1)*T.u0*cosPhi)}
/** Javított terhelhetőség: Iz = Iz0 · kθ · kcs (MSZ HD 60364-5-52 523, B.52.14, B.52.17). Nem kerekít. */
export function correctedIz(iz0:number,kTemp:number,kGroup:number){return iz0*kTemp*kGroup}
/** Feszültségesés %-ban: ΔU = b · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100; b = 2 egyfázisnál, 1 háromfázisnál (MSZ HD 60364-5-52 G.52.2). */
export function voltageDropPercent({b,length,current,section,cosPhi}:{b:number;length:number;current:number;section:number;cosPhi:number}){const sin=Math.sqrt(Math.max(0,1-cosPhi*cosPhi));return b*length*current*(T.rho1*cosPhi/section+T.lambda*sin)/T.u0*100}
/** A vezeték hurokellenállása: ρ1 · L · (1/A + 1/A_PE) (MSZ HD 60364-4-41 411.4.4). */
export function loopResistance(length:number,section:number,pe=section){return T.rho1*length*(1/section+1/pe)}
/** Megengedett hurokimpedancia: Zs,max = cmin · U0 / (m · In), m a pillanatkioldás felső határa (MSZ EN 60898-1). */
export function maxLoopImpedance(curve:Curve,rating:number){return T.cmin*T.u0/(T.instantaneous[curve]*rating)}
/** Az a hossz (m), amelynél a feszültségesés eléri a megadott keretet (G.52.2 átrendezve). */
export function maxLengthForDrop(budgetPct:number,b:number,current:number,section:number,cosPhi:number){const sin=Math.sqrt(Math.max(0,1-cosPhi*cosPhi)),per=b*current*(T.rho1*cosPhi/section+T.lambda*sin);return per>0?Math.max(0,budgetPct)/100*T.u0/per:Infinity}
/** A legkisebb táblázati keresztmetszet, amelynél Iz0 · kθ · kcs ≥ In; ha 35 mm²-ig nincs ilyen: null. */
export function minSectionFor(rating:number,method:InstallMethod,insulation:Insulation,loaded:2|3,kTemp:number,kGroup:number,overrides?:readonly IzOverride[]){
 for(const s of SECTIONS){const c=capacity(method,insulation,loaded,s,overrides);if(c&&atMost(rating,correctedIz(c.value,kTemp,kGroup)))return s}
 return null;
}
