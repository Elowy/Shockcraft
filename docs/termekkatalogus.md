# Termékkatalógus

## Mit tud

- **Saját, fiókszintű termék- és árlista:** gyártó, termékcsalád, cikkszám, megnevezés (kötelező), egység (`db` vagy `m`), nettó ajánlati anyagár és munkadíj-javaslat Ft/egységben. A termék archiválható (visszaállítható) és véglegesen törölhető. Minden projektben használható.
- **Kézi felvétel és CSV-import:** UTF-8 (BOM-mal vagy anélkül), UTF-16LE („Unicode szöveg”) és Windows-1250 (magyar Excel „CSV (pontosvesszővel tagolt)” mentése) kódolás; pontosvessző, vessző vagy tabulátor elválasztó; magyar számformátum; árrés és bruttó → nettó átszámítás az importkor; előnézet új / módosított / változatlan / hibás sorokkal.
- **CSV-export:** a katalógus Excelben szerkeszthető, majd visszaimportálható (oda-vissza változatlan).
- **Mintakészlet:** 25 általános, ár, gyártó és cikkszám nélküli tétel „(minta)” jelöléssel (dugaljak, kapcsolók, kismegszakítók, áram-védőkapcsolók, kábelek…), egyúttal fiók-alapértelmezésnek állítva ott, ahol még nincs.
- **Projekt termékválasztása típusonként:** például „ebben a projektben minden dugalj: Legrand Valena Life …”. Egy típusválasztás az összes érintett tételt beárazza minden szinten és magasságon.
- **Soronkénti eltérés** az ajánlattáblában: egyedi termék, „Nincs termék ehhez a tételhez”, vagy vissza a projekt-alapértelmezésre.
- **Fiók-alapértelmezések:** típusonként ajánlott termék új projektekhez, a „Fiók-alapértelmezések alkalmazása” gombbal egy lépésben átvehető.
- **Árak frissítése a katalógusból:** a katalógus aktuális árai explicit gombbal kerülnek át az ajánlatba.
- **Megjelenés:** az anyagkimutatás táblájában („Termék: …”), az anyagkimutatás-CSV négy új oszlopában (Gyártó, Termékcsalád, Cikkszám, Termék megnevezése), az ajánlattáblában és az ajánlat-PDF-ben (a tétel neve alatt).

## Hol érhető el

- **Eszközök → Termékkatalógus:** a katalógus kezelése (új termék, CSV importálása, CSV letöltése, mintakészlet, keresés, szerkesztés, archiválás, törlés) és a fiók-alapértelmezések listája.
- **Eszközök → Árazás / árajánlat → Termékek és katalógusárak:** típusonkénti választás (Választás… / Csere… / Eltávolítás), „Fiók-alapértelmezések alkalmazása”, „Árak frissítése a katalógusból”. A választóablakban bejelölhető, hogy a termék új projektekben is ajánlott legyen (fiók-alapértelmezés).
- **Ajánlattábla:** a db és m egységű tételeknél a „Termék választása…” gomb (vagy a termék neve) nyitja a soronkénti választást.
- **Termékadatok a PDF-ben:** „Gyártó, termékcsalád, megnevezés” (alapértelmezés), „… és cikkszám”, „Nem jelenik meg”.

## CSV-formátum és Excel-mentés

Oszlopok (a sorrend tetszőleges, a fejléc kötelező, a fejléc fölött legfeljebb 9 címsor lehet):

`Azonosító; Gyártó; Termékcsalád; Cikkszám; Megnevezés*; Egység* (db vagy m); Nettó anyagár (Ft); Munkadíj (Ft)`

