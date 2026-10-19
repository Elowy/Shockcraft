# Elosztók és bekötések

Az **Elosztó** nézet az éppen kiválasztott épülethez tartozik.

## Szekrényméret

Az **Elosztó mérete** beállításban 1–12 sor és soronként 1–36 modulhely adható meg. A régi tervek továbbra is 4 × 18-as elosztóval nyílnak meg. Az értékek épületenként külön mentődnek, és az új készülékek elhelyezése, a sor-/helymezők és a PDF is ezeket használja. Négy sornál nagyobb elosztó PDF-je több rajzlapra oszlik.

A **Méret alkalmazása** megőrzi a készülékek helyét és bekötéseit. Ha egy készülék kilógna, a módosítás nem hajtódik végre: a hibaüzenet megnevezi az érintett készülékeket. Előbb helyezd át őket a tulajdonságaiknál. A sikeres méretmódosítás visszavonható, és a projekt Mentés gombja rögzíti.

## Szerelvények hozzárendelése áramkörhöz

Az **Áramkörök** fülön válaszd ki az áramkör kártyáját, majd kattints a szerelvényre az alaprajzon vagy a szint szerelvénylistájában. A zöld keret a kiválasztott áramkörhöz tartozó elemeket jelöli. Egy már hozzárendelt elem újabb kattintással leválasztható; más áramkör eleme a kiválasztott áramkörbe helyeződik át. Minden kattintás külön visszavonható.

A szintválasztóval az épület más szintjein is dolgozhatsz. Az **Összes**, **Kiválasztott áramkör**, illetve **Nincs hozzárendelve** szűrés segít az áttekintésben. A kártyák szerelvényszáma az egész épületre vonatkozik; a hozzárendeletlen darabszám az aktuális szintre. Az áramkör neve és műszaki adatai az **Elosztó és áramkörbeállítások** gombbal érhetők el.

A hozzárendelés nem hoz létre új nyomvonalat, és nem változtatja meg az elosztó bekötéseit; az L-vezetőket (fázisokat) továbbra is a megfelelő szerkesztőben kell megadni. Az N és PE szálakat az automatikus bekötés köti a szekrény sínjeire (lásd lent). A szintváltás, szűrés és áramkörválasztás nem módosítja a terv adatait.

## Gyors bekötés a szekrényen

A készülékek feletti és alatti körök kattintható kapcsok. Felül a bemenetek, alul a kimenetek találhatók; a sínek számozott pontokkal jelennek meg. Kattints egy kiinduló kapocsra, majd egy kiemelt célkapocsra. Az új kapcsolat azonnal bekerül a bekötési jegyzékbe és a kapcsolási rajzokba. A készülék közepére kattintva továbbra is a tulajdonságai szerkeszthetők.

Az áramköri szálak a szekrény alatt vannak. Új, még áramkörhöz nem rendelt kismegszakító vagy RCBO esetén először az áramköri szálat válaszd ki; így a szerkesztő a megfelelő egy- vagy háromfázisú kapcsokat mutatja. A hozzárendelés a bekötés létrehozásakor mentődik.

A **Mégse**, az Esc vagy a kiinduló kapocs ismételt kiválasztása megszakítja az összekötést. Az eltérő jelű, már bekötött áramköri vagy más áramkörhöz rendelt célpontok nem választhatók érvényes új kapcsolatként. Hibás kattintás nem változtatja meg a tervet, és a kiinduló kapocs kijelölése megmarad.

Egy vezetékre vagy a **Bekötések kiválasztása** listájára kattintva megjelennek a végpontjai és a **Bekötés bontása** gomb. A létrehozás és a bontás egy-egy visszavonható művelet. Az újrakötéshez előbb bontsd a régi kapcsolatot. A **Vezetékek** kapcsoló csak a megjelenítést változtatja. A nagyítás és a görgetés segít a sűrűn elhelyezett kapcsok kiválasztásában.

## PE- és N-sínek, automatikus N/PE-bekötés

