---
slug: dugalj-bekotese
title: "Dugalj bekötése: védőérintkezős dugalj, áthurkolás és leágaztatás"
navTitle: "Dugalj bekötése"
summary: "Hogyan kap fázist, nullát és védővezetőt a védőérintkezős dugalj? Áthurkolás vagy leágaztatás, FI-relé és kismegszakító, gyakori hibák, régi berendezések."
section: semak
category: kapcsolasok
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [dugalj, konnektor, dugalj bekötése, védőérintkezős dugalj, földelt dugalj, Schuko, áthurkolás, leágaztatás, kettős dugalj, védővezető, PE, dugaljáramkör, áram-védőkapcsoló, kismegszakító]
synonyms: [konnektor bekötése, csatlakozóaljzat, dugaszolóaljzat, aljzat, földelt konnektor, schuko konnektor, dupla konnektor, konnektor földelése, konnektor fázis nulla föld]
plannerKinds: [socket, double]
related: [aram-vedokapcsolo-fi-rele, kismegszakito, foldelesi-rendszerek, vezetekek-szinjelolese, feszultsegmentesites-ot-szabalya, ip-vedettseg, egypolusu-kapcsolo-101-bekotese]
calculators: [aram-teljesitmenybol, fazisterheles]
figures:
  - id: abra-1
    netlist: dugalj-bekotese.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
  - id: abra-2
    netlist: dugalj-bekotese-leagaztatas.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
sources:
  - standard: "MSZ HD 60364-4-41 (áramütés elleni védelem)"
    kiadás: "2007 (HD 60364-4-41:2007)" # lektor ellenőrizze; újabb kiadás (HD 60364-4-41:2017) honosítása és hatálya kérdéses
    pont: "411.3.3 (kiegészítő védelem áram-védőkapcsolóval a dugaljáramkörökre), 415.1 (kiegészítő védelem)" # alpontokat lektor ellenőrizze
  - standard: "MSZ HD 60364-5-54 (földelő berendezések és védővezetők)"
    kiadás: "2012 (HD 60364-5-54:2011)" # lektor ellenőrizze
    pont: "543.3 (a védővezetők villamos folytonossága; kapcsolókészülék nem lehet a védővezetőben), 543.4.3 (a nulla- és a védővezető a szétválasztásuk után nem köthető újra össze)" # alpontokat lektor ellenőrizze
  - standard: "MSZ HD 60364-5-51"
    kiadás: "2010" # lektor ellenőrizze
    pont: "514.3 (vezetők azonosítása)"
  - standard: "MSZ EN IEC 60445"
    kiadás: "2022 (EN IEC 60445:2021)" # lektor ellenőrizze
    pont: "6.2 (vezetők azonosítása színnel)"
  - standard: "IEC TR 60083 (háztartási dugók és dugaszolóaljzatok az IEC-tagországokban)"
    kiadás: "2015" # lektor ellenőrizze
    pont: "a CEE 7/3 (F típusú, oldalsó védőérintkezős) dugaszolóaljzat leírása" # a hazai termékszabványt (MSZ 9871 sorozat?) lektor adja meg
  - standard: "MSZ HD 60364-7-701 (fürdő- és zuhanyozóhelyiségek)"
    kiadás: "2007" # lektor ellenőrizze a hatályos kiadást
    pont: "701.411.3.3 (kiegészítő védelem), 701.512.3 (szerelvények elhelyezése a zónákban)" # pontszámokat lektor ellenőrizze
  - standard: "MSZ HD 60364-6 (ellenőrzés)"
    kiadás: "2017 (HD 60364-6:2016)" # lektor ellenőrizze
    pont: "6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás, áram-védőkapcsoló működése)" # alpontokat lektor ellenőrizze