- Felismert fejlécváltozatok (kis- és nagybetű, ékezet és a záró „(Ft)” nem számít): például `Márka`, `Sorozat`, `Termékkód`, `Rendelési szám`, `Név`, `Termék`, `ME`, `Mértékegység`, `Ár`, `Nettó ár`, `Egységár`, `Listaár`, `Nettó listaár`, `Anyagár`. Az ismeretlen oszlopokat az előnézet felsorolja és figyelmen kívül hagyja.
- **Párosítás:** ugyanazzal az azonosítóval, vagy azonos gyártóval és cikkszámmal érkező sor a meglévő terméket frissíti (kis- és nagybetűtől függetlenül). Gyártóoszlop nélkül a cikkszám akkor párosít, ha pontosan egy ilyen termék van. A többi sor új termék lesz.
- **Hiányzó oszlop vagy üres cella a meglévő értéket nem változtatja** (az üres ár sem töröl). A megnevezés és az egység mindig íródik. A módosított mintatermék saját termékké válik.
- **Számformátum:** `1 234,50 Ft`, `1.234,5`, `1,234.50`, `12,5`, `1234.56` egyaránt működik; ha vessző és pont is van, az utolsó elválasztó a tizedesjel. A `12.500` alak 12 500 Ft-nak számít.
- **Egység:** `db`, `darab`, `pcs` → db; `m`, `fm`, `méter`, `folyóméter`, `mtr` → m. **Dobos vagy csomagos árnál előbb számold át egységárra** (Ft/m, Ft/db): a 100 m-es dob ára / 100.
- **Excel-mentés:** a „CSV (pontosvesszővel tagolt)” (ANSI, Windows-1250), a „CSV UTF-8” és a „Unicode szöveg” mentés is működik. Az ANSI mentés a `²` jelet nem tudja tárolni (Excel kicseréli), ezért ilyen nevekhez a „CSV UTF-8” mentést használd.
- **Importopciók:** „Árrés az importált anyagárakra (%)” (0–300) és „Az árlista bruttó (27% áfát tartalmaz)”. Csak az anyagárra hatnak: `ár / 1,27 × (1 + árrés/100)`, két tizedesre kerekítve; a munkadíjat nem érintik.
- **Hibás sor** (hiányzó név, rossz egység vagy ár, túl hosszú mező, a fájlon belül ismétlődő termék) kimarad; az előnézet az első 20 hibát sorszámmal mutatja. A cellán belüli sortörés szóközzé válik. Az exportban a `=`, `+`, `-`, `@` kezdetű cellák elé `'` kerül (képletvédelem); az import ezt visszaalakítja.
- **Tipp:** az összeállítást (például betét + keret + doboz) egy termékként vedd fel az összesített árral.

## Árak és ajánlat

A választott termék adatai – az árakkal együtt – **pillanatképként a tervbe** (az ajánlatba) másolódnak. A katalógus későbbi változása csak az „Árak frissítése a katalógusból” gombbal hat. Az ajánlat továbbra is a tétel saját anyagár- és munkadíj-mezőjéből számol; ezek csak az alábbi, explicit műveleteknél változnak:

| Művelet | Érintett sorok | Anyagár | Munkadíj |
|---|---|---|---|
| Típusválasztás (projekt-alapértelmezés) beállítása / cseréje | a típus tervből átvett, nem egyedi, egyező egységű sorai | a termék ára (ha van) | a termék munkadíja (ha van) |
| Soronkénti választás | az adott sor | a termék ára (ha van) | a termék munkadíja (ha van) |
| Tételek átvétele / Mennyiségek frissítése | csak az újonnan létrejött sorok | a projekt típusválasztásából | a projekt típusválasztásából |
| Fiók-alapértelmezések alkalmazása | a még választás nélküli típusok | mint a típusválasztásnál | mint a típusválasztásnál |
| Árak frissítése a katalógusból | minden termékhez kötött sor és típusválasztás | a katalógus aktuális ára (ha van) | **csak ha üres:** a katalógus munkadíja |

- Ár nélküli (üres árú) termék soha nem töröl meglévő árat.
- A kézzel módosított anyagár mellett „Katalógusár: …” jelzés látszik; az árfrissítés ezt is felülírja (megerősítés után).
- Minden tervmódosító művelet a tervező **Visszavonás** gombjával visszavonható, és a tervvel együtt mentődik. **A katalógus módosításai nem vonhatók vissza** (a sablonkönyvtárhoz hasonlóan).
- A törölt katalógustermék pillanatképe és ára a már elkészült ajánlatokban megmarad. Az árfrissítés ilyenkor azonosító, majd gyártó + cikkszám alapján keres; amit nem talál, annak ára nem változik (a gomb jelzi, hány ilyen termék volt).
- Típuskulcs: szerelvényfajta (pl. dugalj), elosztókészülék fajta + modulszélesség (+ kioldási jelleggörbe és névleges áram, pl. B16), telki pont fajtája, illetve a nyomvonal „Kábel jelölése” mezője normalizálva (a `3 × 2,5 mm²`, `3x2,5` és `3X2.5 mm2` ugyanaz). Jelölés nélküli kábelhez típusonként nem választható termék; erre figyelmeztetés jelenik meg, és a tételsorban egyedileg választható.

## Minta

A mintakészlet általános megnevezéseket ad ár, gyártó és cikkszám nélkül, „Minta” jelvénnyel. A mintatermék adata **nem kerül az ajánlat PDF-jébe**, és az ajánlat figyelmeztet, ha mintatermék van kiválasztva. Ha a mintaterméket szerkeszted (vagy CSV-ből árat kap), saját termékké válik, és onnantól a PDF-ben is megjelenik: a „(minta)” jelölés helyett add meg a valós termék nevét. A mintakészlet újratöltése nem duplikálja a meglévő mintatételeket.

## Vendég mód

A katalógus fiókhoz kötött, a szerveren tároljuk. Vendég módban a Termékkatalógus fül csak tájékoztatót mutat, és nem fordul a szerverhez; a tervben már szereplő termékválasztások megmaradnak, de új termék nem választható.

## Megosztás

