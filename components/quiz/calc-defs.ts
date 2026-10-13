// A számolós sablonok kalkulátordefinícióinak lusta betöltése a böngészőben: a tesztoldal csak a KÖZZÉTETT sablonok kalkulátorait tölti
// be (a szerver adja át a listát), a teszt indításakor. A T1-kalkulátorok (feszültségesés, kismegszakító, hurokimpedancia) szigetei csak
// hivatkozásként szerepelnek a dinamikus importok térképében, letöltés nélkül; a T1-sablonok szövege is külön, be nem töltött csomagban van
// (lib/quiz/templates-t1.ts, tests/kb-dist.mjs). A méretezési táblák (lib/sizing-tables.ts) viszont a teszt indításakor betöltődnek, mert a
// közzétett (T0) vezeték-ellenállás kalkulátor is használja őket (a ρ1 üzemi fajlagos ellenállás módjához) – docs/tudastar.md „Tesztek”.
// A definíciót a kalkulátor saját kliensszigete exportálja (components/calc/islands/<slug>.tsx): így a Tesztek ugyanazt a csomagot tölti, mint
// a kalkulátoroldal, és a közös modulok (lib/calc/number, constants, fields …) nem szakadnak ki külön csomagokba – a kalkulátoroldalak JS-e
// nem nő (docs/tudastar.md „Tesztek – méretek”). Minden sablon kalkulátorának itt kell lennie (tests/quiz.ts ellenőrzi).
// Szerveren és tesztben a lib/calc/registry.ts bySlug-ja is használható.
import type {CalcDef} from '@/lib/calc/core';

const pick=(m:{def:CalcDef})=>m.def;
export const DEF_LOADERS:Readonly<Record<string,()=>Promise<CalcDef>>>={
 'ohm-torveny':()=>import('@/components/calc/islands/ohm-torveny').then(pick),
 'teljesitmeny':()=>import('@/components/calc/islands/teljesitmeny').then(pick),
 'aram-teljesitmenybol':()=>import('@/components/calc/islands/aram-teljesitmenybol').then(pick),
 'vezetek-ellenallas':()=>import('@/components/calc/islands/vezetek-ellenallas').then(pick),
 'feszultseges':()=>import('@/components/calc/islands/feszultseges').then(pick),
 'eredo-ellenallas':()=>import('@/components/calc/islands/eredo-ellenallas').then(pick),
 'fogyasztas-koltseg':()=>import('@/components/calc/islands/fogyasztas-koltseg').then(pick),
 'kismegszakito':()=>import('@/components/calc/islands/kismegszakito').then(pick),
 'hurokimpedancia':()=>import('@/components/calc/islands/hurokimpedancia').then(pick),
};
/** A megadott kalkulátorok definíciói (egyszer töltődnek be; hiba esetén a Promise elutasul, a felület ezt jelzi). */
export async function loadDefs(slugs:readonly string[]):Promise<Record<string,CalcDef>>{
 const out:Record<string,CalcDef>={};
 await Promise.all([...new Set(slugs)].map(async s=>{const load=DEF_LOADERS[s];if(!load)throw new Error('Ismeretlen kalkulátor: '+s);out[s]=await load()}));
 return out;
}
