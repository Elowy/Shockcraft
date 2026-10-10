---
slug: elektromos-feszultseg
title: "Elektromos feszültség: volt, 230 V és 400 V"
navTitle: "Elektromos feszültség"
summary: "Mi a feszültség, mit jelent a volt, és miért 230 V a dugaljban, de 400 V két fázis között? Egyen- és váltakozó feszültség, csúcsérték, példákkal."
section: elmelet
category: alapfogalmak
risk: R1
audience: [laikus, tanulo, szakember]
keywords: [feszültség, volt, potenciálkülönbség, 230 V, 400 V, fázisfeszültség, vonali feszültség, csúcsérték, effektív érték, egyenfeszültség, váltakozó feszültség, törpefeszültség, huroktörvény]
synonyms: [villamos feszültség, potenciálkülönbség, hálózati feszültség, U]
related: [elektromos-aram, elektromos-ellenallas, ohm-torvenye, elektromos-teljesitmeny, kirchhoff-torvenyei]
calculators: [ohm-torveny, feszultsegoszto, teljesitmeny]
sources:
  - standard: "127/1991. (X. 9.) Korm. rendelet"
    kiadás: "hatályos szöveg"
    pont: "3. § (1) és 1. számú melléklet – törvényes mértékegységek (volt, joule, coulomb)"
  - standard: "MSZ EN 60038"
    kiadás: "2011"
    pont: "1. fejezet (alkalmazási terület, 50 Hz) és 1. táblázat (230/400 V névleges feszültség)"
  - standard: "MSZ EN 50160"
    kiadás: "2011 (a hatályos kiadás ellenőrizendő)"
    pont: "4.2.2 – a tápfeszültség változása kisfeszültségű hálózatban (pontszám ellenőrizendő)"
  - standard: "MSZ HD 60364-4-41"
    kiadás: "2007"
    pont: "414 – törpefeszültség (SELV és PELV)"
ai: vázlat
version: 0.1
updated: 2026-10-10
---

**Röviden:** A feszültség két pont közötti potenciálkülönbség: megmutatja, mennyi munkát végez a villamos tér, miközben egységnyi töltést juttat az egyik pontból a másikba. Mértékegysége a volt (V). A hazai kisfeszültségű hálózatban a fázisvezető (L) és a nullavezető (N) között 230 V, két fázisvezető között 400 V a névleges feszültség.

## Mi a feszültség?

A villamos töltésekre a villamos tér erőt fejt ki. Ha egy töltés a tér egyik pontjából a másikba jut, a tér munkát végez rajta – ez a munka alakul át a fogyasztóban hővé, fénnyé vagy mozgássá. A feszültség ezt a munkát egységnyi töltésre vonatkoztatja:

U = W / Q

- U – feszültség, voltban (V);
- W – munka (átalakult energia), joule-ban (J);
- Q – töltés, coulombban (C).

Egy volt tehát azt jelenti, hogy egy coulomb töltés átjutásakor egy joule energia alakul át: 1 V = 1 J/C.

**Kidolgozott példa – energia a feszültségből és a töltésből.** Egy 12 V-os akkumulátor – a feszültségét az egyszerűség kedvéért állandónak véve – 1 amperórányi töltést ad le. 1 Ah = 1 A · 3600 s = 3600 C, így az átalakult energia W = U · Q = 12 V · 3600 C = 43 200 J = 43,2 kJ. Ugyanez wattórában: 12 V · 1 Ah = 12 Wh (1 Wh = 3600 J, és 43 200 J / 3600 = 12 Wh). A két út ugyanarra az eredményre vezet.

A feszültség mindig **két pont között** értelmezhető. Egy vezetékről önmagában nem mondható meg, „mekkora a feszültsége”, csak az, hogy mihez képest: a fázisvezető feszültségét a nullavezetőhöz, a védővezetőhöz (PE) vagy a földhöz viszonyítjuk. A „feszültség alatt van” kifejezés is ezt jelenti: a vezeték és a környezete (például a föld vagy egy földelt fémszerkezet) között feszültség van.

Szemléltetésül sokan a vízvezetéket hozzák példának: a feszültség a nyomáskülönbségnek, az áram az átfolyó víz mennyiségének felel meg. Kezdésnek hasznos kép, de a váltakozó áramú jelenségeknél gyorsan eléri a határait.

## Mértékegység és nagyságrendek

A feszültség SI-egysége a volt. Gyakori többszörösei és törtrészei: millivolt (1 mV = 0,001 V) és kilovolt (1 kV = 1000 V).

