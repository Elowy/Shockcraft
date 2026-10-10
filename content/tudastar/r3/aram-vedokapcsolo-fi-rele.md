---
slug: aram-vedokapcsolo-fi-rele
title: "Áram-védőkapcsoló (FI-relé): működés, 30 mA, típusok, próbagomb"
navTitle: "Áram-védőkapcsoló (FI-relé)"
summary: "Hogyan érzékeli a FI-relé a hibaáramot, mit jelent a 30 mA, miben különbözik az AC, A, F és B típus, mire jó a próbagomb, és mi ellen nem véd?"
section: elmelet
category: vedelmi-es-automatizalasi-eszkozok
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [áram-védőkapcsoló, FI-relé, RCD, különbözeti áram, hibaáram, 30 mA, IΔn, összegáramváltó, próbagomb, teszt gomb, AC típus, A típus, F típus, B típus, kiegészítő védelem, érintésvédelem, RCBO, nullasín]
synonyms: [fi rele, firelé, fi, életvédelmi relé, életvédelmi kapcsoló, hibaáram-védőkapcsoló, ávk, lekapcsol a fi, leveri a fi-t, fi relé teszt gomb, fi relé típusok, áramvédő kapcsoló]
plannerModules: [RCD, RCBO]
related: [kismegszakito, dugalj-bekotese, foldelesi-rendszerek, rovidzarlat-es-tulterheles, feszultsegmentesites-ot-szabalya, vezetekek-szinjelolese]
calculators: []
figures:
  - id: abra-2
    netlist: aram-vedokapcsolo-fi-rele.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
  - id: abra-3
    netlist: aram-vedokapcsolo-fi-rele-hibahelyzetek.netlist.json
    views: [bekotes, mukodes]
sources:
  - standard: "MSZ EN 61008-1 (beépített túláramvédelem nélküli áram-védőkapcsolók, RCCB)"
    kiadás: "2013" # lektor ellenőrizze a honosítás évét és a hatályos kiadást
    pont: "az AC és az A típus meghatározása; a névleges különbözeti áram és a nem működési áram; a legnagyobb kioldási idők táblázata" # pontszámokat lektor adja meg
  - standard: "MSZ EN 61009-1 (beépített túláramvédelemmel ellátott áram-védőkapcsolók, RCBO)"
    kiadás: "2013" # lektor ellenőrizze
    pont: "általános követelmények" # lektor pontosítsa
  - standard: "MSZ EN 62423 (F és B típusú áram-védőkapcsolók)"
    kiadás: "2013 (EN 62423:2012)" # lektor ellenőrizze
    pont: "az F és a B típus érzékelési tartománya" # pontszámot lektor adja meg
  - standard: "MSZ HD 60364-4-41 (áramütés elleni védelem)"
    kiadás: "2007 (HD 60364-4-41:2007)" # lektor ellenőrizze; újabb kiadás honosítása kérdéses
    pont: "411.3.3 (kiegészítő védelem a dugaljáramkörökre), 411.4.5 (TN-C rendszerben áram-védőkapcsoló nem alkalmazható), 415.1 (kiegészítő védelem legfeljebb 30 mA-es áram-védőkapcsolóval)" # alpontokat lektor ellenőrizze
  - standard: "MSZ HD 60364-5-53 (kapcsoló- és vezérlőkészülékek kiválasztása és szerelése)"
    kiadás: "ellenőrizendő (HD 60364-5-53:2022?)" # lektor adja meg a hatályos hazai kiadást
    pont: "531.3 (áram-védőkapcsolók; a típus kiválasztása)" # alpontot lektor ellenőrizze
  - standard: "MSZ HD 60364-7-701 (fürdő- és zuhanyozóhelyiségek)"
    kiadás: "2007" # lektor ellenőrizze
    pont: "701.411.3.3 (kiegészítő védelem)" # lektor ellenőrizze
  - standard: "MSZ HD 60364-7-722 (elektromos járművek táplálása)"
    kiadás: "ellenőrizendő" # lektor adja meg
    pont: "az áram-védőkapcsoló típusára vonatkozó alpont (B típus, vagy egyenáramú hibaáram-érzékelés)" # pontszámot lektor adja meg
  - standard: "IEC TS 60479-1 (az áram hatása emberre és háziállatokra)"
    kiadás: "2018" # lektor ellenőrizze
    pont: "5 (15–100 Hz-es váltakozó áram hatásai, idő–áram tartományok)"
  - standard: "MSZ HD 60364-6 (ellenőrzés)"
    kiadás: "2017 (HD 60364-6:2016)" # lektor ellenőrizze
    pont: "6.4.3 (mérések, köztük az áram-védőkapcsoló működésének ellenőrzése)" # alpontot lektor ellenőrizze
