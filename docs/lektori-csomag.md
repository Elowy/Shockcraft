<!-- Generált fájl – kézzel ne szerkeszd. Forrás: scripts/lektori-csomag.ts; folyamat: docs/lektoralas.md. -->

# Villanyrajz – lektori csomag

Szakmai lektori ellenőrzőcsomag a méretezési segédszámításhoz és a szabványhoz kötött kalkulátorokhoz: táblázatok, képletek, programozott döntések és kalkulátorok

| Adat | Érték |
|---|---|
| Csomagverzió | LK-3 (2026. 10. 10.) |
| Csomag-ujjlenyomat | d8648424 (a csomag teljes szövegéé: bevezető, tételek, jóváhagyó lap) |
| Táblázatváltozat | 2026.10-1 |
| 1. rész – táblázat-ujjlenyomat | c78b23ee (ehhez köti a program a jóváhagyást) |
| 2. rész – képlet-ujjlenyomat | 0f127c02 (a fejlesztési folyamat automatikus tesztje ellenőrzi) |
| 3. rész – kalkulátor-ujjlenyomat | bd293e1b (a 3. rész egészéé; kalkulátoronként: a döntési táblázatban) |
| Jóváhagyási állapot (1. rész) | ellenőrizendő – jogosult tervező még nem hagyta jóvá |
| Ellenőrizendő tételek | 1. rész: 146; 2. rész: 38; 3. rész: 126 (összesen 310) |
| Becsült ráfordítás | kb. 6 óra 5 perc |

> Belső munkaanyag a szakmai lektor részére – nem nyilvános. A csomagot a program generálja; a táblázatértékek a program jelenlegi értékei, amelyeket a szabvánnyal kell összevetni.

## Tartalom

