// TUDÁSTÁR KÖZZÉTÉTELI KAPUJA – az EGYETLEN konfigurációs pont, amely eldönti, melyik cikk (és a szakszótár) látszik élesben
// (a kalkulátoroknál ugyanez a lib/calc/release.ts). Állapotgép (docs/tudastar.md): vázlat → belsőleg ellenőrzött (csak R1/R2)
// → szakmailag lektorált → közzétett; [felfüggesztve]. Egy tétel akkor KÖZZÉTETT (generateStaticParams, sitemap, kereső, belső
// linkek célja, kalkulátoroldali „Kapcsolódó cikkek”, tervezői link), ha (lib/kb/content/gate.ts):
//  - van rekordja ebben a táblában, és a tétel nincs a KB_SUSPENDED-ben,
//  - a rekord `fingerprint`-je egyezik a tartalom mostani ujjlenyomatával (lib/kb/content/fingerprint.ts: metaadat, minden blokk,
//    az ábrák helyőrző-leírása, a források) – ezt a szerver futásidőben is újraszámolja,
//  - a rekord `figures`-e egyezik az ábrák forrás-ujjlenyomatával (scripts/kb-content/figures.ts: a kirajzolt SVG-komponens modulja,
//    a kit.tsx, a FIGURES-bejegyzés szöveges megfelelője és az ábraszínek) – a generált értéket a CI veti össze a forrással,
//  - a kockázati besorolás eléri a szekció és a kategória alsó korlátját (Sémák, védelmi eszközök, érintésvédelem, munkabiztonság,
//    földelés: csak R3 – lib/kb/content/categories.ts `minRisk`),
//  - R1/R2 esetén a rekord „belso” (belső kettős ellenőrzés) vagy „lektoralt”,
//  - R3 esetén (bekötések, FI-relé, földelés, feszültségmentesítés) KIZÁRÓLAG „lektoralt” (docs/tudastar-dontesek.md).
// Ha a tartalom vagy egy ábra bármiben megváltozik, az ujjlenyomat eltér: a tétel kiesik a közzétettek közül, és a tests/kb-content.ts
// megbukik – újra kell ellenőrizni, majd a `node_modules/.bin/tsx scripts/kb-content.ts record <id>` szerinti új rekordot ide írni,
// és a `build`-et újra futtatni (a böngészőbe töltődő keresőindex csak a közzétett tételeket tartalmazza).
// Lektorra váró R3 vázlatnak NINCS rekordja; a törzse nem is generálódik (a szövege nem kerül a buildbe). R3 kiadása lektor után:
// docs/tudastar.md „R3 kiadása”. Fejlesztő, MI-asszisztens vagy a tulajdonos saját hatáskörben „lektoralt” rekordot nem tölthet ki.
// Tiszta adat (a kliensoldali kódba is bekerülhet), ezért a lektor neve csak kifejezett hozzájárulással (showName) szerepelhet itt.
import type {KbRisk,KbSectionId} from './content/types';

/** Belső kettős ellenőrzés (csak R1/R2): szerzői vázlat + tőle független ellenőrzés. Jelvény: „Belsőleg ellenőrizve”. */
export type KbInternalCheck={kind:'belso';section:KbSectionId;risk:'R1'|'R2';by:string;date:string;fingerprint:string;figures?:string;note:string};
/** Szakmai lektori jóváhagyás (R3-nál kötelező; R3-nál a második olvasó is: `secondReader`, a jogosultságával). */
export type KbExpertReview={kind:'lektoralt';section:KbSectionId;risk:KbRisk;qualification:string;date:string;fingerprint:string;figures?:string;approvalRef:string;secondReader?:string;showName?:boolean;reviewer?:string;registry?:string};
export type KbRelease=KbInternalCheck|KbExpertReview;

const FIRST_NOTE='Belső kettős ellenőrzés: szerzői vázlat (MI-segítséggel, ai: vázlat) és tőle független szakmai ellenőrzés (1. kör, 2026-10-10), a számpéldák újraszámolásával. A nyitott kérdések: content/tudastar/lektori-kerdesek-elmelet.md. Szakmai lektor még nem hagyta jóvá.';
/** Az ábra-ujjlenyomat (`figures`) 2026-10-11-től része a rekordnak: az ábrás cikkek rekordja ettől a naptól érvényes, és a független
 * ábra- és felületellenőrzés javításai utáni állapotot rögzíti. */
