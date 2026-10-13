---
slug: elektromos-aram
title: "Elektromos áram: egyenáram, váltakozó áram, effektív érték"
navTitle: "Elektromos áram"
summary: "Mi az elektromos áram, mit jelent az amper, miben különbözik az egyen- és a váltakozó áram, és miért az effektív érték számít? Példákkal."
section: elmelet
category: alapfogalmak
risk: R1
audience: [laikus, tanulo, szakember]
keywords: [áram, áramerősség, amper, egyenáram, váltakozó áram, effektív érték, csúcsérték, frekvencia, 50 Hz, amperóra, csomóponti törvény, true RMS, áramirány]
synonyms: [villamos áram, áramerősség, DC, AC, RMS, I]
related: [elektromos-feszultseg, ohm-torvenye, joule-lenz-torveny, elektromos-teljesitmeny, kirchhoff-torvenyei, transzformator-mukodese, aram-vedokapcsolo-fi-rele, kismegszakito]
calculators: [ohm-torveny, aram-teljesitmenybol, fazisterheles]
sources:
  - standard: "127/1991. (X. 9.) Korm. rendelet"
    kiadás: "hatályos szöveg"
    pont: "3. § (1) és 1. számú melléklet – törvényes mértékegységek (amper, coulomb)"
  - standard: "MSZ EN 60038"
    kiadás: "2011"
    pont: "1. fejezet (alkalmazási terület, 50 Hz)"
ai: vázlat
version: 0.1
updated: 2026-10-10
---

**Röviden:** Az elektromos áram a töltéshordozók rendezett mozgása; erőssége megmutatja, mennyi töltés halad át a vezető keresztmetszetén egy másodperc alatt. Mértékegysége az amper (A). Egyenáramnál az irány állandó, váltakozó áramnál periodikusan változik; a hálózati áram megadott értéke mindig az effektív érték.

## Mi az elektromos áram?

Fémekben a szabad elektronok, elektrolitokban (például az akkumulátor folyadékában) az ionok, ionizált gázokban ionok és elektronok mozoghatnak. Ha a vezető két vége között [[elektromos-feszultseg|feszültség]] van, ezek a töltéshordozók rendezett mozgásba kezdenek: ez az elektromos áram. Az áramerősség az időegység alatt átáramló töltés:

I = Q / t

- I – áramerősség, amperben (A);
- Q – töltés, coulombban (C);
- t – idő, másodpercben (s).

1 A = 1 C/s. Az amper meghatározása 2019 óta az elemi töltés rögzített értékén (1,602176634 · 10⁻¹⁹ C) alapul; ebből következik, hogy 1 A áramnál másodpercenként kb. 6,24 · 10¹⁸ elektron halad át a keresztmetszeten.

**Áramirány.** Megállapodás szerint az áram a forráson kívül a pozitív pólustól a negatív felé folyik (technikai áramirány). A fémekben mozgó elektronok ezzel ellentétes irányba haladnak, de a számításokban a technikai irányt használjuk.

**Kidolgozott példa – töltés és amperóra.** 2 A állandó áram 1 órán át: Q = I · t = 2 A · 3600 s = 7200 C. Ez éppen 2 Ah (amperóra), az akkumulátorok kapacitását így adják meg. Az amperóra tehát töltés, nem energia: az energiához a feszültség is kell (12 V · 2 Ah = 24 Wh).

## Áramerősség a gyakorlatban

- Egy jelző-LED árama néhány milliamper, jellemzően legfeljebb 20 mA.
- Egy 2000 W-os vízforraló 230 V-on 2000 W / 230 V ≈ 8,7 A-t vesz fel.
- Egy lakás csatlakozása fázisonként néhány tíz amperes terhelést enged meg.

Az áram a vezetőben folyik, ezért mindig a vezetőn átfolyó mennyiségként értelmezzük – ellentétben a feszültséggel, amely két pont _között_ van. Soros áramkörben az áram minden pontban ugyanakkora: egy ép, szivárgás nélküli egyfázisú áramkörben a nullavezetőn ugyanannyi áram folyik vissza, mint amennyi a fázisvezetőn a fogyasztó felé folyik. Ha a kettő eltér, az áram egy része más úton – például a védővezetőn vagy egy emberi testen át – folyik el; ezt a különbséget érzékeli az áram-védőkapcsoló (FI-relé).