- Bevezető
- 1. rész – Méretezési táblázatok
- 2. rész – Képletek és programozott döntések
- 3. rész – Szabványhoz kötött kalkulátorok (T1)
- 4. rész – Bekötési ábrák (R3) (helyőrző)
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
- Jóváhagyás után a tervező Méretezés fülén (Eszközök → Tervsegéd → Méretezés) minden felhasználónak; minden felhasználó exportált terv-PDF-jében, ha a méretezési táblákat bekapcsolja, az elosztóoldalak „méretezés indoklása” táblájának „Táblázatok – Állapot” sorában (ugyanennek a táblának az utolsó sora a terv tervezőjének „Tervezői ellenőrzés” aláírósora); a nyilvános, keresőkben is megtalálható kalkulátoroldalakon a táblázatokat használó kalkulátorok (Feszültségesés, Keresztmetszet-választás, Kismegszakító-választás, Hurokimpedancia és zárlati áram, Terhelhetőségi táblázat) „Táblázatok állapota” sorában és a Vezeték-ellenállás kalkulátor ρ1 szerinti tájékoztató sorában a következő szöveg jelenik meg – a jóváhagyó kifejezett hozzájárulásával: „A táblázatértékeket szakmailag lektorálta: [név] ([névjegyzéki szám]), [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.”; hozzájárulás nélkül: „A táblázatértékeket jogosult villamos tervező szakmailag lektorálta, [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.” A szöveg a táblázatértékek lektorálását jelzi, nem az adott terv jóváhagyását. A 3. részből jóváhagyott kalkulátorok oldalán (jelvény; lábléc-sor) hozzájárulással „Szakmailag lektorálta: [név], [minősítés] · [dátum]; Szakmai lektor: [név], [minősítés]”, anélkül „Szakmailag lektorálta: [minősítés] · [dátum]; Szakmai lektor: [minősítés]” áll. A név csak hozzájárulással jelenik meg (Jóváhagyó lap); a jóváhagyás érvénye ettől nem függ.
- A 3. rész T1 kalkulátorai kalkulátoronként, a jóváhagyott tartalmi és forrás-ujjlenyomattal rögzített lektori rekorddal jelennek meg a nyilvános kalkulátoroldalakon; a táblázat-kapus kalkulátorok (Keresztmetszet-választás, Kismegszakító-választás, Hurokimpedancia és zárlati áram, Terhelhetőségi táblázat) ezen felül csak az 1. rész jóváhagyása után. Ha egy kalkulátor a jóváhagyás után bármiben változik, a program nem teszi közzé, illetve az automatikus teszt elbukik, amíg új jóváhagyás nem készül.
- Az 1. rész jóváhagyása a programban ujjlenyomathoz kötött: ha később bármely táblázatérték, forrásmegjelölés, szabványpont vagy leírás megváltozik, a program automatikusan „ellenőrizendő” állapotra áll vissza.
- A 2. rész (képletek, döntések) jóváhagyását a program állapota nem követi. Ezt a fejlesztési folyamat biztosítja: jóváhagyott állapotban az automatikus teszt elbukik, ha a 2. rész a jóváhagyott ujjlenyomattól eltér; ilyenkor új kiadás és új jóváhagyás kell.

### Mit jelent a jóváhagyás – és mit nem?

A jóváhagyás jelenti:

- az 1. rész értékei, táblázatszámai, kiadásai és leírásai a hivatkozott szabványok hatályos kiadásával egyeznek (vagy a lektor megadta a helyes értéket);
- a 2. rész képletei helyesek, és a programozott döntések, alapértékek iránya és jelölése elfogadható egy tervezői ellenőrzést segítő számításhoz;
- a 3. rész „Jóváhagyom” jelölésű kalkulátorainak képletei, bemeneti korlátai, alapértékei, figyelmeztetései és szóhasználata helyesek, illetve elfogadhatók egy tájékoztató, „számítás szerinti” kalkulátorhoz.

A jóváhagyás nem jelenti:

- tervezői felelősségvállalást az egyes, a programmal készült tervekért vagy a kalkulátorokkal végzett egyes számításokért: az eredmény továbbra is „tervezői ellenőrzést segítő”, illetve „számítás szerinti” érték, nem tervezői méretezés; a tervért annak tervezője felel – a programban megjelenő jóváhagyási szöveg is csak a táblázatértékekre vonatkozik;
- a program egészének (forráskód, felület, más funkciók) vizsgálatát vagy minősítését;
- a felhasználó által megadott adatok (terhelés, hossz, szerelési mód, Zs, projekt-felülírás) helyességének igazolását, illetve a kész berendezés mérésének kiváltását;
- a hatókörön kívüli esetek (D-HATOKOR és a kalkulátorok „Nem vizsgált” listái) vizsgálatát, és a 4–6. részt, amely jelenleg helyőrző.

### Hogyan kell kitölteni?

1. A csomagot a hivatkozott szabványok hatályos kiadásával kell összevetni; a program kódjának olvasása nem szükséges.
2. Tételenként: ✓ = az érték vagy állítás helyes; ✗ = eltér vagy hibás – ilyenkor a „Helyes érték / megjegyzés” mezőbe a helyes értéket kérjük beírni. A forrást (szabvány, kiadás, pont vagy táblázat) blokkonként elég egyszer megadni, a blokk végén álló „Megjegyzés a blokkhoz (forrás, kiadás)” mezőben; ha egy tételé ettől eltér, a tételnél.
3. Gyorsítás: ha a blokk minden tétele egyezik, elég a blokk végén „A blokk minden tétele egyezik” négyzetet jelölni; a tételeket nem kell egyenként pipálni. Ha bármelyik tétel eltér, a blokk négyzetét ne jelölje; az eltérő tételeket jelölje ✗-szel, a többi, pipálatlanul hagyott tétel egyezőnek számít. A terhelhetőségi táblák elején álló áttekintő mátrix soronként vethető össze a szabvány táblázatával.
4. A 2. és a 3. részben minden szabálytétel egy szabályt, indoklást és kézzel számolt példát tartalmaz; a példát érdemes újraszámolni. A „Kérdés a lektorhoz” pontokra kérjük külön választ a megjegyzés mezőben.
5. A 3. részben a táblázatértékeket nem kell újra összevetni (az 1. rész azonosítóival hivatkozunk rájuk). A kalkulátorok kalkulátoronként hagyhatók jóvá (Jóváhagyó lap, „3. rész – kalkulátoronkénti döntés”). A kalkulátorok előnézetben ki is próbálhatók (a hozzáférést a megbízó adja), de a csomag önmagában is ellenőrizhető.
6. Ha két forrás egy értékre eltérő számot ad, mindkettőt kérjük a megjegyzésbe írni a forrással; az érték a tisztázásig „ellenőrizendő” marad.
7. Terjedelmesebb javítást (pl. egy teljes táblázat javasolt értékeit) külön mellékletben kérjük, a tételazonosítókra hivatkozva.
8. Végül a Jóváhagyó lapot kell kitölteni és aláírni (a lapokat a láblécben szignálni), és a jelölt csomaggal együtt (papíron vagy szkennelve) visszaküldeni.

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
| – | Jóváhagyó lap kitöltése | – | 10 perc |
|  | Összesen | 310 | kb. 6 óra 5 perc |

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
| D-JEL-GUMI | H03R…, H05R…, H07R… (RN, RR, RT), GT, gumi… (szó elején, ékezetes folytatással is: gumis, gumikábel, gumiszigetelésű, Gumi-kábel) | gumiszigetelés (60 °C) → „Nem számítható” (D-BLOKK) | ☐ | ☐ | |
| D-JEL-XLPE | N2X…, 2XY, XLPE, EPR | XLPE (90 °C; D-XLPE szerint PVC-értékkel) | ☐ | ☐ | |
| D-JEL-PVC | NYM…, NYY…, NYCWY, MBCu, MCu, MKCu, MT, MYY, YKY…, CYKY…, H03V…, H05V…, H07V…, PVC | PVC (70 °C) | ☐ | ☐ | |
| D-JEL-NINCS | Más vagy hiányzó jelölés (pl. NHXH, „3 × 2,5 mm²”) | nem ismerhető fel → áramköri, majd projekt-alapérték, végül PVC (D-ALAP-SZIG) | ☐ | ☐ | |
| D-JEL-SORREND | Több kulcsszó egy jelölésben | az első egyező: alumínium, gumi, XLPE, PVC | ☐ | ☐ | |

Programmal összevetve: igen – 46 eset (kábeljelölés), automatikus tesztben.

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

## 3. rész – Szabványhoz kötött kalkulátorok (T1)

A Villanyszerelő Tudástár szabványhoz vagy biztonsághoz kötött (T1) kalkulátorai csak szakmai lektori jóváhagyás után jelennek meg. Kalkulátoronként egy blokk: cél és kiadási adatok, mire jó és mire nem, a „Nem vizsgált” lista, a képletek a kalkulátoroldalon megjelenő alakban, a feltételezések, a bemenetek érvényességi tartománya, a felhasznált állandók forrással, majd a képletek behelyettesíthető alakban és a programozott döntések, kézzel számolt példákkal. A közös működést (számbevitel, kiírás, szóhasználat, figyelmeztetések) a KAL-KOZOS blokk írja le.

A táblázatértékekre (ρ1, λ, U0, Iz0, kθ, kcs, G.52.1 határok, m, cmin, I2/In) csak az 1. rész azonosítójával hivatkozunk: ezek helyességét az 1. rész jóváhagyása fedi, itt nem kell újra összevetni. Ahol a kalkulátor a méretezési segédszámítás programfüggvényét használja, a blokk a 2. rész tételére is hivatkozik.

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

**Indoklás.** A csendes korrekció (pl. a tartomány szélére állítás) félrevezető eredményt adna. A „1.500” = 1,5 értelmezés a tizedespontot használó bevitel (pl. másolt érték) miatt választott; ezres csoport csak szóközzel adható meg.

**Kézzel számolt példa.** Feszültségesés, terhelőáram (megengedett: > 0 és ≤ 1000 A): „16,0” és „16.0” → 16 A; „1 000” → 1000 A; „1001” → „Legfeljebb 1000 A lehet.”; „0” → „Nullánál nagyobb számot adj meg.”; „abc” → „Csak számot írj; a mértékegységet mellette választhatod.”; vezetékhossz „23.4” → 23,4 m (ΔU% = 2,9301%, mint „23,4”-nél).

**Forrás.** – (programozott döntés: a kalkulátorok számbevitele)

**Összevetés.** Programmal összevetve: igen – 8 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-KOZOS-BEVITEL | ☐ | ☐ | |

#### KAL-KOZOS-KIIRAS – Kerekítés és kiírás

**Szabály.** A számítás kerekítés nélkül fut, csak a kiírás kerekít: 1 alatt és 1–10 között 4 értékes jegy, 10 fölött legfeljebb 3 tizedes (10 000-ig 5 értékes jegy), afölött egész szám; 10⁻⁶ alatt normálalak. A hosszakat (Lmax) 0,1 m-re lefelé kerekítve írja ki, „(lefelé kerekítve)” jelöléssel, ha a kerekítés látható. Határérték-összevetésnél, ha a kerekített kiírás egyenlőséget mutatna, de a feltétel nem teljesül, a két oldal több tizedessel jelenik meg.

**Indoklás.** A lefelé kerekített hossz a biztonság javára téved; a több tizedes azt akadályozza meg, hogy a kiírás „5 % > 5 %” alakú, ellentmondásosnak látszó szöveget adjon.

**Kézzel számolt példa.** Feszültségesés, 16 A, 23,4 m, 2,5 mm² (KAL-FESZULTSEGES-K1): ΔU% = 2,930087 → „2,93 %”; ΔU = 6,7392 V → „6,739 V”; Lmax = 39,9306 m → „39,9 m (lefelé kerekítve)”. 39,931 m-nél ΔU% = 5,000056 → „Számítás szerint meghaladja a határt: 5,0001 % > 5 %.”

**Forrás.** – (programozott döntés: a kalkulátorok kiírása)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

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

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: nem – a kiadáshoz a kalkulátor jóváhagyása elég. Tartalmi ujjlenyomat: 937ce6f9; forrás-ujjlenyomat: 4e8e3830. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-FESZULTSEGES-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: Hosszú leágazások (kert, melléképület, garázs) keresztmetszetének előzetes ellenőrzése. A tervező Méretezés fülén kapott érték gyors ellenőrzése. Mire nem: Tervezői méretezés kiváltására: a terhelhetőség, a zárlati védelem és a hurokimpedancia is számít. Motorindítás pillanatnyi feszültségesésére. | ☐ | ☐ | |
| KAL-FESZULTSEGES-NV | Nem vizsgált (a kalkulátoroldalon) | a méretezési segédszámítással azonos lista (D-HATOKOR) | ☐ | ☐ | |
| KAL-FESZULTSEGES-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | ΔU% = b · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100 (b = 2 egyfázisú, 1 háromfázisú) · DC: ΔU = 2 · L · I · ρ1 / A · Lmax = ΔU%határ · U0 / (100 · b · I · (ρ1 · cos φ / A + λ · sin φ)) | ☐ | ☐ | |
| KAL-FESZULTSEGES-FELT | Feltételezések (a számítás mellett) | 1) Rézvezető; ρ1 = 0,0225 Ω·mm²/m (üzemi hőmérséklet), λ = 0,00008 Ω/m (G.52.2). 2) A teljes terhelés a vezeték végén; az elosztó előtti (fővezeték) esés nincs benne. 3) Szimmetrikus háromfázisú terhelés. 4) Egyenáram: λ = 0, oda-vissza vezeték. | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-RENDSZER | Rendszer | választható: Egyfázisú (230 V); Háromfázisú (400 V); Egyenáram; alapérték: Egyfázisú (230 V) | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-I | I – Terhelőáram (A) | alapérték: 16 A; megengedett: > 0 és ≤ 1000 A | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-L | L – Vezetékhossz (egy irányban), m | alapérték: 23,4 m; megengedett: > 0 és ≤ 10 000 m; egység: m, km (a korlát m egységben értendő) | ☐ | ☐ | |
| KAL-FESZULTSEGES-BEM-A | A – Keresztmetszet (mm²) | alapérték: 2,5 mm²; megengedett: > 0 és ≤ 1000 mm² | ☐ | ☐ | |
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

