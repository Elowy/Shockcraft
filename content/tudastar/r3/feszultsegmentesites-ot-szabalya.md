---
slug: feszultsegmentesites-ot-szabalya
title: "A feszültségmentesítés öt szabálya"
navTitle: "Feszültségmentesítés"
summary: "Leválasztás, visszakapcsolás elleni biztosítás, mérés, földelés és rövidrezárás, letakarás: miért ebben a sorrendben, és mik a gyakori hibák?"
section: elmelet
category: munkabiztonsag
risk: R3
safety: munkavegzes
simulation: false
audience: [szakember, tanulo, laikus]
keywords: [feszültségmentesítés, öt szabály, öt biztonsági szabály, leválasztás, visszakapcsolás elleni biztosítás, lakatolás, feszültségmentesség megállapítása, kétpólusú feszültségvizsgáló, földelés és rövidrezárás, letakarás, elkerítés, munkabiztonság, visszatáplálás]
synonyms: [5 szabály, öt aranyszabály, áramtalanítás, lekapcsolás munka előtt, kizárás, lakatolás, LOTO, feszültségmentes állapot, hogyan kell áramtalanítani, fáziskereső elég-e]
related: [foldelesi-rendszerek, egyenpotencialra-hozas-eph, dugalj-bekotese, egypolusu-kapcsolo-101-bekotese, kismegszakito, aram-vedokapcsolo-fi-rele, vezetekek-szinjelolese]
calculators: []
figures:
  - id: abra-1
    kind: folyamatabra
    views: [folyamat]
sources:
  - standard: "MSZ EN 50110-1 (villamos berendezések üzemeltetése)"
    kiadás: "2013 (EN 50110-1:2013)" # lektor ellenőrizze; az EN 50110-1:2023 honosítása és hatálya kérdéses
    pont: "6.2 (feszültségmentes állapotban végzett munka), 6.2.2–6.2.6 (az öt lépés), 6.2.7 (a feszültség visszaadása)" # alpontokat lektor ellenőrizze
  - standard: "MSZ 1585 (villamos berendezések üzemeltetése – az MSZ EN 50110-1 hazai kiegészítése)"
    kiadás: "2016" # lektor ellenőrizze a hatályos kiadást
    pont: "a feszültségmentesítésre és a munkavégzés engedélyezésére vonatkozó pontok" # a pontszámokat lektor adja meg
  - standard: "MSZ EN 61243-3 (kétpólusú kisfeszültségű feszültségvizsgálók)"
    kiadás: "2015 (EN 61243-3:2014)" # lektor ellenőrizze
    pont: "4 (követelmények)" # lektor ellenőrizze
  - standard: "MSZ EN 61230 (hordozható földelő vagy földelő-rövidzáró eszközök)"
    kiadás: "2009" # lektor ellenőrizze
    pont: "általános követelmények" # a pontszámot lektor adja meg
lektorKerdesek:
  - "Kisfeszültségű lakóépületi munkánál mikor kötelező a 4. lépés (földelés és rövidrezárás), és mikor hagyható el? A cikk most az MSZ EN 50110-1 elvét írja le, szám és kivételek nélkül."
  - "A nullavezető leválasztása: mikor kell a fázisvezetőkkel együtt bontani? A cikk ezt a hálózat rendszerétől és a munka jellegétől függőnek írja."
  - "A hazai szóhasználat: „villamos szakképzett személy”, „kioktatott személy”, „munkairányító”, „üzemeltető” – megfelel-e az MSZ 1585 hatályos fogalmainak?"
  - "Kell-e jogszabályi hivatkozás (munkavédelmi törvény, villamos berendezések üzemeltetésére vonatkozó rendelet), és ha igen, melyik?"
ai: vázlat
review: lektorra-var
version: 0.1
updated: 2026-10-10
---

> **Veszély – életveszély: áramütés-, ív- és tűzveszély.** A leírás szakembernek szól; az elveket ismerteti, nem helyettesíti a munkahelyi utasítást és a munkairányítást. Ha nem vagy villanyszerelő, ne dolgozz villamos berendezésen, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a feszültségmentesítés teljes elvégzése és a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A leválasztó- és záreszközök, valamint a vizsgálóműszerek jelölése és kezelése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

**Röviden:** Villamos berendezésen dolgozni csak feszültségmentes állapotban szabad, és ezt az állapotot öt lépés teremti meg, mindig ugyanebben a sorrendben. Az első kettő (leválasztás, visszakapcsolás elleni biztosítás) megakadályozza, hogy feszültség érkezzen, a harmadik (a feszültségmentesség megállapítása) igazolja, hogy nincs feszültség, a negyedik és az ötödik (földelés és rövidrezárás, a szomszédos feszültség alatti részek letakarása) a maradék veszélyek ellen véd. A feszültség visszaadása fordított sorrendben történik.

