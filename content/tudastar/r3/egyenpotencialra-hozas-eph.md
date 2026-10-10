---
slug: egyenpotencialra-hozas-eph
title: "Egyenpotenciálra hozás (EPH): fő és kiegészítő potenciálkiegyenlítés"
navTitle: "Egyenpotenciálra hozás (EPH)"
summary: "Mit köt össze az EPH, mi a fő EPH-sín, mikor kell kiegészítő EPH, és miért nem helyettesíti a védővezetőt? Működés PEN-szakadásnál és testzárlatnál."
section: elmelet
category: erintesvedelem
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [EPH, egyenpotenciálra hozás, egyenpotenciálú hálózat, potenciálkiegyenlítés, védő egyenpotenciálú összekötés, fő EPH-sín, főföldelő sín, EPH-vezető, kiegészítő EPH, helyi EPH, idegen vezetőképes rész, alapföldelő, fürdőszoba, vízvezeték, gázvezeték]
synonyms: [eph bekötés, eph sín, eph gerinc, potenciál kiegyenlítés, egyenpotenciál, földelés vízcsőre, csőföldelés, kád földelése, fürdőszoba földelés, eph vezeték, főföldelő kapocs]
related: [foldelesi-rendszerek, vezetekek-szinjelolese, aram-vedokapcsolo-fi-rele, dugalj-bekotese, feszultsegmentesites-ot-szabalya, ip-vedettseg]
calculators: []
figures:
  - id: abra-1
    netlist: egyenpotencialra-hozas-eph.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
sources:
  - standard: "MSZ HD 60364-4-41 (áramütés elleni védelem)"
    kiadás: "2007 (HD 60364-4-41:2007)" # lektor ellenőrizze
    pont: "411.3.1.2 (védő egyenpotenciálú összekötés), 415.2 (kiegészítő védő egyenpotenciálú összekötés)" # alpontokat lektor ellenőrizze
  - standard: "MSZ HD 60364-5-54 (földelő berendezések és védővezetők)"
    kiadás: "2012 (HD 60364-5-54:2011)" # lektor ellenőrizze
    pont: "542.4 (fő földelőkapocs), 544.1 (fő EPH-vezetők), 544.2 (kiegészítő EPH-vezetők)" # lektor ellenőrizze
  - standard: "MSZ HD 60364-7-701 (fürdő- és zuhanyozóhelyiségek)"
    kiadás: "2007" # lektor ellenőrizze a hatályos kiadást
    pont: "701.415.2 (kiegészítő védő egyenpotenciálú összekötés)" # lektor ellenőrizze
  - standard: "MSZ HD 60364-5-51"
    kiadás: "2010" # lektor ellenőrizze
    pont: "514.13.1 (figyelmeztető felirat a földelő- és EPH-csatlakozásokon)" # lektor ellenőrizze
  - standard: "MSZ EN 62305-3 (villámvédelem – építmények fizikai károsodása és életvédelem)"
    kiadás: "2011" # lektor ellenőrizze
    pont: "6.2 (villámvédelmi potenciálkiegyenlítés)" # lektor ellenőrizze
lektorKerdesek:
  - "A fürdőszobai kiegészítő EPH: a hatályos MSZ HD 60364-7-701 szerint mikor kötelező, és mikor hagyható el (például 30 mA-es áram-védőkapcsolóval védett áramköröknél)? A cikk most csak a tervezői döntésre utal."
  - "A gázvezeték EPH-bekötésének hazai szabályai (szigetelő közdarab, a bekötés helye, gázszolgáltatói előírás) – elegendő-e a puszta hivatkozás?"
  - "A fő EPH-vezető és a kiegészítő EPH-vezető legkisebb keresztmetszete: a cikk szándékosan nem ad számot. Kell-e jóváhagyott táblázat?"
  - "A szimuláció a fém vízvezetéket a talajjal érintkezőnek tekinti. Ez a mai, műanyag bekötővezetékes házakban gyakran nem igaz; elég-e ezt a cikkben megemlíteni?"
ai: vázlat
review: lektorra-var
version: 0.1
updated: 2026-10-10
---

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól; elvi ismereteket ad, nem szerelési utasítás. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre; a gázvezetéken végzett munkára a gázszolgáltató előírásai vonatkoznak. A kapcsok és bilincsek jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

