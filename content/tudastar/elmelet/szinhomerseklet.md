---
slug: szinhomerseklet
title: "Színhőmérséklet és színvisszaadás: kelvin, Ra (CRI)"
navTitle: "Színhőmérséklet és színvisszaadás"
summary: "Mit jelent a 2700 K vagy a 4000 K, miért „meleg” a kisebb szám, mit mutat az Ra (CRI) érték, és hogyan olvasd a csomagoláson a 827, 830, 840 kódot?"
section: elmelet
category: vilagitas
risk: R1
audience: [laikus, tanulo, szakember]
keywords: [színhőmérséklet, korrelált színhőmérséklet, kelvin, K, melegfehér, semleges fehér, hidegfehér, nappali fehér, színvisszaadás, színvisszaadási index, Ra, CRI, R9, mired, színtűrés, SDCM, MacAdam-ellipszis, 827, 830, 840, 930, dim-to-warm, tunable white]
synonyms: [fényszín, fény színe, meleg fény, hideg fény, natúr fehér, természetes fehér, CCT, színhűség, színvisszaadási fok, színkód, kelvin érték]
related: [fenyforrasok-tipusai, lumen-es-lux, lampafoglalatok-es-lampatalpak]
calculators: [lumen-lux]
sources:
  - standard: "CIE 13.3 (a fényforrások színvisszaadásának mérési és megadási módszere)"
    kiadás: "1995"
    pont: "a színvisszaadási index (Ra) és a nyolc vizsgálati színminta (R1–R8)"
  - standard: "CIE 224 (a színhűségi index, Rf)"
    kiadás: "2017"
    pont: "az Rf színhűségi index meghatározása"
  - standard: "MSZ EN 12665 (fény és világítás – alapfogalmak)"
    kiadás: "2018" # lektor ellenőrizze a honosított kiadást
    pont: "3. szakasz (korrelált színhőmérséklet, színvisszaadás)"
  - standard: "MSZ EN 12464-1 (munkahelyek világítása, belső munkahelyek)"
    kiadás: "2021" # lektor ellenőrizze a honosított kiadást
    pont: "a követelménytáblázatok Ra-oszlopa (irodai munkára legalább Ra 80)" # lektor ellenőrizze a táblázat számát
  - standard: "A Bizottság (EU) 2019/2020 rendelete (fényforrások környezettudatos tervezése)"
    kiadás: "2019, módosításokkal"
    pont: "II. melléklet (működési követelmények: színvisszaadás)" # lektor ellenőrizze a pontot és a kivételeket
ai: vázlat
version: 0.1
updated: 2026-10-10
---

**Röviden:** A színhőmérséklet a fehér fény árnyalatát adja meg kelvinben (K): a kisebb érték (2700–3000 K) sárgás, „meleg” fényt, a nagyobb (5000–6500 K) kékes, „hideg” fényt jelent. A színvisszaadási index (Ra, angol rövidítéssel CRI) azt mutatja, mennyire természetesen látszanak a színek az adott fényben; 100 a legjobb. A két adat független egymástól, ezért mindkettőt érdemes megnézni.

## Mit jelent a színhőmérséklet?

Ha egy fémet hevítünk, előbb vörösen, aztán sárgán, majd fehéren izzik. Egy elméleti, minden sugárzást elnyelő test (a fizikában „fekete test”) fényének színe csak a hőmérsékletétől függ. A színhőmérséklet azt adja meg, milyen hőmérsékletű fekete test fénye hasonlít leginkább az adott lámpa fényére.

Az izzólámpa fénye valóban izzásból származik, ezért jól illik ehhez a skálához. A LED és a fénycső fénye nem izzásból jön, náluk a legközelebbi színű fekete test hőmérsékletét adják meg; ezt **korrelált színhőmérsékletnek** nevezik. A köznyelvben és a csomagoláson egyszerűen színhőmérséklet.

A szóhasználat első ránézésre fordított: a „meleg” fény a kisebb, a „hideg” a nagyobb kelvinérték. A „meleg” és a „hideg” itt a hangulatra utal, nem a lámpa hőmérsékletére.

## Jellemző értékek

