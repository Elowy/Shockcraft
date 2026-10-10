---
slug: ip-vedettseg
title: "IP-védettség: mit jelent az IP20, IP44, IP65 és IP67?"
navTitle: "IP-védettség"
summary: "Mit jelent az IP-kód két számjegye, miben különbözik az IP44, az IP65 és az IP67, és milyen védettséget szokás választani a ház egyes helyein?"
section: elmelet
category: tovabbi-informaciok
risk: R2
audience: [laikus, tanulo, szakember]
keywords: [IP-védettség, IP-kód, védettségi fokozat, IP20, IP44, IP54, IP55, IP65, IP66, IP67, IP68, IPX4, IPXXB, porvédett, portömör, fröccsenő víz, vízsugár, vízbe merítés, burkolat, kültéri dugalj, kültéri lámpa, IK-kód]
synonyms: [ip vedettseg, ip kod, ip vedelem, ip besorolas, ip fokozat, vízálló, vízmentes, cseppálló, fröccsenésálló, porálló, kültéri konnektor, vízálló lámpa, ingress protection]
related: [dugalj-bekotese, aram-vedokapcsolo-fi-rele, vezetek-es-kabeljelolesek, vezetekek-szinjelolese]
calculators: []
sources:
  - standard: "MSZ EN 60529"
    kiadás: "2015 (IEC 60529:1989 + A1:1999 + A2:2013)" # a honosítás évét lektor ellenőrizze
    pont: "4. (a kód felépítése), 5. (első számjegy), 6. (második számjegy), 7. (kiegészítő betű), 8. (pótbetű), 13. (porvizsgálat), 14. (vízvizsgálatok; IPX5: 14.2.5, IPX6: 14.2.6, IPX7: 14.2.7)" # a vizsgálati pontszámokat lektor ellenőrizze
  - standard: "MSZ HD 60364-5-51"
    kiadás: "2010" # lektor ellenőrizze (+A11)
    pont: "512.2 (külső hatások), A. melléklet 51A táblázat (AD és AE kódok)"
  - standard: "MSZ HD 60364-7-701"
    kiadás: "2007" # lektor ellenőrizze
    pont: "701.512.2 (fürdő- és zuhanyozóhelyiség: védettség a zónák szerint) – csak utalás"
  - standard: "MSZ HD 60364-7-702"
    kiadás: "2011" # lektor ellenőrizze
    pont: "702.512.2 (úszómedence, szökőkút: védettség a zónák szerint) – csak utalás"
  - standard: "MSZ EN 62262"
    kiadás: "2002" # lektor ellenőrizze, újabb kiadás lehet
    pont: "az IK-kód (mechanikai ütés elleni védettség) – csak utalás"
  - standard: "MSZ EN 61140"
    kiadás: "2016" # lektor ellenőrizze
    pont: "7. (a villamos szerkezetek érintésvédelmi osztályai: 0, I, II, III)" # pontszámot lektor ellenőrizze
ai: vázlat
version: 0.1
updated: 2026-10-10
---

> **Figyelem:** Az IP-kód a burkolat tulajdonsága, és önmagában nem dönti el, hová szerelhető egy szerelvény. Hogy egy adott helyen (különösen fürdőszobában, kültéren vagy medence közelében) legalább milyen védettség kell, azt a vonatkozó előírások alapján a tervező határozza meg. Villamos szerelést csak szakképzett személy végezhet.

**Röviden:** Az IP-kód két számjegye megmutatja, mennyire védi a burkolat a belsejét. Az első számjegy (0–6) a szilárd testek és a por, a második (0–9) a víz elleni védelmet jelöli; a nagyobb szám erősebb védelmet jelent, de az IP67 nem minden szempontból jobb az IP65-nél. Száraz lakóhelyiségben jellemzően IP20-as, nedves és kültéri helyen IP44-es vagy magasabb fokozatú szerelvényt használnak.

## Hogyan épül fel az IP-kód?

Az IP betűpár az angol _International Protection_ (nemzetközi védettség) rövidítése; a köznyelv gyakran _Ingress Protection_-ként oldja fel. A kódot az MSZ EN 60529 rögzíti, és ugyanígy épül fel a dugaljon, a lámpán, a kötődobozon vagy az elosztószekrényen. A kód részei:

- **IP**: a kód jele;
- **első számjegy (0–6)**: védelem a szilárd idegen testek és a por bejutása ellen, egyben a veszélyes részek megérintése ellen;
- **második számjegy (0–9)**: védelem a víz káros hatása ellen;
- **kiegészítő betű (A, B, C, D)**: nem kötelező, az érintés elleni védelmet pontosítja;
- **pótbetű (H, M, S, W)**: nem kötelező, különleges vizsgálati feltételt jelez.

Ha valamelyik jellemzőt nem adják meg, mert nem vizsgálták, vagy az adott felhasználásnál nem lényeges, a számjegy helyére **X** kerül. Az IPX4 tehát fröccsenő víz elleni védelmet jelent, a porról viszont semmit nem mond. Az X nem azonos a 0-val: a 0 azt jelenti, hogy a burkolat az adott hatás ellen nem véd.

[ÁBRA: abra-1 „Az IP-kód felépítése”. viewBox 0 0 360 170. Felül középen nagy, félkövér felirat (26 px, --kk-fg): „IP 4 4 □ □”, a tagok között 22 px köz. Az „IP” alatt egyszerű keret (--kk-border), felirat alatta: „a kód jele”. Az első „4” kerete --kk-info-bg kitöltésű, 2 px --kk-info-line körvonallal; vezetővonal (.fig-lead) a felirathoz: „1. számjegy: szilárd testek, por (0–6)”. A második „4” kerete ugyanilyen kitöltésű, de 2 px --kk-wire-n körvonalú; felirat: „2. számjegy: víz (0–9)”. A két „□” üres, szaggatott keretes hely (.fig-limit, --kk-muted szöveg): „kiegészítő betű (A–D, nem kötelező)” és „pótbetű (H, M, S, W, nem kötelező)”. Alul .fig-small: „Ha egy jellemzőt nem adnak meg, a számjegy helyén X áll, pl. IPX4.” A tagokat a keret stílusa és a felirat is megkülönbözteti, nem csak a szín.]

## Az első számjegy: szilárd testek és por

Az 1–4-es fokozatot próbatestekkel vizsgálják: egy adott átmérőjű golyó, egy ujj méretű próbaujj, illetve egy vékony huzal nem juthat be a burkolatba, vagy nem érhet el veszélyes részt. Az 5-ös és a 6-os fokozatot porkamrában, finom porral ellenőrzik.

| Első számjegy | Védelem idegen testek ellen | Ezzel nem érhető el veszélyes rész |
|---|---|---|
| 0 | nincs védelem | – |
| 1 | legalább 50 mm átmérőjű testek | kézfej |
| 2 | legalább 12,5 mm átmérőjű testek | ujj |
| 3 | legalább 2,5 mm átmérőjű testek | szerszám |
| 4 | legalább 1 mm átmérőjű testek | huzal |
| 5 | porvédett: kevés por bejuthat, de nem zavarja a működést és a biztonságot | huzal |
| 6 | portömör: por nem jut be | huzal |

A lakásban leggyakoribb IP20 azt jelenti, hogy ujjal nem érhető el feszültség alatti rész, a vízzel szemben viszont nincs védelem.

[ÁBRA: abra-2 „Az első számjegy próbatestei valós méretarányban”. viewBox 0 0 360 210, méretarány 1 mm = 2,6 px. Egy vízszintes alapvonalon balról jobbra: 50 mm-es kör (130 px átmérő), 12,5 mm-es kör (32,5 px), 2,5 mm-es kör (6,5 px), 1 mm-es kör (2,6 px), végül egy 20 × 20 px-es pontfelhő (12 apró pötty) a porhoz. Körvonal --kk-fg, kitöltés --kk-surface-2, pöttyök --kk-muted. Mindegyik alatt a számjegy félkövéren (1, 2, 3, 4, 5–6) és a próbatárgy (.fig-label): „kézfej”, „ujj”, „szerszám”, „huzal”, „por”. A két legkisebb kör fölött 5× nagyított betétrajz szaggatott keretben (.fig-limit), „5× nagyítás” felirattal. Alul .fig-small: „Valós méretarány; a por bejutását az 5-ös és a 6-os fokozat különbözteti meg.”]

## A második számjegy: víz