#### KAL-FESZULTSEGES-D2 – Szabad keresztmetszet, háromfázisú voltérték, kiadási feltétel

**Szabály.** A keresztmetszet szabadon megadható (> 0 és ≤ 1000 mm²), nem csak a T-KM-SOR lépcsői; a kalkulátor sem a terhelhetőséget, sem a legkisebb keresztmetszetet nem vizsgálja. Háromfázisnál a voltban kiírt esés a 400 V-os vonali névleges feszültségre vonatkozik. A kalkulátor nem táblázat-kapus: lektori jóváhagyással az 1. rész jóváhagyása nélkül is kiadható; a felhasznált T-K-RHO1, T-K-LAMBDA, T-K-U0 és T-DU értékeket az oldal a táblázatok állapotával együtt mutatja.

**Indoklás.** A feszültségesés a keresztmetszettel fordítottan arányos, a táblázati lépcsőhöz nem kötött; a terhelhetőséget a Keresztmetszet-választás és a Terhelhetőségi táblázat kalkulátor vizsgálja. A 400 V a vonali névleges feszültség (MSZ EN 60038); √3 · 230 V = 398,4 V-tal a kiírt érték 0,4%-kal kisebb lenne.

**Kézzel számolt példa.** 3 mm², egyfázis, 16 A, 23,4 m: ΔU% = 2 · 23,4 · 16 · 0,0225 / 3 / 230 · 100 = 2,4417% (a Méretezés fül a nem szabványos keresztmetszettel nem számol, D-BLOKK). Háromfázis (K1): 2,3721% · 400 V = 9,4883 V.

