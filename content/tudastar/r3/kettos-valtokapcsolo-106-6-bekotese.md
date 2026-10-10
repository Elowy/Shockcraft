---
slug: kettos-valtokapcsolo-106-6-bekotese
title: "Kettős váltókapcsoló (106+6) bekötése: két lámpa két helyről"
navTitle: "Kettős váltókapcsoló (106+6)"
summary: "Két lámpa, mindkettő két helyről: a kettős váltókapcsoló (106+6) két független váltókapcsoló egy szerelvényben. Bekötés, áthidalás, érszám, gyakori hibák."
section: semak
category: kapcsolasok
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [106+6, kettős váltókapcsoló, dupla váltókapcsoló, két lámpa két helyről, váltóvezeték, közös kapocs áthidalása, lépcső és folyosó világítás]
synonyms: [dupla váltó, kettős váltó, 106+106, 2x106, kétbillentyűs váltókapcsoló, dupla alternatív kapcsoló, kettős váltókapcsoló bekötése]
plannerKinds: [switch6]
related: [vilagitasi-kapcsolasok, valtokapcsolo-106-bekotese, csillarkapcsolo-105-bekotese, keresztkapcsolo-107-bekotese, vezetekek-szinjelolese, feszultsegmentesites-ot-szabalya]
calculators: [aram-teljesitmenybol]
figures:
  - id: abra-1
    netlist: kettos-valtokapcsolo-106-6-bekotese.netlist.json
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

**Röviden:** A kettős váltókapcsoló (106+6) két egymástól független váltókapcsoló egy szerelvényben, két billentyűvel. Két ilyen kapcsolóval két lámpa kapcsolható, mindkettő két helyről, például a lépcső és a folyosó világítása a lépcső aljáról és tetejéről. Mindkét lámpakörhöz saját váltóvezeték-pár tartozik, a két kör csak a betápon osztozik.

[ÁBRA: abra-1 „Két lámpa két helyről, kettős váltókapcsolókkal”. Forrás: kettos-valtokapcsolo-106-6-bekotese.netlist.json (id: kettos-valtokapcsolo-106-6); a rajz, a vezetéktábla, az ábra desc-je és a Működés nézet is ebből készül. viewBox 0 0 380 240. Bekötés nézet: balra fent a betáp (L, N, PE), középen fent a kötődoboz kilenc vezetékösszekötővel (L, N, PE, 1a, 2a, 1b, 2b, 1. lámpa, 2. lámpa), alul balra K1 (A hely), alul jobbra K2 (B hely), mindkettőn C1, 1a, 2a és C2, 1b, 2b kapocs, a két billentyű halványan elválasztva; K1-en a C1–C2 áthidaló külön kiemelve „áthidaló” felirattal; jobbra fent az 1. és a 2. lámpa (L, N, PE). Erek: L és áthidaló barna, váltóvezetékek szürkék („1a”, „2a”, „1b”, „2b” felirattal), kapcsolt fázisok feketék („1”, „2”), N kék, PE zöld alapon sárga csíkkal. Szerelési rajz nézet: a tervező két switch6 jele („6” felirat), egy kötődoboz és két lámpakiállás, érszám 3 / 5 / 6 / 3 / 3. Működés nézet: négy billentyűgomb (K1 és K2, billentyűnként; aria-pressed), lámpánként kiemelt áramút és szöveges állapot. Alsó sor: „Így látod a tervezőben: a PE egyszínű zöld.”]

## Vezetékek táblázatban

A váltóvezetékek itt szürkék, a kapcsolt fázisok feketék; a feliratok (1a, 2a az 1. lámpához, 1b, 2b a 2. lámpához) különböztetik meg őket.

