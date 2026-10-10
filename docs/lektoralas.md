# Lektorálás – a lektori csomag folyamata

A szabványhoz kötött tartalom csak akkor számít jóváhagyottnak, ha egy jogosult szakember (MMK-névjegyzékes villamos tervező vagy érintésvédelmi szabványossági felülvizsgáló) aláírt jóváhagyást ad rá. A **lektori csomag** ehhez gyűjti össze egy helyen az ellenőrizendő tartalmat úgy, hogy a lektornak ne kelljen kódot olvasnia: tételenként pipál, eltérésnél beírja a helyes értéket, a végén aláírja a jóváhagyó lapot.

Ez a leírás a terméktulajdonosnak és a fejlesztőnek szól. Lektor jelenleg nincs kijelölve (`docs/tudastar-dontesek.md`); a csomag addig is generálható és naprakészen tartható.

> **A `SIZING_REVIEW`-t csak a lektor aláírt jóváhagyása után szabad „jóváhagyott” állapotra állítani.** Fejlesztő, MI-asszisztens vagy a terméktulajdonos saját hatáskörben soha nem töltheti ki. Az aláírt lapon szereplő ujjlenyomatoknak meg kell egyezniük a kódban lévőkkel.

## Fájlok

| Fájl | Szerep |
|---|---|
| `scripts/lektori-csomag.ts` | generátor: a csomag tartalma, a kiadások előzménylistája (`EDITIONS`), Markdown- és PDF-kimenet, `--check` mód |
| `docs/lektori-csomag.md`, `docs/lektori-csomag.pdf` | a generált csomag – **kézzel ne szerkeszd** |
| `tests/lektori-csomag.ts` | elavulás- és tartalomteszt, a 2. rész összevetése a programmal |
| `lib/sizing-tables.ts` | a jóváhagyandó értékek (`SIZING_TABLES`, `SOURCES`, `CLAUSES`, `methodLabels`, `insulationLabels`), a jóváhagyás (`SIZING_REVIEW`) és a jóváhagyó megjelenő szövege (`reviewText()`) |
| `lib/sizing.ts` (a kiemelés után `lib/sizing-formulas.ts`) | a képletek és a programozott döntések (a 2. rész tárgya); a „Mit nem vizsgál” lista (`SIZING_NOT_COVERED`, a D-HATOKOR forrása), az eredménycímkék (`statusLabels`, `checkStatusLabels`) |
| `docs/meretezes.md` | a méretezés leírása; a teszt figyelmeztet, ha a „Mit nem vizsgál” listája eltér a programétól (a csomag a programét mutatja) |

## A csomag felépítése

| Rész | Tartalom | Azonosítók | Állapot |
|---|---|---|---|
| Bevezető | mi a Villanyrajz, mire használjuk a jóváhagyást (a jóváhagyó nevének pontos szövege és helye), mit jelent és mit nem, kitöltési útmutató, jelölések, becsült ráfordítás | – | kész |
| 1. Méretezési táblázatok | keresztmetszetek, PVC Iz0 (2 és 3 terhelt ér, A1–C, 1,5–35 mm²), XLPE (szándékosan üres), kθ, kcs, G.52.1 határok, állandók (kérdésekkel: cmin, az I2/In kettős szerepe), forrásmegjelölések, szabványpontok, mód- és szigetelésleírások | `T-…`, `F-…`, `SZP-…`, `L-…` (pl. `T-PVC2-B2-2.5`) | kész |
| 2. Képletek és programozott döntések | képletek (`K-…`), alapértékek (`D-ALAP-…`), kábeljelölés-felismerés (`D-JEL-…`), döntések (`D-…`, köztük a projekt-felülírás `D-FELULIR` és az állapotok `D-ALLAPOT`); mindegyik indoklással, kézzel számolt példával és „Összevetés” jelöléssel | `K-IB`, `D-XLPE` … | kész |
| 3. Szabványhoz kötött kalkulátorok (T1) | helyőrző | `KAL-` | a kalkulátorok után |
| 4. Bekötési ábrák (R3) | helyőrző | `ABR-` | a Sémák után |
| 5. Biztonsági cikkek (R3) | helyőrző | `CIK-` | a cikkek után |
| 6. Vizsgakérdések | helyőrző | `VK-` | a kérdésbank után |
| Jóváhagyó lap | 1. oldal: blokkösszesítő, teendő eltérés esetén; 2. oldal (egy lapon): előre kitöltött kiadás és ujjlenyomatok, döntés, nyilatkozat (a PDF oldalszámával), jogosultság, név, névjegyzéki szám, hely, dátum, aláírás, hozzájárulás a név megjelenítéséhez; minden oldalon „Szignó” mező | – | kész |

