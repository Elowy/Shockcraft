// Méretezési segédszámítás – az EGYETLEN ellenőrzési pont minden számértékhez és forráshoz.
// A fájl szándékosan nem importál semmit: a jóváhagyó tervező itt, egy helyen vet össze mindent a szabvánnyal.
// Minden érték „ellenőrizendő”, amíg a SIZING_REVIEW blokkot jogosult tervező ki nem tölti (lásd docs/meretezes.md).

export const SECTIONS=[1.5,2.5,4,6,10,16,25,35] as const;
/** Parszolható, de a „Legkisebb keresztmetszet” ellenőrzésen elbukik. */
export const SMALL_SECTIONS=[0.5,0.75,1] as const;
/** 35 mm² feletti keresztmetszet: a segédszámítás nem kezeli („Nem számítható”). */
export const LARGE_SECTIONS=[50,70,95,120,150,185,240,300] as const;
export const INSTALL_METHODS=['A1','A2','B1','B2','C'] as const;
export const INSULATIONS=['PVC','XLPE'] as const;
export type InstallMethod=typeof INSTALL_METHODS[number];export type Insulation=typeof INSULATIONS[number];
/** Terhelhetőség (A) terhelt erek száma és szerelési mód szerint; az index a SECTIONS indexe. */
export type Ampacity=Record<2|3,Record<InstallMethod,number[]>>;
export type SizingTables={version:string;sections:readonly number[];ampacity:{PVC:Ampacity;XLPE:Ampacity|null};ambient:{steps:number[];PVC:number[];XLPE:number[]|null};grouping:{counts:number[];factors:number[]};u0:number;rho1:number;lambda:number;minSection:number;conventionalFactor:number;instantaneous:{B:number;C:number;D:number};cmin:number;dropLimits:Record<'public'|'private',{lighting:number;other:number}>};
export type TableStatus='ellenőrizendő'|'jóváhagyott'|'projekt-felülírás';
/** Egy felhasznált táblázati érték: `source` a teljes forrás, `short` a számítási sorba írt rövid hivatkozás. */
export type TableRef={label:string;value:number;unit:string;source:string;short:string;status:TableStatus};
export type IzOverride={method:InstallMethod;insulation:Insulation;loaded:2|3;section:number;iz:number;note:string};

/** Forrásmegjelölések. A kiadásévek és a táblázatszámok is jóváhagyandók. */
export const SOURCES={
 pvc2:{standard:'MSZ HD 60364-5-52:2011',item:'B.52.2 táblázat – PVC, 2 terhelt ér, réz, 70 °C, 30 °C levegő'},
 pvc3:{standard:'MSZ HD 60364-5-52:2011',item:'B.52.4 táblázat – PVC, 3 terhelt ér, réz'},
 xlpe2:{standard:'MSZ HD 60364-5-52:2011',item:'B.52.3 táblázat – XLPE/EPR, 2 terhelt ér (a programban nincs rögzítve)'},
 xlpe3:{standard:'MSZ HD 60364-5-52:2011',item:'B.52.5 táblázat – XLPE/EPR, 3 terhelt ér (a programban nincs rögzítve)'},
 ambient:{standard:'MSZ HD 60364-5-52:2011',item:'B.52.14 táblázat – levegő-hőmérsékleti tényező'},
 grouping:{standard:'MSZ HD 60364-5-52:2011',item:'B.52.17 táblázat, 1. sor – kötegelve, felületen, beágyazva vagy zártan'},
 methods:{standard:'MSZ HD 60364-5-52:2011',item:'B.52.1 / A.52.3 táblázat – referencia szerelési módok'},
 minSection:{standard:'MSZ HD 60364-5-52:2011',item:'524.1, 52.2 táblázat'},
 voltageDrop:{standard:'MSZ HD 60364-5-52:2011',item:'525, G melléklet (tájékoztató): G.52.1 határértékek, G.52.2 képlet, ρ1, λ'},
 overload:{standard:'MSZ HD 60364-4-43:2010',item:'433.1 – Ib ≤ In ≤ Iz és I2 ≤ 1,45 · Iz'},
 mcb:{standard:'MSZ EN 60898-1',item:'I2 = 1,45 · In; pillanatkioldás felső határa: B 5·In, C 10·In, D 20·In'},
 rcbo:{standard:'MSZ EN 61009-1',item:'Kombinált védelem (RCBO): I2 = 1,45 · In; pillanatkioldás felső határa: B 5·In, C 10·In, D 20·In'},
 loop:{standard:'MSZ HD 60364-4-41:2007',item:'411.4.4 – Zs · Ia ≤ U0 (TN-rendszer), 41.1 táblázat'},
 voltage:{standard:'MSZ EN 60038',item:'U0 = 230 V'},
} as const satisfies Record<string,{standard:string;item:string}>;
export type SourceKey=keyof typeof SOURCES;
/** A számítási sorokban és a forrásokban hivatkozott szabványpontok (a jóváhagyás része). */
export const CLAUSES={rho1:'G.52.2 · réz',lambda:'G.52.2',cmin:'411.4.4',overload:'433.1',minSection:'524.1',dropLimit:'G.52.1'} as const;
export type ProtectiveDevice='MCB'|'RCBO';