lektorKerdesek:
  - "Van-e kötelező hazai előírás arra, hogy a védővezetőt ne a dugalj kapcsán hurkolják át, hanem kötőelemmel ágaztassák le? A cikk jelenleg csak szakmai megfontolásként tárgyalja."
  - "Van-e kialakult hazai szabály arra, hogy jelöletlen kapcsú dugaljnál szemből nézve melyik oldalra kerüljön a fázis? A cikk most csak az egységes bekötést javasolja."
  - "A CEE 7/3 aljzat hazai termékszabványa (MSZ 9871 sorozat vagy más) és kiadása."
  - "Elegendő-e a háromfázisú (CEE-rendszerű, ötpólusú) dugalj puszta említése, vagy külön cikk kell (P2)?"
  - "A kikapcsolt dugalj állapotát a táblázat „nem ad feszültséget” szóval jelöli (nem „feszültségmentes”), mert lekapcsolt kismegszakító mellett a nullavezető a nullasínen marad. Elfogadható-e ez a szóhasználat (a független biztonsági ellenőr javaslata)?"
  - "Maradjon-e „A szerelés menete szakembernek” lépéssor a laikusokat is megszólító (audience: laikus) cikkben, vagy kerüljön szakembernek szóló, összecsukott blokkba? A „hogyan kell bekötni a konnektort” keresőszinonimát az ellenőr kivette; visszakerüljön-e?"
ai: vázlat
review: lektorra-var
version: 0.1
updated: 2026-10-10
---

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

**Röviden:** A védőérintkezős (földelt) dugalj három vezetőt kap: fázisvezetőt (L), nullavezetőt (N) és védővezetőt (PE), amely a dugalj oldalsó védőérintkezőihez csatlakozik. A mai gyakorlatban a dugaljáramkört a lakáselosztóban saját kismegszakító és egy 30 mA-es áram-védőkapcsoló (FI-relé) védi. Több dugalj áthurkolással vagy kötődobozos leágaztatással kerülhet egy áramkörre; a védővezető mindkét esetben megszakítás és kapcsoló nélkül jut el minden dugaljig.

[ÁBRA: abra-1 „Dugaljkör áthurkolással, FI-relé és kismegszakító után”. Forrás: dugalj-bekotese.netlist.json (id: dugalj-athurkolas); a rajz, a vezetéktábla, az ábra desc-je és a Működés nézet is ebből készül, kézzel nem rajzolható át. viewBox 0 0 460 220, elhelyezés a netlista layout mezője szerint. Bekötés nézet: balra a lakáselosztó (betáp-gyűjtősín L, N, PE; Q1 kétpólusú áram-védőkapcsoló; utána nullasín és F1 kismegszakító; külön PE-sín), jobbra az X1 és az X2 dugalj három-három kapoccsal (L, N, védőérintkező). Az X1-ből a továbbmenő vezetők az X2-höz futnak. Minden éren felirat és szín: L barna, N kék, PE zöld alapon sárga csíkkal. Szerelési rajz nézet: alaprajzi elrendezés a tervező jeleivel (lakáselosztó, két socket jel), szakaszonként érszám-vonalkákkal (3 / 3, a szakasztáblázat szerint). Működés nézet: két gomb (Q1, F1; aria-pressed), kiemelt áramút, szöveges állapot („Az X1 és az X2 dugalj feszültség alatt” / „nem ad feszültséget”), alatta az állapottáblázat. Alsó sor (.fig-small): „Így látod a tervezőben: a PE egyszínű zöld.” title: „Dugalj bekötése áthurkolással”; desc: a netlistából generált leírás.]

## A védőérintkezős dugalj

A hazai lakásokban a két hüvelyes, oldalsó védőérintkezős (földelőkarmos) dugalj terjedt el. A dugó két irányban is bedugható, ezért a csatlakoztatott készülék nem számíthat arra, hogy a fázis mindig ugyanazon az érintkezőn érkezik. A védőérintkező viszont mindig a védővezetőhöz kapcsolódik: ezen keresztül kapja meg a fémházas (I. érintésvédelmi osztályú) készülék háza a védővezetőt. A gyári kettős (dupla) dugalj két aljzata jellemzően a házon belül össze van kötve, ezért egy kapocskészlettel köthető be; hogy egy adott kivitel így készült-e, azt a gyártói útmutató mutatja meg.

## Vezetékek táblázatban

Az 1. ábra szöveges megfelelője. A lakáselosztón belüli vezetékek a betápot, az áram-védőkapcsolót és a kismegszakítót kötik össze; a dugaljakhoz háromeres vezeték fut.