Kitöltési szabály: ha egy blokk minden tétele egyezik, elég a blokk végén „A blokk minden tétele egyezik” négyzet. Ha bármelyik eltér, a blokk négyzetét a lektor nem jelöli; az eltérő tételeket ✗-szel jelöli, a többi, pipálatlanul hagyott tétel egyezőnek számít. A forrást blokkonként egyszer, a blokk végi „Megjegyzés a blokkhoz (forrás, kiadás)” mezőben adja meg; terjedelmesebb javítást (pl. a teljes XLPE-táblázatot) külön mellékletben.

A PDF a NotoSans-ból hiányzó jeleket (≤ ≥ ≈ √ − → ✓ ✗ ☐) vektorosan rajzolja ki, így a lektor ugyanazt a jelölést látja, mint a felületen. A teszt a PDF-be kiírt összes karaktert a betűkészlet cmap-táblájával veti össze.

## Ujjlenyomatok és kiadás

A csomag három ujjlenyomatot mutat (8 jegyű hexa, ugyanaz az FNV-1a függvény, mint a `lib/sizing-tables.ts`-ben):

| Ujjlenyomat | Mit fed | Ki ellenőrzi |
|---|---|---|
| **1. rész – táblázat-ujjlenyomat** | `tablesFingerprint()` = `fingerprint(reviewedContent())`: minden táblázatérték, forrásmegjelölés, szabványpont, mód- és szigetelésleírás | **a program**: `SIZING_REVIEW.fingerprint`-hez köti a `tablesApproved()`-ot; eltérésnél a felület és a PDF „ellenőrizendő”-t mutat |
| **2. rész – képlet-ujjlenyomat** | a 2. rész minden tétele (szabály, indoklás, példa, kérdés, forrás, összevetés-jelölés) és a D-JEL tábla | **a fejlesztési folyamat**: a `tests/lektori-csomag.ts` jóváhagyott állapotban elbukik, ha eltér a `SIZING_REVIEW.note`-ban rögzítettől. A program állapota ettől nem változik – ezt a csomag Bevezetője és a Jóváhagyó lap is kimondja |
| **Csomag-ujjlenyomat** | a csomag teljes szövege: minden rész és tétel, az áttekintő mátrixok, a kérdések, a bevezető (a becsült idő nélkül), az űrlapelemek, a jóváhagyó lap szövegei (döntések, nyilatkozat, kötés, hozzájárulás a `reviewText()` pontos szövegével, mezők, teendők) | a generátor: `EDITIONS` utolsó bejegyzése |

Nem része a csomag-ujjlenyomatnak: a jóváhagyási állapot, a becsült ráfordítás és a PDF oldalszáma (a nyilatkozat az oldalszámot a sablon `{oldal}` helyén kapja).

A **kiadások** előzménylistája az `EDITIONS` a `scripts/lektori-csomag.ts` elején (`number`, `date`, `content`, opcionális `note`); az utolsó bejegyzés az aktuális kiadás, pl. `LK-2 (2026. 10. 10.)`. A dátum szándékosan rögzített, ezért a kimenet determinisztikus (a PDF bájtra azonos), és a `--check` megbízható. Szabályok, amelyeket a generátor és a teszt is kikényszerít:

- a kiadásszámok 1-től egyesével nőnek, a dátumok nem csökkennek, egy csomag-ujjlenyomat csak egy kiadáshoz tartozhat;
- ha a tartalom változik, a generátor megáll, és kiírja az új ujjlenyomatot. **Kiadott kiadás bejegyzését nem szabad átírni**: ilyenkor új bejegyzés kell a lista végére (`number + 1`, a mai dátum, az új ujjlenyomat). Csak a még nem commitolt és a lektornak ki nem küldött utolsó kiadás `content`-je írható át;
- a generátor a `git HEAD`-ben lévő `docs/lektori-csomag.md`-t is beolvassa: ha az ott szereplő kiadásszámhoz az `EDITIONS`-ben más ujjlenyomat tartozik, vagy a commitolt szám nagyobb az aktuálisnál, megáll.

Az LK-1 belső tervezet volt (lektornak nem ment ki; az ujjlenyomata még csak a tételeket fedte); az első kiküldhető kiadás az LK-2.

## 1. A csomag generálása

