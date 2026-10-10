---
slug: elektromos-ellenallas
title: "Elektromos ellenállás és fajlagos ellenállás"
navTitle: "Ellenállás, fajlagos ellenállás"
summary: "Mitől függ egy vezeték ellenállása? Az R = ρ · l / A képlet, a réz és az alumínium fajlagos ellenállása és a hőmérsékletfüggés, számpéldákkal."
section: elmelet
category: alapfogalmak
risk: R1
audience: [laikus, tanulo, szakember]
keywords: [ellenállás, ohm, fajlagos ellenállás, ρ, vezetőképesség, kappa, siemens, vezeték-ellenállás, keresztmetszet, mm², réz, alumínium, hőmérsékleti tényező, α, hőmérsékletfüggés, átmeneti ellenállás]
synonyms: [villamos ellenállás, rezisztencia, fajlagos vezetőképesség, R, ρ]
related: [ohm-torvenye, joule-lenz-torveny, soros-es-parhuzamos-kapcsolas, elektromos-feszultseg, elektromos-aram]
calculators: [vezetek-ellenallas, homerseklet, eredo-ellenallas, mertekegyseg-atvalto]
sources:
  - standard: "127/1991. (X. 9.) Korm. rendelet"
    kiadás: "hatályos szöveg"
    pont: "3. § (1) és 1. számú melléklet – törvényes mértékegységek (ohm, siemens)"
  - standard: "IEC 60028"
    kiadás: "1925"
    pont: "a lágyított réz fajlagos ellenállásának és hőmérsékleti tényezőjének referenciaértéke 20 °C-on"
  - standard: "IEC 60889"
    kiadás: "1987"
    pont: "a keményhúzott alumíniumhuzal fajlagos ellenállása és hőmérsékleti tényezője 20 °C-on"
  - standard: "MSZ EN 60228"
    kiadás: "2005"
    pont: "1–4. táblázat – a vezetők legnagyobb egyenáramú ellenállása 20 °C-on"
  - standard: "MSZ HD 60364-5-52"
    kiadás: "2011"
    pont: "52.1 táblázat (PVC-szigetelés legnagyobb üzemi hőmérséklete: 70 °C); G.52.2 (fajlagos ellenállás üzemi hőmérsékleten, feszültségeséshez)"
ai: vázlat
version: 0.1
updated: 2026-10-10
---

**Röviden:** Az ellenállás megmutatja, mennyire akadályozza egy anyag vagy alkatrész az áram folyását: R = U / I, mértékegysége az ohm (Ω). Egy vezeték ellenállása a hosszával arányosan nő, a keresztmetszetével fordítottan arányos, és függ az anyagtól, amit a fajlagos ellenállás (ρ) fejez ki. Fémekben az ellenállás a hőmérséklettel nő.

## Mi az ellenállás?

Ha egy vezetőre feszültséget kapcsolunk, a rajta átfolyó áram nagyságát a vezető ellenállása szabja meg:

R = U / I

1 Ω annak a vezetőnek az ellenállása, amelyen 1 V feszültség hatására 1 A áram folyik. Az ellenállás reciproka a vezetés (konduktancia): G = 1 / R, mértékegysége a siemens (S).

A magyar szaknyelv az „ellenállás” szót két értelemben használja: jelenti a fizikai mennyiséget, és az ellenállás nevű alkatrészt is. Ellenállása azonban nemcsak az alkatrésznek van: minden vezetőnek, kötésnek, kapcsolóérintkezőnek és szigetelésnek is.

Fémekben az ellenállás oka, hogy a szabad elektronok mozgását a kristályrács rezgései és hibái fékezik. Eközben a villamos energia egy része hővé alakul – erről a [[joule-lenz-torveny|Joule–Lenz-törvény]] szól.

## A vezeték ellenállása: R = ρ · l / A

Egy vezeték ellenállása a hosszával egyenesen, a keresztmetszetével fordítottan arányos:

R = ρ · l / A

