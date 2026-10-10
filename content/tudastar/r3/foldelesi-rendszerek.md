---
slug: foldelesi-rendszerek
title: "Földelési rendszerek: TN-C, TN-S, TN-C-S, TT és IT"
navTitle: "Földelési rendszerek"
summary: "Mit jelent a TN-C, a TN-S, a TN-C-S, a TT és az IT? Hol válik szét a PEN-vezető, mi történik testzárlatkor és PEN-szakadáskor, mi jellemző itthon?"
section: semak
category: foldeles
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [földelési rendszer, érintésvédelem, TN-C, TN-S, TN-C-S, TT, IT, PEN, PEN-szétválasztás, csillagpont, üzemi földelés, védőföldelés, nullázás, védővezető, testzárlat, szigetelésfigyelő, hibavédelem]
synonyms: [nullázás, védőföldelés, földelés fajtái, hálózati rendszerek, TNC, TNS, TNCS, PEN szétválasztás, nulla és föld szétválasztása, földeletlen hálózat, elszigetelt hálózat, milyen földelés van a házban]
related: [vezetekek-szinjelolese, egyenpotencialra-hozas-eph, aram-vedokapcsolo-fi-rele, kismegszakito, dugalj-bekotese, feszultsegmentesites-ot-szabalya, rovidzarlat-es-tulterheles, transzformator-mukodese]
calculators: []
figures:
  - id: abra-1
    netlist: foldelesi-rendszerek-tn-c.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
  - id: abra-2
    netlist: foldelesi-rendszerek-tn-s.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
  - id: abra-3
    netlist: foldelesi-rendszerek-tn-c-s.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
  - id: abra-4
    netlist: foldelesi-rendszerek-tt.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
  - id: abra-5
    netlist: foldelesi-rendszerek-it.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
sources:
  - standard: "MSZ HD 60364-1 (kisfeszültségű villamos berendezések – alapelvek, fogalommeghatározások)"
    kiadás: "2009" # lektor ellenőrizze a hatályos kiadást
    pont: "312.2 (a földelési rendszerek típusai és betűjele)" # lektor ellenőrizze
  - standard: "MSZ HD 60364-4-41 (áramütés elleni védelem)"
    kiadás: "2007 (HD 60364-4-41:2007)" # lektor ellenőrizze; az újabb HD 60364-4-41:2017 honosítása kérdéses
    pont: "411.4 (TN), 411.4.5 (áram-védőkapcsoló TN-C-ben), 411.5 (TT), 411.6 (IT)" # alpontokat lektor ellenőrizze
  - standard: "MSZ HD 60364-5-54 (földelő berendezések és védővezetők)"
    kiadás: "2012 (HD 60364-5-54:2011)" # lektor ellenőrizze
    pont: "542.2 (földelők; éghető anyagot szállító fém csővezeték nem földelő), 543.4 (PEN-vezető és szétválasztása)" # lektor ellenőrizze
  - standard: "MSZ HD 60364-7-710 (orvosi helyiségek)"
    kiadás: "2012" # lektor ellenőrizze
    pont: "710.411.6 (orvosi IT-rendszer)" # lektor ellenőrizze
  - standard: "MSZ EN IEC 60445"
    kiadás: "2022 (EN IEC 60445:2021)" # lektor ellenőrizze
    pont: "6.2 (vezetők színjelölése, a PEN-vezető jelölése)" # alpontot lektor ellenőrizze
  - standard: "MSZ 447 (csatlakozás a közcélú kisfeszültségű elosztóhálózatra)"
    kiadás: "2019" # lektor ellenőrizze a kiadást
    pont: "a csatlakozó berendezés érintésvédelmi kialakítása és a PEN szétválasztásának helye" # a pontszámot lektor adja meg
