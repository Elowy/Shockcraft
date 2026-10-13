---
slug: joule-lenz-torveny
title: "Joule–Lenz-törvény – az áram hőhatása"
navTitle: "Joule–Lenz-törvény"
summary: "Miért melegszik a vezeték, a kötés és a fűtőszál? A Q = I² · R · t összefüggés, a négyzetes áramfüggés és gyakorlati következményei, számpéldákkal."
section: elmelet
category: alapfogalmak
risk: R1
audience: [laikus, tanulo, szakember]
keywords: [Joule–Lenz-törvény, Joule-törvény, hőhatás, Joule-hő, I²R, melegedés, vezeték melegedése, veszteség, túlterhelés, rövidzárlat, laza kötés, átmeneti ellenállás, kábeldob, villamos fűtés]
synonyms: [Joule-törvény, Joule–Lenz törvény, az áram hőhatása, Joule-hő, ohmos veszteség, I²R-veszteség]
related: [elektromos-ellenallas, ohm-torvenye, elektromos-teljesitmeny, elektromos-aram, rovidzarlat-es-tulterheles, kismegszakito]
calculators: [vezetek-ellenallas, ohm-torveny, teljesitmeny, homerseklet, mertekegyseg-atvalto]
sources:
  - standard: "127/1991. (X. 9.) Korm. rendelet"
    kiadás: "hatályos szöveg"
    pont: "3. § (1) és 1. számú melléklet – törvényes mértékegységek (joule, watt)"
  - standard: "IEC 60028"
    kiadás: "1925"
    pont: "a lágyított réz fajlagos ellenállásának és hőmérsékleti tényezőjének referenciaértéke 20 °C-on"
  - standard: "MSZ HD 60364-5-52"
    kiadás: "2011"
    pont: "523 (terhelhetőség); 52.1 táblázat (PVC-szigetelés legnagyobb üzemi hőmérséklete: 70 °C); 526 (villamos kötések)"
  - standard: "MSZ HD 60364-4-43"
    kiadás: "2010"
    pont: "433.1 (túlterhelés elleni védelem összehangolása); 434.5.2 (zárlati áram megengedett időtartama, I²t)"
ai: vázlat
version: 0.1
updated: 2026-10-10
---

**Röviden:** Ha áram folyik egy ellenálláson, abban hő fejlődik: Q = I² · R · t. A hő az áram négyzetével nő, ezért kétszeres áram négyszeres hőt termel. Ezen alapul minden villamos fűtés, és ez okozza a vezetékek melegedését, a túlterhelés és a rossz kötések veszélyét is.

## A törvény

Az összefüggést az 1840-es évek elején James Prescott Joule és tőle függetlenül Heinrich Lenz írta le. Egy R ellenállású vezetőben I áram t idő alatt

Q = I² · R · t

hőt fejleszt, ahol

- Q – a fejlődött hő, joule-ban (J);
- I – áramerősség, amperben (A), váltakozó áramnál effektív értékben;
- R – ellenállás, ohmban (Ω);
- t – idő, másodpercben (s).

Itt a Q betű a hőt jelöli; más cikkekben ugyanez a betű a töltés vagy a meddő teljesítmény jele.

A hőteljesítmény (az időegység alatt fejlődő hő) P = I² · R, wattban. [[ohm-torvenye|Ohm törvényével]] más alakban is felírható: Q = U · I · t = U² / R · t. Tisztán ohmos fogyasztóban – fűtőszálban, vízforralóban – a felvett villamos energia gyakorlatilag teljes egészében hővé alakul.

## A négyzetes összefüggés

A legfontosabb gyakorlati tanulság: a hő nem az árammal, hanem **az áram négyzetével** arányos.

- Kétszeres áram → négyszeres hő.
- Fele akkora áram → negyed akkora hő.

Ezért szállítják az energiát nagy feszültségen: ugyanakkora teljesítményhez nagyobb feszültségen kisebb áram kell, és a vezeték vesztesége az áram négyzetével csökken.

## Hasznos hőhatás