/** A számértékek. Bármely érték (és bármely forrásmegjelölés, szabványpont vagy mód-/szigetelésleírás) módosítása megváltoztatja az ujjlenyomatot, és a jóváhagyás érvényét veszti. */
export const SIZING_TABLES:SizingTables={
 version:'2026.10-1',sections:SECTIONS,
 ampacity:{
  PVC:{2:{A1:[14.5,19.5,26,34,46,61,80,99],A2:[14,18.5,25,32,43,57,75,92],B1:[17.5,24,32,41,57,76,101,125],B2:[16.5,23,30,38,52,69,90,111],C:[19.5,27,36,46,63,85,112,138]},
       3:{A1:[13.5,18,24,31,42,56,73,89],A2:[13,17.5,23,29,39,52,68,83],B1:[15.5,21,28,36,50,68,89,110],B2:[15,20,27,34,46,62,80,99],C:[17.5,24,32,41,57,76,96,119]}},
  XLPE:null // A jóváhagyó tervező töltheti ki (B.52.3/B.52.5); addig PVC-értékkel számolunk (kisebb Iz0; a kθ 30 °C alatt 1-re korlátozva, lásd temperatureFactor).
 },
 ambient:{steps:[10,15,20,25,30,35,40,45,50,55,60],PVC:[1.22,1.17,1.12,1.06,1,0.94,0.87,0.79,0.71,0.61,0.5],XLPE:null},
 grouping:{counts:[1,2,3,4,5,6,7,8,9,12,16,20],factors:[1,0.8,0.7,0.65,0.6,0.57,0.54,0.52,0.5,0.45,0.41,0.38]},
 u0:230,rho1:0.0225,lambda:0.00008,minSection:1.5,conventionalFactor:1.45,
 instantaneous:{B:5,C:10,D:20},cmin:1,
 dropLimits:{public:{lighting:3,other:5},private:{lighting:6,other:8}}
};

export const methodLabels:Record<InstallMethod,string>={
 A1:'A1 – erek védőcsőben, hőszigetelt falban',
 A2:'A2 – többeres kábel védőcsőben, hőszigetelt falban',
 B1:'B1 – erek védőcsőben vagy kábelcsatornában, falon vagy falazatban',
 B2:'B2 – többeres kábel védőcsőben vagy kábelcsatornában, falon vagy falazatban',
 C:'C – kábel falra rögzítve, vagy közvetlenül falazatba, vakolatba ágyazva',
};
export const insulationLabels:Record<Insulation,string>={PVC:'PVC (70 °C)',XLPE:'XLPE (90 °C) – jóváhagyásig PVC-értékkel'};

