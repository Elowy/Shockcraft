---
slug: ketpolusu-kapcsolo-102-bekotese
title: "Kétpólusú kapcsoló (102) bekötése: fázis és nulla együttes bontása"
navTitle: "Kétpólusú kapcsoló (102)"
summary: "Mikor kell kétpólusú (102-es) kapcsoló, hogyan bontja együtt a fázis- és a nullavezetőt, és miért nem kapcsolhatja soha a védővezetőt vagy a PEN-t?"
section: semak
category: kapcsolasok
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [102, kétpólusú kapcsoló, kétsarkú kapcsoló, minden pólust bontó kapcsoló, fázis és nulla bontása, kapcsolt nulla, bojler kapcsoló, kapcsoló bekötése]
synonyms: [kétsarkú kapcsoló, 2 pólusú kapcsoló, 2P kapcsoló, 102-es kapcsoló, kétpólusú villanykapcsoló, bojlerkapcsoló, nullát is bontó kapcsoló]
plannerKinds: [switch2]
related: [vilagitasi-kapcsolasok, egypolusu-kapcsolo-101-bekotese, foldelesi-rendszerek, vezetekek-szinjelolese, feszultsegmentesites-ot-szabalya]
calculators: [aram-teljesitmenybol]
figures:
  - id: abra-1
    netlist: ketpolusu-kapcsolo-102-bekotese.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
sources:
  - standard: "MSZ HD 60364-5-537 (leválasztás és kapcsolás)"
    kiadás: "2017 (HD 60364-5-537:2016)" # lektor ellenőrizze a honosítás évét és a hatályos kiadást
    pont: "537 – általános követelmények (a PEN-vezető nem kapcsolható és nem választható le) és az üzemi kapcsolás alpontja" # alpontszámokat lektor adja meg
  - standard: "MSZ HD 60364-5-51"
    kiadás: "2010" # lektor ellenőrizze
    pont: "514.3 (vezetők azonosítása)"
  - standard: "MSZ EN IEC 60445"
    kiadás: "2022 (EN IEC 60445:2021)" # lektor ellenőrizze
    pont: "6.2 (vezetők azonosítása színnel)"
  - standard: "MSZ EN 60669-1 (háztartási és hasonló, helyhez kötött villamos berendezések kapcsolói)"
    kiadás: "2018 (EN IEC 60669-1:2018)" # lektor ellenőrizze a kiadást
    pont: "7 (osztályozás, bekötési számok), 8 (jelölés), 12 (kapcsok)" # pontszámokat lektor ellenőrizze
  - standard: "MSZ EN 60335-1 (háztartási és hasonló jellegű villamos készülékek biztonsága)"
    kiadás: "2012, módosításokkal" # lektor ellenőrizze
    pont: "7.12.2 (a fix bekötésű készülék leválasztásáról szóló gyártói utasítás)" # pontszámot lektor ellenőrizze
  - standard: "MSZ HD 60364-6 (ellenőrzés)"
    kiadás: "2017 (HD 60364-6:2016)" # lektor ellenőrizze
    pont: "6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás)" # alpontokat lektor ellenőrizze
ai: vázlat
review: lektorra-var
version: 0.1
updated: 2026-10-10
---

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

**Röviden:** A kétpólusú kapcsoló (102) egyetlen billentyűvel, két együtt mozgó érintkezővel egyszerre bontja a fázis- és a nullavezetőt. Ott használják, ahol a terv vagy a készülék gyártója a fogyasztó mindkét aktív vezetőjének bontását kéri. A védővezetőt a 102-es kapcsoló sem bonthatja, és a nullázásos berendezések közös PEN-vezetőjét sem.

