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

- Méretezési segédszámítás (tervezői ellenőrzést segítő): Iz/In/Ib, I2, legkisebb keresztmetszet, feszültségesés, opcionális hurokimpedancia, Tervsegéd-fül, PDF-táblák, tervellenőrzés. A táblázatértékek tervezői jóváhagyása függőben. Lásd `docs/meretezes.md`.
- Gyártói termékkatalógus: saját, fiókszintű termék- és árlista (kézzel, CSV-ből vagy mintakészletből), típusonkénti és soronkénti termékválasztás az ajánlatban, fiók-alapértelmezések, árfrissítés a katalógusból, termék az anyagkimutatásban, a CSV-ben és az ajánlat-PDF-ben. Lásd `docs/termekkatalogus.md`.
- Tervmegosztás: csak olvasható, lejáró, visszavonható link, PDF a megosztó engedélyével és exportjogával. Lásd `docs/tervmegosztas.md`.
- Ügyfél- és feladatkezelés: ügyféltörzs, projekt–ügyfél hozzárendelés, határidős teendők és Esedékes nézet, árajánlat-kitöltés ügyféladatokból. Lásd `docs/ugyfelek-teendok.md`.
- Fázisterhelés-összesítés: áramkörönkénti terhelés (megadott vagy szerelvényekből becsült), elosztónkénti L1/L2/L3 összesítés, aszimmetria- és túlterhelés-figyelmeztetés, PDF-táblázat. Lásd `docs/fazisterheles.md`.
- Árazás és ügyfélnek készíthető árajánlat: tervből átvett tételek, anyagár, munkadíj, saját tételek, útiköltség (km × Ft/km vagy fix), összesítés, PDF.

## További ütemezett fejlesztések

- Megosztás 2. lépés: megjegyzések, háttéralaprajz a megosztott nézetben, link meghosszabbítása.
- Közös szerkesztés más fiókból (szerkesztési zárral).
- Termékkatalógus 2. ütem: szerelvényenkénti termék, összeállítás (kit), rendelési lista, kiszerelés-átváltás, soros katalógustábla 2000 tétel fölött.
- Méretezés 2. lépés: nyomvonalankénti szerelési mód, topológiai hossz, XLPE- és E-táblázat jóváhagyás után, áramkörjegyzék-oszlop, megosztott nézet.

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

### 2. ötlet: online vizsgaszimuláció (feleletválasztós teszt)

Gyakorló tesztfelület kb. 1000 kérdéses kérdésbankkal, véletlenszerűen összeállított feleletválasztós tesztekkel.

- **Kérdésbank:** saját vagy jogtisztán licencelt kérdések; hivatalos vizsgasorok szövegét nem vesszük át. Minden kérdést szakember lektorál, mielőtt élesbe kerül (AI-val generált kérdés is csak lektorálás után). Kérdésenként: témakör (kapcsolások, érintésvédelem, földelési rendszerek, mérés, számítások, anyagismeret, szabványok), nehézség, kérdés, 3–4 válasz (egy vagy több helyes), magyarázat, hivatkozás a megfelelő Tudástár-szakaszra, opcionális ábra (SVG kapcsolási rajz), lektor és dátum, verzió.
- **Számolós kérdések:** paraméterezett sablonok véletlen értékekkel (pl. Ohm-törvény, teljesítmény, feszültségesés), a helyes választ a Tudástár kalkulátorai számolják, a rossz válaszok tipikus hibákból (pl. √3 kihagyása, mm² és m összekeverése) képződnek.
- **Módok:** gyakorló (azonnali visszajelzés és magyarázat kérdésenként) és vizsga (időkorlát, a végén értékelés). Választható hossz (pl. 10/20/50 kérdés) és témakör; véletlen sorrend a kérdéseken és a válaszokon; egy teszten belül nincs ismétlődő kérdés, és a korábban rosszul megválaszoltak gyakrabban jönnek.
- **Eredmények:** pontszám, megfelelt/nem felelt meg küszöbbel, témakörönkénti erősség-gyengeség, előzmények. Fiókkal a szerveren (új tábla, a többi fiókszintű adat mintájára), vendégként csak a böngészőben.
- **Minőség:** „Hibás kérdés jelzése” gomb; a kérdésbank a repóban verziózott adatfájl (vagy admin felület), tesztekkel ellenőrzött séma (egyedi azonosító, pontosan jelölt helyes válasz, létező Tudástár-hivatkozás).
- **Megjelölés:** a felület nem állítja, hogy hivatalos vizsgakérdéseket tartalmaz; „gyakorló teszt” jelöléssel fut.
- Nyitott kérdések: ingyenes vagy előfizetéses (pl. mintateszt ingyen, teljes bank előfizetéssel); melyik vizsgára készít (villanyszerelő szakmai vizsga, érintésvédelmi szabványossági felülvizsgáló stb.); ki lektorálja a kérdésbankot.