```bash
node --import tsx scripts/lektori-csomag.ts          # docs/lektori-csomag.md és .pdf
node --import tsx scripts/lektori-csomag.ts --check  # nem ír; 1-es kóddal kilép, ha a docs/ fájlok elavultak
node --no-warnings --import tsx tests/lektori-csomag.ts
```

A repó gyökeréből kell futtatni. A generátor a következő esetekben áll meg érthető hibaüzenettel:

- a tartalom változott, de a kiadás nem, vagy az `EDITIONS` szabálytalan (lásd fent);
- a `reviewedContent()` olyan értéket tartalmaz, amelyhez nincs tétel (pl. új állandó a `SIZING_TABLES`-ben) – ilyenkor a generátorba fel kell venni a tételt;
- egy táblázatérték nem írható ki kerekítés nélkül (`exact()`);
- egy szöveg nem létező azonosítóra hivatkozik, vagy két tétel azonosítója azonos;
- a csomag szövege cirill betűt tartalmaz (ezek a PDF-ben a kirajzolt jelek helyőrzői).

A `--check` és a teszt a Markdownt sorvégtől függetlenül hasonlítja össze (Windows alatti, `core.autocrlf=true` klón esetén sem jelez hamisan). Javasolt – a terméktulajdonos jóváhagyásával – egy `.gitattributes` is: `docs/lektori-csomag.md text eol=lf` és `docs/lektori-csomag.pdf binary`.

A `tests/lektori-csomag.ts` ellenőrzi:

- a Markdown és a PDF naprakész, az `EDITIONS` érvényes, a csomag-ujjlenyomat a mátrixokra, a bevezetőre és a jóváhagyó lap szövegére is érzékeny;
- minden `SIZING_TABLES`-érték (kerekítés nélkül), `SOURCES`-, `CLAUSES`- és leírástétel a saját azonosítójával szerepel; az azonosítók egyediek; a táblázat-ujjlenyomat azonos a `tablesFingerprint()`-tel;
- a PDF determinisztikus, és minden kiírt karaktere szerepel a NotoSans cmap-táblájában;
- a 2. rész **minden** tétele és a D-JEL minden sora programmal összevetett esetet tartalmaz: a képletfüggvények (`designCurrent`, `correctedIz`, `voltageDropPercent`, `loopResistance`, `maxLoopImpedance`, `maxLengthForDrop`, `minSectionFor`, `atMost`), a `parseCable`, a `temperatureFactor` / `groupingFactor`, a bemeneti korlátok (`circuitSizingSchema`, `planSizingSchema`), a „Mit nem vizsgál” lista (`SIZING_NOT_COVERED`), az eredménycímkék és a **mintaterv-számítás**: a beépített mintaterv (`lib/plan` `seed`) egy áramkörét a tétel forgatókönyve szerint módosítva a `circuitSizing()` számolja végig (pl. nem szabványos nyomvonalkábel → „Figyelmeztetés”, Iz = 23 A; projekt-felülírás 30 A, 40 °C, 3 áramkör → Iz = 18,27 A);
- a csomag a jóváhagyó nevének megjelenését a `reviewText()` pontos szövegével írja le.

## 2. Elküldés a lektornak

**Küldés előtti döntések a terméktulajdonossal** (mindegyik a programot érinti, ezért új kiadást eredményez):

1. **A jóváhagyó nevének megjelenése.** Jóváhagyás után a `reviewText()` jelenleg „Jóváhagyta: <név> (<névjegyzéki szám>), <dátum>. …” szöveget ad, amely a Méretezés fülön és **minden felhasználó exportált terv-PDF-jében** megjelenik (a „méretezés indoklása” tábla „Táblázatok – Állapot” sorában; ugyanennek a táblának az utolsó sora a felhasználó „Tervezői ellenőrzés” aláírósora). Idegen terv dokumentációjában ez a terv jóváhagyásának tűnhet. Javasolt: a szöveg legyen „A táblázatértékeket szakmailag lektorálta: …”, és a név a hozzájárulástól függően jelenjen meg (hozzájárulás nélkül csak a tény). A csomag a `reviewText()` aktuális szövegét mutatja, így a módosítás után magától frissül.
2. **Kábeljelölés-felismerés hibája.** A gumiszigetelés mintája (`gumi\w*`) ékezetes folytatást nem ismer fel: „gumikábel”, „gumiszigetelésű” → nem ismert szigetelés → PVC-alapérték (kiemelt feltételezéssel), nem „Nem számítható”. A csomag (D-JEL-GUMI) a tényleges viselkedést írja le; javítás után a teszt jelzi, és a tételt igazítani kell.
3. **`docs/meretezes.md` „Mit nem vizsgál” listája elavult**: a 7. tételből hiányzik a gumiszigetelésű vezeték és a csökkentett N/PE-ér. A csomag a program listáját (`SIZING_NOT_COVERED`) mutatja; a dokumentációt ehhez kell igazítani (a teszt addig figyelmeztet).