- R – ellenállás, ohmban (Ω);
- ρ – fajlagos ellenállás, Ω·mm²/m-ben;
- l – a vezető hossza, méterben (m);
- A – keresztmetszet, mm²-ben.

A villanyszerelési gyakorlatban kényelmes a Ω·mm²/m egység, mert a keresztmetszetet mm²-ben, a hosszt méterben adjuk meg. Átváltás SI-egységre: 1 Ω·mm²/m = 10⁻⁶ Ω·m. A fajlagos ellenállás reciproka a fajlagos vezetőképesség (κ), m/(Ω·mm²)-ben.

| Anyag | ρ 20 °C-on (Ω·mm²/m) | κ = 1 / ρ (m/(Ω·mm²)) | α (1/K) |
|---|---|---|---|
| Lágyított réz | 0,017241 (= 1/58) | ≈ 58 | 0,00393 |
| Keményhúzott alumínium | 0,028264 | ≈ 35,4 | 0,00403 |

**Kidolgozott példa – egy áramkör vezetékei.** Egy egyfázisú áramkör 25 m hosszú, 2,5 mm²-es rézvezetékkel készült. Az áram a fázisvezetőn oda, a nullavezetőn vissza folyik, ezért a számításba vett hossz l = 2 · 25 m = 50 m. Az ellenállás 20 °C-on:

R₂₀ = 0,017241 Ω·mm²/m · 50 m / 2,5 mm² ≈ 0,3448 Ω.

Ellenőrzés a vezetőképességgel: R = l / (κ · A) = 50 / (58 · 2,5) Ω ≈ 0,3448 Ω.

[ÁBRA: abra-1 – Mitől függ a vezeték ellenállása? viewBox 0 0 320 220, három sor egymás alatt, mindegyikben egy oldalnézeti henger (vezetőszakasz) var(--kk-wire-l1) kitöltéssel és var(--kk-fg) körvonallal, a henger végén ellipszis a keresztmetszet jelzésére. 1. sor: alapeset, hossz 120 px, átmérő 16 px, mellette felirat „l, A → R”. 2. sor: kétszer hosszabb henger (240 px, átmérő 16 px), felirat „2 · l → 2 · R”. 3. sor: azonos hosszú (120 px), de kétszeres keresztmetszetű henger (átmérő 16 · √2 ≈ 23 px), felirat „2 · A → R / 2”. A hosszakat vékony méretvonalak jelölik var(--kk-muted) színnel; a feliratok var(--kk-fg), 13 px. title: „A vezeték ellenállása a hossztól és a keresztmetszettől függ”; desc: „Kétszeres hossz kétszeres ellenállást, kétszeres keresztmetszet fele akkora ellenállást ad.”]

### Keresztmetszet és átmérő

A vezeték jelölésében szereplő 2,5 mm² a vezető **keresztmetszete** (területe), nem az átmérője. Egy tömör, kör keresztmetszetű vezető átmérője:

d = √(4 · A / π) = √(4 · 2,5 / 3,1416) mm ≈ 1,78 mm.

Sodrott vezetőnél a külső átmérő ennél nagyobb, mert az elemi szálak között hézag van.

### Réz vagy alumínium?

Az alumínium fajlagos ellenállása a rézének kb. 1,64-szerese (0,028264 / 0,017241 ≈ 1,639). Azonos hosszon és ellenálláson tehát kb. 1,64-szer nagyobb keresztmetszet kell belőle: a 2,5 mm²-es rézvezetőnek kb. 4,1 mm² alumínium felelne meg. Egy 4 mm²-es alumíniumvezető ellenállása (≈ 7,07 mΩ/m) még kissé nagyobb is a 2,5 mm²-es rézénél (≈ 6,90 mΩ/m).

## Hőmérsékletfüggés

A fémek ellenállása a hőmérséklettel nő. A szokásos üzemi tartományban jó közelítés:

R_θ = R₂₀ · (1 + α · (θ − 20 °C))