Az áram hőhatását használja ki minden villamos fűtőkészülék (fűtőpatron, vízforraló, főzőlap, hősugárzó), a forrasztópáka és régen az izzólámpa is. A védelmi készülékek egy része szintén ezen alapul: az olvadóbiztosító olvadószála túlterheléskor és zárlatkor átolvad, a kismegszakító hőkioldójában pedig egy melegedő ikerfém (bimetall) hajlik el, és késleltetve kiold.

**Kidolgozott példa – vízforraló.** Mennyi idő alatt forral fel egy 2000 W-os vízforraló 1,5 liter (1,5 kg) 15 °C-os vizet, ha veszteség nincs? A víz fajhője kb. 4,19 kJ/(kg·K).
A szükséges hő: Q = m · c · Δθ = 1,5 kg · 4,19 kJ/(kg·K) · (100 − 15) K ≈ 534,2 kJ.
Az idő: t = Q / P = 534 200 J / 2000 W ≈ 267 s, azaz kb. 4,5 perc.
A valóságban a kanna és a környezet is elvisz hőt; 90 %-os hatásfokkal t ≈ 534 200 J / (0,9 · 2000 W) ≈ 297 s, kb. 5 perc.

Megjegyzés: az ellenállásfűtés a felvett villamos energiát szinte teljesen hővé alakítja, ez azonban nem jelenti, hogy a legolcsóbb fűtési mód. Egy hőszivattyú ugyanannyi villamos energiával a környezetből többszörös hőt képes a lakásba szállítani.

## Káros hőhatás: a vezetékek melegedése

Minden vezetőnek van ellenállása, ezért minden terhelt vezeték melegszik. A vezeték hőmérséklete addig emelkedik, amíg a benne termelt hő és a környezetének leadott hő egyensúlyba nem kerül. A hőleadás a szerelési módtól függ: a szabadon futó vezeték jobban hűl, mint a hőszigetelésbe ágyazott vagy a többivel kötegelt. A vezeték szigetelése csak korlátozott hőmérsékletet bír – a PVC-szigetelésű vezetőké tartósan legfeljebb 70 °C-ot –, ezért a vezeték **terhelhetősége** (a tartósan megengedett áram) a keresztmetszeten kívül a szerelési módtól, a környezeti hőmérséklettől és a csoportosítástól is függ.

**Kidolgozott példa – egy áramkör vezetékvesztesége.** Egy 25 m hosszú, 2,5 mm²-es rézvezetékes áramkör vezetőinek ellenállása oda-vissza (50 m), a legkedvezőtlenebb, 70 °C-os vezetőhőmérsékletet feltételezve kb. 0,4126 Ω (a számítást lásd az [[elektromos-ellenallas|ellenállásról szóló cikkben]]).
16 A-nél: P = I² · R = 16² · 0,4126 Ω ≈ 105,6 W.
Ez az 50 m vezetőre elosztva vezetőméterenként kb. 2,1 W, a kábel minden méterében – a két áramvezető érben együtt – tehát kb. 4,2 W; egy óra alatt Q = 105,6 W · 3600 s ≈ 380 kJ (kb. 0,106 kWh) hő.
8 A-nél (ugyanazzal az ellenállással számolva): P = 8² · 0,4126 Ω ≈ 26,4 W – fele akkora áramnál a veszteség a negyedére csökken. (A valóságban kisebb áramnál a vezeték hidegebb is marad, így a veszteség még ennél is kevesebb.)

[ÁBRA: abra-1 – A vezetékveszteség az áram négyzetével nő. viewBox 0 0 320 220. Koordináta-rendszer: vízszintes tengely az áram 0–16 A között, osztásjelek 4 A-enként („0”, „4”, „8”, „12”, „16 A”), függőleges tengely a veszteség 0–120 W között, osztásjelek 20 W-onként. Rács 1 px, var(--kk-track); tengelyek 1,5 px, var(--kk-fg). Parabola P = I² · 0,4126 Ω, 2,5 px, var(--kk-primary). Kitöltött körök (r = 4 px, var(--kk-primary)) a 4, 8, 12 és 16 A-es pontokban, mellettük értékfelirat: „6,6 W”, „26,4 W”, „59,4 W”, „105,6 W”. Összehasonlításul szaggatott egyenes var(--kk-muted) színnel a (0; 0) és a (16 A; 105,6 W) pont között, felirat: „ha arányos lenne”. Tengelyfeliratok: „Áram (A)”, „Veszteség (W)”. Feliratok var(--kk-fg), 12 px. title: „Vezetékveszteség az áram függvényében”; desc: „25 m, 2,5 mm² réz, oda-vissza, állandó 70 °C-os ellenállással számolva: 4 A-nél 6,6 W, 8 A-nél 26,4 W, 12 A-nél 59,4 W, 16 A-nél 105,6 W.”]