Ezután:

1. **Szerződés** (`docs/tudastar-terv.md` 4.1): megbízási és felhasználási szerződés, jogtisztasági nyilatkozat, hozzájárulás a név és a névjegyzéki szám megjelenítéséhez (a csomag pontosan leírja, hol és milyen szöveggel). Az adatvédelmi tájékoztatót ehhez bővíteni kell. A lektor jogosultságát a nyilvános névjegyzékben ellenőrizd.
2. **Küldd el** a `docs/lektori-csomag.pdf`-et (nyomtatható, A4 álló, oldalszámozott, laponként szignálható) egy rövid kísérőlevéllel: határidő, visszaküldés módja (aláírt, szkennelt PDF vagy papír), kapcsolattartó. A lektornak a hivatkozott szabványok hatályos kiadására lesz szüksége (a csomag F- tételei sorolják fel: MSZ HD 60364-5-52, -4-43, -4-41, MSZ EN 60898-1, MSZ EN 61009-1, MSZ EN 60038). Hívd fel a figyelmét a „Kérdés a lektorhoz” pontokra (T-K-CMIN, T-K-I2, K-ZS).
3. **Biztonsági jelzés:** kérd, hogy biztonsági jelentőségű hibát (a valósnál nagyobb terhelhetőség, kisebb esés, nagyobb megengedett hurokimpedancia) a visszaküldés előtt is jelezzen. Ilyenkor nincs teendő a programban a jelzés kivizsgálásán túl: az értékek a jóváhagyásig amúgy is „ellenőrizendő” jelöléssel jelennek meg.
4. A csomag **belső munkaanyag**: a program táblázatértékeit tartalmazza, ezért ne tedd közzé (a `docs/meretezes.md` szerzői jogi okból szándékosan nem másolja az értékeket). Ha a repó nyilvánossá válna, a két generált fájlt vedd ki a verziókezelésből, és csak igény szerint generáld.
5. Az elküldött kiadást commitold: ettől kezdve a generátor nem engedi a bejegyzését átírni.

## 3. A visszakapott csomag feldolgozása

1. Gyűjtsd ki a ✗-szel jelölt tételeket a helyes értékkel és a forrással (egy issue vagy PR-leírás elég), a kérdésekre adott válaszokkal együtt.
2. Vezesd be a javításokat a tétel azonosítója szerinti helyen:

| Azonosító | Hely a kódban |
|---|---|
| `T-KM-SOR` | `SECTIONS` (vigyázat: minden táblázatoszlop hossza ehhez igazodik) |
| `T-PVC2-<mód>-<A>`, `T-PVC3-<mód>-<A>` | `SIZING_TABLES.ampacity.PVC[2 vagy 3][<mód>][SECTIONS.indexOf(<A>)]` |
| `T-XLPE-IZ0`, `T-XLPE-KT` | `ampacity.XLPE`, `ambient.XLPE` (kitöltésük után a generátor magától `T-XLPE2-…`, `T-XLPE3-…` és `T-KT-XLPE-…` tételeket készít; a D-XLPE tétel szövegét ekkor át kell írni) |
| `T-KT-<θ>` | `ambient.PVC` (a lépcsők: `ambient.steps`) |
| `T-KCS-<n>` | `grouping.factors` (az oszlopok: `grouping.counts`) |
| `T-DU-<KOZ\|SAJ>-<VIL\|EGY>` | `dropLimits.public/private.lighting/other` |
| `T-K-U0`, `-RHO1`, `-LAMBDA`, `-CMIN`, `-AMIN`, `-I2`, `-M-B/C/D` | `u0`, `rho1`, `lambda`, `cmin`, `minSection`, `conventionalFactor` (a 433.1 (2) Iz-szorzója is; ha a lektor a két szerepre eltérő értéket ad, a programot kell bővíteni), `instantaneous.B/C/D` |
| `F-<KULCS>` | `SOURCES.<kulcs>` (pl. `F-VOLTAGEDROP` → `SOURCES.voltageDrop`) |
| `SZP-<KULCS>` | `CLAUSES.<kulcs>` |
| `L-MOD-<mód>`, `L-SZIG-<szigetelés>` | `methodLabels`, `insulationLabels` |
| `K-…`, `D-…`, `D-JEL-…` | `lib/sizing.ts` (a kiemelés után `lib/sizing-formulas.ts`), a hozzá tartozó kézzel számolt példa a `tests/sizing.ts`-ben, a `docs/meretezes.md`, és a tétel szövege, példája és összevetett esetei a generátor `formulasPart()` függvényében |