/**
 * Tervezői jóváhagyás. A program soha nem állítja magáról, hogy jóváhagyott: ezt csak a jogosult szakember aláírt jóváhagyó lapja
 * alapján szabad kitölteni (docs/lektoralas.md 4.1). Az érvényesség (tablesApproved) a jogosultság megnevezésén, a dátumon, a
 * jóváhagyás hivatkozásán (`approvalRef`: csomagkiadás, ujjlenyomatok, a jóváhagyó lap iktatási helye) és a táblázat-ujjlenyomaton
 * múlik – a néven nem.
 * Adatvédelem: ez a modul a nyilvános kalkulátoroldalak és a tervező kliensoldali kódjába is bekerül, ezért a jóváhagyó neve és
 * névjegyzéki száma (`reviewer`, `registry`) CSAK akkor szerepelhet itt, ha a jóváhagyó lapon kifejezetten hozzájárult a
 * megjelenítésükhöz (`showName: true`); különben mindkettő üres, és a név csak az aláírt lapon, a repón kívül marad
 * (tests/sizing-tables.ts ellenőrzi). Az `approvalRef` és a `note` sem tartalmazhat személyes adatot.
 */
export type SizingReview={status:'ellenőrizendő'|'jóváhagyott';qualification:string;date:string;fingerprint:string;approvalRef:string;showName:boolean;reviewer:string;registry:string;note:string};
export const SIZING_REVIEW:SizingReview={status:'ellenőrizendő',qualification:'',date:'',fingerprint:'',approvalRef:'',showName:false,reviewer:'',registry:'',note:'Az értékek az IEC 60364-5-52:2009 B mellékletével azonos számozás feltételezésével, nem a hiteles MSZ HD szövegből kerültek rögzítésre. A táblázatszámokat, kiadásokat, szerelésimód-leírásokat és minden számértéket a hatályos szabvánnyal össze kell vetni.'};

const hu=(n:number)=>n.toLocaleString('hu-HU',{maximumFractionDigits:5});
/** A forrás táblázatszáma („B.52.2 táblázat – …” → „B.52.2”). */
const tableNo=(key:SourceKey)=>SOURCES[key].item.split(/[\s,]/)[0];

/** FNV-1a (32 bit) a JSON-szöveg kódpontjain, 8 jegyű kisbetűs hexa. */
export function fingerprint(value:unknown):string{
 const s=JSON.stringify(value)??'';let h=0x811c9dc5;
 for(const ch of s){h^=ch.codePointAt(0)!;h=Math.imul(h,0x01000193)>>>0}
 return h.toString(16).padStart(8,'0');
}
/**
 * A jóváhagyandó tartalom: számértékek, forrásmegjelölések, szabványpontok, szerelésimód- és szigetelésleírások.
 * A jóváhagyás megjelenő szövege (reviewText, a REVIEW_TEXTS sablonjai) és a SIZING_REVIEW szándékosan NEM része: azok a
 * jóváhagyásról szólnak, nem a szabvánnyal összevetendő szakmai tartalomról, és a jóváhagyás érvénye nem függhet a megjelenítéstől
 * (a név megjelenése, showName). A sablonok szövegét a lektori csomag ujjlenyomata fedi (a lektor ezekhez járul hozzá), és a
 * tests/sizing-tables.ts rögzíti: változásuk után a név csak a lektor új hozzájárulásával jelenhet meg (docs/lektoralas.md).
 */
export const reviewedContent=()=>({tables:SIZING_TABLES,sources:SOURCES,clauses:CLAUSES,methodLabels,insulationLabels});
export const tablesFingerprint=()=>fingerprint(reviewedContent());
/** Érvényes jóváhagyás: kitöltött jogosultság, dátum és hivatkozás, az aktuális táblázat-ujjlenyomattal. A név nem feltétel (adatvédelem, lásd SizingReview). */
export function tablesApproved(review:SizingReview=SIZING_REVIEW){return review.status==='jóváhagyott'&&!!review.qualification.trim()&&!!review.date.trim()&&!!review.approvalRef.trim()&&review.fingerprint===tablesFingerprint()}
/** A név és a névjegyzéki szám csak hozzájárulással (showName) és kitöltve jelenik meg. */
export const reviewNameShown=(review:SizingReview)=>review.showName===true&&!!review.reviewer.trim()&&!!review.registry.trim();
const tableStatus=():TableStatus=>tablesApproved()?'jóváhagyott':'ellenőrizendő';
/** A táblázatállapot megjelenő szövegének sablonjai ({reviewer}, {registry}, {qualification}, {date} helyőrzővel); a végükre a tail kerül.
 * A név nélküli változat a jóváhagyó lapon megadott jogosultságot írja ki (tervező és érintésvédelmi szabványossági felülvizsgáló is lehet). */