lektorKerdesek:
  - "Egyezik-e a hatályos MSZ EN 61008-1-gyel: kioldás IΔn/2 és IΔn között; általános típusnál legfeljebb 0,3 s IΔn-nél és 0,04 s 5 · IΔn-nél?"
  - "Az AC típus alkalmazhatóságáról a cikk csak óvatosan fogalmaz („sok helyen korlátozott”). Kell-e konkrét hazai előírásra hivatkozni (MSZ HD 60364-5-53, 531.3.3)?"
  - "Tegyen-e a cikk konkrét javaslatot a próbagomb használatának gyakoriságára, vagy maradjon a „gyártó által megadott időközönként”?"
  - "A próbaáramkör netlistabeli modellje (védett oldali fázis → ellenállás → táp oldali nulla) elfogadható-e általános elvként?"
  - "A hibahelyzet-ábrán a testzárlatnál TN-rendszerben a kismegszakító is működhet; elég-e ezt a szövegben megemlíteni?"
  - "A „Mi ellen nem véd?” két új pontja (PEN-szakadás TN-C-S rendszerben; a feszültségmentesítést nem helyettesíti) és a „nulla–védővezető összekötés a FI után rontja az érzékenységet” állítás elfogadható-e így?"
  - "A P1 esetnél a cikk most kimondja, hogy jól szigetelő padlón az áram a kioldási érték alatt maradhat. Kell-e ehhez szám (IΔn/2) vagy az IEC TS 60479-1 tartományaira hivatkozás?"
ai: vázlat
review: lektorra-var
version: 0.1
updated: 2026-10-10
---

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

**Röviden:** Az áram-védőkapcsoló (FI-relé) összeveti az áramkörbe befolyó és az onnan visszatérő áramot, és ha a különbség eléri az érzékenységét, a fázis- és a nullavezetőt is lekapcsolja. A 30 mA-es készülék kiegészítő védelmet ad áramütés ellen: kiold, ha valakin át a fázisból a föld felé elegendő áram folyik; az áramütést nem akadályozza meg, csak az időtartamát korlátozza. A fázis és a nulla egyidejű érintésétől, a túlterheléstől és a rövidzárlattól viszont nem véd.

[ÁBRA: abra-1 „Az összegáramváltó elve (sematikus)”. Saját SVG, netlista nélkül. viewBox 360 × 220. Középen gyűrű alakú vasmag (--kk-muted-strong); rajta egymás mellett halad át a fázisvezető (--wire-l1, barna) és a nullavezető (--wire-n, kék), a gyűrűn egy kis szekunder tekercs, amelyből vezeték megy a „kioldó” feliratú dobozhoz, onnan szaggatott vonal a kapcsolóérintkezőkhöz. Két panel: 1. „Nincs hiba”: a fázison befelé, a nullán kifelé mutató, azonos vastagságú nyíl, felirat: „befolyó = visszatérő → nincs kioldás”. 2. „Hibaáram”: a nullán vékonyabb visszatérő nyíl, és egy harmadik, piros szaggatott nyíl (--kk-danger-line) a fogyasztó házától a föld felé, felirat: „a különbség a földön/védővezetőn tér vissza → kiold”. A különbséget a nyílvastagság és a felirat együtt jelzi, nem csak a szín. Alul .fig-small: „Sematikus ábra; a valódi készülékben a kialakítás gyártónként eltér.”]

## Hogyan működik?

A fázis- és a nullavezető együtt halad át egy gyűrű alakú vasmagon, az összegáramváltón. Hibátlan áramkörben a befolyó és a visszatérő áram egyenlő és ellentétes irányú, így mágneses hatásuk kioltja egymást. Ha az áram egy része más úton tér vissza, a védővezetőn, a földön vagy egy emberen keresztül, különbség marad. Ez a vasmag tekercsében feszültséget kelt, amely a kioldót működteti. A négypólusú (háromfázisú) készülékben mind a négy vezető (L1, L2, L3, N) áthalad a vasmagon, és az áramok összege számít.

