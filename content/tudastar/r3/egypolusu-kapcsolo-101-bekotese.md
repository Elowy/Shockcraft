---
slug: egypolusu-kapcsolo-101-bekotese
title: "Egypólusú kapcsoló (101) bekötése: egy lámpa egy helyről"
navTitle: "Egypólusú kapcsoló (101)"
summary: "Hogyan kerül be az egypólusú (101-es) kapcsoló a világítási áramkörbe? Kapcsolt fázis, kötődoboz, kapcsolóállások, gyakori hibák és régi berendezések."
section: semak
category: kapcsolasok
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [101, egypólusú kapcsoló, villanykapcsoló, kapcsoló bekötése, kapcsolt fázis, kötődoboz, lámpa bekötése, fázis bontása, világítási áramkör]
synonyms: [egysarkú kapcsoló, sima kapcsoló, egyszerű kapcsoló, 101-es kapcsoló, villanykapcsoló bekötése, lámpakapcsoló, kapcsoló fázis vagy nulla]
plannerKinds: [switch1]
related: [vilagitasi-kapcsolasok, ketpolusu-kapcsolo-102-bekotese, csillarkapcsolo-105-bekotese, valtokapcsolo-106-bekotese, vezetekek-szinjelolese, lampafoglalatok-es-lampatalpak, feszultsegmentesites-ot-szabalya, foldelesi-rendszerek]
calculators: [aram-teljesitmenybol]
figures:
  - id: abra-1
    netlist: egypolusu-kapcsolo-101-bekotese.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
sources:
  - standard: "MSZ HD 60364-5-537 (leválasztás és kapcsolás)"
    kiadás: "2017 (HD 60364-5-537:2016)" # lektor ellenőrizze a honosítás évét és a hatályos kiadást
    pont: "537 – az üzemi (funkcionális) kapcsolásról szóló alpont: egypólusú kapcsolókészülék nem kerülhet a nullavezetőbe" # a pontos alpontszámot lektor adja meg
  - standard: "MSZ HD 60364-5-559 (lámpatestek és világítási berendezések)"
    kiadás: "2012 (HD 60364-5-559:2012)" # lektor ellenőrizze
    pont: "a menetes lámpafoglalat bekötéséről szóló alpont (fázisvezető a középső érintkezőre)" # pontszám lektorra vár
  - standard: "MSZ HD 60364-5-51"
    kiadás: "2010" # lektor ellenőrizze
    pont: "514.3 (vezetők azonosítása)" # lektor: a kék ér kapcsolt fázisként (nullavezető nélküli, a kapcsolóhoz menő szakaszban, végjelöléssel) – a feltétel hazai értelmezése ellenőrizendő
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

**Röviden:** Az egypólusú kapcsoló (101) egy lámpát vagy lámpacsoportot kapcsol egy helyről. A fázisvezetőt bontja: a betáp fázisa a kapcsoló egyik kapcsára, a lámpához menő kapcsolt fázis a másikra kerül, a nulla- és a védővezető pedig a kapcsolót elkerülve, a kötődobozban jut a lámpához. Így kikapcsolt állásban a lámpa foglalata nem kap fázist, de ettől még nem feszültségmentes: lámpacseréhez és szereléshez az áramkört az elosztóban kell leválasztani.

[ÁBRA: abra-1 „Egypólusú kapcsoló (101) bekötése kötődobozzal”. Forrás: egypolusu-kapcsolo-101-bekotese.netlist.json (id: egypolusu-kapcsolo-101); a rajz, a vezetéktábla, az ábra desc-je és a Működés nézet is ebből készül, kézzel nem rajzolható át. viewBox 0 0 360 240, elhelyezés a netlista layout mezője szerint. Bekötés nézet: balra fent a betáp (L, N, PE), középen fent a kötődoboz négy vezetékösszekötővel (L, N, PE, kapcsolt fázis), alatta a 101-es kapcsoló két kapoccsal (L, 1), jobbra fent a lámpa (L, N, PE). Minden éren felirat és szín: L barna, kapcsolt fázis fekete, N kék, PE zöld alapon sárga csíkkal; a kapcsolt áramút vastagabb. Szerelési rajz nézet: alaprajzi elrendezés a tervező jeleivel (lámpakiállás, kötődoboz, switch1 jel „1” felirattal), szakaszonként érszám-vonalkákkal (3 / 2 / 3, a szakasztáblázat szerint). Működés nézet: egy billentyűgomb (aria-pressed), kiemelt áramút, szöveges állapot („A lámpa ég” / „A lámpa nem ég”), alatta a kapcsolóállás-táblázat. Alsó sor (.fig-small): „Így látod a tervezőben: a PE egyszínű zöld.” title: „Egypólusú kapcsoló bekötése”; desc: a netlistából generált leírás.]

