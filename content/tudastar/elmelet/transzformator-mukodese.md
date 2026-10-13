---
slug: transzformator-mukodese
title: "Transzformátor működése: áttétel, teljesítmény, veszteségek"
navTitle: "Transzformátor működése"
summary: "Hogyan alakítja át a transzformátor a feszültséget, mit jelent az áttétel és a VA, honnan erednek a veszteségek, és miért nem működik egyenárammal."
section: elmelet
category: elektromechanikus-atalakitok
risk: R1
audience: [tanulo, szakember, laikus]
keywords: [transzformátor, trafó, áttétel, menetszám, primer tekercs, szekunder tekercs, vasmag, indukció, vasveszteség, tekercsveszteség, hatásfok, VA, kVA, rövidzárási feszültség, biztonsági transzformátor]
synonyms: [trafo, transzformator, attetel, drop, toroid trafó, csengőtrafó, halogén trafó, elosztói transzformátor, takarékkapcsolású transzformátor, autotranszformátor, elválasztó transzformátor]
related: [elektromos-teljesitmeny, kirchhoff-torvenyei, rovidzarlat-es-tulterheles, foldelesi-rendszerek, soros-es-parhuzamos-kapcsolas]
calculators: [transzformator, teljesitmeny, latszolagos-meddo-teljesitmeny, aram-teljesitmenybol, fogyasztas-koltseg]
sources:
  - standard: "MSZ EN 60076-1 (IEC 60076-1)"
    kiadás: "IEC 60076-1:2011" # lektor ellenőrizze a magyar honosítás évét
    pont: "3.6 (veszteségek és üresjárási áram), 3.7 (rövidzárási impedancia)" # a pontszámokat lektor ellenőrizze a 2011-es kiadásban
  - standard: "A Bizottság 548/2014/EU rendelete (kis, közepes és nagy teljesítményű transzformátorok környezettudatos tervezése)"
    kiadás: "2014, a 2019/1783/EU rendelettel módosítva"
    pont: "I. melléklet (üresjárási és terhelési veszteségek legnagyobb értékei)"
  - standard: "MSZ EN 61558-2-6 (biztonsági elválasztó transzformátorok)"
    kiadás: "2010" # lektor ellenőrizze, van-e újabb honosított kiadás
    pont: "a rész egésze (biztonsági elválasztó transzformátor fogalma és követelményei)"
  - standard: "MSZ EN 60038"
    kiadás: "2011" # lektor ellenőrizze a honosítás évét
    pont: "1. táblázat (230/400 V névleges feszültség)"
ai: vázlat
version: 0.1
updated: 2026-10-10
---

**Röviden:** A transzformátor közös vasmagon elhelyezett tekercsekből áll, és egy váltakozó feszültséget más nagyságú váltakozó feszültséggé alakít. A feszültségek aránya a menetszámok arányával egyezik, az áramoké ennek fordítottja, így a teljesítmény a veszteségektől eltekintve mindkét oldalon ugyanannyi. Egyenárammal nem működik.

## Felépítés

- **Vasmag:** zárt mágneses kör vékony, egymástól szigetelt acéllemezekből (lemezelt mag), vagy feltekercselt acélszalagból (toroid mag).
- **Primer tekercs:** erre kapcsolódik a tápláló feszültség.
- **Szekunder tekercs:** erről kapja a feszültséget a terhelés.

A két tekercs között nincs villamos összeköttetés, csak mágneses csatolás. Ezt nevezzük galvanikus leválasztásnak. Kivétel a takarékkapcsolású transzformátor (autotranszformátor), amelynél a két oldal egy közös tekercsen osztozik.

[ÁBRA: abra-1 „A transzformátor felépítése”. Elölnézeti, egyszerűsített rajz: téglalap alakú, vastag keretként rajzolt vasmag (kitöltés --kk-surface-2, kontúr --kk-muted, 12 px vastag oszlopok), viewBox 360 × 220. A bal oszlopon sűrű tekercs (8 menet, --kk-wire-l1 színű ívek) „Primer, N1 = 1000” felirattal, a jobb oszlopon ritkább tekercs (4 menet, --kk-primary) „Szekunder, N2 ≈ 52” felirattal. A vasmagban körbefutó, szaggatott fluxusnyíl (--kk-warn-line) „Φ” jelöléssel. A bal oldali kivezetéseken „U1 = 230 V, I1 = 0,26 A”, a jobb oldalin „U2 = 12 V, I2 = 5 A”, mellettük egy terhelés-téglalap. Alul .fig-label: „U1 / U2 = N1 / N2 = I2 / I1”. A menetek száma jelképes; a menetszám-különbség a menetek sűrűségéből és a feliratból is látsszon.]

## Működési elv: változó mágneses fluxus

A primer tekercsre kapcsolt váltakozó feszültség váltakozó áramot hajt, amely a vasmagban váltakozó mágneses fluxust kelt. A vasmag ezt a fluxust a szekunder tekercsen is átvezeti. A változó fluxus a tekercsek minden menetében ugyanakkora feszültséget indukál, ezért az indukált feszültség a menetszámmal arányos.

