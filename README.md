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

## Nyomtatás, hálózat és magasságok

- A fejléc **PDF / nyomtatás** gombja A4 vagy A3 fekvő PDF-et készít az aktuális szintről, telekről, épületelosztóról, illetve az összes épület minden szintjéről és elosztójáról egy fájlban. A rajzokat szerelvény-, nyomvonal- és áramkörjegyzék egészíti ki. A dokumentum vektoros, beágyazott magyar betűkészlettel. A feltüntetett méretarányhoz 100%-os nyomtatást használj.
- **Telek → Pont elhelyezése:** bekötési pont, villanyóra, főelosztó, lakáselosztó és alelosztó. **Összekötés:** két pont közvetlen összekötése vagy töréspontos nyomvonal rajzolása. A töréspontok húzhatók, a tulajdonságpanelen számmal is módosíthatók.
- A telki nyomvonal magassága közös telek-0 szinthez viszonyul; negatív értékkel mélység adható meg. Az alaprajzi elosztóhoz kapcsolt telki pont magassága a szintmagasság és a szerelési magasság összege. A telki helyzete külön szerkeszthető.
- Az alaprajzi nyomvonal két végpontja szerelvényhez kapcsolható. A rajzolás a közeli szerelvényeket automatikusan hozzákapcsolja, a tulajdonságpanelen ez módosítható. A vezetési sík és a szabad végpontok magassága centiméterben adható meg. A kapcsolt végpont helye és magassága követi a szerelvényt.
- Hossz = vízszintes töréspontos hossz + |kezdőpont magassága − vezetési magasság| + |végpont magassága − vezetési magasság|. Az érték geometriai hossz, ráhagyás nélkül; a szakaszokon belüli további magasságváltásokat külön nyomvonalakkal kell megadni. A régi tervek pontosan szerelvényre eső végpontjai automatikusan kapcsolódnak; alapértelmezett vezetési magasságuk 260 cm, szerkeszthető.
- Kijelölés módban a szobák, falak, szerelvények, nyomvonalak és telki elemek húzás közben követik a mutatót. Egy húzás egy visszavonható művelet.
- A fejléc nap/hold gombja sötét és világos mód között vált. A választás az adott böngészőben megmarad. A PDF mindig fehér hátterű.

## Fiók és adatbázis

A fejléc Belépés/Fiókom gombja a Sites beépített ChatGPT-bejelentkezését és kijelentkezését használja. Vendégként a mintaterv szerkeszthető és exportálható; adatbázisba mentéshez bejelentkezés szükséges. Az azonosítást a platform végzi, az alkalmazás nem tárol jelszavakat.

A meglévő Cloudflare D1 `plans` táblában minden felhasználó külön `user:<hitelesített azonosító>` kulcson tartja a saját tervét. A GET és PUT végpont is ellenőrzi a szerveroldali azonosságot. A kliens nem választhat másik tulajdonost. A verzióellenőrzés megakadályozza az elavult ablakból történő felülírást, a fiókváltás ellenőrzése pedig a másik fiókba történő véletlen mentést. Az API-válaszok nem gyorsítótárazhatók.

A régi, korábban közösen elérhető `main` terv megmarad, csak olvasható. Saját mentett terv hiányában a **Korábbi terv megnyitása** gombbal másolat vehető át, majd a saját fiókba menthető. Személyes tervekhez ez nem ad hozzáférést. Belépés előtt a folyamatban lévő szerkesztés ideiglenesen, az adott böngészőfülön megőrződik. A tartós adatforrás a D1 adatbázis.

Helyi fejlesztésben a starter kizárólag loopback kéréseken szimulálja a bejelentkezést; éles buildben a Sites szolgáltatja a hitelesített fejléceket. Új adatbázis-migráció nem szükséges ehhez a változáshoz: a meglévő táblaséma támogatja a felhasználói kulcsokat.

## Fejlesztés

Node.js 22.13 vagy újabb. npm run install:ci, npm run dev, npm run build. Az előnézeti szerver alapértelmezett címe http://localhost:5173.

Az adatbázissémát a db/schema.ts, a migrációkat a drizzle könyvtár tartalmazza. Helyi migrációhoz build után:

    node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_perfect_absorbing_man.sql

A migrációt helyi adatbázison egyszer kell alkalmazni. Éles telepítésnél a Sites végzi el. A .openai/hosting.json a meglévő Sites-alkalmazást azonosítja.

## Ellenőrzés és jelenlegi határok

Az új változat ellenőrzése: magasságot figyelembe vevő geometria, kapcsolt végpontok és törlés, régi tervek beolvasása; külön és egységes PDF-ek renderelése; élő húzás és visszavonás; helyi belépés, ideiglenes szerkesztésmegőrzés, mentés, kijelentkezés és visszatöltés. A végleges Worker helyi D1 adatbázisán ellenőrizve: anonim elutasítás, fiókok elkülönítése, fiókváltás, hibás hivatkozások, elavult verzió és idegen origin elutasítása. Mobilon nincs vízszintes túlcsordulás.

TypeScript-ellenőrzés és gyártási build sikeres. Böngészőben ellenőrizve: szobarajzolás, falra illesztett dugalj, töréspontos nyomvonal, elosztómodul hozzáadás, visszavonás, mentés, mobilmenü. Célzottan ellenőrizve: geometria, modulátfedés, tartós visszaolvasás, elavult és hibás mentési kérések elutasítása. A read_electrical_plan WebMCP eszköz érvényes és hibás bemenettel ellenőrizve.

Első tervezőszerkesztő-változat: téglalap alakú szobák, külön rajzolható falszakaszok, felhasználónként egy mentett projekt, épületenként egy 72 modulos elosztó. Az SVG jelölések alkalmazássaját jelölések. Nincs automatikus villamos méretezés, szelektivitás-, feszültségesés- vagy szabványmegfelelőség-vizsgálat; a mintaterv értékei szerkeszthető példaadatok.

