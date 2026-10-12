// TESZTEK KIADÁSI KAPUJA – az EGYETLEN konfigurációs pont, amely eldönti, mi látszik élesben a /tudastar/tesztek oldalon
// (a cikkeknél ugyanez a lib/kb/release.ts, a kalkulátoroknál a lib/calc/release.ts). Tiszta adat és tiszta szabály (kliensen is futhat).
//
// 1. Számolós sablonok (lib/quiz/templates.ts, a T1-kalkulátorra épülők: lib/quiz/templates-t1.ts). Egy sablon akkor KÖZZÉTETT (tesztoldal, „Tesztek” fül, „Teszteld magad” linkek, sitemap),
//    ha (lib/quiz/registry.ts templateInfo → templateState):
//    - a kalkulátora közzétett a lib/calc/release.ts kapuja szerint (rekord, egyező ujjlenyomat, T1-nél „lektoralt”), és ha a definíció
//      táblázatalapú (def.tables), tablesApproved() is igaz – ezt a kalkulátor kapujából vezetjük le, sablonlista nincs beégetve;
//    - van belső ellenőrzési rekordja itt (TEMPLATE_CHECKS), és annak ujjlenyomata egyezik a sablon mostani ujjlenyomatával
//      (registry.ts templateFingerprint: metaadat, hibamodellek és rögzített seedekkel generált mintakérdések szövege, válaszai és
//      levezetése – így a kalkulátor kódjának változása is ide gyűrűzik, és a sablon újraellenőrzésre kerül);
//    - nincs a QUIZ_SUSPENDED-ben.
//    A T1-kalkulátorra épülő sablonnak (feszültségesés, kismegszakító-választás, Zs,max) most nincs rekordja: a kalkulátor lektori
//    kiadása után a sablont is ellenőrizni kell, és a `node_modules/.bin/tsx scripts/quiz-release.ts templates` szerinti sort ide írni.
// 2. Statikus kérdésbank (content/tudastar/kerdesek/<tema>.json → scripts/quiz-release.ts build → lib/quiz/release/). A bank akkor
//    ÉLESEDIK, ha legalább BANK_MIN_TOTAL jóváhagyott kérdés van, és MINDEN témakörben legalább BANK_MIN_PER_TOPIC. Addig egyetlen
//    kérdés szövege sem kerül a build bemeneteibe (a kiadó szkript csak élesedéskor írja ki a témaköri fájlokat), így a kliensbe,
//    a keresőbe és a sitemapbe sem (tests/quiz.ts, tests/kb-dist.mjs, tests/kb-routes.mjs).
//    Jóváhagyott kérdés (lib/quiz/schema.ts approvedQuestion): review = {state:'jovahagyott', qualification, date, approvalRef,
//    fingerprint} a kérdés mostani ujjlenyomatával, source „saját” / „AI-tervezet, lektorált” / „licencelt”, és nincs visszavonva (retired).
//    Fejlesztő, MI-asszisztens vagy a tulajdonos saját hatáskörben jóváhagyott kérdést nem rögzíthet (docs/tudastar.md „Tesztek”).
// Ha egy sablon vagy egy jóváhagyott kérdés tartalma megváltozik, az ujjlenyomat eltér: kiesik a közzétettek közül, és a tests/quiz.ts megbukik.
import type {TopicId} from './topics';

/** A gyakorlási küszöb (a terv 7. pontja szerint 60 %, „saját, nem hivatalos”). */
export const PASS_THRESHOLD=0.6;
/** A kérdésbank élesedési feltétele: összesen és témakörönként ennyi jóváhagyott kérdés. */
export const BANK_MIN_TOTAL=150;
export const BANK_MIN_PER_TOPIC=10;
/** Témaköri súlyok (blueprint) a kérdésbankos teszthez: a kérdések száma ezek arányában, legnagyobb maradék módszerrel oszlik el. */
export const BLUEPRINT:Readonly<Record<TopicId,number>>={
 'alapfogalmak-szamitasok':15,kapcsolasok:12,'vedelmi-eszkozok':12,erintesvedelem:12,'foldelesi-rendszerek':8,
 'kabelek-vezetekek':10,meres:8,gepek:8,vilagitas:7,munkabiztonsag:8,
};

