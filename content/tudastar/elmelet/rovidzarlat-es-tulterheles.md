---
slug: rovidzarlat-es-tulterheles
title: "Rövidzárlat és túlterhelés: mi a különbség, miért old le a védelem"
navTitle: "Rövidzárlat és túlterhelés"
summary: "Túlterhelés vagy rövidzárlat? Mi történik a vezetékben, mekkora áram folyik, és miért old le a kismegszakító egyszer lassan, máskor azonnal."
section: elmelet
category: alapfogalmak
risk: R2
audience: [laikus, tanulo, szakember]
keywords: [rövidzárlat, zárlat, túlterhelés, túláram, zárlati áram, kismegszakító leold, hőkioldó, elektromágneses kioldó, B C D jelleggörbe, megszakítóképesség, olvadóbiztosító]
synonyms: [rovidzarlat, zarlat, tulterheles, tularam, leold a kismegszakító, lecsapott a biztosíték, kiugrott a biztosíték, kivágta a biztosítékot, zárlatos]
related: [kismegszakito, aram-vedokapcsolo-fi-rele, kirchhoff-torvenyei, soros-es-parhuzamos-kapcsolas, transzformator-mukodese, foldelesi-rendszerek]
calculators: [aram-teljesitmenybol, ohm-torveny, vezetek-ellenallas, teljesitmeny]
sources:
  - standard: "MSZ HD 60364-4-43"
    kiadás: "2010"
    pont: "433.1 (Ib ≤ In ≤ Iz és I2 ≤ 1,45 · Iz), 434 (zárlat elleni védelem)"
  - standard: "MSZ EN 60898-1"
    kiadás: "2019" # lektor ellenőrizze a honosítás évét
    pont: "5.3.5 (B, C, D pillanatkioldási tartományok); 8.6.1 és 7. táblázat (1,13 · In és 1,45 · In egyezményes áramok)" # a 8.6.1 és a 7. táblázat számát lektor ellenőrizze
  - standard: "IEC 60050-826 (Nemzetközi Elektrotechnikai Szótár – villamos berendezések)"
    kiadás: "2022"
    pont: "826-11-14 (túláram), 826-11-15 (túlterhelési áram), 826-11-16 (zárlati áram)" # a 826-11-15 megerősítve, a 14 és 16 lektor ellenőrizze
  - standard: "IEC 60028"
    kiadás: "1925 (2. kiadás)"
    pont: "a lágyított réz 20 °C-os fajlagos ellenállása (1/58 Ω·mm²/m)"
ai: vázlat
version: 0.1
updated: 2026-10-10
---

> **Figyelem:** Ez a cikk a jelenségeket magyarázza el, nem szerelési vagy hibakeresési útmutató. Villamos berendezésen, a kismegszakító cseréjét is beleértve, csak szakképzett személy (villanyszerelő) dolgozhat. Ha egy áramkör visszakapcsolás után újra leold, ne próbálkozz újra és újra: hívj szakembert.

**Röviden:** Túlterhelésnél az áramkör ép, csak egyszerre túl sok fogyasztó működik rajta. Az áram ilyenkor a névlegesnek kis többszöröse, a vezeték lassan melegszik, és a kismegszakító késleltetve old le. Rövidzárlatnál egy hiba megkerüli a fogyasztót, így annak ellenállása kiesik az áramkörből: az áram a névleges sokszorosára ugrik, és megfelelően méretezett áramkörben a védelem a másodperc töredéke alatt bont.

## Túláram: a közös gyűjtőfogalom

**Túláramnak** nevezünk minden olyan áramot, amely nagyobb annál, amire az áramkört méretezték. Két fő fajtája van:

- **túlterhelési áram:** az áramkör ép, de a rajta működő fogyasztók együtt több áramot vesznek fel a megengedettnél;
- **zárlati áram:** hiba miatt két, egymáshoz képest feszültség alatt álló vezető, például a fázisvezető (L) és a nullavezető (N), vagy két fázis között közel ellenállás nélküli kapcsolat jön létre.

A méretezés három áramértéket hangol össze:

- **Ib:** az áramkör várható üzemi árama;
- **In:** a védelem (kismegszakító, olvadóbiztosító) névleges árama;
- **Iz:** a vezeték tartós terhelhetősége az adott szerelési módban és környezetben.

A túlterhelés elleni védelem feltétele Ib ≤ In ≤ Iz, valamint I2 ≤ 1,45 · Iz, ahol I2 az az áram, amely a védelem működését az egyezményes időn belül biztosítja (lásd lent). Ebből látszik, hogy a kismegszakító elsősorban **a vezetéket védi** a túlmelegedéstől, nem a készüléket.

[ÁBRA: abra-1 „Ugyanaz az áramkör háromféle állapotban”. Három panel egymás mellett (mobilon egymás alatt), egyenként viewBox 220 × 160. Mindegyiken: bal oldalt forrás „230 V”, felül L vezeték (--kk-wire-l1), alul N vezeték (--kk-wire-n), „L” és „N” betűjellel. 1. „Normál”: egy fogyasztó-téglalap, vékony (2 px) áramnyíl (--kk-primary), „8,7 A”. 2. „Túlterhelés”: három párhuzamos fogyasztó, közepes (4 px) áramnyíl (--kk-warn-line), „22,6 A”, a vezeték mellett hullámos hőjel. 3. „Rövidzárlat”: a fogyasztó előtt villám alakú, vastag összekötés az L és N között (--kk-danger-line), vastag (8 px) áramnyíl ugyanilyen színnel, „≈ 400 A”; a fogyasztó szürke (--kk-muted), áram nélkül. Panelnevek .fig-label. Az áram nagyságát a vonalvastagság és a felirat együtt jelzi, nem csak a szín.]

## Túlterhelés: ép áramkör, túl sok fogyasztó

A vezetékben keletkező hő a P = I² · R összefüggés szerint az áram négyzetével nő. Kis túlterhelés is jóval több hőt termel. A túlmelegedő szigetelés gyorsabban öregszik, a kötések és csatlakozások melegszenek, végső soron tűz keletkezhet.

### Számpélda: túlterhelt dugaljkör

Egy 16 A-es kismegszakítóval védett dugaljkörön egyszerre működik egy vízforraló (2000 W), egy hősugárzó (2000 W) és egy kenyérpirító (1200 W). Mindegyik ellenállásjellegű, a feszültség 230 V.

- összteljesítmény: 2000 + 2000 + 1200 = 5200 W
- áram: I = 5200 W / 230 V = 22,61 A
- túlterhelés: 22,61 / 16 = 1,41-szeres
- a vezeték hőfejlődése: 1,41² ≈ 2,0-szeres, vagyis közel kétszer annyi hő, mint névleges áramnál

A kismegszakító túlterhelési része egy hőkioldó (ikerfém), amely az áram hőhatására hajlik, és késleltetve old. Az MSZ EN 60898-1 két egyezményes áramot ad meg; az egyezményes idő 63 A névleges áramig egy óra:

- **1,13 · In** (itt 18,08 A): ennyit a kismegszakító legalább egy óráig elvisel leoldás nélkül;
- **1,45 · In** (itt 23,2 A): ennyi áramnál egy órán belül biztosan leold.

A példabeli 22,61 A a két érték közé esik. A kismegszakító tehát hosszú ideig bekapcsolva maradhat, és az sem biztos, hogy egy órán belül leold. Ez a sáv nem hiba: a hőkioldó működési pontja készülékenként és a környezeti hőmérséklettel kissé eltér, és a rövid ideig tartó többletterhelés (például egy motor indulása) a vezetéket nem károsítja. Azt, hogy a vezeték a sáv felső határáig tartó túlterhelést is elviselje, a vezeték megfelelő megválasztása (I2 ≤ 1,45 · Iz) biztosítja. Nagyobb túlterhelésnél a hőkioldó gyorsabban működik. Az áramot az Áram teljesítményből kalkulátor számolja ki.

## Rövidzárlat: a hiba megkerüli a fogyasztót