## Vezetékek táblázatban

Az ábra szöveges megfelelője. A színkiosztás egy lehetséges, következetes megoldás (barna betáp fázis, fekete kapcsolt fázis); a fázisszínek közötti választás nem kötött, a kék és a zöld-sárga szerepe viszont igen.

<!-- sim:vezetekek src=egypolusu-kapcsolo-101-bekotese.netlist.json -->
| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | Kapcsoló (101): L kapocs (betáp) | L | barna | Kötődoboz – kapcsoló |
| 5 | Kapcsoló (101): 1-es kapocs (kimenet) | Kötődoboz: kapcsoltfázis-kötés | kapcsolt fázis | fekete | Kötődoboz – kapcsoló |
| 6 | Kötődoboz: kapcsoltfázis-kötés | Lámpa: L (fázis) | kapcsolt fázis | fekete | Kötődoboz – lámpa |
| 7 | Kötődoboz: N-kötés | Lámpa: N | N | kék | Kötődoboz – lámpa |
| 8 | Kötődoboz: PE-kötés | Lámpa: PE | PE | zöld-sárga | Kötődoboz – lámpa |
<!-- /sim:vezetekek -->

## Hogyan működik?

A 101-es kapcsolóban egyetlen érintkezőpár van. Bekapcsolt állásban összeköti a két kapcsát: a betáp fázisa a kapcsolt fázisvezetőn át eljut a lámpához, az áramkör pedig a lámpa nullavezetőjén keresztül zárul. Kikapcsolt állásban az érintkező nyitva van, a lámpához menő kapcsolt fázis feszültségmentes. A lámpa nullavezetője ilyenkor is a hálózat nullájához kapcsolódik, a védővezetője pedig a kapcsoló állásától függetlenül mindig összeköttetésben marad a védővezető-hálózattal.

<!-- sim:allapotok src=egypolusu-kapcsolo-101-bekotese.netlist.json -->
| Kapcsoló (101) | Lámpa |
|---|---|
| ki | nem ég |
| be | **ég** |

_A táblázatot a szimulátor számolta a(z) `egypolusu-kapcsolo-101` netlistából (ujjlenyomat: `162c980a`): 2 kapcsolóállás, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig folytonos, és nem halad át kapcsolón; kikapcsolt állásban a lámpa fázisoldali kapcsa nem kap fázist; a nullavezető egyik állásban sem halad át kapcsolón._
<!-- /sim:allapotok -->

**Miért a fázist bontja?** Ha a kapcsoló a nullavezetőt szakítaná meg, a lámpa ugyan kialudna, de a fázis a lámpán keresztül a foglalatig, a kapcsokig és a lámpatest belső vezetékeiig továbbra is eljutna. Izzócsere vagy a lámpatest tisztítása közben ez áramütést okozhat. Ezért egypólusú kapcsoló nem kerülhet a nullavezetőbe; a polaritás ellenőrzése az átadás előtti vizsgálat része. Menetes (E27, E14) foglalatnál a kapcsolt fázis a középső érintkezőre jut, a nullavezető a menetre (lásd: [[lampafoglalatok-es-lampatalpak|Lámpafoglalatok és lámpatalpak]]).

**A kikapcsolt lámpa nem feszültségmentes.** A falikapcsoló üzemi kapcsoló, nem leválasztó: a lámpa nullavezetője kikapcsolt állásban is a hálózathoz csatlakozik, és hogy a kapcsoló valóban a fázist bontja-e, azt csak mérés mutatja meg. Lámpacsere, tisztítás vagy szerelés előtt ezért az áramkört az elosztóban le kell választani, és a feszültségmentességet ellenőrizni kell. Az áram-védőkapcsoló (FI-relé) sem véd minden esetben: ha valaki egyszerre érinti a fázis- és a nullavezetőhöz kapcsolódó részt (például a foglalat két érintkezőjét), az áram nem a védővezetőn vagy a földön át záródik, így a FI-relé nem feltétlenül old ki.

## Kapcsok és jelölésük

