---
slug: vilagitasi-kapcsolasok
title: "Világítási kapcsolások: melyik kapcsoló mikor kell? (101–107)"
navTitle: "Világítási kapcsolások"
summary: "A 101, 102, 105, 106, 106+6 és 107 kapcsolás összevetése: hány helyről, hány lámpakört kapcsol, hány ér kell hozzá, és mi alapján válassz közülük."
section: semak
category: kapcsolasok
risk: R3
safety: bekotes
audience: [szakember, tanulo, laikus]
keywords: [világítási kapcsolások, kapcsolótípusok, 101, 102, 105, 106, 106+6, 107, egypólusú kapcsoló, kétpólusú kapcsoló, csillárkapcsoló, váltókapcsoló, kettős váltókapcsoló, keresztkapcsoló, kapcsoló kiválasztása, érszám, kapcsolási helyek]
synonyms: [villanykapcsoló fajták, kapcsolófajták, kapcsoló típusok, milyen kapcsoló kell, lámpa kapcsolása, kapcsolási módok, lámpa több helyről, kapcsolószámok jelentése, 101 102 105 106 107]
plannerKinds: [switch1, switch2, switch5, switch6, switch7]
related: [egypolusu-kapcsolo-101-bekotese, ketpolusu-kapcsolo-102-bekotese, csillarkapcsolo-105-bekotese, valtokapcsolo-106-bekotese, kettos-valtokapcsolo-106-6-bekotese, keresztkapcsolo-107-bekotese, vezetekek-szinjelolese, ip-vedettseg, feszultsegmentesites-ot-szabalya, foldelesi-rendszerek, aram-vedokapcsolo-fi-rele]
calculators: [aram-teljesitmenybol]
figures:
  - id: abra-1
    kind: attekintes # gyűjtőoldali áttekintő ábra: a hat netlista Szerelési rajz nézete, új bekötési rajz nélkül
    views: [szerelesi-rajz]
    netlists:
      - egypolusu-kapcsolo-101-bekotese.netlist.json
      - ketpolusu-kapcsolo-102-bekotese.netlist.json
      - csillarkapcsolo-105-bekotese.netlist.json
      - valtokapcsolo-106-bekotese.netlist.json
      - kettos-valtokapcsolo-106-6-bekotese.netlist.json
      - keresztkapcsolo-107-bekotese.netlist.json
sources:
  - standard: "MSZ HD 60364-5-537 (leválasztás és kapcsolás)"
    kiadás: "2017 (HD 60364-5-537:2016)" # lektor ellenőrizze a honosítás évét és a hatályos kiadást
    pont: "537 – általános követelmények (a PEN-vezető nem kapcsolható) és az üzemi (funkcionális) kapcsolás alpontja (egypólusú kapcsolókészülék nem kerülhet a nullavezetőbe)" # alpontszámokat lektor adja meg
  - standard: "MSZ HD 60364-5-51"
    kiadás: "2010" # lektor ellenőrizze
    pont: "514.3 (vezetők azonosítása)"
  - standard: "MSZ EN IEC 60445"
    kiadás: "2022 (EN IEC 60445:2021)" # lektor ellenőrizze
    pont: "6.2 (vezetők azonosítása színnel)"
  - standard: "MSZ EN 60669-1 (háztartási és hasonló, helyhez kötött villamos berendezések kapcsolói)"
    kiadás: "2018 (EN IEC 60669-1:2018)" # lektor ellenőrizze a kiadást
    pont: "7 (osztályozás, bekötési számok), 8 (jelölés), 12 (kapcsok)" # pontszámokat lektor ellenőrizze
  - standard: "MSZ HD 60364-6 (ellenőrzés)"
    kiadás: "2017 (HD 60364-6:2016)" # lektor ellenőrizze
    pont: "6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás)" # alpontokat lektor ellenőrizze
ai: vázlat
review: lektorra-var
version: 0.1
updated: 2026-10-10
---

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