| Második számjegy | Védelem | Példa a hatásra |
|---|---|---|
| 0 | nincs védelem | – |
| 1 | függőlegesen csepegő víz | lecsapódó pára lecsepeg |
| 2 | csepegő víz, legfeljebb 15°-kal megdöntött burkolatnál | ferdén szerelt lámpára csepegő víz |
| 3 | permetező víz, a függőlegestől legfeljebb 60°-ig | ferdén hulló eső |
| 4 | fröccsenő víz minden irányból | szél hajtotta eső, felcsapódó víz |
| 5 | vízsugár minden irányból | locsolócső sugara |
| 6 | erős vízsugár | nagy erejű lemosás |
| 7 | időleges vízbe merítés | kb. 1 m mélyen, 30 percig vizsgálva |
| 8 | tartós vízbe merítés | a gyártó adja meg a feltételt, szigorúbbat a 7-esnél |
| 9 | nagynyomású, forró vízsugár | ipari, járműmosó berendezés |

A 6-os fokozatig a nagyobb szám magában foglalja a kisebbeket: egy IPX5-ös burkolat a csepegő és a fröccsenő vizet is bírja. A 7-es és a 8-as viszont más jellegű vizsgálat (nyugvó víz, merítés), ezért nem jelenti automatikusan az 5-ös és a 6-os vízsugárvizsgálatot; a 9-es is önálló vizsgálat. Ha a gyártó többet is vállal, többes jelölést ad, például IP65/IP67.

## Kiegészítő és pótbetűk

A **kiegészítő betű** (A: kézfej, B: ujj, C: szerszám, D: huzal) akkor szerepel, ha az érintés elleni védelem jobb annál, amit az első számjegy mutat, vagy ha csak ezt adják meg. Az **IPXXB** például azt jelenti, hogy ujjal nem érhető el veszélyes rész, a porról és a vízről pedig nem nyilatkozik; elosztóban, sorkapcsoknál találkozhatsz vele.

A **pótbetűk** ritkák a lakásban: H (nagyfeszültségű készülék), M (a vízvizsgálat mozgásban lévő részekkel történt), S (a vízvizsgálat nyugalomban lévő mozgó részekkel történt), W (meghatározott időjárási körülményekre, kiegészítő védőintézkedésekkel).

## Kidolgozott példák: így olvasd a jelölést

- **IP20 – süllyesztett fali dugalj vagy kapcsoló:** 2 = ujjal nem érhető el feszültség alatti rész, és legalább 12,5 mm-es tárgy nem jut be; 0 = víz ellen nincs védelem. Száraz lakóhelyiségbe szánják.
- **IP44 – fedeles, falon kívüli dugalj, nedves helyiségbe szánt lámpa:** 4 = legalább 1 mm-es huzal sem jut be; 4 = minden irányból fröccsenő víz ellen véd. A fedeles dugaljnál az adatlap megmondja, hogy a védettség csak lecsukott fedéllel érvényes-e.
- **IP54 és IP55:** porvédett burkolat; az előbbi fröccsenő víz, az utóbbi vízsugár ellen is véd.
- **IP65/IP67 – kültéri lámpa, kötődoboz:** portömör, és a vízsugaras, valamint a merítéses vizsgálatot is kiállta.

**Számpélda: mennyi víz éri a burkolatot?** Az 5-ös fokozat vizsgálatánál kb. 12,5 l/perc, a 6-osnál kb. 100 l/perc vízsugár éri a burkolatot 2,5–3 m távolságból, felületi négyzetméterenként 1 percig, de legalább 3 percig. Egy kis lámpatestnél (3 m²-nél kisebb felület) ez:

- IPX5: 3 perc · 12,5 l/perc = 37,5 l víz;
- IPX6: 3 perc · 100 l/perc = 300 l víz;
- arány: 100 / 12,5 = 8, vagyis a 6-os fokozat vizsgálatánál percenként nyolcszor annyi víz érkezik.

Ebből látszik, hogy az 5 és a 6 között nagy a különbség, a 7-es merítés pedig egészen másfajta igénybevétel: az IP67-es lámpa nem biztos, hogy egy nagy erejű lemosást is kibír.

## Tipikus helyek és jellemző védettség

A táblázat a hazai gyakorlatban szokásos választást mutatja, tájékoztatásul. A legkisebb szükséges fokozatot a környezeti hatások alapján a tervező határozza meg: az MSZ HD 60364-5-51 a hatásokat kódokkal írja le (például AD4: fröccsenő víz, AE4: könnyű por), és mindegyikhez legkisebb védettséget rendel.