**Kérdés a lektorhoz.** 1) Elfogadható-e, hogy a Feszültségesés kalkulátor a táblázatok (1. rész) jóváhagyása nélkül, a táblázatállapot kiírásával is kiadható? 2) Elfogadható-e háromfázisnál a 400 V-hoz viszonyított voltérték? 3) A „Nem vizsgált” lista (D-HATOKOR) a 35 mm² feletti keresztmetszetet is említi, a kalkulátor viszont 1000 mm²-ig enged bevitelt – elegendő-e a lista, vagy korlátozni kell a bevitelt?

**Forrás.** MSZ EN 60038 (400 V); T-KM-SOR (1. rész); D-BLOKK (2. rész)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

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
| KAL-MOTOR-ARAM-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | 3f: In = P / (√3 · U · cos φ · η) · 1f: In = P / (U · cos φ · η) · Ia = (Ia/In) · In | ☐ | ☐ | |
| KAL-MOTOR-ARAM-FELT | Feltételezések (a számítás mellett) | 1) Névleges terhelés, névleges feszültség és frekvencia. 2) Szimmetrikus háromfázisú motor; vonali áram. | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-RENDSZER | Rendszer | választható: Egyfázisú (230 V); Háromfázisú (400 V); alapérték: Háromfázisú (400 V) | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-P | P – Leadott (tengely-) teljesítmény (W) | alapérték: 5,5 kW; megengedett: > 0 és ≤ 10 000 000 W; egység: kW, W, LE, hp (a korlát W egységben értendő) | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-U | U – Feszültség (V) | alapérték: 230 V; megengedett: > 0 és ≤ 10 000 V; csak: Egyfázisú (230 V) | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-UV | U – Vonali feszültség (V) | alapérték: 400 V; megengedett: > 0 és ≤ 10 000 V; csak: Háromfázisú (400 V) | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-COS | cos φ – Teljesítménytényező | alapérték: 0,85; megengedett: > 0 és ≤ 1 | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-ETA | η – Hatásfok | alapérték: 0,87; megengedett: > 0 és ≤ 1 | ☐ | ☐ | |
| KAL-MOTOR-ARAM-BEM-K | Ia/In – Indítási áramarány Ia/In (nem kötelező) | alapérték: nincs (üres); megengedett: 1 … 15; nem kötelező; súgó: „Adattábláról vagy katalógusból; közvetlen indításnál jellemzően 5–8.” | ☐ | ☐ | |
| KAL-MOTOR-ARAM-LE | 1 LE (metrikus lóerő), a teljesítmény mértékegysége | 735,49875 W (75 kp · m/s; definíció) | ☐ | ☐ | |
| KAL-MOTOR-ARAM-HP | 1 hp (angolszász mechanikai lóerő), a teljesítmény mértékegysége | 745,6998715822702 W (550 ft · lbf/s; definíció) | ☐ | ☐ | |

Programmal összevetve: igen – 27 eset (bemeneti korlát, kalkulátor-futtatás), automatikus tesztben.

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
| KAL-LED-SZALAG-TAPEGYSEG-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | P = L · P/m · I = P / U · Pmin = P · (1 + tartalék) | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-FELT | Feltételezések (a számítás mellett) | 1) A méterenkénti teljesítmény a szalag névleges feszültségén érvényes. 2) Állandó feszültségű (CV) szalag és tápegység. | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-BEM-L | L – Szalaghossz (m) | alapérték: 5 m; megengedett: > 0 és ≤ 1000 m | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-BEM-PM | P/m – Teljesítmény méterenként (W/m) | alapérték: 14,4 W/m; megengedett: > 0 és ≤ 200 W/m; súgó: „A szalag adatlapjáról.” | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-BEM-U | U – Szalagfeszültség (V) | alapérték: 24 V; megengedett: > 0 és ≤ 60 V; súgó: „Jellemzően 5, 12 vagy 24 V (törpefeszültség).” | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-BEM-R | t – Teljesítménytartalék (%) | alapérték: 20 %; megengedett: 0 … 100 % | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-PSU | Jellemző tápegység-teljesítmények (a javaslat ebből választ) | 15; 25; 35; 50; 60; 75; 100; 120; 150; 200; 240; 320; 480; 600 W – Jellemző kereskedelmi teljesítménysor (tájékoztató, gyártónként eltér) | ☐ | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG-BETAP | Betáplálási távolság, amely felett tájékoztató sor jelenik meg | szalagfeszültség ≤ 5 V: 2 m (kiírva: „1–2 m-enként”); ≤ 12 V: 5 m; ≤ 24 V: 10 m; 24 V felett: 10 m (kiírva: „a gyártói adatlap adja meg”) – programozott tájékoztató érték, forrás nélkül | ☐ | ☐ | |

Programmal összevetve: igen – 23 eset (bemeneti korlát, kalkulátor-futtatás), automatikus tesztben.

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
| KAL-FAZISJAVITAS-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | Qc = P · (tan φ1 − tan φ2) · Δ: C = Qc / (3 · ω · U²) · Y és 1f: C = Qc / (ω · U²), ω = 2π · f | ☐ | ☐ | |
| KAL-FAZISJAVITAS-FELT | Feltételezések (a számítás mellett) | 1) Szinuszos feszültség, a terhelés hatásos teljesítménye állandó. 2) Szimmetrikus háromfázisú telep, három azonos kondenzátor. 3) Egyfázisú kondenzátor a fogyasztóval párhuzamosan. | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-P | P – Hatásos teljesítmény (W) | alapérték: 10 kW; megengedett: > 0 és ≤ 1 000 000 000 W; egység: W, kW, MW (a korlát W egységben értendő) | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-COS1 | cos φ1 – Jelenlegi cos φ | alapérték: 0,7; megengedett: > 0 és ≤ 1 | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-COS2 | cos φ2 – Kívánt cos φ | alapérték: 0,95; megengedett: > 0 és ≤ 1 | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-KOTES | Kondenzátorok kapcsolása | választható: Háromfázisú, delta (Δ); Háromfázisú, csillag (Y); Egyfázisú; alapérték: Háromfázisú, delta (Δ) | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-UV | U – Vonali feszültség (V) | alapérték: 400 V; megengedett: > 0 és ≤ 100 000 V; csak: Háromfázisú, delta (Δ), Háromfázisú, csillag (Y) | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-U | U – Feszültség (V) | alapérték: 230 V; megengedett: > 0 és ≤ 100 000 V; csak: Egyfázisú | ☐ | ☐ | |
| KAL-FAZISJAVITAS-BEM-F | f – Frekvencia (Hz) | alapérték: 50 Hz; megengedett: > 0 és ≤ 1000 Hz | ☐ | ☐ | |

