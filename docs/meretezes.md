# Méretezési segédszámítás

Az **Eszközök → Méretezés** fül áramkörönként **tervezői ellenőrzést segítő, tájékoztató számítást** készít a tervben megadott adatokból. A neve szándékosan „segédszámítás”: nem tervezői méretezés, és nem állít szabványossági megfelelőséget.

> **Felelősség.** Tervezői ellenőrzést segítő, tájékoztató számítás. Az eredmény a tervben megadott és a feltüntetett feltételezett adatokból, a programban rögzített, forrásmegjelöléssel ellátott táblázatértékekkel készül. Nem minősül tervezői méretezésnek, szabványossági igazolásnak vagy szakvéleménynek, és nem helyettesíti a jogosult villamos tervező számítását, döntését és felelősségét. A bemenő adatokat, a feltételezéseket és a táblázatértékeket a tervezőnek a hatályos MSZ HD 60364 szabványsorozattal és a gyártói adatokkal kell ellenőriznie; a kész berendezés megfelelőségét méréssel kell igazolni.

A teljes szöveg (`SIZING_DISCLAIMER`, `lib/sizing.ts`) a fül tetején (nem zárható be) és a PDF indoklástáblájának első sorában jelenik meg. A rövid változat (`SIZING_DISCLAIMER_SHORT`) a két PDF-tábla alcímében áll; méretezési táblák esetén a PDF láblécében külön mondat jelzi, hogy ezek tervezői ellenőrzést segítő számítások. A tervellenőrzés megjegyzése saját, rövid nyilatkozat („tervezői ellenőrzést segítő számítás, nem szabványossági minősítés”).

## Mit számol

Áramkörönként, ebben a sorrendben:

| Ellenőrzés | Szabály | Szabványpont |
|---|---|---|
| Kábeljelölés | a kábelszövegből (`3 × 2,5 mm²`, `NYM-J 3x1,5`, `5G6`, `H07V-U 2,5 mm²`, `MCu 2,5`) kiolvasható keresztmetszet és érszám; alumínium, gumiszigetelésű (pl. `H07RN-F`, `GT`, „gumikábel”, „gumiszigetelésű” – a szó eleji „gumi…” ékezetes folytatással is), csökkentett N/PE-erű (pl. `3x25+16`, `3x2,5/1,5`) vagy a táblázatnál nagyobb keresztmetszetű kábel „Nem számítható” | – |
| Legkisebb keresztmetszet | réz: A ≥ a `lib/sizing-tables.ts`-ben rögzített legkisebb keresztmetszet | MSZ HD 60364-5-52 524.1, 52.2 táblázat |
| Erek száma | egyfázisnál ≥ 3 (L, N, PE), háromfázisnál 5 (4 N nélkül) – figyelmeztetés | – |
| Mértékadó hossz | megadott hossz, vagy a nyomvonalak soros összege | – |
| Ib ≤ In | Ib = P / (n · U0 · cos φ) | MSZ HD 60364-4-43 433.1 (1) |
| In ≤ Iz | Iz = Iz0 · kθ · kcs | MSZ HD 60364-4-43 433.1 (1); MSZ HD 60364-5-52 B.52.2/B.52.4, B.52.14, B.52.17 |
| I2 ≤ 1,45 · Iz | kismegszakítónál és kombinált védelemnél I2 = 1,45 · In | MSZ HD 60364-4-43 433.1 (2); MSZ EN 60898-1 (RCBO: MSZ EN 61009-1) |
| Feszültségesés | ΔU% az elosztó előtti eséssel együtt ≤ G.52.1 határ | MSZ HD 60364-5-52 525, G.52.1, G.52.2 |
| Hurokimpedancia (csak ha az elosztó Zs-értéke meg van adva, TN) | Zs ≤ Zs,max = cmin · U0 / (m · In) | MSZ HD 60364-4-41 411.4.4 |

Minden ellenőrzésnél látszik a képlet, a behelyettesített számítás, a felhasznált táblázati érték a táblázatszámmal és állapottal (`ellenőrizendő` / `jóváhagyott` / `projekt-felülírás`), és az indoklás. Csak a ténylegesen felhasznált táblázatértékek jelennek meg. Az ellenőrzésszintű „Rendben” csak azt jelenti, hogy az adott feltétel teljesül (vagy az adat értelmezhető); az áramkör eredménye ettől külön áll.

A határértékeket kis lebegőpontos tűréssel hasonlítjuk össze, így a pontos egyenlőség (pl. Iz = 90 A · 0,7 = 63 A, In = 63 A) teljesül. Ha a kétjegyű kerekítés egyenlőséget mutatna, de az ellenőrzés eltérést talált, a két oldal több tizedessel jelenik meg (pl. „5,004% > 5%”).

