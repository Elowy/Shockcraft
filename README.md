# Villanyrajz

Magyar nyelvű villamos alaprajz- és lakáselosztó-tervező webalkalmazás (korábbi nevén ShockCraft; domain: villanyrajz.hu).

## Használat

- A Telek nézetben több épület és azok telekbeli helyzete adható meg.
- Az épületeknek külön szintjeik vannak, közös rajzi origóval és megadható magassággal.
- A Szoba és Fal eszköz két kattintással rajzol. A szobák méretei a tulajdonságpanelen módosíthatók.
- A Szerelvény eszköz kapcsolókat, dugaljakat, RJ45- és telefonaljzatokat, lámpakiállásokat, kötődobozokat és elosztójelölést helyez el. Fal közelében automatikusan illeszt.
- A Nyomvonal eszköz töréspontokat vesz fel. Enter vagy Befejezés lezárja; Esc megszakítja. A belső és külső vezetés eltérő jelölést kap.
- A lakáselosztó épületenként 4 × 18 modult tartalmaz. A készülékek mérete, sora, pozíciója és áramköre szerkeszthető. Az átfedő modulhelyet elutasítja.
- **Projektek:** új üres terv, jelenlegi terv másolata és mentett projektek megnyitása. A **Mentés** vagy Ctrl+S az aktuális projektet menti, a fejlécben a neve is átírható. Projektváltáskor a mentetlen módosításokról külön párbeszédablak kérdez. Vendégként a böngészőbe, bejelentkezve a saját fiók adatbázisába ment. Az egyszerre megnyitott ablakok felülírását verzióellenőrzés védi.
- JSON export/import teljes tervhez; SVG export az aktuális alaprajzhoz. Ctrl+Z visszavon, Ctrl+Shift+Z újraalkalmaz, Ctrl+S ment.

A bal oldali struktúrában a szobák, szintek és épületek/lakrészek mellett törlésgomb található. A szoba törlése csak a körvonalat és nevet távolítja el; a szint törlése annak teljes rajzát, az épület törlése annak szintjeit és villamos elosztását is eltávolítja. A telki hálózat önálló jelölései megmaradnak. Minden ilyen törlés egy lépésben visszavonható; az utolsó szint vagy épület is törölhető.

## Nyomtatás, hálózat és magasságok

- A fejléc **PDF / nyomtatás** gombja A4 vagy A3 fekvő PDF-et készít az aktuális szintről, telekről, épületelosztóról, illetve az összes épület minden szintjéről és elosztójáról egy fájlban. A rajzokat szerelvény-, nyomvonal- és áramkörjegyzék egészíti ki. A dokumentum vektoros, beágyazott magyar betűkészlettel. A feltüntetett méretarányhoz 100%-os nyomtatást használj.
- **Telek → Pont elhelyezése:** bekötési pont, villanyóra, főelosztó, lakáselosztó és alelosztó. **Összekötés:** két pont közvetlen összekötése vagy töréspontos nyomvonal rajzolása. A töréspontok húzhatók, a tulajdonságpanelen számmal is módosíthatók.
- A telken elhelyezett fő-, lakás- és alelosztó a kiválasztott **Alaprajzi szint** rajzán is létrejön, kezdetben 150 cm beépítési magassággal. A **Megnyitás az alaprajzon** gomb megmutatja és kijelöli; a jelölés a kívánt falra húzható. Korábbi, még nem kapcsolt elosztónál az **Elosztó elhelyezése az alaprajzon** gomb használható. A név és a kapcsolt magasság összehangolt, az alaprajzi jelölés a PDF-ben is szerepel.
- **Kijelölés** módban a vonal húzása áthelyezi a nyomvonalat, a négyzet alakú fogantyúk egy szakaszt, a körök egy töréspontot mozgatnak. Ez a telek- és alaprajznézetben is működik. A bekötött végpontok rögzítve maradnak; közvetlen kötés húzásakor új töréspontok keletkeznek. A hossz azonnal frissül, egy húzás egy lépésben visszavonható.
- A telki nyomvonal magassága közös telek-0 szinthez viszonyul; negatív értékkel mélység adható meg. Az alaprajzi elosztóhoz kapcsolt telki pont magassága a szintmagasság és a szerelési magasság összege. A telki helyzete külön szerkeszthető.
- Az alaprajzi nyomvonal két végpontja szerelvényhez kapcsolható. A rajzolás a közeli szerelvényeket automatikusan hozzákapcsolja, a tulajdonságpanelen ez módosítható. A vezetési sík és a szabad végpontok magassága centiméterben adható meg. A kapcsolt végpont helye és magassága követi a szerelvényt.
- Hossz = vízszintes töréspontos hossz + |kezdőpont magassága − vezetési magasság| + |végpont magassága − vezetési magasság|. Az érték geometriai hossz, ráhagyás nélkül; a szakaszokon belüli további magasságváltásokat külön nyomvonalakkal kell megadni. A régi tervek pontosan szerelvényre eső végpontjai automatikusan kapcsolódnak; alapértelmezett vezetési magasságuk 260 cm, szerkeszthető.
- Kijelölés módban a szobák, falak, szerelvények, nyomvonalak és telki elemek húzás közben követik a mutatót. Egy húzás egy visszavonható művelet.
- A szobanevek és területek a rajz legfelső rétegén jelennek meg, a szerelvények és nyomvonalak felett; az SVG- és PDF-exportban is.
- A fejléc nap/hold gombja sötét és világos mód között vált. A választás az adott böngészőben megmarad. A PDF mindig fehér hátterű.