**Röviden:** Az egyenpotenciálra hozás (EPH) az épületbe belépő fém csővezetékeket, fémszerkezeteket és a védővezető-rendszert egy közös sínen, a fő EPH-sínen köti össze. Célja, hogy az egyszerre megérinthető fémrészek között hiba esetén se alakulhasson ki veszélyes feszültség. Fürdőszobában és más különleges helyiségekben kiegészítő (helyi) EPH is szükséges lehet; az EPH a védővezetőt és az önműködő lekapcsolást nem helyettesíti, hanem kiegészíti.

## Miért kell?

Áramütést nem a „feszültség alatti tárgy” okoz önmagában, hanem az, ha két egyszerre megérintett pont között feszültség van. Egy lakásban sok ilyen pár akad: a mosógép fémháza és a vízcsap, a hűtő és a radiátor, a villanybojler és a kád. A készülékek fémháza a védővezetőn át (TN-rendszerben) a táppont csillagpontjához kötött, a csővezetékek viszont kívülről, a talajból érkeznek, és a saját potenciáljukat hozzák magukkal. Hiba, például PEN-szakadás vagy testzárlat esetén a kettő között veszélyes feszültség jöhet létre. Az EPH ezeket a részeket egy pontban összeköti, így nincs köztük olyan feszültség, amely egy emberen át áramot hajthatna.

## Fogalmak

- **Test:** a villamos berendezés megérinthető vezetőképes része, amely üzem közben nincs feszültség alatt, de hiba esetén feszültség alá kerülhet (például egy fémház).
- **Idegen vezetőképes rész:** nem a villamos berendezéshez tartozó fémrész, amely kívülről potenciált hozhat be: víz-, fűtés- és gázvezeték, épületszerkezeti acél, fém szellőzőcsatorna.
- **Fő EPH-sín** (főföldelő sín vagy -kapocs): az a közös gyűjtőpont, ahol a fő védővezető, az épület földelőjének vezetője és a fő EPH-vezetők találkoznak.
- **Kiegészítő (helyi) EPH:** egy helyiségen belül az egyszerre megérinthető testeket és idegen vezetőképes részeket köti össze, a fő EPH-hoz képest is.

## Mit kötnek a fő EPH-sínre?

Jellemzően az épületbe belépő fém víz- és fűtésvezetéket, a gázvezetéket (a gázszolgáltató előírása szerint kialakított ponton), az épület hozzáférhető fémszerkezeteit, a fém kábelpáncélokat és -köpenyeket, az épület földelőjét (például az alapföldelőt), valamint a villámvédelmi potenciálkiegyenlítés vezetőit. A teljes felsorolást, a vezetők keresztmetszetét és a kötések kialakítását a szabvány és a tervező határozza meg; ez a cikk szándékosan nem ad meg számokat. TN-C-S-rendszerben a fő EPH-sín jellemzően a betáplálás közelében van, és a fő védővezető köti össze a PEN szétválasztási pontjának védővezető-sínjével (lásd: [[foldelesi-rendszerek|Földelési rendszerek]]).

## Hogyan működik?

Az ábra egy TN-C-S-rendszerű épületet mutat. A fém vízvezeték a talajból lép be, ezért a szimulációban a talajjal is érintkezik. Két érintési pontot vizsgálunk: a mosógép fémháza és a vízcsap (U1), illetve a fémház és a föld (U2) között.

[ÁBRA: abra-1 „A fő EPH-sín és a vízvezeték bekötése”. Forrás: egyenpotencialra-hozas-eph.netlist.json (id: eph-alapok); a rajz, a vezetéktábla, a desc és a Működés nézet ebből készül, kézzel nem rajzolható át. viewBox 0 0 500 260, elhelyezés a layout mező szerint (earthing-svg). Bekötés nézet: balra a transzformátor PEN-csillagpontja az RB földelővel, a hálózaton L1 és PEN; középen a PSZ szétválasztási pont, alatta a fő EPH-sín, amelyre a fő védővezető, az RA alapföldelő földelővezetője és a vízvezeték EPH-vezetője fut; jobbra az M1 mosógép (fémház) és a VIZ vízvezeték csapteleppel. A két érintési pontot (U1: fémház–csap, U2: fémház–föld) szaggatott kettős nyíl jelöli. Szerelési rajz nézet: alaprajzi vázlat a tervező jeleivel (lakáselosztó, EPH-sín a BOARD EPH elemeként, dugalj a mosógépnek), a fő EPH-vezető nyomvonalával. Működés nézet: három gomb (H1 testzárlat, EPH1 a vízvezeték EPH-bekötése, SZ PEN-szakadás; aria-pressed), kiemelt áramút és szöveges állapot, alatta az állapottáblázat. Alsó sor (.fig-small): „Így látod a tervezőben: a PE egyszínű zöld, az EPH-sín az elosztó EPH eleme.”]