<!-- sim:vezetekek src=dugalj-bekotese.netlist.json -->
| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp (gyűjtősín): L | Q1 áram-védőkapcsoló (FI-relé): 1 (fázis, táp oldal) | L | barna | elosztón belül |
| 2 | Betáp (gyűjtősín): N | Q1 áram-védőkapcsoló (FI-relé): N (táp oldal) | N | kék | elosztón belül |
| 3 | Q1 áram-védőkapcsoló (FI-relé): N (védett oldal) | Nullasín (N) a FI-relé után: N | N | kék | elosztón belül |
| 4 | Betáp (gyűjtősín): PE | PE-sín: PE | PE | zöld-sárga | elosztón belül |
| 5 | Q1 áram-védőkapcsoló (FI-relé): 2 (fázis, védett oldal) | F1 kismegszakító (dugaljkör): 1 (be) | L | barna | elosztón belül |
| 6 | F1 kismegszakító (dugaljkör): 2 (ki) | X1 dugalj: L kapocs | L | barna | Elosztó – X1 dugalj |
| 7 | Nullasín (N) a FI-relé után: N | X1 dugalj: N kapocs | N | kék | Elosztó – X1 dugalj |
| 8 | PE-sín: PE | X1 dugalj: védőérintkező kapocs | PE | zöld-sárga | Elosztó – X1 dugalj |
| 9 | X1 dugalj: L kapocs | X2 dugalj: L kapocs | L | barna | X1 – X2 dugalj (áthurkolás) |
| 10 | X1 dugalj: N kapocs | X2 dugalj: N kapocs | N | kék | X1 – X2 dugalj (áthurkolás) |
| 11 | X1 dugalj: védőérintkező kapocs | X2 dugalj: védőérintkező kapocs | PE | zöld-sárga | X1 – X2 dugalj (áthurkolás) |
<!-- /sim:vezetekek -->

## Hogyan működik?

A dugalj akkor van feszültség alatt, ha az áramkör áram-védőkapcsolója (FI-relé) és kismegszakítója is be van kapcsolva. A kismegszakító csak a fázisvezetőt bontja: lekapcsolt állásban a dugalj nullavezetője továbbra is a nullasínhez csatlakozik. Az áram-védőkapcsoló a fázis- és a nullavezetőt együtt bontja. A védővezetőt egyik készülék sem kapcsolja, az minden állásban összeköttetésben marad a PE-sínnel.

<!-- sim:allapotok src=dugalj-bekotese.netlist.json -->
| Q1 áram-védőkapcsoló (FI-relé) | F1 kismegszakító (dugaljkör) | X1 dugalj | X2 dugalj |
|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | **feszültség alatt** | **feszültség alatt** |
| be (bekapcsolva) | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | be (bekapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |

_A táblázatot a szimulátor számolta a(z) `dugalj-athurkolas` netlistából (ujjlenyomat: `9bb3ff8e`): 4 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé): nem old ki. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig és védőérintkezőig folytonos, és nem halad át kapcsolón; a kismegszakító csak a fázist bontja; minden dugalj kismegszakítón és áram-védőkapcsolón át kap feszültséget; a nullavezetőt csak a kétpólusú áram-védőkapcsoló bontja, a fázisvezetővel együtt; normál üzemben nem folyik különbözeti áram. „Kiold”: a védett oldalról a pólusokat megkerülve (a védővezetőn, a földön vagy a próbaellenálláson át) áram folyik; áramerősséget, érintési feszültséget és kioldási időt a szimuláció nem számol._
<!-- /sim:allapotok -->

Ebből következik, hogy **egy kismegszakító lekapcsolása önmagában még nem feszültségmentesítés.** A nullavezető összeköttetésben marad a nullasínnel, ezért más áramkörök terhelésekor vagy a nullavezető megszakadásakor feszültség alá kerülhet; egy dobozban más áramkör vezetői is futhatnak, a felirat pedig tévedhet. A táblázat „nem ad feszültséget” cellája csak azt jelenti, hogy a dugaljon nincs üzemi feszültség, azt nem, hogy feszültségmentes. A feszültségmentességet mindig méréssel kell megállapítani (lásd: [[feszultsegmentesites-ot-szabalya|A feszültségmentesítés öt szabálya]]).