## Bemenetek és alapértékek

Minden bemenet opcionális mező a terv JSON-jában (`circuits[].sizing`, `sizing`); a mentés a meglévő terv-mentéssel történik (fiókban `PUT /api/plan` revision-védelemmel, vendég módban a böngészőben), az ablak bezárása után a szerkesztő Visszavonás gombjával (Ctrl+Z) visszavonható, és a JSON export/import megőrzi. A számmezők tizedesvesszőt és -pontot is elfogadnak, és nem kerekítenek. Új tábla, migráció vagy API nincs.

**Áramkör** (a fülön, „Az áramkör méretezési adatai”): szerelési mód, szigetelés, felhasználás (világítás / egyéb), terhelés (W – ugyanaz, mint az áramkörjegyzékben), környezeti hőmérséklet, együtt vezetett áramkörök száma, cos φ, mértékadó hossz (felülírja a nyomvonalösszeget).

**Projekt** („Projekt alapértékei”): falon belüli és falon kívüli nyomvonal szerelési módja, szigetelés, környezeti hőmérséklet, csoportszám, táplálás (közcélú hálózat vagy saját táppont; a hozzájuk tartozó G.52.1 határokat a `lib/sizing-tables.ts` rögzíti, a választómező ezekből írja ki), földelési rendszer (TN / TT).

**Elosztó** („Elosztó betáplálása”): elosztó előtti (fővezeték) feszültségesés %-ban, és az elosztónál mért vagy szolgáltatói Zs. Üres Zs mellett a hurokellenőrzés kimarad („Nem vizsgált”).

**Projekt-felülírás** („Táblázat-felülírások”): gyártói vagy tervezői adat alapján egy Iz0 érték (mód · szigetelés · terhelt erek · keresztmetszet) felülírható, kötelező forrásmegjelöléssel; a számításban „projekt-felülírás” jelöléssel szerepel.

Elsőbbség: áramköri érték → kábeljelölés (csak szigetelésnél) → projekt-alapérték → konzervatív alapérték.

| Adat | Alapérték | Megjegyzés |
|---|---|---|
| Szerelési mód | B2 | falon belüli nyomvonalon kiemelt feltételezés (hőszigetelt falban A1/A2 kisebb) |
| Szigetelés | PVC (70 °C) | kiemelt feltételezés: 60 °C-os (pl. gumiszigetelésű) vezetéknél kisebb a terhelhetőség. XLPE kábelnél is a PVC-táblázattal számolunk, amíg az XLPE-táblázat nincs kitöltve: a PVC Iz0 kisebb, a hőmérsékleti tényező 30 °C felett kisebb az XLPE-énél, 30 °C alatt pedig 1-re korlátozzuk (a PVC-sor ott nagyobb értéket adna) – így az eredmény a kedvezőtlenebb irányba tér el. Felülírt XLPE Iz0-nál ugyanez a korlátozott tényező érvényes |
| Környezeti hőmérséklet | 30 °C | a következő, kedvezőtlenebb táblázati lépcsőre kerekít (33 → 35 °C) |
| Együtt vezetett áramkörök | 1 | B.52.17 1. sor; a következő oszlopra kerekít (10 → 12) |
| Terhelés | szerelvényekből becsült | becsült terhelésnél a feszültségesést a védelem **In** áramával vagy – ha nagyobb – a becsült Ib-vel számoljuk; terhelés és becsülhető szerelvény nélkül az Ib ≤ In „Nem vizsgált” |
| cos φ | 1 | kiemelt feltételezés (megadott terhelésnél) |
| Felhasználás | lámpakiállás esetén világítás (szigorúbb határ), különben egyéb | az „egyéb” alapérték kiemelt feltételezés: világítási áramkörnél a határ szigorúbb |
| Elosztó előtti esés | 0% | kiemelt feltételezés |
| Táplálás / földelés | közcélú hálózat / TN | |

## Képletek

A képletek a `lib/sizing.ts` kis, tiszta, megnevezett függvényei:

- `designCurrent`: Ib = P / (n · U0 · cos φ), n = 3 háromfázisnál (fázisáram); az U0 a `lib/sizing-tables.ts`-ből jön (a teljesítmény a fázisterhelés-összesítéssel közös).
- `correctedIz`: Iz = Iz0 · kθ · kcs (nem kerekít, csak a megjelenítés).
- `voltageDropPercent`: ΔU = b · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100; b = 2 egyfázisnál, 1 háromfázisnál.
- `loopResistance`: ρ1 · L · (1/A + 1/A_PE), A_PE = A (feltételezés).
- `maxLoopImpedance`: cmin · U0 / (m · In); m a jelleggörbe (B / C / D) pillanatkioldási felső határa (MSZ EN 60898-1, RCBO-nál MSZ EN 61009-1).
- `maxLengthForDrop`: a feszültségesés-keretből visszaszámolt legnagyobb hossz (javaslatként; vegyes keresztmetszetnél a legkisebbel, lefelé kerekítve).
- `minSectionFor`: a legkisebb keresztmetszet, amelynél Iz ≥ In (javaslatként; a választás a tervezőé).

## A hossz meghatározása

A mértékadó hossz az áramkörhöz rendelt alaprajzi nyomvonalak **soros összege** (vízszintes szakasz + a két végpont fel-/leállása, ráhagyás nélkül). Korlátai:

- elágazó nyomvonalnál felülbecsül (a feszültségesés így a biztonságos oldalra téved);
- ha egyik nyomvonal sem csatlakozik az elosztó alaprajzi jeléhez, a hossz hiányos lehet → figyelmeztetés;
- ha az áramkör több szinten fut, a szintek közötti szakasz nincs a tervben → figyelmeztetés;
- nyomvonal nélküli áramkörnél nincs hossz → „Nem számítható”, amíg a mértékadó hosszt meg nem adod.

Szakaszonként a saját kábelével (ha a nyomvonalon van értelmezhető jelölés), egyébként az áramkör kábelével számolunk; a terhelhetőségnél a legkisebb Iz-jű szakasz a mértékadó. Ha a mértékadó hossz meg van adva (felülírás), a feszültségesést és a hurokimpedanciát a szakaszok **legkisebb** keresztmetszetével számoljuk (konzervatív), és a kábelellenőrzés ezt jelzi.

Alumínium, gumiszigetelésű, csökkentett N/PE-erű vagy a táblázatnál nagyobb keresztmetszetű kábelt nem cserélünk le: ha a nyomvonalé ilyen, az áramkör kábelére nem; ha az áramköré ilyen, a nyomvonalak (réz) kábelére sem – mindkét esetben „Nem számítható”. Ha az áramkör kábeljelölése egyébként értelmezhetetlen, de minden nyomvonalé értelmezhető, a nyomvonalak kábelével számolunk, figyelmeztetéssel.

## Állapotok és feltételezések

- **Számítás szerint megfelel** – minden vizsgált feltétel teljesül. A címke jelzi, ha közben feltételezéssel éltünk, és ha a hurokimpedancia (Zs nélkül vagy TT-rendszerben) vagy az Ib ≤ In (terhelés nélkül) nem vizsgált, pl. „Számítás szerint megfelel – feltételezésekkel; nem vizsgált: hurokimpedancia”.
- **Figyelmeztetés** – például becsült terhelésnél (In-nel számolt) túllépés, hiányos hossz, kevés ér, ÁVK-val védett áramkör túl nagy hurokimpedanciája.
- **Nem felel meg** – megadott adatokkal sérül egy feltétel; a részletekben lehetséges megoldás áll (nagyobb keresztmetszet, kisebb névleges áram, ÁVK), a választás a tervezőé.
- **Nem számítható** – hiányzó vagy értelmezhetetlen adat, konkrét okkal (nincs hossz, ismeretlen kábeljelölés, alumínium, gumiszigetelés, csökkentett N/PE-ér, a táblázatnál nagyobb keresztmetszet). Nincs találgatás.
- **Nem vizsgált** – az adott ellenőrzés nem készült (pl. Zs nélkül vagy TT-rendszerben a hurok, terhelés nélkül az Ib ≤ In).

Minden alapérték a „Feltételezések” listára kerül; a kiemeltek nem a biztonság javára közelítenek (a valós helyzet kedvezőtlenebb lehet), ezeknél érdemes a tényleges értéket megadni. A tervellenőrzésbe (Eszközök → Tervellenőrzés) csak a „Nem felel meg” és a „Nem számítható” áramkörök kerülnek, ugrással az elosztó készülékére vagy a nyomvonalra.

## PDF

A PDF-dialógusban a „Méretezési segédszámítás” opció **alapból ki van kapcsolva**; elosztó- vagy teljes projekt-exportnál bekapcsolva az elosztóoldalakra két tábla kerül:

1. **Elosztó - méretezési segédszámítás** – áramkörönként védelem / kábel / mód, Ib / In / Iz, hossz, ΔU és határ, Zs és Zs,max, eredmény; az alcím jelmagyarázata: `*` = feltételezett érték, `≈` = becsült terhelés, `n. sz.` = nem számítható, `–` = nem vizsgált / nincs adat;
2. **Elosztó - méretezés indoklása** – felelősségi nyilatkozat, a táblázatok állapota, a figyelmeztető / nem megfelelő / nem számítható **és a nem vizsgált** ellenőrzések számítással és szabványponttal (a minden áramkörnél azonos okból elmaradt ellenőrzés – pl. az elosztó Zs-e nincs megadva – egy „Minden áramkör” sorban), a felhasznált értékek forrással, a feltételezések, a „Nem vizsgált” lista és a tervezői aláírósor (név, névjegyzéki szám, dátum, aláírás).

A lábléc ilyenkor: „Tervdokumentáció. Ráhagyás nélkül; a méretezési táblák tervezői ellenőrzést segítő számítások, nem tervezői méretezés.” A ≤ ≥ ≈ jeleket a beágyazott betűkészlet nem tartalmazza, ezért a PDF-ben `<=`, `>=`, `~` áll. Az export a meglévő exportjogosultsághoz kötött. A megosztott nézet PDF-jében nincs méretezési tábla, és a megosztott terv nem tartalmazza a méretezési beállításokat.

## Mit nem vizsgál

A lista szó szerint a program `SIZING_NOT_COVERED` listája (felület és PDF); eltérésnél a `tests/lektori-csomag.ts` elbukik.

- zárlati szilárdság (k²S² ≥ I²t, 434.5.2)
- szelektivitás és egyidejűség
- felharmonikusok és a nullavezető terhelése
- motorok, indítási áramok
- aszimmetrikus háromfázisú terhelés
- földben (D), szabad levegőn (E, F, G) vezetett kábel; hőszigetelésben futó hosszú szakasz (523.9)
- alumínium vezető, 35 mm² feletti keresztmetszet, gumiszigetelésű (60 °C-os) vezeték, csökkentett keresztmetszetű N- vagy PE-ér
- TT-rendszer hurokellenőrzése, földelési ellenállás, EPH
- ÁVK kiválasztása (típus, érzékenység), túlfeszültség-védelem
- különleges helyiségek (pl. fürdőszoba, MSZ HD 60364-7-701)
- a fővezeték és a telki nyomvonalak méretezése; a 100 m feletti esés-pótlék

## Táblázatértékek és tervezői jóváhagyás

Minden számérték és forrásmegjelölés **egyetlen fájlban** van: `lib/sizing-tables.ts` (PVC réz 2 és 3 terhelt ér, A1/A2/B1/B2/C, 1,5–35 mm²; B.52.14; B.52.17 1. sor; G.52.1 határok; ρ1, λ, U0, cmin, m). A dokumentáció szándékosan nem másolja a táblázatértékeket: egy forrás van, és így a szerzői jogi kockázat is kisebb. Az XLPE-táblázat szándékosan `null`.

Az értékek kezdeti állapota **„ellenőrizendő”**: nem a hiteles MSZ HD szövegből kerültek át (a `SIZING_REVIEW.note` részletezi). A program soha nem állítja magáról, hogy jóváhagyott; ezt csak a jogosult tervező írhatja át.

A jóváhagyás tárgya (`reviewedContent()`): a számértékek (`SIZING_TABLES`), a forrásmegjelölések (`SOURCES`), a számítási sorokban hivatkozott szabványpontok (`CLAUSES`), valamint a szerelésimód- és szigetelésleírások (`methodLabels`, `insulationLabels`).

**A tervezői jóváhagyás menete:**

1. A `lib/sizing-tables.ts` értékeinek, táblázatszámainak és kiadásainak összevetése a hatályos MSZ HD 60364-5-52, -4-43, -4-41 és MSZ EN 60898-1 szabvánnyal.
2. Szükség esetén az XLPE-táblázat (`ampacity.XLPE`, `ambient.XLPE`) kitöltése.
3. A `tests/sizing.ts` kidolgozott (kézzel számolt) példáinak átnézése.
4. Az ujjlenyomat kiírása:
   `node --no-warnings --import tsx -e "import('./lib/sizing-tables.ts').then(m=>console.log(m.tablesFingerprint()))"`
5. A `SIZING_REVIEW` kitöltése (`status: 'jóváhagyott'`, `reviewer`, `registry` = névjegyzéki szám, `date`, `fingerprint`, `showName`) – a lektori csomag aláírt jóváhagyó lapja alapján (`docs/lektoralas.md`).
6. A `tests/sizing-tables.ts` és a `tests/sizing.ts` lefuttatása (mindkettő a jóváhagyott állapotra is zöld), majd PR.