## Fiók és adatbázis

A fejléc Belépés/Fiókom gombja a Villanyrajz saját e-mailes regisztrációját, bejelentkezését és kijelentkezését nyitja meg. ChatGPT-fiók nem szükséges. Vendégként a tervek a böngészőben is menthetők; másik eszközön történő megnyitáshoz fiókba mentés vagy JSON-export/import szükséges. A szerver bcrypt jelszólenyomatot és lejáró, visszavonható munkameneteket tárol; a jelszó nem kerül a böngésző tárhelyére.

A `plans` táblában a korábbi mentés `account:<users.id>`, az új projektek `account:<users.id>:project:<UUID>` kulcsot használnak. Az összes projekt tulajdonosa a szerveroldali munkamenetből származik; a korábbi mentés változatlanul megmarad a projektlistában. A GET és PUT végpont is ellenőrzi a szerveroldali munkamenetet. A kliens nem választhat másik tulajdonost. A verzióellenőrzés megakadályozza az elavult ablakból történő felülírást, a fiókváltás ellenőrzése pedig a másik fiókba történő véletlen mentést. Az API-válaszok nem gyorsítótárazhatók.

A régi, korábban közösen elérhető `main` terv megmarad, csak olvasható. Saját mentett terv hiányában a **Korábbi terv megnyitása** gombbal másolat vehető át, majd a saját fiókba menthető. Személyes tervekhez ez nem ad hozzáférést. Belépés előtt a folyamatban lévő szerkesztés ideiglenesen, az adott böngészőfülön megőrződik. A tartós adatforrás a D1 adatbázis.

MySQL-szerver hiányában a meglévő D1 adatbázis működik tovább. A MySQL-adapter, táblaséma és telepítő elő van készítve; `MYSQL_URL` szerveroldali titokkal választható ki. A részletes beállítást és adatátvitelt a [MySQL útmutató](docs/mysql.md) írja le. A korábbi ChatGPT-fiókok `user:` terveit a frissítés nem törli, de az új regisztrációhoz nem rendeli automatikusan. A megnyitott terv JSON-exporttal/importtal vihető át.

## Saját Node.js-tárhely és VPS

A [telepítési útmutató](docs/telepites.md) és a [letölthető PDF](public/docs/Villanyrajz-telepitesi-utmutato.pdf) végigvezet a MySQL, környezeti változók, HTTPS, Nginx, systemd, frissítés és mentés beállításán. A `deploy/` könyvtár konfigurációmintákat tartalmaz. Node.js-es fordítás: `npm run build:node`; indítás `.env.production` mellett: `npm run start:node`. A Node-változat MySQL-t igényel. Az alapértelmezett `build` továbbra is a Sites kiadást készíti. A két célt külön kiadási könyvtárban fordítsd, mert mindkettő a `dist/` könyvtárat használja.

Az **Eszközök → Tervsegéd** anyagkimutatást ad épületenként vagy teljes projektre, állítható 0–50% kábelráhagyással és magyar Excel-kompatibilis CSV-exporttal. A méteradatok tartalmazzák a függőleges szakaszokat; egy rajzolt nyomvonal egy kábelt jelent. A kapcsolt telki elosztójelölést nem számolja kétszer. A kereső ékezet nélkül is keres szobák, szerelvények, nyomvonalak és elosztókészülékek között; a találat a megfelelő szintet és elemet nyitja meg.

