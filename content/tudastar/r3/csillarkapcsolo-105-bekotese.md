---
slug: csillarkapcsolo-105-bekotese
title: "Csillárkapcsoló (105) bekötése: két lámpakör egy helyről"
navTitle: "Csillárkapcsoló (105)"
summary: "Hogyan kapcsol a csillárkapcsoló (105) két lámpakört egy helyről, közös betáppal? Bekötés, négy ér a csillárhoz, kapcsolóállások és gyakori hibák."
section: semak
category: kapcsolasok
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [105, csillárkapcsoló, sorozatkapcsoló, kétáramkörös kapcsoló, két lámpakör, csillár bekötése, kapcsolt fázis, kötődoboz]
synonyms: [csillár kapcsoló, sorozat kapcsoló, dupla kapcsoló, kettes kapcsoló, 105-ös kapcsoló, két billentyűs kapcsoló, csillárkapcsoló bekötése]
plannerKinds: [switch5]
related: [vilagitasi-kapcsolasok, egypolusu-kapcsolo-101-bekotese, kettos-valtokapcsolo-106-6-bekotese, vezetekek-szinjelolese, lampafoglalatok-es-lampatalpak, feszultsegmentesites-ot-szabalya]
calculators: [aram-teljesitmenybol]
figures:
  - id: abra-1
    netlist: csillarkapcsolo-105-bekotese.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
sources:
  - standard: "MSZ HD 60364-5-537 (leválasztás és kapcsolás)"
    kiadás: "2017 (HD 60364-5-537:2016)" # lektor ellenőrizze a honosítás évét és a hatályos kiadást
    pont: "537 – az üzemi (funkcionális) kapcsolásról szóló alpont: egypólusú kapcsolókészülék nem kerülhet a nullavezetőbe" # a pontos alpontszámot lektor adja meg
  - standard: "MSZ HD 60364-5-51"
    kiadás: "2010" # lektor ellenőrizze
    pont: "514.3 (vezetők azonosítása)"
  - standard: "MSZ EN IEC 60445"
    kiadás: "2022 (EN IEC 60445:2021)" # lektor ellenőrizze
    pont: "6.2 (vezetők azonosítása színnel)"
  - standard: "MSZ EN 60669-1 (háztartási és hasonló, helyhez kötött villamos berendezések kapcsolói)"
    kiadás: "2018 (EN IEC 60669-1:2018)" # lektor ellenőrizze a kiadást
    pont: "7 (osztályozás, bekötési számok), 8 (jelölés), 12 (kapcsok)" # pontszámokat lektor ellenőrizze
  - standard: "MSZ HD 60364-6 (ellenőrzés)"
    kiadás: "2017 (HD 60364-6:2016)" # lektor ellenőrizze
    pont: "6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás)" # alpontokat lektor ellenőrizze
ai: vázlat
review: lektorra-var
version: 0.1
updated: 2026-10-10
---

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

**Röviden:** A csillárkapcsoló (105) egy szerelvényben, két billentyűvel két lámpakört kapcsol egy helyről, közös betáppal: egy fázis megy be, két kapcsolt fázis jön ki. Jellemzően egy több fényforrásos csillár két csoportját vagy egy helyiség két lámpáját kapcsolja. A lámpáig négy ér kell: két kapcsolt fázis, a nullavezető és a védővezető.

[ÁBRA: abra-1 „Csillárkapcsoló (105) bekötése”. Forrás: csillarkapcsolo-105-bekotese.netlist.json (id: csillarkapcsolo-105); a rajz, a vezetéktábla, az ábra desc-je és a Működés nézet is ebből készül. viewBox 0 0 380 240. Bekötés nézet: balra fent a betáp (L, N, PE), középen fent a kötődoboz öt vezetékösszekötővel (L, N, PE, 1. kör, 2. kör), alatta a 105-ös kapcsoló három kapoccsal (L, 1, 2), jobbra fent a csillár sorkapcsa (1, 2, N, PE), alatta két kis lámpajel „1. csoport” és „2. csoport” felirattal, a csillár belső vezetékeivel. Erek: L barna, 1. kör kapcsolt fázisa fekete „1” felirattal, 2. kör szürke „2” felirattal, N kék, PE zöld alapon sárga csíkkal. Szerelési rajz nézet: a tervező switch5 jele („5” felirat), kötődoboz és lámpakiállás; érszám 3 / 3 / 4. Működés nézet: két billentyűgomb (aria-pressed), csoportonként kiemelt áramút és szöveges állapot. Alsó sor: „Így látod a tervezőben: a PE egyszínű zöld.”]