A jóváhagyás az ujjlenyomathoz kötött: ha utána bármely táblázatérték, forrásmegjelölés, hivatkozott szabványpont vagy mód-/szigetelésleírás megváltozik, a `tablesApproved()` hamis lesz, és a `tests/sizing-tables.ts` elbukik, amíg új jóváhagyás nem készül.

**A jóváhagyás megjelenő szövege** (`reviewText()`, a Méretezés fülön, a terv-PDF „méretezés indoklása” táblájában és a táblázatokat használó kalkulátoroldalakon): jóváhagyásig „Ellenőrizendő: …”; jóváhagyás után a jóváhagyó kifejezett hozzájárulásával (`showName: true`) „A táblázatértékeket szakmailag lektorálta: <név> (<névjegyzéki szám>), <dátum>. …”, hozzájárulás nélkül (alapértelmezés) „A táblázatértékeket jogosult villamos tervező szakmailag lektorálta, <dátum>. …”. A jóváhagyás érvénye (`tablesApproved()`) a `showName`-től nem függ: a név és a névjegyzéki szám a `SIZING_REVIEW`-ban akkor is rögzített. A szövegsablonok (`REVIEW_TEXTS`) szándékosan nem részei a táblázat-ujjlenyomatnak (`reviewedContent()`): nem szakmai tartalom, és a megjelenítés nem érintheti a jóváhagyás érvényét; a lektori csomag ujjlenyomata viszont fedi őket, és a `tests/sizing-tables.ts` szó szerint rögzíti (változásuk új csomagkiadást, névvel megjelenítésnél új hozzájárulást igényel).

### Jóváhagyó tervezőnek

A számértékeken túl ezeket a programozott döntéseket is érdemes összevetni a szabvánnyal:

- **XLPE PVC-tartalékkal:** amíg az `ampacity.XLPE` és az `ambient.XLPE` `null`, XLPE kábelnél a PVC Iz0-val és a PVC hőmérsékleti sorral számolunk; 30 °C alatt a tényezőt 1-re korlátozzuk, mert a PVC-sor ott nagyobb az XLPE-énél (a B.52.14 szerint). Ha az XLPE-sorokat kitöltöd, a korlátozás magától megszűnik.
- **Kombinált védelem (RCBO):** az I2 = 1,45 · In és a pillanatkioldási határ (B 5 · In, C 10 · In, D 20 · In) forrása MSZ EN 61009-1 (`SOURCES.rcbo`); az értékek a kismegszakítóéval azonosak.
- **Nem kezelt kábelek:** a gumiszigetelésű (60 °C), a csökkentett N/PE-erű, az alumínium és a táblázatnál nagyobb keresztmetszetű kábel „Nem számítható”; a hurokellenőrzés PE = fázisvezető-keresztmetszetet feltételez.
- **Összehasonlítás:** a határértékeket relatív 10⁻⁹ tűréssel hasonlítjuk össze (a pontos egyenlőség teljesül); ez a táblázatértékek pontosságánál nagyságrendekkel kisebb.

Ha két forrás (vagy két ellenőr) egy táblázatértékre eltérő számot ad, azt ide kell felírni a két értékkel és a forrásukkal, és az értéket a jóváhagyásig „ellenőrizendő” állapotban kell hagyni. Jelenleg nincs ilyen nyitott eltérés.

## Kód és tesztek

- `lib/sizing-tables.ts` – számértékek, források, lookupok (`capacity`, `temperatureFactor`, `groupingFactor`), ujjlenyomat, jóváhagyás, `validateSizingTables`.
- `lib/sizing-schema.ts` – opcionális Zod-séma (`circuitSizingSchema`, `planSizingSchema`), `pruneSizing` (árva/ismétlődő elosztó-beállítás és felülírás csendes törlése a `validatePlan` végén).
- `lib/sizing.ts` – kábeljelölés-értelmezés, képletek, `circuitSizing`, `boardSizing`, `projectSizing`, `sizingTarget`, PDF-sorok, mutáló segédek.
- `components/sizing-report.tsx` – a Méretezés fül; integráció: `components/plan-tools.tsx`, `lib/plan-checks.ts` (`checkPlan(plan,{sizing:true})`), `lib/pdf-export.ts` (`PdfOptions.sizing`), `components/pdf-dialog.tsx`.
- Tesztek: `tests/sizing-tables.ts`, `tests/sizing.ts` (`node --no-warnings --import tsx tests/sizing.ts`).
