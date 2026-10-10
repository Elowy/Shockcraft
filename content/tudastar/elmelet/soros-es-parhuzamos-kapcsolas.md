---
slug: soros-es-parhuzamos-kapcsolas
title: "Soros és párhuzamos kapcsolás: ellenállás, kondenzátor, lakás"
navTitle: "Soros és párhuzamos kapcsolás"
summary: "Soros és párhuzamos kapcsolás ellenállással és kondenzátorral, eredőszámítással, és miért párhuzamosan kapcsolódnak a lakás fogyasztói."
section: elmelet
category: alapfogalmak
risk: R1
audience: [laikus, tanulo, szakember]
keywords: [soros kapcsolás, párhuzamos kapcsolás, eredő ellenállás, eredő kapacitás, replusz, vegyes kapcsolás, feszültségosztás, áramosztás, fűtőbetét, lakás fogyasztói]
synonyms: [soros kapcsolas, parhuzamos kapcsolas, sorba kötés, párhuzamos kötés, eredo ellenallas, eredo kapacitas, replusz, vegyes kapcsolas]
related: [kirchhoff-torvenyei, ohm-torvenye, elektromos-teljesitmeny, rovidzarlat-es-tulterheles, egypolusu-kapcsolo-101-bekotese]
calculators: [eredo-ellenallas, eredo-kapacitas, ohm-torveny, teljesitmeny, aram-teljesitmenybol, feszultsegoszto]
sources:
  - standard: "IEC 60050-131 (Nemzetközi Elektrotechnikai Szótár – áramkörelmélet)"
    kiadás: "2002" # a hivatkozott szócikkek a 2002-es alapkiadásban szerepelnek; a módosítások (AMD1–AMD4, esetleg AMD5) számát lektor ellenőrizze
    pont: "131-12-75 (soros kapcsolás), 131-12-76 (párhuzamos kapcsolás)"
  - standard: "MSZ EN 60038"
    kiadás: "2011" # lektor ellenőrizze a honosítás évét
    pont: "1. táblázat (230/400 V névleges feszültség)"
ai: vázlat
version: 0.1
updated: 2026-10-10
---

**Röviden:** Soros kapcsolásban az elemek egyetlen áramutat alkotnak: mindegyiken ugyanaz az áram folyik, a feszültség pedig megoszlik közöttük. Párhuzamos kapcsolásban minden elem ugyanazt a feszültséget kapja, az áramok pedig összeadódnak. A lakás fogyasztói párhuzamosan kapcsolódnak, ezért kap mindegyik 230 V-ot, és ezért nő az áramkör árama minden bekapcsolt készülékkel.

[ÁBRA: abra-1 „Soros és párhuzamos kapcsolás”. Két panel egymás mellett (mobilon egymás alatt), viewBox egyenként 300 × 200. Bal panel „Soros”: bal oldalon függőleges forrás „U”, a felső vezetéken egymás után két téglalap-ellenállás „R1” és „R2”, a kör jobb oldalt és alul zárul. Egyetlen áramnyíl (--kk-primary) „I” felirattal a felső vezetéken, a két ellenállás fölött feszültségnyilak (--kk-warn-line) „U1” és „U2”, alul .fig-label: „I közös, U = U1 + U2”. Jobb panel „Párhuzamos”: a forrástól két függőleges ágon „R1” és „R2”, az ágakon külön áramnyilak „I1” és „I2”, a közös vezetéken „I”, a két ellenállás mellett egy közös feszültségnyíl „U”. Alul .fig-label: „U közös, I = I1 + I2”. Vonalak --kk-fg, 2,5 px; feliratok .fig-label.]

## Soros kapcsolás

Soros kapcsolásban az elemek egymás után, elágazás nélkül követik egymást. A csomóponti törvényből következik, hogy mindegyiken ugyanaz az áram folyik. A huroktörvényből pedig az, hogy a tápfeszültség megoszlik közöttük: U = U1 + U2 + … + Un. Az eredő ellenállás:

Re = R1 + R2 + … + Rn

Az eredő mindig nagyobb a legnagyobb tagnál. Az egyes elemekre jutó feszültség az ellenállásukkal arányos (feszültségosztás):