Minden **nem üres** elosztónak (legalább egy készüléke vagy áramköre van) automatikusan vannak tokozati sínjei. Ezek nem DIN-sínre szerelt modulok, ezért **nem foglalnak modulhelyet**, nem számítanak a „modul foglalt” számlálóba, és nem szerepelnek a készülékjegyzékben. Az üres elosztónak (például a Garázs üres főelosztója) nincs sínje. A sínek nem tárolt adatok: mindig az elosztó tartalmából állnak elő.

- **PE-sín:** ide kerül minden áramkör védővezetője.
- **N-sín (főnullasín):** a betáplálás nullavezetője; ide kerül az ÁVK nélküli áramkörök N-je.
- **ÁVK-nként külön N-sín** („N-sín · FI-01”, osztott nulla): az adott áram-védőkapcsoló terhelési oldali N-kapcsáról táplált sín; csak az általa védett áramkörök N-vezetője köthető rá.

A sínek a **Elosztó** nézetben a DIN-sorok alatt, a „Sínek” részben jelennek meg (a „Sínekhez” gomb ide ugrik), és az egy- és többvonalas rajzon a készülékek után, külön csomópontként. Minden sínnek T1…Tk számozott kapcsai vannak (k = legalább 6, vagy a rákötött vezetékek száma + 2). A sínkapocs több vezetéket is fogadhat; két sín egymással nem köthető, és N-et PE-vel sem lehet összekötni.

**Mit köt be automatikusan?** (L-vezetőt soha, két különböző N-sínt vagy N-et és PE-t soha.)

- minden áramkör PE szálát a PE-sínre;
- az áramkör N szálát az ÁVK-csoportjának N-sínjére (ÁVK nélkül a főnullasínre); kombinált védelem (RCBO) esetén az áramkör N-je az RCBO N-kimenetére kerül;
- a főkapcsoló N-kimenetét a főnullasínre; minden ÁVK N-bemenetét a főnullasínről, N-kimenetét a saját N-sínjére; az RCBO N-bemenetét az áramköre csoportjának sínjéről (ÁVK mögött az ÁVK N-sínjéről, különben a főnullasínről); a túlfeszültség-védelem N kapcsát a főnullasínre, PE kapcsát a PE-sínre. Minden automatikus vezeték a legkisebb szabad sínkapcsot kapja.

Egy sínt legfeljebb egy forrás táplál. Ezért ha az elosztóban **több főkapcsoló** van, csak az első (sor, hely, azonosító szerint) N-kimenete kerül automatikusan a főnullasínre; a többi nem, és erről figyelmeztetés jelenik meg. **Kaszkádolt ÁVK** esetén (az alsó ÁVK L-bemenete kézzel a felső ÁVK L-kimenetéről, akár fázissínen, kismegszakítón vagy áthidaláson át van táplálva) az alsó ÁVK N-bemenete a felső ÁVK N-sínjéről jön, nem a főnullasínről, különben a felső ÁVK-t megkerülné a nulla. Ha az ÁVK L-oldali betáplálása nem egyértelmű (több ÁVK-ról, vagy ÁVK-ról és a főkapcsolóról is kap, vagy egy RCBO mögül), az N-bemenete nincs bekötve, és figyelmeztetés jelenik meg. Ha a kombinált védelem (RCBO) N-kimenetén már van kézi vezeték, az áramkör N-szálát nem kötjük rá automatikusan (figyelmeztetéssel).

**Az ÁVK-csoport meghatározása** (áramkörönként, ugyanazon elosztó ÁVK-i közül):