## Helyi fejlesztés

Node.js 22.13 vagy újabb. npm run install:ci, npm run dev, npm run build. Az előnézeti szerver alapértelmezett címe http://localhost:5173.

Az adatbázissémát a db/schema.ts, a migrációkat a drizzle könyvtár tartalmazza. Helyi migrációhoz build után:

    node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_perfect_absorbing_man.sql
    node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_omniscient_iceman.sql

A `drizzle/` könyvtár összes `.sql` fájlját sorrendben (0000–0011) kell alkalmazni, a fenti parancs `--file` paraméterét cserélve; meglévő helyi adatbázison csak a még nem alkalmazott, újabb fájlokat (például az ügyfél- és teendőkezeléshez tartozó `drizzle/0009_wonderful_lucky_pierre.sql`-t, a tervmegosztáshoz tartozó `drizzle/0010_late_king_cobra.sql`-t és a termékkatalógushoz tartozó, legutóbbi `drizzle/0011_colossal_madame_masque.sql`-t). A migrációt helyi adatbázison egyszer kell alkalmazni. Éles telepítésnél a Sites végzi el. A .openai/hosting.json a meglévő Sites-alkalmazást azonosítja.

A saját hitelesítés integrációs ellenőrzése a helyi Worker és migrációk elindítása után: `node tests/auth-flow.mjs` (alapértelmezett cím: `http://127.0.0.1:5180`). Tesztfelhasználókat hoz létre kizárólag a helyi adatbázisban. MySQL-beállításellenőrzés: `node --experimental-strip-types tests/mysql-config.mjs`. Tényleges MySQL-kapcsolatot szerver hiányában még nem ellenőriztünk.

## Ellenőrzés és jelenlegi határok

Az új változat ellenőrzése: magasságot figyelembe vevő geometria, kapcsolt végpontok és törlés, régi tervek beolvasása; külön és egységes PDF-ek renderelése; élő húzás és visszavonás; helyi belépés, ideiglenes szerkesztésmegőrzés, mentés, kijelentkezés és visszatöltés. A végleges Worker helyi D1 adatbázisán ellenőrizve: anonim elutasítás, fiókok elkülönítése, fiókváltás, hibás hivatkozások, elavult verzió és idegen origin elutasítása. Mobilon nincs vízszintes túlcsordulás.

TypeScript-ellenőrzés és gyártási build sikeres. Böngészőben ellenőrizve: szobarajzolás, falra illesztett dugalj, töréspontos nyomvonal, elosztómodul hozzáadás, visszavonás, mentés, mobilmenü. Célzottan ellenőrizve: geometria, modulátfedés, tartós visszaolvasás, elavult és hibás mentési kérések elutasítása. A read_electrical_plan WebMCP eszköz érvényes és hibás bemenettel ellenőrizve.

Első tervezőszerkesztő-változat: téglalap alakú szobák, külön rajzolható falszakaszok, felhasználónként több mentett projekt, épületenként egy 72 modulos elosztó. Az SVG jelölések alkalmazássaját jelölések. A Méretezés fül tervezői ellenőrzést segítő segédszámítást ad (terhelhetőség, túlterhelés-védelem, feszültségesés, opcionálisan hurokimpedancia); szelektivitás-, zárlati szilárdság- és szabványmegfelelőség-vizsgálat nincs; a mintaterv értékei szerkeszthető példaadatok.


## Projektdíjak és Stripe

Az első projekt fiókonként ingyenes, minden további projekt egyszeri díja **3 490 Ft**. Az adminpanelen külön teszt- és éles Stripe-kulcsok állíthatók be. A telepítés, a webhook és az adminjog részletei: [Stripe beállítási útmutató](docs/stripe.md).

## Fióklevelek

A belépőablakban elérhető az elfelejtett jelszó visszaállítása, a Fiókom ablakban pedig az e-mail-cím megerősítése. A Resend az adminpanelen állítható be. Részletek: [Fióklevelek beállítása](docs/email.md).

A **2 490 Ft/hó előfizetés** korlátlan projektet ad. Lejáratkor az első és az egyszeri díjjal megvásárolt projektek maradnak elérhetők; a többi terv megőrződik és zárolódik. Részletek és a kötelező webhook-események: [Stripe útmutató](docs/stripe.md).