Programmal összevetve: igen – 24 eset (bemeneti korlát), automatikus tesztben.

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

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: igen – a kalkulátor az 1. rész jóváhagyása nélkül akkor sem jelenik meg, ha ez a blokk jóvá van hagyva. Tartalmi ujjlenyomat: ff172351; forrás-ujjlenyomat: 17321a6b. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-KERESZTMETSZET-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: Egy áramkör vezeték-keresztmetszetének előzetes ellenőrzése a védelem névleges áramához. A tervező Méretezés fülén kapott javaslat gyors ellenőrzése. Mire nem: Tervezői méretezés kiváltására (feszültségesés, zárlati szilárdság, hurokimpedancia is kell). Földben vagy szabad levegőn vezetett kábelre, alumíniumvezetőre. | ☐ | ☐ | |
| KAL-KERESZTMETSZET-NV | Nem vizsgált (a kalkulátoroldalon) | a méretezési segédszámítással azonos lista (D-HATOKOR) | ☐ | ☐ | |
| KAL-KERESZTMETSZET-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | Iz = Iz0 · kθ · kcs · feltétel: Ib ≤ In ≤ Iz (MSZ HD 60364-4-43 433.1) | ☐ | ☐ | |
| KAL-KERESZTMETSZET-FELT | Feltételezések (a számítás mellett) | 1) Rézvezető, a táblázat szerinti referencia-szerelési móddal; hőszigetelésben futó hosszú szakasz nélkül. 2) A legkisebb keresztmetszet (1,5 mm² réz) a táblázat első sora. 3) Csak a túlterhelés elleni védelem feltétele (In ≤ Iz); a feszültségesést és a hurokimpedanciát külön kell ellenőrizni. | ☐ | ☐ | |
| KAL-KERESZTMETSZET-BEM-IN | In – A védelem névleges árama (A) | alapérték: 20 A; megengedett: > 0 és ≤ 500 A | ☐ | ☐ | |
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

#### KAL-KERESZTMETSZET-D1 – Nincs elegendő keresztmetszet; csak In ≤ Iz

**Szabály.** Ha a T-KM-SOR legnagyobb (35 mm²) keresztmetszete sem elegendő, nincs eredmény, az In mező alatt: „A segédszámítás táblázatában (legfeljebb 35 mm²) nincs olyan keresztmetszet, amely ezzel a szerelési móddal elegendő. …”. A kalkulátor csak az In ≤ Iz feltételt vizsgálja (az I2 feltétel kismegszakítónál ezzel együtt teljesül, K-I2); a feszültségesést, a hurokimpedanciát és az Ib ≤ In-t nem – ezt a feltételezés-sor kimondja. A legkisebb keresztmetszet a táblázat első sora (1,5 mm², T-K-AMIN).

**Indoklás.** Nagyobb keresztmetszetre a táblázat nem tartalmaz értéket; a többi feltételt a Feszültségesés, a Hurokimpedancia és a Kismegszakító-választás kalkulátor vizsgálja.

**Kézzel számolt példa.** In = 125 A, A2, 3 terhelt ér, 30 °C: 35 mm²: Iz0 = 83 A < 125 A → nincs eredmény (hibaüzenet).

**Forrás.** T-PVC3-A2-35, T-K-AMIN (1. rész); K-I2 (2. rész)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

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

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: igen – a kalkulátor az 1. rész jóváhagyása nélkül akkor sem jelenik meg, ha ez a blokk jóvá van hagyva. Tartalmi ujjlenyomat: a8ff2c9b; forrás-ujjlenyomat: c91e55eb. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-KISMEGSZAKITO-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: A kismegszakító névleges áramának előzetes kiválasztása adott vezetékhez és terheléshez. Annak ellenőrzése, hogy egy meglévő védelem nem nagyobb-e a vezetéknél. Mire nem: Szelektivitás és zárlati megszakítóképesség (Icn) ellenőrzésére. ÁVK (FI-relé) kiválasztására. | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-NV | Nem vizsgált (a kalkulátoroldalon) | a méretezési segédszámítással azonos lista (D-HATOKOR) | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | Ib ≤ In ≤ Iz · I2 = 1,45 · In ≤ 1,45 · Iz · Zs,max = cmin · U0 / (m · In); m = 5 (B), 10 (C), 20 (D) | ☐ | ☐ | |
| KAL-KISMEGSZAKITO-FELT | Feltételezések (a számítás mellett) | 1) Rézvezető, a táblázat szerinti referencia-szerelési móddal; hőszigetelésben futó hosszú szakasz nélkül. 2) MSZ EN 60898-1 szerinti kismegszakító (I2 = 1,45 · In). 3) A jelleggörbét a fogyasztó bekapcsolási árama határozza meg (B: általános, C: motoros, induktív terhelés). | ☐ | ☐ | |
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