Szinuszos feszültségnél ezt az úgynevezett transzformátor-egyenlet írja le:

U = 4,44 · f · N · Φmax

Itt U a tekercs feszültségének effektív értéke (V), f a frekvencia (Hz), N a menetszám, Φmax pedig a fluxus csúcsértéke (Wb).

**Számpélda.** 230 V-os, 50 Hz-es primer oldal, 1000 menettel:

- Φmax = 230 V / (4,44 · 50 Hz · 1000) = 230 / 222 000 = 0,00104 Wb = 1,04 mWb
- 10 cm²-es (0,001 m²) vasmag-keresztmetszetnél a mágneses indukció B = Φmax / A = 0,00104 Wb / 0,001 m² = 1,04 T

Ha a vasmag ugyanekkora menetszám mellett túl kicsi, az indukció túl nagyra nőne, a vas telítődne, és az üresjárási áram erősen megnőne. Az egyenletből az is látszik, miért kisebb egy nagyfrekvencián dolgozó transzformátor: nagyobb f-hez kisebb fluxus, tehát kisebb vasmag is elég.

**Egyenárammal nem működik.** Állandó feszültségnél a fluxus nem változik, ezért a szekunder tekercsben nem indukálódik feszültség. A primer tekercs áramát ilyenkor csak a tekercs kis ellenállása korlátozza, így az áram nagy lesz, és a tekercs túlmelegszik. Váltakozó feszültségnél ezt a primer tekercsben indukált ellenfeszültség akadályozza meg, ezért terhelés nélkül csak kis üresjárási áram folyik.

## Az áttétel

Ideális, veszteségmentes transzformátorra:

a = U1 / U2 = N1 / N2 = I2 / I1

**Számpélda: 230/12 V-os, 60 VA-es transzformátor**

- áttétel: a = 230 / 12 = 19,17
- szekunder áram névleges terhelésnél: I2 = 60 VA / 12 V = 5,00 A
- primer áram: I1 = 60 VA / 230 V = 0,261 A (ellenőrzés: 5,00 / 19,17 = 0,261 A)
- 1000 menetes primer tekercshez: N2 = 1000 / 19,17 = 52,2 menet

A valóságban a szekunder feszültség terhelés alatt csökken. Az ilyen kis transzformátorok névleges szekunder feszültsége névleges terhelésre vonatkozik, üresjárásban tehát a kimenő feszültség nagyobb a névlegesnél. Ezért a tervező a szekunder tekercsre a számítottnál valamivel több menetet tesz, a primer áram pedig a veszteségek miatt kicsit nagyobb az ideálisnál. (Az elosztói transzformátoroknál fordított a megállapodás: ott a névleges feszültségek az üresjárásra vonatkoznak, és terhelés alatt a kimenő feszültség a névleges alá csökken.) Ugyanezt a Transzformátor kalkulátor is kiszámolja.

## Teljesítmény: miért VA és nem W?

A transzformátor melegedése az áramtól (tekercsveszteség) és a feszültségtől (vasveszteség) függ, a terhelés teljesítménytényezőjétől (cos φ) nem. Ezért a névleges teljesítményét látszólagos teljesítményként, VA-ben vagy kVA-ben adják meg:

- egyfázisú: S = U · I
- háromfázisú: S = √3 · U · I (U a vonali feszültség, I a vonali áram)

Ha a 60 VA-es transzformátor cos φ = 0,5-ös terhelést táplál, a szekunder áram névleges terhelésnél ugyanúgy 5 A, a hatásos teljesítmény viszont csak P = S · cos φ = 60 · 0,5 = 30 W. A különbséget a Látszólagos és meddő teljesítmény kalkulátor mutatja meg.

**Háromfázisú példa:** egy 22/0,4 kV-os, 250 kVA-es elosztói transzformátor ideális esetben:

- I2 = 250 000 / (√3 · 400) = 360,8 A a kisfeszültségű oldalon;
- I1 = 250 000 / (√3 · 22 000) = 6,56 A a középfeszültségű oldalon;
- a vonali feszültségek aránya 22 000 / 400 = 55. A menetszámok aránya a tekercsek kapcsolásától (csillag vagy delta) függően ettől eltérhet.

## Veszteségek és hatásfok

- **Vasveszteség (üresjárási veszteség, P0):** a vasmag ismétlődő átmágnesezéséből (hiszterézis) és a vasban indukálódó örvényáramokból adódik. A lemezelés az örvényáramokat csökkenti. Gyakorlatilag független a terheléstől: a bekapcsolt, de nem terhelt transzformátor is fogyaszt.
- **Tekercsveszteség (terhelési veszteség, Pk):** a tekercsek ellenállásán keletkező I² · R hő. A terhelés négyzetével arányos: β-szoros terhelésnél (β = I / In) β² · Pk.
- **Szórt fluxus:** a fluxus egy része nem fogja át mindkét tekercset. A szórásból adódó reaktancia és a tekercsek ellenállása együtt adja a rövidzárási impedanciát, ezért terhelés alatt a szekunder feszültség csökken. Ezt a rövidzárási feszültség (uk %, a hazai gyakorlatban „drop”) jellemzi: a névleges primer feszültségnek az a százaléka, amely rövidre zárt szekunder mellett éppen a névleges áramot hajtja át.