A névleges különbözeti áram (IΔn) az érzékenységet adja meg: minél kisebb, annál érzékenyebb a készülék. Ennek felénél még nem, a névleges értéknél már biztosan kiold. Általános (késleltetés nélküli) kivitelnél a kioldási idő IΔn-nél legfeljebb 0,3 s, ötszörösénél legfeljebb 0,04 s. A szelektív (S jelű) változat szándékosan késleltetve old ki. A FI-relé tehát nem az áram nagyságát, hanem **az áramütés időtartamát** korlátozza.

## Bekötés és próbagomb

A lakáselosztóban a kétpólusú áram-védőkapcsoló táp oldalára a betáp fázis- és nullavezetője kerül. A védett oldali fázisról indulnak a kismegszakítók, a védett oldali nullavezető pedig egy külön nullasínre kerül. Erre a sínre **csak** az általa védett áramkörök nullavezetője köthető. A védővezető nem halad át a készüléken. A védett oldalon a nullavezető sehol nem érintkezhet a védővezetővel vagy a földdel: az ilyen kötés terheléskor kioldást okoz, és amíg nem old ki, a hibaáram egy része a nullavezetőn, a vasmagon át tér vissza, vagyis a védelem érzékenysége romlik.

[ÁBRA: abra-2 „Áram-védőkapcsoló bekötése dugaljkör elé, próbagombbal”. Forrás: aram-vedokapcsolo-fi-rele.netlist.json (id: fi-rele-bekotes); a rajz, a vezetéktábla, a desc és a Működés nézet ebből készül, kézzel nem rajzolható át. viewBox 0 0 500 220. Bekötés nézet: balra a betáp-gyűjtősín (L, N, PE), mellette a Q1 kétpólusú áram-védőkapcsoló táp és védett oldali kapcsokkal; a házán belül a T próbagomb és a próbaellenállás vékony, szürke, „belső” jelölésű vonallal (nem szerelt ér); a védett oldalon a nullasín és az F1 kismegszakító, külön PE-sín; jobbra az X1 dugalj és a dugóval csatlakozó M1 mosógép (fémház, PE). Színek: L barna, N kék, PE zöld-sárga. Szerelési rajz nézet: a tervező RCD- és MCB-modulja, socket jel. Működés nézet: Q1, T, F1 gomb (aria-pressed), kiemelt áramút; a próbagomb megnyomásakor a próbaáram útja kiemelve, szöveges állapot („Q1 kiold”). Alsó sor (.fig-small): „Így látod a tervezőben: a PE egyszínű zöld.” title: „FI-relé bekötése”; desc: a netlistából generált leírás.]

<!-- sim:vezetekek src=aram-vedokapcsolo-fi-rele.netlist.json -->
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
| 9 | X1 dugalj: L kapocs | M1 mosógép (I. érintésvédelmi osztály, fémház): L | L | barna | Csatlakozózsinór és dugó |
| 10 | X1 dugalj: N kapocs | M1 mosógép (I. érintésvédelmi osztály, fémház): N | N | kék | Csatlakozózsinór és dugó |
| 11 | X1 dugalj: védőérintkező kapocs | M1 mosógép (I. érintésvédelmi osztály, fémház): fémház (PE) | PE | zöld-sárga | Csatlakozózsinór és dugó |
<!-- /sim:vezetekek -->

A próbagomb a készülék belsejében egy ellenálláson át az egyik pólus védett oldalát a másik pólus táp oldalával köti össze; az ábrán a védett oldali fázist a táp oldali nullával, a pontos kialakítás gyártónként eltér. A próbaáram így csak az egyik póluson halad át a vasmagon: különbözeti áramot hoz létre, és a készülék kiold, a kismegszakító állásától függetlenül. A táblázat a gomb megnyomásának pillanatát mutatja; a kioldás után a védett áramkörök nem kapnak táplálást, ez azonban nem feszültségmentesítés.