export const REVIEW_TEXTS={
 pending:'Ellenőrizendő: a táblázatértékeket jogosult villamos tervező még nem hagyta jóvá.',
 named:'A táblázatértékeket szakmailag lektorálta: {reviewer}, {qualification} ({registry}), {date}.',
 anonymous:'A táblázatértékeket szakmailag lektorálta: {qualification}, {date}.',
 tail:'Táblázatváltozat: {version}, ujjlenyomat: {fingerprint}.',
} as const;
const fill=(template:string,values:Record<string,string>)=>template.replace(/\{(\w+)\}/g,(m,k:string)=>values[k]??m);
/**
 * A táblázatok állapota a felületen, a kalkulátoroldalakon és a terv-PDF-ben. Jóváhagyott állapotban a jóváhagyó neve és
 * névjegyzéki száma csak `showName: true` mellett (és kitöltve) jelenik meg; különben a név nélküli változat a jogosultsággal.
 * A szöveg a táblázatértékek lektorálását jelzi, nem az adott terv jóváhagyását.
 */
export function reviewText(review:SizingReview=SIZING_REVIEW){
 const tail=fill(REVIEW_TEXTS.tail,{version:SIZING_TABLES.version,fingerprint:tablesFingerprint()});
 if(!tablesApproved(review))return REVIEW_TEXTS.pending+' '+tail;
 const values={reviewer:review.reviewer.trim(),registry:review.registry.trim(),qualification:review.qualification.trim(),date:review.date.trim()};
 return fill(reviewNameShown(review)?REVIEW_TEXTS.named:REVIEW_TEXTS.anonymous,values)+' '+tail;
}

/** A táblázatok belső összefüggéseinek ellenőrzése. Üres lista: minden reláció teljesül. */
export function validateSizingTables(t:SizingTables=SIZING_TABLES):string[]{
 const errors:string[]=[],n=t.sections.length;
 const rising=(v:number[])=>v.every((x,i)=>i===0||x>v[i-1]);
 const num=(x:unknown)=>typeof x==='number'?x:NaN;
 for(let i=1;i<n;i++)if(!(t.sections[i]>t.sections[i-1]))errors.push('A keresztmetszetek sorrendje nem növekvő.');
 const check=(name:string,a:Ampacity|null)=>{
  if(!a)return;
  for(const loaded of [2,3] as const)for(const m of INSTALL_METHODS){
   const col=a[loaded]?.[m];
   if(!Array.isArray(col)||col.length!==n){errors.push(`${name} ${loaded} terhelt ér ${m}: az oszlop hossza nem ${n}.`);continue}
   if(col.some(v=>!(v>0)))errors.push(`${name} ${loaded} terhelt ér ${m}: nem pozitív érték.`);
   if(!rising(col))errors.push(`${name} ${loaded} terhelt ér ${m}: az értékek nem nőnek szigorúan.`);
  }
  for(let i=0;i<n;i++){
   for(const loaded of [2,3] as const){const [a2,a1,b2,b1,cc]=(['A2','A1','B2','B1','C'] as const).map(m=>num(a[loaded]?.[m]?.[i]));if(!(a2<=a1&&a1<=b2&&b2<=b1&&b1<=cc))errors.push(`${name} ${loaded} terhelt ér, ${hu(t.sections[i])} mm²: nem teljesül A2 ≤ A1 ≤ B2 ≤ B1 ≤ C.`)}
   for(const m of INSTALL_METHODS)if(!(num(a[3]?.[m]?.[i])<num(a[2]?.[m]?.[i])))errors.push(`${name} ${m}, ${hu(t.sections[i])} mm²: a 3 terhelt eres érték nem kisebb a 2 terhelt eresnél.`);
  }
 };
 check('PVC',t.ampacity.PVC);check('XLPE',t.ampacity.XLPE);
 const ambient=(name:string,f:number[]|null)=>{
  if(!f)return;
  if(f.length!==t.ambient.steps.length){errors.push(`${name} hőmérsékleti tényező: a sor hossza eltér a lépcsőkétől.`);return}
  const ref=t.ambient.steps.indexOf(30);
  if(ref<0||f[ref]!==1)errors.push(`${name} hőmérsékleti tényező: 30 °C-on nem 1.`);
  if(!f.every((x,i)=>i===0||x<f[i-1]))errors.push(`${name} hőmérsékleti tényező: a tényezők nem csökkennek.`);
 };
 if(!rising(t.ambient.steps))errors.push('A hőmérséklet-lépcsők nem nőnek.');
 ambient('PVC',t.ambient.PVC);ambient('XLPE',t.ambient.XLPE);
 if(!rising(t.grouping.counts))errors.push('A csoportosítási áramkörszámok nem nőnek szigorúan.');
 if(t.grouping.factors.length!==t.grouping.counts.length)errors.push('A csoportosítási tényezők száma eltér az áramkörszámokétól.');
 if(t.grouping.factors[0]!==1)errors.push('Egy áramkör csoportosítási tényezője nem 1.');
 if(!t.grouping.factors.every((x,i)=>i===0||x<=t.grouping.factors[i-1]))errors.push('A csoportosítási tényezők nőnek.');
 for(const [key,s] of Object.entries(SOURCES) as [string,{standard:string;item:string}][])if(!s.standard.trim()||!s.item.trim())errors.push(`A(z) ${key} forrásmegjelölés hiányos.`);
 return errors;
}