**Szabály.** I2 = k · In (T-K-I2, k = 1,45); a feltétel I2 ≤ 1,45 · Iz kismegszakítónál az In ≤ Iz-vel együtt teljesül (K-I2), a levezetés ezt külön sorban írja ki. Zs,max = cmin · U0 / (m · In) a legkisebb választható In-re (K-ZS), m a jelleggörbe szerint (T-K-M-B, T-K-M-C, T-K-M-D).

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

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: igen – a kalkulátor az 1. rész jóváhagyása nélkül akkor sem jelenik meg, ha ez a blokk jóvá van hagyva. Tartalmi ujjlenyomat: c09f3818; forrás-ujjlenyomat: 8c985e02. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-HUROKIMPEDANCIA-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: Hosszú áramkörök (kert, melléképület) lekapcsolási feltételének előzetes ellenőrzése. Mért hurokimpedancia és a számított érték összevetése. Mire nem: A helyszíni mérés kiváltására: a kész berendezés hurokimpedanciáját mérni kell. TT-rendszerre és ÁVK-val védett áramkörök igazolására. | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-NV | Nem vizsgált (a kalkulátoroldalon) | a méretezési segédszámítással azonos lista (D-HATOKOR), kiegészítve: „az elosztó előtti hálózat impedanciájának változása és a mérési bizonytalanság” | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | Zs = Ze + ρ1 · L · (1/A + 1/A_PE) · Ik = cmin · U0 / Zs · Zs ≤ Zs,max = cmin · U0 / (m · In) · Lmax = max(0; (Zs,max − Ze) / (ρ1 · (1/A + 1/A_PE))) | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-FELT | Feltételezések (a számítás mellett) | 1) TN-rendszer; a hurok a fázis- és a védővezetőn záródik. 2) Rézvezető, ρ1 = 0,0225 Ω·mm²/m (üzemi hőmérséklet); a vezeték reaktanciája elhanyagolva. 3) Kismegszakító (MSZ EN 60898-1) pillanatkioldási tartományának felső határa: B → 5 · In. 4) Kismegszakító (MSZ EN 60898-1) pillanatkioldási tartományának felső határa: C → 10 · In. | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-BEM-ZE | Ze – Hurokimpedancia az elosztónál (Ω) | alapérték: 0,35 Ω; megengedett: 0 … 20 Ω; súgó: „Mért vagy az elosztói engedélyestől kapott érték az áramkör kezdetén.” | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-BEM-L | L – Vezetékhossz (egy irányban), m | alapérték: 25 m; megengedett: > 0 és ≤ 5000 m | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-BEM-A | A – Fázisvezető keresztmetszete (mm²) | alapérték: 2,5 mm²; megengedett: > 0 és ≤ 300 mm² | ☐ | ☐ | |
| KAL-HUROKIMPEDANCIA-BEM-APE | A_PE – Védővezető keresztmetszete (mm²) | alapérték: nincs (üres); megengedett: > 0 és ≤ 300 mm²; nem kötelező; súgó: „Üresen a fázisvezetővel azonos.” | ☐ | ☐ | |
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

**Szabály.** Zs,max = cmin · U0 / (m · In) (K-ZS; m: T-K-M-B, T-K-M-C, T-K-M-D; In a KAL-KOZOS-MCB sorból). Feltétel: Zs ≤ Zs,max (relatív 10⁻⁹ tűréssel). Lmax = max(0; (Zs,max − Ze) / (ρ1 · (1/A + 1/A_PE))), kiírás 0,1 m-re lefelé kerekítve.

**Indoklás.** A pillanatkioldás felső határán (m · In) a kismegszakító a kikapcsolási időn belül old; az Lmax a feltétel átrendezése a hosszra.

**Kézzel számolt példa.** B16: Zs,max = 1 · 230 / (5 · 16) = 2,875 Ω; 0,8 ≤ 2,875 → „Számítás szerint a pillanatkioldás feltétele teljesül”; Lmax = (2,875 − 0,35) / (0,0225 · 0,8) = 140,2778 m → 140,2 m (lefelé kerekítve). B10, Ze = 0,5 Ω, 1,5 mm²: Zs,max = 4,6 Ω; Lmax = (4,6 − 0,5) / 0,03 = 136,6667 m → 136,6 m (lefelé kerekítve).

**Kérdés a lektorhoz.** A számítás a cmin tényezővel fut (T-K-CMIN = 1); ha a T-K-CMIN kérdésre adott válasz 0,95, a Zs,max, az Ik és az Lmax is változik.

**Forrás.** T-K-CMIN, T-K-U0, T-K-M-B (1. rész); K-ZS (2. rész)

**Összevetés.** Programmal összevetve: igen – 2 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-HUROKIMPEDANCIA-K2 | ☐ | ☐ | |

#### KAL-HUROKIMPEDANCIA-D1 – Nem teljesülő feltétel

**Szabály.** Ha Zs > Zs,max: „Számítás szerint a pillanatkioldás feltétele nem teljesül: … Lehetséges megoldás: nagyobb keresztmetszet, rövidebb vezeték, B jelleggörbe vagy ÁVK – a döntés a tervező feladata.” ÁVK-val védett áramkört és TT-rendszert a kalkulátor nem igazol (Mire nem).

**Indoklás.** A kalkulátor nem dönti el, melyik megoldás alkalmazható; csak a lehetőségeket sorolja fel.

**Kézzel számolt példa.** Ze = 0,35 Ω, L = 100 m, A = 1,5 mm², C16: R = 0,0225 · 100 · (2/1,5) = 3 Ω; Zs = 3,35 Ω > Zs,max = 1,4375 Ω → nem teljesül; Lmax = (1,4375 − 0,35) / 0,03 = 36,25 m → 36,2 m (lefelé kerekítve).

**Forrás.** T-K-M-C (1. rész); K-ZS, D-AVK (2. rész)

**Összevetés.** Programmal összevetve: igen – 1 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-HUROKIMPEDANCIA-D1 | ☐ | ☐ | |

#### KAL-HUROKIMPEDANCIA-D2 – Csökkentett védővezető és túl nagy Ze

