# Kalkulátorok

Ingyenes, belépés, süti és előfizetés nélkül használható villamos kalkulátorok a `/kalkulatorok` címen – a Villanyszerelő Tudástár első közzétett szekciója. Mérvadó terv: `docs/tudastar-terv.md` (1., 2., 3., 5. fejezet, 9. fejezet 1–2. fázis); terméktulajdonosi döntések: `docs/tudastar-dontesek.md`.

## Elérés

| Hol | Mi |
|---|---|
| Nyilvános fejléc (`components/public-shell.tsx`) | „Kalkulátorok” első szintű link; 600 px alatt márka + „Kalkulátorok” + JS nélkül is nyíló „Menü” (`<details>`) |
| Lábléc | „Tudástár” oszlop (a név a `KB_NAME` konstansból) |
| Főoldal (`components/home-page.tsx`) | „Ingyenes kalkulátorok – belépés nélkül” szakasz (csak közzétett kalkulátor kap linket), `home-fine` mondat, GYIK-tétel |
| Belépési kapu (`components/planner-access.tsx`) | „Belépés nélkül is használhatod” doboz |
| Tervező felső sávja (`components/plan-editor.tsx`) | Kalkulátorok ikonlink, új lapon (a szerkesztési állapot megmarad) |
| Tervsegéd (`components/plan-tools.tsx`) | „Kalkulátorok ↗” a „Telepítési útmutató (PDF)” mellett |
| Fázisterhelés fül (`components/phase-load-report.tsx`) | elosztónként mélylink a Fázisterhelés kalkulátorra, előtöltött L1/L2/L3 teljesítménnyel |
| Méretezés fül (`components/sizing-report.tsx`) | áramkörönként mélylink a Feszültségesés kalkulátorra – **csak a T1 kiadása után jelenik meg** (`calcHref` addig `null`) |

A tervező a kézikönyvből csak a `lib/kb/links.ts`-t importálja (≈1 KB: `CALC_HUB`, `calcHref`, `calcLinkable`); a link csak közzétett kalkulátorra mutat (`tests/calc.ts`).

## Kalkulátorok és kiadási állapot

T0 = tankönyvi matematika/átváltás (belső kettős ellenőrzéssel kiadható); T1 = szabványhoz vagy biztonsághoz kötött (csak szakmai lektor jóváhagyása után); T2 (motor-kondenzátor, teljesítményigény) **nem épül meg** – a `tests/calc.ts` kényszeríti.

| Slug | Cím | Kategória | Szint | Állapot |
|---|---|---|---|---|
| `ohm-torveny` | Ohm-törvény | Alapok | T0 | közzétéve – Belsőleg ellenőrizve |
| `eredo-ellenallas` | Eredő ellenállás (soros, párhuzamos) | Alapok | T0 | közzétéve |
| `csillag-delta` | Csillag–delta átalakítás | Alapok | T0 | közzétéve |
| `teljesitmeny` | Villamos teljesítmény | Teljesítmény és energia | T0 | közzétéve |
| `aram-teljesitmenybol` | Áram teljesítményből | Teljesítmény és energia | T0 | közzétéve |
| `latszolagos-meddo-teljesitmeny` | Látszólagos és meddő teljesítmény | Teljesítmény és energia | T0 | közzétéve |
| `fogyasztas-koltseg` | Fogyasztás és költség | Teljesítmény és energia | T0 | közzétéve |
| `fazisterheles` | Fázisterhelés és nullavezető-áram | Teljesítmény és energia | T0 | közzétéve |
| `vezetek-ellenallas` | Vezeték-ellenállás | Vezetékek | T0 | közzétéve |
| `lumen-lux` | Lumen és lux (lámpák száma) | Világítás | T0 | közzétéve |
| `transzformator` | Transzformátor áttétele és áramai | Gépek és akkuk | T0 | közzétéve |
| `akkumulator-uzemido` | Akkumulátor üzemideje | Gépek és akkuk | T0 | közzétéve |
| `eredo-kapacitas` | Eredő kapacitás | Elektronika | T0 | közzétéve |
| `feszultsegoszto` | Feszültségosztó | Elektronika | T0 | közzétéve |
| `ellenallas-szinkod` | Ellenállás színkódja | Elektronika | T0 | közzétéve |
| `led-elotet-ellenallas` | LED előtét-ellenállás | Elektronika | T0 | közzétéve |
| `reaktancia-rezonancia` | Reaktancia és rezonancia | Elektronika | T0 | közzétéve |
| `mertekegyseg-atvalto` | Mértékegység-átváltó (kW–LE–hp, AWG–mm², átmérő, kWh–MJ) | Átváltók | T0 | közzétéve |
| `homerseklet` | Hőmérséklet: átváltás és ellenállás | Átváltók | T0 | közzétéve |
| `feszultseges` | Feszültségesés | Vezetékek | T1 | kiadatlan – „Hamarosan – szakmai lektorálás alatt” |
| `motor-aram` | Motor névleges árama | Gépek és akkuk | T1 | kiadatlan |
| `led-szalag-tapegyseg` | LED-szalag tápegysége | Világítás | T1 | kiadatlan |
| `fazisjavitas` | Fázisjavítás | Teljesítmény és energia | T1 | kiadatlan |
| `keresztmetszet` | Keresztmetszet-választás | Vezetékek | T1 + táblázat | kiadatlan; `tablesApproved()` is kell |
| `kismegszakito` | Kismegszakító-választás | Védelem | T1 + táblázat | kiadatlan; `tablesApproved()` is kell |
| `hurokimpedancia` | Hurokimpedancia és zárlati áram | Védelem | T1 + táblázat | kiadatlan; `tablesApproved()` is kell |
| `terhelhetoseg-tablazat` | Terhelhetőségi táblázat | Vezetékek | T1 + táblázat | kiadatlan; `tablesApproved()` is kell |