const FIG_NOTE=' Ábrák (2026-10-11): saját SVG-k a helyőrzők alapján; a rekord a független ábra- és felületellenőrzés javításai (nyílirányok, mobil olvashatóság, feliratok, akadálymentes név) utáni állapotot rögzíti.';
/** Belső kettős ellenőrzés rekordja. `figures`: az ábrák forrás-ujjlenyomata ('' ha nincs ábra); `fix`: későbbi, kisebb tartalmi javítás
 * (dátum és leírás). A dátum az ellenőrzött állapot rögzítésének napja. */
const belso=(section:KbSectionId,risk:'R1'|'R2',fingerprint:string,figures:string,fix?:{date:string;note:string}):KbInternalCheck=>({kind:'belso',section,risk,by:'Villanyrajz szerkesztőség',
 date:fix?.date??(figures?'2026-10-11':'2026-10-10'),fingerprint,...(figures?{figures}:{}),note:FIRST_NOTE+(figures?FIG_NOTE:'')+(fix?' Javítás ('+fix.date+'): '+fix.note:'')});

export const KB_RELEASES:Readonly<Record<string,KbRelease>>={
 // Elmélet – R1 (belső kettős ellenőrzés)
 'elektromos-feszultseg':belso('elmelet','R1','28a86a1d','4de871fb'),
 'elektromos-aram':belso('elmelet','R1','285cbaa9','80133a78'),
 'elektromos-ellenallas':belso('elmelet','R1','047ecf66','371d1e72'),
 'ohm-torvenye':belso('elmelet','R1','87a5c74b','f594593a'),
 'elektromos-teljesitmeny':belso('elmelet','R1','f9264039','e4dddacd'),
 'joule-lenz-torveny':belso('elmelet','R1','175eb858','ac7a38f7'),
 'kirchhoff-torvenyei':belso('elmelet','R1','f467a0b0','7f5cc22c'),
 'soros-es-parhuzamos-kapcsolas':belso('elmelet','R1','248c0815','2b190b4a'),
 'transzformator-mukodese':belso('elmelet','R1','1bf8bbba','2af43d62'),
 'fenyforrasok-tipusai':belso('elmelet','R1','6d155344','6cc5f7c3'),
 'lumen-es-lux':belso('elmelet','R1','7481e1cf','f10e12bf'),
 'szinhomerseklet':belso('elmelet','R1','e451557f','66ac55a5'),
 // Elmélet – R2 (belső kettős ellenőrzés, Figyelem-dobozzal)
 'rovidzarlat-es-tulterheles':belso('elmelet','R2','b2ceb0f8','188ccd82'),
 'vezetekek-szinjelolese':belso('elmelet','R2','62902367','e6f1f98e'),
 'vezetek-es-kabeljelolesek':belso('elmelet','R2','337e4b0e','418ade0f'),
 'ip-vedettseg':belso('elmelet','R2','4d45f290','860caa54',{date:'2026-10-11',note:'a 2. ábra címe „valós méretarányban” helyett „méretarányosan”, a rajz felirata „Méretarányos rajz” (a képernyőn nem 1:1); a független hűségellenőrzés javaslatára, szakmai tartalom nem változott.'}),
 'lampafoglalatok-es-lampatalpak':belso('elmelet','R2','43884155','0a2c0faa',{date:'2026-10-11',note:'a bekötési mondat (L a talppontra, N a menetre) a lektori válaszig kikerült; helyette: „A foglalat bekötése villanyszerelői feladat.” (lektori-kerdesek-elmelet.md, Világítás 1.)'}),
 'szakszotar':belso('elmelet','R2','714b2ce2',''),
 // R3 (kismegszakito, aram-vedokapcsolo-fi-rele, egyenpotencialra-hozas-eph, feszultsegmentesites-ot-szabalya, a Sémák bekötései,
 // foldelesi-rendszerek): lektorra vár – rekord csak szakmai lektor jóváhagyása után (docs/tudastar.md).
};

/** Felfüggesztett tételek (biztonsági hibajelzés, docs/tudastar-terv.md 4.3 és 4.7): a rekord ellenére nem közzétettek. */
export const KB_SUSPENDED:ReadonlySet<string>=new Set<string>([]);