### 3. ötlet: villanyszerelő-kézikönyv jellegű, mobilbarát felépítés

Minta: egy Android villanyszerelő-kézikönyv alkalmazás szerkezete (csak a felépítés és a témakörök listája szolgál mintául; szöveget, ikont, ábrát nem veszünk át). Öt fő rész alsó navigációval: **Elmélet**, **Sémák**, **Kalkulátorok**, **Konstruktor**, **Tesztek**; könyvjelzők és menü a fejlécben.

- **Elmélet témakörei:** alapfogalmak (feszültség, áram, ellenállás, teljesítmény, Ohm, Kirchhoff, soros/párhuzamos kapcsolás, rövidzárlat, biztonsági intézkedések, szakkifejezések), elektromechanikus átalakítók (transzformátor, generátor, villanymotor, háromfázisú motor kondenzátoros bekötése), védelmi és automatizálási eszközök (kismegszakító, FI-relé, áramvédős kismegszakító, feszültségfigyelő relé, mágneskapcsoló, biztosítékok, túlfeszültség-védelem), kábelek és vezetékek (összekötési módszerek, keresztmetszet-választás, színkódolás, kapcsolószekrény), erőművek és alállomások, mérőműszerek (volt-/amper-/ohmmérő, multiméter és lakatfogó, fogyasztásmérő), földelés (földelési rendszerek, potenciálkiegyenlítés), világítás (fényforrások, foglalatok, lumen és lux, színhőmérséklet, LED-szalag), munkavégzés (csatlakozó, dugalj és kapcsoló szerelése), további információk (ellátási kategóriák, túlfeszültség, IP-védettség, szerszámok, dugaljtípusok országonként, Joule–Lenz, Coulomb, jobbkéz-szabály).
- **Követelmény:** mindenki számára ingyenes, bejelentkezés és előfizetés nélkül használható; a bekötéseket grafikák szemléltetik.
- A három ötlet egységes terve és ütemezése: lásd a „Tudástár – egységes terv” szakaszt (kidolgozás alatt).

### 4. kiegészítés: Kalkulátorok önálló, gyors elérésű menüpontként

A **Kalkulátorok** a Tudástáron kívül is első szintű menüpont: a nyilvános fejlécben és a főoldalon, a tervező felső sávjában és a Tudástár alsó navigációjában is, saját rövid URL-lel (pl. `/kalkulatorok`, `/kalkulatorok/ohm-torveny`), bejelentkezés nélkül.

- **Minden villamossági számítás egy helyen:** Ohm-törvény; teljesítmény egy- és háromfázisban cos φ-vel; áram teljesítményből; látszólagos és meddő teljesítmény, cos φ; vezeték-ellenállás; soros és párhuzamos ellenállás és kondenzátor; feszültségosztó; feszültségesés; keresztmetszet- és kismegszakító-választás; zárlati áram és hurokimpedancia; fogyasztás és költség; LED-szalag tápegység; ellenállás-színkód; motor névleges árama; kondenzátor háromfázisú motor egyfázisú üzeméhez; transzformátor-áttétel; akkumulátor üzemideje; lumen és lux; csillag–delta átalakítás; mértékegység-átváltók (kW–LE, mm²–AWG stb.); fázisterhelés.
- **Gyors elérés:** kereső, kedvencek és legutóbb használt kalkulátorok (a böngészőben tárolva), mélylinkelhető és megosztható bemenetek (URL-paraméterek).
- **Egy közös kalkulátormotor:** tiszta, tesztelt függvények; ezt használja a Tudástár, a vizsgaszimuláció és a tervező (fázisterhelés, méretezés) is. Minden eredmény mértékegységgel, levezetéssel és szükség esetén figyelmeztetéssel jelenik meg.
