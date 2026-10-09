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

- Tervmegosztás: csak olvasható, lejáró, visszavonható link, PDF a megosztó engedélyével és exportjogával. Lásd `docs/tervmegosztas.md`.
- Ügyfél- és feladatkezelés: ügyféltörzs, projekt–ügyfél hozzárendelés, határidős teendők és Esedékes nézet, árajánlat-kitöltés ügyféladatokból. Lásd `docs/ugyfelek-teendok.md`.
- Fázisterhelés-összesítés: áramkörönkénti terhelés (megadott vagy szerelvényekből becsült), elosztónkénti L1/L2/L3 összesítés, aszimmetria- és túlterhelés-figyelmeztetés, PDF-táblázat. Lásd `docs/fazisterheles.md`.
- Árazás és ügyfélnek készíthető árajánlat: tervből átvett tételek, anyagár, munkadíj, saját tételek, útiköltség (km × Ft/km vagy fix), összesítés, PDF.

## További ütemezett fejlesztések

- Megosztás 2. lépés: megjegyzések, háttéralaprajz a megosztott nézetben, link meghosszabbítása.
- Közös szerkesztés más fiókból (szerkesztési zárral).
- Gyártói termékkatalógus.
- Szakmailag ellenőrzött villamos méretezés.
