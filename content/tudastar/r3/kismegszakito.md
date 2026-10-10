---
slug: kismegszakito
title: "Kismegszakító: B, C és D jelleggörbe, az Ib ≤ In ≤ Iz elve"
navTitle: "Kismegszakító"
summary: "Mit véd a kismegszakító, és mit nem? Hő- és elektromágneses kioldó, B, C és D jelleggörbe, feliratok, az Ib ≤ In ≤ Iz elve és az áramkörök az elosztóban."
section: elmelet
category: vedelmi-es-automatizalasi-eszkozok
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [kismegszakító, MCB, automata biztosíték, B jelleggörbe, C jelleggörbe, D jelleggörbe, kioldási jelleggörbe, névleges áram, Ib, In, Iz, I2, túlterhelés, rövidzárlat, megszakítóképesség, hőkioldó, elektromágneses kioldó, fésűs sín]
synonyms: [kismegszakito, biztosíték, automata, kis megszakító, kismegszakító típusok, kismegszakító betűjele, lekapcsol a biztosíték, leveri a biztosítékot, kiugrott a biztosíték, milyen kismegszakító kell, kismegszakító méretezése]
plannerModules: [MCB, RCBO]
related: [rovidzarlat-es-tulterheles, aram-vedokapcsolo-fi-rele, dugalj-bekotese, vezetek-es-kabeljelolesek, feszultsegmentesites-ot-szabalya, foldelesi-rendszerek]
calculators: [aram-teljesitmenybol, fazisterheles, vezetek-ellenallas]
figures:
  - id: abra-2
    netlist: kismegszakito.netlist.json
    views: [bekotes, szerelesi-rajz, mukodes]
sources:
  - standard: "MSZ EN 60898-1 (kismegszakítók háztartási és hasonló berendezések túláramvédelmére)"
    kiadás: "2019" # lektor ellenőrizze a honosítás évét és a hatályos kiadást
    pont: "5.3.5 (B, C, D pillanatkioldási tartományok); 8.6.1 és 7. táblázat (1,13 · In és 1,45 · In egyezményes áramok); 6 (jelölések)" # pontszámokat lektor ellenőrizze
  - standard: "MSZ HD 60364-4-43 (túláram elleni védelem)"
    kiadás: "2010" # lektor ellenőrizze
    pont: "433.1 (Ib ≤ In ≤ Iz és I2 ≤ 1,45 · Iz), 434 (zárlat elleni védelem), 434.5.1 (megszakítóképesség)" # a 434.5.1-et lektor ellenőrizze
  - standard: "MSZ HD 60364-5-52 (kábel- és vezetékrendszerek)"
    kiadás: "2011" # lektor ellenőrizze
    pont: "B melléklet (terhelhetőség, helyesbítő tényezők) – a számértékek kizárólag a lib/sizing-tables.ts-ben, jóváhagyásra várva"
  - standard: "MSZ HD 60364-4-41 (áramütés elleni védelem)"
    kiadás: "2007" # lektor ellenőrizze
    pont: "411.3.2 (önműködő lekapcsolás), 411.4.4 (Zs · Ia ≤ U0, TN-rendszer)"
  - standard: "MSZ HD 60364-4-46 (leválasztás és kapcsolás)"
    kiadás: "ellenőrizendő" # lektor adja meg a hatályos hazai kiadást
    pont: "461.2 (TN-C rendszerben a PEN-vezető nem választható le és nem kapcsolható)" # alpontot lektor ellenőrizze
  - standard: "MSZ EN 61009-1 (beépített túláramvédelemmel ellátott áram-védőkapcsolók, RCBO)"
    kiadás: "2013" # lektor ellenőrizze
    pont: "általános követelmények; a B, C, D jelleggörbe az MSZ EN 60898-1-gyel azonos értelmű" # lektor ellenőrizze