<!-- sim:vezetekek src=kettos-valtokapcsolo-106-6-bekotese.netlist.json -->
| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | K1 (A hely): 1. billentyű közös kapcsa (C1) | L | barna | Kötődoboz – K1 (A hely) |
| 5 | K1 (A hely): 1. billentyű közös kapcsa (C1) | K1 (A hely): 2. billentyű közös kapcsa (C2) | áthidaló | barna | dobozon belül |
| 6 | K1 (A hely): 1a kapocs | Kötődoboz: 1a váltóvezeték kötése | váltóvezeték 1a | szürke | Kötődoboz – K1 (A hely) |
| 7 | K1 (A hely): 2a kapocs | Kötődoboz: 2a váltóvezeték kötése | váltóvezeték 2a | szürke | Kötődoboz – K1 (A hely) |
| 8 | K1 (A hely): 1b kapocs | Kötődoboz: 1b váltóvezeték kötése | váltóvezeték 1b | szürke | Kötődoboz – K1 (A hely) |
| 9 | K1 (A hely): 2b kapocs | Kötődoboz: 2b váltóvezeték kötése | váltóvezeték 2b | szürke | Kötődoboz – K1 (A hely) |
| 10 | Kötődoboz: 1a váltóvezeték kötése | K2 (B hely): 1a kapocs | váltóvezeték 1a | szürke | Kötődoboz – K2 (B hely) |
| 11 | Kötődoboz: 2a váltóvezeték kötése | K2 (B hely): 2a kapocs | váltóvezeték 2a | szürke | Kötődoboz – K2 (B hely) |
| 12 | Kötődoboz: 1b váltóvezeték kötése | K2 (B hely): 1b kapocs | váltóvezeték 1b | szürke | Kötődoboz – K2 (B hely) |
| 13 | Kötődoboz: 2b váltóvezeték kötése | K2 (B hely): 2b kapocs | váltóvezeték 2b | szürke | Kötődoboz – K2 (B hely) |
| 14 | K2 (B hely): 1. billentyű közös kapcsa (C1) | Kötődoboz: 1. lámpa kapcsoltfázis-kötése | kapcsolt fázis 1 | fekete | Kötődoboz – K2 (B hely) |
| 15 | K2 (B hely): 2. billentyű közös kapcsa (C2) | Kötődoboz: 2. lámpa kapcsoltfázis-kötése | kapcsolt fázis 2 | fekete | Kötődoboz – K2 (B hely) |
| 16 | Kötődoboz: 1. lámpa kapcsoltfázis-kötése | 1. lámpa: L (fázis) | kapcsolt fázis 1 | fekete | Kötődoboz – 1. lámpa |
| 17 | Kötődoboz: N-kötés | 1. lámpa: N | N | kék | Kötődoboz – 1. lámpa |
| 18 | Kötődoboz: PE-kötés | 1. lámpa: PE | PE | zöld-sárga | Kötődoboz – 1. lámpa |
| 19 | Kötődoboz: 2. lámpa kapcsoltfázis-kötése | 2. lámpa: L (fázis) | kapcsolt fázis 2 | fekete | Kötődoboz – 2. lámpa |
| 20 | Kötődoboz: N-kötés | 2. lámpa: N | N | kék | Kötődoboz – 2. lámpa |
| 21 | Kötődoboz: PE-kötés | 2. lámpa: PE | PE | zöld-sárga | Kötődoboz – 2. lámpa |
<!-- /sim:vezetekek -->

## Hogyan működik?

A kettős váltókapcsoló mindkét billentyűje egy-egy önálló váltókapcsoló: saját közös kapoccsal (C1, C2) és két kimenettel. A két K1–K2 billentyűpár úgy működik, mint két külön [[valtokapcsolo-106-bekotese|váltókapcsolás]]: az 1. lámpa akkor ég, ha a két 1. billentyű ugyanarra a váltóvezetékre áll, a 2. lámpa ugyanígy a két 2. billentyűtől függ. A két kör egymást nem befolyásolja. A szimuláció szerint mindkét körben a váltóvezeték-pár egyik ere minden állásban fázis alatt van, akkor is, ha egyik lámpa sem ég; a kikapcsolt lámpák tehát nem jelentik, hogy a dobozokban nincs feszültség.

A szimulátor mind a 16 állás-kombinációt végigszámolta. Mivel az egyik lámpa állapota a szimuláció szerint a másik kör billentyűitől független, a két kör táblázata külön is megadható:

<!-- sim:allapotok src=kettos-valtokapcsolo-106-6-bekotese.netlist.json vetites=E1:S1.b1,S2.b1 -->
| K1 (A hely) – 1. billentyű | K2 (B hely) – 1. billentyű | 1. lámpa |
|---|---|---|
| 0 (C1–1a) | 0 (C1–1a) | **ég** |
| 0 (C1–1a) | 1 (C1–2a) | nem ég |
| 1 (C1–2a) | 0 (C1–1a) | nem ég |
| 1 (C1–2a) | 1 (C1–2a) | **ég** |

