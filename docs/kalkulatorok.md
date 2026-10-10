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

`lib/calc/release.ts` (`RELEASES`, `TABLE_GATED`). Egy kalkulátor akkor közzétett (`releaseInfo()` a `lib/calc/registry.ts`-ben), ha:

1. van rekordja a `RELEASES`-ben;
2. a rekord `fingerprint`-je egyezik a definíció mostani `calcFingerprint()`-jével (FNV-1a a `lib/sizing-tables.ts` `fingerprint()`-jével; a definíció minden tartalmi része benne van: mezők, képletek, példák és elvárt értékeik, szövegek, források, „nem vizsgált” lista, verzió – a `compute` függvény viselkedését a példák rögzítik);
3. T0-nál a rekord `kind:'belso'` vagy `'lektoralt'`; T1-nél kötelezően `'lektoralt'`;
4. a `TABLE_GATED` kalkulátoroknál ezen felül `tablesApproved()` igaz (`SIZING_REVIEW`, `lib/sizing-tables.ts`).

Ha egy közzétett definíció bármely tartalma változik, az ujjlenyomat eltér: a kalkulátor kiesik a közzétettek közül, a `tests/calc.ts` megbukik („az ujjlenyomat eltér – a tartalom a jóváhagyás óta változott”). Ilyenkor újra el kell végezni az ellenőrzést, majd frissíteni a rekordot.

### T0 belső kettős ellenőrzés

A példák elvárt értékeit a TypeScript-motortól független Python-újraszámolás adja (`scripts/calc-golden-indep.py`), a motor eredményét a `tests/calc-golden.ts` veti össze velük (211 eset: 122 definíciós példa, 58 kiegészítő, 31 tervbeli érték). A „Belsőleg ellenőrizve” rekordok (`by: 'Villanyrajz fejlesztés'`) e kettős ellenőrzésen alapulnak. **Javasolt:** a terméktulajdonos (vagy egy második személy) a kidolgozott példák egy részét kézzel is számolja újra; a szakmai lektor az első lektori körben a T0-kat is jóváhagyhatja – ekkor a rekord `kind:'lektoralt'`-ra vált, a jelvény „Szakmailag lektorálta: …”.

### T1 kalkulátor kiadása lektori jóváhagyás után

1. **Lektori anyag.** A lektor a kalkulátort előnézetben próbálja ki (lásd alább), és megkapja: a képleteket, a feltételezéseket, a „nem vizsgált” listát, a kidolgozott példákat és a `scripts/calc-release.ts list` szerinti ujjlenyomatot. A táblázatalapúakhoz előbb a méretezési táblázatok jóváhagyása kell (`docs/lektoralas.md`, lektori csomag, `SIZING_REVIEW`).
2. **Jóváhagyás.** A lektor írásban (aláírt lap vagy e-mail) jóváhagyja a kalkulátort **egy adott ujjlenyomattal**. Módosítási kérésnél a definíciót javítjuk, a `version`-t emeljük, és új ujjlenyomattal kérjük újra a jóváhagyást.
3. **Rekord.** `node_modules/.bin/tsx scripts/calc-release.ts record <slug>` kiírja a rekordvázat; ezt a `lib/calc/release.ts` `RELEASES` táblájába kell másolni, és kitölteni a lektor nevével, minősítésével, névjegyzéki számával, a dátummal és a jóváhagyás azonosítójával (`approvalRef`). Fejlesztő, MI-asszisztens vagy a tulajdonos saját hatáskörben nem töltheti ki.
4. **Táblázat-kapu.** A `keresztmetszet`, `kismegszakito`, `hurokimpedancia` és `terhelhetoseg-tablazat` csak akkor jelenik meg, ha a `SIZING_REVIEW` is jóváhagyott (`tablesApproved()`); addig a hubon „Hamarosan – a táblázatértékek tervezői jóváhagyása folyamatban”.
5. **Ellenőrzés.** `tests/calc.ts`, `tests/calc-golden.ts`, `tests/kb-guards.ts` zöld; `scripts/calc-release.ts list` szerint `kozzeteve`. A sitemap, a `generateStaticParams`, a hub kártyája és a tervező mélylinkje (pl. a Méretezés fül „Feszültségesés a kalkulátorban ↗”) ugyanebből a szabályból automatikusan követi.
6. **Telepítés.** A statikus oldalak `revalidate=3600`; deploykor azonnal élesedik.

Visszavonás (pl. hibajelzés miatt): a rekord törlése a `RELEASES`-ből, majd deploy – a kalkulátor újra „Hamarosan” lesz.

### Lektori előnézet

`SHOCKCRAFT_KB_PREVIEW=1` (csak helyi vagy staging környezetben, **élesben soha**): minden megépült kalkulátor elérhető „Tervezet – nem lektorált” sávval, `noindex`-szel; a sitemap továbbra is csak a közzétetteket tartalmazza. Helyben:

    CLOUDFLARE_INCLUDE_PROCESS_ENV=true SHOCKCRAFT_KB_PREVIEW=1 APP_ORIGIN=http://localhost:5173 npm run dev