lektorKerdesek:
  - "Hazai előfordulás: helytálló-e, hogy a közcélú kisfeszültségű hálózat jellemzően TN-C (négyvezetős), a lakossági fogyasztói berendezések nagy része TN-C-S, és TT ma inkább kivételesen fordul elő? Kell-e konkrétabb (elosztói engedélyesenkénti) megfogalmazás?"
  - "A PEN szétválasztásának helye (csatlakozószekrény, mérőhely, első elosztó) és az ott kötelező földelés (ismételt földelés, alapföldelő) – az MSZ 447 vagy az engedélyesek szabályzata rögzíti? Melyik ponton?"
  - "A cikk szerint a szétválasztásnál a PEN előbb a PE-sínre kerül, és onnan híddal a nullasínre. Az 543.4 pont pontosan mit ír elő?"
  - "A szimuláció ideális vezetőkkel, minőségi alapon számol („veszélyes lehet a lekapcsolásig”, „tartósan”). Elegendő-e így, vagy a hibafeszültség nagyságrendjét is közölni kell jóváhagyott forrásból?"
  - "A régi „nullázás” és „védőföldelés” elnevezés zárójeles használata elfogadható-e?"
ai: vázlat
review: lektorra-var
version: 0.1
updated: 2026-10-10
---

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól; elvi ismereteket ad, nem szerelési utasítás. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka, így a PEN-vezető szétválasztásának kialakítása is, az elosztói engedélyes hatásköre és előírásai szerint történik. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

**Röviden:** A földelési rendszer azt írja le, hogyan kapcsolódik a táppont csillagpontja és a fogyasztói berendezés fémháza a földhöz. TN-rendszerben a fémház vezetőn át a földelt csillagponthoz csatlakozik, TT-rendszerben a saját földelőjéhez, IT-rendszerben pedig a táppont nincs közvetlenül földelve. A hazai lakóépületekben a TN-C-S a legelterjedtebb: a hálózat PEN-vezetője a csatlakozás után egyetlen ponton válik szét nulla- és védővezetőre, és utána soha nem egyesülhet újra.

## Mit jelentenek a betűk?

Az **első betű** a táppont (az elosztói transzformátor) csillagpontjára vonatkozik: T – közvetlenül földelt (üzemi földelés), I – a földtől elszigetelt vagy nagy impedancián át földelt. A **második betű** a fogyasztói berendezés fémházaira (szakszóval: testeire): T – saját földelőn vannak, N – vezetőn át a táppont földelt pontjához kötöttek. A TN utáni **kiegészítő betű**: C – közös PEN-vezető látja el a nulla- és a védővezető szerepét, S – a nullavezető (N) és a védővezető (PE) külön fut.

A régi hazai szóhasználat a TN-rendszerű érintésvédelmet **nullázásnak**, a TT-rendszerűt **védőföldelésnek** nevezte; régi tervekben, jegyzőkönyvekben ma is előfordul.

## A rendszerek egy táblázatban

Az öt ábra a táppontot, a hálózatot, az épület elosztóját és egy fémházas (I. érintésvédelmi osztályú) fogyasztót mutatja, két hibahelyzettel: **testzárlat** (a fázisvezető a fémházhoz ér), illetve egy vezető szakadása vagy egy második hiba. Az „érintés” azt mutatja, folyhatna-e áram azon, aki a fémházat és a földet egyszerre érinti, és megszünteti-e ezt önműködő lekapcsolás. Csak a fémházat vizsgálja; a nullavezető ettől függetlenül feszültség alá kerülhet (lásd a TN-S-nél).

