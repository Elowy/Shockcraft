# Projektdíjak és Stripe

Az első elmentett projekt fiókonként ingyenes. Minden további projekthely egyszeri, összesen **3 490 Ft**. Nincs előfizetés. A vásárolt hely a következő új projekt, másolat vagy importált projekt mentésekor foglalódik le. Ugyanazon projekt későbbi mentése ingyenes. A korábban létrehozott projektek megnyitása és szerkesztése megmarad.

Vendégként egy helyi projekt menthető; további projektekhez saját fiók és projekthely szükséges. A pénzügyi jogosultságokat a szerver ellenőrzi. Az adminpanel nem a böngészőben tárolt adatok alapján ad hozzáférést.

## Első telepítés Node.js / MySQL tárhelyre

1. Telepítsd a frissített sémát a `node --env-file=.env.production --experimental-strip-types scripts/mysql-setup.mjs` paranccsal. A meglévő adatokat megtartja; létrehozza a `billing_settings`, `billing_orders` és `billing_grants` táblákat.
2. Regisztráld a tulajdonosi fiókot, majd a `users` táblából keresd ki az ellenőrzött fiók `id` mezőjét. Ezt add meg `ADMIN_USER_ID` szerveroldali környezeti változóként. Az e-mail-cím beírása önmagában nem ad adminjogot.
3. Generálj egy 32 bájtos titkosítókulcsot: `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. A 64 hexadecimális karaktert add meg `BILLING_ENCRYPTION_KEY` titokként. Tarts róla biztonságos mentést, és ne cseréld le egy már konfigurált telepítésnél: a tárolt Stripe-kulcsok visszafejtéséhez szükséges.
4. Az `APP_ORIGIN` legyen a publikus HTTPS-cím, útvonal és záró perjel nélkül. Például `https://terv.pelda.hu`.
5. Indítsd újra az alkalmazást. Az adminfiókkal belépve a felső **Admin** hivatkozás vagy a `/admin` cím nyitja meg a panelt.

Sites-hostolásnál a három változót a szerveroldali környezeti beállításokban kell megadni, majd az új környezeti változatot közzétenni. A `BILLING_ENCRYPTION_KEY` titok. A Stripe-kulcsokat ezt követően az alkalmazás adminpaneljén lehet kezelni; módosításukhoz nem kell új közzététel.

## Stripe beállítása

1. Nyisd meg a saját Stripe Dashboardodat, és válaszd ki a tesztkörnyezetet.
2. A ShockCraft adminpaneljén add meg a teszt API-kulcsot (`sk_test_…`). A nyilvános `pk_…` kulcsra a használt, Stripe által hosztolt Checkouthoz nincs szükség.
3. A Stripe-ban hozz létre egy webhook-végpontot az adminpanelen megjelenő pontos címmel: `https://SAJÁT-DOMAIN/api/stripe/webhook`. A végpontnak publikus HTTPS-en elérhetőnek kell lennie, bejelentkezési átirányítás és proxy által beillesztett HTML nélkül.
4. Válaszd a `checkout.session.completed` és `checkout.session.async_payment_succeeded` eseményeket. Másold a végpont saját `whsec_…` aláírókulcsát a ShockCraft megfelelő tesztmezőjébe.
5. Válaszd a tesztüzemet, engedélyezd az új vásárlásokat és ments. A **Mentett API-kapcsolat ellenőrzése** az API elérhetőségét vizsgálja, a webhookét nem.
6. Az adminfiókban, a **Projektek → Projekthelyek és fizetés** ablakban indíts tesztvásárlást. Használd a [Stripe hivatalos tesztadatait](https://docs.stripe.com/testing). Ellenőrizd a jóváírást, a fizetési jegyzéket, az új projekt létrehozását, valamint a megszakított fizetést. Tesztüzemben csak az admin indíthat fizetést; a normál felhasználók meglévő tervei elérhetők maradnak.
7. Az éles működéshez az éles API-kulcsot (`sk_live_…`) és az éles webhook-végpont külön aláírókulcsát is add meg. Válts **Éles fizetés** módra, és ments. A két környezet kulcsait ne keverd össze.

A díj a szerveren rögzített: 3 490 Ft, a Stripe számára 349000 HUF kisegység. A böngésző nem adhat meg árat. A HUF terhelési egységéről a [Stripe pénznemdokumentációja](https://docs.stripe.com/currencies#special-cases) ír. A vásárló a Stripe oldalán adja meg a kártyaadatokat; azok nem kerülnek a ShockCraft adatbázisába. A fizetés indítása nem állít be automatikus adó- vagy számlázási integrációt.

## Jóváírás és üzemeltetés

- A visszatérési URL önmagában nem igazol fizetést. Az alkalmazás szerveroldalon ellenőrzi a Checkout Sessiont, vagy az aláírt webhookból fogadja el a `paid` állapotot. Ellenőrzi a rendelést, tulajdonost, összeget, pénznemet és teszt/éles módot.
- Az ismételt vagy párhuzamos webhookok ugyanahhoz a rendeléshez csak egy helyet adhatnak. A fizetés visszaigazolása nélkül nincs fizetett hely.
- Ha a vásárló bezárja a Stripe utáni oldalt, a webhook akkor is jóváírhatja a helyet. A **Projekthelyek → Állapot frissítése** újra lekéri a jogosultságokat.
- A Stripe-kulcsokat AES-GCM titkosítással tároljuk az adatbázisban. Az admin API csak azt jelzi, hogy be vannak-e állítva; a titkokat nem adja vissza. Üres kulcsmező mentése megtartja a korábbi értéket.
- A vásárlások kikapcsolása nem tiltja a meglévő projektek szerkesztését és nem állítja le a korábbi fizetések webhook-feldolgozását.
- Az adminpanel az utolsó 50 fizetési kísérletet mutatja. A megszakított vagy lejárt kísérlet jóváírás nélkül függőben maradhat a jegyzékben.
- Visszatérítést és vitatott fizetést a Stripe Dashboardban kezelj. Ez a változat nem törli automatikusan a tervet és nem vonja vissza a projekthelyet visszatérítéskor; ez külön üzemeltetői egyeztetést igényel.
- Adatbázis-költöztetéskor a három billing táblát, a `users` és `plans` táblákat, valamint a titkosítókulcsot együtt őrizd meg.

A fizetésfeldolgozás a [Stripe Checkout jóváírási útmutatóját](https://docs.stripe.com/checkout/fulfillment) és a [webhook-aláírás ellenőrzését](https://docs.stripe.com/webhooks/signature) követi.
