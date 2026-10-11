// A Tudástár tartalmi kategóriái (az APK-minta szerinti csoportosítás, hazai fókusszal) és a cikkek sorrendje egy kategórián belül.
// A kategória az URL-ben nem szerepel (a cikk útvonala /tudastar/<szekció>/<slug>), így egy átsorolás nem töri el a linket.
// Csak szerveroldal (registry, oldalak) és a generátor használja; a feliratok itt egy helyen cserélhetők.
//
// Kockázati alsó korlát (`minRisk`): a biztonságkritikus témakörök (védelmi eszközök, érintésvédelem, munkabiztonság, bekötések,
// földelés) kategóriájába és a Sémák szekcióba CSAK R3 tétel kerülhet (docs/tudastar-terv.md 4.2). Így egy tévesen R1/R2-nek jelölt
// vázlat sem csúszhat át belső ellenőrzéssel: a generátor (scripts/kb-content/generate.ts buildModel) hibát dob, a kapu
// (registry.ts releaseInfo) pedig nem engedi közzétenni, amíg nincs R3-ként szakmailag lektorálva.
import type {KbRisk,KbSectionId} from './types';

export type KbCategory={id:string;section:KbSectionId;label:string;description:string;minRisk?:KbRisk};
export const KB_CATEGORIES:readonly KbCategory[]=[
 {id:'alapfogalmak',section:'elmelet',label:'Alapfogalmak',description:'Feszültség, áram, ellenállás, teljesítmény, az alaptörvények és a szakszótár.'},
 {id:'elektromechanikus-atalakitok',section:'elmelet',label:'Elektromechanikus átalakítók',description:'Transzformátor, később generátor és villanymotor.'},
 {id:'vedelmi-es-automatizalasi-eszkozok',section:'elmelet',label:'Védelmi és automatizálási eszközök',description:'Kismegszakító, áram-védőkapcsoló (FI-relé) és társaik.',minRisk:'R3'},
 {id:'kabelek-es-vezetekek',section:'elmelet',label:'Kábelek és vezetékek',description:'Vezetékszínek, típusjelölések, a vezetékek kiolvasása.'},
 {id:'erintesvedelem',section:'elmelet',label:'Érintésvédelem',description:'Védővezető, egyenpotenciálra hozás, védelmi módok.',minRisk:'R3'},
 {id:'vilagitas',section:'elmelet',label:'Világítás',description:'Fényforrások, foglalatok, lumen és lux, színhőmérséklet.'},
 {id:'munkabiztonsag',section:'elmelet',label:'Munkabiztonság',description:'Feszültségmentesítés és biztonságos munkavégzés.',minRisk:'R3'},
 {id:'tovabbi-informaciok',section:'elmelet',label:'További információk',description:'IP-védettség és más gyakran keresett tudnivalók.'},
 {id:'kapcsolasok',section:'semak',label:'Világítási kapcsolások és dugaljak',description:'101–107 kapcsolók, dugalj bekötése.',minRisk:'R3'},
 {id:'foldeles',section:'semak',label:'Földelési rendszerek',description:'TN-C, TN-S, TN-C-S, TT és IT.',minRisk:'R3'},
];
export const categoryById=(id:string)=>KB_CATEGORIES.find(c=>c.id===id);

/** Szekciók, amelyekbe csak R3 tétel kerülhet (a bekötési sémák). */
export const R3_SECTIONS:ReadonlySet<KbSectionId>=new Set<KbSectionId>(['semak']);
const RISK_RANK:Record<KbRisk,number>={R1:1,R2:2,R3:3};
/** A tétel szekciójából és kategóriájából adódó legkisebb kockázati osztály (ismeretlen kategória: R3, a legszigorúbb). */
export function riskFloor(section:KbSectionId,category:string):KbRisk{
 if(R3_SECTIONS.has(section))return 'R3';
 const c=categoryById(category);
 if(!c||c.section!==section)return 'R3';
 return c.minRisk??'R1';
}
/** A tétel kockázati besorolása eléri-e a szekció és a kategória alsó korlátját. */
export const meetsRiskFloor=(m:{section:KbSectionId;category:string;risk:KbRisk})=>RISK_RANK[m.risk]>=RISK_RANK[riskFloor(m.section,m.category)];

/** A cikkek sorrendje a kategóriákon belül (a felsoroltak előre, a többi utánuk cím szerint). Az előző/következő navigáció is ezt követi. */
export const ARTICLE_ORDER:readonly string[]=[
 'elektromos-feszultseg','elektromos-aram','elektromos-ellenallas','ohm-torvenye','elektromos-teljesitmeny','joule-lenz-torveny',
 'kirchhoff-torvenyei','soros-es-parhuzamos-kapcsolas','rovidzarlat-es-tulterheles','szakszotar',
 'transzformator-mukodese',
 'vezetekek-szinjelolese','vezetek-es-kabeljelolesek',
 'fenyforrasok-tipusai','lampafoglalatok-es-lampatalpak','lumen-es-lux','szinhomerseklet',
 'ip-vedettseg',
];
/** A cikkek rendezése: az ARTICLE_ORDER szerint, a többi utánuk cím szerint. */
export const byArticleOrder=(a:{id:string;title:string},b:{id:string;title:string})=>{const ia=ARTICLE_ORDER.indexOf(a.id),ib=ARTICLE_ORDER.indexOf(b.id);return (ia<0?999:ia)-(ib<0?999:ib)||a.title.localeCompare(b.title,'hu')};