| Példa | Jellemző feszültség |
|---|---|
| Ceruzaelem | 1,5 V (névleges) |
| Gépkocsi-akkumulátor | 12 V |
| LED-szalag, kerti világítás tápja | 12 V vagy 24 V |
| Háztartási hálózat, fázis és nulla között | 230 V |
| Háromfázisú hálózat, két fázis között | 400 V |
| Középfeszültségű elosztóhálózat | jellemzően 10–35 kV |

A villamos biztonság szempontjából külön kategória a **törpefeszültség**: váltakozó feszültségnél legfeljebb 50 volt, hullámosságmentes egyenfeszültségnél legfeljebb 120 volt. Erre épülnek a SELV és a PELV nevű védelmi módok. A kis feszültség azonban nem jelent automatikusan veszélytelenséget: egy nagy kapacitású akkumulátor rövidzárlata törpefeszültségen is erős melegedést, akár tüzet okozhat, mert ott a nagy áram a veszélyes.

## Egyenfeszültség és váltakozó feszültség

**Egyenfeszültségnél** (DC) a polaritás állandó: az egyik pont mindig pozitív a másikhoz képest. Ilyen az akkumulátor, a napelemmodul vagy egy tápegység kimenete.

**Váltakozó feszültségnél** (AC) a polaritás periodikusan változik. A közcélú hálózat feszültsége közel szinuszos, frekvenciája Európában 50 Hz: másodpercenként 50 teljes periódus, egy periódus 20 ms.