const ref=(label:string,value:number,unit:string,key:SourceKey,short:string,source=short):TableRef=>({label,value,unit,status:tableStatus(),source:SOURCES[key].standard+' '+tableNo(key)+' · '+source,short:tableNo(key)+' · '+short});

/** Iz0 (A): projekt-felülírás → táblázat; XLPE-táblázat hiányában PVC-érték (kedvezőtlenebb), `fallback` jelzéssel. */
export function capacity(method:InstallMethod,insulation:Insulation,loaded:2|3,section:number,overrides?:readonly IzOverride[],t:SizingTables=SIZING_TABLES):{value:number;ref:TableRef;fallback:boolean}|null{
 const o=overrides?.find(o=>o.method===method&&o.insulation===insulation&&o.loaded===loaded&&o.section===section);
 const what=`${method} · ${hu(section)} mm² · ${loaded} terhelt ér`;
 if(o)return {value:o.iz,fallback:false,ref:{label:'Iz0',value:o.iz,unit:'A',status:'projekt-felülírás',source:'Projekt-felülírás: '+o.note,short:what+' · '+insulation+' · '+o.note}};
 const i=t.sections.indexOf(section);if(i<0)return null;
 const fallback=insulation==='XLPE'&&t.ampacity.XLPE===null,xlpe=insulation==='XLPE'&&!fallback;
 const table=xlpe?t.ampacity.XLPE!:t.ampacity.PVC,value=table[loaded][method][i];
 const key:SourceKey=xlpe?(loaded===2?'xlpe2':'xlpe3'):(loaded===2?'pvc2':'pvc3');
 return {value,fallback,ref:ref('Iz0',value,'A',key,what+(fallback?' · XLPE helyett PVC-érték':''),what+' · '+(fallback?'PVC (XLPE helyett PVC-érték)':insulation))};
}
/** kθ: a legkisebb olyan lépcső, amely ≥ a környezeti hőmérséklet (kedvezőtlenebb irányba kerekít).
 * XLPE-sor hiányában a PVC-sorral számol; 30 °C alatt a PVC-tényező nagyobb lenne az XLPE-énél, ezért ott 1-re korlátozza (`capped`). */