Az aktuális állapot és az ujjlenyomatok: `node_modules/.bin/tsx scripts/calc-release.ts list`.

A kiadatlan kalkulátor nem kerül a `generateStaticParams`-ba (az oldala 404), a sitemapbe és a tervezői linkek közé; a hubon és a keresőben link nélküli „Hamarosan – szakmai lektorálás alatt” kártyaként látszik (a táblázatalapúaknál „A táblázatértékek tervezői jóváhagyása is folyamatban.” kiegészítéssel).

## Kiadási kapu – egyetlen konfigurációs pont

`lib/calc/release.ts` (`RELEASES`, `T1_SLUGS`, `TABLE_GATED`). Egy kalkulátor akkor közzétett (`releaseInfo()` a `lib/calc/registry.ts`-ben), ha:

1. van rekordja a `RELEASES`-ben;
2. a rekord `fingerprint`-je egyezik a definíció mostani `calcFingerprint()`-jével (tartalmi ujjlenyomat, FNV-1a a `lib/sizing-tables.ts` `fingerprint()`-jével: mezők, képletek, példák és elvárt értékeik, szövegek, források, „nem vizsgált” lista, verzió) – ezt futásidőben is ellenőrizzük;
3. a rekord `source`-a egyezik a számítás forrásának ujjlenyomatával (`scripts/calc-source.ts`: a `lib/calc/defs/<slug>.ts` és minden futásidőben importált helyi modulja – `core`, `number`, `fields`, `formulas`, `constants`, `units`, a T1-eknél `lib/sizing-formulas.ts` és `lib/sizing-tables.ts`, a fázisterhelésnél `lib/phase-load.ts` … – szövegének lenyomata). Így a `compute`, a levezetés, a verdikt- és figyelmeztetésszövegek és a kiírás kódja is rögzített. Egyetlen kivétel a `lib/sizing-tables.ts` `SIZING_REVIEW`-objektuma (a táblázatjóváhagyás adatai, `sourceText()`): ennek kitöltése nem változtatja meg a táblázatokat használó kalkulátorok forrás-ujjlenyomatát, így a lektori csomagban jóváhagyott ujjlenyomat-pár a rögzítés sorrendjétől függetlenül érvényes. Ezt a CI (`tests/calc.ts`) ellenőrzi fájlból újraszámolva; futásidőben nem lehet, mert a lefordított kód buildenként eltér;
4. T0-nál a rekord `kind:'belso'` vagy `'lektoralt'`; T1-nél (`T1_SLUGS`) kötelezően `'lektoralt'`;
5. a `TABLE_GATED` kalkulátoroknál ezen felül `tablesApproved()` igaz (`SIZING_REVIEW`, `lib/sizing-tables.ts`).

Ha a definíció tartalma vagy a számítás kódja bármiben változik (egy közös modul, pl. a `lib/calc/number.ts` módosítása minden azt használó kalkulátort érint), valamelyik ujjlenyomat eltér, és a `tests/calc.ts` megbukik („az ujjlenyomat eltér” / „a forrás-ujjlenyomat eltér”, a felsorolt forrásfájlokkal); tartalmi eltérésnél a kalkulátor futásidőben is kiesik a közzétettek közül. Ilyenkor újra el kell végezni az ellenőrzést, majd frissíteni a rekordot: T0-nál a `tests/calc-golden.ts` és a független újraszámolás (`scripts/calc-golden-indep.py`) egyezése után a `node_modules/.bin/tsx scripts/calc-release.ts record <slug>` szerinti új `fingerprint`/`source` kerül az `internal(…)` hívásba; T1-nél ez új lektori jóváhagyást jelent, ezért a T1-ek által használt közös modulokhoz (`lib/sizing-formulas.ts`, `lib/sizing-tables.ts`, `lib/calc/number.ts`, `core.ts`, `fields.ts`) csak indokolt esetben nyúljunk. Az eltéréseket a `scripts/calc-release.ts list` „FORRÁS VÁLTOZOTT” oszlopa mutatja.

