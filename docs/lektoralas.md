# Lektorálás – a lektori csomag folyamata

A szabványhoz kötött tartalom csak akkor számít jóváhagyottnak, ha egy jogosult szakember (MMK-névjegyzékes villamos tervező vagy érintésvédelmi szabványossági felülvizsgáló) aláírt jóváhagyást ad rá. A **lektori csomag** ehhez gyűjti össze egy helyen az ellenőrizendő tartalmat úgy, hogy a lektornak ne kelljen kódot olvasnia: tételenként pipál, eltérésnél beírja a helyes értéket, a végén aláírja a jóváhagyó lapot.

Ez a leírás a terméktulajdonosnak és a fejlesztőnek szól. Lektor jelenleg nincs kijelölve (`docs/tudastar-dontesek.md`); a csomag addig is generálható és naprakészen tartható.

> **A `SIZING_REVIEW`-t és a T1 kalkulátorok lektori kiadási rekordját csak a lektor aláírt jóváhagyása után szabad kitölteni.** Fejlesztő, MI-asszisztens vagy a terméktulajdonos saját hatáskörben soha nem töltheti ki. Az aláírt lapon szereplő ujjlenyomatoknak meg kell egyezniük a kódban lévőkkel.

## Fájlok

| Fájl | Szerep |
|---|---|
| `scripts/lektori-csomag.ts` | generátor: a csomag tartalma, a kiadások előzménylistája (`EDITIONS`), Markdown- és PDF-kimenet, `--check` mód |
| `docs/lektori-csomag.md`, `docs/lektori-csomag.pdf` | a generált csomag – **kézzel ne szerkeszd** |
| `tests/lektori-csomag.ts` | elavulás- és tartalomteszt; a 2. rész összevetése a programmal, a 3. rész összevetése a kalkulátorok futtatásával |
| `lib/sizing-tables.ts` | a jóváhagyandó értékek (`SIZING_TABLES`, `SOURCES`, `CLAUSES`, `methodLabels`, `insulationLabels`), a jóváhagyás (`SIZING_REVIEW`, benne `showName`) és a megjelenő szöveg (`reviewText()`, sablonjai: `REVIEW_TEXTS`) |
| `lib/sizing-formulas.ts` (a `lib/sizing.ts` re-exportálja) | a képletek, a kábeljelölés-felismerés és a „Mit nem vizsgál” lista (`SIZING_NOT_COVERED`, a D-HATOKOR forrása) – a 2. rész tárgya; az eredménycímkék (`statusLabels`, `checkStatusLabels`) a `lib/sizing.ts`-ben |
| `lib/calc/defs/<slug>.ts` és a közös motor (`lib/calc/core.ts`, `number.ts`, `fields.ts`, `sizing-fields.ts`, `constants.ts`, `units.ts`) | a 3. rész tárgya: a 8 T1 kalkulátor mezői, képletei, feltételezései, figyelmeztetései és példái |
| `lib/calc/release.ts` | kiadási kapu: `RELEASES` (T1-nél kalkulátoronként lektori rekord a tartalmi és forrás-ujjlenyomattal), `T1_SLUGS`, `TABLE_GATED` |
| `scripts/calc-release.ts`, `scripts/calc-source.ts` | a kalkulátorok ujjlenyomatai (`list`) és a rekordváz (`record <slug>`); a forrás-ujjlenyomat a `SIZING_REVIEW`-blokk nélkül készül (lásd lent) |
| `lib/kb/safety.ts` | a kalkulátoroldalak figyelmeztetései (a 3. rész KAL-KOZOS-FIGY- tételei) |
| `docs/meretezes.md` | a méretezés leírása; „Mit nem vizsgál” listája szó szerint a programé – eltérésnél a teszt **elbukik** |
| `.gitattributes` | `*.md text eol=lf`, `*.pdf binary` |

## A csomag felépítése