**Szabály.** A védővezető keresztmetszete külön megadható (A_PE); üresen a fázisvezetővel azonos. Ha már Ze ≥ Zs,max, figyelmeztetés: „Már az elosztónál mért hurokimpedancia is eléri a megengedett értéket: ezzel a védelemmel az áramkör nem rövidíthető le eléggé.”, és Lmax = 0. Ze = 0 is megadható.

**Indoklás.** A tervező Méretezés füle a csökkentett PE-erű kábelt nem számolja (D-BLOKK, D-PE), a kalkulátor viszont a megadott A_PE-vel számol – a „Nem vizsgált” lista (D-HATOKOR) ugyanakkor a csökkentett N- vagy PE-eret is felsorolja.

**Kézzel számolt példa.** A = 2,5 mm², A_PE = 1,5 mm², L = 20 m, Ze = 0,3 Ω, B16: R = 0,0225 · 20 · (1/2,5 + 1/1,5) = 0,48 Ω; Zs = 0,78 Ω; Lmax = (2,875 − 0,3) / (0,0225 · (1/2,5 + 1/1,5)) = 107,292 m → 107,2 m (lefelé kerekítve). Ze = 3 Ω, B16 (Zs,max = 2,875 Ω): figyelmeztetés, Lmax = 0 m.

**Kérdés a lektorhoz.** A „Nem vizsgált” lista a csökkentett keresztmetszetű N- vagy PE-eret is felsorolja, a kalkulátor pedig A_PE megadását engedi. Elfogadható-e ez így (a lista a méretezési segédszámítással közös), vagy a kalkulátor listáját módosítani kell?

**Forrás.** D-BLOKK, D-PE, D-HATOKOR (2. rész)

**Összevetés.** Programmal összevetve: igen – 3 eset (kalkulátor-futtatás), automatikus tesztben.

| Azonosító | ✓ | ✗ | Helyes érték / megjegyzés |
|---|:-:|:-:|---|
| KAL-HUROKIMPEDANCIA-D2 | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (KAL-HUROKIMPEDANCIA).

Megjegyzés a blokkhoz (forrás, kiadás):

### KAL-TERHELHETOSEG-TABLAZAT – Terhelhetőségi táblázat

Forrás: MSZ HD 60364-5-52:2011 B.52.2, B.52.4, B.52.14, B.52.17 – a lib/sizing-tables.ts értékeivel (jóváhagyás függőben)

Cél: Rézvezetékek terhelhetősége (Iz0) 1,5–35 mm²-ig a választott szerelési módra, hőmérsékletre és csoportosításra javítva (Iz = Iz0 · kθ · kcs).

Kiadás: T1 (csak szakmai lektori jóváhagyással), verzió v1 (2026. 10. 10.); táblázat-kapu: igen – a kalkulátor az 1. rész jóváhagyása nélkül akkor sem jelenik meg, ha ez a blokk jóvá van hagyva. Tartalmi ujjlenyomat: 135442b5; forrás-ujjlenyomat: 15759e83. A program a kalkulátort csak ezzel az ujjlenyomat-párral rögzített lektori rekorddal teszi közzé.

| Azonosító | Tétel | Leírás / érték | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| KAL-TERHELHETOSEG-TABLAZAT-HAT | Mire jó / mire nem (a kalkulátoroldalon) | Mire jó: Gyors áttekintés: melyik keresztmetszet mekkora áramot bír az adott szerelési módban. A Keresztmetszet-választás és a Kismegszakító-választás eredményeinek ellenőrzése. Mire nem: Gyártói adatlap helyett speciális kábelekre (pl. gumiszigetelésű, árnyékolt, hőálló). Földben, szabad levegőn vagy kábeltálcán vezetett kábelekre (D, E, F, G mód). | ☐ | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT-NV | Nem vizsgált (a kalkulátoroldalon) | a méretezési segédszámítással azonos lista (D-HATOKOR) | ☐ | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT-KEPLET | Képletek (a kalkulátoroldal „Képletek” szakasza) | Iz = Iz0 · kθ · kcs | ☐ | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT-FELT | Feltételezések (a számítás mellett) | 1) Rézvezető, a táblázat szerinti referencia-szerelési móddal; hőszigetelésben futó hosszú szakasz nélkül. | ☐ | ☐ | |
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
| KAL-KOZOS | Közös működés (minden T1 kalkulátor) | 8 | ☐ | |
| KAL-FESZULTSEGES | Feszültségesés | 17 | ☐ | |
| KAL-MOTOR-ARAM | Motor névleges árama | 18 | ☐ | |
| KAL-LED-SZALAG-TAPEGYSEG | LED-szalag tápegysége | 13 | ☐ | |
| KAL-FAZISJAVITAS | Fázisjavítás (meddőkompenzálás) | 15 | ☐ | |
| KAL-KERESZTMETSZET | Keresztmetszet-választás | 14 | ☐ | |
| KAL-KISMEGSZAKITO | Kismegszakító-választás | 15 | ☐ | |
| KAL-HUROKIMPEDANCIA | Hurokimpedancia és zárlati áram | 14 | ☐ | |
| KAL-TERHELHETOSEG-TABLAZAT | Terhelhetőségi táblázat | 12 | ☐ | |

### 3. rész – kalkulátoronkénti döntés

A 3. rész kalkulátoronként hagyható jóvá. „Jóváhagyom”: a kalkulátor blokkja és a KAL-KOZOS blokk eltérés nélkül egyezik; a program a kalkulátort a sorban álló ujjlenyomat-párral rögzített lektori rekorddal teszi közzé, a táblázat-kapus kalkulátort csak az 1. rész jóváhagyása után. „Javítás után / nem”: a kalkulátor a javított kiadásban (a változott tételek ellenőrzése után) vagy egyáltalán nem hagyható jóvá; az okot kérjük a megjegyzésbe írni. Jelöletlen sor: nem jóváhagyott.