<!-- sim:allapotok src=egyenpotencialra-hozas-eph.netlist.json tomor -->
| H1 testzárlat M1-ben (fázis → fémház) | EPH1 a vízvezeték EPH-bekötése | SZ PEN-szakadás a hálózatban | M1 fogyasztó | H1: hibaáram útja | Q1: kiold? | F1: túláramvédelem | Érintés – M1 fémháza és a vízcsap | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|---|---|---|---|
| nincs | bármely | ép | **működik** | nincs hiba | nem old ki | nem | nincs | nincs |
| nincs | bekötve | szakadt | rendellenesen (a földön át) | nincs hiba | nem old ki | nem | nincs | **veszélyes lehet, tartósan** |
| nincs | hiányzik | szakadt | rendellenesen (a földön át) | nincs hiba | nem old ki | nem | **veszélyes lehet, tartósan** | **veszélyes lehet, tartósan** |
| fennáll | bármely | ép | **működik** | **fémes hurok** | **kiold** | **lekapcsolhat** | **veszélyes lehet** a lekapcsolásig | **veszélyes lehet** a lekapcsolásig |
| fennáll | bármely | szakadt | rendellenesen (a földön át) | **a földön át** | **kiold** | nem | **veszélyes lehet** a lekapcsolásig | **veszélyes lehet** a lekapcsolásig |

_A táblázatot a szimulátor számolta a(z) `eph-alapok` netlistából (ujjlenyomat: `d0990558`): 8 állapotkombináció, mindegyik egyezik a várt működéssel (a „bármely” sor az adott elem minden állására érvényes). Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé), kétpólusú: be (bekapcsolva); F1 kismegszakító (túláramvédelem): be (bekapcsolva). Ellenőrzött szerkezet (TN-C-S): a csillagpont közvetlenül földelt (üzemi földelő); minden fémház vezetőn át a csillagponthoz kötött; a PEN-vezető egyetlen ponton válik szét, utána a nulla- és a védővezető nem egyesül újra; az idegen vezetőképes részek EPH-val a védővezető-rendszerhez kötöttek; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli._
<!-- /sim:allapotok -->

A táblázat három tanulsága:

1. **Ép PEN mellett, hiba nélkül** az EPH megléte vagy hiánya a szimulációban nem látszik: ideális vezetőkkel minden pont azonos potenciálon van. A valóságban a csőhálózat kívülről idegen potenciált is behozhat, ezért az EPH ilyenkor is szükséges.
2. **PEN-szakadáskor** a fogyasztó árama az épület földelőjén és a talajon át keres utat, a teljes védővezető-rendszer potenciálja megemelkedik, és ezt semmi nem kapcsolja le. Ha a vízvezeték be van kötve, a fémház és a csap ugyanazon a potenciálon marad (U1: nincs feszültség); ha az EPH hiányzik, a kettő között veszélyes feszültség lehet. A távoli földhöz képest (U2) az EPH sem segít: az egész összekötött rendszer potenciálja megemelkedik, ezért különösen veszélyes ilyenkor a kerti csap, a kültéri fémszerkezet és a szabadban használt fémházas készülék. A FI-relé ezt a helyzetet sem érzékeli.
3. **Testzárlatkor** az önműködő lekapcsolás véd. A lekapcsolásig a fémház a hibaáram útjában van; a fő EPH ilyenkor a fémház és a csőhálózat közötti feszültséget a védővezetőnek a fő EPH-sín és a fémház közötti szakaszán eső feszültségre csökkenti. Ez a szakasz a teljes áramköri védővezető lehet, így a maradó feszültség jelentős is lehet; ezért kell a gyors lekapcsolás, és ezért írhat elő a szabvány egyes helyiségekben kiegészítő EPH-t. A feszültség nagyságát a szimuláció nem számolja, csak jelzi, hogy a lekapcsolásig veszély állhat fenn.

<!-- sim:szakaszok src=egyenpotencialra-hozas-eph.netlist.json -->
| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztói hálózat és csatlakozás (az engedélyes hatásköre) | L1 (barna), PEN (zöld-sárga) | 2 |
| Fogyasztói áramkör | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Fő EPH-vezető a vízvezetékhez | EPH-vezető (zöld-sárga) | 1 |
<!-- /sim:szakaszok -->

