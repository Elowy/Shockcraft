---
slug: keresztkapcsolo-107-bekotese
title: "Keresztkapcsoló (107) bekötése: egy lámpa három vagy több helyről"
navTitle: "Keresztkapcsoló (107)"
summary: "Egy lámpa három vagy több helyről: két váltókapcsoló (106) közé keresztkapcsolók (107) kerülnek. Működés, kapocspárok, érszám és a jellemző bekötési hibák."
section: semak
category: kapcsolasok
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [107, keresztkapcsoló, kereszt váltókapcsoló, közbenső kapcsoló, három helyről kapcsolás, több helyről kapcsolás, váltóvezeték, 106 és 107, lépcsőház világítás]
synonyms: [kereszt kapcsoló, keresztváltó, kereszt váltó, közbenső kapcsoló, 107-es kapcsoló, lámpa három kapcsolóval, három helyről kapcsolható lámpa, keresztkapcsoló bekötése]
plannerKinds: [switch7]
related: [vilagitasi-kapcsolasok, valtokapcsolo-106-bekotese, kettos-valtokapcsolo-106-6-bekotese, vezetekek-szinjelolese, feszultsegmentesites-ot-szabalya]
calculators: [aram-teljesitmenybol]
figures:
  - id: abra-1
    netlist: keresztkapcsolo-107-bekotese.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
    variants:
      - keresztkapcsolo-107-bekotese-2x107.netlist.json
      - keresztkapcsolo-107-bekotese-3x107.netlist.json
      - keresztkapcsolo-107-bekotese-4x107.netlist.json
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

**Röviden:** Három vagy több helyről úgy kapcsolható egy lámpa, hogy a két szélső helyre váltókapcsoló (106), minden közbenső helyre egy keresztkapcsoló (107) kerül. A keresztkapcsoló a két váltóvezetéket egyenesen vagy keresztezve vezeti tovább, ezért bármelyik kapcsoló átváltása megfordítja a lámpa állapotát. Három helyhez tehát két 106-os és egy 107-es kapcsoló kell, minden további helyhez még egy 107-es.

[ÁBRA: abra-1 „Keresztkapcsolás: 106 + 107 + 106”. Forrás: keresztkapcsolo-107-bekotese.netlist.json (id: keresztkapcsolo-107); a változatválasztó (1–4 db 107) a -2x107, -3x107 és -4x107 netlistát tölti be. Mindegyikből készül a rajz, a vezetéktábla, az ábra desc-je és a Működés nézet. viewBox 0 0 380 240. Bekötés nézet: balra fent a betáp (L, N, PE), középen fent a kötődoboz (L, N, PE, 1a–2a, 1b–2b, kapcsolt fázis), alul balról jobbra K1 (106: C, 1, 2), X1 (107: A1, A2 felül, B1, B2 alul, a két belső állást két vékony segédvonal jelzi), K2 (106); jobbra fent a lámpa. Erek: L barna, váltóvezetékek szürkék („1a”, „2a”, „1b”, „2b” felirattal), kapcsolt fázis fekete, N kék, PE zöld alapon sárga csíkkal; az aktuális áramút vastagabb. Szerelési rajz nézet: két switch6 és egy switch7 jel („6”, „7”, „6” felirat), kötődoboz, lámpakiállás; érszám 3 / 3 / 4 / 3 / 3. Működés nézet: gombonként egy kapcsoló (aria-pressed; a 107-esnél „egyenes” / „keresztezett” felirat), kiemelt áramút, szöveges állapot, alatta a kapcsolóállás-táblázat. Alsó sor: „Így látod a tervezőben: a PE egyszínű zöld.”]

## Vezetékek táblázatban

Egy keresztkapcsolós (három helyről kapcsolt) változat. A váltóvezetékek szürkék; az „a” jelű pár a K1 és az X1, a „b” jelű pár az X1 és a K2 között fut.

