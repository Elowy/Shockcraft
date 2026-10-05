# Projektarchiválás és lomtár

A tervező felső sávjában a **Projektek** gomb nyitja meg az Aktív, Archivált és Lomtár listát. A listák darabszámot is mutatnak.

- **Archiválás:** leveszi a tervet az aktív listáról, megőrzi a tartalmát.
- **Lomtárba:** megőrzi a tervet a Lomtár listában. Nincs végleges törlés vagy időzített ürítés.
- **Visszaállítás:** az archivált vagy lomtárban lévő terv az Aktív listára kerül. Innen megnyitható, ha a fióknak van hozzáférése.

A művelet előtt megerősítés jelenik meg. A jelenleg nyitott terv mentetlen módosításait előbb el kell menteni. Ha a nyitott projektet archiválod vagy lomtárba helyezed, a szerkesztő üres, még el nem mentett tervre vált. Ez nem foglal le új projekthelyet.

## Projekthelyek és hozzáférés

Az archiválás és lomtárba helyezés nem ad vissza szabad projekthelyet. Az első ingyenes és az egyszer megvásárolt projekt joga ugyanahhoz a projekthez kötve megmarad. A visszaállításért nem kell újra fizetni. A lejárt előfizetéssel zárolt terv visszahelyezhető az Aktív listára, de továbbra is előfizetés szükséges a megnyitásához.

## Mentés és helyreállítás

Az állapotváltás növeli a projekt verziószámát. Másik ablak régebbi mentése hibával leáll, az archivált és lomtárban lévő tervek mentése és olvasása a szerveren tiltott. Előbb a Projektek menüben kell visszaállítani őket. Ez a helyi munkapéldány helyreállítására is vonatkozik.

## Telepítés

A D1-adatbázishoz új, adatokat nem törlő migráció tartozik: a `plans` tábla `state` (alapérték: `active`) és `state_changed_at` oszlopot kap. A Sites közzététel alkalmazza a migrációt.

Meglévő saját MySQL-telepítésnél adatbázis-mentés után, az új alkalmazás indítása előtt futtasd újra a telepítési útmutató `scripts/mysql-setup.mjs` parancsát. Az új oszlopok felvételéhez ALTER jog szükséges. A terv JSON-tartalma, a tulajdonosa és a vásárlási jogosultságok megmaradnak.