lektorKerdesek:
  - "A B, C, D pillanatkioldási tartományok (3–5, 5–10, 10–20 · In) és az 1,13 / 1,45 · In egyezményes áramok egyeznek-e a hatályos MSZ EN 60898-1-gyel? A felső határokat a lib/sizing-tables.ts is használja (ellenőrizendő)."
  - "Szükséges-e a cikkben a megszakítóképesség hazai minimumára (elosztói előírás) utalni, vagy elég a „tervezői döntés” megfogalmazás?"
  - "A „Jellemző alkalmazás” oszlop (B: lakás általános áramkörei, C: nagy bekapcsolási áram, D: nagyon nagy bekapcsolási áram) elfogadható-e így, számok nélkül?"
  - "A TT-rendszerre tett állítás („a testzárlati áram jellemzően a kismegszakító kioldásához is kicsi; ott az önműködő lekapcsolást is áram-védőkapcsoló végzi”) elfogadható-e így, számok nélkül?"
  - "Az MSZ HD 60364-4-46 461.2 pontja (TN-C rendszerben a PEN-vezető nem választható le és nem kapcsolható) a hatályos hazai kiadásban is így szerepel-e?"
ai: vázlat
review: lektorra-var
version: 0.1
updated: 2026-10-10
---

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

**Röviden:** A kismegszakító az áramkör vezetékét védi túlterhelés és rövidzárlat ellen: túlterhelésnél a hőkioldója késleltetve, zárlatnál az elektromágneses kioldója azonnal bont. A feliratában a betű (B, C vagy D) azt mutatja, a névleges áram hányszorosánál old ki azonnal, a szám pedig a névleges áramot. A névleges áram nem lehet kisebb az áramkör üzemi áramánál, és nem lehet nagyobb a vezeték terhelhetőségénél: Ib ≤ In ≤ Iz.

[ÁBRA: abra-1 „B, C és D jelleggörbe (sematikus)”. Saját SVG, netlista nélkül. Log–log diagram, viewBox 360 × 260, rácsvonalak --kk-border. Vízszintes tengely: I / In, 1-től 100-ig (osztások: 1; 1,13; 1,45; 3; 5; 10; 20; 100); függőleges tengely: kioldási idő 0,01 s-tól 10 000 s-ig (kiemelve: 0,1 s és 3600 s = „1 óra”). Három sáv (.fig-band), mindhárom ugyanabból a hőkioldói tartományból indul (1,13 · In és 1,45 · In között, az 1 órás vonalnál), és a pillanatkioldási tartományában esik 0,1 s alá: B 3–5 · In (--kk-primary), C 5–10 · In (--kk-accent), D 10–20 · In (--kk-muted-strong); a sávok kitöltése 25 % átlátszóságú, a betűjel a sáv alján, a megkülönböztetés mintázattal (sraffozás iránya) is, nem csak színnel. Tartománycímkék: „hőkioldó – késleltetve” (bal felső rész), „elektromágneses kioldó – azonnal” (jobb alsó rész). Alul .fig-small: „Sematikus ábra, nem méretezésre; a pontos görbét a gyártói adatlap adja meg.” title: „Kismegszakító-jelleggörbék”; desc: a három pillanatkioldási tartomány szöveges felsorolása.]

## Mire való?

A vezetékben folyó áram hőt termel, és a túl nagy áram tartósan túlmelegíti a szigetelést és a kötéseket. A kismegszakító ezt akadályozza meg: **elsősorban a vezetéket védi**, nem a csatlakoztatott készüléket. A jelenségek részletes magyarázata a [[rovidzarlat-es-tulterheles|Rövidzárlat és túlterhelés]] cikkben olvasható.