<!-- sim:foldelesek src=foldelesi-rendszerek-tn-c.netlist.json src=foldelesi-rendszerek-tn-s.netlist.json src=foldelesi-rendszerek-tn-c-s.netlist.json src=foldelesi-rendszerek-tt.netlist.json src=foldelesi-rendszerek-it.netlist.json -->
| Rendszer | Csillagpont | A fémház védővezetője | 1. hibahelyzet | 2. hibahelyzet | Szimuláció |
|---|---|---|---|---|---|
| TN-C | közvetlenül földelt | PEN, a csillagponthoz | Testzárlat: fémes hurok; lekapcsol: F1 (túláramvédelem); érintés: veszélyes lehet a lekapcsolásig | PEN-szakadás: lekapcsol: nincs; fogyasztó: nem működik; érintés: veszélyes lehet, tartósan | PASS, 4 állapot (`742e564d`) |
| TN-S | közvetlenül földelt | külön PE, a csillagponthoz | Testzárlat: fémes hurok; lekapcsol: F1 (túláramvédelem), Q1 (FI-relé); érintés: veszélyes lehet a lekapcsolásig | N-szakadás: lekapcsol: nincs; fogyasztó: nem működik; érintés: nincs | PASS, 4 állapot (`816da23b`) |
| TN-C-S | közvetlenül földelt | PE, a szétválasztási ponttól PEN, a csillagponthoz | Testzárlat: fémes hurok; lekapcsol: F1 (túláramvédelem), Q1 (FI-relé); érintés: veszélyes lehet a lekapcsolásig | PEN-szakadás: lekapcsol: nincs; fogyasztó: rendellenesen (a földön át); érintés: veszélyes lehet, tartósan | PASS, 4 állapot (`bff6a9cd`) |
| TT | közvetlenül földelt | helyi földelőhöz (RA) | Testzárlat: a földön át; lekapcsol: Q1 (FI-relé); érintés: veszélyes lehet a lekapcsolásig | Testzárlat szakadt földelővezetővel: nincs zárt hurok; lekapcsol: nincs; érintés: veszélyes lehet, tartósan; a FI-relé legfeljebb a testen átfolyó áramra old ki | PASS, 4 állapot (`553eca92`) |
| IT | nincs közvetlenül földelve | helyi földelőhöz (RA) | Első testzárlat: nincs zárt hurok; lekapcsol: nincs (a szigetelésfigyelő jelez); érintés: nincs | Második testzárlat másik fázison: fémes hurok; lekapcsol: Q1 (túláramvédelem), Q2 (túláramvédelem); érintés: veszélyes lehet a lekapcsolásig | PASS, 4 állapot (`60981084`) |

_A táblázatot a szimulátor számolta a felsorolt netlistákból (5 rendszer, összesen 20 állapotkombináció, mindegyik egyezik a várt működéssel, és mindegyikben teljesülnek a rendszer szerkezeti feltételei). Az esetek a hiba fennállásának pillanatát mutatják, a lekapcsolás előtt; ideális vezetőkkel, áramerősség és lekapcsolási idő számítása nélkül._
<!-- /sim:foldelesek -->

## TN-C: közös PEN-vezető a fogyasztóig

A TN-C-rendszerben a táppontól a fogyasztóig egyetlen vezető, a **PEN** viszi a nullavezető üzemi áramát és a védővezető szerepét; a fogyasztónál a nulla- és a védőkapocs is a PEN-re kerül. Testzárlatkor a hibaáram fémes hurokban, a PEN-en át tér vissza, ezért a túláramvédelem (kismegszakító vagy olvadóbiztosító) lekapcsolhat.

[ÁBRA: abra-1 „TN-C rendszer”. Forrás: foldelesi-rendszerek-tn-c.netlist.json (id: foldeles-tn-c); a rajz, a vezetéktábla, a desc és a Működés nézet ebből készül, kézzel nem rajzolható át. viewBox 0 0 480 240, elhelyezés a layout mező szerint (earthing-svg). Bekötés nézet: balra a transzformátor csillagpontja az RB üzemi földelővel, a hálózat L1 és PEN vezetője; középen az épület elosztója (F1 túláramvédelem, PEN-kapocs); jobbra az M1 fémházas fogyasztó, a csatlakozásánál a PEN-kapocs, amelyről az N és a PE ágazik le. A PEN zöld-sárga, a végein kék jelöléssel; L1 barna; a talajt alul szaggatott vonal jelzi. Szerelési rajz nézet: telek-nézet a tervező jeleivel (Bekötési pont, Villanyóra, Főelosztószekrény, Lakáselosztó), a vezetékszakaszokon érszámmal (2 / 2). Működés nézet: két gomb (H1 testzárlat, SZ PEN-szakadás; aria-pressed), kiemelt hibaáram-út és szöveges állapot, alatta az állapottáblázat. Alsó sor (.fig-small): „Így látod a tervezőben: a PE egyszínű zöld.”]

<!-- sim:allapotok src=foldelesi-rendszerek-tn-c.netlist.json tomor -->
| H1 testzárlat M1-ben (fázis → fémház) | SZ PEN-szakadás a hálózatban | M1 fogyasztó | H1: hibaáram útja | F1: túláramvédelem | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|---|
| nincs | ép | **működik** | nincs hiba | nem | nincs |
| nincs | szakadt | nem működik | nincs hiba | nem | **veszélyes lehet, tartósan** |
| fennáll | ép | **működik** | **fémes hurok** | **lekapcsolhat** | **veszélyes lehet** a lekapcsolásig |
| fennáll | szakadt | nem működik | nincs zárt hurok | nem | **veszélyes lehet, tartósan** |