**Röviden:** A lakások világítása néhány alapkapcsolásból épül fel: egy lámpát egy helyről a 101-es, két lámpakört egy helyről a 105-ös, egy lámpát két helyről két 106-os kapcsoló kapcsol, három vagy több helyhez a két 106-os közé 107-es keresztkapcsolók kerülnek. A kettős váltókapcsolóval (106+6) két lámpa kapcsolható két helyről, a kétpólusú 102-es pedig a fázissal együtt a nullavezetőt is bontja. Közös bennük, hogy a kapcsoló mindig a fázisvezetőt bontja, a védővezetőt pedig soha.

[ÁBRA: abra-1 „Világítási kapcsolások a szerelési rajzon”. Forrás: a figures.netlists alatt felsorolt hat netlista; mindegyikből a Szerelési rajz nézet készül el egy-egy egyforma méretű kártyán, új bekötési rajz nem készül, kézzel semmi nem rajzolható át. Kártyánként viewBox 0 0 160 120; a kártyák rácsban (széles képernyőn három oszlop, mobilon egy). Kártyánként: a tervező ElectricalSymbol-jele (switch1; switch2; switch5; két switch6; két switch6 „106+6” megjegyzéssel; két switch6 és egy switch7), kötődoboz, lámpakiállás(ok), szakaszonként érszám-vonalkák és kiírt érszám a netlista sections mezőjéből. Kártyacím: a netlista short mezője; minden kártya a saját cikkére linkel. Alsó sor (.fig-small): „A jel alatti szám a típusszám utolsó jegye (101 → 1, …, 107 → 7). Így látod a tervezőben: a PE egyszínű zöld.” title: „Világítási kapcsolások a szerelési rajzon”; desc: a netlistákból generált felsorolás (kapcsolás, szerelvények, szakaszonkénti érszám).]

## Áttekintés

Az alábbi táblázat a hat alapkapcsolás és a négy helyről kapcsolt keresztkapcsolás fő jellemzőit veti össze. Minden sor mögött egy netlista áll, amelyet a szimulátor az összes kapcsolóállásban végigszámolt; a részleteket, a vezetéktáblát és a kapcsolóállás-táblázatot a kapcsolás saját cikke tartalmazza.

<!-- sim:osszehasonlitas src=egypolusu-kapcsolo-101-bekotese.netlist.json src=ketpolusu-kapcsolo-102-bekotese.netlist.json src=csillarkapcsolo-105-bekotese.netlist.json src=valtokapcsolo-106-bekotese.netlist.json src=kettos-valtokapcsolo-106-6-bekotese.netlist.json src=keresztkapcsolo-107-bekotese.netlist.json src=keresztkapcsolo-107-bekotese-2x107.netlist.json -->
| Kapcsolás | Szerelvények | Lámpakörök | Helyek lámpánként | Bontott vezetők | Erek a kapcsoló(k)hoz | Erek a lámpá(k)hoz | Szimuláció |
|---|---|---|---|---|---|---|---|
| 101 – egy hely | 101 | 1 | 1 | L | 2 | 3 | PASS, 2 állás (`162c980a`) |
| 102 – két pólus | 102 | 1 | 1 | L és N | 3 | 3 | PASS, 2 állás (`a253fd8a`) |
| 105 – két kör | 105 | 2 | 1 | L | 3 | 4 | PASS, 4 állás (`171c858b`) |
| 106 – két hely | 2 × 106 | 1 | 2 | L | 3 / 3 | 3 | PASS, 4 állás (`909db559`) |
| 106+6 – két kör, két hely | 2 × 106+6 | 2 | 2 | L | 5 / 6 | 3 / 3 | PASS, 16 állás (`837cd200`) |
| 107 – 3 hely | 2 × 106 + 107 | 1 | 3 | L | 3 / 4 / 3 | 3 | PASS, 8 állás (`835f0537`) |
| 107 – 4 hely | 2 × 106 + 2 × 107 | 1 | 4 | L | 3 / 4 / 4 / 3 | 3 | PASS, 16 állás (`9566473c`) |