Uk = U · Rk / Re

A soros kapcsolás gyenge pontja a szakadás. Ha egyetlen elem megszakítja az áramutat, mindegyik elem áram nélkül marad; ezt mutatják a régi, sorba kötött izzós karácsonyfaégők is.

## Párhuzamos kapcsolás

Párhuzamos kapcsolásban minden elem ugyanarra a két pontra csatlakozik, így mindegyik ugyanazt a feszültséget kapja. Az ágáramok a csomóponti törvény szerint összeadódnak: I = I1 + I2 + … + In. Az eredő ellenállás:

1 / Re = 1 / R1 + 1 / R2 + … + 1 / Rn

Két tagra rövidebben, az úgynevezett replusz művelettel: Re = R1 · R2 / (R1 + R2). Az eredő mindig kisebb a legkisebb tagnál. Az áram a kisebb ellenállású ágon folyik nagyobb arányban (áramosztás):

I1 = I · R2 / (R1 + R2)

Párhuzamos kapcsolásban egy ág kiesése a többit nem érinti: azok ugyanazt a feszültséget kapják tovább.

## Kidolgozott példa: kétfokozatú fűtés két fűtőbetéttel

Egy hősugárzóban két egyforma, 230 V-on 1000 W-os fűtőbetét van. Egy betét ellenállása:

R = U² / P = (230 V)² / 1000 W = 52,9 Ω

A kapcsoló a betéteket háromféleképpen kötheti:

| Kapcsolás | Eredő ellenállás | Áram | Teljesítmény |
|---|---|---|---|
| két betét sorosan | 52,9 + 52,9 = 105,8 Ω | 230 / 105,8 = 2,17 A | 230² / 105,8 = 500 W |
| egy betét | 52,9 Ω | 230 / 52,9 = 4,35 A | 1000 W |
| két betét párhuzamosan | 52,9 / 2 = 26,45 Ω | 230 / 26,45 = 8,70 A | 230² / 26,45 = 2000 W |

Sorosan kötve mindkét betétre a feszültségnek csak a fele jut. Mivel P = U² / R, betétenként a teljesítmény a névleges negyedére, 250 W-ra esik, a kettő együtt 500 W. Ez a párhuzamos kapcsolás 2000 W-jának negyede, és egyetlen betét teljesítményének a fele. A számítás feltételezi, hogy a betétek ellenállása nem változik a hőmérséklettel; fűtőbetétnél ez jó közelítés, izzólámpánál nem. Ellenőrzéshez az Eredő ellenállás kalkulátort és a Villamos teljesítmény kalkulátort használhatod.

## Vegyes kapcsolás

A valós hálózatokban soros és párhuzamos részek keverednek. Ilyenkor belülről kifelé haladva számolsz: előbb a tisztán párhuzamos vagy tisztán soros csoportokat vonod össze, aztán a kapott eredőket. Példa: egy 10 Ω-os ellenállással sorba kötsz egy párhuzamos párt, amely egy 22 Ω-os és egy 47 Ω-os ellenállásból áll.

- a párhuzamos pár: 22 · 47 / (22 + 47) = 1034 / 69 = 14,99 Ω
- a teljes eredő: 10 + 14,99 = 24,99 Ω

## A lakás fogyasztói párhuzamosan kapcsolódnak

A lakás dugaljai és lámpái a fázisvezető (L) és a nullavezető (N) közé kapcsolódnak, vagyis a fogyasztók egymással párhuzamosan vannak bekötve. Ennek három következménye van.

- **Minden készülék a teljes hálózati feszültséget kapja.** A 230 V-ra tervezett készülék ezért ugyanúgy működik, akárhány másik jár mellette. (Pontosabban: a vezetéken is esik egy kis feszültség, és ez az összárammal együtt nő; lásd a [[kirchhoff-torvenyei|Kirchhoff törvényei]] cikk számpéldáját.)
- **A készülékek egymástól függetlenül kapcsolhatók.** Egy készülék kikapcsolása vagy kiégése nem állítja le a többit.
- **Minden bekapcsolt készülékkel nő az áramkör árama.** Az eredő ellenállás csökken, az áram nő, és ezt az összegáramot viseli a vezeték és a kismegszakító.

