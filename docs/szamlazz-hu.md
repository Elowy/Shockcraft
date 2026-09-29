# ShockCraft – Számlázz.hu automatikus számlázás

2026. szeptember 29.

Az integráció a kifizetett **3 490 Ft-os projekthelyhez**, valamint a **2 490 Ft-os előfizetés minden kifizetett hónapjához** AAM elektronikus számlát kér a Számla Agenttől. A számlázó közvetlenül e-mailben küldi a számlát; ehhez nem kell Resend. Az ingyenes projekthez nem készül számla.

## Beállítás az adminfelületen

1. A Számlázz.hu-fiókban ellenőrizd az eladó hivatalos adatait, az AAM adózást, az e-számlázási és NAV-beállításokat, valamint a Számla Agent jogosultságot. Az eladó adatait a számlázó saját fiókjából veszi, nem az oldal kapcsolatfelvételi blokkjából.
2. Kapcsold be a Számlázz.hu **Rendelésszám ismétlődés tiltása** funkcióját minden használt fiókban. Ez az alkalmazás saját védelmét kiegészíti.
3. Jelentkezz be a kijelölt ShockCraft-adminfiókkal. A `/admin` oldalon keresd a **Számlázz.hu · automatikus számlázás** részt.
4. A **tesztfiók Agent-kulcsát** és az **éles fiók Agent-kulcsát** a megfelelő külön mezőbe írd. A tesztmezőbe is beírt éles kulcs valódi számlát készíthet: a program a kulcsból nem tudja felismerni a fiók típusát. A Stripe tesztüzem kizárólag a tesztmezőt használja, soha nem helyettesíti azt az éles kulccsal.
5. A számlaszám-előtag opcionális; csak a Számlázz.hu-ban beállított előtagot használd. A válaszcím alapértéke `info@luiz-tech.hu`.
6. Jelöld, hogy a rendelésszám-ismétlődés tiltását bekapcsoltad, engedélyezd az automatikus számlázást és ments. A mentés önmagában nem ellenőrzi a külső fiókot és nem állít ki számlát. Az üres kulcsmező megtartja a korábban mentett kulcsot.
7. A Stripe webhookjai között az egyszeri vásárlás eseményei mellett az **`invoice.paid`** is legyen engedélyezve. A teljes listát a [Stripe-útmutató](stripe.md) tartalmazza.
8. Először tesztfiókokkal ellenőrizd a vásárlást, a havi megújulást, a számla tartalmát és a levélküldést. A tesztfiók saját kézbesítési szabályai érvényesek. Ezután válts a megfelelő éles beállításokra.

Az alkalmazás új fizetést csak mentett számlázási adatokkal és a kiválasztott Stripe-módhoz engedélyezett számlázással indít. Az admin titkos kulcsai titkosítva kerülnek adatbázisba; a böngészőbe nem olvashatók vissza. A `BILLING_ENCRYPTION_KEY` szervertitkot a fizetési és levélküldési beállításokkal együtt használjuk: meglévő telepítésen ne cseréld le.

## Vásárlói adatok és számlák

A **Projekthelyek és fizetés** ablakban a vásárló megadja a típusát, számlázási nevét, magyar címét és a számla e-mail-címét. Vállalkozás/jogi személy esetén magyar adószám is kell; magánszemélytől nem kérünk adóazonosító jelet. Az elektronikus számlát külön jelölőnégyzettel kéri. A jelenlegi változat csak magyar számlázási címet támogat.

A fizetés indításakor rögzített adatmásolat kerül a számlára. A profil utólagos változtatása nem írja át a folyamatban lévő vásárlást, a már kiállított számlát vagy a meglévő előfizetés számlázási adatait. Ezek javítását az ügyfélszolgálaton kell egyeztetni. A régi, számlázási adatok nélkül indított vásárlásokhoz és előfizetésekhez nem készül visszamenőleg automatikus számla.

A rendszer a Stripe által igazolt kifizetés napját budapesti idő szerint használja teljesítési és fizetési határidőként, a kiállítás napját a Számlázz.hu adja. Havi előfizetésnél a fizetett időszak is szerepel a megjegyzésben. A teljesítési időpont alkalmazhatóságát a szolgáltatás szerződéses feltételeivel együtt egyeztesd a könyvelőddel az éles használat előtt.

