# Villanyrajz – fejlesztői útmutató (CLAUDE.md)

## Mi ez az alkalmazás?

**Villanyrajz** (korábbi nevén ShockCraft) egy magyar nyelvű, böngészőalapú villamos tervszerkesztő SaaS.
Villanyszerelőknek és lakóépületek villamos tervein dolgozóknak készül.

> **Névváltás:** a felhasználó felé mindenhol „Villanyrajz” szerepel (felület, PDF, e-mail, Stripe-terméknév, számlatétel, letöltött fájlnevek, jogi szövegek). A technikai azonosítók **szándékosan változatlanok**, mert átnevezésük kijelentkeztetné a felhasználókat vagy elveszítené a böngészőben tárolt adatokat: `shockcraft_session` süti, `shockcraft-*` localStorage/sessionStorage kulcsok, `SHOCKCRAFT_*` env változók, `X-ShockCraft-User` fejléc, Stripe idempotencia-kulcsok (a `shockcraft-monthly-portal-vN` kulcs verzióját emeld, ha a portálkonfiguráció tartalma változik), `SC-` számlázási rendelésazonosító-előtag (duplikációvédelem!), `shockcraft.service`, `/srv/shockcraft` útvonalak, `shockcraft` MySQL-adatbázisnév a példákban. Új kódban is ezeket a meglévő kulcsokat használd. A kézikönyv (Tudástár/Kalkulátorok) új böngészőkulcsai `shockcraft-kb-*` előtagúak (a téma közös: `shockcraft-theme`); a Tesztekéi: `shockcraft-kb-quiz-v1` (localStorage: eredmények, kérdésenkénti statisztika) és `shockcraft-kb-quiz-session` (sessionStorage: a futó teszt).

**Fő funkciók:**
- Alaprajz-szerkesztő: szobák, falak, ajtók/ablakok, szerelvények (kapcsolók, dugaljak, RJ45, lámpakiállás, kötődoboz, lakáselosztó-jelölés)
- Kábelnyomvonalak belső/külső vezetéssel, töréspontokkal, beépítési magassággal
- Telek-nézet: bekötési pont, mérőhely, főelosztó, telki hálózat összekötésekkel
- Lakáselosztó-tervező: kismegszakítók, FI-relék, PE/N/EPH elemek, modul-elrendezés soronként; tokozati PE-sín és N-sínek (főnullasín + ÁVK-nként külön N-sín, nem foglalnak modulhelyet) automatikus N/PE-bekötéssel (származtatott, elosztónként kapcsolható, a kézi bekötés felülírja; az ÁVK-csoport: bekötés – fázissínen/leágazón/sorkapcson át követve – → szöveg → figyelmeztetés; a bekötés és a szöveg ellentmondása nem azonosítható; több főkapcsoló és kaszkádolt ÁVK külön kezelve; az N-oldal N-hálózat-modellre épül: kézzel összekötött, több vagy idegen forrásról táplált sínre nem kerül betápláló és fogyasztó, figyelmeztetéssel)
- Áramkörök és kábelvezetékek hozzárendelése szerelvényekhez és nyomvonalakhoz
- PDF export (A4/A3, fekete-fehér, beágyazott NotoSans betűkészlet), SVG és JSON export
- Anyaglista (Eszközök → Tervsegéd), nyomvonalhosszak ráhagyással
- Árajánlat-PDF: tervből átvett tételek, anyagár, munkadíj, összesítés (fejlesztés alatt)
- Többszintes projektek (épületek → szintek → helyiségek), közös telek-koordináta-rendszerrel
- Vendég-mód (böngészőbe ment) és fiókos mód (D1/MySQL adatbázis)
- Projektkezelés: mentés, verzióvédelem, névátírás, másolat, JSON import/export
- Projekt életciklus: aktív / archivált / lomtár állapotok
- Ügyfelek és teendők (fiókszintű): ügyféltörzs, projekt–ügyfél hozzárendelés, határidős teendők, Esedékes nézet, árajánlat-kitöltés ügyféladatokból
- Tervmegosztás: csak olvasható, lejáró, visszavonható link (`/megosztas#t=…`) a legutóbb mentett tervről, opcionális PDF-engedéllyel
- Méretezési segédszámítás (Eszközök → Méretezés): áramkörönkénti, tervezői ellenőrzést segítő számítás (Ib ≤ In ≤ Iz, I2, legkisebb keresztmetszet, feszültségesés, opcionális hurokimpedancia), feltételezésekkel és forrásokkal; opcionális PDF-táblák; „nem felel meg”/„nem számítható” a tervellenőrzésben. Nem tervezői méretezés; a táblázatértékek tervezői jóváhagyása függőben
- Termékkatalógus (fiókszintű): saját termék- és árlista (kézzel, CSV-ből, mintakészletből), típusonkénti és soronkénti termékválasztás az ajánlatban, fiók-alapértelmezések, árfrissítés; termék az anyagkimutatásban, a CSV-ben és az ajánlat-PDF-ben
- Sötét/világos mód
- Kalkulátorok (`/kalkulatorok`, a Villanyszerelő Tudástár első szekciója): ingyenes, belépés és süti nélkül; 19 közzétett T0 kalkulátor („Belsőleg ellenőrizve”), 8 T1 kalkulátor elkészült, de lektori jóváhagyásig a kiadási kapu (`lib/calc/release.ts`) mögött rejtve; kereső, kedvencek, legutóbbiak, megosztható URL, levezetés, saját SVG-ábrák
- Tudástár – Elmélet és szakszótár (`/tudastar`, `/tudastar/elmelet`, `/tudastar/szotar`): ingyenes, belépés és süti nélkül; 17 cikk (12 R1, 5 R2) és a szakszótár (58 kifejezés) „Belsőleg ellenőrizve” jelvénnyel, 22 saját SVG-ábrával; a tartalom Markdown-vázlatból (`content/tudastar/`) generált TS-modul, ujjlenyomattal; közzétételi kapu: `lib/kb/release.ts`. A 13 R3 vázlat (bekötések, kismegszakító, FI-relé, földelés, EPH, feszültségmentesítés) csak szakmai lektor után adható ki – addig a buildbe sem kerül
- Tudástár – Sémák és ábramotor (`/tudastar/semak`, R3 – a lektorálásig rejtve, minden útvonal 404): 20 netlistából (`content/tudastar/r3/*.netlist.json`) + elrendezésből (`content/tudastar/diagramok/`) vezetékszintű bekötési rajz (Bekötés nézet, szerverkomponens), Működés nézet (kliensszigete: kapcsoló- és hibahelyzet-gombok, érszintű áramút a szimulációból), vezetéktábla, kapcsolóállás-táblázat; a TS-szimulátor (`lib/kb/circuit.ts`) = a Python `sim.py`; rajz = netlista teszt mutációs próbákkal; az ábra-ujjlenyomat a cikk rekordjának része; a buildbe csak a közzétett (lektorált) cikk ábrája kerül. A lektor az ábrákat és a biztonsági szabályokat a lektori csomag 4., a cikkek teljes szövegét az 5. részében kapja (LK-4); R3 rekord csak teljesen kitöltve (második olvasóval) tesz közzé
- Tudástár – Tesztek (`/tudastar/tesztek`, vizsgaszimuláció): ingyenes, belépés és süti nélkül; „Gyakorló teszt – nem hivatalos vizsgakérdések; az eredmény nem igazolás.” jelöléssel. Számolós gyakorló: 9 sablon a közzétett T0-kalkulátorokra (a helyes érték és a levezetés `runCalc`-ból, tévesztők megnevezett hibamodellekből), Gyakorló / Vizsga (időkorlát, kérdéstérkép, újratöltés-álló) / Hibáim mód, megosztható tesztkód (`?kod=`), „Teszteld magad” a cikkekben; a 3 T1-sablon a kalkulátor lektori kiadásáig rejtve. Kérdésbank-infrastruktúra (séma, kiadó szkript, lektori CSV) kész, a bank ≥ 150 jóváhagyott kérdésig (témakörönként ≥ 10) nem élesedik – a kapu: `lib/quiz/gate.ts`

**Élő oldal:** https://villanyrajz.hu/ (cPanel Node.js + MySQL; a `main` ágra kerülő kódot a `.github/workflows/deploy-ftp.yml` buildeli és FTP-n telepíti, lásd `docs/telepites.md`). Korábbi előnézet: https://shockcraft-villanytervezo.lollipopp23.chatgpt.site/

---

## Tech stack

| Réteg | Technológia |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI |
| Build | Vite 8 + vinext (Next.js–Cloudflare híd) |
| Cloudflare deploy | Wrangler 4, Cloudflare Workers, D1 (SQLite) |
| Node.js deploy | Node.js ≥ 22.13 (standalone Next.js) + MySQL |
| ORM | Drizzle ORM |
| PDF | jsPDF (vektoros, magyar betűkészlettel) |
| Charts | Recharts |
| Billing | Stripe (egyszeri vásárlás + havi előfizetés) |
| Email | Resend (jelszóvisszaállítás, e-mail-visszaigazolás) |
| Validation | Zod |
| Auth | Saját: bcrypt jelszó, lejáró munkamenet-tokenek, rate limiting |