- R_θ – ellenállás θ hőmérsékleten;
- R₂₀ – ellenállás 20 °C-on;
- α – hőmérsékleti tényező (1/K), rézre 0,00393, alumíniumra 0,00403.

**Kidolgozott példa – a melegedő vezeték.** Az előző, 20 °C-on 0,3448 Ω-os áramkör vezetői terhelés alatt felmelegszenek. Számoljunk a PVC-szigetelésű vezetők legnagyobb megengedett tartós üzemi hőmérsékletével, 70 °C-kal:

1 + 0,00393 · (70 − 20) = 1 + 0,1965 = 1,1965,

R₇₀ = 0,3448 Ω · 1,1965 ≈ 0,4126 Ω.

A vezeték ellenállása tehát kb. 20 %-kal nagyobb lett. Ezért a feszültségesés becslésénél nem a 20 °C-os, hanem az üzemi hőmérsékletre vett, nagyobb fajlagos ellenállással érdemes számolni.

Az anyagok hőmérsékleti viselkedése eltérő:

- **Fémek:** pozitív hőmérsékleti tényező – melegen nagyobb az ellenállás. Az izzólámpa wolframszálának hideg ellenállása a működés közbeninek csak töredéke, ezért bekapcsoláskor rövid ideig a névlegesnél jóval nagyobb áramot vesz fel.
- **Félvezetők, szén, NTC-termisztor:** negatív hőmérsékleti tényező – melegen kisebb az ellenállás.
- **Különleges ötvözetek** (például konstantán, manganin): ellenállásuk alig változik a hőmérséklettel, ezért mérőellenállásnak használják őket.

## Ellenállás a szerelési gyakorlatban

- **Kötések és érintkezők.** Egy jó kötés ellenállása milliohmos nagyságrendű vagy annál kisebb. Egy laza vagy oxidálódott kötés ellenállása ennek sokszorosa lehet, és ott – kis helyen – jelentős hő fejlődik. Ez a melegedő, elszíneződő csatlakozások gyakori oka (számpéldával a [[joule-lenz-torveny|Joule–Lenz-törvény]] cikkben).
- **Szigetelési ellenállás.** A szigetelés is ellenállás, de jó állapotban nagyon nagy: legalább megaohmos nagyságrendű. Öregedés, nedvesség vagy sérülés csökkenti. Mérése külön szakmai feladat.
- **Gyártói adatok és szabványértékek.** A vezetőkre vonatkozó szabvány a vezetőt nem a geometriai keresztmetszetével, hanem a 20 °C-on megengedett legnagyobb egyenáramú ellenállásával jellemzi, km-re vetítve (Ω/km). Ez a határérték többnyire néhány százalékkal nagyobb a névleges keresztmetszetből számolt elméleti értéknél (amely 2,5 mm²-es rézre kb. 6,90 Ω/km), hajlékony, finomsodrott vezetőnél még inkább. Pontos számításnál a gyártói adatlap értéke a mérvadó.

## Gyakori tévedések

- **„A vastagabb vezeték ellenállása nagyobb.”** Fordítva: nagyobb keresztmetszet kisebb ellenállást jelent.
- **„A 2,5 mm² az átmérő.”** A keresztmetszet; a tömör vezető átmérője kb. 1,78 mm.
- **„Elég az egyik irányt számolni.”** Egyfázisú áramkörben az áram oda és vissza is megteszi az utat, ezért a hossz kétszeresével kell számolni.
- **„A hidegen mért ellenállás az üzemi ellenállás.”** Üzemmeleg vezetéken – 70 °C-on – kb. 20 %-kal nagyobb lehet.
- **„Az alumínium ugyanakkora keresztmetszetben ugyanúgy vezet.”** Azonos ellenálláshoz kb. 1,64-szer akkora keresztmetszet kell.
- **„Ellenállása csak az alkatrésznek van.”** Minden vezetőnek, kötésnek és érintkezőnek van, és nagy áramnál ez már számít.
