# ShockCraft fejlesztési backlog

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

- Árazás és ügyfélnek készíthető árajánlat: tervből átvett tételek, anyagár, munkadíj, saját tételek, útiköltség (km × Ft/km vagy fix), összesítés, PDF.

## További ütemezett fejlesztések

- Ügyfél- és feladatkezelés.
- Tervmegosztás és együttműködés.
- Gyártói termékkatalógus.
- Fázisterhelés és teljesítményösszesítés.
- Szakmailag ellenőrzött villamos méretezés.
