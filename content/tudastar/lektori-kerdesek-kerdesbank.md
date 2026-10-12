# Tesztek – kérdésbank: kérdések a szakmai lektornak

Az 1. kör (vázlat, 2026-10-11) kérdésbankjához: `content/tudastar/kerdesek/<tema>.json`, 204 kérdés 10 témakörben, mindegyik `review: "lektorra-var"`, `source: "AI-tervezet"`. A kérdések saját szövegek, a Tudástár cikkeivel (`content/tudastar/elmelet`) és R3-vázlataival (`content/tudastar/r3`) összhangban; szabványpontot egyik kérdés sem idéz. Az alábbi tételeknél a helyes válasz szabványkiadástól, hazai gyakorlattól vagy jogi keretből függ, ezért kifejezett lektori döntés kell. A lista nem helyettesíti a kérdésenkénti lektorálást: közzétenni csak jóváhagyott kérdést lehet (`lib/quiz/schema.ts`, `approvedQuestion`).

## Általános döntések

1. **R3-függőség.** A 204 kérdésből 103 hivatkozása (`ref`) még nem közzétett R3-vázlatra mutat (feszültségmentesítés, FI-relé, kismegszakító, földelési rendszerek, EPH, dugalj, világítási kapcsolások). Témakörönként: kapcsolások 21/21, munkabiztonság 20/20, földelési rendszerek 19/20, védelmi eszközök 17/22, érintésvédelem 15/20, mérés 7/20, gépek 3/20, kábelek 1/21. Dönteni kell: kiadható-e ilyen kérdés a hivatkozott R3 cikk közzététele előtt (szöveges, link nélküli hivatkozással), vagy csak utána. Az utóbbi esetben a bank-kapu (≥ 150 jóváhagyott, témakörönként ≥ 10) a kapcsolások és a munkabiztonság miatt csak az R3 lektorálása után teljesülhet.
2. **Biztonsági témakörök.** Az érintésvédelem, a munkabiztonság, a kapcsolások, a földelési rendszerek és a védelmi eszközök kérdései a biztonságos gyakorlatot erősítik (feszültségmentesítés öt szabálya, a fáziskereső nem igazol, a FI-relé csak kiegészítő védelem). A lektor erősítse meg, hogy egyik válasz vagy magyarázat sem olvasható laikusnak szóló szerelési útmutatásként.
3. **Rögzített sorrendű (számos) kérdések.** A 35 `shuffle: false` egyválasztós kérdésből 27-ben a helyes válasz középső helyen áll, sem az első, sem az utolsó helyen (növekvő számsorrend). Elfogadható-e így, vagy a szerkesztő egyensúlyozza a tévesztőket (több szélső helyes érték)?
4. **Családok (`family`) témakörök között.** Azonos tudást mérő változatok, amelyek egy tesztben nem fordulhatnak elő együtt: `faziskereso` (q-mer-0001, q-mer-0004, q-mb-0003), `fi-nem-old-ki` (q-ved-0009, q-ev-0008, q-ev-0017), `fi-idotartam` (q-ev-0007, q-mb-0019), `nullazott-dugalj` (q-kap-0019, q-ev-0015, q-fold-0019), `kismegszakito-nem-mentesit` (q-kap-0018, q-mb-0004), `falikapcsolo-nem-levalaszt` (q-kap-0006, q-mb-0005), `pen-nem-bonthato` (q-kap-0014, q-fold-0004), `vedovezeto-szabalyok` (q-kap-0012, q-kab-0004), `fi-b-tipus` (q-ved-0013, q-gep-0017), `fi-probagomb` (q-ved-0014, q-mer-0011), `jelleggorbe-hurok` (q-ved-0017, q-ev-0006, q-gep-0016), `pen-szakadas-fi` (q-ev-0011, q-fold-0007), `csucsertek` (q-alap-0005, q-mer-0005), `p-cosfi` (q-alap-0010, q-gep-0012), `aram-3f` (q-alap-0011, q-gep-0013), `nulla-aram` (q-alap-0015, q-kab-0021), `nulla-egyfazis` (q-alap-0016, q-kab-0005). A q-alap-0001 `ohm-aram` családja egyelőre egytagú (a név a számolós sablonéval egyezik). A lektor jelezze, ha két kérdést ennél szorosabban vagy lazábban kell összekötni.
5. **Termékfüggő kérdés – visszavonva.** A q-kap-0020 a Villanyrajz tervezőjének jelölését kérdezte; ez nem villanyszerelői tudás, és a program változatától függ (a szám a PDF-exportban nem is látszik). `retired: true`, a lektori csomagokba nem kerül; a tartalma a tervező súgójába való.

## Védelmi eszközök