---

## Könyvtárszerkezet

```
app/                    Next.js App Router oldalak
  layout.tsx            Gyökér layout (hu lang, CookieNotice)
  page.tsx              Főoldal (marketing landing)
  tervezo/page.tsx      A tervező szerkesztő (fő UI)
  megosztas/page.tsx    Megosztott terv, csak olvasható nyilvános nézet (#t=<token>, force-dynamic)
  (kezikonyv)/          Kézikönyv-útvonalcsoport (ThemeBoot, metadataBase, kezikonyv.css; nincs getAccount/db/auth/next/headers)
    kalkulatorok/       layout (Shell), page (hub), [slug]/page (force-static, revalidate 3600, dynamicParams=false), not-found
    tudastar/           page (kezdőlap), not-found, elmelet/ (page, [slug] cikk, kategoria/[kategoria]), szotar/, tesztek/ (statikus oldalváz + kliensszigete; csak ha van közzétett tartalma), semak/ (gyűjtő- és [slug] részletoldal; csak közzétett, R3-lektorált sémával – most 404) – mind force-static, csak közzétett tétel (lib/kb/release.ts)
  sitemap.ts, robots.ts Metaadat-útvonalak (APP_ORIGIN-ból; a sitemap csak közzétett kalkulátort és Tudástár-tételt tartalmaz)
  admin/page.tsx        Admin panel (Stripe, email beállítások)
  api/                  API route-ok
    auth/               Belépés, regisztráció, kijelentkezés, jelszócsere
    plan/               Terv mentés/betöltés/lista
    plan-history/       Verzióelőzmények
    billing/            Stripe webhook, checkout, előfizetés
    billing-profile/    Számlázási profil
    stripe/             Stripe API
    templates/          Sablonkönyvtár
    workbook/           Ügyfél- és teendő-munkafüzet (GET/PUT)
    catalog/            Termékkatalógus (GET/PUT, revision-CAS)
    plan-share/         Tervmegosztás – tulajdonosi linkkezelés (GET/POST/DELETE)
    shared-plan/        Tervmegosztás – nyilvános nézet (POST, munkamenet nélkül)
    transfer-access/    Projekthozzáférés-átvitel
    account-email/      E-mail-visszaigazolás, -csere
    backgrounds/        Háttéralaprajz upload/olvasás
    admin/              Admin API (billing config, mail config)
    health/             Health check endpoint

components/             43 UI komponens
  plan-editor.tsx       Fő rajzoló vászon (SVG alapú)
  board-cabinet.tsx     Elosztó-tervező
  plan-controls.tsx     Eszközválasztó, felső toolbar
  circuit-designer.tsx  Áramkör-szerkesztő panel
  pdf-dialog.tsx        PDF export dialógus
  billing-dialog.tsx    Fizetési folyamat
  account-menu.tsx      Fejléc fiókok menü
  admin-billing.tsx     Admin Stripe konfig
  admin-email.tsx       Admin Resend konfig
  admin-invoicing.tsx   Admin számlázás konfig
  quote-...tsx          Árajánlat komponensek
  workbook-*.tsx        Ügyfelek és teendők dialógus (dialog, tasks, clients)
  share-dialog.tsx      Tervmegosztás – tulajdonosi ablak (link létrehozása, lista, visszavonás)
  share-viewer.tsx      Tervmegosztás – megtekintő oldal (alaprajz, telek, elosztó, jegyzékek)
  floor-drawing.tsx     Közös alaprajzi rajz (FloorShapes, RoomLabels, ScaleBar, PlanLegend) – szerkesztő és megtekintő
  catalog-manager.tsx   Termékkatalógus fül (Eszközök → Termékkatalógus): CRUD, CSV-import/-export, mintakészlet, fiók-alapértelmezések
  product-picker.tsx    Termékválasztó dialógus (típushoz vagy ajánlati sorhoz)
  kezikonyv/            Kézikönyv-keret: shell (AppBar, Shell, alsó nav/fülek), kb-chrome (kereső, menü, kedvencek, téma, értesítés), theme-boot, json-ld, safety-notice, planner-cta, report-link, kb-continue („Folytasd”); article/ (cikkoldal: article-view, blocks, inline, article-list, article-actions kliensszigete); figures/ (a cikkek saját SVG-ábrái, jegyzék: index.tsx FIGURES)
  calc/                 Kalkulátor-felület: calculator (kliens), calc-index (hub), calc-example (SSR példa), calc-figures (SVG), islands/<slug> (kalkulátoronként egy kliensszigete)
  kezikonyv/diagram/    Bekötési ábra (netlista + elrendezés → rajz): scene (jelenet, állásonkénti kiemelés), symbols (szimbólumkészlet), bekotes (SVG, data-wire/-from/-to/-term), diagram-run (kliensszigete: nézetváltó, Működés), diagram-figure (figura: jelmagyarázat, vezetéktábla, kapcsolóállás-táblázat); kezikonyv/semak/ (gyűjtőoldal)
  quiz/                 Tesztek: quiz-app (kliensszigete: beállítás, tesztkód, eredmények), quiz-runner (lustán: futó teszt, eredmény), quiz-shared, calc-defs (a kalkulátordefiníciók lusta betöltése a kalkulátorok saját szigetéből)
  sizing-report.tsx     Méretezési segédszámítás fül (Eszközök → Méretezés): felelősségi doboz, áramkörönkénti ellenőrzések, áramköri/projekt/elosztó beállítások, Iz0-felülírások
  quote-products.tsx    Ajánlat „Termékek és katalógusárak” része (típusválasztás, alapértelmezések, árfrissítés)
  use-catalog.ts        useCatalog hook: /api/catalog betöltés és mentés (revision-CAS)
  selection-chip.tsx    Kijelölési címke keskeny szerkesztőben (≤ 1050 px): „Kijelölve: …” + Tulajdonságok + Kijelölés megszüntetése; szellemkattintás-védelem

hooks/
  use-media-query.ts    useMediaQuery + a szerkesztő töréspontjai (EDITOR_NARROW = 1050 px, EDITOR_PHONE = 760 px) – egyezniük kell az app/globals.css média-lekérdezéseivel

lib/                    43 üzleti logika / utility modul
  plan.ts               Plan schema (Zod), seed terv, validatePlan()
  auth.ts               Session kezelés, bcrypt, rate limit
  billing.ts            Projekt jogosultságok, Stripe config, grant logika
  subscription-access.ts  Előfizetés státusz
  pdf-export.ts         PDF generálás (jsPDF)
  projects.ts           ProjectState, blankProject, removeStructure
  quote.ts              Árajánlat számítás, syncQuote, quoteTotals
  quote-schema.ts       Quote Zod schema (+ opcionális termékpillanatkép: product, productPinned, productDefaults, productDisplay)
  quote-products.ts     Ajánlat ↔ termék: típusválasztás, soronkénti rögzítés, fiók-alapértelmezés, árfrissítés, productResolver (tiszta modul)
  product-refs.ts       Gépi típuskulcs (device:/module:/cable:/site:) az anyagkimutatás soraihoz, cableRef normalizálás
  catalog.ts            Termékkatalógus Zod-séma, keresés, módosítók, productLine (PDF) (tiszta modul)
  catalog-csv.ts        Katalógus-CSV: dekódolás (UTF-8/UTF-16LE/Windows-1250), parseHuf, import-összefésülés, export
  catalog-sample.ts     25 tételes „(minta)” készlet
  catalog-client.ts     /api/catalog kliens hívások
  geometry.ts           Geometriai segédfüggvények
  wall-snap.ts          Falhoz illesztés logika
  board.ts              Elosztó modul típusok, validáció; tokozati sínek: Bar, boardBars() (nem tárolt: PE-sín `pe:<épület>/<elosztó>`, főnullasín `n:…`, ÁVK-nként `rcd:<modulId>`; csak nem üres elosztónak), findBar, 'bar' végpont (T1…Tk kapcsok), autoBarsOn/setAutoBars (elosztónkénti autoBars; a lib/board-size.ts-ben szándékosan nincs, mert azt a Fázisterhelés kalkulátor forrás-ujjlenyomata fedi), moveBoardModule (ÁVK sínjére futó kézi vezeték tiltja az áthelyezést), removeBoardLinks/pruneBoardLinks a sínekkel
  board-bars.ts         Automatikus N/PE-bekötés (tiszta modul, a tervező és a megosztott nézet közös forrása): rcdGroup (bekötés – a védelem L-bemenetéről ÉS az áramkör saját L-szálának kézi vezetékéről (kimenő sorkapocs, közvetlenül az ÁVK/főkapcsoló L-kimenete) indulva, a fázissínen/leágazón/sorkapcson, kismegszakítón (L-kimenet → azonos fázisú L-bemenet) és az L-bemenetek áthidalásán át is visszakövetett L-betáplálás; az áramkör saját RCBO-ja átvezet → ÁVK-csoport szövege (RCBO-s áramkörnél az RCBO saját neve vagy „RCBO” = nincs ÁVK) → nem azonosítható; a főkapcsolóról betáplált védelem + ÁVK-t megnevező szöveg = ellentmondás = nem azonosítható; RCBO L-kimenete mögül betáplált védelem = nem azonosítható), az N-oldal egyetlen N-hálózat-modellre épül (union-find a kézi vezetékeken; csomópont: egy sín az összes kapcsával, egy nullasín-modul / leágazó / sorkapocs az összes N-kapcsával, minden más kapocs önmagában; az automatikus vezeték a döntés előtt nem számít): egy hálózaton több sín (kézi áthidalás sorkapcson, leágazón, nullasín-modulon vagy közös készülékkapcson át is) = egyik sem kap betáplálót és fogyasztót, figyelmeztetés; forrás = a hálózat főkapcsolójának/ÁVK-jának N-kimenete + a természetes betápláló, ha szabad (az RCBO N-kimenete és a gyökér nélküli nullasín-modul nem forrás); több forrás („két forrásról”, a szabad saját betáplálóra rákötött idegen forrásnál „idegen forrás (…) is rá van kötve”), egyetlen idegen forrás („idegen forrásról”; főnullasínt főkapcsoló, ÁVK sínjét csak a saját ÁVK-ja táplálhatja) és a máshová kötött természetes betápláló („nem kap betáplálást”) = lezárt sín (főkapcsoló nélküli elosztó főnullasínje fogad); a készülék N-pólusa nem hidalható át (ÁVK/RCBO N-bemenete nem kerül a saját N-kimenetének hálózatára, a betápláló N-kimenete nem a saját N-bemenetére); sínenként egy figyelmeztetés a kimaradt fogyasztókkal, az `AutoWires.reasons` (végpontkulcs → ok) a hiányzó szál okát adja a rajznak és a PDF-nek, a betápláló készülékek: csak az első főkapcsoló N-kimenete kerül a főnullasínre (a többi figyelmeztetés), kaszkádolt ÁVK N-bemenete a felső ÁVK N-sínjéről, az SPD N-kapcsa ugyanígy az L-oldali betáplálás szerinti sínre (RCBO mögött vagy nem egyértelműen: figyelmeztetés), a vezetéknév az áramkör vezetőnevét használja, az elfogyó sínkapcsokról (400) sínenkénti figyelmeztetés, az RCBO N-kimenetének kézi vezetéke az áramkör N-jének automatikus vezetékét kizárja, autoBoardWires (származtatott 'auto:…' vezetékek + figyelmeztetések; a kézi vezeték felülírja; L-vezetőt, N–PE és sín–sín kötést soha), boardWiring (egy elosztó kézi + automatikus vezetékei, `auto` azonosítóhalmaz), effectiveBoardWires (teljes terv), boardBarPorts (sínkapcsok: k = max(6, vezetékek + 2, legnagyobb kézi kapocs)); minden fogyasztó (schematic, cabinet, circuit-report, pdf-export, board-cabinet/-wiring, circuit-designer) ezt használja – az anyagkimutatás (plan-tools) a sínt még nem sorolja fel
  board-size.ts         Elosztó méretek, boards(), boardSize() – NE módosítsd: a Fázisterhelés kalkulátor (lib/calc/defs/fazisterheles.ts) forrás-ujjlenyomata része
  schematic.ts          Kapcsolási rajz generálás
  plan-tools.ts         Anyaglista (materialList), keresés
  circuit-assignment.ts Áramkör-hozzárendelés
  phase-load.ts         Fázisterhelés-összesítés (elosztónként L1/L2/L3, aszimmetria)
  sizing-tables.ts      Méretezési segédszámítás: MINDEN számérték és forrás egy helyen (PVC Iz0, B.52.14, B.52.17, G.52.1, ρ1, λ, U0, cmin, m), lookupok, ujjlenyomat, SIZING_REVIEW (kezdetben „ellenőrizendő” – soha ne állítsd jóváhagyottra; név és névjegyzéki szám csak hozzájárulással, mert a modul a kliensbe is bekerül)
  sizing-schema.ts      circuit.sizing / plan.sizing opcionális Zod-séma, pruneSizing (validatePlan végén)
  sizing-formulas.ts    Méretezési képletek, kábeljelölés, felelősségi szövegek – kiemelve a sizing.ts-ből (csak a sizing-tables-t importálja; a sizing.ts változatlan néven re-exportál)
  sizing.ts             Kábeljelölés-értelmezés, képletek, circuitSizing/boardSizing/projectSizing, sizingTarget, PDF-sorok, mutáló segédek (tiszta modul)
  route-points.ts       Nyomvonal töréspontok
  architecture.ts       Ajtók/ablakok Zod schema, validateArchitecture
  dimensions.ts         Méretvonalak schema és geometria
  background.ts         Háttéralaprajz schema
  local-projects.ts     Vendég (localStorage) projekt kezelés
  plan-api.ts           Kliens oldali API hívások
  plan-versions.ts      Verzióvédelem logika
  secrets.ts            seal/unseal (titkosított admin config)
  stripe-payments.ts    Stripe egyszeri fizetés
  stripe-subscriptions.ts  Stripe előfizetés kezelés
  draft-backup.ts       Ideiglenes szerkesztés megőrzés
  transfer-access.ts    Projekthozzáférés-átvitel
  templates.ts          Sablon könyvtár
  workbook.ts           Ügyfél/teendő Zod-sémák, szabályok, esedékesség (tiszta modul)
  workbook-server.ts    Projektállapotok a munkafüzet-ellenőrzéshez (szerver)
  workbook-client.ts    /api/workbook kliens hívások
  share.ts              Tervmegosztás: token, sémák, adatminimalizálás (sharedPlan), floorViewBox (tiszta modul)
  share-server.ts       Tervmegosztás szerveroldal: rate limit, állapot, lista, létrehozás, visszavonás, megnyitás
  share-client.ts       /api/plan-share és /api/shared-plan kliens hívások (fail closed)
  structure-copy.ts     Szint/épület másolás
  device-copy.ts        Szerelvény másolás
  panel-link.ts         Telki elosztó ↔ alaprajzi jelölés összekötés
  utils.ts              cn() class merge
  site-origin.ts        siteOrigin() (APP_ORIGIN validálva, nem dob), kbPreview() (SHOCKCRAFT_KB_PREVIEW) – a cloudflare:workers env-ből
  calc/                 Kalkulátormotor (tiszta, zod és lib/plan nélkül): number (parseNum/formatNum/formatSI), units, constants (forrással), core (CalcDef, runCalc), url, formulas, fields, sizing-fields, categories, release (KIADÁSI KAPU – egyetlen konfigurációs pont), registry (szerver), defs/<slug>.ts (27 kalkulátor)
  kb/                   Kézikönyv-keret: circuit.ts (netlista-szimulátor: a content/tudastar/r3-sim/sim.py TS-megfelelője; simulate, truthTable, wireTable, érszintű áramút – pathWires), categories (KB_NAME, KB_TITLE, szekciók, CALC_HUB), safety, search (ékezetfüggetlen, szinonimák, elírás), storage (shockcraft-kb-* tárolók), theme, links (a tervező csak ezt importálja); release.ts (TUDÁSTÁR KÖZZÉTÉTELI KAPU – egyetlen konfigurációs pont); content/ (types, fingerprint, inline mini-jelölés, categories, changes, registry – szerver; generated/ – GENERÁLT, kézzel ne szerkeszd)
  quiz/                 Tesztek (tiszta, kliensen is): topics (témakörök, QUIZ_NOTICE), rng (mulberry32), code (beállítás, tesztkód), templates (a 9 T0-sablon és a közös segédek; előtaghiba csak 2 × 2-ben), templates-t1 (a 3 T1-sablon – a böngésző csak közzétételük után, lustán tölti), all-templates (mind a 12 a tesztkód sorrendjében – csak szerver és teszt), engine (kérdésépítés a helyes válasz tervezett helyével, kvóta, súlyozás, pontozás), gate.ts (TESZTEK KIADÁSI KAPUJA – egyetlen konfigurációs pont: sablonrekordok, bankküszöb), storage (shockcraft-kb-quiz-*); registry (szerver: sablonállapot a kalkulátorkapuból, kiadás, kliensadat); schema (zod – csak szkript és teszt); release/ (GENERÁLT: manifest, index – élesedésig kérdésszöveg nélkül), id-registry.json (csak bővülhet)

db/
  schema.ts             Drizzle ORM séma (D1/SQLite)
  database.ts           DB kapcsolat (D1 vagy MySQL)
  mysql-config.ts       MySQL adapter beállítás
  mysql-schema.sql      MySQL DDL
  plan-store.ts         Terv read/write D1/MySQL felett
  node-env.ts           cloudflare:workers polyfill Node.js-hez

worker/                 Cloudflare Worker entry

scripts/
  run-framework.mjs     Dev/build wrapper (SHOCKCRAFT_TARGET env alapján)
  build-node.mjs        Node.js build
  start-node.mjs        Node.js prod indítás
  sites-env.mjs         D1/R2 binding injektálás
  install-ci.mjs        CI npm install
  mysql-setup.mjs       MySQL séma inicializálás
  calc-release.ts       Kalkulátorok kiadási állapota, tartalmi és forrás-ujjlenyomata (list | record <slug>)
  calc-source.ts        Kalkulátorok forrás-ujjlenyomata (a definíció és futásidejű helyi importjai; a kiadási rekord `source` mezője, CI-ben ellenőrizve)
  calc-golden-indep.py  Független Python-újraszámolás a kalkulátorpéldákhoz (belső kettős ellenőrzés)
  kb-content.ts         Tudástár-tartalommotor: build (content/tudastar/*.md → lib/kb/content/generated) | check | list | record <id>; kb-content/ (parse, generate – R3-ellenőrzés: checkR3, figures – ábra-ujjlenyomat, diagrams – netlistás ábra forrása és ujjlenyomata, diagram-check – rajz = netlista ellenőrzés, schema, checklist)
  kb-circuit-reference.py  A Python-szimulátor referenciája a TS-egyenértékűséghez (tests/fixtures/kb-circuit-reference.json; --check)
  lektori-csomag.ts     Lektori csomag generátora (docs/lektori-csomag.md + .pdf; --check; kiadások: EDITIONS; 4. rész: biztonsági szabályok, közös kérdések, bekötési ábrák vektorosan, BEK-<ID>; 5. rész: R3 cikkszövegek, CIK-<ID>; a kirajzolt PDF ellenőrzése) – folyamat: docs/lektoralas.md
  lektori-csomag-cikkek.ts  A lektori csomag 5. részének adatai (R3 vázlatok szövege, tartalmi ujjlenyomat, BLOCKED)
  build-guard.mjs       Build-előfeltétel: kb-content check + lektori-csomag --check (az npm run build és a build:node hívja; fail closed)
  quiz-release.ts       Tesztek kiadása: check | build (lib/quiz/release, azonosítójegyzék) | list | fingerprint <id> | templates; quiz/ (bank, csv)
  quiz-csv.ts           Lektori kérdés-CSV: export (25 kérdéses csomagok) | import <csv> [--apply] (a lib/catalog-csv.ts dekódolójával)

deploy/
  nginx.conf            Nginx reverse proxy konfig
  shockcraft.service    systemd service unit
  env.production.example  Env változók példa
  cpanel-app.cjs        Passenger/cPanel-indító (a FTP-workflow app.cjs-ként telepíti): .env.production beolvasása, logs/inditas.log (titkok nélkül)

docs/                   Feature dokumentáció (Markdown)
  BACKLOG.md            Nyitott fejlesztési feladatok
  telepites.md          VPS telepítési útmutató
  stripe.md             Stripe webhook és admin beállítás
  email.md              Resend beállítás
  mysql.md              MySQL migráció és beállítás
  tudastar.md           Tudástár (Elmélet, szakszótár, Tesztek, Sémák és ábramotor): tartalommotor, közzétételi kapu, R3 kiadása lektor után, ábrák, netlista → elrendezés → rajz
  kalkulatorok.md       Kalkulátorok és a közös kézikönyv-keret
  lektoralas.md         Lektori csomag folyamata: küldés, javítás, a SIZING_REVIEW, a T1 kalkulátorrekordok és az R3 (bekötési ábrás) cikkrekordok rögzítése
  lektori-csomag.md/.pdf  Generált lektori csomag (LK-n) – kézzel ne szerkeszd

content/tudastar/       Tudástár forrásvázlatai (Markdown + YAML front matter): elmelet/ (18 közzétett R1/R2), r3/ (13 R3 + 20 netlista – lektorra vár, NEM közzétehető), diagramok/ (a netlisták elrendezése: csak geometria, a netlista ujjlenyomatához kötve), r3-sim/, lektori-kerdesek-*.md
content/tudastar/kerdesek/  A statikus kérdésbank forrása (<témakör>.json; MI-tervezet, lektorra vár – a kérdésszerző írja, a kiadó csak olvassa)

tests/
  auth-flow.mjs         Auth integrációs teszt (lokális Worker ellen)
  mysql-config.mjs      MySQL konfigellenőrzés
```