A hálózati feszültség megadott értéke – a 230 V – az **effektív érték** (lásd [[elektromos-aram#az-effektiv-ertek|Az effektív érték]]). A pillanatnyi érték ennél nagyobbra is kileng; szinuszos feszültségnél a csúcsérték:

Û = √2 · U_eff

**Kidolgozott példa – a 230 V csúcsértéke.** Û = √2 · 230 V ≈ 1,4142 · 230 V ≈ 325,3 V. A pozitív és a negatív csúcs között (csúcstól csúcsig) ennek kétszerese, kb. 650,5 V van. Ezért például egy egyenirányító utáni kondenzátor vagy egy félvezető feszültségtűrését a csúcsértékhez kell választani. A kifejezetten váltakozó feszültségre készült alkatrészek (például a hálózati zavarszűrő kondenzátorok) névleges feszültségét viszont már effektív értékben adják meg.

[ÁBRA: abra-1 – A 230 V-os hálózati feszültség egy periódusa. viewBox 0 0 320 190, a rajzterület bal 40 px-e a függőleges tengely feliratainak marad. Vízszintes időtengely 0–20 ms, osztásjelek 5 ms-onként (0, 5, 10, 15, 20 ms), függőleges tengely −400…+400 V, osztásjelek 100 V-onként. Rácsvonalak 1 px, var(--kk-track). Szinuszgörbe 2,5 px, var(--kk-primary), 0 ms-nál nulláról indul, 5 ms-nál +325 V csúcs, 15 ms-nál −325 V. Szaggatott vízszintes vonalak +325 V-nál és −325 V-nál, var(--kk-muted), felirat: „Û ≈ 325 V”. Folytonos vízszintes vonal +230 V-nál, 1,5 px, var(--kk-warn-line), felirat: „U_eff = 230 V”. Függőleges kettős nyíl a két csúcs között a 17 ms-os pozíciónál, var(--kk-fg), felirat: „csúcstól csúcsig ≈ 650 V”. Minden felirat var(--kk-fg), 12 px; a jelölés nem csak színnel, hanem vonaltípussal (szaggatott/folytonos) is különbözik. title: „A 230 V-os hálózati feszültség egy periódusa”; desc: „Szinuszgörbe 20 ms alatt; effektív érték 230 V, csúcsérték kb. 325 V, csúcstól csúcsig kb. 650 V.”]

## Fázisfeszültség és vonali feszültség

A háromfázisú hálózatban három fázisvezető (L1, L2, L3) van. A feszültségeik ugyanakkorák, de időben egymáshoz képest egyharmad periódussal, azaz 120°-kal eltolva érik el a csúcsukat (50 Hz-en ez 20 ms / 3 ≈ 6,67 ms).

- **Fázisfeszültség** (U_f): egy fázisvezető és a nullavezető között, névlegesen 230 V.
- **Vonali feszültség** (U_v): két fázisvezető között, U_v = √3 · U_f.

**Kidolgozott példa – miért 400 V?** U_v = √3 · 230 V ≈ 1,7321 · 230 V ≈ 398,4 V. A névleges érték kerekítve 230/400 V; visszafelé számolva 400 V / √3 ≈ 230,9 V. Azért nem 2 · 230 = 460 V, mert a két fázis feszültsége nem egyszerre éri el a csúcsát: a 120°-os eltolás miatt a két feszültséget vektorosan kell kivonni egymásból.

[ÁBRA: abra-2 – Háromfázisú feszültségek vektorábrája. viewBox 0 0 320 260. Középpont (N) a (160, 140) pontban, kis kitöltött kör, felirat „N”. Három azonos hosszúságú (90 px) nyíl a középpontból: L1 felfelé (90°), L2 jobbra lefelé (−30°), L3 balra lefelé (210°), színük sorban var(--kk-wire-l1), var(--kk-wire-l2), var(--kk-wire-l3), vastagság 3 px, feliratuk a nyílhegynél „L1 230 V”, „L2 230 V”, „L3 230 V”. Az L1 és L2 nyílhegyét összekötő szaggatott, 2 px-es szakasz var(--kk-primary) színnel, felirat a közepén: „U_v = √3 · 230 V ≈ 400 V”. Két szomszédos nyíl között ív „120°” felirattal, var(--kk-muted). A var(--kk-wire-l2) token sötét témában magától világos árnyalatra vált, így az L2 nyíl a sötét háttéren is látszik; külön sötét változat nem kell. Minden nyílon szöveges felirat is van, nem csak szín. title: „Fázis- és vonali feszültség”; desc: „Három 230 V-os fázisfeszültség 120°-os eltolással; két fázis között kb. 400 V.”]

## Feszültség az áramkörben: forrás és fogyasztó

Zárt áramkörben a forrás feszültsége megoszlik az áramkör elemei között. [[kirchhoff-torvenyei|Kirchhoff huroktörvénye]] szerint egy zárt hurok mentén a feszültségek előjeles összege nulla – egyszerűbben: a forrás feszültsége egyenlő a hurokban eső feszültségek összegével. Feszültség nemcsak a fogyasztón esik, hanem a vezetékeken is (feszültségesés), ezért terhelés alatt a fogyasztóra jellemzően valamivel kevesebb jut, mint a táppontnál.

**Kidolgozott példa – huroktörvény.** A táppontnál 230 V van. Terhelés alatt a fázisvezetőn 2,3 V, a nullavezetőn szintén 2,3 V esik. A fogyasztóra jutó feszültség: 230 V − 2,3 V − 2,3 V = 225,4 V. A teljes vezetékes feszültségesés 4,6 V, ami a 230 V-nak 4,6 / 230 = 2 %-a. Hogy a vezetéken mennyi esik, az az áramtól és a vezeték ellenállásától függ: ezt [[ohm-torvenye|Ohm törvénye]] és az [[elektromos-ellenallas|ellenállásról szóló cikk]] mutatja meg.

A hálózati feszültség a terheléstől és a hálózat állapotától függően a névleges érték körül ingadozik. A közcélú hálózat feszültségének jellemzőit szabvány írja le. Kisfeszültségen egy hét alatt a 10 perces átlagértékek legalább 95 %-ának a névleges érték ±10 %-án belül kell lennie (230 V-nál 207–253 V), és egyik 10 perces átlag sem eshet a +10 %/−15 %-os sávon (195,5–253 V) kívül.

## Gyakori tévedések

- **„A feszültség átfolyik a vezetéken.”** Az áram folyik; a feszültség két pont _között_ van, illetve egy elemen _esik_.
- **„A 230 V a legnagyobb érték.”** A 230 V effektív érték; a szinuszos feszültség csúcsértéke kb. 325 V.
- **„Két fázis között 2 · 230 = 460 V van.”** A 120°-os eltolás miatt a vonali feszültség csak √3-szoros, névlegesen 400 V.
- **„A nullavezető mindig feszültségmentes.”** A nullavezető üzem közben áramot vezet, és például szakadás vagy hibás bekötés esetén veszélyes feszültségre kerülhet a földhöz képest. Egyetlen vezetőt sem szabad pusztán a színe vagy a szerepe alapján feszültségmentesnek tekinteni.
- **„Ha nem pontosan 230 V-ot mérnek, hiba van.”** A hálózati feszültség a megengedett sávon belül természetes módon ingadozik; egy 236 V-os vagy 224 V-os érték még önmagában nem utal hibára.
- **„Törpefeszültségen nincs mire figyelni.”** Az áramütés veszélye kisebb, de a nagy áramú források rövidzárlata törpefeszültségen is tüzet okozhat.