_Vetített táblázat a(z) `kettos-valtokapcsolo-106-6` netlista teljes szimulációjából (ujjlenyomat: `837cd200`, 16 kapcsolóállás): a(z) 1. lámpa állapota a többi billentyűtől (K1 (A hely) – 2. billentyű, K2 (B hely) – 2. billentyű) minden állásban független._
<!-- /sim:allapotok -->

<!-- sim:allapotok src=kettos-valtokapcsolo-106-6-bekotese.netlist.json vetites=E2:S1.b2,S2.b2 -->
| K1 (A hely) – 2. billentyű | K2 (B hely) – 2. billentyű | 2. lámpa |
|---|---|---|
| 0 (C2–1b) | 0 (C2–1b) | **ég** |
| 0 (C2–1b) | 1 (C2–2b) | nem ég |
| 1 (C2–2b) | 0 (C2–1b) | nem ég |
| 1 (C2–2b) | 1 (C2–2b) | **ég** |

_Vetített táblázat a(z) `kettos-valtokapcsolo-106-6` netlista teljes szimulációjából (ujjlenyomat: `837cd200`, 16 kapcsolóállás): a(z) 2. lámpa állapota a többi billentyűtől (K1 (A hely) – 1. billentyű, K2 (B hely) – 1. billentyű) minden állásban független._
<!-- /sim:allapotok -->

**A két közös kapocs.** Az ábrán a betáp fázisa K1-nél az 1. billentyű közös kapcsára (C1) érkezik, és egy rövid áthidaló viszi tovább a 2. billentyű közös kapcsára (C2). Ahol a gyártó a két közös kapcsot belül összeköti, ez az áthidaló elmarad, de ilyenkor a két kör csak ugyanarról az áramkörről táplálható. Ha a két lámpakört két külön áramkörről táplálják, áthidaló nem kell (és nem is szabad), viszont mindkét kör nullavezetője a saját áramkörénél marad, a kötődobozban külön összekötőben. Ilyenkor a kapcsoló- és a kötődobozban két áramkör vezetői vannak: az egyik kismegszakító lekapcsolása nem teszi feszültségmentessé a dobozt, ezért munkavégzés előtt mindkét áramkört le kell választani, a kettős betáplálást pedig a dobozban és az elosztóban jelölni kell.

## Kapcsok és jelölésük

A kettős váltókapcsolónak hat kapcsa van, billentyűnként egy közös és két kimenő. A jelölés gyártónként eltérhet: előfordul L1 és L2 vagy C1 és C2 a közös kapcsokra, 1a–2a és 1b–2b vagy nyilak a kimenetekre, és van, ahol a két közös kapocs belül össze van kötve. Mindig a gyártói útmutató és a kapcsolóbetét rajza az irányadó.

## A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. **Feszültségmentesítés** az elosztóban, [[feszultsegmentesites-ot-szabalya|a feszültségmentesítés öt szabálya]] szerint, minden érintett áramkörre (a feszültségvizsgáló működését előtte és utána ismert feszültségforráson ellenőrizve).
2. **Azonosítás.** A négy váltóvezeték (1a, 2a, 1b, 2b) és a két kapcsolt fázis jelölése mindkét végen, mert színből nem különböztethetők meg.
3. **Kötődoboz.** A nullavezetők és a védővezetők egy-egy összekötőbe kerülnek a betáppal; a betáp fázisa a K1 felé menő érrel, a négy váltóvezeték a K1 és a K2 felé menő azonos jelű érrel, a két kapcsolt fázis a megfelelő lámpához menő érrel.
4. **K1.** A fázis C1-re, az áthidaló C1 és C2 közé (ha a gyártó belül nem kötötte össze), a váltóvezetékek a megfelelő kimenetekre.
5. **K2.** A váltóvezetékek a megfelelő kimenetekre, a két kapcsolt fázis C1-re, illetve C2-re.
6. **Lámpák.** A kapcsolt fázis az L, a nullavezető az N, a védővezető a PE kapocsra.
7. **Ellenőrzés visszakapcsolás előtt:** szemrevételezés, a védővezető folytonosságának, a szigetelési ellenállásnak és a polaritásnak a mérése, majd visszakapcsolás után a működéspróba a fenti két táblázat szerint.