_A táblázatot a szimulátor számolta a(z) `foldeles-tn-c` netlistából (ujjlenyomat: `742e564d`): 4 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: F1 túláramvédelem (kismegszakító vagy olvadóbiztosító): be (bekapcsolva). Ellenőrzött szerkezet (TN-C): a csillagpont közvetlenül földelt (üzemi földelő); minden fémház vezetőn át a csillagponthoz kötött; a PEN-vezető a táppontól a fogyasztó csatlakozásáig fut, külön nulla- és védővezető nélkül; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli._
<!-- /sim:allapotok -->

A táblázat legfontosabb sora a **PEN-szakadás**: a fogyasztó leáll, de a fémháza a fogyasztón át a fázisvezetőhöz kapcsolódik, és ezt semmilyen védelem nem kapcsolja le. Áram-védőkapcsoló (FI-relé) TN-C-rendszerben nem alkalmazható: a hibaáram a PEN-en, a készüléken át tér vissza, így különbözeti áram nem keletkezik, kioldáskor pedig a fémház a védővezetőjét is elveszítené. A PEN-t ezért nem szabad kapcsolóval, biztosítóval vagy FI-relével bontani, és a szabvány a legkisebb keresztmetszetét is előírja. Ha a fázis- és a PEN-vezető valahol fel van cserélve, a PEN-re kötött fémház közvetlenül fázisfeszültségre kerül. Új lakásberendezés ma nem készül TN-C-rendszerben; a közcélú elosztóhálózat viszont jellemzően négyvezetős (három fázis és PEN), amelyet az elosztói engedélyes több ponton ismételten földel.

## TN-S: külön nulla- és védővezető

A TN-S-rendszerben a nulla- és a védővezető már a csillagpontnál szétválik, és végig külön fut; a védővezetőn üzem közben nem folyik áram. Testzárlatkor a hibaáram fémes hurokban, a PE-n át tér vissza, ezt a túláramvédelem és az áram-védőkapcsoló is érzékeli. Nullavezető-szakadáskor a fogyasztó leáll, a fémháza nem kerül feszültség alá, mert a védővezető ép. **A szakadás utáni nullavezető-szakasz viszont a bekapcsolt fogyasztón át fázisfeszültségre kerülhet**, ezért a nullavezető érintése ilyenkor életveszélyes; háromfázisú hálózatban a csillagpont eltolódása az egyfázisú fogyasztókon túlfeszültséget is okozhat.

[ÁBRA: abra-2 „TN-S rendszer”. Forrás: foldelesi-rendszerek-tn-s.netlist.json (id: foldeles-tn-s). viewBox 0 0 480 240. Bekötés nézet: a transzformátor csillagpontjából külön N (kék) és PE (zöld-sárga) indul, a csillagpont az RB üzemi földelőn; az épületben N-sín, PE-sín, Q1 áram-védőkapcsoló, F1 kismegszakító; jobbra az M1 fogyasztó. Szerelési rajz nézet: a tervező jelei, érszám a hálózati szakaszon 3, az áramkörön 3. Működés nézet: H1 és SZ (nullavezető-szakadás) gomb, kiemelt áramút, alatta az állapottáblázat. Alsó sor: „Így látod a tervezőben: a PE egyszínű zöld.”]

<!-- sim:allapotok src=foldelesi-rendszerek-tn-s.netlist.json tomor -->
| H1 testzárlat M1-ben (fázis → fémház) | SZ nullavezető-szakadás a hálózatban | M1 fogyasztó | H1: hibaáram útja | Q1: kiold? | F1: túláramvédelem | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|---|---|
| nincs | ép | **működik** | nincs hiba | nem old ki | nem | nincs |
| nincs | szakadt | nem működik | nincs hiba | nem old ki | nem | nincs |
| fennáll | ép | **működik** | **fémes hurok** | **kiold** | **lekapcsolhat** | **veszélyes lehet** a lekapcsolásig |
| fennáll | szakadt | nem működik | **fémes hurok** | **kiold** | **lekapcsolhat** | **veszélyes lehet** a lekapcsolásig |