<!-- sim:allapotok src=aram-vedokapcsolo-fi-rele.netlist.json -->
| Q1 áram-védőkapcsoló (FI-relé) | Q1 próbagomb (T) | F1 kismegszakító (dugaljkör) | M1 mosógép | X1 dugalj | Q1 áram-védőkapcsoló (FI-relé): kiold? |
|---|---|---|---|---|---|
| be (bekapcsolva) | nyugalom (nincs megnyomva) | be (bekapcsolva) | **működik** | **feszültség alatt** | nem old ki |
| be (bekapcsolva) | nyugalom (nincs megnyomva) | ki (kikapcsolva) | nem működik | nem ad feszültséget | nem old ki |
| be (bekapcsolva) | megnyomva | be (bekapcsolva) | **működik** | **feszültség alatt** | **kiold** |
| be (bekapcsolva) | megnyomva | ki (kikapcsolva) | nem működik | nem ad feszültséget | **kiold** |
| ki (kikapcsolva) | nyugalom (nincs megnyomva) | be (bekapcsolva) | nem működik | nem ad feszültséget | nem old ki |
| ki (kikapcsolva) | nyugalom (nincs megnyomva) | ki (kikapcsolva) | nem működik | nem ad feszültséget | nem old ki |
| ki (kikapcsolva) | megnyomva | be (bekapcsolva) | nem működik | nem ad feszültséget | nem old ki |
| ki (kikapcsolva) | megnyomva | ki (kikapcsolva) | nem működik | nem ad feszültséget | nem old ki |

_A táblázatot a szimulátor számolta a(z) `fi-rele-bekotes` netlistából (ujjlenyomat: `8f0e1c8c`): 8 állapotkombináció, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig és védőérintkezőig folytonos, és nem halad át kapcsolón; a kismegszakító csak a fázist bontja; minden dugalj kismegszakítón és áram-védőkapcsolón át kap feszültséget; a nullavezetőt csak a kétpólusú áram-védőkapcsoló bontja, a fázisvezetővel együtt; normál üzemben (hibahelyzet, érintés és próbagomb nélkül) nem folyik különbözeti áram. „Kiold”: a védett oldalról a pólusokat megkerülve (a védővezetőn, a földön vagy a próbaellenálláson át) áram folyik; áramerősséget, érintési feszültséget és kioldási időt a szimuláció nem számol._
<!-- /sim:allapotok -->

## Mikor old ki, és mikor nem?

[ÁBRA: abra-3 „Hibahelyzetek: testzárlat, fázis–föld és fázis–nulla érintés”. Forrás: aram-vedokapcsolo-fi-rele-hibahelyzetek.netlist.json (id: fi-rele-hibahelyzetek). viewBox 0 0 500 260. Bekötés nézet: az abra-2 elosztója és dugalja, a mosógéppel; három kapcsolható hibahely jelképes impedanciaként (szaggatott keret, nem szerelt ér): H1 a mosógép fázisa és fémháza között; P1 emberalak a fázis és a föld (padló) között; P2 emberalak a fázis és a nulla között, a földtől elszigetelve. Működés nézet: H1, P1, P2 kapcsoló (aria-pressed), a hibaáram útja kiemelve, szöveges állapot („különbözeti áram: van/nincs – Q1 kiold/nem old ki”). title: „Mikor old ki a FI-relé?”; desc: a netlistából generált leírás.]

<!-- sim:allapotok src=aram-vedokapcsolo-fi-rele-hibahelyzetek.netlist.json -->
| H1 testzárlat a mosógépben (fázis → fémház) | P1 érintés: fázis és föld | P2 érintés: fázis és nulla, a földtől elszigetelve | H1: hibaáram | P1: áram a testen át | P2: áram a testen át | Q1 áram-védőkapcsoló (FI-relé): kiold? |
|---|---|---|---|---|---|---|
| nincs | nincs | nincs | nem | nem | nem | nem old ki |
| nincs | nincs | fennáll | nem | nem | **áram folyik át rajta** | nem old ki |
| nincs | fennáll | nincs | nem | **áram folyik át rajta** | nem | **kiold** |
| nincs | fennáll | fennáll | nem | **áram folyik át rajta** | **áram folyik át rajta** | **kiold** |
| fennáll | nincs | nincs | **hibaáram folyik** | nem | nem | **kiold** |
| fennáll | nincs | fennáll | **hibaáram folyik** | nem | **áram folyik át rajta** | **kiold** |
| fennáll | fennáll | nincs | **hibaáram folyik** | **áram folyik át rajta** | nem | **kiold** |
| fennáll | fennáll | fennáll | **hibaáram folyik** | **áram folyik át rajta** | **áram folyik át rajta** | **kiold** |