A túlterhelés elleni védelmet – például a kismegszakítót – úgy kell a vezetékhez választani, hogy a vezeték tartós melegedése a megengedett határon belül maradjon. A keresztmetszet és a védelem összehangolása tervezői feladat (lásd [[kismegszakito|Kismegszakító]]).

**Feltekert kábeldob.** A dobra tekert hosszabbító vezetéke nem tud hőt leadni, a menetek egymást melegítik. Ezért nagyobb terhelésnél a kábeldobot teljesen le kell tekerni; a gyártók a feltekert és a letekert állapotra külön terhelhetőséget adnak meg.

## Kötések és csatlakozások

A hő ott keletkezik, ahol az ellenállás van. Egy rossz kötés ellenállása akár több méter, súlyos esetben több tíz méter vezeték ellenállásával is összemérhető lehet (az alábbi példa 0,1 Ω-os laza kötése kb. 14,5 m 2,5 mm²-es rézvezetőnek felel meg). A hő azonban nem oszlik el a hosszán, hanem egyetlen apró pontban koncentrálódik.

**Kidolgozott példa – laza kötés (szemléltető értékekkel).** 16 A terhelőáramnál:
- egy jó, 1 mΩ-os kötésben: P = 16² · 0,001 Ω ≈ 0,26 W;
- egy laza, 0,1 Ω-os kötésben: P = 16² · 0,1 Ω = 25,6 W, ami óránként kb. 92 kJ hő.
A 25,6 W kb. egy kisebb forrasztópáka teljesítménye, csak éppen egy sorkapocs vagy dugalj belsejében. Ez elszíneződéshez, a szigetelés megolvadásához, súlyos esetben tűzhöz vezethet. Ha egy dugalj, csatlakozó vagy kapcsoló érezhetően melegszik, elszíneződik vagy égett szagú, ne használd tovább, és vizsgáltasd meg szakemberrel.

## Rövidzárlat: nagy áram, rövid idő

[[rovidzarlat-es-tulterheles|Zárlatkor]] az áram a normál üzemi áram sokszorosa lehet. Mivel a hő I² · t-vel arányos, ilyenkor néhány tized másodperc alatt is annyi hő fejlődhet, amely károsítja a vezető szigetelését. A zárlatvédelemnek ezért elég gyorsan kell lekapcsolnia ahhoz, hogy a vezető ne melegedjen a zárlatkor megengedett hőmérséklet fölé. A tervezésben ezt az I²t-érték (Joule-integrál) összevetésével ellenőrzik.

## Gyakori tévedések

- **„A hő az árammal arányos.”** Az áram négyzetével: kétszeres áram négyszeres hőt jelent.
- **„Nagyobb kismegszakítóval kevesebb a gond.”** A kismegszakító a vezetéket védi. Ha a vezetékhez képest túl nagy, a vezeték túlmelegedhet anélkül, hogy a védelem kioldana.
- **„A meleg csatlakozó normális.”** Terhelés alatt enyhe langyosodás előfordulhat, de a forró, elszíneződő csatlakozás hibára utal.
- **„A feltekert hosszabbító ugyanannyit bír, mint a letekert.”** Feltekerve sokkal rosszabbul hűl, ezért kevesebbet bír.
- **„Kis teljesítményű készüléknél a kötés minősége mindegy.”** Kis áramnál a hő valóban kicsi, de a laza kötés idővel tovább romlik, és egy nagyobb terhelésnél már veszélyes lehet.
- **„Az ellenállásfűtés 100 %-os, tehát a legolcsóbb.”** A hővé alakítás közel 100 %-os, de a költség az energia árától és a fűtési módtól függ.
