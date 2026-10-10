---
slug: kirchhoff-torvenyei
title: "Kirchhoff első és második törvénye: csomóponti és huroktörvény"
navTitle: "Kirchhoff törvényei"
summary: "Mit mond ki a csomóponti és a huroktörvény, hogyan számolj velük, és hol találkozol velük a lakásban: elosztó, nullavezető, feszültségesés."
section: elmelet
category: alapfogalmak
risk: R1
audience: [tanulo, szakember, laikus]
keywords: [Kirchhoff törvényei, csomóponti törvény, huroktörvény, Kirchhoff első törvénye, Kirchhoff második törvénye, áramok összege, feszültségek összege, csomópont, hurok, nullavezető árama]
synonyms: [kirchhoff, kirchhoff torvenyei, csomoponti torveny, huroktorveny, Kirchhoff I, Kirchhoff II, KCL, KVL, áramtörvény, feszültségtörvény]
related: [ohm-torvenye, soros-es-parhuzamos-kapcsolas, elektromos-teljesitmeny, rovidzarlat-es-tulterheles, aram-vedokapcsolo-fi-rele]
calculators: [ohm-torveny, eredo-ellenallas, feszultsegoszto, vezetek-ellenallas, fazisterheles]
sources:
  - standard: "IEC 60050-131 (Nemzetközi Elektrotechnikai Szótár – áramkörelmélet)"
    kiadás: "2002" # a hivatkozott szócikkek a 2002-es alapkiadásban szerepelnek; a módosítások (AMD1–AMD4, esetleg AMD5) számát lektor ellenőrizze
    pont: "131-15-09 (csomóponti törvény), 131-15-10 (huroktörvény)"
  - standard: "MSZ EN 60038"
    kiadás: "2011" # lektor ellenőrizze a honosítás évét
    pont: "1. táblázat (230/400 V névleges feszültség)"
  - standard: "IEC 60028"
    kiadás: "1925 (2. kiadás)"
    pont: "a lágyított réz 20 °C-os fajlagos ellenállása (1/58 Ω·mm²/m)"
ai: vázlat
version: 0.1
updated: 2026-10-10
---

**Röviden:** Kirchhoff két törvénye minden áramköri számítás alapja. Az első (csomóponti) törvény szerint egy elágazási pontba ugyanannyi áram folyik be, mint amennyi kifolyik belőle. A második (hurok-) törvény szerint bármely zárt körben a forrásfeszültségek összege megegyezik a feszültségesések összegével; az Ohm-törvénnyel együtt ebből a kettőből bármely, ellenállásokból és forrásokból álló egyenáramú hálózat kiszámolható.

## Alapfogalmak: ág, csomópont, hurok

- **Ág:** a hálózat két csomópont közötti szakasza, amelyben végig ugyanaz az áram folyik, például egy vezeték a rá kötött fogyasztóval.
- **Csomópont:** legalább három ág találkozási pontja. A gyakorlatban ilyen egy kötődobozbeli összekötés, egy sorkapocs vagy a lakáselosztó fázissínje.
- **Hurok:** az ágakon át körbejárható zárt út, amely ugyanabba a pontba tér vissza.

Mindkét törvény úgynevezett koncentrált paraméterű hálózatra érvényes: a vezetékek hossza legyen elhanyagolható a jel hullámhosszához képest. Az 50 Hz-es váltakozó áram hullámhossza kb. 6000 km, így egy épület hálózatára ez mindig teljesül.

[ÁBRA: abra-1 „Csomópont”. Egyetlen kitöltött pont (r = 5 px, --kk-fg) középen, belőle négy, egyenként 90 px hosszú vezetékszakasz (2,5 px, --kk-fg) átlós irányban (45°, 135°, 225° és 315°). Bal felső és bal alsó ágon a pont felé mutató nyíl (--kk-primary) „I1 = 3 A” és „I2 = 5 A” felirattal; jobb felső és jobb alsó ágon a ponttól elfelé mutató nyíl (--kk-warn-line) „I3 = 6 A” és „I4 = 2 A” felirattal. Alul középen .fig-label szöveg: „3 A + 5 A = 6 A + 2 A”. Feliratok .fig-label, 13 px; a nyílhegyek a vonal színét öröklik; viewBox 320 × 220. Az alt-szöveg mondja ki, hogy a befolyó és a kifolyó áramok összege egyaránt 8 A.]