| Rész | Tartalom | Azonosítók | Állapot |
|---|---|---|---|
| Bevezető | mi a Villanyrajz, mire használjuk a jóváhagyást (a jóváhagyó nevének pontos szövege és minden megjelenési helye, név nélküli változattal), mit jelent és mit nem, kitöltési útmutató, jelölések, becsült ráfordítás | – | kész |
| 1. Méretezési táblázatok | keresztmetszetek, PVC Iz0 (2 és 3 terhelt ér, A1–C, 1,5–35 mm²), XLPE (szándékosan üres), kθ, kcs, G.52.1 határok, állandók (kérdésekkel: cmin, az I2/In kettős szerepe), forrásmegjelölések, szabványpontok, mód- és szigetelésleírások | `T-…`, `F-…`, `SZP-…`, `L-…` (pl. `T-PVC2-B2-2.5`) | kész |
| 2. Képletek és programozott döntések | képletek (`K-…`), alapértékek (`D-ALAP-…`), kábeljelölés-felismerés (`D-JEL-…`), döntések (`D-…`, köztük a projekt-felülírás `D-FELULIR` és az állapotok `D-ALLAPOT`); mindegyik indoklással, kézzel számolt példával és „Összevetés” jelöléssel | `K-IB`, `D-XLPE` … | kész |
| 3. Szabványhoz kötött kalkulátorok (T1) | `KAL-KOZOS` (számbevitel, kiírás és kerekítés, szóhasználat, figyelmeztetések, előnyös In-sor), majd kalkulátoronként egy blokk: cél, kiadási adatok és **ujjlenyomat-pár**, mire jó / mire nem, „Nem vizsgált”, a kalkulátoroldal képletei és feltételezései szó szerint, minden bemenet alapértékkel és érvényességi tartománnyal, saját állandók forrással, képletek behelyettesítve (`-K`), programozott döntések (`-D`), kalkulátoronként legalább két kézzel számolt példa | `KAL-<SLUG>-…` (a slug nagybetűvel, pl. `KAL-MOTOR-ARAM-K1`, `KAL-FESZULTSEGES-BEM-I`) | kész (LK-3) |
| 4. Bekötési ábrák (R3) | helyőrző | `ABR-` | a Sémák után |
| 5. Biztonsági cikkek (R3) | helyőrző | `CIK-` | a cikkek után |
| 6. Vizsgakérdések | helyőrző | `VK-` | a kérdésbank után |
| Jóváhagyó lap | blokkösszesítő, **3. rész – kalkulátoronkénti döntés** (kalkulátoronként tartalmi és forrás-ujjlenyomat, táblázat-kapu, „Jóváhagyom” / „Javítás után / nem”), teendő eltérés esetén; utána egy lapon: előre kitöltött kiadás és ujjlenyomatok, döntés az 1–2. részről, nyilatkozat (a PDF oldalszámával), jogosultság, név, névjegyzéki szám, hely, dátum, aláírás, hozzájárulás a név megjelenítéséhez; minden oldalon „Szignó” mező | – | kész |

A 3. rész a táblázatértékeket **nem ismétli**: ρ1, λ, U0, Iz0, kθ, kcs, a G.52.1 határok, m, cmin és I2/In helyett az 1. rész azonosítójára hivatkozik (pl. T-K-RHO1, T-PVC2-B2-2.5); ahol egy kézi példához érték kell, mellette áll az azonosító. Ahol a kalkulátor a méretezés programfüggvényét használja, a 2. rész tételére hivatkozik (pl. K-DU1, K-ZS). A tételek szövegei a definícióból készülnek (mezők, tartományok, súgók, képletek, „Mire jó / mire nem”, „Nem vizsgált”, a példák futtatásából a feltételezések), így a csomag azt mutatja, amit a kalkulátoroldal.

Kitöltési szabály: ha egy blokk minden tétele egyezik, elég a blokk végén „A blokk minden tétele egyezik” négyzet. Ha bármelyik eltér, a blokk négyzetét a lektor nem jelöli; az eltérő tételeket ✗-szel jelöli, a többi, pipálatlanul hagyott tétel egyezőnek számít. A forrást blokkonként egyszer, a blokk végi „Megjegyzés a blokkhoz (forrás, kiadás)” mezőben adja meg; terjedelmesebb javítást (pl. a teljes XLPE-táblázatot) külön mellékletben. A 3. rész kalkulátoronként hagyható jóvá: „Jóváhagyom” csak akkor, ha a kalkulátor blokkja és a KAL-KOZOS blokk is eltérés nélküli.

A PDF a NotoSans-ból hiányzó jeleket (≤ ≥ ≈ √ − → ✓ ✗ ☐) vektorosan rajzolja ki, így a lektor ugyanazt a jelölést látja, mint a felületen. A teszt a PDF-be kiírt összes karaktert a betűkészlet cmap-táblájával veti össze. A hosszú azonosítók (pl. `KAL-LED-SZALAG-TAPEGYSEG-BEM-PM`) a táblázatokban kötőjelnél törnek.

## Ujjlenyomatok és kiadás

A csomag négy csomagszintű ujjlenyomatot mutat (8 jegyű hexa, ugyanaz az FNV-1a függvény, mint a `lib/sizing-tables.ts`-ben), a 3. részben pedig kalkulátoronként kettőt:

| Ujjlenyomat | Mit fed | Ki ellenőrzi |
|---|---|---|
| **1. rész – táblázat-ujjlenyomat** | `tablesFingerprint()` = `fingerprint(reviewedContent())`: minden táblázatérték, forrásmegjelölés, szabványpont, mód- és szigetelésleírás | **a program**: `SIZING_REVIEW.fingerprint`-hez köti a `tablesApproved()`-ot; eltérésnél a felület és a PDF „ellenőrizendő”-t mutat |
| **2. rész – képlet-ujjlenyomat** | a 2. rész minden tétele (szabály, indoklás, példa, kérdés, forrás, összevetés-jelölés) és a D-JEL tábla | **a fejlesztési folyamat**: a `tests/lektori-csomag.ts` jóváhagyott állapotban elbukik, ha eltér a `SIZING_REVIEW.note`-ban rögzítettől. A program állapota ettől nem változik – ezt a csomag Bevezetője és a Jóváhagyó lap is kimondja |
| **3. rész – kalkulátor-ujjlenyomat** | a 3. rész egésze (`partFingerprint`), benne minden kalkulátor ujjlenyomat-párja | tájékoztató: a jóváhagyó lapon a kiadást azonosítja; a program kalkulátoronként köt (következő sor) |
| **kalkulátoronként: tartalmi + forrás-ujjlenyomat** | `calcFingerprint(def)` (`lib/calc/registry.ts`: mezők, képletek, példák és elvárt értékeik, szövegek, források, „Nem vizsgált”, verzió) és `sourceFingerprint(slug)` (`scripts/calc-source.ts`: a definíció és minden futásidőben importált helyi modul szövege) | **a program és a CI**: a `RELEASES` rekord tartalmi ujjlenyomatát a program futásidőben veti össze (eltérésnél a kalkulátor nem közzétett), a forrás-ujjlenyomatot a `tests/calc.ts` |
| **Csomag-ujjlenyomat** | a csomag teljes szövege: minden rész és tétel (a kalkulátorok ujjlenyomat-párjával), az áttekintő mátrixok, a kérdések, a bevezető (a becsült idő nélkül), az űrlapelemek, a jóváhagyó lap szövegei (döntések, kalkulátoronkénti döntés szövege, nyilatkozat, kötés, hozzájárulás a `reviewText()` és a kalkulátorjelvény pontos szövegével, mezők, teendők) | a generátor: `EDITIONS` utolsó bejegyzése |

