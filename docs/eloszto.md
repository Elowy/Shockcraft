# Elosztók és bekötések

Az **Elosztó** nézet az éppen kiválasztott épülethez tartozik.

## Szekrényméret

Az **Elosztó mérete** beállításban 1–12 sor és soronként 1–36 modulhely adható meg. A régi tervek továbbra is 4 × 18-as elosztóval nyílnak meg. Az értékek épületenként külön mentődnek, és az új készülékek elhelyezése, a sor-/helymezők és a PDF is ezeket használja. Négy sornál nagyobb elosztó PDF-je több rajzlapra oszlik.

A **Méret alkalmazása** megőrzi a készülékek helyét és bekötéseit. Ha egy készülék kilógna, a módosítás nem hajtódik végre: a hibaüzenet megnevezi az érintett készülékeket. Előbb helyezd át őket a tulajdonságaiknál. A sikeres méretmódosítás visszavonható, és a projekt Mentés gombja rögzíti.

## Szerelvények hozzárendelése áramkörhöz

Az **Áramkörök** fülön válaszd ki az áramkör kártyáját, majd kattints a szerelvényre az alaprajzon vagy a szint szerelvénylistájában. A zöld keret a kiválasztott áramkörhöz tartozó elemeket jelöli. Egy már hozzárendelt elem újabb kattintással leválasztható; más áramkör eleme a kiválasztott áramkörbe helyeződik át. Minden kattintás külön visszavonható.

A szintválasztóval az épület más szintjein is dolgozhatsz. Az **Összes**, **Kiválasztott áramkör**, illetve **Nincs hozzárendelve** szűrés segít az áttekintésben. A kártyák szerelvényszáma az egész épületre vonatkozik; a hozzárendeletlen darabszám az aktuális szintre. Az áramkör neve és műszaki adatai az **Elosztó és áramkörbeállítások** gombbal érhetők el.

A hozzárendelés nem hoz létre új nyomvonalat, és nem változtatja meg az elosztó bekötéseit. Ezeket továbbra is a megfelelő szerkesztőben kell megadni. A szintváltás, szűrés és áramkörválasztás nem módosítja a terv adatait.

## Gyors bekötés a szekrényen

A készülékek feletti és alatti körök kattintható kapcsok. Felül a bemenetek, alul a kimenetek találhatók; a sínek számozott pontokkal jelennek meg. Kattints egy kiinduló kapocsra, majd egy kiemelt célkapocsra. Az új kapcsolat azonnal bekerül a bekötési jegyzékbe és a kapcsolási rajzokba. A készülék közepére kattintva továbbra is a tulajdonságai szerkeszthetők.

Az áramköri szálak a szekrény alatt vannak. Új, még áramkörhöz nem rendelt kismegszakító vagy RCBO esetén először az áramköri szálat válaszd ki; így a szerkesztő a megfelelő egy- vagy háromfázisú kapcsokat mutatja. A hozzárendelés a bekötés létrehozásakor mentődik.

A **Mégse**, az Esc vagy a kiinduló kapocs ismételt kiválasztása megszakítja az összekötést. Az eltérő jelű, már bekötött áramköri vagy más áramkörhöz rendelt célpontok nem választhatók érvényes új kapcsolatként. Hibás kattintás nem változtatja meg a tervet, és a kiinduló kapocs kijelölése megmarad.

Egy vezetékre vagy a **Bekötések kiválasztása** listájára kattintva megjelennek a végpontjai és a **Bekötés bontása** gomb. A létrehozás és a bontás egy-egy visszavonható művelet. Az újrakötéshez előbb bontsd a régi kapcsolatot. A **Vezetékek** kapcsoló csak a megjelenítést változtatja. A nagyítás és a görgetés segít a sűrűn elhelyezett kapcsok kiválasztásában.

## Részletes szerkesztés

1. A **Készülék hozzáadása** gombbal helyezz el kismegszakítót, ÁVK-t, kombinált védelmet, túlfeszültség-védelmet, főkapcsolót, fővezetéki leágazót, PE-, nulla-, EPH- vagy fázissínt, illetve sorkapcsot. A név, sor, hely és helyfoglalás a készülékre kattintva módosítható. A sínek helyfoglalása sematikus; igazítsd a tényleges szekrényhez.
2. Az áramkörjegyzékben add meg az áramkört és a fázisát. A **Bekötések** gomb az áramköri szálakhoz ugrik. Egyfázisú áramkörhöz fázis-, N- és PE-szál, háromfázisúhoz L1, L2, L3, N és PE jelenik meg.
3. Nevezd el a szálat; Enterrel vagy a mező elhagyásával rögzítheted. A mellette lévő választóban add meg a célkészüléket és a kapcsot. Kismegszakítóhoz vagy kombinált védelemhez kötve az áramkör-hozzárendelés is létrejön. Más áramkörhöz rendelt védelmi készülékre nem írható rá a kapcsolat.
4. A **Készülékek közötti átkötés** résznél válaszd ki mindkét készüléket és kapcsot, majd add hozzá az elnevezett vezetéket. A sín számozott kapcsai csatlakozási helyeket jelölnek. A fázissín L-1, L-2 stb. felirata kapocsszám, nem külön fázis.
5. A **Bekötési jegyzék** a meglévő kapcsolatok végpontjait sorolja fel. A készülék nevére kattintva megnyithatók a tulajdonságai. A kuka bontja a kapcsolatot; a **Visszavonás** visszaállítja.

A fázis vagy a készülék áramkör-hozzárendelésének módosításakor a már nem érvényes bekötések megszűnnek. Készülék, áramkör vagy épület törlése a hozzá tartozó bekötéseket is törli. Ezek a műveletek visszavonhatók.

A **Mentés** a bekötéseket és a szálneveket is elmenti a projektbe. A JSON export/import megőrzi őket. A **PDF / nyomtatás → Elosztó**, illetve az összes lap exportja tartalmazza a készülékelrendezést, készülék- és áramkörjegyzéket, bekötési jegyzéket és a még be nem kötött szálakat.

A kapocsjelölések sematikusak, nem gyártóspecifikusak. A nézet kapcsolatokat dokumentál; nem végez villamos méretezést, hálózati szimulációt vagy teljes szabványellenőrzést. A bekötési vezetékekből nem számol geometriai kábelhosszt; a hosszakat továbbra is az alaprajzi és telki nyomvonalak adják.
