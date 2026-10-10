---
slug: valtokapcsolo-106-bekotese
title: "Váltókapcsoló (106) bekötése: egy lámpa két helyről"
navTitle: "Váltókapcsoló (106)"
summary: "Két váltókapcsolóval (106) egy lámpa két helyről kapcsolható. Közös kapocs, váltóvezetékek, kapcsolóállás-táblázat, érszám és a jellemző bekötési hibák."
section: semak
category: kapcsolasok
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [106, váltókapcsoló, alternatív kapcsoló, korrespondáló kapcsolás, két helyről kapcsolás, váltóvezeték, közös kapocs, folyosó világítás, lépcső világítás]  # lektor: az „alternatív” és a „korrespondáló” elnevezés hazai használata ellenőrizendő
synonyms: [váltó kapcsoló, alternatív kapcsoló, korrespondáló kapcsoló, 106-os kapcsoló, két helyről kapcsolható lámpa, lámpa két kapcsolóval, váltókapcsoló bekötése, kapcsolás két helyről]
plannerKinds: [switch6]
related: [vilagitasi-kapcsolasok, keresztkapcsolo-107-bekotese, kettos-valtokapcsolo-106-6-bekotese, egypolusu-kapcsolo-101-bekotese, vezetekek-szinjelolese, feszultsegmentesites-ot-szabalya]
calculators: [aram-teljesitmenybol]
figures:
  - id: abra-1
    netlist: valtokapcsolo-106-bekotese.netlist.json
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

**Röviden:** Két váltókapcsolóval (106) egy lámpa két helyről kapcsolható, például a folyosó két végéről vagy a hálószoba ajtajától és az ágy mellől. A betáp fázisa az első kapcsoló közös kapcsára kerül, a két kapcsoló 1-es és 2-es kapcsait két váltóvezeték köti össze, a második kapcsoló közös kapcsáról pedig a kapcsolt fázis megy a lámpához. Bármelyik kapcsoló átváltása megfordítja a lámpa állapotát.

[ÁBRA: abra-1 „Váltókapcsolás két 106-os kapcsolóval”. Forrás: valtokapcsolo-106-bekotese.netlist.json (id: valtokapcsolo-106); a rajz, a vezetéktábla, az ábra desc-je és a Működés nézet is ebből készül. viewBox 0 0 360 240. Bekötés nézet: balra fent a betáp (L, N, PE), középen fent a kötődoboz hat vezetékösszekötővel (L, N, PE, 1-es és 2-es váltóvezeték, kapcsolt fázis), alul balra a K1 (A hely), alul jobbra a K2 (B hely) kapcsoló, mindkettőn C, 1, 2 kapocs, a közös kapocs (C) kiemelve; jobbra fent a lámpa (L, N, PE). Erek: L barna, váltóvezetékek szürkék „1” és „2” felirattal, kapcsolt fázis fekete, N kék, PE zöld alapon sárga csíkkal; az aktuális áramút vastagabb. Szerelési rajz nézet: alaprajz a tervező két switch6 jelével („6” felirat), kötődobozzal és lámpakiállással, érszám 3 / 3 / 3 / 3. Működés nézet: két billentyűgomb (K1, K2; aria-pressed), kiemelt áramút a fázistól a lámpán át a nulláig, szöveges állapot, alatta a kapcsolóállás-táblázat. Alsó sor: „Így látod a tervezőben: a PE egyszínű zöld.”]

## Vezetékek táblázatban

A váltóvezetékek itt mindkét szakaszban szürkék, és az „1”, illetve „2” felirat különbözteti meg őket; a fázisszínek közötti választás nem kötött.

<!-- sim:vezetekek src=valtokapcsolo-106-bekotese.netlist.json -->
| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | K1 (A hely): közös kapocs (C) | L | barna | Kötődoboz – K1 (A hely) |
| 5 | K1 (A hely): 1-es kapocs | Kötődoboz: 1-es váltóvezeték kötése | váltóvezeték 1 | szürke | Kötődoboz – K1 (A hely) |
| 6 | K1 (A hely): 2-es kapocs | Kötődoboz: 2-es váltóvezeték kötése | váltóvezeték 2 | szürke | Kötődoboz – K1 (A hely) |
| 7 | Kötődoboz: 1-es váltóvezeték kötése | K2 (B hely): 1-es kapocs | váltóvezeték 1 | szürke | Kötődoboz – K2 (B hely) |
| 8 | Kötődoboz: 2-es váltóvezeték kötése | K2 (B hely): 2-es kapocs | váltóvezeték 2 | szürke | Kötődoboz – K2 (B hely) |
| 9 | K2 (B hely): közös kapocs (C) | Kötődoboz: kapcsoltfázis-kötés | kapcsolt fázis | fekete | Kötődoboz – K2 (B hely) |
| 10 | Kötődoboz: kapcsoltfázis-kötés | Lámpa: L (fázis) | kapcsolt fázis | fekete | Kötődoboz – lámpa |
| 11 | Kötődoboz: N-kötés | Lámpa: N | N | kék | Kötődoboz – lámpa |
| 12 | Kötődoboz: PE-kötés | Lámpa: PE | PE | zöld-sárga | Kötődoboz – lámpa |
<!-- /sim:vezetekek -->