A `lib/kb/links.ts` (tervezői linkek) a definíciók nélkül ugyanezt a szabályt alkalmazza (rekord, T1-nél `lektoralt`, táblázat-kapu); az ujjlenyomat-eltérést ott nem tudja újraszámolni – azt a CI fogja meg (`tests/calc.ts`: `calcHref()` pontosan a közzétett kalkulátorokra ad linket).

### T0 belső kettős ellenőrzés

A példák elvárt értékeit a TypeScript-motortól független Python-újraszámolás adja (`scripts/calc-golden-indep.py`), a motor eredményét a `tests/calc-golden.ts` veti össze velük (217 eset: 123 definíciós példa, 63 kiegészítő, 31 tervbeli érték). Az összevetés **relatív** tűrésű (`closeTo`: |kapott − elvárt| ≤ 10⁻⁴ · |elvárt|, elvárt = 0-nál abszolút 10⁻¹²) – egy korábbi `max(1, |elvárt|)`-os változat az 1 alatti értékeket (pl. 3,2 · 10⁻⁷ F) gyakorlatilag nem ellenőrizte. Mutációs próba is fut: minden kalkulátornál a 0,1 %-os eltérés, az eredő kapacitásnál a soros/párhuzamos csere és a ×2 is elbukik. A „Belsőleg ellenőrizve” rekordok (`by: 'Villanyrajz fejlesztés'`) e két független számítás egyezésén alapulnak; az oldal meta-sora ezt így írja: „Ellenőrzés: két független számítás egyezése (automatikus teszt)”. **Második személy általi kézi újraszámolás még nem történt** (lásd „Eltérések a tervtől”). Javasolt az élesítés előtt: a terméktulajdonos vagy egy második személy kalkulátoronként legalább egy-két kidolgozott példát kézzel számoljon újra, és a neve kerüljön a rekord `by`/`note` mezőjébe; a szakmai lektor az első lektori körben a T0-kat is jóváhagyhatja – ekkor a rekord `kind:'lektoralt'`-ra vált, a jelvény „Szakmailag lektorálta: …”.

### T1 kalkulátor kiadása lektori jóváhagyás után

1. **Lektori anyag: a lektori csomag 3. része** (`docs/lektori-csomag.pdf`, LK-3-tól; folyamat: `docs/lektoralas.md`). Kalkulátoronként egy `KAL-<SLUG>` blokk: cél, mire jó / mire nem, „Nem vizsgált”, a képletek és a feltételezések a kalkulátoroldal szövegével, minden bemenet alapértékkel és tartománnyal, a saját állandók forrással, a képletek behelyettesítve, a programozott döntések és legalább két kézzel számolt példa – mind a `runCalc`-kal összevetve (`tests/lektori-csomag.ts`). A blokk elején áll a `scripts/calc-release.ts list` szerinti két ujjlenyomat (tartalmi és forrás); a közös működést a `KAL-KOZOS` blokk írja le. A táblázatértékekre a csomag 1. része vonatkozik; a táblázatalapúak kiadásához a `SIZING_REVIEW` jóváhagyása is kell. A `hurokimpedancia` és a `kismegszakito` a cmin tényezőt is használja: a lektori csomag T-K-CMIN kérdésére (hatályos MSZ HD 60364-4-41 kiadás, Cmin = 0,95?) adott válasz előtt nem adható ki; ha a válasz 0,95, a `lib/sizing-tables.ts` `cmin` értéke és a forrás kiadási éve javítandó (ez a táblázat-ujjlenyomatot és a két kalkulátor forrás-ujjlenyomatát is megváltoztatja, tehát új csomagkiadást). A lektor a kalkulátort előnézetben ki is próbálhatja (lásd alább).
2. **Jóváhagyás.** A lektor a csomag jóváhagyó lapjának „3. rész – kalkulátoronkénti döntés” táblázatában kalkulátoronként jelöli: „Jóváhagyom” vagy „Javítás után / nem” – a jóváhagyás így **egy adott ujjlenyomat-párra** szól. Módosítási kérésnél a definíciót javítjuk, a `version`-t emeljük, új csomagkiadást készítünk, és a változott tételekre kérjük újra a jóváhagyást.
3. **Rekord – ez az egyetlen szerkesztendő fájl.** `node_modules/.bin/tsx scripts/calc-release.ts record <slug>` kiírja a rekordvázat (`fingerprint` és `source` már kitöltve – egyezniük kell a lap sorával); ezt a `lib/calc/release.ts` `RELEASES` táblájába kell másolni, és kitölteni a lektor nevével, minősítésével, névjegyzéki számával, a dátummal, a jóváhagyás azonosítójával (`approvalRef`: „Lektori csomag LK-<n> (…), csomag: <csomag-ujjlenyomat>, 3. rész: <kalkulátor-ujjlenyomat>; jóváhagyó lap: <iktatási hely>” – a `tests/lektori-csomag.ts` ellenőrzi) és a `showName` mezővel: `true` csak a lapon jelölt hozzájárulással; anélkül a jelvény „Szakmailag lektorálta: <minősítés> · <dátum>”, a lábléc „Szakmai lektor: <minősítés>” (`lib/calc/registry.ts` `expertShown`). A rekord érvénye a `showName`-től nem függ. Fejlesztő, MI-asszisztens vagy a tulajdonos saját hatáskörben nem töltheti ki (részletek: `docs/lektoralas.md` 4.2).
4. **Táblázat-kapu.** A `keresztmetszet`, `kismegszakito`, `hurokimpedancia` és `terhelhetoseg-tablazat` csak akkor jelenik meg, ha a `SIZING_REVIEW` is jóváhagyott (`tablesApproved()`); addig a hubon „Hamarosan – a táblázatértékek tervezői jóváhagyása folyamatban”.
5. **Ellenőrzés.** `tests/calc.ts`, `tests/calc-golden.ts`, `tests/kb-guards.ts` zöld; `scripts/calc-release.ts list` szerint `kozzeteve`. **Tesztet nem kell átírni:** a `tests/calc.ts` az elvárt állapotot (közzétett / kiadatlan / táblázatra vár, a közzétettek száma, `calcHref`, hub-metaadat) a `RELEASES`-ből és a `tablesApproved()`-ból vezeti le, a build utáni `tests/kb-routes.mjs` pedig a hub linkjeiből és a `lib/calc/defs` listájából (hub-link ⇔ 200 ⇔ sitemap, a többi 404). A sitemap, a `generateStaticParams`, a hub kártyája és a tervező mélylinkje (pl. a Méretezés fül „Feszültségesés a kalkulátorban ↗”) ugyanebből a szabályból automatikusan követi.
6. **Telepítés.** A statikus oldalak `revalidate=3600`; deploykor azonnal élesedik. Build után: `BASE=… node tests/kb-routes.mjs` mindkét targeten.

