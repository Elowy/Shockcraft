# Tudástár és Kalkulátorok – végleges, egységes terv

Állapot: jóváhagyásra váró terv (2026-10-10). A négy tervváltozat bírálata után készült.

Mire épül:
- **Technikai gerinc:** a „technika” változat. Ennek a vinext-viselkedését a scratchpad/tudastar-spike próba igazolta.
- **Információs architektúra és felület:** a „felület” változat.
- **Tartalmi és minőségi folyamat, jogi keret:** a „tartalom” változat.
- **Kalkulátor-, teszt- és konstruktormotor:** az „eszközök” változat.

Az ütközéseket ez a dokumentum dönti el (lásd 11. pont). A hivatkozott sorszámok a 2026-10-10-i munkapéldányra vonatkoznak. A plan-editor.tsx és a plan-tools.tsx éppen változik (méretezés), ezért módosításkor mindig horgonyszöveget keress, ne sorszámot.

---

## 1. Cél és alapelvek

**Cél:** ingyenes, magyar nyelvű, mobil-első villanyszerelő-kézikönyv. Részei:
- Elmélet;
- Sémák: bekötések saját SVG-ábrákkal;
- Kalkulátorok;
- Konstruktor;
- Tesztek: vizsgaszimuláció.

A Kalkulátorok a Tudástáron kívül is első szintű menüpont. A Tudástár egyúttal a Villanyrajz tervező marketingcsatornája: a keresőből érkezőket elvezeti a regisztrációig.

**Alapelvek**

1. **Belépés és előfizetés nélkül, sütifal nélkül.**
   - Egyetlen Tudástár- vagy kalkulátoroldal sem hív `getAccount()`-ot, `cookies()`-t, `headers()`-t vagy adatbázist.
   - A vendég adatai csak a böngészőben vannak (könyvjelzők, előzmények, teszteredmények).
   - A tervező kapuja (app/tervezo/page.tsx → PlannerAccess) soha nem áll a látogató útjában. Ezt statikus őrteszt ellenőrzi.
2. **Csak lektorált tartalom jelenik meg élesben.**
   - A jóváhagyás tartalom-ujjlenyomathoz kötött, a meglévő `fingerprint()` mintájára (lib/sizing-tables.ts, FNV-1a).
   - Ha egy jóváhagyott tartalom megváltozik, újra le kell lektorálni; ezt CI-teszt kényszeríti ki.
   - Kivétel: a T0 szintű, tisztán matematikai kalkulátorok belső kettős ellenőrzéssel is élesíthetők (5.2 pont).
3. **Saját szöveg és saját SVG.**
   - A megaohm.hu és az APK csak témaforrás.
   - Az ábrák egy netlistából rajzolódnak. Ugyanebből készül a szöveges vezetéktábla és a működési szimuláció, amelyet teszt ellenőriz minden kapcsolóállásban.
4. **Egy közös, tiszta kalkulátormotor** (`lib/calc`). Ezt használja:
   - a /kalkulatorok;
   - a cikkekbe ágyazott kalkulátor;
   - a tesztek számolós sablonjai;
   - a Konstruktor ellenőrzései.

   A méretezési képletek egyetlen forrásból jönnek (`lib/sizing-tables.ts`, és a `lib/sizing.ts`-ből kiemelt `lib/sizing-formulas.ts`).
5. **Biztonság a keretbe építve, nem a szerzőn múlik.**
   - Minden oldalon van nem bezárható alapfigyelmeztetés.
   - Az R3-tartalmak tetején veszély-doboz áll.
   - A mérőhelyhez csak elvi rajz tartozik.
   - A bekötési oldalakon kötelező a „Mikor hívj szakembert?” szakasz.
6. **A marketing nem mehet a használhatóság rovására.**
   - Oldalanként legfeljebb egy tervező-blokk a tartalom után, plusz a lábléc.
   - Nincs felugró ablak, köztes oldal, regisztrációs fal, e-mail-gyűjtés vagy követés.
7. **Mobil-első, akadálymentes (WCAG 2.2 AA cél), nyomtatható.** Sötét/világos/rendszer mód villanás nélkül, a meglévő `shockcraft-theme` kulccsal.
8. **Mindkét build target azonosan működik.** Az MVP-ben nincs adatbázis és nincs API; minden fázis elfogadási feltétele az `npm run build` és az `npm run build:node`.
9. **Kis lépések a közös fájlokban.**
   - A Tudástár CSS-e külön fájlban van, a globals.css nem bővül.
   - A plan-editor.tsx, plan-tools.tsx, public-shell.tsx, legal-page.tsx és next.config.ts fájlokban csak hozzáfűzés történik, horgonyszöveg alapján.

---

## 2. Információs architektúra

### 2.1 Szekciók és feliratok

| Fül (alsó nav) | Útvonal | Tartalom | Megjelenik |
|---|---|---|---|
| Elmélet | /tudastar/elmelet | az APK tíz kategóriája, hazai fókusszal | MVP |
| Sémák | /tudastar/semak | bekötések ábrával: 101–107, dugalj, földelési rendszerek, később mérők, védelmek, motorok | MVP |
| Kalkulátorok | /kalkulatorok | minden villamossági számítás | MVP |
| Tesztek | /tudastar/tesztek | gyakorló és vizsga mód | 3. fázis |
| Konstruktor | /tudastar/konstruktor | elosztó-összerakó, kapcsolás-összerakó | 4. fázis |

- A feliratok a BACKLOG szerintiek. Mind egy helyen, a `lib/kb/categories.ts`-ben él, így a nyitott névdöntések (11. pont) egy sor cseréjével átvezethetők.
- Az URL-szegmensek stabilak.
- **Szabály:** csak az a fül látszik, amelyik szekcióban van közzétett elem. Halott vagy belépést kérő fül nincs.

### 2.2 URL-fa

Közös szabályok:
- Ékezet nélküli, kisbetűs, kötőjeles slugok, a keresett kifejezéssel és a típusszámmal.
- Az URL-ben a szekció szerepel, a kategória nem, így egy átsorolás nem töri el a linket.
- A belső `id` soha nem változik; a könyvjelzők és a tervezői linkek erre hivatkoznak.
- Slugváltáskor a `redirectFrom` mező `permanentRedirect()`-et ad.

```
/tudastar                               kezdőlap: kereső, Folytasd, szekciókártyák, Népszerű, biztonsági sáv, 1 CTA
/tudastar/elmelet                       kategórialista (APK-szerű, horgonyokkal: #alapfogalmak …)
/tudastar/elmelet/<slug>                pl. ohm-torvenye, vezetekek-szinjelolese, aram-vedokapcsolo-fi-rele
/tudastar/semak                         az 1. ötlet „egy oldala”: tartalomjegyzékes gyűjtőoldal (lásd 2.4)
/tudastar/semak/<slug>                  pl. valtokapcsolo-106-bekotese, foldelesi-rendszerek
/tudastar/szotar                        szakszótár A–Z, kifejezésenkénti horgonnyal (#fi-rele)
/tudastar/tudnivalok                    módszertan, lektorálás, felelősség, jogtisztaság, hibajelzés
/tudastar/konyvjelzok                   noindex: Könyvjelzők | Előzmények, Adataim törlése
/tudastar/tesztek                       (3. f.) indítás + futó teszt egy oldalon; ?tema=&hossz=&mod=, ?kod=<tesztkód>
/tudastar/konstruktor[/eloszto|/vilagitas]  (4. f.)
/kalkulatorok                           index: kereső, Kedvencek, Legutóbbiak, kategóriák
/kalkulatorok/<slug>?<bemenetek>        pl. /kalkulatorok/feszultseges?r=1f&I=16&L=23,4&A=2,5
/sitemap.xml, /robots.txt               új metadata route-ok (app/sitemap.ts, app/robots.ts)
```

- A minden H2-nek stabil `id`-je van (pl. `#gyakori-hibak`), az ábráknak `#abra-1`.
- A keresés overlay; külön /tudastar/kereses oldal csak a 2. fázisban jön, JS nélküli tartalékként, opcionálisan.

### 2.3 Navigáció

**Közös keret** (`components/kezikonyv/shell.tsx`) az `app/(kezikonyv)/layout.tsx`-ben, mindkét fára.

**Mobilon és álló tableten (< 950 px, a public.css meglévő töréspontja):**
- Alkalmazásfejléc: 56 px, sticky.
  - Bal oldal: szekció gyökerén a Villanyrajz-jel (→ /). Részletoldalon „←”, amely a szülőlistára visz, nem `history.back()`-kel, mert a keresőből érkezőt kivinné az oldalról. aria-label: „Vissza: Sémák”.
  - Közép: a szekció neve.
  - Jobb oldal: Keresés, Könyvjelzők, Menü; mindhárom 48×48 px.
- Alsó navigáció:
  - `<nav aria-label="Tudástár részei">`, 64 px + `env(safe-area-inset-bottom)`, `viewportFit:'cover'`.
  - Lucide-ikonok: BookOpen, PlugZap, Calculator, ClipboardCheck, Blocks.
  - Az aktív fül `aria-current="page"`, kitöltött ikonnal és aláhúzással, nem csak színnel.
  - Ha mező van fókuszban, a sáv elrejtőzik: `.kk:has(input:focus,select:focus) .kk-bottom-nav{display:none}`.
  - A sütidoboz a sáv fölé kerül: `:root:has(.kk-bottom-nav) .cookie-notice{bottom:calc(var(--kk-nav-h) + 10px)}`.
- Menü: oldalfiók a `components/ui/sheet.tsx`-szel. Tartalma:
  - Tudástár kezdőlap, a szekciók, Könyvjelzők és előzmények;
  - Megjelenés: Világos / Sötét / Rendszer szerint;
  - Szakszótár, Tudnivalók, Hibát találtál?;
  - Villanyrajz főoldal, Tervező (ingyenes fiókkal);
  - ÁSZF, Adatvédelem, Sütik, Sütibeállítások (`CookieSettingsButton`).

**Asztali nézetben (≥ 950 px):**
- Felül a `PublicHeader` `current` proppal, a .kk alatt sötét módú felülírással (a `.share-site` minta szerint).
- Alatta szekciófülek.
- Bal oldalsáv a kategóriákkal; középen legfeljebb 72 karakteres hasáb; jobbra sticky tartalomjegyzék.
- Alsó navigáció nincs.
- Kereső: „/” és Ctrl+K.

**Nyilvános oldalak:**
- `components/public-shell.tsx` PublicHeader:
  - Új linkek: „Tudástár” és „Kalkulátorok”, valamint `current` prop.
  - 600 px alatt a sortörő nav helyett márka + „Kalkulátorok” + `<details>` „Menü”, amely JS nélkül is nyílik.
  - A PublicHeader a home-page, legal-page, planner-access és share-viewer oldalakon is megjelenik, mindegyiken ellenőrizni kell.
- PublicFooter: új „Tudástár” oszlop (Tudástár, Kalkulátorok, Szakszótár, Tudnivalók).
- `components/home-page.tsx`:
  - új szekció a `#funkciok` után: „Ingyenes Tudástár és kalkulátorok – belépés nélkül”, egy kis 106-os ábrával;
  - a `home-fine` szöveg kiegészül: „A Tudástár és a kalkulátorok belépés nélkül, ingyen használhatók.”;
  - új GYIK-tétel: „Kell fiók a Tudástárhoz? Nem.”
- `components/planner-access.tsx`: „Belépés nélkül is használhatod” doboz (Tudástár, Kalkulátorok). A kapuoldal így nem zsákutca.

**Tervező** (minden link új lapon, a `beforeunload`-védelem miatt; `target=_blank rel=noopener`, rejtett „(új lapon)” szöveggel):
- MVP:
  - a `.topbar`-ban „Kalkulátorok” ikonlink;
  - a Tervsegéd `guide-link`-je mellett (plan-tools.tsx, „Telepítési útmutató (PDF)” horgony) „Tudástár ↗” és „Kalkulátorok ↗”;
  - a szerelvény-tulajdonságpanelen, a `label="Szerelvény típusa"` Choice alatt „Bekötés a Tudástárban ↗”, a `lib/kb/links.ts` kind → id térképéből. Csak közzétett célra mutat; ezt teszt garantálja.
- 2. fázis:
  - Karakterisztika („Mit jelent a B, C, D?”), ÁVK-csoport, modul-dialógus „Készülék típusa” súgólinkek;
  - mélylinkek a Fázisterhelés és a Méretezés riportból, előtöltött kalkulátorra;
  - „Röviden” popover.