| Hely | Fő hatás | Jellemző választás |
|---|---|---|
| lakószoba, hálószoba, előszoba | nincs víz, kevés por | IP20 |
| konyha | pára, alkalmi fröccsenés | IP20; a mosogató és a főzőlap közvetlen közelében a tervező dönt |
| fürdőszoba, zuhanyzó | víz, pára | zónától függ, lásd lent |
| pince, kazánház, mosókonyha, garázs | pára, csepegő vagy fröccsenő víz, por | gyakran IP44, falon kívüli szerelvényekkel |
| műhely porral járó munkához | por, forgács | IP5X vagy IP6X |
| fedett terasz, előtető | szél hajtotta eső | legalább IP44 |
| szabad homlokzat, kert | eső, por | legalább IP44, lámpáknál gyakran IP54–IP65 |
| vízsugárral tisztított hely | vízsugár | IPX5 vagy IPX6 |
| földbe süllyesztett kerti lámpa | időleges elárasztás, por | IP67 |
| víz alatti lámpa (medence, szökőkút) | tartós vízbe merülés | IP68, külön szabályokkal |

A **fürdőszobában** a szükséges védettség attól függ, hogy a szerelvény melyik zónába esik a kádhoz vagy a zuhanyhoz képest. A zónákat és a hozzájuk tartozó szabályokat az MSZ HD 60364-7-701 rögzíti; ezekről külön, biztonsági témájú cikk szól. Az úszómedencékre és a szökőkutakra az MSZ HD 60364-7-702 tartalmaz külön előírásokat. Robbanásveszélyes por vagy gáz jelenlétében (például faporos műhely, üzemanyagtároló) a robbanásvédelmi előírások az irányadók, ezeket az IP-kód nem helyettesíti.

## Amit az IP-kód nem mond meg

- **Az érintésvédelmi osztályt.** Az I. osztályú készüléket védővezetőre (PE) kell csatlakoztatni, a II. osztályú kettős vagy megerősített szigetelésű, a III. osztályú törpefeszültségű (SELV vagy PELV) táplálásról működik (MSZ EN 61140). Egy IP44-es lámpa lehet I., II. vagy III. osztályú is.
- **Az ütésállóságot.** Erre az IK-kód (IK00–IK10) szolgál, az MSZ EN 62262 szerint.
- **Az UV-állóságot, a hőmérséklet-tartományt, a korrózió- és vegyszerállóságot.** Ezeket a gyártói adatlap adja meg.
- **A beépítés minőségét.** A jelölt védettség csak a gyártói utasítás szerinti beépítésnél érvényes: a kábelhez illő tömszelencével, ép tömítéssel, az előírt helyzetben (például a vízelvezető nyílással lefelé) és lecsukott fedéllel.

## Gyakori tévedések

- **„Az IP67 mindenben jobb, mint az IP65.”** A merítéses vizsgálat nem foglalja magában a vízsugarasat. Ha mindkettő kell, keresd a kettős jelölést (IP65/IP67).
- **„Az X ugyanaz, mint a 0.”** Az X azt jelenti, hogy az adott jellemzőt nem adták meg, a 0 azt, hogy nincs védelem.
- **„A vízálló lámpa víz alá is tehető.”** Az IP44-es vagy IP65-ös lámpa nem merítésre készült; víz alá csak 8-as fokozatú, kifejezetten erre szánt lámpa való, külön szabályok szerint.
- **„Az IP44-es dugalj nyitott fedéllel, bedugott hosszabbítóval is IP44-es.”** A védettség attól az állapottól függ, amelyre a gyártó megadta; nyitott fedéllel jellemzően kisebb.
- **„Ha a doboz IP65-ös, a rossz tömszelence vagy egy utólag fúrt lyuk sem számít.”** Bármely nem odaillő kábelbevezetés megszünteti a jelölt védettséget.
- **„A nagy IP-szám elég a fürdőszobában.”** A védettség csak az egyik feltétel; a zónaszabályok és a kiegészítő védelem, például az [[aram-vedokapcsolo-fi-rele|áram-védőkapcsoló (FI-relé)]], ugyanúgy fontosak.
