// KALKULÁTOROK KIADÁSI KAPUJA – az EGYETLEN konfigurációs pont, amely eldönti, melyik kalkulátor látszik élesben.
//
// Egy kalkulátor akkor közzétett (generateStaticParams, sitemap, hub-link, kereső-link, tervezői mélylink), ha:
//  - van rekordja ebben a táblában,
//  - a rekord `fingerprint`-je egyezik a definíció mostani tartalmi ujjlenyomatával (calcFingerprint, lib/calc/registry.ts:
//    mezők, képletek, példák, szövegek, források, verzió) – ezt futásidőben is ellenőrizzük,
//  - a rekord `source`-a egyezik a számítás forrásának ujjlenyomatával (scripts/calc-source.ts: a definíció ÉS a futásidőben
//    importált helyi modulok szövege, így a compute, a levezetés és a kiírás kódja is) – ezt a CI (tests/calc.ts) ellenőrzi,
//    mert a lefordított kód buildenként eltér,
//  - T0 esetén a rekord „belso” (belső kettős ellenőrzés) vagy „lektoralt”,
//  - T1 esetén (T1_SLUGS) a rekord „lektoralt” (szakmai lektor neve, minősítése, névjegyzéki száma, dátuma),
//  - a TABLE_GATED kalkulátoroknál ezen felül tablesApproved() igaz (lib/sizing-tables.ts SIZING_REVIEW),
//  - T2 soha (ilyen kalkulátor nem is épül: tests/calc.ts kényszeríti).
// Ha a definíció vagy a számítás kódja bármiben megváltozik, valamelyik ujjlenyomat eltér, és a tests/calc.ts megbukik
// (tartalmi eltérésnél a kalkulátor futásidőben is kiesik a közzétettek közül): újra kell ellenőrizni / lektoráltatni.
// A tesztek az elvárt állapotot ebből a táblából vezetik le, így egy T1 kiadásához csak ezt a fájlt kell szerkeszteni.
// Kiadás menete: docs/kalkulatorok.md („T1 kalkulátor kiadása lektori jóváhagyás után”); segédszkript: scripts/calc-release.ts.
// Ez a modul tiszta adat (a tervezőbe is bekerül a lib/kb/links.ts-en át), ezért nem importál definíciót.

/** `fingerprint`: tartalmi ujjlenyomat (calcFingerprint); `source`: a számítás forrásának ujjlenyomata (scripts/calc-source.ts). */
export type InternalCheck={kind:'belso';by:string;date:string;fingerprint:string;source:string;note:string};
export type ExpertReview={kind:'lektoralt';reviewer:string;qualification:string;registry:string;date:string;fingerprint:string;source:string;approvalRef?:string};
export type ReleaseRecord=InternalCheck|ExpertReview;

const internal=(fingerprint:string,source:string):InternalCheck=>({kind:'belso',by:'Villanyrajz fejlesztés',date:'2026-10-10',fingerprint,source,note:'Két független számítás egyezése: a példák elvárt értékeit a TypeScript-motortól független Python-újraszámolás adta (scripts/calc-golden-indep.py), a motor eredményét relatív tűrésű golden teszt veti össze (tests/calc-golden.ts). Második személy általi kézi újraszámolás még nem történt (docs/kalkulatorok.md).'});

export const RELEASES:Readonly<Record<string,ReleaseRecord>>={
 // T0 – belső kettős ellenőrzés („Belsőleg ellenőrizve”)
 'ohm-torveny':internal('c6a6774b','99ac2894'),
 'teljesitmeny':internal('ebd0fc6c','1f711e4b'),
 'aram-teljesitmenybol':internal('3a41fde4','76524b79'),
 'latszolagos-meddo-teljesitmeny':internal('6cbe82be','d2d2e986'),
 'vezetek-ellenallas':internal('d9071472','03bb79b2'),
 'eredo-ellenallas':internal('ad526130','e61119a4'),
 'fogyasztas-koltseg':internal('287866bc','c220950e'),
 'fazisterheles':internal('6bbaec42','554c9453'),
 'mertekegyseg-atvalto':internal('7b854782','8a49676e'),
 'eredo-kapacitas':internal('670d1593','0a5f698b'),
 'feszultsegoszto':internal('922d8fd7','01014826'),
 'ellenallas-szinkod':internal('50f728ed','6419689d'),
 'lumen-lux':internal('0fd415b1','b51fe718'),
 'csillag-delta':internal('c42e7ecf','7a592299'),
 'transzformator':internal('ce794de1','ff2e4c99'),
 'akkumulator-uzemido':internal('f6b2899c','aaaea291'),
 'led-elotet-ellenallas':internal('a05d9553','f48a077d'),
 'reaktancia-rezonancia':internal('f55841f0','5bc5f3d9'),
 'homerseklet':internal('ef0fcb3b','bdf025c1'),
 // T1 – szakmai lektori jóváhagyásra vár (feszultseges, motor-aram, led-szalag-tapegyseg, fazisjavitas,
 // keresztmetszet, kismegszakito, hurokimpedancia, terhelhetoseg-tablazat). Kiadás: docs/kalkulatorok.md.
};

/** A T1 kalkulátorok: csak „lektoralt” rekorddal adhatók ki (a tests/calc.ts egyezteti a definíciók szintjével).
 * A lib/kb/links.ts (tervezői linkek) a definíciók nélkül ebből tudja, hogy belső rekord nem elég. */
export const T1_SLUGS:ReadonlySet<string>=new Set(['feszultseges','motor-aram','led-szalag-tapegyseg','fazisjavitas','keresztmetszet','kismegszakito','hurokimpedancia','terhelhetoseg-tablazat']);
/** A lib/sizing-tables.ts táblázataira épülő kalkulátorok: csak tablesApproved() mellett adhatók ki. */
export const TABLE_GATED:ReadonlySet<string>=new Set(['keresztmetszet','kismegszakito','hurokimpedancia','terhelhetoseg-tablazat']);