### 2.4 Oldalanatómiák

**Séma vagy cikk részletoldal** (sorrendben):
1. Morzsamenü (BreadcrumbList JSON-LD-vel is), H1.
2. Lektorálási jelvény: „Szakmailag lektorálta: név, minősítés · dátum · v3”, link a Tudnivalókra.
3. Műveletek: Könyvjelző, Megosztás (Web Share, ha nincs, link másolása), Nyomtatás.
4. „Röviden” doboz: 2–4 mondat, egyben a meta description.
5. R3 esetén nem zárható veszély-doboz a figyelmeztetés-könyvtárból; R2 esetén figyelem-doboz.
6. Ábra nézetváltóval (2.5 és 3.4 pont): Bekötés | Szerelési rajz | Működés. Nagyítás gomb, ábraaláírás, ábra-id és verzió a sarokban.
7. „Vezetékek táblázatban” `<details>`: a netlistából generált szöveges megfelelő.
8. Tartalom (mobilon `<details>`), majd a H2-szakaszok:
   - Hogyan működik?
   - Bekötés lépésről lépésre, a feszültségmentesítéssel kezdve;
   - Régi berendezésben;
   - Gyakori hibák;
   - Mikor hívj szakembert?
9. Kapcsolódó kalkulátor előtöltve, kapcsolódó cikkek; a 3. fázistól „Teszteld magad”.
10. Tervező-blokk: a tervező valódi alaprajzi jele (ElectricalSymbol) és „Így jelöld az alaprajzon”. A jel alatti 1/2/5/6/7 a 101–107 típusszám utolsó jegye, ezt a cikk el is magyarázza.
11. Előző/következő a kategórián belül.
12. Lábléc-meta: verzió, lektor, utolsó érdemi módosítás, Változások (összecsukható), „Hibát találtál?”, alapfigyelmeztetés.

**A /tudastar/semak gyűjtőoldal (az 1. ötlet „egy oldala”).** Tartalomjegyzékes oldal, amely saját canonicallal csak összefoglal; a részletoldalak a kanonikusak. Szakaszai:
- Világítási kapcsolók 101–107: kártyánként mini-ábra, 3–5 mondat és mélylink; a 103-as csak itt szerepel, mert nincs tervező-kind;
- Dugaljak;
- Földelési rendszerek (IT, TT, TN-C, TN-S, TN-C-S);
- Fogyasztásmérők (2. fázis);
- Számítások: kártyák a kalkulátorokra.

**Kalkulátoroldal:**
- H1 és egymondatos leírás.
- Bemenetek:
  - felirat, szimbólum, mértékegység-választó;
  - `type=text inputMode=decimal`, tizedesvesszőt és -pontot is elfogad;
  - magyar hibaüzenet a mező alatt.
- Eredménykártya:
  - nagy szám mértékegységgel;
  - `aria-live=polite`, 700 ms tétlenség után;
  - figyelmeztetések, feltételezések.
- „Levezetés”: képlet → behelyettesítés → eredmény → forrás és állapotjelvény.
- „Mire jó / mire nem”, biztonsági doboz (T1-nél nem zárható).
- Kidolgozott példa: SSR-ben renderelve, JS nélkül is olvasható.
- Műveletek: Kedvenc, Link másolása, Eredmény másolása, Nyomtatás számítási lapként.
- Kapcsolódó cikk és kalkulátor, verzió, „Hibát találtál?”, 1 CTA.

### 2.5 Szöveges drótvázak

```
[1] Mobil – /tudastar                     [2] Mobil – Séma (106)
+------------------------------------+    +------------------------------------+
| [V] Tudástár      [Ker][Kv][Menü]  |    | <- Sémák          [Ker][Kv][Menü]  |
| Villanyszerelő Tudástár (H1)       |    | Tudástár > Sémák > Világítás       |
| Bekötések, kalkulátorok – ingyen,  |    | Váltókapcsoló (106) bekötése       |
| belépés nélkül.                    |    | [Lektorálta: … · 2026.11 · v1]     |
| [ Keresés: váltó, 107, IP65 …   ]  |    | [Könyvjelző][Megosztás][Nyomtatás] |
| Folytasd: (106)(Fesz.esés 16 A…)   |    | +- Röviden -----------------------+|
| [Elmélet 7] [Sémák 9]              |    | | Egy lámpát két helyről kapcsolsz||
| [Kalkulátorok 10]                  |    | +- VESZÉLY (nem zárható) ---------+|
| Népszerű: > 106  > Fesz.esés       |    | | Csak feszültségmentesítve, szak-||
| ! Villamos szerelést csak szak-    |    | | képzett személy …               ||
|   képzett személy végezhet. >      |    | [Bekötés][Szerelési rajz][Működés] |
| +- Tervezd meg a házad villamos -+ |    | | SVG: L→K1 közös; 1–1, 2–2 kor-  ||
| |  tervét – 1. projekt ingyenes > | |    | | respondáló; K2 közös→lámpa→N; PE||
| +--------------------------------+ |    | 1. ábra · [Nagyítás]               |
+------------------------------------+    | > Vezetékek táblázatban            |
| Elmélet | Sémák | Kalkulátorok     |    | ## Hogyan működik? ## Lépésről …   |
+------------------------------------+    | ## Gyakori hibák ## Mikor hívj …   |
                                          | [Kapcsolódó: Feszültségesés >]     |
[3] Mobil – Kalkulátor                    | +- A tervezőben: [jel 6] Így jelöld|
+------------------------------------+    | |  az alaprajzon. Ingyenes fiókkal>||
| <- Kalkulátorok   [Ker][Kv][Menü]  |    | < 105 Csillár | 106+6 Kettős >     |
| Feszültségesés [☆][Link][Nyomt.]   |    | v1 · Lektor · Hibát találtál?      |
| Rendszer (o)1f ( )3f ( )DC         |    +------------------------------------+
| Áram       [ 16    ] [A v]         |
| Hossz      [ 23,4  ] [m v] egyirány|    [4] Asztali (≥950 px) – cikk
| Keresztm.  [ 2,5 v ] mm²           |    | PublicHeader: … [Tudástár] Kalkulátorok [/] [Téma] Belépés [Tervező] |
| +- Eredmény (aria-live) ---------+ |    | Elmélet | [Sémák] | Kalkulátorok                                      |
| | ΔU = 6,74 V · 2,93 %           | |    | Oldalsáv kategóriák | szöveghasáb ≤72 kar. + ábra | Tartalom (sticky) |
| | Lmax (5 %): 39,9 m             | |
| +--------------------------------+ |    [5] Mobil – Működés nézet
| v Levezetés  > Feltételezések      |    | Működés: [K1: fel] [K2: le]  (aria-pressed) |
| ! Tervezői ellenőrzést segítő …    |    | Állapot: a lámpa ég (szövegesen is)        |
| (mező fókuszban az alsó nav rejtve)|    | Kiemelt áramút; igazságtábla alatta        |
+------------------------------------+
```

### 2.6 Keresés

- **Belépési pontok:** a fejléc ikonja (mobilon teljes képernyős réteg), az asztali mező „/” és Ctrl+K gyorsbillentyűvel, a kezdőlap nagy keresőgombja, a 404-oldal.
- **Felület:** a cmdk akadálymentes combobox-mintája (`components/ui/command.tsx`), `shouldFilter=false` mellett, saját rangsorral.
- **Index:** az első megnyitáskor dinamikus importtal töltődik (`lib/kb/search-index.ts`). Tartalma:
  - a cikkek könnyű metaadatai (cím, summary, keywords, synonyms, anchors);
  - a szótár;
  - a kalkulátor-registry metaadatai.

  Cikktörzs nem kerül bele. API-végpont nem kell.
- **Algoritmus** (`lib/kb/search.ts`, tiszta):
  - NFD, ékezet- és kisbetű-független normalizálás; ugyanaz, mint a `lib/catalog.ts` normalizeSearch-e, de zod nélkül;
  - előtag-egyezés; 5 betűnél hosszabb szavaknál egy elírást tűr (Damerau–Levenshtein ≤ 1);
  - szinonimák: FI-relé = áram-védőkapcsoló = ÁVK = RCD; konnektor = dugalj; villanyóra = fogyasztásmérő; „106” = váltókapcsoló; nullázás = TN-rendszer;
  - rangsor: cím > szinonima > kulcsszó > összefoglaló.
- **Csoportok:** Sémák, Elmélet, Kalkulátorok, Szakkifejezések.
- **Üres lekérdezés:** legutóbbi keresések és gyorschipek (101–107, Színjelölés, IP, FI-relé, Feszültségesés).
- **Nincs találat:** „Erre gondoltál?” javaslat, és „Hiányzik egy téma? Írd meg” (mailto, a keresett szóval).

### 2.7 Könyvjelzők, kedvencek, előzmények

- **Egy fogalom mindenre:** a könyvjelző típusa cikk, séma, kalkulátor, szakasz (`id#horgony`) vagy teszttéma lehet. A kalkulátor „Kedvenc” csillaga a calc típusú könyvjelző; a /kalkulatorok index ezeket „Kedvencek” néven mutatja.
- **Könyvjelző gomb:** `aria-pressed`, rögzített méret (hidratáláskor nem ugrál a felület), sonner-értesítés „Visszavonás” gombbal.
- **Előzmények:** automatikusak, legfeljebb 30 elem. Kalkulátornál a lekérdezést is megőrzi („Feszültségesés – 16 A, 23,4 m, 2,5 mm²”). Ezekből jönnek a „Folytasd” chipek és a „Legutóbbiak”.
- **/tudastar/konyvjelzok:**
  - szekciónként csoportosítva, egyenként törölhető;
  - tájékoztatás: „Csak ebben a böngészőben tároljuk; fiók nem kell; böngészőadat-törléskor elvesznek.”;
  - „Minden Tudástár-adat törlése” gomb megerősítéssel.
- Lapok közötti szinkron a `storage` eseménnyel. Fiókos szinkron csak az 5. fázisban, opcionálisan.

### 2.8 CTA- és marketingszabály (rögzített)

- Oldalanként legfeljebb egy tervező-blokk a tartalom után, plusz a lábléc. A biztonsági blokk és a lépéssor közé CTA nem kerülhet.
- Tilos: felugró ablak, köztes oldal, görgetésre megjelenő sáv, regisztrációhoz kötött tartalom, e-mail-gyűjtés.
- Őszinte szöveg: „Ingyenes fiókkal; az első projekt ingyenes.” Mobilon: „A tervezőt számítógépen ajánljuk – regisztrálni most is tudsz.” Cél: `/tervezo?auth=register` (account-menu.tsx már kezeli).
- Mérés: az MVP-ben nincs; a sütitájékoztató szerint nincs látogatottságmérés, és ez így marad. Egy süti nélküli aggregált számlálás külön tulajdonosi döntés, az adatvédelmi szöveg módosításával.

### 2.9 Akadálymentesség, nyomtatás, sötét mód

**Akadálymentesség:**
- Szerkezet: „Ugrás a tartalomra”; tájékozódási pontok (header, két nav eltérő aria-label-lel, main, aside, footer); pontosan egy H1; `lang=hu` a gyökér layoutból.
- Kezelés: érintési célok legalább 44 px (a terv 48 px); a fókuszjelzés a public.css mintája szerint, sötét módban tokenből.
- Ábrák:
  - `<svg role="img">` `<title>`/`<desc>` elemekkel; a desc a netlistából generált leírás; mellette mindig szöveges vezetéktábla;
  - a szín sosem egyedüli jel: minden éren felirat (L, N, PE, 1, 2), a PE zöld + sárga szaggatott, a kapcsolt út vastagabb;
  - `prefers-reduced-motion` mellett nincs animáció, `prefers-contrast:more` mellett vastagabb vonalak;
  - a görgethető ábra billentyűzettel fókuszálható (`tabIndex=0`).
- Méret: 320 px-en nincs vízszintes görgetés (az ábratárolón kívül); rem-alapú méretek.

**Nyomtatás:**
- Rejtve: fejléc, alsó nav, oldalfiók, CTA, sütidoboz.
- Látható: URL, nyomtatás dátuma, verzió, ujjlenyomat, lektor és mindig a biztonsági szöveg.
- Az ábra minden nézete egymás alá kerül; ehhez a nézetváltó osztállyal rejt, nem `hidden` attribútummal.
- Sötét módból is fehér papírra nyomtat.