_A táblázatot a szimulátor számolta a(z) `fi-rele-hibahelyzetek` netlistából (ujjlenyomat: `704b52c6`): 8 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé): be (bekapcsolva); F1 kismegszakító (dugaljkör): be (bekapcsolva); M1 mosógép: működik; X1 dugalj: feszültség alatt. A szerelt vezetékezésben (a jelképes hibahelyet és érintést nem számítva) egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig és védőérintkezőig folytonos, és nem halad át kapcsolón; a kismegszakító csak a fázist bontja; minden dugalj kismegszakítón és áram-védőkapcsolón át kap feszültséget; a nullavezetőt csak a kétpólusú áram-védőkapcsoló bontja, a fázisvezetővel együtt; normál üzemben (hibahelyzet, érintés és próbagomb nélkül) nem folyik különbözeti áram. „Kiold”: a védett oldalról a pólusokat megkerülve (a védővezetőn, a földön vagy a próbaellenálláson át) áram folyik; áramerősséget, érintési feszültséget és kioldási időt a szimuláció nem számol._
<!-- /sim:allapotok -->

A táblázat a hiba pillanatát mutatja, a kioldás előtt; a Q1 és az F1 végig bekapcsolt.

- **Testzárlat (H1):** a hibaáram a védővezetőn tér vissza, megkerüli a vasmagot, a FI-relé kiold. TN-rendszerben a nagy hibaáram miatt a kismegszakító is működhet.
- **Fázis–föld érintés (P1):** az emberen átfolyó áram a földön tér vissza; ha eléri a kioldási értéket, a FI-relé kiold. A táblázat ezt az esetet mutatja. Jól szigetelő padlón vagy cipőben az áram a kioldási érték alatt maradhat; ilyenkor a FI-relé nem old ki, az áramütés mégis érezhető, és például létráról esést okozhat.
- **Fázis–nulla érintés (P2):** az áram ugyanúgy be- és visszafolyik a vasmagon át, mint egy fogyasztóé. Nincs különbség, a FI-relé **nem old ki**, pedig áram folyik a testen át.

## A 30 mA és a többi érzékenység

- **30 mA:** személyvédelmi célú kiegészítő védelem. A hatályos előírások a laikusok által használt dugaljáramkörökre, fürdőszobákra és több más helyre előírják (MSZ HD 60364-4-41 és a 7. rész egyes lapjai); a részletekről és a kivételekről a tervező dönt.
- **Ennél érzékenyebb készülék** (például 10 mA-es) különleges helyeken fordul elő.
- **Kevésbé érzékeny készülék** (például 100 vagy 300 mA-es): tűzvédelmi célú vagy csoportvédelem; a közvetlen érintés elleni kiegészítő védelemre nem alkalmas.

## Típusok: AC, A, F, B

| Típus | Milyen hibaáramot érzékel | Jellemző alkalmazás |
|---|---|---|
| AC | csak szinuszos váltakozó áramot | régi berendezésekben gyakori; ma sok helyen csak korlátozottan alkalmazható |
| A | mint az AC, és a lüktető (egyenirányított) egyenáramot is | a legtöbb háztartási áramkör, elektronikus tápegységek |
| F | mint az A, és a vegyes frekvenciájú hibaáramot is | egyfázisú frekvenciaváltós készülékek (inverteres mosógép, klíma, hőszivattyú) |
| B | mint az F, és a sima egyenáramot is | háromfázisú frekvenciaváltók, egyes elektromosautó-töltők és napelemes inverterek, ha a gyártó előírja |

A sima egyenáramú hibaáram „elvakíthatja” az AC vagy A típusú készüléket, amely ilyenkor egy valódi hibánál sem old ki. A típust ezért a csatlakozó készülékek és a gyártói előírások alapján a tervező választja meg.

## A próbagomb

A „T” jelű próbagomb a kioldó szerkezet és a belső áramkör működését ellenőrzi; a gyártó által megadott időközönként érdemes megnyomni. Megnyomásakor a védett áramkörök táplálása megszűnik (kikapcsol például a hűtő, a riasztó vagy a számítógép). A próbagomb nem méri a kioldási áramot és időt, és a védővezetőt sem ellenőrzi: a próbaáramkör nem halad át rajta. Ezeket a szakember műszerrel méri. Ha a készülék a próbagombra nem old ki, a védett áramkörök kiegészítő védelem nélkül maradnak: hívj szakembert.

## Kapcsok és jelölésük

