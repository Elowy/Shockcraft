# ShockCraft

Magyar nyelvű villamos alaprajz- és lakáselosztó-tervező webalkalmazás.

## Használat

- A Telek nézetben több épület és azok telekbeli helyzete adható meg.
- Az épületeknek külön szintjeik vannak, közös rajzi origóval és megadható magassággal.
- A Szoba és Fal eszköz két kattintással rajzol. A szobák méretei a tulajdonságpanelen módosíthatók.
- A Szerelvény eszköz kapcsolókat, dugaljakat, RJ45- és telefonaljzatokat, lámpakiállásokat, kötődobozokat és elosztójelölést helyez el. Fal közelében automatikusan illeszt.
- A Nyomvonal eszköz töréspontokat vesz fel. Enter vagy Befejezés lezárja; Esc megszakítja. A belső és külső vezetés eltérő jelölést kap.
- A lakáselosztó épületenként 4 × 18 modult tartalmaz. A készülékek mérete, sora, pozíciója és áramköre szerkeszthető. Az átfedő modulhelyet elutasítja.
- Mentés: szerveroldali Cloudflare D1. Az egyszerre megnyitott ablakok felülírását verzióellenőrzés védi.
- JSON export/import teljes tervhez; SVG export az aktuális alaprajzhoz. Ctrl+Z visszavon, Ctrl+Shift+Z újraalkalmaz, Ctrl+S ment.

## Fejlesztés

Node.js 22.13 vagy újabb. npm run install:ci, npm run dev, npm run build. Az előnézeti szerver alapértelmezett címe http://localhost:5173.

Az adatbázissémát a db/schema.ts, a migrációkat a drizzle könyvtár tartalmazza. Helyi migrációhoz build után:

    node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_perfect_absorbing_man.sql

A migrációt helyi adatbázison egyszer kell alkalmazni. Éles telepítésnél a Sites végzi el. A .openai/hosting.json a meglévő privát Sites-alkalmazást azonosítja.

## Ellenőrzés és jelenlegi határok

TypeScript-ellenőrzés és gyártási build sikeres. Böngészőben ellenőrizve: szobarajzolás, falra illesztett dugalj, töréspontos nyomvonal, elosztómodul hozzáadás, visszavonás, mentés, mobilmenü. Célzottan ellenőrizve: geometria, modulátfedés, tartós visszaolvasás, elavult és hibás mentési kérések elutasítása. A read_electrical_plan WebMCP eszköz érvényes és hibás bemenettel ellenőrizve.

Első tervezőszerkesztő-változat: téglalap alakú szobák, külön rajzolható falszakaszok, egy mentett projekt, épületenként egy 72 modulos elosztó. Az SVG jelölések alkalmazássaját jelölések. Nincs automatikus villamos méretezés, szelektivitás-, feszültségesés- vagy szabványmegfelelőség-vizsgálat; a mintaterv értékei szerkeszthető példaadatok.

