# Elosztók és bekötések

Az **Elosztó** nézet az éppen kiválasztott épülethez tartozik.

1. A **Készülék hozzáadása** gombbal helyezz el kismegszakítót, ÁVK-t, kombinált védelmet, túlfeszültség-védelmet, főkapcsolót, fővezetéki leágazót, PE-, nulla-, EPH- vagy fázissínt, illetve sorkapcsot. A név, sor, hely és helyfoglalás a készülékre kattintva módosítható. A sínek helyfoglalása sematikus; igazítsd a tényleges szekrényhez.
2. Az áramkörjegyzékben add meg az áramkört és a fázisát. A **Bekötések** gomb az áramköri szálakhoz ugrik. Egyfázisú áramkörhöz fázis-, N- és PE-szál, háromfázisúhoz L1, L2, L3, N és PE jelenik meg.
3. Nevezd el a szálat; Enterrel vagy a mező elhagyásával rögzítheted. A mellette lévő választóban add meg a célkészüléket és a kapcsot. Kismegszakítóhoz vagy kombinált védelemhez kötve az áramkör-hozzárendelés is létrejön. Más áramkörhöz rendelt védelmi készülékre nem írható rá a kapcsolat.
4. A **Készülékek közötti átkötés** résznél válaszd ki mindkét készüléket és kapcsot, majd add hozzá az elnevezett vezetéket. A sín számozott kapcsai csatlakozási helyeket jelölnek. A fázissín L-1, L-2 stb. felirata kapocsszám, nem külön fázis.
5. A **Bekötési jegyzék** a meglévő kapcsolatok végpontjait sorolja fel. A készülék nevére kattintva megnyithatók a tulajdonságai. A kuka bontja a kapcsolatot; a **Visszavonás** visszaállítja.

A fázis vagy a készülék áramkör-hozzárendelésének módosításakor a már nem érvényes bekötések megszűnnek. Készülék, áramkör vagy épület törlése a hozzá tartozó bekötéseket is törli. Ezek a műveletek visszavonhatók.

A **Mentés** a bekötéseket és a szálneveket is elmenti a projektbe. A JSON export/import megőrzi őket. A **PDF / nyomtatás → Elosztó**, illetve az összes lap exportja tartalmazza a készülékelrendezést, készülék- és áramkörjegyzéket, bekötési jegyzéket és a még be nem kötött szálakat.

A kapocsjelölések sematikusak, nem gyártóspecifikusak. A nézet kapcsolatokat dokumentál; nem végez villamos méretezést, hálózati szimulációt vagy teljes szabványellenőrzést. A bekötési vezetékekből nem számol geometriai kábelhosszt; a hosszakat továbbra is az alaprajzi és telki nyomvonalak adják.