_A táblázatot a szimulátor számolta a felsorolt netlistákból (7 kapcsolás, összesen 52 kapcsolóállás, mindegyik egyezik a várt működéssel, zárlat és védővezető-hiba nélkül). „Helyek lámpánként”: hány különböző kapcsolási helyről fordítható meg a lámpa állapota bármely állásból; „Bontott vezetők”: kikapcsolva mely üzemi vezetőket választja le a kapcsoló a lámpáról; az érszám a cikkek kötődobozos változatára vonatkozik, a védővezetővel együtt._
<!-- /sim:osszehasonlitas -->

A „Helyek lámpánként” és a „Lámpakörök” oszlop a lényeg: a váltókapcsolók két helyet adnak, a közéjük tett keresztkapcsolókkal a helyek száma tovább növelhető, a 105-ös és a 106+6-os kapcsoló pedig a lámpakörök számát növeli. Az érszám a kötődobozos változatra vonatkozik; ha a vezetékek a kapcsolódobozok között közvetlenül futnak, a szakaszonkénti érszám változik, a kapcsolás logikája nem.

## Közös szabályok

- **A kapcsoló a fázisvezetőt bontja.** Így helyes bekötésnél kikapcsolt állásban a lámpa foglalata és belső vezetékei nem kapnak fázist; feszültségmentessé ettől még nem válnak (lásd lent). Egypólusú kapcsolókészülék (a 101-es, a 105-ös, a 106-os és a 107-es is ilyen) nem kerülhet a nullavezetőbe.
- **A nullavezető a kapcsolót elkerülve jut a lámpához,** jellemzően a kötődobozban. Kivétel a kétpólusú 102-es, amely a fázisvezetővel együtt bontja. A nullázásos berendezések közös PEN-vezetőjét viszont semmilyen kapcsoló nem bonthatja.
- **A védővezető folytonos, és soha nem kapcsolt.** Minden fémtestű lámpatestig és fém kapcsolókeretig megszakítás nélkül fut; a zöld-sárga ér kizárólag védővezető lehet. A hiányzó védővezetőt tilos a nullavezetőből „pótolni”, és a PEN-szétválasztás után a nulla- és a védővezetőt újra összekötni tilos.
- **A kapcsolt fázis és a váltóvezeték is fázisvezető.** A kapcsolt fázis bekapcsolt állásban ugyanúgy feszültség alatt áll, mint a betáp; a váltóvezetékek közül pedig a szimuláció szerint minden állásban az egyik fázis alatt van, akkor is, ha a lámpa nem ég. Kék ér csak akkor kaphat ilyen szerepet, ha a szakaszban nincs nullavezető, és a végein tartós jelölés mutatja a szerepét (lásd: [[vezetekek-szinjelolese|Vezetékek színjelölése]]).
- **Jelölés mindkét végen.** A váltóvezetékek és a több lámpakör kapcsolt fázisai színből nem különböztethetők meg.
- **A falikapcsoló nem leválasztó.** Munkavégzés előtt a feszültségmentesítés az elosztóban történik, [[feszultsegmentesites-ot-szabalya|a feszültségmentesítés öt szabálya]] szerint, akkor is, ha a kapcsoló kétpólusú, és akkor is, ha a lámpa nem ég.
- **Az áram-védőkapcsoló (FI-relé) kiegészítő védelem.** Csak a fázis- és a nullavezető áramának különbségét érzékeli: ha valaki egyszerre a fázis- és a nullavezetőhöz kapcsolódó részt érint, nem feltétlenül old ki, és a nullát bontó kapcsolót vagy a felcserélt polaritást sem jelzi. A helyes bekötést és a feszültségmentesítést nem pótolja.

## Melyiket válaszd?

| Mit szeretnél? | Kapcsolás | Részletek |
|---|---|---|
| Egy lámpát vagy lámpacsoportot egy helyről | 101 | [[egypolusu-kapcsolo-101-bekotese|Egypólusú kapcsoló (101)]] |
| Két lámpakört egy helyről, ugyanarról az áramkörről | 105 | [[csillarkapcsolo-105-bekotese|Csillárkapcsoló (105)]] |
| Egy lámpát két helyről | 2 × 106 | [[valtokapcsolo-106-bekotese|Váltókapcsoló (106)]] |
| Két lámpát, mindkettőt két helyről | 2 × 106+6 | [[kettos-valtokapcsolo-106-6-bekotese|Kettős váltókapcsoló (106+6)]] |
| Egy lámpát három vagy több helyről | 2 × 106, közéjük helyenként egy 107 | [[keresztkapcsolo-107-bekotese|Keresztkapcsoló (107)]] |
| A fogyasztó fázis- és nullavezetőjét együtt bontani | 102 | [[ketpolusu-kapcsolo-102-bekotese|Kétpólusú kapcsoló (102)]] |