1. *Bekötés a bizonyíték:* ha a kismegszakító vagy RCBO L-bemenete kézzel egy ÁVK L-kimenetére van kötve – közvetlenül, vagy fázissínen, fővezetéki leágazón, sorkapcson át –, az az ÁVK a csoport. A követés átmegy a **kismegszakítókon** (egy csoport-kismegszakító L-kimenete a saját, azonos fázisú L-bemenetét folytatja, így az ÁVK → csoport-kismegszakító → fázissín → kismegszakító lánc is az ÁVK-hoz vezet), és az **áthidalásokon**: ha egy védelem L-bemeneti kapcsa egy másik kismegszakító, RCBO vagy ÁVK L-bemeneti kapcsára van kötve (szokásos „áthidalás” a szomszédról), a két kapocs egy csomópont, és a követés a másik kapcson folytatódik. Ha a védelem L-bemenete (ugyanígy követve) a főkapcsoló L-kimenetéről vagy L-bemenetéről kap betáplálást, a bekötés szerint nincs ÁVK a védelem előtt; ha az áramkör ÁVK-csoport szövege ilyenkor ÁVK-t nevez meg, a kettő **ellentmond egymásnak**, a csoport nem azonosítható (3. pont), és a szöveget kell javítani vagy a bekötést. Ha a védelem ÁVK-ról és főkapcsolóról is kap betáplálást, a csoport szintén nem azonosítható. Ha a védelem egy **RCBO L-kimenete mögül** kap betáplálást, a csoport szintén nem azonosítható (az RCBO mögötti nulla az RCBO N-kimenetéről vehető, sínre nem kötjük automatikusan), függetlenül a szövegtől.
2. Egyébként az áramkörjegyzék **ÁVK-csoport** szövege dönt: üres szöveg = nincs ÁVK (főnullasín); különben pontosan egy ÁVK nevével kell egyeznie – a teljes névvel, vagy a név „ · ” előtti részével (pl. „FI-01” a „FI-01 · 40 A / 30 mA · A” nevű készüléket jelöli), kis- és nagybetűtől, szélső szóközöktől függetlenül.
3. Ha egyetlen ÁVK sem illik rá (például más elosztóban van, vagy elgépelés), vagy több is illik, a csoport **nem azonosítható**: az áramkör N szála ilyenkor **nincs bekötve** (a PE igen), és a Bekötések résznél figyelmeztetés jelenik meg. Helytelen N-sínre soha nem kötünk, mert az ÁVK-t megkerülő nulla téves kioldást okoz. Javítsd az ÁVK-csoport szövegét vagy az ÁVK nevét, esetleg kösd be kézzel.

**Nem táplált sín.** Ha egy sín természetes betápláló kapcsa megvan az elosztóban, de **kézzel máshová van kötve** (az ÁVK N-kimenete például a régi DIN-es „Nullasín (N)” modulra, vagy a főkapcsoló N-kimenete az ÁVK N-bemenetére), az adott sín nem kap betáplálást: az automatikus bekötés ilyenkor **nem köt rá fogyasztót** (áramkör N-szálát, ÁVK vagy RCBO N-bemenetet, SPD N-kapcsot), hanem figyelmeztetést ad, és a szál „nincs bekötve” marad – ugyanúgy, mint kikapcsolt automatikus bekötésnél. Egy sínt „táplált”-nak veszünk, ha az automatikus betáplálás létrejön, vagy ha kézzel egy betápláló N-kapocsra kötötték (főkapcsoló vagy ÁVK N-kimenete, nullasín-modul, fővezetéki leágazó vagy sorkapocs N-kapcsa). Főkapcsoló nélküli elosztónál (például kábelről táplált alelosztó) a főnullasínnek nincs természetes betáplálója, ott a fogyasztók rákerülnek a sínre. A PE-sínre ez nem vonatkozik.

**Felülírás.** A kézzel rögzített bekötés mindig erősebb az automatikusnál: ha egy áramköri szálnak vagy készülékkapocsnak kézi vezetéke van, arra nem készül automatikus. A szálat kézzel a sín egy kapcsára (a Bekötések választóban vagy a szekrényrajzon a sínkapocsra kattintva), a PE/nullasín modulra vagy bármely más kompatibilis kapocsra kötheted. Az automatikus vezetékek a rajzon szaggatottak, a jegyzékben „automatikus” jelölést kapnak, és nem törölhetők; felülírásukhoz köss be kézzel, vagy kapcsold ki az automatikus bekötést.