## Az első törvény: a csomóponti törvény

Egy csomópontban a töltés nem tud felhalmozódni: ami másodpercenként befolyik, annak ugyanabban a másodpercben ki is kell folynia. Ezért:

I(be, 1) + I(be, 2) + … = I(ki, 1) + I(ki, 2) + …

Előjelesen felírva ΣI = 0, ha a befolyó áramokat pozitívnak, a kifolyókat negatívnak veszed.

### Számpélda: áram a lakáselosztó fázissínjén

Ugyanarról a fázisról három áramkör működik egyszerre: vízforraló (2000 W), hősugárzó (1150 W) és kenyérpirító (920 W). Mindhárom ellenállásjellegű (cos φ ≈ 1), a feszültség 230 V.

- I1 = 2000 W / 230 V = 8,70 A
- I2 = 1150 W / 230 V = 5,00 A
- I3 = 920 W / 230 V = 4,00 A

A fázissín csomópontjára befolyó áram: I = 8,70 A + 5,00 A + 4,00 A = 17,70 A.

Ellenőrzés más úton: az összteljesítmény 4070 W, és 4070 W / 230 V = 17,70 A. A két eredmény egyezik.

Egyfázisú körben a nullavezetőn (N) ugyanannyi áram folyik vissza, mint amennyi a fázisvezetőn (L) odamegy. Erre az elvre épül az [[aram-vedokapcsolo-fi-rele|áram-védőkapcsoló (FI-relé)]] is: ha a két áram eltér, a különbség valahol máshol, például a védővezetőn (PE) vagy egy emberen át folyik el.

### Váltakozó áramnál: pillanatértékek és fázisszög

A csomóponti törvény váltakozó áramnál minden pillanatban igaz. Az effektív értékek (amit a lakatfogó mutat) viszont csak akkor adódnak össze egyszerűen, ha az áramok fázisban vannak. A legfontosabb példa a háromfázisú hálózat csillagpontja: a nullavezető árama a három, egymáshoz képest 120°-kal eltolt fázisáram vektoros összege. Ha a három fázis azonos jellegű (azonos cos φ) terhelést kap, akkor:

IN = √(I1² + I2² + I3² − I1·I2 − I2·I3 − I3·I1)

| L1 | L2 | L3 | Nullavezető árama |
|---|---|---|---|
| 10 A | 10 A | 10 A | 0 A |
| 10 A | 10 A | 0 A | 10 A |
| 16 A | 8 A | 4 A | 10,58 A |

Az utolsó sor kézzel: 256 + 64 + 16 − 128 − 32 − 64 = 112, és √112 = 10,58 A. Nem 28 A, és nem is 0 A. Ha a fogyasztók torzított áramot vesznek fel (LED-meghajtók, számítógépek), a nullavezető árama ennél nagyobb is lehet. Fázisonkénti adatokkal a Fázisterhelés kalkulátor számol.

## A második törvény: a huroktörvény

Ha egy hurkot körbejársz, ugyanarra a potenciálra érkezel vissza, ahonnan elindultál. Ezért a körbejárás során a feszültségek előjeles összege nulla:

ΣU = 0, vagyis U(forrás) = U1 + U2 + … (a feszültségesések összege)

[ÁBRA: abra-2 „Hurok”. Téglalap alakú zárt áramkör, viewBox 360 × 200. Bal oldalon függőleges váltakozó feszültségű forrás (kör benne szinuszjellel, --kk-fg) „230 V” felirattal. A felső vezetéken kis téglalap-ellenállás „Rv/2” felirattal (L, --kk-wire-l1 színű vonal), az alsó vezetéken ugyanilyen „Rv/2” (N, --kk-wire-n színű vonal). Jobb oldalon függőleges, nagyobb téglalap „vízforraló, Rt = 26,45 Ω”. Az elemek mellett feszültségnyilak (--kk-primary): „2,58 V” (a két Rv/2 együtt, egy közös kapcsos jelöléssel) és „227,42 V” a vízforraló mellett. A hurok közepén szaggatott, körbejárási irányt jelző ív nyílheggyel (.fig-arc, --kk-muted). Alul .fig-label: „230 V = 227,42 V + 2,58 V”. A színek mellett az L és N betűjel is szerepeljen, hogy ne csak a szín jelöljön.]