export function temperatureFactor(insulation:Insulation,ambient:number,t:SizingTables=SIZING_TABLES){
 const i=t.ambient.steps.findIndex(s=>s>=ambient),idx=i<0?t.ambient.steps.length-1:i,step=t.ambient.steps[idx];
 const fallback=insulation==='XLPE'&&t.ambient.XLPE===null,row=insulation==='XLPE'&&!fallback?t.ambient.XLPE!:t.ambient.PVC;
 const capped=fallback&&row[idx]>1,value=capped?1:row[idx];
 const at=step+' °C'+(step!==ambient?' ('+hu(ambient)+' °C felfelé kerekítve)':'');
 const note=fallback?'XLPE helyett PVC-sor'+(capped?', 30 °C alatt 1-re korlátozva':''):'';
 return {value,step,fallback,capped,ref:ref('kθ',value,'','ambient',at+(note?' · '+note:''),(fallback?'PVC ('+note+')':insulation)+' · '+at)};
}
/** kcs: B.52.17 1. sora; a legkisebb olyan oszlop, amely ≥ az áramkörszám. */
export function groupingFactor(count:number,t:SizingTables=SIZING_TABLES){
 const i=t.grouping.counts.findIndex(c=>c>=count),idx=i<0?t.grouping.counts.length-1:i,column=t.grouping.counts[idx],value=t.grouping.factors[idx];
 return {value,column,ref:ref('kcs',value,'','grouping',column+' áramkör'+(column!==count?' ('+count+' felfelé kerekítve)':''))};
}
/** G.52.1 feszültségesés-határ (%). */
export function dropLimitRef(supply:'public'|'private',usage:'lighting'|'other',t:SizingTables=SIZING_TABLES):TableRef{
 const value=t.dropLimits[supply][usage],what=CLAUSES.dropLimit+' · '+(usage==='lighting'?'világítás':'egyéb')+' · '+(supply==='public'?'közcélú hálózat':'saját táppont');
 return {label:'ΔU határ',value,unit:'%',status:tableStatus(),source:SOURCES.voltageDrop.standard+' '+what,short:what};
}
/** Állandók forrással: ρ1, λ (G.52.2), U0 (MSZ EN 60038), cmin (411.4.4), 1,45 (433.1, kismegszakító), legkisebb keresztmetszet (524.1). */
export function constantRef(name:'rho1'|'lambda'|'u0'|'cmin'|'conventionalFactor'|'minSection',t:SizingTables=SIZING_TABLES):TableRef{
 const s=tableStatus();
 switch(name){
  case 'rho1':return {label:'ρ1',value:t.rho1,unit:'Ω·mm²/m',status:s,source:SOURCES.voltageDrop.standard+' '+CLAUSES.rho1,short:CLAUSES.rho1};
  case 'lambda':return {label:'λ',value:t.lambda,unit:'Ω/m',status:s,source:SOURCES.voltageDrop.standard+' '+CLAUSES.lambda,short:CLAUSES.lambda};
  case 'u0':return {label:'U0',value:t.u0,unit:'V',status:s,source:SOURCES.voltage.standard,short:SOURCES.voltage.standard};
  case 'cmin':return {label:'cmin',value:t.cmin,unit:'',status:s,source:SOURCES.loop.standard+' '+CLAUSES.cmin,short:CLAUSES.cmin};
  case 'conventionalFactor':return conventionalRef('MCB',t);
  case 'minSection':return {label:'Amin',value:t.minSection,unit:'mm²',status:s,source:SOURCES.minSection.standard+' '+SOURCES.minSection.item,short:CLAUSES.minSection};
 }
}
/** A védelmi készülék termékszabványa: kismegszakító – MSZ EN 60898-1, kombinált védelem (RCBO) – MSZ EN 61009-1. */
export const deviceSource=(device:ProtectiveDevice)=>device==='RCBO'?SOURCES.rcbo:SOURCES.mcb;
/** I2/In (1,45) a készülék szabványa szerint, a 433.1 (2) feltételhez. */
export function conventionalRef(device:ProtectiveDevice='MCB',t:SizingTables=SIZING_TABLES):TableRef{
 const d=deviceSource(device);
 return {label:'I2/In',value:t.conventionalFactor,unit:'',status:tableStatus(),source:d.standard+'; '+SOURCES.overload.standard+' '+CLAUSES.overload,short:d.standard};
}
/** Pillanatkioldás felső határa (m · In) a készülék jelleggörbéje szerint. */
export function instantaneousRef(curve:'B'|'C'|'D',t:SizingTables=SIZING_TABLES,device:ProtectiveDevice='MCB'):TableRef{
 const d=deviceSource(device);
 return {label:'m',value:t.instantaneous[curve],unit:'· In',status:tableStatus(),source:d.standard+' · '+curve+' jelleggörbe',short:d.standard+' · '+curve};
}
