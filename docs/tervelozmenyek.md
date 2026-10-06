# Tervelőzmények

A tervező mentési sávjában a **Tervelőzmények** gomb mutatja az aktuális és legfeljebb 30 korábbi szervermentést, változatszámmal, tervnévvel és mentési idővel. A funkció a saját fiókba már elmentett projektekhez érhető el; nem exportál fájlt.

A kézi és automatikus mentés előtt az addigi szerverváltozat bekerül az előzményekbe. A régi változat eltárolása és a terv frissítése egyetlen adatbázis-tranzakció: ha bármelyik lépés hibás, egyik sem marad félkészen. A 30-as korlát feletti legrégebbi változatok kiesnek. Öt másodperces automatikus mentés mellett az előzmények gyorsan frissülhetnek; ez nem hosszú távú biztonsági mentés.

## Visszaállítás

1. Mentsd el a nyitott terv módosításait.
2. Nyisd meg a Tervelőzmények listát.
3. Válassz egy korábbi változatot, majd erősítsd meg a visszaállítást.

A korábbi tartalom ugyanazon projekt új aktuális mentése lesz. Az előtte aktuális terv az előzményekbe kerül, így arra is vissza lehet térni, amíg benne van a megőrzött 30 változatban. A művelet nem igényel új projekthelyet. A terv képernyőn belüli Visszavonás listája a visszaállítás után újraindul.

Ha közben másik ablak módosította, archiválta vagy lomtárba helyezte a projektet, a visszaállítás megáll. Az archivált/lomtárban lévő projektet előbb vissza kell tenni az Aktív listába. A lejárt előfizetéshez tartozó zárolt projektek előzményei sem érhetők el; az ingyenes és külön megvásárolt projektek jogosultsága megmarad.

## Korlátok és telepítés

- Az előzmények ettől a frissítéstől kezdve gyűlnek. Régi, már felülírt tartalmakat nem lehet utólag visszanyerni. Meglévő projekt jelenlegi tartalmát az első új mentés előtt megőrzi a rendszer.
- Az archiválás és lomtárba helyezés önmagában nem készít új tervtartalmat. Emiatt a változatszámok között lehetnek kihagyások.
- A háttéralaprajzok hivatkozásai megmaradnak; megjelenítésükhöz az eredeti háttérfájlnak is elérhetőnek kell maradnia.
- A böngészőben tárolt, még el nem mentett munka külön a **Helyreállítás** menüben található.
- Új `plan_versions` tábla tárolja az előzményeket. Sites/D1 esetén a közzététel alkalmazza a migrációt. Saját MySQL-en adatbázis-mentés után, az alkalmazás frissítése előtt futtasd újra a `scripts/mysql-setup.mjs` telepítőt; új tábla létrehozásához CREATE jog kell. Az adatbázis biztonsági mentésébe a `plan_versions` táblát is vedd bele.