_A táblázatot a szimulátor számolta a(z) `foldeles-tn-s` netlistából (ujjlenyomat: `816da23b`): 4 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé), kétpólusú: be (bekapcsolva); F1 kismegszakító (túláramvédelem): be (bekapcsolva). Ellenőrzött szerkezet (TN-S): a csillagpont közvetlenül földelt (üzemi földelő); minden fémház vezetőn át a csillagponthoz kötött; a nulla- és a védővezető csak a csillagpontban kapcsolódik, külön fut a fogyasztóig; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli._
<!-- /sim:allapotok -->

TN-S-rendszer jellemzően saját transzformátorról táplált létesítményben (például ipari üzemben) fordul elő.

## TN-C-S: a PEN szétválasztása

A TN-C-S-rendszerben a PEN-vezető a táppontól a **szétválasztási pontig** fut, onnan a nulla- és a védővezető külön halad. A szétválasztás a fogyasztói berendezés kezdetén történik; pontos helyét (mérőhely vagy az azt követő első elosztó) és kialakítását az elosztói engedélyes előírásai határozzák meg. Jellemzően ide kapcsolódik az épület földelője (alapföldelő vagy ismételt földelés) és a fő EPH-sín is (lásd: [[egyenpotencialra-hozas-eph|Egyenpotenciálra hozás (EPH)]]).

[ÁBRA: abra-3 „TN-C-S rendszer és a PEN szétválasztása”. Forrás: foldelesi-rendszerek-tn-c-s.netlist.json (id: foldeles-tn-c-s). viewBox 0 0 480 240. Bekötés nézet: balra a transzformátor PEN-csillagpontja az RB földelővel; a hálózaton L1 és PEN; az épületben a PSZ szétválasztási pont (PE-sín és N-sín, köztük összekötő híd, a PEN a PE-sínre érkezik), az RA földelő, Q1 áram-védőkapcsoló, F1 kismegszakító; az áramkörön külön N és PE az M1 fogyasztóig. A szétválasztási pontot kiemelő keret és felirat jelöli: „Innen külön N és PE – újra nem köthető össze”. Szerelési rajz nézet: a tervező jelei, érszám 2 a hálózati, 3 az áramköri szakaszon. Működés nézet: H1 és SZ (PEN-szakadás) gomb, kiemelt áramút, alatta az állapottáblázat. Alsó sor: „Így látod a tervezőben: a PE egyszínű zöld.”]

<!-- sim:allapotok src=foldelesi-rendszerek-tn-c-s.netlist.json tomor -->
| H1 testzárlat M1-ben (fázis → fémház) | SZ PEN-szakadás a hálózatban vagy a csatlakozó vezetékben | M1 fogyasztó | H1: hibaáram útja | Q1: kiold? | F1: túláramvédelem | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|---|---|
| nincs | ép | **működik** | nincs hiba | nem old ki | nem | nincs |
| nincs | szakadt | rendellenesen (a földön át) | nincs hiba | nem old ki | nem | **veszélyes lehet, tartósan** |
| fennáll | ép | **működik** | **fémes hurok** | **kiold** | **lekapcsolhat** | **veszélyes lehet** a lekapcsolásig |
| fennáll | szakadt | rendellenesen (a földön át) | **a földön át** | **kiold** | nem | **veszélyes lehet** a lekapcsolásig |

_A táblázatot a szimulátor számolta a(z) `foldeles-tn-c-s` netlistából (ujjlenyomat: `bff6a9cd`): 4 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé), kétpólusú: be (bekapcsolva); F1 kismegszakító (túláramvédelem): be (bekapcsolva). Ellenőrzött szerkezet (TN-C-S): a csillagpont közvetlenül földelt (üzemi földelő); minden fémház vezetőn át a csillagponthoz kötött; a PEN-vezető egyetlen ponton válik szét, utána a nulla- és a védővezető nem egyesül újra; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli._
<!-- /sim:allapotok -->

A szétválasztás egyirányú: **utána a nulla- és a védővezető sehol nem köthető újra össze**, sem alelosztóban, sem dugaljban, sem készülékben. Ha mégis összeérnek, a védővezetőn és a hozzá kötött csöveken üzemi áram folyik; a FI-relé csak akkor old ki, ha az összekötés a védett oldalán van, különben a hiba rejtve marad, és nullavezető-szakadáskor a fémházak is feszültség alá kerülhetnek.