Visszavonás (pl. hibajelzés miatt): a rekord törlése a `RELEASES`-ből, majd deploy – a kalkulátor újra „Hamarosan” lesz.

### Lektori előnézet

`SHOCKCRAFT_KB_PREVIEW=1` (csak helyi vagy staging környezetben, **élesben soha**): minden megépült kalkulátor elérhető „Tervezet – nem lektorált” sávval, `noindex`-szel; a sitemap továbbra is csak a közzétetteket tartalmazza. Helyben:

    CLOUDFLARE_INCLUDE_PROCESS_ENV=true SHOCKCRAFT_KB_PREVIEW=1 APP_ORIGIN=http://localhost:5173 npm run dev

## Architektúra

| Réteg | Fájlok |
|---|---|
| Motor (tiszta, zod és `lib/plan` nélkül, kliensen is fut) | `lib/calc/number.ts` (`parseNum`: tizedesvessző/-pont, szóközös ezresek, unicode mínusz, `1e3`; `formatNum`: 1 alatt 4 értékes jegy (legfeljebb 6 tizedes), 1–10 között 4, 10 fölött 10 000-ig 5 értékes jegy (legfeljebb 3 tizedes: 12,346; 185,67; 9976,6), afölött egész; 10⁻⁶ alatt normálalak (5·10⁻¹⁵); kiírás és kerekítés előtt a lebegőpontos zaj levágva (`clean`: 18 651,499999999996 → 18 652 Ft, 139,99999999999997 → 140); `formatSI` az előtag határán egy előtaggal feljebb lép (0,999999 Ω → „1 Ω”, nem „1000 mΩ”), `sig`-gel tetszőleges értékes jegyre; `floorTo`/`floorLength` lefelé kerekítés zaj nélkül; `formatCompare`), `units.ts`, `constants.ts` (ρ20, α, LE, hp, AWG, E12/E24, MCB-sor, színkód – mind forrással), `core.ts` (`CalcDef`, `runCalc` – soha nem dob, NaN/Infinity nem jut ki), `url.ts`, `formulas.ts`, `fields.ts`, `sizing-fields.ts`, `categories.ts`, `release.ts`, `registry.ts` (szerver), `defs/*.ts` |
| Méretezési képletek | `lib/sizing-formulas.ts` – kiemelve a `lib/sizing.ts`-ből viselkedésváltozás nélkül (a `lib/sizing.ts` ugyanazokat az objektumokat re-exportálja; `tests/sizing-formulas.ts`). Csak a `lib/sizing-tables.ts`-t importálja; minden szabványhoz kötött szám onnan jön. |
| Fázisterhelés | `phaseTotals()` a `lib/phase-load.ts`-ben (a `phaseLoad()` is ezt hívja) |
| Kézikönyv-keret | `lib/kb/categories.ts` (`KB_NAME`, `KB_TITLE`, szekciók, `visibleSections`, `CALC_HUB`), `safety.ts`, `search.ts`, `storage.ts`, `theme.ts`, `links.ts`; `lib/site-origin.ts` (`siteOrigin`, `kbPreview` – a `cloudflare:workers` env-ből) |
| Komponensek | `components/kezikonyv/` (Shell, AppBar, KbChrome: kereső, menü, kedvencek; ThemeBoot, JsonLd, SafetyNotice, PlannerCta, ReportLink), `components/calc/` (Calculator, CalcIndex, CalcExample, CalcFigure, `islands/` kalkulátoronként egy kliensszigettel) |
| Útvonalak | `app/(kezikonyv)/layout.tsx` (ThemeBoot, metadataBase, viewport), `kezikonyv.css`, `kalkulatorok/layout.tsx` (Shell), `page.tsx` (hub), `[slug]/page.tsx`, `not-found.tsx`; `app/sitemap.ts`, `app/robots.ts` |
| Fejlécek | `next.config.ts`: CSP, nosniff, Referrer- és Permissions-Policy a `/:root(tudastar|kalkulatorok)`, `/tudastar/:path*`, `/kalkulatorok/:path*` forrásokra |