| Kalkulátor | Blokk | Tartalmi ujjlenyomat | Forrás-ujjlenyomat | Táblázat-kapu | Döntés |
|---|---|---|---|---|---|
| Feszültségesés | KAL-FESZULTSEGES | 937ce6f9 | 4e8e3830 | nem | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Motor névleges árama | KAL-MOTOR-ARAM | d3861940 | 81ecfbc6 | nem | ☐ Jóváhagyom · ☐ Javítás után / nem |
| LED-szalag tápegysége | KAL-LED-SZALAG-TAPEGYSEG | 12c6bbe4 | 48423097 | nem | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Fázisjavítás (meddőkompenzálás) | KAL-FAZISJAVITAS | 9d9f7219 | 737957ec | nem | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Keresztmetszet-választás | KAL-KERESZTMETSZET | ff172351 | 17321a6b | igen | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Kismegszakító-választás | KAL-KISMEGSZAKITO | a8ff2c9b | c91e55eb | igen | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Hurokimpedancia és zárlati áram | KAL-HUROKIMPEDANCIA | c09f3818 | 8c985e02 | igen | ☐ Jóváhagyom · ☐ Javítás után / nem |
| Terhelhetőségi táblázat | KAL-TERHELHETOSEG-TABLAZAT | 135442b5 | 15759e83 | igen | ☐ Jóváhagyom · ☐ Javítás után / nem |

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
| Csomagverzió | LK-3 (2026. 10. 10.) |
| Csomag-ujjlenyomat | d8648424 (a csomag teljes szövegéé: bevezető, tételek, jóváhagyó lap) |
| Táblázatváltozat | 2026.10-1 |
| 1. rész – táblázat-ujjlenyomat | c78b23ee (ehhez köti a program a jóváhagyást) |
| 2. rész – képlet-ujjlenyomat | 0f127c02 (a fejlesztési folyamat automatikus tesztje ellenőrzi) |
| 3. rész – kalkulátor-ujjlenyomat | bd293e1b (a 3. rész egészéé; kalkulátoronként: a döntési táblázatban) |

Döntés:

- ☐ Az 1–2. részt eltérés nélkül jóváhagyom.
- ☐ Az 1–2. részt a jelölt eltérések javítása után hagyom jóvá; a javított kiadás változott tételeit ellenőrzöm.
- ☐ Az 1–2. részt nem hagyom jóvá (indoklás a megjegyzésben).

Alulírott kijelentem, hogy a Villanyrajz lektori csomag ezen a lapon megjelölt, 59 oldalas kiadásának 1. (méretezési táblázatok), 2. (képletek és programozott döntések) és 3. (szabványhoz kötött kalkulátorok) részét a hivatkozott szabványok hatályos kiadásával összevetettem, és a tételeket a fenti döntés, valamint a kalkulátoronkénti döntés szerint jelöltem. A 3. részből kizárólag a kalkulátoronkénti döntésben „Jóváhagyom” jelölésű kalkulátorokat hagyom jóvá. A jóváhagyás kizárólag a csomagban, a megjelölt ujjlenyomatokkal azonosított tartalomra vonatkozik; nem minősül a programmal készült egyes tervekért vagy a kalkulátorokkal végzett egyes számításokért vállalt tervezői felelősségnek, és nem terjed ki a csomag 4–6. részére.

Az 1. rész ujjlenyomatát a program maga ellenőrzi: eltérésnél „ellenőrizendő” állapotra áll vissza. A 2. rész ujjlenyomatát a fejlesztési folyamat automatikus tesztje veti össze a jóváhagyottal. A 3. részben kalkulátoronként a tartalmi és a forrás-ujjlenyomat kerül a kiadási rekordba: tartalmi eltérésnél a program a kalkulátort nem teszi közzé, forráseltérésnél az automatikus teszt elbukik. Bármelyik eltérésénél új kiadás és új jóváhagyás kell.

Jogosultság például: épületvillamossági tervező (MMK-névjegyzék) vagy érintésvédelmi szabványossági felülvizsgáló.

| Adat | Kitöltés |
|---|---|
| Jóváhagyó neve | |
| Kamarai / névjegyzéki szám | |
| Jogosultság megnevezése | |
| Hely | |
| Dátum | |
| Aláírás | |
| Jóváhagyott csomagverzió és ujjlenyomatok | LK-3 (2026. 10. 10.); csomag: d8648424; 1. rész: c78b23ee; 2. rész: 0f127c02; 3. rész: bd293e1b |
| Megjegyzések | |

☐ Hozzájárulok, hogy nevem, névjegyzéki számom és a jóváhagyás dátuma a tervező Méretezés fülén (Eszközök → Tervsegéd → Méretezés) minden felhasználónak; minden felhasználó exportált terv-PDF-jében, ha a méretezési táblákat bekapcsolja, az elosztóoldalak „méretezés indoklása” táblájának „Táblázatok – Állapot” sorában (ugyanennek a táblának az utolsó sora a terv tervezőjének „Tervezői ellenőrzés” aláírósora); a nyilvános, keresőkben is megtalálható kalkulátoroldalakon a táblázatokat használó kalkulátorok (Feszültségesés, Keresztmetszet-választás, Kismegszakító-választás, Hurokimpedancia és zárlati áram, Terhelhetőségi táblázat) „Táblázatok állapota” sorában és a Vezeték-ellenállás kalkulátor ρ1 szerinti tájékoztató sorában – ezzel a szöveggel megjelenjen: „A táblázatértékeket szakmailag lektorálta: [név] ([névjegyzéki szám]), [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.”; továbbá hogy a 3. részből általam jóváhagyott kalkulátorok oldalán nevem és minősítésem így megjelenjen: „Szakmailag lektorálta: [név], [minősítés] · [dátum]; Szakmai lektor: [név], [minősítés]”. Hozzájárulás hiányában a program a nevem nélkül jelzi a lektorálást: „A táblázatértékeket jogosult villamos tervező szakmailag lektorálta, [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.”, illetve „Szakmailag lektorálta: [minősítés] · [dátum]; Szakmai lektor: [minősítés]”. A jóváhagyás érvénye a hozzájárulástól nem függ.
