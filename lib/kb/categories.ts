// A kézikönyv (Tudástár) szekciói, feliratai és ikonnevei – EGY helyen, hogy a nyitott névdöntések egy sor cseréjével átvezethetők legyenek.
// Az URL-szegmensek stabilak; csak a feliratok változhatnak. Kliensbiztos, tiszta adat.

/** A menüpont neve (a tulajdonos még dönthet: Tudástár / Oktatóanyag / Szakmai kézikönyv / Villanyszerelő-kézikönyv). */
export const KB_NAME='Tudástár';
/** A kezdőlap H1-e. */
export const KB_TITLE='Villanyszerelő Tudástár';
export const SITE_NAME='Villanyrajz';
/** A főoldal címe. Szándékosan egyszerű <a> (nem next/link): hosszú listán sincs RSC-előtöltés (docs/tudastar-terv.md 3.1). */
export const HOME='/';
/** A Kalkulátorok rövid, stabil URL-je; a linkek ebből épülnek (egy helyen, elírás nélkül). */
export const CALC_HUB='/kalkulatorok';
export const calcPath=(slug:string)=>CALC_HUB+'/'+slug;
/** Open Graph alapmezők: az oldalak saját openGraph objektuma a layoutét teljesen felülírja (sekély összevonás), ezért mindenhol ki kell írni. */
export const OG_BASE={siteName:SITE_NAME,locale:'hu_HU'} as const;
/** A kalkulátoroldal <title>-je (legfeljebb 60 karakter, terv 3.7): „<cím> – Kalkulátorok – Villanyrajz”, ha belefér; különben „<cím> – Villanyrajz”. */
export function calcSeoTitle(title:string){const full=title+' – Kalkulátorok – '+SITE_NAME;return full.length<=60?full:title+' – '+SITE_NAME}

export type SectionId='elmelet'|'semak'|'kalkulatorok'|'tesztek'|'konstruktor';
export type SectionIcon='book-open'|'plug-zap'|'calculator'|'clipboard-check'|'blocks';
export type Section={id:SectionId;label:string;href:string;icon:SectionIcon};
export const SECTIONS:readonly Section[]=[
 {id:'elmelet',label:'Elmélet',href:'/tudastar/elmelet',icon:'book-open'},
 {id:'semak',label:'Sémák',href:'/tudastar/semak',icon:'plug-zap'},
 {id:'kalkulatorok',label:'Kalkulátorok',href:CALC_HUB,icon:'calculator'},
 {id:'tesztek',label:'Tesztek',href:'/tudastar/tesztek',icon:'clipboard-check'},
 {id:'konstruktor',label:'Konstruktor',href:'/tudastar/konstruktor',icon:'blocks'},
];
export const sectionById=(id:SectionId)=>SECTIONS.find(s=>s.id===id)!;

/** Szabály: csak az a szekció látszik a navigációban, amelyben van közzétett elem. Halott vagy belépést kérő fül nincs.
 * A darabszámokat a szerver adja (a kalkulátoroknál publishedCalcs(), a többi szekció tartalomregisztere még üres). */
export const visibleSections=(published:Partial<Record<SectionId,number>>)=>SECTIONS.filter(s=>(published[s.id]??0)>0);
/** A Tudástár-kezdőlap (/tudastar) csak akkor kap linket, ha a Kalkulátorokon kívül is van közzétett szekció. */
export const kbHomeVisible=(published:Partial<Record<SectionId,number>>)=>visibleSections(published).some(s=>s.id!=='kalkulatorok');