Nem része a csomag-ujjlenyomatnak: a jóváhagyási állapot (1. rész), a kalkulátorok jelenlegi kiadási állapota (3. rész), a becsült ráfordítás és a PDF oldalszáma (a nyilatkozat az oldalszámot a sablon `{oldal}` helyén kapja). Ezek változása után a csomagot újra kell generálni, de új kiadás nem kell.

**A forrás-ujjlenyomat és a táblázatjóváhagyás.** A táblázatokat használó kalkulátorok forrásába a `lib/sizing-tables.ts` is beletartozik. Ennek `SIZING_REVIEW`-objektumát (a jóváhagyás adatai) a `scripts/calc-source.ts` `sourceText()` kihagyja a lenyomatból, minden más (értékek, a `REVIEW_TEXTS` sablonok, kód) benne marad. Így a táblázatjóváhagyás rögzítése nem változtatja meg a kalkulátorok forrás-ujjlenyomatát, és a csomagban jóváhagyott ujjlenyomat-pár a rögzítés sorrendjétől függetlenül egyezik a kiadási rekorddal (`tests/calc.ts` ellenőrzi).

**A jóváhagyás megjelenő szövege nem része az 1. rész ujjlenyomatának.** A `reviewedContent()` a szabvánnyal összevetendő szakmai tartalom; a `reviewText()` a jóváhagyásról szól, és a jóváhagyás érvénye nem függhet a megjelenítéstől (`showName`). A sablonokat (`REVIEW_TEXTS`) a csomag-ujjlenyomat fedi (a lektor ezekhez a szövegekhez járul hozzá), és a `tests/sizing-tables.ts` szó szerint rögzíti: ha változnak, új kiadás kell, és név megjelenítésénél a lektor új hozzájárulása.

A **kiadások** előzménylistája az `EDITIONS` a `scripts/lektori-csomag.ts` elején (`number`, `date`, `content`, opcionális `note`); az utolsó bejegyzés az aktuális kiadás, pl. `LK-3 (2026. 10. 10.)`. A dátum szándékosan rögzített, ezért a kimenet determinisztikus (a PDF bájtra azonos), és a `--check` megbízható. Szabályok, amelyeket a generátor és a teszt is kikényszerít:

- a kiadásszámok 1-től egyesével nőnek, a dátumok nem csökkennek, egy csomag-ujjlenyomat csak egy kiadáshoz tartozhat;
- ha a tartalom változik, a generátor megáll, és kiírja az új ujjlenyomatot. **Kiadott kiadás bejegyzését nem szabad átírni**: ilyenkor új bejegyzés kell a lista végére (`number + 1`, a mai dátum, az új ujjlenyomat). Csak a még nem commitolt és a lektornak ki nem küldött utolsó kiadás `content`-je írható át;
- a generátor a `git HEAD`-ben lévő `docs/lektori-csomag.md`-t is beolvassa: ha az ott szereplő kiadásszámhoz az `EDITIONS`-ben más ujjlenyomat tartozik, vagy a commitolt szám nagyobb az aktuálisnál, megáll.

Az LK-1 és az LK-2 belső tervezet volt (lektornak nem ment ki; az LK-1 ujjlenyomata még csak a tételeket fedte, az LK-2-ben még nem volt 3. rész). Az első kiküldhető kiadás az **LK-3**: 1–3. rész, 310 tétel (146 + 38 + 126), becsült lektori idő kb. 6 óra 5 perc (ebből a 3. rész kb. 3 óra 12 perc; az LK-2 1–2. része kb. 2 óra 53 perc volt).

## 1. A csomag generálása

```bash
node --import tsx scripts/lektori-csomag.ts          # docs/lektori-csomag.md és .pdf
node --import tsx scripts/lektori-csomag.ts --check  # nem ír; 1-es kóddal kilép, ha a docs/ fájlok elavultak
node --no-warnings --import tsx tests/lektori-csomag.ts
```

A repó gyökeréből kell futtatni. A generátor a következő esetekben áll meg érthető hibaüzenettel:

- a tartalom változott, de a kiadás nem, vagy az `EDITIONS` szabálytalan (lásd fent);
- a `reviewedContent()` olyan értéket tartalmaz, amelyhez nincs tétel (pl. új állandó a `SIZING_TABLES`-ben) – ilyenkor a generátorba fel kell venni a tételt;
- egy táblázatérték vagy állandó nem írható ki kerekítés nélkül (`exact()`, `full()`);
- egy szöveg nem létező azonosítóra hivatkozik, vagy két tétel azonosítója azonos;
- új T1 kalkulátor jelent meg, vagy egy kalkulátor lista- vagy sormezőt kapott, amelyet a 3. rész még nem ír le (a `T1_ORDER` és a `release.ts` `T1_SLUGS`-a eltér – ezt a teszt jelzi);
- a csomag szövege cirill betűt tartalmaz (ezek a PDF-ben a kirajzolt jelek helyőrzői).

A `--check` és a teszt a Markdownt sorvégtől függetlenül hasonlítja össze; a `.gitattributes` (`*.md text eol=lf`, `*.pdf binary`) a Windows alatti, `core.autocrlf=true` klónban is LF-et, a PDF-nél bájtra azonos fájlt ad.

A `tests/lektori-csomag.ts` ellenőrzi:

- a Markdown és a PDF naprakész, az `EDITIONS` érvényes, a csomag-ujjlenyomat a mátrixokra, a bevezetőre és a jóváhagyó lap szövegére (a kalkulátoronkénti döntés szövegére is) érzékeny;
- minden `SIZING_TABLES`-érték (kerekítés nélkül), `SOURCES`-, `CLAUSES`- és leírástétel a saját azonosítójával szerepel; az azonosítók egyediek; a táblázat-ujjlenyomat azonos a `tablesFingerprint()`-tel;
- a PDF determinisztikus, és minden kiírt karaktere szerepel a NotoSans cmap-táblájában;
- a 2. rész **minden** tétele és a D-JEL minden sora programmal összevetett esetet tartalmaz: a képletfüggvények, a `parseCable` (a D-JEL-GUMI az ékezetes „gumikábel”, „gumiszigetelésű” alakot is), a `temperatureFactor` / `groupingFactor`, a bemeneti korlátok, a „Mit nem vizsgál” lista, az eredménycímkék és a **mintaterv-számítás** (a beépített mintaterv egy áramköre a tétel forgatókönyve szerint módosítva, `circuitSizing()`);
- a 3. rész minden T1 kalkulátort tartalmaz (`T1_ORDER` = `T1_SLUGS`), a blokk elején a mostani ujjlenyomat-párral; minden mezőnek van tétele, a számmezők korlátait a tartomány szélein próbált értékek vetik össze (`calcField`: a határ elfogadott, a határon túli és az üres kötelező érték elutasított); minden szabálytétel példáját a kalkulátor tényleges futtatása (`runCalc`) veti össze (`calc`: eredmények relatív 10⁻⁹ tűréssel, kiírt szöveg, verdikt, figyelmeztetés, hiba, feltételezés); kalkulátoronként legalább két kézzel számolt példa, és minden eredmény (pl. a Terhelhetőségi táblázat minden sora) legalább egy példában szerepel; a „Nem vizsgált” lista a méretezésével azonos (`calcNotCovered`);
- a csomag a jóváhagyó nevének megjelenését a `reviewText()` és a kalkulátorjelvény (`lib/calc/registry.ts` `expertShown`) pontos szövegével, névvel és név nélkül írja le; a `reviewText()`-et hívó fájlok listája rögzített (új megjelenési hely csak a `NAME_PLACES` bővítésével kerülhet be);
- a `docs/meretezes.md` „Mit nem vizsgál” listája szó szerint a programé;
- a T1 kalkulátorok lektori rekordja (`releaseRefProblems`) pontosan egy létező kiadást nevez meg annak csomag-ujjlenyomatával.

## 2. Elküldés a lektornak

Az LK-2 után nyitott kérdések az LK-3-ban rendezve:

1. **A jóváhagyó nevének megjelenése.** A `SIZING_REVIEW.showName` (alapértelmezés `false`) dönt: hozzájárulással „A táblázatértékeket szakmailag lektorálta: <név> (<névjegyzéki szám>), <dátum>. …”, anélkül „A táblázatértékeket jogosult villamos tervező szakmailag lektorálta, <dátum>. …”. A T1 kalkulátoroknál ugyanígy: a rekord `showName` mezője nélkül a jelvény „Szakmailag lektorálta: <minősítés> · <dátum>”. A jóváhagyás érvénye egyiknél sem függ a megjelenítéstől. A csomag mindkét változatot és minden megjelenési helyet (Méretezés fül, terv-PDF, a táblázatokat használó kalkulátoroldalak, a Vezeték-ellenállás kalkulátor ρ1 szerinti sora, a lektorált kalkulátorok jelvénye) felsorolja; a hozzájárulás négyzete ezekre vonatkozik.
2. **Kábeljelölés-felismerés.** A gumiszigetelés mintája Unicode-tudatos (`gumi[\p{L}\d]*`): „gumikábel”, „gumiszigetelésű”, „GUMIKÁBEL” is „Nem számítható”. Más besorolás nem változott (2501 jelölésen összevetve; csak a szó eleji „gumi…” ékezetes folytatású alakok változtak).
3. **`docs/meretezes.md` „Mit nem vizsgál”** a programmal egyező; eltérésnél a teszt elbukik.