<!-- sim:vezetekek src=keresztkapcsolo-107-bekotese.netlist.json -->
| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | K1 (106, 1. hely): közös kapocs (C) | L | barna | Kötődoboz – K1 (1. hely) |
| 5 | K1 (106, 1. hely): 1-es kapocs | Kötődoboz: 1a váltóvezeték kötése | váltóvezeték 1a | szürke | Kötődoboz – K1 (1. hely) |
| 6 | K1 (106, 1. hely): 2-es kapocs | Kötődoboz: 2a váltóvezeték kötése | váltóvezeték 2a | szürke | Kötődoboz – K1 (1. hely) |
| 7 | Kötődoboz: 1a váltóvezeték kötése | X1 (107, 2. hely): A1 (bemenő pár) | váltóvezeték 1a | szürke | Kötődoboz – X1 (2. hely) |
| 8 | Kötődoboz: 2a váltóvezeték kötése | X1 (107, 2. hely): A2 (bemenő pár) | váltóvezeték 2a | szürke | Kötődoboz – X1 (2. hely) |
| 9 | X1 (107, 2. hely): B1 (kimenő pár) | Kötődoboz: 1b váltóvezeték kötése | váltóvezeték 1b | szürke | Kötődoboz – X1 (2. hely) |
| 10 | X1 (107, 2. hely): B2 (kimenő pár) | Kötődoboz: 2b váltóvezeték kötése | váltóvezeték 2b | szürke | Kötődoboz – X1 (2. hely) |
| 11 | Kötődoboz: 1b váltóvezeték kötése | K2 (106, 3. hely): 1-es kapocs | váltóvezeték 1b | szürke | Kötődoboz – K2 (3. hely) |
| 12 | Kötődoboz: 2b váltóvezeték kötése | K2 (106, 3. hely): 2-es kapocs | váltóvezeték 2b | szürke | Kötődoboz – K2 (3. hely) |
| 13 | K2 (106, 3. hely): közös kapocs (C) | Kötődoboz: kapcsoltfázis-kötés | kapcsolt fázis | fekete | Kötődoboz – K2 (3. hely) |
| 14 | Kötődoboz: kapcsoltfázis-kötés | Lámpa: L (fázis) | kapcsolt fázis | fekete | Kötődoboz – lámpa |
| 15 | Kötődoboz: N-kötés | Lámpa: N | N | kék | Kötődoboz – lámpa |
| 16 | Kötődoboz: PE-kötés | Lámpa: PE | PE | zöld-sárga | Kötődoboz – lámpa |
<!-- /sim:vezetekek -->

## Hogyan működik?

Az első váltókapcsoló (K1) a fázist az 1-es vagy a 2-es váltóvezetékre teszi. A keresztkapcsolónak négy kapcsa van: egy bemenő pár (A1, A2) és egy kimenő pár (B1, B2). „Egyenes” állásban az A1-et a B1-gyel és az A2-t a B2-vel, „keresztezett” állásban az A1-et a B2-vel és az A2-t a B1-gyel köti össze. Az utolsó váltókapcsoló (K2) a lámpát az egyik vezetékre köti. A lámpa akkor ég, ha a fázis éppen azon a vezetéken érkezik, amelyikre K2 áll. Bármelyik kapcsoló átváltása a fázist a másik vezetékre teszi, ezért mindig megfordítja a lámpa állapotát.

<!-- sim:allapotok src=keresztkapcsolo-107-bekotese.netlist.json -->
| K1 (106, 1. hely) | X1 (107, 2. hely) | K2 (106, 3. hely) | Lámpa |
|---|---|---|---|
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | **ég** |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | **ég** |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | **ég** |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | **ég** |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | nem ég |

_A táblázatot a szimulátor számolta a(z) `keresztkapcsolo-107` netlistából (ujjlenyomat: `835f0537`): 8 kapcsolóállás, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig folytonos, és nem halad át kapcsolón; kikapcsolt állásban a lámpa fázisoldali kapcsa nem kap fázist; a nullavezető egyik állásban sem halad át kapcsolón. Lámpa: bármelyik kapcsoló átváltása megfordítja az állapotát._
<!-- /sim:allapotok -->

**A kikapcsolt lámpa mellett is van feszültség.** A szimuláció szerint – egy–négy keresztkapcsolónál egyaránt – minden szakaszban a váltóvezeték-pár egyik ere minden állásban fázis alatt van, a lámpa állapotától függetlenül. Egyetlen kapcsoló- vagy kötődoboz sem tekinthető feszültségmentesnek csak azért, mert a lámpa nem ég.

A keresztkapcsolók száma tetszőlegesen növelhető, a működés elve nem változik. A szimulátor az egy–négy keresztkapcsolós változat minden kapcsolóállását végigszámolta:

<!-- sim:valtozatok src=keresztkapcsolo-107-bekotese.netlist.json src=keresztkapcsolo-107-bekotese-2x107.netlist.json src=keresztkapcsolo-107-bekotese-3x107.netlist.json src=keresztkapcsolo-107-bekotese-4x107.netlist.json -->
| Változat | Kapcsolók | Kapcsolási helyek | Kapcsolóállások | Egy kapcsoló átváltása mindig vált | Szimuláció |
|---|---|---|---|---|---|
| Keresztkapcsolás (106 + 107 + 106): egy lámpa három helyről | 106 + 107 + 106 | 3 | 8 | igen | PASS (`835f0537`) |
| Keresztkapcsolás (106 + 2 × 107 + 106): egy lámpa 4 helyről | 106 + 107 + 107 + 106 | 4 | 16 | igen | PASS (`9566473c`) |
| Keresztkapcsolás (106 + 3 × 107 + 106): egy lámpa 5 helyről | 106 + 107 + 107 + 107 + 106 | 5 | 32 | igen | PASS (`f9fd89d8`) |
| Keresztkapcsolás (106 + 4 × 107 + 106): egy lámpa 6 helyről | 106 + 107 + 107 + 107 + 107 + 106 | 6 | 64 | igen | PASS (`e67cbcc6`) |
<!-- /sim:valtozatok -->

**Sok kapcsolási hely.** Minden további hely egy újabb keresztkapcsolót és egy négyeres szakaszt jelent. Sok helynél (például hosszú folyosón vagy lépcsőházban) gyakran egyszerűbb a nyomógombos, impulzusrelés (léptetőrelés) vagy lépcsőházi automatás megoldás, ahol a nyomógombok párhuzamosan köthetők. Ezek bekötése külön téma; a választásról a [[vilagitasi-kapcsolasok|Világítási kapcsolások]] oldal szól.

## Kapcsok és jelölésük

A keresztkapcsoló két kapocspárja gyártónként másképp helyezkedik el: van, ahol a bemenő pár felül, a kimenő alul van, van, ahol egymással átlósan, és van, ahol nyilak vagy számok jelölik. A pár tagjai közötti különbség kívülről nem látszik, ezért a bekötés előtt mindig a gyártói rajzot kell megnézni, vagy a párokat a még be nem kötött kapcsolón, folytonosságméréssel azonosítani. A kapocsjelölés tehát gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

A két szélső helyre váltókapcsoló kerül. A keresztkapcsoló négy kapcsából hármat használva elvben váltókapcsolóként is működhet, de csak a kapocspárok pontos ismeretében, és ha a gyártó ezt megengedi; a szimuláció szerint rossz kapocsválasztásnál a lámpa bizonyos állásokban nem kapcsolható. Jó kapocsválasztásnál is igaz, hogy a szabadon maradó negyedik kapocs a szimuláció szerint bizonyos állásokban fázis alá kerül, ezért más vezető nem köthető rá, toldásra vagy továbbkötésre sem használható.

## A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. **Feszültségmentesítés** az elosztóban, [[feszultsegmentesites-ot-szabalya|a feszültségmentesítés öt szabálya]] szerint (a feszültségvizsgáló működését előtte és utána ismert feszültségforráson ellenőrizve). A lámpa kikapcsolt állapota nem elég: a váltóvezetékek egyike ilyenkor is fázis alatt van. A kötődobozban és a kapcsolódobozokban más áramkör vezetői is lehetnek.
2. **Azonosítás.** Minden váltóvezeték-pár jelölése mindkét végen (például 1a, 2a, 1b, 2b), mert színből nem különböztethetők meg.
3. **Kötődoboz.** A nullavezetők és a védővezetők egy-egy összekötőbe kerülnek a betáppal; a betáp fázisa a K1 felé, az „a” pár a K1 és az X1, a „b” pár az X1 és a K2 felé menő azonos jelű érrel; a K2-ről visszatérő kapcsolt fázis a lámpa felé menő érrel kerül össze.
4. **K1 (106).** A fázis a közös kapocsra, az „a” pár az 1-es és a 2-es kapocsra.
5. **X1 (107).** Az „a” pár a bemenő párra (A1, A2), a „b” pár a kimenő párra (B1, B2), a gyártói rajz szerint.
6. **K2 (106).** A „b” pár az 1-es és a 2-es kapocsra, a kapcsolt fázis a közös kapocsra.
7. **Lámpa.** A kapcsolt fázis az L, a nullavezető az N, a védővezető a PE kapocsra.
8. **Ellenőrzés visszakapcsolás előtt:** szemrevételezés, a védővezető folytonosságának, a szigetelési ellenállásnak és a polaritásnak a mérése, majd visszakapcsolás után a működéspróba: minden kapcsoló minden állásában a fenti táblázat szerint.

