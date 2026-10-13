---
slug: lumen-es-lux
title: "Lumen és lux: fényáram, megvilágítás és a lámpák száma"
navTitle: "Lumen és lux"
summary: "Mi a különbség a lumen és a lux között, hogyan függ a megvilágítás a távolságtól, és hogyan becsülhető, hány lámpa kell egy helyiségbe? Számpéldákkal."
section: elmelet
category: vilagitas
risk: R1
audience: [laikus, tanulo, szakember]
keywords: [lumen, lux, fényáram, megvilágítás, fényerősség, kandela, fénysűrűség, fényhasznosítás, lm, lx, cd, távolságtörvény, hatásfok-módszer, kihasználási tényező, karbantartási tényező, lámpák száma, világítás méretezés, luxmérő]
synonyms: [lumen lux, lm lx, hány lámpa kell, hány lumen kell, fényerő, világosság, megvilágítás erőssége, lux érték, lumen érték, fényerősség mértékegysége]
related: [fenyforrasok-tipusai, szinhomerseklet, lampafoglalatok-es-lampatalpak]
calculators: [lumen-lux, fogyasztas-koltseg]
sources:
  - standard: "127/1991. (X. 9.) Korm. rendelet (a mérésügyről szóló 1991. évi XLV. törvény végrehajtásáról)"
    kiadás: "hatályos szöveg"
    pont: "a törvényes mértékegységeket tartalmazó 1. melléklet (kandela mint SI-alapegység; lumen és lux mint származtatott egység)" # lektor ellenőrizze a melléklet számozását
  - standard: "MSZ EN 12665 (fény és világítás – alapfogalmak és követelmények megadása)"
    kiadás: "2018" # lektor ellenőrizze a honosított kiadást
    pont: "3. szakasz (fényáram, fényerősség, megvilágítás, fénysűrűség, karbantartási tényező)"
  - standard: "MSZ EN 12464-1 (munkahelyek világítása, belső munkahelyek)"
    kiadás: "2021" # lektor ellenőrizze a honosított kiadást
    pont: "a követelménytáblázatok irodai tételei (500 lx az írás, olvasás, adatfeldolgozás munkaterületén)" # lektor ellenőrizze a táblázat számát
ai: vázlat
version: 0.1
updated: 2026-10-10
---

**Röviden:** A lumen (lm) azt mondja meg, mennyi fényt bocsát ki egy fényforrás, a lux (lx) pedig azt, mennyi fény jut belőle egy felület egy négyzetméterére: 1 lx = 1 lm/m². Ugyanaz a lámpa kis helyiségben sok, nagyban kevés luxot ad, és pontszerű fényforrásnál a megvilágítás a távolság négyzetével fordított arányban csökken. A szükséges lámpaszám a hatásfok-módszerrel jól becsülhető.

## A fénytechnika alapmennyiségei

| Mennyiség | Jele | Egysége | Mit ír le? |
|---|---|---|---|
| Fényáram | Φ | lumen (lm) | a fényforrásból kilépő összes fény |
| Fényerősség | I | kandela (cd) | egy adott irányba, egységnyi térszögbe kibocsátott fényáram |
| Megvilágítás | E | lux (lx) = lm/m² | a felületre eső fényáram négyzetméterenként |
| Fénysűrűség | L | cd/m² | mennyire „világít” egy felület a szemünk felől nézve |

Ezekhez kapcsolódik a **fényhasznosítás** (lm/W), amely a lámpa takarékosságát mutatja; erről a [[fenyforrasok-tipusai|Fényforrások típusai]] cikk szól. A kandela az SI egyik alapegysége, a lumen és a lux ebből származtatott egység.

## Lumen: mennyi fényt ad a lámpa?

A fényáram nem egyszerűen sugárzott teljesítmény: a szem érzékenységével súlyozott mennyiség. A szemünk a zöldessárga fényre (kb. 555 nm) a legérzékenyebb; ezen a hullámhosszon 1 W sugárzott teljesítmény 683 lm fényáramnak felel meg, a vörös és a kék tartomány felé haladva ennél jóval kevesebbnek. Ezért mérik a lámpák fényét lumenben, és nem wattban.

A fényforrás csomagolásán a lumenérték a legfontosabb adat. Lámpatestnél figyelj arra, hogy a fényforrás lumenje vagy a teljes lámpatest által kibocsátott fényáram szerepel-e: a búra és a reflektor a fény egy részét elnyeli.