---

## Fejlesztés és build

```bash
# Előfeltétel: Node.js >= 22.13

npm run install:ci      # CI-barát telepítés
npm run dev             # Dev szerver: http://localhost:5173
# Megosztási és e-mail-linkek helyi kipróbálásához APP_ORIGIN kell (nélküle a link létrehozása 503):
CLOUDFLARE_INCLUDE_PROCESS_ENV=true APP_ORIGIN=http://localhost:5173 npm run dev
npm run build           # Cloudflare Sites build (dist/)
npm run build:node      # Node.js build (dist/, standalone)
npm run start           # Sites preview (Wrangler local)
npm run start:node      # Node.js prod (igényel .env.production és MySQL-t)
npm run lint            # ESLint
npm run db:generate     # Drizzle migrációk generálása
```

### Lokális D1 migrációk (egyszer kell alkalmazni, build után)

Friss adatbázisnál a `drizzle/0000…0011` fájlokat mind sorrendben kell alkalmazni (a minta két parancsa a `--file` cseréjével); meglévő helyi adatbázisnál csak az újakat (legutóbb: `drizzle/0011_colossal_madame_masque.sql`, `product_catalogs` tábla; előtte `drizzle/0010_late_king_cobra.sql`, `plan_shares` tábla, és `drizzle/0009_wonderful_lucky_pierre.sql`, `workbooks` tábla).

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js \
  d1 execute DB --local --config dist/server/wrangler.json \
  --persist-to .wrangler/state --file drizzle/0000_perfect_absorbing_man.sql