3. Futtasd: `tests/sizing-tables.ts`, `tests/sizing.ts` (a kézzel számolt példákat igazítsd), majd generálj **új kiadást** (új `EDITIONS`-bejegyzés), és futtasd a `tests/lektori-csomag.ts`-t.
4. Küldd el a lektornak az új PDF-et és a **változott tételek listáját**: `git diff <az előző kiadás commitja> -- docs/lektori-csomag.md` sorai tételazonosítóval mutatják a változást. A lektor csak ezeket ellenőrzi, és az új kiadás jóváhagyó lapját írja alá.

Ha két forrás (vagy két ellenőr) egy értékre eltérő számot ad, mindkettőt a forrásával írd fel a `docs/meretezes.md` „Jóváhagyó tervezőnek” szakaszába, és az érték a tisztázásig maradjon „ellenőrizendő”.

## 4. A jóváhagyás rögzítése

**Előfeltételek** – mindegyiknek teljesülnie kell:

- kézben van az **aláírt** jóváhagyó lap „Eltérés nélkül jóváhagyom” döntéssel, és a rajta szereplő kiadás és ujjlenyomatok megegyeznek a kódéval;
- a név megjelenítése rendezett: ha a lektor a lapon **nem** jelölte a hozzájárulást, a jóváhagyás csak azután rögzíthető, hogy a `reviewText()` név nélkül is meg tudja jeleníteni a jóváhagyást (lásd 2. fejezet, 1. döntés). Ha jelölte, a megjelenő szöveg az legyen, amelyet a csomag a lektornak bemutatott (a csomag a `reviewText()`-ből készül, ezért ez a kiadás ujjlenyomatával együtt teljesül).

Lépések:

1. Futtasd a `node --import tsx scripts/lektori-csomag.ts --check` parancsot, és vesd össze a kiírt csomag-, táblázat- és képlet-ujjlenyomatot az aláírt lappal. Ha bármelyik eltér, a jóváhagyás nem rögzíthető (a lektor más tartalmat hagyott jóvá): új kiadás és a változások ellenőrzése kell.
2. Töltsd ki a `SIZING_REVIEW`-t a `lib/sizing-tables.ts`-ben:

```ts
export const SIZING_REVIEW:SizingReview={
 status:'jóváhagyott',
 reviewer:'<a lapon szereplő név>',
 registry:'<kamarai / névjegyzéki szám>',
 date:'<az aláírás dátuma, ÉÉÉÉ-HH-NN>',
 fingerprint:'<1. rész – táblázat-ujjlenyomat a lapról>',
 note:'Lektori csomag LK-<n> (<kiadás dátuma>), csomag: <csomag-ujjlenyomat a lapról>, 2. rész: <képlet-ujjlenyomat a lapról>; jogosultság: <a lapról>; hozzájárulás a név megjelenítéséhez: <igen/nem>; a jóváhagyó lap iktatási helye: <…>.'
};
```

   A `tests/sizing-tables.ts` ellenőrzi, hogy a `fingerprint` a jelenlegi `tablesFingerprint()`; a `tests/lektori-csomag.ts`, hogy a `note` pontosan egy kiadást nevez meg (`LK-<n>`, önálló jelként – „LK-12” nem azonos „LK-1”-gyel), az az `EDITIONS`-ben szerepel, a `note` tartalmazza annak csomag-ujjlenyomatát és a 2. rész jelenlegi ujjlenyomatát.
3. Generáld újra a csomagot (a fejléc „jóváhagyott” állapotot mutat; új kiadás nem kell), futtasd a `tests/sizing-tables.ts`, `tests/sizing.ts` és `tests/lektori-csomag.ts` teszteket, és nyiss PR-t.
4. Az aláírt lapot a repón **kívül** őrizd meg (aláírást és személyes adatot tartalmaz); a `note`-ba csak az iktatási helyét írd.

## 5. Ha később egy érték változik

