---
slug: elektromos-teljesitmeny
title: "Elektromos teljesítmény és energia (W, VA, var, kWh)"
navTitle: "Teljesítmény és energia"
summary: "Hatásos, meddő és látszólagos teljesítmény egyen-, egyfázisú és háromfázisú hálózatban, cos φ, áram a teljesítményből és fogyasztás kWh-ban, példákkal."
section: elmelet
category: alapfogalmak
risk: R1
audience: [laikus, tanulo, szakember]
keywords: [teljesítmény, watt, kilowatt, energia, kilowattóra, kWh, hatásos teljesítmény, meddő teljesítmény, látszólagos teljesítmény, cos φ, teljesítménytényező, háromfázisú teljesítmény, √3, VA, var, fogyasztás]
synonyms: [villamos teljesítmény, wattos teljesítmény, P, Q, S, kW, kVA, kvar, energiafogyasztás]
related: [ohm-torvenye, elektromos-aram, elektromos-feszultseg, joule-lenz-torveny, transzformator-mukodese]
calculators: [teljesitmeny, aram-teljesitmenybol, latszolagos-meddo-teljesitmeny, fogyasztas-koltseg, fazisterheles, mertekegyseg-atvalto]
sources:
  - standard: "127/1991. (X. 9.) Korm. rendelet"
    kiadás: "hatályos szöveg"
    pont: "3. § (1) és 1. számú melléklet – törvényes mértékegységek (watt, joule)"
  - standard: "MSZ EN 60038"
    kiadás: "2011"
    pont: "1. táblázat (230/400 V névleges feszültség)"
ai: vázlat
version: 0.1
updated: 2026-10-10
---

**Röviden:** A teljesítmény megmutatja, milyen gyorsan alakul át az elektromos energia hővé, fénnyé vagy mozgássá; mértékegysége a watt (W). Egyenáramnál P = U · I, egyfázisú váltakozó áramnál a fáziseltolás miatt P = U · I · cos φ, háromfázisú szimmetrikus terhelésnél a vonali feszültséggel P = √3 · U · I · cos φ. Az energia a teljesítmény és az idő szorzata; a fogyasztásmérő kilowattórában (kWh) méri.

## Teljesítmény és energia

A teljesítmény az időegység alatt átalakított energia:

P = W / t, illetve W = P · t

1 W = 1 J/s. Az energia SI-egysége a joule (J), a villamos gyakorlatban azonban a kilowattóra (kWh) a megszokott:

1 kWh = 1000 W · 3600 s = 3 600 000 J = 3,6 MJ.

**Kidolgozott példa – készenléti fogyasztás.** Egy készülék készenlétben folyamatosan 5 W-ot vesz fel. Egy év 365 · 24 = 8760 óra, így W = 5 W · 8760 h = 43 800 Wh = 43,8 kWh évente.

## Egyenáram

Egyenáramnál a teljesítmény a feszültség és az áram szorzata:

P = U · I

[[ohm-torvenye|Ohm törvényével]] kiegészítve: P = I² · R = U² / R.

**Kidolgozott példa.** Egy 24 V-os tápegység 5 A-t ad le: P = 24 V · 5 A = 120 W.

## Egyfázisú váltakozó áram: P, Q, S és cos φ

Tisztán ohmos terhelésnél (fűtőszál, vízforraló) a feszültség és az áram együtt változik, a teljesítmény egyszerűen P = U · I. Tekercset tartalmazó (induktív) terhelésnél – motor, transzformátor, hagyományos fénycső-előtét – az áram késik a feszültséghez képest, kondenzátornál siet. Az eltolás szöge a fázisszög (φ). Ilyenkor háromféle teljesítményt különböztetünk meg:

- **Hatásos teljesítmény:** P = U · I · cos φ, wattban (W). Ez alakul át a fogyasztóban hővé, fénnyé vagy mechanikai munkává, és ezt méri a fogyasztásmérő.
- **Meddő teljesítmény:** Q = U · I · sin φ, voltamper reaktívban (var). A tekercsek mágneses és a kondenzátorok villamos terének felépítéséhez kell; periodikusan ide-oda áramlik a forrás és a fogyasztó között, munkát nem végez, de a vezetéket terheli.
- **Látszólagos teljesítmény:** S = U · I, voltamperben (VA). A vezeték, a transzformátor, a tápegység vagy a szünetmentes táp terhelése ehhez igazodik.

Szinuszos feszültségnél és áramnál a három mennyiség derékszögű háromszöget alkot: S² = P² + Q², és cos φ = P / S. A cos φ értéke 0 és 1 közé esik; minél közelebb van 1-hez, annál kisebb a meddő rész.

[ÁBRA: abra-1 – Teljesítményháromszög. viewBox 0 0 320 200. Derékszögű háromszög: vízszintes befogó (P) a (40, 160) ponttól a (240, 160) pontig, 3 px, var(--kk-primary), felirat alatta „P = 920 W (hatásos)”; függőleges befogó (Q) a (240, 160) ponttól a (240, 10) pontig, 3 px, szaggatott, var(--kk-warn-line), felirat jobbra „Q = 690 var (meddő)”; átfogó (S) a (40, 160) ponttól a (240, 10) pontig, 3 px, var(--kk-fg), felirat a közepén, felette „S = 1150 VA (látszólagos)”. A P:Q arány 200:150 px, azaz éppen 920:690 = 4:3. Derékszög-jel a (240, 160) sarokban. Ív a (40, 160) csúcsnál 36 px sugárral, var(--kk-muted), felirat „φ ≈ 36,9°”. Feliratok var(--kk-fg), 12 px. title: „Teljesítményháromszög”; desc: „230 V, 5 A, cos φ = 0,8: hatásos 920 W, meddő 690 var, látszólagos 1150 VA.”]