node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js \
  d1 execute DB --local --config dist/server/wrangler.json \
  --persist-to .wrangler/state --file drizzle/0001_omniscient_iceman.sql
```

### Auth integrációs teszt

```bash
node tests/auth-flow.mjs   # lokális Worker + D1 szükséges, http://127.0.0.1:5180
```

---

## Adatbázis

### Séma – főbb táblák

| Tábla | Leírás |
|---|---|
| `users` | Felhasználók (id, email, name, passwordHash, emailVerifiedAt, authVersion) |
| `sessions` | Munkamenetek (tokenHash, userId, expiresAt, authVersion) |
| `auth_limits` | Rate limiting (key=hash(email/ip+időbucket), attempts, expiresAt) |
| `plans` | Tervek (id=projectKey, data JSON, revision, updatedAt, state) |
| `plan_versions` | Verzióelőzmények (projectId, revision, data, savedAt) |
| `template_libraries` | Felhasználói sablon könyvtárak |
| `workbooks` | Felhasználónkénti ügyfél- és teendő-munkafüzet (JSON + revision) |
| `product_catalogs` | Felhasználónkénti termékkatalógus (JSON: termékek + fiók-alapértelmezések, revision; user_id FK CASCADE) |
| `plan_shares` | Tervmegosztási linkek (token_hash = SHA-256, owner_id FK CASCADE, project_id/project_key, label, allow_pdf, auth_version, created/expires/last_viewed_at ms) |
| `billing_settings` | Stripe konfig (titkosítva, admin panelről állítható) |
| `billing_grants` | Projekt jogosultságok (free / live / sub_live mode) |
| `billing_orders` | Stripe rendelések |
| `billing_subscriptions` | Stripe előfizetések |
| `mail_settings` | Resend API konfig (titkosítva) |
| `account_tokens` | E-mail-visszaigazolás / jelszócsere tokenek |
| `billing_profiles` | Számlázási profilok |
| `invoice_jobs` | Számla-generálási feladatok (queue) |

### Projekt kulcsok

```
account:{userId}                  ← default (első ingyenes) projekt
account:{userId}:project:{UUID}   ← többletprojektek
```

### Cloudflare D1 vs MySQL

- **D1**: Cloudflare Sites deploy esetén automatikus. Helyi dev: `.wrangler/state`.
- **MySQL**: `MYSQL_URL` szerver-oldali secret beállításával aktiválható. Node.js deploy esetén kötelező.
- A kódban `db.kind === 'mysql'` elágazások kezelik az eltérő SQL szintaxist (pl. `INSERT IGNORE INTO` vs `ON CONFLICT DO NOTHING`).

---

## Autentikáció

- Saját e-mail/jelszó rendszer, ChatGPT-fiók nem szükséges.
- Jelszó: bcrypt (cost=12), min 12 karakter, max 72 byte.
- Token: 32 byte crypto random hex, SHA-256 hash tárolva DB-ben, 7 napos lejárat.
- Cookie: `__Host-shockcraft_session` (HTTPS éles), `shockcraft_session` (localhost).
- `authVersion`: jelszócsere vagy globális kijelentkezés minden munkamenetet invalidál.
- Rate limit: 12 kísérlet/15 perc/email cím, 40/IP. `auth_limits` tábla, időbucket alapú.
- CSRF: `sameOrigin()` ellenőrzés (Origin header + Sec-Fetch-Site: cross-site tiltva).

---

## Billing (Stripe)

```
MONTHLY_PRICE = 2 490 Ft/hó  → korlátlan projekt + export
PROJECT_PRICE = 3 490 Ft     → egy extra projekthely egyszeri díjért
```

**Jogosultság-logika (`lib/billing.ts`):**
1. Minden usernek van egy `free` grant az első projekthez (`ensureFreeGrant`).
2. Aktív előfizetéssel: új projektek automatikusan `sub_live` grant-ot kapnak.
3. Előfizetés nélkül: vásárolt `live` grant-ok foglalhatók le projektekhez.
4. `projectAccessChecker()`: closuret ad vissza, amely project key-re eldönti az elérhetőséget.
5. Admin user (`ADMIN_USER_ID` env): test Stripe mode is elérhető az admin panelen.

**Export jogosultság (projektenként):** `exportAccess()` (`lib/billing.ts`) + `GET /api/transfer-access?purpose=export&projectId=…`, kliensen `checkExportAccess()`. `free` vagy egyszeri (`live`/`test` a módnak megfelelően) grant → előfizetés nélkül exportálható; `sub_*` vagy grant nélküli projekt → aktív előfizetés kell; archivált/lomtáras → 409 `PROJECT_INACTIVE`; nem mentett → 409 `SAVE_REQUIRED` (aktív előfizetéssel engedélyezett). Az import (paraméter nélküli hívás) továbbra is csak előfizetéssel. Teszt: `tests/export-access.ts`.

---

## Tervfájl-séma (`lib/plan.ts`)

A teljes terv egy Zod-dal validált JSON objektum (`planSchema`):

```
Plan {
  version: 1
  name: string
  quote?: Quote               ← árajánlat (opcionális)
  plot: {                     ← telektérkép
    name, w, h                ← méter egységek
    nodes: SiteNode[]         ← bekötési pont, mérő, főelosztó, lakáselosztó, alelosztó
    routes: SiteRoute[]       ← telki összekötések (underground/surface/overhead)
  }
  buildings: Building[] {
    id, name, x, y, w, h      ← telken belüli pozíció (méter)
    floors: Floor[] {
      id, name
      elevation               ← szintmagasság méterben
      rooms: Room[]           ← téglalap szobák (pixel, 40px = 1m)
      walls: Wall[]           ← szabad falszakaszok (a→b pontok)
      devices: Device[]       ← szerelvények (kind, x, y, angle, height cm)
      routes: Route[]         ← kábelnyomvonalak (points[], mode, planeHeight cm)
      background?: Background ← háttéralaprajz kép
      dimensions?: Dimension[]← méretvonalak
    }
    board?: {rows, modulesPerRow, autoBars?}  ← fő elosztó mérete (max 12×36); autoBars=false kikapcsolja az automatikus N/PE-bekötést (hiányzó = bekapcsolva)
    extraBoards?: Board[]          ← extra elosztók (max 19; ugyanígy autoBars?)
  }
  circuits: Circuit[]         ← áramkörök (phase L1/L2/L3/3P, rating, curve B/C/D, rcd, load? W,
                                 sizing? {method, insulation, ambient, grouped, length, cosPhi, usage})
  sizing?: {                  ← méretezési segédszámítás projektbeállításai (mind opcionális)
    methodInside, methodOutside, insulation, ambient, grouped, supply, earthing,
    boards?: {building, board, upstreamDrop?, zs?}[], overrides?: {method, insulation, loaded, section, iz, note}[]
  }
  modules: Module[]           ← elosztó modulok (type, width 1-8, row, slot)
  boardWires: BoardWire[]     ← elosztón belüli KÉZI bekötések (végpont: circuit | module | bar); az automatikus N/PE-vezetékek nem tárolódnak (lib/board-bars.ts)
}
```

**Szerelvény `kind` értékek:**
`socket`, `double`, `switch1`, `switch2`, `switch5`, `switch6`, `switch7`, `rj45`, `phone`, `light`, `box`, `panel`

---

## Koordináta-rendszer

- **Alaprajz:** pixel egységek, **40 px = 1 méter**
- **Telektérkép:** méter egységek
- **Magasságok:** centiméterben (beépítési magasság, nyomvonal síkmagasság, szabad végpontok)
- **Szintmagasság (elevation):** méterben
- Közös telek-origó: az épületek x/y pozíciója méterben a telek (0,0) pontjához képest

---

## PDF export

- Motor: **jsPDF**, vektoros output, A4 vagy A3 fekvő, 100%-os nyomtatás = helyes méretarány
- Betűkészlet: **NotoSans** (beágyazott TTF, teljes magyar ékezet-támogatás)
- Scope: `floor`, `plot`, `board`, `all`, `single`, `multi`
- Tartalom: alaprajz + telek rajz + elosztó kapcsolási rajz + szerelvényjegyzék + nyomvonaljegyzék + áramkörlista + fázisterhelés
- `PdfOptions.sizing === true` (alapból ki): az elosztóoldalakra „méretezési segédszámítás” és „méretezés indoklása” tábla, módosított lábléc; a NotoSans-ból hiányzó ≤ ≥ ≈ √ jeleket a `clean()` cseréli
- Méretarány-jelző és dátum minden oldalon
- Export aktív havi előfizetéshez kötött (backlog: ingyenes/egyszeri projekt kivétel)

---

## Deployment

### Cloudflare Sites (alapértelmezett)

```bash
npm run build   # → dist/
# Cloudflare Pages/Sites deploy a dist/ könyvtárból
# D1 adatbázis a Cloudflare dashboardon konfigurálva
```

### Node.js / VPS

```bash
npm run build:node   # SHOCKCRAFT_TARGET=node → dist/ (standalone Next.js)
npm run start:node   # igényel .env.production és MySQL-t
```

Részletes útmutató: `docs/telepites.md`, minták: `deploy/` könyvtár.

### Szükséges environment változók

```env
# Mindkét deploy típusnál
APP_ORIGIN=https://shockcraft-villanytervezo.lollipopp23.chatgpt.site
ADMIN_USER_ID=<user UUID az adatbázisból>
SESSION_SECRET=<64 hex karakter a seal/unseal-hez>