### Számpélda: feszültségesés a vezetéken

Egy 2000 W-os (230 V-ra névleges) vízforraló ellenállása a névleges adatokból:

Rt = U² / P = (230 V)² / 2000 W = 26,45 Ω

Ezt állandónak veszed. A vezeték oda-vissza ellenállása Rv = 0,30 Ω. Ennyi kb. egy 22 m hosszú, 2,5 mm²-es rézvezeték oda-vissza (44 m) ellenállása 20 °C-on: 0,01724 Ω·mm²/m · 44 m / 2,5 mm² ≈ 0,30 Ω. A hálózat saját belső ellenállását itt elhanyagolod.

A huroktörvény szerint 230 V = I · Rv + I · Rt, ebből:

- I = 230 V / (0,30 Ω + 26,45 Ω) = 230 / 26,75 = 8,598 A
- a vízforralón: Ut = 8,598 A · 26,45 Ω = 227,42 V
- a vezetéken: Uv = 8,598 A · 0,30 Ω = 2,58 V
- ellenőrzés: 227,42 V + 2,58 V = 230,00 V

A vezetéken tehát a feszültség kb. 1,1 %-a esik. A vízforraló teljesítménye 227,42² / 26,45 ≈ 1955 W, vagyis kb. 2,2 %-kal kevesebb a névlegesnél. A vezeték ellenállását a Vezeték-ellenállás kalkulátor adja meg.

### Két forrás egy hurokban: párhuzamos akkumulátorok

Két 12 V-os akkumulátort párhuzamosan kötnek, terhelés nélkül. Az egyik nyugalmi feszültsége 12,6 V, a másiké 12,2 V, a belső ellenállásuk egyenként 0,05 Ω. A közös hurokban:

12,6 V − 0,05 Ω · I − 0,05 Ω · I − 12,2 V = 0, ebből I = 0,4 V / 0,10 Ω = 4 A.

Terhelés nélkül is folyik kiegyenlítő áram a két akkumulátor között: kezdetben 4 A, ami fokozatosan csökken, amíg a feszültségük ki nem egyenlítődik. Közben a belső ellenállásokon hő fejlődik. Ezért párhuzamosan csak azonos típusú és közel azonos töltöttségű akkumulátorokat szokás kötni.

## Így használd együtt a két törvényt

1. Vedd fel minden ág áramát tetszőleges iránnyal, és jelöld nyíllal.
2. Ha a hálózatnak n csomópontja van, írj fel n − 1 csomóponti egyenletet. Az utolsó már nem ad új információt.
3. A hiányzó egyenleteket független hurkokra írd fel (b ág esetén b − n + 1 darab). Körbejárás közben az ellenálláson az áram irányában haladva −I·R, vele szemben +I·R változást írj. A forráson a − kapocstól a + felé haladva +U, fordítva −U a változás.
4. Oldd meg az egyenletrendszert. Ha egy áramra negatív érték jön ki, az nem hiba: a valódi iránya ellentétes a felvettel.

Nagyobb hálózatra ugyanezekből a törvényekből levezetett, rövidebb eljárások is vannak: a csomóponti potenciálok és a hurokáramok módszere.

## Gyakori tévedések

- **„A fogyasztó elhasználja az áramot.”** Nem az áram fogy el, hanem az energia alakul át (hővé, fénnyé, mozgássá). Ami befolyik, az vissza is folyik. Ha kevesebb jön vissza, akkor a hiányzó rész máshol, szivárgó áramként folyik el.
- **„Egyfázisú körben a nullavezetőn nincs áram.”** Van: ugyanannyi, mint a fázisvezetőn.
- **Effektív értékek egyszerű összeadása.** Váltakozó áramnál csak azonos fázisszögnél szabad. A nullavezető árama háromfázisú hálózatban nem a három fázisáram összege.
- **Kihagyott vezeték-ellenállás.** A huroktörvényben a vezeték ellenállása is szerepel: hosszú, vékony vezetéken érezhető feszültség esik.
- **Negatív eredmény = elrontott számítás.** A negatív előjel csak azt jelenti, hogy a felvett iránnyal szemben folyik az áram.
- **Mind az n csomóponti egyenlet felírása.** Az n-edik egyenlet a többiből következik; ha hurokegyenlet helyett ezt használod, az egyenletrendszer nem lesz egyértelműen megoldható.