Küldés előtt:

1. **Szerződés** (`docs/tudastar-terv.md` 4.1): megbízási és felhasználási szerződés, jogtisztasági nyilatkozat, hozzájárulás a név és a névjegyzéki szám megjelenítéséhez (a csomag pontosan leírja, hol és milyen szöveggel; hozzájárulás nélkül név nélkül rögzítünk). Az adatvédelmi tájékoztatót ehhez bővíteni kell. A lektor jogosultságát a nyilvános névjegyzékben ellenőrizd.
2. **Küldd el** a `docs/lektori-csomag.pdf`-et (nyomtatható, A4 álló, oldalszámozott, laponként szignálható) egy rövid kísérőlevéllel: határidő, visszaküldés módja (aláírt, szkennelt PDF vagy papír), kapcsolattartó. A lektornak a hivatkozott szabványok hatályos kiadására lesz szüksége (az F- tételek: MSZ HD 60364-5-52, -4-43, -4-41, MSZ EN 60898-1, MSZ EN 61009-1, MSZ EN 60038). Kérésre adj előnézeti hozzáférést a kalkulátorokhoz (`SHOCKCRAFT_KB_PREVIEW=1`, csak staging; `docs/kalkulatorok.md`). Hívd fel a figyelmét a „Kérdés a lektorhoz” pontokra: T-K-CMIN, T-K-I2, K-ZS; KAL-FESZULTSEGES-K2, -D2 (kiadás táblázat-kapu nélkül, háromfázisú voltérték, 35 mm² feletti bevitel), KAL-MOTOR-ARAM-D1, KAL-LED-SZALAG-TAPEGYSEG-D2, KAL-KISMEGSZAKITO-K2, KAL-HUROKIMPEDANCIA-K2 és -D2 (csökkentett PE a „Nem vizsgált” listával szemben).
3. **Biztonsági jelzés:** kérd, hogy biztonsági jelentőségű hibát (a valósnál nagyobb terhelhetőség, kisebb esés, nagyobb megengedett hurokimpedancia) a visszaküldés előtt is jelezzen. Ilyenkor nincs teendő a programban a jelzés kivizsgálásán túl: az értékek a jóváhagyásig amúgy is „ellenőrizendő” jelöléssel jelennek meg, a T1 kalkulátorok nem közzétettek.
4. A csomag **belső munkaanyag**: a program táblázatértékeit tartalmazza, ezért ne tedd közzé (a `docs/meretezes.md` szerzői jogi okból szándékosan nem másolja az értékeket). Ha a repó nyilvánossá válna, a két generált fájlt vedd ki a verziókezelésből, és csak igény szerint generáld.
5. Az elküldött kiadást commitold: ettől kezdve a generátor nem engedi a bejegyzését átírni.

## 3. A visszakapott csomag feldolgozása

1. Gyűjtsd ki a ✗-szel jelölt tételeket a helyes értékkel és a forrással (egy issue vagy PR-leírás elég), a kérdésekre adott válaszokkal és a kalkulátoronkénti döntéssel együtt.
2. Vezesd be a javításokat a tétel azonosítója szerinti helyen:

| Azonosító | Hely a kódban |
|---|---|
| `T-KM-SOR` | `SECTIONS` (vigyázat: minden táblázatoszlop hossza ehhez igazodik) |
| `T-PVC2-<mód>-<A>`, `T-PVC3-<mód>-<A>` | `SIZING_TABLES.ampacity.PVC[2 vagy 3][<mód>][SECTIONS.indexOf(<A>)]` |
| `T-XLPE-IZ0`, `T-XLPE-KT` | `ampacity.XLPE`, `ambient.XLPE` (kitöltésük után a generátor magától `T-XLPE2-…`, `T-XLPE3-…` és `T-KT-XLPE-…` tételeket készít; a D-XLPE tétel és a 3. rész XLPE-tételeinek szövegét ekkor át kell írni) |
| `T-KT-<θ>` | `ambient.PVC` (a lépcsők: `ambient.steps`) |
| `T-KCS-<n>` | `grouping.factors` (az oszlopok: `grouping.counts`) |
| `T-DU-<KOZ\|SAJ>-<VIL\|EGY>` | `dropLimits.public/private.lighting/other` |
| `T-K-U0`, `-RHO1`, `-LAMBDA`, `-CMIN`, `-AMIN`, `-I2`, `-M-B/C/D` | `u0`, `rho1`, `lambda`, `cmin`, `minSection`, `conventionalFactor` (a 433.1 (2) Iz-szorzója is; ha a lektor a két szerepre eltérő értéket ad, a programot kell bővíteni), `instantaneous.B/C/D` |
| `F-<KULCS>` | `SOURCES.<kulcs>` (pl. `F-VOLTAGEDROP` → `SOURCES.voltageDrop`) |
| `SZP-<KULCS>` | `CLAUSES.<kulcs>` |
| `L-MOD-<mód>`, `L-SZIG-<szigetelés>` | `methodLabels`, `insulationLabels` |
| `K-…`, `D-…`, `D-JEL-…` | `lib/sizing-formulas.ts` / `lib/sizing.ts`, a hozzá tartozó kézzel számolt példa a `tests/sizing.ts`-ben, a `docs/meretezes.md`, és a tétel szövege, példája és összevetett esetei a generátor `formulasPart()` függvényében |
| `KAL-<SLUG>-HAT`, `-NV`, `-KEPLET`, `-BEM-<MEZŐ>` | a `lib/calc/defs/<slug>.ts` `notes`, `notCovered`, `formulas`, `fields` része (a szöveg a definícióból készül); a javítás után a definíció `version`-jét emeld |
| `KAL-<SLUG>-FELT`, `-K…`, `-D…` | a `lib/calc/defs/<slug>.ts` `compute` függvénye (feltételezések, figyelmeztetések, verdikt), a példák és összevetett esetek a generátor `calculatorsPart()` függvényében; a definíció példái (`examples`) és a `scripts/calc-golden-indep.py` |
| `KAL-KOZOS-…` | `lib/calc/number.ts`, `core.ts`, `fields.ts` (számbevitel, kiírás), `lib/kb/safety.ts` (figyelmeztetések), `lib/calc/constants.ts` (`MCB_RATINGS`); minden T1 kalkulátort érint |
| `KAL-<SLUG>-<ÁLLANDÓ>` (pl. `-LE`, `-HP`, `-PSU`, `-BETAP`) | `lib/calc/constants.ts`, illetve a definíció |