[ÁBRA: abra-1 „Kétpólusú kapcsoló (102) bekötése”. Forrás: ketpolusu-kapcsolo-102-bekotese.netlist.json (id: ketpolusu-kapcsolo-102); a rajz, a vezetéktábla, az ábra desc-je és a Működés nézet is ebből készül. viewBox 0 0 360 240. Bekötés nézet: balra a betáp (L, N, PE), alul középen a kapcsolódoboz a 102-es kapcsolóval (bemenő L és N, kimenő L és N kapocs; a két érintkezőt szaggatott vonal köti össze, jelezve, hogy együtt mozognak) és mellette, a kapcsolón kívül, a PE-összekötő; jobbra fent a lámpa (L, N, PE). Erek: L és kapcsolt fázis barna, N és kapcsolt nulla kék (feliratuk eltér: „N” és „N kapcsolt”), PE zöld alapon sárga csíkkal. Szerelési rajz nézet: betáp – kapcsolódoboz – lámpa, a tervező switch2 jelével („2” felirat), szakaszonként 3 / 3 ér. Működés nézet: egy billentyű; bekapcsolva kiemelt fázis- és nullaút, kikapcsolva a lámpa mindkét kapcsa „leválasztva” felirattal. Alsó sor: „Így látod a tervezőben: a PE egyszínű zöld.”]

## Vezetékek táblázatban

Ebben a változatban a betáp a kapcsolódobozon át megy tovább a fogyasztóhoz, a védővezető pedig a kapcsolódobozban, a kapcsolót elkerülve, vezetékösszekötővel folytatódik.

<!-- sim:vezetekek src=ketpolusu-kapcsolo-102-bekotese.netlist.json -->
| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kapcsoló (102): L kapocs (betáp) | L | barna | Betáp – kapcsolódoboz |
| 2 | Betáp: N | Kapcsoló (102): N kapocs (betáp) | N | kék | Betáp – kapcsolódoboz |
| 3 | Betáp: PE | Kapcsolódoboz: PE-összekötő | PE | zöld-sárga | Betáp – kapcsolódoboz |
| 4 | Kapcsoló (102): L kimenet | Lámpa (vagy más fogyasztó): L (fázis) | kapcsolt fázis | barna | Kapcsolódoboz – lámpa |
| 5 | Kapcsoló (102): N kimenet | Lámpa (vagy más fogyasztó): N | kapcsolt nulla | kék | Kapcsolódoboz – lámpa |
| 6 | Kapcsolódoboz: PE-összekötő | Lámpa (vagy más fogyasztó): PE | PE | zöld-sárga | Kapcsolódoboz – lámpa |
<!-- /sim:vezetekek -->

## Hogyan működik?

A 102-es kapcsolóban két érintkezőpár van, amelyeket egy billentyű egyszerre mozgat. Bekapcsolt állásban az egyik pólus a fázisvezetőt, a másik a nullavezetőt köti tovább a fogyasztó felé. Kikapcsolt állásban mindkét érintkező nyitva van: a fogyasztó mindkét üzemi kapcsa el van választva a hálózattól, a védővezetője viszont folyamatosan bekötve marad.

<!-- sim:allapotok src=ketpolusu-kapcsolo-102-bekotese.netlist.json -->
| Kapcsoló (102) | Lámpa (vagy más fogyasztó) |
|---|---|
| ki | nem ég |
| be | **ég** |

_A táblázatot a szimulátor számolta a(z) `ketpolusu-kapcsolo-102` netlistából (ujjlenyomat: `a253fd8a`): 2 kapcsolóállás, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig folytonos, és nem halad át kapcsolón; kikapcsolt állásban a lámpa fázisoldali kapcsa nem kap fázist; a nullavezetőt csak a kétpólusú kapcsoló bontja, a fázisvezetővel együtt, így kikapcsolt állásban a fogyasztó mindkét üzemi kapcsa le van választva._
<!-- /sim:allapotok -->

A fázisvezető bontása itt is alapkövetelmény: a fázisnak ugyanazon a póluson kell be- és kilépnie. Ha a pólusokat keresztbe kötik (a fázis az egyik pólus bemenetére kerül, a fogyasztó fázisvezetője viszont a másik pólus kimenetéről indul), a szimuláció szerint bekapcsoláskor a fogyasztó nulla felőli kapcsára kerül a fázis, vagyis felcserélődik a polaritás.