## Architektúra

| Réteg | Fájlok |
|---|---|
| Motor (tiszta, zod és `lib/plan` nélkül, kliensen is fut) | `lib/calc/number.ts` (`parseNum`: tizedesvessző/-pont, szóközös ezresek, unicode mínusz, `1e3`; `formatNum` 4 értékes jegy, `formatSI`, `formatCompare`), `units.ts`, `constants.ts` (ρ20, α, LE, hp, AWG, E12/E24, MCB-sor, színkód – mind forrással), `core.ts` (`CalcDef`, `runCalc` – soha nem dob, NaN/Infinity nem jut ki), `url.ts`, `formulas.ts`, `fields.ts`, `sizing-fields.ts`, `categories.ts`, `release.ts`, `registry.ts` (szerver), `defs/*.ts` |
| Méretezési képletek | `lib/sizing-formulas.ts` – kiemelve a `lib/sizing.ts`-ből viselkedésváltozás nélkül (a `lib/sizing.ts` ugyanazokat az objektumokat re-exportálja; `tests/sizing-formulas.ts`). Csak a `lib/sizing-tables.ts`-t importálja; minden szabványhoz kötött szám onnan jön. |
| Fázisterhelés | `phaseTotals()` a `lib/phase-load.ts`-ben (a `phaseLoad()` is ezt hívja) |
| Kézikönyv-keret | `lib/kb/categories.ts` (`KB_NAME`, `KB_TITLE`, szekciók, `visibleSections`, `CALC_HUB`), `safety.ts`, `search.ts`, `storage.ts`, `theme.ts`, `links.ts`; `lib/site-origin.ts` (`siteOrigin`, `kbPreview` – a `cloudflare:workers` env-ből) |
| Komponensek | `components/kezikonyv/` (Shell, AppBar, KbChrome: kereső, menü, kedvencek; ThemeBoot, JsonLd, SafetyNotice, PlannerCta, ReportLink), `components/calc/` (Calculator, CalcIndex, CalcExample, CalcFigure, `islands/` kalkulátoronként egy kliensszigettel) |
| Útvonalak | `app/(kezikonyv)/layout.tsx` (ThemeBoot, metadataBase, viewport), `kezikonyv.css`, `kalkulatorok/layout.tsx` (Shell), `page.tsx` (hub), `[slug]/page.tsx`, `not-found.tsx`; `app/sitemap.ts`, `app/robots.ts` |
| Fejlécek | `next.config.ts`: CSP, nosniff, Referrer- és Permissions-Policy a `/:root(tudastar|kalkulatorok)`, `/tudastar/:path*`, `/kalkulatorok/:path*` forrásokra |

**Renderelés.** A hub és a kalkulátoroldalak `dynamic='force-static'`, `revalidate=3600`; a `[slug]` oldal `dynamicParams=false`, `generateStaticParams()` = közzétett kalkulátorok. Az URL-paramétereket a kliens olvassa (`useSyncExternalStore`, üres szerver-pillanatkép), így minden lekérdezés ugyanazt a gyorsítótárazott oldalt kapja; az űrlap a keresési sztringből `key`-vel mountolódik újra. A kidolgozott példa és a teljes kategorizált lista SSR-ben, JS nélkül is olvasható.

**Bundle.** Kalkulátoronként külön kliensszigeten (`components/calc/islands/<slug>.tsx`), amely csak a saját definícióját húzza be; a registry és az env-olvasás szerveroldali marad (`tests/kb-guards.ts`). Mért méret (Sites build): `calculator` ≈ 10 KB gz, egy definíció ≈ 2 KB gz, a keret (`kb-chrome`) ≈ 3,6 KB gz.

**URL-formátum.** `/kalkulatorok/<slug>?<mező>=<nyers>`, egység: `<mező>.e=<egység>`, lista: `R=10;22;47`, sorok: `sorok=2000*0,25*1;60*5*3`. A vessző és a pontosvessző olvasható marad. Az ismeretlen, túl hosszú vagy érvénytelen paramétert eldobjuk; az oda-vissza alakítás veszteségmentes.

**Böngészőtárolás** (csak a felhasználó kérésére, a szerverre nem kerül; a `components/legal-page.tsx` sütitáblázatában): `shockcraft-kb-bookmarks-v1` (kedvencek, ≤ 300), `shockcraft-kb-recent-v1` (`items` ≤ 30 legutóbbi kalkulátor a bemenetekkel, `searches` ≤ 8 keresés), és a tervezővel közös `shockcraft-theme`. Minden hozzáférés try/catch-ben; privát módban memóriabeli tartalék és jelzés.

