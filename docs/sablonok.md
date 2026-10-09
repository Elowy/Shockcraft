# Saját sablonkönyvtár

Az alaprajz eszköztárában a **Sablonok** gombbal menthető el a jelenlegi szint. Kijelölt szobánál a tulajdonságok között a **Szoba sablonként** gomb csak azt a szobát menti. A mentett sablonok ugyanazzal a fiókkal más projektekben és másik eszközön is elérhetők.

Adj nevet, válaszd ki, hogy a szerelvények és nyomvonalak is bekerüljenek-e, majd kattints a **Mentés sablonként** gombra. A könyvtár külön mentődik a projekttől. Legfeljebb 30 sablon, összesen 2 MB adat tárolható fiókonként; az archiváltak is beleszámítanak.

A falak, falvastagságok, ajtók, ablakok és méretvonalak megmaradnak. Szobasablonba a szoba határán álló szerelvény is bekerül; a fal, nyomvonal és a méretvonal két mérési pontja teljes egészében a szobán belül kell legyen. Az elosztójelek, szekrények, áramkör-hozzárendelések, telki elemek és háttérképek kimaradnak. A kihagyott szerelvényhez kötött nyomvonalvég szabad végpontként marad meg a magasságával együtt.

## Beillesztés

1. Nyisd meg a célprojektet, épületet és szintet.
2. A **Sablonok** ablakban keresd meg és válaszd ki a mentett sablont.
3. Szobánál add meg a bal felső sarok X/Y helyét méterben. Szintsablon új szintet hoz létre az aktuális épületben; annak magasságát add meg.
4. Válaszd ki, hogy a szerelvények és nyomvonalak is bekerüljenek-e, majd kattints a **Sablon beillesztése** gombra.

A másolat külön azonosítókat kap. Módosítása nem változtatja meg a sablont vagy más példányokat. A belső nyomvonal-végpontok az új szerelvényekhez kapcsolódnak. Az áramköröket beillesztés után kell hozzárendelni. A beillesztés egy lépésben visszavonható, és a projekt szokásos mentésével tárolódik. Az átfedő helyiségeket nem rendezi el automatikusan; a falba helyezett nyílászárók átfedését és a rajzterület határait ellenőrzi.

## Könyvtár kezelése

A kereső név szerint szűr. A kiválasztott sablon átnevezhető vagy archiválható. Az **Archivált sablonok** kapcsolóval előhívható és visszaállítható. Ezek a könyvtári műveletek nem szerepelnek a projekt visszavonási előzményeiben. Több megnyitott ablak egyidejű mentésekor az elavult módosítást a szerver elutasítja; ilyenkor frissítsd a listát és ismételd meg a módosítást.

A sablonkönyvtár belső szerkesztőfunkció, nem fájlexport vagy fájlimport. Nem hoz létre új projektet és nem módosítja a projektek fizetési jogosultságait. A fájlexport és fájlimport továbbra is havi előfizetéshez kötött.

## Saját tárhely frissítése

MySQL esetén a frissített `db/mysql-schema.sql` fájl `template_libraries` tábláját is hozd létre (a fájl ismételt futtatása előtt készíts adatbázismentést és kövesd a telepítési útmutatót). Sites alatt a mellékelt adatbázis-migráció végzi a bővítést. A MySQL-ág ebben a fejlesztési lépésben élő MySQL-szerveren nem volt tesztelve.
