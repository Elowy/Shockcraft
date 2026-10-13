// A tervezőből (plan-editor, Tervsegéd, Fázisterhelés, Méretezés) a Kalkulátorokra mutató linkek – kb. 1 KB, a tervező csak ezt importálja.
// Csak közzétett célra ad linket: a kiadási kapu (lib/calc/release.ts) szerint – van rekord, T1-nél „lektoralt”, a táblázatalapúaknál
// tablesApproved() is. A definíciók nélkül a tartalmi ujjlenyomatot nem tudjuk itt újraszámolni: az ujjlenyomat-eltérést a CI fogja meg
// (tests/calc.ts: minden rekord ujjlenyomata egyezik, és calcHref() pontosan a közzétett kalkulátorokra ad linket).
import {RELEASES,T1_SLUGS,TABLE_GATED,type ReleaseRecord} from '@/lib/calc/release';
import {tablesApproved} from '@/lib/sizing-tables';

import {CALC_HUB} from './categories';
export {CALC_HUB};
const enc=(s:string)=>encodeURIComponent(s).replace(/%2C/gi,',').replace(/%3B/gi,';');
/** Lekérdezési sztring előtöltött bemenetekhez (a lib/calc/url.ts formátumában); a szám magyar tizedesvesszővel. */
export function calcQuery(params:Record<string,string|number|undefined>):string{
 const parts=Object.entries(params).filter(([,v])=>v!==undefined&&v!=='').map(([k,v])=>enc(k)+'='+enc(typeof v==='number'?String(+v.toFixed(6)).replace('.',','):v!));
 return parts.length?'?'+parts.join('&'):'';
}
export function calcLinkable(slug:string,records:Readonly<Record<string,ReleaseRecord>>=RELEASES,tablesOk=tablesApproved()):boolean{
 const rec=Object.prototype.hasOwnProperty.call(records,slug)?records[slug]:undefined;
 return !!rec&&(!T1_SLUGS.has(slug)||rec.kind==='lektoralt')&&(!TABLE_GATED.has(slug)||tablesOk);
}
/** Link egy közzétett kalkulátorra előtöltött bemenetekkel; nem közzétett célra null (a hívó ilyenkor nem jelenít meg linket). */
export function calcHref(slug:string,params:Record<string,string|number|undefined>={}):string|null{
 return calcLinkable(slug)?CALC_HUB+'/'+slug+calcQuery(params):null;
}