## Kapcsok és jelölésük

A dugalj betétjén három kapocs van: a két hüvelyhez tartozó L és N, valamint a védőérintkező kapcsa, amelyet PE felirat vagy földelésjel mutat. Sok dugaljon az L és az N nincs megkülönböztetve. Ilyenkor célszerű a berendezésen belül minden dugaljat egységesen bekötni, hogy a későbbi mérés és hibakeresés egyértelmű legyen. A kapcsok csavarosak vagy rugós (csavar nélküli) kivitelűek. Hogy egy kapocs hány vezetőt és milyen keresztmetszetet fogadhat, és alkalmas-e áthurkolásra, azt a gyártó adja meg. A jelölés és a kapocskialakítás gyártónként eltérhet; a gyártói útmutató az irányadó.

## Áthurkolás vagy leágaztatás?

**Áthurkolás** (1. ábra): a következő dugaljhoz menő vezetők ugyanabba a kapocsba kerülnek, mint a betáp vezetői. Kevesebb kötés kell, de a továbbmenő áramkör folytonossága minden dugalj kapcsán múlik. Ha egy kapocs meglazul, vagy a dugaljat kiszerelik, a sorban utána következő dugaljak elveszíthetik a fázist, a nullát vagy a **védővezetőt**. A fázis hiánya a működésen látszik, a védővezetőé nem: a dugalj ugyanúgy működik, csak a csatlakoztatott fémházas készülék marad védelem nélkül. A nullavezető szakadása is alattomos: a dugalj nem ad feszültséget, a nullahüvelye mégis fázisfeszültségre kerülhet a csatlakoztatott készüléken át. Ezért sok szakember legalább a védővezetőt kötőelemmel ágaztatja le.

<!-- sim:szakaszok src=dugalj-bekotese.netlist.json -->
| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – X1 dugalj | L (barna), N (kék), PE (zöld-sárga) | 3 |
| X1 – X2 dugalj (áthurkolás) | L (barna), N (kék), PE (zöld-sárga) | 3 |
<!-- /sim:szakaszok -->

**Leágaztatás** (2. ábra): a kötődobozban szerepenként egy-egy vezetékösszekötő fogja össze a vezetőket, és minden dugaljhoz külön szakasz indul. Egy dugalj cseréje a többit nem érinti.

[ÁBRA: abra-2 „Dugaljkör leágaztatással, kötődobozból”. Forrás: dugalj-bekotese-leagaztatas.netlist.json (id: dugalj-leagaztatas); a rajz, a vezetéktábla, a desc és a Működés nézet ebből készül. viewBox 0 0 460 240. Bekötés nézet: balra a lakáselosztó (mint az 1. ábrán), középen fent a kötődoboz három vezetékösszekötővel (L, N, PE), alatta az X1 és az X2 dugalj, mindegyik saját háromeres szakasszal. Színek: L barna, N kék, PE zöld-sárga. Szerelési rajz nézet: a tervező jelei (lakáselosztó, kötődoboz, két socket jel), érszám-vonalkák (3 / 3 / 3). Működés nézet: Q1 és F1 gomb, kiemelt áramút, alatta az állapottáblázat. Alsó sor (.fig-small): „Így látod a tervezőben: a PE egyszínű zöld.” title: „Dugalj bekötése leágaztatással”; desc: a netlistából generált leírás.]

<!-- sim:szakaszok src=dugalj-bekotese-leagaztatas.netlist.json -->
| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – X1 dugalj | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – X2 dugalj | L (barna), N (kék), PE (zöld-sárga) | 3 |
<!-- /sim:szakaszok -->

<!-- sim:allapotok src=dugalj-bekotese-leagaztatas.netlist.json tomor -->
| Q1 áram-védőkapcsoló (FI-relé) | F1 kismegszakító (dugaljkör) | X1 dugalj | X2 dugalj |
|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | **feszültség alatt** | **feszültség alatt** |
| bármely | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | be (bekapcsolva) | nem ad feszültséget | nem ad feszültséget |