3. Futtasd: `tests/sizing-tables.ts`, `tests/sizing.ts`, `tests/calc.ts`, `tests/calc-golden.ts` (a kézzel számolt példákat igazítsd), majd generálj **új kiadást** (új `EDITIONS`-bejegyzés), és futtasd a `tests/lektori-csomag.ts`-t.
4. Küldd el a lektornak az új PDF-et és a **változott tételek listáját**: `git diff <az előző kiadás commitja> -- docs/lektori-csomag.md` sorai tételazonosítóval mutatják a változást. A lektor csak ezeket ellenőrzi, és az új kiadás jóváhagyó lapját írja alá.

Ha két forrás (vagy két ellenőr) egy értékre eltérő számot ad, mindkettőt a forrásával írd fel a `docs/meretezes.md` „Jóváhagyó tervezőnek” szakaszába, és az érték a tisztázásig maradjon „ellenőrizendő”.

## 4. A jóváhagyás rögzítése

**Előfeltételek** – mindegyiknek teljesülnie kell:

- kézben van az **aláírt** jóváhagyó lap, és a rajta szereplő kiadás és ujjlenyomatok megegyeznek a kódéval;
- a név megjelenítéséről a lap dönt: ha a lektor a hozzájárulás négyzetét **jelölte**, `showName: true`, különben `showName: false` (a jóváhagyás így is érvényes, a program név nélkül jelzi). A hozzájárulás a csomagban bemutatott szövegekre szól; ha a `REVIEW_TEXTS` vagy a kalkulátorjelvény szövege azóta változott, `showName: true` csak új hozzájárulással állítható.

### 4.1 Az 1–2. rész (méretezési táblázatok és képletek)

Csak „Az 1–2. részt eltérés nélkül jóváhagyom” döntés esetén.

1. Futtasd a `node --import tsx scripts/lektori-csomag.ts --check` parancsot, és vesd össze a kiírt csomag-, táblázat- és képlet-ujjlenyomatot az aláírt lappal. Ha bármelyik eltér, a jóváhagyás nem rögzíthető (a lektor más tartalmat hagyott jóvá): új kiadás és a változások ellenőrzése kell.
2. Töltsd ki a `SIZING_REVIEW`-t a `lib/sizing-tables.ts`-ben:

```ts
export const SIZING_REVIEW:SizingReview={
 status:'jóváhagyott',
 reviewer:'<a lapon szereplő név>',
 registry:'<kamarai / névjegyzéki szám>',
 date:'<az aláírás dátuma, ÉÉÉÉ-HH-NN>',
 fingerprint:'<1. rész – táblázat-ujjlenyomat a lapról>',
 showName:false, // true csak a lapon jelölt hozzájárulással
 note:'Lektori csomag LK-<n> (<kiadás dátuma>), csomag: <csomag-ujjlenyomat a lapról>, 2. rész: <képlet-ujjlenyomat a lapról>; jogosultság: <a lapról>; hozzájárulás a név megjelenítéséhez: <igen/nem>; a jóváhagyó lap iktatási helye: <…>.'
};
```

   A `tests/sizing-tables.ts` ellenőrzi, hogy a `fingerprint` a jelenlegi `tablesFingerprint()`, és hogy `showName: false` mellett a név és a névjegyzéki szám nem jelenik meg; a `tests/lektori-csomag.ts`, hogy a `note` pontosan egy kiadást nevez meg (`LK-<n>`, önálló jelként – „LK-12” nem azonos „LK-1”-gyel), az az `EDITIONS`-ben szerepel, a `note` tartalmazza annak csomag-ujjlenyomatát és a 2. rész jelenlegi ujjlenyomatát.