| Fényforrás vagy fény | Színhőmérséklet |
|---|---|
| gyertyaláng | kb. 1900 K |
| hagyományos izzólámpa | kb. 2700 K |
| halogénlámpa | kb. 2800–3000 K |
| melegfehér LED vagy fénycső | 2700–3000 K |
| semleges (természetes) fehér | kb. 4000 K |
| hidegfehér, „nappali fehér” | 5000–6500 K |
| déli napfény | kb. 5000–5500 K |
| borult ég | kb. 6500–7500 K |
| tiszta kék ég fénye árnyékban | 10 000 K fölött |

[ÁBRA: abra-1 – Színhőmérséklet-skála. viewBox 0 0 640 200. Vízszintes, 600 px hosszú, 28 px magas sáv (x = 20–620, y = 70–98) 4 px lekerekítéssel és 1 px var(--kk-border) kerettel; a kitöltés lineáris színátmenet, amely a valós fényszíneket mutatja, ezért mindkét témában azonos: 1500 K #ff8a1f, 2700 K #ffb46b, 4000 K #ffe2c4, 5500 K #fff6ec, 6500 K #f2f4ff, 10 000 K #c9d8ff. A skála mired szerint egyenletes, ezért a meleg tartomány hosszabb: x = 20 + 600 · (666,7 − 10⁶/T) / 566,7 (1500 K → 20 px, 10 000 K → 620 px). A sáv fölött 1 px var(--kk-fg) osztásvonalak és 12 px var(--kk-fg) számok: 1500, 2000, 2700, 3000, 4000, 5000, 6500, 10 000 K. A sáv alatt 12 px var(--kk-muted) címkék rövid mutatóvonallal, két sorban váltakozva (y = 116 és y = 134), mert az izzó és a halogén (334 és 373 px), illetve a napfény és a borult ég (533 és 563 px) címkéje egy sorban átfedné egymást: „gyertya” (1900), „izzó” (2700), „halogén” (3000), „semleges fehér” (4000), „napfény” (5500), „borult ég” (6500), „kék ég” (10 000). A sáv fölött három zárójeles tartomány 13 px félkövér var(--kk-fg) felirattal: „melegfehér” (2700–3000), „semleges” (3500–4500), „hidegfehér” (5000–6500). A színátmenet mellett a szöveges címkék is hordozzák az információt. title: „Színhőmérséklet-skála”; desc: „1500 és 10 000 kelvin közötti skála: a gyertya és az izzó a sárgás, meleg tartományban, a semleges fehér 4000 kelvinnél, a napfény és a borult ég a kékes, hideg tartományban látható.”]

## Melyik fényszín hova?

Ez nagyrészt ízlés kérdése; a következő felosztás csak tájékoztató:

- **2700–3000 K:** nappali, hálószoba, étkező, ahol a pihentető, otthonos hangulat a cél.
- **3000–4000 K:** konyha, fürdőszoba, dolgozószoba, ahol munkához is jól kell látni.
- **4000 K körül:** iroda, műhely, garázs, tanterem.
- **5000–6500 K:** speciális célokra (például színellenőrzéshez); lakásban sokan túl hidegnek érzik.

Tapasztalati szabály, hogy kis megvilágításnál a meleg, nagy megvilágításnál a hidegebb fényt érezzük kellemesnek. Egy helyiségen belül érdemes egyféle színhőmérsékletet használni, mert a vegyes fényszín zavaró. Esténként sokan a meleg fényt találják pihentetőbbnek; a kékben gazdag fény élénkítő hatását kutatások vizsgálják.

## Színvisszaadás: az Ra (CRI) érték

Két, egyaránt 3000 K-es lámpa fényében is másként látszhatnak a színek. A **színvisszaadási index** (Ra, angolul CRI) ezt méri: nyolc, nemzetközileg rögzített, közepesen telített színminta (R1–R8) színét veti össze a vizsgált lámpa és egy azonos színhőmérsékletű referencia-fényforrás fényében. Az eredmény legfeljebb 100.

- **Ra 100:** izzó- és halogénlámpa, mert fényük gyakorlatilag maga a referencia.
- **Ra 80–89:** a legtöbb háztartási LED és fénycső; általános világításra jó.
- **Ra 90 fölött:** ott érdemes, ahol a színek számítanak: sminkelés, konyha, ruhatár, üzlet, festés, műterem.

Az uniós szabályok általános világításra – kevés kivétellel – legalább Ra 80-as fényforrást írnak elő, a munkahelyi világítás szabványa is a legtöbb belső munkahelyen legalább Ra 80-at kér. Az Ra nem tartalmazza az erősen telített vöröset (R9), amelyben az olcsóbb LED-ek gyengék; ha a bőrszín és a húsáruk színe fontos, nézd meg az adatlapon az R9 értéket is. Az újabb, finomabb módszer a színhűségi index (Rf), amely 99 színmintával számol.

## Mit jelent a 827, a 840 vagy a 930?

A gyártók elterjedt, háromjegyű kódot használnak. Az első számjegy a színvisszaadási osztály (8 = Ra 80–89, 9 = Ra 90 vagy több), a második és a harmadik a színhőmérséklet századrésze.

- **827:** Ra 80–89, 2700 K – a klasszikus melegfehér.
- **830:** Ra 80–89, 3000 K.
- **840:** Ra 80–89, 4000 K – az irodák jellemző fényszíne.
- **930:** Ra legalább 90, 3000 K.
- **965:** Ra legalább 90, 6500 K.

## Számpélda: miért számít a 300 K a meleg tartományban?

Az emberi szem a színhőmérséklet változását nem kelvinben, hanem közelítőleg annak reciprokában érzékeli egyenletesen. Ennek egysége a **mired** (mikroreciprok fok):

M = 10⁶ / T

- M – mired-érték (mired);
- T – színhőmérséklet (K).

1. 2700 K → 10⁶ / 2700 ≈ 370,37 mired; 3000 K → 10⁶ / 3000 ≈ 333,33 mired. A különbség kb. 37,04 mired.
2. Ugyanekkora lépés 4000 K-ről (250 mired) indulva: 250 − 37,04 = 212,96 mired, ami 10⁶ / 212,96 ≈ 4696 K. Ez kb. 700 K-es lépés.
3. 6500 K-ről (≈ 153,85 mired): 153,85 − 37,04 = 116,81 mired → 10⁶ / 116,81 ≈ 8561 K, ami már kb. 2060 K-es lépés.

Ellenőrzés visszafelé: 10⁶ / 4696 ≈ 212,95 mired, és 250 − 212,95 = 37,05 mired, a kerekítéstől eltekintve ugyanannyi. A tanulság: a 2700 K és a 3000 K közötti 300 K-es különbség jól látható, nagyjából akkora, mint a 4000 és 4700 K közötti. Ezért zavaró, ha egy csillárban 2700 és 3000 K-es fényforrások keverednek, míg a hideg tartományban néhány száz kelvin alig tűnik fel.

## Színtűrés, szabályozható fényszín

- **Színtűrés (SDCM, MacAdam-lépcső):** azt adja meg, mennyire szórhat két azonos jelölésű fényforrás színe. 3 lépcsőn belül a különbség alig észrevehető, 5–7 lépcsőnél egymás mellett már látszik. Ugyanabba a helyiségbe lehetőleg azonos típusú és gyártási sorozatú fényforrást tegyél.
- **Fényerő-szabályozás:** az izzó fénye halványításkor melegebb lesz, mert hűl a szál. A legtöbb LED színe szabályozáskor nem változik; a „dim-to-warm” LED ezt utánozza, halványításkor 3000 K-ről akár 1800 K-ig melegszik.
- **Hangolható fehér (tunable white):** két különböző színhőmérsékletű LED-csoport keverésével a fényszín menet közben állítható.

## Gyakori tévedések

- **„A nagyobb kelvin erősebb fény.”** A kelvin a fény színét adja meg, a mennyiségét a lumen (lásd [[lumen-es-lux|Lumen és lux]]).
- **„A melegfehér a nagyobb kelvinszám.”** Fordítva: a melegfehér 2700–3000 K, a hidegfehér kb. 5000 K-től felfelé van.
- **„A színhőmérséklet a lámpa melegedését mutatja.”** Semmi köze hozzá: egy 6500 K-es LED sem melegszik jobban, mint egy 2700 K-es.
- **„Az azonos színhőmérséklet azonos színvisszaadást jelent.”** Két 3000 K-es lámpa közül az egyik Ra 80, a másik Ra 95 is lehet.
- **„A 6500 K a nappali fény, ezért a legegészségesebb.”** A színhőmérséklet önmagában nem minősíti a fényt; a jó világításhoz megfelelő megvilágítás, színvisszaadás és káprázásmentesség is kell.
- **„Az Ra 100 a legtakarékosabb.”** Az Ra 100-as izzó a legpazarlóbb; a jobb színvisszaadású LED-ek fényhasznosítása is jellemzően kissé kisebb (lásd [[fenyforrasok-tipusai|Fényforrások típusai]]).