# Node.js / MySQL deploy esetén kötelező
MYSQL_URL=mysql://user:pass@host:3306/dbname
SHOCKCRAFT_NODE_RUNTIME=1

# Opcionális (admin panelről is beállítható DB-ben)
# Stripe és Resend kulcsok
```

---

## Fontos fejlesztési elvek

### Nyelv
Az alkalmazás **teljesen magyar nyelvű**. UI szövegek, validációs üzenetek, PDF tartalom, API hibaüzenetek, kommentek – mind magyarul. Új fejlesztésnél is magyarul írj felhasználó felé irányuló szövegeket.

### Két build target
A `SHOCKCRAFT_TARGET` env változó dönti el:
- nem definiált → **Cloudflare Sites** (Vite + Wrangler + D1)
- `node` → **Node.js standalone** (MySQL kötelező)

A `cloudflare:workers` import Node.js build esetén `db/node-env.ts` fájlra van aliasra a vite.config.ts-ben.

### Verzióvédelem
A tervek `revision` számot kapnak. PUT API ellenőrzi, hogy a kliens a legfrissebb verziót írja-e felül (`plan_versions` tábla). Párhuzamos szerkesztést véd.

### Admin panel
Az `/admin` oldal csak akkor érhető el, ha a bejelentkezett user `userId`-ja egyezik az `ADMIN_USER_ID` env változóval. Ellenőrzés: `isAdmin()` a `lib/billing.ts`-ben.

### Tesztelés
- `tests/auth-flow.mjs` – teljes auth flow integrációs teszt lokális Worker ellen
- `tests/mysql-config.mjs` – MySQL kapcsolat ellenőrzés
- `tests/workbook.ts` – ügyfél/teendő lib-teszt: `node_modules/.bin/tsx tests/workbook.ts`
- `tests/workbook-api.ts` – `/api/workbook` route-teszt memóriabeli SQLite-on: `node_modules/.bin/esbuild tests/workbook-api.ts --bundle --platform=node --format=esm --external:mysql2 --alias:cloudflare:workers=./db/node-env.ts --outfile=.sites-runtime/workbook-api.mjs && env -u MYSQL_URL node --no-warnings .sites-runtime/workbook-api.mjs`
- `tests/share.ts` – tervmegosztás lib-teszt (token, sémák, adatminimalizálás, statikus őrök): `node_modules/.bin/tsx tests/share.ts`
- `tests/share-api.ts` – `/api/plan-share` és `/api/shared-plan` route-teszt memóriabeli SQLite-on: `node_modules/.bin/esbuild tests/share-api.ts --bundle --platform=node --format=esm --external:mysql2 --alias:cloudflare:workers=./db/node-env.ts --outfile=.sites-runtime/share-api.mjs && env -u MYSQL_URL node --no-warnings .sites-runtime/share-api.mjs`
- `tests/board-bars.ts` – tokozati PE/N-sínek és automatikus N/PE-bekötés: sínek elosztónként (üres elosztó nélkül), ÁVK-csoport (név, első tag, kis-nagybetű, nem azonosítható, bekötés – fázissín/leágazó/sorkapocs/csoport-kismegszakító mögött és az L-bemenetek áthidalásán át is, körökkel; az áramkör saját L-szálának vezetéke (hozzárendeletlen kismegszakító → sorkapocs, közvetlenül az ÁVK/főkapcsoló, fázissín, idegen RCBO, saját RCBO, 3P) – a szövegnél erősebb, bekötés–szöveg ellentmondás, RCBO mögül táplált védelem, RCBO saját neve a szövegben, másik elosztó), RCBO (N-kimenet kézi vezetékkel is), betápláló készülékek (több főkapcsoló, kaszkádolt ÁVK, SPD), nem táplált, többször táplált és idegen forrásról táplált sín (régi DIN-es nullasín, főkapcsoló N-kimenete az ÁVK N-bemenetére, ÁVK N-kimenete a főnullasínre, FI-02 N-kimenete FI-01 sínjére, főkapcsoló → ÁVK átkötés, cserélt betáplálás, főkapcsoló nélküli alelosztó; sorkapcson/leágazón át betáplálás, fogyasztói út), a 26. blokk az N-hálózat-modell esetei (kézzel összekötött sínek sorkapcson / leágazón / nullasín-modulon / közös készülékkapcson át, három sín, D1a–D1c, a készülék N-pólusának áthidalása E1–E3, a gyökér nélküli nullasín-modul mint sínbővítés, kaszkád) pontos figyelmeztetés-listával, a 27. blokk 2400 véletlen kézi áthidalású terv (sínek, sorkapocs/leágazó/nullasín-modul N-csomópontok, ÁVK/főkapcsoló/RCBO N-kapcsok, áramköri N-szálak) a független `feedOracle`-lal (hálózatonként egy sín, forrás csak a saját betápláló, a készülék N-pólusa nem hidalt); a szabályok mutáns-próbával ellenőrizve, kézi felülírás és sínkapocs-kihagyás, `autoBars:false`, kapocsszám, törlés/tisztítás, szintmásolás/épülettörlés, séma- és megosztási körút (a kézi vezeték „auto:” azonosítója betöltéskor átneveződik, ütköző sínazonosítópár nem tölthető be), minden esetben `validateBoard` az automatikus vezetékekkel is, L-vezeték/N–PE/sín–sín tiltás: `node_modules/.bin/tsx tests/board-bars.ts` (a `schematic`, `cabinet`, `multiple-boards`, `board-size-circuits`, `board-wiring`, `sizing` teszt eredeti „nincs automatikus vezeték” állításai `autoBars:false`-szal maradtak meg, az alapértelmezett viselkedés külön blokkban)
- `tests/catalog.ts` – termékkatalógus lib-teszt (séma, CSV-import/-export, mintakészlet, típuskulcs): `node_modules/.bin/tsx tests/catalog.ts`
- `tests/quote-products.ts` – ajánlat ↔ termék (típusválasztás, árfrissítés, anyagkimutatás-CSV, megosztás, PDF-füst): `node_modules/.bin/tsx tests/quote-products.ts`
- `tests/sizing-tables.ts` – méretezési táblázatok (relációk, források, lookupok, ujjlenyomat, jóváhagyási kapu): `node --no-warnings --import tsx tests/sizing-tables.ts`
- `tests/sizing.ts` – méretezési segédszámítás kézzel számolt példákkal (kábeljelölés, képletek, seed, ellenőrzések, séma, tervellenőrzés, PDF, szóhasználat, megosztás): `node --no-warnings --import tsx tests/sizing.ts`
- `tests/calc.ts` – kalkulátormotor: parseNum/formázás, definíciók (szóhasználat, metaadat, szigetek), kiadási kapu (az elvárt állapot a `RELEASES`-ből levezetve, T0 közzétéve, T1 csak lektori rekorddal, tartalmi és forrás-ujjlenyomat – `scripts/calc-source.ts`, táblázat-kapu, T2 tiltva), ellenőrzési regressziók, tervezői linkek, URL oda-vissza, fuzz, 10 000 seedes tulajdonságteszt, egyezés a Méretezés/Fázisterhelés számításával: `node_modules/.bin/tsx tests/calc.ts`
- `tests/calc-golden.ts` – 217 golden eset relatív tűréssel és mutációs próbával (definíciós példák, független kiegészítő esetek, a terv 5.3 értékei): `node_modules/.bin/tsx tests/calc-golden.ts`
- `tests/kb-search.ts`, `tests/kb-storage.ts` – kereső és vendégtárolás: `node_modules/.bin/tsx tests/kb-search.ts`
- `tests/kb-guards.ts` – statikus őrök (importgráf: nincs db/auth/billing/pdf/lib/plan/zod/next/headers; nincs getAccount/cookies/headers/fetch; dangerouslySetInnerHTML csak JSON-LD/téma; a tervező csak lib/kb/links.ts-t importál; content/, scripts/, node:fs tiltva; kliensszigetbe nem kerül Tudástár-törzs, -regiszter vagy -kapu; a Tesztek szigetét csak a tesztoldal importálja, a T1-sablonokat statikusan csak az all-templates; a Tudástár-oldal szerverkomponens; fejlécek; kulcsok): `node_modules/.bin/tsx tests/kb-guards.ts`
- `tests/sizing-formulas.ts` – a lib/sizing-formulas.ts kiemelésének regressziója: `node_modules/.bin/tsx tests/sizing-formulas.ts`
- `tests/lektori-csomag.ts` – lektori csomag (LK-n): a `docs/lektori-csomag.md`/`.pdf` naprakész, kiadások (`EDITIONS`), minden táblázatérték tétele, a 2. rész a méretezés függvényeivel és a mintatervvel, a 3. rész (T1 kalkulátorok) a `runCalc`-kal és a bemeneti korlátokkal összevetve, a 4. rész (24 biztonsági szabály, 20 bekötési ábra: rajz a PDF-ben, vezeték- és kapcsolóállás-tábla a szimulátorral, ábránkénti ujjlenyomat-pár, egyedi azonosítójú lektori kérdések tiltólistával, belső jegyzetek kizárása, R3-rekord kötése: `diagramRefProblems`), az 5. rész (13 R3 cikkvázlat teljes szöveggel, tartalmi ujjlenyomat, `BLOCKED`, rekordkötés: `articleRefProblems`), a kirajzolt PDF ellenőrzése mutációs próbákkal (`pdfProblems`), jóváhagyó lap, a név megjelenése (`reviewText`, kalkulátorjelvény), `docs/meretezes.md` „Mit nem vizsgál” = program: `node --no-warnings --import tsx tests/lektori-csomag.ts`; generálás: `node --import tsx scripts/lektori-csomag.ts` (`--check`: csak ellenőriz); folyamat: `docs/lektoralas.md`
- `tests/approval-simulation.ts` – szimulált jóváhagyás (betöltési horoggal, a fájlok változatlanok): a `sizing-tables`, `sizing`, `calc`, `calc-golden`, `kb-guards`, `quiz` teszt a jóváhagyott `SIZING_REVIEW`-ra és két T1 lektori rekordra is zöld, név nélkül és névvel: `node --no-warnings --import tsx tests/approval-simulation.ts`
- `tests/kb-content.ts` – Tudástár-tartalommotor és -kapu: generált modulok naprakészek, front matter teljes, tartalom-hűség (a renderelt szöveg = a vázlat), pontosan a 18 R1/R2 közzétett, R3 sehol (static params, sitemap, kereső, linkcél, build bemenetei), tartalmi és ábra-ujjlenyomat a rekordban és kockázati alsó korlát (mutációs próbákkal), a lustán töltődő keresőindex = a közzétett tételek, belső linkek (R3-ra szövegként, „hamarosan – szakmai lektorálás alatt”), szótár-horgonyok, ábra minden helyőrzőhöz, „kiadás ellenőrzés alatt”: `node_modules/.bin/tsx tests/kb-content.ts`
- `tests/kb-routes.mjs` – build utáni füstteszt mindkét targeten (kalkulátorok és Tudástár; R3 404 – perjellel és RSC-kéréssel is –, a csak R3 kategóriák és a `/tudastar/semak` 404-e, Sémák-link, netlista-felirat és ábrajelölő sehol, R3 link és szöveg sehol: Tudástár, főoldal, hub, kalkulátoroldalak; title ≤ 60; Tesztek: fül, jelölés, kanonikus URL, JS nélküli tartalék, „Teszteld magad”, T1-sablon sehol, a kérdésbank kiadatlan szövege egyik oldalon sincs, sitemap): `BASE=http://127.0.0.1:8787 node tests/kb-routes.mjs`
- `tests/kb-figures.mjs` – build utáni böngészős (Playwright) ellenőrzés: 320 px-en nincs vízszintes görgetés, ábrafeliratok 320/390 px-en ≥ 9/10 px és keretben, szövegközi linkek linkként jelölve, JS nélkül a cikkműveletek rejtve, érintési célok ≥ 44 px; Tesztek 320 px-en (beállítás, gyakorló, vizsga, eredmény) görgetés nélkül, 390 px-en az alsó sáv nem nyeli el a fókuszban levő mező melletti gomb koppintását/kattintását, billentyűzetes fókuszkezelés, élő régiók, linkjelölés, JS nélkül mintafeladat: `BASE=http://127.0.0.1:8787 node tests/kb-figures.mjs`
- `tests/kb-dist.mjs` – build utáni őr: az R3 vázlatok, a netlisták feliratai, a bekötési ábra jelölői (`tests/kb-r3-needles.mjs`) és a kérdésbank kiadatlan kérdéseinek szövege (`tests/kb-quiz-needles.mjs`) nincs a `dist/`-ben, a cikktörzs nincs a kliens-JS-ben, a T1-sablonok szövege csak a saját, be nem töltött `templates-t1` csomagban: `node tests/kb-dist.mjs`
- `tests/kb-circuit.ts` – a TS-netlistaszimulátor (`lib/kb/circuit.ts`) = a Python `sim.py` és bővítései: 20 netlista minden állása (kimenetek, hálózatok, energizált hálózatok, invariánsok, vezetéktábla), 1190 mutáns azonos PASS/FAIL-lal, kóddal, üzenettel; érszintű áramút: `node --no-warnings --import tsx tests/kb-circuit.ts` (referencia: `python3 -I scripts/kb-circuit-reference.py --check`)
- `tests/kb-diagram.ts` – rajz = netlista: a kirajzolt SVG-ből visszaolvasva (erek, kapcsok, színek, feliratok, csomópontok, keresztezések, érintkezők, átfedés, olvashatóság ≥ 10 px, kontraszt), Működés = szimuláció mind a 208 állásban, figura (nézetváltó, aria-pressed, aria-live, táblák), ábra-ujjlenyomat; mutációs próba (819): `node --no-warnings --import tsx tests/kb-diagram.ts`
- `tests/kb-semak.ts` – Sémák: sablonok szimulált jóváhagyással (gyűjtő- és részletoldal), csak a közzétett cikk ábrája generálódik, kapu (ábra-/szimbólummódosítás → újraellenőrzendő, belső rekord R3-ra nem), R3-ellenőrzés mutációs próbával; valós állapot: 0 közzétett séma: `node --no-warnings --import tsx tests/kb-semak.ts`
- `tests/quiz.ts` – Tesztek: sablononként 10 000 seedes tulajdonságteszt (helyes = `runCalc`, a tévesztők egyediek, ≥ 5 % eltérés, növekvő sorrend, magyar számformátum; a helyes válasz helye A–D egyenként 10–50 %, számolás nélküli stratégia ≤ 40 %, egyedüli ikerpár nincs; valószerű paramétertér), motor-determinizmus, témakvóta (legnagyobb maradék), ismétlésmentesség, `w = h · r`, tesztkód oda-vissza (URL-lel), kapu (a T1-sablon rejtve, levezetve a kalkulátorkapuból; bank rejtve 150 alatt – mutációs próba ideiglenes másolaton, a valódi jóváhagyásoktól függetlenül), kérdésbank-séma a `content/tudastar/kerdesek/*.json`-ra (ha még nincs fájl, nem bukik), szivárgásőr a build bemeneteire, azonosítójegyzék (csak bővülhet), lektori CSV oda-vissza (UTF-8, Windows-1250, UTF-16LE), tárolás, tiltott kifejezések: `node --no-warnings --import tsx tests/quiz.ts`
- `tests/planner-layout.mjs` – build utáni böngészős (Playwright) elrendezési teszt a tervezőhöz, 16 ablakméreten (1920×1080 … 360×740, érintéssel is): a dokumentum soha nem görög (minden nézetben, az Elosztó „Bekötések” után is), 1050 px-ig a tulajdonságpanel nem nyílik meg magától (kijelölési címke + kapcsoló, Escape/Delete/szint- és fülváltás zárja, töréspontváltáskor zárva), a nyitott panel nem takarja a füleket/eszköztárat (táblagépen a vászon tetejétől, telefonon alsó lap), a fülek nem lógnak rá az eszköztárra, 1051 px-től a dokkolt panel változatlan, sötét mód, szellemkattintás, fókusz: `BASE=http://127.0.0.1:8787 node tests/planner-layout.mjs` (helyi preview + D1-migrációk kellenek; eldobható fiókot regisztrál; `SIZES=1024x768,390x844`, `JOBS`, `SHOTS`)
- `tests/catalog-api.ts` – `/api/catalog` route-teszt memóriabeli SQLite-on: `node_modules/.bin/esbuild tests/catalog-api.ts --bundle --platform=node --format=esm --external:mysql2 --alias:cloudflare:workers=./db/node-env.ts --outfile=.sites-runtime/catalog-api.mjs && env -u MYSQL_URL node --no-warnings .sites-runtime/catalog-api.mjs`
- Unit tesztek nincsenek; a `validatePlan()` (`lib/plan.ts`) az elsődleges validációs pont