**Renderelés.** A hub és a kalkulátoroldalak `dynamic='force-static'`, `revalidate=3600`; a `[slug]` oldal `dynamicParams=false`, `generateStaticParams()` = közzétett kalkulátorok. Az URL-paramétereket a kliens olvassa (`useSyncExternalStore`, üres szerver-pillanatkép), így minden lekérdezés ugyanazt a gyorsítótárazott oldalt kapja; az űrlap a keresési sztringből `key`-vel mountolódik újra. A kidolgozott példa és a teljes kategorizált lista SSR-ben, JS nélkül is olvasható.

**Bundle.** Kalkulátoronként külön kliensszigeten (`components/calc/islands/<slug>.tsx`), amely csak a saját definícióját húzza be; a registry és az env-olvasás szerveroldali marad (`tests/kb-guards.ts`). Mért méret (Sites build, 2026-10-10, Playwright, a letöltött JS gzip-pel): `calculator` ≈ 10,9 KB gz, egy definíció ≈ 2 KB gz, a keret (`kb-chrome`) ≈ 4 KB gz; a kézikönyv-specifikus JS a hubon ≈ 11 KB, az Ohm-törvény oldalán ≈ 23 KB, a Fázisterhelésén ≈ 26 KB gz (keret: ≤ 40 KB, ebből a kalkulátoroldal saját JS-e ≤ 30 KB); a közös React/vinext-alap (≈ 145 KB gz) minden oldalon azonos. A tervezőre gyakorolt hatást lásd az „Eltérések a tervtől” JS-költségkeret pontjában.

**URL-formátum.** `/kalkulatorok/<slug>?<mező>=<nyers>`, egység: `<mező>.e=<egység>`, lista: `R=10;22;47`, sorok: `sorok=2000*0,25*1;60*5*3`. A vessző és a pontosvessző olvasható marad. Az ismeretlen, túl hosszú vagy érvénytelen paramétert eldobjuk; az oda-vissza alakítás veszteségmentes.

**Böngészőtárolás** (a szerverre nem kerül; a `components/legal-page.tsx` sütitáblázatában): `shockcraft-kb-bookmarks-v1` (kedvencek, ≤ 300 – csak a csillaggal), `shockcraft-kb-recent-v1` (`items` ≤ 30 legutóbbi kalkulátor a bemenetekkel – csak akkor, ha a felhasználó egy bemenetet módosított, 1,5 s tétlenség után; a puszta megnyitás, megosztott linkkel sem, nem ír; `searches` ≤ 8 keresés – találat kiválasztásakor), `shockcraft-kb-prefs-v1` (csak akkor jön létre, ha a felhasználó a Menüben kikapcsolja a „/” gyorsbillentyűt), és a tervezővel közös `shockcraft-theme`. Az előzmények tételenként és egyszerre is törölhetők a „Kedvencek és előzmények” fiókban (mobilon és asztalon is elérhető). Minden hozzáférés try/catch-ben; privát módban memóriabeli tartalék és jelzés.