Normál üzemben az áramot főleg a fogyasztó ellenállása korlátozza: egy 2000 W-os vízforralóé 26,45 Ω. Rövidzárlatnál ez kiesik a hurokból, és csak a vezetékek, valamint a hálózat felőli rész (transzformátor, elosztóhálózat, fővezeték) kis impedanciája marad. A [[kirchhoff-torvenyei|huroktörvény]] szerint a teljes 230 V erre a kis ellenállásra jut.

### Számpélda: egyszerűsített zárlatiáram-becslés

A zárlat egy dugaljnál következik be, amely 20 m-re van az elosztótól, 2,5 mm²-es rézvezetékkel. A hurok az L és az N vezetőn át 40 m hosszú.

- a vezetékek ellenállása 20 °C-on: R = 0,01724 Ω·mm²/m · 40 m / 2,5 mm² = 0,276 Ω
- a hálózat felőli rész impedanciája (feltételezett érték): 0,30 Ω
- a hurok összesen: 0,276 + 0,30 = 0,576 Ω
- zárlati áram: Ik = 230 V / 0,576 Ω ≈ 399 A, azaz kb. 400 A

Ez a vízforraló 8,7 A-es áramának kb. 46-szorosa. A vezeték hőfejlődése az áram négyzetével arányos, ezért kb. 2100-szoros. A becslés egyszerűsített: 20 °C-os vezetékkel számol, a reaktanciát elhanyagolja, és a hálózat felőli impedancia a valóságban helyenként nagyon eltérő. A tényleges értéket a szakember méréssel (az L–N hurok impedanciájának mérésével) ellenőrzi.

### Miért old le azonnal?

A kismegszakító zárlati része egy elektromágneses kioldó: egy tekercs, amelynek mágneses tere nagy áramnál elmozdít egy vasmagot, az pedig kioldja a zárszerkezetet. A bontás így 0,1 s-nál rövidebb idő alatt megtörténik. Hogy ez mekkora áramnál következik be, azt a jelleggörbe betűje mutatja (MSZ EN 60898-1). Mindhárom betűhöz egy-egy áramtartomány tartozik: a tartomány alsó határa alatt a kioldás még nem azonnali, a felső határánál már biztosan az. Egy 16 A-es kismegszakítóra számolva:

- **B jelleggörbe:** a névleges áram 3–5-szöröse, vagyis 48–80 A;
- **C jelleggörbe:** a névleges áram 5–10-szerese, vagyis 80–160 A;
- **D jelleggörbe:** a névleges áram 10–20-szorosa, vagyis 160–320 A.

A példabeli kb. 400 A egy B16-os kismegszakítónál jóval a 80 A-es felső határ fölött van, ezért a kioldás azonnali. Ebből az is látszik, miért nem lehet a hurok ellenállása tetszőlegesen nagy. Nagyon hosszú vagy vékony vezetéknél a zárlati áram a pillanatkioldási tartomány alá eshet, és ilyenkor a védelem csak a lassú hőkioldóval működik.

A kismegszakítónak arra is képesnek kell lennie, hogy a zárlati áramot biztonságosan megszakítsa. Ezt a névleges zárlati megszakítóképesség mutatja, amely a készüléken egy keretbe írt számként szerepel, például „6000” (A). A transzformátor közelében a zárlati áram több ezer amper is lehet; ennek okát a [[transzformator-mukodese|Transzformátor működése]] cikk magyarázza el.

A rövidzárlat veszélye a hőn túl a villamos ív: a fém megolvad, szétfröccsen, és a nagy áram a vezetőkre jelentős mechanikai erőt is kifejt (ez is az áram négyzetével nő). Az olvadóbiztosító ugyanezt a feladatot oldja meg: nagy áramnál az olvadószála gyorsan, kis túlterhelésnél lassan olvad el.

## Földzárlat és testzárlat röviden