**Sötét mód:**
- Tokenek a `.kk` gyökéren.
- Inline indítószkript a layout első elemeként. Ezt a CSP `'unsafe-inline'` direktívája engedi (3.2 pont), így nincs villanás.
- Háromállású választó. A „Rendszer” törli a kulcsot, ez kompatibilis a tervező `shockcraft-theme` logikájával (plan-editor.tsx:85, share-viewer.tsx:51).

---

## 3. Technikai architektúra

### 3.1 Útvonalcsoport és renderelés

A vinext 1.0.0-beta.5 alatt a spike-ban mért tények, mindkét targeten:

| Tény | Következmény |
|---|---|
| Ha csak `revalidate` van, a paraméteres oldal mindig `no-store` | dinamikus szegmensen: `dynamic='force-static'`, `revalidate=3600`, `dynamicParams=false`, `generateStaticParams()` (csak közzétett elemek) |
| Első kérés MISS, utána HIT `s-maxage=3600`; ismeretlen slug 404 | biztonsági javítás legfeljebb 1 órán belül, deploykor azonnal élesedik; nincs CDN (nginx proxy_cache off) |
| A next.config Cache-Control-ját a vinext felülírja ezeken az oldalakon | élettartamot a `revalidate` szabályoz, a next.config csak biztonsági fejlécet ad |
| A `/tudastar/:path*` forrás nem illeszkedik a `/tudastar`-ra | gyökérre `'/:root(tudastar\|kalkulatorok)'`, aloldalakra külön `:path*` szabályok |
| A query string ugyanazt az ISR-bejegyzést kapja | a kalkulátor a paramétereket kliensoldalon olvassa (`useSyncExternalStore`, üres szerver-pillanatkép); szerveroldali searchParams tilos |
| `import dynamic from 'next/dynamic'` + `export const dynamic` → „o is not a function” (start2.log) | a szigetek sima `'use client'` importtal jönnek; ha kell lusta betöltés: `import lazy from 'next/dynamic'`; erre őrteszt |
| MathML SSR működik; a @types/react nem ismeri | `components/kezikonyv/formula.tsx` `React.createElement`-tel |
| Az `ElectricalSymbol` szerverkomponensben is renderelhető (nincs `'use client'`, fill `var(--plan-room)`) | a tokent a kezikonyv.css definiálja mindkét témára |

Fájlok:
- `app/(kezikonyv)/layout.tsx` (szerver):
  - tartalom: `<ThemeBoot/>` inline szkript, Shell, Toaster, `import './kezikonyv.css'`;
  - `generateMetadata` → `metadataBase` a `lib/site-origin.ts`-ből;
  - `viewport`: `themeColor` (világos és sötét), `viewportFit:'cover'`.
- `tudastar/layout.tsx` title-template: „%s – Tudástár – Villanyrajz”; `kalkulatorok/layout.tsx`: „%s – Kalkulátorok – Villanyrajz”.
- A tartalmi linkek egyszerű `<a>` elemek (mint a public-shell.tsx-ben), nem next/link. Így egy hosszú listán nincs tömeges RSC-előtöltés mobilneten.
- Prerender (`vinext({prerender})`) nincs: csak `routes:'*'` támogatott, és van egy 3 perces build-korlát (scripts/build-verified.sh).

### 3.2 Fejlécek és CSP (next.config.ts, hozzáfűzés)

Források: `'/:root(tudastar|kalkulatorok)'`, `'/tudastar/:path*'`, `'/kalkulatorok/:path*'`.

Fejlécek:
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Az `'unsafe-inline'` indoka:
- a vinext inline RSC-szkripteket ír ki;
- nonce esetén `no-store` lenne, ami kizárná a gyorsítótárat.

A kockázat kicsi:
- nincs felhasználói HTML;
- `dangerouslySetInnerHTML` csak a `json-ld.tsx`-ben (`<` → `<` escape) és a `theme-boot.tsx`-ben (statikus szöveg) van;
- mindkettőt őrteszt ellenőrzi.

Dev módban a Vite HMR miatt a CSP csak productionben aktív, ha szükséges.

### 3.3 Tartalomformátum és regiszter

A tartalom típusos TS-modulokban, blokk-AST formában él. MDX nincs, új függőség sincs. Indokok:
- a tsx-tesztek közvetlenül importálják;
- ujjlenyomatolható és szerkezetileg tesztelhető (pl. „R3 első blokkja veszély-doboz”).

Felosztás:
```
content/tudastar/elmelet/meta.ts      KbMeta[] – könnyű, kliensre is mehet (kereső, menük, tervezői linkek)
content/tudastar/elmelet/<slug>.ts    export default {blocks, sources, changes, ai} – csak szerverkomponens importálja
content/tudastar/semak/meta.ts + <slug>.ts
content/tudastar/diagramok/<id>.ts    netlista + elrendezés (3.4)
content/tudastar/szotar.ts            {term, abbr?, synonyms, definition, articleId?, preferred?, avoid?}
content/tudastar/index.ts             kézi importlista (bodies), csak szerveren
```

- **Inline mini-markup** (`lib/kb/inline.ts`, saját tiszta parser → React-elemek, innerHTML nélkül):
  - `**félkövér**`, `_dőlt_`;
  - `[[id#horgony|szöveg]]` belső link; nem közzétett célra mutató link sima szövegként jelenik meg;
  - `{{szotar:PEN}}` szótári magyarázó;
  - `^{…}` és `_{…}` felső és alsó index.
- **Ujjlenyomat:** `fingerprint({meta: metaWithoutReview, body})` a `lib/sizing-tables.ts` `fingerprint()`-jével (importálva, nem duplikálva).
- **Közzététel** (`lib/kb/review.ts`):
  - Szerveroldalon: `isPublished(item)` = `status==='jovahagyott'` ÉS egyező ujjlenyomat ÉS minden függőség (ábra, kalkulátor, belső link célja) is közzétett. Ugyanez a szabály hajtja a `generateStaticParams`-ot, a sitemapet és a keresőindexet.
  - A kliensoldali index csak a státuszt látja; az eltérést a CI-teszt zárja ki.
- **Lektori előnézet:** `SHOCKCRAFT_KB_PREVIEW=1` (helyi vagy staging, élesben soha). A tervezet is látszik, noindex-szel és sárga „Tervezet – nem lektorált” sávval. Az env-et a `cloudflare:workers`-ből olvassa (Node-on a db/node-env.ts aliasra fut).

### 3.4 Ábramotor

**`lib/kb/circuit.ts`** (tiszta):
- `Diagram={id,title,viewBox,parts:[{id,symbol,x,y,rot,label}],wires:[{from:'S1.L',to:'E1.L',role,path}],sources,loads}`
- `role ∈ L|Lk|K1|K2|N|PE|L1|L2|L3|PEN`
- Szimbólumonként: kapcsok és állapotfüggő belső összeköttetések (switch1: be [[L,1]], ki []; switch6: 0 → [[C,1]], 1 → [[C,2]]; switch7: egyenes vagy keresztezett pár).
- `simulate(diagram,state)`: union-find. Eredménye: fogyasztónként áram alatt van-e, valamint az energizált hálózatok.
- `wireTable(diagram)`: determinisztikus szöveges bekötési táblázat.

**`lib/kb/earthing.ts`:** IT, TT, TN-C, TN-S, TN-C-S adatból. Tartalma: csillagpont, PEN/N/PE vezetők, fogyasztói test, földelők, PEN-szétválasztási pont.

**Három nézet:**
- **Bekötés:** vezetékszintű, kapcsokkal, színes erekkel. Saját, IEC 60617-stílusú szimbólumkészlet: `components/kezikonyv/diagram/symbols.tsx`.
- **Szerelési rajz:** alaprajzi nézet a tervező `ElectricalSymbol`-jával (ez teljesíti a BACKLOG „a tervező meglévő rajzjeleivel” követelményét), kábelszakaszonkénti érszámmal.
- **Működés:** kliens-sziget (`diagram-figure.tsx`). A kapcsolók gombok `aria-pressed`-del, kiemelt áramúttal és szöveges állapottal; alatta igazságtábla.

**Ér-tokenek** (a `lib/board.ts` wireColor értékeiből):
- `--wire-l1` barna, `--wire-l2` fekete (sötét módban világos halóval), `--wire-l3` szürke, `--wire-n` kék, `--wire-pe` zöld + `--wire-pe-stripe` sárga.
- Mindkét témában legalább 3:1 kontraszt a háttérhez.
- A tervező egyszínű zöld PE-je nem változik. Az ábrán egy „Így látod a tervezőben” sor magyarázza; az igazításról a lektor dönt az 5. fázisban.

### 3.5 Vendégtárolás (`lib/kb/storage.ts`)

`createStore<T>({key,version,validate,max})`, fölötte `useSyncExternalStore`.
- SSR-en üres pillanatkép.
- Minden hozzáférés try/catch-ben, kézi validálással (zod nélkül, mert kliensoldali).
- Sérült JSON esetén alaphelyzet.
- Kivételt dobó tároló (privát mód) esetén memóriabeli tartalék és „A böngésző nem engedi a mentést” jelzés.
- Könyvjelzőként csak belső relatív útvonal fogadható el, regexszel ellenőrizve.

| Kulcs | Tároló | Tartalom, korlát | Fázis |
|---|---|---|---|
| `shockcraft-kb-bookmarks-v1` | localStorage | `{type,id,anchor?,title,at}` ≤ 300 | MVP |
| `shockcraft-kb-recent-v1` | localStorage | előzmények ≤ 30 (kalkulátornál a query is), keresések ≤ 8 | MVP |
| `shockcraft-kb-quiz-v1` | localStorage | statisztika kérdésenként, ≤ 50 teszteredmény | 3. |
| `shockcraft-kb-quiz-session` | sessionStorage | a futó teszt (újratöltés-álló) | 3. |
| `shockcraft-kb-builder-v1` | localStorage | az utolsó Konstruktor-állapot | 4. |
| `shockcraft-theme` | localStorage | meglévő, közös a tervezővel | – |

- Minden új kulcs bekerül a `components/legal-page.tsx` `cookies` tömbjébe, „a felhasználó kérésére mentett, működéshez szükséges” besorolással.
- A sütiablak rövid szövege maradhat („kért beállítások megőrzése”); a táblázat kötelező.

### 3.6 Téma

- **`components/kezikonyv/theme-boot.tsx`:** inline szkript. Beolvassa a `shockcraft-theme` kulcsot; ha nincs, a `matchMedia`-t; ezután beállítja a `document.documentElement.dataset.theme`-et (a share-viewer mintája).
- **`lib/kb/theme.ts`:** olvasás, írás, „Rendszer” = kulcs törlése.
- **Hidratálás:** ha a `<html>` attribútum miatt hidratálási figyelmeztetés jön, az `app/layout.tsx` `<html>` elemére `suppressHydrationWarning` kerül (egysoros, ellenőrizendő változtatás).
- **CSS (`app/(kezikonyv)/kezikonyv.css`):**
  - kizárólag tokenek, `.kk-` előtaggal, rem-ben;
  - `[data-theme=dark] .kk {…}`;
  - `@media print` világos tokenekkel;
  - `prefers-reduced-motion` és `prefers-contrast` szakasz;
  - sötét felülírás a `.kk .public-header` és `.kk .public-footer` elemekre.

### 3.7 SEO

**Új fájlok:**
- **`lib/site-origin.ts`:** `siteOrigin(): string|null`. Ugyanazt validálja, mint a `lib/account-email.ts` `publicOrigin()`-ja, de nem dob, és nem húzza be az auth/secrets/mail láncot.
- **`app/sitemap.ts`:** a főoldal, a jogi oldalak, a /tudastar és a szekciógyökerek, a közzétett elemek (`lastModified` = utolsó érdemi módosítás), valamint a /kalkulatorok és a közzétett kalkulátorok. Ha nincs APP_ORIGIN, csak relatív üres listát ad.
- **`app/robots.ts`:**
  - Allow: /
  - Disallow: /api/, /admin, /fiok/, /tudastar/konyvjelzok
  - Sitemap: az APP_ORIGIN-ból.
  - A /megosztas nincs tiltva, hogy a robot lássa az X-Robots-Tag noindexet.

**Metaadat** (`lib/kb/seo.ts`):
- title legfeljebb 60 karakter;
- description = summary (80–160 karakter);
- `alternates.canonical` paraméter nélkül;
- openGraph: `type:'article'`, `locale:'hu_HU'`, `siteName:'Villanyrajz'`.