**Mire jó, és mire nem?** A 102-es kapcsoló üzemi kapcsoló: a fogyasztót be- és kikapcsolja. Munkavégzés előtti leválasztásra nem helyettesíti az elosztóban végzett feszültségmentesítést, akkor sem, ha ki van kapcsolva. Egyes fix bekötésű készülékek (például villanybojler, szellőző) gyártói útmutatója minden pólust bontó, megadott legkisebb érintkezőnyílású kapcsolót ír elő; ilyenkor a kapcsoló névleges áramának, feszültségének és érintkezőnyílásának a készülékhez kell illenie. Hogy egy adott helyen kell-e kétpólusú kapcsolás, azt a terv vagy a gyártói előírás dönti el.

**A PEN-vezetőt soha nem szabad kapcsolni.** Régi, nullázásos (TN-C) berendezésben a nulla- és a védővezető egy közös vezető (PEN). Ha ezt egy kapcsoló megszakítaná, a készülék teste is elveszítené a védelmét. Ilyen berendezésben a 102-es kapcsoló nullapólusa nem kerülhet a PEN-be; a megoldást szakember tervezi meg (lásd: [[foldelesi-rendszerek|Földelési rendszerek]]).

## Kapcsok és jelölésük

A 102-es kapcsolónak négy kapcsa van: két bemenő (fázis és nulla) és két kimenő. A jelölés gyártónként eltérhet: előfordul L és N a bemeneten, L' és N' vagy nyíl a kimeneten, de számozott kapcsok is (például 1–2 és 3–4 pólusonként). A pólusok nem cserélhetők fel tetszés szerint: a fázis be- és kimenete ugyanarra a pólusra kerüljön. Jelzőfényes kivitelnél a jelzőfény bekötése is kötött. Mindig a gyártói útmutató az irányadó.

## A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. **Feszültségmentesítés** az elosztóban, [[feszultsegmentesites-ot-szabalya|a feszültségmentesítés öt szabálya]] szerint: leválasztás, visszakapcsolás elleni biztosítás, a feszültségmentesség megállapítása kétpólusú feszültségvizsgálóval (a vizsgáló működését előtte és utána ismert feszültségforráson ellenőrizve). A falon lévő 102-es kapcsoló kikapcsolt állása erre nem elég.
2. **Azonosítás.** A betáp fázis-, nulla- és védővezetőjének azonosítása – a szín nem bizonyít, az azonosítás a szakember mérésén alapul – és jelölése; meg kell győződni arról is, hogy a berendezés nem nullázásos (TN-C).
3. **Védővezető.** A betáp és a fogyasztó védővezetője a kapcsolódobozban, a kapcsolótól függetlenül, vezetékösszekötővel kerül össze.
4. **Kapcsoló.** A fázis az egyik pólus bemenetére, a nulla a másik pólus bemenetére; a kapcsolt fázis és a kapcsolt nulla az ugyanazon pólushoz tartozó kimenetekre.
5. **Fogyasztó.** A kapcsolt fázis az L, a kapcsolt nulla az N, a védővezető a PE kapocsra.
6. **Ellenőrzés visszakapcsolás előtt:** szemrevételezés, valamint a védővezető folytonosságának, a szigetelési ellenállásnak és a polaritásnak a mérése; a szakember dokumentálja.
7. **Működéspróba** a fenti táblázat szerint.

## Jelölés az alaprajzon

A tervezőben a kétpólusú kapcsoló jele kör két ferde vonallal, alatta a 2-es számmal (102 → 2). A szerelési rajz szakaszonként mutatja az erek számát:

<!-- sim:szakaszok src=ketpolusu-kapcsolo-102-bekotese.netlist.json -->
| Szakasz | Vezetők | Érszám |
|---|---|---|
| Betáp – kapcsolódoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kapcsolódoboz – lámpa | kapcsolt fázis (barna), kapcsolt nulla (kék), PE (zöld-sárga) | 3 |
<!-- /sim:szakaszok -->