## Vezetékek táblázatban

A két kapcsolt fázis színe itt: 1. kör fekete, 2. kör szürke; a fázisszínek közötti választás nem kötött, a felirat mindkettőt egyértelművé teszi.

<!-- sim:vezetekek src=csillarkapcsolo-105-bekotese.netlist.json -->
| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | Csillárkapcsoló (105): L kapocs (közös betáp) | L | barna | Kötődoboz – kapcsoló |
| 5 | Csillárkapcsoló (105): 1-es kapocs (1. kör) | Kötődoboz: 1. kör kapcsoltfázis-kötése | kapcsolt fázis 1 | fekete | Kötődoboz – kapcsoló |
| 6 | Csillárkapcsoló (105): 2-es kapocs (2. kör) | Kötődoboz: 2. kör kapcsoltfázis-kötése | kapcsolt fázis 2 | szürke | Kötődoboz – kapcsoló |
| 7 | Kötődoboz: 1. kör kapcsoltfázis-kötése | Csillár sorkapcsa: 1 | kapcsolt fázis 1 | fekete | Kötődoboz – csillár |
| 8 | Kötődoboz: 2. kör kapcsoltfázis-kötése | Csillár sorkapcsa: 2 | kapcsolt fázis 2 | szürke | Kötődoboz – csillár |
| 9 | Kötődoboz: N-kötés | Csillár sorkapcsa: N | N | kék | Kötődoboz – csillár |
| 10 | Kötődoboz: PE-kötés | Csillár sorkapcsa: PE | PE | zöld-sárga | Kötődoboz – csillár |
| 11 | Csillár sorkapcsa: 1 | 1. lámpacsoport: L (fázis) | kapcsolt fázis 1 | fekete | dobozon belül |
| 12 | Csillár sorkapcsa: 2 | 2. lámpacsoport: L (fázis) | kapcsolt fázis 2 | szürke | dobozon belül |
| 13 | Csillár sorkapcsa: N | 1. lámpacsoport: N | N | kék | dobozon belül |
| 14 | Csillár sorkapcsa: N | 2. lámpacsoport: N | N | kék | dobozon belül |
| 15 | Csillár sorkapcsa: PE | 1. lámpacsoport: PE | PE | zöld-sárga | dobozon belül |
| 16 | Csillár sorkapcsa: PE | 2. lámpacsoport: PE | PE | zöld-sárga | dobozon belül |
<!-- /sim:vezetekek -->

## Hogyan működik?

A 105-ös kapcsolóban két érintkező van, mindkettőnek saját billentyűje, de közös a betápkapcsuk. Az 1. billentyű a közös betáp fázisát az 1-es, a 2. billentyű a 2-es kimenetre kapcsolja, egymástól függetlenül. Így négy állapot lehetséges: mindkét kör kikapcsolva, csak az 1. kör ég, csak a 2. kör ég, vagy mindkettő ég. A nullavezető és a védővezető a kötődobozban közvetlenül jut a csillárhoz, egyik billentyű sem bontja.

<!-- sim:allapotok src=csillarkapcsolo-105-bekotese.netlist.json -->
| Csillárkapcsoló (105) – 1. billentyű | Csillárkapcsoló (105) – 2. billentyű | 1. lámpacsoport | 2. lámpacsoport |
|---|---|---|---|
| ki | ki | nem ég | nem ég |
| ki | be | nem ég | **ég** |
| be | ki | **ég** | nem ég |
| be | be | **ég** | **ég** |