**JSON-LD:**
- BreadcrumbList;
- TechArticle (`headline`, `dateModified`, `inLanguage:'hu'`, `publisher`);
- `reviewedBy` és `lastReviewed` csak valós lektorálásnál;
- kalkulátoron WebApplication (`isAccessibleForFree:true`).
- FAQ- és HowTo-jelölés nincs.

### 3.8 Kódfelosztás, költségkeret, importőrök

- A tartalom-, ábra- és képletrenderelők szinkron szerverkomponensek, kliens-JS nélkül.
- Kliensszigetek: BottomNav, HeaderActions (kereső lusta betöltéssel), KbMenu, BookmarkButton, VisitTracker, DiagramFigure, Calculator, CalcIndex, BookmarksPage.
- **Tiltott importok** a `lib/kb`, `lib/calc`, `components/kezikonyv`, `components/calc` és `app/(kezikonyv)` alatt:
  - `lib/plan` futásidejű importja (`import type` megengedett), `zod` a kliensszigetekben;
  - `lib/sizing.ts` (helyette `lib/sizing-formulas.ts` és `lib/sizing-tables.ts`), `lib/sizing-schema.ts`;
  - `db/*`, `lib/auth`, `lib/billing`, `lib/pdf-export`, `jspdf`, `components/plan-*`, `components/phase-load-report`, `next/headers`;
  - a `fetch(` a calc-kódban.

  Ezt importgráf-őrteszt ellenőrzi.
- **Költségkeret:**
  - Tudástár-specifikus kezdeti JS ≤ 40 KB gz oldalanként; kalkulátoroldal saját JS-e ≤ 30 KB gz;
  - kezikonyv.css ≤ 15 KB gz; cikk-HTML ≤ 150 KB tömörítetlenül;
  - a worker-csomag növekedése az MVP után ≤ 1,5 MB;
  - Lighthouse mobilon: Perf ≥ 90, A11y ≥ 95, SEO ≥ 95.

  Mérés: esbuild-metafile és a `.vite/manifest.json`.
- A tervezőbe csak a kb. 1 KB-os `lib/kb/links.ts` kerül.

### 3.9 Két build target

- A Tudástár nem használ DB-t, R2-t, munkamenetet vagy Stripe-ot. Környezeti változót (APP_ORIGIN, SHOCKCRAFT_KB_PREVIEW) csak a `cloudflare:workers` env-en át olvas.
- Build utáni füstteszt (`tests/kb-routes.mjs`) mindkét targeten. Ellenőrzi:
  - 200/404;
  - második kérésre `s-maxage`;
  - a CSP és a nosniff megléte;
  - nincs Set-Cookie;
  - abszolút canonical;
  - a sitemap és a robots helyes;
  - a JSON-LD érvényes JSON.

---

## 4. Tartalom- és minőségi folyamat

### 4.1 Szerepek

- **Szerző:** a tulajdonos vagy egy fejlesztő; MI-vázlattal is dolgozhat (4.6). Nyilatkozik, hogy a szöveg saját.
- **Szakmai lektor:** MMK-névjegyzékes villamos tervező vagy érintésvédelmi szabványossági felülvizsgáló, legalább 5 év gyakorlattal. A tulajdonos jelöli ki.
- **Második olvasó (R3-nál):** a szerzőtől független szakember, pl. villanyszerelő szakoktató.
- **Kérdésbank:** szakoktató vagy vizsgáztató, a lektorral.
- **Jogi lektor:** a figyelmeztetés-könyvtár, a Tudnivalók oldal és a jogi oldalak módosításai.
- **Felelős szerkesztő (a tulajdonos):** kiad, kezeli a hibajelzéseket, felfüggeszt.
- **Szerződés:** megbízás, felhasználási szerződés (Szjt.), jogtisztasági nyilatkozat, hozzájárulás a név és a névjegyzéki szám megjelenítéséhez. Ezért az adatvédelmi tájékoztatót bővíteni kell.

### 4.2 Kockázati osztályok

| Osztály | Példa | Kapu | Felülvizsgálat |
|---|---|---|---|
| R1 elméleti | Ohm, teljesítmény | 1 lektor | 24 hó |
| R2 szakmai, nem életvédelmi | IP-védettség, vezetékjelölések | 1 lektor | 24 hó |
| R3 biztonságkritikus | bekötések, FI-relé, földelés, feszültségmentesítés | lektor + második olvasó | 12 hó |
| REG (jelző) | mérőhely, tarifák, elosztói szabályok | + `validAsOf` | 6 hó |

Megjelenítés:
- R3: nem zárható veszély-doboz;
- R2: figyelem-doboz;
- R1: csak az alapfigyelmeztetés a láblécben.

### 4.3 Állapotgép és ujjlenyomat

`tervezet` → `lektoralasra-kesz` (a gépi kapuk zöldek) → `jovahagyott` (reviewers[] + fingerprint) → [`felfuggesztve`].

- Számított állapot: „felülvizsgálandó”, ha lejár a `reviewDue`. Ilyenkor a CI 30 nappal előtte figyelmeztet, de nem bukik.
- **Bármely tartalmi módosítás** új ujjlenyomatot ad, ezért újra kell jóváhagyni.
- **Elírás gyors útja:** a `scripts/kb-review.ts diff <id>` megmutatja a változást; a lektor e-mailben jóváhagyja; az `approvalRef` mezőbe kerül. A lektornak nem kell gitet használnia.
- **`felfuggesztve`:** biztonsági hibajelzésre használjuk. Csak a cím, a „Röviden” és a „Javítás alatt” sáv marad, noindex-szel; az ábra, a lépéssor és a kalkulátor rejtve. Egy redeploy élesíti.
- **Szkript:** `node_modules/.bin/tsx scripts/kb-review.ts list|approve <id> --reviewer … --qualification … --registry …|diff <id>`.
- **Lektori anyag:** a nyomtatási nézet PDF-je az előnézetből, és a scripts/kb-review.ts által generált lektori lap ellenőrzőlistával.

### 4.4 Sablonok (kötelező mezők)

**Cikk-meta (`KbMeta`):**
- `id`, `slug`, `section`, `category`;
- `title` (≤ 70), `navTitle` (≤ 34), `summary` (80–160);
- `keywords[]`, `synonyms[]`, `audience[]` (szakember / tanuló / laikus);
- `risk` R1–R3, `regulated?{validAsOf}`;
- `plannerKinds?`, `plannerModules?`;
- `anchors[]` (a H2-k, a kereséshez; teszt veti össze a törzzsel);
- `related[]`, `calculators[]`;
- `version`, `updated`, `redirectFrom?[]`, `review`.

**Törzs:**
- `blocks[]`;
- `sources[]`: csak szabvány-, jogszabály- vagy elosztói hivatkozás kiadással és dátummal, idézet nélkül;
- `changes[]`: `{date, version, kind: javitas|bovites|biztonsagi-javitas|felulvizsgalat, summary}`;
- `ai`: nincs | vázlat | nyelvi.

**Szerkezet:**
- R3-nál az első blokk veszély-doboz.
- Az R3-cikkek kötelező szakaszai: „Régi berendezésben”, „Gyakori hibák”, „Mikor hívj szakembert?”.
- Terjedelem 500–1500 szó.

**Séma** (pluszban):
- legalább egy ábra (Bekötés + Szerelési rajz + Működés);
- kapcsolóállás-táblázat, amelyet a szimuláció igazol;
- kapocsjelölési megjegyzés: „gyártónként eltérhet, a gyártói útmutató az irányadó”.

**Kalkulátor:** lásd 5.1.

### 4.5 Stílus és terminológia (docs/tudastar-szerkesztes.md)

- **Hangnem:** tegező, szakmai, tárgyszerű.
- **Tipográfia:** magyar idézőjel, nem törő szóköz a szám és a mértékegység között (230 V, 2,5 mm²), tizedesvessző, `toLocaleString('hu-HU')`.
- **Kötött szóhasználat** a tervezővel összhangban (`lib/plan.ts` labels, `lib/board.ts` moduleLabels): „áram-védőkapcsoló (FI-relé)”, dugalj (konnektor), védővezető (PE), nullavezető (N), PEN, EPH.
- **Színjelölés** az MSZ EN 60445 szerint, a régi hazai színekről külön megjegyzéssel.
- **Tiltott kifejezések** (gépi szűrő): „szabványos”, „megfelel a szabványnak”, „szakmailag ellenőrzött” (helyette „szakmailag lektorálta”), „hivatalos vizsgakérdés”, „garantáltan”, „bárki elvégezheti”, „csináld magad”.
- **Idegen gyakorlat szűrője:** GFCI, 120 V, 60 Hz, NEC, „ring final”, ПУЭ, „fehér nullavezető”.

### 4.6 MI-használat

- **Engedett:** vázlat, nyelvi javítás, disztraktor-ötlet, következetesség-ellenőrzés, alt-szöveg vázlata.
- **Tilos:**
  - jogvédett forrás (MSZ-szöveg, megaohm, APK, tankönyv, vizsgasor) bemásolása a promptba;
  - MI által adott szabványpont vagy határérték ellenőrzés nélküli átvétele;
  - MI-vel rajzolt kapcsolási ábra (az ábra a netlistából jön);
  - személyes adat a promptban.
- Minden számhoz és szabványponthoz forrásbejegyzés kötelező.
- Az MI-vázlat jelölése belső: `ai` mező. Az EU MI-rendelet 50. cikk (4) bekezdésének alkalmazását (emberi szerkesztői felelősség) jogász erősíti meg.

### 4.7 Hibajelzés és javítás

- **MVP:** „Hibát találtál?” mailto az info@luiz-tech.hu címre. Előre kitöltve:
  - tárgy: „Tudástár hiba – {id} v{version}”;
  - URL, horgony, ujjlenyomat, típus (biztonsági / szakmai / ábra / számítás / elírás).
- **Határidők:**
  - biztonsági jelzés: 1 munkanapon belül vizsgálat; ha valószínűsíthető, azonnal `felfuggesztve` és redeploy;
  - szakmai: 10 munkanap;
  - elírás: a következő kiadásban.
- **5. fázis:** rate-limitelt anonim űrlap (`content_feedback` tábla), az adatvédelmi tájékoztató módosításával.

### 4.8 Témakör-katalógus (prioritás)

**P1 (MVP):**
- 101, 102, 105, 106, 106+6, 107, dugalj, földelési rendszerek (+ PEN-szétválasztás);
- vezetékszínek, áram-védőkapcsoló (FI-relé) alapjai, kismegszakító (B/C/D, Ib ≤ In ≤ Iz);
- feszültségmentesítés öt szabálya, Ohm-törvény, elektromos teljesítmény (1f/3f, cos φ), IP-védettség;
- szakszótár (40–60 tétel).

**P2:**
- 103; EPH; RCBO; túlfeszültség-védelem (SPD); olvadóbiztosítók; feszültségfigyelő relé és nullavezető-szakadás; mágneskapcsoló;
- hazai vezeték- és kábeljelölések; keresztmetszet-választás (a jóváhagyott táblákkal); vezeték-összekötési módok; alumínium vezeték;
- lakáselosztó felépítése; áramkörök a lakásban; fürdőszoba zónái;
- multiméter és CAT-kategóriák; feszültségvizsgáló vagy fáziskereső; „lekapcsol a FI-relé” (szakembernek);
- fogyasztásmérők és vezérelt / H- / GEO-tarifás mérés (REG, elvi rajz);
- lépcsőházi automata, impulzusrelé, mozgásérzékelő;
- motor csillag–delta és öntartás; aggregátor-átkapcsoló (REG);
- Kirchhoff, soros és párhuzamos kapcsolás, rövidzárlat; LED-szalag.

**P3:**
- transzformátor, generátor, motor, kondenzátoros egyfázisú motorüzem; szelektivitás; villámvédelem;
- HMKE, EV-töltő, hőszivattyú (REG);
- lumen és lux, színhőmérséklet, foglalatok; szerszámok; RJ45;
- „Biztonsági célú és tartalék ellátás”: ez helyettesíti a ПУЭ „ellátási kategóriáit”.

**P4:** erőművek (legfeljebb egy „Honnan jön az áram?” áttekintés), dugaljtípusok országonként, Coulomb-törvény.

---

## 5. Kalkulátorok

### 5.1 Motor (`lib/calc/*`, kliensen zod és lib/plan nélkül)