**Kidolgozott példa – egyfázisú, induktív terhelés.** U = 230 V, I = 5 A, cos φ = 0,8.
S = 230 V · 5 A = 1150 VA;
P = 1150 VA · 0,8 = 920 W;
sin φ = √(1 − 0,8²) = 0,6, így Q = 1150 VA · 0,6 = 690 var.
Ellenőrzés: √(920² + 690²) = 1150. A fázisszög φ ≈ 36,9°.

**Nem szinuszos áram.** A LED-meghajtók, kapcsolóüzemű tápegységek és inverterek árama gyakran torzított. Ilyenkor a P / S arányt teljesítménytényezőnek (λ, adatlapokon gyakran PF) nevezik, és ez kisebb lehet, mint a cos φ; ugyanakkora hatásos teljesítményhez nagyobb áram tartozik.

## Háromfázisú teljesítmény

Szimmetrikus terhelésnél – amikor mindhárom fázison ugyanakkora és ugyanolyan fázisszögű az áram:

P = √3 · U_v · I · cos φ = 3 · U_f · I · cos φ

ahol U_v a vonali (400 V), U_f a fázisfeszültség (230 V), I a fázisvezetők árama. Ugyanígy S = √3 · U_v · I és Q = √3 · U_v · I · sin φ.

**Kidolgozott példa – háromfázisú gép.** U_v = 400 V, I = 16 A, cos φ = 0,9.
S = √3 · 400 V · 16 A ≈ 11 085 VA;
P = 11 085 VA · 0,9 ≈ 9977 W;
sin φ = √(1 − 0,81) ≈ 0,4359, így Q ≈ 11 085 VA · 0,4359 ≈ 4832 var.
Ellenőrzés fázisfeszültséggel (400 V / √3 ≈ 230,94 V): 3 · 230,94 V · 16 A · 0,9 ≈ 9977 W.

A „3 · 230 V” és a „√3 · 400 V” között kis eltérés van (690 V és kb. 692,8 V), mert a 400 V a √3 · 230 V ≈ 398,4 V kerekített értéke. A különbség 0,5 %-nál kisebb, a gyakorlatban elhanyagolható.

Ha a fázisok terhelése eltér, a teljesítményt fázisonként kell kiszámolni és összeadni; az eltérés miatt a nullavezetőn is áram folyik. A fázisonkénti összesítést és a nullavezető áramát a Fázisterhelés kalkulátor számolja ki.

## Áram a teljesítményből

A fenti képleteket átrendezve:

- egyfázisú: I = P / (U · cos φ);
- háromfázisú: I = P / (√3 · U_v · cos φ).

**Kidolgozott példák.**
- 3000 W-os ohmos fogyasztó, 230 V: I = 3000 W / 230 V ≈ 13,04 A.
- 11 kW-os háromfázisú fűtés, 400 V, cos φ = 1: I = 11 000 W / (1,7321 · 400 V) ≈ 15,88 A.
- Ugyanez hibásan, √3 nélkül: 11 000 W / 400 V = 27,5 A – ez √3-szor (kb. 1,73-szor) több a valósnál.

**Motorok.** A motor adattábláján a tengelyen _leadott_ mechanikai teljesítmény szerepel. A hálózatból felvett hatásos teljesítmény ennél nagyobb: P_felvett = P_leadott / η, ahol η a hatásfok. A régi adattáblákon előforduló lóerő: 1 LE ≈ 735,5 W, így egy 7,5 kW-os motor kb. 10,2 LE.

## Energia és fogyasztás

Az energiafogyasztás a teljesítmény és a működési idő szorzata, kWh-ban.

**Kidolgozott példa – vízforraló.** Egy 2000 W-os vízforraló naponta összesen 15 percig (0,25 órán át) működik.
Napi fogyasztás: 2 kW · 0,25 h = 0,5 kWh;
éves fogyasztás: 0,5 kWh · 365 = 182,5 kWh.
Példaértékként 36 Ft/kWh-s áramdíjjal: 182,5 kWh · 36 Ft/kWh = 6570 Ft évente. A tényleges díj a tarifától függ; a Fogyasztás és költség kalkulátorban a saját áramdíjaddal számolhatsz.

## Gyakori tévedések

- **„A VA ugyanaz, mint a W.”** Csak akkor egyenlő a kettő, ha a teljesítménytényező 1 (tisztán ohmos terhelés). Egy szünetmentes táp vagy tápegység VA- és W-értéke eltérhet.
- **„A kW és a kWh ugyanaz.”** A kW teljesítmény (milyen gyorsan fogy az energia), a kWh energia (mennyi fogyott).
- **„Háromfázisnál elhagyható a √3.”** Vonali feszültséggel számolva a √3 nélkül 1,73-szoros hibát kapsz.
- **„A cos φ csak a motoroknál számít.”** Az elektronikus fogyasztók teljesítménytényezője is lehet jóval 1 alatti.
- **„A meddő teljesítmény nem terheli a hálózatot.”** Munkát nem végez, de növeli az áramot, így a vezeték melegedését és a feszültségesést is.
- **„A motor adattábláján a felvett teljesítmény szerepel.”** A leadott mechanikai teljesítmény szerepel; a felvett ennél a hatásfok miatt nagyobb.