**Felület.** Mobil-első: 56 px-es alkalmazásfejléc (← szülőlista / Villanyrajz-jel, szekciónév, Keresés, Kedvencek, Menü), alsó navigáció (csak a tartalommal rendelkező szekciók – most a Kalkulátorok), mező-fókuszban rejtve; asztalon (≥ 950 px) PublicHeader `current` proppal és ugyanazokkal a műveletekkel, mint mobilon: Keresés (`/`, Ctrl+K), Kedvencek és előzmények, Menü (háromállású téma: világos / sötét / rendszer szerint, a „/” gyorsbillentyű kikapcsolása, hibajelzés, jogi linkek); 950–1100 px között a „Mire használható?” fejléclink rejtve, hogy a fejléc ne törjön két sorba; szekciófülek, bal oldalsáv, ≥ 1240 px-en jobb oldali tartalomjegyzék (az oldal sorrendjében). A fiókok bezárása után a fókusz a megnyitó gombra tér vissza; a „Visszavonás” értesítés nem tűnik el, amíg az egér vagy a fókusz rajta van. Világos/sötét/rendszer téma villanás nélkül (inline indítószkript, `<html suppressHydrationWarning>`; a tárolóolvasás külön try-ban, így tiltott localStorage mellett is a rendszertéma érvényesül). JS nélkül a csak szkripttel működő vezérlők (kereső, űrlap, műveletgombok) rejtve (`html:not(.js)`), helyettük `<noscript>` megjegyzés; a lista, a képletek és a kidolgozott példa olvasható. Az alapfigyelmeztetés `<aside aria-label="Fontos tudnivaló">` tájékozódási pontban. Nyomtatás számítási lapként (URL, dátum, verzió, ujjlenyomat, figyelmeztetés).

**Kalkulátoroldal.** H1, leírás, jelvény (Belsőleg ellenőrizve / Szakmailag lektorálta), műveletek (Kedvenc `aria-pressed` + „Visszavonás”, Link másolása, Eredmény másolása, Nyomtatás), bemenetek (szöveges mezők `inputMode=decimal`-lal; a listamezők és a negatív értéket is elfogadó mezők `inputMode=text`-tel, mert a mobil tizedes-billentyűzeten nincs „;” és „−”; az akadálymentes név szimbólummal és egységgel, pl. „Keresztmetszet A (mm²)”; egységválasztó, magyar hibaüzenet a mező alatt), eredménykártya (`aria-live`, 700 ms tétlenség után, hibánál a mező nevével; a fő dobozban a `primary` eredmények, ha nincs ilyen, az első eredmény), verdikt („Számítás szerint …”), figyelmeztetések, saját SVG-ábra (teljesítményháromszög, ΔU-sáv, fázissávok, ellenállássávok), Levezetés (képlet → behelyettesítés számokkal → eredmény → forrás; az „I_N”, „P_átl” jelölés a felületen alsó indexként jelenik meg), lefelé kerekített hossznál „(lefelé kerekítve)” jelöléssel, Feltételezések, Képletek, Mire jó / mire nem, T1-nél nem zárható figyelmeztetés (táblázatalapúnál a „szabványhoz kötött számítás” szöveg, a többinél – motoráram, LED-szalag tápegység, fázisjavítás – a kalkulátor-figyelmeztetés kiemelve, táblázatemlítés nélkül) + „Nem vizsgált” + táblázatállapot (`reviewText()`), Kidolgozott példa (SSR), Kapcsolódó kalkulátorok, Források, verzió/ujjlenyomat, „Hibát találtál?” (mailto), egy tervező-blokk a tartalom után. JSON-LD: BreadcrumbList + WebApplication (`isAccessibleForFree`). `<title>`: „<cím> – Kalkulátorok – Villanyrajz”, ha legfeljebb 60 karakter, különben „<cím> – Villanyrajz” (`calcSeoTitle`, terv 3.7); `og:site_name` és `og:locale` minden oldal saját `openGraph` objektumában is (`OG_BASE` – a Next metaadat-összevonása sekély, a layoutét felülírná). A 404-oldal (ismeretlen vagy kiadatlan kalkulátor) saját címet kap („Nem található – Kalkulátorok – Villanyrajz”, `noindex`), és asztalon egyoszlopos (`kk-page-single`).

## Új kalkulátor hozzáadása

1. `lib/calc/defs/<slug>.ts` – `CalcDef` (≥ 2 példa; a leírás 80–160 karakter; T1-nél `notCovered`, `safety` és „számítás szerint” szóhasználat, „megfelel”/„szabványos” nélkül).
2. Felvétel a `lib/calc/registry.ts` `CALCULATORS` listájába és a `components/calc/islands/` alá (egy sziget + az `index.ts` térkép).
3. Az elvárt értékek független újraszámolása (`scripts/calc-golden-indep.py`), szükség esetén kiegészítő esetek a `tests/calc-golden.ts`-be.
4. Kiadás a fenti kapun át (T0: `internal(<ujjlenyomat>)`; T1: lektori rekord).