## Kiegészítő (helyi) EPH

Fürdő- és zuhanyozóhelyiségben, uszodában vagy szaunában nagyobb az áramütés veszélye, mert a nedves bőr ellenállása kisebb. Itt a helyiségen belüli fémrészeket (fém kád és zuhanytálca, fém csövek, fűtőtest) kiegészítő EPH-vezetővel köthetik össze egymással és a védővezetővel. Hogy egy adott helyiségben kell-e kiegészítő EPH, és mit kell bekötni, azt a hatályos szabvány fürdőszobai része és a tervező határozza meg. Mai műanyag csöves fürdőszobákban sokszor nincs is bekötendő idegen vezetőképes rész; hogy egy fémrész annak minősül-e, azt is a tervező vagy a felülvizsgáló ítéli meg, nem a szemrevételezés. A kiegészítő EPH az áram-védőkapcsolót nem helyettesíti.

## Kapcsok és jelölés

Az EPH-sín kapcsainak száma és kialakítása, valamint a csőbilincsek mérete és jelölése gyártónként eltérhet; a gyártói útmutató az irányadó. A csőbilincset korrózióálló, a cső anyagához illő kivitelben, tiszta fémfelületre szerelik. A földelő- és EPH-csatlakozásokon tartós figyelmeztető felirat jelzi, hogy a kötés biztonsági célú, és nem bontható. Az EPH-vezető zöld-sárga (lásd: [[vezetekek-szinjelolese|Vezetékek színjelölése]]).

## Régi berendezésben

- **Hiányzó fő EPH.** Régebbi házakban gyakran nincs fő EPH-sín, vagy csak a vízóra mellett van egy bilincs, amelyről nem tudni, hová vezet.
- **Megszakított csővezeték.** Műanyag szakasszal felújított fém csőhálózatnál a régi bilincs már csak a cső egy darabját köti be.
- **Vízcső mint földelő.** Régen a fém vízvezetéket földelőként is használták; műanyag bekötővezetéknél ez a földelés megszűnik.
- **Nullázott berendezés EPH nélkül.** Régi, nullázott berendezésben nulla- vagy PEN-szakadáskor a fémházak és a csövek között nagy feszültség léphet fel, és a csövön, a régi földelővezetőn üzemi áram is folyhat.
- **Elkorrodált, festékkel átfestett bilincsek,** laza kötések.

## Gyakori hibák

- Az EPH-vezető „áthurkolása” úgy, hogy egy cső kiszerelésekor a többi kötés is megszakad.
- Gázvezeték bekötése a gázszolgáltató által előírt ponttól eltérő helyen, vagy a szigetelő közdarab áthidalása.
- Az EPH összetévesztése a földeléssel: az EPH elsősorban a fémrészeket köti össze egymással, nem a talajjal.
- Az EPH-vezető kiszerelése csőcsere vagy burkolás közben, visszakötés nélkül.
- **Fém csővezeték átvágása vagy EPH-vezető bontása a villamos berendezés ismerete nélkül.** Hiba esetén (például PEN-szakadáskor vagy hibás N–PE-összekötésnél) a csövön és az EPH-vezetőn áram folyhat; a bontás pillanatában a két szétválasztott vég között életveszélyes feszültség jelenhet meg, és szikra is keletkezhet.
- Annak feltételezése, hogy az EPH miatt nem kell áram-védőkapcsoló vagy védővezető.

## Mikor hívj szakembert?

- Ha a csaptelep, a kád, a radiátor vagy egy fémházas készülék „csíp”, bizsereg. Ne érintsd meg újra, és ne próbáld magad kideríteni az okát. Ha áramütés ért valakit, ne érj hozzá, amíg áram alatt lehet, és hívd a 112-t.
- Csőcsere, fürdőszoba-felújítás vagy gázvezeték-átalakítás előtt és után: előtte, hogy a fém csővezeték bontása veszélytelen-e, utána, hogy az EPH-kötések megmaradtak-e, vagy pótolni kell őket.
- Ha nem találod a fő EPH-sínt, vagy nem tudod, mi van rá kötve.
- Villámvédelem, napelem vagy hőszivattyú telepítésekor: ezek a potenciálkiegyenlítést is érintik.
- A gázvezetékkel kapcsolatos bármely kötéshez a gázszolgáltató előírásai szerint.
