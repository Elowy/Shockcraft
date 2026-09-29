# Főoldal és jogi tájékoztatók

2026. szeptember 29.

## Elérési utak

- `/`: bemutató főoldal, funkciók, 0 / 3 490 / 2 490 Ft-os csomagok.
- `/tervezo`: a meglévő szerkesztő. `?auth=login` és `?auth=register` megnyitja a megfelelő fiókablakot.
- `/aszf`, `/adatvedelem`, `/sutik`: magyar tájékoztatók, nyomtatási / böngészős PDF-mentési gombbal.
- A régi `/?payment=success|cancelled|manage` visszatérések átirányulnak a tervezőre, a fizetési munkamenet azonosítóját megtartva. Az új Stripe-visszatérések már közvetlenül a tervezőre mutatnak.

A jogi szövegek a `components/legal-page.tsx` fájlban vannak; a közös navigáció a `components/public-shell.tsx`, a sütijelzés a `components/cookie-notice.tsx` fájlban. A tervező fiókablakából új lapon érhetők el a dokumentumok, hogy a rajz ne vesszen el.

## Sütiablak

A jelenlegi saját alkalmazáskód nem tölt be marketing- vagy analitikai szolgáltatást. Ezért az ablak tájékoztatást és tudomásulvételt kínál; nincs nem létező követést engedélyező kapcsoló. A tudomásulvétel `shockcraft-cookie-notice-v1` kulcson, időbélyeggel marad meg 180 napig, majd az ablak ismét megjelenik. Nem kerül szerverre. A tényleges tárolók és az érvényességi/törlési különbségek a sütitájékoztatóban szerepelnek.

Új analitikai vagy hirdetési eszközt csak megfelelő, célonként választható előzetes hozzájárulás és visszavonás megvalósítása után szabad beépíteni. Az infrastruktúra esetleges további sütijeit külön is fel kell mérni. A „Rendben” nem hozzájárulás ilyen új adatkezeléshez, és nem ÁSZF-elfogadás.

## A dokumentumok státusza

Az üzemeltető adatai a felhasználó által megadottak. Az üzemeltető megerősítette, hogy magánszemélyek és jogi személyek egyaránt vásárolhatnak; az árak AAM végösszegek. Az ÁSZF és az adatvédelmi tájékoztató nyilvánosan is **tervezetként** szerepel. Ez a fejlesztés nem kapcsolja be az éles fizetést, és nem tesz úgy, mintha a dokumentumok jogi ellenőrzése vagy a szükséges szerződéses folyamatok már megtörténtek volna.

Éles értékesítés előtt véglegesítendő:

1. Szerződő tárhelyszolgáltató pontos neve/címe, adatfeldolgozói szerződés, régiók, alfeldolgozók, EGT-n kívüli továbbítás tényleges garanciái. Az OpenAI Sites / Cloudflare technikai azonosítása nem helyettesíti az üzemeltető szerződését. MySQL/VPS-költözéskor módosítani kell a tájékoztatót.
2. Napló-, mentés-, inaktívfiók- és pénzügyiadat-megőrzés konkrét határidői, törlési és adatkérési eljárás. A jelenlegi alkalmazás a lejárt belépési rekordokat műveletekhez kötötten tisztítja; nem működik általános időzített törlés. Fiók/adatkiadási kérelmeket az üzemeltető manuálisan intéz.
3. Végleges ÁSZF-változat és elfogadásának igazolható rögzítése; a regisztrációs és fizetési folyamat hozzáigazítása. A mostani hivatkozások nem elfogadási napló.
4. Szerződés-visszaigazolás tartós adathordozón. Az AAM számlázás és a Számlázz.hu e-mailes küldése elkészült, de a saját Agent-fiókkal még beállítandó és tesztelendő; lásd a [számlázási útmutatót](szamlazz-hu.md). A számlaértesítő nem helyettesíti a szerződés-visszaigazolást.
5. A szolgáltatás korai megkezdésére vonatkozó külön fogyasztói nyilatkozat és az indokolás nélküli felmondás kezelése. A hozzáférés megkezdése nem tekinthető automatikus elállásijog-vesztésnek.
6. A 45/2014. Korm. rendelet 22. § aktuális online elállási funkciója: jól látható indítás, azonosító adatok, külön megerősítés, tartós adathordozós átvételi elismervény az időponttal és tartalommal. **A jelenlegi e-mailes elállásminta nem helyettesíti ezt az online folyamatot.** Ennek hátteréhez működő levélküldés és ügykezelés is kell.
7. Panaszkezelés, békéltetés és visszatérítés gyakorlati eljárása. Ne kerüljön vissza a már megszűnt uniós ODR-platform hivatkozása.

Jogi szakemberrel ellenőrizendő, különösen a fogyasztói digitális szolgáltatás minősítése és az egyszeri, folyamatos hozzáférés feltételei. A dokumentumokból a tervezetjelölést csak a tényleges folyamatok véglegesítése után vedd ki.

## Ellenőrzött elsődleges források

- [45/2014. (II. 26.) Korm. rendelet](https://njt.jog.gov.hu/jogszabaly/2014-45-20-22): távollévők közötti szerződés, elállás/felmondás.
- [373/2021. (VI. 30.) Korm. rendelet](https://njt.jog.gov.hu/jogszabaly/2021-373-20-22): digitális szolgáltatások hibás teljesítése.
- [1997. évi CLV. törvény](https://njt.jog.gov.hu/jogszabaly/1997-155-00-00): fogyasztói panaszkezelés.
- [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=hu), [EDPB – érintetti jogok](https://www.edpb.europa.eu/sme/be-compliant/respect-individuals-rights_en).
- [NAIH – sütik](https://naih.hu/hatarozatok-vegzesek/file/620-weboldal-suti-hozzajarulas-keretrendszerenek-jogi-megfelelosege), [NAIH elérhetőség](https://www.naih.hu/ugyfelszolgalat-kapcsolat).
- [MKIK – békéltető testületek](https://mkik.hu/a-bekelteto-testuletek-teruleti-honlapjai).
- [Stripe adatvédelem](https://stripe.com/en-hu/privacy), [Resend adatvédelem](https://resend.com/legal/privacy-policy).