A szétválasztás előtti PEN szakadását az áram-védőkapcsoló nem érzékeli: a fázis- és a nullavezető árama egyenlő, a fogyasztó árama az épület földelőjén és a talajon át keres utat. **Ilyenkor a teljes védővezető-rendszer – minden fémház és az EPH-ba kötött cső – feszültség alá kerülhet, és ezt sem a kismegszakító, sem a FI-relé nem kapcsolja le.** Közös hálózati PEN szakadásakor a saját főkapcsoló lekapcsolása sem szünteti meg biztosan a veszélyt, mert a többi, ugyanarra a PEN-re kötött fogyasztó is megemelheti a potenciált. Ezért fontos a PEN-vezető megbízhatósága, a kis ellenállású földelés és az EPH; nullavezető-szakadás figyelésére külön készülék is beépíthető.

<!-- sim:vezetekek src=foldelesi-rendszerek-tn-c-s.netlist.json -->
| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PEN) | RB üzemi földelő (a csillagpont földelése): földelőkapocs | földelővezető | zöld-sárga | a táppontnál |
| 2 | T1 elosztói transzformátor, kisfeszültségű tekercs: L1 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 1 (fázis, táp oldal) | L1 | barna | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 3 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PEN) | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): PEN (érkező) | PEN | zöld-sárga | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 4 | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): N-sín | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (táp oldal) | N | kék | elosztón belül |
| 5 | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): PE-sín | RA földelő az épületnél (alapföldelő vagy ismételt földelés): földelőkapocs | földelővezető | zöld-sárga | elosztón belül |
| 6 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 2 (fázis, védett oldal) | F1 kismegszakító (túláramvédelem): 1 (be) | L | barna | elosztón belül |
| 7 | F1 kismegszakító (túláramvédelem): 2 (ki) | M1 fémházas fogyasztó (I. érintésvédelmi osztály): L | L | barna | Fogyasztói áramkör |
| 8 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (védett oldal) | M1 fémházas fogyasztó (I. érintésvédelmi osztály): N | N | kék | Fogyasztói áramkör |
| 9 | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): PE-sín | M1 fémházas fogyasztó (I. érintésvédelmi osztály): fémház (PE) | PE | zöld-sárga | Fogyasztói áramkör |
<!-- /sim:vezetekek -->

## TT: saját földelő a fogyasztónál

A TT-rendszerben a csillagpont az RB üzemi földelőn, a fogyasztói védővezető a saját RA védőföldelőn van, köztük nincs vezető kapcsolat. Testzárlatkor a hibaáram a két földelőn és a talajon át tér vissza; ez a hurok nagy ellenállású, a túláramvédelem többnyire nem kapcsol le gyorsan, ezért a hibavédelmet jellemzően áram-védőkapcsoló adja. A védőföldelő ellenállását a FI-relé kioldási áramához kell megválasztani és mérni, hogy a fémházon ne maradhasson tartósan a megengedettnél nagyobb érintési feszültség; a pontos feltételt a szabvány adja meg.

[ÁBRA: abra-4 „TT rendszer”. Forrás: foldelesi-rendszerek-tt.netlist.json (id: foldeles-tt). viewBox 0 0 480 240. Bekötés nézet: a transzformátor N-csillagpontja az RB földelőn; a hálózaton L1 és N; az épületben Q1 áram-védőkapcsoló, F1 kismegszakító, PE-sín és az RA védőföldelő; az M1 fogyasztó PE-je csak az RA-n van. A talajon át záródó hibaáram-utat szaggatott nyíl jelöli. Szerelési rajz nézet: a tervező jelei, érszám 2 a hálózati, 3 az áramköri szakaszon. Működés nézet: H1 és SZ (a védőföldelő vezetőjének szakadása) gomb, alatta az állapottáblázat. Alsó sor: „Így látod a tervezőben: a PE egyszínű zöld.”]

<!-- sim:allapotok src=foldelesi-rendszerek-tt.netlist.json tomor -->
| H1 testzárlat M1-ben (fázis → fémház) | SZ a védőföldelő vezetőjének szakadása | H1: hibaáram útja | Q1: kiold? | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|
| nincs | bármely | nincs hiba | nem old ki | nincs |
| fennáll | ép | **a földön át** | **kiold** | **veszélyes lehet** a lekapcsolásig |
| fennáll | szakadt | nincs zárt hurok | nem old ki | **veszélyes lehet, tartósan**; a FI-relé legfeljebb a testen átfolyó áramra old ki |