---

## Nyitott feladatok (docs/BACKLOG.md)

1. ~~**Export jogosultság-fix**~~ – kész: ingyenes és egyszeri projektek előfizetés nélkül exportálhatók (lásd fent).

2. **Árajánlat-PDF** (kész, útiköltséggel) – tervből átvett anyaglista, anyagár + munkadíj, ÁFA-kezelés, összesítés, PDF export. Kód: `lib/quote.ts`, `lib/quote-schema.ts`, `components/quote-*.tsx`.

3. **Fázisterhelés** (kész) – áramkörönkénti terhelés (megadott vagy becsült), elosztónkénti L1/L2/L3 összesítés, figyelmeztetések, PDF-táblázat. Kód: `lib/phase-load.ts`, `components/phase-load-report.tsx`, doksi: `docs/fazisterheles.md`.

4. **Ügyfél- és feladatkezelés** (kész) – fiókszintű `workbooks` JSON-munkafüzet revisionnel: ügyféltörzs, projekt–ügyfél hozzárendelés, teendők (projekt / ügyfél / általános), Esedékes nézet és jelvény, árajánlat-kitöltés. Archivált/lomtáras projektre 409, zároltra 402, nem mentettre 409; törlés mindig engedett; a `plans` táblát nem írja. Kód: `lib/workbook*.ts`, `app/api/workbook/route.ts`, `components/workbook-*.tsx`, doksi: `docs/ugyfelek-teendok.md`.