A kétpólusú készülék kapcsai jellemzően 1–2 (fázis) és N–N (nulla), a négypólusúé 1–2, 3–4, 5–6 és N–N. A nullapólus helye (bal vagy jobb szélen), valamint a betáp oldala (felül vagy alul) gyártónként eltérhet; a gyártói útmutató az irányadó. Az előlapon szerepel a névleges áram, az IΔn (például 0,03 A), a típus jele és a próbagomb. A névleges áram azt mutatja, mekkora üzemi áramot vezethet tartósan és kapcsolhat a készülék. Túláram ellen nem véd, ezért a gyártó által megadott túláramvédelemmel együtt kell alkalmazni.

## Mi ellen nem véd?

- A fázis és a nulla (vagy két fázis) egyidejű érintése ellen, ha az érintő a földtől el van szigetelve (P2 eset).
- Túlterhelés és rövidzárlat ellen: erre a [[kismegszakito|kismegszakító]] vagy a kombinált védelem (RCBO) szolgál.
- Az áramütés érzetét, az ijedtséget és az ebből eredő balesetet (például létráról esést) nem akadályozza meg.
- A laza kötés melegedése és a soros ív ellen sem, mert ott nincs különbözeti áram.
- A készülék előtti szakaszon (betáp, mérőhely) nem véd.
- A PEN-vezető szakadása ellen sem: TN-C-S rendszerben a szakadás után a védővezetőre kötött fémtestek a fogyasztókon át fázisfeszültségre kerülhetnek, és a FI-relé ezt nem érzékeli, mert a fogyasztók árama a vasmagon át változatlanul visszatér, a pólusok áramai között nincs különbség (lásd: [[foldelesi-rendszerek|Földelési rendszerek]]).
- Nem helyettesíti a feszültségmentesítést: a lekapcsolt vagy kioldott FI-relé mellett a feszültségmentességet akkor is méréssel kell ellenőrizni, a FI-relé előtti részek és a többi áramkör pedig feszültség alatt maradnak.
- Nem helyettesíti a védővezetőt: védővezető nélkül egy testzárlatos készülék háza addig feszültség alatt marad, amíg valaki meg nem érinti.

## Régi berendezésben

- **Nincs áram-védőkapcsoló** a dugaljáramkörök előtt.
- **Közös nulla- és védővezető (PEN, TN-C).** Ilyen szakaszon a FI-relé nem alkalmazható; előtte a PEN-vezetőt N- és PE-vezetőre kell szétválasztani (lásd: [[foldelesi-rendszerek|Földelési rendszerek]]). A szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze; a szétválasztás helyéről szakember dönt, a mérőhelynél az elosztói engedélyes szabályai szerint. A „nullázott” dugalj a FI-relé után kioldást okoz.
- **AC típusú, régóta nem működtetett készülék,** amelynek a szerkezete beragadhatott.
- **Közös nullavezetőjű áramkörök,** amelyeket nem lehet szétválasztani a FI-relék között.

## Gyakori hibák

- **Nulla- és védővezető összekötése a FI-relé után** (lámpatestben, dugaljban): terheléskor kioldás, addig pedig romlik a védelem érzékenysége. A szimulátor az ilyen netlistát elutasítja.
- **Idegen nullasín:** a védett áramkör nullája a FI-relé előtti vagy egy másik FI-relé utáni nullasínen. Terheléskor kiold; a szimulátor kiszűri.
- **A FI-relé áthidalása vagy kiiktatása** a gyakori kioldás miatt: életveszélyes.
- **Túl sok áramkör egy FI-relén:** a készülékek kis szivárgó áramai összeadódnak, és egy hiba mindent lekapcsol.
- **Nem megfelelő típus** a csatlakozó készülékekhez.

## Mikor hívj szakembert?

- Ha a FI-relé lekapcsol, és visszakapcsolás után újra kiold. Ha egy készülék csatlakoztatásakor old ki, azt ne használd tovább.
- Ha a próbagomb megnyomására nem old ki.
- Ha az elosztódban nincs áram-védőkapcsoló.
- Ha elektromosautó-töltő, hőszivattyú, napelemes inverter vagy más frekvenciaváltós berendezés kerül a házba: a típust meg kell választani.
- Azonnal, ha egy készülék fémházának vagy más fémrésznek az érintésekor bizsergést érzel: ne érintsd újra, kapcsold le az áramkört az elosztóban, és amíg szakember meg nem vizsgálta, ne kapcsold vissza.
- Ha valakit áramütés ért: ne érintsd meg, amíg áram alatt lehet; ha biztonságosan megteheted, kapcsold le az áramot, és hívd a 112-t. A további teendőket a mentésirányító mondja meg. Utána a berendezést szakember vizsgálja meg.