- **Táblázatérték, forrásmegjelölés, szabványpont vagy leírás** (`reviewedContent()`) változik → új táblázat-ujjlenyomat → a `tablesApproved()` hamis lesz, a felület és a PDF újra „ellenőrizendő”-t mutat, és a `tests/sizing-tables.ts` elbukik, amíg a `SIZING_REVIEW` egy régi ujjlenyomatra mutat. Teendő: a `SIZING_REVIEW`-t állítsd vissza `'ellenőrizendő'`-re (üres `reviewer`, `registry`, `date`, `fingerprint`), generálj új kiadást, és kérd a változott tételek ellenőrzését.
- **Képlet vagy programozott döntés** (`lib/sizing.ts` / `lib/sizing-formulas.ts`) változik → a `tests/lektori-csomag.ts` elbukik, ha a változás egy összevetett esetet érint (a 2. rész minden tételének van ilyen). A generátor szövegét, példáját és eseteit igazítani kell → új 2. rész-ujjlenyomat és új kiadás → jóváhagyott állapotban a teszt addig bukik, amíg új jóváhagyás nem kerül a `note`-ba. **A program állapota ilyenkor nem vált vissza**: a kötés a tesztre épül, ezért a teszt nem hagyható ki.
- **Csak a csomag más része** (bevezető, jóváhagyó lap, 3–6. rész) változik → új kiadás kell, de a meglévő jóváhagyás érvényes marad, amíg az 1. és a 2. rész ujjlenyomata változatlan (a `note` a korábbi kiadásra hivatkozhat).
- **Elírás gyors útja** (`docs/tudastar-terv.md` 4.3): a lektor e-mailben is jóváhagyhatja a diffet; az új kiadás ujjlenyomatait és az e-mail azonosítóját ugyanígy a `SIZING_REVIEW`-ba kell írni.

A `lib/sizing.ts`-t érintő PR-ban a bírálónak azt is meg kell néznie, hogy a változás érinti-e a csomag 2. részének szövegét: az összevetett esetek a felsorolt bemenetekre vonatkoznak, nem a szabály minden ágára (például a feltételezések kiemelt jelölését csak részben, egy-egy szövegrészlettel vetik össze).

## 6. Új rész hozzáadása (3–6. rész)

A generátor `PARTS` tömbje sorrendben tartalmazza a részeket. Új rész:

1. Írj egy `() => Part` függvényt (blokkok, tételek); a tételek `ValueItem` (azonosító, megnevezés, érték, opcionális `checks`) vagy `RuleItem` (szabály, indoklás, kézzel számolt példa, opcionális kérdés, forrás, programmal összevetett `checks`) típusúak. Használd a lefoglalt előtagot (`KAL-`, `ABR-`, `CIK-`, `VK-`; az `ID_PREFIXES` tartalmazza).
2. Cseréld le vele a helyőrzőt a `PARTS` tömbben. A Markdown, a PDF, a tartalomjegyzék, a becsült idő és a jóváhagyó lap blokkösszesítője magától bővül.
3. Ha a rész programfüggvényt ír le, bővítsd a `ProgramCheck` típust és a `tests/lektori-csomag.ts` `run()` függvényét, hogy a példák a programmal össze legyenek vetve.
4. A jóváhagyó lap nyilatkozata (`DECLARATION_TEMPLATE`) jelenleg az 1–2. részre szól; az új rész jóváhagyásához igazítsd. A Tudástár-tartalom saját jóváhagyási adatai (`reviewers[]`, ujjlenyomat; `docs/tudastar-terv.md` 4.3) a rész ujjlenyomatára (`partFingerprint()`) hivatkozhatnak.
5. Generálj új kiadást (új `EDITIONS`-bejegyzés), és futtasd a teszteket.

## Ismert korlátok

- A program a jóváhagyást csak az 1. rész ujjlenyomatához köti (`tablesApproved()`); a 2. rész kötése a `SIZING_REVIEW.note`-on és a `tests/lektori-csomag.ts`-en keresztül, azaz a fejlesztési folyamat szintjén történik. A csomag ezt a lektornak is így mondja.
- A kiadott kiadás átírása elleni védelem a commitolt `docs/lektori-csomag.md`-re épül; commit előtt (vagy git nélkül) csak az `EDITIONS` belső szabályai érvényesek.
- A becsült ráfordítás tapasztalati becslés (blokkonként rögzítve a generátorban), nem mérés.
- A PDF csak a NotoSans Regular betűkészletet használja; a hiányzó jeleket vonalas rajzként adja ki (a PDF szövegéből kimásolva ezek helyén nem a jel áll).