Az uk a zárlati áramot is korlátozza. Végtelen erős táphálózatot feltételezve a kapcsokon fellépő háromfázisú zárlati áram Ik ≈ In / uk. A 250 kVA-es példára, feltételezett uk = 4 %-kal: Ik ≈ 360,8 A / 0,04 ≈ 9020 A, vagyis kb. 9 kA. Ezért kell a transzformátorhoz közeli védelmeknek nagy megszakítóképességűnek lenniük (lásd [[rovidzarlat-es-tulterheles|Rövidzárlat és túlterhelés]]).

A hatásfok, cos φ = 1 mellett:

η = P2 / (P2 + P0 + β² · Pk)

**Számpélda** a 250 kVA-es transzformátorra, feltételezett P0 = 0,4 kW és Pk = 3 kW veszteséggel (példaértékek, nem katalógusadatok):

| Terhelés (β) | Leadott teljesítmény | Veszteség | Hatásfok |
|---|---|---|---|
| 100 % | 250 kW | 0,4 + 3 = 3,4 kW | 98,66 % |
| 50 % | 125 kW | 0,4 + 0,25 · 3 = 1,15 kW | 99,09 % |
| 25 % | 62,5 kW | 0,4 + 0,0625 · 3 = 0,59 kW | 99,07 % |

A hatásfok ott a legnagyobb, ahol a terhelési veszteség egyenlő az üresjárásival: β = √(P0 / Pk) = √(0,4 / 3) = 0,365, vagyis kb. 37 %-os terhelésnél. Itt η ≈ 99,13 %. Az EU-ban forgalomba hozott új elosztói transzformátorok megengedett legnagyobb veszteségeit az 548/2014/EU bizottsági rendelet határozza meg; a fenti kerek példaértékek nem a rendelet határértékei.

Kis transzformátornál az üresjárási veszteség is számít, mert egész évben jelen van. Egy feltételezett 2 W-os üresjárási veszteség egy év alatt 2 W · 8760 h = 17,52 kWh energiát jelent. Ennek költségét a Fogyasztás és költség kalkulátor adja meg.

## Fajták a gyakorlatban

- **Elosztói transzformátor:** a középfeszültséget (például 22 kV) alakítja 400/230 V-ra. A kisfeszültségű oldal csillagpontjáról indul a nullavezető, illetve a PEN-vezető (lásd [[foldelesi-rendszerek|Földelési rendszerek]]).
- **Biztonsági elválasztó transzformátor:** törpefeszültséget állít elő (például 12 V), a primer és a szekunder oldal között kettős vagy megerősített szigeteléssel. Ezen az elven működik például a csengőtranszformátor is.
- **Elválasztó transzformátor:** jellemzően 1:1 áttételű, a feszültséget tehát nem változtatja, csak galvanikusan leválasztja a kimenetet a hálózatról.
- **Takarékkapcsolású transzformátor (autotranszformátor):** kisebb és olcsóbb, de nincs galvanikus leválasztás, ezért biztonsági leválasztásra nem alkalmas.
- **Toroid transzformátor:** kis szórt fluxus és kis méret jellemzi, bekapcsoláskor viszont nagy áramlökést vehet fel.
- **Kapcsolóüzemű tápegység („elektronikus trafó”):** nagyfrekvencián dolgozó, kis transzformátort tartalmaz. A kimenete nem minden terheléshez alkalmas, ezért a gyártói adatok az irányadók.

## Gyakori tévedések

- **„A transzformátor egyenárammal is működik.”** Nem: változó fluxus nélkül nincs indukált feszültség, a primer tekercs pedig túlmelegszik.
- **„A feltranszformált feszültséggel több energia jön ki.”** A teljesítmény nem nő: ahányszorosára nő a feszültség, nagyjából annyiad részére csökken az áram, és még a veszteség is levonódik.
- **„A VA ugyanaz, mint a W.”** Csak cos φ = 1-nél. A transzformátort a látszólagos teljesítmény terheli.
- **„Terhelés nélkül nem fogyaszt.”** A vasveszteség üresjárásban is jelen van.
- **„Minden transzformátor leválaszt a hálózatról.”** Az autotranszformátor nem.
- **„A transzformátor csak egy irányba működik.”** Fordítva is működik: a szekunder oldalra kapcsolt feszültség az áttétel szerint a primer oldalon is megjelenik. Ezért veszélyes, ha egy áramforrás, például egy szabálytalanul csatlakoztatott aggregátor a hálózatra táplál vissza: a transzformátoron át a lekapcsoltnak hitt hálózatrész is feszültség alá kerülhet.
- **„A 12 V-os trafó mindig 12 V-ot ad.”** Kis transzformátornál a névleges feszültség névleges terhelésre vonatkozik; üresjárásban a kimenő feszültség nagyobb, túlterhelve kisebb.
