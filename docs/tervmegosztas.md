# Tervmegosztás – csak olvasható link

## Mit tud

- A tervező felső sávjában a **Megosztás** gomb nyitja meg a „Terv megosztása” ablakot (fiókkal és mentett projekttel; vendég módban a gomb tiltott).
- A tulajdonos **csak olvasható, lejáró, visszavonható linket** készít:
  - **címke** („Kinek szól?”), amelyet csak ő lát (legfeljebb 80 karakter, vezérlő-, láthatatlan és bidi-karakter nélkül);
  - **érvényesség:** 1, 7, 30 vagy 90 nap, alapértelmezés 30; lejárat nélküli link nincs;
  - **„A megtekintő PDF-et is letölthet”** kapcsoló, alapból kikapcsolva.
- A link **egyszer jelenik meg**, másolható. A dialógus bezárásakor eltűnik; utólag nem kérhető le újra (a szerver csak a lenyomatát tárolja).
- Az ablak listázza a projekt érvényes linkjeit: címke, létrehozás, lejárat, PDF-engedély, utolsó megnyitás. Egyenként vagy egyszerre visszavonhatók.
- Projektenként legfeljebb **10 érvényes link** lehet (szigorú korlát, párhuzamos kéréseknél is). Link meghosszabbítása vagy szerkesztése nincs: helyette új linket kell készíteni, a régit visszavonni.
- A funkció díjmentes. A megtekintéshez a projektnek elérhetőnek kell lennie (lásd Billing).

### A megtekintő oldal (`/megosztas#t=…`)

Bejelentkezés nélkül, a projekt **legutóbb mentett** változatát mutatja:

- **Alaprajz:** épület- és szintválasztó, nagyítás (100–400 %), méretvonalak, helyiségnevek, jelmagyarázat; a jegyzékből kiválasztott elem kiemelve.
- **Telek:** a telek, az épületek és a telki nyomvonalak (csak megtekintés).
- **Elosztó:** egyvonalas és többvonalas kapcsolási rajz elosztónként.
- **Jegyzékek:** áramkörök, nyomvonalak, fázisterhelés; a „megnyitás” gomb az alaprajzon, a telken vagy az elosztónál mutatja az elemet.
- **PDF és kapcsolási rajz SVG** csak akkor, ha a link engedi **és** a tulajdonos exportjoga a letöltés pillanatában is fennáll.
- Állandó tájékoztató sáv: a tartalomért a megosztó felel, az oldal soha nem kér jelszót vagy fizetési adatot; „Visszaélés bejelentése” e-mail-link.
- Sötét és világos mód; mobilon (375 px) vízszintes oldalgörgetés nélkül, csak a rajzvászon görget.

## Mi nem látszik a megtekintőnek

A szerver fehérlistás választ ad (`plan`, `updatedAt`, `expiresAt`, `pdf`, `backgroundFloors`). Nem kerül ki:

- az árajánlat (`quote`, benne az ügyfél adataival);
- a háttéralaprajz (assetId, fájlnév) – a szint csak jelzést kap, hogy van háttere;
- a megosztó neve, e-mail-címe, felhasználói azonosítója;
- a projektazonosító és -kulcs, a link azonosítója és címkéje, a revision.

## Életciklus

| Esemény | A link |
|---|---|
| archiválás | **szünetel**; visszaállítás után a lejáratig újra működik |
| zárolás (lejárt előfizetés `sub_*` projekten, vagy grant nélküli projekten lejárt előfizetéssel) | **szünetel**; megújítás után újra működik |
| lomtárba helyezés | **véglegesen megszűnik** (a sorok törlődnek; a visszaállítás sem éleszti újra) |
| lejárat | megszűnik (a sor a következő megosztási műveletnél törlődik) |
| visszavonás | azonnal megszűnik |
| jelszó-visszaállítás (`auth_version` növekedése) | minden link megszűnik |
| fióktörlés | megszűnik (`ON DELETE CASCADE`) |

A megosztó felé a szüneteltetett link „Szünetel” címkével látszik. A megtekintő minden hibaesetben ugyanazt az üzenetet kapja (nem derül ki, hogy a link lejárt, visszavonták vagy szünetel).