3. Generáld újra a csomagot (a fejléc „jóváhagyott” állapotot mutat; új kiadás nem kell), futtasd a `tests/sizing-tables.ts`, `tests/sizing.ts`, `tests/calc.ts` és `tests/lektori-csomag.ts` teszteket, és nyiss PR-t. A `SIZING_REVIEW` kitöltése a kalkulátorok forrás-ujjlenyomatát nem változtatja meg (lásd fent), ezért a már rögzített kalkulátorrekordok érvényesek maradnak.
4. Az aláírt lapot a repón **kívül** őrizd meg (aláírást és személyes adatot tartalmaz); a `note`-ba csak az iktatási helyét írd.

### 4.2 A 3. rész: T1 kalkulátorok kiadási rekordja

Kalkulátoronként, csak a lap „3. rész – kalkulátoronkénti döntés” táblázatában **„Jóváhagyom”** jelölésű sorokra (és csak ha a KAL-KOZOS blokk is eltérés nélküli). Az 1–2. részről hozott döntéstől független: a kalkulátor rekordja a saját ujjlenyomat-párjához kötött. Összhangban a `docs/kalkulatorok.md` „T1 kalkulátor kiadása lektori jóváhagyás után” szakaszával:

1. `node_modules/.bin/tsx scripts/calc-release.ts record <slug>` – a kiírt `fingerprint` és `source` egyezzen az aláírt lap adott sorának tartalmi és forrás-ujjlenyomatával. Ha eltér, a kalkulátor a jóváhagyás óta megváltozott: nem rögzíthető, új kiadás kell.
2. Másold a rekordot a `lib/calc/release.ts` `RELEASES` táblájába, és töltsd ki a lapról:

```ts
'<slug>':{kind:'lektoralt',reviewer:'<név>',qualification:'<jogosultság, pl. épületvillamossági tervező (MMK)>',registry:'<névjegyzéki szám>',date:'<ÉÉÉÉ-HH-NN>',
 fingerprint:'<tartalmi ujjlenyomat>',source:'<forrás-ujjlenyomat>',
 approvalRef:'Lektori csomag LK-<n> (<kiadás dátuma>), csomag: <csomag-ujjlenyomat>, 3. rész: <kalkulátor-ujjlenyomat>; jóváhagyó lap: <iktatási hely>',
 showName:false}, // true csak a lapon jelölt hozzájárulással
```

   A jelvény `showName: true` mellett „Szakmailag lektorálta: <név>, <minősítés> · <dátum>”, különben „Szakmailag lektorálta: <minősítés> · <dátum>”; a lábléc-sor ugyanígy „Szakmai lektor: …”.
3. Futtasd: `tests/calc.ts` (ujjlenyomat-pár, kitöltött rekord, az elvárt állapot a `RELEASES`-ből), `tests/calc-golden.ts`, `tests/kb-guards.ts`, `tests/lektori-csomag.ts` (`releaseRefProblems`: az `approvalRef` pontosan egy létező kiadást nevez meg annak csomag-ujjlenyomatával). Tesztet nem kell átírni.
4. A táblázat-kapus kalkulátorok (`keresztmetszet`, `kismegszakito`, `hurokimpedancia`, `terhelhetoseg-tablazat`) csak a `SIZING_REVIEW` jóváhagyása után jelennek meg; a rekord előbb is rögzíthető (állapot: „lektorálva, a táblázatok jóváhagyására vár”). A `feszultseges` nem táblázat-kapus (lásd KAL-FESZULTSEGES-D2 kérdés).
5. Generáld újra a csomagot (a 3. rész állapotsora változik; új kiadás nem kell), majd PR és telepítés (`docs/kalkulatorok.md`, build utáni `tests/kb-routes.mjs`).

## 5. Ha később egy érték változik

- **Táblázatérték, forrásmegjelölés, szabványpont vagy leírás** (`reviewedContent()`) változik → új táblázat-ujjlenyomat → a `tablesApproved()` hamis lesz, a felület és a PDF újra „ellenőrizendő”-t mutat, és a `tests/sizing-tables.ts` elbukik, amíg a `SIZING_REVIEW` egy régi ujjlenyomatra mutat. A táblázatokat használó kalkulátorok forrás-ujjlenyomata is változik (a `tests/calc.ts` a rekordjukra elbukik). Teendő: a `SIZING_REVIEW`-t állítsd vissza `'ellenőrizendő'`-re (üres `reviewer`, `registry`, `date`, `fingerprint`, `showName:false`), az érintett kalkulátorrekordokat vedd ki, generálj új kiadást, és kérd a változott tételek ellenőrzését.
- **Képlet vagy programozott döntés** (`lib/sizing-formulas.ts` / `lib/sizing.ts`) változik → a `tests/lektori-csomag.ts` elbukik, ha a változás egy összevetett esetet érint (a 2. rész minden tételének van ilyen). A generátor szövegét, példáját és eseteit igazítani kell → új 2. rész-ujjlenyomat és új kiadás → jóváhagyott állapotban a teszt addig bukik, amíg új jóváhagyás nem kerül a `note`-ba. **A program állapota ilyenkor nem vált vissza**: a kötés a tesztre épül, ezért a teszt nem hagyható ki. A `lib/sizing-formulas.ts` a T1 kalkulátorok forrásának is része, így ezek rekordja is újra jóváhagyandó.
- **Kalkulátor** (definíció vagy a közös motor: `lib/calc/core.ts`, `number.ts`, `fields.ts`, `sizing-fields.ts`, `constants.ts`, `units.ts`) változik → új tartalmi és/vagy forrás-ujjlenyomat → a kalkulátor nem közzétett (tartalmi eltérés), illetve a `tests/calc.ts` elbukik (forráseltérés); a csomag 3. része is változik → új kiadás, és a változott kalkulátorra új jóváhagyás.
- **A jóváhagyás megjelenő szövege** (`REVIEW_TEXTS`, kalkulátorjelvény) változik → a `tests/sizing-tables.ts`, illetve a `tests/calc.ts` / `tests/lektori-csomag.ts` elbukik; új kiadás kell, és `showName: true` csak a lektor új hozzájárulásával maradhat.
- **Csak a csomag más része** (bevezető, jóváhagyó lap, 4–6. rész) változik → új kiadás kell, de a meglévő jóváhagyások érvényesek maradnak, amíg az 1. és a 2. rész ujjlenyomata, illetve a kalkulátorok ujjlenyomat-párja változatlan (a `note` és az `approvalRef` a korábbi kiadásra hivatkozhat).
- **Elírás gyors útja** (`docs/tudastar-terv.md` 4.3): a lektor e-mailben is jóváhagyhatja a diffet; az új kiadás ujjlenyomatait és az e-mail azonosítóját ugyanígy a `SIZING_REVIEW`-ba, illetve a kalkulátorrekord `approvalRef`-jébe kell írni.