_A táblázatot a szimulátor számolta a(z) `csillarkapcsolo-105` netlistából (ujjlenyomat: `171c858b`): 4 kapcsolóállás, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig folytonos, és nem halad át kapcsolón; kikapcsolt állásban a lámpa fázisoldali kapcsa nem kap fázist; a nullavezető egyik állásban sem halad át kapcsolón._
<!-- /sim:allapotok -->

**105 vagy két 101 egy keretben?** A kettős keretbe épített két egypólusú kapcsolónak (101 + 101) két külön betápkapcsa van, ezért két különböző áramkörről is táplálható. A 105-ösnél a betáp közös, így a két lámpakör csak ugyanarról az áramkörről kaphat fázist. Ha két külön áramkörről táplált lámpát kapcsolnak egy szerelvénydobozból, mindkét áramkör nullavezetőjének a saját áramkörénél kell maradnia: a két áramkör nullavezetőjét nem szabad összekötni vagy felcserélni. Ez külön áram-védőkapcsolók (FI-relék) esetén kioldást okoz, és ami súlyosabb: ha az egyik áramkört a kismegszakítójával lekapcsolják, a közösített vagy felcserélt nullavezetőn a másik áramkör árama tovább folyhat, így a „lekapcsolt” áramkör nullavezetőjének megbontásakor áramütés érheti a szerelőt. Ilyen dobozban munkavégzés előtt mindkét áramkört le kell választani, a kettős betáplálást pedig a dobozban és az elosztóban jelölni kell.

## Kapcsok és jelölésük

A 105-ös kapcsolónak három kapcsa van: a közös betáp (gyakran L vagy nyíl) és a két kimenet (gyakran 1 és 2, vagy egy-egy nyíl). Hogy melyik billentyű melyik kimenetet kapcsolja, az gyártónként eltérhet; a gyártói útmutató vagy a kapcsolóbetét rajza az irányadó. Előfordul, hogy a betápkapocs kettős (a továbbkötés megkönnyítésére), vagy hogy a két billentyű két önálló kapcsolóbetét egy keretben; utóbbinál a két betét betápját a gyártói útmutató szerint át kell kötni.

A csillár sorkapcsán is gyártónként eltér a jelölés (például 1 és 2, L1 és L2, vagy színes vezetékvégek). A lámpacsoportok és a sorkapocs összerendelését a lámpatest leírása adja meg.

## A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. **Feszültségmentesítés** az elosztóban, [[feszultsegmentesites-ot-szabalya|a feszültségmentesítés öt szabálya]] szerint, minden érintett áramkörre (a feszültségvizsgáló működését előtte és utána ismert feszültségforráson ellenőrizve). A kötődobozban más áramkör vezetői is futhatnak.
2. **Azonosítás.** A betáp vezetőinek, valamint a kapcsolóhoz és a csillárhoz menő ereknek az azonosítása és jelölése (1. kör, 2. kör).
3. **Kötődoboz.** A betáp nullavezetője a csillár nullavezetőjével, a védővezető a csillár védővezetőjével kerül egy-egy összekötőbe. A betáp fázisa a kapcsoló közös kapcsához megy, a két kapcsolt fázis a csillár 1-es és 2-es kapcsához tartozó érrel kerül össze.
4. **Kapcsoló.** A fázis a közös betápkapocsra, a két kapcsolt fázis a két kimenetre kerül.
5. **Csillár.** A két kapcsolt fázis a sorkapocs 1-es és 2-es kapcsára, a nullavezető az N, a védővezető a PE kapocsra kerül.
6. **Ellenőrzés visszakapcsolás előtt:** szemrevételezés, valamint a védővezető folytonosságának, a szigetelési ellenállásnak és a polaritásnak a mérése; a szakember dokumentálja.
7. **Működéspróba:** mind a négy billentyűállás a fenti táblázat szerint működik.

