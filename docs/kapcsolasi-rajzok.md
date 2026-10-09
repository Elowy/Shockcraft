# Egyvonalas és többvonalas kapcsolási rajzok

A bejelentkezés után elérhető tervezőben az **Egyvonalas** és **Többvonalas** fülek az aktuálisan kiválasztott épület elosztókészülékeit és áramköreit mutatják.

- Az egyvonalas nézet egy vonalba csoportosítja a két készülék, illetve a készülék és áramkör közötti vezetőket. A „Kapcsolatok és vezetéknevek” lista megmutatja a vezetők számát, jelét és végpontjait; egy sorra kattintva kiemelhető a kapcsolat.
- A többvonalas nézet minden rögzített vezetéket külön kapocsra rajzol. A fázisok, N és PE eltérő színnel jelennek meg, a PE sárga szaggatott jelölést is kap.
- A bekötetlen kapcsok üres körrel jelennek meg, a hiányzó áramköri szálak külön listázhatók.
- Keresztezés nem jelent villamos kapcsolatot. A kapcsolatot a megadott kapocs-végpontok határozzák meg.

A rajzok a meglévő **Elosztó → Bekötések** adataiból készülnek. A „Bekötések szerkesztése” gomb oda vezet; egy készülékre kattintva annak tulajdonságai nyílnak meg. A készülék áramkör-hozzárendelése és az ÁVK-csoport neve önmagában nem hoz létre vezetéket. A rajz nem egészíti ki a tervet feltételezett betáplálással vagy nulla-/védővezetőkkel.

Mindkét nézet SVG-ként és önálló A4/A3 PDF-ként is exportálható (az ingyenes és a megvásárolt projektben előfizetés nélkül, az előfizetéses projektekben aktív előfizetéssel). A teljes terv PDF-je épületenként mindkét kapcsolási rajzot tartalmazza, kapcsolati és bekötetlen-szál jegyzékkel. A hosszú rajzok egymás után következő, függőlegesen folytatódó lapokra kerülnek. Minden export újra ellenőrzi a projekt exportjogosultságát a szerveren.

A rajzok sematikusak, nem méretarányosak, és nem végeznek villamos méretezést. A tényleges készülékkapocs- és póluskiosztást a gyártói adatok alapján kell ellenőrizni. A nézetek nem igényelnek adatbázis-migrációt; a mentett bekötésekből állnak elő.