A 101-es kapcsolónak két kapcsa van: a betáp (fázis) kapcsa és a lámpa felé menő kimenet. A jelölés gyártónként eltér: a betápot többnyire L, a kimenetet 1-es szám vagy a lámpa felé mutató nyíl jelöli, de előfordul más jelölés is. Sok gyártó csak váltókapcsolót (106) forgalmaz, amely egypólusú kapcsolóként is beköthető: ilyenkor a fázis a közös kapocsra, a kapcsolt fázis az egyik kimenetre kerül, a másik kimenet szabadon marad. A szabadon maradó kimenet a szimuláció szerint éppen akkor van fázis alatt, amikor a lámpa nem ég, ezért más vezető nem köthető rá, toldásra vagy továbbkötésre sem használható. A gyártói útmutató az irányadó.

A jelzőfényes (megvilágított) kapcsolóknál a kapcsok szerepe kötött. Van olyan kivitel, amelynek jelzőfénye a lámpán keresztül zárja az áramkörét – ilyenkor a kikapcsolt lámpa kapcsain is feszültség mérhető –, és van, amelyik külön nullavezető-kapcsot igényel. A kapcsokra tömör vagy hajlékony vezető köthető, a gyártó által megengedett keresztmetszettel; hajlékony vezetőhöz rendszerint érvéghüvely kell. A kapcsoló névleges áramát és feszültségét az adattáblája adja meg.

## A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. **Feszültségmentesítés.** Az érintett áramkör (vagy áramkörök) leválasztása az elosztóban, visszakapcsolás elleni biztosítás, majd a feszültségmentesség megállapítása kétpólusú feszültségvizsgálóval, amelynek működését a mérés előtt és után ismert feszültségforráson ellenőrizni kell, [[feszultsegmentesites-ot-szabalya|a feszültségmentesítés öt szabálya]] szerint. Egy kötődobozban több áramkör vezetői is futhatnak; a fáziskereső nem igazolja a feszültségmentességet.
2. **Azonosítás.** A betáp fázis-, nulla- és védővezetőjének, valamint a kapcsolóhoz és a lámpához menő ereknek az azonosítása és jelölése. A szín csak szándékot jelez (lásd: [[vezetekek-szinjelolese|Vezetékek színjelölése]]).
3. **Kötődoboz.** A betáp nullavezetője és a lámpa nullavezetője egy vezetékösszekötőbe, a két védővezető egy másikba kerül. A betáp fázisa a kapcsolóhoz menő érrel, a kapcsolóból visszatérő kapcsolt fázis a lámpához menő fázisérrel kerül össze.
4. **Kapcsoló.** A fázis a betápkapocsra, a kapcsolt fázis a kimenetre kerül, a gyártó által megadott csupaszolási hosszal.
5. **Lámpa.** A kapcsolt fázis az L, a nullavezető az N kapocsra, a védővezető a lámpatest védővezető-kapcsára kerül.
6. **Ellenőrzés visszakapcsolás előtt.** Szemrevételezés: nincs kilógó csupasz vezetővég, a kötések húzásra is tartanak, a vezetékek nem sérültek a dobozba hajtáskor. A védővezető folytonosságát, a szigetelési ellenállást és a polaritást (a kapcsoló a fázisvezetőben van) a szakember méréssel ellenőrzi és dokumentálja.
7. **Működéspróba.** Visszakapcsolás után a kapcsoló mindkét állása a fenti táblázat szerint működik.

## Jelölés az alaprajzon

A Villanyrajz tervezőjében a kapcsoló jele kör egy ferde vonallal, alatta az 1-es számmal. A szám a típusszám utolsó jegye (101 → 1; a 102 → 2, a 105 → 5, a 106 → 6, a 107 → 7). A szerelési rajz a kábel- vagy védőcsőszakaszonként szükséges erek számát mutatja:

<!-- sim:szakaszok src=egypolusu-kapcsolo-101-bekotese.netlist.json -->
| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – kapcsoló | L (barna), kapcsolt fázis (fekete) | 2 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |
<!-- /sim:szakaszok -->

A kapcsolóhoz menő szakaszban nincs nullavezető. Ha ide háromeres kábel kerül, a zöld-sárga ér akkor is csak védővezető lehet. A kék ér csak akkor szolgálhat kapcsolt fázisként, ha a szakaszban nincs nullavezető, és a végein tartós jelölés mutatja a szerepét. Fém burkolatú vagy keretű kapcsolóhoz védővezető is kell; ha a dobozba később okoskapcsoló kerülhet, a nullavezető is legyen ott (a gyártói útmutató szerint).