## Hogyan működik?

A váltókapcsolónak három kapcsa van: egy közös (C) és két kimenő (1 és 2). A billentyű a közös kapcsot hol az 1-es, hol a 2-es kimenettel köti össze; „ki” állása nincs. Az első kapcsoló (K1) így a fázist az 1-es vagy a 2-es váltóvezetékre teszi, a második (K2) pedig a lámpát az 1-es vagy a 2-es váltóvezetékre köti. A lámpa akkor ég, ha a két kapcsoló ugyanarra a váltóvezetékre áll. Egyes szakmai szövegek alternatív vagy korrespondáló kapcsolásnak is nevezik.

<!-- sim:allapotok src=valtokapcsolo-106-bekotese.netlist.json -->
| K1 (A hely) | K2 (B hely) | Lámpa |
|---|---|---|
| 0 (közös–1) | 0 (közös–1) | **ég** |
| 0 (közös–1) | 1 (közös–2) | nem ég |
| 1 (közös–2) | 0 (közös–1) | nem ég |
| 1 (közös–2) | 1 (közös–2) | **ég** |

_A táblázatot a szimulátor számolta a(z) `valtokapcsolo-106` netlistából (ujjlenyomat: `909db559`): 4 kapcsolóállás, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig folytonos, és nem halad át kapcsolón; kikapcsolt állásban a lámpa fázisoldali kapcsa nem kap fázist; a nullavezető egyik állásban sem halad át kapcsolón. Lámpa: bármelyik kapcsoló átváltása megfordítja az állapotát._
<!-- /sim:allapotok -->

A táblázatból az is látszik, hogy a billentyű állása önmagában nem mutatja, ég-e a lámpa: ugyanaz az állás a másik kapcsoló helyzetétől függően lehet „be” vagy „ki”. A nullavezető és a védővezető a kötődobozban közvetlenül jut a lámpához; egyik kapcsolón sem halad át.

**A kikapcsolt lámpa mellett is van feszültség.** A szimuláció szerint a két váltóvezeték közül minden állásban pontosan az egyik fázis alatt van, akkor is, ha a lámpa nem ég; az első kapcsoló közös kapcsa pedig mindig fázist kap. A kikapcsolt lámpa tehát semmit nem árul el arról, hogy a kapcsolódobozokban és a kötődobozban van-e feszültség: munkavégzés előtt az áramkört az elosztóban kell leválasztani.

Ha a két váltóvezetéket az egyik kapcsolónál felcserélik (1-es a 2-esre), a kapcsolás a szimuláció szerint ugyanúgy működik, csak az állások értelmezése fordul meg. Ez nem hiba.

## Kapcsok és jelölésük

A közös kapocs jelölése gyártónként eltér: lehet L, P, C, egy eltérő színű csavar vagy egy külön nyíl. A két kimenet többnyire 1 és 2, vagy két nyíl. A közös kapocs helye sem egységes: nem mindig középen van. A gyártói útmutató és a kapcsolóbetét hátoldali rajza az irányadó; enélkül a közös kapcsot a még be nem kötött kapcsolón, folytonosságméréssel kell azonosítani.

A váltókapcsoló egypólusú kapcsolóként is beköthető (a fázis a közös kapocsra, a kapcsolt fázis az egyik kimenetre), ezért sok gyártó csak ezt forgalmazza. Fordítva nem működik: két egypólusú kapcsolóval váltókapcsolás nem építhető.

## A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. **Feszültségmentesítés** az elosztóban, [[feszultsegmentesites-ot-szabalya|a feszültségmentesítés öt szabálya]] szerint (a feszültségvizsgáló működését előtte és utána ismert feszültségforráson ellenőrizve). A lámpa kikapcsolt állapota nem elég: a váltóvezetékek egyike ilyenkor is fázis alatt van. A kötődobozban és a két kapcsolódobozban más áramkör vezetői is lehetnek.
2. **Azonosítás.** A betáp vezetőinek, a két váltóvezetéknek és a lámpához menő kapcsolt fázisnak az azonosítása és jelölése mindkét végen.
3. **Kötődoboz.** A betáp nullavezetője a lámpa nullavezetőjével, a védővezető a lámpa védővezetőjével kerül egy-egy összekötőbe. A betáp fázisa a K1 közös kapcsához menő érrel, a két váltóvezeték a K1 és a K2 felé menő azonos számú érrel, a K2 közös kapcsáról visszatérő kapcsolt fázis a lámpához menő érrel kerül össze.
4. **Kapcsolók.** K1-en a fázis a közös kapocsra, a két váltóvezeték az 1-es és a 2-es kapocsra; K2-n a két váltóvezeték az 1-es és a 2-es kapocsra, a kapcsolt fázis a közös kapocsra.
5. **Lámpa.** A kapcsolt fázis az L, a nullavezető az N, a védővezető a PE kapocsra.
6. **Ellenőrzés visszakapcsolás előtt:** szemrevételezés, valamint a védővezető folytonosságának, a szigetelési ellenállásnak és a polaritásnak a mérése; a szakember dokumentálja.
7. **Működéspróba:** mind a négy állás-kombináció a fenti táblázat szerint működik, és bármelyik kapcsoló átváltása megfordítja a lámpa állapotát.