_A táblázatot a szimulátor számolta a(z) `foldeles-tt` netlistából (ujjlenyomat: `553eca92`): 4 állapotkombináció, mindegyik egyezik a várt működéssel (a „bármely” sor az adott elem minden állására érvényes). Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé), kétpólusú: be (bekapcsolva); F1 kismegszakító (túláramvédelem): be (bekapcsolva); M1 fogyasztó: működik; F1: túláramvédelem: nem. Ellenőrzött szerkezet (TT): a csillagpont közvetlenül földelt (üzemi földelő); a fémházak védővezetője helyi földelőn van, vezetőn át nem kapcsolódik a csillagponthoz; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli._
<!-- /sim:allapotok -->

Az utolsó sor a TT-rendszer gyenge pontja: ha a védőföldelő vezetője elszakad, testzárlatkor nincs zárt hurok, és a fémház tartósan fázisfeszültségre kerülhet. A FI-relé legfeljebb akkor kapcsol le, amikor valaki megérinti a fémházat, és a testén át folyó áram eléri a kioldási értéket – vagyis csak az áramütés közben; nagyobb kioldási áramú (például tűzvédelmi célú) FI-relé egyáltalán nem old ki. Ezért a földelés folytonosságát, ellenállását és a FI-relé működését időszakos felülvizsgálat ellenőrzi.

## IT: földeletlen táppont, szigetelésfigyelés

Az IT-rendszerben a táppont csillagpontja nincs közvetlenül földelve, a fémházak viszont közös védővezetőn és földelőn vannak. Az első testzárlat nem ad zárt hurkot (a szórt kapacitáson át folyó kis áramot a szimuláció nem modellezi), ezért nem kell azonnal lekapcsolni; a **szigetelésfigyelő** jelez. Az első hiba azonban nem veszélytelen: utána a többi fázisvezető a földhöz képest vonali feszültségre kerülhet, ezért a hibát mielőbb meg kell szüntetni. Második testzárlatkor egy másik fázison a hibaáram a fémházakat összekötő védővezetőn át fémes hurokban folyik, és a túláramvédelemnek le kell kapcsolnia.

[ÁBRA: abra-5 „IT rendszer”. Forrás: foldelesi-rendszerek-it.netlist.json (id: foldeles-it). viewBox 0 0 480 260. Bekötés nézet: a transzformátor csillagpontja földeletlen (áthúzott földelésjel nélkül, „nincs közvetlenül földelve” felirattal), az SZF szigetelésfigyelő a hálózat és a PE között; Q1 és Q2 háromfázisú kismegszakító, az M1 és M2 háromfázisú fogyasztó, közös PE-sín és RA földelő. Szerelési rajz nézet: a tervező jelei, érszám 4 / 4. Működés nézet: H1 és H2 gomb, kiemelt hibaáram-út, „Szigetelésfigyelő: jelez” szöveges állapot, alatta az állapottáblázat. Alsó sor: „Így látod a tervezőben: a PE egyszínű zöld.”]

<!-- sim:allapotok src=foldelesi-rendszerek-it.netlist.json tomor -->
| H1 testzárlat M1-ben (L1 → fémház) | H2 testzárlat M2-ben (L2 → fémház) | H1: hibaáram útja | H2: hibaáram útja | Q1: túláramvédelem | Q2: túláramvédelem | SZF szigetelésfigyelő | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|---|---|---|
| nincs | nincs | nincs hiba | nincs hiba | nem | nem | nem jelez | nincs |
| nincs | fennáll | nincs hiba | nincs zárt hurok | nem | nem | **jelez** | nincs |
| fennáll | nincs | nincs zárt hurok | nincs hiba | nem | nem | **jelez** | nincs |
| fennáll | fennáll | **fémes hurok** | **fémes hurok** | **lekapcsolhat** | **lekapcsolhat** | **jelez** | **veszélyes lehet** a lekapcsolásig |

_A táblázatot a szimulátor számolta a(z) `foldeles-it` netlistából (ujjlenyomat: `60981084`): 4 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 háromfázisú kismegszakító (M1): be (bekapcsolva); Q2 háromfázisú kismegszakító (M2): be (bekapcsolva); M1 fogyasztó: működik; M2 fogyasztó: működik. Ellenőrzött szerkezet (IT): a csillagpont nincs közvetlenül földelve; a fémházak védővezetője helyi földelőn van, vezetőn át nem kapcsolódik a csillagponthoz; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli._
<!-- /sim:allapotok -->