5. **Tervmegosztás** (kész, 1. lépés) – csak olvasható, lejáró (1/7/30/90 nap), visszavonható link a legutóbb mentett változatról; `/megosztas#t=<token>`, csak a token SHA-256 lenyomata tárolódik; a megtekintő nem kap árajánlatot, hátteret, tulajdonosi vagy belső azonosítót; PDF/SVG csak `allow_pdf` ÉS a tulajdonos aktuális `exportAccess`-e mellett; archiválás/zárolás szüneteltet, lomtár/jelszó-visszaállítás/fióktörlés megszüntet; egységes 404, saját rate limit (`share-ip`/`share-link`/`share-create`). Kód: `lib/share*.ts`, `app/api/plan-share`, `app/api/shared-plan`, `app/megosztas`, `components/share-*.tsx`, `components/floor-drawing.tsx`, doksi: `docs/tervmegosztas.md`.

6. **Termékkatalógus** (kész, MVP) – fiókszintű `product_catalogs` JSON-blob revisionnel (2000 termék / 1,5 MB, minden fióknak ingyenes); CSV-import (UTF-8/UTF-16LE/Windows-1250, `;`/`,`/tab, magyar számformátum, árrés/bruttó), CSV-export, 25 tételes mintakészlet. A projekt termékválasztása a `plan.quote`-ban él (`productDefaults` + soronkénti `product`/`productPinned` pillanatkép), így visszavonható és a megosztásba nem kerül; illesztés a `MaterialRow.ref` gépi kulccsal, a `materialKey`/`quoteSource` változatlan. Árfrissítés csak gombbal; a munkadíjat csak üres helyre írja. PDF-ben „Termék: …” sor (mód: gyártó+név / +cikkszám / nincs), mintatermék nélkül. Kód: `lib/catalog*.ts`, `lib/product-refs.ts`, `lib/quote-products.ts`, `app/api/catalog`, `components/catalog-manager.tsx`, `components/product-picker.tsx`, `components/quote-products.tsx`, `components/use-catalog.ts`, doksi: `docs/termekkatalogus.md`.

7. **Méretezési segédszámítás** (kész, jóváhagyás függőben) – tervezői ellenőrzést segítő számítás áramkörönként: legkisebb keresztmetszet, Ib ≤ In ≤ Iz, I2 ≤ 1,45 · Iz, feszültségesés (G.52.1), Zs megadása esetén hurokimpedancia (TN). Minden szám a `lib/sizing-tables.ts`-ben, forrással; `SIZING_REVIEW` ujjlenyomathoz kötött, kezdetben „ellenőrizendő”; XLPE-tábla `null` (PVC-tartalék, feltételezésként). Bemenetek opcionális tervmezőkben (`circuits[].sizing`, `sizing`), nincs új tábla/migráció/API; a megosztott tervből törlődnek. Tervsegéd „Méretezés” fül, `PdfOptions.sizing` (alapból ki), `checkPlan(plan,{sizing:true})` (csak fail/na). Kód: `lib/sizing*.ts`, `components/sizing-report.tsx`, doksi: `docs/meretezes.md`.