## Miért kell öt lépés?

Egy kismegszakító lekapcsolása önmagában nem feszültségmentesítés. A kismegszakító csak a fázisvezetőt bontja, az elosztó felirata tévedhet, egy dobozban több áramkör is futhat, és valaki véletlenül visszakapcsolhatja, amíg te dolgozol. Feszültség érkezhet nem várt irányból is: aggregátorról, napelemes inverterről, szünetmentes tápegységről vagy egy szomszédos áramkörről. A kikapcsolt kábelben a kondenzátorok és a hosszú vezetékek töltése is megmaradhat, és indukált feszültség is keletkezhet. Az öt lépés mindegyike egy-egy ilyen veszély ellen véd, ezért egyik sem hagyható ki és nem cserélhető fel.

## Az öt lépés egy pillantásra

[ÁBRA: abra-1 „A feszültségmentesítés öt lépése” (folyamatábra). Saját SVG, netlista nélkül. viewBox 0 0 360 520. Öt egymás alatti, lekerekített téglalap, számozott körrel és ikonnal (lucide-react: Unplug, Lock, Gauge, Cable, Shield), lefelé mutató nyilakkal összekötve: 1. Leválasztás – „minden betáplálási irányból”; 2. Visszakapcsolás elleni biztosítás – „lakat, felirat”; 3. A feszültségmentesség megállapítása – „kétpólusú feszültségvizsgálóval, minden pólus között”; 4. Földelés és rövidrezárás – „előbb a földhöz, azután a vezetőkhöz”; 5. Letakarás, elkerítés – „a közeli feszültség alatti részek”. A 3. lépésnél oldalág: „Van feszültség? → vissza az 1. lépéshez”. Jobb oldalon felfelé mutató szaggatott nyíl: „Visszakapcsolás: fordított sorrendben (5 → 1)”. Színek: --kk-fg keret, a 3. lépés kiemelt keretű. Szöveges megfelelő: a cikk számozott listája. title: „A feszültségmentesítés öt lépése”; desc: a lépések felsorolása sorrendben.]

1. **Leválasztás** – a munkaterület elválasztása minden lehetséges betáplálási iránytól.
2. **Visszakapcsolás elleni biztosítás** – annak megakadályozása, hogy bárki visszakapcsoljon.
3. **A feszültségmentesség megállapítása** – méréssel, minden pólus között.
4. **Földelés és rövidrezárás** – ahol előírt vagy szükséges.
5. **A szomszédos feszültség alatti részek letakarása vagy elkerítése.**

## 1. Leválasztás

A munkaterületet minden olyan iránytól le kell választani, ahonnan feszültség érkezhet. Ehhez leválasztásra alkalmas készülék kell, például főkapcsoló vagy leválasztó-kapcsoló, kivehető olvadóbiztosító-betét vagy olyan kismegszakító, amelyet a gyártó leválasztásra is alkalmasnak jelöl. Hogy a nullavezetőt is bontani kell-e, az a hálózat földelési rendszerétől és a munka jellegétől függ (lásd: [[foldelesi-rendszerek|Földelési rendszerek]]). A nullavezetőt a leválasztás után is feszültség alattinak kell tekinteni, amíg a mérés mást nem mutat: közös nullavezetőn, nulla- vagy PEN-szakadáskor, illetve felcserélt bekötésnél veszélyes feszültség és áram lehet rajta. Ne feledkezz meg a visszatáplálás lehetőségéről (aggregátor, inverter, szünetmentes tápegység) és a több helyről táplált áramkörökről.

## 2. Visszakapcsolás elleni biztosítás

A leválasztó készüléket úgy kell rögzíteni, hogy ne lehessen visszakapcsolni: lakattal zárható kapcsolóval, lezárt elosztóval, a kivett biztosítóbetét elzárásával. Mellé tartós, jól látható figyelmeztető tábla kerül, amely jelzi, hogy a berendezésen dolgoznak, és ki rendelkezik vele. Jó gyakorlat, hogy minden dolgozó a saját lakatját teszi fel, és csak ő veheti le.

## 3. A feszültségmentesség megállapítása

A feszültségmentességet a munkahelyen, közvetlenül a munka előtt, **minden pólus között** kell megállapítani: a fázisvezetők egymás között, a fázisvezetők és a nullavezető, illetve a védővezető között, valamint a nulla- és a védővezető között. Erre kétpólusú feszültségvizsgáló való, amelynek működését a mérés előtt és után egy ismert feszültségforráson ellenőrizni kell. Az egypólusú fáziskereső csavarhúzó **nem igazolja a feszültségmentességet**: kijelzése függ attól, hogyan állsz, milyen a padló, és lemerült vagy hibás eszköz is „nincs feszültséget” mutat. Ha bármelyik mérés feszültséget jelez, a munka nem kezdhető el, a leválasztást felül kell vizsgálni.