TN-rendszerben a kismegszakító az érintésvédelemben is részt vesz. Ha a fázisvezető egy fémházas készülék testével zárlatba kerül, a védővezetőn nagy hibaáram folyik, és a kismegszakító ezt is lekapcsolja (önműködő lekapcsolás). Ehhez a hurokimpedanciának elég kicsinek kell lennie. Egy ember testén átfolyó, már életveszélyes áram viszont nagyságrendekkel kisebb annál, amelyre a kismegszakító kiold, ezért **ha valaki a fázist érinti, a kismegszakító nem old ki**; erre a kiegészítő védelemre az [[aram-vedokapcsolo-fi-rele|áram-védőkapcsoló (FI-relé)]] szolgál. TT-rendszerben a földelési ellenállás miatt a testzárlati áram jellemzően a kismegszakító kioldásához is kicsi; ott az önműködő lekapcsolást is áram-védőkapcsoló végzi.

## Két kioldó egy készülékben

- **Hőkioldó (ikerfém).** Az áram melegíti, ettől elhajlik, és kioldja a zárszerkezetet. Minél nagyobb a túlterhelés, annál hamarabb old ki; kis túlterhelésnél ez egy óra vagy annál is több lehet.
- **Elektromágneses kioldó.** Egy tekercs, amely nagy áramnál azonnal, a másodperc töredéke alatt kiold.
- **Ívoltó kamra.** A bontáskor keletkező ívet hűti és megszakítja.

A kismegszakító szabadkioldású: ha a kart bekapcsolt helyzetben tartják, hibánál akkor is kiold.

## B, C és D jelleggörbe

A jelleggörbe betűje azt mutatja meg, a névleges áram (In) hányszorosánál működik az elektromágneses kioldó. A tartomány alsó határa alatt még nem old ki azonnal, a felső határánál már biztosan igen (MSZ EN 60898-1).

| Jelleggörbe | Azonnali kioldás | Jellemző alkalmazás |
|---|---|---|
| B | 3–5 · In | lakások általános áramkörei, hosszabb vezetékek |
| C | 5–10 · In | nagyobb bekapcsolási áramú fogyasztók (motorok, transzformátorok, sok LED-meghajtó) |
| D | 10–20 · In | nagyon nagy bekapcsolási áramú berendezések; lakásban ritka |

A választás tervezői döntés. Minél „magasabb” a betű, annál nagyobb zárlati áram kell az azonnali kioldáshoz, vagyis annál kisebb hurokimpedancia. Hosszú vagy vékony vezetéknél ezért előfordulhat, hogy egy C vagy D kismegszakító zárlatkor csak a lassú hőkioldóval működne; testzárlatnál ilyenkor a fémtesteken a megengedettnél tovább maradhat veszélyes érintési feszültség. A tartományok felső határát a Villanyrajz méretezési segédszámítása is használja; ezek a táblázatértékek még szakmai jóváhagyásra várnak.

A hőkioldó tartományában két egyezményes áram számít: 1,13 · In-nél a kismegszakító legalább egy óráig nem old ki, 1,45 · In-nél egy órán belül biztosan kiold (63 A névleges áramig; a vizsgálati feltételeket a szabvány rögzíti). Ezt az utóbbit nevezik egyezményes kioldóáramnak (I2).

## Kapcsok és feliratok

- **Betű és szám,** például „C16”: C jelleggörbe, 16 A névleges áram. Hogy egy áramkörhöz mekkora névleges áram kell, az méretezés kérdése (lásd lent).
- **Keretbe írt szám:** a névleges zárlati megszakítóképesség amperben. Ennyi zárlati áramot tud biztonságosan megszakítani; a beépítés helyén várható legnagyobb zárlati áramnál nem lehet kisebb.
- **Pólusszám:** 1P (egy fázis), 1P+N, 2P, 3P, 3P+N. A lakásban az egyfázisú áramkörök kismegszakítója jellemzően egypólusú: csak a fázist bontja.
- **Kapcsok:** a készülék egyik oldalán a betáp, a másikon a kimenő vezeték csatlakozik (gyakran 1 és 2 jelöléssel). A kismegszakítók betápja sokszor fésűs sínről érkezik. A kapocsjelölés, a betáp oldala és a megengedett vezetőkeresztmetszet gyártónként eltérhet; a gyártói útmutató az irányadó.

