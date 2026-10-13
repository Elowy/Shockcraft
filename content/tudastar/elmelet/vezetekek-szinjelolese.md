---
slug: vezetekek-szinjelolese
title: "Vezetékek színjelölése: barna, fekete, szürke, kék és zöld-sárga"
navTitle: "Vezetékek színjelölése"
summary: "Milyen színű a fázis-, a nulla- és a védővezető, mit jelent az L1, L2, L3, milyen színek fordulnak elő régi berendezésekben, és miért nem elég a szín?"
section: elmelet
category: kabelek-es-vezetekek
risk: R2
audience: [laikus, tanulo, szakember]
keywords: [vezetékszín, színjelölés, színkód, érszín, fázisvezető, nullavezető, védővezető, PEN, L1, L2, L3, N, PE, barna, fekete, szürke, kék, zöld-sárga, régi vezetékszínek, 3G, 5G]
synonyms: [vezetek szinek, vezetékszínek, vezeték színkód, fázis színe, nulla színe, földelés színe, milyen színű a fázis, kék vezeték, zöld-sárga vezeték, barna vezeték, fekete vezeték, szürke vezeték, védőföld, nulla, fázis]
related: [vezetek-es-kabeljelolesek, foldelesi-rendszerek, dugalj-bekotese, feszultsegmentesites-ot-szabalya, elektromos-feszultseg]
calculators: [fazisterheles]
sources:
  - standard: "MSZ EN IEC 60445"
    kiadás: "2022 (EN IEC 60445:2021)" # lektor ellenőrizze; az előző kiadás MSZ EN 60445:2018
    pont: "6.2 (vezetők azonosítása színnel), 6.3 (alfanumerikus jelölés)" # alpontokat lektor ellenőrizze
  - standard: "MSZ HD 60364-5-51"
    kiadás: "2010" # lektor ellenőrizze
    pont: "514.3 (vezetők azonosítása)"
  - standard: "MSZ HD 308 S2"
    kiadás: "2001 (HD 308 S2:2001)" # a honosítás évét lektor ellenőrizze
    pont: "a többeres kábelek és hajlékony vezetékek ereinek színe, zöld-sárga érrel és anélkül"
  - standard: "MSZ EN 60038"
    kiadás: "2011" # lektor ellenőrizze
    pont: "1. táblázat (230/400 V névleges feszültség)"
ai: vázlat
version: 0.1
updated: 2026-10-10
---

> **Figyelem:** A vezeték színe azt mutatja, mire szánták az eret, azt nem, hogy valójában mire kötötték. Hogy egy vezető feszültség alatt van-e, és melyik a fázis-, a nulla- vagy a védővezető, azt csak szakszerű mérés döntheti el. Villamos berendezésen csak szakképzett személy dolgozhat.

**Röviden:** A mai hazai gyakorlatban a fázisvezetők (L1, L2, L3) barnák, feketék és szürkék, a nullavezető (N) kék, a védővezető (PE) zöld-sárga. A zöld-sárga színt kizárólag védővezető kaphatja. Régi berendezésekben ettől eltérő színek is előfordulnak, ezért a szín csak eligazít, a mérést nem helyettesíti.

## Miért kell színkód?

Egy lakás villamos hálózatában több száz méter vezeték és sok tucat kötés van. Ha mindenhol ugyanaz a szín ugyanazt a szerepet jelöli, a szerelés és a későbbi javítás átláthatóbb, és kisebb az esélye, hogy két vezető felcserélődik. A színek általános szabályait az MSZ EN IEC 60445, az épületvillamossági alkalmazásukat az MSZ HD 60364-5-51, a kábelerek színét az MSZ HD 308 S2 rögzíti.

## A mai színek egy pillantásra

| Vezető | Jel | Szín |
|---|---|---|
| 1. fázisvezető | L1 | barna |
| 2. fázisvezető | L2 | fekete |
| 3. fázisvezető | L3 | szürke |
| fázisvezető egyfázisú áramkörben | L | többnyire barna |
| nullavezető | N | kék (világoskék) |
| védővezető | PE | zöld-sárga |
| egyesített védő- és nullavezető | PEN | zöld-sárga, a végeken kék jelöléssel, vagy kék, a végeken zöld-sárga jelöléssel |
| potenciálkiegyenlítő (EPH) vezető | – | zöld-sárga |