## Jelölés az alaprajzon

A tervezőben a kettős váltókapcsoló is a váltókapcsoló jelét kapja (kör két ferde vonallal, alatta a 6-os szám); hogy kettős kivitelű, azt a szerelvény neve vagy megjegyzése rögzíti. A szerelési rajz szakaszonként mutatja az erek számát:

<!-- sim:szakaszok src=kettos-valtokapcsolo-106-6-bekotese.netlist.json -->
| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (A hely) | L (barna), váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke) | 5 |
| Kötődoboz – K2 (B hely) | váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke), kapcsolt fázis 1 (fekete), kapcsolt fázis 2 (fekete) | 6 |
| Kötődoboz – 1. lámpa | kapcsolt fázis 1 (fekete), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – 2. lámpa | kapcsolt fázis 2 (fekete), N (kék), PE (zöld-sárga) | 3 |
<!-- /sim:szakaszok -->

A kötődobozos megoldásban a második kapcsolóhoz hat ér megy. Ha a négy váltóvezeték a két kapcsolódoboz között közvetlenül fut, a kötődobozhoz kevesebb ér kell; a kapcsolás logikája ugyanaz. A védőcső vagy a kábel méretét az erek száma szerint kell megválasztani.

## Régi berendezésben

- **Két külön váltókapcsoló egy keretben.** Régebbi szerelésnél gyakori, hogy a „kettős” kapcsoló két önálló kapcsolóbetét; ilyenkor mindkettőt külön kell betáplálni vagy áthidalni.
- **Közös nullavezető két áramkörre.** Régi berendezésben előfordul, hogy két áramkör egy nullavezetőn osztozik. Ha felújításkor a két áramkör külön áram-védőkapcsolóra (FI-relére) kerül, ez kioldást okoz. Veszélyesebb, hogy az egyik áramkör lekapcsolása után a közös nullavezetőn a másik áramkör árama tovább folyik, így a megbontásakor áramütés érheti a szerelőt; ha pedig a két áramkör különböző fázisról kap táplálást, a közös nullavezető szakadásakor a két áramkör fogyasztói sorba kapcsolódva a két fázis közötti feszültségre kerülhetnek, ami a készülékeket túlfeszültséggel károsíthatja, és tüzet okozhat. A szétválasztás szakembert igényel.
- **Jelöletlen váltóvezetékek.** Négy azonos színű ér egy dobozban: a szerepük csak méréssel állapítható meg.
- **Védővezető nélküli lámpakiállás**, alumínium vezetők: lásd az [[egypolusu-kapcsolo-101-bekotese|egypólusú kapcsoló]] cikket.

## Gyakori hibák

- **Hiányzó áthidaló.** Ha a betáp csak C1-re kerül, és a két közös kapocs belül nincs összekötve, a szimuláció szerint a 2. lámpa egyik állásban sem gyullad ki.
- **Összekevert váltóvezeték-párok.** Ha a B helyen az 1a és az 1b váltóvezeték helyet cserél, a szimuláció szerint a két kör „összeakad”: az A hely mindkét billentyűje mindkét lámpára hat, és a B helyről egyik lámpa sem kapcsolható minden állásban.
- **Áthidaló két külön áramkör között.** Ha a két kört két áramkörről táplálják, a közös kapcsok áthidalása a két áramkört összeköti; ez tilos. Különböző fázisok között ez zárlat; azonos fázisnál a két áramkör egymást táplálja, így egyik kismegszakító lekapcsolása sem teszi feszültségmentessé a kört.
- **Két áramkör nullavezetőjének összekötése** a kötődobozban.
- **Zöld-sárga ér váltóvezetékként,** vagy jelöletlen kék ér fázisként.
- **Laza kötés** a közös kapcson vagy az áthidalón: mindkét lámpa egyszerre kimarad.

## Mikor hívj szakembert?

- Mindig, ha kapcsolót, lámpát vagy kötést kell bekötni, cserélni vagy áthelyezni.
- Ha az egyik billentyű a másik lámpára is hat, vagy egy lámpa csak bizonyos állásokban kapcsolható.
- Ha kapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a két lámpakört külön áramkörről szeretnéd táplálni.
- Ha a kapcsoló vagy a doboz meleg, elszíneződött, recseg, vagy égett szagot érzel.
