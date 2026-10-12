<!-- Generált fájl – kézzel ne szerkeszd. Forrás: scripts/lektori-csomag.ts; folyamat: docs/lektoralas.md. -->

# Villanyrajz – lektori csomag

Szakmai lektori ellenőrzőcsomag a méretezési segédszámításhoz, a szabványhoz kötött kalkulátorokhoz és a Tudástár bekötési ábráihoz: táblázatok, képletek, programozott döntések, kalkulátorok és bekötési ábrák

| Adat | Érték |
|---|---|
| Csomagverzió | LK-4 (2026. 10. 12.) |
| Csomag-ujjlenyomat | 09c63bbe (a csomag teljes szövegéé: bevezető, tételek, jóváhagyó lap) |
| Táblázatváltozat | 2026.10-1 |
| 1. rész – táblázat-ujjlenyomat | c78b23ee (ehhez köti a program a jóváhagyást) |
| 2. rész – képlet-ujjlenyomat | 25b6c94f (a fejlesztési folyamat automatikus tesztje ellenőrzi) |
| 3. rész – kalkulátor-ujjlenyomat | e65e37f3 (a 3. rész egészéé; kalkulátoronként: a döntési táblázatban) |
| 4. rész – ábra-ujjlenyomat | f2384506 (a 4. rész egészéé; ábránként: a döntési táblázatban) |
| Jóváhagyási állapot (1. rész) | ellenőrizendő – jogosult tervező még nem hagyta jóvá |
| Ellenőrizendő tételek | 1. rész: 146; 2. rész: 38; 3. rész: 126; 4. rész: 100 (összesen 410) |
| Becsült ráfordítás | kb. 11 óra 10 perc |

> Belső munkaanyag a szakmai lektor részére – nem nyilvános. A csomagot a program generálja; a táblázatértékek a program jelenlegi értékei, amelyeket a szabvánnyal kell összevetni.

## Tartalom

- Bevezető
- 1. rész – Méretezési táblázatok
- 2. rész – Képletek és programozott döntések
- 3. rész – Szabványhoz kötött kalkulátorok (T1)
- 4. rész – Bekötési ábrák (R3)
- 5. rész – Biztonsági cikkek (R3) (helyőrző)
- 6. rész – Vizsgakérdések (helyőrző)
- Jóváhagyó lap

## Bevezető

### Mi a Villanyrajz?

A Villanyrajz magyar nyelvű, böngészőben futó villamos tervszerkesztő villanyszerelőknek és lakóépületek villamos tervezőinek: alaprajz, szerelvények, kábelnyomvonalak, lakáselosztó, anyaglista, árajánlat és PDF-tervdokumentáció.

A „Méretezési segédszámítás” áramkörönként tervezői ellenőrzést segítő, tájékoztató számítást készít: legkisebb keresztmetszet, Ib ≤ In ≤ Iz, I2 ≤ 1,45 · Iz, feszültségesés, és megadott Zs mellett hurokimpedancia. A számítás minden táblázatértéke és forrásmegjelölése a programban egy helyen van rögzítve; ez a csomag ezeket, valamint a képleteket és a programozott döntéseket gyűjti össze kódolvasás nélkül ellenőrizhető formában.

A Villanyszerelő Tudástár ingyenes, belépés nélkül használható kalkulátorai közül a szabványhoz vagy biztonsághoz kötöttek (T1: Feszültségesés, Motor névleges árama, LED-szalag tápegysége, Fázisjavítás (meddőkompenzálás), Keresztmetszet-választás, Kismegszakító-választás, Hurokimpedancia és zárlati áram, Terhelhetőségi táblázat) csak szakmai lektori jóváhagyás után jelennek meg. A táblázatokat és a méretezési képleteket a segédszámítással közösen használják; leírásuk a 3. részben van.

### Mire használjuk a jóváhagyott tartalmat?

- Jóváhagyásig a program minden táblázatértéket „ellenőrizendő” állapotúként jelöl a felületen, a számítási sorokban és a PDF-ben.
- Jóváhagyás után a tervező Méretezés fülén (Eszközök → Tervsegéd → Méretezés) minden felhasználónak; minden felhasználó exportált terv-PDF-jében, ha a méretezési táblákat bekapcsolja, az elosztóoldalak „méretezés indoklása” táblájának „Táblázatok – Állapot” sorában (ugyanennek a táblának az utolsó sora a terv tervezőjének „Tervezői ellenőrzés” aláírósora); a nyilvános, keresőkben is megtalálható kalkulátoroldalakon a táblázatokat használó kalkulátorok (Feszültségesés, Keresztmetszet-választás, Kismegszakító-választás, Hurokimpedancia és zárlati áram, Terhelhetőségi táblázat) „Táblázatok állapota” sorában és a Vezeték-ellenállás kalkulátor ρ1 szerinti tájékoztató sorában a következő szöveg jelenik meg – a jóváhagyó kifejezett hozzájárulásával: „A táblázatértékeket szakmailag lektorálta: [név], [jogosultság] ([névjegyzéki szám]), [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.”; hozzájárulás nélkül: „A táblázatértékeket szakmailag lektorálta: [jogosultság], [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.” A szöveg a táblázatértékek lektorálását jelzi, nem az adott terv jóváhagyását. A 3. részből jóváhagyott kalkulátorok saját oldalán (jelvény; lábléc-sor) hozzájárulással „Szakmailag lektorálta: [név], [jogosultság] · [dátum]; Szakmai lektor: [név], [jogosultság]”, anélkül „Szakmailag lektorálta: [jogosultság] · [dátum]; Szakmai lektor: [jogosultság]” áll; a kalkulátorlistán (/kalkulatorok) és a keresőben a jelvény mindig név nélküli: „Szakmailag lektorálta: [jogosultság] · [dátum]”. A [jogosultság] a Jóváhagyó lap „Jogosultság megnevezése” mezőjének szövege.
- A név és a névjegyzéki szám csak hozzájárulással jelenik meg (Jóváhagyó lap), és csak ekkor kerül a programba: a program kódja a nyilvános oldalakon olvasható, ezért hozzájárulás nélkül a programban sem rögzítjük. Ilyenkor a jóváhagyást a jogosultság megnevezése, a dátum és a hivatkozás (csomagkiadás, ujjlenyomatok, a Jóváhagyó lap iktatási helye) azonosítja; az aláírt lapot a megbízó a programon kívül őrzi. A jóváhagyás érvénye a név megjelenítésétől nem függ.
- A 3. rész T1 kalkulátorai kalkulátoronként, a jóváhagyott tartalmi és forrás-ujjlenyomattal rögzített lektori rekorddal jelennek meg a nyilvános kalkulátoroldalakon; a táblázat-kapus kalkulátorok (Feszültségesés, Keresztmetszet-választás, Kismegszakító-választás, Hurokimpedancia és zárlati áram, Terhelhetőségi táblázat) ezen felül csak az 1. rész jóváhagyása után. Ha egy kalkulátor a jóváhagyás után bármiben változik, a program nem teszi közzé, illetve az automatikus teszt elbukik, amíg új jóváhagyás nem készül.
- Az 1. rész jóváhagyása a programban ujjlenyomathoz kötött: ha később bármely táblázatérték, forrásmegjelölés, szabványpont vagy leírás megváltozik, a program automatikusan „ellenőrizendő” állapotra áll vissza.
- A 2. rész (képletek, döntések) jóváhagyását a program állapota nem követi. Ezt a fejlesztési folyamat biztosítja: jóváhagyott állapotban az automatikus teszt elbukik, ha a 2. rész a jóváhagyott ujjlenyomattól eltér; ilyenkor új kiadás és új jóváhagyás kell.

### Mit jelent a jóváhagyás – és mit nem?

A jóváhagyás jelenti:

- az 1. rész értékei, táblázatszámai, kiadásai és leírásai a hivatkozott szabványok hatályos kiadásával egyeznek (vagy a lektor megadta a helyes értéket);
- a 2. rész képletei helyesek, és a programozott döntések, alapértékek iránya és jelölése elfogadható egy tervezői ellenőrzést segítő számításhoz;
- a 3. rész „Jóváhagyom” jelölésű kalkulátorainak képletei, bemeneti korlátai, alapértékei, figyelmeztetései és szóhasználata helyesek, illetve elfogadhatók egy tájékoztató, „számítás szerinti” kalkulátorhoz;
- a 4. rész „Jóváhagyom” jelölésű bekötési ábrái (bekötés, érszínek, kapcsok szerepe, szakaszok érszáma, működés minden állásban) helyesek, és alkalmasak szakember tájékoztatására; R3 tartalomként ehhez a második olvasó egyetértése is kell.

A jóváhagyás nem jelenti:

- tervezői felelősségvállalást az egyes, a programmal készült tervekért vagy a kalkulátorokkal végzett egyes számításokért: az eredmény továbbra is „tervezői ellenőrzést segítő”, illetve „számítás szerinti” érték, nem tervezői méretezés; a tervért annak tervezője felel – a programban megjelenő jóváhagyási szöveg is csak a táblázatértékekre vonatkozik;
- a program egészének (forráskód, felület, más funkciók) vizsgálatát vagy minősítését;
- a felhasználó által megadott adatok (terhelés, hossz, szerelési mód, Zs, projekt-felülírás) helyességének igazolását, illetve a kész berendezés mérésének kiváltását;
- a hatókörön kívüli esetek (D-HATOKOR és a kalkulátorok „Nem vizsgált” listái) vizsgálatát, és az 5–6. részt, amely jelenleg helyőrző;
- a 4. rész ábráihoz tartozó cikkek szövegének jóváhagyását: a cikk csak akkor jelenhet meg, ha a szövegét is jóváhagyták (az 5. rész elkészültéig a cikkvázlat alapján, docs/lektoralas.md).

### Hogyan kell kitölteni?

1. A csomagot a hivatkozott szabványok hatályos kiadásával kell összevetni; a program kódjának olvasása nem szükséges.
2. Tételenként: ✓ = az érték vagy állítás helyes; ✗ = eltér vagy hibás – ilyenkor a „Helyes érték / megjegyzés” mezőbe a helyes értéket kérjük beírni. A forrást (szabvány, kiadás, pont vagy táblázat) blokkonként elég egyszer megadni, a blokk végén álló „Megjegyzés a blokkhoz (forrás, kiadás)” mezőben; ha egy tételé ettől eltér, a tételnél.
3. Gyorsítás: ha a blokk minden tétele egyezik, elég a blokk végén „A blokk minden tétele egyezik” négyzetet jelölni; a tételeket nem kell egyenként pipálni. Ha bármelyik tétel eltér, a blokk négyzetét ne jelölje; az eltérő tételeket jelölje ✗-szel, a többi, pipálatlanul hagyott tétel egyezőnek számít. A terhelhetőségi táblák elején álló áttekintő mátrix soronként vethető össze a szabvány táblázatával.
4. A 2. és a 3. részben minden szabálytétel egy szabályt, indoklást és kézzel számolt példát tartalmaz; a példát érdemes újraszámolni. A „Kérdés a lektorhoz” pontokra kérjük külön választ a megjegyzés mezőben.
5. A 3. részben a táblázatértékeket nem kell újra összevetni (az 1. rész azonosítóival hivatkozunk rájuk). A kalkulátorok kalkulátoronként hagyhatók jóvá (Jóváhagyó lap, „3. rész – kalkulátoronkénti döntés”). A kalkulátorok előnézetben ki is próbálhatók (a hozzáférést a megbízó adja), de a csomag önmagában is ellenőrizhető.
6. A 4. részben ábránként a rajzot, a vezetéktáblát, a szakaszok érszámát és a kapcsolóállás-táblázatot kell átnézni, és a blokk végén (és a Jóváhagyó lap „4. rész – ábránkénti döntés” táblázatában) jelölni: Jóváhagyom, Javítással (a hibát a megjegyzésbe), vagy Elutasítom. A cikkek saját és a témakör közös lektori kérdései a blokkok elején állnak.
7. Ha két forrás egy értékre eltérő számot ad, mindkettőt kérjük a megjegyzésbe írni a forrással; az érték a tisztázásig „ellenőrizendő” marad.
8. Terjedelmesebb javítást (pl. egy teljes táblázat javasolt értékeit) külön mellékletben kérjük, a tételazonosítókra hivatkozva.
9. Végül a Jóváhagyó lapot kell kitölteni és aláírni (a lapokat a láblécben szignálni), és a jelölt csomaggal együtt (papíron vagy szkennelve) visszaküldeni.

A csomag belső munkaanyag, nem nyilvános. A benne szereplő számértékek a program jelenlegi értékei, amelyeket a szabvánnyal össze kell vetni; nem a szabvány szövegének másolatai.

### Jelölések

- Ib – tervezett (terhelési) áram; In – a védelem névleges árama; I2 – a védelem megállapodás szerinti kioldóárama (a működést biztosító áram)
- Iz0 – táblázati terhelhetőség; Iz – javított terhelhetőség; kθ – hőmérsékleti tényező; kcs – csoportosítási tényező
- U0 – névleges fázis–föld feszültség; ΔU – feszültségesés; ρ1 – fajlagos ellenállás üzemi hőmérsékleten; λ – fajlagos reaktancia
- Zs – hibahurok-impedancia; m – a pillanatkioldás felső határának szorzója; cmin – feszültségtényező; A, A_PE – fázis- és védővezető-keresztmetszet
- MCB – kismegszakító; RCBO – túláramvédelemmel egybeépített áram-védőkapcsoló; ÁVK – áram-védőkapcsoló (FI-relé)
- Kalkulátoroknál: Ze – hurokimpedancia az elosztónál; Ik – zárlati (hiba-) áram; Lmax – legnagyobb hossz; η – hatásfok; Qc – kondenzátorteljesítmény; ω = 2π · f – körfrekvencia

### Becsült ráfordítás

A becslés a szabványok kéznél lévő, hatályos kiadását és a csomag egyszeri átnézését feltételezi. Eltérések esetén a javított kiadás visszaellenőrzése (csak a változott tételek) külön kb. 15–30 perc.

| Blokk | Tartalom | Tételek | Becsült idő |
|---|---|---:|---:|
| T-KM | Keresztmetszet-lépcsők | 1 | 1 perc |
| T-PVC2 | Terhelhetőség Iz0 – PVC, réz, 2 terhelt ér | 40 | 12 perc |
| T-PVC3 | Terhelhetőség Iz0 – PVC, réz, 3 terhelt ér | 40 | 12 perc |
| T-XLPE | XLPE/EPR-táblázatok (szándékosan üres) | 2 | 2 perc |
| T-KT | Hőmérsékleti tényező kθ – PVC, levegőben | 11 | 4 perc |
| T-KCS | Csoportosítási tényező kcs | 12 | 4 perc |
| T-DU | Feszültségesés-határ | 4 | 3 perc |
| T-K | Állandók | 9 | 8 perc |
| F | Forrásmegjelölések | 14 | 15 perc |
| SZP | Számítási sorokban hivatkozott szabványpontok | 6 | 4 perc |
| L | Szerelésimód- és szigetelésleírások | 7 | 5 perc |
| K | Képletek | 10 | 30 perc |
| D-ALAP | Alapértékek (ha a felhasználó nem ad meg adatot) | 7 | 14 perc |
| D-JEL | Kábeljelölés-felismerés | 6 | 4 perc |
| D | Programozott döntések | 15 | 45 perc |
| KAL-KOZOS | Közös működés (minden T1 kalkulátor) | 8 | 15 perc |
| KAL-FESZULTSEGES | Feszültségesés | 17 | 26 perc |
| KAL-MOTOR-ARAM | Motor névleges árama | 18 | 27 perc |
| KAL-LED-SZALAG-TAPEGYSEG | LED-szalag tápegysége | 13 | 19 perc |
| KAL-FAZISJAVITAS | Fázisjavítás (meddőkompenzálás) | 15 | 23 perc |
| KAL-KERESZTMETSZET | Keresztmetszet-választás | 14 | 22 perc |
| KAL-KISMEGSZAKITO | Kismegszakító-választás | 15 | 20 perc |
| KAL-HUROKIMPEDANCIA | Hurokimpedancia és zárlati áram | 14 | 22 perc |
| KAL-TERHELHETOSEG-TABLAZAT | Terhelhetőségi táblázat | 12 | 18 perc |
| BEK-EGYPOLUSU-KAPCSOLO-101 | Egypólusú kapcsoló (101): egy lámpa egy helyről | 5 | 13 perc |
| BEK-KETPOLUSU-KAPCSOLO-102 | Kétpólusú kapcsoló (102): a fázis- és a nullavezető együttes bontása | 5 | 13 perc |
| BEK-CSILLARKAPCSOLO-105 | Csillárkapcsoló (105): két lámpakör egy helyről | 5 | 15 perc |
| BEK-VALTOKAPCSOLO-106 | Váltókapcsolás (2 × 106): egy lámpa két helyről | 5 | 14 perc |
| BEK-KETTOS-VALTOKAPCSOLO-106-6 | Kettős váltókapcsoló (106+6): két lámpa, mindkettő két helyről | 5 | 18 perc |
| BEK-KERESZTKAPCSOLO-107 | Keresztkapcsolás (106 + 107 + 106): egy lámpa három helyről | 5 | 15 perc |
| BEK-KERESZTKAPCSOLO-107-2X107 | Keresztkapcsolás (106 + 2 × 107 + 106): egy lámpa 4 helyről | 5 | 17 perc |
| BEK-KERESZTKAPCSOLO-107-3X107 | Keresztkapcsolás (106 + 3 × 107 + 106): egy lámpa 5 helyről | 5 | 20 perc |
| BEK-KERESZTKAPCSOLO-107-4X107 | Keresztkapcsolás (106 + 4 × 107 + 106): egy lámpa 6 helyről | 5 | 25 perc |
| BEK-DUGALJ-ATHURKOLAS | Dugaljkör áthurkolással: két védőérintkezős dugalj FI-relé és kismegszakító után | 5 | 14 perc |
| BEK-DUGALJ-LEAGAZTATAS | Dugaljkör leágaztatással: két dugalj a kötődobozból, FI-relé és kismegszakító után | 5 | 15 perc |
| BEK-KISMEGSZAKITO-ARAMKOROK | Két dugaljkör saját kismegszakítóval, közös FI-relé után | 5 | 14 perc |
| BEK-FI-RELE-BEKOTES | Áram-védőkapcsoló (FI-relé) bekötése dugaljkör elé, próbagombbal | 5 | 14 perc |
| BEK-FI-RELE-HIBAHELYZETEK | Mikor old ki a FI-relé? Testzárlat, fázis–föld és fázis–nulla érintés | 5 | 14 perc |
| BEK-FOLDELES-TN-C | TN-C rendszer: a PEN-vezető a fogyasztóig fut | 5 | 13 perc |
| BEK-FOLDELES-TN-S | TN-S rendszer: külön nulla- és védővezető a táppontól | 5 | 14 perc |
| BEK-FOLDELES-TN-C-S | TN-C-S rendszer: PEN a szétválasztási pontig, utána külön N és PE | 5 | 14 perc |
| BEK-FOLDELES-TT | TT rendszer: a fémház a saját földelőn | 5 | 13 perc |
| BEK-FOLDELES-IT | IT rendszer: földeletlen táppont, földelt fémházak | 5 | 16 perc |
| BEK-EPH-ALAPOK | Egyenpotenciálra hozás: a fő EPH-sín és a vízvezeték bekötése (TN-C-S) | 5 | 14 perc |
| – | Jóváhagyó lap kitöltése | – | 10 perc |
|  | Összesen | 410 | kb. 11 óra 10 perc |

## 1. rész – Méretezési táblázatok

A program a méretezési segédszámításban kizárólag az alábbi értékekkel számol. Minden érték, forrásmegjelölés és leírás a programban egyetlen helyen van rögzítve; a jóváhagyás ezek összességére vonatkozik, és a program a táblázat-ujjlenyomathoz köti: ha bármelyik megváltozik, a program magától „ellenőrizendő” állapotra áll vissza.

Az értékek nem a hiteles MSZ HD szövegből kerültek át, ezért mindegyiket a szabvány hatályos kiadásával kell összevetni. A táblázatszámok az IEC 60364-5-52:2009 B mellékletével azonos számozást feltételeznek; ez maga is ellenőrizendő (F- tételek). A számértékek kerekítés nélkül, a programban tárolt pontossággal szerepelnek.

Jelenlegi állapot: ellenőrizendő. Táblázatváltozat: 2026.10-1; táblázat-ujjlenyomat: c78b23ee.

A rögzítés körülményei (a programban rögzített megjegyzés): Az értékek az IEC 60364-5-52:2009 B mellékletével azonos számozás feltételezésével, nem a hiteles MSZ HD szövegből kerültek rögzítésre. A táblázatszámokat, kiadásokat, szerelésimód-leírásokat és minden számértéket a hatályos szabvánnyal össze kell vetni.

### T-KM – Keresztmetszet-lépcsők

Forrás: MSZ HD 60364-5-52:2011 B.52.2, B.52.4 (keresztmetszet-oszlop)

A rézvezető névleges keresztmetszetei, amelyekre a program terhelhetőséget tárol. Más keresztmetszettel a program nem számol (D-BLOKK).

| Azonosító | Tétel | Érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| T-KM-SOR | Keresztmetszetek (réz) | 1,5; 2,5; 4; 6; 10; 16; 25; 35 mm² | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (T-KM).

Megjegyzés a blokkhoz (forrás, kiadás):

### T-PVC2 – Terhelhetőség Iz0 – PVC, réz, 2 terhelt ér

Forrás: MSZ HD 60364-5-52:2011 – B.52.2 táblázat – PVC, 2 terhelt ér, réz, 70 °C, 30 °C levegő

Rézvezető, 70 °C-os vezetőhőmérséklet, 30 °C-os levegő, egyetlen áramkör. Sorok: keresztmetszet; oszlopok: szerelési mód (leírásuk az L blokkban). Az áttekintő mátrix sorai a szabvány táblázatának soraival vethetők össze; eltérésnél az alatta lévő tétellistában kell az azonosítót ✗-szel jelölni.

Áttekintés:

| mm² | A1 | A2 | B1 | B2 | C |
|---:|---:|---:|---:|---:|---:|
| 1,5 | 14,5 | 14 | 17,5 | 16,5 | 19,5 |
| 2,5 | 19,5 | 18,5 | 24 | 23 | 27 |
| 4 | 26 | 25 | 32 | 30 | 36 |
| 6 | 34 | 32 | 41 | 38 | 46 |
| 10 | 46 | 43 | 57 | 52 | 63 |
| 16 | 61 | 57 | 76 | 69 | 85 |
| 25 | 80 | 75 | 101 | 90 | 112 |
| 35 | 99 | 92 | 125 | 111 | 138 |

| Azonosító | Tétel | Érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| T-PVC2-A1-1.5 | A1 · 1,5 mm² | 14,5 A | ☐ | ☐ | |
| T-PVC2-A2-1.5 | A2 · 1,5 mm² | 14 A | ☐ | ☐ | |
| T-PVC2-B1-1.5 | B1 · 1,5 mm² | 17,5 A | ☐ | ☐ | |
| T-PVC2-B2-1.5 | B2 · 1,5 mm² | 16,5 A | ☐ | ☐ | |
| T-PVC2-C-1.5 | C · 1,5 mm² | 19,5 A | ☐ | ☐ | |
| T-PVC2-A1-2.5 | A1 · 2,5 mm² | 19,5 A | ☐ | ☐ | |
| T-PVC2-A2-2.5 | A2 · 2,5 mm² | 18,5 A | ☐ | ☐ | |
| T-PVC2-B1-2.5 | B1 · 2,5 mm² | 24 A | ☐ | ☐ | |
| T-PVC2-B2-2.5 | B2 · 2,5 mm² | 23 A | ☐ | ☐ | |
| T-PVC2-C-2.5 | C · 2,5 mm² | 27 A | ☐ | ☐ | |
| T-PVC2-A1-4 | A1 · 4 mm² | 26 A | ☐ | ☐ | |
| T-PVC2-A2-4 | A2 · 4 mm² | 25 A | ☐ | ☐ | |
| T-PVC2-B1-4 | B1 · 4 mm² | 32 A | ☐ | ☐ | |
| T-PVC2-B2-4 | B2 · 4 mm² | 30 A | ☐ | ☐ | |
| T-PVC2-C-4 | C · 4 mm² | 36 A | ☐ | ☐ | |
| T-PVC2-A1-6 | A1 · 6 mm² | 34 A | ☐ | ☐ | |
| T-PVC2-A2-6 | A2 · 6 mm² | 32 A | ☐ | ☐ | |
| T-PVC2-B1-6 | B1 · 6 mm² | 41 A | ☐ | ☐ | |
| T-PVC2-B2-6 | B2 · 6 mm² | 38 A | ☐ | ☐ | |
| T-PVC2-C-6 | C · 6 mm² | 46 A | ☐ | ☐ | |
| T-PVC2-A1-10 | A1 · 10 mm² | 46 A | ☐ | ☐ | |
| T-PVC2-A2-10 | A2 · 10 mm² | 43 A | ☐ | ☐ | |
| T-PVC2-B1-10 | B1 · 10 mm² | 57 A | ☐ | ☐ | |
| T-PVC2-B2-10 | B2 · 10 mm² | 52 A | ☐ | ☐ | |
| T-PVC2-C-10 | C · 10 mm² | 63 A | ☐ | ☐ | |
| T-PVC2-A1-16 | A1 · 16 mm² | 61 A | ☐ | ☐ | |
| T-PVC2-A2-16 | A2 · 16 mm² | 57 A | ☐ | ☐ | |
| T-PVC2-B1-16 | B1 · 16 mm² | 76 A | ☐ | ☐ | |
| T-PVC2-B2-16 | B2 · 16 mm² | 69 A | ☐ | ☐ | |
| T-PVC2-C-16 | C · 16 mm² | 85 A | ☐ | ☐ | |
| T-PVC2-A1-25 | A1 · 25 mm² | 80 A | ☐ | ☐ | |
| T-PVC2-A2-25 | A2 · 25 mm² | 75 A | ☐ | ☐ | |
| T-PVC2-B1-25 | B1 · 25 mm² | 101 A | ☐ | ☐ | |
| T-PVC2-B2-25 | B2 · 25 mm² | 90 A | ☐ | ☐ | |
| T-PVC2-C-25 | C · 25 mm² | 112 A | ☐ | ☐ | |
| T-PVC2-A1-35 | A1 · 35 mm² | 99 A | ☐ | ☐ | |
| T-PVC2-A2-35 | A2 · 35 mm² | 92 A | ☐ | ☐ | |
| T-PVC2-B1-35 | B1 · 35 mm² | 125 A | ☐ | ☐ | |
| T-PVC2-B2-35 | B2 · 35 mm² | 111 A | ☐ | ☐ | |
| T-PVC2-C-35 | C · 35 mm² | 138 A | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (T-PVC2).

Megjegyzés a blokkhoz (forrás, kiadás):

### T-PVC3 – Terhelhetőség Iz0 – PVC, réz, 3 terhelt ér

Forrás: MSZ HD 60364-5-52:2011 – B.52.4 táblázat – PVC, 3 terhelt ér, réz

Rézvezető, 70 °C-os vezetőhőmérséklet, 30 °C-os levegő, egyetlen áramkör. Sorok: keresztmetszet; oszlopok: szerelési mód (leírásuk az L blokkban). Az áttekintő mátrix sorai a szabvány táblázatának soraival vethetők össze; eltérésnél az alatta lévő tétellistában kell az azonosítót ✗-szel jelölni.

Áttekintés:

| mm² | A1 | A2 | B1 | B2 | C |
|---:|---:|---:|---:|---:|---:|
| 1,5 | 13,5 | 13 | 15,5 | 15 | 17,5 |
| 2,5 | 18 | 17,5 | 21 | 20 | 24 |
| 4 | 24 | 23 | 28 | 27 | 32 |
| 6 | 31 | 29 | 36 | 34 | 41 |
| 10 | 42 | 39 | 50 | 46 | 57 |
| 16 | 56 | 52 | 68 | 62 | 76 |
| 25 | 73 | 68 | 89 | 80 | 96 |
| 35 | 89 | 83 | 110 | 99 | 119 |

| Azonosító | Tétel | Érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| T-PVC3-A1-1.5 | A1 · 1,5 mm² | 13,5 A | ☐ | ☐ | |
| T-PVC3-A2-1.5 | A2 · 1,5 mm² | 13 A | ☐ | ☐ | |
| T-PVC3-B1-1.5 | B1 · 1,5 mm² | 15,5 A | ☐ | ☐ | |
| T-PVC3-B2-1.5 | B2 · 1,5 mm² | 15 A | ☐ | ☐ | |
| T-PVC3-C-1.5 | C · 1,5 mm² | 17,5 A | ☐ | ☐ | |
| T-PVC3-A1-2.5 | A1 · 2,5 mm² | 18 A | ☐ | ☐ | |
| T-PVC3-A2-2.5 | A2 · 2,5 mm² | 17,5 A | ☐ | ☐ | |
| T-PVC3-B1-2.5 | B1 · 2,5 mm² | 21 A | ☐ | ☐ | |
| T-PVC3-B2-2.5 | B2 · 2,5 mm² | 20 A | ☐ | ☐ | |
| T-PVC3-C-2.5 | C · 2,5 mm² | 24 A | ☐ | ☐ | |
| T-PVC3-A1-4 | A1 · 4 mm² | 24 A | ☐ | ☐ | |
| T-PVC3-A2-4 | A2 · 4 mm² | 23 A | ☐ | ☐ | |
| T-PVC3-B1-4 | B1 · 4 mm² | 28 A | ☐ | ☐ | |
| T-PVC3-B2-4 | B2 · 4 mm² | 27 A | ☐ | ☐ | |
| T-PVC3-C-4 | C · 4 mm² | 32 A | ☐ | ☐ | |
| T-PVC3-A1-6 | A1 · 6 mm² | 31 A | ☐ | ☐ | |
| T-PVC3-A2-6 | A2 · 6 mm² | 29 A | ☐ | ☐ | |
| T-PVC3-B1-6 | B1 · 6 mm² | 36 A | ☐ | ☐ | |
| T-PVC3-B2-6 | B2 · 6 mm² | 34 A | ☐ | ☐ | |
| T-PVC3-C-6 | C · 6 mm² | 41 A | ☐ | ☐ | |
| T-PVC3-A1-10 | A1 · 10 mm² | 42 A | ☐ | ☐ | |
| T-PVC3-A2-10 | A2 · 10 mm² | 39 A | ☐ | ☐ | |
| T-PVC3-B1-10 | B1 · 10 mm² | 50 A | ☐ | ☐ | |
| T-PVC3-B2-10 | B2 · 10 mm² | 46 A | ☐ | ☐ | |
| T-PVC3-C-10 | C · 10 mm² | 57 A | ☐ | ☐ | |
| T-PVC3-A1-16 | A1 · 16 mm² | 56 A | ☐ | ☐ | |
| T-PVC3-A2-16 | A2 · 16 mm² | 52 A | ☐ | ☐ | |
| T-PVC3-B1-16 | B1 · 16 mm² | 68 A | ☐ | ☐ | |
| T-PVC3-B2-16 | B2 · 16 mm² | 62 A | ☐ | ☐ | |
| T-PVC3-C-16 | C · 16 mm² | 76 A | ☐ | ☐ | |
| T-PVC3-A1-25 | A1 · 25 mm² | 73 A | ☐ | ☐ | |
| T-PVC3-A2-25 | A2 · 25 mm² | 68 A | ☐ | ☐ | |
| T-PVC3-B1-25 | B1 · 25 mm² | 89 A | ☐ | ☐ | |
| T-PVC3-B2-25 | B2 · 25 mm² | 80 A | ☐ | ☐ | |
| T-PVC3-C-25 | C · 25 mm² | 96 A | ☐ | ☐ | |
| T-PVC3-A1-35 | A1 · 35 mm² | 89 A | ☐ | ☐ | |
| T-PVC3-A2-35 | A2 · 35 mm² | 83 A | ☐ | ☐ | |
| T-PVC3-B1-35 | B1 · 35 mm² | 110 A | ☐ | ☐ | |
| T-PVC3-B2-35 | B2 · 35 mm² | 99 A | ☐ | ☐ | |
| T-PVC3-C-35 | C · 35 mm² | 119 A | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (T-PVC3).

Megjegyzés a blokkhoz (forrás, kiadás):

### T-XLPE – XLPE/EPR-táblázatok (szándékosan üres)

Forrás: MSZ HD 60364-5-52:2011 – B.52.3 táblázat – XLPE/EPR, 2 terhelt ér (a programban nincs rögzítve); MSZ HD 60364-5-52:2011 – B.52.5 táblázat – XLPE/EPR, 3 terhelt ér (a programban nincs rögzítve)

A program XLPE-táblázatot nem tartalmaz. Jóváhagyás (✓) esetén a lektor elfogadja, hogy üres marad (a program a kedvezőtlenebb PVC-értékkel számol). Ha a kitöltését javasolja, a teljes táblázatot külön mellékletben kérjük megadni (a tételazonosítóra hivatkozva); ide elég a „melléklet” jelzés.

| Azonosító | Tétel | Érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| T-XLPE-IZ0 | XLPE/EPR terhelhetőség (B.52.3, B.52.5) | nincs rögzítve – PVC-értékkel számol (D-XLPE) | ☐ | ☐ | |
| T-XLPE-KT | XLPE/EPR hőmérsékleti tényező (B.52.14) | nincs rögzítve – PVC-sorral, 30 °C alatt 1-re korlátozva (D-XLPE) | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (T-XLPE).

Megjegyzés a blokkhoz (forrás, kiadás):

### T-KT – Hőmérsékleti tényező kθ – PVC, levegőben

Forrás: MSZ HD 60364-5-52:2011 – B.52.14 táblázat – levegő-hőmérsékleti tényező

A környezeti levegő hőmérséklete szerinti csökkentő (30 °C alatt növelő) tényező. A program a lépcsők között nem interpolál, hanem a következő, nagyobb vagy egyenlő lépcsőt veszi (D-KEREK).

| Azonosító | Tétel | Érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| T-KT-10 | PVC · 10 °C | 1,22 | ☐ | ☐ | |
| T-KT-15 | PVC · 15 °C | 1,17 | ☐ | ☐ | |
| T-KT-20 | PVC · 20 °C | 1,12 | ☐ | ☐ | |
| T-KT-25 | PVC · 25 °C | 1,06 | ☐ | ☐ | |
| T-KT-30 | PVC · 30 °C | 1 | ☐ | ☐ | |
| T-KT-35 | PVC · 35 °C | 0,94 | ☐ | ☐ | |
| T-KT-40 | PVC · 40 °C | 0,87 | ☐ | ☐ | |
| T-KT-45 | PVC · 45 °C | 0,79 | ☐ | ☐ | |
| T-KT-50 | PVC · 50 °C | 0,71 | ☐ | ☐ | |
| T-KT-55 | PVC · 55 °C | 0,61 | ☐ | ☐ | |
| T-KT-60 | PVC · 60 °C | 0,5 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (T-KT).

Megjegyzés a blokkhoz (forrás, kiadás):

### T-KCS – Csoportosítási tényező kcs

Forrás: MSZ HD 60364-5-52:2011 – B.52.17 táblázat, 1. sor – kötegelve, felületen, beágyazva vagy zártan

Együtt vezetett (terhelt) áramkörök száma szerinti tényező, kizárólag a táblázat 1. sora szerint (kötegelve, felületen, beágyazva vagy zártan). Lépcsők között a következő nagyobb oszlop (D-KEREK).

| Azonosító | Tétel | Érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| T-KCS-1 | 1 áramkör | 1 | ☐ | ☐ | |
| T-KCS-2 | 2 áramkör | 0,8 | ☐ | ☐ | |
| T-KCS-3 | 3 áramkör | 0,7 | ☐ | ☐ | |
| T-KCS-4 | 4 áramkör | 0,65 | ☐ | ☐ | |
| T-KCS-5 | 5 áramkör | 0,6 | ☐ | ☐ | |
| T-KCS-6 | 6 áramkör | 0,57 | ☐ | ☐ | |
| T-KCS-7 | 7 áramkör | 0,54 | ☐ | ☐ | |
| T-KCS-8 | 8 áramkör | 0,52 | ☐ | ☐ | |
| T-KCS-9 | 9 áramkör | 0,5 | ☐ | ☐ | |
| T-KCS-12 | 12 áramkör | 0,45 | ☐ | ☐ | |
| T-KCS-16 | 16 áramkör | 0,41 | ☐ | ☐ | |
| T-KCS-20 | 20 áramkör | 0,38 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (T-KCS).

Megjegyzés a blokkhoz (forrás, kiadás):

### T-DU – Feszültségesés-határ

Forrás: MSZ HD 60364-5-52:2011 G.52.1 (tájékoztató melléklet)

A berendezés kezdőpontjától (csatlakozási pont) a fogyasztóig megengedett legnagyobb feszültségesés, U0-ra vonatkoztatott százalékban.

| Azonosító | Tétel | Érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| T-DU-KOZ-VIL | Közcélú kisfeszültségű hálózatról táplált berendezés · világítás | 3% | ☐ | ☐ | |
| T-DU-KOZ-EGY | Közcélú kisfeszültségű hálózatról táplált berendezés · egyéb fogyasztó | 5% | ☐ | ☐ | |
| T-DU-SAJ-VIL | Saját kisfeszültségű táppontról táplált berendezés · világítás | 6% | ☐ | ☐ | |
| T-DU-SAJ-EGY | Saját kisfeszültségű táppontról táplált berendezés · egyéb fogyasztó | 8% | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (T-DU).

Megjegyzés a blokkhoz (forrás, kiadás):

### T-K – Állandók

Forrás: MSZ EN 60038 (U0); MSZ HD 60364-5-52:2011 G.52.2 (ρ1, λ); MSZ HD 60364-4-41:2007 411.4.4 (cmin); MSZ HD 60364-5-52:2011 524.1 (legkisebb keresztmetszet); MSZ EN 60898-1, MSZ EN 61009-1 (I2/In, m); MSZ HD 60364-4-43:2010 433.1 (Iz-szorzó)

A képletekben (2. rész) használt állandók. A forrásuk tételesen az F- és SZP- tételeknél ellenőrizhető.

**Kérdés a lektorhoz (T-K-CMIN).** A hatályos MSZ HD 60364-4-41 kiadás 411.4.4 pontja Zs · Ia ≤ U0 · Cmin alakú, Cmin = 0,95 értékkel? A program az MSZ HD 60364-4-41:2007 alakjának (Zs · Ia ≤ U0) megfelelően cmin = 1 értékkel számol. Ha igen: a tételt ✗-szel kérjük jelölni, helyes érték 0,95, és az F-LOOP tételnél a kiadás és a feltétel is javítandó.

**Kérdés a lektorhoz (T-K-I2).** A program a termékszabvány szerinti I2/In-t és a 433.1 (2) feltétel Iz-szorzóját ugyanazzal az egy értékkel (1,45) kezeli; ha a tétel javításakor a két szerep eltérő értéket kívánna, kérjük mindkettőt külön megadni.

| Azonosító | Tétel | Érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| T-K-U0 | Névleges fázis–föld feszültség, U0 | 230 V | ☐ | ☐ | |
| T-K-RHO1 | Réz fajlagos ellenállása üzemi hőmérsékleten, ρ1 (a feszültségeséshez és a hurokellenálláshoz is; lásd K-ZS) | 0,0225 Ω·mm²/m | ☐ | ☐ | |
| T-K-LAMBDA | Vezető fajlagos reaktanciája, λ | 0,00008 Ω/m (0,08 mΩ/m) | ☐ | ☐ | |
| T-K-CMIN | Feszültségtényező a hurokimpedancia-feltételben, cmin (a program képletének tényezője; lásd a kérdést és K-ZS) | 1 | ☐ | ☐ | |
| T-K-AMIN | Legkisebb keresztmetszet (réz, erősáramú és világítási áramkör) | 1,5 mm² | ☐ | ☐ | |
| T-K-I2 | k = I2 / In, két szerepben: (1) a kismegszakító és az RCBO megállapodás szerinti kioldóárama az In szorzójaként (termékszabvány); (2) ugyanez a szám a 433.1 (2) feltétel Iz-szorzója (I2 ≤ k · Iz) | 1,45 | ☐ | ☐ | |
| T-K-M-B | Pillanatkioldás felső határa, B jelleggörbe (m) | 5 · In | ☐ | ☐ | |
| T-K-M-C | Pillanatkioldás felső határa, C jelleggörbe (m) | 10 · In | ☐ | ☐ | |
| T-K-M-D | Pillanatkioldás felső határa, D jelleggörbe (m) | 20 · In | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (T-K).

Megjegyzés a blokkhoz (forrás, kiadás):

### F – Forrásmegjelölések

Forrás: A programban rögzített forrásmegjelölések (szabvány, kiadás, pont vagy táblázat)

A felületen és a PDF-ben a számítási sorok ezekre hivatkoznak. Ellenőrizendő a szabvány jelzete és kiadásának éve (ha már nem hatályos: ✗ és a hatályos kiadás), a pont- és táblázatszám, valamint a leírás – a leírás szövege (pl. a készülék megnevezése) a felületen is így jelenik meg.

| Azonosító | Szabvány (kiadás) | Hivatkozott pont / táblázat | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| F-PVC2 | MSZ HD 60364-5-52:2011 | B.52.2 táblázat – PVC, 2 terhelt ér, réz, 70 °C, 30 °C levegő | ☐ | ☐ | |
| F-PVC3 | MSZ HD 60364-5-52:2011 | B.52.4 táblázat – PVC, 3 terhelt ér, réz | ☐ | ☐ | |
| F-XLPE2 | MSZ HD 60364-5-52:2011 | B.52.3 táblázat – XLPE/EPR, 2 terhelt ér (a programban nincs rögzítve) | ☐ | ☐ | |
| F-XLPE3 | MSZ HD 60364-5-52:2011 | B.52.5 táblázat – XLPE/EPR, 3 terhelt ér (a programban nincs rögzítve) | ☐ | ☐ | |
| F-AMBIENT | MSZ HD 60364-5-52:2011 | B.52.14 táblázat – levegő-hőmérsékleti tényező | ☐ | ☐ | |
| F-GROUPING | MSZ HD 60364-5-52:2011 | B.52.17 táblázat, 1. sor – kötegelve, felületen, beágyazva vagy zártan | ☐ | ☐ | |
| F-METHODS | MSZ HD 60364-5-52:2011 | B.52.1 / A.52.3 táblázat – referencia szerelési módok | ☐ | ☐ | |
| F-MINSECTION | MSZ HD 60364-5-52:2011 | 524.1, 52.2 táblázat | ☐ | ☐ | |
| F-VOLTAGEDROP | MSZ HD 60364-5-52:2011 | 525, G melléklet (tájékoztató): G.52.1 határértékek, G.52.2 képlet, ρ1, λ | ☐ | ☐ | |
| F-OVERLOAD | MSZ HD 60364-4-43:2010 | 433.1 – Ib ≤ In ≤ Iz és I2 ≤ 1,45 · Iz | ☐ | ☐ | |
| F-MCB | MSZ EN 60898-1 | I2 = 1,45 · In; pillanatkioldás felső határa: B 5·In, C 10·In, D 20·In | ☐ | ☐ | |
| F-RCBO | MSZ EN 61009-1 | Kombinált védelem (RCBO): I2 = 1,45 · In; pillanatkioldás felső határa: B 5·In, C 10·In, D 20·In | ☐ | ☐ | |
| F-LOOP | MSZ HD 60364-4-41:2007 | 411.4.4 – Zs · Ia ≤ U0 (TN-rendszer), 41.1 táblázat | ☐ | ☐ | |
| F-VOLTAGE | MSZ EN 60038 | U0 = 230 V | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (F).

Megjegyzés a blokkhoz (forrás, kiadás):

### SZP – Számítási sorokban hivatkozott szabványpontok

Forrás: A programban rögzített rövid hivatkozások (a fenti forrásmegjelölések pontjai)

A számítási sorok végén álló rövid hivatkozások. Ellenőrizendő, hogy a pont a megadott szabályt tartalmazza.

| Azonosító | Mire vonatkozik | Hivatkozott pont | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| SZP-RHO1 | ρ1 (réz fajlagos ellenállása) a számítási sorban | G.52.2 · réz | ☐ | ☐ | |
| SZP-LAMBDA | λ (fajlagos reaktancia) a számítási sorban | G.52.2 | ☐ | ☐ | |
| SZP-CMIN | cmin és a hurokimpedancia-feltétel | 411.4.4 | ☐ | ☐ | |
| SZP-OVERLOAD | Túlterhelés-védelem: Ib ≤ In ≤ Iz és I2 ≤ 1,45 · Iz | 433.1 | ☐ | ☐ | |
| SZP-MINSECTION | Legkisebb keresztmetszet | 524.1 | ☐ | ☐ | |
| SZP-DROPLIMIT | Feszültségesés-határ | G.52.1 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (SZP).

Megjegyzés a blokkhoz (forrás, kiadás):

### L – Szerelésimód- és szigetelésleírások

Forrás: MSZ HD 60364-5-52:2011 – B.52.1 / A.52.3 táblázat – referencia szerelési módok

A felhasználó ezek közül választ; a leírásnak egyértelműen a szabvány szerinti referencia-szerelési módot kell azonosítania.

| Azonosító | Kód | Leírás a felületen | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| L-MOD-A1 | A1 | A1 – erek védőcsőben, hőszigetelt falban | ☐ | ☐ | |
| L-MOD-A2 | A2 | A2 – többeres kábel védőcsőben, hőszigetelt falban | ☐ | ☐ | |
| L-MOD-B1 | B1 | B1 – erek védőcsőben vagy kábelcsatornában, falon vagy falazatban | ☐ | ☐ | |
| L-MOD-B2 | B2 | B2 – többeres kábel védőcsőben vagy kábelcsatornában, falon vagy falazatban | ☐ | ☐ | |
| L-MOD-C | C | C – kábel falra rögzítve, vagy közvetlenül falazatba, vakolatba ágyazva | ☐ | ☐ | |
| L-SZIG-PVC | PVC | PVC (70 °C) | ☐ | ☐ | |
| L-SZIG-XLPE | XLPE | XLPE (90 °C) – jóváhagyásig PVC-értékkel | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (L).

Megjegyzés a blokkhoz (forrás, kiadás):

## 2. rész – Képletek és programozott döntések

A tételek a program képleteit, alapértékeit és döntéseit írják le kódolvasás nélkül. Mindegyikhez rövid indoklás és egy kézzel számolt példa tartozik; a példák számai az 1. rész értékeiből készülnek.

A tétel végén az „Összevetés” sor jelzi, hány esetet vet össze automatikus teszt a programmal: a képletfüggvényekkel, a kábeljelölés-értelmezővel, a bemeneti korlátokkal, illetve a program beépített mintatervének (Családi ház) végigszámolt áramköreivel („mintaterv-számítás”). Az összevetés csak a felsorolt esetekre vonatkozik, nem a szabály minden ágára; a szabály szövegét a lektor ítéli meg.

Ellenőrizendő: a képlet helyes-e, a feltételezés iránya (biztonság javára vagy kiemelt jelöléssel) elfogadható-e egy tervezői ellenőrzést segítő számításhoz, és a hivatkozott szabványpont helyes-e. Ahol „Kérdés a lektorhoz” áll, arra kérjük külön választ.

### K – Képletek

Forrás: MSZ HD 60364-4-43:2010; MSZ HD 60364-5-52:2011; MSZ HD 60364-4-41:2007

#### K-IB – Tervezett áram (Ib)

**Szabály.** Ib = P / (n · U0 · cos φ); n = 1 egyfázisú, n = 3 háromfázisú áramkörnél. Háromfázisnál ez a (szimmetrikusnak feltételezett) fázisáram, ami azonos a P / (√3 · U · cos φ) alakkal (U = √3 · U0).

**Indoklás.** A terhelés a tervben wattban adott; a túlterhelés-védelem vizsgálatához a fázisáram kell. A program a fázis–föld feszültséggel (T-K-U0) számol.

**Kézzel számolt példa.** Egyfázis, P = 3680 W, cos φ = 1: Ib = 3680 / (1 · 230 · 1) = 16 A. Háromfázis, P = 11 000 W, cos φ = 0,85: Ib = 11 000 / (3 · 230 · 0,85) = 18,76 A.

**Forrás.** MSZ HD 60364-4-43:2010 433.1 (1)

**Összevetés.** Programmal összevetve: igen – 3 eset (képlet, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| K-IB | ☐ | ☐ | |

#### K-IZ – Javított terhelhetőség (Iz)

**Szabály.** Iz = Iz0 · kθ · kcs. Iz0 a szerelési mód, a szigetelés, a terhelt erek száma (egyfázis: 2, háromfázis: 3) és a keresztmetszet szerinti táblázati érték (T-PVC2, T-PVC3) vagy projekt-felülírás (D-FELULIR), kθ a környezeti hőmérséklet (T-KT), kcs az együtt vezetett áramkörök száma szerinti tényező (T-KCS). A szorzatot a program nem kerekíti, csak a kijelzés kerekít két tizedesre.

**Indoklás.** A táblázati terhelhetőség a referencia-körülményekre (30 °C, egyetlen áramkör) vonatkozik; az eltérést a két tényező szorzata veszi figyelembe. A nullavezető terhelését a program nem vizsgálja (háromfázisnál 3 terhelt ér).

**Kézzel számolt példa.** B2, 2,5 mm², 2 terhelt ér, PVC: Iz0 = 23 A (T-PVC2-B2-2.5); 35 °C: kθ = 0,94 (T-KT-35); 3 áramkör: kcs = 0,7 (T-KCS-3). Iz = 23 · 0,94 · 0,7 = 15,134 A.

**Forrás.** MSZ HD 60364-5-52:2011 523; B.52.2, B.52.4, B.52.14, B.52.17

**Összevetés.** Programmal összevetve: igen – 2 eset (képlet, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| K-IZ | ☐ | ☐ | |

#### K-TUL – Túlterhelés-védelem: Ib ≤ In ≤ Iz

**Szabály.** Mindkét egyenlőtlenséget vizsgálja. Megadott terhelésnél Ib > In „Nem felel meg”, becsült terhelésnél „Figyelmeztetés” (D-BECSULT); In > Iz mindig „Nem felel meg”. Több szakasznál a legkisebb Iz-jű szakasz a mértékadó (D-SZAKASZ).

**Indoklás.** Az MSZ HD 60364-4-43 433.1 (1) feltétele. In a tervben megadott kismegszakító-névleges áram; állítható kioldót a program nem kezel.

**Kézzel számolt példa.** Az előző Iz = 15,13 A mellett B16 kismegszakító, P = 2300 W: Ib = 2300 / 230 = 10 A ≤ In = 16 A, és In = 16 A > Iz = 15,13 A → nem felel meg.

**Forrás.** MSZ HD 60364-4-43:2010 433.1 (1)

**Összevetés.** Programmal összevetve: igen – 3 eset (összehasonlítás, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| K-TUL | ☐ | ☐ | |

#### K-JAV – Javasolt keresztmetszet In > Iz esetén

**Szabály.** Ha In > Iz, a program javaslatként kiírja a legkisebb táblázati keresztmetszetet, amelynél In ≤ Iz0 · kθ · kcs ugyanazzal a szerelési móddal, szigeteléssel és terhelt érszámmal (projekt-felülírás esetén azzal, D-FELULIR); ha 35 mm²-ig nincs ilyen, keresztmetszetet nem javasol. A választás és az ellenőrzés a tervezőé.

**Indoklás.** A javaslat a K-IZ képlet visszafelé alkalmazása a táblázat lépcsőin; más feltételt (feszültségesés, hurokimpedancia) a javaslat nem vizsgál.

**Kézzel számolt példa.** Az előző áramkör (B2, 35 °C, 3 áramkör, kθ · kcs = 0,658), B16: 2,5 mm²: 23 · 0,658 = 15,13 A < 16 A; 4 mm²: 30 · 0,658 = 19,74 A ≥ 16 A → javaslat: 4 mm².

**Forrás.** MSZ HD 60364-4-43:2010 433.1 (1)

**Összevetés.** Programmal összevetve: igen – 2 eset (keresztmetszet-javaslat, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| K-JAV | ☐ | ☐ | |

#### K-I2 – A védelem működési árama: I2 ≤ 1,45 · Iz

**Szabály.** I2 = k · In ≤ k · Iz, ahol k = 1,45 (T-K-I2) mindkét helyen: kismegszakítónál és túláramvédelemmel egybeépített áram-védőkapcsolónál (RCBO) a termékszabvány szerinti I2/In, egyben a 433.1 (2) feltétel Iz-szorzója. A program a két szerepben ugyanazt az egy értéket használja, ezért a feltétel az In ≤ Iz-vel együtt teljesül vagy sérül; a program külön sorban is kiírja.

**Indoklás.** MSZ HD 60364-4-43:2010 433.1 (2); a megállapodás szerinti kioldóáram a termékszabvány (MSZ EN 60898-1, RCBO: MSZ EN 61009-1) szerint. Olvadóbiztosítót és állítható kioldót a program nem kezel (D-KESZ). Ha a T-K-I2 értéke változik, a program mindkét szerepben az új értéket használja.

**Kézzel számolt példa.** In = 16 A, Iz = 23 A: I2 = 1,45 · 16 = 23,2 A ≤ 1,45 · 23 = 33,35 A.

**Forrás.** MSZ HD 60364-4-43:2010 433.1 (2); MSZ EN 60898-1; MSZ EN 61009-1

**Összevetés.** Programmal összevetve: igen – 3 eset (összehasonlítás, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| K-I2 | ☐ | ☐ | |

#### K-DU1 – Feszültségesés, egyfázisú áramkör

**Szabály.** ΔU% = 2 · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100, ahol L a mértékadó hossz (m), I a számítási áram (Ib; becsült terhelésnél D-BECSULT), A a keresztmetszet (mm²), sin φ = √(1 − cos² φ).

**Indoklás.** G.52.2 szerinti képlet b = 2 tényezővel (oda- és visszavezető); ρ1: T-K-RHO1, λ: T-K-LAMBDA. A százalék U0-ra vonatkozik.

**Kézzel számolt példa.** L = 23,4 m, I = 16 A, A = 2,5 mm², cos φ = 1: ΔU = 2 · 23,4 · 16 · 0,0225 / 2,5 / 230 · 100 = 2,93%.

**Forrás.** MSZ HD 60364-5-52:2011 525, G.52.2

**Összevetés.** Programmal összevetve: igen – 2 eset (képlet, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| K-DU1 | ☐ | ☐ | |

#### K-DU3 – Feszültségesés, háromfázisú áramkör

**Szabály.** ΔU% = 1 · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100 (b = 1), ahol I a fázisáram. A százalék a fázis–föld feszültségre (U0) vonatkozik; szimmetrikus terhelésnél ez azonos a vonali feszültségre vonatkoztatott százalékkal.

**Indoklás.** G.52.2 szerint háromfázisú, szimmetrikus áramkörnél b = 1 (a nullavezetőn nincs esés). Aszimmetrikus terhelést a program nem vizsgál.

**Kézzel számolt példa.** L = 20 m, I = 18,76 A (K-IB), A = 4 mm², cos φ = 0,85, sin φ = 0,527: ΔU = 20 · 18,76 · (0,0225 · 0,85 / 4 + 0,00008 · 0,527) / 230 · 100 = 0,79%.

**Forrás.** MSZ HD 60364-5-52:2011 525, G.52.2

**Összevetés.** Programmal összevetve: igen – 2 eset (képlet, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| K-DU3 | ☐ | ☐ | |

#### K-DUOSSZ – Összesített feszültségesés és határ

**Szabály.** ΔU,össz = ΔU,elosztó előtt + Σ ΔU,szakasz ≤ ΔU,határ, ahol a határ a táplálás (közcélú hálózat / saját táppont) és a felhasználás (világítás / egyéb) szerinti érték (T-DU). Megadott terhelésnél a túllépés „Nem felel meg”, becsültnél „Figyelmeztetés”.

**Indoklás.** A határ a berendezés kezdőpontjától értendő; a fővezeték esését a felhasználó az elosztó beállításainál adhatja meg (0–10%), alapértéke 0% (D-ALAP-TAP).

**Kézzel számolt példa.** ΔU = 2,93% (K-DU1), elosztó előtt 1,5%: 4,43% ≤ 5% (közcélú, egyéb) → megfelel; világítási áramkörnél: 4,43% > 3% → nem felel meg.

**Forrás.** MSZ HD 60364-5-52:2011 525, G.52.1

**Összevetés.** Programmal összevetve: igen – 3 eset (mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| K-DUOSSZ | ☐ | ☐ | |

#### K-LMAX – Megengedhető legnagyobb hossz (javaslat)

**Szabály.** Túllépésnél javaslat: L,max = (ΔU,határ − ΔU,elosztó előtt) / 100 · U0 / (b · I · (ρ1 · cos φ / A + λ · sin φ)), 0,1 m-re lefelé kerekítve; vegyes keresztmetszetnél a legkisebbel.

**Indoklás.** A K-DU1/K-DU3 képlet átrendezése; a lefelé kerekítés és a legkisebb keresztmetszet a kedvezőtlen irány.

**Kézzel számolt példa.** Világítás, határ 3%, elosztó előtt 0%, I = 10 A, A = 1,5 mm², cos φ = 1: L,max = 0,03 · 230 / (2 · 10 · 0,0225 / 1,5) = 23 m; elosztó előtt 1%: (3 − 1) / 100 · 230 / (2 · 10 · 0,0225 / 1,5) = 15,333 → 15,3 m.

**Forrás.** MSZ HD 60364-5-52:2011 G.52.2

**Összevetés.** Programmal összevetve: igen – 2 eset (képlet, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| K-LMAX | ☐ | ☐ | |

#### K-ZS – Hurokimpedancia (TN-rendszer)

**Szabály.** Ha az elosztónál a Zs meg van adva (0,01–20 Ω) és a rendszer TN: Zs = Zs,elosztó + ρ1 · L · (1/A + 1/A_PE) ≤ Zs,max = cmin · U0 / (m · In), ahol m a jelleggörbe szerinti pillanatkioldási szorzó (T-K-M-B, T-K-M-C, T-K-M-D), A_PE = A (D-PE).

**Indoklás.** MSZ HD 60364-4-41:2007 411.4.4 (F-LOOP): Zs · Ia ≤ U0, ahol Ia = m · In a pillanatkioldás felső határa (így a kikapcsolási idő teljesül). A program képlete a jobb oldalt a cmin tényezővel szorozza (Zs · m · In ≤ cmin · U0; T-K-CMIN = 1); 1-gyel ez a fenti alakkal azonos. A vezeték ellenállását ugyanazzal a ρ1-gyel számolja, mint a feszültségesést (T-K-RHO1, a G.52.2 szerinti üzemi hőmérsékleti érték), reaktancia és zárlati melegedés szerinti korrekció nélkül. Zs nélkül vagy TT-rendszerben az ellenőrzés „Nem vizsgált”.

**Kézzel számolt példa.** Mintaterv „Nappali dugaljak” (c1): Zs,elosztó = 0,35 Ω, L = 23,4 m, A = 2,5 mm²: Zs = 0,35 + 0,0225 · 23,4 · (1/2,5 + 1/2,5) = 0,35 + 0,4212 = 0,7712 Ω. B16: Zs,max = 1 · 230 / (5 · 16) = 2,875 Ω → megfelel; C16: 1,4375 Ω → megfelel.

**Kérdés a lektorhoz.** 1) A hatályos MSZ HD 60364-4-41 kiadás szerint a feltétel Zs · Ia ≤ U0 · Cmin, Cmin = 0,95? Ha igen: T-K-CMIN ✗, helyes érték 0,95, és az F-LOOP kiadása is javítandó. 2) Elfogadható-e a hurokellenálláshoz a feszültségeséshez megadott G.52.2 szerinti ρ1 (T-K-RHO1), zárlati melegedés szerinti korrekció nélkül? Ha nem, kérjük a helyes értéket vagy módszert megadni.

**Forrás.** MSZ HD 60364-4-41:2007 411.4.4; MSZ EN 60898-1

**Összevetés.** Programmal összevetve: igen – 9 eset (képlet, mintaterv-számítás, bemeneti korlát), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| K-ZS | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (K).

Megjegyzés a blokkhoz (forrás, kiadás):

### D-ALAP – Alapértékek (ha a felhasználó nem ad meg adatot)

Forrás: Programozott alapértékek; a felület mindegyiket a „Feltételezések” listán jelzi

A kiemelt feltételezések nem a biztonság javára közelítenek; ezeket a felület és a PDF külön jelöli, és a tényleges érték megadását kéri.

#### D-ALAP-MOD – Alapérték: szerelési mód B2

**Szabály.** Ha sem az áramkörnél, sem a projektben nincs megadva, a szerelési mód B2 – falon belüli és falon kívüli nyomvonalon, valamint nyomvonal nélküli áramkörnél egyaránt. Falon belüli nyomvonalnál ez kiemelt (nem a biztonság javára közelítő) feltételezésként jelenik meg. Elsőbbség: áramköri érték (minden szakaszra) → projekt-alapérték (falon belüli / falon kívüli nyomvonalra külön) → B2.

**Indoklás.** Lakóépületben a falban, védőcsőben vezetett többeres kábel a jellemző; hőszigetelt falban (A1, A2) kisebb a terhelhetőség, ezért a feltételezés kiemelt.

**Kézzel számolt példa.** 2,5 mm², 2 terhelt ér: B2 → Iz0 = 23 A; A1 → 19,5 A; A2 → 18,5 A. B16-tal: 16 ≤ 23 (B2), 16 ≤ 18,5 (A2).

**Forrás.** MSZ HD 60364-5-52:2011 – B.52.1 / A.52.3 táblázat – referencia szerelési módok

**Összevetés.** Programmal összevetve: igen – 4 eset (mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-ALAP-MOD | ☐ | ☐ | |

#### D-ALAP-SZIG – Alapérték: PVC szigetelés (70 °C)

**Szabály.** Elsőbbség: áramkörnél megadott → a kábeljelölésből felismert (D-JEL) → projekt-alapérték → PVC, 70 °C. A PVC alapérték kiemelt feltételezés.

**Indoklás.** A PVC 70 °C a lakásban jellemző. A 60 °C-os (gumiszigetelésű) vezeték terhelhetősége kisebb; ezt a program nem számolja (D-BLOKK).

**Kézzel számolt példa.** „NYM-J 3x2,5” → PVC; „N2XH 3×4” → XLPE (D-XLPE szerint PVC-értékkel); „3 × 2,5 mm²” → nem ismerhető fel → PVC (alapérték, kiemelt feltételezés).

**Forrás.** MSZ HD 60364-5-52:2011 – B.52.2 táblázat – PVC, 2 terhelt ér, réz, 70 °C, 30 °C levegő

**Összevetés.** Programmal összevetve: igen – 6 eset (kábeljelölés, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-ALAP-SZIG | ☐ | ☐ | |

#### D-ALAP-TEMP – Alapérték: környezeti hőmérséklet 30 °C

**Szabály.** Ha nincs megadva, 30 °C (kθ = 1), kiemelt feltételezésként. Megadható 10–60 °C között, egész fokban; áramkörönként egy érték, minden szakaszra (D-SZAKASZ).

**Indoklás.** 30 °C a táblázatok referencia-hőmérséklete; melegebb környezetben (padlás, kazánház) kisebb a terhelhetőség.

**Kézzel számolt példa.** 30 °C → kθ = 1; 40 °C → kθ = 0,87: B2, 2,5 mm²: Iz = 23 · 0,87 = 20,01 A.

**Forrás.** MSZ HD 60364-5-52:2011 – B.52.14 táblázat – levegő-hőmérsékleti tényező

**Összevetés.** Programmal összevetve: igen – 8 eset (táblázati lépcső, mintaterv-számítás, bemeneti korlát), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-ALAP-TEMP | ☐ | ☐ | |

#### D-ALAP-CSOP – Alapérték: 1 áramkör (nincs csoportosítás)

**Szabály.** Ha nincs megadva, az együtt vezetett terhelt áramkörök száma 1 (kcs = 1), kiemelt feltételezésként. Megadható 1–20 között, egész számként; áramkörönként egy érték, minden szakaszra (D-SZAKASZ). Csak a táblázat 1. sora (kötegelve, felületen, beágyazva vagy zártan) használható; más elrendezést (egy rétegben falon, kábeltálcán) a program nem kínál.

**Indoklás.** Az 1. sor a lakóépületben jellemző, legkedvezőtlenebb elrendezés; más elrendezéshez kedvezőbb tényező tartozna, így ez a biztonság javára téved. Az 1 áramkör alapérték viszont nem a biztonság javára közelít, ezért kiemelt.

**Kézzel számolt példa.** 4 áramkör közös védőcsőben: kcs = 0,65; B2, 2,5 mm²: Iz = 23 · 0,65 = 14,95 A < 16 A (B16) → nem felel meg.

**Forrás.** MSZ HD 60364-5-52:2011 – B.52.17 táblázat, 1. sor – kötegelve, felületen, beágyazva vagy zártan

**Összevetés.** Programmal összevetve: igen – 8 eset (táblázati lépcső, mintaterv-számítás, bemeneti korlát), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-ALAP-CSOP | ☐ | ☐ | |

#### D-ALAP-COS – Alapérték: cos φ = 1

**Szabály.** Megadott terhelésnél a cos φ alapértéke 1, kiemelt feltételezésként; megadható 0,5–1 között. Becsült terhelésnél is 1.

**Indoklás.** Ohmos terhelésnél pontos; induktív terhelésnél nagyobb a valós áram, és a λ-tag miatt a feszültségesés is.

**Kézzel számolt példa.** P = 2300 W: cos φ = 1 → Ib = 10 A; cos φ = 0,8 → Ib = 2300 / (230 · 0,8) = 12,5 A.

**Forrás.** MSZ HD 60364-4-43:2010 433.1 (1)

**Összevetés.** Programmal összevetve: igen – 7 eset (képlet, mintaterv-számítás, bemeneti korlát), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-ALAP-COS | ☐ | ☐ | |

#### D-ALAP-FELH – Alapérték: felhasználás (világítás / egyéb)

**Szabály.** A feszültségesés-határhoz: ha az áramkörhöz lámpakiállás tartozik → világítás, különben egyéb (kiemelt feltételezés). Az áramkörnél felülírható.

**Indoklás.** Lámpát is tartalmazó áramkörre a szigorúbb világítási határ vonatkozik; lámpa nélküli áramkörnél az „egyéb” az enyhébb határ, ezért kiemelt.

**Kézzel számolt példa.** Közcélú hálózat: dugaljáramkör → 5% (T-DU-KOZ-EGY); lámpakiállást is tartalmazó áramkör → 3% (T-DU-KOZ-VIL).

**Forrás.** MSZ HD 60364-5-52:2011 G.52.1

**Összevetés.** Programmal összevetve: igen – 3 eset (mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-ALAP-FELH | ☐ | ☐ | |

#### D-ALAP-TAP – Alapérték: közcélú táplálás, TN, 0% elosztó előtti esés

**Szabály.** Táplálás: közcélú kisfeszültségű hálózat; földelési rendszer: TN; az elosztó előtti (fővezeték) feszültségesés 0% (kiemelt feltételezés), megadható 0–10% között.

**Indoklás.** Lakóépületnél a közcélú hálózatról táplálás a jellemző. A fővezeték esése a tervből nem számolható; 0%-kal a teljes keret az áramkörre jut, ami nem a biztonság javára közelít.

**Kézzel számolt példa.** Saját táppont választásakor a határ 6% (világítás) / 8% (egyéb); 1,5% elosztó előtti eséssel egy 5%-os keretből 3,5% marad az áramkörre.

**Forrás.** MSZ HD 60364-5-52:2011 G.52.1; MSZ HD 60364-4-41:2007 411.4.4

**Összevetés.** Programmal összevetve: igen – 8 eset (mintaterv-számítás, bemeneti korlát), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-ALAP-TAP | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (D-ALAP).

Megjegyzés a blokkhoz (forrás, kiadás):

### D-JEL – Kábeljelölés-felismerés

Forrás: Programozott döntés (a kábeljelölés értelmezése)

A kábeljelölésből a program a szigetelést és a vezetőanyagot az alábbi kulcsszavak alapján ismeri fel. A kulcsszó önálló szóként (kis- és nagybetűtől függetlenül) számít, a „…” tetszőleges folytatást jelöl (pl. NYM-J, NYM-O). Ellenőrizendő, hogy a besorolás helyes-e, és hiányzik-e gyakori jelölés. Minden sor néhány példáját automatikus teszt veti össze a programmal.

| Azonosító | Kulcsszó a jelölésben | Besorolás | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| D-JEL-AL | Al, alu, alumínium, aluminium, NAYY…, NA2X…, AYKY…, AMKA | alumínium → „Nem számítható” (D-BLOKK) | ☐ | ☐ | |
| D-JEL-GUMI | H03R…, H05R…, H07R… (RN, RR, RT; szóközzel vagy kötőjellel is: H07 RN-F, H07-RN-F), RN-F, GT, gumi… (szó elején, ékezetes folytatással is: gumis, gumikábel, gumiszigetelésű, gumitömlő, Gumi-kábel); nem számít a tartozékszó: gumicső, gumitömítés, gumialátét, gumigyűrű, gumidugó, gumiszalag | gumiszigetelés (60 °C) → „Nem számítható” (D-BLOKK); minden más „gumi…” szó (pl. „Gumi Kft.” cégnév) is – a biztonság javára | ☐ | ☐ | |
| D-JEL-XLPE | N2X…, 2XY, XLPE, EPR | XLPE (90 °C; D-XLPE szerint PVC-értékkel) | ☐ | ☐ | |
| D-JEL-PVC | NYM…, NYY…, NYCWY, MBCu, MCu, MKCu, MT, MYY, YKY…, CYKY…, H03V…, H05V…, H07V…, PVC | PVC (70 °C) | ☐ | ☐ | |
| D-JEL-NINCS | Más vagy hiányzó jelölés (pl. NHXH, „3 × 2,5 mm²”) | nem ismerhető fel → áramköri, majd projekt-alapérték, végül PVC (D-ALAP-SZIG) | ☐ | ☐ | |
| D-JEL-SORREND | Több kulcsszó egy jelölésben | az első egyező: alumínium, gumi, XLPE, PVC | ☐ | ☐ | |

Programmal összevetve: igen – 58 eset (kábeljelölés), automatikus tesztben.

☐ A blokk minden tétele egyezik (D-JEL).

Megjegyzés a blokkhoz (forrás, kiadás):

### D – Programozott döntések

Forrás: Programozott döntések (kerekítés, tartalék, korlátok, állapotok)

#### D-KEREK – Lépcsőre kerekítés iránya

**Szabály.** Táblázati lépcsők közötti bemenetnél a program a kedvezőtlenebb lépcsőt választja, interpoláció nélkül: környezeti hőmérséklet → a következő nagyobb vagy egyenlő lépcső (T-KT), áramkörszám → a következő nagyobb vagy egyenlő oszlop (T-KCS). A számított értékeket (Ib, Iz, ΔU, Zs) nem kerekíti; a kijelzés 2, Zs-nél 3 tizedes. A megengedett hurokimpedancia (Zs,max) kijelzése lefelé kerekít (a számítási sorban 3, az összesítő táblában 2 tizedesre), így a kiírt határ soha nem nagyobb a valódinál; ha a kerekített kiírás a feltétellel ellentétes viszonyt mutatna, több tizedes jelenik meg.

**Indoklás.** A nagyobb hőmérséklethez és áramkörszámhoz kisebb tényező tartozik, így a kerekítés a biztonság javára téved. A bemenet korlátai (10–60 °C, 1–20 áramkör) miatt a táblázat széle nem léphető túl.

**Kézzel számolt példa.** 33 °C → 35 °C → kθ = 0,94; 10 áramkör → 12 → kcs = 0,45.

**Forrás.** MSZ HD 60364-5-52:2011 – B.52.14 táblázat – levegő-hőmérsékleti tényező; MSZ HD 60364-5-52:2011 – B.52.17 táblázat, 1. sor – kötegelve, felületen, beágyazva vagy zártan

**Összevetés.** Programmal összevetve: igen – 3 eset (táblázati lépcső, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-KEREK | ☐ | ☐ | |

#### D-XLPE – XLPE: PVC-tartalék és a 30 °C alatti korlát

**Szabály.** Amíg az XLPE-táblázat nincs rögzítve (T-XLPE), XLPE kábelnél a program a PVC Iz0-val és a PVC kθ-sorral számol, de 30 °C alatt a kθ-t 1-re korlátozza; erről feltételezés-sor jelenik meg. Projekt-felülírt XLPE Iz0 mellett is ez a korlátozott kθ érvényes (D-FELULIR).

**Indoklás.** A PVC Iz0 kisebb az XLPE-énél, és 30 °C felett a PVC kθ is kisebb – ez a biztonság javára téved. 30 °C alatt viszont a PVC kθ nagyobb lenne az XLPE-énél, ezért ott 1-gyel számol. Ha az XLPE-sorokat kitöltik, a korlátozás magától megszűnik.

**Kézzel számolt példa.** XLPE, 25 °C: a PVC-sor 1,06 értéke helyett kθ = 1; XLPE, 40 °C: kθ = 0,87 (PVC-sor). XLPE, B2, 2,5 mm², 2 terhelt ér: Iz0 = 23 A (PVC-érték).

**Forrás.** MSZ HD 60364-5-52:2011 – B.52.3 táblázat – XLPE/EPR, 2 terhelt ér (a programban nincs rögzítve); MSZ HD 60364-5-52:2011 – B.52.14 táblázat – levegő-hőmérsékleti tényező

**Összevetés.** Programmal összevetve: igen – 3 eset (táblázati lépcső, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-XLPE | ☐ | ☐ | |

#### D-BLOKK – Nem kezelt kábelek; helyettesítés a másik forrás kábelével

**Szabály.** A program csak rézvezetős, PVC- vagy XLPE-szigetelésű, azonos keresztmetszetű erekből álló kábelt számol, 1,5–35 mm² között. Szakaszonként a nyomvonal kábeljelölése érvényes; ha az nem értelmezhető vagy üres, az áramköré (és fordítva). Nem helyettesít, hanem „Nem számítható” lesz, ha bármelyik forrás (áramkör vagy nyomvonal) kábele alumínium (D-JEL-AL), gumiszigetelésű (D-JEL-GUMI), csökkentett N/PE-erű (pl. 3x25+16, 3x2,5/1,5) vagy 35 mm² feletti keresztmetszetű. Más értelmezhetetlen jelölésnél – nem szabványos keresztmetszet (pl. 3 mm²), ellentmondó vagy keresztmetszet nélküli jelölés – a program a másik forrás értelmezhető kábelével számol, „Figyelmeztetés” mellett; ha egyik forrás sem értelmezhető, „Nem számítható”. Üres nyomvonal-jelölésnél figyelmeztetés nélkül az áramkör kábelével számol. A 0,5–1 mm² értelmezhető, de a legkisebb keresztmetszet ellenőrzésén elbukik (D-MINKM).

**Indoklás.** A táblázatok csak rézre, 70 °C-os (PVC) vezetőre és a fenti tartományra érvényesek; csökkentett PE-nél a hurokszámítás A_PE = A feltételezése (D-PE) nem állna meg. Ilyen kábelnél a másik forrás (réz) kábelével számolni más vezetőről szólna, ezért a program megáll. Elírásnak tekinthető jelölésnél (pl. 3 mm²) a másik forrás adata a valószínű, de a figyelmeztetés ellenőrzést kér.

**Kézzel számolt példa.** „NAYY 4x16” → alumínium; „H07RN-F 3G2,5” → gumiszigetelés; „3 × 2,5 + 1 × 1,5” → csökkentett ér; „3 × 50 mm²” → túl nagy keresztmetszet: mind „Nem számítható”. Mintaterv „Nappali dugaljak” (c1, 3 × 2,5 mm²): ha a nyomvonalé „3 × 3 mm²” (nem szabványos), a program az áramkör kábelével számol (Iz = 23 A, „Figyelmeztetés”); ha mindkettő „3 × 3 mm²”, „Nem számítható”; ha a nyomvonalé „NAYY 3x2,5”, „Nem számítható”.

**Forrás.** MSZ HD 60364-5-52:2011 – B.52.2 táblázat – PVC, 2 terhelt ér, réz, 70 °C, 30 °C levegő; MSZ HD 60364-5-52:2011 – 524.1, 52.2 táblázat

**Összevetés.** Programmal összevetve: igen – 16 eset (kábeljelölés, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-BLOKK | ☐ | ☐ | |

#### D-MINKM – Legkisebb keresztmetszet minden áramkörre

**Szabály.** Minden áramkörre (erősáramú és világítási) a legkisebb rézkeresztmetszet 1,5 mm² (T-K-AMIN); kisebbnél „Nem felel meg”. Jelző- és vezérlőáramkört a program nem különböztet meg.

**Indoklás.** A tervező áramkörei erősáramú és világítási áramkörök; a jelzőáramkörökre vonatkozó kisebb érték itt nem alkalmazható.

**Kézzel számolt példa.** „2 × 0,75” → A = 0,75 mm² < 1,5 mm² → nem felel meg; „3 × 1,5” → megfelel.

**Forrás.** MSZ HD 60364-5-52:2011 – 524.1, 52.2 táblázat

**Összevetés.** Programmal összevetve: igen – 4 eset (összehasonlítás, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-MINKM | ☐ | ☐ | |

#### D-SZAKASZ – Több nyomvonalszakasz

**Szabály.** Az áramkörhöz rendelt nyomvonalak szakaszonként számítanak: kábel = a nyomvonal értelmezhető kábeljelölése, különben az áramköré (D-BLOKK); Iz = a szakaszok legkisebb Iz-je (mértékadó szakasz); ΔU és Zs = a szakaszok összege a saját keresztmetszetükkel. Ha a mértékadó hossz meg van adva, az egész hosszt a legkisebb keresztmetszettel számolja. A környezeti hőmérséklet és a csoportszám áramkörönként egyetlen érték, és minden szakaszra érvényes (a kθ szakaszonként csak a szigetelés miatt térhet el, D-XLPE); a szerelési mód szakaszonként a nyomvonal falon belüli / falon kívüli jellege szerinti projekt-alapérték, áramköri megadásnál minden szakaszra ugyanaz.

**Indoklás.** A soros szakaszok esései összeadódnak, a terhelhetőséget a leggyengébb szakasz korlátozza. Megadott hossznál a szakaszok aránya nem ismert, ezért a legkisebb keresztmetszet a kedvezőtlen eset. A szakaszonként eltérő környezetet (pl. egy rövid padlásszakasz) a program nem kezeli: ilyenkor az egész áramkörre a kedvezőtlenebb hőmérsékletet és csoportszámot kell megadni.

**Kézzel számolt példa.** 10 m 2,5 mm² + 5 m 1,5 mm², I = 10 A, cos φ = 1: ΔU = 2 · 10 · 10 · 0,0225 / 2,5 / 230 · 100 + 2 · 5 · 10 · 0,0225 / 1,5 / 230 · 100 = 0,78% + 0,65% = 1,43%; megadott 15 m hossznál: 2 · 15 · 10 · 0,0225 / 1,5 / 230 · 100 = 1,96%.

**Forrás.** MSZ HD 60364-5-52:2011 G.52.2

**Összevetés.** Programmal összevetve: igen – 6 eset (képlet, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-SZAKASZ | ☐ | ☐ | |

#### D-FELULIR – Projekt-felülírás (saját Iz0)

**Szabály.** A projektben szerelési mód, szigetelés, terhelt érszám és keresztmetszet szerint saját Iz0 adható meg (pl. gyártói adat), 1–1000 A között, kötelező, legalább 3 karakteres forrásmegjegyzéssel. Ha van ilyen, a program a táblázati érték helyett ezt használja (elsőbbség: felülírás → táblázat), és a kθ és a kcs erre is rászorzódik: Iz = Iz0,felülírt · kθ · kcs. A számítási sorban „projekt-felülírás” állapotú forrásként jelenik meg a megjegyzéssel. A keresztmetszet-javaslat (K-JAV) is a felülírt értékkel számol. XLPE felülírásnál a kθ a D-XLPE szerinti korlátozott PVC-sor.

**Indoklás.** A felülírt érték a tervező döntése és felelőssége; a program nem vizsgálja, milyen körülményekre vonatkozik. Ha a gyártói érték már tartalmaz környezeti vagy csoportosítási csökkentést, a kθ és a kcs ismételt alkalmazása a biztonság javára téved (kisebb Iz). Kérjük megítélni, hogy ez a viselkedés és a jelölés elfogadható-e.

**Kézzel számolt példa.** B2, PVC, 2 terhelt ér, 2,5 mm² felülírva 30 A-re („gyártói adatlap”), 40 °C, 3 áramkör: Iz = 30 · 0,87 · 0,7 = 18,27 A (táblázattal: 23 · 0,87 · 0,7 = 14,007 A). B16-hoz a keresztmetszet-javaslat felülírással 2,5 mm², nélküle 4 mm².

**Forrás.** Programozott döntés; a felülírás forrása a tervező által megadott adat

**Összevetés.** Programmal összevetve: igen – 12 eset (képlet, keresztmetszet-javaslat, mintaterv-számítás, bemeneti korlát), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-FELULIR | ☐ | ☐ | |

#### D-HOSSZ – Mértékadó hossz

**Szabály.** A mértékadó hossz az áramkörhöz rendelt alaprajzi nyomvonalak soros összege (vízszintes hossz + a két végpont fel-/leállása, ráhagyás nélkül), vagy a felhasználó által megadott hossz (0,1–1000 m). Ha egyik nyomvonal sem csatlakozik az elosztó jeléhez, vagy az áramkör több szinten fut: „Figyelmeztetés”; nyomvonal és megadott hossz nélkül „Nem számítható”.

**Indoklás.** A feszültségesés és a hurokimpedancia a hosszal arányos; elágazó nyomvonalnál a soros összeg felülbecsül (a biztonság javára), a hiányos hosszra figyelmeztet.

**Kézzel számolt példa.** Mintaterv „Nappali dugaljak” (c1): vízszintes 20 m, fel-/leállás (2,6 − 1,5) + (2,6 − 0,3) = 3,4 m → L = 23,4 m.

**Forrás.** MSZ HD 60364-5-52:2011 525

**Összevetés.** Programmal összevetve: igen – 8 eset (mintaterv-számítás, bemeneti korlát), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-HOSSZ | ☐ | ☐ | |

#### D-BECSULT – Becsült terhelés

**Szabály.** Ha az áramkörnél nincs megadott terhelés, a program a hozzárendelt szerelvényekből becsül (dugalj 200 W, kettős dugalj 400 W, lámpakiállás 100 W). Ilyenkor Ib > In csak „Figyelmeztetés”; a feszültségesést max(In; Ib,becsült) árammal számolja; becsülhető szerelvény nélkül (0 W) az Ib ≤ In „Nem vizsgált”.

**Indoklás.** A becslés nem tervezői adat, ezért nem minősít „Nem felel meg”-nek; a feszültségesésnél az In a kedvezőtlen eset.

**Kézzel számolt példa.** Mintaterv „Nappali dugaljak” (c1: kettős dugalj + dugalj + kötődoboz, B16, terhelés nincs megadva): P ≈ 600 W, Ib ≈ 600 / 230 = 2,61 A; a feszültségeséshez I = max(16; 2,61) = 16 A.

**Forrás.** MSZ HD 60364-4-43:2010 433.1 (1)

**Összevetés.** Programmal összevetve: igen – 3 eset (képlet, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-BECSULT | ☐ | ☐ | |

#### D-PE – Hurokszámítás: A_PE = A, reaktancia nélkül

**Szabály.** A hurokszámításban a védővezető keresztmetszete azonos a fázisvezetőével (A_PE = A); a vezeték reaktanciáját a program elhanyagolja; a Zs,elosztó a felhasználó által megadott (mért vagy szolgáltatói) érték.

**Indoklás.** Csökkentett PE-erű kábelt a program nem számol (D-BLOKK), így azonos keresztmetszetű kábelnél az A_PE = A pontos. A reaktancia elhanyagolását a lektor ítélje meg a kezelt (legfeljebb 35 mm²-es) tartományban.

**Kézzel számolt példa.** L = 10 m, A = 2,5 mm²: 0,0225 · 10 · (1/2,5 + 1/2,5) = 0,18 Ω. (1,5 mm²-es PE-vel 0,24 Ω lenne – ezért nem számolja a csökkentett PE-erű kábelt.)

**Forrás.** MSZ HD 60364-4-41:2007 411.4.4

**Összevetés.** Programmal összevetve: igen – 2 eset (képlet, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-PE | ☐ | ☐ | |

#### D-KESZ – Védelmi készülék: kismegszakító vagy RCBO

**Szabály.** A védelem az áramkörhöz rendelt kismegszakító (MCB) vagy túláramvédelemmel egybeépített áram-védőkapcsoló (RCBO) modul (a felületen „kombinált védelem (RCBO)”; a szabatos megnevezést az F-RCBO tételnél lehet javítani); ha nincs ilyen modul, MSZ EN 60898-1 szerinti kismegszakítót feltételez (feltételezés-sor). RCBO-nál a forrás MSZ EN 61009-1, az értékek (I2 = 1,45 · In; m = 5 / 10 / 20) a kismegszakítóéval azonosak. Olvadóbiztosítót és állítható kioldót a program nem kezel.

**Indoklás.** Lakáselosztóban a végáramkörök védelme jellemzően kismegszakító vagy RCBO; a két termékszabvány a vizsgált jellemzőkben azonos.

**Kézzel számolt példa.** C16 RCBO: I2 = 1,45 · 16 = 23,2 A; Zs,max = 1 · 230 / (10 · 16) = 1,4375 Ω (mint C16 kismegszakítónál).

**Forrás.** MSZ EN 60898-1 – I2 = 1,45 · In; pillanatkioldás felső határa: B 5·In, C 10·In, D 20·In; MSZ EN 61009-1 – Kombinált védelem (RCBO): I2 = 1,45 · In; pillanatkioldás felső határa: B 5·In, C 10·In, D 20·In

**Összevetés.** Programmal összevetve: igen – 3 eset (mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-KESZ | ☐ | ☐ | |

#### D-AVK – Hurok-túllépés áram-védőkapcsolóval védett áramkörnél; TT-rendszer

**Szabály.** Ha Zs > Zs,max, és az áramkörhöz bármilyen áram-védőkapcsoló (ÁVK, FI-relé) hozzá van rendelve (az áramkör ÁVK-mezője nem üres), vagy a védelem RCBO, az eredmény „Figyelmeztetés”; egyébként „Nem felel meg”. Az ÁVK érzékenységét (IΔn) és típusát a program nem vizsgálja, és a 411.4.4 ÁVK-ra vonatkozó feltételét (Ia = az ÁVK kioldását okozó áram) sem számolja. TT-rendszerben a hurokellenőrzés nem készül („Nem vizsgált”).

**Indoklás.** MSZ HD 60364-4-41:2007 411.3 / 411.4.4: ÁVK-val a kikapcsolási feltétel más módon is teljesülhet; ennek igazolása a tervező feladata, ezért a program csak figyelmeztet. TT-rendszerben a földelési ellenállás a mértékadó, ezt a program nem vizsgálja.

**Kézzel számolt példa.** Mintaterv c1, C16, Zs,elosztó = 1,2 Ω: Zs = 1,2 + 0,4212 = 1,6212 Ω > Zs,max = 1,4375 Ω → ÁVK nélkül nem felel meg; bármely hozzárendelt ÁVK-val vagy RCBO-val – érzékenységétől függetlenül – figyelmeztetés.

**Forrás.** MSZ HD 60364-4-41:2007 411.4.4

**Összevetés.** Programmal összevetve: igen – 4 eset (mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-AVK | ☐ | ☐ | |

#### D-EREK – Erek száma

**Szabály.** Egyfázisnál legalább 3 ér (L, N, PE), háromfázisnál 5 ér (L1, L2, L3, N, PE); kevesebb érnél „Figyelmeztetés” (N nélküli háromfázisú fogyasztónál 4 ér is elegendő lehet). Egyerű vezetékeknél (pl. MCu) nem ellenőrizhető („Nem vizsgált”).

**Indoklás.** Az érszám a kábeljelölésből nem mindig egyértelmű, és N nélküli háromfázisú fogyasztó is lehet, ezért a program csak figyelmeztet.

**Kézzel számolt példa.** Egyfázis, „2 × 2,5”: 2 ér < 3 → figyelmeztetés; háromfázis, „4 × 4”: 4 ér < 5 → figyelmeztetés.

**Forrás.** – (programozott ellenőrzés, szabványpont nélkül)

**Összevetés.** Programmal összevetve: igen – 4 eset (mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-EREK | ☐ | ☐ | |

#### D-TURES – Összehasonlítás tűréssel

**Szabály.** Határérték-összehasonlításnál a ≤ b akkor is teljesül, ha a ≤ b + 10⁻⁹ · max(1, |b|). Ha a kétjegyű kijelzés egyenlőséget mutatna, de a feltétel nem teljesül, a két oldal több tizedessel jelenik meg (pl. „63,001 > 63”).

**Indoklás.** A lebegőpontos számábrázolás miatt a pontos egyenlőség is teljesüljön (90 · 0,7 a gépben 62,99999999999999); a tűrés a táblázatértékek pontosságánál nagyságrendekkel kisebb.

**Kézzel számolt példa.** Iz = 90 · 0,7 = 63 A, In = 63 A → teljesül (63 ≤ 63); In = 63,001 A → nem teljesül.

**Forrás.** – (programozott döntés)

**Összevetés.** Programmal összevetve: igen – 2 eset (összehasonlítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-TURES | ☐ | ☐ | |

#### D-ALLAPOT – Állapotok és az eredmény címkéje

**Szabály.** Ellenőrzésenként öt állapot: „Rendben”, „Figyelmeztetés”, „Nem felel meg”, „Nem számítható”, „Nem vizsgált”. Az áramkör eredménye a vizsgált ellenőrzések legrosszabb állapota, ebben a sorrendben: Nem felel meg > Nem számítható > Figyelmeztetés > Rendben; a „Nem vizsgált” ellenőrzés az eredményt nem rontja. Az eredmény címkéje: „Számítás szerint megfelel”, „Figyelmeztetés”, „Nem felel meg” vagy „Nem számítható”. A „Számítás szerint megfelel” címke kiegészül: „– feltételezésekkel”, ha bármely feltételezés-sor megjelenik (alapérték, D-ALAP; XLPE-tartalék, D-XLPE; feltételezett kismegszakító, D-KESZ; A_PE = A, D-PE; becsült terhelés, D-BECSULT); „nem vizsgált: …”, ha az Ib ≤ In (terhelés nélkül) vagy a hurokimpedancia (Zs nélkül vagy TT-rendszerben) nem készült. Más nem vizsgált ellenőrzést (pl. az érszámot egyerű vezetéknél) a címke nem említ.

**Indoklás.** A „megfelel” mellé mindig a „Számítás szerint” előtag kerül, a feltételezések és az el nem végzett ellenőrzések jelzésével, hogy a felhasználó ne olvassa teljes megfelelőségnek. A „Nem vizsgált” azért nem ront, mert hiányzó adat (pl. Zs) mellett a többi ellenőrzés eredménye érvényes marad. Kérjük megítélni, hogy ez a megfogalmazás – különösen az el nem végzett hurokellenőrzés melletti „Számítás szerint megfelel” – elfogadható-e.

**Kézzel számolt példa.** Mintaterv „Nappali dugaljak” (c1; B16, 3 × 2,5 mm², 23,4 m, terhelés és az elosztó Zs-e nincs megadva): a vizsgált ellenőrzések „Rendben”, a hurokimpedancia „Nem vizsgált”, alapértékek érvényesek → „Számítás szerint megfelel – feltételezésekkel; nem vizsgált: hurokimpedancia”. Ha a kábel „2 × 0,75”: a legkisebb keresztmetszet „Nem felel meg”, az In ≤ Iz „Nem számítható” (0,75 mm² nincs a táblázatban) → „Nem felel meg”.

**Forrás.** – (programozott döntés; a felületen és a PDF-ben megjelenő címkék)

**Összevetés.** Programmal összevetve: igen – 7 eset (a program címkéi, mintaterv-számítás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-ALLAPOT | ☐ | ☐ | |

#### D-HATOKOR – A segédszámítás hatóköre

**Szabály.** A segédszámítás nem vizsgálja: zárlati szilárdság (k²S² ≥ I²t, 434.5.2); szelektivitás és egyidejűség; felharmonikusok és a nullavezető terhelése; motorok, indítási áramok; aszimmetrikus háromfázisú terhelés; földben (D), szabad levegőn (E, F, G) vezetett kábel; hőszigetelésben futó hosszú szakasz (523.9); alumínium vezető, 35 mm² feletti keresztmetszet, gumiszigetelésű (60 °C-os) vezeték, csökkentett keresztmetszetű N- vagy PE-ér; TT-rendszer hurokellenőrzése, földelési ellenállás, EPH; ÁVK kiválasztása (típus, érzékenység), túlfeszültség-védelem; különleges helyiségek (pl. fürdőszoba, MSZ HD 60364-7-701); a fővezeték és a telki nyomvonalak méretezése; a 100 m feletti esés-pótlék.

**Indoklás.** A program ezt a listát a Méretezés fülön („Mit nem vizsgál a számítás”) és a PDF „méretezés indoklása” táblájának „Nem vizsgált” sorában mutatja; a fenti szöveg a program listájából készül. Kérjük jelezni, ha a lista biztonsági szempontból hiányos, vagy ha egy tétel megfogalmazása félrevezető.

**Kézzel számolt példa.** Egy 3 × 2,5 mm²-es, B16-os áramkör „Számítás szerint megfelel” eredménye mellett is ellenőrizetlen marad a zárlati szilárdság és a szelektivitás.

**Forrás.** A program „Mit nem vizsgál” listája (felület és PDF)

**Összevetés.** Programmal összevetve: igen – 1 eset (a program listája), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| D-HATOKOR | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (D).

Megjegyzés a blokkhoz (forrás, kiadás):

## 3. rész – Szabványhoz kötött kalkulátorok (T1)

A Villanyszerelő Tudástár szabványhoz vagy biztonsághoz kötött (T1) kalkulátorai csak szakmai lektori jóváhagyás után jelennek meg. Kalkulátoronként egy blokk: cél és kiadási adatok, mire jó és mire nem, a „Nem vizsgált” lista, a képletek a kalkulátoroldalon megjelenő alakban, a feltételezések, a bemenetek érvényességi tartománya, a felhasznált állandók forrással, majd a képletek behelyettesíthető alakban és a programozott döntések, kézzel számolt példákkal. A közös működést (számbevitel, kiírás, szóhasználat, figyelmeztetések) a KAL-KOZOS blokk írja le.

A táblázatértékekre (ρ1, λ, U0, Iz0, kθ, kcs, G.52.1 határok, m, cmin, I2/In) csak az 1. rész azonosítójával hivatkozunk: ezek helyességét az 1. rész jóváhagyása fedi, itt nem kell újra összevetni. Ezért minden ilyen értéket használó kalkulátor (Feszültségesés, Keresztmetszet-választás, Kismegszakító-választás, Hurokimpedancia és zárlati áram, Terhelhetőségi táblázat) táblázat-kapus: csak az 1. rész jóváhagyása után jelenik meg, akkor is, ha a blokkja jóvá van hagyva. Ahol a kalkulátor a méretezési segédszámítás programfüggvényét használja, a blokk a 2. rész tételére is hivatkozik.

Minden példát és bemeneti korlátot automatikus teszt vet össze a kalkulátor tényleges futtatásával (ugyanazzal a számítómotorral, amely a kalkulátoroldalon fut). A blokk elején álló tartalmi és forrás-ujjlenyomat azonosítja a jóváhagyott kalkulátort: a program csak az ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé, és ha a kalkulátor bármiben változik, új kiadás és új jóváhagyás kell. A jóváhagyás kalkulátoronként a Jóváhagyó lap „3. rész – kalkulátoronkénti döntés” táblázatában jelölhető.

Jelenlegi kiadási állapot: Feszültségesés: kiadatlan (lektori jóváhagyásra vár); Motor névleges árama: kiadatlan (lektori jóváhagyásra vár); LED-szalag tápegysége: kiadatlan (lektori jóváhagyásra vár); Fázisjavítás (meddőkompenzálás): kiadatlan (lektori jóváhagyásra vár); Keresztmetszet-választás: kiadatlan (lektori jóváhagyásra vár); Kismegszakító-választás: kiadatlan (lektori jóváhagyásra vár); Hurokimpedancia és zárlati áram: kiadatlan (lektori jóváhagyásra vár); Terhelhetőségi táblázat: kiadatlan (lektori jóváhagyásra vár).

### KAL-KOZOS – Közös működés (minden T1 kalkulátor)

Forrás: A kalkulátorok közös számítómotorja (számbevitel, kiírás, szóhasználat, figyelmeztetések) és közös állandói

Az itt leírt viselkedés és szövegek minden T1 kalkulátorra érvényesek; a kalkulátoronkénti blokkok erre hivatkoznak. Ha ebben a blokkban eltérés van, egyik kalkulátor sem jelölhető jóváhagyottnak a javításig.

| Azonosító | Tétel | Érték / szöveg | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-KOZOS-MCB | Kismegszakítók előnyös névleges áramai (a választható és a javasolt In) | 6; 8; 10; 13; 16; 20; 25; 32; 40; 50; 63; 80; 100; 125 A – MSZ EN 60898-1, 5.3.2 (előnyös névleges áramok) | ☐ | ☐ | |
| KAL-KOZOS-FIGY-MERETEZES | Figyelmeztetés a táblázatokat használó kalkulátoroknál (Feszültségesés, Keresztmetszet-választás, Kismegszakító-választás, Hurokimpedancia és zárlati áram, Terhelhetőségi táblázat); nem zárható | „Figyelem: szabványhoz kötött számítás. Nem tervezői méretezés, szabványossági igazolás vagy szakvélemény. A táblázatértékeket, a feltételezéseket és az eredményt jogosult villamos tervezőnek kell ellenőriznie; a kész berendezés megfelelőségét méréssel kell igazolni.” + „Tervezői ellenőrzést segítő számítás – nem tervezői méretezés. Az eredmény „számítás szerinti” érték a megadott adatokkal és a lent felsorolt feltételezésekkel.” | ☐ | ☐ | |
| KAL-KOZOS-FIGY-KALKULATOR | Figyelmeztetés a többi T1 kalkulátornál (Motor névleges árama, LED-szalag tápegysége, Fázisjavítás (meddőkompenzálás)); nem zárható | „A számításról. A kalkulátor a megadott adatokból, a feltüntetett képletekkel és feltételezésekkel számol. Az eredmény tájékoztató: kivitelezési vagy beszerzési döntés előtt szakember ellenőrizze.” + „Tájékoztató számítás – nem tervezői döntés. Az eredmény „számítás szerinti” érték a megadott adatokkal és a lent felsorolt feltételezésekkel.” | ☐ | ☐ | |
| KAL-KOZOS-FIGY-BEAVATKOZAS | Figyelmeztetés a beavatkozással járó témáknál (Motor névleges árama, LED-szalag tápegysége, Fázisjavítás (meddőkompenzálás)) | „Csak szakember. Az eredmény alapján végzett szerelést, bekötést vagy beállítást csak szakképzett villanyszerelő végezheti, feszültségmentesítés után.” | ☐ | ☐ | |
| KAL-KOZOS-FIGY-ALAP | Alapfigyelmeztetés (minden oldal alján) | „Tájékoztató szakmai ismeretanyag. Nem helyettesíti a hatályos szabványokat, az elosztói engedélyes előírásait, a gyártói utasításokat és a szakember helyszíni döntését. Villamos szerelést csak szakképzett személy végezhet; a mérőhelyi és csatlakozási munkákra az elosztói engedélyes szabályai vonatkoznak.” | ☐ | ☐ | |

#### KAL-KOZOS-BEVITEL – Számbevitel és bemeneti korlátok

**Szabály.** A számmezők tizedesvesszőt és tizedespontot is elfogadnak; ha csak pont vagy csak vessző szerepel, az a tizedesjel („1.500” = 1,5). Szóközös ezres csoport („1 000”), unicode mínuszjel és normálalak („1e3”) is megadható. Nem szám, hiányzó kötelező érték vagy tartományon kívüli érték esetén a mező alatt magyar hibaüzenet jelenik meg, és eredmény nem készül: a program a bevitelt nem igazítja a tartományba. A tartományokat kalkulátoronként a …-BEM- tételek sorolják fel; a tételek összevetése a tartomány szélein elfogadott és a határon túl elutasított értéket próbál.

**Indoklás.** A csendes korrekció (pl. a tartomány szélére állítás) félrevezető eredményt adna. A „1.500” = 1,5 értelmezés a tizedespontot használó bevitel (pl. másolt érték) miatt választott; ezres csoport csak szóközzel adható meg. Kockázata: aki ponttal ír ezres csoportot („1.500” m-t 1500 m-re gondolva), 1,5 m-rel kap eredményt, ami hossznál a biztonság kárára téved (pl. a feszültségesés „határon belül” lesz) – a kalkulátor erre nem figyelmeztet.

**Kézzel számolt példa.** Feszültségesés, terhelőáram (megengedett: > 0 és ≤ 1000 A): „16,0” és „16.0” → 16 A; „1 000” → 1000 A; „1001” → „Legfeljebb 1000 A lehet.”; „0” → „Nullánál nagyobb számot adj meg.”; „abc” → „Csak számot írj; a mértékegységet mellette választhatod.”; vezetékhossz „23.4” → 23,4 m (ΔU% = 2,9301%, mint „23,4”-nél).

**Kérdés a lektorhoz.** Elfogadható-e a T1 kalkulátoroknál, hogy a pontosan három számjegyet követő egyetlen pont („1.500”) tizedespontnak számít (1,5)? Ha nem, a programnak az ilyen kétértelmű bevitelt el kell utasítania vagy rá kell kérdeznie (a lektor döntése szerint; ez minden T1 kalkulátort érint).

**Forrás.** – (programozott döntés: a kalkulátorok számbevitele)

**Összevetés.** Programmal összevetve: igen – 8 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-KOZOS-BEVITEL | ☐ | ☐ | |

#### KAL-KOZOS-KIIRAS – Kerekítés és kiírás

**Szabály.** A számítás kerekítés nélkül fut, csak a kiírás kerekít: 1 alatt és 1–10 között 4 értékes jegy, 10 fölött legfeljebb 3 tizedes (10 000-ig 5 értékes jegy), afölött egész szám; 10⁻⁶ alatt normálalak. Rögzített tizedesek: az ohmban kiírt értékek (R, Zs, Zs,max) és a levezetésben a ΔU% 3 tizedessel. A felső határként használt megengedett hurokimpedanciát (Zs,max) 3 tizedesre, a hosszakat (Lmax) 0,1 m-re lefelé kerekítve írja ki, „(lefelé kerekítve)” jelöléssel, ha a kerekítés látható; a többi érték a szokásos módon kerekül. Határérték-összevetésnél, ha a kerekített kiírás egyenlőséget vagy a feltétellel ellentétes viszonyt mutatna (pl. „5 % > 5 %”, „1,437 ≤ 1,436”), a két oldal több tizedessel jelenik meg.

**Indoklás.** A lefelé kerekített határ és hossz a biztonság javára téved: a kiírt Zs,max-nál nagyobb mért érték biztosan nem teljesíti a feltételt (felfelé kerekítve egy a határt kissé meghaladó érték is megfelelőnek látszana). A több tizedes az ellentmondásosnak látszó kiírást akadályozza meg.

**Kézzel számolt példa.** Feszültségesés, 16 A, 23,4 m, 2,5 mm² (KAL-FESZULTSEGES-K1): ΔU% = 2,930087 → „2,93 %”; ΔU = 6,7392 V → „6,739 V”; Lmax = 39,9306 m → „39,9 m (lefelé kerekítve)”. 39,931 m-nél ΔU% = 5,000056 → „Számítás szerint meghaladja a határt: 5,0001 % > 5 %.” Hurokimpedancia, C16: Zs,max = 1,4375 Ω → „1,437 Ω (lefelé kerekítve)”; B16: 2,875 Ω → „2,875 Ω”.

**Forrás.** – (programozott döntés: a kalkulátorok kiírása)

**Összevetés.** Programmal összevetve: igen – 5 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-KOZOS-KIIRAS | ☐ | ☐ | |

#### KAL-KOZOS-SZOVEG – Szóhasználat és figyelmeztetések

**Szabály.** Az eredmény „számítás szerinti”: ahol a kalkulátor feltételt értékel, a verdikt „Számítás szerint …” kezdetű; a „megfelel”, „szabványos”, „MSZ szerint” kifejezést a T1 kalkulátorok nem használják. Minden T1 kalkulátoroldalon nem zárható figyelmeztetés áll (KAL-KOZOS-FIGY-MERETEZES vagy KAL-KOZOS-FIGY-KALKULATOR), alatta a „Nem vizsgált” lista, a számítás mellett a feltételezések, a táblázatokat használóknál a táblázatok állapota (a jóváhagyásig „Ellenőrizendő: …”), a beavatkozással járó témáknál a KAL-KOZOS-FIGY-BEAVATKOZAS is. A kalkulátoroldal a levezetést (képlet → behelyettesítés → eredmény → forrás) és a kidolgozott példát is mutatja.

**Indoklás.** A szabványhoz kötött számítás eredménye nem minősülhet megfelelőségi nyilatkozatnak; a felhasználónak látnia kell a feltételezéseket és az el nem végzett vizsgálatokat.

**Kézzel számolt példa.** Keresztmetszet-választás, In = 20 A, B2: „Számítás szerint 2,5 mm² a legkisebb keresztmetszet, amelyre In ≤ Iz teljesül (20 A ≤ 23 A).” Kismegszakító-választás, Ib = 22 A, 2,5 mm²: „Számítás szerint nincs olyan előnyös névleges áram …”.

**Forrás.** – (programozott döntés: a kalkulátoroldal szövegei)

**Összevetés.** Programmal összevetve: igen – 4 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-KOZOS-SZOVEG | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (KAL-KOZOS).

Megjegyzés a blokkhoz (forrás, kiadás):

### KAL-FESZULTSEGES – Feszültségesés

Forrás: MSZ HD 60364-5-52:2011, 525 és G melléklet (G.52.1 határértékek, G.52.2 képlet) – a lib/sizing-tables.ts értékeivel; MSZ EN 60038 (230/400 V)

Cél: Feszültségesés rézvezetéken egy-, háromfázisú és egyenáramú körben, a megengedett legnagyobb hosszal – a tervező Méretezés fülével azonos képlettel.

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: igen – a kalkulátor az 1. rész jóváhagyása nélkül akkor sem jelenik meg, ha ez a blokk jóvá van hagyva. Tartalmi ujjlenyomat: f1be2f7d; forrás-ujjlenyomat: c0f73c97. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-FESZULTSEGES-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: Hosszú leágazások (kert, melléképület, garázs) keresztmetszetének előzetes ellenőrzése. A tervező Méretezés fülén kapott érték gyors ellenőrzése. Mire nem: Tervezői méretezés kiváltására: a terhelhetőség, a zárlati védelem és a hurokimpedancia is számít. Motorindítás pillanatnyi feszültségesésére. | ☐ | ☐ | |
| KAL-FESZULTSEGES-NV | Nem vizsgált (a kalkulátoroldalon) | a méretezési segédszámítással azonos lista (D-HATOKOR) | ☐ | ☐ | |
| KAL-FESZULTSEGES-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | 1) ΔU% = b · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100 (b = 2 egyfázisú, 1 háromfázisú) 2) DC: ΔU = 2 · L · I · ρ1 / A 3) Lmax = ΔU%határ · U0 / (100 · b · I · (ρ1 · cos φ / A + λ · sin φ)) | ☐ | ☐ | |
| KAL-FESZULTSEGES-FELT | Feltételezések (a számítás mellett; a feltételes sorok a feltétellel) | 1) (csak ha Rendszer: „Egyfázisú (230 V)” vagy „Háromfázisú (400 V)”) Rézvezető; ρ1 = 0,0225 Ω·mm²/m (üzemi hőmérséklet), λ = 0,00008 Ω/m (G.52.2). 2) A teljes terhelés a vezeték végén; az elosztó előtti (fővezeték) esés nincs benne. 3) (csak ha Rendszer: „Háromfázisú (400 V)”) Szimmetrikus háromfázisú terhelés. 4) (csak ha Rendszer: „Egyenáram”) Rézvezető; ρ1 = 0,0225 Ω·mm²/m (üzemi hőmérséklet, G.52.2). 5) (csak ha Rendszer: „Egyenáram”) Egyenáram: oda-vissza vezeték, reaktancia nélkül. | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-RENDSZER | Rendszer | választható: Egyfázisú (230 V); Háromfázisú (400 V); Egyenáram; alapérték: Egyfázisú (230 V) | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-I | I – Terhelőáram (A) | alapérték: 16 A; megengedett: > 0 és ≤ 1000 A | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-L | L – Vezetékhossz (egy irányban), m | alapérték: 23,4 m; megengedett: > 0 és ≤ 10 000 m; egység: m, km (a korlát m egységben értendő) | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-A | A – Keresztmetszet (mm²) | alapérték: 2,5 mm²; megengedett: > 0 és ≤ 35 mm²; súgó: „Rézvezető, legfeljebb 35 mm² (a segédszámítás tartománya); a táblázati lépcsőn kívüli érték is megadható.” | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-COS | cos φ – Teljesítménytényező | alapérték: 1; megengedett: > 0 és ≤ 1; csak: Egyfázisú (230 V), Háromfázisú (400 V) | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-UDC | U – Névleges feszültség (V) | alapérték: 24 V; megengedett: > 0 és ≤ 1500 V; csak: Egyenáram | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-HATAR | Határérték (G.52.1, tájékoztató) | választható: a négy G.52.1 szerinti határ: T-DU-KOZ-EGY, T-DU-KOZ-VIL, T-DU-SAJ-EGY, T-DU-SAJ-VIL (közcélú hálózat / saját táppont; egyéb fogyasztó / világítás); alapérték: közcélú hálózat, egyéb fogyasztó (T-DU-KOZ-EGY); csak: Egyfázisú (230 V), Háromfázisú (400 V) | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-HATARDC | ΔU – Megengedett esés (%) | alapérték: 3 %; megengedett: > 0 és ≤ 50 %; csak: Egyenáram | ☐ | ☐ | |

Programmal összevetve: igen – 25 eset (a program listája, bemeneti korlát), automatikus tesztben.

#### KAL-FESZULTSEGES-K1 – Feszültségesés egy- és háromfázisú körben

**Szabály.** ΔU% = b · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100, ahol b = 2 egyfázisú, b = 1 (szimmetrikus) háromfázisú körben, sin φ = √(1 − cos² φ). Ugyanaz a programfüggvény, mint a tervező Méretezés fülén (K-DU1, K-DU3). A voltban kiírt esés egyfázisnál ΔU = ΔU% · U0, háromfázisnál ΔU = ΔU% · 400 V (vonali feszültség).

**Indoklás.** A százalék U0-ra vonatkozik (T-K-U0); ρ1: T-K-RHO1, λ: T-K-LAMBDA. A teljes terhelést a vezeték végén feltételezi, és elosztó előtti (fővezeték) esést nem ad hozzá – ezt a feltételezés-sor kimondja.

**Kézzel számolt példa.** Egyfázis, I = 16 A, L = 23,4 m, A = 2,5 mm², cos φ = 1: ΔU% = 2 · 23,4 · 16 · 0,0225 / 2,5 / 230 · 100 = 2,9301%; ΔU = 2,9301% · 230 V = 6,7392 V. Háromfázis, I = 32 A, L = 50 m, A = 6 mm², cos φ = 0,9, sin φ = 0,43589: ΔU% = 1 · 50 · 32 · (0,0225 · 0,9 / 6 + 0,00008 · 0,43589) / 230 · 100 = 2,3721%; ΔU = 2,3721% · 400 V = 9,4883 V.

**Forrás.** T-K-RHO1, T-K-LAMBDA, T-K-U0 (1. rész); K-DU1, K-DU3 (2. rész); MSZ HD 60364-5-52:2011 G.52.2

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-FESZULTSEGES-K1 | ☐ | ☐ | |

#### KAL-FESZULTSEGES-K2 – Feszültségesés egyenáramú körben

**Szabály.** ΔU = 2 · L · I · ρ1 / A (oda- és visszavezető, reaktancia nélkül); ΔU% = ΔU / U · 100, ahol U a megadott névleges feszültség. Egyenáramnál a határ a felhasználó által megadott százalék (alapértéke 3%); a G.52.1 határok (T-DU) itt nem választhatók.

**Indoklás.** Törpefeszültségű egyenáramú körben (LED, akkumulátoros rendszer) a kis névleges feszültség miatt a százalékos esés nagy; a programban erre nincs szabványos határ, ezért a felhasználó adja meg. ρ1 ugyanaz az üzemi hőmérsékletű érték (T-K-RHO1), mint váltakozó áramnál.

**Kézzel számolt példa.** U = 24 V, I = 5 A, L = 10 m, A = 1,5 mm²: ΔU = 2 · 10 · 5 · 0,0225 / 1,5 = 1,5 V; ΔU% = 1,5 / 24 · 100 = 6,25%; megadott határ 5% → 6,25% > 5% → „Számítás szerint meghaladja a határt”.

**Kérdés a lektorhoz.** Elfogadható-e egyenáramnál az üzemi hőmérsékletű ρ1 (T-K-RHO1) és a felhasználó által megadott határ 3%-os alapértéke?

**Forrás.** T-K-RHO1 (1. rész); egyenáramú alapösszefüggés (U = R · I)

**Összevetés.** Programmal összevetve: igen – 1 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-FESZULTSEGES-K2 | ☐ | ☐ | |

#### KAL-FESZULTSEGES-K3 – Legnagyobb hossz a határig

**Szabály.** Lmax = ΔU%határ · U0 / (100 · b · I · (ρ1 · cos φ / A + λ · sin φ)); egyenáramnál Lmax = ΔU%határ / 100 · U / (2 · I · ρ1 / A). Mindkettő azonos a ΔU%határ / ΔU% · L aránnyal, mert az esés a hosszal arányos (a levezetés ezt az alakot mutatja). Kiírás 0,1 m-re lefelé kerekítve (KAL-KOZOS-KIIRAS).

**Indoklás.** A K1, K2 képlet átrendezése (K-LMAX); a lefelé kerekítés a biztonság javára téved. Elosztó előtti esést nem von le.

**Kézzel számolt példa.** Egyfázis, 16 A, 2,5 mm², határ 5%: Lmax = 0,05 · 230 / (2 · 16 · 0,0225 / 2,5) = 39,9306 m → 39,9 m (lefelé kerekítve). Világítás, 10 A, 30 m, 1,5 mm², határ 3%: ΔU% = 3,913%; Lmax = 0,03 · 230 / (2 · 10 · 0,0225 / 1,5) = 23 m → 23 m. Egyenáram (K2), határ 5%: Lmax = 0,05 · 24 / (2 · 5 · 0,0225 / 1,5) = 8 m.

**Forrás.** T-DU-KOZ-EGY, T-DU-KOZ-VIL (1. rész); K-LMAX (2. rész)

**Összevetés.** Programmal összevetve: igen – 3 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-FESZULTSEGES-K3 | ☐ | ☐ | |

#### KAL-FESZULTSEGES-D1 – Határérték és eredmény

**Szabály.** Egy- és háromfázisú körben a határ a négy G.52.1 érték közül választható (alapérték: közcélú hálózat, egyéb fogyasztó); egyenáramnál megadott százalék. A feltétel ΔU% ≤ határ, relatív 10⁻⁹ tűréssel (D-TURES). Eredmény: „Számítás szerint a határon belül: x % ≤ y %.” vagy „Számítás szerint meghaladja a határt: x % > y %.”. A határ mellett a forrás rövid hivatkozása és a táblázatok állapota áll („ellenőrizendő” a jóváhagyásig); egyenáramnál „(megadott)”.

**Indoklás.** A határ a berendezés kezdőpontjától értendő (K-DUOSSZ); a kalkulátor csak a megadott vezetéket számolja, ezért a fővezeték esését a felhasználónak kell figyelembe vennie – a feltételezés-sor ezt kimondja.

**Kézzel számolt példa.** Világítás (T-DU-KOZ-VIL), 10 A, 30 m, 1,5 mm²: 3,913% > 3% → „Számítás szerint meghaladja a határt”; ugyanez egyéb fogyasztóként (T-DU-KOZ-EGY): 3,913% ≤ 5% → „Számítás szerint a határon belül”. Saját táppont, világítás: határ 6% (T-DU-SAJ-VIL).

**Forrás.** T-DU-KOZ-EGY, T-DU-KOZ-VIL, T-DU-SAJ-EGY, T-DU-SAJ-VIL (1. rész); D-TURES, K-DUOSSZ (2. rész)

**Összevetés.** Programmal összevetve: igen – 5 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-FESZULTSEGES-D1 | ☐ | ☐ | |

#### KAL-FESZULTSEGES-D2 – Keresztmetszet, háromfázisú voltérték, táblázat-kapu

**Szabály.** A keresztmetszet 35 mm²-ig szabadon megadható (> 0 és ≤ 35 mm², a méretezési segédszámítás tartománya), nem csak a T-KM-SOR lépcsői; a kalkulátor sem a terhelhetőséget, sem a legkisebb keresztmetszetet nem vizsgálja. Háromfázisnál a voltban kiírt esés a 400 V-os vonali névleges feszültségre vonatkozik. A kalkulátor táblázat-kapus: a felhasznált T-K-RHO1, T-K-LAMBDA, T-K-U0 és T-DU értékek miatt csak az 1. rész jóváhagyása után jelenik meg, akkor is, ha ez a blokk jóvá van hagyva.

**Indoklás.** A feszültségesés a keresztmetszettel fordítottan arányos, a táblázati lépcsőhöz nem kötött; a terhelhetőséget a Keresztmetszet-választás és a Terhelhetőségi táblázat kalkulátor vizsgálja. A 35 mm² feletti keresztmetszet a „Nem vizsgált” lista (D-HATOKOR) szerint kívül esik a segédszámítás hatókörén, ezért a bevitel sem engedi. A 400 V a vonali névleges feszültség (MSZ EN 60038); √3 · 230 V = 398,4 V-tal a kiírt érték 0,4%-kal kisebb lenne.

**Kézzel számolt példa.** 3 mm², egyfázis, 16 A, 23,4 m: ΔU% = 2 · 23,4 · 16 · 0,0225 / 3 / 230 · 100 = 2,4417% (a Méretezés fül a nem szabványos keresztmetszettel nem számol, D-BLOKK); 35 mm² elfogadott, 36 mm² „Legfeljebb 35 mm² lehet.”. Háromfázis (K1): 2,3721% · 400 V = 9,4883 V.

**Kérdés a lektorhoz.** Elfogadható-e háromfázisnál a 400 V-hoz viszonyított voltérték?

**Forrás.** MSZ EN 60038 (400 V); T-KM-SOR, T-K-RHO1, T-K-LAMBDA, T-K-U0 (1. rész); D-BLOKK, D-HATOKOR (2. rész)

**Összevetés.** Programmal összevetve: igen – 3 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-FESZULTSEGES-D2 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (KAL-FESZULTSEGES).

Megjegyzés a blokkhoz (forrás, kiadás):

### KAL-MOTOR-ARAM – Motor névleges árama

Forrás: Villamos gépek teljesítmény-összefüggése (P = √3 · U · I · cos φ · η); 1 LE = 735,49875 W; 1 hp ≈ 745,7 W (definíció)

Cél: Villanymotor névleges áramának becslése a leadott teljesítményből, a feszültségből, a cos φ-ből és a hatásfokból, opcionálisan az indítási árammal.

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: nem – a kiadáshoz a kalkulátor jóváhagyása elég. Tartalmi ujjlenyomat: d3861940; forrás-ujjlenyomat: 81ecfbc6. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-MOTOR-ARAM-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: Hiányos adattáblájú motor áramának becslése. A kábel- és védelemválasztás előtti nagyságrendi becslés. Mire nem: Motorvédő kapcsoló vagy hőrelé beállítására: ahhoz az adattábla névleges árama kell. Frekvenciaváltós, csillag–delta indítású vagy részterhelésű üzem áramára. | ☐ | ☐ | |
| KAL-MOTOR-ARAM-NV | Nem vizsgált (a kalkulátoroldalon) | az indítás módja (közvetlen, csillag–delta, lágyindító, frekvenciaváltó); részterhelés, túlterhelés és üzemmód (S1–S10); a motorvédelem beállítása és szelektivitása; a tápkábel méretezése és feszültségesése indításkor; egyfázisú motor kondenzátora | ☐ | ☐ | |
| KAL-MOTOR-ARAM-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | 1) 3f: In = P / (√3 · U · cos φ · η) 2) 1f: In = P / (U · cos φ · η) 3) Ia = (Ia/In) · In | ☐ | ☐ | |
| KAL-MOTOR-ARAM-FELT | Feltételezések (a számítás mellett; a feltételes sorok a feltétellel) | 1) Névleges terhelés, névleges feszültség és frekvencia. 2) (csak ha Rendszer: „Háromfázisú (400 V)”) Szimmetrikus háromfázisú motor; vonali áram. | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-RENDSZER | Rendszer | választható: Egyfázisú (230 V); Háromfázisú (400 V); alapérték: Háromfázisú (400 V) | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-P | P – Leadott (tengely-) teljesítmény (W) | alapérték: 5,5 kW; megengedett: > 0 és ≤ 10 000 000 W; egység: kW, W, LE, hp (a korlát W egységben értendő) | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-U | U – Feszültség (V) | alapérték: 230 V; megengedett: > 0 és ≤ 10 000 V; csak: Egyfázisú (230 V) | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-UV | U – Vonali feszültség (V) | alapérték: 400 V; megengedett: > 0 és ≤ 10 000 V; csak: Háromfázisú (400 V) | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-COS | cos φ – Teljesítménytényező | alapérték: 0,85; megengedett: > 0 és ≤ 1 | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-ETA | η – Hatásfok | alapérték: 0,87; megengedett: > 0 és ≤ 1 | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-K | Ia/In – Indítási áramarány Ia/In (nem kötelező) | alapérték: nincs (üres); megengedett: 1 … 15; nem kötelező; súgó: „Adattábláról vagy katalógusból; közvetlen indításnál jellemzően 5–8.” | ☐ | ☐ | |
| KAL-MOTOR-ARAM-LE | 1 LE (metrikus lóerő), a teljesítmény mértékegysége | 735,49875 W (75 kp · m/s; definíció) | ☐ | ☐ | |
| KAL-MOTOR-ARAM-HP | 1 hp (angolszász mechanikai lóerő), a teljesítmény mértékegysége | 745,6998715822702 W (550 ft · lbf/s; definíció) | ☐ | ☐ | |

Programmal összevetve: igen – 28 eset (a program listája, bemeneti korlát, kalkulátor-futtatás), automatikus tesztben.

#### KAL-MOTOR-ARAM-K1 – Névleges áram, háromfázisú motor

**Szabály.** In = P / (√3 · U · cos φ · η), ahol P a leadott (tengely-) teljesítmény, U a vonali feszültség. Mellékeredmény: felvett hatásos teljesítmény P1 = P / η, látszólagos teljesítmény S = P1 / cos φ.

**Indoklás.** A tengelyteljesítményből a felvett teljesítmény P1 = P / η; a szimmetrikus háromfázisú terhelés áramára P1 = √3 · U · I · cos φ. A becslés a névleges munkapontra érvényes; a valós névleges áram motoronként eltér, ezért az adattábla az irányadó (KAL-MOTOR-ARAM-D1).

**Kézzel számolt példa.** P = 5,5 kW, U = 400 V, cos φ = 0,85, η = 0,87: In = 5500 / (√3 · 400 · 0,85 · 0,87) = 5500 / 512,341 = 10,735 A; P1 = 5500 / 0,87 = 6321,84 W; S = 6321,84 / 0,85 = 7437,46 VA.

**Forrás.** Villamos gépek teljesítmény-összefüggése (P = √3 · U · I · cos φ · η); MSZ EN 60038 (400 V)

**Összevetés.** Programmal összevetve: igen – 1 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-MOTOR-ARAM-K1 | ☐ | ☐ | |

#### KAL-MOTOR-ARAM-K2 – Névleges áram, egyfázisú motor

**Szabály.** In = P / (U · cos φ · η), U a fázisfeszültség (alapértéke 230 V).

**Indoklás.** Az egyfázisú teljesítmény-összefüggés P1 = U · I · cos φ; a kondenzátoros egyfázisú motor sajátosságait (segédfázis) a kalkulátor nem vizsgálja (Nem vizsgált).

**Kézzel számolt példa.** P = 0,75 kW, U = 230 V, cos φ = 0,8, η = 0,7: In = 750 / (230 · 0,8 · 0,7) = 750 / 128,8 = 5,823 A; P1 = 750 / 0,7 = 1071,43 W.

**Forrás.** Villamos gépek teljesítmény-összefüggése (P = U · I · cos φ · η); MSZ EN 60038 (230 V)

**Összevetés.** Programmal összevetve: igen – 1 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-MOTOR-ARAM-K2 | ☐ | ☐ | |

#### KAL-MOTOR-ARAM-K3 – Indítási áram (nem kötelező)

**Szabály.** Ha az indítási áramarány (Ia/In, 1–15) meg van adva: Ia = (Ia/In) · In. Üresen indítási áram nem készül.

**Indoklás.** Az arány az adattábláról vagy a katalógusból vehető; közvetlen indításnál jellemzően 5–8 (a mező súgója). Az indítás módját a kalkulátor nem vizsgálja (Nem vizsgált).

**Kézzel számolt példa.** P = 7,5 kW, U = 400 V, cos φ = 0,86, η = 0,89, Ia/In = 7: In = 7500 / (√3 · 400 · 0,86 · 0,89) = 14,1433 A; Ia = 7 · 14,1433 = 99,003 A.

**Forrás.** Villamos gépek teljesítmény-összefüggése; az arány a gyártó adata

**Összevetés.** Programmal összevetve: igen – 1 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-MOTOR-ARAM-K3 | ☐ | ☐ | |

#### KAL-MOTOR-ARAM-D1 – Alapértékek és tájékoztatás

**Szabály.** Alapértékek: háromfázisú, 400 V, cos φ = 0,85, η = 0,87, P = 5,5 kW; a felhasználó mindegyiket módosíthatja. Az eredmény „Becsült névleges áram”, verdikt nincs; a számítás mellett mindig megjelenik: „A motor adattábláján szereplő névleges áram az irányadó; ez a számítás csak becslés, ha az adattábla nem olvasható.”

**Indoklás.** A cos φ és az η motoronként (teljesítmény, pólusszám, gyártó) eltér; az alapértékek csak a mezők kitöltését könnyítik, ezért a tájékoztató sor minden eredmény mellett megjelenik.

**Kézzel számolt példa.** Alapértékekkel: In = 5500 / (√3 · 400 · 0,85 · 0,87) = 10,735 A, a tájékoztató sorral.

**Kérdés a lektorhoz.** Elfogadhatók-e a cos φ = 0,85 és η = 0,87 alapértékek, vagy a mezőket alapérték nélkül (kötelező kitöltéssel) kellene kínálni?

**Forrás.** – (programozott döntés: alapértékek)

**Összevetés.** Programmal összevetve: igen – 1 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-MOTOR-ARAM-D1 | ☐ | ☐ | |

#### KAL-MOTOR-ARAM-D2 – Teljesítmény-mértékegységek

**Szabály.** A teljesítmény kW-ban (alapérték), W-ban, LE-ben vagy hp-ben adható meg; a számítás W-ban fut (KAL-MOTOR-ARAM-LE, KAL-MOTOR-ARAM-HP). A megengedett tartomány W-ban értendő (> 0 és ≤ 10 000 000 W).

**Indoklás.** Régi adattáblákon a teljesítmény LE-ben vagy hp-ben is szerepelhet.

**Kézzel számolt példa.** 10 LE = 10 · 735,49875 = 7354,9875 W; 400 V, 0,85, 0,88: In = 7354,9875 / (√3 · 400 · 0,85 · 0,88) = 14,1925 A. 10 hp = 7456,9987 W → In = 14,3894 A.

**Forrás.** 1 LE = 735,49875 W; 1 hp ≈ 745,7 W (definíció)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-MOTOR-ARAM-D2 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (KAL-MOTOR-ARAM).

Megjegyzés a blokkhoz (forrás, kiadás):

### KAL-LED-SZALAG-TAPEGYSEG – LED-szalag tápegysége

Forrás: Teljesítmény-összefüggés (P = U · I); Jellemző kereskedelmi teljesítménysor (tájékoztató, gyártónként eltér)

Cél: LED-szalag teljesítménye és árama a hosszból és a méterenkénti teljesítményből, tartalékkal; a következő jellemző tápegység-teljesítménnyel.

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: nem – a kiadáshoz a kalkulátor jóváhagyása elég. Tartalmi ujjlenyomat: 12c6bbe4; forrás-ujjlenyomat: 48423097. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-LED-SZALAG-TAPEGYSEG-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: Állandó feszültségű LED-szalag tápegységének kiválasztása. A szalag áramának becslése a vezeték és a kapcsoló kiválasztásához. Mire nem: Állandó áramú (CC) LED-ekhez. A tápegység hálózati oldalának bekötésére és védelmére (az erősáramú rész szakember feladata). | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-NV | Nem vizsgált (a kalkulátoroldalon) | a szalag menti feszültségesés pontos számítása; a tápegység hőmérséklete, beépítési módja és IP-védettsége; a bekapcsolási áramlökés és a kismegszakító kiválasztása; dimmerek és vezérlők kompatibilitása | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | 1) P = L · P/m 2) I = P / U 3) Pmin = P · (1 + tartalék) | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-FELT | Feltételezések (a számítás mellett; a feltételes sorok a feltétellel) | 1) A méterenkénti teljesítmény a szalag névleges feszültségén érvényes. 2) Állandó feszültségű (CV) szalag és tápegység. | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-BEM-L | L – Szalaghossz (m) | alapérték: 5 m; megengedett: > 0 és ≤ 1000 m | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-BEM-PM | P/m – Teljesítmény méterenként (W/m) | alapérték: 14,4 W/m; megengedett: > 0 és ≤ 200 W/m; súgó: „A szalag adatlapjáról.” | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-BEM-U | U – Szalagfeszültség (V) | alapérték: 24 V; megengedett: > 0 és ≤ 60 V; súgó: „Jellemzően 5, 12 vagy 24 V (törpefeszültség).” | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-BEM-R | t – Teljesítménytartalék (%) | alapérték: 20 %; megengedett: 0 … 100 % | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-PSU | Jellemző tápegység-teljesítmények (a javaslat ebből választ) | 15; 25; 35; 50; 60; 75; 100; 120; 150; 200; 240; 320; 480; 600 W – Jellemző kereskedelmi teljesítménysor (tájékoztató, gyártónként eltér) | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-BETAP | Betáplálási távolság, amely felett tájékoztató sor jelenik meg | szalagfeszültség ≤ 5 V: 2 m (kiírva: „1–2 m-enként”); ≤ 12 V: 5 m; ≤ 24 V: 10 m; 24 V felett: 10 m (kiírva: „a gyártói adatlap adja meg”) – programozott tájékoztató érték, forrás nélkül | ☐ | ☐ | |

Programmal összevetve: igen – 24 eset (a program listája, bemeneti korlát, kalkulátor-futtatás), automatikus tesztben.

#### KAL-LED-SZALAG-TAPEGYSEG-K1 – Teljesítmény, áram, szükséges tápegység

**Szabály.** P = L · P/m; I = P / U; Pmin = P · (1 + t / 100), ahol t a teljesítménytartalék %-ban (alapértéke 20%). Javasolt tápegység: a KAL-LED-SZALAG-TAPEGYSEG-PSU sor legkisebb, Pmin-nél nem kisebb eleme.

**Indoklás.** Állandó feszültségű (CV) szalagnál a méterenkénti teljesítmény a névleges feszültségen érvényes; a tartalék a tápegység tartós terhelését csökkenti.

**Kézzel számolt példa.** L = 5 m, P/m = 14,4 W/m, U = 24 V, t = 20%: P = 5 · 14,4 = 72 W; I = 72 / 24 = 3 A; Pmin = 72 · 1,2 = 86,4 W → 100 W. L = 10 m, 9,6 W/m, 12 V, 20%: P = 96 W; I = 8 A; Pmin = 115,2 W → 120 W.

**Forrás.** Teljesítmény-összefüggés (P = U · I); Jellemző kereskedelmi teljesítménysor (tájékoztató, gyártónként eltér)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-LED-SZALAG-TAPEGYSEG-K1 | ☐ | ☐ | |

#### KAL-LED-SZALAG-TAPEGYSEG-D1 – Tápegység-javaslat és túl nagy terhelés

**Szabály.** A javaslat a jellemző teljesítménysor legkisebb, Pmin-nél nem kisebb eleme (relatív 10⁻⁹ tűréssel, így pontos egyezésnél az adott érték). Ha Pmin nagyobb a sor legnagyobb eleménél (600 W), javaslat nincs: a fő eredmény a szükséges teljesítmény, és figyelmeztetés jelenik meg: „Ehhez a terheléshez egy tápegység helyett több szakaszra bontott betáplálás javasolt.”

**Indoklás.** A teljesítménysor gyártónként eltér, ezért „jellemző érték”; nagy terhelésnél egy tápegység helyett a szakaszolás a szokásos megoldás.

**Kézzel számolt példa.** 5 m × 16 W/m, 25%: Pmin = 80 · 1,25 = 100 W → 100 W (pontos egyezés). 50 m × 14,4 W/m, 24 V, 20%: P = 720 W, Pmin = 864 W > 600 W → javaslat nincs, figyelmeztetés.

**Forrás.** Jellemző kereskedelmi teljesítménysor (tájékoztató, gyártónként eltér)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-LED-SZALAG-TAPEGYSEG-D1 | ☐ | ☐ | |

#### KAL-LED-SZALAG-TAPEGYSEG-D2 – Betáplálási tájékoztatás

**Szabály.** Ha a szalaghossz a KAL-LED-SZALAG-TAPEGYSEG-BETAP szerinti távolságnál nagyobb, tájékoztató sor jelenik meg: a feszültségesés miatt a túlsó vég halványabb lehet, és a szalagfeszültségtől függően jellemzően ennyi méterenként javasolt betáplálni – a gyártói adatlap az irányadó. 24 V felett csak az adatlapra utal.

**Indoklás.** A szalag menti feszültségesést a kalkulátor nem számolja (Nem vizsgált); a tájékoztató sor csak felhívja rá a figyelmet.

**Kézzel számolt példa.** 10 m, 12 V: 10 m > 5 m → „…12 V-os szalagnál jellemzően 5 m-enként javasolt betáplálni…”. 5 m, 24 V: 5 m ≤ 10 m → nincs tájékoztató sor.

**Kérdés a lektorhoz.** Elfogadhatók-e a programozott betáplálási távolságok (KAL-LED-SZALAG-TAPEGYSEG-BETAP) és a 20%-os tartalék-alapérték tájékoztató értékként?

**Forrás.** – (programozott tájékoztató érték)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-LED-SZALAG-TAPEGYSEG-D2 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (KAL-LED-SZALAG-TAPEGYSEG).

Megjegyzés a blokkhoz (forrás, kiadás):

### KAL-FAZISJAVITAS – Fázisjavítás (meddőkompenzálás)

Forrás: Meddőteljesítmény-kompenzálás: Qc = P · (tan φ1 − tan φ2) – alapösszefüggés; MSZ EN 60831 (önregeneráló fázisjavító kondenzátorok) – a „nem vizsgált” tételekhez

Cél: A kívánt cos φ eléréséhez szükséges kondenzátorteljesítmény (Qc = P · (tan φ1 − tan φ2)) és kapacitás delta, csillag vagy egyfázisú kapcsolásban.

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: nem – a kiadáshoz a kalkulátor jóváhagyása elég. Tartalmi ujjlenyomat: 9d9f7219; forrás-ujjlenyomat: 737957ec. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-FAZISJAVITAS-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: Egyedi fázisjavítás (pl. motor) kondenzátorteljesítményének előzetes becslése. A fázisjavítás áramcsökkentő hatásának szemléltetése. Mire nem: Fázisjavító telep tervezésére felharmonikusokkal terhelt hálózatban (rezonanciaveszély). A kondenzátorok bekötésére: a kisütő ellenállás és a védelem szakember feladata. | ☐ | ☐ | |
| KAL-FAZISJAVITAS-NV | Nem vizsgált (a kalkulátoroldalon) | felharmonikusok és rezonancia (fojtós telep szükségessége); túlkompenzálás kis terhelésnél, fokozatszabályozás; a kondenzátor feszültségtűrése, kisütése és védelme (MSZ EN 60831); kapcsolási tranziensek; az elosztói engedélyes meddőelszámolási szabályai | ☐ | ☐ | |
| KAL-FAZISJAVITAS-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | 1) Qc = P · (tan φ1 − tan φ2) 2) Δ: C = Qc / (3 · ω · U²) 3) Y és 1f: C = Qc / (ω · U²), ω = 2π · f | ☐ | ☐ | |
| KAL-FAZISJAVITAS-FELT | Feltételezések (a számítás mellett; a feltételes sorok a feltétellel) | 1) Szinuszos feszültség, a terhelés hatásos teljesítménye állandó. 2) (csak ha Kondenzátorok kapcsolása: „Háromfázisú, delta (Δ)” vagy „Háromfázisú, csillag (Y)”) Szimmetrikus háromfázisú telep, három azonos kondenzátor. 3) (csak ha Kondenzátorok kapcsolása: „Egyfázisú”) Egyfázisú kondenzátor a fogyasztóval párhuzamosan. | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-P | P – Hatásos teljesítmény (W) | alapérték: 10 kW; megengedett: > 0 és ≤ 1 000 000 000 W; egység: W, kW, MW (a korlát W egységben értendő) | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-COS1 | cos φ1 – Jelenlegi cos φ | alapérték: 0,7; megengedett: > 0 és ≤ 1 | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-COS2 | cos φ2 – Kívánt cos φ | alapérték: 0,95; megengedett: > 0 és ≤ 1 | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-KOTES | Kondenzátorok kapcsolása | választható: Háromfázisú, delta (Δ); Háromfázisú, csillag (Y); Egyfázisú; alapérték: Háromfázisú, delta (Δ) | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-UV | U – Vonali feszültség (V) | alapérték: 400 V; megengedett: > 0 és ≤ 100 000 V; csak: Háromfázisú, delta (Δ), Háromfázisú, csillag (Y) | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-U | U – Feszültség (V) | alapérték: 230 V; megengedett: > 0 és ≤ 100 000 V; csak: Egyfázisú | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-F | f – Frekvencia (Hz) | alapérték: 50 Hz; megengedett: > 0 és ≤ 1000 Hz | ☐ | ☐ | |

Programmal összevetve: igen – 25 eset (a program listája, bemeneti korlát), automatikus tesztben.

#### KAL-FAZISJAVITAS-K1 – Kondenzátorteljesítmény

**Szabály.** Qc = P · (tan φ1 − tan φ2), tan φ = √(1 − cos² φ) / cos φ; P a hatásos teljesítmény, cos φ1 a jelenlegi, cos φ2 a kívánt teljesítménytényező.

**Indoklás.** A hatásos teljesítmény a kompenzálás előtt és után azonos; a meddőteljesítmény Q = P · tan φ, így a kondenzátornak a különbséget kell fedeznie.

**Kézzel számolt példa.** P = 10 kW, cos φ1 = 0,7 → tan φ1 = 1,0202; cos φ2 = 0,95 → tan φ2 = 0,32868; Qc = 10 000 · (1,0202 − 0,32868) = 6915,2 var.

**Forrás.** Meddőteljesítmény-kompenzálás alapösszefüggése

**Összevetés.** Programmal összevetve: igen – 1 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-FAZISJAVITAS-K1 | ☐ | ☐ | |

#### KAL-FAZISJAVITAS-K2 – Kapacitás kondenzátoronként és áramok

**Szabály.** Delta (Δ): C = Qc / (3 · ω · U²); csillag (Y): C = Qc / (ω · U²) (kondenzátoronként, U/√3 feszültségen); egyfázisú: C = Qc / (ω · U²); ω = 2π · f. Áram a kompenzálás előtt és után: I = P / (k · U · cos φ), k = √3 háromfázisnál (U a vonali feszültség), 1 egyfázisnál.

**Indoklás.** Deltában minden kondenzátor a vonali feszültségre kapcsolódik és Qc/3-ot ad; csillagban a fázisfeszültségre, így ugyanahhoz a Qc-hez háromszoros kapacitás kell.

**Kézzel számolt példa.** Az előző Qc = 6915,2 var, U = 400 V, f = 50 Hz, ω = 314,1593 1/s: Δ: C = 6915,2 / (3 · 314,1593 · 400²) = 45,858 µF; Y: C = 6915,2 / (314,1593 · 400²) = 137,574 µF. I1 = 10 000 / (√3 · 400 · 0,7) = 20,62 A; I2 = 10 000 / (√3 · 400 · 0,95) = 15,193 A.

**Forrás.** Váltakozó áramú alapösszefüggések (Q = U² · ω · C)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-FAZISJAVITAS-K2 | ☐ | ☐ | |

#### KAL-FAZISJAVITAS-K3 – Egyfázisú fázisjavítás

**Szabály.** Ugyanaz a Qc-képlet (K1); C = Qc / (ω · U²), U a fázisfeszültség (alapértéke 230 V); I = P / (U · cos φ).

**Indoklás.** Egyedi fogyasztó (pl. egyfázisú motor vagy előtétes lámpa) párhuzamos kondenzátora.

**Kézzel számolt példa.** P = 1 kW, cos φ1 = 0,6 → tan φ1 = 1,33333; cos φ2 = 0,95: Qc = 1000 · (1,33333 − 0,32868) = 1004,65 var; C = 1004,65 / (314,1593 · 230²) = 60,452 µF; I1 = 1000 / (230 · 0,6) = 7,246 A; I2 = 1000 / (230 · 0,95) = 4,577 A.

**Forrás.** Meddőteljesítmény-kompenzálás alapösszefüggése

**Összevetés.** Programmal összevetve: igen – 1 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-FAZISJAVITAS-K3 | ☐ | ☐ | |

#### KAL-FAZISJAVITAS-D1 – Hibás cél és túlkompenzálás

**Szabály.** Ha a kívánt cos φ nem nagyobb a jelenleginél, nincs eredmény, a cos φ2 mező alatt: „A kívánt cos φ legyen nagyobb a jelenleginél.” Ha a cél 0,98 fölött van (0,98-nál még nem), figyelmeztetés: „0,98 fölötti cél esetén kis terhelésnél túlkompenzálás (kapacitív üzem) léphet fel; jellemzően fokozatszabályozott telep kell.”

**Indoklás.** Fázisrontó irányú vagy nulla kompenzálásnak nincs értelme; a teljes kompenzálás közelében kis terhelésnél a hálózat kapacitívvá válhat.

**Kézzel számolt példa.** cos φ1 = cos φ2 = 0,9 → hiba; 0,7 → 0,99: Qc = 10 000 · (1,0202 − 0,14249) = 8777,12 var, figyelmeztetéssel; 0,7 → 0,98: figyelmeztetés nélkül.

**Forrás.** – (programozott döntés)

**Összevetés.** Programmal összevetve: igen – 3 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-FAZISJAVITAS-D1 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (KAL-FAZISJAVITAS).

Megjegyzés a blokkhoz (forrás, kiadás):

### KAL-KERESZTMETSZET – Keresztmetszet-választás

Forrás: MSZ HD 60364-5-52:2011 B.52.2, B.52.4 (Iz0), B.52.14 (kθ), B.52.17 (kcs) – a lib/sizing-tables.ts értékeivel; MSZ HD 60364-4-43:2010 433.1

Cél: A legkisebb rézvezeték-keresztmetszet, amelynek javított terhelhetősége (Iz = Iz0 · kθ · kcs) eléri a védelem névleges áramát – a Méretezés fül táblázataival.

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: igen – a kalkulátor az 1. rész jóváhagyása nélkül akkor sem jelenik meg, ha ez a blokk jóvá van hagyva. Tartalmi ujjlenyomat: b7b5caee; forrás-ujjlenyomat: fb81ce00. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-KERESZTMETSZET-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: Egy áramkör vezeték-keresztmetszetének előzetes ellenőrzése a védelem névleges áramához. A tervező Méretezés fülén kapott javaslat gyors ellenőrzése. Mire nem: Tervezői méretezés kiváltására (feszültségesés, zárlati szilárdság, hurokimpedancia is kell). Földben vagy szabad levegőn vezetett kábelre, alumíniumvezetőre. Olvadóbiztosítóval védett áramkör önálló ellenőrzésére (az I2 feltételt külön kell vizsgálni). | ☐ | ☐ | |
| KAL-KERESZTMETSZET-NV | Nem vizsgált (a kalkulátoroldalon) | a méretezési segédszámítással azonos lista (D-HATOKOR) | ☐ | ☐ | |
| KAL-KERESZTMETSZET-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | 1) Iz = Iz0 · kθ · kcs 2) feltétel: In ≤ Iz (MSZ HD 60364-4-43 433.1) | ☐ | ☐ | |
| KAL-KERESZTMETSZET-FELT | Feltételezések (a számítás mellett; a feltételes sorok a feltétellel) | 1) Rézvezető, a táblázat szerinti referencia-szerelési móddal; hőszigetelésben futó hosszú szakasz nélkül. 2) A legkisebb keresztmetszet (1,5 mm² réz) a táblázat első sora. 3) Kismegszakító vagy RCBO (I2 = 1,45 · In, MSZ EN 60898-1, MSZ EN 61009-1): az I2 ≤ 1,45 · Iz feltétel az In ≤ Iz-vel együtt teljesül. Olvadóbiztosítónál az I2 ≤ 1,45 · Iz feltételt külön kell ellenőrizni. 4) Csak a túlterhelés elleni védelem In ≤ Iz feltétele; az Ib ≤ In feltételt, a feszültségesést és a hurokimpedanciát külön kell ellenőrizni. 5) (csak ha Szigetelés: „XLPE (90 °C) – jóváhagyásig PVC-értékkel”) XLPE-szigetelés: a programban nincs jóváhagyott XLPE-táblázat, ezért a PVC-értékekkel számol (kedvezőtlenebb irányban). | ☐ | ☐ | |
| KAL-KERESZTMETSZET-BEM-IN | In – A védelem névleges árama (A) | alapérték: 20 A; megengedett: > 0 és ≤ 500 A; súgó: „Kismegszakító vagy RCBO névleges árama. Olvadóbiztosítónál az I2 ≤ 1,45 · Iz feltételt külön kell ellenőrizni.” | ☐ | ☐ | |
| KAL-KERESZTMETSZET-BEM-MOD | Szerelési mód | választható: A1, A2, B1, B2, C – leírásuk: L-MOD-A1, L-MOD-A2, L-MOD-B1, L-MOD-B2, L-MOD-C; alapérték: B2 (L-MOD-B2) | ☐ | ☐ | |
| KAL-KERESZTMETSZET-BEM-SZIG | Szigetelés | választható: PVC, XLPE – leírásuk: L-SZIG-PVC, L-SZIG-XLPE (XLPE a D-XLPE szerint PVC-értékkel); alapérték: PVC | ☐ | ☐ | |
| KAL-KERESZTMETSZET-BEM-EREK | Terhelt erek | választható: 2 ér (egyfázisú); 3 ér (háromfázisú); alapérték: 2 ér (egyfázisú) | ☐ | ☐ | |
| KAL-KERESZTMETSZET-BEM-TEMP | θ – Környezeti hőmérséklet (°C) | alapérték: 30 °C; megengedett: 10 … 60 °C; egész szám; súgó: „Levegő; a táblázat referenciája 30 °C.” | ☐ | ☐ | |
| KAL-KERESZTMETSZET-BEM-CSOP | n – Együtt vezetett áramkörök száma (db) | alapérték: 1 db; megengedett: 1 … 20 db; egész szám; súgó: „Kötegelve, felületen, beágyazva vagy zártan együtt futó terhelt áramkörök (a sajátot is beleértve).” | ☐ | ☐ | |

Programmal összevetve: igen – 17 eset (a program listája, bemeneti korlát), automatikus tesztben.

#### KAL-KERESZTMETSZET-K1 – Javított terhelhetőség és a legkisebb keresztmetszet

**Szabály.** Iz = Iz0 · kθ · kcs (K-IZ), Iz0 a szerelési mód, a szigetelés, a terhelt erek száma és a keresztmetszet szerint (T-PVC2, T-PVC3), kθ (T-KT), kcs (T-KCS). Eredmény: a T-KM-SOR legkisebb keresztmetszete, amelyre In ≤ Iz (relatív 10⁻⁹ tűréssel); ugyanaz a programfüggvény, mint a Méretezés fül keresztmetszet-javaslata (K-JAV). Mellékeredmény: Iz, Iz0, kθ, kcs és keresztmetszetenkénti táblázat („In ≤ Iz?” oszloppal).

**Indoklás.** Az In ≤ Iz a túlterhelés elleni védelem feltétele (433.1); a kalkulátor bemenete a védelem névleges árama, ezért az Ib ≤ In feltételt nem vizsgálja (D1).

**Kézzel számolt példa.** In = 20 A, B2, PVC, 2 terhelt ér, 30 °C (kθ = 1, T-KT-30), 1 áramkör (kcs = 1, T-KCS-1): 1,5 mm²: Iz = 16,5 A (T-PVC2-B2-1.5) < 20 A; 2,5 mm²: Iz = 23 · 1 · 1 = 23 A (T-PVC2-B2-2.5) ≥ 20 A → 2,5 mm². 3 áramkör együtt (kcs = 0,7, T-KCS-3): 2,5 mm²: 23 · 0,7 = 16,1 A < 20 A; 4 mm²: 30 (T-PVC2-B2-4) · 0,7 = 21 A ≥ 20 A → 4 mm².

**Forrás.** T-PVC2-B2-1.5, T-PVC2-B2-2.5, T-PVC2-B2-4, T-KT-30, T-KCS-1, T-KCS-3 (1. rész); K-IZ, K-JAV (2. rész); MSZ HD 60364-4-43:2010 433.1

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-KERESZTMETSZET-K1 | ☐ | ☐ | |

#### KAL-KERESZTMETSZET-K2 – Egyenlőség és hőmérsékleti lépcső

**Szabály.** A határon (In = Iz) a feltétel teljesül (D-TURES). A környezeti hőmérséklet a következő nagyobb vagy egyenlő lépcsőre kerekít, interpoláció nélkül (D-KEREK).

**Indoklás.** A kedvezőtlenebb lépcső a biztonság javára téved; a pontos egyenlőség lebegőpontos hibával is teljesül.

**Kézzel számolt példa.** In = 32 A, C, 3 terhelt ér: 4 mm²: Iz0 = 32 A (T-PVC3-C-4) → 32 ≤ 32 → 4 mm². In = 25 A, B2, 33 °C → 35 °C, kθ = 0,94 (T-KT-35): 2,5 mm²: 23 (T-PVC2-B2-2.5) · 0,94 = 21,62 A < 25 A; 4 mm²: 30 (T-PVC2-B2-4) · 0,94 = 28,2 A → 4 mm².

**Forrás.** T-PVC3-C-4, T-PVC2-B2-2.5, T-PVC2-B2-4, T-KT-35 (1. rész); D-TURES, D-KEREK (2. rész)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-KERESZTMETSZET-K2 | ☐ | ☐ | |

#### KAL-KERESZTMETSZET-D1 – Nincs elegendő keresztmetszet; csak In ≤ Iz, kismegszakítóra vagy RCBO-ra

**Szabály.** Ha a T-KM-SOR legnagyobb (35 mm²) keresztmetszete sem elegendő, nincs eredmény, az In mező alatt: „A segédszámítás táblázatában (legfeljebb 35 mm²) nincs olyan keresztmetszet, amely ezzel a szerelési móddal elegendő. …”. A kalkulátor csak az In ≤ Iz feltételt vizsgálja. Kismegszakítót vagy RCBO-t feltételez (I2 = 1,45 · In, K-I2): így az I2 ≤ 1,45 · Iz feltétel az In ≤ Iz-vel együtt teljesül; olvadóbiztosítónál ezt külön kell ellenőrizni. Mindkettőt feltételezés-sor mondja ki, és a mező súgója is; az Ib ≤ In-t, a feszültségesést és a hurokimpedanciát a kalkulátor nem vizsgálja (feltételezés-sor). A legkisebb keresztmetszet a táblázat első sora (1,5 mm², T-K-AMIN).

**Indoklás.** Nagyobb keresztmetszetre a táblázat nem tartalmaz értéket; a többi feltételt a Feszültségesés, a Hurokimpedancia és a Kismegszakító-választás kalkulátor vizsgálja. Olvadóbiztosítónál (gG, a megállapodás szerinti kioldóáram jellemzően I2 ≈ 1,6 · In) az In ≤ Iz önmagában nem elég az I2 ≤ 1,45 · Iz feltételhez, ezért a kalkulátor erre külön figyelmeztet.

**Kézzel számolt példa.** In = 125 A, A2, 3 terhelt ér, 30 °C: 35 mm²: Iz0 = 83 A < 125 A → nincs eredmény (hibaüzenet).

**Kérdés a lektorhoz.** Elegendő-e, hogy a kalkulátor kismegszakítót vagy RCBO-t feltételez, és olvadóbiztosítóra (gG) csak a feltételezés-sor és a mező súgója figyelmeztet, vagy a védelem típusát is kérnie kell (gG esetén az I2 ≤ 1,45 · Iz feltétel külön vizsgálatával)?

**Forrás.** T-PVC3-A2-35, T-K-AMIN (1. rész); K-I2 (2. rész)

**Összevetés.** Programmal összevetve: igen – 3 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-KERESZTMETSZET-D1 | ☐ | ☐ | |

#### KAL-KERESZTMETSZET-D2 – XLPE-szigetelés

**Szabály.** XLPE választásakor a D-XLPE szerint számol: PVC Iz0, PVC kθ-sor, 30 °C alatt kθ = 1; erről feltételezés-sor jelenik meg.

**Indoklás.** Amíg az XLPE-táblázat nincs rögzítve (T-XLPE-IZ0, T-XLPE-KT), a kedvezőtlenebb PVC-értékkel számol (D-XLPE).

**Kézzel számolt példa.** In = 20 A, XLPE, B2, 25 °C: kθ = 1 (a PVC-sor 1,06 értéke helyett) → 2,5 mm², Iz = 23 A (PVC-érték).

**Forrás.** T-XLPE-IZ0, T-XLPE-KT (1. rész); D-XLPE (2. rész)

**Összevetés.** Programmal összevetve: igen – 1 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-KERESZTMETSZET-D2 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (KAL-KERESZTMETSZET).

Megjegyzés a blokkhoz (forrás, kiadás):

### KAL-KISMEGSZAKITO – Kismegszakító-választás

Forrás: MSZ HD 60364-4-43:2010 433.1; MSZ EN 60898-1 (I2 = 1,45 · In; pillanatkioldás); MSZ EN 60898-1, 5.3.2 (előnyös névleges áramok); MSZ HD 60364-4-41:2007 411.4.4 – a lib/sizing-tables.ts értékeivel

Cél: A kismegszakító névleges árama az előnyös értéksorból, a terhelés és a vezeték terhelhetősége közé (Ib ≤ In ≤ Iz), a megengedett hurokimpedanciával.

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: igen – a kalkulátor az 1. rész jóváhagyása nélkül akkor sem jelenik meg, ha ez a blokk jóvá van hagyva. Tartalmi ujjlenyomat: a8ff2c9b; forrás-ujjlenyomat: 48c4f6af. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-KISMEGSZAKITO-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: A kismegszakító névleges áramának előzetes kiválasztása adott vezetékhez és terheléshez. Annak ellenőrzése, hogy egy meglévő védelem nem nagyobb-e a vezetéknél. Mire nem: Szelektivitás és zárlati megszakítóképesség (Icn) ellenőrzésére. ÁVK (FI-relé) kiválasztására. | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-NV | Nem vizsgált (a kalkulátoroldalon) | a méretezési segédszámítással azonos lista (D-HATOKOR) | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | 1) Ib ≤ In ≤ Iz 2) I2 = 1,45 · In ≤ 1,45 · Iz 3) Zs,max = cmin · U0 / (m · In); m = 5 (B), 10 (C), 20 (D) | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-FELT | Feltételezések (a számítás mellett; a feltételes sorok a feltétellel) | 1) Rézvezető, a táblázat szerinti referencia-szerelési móddal; hőszigetelésben futó hosszú szakasz nélkül. 2) MSZ EN 60898-1 szerinti kismegszakító (I2 = 1,45 · In). 3) A jelleggörbét a fogyasztó bekapcsolási árama határozza meg (B: általános, C: motoros, induktív terhelés). 4) (csak ha Szigetelés: „XLPE (90 °C) – jóváhagyásig PVC-értékkel”) XLPE-szigetelés: a programban nincs jóváhagyott XLPE-táblázat, ezért a PVC-értékekkel számol (kedvezőtlenebb irányban). | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-BEM-IB | Ib – Tervezett terhelőáram (A) | alapérték: 13 A; megengedett: > 0 és ≤ 500 A | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-BEM-A | Keresztmetszet | választható: 1,5; 2,5; 4; 6; 10; 16; 25; 35 mm² (T-KM-SOR); alapérték: 2,5 mm² | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-BEM-MOD | Szerelési mód | választható: A1, A2, B1, B2, C – leírásuk: L-MOD-A1, L-MOD-A2, L-MOD-B1, L-MOD-B2, L-MOD-C; alapérték: B2 (L-MOD-B2) | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-BEM-SZIG | Szigetelés | választható: PVC, XLPE – leírásuk: L-SZIG-PVC, L-SZIG-XLPE (XLPE a D-XLPE szerint PVC-értékkel); alapérték: PVC | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-BEM-EREK | Terhelt erek | választható: 2 ér (egyfázisú); 3 ér (háromfázisú); alapérték: 2 ér (egyfázisú) | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-BEM-TEMP | θ – Környezeti hőmérséklet (°C) | alapérték: 30 °C; megengedett: 10 … 60 °C; egész szám; súgó: „Levegő; a táblázat referenciája 30 °C.” | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-BEM-CSOP | n – Együtt vezetett áramkörök száma (db) | alapérték: 1 db; megengedett: 1 … 20 db; egész szám; súgó: „Kötegelve, felületen, beágyazva vagy zártan együtt futó terhelt áramkörök (a sajátot is beleértve).” | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-BEM-GORBE | Kioldási jelleggörbe | választható: B, C, D – pillanatkioldás: T-K-M-B, T-K-M-C, T-K-M-D; alapérték: B | ☐ | ☐ | |

Programmal összevetve: igen – 17 eset (a program listája, bemeneti korlát), automatikus tesztben.

#### KAL-KISMEGSZAKITO-K1 – Névleges áram: Ib ≤ In ≤ Iz

**Szabály.** Iz = Iz0 · kθ · kcs a választott keresztmetszetre (K-IZ). A választható névleges áramok a KAL-KOZOS-MCB sor azon elemei, amelyekre Ib ≤ In ≤ Iz (relatív 10⁻⁹ tűréssel); eredmény a legkisebb (fő eredmény, a jelleggörbével, pl. „B16”) és a legnagyobb ilyen érték.

**Indoklás.** A 433.1 (1) feltétel (K-TUL) az előnyös értéksorra alkalmazva; a legkisebb választható In a legnagyobb tartalékot hagyja a vezetékre.

**Kézzel számolt példa.** Ib = 14 A, 2,5 mm², B2, PVC, 2 terhelt ér, 30 °C, 1 áramkör: Iz = 23 A (T-PVC2-B2-2.5, kθ = kcs = 1); 14 ≤ In ≤ 23 → 16, 20 A → In = 16 A (legfeljebb 20 A). Ib = 10 A, 1,5 mm²: Iz = 16,5 A (T-PVC2-B2-1.5) → 10, 13, 16 A → In = 10 A (legfeljebb 16 A).

**Forrás.** KAL-KOZOS-MCB; T-PVC2-B2-2.5, T-PVC2-B2-1.5 (1. rész); K-IZ, K-TUL (2. rész)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-KISMEGSZAKITO-K1 | ☐ | ☐ | |

#### KAL-KISMEGSZAKITO-K2 – Kioldási áram és megengedett hurokimpedancia

**Szabály.** I2 = k · In (T-K-I2, k = 1,45); a feltétel I2 ≤ 1,45 · Iz kismegszakítónál az In ≤ Iz-vel együtt teljesül (K-I2), a levezetés ezt külön sorban írja ki. Zs,max = cmin · U0 / (m · In) a legkisebb választható In-re (K-ZS), m a jelleggörbe szerint (T-K-M-B, T-K-M-C, T-K-M-D); kiírás 3 tizedesre lefelé kerekítve (KAL-KOZOS-KIIRAS).

**Indoklás.** A hurokimpedancia-határ a választott védelemhez tartozik; a tényleges Zs-t a kalkulátor nem ismeri, ezért a verdikt felhívja a mérésre vagy számításra (Hurokimpedancia kalkulátor).

**Kézzel számolt példa.** B16: I2 = 1,45 · 16 = 23,2 A; Zs,max = 1 · 230 / (5 · 16) = 2,875 Ω. C10: I2 = 14,5 A; Zs,max = 1 · 230 / (10 · 10) = 2,3 Ω.

**Kérdés a lektorhoz.** A Zs,max a cmin tényezővel számol (T-K-CMIN); ha a lektor a T-K-CMIN kérdésre 0,95-öt ad meg, a kalkulátor értékei is változnak. Elfogadható-e, hogy a Zs,max csak a legkisebb választható In-re jelenik meg?

**Forrás.** T-K-I2, T-K-CMIN, T-K-U0, T-K-M-B, T-K-M-C (1. rész); K-I2, K-ZS (2. rész)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-KISMEGSZAKITO-K2 | ☐ | ☐ | |

#### KAL-KISMEGSZAKITO-D1 – Nincs választható névleges áram; egyenlőség

**Szabály.** Ha az előnyös sorban nincs Ib ≤ In ≤ Iz érték, a verdikt: „Számítás szerint nincs olyan előnyös névleges áram (MSZ EN 60898-1), amelyre … teljesül: nagyobb keresztmetszet, kedvezőbb szerelési mód vagy kisebb terhelés szükséges.”; ilyenkor csak Iz jelenik meg. Ib = In (és In = Iz) megengedett. A jelleggörbét a felhasználó választja; a bekapcsolási áramot a kalkulátor nem vizsgálja (feltételezés-sor).

**Indoklás.** A megoldás kiválasztása (keresztmetszet, szerelési mód, terhelés) a tervező döntése, a kalkulátor csak a lehetőségeket nevezi meg.

**Kézzel számolt példa.** Ib = 22 A, 2,5 mm² (Iz = 23 A): 22 ≤ In ≤ 23 → nincs előnyös érték. Ib = 16 A: In = 16 A (16 ≤ 16).

**Forrás.** KAL-KOZOS-MCB; T-PVC2-B2-2.5 (1. rész); D-TURES (2. rész)

**Összevetés.** Programmal összevetve: igen – 3 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-KISMEGSZAKITO-D1 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (KAL-KISMEGSZAKITO).

Megjegyzés a blokkhoz (forrás, kiadás):

### KAL-HUROKIMPEDANCIA – Hurokimpedancia és zárlati áram

Forrás: MSZ HD 60364-4-41:2007 411.4.4 (Zs · Ia ≤ U0); MSZ EN 60898-1 (pillanatkioldás: B 5 · In, C 10 · In, D 20 · In); ρ1, cmin, U0: a lib/sizing-tables.ts értékei

Cél: Hurokimpedancia az áramkör végén a hosszból és a keresztmetszetekből, a zárlati áram és a pillanatkioldáshoz tartozó legnagyobb hossz TN-rendszerben.

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: igen – a kalkulátor az 1. rész jóváhagyása nélkül akkor sem jelenik meg, ha ez a blokk jóvá van hagyva. Tartalmi ujjlenyomat: 293f288b; forrás-ujjlenyomat: b6d0b20e. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-HUROKIMPEDANCIA-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: Hosszú áramkörök (kert, melléképület) lekapcsolási feltételének előzetes ellenőrzése. Mért hurokimpedancia és a számított érték összevetése. Mire nem: A helyszíni mérés kiváltására: a kész berendezés hurokimpedanciáját mérni kell. TT-rendszerre és ÁVK-val védett áramkörök igazolására. | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-NV | Nem vizsgált (a kalkulátoroldalon) | a méretezési segédszámítás listája (D-HATOKOR), ebből elhagyva: „alumínium vezető, 35 mm² feletti keresztmetszet, gumiszigetelésű (60 °C-os) vezeték, csökkentett keresztmetszetű N- vagy PE-ér”; kiegészítve: „alumínium vezető, gumiszigetelésű (60 °C-os) vezeték”, „a védővezető keresztmetszetének méretezése és zárlati szilárdsága (543.1)”, „az elosztó előtti hálózat impedanciájának változása és a mérési bizonytalanság” | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | 1) Zs = Ze + ρ1 · L · (1/A + 1/A_PE) 2) Ik = cmin · U0 / Zs 3) Zs ≤ Zs,max = cmin · U0 / (m · In) 4) Lmax = max(0; (Zs,max − Ze) / (ρ1 · (1/A + 1/A_PE))) | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-FELT | Feltételezések (a számítás mellett; a feltételes sorok a feltétellel) | 1) TN-rendszer; a hurok a fázis- és a védővezetőn záródik. 2) Rézvezető, ρ1 = 0,0225 Ω·mm²/m (üzemi hőmérséklet); a vezeték reaktanciája elhanyagolva. 3) (csak ha Kioldási jelleggörbe: „B”) Kismegszakító (MSZ EN 60898-1) pillanatkioldási tartományának felső határa: B → 5 · In. 4) (csak ha Kioldási jelleggörbe: „C”) Kismegszakító (MSZ EN 60898-1) pillanatkioldási tartományának felső határa: C → 10 · In. 5) (csak ha Kioldási jelleggörbe: „D”) Kismegszakító (MSZ EN 60898-1) pillanatkioldási tartományának felső határa: D → 20 · In. | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-BEM-ZE | Ze – Hurokimpedancia az elosztónál (Ω) | alapérték: 0,35 Ω; megengedett: 0 … 20 Ω; súgó: „Mért vagy az elosztói engedélyestől kapott érték az áramkör kezdetén.” | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-BEM-L | L – Vezetékhossz (egy irányban), m | alapérték: 25 m; megengedett: > 0 és ≤ 5000 m | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-BEM-A | A – Fázisvezető keresztmetszete (mm²) | alapérték: 2,5 mm²; megengedett: > 0 és ≤ 35 mm²; súgó: „Rézvezető, legfeljebb 35 mm² (a segédszámítás tartománya).” | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-BEM-APE | A_PE – Védővezető keresztmetszete (mm²) | alapérték: nincs (üres); megengedett: > 0 és ≤ 35 mm²; nem kötelező; súgó: „Üresen a fázisvezetővel azonos. A védővezető méretezését (543.1) a kalkulátor nem vizsgálja.” | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-BEM-GORBE | Kioldási jelleggörbe | választható: B, C, D – pillanatkioldás: T-K-M-B, T-K-M-C, T-K-M-D; alapérték: B | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-BEM-IN | Névleges áram | választható: a KAL-KOZOS-MCB szerinti előnyös névleges áramok; alapérték: 16 A | ☐ | ☐ | |

Programmal összevetve: igen – 18 eset (a program listája, bemeneti korlát), automatikus tesztben.

#### KAL-HUROKIMPEDANCIA-K1 – Hurokimpedancia és zárlati áram

**Szabály.** R = ρ1 · L · (1/A + 1/A_PE) (K-ZS, ugyanaz a programfüggvény); Zs = Ze + R, ahol Ze a megadott hurokimpedancia az elosztónál; Ik = cmin · U0 / Zs. A_PE üresen = A.

**Indoklás.** TN-rendszerben a hibahurok a fázis- és a védővezetőn záródik; a vezeték reaktanciáját a kalkulátor elhanyagolja (D-PE), ρ1 az üzemi hőmérsékletű érték (T-K-RHO1).

**Kézzel számolt példa.** Ze = 0,35 Ω, L = 25 m, A = A_PE = 2,5 mm²: R = 0,0225 · 25 · (1/2,5 + 1/2,5) = 0,45 Ω; Zs = 0,35 + 0,45 = 0,8 Ω; Ik = 1 · 230 / 0,8 = 287,5 A. Ze = 0,5 Ω, 40 m, 1,5 mm²: R = 0,0225 · 40 · (2/1,5) = 1,2 Ω; Zs = 1,7 Ω; Ik = 135,294 A.

**Forrás.** T-K-RHO1, T-K-CMIN, T-K-U0 (1. rész); K-ZS, D-PE (2. rész)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-HUROKIMPEDANCIA-K1 | ☐ | ☐ | |

#### KAL-HUROKIMPEDANCIA-K2 – Megengedett hurokimpedancia és legnagyobb hossz

**Szabály.** Zs,max = cmin · U0 / (m · In) (K-ZS; m: T-K-M-B, T-K-M-C, T-K-M-D; In a KAL-KOZOS-MCB sorból), kiírás 3 tizedesre lefelé kerekítve (KAL-KOZOS-KIIRAS). Feltétel: Zs ≤ Zs,max (relatív 10⁻⁹ tűréssel, a kerekítetlen értékekkel). Lmax = max(0; (Zs,max − Ze) / (ρ1 · (1/A + 1/A_PE))), kiírás 0,1 m-re lefelé kerekítve.

**Indoklás.** A pillanatkioldás felső határán (m · In) a kismegszakító a kikapcsolási időn belül old; az Lmax a feltétel átrendezése a hosszra.

**Kézzel számolt példa.** B16: Zs,max = 1 · 230 / (5 · 16) = 2,875 Ω; 0,8 ≤ 2,875 → „Számítás szerint a pillanatkioldás feltétele teljesül”; Lmax = (2,875 − 0,35) / (0,0225 · 0,8) = 140,2778 m → 140,2 m (lefelé kerekítve). B10, Ze = 0,5 Ω, 1,5 mm²: Zs,max = 4,6 Ω; Lmax = (4,6 − 0,5) / 0,03 = 136,6667 m → 136,6 m (lefelé kerekítve).

**Kérdés a lektorhoz.** A számítás a cmin tényezővel fut (T-K-CMIN = 1); ha a T-K-CMIN kérdésre adott válasz 0,95, a Zs,max, az Ik és az Lmax is változik.

**Forrás.** T-K-CMIN, T-K-U0, T-K-M-B (1. rész); K-ZS (2. rész)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-HUROKIMPEDANCIA-K2 | ☐ | ☐ | |

#### KAL-HUROKIMPEDANCIA-D1 – Nem teljesülő feltétel

**Szabály.** Ha Zs > Zs,max: „Számítás szerint a pillanatkioldás feltétele nem teljesül: … Lehetséges megoldás: … – a döntés a tervező feladata.” A felsorolt megoldások: nagyobb keresztmetszet és rövidebb vezeték (csak ha Ze < Zs,max, mert különben a vezeték nem segít), B jelleggörbe a bekapcsolási áram ellenőrzésével (csak C vagy D jelleggörbénél), kisebb névleges áram, ÁVK. A tervező Méretezés füle ugyanezt a felsorolást használja. ÁVK-val védett áramkört és TT-rendszert a kalkulátor nem igazol (Mire nem).

**Indoklás.** A kalkulátor nem dönti el, melyik megoldás alkalmazható; csak az adott esetben ténylegesen segítő lehetőségeket sorolja fel (a kisebb névleges áramnál az Ib ≤ In feltételt is ellenőrizni kell).

**Kézzel számolt példa.** Ze = 0,35 Ω, L = 100 m, A = 1,5 mm², C16: R = 0,0225 · 100 · (2/1,5) = 3 Ω; Zs = 3,35 Ω > Zs,max = 1,4375 Ω → nem teljesül; Lmax = (1,4375 − 0,35) / 0,03 = 36,25 m → 36,2 m (lefelé kerekítve); megoldás: „nagyobb keresztmetszet, rövidebb vezeték, B jelleggörbe (a bekapcsolási áram ellenőrzésével), kisebb névleges áram vagy ÁVK”. Ugyanez B16-tal: Zs,max = 2,875 Ω, 3,35 > 2,875 → „nagyobb keresztmetszet, rövidebb vezeték, kisebb névleges áram vagy ÁVK”. Ze = 3 Ω, B16 (Ze ≥ Zs,max): „kisebb névleges áram vagy ÁVK”; Ze = 1,5 Ω, C16 (Ze ≥ 1,4375 Ω): „B jelleggörbe (a bekapcsolási áram ellenőrzésével), kisebb névleges áram vagy ÁVK”.

**Forrás.** T-K-M-B, T-K-M-C (1. rész); K-ZS, D-AVK (2. rész)

**Összevetés.** Programmal összevetve: igen – 4 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-HUROKIMPEDANCIA-D1 | ☐ | ☐ | |

#### KAL-HUROKIMPEDANCIA-D2 – Csökkentett védővezető és túl nagy Ze

**Szabály.** A védővezető keresztmetszete külön megadható (A_PE, legfeljebb 35 mm²); üresen a fázisvezetővel azonos. Ha már Ze ≥ Zs,max, figyelmeztetés: „Már az elosztónál mért hurokimpedancia is eléri a megengedett értéket: ezzel a védelemmel az áramkör nem rövidíthető le eléggé.”, és Lmax = 0. Ze = 0 is megadható. A „Nem vizsgált” lista a méretezésétől eltér: a kalkulátor számol a csökkentett védővezetővel, és 35 mm² felett nem enged bevitelt, ezért ezek nem szerepelnek benne; helyettük „a védővezető keresztmetszetének méretezése és zárlati szilárdsága (543.1)” (KAL-HUROKIMPEDANCIA-NV).

**Indoklás.** A tervező Méretezés füle a csökkentett PE-erű kábelt nem számolja (D-BLOKK, D-PE), mert ott a kábeljelölésből kellene kiolvasni; a kalkulátor a megadott A_PE-vel számol, de a PE méretezését (543.1) nem vizsgálja.

**Kézzel számolt példa.** A = 2,5 mm², A_PE = 1,5 mm², L = 20 m, Ze = 0,3 Ω, B16: R = 0,0225 · 20 · (1/2,5 + 1/1,5) = 0,48 Ω; Zs = 0,78 Ω; Lmax = (2,875 − 0,3) / (0,0225 · (1/2,5 + 1/1,5)) = 107,292 m → 107,2 m (lefelé kerekítve). Ze = 3 Ω, B16 (Zs,max = 2,875 Ω): figyelmeztetés, Lmax = 0 m.

**Kérdés a lektorhoz.** Elegendő-e, hogy a kalkulátor a megadott (csökkentett) védővezetővel számol, de a védővezető keresztmetszetének méretezését (543.1) nem vizsgálja, csak a „Nem vizsgált” lista említi?

**Forrás.** D-BLOKK, D-PE, D-HATOKOR (2. rész)

**Összevetés.** Programmal összevetve: igen – 4 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-HUROKIMPEDANCIA-D2 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (KAL-HUROKIMPEDANCIA).

Megjegyzés a blokkhoz (forrás, kiadás):

### KAL-TERHELHETOSEG-TABLAZAT – Terhelhetőségi táblázat

Forrás: MSZ HD 60364-5-52:2011 B.52.2, B.52.4, B.52.14, B.52.17 – a lib/sizing-tables.ts értékeivel (jóváhagyás függőben)

Cél: Rézvezetékek terhelhetősége (Iz0) 1,5–35 mm²-ig a választott szerelési módra, hőmérsékletre és csoportosításra javítva (Iz = Iz0 · kθ · kcs).

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: igen – a kalkulátor az 1. rész jóváhagyása nélkül akkor sem jelenik meg, ha ez a blokk jóvá van hagyva. Tartalmi ujjlenyomat: 135442b5; forrás-ujjlenyomat: 5f043d00. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-TERHELHETOSEG-TABLAZAT-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: Gyors áttekintés: melyik keresztmetszet mekkora áramot bír az adott szerelési módban. A Keresztmetszet-választás és a Kismegszakító-választás eredményeinek ellenőrzése. Mire nem: Gyártói adatlap helyett speciális kábelekre (pl. gumiszigetelésű, árnyékolt, hőálló). Földben, szabad levegőn vagy kábeltálcán vezetett kábelekre (D, E, F, G mód). | ☐ | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT-NV | Nem vizsgált (a kalkulátoroldalon) | a méretezési segédszámítással azonos lista (D-HATOKOR) | ☐ | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | 1) Iz = Iz0 · kθ · kcs | ☐ | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT-FELT | Feltételezések (a számítás mellett; a feltételes sorok a feltétellel) | 1) Rézvezető, a táblázat szerinti referencia-szerelési móddal; hőszigetelésben futó hosszú szakasz nélkül. 2) (csak ha Szigetelés: „XLPE (90 °C) – jóváhagyásig PVC-értékkel”) XLPE-szigetelés: a programban nincs jóváhagyott XLPE-táblázat, ezért a PVC-értékekkel számol (kedvezőtlenebb irányban). | ☐ | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT-BEM-MOD | Szerelési mód | választható: A1, A2, B1, B2, C – leírásuk: L-MOD-A1, L-MOD-A2, L-MOD-B1, L-MOD-B2, L-MOD-C; alapérték: B2 (L-MOD-B2) | ☐ | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT-BEM-SZIG | Szigetelés | választható: PVC, XLPE – leírásuk: L-SZIG-PVC, L-SZIG-XLPE (XLPE a D-XLPE szerint PVC-értékkel); alapérték: PVC | ☐ | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT-BEM-EREK | Terhelt erek | választható: 2 ér (egyfázisú); 3 ér (háromfázisú); alapérték: 2 ér (egyfázisú) | ☐ | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT-BEM-TEMP | θ – Környezeti hőmérséklet (°C) | alapérték: 30 °C; megengedett: 10 … 60 °C; egész szám; súgó: „Levegő; a táblázat referenciája 30 °C.” | ☐ | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT-BEM-CSOP | n – Együtt vezetett áramkörök száma (db) | alapérték: 1 db; megengedett: 1 … 20 db; egész szám; súgó: „Kötegelve, felületen, beágyazva vagy zártan együtt futó terhelt áramkörök (a sajátot is beleértve).” | ☐ | ☐ | |

Programmal összevetve: igen – 13 eset (a program listája, bemeneti korlát), automatikus tesztben.

#### KAL-TERHELHETOSEG-TABLAZAT-K1 – Javított terhelhetőség keresztmetszetenként

**Szabály.** Minden T-KM-SOR keresztmetszetre Iz = Iz0 · kθ · kcs (K-IZ); a táblázat soronként az Iz0-t, az Iz-t és a forrást (táblázatszám, szerelési mód, keresztmetszet, terhelt erek, szigetelés, a táblázat állapota) mutatja. kθ és kcs egyszer, forrással.

**Indoklás.** Áttekintő táblázat a választott körülményekre; az értékek ugyanazok, mint a Méretezés fülön és a Keresztmetszet-választásnál.

**Kézzel számolt példa.** B2, PVC, 2 terhelt ér, 30 °C, 1 áramkör: kθ = 1 (T-KT-30), kcs = 1 (T-KCS-1), így minden sorban Iz = Iz0, azaz a T-PVC2 tábla B2 oszlopa; például 2,5 mm²: Iz = 23 · 1 · 1 = 23 A (T-PVC2-B2-2.5). A teszt mind a 8 sort összeveti.

**Forrás.** T-PVC2 (B2 oszlop), T-KT-30, T-KCS-1 (1. rész); K-IZ (2. rész)

**Összevetés.** Programmal összevetve: igen – 1 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-TERHELHETOSEG-TABLAZAT-K1 | ☐ | ☐ | |

#### KAL-TERHELHETOSEG-TABLAZAT-K2 – Csökkentő tényezőkkel

**Szabály.** Ugyanaz a képlet (K1); a hőmérséklet a következő nagyobb vagy egyenlő lépcsőre, az áramkörszám a következő nagyobb vagy egyenlő oszlopra kerekít (D-KEREK). Háromfázisnál (3 terhelt ér) a T-PVC3 sorai.

**Indoklás.** A kedvezőtlenebb lépcső a biztonság javára téved.

**Kézzel számolt példa.** B2, 35 °C, 3 áramkör: kθ = 0,94 (T-KT-35), kcs = 0,7 (T-KCS-3), kθ · kcs = 0,658: 1,5 mm²: 16,5 (T-PVC2-B2-1.5) · 0,658 = 10,857 A; 2,5 mm²: 23 (T-PVC2-B2-2.5) · 0,658 = 15,134 A; 35 mm²: 111 (T-PVC2-B2-35) · 0,658 = 73,038 A. C, 3 terhelt ér, 30 °C (kθ = kcs = 1): 1,5 mm²: Iz = Iz0 (T-PVC3-C-1.5); 6 mm²: Iz = Iz0 (T-PVC3-C-6).

**Forrás.** T-KT-35, T-KCS-3, T-PVC2-B2-1.5, T-PVC2-B2-2.5, T-PVC2-B2-35, T-PVC3-C-1.5, T-PVC3-C-6 (1. rész); D-KEREK (2. rész)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-TERHELHETOSEG-TABLAZAT-K2 | ☐ | ☐ | |

#### KAL-TERHELHETOSEG-TABLAZAT-D1 – XLPE és a forrásoszlop

**Szabály.** XLPE választásakor a D-XLPE szerint PVC-értékekkel számol (30 °C alatt kθ = 1), erről feltételezés-sor jelenik meg. A forrásoszlop a táblázat állapotát is kiírja („ellenőrizendő” az 1. rész jóváhagyásáig, utána „jóváhagyott”).

**Indoklás.** A felhasználó minden értéknél lássa, hogy a táblázatérték jóváhagyott-e.

**Kézzel számolt példa.** XLPE, B2, 2 terhelt ér, 25 °C: kθ = 1 → 2,5 mm²: 23 A (PVC-érték).

**Forrás.** T-XLPE-IZ0, T-XLPE-KT (1. rész); D-XLPE (2. rész)

**Összevetés.** Programmal összevetve: igen – 1 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-TERHELHETOSEG-TABLAZAT-D1 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (KAL-TERHELHETOSEG-TABLAZAT).

Megjegyzés a blokkhoz (forrás, kiadás):

## 4. rész – Bekötési ábrák (R3)

A Villanyszerelő Tudástár Sémák szekciójának és biztonsági cikkeinek bekötési ábrái. Minden ábra egy netlistából (alkatrészek, kapcsok, erek szerepe és színe, kábelszakaszok, kapcsolóállások) és egy elrendezésből (helyek, útvonalak) készül; a program ugyanebből rajzolja a cikk ábráját, a vezetéktáblát és a Működés nézetet. Ábránként egy blokk: az ábra (Bekötés nézet, alapállás), a jelmagyarázat, a vezetéktábla, a szakaszok érszáma és a kapcsolóállás-táblázat, a netlista és az ábra ujjlenyomatával.

Az ábra és a netlista egyezését (a vezetékvégpontok a kapcsokon, a csomópontok, az érszínek, a feliratok, az érintkezők) automatikus teszt ellenőrzi; a kapcsolóállás-táblázatot két, egymástól független szimulátor (TypeScript és Python) számolja azonosan. A lektortól a villamos tartalom ellenőrzését kérjük: helyes-e a bekötés, az érszín-kiosztás, a kapcsok szerepe, a szakaszok érszáma és a működés minden állásban, és alkalmas-e a rajz szakember tájékoztatására.

Biztonságkritikus (R3) tartalom: az ábrát a lektor és egy második olvasó hagyja jóvá (Jóváhagyó lap, „4. rész – ábránkénti döntés”). A cikk csak akkor jelenik meg, ha minden ábrája jóváhagyott, és a cikk szövegét is jóváhagyták (az 5. rész elkészültéig a cikkvázlat alapján: content/tudastar/r3/*.md, docs/lektoralas.md). Az ábra bármely változása (netlista, elrendezés, szimbólum, rajzoló kód, ábraszín) új ujjlenyomatot ad: a cikk ilyenkor „újraellenőrzendő”, és új jóváhagyás kell.

A rajzon az erek színe a valódi ér színe (a zöld-sárga ér zöld alapon sárga csíkos); a szín mellett minden éren felirat áll. A tervező alaprajzán a védővezető egyszínű zöld (az ábra „Így látod a tervezőben” sora ezt magyarázza). A szaggatott szürke vonal készüléken belüli kötést vagy érintési pontot, a piros szaggatott vonal jelképes hibahelyet jelöl – ezek nem szerelt erek.

### BEK-EGYPOLUSU-KAPCSOLO-101 – Egypólusú kapcsoló (101): egy lámpa egy helyről

Forrás: content/tudastar/r3/egypolusu-kapcsolo-101-bekotese.netlist.json (netlista), content/tudastar/diagramok/egypolusu-kapcsolo-101.json (elrendezés); cikk: egypolusu-kapcsolo-101-bekotese, abra-1 („Egypólusú kapcsoló (101) bekötése kötődobozzal”)

Ábra-azonosító: egypolusu-kapcsolo-101. Netlista-ujjlenyomat: 162c980a; ábra-ujjlenyomat: 0b299afb (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (2 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó.

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 1.) Kék ér kapcsolt fázisként vagy váltóvezetékként, ha a szakaszban nincs nullavezető, és a végén tartós jelölés van: a cikkek ezt megengedettként írják (MSZ HD 60364-5-51 514.3). A hazai értelmezést és a jelölés módját a lektor erősítse meg; a szimulátor a kék fázisvezetőt jelenleg mindig hibának veszi.

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 2.) R3 bekötési cikkek audience mezőjében szerepel a „laikus”, közben a cikkekben lépésenkénti szerelési sorrend van. Most „A szerelés menete szakembernek” cím és „ne használd szerelési útmutatóként” mondat jelzi a korlátot. Döntés kell: kikerüljön-e a laikus az audience-ből, vagy rejtve legyen-e laikusnak ez a szakasz (terv 8.2: „nem barkácsútmutató”).

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 3.) Ajánljuk vagy csak megemlítjük, hogy a 106-os kapcsoló egypólusúként, a 107-es a sor végén váltókapcsolóként is beköthető? A szimuláció szerint mindkettő működik, de a szabad kapocs fázis alá kerül. Ezt most a cikkek figyelmeztetéssel írják.

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 4.) A FI-relé korlátairól szóló új mondatok szakmai megfogalmazása: L–N érintésnél „nem feltétlenül old ki”, a nullát bontó kapcsolót és a felcserélt polaritást nem jelzi. Kell-e hivatkozni a FI-relé cikkre, vagy a figyelmeztetés-könyvtár egy tétele legyen?

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 5.) A „bizsergés” teendő (ne érintsd újra, kapcsold le az áramkört az elosztóban, ne kapcsold vissza) laikusnak szóló cselekvési utasítás. Igazodjon-e szó szerint a lib/kb/safety.ts tervezett `elsosegely` és `munkavegzes` tételeihez (szakmai és jogi jóváhagyás)?

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 6.) Az új, félkövér felvezetésű „A kikapcsolt lámpa nem feszültségmentes / mellett is van feszültség” bekezdések a 101-es, 106-os és 107-es cikkben legyenek-e a terv 8.1 szerinti egy inline doboz (például `munkavegzes` vagy `meres`)?

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 7.) Közös nulla két áramkörre, különböző fázisokról: a cikk szerint a nulla szakadásakor a fogyasztók sorba kapcsolódva a két fázis közötti feszültségre kerülhetnek. A szakmai megfogalmazást a lektor ellenőrizze.

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 8.) Lépcsőházi világítás táplálása a közös hálózatról (a lakás elosztójától függetlenül): a lektor erősítse meg, és döntse el, kell-e REG jelölés.

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 9.) A kapcsolási netlisták TN-S/TN-C-S rendszert tételeznek fel (a betápnak külön N- és PE-kapcsa van). A PEN-t érintő állítások (PEN kapcsolása, PEN-szétválasztás utáni összekötés) csak szövegként szerepelnek, nincs mögöttük netlista. Modellezzük-e ezeket a földelési bővítéssel (foldeles_ext), például a 102-es kapcsoló TN-C változatán?

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 10.) Szabványpontok (front matter, „lektor ellenőrizze”): az MSZ HD 60364-5-537 honosítási éve és alpontjai, az MSZ HD 60364-5-559 menetes foglalatra vonatkozó alpontja, az MSZ EN 60335-1 7.12.2, az MSZ HD 60364-6 6.4.x. Változatlanok; lektori ellenőrzésre várnak.

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 11.) Ajánlott érszín-kiosztás a netlistákban: barna a betáp, fekete a kapcsolt fázis, szürke a váltóvezeték; a 102-esnél háromeres kábellel barna a kapcsolt fázis. A lektor erősítse meg ajánlásként; a tervező egyszínű zöld PE-jéről az 5. fázisban döntenek.

**Kérdés a lektorhoz (BEK-EGYPOLUSU-KAPCSOLO-101).** (Világítási kapcsolások (101–107) – közös kérdés 12.) A gyűjtőoldal prózája 1488 szó, az 1500-as határ közelében. További bővítéshez rövidíteni kell.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (egypolusu-kapcsolo-101, ábra-ujjlenyomat 0b299afb).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); Lk – kapcsolt fázis (fekete).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | Kapcsoló (101): L kapocs (betáp) | L | barna | Kötődoboz – kapcsoló |
| 5 | Kapcsoló (101): 1-es kapocs (kimenet) | Kötődoboz: kapcsoltfázis-kötés | kapcsolt fázis | fekete | Kötődoboz – kapcsoló |
| 6 | Kötődoboz: kapcsoltfázis-kötés | Lámpa: L (fázis) | kapcsolt fázis | fekete | Kötődoboz – lámpa |
| 7 | Kötődoboz: N-kötés | Lámpa: N | N | kék | Kötődoboz – lámpa |
| 8 | Kötődoboz: PE-kötés | Lámpa: PE | PE | zöld-sárga | Kötődoboz – lámpa |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – kapcsoló | L (barna), kapcsolt fázis (fekete) | 2 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (2 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: S1 – Kapcsoló (101).

| S1 | Eredmény (a szimuláció szerint) |
|---|---|
| ki | Lámpa: nem ég |
| be | Lámpa: ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-EGYPOLUSU-KAPCSOLO-101-NL | Netlista (a rajz és a táblák forrása) | egypolusu-kapcsolo-101-bekotese.netlist.json · 162c980a | ☐ | ☐ | |
| BEK-EGYPOLUSU-KAPCSOLO-101-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · 0b299afb | ☐ | ☐ | |
| BEK-EGYPOLUSU-KAPCSOLO-101-VEZ | Vezetéktábla (8 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-EGYPOLUSU-KAPCSOLO-101-SZAK | Szakaszok és érszám (3 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-EGYPOLUSU-KAPCSOLO-101-ALL | Kapcsolóállás-táblázat (2 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-EGYPOLUSU-KAPCSOLO-101):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-EGYPOLUSU-KAPCSOLO-101).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KETPOLUSU-KAPCSOLO-102 – Kétpólusú kapcsoló (102): a fázis- és a nullavezető együttes bontása

Forrás: content/tudastar/r3/ketpolusu-kapcsolo-102-bekotese.netlist.json (netlista), content/tudastar/diagramok/ketpolusu-kapcsolo-102.json (elrendezés); cikk: ketpolusu-kapcsolo-102-bekotese, abra-1 („Kétpólusú kapcsoló (102) bekötése”)

Ábra-azonosító: ketpolusu-kapcsolo-102. Netlista-ujjlenyomat: a253fd8a; ábra-ujjlenyomat: 361fdb2a (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (2 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. Ebben a változatban a betáp a kapcsolódobozon át megy a fogyasztóhoz; a védővezető a kapcsolódobozban, kapcsolón kívül, vezetékösszekötővel folytatódik. A fogyasztóhoz háromeres kábel megy, ezért itt – a fenti kiosztástól eltérően – a kapcsolt fázis barna, a kapcsolt nulla kék.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (ketpolusu-kapcsolo-102, ábra-ujjlenyomat 361fdb2a).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); Lk – kapcsolt fázis (barna); Nk – kapcsolt nullavezető (kék).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kapcsoló (102): L kapocs (betáp) | L | barna | Betáp – kapcsolódoboz |
| 2 | Betáp: N | Kapcsoló (102): N kapocs (betáp) | N | kék | Betáp – kapcsolódoboz |
| 3 | Betáp: PE | Kapcsolódoboz: PE-összekötő | PE | zöld-sárga | Betáp – kapcsolódoboz |
| 4 | Kapcsoló (102): L kimenet | Lámpa (vagy más fogyasztó): L (fázis) | kapcsolt fázis | barna | Kapcsolódoboz – lámpa |
| 5 | Kapcsoló (102): N kimenet | Lámpa (vagy más fogyasztó): N | kapcsolt nulla | kék | Kapcsolódoboz – lámpa |
| 6 | Kapcsolódoboz: PE-összekötő | Lámpa (vagy más fogyasztó): PE | PE | zöld-sárga | Kapcsolódoboz – lámpa |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Betáp – kapcsolódoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kapcsolódoboz – lámpa | kapcsolt fázis (barna), kapcsolt nulla (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (2 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: S1 – Kapcsoló (102).

| S1 | Eredmény (a szimuláció szerint) |
|---|---|
| ki | Lámpa (vagy más fogyasztó): nem ég |
| be | Lámpa (vagy más fogyasztó): ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-KETPOLUSU-KAPCSOLO-102-NL | Netlista (a rajz és a táblák forrása) | ketpolusu-kapcsolo-102-bekotese.netlist.json · a253fd8a | ☐ | ☐ | |
| BEK-KETPOLUSU-KAPCSOLO-102-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · 361fdb2a | ☐ | ☐ | |
| BEK-KETPOLUSU-KAPCSOLO-102-VEZ | Vezetéktábla (6 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KETPOLUSU-KAPCSOLO-102-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KETPOLUSU-KAPCSOLO-102-ALL | Kapcsolóállás-táblázat (2 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-KETPOLUSU-KAPCSOLO-102):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KETPOLUSU-KAPCSOLO-102).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-CSILLARKAPCSOLO-105 – Csillárkapcsoló (105): két lámpakör egy helyről

Forrás: content/tudastar/r3/csillarkapcsolo-105-bekotese.netlist.json (netlista), content/tudastar/diagramok/csillarkapcsolo-105.json (elrendezés); cikk: csillarkapcsolo-105-bekotese, abra-1 („Csillárkapcsoló (105) bekötése”)

Ábra-azonosító: csillarkapcsolo-105. Netlista-ujjlenyomat: 171c858b; ábra-ujjlenyomat: f7930873 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A két kapcsolt fázis itt: 1. kör fekete, 2. kör szürke (felirattal).

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (csillarkapcsolo-105, ábra-ujjlenyomat f7930873).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); Lk1 – kapcsolt fázis (fekete); Lk2 – kapcsolt fázis (szürke).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | Csillárkapcsoló (105): L kapocs (közös betáp) | L | barna | Kötődoboz – kapcsoló |
| 5 | Csillárkapcsoló (105): 1-es kapocs (1. kör) | Kötődoboz: 1. kör kapcsoltfázis-kötése | kapcsolt fázis 1 | fekete | Kötődoboz – kapcsoló |
| 6 | Csillárkapcsoló (105): 2-es kapocs (2. kör) | Kötődoboz: 2. kör kapcsoltfázis-kötése | kapcsolt fázis 2 | szürke | Kötődoboz – kapcsoló |
| 7 | Kötődoboz: 1. kör kapcsoltfázis-kötése | Csillár sorkapcsa: 1 | kapcsolt fázis 1 | fekete | Kötődoboz – csillár |
| 8 | Kötődoboz: 2. kör kapcsoltfázis-kötése | Csillár sorkapcsa: 2 | kapcsolt fázis 2 | szürke | Kötődoboz – csillár |
| 9 | Kötődoboz: N-kötés | Csillár sorkapcsa: N | N | kék | Kötődoboz – csillár |
| 10 | Kötődoboz: PE-kötés | Csillár sorkapcsa: PE | PE | zöld-sárga | Kötődoboz – csillár |
| 11 | Csillár sorkapcsa: 1 | 1. lámpacsoport: L (fázis) | kapcsolt fázis 1 | fekete | dobozon belül |
| 12 | Csillár sorkapcsa: 2 | 2. lámpacsoport: L (fázis) | kapcsolt fázis 2 | szürke | dobozon belül |
| 13 | Csillár sorkapcsa: N | 1. lámpacsoport: N | N | kék | dobozon belül |
| 14 | Csillár sorkapcsa: N | 2. lámpacsoport: N | N | kék | dobozon belül |
| 15 | Csillár sorkapcsa: PE | 1. lámpacsoport: PE | PE | zöld-sárga | dobozon belül |
| 16 | Csillár sorkapcsa: PE | 2. lámpacsoport: PE | PE | zöld-sárga | dobozon belül |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – kapcsoló | L (barna), kapcsolt fázis 1 (fekete), kapcsolt fázis 2 (szürke) | 3 |
| Kötődoboz – csillár | kapcsolt fázis 1 (fekete), kapcsolt fázis 2 (szürke), N (kék), PE (zöld-sárga) | 4 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: S1.b1 – Csillárkapcsoló (105) – 1. billentyű; S1.b2 – Csillárkapcsoló (105) – 2. billentyű.

| S1.b1 | S1.b2 | Eredmény (a szimuláció szerint) |
|---|---|---|
| ki | ki | 1. lámpacsoport: nem ég; 2. lámpacsoport: nem ég |
| ki | be | 1. lámpacsoport: nem ég; 2. lámpacsoport: ég |
| be | ki | 1. lámpacsoport: ég; 2. lámpacsoport: nem ég |
| be | be | 1. lámpacsoport: ég; 2. lámpacsoport: ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-CSILLARKAPCSOLO-105-NL | Netlista (a rajz és a táblák forrása) | csillarkapcsolo-105-bekotese.netlist.json · 171c858b | ☐ | ☐ | |
| BEK-CSILLARKAPCSOLO-105-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · f7930873 | ☐ | ☐ | |
| BEK-CSILLARKAPCSOLO-105-VEZ | Vezetéktábla (16 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-CSILLARKAPCSOLO-105-SZAK | Szakaszok és érszám (3 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-CSILLARKAPCSOLO-105-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-CSILLARKAPCSOLO-105):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-CSILLARKAPCSOLO-105).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-VALTOKAPCSOLO-106 – Váltókapcsolás (2 × 106): egy lámpa két helyről

Forrás: content/tudastar/r3/valtokapcsolo-106-bekotese.netlist.json (netlista), content/tudastar/diagramok/valtokapcsolo-106.json (elrendezés); cikk: valtokapcsolo-106-bekotese, abra-1 („Váltókapcsolás két 106-os kapcsolóval”)

Ábra-azonosító: valtokapcsolo-106. Netlista-ujjlenyomat: 909db559; ábra-ujjlenyomat: 79d7b08a (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (valtokapcsolo-106, ábra-ujjlenyomat 79d7b08a).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); 1, 2 – váltóvezeték (szürke); Lk – kapcsolt fázis (fekete).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | K1 (A hely): közös kapocs (C) | L | barna | Kötődoboz – K1 (A hely) |
| 5 | K1 (A hely): 1-es kapocs | Kötődoboz: 1-es váltóvezeték kötése | váltóvezeték 1 | szürke | Kötődoboz – K1 (A hely) |
| 6 | K1 (A hely): 2-es kapocs | Kötődoboz: 2-es váltóvezeték kötése | váltóvezeték 2 | szürke | Kötődoboz – K1 (A hely) |
| 7 | Kötődoboz: 1-es váltóvezeték kötése | K2 (B hely): 1-es kapocs | váltóvezeték 1 | szürke | Kötődoboz – K2 (B hely) |
| 8 | Kötődoboz: 2-es váltóvezeték kötése | K2 (B hely): 2-es kapocs | váltóvezeték 2 | szürke | Kötődoboz – K2 (B hely) |
| 9 | K2 (B hely): közös kapocs (C) | Kötődoboz: kapcsoltfázis-kötés | kapcsolt fázis | fekete | Kötődoboz – K2 (B hely) |
| 10 | Kötődoboz: kapcsoltfázis-kötés | Lámpa: L (fázis) | kapcsolt fázis | fekete | Kötődoboz – lámpa |
| 11 | Kötődoboz: N-kötés | Lámpa: N | N | kék | Kötődoboz – lámpa |
| 12 | Kötődoboz: PE-kötés | Lámpa: PE | PE | zöld-sárga | Kötődoboz – lámpa |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (A hely) | L (barna), váltóvezeték 1 (szürke), váltóvezeték 2 (szürke) | 3 |
| Kötődoboz – K2 (B hely) | váltóvezeték 1 (szürke), váltóvezeték 2 (szürke), kapcsolt fázis (fekete) | 3 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: S1 – K1 (A hely); S2 – K2 (B hely).

| S1 | S2 | Eredmény (a szimuláció szerint) |
|---|---|---|
| 0 (közös–1) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | 1 (közös–2) | Lámpa: ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-VALTOKAPCSOLO-106-NL | Netlista (a rajz és a táblák forrása) | valtokapcsolo-106-bekotese.netlist.json · 909db559 | ☐ | ☐ | |
| BEK-VALTOKAPCSOLO-106-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · 79d7b08a | ☐ | ☐ | |
| BEK-VALTOKAPCSOLO-106-VEZ | Vezetéktábla (12 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-VALTOKAPCSOLO-106-SZAK | Szakaszok és érszám (4 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-VALTOKAPCSOLO-106-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-VALTOKAPCSOLO-106):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-VALTOKAPCSOLO-106).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KETTOS-VALTOKAPCSOLO-106-6 – Kettős váltókapcsoló (106+6): két lámpa, mindkettő két helyről

Forrás: content/tudastar/r3/kettos-valtokapcsolo-106-6-bekotese.netlist.json (netlista), content/tudastar/diagramok/kettos-valtokapcsolo-106-6.json (elrendezés); cikk: kettos-valtokapcsolo-106-6-bekotese, abra-1 („Két lámpa két helyről, kettős váltókapcsolókkal”)

Ábra-azonosító: kettos-valtokapcsolo-106-6. Netlista-ujjlenyomat: 837cd200; ábra-ujjlenyomat: 7a0aa663 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (16 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A két billentyű közös kapcsát (C1, C2) itt az A helyen áthidaló köti ugyanarra a fázisra; ahol a gyártó a két közös kapcsot belül összeköti, az áthidaló elmarad. A váltóvezetékek: 1a, 2a (1. kör) és 1b, 2b (2. kör).

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (kettos-valtokapcsolo-106-6, ábra-ujjlenyomat 7a0aa663).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); L – áthidaló (fázis) (barna); 1a, 2a, 1b, 2b – váltóvezeték (szürke); Lk1, Lk2 – kapcsolt fázis (fekete).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | K1 (A hely): 1. billentyű közös kapcsa (C1) | L | barna | Kötődoboz – K1 (A hely) |
| 5 | K1 (A hely): 1. billentyű közös kapcsa (C1) | K1 (A hely): 2. billentyű közös kapcsa (C2) | áthidaló | barna | dobozon belül |
| 6 | K1 (A hely): 1a kapocs | Kötődoboz: 1a váltóvezeték kötése | váltóvezeték 1a | szürke | Kötődoboz – K1 (A hely) |
| 7 | K1 (A hely): 2a kapocs | Kötődoboz: 2a váltóvezeték kötése | váltóvezeték 2a | szürke | Kötődoboz – K1 (A hely) |
| 8 | K1 (A hely): 1b kapocs | Kötődoboz: 1b váltóvezeték kötése | váltóvezeték 1b | szürke | Kötődoboz – K1 (A hely) |
| 9 | K1 (A hely): 2b kapocs | Kötődoboz: 2b váltóvezeték kötése | váltóvezeték 2b | szürke | Kötődoboz – K1 (A hely) |
| 10 | Kötődoboz: 1a váltóvezeték kötése | K2 (B hely): 1a kapocs | váltóvezeték 1a | szürke | Kötődoboz – K2 (B hely) |
| 11 | Kötődoboz: 2a váltóvezeték kötése | K2 (B hely): 2a kapocs | váltóvezeték 2a | szürke | Kötődoboz – K2 (B hely) |
| 12 | Kötődoboz: 1b váltóvezeték kötése | K2 (B hely): 1b kapocs | váltóvezeték 1b | szürke | Kötődoboz – K2 (B hely) |
| 13 | Kötődoboz: 2b váltóvezeték kötése | K2 (B hely): 2b kapocs | váltóvezeték 2b | szürke | Kötődoboz – K2 (B hely) |
| 14 | K2 (B hely): 1. billentyű közös kapcsa (C1) | Kötődoboz: 1. lámpa kapcsoltfázis-kötése | kapcsolt fázis 1 | fekete | Kötődoboz – K2 (B hely) |
| 15 | K2 (B hely): 2. billentyű közös kapcsa (C2) | Kötődoboz: 2. lámpa kapcsoltfázis-kötése | kapcsolt fázis 2 | fekete | Kötődoboz – K2 (B hely) |
| 16 | Kötődoboz: 1. lámpa kapcsoltfázis-kötése | 1. lámpa: L (fázis) | kapcsolt fázis 1 | fekete | Kötődoboz – 1. lámpa |
| 17 | Kötődoboz: N-kötés | 1. lámpa: N | N | kék | Kötődoboz – 1. lámpa |
| 18 | Kötődoboz: PE-kötés | 1. lámpa: PE | PE | zöld-sárga | Kötődoboz – 1. lámpa |
| 19 | Kötődoboz: 2. lámpa kapcsoltfázis-kötése | 2. lámpa: L (fázis) | kapcsolt fázis 2 | fekete | Kötődoboz – 2. lámpa |
| 20 | Kötődoboz: N-kötés | 2. lámpa: N | N | kék | Kötődoboz – 2. lámpa |
| 21 | Kötődoboz: PE-kötés | 2. lámpa: PE | PE | zöld-sárga | Kötődoboz – 2. lámpa |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (A hely) | L (barna), váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke) | 5 |
| Kötődoboz – K2 (B hely) | váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke), kapcsolt fázis 1 (fekete), kapcsolt fázis 2 (fekete) | 6 |
| Kötődoboz – 1. lámpa | kapcsolt fázis 1 (fekete), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – 2. lámpa | kapcsolt fázis 2 (fekete), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (16 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: S1.b1 – K1 (A hely) – 1. billentyű; S1.b2 – K1 (A hely) – 2. billentyű; S2.b1 – K2 (B hely) – 1. billentyű; S2.b2 – K2 (B hely) – 2. billentyű.

| S1.b1 | S1.b2 | S2.b1 | S2.b2 | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|
| 0 (C1–1a) | 0 (C2–1b) | 0 (C1–1a) | 0 (C2–1b) | 1. lámpa: ég; 2. lámpa: ég |
| 0 (C1–1a) | 0 (C2–1b) | 0 (C1–1a) | 1 (C2–2b) | 1. lámpa: ég; 2. lámpa: nem ég |
| 0 (C1–1a) | 0 (C2–1b) | 1 (C1–2a) | 0 (C2–1b) | 1. lámpa: nem ég; 2. lámpa: ég |
| 0 (C1–1a) | 0 (C2–1b) | 1 (C1–2a) | 1 (C2–2b) | 1. lámpa: nem ég; 2. lámpa: nem ég |
| 0 (C1–1a) | 1 (C2–2b) | 0 (C1–1a) | 0 (C2–1b) | 1. lámpa: ég; 2. lámpa: nem ég |
| 0 (C1–1a) | 1 (C2–2b) | 0 (C1–1a) | 1 (C2–2b) | 1. lámpa: ég; 2. lámpa: ég |
| 0 (C1–1a) | 1 (C2–2b) | 1 (C1–2a) | 0 (C2–1b) | 1. lámpa: nem ég; 2. lámpa: nem ég |
| 0 (C1–1a) | 1 (C2–2b) | 1 (C1–2a) | 1 (C2–2b) | 1. lámpa: nem ég; 2. lámpa: ég |
| 1 (C1–2a) | 0 (C2–1b) | 0 (C1–1a) | 0 (C2–1b) | 1. lámpa: nem ég; 2. lámpa: ég |
| 1 (C1–2a) | 0 (C2–1b) | 0 (C1–1a) | 1 (C2–2b) | 1. lámpa: nem ég; 2. lámpa: nem ég |
| 1 (C1–2a) | 0 (C2–1b) | 1 (C1–2a) | 0 (C2–1b) | 1. lámpa: ég; 2. lámpa: ég |
| 1 (C1–2a) | 0 (C2–1b) | 1 (C1–2a) | 1 (C2–2b) | 1. lámpa: ég; 2. lámpa: nem ég |
| 1 (C1–2a) | 1 (C2–2b) | 0 (C1–1a) | 0 (C2–1b) | 1. lámpa: nem ég; 2. lámpa: nem ég |
| 1 (C1–2a) | 1 (C2–2b) | 0 (C1–1a) | 1 (C2–2b) | 1. lámpa: nem ég; 2. lámpa: ég |
| 1 (C1–2a) | 1 (C2–2b) | 1 (C1–2a) | 0 (C2–1b) | 1. lámpa: ég; 2. lámpa: nem ég |
| 1 (C1–2a) | 1 (C2–2b) | 1 (C1–2a) | 1 (C2–2b) | 1. lámpa: ég; 2. lámpa: ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-KETTOS-VALTOKAPCSOLO-106-6-NL | Netlista (a rajz és a táblák forrása) | kettos-valtokapcsolo-106-6-bekotese.netlist.json · 837cd200 | ☐ | ☐ | |
| BEK-KETTOS-VALTOKAPCSOLO-106-6-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · 7a0aa663 | ☐ | ☐ | |
| BEK-KETTOS-VALTOKAPCSOLO-106-6-VEZ | Vezetéktábla (21 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KETTOS-VALTOKAPCSOLO-106-6-SZAK | Szakaszok és érszám (5 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KETTOS-VALTOKAPCSOLO-106-6-ALL | Kapcsolóállás-táblázat (16 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-KETTOS-VALTOKAPCSOLO-106-6):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KETTOS-VALTOKAPCSOLO-106-6).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KERESZTKAPCSOLO-107 – Keresztkapcsolás (106 + 107 + 106): egy lámpa három helyről

Forrás: content/tudastar/r3/keresztkapcsolo-107-bekotese.netlist.json (netlista), content/tudastar/diagramok/keresztkapcsolo-107.json (elrendezés); cikk: keresztkapcsolo-107-bekotese, abra-1 („Keresztkapcsolás: 106 + 107 + 106”)

Ábra-azonosító: keresztkapcsolo-107. Netlista-ujjlenyomat: 835f0537; ábra-ujjlenyomat: 2902a14a (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (8 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztkapcsoló bemenő párja (A1, A2) az előző, kimenő párja (B1, B2) a következő kapcsoló felé néz; a kapcsok elrendezése gyártónként eltér.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (keresztkapcsolo-107, ábra-ujjlenyomat 2902a14a).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); 1a, 2a, 1b, 2b – váltóvezeték (szürke); Lk – kapcsolt fázis (fekete).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | K1 (106, 1. hely): közös kapocs (C) | L | barna | Kötődoboz – K1 (1. hely) |
| 5 | K1 (106, 1. hely): 1-es kapocs | Kötődoboz: 1a váltóvezeték kötése | váltóvezeték 1a | szürke | Kötődoboz – K1 (1. hely) |
| 6 | K1 (106, 1. hely): 2-es kapocs | Kötődoboz: 2a váltóvezeték kötése | váltóvezeték 2a | szürke | Kötődoboz – K1 (1. hely) |
| 7 | Kötődoboz: 1a váltóvezeték kötése | X1 (107, 2. hely): A1 (bemenő pár) | váltóvezeték 1a | szürke | Kötődoboz – X1 (2. hely) |
| 8 | Kötődoboz: 2a váltóvezeték kötése | X1 (107, 2. hely): A2 (bemenő pár) | váltóvezeték 2a | szürke | Kötődoboz – X1 (2. hely) |
| 9 | X1 (107, 2. hely): B1 (kimenő pár) | Kötődoboz: 1b váltóvezeték kötése | váltóvezeték 1b | szürke | Kötődoboz – X1 (2. hely) |
| 10 | X1 (107, 2. hely): B2 (kimenő pár) | Kötődoboz: 2b váltóvezeték kötése | váltóvezeték 2b | szürke | Kötődoboz – X1 (2. hely) |
| 11 | Kötődoboz: 1b váltóvezeték kötése | K2 (106, 3. hely): 1-es kapocs | váltóvezeték 1b | szürke | Kötődoboz – K2 (3. hely) |
| 12 | Kötődoboz: 2b váltóvezeték kötése | K2 (106, 3. hely): 2-es kapocs | váltóvezeték 2b | szürke | Kötődoboz – K2 (3. hely) |
| 13 | K2 (106, 3. hely): közös kapocs (C) | Kötődoboz: kapcsoltfázis-kötés | kapcsolt fázis | fekete | Kötődoboz – K2 (3. hely) |
| 14 | Kötődoboz: kapcsoltfázis-kötés | Lámpa: L (fázis) | kapcsolt fázis | fekete | Kötődoboz – lámpa |
| 15 | Kötődoboz: N-kötés | Lámpa: N | N | kék | Kötődoboz – lámpa |
| 16 | Kötődoboz: PE-kötés | Lámpa: PE | PE | zöld-sárga | Kötődoboz – lámpa |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (1. hely) | L (barna), váltóvezeték 1a (szürke), váltóvezeték 2a (szürke) | 3 |
| Kötődoboz – X1 (2. hely) | váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke) | 4 |
| Kötődoboz – K2 (3. hely) | váltóvezeték 1b (szürke), váltóvezeték 2b (szürke), kapcsolt fázis (fekete) | 3 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (8 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: S1 – K1 (106, 1. hely); X1 – X1 (107, 2. hely); S2 – K2 (106, 3. hely).

| S1 | X1 | S2 | Eredmény (a szimuláció szerint) |
|---|---|---|---|
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-KERESZTKAPCSOLO-107-NL | Netlista (a rajz és a táblák forrása) | keresztkapcsolo-107-bekotese.netlist.json · 835f0537 | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · 2902a14a | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-VEZ | Vezetéktábla (16 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-SZAK | Szakaszok és érszám (5 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-ALL | Kapcsolóállás-táblázat (8 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-KERESZTKAPCSOLO-107):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KERESZTKAPCSOLO-107).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KERESZTKAPCSOLO-107-2X107 – Keresztkapcsolás (106 + 2 × 107 + 106): egy lámpa 4 helyről

Forrás: content/tudastar/r3/keresztkapcsolo-107-bekotese-2x107.netlist.json (netlista), content/tudastar/diagramok/keresztkapcsolo-107-2x107.json (elrendezés); cikk: keresztkapcsolo-107-bekotese, abra-1 („Keresztkapcsolás: 106 + 107 + 106”)

Ábra-azonosító: keresztkapcsolo-107-2x107. Netlista-ujjlenyomat: 9566473c; ábra-ujjlenyomat: 96217f1e (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (16 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztkapcsoló bemenő párja (A1, A2) az előző, kimenő párja (B1, B2) a következő kapcsoló felé néz; a kapcsok elrendezése gyártónként eltér.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (keresztkapcsolo-107-2x107, ábra-ujjlenyomat 96217f1e).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); 1a, 2a, 1b, 2b, 1c, 2c – váltóvezeték (szürke); Lk – kapcsolt fázis (fekete).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | K1 (106, 1. hely): közös kapocs (C) | L | barna | Kötődoboz – K1 (1. hely) |
| 5 | K1 (106, 1. hely): 1-es kapocs | Kötődoboz: 1a váltóvezeték kötése | váltóvezeték 1a | szürke | Kötődoboz – K1 (1. hely) |
| 6 | K1 (106, 1. hely): 2-es kapocs | Kötődoboz: 2a váltóvezeték kötése | váltóvezeték 2a | szürke | Kötődoboz – K1 (1. hely) |
| 7 | Kötődoboz: 1a váltóvezeték kötése | X1 (107, 2. hely): A1 (bemenő pár) | váltóvezeték 1a | szürke | Kötődoboz – X1 (2. hely) |
| 8 | Kötődoboz: 2a váltóvezeték kötése | X1 (107, 2. hely): A2 (bemenő pár) | váltóvezeték 2a | szürke | Kötődoboz – X1 (2. hely) |
| 9 | X1 (107, 2. hely): B1 (kimenő pár) | Kötődoboz: 1b váltóvezeték kötése | váltóvezeték 1b | szürke | Kötődoboz – X1 (2. hely) |
| 10 | X1 (107, 2. hely): B2 (kimenő pár) | Kötődoboz: 2b váltóvezeték kötése | váltóvezeték 2b | szürke | Kötődoboz – X1 (2. hely) |
| 11 | Kötődoboz: 1b váltóvezeték kötése | X2 (107, 3. hely): A1 (bemenő pár) | váltóvezeték 1b | szürke | Kötődoboz – X2 (3. hely) |
| 12 | Kötődoboz: 2b váltóvezeték kötése | X2 (107, 3. hely): A2 (bemenő pár) | váltóvezeték 2b | szürke | Kötődoboz – X2 (3. hely) |
| 13 | X2 (107, 3. hely): B1 (kimenő pár) | Kötődoboz: 1c váltóvezeték kötése | váltóvezeték 1c | szürke | Kötődoboz – X2 (3. hely) |
| 14 | X2 (107, 3. hely): B2 (kimenő pár) | Kötődoboz: 2c váltóvezeték kötése | váltóvezeték 2c | szürke | Kötődoboz – X2 (3. hely) |
| 15 | Kötődoboz: 1c váltóvezeték kötése | K2 (106, 4. hely): 1-es kapocs | váltóvezeték 1c | szürke | Kötődoboz – K2 (4. hely) |
| 16 | Kötődoboz: 2c váltóvezeték kötése | K2 (106, 4. hely): 2-es kapocs | váltóvezeték 2c | szürke | Kötődoboz – K2 (4. hely) |
| 17 | K2 (106, 4. hely): közös kapocs (C) | Kötődoboz: kapcsoltfázis-kötés | kapcsolt fázis | fekete | Kötődoboz – K2 (4. hely) |
| 18 | Kötődoboz: kapcsoltfázis-kötés | Lámpa: L (fázis) | kapcsolt fázis | fekete | Kötődoboz – lámpa |
| 19 | Kötődoboz: N-kötés | Lámpa: N | N | kék | Kötődoboz – lámpa |
| 20 | Kötődoboz: PE-kötés | Lámpa: PE | PE | zöld-sárga | Kötődoboz – lámpa |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (1. hely) | L (barna), váltóvezeték 1a (szürke), váltóvezeték 2a (szürke) | 3 |
| Kötődoboz – X1 (2. hely) | váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke) | 4 |
| Kötődoboz – X2 (3. hely) | váltóvezeték 1b (szürke), váltóvezeték 2b (szürke), váltóvezeték 1c (szürke), váltóvezeték 2c (szürke) | 4 |
| Kötődoboz – K2 (4. hely) | váltóvezeték 1c (szürke), váltóvezeték 2c (szürke), kapcsolt fázis (fekete) | 3 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (16 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: S1 – K1 (106, 1. hely); X1 – X1 (107, 2. hely); X2 – X2 (107, 3. hely); S2 – K2 (106, 4. hely).

| S1 | X1 | X2 | S2 | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-KERESZTKAPCSOLO-107-2X107-NL | Netlista (a rajz és a táblák forrása) | keresztkapcsolo-107-bekotese-2x107.netlist.json · 9566473c | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-2X107-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · 96217f1e | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-2X107-VEZ | Vezetéktábla (20 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-2X107-SZAK | Szakaszok és érszám (6 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-2X107-ALL | Kapcsolóállás-táblázat (16 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-KERESZTKAPCSOLO-107-2X107):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KERESZTKAPCSOLO-107-2X107).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KERESZTKAPCSOLO-107-3X107 – Keresztkapcsolás (106 + 3 × 107 + 106): egy lámpa 5 helyről

Forrás: content/tudastar/r3/keresztkapcsolo-107-bekotese-3x107.netlist.json (netlista), content/tudastar/diagramok/keresztkapcsolo-107-3x107.json (elrendezés); cikk: keresztkapcsolo-107-bekotese, abra-1 („Keresztkapcsolás: 106 + 107 + 106”)

Ábra-azonosító: keresztkapcsolo-107-3x107. Netlista-ujjlenyomat: f9fd89d8; ábra-ujjlenyomat: 5e3b5a40 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (32 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztkapcsoló bemenő párja (A1, A2) az előző, kimenő párja (B1, B2) a következő kapcsoló felé néz; a kapcsok elrendezése gyártónként eltér.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (keresztkapcsolo-107-3x107, ábra-ujjlenyomat 5e3b5a40).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); 1a, 2a, 1b, 2b, 1c, 2c, 1d, 2d – váltóvezeték (szürke); Lk – kapcsolt fázis (fekete).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | K1 (106, 1. hely): közös kapocs (C) | L | barna | Kötődoboz – K1 (1. hely) |
| 5 | K1 (106, 1. hely): 1-es kapocs | Kötődoboz: 1a váltóvezeték kötése | váltóvezeték 1a | szürke | Kötődoboz – K1 (1. hely) |
| 6 | K1 (106, 1. hely): 2-es kapocs | Kötődoboz: 2a váltóvezeték kötése | váltóvezeték 2a | szürke | Kötődoboz – K1 (1. hely) |
| 7 | Kötődoboz: 1a váltóvezeték kötése | X1 (107, 2. hely): A1 (bemenő pár) | váltóvezeték 1a | szürke | Kötődoboz – X1 (2. hely) |
| 8 | Kötődoboz: 2a váltóvezeték kötése | X1 (107, 2. hely): A2 (bemenő pár) | váltóvezeték 2a | szürke | Kötődoboz – X1 (2. hely) |
| 9 | X1 (107, 2. hely): B1 (kimenő pár) | Kötődoboz: 1b váltóvezeték kötése | váltóvezeték 1b | szürke | Kötődoboz – X1 (2. hely) |
| 10 | X1 (107, 2. hely): B2 (kimenő pár) | Kötődoboz: 2b váltóvezeték kötése | váltóvezeték 2b | szürke | Kötődoboz – X1 (2. hely) |
| 11 | Kötődoboz: 1b váltóvezeték kötése | X2 (107, 3. hely): A1 (bemenő pár) | váltóvezeték 1b | szürke | Kötődoboz – X2 (3. hely) |
| 12 | Kötődoboz: 2b váltóvezeték kötése | X2 (107, 3. hely): A2 (bemenő pár) | váltóvezeték 2b | szürke | Kötődoboz – X2 (3. hely) |
| 13 | X2 (107, 3. hely): B1 (kimenő pár) | Kötődoboz: 1c váltóvezeték kötése | váltóvezeték 1c | szürke | Kötődoboz – X2 (3. hely) |
| 14 | X2 (107, 3. hely): B2 (kimenő pár) | Kötődoboz: 2c váltóvezeték kötése | váltóvezeték 2c | szürke | Kötődoboz – X2 (3. hely) |
| 15 | Kötődoboz: 1c váltóvezeték kötése | X3 (107, 4. hely): A1 (bemenő pár) | váltóvezeték 1c | szürke | Kötődoboz – X3 (4. hely) |
| 16 | Kötődoboz: 2c váltóvezeték kötése | X3 (107, 4. hely): A2 (bemenő pár) | váltóvezeték 2c | szürke | Kötődoboz – X3 (4. hely) |
| 17 | X3 (107, 4. hely): B1 (kimenő pár) | Kötődoboz: 1d váltóvezeték kötése | váltóvezeték 1d | szürke | Kötődoboz – X3 (4. hely) |
| 18 | X3 (107, 4. hely): B2 (kimenő pár) | Kötődoboz: 2d váltóvezeték kötése | váltóvezeték 2d | szürke | Kötődoboz – X3 (4. hely) |
| 19 | Kötődoboz: 1d váltóvezeték kötése | K2 (106, 5. hely): 1-es kapocs | váltóvezeték 1d | szürke | Kötődoboz – K2 (5. hely) |
| 20 | Kötődoboz: 2d váltóvezeték kötése | K2 (106, 5. hely): 2-es kapocs | váltóvezeték 2d | szürke | Kötődoboz – K2 (5. hely) |
| 21 | K2 (106, 5. hely): közös kapocs (C) | Kötődoboz: kapcsoltfázis-kötés | kapcsolt fázis | fekete | Kötődoboz – K2 (5. hely) |
| 22 | Kötődoboz: kapcsoltfázis-kötés | Lámpa: L (fázis) | kapcsolt fázis | fekete | Kötődoboz – lámpa |
| 23 | Kötődoboz: N-kötés | Lámpa: N | N | kék | Kötődoboz – lámpa |
| 24 | Kötődoboz: PE-kötés | Lámpa: PE | PE | zöld-sárga | Kötődoboz – lámpa |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (1. hely) | L (barna), váltóvezeték 1a (szürke), váltóvezeték 2a (szürke) | 3 |
| Kötődoboz – X1 (2. hely) | váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke) | 4 |
| Kötődoboz – X2 (3. hely) | váltóvezeték 1b (szürke), váltóvezeték 2b (szürke), váltóvezeték 1c (szürke), váltóvezeték 2c (szürke) | 4 |
| Kötődoboz – X3 (4. hely) | váltóvezeték 1c (szürke), váltóvezeték 2c (szürke), váltóvezeték 1d (szürke), váltóvezeték 2d (szürke) | 4 |
| Kötődoboz – K2 (5. hely) | váltóvezeték 1d (szürke), váltóvezeték 2d (szürke), kapcsolt fázis (fekete) | 3 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (32 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: S1 – K1 (106, 1. hely); X1 – X1 (107, 2. hely); X2 – X2 (107, 3. hely); X3 – X3 (107, 4. hely); S2 – K2 (106, 5. hely).

| S1 | X1 | X2 | X3 | S2 | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|---|
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-KERESZTKAPCSOLO-107-3X107-NL | Netlista (a rajz és a táblák forrása) | keresztkapcsolo-107-bekotese-3x107.netlist.json · f9fd89d8 | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-3X107-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · 5e3b5a40 | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-3X107-VEZ | Vezetéktábla (24 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-3X107-SZAK | Szakaszok és érszám (7 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-3X107-ALL | Kapcsolóállás-táblázat (32 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-KERESZTKAPCSOLO-107-3X107):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KERESZTKAPCSOLO-107-3X107).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KERESZTKAPCSOLO-107-4X107 – Keresztkapcsolás (106 + 4 × 107 + 106): egy lámpa 6 helyről

Forrás: content/tudastar/r3/keresztkapcsolo-107-bekotese-4x107.netlist.json (netlista), content/tudastar/diagramok/keresztkapcsolo-107-4x107.json (elrendezés); cikk: keresztkapcsolo-107-bekotese, abra-1 („Keresztkapcsolás: 106 + 107 + 106”)

Ábra-azonosító: keresztkapcsolo-107-4x107. Netlista-ujjlenyomat: e67cbcc6; ábra-ujjlenyomat: b7949588 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (64 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztkapcsoló bemenő párja (A1, A2) az előző, kimenő párja (B1, B2) a következő kapcsoló felé néz; a kapcsok elrendezése gyártónként eltér.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (keresztkapcsolo-107-4x107, ábra-ujjlenyomat b7949588).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); 1a, 2a, 1b, 2b, 1c, 2c, 1d, 2d, 1e, 2e – váltóvezeték (szürke); Lk – kapcsolt fázis (fekete).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 2 | Betáp: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 3 | Betáp: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 4 | Kötődoboz: L-kötés | K1 (106, 1. hely): közös kapocs (C) | L | barna | Kötődoboz – K1 (1. hely) |
| 5 | K1 (106, 1. hely): 1-es kapocs | Kötődoboz: 1a váltóvezeték kötése | váltóvezeték 1a | szürke | Kötődoboz – K1 (1. hely) |
| 6 | K1 (106, 1. hely): 2-es kapocs | Kötődoboz: 2a váltóvezeték kötése | váltóvezeték 2a | szürke | Kötődoboz – K1 (1. hely) |
| 7 | Kötődoboz: 1a váltóvezeték kötése | X1 (107, 2. hely): A1 (bemenő pár) | váltóvezeték 1a | szürke | Kötődoboz – X1 (2. hely) |
| 8 | Kötődoboz: 2a váltóvezeték kötése | X1 (107, 2. hely): A2 (bemenő pár) | váltóvezeték 2a | szürke | Kötődoboz – X1 (2. hely) |
| 9 | X1 (107, 2. hely): B1 (kimenő pár) | Kötődoboz: 1b váltóvezeték kötése | váltóvezeték 1b | szürke | Kötődoboz – X1 (2. hely) |
| 10 | X1 (107, 2. hely): B2 (kimenő pár) | Kötődoboz: 2b váltóvezeték kötése | váltóvezeték 2b | szürke | Kötődoboz – X1 (2. hely) |
| 11 | Kötődoboz: 1b váltóvezeték kötése | X2 (107, 3. hely): A1 (bemenő pár) | váltóvezeték 1b | szürke | Kötődoboz – X2 (3. hely) |
| 12 | Kötődoboz: 2b váltóvezeték kötése | X2 (107, 3. hely): A2 (bemenő pár) | váltóvezeték 2b | szürke | Kötődoboz – X2 (3. hely) |
| 13 | X2 (107, 3. hely): B1 (kimenő pár) | Kötődoboz: 1c váltóvezeték kötése | váltóvezeték 1c | szürke | Kötődoboz – X2 (3. hely) |
| 14 | X2 (107, 3. hely): B2 (kimenő pár) | Kötődoboz: 2c váltóvezeték kötése | váltóvezeték 2c | szürke | Kötődoboz – X2 (3. hely) |
| 15 | Kötődoboz: 1c váltóvezeték kötése | X3 (107, 4. hely): A1 (bemenő pár) | váltóvezeték 1c | szürke | Kötődoboz – X3 (4. hely) |
| 16 | Kötődoboz: 2c váltóvezeték kötése | X3 (107, 4. hely): A2 (bemenő pár) | váltóvezeték 2c | szürke | Kötődoboz – X3 (4. hely) |
| 17 | X3 (107, 4. hely): B1 (kimenő pár) | Kötődoboz: 1d váltóvezeték kötése | váltóvezeték 1d | szürke | Kötődoboz – X3 (4. hely) |
| 18 | X3 (107, 4. hely): B2 (kimenő pár) | Kötődoboz: 2d váltóvezeték kötése | váltóvezeték 2d | szürke | Kötődoboz – X3 (4. hely) |
| 19 | Kötődoboz: 1d váltóvezeték kötése | X4 (107, 5. hely): A1 (bemenő pár) | váltóvezeték 1d | szürke | Kötődoboz – X4 (5. hely) |
| 20 | Kötődoboz: 2d váltóvezeték kötése | X4 (107, 5. hely): A2 (bemenő pár) | váltóvezeték 2d | szürke | Kötődoboz – X4 (5. hely) |
| 21 | X4 (107, 5. hely): B1 (kimenő pár) | Kötődoboz: 1e váltóvezeték kötése | váltóvezeték 1e | szürke | Kötődoboz – X4 (5. hely) |
| 22 | X4 (107, 5. hely): B2 (kimenő pár) | Kötődoboz: 2e váltóvezeték kötése | váltóvezeték 2e | szürke | Kötődoboz – X4 (5. hely) |
| 23 | Kötődoboz: 1e váltóvezeték kötése | K2 (106, 6. hely): 1-es kapocs | váltóvezeték 1e | szürke | Kötődoboz – K2 (6. hely) |
| 24 | Kötődoboz: 2e váltóvezeték kötése | K2 (106, 6. hely): 2-es kapocs | váltóvezeték 2e | szürke | Kötődoboz – K2 (6. hely) |
| 25 | K2 (106, 6. hely): közös kapocs (C) | Kötődoboz: kapcsoltfázis-kötés | kapcsolt fázis | fekete | Kötődoboz – K2 (6. hely) |
| 26 | Kötődoboz: kapcsoltfázis-kötés | Lámpa: L (fázis) | kapcsolt fázis | fekete | Kötődoboz – lámpa |
| 27 | Kötődoboz: N-kötés | Lámpa: N | N | kék | Kötődoboz – lámpa |
| 28 | Kötődoboz: PE-kötés | Lámpa: PE | PE | zöld-sárga | Kötődoboz – lámpa |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (1. hely) | L (barna), váltóvezeték 1a (szürke), váltóvezeték 2a (szürke) | 3 |
| Kötődoboz – X1 (2. hely) | váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke) | 4 |
| Kötődoboz – X2 (3. hely) | váltóvezeték 1b (szürke), váltóvezeték 2b (szürke), váltóvezeték 1c (szürke), váltóvezeték 2c (szürke) | 4 |
| Kötődoboz – X3 (4. hely) | váltóvezeték 1c (szürke), váltóvezeték 2c (szürke), váltóvezeték 1d (szürke), váltóvezeték 2d (szürke) | 4 |
| Kötődoboz – X4 (5. hely) | váltóvezeték 1d (szürke), váltóvezeték 2d (szürke), váltóvezeték 1e (szürke), váltóvezeték 2e (szürke) | 4 |
| Kötődoboz – K2 (6. hely) | váltóvezeték 1e (szürke), váltóvezeték 2e (szürke), kapcsolt fázis (fekete) | 3 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (64 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: S1 – K1 (106, 1. hely); X1 – X1 (107, 2. hely); X2 – X2 (107, 3. hely); X3 – X3 (107, 4. hely); X4 – X4 (107, 5. hely); S2 – K2 (106, 6. hely).

| S1 | X1 | X2 | X3 | X4 | S2 | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|---|---|
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | Lámpa: ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | Lámpa: ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-KERESZTKAPCSOLO-107-4X107-NL | Netlista (a rajz és a táblák forrása) | keresztkapcsolo-107-bekotese-4x107.netlist.json · e67cbcc6 | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-4X107-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · b7949588 | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-4X107-VEZ | Vezetéktábla (28 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-4X107-SZAK | Szakaszok és érszám (8 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-4X107-ALL | Kapcsolóállás-táblázat (64 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-KERESZTKAPCSOLO-107-4X107):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KERESZTKAPCSOLO-107-4X107).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-DUGALJ-ATHURKOLAS – Dugaljkör áthurkolással: két védőérintkezős dugalj FI-relé és kismegszakító után

Forrás: content/tudastar/r3/dugalj-bekotese.netlist.json (netlista), content/tudastar/diagramok/dugalj-athurkolas.json (elrendezés); cikk: dugalj-bekotese, abra-1 („Dugaljkör áthurkolással, FI-relé és kismegszakító után”)

Ábra-azonosító: dugalj-athurkolas. Netlista-ujjlenyomat: 9bb3ff8e; ábra-ujjlenyomat: f68b16a5 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Érszínek: barna = fázisvezető (L), kék = nullavezető (N), zöld-sárga = védővezető (PE). A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A betáp a lakáselosztó gyűjtősínjeit jelképezi (TN-C-S rendszer, a PEN szétválasztása a betáp előtt); a szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze (a szimulátor az ilyen kötést zárlatként elutasítja). A mérőhelyi és csatlakozási rész az elosztói engedélyes hatásköre, ezért itt nem szerepel. A keresztmetszet és a kismegszakító névleges árama méretezés kérdése (lib/sizing-tables.ts, jóváhagyásra vár), ezért az ábra nem ad számot. Áthurkolás: a továbbmenő vezetők a dugalj kapcsain mennek át (a kapocs két vezető befogására alkalmas kell legyen; ezt a gyártó adja meg).

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (1., a cikk saját kérdése) Van-e kötelező hazai előírás arra, hogy a védővezetőt ne a dugalj kapcsán hurkolják át, hanem kötőelemmel ágaztassák le? A cikk jelenleg csak szakmai megfontolásként tárgyalja.

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (2., a cikk saját kérdése) Van-e kialakult hazai szabály arra, hogy jelöletlen kapcsú dugaljnál szemből nézve melyik oldalra kerüljön a fázis? A cikk most csak az egységes bekötést javasolja.

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (3., a cikk saját kérdése) A CEE 7/3 aljzat hazai termékszabványa (MSZ 9871 sorozat vagy más) és kiadása.

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (4., a cikk saját kérdése) Elegendő-e a háromfázisú (CEE-rendszerű, ötpólusú) dugalj puszta említése, vagy külön cikk kell (P2)?

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (5., a cikk saját kérdése) A kikapcsolt dugalj állapotát a táblázat „nem ad feszültséget” szóval jelöli (nem „feszültségmentes”), mert lekapcsolt kismegszakító mellett a nullavezető a nullasínen marad. Elfogadható-e ez a szóhasználat (a független biztonsági ellenőr javaslata)?

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (6., a cikk saját kérdése) Maradjon-e „A szerelés menete szakembernek” lépéssor a laikusokat is megszólító (audience: laikus) cikkben, vagy kerüljön szakembernek szóló, összecsukott blokkba? A „hogyan kell bekötni a konnektort” keresőszinonimát az ellenőr kivette; visszakerüljön-e?

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (Dugalj, kismegszakító, FI-relé – közös kérdés 1.) Szóhasználat: a dugalj kikapcsolt állapota a táblákban mostantól „nem ad feszültséget”, a „feszültségmentes” helyett. Elfogadja-e a lektor? A változás a sim.py OUT_WORDS-ét érinti, csak a dugalj típusnál.

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (Dugalj, kismegszakító, FI-relé – közös kérdés 2.) Maradjon-e „A szerelés menete szakembernek” lépéssor a dugaljcikkben, amelynek a közönségei között a laikus is szerepel (audience: laikus)? Vagy kerüljön összecsukott, szakembernek szóló blokkba? A „hogyan kell bekötni a konnektort” keresőszinonimát kivettem. Ha marketing-szempontból vissza kell tenni, az a tulajdonos döntése.

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (Dugalj, kismegszakító, FI-relé – közös kérdés 3.) Az I16 szabály szerint minden dugaljnak FI-relé mögött kell lennie, az I15 szerint minden dugaljnak és fogyasztónak kismegszakító mögött. Ha egy későbbi „régi berendezés” ábra szándékosan FI nélküli dugaljkört mutat, ehhez kifejezett kivételmező kell (pl. checks.noRcd). Erről a tulajdonos és a lektor dönt.

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (Dugalj, kismegszakító, FI-relé – közös kérdés 4.) A kismegszakító-cikk TT-mondata számok nélküli. Elfogadható-e így: „a testzárlati áram jellemzően a kismegszakító kioldásához is kicsi; ott az önműködő lekapcsolást is áram-védőkapcsoló végzi”?

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (Dugalj, kismegszakító, FI-relé – közös kérdés 5.) Új forráshivatkozások, a kiadást lektor ellenőrizze: MSZ HD 60364-4-46 461.2 (a PEN nem kapcsolható) és MSZ HD 60364-5-54 543.4.3 (a szétválasztás után nincs újra-összekötés).

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (Dugalj, kismegszakító, FI-relé – közös kérdés 6.) FI-cikk: elfogadható-e a PEN-szakadásról („a FI nem érzékeli”) és a FI utáni N–PE összekötésről („romlik az érzékenység”) szóló megfogalmazás? Kell-e a P1 esethez számérték: IΔn/2, vagy az IEC TS 60479-1 tartományai?

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (Dugalj, kismegszakító, FI-relé – közös kérdés 7.) A független orákulum modellfeltevéseit lektornak kell jóváhagynia: emberi test 1 kΩ, talaj 10 Ω, testzárlat 5 Ω, próbaellenállás 10 kΩ, kioldási küszöb IΔn/2 = 15 mA. A szimulátor csak logikai összefüggőséget számol; a „kiold” cellák azt az esetet mutatják, amikor az áram eléri a kioldási értéket. Ezt most a cikk szövege is kimondja.

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (Dugalj, kismegszakító, FI-relé – közös kérdés 8.) A kapcsolási csoport szimulátorrészét (106, 107 minden állása, 102 N-bontás) nem én bővítettem. A párhuzamos ellenőr probak_biztonsag.py készletét futtattam újra: 9121 mutáns, 0 hamis PASS; 1260 torzított kapcsolómodell, mind FAIL. A kapcsolási cikkek szövegét nem néztem át, mert az a másik ellenőr hatásköre.

**Kérdés a lektorhoz (BEK-DUGALJ-ATHURKOLAS).** (Dugalj, kismegszakító, FI-relé – közös kérdés 9.) R3 bekötési cikkben maradjon-e „laikus” a közönségek (audience) között? A veszély-doboz most kifejezetten azt mondja, hogy a leírás szakembernek szól.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (dugalj-athurkolas, ábra-ujjlenyomat f68b16a5).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp (gyűjtősín): L | Q1 áram-védőkapcsoló (FI-relé): 1 (fázis, táp oldal) | L | barna | elosztón belül |
| 2 | Betáp (gyűjtősín): N | Q1 áram-védőkapcsoló (FI-relé): N (táp oldal) | N | kék | elosztón belül |
| 3 | Q1 áram-védőkapcsoló (FI-relé): N (védett oldal) | Nullasín (N) a FI-relé után: N | N | kék | elosztón belül |
| 4 | Betáp (gyűjtősín): PE | PE-sín: PE | PE | zöld-sárga | elosztón belül |
| 5 | Q1 áram-védőkapcsoló (FI-relé): 2 (fázis, védett oldal) | F1 kismegszakító (dugaljkör): 1 (be) | L | barna | elosztón belül |
| 6 | F1 kismegszakító (dugaljkör): 2 (ki) | X1 dugalj: L kapocs | L | barna | Elosztó – X1 dugalj |
| 7 | Nullasín (N) a FI-relé után: N | X1 dugalj: N kapocs | N | kék | Elosztó – X1 dugalj |
| 8 | PE-sín: PE | X1 dugalj: védőérintkező kapocs | PE | zöld-sárga | Elosztó – X1 dugalj |
| 9 | X1 dugalj: L kapocs | X2 dugalj: L kapocs | L | barna | X1 – X2 dugalj (áthurkolás) |
| 10 | X1 dugalj: N kapocs | X2 dugalj: N kapocs | N | kék | X1 – X2 dugalj (áthurkolás) |
| 11 | X1 dugalj: védőérintkező kapocs | X2 dugalj: védőérintkező kapocs | PE | zöld-sárga | X1 – X2 dugalj (áthurkolás) |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – X1 dugalj | L (barna), N (kék), PE (zöld-sárga) | 3 |
| X1 – X2 dugalj (áthurkolás) | L (barna), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé); F1 – F1 kismegszakító (dugaljkör).

| Q1 | F1 | Eredmény (a szimuláció szerint) |
|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | X1 dugalj: feszültség alatt; X2 dugalj: feszültség alatt; Q1 FI-relé: nem old ki |
| be (bekapcsolva) | ki (kikapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | be (bekapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | ki (kikapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-DUGALJ-ATHURKOLAS-NL | Netlista (a rajz és a táblák forrása) | dugalj-bekotese.netlist.json · 9bb3ff8e | ☐ | ☐ | |
| BEK-DUGALJ-ATHURKOLAS-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · f68b16a5 | ☐ | ☐ | |
| BEK-DUGALJ-ATHURKOLAS-VEZ | Vezetéktábla (11 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-DUGALJ-ATHURKOLAS-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-DUGALJ-ATHURKOLAS-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-DUGALJ-ATHURKOLAS):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-DUGALJ-ATHURKOLAS).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-DUGALJ-LEAGAZTATAS – Dugaljkör leágaztatással: két dugalj a kötődobozból, FI-relé és kismegszakító után

Forrás: content/tudastar/r3/dugalj-bekotese-leagaztatas.netlist.json (netlista), content/tudastar/diagramok/dugalj-leagaztatas.json (elrendezés); cikk: dugalj-bekotese, abra-2 („Dugaljkör leágaztatással, kötődobozból”)

Ábra-azonosító: dugalj-leagaztatas. Netlista-ujjlenyomat: 143d7450; ábra-ujjlenyomat: ff622029 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Érszínek: barna = fázisvezető (L), kék = nullavezető (N), zöld-sárga = védővezető (PE). A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A betáp a lakáselosztó gyűjtősínjeit jelképezi (TN-C-S rendszer, a PEN szétválasztása a betáp előtt); a szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze (a szimulátor az ilyen kötést zárlatként elutasítja). A mérőhelyi és csatlakozási rész az elosztói engedélyes hatásköre, ezért itt nem szerepel. A keresztmetszet és a kismegszakító névleges árama méretezés kérdése (lib/sizing-tables.ts, jóváhagyásra vár), ezért az ábra nem ad számot. Leágaztatás: a kötődobozban szerepenként egy-egy kötőelem (L, N, PE) fogja össze a vezetőket, mindegyik dugaljhoz külön szakasz megy.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (dugalj-leagaztatas, ábra-ujjlenyomat ff622029).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp (gyűjtősín): L | Q1 áram-védőkapcsoló (FI-relé): 1 (fázis, táp oldal) | L | barna | elosztón belül |
| 2 | Betáp (gyűjtősín): N | Q1 áram-védőkapcsoló (FI-relé): N (táp oldal) | N | kék | elosztón belül |
| 3 | Q1 áram-védőkapcsoló (FI-relé): N (védett oldal) | Nullasín (N) a FI-relé után: N | N | kék | elosztón belül |
| 4 | Betáp (gyűjtősín): PE | PE-sín: PE | PE | zöld-sárga | elosztón belül |
| 5 | Q1 áram-védőkapcsoló (FI-relé): 2 (fázis, védett oldal) | F1 kismegszakító (dugaljkör): 1 (be) | L | barna | elosztón belül |
| 6 | F1 kismegszakító (dugaljkör): 2 (ki) | Kötődoboz: L-kötés | L | barna | Elosztó – kötődoboz |
| 7 | Nullasín (N) a FI-relé után: N | Kötődoboz: N-kötés | N | kék | Elosztó – kötődoboz |
| 8 | PE-sín: PE | Kötődoboz: PE-kötés | PE | zöld-sárga | Elosztó – kötődoboz |
| 9 | Kötődoboz: L-kötés | X1 dugalj: L kapocs | L | barna | Kötődoboz – X1 dugalj |
| 10 | Kötődoboz: N-kötés | X1 dugalj: N kapocs | N | kék | Kötődoboz – X1 dugalj |
| 11 | Kötődoboz: PE-kötés | X1 dugalj: védőérintkező kapocs | PE | zöld-sárga | Kötődoboz – X1 dugalj |
| 12 | Kötődoboz: L-kötés | X2 dugalj: L kapocs | L | barna | Kötődoboz – X2 dugalj |
| 13 | Kötődoboz: N-kötés | X2 dugalj: N kapocs | N | kék | Kötődoboz – X2 dugalj |
| 14 | Kötődoboz: PE-kötés | X2 dugalj: védőérintkező kapocs | PE | zöld-sárga | Kötődoboz – X2 dugalj |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – X1 dugalj | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – X2 dugalj | L (barna), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé); F1 – F1 kismegszakító (dugaljkör).

| Q1 | F1 | Eredmény (a szimuláció szerint) |
|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | X1 dugalj: feszültség alatt; X2 dugalj: feszültség alatt; Q1 FI-relé: nem old ki |
| be (bekapcsolva) | ki (kikapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | be (bekapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | ki (kikapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-DUGALJ-LEAGAZTATAS-NL | Netlista (a rajz és a táblák forrása) | dugalj-bekotese-leagaztatas.netlist.json · 143d7450 | ☐ | ☐ | |
| BEK-DUGALJ-LEAGAZTATAS-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · ff622029 | ☐ | ☐ | |
| BEK-DUGALJ-LEAGAZTATAS-VEZ | Vezetéktábla (14 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-DUGALJ-LEAGAZTATAS-SZAK | Szakaszok és érszám (3 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-DUGALJ-LEAGAZTATAS-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-DUGALJ-LEAGAZTATAS):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-DUGALJ-LEAGAZTATAS).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KISMEGSZAKITO-ARAMKOROK – Két dugaljkör saját kismegszakítóval, közös FI-relé után

Forrás: content/tudastar/r3/kismegszakito.netlist.json (netlista), content/tudastar/diagramok/kismegszakito-aramkorok.json (elrendezés); cikk: kismegszakito, abra-2 („Két dugaljkör saját kismegszakítóval, közös FI-relé után”)

Ábra-azonosító: kismegszakito-aramkorok. Netlista-ujjlenyomat: 3bf085c5; ábra-ujjlenyomat: 244ec1ac (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (8 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Érszínek: barna = fázisvezető (L), kék = nullavezető (N), zöld-sárga = védővezető (PE). A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A betáp a lakáselosztó gyűjtősínjeit jelképezi (TN-C-S rendszer, a PEN szétválasztása a betáp előtt); a szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze (a szimulátor az ilyen kötést zárlatként elutasítja). A mérőhelyi és csatlakozási rész az elosztói engedélyes hatásköre, ezért itt nem szerepel. A keresztmetszet és a kismegszakító névleges árama méretezés kérdése (lib/sizing-tables.ts, jóváhagyásra vár), ezért az ábra nem ad számot. A kismegszakítók táplálása fésűs sínnel vagy áthidalóval történik; az ábrán ez egy fázisvezetőként jelenik meg. A világítási áramkör ugyanígy kapcsolódik, csak a kismegszakító után kapcsoló és lámpa következik.

**Kérdés a lektorhoz (BEK-KISMEGSZAKITO-ARAMKOROK).** (1., a cikk saját kérdése) A B, C, D pillanatkioldási tartományok (3–5, 5–10, 10–20 · In) és az 1,13 / 1,45 · In egyezményes áramok egyeznek-e a hatályos MSZ EN 60898-1-gyel? A felső határokat a lib/sizing-tables.ts is használja (ellenőrizendő).

**Kérdés a lektorhoz (BEK-KISMEGSZAKITO-ARAMKOROK).** (2., a cikk saját kérdése) Szükséges-e a cikkben a megszakítóképesség hazai minimumára (elosztói előírás) utalni, vagy elég a „tervezői döntés” megfogalmazás?

**Kérdés a lektorhoz (BEK-KISMEGSZAKITO-ARAMKOROK).** (3., a cikk saját kérdése) A „Jellemző alkalmazás” oszlop (B: lakás általános áramkörei, C: nagy bekapcsolási áram, D: nagyon nagy bekapcsolási áram) elfogadható-e így, számok nélkül?

**Kérdés a lektorhoz (BEK-KISMEGSZAKITO-ARAMKOROK).** (4., a cikk saját kérdése) A TT-rendszerre tett állítás („a testzárlati áram jellemzően a kismegszakító kioldásához is kicsi; ott az önműködő lekapcsolást is áram-védőkapcsoló végzi”) elfogadható-e így, számok nélkül?

**Kérdés a lektorhoz (BEK-KISMEGSZAKITO-ARAMKOROK).** (5., a cikk saját kérdése) Az MSZ HD 60364-4-46 461.2 pontja (TN-C rendszerben a PEN-vezető nem választható le és nem kapcsolható) a hatályos hazai kiadásban is így szerepel-e?

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (kismegszakito-aramkorok, ábra-ujjlenyomat 244ec1ac).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp (gyűjtősín): L | Q1 áram-védőkapcsoló (FI-relé): 1 (fázis, táp oldal) | L | barna | elosztón belül |
| 2 | Betáp (gyűjtősín): N | Q1 áram-védőkapcsoló (FI-relé): N (táp oldal) | N | kék | elosztón belül |
| 3 | Q1 áram-védőkapcsoló (FI-relé): N (védett oldal) | Nullasín (N) a FI-relé után: N | N | kék | elosztón belül |
| 4 | Betáp (gyűjtősín): PE | PE-sín: PE | PE | zöld-sárga | elosztón belül |
| 5 | Q1 áram-védőkapcsoló (FI-relé): 2 (fázis, védett oldal) | F1 kismegszakító (nappali dugaljak): 1 (be) | L | barna | elosztón belül |
| 6 | F1 kismegszakító (nappali dugaljak): 1 (be) | F2 kismegszakító (konyhai dugaljak): 1 (be) | L (fésűs sín) | barna | elosztón belül |
| 7 | F1 kismegszakító (nappali dugaljak): 2 (ki) | X1 dugalj (nappali): L kapocs | L | barna | Elosztó – X1 dugalj (nappali) |
| 8 | Nullasín (N) a FI-relé után: N | X1 dugalj (nappali): N kapocs | N | kék | Elosztó – X1 dugalj (nappali) |
| 9 | PE-sín: PE | X1 dugalj (nappali): védőérintkező kapocs | PE | zöld-sárga | Elosztó – X1 dugalj (nappali) |
| 10 | F2 kismegszakító (konyhai dugaljak): 2 (ki) | X2 dugalj (konyha): L kapocs | L | barna | Elosztó – X2 dugalj (konyha) |
| 11 | Nullasín (N) a FI-relé után: N | X2 dugalj (konyha): N kapocs | N | kék | Elosztó – X2 dugalj (konyha) |
| 12 | PE-sín: PE | X2 dugalj (konyha): védőérintkező kapocs | PE | zöld-sárga | Elosztó – X2 dugalj (konyha) |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – X1 dugalj (nappali) | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Elosztó – X2 dugalj (konyha) | L (barna), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (8 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé); F1 – F1 kismegszakító (nappali dugaljak); F2 – F2 kismegszakító (konyhai dugaljak).

| Q1 | F1 | F2 | Eredmény (a szimuláció szerint) |
|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | be (bekapcsolva) | X1 dugalj (nappali): feszültség alatt; X2 dugalj (konyha): feszültség alatt; Q1 FI-relé: nem old ki |
| be (bekapcsolva) | be (bekapcsolva) | ki (kikapcsolva) | X1 dugalj (nappali): feszültség alatt; X2 dugalj (konyha): nem ad feszültséget; Q1 FI-relé: nem old ki |
| be (bekapcsolva) | ki (kikapcsolva) | be (bekapcsolva) | X1 dugalj (nappali): nem ad feszültséget; X2 dugalj (konyha): feszültség alatt; Q1 FI-relé: nem old ki |
| be (bekapcsolva) | ki (kikapcsolva) | ki (kikapcsolva) | X1 dugalj (nappali): nem ad feszültséget; X2 dugalj (konyha): nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | be (bekapcsolva) | be (bekapcsolva) | X1 dugalj (nappali): nem ad feszültséget; X2 dugalj (konyha): nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | be (bekapcsolva) | ki (kikapcsolva) | X1 dugalj (nappali): nem ad feszültséget; X2 dugalj (konyha): nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | ki (kikapcsolva) | be (bekapcsolva) | X1 dugalj (nappali): nem ad feszültséget; X2 dugalj (konyha): nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | ki (kikapcsolva) | ki (kikapcsolva) | X1 dugalj (nappali): nem ad feszültséget; X2 dugalj (konyha): nem ad feszültséget; Q1 FI-relé: nem old ki |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-KISMEGSZAKITO-ARAMKOROK-NL | Netlista (a rajz és a táblák forrása) | kismegszakito.netlist.json · 3bf085c5 | ☐ | ☐ | |
| BEK-KISMEGSZAKITO-ARAMKOROK-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · 244ec1ac | ☐ | ☐ | |
| BEK-KISMEGSZAKITO-ARAMKOROK-VEZ | Vezetéktábla (12 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KISMEGSZAKITO-ARAMKOROK-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KISMEGSZAKITO-ARAMKOROK-ALL | Kapcsolóállás-táblázat (8 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-KISMEGSZAKITO-ARAMKOROK):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KISMEGSZAKITO-ARAMKOROK).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FI-RELE-BEKOTES – Áram-védőkapcsoló (FI-relé) bekötése dugaljkör elé, próbagombbal

Forrás: content/tudastar/r3/aram-vedokapcsolo-fi-rele.netlist.json (netlista), content/tudastar/diagramok/fi-rele-bekotes.json (elrendezés); cikk: aram-vedokapcsolo-fi-rele, abra-2 („Áram-védőkapcsoló bekötése dugaljkör elé, próbagombbal”)

Ábra-azonosító: fi-rele-bekotes. Netlista-ujjlenyomat: 8f0e1c8c; ábra-ujjlenyomat: d8644f80 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (8 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Érszínek: barna = fázisvezető (L), kék = nullavezető (N), zöld-sárga = védővezető (PE). A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A betáp a lakáselosztó gyűjtősínjeit jelképezi (TN-C-S rendszer, a PEN szétválasztása a betáp előtt); a szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze (a szimulátor az ilyen kötést zárlatként elutasítja). A mérőhelyi és csatlakozási rész az elosztói engedélyes hatásköre, ezért itt nem szerepel. A keresztmetszet és a kismegszakító névleges árama méretezés kérdése (lib/sizing-tables.ts, jóváhagyásra vár), ezért az ábra nem ad számot. A próbagomb és a próbaellenállás a FI-relé házán belül van („belső” kapcsolat, nem szerelt ér); a próbaáramkör pontos kialakítása gyártónként eltér, az elv azonos: a próbaáram az összegáramváltót csak az egyik póluson kerüli meg.

**Kérdés a lektorhoz (BEK-FI-RELE-BEKOTES).** (1., a cikk saját kérdése) Egyezik-e a hatályos MSZ EN 61008-1-gyel: kioldás IΔn/2 és IΔn között; általános típusnál legfeljebb 0,3 s IΔn-nél és 0,04 s 5 · IΔn-nél?

**Kérdés a lektorhoz (BEK-FI-RELE-BEKOTES).** (2., a cikk saját kérdése) Az AC típus alkalmazhatóságáról a cikk csak óvatosan fogalmaz („sok helyen korlátozott”). Kell-e konkrét hazai előírásra hivatkozni (MSZ HD 60364-5-53, 531.3.3)?

**Kérdés a lektorhoz (BEK-FI-RELE-BEKOTES).** (3., a cikk saját kérdése) Tegyen-e a cikk konkrét javaslatot a próbagomb használatának gyakoriságára, vagy maradjon a „gyártó által megadott időközönként”?

**Kérdés a lektorhoz (BEK-FI-RELE-BEKOTES).** (4., a cikk saját kérdése) A próbaáramkör netlistabeli modellje (védett oldali fázis → ellenállás → táp oldali nulla) elfogadható-e általános elvként?

**Kérdés a lektorhoz (BEK-FI-RELE-BEKOTES).** (5., a cikk saját kérdése) A hibahelyzet-ábrán a testzárlatnál TN-rendszerben a kismegszakító is működhet; elég-e ezt a szövegben megemlíteni?

**Kérdés a lektorhoz (BEK-FI-RELE-BEKOTES).** (6., a cikk saját kérdése) A „Mi ellen nem véd?” két új pontja (PEN-szakadás TN-C-S rendszerben; a feszültségmentesítést nem helyettesíti) és a „nulla–védővezető összekötés a FI után rontja az érzékenységet” állítás elfogadható-e így?

**Kérdés a lektorhoz (BEK-FI-RELE-BEKOTES).** (7., a cikk saját kérdése) A P1 esetnél a cikk most kimondja, hogy jól szigetelő padlón az áram a kioldási érték alatt maradhat. Kell-e ehhez szám (IΔn/2) vagy az IEC TS 60479-1 tartományaira hivatkozás?

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (fi-rele-bekotes, ábra-ujjlenyomat d8644f80).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); készüléken belüli kötés (nem szerelt ér).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp (gyűjtősín): L | Q1 áram-védőkapcsoló (FI-relé): 1 (fázis, táp oldal) | L | barna | elosztón belül |
| 2 | Betáp (gyűjtősín): N | Q1 áram-védőkapcsoló (FI-relé): N (táp oldal) | N | kék | elosztón belül |
| 3 | Q1 áram-védőkapcsoló (FI-relé): N (védett oldal) | Nullasín (N) a FI-relé után: N | N | kék | elosztón belül |
| 4 | Betáp (gyűjtősín): PE | PE-sín: PE | PE | zöld-sárga | elosztón belül |
| 5 | Q1 áram-védőkapcsoló (FI-relé): 2 (fázis, védett oldal) | F1 kismegszakító (dugaljkör): 1 (be) | L | barna | elosztón belül |
| 6 | F1 kismegszakító (dugaljkör): 2 (ki) | X1 dugalj: L kapocs | L | barna | Elosztó – X1 dugalj |
| 7 | Nullasín (N) a FI-relé után: N | X1 dugalj: N kapocs | N | kék | Elosztó – X1 dugalj |
| 8 | PE-sín: PE | X1 dugalj: védőérintkező kapocs | PE | zöld-sárga | Elosztó – X1 dugalj |
| 9 | X1 dugalj: L kapocs | M1 mosógép (I. érintésvédelmi osztály, fémház): L | L | barna | Csatlakozózsinór és dugó |
| 10 | X1 dugalj: N kapocs | M1 mosógép (I. érintésvédelmi osztály, fémház): N | N | kék | Csatlakozózsinór és dugó |
| 11 | X1 dugalj: védőérintkező kapocs | M1 mosógép (I. érintésvédelmi osztály, fémház): fémház (PE) | PE | zöld-sárga | Csatlakozózsinór és dugó |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – X1 dugalj | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Csatlakozózsinór és dugó | L (barna), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (8 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé); T1 – Q1 próbagomb (T); F1 – F1 kismegszakító (dugaljkör).

| Q1 | T1 | F1 | Eredmény (a szimuláció szerint) |
|---|---|---|---|
| be (bekapcsolva) | nyugalom (nincs megnyomva) | be (bekapcsolva) | M1 mosógép: működik; X1 dugalj: feszültség alatt; Q1 FI-relé: nem old ki |
| be (bekapcsolva) | nyugalom (nincs megnyomva) | ki (kikapcsolva) | M1 mosógép: nem működik; X1 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| be (bekapcsolva) | megnyomva | be (bekapcsolva) | M1 mosógép: működik; X1 dugalj: feszültség alatt; Q1 FI-relé: kiold |
| be (bekapcsolva) | megnyomva | ki (kikapcsolva) | M1 mosógép: nem működik; X1 dugalj: nem ad feszültséget; Q1 FI-relé: kiold |
| ki (kikapcsolva) | nyugalom (nincs megnyomva) | be (bekapcsolva) | M1 mosógép: nem működik; X1 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | nyugalom (nincs megnyomva) | ki (kikapcsolva) | M1 mosógép: nem működik; X1 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | megnyomva | be (bekapcsolva) | M1 mosógép: nem működik; X1 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | megnyomva | ki (kikapcsolva) | M1 mosógép: nem működik; X1 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FI-RELE-BEKOTES-NL | Netlista (a rajz és a táblák forrása) | aram-vedokapcsolo-fi-rele.netlist.json · 8f0e1c8c | ☐ | ☐ | |
| BEK-FI-RELE-BEKOTES-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · d8644f80 | ☐ | ☐ | |
| BEK-FI-RELE-BEKOTES-VEZ | Vezetéktábla (11 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FI-RELE-BEKOTES-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FI-RELE-BEKOTES-ALL | Kapcsolóállás-táblázat (8 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-FI-RELE-BEKOTES):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FI-RELE-BEKOTES).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FI-RELE-HIBAHELYZETEK – Mikor old ki a FI-relé? Testzárlat, fázis–föld és fázis–nulla érintés

Forrás: content/tudastar/r3/aram-vedokapcsolo-fi-rele-hibahelyzetek.netlist.json (netlista), content/tudastar/diagramok/fi-rele-hibahelyzetek.json (elrendezés); cikk: aram-vedokapcsolo-fi-rele, abra-3 („Hibahelyzetek: testzárlat, fázis–föld és fázis–nulla érintés”)

Ábra-azonosító: fi-rele-hibahelyzetek. Netlista-ujjlenyomat: 704b52c6; ábra-ujjlenyomat: bcf3e28d (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (8 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Érszínek: barna = fázisvezető (L), kék = nullavezető (N), zöld-sárga = védővezető (PE). A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A betáp a lakáselosztó gyűjtősínjeit jelképezi (TN-C-S rendszer, a PEN szétválasztása a betáp előtt); a szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze (a szimulátor az ilyen kötést zárlatként elutasítja). A mérőhelyi és csatlakozási rész az elosztói engedélyes hatásköre, ezért itt nem szerepel. A keresztmetszet és a kismegszakító névleges árama méretezés kérdése (lib/sizing-tables.ts, jóváhagyásra vár), ezért az ábra nem ad számot. A hibahely és az érintés jelképes elem (impedancia), nem szerelt vezeték. A Q1 és az F1 végig bekapcsolt; a táblázat a hiba pillanatát mutatja, a kioldás előtt. A föld (talaj) a betáp csillagpontján át visszavezető potenciál.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (fi-rele-hibahelyzetek, ábra-ujjlenyomat bcf3e28d).

**Jelmagyarázat:** L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); jelképes hibahely (nem szerelt ér); érintési pont (nem szerelt ér).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp (gyűjtősín): L | Q1 áram-védőkapcsoló (FI-relé): 1 (fázis, táp oldal) | L | barna | elosztón belül |
| 2 | Betáp (gyűjtősín): N | Q1 áram-védőkapcsoló (FI-relé): N (táp oldal) | N | kék | elosztón belül |
| 3 | Q1 áram-védőkapcsoló (FI-relé): N (védett oldal) | Nullasín (N) a FI-relé után: N | N | kék | elosztón belül |
| 4 | Betáp (gyűjtősín): PE | PE-sín: PE | PE | zöld-sárga | elosztón belül |
| 5 | Q1 áram-védőkapcsoló (FI-relé): 2 (fázis, védett oldal) | F1 kismegszakító (dugaljkör): 1 (be) | L | barna | elosztón belül |
| 6 | F1 kismegszakító (dugaljkör): 2 (ki) | X1 dugalj: L kapocs | L | barna | Elosztó – X1 dugalj |
| 7 | Nullasín (N) a FI-relé után: N | X1 dugalj: N kapocs | N | kék | Elosztó – X1 dugalj |
| 8 | PE-sín: PE | X1 dugalj: védőérintkező kapocs | PE | zöld-sárga | Elosztó – X1 dugalj |
| 9 | X1 dugalj: L kapocs | M1 mosógép (I. érintésvédelmi osztály, fémház): L | L | barna | Csatlakozózsinór és dugó |
| 10 | X1 dugalj: N kapocs | M1 mosógép (I. érintésvédelmi osztály, fémház): N | N | kék | Csatlakozózsinór és dugó |
| 11 | X1 dugalj: védőérintkező kapocs | M1 mosógép (I. érintésvédelmi osztály, fémház): fémház (PE) | PE | zöld-sárga | Csatlakozózsinór és dugó |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – X1 dugalj | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Csatlakozózsinór és dugó | L (barna), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (8 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé); F1 – F1 kismegszakító (dugaljkör); H1 – H1 testzárlat a mosógépben (fázis → fémház); P1 – P1 érintés: fázis és föld; P2 – P2 érintés: fázis és nulla, a földtől elszigetelve.

| Q1 | F1 | H1 | P1 | P2 | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | nincs | nincs | nincs | M1 mosógép: működik; X1 dugalj: feszültség alatt; H1: hibaáram: nincs hibaáram; P1: áram a testen át: nem folyik áram; P2: áram a testen át: nem folyik áram; Q1 FI-relé: nem old ki |
| be (bekapcsolva) | be (bekapcsolva) | nincs | nincs | fennáll | M1 mosógép: működik; X1 dugalj: feszültség alatt; H1: hibaáram: nincs hibaáram; P1: áram a testen át: nem folyik áram; P2: áram a testen át: áram folyik át rajta; Q1 FI-relé: nem old ki |
| be (bekapcsolva) | be (bekapcsolva) | nincs | fennáll | nincs | M1 mosógép: működik; X1 dugalj: feszültség alatt; H1: hibaáram: nincs hibaáram; P1: áram a testen át: áram folyik át rajta; P2: áram a testen át: nem folyik áram; Q1 FI-relé: kiold |
| be (bekapcsolva) | be (bekapcsolva) | nincs | fennáll | fennáll | M1 mosógép: működik; X1 dugalj: feszültség alatt; H1: hibaáram: nincs hibaáram; P1: áram a testen át: áram folyik át rajta; P2: áram a testen át: áram folyik át rajta; Q1 FI-relé: kiold |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | nincs | nincs | M1 mosógép: működik; X1 dugalj: feszültség alatt; H1: hibaáram: hibaáram folyik; P1: áram a testen át: nem folyik áram; P2: áram a testen át: nem folyik áram; Q1 FI-relé: kiold |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | nincs | fennáll | M1 mosógép: működik; X1 dugalj: feszültség alatt; H1: hibaáram: hibaáram folyik; P1: áram a testen át: nem folyik áram; P2: áram a testen át: áram folyik át rajta; Q1 FI-relé: kiold |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | fennáll | nincs | M1 mosógép: működik; X1 dugalj: feszültség alatt; H1: hibaáram: hibaáram folyik; P1: áram a testen át: áram folyik át rajta; P2: áram a testen át: nem folyik áram; Q1 FI-relé: kiold |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | fennáll | fennáll | M1 mosógép: működik; X1 dugalj: feszültség alatt; H1: hibaáram: hibaáram folyik; P1: áram a testen át: áram folyik át rajta; P2: áram a testen át: áram folyik át rajta; Q1 FI-relé: kiold |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FI-RELE-HIBAHELYZETEK-NL | Netlista (a rajz és a táblák forrása) | aram-vedokapcsolo-fi-rele-hibahelyzetek.netlist.json · 704b52c6 | ☐ | ☐ | |
| BEK-FI-RELE-HIBAHELYZETEK-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · bcf3e28d | ☐ | ☐ | |
| BEK-FI-RELE-HIBAHELYZETEK-VEZ | Vezetéktábla (11 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FI-RELE-HIBAHELYZETEK-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FI-RELE-HIBAHELYZETEK-ALL | Kapcsolóállás-táblázat (8 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-FI-RELE-HIBAHELYZETEK):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FI-RELE-HIBAHELYZETEK).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FOLDELES-TN-C – TN-C rendszer: a PEN-vezető a fogyasztóig fut

Forrás: content/tudastar/r3/foldelesi-rendszerek-tn-c.netlist.json (netlista), content/tudastar/diagramok/foldeles-tn-c.json (elrendezés); cikk: foldelesi-rendszerek, abra-1 („TN-C rendszer”)

Ábra-azonosító: foldeles-tn-c. Netlista-ujjlenyomat: 742e564d; ábra-ujjlenyomat: a2c56b74 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt. A régi, kéteres („nullázott”) berendezésekre jellemző felépítés; új berendezés így nem készül.

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (1., a cikk saját kérdése) Hazai előfordulás: helytálló-e, hogy a közcélú kisfeszültségű hálózat jellemzően TN-C (négyvezetős), a lakossági fogyasztói berendezések nagy része TN-C-S, és TT ma inkább kivételesen fordul elő? Kell-e konkrétabb (elosztói engedélyesenkénti) megfogalmazás?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (2., a cikk saját kérdése) A PEN szétválasztásának helye (csatlakozószekrény, mérőhely, első elosztó) és az ott kötelező földelés (ismételt földelés, alapföldelő) – az MSZ 447 vagy az engedélyesek szabályzata rögzíti? Melyik ponton?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (3., a cikk saját kérdése) A cikk szerint a szétválasztásnál a PEN előbb a PE-sínre kerül, és onnan híddal a nullasínre. Az 543.4 pont pontosan mit ír elő?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (4., a cikk saját kérdése) A szimuláció ideális vezetőkkel, minőségi alapon számol („veszélyes lehet a lekapcsolásig”, „tartósan”). Elegendő-e így, vagy a hibafeszültség nagyságrendjét is közölni kell jóváhagyott forrásból?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (5., a cikk saját kérdése) A régi „nullázás” és „védőföldelés” elnevezés zárójeles használata elfogadható-e?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (Földelési rendszerek és EPH – közös kérdés 1.) Lektor: elfogadható-e az új érintési kategória neve és szövege („veszélyes lehet, tartósan; a FI-relé legfeljebb a testen átfolyó áramra old ki”) a TT, szakadt földelővezető esetre? Kell-e konkrét kioldási áramértéket (30 mA vagy 300 mA) közölni forrással, vagy elég a mostani, szám nélküli „nagyobb kioldási áramú (például tűzvédelmi célú)” megfogalmazás?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (Földelési rendszerek és EPH – közös kérdés 2.) Lektor: a PEN szétválasztásának helyét most nyitva hagytam („mérőhely vagy az azt követő első elosztó”, az engedélyes előírása szerint). Melyik a hazai szabály (MSZ 447 vagy engedélyesi szabályzat), és mi a pontszám?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (Földelési rendszerek és EPH – közös kérdés 3.) Lektor: az IT-szakasz két állítása helytálló-e így: az első hiba után a többi fázis a földhöz képest vonali feszültségre kerülhet, és a szórt kapacitáson át kis áram folyik?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (Földelési rendszerek és EPH – közös kérdés 4.) Lektor: a csillagpont-eltolódásos túlfeszültség (háromfázisú hálózatban, nullavezető-szakadáskor) a TN-S szakaszban szerepel, holott minden TN-rendszerre igaz. Maradjon itt, vagy kerüljön egy külön „nullavezető-szakadás / feszültségfigyelő relé” cikkbe (a P2 témakatalógusban szerepel)?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (Földelési rendszerek és EPH – közös kérdés 5.) Lektor: a TN-C-S szakasz szerint közös hálózati PEN szakadásakor a saját főkapcsoló lekapcsolása sem szünteti meg biztosan a veszélyt. Megfelelő-e ez a laikusnak szóló „Mikor hívj szakembert?” tanácsokkal együtt (főkapcsoló, fémrészek kerülése, azonnali jelzés az engedélyesnek)?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (Földelési rendszerek és EPH – közös kérdés 6.) Lektor: a feszültségmentesítés-cikk „Villamos berendezésen dolgozni csak feszültségmentes állapotban szabad” mondata szigorúbb a valóságnál, mert a feszültség alatti munka külön képesítéssel engedélyezett. Maradjon a konzervatív megfogalmazás, vagy kapjon szűkítést? Szerepeljen-e kifejezetten, hogy a multiméter nem helyettesíti az MSZ EN 61243-3 szerinti kétpólusú feszültségvizsgálót?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (Földelési rendszerek és EPH – közös kérdés 7.) Lektor: az EPH-cikk figyelmeztet, hogy a fém cső átvágásakor vagy az EPH-vezető bontásakor a két vég között életveszélyes feszültség lehet. Ideiglenes áthidaló vezetékre vonatkozó eljárást szándékosan nem írtam le, mert munkautasítás lenne. Kell-e ennél több, vagy elég a „szakember vizsgálja meg előtte”?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (Földelési rendszerek és EPH – közös kérdés 8.) Fejlesztő vagy lektor: a szimulátor ideális csomópont-modellje a TN-S-ben az N-t és a PE-t egy csomópontnak veszi, ezért egy „nullakapocs érintése” pont túlzó eredményt adna (testzárlatkor is „veszélyes”). Ezért a TN-S N-szakadásos életveszélyt csak szöveg mondja ki, szimuláció nem igazolja. A 2. fázisban kell-e vezetőimpedanciás (potenciálszintes) modell?

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (Földelési rendszerek és EPH – közös kérdés 9.) Szerkesztő: a foldelesi-rendszerek.md prózája 1490 szó, a felső korlát 1500. További biztonsági kiegészítéshez a cikket szét kell bontani; a témakatalógus a „(+ PEN-szétválasztás)” témát úgyis külön említi.

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (Földelési rendszerek és EPH – közös kérdés 10.) Koordináció: egy párhuzamosan dolgozó (védelmek csoportos) ellenőr 10:37:48-kor módosította a sim.py-t (a védelmi táblák lábjegyzete: „A szerelt vezetékezésben (a jelképes hibahelyet és érintést nem számítva)…”). Emiatt az aram-vedokapcsolo-fi-rele.md fi-rele-hibahelyzetek sim-blokkja most eltér, és a check_articles HIBÁ-t jelez. A cikk nem az én csoportom, nem nyúltam hozzá; a csoport gazdájának kell frissítenie: python3 sim.py --update-article ../tudastar-r3/aram-vedokapcsolo-fi-rele.md.

**Kérdés a lektorhoz (BEK-FOLDELES-TN-C).** (Földelési rendszerek és EPH – közös kérdés 11.) Lektor: a 2. ábra (TN-S) összehasonlító táblájában az N-szakadás sorában „érintés: nincs” áll, mert az érintés csak a fémházra vonatkozik. Ezt a táblázat bevezetője most kimondja. Elég-e ez, vagy a táblában is jelezni kell a nullavezető veszélyét?

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (foldeles-tn-c, ábra-ujjlenyomat a2c56b74).

**Jelmagyarázat:** FV – földelővezető (zöld-sárga); L1 – L1 fázis (barna); PEN – PEN-vezető (védő- és nullavezető) (zöld-sárga); L – fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); jelképes hibahely (nem szerelt ér).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PEN) | RB üzemi földelő (a csillagpont földelése): földelőkapocs | földelővezető | zöld-sárga | a táppontnál |
| 2 | T1 elosztói transzformátor, kisfeszültségű tekercs: L1 | F1 túláramvédelem (kismegszakító vagy olvadóbiztosító): 1 (be) | L1 | barna | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 3 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PEN) | PEN-kapocs az épület elosztójában: PEN | PEN | zöld-sárga | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 4 | F1 túláramvédelem (kismegszakító vagy olvadóbiztosító): 2 (ki) | M1 fémházas fogyasztó (I. érintésvédelmi osztály): L | L | barna | Fogyasztói áramkör |
| 5 | PEN-kapocs az épület elosztójában: PEN | XK PEN-kapocs a fogyasztó csatlakozásánál (N és PE közös): PEN | PEN | zöld-sárga | Fogyasztói áramkör |
| 6 | XK PEN-kapocs a fogyasztó csatlakozásánál (N és PE közös): N | M1 fémházas fogyasztó (I. érintésvédelmi osztály): N | N | kék | a fogyasztó csatlakozásánál |
| 7 | XK PEN-kapocs a fogyasztó csatlakozásánál (N és PE közös): PE | M1 fémházas fogyasztó (I. érintésvédelmi osztály): fémház (PE) | PE | zöld-sárga | a fogyasztó csatlakozásánál |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztói hálózat és csatlakozás (az engedélyes hatásköre) | L1 (barna), PEN (zöld-sárga) | 2 |
| Fogyasztói áramkör | L (barna), PEN (zöld-sárga) | 2 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: F1 – F1 túláramvédelem (kismegszakító vagy olvadóbiztosító); H1 – H1 testzárlat M1-ben (fázis → fémház); SZ – SZ PEN-szakadás a hálózatban.

| F1 | H1 | SZ | Eredmény (a szimuláció szerint) |
|---|---|---|---|
| be (bekapcsolva) | nincs | ép | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | nincs | szakadt | M1 fogyasztó: nem működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Érintés – M1 fémháza és a föld: veszélyes lehet, tartósan |
| be (bekapcsolva) | fennáll | ép | M1 fogyasztó: működik; H1: hibaáram útja: fémes hurok; F1 túláramvédelem: lekapcsolhat; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |
| be (bekapcsolva) | fennáll | szakadt | M1 fogyasztó: nem működik; H1: hibaáram útja: nincs zárt hurok; F1 túláramvédelem: nem kapcsol le; Érintés – M1 fémháza és a föld: veszélyes lehet, tartósan |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FOLDELES-TN-C-NL | Netlista (a rajz és a táblák forrása) | foldelesi-rendszerek-tn-c.netlist.json · 742e564d | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · a2c56b74 | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-VEZ | Vezetéktábla (7 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-FOLDELES-TN-C):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FOLDELES-TN-C).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FOLDELES-TN-S – TN-S rendszer: külön nulla- és védővezető a táppontól

Forrás: content/tudastar/r3/foldelesi-rendszerek-tn-s.netlist.json (netlista), content/tudastar/diagramok/foldeles-tn-s.json (elrendezés); cikk: foldelesi-rendszerek, abra-2 („TN-S rendszer”)

Ábra-azonosító: foldeles-tn-s. Netlista-ujjlenyomat: 816da23b; ábra-ujjlenyomat: 2f8e3995 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (foldeles-tn-s, ábra-ujjlenyomat 2f8e3995).

**Jelmagyarázat:** FV – földelővezető (zöld-sárga); L1 – L1 fázis (barna); N – nullavezető (kék); PE – védővezető (zöld-sárga); L – fázis (barna); jelképes hibahely (nem szerelt ér).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PE) | RB üzemi földelő (a csillagpont földelése): földelőkapocs | földelővezető | zöld-sárga | a táppontnál |
| 2 | T1 elosztói transzformátor, kisfeszültségű tekercs: L1 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 1 (fázis, táp oldal) | L1 | barna | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 3 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (N) | N-sín (nullasín): N | N | kék | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 4 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PE) | PE-sín (főföldelő sín): PE | PE | zöld-sárga | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 5 | N-sín (nullasín): N | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (táp oldal) | N | kék | elosztón belül |
| 6 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 2 (fázis, védett oldal) | F1 kismegszakító (túláramvédelem): 1 (be) | L | barna | elosztón belül |
| 7 | F1 kismegszakító (túláramvédelem): 2 (ki) | M1 fémházas fogyasztó (I. érintésvédelmi osztály): L | L | barna | Fogyasztói áramkör |
| 8 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (védett oldal) | M1 fémházas fogyasztó (I. érintésvédelmi osztály): N | N | kék | Fogyasztói áramkör |
| 9 | PE-sín (főföldelő sín): PE | M1 fémházas fogyasztó (I. érintésvédelmi osztály): fémház (PE) | PE | zöld-sárga | Fogyasztói áramkör |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztói hálózat és csatlakozás (az engedélyes hatásköre) | L1 (barna), N (kék), PE (zöld-sárga) | 3 |
| Fogyasztói áramkör | L (barna), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé), kétpólusú; F1 – F1 kismegszakító (túláramvédelem); H1 – H1 testzárlat M1-ben (fázis → fémház); SZ – SZ nullavezető-szakadás a hálózatban.

| Q1 | F1 | H1 | SZ | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | nincs | ép | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | nincs | szakadt | M1 fogyasztó: nem működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | ép | M1 fogyasztó: működik; H1: hibaáram útja: fémes hurok; F1 túláramvédelem: lekapcsolhat; Q1 FI-relé: kiold; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | szakadt | M1 fogyasztó: nem működik; H1: hibaáram útja: fémes hurok; F1 túláramvédelem: lekapcsolhat; Q1 FI-relé: kiold; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FOLDELES-TN-S-NL | Netlista (a rajz és a táblák forrása) | foldelesi-rendszerek-tn-s.netlist.json · 816da23b | ☐ | ☐ | |
| BEK-FOLDELES-TN-S-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · 2f8e3995 | ☐ | ☐ | |
| BEK-FOLDELES-TN-S-VEZ | Vezetéktábla (9 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-S-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-S-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-FOLDELES-TN-S):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FOLDELES-TN-S).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FOLDELES-TN-C-S – TN-C-S rendszer: PEN a szétválasztási pontig, utána külön N és PE

Forrás: content/tudastar/r3/foldelesi-rendszerek-tn-c-s.netlist.json (netlista), content/tudastar/diagramok/foldeles-tn-c-s.json (elrendezés); cikk: foldelesi-rendszerek, abra-3 („TN-C-S rendszer és a PEN szétválasztása”)

Ábra-azonosító: foldeles-tn-c-s. Netlista-ujjlenyomat: bff6a9cd; ábra-ujjlenyomat: f84a4546 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt. A szétválasztási pont helyét és kialakítását az elosztói engedélyes előírásai határozzák meg.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (foldeles-tn-c-s, ábra-ujjlenyomat f84a4546).

**Jelmagyarázat:** FV – földelővezető (zöld-sárga); L1 – L1 fázis (barna); PEN – PEN-vezető (védő- és nullavezető) (zöld-sárga); N – nullavezető (kék); L – fázis (barna); PE – védővezető (zöld-sárga); jelképes hibahely (nem szerelt ér).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PEN) | RB üzemi földelő (a csillagpont földelése): földelőkapocs | földelővezető | zöld-sárga | a táppontnál |
| 2 | T1 elosztói transzformátor, kisfeszültségű tekercs: L1 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 1 (fázis, táp oldal) | L1 | barna | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 3 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PEN) | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): PEN (érkező) | PEN | zöld-sárga | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 4 | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): N-sín | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (táp oldal) | N | kék | elosztón belül |
| 5 | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): PE-sín | RA földelő az épületnél (alapföldelő vagy ismételt földelés): földelőkapocs | földelővezető | zöld-sárga | elosztón belül |
| 6 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 2 (fázis, védett oldal) | F1 kismegszakító (túláramvédelem): 1 (be) | L | barna | elosztón belül |
| 7 | F1 kismegszakító (túláramvédelem): 2 (ki) | M1 fémházas fogyasztó (I. érintésvédelmi osztály): L | L | barna | Fogyasztói áramkör |
| 8 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (védett oldal) | M1 fémházas fogyasztó (I. érintésvédelmi osztály): N | N | kék | Fogyasztói áramkör |
| 9 | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): PE-sín | M1 fémházas fogyasztó (I. érintésvédelmi osztály): fémház (PE) | PE | zöld-sárga | Fogyasztói áramkör |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztói hálózat és csatlakozás (az engedélyes hatásköre) | L1 (barna), PEN (zöld-sárga) | 2 |
| Fogyasztói áramkör | L (barna), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé), kétpólusú; F1 – F1 kismegszakító (túláramvédelem); H1 – H1 testzárlat M1-ben (fázis → fémház); SZ – SZ PEN-szakadás a hálózatban vagy a csatlakozó vezetékben.

| Q1 | F1 | H1 | SZ | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | nincs | ép | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | nincs | szakadt | M1 fogyasztó: rendellenesen (a földön át); H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: veszélyes lehet, tartósan |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | ép | M1 fogyasztó: működik; H1: hibaáram útja: fémes hurok; F1 túláramvédelem: lekapcsolhat; Q1 FI-relé: kiold; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | szakadt | M1 fogyasztó: rendellenesen (a földön át); H1: hibaáram útja: a földön át; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: kiold; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FOLDELES-TN-C-S-NL | Netlista (a rajz és a táblák forrása) | foldelesi-rendszerek-tn-c-s.netlist.json · bff6a9cd | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-S-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · f84a4546 | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-S-VEZ | Vezetéktábla (9 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-S-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-S-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-FOLDELES-TN-C-S):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FOLDELES-TN-C-S).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FOLDELES-TT – TT rendszer: a fémház a saját földelőn

Forrás: content/tudastar/r3/foldelesi-rendszerek-tt.netlist.json (netlista), content/tudastar/diagramok/foldeles-tt.json (elrendezés); cikk: foldelesi-rendszerek, abra-4 („TT rendszer”)

Ábra-azonosító: foldeles-tt. Netlista-ujjlenyomat: 553eca92; ábra-ujjlenyomat: 9a79c8ae (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (foldeles-tt, ábra-ujjlenyomat 9a79c8ae).

**Jelmagyarázat:** FV – földelővezető (zöld-sárga); L1 – L1 fázis (barna); N – nullavezető (kék); L – fázis (barna); PE – védővezető (zöld-sárga); jelképes hibahely (nem szerelt ér).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (N) | RB üzemi földelő (a csillagpont földelése): földelőkapocs | földelővezető | zöld-sárga | a táppontnál |
| 2 | T1 elosztói transzformátor, kisfeszültségű tekercs: L1 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 1 (fázis, táp oldal) | L1 | barna | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 3 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (N) | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (táp oldal) | N | kék | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 4 | PE-sín (főföldelő sín): PE | RA védőföldelő (az épület saját földelője): földelőkapocs | földelővezető | zöld-sárga | elosztón belül |
| 5 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 2 (fázis, védett oldal) | F1 kismegszakító (túláramvédelem): 1 (be) | L | barna | elosztón belül |
| 6 | F1 kismegszakító (túláramvédelem): 2 (ki) | M1 fémházas fogyasztó (I. érintésvédelmi osztály): L | L | barna | Fogyasztói áramkör |
| 7 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (védett oldal) | M1 fémházas fogyasztó (I. érintésvédelmi osztály): N | N | kék | Fogyasztói áramkör |
| 8 | PE-sín (főföldelő sín): PE | M1 fémházas fogyasztó (I. érintésvédelmi osztály): fémház (PE) | PE | zöld-sárga | Fogyasztói áramkör |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztói hálózat és csatlakozás (az engedélyes hatásköre) | L1 (barna), N (kék) | 2 |
| Fogyasztói áramkör | L (barna), N (kék), PE (zöld-sárga) | 3 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé), kétpólusú; F1 – F1 kismegszakító (túláramvédelem); H1 – H1 testzárlat M1-ben (fázis → fémház); SZ – SZ a védőföldelő vezetőjének szakadása.

| Q1 | F1 | H1 | SZ | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | nincs | ép | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | nincs | szakadt | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | ép | M1 fogyasztó: működik; H1: hibaáram útja: a földön át; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: kiold; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | szakadt | M1 fogyasztó: működik; H1: hibaáram útja: nincs zárt hurok; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: veszélyes lehet, tartósan; a FI-relé legfeljebb a testen átfolyó áramra old ki |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FOLDELES-TT-NL | Netlista (a rajz és a táblák forrása) | foldelesi-rendszerek-tt.netlist.json · 553eca92 | ☐ | ☐ | |
| BEK-FOLDELES-TT-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · 9a79c8ae | ☐ | ☐ | |
| BEK-FOLDELES-TT-VEZ | Vezetéktábla (8 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TT-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TT-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-FOLDELES-TT):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FOLDELES-TT).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FOLDELES-IT – IT rendszer: földeletlen táppont, földelt fémházak

Forrás: content/tudastar/r3/foldelesi-rendszerek-it.netlist.json (netlista), content/tudastar/diagramok/foldeles-it.json (elrendezés); cikk: foldelesi-rendszerek, abra-5 („IT rendszer”)

Ábra-azonosító: foldeles-it. Netlista-ujjlenyomat: 60981084; ábra-ujjlenyomat: f1d3c3b2 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt. IT-rendszer jellemzően saját transzformátorral készül (például ipari üzemben vagy kórházi helyiségben); a nullavezetőt itt nem vezetik ki. A szigetelésfigyelő megfigyelő elem: a szimulációban nem vezet.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (foldeles-it, ábra-ujjlenyomat f1d3c3b2).

**Jelmagyarázat:** L1 – L1 fázis (barna); PE – védővezető (zöld-sárga); FV – földelővezető (zöld-sárga); L2 – L2 fázis (fekete); L3 – L3 fázis (szürke); jelképes hibahely (nem szerelt ér).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | T1 transzformátor (IT-táppont), kisfeszültségű tekercs: L1 | SZF szigetelésfigyelő: mérőkapocs a hálózaton | L1 | barna | a táppontnál |
| 2 | SZF szigetelésfigyelő: PE | PE-sín: PE | PE | zöld-sárga | a táppontnál |
| 3 | PE-sín: PE | RA védőföldelő (a fémházak közös földelője): földelőkapocs | földelővezető | zöld-sárga | a táppontnál |
| 4 | T1 transzformátor (IT-táppont), kisfeszültségű tekercs: L1 | Q1 háromfázisú kismegszakító (M1): 1 (L1 be) | L1 | barna | a táppontnál |
| 5 | T1 transzformátor (IT-táppont), kisfeszültségű tekercs: L2 | Q1 háromfázisú kismegszakító (M1): 3 (L2 be) | L2 | fekete | a táppontnál |
| 6 | T1 transzformátor (IT-táppont), kisfeszültségű tekercs: L3 | Q1 háromfázisú kismegszakító (M1): 5 (L3 be) | L3 | szürke | a táppontnál |
| 7 | T1 transzformátor (IT-táppont), kisfeszültségű tekercs: L1 | Q2 háromfázisú kismegszakító (M2): 1 (L1 be) | L1 | barna | a táppontnál |
| 8 | T1 transzformátor (IT-táppont), kisfeszültségű tekercs: L2 | Q2 háromfázisú kismegszakító (M2): 3 (L2 be) | L2 | fekete | a táppontnál |
| 9 | T1 transzformátor (IT-táppont), kisfeszültségű tekercs: L3 | Q2 háromfázisú kismegszakító (M2): 5 (L3 be) | L3 | szürke | a táppontnál |
| 10 | Q1 háromfázisú kismegszakító (M1): 2 (L1 ki) | M1 háromfázisú fémházas fogyasztó: L1 | L1 | barna | Áramkör M1-hez |
| 11 | Q1 háromfázisú kismegszakító (M1): 4 (L2 ki) | M1 háromfázisú fémházas fogyasztó: L2 | L2 | fekete | Áramkör M1-hez |
| 12 | Q1 háromfázisú kismegszakító (M1): 6 (L3 ki) | M1 háromfázisú fémházas fogyasztó: L3 | L3 | szürke | Áramkör M1-hez |
| 13 | PE-sín: PE | M1 háromfázisú fémházas fogyasztó: fémház (PE) | PE | zöld-sárga | Áramkör M1-hez |
| 14 | Q2 háromfázisú kismegszakító (M2): 2 (L1 ki) | M2 háromfázisú fémházas fogyasztó: L1 | L1 | barna | Áramkör M2-höz |
| 15 | Q2 háromfázisú kismegszakító (M2): 4 (L2 ki) | M2 háromfázisú fémházas fogyasztó: L2 | L2 | fekete | Áramkör M2-höz |
| 16 | Q2 háromfázisú kismegszakító (M2): 6 (L3 ki) | M2 háromfázisú fémházas fogyasztó: L3 | L3 | szürke | Áramkör M2-höz |
| 17 | PE-sín: PE | M2 háromfázisú fémházas fogyasztó: fémház (PE) | PE | zöld-sárga | Áramkör M2-höz |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Áramkör M1-hez | L1 (barna), L2 (fekete), L3 (szürke), PE (zöld-sárga) | 4 |
| Áramkör M2-höz | L1 (barna), L2 (fekete), L3 (szürke), PE (zöld-sárga) | 4 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (4 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: Q1 – Q1 háromfázisú kismegszakító (M1); Q2 – Q2 háromfázisú kismegszakító (M2); H1 – H1 testzárlat M1-ben (L1 → fémház); H2 – H2 testzárlat M2-ben (L2 → fémház).

| Q1 | Q2 | H1 | H2 | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | nincs | nincs | M1 fogyasztó: működik; M2 fogyasztó: működik; H1: hibaáram útja: nincs hiba; H2: hibaáram útja: nincs hiba; Q1 túláramvédelem: nem kapcsol le; Q2 túláramvédelem: nem kapcsol le; SZF szigetelésfigyelő: nem jelez; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | nincs | fennáll | M1 fogyasztó: működik; M2 fogyasztó: működik; H1: hibaáram útja: nincs hiba; H2: hibaáram útja: nincs zárt hurok; Q1 túláramvédelem: nem kapcsol le; Q2 túláramvédelem: nem kapcsol le; SZF szigetelésfigyelő: jelez; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | nincs | M1 fogyasztó: működik; M2 fogyasztó: működik; H1: hibaáram útja: nincs zárt hurok; H2: hibaáram útja: nincs hiba; Q1 túláramvédelem: nem kapcsol le; Q2 túláramvédelem: nem kapcsol le; SZF szigetelésfigyelő: jelez; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | fennáll | M1 fogyasztó: működik; M2 fogyasztó: működik; H1: hibaáram útja: fémes hurok; H2: hibaáram útja: fémes hurok; Q1 túláramvédelem: lekapcsolhat; Q2 túláramvédelem: lekapcsolhat; SZF szigetelésfigyelő: jelez; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FOLDELES-IT-NL | Netlista (a rajz és a táblák forrása) | foldelesi-rendszerek-it.netlist.json · 60981084 | ☐ | ☐ | |
| BEK-FOLDELES-IT-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · f1d3c3b2 | ☐ | ☐ | |
| BEK-FOLDELES-IT-VEZ | Vezetéktábla (17 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-IT-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-IT-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-FOLDELES-IT):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FOLDELES-IT).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-EPH-ALAPOK – Egyenpotenciálra hozás: a fő EPH-sín és a vízvezeték bekötése (TN-C-S)

Forrás: content/tudastar/r3/egyenpotencialra-hozas-eph.netlist.json (netlista), content/tudastar/diagramok/eph-alapok.json (elrendezés); cikk: egyenpotencialra-hozas-eph, abra-1 („A fő EPH-sín és a vízvezeték bekötése”)

Ábra-azonosító: eph-alapok. Netlista-ujjlenyomat: d0990558; ábra-ujjlenyomat: c6056099 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A kapcsolóállás-táblázatot a program szimulátora számolta; a független Python-szimulátorral: egyezik (8 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae).

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt. A fém vízvezeték az épületbe a talajból lép be, ezért a szimulációban a talajjal is érintkezik. A gázvezeték bekötését az elosztói és a gázszolgáltatói előírások szabályozzák; az ábra nem mutatja.

**Kérdés a lektorhoz (BEK-EPH-ALAPOK).** (1., a cikk saját kérdése) A fürdőszobai kiegészítő EPH: a hatályos MSZ HD 60364-7-701 szerint mikor kötelező, és mikor hagyható el (például 30 mA-es áram-védőkapcsolóval védett áramköröknél)? A cikk most csak a tervezői döntésre utal.

**Kérdés a lektorhoz (BEK-EPH-ALAPOK).** (2., a cikk saját kérdése) A gázvezeték EPH-bekötésének hazai szabályai (szigetelő közdarab, a bekötés helye, gázszolgáltatói előírás) – elegendő-e a puszta hivatkozás?

**Kérdés a lektorhoz (BEK-EPH-ALAPOK).** (3., a cikk saját kérdése) A fő EPH-vezető és a kiegészítő EPH-vezető legkisebb keresztmetszete: a cikk szándékosan nem ad számot. Kell-e jóváhagyott táblázat?

**Kérdés a lektorhoz (BEK-EPH-ALAPOK).** (4., a cikk saját kérdése) A szimuláció a fém vízvezetéket a talajjal érintkezőnek tekinti. Ez a mai, műanyag bekötővezetékes házakban gyakran nem igaz; elég-e ezt a cikkben megemlíteni?

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (eph-alapok, ábra-ujjlenyomat c6056099).

**Jelmagyarázat:** FV – földelővezető (zöld-sárga); L1 – L1 fázis (barna); PEN – PEN-vezető (védő- és nullavezető) (zöld-sárga); N – nullavezető (kék); PE – védővezető (zöld-sárga); EPH – EPH-vezető (egyenpotenciálra hozó) (zöld-sárga); L – fázis (barna); jelképes hibahely (nem szerelt ér).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PEN) | RB üzemi földelő (a csillagpont földelése): földelőkapocs | földelővezető | zöld-sárga | a táppontnál |
| 2 | T1 elosztói transzformátor, kisfeszültségű tekercs: L1 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 1 (fázis, táp oldal) | L1 | barna | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 3 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PEN) | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): PEN (érkező) | PEN | zöld-sárga | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 4 | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): N-sín | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (táp oldal) | N | kék | elosztón belül |
| 5 | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): PE-sín | Fő EPH-sín (főföldelő sín): gyűjtőkapocs | PE (fő védővezető) | zöld-sárga | elosztón belül |
| 6 | Fő EPH-sín (főföldelő sín): gyűjtőkapocs | RA alapföldelő: földelőkapocs | földelővezető | zöld-sárga | elosztón belül |
| 7 | Fő EPH-sín (főföldelő sín): gyűjtőkapocs | VIZ fém vízvezeték (idegen vezetőképes rész): csőbilincs (EPH-kötés) | EPH-vezető | zöld-sárga | Fő EPH-vezető a vízvezetékhez |
| 8 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 2 (fázis, védett oldal) | F1 kismegszakító (túláramvédelem): 1 (be) | L | barna | elosztón belül |
| 9 | F1 kismegszakító (túláramvédelem): 2 (ki) | M1 fémházas mosógép (I. érintésvédelmi osztály): L | L | barna | Fogyasztói áramkör |
| 10 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (védett oldal) | M1 fémházas mosógép (I. érintésvédelmi osztály): N | N | kék | Fogyasztói áramkör |
| 11 | Fő EPH-sín (főföldelő sín): gyűjtőkapocs | M1 fémházas mosógép (I. érintésvédelmi osztály): fémház (PE) | PE | zöld-sárga | Fogyasztói áramkör |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztói hálózat és csatlakozás (az engedélyes hatásköre) | L1 (barna), PEN (zöld-sárga) | 2 |
| Fogyasztói áramkör | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Fő EPH-vezető a vízvezetékhez | EPH-vezető (zöld-sárga) | 1 |

**3. táblázat – kapcsolóállás-táblázat** (TS = Python: egyezik (8 állás; kimenetek, invariánsok, vezetéktábla; Python-szimulátor: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae)). Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé), kétpólusú; F1 – F1 kismegszakító (túláramvédelem); H1 – H1 testzárlat M1-ben (fázis → fémház); EPH1 – EPH1 a vízvezeték EPH-bekötése; SZ – SZ PEN-szakadás a hálózatban.

| Q1 | F1 | H1 | EPH1 | SZ | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | nincs | bekötve | ép | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a vízcsap: nincs veszély; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | nincs | bekötve | szakadt | M1 fogyasztó: rendellenesen (a földön át); H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a vízcsap: nincs veszély; Érintés – M1 fémháza és a föld: veszélyes lehet, tartósan |
| be (bekapcsolva) | be (bekapcsolva) | nincs | hiányzik | ép | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a vízcsap: nincs veszély; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | nincs | hiányzik | szakadt | M1 fogyasztó: rendellenesen (a földön át); H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a vízcsap: veszélyes lehet, tartósan; Érintés – M1 fémháza és a föld: veszélyes lehet, tartósan |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | bekötve | ép | M1 fogyasztó: működik; H1: hibaáram útja: fémes hurok; F1 túláramvédelem: lekapcsolhat; Q1 FI-relé: kiold; Érintés – M1 fémháza és a vízcsap: veszélyes lehet a lekapcsolásig; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | bekötve | szakadt | M1 fogyasztó: rendellenesen (a földön át); H1: hibaáram útja: a földön át; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: kiold; Érintés – M1 fémháza és a vízcsap: veszélyes lehet a lekapcsolásig; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | hiányzik | ép | M1 fogyasztó: működik; H1: hibaáram útja: fémes hurok; F1 túláramvédelem: lekapcsolhat; Q1 FI-relé: kiold; Érintés – M1 fémháza és a vízcsap: veszélyes lehet a lekapcsolásig; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | hiányzik | szakadt | M1 fogyasztó: rendellenesen (a földön át); H1: hibaáram útja: a földön át; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: kiold; Érintés – M1 fémháza és a vízcsap: veszélyes lehet a lekapcsolásig; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-EPH-ALAPOK-NL | Netlista (a rajz és a táblák forrása) | egyenpotencialra-hozas-eph.netlist.json · d0990558 | ☐ | ☐ | |
| BEK-EPH-ALAPOK-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · c6056099 | ☐ | ☐ | |
| BEK-EPH-ALAPOK-VEZ | Vezetéktábla (11 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-EPH-ALAPOK-SZAK | Szakaszok és érszám (3 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-EPH-ALAPOK-ALL | Kapcsolóállás-táblázat (8 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat · TS = Python | ☐ | ☐ | |

**Döntés (BEK-EPH-ALAPOK):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-EPH-ALAPOK).

Megjegyzés a blokkhoz (forrás, kiadás):

## 5. rész – Biztonsági cikkek (R3) (helyőrző)

> **Helyőrző.** A Tudástár biztonsági (R3) cikkeinek elkészülte után kerül be: cikkenként az állítások, a figyelmeztetések és a források tételes listája.

Tervezett tartalom: a feszültségmentesítés öt szabálya, áram-védőkapcsoló (FI-relé) alapjai, kismegszakító (B/C/D) és Ib ≤ In ≤ Iz, földelési rendszerek. Azonosító-előtag: `CIK-`.

## 6. rész – Vizsgakérdések (helyőrző)

> **Helyőrző.** A vizsgaszimuláció kérdésbankjának elkészülte után kerül be (szakoktatóval vagy vizsgáztatóval együtt): kérdésenként a helyes válasz, a disztraktorok és az indoklás.

Tervezett tartalom: villanyszerelő szakmai kérdésbank. Azonosító-előtag: `VK-`.

## Jóváhagyó lap

Blokkösszesítő:

| Blokk | Megnevezés | Tételek | Mind rendben | Eltérő tételek (db) |
|---|---|---:|:-:|---|
| T-KM | Keresztmetszet-lépcsők | 1 | ☐ | |
| T-PVC2 | Terhelhetőség Iz0 – PVC, réz, 2 terhelt ér | 40 | ☐ | |
| T-PVC3 | Terhelhetőség Iz0 – PVC, réz, 3 terhelt ér | 40 | ☐ | |
| T-XLPE | XLPE/EPR-táblázatok (szándékosan üres) | 2 | ☐ | |
| T-KT | Hőmérsékleti tényező kθ – PVC, levegőben | 11 | ☐ | |
| T-KCS | Csoportosítási tényező kcs | 12 | ☐ | |
| T-DU | Feszültségesés-határ | 4 | ☐ | |
| T-K | Állandók | 9 | ☐ | |
| F | Forrásmegjelölések | 14 | ☐ | |
| SZP | Számítási sorokban hivatkozott szabványpontok | 6 | ☐ | |
| L | Szerelésimód- és szigetelésleírások | 7 | ☐ | |
| K | Képletek | 10 | ☐ | |
| D-ALAP | Alapértékek (ha a felhasználó nem ad meg adatot) | 7 | ☐ | |
| D-JEL | Kábeljelölés-felismerés | 6 | ☐ | |
| D | Programozott döntések | 15 | ☐ | |
| KAL-KOZOS | Közös működés (minden T1 kalkulátor) | 8 | ☐ | |
| KAL-FESZULTSEGES | Feszültségesés | 17 | ☐ | |
| KAL-MOTOR-ARAM | Motor névleges árama | 18 | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG | LED-szalag tápegysége | 13 | ☐ | |
| KAL-FAZISJAVITAS | Fázisjavítás (meddőkompenzálás) | 15 | ☐ | |
| KAL-KERESZTMETSZET | Keresztmetszet-választás | 14 | ☐ | |
| KAL-KISMEGSZAKITO | Kismegszakító-választás | 15 | ☐ | |
| KAL-HUROKIMPEDANCIA | Hurokimpedancia és zárlati áram | 14 | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT | Terhelhetőségi táblázat | 12 | ☐ | |
| BEK-EGYPOLUSU-KAPCSOLO-101 | Egypólusú kapcsoló (101): egy lámpa egy helyről | 5 | ☐ | |
| BEK-KETPOLUSU-KAPCSOLO-102 | Kétpólusú kapcsoló (102): a fázis- és a nullavezető együttes bontása | 5 | ☐ | |
| BEK-CSILLARKAPCSOLO-105 | Csillárkapcsoló (105): két lámpakör egy helyről | 5 | ☐ | |
| BEK-VALTOKAPCSOLO-106 | Váltókapcsolás (2 × 106): egy lámpa két helyről | 5 | ☐ | |
| BEK-KETTOS-VALTOKAPCSOLO-106-6 | Kettős váltókapcsoló (106+6): két lámpa, mindkettő két helyről | 5 | ☐ | |
| BEK-KERESZTKAPCSOLO-107 | Keresztkapcsolás (106 + 107 + 106): egy lámpa három helyről | 5 | ☐ | |
| BEK-KERESZTKAPCSOLO-107-2X107 | Keresztkapcsolás (106 + 2 × 107 + 106): egy lámpa 4 helyről | 5 | ☐ | |
| BEK-KERESZTKAPCSOLO-107-3X107 | Keresztkapcsolás (106 + 3 × 107 + 106): egy lámpa 5 helyről | 5 | ☐ | |
| BEK-KERESZTKAPCSOLO-107-4X107 | Keresztkapcsolás (106 + 4 × 107 + 106): egy lámpa 6 helyről | 5 | ☐ | |
| BEK-DUGALJ-ATHURKOLAS | Dugaljkör áthurkolással: két védőérintkezős dugalj FI-relé és kismegszakító után | 5 | ☐ | |
| BEK-DUGALJ-LEAGAZTATAS | Dugaljkör leágaztatással: két dugalj a kötődobozból, FI-relé és kismegszakító után | 5 | ☐ | |
| BEK-KISMEGSZAKITO-ARAMKOROK | Két dugaljkör saját kismegszakítóval, közös FI-relé után | 5 | ☐ | |
| BEK-FI-RELE-BEKOTES | Áram-védőkapcsoló (FI-relé) bekötése dugaljkör elé, próbagombbal | 5 | ☐ | |
| BEK-FI-RELE-HIBAHELYZETEK | Mikor old ki a FI-relé? Testzárlat, fázis–föld és fázis–nulla érintés | 5 | ☐ | |
| BEK-FOLDELES-TN-C | TN-C rendszer: a PEN-vezető a fogyasztóig fut | 5 | ☐ | |
| BEK-FOLDELES-TN-S | TN-S rendszer: külön nulla- és védővezető a táppontól | 5 | ☐ | |
| BEK-FOLDELES-TN-C-S | TN-C-S rendszer: PEN a szétválasztási pontig, utána külön N és PE | 5 | ☐ | |
| BEK-FOLDELES-TT | TT rendszer: a fémház a saját földelőn | 5 | ☐ | |
| BEK-FOLDELES-IT | IT rendszer: földeletlen táppont, földelt fémházak | 5 | ☐ | |
| BEK-EPH-ALAPOK | Egyenpotenciálra hozás: a fő EPH-sín és a vízvezeték bekötése (TN-C-S) | 5 | ☐ | |

### 3. rész – kalkulátoronkénti döntés

A 3. rész kalkulátoronként hagyható jóvá. „Jóváhagyom”: a kalkulátor blokkja és a KAL-KOZOS blokk eltérés nélkül egyezik; a program a kalkulátort a sorban álló ujjlenyomat-párral rögzített lektori rekorddal teszi közzé, a táblázat-kapus kalkulátort csak az 1. rész jóváhagyása után. „Javítás után / nem”: a kalkulátor a javított kiadásban (a változott tételek ellenőrzése után) vagy egyáltalán nem hagyható jóvá; az okot kérjük a megjegyzésbe írni. Jelöletlen sor: nem jóváhagyott.

| Kalkulátor | Blokk | Tartalmi ujjlenyomat | Forrás-ujjlenyomat | Táblázat-kapu | Döntés |
|---|---|---|---|---|---|
| Feszültségesés | KAL-FESZULTSEGES | f1be2f7d | c0f73c97 | igen | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Motor névleges árama | KAL-MOTOR-ARAM | d3861940 | 81ecfbc6 | nem | ☐ Jóváhagyom · ☐ Javítás után / nem |
| LED-szalag tápegysége | KAL-LED-SZALAG-TAPEGYSEG | 12c6bbe4 | 48423097 | nem | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Fázisjavítás (meddőkompenzálás) | KAL-FAZISJAVITAS | 9d9f7219 | 737957ec | nem | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Keresztmetszet-választás | KAL-KERESZTMETSZET | b7b5caee | fb81ce00 | igen | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Kismegszakító-választás | KAL-KISMEGSZAKITO | a8ff2c9b | 48c4f6af | igen | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Hurokimpedancia és zárlati áram | KAL-HUROKIMPEDANCIA | 293f288b | b6d0b20e | igen | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Terhelhetőségi táblázat | KAL-TERHELHETOSEG-TABLAZAT | 135442b5 | 5f043d00 | igen | ☐ Jóváhagyom · ☐ Javítás után / nem |

### 4. rész – ábránkénti döntés

A 4. rész ábránként hagyható jóvá. „Jóváhagyom”: az ábra blokkja eltérés nélkül helyes (bekötés, érszínek, kapcsok, szakaszok, működés). „Javítással”: az ábra a megjegyzésben leírt javítás után, a javított kiadásban hagyható jóvá. „Elutasítom”: az ábra a cikkben nem jelenhet meg; az okot kérjük a megjegyzésbe írni. Jelöletlen sor: nem jóváhagyott. Az ábra csak a cikk szövegének jóváhagyásával együtt jelenhet meg.

| Ábra | Blokk | Netlista (ujjlenyomat) | Ábra (ujjlenyomat) | Döntés |
|---|---|---|---|---|
| Egypólusú kapcsoló (101): egy lámpa egy helyről | BEK-EGYPOLUSU-KAPCSOLO-101 | 162c980a | 0b299afb | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Kétpólusú kapcsoló (102): a fázis- és a nullavezető együttes bontása | BEK-KETPOLUSU-KAPCSOLO-102 | a253fd8a | 361fdb2a | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Csillárkapcsoló (105): két lámpakör egy helyről | BEK-CSILLARKAPCSOLO-105 | 171c858b | f7930873 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Váltókapcsolás (2 × 106): egy lámpa két helyről | BEK-VALTOKAPCSOLO-106 | 909db559 | 79d7b08a | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Kettős váltókapcsoló (106+6): két lámpa, mindkettő két helyről | BEK-KETTOS-VALTOKAPCSOLO-106-6 | 837cd200 | 7a0aa663 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Keresztkapcsolás (106 + 107 + 106): egy lámpa három helyről | BEK-KERESZTKAPCSOLO-107 | 835f0537 | 2902a14a | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Keresztkapcsolás (106 + 2 × 107 + 106): egy lámpa 4 helyről | BEK-KERESZTKAPCSOLO-107-2X107 | 9566473c | 96217f1e | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Keresztkapcsolás (106 + 3 × 107 + 106): egy lámpa 5 helyről | BEK-KERESZTKAPCSOLO-107-3X107 | f9fd89d8 | 5e3b5a40 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Keresztkapcsolás (106 + 4 × 107 + 106): egy lámpa 6 helyről | BEK-KERESZTKAPCSOLO-107-4X107 | e67cbcc6 | b7949588 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Dugaljkör áthurkolással: két védőérintkezős dugalj FI-relé és kismegszakító után | BEK-DUGALJ-ATHURKOLAS | 9bb3ff8e | f68b16a5 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Dugaljkör leágaztatással: két dugalj a kötődobozból, FI-relé és kismegszakító után | BEK-DUGALJ-LEAGAZTATAS | 143d7450 | ff622029 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Két dugaljkör saját kismegszakítóval, közös FI-relé után | BEK-KISMEGSZAKITO-ARAMKOROK | 3bf085c5 | 244ec1ac | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Áram-védőkapcsoló (FI-relé) bekötése dugaljkör elé, próbagombbal | BEK-FI-RELE-BEKOTES | 8f0e1c8c | d8644f80 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Mikor old ki a FI-relé? Testzárlat, fázis–föld és fázis–nulla érintés | BEK-FI-RELE-HIBAHELYZETEK | 704b52c6 | bcf3e28d | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| TN-C rendszer: a PEN-vezető a fogyasztóig fut | BEK-FOLDELES-TN-C | 742e564d | a2c56b74 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| TN-S rendszer: külön nulla- és védővezető a táppontól | BEK-FOLDELES-TN-S | 816da23b | 2f8e3995 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| TN-C-S rendszer: PEN a szétválasztási pontig, utána külön N és PE | BEK-FOLDELES-TN-C-S | bff6a9cd | f84a4546 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| TT rendszer: a fémház a saját földelőn | BEK-FOLDELES-TT | 553eca92 | 9a79c8ae | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| IT rendszer: földeletlen táppont, földelt fémházak | BEK-FOLDELES-IT | 60981084 | f1d3c3b2 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Egyenpotenciálra hozás: a fő EPH-sín és a vízvezeték bekötése (TN-C-S) | BEK-EPH-ALAPOK | d0990558 | c6056099 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |

### 4. rész – második olvasó

R3 (biztonságkritikus) tartalom: a 4. rész ábráit egy második, szintén jogosult olvasó is átnézi. Aláírásával azt igazolja, hogy a lektor „Jóváhagyom” jelölésű ábráival egyetért; eltérő véleményét a megjegyzésbe írja. A program a második olvasó nevét nem rögzíti, csak a jogosultságát.

| Adat | Kitöltés |
|---|---|
| Második olvasó jogosultsága | |
| Dátum | |
| Aláírás | |

### Teendő eltérés esetén

1. A lektor az eltérő tételt ✗-szel jelöli, és a „Helyes érték / megjegyzés” mezőbe beírja a helyes értéket; a forrást (szabvány, kiadás, pont vagy táblázat) a „Megjegyzés a blokkhoz (forrás, kiadás)” mezőben vagy a tételnél adja meg.
2. A Jóváhagyó lapon az 1–2. résznél a második lehetőséget („javítás után hagyom jóvá”), a 3. résznél az érintett kalkulátor sorában a „Javítás után / nem” négyzetet jelöli, és aláírja. Az eltéréssel érintett részre, illetve kalkulátorra ennél a kiadásnál jóváhagyás nem rögzíthető: a jóváhagyás mindig egy pontos ujjlenyomathoz tartozik.
3. A fejlesztő a javításokat a programban bevezeti, és új kiadást (új csomagverzió és ujjlenyomatok) készít; a változott tételek listáját megküldi a lektornak.
4. A lektor csak a változott tételeket ellenőrzi, és az új kiadás Jóváhagyó lapját írja alá; a program ennek ujjlenyomatait rögzíti.
5. Ha két forrás vagy két ellenőr eltérő értéket ad, mindkét érték a forrásával a megjegyzésbe kerül; az érték a tisztázásig „ellenőrizendő” marad.
6. Biztonsági jelentőségű hibát (pl. a valósnál nagyobb terhelhetőség, kisebb feszültségesés vagy nagyobb megengedett hurokimpedancia) kérjük a csomag visszaküldése előtt is haladéktalanul jelezni a megbízónak; a program ilyenkor a jóváhagyásig változatlanul „ellenőrizendő” jelölést mutat.

### Döntés és aláírás

A jóváhagyott csomag:

| Adat | Érték |
|---|---|
| Csomagverzió | LK-4 (2026. 10. 12.) |
| Csomag-ujjlenyomat | 09c63bbe (a csomag teljes szövegéé: bevezető, tételek, jóváhagyó lap) |
| Táblázatváltozat | 2026.10-1 |
| 1. rész – táblázat-ujjlenyomat | c78b23ee (ehhez köti a program a jóváhagyást) |
| 2. rész – képlet-ujjlenyomat | 25b6c94f (a fejlesztési folyamat automatikus tesztje ellenőrzi) |
| 3. rész – kalkulátor-ujjlenyomat | e65e37f3 (a 3. rész egészéé; kalkulátoronként: a döntési táblázatban) |
| 4. rész – ábra-ujjlenyomat | f2384506 (a 4. rész egészéé; ábránként: a döntési táblázatban) |

Döntés:

- ☐ Az 1–2. részt eltérés nélkül jóváhagyom.
- ☐ Az 1–2. részt a jelölt eltérések javítása után hagyom jóvá; a javított kiadás változott tételeit ellenőrzöm.
- ☐ Az 1–2. részt nem hagyom jóvá (indoklás a megjegyzésben).

Alulírott kijelentem, hogy a Villanyrajz lektori csomag ezen a lapon megjelölt, 123 oldalas kiadásának 1. (méretezési táblázatok), 2. (képletek és programozott döntések), 3. (szabványhoz kötött kalkulátorok) és 4. (bekötési ábrák) részét a hivatkozott szabványok hatályos kiadásával összevetettem, és a tételeket a fenti döntés, valamint a kalkulátoronkénti és az ábránkénti döntés szerint jelöltem. A 3. és a 4. részből kizárólag a „Jóváhagyom” jelölésű kalkulátorokat és ábrákat hagyom jóvá; a 4. rész ábráinak jóváhagyásához a második olvasó egyetértése is szükséges. A jóváhagyás kizárólag a csomagban, a megjelölt ujjlenyomatokkal azonosított tartalomra vonatkozik; nem minősül a programmal készült egyes tervekért vagy a kalkulátorokkal végzett egyes számításokért vállalt tervezői felelősségnek, és nem terjed ki a csomag 5–6. részére.

Az 1. rész ujjlenyomatát a program maga ellenőrzi: eltérésnél „ellenőrizendő” állapotra áll vissza. A 2. rész ujjlenyomatát a fejlesztési folyamat automatikus tesztje veti össze a jóváhagyottal. A 3. részben kalkulátoronként a tartalmi és a forrás-ujjlenyomat kerül a kiadási rekordba: tartalmi eltérésnél a program a kalkulátort nem teszi közzé, forráseltérésnél az automatikus teszt elbukik. A 4. részben ábránként a netlista és az ábra ujjlenyomata kerül a csomagkiadásba; a Tudástár cikkének lektori rekordja ehhez kötődik: ha a netlista, az elrendezés, egy szimbólum, a rajzoló kód vagy egy ábraszín változik, a cikk nem jelenik meg („újraellenőrzendő”). Bármelyik eltérésénél új kiadás és új jóváhagyás kell.

A „Jogosultság megnevezése” a programban a lektorálás jelzésében szó szerint megjelenik (név nélkül is); például: épületvillamossági tervező (MMK-névjegyzék) vagy érintésvédelmi szabványossági felülvizsgáló.

| Adat | Kitöltés |
|---|---|
| Jóváhagyó neve | |
| Kamarai / névjegyzéki szám | |
| Jogosultság megnevezése | |
| Hely | |
| Dátum | |
| Aláírás | |
| Jóváhagyott csomagverzió és ujjlenyomatok | LK-4 (2026. 10. 12.); csomag: 09c63bbe; 1. rész: c78b23ee; 2. rész: 25b6c94f; 3. rész: e65e37f3; 4. rész: f2384506 |
| Megjegyzések | |

☐ Hozzájárulok, hogy nevem, névjegyzéki számom, jogosultságom és a jóváhagyás dátuma a tervező Méretezés fülén (Eszközök → Tervsegéd → Méretezés) minden felhasználónak; minden felhasználó exportált terv-PDF-jében, ha a méretezési táblákat bekapcsolja, az elosztóoldalak „méretezés indoklása” táblájának „Táblázatok – Állapot” sorában (ugyanennek a táblának az utolsó sora a terv tervezőjének „Tervezői ellenőrzés” aláírósora); a nyilvános, keresőkben is megtalálható kalkulátoroldalakon a táblázatokat használó kalkulátorok (Feszültségesés, Keresztmetszet-választás, Kismegszakító-választás, Hurokimpedancia és zárlati áram, Terhelhetőségi táblázat) „Táblázatok állapota” sorában és a Vezeték-ellenállás kalkulátor ρ1 szerinti tájékoztató sorában – ezzel a szöveggel megjelenjen: „A táblázatértékeket szakmailag lektorálta: [név], [jogosultság] ([névjegyzéki szám]), [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.”; továbbá hogy a 3. részből általam jóváhagyott kalkulátorok saját oldalán (jelvény; lábléc-sor) nevem és jogosultságom így megjelenjen: „Szakmailag lektorálta: [név], [jogosultság] · [dátum]; Szakmai lektor: [név], [jogosultság]”. Tudomásul veszem, hogy ehhez nevem és névjegyzéki számom a program nyilvános oldalainak kódjába is bekerül. Hozzájárulás hiányában a program nevemet és névjegyzéki számomat nem rögzíti, és a lektorálást a jogosultságom megnevezésével jelzi: „A táblázatértékeket szakmailag lektorálta: [jogosultság], [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.”, illetve „Szakmailag lektorálta: [jogosultság] · [dátum]; Szakmai lektor: [jogosultság]”. A kalkulátorlistán és a keresőben a jelvény név nélküli. A jóváhagyás érvénye a hozzájárulástól nem függ.