## Lux: mennyi fény jut a felületre?

Ha 1000 lm egyenletesen esik egy 1 m²-es asztallapra, a megvilágítás 1000 lx; ha ugyanez a fény 10 m²-en oszlik el, 100 lx. A megvilágítás tehát a fényforráson kívül a helyiség méretétől, a lámpák elhelyezésétől és a felületek visszaverésétől is függ.

Néhány tájékoztató nagyságrend:

| Helyzet | Megvilágítás |
|---|---|
| telihold fénye | kb. 0,05–0,3 lx |
| lakóutca közvilágítása | kb. 2–15 lx |
| lakószoba esti világítása | kb. 100–300 lx |
| irodai munkafelület | 500 lx |
| borult nappal a szabadban | néhány ezer lx |
| nyári déli napsütés | akár 100 000 lx |

A szemünk ezt a hatalmas tartományt alkalmazkodással hidalja át, ezért nem érezzük a napsütést több százszor világosabbnak a szobánál. A telefonos „luxmérő” alkalmazások csak durva tájékoztatást adnak; pontos méréshez kalibrált luxmérő kell.

## A távolságtörvény

Egy pontszerűnek tekinthető fényforrás alatt, a fényre merőleges felületen:

E = I / d²

- E – megvilágítás (lx);
- I – a fényforrás fényerőssége a felület irányában (cd);
- d – a fényforrás és a felület távolsága (m).

Ha a fény ferdén, a felület merőlegesével ε szöget bezárva érkezik, a vízszintes felületen E = I · cos ε / d². A képlet akkor ad jó közelítést, ha a távolság legalább ötszöröse a fényforrás legnagyobb méretének.

[ÁBRA: abra-1 – Lumen, lux és távolság. viewBox 0 0 640 300. Bal fél (0–300 px): felül középen egy lámpatest egyszerűsített alakja (60×14 px téglalap, var(--kk-fg) körvonal, var(--kk-surface-2) kitöltés), belőle lefelé szélesedő fénykúp két egyenes vonallal és halvány kitöltéssel (var(--kk-primary), 15 % átlátszóság); a kúp mellett „Φ = 4000 lm” felirat (13 px, var(--kk-fg)). Alul vízszintes padló (2 px var(--kk-fg)), rajta a kúp által megvilágított szakasz vastagabb var(--kk-primary) vonallal és „A = 8 m²” felirattal, alatta „E = Φ / A = 500 lx (veszteség nélkül)” (12 px, var(--kk-muted)). Jobb fél (340–640 px): függőleges tengely mentén egy pontszerű fényforrás (8 px sugarú kör, var(--kk-primary)), alatta 1 m-enként jelölt osztás 1, 2 és 3 m-nél (1 px var(--kk-border) szaggatott vízszintes vonalak). Mindhárom szinten egy-egy négyzet, amelynek oldalhossza a távolsággal arányosan nő (20, 40, 60 px), kitöltése egyre halványabb (var(--kk-primary) 45 %, 20 %, 10 %); mellettük „1 m: 1000 lx”, „2 m: 250 lx”, „3 m: 111 lx” (12 px, var(--kk-fg)) egy 1000 cd-s forrásra. Középen függőleges elválasztó (1 px var(--kk-border)). title: „Fényáram, megvilágítás és a távolságtörvény”; desc: „Bal oldalon egy 4000 lumenes lámpa fénye 8 négyzetméterre esik; jobb oldalon egy 1000 kandelás pontszerű fényforrás 1, 2 és 3 méterről 1000, 250 és 111 luxot ad, mert ugyanaz a fény négyzetesen növekvő felületen oszlik el.”]

## Hány lámpa kell? A hatásfok-módszer

Egy helyiség átlagos megvilágításának előzetes becsléséhez az ún. hatásfok-módszert használják:

N = E · A / (Φ · η · k)

- N – a lámpatestek száma (db), felfelé kerekítve;
- E – a kívánt átlagos megvilágítás (lx);
- A – a helyiség alapterülete (m²);
- Φ – egy lámpatest (vagy fényforrás) fényárama (lm);
- η – kihasználási tényező: a kibocsátott fény mekkora része jut a munkasíkra; a helyiség arányaitól, a falak és a mennyezet színétől és a lámpatesttől függ, jellemzően 0,3–0,7;
- k – karbantartási tényező: az öregedés és a szennyeződés miatti fénycsökkenést veszi számításba, tiszta helyiségben gyakran 0,8.