**`number.ts`:**
- `parseNum(raw,{min,max,integer,allowNegative})` → `{ok,value}|{ok:false,message}`.
  - NFKC, trim; a szóköz, NBSP és vékony szóköz ezreselválasztó.
  - Ha csak vessző vagy csak pont van, az tizedesjel („1.500” = 1,5); ha mindkettő, az utolsó a tizedesjel, és a másik csak szabályos ezres csoport lehet.
  - Elfogadja az unicode mínuszt és az `1e3` alakot.
  - Hibaüzenet: „Csak számot írj; a mértékegységet mellette választhatod.”
  - A `parseHuf` szándékosan nincs újrahasználva, mert ott „1.500” = 1500.
- `formatNum` (hu-HU, 4 értékes jegy, legfeljebb 3 tizedes, NBSP); `formatSI` (12,3 mA); `formatCompare`, hogy ne fordulhasson elő „5 % > 5 %”.

**Többi modul:**
- `units.ts`: egységek SI-szorzóval.
- `constants.ts`: ρ20 és α (Cu, Al), MCB_RATINGS, E-sorok, 1 LE = 735,49875 W, 1 hp = 745,6999 W, AWG-képlet. Minden érték forrással. A szabványhoz kötött számok (ρ1 = 0,0225, λ, U0, dropLimits, instantaneous, cmin, Iz, kθ, kcs) kizárólag a `lib/sizing-tables.ts`-ből jönnek.
- `formulas.ts`: általános képletek, plusz a `lib/sizing-formulas.ts` re-exportja.
- **`core.ts`:**
  - Típusok: `FieldDef`, `Step{label,formula,substituted,result,ref?}`, `Issue{level,field?,text}`, `CalcResult`, `CalcDef{slug,title,short,category,keywords,tier:'T0'|'T1'|'T2',fields,compute,formulas,notes,safety,examples[{title,input,expect}],related,articles,sources,review,version}`.
  - `runCalc(def,raw)`: soha nem dob, és NaN vagy Infinity nem juthat ki.
- **`url.ts`:**
  - formátum: `<mezőId>=<nyers>`, egység `<mezőId>.e=kV`, lista `R=10;22;47` (≤ 20 elem); az ismeretlen vagy túl hosszú paramétert eldobja;
  - visszaírás `history.replaceState`-tel, 600 ms debounce;
  - az űrlap a keresési sztringből `key`-vel újramountolódik (nincs setState effectben).
- **`registry.ts`:** CALCULATORS, CATEGORIES, `bySlug`, `searchCalcs`, `calcMetadata`, `publishable()`. Az MVP-ben statikus registry; ha a 2. fázisban túllépi a keretet, kalkulátoronkénti lusta loaderre vált.

**Kiemelések (viselkedésváltozás nélkül, tesztekkel védve):**
- `lib/sizing-formulas.ts`: parseCable, designCurrent, correctedIz, voltageDropPercent, loopResistance, maxLoopImpedance, maxLengthForDrop, minSectionFor. Csak a `lib/sizing-tables.ts`-t importálja; a `lib/sizing.ts` re-exportál. Ok: a `lib/sizing.ts` → `sizing-schema.ts` → zod lánc a kalkulátor-chunkba húzná a zodot. Csak a méretezési munka commitja után végezhető el.
- `lib/phase-load.ts`: tiszta `phaseTotals(items:{watts,phase}[])` (fázisonkénti W és A, aszimmetria; PHASE_VOLTAGE, IMBALANCE_LIMIT). A `phaseLoad()` ezt hívja.

### 5.2 Szintek és élesítési kapu

- **T0 – tankönyvi matematika és átváltás:**
  - belső kettős ellenőrzés (szerző + második személy újraszámolja a példákat) és golden tesztek után élesíthető;
  - jelvény: „Belsőleg ellenőrizve”;
  - a szakmai lektor az első lektori körben ezeket is jóváhagyja, ekkor a jelvény „Szakmailag lektorálta”-ra vált.
- **T1 – szabványhoz vagy biztonsághoz kötött számítás:**
  - szakmai lektori jóváhagyás ujjlenyomattal, és csak ezután kerül a `generateStaticParams`-ba;
  - kötelező a nem zárható `SIZING_DISCLAIMER_SHORT`, a „számítás szerint” megfogalmazás (soha nem „megfelel” vagy „szabványos”), a feltételezések listája, a „nem vizsgált” lista (`SIZING_NOT_COVERED`) és a táblázat állapota (`reviewText()`).
  - A táblázatalapú T1-kalkulátorok (keresztmetszet, kismegszakító, hurokimpedancia, terhelhetőség) ezen felül csak `tablesApproved()` mellett kerülnek ki. Addig a hubon „a táblázatértékek tervezői jóváhagyása folyamatban” állapot látszik, link nélkül.
- **T2 – közvetlen beavatkozásra ösztönző** (motor-kondenzátor, teljesítményigény): lektori jóváhagyás és kiemelt figyelmeztetések nélkül nem épül meg; ezt teszt kényszeríti ki.
- **Ár és tarifa** sosem beégetett tény: a felhasználó adja meg, a példák „példaérték” jelölésűek.

### 5.3 Katalógus

| Fázis | Slug | Szint | Lényeg / golden |
|---|---|---|---|
| MVP | ohm-torveny | T0 | két ismertből a többi; 230 V, 10 Ω → 23 A, 5290 W |
| MVP | teljesitmeny | T0 | DC/1f/3f, cos φ, P/S/Q; 3f 400 V 16 A 0,9 → 9976,6 W |
| MVP | aram-teljesitmenybol | T0 | I = P/(U·cos φ·η) (3f: √3); 3000 W 1f → 13,04 A; a következő MCB-érték csak tájékoztató |
| MVP | latszolagos-meddo-teljesitmeny | T0 | S² = P² + Q², cos φ, tan φ |
| MVP | vezetek-ellenallas | T0 | R = ρ20·(1 + α·Δθ)·l/A, oda-vissza ×2; a ρ1-mód a sizing-tables-ből |
| MVP | eredo-ellenallas | T0 | soros, párhuzamos (2–20 elem), hiányzó párhuzamos tag |
| MVP | feszultseges | T1 | a voltageDropPercent és a maxLengthForDrop kódja; 1f 16 A 23,4 m 2,5 mm² → 6,739 V, 2,930 %, Lmax(5 %) 39,93 m |
| MVP | fogyasztas-koltseg | T0 | sorok (≤ 50), kWh nap/hó/év, Ft; 2000 W × 0,25 h → 182,5 kWh/év, 36 Ft/kWh → 6570 Ft |
| MVP | fazisterheles | T0 | phaseTotals, aszimmetria (20 % tájékoztató), I_N; 10/10/0 A → I_N = 10 A |
| MVP | mertekegyseg-atvalto | T0 | kW–LE–hp (7,5 kW = 10,197 LE), AWG–mm² (AWG 12 = 3,309 mm²), átmérő → mm², kWh–MJ; `?mod=` |
| 2. | eredo-kapacitas, feszultsegoszto, ellenallas-szinkod, lumen-lux, csillag-delta, transzformator, akkumulator-uzemido, led-elotet-ellenallas, reaktancia-rezonancia, homerseklet | T0 | színkód: sárga-ibolya-piros-arany = 4,7 kΩ ±5 %; lumen: 20 m², 500 lx, 4000 lm → 7 db / 560 lx; Y→Δ: 10/20/30 → 36,67/110/55; akku: 100 Ah 12 V 50 % 0,9 60 W → 9 h; transzformátor: 230/12 V 60 VA → 5 A |
| 2. | motor-aram, led-szalag-tapegyseg, fazisjavitas | T1 | 5,5 kW 400 V 0,85 0,87 → 10,74 A; 5 m × 14,4 W/m + 20 % → 100 W, 3 A |
| 2. | keresztmetszet, kismegszakito, hurokimpedancia, terhelhetoseg-tablazat | T1 + tablesApproved() | In 20 A, B2 → 2,5 mm² (Iz 23 A), 3 csoportban → 4 mm²; B16 Zs,max 2,875 Ω; Ze 0,35 + 25 m 2,5/2,5 → 0,80 Ω, 287,5 A, Lmax 140,3 m |
| 2. | motor-kondenzator | T2 | csak lektor után; kötelező figyelmeztetések |
| 5. | teljesitmenyigeny | T2 | egyidejűségi tényezők csak lektori adatokkal |

A tulajdonos 4. kiegészítésének mind a 22 számítása a 2. fázis végére elérhető, a kapuk teljesülése esetén.

### 5.4 Felület

- **/kalkulatorok index:**
  - kereső (ékezetfüggetlen, szinonimák: „biztosíték” → kismegszakito, „kábel vastagság” → keresztmetszet);
  - Kedvencek és Legutóbbiak (csak hidratálás után, üresen rejtve);
  - kategóriakártyák: Alapok; Teljesítmény és energia; Vezetékek; Védelem; Világítás; Gépek és akkuk; Elektronika; Átváltók.
  - JS nélkül a teljes kategorizált lista SSR-ben látszik.
- **Kalkulátoroldal:** lásd 2.4.
- **Ábrák:** saját SVG (`components/calc/calc-figures.tsx`): teljesítményháromszög, ΔU-sáv, fázissávok, ellenállássávok névcímkével.

---

## 6. Konstruktor (4. fázis)

**KO1 – Elosztó-összerakó** (`/tudastar/konstruktor/eloszto`), a meglévő elosztókódra építve:
- Felhasznált modulok: `lib/board.ts`, `lib/board-size.ts`, `lib/cabinet.ts`, `lib/schematic.ts`, `lib/phase-load.ts`, `components/schematic-view.tsx`, `components/phase-load-report.tsx`; a 2. lépésben a `components/board-cabinet.tsx` is.
- **Állapot:** `KonstruktorState{v:1;name;supply:'1f'|'3f';plan:Plan;meta:{circuits:{usage},modules:{rating?,sensitivity?,poles?}}}`.
  - A `plan` teljes, validálható Plan (egy épület, egy szint), így a meglévő könyvtárak közvetlenül futnak rajta.
  - Az ÁVK névleges árama és érzékenysége a `meta`-ban él, mert a séma nem ismeri; átadáskor a modulnévbe kerül.
- **Funkciók:**
  - presetek „példaérték” jelöléssel;
  - listás, mobilbarát szerkesztő ▲▼-áthelyezéssel, előlap-SVG a `cabinetLayout`-ból;
  - ellenőrzések: védelem nélküli áramkör, dugaljkör ÁVK nélkül (lektorálandó), Ib > In, In > Iz (alapértékekkel, feltételezésként), aszimmetria, 3P áramkör 1f ellátásnál, hiányzó főkapcsoló, tartalékhely;
  - anyaglista, fázisterhelés, egy- és többvonalas rajz;
  - visszavonás (50 lépés), automatikus helyi mentés;
  - JSON export és import, `#k=` megosztás (deflate-raw + base64url, ≤ 16 KB; a fragment nem jut a szerverre), nyomtatás;
  - „Tájékoztató ellenőrzés, nem tervezői méretezés.”
- **„Mentés a tervezőbe”:**
  - a meglévő mechanizmust használja: `validatePlan`, majd `sessionStorage['shockcraft-auth-draft']`; ha már van ilyen piszkozat, megerősítést kér;
  - utána `/tervezo?auth=register`; a plan-editor `load()` új, nem mentett projektként nyitja meg (ellenőrizve);
  - előzetes szöveg: „Az első projekt ingyenes; ha már van projekted, a mentéshez szabad projekthely vagy előfizetés kell.”
  - Ellenőrizendő teszttel: friss regisztráció után az átadott terv első mentése megkapja-e a free grantot.
- **Bundle:** a `board-cabinet` a `lib/plan` miatt zodot húz be; ebben a chunkban ez elfogadott (költségkeret ≤ 160 KB gz).

**KO2 – Kapcsolás-összerakó** (`/tudastar/konstruktor/vilagitas`):
- Kapcsolási helyek 1–6 → 101 / 106+106 / 106 + (n−2)×107 + 106; két lámpacsoport → 105 vagy 106+6.
- A generált netlista az ábramotorral rajzolódik; kábelszakaszonkénti érszám és anyaglista.
- Minden generált kapcsolás átmegy a szimulációs teszten (tulajdonságalapú, n = 1–6).

**Később:** automatikus bekötési javaslat a `connectTerminals` függvénnyel, majd `validateBoard`; átadás alelosztóként a megnyitott projektbe (extraBoards ≤ 19).