_A táblázatot a szimulátor számolta a(z) `dugalj-leagaztatas` netlistából (ujjlenyomat: `143d7450`): 4 állapotkombináció, mindegyik egyezik a várt működéssel (a „bármely” sor az adott elem minden állására érvényes). Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé): nem old ki. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig és védőérintkezőig folytonos, és nem halad át kapcsolón; a kismegszakító csak a fázist bontja; minden dugalj kismegszakítón és áram-védőkapcsolón át kap feszültséget; a nullavezetőt csak a kétpólusú áram-védőkapcsoló bontja, a fázisvezetővel együtt; normál üzemben nem folyik különbözeti áram. „Kiold”: a védett oldalról a pólusokat megkerülve (a védővezetőn, a földön vagy a próbaellenálláson át) áram folyik; áramerősséget, érintési feszültséget és kioldási időt a szimuláció nem számol._
<!-- /sim:allapotok -->

Hány dugalj kerülhet egy áramkörre, és mekkora legyen a vezeték keresztmetszete és a kismegszakító névleges árama, az méretezés kérdése (lásd: [[kismegszakito|Kismegszakító]]). Ezt a cikk szándékosan nem adja meg számokkal.

## A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. **Feszültségmentesítés.** Az érintett áramkör leválasztása az elosztóban, visszakapcsolás elleni biztosítás, majd a feszültségmentesség megállapítása kétpólusú feszültségvizsgálóval minden vezetőpár között (L–N, L–PE, N–PE); a vizsgáló működését a mérés előtt és után ismert feszültségforráson ellenőrizni kell. A dugaljdobozban más áramkör vezetői is lehetnek; a fáziskereső nem igazolja a feszültségmentességet.
2. **Azonosítás.** A fázis-, a nulla- és a védővezető, valamint a továbbmenő erek azonosítása. A szín csak szándékot jelez (lásd: [[vezetekek-szinjelolese|Vezetékek színjelölése]]).
3. **Előkészítés.** Csupaszolás a gyártó által megadott hosszon; hajlékony vezetőhöz érvéghüvely, ha a kapocs megkívánja.
4. **Bekötés.** A védővezető a védőérintkező kapcsára, a fázis- és a nullavezető a két hüvely kapcsára kerül. Áthurkolásnál a továbbmenő erek csak a gyártó által megengedett módon kerülhetnek ugyanabba a kapocsba.
5. **Szerelés.** A betét rögzítése a dobozban úgy, hogy a vezetékek ne törjenek meg, ne sérüljenek, és ne feszüljenek a kapcsokon.
6. **Ellenőrzés.** Szemrevételezés, majd a szakember műszeres ellenőrzése: a védővezető folytonossága, a szigetelési ellenállás, a polaritás, visszakapcsolás után pedig a hibahurok-impedancia (az önműködő lekapcsolás feltétele) és az áram-védőkapcsoló működése. Az eredményeket dokumentálni kell.

## Jelölés az alaprajzon

A Villanyrajz tervezőjében a dugalj jele kör két függőleges vonallal (a két hüvely), a kettős dugaljé két egymás melletti kör. A szerelvényhez beépítési magasság és áramkör rendelhető, a nyomvonalakhoz pedig kábeljelölés; az anyaglista ebből számolja a hosszakat.

## Háromfázisú dugalj

Háromfázisú fogyasztóhoz (például műhelygéphez) ipari kivitelű dugalj tartozik: ötpólusú (három fázisvezető, nullavezető és védővezető) vagy nullavezető nélküli, négypólusú változatban. Ott a fázissorrend is számít, mert az a motor forgásirányát határozza meg. Ez a cikk csak az egyfázisú dugaljjal foglalkozik; háromfázisú dugaljat a tervező előírása szerint szakember köt be.

## Régi berendezésben

