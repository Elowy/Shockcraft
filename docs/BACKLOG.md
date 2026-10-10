# Villanyrajz fejlesztési backlog

## Export projektenként – kész

Állapot: megvalósítva (`exportAccess`, `GET /api/transfer-access?purpose=export`, `tests/export-access.ts`). A jogi szövegek végleges jogi felülvizsgálata az üzemeltető feladata. Kérés: az első ingyenes projekthely és minden egyszeri díjért megvásárolt projekthely exportja ne függjön a havi előfizetéstől.

Elfogadási feltételek:

- Az első ingyenes projekten az export előfizetés nélkül is használható.
- Az egyszer megvásárolt projekthelyen az export előfizetés nélkül, lejárt előfizetés után is használható.
- Az előfizetéses projektek exportja aktív előfizetéshez kötött marad; lejárt előfizetéssel zárolt projektek nem nyithatók meg.
- Minden kimeneti formátumra egységesen érvényes: terv-JSON, SVG, PDF, CSV és árajánlat-PDF.
- A jogosultságot a konkrét, saját tulajdonú projekt azonosítója és szerveroldali jogosultsága alapján kell ellenőrizni; kliensoldali állítás nem elég.
- Az importálás szabálya nem változik ettől a kéréstől: továbbra is aktív havi előfizetéshez kötött.
- Ellenőrizni kell az admin-, archivált, lomtáras, új még nem mentett, más felhasználóhoz tartozó és előfizetésről egyszeri vásárlásra váltott projektek eseteit is.
- Frissíteni kell a főoldal, csomagleírások, súgók és érintett jogi szövegek exportálásról szóló tájékoztatását.

## Kész

- Gyártói termékkatalógus: saját, fiókszintű termék- és árlista (kézzel, CSV-ből vagy mintakészletből), típusonkénti és soronkénti termékválasztás az ajánlatban, fiók-alapértelmezések, árfrissítés a katalógusból, termék az anyagkimutatásban, a CSV-ben és az ajánlat-PDF-ben. Lásd `docs/termekkatalogus.md`.
- Tervmegosztás: csak olvasható, lejáró, visszavonható link, PDF a megosztó engedélyével és exportjogával. Lásd `docs/tervmegosztas.md`.
- Ügyfél- és feladatkezelés: ügyféltörzs, projekt–ügyfél hozzárendelés, határidős teendők és Esedékes nézet, árajánlat-kitöltés ügyféladatokból. Lásd `docs/ugyfelek-teendok.md`.
- Fázisterhelés-összesítés: áramkörönkénti terhelés (megadott vagy szerelvényekből becsült), elosztónkénti L1/L2/L3 összesítés, aszimmetria- és túlterhelés-figyelmeztetés, PDF-táblázat. Lásd `docs/fazisterheles.md`.
- Árazás és ügyfélnek készíthető árajánlat: tervből átvett tételek, anyagár, munkadíj, saját tételek, útiköltség (km × Ft/km vagy fix), összesítés, PDF.

## További ütemezett fejlesztések

- Megosztás 2. lépés: megjegyzések, háttéralaprajz a megosztott nézetben, link meghosszabbítása.
- Közös szerkesztés más fiókból (szerkesztési zárral).
- Termékkatalógus 2. ütem: szerelvényenkénti termék, összeállítás (kit), rendelési lista, kiszerelés-átváltás, soros katalógustábla 2000 tétel fölött.
- Szakmailag ellenőrzött villamos méretezés.

## Tudástár (oktatóanyag) – új menüpont, ötletgyűjtés

Állapot: ötletgyűjtés, a terméktulajdonos további ötleteket ad hozzá. Munkanév: **Tudástár** (lehetséges szinonimák: Oktatóanyag, Tananyag, Szakmai kézikönyv, Villanyszerelő-kézikönyv). Külön menüpont a tervezőben és a nyilvános oldalon (a főoldalról is elérhető, keresőbarát, nyomtatható).

Közös követelmények:

- Saját szöveg és saját ábrák. Külső oldalak (pl. megaohm.hu) csak témaforrásként szolgálhatnak, szöveget és képet nem veszünk át (szerzői jog).
- A kapcsolási rajzok a tervező meglévő rajzjeleivel, SVG-ben készülnek, sötét módban is olvashatóan.
- Szakmai lektorálás kötelező (biztonságkritikus tartalom), és minden oldalon látható figyelmeztetés: villamos szerelést csak szakképzett személy végezhet, a mérőhelyi és csatlakozási munkákra az elosztói engedélyes szabályai vonatkoznak.
- Kapcsolat a tervezővel: a szerelvénytípusokból (pl. váltó- és keresztkapcsoló) és a Tervsegédből egy kattintással nyílik a megfelelő Tudástár-szakasz; a kalkulátorok a meglévő számításokat (fázisterhelés, később méretezés) használják újra.

### 1. ötlet: kapcsolások, bekötések, mérők és számítások egy oldalon

Egyetlen, tartalomjegyzékkel tagolt oldal, kalkulátorokkal:

- **Világítási kapcsolók bekötése és működése:** 101 egypólusú, 102 kétpólusú, 103 hárompólusú, 105 csillár (kétáramkörös), 106 váltó (alternatív), 106+6 kettős váltó, 107 keresztkapcsoló; rajzjel, bekötési rajz, működés, tipikus felhasználás (pl. lépcsőház, folyosó).
- **Földelési (hálózati) rendszerek:** IT, TT, TN-C, TN-S, TN-C-S – felépítés, PEN-vezető szétválasztása, tipikus hazai alkalmazás. (Pontosítandó a terméktulajdonossal: a kérésben „It, nc, nc-s” szerepelt.)
- **Fogyasztásmérők:** egy- és háromfázisú, közvetlen és áramváltós mérés, vezérelt (H- és GEO-tarifás) mérés, a bekötés elve – az elosztói engedélyes szabályaira hivatkozva.
- **Számítások kalkulátorral, levezetéssel:** Ohm-törvény (U = I · R), teljesítmény (egyfázis P = U · I · cos φ, háromfázis P = √3 · U · I · cos φ), vezeték-ellenállás (R = ρ · l / A), soros és párhuzamos ellenállás, feszültségesés, energiafogyasztás és költség (kWh × Ft/kWh), kismegszakító- és keresztmetszet-választás alapjai.
- Minden képlet mellett mértékegységek, kidolgozott példa és a kalkulátor; a kalkulátor bemenetei ellenőrzöttek, az eredmény kerekítése és mértékegysége egyértelmű.