A `lib/sizing.ts`-t vagy a `lib/calc/`-ot érintő PR-ban a bírálónak azt is meg kell néznie, hogy a változás érinti-e a csomag 2. vagy 3. részének szövegét: az összevetett esetek a felsorolt bemenetekre vonatkoznak, nem a szabály minden ágára (például a feltételezések kiemelt jelölését csak részben, egy-egy szövegrészlettel vetik össze).

## 6. Új rész hozzáadása (4–6. rész)

A generátor `PARTS` tömbje sorrendben tartalmazza a részeket; a 3. rész (`calculatorsPart()`) mintaként szolgálhat. Új rész:

1. Írj egy `() => Part` függvényt (blokkok, tételek); a tételek `ValueItem` (azonosító, megnevezés, érték, opcionális `checks`) vagy `RuleItem` (szabály, indoklás, kézzel számolt példa, opcionális kérdés, forrás, programmal összevetett `checks`) típusúak. Használd a lefoglalt előtagot (`ABR-`, `CIK-`, `VK-`; az `ID_PREFIXES` tartalmazza).
2. Cseréld le vele a helyőrzőt a `PARTS` tömbben. A Markdown, a PDF, a tartalomjegyzék, a becsült idő és a jóváhagyó lap blokkösszesítője magától bővül.
3. Ha a rész programfüggvényt ír le, bővítsd a `ProgramCheck` típust és a `tests/lektori-csomag.ts` `run()` függvényét (mint a 3. résznél a `calc`, `calcField`, `calcNotCovered`), hogy a példák a programmal össze legyenek vetve.
4. A jóváhagyó lap nyilatkozata (`DECLARATION_TEMPLATE`) jelenleg az 1–3. részre szól, és kizárja a 4–6. részt; az új rész jóváhagyásához igazítsd (ha a rész tételenként vagy elemenként hagyható jóvá, mint a kalkulátorok, a kalkulátoronkénti döntés mintájára). A Tudástár-tartalom saját jóváhagyási adatai (`reviewers[]`, ujjlenyomat; `docs/tudastar-terv.md` 4.3) a rész ujjlenyomatára (`partFingerprint()`) hivatkozhatnak.
5. Generálj új kiadást (új `EDITIONS`-bejegyzés), és futtasd a teszteket.

## Ismert korlátok

- A program a táblázatjóváhagyást csak az 1. rész ujjlenyomatához köti (`tablesApproved()`); a 2. rész kötése a `SIZING_REVIEW.note`-on és a `tests/lektori-csomag.ts`-en keresztül, azaz a fejlesztési folyamat szintjén történik. A csomag ezt a lektornak is így mondja. A kalkulátorokat a program kalkulátoronként, a tartalmi ujjlenyomattal futásidőben, a forrás-ujjlenyomattal a CI-ban köti.
- A kiadott kiadás átírása elleni védelem a commitolt `docs/lektori-csomag.md`-re épül; commit előtt (vagy git nélkül) csak az `EDITIONS` belső szabályai érvényesek.
- A becsült ráfordítás tapasztalati becslés (blokkonként rögzítve vagy a tételszámból számolva a generátorban), nem mérés.
- A 3. rész „Feltételezések” tétele a definíció példáinak futtatásából készül: a bemenettől függő változatok (pl. B, illetve C jelleggörbe) külön sorként jelennek meg.
- A 3. rész összevetett esetei a felsorolt bemenetekre és a tartományok széleire vonatkoznak; a kalkulátorok teljes viselkedését a `tests/calc.ts` (10 000 seedes tulajdonságteszt, egyezés a Méretezéssel) és a `tests/calc-golden.ts` fedi.
- A PDF csak a NotoSans Regular betűkészletet használja; a hiányzó jeleket vonalas rajzként adja ki (a PDF szövegéből kimásolva ezek helyén nem a jel áll).