## Az Ib ≤ In ≤ Iz elve

- **Ib** – az áramkör tervezett üzemi árama (az Áram teljesítményből kalkulátor segít kiszámolni).
- **In** – a kismegszakító névleges árama.
- **Iz** – a vezeték tartós terhelhetősége az adott beépítési körülmények között.

A második feltétel: I2 ≤ 1,45 · Iz. Mivel az MSZ EN 60898-1 szerinti kismegszakítónál I2 = 1,45 · In, ez az In ≤ Iz feltétellel együtt teljesül.

Az Iz nem csak a keresztmetszettől függ, hanem a szigeteléstől, a szerelési módtól (falba süllyesztve, védőcsőben, falon), a környezeti hőmérséklettől és attól is, hány terhelt vezeték fut együtt. A számértékeket a Villanyrajz egy helyen, forrással tartja nyilván; ezek **jóváhagyásra várnak**, ezért ez a cikk nem ad keresztmetszet–névleges áram párokat. A szakmában elterjedt ökölszabályok sem helyettesítik a méretezést, mert nem veszik figyelembe a beépítés körülményeit.

A teljes ellenőrzéshez a túlterhelés elleni védelmen túl a feszültségesés, a hurokimpedancia (önműködő lekapcsolás) és a megszakítóképesség is hozzátartozik. A tervezőben az Eszközök → Méretezés segédszámítás áramkörönként végigveszi ezeket; ez tervezői ellenőrzést segít, nem tervezői méretezés.

## Áramkörök az elosztóban

Minden áramkör saját kismegszakítót kap. A 2. ábrán két dugaljkör egy közös áram-védőkapcsoló után kapcsolódik; a kismegszakítókat fésűs sín táplálja.

[ÁBRA: abra-2 „Két dugaljkör saját kismegszakítóval, közös FI-relé után”. Forrás: kismegszakito.netlist.json (id: kismegszakito-aramkorok); a rajz, a vezetéktábla, a desc és a Működés nézet ebből készül, kézzel nem rajzolható át. viewBox 0 0 460 240, elhelyezés a netlista layout mezője szerint. Bekötés nézet: balra a lakáselosztó (betáp-gyűjtősín, Q1 kétpólusú áram-védőkapcsoló, nullasín, PE-sín, F1 és F2 kismegszakító „fésűs sín” felirattal összekötve), jobbra az X1 (nappali) és az X2 (konyha) dugalj saját háromeres vezetékkel. Színek: L barna, N kék, PE zöld-sárga. Szerelési rajz nézet: a tervező MCB- és RCD-moduljai az elosztósorban, két socket jel, érszám-vonalkák (3 / 3). Működés nézet: Q1, F1, F2 gomb (aria-pressed), kiemelt áramút, szöveges állapot dugaljanként, alatta az állapottáblázat. Alsó sor (.fig-small): „Így látod a tervezőben: a PE egyszínű zöld.” title: „Két áramkör az elosztóban”; desc: a netlistából generált leírás.]