## 4. Földelés és rövidrezárás

A leválasztott részeket ott, ahol ez előírt vagy a körülmények miatt szükséges, földelni és egymással rövidre zárni kell. Ez akkor is véd, ha a vezetékre mégis feszültség kerül (téves bekapcsolás, visszatáplálás, indukció): az áram a rövidzáró eszközön folyik, és a védelem lekapcsol. A földelő-rövidzáró eszközt **mindig előbb a földeléshez**, azután a vezetőkhöz kell csatlakoztatni, eltávolításkor fordítva. Nagyfeszültségen ez általános követelmény; kisfeszültségen főként ott szükséges, ahol a leválasztott rész mégis feszültség alá kerülhet (például szabadvezetéknél vagy visszatáplálás lehetőségénél). Hogy egy adott munkánál kell-e, azt a munka irányítója a vonatkozó szabályok szerint dönti el.

## 5. A szomszédos feszültség alatti részek letakarása vagy elkerítése

Ha a munkaterület közelében feszültség alatt maradó részek vannak (például egy elosztóban a betáplálás kapcsai vagy egy másik áramkör), azokat szigetelő takarással, burkolattal vagy elkerítéssel kell védeni a véletlen érintés ellen. A munkaterületet jól láthatóan ki kell jelölni.

## A feszültség visszaadása

A munka végeztével a lépéseket **fordított sorrendben** kell visszavonni: a szerszámok és anyagok eltávolítása, a takarások levétele, a földelő-rövidzáró eszköz leszerelése (előbb a vezetőkről, utoljára a földről), a lakatok és táblák eltávolítása, majd a visszakapcsolás. Előtte meg kell győződni arról, hogy mindenki elhagyta a munkaterületet, és tud a visszakapcsolásról. Új vagy átalakított berendezést csak a szükséges ellenőrzések és mérések után szabad feszültség alá helyezni.

## Kapcsok és jelölés

A leválasztó készülékek állásjelzése (például „0/I”, piros-zöld jelzés), a lakatolható kivitel és a feszültségvizsgálók kijelzése gyártónként eltérhet; mindig a gyártói útmutató az irányadó. Az elosztók áramkörfeliratai segítenek, de nem helyettesítik a mérést.

## Régi berendezésben

- **Hiányos vagy téves feliratok**, átszámozott, utólag bővített elosztók.
- **Régi olvadóbiztosítós táblák**, amelyekben a betét kivétele nem mindig választ le minden vezetőt; felcserélt bekötésnél a betét a nullavezetőben is lehet, és a kivétele után a fázis feszültség alatt marad.
- **Megbízhatatlan érszínek:** régi vezetékezésben a kék ér is vezethet fázist.
- **Közös nullavezetők** több áramkör között: egy lekapcsolt áramkör nullavezetőjén is folyhat áram.
- **Kéteres, nullázott vezetékezés**, ahol a dugalj védőérintkezője a nullavezetőre van kötve (lásd: [[foldelesi-rendszerek|Földelési rendszerek]]).
- **Utólag beépített aggregátor-, napelem- vagy szünetmentes betáplálás**, amelyről a rajz nem tud.

## Gyakori hibák

- Csak a kismegszakító lekapcsolása, lakat és tábla nélkül.
- Fáziskereső használata a feszültségmentesség megállapítására.
- A vizsgálóeszköz ellenőrzésének elhagyása, vagy mérés csak a fázis és a föld között.
- A nullavezető érintése mérés nélkül, abban a hitben, hogy az nem lehet feszültség alatt.
- Rossz áramkör leválasztása a felirat alapján, ellenőrző mérés nélkül.
- A visszatáplálás lehetőségének figyelmen kívül hagyása.
- A földelő-rövidzáró eszköz rossz sorrendű fel- vagy leszerelése.
- Visszakapcsolás úgy, hogy nem mindenki hagyta el a munkaterületet.

## Mikor hívj szakembert?

- Mindig, ha villamos berendezésen kell dolgozni: a feszültségmentesítés szakképzett személy feladata. Az öt szabály ismerete nem tesz képessé a szerelésre: a leválasztási pont kiválasztása, a mérés és az eredmény értékelése szakmai gyakorlatot és megfelelő eszközt igényel.
- Ha nem tudod biztosan, melyik kismegszakító melyik áramkört táplálja, vagy az elosztó feliratai hiányosak.
- Ha az épületben aggregátor, napelemes rendszer vagy szünetmentes tápegység is van.
- Ha valakit áramütés ért: hívd a 112-t, és csak akkor nyúlj hozzá, ha az áramkört már veszélytelenül lekapcsoltad; magadat ne tedd ki áramütésnek.
- A mérőhelyen és a csatlakozáson végzett munkához: ezt az elosztói engedélyes szabályai szerint, az ő engedélyével lehet végezni.