8. **Kalkulátorok** (kész, 1–2. fázis) – `/kalkulatorok`, ingyen, belépés és süti nélkül, statikus (ISR) oldalak, CSP. 19 T0 kalkulátor közzétéve („Belsőleg ellenőrizve”, független újraszámolással), 8 T1 (feszültségesés, motoráram, LED-szalag tápegység, fázisjavítás, keresztmetszet, kismegszakító, hurokimpedancia, terhelhetőség-táblázat) elkészült, de csak szakmai lektori rekorddal (és a táblázatalapúak – a feszültségesés is – `tablesApproved()`-dal) adhatók ki – az egyetlen konfigurációs pont a `lib/calc/release.ts`. T2 nem épül. Elérés: nyilvános fejléc, főoldal, tervező felső sávja, Tervsegéd, Fázisterhelés-mélylink (a Méretezés-mélylink a T1 kiadásakor jelenik meg). Új böngészőkulcsok: `shockcraft-kb-bookmarks-v1`, `shockcraft-kb-recent-v1` (előzmény csak a bemenet módosítása után), `shockcraft-kb-prefs-v1` (csak ha a „/” gyorsbillentyűt kikapcsolják). A kiadási rekord tartalmi (`fingerprint`) és forrás-ujjlenyomatot (`source`) is rögzít: a számítás kódjának vagy egy közös modulnak (pl. `lib/calc/number.ts`, `lib/sizing-formulas.ts`) a módosítása után a rekordot újra kell ellenőrizni (`scripts/calc-release.ts list`). A tervező JS-e +6,6 KB gz-vel nőtt (a terv +2 KB-ot engedett; a tulajdonos 2026-10-19-én elfogadta; mérés és bontás a `docs/kalkulatorok.md`-ben). Lektori anyag: a lektori csomag 3. része (LK-3-tól, kalkulátoronként `KAL-<SLUG>` blokk az ujjlenyomat-párral és kalkulátoronkénti döntéssel; `docs/lektoralas.md`). Kód: `lib/calc/*`, `lib/kb/*`, `lib/sizing-formulas.ts`, `components/calc`, `components/kezikonyv`, `app/(kezikonyv)`, doksi: `docs/kalkulatorok.md`.

9. **Tudástár – Elmélet és szakszótár** (kész, R1/R2) – `/tudastar` (kezdőlap: kereső, „Folytasd”, kalkulátorok kiemelve, kategóriák), `/tudastar/elmelet` (+ `kategoria/<id>`), `/tudastar/elmelet/<slug>` (Röviden, tartalomjegyzék, ábrák, képletek, kidolgozott példák, Gyakori tévedések, kapcsolódó cikkek és kalkulátorok, források „kiadás ellenőrzés alatt” jelöléssel, változásnapló, jelvény, R2-nél Figyelem-doboz), `/tudastar/szotar` (horgonyok, DefinedTermSet). Forrás: `content/tudastar/elmelet/*.md` → `scripts/kb-content.ts build` → `lib/kb/content/generated` (a repóban; futásidőben nincs parser, a kliensbe nem kerül törzs). A kapu (`lib/kb/release.ts`, szabálya `lib/kb/content/gate.ts`) rekordja a tartalmi és az ábra-ujjlenyomathoz (`figures`: a kirajzolt SVG-komponens modulja, `kit.tsx`, a FIGURES-bejegyzés, az ábraszínek) kötött: a tartalom vagy egy ábra bármely módosítása után újra kell ellenőrizni, a rekordot frissíteni (`scripts/kb-content.ts list|record`), és a `build`-et újra futtatni (a böngészőbe lustán töltődő keresőindex `lib/kb/content/generated/search.ts` csak közzétett tételt tartalmaz). A biztonságkritikus kategóriákba (védelmi eszközök, érintésvédelem, munkabiztonság, kapcsolások, földelés) és a Sémák szekcióba csak R3 kerülhet (`categories.ts` `minRisk`; generálási hiba és kapu). Az R2 tételek belső ellenőrzéssel való kiadásának tulajdonosi megerősítése nyitott (`docs/tudastar.md` „Eltérések”). R1/R2: belső kettős ellenőrzés; R3: CSAK szakmai lektor (+ második olvasó) után – fejlesztő vagy MI `lektoralt` rekordot nem írhat. A kalkulátoroldalak „Kapcsolódó cikkek” szakasza és a cikkek kalkulátorlinkjei a front matter `calculators` mezőjéből. Kód: `lib/kb/content/*`, `lib/kb/release.ts`, `scripts/kb-content*`, `components/kezikonyv/article`, `components/kezikonyv/figures`, `app/(kezikonyv)/tudastar`, doksi: `docs/tudastar.md`.

10. **Tudástár – Tesztek** (kész: számolós gyakorló; a kérdésbank lektorra vár) – `/tudastar/tesztek`: 9 számolós sablon a közzétett T0-kalkulátorokra (`lib/quiz/templates.ts`; helyes érték és levezetés `runCalc`-ból, tévesztők megnevezett hibamodellekből; a helyes válasz helye a seedből egyenletes, előtaghiba csak 2 × 2-ben – a válaszok külalakja nem árulja el a helyeset; a 3 T1-sablon külön, lustán töltött modulban: `lib/quiz/templates-t1.ts`), Gyakorló / Vizsga / Hibáim, tesztkód (`lib/quiz/code.ts`), „Teszteld magad” a cikkekben, „Tesztek” fül, sitemap. Kapu – egyetlen konfigurációs pont: `lib/quiz/gate.ts` (sablon: a kalkulátor kapujából levezetve – T1-nél lektori rekord, táblázatosnál `tablesApproved()` – plusz ujjlenyomatos belső rekord; bank: ≥ 150 jóváhagyott kérdés, témakörönként ≥ 10, addig kérdésszöveg a build bemeneteibe sem kerül). Kérdésbank: `content/tudastar/kerdesek/<téma>.json` (séma: `lib/quiz/schema.ts`, zod csak szkriptben/tesztben; `"AI-tervezet"`/`"lektorra-var"` vázlat, közzétenni csak lektor által jóváhagyott, a tartalmi ujjlenyomatra szóló kérdést), `scripts/quiz-release.ts`, `scripts/quiz-csv.ts` (lektori CSV, 25-ös csomagok). A sziget kezdeti JS-e ≈ 9 KB gz, a motor és a kalkulátorok a teszt indításakor töltődnek; a többi oldal +0,24 KB (útvonaltábla), a Tudástár-oldalak +0,13 KB-tal többet. Kód: `lib/quiz/*`, `components/quiz/*`, `app/(kezikonyv)/tudastar/tesztek`, doksi: `docs/tudastar.md` „Tesztek (vizsgaszimuláció)”.

11. **Tudástár – Sémák és ábramotor** (kész, a lektorálásig rejtve; terv 3.4) – netlista (`content/tudastar/r3/*.netlist.json`) → elrendezés (`content/tudastar/diagramok/<id>.json`, csak geometria, a netlista ujjlenyomatához kötve) → jelenet (`components/kezikonyv/diagram/scene.ts`) → Bekötés nézet (szerver-SVG `data-wire/-from/-to`), Működés nézet (kliensszigete `diagram-run.tsx`, 1,7 KB gz, csak netlistás ábrát tartalmazó oldalon töltődik; aria-pressed, aria-live, érszintű áramút), „Vezetékek táblázatban” (`<details>`), kapcsolóállás-táblázat; PDF (lektori csomag 4. rész) ugyanabból. Egyenértékűség: `lib/kb/circuit.ts` = `sim.py` (`tests/kb-circuit.ts`); rajz = netlista (`tests/kb-diagram.ts`, 819 mutáns). Kapu: az ábra-ujjlenyomat (netlista, elrendezés, rajzoló kód, rajz-CSS) a cikk `figures` ujjlenyomatának része; a `lib/kb/content/generated/diagrams.ts` csak közzétett cikk ábráját tartalmazza (most üres); `/tudastar/semak` (+ `[slug]`) és a „Sémák” fül csak közzétett sémával; a `tests/kb-dist.mjs`/`kb-routes.mjs` a netlisták feliratait és az ábrajelölőket is keresi. R3 vázlat generáláskor: veszély-doboz a könyvtári szöveggel (`lib/kb/safety.ts` `bekotes`, `munkavegzes`), kötelező szakaszok, feszültségmentesítéssel kezdődő szerelési lépések (`checkR3`). Lektori csomag LK-4: 4. rész, `BEK-<ID>` blokkok, ábránkénti döntés, második olvasó; R3 rekord csak lektor után, `approvalRef` az ábrák ujjlenyomat-párjával (`diagramRefProblems`). Nincs Szerelési rajz nézet (a tervező szimbólumait a Tudástár nem importálhatja). Doksi: `docs/tudastar.md` „Sémák és ábramotor”, `docs/lektoralas.md` 4.3.

12. **Tervezett:** Tudástár 3. lépés folytatása (R3 kiadása lektor után – előtte a 4 blokkolt vázlat nem netlistás ábrái és a Szerelési rajz nézet, Tudnivalók, Könyvjelzők oldal, tervezői Tudástár-linkek; a kérdésbank élesítése a lektorálás után, profilonkénti küszöb), megosztás 2. lépés (megjegyzések, háttér a megosztott nézetben, link meghosszabbítása), közös szerkesztés más fiókból, termékkatalógus 2. ütem (szerelvényenkénti termék, összeállítás/kit, rendelési lista), méretezés 2. lépés (nyomvonalankénti szerelési mód, topológiai hossz, XLPE/E-táblázat jóváhagyás után, megosztott nézet).
