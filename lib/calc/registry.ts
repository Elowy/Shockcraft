// Kalkulátor-registry (szerveroldal és tesztek): minden definíció, kiadási állapot, kliensnek átadható metaadat.
// A kliensoldali kalkulátor-szigetek csak a saját definíciójukat importálják (components/calc/islands), ezt a modult nem.
import {fingerprint,tablesApproved} from '../sizing-tables';
import type {CalcDef} from './core';
import {RELEASES,TABLE_GATED,type ExpertReview,type ReleaseRecord} from './release';
import {CALC_CATEGORIES} from './categories';
import ohm from './defs/ohm-torveny';
import teljesitmeny from './defs/teljesitmeny';
import aram from './defs/aram-teljesitmenybol';
import meddo from './defs/latszolagos-meddo-teljesitmeny';
import vezetek from './defs/vezetek-ellenallas';
import eredoR from './defs/eredo-ellenallas';
import fogyasztas from './defs/fogyasztas-koltseg';
import fazis from './defs/fazisterheles';
import atvalto from './defs/mertekegyseg-atvalto';
import eredoC from './defs/eredo-kapacitas';
import oszto from './defs/feszultsegoszto';
import szinkod from './defs/ellenallas-szinkod';
import lumen from './defs/lumen-lux';
import csillag from './defs/csillag-delta';
import trafo from './defs/transzformator';
import akku from './defs/akkumulator-uzemido';
import ledR from './defs/led-elotet-ellenallas';
import rezonancia from './defs/reaktancia-rezonancia';
import homerseklet from './defs/homerseklet';
import feszultseges from './defs/feszultseges';
import motor from './defs/motor-aram';
import ledSzalag from './defs/led-szalag-tapegyseg';
import fazisjavitas from './defs/fazisjavitas';
import keresztmetszet from './defs/keresztmetszet';
import kismegszakito from './defs/kismegszakito';
import hurok from './defs/hurokimpedancia';
import terhelhetoseg from './defs/terhelhetoseg-tablazat';

export {CALC_CATEGORIES};
export const CALCULATORS:readonly CalcDef[]=[
 ohm,teljesitmeny,aram,meddo,vezetek,eredoR,fogyasztas,fazis,atvalto,
 eredoC,oszto,szinkod,lumen,csillag,trafo,akku,ledR,rezonancia,homerseklet,
 feszultseges,motor,ledSzalag,fazisjavitas,keresztmetszet,kismegszakito,hurok,terhelhetoseg,
];
export const bySlug=(slug:string)=>CALCULATORS.find(c=>c.slug===slug);

/** A jóváhagyandó tartalom ujjlenyomata (a compute függvény nélkül; annak viselkedését a golden példák rögzítik, amelyek részei). */
export function calcFingerprint(def:CalcDef){
 const {slug,title,short,category,tier,tables,fields,formulas,notes,safety,examples,sources,notCovered,version}=def;
 return fingerprint({slug,title,short,category,tier,tables:!!tables,fields,formulas,notes,safety,examples,sources,notCovered:notCovered??[],version});
}

/** A lektor megjelenő megnevezése a kalkulátoroldalon: név csak kifejezett hozzájárulással (showName: true), különben a minősítés. */
export const expertShown=(r:ExpertReview)=>r.showName===true?r.reviewer+', '+r.qualification:r.qualification;
/** A kalkulátoroldal lábléc-sora lektorált kalkulátornál. */
export const expertMeta=(r:ExpertReview)=>'Szakmai lektor: '+expertShown(r);
export type ReleaseState='kozzeteve'|'kiadatlan'|'ujraellenorzendo'|'tablazatra-var'|'tiltott';
export type ReleaseInfo={state:ReleaseState;record?:ReleaseRecord;badge:string;reason:string};
export function releaseInfo(def:CalcDef,records:Readonly<Record<string,ReleaseRecord>>=RELEASES,tablesOk=tablesApproved()):ReleaseInfo{
 const record=records[def.slug];
 if(def.tier==='T2')return {state:'tiltott',badge:'',reason:'T2 kalkulátor lektori jóváhagyás és kiemelt figyelmeztetések nélkül nem adható ki.'};
 if(!record)return {state:'kiadatlan',badge:'',reason:def.tier==='T1'?'Szakmai lektorálásra vár.':'Belső ellenőrzésre vár.'};
 if(record.fingerprint!==calcFingerprint(def))return {state:'ujraellenorzendo',record,badge:'',reason:'A definíció a jóváhagyás óta megváltozott; újra ellenőrizni kell.'};
 if(def.tier==='T1'&&record.kind!=='lektoralt')return {state:'kiadatlan',record,badge:'',reason:'T1 kalkulátorhoz szakmai lektori jóváhagyás kell.'};
 if(TABLE_GATED.has(def.slug)&&!tablesOk)return {state:'tablazatra-var',record,badge:'',reason:'A táblázatértékek tervezői jóváhagyása folyamatban.'};
 return {state:'kozzeteve',record,reason:'',badge:record.kind==='lektoralt'?'Szakmailag lektorálta: '+expertShown(record)+' · '+record.date:'Belsőleg ellenőrizve'};
}
export const isPublished=(def:CalcDef)=>releaseInfo(def).state==='kozzeteve';
export const publishedCalcs=()=>CALCULATORS.filter(isPublished);
/** Előnézetben (SHOCKCRAFT_KB_PREVIEW=1) minden megépült kalkulátor elérhető, „Tervezet” jelöléssel. */
export const visibleCalcs=(preview:boolean)=>preview?CALCULATORS.filter(c=>c.tier!=='T2'):publishedCalcs();

/** A kliensnek átadható, szerializálható metaadat (kereső, hub, kedvencek). */
export type CalcMeta={slug:string;title:string;short:string;category:string;keywords:readonly string[];synonyms:readonly string[];tier:string;href:string|null;status:'kozzeteve'|'hamarosan'|'tervezet';note:string;detail:string};
export const SOON='Hamarosan – szakmai lektorálás alatt';
export function calcMeta(def:CalcDef,preview=false):CalcMeta{
 const info=releaseInfo(def),pub=info.state==='kozzeteve';
 const status=pub?'kozzeteve':preview?'tervezet':'hamarosan';
 const tablesPending=TABLE_GATED.has(def.slug)&&!tablesApproved();
 return {slug:def.slug,title:def.title,short:def.short,category:def.category,keywords:def.keywords,synonyms:def.synonyms??[],tier:def.tier,href:pub||preview?'/kalkulatorok/'+def.slug:null,status,
  note:pub?info.badge:status==='tervezet'?'Tervezet – nem lektorált (előnézet)':info.state==='tablazatra-var'?'Hamarosan – a táblázatértékek tervezői jóváhagyása folyamatban':SOON,
  detail:!pub&&tablesPending?'A táblázatértékek tervezői jóváhagyása is folyamatban.':''};
}
export const calcMetas=(preview=false)=>CALCULATORS.filter(c=>c.tier!=='T2').map(c=>calcMeta(c,preview));