Kerekítés után a megvalósuló átlagos megvilágítás: E = N · Φ · η · k / A.

## Kidolgozott példák

**1. Iroda.** 20 m², kívánt átlag 500 lx, lámpatestenként 4000 lm, η = 0,5, k = 0,8.
N = 500 · 20 / (4000 · 0,5 · 0,8) = 10 000 / 1600 = 6,25 → 7 db.
Megvalósuló megvilágítás: E = 7 · 4000 · 0,5 · 0,8 / 20 = 11 200 / 20 = 560 lx.
Ellenőrzés: a szükséges összes fényáram 500 · 20 / (0,5 · 0,8) = 25 000 lm; 25 000 / 4000 = 6,25, ugyanaz.

**2. Konyha.** 10 m², a munkasíkon átlagosan 300 lx a cél, 2000 lm-es LED-panelek, η = 0,5, k = 0,8.
N = 300 · 10 / (2000 · 0,5 · 0,8) = 3000 / 800 = 3,75 → 4 db.
E = 4 · 2000 · 0,5 · 0,8 / 10 = 3200 / 10 = 320 lx.
Ellenőrzés: 3 db-bal csak 3 · 800 / 10 = 240 lx lenne, ami kevés.

**3. Spotlámpa az asztal fölött.** A spot adatlapja szerint a fényerősség lefelé 1000 cd, a lámpa 2 m-rel van az asztallap fölött.
E = 1000 cd / (2 m)² = 1000 / 4 = 250 lx.
3 m magasból E = 1000 / 9 ≈ 111 lx: másfélszeres távolságból a megvilágítás kevesebb mint a felére esik, mert (2 / 3)² ≈ 0,44.
Ferdén, 1,5 m-rel oldalra: a távolság d = √(2² + 1,5²) = 2,5 m, cos ε = 2 / 2,5 = 0,8. Ha a spot ebbe az irányba 600 cd-t sugároz, E = 600 · 0,8 / 2,5² = 480 / 6,25 = 76,8 lx.

Az első két példát a Lumen és lux kalkulátorral is kiszámolhatod, a saját helyiséged adataival.

## Mekkora megvilágítás kell?

Munkahelyekre a munkahelyi világítás szabványa ad követelményt: irodai írásra, olvasásra és számítógépes munkára például a munkaterületen 500 lx átlagos megvilágítást. Lakásra nincs kötelező érték; a tájékoztató tartományok (közlekedőben kevesebb, olvasáshoz és konyhai munkapulton több) a kényelmet szolgálják. Lakásban jól bevált megoldás az általános világítás mellett a munkahelyi, például pult alatti világítás.

A hatásfok-módszer csak átlagot ad. Nem mutatja meg, hol lesz sötét folt, mennyire egyenletes a fény, és lesz-e zavaró káprázás. Munkahelyi világításhoz vagy a megvilágítás igazolásához pontonkénti fénytechnikai számítás kell, gyártói fényeloszlási adatokkal.

## Gyakori tévedések

- **„A lux a lámpa erőssége.”** A lux a felületre jutó fényt méri, nem a lámpáét. A lámpáét a lumen (összesen) és a kandela (egy irányban) írja le.
- **„Kétszer olyan messze fele annyi fény.”** A pontszerű forrás megvilágítása a távolság négyzetével csökken: kétszeres távolságban negyedannyi.
- **„A lumenek összeadása megadja a luxot.”** Csak ha elosztod a felülettel, és figyelembe veszed a kihasználási és a karbantartási tényezőt. Ezek nélkül a becslés jellemzően kétszeres–négyszeres túlbecslés.
- **„Egy 400 lm-es spot ugyanannyi fényt ad, mint egy 400 lm-es körte.”** Ugyanannyi lument, de a spot keskeny kúpba gyűjti: középen sokkal több luxot ad, a helyiség többi része viszont sötétebb marad.
- **„A watt megmutatja, mennyire világos lesz.”** Csak egy adott fényforrástípuson belül; LED-nél a lumen a mérvadó.
- **„Új lámpákkal elég pontosan a kívánt értékre méretezni.”** A fényforrások fénye az idővel csökken, a felületek szennyeződnek; ezt a karbantartási tényező veszi figyelembe.
