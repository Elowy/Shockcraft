// A Tudástár közzétételi kapujának tiszta szabálya (lib/kb/release.ts fejléce, docs/tudastar.md „Állapotgép, ujjlenyomat, közzétételi
// kapu”). Generált adatot nem importál, ezért a futó szerver (registry.ts releaseInfo) és a generátor (scripts/kb-content/generate.ts:
// a csak közzétett tételeket tartalmazó keresőindex) ugyanezt a függvényt hívja. Kliensszigetbe nem kerülhet (tests/kb-guards.ts).
import type {KbRelease} from '@/lib/kb/release';
import {meetsRiskFloor,riskFloor} from './categories';
import type {KbMeta} from './types';

export type KbState='kozzeteve'|'vazlat'|'lektorra-var'|'ujraellenorzendo'|'felfuggesztve';
export type KbGate={state:KbState;record?:KbRelease;reason:string};

/**
 * Egy tétel kapuállapota. `recomputed`: a tartalom ujjlenyomata a törzsből most újraszámolva (a szerver futásidőben is számolja;
 * a generált meta értékét a CI veti össze). Közzétett, ha:
 *  - van rekordja és nincs felfüggesztve,
 *  - a kockázati besorolás eléri a szekció és a kategória alsó korlátját (Sémák és a biztonságkritikus kategóriák: csak R3),
 *  - a rekord tartalmi ujjlenyomata egyezik a generált és az újraszámolt ujjlenyomattal,
 *  - a rekord ábra-ujjlenyomata (`figures`) egyezik a generálttal (az ábrák forrása: komponens, kit.tsx, FIGURES-bejegyzés, ábraszínek),
 *  - a rekord szekciója és kockázata egyezik a tartaloméval,
 *  - R3-nál a rekord szakmai lektori („lektoralt”).
 */
export function gateState(meta:KbMeta,recomputed:string,records:Readonly<Record<string,KbRelease>>,suspended:ReadonlySet<string>):KbGate{
 const record=Object.prototype.hasOwnProperty.call(records,meta.id)?records[meta.id]:undefined;
 if(suspended.has(meta.id))return {state:'felfuggesztve',record,reason:'Biztonsági hibajelzés miatt felfüggesztve, javítás alatt.'};
 if(!meetsRiskFloor(meta))return {state:'lektorra-var',record,reason:'A szekció vagy a kategória biztonságkritikus ('+riskFloor(meta.section,meta.category)+'): csak R3 besorolással, szakmai lektor jóváhagyásával jelenhet meg.'};
 if(!record)return {state:meta.risk==='R3'?'lektorra-var':'vazlat',reason:meta.risk==='R3'?'Szakmai lektorálásra vár.':'Belső ellenőrzésre vár.'};
 if(record.fingerprint!==meta.fingerprint||record.fingerprint!==recomputed)return {state:'ujraellenorzendo',record,reason:'A tartalom az ellenőrzés óta megváltozott; újra ellenőrizni kell.'};
 if((record.figures??'')!==meta.figures)return {state:'ujraellenorzendo',record,reason:'Az ábrák az ellenőrzés óta megváltoztak; újra ellenőrizni kell.'};
 if(record.section!==meta.section||record.risk!==meta.risk)return {state:'ujraellenorzendo',record,reason:'A rekord szekciója vagy kockázati osztálya eltér a tartalométól.'};
 if(meta.risk==='R3'&&record.kind!=='lektoralt')return {state:'lektorra-var',record,reason:'R3 tartalom csak szakmai lektor jóváhagyásával jelenhet meg.'};
 return {state:'kozzeteve',record,reason:''};
}