A típuson túl ezeket érdemes mérlegelni:

- **Áramkörök.** A 105-ös kapcsoló két lámpaköre közös betápról kap fázist. Ha a két lámpakört két külön áramkör táplálja, két egypólusú kapcsoló kell egy keretben (101 + 101), és mindkét áramkör nullavezetője a saját áramkörénél marad. Az ilyen dobozt az egyik kismegszakító lekapcsolása nem teszi feszültségmentessé; a kettős betáplálást jelölni kell.
- **Érszám és szerelési mód.** A több helyről kapcsolás több eret igényel: a kettős váltókapcsolásnál egy szakaszban hat ér is futhat. Ehhez kell méretezni a védőcsövet vagy a kábelt. Ahol később második bejárat vagy újabb kapcsolási hely várható, a tartalék ér vagy a védőcső a későbbi átalakítást könnyíti.
- **Nullavezető a kapcsolódobozban.** A klasszikus kapcsolásokban a kapcsolóhoz nem megy nullavezető. Sok okoskapcsoló, mozgásérzékelő és egyes jelzőfényes kapcsolók viszont igényelnek ilyet; erről a gyártói útmutató szól, és érdemes már a tervezéskor számolni vele.
- **Terhelhetőség.** A kapcsoló névleges áramát és feszültségét az adattáblája adja meg. Sok LED-meghajtó bekapcsoláskor rövid ideig nagy áramot vesz fel, a fix bekötésű készülékek (például a villanybojler) árama pedig jóval nagyobb is lehet egy világítási áramkörénél.
- **Helyiség és védettség.** Fürdőszobában, más nedves helyiségben és szabadban a kapcsoló elhelyezését és védettségét is meg kell választani (lásd: [[ip-vedettseg|IP-védettség]]).
- **Sok kapcsolási hely.** Minden további hely egy újabb keresztkapcsolót és egy négyeres szakaszt jelent. Hosszú folyosón vagy lépcsőházban ezért gyakran egyszerűbb a nyomógombos megoldás impulzusrelével (léptetőrelével) vagy lépcsőházi automatával, mert ott a nyomógombok párhuzamosan köthetők. Ezek bekötése külön téma.
- **Raktárkészlet.** A váltókapcsoló egypólusú kapcsolóként is beköthető (a fázis a közös kapocsra, a kapcsolt fázis az egyik kimenetre), ezért sok gyártó csak ezt forgalmazza. Fordítva nem működik: két egypólusú kapcsolóból nem lesz váltókapcsolás.

## Jelölés a tervezőben

A Villanyrajz tervezőjében a kapcsoló jele kör ferde vonallal: az egypólusú kapcsolónál egy, a többinél két ferde vonallal. A jel alatt a típusszám utolsó jegye áll.

| Szerelvény a tervezőben | Típusszám | Szám a jel alatt |
|---|---|---|
| Egypólusú kapcsoló | 101 | 1 |
| Kétpólusú kapcsoló | 102 | 2 |
| Csillárkapcsoló | 105 | 5 |
| Váltókapcsoló | 106 és 106+6 | 6 |
| Keresztkapcsoló | 107 | 7 |

A kettős váltókapcsolónak nincs külön jele: a kettős kivitelt a szerelvény neve vagy megjegyzése rögzíti. A kapcsolót és az általa kapcsolt lámpakiállást érdemes ugyanahhoz az áramkörhöz rendelni, így az anyaglista és az áramkörlista is követi a kapcsolást.

## Régi berendezésben

