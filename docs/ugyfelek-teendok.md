# Ügyfelek és teendők

## Mit tud

- **Ügyféltörzs (fiókszintű):** név (kötelező), cégnév, adószám (`12345678-1-12`), irányítószám, település, cím, telefon, e-mail és belső megjegyzés. A belső megjegyzés nem kerül az árajánlatba. Az ügyfél archiválható (puha törlés, visszaállítható) és véglegesen törölhető.
- **Projekt–ügyfél hozzárendelés:** projektenként legfeljebb egy ügyfél. Csak mentett, aktív, nem zárolt projekthez rendelhető.
- **Teendők:** megnevezés (kötelező), megjegyzés, határidő (dátum vagy üres) és állapot (Teendő / Folyamatban / Kész). Egy teendő három helyre tartozhat:
  - projekthez (az ügyfele a projekt ügyfele);
  - projekt nélkül egy ügyfélhez (pl. felmérés még projekthely nélkül);
  - általános teendőként.
- **Esedékes nézet:** csoportok: Lejárt, Ma, Következő 7 nap, Később, Határidő nélkül, és kapcsolóval Kész.
- **Jelvény:** a felső sáv **Ügyfelek** gombján a lejárt és mai, nem kész teendők száma. Az archivált, lomtáras és zárolt projektek teendői nem számítanak bele.

## Hol érhető el

- A tervező felső sávjában az **Ügyfelek** gomb nyitja meg az „Ügyfelek és teendők” ablakot. Fülei:
  - **Ez a projekt:** a nyitott projekt ügyfele (`tel:` és `mailto:` linkkel) és teendői;
  - **Esedékes:** az összes teendő határidő szerint, projektmegnyitás gombbal;
  - **Ügyfelek:** keresés, új ügyfél, szerkesztés, archiválás, törlés, az ügyfél projektjei és teendői.
- Az árajánlatba az **Eszközök → Árazás / árajánlat → Ügyféladatok átvétele** gomb viszi át a projekthez rendelt ügyfél adatait. Ez pillanatkép: kitölti az „Ügyfél adatai” mezőt, a „Munkavégzés helye” mezőt pedig csak akkor, ha üres. Eltérő, már kitöltött ügyfélszöveg felülírása előtt megerősítést kér. A művelet a tervező **Visszavonás** gombjával visszavonható, és a tervvel együtt mentődik. A tételek és az árak nem változnak.
- A teendő határidejéhez gyorsgombok tartoznak: Ma, Holnap, 1 hét múlva, Nincs határidő.

## Szabályok

A funkció fiókhoz kötött, minden fiók számára ingyenes. Vendég módban nem érhető el: az ablak csak tájékoztatót mutat, és nem fordul a szerverhez.

| Projektállapot | Új vagy módosított teendő, hozzárendelés | Törlés, levétel | Megjelenés |
|---|---|---|---|
| aktív | engedett | engedett | normál |
| archivált, lomtár | elutasítva (409, `PROJECT_INACTIVE`) | engedett | az Esedékes fülön alapból rejtett, kapcsolóval szürkén |
| zárolt (lejárt előfizetés) | elutasítva (402, `SUBSCRIPTION_REQUIRED`) | engedett | szürkén, „Előfizetés” gombbal |
| nem mentett vagy nem saját | elutasítva (409, `SAVE_REQUIRED`) | engedett | „Nem található projekt” |
| általános vagy ügyfélhez kötött teendő | mindig engedett | engedett | normál |

- Az archivált vagy lomtáras projekt teendői csak olvashatók: az állapot és a szöveg nem módosítható, amíg a projektet vissza nem állítod a Projektek menüben. A zárolt projekt teendői az előfizetés megújításáig csak olvashatók.
- A törlés (teendő, hozzárendelés, ügyfél) minden projektállapotnál engedett, így a régi adatok bármikor eltávolíthatók.
- Az ügyféladatok szerkesztése, archiválása és törlése mindig engedett, mert fiókszintű adat.
- Ügyfél törlésekor megszűnnek a hozzárendelései, a közvetlenül hozzá kötött teendők pedig általános teendővé válnak. A korábban árajánlatba átvett adatok a tervekben megmaradnak.
- A szerver minden mentéskor újraellenőrzi a szabályokat, kizárólag a bejelentkezett fiók saját projektjei alapján. Más felhasználó projektazonosítója „nem található”, róla semmi nem derül ki.
- A funkció soha nem írja a `plans` táblát, ezért nem befolyásolja az automatikus mentést és a tervelőzményeket.

## Export, import, másolat

A terv JSON-sémája nem változott. Az ügyfelek, a hozzárendelések és a teendők fiókszintű adatok, ezért nem kerülnek a terv JSON-exportjába. Az import és a „Jelenlegi terv másolata” új projektazonosítót kap, ügyfél nélkül: az ügyfelet a Mentés után újra hozzá kell rendelni. Az árajánlatba már átvett ügyfélszöveg a terv része, így exportálódik és másolódik.

