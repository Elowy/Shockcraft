<!-- Generált fájl – kézzel ne szerkeszd. Forrás: scripts/lektori-csomag.ts; folyamat: docs/lektoralas.md. -->

# Villanyrajz – lektori csomag

Szakmai lektori ellenőrzőcsomag a méretezési segédszámításhoz: táblázatok, képletek és programozott döntések

| Adat | Érték |
|---|---|
| Csomagverzió | LK-2 (2026. 10. 10.) |
| Csomag-ujjlenyomat | 4f9723b6 (a csomag teljes szövegéé: bevezető, tételek, jóváhagyó lap) |
| Táblázatváltozat | 2026.10-1 |
| 1. rész – táblázat-ujjlenyomat | c78b23ee (ehhez köti a program a jóváhagyást) |
| 2. rész – képlet-ujjlenyomat | fe9b2ebe (a fejlesztési folyamat automatikus tesztje ellenőrzi) |
| Jóváhagyási állapot | ellenőrizendő – jogosult tervező még nem hagyta jóvá |
| Ellenőrizendő tételek | 1. rész: 146; 2. rész: 38 (összesen 184) |
| Becsült ráfordítás | kb. 2 óra 53 perc |

> Belső munkaanyag a szakmai lektor részére – nem nyilvános. A csomagot a program generálja; a táblázatértékek a program jelenlegi értékei, amelyeket a szabvánnyal kell összevetni.

## Tartalom

- Bevezető
- 1. rész – Méretezési táblázatok
- 2. rész – Képletek és programozott döntések
- 3. rész – Szabványhoz kötött kalkulátorok (T1) (helyőrző)
- 4. rész – Bekötési ábrák (R3) (helyőrző)
- 5. rész – Biztonsági cikkek (R3) (helyőrző)
- 6. rész – Vizsgakérdések (helyőrző)
- Jóváhagyó lap

## Bevezető

### Mi a Villanyrajz?

A Villanyrajz magyar nyelvű, böngészőben futó villamos tervszerkesztő villanyszerelőknek és lakóépületek villamos tervezőinek: alaprajz, szerelvények, kábelnyomvonalak, lakáselosztó, anyaglista, árajánlat és PDF-tervdokumentáció.

A „Méretezési segédszámítás” áramkörönként tervezői ellenőrzést segítő, tájékoztató számítást készít: legkisebb keresztmetszet, Ib ≤ In ≤ Iz, I2 ≤ 1,45 · Iz, feszültségesés, és megadott Zs mellett hurokimpedancia. A számítás minden táblázatértéke és forrásmegjelölése a programban egy helyen van rögzítve; ez a csomag ezeket, valamint a képleteket és a programozott döntéseket gyűjti össze kódolvasás nélkül ellenőrizhető formában.

### Mire használjuk a jóváhagyott tartalmat?