## Hibák és újrapróbálás

- Az adminfelületen az utolsó 100 számlázási esemény, a felhasználónál a saját utolsó 30 számla állapota látszik. Az elkészült PDF-et a Számlázz.hu kezeli; az alkalmazás a számlaszámot tartja nyilván.
- A fizetett jogosultság megmarad akkor is, ha a számlázó átmenetileg nem elérhető. A webhook sikertelen feldolgozására a Stripe újraküldési szabályai érvényesek; nincs külön háttérütemező. A tartósan függő tételeket az adminnak ellenőriznie kell.
- Az **Ellenőrzés / újrapróbálás** először a rendelés egyedi azonosítójával megkeresi a már létező számlát. Ha megtalálja, csak az állapotot javítja; nem küldi újra a levelet.
- Igazolt számlázói elutasítás után a beállítás javításával megismételhető a kiállítás. A már sorba állított tétel adatmásolata változatlan marad; hibás vevőadatot az ügyintézőnek külön kell rendeznie.
- Megszakadt kapcsolatnál az eredmény bizonytalan lehet. Ilyenkor az alkalmazás később is csak lekérdez, új számlát nem készít automatikusan. A számlázóban ellenőrizd az adminlistán látható `SC-…` rendelési azonosítót. Ha nincs számla, a Számlázz.hu-val egyeztetett eredmény alapján kell egyedileg rendezni; nincs vak újraküldést engedő kapcsoló.
- Az „e-mail küldését kértük” nem igazolja a postaládába érkezést. A hibás címet, visszapattanást vagy újraküldést a Számlázz.hu-ban kezeld.
- Visszatérítés, sztornó és helyesbítő számla nem automatizált. A Stripe-visszatérítés önmagában nem sztornózza a Számlázz.hu-számlát.

## Saját Node.js / MySQL tárhely

Frissítés előtt készíts adatbázismentést, majd futtasd újra a telepítési útmutató szerinti sémabeállítást:

```sh
node --env-file=.env.production --experimental-strip-types scripts/mysql-setup.mjs
```

Az új táblák: `invoice_settings`, `billing_profiles`, `order_billing`, `invoice_jobs`. Sites alatt a `0005_gigantic_psynapse.sql` migráció a közzététel része. A számlázási rekordokat, rendeléseket, felhasználókat és titkosítókulcsot együtt mentsd. Az Agent-kulcsot ne tedd forráskódba vagy kliensoldali környezeti változóba. A tárhelynek HTTPS-en el kell érnie a Stripe és a Számlázz.hu szolgáltatását; a webhooknak nyilvánosan elérhetőnek kell lennie.

## Ellenőrzések és hivatkozások

A helyi tesztek szimulált szolgáltatásválaszokkal ellenőrzik az AAM összegeket, XML-karakterek kezelését, ismételt és párhuzamos eseményeket, megszakadt küldés helyreállítását, megújulásokat, elkülönített tesztkulcsot, hozzáféréseket és a titkok kitakarását. Valódi Agent-kulccsal kiállított számla és tényleges e-mail-kézbesítés még nem volt tesztelve. A generált számla XML-je megfelelt a hivatalos XSD-ellenőrzésnek.

- [Számlakiállítás XML](https://docs.szamlazz.hu/hu/agent/generating_invoice/xml)
- [Számlakiállítás válasza](https://docs.szamlazz.hu/hu/agent/generating_invoice/response)
- [Rendelésszám ismétlődésének tiltása](https://docs.szamlazz.hu/hu/agent/generating_invoice/settings_and_rules/order-number)
- [Számlaadatok lekérdezése](https://docs.szamlazz.hu/hu/agent/querying_xml/xml)
- [Számlázz.hu adatvédelem](https://www.szamlazz.hu/adatvedelem)

A jogi oldalak továbbra is felülvizsgálandó tervezetek; a számlaértesítő nem helyettesíti a szerződés tartós adathordozón történő visszaigazolását.