- **Nullát bontó kapcsoló.** Régi vagy utólag átalakított berendezésben előfordul, hogy a kapcsoló a nullavezetőt bontja. A lámpa működik, de kikapcsolva is fázis alatt áll; ez csak szakember által végzett méréssel derül ki.
- **Nullázásos (TN-C) rendszer.** A közös PEN-vezetőt semmilyen kapcsoló nem bonthatja. Régi berendezésben a kétpólusú kapcsoló beépítése előtt a földelési rendszert szakembernek kell felmérnie; ahol a PEN-vezetőt már szétválasztották, a nulla- és a védővezetőt a szétválasztási pont után újra összekötni tilos (lásd: [[foldelesi-rendszerek|Földelési rendszerek]]).
- **Védővezető nélküli lámpakiállás.** Ahol a lámpáig csak fázis- és nullavezető (csillárnál két kapcsolt fázis és nulla) fut, fémtestű lámpatest nem köthető be szakszerűen; a megoldásról szakember dönt. A lámpatest védőkapcsát a nullára kötni tilos: nullaszakadásnál vagy felcserélt vezetőknél a fémtest fázis alá kerül.
- **Közös nullavezető két áramkörre.** Az egyik áramkör lekapcsolása után a közös nullavezetőn a másik áramkör árama tovább folyhat; megbontása ezért a „lekapcsolt” áramkörben is áramütést okozhat.
- **Ma nem elfogadott váltókapcsolás,** amelynél a váltóvezetékek között nullavezető is fut. A szimuláció szerint bizonyos kapcsolóállásban zárlatot okoz.
- **Forgó vagy nyomógombos sorozatkapcsoló** a csillárkapcsoló helyett, jelöletlen kapcsokkal.
- **Megbízhatatlan érszínek, alumínium vezetők, szigetelőszalagos kötések.** A régi érszín semmit nem bizonyít; alumínium vezető csak arra alkalmas kapocsba vagy összekötőbe köthető.

## Gyakori hibák

A szimulátor a jellemző hibás bekötéseket is végigszámolta; a tüneteket a kapcsolások saját cikkei részletezik.

- **Kapcsoló a nullavezetőben:** a lámpa kikapcsolva is fázis alatt marad (101).
- **Keresztbe kötött pólusok a 102-esen,** vagy felcserélt vezetők a lámpánál: a lámpa működik, de a fázis a nulla felőli kapocsra jut.
- **Kapcsolt fázis a nullavezetők összekötőjében:** a billentyű bekapcsolásakor zárlat keletkezik (105).
- **A betáp nem a közös kapocsra kerül:** a négy állásból csak egyben ég a lámpa (106).
- **Hiányzó áthidaló a kettős váltókapcsoló két közös kapcsa között:** a második lámpa egyik állásban sem gyullad ki (106+6).
- **Összekevert kapocspárok a keresztkapcsolón:** az egyik állásában a lámpa egyik helyről sem kapcsolható be (107).
- **Zöld-sárga ér fázis- vagy váltóvezetékként,** vagy jelöletlen kék ér fázisként.
- **Két áramkör nullavezetőjének összekötése** egy közös kötő- vagy kapcsolódobozban.

## Mikor hívj szakembert?

- Mindig, ha kapcsolót, lámpát vagy kötést kell bekötni, cserélni vagy áthelyezni, vagy egy meglévő kapcsolást át kell alakítani, például egy lámpát egy helyett két helyről kapcsolhatóvá tenni.
- Azonnal, ha a lámpatest, a kapcsolókeret vagy más fémrész érintésekor bizsergést érzel: ne érintsd újra, kapcsold le az áramkört az elosztóban, és amíg a szakember meg nem vizsgálta, ne kapcsold vissza.
- Ha nem tudod eldönteni, melyik kapcsolás kell, vagy a meglévő kapcsoló típusa és bekötése nem azonosítható.
- Ha a lámpa csak bizonyos állásokban kapcsolható, kikapcsolva dereng vagy villog, vagy kapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a kapcsoló vagy a doboz meleg, elszíneződött, recseg, vagy égett szagot érzel.
- Ha régi, nullázásos berendezésben vagy védővezető nélküli lámpakiállásnál kellene új kapcsolót vagy lámpát bekötni.
- Ha okoskapcsolót, mozgásérzékelőt vagy impulzusrelés vezérlést építenél be.