- Jóváhagyásig a program minden táblázatértéket „ellenőrizendő” állapotúként jelöl a felületen, a számítási sorokban és a PDF-ben.
- Jóváhagyás után a Méretezés fülön (Eszközök → Tervsegéd → Méretezés) minden felhasználónak, és minden felhasználó exportált terv-PDF-jében, ha a méretezési táblákat bekapcsolja – az elosztóoldalak „méretezés indoklása” táblájának „Táblázatok – Állapot” sorában (a felelősségi nyilatkozat alatt; ugyanennek a táblának az utolsó sora a terv tervezőjének „Tervezői ellenőrzés” aláírósora) – ez a szöveg jelenik meg: „Jóváhagyta: [név] ([névjegyzéki szám]), [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.” A szöveg a táblázatértékek lektorálását jelzi, nem az adott terv jóváhagyását. Név csak a jóváhagyó hozzájárulásával jelenhet meg (Jóváhagyó lap).
- A Tudástár szabványhoz kötött (T1) kalkulátorai – például feszültségesés, keresztmetszet, kismegszakító, hurokimpedancia – csak lektori jóváhagyás után jelennek meg; a táblázatalapúak ezen felül az 1. rész jóváhagyásához kötöttek.
- Az 1. rész jóváhagyása a programban ujjlenyomathoz kötött: ha később bármely táblázatérték, forrásmegjelölés, szabványpont vagy leírás megváltozik, a program automatikusan „ellenőrizendő” állapotra áll vissza.
- A 2. rész (képletek, döntések) jóváhagyását a program állapota nem követi. Ezt a fejlesztési folyamat biztosítja: jóváhagyott állapotban az automatikus teszt elbukik, ha a 2. rész a jóváhagyott ujjlenyomattól eltér; ilyenkor új kiadás és új jóváhagyás kell.

### Mit jelent a jóváhagyás – és mit nem?

A jóváhagyás jelenti:

- az 1. rész értékei, táblázatszámai, kiadásai és leírásai a hivatkozott szabványok hatályos kiadásával egyeznek (vagy a lektor megadta a helyes értéket);
- a 2. rész képletei helyesek, és a programozott döntések, alapértékek iránya és jelölése elfogadható egy tervezői ellenőrzést segítő számításhoz.

A jóváhagyás nem jelenti:

- tervezői felelősségvállalást az egyes, a programmal készült tervekért: az eredmény továbbra is „tervezői ellenőrzést segítő számítás”, nem tervezői méretezés; a tervért annak tervezője felel – a programban megjelenő jóváhagyási szöveg is csak a táblázatértékekre vonatkozik;
- a program egészének (forráskód, felület, más funkciók) vizsgálatát vagy minősítését;
- a felhasználó által megadott adatok (terhelés, hossz, szerelési mód, Zs, projekt-felülírás) helyességének igazolását, illetve a kész berendezés mérésének kiváltását;
- a hatókörön kívüli esetek (D-HATOKOR) vizsgálatát, és a 3–6. részt, amely jelenleg helyőrző.

### Hogyan kell kitölteni?

1. A csomagot a hivatkozott szabványok hatályos kiadásával kell összevetni; a program kódjának olvasása nem szükséges.
2. Tételenként: ✓ = az érték vagy állítás helyes; ✗ = eltér vagy hibás – ilyenkor a „Helyes érték / megjegyzés” mezőbe a helyes értéket kérjük beírni. A forrást (szabvány, kiadás, pont vagy táblázat) blokkonként elég egyszer megadni, a blokk végén álló „Megjegyzés a blokkhoz (forrás, kiadás)” mezőben; ha egy tételé ettől eltér, a tételnél.
3. Gyorsítás: ha a blokk minden tétele egyezik, elég a blokk végén „A blokk minden tétele egyezik” négyzetet jelölni; a tételeket nem kell egyenként pipálni. Ha bármelyik tétel eltér, a blokk négyzetét ne jelölje; az eltérő tételeket jelölje ✗-szel, a többi, pipálatlanul hagyott tétel egyezőnek számít. A terhelhetőségi táblák elején álló áttekintő mátrix soronként vethető össze a szabvány táblázatával.
4. A 2. részben minden tétel egy szabályt, indoklást és kézzel számolt példát tartalmaz; a példát érdemes újraszámolni. A „Kérdés a lektorhoz” pontokra kérjük külön választ a megjegyzés mezőben.
5. Ha két forrás egy értékre eltérő számot ad, mindkettőt kérjük a megjegyzésbe írni a forrással; az érték a tisztázásig „ellenőrizendő” marad.
6. Terjedelmesebb javítást (pl. egy teljes táblázat javasolt értékeit) külön mellékletben kérjük, a tételazonosítókra hivatkozva.
7. Végül a Jóváhagyó lapot kell kitölteni és aláírni (a lapokat a láblécben szignálni), és a jelölt csomaggal együtt (papíron vagy szkennelve) visszaküldeni.

A csomag belső munkaanyag, nem nyilvános. A benne szereplő számértékek a program jelenlegi értékei, amelyeket a szabvánnyal össze kell vetni; nem a szabvány szövegének másolatai.

### Jelölések

- Ib – tervezett (terhelési) áram; In – a védelem névleges árama; I2 – a védelem megállapodás szerinti kioldóárama (a működést biztosító áram)
- Iz0 – táblázati terhelhetőség; Iz – javított terhelhetőség; kθ – hőmérsékleti tényező; kcs – csoportosítási tényező
- U0 – névleges fázis–föld feszültség; ΔU – feszültségesés; ρ1 – fajlagos ellenállás üzemi hőmérsékleten; λ – fajlagos reaktancia
- Zs – hibahurok-impedancia; m – a pillanatkioldás felső határának szorzója; cmin – feszültségtényező; A, A_PE – fázis- és védővezető-keresztmetszet
- MCB – kismegszakító; RCBO – túláramvédelemmel egybeépített áram-védőkapcsoló; ÁVK – áram-védőkapcsoló (FI-relé)

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
| – | Jóváhagyó lap kitöltése | – | 10 perc |
|  | Összesen | 184 | kb. 2 óra 53 perc |

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
| D-JEL-GUMI | H03R…, H05R…, H07R… (RN, RR, RT), GT, gumi (önállóan vagy ékezet nélküli folytatással: gumis, gumikabel, Gumi-kábel) | gumiszigetelés (60 °C) → „Nem számítható” (D-BLOKK). Ékezetes folytatást („gumikábel”, „gumiszigetelésű”) a program jelenleg nem ismer fel: PVC-alapértékkel, kiemelt feltételezéssel számol | ☐ | ☐ | |
| D-JEL-XLPE | N2X…, 2XY, XLPE, EPR | XLPE (90 °C; D-XLPE szerint PVC-értékkel) | ☐ | ☐ | |
| D-JEL-PVC | NYM…, NYY…, NYCWY, MBCu, MCu, MKCu, MT, MYY, YKY…, CYKY…, H03V…, H05V…, H07V…, PVC | PVC (70 °C) | ☐ | ☐ | |
| D-JEL-NINCS | Más vagy hiányzó jelölés (pl. NHXH, „3 × 2,5 mm²”) | nem ismerhető fel → áramköri, majd projekt-alapérték, végül PVC (D-ALAP-SZIG) | ☐ | ☐ | |
| D-JEL-SORREND | Több kulcsszó egy jelölésben | az első egyező: alumínium, gumi, XLPE, PVC | ☐ | ☐ | |

Programmal összevetve: igen – 43 eset (kábeljelölés), automatikus tesztben.

☐ A blokk minden tétele egyezik (D-JEL).

Megjegyzés a blokkhoz (forrás, kiadás):

### D – Programozott döntések

Forrás: Programozott döntések (kerekítés, tartalék, korlátok, állapotok)

#### D-KEREK – Lépcsőre kerekítés iránya

**Szabály.** Táblázati lépcsők közötti bemenetnél a program a kedvezőtlenebb lépcsőt választja, interpoláció nélkül: környezeti hőmérséklet → a következő nagyobb vagy egyenlő lépcső (T-KT), áramkörszám → a következő nagyobb vagy egyenlő oszlop (T-KCS). A számított értékeket (Ib, Iz, ΔU, Zs) nem kerekíti; a kijelzés 2, Zs-nél 3 tizedes.

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

## 3. rész – Szabványhoz kötött kalkulátorok (T1) (helyőrző)

> **Helyőrző.** A kalkulátorok elkészülte után kerül be: kalkulátoronként a képlet, a bemeneti korlátok, az alapértékek, a felhasznált táblázatok (az 1. részre hivatkozva) és kézzel számolt példák. A T1-kalkulátorok a lektori jóváhagyásig rejtve maradnak; a táblázatalapúak ezen felül az 1. rész jóváhagyásához kötöttek.

Tervezett tartalom: feszültségesés, keresztmetszet-választás, kismegszakító-választás, hurokimpedancia, motoráram, LED-tápegység, fázisjavítás. Azonosító-előtag: `KAL-`.

## 4. rész – Bekötési ábrák (R3) (helyőrző)

> **Helyőrző.** A Sémák ábráinak elkészülte után kerül be: ábránként a kapcsolási rajz, a kapcsolóállás-táblázat és a kapocsjelölési megjegyzés. Biztonságkritikus (R3) tartalom: lektor és második olvasó hagyja jóvá.

Tervezett tartalom: 101–107 kapcsolások, dugalj bekötése, földelési rendszerek és PEN-szétválasztás, áram-védőkapcsoló (FI-relé) bekötése. Azonosító-előtag: `ABR-`.

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

### Teendő eltérés esetén

1. A lektor az eltérő tételt ✗-szel jelöli, és a „Helyes érték / megjegyzés” mezőbe beírja a helyes értéket; a forrást (szabvány, kiadás, pont vagy táblázat) a „Megjegyzés a blokkhoz (forrás, kiadás)” mezőben vagy a tételnél adja meg.
2. A Jóváhagyó lapon a második lehetőséget jelöli („javítás után hagyom jóvá”), és aláírja. Erre a kiadásra jóváhagyás nem rögzíthető: a jóváhagyás mindig egy pontos ujjlenyomathoz tartozik.
3. A fejlesztő a javításokat a programban bevezeti, és új kiadást (új csomagverzió és ujjlenyomatok) készít; a változott tételek listáját megküldi a lektornak.
4. A lektor csak a változott tételeket ellenőrzi, és az új kiadás Jóváhagyó lapját írja alá; a program ennek ujjlenyomatát rögzíti.
5. Ha két forrás vagy két ellenőr eltérő értéket ad, mindkét érték a forrásával a megjegyzésbe kerül; az érték a tisztázásig „ellenőrizendő” marad.
6. Biztonsági jelentőségű hibát (pl. a valósnál nagyobb terhelhetőség, kisebb feszültségesés vagy nagyobb megengedett hurokimpedancia) kérjük a csomag visszaküldése előtt is haladéktalanul jelezni a megbízónak; a program ilyenkor a jóváhagyásig változatlanul „ellenőrizendő” jelölést mutat.

### Döntés és aláírás

A jóváhagyott csomag:

| Adat | Érték |
|---|---|
| Csomagverzió | LK-2 (2026. 10. 10.) |
| Csomag-ujjlenyomat | 4f9723b6 (a csomag teljes szövegéé: bevezető, tételek, jóváhagyó lap) |
| Táblázatváltozat | 2026.10-1 |
| 1. rész – táblázat-ujjlenyomat | c78b23ee (ehhez köti a program a jóváhagyást) |
| 2. rész – képlet-ujjlenyomat | fe9b2ebe (a fejlesztési folyamat automatikus tesztje ellenőrzi) |

Döntés:

- ☐ Eltérés nélkül jóváhagyom.
- ☐ A jelölt eltérések javítása után hagyom jóvá; a javított kiadás változott tételeit ellenőrzöm.
- ☐ Nem hagyom jóvá (indoklás a megjegyzésben).

Alulírott kijelentem, hogy a Villanyrajz lektori csomag ezen a lapon megjelölt, 31 oldalas kiadásának 1. (méretezési táblázatok) és 2. (képletek és programozott döntések) részét a hivatkozott szabványok hatályos kiadásával összevetettem, és a tételeket a fenti döntés szerint jelöltem. A jóváhagyás kizárólag a csomagban, a megjelölt ujjlenyomatokkal azonosított tartalomra vonatkozik; nem minősül a programmal készült egyes tervekért vállalt tervezői felelősségnek, és nem terjed ki a csomag 3–6. részére.

Az 1. rész ujjlenyomatát a program maga ellenőrzi: eltérésnél „ellenőrizendő” állapotra áll vissza. A 2. rész ujjlenyomatát a fejlesztési folyamat automatikus tesztje veti össze a jóváhagyottal. Bármelyik eltérésénél új kiadás és új jóváhagyás kell.

Jogosultság például: épületvillamossági tervező (MMK-névjegyzék) vagy érintésvédelmi szabványossági felülvizsgáló.

| Adat | Kitöltés |
|---|---|
| Jóváhagyó neve | |
| Kamarai / névjegyzéki szám | |
| Jogosultság megnevezése | |
| Hely | |
| Dátum | |
| Aláírás | |
| Jóváhagyott csomagverzió és ujjlenyomatok | LK-2 (2026. 10. 10.); csomag: 4f9723b6; 1. rész: c78b23ee; 2. rész: fe9b2ebe |
| Megjegyzések | |

☐ Hozzájárulok, hogy nevem, névjegyzéki számom és a jóváhagyás dátuma a Méretezés fülön (Eszközök → Tervsegéd → Méretezés) minden felhasználónak, és minden felhasználó exportált terv-PDF-jében, ha a méretezési táblákat bekapcsolja – az elosztóoldalak „méretezés indoklása” táblájának „Táblázatok – Állapot” sorában (a felelősségi nyilatkozat alatt; ugyanennek a táblának az utolsó sora a terv tervezőjének „Tervezői ellenőrzés” aláírósora) – ezzel a szöveggel megjelenjen: „Jóváhagyta: [név] ([névjegyzéki szám]), [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.” Hozzájárulás hiányában a jóváhagyás csak név nélküli szöveggel rögzíthető.
