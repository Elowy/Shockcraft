<!-- Generált fájl – kézzel ne szerkeszd. Forrás: scripts/lektori-csomag.ts; folyamat: docs/lektoralas.md. -->

# Villanyrajz – lektori csomag

Szakmai lektori ellenőrzőcsomag a méretezési segédszámításhoz, a szabványhoz kötött kalkulátorokhoz és a Tudástár biztonságkritikus (R3) tartalmához: táblázatok, képletek, programozott döntések, kalkulátorok, bekötési ábrák és cikkvázlatok

| Adat | Érték |
|---|---|
| Csomagverzió | LK-4 (2026. 10. 12.) |
| Csomag-ujjlenyomat | df31ad27 (a csomag teljes szövegéé: bevezető, tételek, jóváhagyó lap) |
| Táblázatváltozat | 2026.10-1 |
| 1. rész – táblázat-ujjlenyomat | c78b23ee (ehhez köti a program a jóváhagyást) |
| 2. rész – képlet-ujjlenyomat | 25b6c94f (a fejlesztési folyamat automatikus tesztje ellenőrzi) |
| 3. rész – kalkulátor-ujjlenyomat | e65e37f3 (a 3. rész egészéé; kalkulátoronként: a döntési táblázatban) |
| 4. rész – ábra-ujjlenyomat | d24b131b (a 4. rész egészéé; ábránként: a döntési táblázatban) |
| 5. rész – cikk-ujjlenyomat | 3a9439d8 (az 5. rész egészéé; cikkenként: a döntési táblázatban) |
| Jóváhagyási állapot (1. rész) | ellenőrizendő – jogosult tervező még nem hagyta jóvá |
| Ellenőrizendő tételek | 1. rész: 146; 2. rész: 38; 3. rész: 126; 4. rész: 104; 5. rész: 37 (összesen 451; ezen kívül a kérdések: 54) |
| Becsült ráfordítás | kb. 19 óra 31 perc |

> Belső munkaanyag a szakmai lektor részére – nem nyilvános. A csomagot a program generálja; a táblázatértékek a program jelenlegi értékei, amelyeket a szabvánnyal kell összevetni.

## Tartalom

- Bevezető
- 1. rész – Méretezési táblázatok
- 2. rész – Képletek és programozott döntések
- 3. rész – Szabványhoz kötött kalkulátorok (T1)
- 4. rész – Bekötési ábrák (R3)
- 5. rész – Biztonsági cikkek (R3) – a cikkvázlatok szövege
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
- a 4. rész „Jóváhagyom” jelölésű bekötési ábrái (bekötés, érszínek, kapcsok szerepe, szakaszok érszáma, működés minden állásban) és a szimulátor biztonsági szabályai (BEK-SZABALYOK) helyesek, és alkalmasak szakember tájékoztatására; R3 tartalomként ehhez a második olvasó egyetértése is kell;
- az 5. rész „Jóváhagyom” jelölésű cikkvázlatainak szövege (a nem zárható veszély-doboz, az állítások, a figyelmeztetések, a táblák, a számpéldák és a források) helyes, és alkalmas a megjelölt közönség tájékoztatására; R3 tartalomként ehhez is a második olvasó egyetértése kell. A jóváhagyás a megadott tartalmi ujjlenyomatú szövegre szól.

A jóváhagyás nem jelenti:

- tervezői felelősségvállalást az egyes, a programmal készült tervekért vagy a kalkulátorokkal végzett egyes számításokért: az eredmény továbbra is „tervezői ellenőrzést segítő”, illetve „számítás szerinti” érték, nem tervezői méretezés; a tervért annak tervezője felel – a programban megjelenő jóváhagyási szöveg is csak a táblázatértékekre vonatkozik;
- a program egészének (forráskód, felület, más funkciók) vizsgálatát vagy minősítését;
- a felhasználó által megadott adatok (terhelés, hossz, szerelési mód, Zs, projekt-felülírás) helyességének igazolását, illetve a kész berendezés mérésének kiváltását;
- a hatókörön kívüli esetek (D-HATOKOR és a kalkulátorok „Nem vizsgált” listái) vizsgálatát, és a 6. részt, amely jelenleg helyőrző;
- a Tudástár cikkeinek közzétételét magát: a cikk csak akkor jelenik meg, ha a szövegét (5. rész) és minden ábráját (4. rész) is jóváhagyták, és a Tudástár lektori rekordja teljes (jogosultság, dátum, jóváhagyási hivatkozás, második olvasó); négy vázlat kiadásához ezen túl még ábra vagy nézet hiányzik (5. rész).

### Hogyan kell kitölteni?

1. A csomagot a hivatkozott szabványok hatályos kiadásával kell összevetni; a program kódjának olvasása nem szükséges.
2. Tételenként: ✓ = az érték vagy állítás helyes; ✗ = eltér vagy hibás – ilyenkor a „Helyes érték / megjegyzés” mezőbe a helyes értéket kérjük beírni. A forrást (szabvány, kiadás, pont vagy táblázat) blokkonként elég egyszer megadni, a blokk végén álló „Megjegyzés a blokkhoz (forrás, kiadás)” mezőben; ha egy tételé ettől eltér, a tételnél.
3. Gyorsítás: ha a blokk minden tétele egyezik, elég a blokk végén „A blokk minden tétele egyezik” négyzetet jelölni; a tételeket nem kell egyenként pipálni. Ha bármelyik tétel eltér, a blokk négyzetét ne jelölje; az eltérő tételeket jelölje ✗-szel, a többi, pipálatlanul hagyott tétel egyezőnek számít. A terhelhetőségi táblák elején álló áttekintő mátrix soronként vethető össze a szabvány táblázatával.
4. A 2. és a 3. részben minden szabálytétel egy szabályt, indoklást és kézzel számolt példát tartalmaz; a példát érdemes újraszámolni. A „Kérdés a lektorhoz” pontokra kérjük külön választ a megjegyzés mezőben.
5. A 3. részben a táblázatértékeket nem kell újra összevetni (az 1. rész azonosítóival hivatkozunk rájuk). A kalkulátorok kalkulátoronként hagyhatók jóvá (Jóváhagyó lap, „3. rész – kalkulátoronkénti döntés”). A kalkulátorok előnézetben ki is próbálhatók (a hozzáférést a megbízó adja), de a csomag önmagában is ellenőrizhető.
6. A 4. részben a biztonsági szabályokat (BEK-SZABALYOK) tételenként, ábránként pedig a rajzot, a vezetéktáblát, a szakaszok érszámát és a kapcsolóállás-táblázatot kell átnézni, és a blokk végén (és a Jóváhagyó lap „4. rész – ábránkénti döntés” táblázatában) jelölni: Jóváhagyom, Javítással (a hibát a megjegyzésbe), vagy Elutasítom. A témakörök közös lektori kérdései (BEK-…-KERDESEK blokkok) az ábrák előtt állnak, a cikkek saját kérdései az 5. rész cikkblokkjaiban; minden kérdésnek egyedi azonosítója és válaszmezője van.
7. Az 5. részben cikkenként a teljes szöveget (a veszély-dobozt, az állításokat, a táblákat, a számpéldákat és a forrásokat) kell átnézni, és a blokk végén (és a Jóváhagyó lap „5. rész – cikkenkénti döntés” táblázatában) jelölni: Jóváhagyom, Javítással, vagy Elutasítom. A Jóváhagyó lap ábránkénti és cikkenkénti döntése mérvadó; a blokkok végi jelölések (a „Döntés” sor, „A blokk minden tétele egyezik”) csak előkészítik azt, és eltérésnél a lap számít.
8. Ha két forrás egy értékre eltérő számot ad, mindkettőt kérjük a megjegyzésbe írni a forrással; az érték a tisztázásig „ellenőrizendő” marad.
9. Terjedelmesebb javítást (pl. egy teljes táblázat javasolt értékeit) külön mellékletben kérjük, a tételazonosítókra hivatkozva.
10. Végül a Jóváhagyó lapot kell kitölteni és aláírni (a lapokat a láblécben szignálni); a 4. és az 5. rész jóváhagyásához a második olvasó lapját is, és a jelölt csomaggal együtt (papíron vagy szkennelve) visszaküldeni.

A csomag belső munkaanyag, nem nyilvános. A benne szereplő számértékek a program jelenlegi értékei, amelyeket a szabvánnyal össze kell vetni; nem a szabvány szövegének másolatai.

### Jelölések

- Ib – tervezett (terhelési) áram; In – a védelem névleges árama; I2 – a védelem megállapodás szerinti kioldóárama (a működést biztosító áram)
- Iz0 – táblázati terhelhetőség; Iz – javított terhelhetőség; kθ – hőmérsékleti tényező; kcs – csoportosítási tényező
- U0 – névleges fázis–föld feszültség; ΔU – feszültségesés; ρ1 – fajlagos ellenállás üzemi hőmérsékleten; λ – fajlagos reaktancia
- Zs – hibahurok-impedancia; m – a pillanatkioldás felső határának szorzója; cmin – feszültségtényező; A, A_PE – fázis- és védővezető-keresztmetszet
- MCB – kismegszakító; RCBO – túláramvédelemmel egybeépített áram-védőkapcsoló; ÁVK – áram-védőkapcsoló (FI-relé)
- Kalkulátoroknál: Ze – hurokimpedancia az elosztónál; Ik – zárlati (hiba-) áram; Lmax – legnagyobb hossz; η – hatásfok; Qc – kondenzátorteljesítmény; ω = 2π · f – körfrekvencia

### Becsült ráfordítás

A becslés a szabványok kéznél lévő, hatályos kiadását és a csomag egyszeri átnézését feltételezi: tételenként és ábránként a táblák összevetését, a lektori kérdésekre kérdésenként 4 percet, az 5. részben a cikkvázlatok gondos átolvasását (kb. 110 szó/perc) és a döntést. Eltérések esetén a javított kiadás visszaellenőrzése (csak a változott tételek) külön kb. 15–30 perc.

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
| BEK-SZABALYOK | Biztonsági szabályok, amelyeket a szimulátor minden állásban ellenőriz | 24 | 24 perc |
| BEK-VIL-KERDESEK | Világítási kapcsolások (101–107) – közös kérdések | 0 | 32 perc |
| BEK-EGYPOLUSU-KAPCSOLO-101 | Egypólusú kapcsoló (101): egy lámpa egy helyről | 4 | 13 perc |
| BEK-KETPOLUSU-KAPCSOLO-102 | Kétpólusú kapcsoló (102): a fázis- és a nullavezető együttes bontása | 4 | 13 perc |
| BEK-CSILLARKAPCSOLO-105 | Csillárkapcsoló (105): két lámpakör egy helyről | 4 | 15 perc |
| BEK-VALTOKAPCSOLO-106 | Váltókapcsolás (2 × 106): egy lámpa két helyről | 4 | 14 perc |
| BEK-KETTOS-VALTOKAPCSOLO-106-6 | Kettős váltókapcsoló (106+6): két lámpa, mindkettő két helyről | 4 | 18 perc |
| BEK-KERESZTKAPCSOLO-107 | Keresztkapcsolás (106 + 107 + 106): egy lámpa három helyről | 4 | 15 perc |
| BEK-KERESZTKAPCSOLO-107-2X107 | Keresztkapcsolás (106 + 2 × 107 + 106): egy lámpa 4 helyről | 4 | 17 perc |
| BEK-KERESZTKAPCSOLO-107-3X107 | Keresztkapcsolás (106 + 3 × 107 + 106): egy lámpa 5 helyről | 4 | 20 perc |
| BEK-KERESZTKAPCSOLO-107-4X107 | Keresztkapcsolás (106 + 4 × 107 + 106): egy lámpa 6 helyről | 4 | 25 perc |
| BEK-VED-KERDESEK | Dugalj, kismegszakító, FI-relé – közös kérdések | 0 | 24 perc |
| BEK-DUGALJ-ATHURKOLAS | Dugaljkör áthurkolással: két védőérintkezős dugalj FI-relé és kismegszakító után | 4 | 14 perc |
| BEK-DUGALJ-LEAGAZTATAS | Dugaljkör leágaztatással: két dugalj a kötődobozból, FI-relé és kismegszakító után | 4 | 15 perc |
| BEK-KISMEGSZAKITO-ARAMKOROK | Két dugaljkör saját kismegszakítóval, közös FI-relé után | 4 | 14 perc |
| BEK-FI-RELE-BEKOTES | Áram-védőkapcsoló (FI-relé) bekötése dugaljkör elé, próbagombbal | 4 | 14 perc |
| BEK-FI-RELE-HIBAHELYZETEK | Mikor old ki a FI-relé? Testzárlat, fázis–föld és fázis–nulla érintés | 4 | 14 perc |
| BEK-FOLD-KERDESEK | Földelési rendszerek és EPH – közös kérdések | 0 | 36 perc |
| BEK-FOLDELES-TN-C | TN-C rendszer: a PEN-vezető a fogyasztóig fut | 4 | 13 perc |
| BEK-FOLDELES-TN-S | TN-S rendszer: külön nulla- és védővezető a táppontól | 4 | 14 perc |
| BEK-FOLDELES-TN-C-S | TN-C-S rendszer: PEN a szétválasztási pontig, utána külön N és PE | 4 | 14 perc |
| BEK-FOLDELES-TT | TT rendszer: a fémház a saját földelőn | 4 | 13 perc |
| BEK-FOLDELES-IT | IT rendszer: földeletlen táppont, földelt fémházak | 4 | 16 perc |
| BEK-EPH-ALAPOK | Egyenpotenciálra hozás: a fő EPH-sín és a vízvezeték bekötése (TN-C-S) | 4 | 14 perc |
| CIK-ARAM-VEDOKAPCSOLO-FI-RELE | Áram-védőkapcsoló (FI-relé): működés, 30 mA, típusok, próbagomb | 3 | 52 perc |
| CIK-CSILLARKAPCSOLO-105-BEKOTESE | Csillárkapcsoló (105) bekötése: két lámpakör egy helyről | 3 | 17 perc |
| CIK-DUGALJ-BEKOTESE | Dugalj bekötése: védőérintkezős dugalj, áthurkolás és leágaztatás | 3 | 39 perc |
| CIK-EGYENPOTENCIALRA-HOZAS-EPH | Egyenpotenciálra hozás (EPH): fő és kiegészítő potenciálkiegyenlítés | 3 | 35 perc |
| CIK-EGYPOLUSU-KAPCSOLO-101-BEKOTESE | Egypólusú kapcsoló (101) bekötése: egy lámpa egy helyről | 3 | 19 perc |
| CIK-FESZULTSEGMENTESITES-OT-SZABALYA | A feszültségmentesítés öt szabálya | 2 | 31 perc |
| CIK-FOLDELESI-RENDSZEREK | Földelési rendszerek: TN-C, TN-S, TN-C-S, TT és IT | 3 | 56 perc |
| CIK-KERESZTKAPCSOLO-107-BEKOTESE | Keresztkapcsoló (107) bekötése: egy lámpa három vagy több helyről | 3 | 20 perc |
| CIK-KETPOLUSU-KAPCSOLO-102-BEKOTESE | Kétpólusú kapcsoló (102) bekötése: fázis és nulla együttes bontása | 3 | 17 perc |
| CIK-KETTOS-VALTOKAPCSOLO-106-6-BEKOTESE | Kettős váltókapcsoló (106+6) bekötése: két lámpa két helyről | 3 | 20 perc |
| CIK-KISMEGSZAKITO | Kismegszakító: B, C és D jelleggörbe, az Ib ≤ In ≤ Iz elve | 3 | 41 perc |
| CIK-VALTOKAPCSOLO-106-BEKOTESE | Váltókapcsoló (106) bekötése: egy lámpa két helyről | 3 | 18 perc |
| CIK-VILAGITASI-KAPCSOLASOK | Világítási kapcsolások: melyik kapcsoló mikor kell? (101–107) | 2 | 20 perc |
| – | Jóváhagyó lap kitöltése | – | 10 perc |
|  | Összesen | 451 | kb. 19 óra 31 perc |

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

**Kérdés a lektorhoz (T-K-CMIN).** A hatályos MSZ HD 60364-4-41 kiadás 411.4.4 pontja Zs · Ia ≤ U0 · Cmin alakú, Cmin = 0,95 értékkel? A program az MSZ HD 60364-4-41:2007 alakjának (Zs · Ia ≤ U0) megfelelően cmin = 1 értékkel számol. Ha igen: a tételt ✗-szel kérjük jelölni, helyes érték 0,95, és az F-LOOP tételnél a kiadás és a feltétel is javítandó.

Válasz (T-K-CMIN):

**Kérdés a lektorhoz (T-K-I2).** A program a termékszabvány szerinti I2/In-t és a 433.1 (2) feltétel Iz-szorzóját ugyanazzal az egy értékkel (1,45) kezeli; ha a tétel javításakor a két szerep eltérő értéket kívánna, kérjük mindkettőt külön megadni.

Válasz (T-K-I2):

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

A Villanyszerelő Tudástár Sémák szekciójának és biztonsági cikkeinek bekötési ábrái. Minden ábra egy netlistából (alkatrészek, kapcsok, erek szerepe és színe, kábelszakaszok, kapcsolóállások) és egy elrendezésből (helyek, útvonalak) készül; a program ugyanebből rajzolja a cikk ábráját, a vezetéktáblát és a Működés nézetet. A rész elején a szimulátor biztonsági szabályai állnak (BEK-SZABALYOK), utána témakörönként a közös kérdések, majd ábránként egy blokk: az ábra (Bekötés nézet, alapállás), a jelmagyarázat, a vezetéktábla, a szakaszok érszáma és a kapcsolóállás-táblázat, a netlista és az ábra ujjlenyomatával.

Az ábra és a netlista egyezését (a vezetékvégpontok a kapcsokon, a csomópontok, az érszínek, a feliratok, az érintkezők, a hibajelek és feliratok elhelyezése) automatikus teszt ellenőrzi; a kapcsolóállás-táblázatot két megvalósítás számolja azonosan: a Python-referenciaszimulátor és annak sorról sorra követett TypeScript-átirata. A gépi egyezés az átirat hűségét igazolja – a bekötés és a modell szakmai helyességét nem; ezt a lektor ítéli meg. A lektortól a villamos tartalom ellenőrzését kérjük: helyes-e a bekötés, az érszín-kiosztás, a kapcsok szerepe, a szakaszok érszáma és a működés minden állásban, helyesek-e a biztonsági szabályok, és alkalmas-e a rajz szakember tájékoztatására.

Biztonságkritikus (R3) tartalom: az ábrát a lektor és egy második olvasó hagyja jóvá (Jóváhagyó lap, „4. rész – ábránkénti döntés”; a lap ábránkénti döntése mérvadó, a blokkok végi jelölések csak előkészítik). A cikk csak akkor jelenik meg, ha minden ábrája jóváhagyott, és a cikk szövegét is jóváhagyták (5. rész). Az ábra bármely változása (netlista, elrendezés, szimbólum, rajzoló kód, ábraszín) új ujjlenyomatot ad: a cikk ilyenkor „újraellenőrzendő”, és új jóváhagyás kell.

A rajzon az erek színe a valódi ér színe (a zöld-sárga ér zöld alapon sárga csíkos; sötét témában a barna és a fekete ér világos körvonalat kap); a szín mellett minden éren felirat áll. A tervező alaprajzán a védővezető egyszínű zöld (az ábra „Így látod a tervezőben” sora ezt magyarázza). A szaggatott szürke vonal készüléken belüli kötést vagy érintési pontot, a piros szaggatott vonal jelképes hibahelyet jelöl – ezek nem szerelt erek. A keresztkapcsolás ábrái (1–4 × 107) változatként, egymás alatt állnak; változatválasztó nincs (a vázlat korábbi leírásával szemben).

### BEK-SZABALYOK – Biztonsági szabályok, amelyeket a szimulátor minden állásban ellenőriz

Forrás: lib/kb/circuit-rules.ts (a szimulátor: lib/kb/circuit.ts; Python-referencia: content/tudastar/r3-sim/sim.py)

A szimulátor minden kapcsolóállásban és hibahelyzetben ellenőrzi az alábbi szabályokat; ha egy ábra bármelyik állásban megsérti valamelyiket, az ábra nem készülhet el (a rajz és a táblázat nem jön létre). A szabályok a bekötés logikai helyességét védik; a szimuláció ideális vezetőkkel, igen/nem alapon számol: áramerősséget, feszültséget és lekapcsolási időt nem.

A lektor a szabályokat tételenként jóváhagyhatja vagy kifogásolhatja; a 4. rész kérdései ezekre a kódokra hivatkoznak (például I16: minden dugalj FI-relé mögött van). Az S0–S9 szerkezeti ellenőrzések formaiak, szakmai kérdés nincs bennük.

| Azonosító | Szabály | Tartalom és hatókör | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-SZAB-I1 | I1 – Nincs zárlat | Egyetlen kapcsolóállásban sem kerülhet egy hálózatra két különböző szerepű forráskapocs (fázis és nulla, két fázis); a védelmi ábrákon a talaj (föld) sem a fázis- vagy a nullavezetővel. (hatókör: minden ábra; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I2 | I2 – A védővezető folytonos | Minden PE-kapocs a betáp védővezetőjén (PE-hálózaton) van; az I. osztályú (fémházas) fogyasztónak és a védőérintkezős dugaljnak pontosan egy PE-kapcsa van. (hatókör: minden ábra; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I3 | I3 – A védővezetőt semmi nem bonthatja | Kapcsoló vagy más kapcsolókészülék nem bonthatja a védővezetőt; védővezető csak PE szerepű kapocshoz csatlakozhat, és a PE-hálózaton csak PE szerepű kapocs lehet. (hatókör: minden ábra; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I4 | I4 – A kapcsoló a fázist bontja | Kikapcsolt állásban a lámpa (és a feszültségmentesnek jelzett dugalj) egyik kapcsa sem lehet fázis alatt: a kapcsoló a fázisvezetőt bontja, nem a nullát. (hatókör: minden ábra; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I5 | I5 – Polaritás | Fázis szerepű kötés nem kerülhet a nullavezetőre, nulla szerepű fázisra; a lámpa L kapcsa nem lehet a nullán, az N kapcsa nem lehet fázison (felcserélt polaritás). (hatókör: minden ábra; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I6 | I6 – A nullavezetőt nem bontja egypólusú készülék | A nullavezető nem haladhat át egypólusú kapcsolón vagy egypólusú védőkészüléken; csak többpólusú készülék bonthatja, amely a fázissal együtt bont. (hatókör: minden ábra; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I7 | I7 – A nullavezető folytonos | A fogyasztó nullakapcsa a nullavezetőn van, és a nullavezető kötése folytonos; az „összes pólust bontó” kapcsolónál kikapcsolt állásban a fázis és a nulla is bontott. (hatókör: minden ábra; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I8 | I8 – Az érszín a szerephez illik | A vezető színe a szerepének megfelel: a fázisvezető barna, fekete vagy szürke, a nullavezető kék, a védővezető zöld-sárga (a PEN-vezető zöld-sárga vagy kék); ismeretlen szín nem megengedett. (hatókör: minden ábra; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I9 | I9 – A vezető és a kapocs szerepe egyezik | A vezető fajtája (fázis, nulla, védő) megegyezik a két végén lévő kapocs szerepével; az eltérés a védővezetőnél I3, a nullavezetőnél I6 szabálysértés is. (hatókör: minden ábra; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I10 | I10 – Az igazságtábla egyezik a szimulációval | A kapcsolóállás-táblázat minden sora (a kapcsolók és hibahelyzetek minden kombinációja, minden fogyasztó, dugalj, védelem) azonos a szimuláció eredményével; hiányzó vagy többlet sor nincs. (hatókör: minden ábra; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I11 | I11 – Hibátlan üzemben a FI-relé nem old ki | Normál (hibamentes) üzemben nem folyik különbözeti áram, vagyis a FI-relé nem old ki. (hatókör: dugalj-, kismegszakító- és FI-relé ábrák; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I12 | I12 – A FI-relé nem kerülhető meg | A FI-relé védett oldala a pólusok megkerülésével nem lehet összeköttetésben a táp oldallal (az áramkör nem „kerüli meg” a FI-relét). (hatókör: dugalj-, kismegszakító- és FI-relé ábrák; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I14 | I14 – Külön áramkörök nulla- és fázisvezetője | Két külön áramkör nullavezetője nem köthető össze; a lámpa fázis- és nullavezetője ugyanabból az áramkörből jön. (hatókör: minden ábra; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I15 | I15 – Minden dugalj és fogyasztó kismegszakító mögött van | A dugalj és a fogyasztó fázisa kismegszakító (túláramvédelem) nélkül nem kaphat feszültséget. (hatókör: dugalj-, kismegszakító- és FI-relé ábrák; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I16 | I16 – Minden dugalj FI-relé mögött van | A dugalj fázisa és nullája is a FI-relé védett oldalán van. (hatókör: dugalj-, kismegszakító- és FI-relé ábrák; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-I17 | I17 – A próbagomb működik | A FI-relé próbagombjának van megnyomott állása bekapcsolt FI-relé mellett, és megnyomására a FI-relé kiold. (hatókör: dugalj-, kismegszakító- és FI-relé ábrák; minden kapcsolóállásban) | ☐ | ☐ | |
| BEK-SZAB-E1 | E1 – A földelési rendszer szerkezete | A rendszernek (TN-C, TN-S, TN-C-S, TT, IT) megfelelő szerkezet: a csillagpont földelése (IT-nél földeletlen), a PEN/N/PE vezetők szétválasztása TN-C-S-ben pontosan egy helyen, a szétválasztás után nincs újra-összekötés és PEN, a fémházak a rendszerhez illő módon kötöttek (TN: vezetőn át a csillagponthoz; TT és IT: helyi földelőn). (hatókör: földelési rendszerek és EPH ábrák; a földelési rendszer szerkezete) | ☐ | ☐ | |
| BEK-SZAB-E2 | E2 – Kapcsolók és védelmek | Kapcsolókészülék nem bonthatja a védővezetőt vagy a PEN-t; a túláramvédelem csak fázisvezetőt bonthat; a PEN és a PE nem haladhat át az áram-védőkapcsolón; egy pólus két kapcsa azonos szerepű. (hatókör: földelési rendszerek és EPH ábrák; a földelési rendszer szerkezete) | ☐ | ☐ | |
| BEK-SZAB-E3 | E3 – Fémházas fogyasztó védővezetője | Az I. osztályú (fémházas) fogyasztónak van védővezető-kapcsa, amely a rendszer szerint csatlakozik. (hatókör: földelési rendszerek és EPH ábrák; a földelési rendszer szerkezete) | ☐ | ☐ | |
| BEK-SZAB-E4 | E4 – Vezetőkkel nincs zárlat | A jelképes hibahely és érintési pont nélkül, csak a szerelt vezetőkkel sehol nincs zárlat (fázis egy hálózaton más szerepűvel vagy a talajjal). (hatókör: földelési rendszerek és EPH ábrák; a földelési rendszer szerkezete) | ☐ | ☐ | |
| BEK-SZAB-E5 | E5 – Az első állás a hibamentes üzem | A hibahely és az érintés első (alap-) állapota „nincs”: a táblázat a hibamentes üzemből indul. (hatókör: földelési rendszerek és EPH ábrák; a földelési rendszer szerkezete) | ☐ | ☐ | |
| BEK-SZAB-E6 | E6 – Vezetők és színek a földelési ábrán | A vezető fajtája és színe az összekötött kapcsok szerepéhez illik; a földelővezető egyik vége földelőkapocs, a másik PE- vagy PEN-kapocs; az EPH-vezető idegen vezetőképes részt köt a PE-hez. (hatókör: földelési rendszerek és EPH ábrák; a földelési rendszer szerkezete) | ☐ | ☐ | |
| BEK-SZAB-E7 | E7 – A FI-relé a földelési ábrán sem kerülhető meg | A FI-relé védett oldala a pólusok megkerülésével nem érintkezhet a táp oldallal vagy a talajjal. (hatókör: földelési rendszerek és EPH ábrák; a földelési rendszer szerkezete) | ☐ | ☐ | |
| BEK-SZAB-S | S – Szerkezeti (formai) ellenőrzések (S0–S9) | A bemenet formai és modellszerű helyessége: a komponens-, kapocs-, vezeték- és szakaszazonosítók egyediek; a kapocsszerepek és vezetőfajták ismertek; minden vezeték mindkét vége létezik; a szakaszok, az állapotok és a szakadások hibátlanok; a kapcsolókészülékek modellje (kismegszakító, FI-relé pólusai, nyomógomb, többállású választó) érvényes. Szakmai kérdés nincs bennük. (hatókör: minden ábra; formai ellenőrzés) | ☐ | ☐ | |

☐ A blokk minden tétele egyezik (BEK-SZABALYOK).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-VIL-KERDESEK – Világítási kapcsolások (101–107) – közös kérdések

Forrás: lektori kérdéslista (content/tudastar/lektori-kerdesek-r3.md), „Világítási kapcsolások (101–107)” szakasz

A témakör közös kérdései: a témakör minden ábrájára és cikkére vonatkoznak (ábrák: BEK-EGYPOLUSU-KAPCSOLO-101, BEK-KETPOLUSU-KAPCSOLO-102, BEK-CSILLARKAPCSOLO-105, BEK-VALTOKAPCSOLO-106, BEK-KETTOS-VALTOKAPCSOLO-106-6, BEK-KERESZTKAPCSOLO-107, BEK-KERESZTKAPCSOLO-107-2X107, BEK-KERESZTKAPCSOLO-107-3X107, BEK-KERESZTKAPCSOLO-107-4X107). A válaszokat a kérdések alatti mezőbe kérjük; a kérdések azonosítójára (BEK-VIL-Q1…) a megjegyzésekben lehet hivatkozni.

**Kérdés a lektorhoz (BEK-VIL-Q1).** Kék ér kapcsolt fázisként vagy váltóvezetékként, ha a szakaszban nincs nullavezető, és a végén tartós jelölés van: a cikkek ezt megengedettként írják (MSZ HD 60364-5-51 514.3). Kérjük, a lektor erősítse meg a hazai értelmezést és a jelölés módját; a szimuláció a kék fázisvezetőt mindig hibának veszi.

Válasz (BEK-VIL-Q1):

**Kérdés a lektorhoz (BEK-VIL-Q2).** Ajánljuk vagy csak megemlítjük, hogy a 106-os kapcsoló egypólusúként, a 107-es a sor végén váltókapcsolóként is beköthető? A szimuláció szerint mindkettő működik, de a szabad kapocs fázis alá kerül; a cikkek ezt figyelmeztetéssel írják.

Válasz (BEK-VIL-Q2):

**Kérdés a lektorhoz (BEK-VIL-Q3).** A FI-relé korlátairól szóló mondatok szakmai megfogalmazása: L–N érintésnél „nem feltétlenül old ki”, a nullát bontó kapcsolót és a felcserélt polaritást nem jelzi. Kell-e hivatkozni a FI-relé cikkre, vagy a figyelmeztetések közös szövegébe kerüljön?

Válasz (BEK-VIL-Q3):

**Kérdés a lektorhoz (BEK-VIL-Q4).** A „bizsergés” teendő (ne érintsd újra, kapcsold le az áramkört az elosztóban, ne kapcsold vissza) laikusnak szóló cselekvési utasítás. Kell-e szó szerint igazodnia a tervezett elsősegély- és munkavégzési figyelmeztető szövegekhez (szakmai és jogi jóváhagyással)?

Válasz (BEK-VIL-Q4):

**Kérdés a lektorhoz (BEK-VIL-Q5).** Közös nulla két áramkörre, különböző fázisokról: a cikk szerint a nulla szakadásakor a fogyasztók sorba kapcsolódva a két fázis közötti feszültségre kerülhetnek. Kérjük a szakmai megfogalmazás ellenőrzését.

Válasz (BEK-VIL-Q5):

**Kérdés a lektorhoz (BEK-VIL-Q6).** Lépcsőházi világítás táplálása a közös hálózatról (a lakás elosztójától függetlenül): kérjük, a lektor erősítse meg, és döntse el, kell-e külön jelölés (például a közös fogyasztásmérő, REG jelölés).

Válasz (BEK-VIL-Q6):

**Kérdés a lektorhoz (BEK-VIL-Q7).** Szabványpontok, amelyeket a cikkek forráslistája „lektor ellenőrizze” megjegyzéssel jelöl: az MSZ HD 60364-5-537 honosítási éve és alpontjai, az MSZ HD 60364-5-559 menetes foglalatra vonatkozó alpontja, az MSZ EN 60335-1 7.12.2, az MSZ HD 60364-6 6.4.x pontja.

Válasz (BEK-VIL-Q7):

**Kérdés a lektorhoz (BEK-VIL-Q8).** Ajánlott érszín-kiosztás az ábrákban: barna a betáp, fekete a kapcsolt fázis, szürke a váltóvezeték; a 102-esnél háromeres kábellel barna a kapcsolt fázis. Kérjük, a lektor erősítse meg ajánlásként (a tervezőprogram alaprajzán a védővezető egyszínű zöld).

Válasz (BEK-VIL-Q8):

☐ A blokk minden tétele egyezik (BEK-VIL-KERDESEK).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-EGYPOLUSU-KAPCSOLO-101 – Egypólusú kapcsoló (101): egy lámpa egy helyről

Forrás: content/tudastar/r3/egypolusu-kapcsolo-101-bekotese.netlist.json (netlista), content/tudastar/diagramok/egypolusu-kapcsolo-101.json (elrendezés); cikk: egypolusu-kapcsolo-101-bekotese, abra-1 („Egypólusú kapcsoló (101) bekötése kötődobozzal”)

Ábra-azonosító: egypolusu-kapcsolo-101. Netlista-ujjlenyomat: 162c980a; ábra-ujjlenyomat: 1dcf64c0 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (2 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VIL-Q1–Q8) a(z) BEK-VIL-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-EGYPOLUSU-KAPCSOLO-101-BEKOTESE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (egypolusu-kapcsolo-101, ábra-ujjlenyomat 1dcf64c0).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: S1 – Kapcsoló (101). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (2 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

| S1 | Eredmény (a szimuláció szerint) |
|---|---|
| ki | Lámpa: nem ég |
| be | Lámpa: ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-EGYPOLUSU-KAPCSOLO-101-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 162c980a, ábra 1dcf64c0 | ☐ | ☐ | |
| BEK-EGYPOLUSU-KAPCSOLO-101-VEZ | Vezetéktábla (8 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-EGYPOLUSU-KAPCSOLO-101-SZAK | Szakaszok és érszám (3 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-EGYPOLUSU-KAPCSOLO-101-ALL | Kapcsolóállás-táblázat (2 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-EGYPOLUSU-KAPCSOLO-101):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-EGYPOLUSU-KAPCSOLO-101).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KETPOLUSU-KAPCSOLO-102 – Kétpólusú kapcsoló (102): a fázis- és a nullavezető együttes bontása

Forrás: content/tudastar/r3/ketpolusu-kapcsolo-102-bekotese.netlist.json (netlista), content/tudastar/diagramok/ketpolusu-kapcsolo-102.json (elrendezés); cikk: ketpolusu-kapcsolo-102-bekotese, abra-1 („Kétpólusú kapcsoló (102) bekötése”)

Ábra-azonosító: ketpolusu-kapcsolo-102. Netlista-ujjlenyomat: a253fd8a; ábra-ujjlenyomat: 8f880407 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (2 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VIL-Q1–Q8) a(z) BEK-VIL-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-KETPOLUSU-KAPCSOLO-102-BEKOTESE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. Ebben a változatban a betáp a kapcsolódobozon át megy a fogyasztóhoz; a védővezető a kapcsolódobozban, kapcsolón kívül, vezetékösszekötővel folytatódik. A fogyasztóhoz háromeres kábel megy, ezért itt – a fenti kiosztástól eltérően – a kapcsolt fázis barna, a kapcsolt nulla kék.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (ketpolusu-kapcsolo-102, ábra-ujjlenyomat 8f880407).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: S1 – Kapcsoló (102). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (2 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

| S1 | Eredmény (a szimuláció szerint) |
|---|---|
| ki | Lámpa (vagy más fogyasztó): nem ég |
| be | Lámpa (vagy más fogyasztó): ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-KETPOLUSU-KAPCSOLO-102-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista a253fd8a, ábra 8f880407 | ☐ | ☐ | |
| BEK-KETPOLUSU-KAPCSOLO-102-VEZ | Vezetéktábla (6 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KETPOLUSU-KAPCSOLO-102-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KETPOLUSU-KAPCSOLO-102-ALL | Kapcsolóállás-táblázat (2 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-KETPOLUSU-KAPCSOLO-102):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KETPOLUSU-KAPCSOLO-102).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-CSILLARKAPCSOLO-105 – Csillárkapcsoló (105): két lámpakör egy helyről

Forrás: content/tudastar/r3/csillarkapcsolo-105-bekotese.netlist.json (netlista), content/tudastar/diagramok/csillarkapcsolo-105.json (elrendezés); cikk: csillarkapcsolo-105-bekotese, abra-1 („Csillárkapcsoló (105) bekötése”)

Ábra-azonosító: csillarkapcsolo-105. Netlista-ujjlenyomat: 171c858b; ábra-ujjlenyomat: 0b2d7654 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VIL-Q1–Q8) a(z) BEK-VIL-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-CSILLARKAPCSOLO-105-BEKOTESE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A két kapcsolt fázis itt: 1. kör fekete, 2. kör szürke (felirattal).

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (csillarkapcsolo-105, ábra-ujjlenyomat 0b2d7654).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: S1.b1 – Csillárkapcsoló (105) – 1. billentyű; S1.b2 – Csillárkapcsoló (105) – 2. billentyű. Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

| S1.b1 | S1.b2 | Eredmény (a szimuláció szerint) |
|---|---|---|
| ki | ki | 1. lámpacsoport: nem ég; 2. lámpacsoport: nem ég |
| ki | be | 1. lámpacsoport: nem ég; 2. lámpacsoport: ég |
| be | ki | 1. lámpacsoport: ég; 2. lámpacsoport: nem ég |
| be | be | 1. lámpacsoport: ég; 2. lámpacsoport: ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-CSILLARKAPCSOLO-105-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 171c858b, ábra 0b2d7654 | ☐ | ☐ | |
| BEK-CSILLARKAPCSOLO-105-VEZ | Vezetéktábla (16 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-CSILLARKAPCSOLO-105-SZAK | Szakaszok és érszám (3 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-CSILLARKAPCSOLO-105-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-CSILLARKAPCSOLO-105):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-CSILLARKAPCSOLO-105).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-VALTOKAPCSOLO-106 – Váltókapcsolás (2 × 106): egy lámpa két helyről

Forrás: content/tudastar/r3/valtokapcsolo-106-bekotese.netlist.json (netlista), content/tudastar/diagramok/valtokapcsolo-106.json (elrendezés); cikk: valtokapcsolo-106-bekotese, abra-1 („Váltókapcsolás két 106-os kapcsolóval”)

Ábra-azonosító: valtokapcsolo-106. Netlista-ujjlenyomat: 909db559; ábra-ujjlenyomat: 8b477227 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VIL-Q1–Q8) a(z) BEK-VIL-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-VALTOKAPCSOLO-106-BEKOTESE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (valtokapcsolo-106, ábra-ujjlenyomat 8b477227).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: S1 – K1 (A hely); S2 – K2 (B hely). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

| S1 | S2 | Eredmény (a szimuláció szerint) |
|---|---|---|
| 0 (közös–1) | 0 (közös–1) | Lámpa: ég |
| 0 (közös–1) | 1 (közös–2) | Lámpa: nem ég |
| 1 (közös–2) | 0 (közös–1) | Lámpa: nem ég |
| 1 (közös–2) | 1 (közös–2) | Lámpa: ég |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-VALTOKAPCSOLO-106-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 909db559, ábra 8b477227 | ☐ | ☐ | |
| BEK-VALTOKAPCSOLO-106-VEZ | Vezetéktábla (12 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-VALTOKAPCSOLO-106-SZAK | Szakaszok és érszám (4 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-VALTOKAPCSOLO-106-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-VALTOKAPCSOLO-106):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-VALTOKAPCSOLO-106).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KETTOS-VALTOKAPCSOLO-106-6 – Kettős váltókapcsoló (106+6): két lámpa, mindkettő két helyről

Forrás: content/tudastar/r3/kettos-valtokapcsolo-106-6-bekotese.netlist.json (netlista), content/tudastar/diagramok/kettos-valtokapcsolo-106-6.json (elrendezés); cikk: kettos-valtokapcsolo-106-6-bekotese, abra-1 („Két lámpa két helyről, kettős váltókapcsolókkal”)

Ábra-azonosító: kettos-valtokapcsolo-106-6. Netlista-ujjlenyomat: 837cd200; ábra-ujjlenyomat: 2c4744a0 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (16 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VIL-Q1–Q8) a(z) BEK-VIL-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-KETTOS-VALTOKAPCSOLO-106-6-BEKOTESE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A két billentyű közös kapcsát (C1, C2) itt az A helyen áthidaló köti ugyanarra a fázisra; ahol a gyártó a két közös kapcsot belül összeköti, az áthidaló elmarad. A váltóvezetékek: 1a, 2a (1. kör) és 1b, 2b (2. kör).

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (kettos-valtokapcsolo-106-6, ábra-ujjlenyomat 2c4744a0).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: S1.b1 – K1 (A hely) – 1. billentyű; S1.b2 – K1 (A hely) – 2. billentyű; S2.b1 – K2 (B hely) – 1. billentyű; S2.b2 – K2 (B hely) – 2. billentyű. Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (16 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

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
| BEK-KETTOS-VALTOKAPCSOLO-106-6-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 837cd200, ábra 2c4744a0 | ☐ | ☐ | |
| BEK-KETTOS-VALTOKAPCSOLO-106-6-VEZ | Vezetéktábla (21 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KETTOS-VALTOKAPCSOLO-106-6-SZAK | Szakaszok és érszám (5 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KETTOS-VALTOKAPCSOLO-106-6-ALL | Kapcsolóállás-táblázat (16 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-KETTOS-VALTOKAPCSOLO-106-6):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KETTOS-VALTOKAPCSOLO-106-6).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KERESZTKAPCSOLO-107 – Keresztkapcsolás (106 + 107 + 106): egy lámpa három helyről

Forrás: content/tudastar/r3/keresztkapcsolo-107-bekotese.netlist.json (netlista), content/tudastar/diagramok/keresztkapcsolo-107.json (elrendezés); cikk: keresztkapcsolo-107-bekotese, abra-1 („Keresztkapcsolás: 106 + 107 + 106”)

Ábra-azonosító: keresztkapcsolo-107. Netlista-ujjlenyomat: 835f0537; ábra-ujjlenyomat: 3fafb965 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (8 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VIL-Q1–Q8) a(z) BEK-VIL-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-KERESZTKAPCSOLO-107-BEKOTESE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztkapcsoló bemenő párja (A1, A2) az előző, kimenő párja (B1, B2) a következő kapcsoló felé néz; a kapcsok elrendezése gyártónként eltér.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (keresztkapcsolo-107, ábra-ujjlenyomat 3fafb965).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: S1 – K1 (106, 1. hely); X1 – X1 (107, 2. hely); S2 – K2 (106, 3. hely). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (8 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

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
| BEK-KERESZTKAPCSOLO-107-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 835f0537, ábra 3fafb965 | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-VEZ | Vezetéktábla (16 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-SZAK | Szakaszok és érszám (5 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-ALL | Kapcsolóállás-táblázat (8 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-KERESZTKAPCSOLO-107):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KERESZTKAPCSOLO-107).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KERESZTKAPCSOLO-107-2X107 – Keresztkapcsolás (106 + 2 × 107 + 106): egy lámpa 4 helyről

Forrás: content/tudastar/r3/keresztkapcsolo-107-bekotese-2x107.netlist.json (netlista), content/tudastar/diagramok/keresztkapcsolo-107-2x107.json (elrendezés); cikk: keresztkapcsolo-107-bekotese, abra-1 („Keresztkapcsolás: 106 + 107 + 106”)

Ábra-azonosító: keresztkapcsolo-107-2x107. Netlista-ujjlenyomat: 9566473c; ábra-ujjlenyomat: 862239b0 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (16 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VIL-Q1–Q8) a(z) BEK-VIL-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-KERESZTKAPCSOLO-107-BEKOTESE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztkapcsoló bemenő párja (A1, A2) az előző, kimenő párja (B1, B2) a következő kapcsoló felé néz; a kapcsok elrendezése gyártónként eltér.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (keresztkapcsolo-107-2x107, ábra-ujjlenyomat 862239b0).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: S1 – K1 (106, 1. hely); X1 – X1 (107, 2. hely); X2 – X2 (107, 3. hely); S2 – K2 (106, 4. hely). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (16 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

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
| BEK-KERESZTKAPCSOLO-107-2X107-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 9566473c, ábra 862239b0 | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-2X107-VEZ | Vezetéktábla (20 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-2X107-SZAK | Szakaszok és érszám (6 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-2X107-ALL | Kapcsolóállás-táblázat (16 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-KERESZTKAPCSOLO-107-2X107):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KERESZTKAPCSOLO-107-2X107).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KERESZTKAPCSOLO-107-3X107 – Keresztkapcsolás (106 + 3 × 107 + 106): egy lámpa 5 helyről

Forrás: content/tudastar/r3/keresztkapcsolo-107-bekotese-3x107.netlist.json (netlista), content/tudastar/diagramok/keresztkapcsolo-107-3x107.json (elrendezés); cikk: keresztkapcsolo-107-bekotese, abra-1 („Keresztkapcsolás: 106 + 107 + 106”)

Ábra-azonosító: keresztkapcsolo-107-3x107. Netlista-ujjlenyomat: f9fd89d8; ábra-ujjlenyomat: 02bf7fb3 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (32 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VIL-Q1–Q8) a(z) BEK-VIL-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-KERESZTKAPCSOLO-107-BEKOTESE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztkapcsoló bemenő párja (A1, A2) az előző, kimenő párja (B1, B2) a következő kapcsoló felé néz; a kapcsok elrendezése gyártónként eltér.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (keresztkapcsolo-107-3x107, ábra-ujjlenyomat 02bf7fb3).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: S1 – K1 (106, 1. hely); X1 – X1 (107, 2. hely); X2 – X2 (107, 3. hely); X3 – X3 (107, 4. hely); S2 – K2 (106, 5. hely). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (32 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

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
| BEK-KERESZTKAPCSOLO-107-3X107-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista f9fd89d8, ábra 02bf7fb3 | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-3X107-VEZ | Vezetéktábla (24 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-3X107-SZAK | Szakaszok és érszám (7 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-3X107-ALL | Kapcsolóállás-táblázat (32 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-KERESZTKAPCSOLO-107-3X107):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KERESZTKAPCSOLO-107-3X107).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KERESZTKAPCSOLO-107-4X107 – Keresztkapcsolás (106 + 4 × 107 + 106): egy lámpa 6 helyről

Forrás: content/tudastar/r3/keresztkapcsolo-107-bekotese-4x107.netlist.json (netlista), content/tudastar/diagramok/keresztkapcsolo-107-4x107.json (elrendezés); cikk: keresztkapcsolo-107-bekotese, abra-1 („Keresztkapcsolás: 106 + 107 + 106”)

Ábra-azonosító: keresztkapcsolo-107-4x107. Netlista-ujjlenyomat: e67cbcc6; ábra-ujjlenyomat: aff64b7d (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (64 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VIL-Q1–Q8) a(z) BEK-VIL-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-KERESZTKAPCSOLO-107-BEKOTESE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Egy lehetséges, következetes érszín-kiosztás: barna = betáp fázis, fekete = kapcsolt fázis, szürke = váltóvezetékek (felirattal megkülönböztetve), kék = nullavezető, zöld-sárga = védővezető. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztkapcsoló bemenő párja (A1, A2) az előző, kimenő párja (B1, B2) a következő kapcsoló felé néz; a kapcsok elrendezése gyártónként eltér.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (keresztkapcsolo-107-4x107, ábra-ujjlenyomat aff64b7d).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: S1 – K1 (106, 1. hely); X1 – X1 (107, 2. hely); X2 – X2 (107, 3. hely); X3 – X3 (107, 4. hely); X4 – X4 (107, 5. hely); S2 – K2 (106, 6. hely). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (64 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

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
| BEK-KERESZTKAPCSOLO-107-4X107-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista e67cbcc6, ábra aff64b7d | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-4X107-VEZ | Vezetéktábla (28 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-4X107-SZAK | Szakaszok és érszám (8 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KERESZTKAPCSOLO-107-4X107-ALL | Kapcsolóállás-táblázat (64 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-KERESZTKAPCSOLO-107-4X107):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KERESZTKAPCSOLO-107-4X107).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-VED-KERDESEK – Dugalj, kismegszakító, FI-relé – közös kérdések

Forrás: lektori kérdéslista (content/tudastar/lektori-kerdesek-r3.md), „Dugalj, kismegszakító, FI-relé” szakasz

A témakör közös kérdései: a témakör minden ábrájára és cikkére vonatkoznak (ábrák: BEK-DUGALJ-ATHURKOLAS, BEK-DUGALJ-LEAGAZTATAS, BEK-KISMEGSZAKITO-ARAMKOROK, BEK-FI-RELE-BEKOTES, BEK-FI-RELE-HIBAHELYZETEK). A válaszokat a kérdések alatti mezőbe kérjük; a kérdések azonosítójára (BEK-VED-Q1…) a megjegyzésekben lehet hivatkozni.

**Kérdés a lektorhoz (BEK-VED-Q1).** Szóhasználat: a dugalj kikapcsolt állapota a táblákban „nem ad feszültséget”, nem „feszültségmentes” (lekapcsolt kismegszakító mellett a nullavezető a nullasínen marad). Elfogadja-e a lektor?

Válasz (BEK-VED-Q1):

**Kérdés a lektorhoz (BEK-VED-Q2).** Maradjon-e „A szerelés menete szakembernek” lépéssor a dugaljcikkben, amelyet laikus is olvashat, vagy kerüljön összecsukott, szakembernek szóló blokkba?

Válasz (BEK-VED-Q2):

**Kérdés a lektorhoz (BEK-VED-Q3).** A kismegszakító-cikk TT-mondata számok nélküli. Elfogadható-e így: „a testzárlati áram jellemzően a kismegszakító kioldásához is kicsi; ott az önműködő lekapcsolást is áram-védőkapcsoló végzi”?

Válasz (BEK-VED-Q3):

**Kérdés a lektorhoz (BEK-VED-Q4).** Új forráshivatkozások, a kiadást a lektor ellenőrizze: MSZ HD 60364-4-46 461.2 (a PEN nem kapcsolható) és MSZ HD 60364-5-54 543.4.3 (a szétválasztás után nincs újra-összekötés).

Válasz (BEK-VED-Q4):

**Kérdés a lektorhoz (BEK-VED-Q5).** FI-relé cikk: elfogadható-e a PEN-szakadásról („a FI nem érzékeli”) és a FI utáni N–PE összekötésről („romlik az érzékenység”) szóló megfogalmazás? Kell-e a próbaáramkörös esethez számérték (IΔn/2), vagy az IEC TS 60479-1 tartományai?

Válasz (BEK-VED-Q5):

**Kérdés a lektorhoz (BEK-VED-Q6).** A hibaáram-ábra modellfeltevései: emberi test 1 kΩ, talaj 10 Ω, testzárlat 5 Ω, próbaellenállás 10 kΩ, kioldási küszöb IΔn/2 = 15 mA. A szimuláció csak logikai összefüggést számol; a „kiold” cellák azt az esetet mutatják, amikor az áram eléri a kioldási értéket (ezt a cikk szövege is kimondja). Kérjük a feltevések jóváhagyását.

Válasz (BEK-VED-Q6):

☐ A blokk minden tétele egyezik (BEK-VED-KERDESEK).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-DUGALJ-ATHURKOLAS – Dugaljkör áthurkolással: két védőérintkezős dugalj FI-relé és kismegszakító után

Forrás: content/tudastar/r3/dugalj-bekotese.netlist.json (netlista), content/tudastar/diagramok/dugalj-athurkolas.json (elrendezés); cikk: dugalj-bekotese, abra-1 („Dugaljkör áthurkolással, FI-relé és kismegszakító után”)

Ábra-azonosító: dugalj-athurkolas. Netlista-ujjlenyomat: 9bb3ff8e; ábra-ujjlenyomat: 5ddcd826 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VED-Q1–Q6) a(z) BEK-VED-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-DUGALJ-BEKOTESE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Érszínek: barna = fázisvezető (L), kék = nullavezető (N), zöld-sárga = védővezető (PE). A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A betáp a lakáselosztó gyűjtősínjeit jelképezi (TN-C-S rendszer, a PEN szétválasztása a betáp előtt); a szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze (a szimulátor az ilyen kötést zárlatként elutasítja). A mérőhelyi és csatlakozási rész az elosztói engedélyes hatásköre, ezért itt nem szerepel. A keresztmetszet és a kismegszakító névleges árama méretezés kérdése (lib/sizing-tables.ts, jóváhagyásra vár), ezért az ábra nem ad számot. Áthurkolás: a továbbmenő vezetők a dugalj kapcsain mennek át (a kapocs két vezető befogására alkalmas kell legyen; ezt a gyártó adja meg).

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (dugalj-athurkolas, ábra-ujjlenyomat 5ddcd826).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé); F1 – F1 kismegszakító (dugaljkör). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

| Q1 | F1 | Eredmény (a szimuláció szerint) |
|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | X1 dugalj: feszültség alatt; X2 dugalj: feszültség alatt; Q1 FI-relé: nem old ki |
| be (bekapcsolva) | ki (kikapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | be (bekapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | ki (kikapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-DUGALJ-ATHURKOLAS-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 9bb3ff8e, ábra 5ddcd826 | ☐ | ☐ | |
| BEK-DUGALJ-ATHURKOLAS-VEZ | Vezetéktábla (11 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-DUGALJ-ATHURKOLAS-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-DUGALJ-ATHURKOLAS-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-DUGALJ-ATHURKOLAS):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-DUGALJ-ATHURKOLAS).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-DUGALJ-LEAGAZTATAS – Dugaljkör leágaztatással: két dugalj a kötődobozból, FI-relé és kismegszakító után

Forrás: content/tudastar/r3/dugalj-bekotese-leagaztatas.netlist.json (netlista), content/tudastar/diagramok/dugalj-leagaztatas.json (elrendezés); cikk: dugalj-bekotese, abra-2 („Dugaljkör leágaztatással, kötődobozból”)

Ábra-azonosító: dugalj-leagaztatas. Netlista-ujjlenyomat: 143d7450; ábra-ujjlenyomat: 42c9277a (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VED-Q1–Q6) a(z) BEK-VED-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-DUGALJ-BEKOTESE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Érszínek: barna = fázisvezető (L), kék = nullavezető (N), zöld-sárga = védővezető (PE). A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A betáp a lakáselosztó gyűjtősínjeit jelképezi (TN-C-S rendszer, a PEN szétválasztása a betáp előtt); a szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze (a szimulátor az ilyen kötést zárlatként elutasítja). A mérőhelyi és csatlakozási rész az elosztói engedélyes hatásköre, ezért itt nem szerepel. A keresztmetszet és a kismegszakító névleges árama méretezés kérdése (lib/sizing-tables.ts, jóváhagyásra vár), ezért az ábra nem ad számot. Leágaztatás: a kötődobozban szerepenként egy-egy kötőelem (L, N, PE) fogja össze a vezetőket, mindegyik dugaljhoz külön szakasz megy.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (dugalj-leagaztatas, ábra-ujjlenyomat 42c9277a).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé); F1 – F1 kismegszakító (dugaljkör). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

| Q1 | F1 | Eredmény (a szimuláció szerint) |
|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | X1 dugalj: feszültség alatt; X2 dugalj: feszültség alatt; Q1 FI-relé: nem old ki |
| be (bekapcsolva) | ki (kikapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | be (bekapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |
| ki (kikapcsolva) | ki (kikapcsolva) | X1 dugalj: nem ad feszültséget; X2 dugalj: nem ad feszültséget; Q1 FI-relé: nem old ki |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-DUGALJ-LEAGAZTATAS-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 143d7450, ábra 42c9277a | ☐ | ☐ | |
| BEK-DUGALJ-LEAGAZTATAS-VEZ | Vezetéktábla (14 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-DUGALJ-LEAGAZTATAS-SZAK | Szakaszok és érszám (3 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-DUGALJ-LEAGAZTATAS-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-DUGALJ-LEAGAZTATAS):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-DUGALJ-LEAGAZTATAS).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-KISMEGSZAKITO-ARAMKOROK – Két dugaljkör saját kismegszakítóval, közös FI-relé után

Forrás: content/tudastar/r3/kismegszakito.netlist.json (netlista), content/tudastar/diagramok/kismegszakito-aramkorok.json (elrendezés); cikk: kismegszakito, abra-2 („Két dugaljkör saját kismegszakítóval, közös FI-relé után”)

Ábra-azonosító: kismegszakito-aramkorok. Netlista-ujjlenyomat: 3bf085c5; ábra-ujjlenyomat: 85c98132 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (8 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VED-Q1–Q6) a(z) BEK-VED-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-KISMEGSZAKITO blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Érszínek: barna = fázisvezető (L), kék = nullavezető (N), zöld-sárga = védővezető (PE). A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A betáp a lakáselosztó gyűjtősínjeit jelképezi (TN-C-S rendszer, a PEN szétválasztása a betáp előtt); a szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze (a szimulátor az ilyen kötést zárlatként elutasítja). A mérőhelyi és csatlakozási rész az elosztói engedélyes hatásköre, ezért itt nem szerepel. A keresztmetszet és a kismegszakító névleges árama méretezés kérdése (lib/sizing-tables.ts, jóváhagyásra vár), ezért az ábra nem ad számot. A kismegszakítók táplálása fésűs sínnel vagy áthidalóval történik; az ábrán ez egy fázisvezetőként jelenik meg. A világítási áramkör ugyanígy kapcsolódik, csak a kismegszakító után kapcsoló és lámpa következik.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (kismegszakito-aramkorok, ábra-ujjlenyomat 85c98132).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé); F1 – F1 kismegszakító (nappali dugaljak); F2 – F2 kismegszakító (konyhai dugaljak). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (8 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

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
| BEK-KISMEGSZAKITO-ARAMKOROK-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 3bf085c5, ábra 85c98132 | ☐ | ☐ | |
| BEK-KISMEGSZAKITO-ARAMKOROK-VEZ | Vezetéktábla (12 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-KISMEGSZAKITO-ARAMKOROK-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-KISMEGSZAKITO-ARAMKOROK-ALL | Kapcsolóállás-táblázat (8 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-KISMEGSZAKITO-ARAMKOROK):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-KISMEGSZAKITO-ARAMKOROK).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FI-RELE-BEKOTES – Áram-védőkapcsoló (FI-relé) bekötése dugaljkör elé, próbagombbal

Forrás: content/tudastar/r3/aram-vedokapcsolo-fi-rele.netlist.json (netlista), content/tudastar/diagramok/fi-rele-bekotes.json (elrendezés); cikk: aram-vedokapcsolo-fi-rele, abra-2 („Áram-védőkapcsoló bekötése dugaljkör elé, próbagombbal”)

Ábra-azonosító: fi-rele-bekotes. Netlista-ujjlenyomat: 8f0e1c8c; ábra-ujjlenyomat: 0d32d689 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (8 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VED-Q1–Q6) a(z) BEK-VED-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-ARAM-VEDOKAPCSOLO-FI-RELE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Érszínek: barna = fázisvezető (L), kék = nullavezető (N), zöld-sárga = védővezető (PE). A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A betáp a lakáselosztó gyűjtősínjeit jelképezi (TN-C-S rendszer, a PEN szétválasztása a betáp előtt); a szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze (a szimulátor az ilyen kötést zárlatként elutasítja). A mérőhelyi és csatlakozási rész az elosztói engedélyes hatásköre, ezért itt nem szerepel. A keresztmetszet és a kismegszakító névleges árama méretezés kérdése (lib/sizing-tables.ts, jóváhagyásra vár), ezért az ábra nem ad számot. A próbagomb és a próbaellenállás a FI-relé házán belül van („belső” kapcsolat, nem szerelt ér); a próbaáramkör pontos kialakítása gyártónként eltér, az elv azonos: a próbaáram az összegáramváltót csak az egyik póluson kerüli meg.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (fi-rele-bekotes, ábra-ujjlenyomat 0d32d689).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé); T1 – Q1 próbagomb (T); F1 – F1 kismegszakító (dugaljkör). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (8 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

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
| BEK-FI-RELE-BEKOTES-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 8f0e1c8c, ábra 0d32d689 | ☐ | ☐ | |
| BEK-FI-RELE-BEKOTES-VEZ | Vezetéktábla (11 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FI-RELE-BEKOTES-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FI-RELE-BEKOTES-ALL | Kapcsolóállás-táblázat (8 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-FI-RELE-BEKOTES):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FI-RELE-BEKOTES).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FI-RELE-HIBAHELYZETEK – Mikor old ki a FI-relé? Testzárlat, fázis–föld és fázis–nulla érintés

Forrás: content/tudastar/r3/aram-vedokapcsolo-fi-rele-hibahelyzetek.netlist.json (netlista), content/tudastar/diagramok/fi-rele-hibahelyzetek.json (elrendezés); cikk: aram-vedokapcsolo-fi-rele, abra-3 („Hibahelyzetek: testzárlat, fázis–föld és fázis–nulla érintés”)

Ábra-azonosító: fi-rele-hibahelyzetek. Netlista-ujjlenyomat: 704b52c6; ábra-ujjlenyomat: 51b5b201 (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (8 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-VED-Q1–Q6) a(z) BEK-VED-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-ARAM-VEDOKAPCSOLO-FI-RELE blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Érszínek: barna = fázisvezető (L), kék = nullavezető (N), zöld-sárga = védővezető (PE). A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A betáp a lakáselosztó gyűjtősínjeit jelképezi (TN-C-S rendszer, a PEN szétválasztása a betáp előtt); a szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze (a szimulátor az ilyen kötést zárlatként elutasítja). A mérőhelyi és csatlakozási rész az elosztói engedélyes hatásköre, ezért itt nem szerepel. A keresztmetszet és a kismegszakító névleges árama méretezés kérdése (lib/sizing-tables.ts, jóváhagyásra vár), ezért az ábra nem ad számot. A hibahely és az érintés jelképes elem (impedancia), nem szerelt vezeték. A Q1 és az F1 végig bekapcsolt; a táblázat a hiba pillanatát mutatja, a kioldás előtt. A föld (talaj) a betáp csillagpontján át visszavezető potenciál.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (fi-rele-hibahelyzetek, ábra-ujjlenyomat 51b5b201).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé); F1 – F1 kismegszakító (dugaljkör); H1 – H1 testzárlat a mosógépben (fázis → fémház); P1 – P1 érintés: fázis és föld; P2 – P2 érintés: fázis és nulla, a földtől elszigetelve. Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (8 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

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
| BEK-FI-RELE-HIBAHELYZETEK-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 704b52c6, ábra 51b5b201 | ☐ | ☐ | |
| BEK-FI-RELE-HIBAHELYZETEK-VEZ | Vezetéktábla (11 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FI-RELE-HIBAHELYZETEK-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FI-RELE-HIBAHELYZETEK-ALL | Kapcsolóállás-táblázat (8 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-FI-RELE-HIBAHELYZETEK):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FI-RELE-HIBAHELYZETEK).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FOLD-KERDESEK – Földelési rendszerek és EPH – közös kérdések

Forrás: lektori kérdéslista (content/tudastar/lektori-kerdesek-r3.md), „Földelési rendszerek, EPH, feszültségmentesítés” szakasz

A témakör közös kérdései: a témakör minden ábrájára és cikkére vonatkoznak (ábrák: BEK-FOLDELES-TN-C, BEK-FOLDELES-TN-S, BEK-FOLDELES-TN-C-S, BEK-FOLDELES-TT, BEK-FOLDELES-IT, BEK-EPH-ALAPOK). A válaszokat a kérdések alatti mezőbe kérjük; a kérdések azonosítójára (BEK-FOLD-Q1…) a megjegyzésekben lehet hivatkozni.

**Kérdés a lektorhoz (BEK-FOLD-Q1).** Elfogadható-e az érintési kategória neve és szövege („veszélyes lehet, tartósan; a FI-relé legfeljebb a testen átfolyó áramra old ki”) a TT-rendszer, szakadt földelővezető esetére? Kell-e konkrét kioldási áramértéket (30 mA vagy 300 mA) közölni forrással, vagy elég a szám nélküli „nagyobb kioldási áramú (például tűzvédelmi célú)” megfogalmazás?

Válasz (BEK-FOLD-Q1):

**Kérdés a lektorhoz (BEK-FOLD-Q2).** A PEN szétválasztásának helye a cikkben nyitva van („mérőhely vagy az azt követő első elosztó”, az engedélyes előírása szerint). Melyik a hazai szabály (MSZ 447 vagy engedélyesi szabályzat), és mi a pontszám?

Válasz (BEK-FOLD-Q2):

**Kérdés a lektorhoz (BEK-FOLD-Q3).** Az IT-szakasz két állítása helytálló-e így: az első hiba után a többi fázis a földhöz képest vonali feszültségre kerülhet, és a szórt kapacitáson át kis áram folyik?

Válasz (BEK-FOLD-Q3):

**Kérdés a lektorhoz (BEK-FOLD-Q4).** A csillagpont-eltolódásos túlfeszültség (háromfázisú hálózatban, nullavezető-szakadáskor) a TN-S szakaszban szerepel, holott minden TN-rendszerre igaz. Maradjon itt, vagy kerüljön külön cikkbe (nullavezető-szakadás / feszültségfigyelő relé)?

Válasz (BEK-FOLD-Q4):

**Kérdés a lektorhoz (BEK-FOLD-Q5).** A TN-C-S szakasz szerint közös hálózati PEN szakadásakor a saját főkapcsoló lekapcsolása sem szünteti meg biztosan a veszélyt. Megfelelő-e ez a laikusnak szóló „Mikor hívj szakembert?” tanácsokkal együtt (főkapcsoló, fémrészek kerülése, azonnali jelzés az engedélyesnek)?

Válasz (BEK-FOLD-Q5):

**Kérdés a lektorhoz (BEK-FOLD-Q6).** A feszültségmentesítés-cikk „Villamos berendezésen dolgozni csak feszültségmentes állapotban szabad” mondata szigorúbb a valóságnál, mert a feszültség alatti munka külön képesítéssel engedélyezett. Maradjon a konzervatív megfogalmazás, vagy kapjon szűkítést? Szerepeljen-e kifejezetten, hogy a multiméter nem helyettesíti az MSZ EN 61243-3 szerinti kétpólusú feszültségvizsgálót?

Válasz (BEK-FOLD-Q6):

**Kérdés a lektorhoz (BEK-FOLD-Q7).** Az EPH-cikk figyelmeztet, hogy a fém cső átvágásakor vagy az EPH-vezető bontásakor a két vég között életveszélyes feszültség lehet. Ideiglenes áthidaló vezetékre vonatkozó eljárást szándékosan nem ír le, mert munkautasítás lenne. Kell-e ennél több, vagy elég a „szakember vizsgálja meg előtte”?

Válasz (BEK-FOLD-Q7):

**Kérdés a lektorhoz (BEK-FOLD-Q8).** A TN-S ábra összehasonlító táblájának N-szakadás sorában „érintés: nincs” áll, mert az érintés csak a fémházra vonatkozik; ezt a táblázat bevezetője kimondja. Elég-e ez, vagy a táblában is jelezni kell a nullavezető veszélyét?

Válasz (BEK-FOLD-Q8):

**Kérdés a lektorhoz (BEK-FOLD-Q9).** A feszültségmentesítés-cikk „Miért kell öt lépés?” bekezdése szerint az öt lépés közül „egyik sem hagyható ki”, a 4. lépés (földelés és rövidrezárás) viszont csak „ahol előírt vagy szükséges” kötelező (kisfeszültségen a munka irányítója dönt), az 5. (letakarás) pedig csak akkor, ha a közelben feszültség alatt maradó rész van. Javaslat: „…ezért a sorrend nem cserélhető fel; a földelés és rövidrezárás, illetve a letakarás ott kötelező, ahol előírt vagy a körülmények miatt szükséges.” Elfogadja-e a lektor ezt a megfogalmazást?

Válasz (BEK-FOLD-Q9):

☐ A blokk minden tétele egyezik (BEK-FOLD-KERDESEK).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FOLDELES-TN-C – TN-C rendszer: a PEN-vezető a fogyasztóig fut

Forrás: content/tudastar/r3/foldelesi-rendszerek-tn-c.netlist.json (netlista), content/tudastar/diagramok/foldeles-tn-c.json (elrendezés); cikk: foldelesi-rendszerek, abra-1 („TN-C rendszer”)

Ábra-azonosító: foldeles-tn-c. Netlista-ujjlenyomat: 742e564d; ábra-ujjlenyomat: fc6fb08c (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-FOLD-Q1–Q9) a(z) BEK-FOLD-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-FOLDELESI-RENDSZEREK blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt. A régi, kéteres („nullázott”) berendezésekre jellemző felépítés; új berendezés így nem készül.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (foldeles-tn-c, ábra-ujjlenyomat fc6fb08c).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: F1 – F1 túláramvédelem (kismegszakító vagy olvadóbiztosító); H1 – H1 testzárlat M1-ben (fázis → fémház); SZ – SZ PEN-szakadás a hálózatban. Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

| F1 | H1 | SZ | Eredmény (a szimuláció szerint) |
|---|---|---|---|
| be (bekapcsolva) | nincs | ép | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | nincs | szakadt | M1 fogyasztó: nem működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Érintés – M1 fémháza és a föld: veszélyes lehet, tartósan |
| be (bekapcsolva) | fennáll | ép | M1 fogyasztó: működik; H1: hibaáram útja: fémes hurok; F1 túláramvédelem: lekapcsolhat; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |
| be (bekapcsolva) | fennáll | szakadt | M1 fogyasztó: nem működik; H1: hibaáram útja: nincs zárt hurok; F1 túláramvédelem: nem kapcsol le; Érintés – M1 fémháza és a föld: veszélyes lehet, tartósan |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FOLDELES-TN-C-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 742e564d, ábra fc6fb08c | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-VEZ | Vezetéktábla (7 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-FOLDELES-TN-C):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FOLDELES-TN-C).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FOLDELES-TN-S – TN-S rendszer: külön nulla- és védővezető a táppontól

Forrás: content/tudastar/r3/foldelesi-rendszerek-tn-s.netlist.json (netlista), content/tudastar/diagramok/foldeles-tn-s.json (elrendezés); cikk: foldelesi-rendszerek, abra-2 („TN-S rendszer”)

Ábra-azonosító: foldeles-tn-s. Netlista-ujjlenyomat: 816da23b; ábra-ujjlenyomat: 916b312b (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-FOLD-Q1–Q9) a(z) BEK-FOLD-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-FOLDELESI-RENDSZEREK blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (foldeles-tn-s, ábra-ujjlenyomat 916b312b).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé), kétpólusú; F1 – F1 kismegszakító (túláramvédelem); H1 – H1 testzárlat M1-ben (fázis → fémház); SZ – SZ nullavezető-szakadás a hálózatban. Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

| Q1 | F1 | H1 | SZ | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | nincs | ép | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | nincs | szakadt | M1 fogyasztó: nem működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | ép | M1 fogyasztó: működik; H1: hibaáram útja: fémes hurok; F1 túláramvédelem: lekapcsolhat; Q1 FI-relé: kiold; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | szakadt | M1 fogyasztó: nem működik; H1: hibaáram útja: fémes hurok; F1 túláramvédelem: lekapcsolhat; Q1 FI-relé: kiold; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FOLDELES-TN-S-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 816da23b, ábra 916b312b | ☐ | ☐ | |
| BEK-FOLDELES-TN-S-VEZ | Vezetéktábla (9 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-S-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-S-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-FOLDELES-TN-S):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FOLDELES-TN-S).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FOLDELES-TN-C-S – TN-C-S rendszer: PEN a szétválasztási pontig, utána külön N és PE

Forrás: content/tudastar/r3/foldelesi-rendszerek-tn-c-s.netlist.json (netlista), content/tudastar/diagramok/foldeles-tn-c-s.json (elrendezés); cikk: foldelesi-rendszerek, abra-3 („TN-C-S rendszer és a PEN szétválasztása”)

Ábra-azonosító: foldeles-tn-c-s. Netlista-ujjlenyomat: bff6a9cd; ábra-ujjlenyomat: 86f15a2d (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-FOLD-Q1–Q9) a(z) BEK-FOLD-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-FOLDELESI-RENDSZEREK blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt. A szétválasztási pont helyét és kialakítását az elosztói engedélyes előírásai határozzák meg.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (foldeles-tn-c-s, ábra-ujjlenyomat 86f15a2d).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé), kétpólusú; F1 – F1 kismegszakító (túláramvédelem); H1 – H1 testzárlat M1-ben (fázis → fémház); SZ – SZ PEN-szakadás a hálózatban vagy a csatlakozó vezetékben. Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

| Q1 | F1 | H1 | SZ | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | nincs | ép | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | nincs | szakadt | M1 fogyasztó: rendellenesen (a földön át); H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: veszélyes lehet, tartósan |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | ép | M1 fogyasztó: működik; H1: hibaáram útja: fémes hurok; F1 túláramvédelem: lekapcsolhat; Q1 FI-relé: kiold; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | szakadt | M1 fogyasztó: rendellenesen (a földön át); H1: hibaáram útja: a földön át; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: kiold; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FOLDELES-TN-C-S-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista bff6a9cd, ábra 86f15a2d | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-S-VEZ | Vezetéktábla (9 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-S-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TN-C-S-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-FOLDELES-TN-C-S):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FOLDELES-TN-C-S).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FOLDELES-TT – TT rendszer: a fémház a saját földelőn

Forrás: content/tudastar/r3/foldelesi-rendszerek-tt.netlist.json (netlista), content/tudastar/diagramok/foldeles-tt.json (elrendezés); cikk: foldelesi-rendszerek, abra-4 („TT rendszer”)

Ábra-azonosító: foldeles-tt. Netlista-ujjlenyomat: 553eca92; ábra-ujjlenyomat: e3d263ee (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-FOLD-Q1–Q9) a(z) BEK-FOLD-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-FOLDELESI-RENDSZEREK blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (foldeles-tt, ábra-ujjlenyomat e3d263ee).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé), kétpólusú; F1 – F1 kismegszakító (túláramvédelem); H1 – H1 testzárlat M1-ben (fázis → fémház); SZ – SZ a védőföldelő vezetőjének szakadása. Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

| Q1 | F1 | H1 | SZ | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | nincs | ép | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | nincs | szakadt | M1 fogyasztó: működik; H1: hibaáram útja: nincs hiba; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | ép | M1 fogyasztó: működik; H1: hibaáram útja: a földön át; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: kiold; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | szakadt | M1 fogyasztó: működik; H1: hibaáram útja: nincs zárt hurok; F1 túláramvédelem: nem kapcsol le; Q1 FI-relé: nem old ki; Érintés – M1 fémháza és a föld: veszélyes lehet, tartósan; a FI-relé legfeljebb a testen átfolyó áramra old ki |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FOLDELES-TT-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 553eca92, ábra e3d263ee | ☐ | ☐ | |
| BEK-FOLDELES-TT-VEZ | Vezetéktábla (8 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TT-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-TT-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-FOLDELES-TT):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FOLDELES-TT).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-FOLDELES-IT – IT rendszer: földeletlen táppont, földelt fémházak

Forrás: content/tudastar/r3/foldelesi-rendszerek-it.netlist.json (netlista), content/tudastar/diagramok/foldeles-it.json (elrendezés); cikk: foldelesi-rendszerek, abra-5 („IT rendszer”)

Ábra-azonosító: foldeles-it. Netlista-ujjlenyomat: 3723d185; ábra-ujjlenyomat: 22bba2ea (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-FOLD-Q1–Q9) a(z) BEK-FOLD-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-FOLDELESI-RENDSZEREK blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt. IT-rendszer jellemzően saját transzformátorral készül (például ipari üzemben vagy kórházi helyiségben); a nullavezetőt itt nem vezetik ki. A szigetelésfigyelő megfigyelő elem: a szimulációban nem vezet.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (foldeles-it, ábra-ujjlenyomat 22bba2ea).

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

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: Q1 – Q1 háromfázisú kismegszakító (M1); Q2 – Q2 háromfázisú kismegszakító (M2); H1 – H1 testzárlat M1-ben (L1 → fémház); H2 – H2 testzárlat M2-ben (L3 → fémház). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (4 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

| Q1 | Q2 | H1 | H2 | Eredmény (a szimuláció szerint) |
|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | nincs | nincs | M1 fogyasztó: működik; M2 fogyasztó: működik; H1: hibaáram útja: nincs hiba; H2: hibaáram útja: nincs hiba; Q1 túláramvédelem: nem kapcsol le; Q2 túláramvédelem: nem kapcsol le; SZF szigetelésfigyelő: nem jelez; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | nincs | fennáll | M1 fogyasztó: működik; M2 fogyasztó: működik; H1: hibaáram útja: nincs hiba; H2: hibaáram útja: nincs zárt hurok; Q1 túláramvédelem: nem kapcsol le; Q2 túláramvédelem: nem kapcsol le; SZF szigetelésfigyelő: jelez; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | nincs | M1 fogyasztó: működik; M2 fogyasztó: működik; H1: hibaáram útja: nincs zárt hurok; H2: hibaáram útja: nincs hiba; Q1 túláramvédelem: nem kapcsol le; Q2 túláramvédelem: nem kapcsol le; SZF szigetelésfigyelő: jelez; Érintés – M1 fémháza és a föld: nincs veszély |
| be (bekapcsolva) | be (bekapcsolva) | fennáll | fennáll | M1 fogyasztó: működik; M2 fogyasztó: működik; H1: hibaáram útja: fémes hurok; H2: hibaáram útja: fémes hurok; Q1 túláramvédelem: lekapcsolhat; Q2 túláramvédelem: lekapcsolhat; SZF szigetelésfigyelő: jelez; Érintés – M1 fémháza és a föld: veszélyes lehet a lekapcsolásig |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| BEK-FOLDELES-IT-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista 3723d185, ábra 22bba2ea | ☐ | ☐ | |
| BEK-FOLDELES-IT-VEZ | Vezetéktábla (17 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-IT-SZAK | Szakaszok és érszám (2 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-FOLDELES-IT-ALL | Kapcsolóállás-táblázat (4 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-FOLDELES-IT):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-FOLDELES-IT).

Megjegyzés a blokkhoz (forrás, kiadás):

### BEK-EPH-ALAPOK – Egyenpotenciálra hozás: a fő EPH-sín és a vízvezeték bekötése (TN-C-S)

Forrás: content/tudastar/r3/egyenpotencialra-hozas-eph.netlist.json (netlista), content/tudastar/diagramok/eph-alapok.json (elrendezés); cikk: egyenpotencialra-hozas-eph, abra-1 („A fő EPH-sín és a vízvezeték bekötése”)

Ábra-azonosító: eph-alapok. Netlista-ujjlenyomat: d8926fe6; ábra-ujjlenyomat: 217145db (netlista, elrendezés, szimbólumkészlet, rajzoló kód, ábraszínek). A rajz, a vezeték-, a szakasz- és a kapcsolóállás-táblázat ugyanabból a netlistából készül (a netlista tartalmát az 1–3. táblázat adja; a fájlt a lektor nem kapja). Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (8 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

A témakör közös kérdései (BEK-FOLD-Q1–Q9) a(z) BEK-FOLD-KERDESEK blokkban állnak; a cikk saját kérdései az 5. részben, a(z) CIK-EGYENPOTENCIALRA-HOZAS-EPH blokkban.

A netlista megjegyzése: Tervezet a szakmai lektornak (R3). Elvi rajz: a táppont az elosztói engedélyes transzformátora, a hálózat és a csatlakozás az elosztói engedélyes hatásköre; a rajz nem szerelési utasítás. A kapocsjelölés gyártónként eltérhet; a gyártói útmutató az irányadó. A keresztmetszet, a túláramvédelem névleges árama és a földelési ellenállás méretezés kérdése, ezért az ábra nem ad számot. A hibahely (testzárlat) és az érintési pont jelképes, nem szerelt vezeték. A táblázat a hiba fennállásának pillanatát mutatja, a lekapcsolás előtt. A fém vízvezeték az épületbe a talajból lép be, ezért a szimulációban a talajjal is érintkezik. A gázvezeték bekötését az elosztói és a gázszolgáltatói előírások szabályozzák; az ábra nem mutatja.

**Ábra.** A bekötési rajz (Bekötés nézet, alapállás) a PDF-változatban, vektorosan; a program a cikkben ugyanezt rajzolja (eph-alapok, ábra-ujjlenyomat 217145db).

**Jelmagyarázat:** FV – földelővezető (zöld-sárga); L1 – L1 fázis (barna); PEN – PEN-vezető (védő- és nullavezető) (zöld-sárga); N – nullavezető (kék); PE – védővezető (zöld-sárga); EPH – EPH-vezető (egyenpotenciálra hozó) (zöld-sárga); L – fázis (barna); jelképes hibahely (nem szerelt ér).

**1. táblázat – vezetéktábla.**

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PEN) | RB üzemi földelő (a csillagpont földelése): földelőkapocs | földelővezető | zöld-sárga | a táppontnál |
| 2 | T1 elosztói transzformátor, kisfeszültségű tekercs: L1 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 1 (fázis, táp oldal) | L1 | barna | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 3 | T1 elosztói transzformátor, kisfeszültségű tekercs: csillagpont (PEN) | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): PEN (érkező) | PEN | zöld-sárga | Elosztói hálózat és csatlakozás (az engedélyes hatásköre) |
| 4 | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): N-sín | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (táp oldal) | N | kék | elosztón belül |
| 5 | PSZ PEN-szétválasztási pont (PE-sín és N-sín, összekötő híddal): PE-sín | Fő EPH-sín (főföldelő sín): fő védővezető (érkező) | PE (fő védővezető) | zöld-sárga | elosztón belül |
| 6 | Fő EPH-sín (főföldelő sín): földelővezető az RA-hoz | RA alapföldelő: földelőkapocs | földelővezető | zöld-sárga | elosztón belül |
| 7 | Fő EPH-sín (főföldelő sín): EPH-vezető a vízvezetékhez | VIZ fém vízvezeték (idegen vezetőképes rész): csőbilincs (EPH-kötés) | EPH-vezető | zöld-sárga | Fő EPH-vezető a vízvezetékhez |
| 8 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: 2 (fázis, védett oldal) | F1 kismegszakító (túláramvédelem): 1 (be) | L | barna | elosztón belül |
| 9 | F1 kismegszakító (túláramvédelem): 2 (ki) | M1 fémházas mosógép (I. érintésvédelmi osztály): L | L | barna | Fogyasztói áramkör |
| 10 | Q1 áram-védőkapcsoló (FI-relé), kétpólusú: N (védett oldal) | M1 fémházas mosógép (I. érintésvédelmi osztály): N | N | kék | Fogyasztói áramkör |
| 11 | Fő EPH-sín (főföldelő sín): védővezető a fogyasztóhoz | M1 fémházas mosógép (I. érintésvédelmi osztály): fémház (PE) | PE | zöld-sárga | Fogyasztói áramkör |

**2. táblázat – szakaszok és érszám.**

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztói hálózat és csatlakozás (az engedélyes hatásköre) | L1 (barna), PEN (zöld-sárga) | 2 |
| Fogyasztói áramkör | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Fő EPH-vezető a vízvezetékhez | EPH-vezető (zöld-sárga) | 1 |

**3. táblázat – kapcsolóállás-táblázat.** Oszlopok: Q1 – Q1 áram-védőkapcsoló (FI-relé), kétpólusú; F1 – F1 kismegszakító (túláramvédelem); H1 – H1 testzárlat M1-ben (fázis → fémház); EPH1 – EPH1 a vízvezeték EPH-bekötése; SZ – SZ PEN-szakadás a hálózatban. Gépi ellenőrzés: a Python-referenciaszimulátor és annak TypeScript-átirata azonos eredményt ad (8 állás: kimenetek, invariánsok, vezetéktábla; referencia: sim.py 7c3de997, foldeles_ext.py 1627bedd, vedelmek_biztonsag.py a32aafae) – ez az átirat hűségét igazolja, a modell és a bekötés szakmai helyességét nem.

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
| BEK-EPH-ALAPOK-RAJZ | Bekötési rajz (Bekötés nézet, alapállás): kapcsok, erek, érszínek és feliratok | az ábra fent · netlista d8926fe6, ábra 217145db | ☐ | ☐ | |
| BEK-EPH-ALAPOK-VEZ | Vezetéktábla (11 ér): honnan, hová, vezető, szín, szakasz | lent, 1. táblázat | ☐ | ☐ | |
| BEK-EPH-ALAPOK-SZAK | Szakaszok és érszám (3 szakasz) | lent, 2. táblázat | ☐ | ☐ | |
| BEK-EPH-ALAPOK-ALL | Kapcsolóállás-táblázat (8 állás): kapcsolók, hibahelyzetek, eredmény | lent, 3. táblázat | ☐ | ☐ | |

**Döntés (BEK-EPH-ALAPOK):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (BEK-EPH-ALAPOK).

Megjegyzés a blokkhoz (forrás, kiadás):

## 5. rész – Biztonsági cikkek (R3) – a cikkvázlatok szövege

A Villanyszerelő Tudástár biztonságkritikus (R3) cikkei közül ide kerül minden vázlat, amelyet szakmai lektor és második olvasó jóváhagyása nélkül a program nem tesz közzé. A cikk szövegét (a nem zárható felső veszély-doboztól a forrásokig) is a lektor hagyja jóvá: ezért a teljes szöveg itt áll, tartalmi ujjlenyomattal; a Jóváhagyó lap „5. rész – cikkenkénti döntés” táblázata a jóváhagyást ehhez az ujjlenyomathoz köti.

A cikkvázlatok nem a végső megjelenésükben, hanem folyó szövegként szerepelnek (a szöveg, a táblák és a források azonosak a cikkben megjelenővel; az ábrák a 4. részben vannak). A táblázatok „Kapcsolóállás-táblázat” jellegű részeit a szimulátor számolta (a 4. rész blokkjaiban is megtalálhatók). A veszély-doboz szövege a figyelmeztetések közös szövegével szó szerint azonos.

Négy cikk kiadásához a szöveg jóváhagyásán túl még elem hiányzik (a blokk bevezetője megnevezi); ezek szövege is jóváhagyható, de a cikk csak a hiány pótlása után jelenhet meg. Cikkenként a tartalmi ujjlenyomatot, a lektor jogosultságát, a dátumot, a jóváhagyás hivatkozását és a második olvasót a Tudástár lektori rekordja rögzíti (docs/lektoralas.md); a rekord hiányosan nem tesz közzé semmit.

A kiadáshoz a szövegen túl hiányzik: aram-vedokapcsolo-fi-rele – az összegáramváltó elvét mutató ábra még nincs kész; feszultsegmentesites-ot-szabalya – a folyamatábra (az öt lépés) még nincs kész; kismegszakito – a jelleggörbe-ábra (B/C/D kioldási tartományok) még nincs kész; vilagitasi-kapcsolasok – az áttekintő ábra a tervező szerelési rajzára épülne (Szerelési rajz nézet, még nincs kész).

### CIK-ARAM-VEDOKAPCSOLO-FI-RELE – Áram-védőkapcsoló (FI-relé): működés, 30 mA, típusok, próbagomb

Forrás: content/tudastar/r3/aram-vedokapcsolo-fi-rele.md (cikkvázlat); azonosító: aram-vedokapcsolo-fi-rele

Tartalmi ujjlenyomat: b14c8c33 (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Hogyan érzékeli a FI-relé a hibaáramot, mit jelent a 30 mA, miben különbözik az AC, A, F és B típus, mire jó a próbagomb, és mi ellen nem véd?

A cikk kiadásához a szöveg jóváhagyásán túl még hiányzik: az összegáramváltó elvét mutató ábra még nincs kész. A szöveg ettől függetlenül jóváhagyható; a cikk csak a hiány pótlása és az új jóváhagyás után jelenhet meg.

Ábrák: BEK-FI-RELE-BEKOTES, BEK-FI-RELE-HIBAHELYZETEK (4. rész) – az ábrák és a cikk szövege együtt hagyható jóvá.

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: Az áram-védőkapcsoló (FI-relé) összeveti az áramkörbe befolyó és az onnan visszatérő áramot, és ha a különbség eléri az érzékenységét, a fázis- és a nullavezetőt is lekapcsolja. A 30 mA-es készülék kiegészítő védelmet ad áramütés ellen: kiold, ha valakin át a fázisból a föld felé elegendő áram folyik; az áramütést nem akadályozza meg, csak az időtartamát korlátozza. A fázis és a nulla egyidejű érintésétől, a túlterheléstől és a rövidzárlattól viszont nem véd.

*Ábra (abra-1): Az összegáramváltó elve (sematikus) – ez az ábra még nincs kész (a cikk kiadását akadályozza)*

#### Hogyan működik?

A fázis- és a nullavezető együtt halad át egy gyűrű alakú vasmagon, az összegáramváltón. Hibátlan áramkörben a befolyó és a visszatérő áram egyenlő és ellentétes irányú, így mágneses hatásuk kioltja egymást. Ha az áram egy része más úton tér vissza, a védővezetőn, a földön vagy egy emberen keresztül, különbség marad. Ez a vasmag tekercsében feszültséget kelt, amely a kioldót működteti. A négypólusú (háromfázisú) készülékben mind a négy vezető (L1, L2, L3, N) áthalad a vasmagon, és az áramok összege számít.

A névleges különbözeti áram (IΔn) az érzékenységet adja meg: minél kisebb, annál érzékenyebb a készülék. Ennek felénél még nem, a névleges értéknél már biztosan kiold. Általános (késleltetés nélküli) kivitelnél a kioldási idő IΔn-nél legfeljebb 0,3 s, ötszörösénél legfeljebb 0,04 s. A szelektív (S jelű) változat szándékosan késleltetve old ki. A FI-relé tehát nem az áram nagyságát, hanem az áramütés időtartamát korlátozza.

#### Bekötés és próbagomb

A lakáselosztóban a kétpólusú áram-védőkapcsoló táp oldalára a betáp fázis- és nullavezetője kerül. A védett oldali fázisról indulnak a kismegszakítók, a védett oldali nullavezető pedig egy külön nullasínre kerül. Erre a sínre csak az általa védett áramkörök nullavezetője köthető. A védővezető nem halad át a készüléken. A védett oldalon a nullavezető sehol nem érintkezhet a védővezetővel vagy a földdel: az ilyen kötés terheléskor kioldást okoz, és amíg nem old ki, a hibaáram egy része a nullavezetőn, a vasmagon át tér vissza, vagyis a védelem érzékenysége romlik.

*Ábra (abra-2): Áram-védőkapcsoló bekötése dugaljkör elé, próbagombbal – a rajz a 4. részben: BEK-FI-RELE-BEKOTES*

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

A próbagomb a készülék belsejében egy ellenálláson át az egyik pólus védett oldalát a másik pólus táp oldalával köti össze; az ábrán a védett oldali fázist a táp oldali nullával, a pontos kialakítás gyártónként eltér. A próbaáram így csak az egyik póluson halad át a vasmagon: különbözeti áramot hoz létre, és a készülék kiold, a kismegszakító állásától függetlenül. A táblázat a gomb megnyomásának pillanatát mutatja; a kioldás után a védett áramkörök nem kapnak táplálást, ez azonban nem feszültségmentesítés.

| Q1 áram-védőkapcsoló (FI-relé) | Q1 próbagomb (T) | F1 kismegszakító (dugaljkör) | M1 mosógép | X1 dugalj | Q1 áram-védőkapcsoló (FI-relé): kiold? |
|---|---|---|---|---|---|
| be (bekapcsolva) | nyugalom (nincs megnyomva) | be (bekapcsolva) | működik | feszültség alatt | nem old ki |
| be (bekapcsolva) | nyugalom (nincs megnyomva) | ki (kikapcsolva) | nem működik | nem ad feszültséget | nem old ki |
| be (bekapcsolva) | megnyomva | be (bekapcsolva) | működik | feszültség alatt | kiold |
| be (bekapcsolva) | megnyomva | ki (kikapcsolva) | nem működik | nem ad feszültséget | kiold |
| ki (kikapcsolva) | nyugalom (nincs megnyomva) | be (bekapcsolva) | nem működik | nem ad feszültséget | nem old ki |
| ki (kikapcsolva) | nyugalom (nincs megnyomva) | ki (kikapcsolva) | nem működik | nem ad feszültséget | nem old ki |
| ki (kikapcsolva) | megnyomva | be (bekapcsolva) | nem működik | nem ad feszültséget | nem old ki |
| ki (kikapcsolva) | megnyomva | ki (kikapcsolva) | nem működik | nem ad feszültséget | nem old ki |

A táblázatot a szimulátor számolta a(z) fi-rele-bekotes netlistából (ujjlenyomat: 8f0e1c8c): 8 állapotkombináció, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig és védőérintkezőig folytonos, és nem halad át kapcsolón; a kismegszakító csak a fázist bontja; minden dugalj kismegszakítón és áram-védőkapcsolón át kap feszültséget; a nullavezetőt csak a kétpólusú áram-védőkapcsoló bontja, a fázisvezetővel együtt; normál üzemben (hibahelyzet, érintés és próbagomb nélkül) nem folyik különbözeti áram. „Kiold”: a védett oldalról a pólusokat megkerülve (a védővezetőn, a földön vagy a próbaellenálláson át) áram folyik; áramerősséget, érintési feszültséget és kioldási időt a szimuláció nem számol.

#### Mikor old ki, és mikor nem?

*Ábra (abra-3): Hibahelyzetek: testzárlat, fázis–föld és fázis–nulla érintés – a rajz a 4. részben: BEK-FI-RELE-HIBAHELYZETEK*

| H1 testzárlat a mosógépben (fázis → fémház) | P1 érintés: fázis és föld | P2 érintés: fázis és nulla, a földtől elszigetelve | H1: hibaáram | P1: áram a testen át | P2: áram a testen át | Q1 áram-védőkapcsoló (FI-relé): kiold? |
|---|---|---|---|---|---|---|
| nincs | nincs | nincs | nem | nem | nem | nem old ki |
| nincs | nincs | fennáll | nem | nem | áram folyik át rajta | nem old ki |
| nincs | fennáll | nincs | nem | áram folyik át rajta | nem | kiold |
| nincs | fennáll | fennáll | nem | áram folyik át rajta | áram folyik át rajta | kiold |
| fennáll | nincs | nincs | hibaáram folyik | nem | nem | kiold |
| fennáll | nincs | fennáll | hibaáram folyik | nem | áram folyik át rajta | kiold |
| fennáll | fennáll | nincs | hibaáram folyik | áram folyik át rajta | nem | kiold |
| fennáll | fennáll | fennáll | hibaáram folyik | áram folyik át rajta | áram folyik át rajta | kiold |

A táblázatot a szimulátor számolta a(z) fi-rele-hibahelyzetek netlistából (ujjlenyomat: 704b52c6): 8 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé): be (bekapcsolva); F1 kismegszakító (dugaljkör): be (bekapcsolva); M1 mosógép: működik; X1 dugalj: feszültség alatt. A szerelt vezetékezésben (a jelképes hibahelyet és érintést nem számítva) egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig és védőérintkezőig folytonos, és nem halad át kapcsolón; a kismegszakító csak a fázist bontja; minden dugalj kismegszakítón és áram-védőkapcsolón át kap feszültséget; a nullavezetőt csak a kétpólusú áram-védőkapcsoló bontja, a fázisvezetővel együtt; normál üzemben (hibahelyzet, érintés és próbagomb nélkül) nem folyik különbözeti áram. „Kiold”: a védett oldalról a pólusokat megkerülve (a védővezetőn, a földön vagy a próbaellenálláson át) áram folyik; áramerősséget, érintési feszültséget és kioldási időt a szimuláció nem számol.

A táblázat a hiba pillanatát mutatja, a kioldás előtt; a Q1 és az F1 végig bekapcsolt.

- Testzárlat (H1): a hibaáram a védővezetőn tér vissza, megkerüli a vasmagot, a FI-relé kiold. TN-rendszerben a nagy hibaáram miatt a kismegszakító is működhet.
- Fázis–föld érintés (P1): az emberen átfolyó áram a földön tér vissza; ha eléri a kioldási értéket, a FI-relé kiold. A táblázat ezt az esetet mutatja. Jól szigetelő padlón vagy cipőben az áram a kioldási érték alatt maradhat; ilyenkor a FI-relé nem old ki, az áramütés mégis érezhető, és például létráról esést okozhat.
- Fázis–nulla érintés (P2): az áram ugyanúgy be- és visszafolyik a vasmagon át, mint egy fogyasztóé. Nincs különbség, a FI-relé nem old ki, pedig áram folyik a testen át.

#### A 30 mA és a többi érzékenység

- 30 mA: személyvédelmi célú kiegészítő védelem. A hatályos előírások a laikusok által használt dugaljáramkörökre, fürdőszobákra és több más helyre előírják (MSZ HD 60364-4-41 és a 7. rész egyes lapjai); a részletekről és a kivételekről a tervező dönt.
- Ennél érzékenyebb készülék (például 10 mA-es) különleges helyeken fordul elő.
- Kevésbé érzékeny készülék (például 100 vagy 300 mA-es): tűzvédelmi célú vagy csoportvédelem; a közvetlen érintés elleni kiegészítő védelemre nem alkalmas.

#### Típusok: AC, A, F, B

| Típus | Milyen hibaáramot érzékel | Jellemző alkalmazás |
|---|---|---|
| AC | csak szinuszos váltakozó áramot | régi berendezésekben gyakori; ma sok helyen csak korlátozottan alkalmazható |
| A | mint az AC, és a lüktető (egyenirányított) egyenáramot is | a legtöbb háztartási áramkör, elektronikus tápegységek |
| F | mint az A, és a vegyes frekvenciájú hibaáramot is | egyfázisú frekvenciaváltós készülékek (inverteres mosógép, klíma, hőszivattyú) |
| B | mint az F, és a sima egyenáramot is | háromfázisú frekvenciaváltók, egyes elektromosautó-töltők és napelemes inverterek, ha a gyártó előírja |

A sima egyenáramú hibaáram „elvakíthatja” az AC vagy A típusú készüléket, amely ilyenkor egy valódi hibánál sem old ki. A típust ezért a csatlakozó készülékek és a gyártói előírások alapján a tervező választja meg.

#### A próbagomb

A „T” jelű próbagomb a kioldó szerkezet és a belső áramkör működését ellenőrzi; a gyártó által megadott időközönként érdemes megnyomni. Megnyomásakor a védett áramkörök táplálása megszűnik (kikapcsol például a hűtő, a riasztó vagy a számítógép). A próbagomb nem méri a kioldási áramot és időt, és a védővezetőt sem ellenőrzi: a próbaáramkör nem halad át rajta. Ezeket a szakember műszerrel méri. Ha a készülék a próbagombra nem old ki, a védett áramkörök kiegészítő védelem nélkül maradnak: hívj szakembert.

#### Kapcsok és jelölésük

A kétpólusú készülék kapcsai jellemzően 1–2 (fázis) és N–N (nulla), a négypólusúé 1–2, 3–4, 5–6 és N–N. A nullapólus helye (bal vagy jobb szélen), valamint a betáp oldala (felül vagy alul) gyártónként eltérhet; a gyártói útmutató az irányadó. Az előlapon szerepel a névleges áram, az IΔn (például 0,03 A), a típus jele és a próbagomb. A névleges áram azt mutatja, mekkora üzemi áramot vezethet tartósan és kapcsolhat a készülék. Túláram ellen nem véd, ezért a gyártó által megadott túláramvédelemmel együtt kell alkalmazni.

#### Mi ellen nem véd?

- A fázis és a nulla (vagy két fázis) egyidejű érintése ellen, ha az érintő a földtől el van szigetelve (P2 eset).
- Túlterhelés és rövidzárlat ellen: erre a kismegszakító vagy a kombinált védelem (RCBO) szolgál.
- Az áramütés érzetét, az ijedtséget és az ebből eredő balesetet (például létráról esést) nem akadályozza meg.
- A laza kötés melegedése és a soros ív ellen sem, mert ott nincs különbözeti áram.
- A készülék előtti szakaszon (betáp, mérőhely) nem véd.
- A PEN-vezető szakadása ellen sem: TN-C-S rendszerben a szakadás után a védővezetőre kötött fémtestek a fogyasztókon át fázisfeszültségre kerülhetnek, és a FI-relé ezt nem érzékeli, mert a fogyasztók árama a vasmagon át változatlanul visszatér, a pólusok áramai között nincs különbség (lásd: Földelési rendszerek).
- Nem helyettesíti a feszültségmentesítést: a lekapcsolt vagy kioldott FI-relé mellett a feszültségmentességet akkor is méréssel kell ellenőrizni, a FI-relé előtti részek és a többi áramkör pedig feszültség alatt maradnak.
- Nem helyettesíti a védővezetőt: védővezető nélkül egy testzárlatos készülék háza addig feszültség alatt marad, amíg valaki meg nem érinti.

#### Régi berendezésben

- Nincs áram-védőkapcsoló a dugaljáramkörök előtt.
- Közös nulla- és védővezető (PEN, TN-C). Ilyen szakaszon a FI-relé nem alkalmazható; előtte a PEN-vezetőt N- és PE-vezetőre kell szétválasztani (lásd: Földelési rendszerek). A szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze; a szétválasztás helyéről szakember dönt, a mérőhelynél az elosztói engedélyes szabályai szerint. A „nullázott” dugalj a FI-relé után kioldást okozhat (ha a nullára kötött fémház földelt részhez ér).
- AC típusú, régóta nem működtetett készülék, amelynek a szerkezete beragadhatott.
- Közös nullavezetőjű áramkörök, amelyeket nem lehet szétválasztani a FI-relék között.

#### Gyakori hibák

- Nulla- és védővezető összekötése a FI-relé után (lámpatestben, dugaljban): terheléskor kioldás, addig pedig romlik a védelem érzékenysége. A szimulátor az ilyen netlistát elutasítja.
- Idegen nullasín: a védett áramkör nullája a FI-relé előtti vagy egy másik FI-relé utáni nullasínen. Terheléskor kiold; a szimulátor kiszűri.
- A FI-relé áthidalása vagy kiiktatása a gyakori kioldás miatt: életveszélyes.
- Túl sok áramkör egy FI-relén: a készülékek kis szivárgó áramai összeadódnak, és egy hiba mindent lekapcsol.
- Nem megfelelő típus a csatlakozó készülékekhez.

#### Mikor hívj szakembert?

- Ha a FI-relé lekapcsol, és visszakapcsolás után újra kiold. Ha egy készülék csatlakoztatásakor old ki, azt ne használd tovább.
- Ha a próbagomb megnyomására nem old ki.
- Ha az elosztódban nincs áram-védőkapcsoló.
- Ha elektromosautó-töltő, hőszivattyú, napelemes inverter vagy más frekvenciaváltós berendezés kerül a házba: a típust meg kell választani.
- Azonnal, ha egy készülék fémházának vagy más fémrésznek az érintésekor bizsergést érzel: ne érintsd újra, kapcsold le az áramkört az elosztóban, és amíg szakember meg nem vizsgálta, ne kapcsold vissza.
- Ha valakit áramütés ért: ne érintsd meg, amíg áram alatt lehet; ha biztonságosan megteheted, kapcsold le az áramot, és hívd a 112-t. A további teendőket a mentésirányító mondja meg. Utána a berendezést szakember vizsgálja meg.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ EN 61008-1 (beépített túláramvédelem nélküli áram-védőkapcsolók, RCCB) | 2013 | az AC és az A típus meghatározása; a névleges különbözeti áram és a nem működési áram; a legnagyobb kioldási idők táblázata |
| MSZ EN 61009-1 (beépített túláramvédelemmel ellátott áram-védőkapcsolók, RCBO) | 2013 | általános követelmények |
| MSZ EN 62423 (F és B típusú áram-védőkapcsolók) | 2013 (EN 62423:2012) | az F és a B típus érzékelési tartománya |
| MSZ HD 60364-4-41 (áramütés elleni védelem) | 2007 (HD 60364-4-41:2007) | 411.3.3 (kiegészítő védelem a dugaljáramkörökre), 411.4.5 (TN-C rendszerben áram-védőkapcsoló nem alkalmazható), 415.1 (kiegészítő védelem legfeljebb 30 mA-es áram-védőkapcsolóval) |
| MSZ HD 60364-5-53 (kapcsoló- és vezérlőkészülékek kiválasztása és szerelése) | ellenőrizendő (HD 60364-5-53:2022?) | 531.3 (áram-védőkapcsolók; a típus kiválasztása) |
| MSZ HD 60364-7-701 (fürdő- és zuhanyozóhelyiségek) | 2007 | 701.411.3.3 (kiegészítő védelem) |
| MSZ HD 60364-7-722 (elektromos járművek táplálása) | ellenőrizendő | az áram-védőkapcsoló típusára vonatkozó alpont (B típus, vagy egyenáramú hibaáram-érzékelés) |
| IEC TS 60479-1 (az áram hatása emberre és háziállatokra) | 2018 | 5 (15–100 Hz-es váltakozó áram hatásai, idő–áram tartományok) |
| MSZ HD 60364-6 (ellenőrzés) | 2017 (HD 60364-6:2016) | 6.4.3 (mérések, köztük az áram-védőkapcsoló működésének ellenőrzése) |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-ARAM-VEDOKAPCSOLO-FI-RELE-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat b14c8c33 · 2018 szó | ☐ | ☐ | |
| CIK-ARAM-VEDOKAPCSOLO-FI-RELE-FORRAS | Források és szabványpontok (9) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |
| CIK-ARAM-VEDOKAPCSOLO-FI-RELE-ABRA | Ábrák: a 4. rész blokkjai | BEK-FI-RELE-BEKOTES, BEK-FI-RELE-HIBAHELYZETEK | ☐ | ☐ | |

**Kérdés a lektorhoz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q1).** Egyezik-e a hatályos MSZ EN 61008-1-gyel: kioldás IΔn/2 és IΔn között; általános típusnál legfeljebb 0,3 s IΔn-nél és 0,04 s 5 · IΔn-nél?

Válasz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q1):

**Kérdés a lektorhoz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q2).** Az AC típus alkalmazhatóságáról a cikk csak óvatosan fogalmaz („sok helyen korlátozott”). Kell-e konkrét hazai előírásra hivatkozni (MSZ HD 60364-5-53, 531.3.3)?

Válasz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q2):

**Kérdés a lektorhoz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q3).** Tegyen-e a cikk konkrét javaslatot a próbagomb használatának gyakoriságára, vagy maradjon a „gyártó által megadott időközönként”?

Válasz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q3):

**Kérdés a lektorhoz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q4).** A próbaáramkör netlistabeli modellje (védett oldali fázis → ellenállás → táp oldali nulla) elfogadható-e általános elvként?

Válasz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q4):

**Kérdés a lektorhoz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q5).** A hibahelyzet-ábrán a testzárlatnál TN-rendszerben a kismegszakító is működhet; elég-e ezt a szövegben megemlíteni?

Válasz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q5):

**Kérdés a lektorhoz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q6).** A „Mi ellen nem véd?” két új pontja (PEN-szakadás TN-C-S rendszerben; a feszültségmentesítést nem helyettesíti) és a „nulla–védővezető összekötés a FI után rontja az érzékenységet” állítás elfogadható-e így?

Válasz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q6):

**Kérdés a lektorhoz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q7).** A P1 esetnél a cikk most kimondja, hogy jól szigetelő padlón az áram a kioldási érték alatt maradhat. Kell-e ehhez szám (IΔn/2) vagy az IEC TS 60479-1 tartományaira hivatkozás?

Válasz (CIK-ARAM-VEDOKAPCSOLO-FI-RELE-Q7):

**Döntés (CIK-ARAM-VEDOKAPCSOLO-FI-RELE):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-ARAM-VEDOKAPCSOLO-FI-RELE).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-CSILLARKAPCSOLO-105-BEKOTESE – Csillárkapcsoló (105) bekötése: két lámpakör egy helyről

Forrás: content/tudastar/r3/csillarkapcsolo-105-bekotese.md (cikkvázlat); azonosító: csillarkapcsolo-105-bekotese

Tartalmi ujjlenyomat: 68cc59f0 (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Hogyan kapcsol a csillárkapcsoló (105) két lámpakört egy helyről, közös betáppal? Bekötés, négy ér a csillárhoz, kapcsolóállások és gyakori hibák.

Ábrák: BEK-CSILLARKAPCSOLO-105 (4. rész) – az ábrák és a cikk szövege együtt hagyható jóvá.

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: A csillárkapcsoló (105) egy szerelvényben, két billentyűvel két lámpakört kapcsol egy helyről, közös betáppal: egy fázis megy be, két kapcsolt fázis jön ki. Jellemzően egy több fényforrásos csillár két csoportját vagy egy helyiség két lámpáját kapcsolja. A lámpáig négy ér kell: két kapcsolt fázis, a nullavezető és a védővezető.

*Ábra (abra-1): Csillárkapcsoló (105) bekötése – a rajz a 4. részben: BEK-CSILLARKAPCSOLO-105*

#### Vezetékek táblázatban

A két kapcsolt fázis színe itt: 1. kör fekete, 2. kör szürke; a fázisszínek közötti választás nem kötött, a felirat mindkettőt egyértelművé teszi.

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

#### Hogyan működik?

A 105-ös kapcsolóban két érintkező van, mindkettőnek saját billentyűje, de közös a betápkapcsuk. Az 1. billentyű a közös betáp fázisát az 1-es, a 2. billentyű a 2-es kimenetre kapcsolja, egymástól függetlenül. Így négy állapot lehetséges: mindkét kör kikapcsolva, csak az 1. kör ég, csak a 2. kör ég, vagy mindkettő ég. A nullavezető és a védővezető a kötődobozban közvetlenül jut a csillárhoz, egyik billentyű sem bontja.

| Csillárkapcsoló (105) – 1. billentyű | Csillárkapcsoló (105) – 2. billentyű | 1. lámpacsoport | 2. lámpacsoport |
|---|---|---|---|
| ki | ki | nem ég | nem ég |
| ki | be | nem ég | ég |
| be | ki | ég | nem ég |
| be | be | ég | ég |

A táblázatot a szimulátor számolta a(z) csillarkapcsolo-105 netlistából (ujjlenyomat: 171c858b): 4 kapcsolóállás, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig folytonos, és nem halad át kapcsolón; kikapcsolt állásban a lámpa fázisoldali kapcsa nem kap fázist; a nullavezető egyik állásban sem halad át kapcsolón.

105 vagy két 101 egy keretben? A kettős keretbe épített két egypólusú kapcsolónak (101 + 101) két külön betápkapcsa van, ezért két különböző áramkörről is táplálható. A 105-ösnél a betáp közös, így a két lámpakör csak ugyanarról az áramkörről kaphat fázist. Ha két külön áramkörről táplált lámpát kapcsolnak egy szerelvénydobozból, mindkét áramkör nullavezetőjének a saját áramkörénél kell maradnia: a két áramkör nullavezetőjét nem szabad összekötni vagy felcserélni. Ez külön áram-védőkapcsolók (FI-relék) esetén kioldást okoz, és ami súlyosabb: ha az egyik áramkört a kismegszakítójával lekapcsolják, a közösített vagy felcserélt nullavezetőn a másik áramkör árama tovább folyhat, így a „lekapcsolt” áramkör nullavezetőjének megbontásakor áramütés érheti a szerelőt. Ilyen dobozban munkavégzés előtt mindkét áramkört le kell választani, a kettős betáplálást pedig a dobozban és az elosztóban jelölni kell.

#### Kapcsok és jelölésük

A 105-ös kapcsolónak három kapcsa van: a közös betáp (gyakran L vagy nyíl) és a két kimenet (gyakran 1 és 2, vagy egy-egy nyíl). Hogy melyik billentyű melyik kimenetet kapcsolja, az gyártónként eltérhet; a gyártói útmutató vagy a kapcsolóbetét rajza az irányadó. Előfordul, hogy a betápkapocs kettős (a továbbkötés megkönnyítésére), vagy hogy a két billentyű két önálló kapcsolóbetét egy keretben; utóbbinál a két betét betápját a gyártói útmutató szerint át kell kötni.

A csillár sorkapcsán is gyártónként eltér a jelölés (például 1 és 2, L1 és L2, vagy színes vezetékvégek). A lámpacsoportok és a sorkapocs összerendelését a lámpatest leírása adja meg.

#### A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. Feszültségmentesítés az elosztóban, a feszültségmentesítés öt szabálya szerint, minden érintett áramkörre (a feszültségvizsgáló működését előtte és utána ismert feszültségforráson ellenőrizve). A kötődobozban más áramkör vezetői is futhatnak.
2. Azonosítás. A betáp vezetőinek, valamint a kapcsolóhoz és a csillárhoz menő ereknek az azonosítása és jelölése (1. kör, 2. kör).
3. Kötődoboz. A betáp nullavezetője a csillár nullavezetőjével, a védővezető a csillár védővezetőjével kerül egy-egy összekötőbe. A betáp fázisa a kapcsoló közös kapcsához megy, a két kapcsolt fázis a csillár 1-es és 2-es kapcsához tartozó érrel kerül össze.
4. Kapcsoló. A fázis a közös betápkapocsra, a két kapcsolt fázis a két kimenetre kerül.
5. Csillár. A két kapcsolt fázis a sorkapocs 1-es és 2-es kapcsára, a nullavezető az N, a védővezető a PE kapocsra kerül.
6. Ellenőrzés visszakapcsolás előtt: szemrevételezés, valamint a védővezető folytonosságának, a szigetelési ellenállásnak és a polaritásnak a mérése; a szakember dokumentálja.
7. Működéspróba: mind a négy billentyűállás a fenti táblázat szerint működik.

#### Jelölés az alaprajzon

A tervezőben a csillárkapcsoló jele kör két ferde vonallal, alatta az 5-ös számmal (105 → 5). A tervező szerelési rajza szakaszonként mutatja az erek számát:

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – kapcsoló | L (barna), kapcsolt fázis 1 (fekete), kapcsolt fázis 2 (szürke) | 3 |
| Kötődoboz – csillár | kapcsolt fázis 1 (fekete), kapcsolt fázis 2 (szürke), N (kék), PE (zöld-sárga) | 4 |

A lámpakiállásnál a két kapcsolt fázist tartósan jelölni kell (például felirattal vagy jelölőhüvellyel), hogy a csillár cseréjekor is egyértelmű maradjon, melyik ér melyik kör.

#### Régi berendezésben

- Forgó vagy nyomógombos sorozatkapcsoló. A régi csillárkapcsolók egy része egyetlen kezelőszervvel lépteti egymás után az állapotokat (például ki, egyik kör, másik kör, mindkettő); a sorrend típusonként eltér, a kapcsai gyakran jelöletlenek.
- Háromeres vezetékezés a csillárig. Régi berendezésben a csillárhoz gyakran csak két kapcsolt fázis és egy nullavezető megy, védővezető nélkül. Fémtestű csillár így nem köthető be szakszerűen; a megoldásról szakember dönt. A hiányzó védővezetőt tilos a nullavezetőből „pótolni” (a csillár védőkapcsát a nullára kötni), és a két kapcsolt fázis egyike sem használható helyette.
- Elöregedett belső vezetékezés. Régi csillárokban a fényforrások hője a belső vezetékek szigetelését rideggé teheti.
- Ismeretlen szerepű erek. A színekre itt sem lehet hagyatkozni; a régi kábelekben két fekete ér is előfordul.

#### Gyakori hibák

- Kapcsolt fázis a nullavezető összekötőjében. Ha a kötődobozban a kapcsoló egyik kimenetéről jövő ér a nullavezetők közé kerül, a szimuláció szerint a billentyű bekapcsolásakor zárlat keletkezik a fázis- és a nullavezető között, és a kismegszakító lekapcsol.
- Felcserélt körök: a billentyűk „fordítva” kapcsolnak. Ez nem biztonsági hiba, de az áramkörtervtől eltér; a jelölést a tényleges bekötéshez kell igazítani.
- Két áramkör nullavezetőjének összekötése két 101-es kapcsolóval megoldott „csillárkapcsolásnál”.
- Kimaradt védővezető a csillárnál, vagy a csillár fém függesztőjének bekötetlen védőkapcsa.
- Laza kötés a közös betápkapcson: mindkét kör villog vagy kimarad.
- Utánfutásos szellőző 105-ös kapcsolóval. Fürdőszobában gyakori, hogy az egyik billentyű a lámpát, a másik a szellőzőt kapcsolja. Az utánfutásos szellőzők jellemzően állandó fázist és külön vezérlőbemenetet igényelnek, a bekötésüket a gyártói útmutató adja meg; az ilyen szellőző a billentyű kikapcsolt állásában is feszültség alatt van. Nedves helyiségben a zónaszabályokat is figyelembe kell venni.

#### Mikor hívj szakembert?

- Mindig, ha kapcsolót, csillárt vagy kötést kell bekötni, cserélni vagy áthelyezni.
- Ha az egyik billentyű bekapcsolásakor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a kapcsoló vagy a csillár kötése melegszik, elszíneződött, recseg, vagy égett szagot érzel.
- Ha a csillárnál nincs védővezető, vagy a régi csillár belső vezetékei töredeznek.
- Ha a két lámpakört külön áramkörről szeretnéd táplálni, vagy szellőzőt is kapcsolnál ugyanarról a szerelvényről.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ HD 60364-5-537 (leválasztás és kapcsolás) | 2017 (HD 60364-5-537:2016) | 537 – az üzemi (funkcionális) kapcsolásról szóló alpont: egypólusú kapcsolókészülék nem kerülhet a nullavezetőbe |
| MSZ HD 60364-5-51 | 2010 | 514.3 (vezetők azonosítása) |
| MSZ EN IEC 60445 | 2022 (EN IEC 60445:2021) | 6.2 (vezetők azonosítása színnel) |
| MSZ EN 60669-1 (háztartási és hasonló, helyhez kötött villamos berendezések kapcsolói) | 2018 (EN IEC 60669-1:2018) | 7 (osztályozás, bekötési számok), 8 (jelölés), 12 (kapcsok) |
| MSZ HD 60364-6 (ellenőrzés) | 2017 (HD 60364-6:2016) | 6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás) |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-CSILLARKAPCSOLO-105-BEKOTESE-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat 68cc59f0 · 1301 szó | ☐ | ☐ | |
| CIK-CSILLARKAPCSOLO-105-BEKOTESE-FORRAS | Források és szabványpontok (5) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |
| CIK-CSILLARKAPCSOLO-105-BEKOTESE-ABRA | Ábrák: a 4. rész blokkjai | BEK-CSILLARKAPCSOLO-105 | ☐ | ☐ | |

**Döntés (CIK-CSILLARKAPCSOLO-105-BEKOTESE):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-CSILLARKAPCSOLO-105-BEKOTESE).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-DUGALJ-BEKOTESE – Dugalj bekötése: védőérintkezős dugalj, áthurkolás és leágaztatás

Forrás: content/tudastar/r3/dugalj-bekotese.md (cikkvázlat); azonosító: dugalj-bekotese

Tartalmi ujjlenyomat: 5d62b44a (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Hogyan kap fázist, nullát és védővezetőt a védőérintkezős dugalj? Áthurkolás vagy leágaztatás, FI-relé és kismegszakító, gyakori hibák, régi berendezések.

Ábrák: BEK-DUGALJ-ATHURKOLAS, BEK-DUGALJ-LEAGAZTATAS (4. rész) – az ábrák és a cikk szövege együtt hagyható jóvá.

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: A védőérintkezős (földelt) dugalj három vezetőt kap: fázisvezetőt (L), nullavezetőt (N) és védővezetőt (PE), amely a dugalj oldalsó védőérintkezőihez csatlakozik. A mai gyakorlatban a dugaljáramkört a lakáselosztóban saját kismegszakító és egy 30 mA-es áram-védőkapcsoló (FI-relé) védi. Több dugalj áthurkolással vagy kötődobozos leágaztatással kerülhet egy áramkörre; a védővezető mindkét esetben megszakítás és kapcsoló nélkül jut el minden dugaljig.

*Ábra (abra-1): Dugaljkör áthurkolással, FI-relé és kismegszakító után – a rajz a 4. részben: BEK-DUGALJ-ATHURKOLAS*

#### A védőérintkezős dugalj

A hazai lakásokban a két hüvelyes, oldalsó védőérintkezős (földelőkarmos) dugalj terjedt el. A dugó két irányban is bedugható, ezért a csatlakoztatott készülék nem számíthat arra, hogy a fázis mindig ugyanazon az érintkezőn érkezik. A védőérintkező viszont mindig a védővezetőhöz kapcsolódik: ezen keresztül kapja meg a fémházas (I. érintésvédelmi osztályú) készülék háza a védővezetőt. A gyári kettős (dupla) dugalj két aljzata jellemzően a házon belül össze van kötve, ezért egy kapocskészlettel köthető be; hogy egy adott kivitel így készült-e, azt a gyártói útmutató mutatja meg.

#### Vezetékek táblázatban

Az 1. ábra szöveges megfelelője. A lakáselosztón belüli vezetékek a betápot, az áram-védőkapcsolót és a kismegszakítót kötik össze; a dugaljakhoz háromeres vezeték fut.

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

#### Hogyan működik?

A dugalj akkor van feszültség alatt, ha az áramkör áram-védőkapcsolója (FI-relé) és kismegszakítója is be van kapcsolva. A kismegszakító csak a fázisvezetőt bontja: lekapcsolt állásban a dugalj nullavezetője továbbra is a nullasínhez csatlakozik. Az áram-védőkapcsoló a fázis- és a nullavezetőt együtt bontja. A védővezetőt egyik készülék sem kapcsolja, az minden állásban összeköttetésben marad a PE-sínnel.

| Q1 áram-védőkapcsoló (FI-relé) | F1 kismegszakító (dugaljkör) | X1 dugalj | X2 dugalj |
|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | feszültség alatt | feszültség alatt |
| be (bekapcsolva) | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | be (bekapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |

A táblázatot a szimulátor számolta a(z) dugalj-athurkolas netlistából (ujjlenyomat: 9bb3ff8e): 4 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé): nem old ki. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig és védőérintkezőig folytonos, és nem halad át kapcsolón; a kismegszakító csak a fázist bontja; minden dugalj kismegszakítón és áram-védőkapcsolón át kap feszültséget; a nullavezetőt csak a kétpólusú áram-védőkapcsoló bontja, a fázisvezetővel együtt; normál üzemben nem folyik különbözeti áram. „Kiold”: a védett oldalról a pólusokat megkerülve (a védővezetőn, a földön vagy a próbaellenálláson át) áram folyik; áramerősséget, érintési feszültséget és kioldási időt a szimuláció nem számol.

Ebből következik, hogy egy kismegszakító lekapcsolása önmagában még nem feszültségmentesítés. A nullavezető összeköttetésben marad a nullasínnel, ezért más áramkörök terhelésekor vagy a nullavezető megszakadásakor feszültség alá kerülhet; egy dobozban más áramkör vezetői is futhatnak, a felirat pedig tévedhet. A táblázat „nem ad feszültséget” cellája csak azt jelenti, hogy a dugaljon nincs üzemi feszültség, azt nem, hogy feszültségmentes. A feszültségmentességet mindig méréssel kell megállapítani (lásd: A feszültségmentesítés öt szabálya).

#### Kapcsok és jelölésük

A dugalj betétjén három kapocs van: a két hüvelyhez tartozó L és N, valamint a védőérintkező kapcsa, amelyet PE felirat vagy földelésjel mutat. Sok dugaljon az L és az N nincs megkülönböztetve. Ilyenkor célszerű a berendezésen belül minden dugaljat egységesen bekötni, hogy a későbbi mérés és hibakeresés egyértelmű legyen. A kapcsok csavarosak vagy rugós (csavar nélküli) kivitelűek. Hogy egy kapocs hány vezetőt és milyen keresztmetszetet fogadhat, és alkalmas-e áthurkolásra, azt a gyártó adja meg. A jelölés és a kapocskialakítás gyártónként eltérhet; a gyártói útmutató az irányadó.

#### Áthurkolás vagy leágaztatás?

Áthurkolás (1. ábra): a következő dugaljhoz menő vezetők ugyanabba a kapocsba kerülnek, mint a betáp vezetői. Kevesebb kötés kell, de a továbbmenő áramkör folytonossága minden dugalj kapcsán múlik. Ha egy kapocs meglazul, vagy a dugaljat kiszerelik, a sorban utána következő dugaljak elveszíthetik a fázist, a nullát vagy a védővezetőt. A fázis hiánya a működésen látszik, a védővezetőé nem: a dugalj ugyanúgy működik, csak a csatlakoztatott fémházas készülék marad védelem nélkül. A nullavezető szakadása is alattomos: a dugalj nem ad feszültséget, a nullahüvelye mégis fázisfeszültségre kerülhet a csatlakoztatott készüléken át. Ezért sok szakember legalább a védővezetőt kötőelemmel ágaztatja le.

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – X1 dugalj | L (barna), N (kék), PE (zöld-sárga) | 3 |
| X1 – X2 dugalj (áthurkolás) | L (barna), N (kék), PE (zöld-sárga) | 3 |

Leágaztatás (2. ábra): a kötődobozban szerepenként egy-egy vezetékösszekötő fogja össze a vezetőket, és minden dugaljhoz külön szakasz indul. Egy dugalj cseréje a többit nem érinti.

*Ábra (abra-2): Dugaljkör leágaztatással, kötődobozból – a rajz a 4. részben: BEK-DUGALJ-LEAGAZTATAS*

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – X1 dugalj | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – X2 dugalj | L (barna), N (kék), PE (zöld-sárga) | 3 |

| Q1 áram-védőkapcsoló (FI-relé) | F1 kismegszakító (dugaljkör) | X1 dugalj | X2 dugalj |
|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | feszültség alatt | feszültség alatt |
| bármely | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | be (bekapcsolva) | nem ad feszültséget | nem ad feszültséget |

A táblázatot a szimulátor számolta a(z) dugalj-leagaztatas netlistából (ujjlenyomat: 143d7450): 4 állapotkombináció, mindegyik egyezik a várt működéssel (a „bármely” sor az adott elem minden állására érvényes). Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé): nem old ki. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig és védőérintkezőig folytonos, és nem halad át kapcsolón; a kismegszakító csak a fázist bontja; minden dugalj kismegszakítón és áram-védőkapcsolón át kap feszültséget; a nullavezetőt csak a kétpólusú áram-védőkapcsoló bontja, a fázisvezetővel együtt; normál üzemben nem folyik különbözeti áram. „Kiold”: a védett oldalról a pólusokat megkerülve (a védővezetőn, a földön vagy a próbaellenálláson át) áram folyik; áramerősséget, érintési feszültséget és kioldási időt a szimuláció nem számol.

Hány dugalj kerülhet egy áramkörre, és mekkora legyen a vezeték keresztmetszete és a kismegszakító névleges árama, az méretezés kérdése (lásd: Kismegszakító). Ezt a cikk szándékosan nem adja meg számokkal.

#### A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. Feszültségmentesítés. Az érintett áramkör leválasztása az elosztóban, visszakapcsolás elleni biztosítás, majd a feszültségmentesség megállapítása kétpólusú feszültségvizsgálóval minden vezetőpár között (L–N, L–PE, N–PE); a vizsgáló működését a mérés előtt és után ismert feszültségforráson ellenőrizni kell. A dugaljdobozban más áramkör vezetői is lehetnek; a fáziskereső nem igazolja a feszültségmentességet.
2. Azonosítás. A fázis-, a nulla- és a védővezető, valamint a továbbmenő erek azonosítása. A szín csak szándékot jelez (lásd: Vezetékek színjelölése).
3. Előkészítés. Csupaszolás a gyártó által megadott hosszon; hajlékony vezetőhöz érvéghüvely, ha a kapocs megkívánja.
4. Bekötés. A védővezető a védőérintkező kapcsára, a fázis- és a nullavezető a két hüvely kapcsára kerül. Áthurkolásnál a továbbmenő erek csak a gyártó által megengedett módon kerülhetnek ugyanabba a kapocsba.
5. Szerelés. A betét rögzítése a dobozban úgy, hogy a vezetékek ne törjenek meg, ne sérüljenek, és ne feszüljenek a kapcsokon.
6. Ellenőrzés. Szemrevételezés, majd a szakember műszeres ellenőrzése: a védővezető folytonossága, a szigetelési ellenállás, a polaritás, visszakapcsolás után pedig a hibahurok-impedancia (az önműködő lekapcsolás feltétele) és az áram-védőkapcsoló működése. Az eredményeket dokumentálni kell.

#### Jelölés az alaprajzon

A Villanyrajz tervezőjében a dugalj jele kör két függőleges vonallal (a két hüvely), a kettős dugaljé két egymás melletti kör. A szerelvényhez beépítési magasság és áramkör rendelhető, a nyomvonalakhoz pedig kábeljelölés; az anyaglista ebből számolja a hosszakat.

#### Háromfázisú dugalj

Háromfázisú fogyasztóhoz (például műhelygéphez) ipari kivitelű dugalj tartozik: ötpólusú (három fázisvezető, nullavezető és védővezető) vagy nullavezető nélküli, négypólusú változatban. Ott a fázissorrend is számít, mert az a motor forgásirányát határozza meg. Ez a cikk csak az egyfázisú dugaljjal foglalkozik; háromfázisú dugaljat a tervező előírása szerint szakember köt be.

#### Régi berendezésben

- Védőérintkező nélküli dugaljak. Kéteres vezetékezésnél fémházas készülék nem csatlakoztatható szakszerűen. Ha a védőérintkezős aljzat mögött nincs védővezető, az hamis biztonságérzetet ad. A hiányzó védővezetőt tilos a nullavezetőből „pótolni”, vagyis a védőérintkező kapcsát a nullára kötni.
- „Nullázott” dugalj. Régi, közös nulla- és védővezetős (TN-C) berendezésben előfordul, hogy a védőérintkező kapcsa a dugaljban át van kötve a nullavezetőre. Ha a nullavezető megszakad, a csatlakoztatott fémházas készülék háza a készüléken keresztül fázisfeszültséget kap; ha a fázis- és a nullavezető fel van cserélve, a ház közvetlenül fázisra kerül. Áram-védőkapcsoló után ez a kötés ráadásul kioldást okozhat (ha a nullára kötött fémház földelt részhez ér). Ahol a PEN-vezetőt már szétválasztották, a nulla- és a védővezetőt a szétválasztási pont után újra összekötni tilos. Az átalakításról szakember dönt (lásd: Földelési rendszerek).
- Nincs áram-védőkapcsoló a dugaljáramkörök előtt: a fázis–föld érintés ellen nincs kiegészítő védelem. Az utólagos beépítésről szakember dönt; közös nulla- és védővezetős szakaszon előbb a PEN-vezetőt kell szétválasztani.
- Alumínium vezetők, amelyek csak alumíniumhoz is alkalmas kapocsba köthetők, és könnyen törnek.
- Kiégett, elszíneződött betétek, meglazult kapcsok, repedt fedlap.
- Megbízhatatlan érszínek: a régi berendezésekben a színekre nem lehet hagyatkozni. A kék ér is vezethet fázist (például a kapcsolóhoz menő szakaszban), és a védővezető színe is eltérhet a zöld-sárgától; a vezetők szerepét szakember méréssel állapítja meg.

#### Gyakori hibák

- Fázis a védőérintkező kapcsán. A legsúlyosabb hiba: a csatlakoztatott készülék háza fázis alá kerül. A szimulátor az ilyen netlistát elutasítja.
- Nulla- és védővezető összekötése a dugaljban. Áram-védőkapcsoló után kioldást okoz; áram-védőkapcsoló nélkül rejtve marad, de a nullavezető szakadásakor a csatlakoztatott készülék háza feszültség alá kerülhet. A PEN-szétválasztási pont után a nulla- és a védővezető sehol nem köthető újra össze. A szimulátor az ilyen netlistát zárlatként elutasítja.
- Kimaradt vagy laza továbbmenő védővezető áthurkolásnál: a következő dugaljak védővezető nélkül maradnak, de működnek.
- Másik áramkör nullavezetőjének használata. A lekapcsolt áramkör nullája ilyenkor is áramot vezethet, és két külön áram-védőkapcsoló esetén mindkettő kiold.
- Zöld-sárga ér más célra, vagy jelöletlen ér a szokásostól eltérő szerepben.
- Túl hosszú vagy túl rövid csupaszolás: kilógó csupasz vezető, illetve laza, melegedő kötés.

#### Mikor hívj szakembert?

- Mindig, ha dugaljat kell bekötni, cserélni, áthelyezni vagy újat kell felszerelni.
- Ha a dugalj vagy a fedlapja meleg, elszíneződött, olvadt, a dugó lazán áll benne, szikrázik, vagy égett szagot érzel. Addig ne használd, és ha biztonságosan megteheted, kapcsold le az áramkörét az elosztóban.
- Azonnal, ha egy készülék fémházának, a dugalj fedlapjának vagy más fémrésznek az érintésekor bizsergést érzel: ne érintsd újra, kapcsold le az áramkört az elosztóban, és amíg szakember meg nem vizsgálta, ne kapcsold vissza.
- Ha egy készülék csatlakoztatásakor lekapcsol az áram-védőkapcsoló (FI-relé) vagy a kismegszakító. Ne kapcsold vissza újra és újra, és a készüléket ne használd tovább.
- Ha régi, védőérintkező nélküli dugaljat vagy alumínium vezetékezést találsz.
- Fürdőszobában, más nedves helyiségben és szabadban: ott a dugalj helyét, védettségét és védelmét külön előírások szabályozzák (lásd: IP-védettség).
- Nagy teljesítményű fogyasztóhoz (főzőlap, sütő, villanybojler, klíma, elektromosautó-töltő): ezek jellemzően saját, méretezett áramkört kapnak.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ HD 60364-4-41 (áramütés elleni védelem) | 2007 (HD 60364-4-41:2007) | 411.3.3 (kiegészítő védelem áram-védőkapcsolóval a dugaljáramkörökre), 415.1 (kiegészítő védelem) |
| MSZ HD 60364-5-54 (földelő berendezések és védővezetők) | 2012 (HD 60364-5-54:2011) | 543.3 (a védővezetők villamos folytonossága; kapcsolókészülék nem lehet a védővezetőben), 543.4.3 (a nulla- és a védővezető a szétválasztásuk után nem köthető újra össze) |
| MSZ HD 60364-5-51 | 2010 | 514.3 (vezetők azonosítása) |
| MSZ EN IEC 60445 | 2022 (EN IEC 60445:2021) | 6.2 (vezetők azonosítása színnel) |
| IEC TR 60083 (háztartási dugók és dugaszolóaljzatok az IEC-tagországokban) | 2015 | a CEE 7/3 (F típusú, oldalsó védőérintkezős) dugaszolóaljzat leírása |
| MSZ HD 60364-7-701 (fürdő- és zuhanyozóhelyiségek) | 2007 | 701.411.3.3 (kiegészítő védelem), 701.512.3 (szerelvények elhelyezése a zónákban) |
| MSZ HD 60364-6 (ellenőrzés) | 2017 (HD 60364-6:2016) | 6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás, áram-védőkapcsoló működése) |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-DUGALJ-BEKOTESE-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat 5d62b44a · 1874 szó | ☐ | ☐ | |
| CIK-DUGALJ-BEKOTESE-FORRAS | Források és szabványpontok (7) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |
| CIK-DUGALJ-BEKOTESE-ABRA | Ábrák: a 4. rész blokkjai | BEK-DUGALJ-ATHURKOLAS, BEK-DUGALJ-LEAGAZTATAS | ☐ | ☐ | |

**Kérdés a lektorhoz (CIK-DUGALJ-BEKOTESE-Q1).** Van-e kötelező hazai előírás arra, hogy a védővezetőt ne a dugalj kapcsán hurkolják át, hanem kötőelemmel ágaztassák le? A cikk jelenleg csak szakmai megfontolásként tárgyalja.

Válasz (CIK-DUGALJ-BEKOTESE-Q1):

**Kérdés a lektorhoz (CIK-DUGALJ-BEKOTESE-Q2).** Van-e kialakult hazai szabály arra, hogy jelöletlen kapcsú dugaljnál szemből nézve melyik oldalra kerüljön a fázis? A cikk most csak az egységes bekötést javasolja.

Válasz (CIK-DUGALJ-BEKOTESE-Q2):

**Kérdés a lektorhoz (CIK-DUGALJ-BEKOTESE-Q3).** A CEE 7/3 aljzat hazai termékszabványa (MSZ 9871 sorozat vagy más) és kiadása.

Válasz (CIK-DUGALJ-BEKOTESE-Q3):

**Kérdés a lektorhoz (CIK-DUGALJ-BEKOTESE-Q4).** Elegendő-e a háromfázisú (CEE-rendszerű, ötpólusú) dugalj puszta említése, vagy külön cikk kell?

Válasz (CIK-DUGALJ-BEKOTESE-Q4):

**Döntés (CIK-DUGALJ-BEKOTESE):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-DUGALJ-BEKOTESE).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-EGYENPOTENCIALRA-HOZAS-EPH – Egyenpotenciálra hozás (EPH): fő és kiegészítő potenciálkiegyenlítés

Forrás: content/tudastar/r3/egyenpotencialra-hozas-eph.md (cikkvázlat); azonosító: egyenpotencialra-hozas-eph

Tartalmi ujjlenyomat: 42f19255 (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Mit köt össze az EPH, mi a fő EPH-sín, mikor kell kiegészítő EPH, és miért nem helyettesíti a védővezetőt? Működés PEN-szakadásnál és testzárlatnál.

Ábrák: BEK-EPH-ALAPOK (4. rész) – az ábrák és a cikk szövege együtt hagyható jóvá.

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól; elvi ismereteket ad, nem szerelési utasítás. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre; a gázvezetéken végzett munkára a gázszolgáltató előírásai vonatkoznak. A kapcsok és bilincsek jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: Az egyenpotenciálra hozás (EPH) az épületbe belépő fém csővezetékeket, fémszerkezeteket és a védővezető-rendszert egy közös sínen, a fő EPH-sínen köti össze. Célja, hogy az egyszerre megérinthető fémrészek között hiba esetén se alakulhasson ki veszélyes feszültség. Fürdőszobában és más különleges helyiségekben kiegészítő (helyi) EPH is szükséges lehet; az EPH a védővezetőt és az önműködő lekapcsolást nem helyettesíti, hanem kiegészíti.

#### Miért kell?

Áramütést nem a „feszültség alatti tárgy” okoz önmagában, hanem az, ha két egyszerre megérintett pont között feszültség van. Egy lakásban sok ilyen pár akad: a mosógép fémháza és a vízcsap, a hűtő és a radiátor, a villanybojler és a kád. A készülékek fémháza a védővezetőn át (TN-rendszerben) a táppont csillagpontjához kötött, a csővezetékek viszont kívülről, a talajból érkeznek, és a saját potenciáljukat hozzák magukkal. Hiba, például PEN-szakadás vagy testzárlat esetén a kettő között veszélyes feszültség jöhet létre. Az EPH ezeket a részeket egy pontban összeköti, így nincs köztük olyan feszültség, amely egy emberen át áramot hajthatna.

#### Fogalmak

- Test: a villamos berendezés megérinthető vezetőképes része, amely üzem közben nincs feszültség alatt, de hiba esetén feszültség alá kerülhet (például egy fémház).
- Idegen vezetőképes rész: nem a villamos berendezéshez tartozó fémrész, amely kívülről potenciált hozhat be: víz-, fűtés- és gázvezeték, épületszerkezeti acél, fém szellőzőcsatorna.
- Fő EPH-sín (főföldelő sín vagy -kapocs): az a közös gyűjtőpont, ahol a fő védővezető, az épület földelőjének vezetője és a fő EPH-vezetők találkoznak.
- Kiegészítő (helyi) EPH: egy helyiségen belül az egyszerre megérinthető testeket és idegen vezetőképes részeket köti össze, a fő EPH-hoz képest is.

#### Mit kötnek a fő EPH-sínre?

Jellemzően az épületbe belépő fém víz- és fűtésvezetéket, a gázvezetéket (a gázszolgáltató előírása szerint kialakított ponton), az épület hozzáférhető fémszerkezeteit, a fém kábelpáncélokat és -köpenyeket, az épület földelőjét (például az alapföldelőt), valamint a villámvédelmi potenciálkiegyenlítés vezetőit. A teljes felsorolást, a vezetők keresztmetszetét és a kötések kialakítását a szabvány és a tervező határozza meg; ez a cikk szándékosan nem ad meg számokat. TN-C-S-rendszerben a fő EPH-sín jellemzően a betáplálás közelében van, és a fő védővezető köti össze a PEN szétválasztási pontjának védővezető-sínjével (lásd: Földelési rendszerek).

#### Hogyan működik?

Az ábra egy TN-C-S-rendszerű épületet mutat. A fém vízvezeték a talajból lép be, ezért a szimulációban a talajjal is érintkezik. Két érintési pontot vizsgálunk: a mosógép fémháza és a vízcsap (U1), illetve a fémház és a föld (U2) között.

*Ábra (abra-1): A fő EPH-sín és a vízvezeték bekötése – a rajz a 4. részben: BEK-EPH-ALAPOK*

| H1 testzárlat M1-ben (fázis → fémház) | EPH1 a vízvezeték EPH-bekötése | SZ PEN-szakadás a hálózatban | M1 fogyasztó | H1: hibaáram útja | Q1: kiold? | F1: túláramvédelem | Érintés – M1 fémháza és a vízcsap | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|---|---|---|---|
| nincs | bármely | ép | működik | nincs hiba | nem old ki | nem | nincs | nincs |
| nincs | bekötve | szakadt | rendellenesen (a földön át) | nincs hiba | nem old ki | nem | nincs | veszélyes lehet, tartósan |
| nincs | hiányzik | szakadt | rendellenesen (a földön át) | nincs hiba | nem old ki | nem | veszélyes lehet, tartósan | veszélyes lehet, tartósan |
| fennáll | bármely | ép | működik | fémes hurok | kiold | lekapcsolhat | veszélyes lehet a lekapcsolásig | veszélyes lehet a lekapcsolásig |
| fennáll | bármely | szakadt | rendellenesen (a földön át) | a földön át | kiold | nem | veszélyes lehet a lekapcsolásig | veszélyes lehet a lekapcsolásig |

A táblázatot a szimulátor számolta a(z) eph-alapok netlistából (ujjlenyomat: d8926fe6): 8 állapotkombináció, mindegyik egyezik a várt működéssel (a „bármely” sor az adott elem minden állására érvényes). Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé), kétpólusú: be (bekapcsolva); F1 kismegszakító (túláramvédelem): be (bekapcsolva). Ellenőrzött szerkezet (TN-C-S): a csillagpont közvetlenül földelt (üzemi földelő); minden fémház vezetőn át a csillagponthoz kötött; a PEN-vezető egyetlen ponton válik szét, utána a nulla- és a védővezető nem egyesül újra; az idegen vezetőképes részek EPH-val a védővezető-rendszerhez kötöttek; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli.

A táblázat három tanulsága:

1. Ép PEN mellett, hiba nélkül az EPH megléte vagy hiánya a szimulációban nem látszik: ideális vezetőkkel minden pont azonos potenciálon van. A valóságban a csőhálózat kívülről idegen potenciált is behozhat, ezért az EPH ilyenkor is szükséges.
2. PEN-szakadáskor a fogyasztó árama az épület földelőjén és a talajon át keres utat, a teljes védővezető-rendszer potenciálja megemelkedik, és ezt semmi nem kapcsolja le. Ha a vízvezeték be van kötve, a fémház és a csap ugyanazon a potenciálon marad (U1: nincs feszültség); ha az EPH hiányzik, a kettő között veszélyes feszültség lehet. A távoli földhöz képest (U2) az EPH sem segít: az egész összekötött rendszer potenciálja megemelkedik, ezért különösen veszélyes ilyenkor a kerti csap, a kültéri fémszerkezet és a szabadban használt fémházas készülék. A FI-relé ezt a helyzetet sem érzékeli.
3. Testzárlatkor az önműködő lekapcsolás véd. A lekapcsolásig a fémház a hibaáram útjában van; a fő EPH ilyenkor a fémház és a csőhálózat közötti feszültséget a védővezetőnek a fő EPH-sín és a fémház közötti szakaszán eső feszültségre csökkenti. Ez a szakasz a teljes áramköri védővezető lehet, így a maradó feszültség jelentős is lehet; ezért kell a gyors lekapcsolás, és ezért írhat elő a szabvány egyes helyiségekben kiegészítő EPH-t. A feszültség nagyságát a szimuláció nem számolja, csak jelzi, hogy a lekapcsolásig veszély állhat fenn.

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztói hálózat és csatlakozás (az engedélyes hatásköre) | L1 (barna), PEN (zöld-sárga) | 2 |
| Fogyasztói áramkör | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Fő EPH-vezető a vízvezetékhez | EPH-vezető (zöld-sárga) | 1 |

#### Kiegészítő (helyi) EPH

Fürdő- és zuhanyozóhelyiségben, uszodában vagy szaunában nagyobb az áramütés veszélye, mert a nedves bőr ellenállása kisebb. Itt a helyiségen belüli fémrészeket (fém kád és zuhanytálca, fém csövek, fűtőtest) kiegészítő EPH-vezetővel köthetik össze egymással és a védővezetővel. Hogy egy adott helyiségben kell-e kiegészítő EPH, és mit kell bekötni, azt a hatályos szabvány fürdőszobai része és a tervező határozza meg. Mai műanyag csöves fürdőszobákban sokszor nincs is bekötendő idegen vezetőképes rész; hogy egy fémrész annak minősül-e, azt is a tervező vagy a felülvizsgáló ítéli meg, nem a szemrevételezés. A kiegészítő EPH az áram-védőkapcsolót nem helyettesíti.

#### Kapcsok és jelölés

Az EPH-sín kapcsainak száma és kialakítása, valamint a csőbilincsek mérete és jelölése gyártónként eltérhet; a gyártói útmutató az irányadó. A csőbilincset korrózióálló, a cső anyagához illő kivitelben, tiszta fémfelületre szerelik. A földelő- és EPH-csatlakozásokon tartós figyelmeztető felirat jelzi, hogy a kötés biztonsági célú, és nem bontható. Az EPH-vezető zöld-sárga (lásd: Vezetékek színjelölése).

#### Régi berendezésben

- Hiányzó fő EPH. Régebbi házakban gyakran nincs fő EPH-sín, vagy csak a vízóra mellett van egy bilincs, amelyről nem tudni, hová vezet.
- Megszakított csővezeték. Műanyag szakasszal felújított fém csőhálózatnál a régi bilincs már csak a cső egy darabját köti be.
- Vízcső mint földelő. Régen a fém vízvezetéket földelőként is használták; műanyag bekötővezetéknél ez a földelés megszűnik.
- Nullázott berendezés EPH nélkül. Régi, nullázott berendezésben nulla- vagy PEN-szakadáskor a fémházak és a csövek között nagy feszültség léphet fel, és a csövön, a régi földelővezetőn üzemi áram is folyhat.
- Elkorrodált, festékkel átfestett bilincsek, laza kötések.

#### Gyakori hibák

- Az EPH-vezető „áthurkolása” úgy, hogy egy cső kiszerelésekor a többi kötés is megszakad.
- Gázvezeték bekötése a gázszolgáltató által előírt ponttól eltérő helyen, vagy a szigetelő közdarab áthidalása.
- Az EPH összetévesztése a földeléssel: az EPH elsősorban a fémrészeket köti össze egymással, nem a talajjal.
- Az EPH-vezető kiszerelése csőcsere vagy burkolás közben, visszakötés nélkül.
- Fém csővezeték átvágása vagy EPH-vezető bontása a villamos berendezés ismerete nélkül. Hiba esetén (például PEN-szakadáskor vagy hibás N–PE-összekötésnél) a csövön és az EPH-vezetőn áram folyhat; a bontás pillanatában a két szétválasztott vég között életveszélyes feszültség jelenhet meg, és szikra is keletkezhet.
- Annak feltételezése, hogy az EPH miatt nem kell áram-védőkapcsoló vagy védővezető.

#### Mikor hívj szakembert?

- Ha a csaptelep, a kád, a radiátor vagy egy fémházas készülék „csíp”, bizsereg. Ne érintsd meg újra, és ne próbáld magad kideríteni az okát. Ha áramütés ért valakit, ne érj hozzá, amíg áram alatt lehet, és hívd a 112-t.
- Csőcsere, fürdőszoba-felújítás vagy gázvezeték-átalakítás előtt és után: előtte, hogy a fém csővezeték bontása veszélytelen-e, utána, hogy az EPH-kötések megmaradtak-e, vagy pótolni kell őket.
- Ha nem találod a fő EPH-sínt, vagy nem tudod, mi van rá kötve.
- Villámvédelem, napelem vagy hőszivattyú telepítésekor: ezek a potenciálkiegyenlítést is érintik.
- A gázvezetékkel kapcsolatos bármely kötéshez a gázszolgáltató előírásai szerint.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ HD 60364-4-41 (áramütés elleni védelem) | 2007 (HD 60364-4-41:2007) | 411.3.1.2 (védő egyenpotenciálú összekötés), 415.2 (kiegészítő védő egyenpotenciálú összekötés) |
| MSZ HD 60364-5-54 (földelő berendezések és védővezetők) | 2012 (HD 60364-5-54:2011) | 542.4 (fő földelőkapocs), 544.1 (fő EPH-vezetők), 544.2 (kiegészítő EPH-vezetők) |
| MSZ HD 60364-7-701 (fürdő- és zuhanyozóhelyiségek) | 2007 | 701.415.2 (kiegészítő védő egyenpotenciálú összekötés) |
| MSZ HD 60364-5-51 | 2010 | 514.13.1 (figyelmeztető felirat a földelő- és EPH-csatlakozásokon) |
| MSZ EN 62305-3 (villámvédelem – építmények fizikai károsodása és életvédelem) | 2011 | 6.2 (villámvédelmi potenciálkiegyenlítés) |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-EGYENPOTENCIALRA-HOZAS-EPH-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat 42f19255 · 1512 szó | ☐ | ☐ | |
| CIK-EGYENPOTENCIALRA-HOZAS-EPH-FORRAS | Források és szabványpontok (5) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |
| CIK-EGYENPOTENCIALRA-HOZAS-EPH-ABRA | Ábrák: a 4. rész blokkjai | BEK-EPH-ALAPOK | ☐ | ☐ | |

**Kérdés a lektorhoz (CIK-EGYENPOTENCIALRA-HOZAS-EPH-Q1).** A fürdőszobai kiegészítő EPH: a hatályos MSZ HD 60364-7-701 szerint mikor kötelező, és mikor hagyható el (például 30 mA-es áram-védőkapcsolóval védett áramköröknél)? A cikk most csak a tervezői döntésre utal.

Válasz (CIK-EGYENPOTENCIALRA-HOZAS-EPH-Q1):

**Kérdés a lektorhoz (CIK-EGYENPOTENCIALRA-HOZAS-EPH-Q2).** A gázvezeték EPH-bekötésének hazai szabályai (szigetelő közdarab, a bekötés helye, gázszolgáltatói előírás) – elegendő-e a puszta hivatkozás?

Válasz (CIK-EGYENPOTENCIALRA-HOZAS-EPH-Q2):

**Kérdés a lektorhoz (CIK-EGYENPOTENCIALRA-HOZAS-EPH-Q3).** A fő EPH-vezető és a kiegészítő EPH-vezető legkisebb keresztmetszete: a cikk szándékosan nem ad számot. Kell-e jóváhagyott táblázat?

Válasz (CIK-EGYENPOTENCIALRA-HOZAS-EPH-Q3):

**Kérdés a lektorhoz (CIK-EGYENPOTENCIALRA-HOZAS-EPH-Q4).** A szimuláció a fém vízvezetéket a talajjal érintkezőnek tekinti. Ez a mai, műanyag bekötővezetékes házakban gyakran nem igaz; elég-e ezt a cikkben megemlíteni?

Válasz (CIK-EGYENPOTENCIALRA-HOZAS-EPH-Q4):

**Döntés (CIK-EGYENPOTENCIALRA-HOZAS-EPH):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-EGYENPOTENCIALRA-HOZAS-EPH).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-EGYPOLUSU-KAPCSOLO-101-BEKOTESE – Egypólusú kapcsoló (101) bekötése: egy lámpa egy helyről

Forrás: content/tudastar/r3/egypolusu-kapcsolo-101-bekotese.md (cikkvázlat); azonosító: egypolusu-kapcsolo-101-bekotese

Tartalmi ujjlenyomat: 6f7c9cdc (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Hogyan kerül be az egypólusú (101-es) kapcsoló a világítási áramkörbe? Kapcsolt fázis, kötődoboz, kapcsolóállások, gyakori hibák és régi berendezések.

Ábrák: BEK-EGYPOLUSU-KAPCSOLO-101 (4. rész) – az ábrák és a cikk szövege együtt hagyható jóvá.

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: Az egypólusú kapcsoló (101) egy lámpát vagy lámpacsoportot kapcsol egy helyről. A fázisvezetőt bontja: a betáp fázisa a kapcsoló egyik kapcsára, a lámpához menő kapcsolt fázis a másikra kerül, a nulla- és a védővezető pedig a kapcsolót elkerülve, a kötődobozban jut a lámpához. Így kikapcsolt állásban a lámpa foglalata nem kap fázist, de ettől még nem feszültségmentes: lámpacseréhez és szereléshez az áramkört az elosztóban kell leválasztani.

*Ábra (abra-1): Egypólusú kapcsoló (101) bekötése kötődobozzal – a rajz a 4. részben: BEK-EGYPOLUSU-KAPCSOLO-101*

#### Vezetékek táblázatban

Az ábra szöveges megfelelője. A színkiosztás egy lehetséges, következetes megoldás (barna betáp fázis, fekete kapcsolt fázis); a fázisszínek közötti választás nem kötött, a kék és a zöld-sárga szerepe viszont igen.

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

#### Hogyan működik?

A 101-es kapcsolóban egyetlen érintkezőpár van. Bekapcsolt állásban összeköti a két kapcsát: a betáp fázisa a kapcsolt fázisvezetőn át eljut a lámpához, az áramkör pedig a lámpa nullavezetőjén keresztül zárul. Kikapcsolt állásban az érintkező nyitva van, a lámpához menő kapcsolt fázis feszültségmentes. A lámpa nullavezetője ilyenkor is a hálózat nullájához kapcsolódik, a védővezetője pedig a kapcsoló állásától függetlenül mindig összeköttetésben marad a védővezető-hálózattal.

| Kapcsoló (101) | Lámpa |
|---|---|
| ki | nem ég |
| be | ég |

A táblázatot a szimulátor számolta a(z) egypolusu-kapcsolo-101 netlistából (ujjlenyomat: 162c980a): 2 kapcsolóállás, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig folytonos, és nem halad át kapcsolón; kikapcsolt állásban a lámpa fázisoldali kapcsa nem kap fázist; a nullavezető egyik állásban sem halad át kapcsolón.

Miért a fázist bontja? Ha a kapcsoló a nullavezetőt szakítaná meg, a lámpa ugyan kialudna, de a fázis a lámpán keresztül a foglalatig, a kapcsokig és a lámpatest belső vezetékeiig továbbra is eljutna. Izzócsere vagy a lámpatest tisztítása közben ez áramütést okozhat. Ezért egypólusú kapcsoló nem kerülhet a nullavezetőbe; a polaritás ellenőrzése az átadás előtti vizsgálat része. Menetes (E27, E14) foglalatnál a kapcsolt fázis a középső érintkezőre jut, a nullavezető a menetre (lásd: Lámpafoglalatok és lámpatalpak).

A kikapcsolt lámpa nem feszültségmentes. A falikapcsoló üzemi kapcsoló, nem leválasztó: a lámpa nullavezetője kikapcsolt állásban is a hálózathoz csatlakozik, és hogy a kapcsoló valóban a fázist bontja-e, azt csak mérés mutatja meg. Lámpacsere, tisztítás vagy szerelés előtt ezért az áramkört az elosztóban le kell választani, és a feszültségmentességet ellenőrizni kell. Az áram-védőkapcsoló (FI-relé) sem véd minden esetben: ha valaki egyszerre érinti a fázis- és a nullavezetőhöz kapcsolódó részt (például a foglalat két érintkezőjét), az áram nem a védővezetőn vagy a földön át záródik, így a FI-relé nem feltétlenül old ki.

#### Kapcsok és jelölésük

A 101-es kapcsolónak két kapcsa van: a betáp (fázis) kapcsa és a lámpa felé menő kimenet. A jelölés gyártónként eltér: a betápot többnyire L, a kimenetet 1-es szám vagy a lámpa felé mutató nyíl jelöli, de előfordul más jelölés is. Sok gyártó csak váltókapcsolót (106) forgalmaz, amely egypólusú kapcsolóként is beköthető: ilyenkor a fázis a közös kapocsra, a kapcsolt fázis az egyik kimenetre kerül, a másik kimenet szabadon marad. A szabadon maradó kimenet a szimuláció szerint éppen akkor van fázis alatt, amikor a lámpa nem ég, ezért más vezető nem köthető rá, toldásra vagy továbbkötésre sem használható. A gyártói útmutató az irányadó.

A jelzőfényes (megvilágított) kapcsolóknál a kapcsok szerepe kötött. Van olyan kivitel, amelynek jelzőfénye a lámpán keresztül zárja az áramkörét – ilyenkor a kikapcsolt lámpa kapcsain is feszültség mérhető –, és van, amelyik külön nullavezető-kapcsot igényel. A kapcsokra tömör vagy hajlékony vezető köthető, a gyártó által megengedett keresztmetszettel; hajlékony vezetőhöz rendszerint érvéghüvely kell. A kapcsoló névleges áramát és feszültségét az adattáblája adja meg.

#### A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. Feszültségmentesítés. Az érintett áramkör (vagy áramkörök) leválasztása az elosztóban, visszakapcsolás elleni biztosítás, majd a feszültségmentesség megállapítása kétpólusú feszültségvizsgálóval, amelynek működését a mérés előtt és után ismert feszültségforráson ellenőrizni kell, a feszültségmentesítés öt szabálya szerint. Egy kötődobozban több áramkör vezetői is futhatnak; a fáziskereső nem igazolja a feszültségmentességet.
2. Azonosítás. A betáp fázis-, nulla- és védővezetőjének, valamint a kapcsolóhoz és a lámpához menő ereknek az azonosítása és jelölése. A szín csak szándékot jelez (lásd: Vezetékek színjelölése).
3. Kötődoboz. A betáp nullavezetője és a lámpa nullavezetője egy vezetékösszekötőbe, a két védővezető egy másikba kerül. A betáp fázisa a kapcsolóhoz menő érrel, a kapcsolóból visszatérő kapcsolt fázis a lámpához menő fázisérrel kerül össze.
4. Kapcsoló. A fázis a betápkapocsra, a kapcsolt fázis a kimenetre kerül, a gyártó által megadott csupaszolási hosszal.
5. Lámpa. A kapcsolt fázis az L, a nullavezető az N kapocsra, a védővezető a lámpatest védővezető-kapcsára kerül.
6. Ellenőrzés visszakapcsolás előtt. Szemrevételezés: nincs kilógó csupasz vezetővég, a kötések húzásra is tartanak, a vezetékek nem sérültek a dobozba hajtáskor. A védővezető folytonosságát, a szigetelési ellenállást és a polaritást (a kapcsoló a fázisvezetőben van) a szakember méréssel ellenőrzi és dokumentálja.
7. Működéspróba. Visszakapcsolás után a kapcsoló mindkét állása a fenti táblázat szerint működik.

#### Jelölés az alaprajzon

A Villanyrajz tervezőjében a kapcsoló jele kör egy ferde vonallal, alatta az 1-es számmal. A szám a típusszám utolsó jegye (101 → 1; a 102 → 2, a 105 → 5, a 106 → 6, a 107 → 7). A tervező szerelési rajza a kábel- vagy védőcsőszakaszonként szükséges erek számát mutatja:

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – kapcsoló | L (barna), kapcsolt fázis (fekete) | 2 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |

A kapcsolóhoz menő szakaszban nincs nullavezető. Ha ide háromeres kábel kerül, a zöld-sárga ér akkor is csak védővezető lehet. A kék ér csak akkor szolgálhat kapcsolt fázisként, ha a szakaszban nincs nullavezető, és a végein tartós jelölés mutatja a szerepét. Fém burkolatú vagy keretű kapcsolóhoz védővezető is kell; ha a dobozba később okoskapcsoló kerülhet, a nullavezető is legyen ott (a gyártói útmutató szerint).

#### Régi berendezésben

- A kapcsoló a nullavezetőt bontja. Régi vagy utólag átalakított berendezésben előfordul. A lámpa működik, de kikapcsolva is fázis alatt áll. Csak szakember által végzett méréssel derül ki.
- Nincs védővezető a lámpánál. Két erű vezetékezésnél fémtestű (I. érintésvédelmi osztályú) lámpatest nem köthető be szakszerűen; a megoldásról szakember dönt. A hiányzó védővezetőt tilos a nullavezetőből „pótolni” (a lámpatest védőkapcsát a lámpánál vagy a dobozban a nullára kötni): ha a nullavezető megszakad vagy a vezetők felcserélődnek, a fémtest fázis alá kerül.
- Nullázásos (TN-C) rendszer. A régi gyakorlatban a lámpatest védőkapcsa a közös nulla- és védővezetőhöz (PEN) csatlakozhatott. Átalakításnál ezt szakembernek kell felmérnie. Ahol a PEN-vezetőt már szétválasztották nulla- és védővezetőre, a kettőt a szétválasztási pont után újra összekötni tilos (lásd: Földelési rendszerek).
- Alumínium vezetők. Csak alumíniumhoz is alkalmas kapocsba vagy összekötőbe köthetők; törékenyek, a kötésük melegedhet. Réz és alumínium vezető csak erre alkalmas összekötővel köthető össze.
- Kötések a kapcsolódobozban, szigetelőszalaggal. A régi, sodrott kötések lazulhatnak; a lámpa hőjétől elöregedett szigetelés morzsolódhat.
- Jelöletlen kapcsok, megbízhatatlan színek. A régi kapcsolók kapcsain gyakran nincs jelölés, az erek színe pedig semmit nem bizonyít: a kék ér is vezethet fázist, például a kapcsolóhoz menő szakaszban.

#### Gyakori hibák

- Kapcsoló a nullavezetőben. A legsúlyosabb hiba: a lámpa kikapcsolva is fázis alatt marad. A szimulációs ellenőrzés is ezt az esetet szűri ki elsőként.
- Felcserélt vezetők a lámpánál. Ha a kapcsolt fázis a lámpa N, a nullavezető az L kapcsára kerül, a lámpa működik, de a fázis a foglalat menetére jut.
- Zöld-sárga ér fázisvezetőként, vagy jelöletlen kék ér kapcsolt fázisként.
- Kimaradt vagy bekötetlen védővezető a fémtestű lámpatestnél.
- Laza kötés: melegedés, recsegés, villogás. Gyakori ok, hogy az ér nincs ütközésig betolva a vezetékösszekötőbe, vagy hajlékony vezető került érvéghüvely nélkül olyan kapocsba, amely erre nem alkalmas.
- Kikapcsolva derengő LED-lámpa. Okozhatja jelzőfényes kapcsoló, amelynek kis árama a lámpán át folyik; hosszú, párhuzamosan futó vezetékek kapacitív csatolása; vagy hibás bekötés. Az okot szakember méréssel keresi meg.
- Túl sok LED-meghajtó egy kapcsolón. Bekapcsoláskor nagy rövid idejű áramot vehetnek fel; a kapcsoló terhelhetőségét a gyártói adatlap adja meg.

#### Mikor hívj szakembert?

- Mindig, ha kapcsolót, lámpát vagy kötést kell bekötni, cserélni vagy áthelyezni.
- Azonnal, ha a lámpatest, a kapcsolókeret vagy más fémrész érintésekor bizsergést érzel: ne érintsd újra, kapcsold le az áramkört az elosztóban, és amíg a szakember meg nem vizsgálta, ne kapcsold vissza.
- Ha a kapcsoló vagy a fedele meleg, elszíneződött, recseg, szikrázik, vagy égett szagot érzel.
- Ha a lámpa kikapcsolva dereng vagy villog, vagy kapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a lámpánál nincs védővezető, vagy régi, alumínium vezetékezést találsz.
- Ha a kapcsoló vagy a lámpa fürdőszobába, más nedves helyiségbe vagy szabadba kerül; ilyenkor a védettséget is meg kell választani (lásd: IP-védettség).
- Ha okoskapcsolót szeretnél: sok típus nullavezetőt igényel a kapcsolódobozban.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ HD 60364-5-537 (leválasztás és kapcsolás) | 2017 (HD 60364-5-537:2016) | 537 – az üzemi (funkcionális) kapcsolásról szóló alpont: egypólusú kapcsolókészülék nem kerülhet a nullavezetőbe |
| MSZ HD 60364-5-559 (lámpatestek és világítási berendezések) | 2012 (HD 60364-5-559:2012) | a menetes lámpafoglalat bekötéséről szóló alpont (fázisvezető a középső érintkezőre) |
| MSZ HD 60364-5-51 | 2010 | 514.3 (vezetők azonosítása) |
| MSZ EN IEC 60445 | 2022 (EN IEC 60445:2021) | 6.2 (vezetők azonosítása színnel) |
| MSZ EN 60669-1 (háztartási és hasonló, helyhez kötött villamos berendezések kapcsolói) | 2018 (EN IEC 60669-1:2018) | 7 (osztályozás, bekötési számok), 8 (jelölés), 12 (kapcsok) |
| MSZ HD 60364-6 (ellenőrzés) | 2017 (HD 60364-6:2016) | 6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás) |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-EGYPOLUSU-KAPCSOLO-101-BEKOTESE-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat 6f7c9cdc · 1509 szó | ☐ | ☐ | |
| CIK-EGYPOLUSU-KAPCSOLO-101-BEKOTESE-FORRAS | Források és szabványpontok (6) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |
| CIK-EGYPOLUSU-KAPCSOLO-101-BEKOTESE-ABRA | Ábrák: a 4. rész blokkjai | BEK-EGYPOLUSU-KAPCSOLO-101 | ☐ | ☐ | |

**Döntés (CIK-EGYPOLUSU-KAPCSOLO-101-BEKOTESE):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-EGYPOLUSU-KAPCSOLO-101-BEKOTESE).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-FESZULTSEGMENTESITES-OT-SZABALYA – A feszültségmentesítés öt szabálya

Forrás: content/tudastar/r3/feszultsegmentesites-ot-szabalya.md (cikkvázlat); azonosító: feszultsegmentesites-ot-szabalya

Tartalmi ujjlenyomat: 099bbab3 (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Leválasztás, visszakapcsolás elleni biztosítás, mérés, földelés és rövidrezárás, letakarás: miért ebben a sorrendben, és mik a gyakori hibák?

A cikk kiadásához a szöveg jóváhagyásán túl még hiányzik: a folyamatábra (az öt lépés) még nincs kész. A szöveg ettől függetlenül jóváhagyható; a cikk csak a hiány pótlása és az új jóváhagyás után jelenhet meg.

Ennek a cikknek nincs netlistás bekötési ábrája (a 4. részben nem szerepel).

> **Veszély – életveszély: áramütés-, ív- és tűzveszély.** A leírás szakembernek szól; az elveket ismerteti, nem helyettesíti a munkahelyi utasítást és a munkairányítást. Ha nem vagy villanyszerelő, ne dolgozz villamos berendezésen, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a feszültségmentesítés teljes elvégzése és a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A leválasztó- és záreszközök, valamint a vizsgálóműszerek jelölése és kezelése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: Villamos berendezésen dolgozni csak feszültségmentes állapotban szabad, és ezt az állapotot öt lépés teremti meg, mindig ugyanebben a sorrendben. Az első kettő (leválasztás, visszakapcsolás elleni biztosítás) megakadályozza, hogy feszültség érkezzen, a harmadik (a feszültségmentesség megállapítása) igazolja, hogy nincs feszültség, a negyedik és az ötödik (földelés és rövidrezárás, a szomszédos feszültség alatti részek letakarása) a maradék veszélyek ellen véd. A feszültség visszaadása fordított sorrendben történik.

#### Miért kell öt lépés?

Egy kismegszakító lekapcsolása önmagában nem feszültségmentesítés. A kismegszakító csak a fázisvezetőt bontja, az elosztó felirata tévedhet, egy dobozban több áramkör is futhat, és valaki véletlenül visszakapcsolhatja, amíg te dolgozol. Feszültség érkezhet nem várt irányból is: aggregátorról, napelemes inverterről, szünetmentes tápegységről vagy egy szomszédos áramkörről. A kikapcsolt kábelben a kondenzátorok és a hosszú vezetékek töltése is megmaradhat, és indukált feszültség is keletkezhet. Az öt lépés mindegyike egy-egy ilyen veszély ellen véd, ezért egyik sem hagyható ki és nem cserélhető fel.

#### Az öt lépés egy pillantásra

*Ábra (abra-1): A feszültségmentesítés öt lépése – ez az ábra még nincs kész (a cikk kiadását akadályozza)*

1. Leválasztás – a munkaterület elválasztása minden lehetséges betáplálási iránytól.
2. Visszakapcsolás elleni biztosítás – annak megakadályozása, hogy bárki visszakapcsoljon.
3. A feszültségmentesség megállapítása – méréssel, minden pólus között.
4. Földelés és rövidrezárás – ahol előírt vagy szükséges.
5. A szomszédos feszültség alatti részek letakarása vagy elkerítése.

#### 1. Leválasztás

A munkaterületet minden olyan iránytól le kell választani, ahonnan feszültség érkezhet. Ehhez leválasztásra alkalmas készülék kell, például főkapcsoló vagy leválasztó-kapcsoló, kivehető olvadóbiztosító-betét vagy olyan kismegszakító, amelyet a gyártó leválasztásra is alkalmasnak jelöl. Hogy a nullavezetőt is bontani kell-e, az a hálózat földelési rendszerétől és a munka jellegétől függ (lásd: Földelési rendszerek). A nullavezetőt a leválasztás után is feszültség alattinak kell tekinteni, amíg a mérés mást nem mutat: közös nullavezetőn, nulla- vagy PEN-szakadáskor, illetve felcserélt bekötésnél veszélyes feszültség és áram lehet rajta. Ne feledkezz meg a visszatáplálás lehetőségéről (aggregátor, inverter, szünetmentes tápegység) és a több helyről táplált áramkörökről.

#### 2. Visszakapcsolás elleni biztosítás

A leválasztó készüléket úgy kell rögzíteni, hogy ne lehessen visszakapcsolni: lakattal zárható kapcsolóval, lezárt elosztóval, a kivett biztosítóbetét elzárásával. Mellé tartós, jól látható figyelmeztető tábla kerül, amely jelzi, hogy a berendezésen dolgoznak, és ki rendelkezik vele. Jó gyakorlat, hogy minden dolgozó a saját lakatját teszi fel, és csak ő veheti le.

#### 3. A feszültségmentesség megállapítása

A feszültségmentességet a munkahelyen, közvetlenül a munka előtt, minden pólus között kell megállapítani: a fázisvezetők egymás között, a fázisvezetők és a nullavezető, illetve a védővezető között, valamint a nulla- és a védővezető között. Erre kétpólusú feszültségvizsgáló való, amelynek működését a mérés előtt és után egy ismert feszültségforráson ellenőrizni kell. Az egypólusú fáziskereső csavarhúzó nem igazolja a feszültségmentességet: kijelzése függ attól, hogyan állsz, milyen a padló, és lemerült vagy hibás eszköz is „nincs feszültséget” mutat. Ha bármelyik mérés feszültséget jelez, a munka nem kezdhető el, a leválasztást felül kell vizsgálni.

#### 4. Földelés és rövidrezárás

A leválasztott részeket ott, ahol ez előírt vagy a körülmények miatt szükséges, földelni és egymással rövidre zárni kell. Ez akkor is véd, ha a vezetékre mégis feszültség kerül (téves bekapcsolás, visszatáplálás, indukció): az áram a rövidzáró eszközön folyik, és a védelem lekapcsol. A földelő-rövidzáró eszközt mindig előbb a földeléshez, azután a vezetőkhöz kell csatlakoztatni, eltávolításkor fordítva. Nagyfeszültségen ez általános követelmény; kisfeszültségen főként ott szükséges, ahol a leválasztott rész mégis feszültség alá kerülhet (például szabadvezetéknél vagy visszatáplálás lehetőségénél). Hogy egy adott munkánál kell-e, azt a munka irányítója a vonatkozó szabályok szerint dönti el.

#### 5. A szomszédos feszültség alatti részek letakarása vagy elkerítése

Ha a munkaterület közelében feszültség alatt maradó részek vannak (például egy elosztóban a betáplálás kapcsai vagy egy másik áramkör), azokat szigetelő takarással, burkolattal vagy elkerítéssel kell védeni a véletlen érintés ellen. A munkaterületet jól láthatóan ki kell jelölni.

#### A feszültség visszaadása

A munka végeztével a lépéseket fordított sorrendben kell visszavonni: a szerszámok és anyagok eltávolítása, a takarások levétele, a földelő-rövidzáró eszköz leszerelése (előbb a vezetőkről, utoljára a földről), a lakatok és táblák eltávolítása, majd a visszakapcsolás. Előtte meg kell győződni arról, hogy mindenki elhagyta a munkaterületet, és tud a visszakapcsolásról. Új vagy átalakított berendezést csak a szükséges ellenőrzések és mérések után szabad feszültség alá helyezni.

#### Kapcsok és jelölés

A leválasztó készülékek állásjelzése (például „0/I”, piros-zöld jelzés), a lakatolható kivitel és a feszültségvizsgálók kijelzése gyártónként eltérhet; mindig a gyártói útmutató az irányadó. Az elosztók áramkörfeliratai segítenek, de nem helyettesítik a mérést.

#### Régi berendezésben

- Hiányos vagy téves feliratok, átszámozott, utólag bővített elosztók.
- Régi olvadóbiztosítós táblák, amelyekben a betét kivétele nem mindig választ le minden vezetőt; felcserélt bekötésnél a betét a nullavezetőben is lehet, és a kivétele után a fázis feszültség alatt marad.
- Megbízhatatlan érszínek: régi vezetékezésben a kék ér is vezethet fázist.
- Közös nullavezetők több áramkör között: egy lekapcsolt áramkör nullavezetőjén is folyhat áram.
- Kéteres, nullázott vezetékezés, ahol a dugalj védőérintkezője a nullavezetőre van kötve (lásd: Földelési rendszerek).
- Utólag beépített aggregátor-, napelem- vagy szünetmentes betáplálás, amelyről a rajz nem tud.

#### Gyakori hibák

- Csak a kismegszakító lekapcsolása, lakat és tábla nélkül.
- Fáziskereső használata a feszültségmentesség megállapítására.
- A vizsgálóeszköz ellenőrzésének elhagyása, vagy mérés csak a fázis és a föld között.
- A nullavezető érintése mérés nélkül, abban a hitben, hogy az nem lehet feszültség alatt.
- Rossz áramkör leválasztása a felirat alapján, ellenőrző mérés nélkül.
- A visszatáplálás lehetőségének figyelmen kívül hagyása.
- A földelő-rövidzáró eszköz rossz sorrendű fel- vagy leszerelése.
- Visszakapcsolás úgy, hogy nem mindenki hagyta el a munkaterületet.

#### Mikor hívj szakembert?

- Mindig, ha villamos berendezésen kell dolgozni: a feszültségmentesítés szakképzett személy feladata. Az öt szabály ismerete nem tesz képessé a szerelésre: a leválasztási pont kiválasztása, a mérés és az eredmény értékelése szakmai gyakorlatot és megfelelő eszközt igényel.
- Ha nem tudod biztosan, melyik kismegszakító melyik áramkört táplálja, vagy az elosztó feliratai hiányosak.
- Ha az épületben aggregátor, napelemes rendszer vagy szünetmentes tápegység is van.
- Ha valakit áramütés ért: hívd a 112-t, és csak akkor nyúlj hozzá, ha az áramkört már veszélytelenül lekapcsoltad; magadat ne tedd ki áramütésnek.
- A mérőhelyen és a csatlakozáson végzett munkához: ezt az elosztói engedélyes szabályai szerint, az ő engedélyével lehet végezni.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ EN 50110-1 (villamos berendezések üzemeltetése) | 2013 (EN 50110-1:2013) | 6.2 (feszültségmentes állapotban végzett munka), 6.2.2–6.2.6 (az öt lépés), 6.2.7 (a feszültség visszaadása) |
| MSZ 1585 (villamos berendezések üzemeltetése – az MSZ EN 50110-1 hazai kiegészítése) | 2016 | a feszültségmentesítésre és a munkavégzés engedélyezésére vonatkozó pontok |
| MSZ EN 61243-3 (kétpólusú kisfeszültségű feszültségvizsgálók) | 2015 (EN 61243-3:2014) | 4 (követelmények) |
| MSZ EN 61230 (hordozható földelő vagy földelő-rövidzáró eszközök) | 2009 | általános követelmények |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-FESZULTSEGMENTESITES-OT-SZABALYA-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat 099bbab3 · 1035 szó | ☐ | ☐ | |
| CIK-FESZULTSEGMENTESITES-OT-SZABALYA-FORRAS | Források és szabványpontok (4) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |

**Kérdés a lektorhoz (CIK-FESZULTSEGMENTESITES-OT-SZABALYA-Q1).** Kisfeszültségű lakóépületi munkánál mikor kötelező a 4. lépés (földelés és rövidrezárás), és mikor hagyható el? A cikk most az MSZ EN 50110-1 elvét írja le, szám és kivételek nélkül.

Válasz (CIK-FESZULTSEGMENTESITES-OT-SZABALYA-Q1):

**Kérdés a lektorhoz (CIK-FESZULTSEGMENTESITES-OT-SZABALYA-Q2).** A nullavezető leválasztása: mikor kell a fázisvezetőkkel együtt bontani? A cikk ezt a hálózat rendszerétől és a munka jellegétől függőnek írja.

Válasz (CIK-FESZULTSEGMENTESITES-OT-SZABALYA-Q2):

**Kérdés a lektorhoz (CIK-FESZULTSEGMENTESITES-OT-SZABALYA-Q3).** A hazai szóhasználat: „villamos szakképzett személy”, „kioktatott személy”, „munkairányító”, „üzemeltető” – megfelel-e az MSZ 1585 hatályos fogalmainak?

Válasz (CIK-FESZULTSEGMENTESITES-OT-SZABALYA-Q3):

**Kérdés a lektorhoz (CIK-FESZULTSEGMENTESITES-OT-SZABALYA-Q4).** Kell-e jogszabályi hivatkozás (munkavédelmi törvény, villamos berendezések üzemeltetésére vonatkozó rendelet), és ha igen, melyik?

Válasz (CIK-FESZULTSEGMENTESITES-OT-SZABALYA-Q4):

**Döntés (CIK-FESZULTSEGMENTESITES-OT-SZABALYA):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-FESZULTSEGMENTESITES-OT-SZABALYA).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-FOLDELESI-RENDSZEREK – Földelési rendszerek: TN-C, TN-S, TN-C-S, TT és IT

Forrás: content/tudastar/r3/foldelesi-rendszerek.md (cikkvázlat); azonosító: foldelesi-rendszerek

Tartalmi ujjlenyomat: 1a172e63 (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Mit jelent a TN-C, a TN-S, a TN-C-S, a TT és az IT? Hol válik szét a PEN-vezető, mi történik testzárlatkor és PEN-szakadáskor, mi jellemző itthon?

Ábrák: BEK-FOLDELES-TN-C, BEK-FOLDELES-TN-S, BEK-FOLDELES-TN-C-S, BEK-FOLDELES-TT, BEK-FOLDELES-IT (4. rész) – az ábrák és a cikk szövege együtt hagyható jóvá.

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól; elvi ismereteket ad, nem szerelési utasítás. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka, így a PEN-vezető szétválasztásának kialakítása is, az elosztói engedélyes hatásköre és előírásai szerint történik. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: A földelési rendszer azt írja le, hogyan kapcsolódik a táppont csillagpontja és a fogyasztói berendezés fémháza a földhöz. TN-rendszerben a fémház vezetőn át a földelt csillagponthoz csatlakozik, TT-rendszerben a saját földelőjéhez, IT-rendszerben pedig a táppont nincs közvetlenül földelve. A hazai lakóépületekben a TN-C-S a legelterjedtebb: a hálózat PEN-vezetője a csatlakozás után egyetlen ponton válik szét nulla- és védővezetőre, és utána soha nem egyesülhet újra.

#### Mit jelentenek a betűk?

Az első betű a táppont (az elosztói transzformátor) csillagpontjára vonatkozik: T – közvetlenül földelt (üzemi földelés), I – a földtől elszigetelt vagy nagy impedancián át földelt. A második betű a fogyasztói berendezés fémházaira (szakszóval: testeire): T – saját földelőn vannak, N – vezetőn át a táppont földelt pontjához kötöttek. A TN utáni kiegészítő betű: C – közös PEN-vezető látja el a nulla- és a védővezető szerepét, S – a nullavezető (N) és a védővezető (PE) külön fut.

A régi hazai szóhasználat a TN-rendszerű érintésvédelmet nullázásnak, a TT-rendszerűt védőföldelésnek nevezte; régi tervekben, jegyzőkönyvekben ma is előfordul.

#### A rendszerek egy táblázatban

Az öt ábra a táppontot, a hálózatot, az épület elosztóját és egy fémházas (I. érintésvédelmi osztályú) fogyasztót mutatja, két hibahelyzettel: testzárlat (a fázisvezető a fémházhoz ér), illetve egy vezető szakadása vagy egy második hiba. Az „érintés” azt mutatja, folyhatna-e áram azon, aki a fémházat és a földet egyszerre érinti, és megszünteti-e ezt önműködő lekapcsolás. Csak a fémházat vizsgálja; a nullavezető ettől függetlenül feszültség alá kerülhet (lásd a TN-S-nél).

| Rendszer | Csillagpont | A fémház védővezetője | 1. hibahelyzet | 2. hibahelyzet | Szimuláció |
|---|---|---|---|---|---|
| TN-C | közvetlenül földelt | PEN, a csillagponthoz | Testzárlat: fémes hurok; lekapcsol: F1 (túláramvédelem); érintés: veszélyes lehet a lekapcsolásig | PEN-szakadás: lekapcsol: nincs; fogyasztó: nem működik; érintés: veszélyes lehet, tartósan | PASS, 4 állapot (742e564d) |
| TN-S | közvetlenül földelt | külön PE, a csillagponthoz | Testzárlat: fémes hurok; lekapcsol: F1 (túláramvédelem), Q1 (FI-relé); érintés: veszélyes lehet a lekapcsolásig | N-szakadás: lekapcsol: nincs; fogyasztó: nem működik; érintés: nincs | PASS, 4 állapot (816da23b) |
| TN-C-S | közvetlenül földelt | PE, a szétválasztási ponttól PEN, a csillagponthoz | Testzárlat: fémes hurok; lekapcsol: F1 (túláramvédelem), Q1 (FI-relé); érintés: veszélyes lehet a lekapcsolásig | PEN-szakadás: lekapcsol: nincs; fogyasztó: rendellenesen (a földön át); érintés: veszélyes lehet, tartósan | PASS, 4 állapot (bff6a9cd) |
| TT | közvetlenül földelt | helyi földelőhöz (RA) | Testzárlat: a földön át; lekapcsol: Q1 (FI-relé); érintés: veszélyes lehet a lekapcsolásig | Testzárlat szakadt földelővezetővel: nincs zárt hurok; lekapcsol: nincs; érintés: veszélyes lehet, tartósan; a FI-relé legfeljebb a testen átfolyó áramra old ki | PASS, 4 állapot (553eca92) |
| IT | nincs közvetlenül földelve | helyi földelőhöz (RA) | Első testzárlat: nincs zárt hurok; lekapcsol: nincs (a szigetelésfigyelő jelez); érintés: nincs | Második testzárlat másik fázison: fémes hurok; lekapcsol: Q1 (túláramvédelem), Q2 (túláramvédelem); érintés: veszélyes lehet a lekapcsolásig | PASS, 4 állapot (3723d185) |

A táblázatot a szimulátor számolta a felsorolt netlistákból (5 rendszer, összesen 20 állapotkombináció, mindegyik egyezik a várt működéssel, és mindegyikben teljesülnek a rendszer szerkezeti feltételei). Az esetek a hiba fennállásának pillanatát mutatják, a lekapcsolás előtt; ideális vezetőkkel, áramerősség és lekapcsolási idő számítása nélkül.

#### TN-C: közös PEN-vezető a fogyasztóig

A TN-C-rendszerben a táppontól a fogyasztóig egyetlen vezető, a PEN viszi a nullavezető üzemi áramát és a védővezető szerepét; a fogyasztónál a nulla- és a védőkapocs is a PEN-re kerül. Testzárlatkor a hibaáram fémes hurokban, a PEN-en át tér vissza, ezért a túláramvédelem (kismegszakító vagy olvadóbiztosító) lekapcsolhat.

*Ábra (abra-1): TN-C rendszer – a rajz a 4. részben: BEK-FOLDELES-TN-C*

| H1 testzárlat M1-ben (fázis → fémház) | SZ PEN-szakadás a hálózatban | M1 fogyasztó | H1: hibaáram útja | F1: túláramvédelem | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|---|
| nincs | ép | működik | nincs hiba | nem | nincs |
| nincs | szakadt | nem működik | nincs hiba | nem | veszélyes lehet, tartósan |
| fennáll | ép | működik | fémes hurok | lekapcsolhat | veszélyes lehet a lekapcsolásig |
| fennáll | szakadt | nem működik | nincs zárt hurok | nem | veszélyes lehet, tartósan |

A táblázatot a szimulátor számolta a(z) foldeles-tn-c netlistából (ujjlenyomat: 742e564d): 4 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: F1 túláramvédelem (kismegszakító vagy olvadóbiztosító): be (bekapcsolva). Ellenőrzött szerkezet (TN-C): a csillagpont közvetlenül földelt (üzemi földelő); minden fémház vezetőn át a csillagponthoz kötött; a PEN-vezető a táppontól a fogyasztó csatlakozásáig fut, külön nulla- és védővezető nélkül; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli.

A táblázat legfontosabb sora a PEN-szakadás: a fogyasztó leáll, de a fémháza a fogyasztón át a fázisvezetőhöz kapcsolódik, és ezt semmilyen védelem nem kapcsolja le. Áram-védőkapcsoló (FI-relé) TN-C-rendszerben nem alkalmazható: a hibaáram a PEN-en, a készüléken át tér vissza, így különbözeti áram nem keletkezik, kioldáskor pedig a fémház a védővezetőjét is elveszítené. A PEN-t ezért nem szabad kapcsolóval, biztosítóval vagy FI-relével bontani, és a szabvány a legkisebb keresztmetszetét is előírja. Ha a fázis- és a PEN-vezető valahol fel van cserélve, a PEN-re kötött fémház közvetlenül fázisfeszültségre kerül. Új lakásberendezés ma nem készül TN-C-rendszerben; a közcélú elosztóhálózat viszont jellemzően négyvezetős (három fázis és PEN), amelyet az elosztói engedélyes több ponton ismételten földel.

#### TN-S: külön nulla- és védővezető

A TN-S-rendszerben a nulla- és a védővezető már a csillagpontnál szétválik, és végig külön fut; a védővezetőn üzem közben nem folyik áram. Testzárlatkor a hibaáram fémes hurokban, a PE-n át tér vissza, ezt a túláramvédelem és az áram-védőkapcsoló is érzékeli. Nullavezető-szakadáskor a fogyasztó leáll, a fémháza nem kerül feszültség alá, mert a védővezető ép. A szakadás utáni nullavezető-szakasz viszont a bekapcsolt fogyasztón át fázisfeszültségre kerülhet, ezért a nullavezető érintése ilyenkor életveszélyes; háromfázisú hálózatban a csillagpont eltolódása az egyfázisú fogyasztókon túlfeszültséget is okozhat.

*Ábra (abra-2): TN-S rendszer – a rajz a 4. részben: BEK-FOLDELES-TN-S*

| H1 testzárlat M1-ben (fázis → fémház) | SZ nullavezető-szakadás a hálózatban | M1 fogyasztó | H1: hibaáram útja | Q1: kiold? | F1: túláramvédelem | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|---|---|
| nincs | ép | működik | nincs hiba | nem old ki | nem | nincs |
| nincs | szakadt | nem működik | nincs hiba | nem old ki | nem | nincs |
| fennáll | ép | működik | fémes hurok | kiold | lekapcsolhat | veszélyes lehet a lekapcsolásig |
| fennáll | szakadt | nem működik | fémes hurok | kiold | lekapcsolhat | veszélyes lehet a lekapcsolásig |

A táblázatot a szimulátor számolta a(z) foldeles-tn-s netlistából (ujjlenyomat: 816da23b): 4 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé), kétpólusú: be (bekapcsolva); F1 kismegszakító (túláramvédelem): be (bekapcsolva). Ellenőrzött szerkezet (TN-S): a csillagpont közvetlenül földelt (üzemi földelő); minden fémház vezetőn át a csillagponthoz kötött; a nulla- és a védővezető csak a csillagpontban kapcsolódik, külön fut a fogyasztóig; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli.

TN-S-rendszer jellemzően saját transzformátorról táplált létesítményben (például ipari üzemben) fordul elő.

#### TN-C-S: a PEN szétválasztása

A TN-C-S-rendszerben a PEN-vezető a táppontól a szétválasztási pontig fut, onnan a nulla- és a védővezető külön halad. A szétválasztás a fogyasztói berendezés kezdetén történik; pontos helyét (mérőhely vagy az azt követő első elosztó) és kialakítását az elosztói engedélyes előírásai határozzák meg. Jellemzően ide kapcsolódik az épület földelője (alapföldelő vagy ismételt földelés) és a fő EPH-sín is (lásd: Egyenpotenciálra hozás (EPH)).

*Ábra (abra-3): TN-C-S rendszer és a PEN szétválasztása – a rajz a 4. részben: BEK-FOLDELES-TN-C-S*

| H1 testzárlat M1-ben (fázis → fémház) | SZ PEN-szakadás a hálózatban vagy a csatlakozó vezetékben | M1 fogyasztó | H1: hibaáram útja | Q1: kiold? | F1: túláramvédelem | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|---|---|
| nincs | ép | működik | nincs hiba | nem old ki | nem | nincs |
| nincs | szakadt | rendellenesen (a földön át) | nincs hiba | nem old ki | nem | veszélyes lehet, tartósan |
| fennáll | ép | működik | fémes hurok | kiold | lekapcsolhat | veszélyes lehet a lekapcsolásig |
| fennáll | szakadt | rendellenesen (a földön át) | a földön át | kiold | nem | veszélyes lehet a lekapcsolásig |

A táblázatot a szimulátor számolta a(z) foldeles-tn-c-s netlistából (ujjlenyomat: bff6a9cd): 4 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé), kétpólusú: be (bekapcsolva); F1 kismegszakító (túláramvédelem): be (bekapcsolva). Ellenőrzött szerkezet (TN-C-S): a csillagpont közvetlenül földelt (üzemi földelő); minden fémház vezetőn át a csillagponthoz kötött; a PEN-vezető egyetlen ponton válik szét, utána a nulla- és a védővezető nem egyesül újra; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli.

A szétválasztás egyirányú: utána a nulla- és a védővezető sehol nem köthető újra össze, sem alelosztóban, sem dugaljban, sem készülékben. Ha mégis összeérnek, a védővezetőn és a hozzá kötött csöveken üzemi áram folyik; a FI-relé csak akkor old ki, ha az összekötés a védett oldalán van, különben a hiba rejtve marad, és nullavezető-szakadáskor a fémházak is feszültség alá kerülhetnek.

A szétválasztás előtti PEN szakadását az áram-védőkapcsoló nem érzékeli: a fázis- és a nullavezető árama egyenlő, a fogyasztó árama az épület földelőjén és a talajon át keres utat. Ilyenkor a teljes védővezető-rendszer – minden fémház és az EPH-ba kötött cső – feszültség alá kerülhet, és ezt sem a kismegszakító, sem a FI-relé nem kapcsolja le. Közös hálózati PEN szakadásakor a saját főkapcsoló lekapcsolása sem szünteti meg biztosan a veszélyt, mert a többi, ugyanarra a PEN-re kötött fogyasztó is megemelheti a potenciált. Ezért fontos a PEN-vezető megbízhatósága, a kis ellenállású földelés és az EPH; nullavezető-szakadás figyelésére külön készülék is beépíthető.

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

#### TT: saját földelő a fogyasztónál

A TT-rendszerben a csillagpont az RB üzemi földelőn, a fogyasztói védővezető a saját RA védőföldelőn van, köztük nincs vezető kapcsolat. Testzárlatkor a hibaáram a két földelőn és a talajon át tér vissza; ez a hurok nagy ellenállású, a túláramvédelem többnyire nem kapcsol le gyorsan, ezért a hibavédelmet jellemzően áram-védőkapcsoló adja. A védőföldelő ellenállását a FI-relé kioldási áramához kell megválasztani és mérni, hogy a fémházon ne maradhasson tartósan a megengedettnél nagyobb érintési feszültség; a pontos feltételt a szabvány adja meg.

*Ábra (abra-4): TT rendszer – a rajz a 4. részben: BEK-FOLDELES-TT*

| H1 testzárlat M1-ben (fázis → fémház) | SZ a védőföldelő vezetőjének szakadása | H1: hibaáram útja | Q1: kiold? | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|
| nincs | bármely | nincs hiba | nem old ki | nincs |
| fennáll | ép | a földön át | kiold | veszélyes lehet a lekapcsolásig |
| fennáll | szakadt | nincs zárt hurok | nem old ki | veszélyes lehet, tartósan; a FI-relé legfeljebb a testen átfolyó áramra old ki |

A táblázatot a szimulátor számolta a(z) foldeles-tt netlistából (ujjlenyomat: 553eca92): 4 állapotkombináció, mindegyik egyezik a várt működéssel (a „bármely” sor az adott elem minden állására érvényes). Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé), kétpólusú: be (bekapcsolva); F1 kismegszakító (túláramvédelem): be (bekapcsolva); M1 fogyasztó: működik; F1: túláramvédelem: nem. Ellenőrzött szerkezet (TT): a csillagpont közvetlenül földelt (üzemi földelő); a fémházak védővezetője helyi földelőn van, vezetőn át nem kapcsolódik a csillagponthoz; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli.

Az utolsó sor a TT-rendszer gyenge pontja: ha a védőföldelő vezetője elszakad, testzárlatkor nincs zárt hurok, és a fémház tartósan fázisfeszültségre kerülhet. A FI-relé legfeljebb akkor kapcsol le, amikor valaki megérinti a fémházat, és a testén át folyó áram eléri a kioldási értéket – vagyis csak az áramütés közben; nagyobb kioldási áramú (például tűzvédelmi célú) FI-relé jellemzően nem old ki. Ezért a földelés folytonosságát, ellenállását és a FI-relé működését időszakos felülvizsgálat ellenőrzi.

#### IT: földeletlen táppont, szigetelésfigyelés

Az IT-rendszerben a táppont csillagpontja nincs közvetlenül földelve, a fémházak viszont közös védővezetőn és földelőn vannak. Az első testzárlat nem ad zárt hurkot (a szórt kapacitáson át folyó kis áramot a szimuláció nem modellezi), ezért nem kell azonnal lekapcsolni; a szigetelésfigyelő jelez. Az első hiba azonban nem veszélytelen: utána a többi fázisvezető a földhöz képest vonali feszültségre kerülhet, ezért a hibát mielőbb meg kell szüntetni. Második testzárlatkor egy másik fázison a hibaáram a fémházakat összekötő védővezetőn át fémes hurokban folyik, és a túláramvédelemnek le kell kapcsolnia.

*Ábra (abra-5): IT rendszer – a rajz a 4. részben: BEK-FOLDELES-IT*

| H1 testzárlat M1-ben (L1 → fémház) | H2 testzárlat M2-ben (L3 → fémház) | H1: hibaáram útja | H2: hibaáram útja | Q1: túláramvédelem | Q2: túláramvédelem | SZF szigetelésfigyelő | Érintés – M1 fémháza és a föld |
|---|---|---|---|---|---|---|---|
| nincs | nincs | nincs hiba | nincs hiba | nem | nem | nem jelez | nincs |
| nincs | fennáll | nincs hiba | nincs zárt hurok | nem | nem | jelez | nincs |
| fennáll | nincs | nincs zárt hurok | nincs hiba | nem | nem | jelez | nincs |
| fennáll | fennáll | fémes hurok | fémes hurok | lekapcsolhat | lekapcsolhat | jelez | veszélyes lehet a lekapcsolásig |

A táblázatot a szimulátor számolta a(z) foldeles-it netlistából (ujjlenyomat: 3723d185): 4 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 háromfázisú kismegszakító (M1): be (bekapcsolva); Q2 háromfázisú kismegszakító (M2): be (bekapcsolva); M1 fogyasztó: működik; M2 fogyasztó: működik. Ellenőrzött szerkezet (IT): a csillagpont nincs közvetlenül földelve; a fémházak védővezetője helyi földelőn van, vezetőn át nem kapcsolódik a csillagponthoz; a védővezetőt és a PEN-t semmilyen kapcsolókészülék nem bontja; vezetőkkel egyik állásban sincs zárlat. A szimuláció ideális (ellenállás nélküli) vezetőkkel, igen/nem alapon vizsgálja az áramutakat: áramerősséget, hibafeszültséget és lekapcsolási időt nem számol. „Fémes hurok”: a hibaáram csak vezetőkön át jut vissza a táppontba; „a földön át”: a hurokban földelési ellenállás is van. „Lekapcsolhat”: a túláramvédelem a fémes hibahurokban van; hogy elég gyorsan lekapcsol-e, azt a hurokimpedancia mérése vagy számítása dönti el. „Veszélyes lehet”: a két megérintett pont között egy emberi testen át áram folyhatna, vagy a fémház a hibaáram útjában van; „a lekapcsolásig”: a hiba miatt egy védelem magától is működésbe léphet, és a nyitása a veszélyt megszünteti; „a FI-relé legfeljebb a testen átfolyó áramra old ki”: a hiba magától nem okoz lekapcsolást, a fémház tartósan feszültség alatt maradhat, és a FI-relé csak az érintő emberen át a földbe folyó áramra oldhat ki, ha az eléri a kioldási áramát. A FI-relé az áramütést nem akadályozza meg, legfeljebb az időtartamát korlátozza; a fázis- és a nullavezető egyidejű érintését nem érzékeli.

IT-rendszert ott alkalmaznak, ahol a váratlan lekapcsolás nagyobb kockázat (például kórházi műtőben, egyes ipari folyamatoknál); saját transzformátorról táplált, lakossági csatlakozásnál nem fordul elő.

#### Kapcsok és jelölés

A PEN-vezető zöld-sárga, a végein kék jelöléssel (vagy fordítva); bővebben: Vezetékek színjelölése. Régi berendezésben a színek eltérhetnek: a vezető szerepét mérés dönti el, nem a szín. A szétválasztási ponton a sínek és kapcsok felirata és a híd kialakítása gyártónként eltérhet; mindig a gyártói útmutató és az elosztói engedélyes előírása az irányadó.

#### Régi berendezésben

- Kéteres „nullázott” áramkörök. Régi lakásokban gyakran a dugalj védőérintkezője a dugaljban a nullavezetőre van kötve: ez vékony vezetővel kialakított TN-C. Nullavezető-szakadáskor a csatlakoztatott fémházas készülék háza a készüléken át, a fázis és a nulla felcserélésekor (dugaljban, kötődobozban, biztosítótáblán) közvetlenül kerül fázisfeszültségre. Az elé épített áram-védőkapcsoló a fémház testzárlatát nem érzékeli (a hibaáram a nullavezetőn, rajta át tér vissza); a korszerűsítéshez külön védővezető kell.
- Megbízhatatlan színek. Régi vezetékezésben a kék vagy akár a zöld-sárga ér is vezethet fázist.
- Vegyes érintésvédelem. Egyszerre megérinthető, de eltérően (nullázással és védőföldeléssel) védett fémházak: hiba esetén köztük veszélyes feszültség léphet fel.
- Elkorrodált vagy hiányzó földelő, meglazult földelővezető, régi vízcső mint földelő.
- Újra összekötött N és PE egy később beépített alelosztóban vagy dugaljban.

#### Gyakori hibák

- A nulla- és a védővezető összekötése a szétválasztási pont után.
- PEN-vezető kapcsolón, biztosítón vagy áram-védőkapcsolón át; áram-védőkapcsoló TN-C-rendszerben.
- TT-rendszer áram-védőkapcsoló nélkül, vagy túl nagy földelési ellenállással.
- Gáz- vagy más éghető anyagot szállító fém csővezeték használata földelőként.
- IT-rendszerben a szigetelésfigyelő jelzésének figyelmen kívül hagyása.
- Annak feltételezése, hogy a zöld-sárga ér mindig védővezető, a kék mindig nulla, és hogy a nullavezető nem lehet feszültség alatt (nulla- vagy PEN-szakadás után a fogyasztón át fázisfeszültségre kerülhet). A szín nem mérés.
- Az áram-védőkapcsoló túlbecsülése: a PEN-szakadást, a fázis és a nulla egyidejű érintését és a túlterhelést nem érzékeli.

#### Mikor hívj szakembert?

- Ha nem tudod, milyen földelési rendszerű a berendezésed, vagy régi, kéteres vezetékezést találsz.
- Ha egy fémházas készülék, csaptelep vagy kád „csíp”, bizsereg: ne érintsd meg újra, és ne keresd magad az okát. Ha áramütés ért valakit, ne érj hozzá, amíg áram alatt lehet, és hívd a 112-t.
- Ha a lámpák fényereje erősen ingadozik, egyes készülékek leállnak, mások melegszenek: ez nulla- vagy PEN-szakadás jele lehet. Kapcsold le a főkapcsolót, ha veszély nélkül megteheted; ne érints fémrészt (csaptelep, radiátor, készülékház), mert a lekapcsolás után is maradhat rajtuk feszültség; jelezd azonnal az elosztói engedélyes hibabejelentőjének és szakembernek.
- Áram-védőkapcsoló beépítéséhez, a berendezés átalakításához (például TN-C-ről TN-C-S-re), földelő vagy EPH kiépítéséhez.
- A mérőhelyen és a csatlakozáson végzett munkához mindig az elosztói engedélyes szabályai szerint, az ő engedélyével.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ HD 60364-1 (kisfeszültségű villamos berendezések – alapelvek, fogalommeghatározások) | 2009 | 312.2 (a földelési rendszerek típusai és betűjele) |
| MSZ HD 60364-4-41 (áramütés elleni védelem) | 2007 (HD 60364-4-41:2007) | 411.4 (TN), 411.4.5 (áram-védőkapcsoló TN-C-ben), 411.5 (TT), 411.6 (IT) |
| MSZ HD 60364-5-54 (földelő berendezések és védővezetők) | 2012 (HD 60364-5-54:2011) | 542.2 (földelők; éghető anyagot szállító fém csővezeték nem földelő), 543.4 (PEN-vezető és szétválasztása) |
| MSZ HD 60364-7-710 (orvosi helyiségek) | 2012 | 710.411.6 (orvosi IT-rendszer) |
| MSZ EN IEC 60445 | 2022 (EN IEC 60445:2021) | 6.2 (vezetők színjelölése, a PEN-vezető jelölése) |
| MSZ 447 (csatlakozás a közcélú kisfeszültségű elosztóhálózatra) | 2019 | a csatlakozó berendezés érintésvédelmi kialakítása és a PEN szétválasztásának helye |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-FOLDELESI-RENDSZEREK-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat 1a172e63 · 3371 szó | ☐ | ☐ | |
| CIK-FOLDELESI-RENDSZEREK-FORRAS | Források és szabványpontok (6) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |
| CIK-FOLDELESI-RENDSZEREK-ABRA | Ábrák: a 4. rész blokkjai | BEK-FOLDELES-TN-C, BEK-FOLDELES-TN-S, BEK-FOLDELES-TN-C-S, BEK-FOLDELES-TT, BEK-FOLDELES-IT | ☐ | ☐ | |

**Kérdés a lektorhoz (CIK-FOLDELESI-RENDSZEREK-Q1).** Hazai előfordulás: helytálló-e, hogy a közcélú kisfeszültségű hálózat jellemzően TN-C (négyvezetős), a lakossági fogyasztói berendezések nagy része TN-C-S, és TT ma inkább kivételesen fordul elő? Kell-e konkrétabb (elosztói engedélyesenkénti) megfogalmazás?

Válasz (CIK-FOLDELESI-RENDSZEREK-Q1):

**Kérdés a lektorhoz (CIK-FOLDELESI-RENDSZEREK-Q2).** A PEN szétválasztásának helye (csatlakozószekrény, mérőhely, első elosztó) és az ott kötelező földelés (ismételt földelés, alapföldelő) – az MSZ 447 vagy az engedélyesek szabályzata rögzíti? Melyik ponton?

Válasz (CIK-FOLDELESI-RENDSZEREK-Q2):

**Kérdés a lektorhoz (CIK-FOLDELESI-RENDSZEREK-Q3).** A cikk szerint a szétválasztásnál a PEN előbb a PE-sínre kerül, és onnan híddal a nullasínre. Az 543.4 pont pontosan mit ír elő?

Válasz (CIK-FOLDELESI-RENDSZEREK-Q3):

**Kérdés a lektorhoz (CIK-FOLDELESI-RENDSZEREK-Q4).** A szimuláció ideális vezetőkkel, minőségi alapon számol („veszélyes lehet a lekapcsolásig”, „tartósan”). Elegendő-e így, vagy a hibafeszültség nagyságrendjét is közölni kell jóváhagyott forrásból?

Válasz (CIK-FOLDELESI-RENDSZEREK-Q4):

**Kérdés a lektorhoz (CIK-FOLDELESI-RENDSZEREK-Q5).** A régi „nullázás” és „védőföldelés” elnevezés zárójeles használata elfogadható-e?

Válasz (CIK-FOLDELESI-RENDSZEREK-Q5):

**Döntés (CIK-FOLDELESI-RENDSZEREK):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-FOLDELESI-RENDSZEREK).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-KERESZTKAPCSOLO-107-BEKOTESE – Keresztkapcsoló (107) bekötése: egy lámpa három vagy több helyről

Forrás: content/tudastar/r3/keresztkapcsolo-107-bekotese.md (cikkvázlat); azonosító: keresztkapcsolo-107-bekotese

Tartalmi ujjlenyomat: 932700dc (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Egy lámpa három vagy több helyről: két váltókapcsoló (106) közé keresztkapcsolók (107) kerülnek. Működés, kapocspárok, érszám és a jellemző bekötési hibák.

Ábrák: BEK-KERESZTKAPCSOLO-107, BEK-KERESZTKAPCSOLO-107-2X107, BEK-KERESZTKAPCSOLO-107-3X107, BEK-KERESZTKAPCSOLO-107-4X107 (4. rész) – az ábrák és a cikk szövege együtt hagyható jóvá.

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: Három vagy több helyről úgy kapcsolható egy lámpa, hogy a két szélső helyre váltókapcsoló (106), minden közbenső helyre egy keresztkapcsoló (107) kerül. A keresztkapcsoló a két váltóvezetéket egyenesen vagy keresztezve vezeti tovább, ezért bármelyik kapcsoló átváltása megfordítja a lámpa állapotát. Három helyhez tehát két 106-os és egy 107-es kapcsoló kell, minden további helyhez még egy 107-es.

*Ábra (abra-1): Keresztkapcsolás: 106 + 107 + 106 – a rajz a 4. részben: BEK-KERESZTKAPCSOLO-107, BEK-KERESZTKAPCSOLO-107-2X107, BEK-KERESZTKAPCSOLO-107-3X107, BEK-KERESZTKAPCSOLO-107-4X107*

#### Vezetékek táblázatban

Egy keresztkapcsolós (három helyről kapcsolt) változat. A váltóvezetékek szürkék; az „a” jelű pár a K1 és az X1, a „b” jelű pár az X1 és a K2 között fut.

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

#### Hogyan működik?

Az első váltókapcsoló (K1) a fázist az 1-es vagy a 2-es váltóvezetékre teszi. A keresztkapcsolónak négy kapcsa van: egy bemenő pár (A1, A2) és egy kimenő pár (B1, B2). „Egyenes” állásban az A1-et a B1-gyel és az A2-t a B2-vel, „keresztezett” állásban az A1-et a B2-vel és az A2-t a B1-gyel köti össze. Az utolsó váltókapcsoló (K2) a lámpát az egyik vezetékre köti. A lámpa akkor ég, ha a fázis éppen azon a vezetéken érkezik, amelyikre K2 áll. Bármelyik kapcsoló átváltása a fázist a másik vezetékre teszi, ezért mindig megfordítja a lámpa állapotát.

| K1 (106, 1. hely) | X1 (107, 2. hely) | K2 (106, 3. hely) | Lámpa |
|---|---|---|---|
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | ég |
| 0 (közös–1) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | nem ég |
| 0 (közös–1) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | 0 (közös–1) | nem ég |
| 1 (közös–2) | egyenes (A1–B1, A2–B2) | 1 (közös–2) | ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | 0 (közös–1) | ég |
| 1 (közös–2) | keresztezett (A1–B2, A2–B1) | 1 (közös–2) | nem ég |

A táblázatot a szimulátor számolta a(z) keresztkapcsolo-107 netlistából (ujjlenyomat: 835f0537): 8 kapcsolóállás, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig folytonos, és nem halad át kapcsolón; kikapcsolt állásban a lámpa fázisoldali kapcsa nem kap fázist; a nullavezető egyik állásban sem halad át kapcsolón. Lámpa: bármelyik kapcsoló átváltása megfordítja az állapotát.

A kikapcsolt lámpa mellett is van feszültség. A szimuláció szerint – egy–négy keresztkapcsolónál egyaránt – minden szakaszban a váltóvezeték-pár egyik ere minden állásban fázis alatt van, a lámpa állapotától függetlenül. Egyetlen kapcsoló- vagy kötődoboz sem tekinthető feszültségmentesnek csak azért, mert a lámpa nem ég.

A keresztkapcsolók száma tetszőlegesen növelhető, a működés elve nem változik. A szimulátor az egy–négy keresztkapcsolós változat minden kapcsolóállását végigszámolta:

| Változat | Kapcsolók | Kapcsolási helyek | Kapcsolóállások | Egy kapcsoló átváltása mindig vált | Szimuláció |
|---|---|---|---|---|---|
| Keresztkapcsolás (106 + 107 + 106): egy lámpa három helyről | 106 + 107 + 106 | 3 | 8 | igen | PASS (835f0537) |
| Keresztkapcsolás (106 + 2 × 107 + 106): egy lámpa 4 helyről | 106 + 107 + 107 + 106 | 4 | 16 | igen | PASS (9566473c) |
| Keresztkapcsolás (106 + 3 × 107 + 106): egy lámpa 5 helyről | 106 + 107 + 107 + 107 + 106 | 5 | 32 | igen | PASS (f9fd89d8) |
| Keresztkapcsolás (106 + 4 × 107 + 106): egy lámpa 6 helyről | 106 + 107 + 107 + 107 + 107 + 106 | 6 | 64 | igen | PASS (e67cbcc6) |

Sok kapcsolási hely. Minden további hely egy újabb keresztkapcsolót és egy négyeres szakaszt jelent. Sok helynél (például hosszú folyosón vagy lépcsőházban) gyakran egyszerűbb a nyomógombos, impulzusrelés (léptetőrelés) vagy lépcsőházi automatás megoldás, ahol a nyomógombok párhuzamosan köthetők. Ezek bekötése külön téma; a választásról a Világítási kapcsolások oldal szól.

#### Kapcsok és jelölésük

A keresztkapcsoló két kapocspárja gyártónként másképp helyezkedik el: van, ahol a bemenő pár felül, a kimenő alul van, van, ahol egymással átlósan, és van, ahol nyilak vagy számok jelölik. A pár tagjai közötti különbség kívülről nem látszik, ezért a bekötés előtt mindig a gyártói rajzot kell megnézni, vagy a párokat a még be nem kötött kapcsolón, folytonosságméréssel azonosítani. A kapocsjelölés tehát gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

A két szélső helyre váltókapcsoló kerül. A keresztkapcsoló négy kapcsából hármat használva elvben váltókapcsolóként is működhet, de csak a kapocspárok pontos ismeretében, és ha a gyártó ezt megengedi; a szimuláció szerint rossz kapocsválasztásnál a lámpa bizonyos állásokban nem kapcsolható. Jó kapocsválasztásnál is igaz, hogy a szabadon maradó negyedik kapocs a szimuláció szerint bizonyos állásokban fázis alá kerül, ezért más vezető nem köthető rá, toldásra vagy továbbkötésre sem használható.

#### A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. Feszültségmentesítés az elosztóban, a feszültségmentesítés öt szabálya szerint (a feszültségvizsgáló működését előtte és utána ismert feszültségforráson ellenőrizve). A lámpa kikapcsolt állapota nem elég: a váltóvezetékek egyike ilyenkor is fázis alatt van. A kötődobozban és a kapcsolódobozokban más áramkör vezetői is lehetnek.
2. Azonosítás. Minden váltóvezeték-pár jelölése mindkét végen (például 1a, 2a, 1b, 2b), mert színből nem különböztethetők meg.
3. Kötődoboz. A nullavezetők és a védővezetők egy-egy összekötőbe kerülnek a betáppal; a betáp fázisa a K1 felé, az „a” pár a K1 és az X1, a „b” pár az X1 és a K2 felé menő azonos jelű érrel; a K2-ről visszatérő kapcsolt fázis a lámpa felé menő érrel kerül össze.
4. K1 (106). A fázis a közös kapocsra, az „a” pár az 1-es és a 2-es kapocsra.
5. X1 (107). Az „a” pár a bemenő párra (A1, A2), a „b” pár a kimenő párra (B1, B2), a gyártói rajz szerint.
6. K2 (106). A „b” pár az 1-es és a 2-es kapocsra, a kapcsolt fázis a közös kapocsra.
7. Lámpa. A kapcsolt fázis az L, a nullavezető az N, a védővezető a PE kapocsra.
8. Ellenőrzés visszakapcsolás előtt: szemrevételezés, a védővezető folytonosságának, a szigetelési ellenállásnak és a polaritásnak a mérése, majd visszakapcsolás után a működéspróba: minden kapcsoló minden állásában a fenti táblázat szerint.

#### Jelölés az alaprajzon

A tervezőben a keresztkapcsoló jele kör két ferde vonallal, alatta a 7-es számmal (107 → 7); a két szélső helyen a váltókapcsoló 6-os jele áll. A tervező szerelési rajza szakaszonként mutatja az erek számát:

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (1. hely) | L (barna), váltóvezeték 1a (szürke), váltóvezeték 2a (szürke) | 3 |
| Kötődoboz – X1 (2. hely) | váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke) | 4 |
| Kötődoboz – K2 (3. hely) | váltóvezeték 1b (szürke), váltóvezeték 2b (szürke), kapcsolt fázis (fekete) | 3 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |

A keresztkapcsolóhoz négy ér megy (két bemenő és két kimenő váltóvezeték). Ha a váltóvezetékek a kapcsolódobozok között közvetlenül futnak, a kötődoboz kimarad, a szakaszonkénti érszám pedig változik; a kapcsolás logikája ugyanaz.

#### Régi berendezésben

- Jelöletlen kapocspárok. A régi keresztkapcsolókon a párok gyakran nincsenek jelölve; a régi bekötés sem biztos, hogy helyes volt.
- Hosszú, vegyes színű váltóvezetékek. Régi épületekben a több szinten átvezetett váltóvezetékek színe bármi lehet (kék is), és a toldások helye sem mindig ismert. Lépcsőházban a világítás gyakran a közös hálózatról, a lakás elosztójától függetlenül kap táplálást.
- Védővezető nélküli lámpakiállás, alumínium vezetők, szigetelőszalagos kötések: lásd az egypólusú kapcsoló cikket.

#### Gyakori hibák

- Összekevert kapocspárok a keresztkapcsolón. Ha a bemenő pár egyik vezetéke a kimenő párra kerül (például az „a” pár az A1 és a B1 kapcsra), a szimuláció szerint a keresztkapcsoló „egyenes” állásában a lámpa egyik helyről sem kapcsolható be, „keresztezett” állásában viszont látszólag rendben működik. Ez a hiba ezért gyakran csak később derül ki.
- Keresztkapcsoló a sor végén, rosszul bekötve. Ha a két váltóvezeték a keresztkapcsolón egy átkötés két végére kerül (például az A1 és a B1 kapocsra), a szimuláció szerint a kapcsoló „egyenes” állásában a lámpa egyik helyről sem kapcsolható be.
- Felcserélt vezetők egy páron belül. Ha egy pár két vezetéke helyet cserél, a kapcsolás a szimuláció szerint ugyanúgy működik, csak az állások értelmezése fordul meg. Ez nem hiba.
- Zöld-sárga ér váltóvezetékként, vagy jelöletlen kék ér fázisként.
- Kikapcsolva derengő LED-lámpa. A hosszú, egymás mellett futó váltóvezetékek kapacitív csatolása itt gyakoribb, mint a rövid kapcsolásoknál; jelzőfényes kapcsoló is okozhatja. Az okot szakember méréssel keresi meg.
- Laza kötés valamelyik keresztkapcsolón: a lámpa bizonyos állásokban egyik helyről sem kapcsolható.

#### Mikor hívj szakembert?

- Mindig, ha kapcsolót, lámpát vagy kötést kell bekötni, cserélni vagy áthelyezni.
- Ha a lámpa valamelyik kapcsoló bizonyos állásában egyik helyről sem kapcsolható.
- Ha a lámpa kikapcsolva dereng vagy villog, vagy kapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a kapcsoló vagy a doboz meleg, elszíneződött, recseg, vagy égett szagot érzel.
- Ha négynél több helyről szeretnéd kapcsolni a lámpát, és mérlegelnéd a nyomógombos, impulzusrelés megoldást.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ HD 60364-5-537 (leválasztás és kapcsolás) | 2017 (HD 60364-5-537:2016) | 537 – az üzemi (funkcionális) kapcsolásról szóló alpont: egypólusú kapcsolókészülék nem kerülhet a nullavezetőbe |
| MSZ HD 60364-5-51 | 2010 | 514.3 (vezetők azonosítása) |
| MSZ EN IEC 60445 | 2022 (EN IEC 60445:2021) | 6.2 (vezetők azonosítása színnel) |
| MSZ EN 60669-1 (háztartási és hasonló, helyhez kötött villamos berendezések kapcsolói) | 2018 (EN IEC 60669-1:2018) | 7 (osztályozás, bekötési számok), 8 (jelölés), 12 (kapcsok) |
| MSZ HD 60364-6 (ellenőrzés) | 2017 (HD 60364-6:2016) | 6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás) |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-KERESZTKAPCSOLO-107-BEKOTESE-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat 932700dc · 1622 szó | ☐ | ☐ | |
| CIK-KERESZTKAPCSOLO-107-BEKOTESE-FORRAS | Források és szabványpontok (5) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |
| CIK-KERESZTKAPCSOLO-107-BEKOTESE-ABRA | Ábrák: a 4. rész blokkjai | BEK-KERESZTKAPCSOLO-107, BEK-KERESZTKAPCSOLO-107-2X107, BEK-KERESZTKAPCSOLO-107-3X107, BEK-KERESZTKAPCSOLO-107-4X107 | ☐ | ☐ | |

**Döntés (CIK-KERESZTKAPCSOLO-107-BEKOTESE):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-KERESZTKAPCSOLO-107-BEKOTESE).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-KETPOLUSU-KAPCSOLO-102-BEKOTESE – Kétpólusú kapcsoló (102) bekötése: fázis és nulla együttes bontása

Forrás: content/tudastar/r3/ketpolusu-kapcsolo-102-bekotese.md (cikkvázlat); azonosító: ketpolusu-kapcsolo-102-bekotese

Tartalmi ujjlenyomat: 6a9a7747 (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Mikor kell kétpólusú (102-es) kapcsoló, hogyan bontja együtt a fázis- és a nullavezetőt, és miért nem kapcsolhatja soha a védővezetőt vagy a PEN-t?

Ábrák: BEK-KETPOLUSU-KAPCSOLO-102 (4. rész) – az ábrák és a cikk szövege együtt hagyható jóvá.

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: A kétpólusú kapcsoló (102) egyetlen billentyűvel, két együtt mozgó érintkezővel egyszerre bontja a fázis- és a nullavezetőt. Ott használják, ahol a terv vagy a készülék gyártója a fogyasztó mindkét aktív vezetőjének bontását kéri. A védővezetőt a 102-es kapcsoló sem bonthatja, és a nullázásos berendezések közös PEN-vezetőjét sem.

*Ábra (abra-1): Kétpólusú kapcsoló (102) bekötése – a rajz a 4. részben: BEK-KETPOLUSU-KAPCSOLO-102*

#### Vezetékek táblázatban

Ebben a változatban a betáp a kapcsolódobozon át megy tovább a fogyasztóhoz, a védővezető pedig a kapcsolódobozban, a kapcsolót elkerülve, vezetékösszekötővel folytatódik.

| # | Honnan | Hová | Vezető | Szín | Szakasz |
|---|---|---|---|---|---|
| 1 | Betáp: L | Kapcsoló (102): L kapocs (betáp) | L | barna | Betáp – kapcsolódoboz |
| 2 | Betáp: N | Kapcsoló (102): N kapocs (betáp) | N | kék | Betáp – kapcsolódoboz |
| 3 | Betáp: PE | Kapcsolódoboz: PE-összekötő | PE | zöld-sárga | Betáp – kapcsolódoboz |
| 4 | Kapcsoló (102): L kimenet | Lámpa (vagy más fogyasztó): L (fázis) | kapcsolt fázis | barna | Kapcsolódoboz – lámpa |
| 5 | Kapcsoló (102): N kimenet | Lámpa (vagy más fogyasztó): N | kapcsolt nulla | kék | Kapcsolódoboz – lámpa |
| 6 | Kapcsolódoboz: PE-összekötő | Lámpa (vagy más fogyasztó): PE | PE | zöld-sárga | Kapcsolódoboz – lámpa |

#### Hogyan működik?

A 102-es kapcsolóban két érintkezőpár van, amelyeket egy billentyű egyszerre mozgat. Bekapcsolt állásban az egyik pólus a fázisvezetőt, a másik a nullavezetőt köti tovább a fogyasztó felé. Kikapcsolt állásban mindkét érintkező nyitva van: a fogyasztó mindkét üzemi kapcsa el van választva a hálózattól, a védővezetője viszont folyamatosan bekötve marad.

| Kapcsoló (102) | Lámpa (vagy más fogyasztó) |
|---|---|
| ki | nem ég |
| be | ég |

A táblázatot a szimulátor számolta a(z) ketpolusu-kapcsolo-102 netlistából (ujjlenyomat: a253fd8a): 2 kapcsolóállás, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig folytonos, és nem halad át kapcsolón; kikapcsolt állásban a lámpa fázisoldali kapcsa nem kap fázist; a nullavezetőt csak a kétpólusú kapcsoló bontja, a fázisvezetővel együtt, így kikapcsolt állásban a fogyasztó mindkét üzemi kapcsa le van választva.

A fázisvezető bontása itt is alapkövetelmény: a fázisnak ugyanazon a póluson kell be- és kilépnie. Ha a pólusokat keresztbe kötik (a fázis az egyik pólus bemenetére kerül, a fogyasztó fázisvezetője viszont a másik pólus kimenetéről indul), a szimuláció szerint bekapcsoláskor a fogyasztó nulla felőli kapcsára kerül a fázis, vagyis felcserélődik a polaritás.

Mire jó, és mire nem? A 102-es kapcsoló üzemi kapcsoló: a fogyasztót be- és kikapcsolja. Munkavégzés előtti leválasztásra nem helyettesíti az elosztóban végzett feszültségmentesítést, akkor sem, ha ki van kapcsolva. Egyes fix bekötésű készülékek (például villanybojler, szellőző) gyártói útmutatója minden pólust bontó, megadott legkisebb érintkezőnyílású kapcsolót ír elő; ilyenkor a kapcsoló névleges áramának, feszültségének és érintkezőnyílásának a készülékhez kell illenie. Hogy egy adott helyen kell-e kétpólusú kapcsolás, azt a terv vagy a gyártói előírás dönti el.

A PEN-vezetőt soha nem szabad kapcsolni. Régi, nullázásos (TN-C) berendezésben a nulla- és a védővezető egy közös vezető (PEN). Ha ezt egy kapcsoló megszakítaná, a készülék teste is elveszítené a védelmét. Ilyen berendezésben a 102-es kapcsoló nullapólusa nem kerülhet a PEN-be; a megoldást szakember tervezi meg (lásd: Földelési rendszerek).

#### Kapcsok és jelölésük

A 102-es kapcsolónak négy kapcsa van: két bemenő (fázis és nulla) és két kimenő. A jelölés gyártónként eltérhet: előfordul L és N a bemeneten, L' és N' vagy nyíl a kimeneten, de számozott kapcsok is (például 1–2 és 3–4 pólusonként). A pólusok nem cserélhetők fel tetszés szerint: a fázis be- és kimenete ugyanarra a pólusra kerüljön. Jelzőfényes kivitelnél a jelzőfény bekötése is kötött. Mindig a gyártói útmutató az irányadó.

#### A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. Feszültségmentesítés az elosztóban, a feszültségmentesítés öt szabálya szerint: leválasztás, visszakapcsolás elleni biztosítás, a feszültségmentesség megállapítása kétpólusú feszültségvizsgálóval (a vizsgáló működését előtte és utána ismert feszültségforráson ellenőrizve). A falon lévő 102-es kapcsoló kikapcsolt állása erre nem elég.
2. Azonosítás. A betáp fázis-, nulla- és védővezetőjének azonosítása – a szín nem bizonyít, az azonosítás a szakember mérésén alapul – és jelölése; meg kell győződni arról is, hogy a berendezés nem nullázásos (TN-C).
3. Védővezető. A betáp és a fogyasztó védővezetője a kapcsolódobozban, a kapcsolótól függetlenül, vezetékösszekötővel kerül össze.
4. Kapcsoló. A fázis az egyik pólus bemenetére, a nulla a másik pólus bemenetére; a kapcsolt fázis és a kapcsolt nulla az ugyanazon pólushoz tartozó kimenetekre.
5. Fogyasztó. A kapcsolt fázis az L, a kapcsolt nulla az N, a védővezető a PE kapocsra.
6. Ellenőrzés visszakapcsolás előtt: szemrevételezés, valamint a védővezető folytonosságának, a szigetelési ellenállásnak és a polaritásnak a mérése; a szakember dokumentálja.
7. Működéspróba a fenti táblázat szerint.

#### Jelölés az alaprajzon

A tervezőben a kétpólusú kapcsoló jele kör két ferde vonallal, alatta a 2-es számmal (102 → 2). A tervező szerelési rajza szakaszonként mutatja az erek számát:

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Betáp – kapcsolódoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kapcsolódoboz – lámpa | kapcsolt fázis (barna), kapcsolt nulla (kék), PE (zöld-sárga) | 3 |

A kapcsolódoboz és a fogyasztó közötti szakaszban a kék ér a kapcsolt nullavezető: a szerepe ugyanaz marad, csak kikapcsolt állásban nincs összeköttetésben a hálózat nullájával. A zöld-sárga ér itt is csak védővezető lehet.

#### Régi berendezésben

- Nullázásos (TN-C) rendszer. A közös PEN-vezetőt kapcsolni tilos; régi berendezésben a 102-es kapcsoló beépítése előtt a földelési rendszert szakembernek kell felmérnie. Ahol a PEN-vezetőt már szétválasztották, a nulla- és a védővezetőt a szétválasztási pont után újra összekötni tilos.
- Ismeretlen szerepű erek. Régi vezetékezésben a fázis és a nulla színből nem állapítható meg, és előfordul, hogy a dugaljakon vagy a dobozokban felcserélődött. Ezért a pólusok bekötése előtt mérés kell.
- Régi, porcelán vagy bakelit kapcsolók jelöletlen kapcsokkal, kopott érintkezőkkel; cseréjüknél a bekötést újra kell tervezni, nem a régit lemásolni.
- Védővezető nélküli fogyasztó. Két erű vezetékezésnél fémtestű készülék nem köthető be szakszerűen; a megoldásról szakember dönt. A hiányzó védővezetőt tilos a nullavezetőből „pótolni”: a 102-es kapcsoló mögött a kapcsolt nullára kötött fémtest kikapcsolt állásban semmihez nem csatlakozik, keresztbe kötött pólusoknál pedig bekapcsoláskor fázis alá kerül.

#### Gyakori hibák

- Keresztbe kötött pólusok: a fázis az egyik pólus bemenetére kerül, a fogyasztó fázisvezetője viszont a másik pólus kimenetéről indul. A fogyasztó működik, de felcserélődik a polaritás.
- A védővezető a kapcsolón át fut, vagy a kapcsoló harmadik, „üres” kapcsára kerül. A védővezetőt semmilyen kapcsoló nem bonthatja.
- PEN-vezető kapcsolása nullázásos berendezésben.
- A nulla- és a védővezető összekötése a kapcsolódobozban vagy a fogyasztónál. Ha a kapcsolt nullát a PE-összekötőbe kötik, bekapcsolt állásban a nulla- és a védővezető összeér: a fogyasztó üzemi árama részben a védővezetőn és a hozzá kötött fémtesteken folyik. Az áram-védőkapcsoló (FI-relé) ilyenkor kiold; FI-relé nélkül a hiba rejtve maradhat.
- A kapcsoló terhelhetősége kevés: egy villanybojler vagy fűtőkészülék árama jóval nagyobb lehet, mint egy világítási áramköré. A szükséges névleges áramot a készülék adataiból kell meghatározni (lásd a kapcsolódó kalkulátort).
- A 102-es kapcsolót leválasztónak tekintik, és kikapcsolt állásában, az elosztóban végzett feszültségmentesítés nélkül dolgoznak a fogyasztón.
- Laza kötés a nagyobb áramú pólusokon: melegedés, elszíneződés.

#### Mikor hívj szakembert?

- Mindig, ha kapcsolót vagy fix bekötésű készüléket kell bekötni, cserélni vagy áthelyezni.
- Azonnal, ha a készülék fémházának érintésekor bizsergést érzel: ne érintsd újra, kapcsold le az áramkört az elosztóban, és amíg a szakember meg nem vizsgálta, ne kapcsold vissza.
- Ha a kapcsoló vagy a fedele meleg, elszíneződött, recseg, vagy égett szagot érzel.
- Ha a készülék kikapcsolt kapcsolónál is működik, vagy bekapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha régi, nullázásos berendezésben szeretnél kétpólusú kapcsolót.
- Ha a gyártói útmutató minden pólust bontó kapcsolót ír elő, és nem tudod, a meglévő kapcsoló megfelel-e ennek.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ HD 60364-5-537 (leválasztás és kapcsolás) | 2017 (HD 60364-5-537:2016) | 537 – általános követelmények (a PEN-vezető nem kapcsolható és nem választható le) és az üzemi kapcsolás alpontja |
| MSZ HD 60364-5-51 | 2010 | 514.3 (vezetők azonosítása) |
| MSZ EN IEC 60445 | 2022 (EN IEC 60445:2021) | 6.2 (vezetők azonosítása színnel) |
| MSZ EN 60669-1 (háztartási és hasonló, helyhez kötött villamos berendezések kapcsolói) | 2018 (EN IEC 60669-1:2018) | 7 (osztályozás, bekötési számok), 8 (jelölés), 12 (kapcsok) |
| MSZ EN 60335-1 (háztartási és hasonló jellegű villamos készülékek biztonsága) | 2012, módosításokkal | 7.12.2 (a fix bekötésű készülék leválasztásáról szóló gyártói utasítás) |
| MSZ HD 60364-6 (ellenőrzés) | 2017 (HD 60364-6:2016) | 6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás) |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-KETPOLUSU-KAPCSOLO-102-BEKOTESE-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat 6a9a7747 · 1227 szó | ☐ | ☐ | |
| CIK-KETPOLUSU-KAPCSOLO-102-BEKOTESE-FORRAS | Források és szabványpontok (6) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |
| CIK-KETPOLUSU-KAPCSOLO-102-BEKOTESE-ABRA | Ábrák: a 4. rész blokkjai | BEK-KETPOLUSU-KAPCSOLO-102 | ☐ | ☐ | |

**Döntés (CIK-KETPOLUSU-KAPCSOLO-102-BEKOTESE):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-KETPOLUSU-KAPCSOLO-102-BEKOTESE).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-KETTOS-VALTOKAPCSOLO-106-6-BEKOTESE – Kettős váltókapcsoló (106+6) bekötése: két lámpa két helyről

Forrás: content/tudastar/r3/kettos-valtokapcsolo-106-6-bekotese.md (cikkvázlat); azonosító: kettos-valtokapcsolo-106-6-bekotese

Tartalmi ujjlenyomat: ec7dca3e (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Két lámpa, mindkettő két helyről: a kettős váltókapcsoló (106+6) két független váltókapcsoló egy szerelvényben. Bekötés, áthidalás, érszám, gyakori hibák.

Ábrák: BEK-KETTOS-VALTOKAPCSOLO-106-6 (4. rész) – az ábrák és a cikk szövege együtt hagyható jóvá.

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: A kettős váltókapcsoló (106+6) két egymástól független váltókapcsoló egy szerelvényben, két billentyűvel. Két ilyen kapcsolóval két lámpa kapcsolható, mindkettő két helyről, például a lépcső és a folyosó világítása a lépcső aljáról és tetejéről. Mindkét lámpakörhöz saját váltóvezeték-pár tartozik, a két kör csak a betápon osztozik.

*Ábra (abra-1): Két lámpa két helyről, kettős váltókapcsolókkal – a rajz a 4. részben: BEK-KETTOS-VALTOKAPCSOLO-106-6*

#### Vezetékek táblázatban

A váltóvezetékek itt szürkék, a kapcsolt fázisok feketék; a feliratok (1a, 2a az 1. lámpához, 1b, 2b a 2. lámpához) különböztetik meg őket.

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

#### Hogyan működik?

A kettős váltókapcsoló mindkét billentyűje egy-egy önálló váltókapcsoló: saját közös kapoccsal (C1, C2) és két kimenettel. A két K1–K2 billentyűpár úgy működik, mint két külön váltókapcsolás: az 1. lámpa akkor ég, ha a két 1. billentyű ugyanarra a váltóvezetékre áll, a 2. lámpa ugyanígy a két 2. billentyűtől függ. A két kör egymást nem befolyásolja. A szimuláció szerint mindkét körben a váltóvezeték-pár egyik ere minden állásban fázis alatt van, akkor is, ha egyik lámpa sem ég; a kikapcsolt lámpák tehát nem jelentik, hogy a dobozokban nincs feszültség.

A szimulátor mind a 16 állás-kombinációt végigszámolta. Mivel az egyik lámpa állapota a szimuláció szerint a másik kör billentyűitől független, a két kör táblázata külön is megadható:

| K1 (A hely) – 1. billentyű | K2 (B hely) – 1. billentyű | 1. lámpa |
|---|---|---|
| 0 (C1–1a) | 0 (C1–1a) | ég |
| 0 (C1–1a) | 1 (C1–2a) | nem ég |
| 1 (C1–2a) | 0 (C1–1a) | nem ég |
| 1 (C1–2a) | 1 (C1–2a) | ég |

Vetített táblázat a(z) kettos-valtokapcsolo-106-6 netlista teljes szimulációjából (ujjlenyomat: 837cd200, 16 kapcsolóállás): a(z) 1. lámpa állapota a többi billentyűtől (K1 (A hely) – 2. billentyű, K2 (B hely) – 2. billentyű) minden állásban független.

| K1 (A hely) – 2. billentyű | K2 (B hely) – 2. billentyű | 2. lámpa |
|---|---|---|
| 0 (C2–1b) | 0 (C2–1b) | ég |
| 0 (C2–1b) | 1 (C2–2b) | nem ég |
| 1 (C2–2b) | 0 (C2–1b) | nem ég |
| 1 (C2–2b) | 1 (C2–2b) | ég |

Vetített táblázat a(z) kettos-valtokapcsolo-106-6 netlista teljes szimulációjából (ujjlenyomat: 837cd200, 16 kapcsolóállás): a(z) 2. lámpa állapota a többi billentyűtől (K1 (A hely) – 1. billentyű, K2 (B hely) – 1. billentyű) minden állásban független.

A két közös kapocs. Az ábrán a betáp fázisa K1-nél az 1. billentyű közös kapcsára (C1) érkezik, és egy rövid áthidaló viszi tovább a 2. billentyű közös kapcsára (C2). Ahol a gyártó a két közös kapcsot belül összeköti, ez az áthidaló elmarad, de ilyenkor a két kör csak ugyanarról az áramkörről táplálható. Ha a két lámpakört két külön áramkörről táplálják, áthidaló nem kell (és nem is szabad), viszont mindkét kör nullavezetője a saját áramkörénél marad, a kötődobozban külön összekötőben. Ilyenkor a kapcsoló- és a kötődobozban két áramkör vezetői vannak: az egyik kismegszakító lekapcsolása nem teszi feszültségmentessé a dobozt, ezért munkavégzés előtt mindkét áramkört le kell választani, a kettős betáplálást pedig a dobozban és az elosztóban jelölni kell.

#### Kapcsok és jelölésük

A kettős váltókapcsolónak hat kapcsa van, billentyűnként egy közös és két kimenő. A jelölés gyártónként eltérhet: előfordul L1 és L2 vagy C1 és C2 a közös kapcsokra, 1a–2a és 1b–2b vagy nyilak a kimenetekre, és van, ahol a két közös kapocs belül össze van kötve. Mindig a gyártói útmutató és a kapcsolóbetét rajza az irányadó.

#### A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. Feszültségmentesítés az elosztóban, a feszültségmentesítés öt szabálya szerint, minden érintett áramkörre (a feszültségvizsgáló működését előtte és utána ismert feszültségforráson ellenőrizve).
2. Azonosítás. A négy váltóvezeték (1a, 2a, 1b, 2b) és a két kapcsolt fázis jelölése mindkét végen, mert színből nem különböztethetők meg.
3. Kötődoboz. A nullavezetők és a védővezetők egy-egy összekötőbe kerülnek a betáppal; a betáp fázisa a K1 felé menő érrel, a négy váltóvezeték a K1 és a K2 felé menő azonos jelű érrel, a két kapcsolt fázis a megfelelő lámpához menő érrel.
4. K1. A fázis C1-re, az áthidaló C1 és C2 közé (ha a gyártó belül nem kötötte össze), a váltóvezetékek a megfelelő kimenetekre.
5. K2. A váltóvezetékek a megfelelő kimenetekre, a két kapcsolt fázis C1-re, illetve C2-re.
6. Lámpák. A kapcsolt fázis az L, a nullavezető az N, a védővezető a PE kapocsra.
7. Ellenőrzés visszakapcsolás előtt: szemrevételezés, a védővezető folytonosságának, a szigetelési ellenállásnak és a polaritásnak a mérése, majd visszakapcsolás után a működéspróba a fenti két táblázat szerint.

#### Jelölés az alaprajzon

A tervezőben a kettős váltókapcsoló is a váltókapcsoló jelét kapja (kör két ferde vonallal, alatta a 6-os szám); hogy kettős kivitelű, azt a szerelvény neve vagy megjegyzése rögzíti. A tervező szerelési rajza szakaszonként mutatja az erek számát:

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (A hely) | L (barna), váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke) | 5 |
| Kötődoboz – K2 (B hely) | váltóvezeték 1a (szürke), váltóvezeték 2a (szürke), váltóvezeték 1b (szürke), váltóvezeték 2b (szürke), kapcsolt fázis 1 (fekete), kapcsolt fázis 2 (fekete) | 6 |
| Kötődoboz – 1. lámpa | kapcsolt fázis 1 (fekete), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – 2. lámpa | kapcsolt fázis 2 (fekete), N (kék), PE (zöld-sárga) | 3 |

A kötődobozos megoldásban a második kapcsolóhoz hat ér megy. Ha a négy váltóvezeték a két kapcsolódoboz között közvetlenül fut, a kötődobozhoz kevesebb ér kell; a kapcsolás logikája ugyanaz. A védőcső vagy a kábel méretét az erek száma szerint kell megválasztani.

#### Régi berendezésben

- Két külön váltókapcsoló egy keretben. Régebbi szerelésnél gyakori, hogy a „kettős” kapcsoló két önálló kapcsolóbetét; ilyenkor mindkettőt külön kell betáplálni vagy áthidalni.
- Közös nullavezető két áramkörre. Régi berendezésben előfordul, hogy két áramkör egy nullavezetőn osztozik. Ha felújításkor a két áramkör külön áram-védőkapcsolóra (FI-relére) kerül, ez kioldást okoz. Veszélyesebb, hogy az egyik áramkör lekapcsolása után a közös nullavezetőn a másik áramkör árama tovább folyik, így a megbontásakor áramütés érheti a szerelőt; ha pedig a két áramkör különböző fázisról kap táplálást, a közös nullavezető szakadásakor a két áramkör fogyasztói sorba kapcsolódva a két fázis közötti feszültségre kerülhetnek, ami a készülékeket túlfeszültséggel károsíthatja, és tüzet okozhat. A szétválasztás szakembert igényel.
- Jelöletlen váltóvezetékek. Négy azonos színű ér egy dobozban: a szerepük csak méréssel állapítható meg.
- Védővezető nélküli lámpakiállás, alumínium vezetők: lásd az egypólusú kapcsoló cikket.

#### Gyakori hibák

- Hiányzó áthidaló. Ha a betáp csak C1-re kerül, és a két közös kapocs belül nincs összekötve, a szimuláció szerint a 2. lámpa egyik állásban sem gyullad ki.
- Összekevert váltóvezeték-párok. Ha a B helyen az 1a és az 1b váltóvezeték helyet cserél, a szimuláció szerint a két kör „összeakad”: az A hely mindkét billentyűje mindkét lámpára hat, és a B helyről egyik lámpa sem kapcsolható minden állásban.
- Áthidaló két külön áramkör között. Ha a két kört két áramkörről táplálják, a közös kapcsok áthidalása a két áramkört összeköti; ez tilos. Különböző fázisok között ez zárlat; azonos fázisnál a két áramkör egymást táplálja, így egyik kismegszakító lekapcsolása sem teszi feszültségmentessé a kört.
- Két áramkör nullavezetőjének összekötése a kötődobozban.
- Zöld-sárga ér váltóvezetékként, vagy jelöletlen kék ér fázisként.
- Laza kötés a közös kapcson vagy az áthidalón: mindkét lámpa egyszerre kimarad.

#### Mikor hívj szakembert?

- Mindig, ha kapcsolót, lámpát vagy kötést kell bekötni, cserélni vagy áthelyezni.
- Ha az egyik billentyű a másik lámpára is hat, vagy egy lámpa csak bizonyos állásokban kapcsolható.
- Ha kapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a két lámpakört külön áramkörről szeretnéd táplálni.
- Ha a kapcsoló vagy a doboz meleg, elszíneződött, recseg, vagy égett szagot érzel.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ HD 60364-5-537 (leválasztás és kapcsolás) | 2017 (HD 60364-5-537:2016) | 537 – az üzemi (funkcionális) kapcsolásról szóló alpont: egypólusú kapcsolókészülék nem kerülhet a nullavezetőbe |
| MSZ HD 60364-5-51 | 2010 | 514.3 (vezetők azonosítása) |
| MSZ EN IEC 60445 | 2022 (EN IEC 60445:2021) | 6.2 (vezetők azonosítása színnel) |
| MSZ EN 60669-1 (háztartási és hasonló, helyhez kötött villamos berendezések kapcsolói) | 2018 (EN IEC 60669-1:2018) | 7 (osztályozás, bekötési számok), 8 (jelölés), 12 (kapcsok) |
| MSZ HD 60364-6 (ellenőrzés) | 2017 (HD 60364-6:2016) | 6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás) |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-KETTOS-VALTOKAPCSOLO-106-6-BEKOTESE-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat ec7dca3e · 1546 szó | ☐ | ☐ | |
| CIK-KETTOS-VALTOKAPCSOLO-106-6-BEKOTESE-FORRAS | Források és szabványpontok (5) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |
| CIK-KETTOS-VALTOKAPCSOLO-106-6-BEKOTESE-ABRA | Ábrák: a 4. rész blokkjai | BEK-KETTOS-VALTOKAPCSOLO-106-6 | ☐ | ☐ | |

**Döntés (CIK-KETTOS-VALTOKAPCSOLO-106-6-BEKOTESE):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-KETTOS-VALTOKAPCSOLO-106-6-BEKOTESE).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-KISMEGSZAKITO – Kismegszakító: B, C és D jelleggörbe, az Ib ≤ In ≤ Iz elve

Forrás: content/tudastar/r3/kismegszakito.md (cikkvázlat); azonosító: kismegszakito

Tartalmi ujjlenyomat: 539e0515 (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Mit véd a kismegszakító, és mit nem? Hő- és elektromágneses kioldó, B, C és D jelleggörbe, feliratok, az Ib ≤ In ≤ Iz elve és az áramkörök az elosztóban.

A cikk kiadásához a szöveg jóváhagyásán túl még hiányzik: a jelleggörbe-ábra (B/C/D kioldási tartományok) még nincs kész. A szöveg ettől függetlenül jóváhagyható; a cikk csak a hiány pótlása és az új jóváhagyás után jelenhet meg.

Ábrák: BEK-KISMEGSZAKITO-ARAMKOROK (4. rész) – az ábrák és a cikk szövege együtt hagyható jóvá.

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: A kismegszakító az áramkör vezetékét védi túlterhelés és rövidzárlat ellen: túlterhelésnél a hőkioldója késleltetve, zárlatnál az elektromágneses kioldója azonnal bont. A feliratában a betű (B, C vagy D) azt mutatja, a névleges áram hányszorosánál old ki azonnal, a szám pedig a névleges áramot. A névleges áram nem lehet kisebb az áramkör üzemi áramánál, és nem lehet nagyobb a vezeték terhelhetőségénél: Ib ≤ In ≤ Iz.

*Ábra (abra-1): B, C és D jelleggörbe (sematikus) – ez az ábra még nincs kész (a cikk kiadását akadályozza)*

#### Mire való?

A vezetékben folyó áram hőt termel, és a túl nagy áram tartósan túlmelegíti a szigetelést és a kötéseket. A kismegszakító ezt akadályozza meg: elsősorban a vezetéket védi, nem a csatlakoztatott készüléket. A jelenségek részletes magyarázata a Rövidzárlat és túlterhelés cikkben olvasható.

TN-rendszerben a kismegszakító az érintésvédelemben is részt vesz. Ha a fázisvezető egy fémházas készülék testével zárlatba kerül, a védővezetőn nagy hibaáram folyik, és a kismegszakító ezt is lekapcsolja (önműködő lekapcsolás). Ehhez a hurokimpedanciának elég kicsinek kell lennie. Egy ember testén átfolyó, már életveszélyes áram viszont nagyságrendekkel kisebb annál, amelyre a kismegszakító kiold, ezért ha valaki a fázist érinti, a kismegszakító nem old ki; erre a kiegészítő védelemre az áram-védőkapcsoló (FI-relé) szolgál. TT-rendszerben a földelési ellenállás miatt a testzárlati áram jellemzően a kismegszakító kioldásához is kicsi; ott az önműködő lekapcsolást is áram-védőkapcsoló végzi.

#### Két kioldó egy készülékben

- Hőkioldó (ikerfém). Az áram melegíti, ettől elhajlik, és kioldja a zárszerkezetet. Minél nagyobb a túlterhelés, annál hamarabb old ki; kis túlterhelésnél ez egy óra vagy annál is több lehet.
- Elektromágneses kioldó. Egy tekercs, amely nagy áramnál azonnal, a másodperc töredéke alatt kiold.
- Ívoltó kamra. A bontáskor keletkező ívet hűti és megszakítja.

A kismegszakító szabadkioldású: ha a kart bekapcsolt helyzetben tartják, hibánál akkor is kiold.

#### B, C és D jelleggörbe

A jelleggörbe betűje azt mutatja meg, a névleges áram (In) hányszorosánál működik az elektromágneses kioldó. A tartomány alsó határa alatt még nem old ki azonnal, a felső határánál már biztosan igen (MSZ EN 60898-1).

| Jelleggörbe | Azonnali kioldás | Jellemző alkalmazás |
|---|---|---|
| B | 3–5 · In | lakások általános áramkörei, hosszabb vezetékek |
| C | 5–10 · In | nagyobb bekapcsolási áramú fogyasztók (motorok, transzformátorok, sok LED-meghajtó) |
| D | 10–20 · In | nagyon nagy bekapcsolási áramú berendezések; lakásban ritka |

A választás tervezői döntés. Minél „magasabb” a betű, annál nagyobb zárlati áram kell az azonnali kioldáshoz, vagyis annál kisebb hurokimpedancia. Hosszú vagy vékony vezetéknél ezért előfordulhat, hogy egy C vagy D kismegszakító zárlatkor csak a lassú hőkioldóval működne; testzárlatnál ilyenkor a fémtesteken a megengedettnél tovább maradhat veszélyes érintési feszültség. A tartományok felső határát a Villanyrajz méretezési segédszámítása is használja; ezek a táblázatértékek még szakmai jóváhagyásra várnak.

A hőkioldó tartományában két egyezményes áram számít: 1,13 · In-nél a kismegszakító legalább egy óráig nem old ki, 1,45 · In-nél egy órán belül biztosan kiold (63 A névleges áramig; a vizsgálati feltételeket a szabvány rögzíti). Ezt az utóbbit nevezik egyezményes kioldóáramnak (I2).

#### Kapcsok és feliratok

- Betű és szám, például „C16”: C jelleggörbe, 16 A névleges áram. Hogy egy áramkörhöz mekkora névleges áram kell, az méretezés kérdése (lásd lent).
- Keretbe írt szám: a névleges zárlati megszakítóképesség amperben. Ennyi zárlati áramot tud biztonságosan megszakítani; a beépítés helyén várható legnagyobb zárlati áramnál nem lehet kisebb.
- Pólusszám: 1P (egy fázis), 1P+N, 2P, 3P, 3P+N. A lakásban az egyfázisú áramkörök kismegszakítója jellemzően egypólusú: csak a fázist bontja.
- Kapcsok: a készülék egyik oldalán a betáp, a másikon a kimenő vezeték csatlakozik (gyakran 1 és 2 jelöléssel). A kismegszakítók betápja sokszor fésűs sínről érkezik. A kapocsjelölés, a betáp oldala és a megengedett vezetőkeresztmetszet gyártónként eltérhet; a gyártói útmutató az irányadó.

#### Az Ib ≤ In ≤ Iz elve

- Ib – az áramkör tervezett üzemi árama (az Áram teljesítményből kalkulátor segít kiszámolni).
- In – a kismegszakító névleges árama.
- Iz – a vezeték tartós terhelhetősége az adott beépítési körülmények között.

A második feltétel: I2 ≤ 1,45 · Iz. Mivel az MSZ EN 60898-1 szerinti kismegszakítónál I2 = 1,45 · In, ez az In ≤ Iz feltétellel együtt teljesül.

Az Iz nem csak a keresztmetszettől függ, hanem a szigeteléstől, a szerelési módtól (falba süllyesztve, védőcsőben, falon), a környezeti hőmérséklettől és attól is, hány terhelt vezeték fut együtt. A számértékeket a Villanyrajz egy helyen, forrással tartja nyilván; ezek jóváhagyásra várnak, ezért ez a cikk nem ad keresztmetszet–névleges áram párokat. A szakmában elterjedt ökölszabályok sem helyettesítik a méretezést, mert nem veszik figyelembe a beépítés körülményeit.

A teljes ellenőrzéshez a túlterhelés elleni védelmen túl a feszültségesés, a hurokimpedancia (önműködő lekapcsolás) és a megszakítóképesség is hozzátartozik. A tervezőben az Eszközök → Méretezés segédszámítás áramkörönként végigveszi ezeket; ez tervezői ellenőrzést segít, nem tervezői méretezés.

#### Áramkörök az elosztóban

Minden áramkör saját kismegszakítót kap. A 2. ábrán két dugaljkör egy közös áram-védőkapcsoló után kapcsolódik; a kismegszakítókat fésűs sín táplálja.

*Ábra (abra-2): Két dugaljkör saját kismegszakítóval, közös FI-relé után – a rajz a 4. részben: BEK-KISMEGSZAKITO-ARAMKOROK*

| Q1 áram-védőkapcsoló (FI-relé) | F1 kismegszakító (nappali dugaljak) | F2 kismegszakító (konyhai dugaljak) | X1 dugalj (nappali) | X2 dugalj (konyha) |
|---|---|---|---|---|
| be (bekapcsolva) | be (bekapcsolva) | be (bekapcsolva) | feszültség alatt | feszültség alatt |
| be (bekapcsolva) | be (bekapcsolva) | ki (kikapcsolva) | feszültség alatt | nem ad feszültséget |
| be (bekapcsolva) | ki (kikapcsolva) | be (bekapcsolva) | nem ad feszültséget | feszültség alatt |
| be (bekapcsolva) | ki (kikapcsolva) | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | be (bekapcsolva) | be (bekapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | be (bekapcsolva) | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | ki (kikapcsolva) | be (bekapcsolva) | nem ad feszültséget | nem ad feszültséget |
| ki (kikapcsolva) | ki (kikapcsolva) | ki (kikapcsolva) | nem ad feszültséget | nem ad feszültséget |

A táblázatot a szimulátor számolta a(z) kismegszakito-aramkorok netlistából (ujjlenyomat: 3bf085c5): 8 állapotkombináció, mindegyik egyezik a várt működéssel. Minden sorban azonos: Q1 áram-védőkapcsoló (FI-relé): nem old ki. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig és védőérintkezőig folytonos, és nem halad át kapcsolón; a kismegszakító csak a fázist bontja; minden dugalj kismegszakítón és áram-védőkapcsolón át kap feszültséget; a nullavezetőt csak a kétpólusú áram-védőkapcsoló bontja, a fázisvezetővel együtt; normál üzemben nem folyik különbözeti áram. „Kiold”: a védett oldalról a pólusokat megkerülve (a védővezetőn, a földön vagy a próbaellenálláson át) áram folyik; áramerősséget, érintési feszültséget és kioldási időt a szimuláció nem számol.

Az F1 lekapcsolása csak a nappali dugaljak táplálását szünteti meg, a konyhaiakét nem; az áram-védőkapcsoló mindkét áramkört lekapcsolja. A kismegszakító csak a fázist bontja, a nullavezető a nullasínen összeköttetésben marad: egy kismegszakító lekapcsolása önmagában nem feszültségmentesítés (lásd: A feszültségmentesítés öt szabálya).

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

#### Kismegszakító, FI-relé, kombinált védelem

A kismegszakító túláram ellen véd, az áram-védőkapcsoló a befolyó és a visszatérő áram különbségét figyeli. A kettő nem helyettesíti egymást. A kombinált védelem (RCBO, „áramvédős kismegszakító”) egy készülékben egyesíti a kettőt, áramkörönként; így egy áramkör szivárgása nem kapcsolja le a többit.

#### Régi berendezésben

- Olvadóbiztosítók. A kiégett betét csak azonos névleges áramú és jellegű betétre cserélhető. Az átkötött („megpatkolt”) biztosíték életveszélyes és tűzveszélyes.
- Menetes „automata biztosíték”, amely a biztosítófoglalatba csavarható; az állapotát és a megfelelőségét szakember mérje fel.
- Biztosító vagy kapcsoló a nullavezetőben. Régi elosztókban előfordul. Ha a nullavezetőben lévő biztosító kiold vagy kiolvad, a fogyasztók nem működnek, de fázison maradnak: a készülék belseje és a nullavezető fogyasztó felőli része is feszültség alá kerül. Egypólusú védelem nem bonthatja a nullavezetőt, a közös nulla- és védővezetőt (PEN) pedig semmilyen kapcsoló- vagy védelmi készülék nem bonthatja.
- Alumínium vezetékek: a terhelhetőségük kisebb, mint az azonos keresztmetszetű rézé, ezért a régi kismegszakító névleges árama túl nagy lehet hozzájuk.
- Nincs áram-védőkapcsoló, nincs külön PE-sín, elöregedett, éghető anyagú elosztódoboz.
- Sokszor zárlatra kioldott kismegszakító: az érintkezői beéghettek, szakember vizsgálja meg.

#### Gyakori hibák

- Nagyobb kismegszakító, „mert mindig lekapcsol”. A vezeték így túlmelegedhet, mielőtt a védelem működne. Az okot (túlterhelés, hibás készülék, laza kötés) kell megkeresni.
- Indokolatlanul magas jelleggörbe: zárlatkor elmaradhat az azonnali kioldás, testzárlatnál pedig az önműködő lekapcsolás nem elég gyors.
- Nullavezető az egypólusú kismegszakítón át, a fázis pedig közvetlenül a fogyasztóra jut: lekapcsolt kismegszakító mellett is fázis marad a fogyasztón. A szimulátor az ilyen netlistát elutasítja.
- Dugaljkör kismegszakító nélkül, például közvetlenül az áram-védőkapcsoló védett kapcsáról: az áramkörnek nincs túláramvédelme. A szimulátor ezt is kiszűri.
- Idegen nullasín: egy áramkör nullavezetője egy másik áram-védőkapcsoló utáni vagy az áram-védőkapcsoló előtti nullasínen. Terheléskor kioldást okoz; a szimulátor ezt is kiszűri.
- Közös nullavezető két áramkörben: a lekapcsolt áramkör nullája ilyenkor is áramot vezethet.
- Laza vagy túlhúzott kapocs: melegedés, elszíneződés.
- Hiányzó vagy téves feliratozás az elosztóban: rossz áramkört kapcsolnak le.
- Túl kicsi megszakítóképesség a beépítés helyén várható zárlati áramhoz képest.

#### Mikor hívj szakembert?

- Ha egy kismegszakító ismételten lekapcsol, visszakapcsoláskor azonnal kiold, vagy egy biztosítóbetét ismételten kiolvad. Ne kapcsold vissza újra és újra.
- Ha az elosztó meleg, elszíneződött, kattog, zümmög, vagy égett szagot érzel. Füst vagy tűz esetén hívd a 112-t.
- Ha nagy fogyasztót (főzőlap, sütő, villanybojler, klíma, elektromosautó-töltő) kötnél egy meglévő áramkörre.
- Ha olvadóbiztosítós vagy áram-védőkapcsoló nélküli elosztód van.
- Bármilyen munkához az elosztóban. Az elosztó burkolata mögött a lekapcsolt kismegszakítók mellett is feszültség alatti részek vannak: a burkolatot ne szereld le. A mérőhely és a fogyasztásmérő előtti rész az elosztói engedélyes hatásköre.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ EN 60898-1 (kismegszakítók háztartási és hasonló berendezések túláramvédelmére) | 2019 | 5.3.5 (B, C, D pillanatkioldási tartományok); 8.6.1 és 7. táblázat (1,13 · In és 1,45 · In egyezményes áramok); 6 (jelölések) |
| MSZ HD 60364-4-43 (túláram elleni védelem) | 2010 | 433.1 (Ib ≤ In ≤ Iz és I2 ≤ 1,45 · Iz), 434 (zárlat elleni védelem), 434.5.1 (megszakítóképesség) |
| MSZ HD 60364-5-52 (kábel- és vezetékrendszerek) | 2011 | B melléklet (terhelhetőség, helyesbítő tényezők) – a számértékek kizárólag a tervezőprogram méretezési táblázataiban (a lektori csomag 1. része), jóváhagyásra várva |
| MSZ HD 60364-4-41 (áramütés elleni védelem) | 2007 | 411.3.2 (önműködő lekapcsolás), 411.4.4 (Zs · Ia ≤ U0, TN-rendszer) |
| MSZ HD 60364-4-46 (leválasztás és kapcsolás) | ellenőrizendő | 461.2 (TN-C rendszerben a PEN-vezető nem választható le és nem kapcsolható) |
| MSZ EN 61009-1 (beépített túláramvédelemmel ellátott áram-védőkapcsolók, RCBO) | 2013 | általános követelmények; a B, C, D jelleggörbe az MSZ EN 60898-1-gyel azonos értelmű |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-KISMEGSZAKITO-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat 539e0515 · 1661 szó | ☐ | ☐ | |
| CIK-KISMEGSZAKITO-FORRAS | Források és szabványpontok (6) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |
| CIK-KISMEGSZAKITO-ABRA | Ábrák: a 4. rész blokkjai | BEK-KISMEGSZAKITO-ARAMKOROK | ☐ | ☐ | |

**Kérdés a lektorhoz (CIK-KISMEGSZAKITO-Q1).** A B, C, D pillanatkioldási tartományok (3–5, 5–10, 10–20 · In) és az 1,13 / 1,45 · In egyezményes áramok egyeznek-e a hatályos MSZ EN 60898-1-gyel? A felső határokat a tervezőprogram méretezési segédszámítása is használja (a lektori csomag 1. része).

Válasz (CIK-KISMEGSZAKITO-Q1):

**Kérdés a lektorhoz (CIK-KISMEGSZAKITO-Q2).** Szükséges-e a cikkben a megszakítóképesség hazai minimumára (elosztói előírás) utalni, vagy elég a „tervezői döntés” megfogalmazás?

Válasz (CIK-KISMEGSZAKITO-Q2):

**Kérdés a lektorhoz (CIK-KISMEGSZAKITO-Q3).** A „Jellemző alkalmazás” oszlop (B: lakás általános áramkörei, C: nagy bekapcsolási áram, D: nagyon nagy bekapcsolási áram) elfogadható-e így, számok nélkül?

Válasz (CIK-KISMEGSZAKITO-Q3):

**Kérdés a lektorhoz (CIK-KISMEGSZAKITO-Q4).** A TT-rendszerre tett állítás („a testzárlati áram jellemzően a kismegszakító kioldásához is kicsi; ott az önműködő lekapcsolást is áram-védőkapcsoló végzi”) elfogadható-e így, számok nélkül?

Válasz (CIK-KISMEGSZAKITO-Q4):

**Kérdés a lektorhoz (CIK-KISMEGSZAKITO-Q5).** Az MSZ HD 60364-4-46 461.2 pontja (TN-C rendszerben a PEN-vezető nem választható le és nem kapcsolható) a hatályos hazai kiadásban is így szerepel-e?

Válasz (CIK-KISMEGSZAKITO-Q5):

**Döntés (CIK-KISMEGSZAKITO):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-KISMEGSZAKITO).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-VALTOKAPCSOLO-106-BEKOTESE – Váltókapcsoló (106) bekötése: egy lámpa két helyről

Forrás: content/tudastar/r3/valtokapcsolo-106-bekotese.md (cikkvázlat); azonosító: valtokapcsolo-106-bekotese

Tartalmi ujjlenyomat: 6ed95068 (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: Két váltókapcsolóval (106) egy lámpa két helyről kapcsolható. Közös kapocs, váltóvezetékek, kapcsolóállás-táblázat, érszám és a jellemző bekötési hibák.

Ábrák: BEK-VALTOKAPCSOLO-106 (4. rész) – az ábrák és a cikk szövege együtt hagyható jóvá.

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: Két váltókapcsolóval (106) egy lámpa két helyről kapcsolható, például a folyosó két végéről vagy a hálószoba ajtajától és az ágy mellől. A betáp fázisa az első kapcsoló közös kapcsára kerül, a két kapcsoló 1-es és 2-es kapcsait két váltóvezeték köti össze, a második kapcsoló közös kapcsáról pedig a kapcsolt fázis megy a lámpához. Bármelyik kapcsoló átváltása megfordítja a lámpa állapotát.

*Ábra (abra-1): Váltókapcsolás két 106-os kapcsolóval – a rajz a 4. részben: BEK-VALTOKAPCSOLO-106*

#### Vezetékek táblázatban

A váltóvezetékek itt mindkét szakaszban szürkék, és az „1”, illetve „2” felirat különbözteti meg őket; a fázisszínek közötti választás nem kötött.

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

#### Hogyan működik?

A váltókapcsolónak három kapcsa van: egy közös (C) és két kimenő (1 és 2). A billentyű a közös kapcsot hol az 1-es, hol a 2-es kimenettel köti össze; „ki” állása nincs. Az első kapcsoló (K1) így a fázist az 1-es vagy a 2-es váltóvezetékre teszi, a második (K2) pedig a lámpát az 1-es vagy a 2-es váltóvezetékre köti. A lámpa akkor ég, ha a két kapcsoló ugyanarra a váltóvezetékre áll. Egyes szakmai szövegek alternatív vagy korrespondáló kapcsolásnak is nevezik.

| K1 (A hely) | K2 (B hely) | Lámpa |
|---|---|---|
| 0 (közös–1) | 0 (közös–1) | ég |
| 0 (közös–1) | 1 (közös–2) | nem ég |
| 1 (közös–2) | 0 (közös–1) | nem ég |
| 1 (közös–2) | 1 (közös–2) | ég |

A táblázatot a szimulátor számolta a(z) valtokapcsolo-106 netlistából (ujjlenyomat: 909db559): 4 kapcsolóállás, mindegyik egyezik a várt működéssel. Egyik állásban sincs L–N, L–PE vagy N–PE zárlat; a védővezető minden fémtestig folytonos, és nem halad át kapcsolón; kikapcsolt állásban a lámpa fázisoldali kapcsa nem kap fázist; a nullavezető egyik állásban sem halad át kapcsolón. Lámpa: bármelyik kapcsoló átváltása megfordítja az állapotát.

A táblázatból az is látszik, hogy a billentyű állása önmagában nem mutatja, ég-e a lámpa: ugyanaz az állás a másik kapcsoló helyzetétől függően lehet „be” vagy „ki”. A nullavezető és a védővezető a kötődobozban közvetlenül jut a lámpához; egyik kapcsolón sem halad át.

A kikapcsolt lámpa mellett is van feszültség. A szimuláció szerint a két váltóvezeték közül minden állásban pontosan az egyik fázis alatt van, akkor is, ha a lámpa nem ég; az első kapcsoló közös kapcsa pedig mindig fázist kap. A kikapcsolt lámpa tehát semmit nem árul el arról, hogy a kapcsolódobozokban és a kötődobozban van-e feszültség: munkavégzés előtt az áramkört az elosztóban kell leválasztani.

Ha a két váltóvezetéket az egyik kapcsolónál felcserélik (1-es a 2-esre), a kapcsolás a szimuláció szerint ugyanúgy működik, csak az állások értelmezése fordul meg. Ez nem hiba.

#### Kapcsok és jelölésük

A közös kapocs jelölése gyártónként eltér: lehet L, P, C, egy eltérő színű csavar vagy egy külön nyíl. A két kimenet többnyire 1 és 2, vagy két nyíl. A közös kapocs helye sem egységes: nem mindig középen van. A gyártói útmutató és a kapcsolóbetét hátoldali rajza az irányadó; enélkül a közös kapcsot a még be nem kötött kapcsolón, folytonosságméréssel kell azonosítani.

A váltókapcsoló egypólusú kapcsolóként is beköthető (a fázis a közös kapocsra, a kapcsolt fázis az egyik kimenetre), ezért sok gyártó csak ezt forgalmazza. Fordítva nem működik: két egypólusú kapcsolóval váltókapcsolás nem építhető.

#### A szerelés menete szakembernek

A sorrend szakembernek szól, és feszültségmentes állapotot feltételez. Ha nem vagy villanyszerelő, ne használd szerelési útmutatóként.

1. Feszültségmentesítés az elosztóban, a feszültségmentesítés öt szabálya szerint (a feszültségvizsgáló működését előtte és utána ismert feszültségforráson ellenőrizve). A lámpa kikapcsolt állapota nem elég: a váltóvezetékek egyike ilyenkor is fázis alatt van. A kötődobozban és a két kapcsolódobozban más áramkör vezetői is lehetnek.
2. Azonosítás. A betáp vezetőinek, a két váltóvezetéknek és a lámpához menő kapcsolt fázisnak az azonosítása és jelölése mindkét végen.
3. Kötődoboz. A betáp nullavezetője a lámpa nullavezetőjével, a védővezető a lámpa védővezetőjével kerül egy-egy összekötőbe. A betáp fázisa a K1 közös kapcsához menő érrel, a két váltóvezeték a K1 és a K2 felé menő azonos számú érrel, a K2 közös kapcsáról visszatérő kapcsolt fázis a lámpához menő érrel kerül össze.
4. Kapcsolók. K1-en a fázis a közös kapocsra, a két váltóvezeték az 1-es és a 2-es kapocsra; K2-n a két váltóvezeték az 1-es és a 2-es kapocsra, a kapcsolt fázis a közös kapocsra.
5. Lámpa. A kapcsolt fázis az L, a nullavezető az N, a védővezető a PE kapocsra.
6. Ellenőrzés visszakapcsolás előtt: szemrevételezés, valamint a védővezető folytonosságának, a szigetelési ellenállásnak és a polaritásnak a mérése; a szakember dokumentálja.
7. Működéspróba: mind a négy állás-kombináció a fenti táblázat szerint működik, és bármelyik kapcsoló átváltása megfordítja a lámpa állapotát.

A váltóvezetékek a kötődoboz kihagyásával, a két kapcsolódoboz között közvetlenül is futhatnak; a kapcsolás logikája és a táblázat ilyenkor is ugyanaz, csak a szakaszok érszáma változik.

#### Jelölés az alaprajzon

A tervezőben a váltókapcsoló jele kör két ferde vonallal, alatta a 6-os számmal (106 → 6); egy váltókapcsolásnál két ilyen jel szerepel. A tervező szerelési rajza szakaszonként mutatja az erek számát:

| Szakasz | Vezetők | Érszám |
|---|---|---|
| Elosztó – kötődoboz | L (barna), N (kék), PE (zöld-sárga) | 3 |
| Kötődoboz – K1 (A hely) | L (barna), váltóvezeték 1 (szürke), váltóvezeték 2 (szürke) | 3 |
| Kötődoboz – K2 (B hely) | váltóvezeték 1 (szürke), váltóvezeték 2 (szürke), kapcsolt fázis (fekete) | 3 |
| Kötődoboz – lámpa | kapcsolt fázis (fekete), N (kék), PE (zöld-sárga) | 3 |

A kapcsolókhoz menő szakaszokban nincs nullavezető. Ha ide háromeres kábel kerül, a zöld-sárga ér akkor is csak védővezető lehet, a kék ér pedig csak a végein tartósan jelölve szolgálhat fázis- vagy váltóvezetőként.

#### Régi berendezésben

- Jelöletlen közös kapocs. A régi váltókapcsolók kapcsai gyakran jelöletlenek; csere előtt a régi bekötés sem biztos, hogy helyes volt.
- Nullavezető a váltóvezetékek között. Ha egy régi kapcsolódobozban a váltóvezetékek mellett nullavezetőt találsz, az hibás vagy ma nem elfogadott bekötésre utalhat. A szimuláció szerint, ha az egyik váltóvezeték a nullához kapcsolódik, bizonyos kapcsolóállásban zárlat keletkezik; ha pedig a váltóvezetékeken fázis és nulla fut, és a lámpa a két kapcsoló közös kapcsa közé kerül, zárlat nincs, de az egyik kikapcsolt állásban a lámpa mindkét kapcsa fázis alatt van. Ezt szakembernek kell felmérnie.
- Védővezető nélküli lámpakiállás, alumínium vezetők, szigetelőszalagos kötések a kapcsolódobozban: ugyanazok a kockázatok, mint az egypólusú kapcsolónál.
- Megbízhatatlan színek. A régi kábelekben a váltóvezetékek bármilyen színűek lehetnek, akár kékek is: egy régi dobozban talált kék ér lehet fázis alatt álló váltóvezeték.

#### Gyakori hibák

- A betáp nem a közös kapocsra került. A szimuláció szerint, ha a fázis az első kapcsoló 1-es kapcsára jut a közös helyett, a négy állás-kombinációból csak egyben ég a lámpa: az első kapcsoló egyszerű be-ki kapcsolóként viselkedik, a második pedig csak akkor működik, ha az első egy bizonyos állásban van. Ugyanez a tünet, ha a második kapcsolón a kapcsolt fázis nem a közös kapocsról indul.
- Zöld-sárga ér váltóvezetékként. Tilos; a zöld-sárga ér csak védőfunkciójú vezető (védővezető, PEN-, potenciálkiegyenlítő vezető) lehet, fázis- vagy nullavezető soha.
- Jelöletlen kék ér váltóvezetékként. A következő szerelő nullavezetőnek nézheti.
- A lámpa fázisa a kötődobozban a betáp fázisára kerül a K2 közös kapcsáról visszatérő kapcsolt fázis helyett: a lámpa folyamatosan ég, egyik kapcsoló sem hat rá.
- Kikapcsolva derengő LED-lámpa. Hosszú, egymás mellett futó váltóvezetékeknél a kapacitív csatolás kis áramot juttathat a lámpára; jelzőfényes kapcsoló is okozhatja. Az okot szakember méréssel keresi meg.
- Laza kötés a közös kapcson: a lámpa egyik helyről sem kapcsolható megbízhatóan.

#### Mikor hívj szakembert?

- Mindig, ha kapcsolót, lámpát vagy kötést kell bekötni, cserélni vagy áthelyezni.
- Ha a lámpa csak az egyik kapcsolóról vagy csak bizonyos állásokban kapcsolható.
- Ha a lámpa kikapcsolva dereng vagy villog, vagy kapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a kapcsoló vagy a doboz meleg, elszíneződött, recseg, vagy égett szagot érzel.
- Ha három vagy több helyről szeretnéd kapcsolni a lámpát (lásd: Keresztkapcsoló (107) bekötése), vagy okoskapcsolót építenél be.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ HD 60364-5-537 (leválasztás és kapcsolás) | 2017 (HD 60364-5-537:2016) | 537 – az üzemi (funkcionális) kapcsolásról szóló alpont: egypólusú kapcsolókészülék nem kerülhet a nullavezetőbe |
| MSZ HD 60364-5-51 | 2010 | 514.3 (vezetők azonosítása) |
| MSZ EN IEC 60445 | 2022 (EN IEC 60445:2021) | 6.2 (vezetők azonosítása színnel) |
| MSZ EN 60669-1 (háztartási és hasonló, helyhez kötött villamos berendezések kapcsolói) | 2018 (EN IEC 60669-1:2018) | 7 (osztályozás, bekötési számok), 8 (jelölés), 12 (kapcsok) |
| MSZ HD 60364-6 (ellenőrzés) | 2017 (HD 60364-6:2016) | 6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás) |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-VALTOKAPCSOLO-106-BEKOTESE-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat 6ed95068 · 1423 szó | ☐ | ☐ | |
| CIK-VALTOKAPCSOLO-106-BEKOTESE-FORRAS | Források és szabványpontok (5) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |
| CIK-VALTOKAPCSOLO-106-BEKOTESE-ABRA | Ábrák: a 4. rész blokkjai | BEK-VALTOKAPCSOLO-106 | ☐ | ☐ | |

**Döntés (CIK-VALTOKAPCSOLO-106-BEKOTESE):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-VALTOKAPCSOLO-106-BEKOTESE).

Megjegyzés a blokkhoz (forrás, kiadás):

### CIK-VILAGITASI-KAPCSOLASOK – Világítási kapcsolások: melyik kapcsoló mikor kell? (101–107)

Forrás: content/tudastar/r3/vilagitasi-kapcsolasok.md (cikkvázlat); azonosító: vilagitasi-kapcsolasok

Tartalmi ujjlenyomat: a7a9b850 (a cikk teljes szövegéé: cím, összefoglaló, szakaszok, táblák, források) – a Tudástár lektori rekordja ehhez kötődik: ha a szöveg a jóváhagyás után bármiben változik, a cikk nem jelenik meg („újraellenőrzendő”), és új jóváhagyás kell. Összefoglaló: A 101, 102, 105, 106, 106+6 és 107 kapcsolás összevetése: hány helyről, hány lámpakört kapcsol, hány ér kell hozzá, és mi alapján válassz közülük.

A cikk kiadásához a szöveg jóváhagyásán túl még hiányzik: az áttekintő ábra a tervező szerelési rajzára épülne (Szerelési rajz nézet, még nincs kész). A szöveg ettől függetlenül jóváhagyható; a cikk csak a hiány pótlása és az új jóváhagyás után jelenhet meg.

Ennek a cikknek nincs netlistás bekötési ábrája (a 4. részben nem szerepel).

> **Veszély – életveszély: áramütés- és tűzveszély.** A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. Villamos szerelést csak szakképzett személy végezhet, és csak a munkaterület feszültségmentesítése, valamint a feszültségmentesség ellenőrzése után; feszültség alatti munkára ez az oldal nem ad utasítást. A mérőhelyi és a csatlakozási munka az elosztói engedélyes hatásköre. A kapcsok jelölése gyártónként eltérhet; mindig a gyártói útmutató az irányadó.

Röviden: A lakások világítása néhány alapkapcsolásból épül fel: egy lámpát egy helyről a 101-es, két lámpakört egy helyről a 105-ös, egy lámpát két helyről két 106-os kapcsoló kapcsol, három vagy több helyhez a két 106-os közé 107-es keresztkapcsolók kerülnek. A kettős váltókapcsolóval (106+6) két lámpa kapcsolható két helyről, a kétpólusú 102-es pedig a fázissal együtt a nullavezetőt is bontja. Közös bennük, hogy a kapcsoló mindig a fázisvezetőt bontja, a védővezetőt pedig soha.

*Ábra (abra-1): Világítási kapcsolások a szerelési rajzon – ez az ábra még nincs kész (a cikk kiadását akadályozza)*

#### Áttekintés

Az alábbi táblázat a hat alapkapcsolás és a négy helyről kapcsolt keresztkapcsolás fő jellemzőit veti össze. Minden sor mögött egy netlista áll, amelyet a szimulátor az összes kapcsolóállásban végigszámolt; a részleteket, a vezetéktáblát és a kapcsolóállás-táblázatot a kapcsolás saját cikke tartalmazza.

| Kapcsolás | Szerelvények | Lámpakörök | Helyek lámpánként | Bontott vezetők | Erek a kapcsoló(k)hoz | Erek a lámpá(k)hoz | Szimuláció |
|---|---|---|---|---|---|---|---|
| 101 – egy hely | 101 | 1 | 1 | L | 2 | 3 | PASS, 2 állás (162c980a) |
| 102 – két pólus | 102 | 1 | 1 | L és N | 3 | 3 | PASS, 2 állás (a253fd8a) |
| 105 – két kör | 105 | 2 | 1 | L | 3 | 4 | PASS, 4 állás (171c858b) |
| 106 – két hely | 2 × 106 | 1 | 2 | L | 3 / 3 | 3 | PASS, 4 állás (909db559) |
| 106+6 – két kör, két hely | 2 × 106+6 | 2 | 2 | L | 5 / 6 | 3 / 3 | PASS, 16 állás (837cd200) |
| 107 – 3 hely | 2 × 106 + 107 | 1 | 3 | L | 3 / 4 / 3 | 3 | PASS, 8 állás (835f0537) |
| 107 – 4 hely | 2 × 106 + 2 × 107 | 1 | 4 | L | 3 / 4 / 4 / 3 | 3 | PASS, 16 állás (9566473c) |

A táblázatot a szimulátor számolta a felsorolt netlistákból (7 kapcsolás, összesen 52 kapcsolóállás, mindegyik egyezik a várt működéssel, zárlat és védővezető-hiba nélkül). „Helyek lámpánként”: hány különböző kapcsolási helyről fordítható meg a lámpa állapota bármely állásból; „Bontott vezetők”: kikapcsolva mely üzemi vezetőket választja le a kapcsoló a lámpáról; az érszám a cikkek kötődobozos változatára vonatkozik, a védővezetővel együtt.

A „Helyek lámpánként” és a „Lámpakörök” oszlop a lényeg: a váltókapcsolók két helyet adnak, a közéjük tett keresztkapcsolókkal a helyek száma tovább növelhető, a 105-ös és a 106+6-os kapcsoló pedig a lámpakörök számát növeli. Az érszám a kötődobozos változatra vonatkozik; ha a vezetékek a kapcsolódobozok között közvetlenül futnak, a szakaszonkénti érszám változik, a kapcsolás logikája nem.

#### Közös szabályok

- A kapcsoló a fázisvezetőt bontja. Így helyes bekötésnél kikapcsolt állásban a lámpa foglalata és belső vezetékei nem kapnak fázist; feszültségmentessé ettől még nem válnak (lásd lent). Egypólusú kapcsolókészülék (a 101-es, a 105-ös, a 106-os és a 107-es is ilyen) nem kerülhet a nullavezetőbe.
- A nullavezető a kapcsolót elkerülve jut a lámpához, jellemzően a kötődobozban. Kivétel a kétpólusú 102-es, amely a fázisvezetővel együtt bontja. A nullázásos berendezések közös PEN-vezetőjét viszont semmilyen kapcsoló nem bonthatja.
- A védővezető folytonos, és soha nem kapcsolt. Minden fémtestű lámpatestig és fém kapcsolókeretig megszakítás nélkül fut; a zöld-sárga ér kizárólag védővezető lehet. A hiányzó védővezetőt tilos a nullavezetőből „pótolni”, és a PEN-szétválasztás után a nulla- és a védővezetőt újra összekötni tilos.
- A kapcsolt fázis és a váltóvezeték is fázisvezető. A kapcsolt fázis bekapcsolt állásban ugyanúgy feszültség alatt áll, mint a betáp; a váltóvezetékek közül pedig a szimuláció szerint minden állásban az egyik fázis alatt van, akkor is, ha a lámpa nem ég. Kék ér csak akkor kaphat ilyen szerepet, ha a szakaszban nincs nullavezető, és a végein tartós jelölés mutatja a szerepét (lásd: Vezetékek színjelölése).
- Jelölés mindkét végen. A váltóvezetékek és a több lámpakör kapcsolt fázisai színből nem különböztethetők meg.
- A falikapcsoló nem leválasztó. Munkavégzés előtt a feszültségmentesítés az elosztóban történik, a feszültségmentesítés öt szabálya szerint, akkor is, ha a kapcsoló kétpólusú, és akkor is, ha a lámpa nem ég.
- Az áram-védőkapcsoló (FI-relé) kiegészítő védelem. Csak a fázis- és a nullavezető áramának különbségét érzékeli: ha valaki egyszerre a fázis- és a nullavezetőhöz kapcsolódó részt érint, nem feltétlenül old ki, és a nullát bontó kapcsolót vagy a felcserélt polaritást sem jelzi. A helyes bekötést és a feszültségmentesítést nem pótolja.

#### Melyiket válaszd?

| Mit szeretnél? | Kapcsolás | Részletek |
|---|---|---|
| Egy lámpát vagy lámpacsoportot egy helyről | 101 | Egypólusú kapcsoló (101) |
| Két lámpakört egy helyről, ugyanarról az áramkörről | 105 | Csillárkapcsoló (105) |
| Egy lámpát két helyről | 2 × 106 | Váltókapcsoló (106) |
| Két lámpát, mindkettőt két helyről | 2 × 106+6 | Kettős váltókapcsoló (106+6) |
| Egy lámpát három vagy több helyről | 2 × 106, közéjük helyenként egy 107 | Keresztkapcsoló (107) |
| A fogyasztó fázis- és nullavezetőjét együtt bontani | 102 | Kétpólusú kapcsoló (102) |

A típuson túl ezeket érdemes mérlegelni:

- Áramkörök. A 105-ös kapcsoló két lámpaköre közös betápról kap fázist. Ha a két lámpakört két külön áramkör táplálja, két egypólusú kapcsoló kell egy keretben (101 + 101), és mindkét áramkör nullavezetője a saját áramkörénél marad. Az ilyen dobozt az egyik kismegszakító lekapcsolása nem teszi feszültségmentessé; a kettős betáplálást jelölni kell.
- Érszám és szerelési mód. A több helyről kapcsolás több eret igényel: a kettős váltókapcsolásnál egy szakaszban hat ér is futhat. Ehhez kell méretezni a védőcsövet vagy a kábelt. Ahol később második bejárat vagy újabb kapcsolási hely várható, a tartalék ér vagy a védőcső a későbbi átalakítást könnyíti.
- Nullavezető a kapcsolódobozban. A klasszikus kapcsolásokban a kapcsolóhoz nem megy nullavezető. Sok okoskapcsoló, mozgásérzékelő és egyes jelzőfényes kapcsolók viszont igényelnek ilyet; erről a gyártói útmutató szól, és érdemes már a tervezéskor számolni vele.
- Terhelhetőség. A kapcsoló névleges áramát és feszültségét az adattáblája adja meg. Sok LED-meghajtó bekapcsoláskor rövid ideig nagy áramot vesz fel, a fix bekötésű készülékek (például a villanybojler) árama pedig jóval nagyobb is lehet egy világítási áramkörénél.
- Helyiség és védettség. Fürdőszobában, más nedves helyiségben és szabadban a kapcsoló elhelyezését és védettségét is meg kell választani (lásd: IP-védettség).
- Sok kapcsolási hely. Minden további hely egy újabb keresztkapcsolót és egy négyeres szakaszt jelent. Hosszú folyosón vagy lépcsőházban ezért gyakran egyszerűbb a nyomógombos megoldás impulzusrelével (léptetőrelével) vagy lépcsőházi automatával, mert ott a nyomógombok párhuzamosan köthetők. Ezek bekötése külön téma.
- Raktárkészlet. A váltókapcsoló egypólusú kapcsolóként is beköthető (a fázis a közös kapocsra, a kapcsolt fázis az egyik kimenetre), ezért sok gyártó csak ezt forgalmazza. Fordítva nem működik: két egypólusú kapcsolóból nem lesz váltókapcsolás.

#### Jelölés a tervezőben

A Villanyrajz tervezőjében a kapcsoló jele kör ferde vonallal: az egypólusú kapcsolónál egy, a többinél két ferde vonallal. A jel alatt a típusszám utolsó jegye áll.

| Szerelvény a tervezőben | Típusszám | Szám a jel alatt |
|---|---|---|
| Egypólusú kapcsoló | 101 | 1 |
| Kétpólusú kapcsoló | 102 | 2 |
| Csillárkapcsoló | 105 | 5 |
| Váltókapcsoló | 106 és 106+6 | 6 |
| Keresztkapcsoló | 107 | 7 |

A kettős váltókapcsolónak nincs külön jele: a kettős kivitelt a szerelvény neve vagy megjegyzése rögzíti. A kapcsolót és az általa kapcsolt lámpakiállást érdemes ugyanahhoz az áramkörhöz rendelni, így az anyaglista és az áramkörlista is követi a kapcsolást.

#### Régi berendezésben

- Nullát bontó kapcsoló. Régi vagy utólag átalakított berendezésben előfordul, hogy a kapcsoló a nullavezetőt bontja. A lámpa működik, de kikapcsolva is fázis alatt áll; ez csak szakember által végzett méréssel derül ki.
- Nullázásos (TN-C) rendszer. A közös PEN-vezetőt semmilyen kapcsoló nem bonthatja. Régi berendezésben a kétpólusú kapcsoló beépítése előtt a földelési rendszert szakembernek kell felmérnie; ahol a PEN-vezetőt már szétválasztották, a nulla- és a védővezetőt a szétválasztási pont után újra összekötni tilos (lásd: Földelési rendszerek).
- Védővezető nélküli lámpakiállás. Ahol a lámpáig csak fázis- és nullavezető (csillárnál két kapcsolt fázis és nulla) fut, fémtestű lámpatest nem köthető be szakszerűen; a megoldásról szakember dönt. A lámpatest védőkapcsát a nullára kötni tilos: nullaszakadásnál vagy felcserélt vezetőknél a fémtest fázis alá kerül.
- Közös nullavezető két áramkörre. Az egyik áramkör lekapcsolása után a közös nullavezetőn a másik áramkör árama tovább folyhat; megbontása ezért a „lekapcsolt” áramkörben is áramütést okozhat.
- Ma nem elfogadott váltókapcsolás, amelynél a váltóvezetékek között nullavezető is fut. A szimuláció szerint bizonyos kapcsolóállásban zárlatot okoz.
- Forgó vagy nyomógombos sorozatkapcsoló a csillárkapcsoló helyett, jelöletlen kapcsokkal.
- Megbízhatatlan érszínek, alumínium vezetők, szigetelőszalagos kötések. A régi érszín semmit nem bizonyít; alumínium vezető csak arra alkalmas kapocsba vagy összekötőbe köthető.

#### Gyakori hibák

A szimulátor a jellemző hibás bekötéseket is végigszámolta; a tüneteket a kapcsolások saját cikkei részletezik.

- Kapcsoló a nullavezetőben: a lámpa kikapcsolva is fázis alatt marad (101).
- Keresztbe kötött pólusok a 102-esen, vagy felcserélt vezetők a lámpánál: a lámpa működik, de a fázis a nulla felőli kapocsra jut.
- Kapcsolt fázis a nullavezetők összekötőjében: a billentyű bekapcsolásakor zárlat keletkezik (105).
- A betáp nem a közös kapocsra kerül: a négy állásból csak egyben ég a lámpa (106).
- Hiányzó áthidaló a kettős váltókapcsoló két közös kapcsa között: a második lámpa egyik állásban sem gyullad ki (106+6).
- Összekevert kapocspárok a keresztkapcsolón: az egyik állásában a lámpa egyik helyről sem kapcsolható be (107).
- Zöld-sárga ér fázis- vagy váltóvezetékként, vagy jelöletlen kék ér fázisként.
- Két áramkör nullavezetőjének összekötése egy közös kötő- vagy kapcsolódobozban.

#### Mikor hívj szakembert?

- Mindig, ha kapcsolót, lámpát vagy kötést kell bekötni, cserélni vagy áthelyezni, vagy egy meglévő kapcsolást át kell alakítani, például egy lámpát egy helyett két helyről kapcsolhatóvá tenni.
- Azonnal, ha a lámpatest, a kapcsolókeret vagy más fémrész érintésekor bizsergést érzel: ne érintsd újra, kapcsold le az áramkört az elosztóban, és amíg a szakember meg nem vizsgálta, ne kapcsold vissza.
- Ha nem tudod eldönteni, melyik kapcsolás kell, vagy a meglévő kapcsoló típusa és bekötése nem azonosítható.
- Ha a lámpa csak bizonyos állásokban kapcsolható, kikapcsolva dereng vagy villog, vagy kapcsoláskor lekapcsol a kismegszakító vagy az áram-védőkapcsoló (FI-relé).
- Ha a kapcsoló vagy a doboz meleg, elszíneződött, recseg, vagy égett szagot érzel.
- Ha régi, nullázásos berendezésben vagy védővezető nélküli lámpakiállásnál kellene új kapcsolót vagy lámpát bekötni.
- Ha okoskapcsolót, mozgásérzékelőt vagy impulzusrelés vezérlést építenél be.

**Források és szabványpontok:**

| Szabvány | Kiadás | Pont |
|---|---|---|
| MSZ HD 60364-5-537 (leválasztás és kapcsolás) | 2017 (HD 60364-5-537:2016) | 537 – általános követelmények (a PEN-vezető nem kapcsolható) és az üzemi (funkcionális) kapcsolás alpontja (egypólusú kapcsolókészülék nem kerülhet a nullavezetőbe) |
| MSZ HD 60364-5-51 | 2010 | 514.3 (vezetők azonosítása) |
| MSZ EN IEC 60445 | 2022 (EN IEC 60445:2021) | 6.2 (vezetők azonosítása színnel) |
| MSZ EN 60669-1 (háztartási és hasonló, helyhez kötött villamos berendezések kapcsolói) | 2018 (EN IEC 60669-1:2018) | 7 (osztályozás, bekötési számok), 8 (jelölés), 12 (kapcsok) |
| MSZ HD 60364-6 (ellenőrzés) | 2017 (HD 60364-6:2016) | 6.4.2 (szemrevételezés), 6.4.3 (mérések: védővezető folytonossága, szigetelési ellenállás, polaritás) |

| Azonosító | Ellenőrizendő | Hol | ✓ | ✗ | Helyes érték / megjegyzés |
|---|---|---|:-:|:-:|---|
| CIK-VILAGITASI-KAPCSOLASOK-SZOVEG | A cikk szövege: veszély-doboz, szakaszok, táblák, számpéldák | tartalmi ujjlenyomat a7a9b850 · 1566 szó | ☐ | ☐ | |
| CIK-VILAGITASI-KAPCSOLASOK-FORRAS | Források és szabványpontok (5) | a cikk végén, a „Források és szabványpontok” táblázatban | ☐ | ☐ | |

**Döntés (CIK-VILAGITASI-KAPCSOLASOK):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom

☐ A blokk minden tétele egyezik (CIK-VILAGITASI-KAPCSOLASOK).

Megjegyzés a blokkhoz (forrás, kiadás):

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
| BEK-SZABALYOK | Biztonsági szabályok, amelyeket a szimulátor minden állásban ellenőriz | 24 | ☐ | |
| BEK-VIL-KERDESEK | Világítási kapcsolások (101–107) – közös kérdések | 0 | ☐ | |
| BEK-EGYPOLUSU-KAPCSOLO-101 | Egypólusú kapcsoló (101): egy lámpa egy helyről | 4 | ☐ | |
| BEK-KETPOLUSU-KAPCSOLO-102 | Kétpólusú kapcsoló (102): a fázis- és a nullavezető együttes bontása | 4 | ☐ | |
| BEK-CSILLARKAPCSOLO-105 | Csillárkapcsoló (105): két lámpakör egy helyről | 4 | ☐ | |
| BEK-VALTOKAPCSOLO-106 | Váltókapcsolás (2 × 106): egy lámpa két helyről | 4 | ☐ | |
| BEK-KETTOS-VALTOKAPCSOLO-106-6 | Kettős váltókapcsoló (106+6): két lámpa, mindkettő két helyről | 4 | ☐ | |
| BEK-KERESZTKAPCSOLO-107 | Keresztkapcsolás (106 + 107 + 106): egy lámpa három helyről | 4 | ☐ | |
| BEK-KERESZTKAPCSOLO-107-2X107 | Keresztkapcsolás (106 + 2 × 107 + 106): egy lámpa 4 helyről | 4 | ☐ | |
| BEK-KERESZTKAPCSOLO-107-3X107 | Keresztkapcsolás (106 + 3 × 107 + 106): egy lámpa 5 helyről | 4 | ☐ | |
| BEK-KERESZTKAPCSOLO-107-4X107 | Keresztkapcsolás (106 + 4 × 107 + 106): egy lámpa 6 helyről | 4 | ☐ | |
| BEK-VED-KERDESEK | Dugalj, kismegszakító, FI-relé – közös kérdések | 0 | ☐ | |
| BEK-DUGALJ-ATHURKOLAS | Dugaljkör áthurkolással: két védőérintkezős dugalj FI-relé és kismegszakító után | 4 | ☐ | |
| BEK-DUGALJ-LEAGAZTATAS | Dugaljkör leágaztatással: két dugalj a kötődobozból, FI-relé és kismegszakító után | 4 | ☐ | |
| BEK-KISMEGSZAKITO-ARAMKOROK | Két dugaljkör saját kismegszakítóval, közös FI-relé után | 4 | ☐ | |
| BEK-FI-RELE-BEKOTES | Áram-védőkapcsoló (FI-relé) bekötése dugaljkör elé, próbagombbal | 4 | ☐ | |
| BEK-FI-RELE-HIBAHELYZETEK | Mikor old ki a FI-relé? Testzárlat, fázis–föld és fázis–nulla érintés | 4 | ☐ | |
| BEK-FOLD-KERDESEK | Földelési rendszerek és EPH – közös kérdések | 0 | ☐ | |
| BEK-FOLDELES-TN-C | TN-C rendszer: a PEN-vezető a fogyasztóig fut | 4 | ☐ | |
| BEK-FOLDELES-TN-S | TN-S rendszer: külön nulla- és védővezető a táppontól | 4 | ☐ | |
| BEK-FOLDELES-TN-C-S | TN-C-S rendszer: PEN a szétválasztási pontig, utána külön N és PE | 4 | ☐ | |
| BEK-FOLDELES-TT | TT rendszer: a fémház a saját földelőn | 4 | ☐ | |
| BEK-FOLDELES-IT | IT rendszer: földeletlen táppont, földelt fémházak | 4 | ☐ | |
| BEK-EPH-ALAPOK | Egyenpotenciálra hozás: a fő EPH-sín és a vízvezeték bekötése (TN-C-S) | 4 | ☐ | |
| CIK-ARAM-VEDOKAPCSOLO-FI-RELE | Áram-védőkapcsoló (FI-relé): működés, 30 mA, típusok, próbagomb | 3 | ☐ | |
| CIK-CSILLARKAPCSOLO-105-BEKOTESE | Csillárkapcsoló (105) bekötése: két lámpakör egy helyről | 3 | ☐ | |
| CIK-DUGALJ-BEKOTESE | Dugalj bekötése: védőérintkezős dugalj, áthurkolás és leágaztatás | 3 | ☐ | |
| CIK-EGYENPOTENCIALRA-HOZAS-EPH | Egyenpotenciálra hozás (EPH): fő és kiegészítő potenciálkiegyenlítés | 3 | ☐ | |
| CIK-EGYPOLUSU-KAPCSOLO-101-BEKOTESE | Egypólusú kapcsoló (101) bekötése: egy lámpa egy helyről | 3 | ☐ | |
| CIK-FESZULTSEGMENTESITES-OT-SZABALYA | A feszültségmentesítés öt szabálya | 2 | ☐ | |
| CIK-FOLDELESI-RENDSZEREK | Földelési rendszerek: TN-C, TN-S, TN-C-S, TT és IT | 3 | ☐ | |
| CIK-KERESZTKAPCSOLO-107-BEKOTESE | Keresztkapcsoló (107) bekötése: egy lámpa három vagy több helyről | 3 | ☐ | |
| CIK-KETPOLUSU-KAPCSOLO-102-BEKOTESE | Kétpólusú kapcsoló (102) bekötése: fázis és nulla együttes bontása | 3 | ☐ | |
| CIK-KETTOS-VALTOKAPCSOLO-106-6-BEKOTESE | Kettős váltókapcsoló (106+6) bekötése: két lámpa két helyről | 3 | ☐ | |
| CIK-KISMEGSZAKITO | Kismegszakító: B, C és D jelleggörbe, az Ib ≤ In ≤ Iz elve | 3 | ☐ | |
| CIK-VALTOKAPCSOLO-106-BEKOTESE | Váltókapcsoló (106) bekötése: egy lámpa két helyről | 3 | ☐ | |
| CIK-VILAGITASI-KAPCSOLASOK | Világítási kapcsolások: melyik kapcsoló mikor kell? (101–107) | 2 | ☐ | |

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

A 4. rész ábránként hagyható jóvá, a biztonsági szabályokkal (BEK-SZABALYOK) együtt. „Jóváhagyom”: az ábra blokkja eltérés nélkül helyes (bekötés, érszínek, kapcsok, szakaszok, működés). „Javítással”: az ábra a megjegyzésben leírt javítás után, a javított kiadásban hagyható jóvá. „Elutasítom”: az ábra a cikkben nem jelenhet meg; az okot kérjük a megjegyzésbe írni. Jelöletlen sor: nem jóváhagyott. A Jóváhagyó lap ábránkénti döntése mérvadó (a blokkok végi jelölések csak előkészítik). Az ábra csak a cikk szövegének jóváhagyásával együtt jelenhet meg.

| Ábra | Blokk | Netlista (ujjlenyomat) | Ábra (ujjlenyomat) | Döntés |
|---|---|---|---|---|
| Egypólusú kapcsoló (101): egy lámpa egy helyről | BEK-EGYPOLUSU-KAPCSOLO-101 | 162c980a | 1dcf64c0 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Kétpólusú kapcsoló (102): a fázis- és a nullavezető együttes bontása | BEK-KETPOLUSU-KAPCSOLO-102 | a253fd8a | 8f880407 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Csillárkapcsoló (105): két lámpakör egy helyről | BEK-CSILLARKAPCSOLO-105 | 171c858b | 0b2d7654 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Váltókapcsolás (2 × 106): egy lámpa két helyről | BEK-VALTOKAPCSOLO-106 | 909db559 | 8b477227 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Kettős váltókapcsoló (106+6): két lámpa, mindkettő két helyről | BEK-KETTOS-VALTOKAPCSOLO-106-6 | 837cd200 | 2c4744a0 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Keresztkapcsolás (106 + 107 + 106): egy lámpa három helyről | BEK-KERESZTKAPCSOLO-107 | 835f0537 | 3fafb965 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Keresztkapcsolás (106 + 2 × 107 + 106): egy lámpa 4 helyről | BEK-KERESZTKAPCSOLO-107-2X107 | 9566473c | 862239b0 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Keresztkapcsolás (106 + 3 × 107 + 106): egy lámpa 5 helyről | BEK-KERESZTKAPCSOLO-107-3X107 | f9fd89d8 | 02bf7fb3 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Keresztkapcsolás (106 + 4 × 107 + 106): egy lámpa 6 helyről | BEK-KERESZTKAPCSOLO-107-4X107 | e67cbcc6 | aff64b7d | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Dugaljkör áthurkolással: két védőérintkezős dugalj FI-relé és kismegszakító után | BEK-DUGALJ-ATHURKOLAS | 9bb3ff8e | 5ddcd826 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Dugaljkör leágaztatással: két dugalj a kötődobozból, FI-relé és kismegszakító után | BEK-DUGALJ-LEAGAZTATAS | 143d7450 | 42c9277a | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Két dugaljkör saját kismegszakítóval, közös FI-relé után | BEK-KISMEGSZAKITO-ARAMKOROK | 3bf085c5 | 85c98132 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Áram-védőkapcsoló (FI-relé) bekötése dugaljkör elé, próbagombbal | BEK-FI-RELE-BEKOTES | 8f0e1c8c | 0d32d689 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Mikor old ki a FI-relé? Testzárlat, fázis–föld és fázis–nulla érintés | BEK-FI-RELE-HIBAHELYZETEK | 704b52c6 | 51b5b201 | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| TN-C rendszer: a PEN-vezető a fogyasztóig fut | BEK-FOLDELES-TN-C | 742e564d | fc6fb08c | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| TN-S rendszer: külön nulla- és védővezető a táppontól | BEK-FOLDELES-TN-S | 816da23b | 916b312b | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| TN-C-S rendszer: PEN a szétválasztási pontig, utána külön N és PE | BEK-FOLDELES-TN-C-S | bff6a9cd | 86f15a2d | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| TT rendszer: a fémház a saját földelőn | BEK-FOLDELES-TT | 553eca92 | e3d263ee | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| IT rendszer: földeletlen táppont, földelt fémházak | BEK-FOLDELES-IT | 3723d185 | 22bba2ea | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Egyenpotenciálra hozás: a fő EPH-sín és a vízvezeték bekötése (TN-C-S) | BEK-EPH-ALAPOK | d8926fe6 | 217145db | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |

### 5. rész – cikkenkénti döntés

Az 5. rész cikkenként hagyható jóvá. „Jóváhagyom”: a cikk szövege (veszély-doboz, állítások, figyelmeztetések, táblák, számpéldák, források) eltérés nélkül helyes és alkalmas a megjelölt közönség tájékoztatására; a jóváhagyás a sorban megadott tartalmi ujjlenyomatú szövegre szól. „Javítással”: a szöveg a megjegyzésben leírt javítás után, a javított kiadásban hagyható jóvá. „Elutasítom”: a cikk nem jelenhet meg; az okot kérjük a megjegyzésbe írni. Jelöletlen sor: nem jóváhagyott. Ahol a „Hiányzik” oszlopban bejegyzés áll, a cikk kiadásához a szöveg jóváhagyásán túl az is kell.

| Cikk | Blokk | Tartalmi ujjlenyomat | Hiányzik a kiadáshoz | Döntés |
|---|---|---|---|---|
| Áram-védőkapcsoló (FI-relé): működés, 30 mA, típusok, próbagomb | CIK-ARAM-VEDOKAPCSOLO-FI-RELE | b14c8c33 | az összegáramváltó elvét mutató ábra még nincs kész | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Csillárkapcsoló (105) bekötése: két lámpakör egy helyről | CIK-CSILLARKAPCSOLO-105-BEKOTESE | 68cc59f0 | – | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Dugalj bekötése: védőérintkezős dugalj, áthurkolás és leágaztatás | CIK-DUGALJ-BEKOTESE | 5d62b44a | – | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Egyenpotenciálra hozás (EPH): fő és kiegészítő potenciálkiegyenlítés | CIK-EGYENPOTENCIALRA-HOZAS-EPH | 42f19255 | – | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Egypólusú kapcsoló (101) bekötése: egy lámpa egy helyről | CIK-EGYPOLUSU-KAPCSOLO-101-BEKOTESE | 6f7c9cdc | – | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| A feszültségmentesítés öt szabálya | CIK-FESZULTSEGMENTESITES-OT-SZABALYA | 099bbab3 | a folyamatábra (az öt lépés) még nincs kész | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Földelési rendszerek: TN-C, TN-S, TN-C-S, TT és IT | CIK-FOLDELESI-RENDSZEREK | 1a172e63 | – | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Keresztkapcsoló (107) bekötése: egy lámpa három vagy több helyről | CIK-KERESZTKAPCSOLO-107-BEKOTESE | 932700dc | – | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Kétpólusú kapcsoló (102) bekötése: fázis és nulla együttes bontása | CIK-KETPOLUSU-KAPCSOLO-102-BEKOTESE | 6a9a7747 | – | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Kettős váltókapcsoló (106+6) bekötése: két lámpa két helyről | CIK-KETTOS-VALTOKAPCSOLO-106-6-BEKOTESE | ec7dca3e | – | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Kismegszakító: B, C és D jelleggörbe, az Ib ≤ In ≤ Iz elve | CIK-KISMEGSZAKITO | 539e0515 | a jelleggörbe-ábra (B/C/D kioldási tartományok) még nincs kész | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Váltókapcsoló (106) bekötése: egy lámpa két helyről | CIK-VALTOKAPCSOLO-106-BEKOTESE | 6ed95068 | – | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |
| Világítási kapcsolások: melyik kapcsoló mikor kell? (101–107) | CIK-VILAGITASI-KAPCSOLASOK | a7a9b850 | az áttekintő ábra a tervező szerelési rajzára épülne (Szerelési rajz nézet, még nincs kész) | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |

### 4–5. rész – második olvasó

R3 (biztonságkritikus) tartalom: a 4. rész ábráit és az 5. rész cikkszövegeit egy második, szintén jogosult olvasó is átnézi. Aláírásával azt igazolja, hogy a lektor „Jóváhagyom” jelölésű ábráival és cikkszövegeivel egyetért, és hogy a program szerzőitől, fejlesztőitől és a csomag összeállítóitól független; eltérő véleményét a megjegyzésbe írja. A program a második olvasó nevét nem rögzíti, csak a jogosultságát.

| Adat | Kitöltés |
|---|---|
| Második olvasó jogosultsága | |
| Dátum | |
| Aláírás | |
| Függetlenségi nyilatkozat: a program szerzőitől, fejlesztőitől és a csomag összeállítóitól független vagyok (igen / nem) | |
| Megjegyzés (a lektorétól eltérő vélemény, kifogás) | |

### Teendő eltérés esetén

1. A lektor az eltérő tételt ✗-szel jelöli, és a „Helyes érték / megjegyzés” mezőbe beírja a helyes értéket; a forrást (szabvány, kiadás, pont vagy táblázat) a „Megjegyzés a blokkhoz (forrás, kiadás)” mezőben vagy a tételnél adja meg.
2. A Jóváhagyó lapon az 1–2. résznél a második lehetőséget („javítás után hagyom jóvá”), a 3. résznél az érintett kalkulátor sorában a „Javítás után / nem” négyzetet, a 4. és az 5. résznél az érintett ábra, illetve cikk sorában a „Javítással” vagy az „Elutasítom” négyzetet jelöli, és aláírja; a lap ábránkénti és cikkenkénti döntése mérvadó a blokkok végi jelölésekkel szemben. Az eltéréssel érintett részre, kalkulátorra, ábrára vagy cikkre ennél a kiadásnál jóváhagyás nem rögzíthető: a jóváhagyás mindig egy pontos ujjlenyomathoz tartozik.
3. Javítással jóváhagyott ábránál vagy cikknél a javított kiadásban csak a változott ábrát, illetve szöveget kell újra ellenőrizni (a kiadás bejegyzése a változott ujjlenyomatokat nevezi meg); elutasított ábra vagy cikk nem jelenik meg a Tudástárban, amíg új, jóváhagyott kiadás nem készül.
4. A fejlesztő a javításokat a programban bevezeti, és új kiadást (új csomagverzió és ujjlenyomatok) készít; a változott tételek listáját megküldi a lektornak.
5. A lektor csak a változott tételeket ellenőrzi, és az új kiadás Jóváhagyó lapját írja alá; a program ennek ujjlenyomatait rögzíti.
6. Ha két forrás vagy két ellenőr eltérő értéket ad, mindkét érték a forrásával a megjegyzésbe kerül; az érték a tisztázásig „ellenőrizendő” marad.
7. Biztonsági jelentőségű hibát (pl. a valósnál nagyobb terhelhetőség, kisebb feszültségesés vagy nagyobb megengedett hurokimpedancia) kérjük a csomag visszaküldése előtt is haladéktalanul jelezni a megbízónak; a program ilyenkor a jóváhagyásig változatlanul „ellenőrizendő” jelölést mutat.

### Döntés és aláírás

A jóváhagyott csomag:

| Adat | Érték |
|---|---|
| Csomagverzió | LK-4 (2026. 10. 12.) |
| Csomag-ujjlenyomat | df31ad27 (a csomag teljes szövegéé: bevezető, tételek, jóváhagyó lap) |
| Részek ujjlenyomata | 1. rész (táblázatok): c78b23ee; 2. rész (képletek): 25b6c94f; 3. rész (kalkulátorok): e65e37f3; 4. rész (ábrák): d24b131b; 5. rész (cikkek): 3a9439d8 – ábránként, cikkenként és kalkulátoronként a döntési táblázatokban |

Döntés:

- ☐ Az 1–2. részt eltérés nélkül jóváhagyom.
- ☐ Az 1–2. részt a jelölt eltérések javítása után hagyom jóvá; a javított kiadás változott tételeit ellenőrzöm.
- ☐ Az 1–2. részt nem hagyom jóvá (indoklás a megjegyzésben).

Alulírott kijelentem, hogy a Villanyrajz lektori csomag ezen a lapon megjelölt, 195 oldalas kiadásának 1. (méretezési táblázatok), 2. (képletek és programozott döntések), 3. (szabványhoz kötött kalkulátorok), 4. (bekötési ábrák és biztonsági szabályok) és 5. (R3 cikkvázlatok) részét a hivatkozott szabványok hatályos kiadásával összevetettem, és a tételeket a fenti döntés, valamint a kalkulátoronkénti, az ábránkénti és a cikkenkénti döntés szerint jelöltem. A 3., a 4. és az 5. részből kizárólag a „Jóváhagyom” jelölésű kalkulátorokat, ábrákat és cikkszövegeket hagyom jóvá; a 4. és az 5. rész jóváhagyásához a második olvasó egyetértése is szükséges. A jóváhagyás kizárólag a csomagban, a megjelölt ujjlenyomatokkal azonosított tartalomra vonatkozik (a cikkszövegnél a megadott tartalmi ujjlenyomatra); nem minősül a programmal készült egyes tervekért vagy a kalkulátorokkal végzett egyes számításokért vállalt tervezői felelősségnek, és nem terjed ki a csomag 6. részére.

Az 1. rész ujjlenyomatát a program maga ellenőrzi: eltérésnél „ellenőrizendő” állapotra áll vissza. A 2. rész ujjlenyomatát a fejlesztési folyamat automatikus tesztje veti össze a jóváhagyottal. A 3. részben kalkulátoronként a tartalmi és a forrás-ujjlenyomat kerül a kiadási rekordba: tartalmi eltérésnél a program a kalkulátort nem teszi közzé, forráseltérésnél az automatikus teszt elbukik. A 4. részben ábránként a netlista és az ábra ujjlenyomata, az 5. részben cikkenként a tartalmi ujjlenyomat kerül a csomagkiadásba; a Tudástár cikkének lektori rekordja ezekhez kötődik (a rekord approvalRef-je a kiküldött kiadást és az ujjlenyomatokat nevezi meg; a rekord teljes: jogosultság, dátum, hivatkozás, második olvasó): ha a cikk szövege, a netlista, az elrendezés, egy szimbólum, a rajzoló kód, a megjelenítés (veszély-doboz) vagy egy ábraszín változik, a cikk nem jelenik meg („újraellenőrzendő”), és szövege a buildbe sem kerül. Bármelyik eltérésénél új kiadás és új jóváhagyás kell.

A „Jogosultság megnevezése” a programban a lektorálás jelzésében szó szerint megjelenik (név nélkül is); például: épületvillamossági tervező (MMK-névjegyzék) vagy érintésvédelmi szabványossági felülvizsgáló.

| Adat | Kitöltés |
|---|---|
| Jóváhagyó neve | |
| Kamarai / névjegyzéki szám | |
| Jogosultság megnevezése | |
| Hely | |
| Dátum | |
| Aláírás | |
| Jóváhagyott csomagverzió és ujjlenyomatok | LK-4 (2026. 10. 12.); csomag: df31ad27; 1. rész: c78b23ee; 2. rész: 25b6c94f; 3. rész: e65e37f3; 4. rész: d24b131b; 5. rész: 3a9439d8 |
| Megjegyzések | |

☐ Hozzájárulok, hogy nevem, névjegyzéki számom, jogosultságom és a jóváhagyás dátuma a tervező Méretezés fülén (Eszközök → Tervsegéd → Méretezés) minden felhasználónak; minden felhasználó exportált terv-PDF-jében, ha a méretezési táblákat bekapcsolja, az elosztóoldalak „méretezés indoklása” táblájának „Táblázatok – Állapot” sorában (ugyanennek a táblának az utolsó sora a terv tervezőjének „Tervezői ellenőrzés” aláírósora); a nyilvános, keresőkben is megtalálható kalkulátoroldalakon a táblázatokat használó kalkulátorok (Feszültségesés, Keresztmetszet-választás, Kismegszakító-választás, Hurokimpedancia és zárlati áram, Terhelhetőségi táblázat) „Táblázatok állapota” sorában és a Vezeték-ellenállás kalkulátor ρ1 szerinti tájékoztató sorában – ezzel a szöveggel megjelenjen: „A táblázatértékeket szakmailag lektorálta: [név], [jogosultság] ([névjegyzéki szám]), [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.”; továbbá hogy a 3. részből általam jóváhagyott kalkulátorok saját oldalán (jelvény; lábléc-sor) nevem és jogosultságom így megjelenjen: „Szakmailag lektorálta: [név], [jogosultság] · [dátum]; Szakmai lektor: [név], [jogosultság]”. Tudomásul veszem, hogy ehhez nevem és névjegyzéki számom a program nyilvános oldalainak kódjába is bekerül. Hozzájárulás hiányában a program nevemet és névjegyzéki számomat nem rögzíti, és a lektorálást a jogosultságom megnevezésével jelzi: „A táblázatértékeket szakmailag lektorálta: [jogosultság], [dátum]. Táblázatváltozat: 2026.10-1, ujjlenyomat: c78b23ee.”, illetve „Szakmailag lektorálta: [jogosultság] · [dátum]; Szakmai lektor: [jogosultság]”. A kalkulátorlistán és a keresőben a jelvény név nélküli. A jóváhagyás érvénye a hozzájárulástól nem függ.