<!-- sim:allapotok src=kismegszakito.netlist.json -->
| Q1 áram-védőkapcsoló (FI-relé) | F1 kismegszakító (nappali dugaljak) | F2 kismegszakító (konyhai dugaljak) | X1 dugalj (nappali) | X2 dugalj (konyha) |
|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | be (bekapcsolva) | **feszültség alatt** | **feszültség alatt** |
| be (bekapcsolva) | be (bekapcsolva) | ki (kikapcsolva) | **feszültség alatt** | nem ad feszültséget |
| be (bekapcsolva) | ki (kikapcsolva) | be (bekapcsolva) | nem ad feszültséget | **feszültség alatt** |
| be (bekapcsolva) | ki (kikapcsolva) | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | be (bekapcsolva) | be (bekapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | be (bekapcsolva) | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | ki (kikapcsolva) | be (bekapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | ki (kikapcsolva) | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |

_A táblázatot a szimulátor számolta a(z) `kismegszakito-aramkorok` netlistából (ujjlenyomat: `3bf085c5`): 8 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé): nem old ki. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig és védőérintkezőig folytonos, és nem halad át kapcsolón; a kismegszakító csak a fázist bontja; minden dugalj kismegszakítón és áram-védőkapcsolón át kap feszültséget; a nullavezetőt csak a kétpólusú áram-védőkapcsoló bontja, a fázisvezetővel együtt; normál üzemben nem folyik különbözeti áram. „Kiold”: a védett oldalról a pólusokat megkerülve (a védővezetőn, a földön vagy a próbaellenálláson át) áram folyik; áramerősséget, érintési feszültséget és kioldási időt a szimuláció nem számol._
<!-- /sim:allapotok -->

Az F1 lekapcsolása csak a nappali dugaljak táplálását szünteti meg, a konyhaiakét nem; az áram-védőkapcsoló mindkét áramkört lekapcsolja. A kismegszakító csak a fázist bontja, a nullavezető a nullasínen összeköttetésben marad: **egy kismegszakító lekapcsolása önmagában nem feszültségmentesítés** (lásd: [[feszultsegmentesites-ot-szabalya|A feszültségmentesítés öt szabálya]]).

<!-- sim:vezetekek src=kismegszakito.netlist.json -->
| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp (gyűjtősín): L | Q1 áram-védőkapcsoló (FI-relé): 1 (fázis, táp oldal) | L | barna | elosztón belül |
| 2 | Betáp (gyűjtősín): N | Q1 áram-védőkapcsoló (FI-relé): N (táp oldal) | N | kék | elosztón belül |
| 3 | Q1 áram-védőkapcsoló (FI-relé): N (védett oldal) | Nullasín (N) a FI-relé után: N | N | kék | elosztón belül |
| 4 | Betáp (gyűjtősín): PE | PE-sín: PE | PE | zöld-sárga | elosztón belül |
| 5 | Q1 áram-védőkapcsoló (FI-relé): 2 (fázis, védett oldal) | F1 kismegszakító (nappali dugaljak): 1 (be) | L | barna | elosztón belül |
| 6 | F1 kismegszakító (nappali dugaljak): 1 (be) | F2 kismegszakító (konyhai dugaljak): 1 (be) | L (fésűs sín) | barna | elosztón belül |
| 7 | F1 kismegszakító (nappali dugaljak): 2 (ki) | X1 dugalj (nappali): L kapocs | L | barna | Elosztó – X1 dugalj (nappali) |
| 8 | Nullasín (N) a FI-relé után: N | X1 dugalj (nappali): N kapocs | N | kék | Elosztó – X1 dugalj (nappali) |
| 9 | PE-sín: PE | X1 dugalj (nappali): védőérintkező kapocs | PE | zöld-sárga | Elosztó – X1 dugalj (nappali) |
| 10 | F2 kismegszakító (konyhai dugaljak): 2 (ki) | X2 dugalj (konyha): L kapocs | L | barna | Elosztó – X2 dugalj (konyha) |
| 11 | Nullasín (N) a FI-relé után: N | X2 dugalj (konyha): N kapocs | N | kék | Elosztó – X2 dugalj (konyha) |
| 12 | PE-sín: PE | X2 dugalj (konyha): védőérintkező kapocs | PE | zöld-sárga | Elosztó – X2 dugalj (konyha) |
<!-- /sim:vezetekek -->

## Kismegszakító, FI-relé, kombinált védelem

A kismegszakító túláram ellen véd, az áram-védőkapcsoló a befolyó és a visszatérő áram különbségét figyeli. A kettő nem helyettesíti egymást. A kombinált védelem (RCBO, „áramvédős kismegszakító”) egy készülékben egyesíti a kettőt, áramkörönként; így egy áramkör szivárgása nem kapcsolja le a többit.

## Régi berendezésben

- **Olvadóbiztosítók.** A kiégett betét csak azonos névleges áramú és jellegű betétre cserélhető. Az átkötött („megpatkolt”) biztosíték életveszélyes és tűzveszélyes.
- **Menetes „automata biztosíték”,** amely a biztosítófoglalatba csavarható; az állapotát és a megfelelőségét szakember mérje fel.
- **Biztosító vagy kapcsoló a nullavezetőben.** Régi elosztókban előfordul. Ha a nullavezetőben lévő biztosító kiold vagy kiolvad, a fogyasztók nem működnek, de fázison maradnak: a készülék belseje és a nullavezető fogyasztó felőli része is feszültség alá kerül. Egypólusú védelem nem bonthatja a nullavezetőt, a közös nulla- és védővezetőt (PEN) pedig semmilyen kapcsoló- vagy védelmi készülék nem bonthatja.
- **Alumínium vezetékek:** a terhelhetőségük kisebb, mint az azonos keresztmetszetű rézé, ezért a régi kismegszakító névleges árama túl nagy lehet hozzájuk.
- **Nincs áram-védőkapcsoló, nincs külön PE-sín,** elöregedett, éghető anyagú elosztódoboz.
- **Sokszor zárlatra kioldott kismegszakító:** az érintkezői beéghettek, szakember vizsgálja meg.

## Gyakori hibák

- **Nagyobb kismegszakító, „mert mindig lekapcsol”.** A vezeték így túlmelegedhet, mielőtt a védelem működne. Az okot (túlterhelés, hibás készülék, laza kötés) kell megkeresni.
- **Indokolatlanul magas jelleggörbe:** zárlatkor elmaradhat az azonnali kioldás, testzárlatnál pedig az önműködő lekapcsolás nem elég gyors.
- **Nullavezető az egypólusú kismegszakítón át,** a fázis pedig közvetlenül a fogyasztóra jut: lekapcsolt kismegszakító mellett is fázis marad a fogyasztón. A szimulátor az ilyen netlistát elutasítja.
- **Dugaljkör kismegszakító nélkül,** például közvetlenül az áram-védőkapcsoló védett kapcsáról: az áramkörnek nincs túláramvédelme. A szimulátor ezt is kiszűri.
- **Idegen nullasín:** egy áramkör nullavezetője egy másik áram-védőkapcsoló utáni vagy az áram-védőkapcsoló előtti nullasínen. Terheléskor kioldást okoz; a szimulátor ezt is kiszűri.
- **Közös nullavezető két áramkörben:** a lekapcsolt áramkör nullája ilyenkor is áramot vezethet.
- **Laza vagy túlhúzott kapocs:** melegedés, elszíneződés.
- **Hiányzó vagy téves feliratozás** az elosztóban: rossz áramkört kapcsolnak le.
- **Túl kicsi megszakítóképesség** a beépítés helyén várható zárlati áramhoz képest.

## Mikor hívj szakembert?

- Ha egy kismegszakító ismételten lekapcsol, visszakapcsoláskor azonnal kiold, vagy egy biztosítóbetét ismételten kiolvad. Ne kapcsold vissza újra és újra.
- Ha az elosztó meleg, elszíneződött, kattog, zümmög, vagy égett szagot érzel. Füst vagy tűz esetén hívd a 112-t.
- Ha nagy fogyasztót (főzőlap, sütő, villanybojler, klíma, elektromosautó-töltő) kötnél egy meglévő áramkörre.
- Ha olvadóbiztosítós vagy áram-védőkapcsoló nélküli elosztód van.
- Bármilyen munkához az elosztóban. Az elosztó burkolata mögött a lekapcsolt kismegszakítók mellett is feszültség alatti részek vannak: a burkolatot ne szereld le. A mérőhely és a fogyasztásmérő előtti rész az elosztói engedélyes hatásköre.