## Adatvédelem

Az ügyféltörzs harmadik személyek (a felhasználó ügyfeleinek) adatait tartalmazza. Ezekért a felhasználó felel adatkezelőként; a szolgáltatás üzemeltetője adatfeldolgozóként tárolja őket. Az adatvédelmi tájékoztató táblázata új sort kapott (jogi felülvizsgálatra előkészített szöveg). Az árajánlatba átvett pillanatkép a terv része: a tervvel, annak előzményeivel és exportjával együtt marad meg, az ügyfél törlése nem módosítja.

## Korlátok

- legfeljebb 500 ügyfél (az archiváltakkal együtt);
- legfeljebb 1000 teendő; a **Kész teendők törlése** gomb segít takarítani;
- a teljes ügyfél- és teendőlista legfeljebb 1 MB;
- egyetlen verziószám tartozik a teljes listához: ha két ablakban párhuzamosan szerkeszted, a második mentés „Lista frissítése” üzenetet kap, és frissítés után megismételhető;
- az írások sorosak: mentés közben az ablak vezérlői tiltottak.

## Telepítés

- **Cloudflare Sites / D1:** új, adatot nem törlő migráció tartozik hozzá: `drizzle/0009_wonderful_lucky_pierre.sql` (egyetlen `CREATE TABLE workbooks`). A Sites-közzététel alkalmazza. Helyi, már létező D1-adatbázison csak ezt kell lefuttatni:

      node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0009_wonderful_lucky_pierre.sql

  Friss helyi adatbázison a `drizzle/` összes `.sql` fájlját sorrendben (0000–0009) kell alkalmazni.
- **Saját MySQL:** adatbázismentés után futtasd újra a telepítőt: `node --env-file=.env.production --experimental-strip-types scripts/mysql-setup.mjs`. Létrehozza a `workbooks` táblát (`CREATE TABLE IF NOT EXISTS`, idegen kulcs a `users` táblára), és ellenőrzi az oszlopait. CREATE és REFERENCES jog szükséges. Meglévő adatot nem töröl. A MySQL-ág élő MySQL-szerveren nem volt tesztelve.

## Kód és teszt

- Adatbázis: `db/schema.ts` (`workbooks`), `drizzle/0009_wonderful_lucky_pierre.sql`, `drizzle/meta/0009_snapshot.json`, `db/mysql-schema.sql`, `scripts/mysql-setup.mjs`.
- Logika: `lib/workbook.ts` (sémák, szabályok, esedékesség, ajánlatszöveg; tiszta modul), `lib/workbook-server.ts` (projektállapotok), `lib/workbook-client.ts` (kliens fetch).
- API: `app/api/workbook/route.ts` – `GET` és `PUT /api/workbook`, `private, no-store` válaszok, stabil `code` mezők: `INVALID`, `TOO_LARGE`, `ACCOUNT_CHANGED`, `WORKBOOK_CONFLICT`, `PROJECT_INACTIVE`, `SUBSCRIPTION_REQUIRED`, `SAVE_REQUIRED`.
- Felület: `components/workbook-dialog.tsx`, `components/workbook-tasks.tsx`, `components/workbook-clients.tsx`; árajánlat: `components/quote-editor.tsx`, `components/plan-tools.tsx`; stílus: `app/globals.css`.
- Tesztek a repó gyökeréből:

      node_modules/.bin/tsx tests/workbook.ts
      node_modules/.bin/esbuild tests/workbook-api.ts --bundle --platform=node --format=esm --external:mysql2 --alias:cloudflare:workers=./db/node-env.ts --outfile=.sites-runtime/workbook-api.mjs && env -u MYSQL_URL node --no-warnings .sites-runtime/workbook-api.mjs

  A route-teszt `node:sqlite` memóriabeli adatbázison az összes migrációt lefuttatja; alternatívaként `node --import tsx` is használható egy olyan resolve hookkal, amely a `cloudflare:workers` importot a `db/node-env.ts` fájlra irányítja.

## Későbbi bővítés

- e-mail- vagy push-emlékeztető;
- ismétlődő teendő, prioritás, csatolmány;
- naptár- vagy CSV-export;
- felelős vagy megosztott teendő;
- teendő szerelvényhez kötése;
- ügyfélnév a Projektek listában;
- ügyfél-hozzárendelés átvitele projektmásolatra vagy importra;
- ajánlatadó (supplier) előtöltése;
- eltérésjelzés a kitöltött ajánlat és a törzs között;
- `/teendok` mobiloldal;
- soronkénti `clients` / `tasks` táblák (a mostani JSON-munkafüzetből egyszeri szkripttel migrálható);
- előfizetéshez kötött kapuzás (jelenleg minden fióknak ingyenes).