## Billing

- **Létrehozás és megtekintés:** `projectAccess(tulajdonos)` – mentett, aktív, a tulajdonos számára elérhető projekt kell. Zárolt projektnél új link nem készíthető (402 `SUBSCRIPTION_REQUIRED`), a meglévők szünetelnek.
- **Letöltés (PDF, SVG):** `allow_pdf = 1` **és** `exportAccess(tulajdonos, projekt)`. Az ingyenes és az egyszer megvásárolt projekt előfizetés nélkül is engedélyezheti; az előfizetéses és a grant nélküli projekt aktív előfizetéssel. Az engedélyt létrehozáskor (402 `EXPORT_REQUIRED`) és **minden letöltéskor** újra ellenőrizzük (`purpose:'pdf'`); egy kézzel átírt `allow_pdf` exportjog nélkül 403.
- A megtekintőnek nincs JSON-, import- vagy másolási funkciója.

## Biztonság

- **Token:** 32 bájt `crypto.getRandomValues`, 64 kisbetűs hex karakter. A DB-ben csak a SHA-256 lenyomata (`token_hash`, egyedi index) van; a nyers token egyetlen helyen jelenik meg: a létrehozó POST válaszában.
- **Fragment:** a token a `#t=` után utazik, így nem kerül szervernaplóba vagy Referer-be. Az API-hoz csak POST JSON-törzsben megy; a query, a path és a süti nem számít. A megtekintő beolvasás után eltávolítja a címsorból (`history.replaceState`), és csak a lap `sessionStorage`-ában tartja (`shockcraft-share-token`) a frissítéshez; localStorage-ba nem ír. 404 esetén a kulcsot törli.
- **Egységes 404:** hibás formátum, ismeretlen, lejárt, visszavont, jelszócsere utáni, archivált, lomtáras, zárolt link és ismeretlen törzskulcs – betűre azonos válasz (`SHARE_UNAVAILABLE`).
- **Rate limit** saját névtérben az `auth_limits` táblában, 15 perces ablakkal: `share-ip` 120, `share-link` 300, `share-create` 30. A 121. kérés 429 + `Retry-After: 900`. A bejelentkezés `ip:`/`email:` kerete érintetlen.
- **IP-kulcs:** IPv6-címnél a /64-es előtag számít (a címek forgatása egy előfizetői tartományon belül nem ad új keretet), IPv4-be leképezett IPv6-nál az IPv4-cím. Hiányzó IP-fejlécnél a kérés közös `unknown` keretre számít (és a szerver egyszer figyelmeztetést naplóz) – a nyilvános útvonal sosem marad keret nélkül. A lejárt keretsorokat a nyilvános megnyitások ~1 %-a is takarítja.
- **Atomikus létrehozás:** a link beszúrása egyetlen feltételes `INSERT … SELECT` utasítás, amely a projekt aktív állapotát, a 10-es korlátot és az `auth_version`-t is ellenőrzi. Így a létrehozással párhuzamos lomtárba helyezés után sem marad élő link, és párhuzamos kérések sem lépik túl a korlátot. MySQL-en az utasítás holtpont esetén legfeljebb négyszer fut.
- **Fejlécek:**
  - nyilvános API (`/api/shared-plan`): `Cache-Control: private, no-store, max-age=0`, `X-Robots-Tag: noindex, nofollow, noarchive`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`;
  - tulajdonosi API (`/api/plan-share`): `private, no-store`, `Vary: Cookie`;
  - oldal (`/megosztas`): `force-dynamic` (→ `Cache-Control: no-store, must-revalidate`), metadata robots noindex + referrer no-referrer, és a `next.config.ts` `headers()`: `X-Robots-Tag`, `Referrer-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Content-Security-Policy` (`frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`, `connect-src 'self'`, `img-src 'self' blob: data:`). `script-src` nincs, mert a vinext inline RSC-szkriptjei nonce nélkül eltörnének. A `/megosztas` nincs tiltva a robots.txt-ben, különben a robot nem látná a noindexet.
- **Munkamenet-izoláció:** a megtekintő `credentials:'omit'` és `referrerPolicy:'no-referrer'` mellett hív; a nyilvános route munkamenet-sütit nem olvas.
- **CSRF:** a tulajdonosi POST/DELETE `sameOrigin` + userId-visszhang; a tulajdonosi GET elutasítja a cross-site kérést; a nyilvános POST `sameOrigin`.
- **IDOR:** a nyilvános útvonal minden azonosítót a megosztási sorból vesz, és ellenőrzi a `project_key` egyezését; a tulajdonosi SQL mindig `owner_id = ? AND project_key = ?` feltétellel fut, a kulcsot a munkamenetből számoljuk.
- **Méretkorlát:** tulajdonosi POST 2000, DELETE 1000, nyilvános 300 karakter → 413.
- A hibaágak csak a hiba nevét naplózzák; tokent, törzset vagy fejlécet soha.
- A megosztás nem írja a `plans` és `plan_versions` táblát (a lomtár csak a `plan_shares` sorait törli).

### Maradék kockázatok

- A link bearer-jellegű: aki megkapja, továbbküldheti a lejáratig vagy a visszavonásig.
- A böngészőbe került tervadat fejlesztői eszközzel kinyerhető; ez ugyanaz a kliensoldali kapu-modell, mint a tulajdonos saját exportjánál (a PDF a böngészőben készül).
- A visszavonás előtt megnyitott lap tartalma a megtekintőnél látható marad (a következő frissítésig).
- A szüneteltetett ág futásideje eltérhet; ez csak a tokent birtokló számára árulkodó.
- Irodai NAT mögött a 120 kérés / 15 perc IP-keret szűk lehet (a konstans hangolható). Node-on Nginx nélkül az `X-Real-IP` hamisítható – ez meglévő korlát; az ajánlott Nginx-minta felülírja a fejlécet.
- IPv6-on a /64-es kulcs egy nagyobb (pl. /48-as) tartomány birtokosát nem korlátozza; ő /64-enként külön keretet kap. Ez a tokenkitalálást (256 bit) nem teszi reálissá, csak az `auth_limits` írási terhelését növeli.
- Ha a proxy nem adja át az IP-fejlécet (`X-Real-IP` Node-on, `CF-Connecting-IP` Cloudflare-en), minden megtekintő közös keretre kerül: a megtekintés gyorsan 429-re futhat. Ilyenkor a naplóban „missing client IP header” figyelmeztetés jelenik meg; a proxybeállítást kell javítani.

## Telepítés

- **Cloudflare Sites / D1:** új, adatot nem törlő migráció: `drizzle/0010_late_king_cobra.sql` (egy `CREATE TABLE plan_shares` és három index). A Sites-közzététel alkalmazza. Helyi, már létező D1-adatbázison csak ezt kell egyszer lefuttatni (a `CREATE TABLE` nem idempotens):

      node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0010_late_king_cobra.sql

- **Saját MySQL:** adatbázismentés után futtasd újra a telepítőt: `node --env-file=.env.production --experimental-strip-types scripts/mysql-setup.mjs`. Létrehozza a `plan_shares` táblát (`CREATE TABLE IF NOT EXISTS`, idegen kulcs a `users` táblára `ON DELETE CASCADE`-del), és ellenőrzi az oszlopait. CREATE és REFERENCES jog szükséges; meglévő adatot nem töröl.
- **Gyorsítótár:** a `/api/*` és a `/megosztas` útvonalra **ne** legyen Cloudflare „Cache Everything” vagy edge-TTL szabály; Nginx-ben a `proxy_cache` maradjon `off` (a `deploy/nginx.conf` mintában így van).
- **Fejlécellenőrzés** telepítés után:

      curl -sI https://<domain>/megosztas
      curl -s -X POST -H 'Origin: https://<domain>' -H 'Content-Type: application/json' -d '{"token":"0000000000000000000000000000000000000000000000000000000000000000"}' -D - https://<domain>/api/shared-plan

  Az elsőnél `Cache-Control: no-store…`, `X-Frame-Options: DENY`, `Content-Security-Policy: frame-ancestors 'none'…`, `Referrer-Policy: no-referrer`, `X-Robots-Tag: noindex…` várható; a másodiknál 404 `SHARE_UNAVAILABLE` `no-store`, `noindex` és `no-referrer` fejlécekkel.
- Az `APP_ORIGIN` legyen beállítva: a link ebből készül (hiánya esetén a létrehozás 503-at ad, árva sor nélkül, a naplóban „APP_ORIGIN is missing or invalid”). Helyi fejlesztéshez: `CLOUDFLARE_INCLUDE_PROCESS_ENV=true APP_ORIGIN=http://localhost:5173 npm run dev`.

## Kód és teszt

- Adatbázis: `db/schema.ts` (`planShares`), `drizzle/0010_late_king_cobra.sql`, `drizzle/meta/0010_snapshot.json`, `db/mysql-schema.sql`, `scripts/mysql-setup.mjs`.
- Logika: `lib/share.ts` (tiszta modul: token, sémák, adatminimalizálás, link, befoglaló doboz), `lib/share-server.ts` (rate limit, állapot, lista, létrehozás, visszavonás, megnyitás), `lib/share-client.ts` (kliens fetch, fail closed).
- API: `app/api/plan-share/route.ts` (`GET`, `POST`, `DELETE /api/plan-share`; kódok: `INVALID`, `TOO_LARGE`, `ACCOUNT_CHANGED`, `RATE_LIMITED`, `SAVE_REQUIRED`, `PROJECT_INACTIVE`, `SUBSCRIPTION_REQUIRED`, `EXPORT_REQUIRED`, `SHARE_LIMIT`, `NOT_FOUND`), `app/api/shared-plan/route.ts` (`POST /api/shared-plan`; kódok: `SHARE_UNAVAILABLE`, `RATE_LIMITED`, `PDF_UNAVAILABLE`, `FORBIDDEN`, `TOO_LARGE`, `UNAVAILABLE`), `lib/plan-api.ts` (PATCH: lomtár → linkek törlése).
- Felület: `app/megosztas/page.tsx`, `components/share-viewer.tsx`, `components/share-dialog.tsx`; közös rajz: `components/floor-drawing.tsx` (a szerkesztő is ezt használja), `components/plot-editor.tsx` (`readOnly`), `components/schematic-view.tsx` (opcionális `onEdit`/`requireAccess`), `components/pdf-dialog.tsx` (`note`); fejlécek: `next.config.ts`; stílus: `app/globals.css`.
- Tesztek a repó gyökeréből:

      node_modules/.bin/tsx tests/share.ts
      node_modules/.bin/esbuild tests/share-api.ts --bundle --platform=node --format=esm --external:mysql2 --alias:cloudflare:workers=./db/node-env.ts --outfile=.sites-runtime/share-api.mjs && env -u MYSQL_URL node --no-warnings .sites-runtime/share-api.mjs

  A route-teszt `node:sqlite` memóriabeli adatbázison az összes migrációt lefuttatja; alternatívaként `node --import tsx` is használható egy olyan resolve hookkal, amely a `cloudflare:workers` importot a `db/node-env.ts` fájlra irányítja.

## Későbbi bővítés

- **2. lépés – megjegyzések** a megtekintőtől: külön `plan_comments` tábla (a megosztáshoz kötve, FK CASCADE), `permission view|comment` oszlop a `plan_shares`-ben, saját rate limit, tulajdonosi válasz/lezárás, tűréteg a megtekintőn. A terv JSON-ba nem kerülhet (az autosave 409-et kapna, és kipörgetné az előzménytárat).
- **2. lépés – háttéralaprajz** a megosztott nézetben: token-kapus asset-végpont, amely csak a megosztott terv látható hátterét adja ki.
- Link meghosszabbítása vagy szerkesztése; rögzített pillanatkép-megosztás; e-mailes meghívó; értesítés megnyitáskor; PIN-védelem; a megosztó nevének vagy arculatának megjelenítése.
- **3. lépés – közös szerkesztés más fiókból:** `plan_members` megerősített e-mailes meghívóval, kizárólagos szerkesztési zár, billing és háttérkulcs a tulajdonos nevében.