**Felület.** Mobil-első: 56 px-es alkalmazásfejléc (← szülőlista / Villanyrajz-jel, szekciónév, Keresés, Kedvencek, Menü), alsó navigáció (csak a tartalommal rendelkező szekciók – most a Kalkulátorok), mező-fókuszban rejtve; asztalon (≥ 950 px) PublicHeader `current` proppal, kereső (`/`, Ctrl+K) és témagomb, szekciófülek, bal oldalsáv, ≥ 1240 px-en jobb oldali tartalomjegyzék. Világos/sötét/rendszer téma villanás nélkül (inline indítószkript, `<html suppressHydrationWarning>`). Nyomtatás számítási lapként (URL, dátum, verzió, ujjlenyomat, figyelmeztetés).

**Kalkulátoroldal.** H1, leírás, jelvény (Belsőleg ellenőrizve / Szakmailag lektorálta), műveletek (Kedvenc `aria-pressed` + „Visszavonás”, Link másolása, Eredmény másolása, Nyomtatás), bemenetek (szöveges `inputMode=decimal` mezők, egységválasztó, magyar hibaüzenet a mező alatt), eredménykártya (`aria-live`, 700 ms tétlenség után), verdikt („Számítás szerint …”), figyelmeztetések, saját SVG-ábra (teljesítményháromszög, ΔU-sáv, fázissávok, ellenállássávok), Levezetés (képlet → behelyettesítés → eredmény → forrás), Feltételezések, Képletek, Mire jó / mire nem, T1-nél nem zárható figyelmeztetés + „Nem vizsgált” + táblázatállapot (`reviewText()`), Kidolgozott példa (SSR), Kapcsolódó kalkulátorok, Források, verzió/ujjlenyomat, „Hibát találtál?” (mailto), egy tervező-blokk a tartalom után. JSON-LD: BreadcrumbList + WebApplication (`isAccessibleForFree`).

## Új kalkulátor hozzáadása

1. `lib/calc/defs/<slug>.ts` – `CalcDef` (≥ 2 példa; a leírás 80–160 karakter; T1-nél `notCovered`, `safety` és „számítás szerint” szóhasználat, „megfelel”/„szabványos” nélkül).
2. Felvétel a `lib/calc/registry.ts` `CALCULATORS` listájába és a `components/calc/islands/` alá (egy sziget + az `index.ts` térkép).
3. Az elvárt értékek független újraszámolása (`scripts/calc-golden-indep.py`), szükség esetén kiegészítő esetek a `tests/calc-golden.ts`-be.
4. Kiadás a fenti kapun át (T0: `internal(<ujjlenyomat>)`; T1: lektori rekord).

## Tesztek

    node_modules/.bin/tsx tests/calc.ts            # motor, registry, kiadási kapu, linkek, URL, fuzz, 10 000 seedes tulajdonságteszt, egyezés a Méretezés/Fázisterhelés számításával
    node_modules/.bin/tsx tests/calc-golden.ts     # 211 golden eset
    node_modules/.bin/tsx tests/kb-search.ts       # kereső (szinonimák, elírás, rangsor)
    node_modules/.bin/tsx tests/kb-storage.ts      # vendégtárolás
    node_modules/.bin/tsx tests/kb-guards.ts       # importgráf- és szövegőrök (db, auth, billing, getAccount, cookies, zod, next/headers …)
    node_modules/.bin/tsx tests/sizing-formulas.ts # a kiemelés regressziója
    BASE=http://127.0.0.1:8787 node tests/kb-routes.mjs   # build után, mindkét targeten (npm run start / start:node)

## Eltérések a tervtől (és miért)

- **A kiadási rekordok nem a definícióban, hanem a `lib/calc/release.ts`-ben vannak** (a terv `CalcDef.review` mezője helyett), hogy a kiadás egyetlen konfigurációs pontból történjen, és a tervező a definíciók nélkül is eldönthesse, mutathat-e linket.
- **A `/tudastar` kezdőlap, a könyvjelzőoldal és a szótár még nem készült el** (nincs közzétett Tudástár-tartalom). A fejléc „Kedvencek” gombja oldalfiókot nyit (kedvencek, előzmények, „Minden Tudástár-adat törlése”); a `/tudastar/konyvjelzok` oldal a tartalommal együtt jön. A nyilvános fejléc „Tudástár” linkje is akkor kerül be.
- **A belső linkek konstansból épülnek** (`CALC_HUB`, `calcPath`, `HOME`): egyszerű `<a>` marad (nincs RSC-előtöltés), és az `@next/next/no-html-link-for-pages` szabály a konstanssal nem jelez.
- **A kereső saját, könnyű combobox** (`role=combobox/listbox`, `aria-activedescendant`), nem a cmdk – kisebb kliens-JS.
- **A „Visszavonás” értesítés saját élő régió** (nem sonner) – kisebb kliens-JS.
- **A homerseklet kalkulátor** a °C–°F–K átváltás és a réz/alumínium ellenállás hőmérsékletfüggése (a tervben csak a slug szerepel).
- **A felső sáv** a Kalkulátorok ikonnal 1276–1520 px között a „Terv exportálása” feliratot ikonra csukja, 480 px alatt pedig a gombok kissé kompaktabbak, hogy 320–1920 px között sehol ne lógjon ki és ne törjön sorba.