---

## 7. Vizsgaszimuláció (3. fázis)

**Kérdésséma** (`lib/quiz/schema.ts`, zod csak teszt- és kiadási időben):
- `{id:/^q-[a-z]{2,4}-\d{4}$/, version, topic, difficulty:1–3, type:'single'|'multi'|'truefalse', stem, figure?:{kind,id}, choices(3–5; truefalse: 2):{id,text,correct,why?}, explanation(≥2 mondat), ref:'<kb-id>#<horgony>', calc?, shuffle, family?, review, source:'saját'|'AI-tervezet, lektorált'|'licencelt', retired?}`
- Szabályok:
  - single → pontosan 1 helyes; multi → legalább 2 helyes és legalább 1 hibás;
  - nincs „mindegyik” vagy „egyik sem” `shuffle:false` nélkül;
  - tagadó kérdésnél kiemelt NEM.
- Az id-jegyzék (`id-registry.json`) csak bővülhet.
- Témák: alapfogalmak-szamitasok, kapcsolasok, vedelmi-eszkozok, erintesvedelem, foldelesi-rendszerek, kabelek-vezetekek, meres, gepek, vilagitas, munkabiztonsag.

**Számolós sablonok** (`lib/quiz/templates.ts`):
- A paraméterek diszkrét, valószerű halmazokból jönnek.
- A helyes érték és a levezetés `runCalc(def,params)`-ból származik.
- Tévesztők megnevezett hibamodellekből: √3 kihagyása, fázis- és vonali feszültség cseréje, cos φ kihagyása, ×2 kihagyása, W és kW, Ω és mΩ, U·R az U/R helyett, rossz m-szorzó.
- A válaszok formázás után egyediek, és legalább 5 %-ban eltérnek; a számos válaszok növekvő sorrendben jelennek meg.
- MVP-sablonok (12): ohm-aram, ohm-ellenallas, teljesitmeny-1f, aram-1f-cosfi, aram-3f, vezetek-ellenallas, feszultseges-1f, soros-eredo, parhuzamos-eredo, fogyasztas-koltseg, kismegszakito-valasztas, zs-max. Az utolsó kettő csak `tablesApproved()` mellett.

**Motor** (`lib/quiz/engine.ts`):
- mulberry32 seed;
- témakvóta a blueprint szerint, legnagyobb maradék módszerrel; egy teszten belül nincs id- vagy családismétlés;
- súlyozás: w = h·r (a rossz válasz növeli, a helyes sorozat csökkenti, a verzióváltás nullázza);
- módok: Gyakorló (azonnali magyarázat és cikklink), Vizsga (időkorlát kikapcsolható vagy hosszabbítható; jelzés 5 és 1 perccel a vége előtt; kérdéstérkép; újratöltés-álló), Hibáim;
- tesztkód: seed + paraméterek + kiadás.

**Kiadás:**
- `tsx scripts/quiz-release.ts`: csak a jóváhagyott kérdéseket írja ki, belső lektori mezők nélkül, a `lib/quiz/release/<tema>.json` fájlba, manifesttel. A kliens dinamikus importtal tölti, így nem kerül a worker csomagjába, és betöltés után offline is fut.
- Kapu: a statikus bank akkor élesedik, ha legalább 150 jóváhagyott kérdés van, témánként legalább 10. Addig a „Számolós gyakorló” fut a jóváhagyott sablonokkal.

**Egyéb:**
- Küszöb: 60 %, „saját, nem hivatalos”; profilonként konfigurálható (`content/tudastar/kerdesek/profilok.json`).
- Jelölés minden képernyőn: „Gyakorló teszt – nem hivatalos vizsgakérdések; az eredmény nem igazolás.”
- Minden ingyenes; nincs ranglista és nincs tanúsítvány.
- Ütem: 150–200 kérdés, majd 400–600, majd kb. 1000 kérdés 9–12 hónap alatt. Becslés kb. 1000 kérdésre: 170–330 szerzői és 80–120 lektori óra.
- Lektori kör CSV-ben: `scripts/quiz-csv.ts`, a `lib/catalog-csv.ts` dekódolójával, 25 kérdéses csomagokban.

---

## 8. Jogi és biztonsági keret

**1. Figyelmeztetés-könyvtár** (`lib/kb/safety.ts`, verziózott; szakmai és jogi jóváhagyás kell, mielőtt bármely R2/R3 tartalom kikerül):
- `alap`, minden oldal láblécében: „Tájékoztató szakmai ismeretanyag. Nem helyettesíti a hatályos szabványokat, az elosztói engedélyes előírásait, a gyártói utasításokat és a szakember helyszíni döntését. Villamos szerelést csak szakképzett személy végezhet; a mérőhelyi és csatlakozási munkákra az elosztói engedélyes szabályai vonatkoznak.”
- `bekotes` (R3 felső doboz): „Életveszély: áramütés- és tűzveszély. A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert.”
- További tételek: `merohely`, `munkavegzes`, `meres` („a fáziskereső nem igazolja a feszültségmentességet”), `kalkulator`, `teszt`, `regulacio` („Állapot: {validAsOf}”), `elsosegely` (csak 112, áramtalanítás, érintés nélkül, és hivatkozás a hivatalos útmutatóra).
- Egy oldalon legfeljebb egy felső és szükség szerint egy inline doboz. `role="note"`; ikon, keret és szöveg együtt jelöl, nem csak a szín.

**2. Hatókör:** a mérőhelyi és csatlakozási témák csak elvi rajzot kapnak, lépésenkénti utasítást nem. A Tudnivalók „Mit nem tartalmaz” része: nem szabvány, nem tervezői méretezés, nem barkácsútmutató, nem hivatalos vizsgaanyag.

**3. Felelősség:** a felelősségkizárás életet vagy testi épséget érintő kárnál nem véd (Ptk. 6:152. §), ezért az elsődleges védelem a minőség és az egyértelmű hatókör. Ezt jogásznak kell megerősítenie.

**4. Jogtisztaság:**
- **Saját anyag:**
  - saját szöveg és saját SVG;
  - lucide-react ikonok (ISC); az APK ikon- és színvilágát nem utánozzuk.
- **Tiszta szoba:**
  - a szerző jegyzetből ír, nem a forrás mellől;
  - bekezdésenkénti átfogalmazás tilos;
  - a 2. fázistól a lektori körben kézzel futtatott hasonlóságvizsgálat (`scripts/kb-hasonlosag.ts`, 8 szavas shingle-átfedés).
- **Szabványok:**
  - MSZ-szöveg, -táblázat és -ábra nem másolható;
  - tényadat saját mondatban, hivatkozással megengedett;
  - számtáblázat csak a jóváhagyott `lib/sizing-tables.ts`-ből kerülhet a tartalomba.
- **Vizsgasor:** hivatalos vizsgasort nem veszünk át.
- **Elosztói anyagok:** hivatkozás és saját összefoglaló, dátummal.
- **Félrevezetés tilalma (Fttv.):** nincs „hivatalos”, „szabványos” vagy „vizsgán ezek jönnek” típusú állítás.

**5. Jogi oldalak (components/legal-page.tsx, jogászi jóváhagyással, „tervezet” jelöléssel, mint ma):**
- sütitáblázat: az új kulcsok;
- ÁSZF: új „Ingyenes tartalmak: Tudástár és Kalkulátorok” pont (ingyenes, tájékoztató, nem szerződéses szolgáltatás);
- Adatvédelem: a „csak bejelentkezés után használható” mondat pontosítása; később a lektornevek és a hibajelző űrlap;
- egyúttal rendezendő a meglévő ellentmondás: az ÁSZF szerint a mintaterv és a helyi mentés fiók nélkül is használható, az app/tervezo/page.tsx viszont belépést kér;
- a docs/jogi-oldalak.md frissül.

**6. Sajtójog:** a jogász döntse el, minősül-e a Tudástár sajtóterméknek (Smtv., impresszum).

---

## 9. Ütemezés fázisokra

### 0. fázis – Döntések és előkészítés (párhuzamos, nem blokkolja a fejlesztést)

**Tartalom:**
- tulajdonosi döntések (11. pont);
- a lektor és a második olvasó kijelölése, szerződésminta;
- a figyelmeztetés-könyvtár és a Tudnivalók szövegének jogi és szakmai jóváhagyása;
- a méretezési munka commitja (a `lib/sizing*.ts` ma még csak a munkapéldányban van).

**Elfogadás:**
- A döntések a BACKLOG-ban.
- A lektor megnevezve.
- A safety-szövegek jóváhagyva. Enélkül csak a T0-kalkulátorok élesedhetnek.

### 1. fázis – MVP: keret, Sémák, alap-Elmélet, 10 kalkulátor (részletesen: 10. pont)

**Méret:**
- fejlesztés kb. 10–12 fejlesztői nap, egy menetben;
- tartalom: szerző 60–80 óra (MI-vázlattal); lektor 20–30 óra.

**Érték:**
- A T0-kalkulátorok a belső ellenőrzés után azonnal élnek.
- A Sémák és az Elmélet az első lektori körrel élesedik.
- Az 1. ötlet teljesül, a 3. ötlet váza kész, a 4. kiegészítés fele teljesül.
- A tervező és a nyilvános oldalak összekötve.

### 2. fázis – Kalkulátorközpont teljes, Elmélet bővítése, tervező-integráció (8–10 nap + tartalom)

**Tartalom:**
- a 2. fázis kalkulátorai (5.3); a táblázatalapúak a `tablesApproved()` kapuval; `CalcEmbed` a cikkekben;
- P2-témák kb. 15–20 cikkben;
- fogyasztásmérők (REG, elvi rajz) a Sémák gyűjtőoldalán;
- szótár-tooltip (`{{szotar:…}}`);
- tervező:
  - súgólinkek: Karakterisztika, ÁVK-csoport, „Készülék típusa” (`moduleArticle`);
  - „Röviden” popover;
  - mélylinkek a phase-load-report.tsx és a sizing-report.tsx fájlból;
- A4-es puskalapok (101–107, színjelölés, IP-kódok, földelési rendszerek);
- `/tudastar/kereses` JS nélküli tartalék;
- hasonlóságvizsgáló szkript.

**Elfogadás:**
- Minden kalkulátornak van legalább 2 golden példája és tulajdonságtesztje.
- A sizing-alapú kalkulátorok ugyanazt adják, mint a Méretezés fül, és kiírják a táblaállapotot.
- Teszt igazolja, hogy minden tervezői link célja létezik és közzétett.
- A plan-editor csomagja legfeljebb 5 KB-tal nő.
- Mind a 22 tulajdonosi számítás elérhető, vagy a kapuja látható állapotjelzést mutat.

### 3. fázis – Tesztek (5–8 nap + kérdésbank-lektorálás)

**Tartalom:** a 7. pont; az alsó navigáció 4. füle; „Teszteld magad” blokk a cikkekben; „Hibás kérdés jelzése” mailto.

**Elfogadás:**
- A sablonok 10 000 seedes tulajdonságtesztje zöld.
- Egy teszten belül nincs ismétlődés; a seed reprodukál.
- A vizsga újratöltés után folytatható.
- A „gyakorló” jelölés mindenhol látszik.
- A bank nem kerül a worker csomagjába.
- Privát módban mentés nélkül is fut.

### 4. fázis – Konstruktor és offline/PWA (8–10 nap)

**Tartalom:**
- KO1 és KO2 (6. pont); az 5. fül.
- PWA:
  - `public/kezikonyv.webmanifest` (`start_url:/tudastar`), csak a kezikonyv layout linkeli;
  - service worker két hatókörrel (`/tudastar` és `/kalkulatorok`);
  - navigációra network-first 3 s időkorláttal, statikus assetekre cache-first, verziózott cache-név;
  - „Letöltés offline használatra”, „Mentett változat: dátum” jelvény, kill-switch;
  - a `/tervezo`, az `/api` és a `/megosztas` soha nem kerül a hatókörbe.

**Elfogadás:**
- A `toPlannerPlan` → `validatePlan` sikeres, mély egyezéssel.
- Az auth-draft átadása működik.
- A megosztó link oda-vissza alakítva azonos állapotot ad.
- A meglévő cabinet-, schematic-, board-wiring- és multiple-boards-tesztek zöldek.
- Repülőgép-módban működnek a megnyitott oldalak és minden kalkulátor.
- A kill-switch ki van próbálva.

### 5. fázis – Opcionális bővítések (külön döntéssel és specifikációval)