Példa egy konyhai dugaljkörre: a vízforraló (2000 W) és a kávéfőző (1100 W) együtt 3100 W-ot vesz fel, ez 3100 / 230 = 13,48 A. Ha mellé bekapcsolsz egy 900 W-os kenyérpirítót is, az összteljesítmény 4000 W, az áram 4000 / 230 = 17,39 A. Ez már több a 16 A-es kismegszakító névleges áramánál. Hogy ilyenkor mi történik, a [[rovidzarlat-es-tulterheles|Rövidzárlat és túlterhelés]] cikk magyarázza el. Az áramot az Áram teljesítményből kalkulátor is kiszámolja.

Sorosan a lakásban is kapcsolódnak elemek a fogyasztókhoz, de ezek nem fogyasztók, hanem kapcsoló- és védőelemek. A lámpa kapcsolója és az áramkör kismegszakítója sorba kerül a fogyasztóval, ezért tudja megszakítani az áramát. Bekapcsolt állapotban az ellenállásuk közel nulla, így a feszültség szinte teljes egészében a fogyasztóra jut. A kapcsolók bekötését a Sémák rész mutatja be, például az [[egypolusu-kapcsolo-101-bekotese|egypólusú kapcsoló (101)]] oldalon.

## Kondenzátorok: fordított szabályok

Kondenzátoroknál a két szabály éppen fordított:

- **párhuzamosan** a kapacitások összeadódnak: Ce = C1 + C2 + … + Cn;
- **sorosan** a reciprokok adódnak össze: 1 / Ce = 1 / C1 + 1 / C2 + … + 1 / Cn.

Szemléletesen: a párhuzamos kapcsolás olyan, mintha nőne a fegyverzetek felülete, a soros pedig olyan, mintha vastagabb lenne a szigetelés közöttük. Sorosan kapcsolt kondenzátorokon ugyanakkora a töltés, ezért a feszültség a kapacitással fordított arányban oszlik meg.

Számpélda egy 10 µF-os és egy 22 µF-os kondenzátorral:

- párhuzamosan: 10 + 22 = 32 µF;
- sorosan: 10 · 22 / (10 + 22) = 220 / 32 = 6,875 µF;
- sorosan, 100 V egyenfeszültségre kapcsolva a töltés Q = 6,875 µF · 100 V = 687,5 µC, így a 10 µF-oson 687,5 / 10 = 68,75 V, a 22 µF-oson 687,5 / 22 = 31,25 V a feszültség. Összegük 100 V.

A kisebb kapacitású kondenzátorra jut a nagyobb feszültség. Valós alkatrészeknél a szivárgási áramok ezt a megoszlást tartósan el is tolhatják, ezért egyenfeszültségen a sorba kötött kondenzátorok mellé gyakran kiegyenlítő ellenállást tesznek. Számoláshoz az Eredő kapacitás kalkulátort használhatod.

## Gyakori tévedések

- **A kondenzátorok szabályait az ellenállásokéval azonosnak venni.** Párhuzamosan a kapacitás nő, sorosan csökken, vagyis éppen fordítva, mint az ellenállásnál.
- **„Több fogyasztó, nagyobb ellenállás, kisebb áram.”** Párhuzamos kapcsolásban fordítva van: minden újabb fogyasztó csökkenti az eredő ellenállást, és növeli az áramot.
- **„Sorba kötve minden fogyasztó a teljesítménye felét adja.”** Két egyforma, állandó ellenállású fogyasztó sorosan a névleges teljesítményének csak a negyedét adja, mert a feszültségnek és az áramnak is csak a fele jut rá (lásd a fűtőbetétes példát).
- **Két kisebb feszültségű készülék sorba kötése a hálózatra.** A feszültség az ellenállások arányában oszlik meg. Ha a két készülék ellenállása eltér, vagy üzem közben változik (például az egyik kisebb fokozatra kapcsol), a megosztás nem fele-fele lesz, és az egyikre a névlegesnél jóval nagyobb feszültség juthat.
- **„Soros kapcsolásban az áram elfogy az első fogyasztón.”** Az áram mindenhol ugyanakkora; az energia oszlik meg a fogyasztók között.
