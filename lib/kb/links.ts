// A tervezőből (plan-editor, Tervsegéd, Fázisterhelés, Méretezés) a Kalkulátorokra mutató linkek – kb. 1 KB, a tervező csak ezt importálja.
// Csak közzétett célra ad linket: a kiadási kapu (lib/calc/release.ts) és a táblázat-jóváhagyás (tablesApproved) szerint.
// A tests/calc.ts ellenőrzi, hogy calcHref() pontosan a közzétett kalkulátorokra ad linket.
import {RELEASES,TABLE_GATED} from '@/lib/calc/release';
import {tablesApproved} from '@/lib/sizing-tables';

import {CALC_HUB} from './categories';
export {CALC_HUB};
const enc=(s:string)=>encodeURIComponent(s).replace(/%2C/gi,',').replace(/%3B/gi,';');
/** Lekérdezési sztring előtöltött bemenetekhez (a lib/calc/url.ts formátumában); a szám magyar tizedesvesszővel. */
export function calcQuery(params:Record<string,string|number|undefined>):string{
 const parts=Object.entries(params).filter(([,v])=>v!==undefined&&v!=='').map(([k,v])=>enc(k)+'='+enc(typeof v==='number'?String(+v.toFixed(6)).replace('.',','):v!));
 return parts.length?'?'+parts.join('&'):'';
}
export const calcLinkable=(slug:string)=>Object.prototype.hasOwnProperty.call(RELEASES,slug)&&(!TABLE_GATED.has(slug)||tablesApproved());
/** Link egy közzétett kalkulátorra előtöltött bemenetekkel; nem közzétett célra null (a hívó ilyenkor nem jelenít meg linket). */
export function calcHref(slug:string,params:Record<string,string|number|undefined>={}):string|null{
 return calcLinkable(slug)?CALC_HUB+'/'+slug+calcQuery(params):null;
}