**Tartalom:**
- hibajelző API (`content_feedback`, `drizzle/0012_*`, `db/mysql-schema.sql`, `scripts/mysql-setup.mjs`, rate limit a share-limit mintájára, admin-lista);
- fiókos szinkron (`kb_progress`, a workbooks mintájára, revision-CAS);
- süti nélküli aggregált mérés (adatvédelmi módosítással);
- P3/P4-témák; kérdésbank kb. 1000-ig;
- lektori döntés a tervező rajzjeleiről és a PE zöld-sárga jelöléséről (`components/electrical-symbol.tsx`, `lib/pdf-export.ts` symbol(), `lib/board.ts` wireColor).

**Elfogadás:** egyetlen Tudástár-funkció sem kíván belépést; mindkét DB-ágon route-teszt.

---

## 10. 1. fázis (MVP) – implementálható specifikáció

### 10.1 Hatókör

**Benne van:**
- Keret: közös layout, mobil- és asztali shell, alsó nav, menü, kereső, téma, nyomtatás, 404, CSP-fejlécek, sitemap/robots.
- Tudástár oldalak:
  - `/tudastar` kezdőlap;
  - `/tudastar/elmelet` és `/tudastar/elmelet/[slug]`;
  - `/tudastar/semak` gyűjtőoldal és `/tudastar/semak/[slug]`;
  - `/tudastar/szotar`, `/tudastar/tudnivalok`, `/tudastar/konyvjelzok`.
- Kalkulátorok: `/kalkulatorok`, `/kalkulatorok/[slug]` (10 kalkulátor).
- Ábramotor: netlista, szimuláció, három nézet, földelési rendszerek.
- Lektorálási infrastruktúra: állapot, ujjlenyomat, előnézet, `scripts/kb-review.ts`.
- 15 cikk tervezete (10.4) és a szótár. Ezek a lektori jóváhagyásig rejtve maradnak.
- Bekötések: PublicHeader/Footer, főoldal, PlannerAccess, tervező topbar, Tervsegéd, szerelvénypanel, jogi táblázat.
- Dokumentáció.

**Nincs benne:** Tesztek, Konstruktor, PWA, táblázatalapú kalkulátorok, mérők, API, fiókszinkron, mérés.

### 10.2 Fájlok

**ÚJ – útvonalak**
- `app/(kezikonyv)/layout.tsx`: ThemeBoot, Shell, Toaster; `generateMetadata` (metadataBase); `viewport`; kezikonyv.css import. Nincs benne getAccount, db, auth vagy next/headers.
- `app/(kezikonyv)/kezikonyv.css`
- `app/(kezikonyv)/tudastar/layout.tsx`, `page.tsx`, `not-found.tsx`
- `app/(kezikonyv)/tudastar/elmelet/page.tsx`, `elmelet/[slug]/page.tsx`
- `app/(kezikonyv)/tudastar/semak/page.tsx`, `semak/[slug]/page.tsx`
- `app/(kezikonyv)/tudastar/szotar/page.tsx`, `tudnivalok/page.tsx`, `konyvjelzok/page.tsx` (noindex)
- `app/(kezikonyv)/kalkulatorok/layout.tsx`, `page.tsx`, `[slug]/page.tsx`, `not-found.tsx`
- `app/sitemap.ts`, `app/robots.ts`

**Minden `[slug]` oldalon:**
- `dynamic='force-static'`, `revalidate=3600`, `dynamicParams=false`;
- `generateStaticParams` a `published()`-ből;
- `generateMetadata`;
- `redirectFrom` találatnál `permanentRedirect()`, ismeretlen slugra `notFound()`.

**ÚJ – lib**
- `lib/site-origin.ts`
- `lib/kb/`:
  - `types.ts`; `schema.ts` (zod, csak tesztek és szkriptek használják);
  - `categories.ts` (szekciók, kategóriák, feliratok, ikonnevek);
  - `registry.ts` (szerver: byId, bySlug, bySection, byCategory, prevNext, related, `published()`, `isPublished()`);
  - `meta-index.ts` (kliensbiztos, csak meta);
  - `review.ts`, `inline.ts`, `formula.ts` (AST), `links.ts` (kindArticle, moduleArticle, kbHref, calcHref; kb. 1 KB);
  - `safety.ts`, `search.ts`, `search-index.ts`, `storage.ts`, `seo.ts`, `theme.ts`, `circuit.ts`, `earthing.ts`.
- `lib/calc/`: `number.ts`, `units.ts`, `core.ts`, `constants.ts`, `formulas.ts`, `url.ts`, `registry.ts`, `defs/{ohm-torveny,teljesitmeny,aram-teljesitmenybol,latszolagos-meddo-teljesitmeny,vezetek-ellenallas,eredo-ellenallas,feszultseges,fogyasztas-koltseg,fazisterheles,mertekegyseg-atvalto}.ts`
- `lib/sizing-formulas.ts` (kiemelés)

**ÚJ – tartalom:** `content/tudastar/elmelet/{meta.ts,*.ts}`, `content/tudastar/semak/{meta.ts,*.ts}`, `content/tudastar/diagramok/*.ts`, `content/tudastar/szotar.ts`, `content/tudastar/index.ts`.

**ÚJ – komponensek**
- `components/kezikonyv/`:
  - `shell.tsx`, `bottom-nav.tsx`, `header-actions.tsx`, `kb-menu.tsx`, `search-dialog.tsx`, `theme-boot.tsx`;
  - `breadcrumbs.tsx`, `toc.tsx`, `prev-next.tsx`;
  - `article-view.tsx`, `blocks.tsx`, `inline.tsx`, `formula.tsx`, `callout.tsx`;
  - `safety-notice.tsx`, `review-badge.tsx`, `report-link.tsx`, `planner-cta.tsx`, `json-ld.tsx`;
  - `bookmark-button.tsx`, `visit-tracker.tsx`, `bookmarks-page.tsx`, `print-button.tsx`, `glossary.tsx`.
- `components/kezikonyv/diagram/`: `kit.tsx`, `symbols.tsx`, `wiring-svg.tsx` (szerver), `install-view.tsx` (ElectricalSymbol), `earthing-svg.tsx`, `wire-table.tsx`, `diagram-figure.tsx` (kliens: nézetváltó, Működés, Nagyítás).
- `components/calc/`: `calculator.tsx` (kliens), `calc-fields.tsx`, `calc-result.tsx`, `calc-derivation.tsx`, `calc-figures.tsx`, `calc-example.tsx` (szerver), `calc-index.tsx` (kliens).

**ÚJ – szkriptek, tesztek, dokumentáció**
- `scripts/kb-review.ts`
- `tests/kb-content.ts`, `tests/kb-circuits.ts`, `tests/calc.ts`, `tests/calc-golden.ts`, `tests/kb-search.ts`, `tests/kb-storage.ts`, `tests/kb-guards.ts`, `tests/kb-render.ts`, `tests/kb-routes.mjs`
- `docs/tudastar.md` (működés, architektúra), `docs/tudastar-szerkesztes.md` (szerzői és lektori kézikönyv), `docs/kalkulatorok.md`

**MÓDOSUL (csak hozzáfűzés, horgonyszöveggel)**
- `next.config.ts`: a három fejlécforrás; a /megosztas szabálya érintetlen.
- `components/public-shell.tsx`: linkek, `current` prop, `<details>` mobilmenü, lábléc-oszlop.
- `app/public.css`: a mobilmenü és a lábléc-oszlop.
- `components/home-page.tsx`: szekció, home-fine, GYIK.
- `components/planner-access.tsx`: doboz.
- `components/plan-editor.tsx`:
  - `.topbar`: Kalkulátorok ikonlink;
  - a `label="Szerelvény típusa"` Choice után: `kbHref(kindArticle[kind])`, ha van.
- `components/plan-tools.tsx`: a guide-link mellé két link.
- `components/legal-page.tsx`: cookies-sorok, ÁSZF-pont és Adatvédelem-mondat (tervezet; jogász).
- `lib/phase-load.ts`: `phaseTotals`.
- `lib/sizing.ts`: re-export.
- `app/layout.tsx`: csak ha kell, `suppressHydrationWarning`.
- `CLAUDE.md`, `README.md`, `docs/BACKLOG.md`, `docs/jogi-oldalak.md`.

### 10.3 Fő típusok

```ts
// lib/kb/types.ts
export type SectionId='elmelet'|'semak';
export type Risk='R1'|'R2'|'R3';
export type ReviewStatus='tervezet'|'lektoralasra-kesz'|'jovahagyott'|'felfuggesztve';
export type Reviewer={name:string;qualification:string;registry?:string;date:string;approvalRef?:string};
export type Review={status:ReviewStatus;reviewers:Reviewer[];fingerprint:string;reviewDue?:string};
export type KbMeta={id:string;slug:string;section:SectionId;category:string;title:string;navTitle:string;summary:string;
 keywords:string[];synonyms:string[];audience:('szakember'|'tanulo'|'laikus')[];risk:Risk;regulated?:{validAsOf:string};
 plannerKinds?:Kind[];anchors:{id:string;title:string}[];related:string[];calculators:string[];
 version:number;updated:string;redirectFrom?:string[];review:Review};
export type Block=
 |{t:'p';text:string}|{t:'h2'|'h3';id:string;text:string}|{t:'ul'|'ol'|'steps';items:string[]}
 |{t:'table';caption:string;head:string[];rows:string[][]}
 |{t:'callout';kind:'veszely'|'figyelem'|'tipp'|'szabvany';text:string}|{t:'safety';id:SafetyId}
 |{t:'formula';expr:FormulaNode;text:string;legend:{sym:string;meaning:string;unit:string}[]}
 |{t:'example';title:string;steps:string[];result:string}
 |{t:'figure';diagram:string;caption:string;views:('bekotes'|'szereles'|'mukodes')[]}
 |{t:'symbol';kind:Kind;caption:string}|{t:'calc';id:string;params?:Record<string,string>}|{t:'cta'};
export type ArticleBody={blocks:Block[];sources:{label:string;kind:'szabvany'|'jogszabaly'|'eloszto'|'egyeb';edition?:string}[];
 changes:{date:string;version:number;kind:'javitas'|'bovites'|'biztonsagi-javitas'|'felulvizsgalat';summary:string}[];ai:'nincs'|'vazlat'|'nyelvi'};

// lib/calc/core.ts (kivonat)
export type CalcDef={slug:string;title:string;short:string;category:string;keywords:string[];tier:'T0'|'T1'|'T2';
 fields:FieldDef[];compute(v:Record<string,number|string|number[]>):CalcResult;formulas:string[];notes:string[];
 safety:SafetyId[];examples:{title:string;input:Record<string,string>;expect:Record<string,number>}[];
 related:string[];articles:string[];sources:string[];
 review:{status:'tervezet'|'belso'|'jovahagyott';internal?:{by:string;date:string};reviewers:Reviewer[];fingerprint:string};version:number};
```

### 10.4 MVP-tartalom (tervezetként készül, lektori jóváhagyás után közzétéve)

| # | id / slug | Szekció | Kockázat | Ábra |
|---|---|---|---|---|
| 1 | egypolusu-kapcsolo-101-bekotese | semak | R3 | 3 nézet |
| 2 | ketpolusu-kapcsolo-102-bekotese | semak | R3 | 3 nézet |
| 3 | csillarkapcsolo-105-bekotese | semak | R3 | 3 nézet |
| 4 | valtokapcsolo-106-bekotese | semak | R3 | 3 nézet |
| 5 | kettos-valtokapcsolo-106-6-bekotese | semak | R3 | 3 nézet |
| 6 | keresztkapcsolo-107-bekotese | semak | R3 | 3 nézet, 1–4 db 107-tel |
| 7 | dugalj-bekotese | semak | R3 | földelt dugalj, áthurkolás vagy leágaztatás |
| 8 | foldelesi-rendszerek | semak | R3 | IT, TT, TN-C, TN-S, TN-C-S + PEN-szétválasztás |
| 9 | ohm-torvenye | elmelet | R1 | formula + ohm-torveny kalkulátor |
| 10 | elektromos-teljesitmeny | elmelet | R1 | teljesítményháromszög + kalkulátor |
| 11 | vezetekek-szinjelolese | elmelet | R3 | színminták felirattal, régi színek |
| 12 | aram-vedokapcsolo-fi-rele | elmelet | R3 | működési elv (összegáramváltó) |
| 13 | kismegszakito | elmelet | R3 | B/C/D jelleggörbe-sávok (saját SVG, sematikus) |
| 14 | feszultsegmentesites-ot-szabalya | elmelet | R3 | lépéssor |
| 15 | ip-vedettseg | elmelet | R2 | kódtáblázat (saját szöveg) |