IT-rendszert ott alkalmaznak, ahol a váratlan lekapcsolás nagyobb kockázat (például kórházi műtőben, egyes ipari folyamatoknál); saját transzformátorról táplált, lakossági csatlakozásnál nem fordul elő.

## Kapcsok és jelölés

A PEN-vezető zöld-sárga, a végein kék jelöléssel (vagy fordítva); bővebben: [[vezetekek-szinjelolese|Vezetékek színjelölése]]. Régi berendezésben a színek eltérhetnek: a vezető szerepét mérés dönti el, nem a szín. A szétválasztási ponton a sínek és kapcsok felirata és a híd kialakítása gyártónként eltérhet; mindig a gyártói útmutató és az elosztói engedélyes előírása az irányadó.

## Régi berendezésben

- **Kéteres „nullázott” áramkörök.** Régi lakásokban gyakran a dugalj védőérintkezője a dugaljban a nullavezetőre van kötve: ez vékony vezetővel kialakított TN-C. Nullavezető-szakadáskor a csatlakoztatott fémházas készülék háza a készüléken át, a fázis és a nulla felcserélésekor (dugaljban, kötődobozban, biztosítótáblán) közvetlenül kerül fázisfeszültségre. Az elé épített áram-védőkapcsoló a fémház testzárlatát nem érzékeli (a hibaáram a nullavezetőn, rajta át tér vissza); a korszerűsítéshez külön védővezető kell.
- **Megbízhatatlan színek.** Régi vezetékezésben a kék vagy akár a zöld-sárga ér is vezethet fázist.
- **Vegyes érintésvédelem.** Egyszerre megérinthető, de eltérően (nullázással és védőföldeléssel) védett fémházak: hiba esetén köztük veszélyes feszültség léphet fel.
- **Elkorrodált vagy hiányzó földelő,** meglazult földelővezető, régi vízcső mint földelő.
- **Újra összekötött N és PE** egy később beépített alelosztóban vagy dugaljban.

## Gyakori hibák

- A nulla- és a védővezető összekötése a szétválasztási pont után.
- PEN-vezető kapcsolón, biztosítón vagy áram-védőkapcsolón át; áram-védőkapcsoló TN-C-rendszerben.
- TT-rendszer áram-védőkapcsoló nélkül, vagy túl nagy földelési ellenállással.
- Gáz- vagy más éghető anyagot szállító fém csővezeték használata földelőként.
- IT-rendszerben a szigetelésfigyelő jelzésének figyelmen kívül hagyása.
- Annak feltételezése, hogy a zöld-sárga ér mindig védővezető, a kék mindig nulla, és hogy a nullavezető nem lehet feszültség alatt (nulla- vagy PEN-szakadás után a fogyasztón át fázisfeszültségre kerülhet). A szín nem mérés.
- Az áram-védőkapcsoló túlbecsülése: a PEN-szakadást, a fázis és a nulla egyidejű érintését és a túlterhelést nem érzékeli.

## Mikor hívj szakembert?

- Ha nem tudod, milyen földelési rendszerű a berendezésed, vagy régi, kéteres vezetékezést találsz.
- Ha egy fémházas készülék, csaptelep vagy kád „csíp”, bizsereg: ne érintsd meg újra, és ne keresd magad az okát. Ha áramütés ért valakit, ne érj hozzá, amíg áram alatt lehet, és hívd a 112-t.
- Ha a lámpák fényereje erősen ingadozik, egyes készülékek leállnak, mások melegszenek: ez nulla- vagy PEN-szakadás jele lehet. Kapcsold le a főkapcsolót, ha veszély nélkül megteheted; ne érints fémrészt (csaptelep, radiátor, készülékház), mert a lekapcsolás után is maradhat rajtuk feszültség; jelezd azonnal az elosztói engedélyes hibabejelentőjének és szakembernek.
- Áram-védőkapcsoló beépítéséhez, a berendezés átalakításához (például TN-C-ről TN-C-S-re), földelő vagy EPH kiépítéséhez.
- A mérőhelyen és a csatlakozáson végzett munkához mindig az elosztói engedélyes szabályai szerint, az ő engedélyével.