## Csomóponti törvény

[[kirchhoff-torvenyei|Kirchhoff csomóponti törvénye]] szerint egy csomópontba befolyó áramok összege egyenlő a kifolyó áramok összegével – töltés nem vész el és nem keletkezik.

**Kidolgozott példa – közös vezetékszakasz.** Egy áramkörön egyszerre működik egy hűtő (0,6 A), egy mikrohullámú sütő (5,2 A) és egy vízforraló (8,7 A). A közös szakaszon legfeljebb 0,6 + 5,2 + 8,7 = 14,5 A folyik. Váltakozó áramnál ez felső becslés: ha a fogyasztók árama eltérő fázisszögű, a pontos összeg valamivel kisebb, mert az áramokat vektorosan kell összeadni.

Ugyanez az oka annak, hogy háromfázisú hálózatban a nullavezető árama nem a fázisáramok egyszerű összege. Ha két fázison 10–10 A, a harmadikon 0 A folyik, és a terhelések azonos jellegűek (például tisztán ohmosak, szinuszos árammal), a nullavezetőn a 120°-os eltolás miatt 10 A folyik, nem 20 A. Torzított áramú fogyasztóknál (például sok LED-meghajtó vagy számítógép esetén) a nullavezető árama ennél nagyobb is lehet. A nullavezető áramát a Fázisterhelés kalkulátor a fázisonkénti adatokból kiszámolja; a háromfázisú teljesítményről az [[elektromos-teljesitmeny|Elektromos teljesítmény és energia]] cikk szól.

## Egyenáram és váltakozó áram

**Egyenáram** (DC): az irány állandó, és a nagysága is jellemzően állandó. Akkumulátor, napelemmodul, elektronikus eszközök belső tápja.

**Váltakozó áram** (AC): az irány periodikusan változik. A hálózati áram közel szinuszos, frekvenciája Európában f = 50 Hz, így a periódusidő

T = 1 / f = 1 / 50 Hz = 0,02 s = 20 ms,

és az áram iránya másodpercenként 100-szor vált. A pillanatnyi érték szinuszos esetben i(t) = Î · sin(2π · f · t), ahol Î a csúcsérték.

A váltakozó áram legnagyobb gyakorlati előnye, hogy feszültsége [[transzformator-mukodese|transzformátorral]] egyszerűen átalakítható. Így az energiát nagy távolságra nagy feszültségen, kis árammal – és ezért kis veszteséggel – lehet szállítani (lásd [[joule-lenz-torveny|Joule–Lenz-törvény]]).

[ÁBRA: abra-1 – Egyenáram és váltakozó áram időfüggvénye egymás alatt, közös időtengellyel. viewBox 0 0 320 240. Felső diagram (y 10–100): „Egyenáram” felirat bal felül; vízszintes időtengely 0–40 ms, a nullavonal var(--kk-muted); vízszintes egyenes +10 A-nél, 2,5 px, var(--kk-primary), felirat „I = 10 A”. Alsó diagram (y 130–230): „Váltakozó áram, 50 Hz” felirat; két teljes szinuszperiódus 0–40 ms között, csúcsérték ±14,1 A, 2,5 px, var(--kk-primary); szaggatott vízszintes vonal +10 A-nél var(--kk-warn-line) színnel, felirat „I_eff = 10 A”; pontozott vonal +14,1 A-nél var(--kk-muted), felirat „Î ≈ 14,1 A”; vízszintes kettős nyíl 0 és 20 ms között „T = 20 ms” felirattal. Osztásjelek 10 ms-onként mindkét időtengelyen, rács var(--kk-track). Feliratok var(--kk-fg), 12 px. title: „Egyenáram és váltakozó áram”; desc: „Felül állandó 10 A egyenáram; alul 50 Hz-es szinuszos áram, amelynek effektív értéke szintén 10 A, csúcsértéke kb. 14,1 A.”]