## Jelölés az alaprajzon

A tervezőben a csillárkapcsoló jele kör két ferde vonallal, alatta az 5-ös számmal (105 → 5). A szerelési rajz szakaszonként mutatja az erek számát:

<!-- sim:szakaszok src=csillarkapcsolo-105-bekotese.netlist.json -->
| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – kapcsoló | L (barna), kapcsolt fázis 1 (fekete), kapcsolt fázis 2 (szürke) | 3 |
| Kötődoboz – csillár | kapcsolt fázis 1 (fekete), kapcsolt fázis 2 (szürke), N (kék), PE (zöld-sárga) | 4 |
<!-- /sim:szakaszok -->

A lámpakiállásnál a két kapcsolt fázist tartósan jelölni kell (például felirattal vagy jelölőhüvellyel), hogy a csillár cseréjekor is egyértelmű maradjon, melyik ér melyik kör.

## Régi berendezésben

- **Forgó vagy nyomógombos sorozatkapcsoló.** A régi csillárkapcsolók egy része egyetlen kezelőszervvel lépteti egymás után az állapotokat (például ki, egyik kör, másik kör, mindkettő); a sorrend típusonként eltér, a kapcsai gyakran jelöletlenek.
- **Háromeres vezetékezés a csillárig.** Régi berendezésben a csillárhoz gyakran csak két kapcsolt fázis és egy nullavezető megy, védővezető nélkül. Fémtestű csillár így nem köthető be szakszerűen; a megoldásról szakember dönt. A hiányzó védővezetőt tilos a nullavezetőből „pótolni” (a csillár védőkapcsát a nullára kötni), és a két kapcsolt fázis egyike sem használható helyette.
- **Elöregedett belső vezetékezés.** Régi csillárokban a fényforrások hője a belső vezetékek szigetelését rideggé teheti.
- **Ismeretlen szerepű erek.** A színekre itt sem lehet hagyatkozni; a régi kábelekben két fekete ér is előfordul.

## Gyakori hibák

- **Kapcsolt fázis a nullavezető összekötőjében.** Ha a kötődobozban a kapcsoló egyik kimenetéről jövő ér a nullavezetők közé kerül, a szimuláció szerint a billentyű bekapcsolásakor zárlat keletkezik a fázis- és a nullavezető között, és a kismegszakító lekapcsol.
- **Felcserélt körök:** a billentyűk „fordítva” kapcsolnak. Ez nem biztonsági hiba, de az áramkörtervtől eltér; a jelölést a tényleges bekötéshez kell igazítani.
- **Két áramkör nullavezetőjének összekötése** két 101-es kapcsolóval megoldott „csillárkapcsolásnál”.
- **Kimaradt védővezető** a csillárnál, vagy a csillár fém függesztőjének bekötetlen védőkapcsa.
- **Laza kötés** a közös betápkapcson: mindkét kör villog vagy kimarad.
- **Utánfutásos szellőző 105-ös kapcsolóval.** Fürdőszobában gyakori, hogy az egyik billentyű a lámpát, a másik a szellőzőt kapcsolja. Az utánfutásos szellőzők jellemzően állandó fázist és külön vezérlőbemenetet igényelnek, a bekötésüket a gyártói útmutató adja meg; az ilyen szellőző a billentyű kikapcsolt állásában is feszültség alatt van. Nedves helyiségben a zónaszabályokat is figyelembe kell venni.

## Mikor hívj szakembert?

- Mindig, ha kapcsolót, csillárt vagy kötést kell bekötni, cserélni vagy áthelyezni.
- Ha az egyik billentyű bekapcsolásakor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a kapcsoló vagy a csillár kötése melegszik, elszíneződött, recseg, vagy égett szagot érzel.
- Ha a csillárnál nincs védővezető, vagy a régi csillár belső vezetékei töredeznek.
- Ha a két lámpakört külön áramkörről szeretnéd táplálni, vagy szellőzőt is kapcsolnál ugyanarról a szerelvényről.