- **Védőérintkező nélküli dugaljak.** Kéteres vezetékezésnél fémházas készülék nem csatlakoztatható szakszerűen. Ha a védőérintkezős aljzat mögött nincs védővezető, az hamis biztonságérzetet ad. A hiányzó védővezetőt tilos a nullavezetőből „pótolni”, vagyis a védőérintkező kapcsát a nullára kötni.
- **„Nullázott” dugalj.** Régi, közös nulla- és védővezetős (TN-C) berendezésben előfordul, hogy a védőérintkező kapcsa a dugaljban át van kötve a nullavezetőre. Ha a nullavezető megszakad, a csatlakoztatott fémházas készülék háza a készüléken keresztül fázisfeszültséget kap; ha a fázis- és a nullavezető fel van cserélve, a ház közvetlenül fázisra kerül. Áram-védőkapcsoló után ez a kötés ráadásul kioldást okoz. Ahol a PEN-vezetőt már szétválasztották, a nulla- és a védővezetőt a szétválasztási pont után újra összekötni tilos. Az átalakításról szakember dönt (lásd: [[foldelesi-rendszerek|Földelési rendszerek]]).
- **Nincs áram-védőkapcsoló** a dugaljáramkörök előtt: a fázis–föld érintés ellen nincs kiegészítő védelem. Az utólagos beépítésről szakember dönt; közös nulla- és védővezetős szakaszon előbb a PEN-vezetőt kell szétválasztani.
- **Alumínium vezetők,** amelyek csak alumíniumhoz is alkalmas kapocsba köthetők, és könnyen törnek.
- **Kiégett, elszíneződött betétek,** meglazult kapcsok, repedt fedlap.
- **Megbízhatatlan érszínek:** a régi berendezésekben a színekre nem lehet hagyatkozni. A kék ér is vezethet fázist (például a kapcsolóhoz menő szakaszban), és a védővezető színe is eltérhet a zöld-sárgától; a vezetők szerepét szakember méréssel állapítja meg.

## Gyakori hibák

- **Fázis a védőérintkező kapcsán.** A legsúlyosabb hiba: a csatlakoztatott készülék háza fázis alá kerül. A szimulátor az ilyen netlistát elutasítja.
- **Nulla- és védővezető összekötése a dugaljban.** Áram-védőkapcsoló után kioldást okoz; áram-védőkapcsoló nélkül rejtve marad, de a nullavezető szakadásakor a csatlakoztatott készülék háza feszültség alá kerülhet. A PEN-szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze. A szimulátor az ilyen netlistát zárlatként elutasítja.
- **Kimaradt vagy laza továbbmenő védővezető** áthurkolásnál: a következő dugaljak védővezető nélkül maradnak, de működnek.
- **Másik áramkör nullavezetőjének használata.** A lekapcsolt áramkör nullája ilyenkor is áramot vezethet, és két külön áram-védőkapcsoló esetén mindkettő kiold.
- **Zöld-sárga ér más célra,** vagy jelöletlen ér a szokásostól eltérő szerepben.
- **Túl hosszú vagy túl rövid csupaszolás:** kilógó csupasz vezető, illetve laza, melegedő kötés.

## Mikor hívj szakembert?

- Mindig, ha dugaljat kell bekötni, cserélni, áthelyezni vagy újat kell felszerelni.
- Ha a dugalj vagy a fedlapja meleg, elszíneződött, olvadt, a dugó lazán áll benne, szikrázik, vagy égett szagot érzel. Addig ne használd, és ha biztonságosan megteheted, kapcsold le az áramkörét az elosztóban.
- Azonnal, ha egy készülék fémházának, a dugalj fedlapjának vagy más fémrésznek az érintésekor bizsergést érzel: ne érintsd újra, kapcsold le az áramkört az elosztóban, és amíg szakember meg nem vizsgálta, ne kapcsold vissza.
- Ha egy készülék csatlakoztatásakor lekapcsol az áram-védőkapcsoló (FI-relé) vagy a kismegszakító. Ne kapcsold vissza újra és újra, és a készüléket ne használd tovább.
- Ha régi, védőérintkező nélküli dugaljat vagy alumínium vezetékezést találsz.
- Fürdőszobában, más nedves helyiségben és szabadban: ott a dugalj helyét, védettségét és védelmét külön előírások szabályozzák (lásd: [[ip-vedettseg|IP-védettség]]).
- Nagy teljesítményű fogyasztóhoz (főzőlap, sütő, villanybojler, klíma, elektromosautó-töltő): ezek jellemzően saját, méretezett áramkört kapnak.