- **q-ved-0003** – B16 azonnali kioldási tartománya (48–80 A). A 3–5, 5–10, 10–20 · In tartományok és a kapcsolódó `lib/sizing-tables.ts` értékek jóváhagyásra várnak (SIZING_REVIEW).
- **q-ved-0005, q-ved-0006** – Az 1,13 · In / 1,45 · In egyezményes áramok, az egyórás egyezményes idő (63 A-ig) és az I2 ≤ 1,45 · Iz feltétel; kiadásfüggő.
- **q-ved-0010, q-ved-0011** – 30 mA személyvédelmi, 100/300 mA tűzvédelmi célú FI-relé; hogy hol kötelező a 30 mA, az a hatályos kiadástól függ (a kérdés ezt a tervezőre bízza).
- **q-ved-0012** – IΔn/2-nél nincs kioldás, IΔn-nél biztos; az általános kivitel 0,3 s és 0,04 s (5 · IΔn) kioldási ideje.
- **q-ved-0013, q-gep-0017** – A B típusú FI-relé alkalmazási köre (háromfázisú frekvenciaváltó, egyes töltők és inverterek); a gyártói előírásokhoz kötve.
- **q-ved-0015** – Szóhasználat: „kombinált védelem (RCBO, „áramvédős kismegszakító”)”; ugyanaz a nyitott kérdés, mint a `lektori-kerdesek-elmelet.md` „Hálózatok és gépek” 5. pontja.
- **q-ved-0021** – A túlfeszültség-védelmi eszköz 1., 2. és 3. típusa és sorrendje a betáplálástól a fogyasztó felé.

## Érintésvédelem

- **q-ev-0002** – Alapvédelem (szigetelés, burkolat), hibavédelem (önműködő lekapcsolás) és kiegészítő védelem (30 mA-es FI-relé) besorolása; a hazai szóhasználat egyezik-e.
- **q-ev-0006** – Testzárlatkor az azonnali (elektromágneses) kioldás feltétele a kellően kis hurokimpedancia. A szabvány lekapcsolási időt ír elő; elfogadható-e a kérdés egyszerűsítése.
- **q-ev-0010** – Mit kötnek a fő EPH-sínre (víz- és fűtésvezeték, földelővezető, fő védővezető); a gázvezeték bekötése a gázszolgáltató előírása szerint.
- **q-ev-0012** – Kiegészítő EPH a fürdőszobában: a kötelezőség a szabvány fürdőszobai részétől és a tervezőtől függ.
- **q-ev-0018** – A törpefeszültség határa: legfeljebb 50 V váltakozó feszültség. Az egyenfeszültségű határt a szöveg számmal nem adja meg, mert a gépi szűrő az idegen gyakorlatra utaló „120 V” alakot tiltja.

## Földelési rendszerek

- **q-fold-0003, q-fold-0020** – A TN-C-S a legelterjedtebb a hazai lakóépületekben; a közcélú hálózat jellemzően négyvezetős (három fázis és PEN), több ponton ismételten földelve. Hazai gyakorlat, a TT-rendszerű csatlakozások aránya ellenőrizendő.
- **q-fold-0010, q-fold-0011** – TT-rendszerben a hibavédelmet jellemzően FI-relé adja; a földelési ellenállás és a FI-relé kioldási áramának összehangolása a szabvány feltétele szerint.
- **q-fold-0015** – Régi szóhasználat: nullázás = TN, védőföldelés = TT.
- **q-fold-0017** – A PEN szétválasztásának helye (a fogyasztói berendezés kezdete) és az elosztói engedélyes előírásainak szerepe.

## Kábelek és vezetékek

- **q-kab-0002** – A háromfázisú színsorrend (L1 barna, L2 fekete, L3 szürke) mint „bevett” sorrend.
- **q-kab-0007** – Az NYM-J nem fektethető közvetlenül földbe; gyártói adattal megerősítendő.
- **q-kab-0009, q-kab-0010** – Az U0/U feszültségértékpár értelmezése; a H03VV-F (300/300 V) alkalmatlansága két fázis közötti 400 V-ra.

## Mérés

- **q-mer-0008** – Az ép szigetelés megaohmos nagyságrendje; a legkisebb elfogadható értéket a szabvány adja meg, a kérdés számot nem közöl.
- **q-mer-0010** – Egyszerűsített zárlatiáram-becslés az L–N hurokimpedanciából (Ik ≈ U / Z), összevetés a B16 80 A-es határával; a hurokimpedancia-kalkulátor (T1) lektorálásával összhangban kell lennie.
- **q-mer-0012** – A dugaljáramkör szerelése utáni műszeres ellenőrzések köre (védővezető-folytonosság, szigetelési ellenállás, hurokimpedancia); hazai felülvizsgálati gyakorlat.
- **q-mer-0016** – A hálózati feszültség megengedett sávja (±10 %, 207–253 V); a vonatkozó szabványkiadás ugyanaz a nyitott kérdés, mint a `lektori-kerdesek-elmelet.md` „Alapfogalmak” 1. pontja.
- **q-mer-0018** – A nullavezetőn mért 60 V „veszélyes feszültség” minősítése.

## Gépek