Ha a fázisvezető egy készülék fémházával (testével) vagy a védővezetővel (PE) kerül kapcsolatba, testzárlatról, ha a földdel, földzárlatról beszélünk. A hibaáram útja és nagysága a földelési rendszertől függ; ez már az érintésvédelem területe: lásd a [[foldelesi-rendszerek|Földelési rendszerek]] és az [[aram-vedokapcsolo-fi-rele|Áram-védőkapcsoló (FI-relé)]] cikket.

## Összehasonlítás

| | Túlterhelés | Rövidzárlat |
|---|---|---|
| Oka | ép áramkör, túl sok vagy túl nagy fogyasztó | hiba: L–N vagy L–L között kis ellenállású kapcsolat |
| Áram | a névleges kis többszöröse | a névleges sokszorosa (a példában kb. 25 · In) |
| Lefolyás, veszély | lassú melegedés; a szigetelés öregszik, a kötések melegszenek, tűz | robbanásszerű, ívvel; olvadás, tűz, mechanikai erők |
| A kismegszakító része | hőkioldó, késleltetve | elektromágneses kioldó, azonnal |
| Jellemző jel | sok fogyasztó mellett, egy idő után old le | egy készülék bekapcsolásakor vagy visszakapcsoláskor azonnal old le |

A „jellemző jel” csak tájékoztat: azonnali leoldást egy ép készülék bekapcsolási áramlökése is okozhat, az okot ezért szakembernek kell megállapítania. Ha egy készülék bekapcsolásakor old le a védelem, azt a készüléket ne használd tovább, amíg szakember meg nem vizsgálta.

[ÁBRA: abra-2 „Kismegszakító időáram-sávja (sematikus)”. Log–log diagram, viewBox 360 × 260, rácsvonalak --kk-border. Vízszintes tengely: I / In, 1-től 100-ig (osztások: 1; 1,13; 1,45; 3; 5; 10; 25; 100); függőleges tengely: kioldási idő 0,01 s-tól 10 000 s-ig (kiemelve: 0,1 s és 3600 s = „1 óra”). A B jelleggörbe sávja kitöltött terület (.fig-band, --kk-primary, 25 % átlátszóság). A sáv bal (legrövidebb idő) határa 1,13 · In-nél függőleges aszimptotaként indul, és 3 · In-nél esik 0,1 s alá; a jobb (leghosszabb idő) határa 1,45 · In-nél 1 órát mutat, és 5 · In-nél esik 0,1 s alá. Szaggatott jelölővonalak (.fig-limit): „1,41 · In – túlterhelési példa” (--kk-warn-line) és „25 · In – zárlati példa” (--kk-danger-line). Tartománycímkék: „hőkioldó” (bal felső rész), „elektromágneses kioldó” (jobb alsó rész). Alul .fig-small: „Sematikus ábra, nem méretezésre; a pontos görbe gyártónként eltér.”]

## Gyakori tévedések

- **„A kismegszakító a készüléket védi.”** Elsősorban a vezetéket és a csatlakozásokat védi a túlmelegedéstől. A készüléket a saját belső védelme óvja.
- **„Ha gyakran leold, tegyünk be nagyobbat.”** A nagyobb névleges áramú kismegszakító már nem védi a vezetéket: az előbb melegedhet túl, mint hogy a védelem működne. A megoldás a terhelés megosztása vagy új áramkör, amelyet szakember tervez meg.
- **„A rövidzárlat csak erősebb túlterhelés.”** Más az oka, más a nagyságrendje, és a kismegszakítónak is más része működik.
- **„A FI-relé a zárlattól is véd.”** Az áram-védőkapcsoló csak a befolyó és a visszatérő áram különbségét figyeli. Tisztán L–N zárlatnál nincs különbség, ezért nem old le. A túláram ellen a kismegszakító vagy az áramvédős kismegszakító (RCBO) túláramvédelmi része véd.
- **„A hosszabbító annyit bír, mint a fali dugalj.”** A hosszabbító vagy elosztó saját terhelhetősége (a rajta feltüntetett W vagy A érték) kisebb is lehet, mint amire az áramkör kismegszakítóját választották. Ilyenkor a hosszabbító túlmelegedhet, mielőtt a kismegszakító leoldana.