## Jelölés az alaprajzon

A tervezőben a keresztkapcsoló jele kör két ferde vonallal, alatta a 7-es számmal (107 → 7); a két szélső helyen a váltókapcsoló 6-os jele áll. A szerelési rajz szakaszonként mutatja az erek számát:

<!-- sim:szakaszok src=keresztkapcsolo-107-bekotese.netlist.json -->
| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (1. hely) | L (barna), váltóvezeték 1a (szürke), váltóvezeték 2a (szürke) | 3 |
| Kötődoboz – X1 (2. hely) | váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke) | 4 |
| Kötődoboz – K2 (3. hely) | váltóvezeték 1b (szürke), váltóvezeték 2b (szürke), kapcsolt fázis (fekete) | 3 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |
<!-- /sim:szakaszok -->

A keresztkapcsolóhoz négy ér megy (két bemenő és két kimenő váltóvezeték). Ha a váltóvezetékek a kapcsolódobozok között közvetlenül futnak, a kötődoboz kimarad, a szakaszonkénti érszám pedig változik; a kapcsolás logikája ugyanaz.

## Régi berendezésben

- **Jelöletlen kapocspárok.** A régi keresztkapcsolókon a párok gyakran nincsenek jelölve; a régi bekötés sem biztos, hogy helyes volt.
- **Hosszú, vegyes színű váltóvezetékek.** Régi épületekben a több szinten átvezetett váltóvezetékek színe bármi lehet (kék is), és a toldások helye sem mindig ismert. Lépcsőházban a világítás gyakran a közös hálózatról, a lakás elosztójától függetlenül kap táplálást.
- **Védővezető nélküli lámpakiállás**, alumínium vezetők, szigetelőszalagos kötések: lásd az [[egypolusu-kapcsolo-101-bekotese|egypólusú kapcsoló]] cikket.

## Gyakori hibák

- **Összekevert kapocspárok a keresztkapcsolón.** Ha a bemenő pár egyik vezetéke a kimenő párra kerül (például az „a” pár az A1 és a B1 kapcsra), a szimuláció szerint a keresztkapcsoló „egyenes” állásában a lámpa egyik helyről sem kapcsolható be, „keresztezett” állásában viszont látszólag rendben működik. Ez a hiba ezért gyakran csak később derül ki.
- **Keresztkapcsoló a sor végén, rosszul bekötve.** Ha a két váltóvezeték a keresztkapcsolón egy átkötés két végére kerül (például az A1 és a B1 kapocsra), a szimuláció szerint a kapcsoló „egyenes” állásában a lámpa egyik helyről sem kapcsolható be.
- **Felcserélt vezetők egy páron belül.** Ha egy pár két vezetéke helyet cserél, a kapcsolás a szimuláció szerint ugyanúgy működik, csak az állások értelmezése fordul meg. Ez nem hiba.
- **Zöld-sárga ér váltóvezetékként,** vagy jelöletlen kék ér fázisként.
- **Kikapcsolva derengő LED-lámpa.** A hosszú, egymás mellett futó váltóvezetékek kapacitív csatolása itt gyakoribb, mint a rövid kapcsolásoknál; jelzőfényes kapcsoló is okozhatja. Az okot szakember méréssel keresi meg.
- **Laza kötés** valamelyik keresztkapcsolón: a lámpa bizonyos állásokban egyik helyről sem kapcsolható.

## Mikor hívj szakembert?

- Mindig, ha kapcsolót, lámpát vagy kötést kell bekötni, cserélni vagy áthelyezni.
- Ha a lámpa valamelyik kapcsoló bizonyos állásában egyik helyről sem kapcsolható.
- Ha a lámpa kikapcsolva dereng vagy villog, vagy kapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a kapcsoló vagy a doboz meleg, elszíneződött, recseg, vagy égett szagot érzel.
- Ha négynél több helyről szeretnéd kapcsolni a lámpát, és mérlegelnéd a nyomógombos, impulzusrelés megoldást.