- **q-gep-0013** – Háromfázisú motor vonali árama a felvett teljesítményből. A motoráram-kalkulátor (T1) csak lektor után jelenik meg; dönteni kell, hogy a képletet kérő kérdés kiadható-e előtte.
- **q-gep-0016** – C jelleggörbe nagy bekapcsolási áramú motorhoz, a hurokimpedancia ellenőrzésével; tervezői döntés, a kérdés „jellemző” megoldásként kezeli.

## Munkabiztonság

- **q-mb-0006** – A földelő-rövidzáró eszköz fel- és leszerelési sorrendje, illetve az, hogy kisfeszültségen mikor szükséges (a munka irányítója dönt).
- **q-mb-0009** – A szomszédos feszültség alatti részek letakarása: a hazai munkabiztonsági szabályzat fogalmaival (feszültség közelében végzett munka) egyezik-e a megfogalmazás.
- **q-mb-0011** – Elsősegély-jellegű kérdés (112, érintés nélkül, áramtalanítás). A terv 8. pontja szerint az elsősegély-tartalomhoz a hivatalos útmutatóra is hivatkozni kell; jogi és lektori jóváhagyás kell.

## Független ellenőrzés (2026-10-12)

A kérdésbank független ellenőrzése 19 észrevételt tett. Mindegyiket a kérdés szövegével, a Tudástár cikkeivel és az R3-vázlatokkal összevetve igazoltuk.

**Javítva** (a kérdés tartalmi ujjlenyomata megváltozott, jóváhagyás egyiken sem volt):

- **q-mb-0001** – a magyarázat szerint az öt lépés közül „egyik sem hagyható ki”, holott a földelés és rövidrezárás csak ott kötelező, ahol előírt vagy szükséges, a letakarás pedig csak akkor, ha a közelben feszültség alatt maradó rész van. A magyarázat most ezt mondja; a válaszok a sorrendet kérdezik, és változatlanok, mert ha csak a helyes válaszba kerülne „(ahol előírt)”, az elárulná. Az R3-vázlat ellentmondása: `lektori-kerdesek-r3.md`, utolsó szakasz, 1. pont.
- **q-kap-0012** – a „zöld-sárga ér kizárólag védővezető lehet” állítás ellentmondott a színjelölés-cikknek (védővezető, PEN, EPH). Az új szöveg: „A zöld-sárga ér fázis- vagy nullavezetőként soha nem használható”.
- **q-ved-0011** – a magyarázat a 10 mA-t követelményként állította be. Most: legfeljebb 30 mA, különleges helyeken esetenként érzékenyebb.
- **q-fold-0007** – a kérdés a csatlakozó vezeték PEN-szakadásáról szólt, a magyarázat a közös hálózati PEN-ről. A kérdés most mindkét esetet említi, a magyarázat a főkapcsolós mondatot a közös hálózati szakadásra szűkíti.
- **q-ved-0012** – a 15/30 mA-es kioldási határ szinuszos különbözeti áramra igaz; a kérdés ezt most kimondja.
- **q-kap-0015** – nem volt egyértelmű, hová került a közös kapocsra szánt ér (ha üresen marad, a tünet más). A kérdés most a két ér felcserélését írja le.
- **q-fold-0011** – a nagyobb kioldási áramú FI-relé „egyáltalán nem” helyett „jellemzően nem” old ki.
- **q-fold-0019** – a nullázott kötés a FI-relé után kioldást „okozhat” (ha a fémház földelt részhez ér), nem szükségszerűen.
- **q-ev-0015** – a nullaszakadás veszélyét a túláramvédelem nem kapcsolja le; az utólag beépített FI-relé legfeljebb az érintés közben old ki.
- **q-kap-0011** – a kérdés „a cikkben leírt szabályokra” hivatkozott; most önmagában érthető („Melyik megoldás helyes?”).
- **q-kap-0020** – visszavonva (termékfüggő, lásd az 5. általános pontot).
- **q-kab-0002** – a magyarázatból kikerült a program elosztótervezőjére utaló, kiadásfüggő tagmondat.
- **q-alap-0002, q-alap-0020, q-kap-0002** – nyelvi és tartalmi pontosítás a magyarázatban, illetve az indoklásban (mértékegység-érvelés, értelmetlen mondat, „Fordítva nem működik”).
- **q-mer-0014** – a kérdés első mondata kimondta a választ; törölve.
- **Családok** – `jelleggorbe-hurok` (q-ved-0017, q-ev-0006, q-gep-0016) és `pen-szakadas-fi` (q-ev-0011, q-fold-0007): a párok egymás válaszát adták meg, így egy teszten belül nem fordulhatnak elő együtt.

**Lektorra bízva:**

- **R3-vázlatok összhangja** – a fenti javítások négy R3-vázlatot is érintenek (feszültségmentesítés, 106-os váltókapcsoló, földelési rendszerek, dugalj és FI-relé). A három egyértelmű pontot a vázlatban is igazítottuk, a feszültségmentesítés „egyik sem hagyható ki” mondatát a lektorra bíztuk: `lektori-kerdesek-r3.md`, utolsó szakasz.