[ÁBRA: abra-1 „A mai színjelölés”. viewBox 0 0 320 230. Öt vízszintes ér egymás alatt, erenként 28 px magas, lekerekített végű sáv (x 70–250), 14 px térközzel. Bal oldalt félkövér betűjel (.fig-label): L1, L2, L3, N, PE; jobb oldalt a szín neve szövegesen: barna, fekete, szürke, kék, zöld-sárga. Kitöltés: --kk-wire-l1, --kk-wire-l2, --kk-wire-l3, --kk-wire-n; a PE zöld alapon (--kk-wire-pe) 45°-os sárga csíkokkal (--kk-wire-pe-stripe, 8 px-es periódus) – ez a két token a terv 3.4 pontja szerint még felveendő a kezikonyv.css-be. A fekete ér sötét témában is sötét marad, láthatóságát 1,5 px-es világos körvonal (--kk-fg) adja; a jelenlegi sötét témás --kk-wire-l2 érték (#d9dee2) színmintának nem alkalmas. Alul .fig-small: „Így látod a tervezőben: a PE egyszínű zöld.” A színt mindig felirat is kíséri.]

## Fázisvezetők: barna, fekete, szürke

A hazai 230/400 V-os hálózatban bármelyik fázisvezető és a nullavezető között 230 V, két fázisvezető között 400 V a névleges feszültség (230 V · √3 ≈ 398 V, kerekítve 400 V). A három fázis színe a háromfázisú áramkörökben különbözteti meg egymástól a vezetőket, például a főelosztóban, a tűzhely vagy a hőszivattyú bekötésénél. A bevett sorrend L1 barna, L2 fekete, L3 szürke; a Villanyrajz elosztótervezője is ezt használja.

Az egyfázisú áramkörök kábelében (például egy 3G1,5-ös vezetékben) a fázisvezető többnyire a barna ér, akkor is, ha az áramkört az elosztóban az L2-ről vagy az L3-ról táplálják. A barna szín tehát nem jelenti, hogy az ér az L1-en van; ezt az elosztó felirata és a terv mutatja meg. A kapcsolóból a lámpához menő kapcsolt fázis is fázisvezető: bekapcsolt állásban ugyanúgy feszültség alatt áll.

## Nullavezető: kék, de nem veszélytelen

A nullavezető üzemi vezető: rajta folyik vissza az áram. Egyfázisú áramkörben ugyanakkora áram folyik benne, mint a fázisvezetőben; egy 2000 W-os vízforralónál 2000 W / 230 V ≈ 8,7 A mindkettőben. Háromfázisú elosztásnál a közös nullavezetőben a fázisáramok fázishelyes (vektoros) összege folyik: kiegyenlített terhelésnél ez közel nulla, egyenlőtlen terhelésnél nem.

**Számpélda: mekkora áram folyik a közös nullavezetőben?** Egy lakáselosztóban az L1 fázis terhelése 16 A, az L2-é 10 A, az L3-é 4 A, mindhárom ohmos jellegű (cos φ = 1), szinuszos árammal. Az alábbi képlet csak egyforma cos φ mellett érvényes. A nullavezető árama:

I_N = √(I1² + I2² + I3² − I1 · I2 − I2 · I3 − I3 · I1)

- behelyettesítve: I_N = √(16² + 10² + 4² − 16 · 10 − 10 · 4 − 4 · 16) A
- négyzetek: 256 + 100 + 16 = 372
- szorzatok: 160 + 40 + 64 = 264
- I_N = √(372 − 264) A = √108 A ≈ 10,4 A

Ellenőrzésként: egyforma, 16-16-16 A-es terhelésnél a képlet 0 A-t ad, ha pedig csak az L1 terhelt 16 A-rel, az I_N éppen 16 A. A példában tehát a kék érben több áram folyik, mint az L3 fázisvezetőben. A felharmonikusokat termelő fogyasztók (LED-meghajtók, számítógépek) a nullavezető áramát tovább növelhetik; a számítást a Fázisterhelés és nullavezető-áram kalkulátor is elvégzi.

Ha a közös nullavezető megszakad, a fázisok feszültsége eltolódik, egyes készülékek a 230 V-nál jóval nagyobb feszültséget kaphatnak, és a megszakadt nullavezető fogyasztó felőli része is feszültség alá kerülhet. A kék eret ezért ugyanúgy veszélyesnek kell tekinteni, mint a fázisvezetőt.

## Védővezető: zöld-sárga, és csak az

A védővezető (PE) normál üzemben nem vezet terhelőáramot, legfeljebb kis szivárgóáram folyik benne. Testzárlatnál a hibaáramot vezeti el, és így teszi lehetővé, hogy a védelem lekapcsoljon. A zöld-sárga színkombinációt kizárólag védőfunkciójú vezető kaphatja: védővezető, PEN-vezető és potenciálkiegyenlítő vezető. A zöld-sárga eret soha nem szabad fázis- vagy nullavezetőként használni, akkor sem, ha a kábelben éppen „fölösleges”.

A **PEN-vezető** egyszerre védő- és nullavezető. A közcélú kisfeszültségű hálózatban és a csatlakozó vezetékben ma is jellemző, a PEN-szétválasztási pontig; régebbi, nullázásos (TN-C) épületi berendezésekben az épületen belül is előfordul. Jelölése zöld-sárga, a végeken kék jelöléssel, vagy kék, a végeken zöld-sárga jelöléssel. A szétválasztásról a [[foldelesi-rendszerek|Földelési rendszerek]] cikk szól.

Ha egy áramkörben nincs nullavezető, a kék ér a szabályok szerint más célra is felhasználható, védővezetőnek azonban soha. Ilyenkor a végeken tartós jelöléssel szokás egyértelművé tenni a szerepét.

## Erek színe a többeres kábelekben

A mai többeres kábelek és hajlékony vezetékek ereinek színe az MSZ HD 308 S2 szerint:

| Érszám | Erek színe | Jellemző szerep |
|---|---|---|
| 2 | kék, barna | kettős szigetelésű (II. osztályú) készülék csatlakozóvezetéke: N, L |
| 3, zöld-sárgával | zöld-sárga, kék, barna | egyfázisú áramkör: PE, N, L |
| 4, zöld-sárgával | zöld-sárga, barna, fekete, szürke | háromfázisú, nullavezető nélkül (például motor): PE, L1, L2, L3 |
| 5, zöld-sárgával | zöld-sárga, kék, barna, fekete, szürke | háromfázisú, nullavezetővel: PE, N, L1, L2, L3 |

A zöld-sárga ér nélküli kábelek érszínei ettől eltérnek; a jelölésük kiolvasásáról a [[vezetek-es-kabeljelolesek|Vezeték- és kábeljelölések]] cikk szól.

[ÁBRA: abra-2 „Ötös kábel régen és ma”. viewBox 0 0 360 210. Két kör alakú kábelkeresztmetszet egymás mellett (középpontok: (95, 95) és (265, 95)), a köpeny r = 68 px, kitöltése --kk-surface-2, körvonala --kk-border. Bennük öt ér (r = 18 px) szabályos ötszögben, a színek az 1. ábra tokenjeivel. Bal, cím: „Ma (5G)”: zöld-sárga (csíkos), kék, barna, fekete, szürke; az erek mellett betűjel: PE, N, L1, L2, L3. Jobb, cím: „Régebbi kábel (példa)”: zöld-sárga, kék, fekete, barna, fekete; a fázisereknél betűjel helyett „?”. Alatta .fig-small: „Két fekete ér: a fázisok a színből nem különböztethetők meg.” A színeket a betűjel vagy a kérdőjel mindig kíséri.]

## Régi berendezésekben

A mai színrend az ezredforduló utáni harmonizációval vált általánossá. A régebben szerelt, azóta át nem alakított berendezésekben többféle eltéréssel találkozhatsz:

- a harmonizáció előtti többeres kábelekben a fázisereket gyakran két fekete és egy barna ér adta, és előfordult, hogy a kék ér is fázisvezetőként szolgált;
- egyforma színű, egyeres vezetékek védőcsőben, ahol a szerepet semmilyen szín nem mutatja;
- kéteres vezetékezés védővezető nélkül; a régi, nullázásos (TN-C) rendszerekben a dugalj védőérintkezője a PEN-vezetőhöz (a régi szóhasználatban: nullavezetőhöz) csatlakozhatott;
- alumínium vezetők, amelyek anyaguk miatt is külön figyelmet kívánnak;
- utólagos javításokból maradt, eltérő színű toldások, valamint a hőtől és a kortól megfakult vagy megsötétedett szigetelés.

Régi berendezésben ezért a színek alapján semmit nem szabad biztosra venni. A vezetők szerepét és a feszültségmentességet szakember méréssel állapítja meg; a fáziskereső önmagában nem igazolja a feszültségmentességet. A munka előtti lépések rendjét [[feszultsegmentesites-ot-szabalya|A feszültségmentesítés öt szabálya]] cikk ismerteti.

## Jelölés szín nélkül

- **Betűjelek** a kapcsokon, a rajzokon és a jelölőhüvelyeken: L1, L2, L3, N, PE, PEN; egyenáramú körökben L+, L− és M (középvezető).
- **Számozott erek:** vezérlő- és jelzőkábelekben gyakran fekete, számmal jelölt erek futnak, mellettük zöld-sárga védővezetővel.
- **Utólagos jelölés:** jelölőhüvely, színes zsugorcső vagy szalag a vezetővégeken. Zöld-sárga jelölés csak védőfunkciójú vezetőre (PE, PEN, EPH) kerülhet.

## Gyakori tévedések

- **„A kék a föld.”** A kék a nullavezető, a védővezető zöld-sárga. A nullavezető üzem közben áramot vezet.
- **„Ami nem barna, az nem fázis.”** A fekete és a szürke is fázisvezető, régi berendezésben pedig bármilyen színű ér lehet az.
- **„A barna ér mindig az L1.”** Egyfázisú áramkörben a barna ér bármelyik fázisra kerülhet; ezt a terv és az elosztó felirata mutatja.
- **„A nullavezetőt nyugodtan meg lehet fogni.”** Terhelés alatt áram folyik benne, szakadásnál feszültség alá kerülhet.
- **„A fölösleges zöld-sárga ér tartaléknak jó.”** Soha nem lehet fázis- vagy nullavezető.
- **„Ha a színek rendben vannak, a bekötés is jó.”** A szín csak szándékot jelez; a bekötés helyességét mérés igazolja.