## Régi berendezésben

- **A kapcsoló a nullavezetőt bontja.** Régi vagy utólag átalakított berendezésben előfordul. A lámpa működik, de kikapcsolva is fázis alatt áll. Csak szakember által végzett méréssel derül ki.
- **Nincs védővezető a lámpánál.** Két erű vezetékezésnél fémtestű (I. érintésvédelmi osztályú) lámpatest nem köthető be szakszerűen; a megoldásról szakember dönt. A hiányzó védővezetőt tilos a nullavezetőből „pótolni” (a lámpatest védőkapcsát a lámpánál vagy a dobozban a nullára kötni): ha a nullavezető megszakad vagy a vezetők felcserélődnek, a fémtest fázis alá kerül.
- **Nullázásos (TN-C) rendszer.** A régi gyakorlatban a lámpatest védőkapcsa a közös nulla- és védővezetőhöz (PEN) csatlakozhatott. Átalakításnál ezt szakembernek kell felmérnie. Ahol a PEN-vezetőt már szétválasztották nulla- és védővezetőre, a kettőt a szétválasztási pont után újra összekötni tilos (lásd: [[foldelesi-rendszerek|Földelési rendszerek]]).
- **Alumínium vezetők.** Csak alumíniumhoz is alkalmas kapocsba vagy összekötőbe köthetők; törékenyek, a kötésük melegedhet. Réz és alumínium vezető csak erre alkalmas összekötővel köthető össze.
- **Kötések a kapcsolódobozban, szigetelőszalaggal.** A régi, sodrott kötések lazulhatnak; a lámpa hőjétől elöregedett szigetelés morzsolódhat.
- **Jelöletlen kapcsok, megbízhatatlan színek.** A régi kapcsolók kapcsain gyakran nincs jelölés, az erek színe pedig semmit nem bizonyít: a kék ér is vezethet fázist, például a kapcsolóhoz menő szakaszban.

## Gyakori hibák

- **Kapcsoló a nullavezetőben.** A legsúlyosabb hiba: a lámpa kikapcsolva is fázis alatt marad. A szimulációs ellenőrzés is ezt az esetet szűri ki elsőként.
- **Felcserélt vezetők a lámpánál.** Ha a kapcsolt fázis a lámpa N, a nullavezető az L kapcsára kerül, a lámpa működik, de a fázis a foglalat menetére jut.
- **Zöld-sárga ér fázisvezetőként,** vagy jelöletlen kék ér kapcsolt fázisként.
- **Kimaradt vagy bekötetlen védővezető** a fémtestű lámpatestnél.
- **Laza kötés:** melegedés, recsegés, villogás. Gyakori ok, hogy az ér nincs ütközésig betolva a vezetékösszekötőbe, vagy hajlékony vezető került érvéghüvely nélkül olyan kapocsba, amely erre nem alkalmas.
- **Kikapcsolva derengő LED-lámpa.** Okozhatja jelzőfényes kapcsoló, amelynek kis árama a lámpán át folyik; hosszú, párhuzamosan futó vezetékek kapacitív csatolása; vagy hibás bekötés. Az okot szakember méréssel keresi meg.
- **Túl sok LED-meghajtó egy kapcsolón.** Bekapcsoláskor nagy rövid idejű áramot vehetnek fel; a kapcsoló terhelhetőségét a gyártói adatlap adja meg.

## Mikor hívj szakembert?

- Mindig, ha kapcsolót, lámpát vagy kötést kell bekötni, cserélni vagy áthelyezni.
- Azonnal, ha a lámpatest, a kapcsolókeret vagy más fémrész érintésekor bizsergést érzel: ne érintsd újra, kapcsold le az áramkört az elosztóban, és amíg a szakember meg nem vizsgálta, ne kapcsold vissza.
- Ha a kapcsoló vagy a fedele meleg, elszíneződött, recseg, szikrázik, vagy égett szagot érzel.
- Ha a lámpa kikapcsolva dereng vagy villog, vagy kapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a lámpánál nincs védővezető, vagy régi, alumínium vezetékezést találsz.
- Ha a kapcsoló vagy a lámpa fürdőszobába, más nedves helyiségbe vagy szabadba kerül; ilyenkor a védettséget is meg kell választani (lásd: [[ip-vedettseg|IP-védettség]]).
- Ha okoskapcsolót szeretnél: sok típus nullavezetőt igényel a kapcsolódobozban.
