# Egyvonalas és többvonalas kapcsolási rajzok

A bejelentkezés után elérhető tervezőben az **Egyvonalas** és **Többvonalas** fülek az aktuálisan kiválasztott épület elosztókészülékeit és áramköreit mutatják.

- Az egyvonalas nézet egy vonalba csoportosítja a két készülék, illetve a készülék és áramkör közötti vezetőket. A „Kapcsolatok és vezetéknevek” lista megmutatja a vezetők számát, jelét és végpontjait; egy sorra kattintva kiemelhető a kapcsolat.
- A sínek (PE-sín, N-sín, ÁVK-nként N-sín) a bal oszlopban a készülékek után külön csomópontként szerepelnek; az automatikus N/PE-bekötések **szaggatott** vonallal, „aut.” jelöléssel rajzolódnak.
- A többvonalas nézet minden rögzített vezetéket külön kapocsra rajzol. A fázisok, N és PE eltérő színnel jelennek meg, a PE sárga szaggatott jelölést is kap.
- A bekötetlen kapcsok üres körrel jelennek meg, a hiányzó áramköri szálak külön listázhatók.
- Keresztezés nem jelent villamos kapcsolatot. A kapcsolatot a megadott kapocs-végpontok határozzák meg.

A rajzok a meglévő **Elosztó → Bekötések** adataiból készülnek. A „Bekötések szerkesztése” gomb oda vezet; egy készülékre kattintva annak tulajdonságai nyílnak meg. A készülék áramkör-hozzárendelése az L-vezetőt nem köti be, és a rajz nem tételez fel betáplálást. Kivétel az **automatikus N/PE-bekötés** (Elosztó → Bekötések, elosztónként kapcsolható, alapból bekapcsolt): az áramkörök N és PE szálát, valamint a főkapcsoló, az ÁVK-k és a túlfeszültség-védelem N/PE kapcsát a rajz a tokozati PE- és N-sínekre köti az ÁVK-csoport szabálya szerint (kézi bekötés → ÁVK-csoport szövege → ha nem azonosítható, az N szál bekötetlen marad és figyelmeztetés jelenik meg). A kézi bekötés felülírja az automatikusat; kikapcsolva a rajz csak a kézi vezetékeket mutatja, a sínek ilyenkor is megjelennek. Részletek: Elosztók és bekötések.

Mindkét nézet SVG-ként és önálló A4/A3 PDF-ként is exportálható (az ingyenes és a megvásárolt projektben előfizetés nélkül, az előfizetéses projektekben aktív előfizetéssel). A teljes terv PDF-je épületenként mindkét kapcsolási rajzot tartalmazza, kapcsolati és bekötetlen-szál jegyzékkel. A hosszú rajzok egymás után következő, függőlegesen folytatódó lapokra kerülnek. Minden export újra ellenőrzi a projekt exportjogosultságát a szerveren.

A rajzok sematikusak, nem méretarányosak, és nem végeznek villamos méretezést. A tényleges készülékkapocs- és póluskiosztást a gyártói adatok alapján kell ellenőrizni. A nézetek nem igényelnek adatbázis-migrációt; a mentett (kézi) bekötésekből és az azokból származtatott automatikus N/PE-bekötésekből állnak elő. A PDF-ben a bekötési jegyzék az automatikus vezetékeket „(automatikus)” jelöléssel, az automatikus bekötés figyelmeztetéseiről (azonosíthatatlan ÁVK-csoport, kézzel összekötött vagy több forrásról táplált sín) pedig sínenként egy soros figyelmeztető táblát; a hiányzó bekötések és a be nem kötött szálak táblája a kimaradás okát is megadja.