## Az effektív érték

A váltakozó áram pillanatnyi értéke folyamatosan változik, ezért egyetlen számmal úgy jellemezzük, hogy összevetjük az egyenárammal. **Az effektív érték az az egyenáram-érték, amely ugyanabban az ellenállásban ugyanannyi idő alatt ugyanannyi hőt fejleszt.** Matematikailag ez a pillanatnyi értékek négyzetének átlagából vont négyzetgyök (angol rövidítése RMS). Szinuszos áramnál:

I_eff = Î / √2 ≈ 0,707 · Î, illetve Î = √2 · I_eff

A hálózati áram és feszültség megadott értékei (16 A, 230 V) mindig effektív értékek.

**Kidolgozott példa – csúcsérték.** Egy 16 A effektív értékű szinuszos áram csúcsértéke Î = √2 · 16 A ≈ 1,4142 · 16 A ≈ 22,6 A.

**Kidolgozott példa – amikor az átlag félrevezet.** Egy áram a periódus felében 10 A, a másik felében 0 A. Az átlaga 5 A, az effektív értéke viszont

I_eff = √(0,5 · 10² + 0,5 · 0²) A = √50 A ≈ 7,07 A.

A vezeték melegedése szempontjából a 7,07 A számít, nem az 5 A.

A szinuszos áram egy félperiódusra vett átlaga (abszolút középértéke) 2/π · Î ≈ 0,637 · Î; az effektív és az átlagérték aránya kb. 1,11. Az egyszerűbb mérőműszerek egy része az átlagot méri, és ezzel az 1,11-es szorzóval számol, ami csak tisztán szinuszos jelre ad helyes effektív értéket. A LED-meghajtók, kapcsolóüzemű tápegységek és inverterek árama gyakran torzított; ilyenkor csak a valódi effektív értéket számoló („true RMS”) műszer mutat helyes értéket.

## Az áram hatásai

- **Hőhatás:** minden vezető melegszik, amelyen áram folyik – ezt a [[joule-lenz-torveny|Joule–Lenz-törvény]] írja le.
- **Mágneses hatás:** az áram mágneses teret kelt; ezen alapul az elektromágnes, a villanymotor, a relé és a kismegszakító elektromágneses kioldója.
- **Vegyi hatás:** akkumulátortöltés, elektrolízis, és sajnos a korrózió egy része is.
- **Élettani hatás:** az emberi testen átfolyó áram már kis erősségnél is veszélyes lehet. A hatás az áramerősségtől, az áram útjától és az időtartamtól függ. Többek között ez ellen véd az [[aram-vedokapcsolo-fi-rele|áram-védőkapcsoló (FI-relé)]].

## Gyakori tévedések

- **„Az áram elfogy a fogyasztóban.”** Soros áramkörben az áram minden pontban ugyanakkora; a fogyasztóban az energia alakul át, nem az áram.
- **„A nullavezetőn nem folyik áram.”** Ép egyfázisú áramkörben a nullavezetőn ugyanakkora áram folyik vissza, mint amekkora a fázisvezetőn oda.
- **„Az amperóra energia.”** Az amperóra töltésmennyiség; energiát csak a feszültséggel szorozva kapunk (Wh).
- **„Az effektív érték az átlag.”** Az effektív érték a hőhatással egyenértékű érték; nem szinuszos áramnál jelentősen eltérhet az átlagtól.
- **„A 16 A-es kismegszakító 16,1 A-nél azonnal lekapcsol.”** A névleges áramot csak kissé meghaladó áramnál a kismegszakító hosszú ideig, akár egyáltalán nem old ki. Nagyobb túlterhelésnél késleltetve old ki, annál gyorsabban, minél nagyobb a túláram; azonnal csak zárlati nagyságrendű áramnál. Részletek: [[kismegszakito|Kismegszakító]].
- **„Nagyobb feszültség mindig nagyobb áramot jelent.”** Adott ellenálláson igen, de adott teljesítményhez nagyobb feszültségen kisebb áram kell – ezért szállítják az energiát nagyfeszültségen.