## Tesztek

    node_modules/.bin/tsx tests/calc.ts            # motor, registry, kiadási kapu (állapot a RELEASES-ből, tartalmi és forrás-ujjlenyomat), linkek, URL, fuzz, 10 000 seedes tulajdonságteszt, egyezés a Méretezés/Fázisterhelés számításával, ellenőrzési regressziók
    node_modules/.bin/tsx tests/calc-golden.ts     # 217 golden eset, relatív tűréssel, mutációs próbával
    node_modules/.bin/tsx tests/kb-search.ts       # kereső (szinonimák, elírás, rangsor)
    node_modules/.bin/tsx tests/kb-storage.ts      # vendégtárolás
    node_modules/.bin/tsx tests/kb-guards.ts       # importgráf- és szövegőrök (db, auth, billing, getAccount, cookies, zod, next/headers[.js] …; a gyökérben az app/layout.tsx is; import, dinamikus import() és require())
    node_modules/.bin/tsx tests/sizing-formulas.ts # a kiemelés regressziója
    BASE=http://127.0.0.1:8787 node tests/kb-routes.mjs   # build után, mindkét targeten (npm run start / start:node): 200/404 a kiadási kapu szerint, s-maxage, CSP, nincs süti, canonical, og:site_name/og:locale, title ≤ 60, sitemap = közzétettek

A Sites-előnézetben az `APP_ORIGIN` csak `CLOUDFLARE_INCLUDE_PROCESS_ENV=true` mellett jut el a workerhez (nélküle relatív a canonical és üres a sitemap, a füstteszt joggal bukik); a többi környezeti változó kiszivárgását `env -i` kerüli el, és a helyi HTTP-gyorsítótár (`.wrangler/state/v3/cache`) egy korábbi, más beállítású futás oldalait is visszaadhatja:

    env -i PATH="$PATH" HOME="$HOME" CLOUDFLARE_INCLUDE_PROCESS_ENV=true APP_ORIGIN=http://127.0.0.1:18788 npm run start -- --port 18788
    env -i PATH="$PATH" HOME="$HOME" MYSQL_URL=mysql://… APP_ORIGIN=http://127.0.0.1:13100 SHOCKCRAFT_NODE_RUNTIME=1 PORT=13100 node scripts/start-node.mjs

## Eltérések a tervtől (és miért)