A váltóvezetékek a kötődoboz kihagyásával, a két kapcsolódoboz között közvetlenül is futhatnak; a kapcsolás logikája és a táblázat ilyenkor is ugyanaz, csak a szakaszok érszáma változik.

## Jelölés az alaprajzon

A tervezőben a váltókapcsoló jele kör két ferde vonallal, alatta a 6-os számmal (106 → 6); egy váltókapcsolásnál két ilyen jel szerepel. A szerelési rajz szakaszonként mutatja az erek számát:

<!-- sim:szakaszok src=valtokapcsolo-106-bekotese.netlist.json -->
| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (A hely) | L (barna), váltóvezeték 1 (szürke), váltóvezeték 2 (szürke) | 3 |
| Kötődoboz – K2 (B hely) | váltóvezeték 1 (szürke), váltóvezeték 2 (szürke), kapcsolt fázis (fekete) | 3 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |
<!-- /sim:szakaszok -->

A kapcsolókhoz menő szakaszokban nincs nullavezető. Ha ide háromeres kábel kerül, a zöld-sárga ér akkor is csak védővezető lehet, a kék ér pedig csak a végein tartósan jelölve szolgálhat fázis- vagy váltóvezetőként.

## Régi berendezésben

- **Jelöletlen közös kapocs.** A régi váltókapcsolók kapcsai gyakran jelöletlenek; csere előtt a régi bekötés sem biztos, hogy helyes volt.
- **Nullavezető a váltóvezetékek között.** Ha egy régi kapcsolódobozban a váltóvezetékek mellett nullavezetőt találsz, az hibás vagy ma nem elfogadott bekötésre utalhat. A szimuláció szerint, ha az egyik váltóvezeték a nullához kapcsolódik, bizonyos kapcsolóállásban zárlat keletkezik; ha pedig a váltóvezetékeken fázis és nulla fut, és a lámpa a két kapcsoló közös kapcsa közé kerül, zárlat nincs, de az egyik kikapcsolt állásban a lámpa mindkét kapcsa fázis alatt van. Ezt szakembernek kell felmérnie.
- **Védővezető nélküli lámpakiállás**, alumínium vezetők, szigetelőszalagos kötések a kapcsolódobozban: ugyanazok a kockázatok, mint az [[egypolusu-kapcsolo-101-bekotese|egypólusú kapcsolónál]].
- **Megbízhatatlan színek.** A régi kábelekben a váltóvezetékek bármilyen színűek lehetnek, akár kékek is: egy régi dobozban talált kék ér lehet fázis alatt álló váltóvezeték.

## Gyakori hibák

- **A betáp nem a közös kapocsra került.** A szimuláció szerint, ha a fázis az első kapcsoló 1-es kapcsára jut a közös helyett, a négy állás-kombinációból csak egyben ég a lámpa: az első kapcsoló egyszerű be-ki kapcsolóként viselkedik, a második pedig csak akkor működik, ha az első egy bizonyos állásban van. Ugyanez a tünet, ha a második kapcsolón a kapcsolt fázis nem a közös kapocsról indul.
- **Zöld-sárga ér váltóvezetékként.** Tilos; a zöld-sárga ér csak védővezető lehet.
- **Jelöletlen kék ér váltóvezetékként.** A következő szerelő nullavezetőnek nézheti.
- **A lámpa fázisa a kötődobozban a betáp fázisára kerül** a K2 közös kapcsáról visszatérő kapcsolt fázis helyett: a lámpa folyamatosan ég, egyik kapcsoló sem hat rá.
- **Kikapcsolva derengő LED-lámpa.** Hosszú, egymás mellett futó váltóvezetékeknél a kapacitív csatolás kis áramot juttathat a lámpára; jelzőfényes kapcsoló is okozhatja. Az okot szakember méréssel keresi meg.
- **Laza kötés** a közös kapcson: a lámpa egyik helyről sem kapcsolható megbízhatóan.

## Mikor hívj szakembert?

- Mindig, ha kapcsolót, lámpát vagy kötést kell bekötni, cserélni vagy áthelyezni.
- Ha a lámpa csak az egyik kapcsolóról vagy csak bizonyos állásokban kapcsolható.
- Ha a lámpa kikapcsolva dereng vagy villog, vagy kapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a kapcsoló vagy a doboz meleg, elszíneződött, recseg, vagy égett szagot érzel.
- Ha három vagy több helyről szeretnéd kapcsolni a lámpát (lásd: [[keresztkapcsolo-107-bekotese|Keresztkapcsoló (107) bekötése]]), vagy okoskapcsolót építenél be.