/** Belső ellenőrzés (a T0-kalkulátoroké mintájára): a helyes válasz runCalc-ból, a tévesztők és a szöveg ellenőrzése a tests/quiz.ts-ben. */
export type TemplateCheck={kind:'belso';by:string;date:string;fingerprint:string;note:string};
const NOTE='Belső ellenőrzés: a helyes válasz és a levezetés a közzétett (belsőleg ellenőrzött) kalkulátorból jön (runCalc); a tévesztők megnevezett hibamodellek. Sablononként 10 000 seedes tulajdonságteszt (helyes = runCalc, a válaszok egyediek, legalább 5 %-ban eltérnek, növekvő sorrend, magyar számformátum; a helyes válasz helye A–D között egyenként 10–50 %, a számolás nélküli stratégiák legfeljebb 40 %-ot érnek, ikerpár csak 2 × 2 szerkezetben) és a mintakérdések szövegének átolvasása. 2026-10-12: újrarögzítve a független review (pozíciós árulkodás, tévesztő-indoklás, paramétertér, nem törő szóköz) javítása után. Második személy általi ellenőrzés még nem történt.';
const check=(fingerprint:string):TemplateCheck=>({kind:'belso',by:'Villanyrajz szerkesztőség',date:'2026-10-12',fingerprint,note:NOTE});

export const TEMPLATE_CHECKS:Readonly<Record<string,TemplateCheck>>={
 // A T0 (belsőleg ellenőrzött) kalkulátorokra épülő sablonok.
 'ohm-aram':check('41a14982'),
 'ohm-ellenallas':check('c215153d'),
 'teljesitmeny-1f':check('643e884e'),
 'aram-1f-cosfi':check('56d2e89b'),
 'aram-3f':check('3fb91d7a'),
 'vezetek-ellenallas':check('3eaf0298'),
 'soros-eredo':check('a6dead3b'),
 'parhuzamos-eredo':check('6f2f8d24'),
 'fogyasztas-koltseg':check('bdb39967'),
 // T1-kalkulátorra épülő sablonok – rekord csak a kalkulátor lektori kiadása (és táblázatosnál tablesApproved()) után:
 // feszultseges-1f, kismegszakito-valasztas, zs-max.
};

/** Felfüggesztett sablonok vagy kérdések (hibajelzés): a rekord ellenére nem jelennek meg. */
export const QUIZ_SUSPENDED:ReadonlySet<string>=new Set<string>([]);

export type TemplateState='kozzeteve'|'kalkulatorra-var'|'tablazatra-var'|'ellenorzesre-var'|'ujraellenorzendo'|'felfuggesztve';
/** A sablon kapuja (tiszta szabály): a kalkulátor állapota (lib/calc/registry.ts releaseInfo) és a táblázat-kapu a definícióból. */
export function templateState(a:{calcPublished:boolean;tables:boolean;tablesOk:boolean;check?:TemplateCheck;fingerprint:string;suspended:boolean}):TemplateState{
 if(a.suspended)return 'felfuggesztve';
 if(!a.calcPublished)return 'kalkulatorra-var';
 if(a.tables&&!a.tablesOk)return 'tablazatra-var';
 if(!a.check)return 'ellenorzesre-var';
 if(a.check.fingerprint!==a.fingerprint)return 'ujraellenorzendo';
 return 'kozzeteve';
}

/** A kiadott kérdésbank leírója (lib/quiz/release/manifest.json, a scripts/quiz-release.ts írja). Kérdésszöveg nincs benne. */
export type BankManifest={version:1;release:string;live:boolean;total:number;topics:Readonly<Record<string,number>>;minTotal:number;minPerTopic:number};
/** A bank élesedése: összesen legalább `min`, és minden témakörben legalább `per` jóváhagyott kérdés. */
export function bankLive(counts:Readonly<Record<string,number>>,topics:readonly string[],min=BANK_MIN_TOTAL,per=BANK_MIN_PER_TOPIC){
 const total=topics.reduce((s,t)=>s+(counts[t]??0),0);
 return total>=min&&topics.every(t=>(counts[t]??0)>=per);
}