Ezek mellett:
- a `/tudastar/semak` gyűjtőoldal, benne a 103 rövid szakasza;
- szótár 40–60 tétellel;
- Tudnivalók oldal.

A tervezői kind → cikk térkép (`lib/kb/links.ts`):
- switch1→1, switch2→2, switch5→3, switch6→4, switch7→6;
- socket/double→7;
- light, box, panel, rj45, phone: a 2. fázisban.

A tervezőben csak közzétett cél jelenik meg linkként.

### 10.5 Megvalósítási sorrend

1. **Előkészítő refaktor** (a méretezés commitja után):
   - `lib/sizing-formulas.ts` és re-export;
   - `phaseTotals`;
   - a tests/sizing.ts, tests/sizing-tables.ts és tests/phase-load.ts változatlanul zöld.
2. **Váz:**
   - `lib/site-origin.ts`, route group és layoutok, kezikonyv.css tokenek, ThemeBoot, Shell (fejléc, alsó nav, menü);
   - next.config fejlécek, sitemap/robots, not-found;
   - `tests/kb-routes.mjs` mindkét buildön.
3. **Kalkulátormotor** és a 10 def, `components/calc`, /kalkulatorok oldalak; tests/calc.ts és calc-golden.ts.
4. **Tartalommodell:** types, review, registry, inline, formula, blocks, article-view, JSON-LD, előnézet; tests/kb-content.ts, tests/kb-render.ts.
5. **Ábramotor:** circuit, earthing, SVG-renderelők, DiagramFigure; tests/kb-circuits.ts.
6. **Tartalom:** a 15 cikk, a szótár és a gyűjtőoldal tervezete, `ai:'vazlat'` jelöléssel, `tervezet` státusszal; lektori lapok a `scripts/kb-review.ts`-sel.
7. **Kereső, könyvjelzők, előzmények;** tests/kb-search.ts, tests/kb-storage.ts.
8. **Integráció:** public-shell, home-page, planner-access, plan-editor, plan-tools, legal-page.
9. **Dokumentáció:** docs, CLAUDE.md, BACKLOG.
10. **Ellenőrzés:** lint, minden teszt, mindkét build, Playwright 390×844 és 1280×900, világos és sötét mód, nyomtatási előnézet.
11. **Kiadás, kódon kívül:**
    - a T0-kalkulátorok belső kettős ellenőrzése, élesítés;
    - lektori kör → `approve` → redeploy; a Sémák és az Elmélet fülek ezzel jelennek meg.

### 10.6 Tesztek (node:assert/strict, `node_modules/.bin/tsx tests/<x>.ts`; a renderteszt esbuild-csomagolással, mint a tests/share-api.ts)

- **tests/kb-content.ts:**
  - meta és törzs páros, és átmegy a zod-sémán;
  - egyedi id, slug és redirectFrom;
  - az anchors egyezik a H2-id-kkel; minden H2 id egyedi;
  - minden `[[link]]`, ábra-, kalkulátor- és kind-hivatkozás létezik;
  - közzétett elem nem hivatkozik nem közzétettre;
  - jóváhagyott elemnél az ujjlenyomat egyezik (fixture: egy módosított tartalom → bukik);
  - R3 → az első blokk veszély-doboz, a kötelező szakaszok megvannak, és legalább egy forrás;
  - summary 80–160, title ≤ 70;
  - tiltott és idegen kifejezések szűrése; szám és mértékegység között NBSP;
  - nincs `<img>`, külső kép-URL vagy base64;
  - a sitemap csak közzétett URL-t ad;
  - a links.ts minden célja közzétett.
- **tests/kb-circuits.ts:**
  - igazságtáblák: 101 (ég ⇔ K be), 102 (L és N is bont), 105 (két független kör), 106 (XOR), 106+6, 107 (n = 3–6, paritás);
  - invariánsok: a kapcsoló csak L-ágban van; a PE sosem kapcsolt és mindig folytonos; egyik állásban sincs L–N vagy L–PE zárlat; N szerepű ér csak kék, PE csak zöld-sárga;
  - TN-C-S: a PEN egyszer válik szét és nem egyesül újra; TT: a PE a helyi földelőn van; IT: a csillagpont nincs közvetlenül földelve;
  - geometria: nincs NaN, minden pont a viewBox-on belül;
  - a wireTable determinisztikus.
- **tests/calc.ts és tests/calc-golden.ts:**
  - a registry egyedi; minden def-nek van legalább 2 példája;
  - T1/T2 → safety és review megvan; a `publishable()` kapuk működnek;
  - parseNum esetek: '2,5', '2.5', '1 000', '1.234,5', 'abc', '-1';
  - 10 000 seedes tulajdonságtesztek: Ohm oda-vissza, soros ≥ max, párhuzamos ≤ min, S² = P² + Q², a ΔU monoton;
  - fuzz → magyar hiba, soha nem dob;
  - az URL oda-vissza alakítása veszteségmentes;
  - a feszultseges egyezik a voltageDropPercent eredményével (2,930 %);
  - a fazisterheles egyezik a phaseLoad-dal a seed tervre;
  - az MVP-ben legalább 60 golden eset (a 2. fázis végére legalább 150).
- **tests/kb-search.ts:** '106', 'valto' → valtokapcsolo-106-bekotese; 'fi rele', 'rcd', 'avk' → aram-vedokapcsolo-fi-rele; 'konektor' → dugalj-bekotese; az index ≤ 40 KB gz.
- **tests/kb-storage.ts:** hamis tároló esetén: korlátok, duplikátumszűrés, sérült JSON, dobó tároló, csak belső útvonal, `storage` esemény.
- **tests/kb-guards.ts:**
  - importgráf-tiltólista (3.8);
  - a csoport oldalaiban nincs getAccount, cookies, headers vagy withDatabase;
  - `dangerouslySetInnerHTML` csak a json-ld.tsx-ben és a theme-boot.tsx-ben;
  - nincs `import dynamic from 'next/dynamic'` olyan fájlban, ahol `export const dynamic` is van;
  - a plan-editor.tsx a Tudástárból csak a `lib/kb/links.ts`-t importálja;
  - a next.config.ts tartalmazza a fejlécforrásokat;
  - a legal-page.tsx felsorolja a kulcsokat;
  - minden kulcs `shockcraft-kb-` előtagú.
- **tests/kb-render.ts:** `renderToStaticMarkup` minden közzétehető cikkre (előnézeti módban mindre):
  - pontosan egy H1, nincs ismétlődő id;
  - minden `svg[role=img]` alatt van title és desc, és minden ábrának van szöveges megfelelője;
  - R3 → van veszély-doboz;
  - nincs 'undefined' vagy 'NaN' a kimenetben;
  - az inline-parser a `<script>`-et szövegként adja vissza.
- **tests/kb-routes.mjs** (build után, mindkét target): lásd 3.9.
- **Regresszió:** minden meglévő teszt (különösen a phase-load, sizing, sizing-tables, plan-checks, share, catalog, quote-products) zöld; `npm run lint` nem jelez több hibát az alapvonalnál; `npm run build` és `npm run build:node` zöld.

### 10.7 Elfogadási feltételek

1. Privát ablakban, belépés nélkül, mindkét buildben minden Tudástár- és kalkulátoroldal 200-at ad, Set-Cookie nélkül. Az ismeretlen slug 404.
2. A /kalkulatorok és a /kalkulatorok/<slug> kanonikus, saját rövid URL. Elérhető a nyilvános fejlécből, a főoldalról, a tervező felső sávjából és a Tudástár alsó navigációjából.
3. 320 px-en nincs vízszintes görgetés (az ábratárolón kívül); az érintési célok legalább 44 px-esek; billentyűzettel minden kezelhető.
4. A világos, sötét és rendszer szerinti mód villanás nélkül működik. A nyomtatás mindkét módból fehér papírra készül, URL-lel, verzióval, ujjlenyomattal, lektorral és figyelmeztetéssel.
5. Élesben csak közzétett tartalom látszik:
   - a cikkeken és sémákon egyező ujjlenyomat és látható lektor;
   - a T0-kalkulátorokon belső ellenőrzés;
   - a feszultseges-en szakmai jóváhagyás.

   A tervezetek csak előnézetben láthatók. Az üres szekció füle rejtve van.
6. Minden séma igazságtáblája és invariánsa zöld; az ábrák három nézete és a szöveges vezetéktábla egyezik.
7. Minden kalkulátor golden példája zöld. Hibás bemenetre a mezőnél magyar hiba jelenik meg, soha nem NaN. Az URL-paraméterrel megnyitott oldal ugyanazt adja. Számolás közben nincs hálózati kérés.
8. A '106', 'valto', 'fi rele', 'rcd', 'konektor' keresésre az elvárt első találat jön.
9. A könyvjelzők, kedvencek és előzmények újratöltés után megmaradnak, és tároló nélkül sem okoznak hibát.
10. A sitemap csak közzétett URL-t tartalmaz; a robots helyes; a könyvjelzőoldal noindex; a canonical abszolút.
11. A CSP, a nosniff és a többi fejléc ott van a /tudastar és a /kalkulatorok gyökerén és aloldalain. Nincs CSP-sértés és nincs konzolhiba.
12. Lighthouse mobilon: Perf ≥ 90, A11y ≥ 95, SEO ≥ 95. A költségkeretek (3.8) teljesülnek, a tervező chunkjai legfeljebb 2 KB-tal nőnek.
13. A tervezőből a szerelvénypanelről egy kattintással, új lapon nyílik a megfelelő séma; a szerkesztési állapot nem vész el. A PlannerAccess oldalról elérhető a Tudástár.
14. A sütitáblázat felsorolja az új kulcsokat, az ÁSZF- és adatvédelmi kiegészítés tervezetként szerepel, a jogász jóváhagyására várva.
15. Minden meglévő teszt, a lint-alapvonal és mindkét build zöld. A docs/tudastar.md, a docs/tudastar-szerkesztes.md, a docs/kalkulatorok.md, a CLAUDE.md és a BACKLOG frissül.

---

## 11. Nyitott kérdések és alapértelmezések

| Kérdés | Alapértelmezés, amivel a fejlesztés indul |
|---|---|
| A menüpont neve | menüben „Tudástár”, H1-ben „Villanyszerelő Tudástár” |
| A fülek felirata | a BACKLOG szerint (Elmélet, Sémák, Kalkulátorok, Konstruktor, Tesztek); alternatíva: Bekötések / Összeállító; a `lib/kb/categories.ts`-ben egy helyen cserélhető, az URL stabil |
| Ki lektorál | a tulajdonos jelöl ki MMK-névjegyzékes villamos tervezőt; addig csak a T0-kalkulátorok élnek |
| Élesíthető-e a T0-kalkulátor szakmai lektor nélkül | igen, belső kettős ellenőrzéssel és „Belsőleg ellenőrizve” jelvénnyel |
| R3 második olvasó | kötelező (szakoktató vagy második szakember); ha nincs, a tulajdonos dönt az egylektoros átmenetről |
| Célvizsga és küszöb | villanyszerelő szakmai témakör-profil, 60 % „saját, nem hivatalos”; a profilok konfigurációk |
| Ingyenesség | minden ingyenes, a teljes kérdésbank is (a tulajdonos követelménye) |
| Konverziómérés | nincs; süti nélküli aggregált számlálás csak külön döntéssel és adatvédelmi módosítással |
| Tartalomlicenc | minden jog fenntartva; személyes és oktatási célú nyomtatás forrásmegjelöléssel megengedett |
| Felelősségi szöveg, ÁSZF, Smtv. | jogász véglegesíti; addig „tervezet” jelöléssel, a meglévő jogi oldalak gyakorlata szerint |
| A tervező PE-színe és rajzjelei | nem változnak; a Tudástár-ábrán zöld-sárga PE és „Így látod a tervezőben” sor |
| Fiókos szinkron | nincs (5. fázis, opcionális) |
| ÁSZF-ellentmondás (vendégmód) | a szöveg igazítása a belépéskötelezett tervezőhöz, jogásszal |
| Domainváltás (villanyrajz.hu) | a canonical mindig az APP_ORIGIN-ból jön; váltáskor 301 és Search Console címváltás |