- **A kiadási rekordok nem a definícióban, hanem a `lib/calc/release.ts`-ben vannak** (a terv `CalcDef.review` mezője helyett), hogy a kiadás egyetlen konfigurációs pontból történjen, és a tervező a definíciók nélkül is eldönthesse, mutathat-e linket.
- **A `/tudastar` kezdőlap, a könyvjelzőoldal és a szótár még nem készült el** (nincs közzétett Tudástár-tartalom). A fejléc „Kedvencek” gombja oldalfiókot nyit (kedvencek, előzmények, „Minden Tudástár-adat törlése”); a `/tudastar/konyvjelzok` oldal a tartalommal együtt jön. A nyilvános fejléc „Tudástár” linkje is akkor kerül be.
- **A belső linkek konstansból épülnek** (`CALC_HUB`, `calcPath`, `HOME`): egyszerű `<a>` marad (nincs RSC-előtöltés), és az `@next/next/no-html-link-for-pages` szabály a konstanssal nem jelez.
- **A kereső saját, könnyű combobox** (`role=combobox/listbox`, `aria-activedescendant`), nem a cmdk – kisebb kliens-JS.
- **A „Visszavonás” értesítés saját élő régió** (nem sonner) – kisebb kliens-JS.
- **A homerseklet kalkulátor** a °C–°F–K átváltás és a réz/alumínium ellenállás hőmérsékletfüggése (a tervben csak a slug szerepel).
- **A felső sáv** a Kalkulátorok ikonnal 1520 px alatt a „Terv exportálása” feliratot ikonra csukja, 1000 px alatt a projekt állapotsora legfeljebb két sorban látszik (a többi levágva), 480 px alatt pedig a gombok kissé kompaktabbak, hogy 320–1920 px között sehol ne lógjon ki és ne törjön sorba (élőben mérve: 1920, 1520, 1366, 1280, 1024, 768, 390, 360, 320 px). Ezek a szabályok a tervező saját stíluslapjába (`app/globals.css`) kerültek, mert a tervező felső sávját érintik; a kézikönyv stílusa külön fájlban maradt (`app/(kezikonyv)/kezikonyv.css`).
- **A tervező JS-költségkerete túllépve (+6,6 KB gz a megengedett +2 KB helyett) – terméktulajdonosi döntést igényel.** Mérés bejelentkezve a `/tervezo`-n (Sites build, Playwright, a letöltött JS gzip-pel): alapvonal (`a4a709f`, a kalkulátorok előtt) 336 165 B / 18 fájl, most 342 723 B / 28 fájl (+6 558 B, +2,0 %). Bontás: a kliens-belépési chunk (`index`) kliensreferencia-térképe +2,3 KB (≈ 40 új kliensreferencia: 27 kalkulátorsziget és a kézikönyv-komponensek – ez a vinext működéséből adódik, és minden oldalt egyformán érint); a méretezési modulok (`plan` + `sizing` + az új `sizing-core` és `phase-load` chunk) +1,7 KB (a `lib/sizing-formulas.ts` kiemelése a T1-ekhez szükséges új segédfüggvényekkel, és a kalkulátorszigetekkel közös modulok külön chunkba válása); az ikononkénti 100–300 B-os közös lucide-chunkok +1,1 KB; a Fázisterhelés-mélylink +0,6 KB; a „Kalkulátorok” link a felső sávban +0,25 KB; a Radix/utils közös chunkok újraosztása +0,4 KB. Ami történt: a `lib/sizing-formulas.ts` és a `lib/sizing-tables.ts` egy chunkba kerül (`vite.config.ts`, `sizing-core`, −0,4 KB, −1 kérés). Kipróbált és elvetett: a közös ikonok egy chunkba csoportosítása (−0,6 KB, −6 kérés), mert a rolldown a csoport függőségeivel együtt a React magját is az ikon-chunkba húzta (`includeDependenciesRecursively`); a `lib/sizing.ts` csoportba vétele, mert az a `lib/plan.ts`-en át a zodot a kalkulátoroldalakra vinné. Érdemi csökkentés csak a kliensreferenciák számának csökkentésével lehetséges (pl. egyetlen, a definíciót lustán betöltő kalkulátorsziget), ami a kalkulátoroldalak hidratálását és előtöltését érinti – külön feladat, ha a tulajdonos a +6,6 KB-ot nem fogadja el.
- **Számkiírás:** a terv 5.1 „4 értékes jegy, legfeljebb 3 tizedes”-t ír; a kód 10 fölött (10 000-ig) 5 értékes jegyet ír ki (12,346; 185,67; 9976,6), 1 és 10 között 4-et (9,977), 1 alatt 4-et (legfeljebb 6 tizedessel), 10⁻⁶ alatt normálalakot. A terv 5.3 golden értékei (9976,6 W; 10,197 LE) ezt a kiírást követik, ezért a dokumentációt igazítottuk a kódhoz, nem fordítva.
- **Legnagyobb hossz lefelé kerekítve:** a feszültségesés és a hurokimpedancia „Legnagyobb hossz” eredménye 0,1 m-re lefelé kerekített (biztonságos irány), „(lefelé kerekítve)” jelöléssel, és a levezetés utolsó lépése is mutatja a kerekítést („39,931 m → lefelé kerekítve 39,9 m”). A terv 5.3 a kerekítetlen 39,93 m-t, illetve a kerekített 140,3 m-t írja; a golden teszt a kerekítetlen értéket (`value`) veti össze.
- **Belső kettős ellenőrzés:** a terv 5.2 szerint „szerző + második személy újraszámolja a példákat”. Most a második ellenőrzés egy a TypeScript-motortól független Python-újraszámolás (ugyanattól a fejlesztőtől); második személy még nem számolt. Ezért a meta-sor szövege „két független számítás egyezése (automatikus teszt)”, a rekord `note`-ja ezt kimondja. A „Belsőleg ellenőrizve” jelvény élesítése előtt javasolt a második személyes kézi újraszámolás (lásd fent).
- **Ellenállás-színkód:** a tűrésszínek az IEC 60062:2016 szerint (szürke ±0,01 %, narancs ±0,05 %, sárga ±0,02 %; a régi EIA RS-279-ben a szürke ±0,05 % volt – ezt a feltételezések említik). A hatsávos (hőmérsékleti tényezős) jelölés szándékosan nem készült el (a terv 5.3 nem írja elő; a „Mire nem” lista kimondja); a tűréssáv határai a tűréshez illő pontossággal (±0,01 % → 999,9 mΩ … 1,0001 Ω).
- **Transzformátor:** háromfázisú módban nincs menetszám-számítás (a menetszám-áttétel Dy/Yd kapcsolásnál √3-szor eltér a vonali feszültségek arányától); az N1 mező csak egyfázisú módban látszik.
- **Fázisterhelés teljesítménymegadással:** I = P / 230 V, azaz cos φ = 1 (ugyanúgy, mint a tervező `lib/phase-load.ts`-e); W módban ezt a feltételezések kimondják.
- **„/” gyorsbillentyű:** a terv kéri; a WCAG 2.1.4 miatt a Menüben kikapcsolható (`shockcraft-kb-prefs-v1`), a Ctrl+K mindig működik.
- **Kereső:** a szinonimaváltozatok 1–2 betűs tagja csak teljes szóra illeszkedik (a „hp” → „le” bővítés különben minden „led…”, „levezetés…” szót megtalálna), az „Erre gondoltál?” 5 betűnél rövidebb keresésnél legfeljebb egy elírást enged.
- **A főoldali szakasz** „Ingyenes kalkulátorok – belépés nélkül” címmel, a 106-os mini-ábra nélkül készült: a Tudástár (Sémák) tartalma még nem közzétett, így a cím és az ábra a Sémák kiadásakor bővül.