A megosztott (csak olvasható) nézet az ajánlatot nem kapja meg, így a termékválasztás, a cikkszámok és az árak sem látszanak benne (`lib/share.ts` – `sharedPlan` változatlan; teszt: `tests/quote-products.ts`).

## Korlátok

- legfeljebb 2000 termék (az archiváltakkal együtt) és 1,5 MB katalógus; egy CSV legfeljebb 2 MB és 5000 sor. A nagykereskedő teljes árlistája ebbe nem fér bele: csak a ténylegesen használt termékeket importáld.
- legfeljebb 300 fiók-alapértelmezés; projektenként legfeljebb 300 típusválasztás.
- egyetlen verziószám tartozik a teljes katalógushoz: ha két ablakban párhuzamosan szerkeszted, a második mentés „Lista frissítése” üzenetet kap.
- a katalógus módosítása nem vonható vissza.
- **Telepítés után frissítsd a már nyitott tervezőoldalakat:** a régi lap mentéskor csendben eldobná a termékválasztást (az árak megmaradnak, a választás újra alkalmazható).
- A katalógus minden fióknak ingyenes; az exportkapuk (CSV, PDF) változatlanok, a katalógus saját CSV-je nincs kapuhoz kötve.

## Telepítés

- **Cloudflare Sites / D1:** új, adatot nem törlő migráció: `drizzle/0011_colossal_madame_masque.sql` (egyetlen `CREATE TABLE product_catalogs`). A Sites-közzététel alkalmazza. Helyi, már létező D1-adatbázison csak ezt kell lefuttatni:

      node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0011_colossal_madame_masque.sql

  Friss helyi adatbázison a `drizzle/` összes `.sql` fájlját sorrendben (0000–0011) kell alkalmazni.
- **Saját MySQL:** adatbázismentés után futtasd újra a telepítőt: `node --env-file=.env.production --experimental-strip-types scripts/mysql-setup.mjs`. Létrehozza a `product_catalogs` táblát (`CREATE TABLE IF NOT EXISTS`, idegen kulcs a `users` táblára, `ON DELETE CASCADE`), és ellenőrzi az oszlopait. Meglévő adatot nem töröl. A MySQL-ágat helyi MySQL 8.0-n a route-teszt MySQL-változatával ellenőriztük; élő szerveren nem volt tesztelve.

## Későbbi bővítés

- szerelvényenkénti felülírás (`device.variant`, például fürdőszobai IP44 dugalj egy szinten belül);
- összeállítás (betét + keret + doboz, kit);
- rendelési lista nagykereskedőnek;
- kiszerelés-átváltás (100 m-es dob → Ft/m);
- soros `catalog_items` tábla szerveroldali kereséssel 2000 tétel fölött;
- „Tétel a katalógusból” külön gomb, új termék felvétele a választóból;
- beszerzési ár és árrés külön mezőben;
- termék a terv-PDF szerelvényjegyzékében;
- árváltozás-jelzés;
- admin által karbantartott globális minta.

## Kód és tesztek

- Adatbázis: `db/schema.ts` (`product_catalogs`), `drizzle/0011_colossal_madame_masque.sql`, `drizzle/meta/0011_snapshot.json`, `db/mysql-schema.sql`, `scripts/mysql-setup.mjs`.
- Logika (tiszta modulok): `lib/product-refs.ts` (típuskulcs), `lib/catalog.ts` (séma, keresés, módosítók, PDF-sor), `lib/catalog-csv.ts` (dekódolás, CSV-feldolgozás, összefésülés, export), `lib/catalog-sample.ts` (mintakészlet), `lib/quote-products.ts` (ajánlat ↔ termék); kliens: `lib/catalog-client.ts`. Módosult: `lib/quote-schema.ts` (opcionális `product`, `productPinned`, `productDefaults`, `productDisplay`), `lib/plan-tools.ts` (`MaterialRow.ref`, CSV-termékoszlopok), `lib/quote-pdf.ts`.
- API: `app/api/catalog/route.ts` – `GET` és `PUT /api/catalog`, `private, no-store` válaszok, revision-CAS; stabil `code` mezők: `INVALID`, `TOO_LARGE`, `ACCOUNT_CHANGED`, `CATALOG_CONFLICT`.
- Felület: `components/use-catalog.ts`, `components/catalog-manager.tsx`, `components/product-picker.tsx`, `components/quote-products.tsx`; beszúrások: `components/quote-editor.tsx`, `components/plan-tools.tsx`; stílus: `app/globals.css`; adatvédelmi sor: `components/legal-page.tsx`.
- Tesztek a repó gyökeréből:

      node_modules/.bin/tsx tests/catalog.ts
      node_modules/.bin/tsx tests/quote-products.ts
      node_modules/.bin/esbuild tests/catalog-api.ts --bundle --platform=node --format=esm --external:mysql2 --alias:cloudflare:workers=./db/node-env.ts --outfile=.sites-runtime/catalog-api.mjs && env -u MYSQL_URL node --no-warnings .sites-runtime/catalog-api.mjs