**Kapcsoló.** A **Bekötések** részben az **Automatikus N/PE-bekötés** jelölőnégyzet elosztónként (főelosztó és alelosztók külön) kapcsolható. Kikapcsolva nincs automatikus vezeték, de a sínek megmaradnak, és kézzel továbbra is köthetők. A régi tervek és az új elosztók bekapcsolva nyílnak meg (a hiányzó beállítás = bekapcsolva); a beállítás a terv része (`autoBars`), a megosztott nézet és a PDF is ezt követi. Az automatikus vezetékek nem tárolódnak, ezért nem terhelik a 3000 vezetékes korlátot, és az áramkör, az ÁVK vagy a fázis módosításakor maguktól igazodnak.

A sínek **nem szerepelnek az anyagkimutatásban és az árajánlatban** (egyelőre nem soroljuk fel őket), a méretezés sem használja őket. Az **ÁVK-csoport** szöveget a program nem írja át.

## Részletes szerkesztés

1. A **Készülék hozzáadása** gombbal helyezz el kismegszakítót, ÁVK-t, kombinált védelmet, túlfeszültség-védelmet, főkapcsolót, fővezetéki leágazót, PE-, nulla-, EPH- vagy fázissínt, illetve sorkapcsot. A név, sor, hely és helyfoglalás a készülékre kattintva módosítható. A DIN-sínre szerelt sín-modulok helyfoglalása sematikus; igazítsd a tényleges szekrényhez. Az automatikus tokozati sínekre (lásd fent) ezek nélkül is lehet kötni, és a kézi PE-/nullasín-modul bekötése felülírja az automatikust.
2. Az áramkörjegyzékben add meg az áramkört és a fázisát. A **Bekötések** gomb az áramköri szálakhoz ugrik. Egyfázisú áramkörhöz fázis-, N- és PE-szál, háromfázisúhoz L1, L2, L3, N és PE jelenik meg.
3. Nevezd el a szálat; Enterrel vagy a mező elhagyásával rögzítheted. A mellette lévő választóban add meg a célkészüléket és a kapcsot. Kismegszakítóhoz vagy kombinált védelemhez kötve az áramkör-hozzárendelés is létrejön. Más áramkörhöz rendelt védelmi készülékre nem írható rá a kapcsolat.
4. A **Készülékek közötti átkötés** résznél válaszd ki mindkét készüléket és kapcsot, majd add hozzá az elnevezett vezetéket. A sín számozott kapcsai csatlakozási helyeket jelölnek. A fázissín L-1, L-2 stb. felirata kapocsszám, nem külön fázis.
5. A **Bekötési jegyzék** a kézi és az automatikus kapcsolatok végpontjait sorolja fel (utóbbiak „automatikus” jelöléssel). A készülék nevére kattintva megnyithatók a tulajdonságai. A kuka bontja a kapcsolatot; a **Visszavonás** visszaállítja.

A fázis vagy a készülék áramkör-hozzárendelésének módosításakor a már nem érvényes bekötések megszűnnek. Készülék, áramkör vagy épület törlése a hozzá tartozó bekötéseket is törli. Ezek a műveletek visszavonhatók.

A **Mentés** a bekötéseket és a szálneveket is elmenti a projektbe. A JSON export/import megőrzi őket. A **PDF / nyomtatás → Elosztó**, illetve az összes lap exportja tartalmazza a készülékelrendezést, készülék- és áramkörjegyzéket, bekötési jegyzéket és a még be nem kötött szálakat.

A kapocsjelölések sematikusak, nem gyártóspecifikusak. A nézet kapcsolatokat dokumentál; nem végez villamos méretezést, hálózati szimulációt vagy teljes szabványellenőrzést. A bekötési vezetékekből nem számol geometriai kábelhosszt; a hosszakat továbbra is az alaprajzi és telki nyomvonalak adják.