A kapcsolódoboz és a fogyasztó közötti szakaszban a kék ér a kapcsolt nullavezető: a szerepe ugyanaz marad, csak kikapcsolt állásban nincs összeköttetésben a hálózat nullájával. A zöld-sárga ér itt is csak védővezető lehet.

## Régi berendezésben

- **Nullázásos (TN-C) rendszer.** A közös PEN-vezetőt kapcsolni tilos; régi berendezésben a 102-es kapcsoló beépítése előtt a földelési rendszert szakembernek kell felmérnie. Ahol a PEN-vezetőt már szétválasztották, a nulla- és a védővezetőt a szétválasztási pont után újra összekötni tilos.
- **Ismeretlen szerepű erek.** Régi vezetékezésben a fázis és a nulla színből nem állapítható meg, és előfordul, hogy a dugaljakon vagy a dobozokban felcserélődött. Ezért a pólusok bekötése előtt mérés kell.
- **Régi, porcelán vagy bakelit kapcsolók** jelöletlen kapcsokkal, kopott érintkezőkkel; cseréjüknél a bekötést újra kell tervezni, nem a régit lemásolni.
- **Védővezető nélküli fogyasztó.** Két erű vezetékezésnél fémtestű készülék nem köthető be szakszerűen; a megoldásról szakember dönt. A hiányzó védővezetőt tilos a nullavezetőből „pótolni”: a 102-es kapcsoló mögött a kapcsolt nullára kötött fémtest kikapcsolt állásban semmihez nem csatlakozik, keresztbe kötött pólusoknál pedig bekapcsoláskor fázis alá kerül.

## Gyakori hibák

- **Keresztbe kötött pólusok:** a fázis az egyik pólus bemenetére kerül, a fogyasztó fázisvezetője viszont a másik pólus kimenetéről indul. A fogyasztó működik, de felcserélődik a polaritás.
- **A védővezető a kapcsolón át fut,** vagy a kapcsoló harmadik, „üres” kapcsára kerül. A védővezetőt semmilyen kapcsoló nem bonthatja.
- **PEN-vezető kapcsolása** nullázásos berendezésben.
- **A nulla- és a védővezető összekötése** a kapcsolódobozban vagy a fogyasztónál. Ha a kapcsolt nullát a PE-összekötőbe kötik, bekapcsolt állásban a nulla- és a védővezető összeér: a fogyasztó üzemi árama részben a védővezetőn és a hozzá kötött fémtesteken folyik. Az áram-védőkapcsoló (FI-relé) ilyenkor kiold; FI-relé nélkül a hiba rejtve maradhat.
- **A kapcsoló terhelhetősége kevés:** egy villanybojler vagy fűtőkészülék árama jóval nagyobb lehet, mint egy világítási áramköré. A szükséges névleges áramot a készülék adataiból kell meghatározni (lásd a kapcsolódó kalkulátort).
- **A 102-es kapcsolót leválasztónak tekintik,** és kikapcsolt állásában, az elosztóban végzett feszültségmentesítés nélkül dolgoznak a fogyasztón.
- **Laza kötés** a nagyobb áramú pólusokon: melegedés, elszíneződés.

## Mikor hívj szakembert?

- Mindig, ha kapcsolót vagy fix bekötésű készüléket kell bekötni, cserélni vagy áthelyezni.
- Azonnal, ha a készülék fémházának érintésekor bizsergést érzel: ne érintsd újra, kapcsold le az áramkört az elosztóban, és amíg a szakember meg nem vizsgálta, ne kapcsold vissza.
- Ha a kapcsoló vagy a fedele meleg, elszíneződött, recseg, vagy égett szagot érzel.
- Ha a készülék kikapcsolt kapcsolónál is működik, vagy bekapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha régi, nullázásos berendezésben szeretnél kétpólusú kapcsolót.
- Ha a gyártói útmutató minden pólust bontó kapcsolót ír elő, és nem tudod, a meglévő kapcsoló megfelel-e ennek.
