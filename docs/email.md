# Fióklevelek: Resend beállítása

A Villanyrajz e-mailben küld jelszó-visszaállító és e-mail-címet megerősítő hivatkozást. A szolgáltatás kezdetben ki van kapcsolva; levél csak érvényes Resend-beállításokkal küldhető.

## Bekapcsolás

1. Hozz létre saját Resend-fiókot, és a **Domains** oldalon add hozzá a saját feladói domainedet vagy aldomainedet. A Resendben látható DNS-bejegyzéseket állítsd be a domain szolgáltatójánál, majd várd meg a sikeres domainellenőrzést. [Hivatalos útmutató](https://resend.com/docs/dashboard/domains/introduction).
2. Az **API Keys** alatt hozz létre levélküldésre jogosult kulcsot. Az alkalmazás a Resend HTTPS API-ját használja, SMTP-jelszó nem szükséges.
3. A Villanyrajz **Admin → Fióklevelek · Resend** részében add meg a domainhez tartozó feladói e-mail-címet és a `re_…` kulcsot. Kapcsold be a fióklevelek küldését, majd mentsd.
4. A **Fiókom → Megerősítő levél küldése** gombbal kérj levelet a saját fiókodhoz. Nyisd meg a levelet, majd a megerősítő oldalon nyomd meg a gombot. A **Fiókom → Állapot frissítése** mutatja az eredményt.
5. Próbáld ki az **Elfelejtetted a jelszavad?** folyamatot is. A sikeres jelszócsere után a régi jelszóval és korábbi munkamenettel már nem lehet belépni. A mentett tervek megmaradnak.

A beállítások mentése nem kézbesítési próba. A Resend naplójában nézd meg az elküldött, visszapattant és elutasított leveleket. Fiókleveleknél kapcsold ki a megnyitás- és kattintáskövetést. A levelek linkjeit ne oszd meg.

## Szerver és adatbázis

- `APP_ORIGIN`: a nyilvános HTTPS-cím, záró perjel nélkül. A linkek mindig ebből készülnek, nem a bejövő kérés Host fejlécéből.
- `BILLING_ENCRYPTION_KEY`: a Stripe-beállításoknál már használt 64 hexadecimális karakteres szerveroldali titok. Ez titkosítja a Resend-beállításokat is; működő telepítésen ne cseréld le. Őrizd meg az adatbázis mentésével együtt.
- Sites alatt a `0003_old_inhumans.sql` migrációt a közzététel alkalmazza. A régi felhasználókat nem jelöljük automatikusan igazoltnak.
- MySQL / Node.js tárhelyen frissítéskor futtasd a telepítési útmutató `scripts/mysql-setup.mjs` lépését. A program a meglévő `users` és `sessions` táblákhoz is hozzáadja az új mezőket, és létrehozza az `account_tokens`, `mail_settings` táblákat. Ezután indítsd újra az alkalmazást. MySQL-szerver hiányában ez a telepítési útvonal helyben nem volt kipróbálható.

## Működés

- Regisztráció után automatikus megerősítő levél készül, ha a küldés engedélyezett. Küldési hiba esetén a létrejött fiók megmarad, és a Fiókom ablakból új levél kérhető.
- A megerősítő link 24 óráig, a jelszó-visszaállító link 30 percig használható. Az adatbázis csak a véletlen token SHA-256 lenyomatát tárolja.
- A link puszta megnyitása nem módosítja a fiókot: külön gombnyomás vagy új jelszó beküldése szükséges. A token URL-töredékben érkezik, és az oldal betöltéskor eltávolítja a címsorból. Az oldal frissítése után a levélből kell újranyitni.
- Jelszócsere atomikusan érvényteleníti az összes korábbi munkamenetet és régi visszaállító linket. Ez a közben zajló, régi jelszavas belépésre is vonatkozik.
- A visszaállító levél kérésének válasza nem árulja el, létezik-e a fiók. Hibás kézbesítés esetén is általános választ ad; a szolgáltató naplója mutatja a küldési hibát.
- Újraküldésnél percenként egy levél, címenként és műveletenként 15 perc alatt legfeljebb három kérés engedélyezett; IP-alapú korlát is működik a tárhely által megadott klienscímmel.
- A megerősítés állapota látható a fiókban. Ez a frissítés nem zárja ki a korábbi felhasználókat és nem teszi kötelezővé a megerősítést a tervezéshez. A beállítatlan levelezés nem akadályozza a meglévő bejelentkezést és mentést.

A küldés a [Resend Send Email API](https://resend.com/docs/api-reference/emails/send-email) szerint működik; a kulcs soha nem kerül a böngészőbe vagy a nyilvános konfigurációba.
