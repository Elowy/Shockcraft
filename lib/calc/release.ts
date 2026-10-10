// KALKULÁTOROK KIADÁSI KAPUJA – az EGYETLEN konfigurációs pont, amely eldönti, melyik kalkulátor látszik élesben.
//
// Egy kalkulátor akkor közzétett (generateStaticParams, sitemap, kereső-link, tervezői mélylink), ha:
//  - van rekordja ebben a táblában,
//  - a rekord ujjlenyomata egyezik a definíció mostani ujjlenyomatával (calcFingerprint, lib/calc/registry.ts),
//  - T0 esetén a rekord „belso” (belső kettős ellenőrzés) vagy „lektoralt”,
//  - T1 esetén a rekord „lektoralt” (szakmai lektor neve, minősítése, névjegyzéki száma, dátuma),
//  - a TABLE_GATED kalkulátoroknál ezen felül tablesApproved() igaz (lib/sizing-tables.ts SIZING_REVIEW),
//  - T2 soha (ilyen kalkulátor nem is épül: tests/calc.ts kényszeríti).
// Ha a definíció bármely tartalmi része (mezők, képletek, példák, szövegek, források, verzió) megváltozik, az ujjlenyomat
// eltér, a kalkulátor kiesik a közzétettek közül, és a tests/calc.ts megbukik: újra kell ellenőrizni / lektoráltatni.
// Kiadás menete: docs/kalkulatorok.md („T1 kalkulátor kiadása lektori jóváhagyás után”); segédszkript: scripts/calc-release.ts.
// Ez a modul tiszta adat (a tervezőbe is bekerül a lib/kb/links.ts-en át), ezért nem importál definíciót.

export type InternalCheck={kind:'belso';by:string;date:string;fingerprint:string;note:string};
export type ExpertReview={kind:'lektoralt';reviewer:string;qualification:string;registry:string;date:string;fingerprint:string;approvalRef?:string};
export type ReleaseRecord=InternalCheck|ExpertReview;

const internal=(fingerprint:string):InternalCheck=>({kind:'belso',by:'Villanyrajz fejlesztés',date:'2026-10-10',fingerprint,note:'Kettős ellenőrzés: a példák elvárt értékeit független (Python) újraszámolás adta, a motor eredményét golden teszt veti össze (tests/calc-golden.ts).'});

export const RELEASES:Readonly<Record<string,ReleaseRecord>>={
 // T0 – belső kettős ellenőrzés („Belsőleg ellenőrizve”)
 'ohm-torveny':internal('11866cb9'),
 'teljesitmeny':internal('ebd0fc6c'),
 'aram-teljesitmenybol':internal('19453f3d'),
 'latszolagos-meddo-teljesitmeny':internal('6cbe82be'),
 'vezetek-ellenallas':internal('7ea2da36'),
 'eredo-ellenallas':internal('ad526130'),
 'fogyasztas-koltseg':internal('eb802c58'),
 'fazisterheles':internal('3f562c9d'),
 'mertekegyseg-atvalto':internal('7b854782'),
 'eredo-kapacitas':internal('670d1593'),
 'feszultsegoszto':internal('922d8fd7'),
 'ellenallas-szinkod':internal('5b2e0380'),
 'lumen-lux':internal('0fd415b1'),
 'csillag-delta':internal('c42e7ecf'),
 'transzformator':internal('3f53127a'),
 'akkumulator-uzemido':internal('f6b2899c'),
 'led-elotet-ellenallas':internal('a05d9553'),
 'reaktancia-rezonancia':internal('f55841f0'),
 'homerseklet':internal('1475a061'),
 // T1 – szakmai lektori jóváhagyásra vár (feszultseges, motor-aram, led-szalag-tapegyseg, fazisjavitas,
 // keresztmetszet, kismegszakito, hurokimpedancia, terhelhetoseg-tablazat). Kiadás: docs/kalkulatorok.md.
};

/** A lib/sizing-tables.ts táblázataira épülő kalkulátorok: csak tablesApproved() mellett adhatók ki. */
export const TABLE_GATED:ReadonlySet<string>=new Set(['keresztmetszet','kismegszakito','hurokimpedancia','terhelhetoseg-tablazat']);
