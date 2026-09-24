# Saját fiókok és MySQL

Saját Node.js-tárhelyhez a [teljes telepítési útmutatót](telepites.md) kövesd. Az alábbi Sites-beállítások a jelenlegi online változatra vonatkoznak.

A regisztráció, bejelentkezés és kijelentkezés a ShockCraft saját funkciója. ChatGPT-fiók nem szükséges. A felhasználók neve, e-mail-címe, bcrypt jelszólenyomata és a munkamenetek szerveroldalon tárolódnak. A munkamenetsüti HttpOnly, éles HTTPS-címen Secure, SameSite=Lax; a szerver csak a token SHA-256 lenyomatát tárolja. A munkamenet hét nap után lejár, kijelentkezéskor azonnal érvénytelenné válik.

MySQL-kiszolgáló hiányában a meglévő Cloudflare D1 tárolja ugyanazokat az adatokat. `MYSQL_URL` beállítása esetén a teljes fiók- és tervtárolás MySQL-t használ. Hibás MySQL-kapcsolat esetén a rendszer hibát jelez, nem vált át észrevétlenül másik adatbázisra.

## MySQL 8 előkészítése

1. Hozz létre egy üres `shockcraft` adatbázist és egy ehhez az adatbázishoz korlátozott felhasználót. A sématelepítéshez CREATE, INDEX és REFERENCES, az alkalmazás futásához SELECT, INSERT, UPDATE és DELETE jog szükséges. A futtató felhasználó ne legyen root.
2. A projekt gyökerében hozz létre egy Git által figyelmen kívül hagyott `.env.mysql` fájlt:

   ```dotenv
   MYSQL_URL=mysql://shockcraft:URL_ENCODED_PASSWORD@db.example.com:3306/shockcraft
   ```

   A felhasználónév és jelszó URL-kódolt legyen. Jelszó és kapcsolati URL nem kerülhet a kliensbe, a forráskódba vagy a `.openai/hosting.json` fájlba. Saját hitelesítésszolgáltatónál az opcionális `MYSQL_SSL_CA` tartalmazhatja a PEM-tanúsítványt. Külső kapcsolathoz a TLS és a tanúsítvány-ellenőrzés kötelező; a kód kizárólag loopback címnél enged titkosítatlan fejlesztői kapcsolatot.
3. Node.js 22.13+ alatt futtasd:

   ```powershell
   node --env-file=.env.mysql --experimental-strip-types scripts/mysql-setup.mjs
   ```

   A parancs a `db/mysql-schema.sql` tábláit készíti elő. Meglévő rekordokat nem töröl. A séma nem az alkalmazás kéréseinek kiszolgálásakor épül fel.
4. A Sites szerveroldali környezeti beállításainál vedd fel a `MYSQL_URL` értékét titokként, és szükség esetén a `MYSQL_SSL_CA` értékét is. Az új beállítást új közzététel aktiválja. Helyi fejlesztéshez a projekt `.env` fájljában adhatók meg az értékek. A MySQL-szervernek a futtatókörnyezetből elérhetőnek kell lennie; a saját gép `localhost` címe nem érhető el az éles oldalról.

## Adatok átállítása

A beállítás másik adatbázist választ, önmagában nem másolja át a meglévő rekordokat. Éles váltás előtt készíts mentést és állítsd le a módosításokat, majd másold át a `users`, `plans` és szükség esetén `sessions` táblákat az azonosítók megtartásával. A session tábla elhagyható, ekkor mindenki újra belép. A D1 és MySQL sémák mezőnevei azonosak. A `plans.id` az új fiókoknál `account:<users.id>` (korábbi terv), illetve `account:<users.id>:project:<UUID>` (új projekt) formájú; ezeket az azonosítókat változatlanul kell átvinni. Alternatíva: tervenként JSON-export/import és új regisztráció.

A korábbi ChatGPT-belépéshez tartozó `user:` kulcsú rekordokat a frissítés nem törli és nem kapcsolja automatikusan egy azonos e-mail-címmel létrehozott fiókhoz. A már megnyitott régi terv JSON-exporttal átvihető az új fiókba; szerveroldali átvételhez az eredeti tulajdonosi kapcsolatot külön ellenőrizni kell. A korábban nyilvános, közös `main` mintaterv továbbra is csak olvasható másolatként vehető át.

## Ellenőrzés és jelenlegi keretek

A regisztráció normalizálja az e-mail-címet és egyediséget ellenőriz. A jelszó legalább 12 karakter, legfeljebb 72 UTF-8 bájt. A bejelentkezés próbálkozáskorlátot használ. A mentési végpontok a szerveroldali munkamenetből állapítják meg a tulajdonost; kliensoldali azonosítóval más felhasználó terve nem választható ki. Az eredeti verzióellenőrzés megmarad.

Ez a változat nem küld e-mailes címellenőrzést vagy jelszó-visszaállító levelet. Nincs beállítva levelezőszolgáltatás. A MySQL-adapter és telepítő elő van készítve; tényleges MySQL-szerverrel az ellenőrzést az első csatlakoztatáskor kell elvégezni.

A csatlakozási megoldás a [Cloudflare MySQL-támogatására](https://developers.cloudflare.com/workers/databases/connecting-to-databases/) és a `mysql2` meghajtóra épül.
