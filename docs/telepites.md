# Villanyrajz – telepítési útmutató

Node.js-t támogató tárhelyhez és Linux VPS-hez. Frissítve: 2026. október 2.

## Háttéralaprajzok fájltárolása

A képek a MySQL-adatbázison kívül tárolódnak; az adatbázis a hivatkozásokat és a méretezést őrzi. Node.js-tárhelyen állítsd be a `SHOCKCRAFT_UPLOAD_DIR` változót egy állandó, privát, a szerver által írható könyvtár abszolút útvonalára, például `/var/lib/shockcraft/uploads`. Ne legyen a webkiszolgáló nyilvános könyvtárában. Ha nincs megadva, a munkakönyvtár `.shockcraft/uploads` mappája használatos.

A könyvtárat a MySQL-adatbázissal együtt mentsd, és új kiadás telepítésekor is ugyanazt a helyet használd. Konténerben tartós kötet szükséges. Az adatbázismentés önmagában nem tartalmazza a háttérképeket. A webszerver/proxy kérésméret-korlátja engedjen legalább 2 MB-os feltöltést. Sites-tárhelyen a képek a privát `BACKGROUNDS` objektumtárba kerülnek, külön kézi beállítás nélkül.

Használat: [Háttéralaprajz és méretarány](hatteralaprajz.md).

## 1. Mire lesz szükség?

A Villanyrajz szerveroldali webalkalmazás. A felület mellett saját regisztrációt, munkameneteket és tervmentést szolgál ki. Egy egyszerű, csak fájlfeltöltésre vagy PHP-ra alkalmas tárhely nem elegendő.

- Node.js 22.13 vagy újabb támogatott kiadás, npm és terminál/SSH vagy tárhelyes build lehetőség. A helyi ellenőrzés Node.js 24 alatt történt.
- MySQL 8.0 vagy újabb adatbázis, külön adatbázis-felhasználóval.
- Saját domain vagy aldomain, érvényes HTTPS-tanúsítvány és folyamatos Node.js-folyamat.
- A fordításhoz induló becslésként 2 GB RAM; a tényleges terhelést a használattal együtt kell mérni.
- VPS esetén Nginx és systemd; kezelt Node.js-tárhelyen ezeket a szolgáltató helyettesíti.

A teljes alkalmazást a domain gyökerén használd, például https://terv.pelda.hu. Ez a csomag nem tartalmaz alkönyvtáras telepítési beállítást.

A jelenlegi online Sites-változat továbbra is a meglévő D1 adatbázist használja. A saját Node.js-es telepítés MySQL-t igényel. Ezek külön adatbázisok; az adatokat a telepítés nem másolja át automatikusan.

## 2. Forráskód és környezeti beállítások

A projekt teljes forrását másold a tárhelyre, például egy új kiadási könyvtárba. Ne töltsd fel a saját gép node_modules, dist, .wrangler, .sites-runtime és .git könyvtárait vagy a helyi titkos .env fájlokat. A csomagokat a célgépen telepítsd; a package-lock.json fájlt tartsd meg.

VPS-en a példák a /srv/shockcraft/current könyvtárat használják. Ez lehet az aktuális kiadási könyvtárra mutató szimbolikus link. A Node.js-folyamatot külön shockcraft rendszerfelhasználó futtassa. A szolgáltatásmintát a saját könyvtáradhoz és a node tényleges útvonalához igazítsd.

Hozz létre egy .env.production fájlt a deploy/env.production.example mintájából:

```dotenv
NODE_ENV=production
HOST=127.0.0.1
PORT=3000
APP_ORIGIN=https://terv.pelda.hu
MYSQL_URL=mysql://shockcraft:URL_ENCODED_PASSWORD@127.0.0.1:3306/shockcraft
```

Az APP_ORIGIN pontosan a böngészőből használt eredet: séma, domain és szükség esetén port; útvonal nélkül. A bejelentkezési és mentési kérések ezt ellenőrzik. Más domainre költözéskor is módosítani kell.

A MYSQL_URL felhasználóneve és jelszava URL-kódolt legyen: például a @ jel %40. Külső MySQL-kapcsolat ellenőrzött TLS-t használ; saját CA esetén a MYSQL_SSL_CA változóban adható meg a PEM-tanúsítvány. Azonos gépen, loopback címen fejlesztési/helyi kapcsolat is használható.

A titkos környezeti fájl ne kerüljön Gitbe, letölthető webkönyvtárba vagy ügyféloldali kódba. A rendszerfelhasználó olvashassa; például chmod 600 a fájlon, megfelelő tulajdonossal. A domain, adatbázisnév és jelszó a példákban helyőrző, átírandó.

## 3. MySQL előkészítése és első indítás

Az adatbázis-adminisztrátor hozzon létre egy üres shockcraft adatbázist utf8mb4 karakterkészlettel és egy erre korlátozott felhasználót. A sématelepítéshez CREATE, INDEX, REFERENCES és az alkalmazás jogai kellenek. A futó alkalmazásnak SELECT, INSERT, UPDATE és DELETE jogosultság szükséges. Ne root felhasználóval csatlakozz.

A projekt gyökerében futtasd a következő parancsokat. Fordításkor a fejlesztői függőségek is szükségesek:

```bash
npm ci --include=dev --include=optional
node --env-file=.env.production --experimental-strip-types scripts/mysql-setup.mjs
npm run build:node
npm run start:node
```

A telepítő létrehozza a users, sessions, auth_limits és plans táblákat, és ellenőrzi az alapmezőket. Meglévő adatokat nem töröl. Későbbi sémaváltozásokhoz külön, az adott kiadáshoz tartozó migrációt kell alkalmazni; az első telepítő nem automatikus sémamigráló.

A build:node a dist/standalone könyvtárba készít Node.js-es kiadást. A start:node a .env.production fájlt olvassa, ellenőrzi a kötelező beállításokat, és elindítja a szervert. A sima npm run build és npm start a Sites/Workers változathoz tartozik. Mindkét fordítás a dist könyvtárat használja, ezért a két cél buildjét külön kiadási könyvtárban készítsd.

A helyi cím alapértelmezésben http://127.0.0.1:3000. VPS-en ezt az Nginx teszi elérhetővé HTTPS-en. Ha a környezeti fájlt a kiadásokon kívül tartod, közvetlenül így indíts:

```bash
node --env-file=/srv/shockcraft/.env.production scripts/start-node.mjs
```

A GET /api/health végpont 200 és status: ok választ ad elérhető adatbázisnál; adatbázishibánál 503-at. A végpont nem adja vissza a kapcsolati adatokat. Első indításkor végezz valódi regisztrációs és mentési próbát is, mert az egészségellenőrzés nem helyettesíti a séma és jogosultságok teljes ellenőrzését.

## 4. Kezelt Node.js-tárhely

A szolgáltató kezelőfelületén a következő beállításokat keresd:

- Alkalmazás gyökere: a teljes Villanyrajz projekt könyvtára.
- Node.js verzió: legalább 22.13; a tárhely által támogatott megfelelő kiadás.
- Telepítés: npm ci --include=dev --include=optional.
- Build parancs: npm run build:node.
- Indítási parancs: npm run start:node, ha .env.production fájlt használsz.
- Indítófájl mező esetén: scripts/start-node.mjs; a változókat ekkor a tárhely környezeti beállításainál add meg, mert a fájl önmagában nem tölt be .env fájlt.
- HOST és PORT: a szolgáltató által megkövetelt értékek. Konténeres tárhely gyakran 0.0.0.0 címet és saját PORT változót vár.

A szolgáltatónak ES-modulos Node.js-indítást és tartós folyamatot kell támogatnia. Az npm csomagok telepítése önmagában nem jelenti, hogy a tárhely alkalmas erre. Ha csak egy CommonJS/Passenger indítófájlt fogad el, egyeztesd a szolgáltatóval a támogatott indítási módot.

A proxy őrizze meg a valódi Host fejlécet, és állítsa felül az X-Real-IP fejlécet az ügyfél hiteles címével. A felhasználó által küldött IP-fejlécet nem szabad változtatás nélkül átengedni: a belépési próbálkozások korlátozása ezt is használja. Az e-mail szerinti korlát ettől függetlenül működik. Ne legyen megkerülhető közvetlen publikus Node-port.

## 5. VPS: domain, HTTPS és folyamatos futás

A DNS-ben irányítsd a választott aldomaint a VPS-re. Telepíts érvényes HTTPS-tanúsítványt a szolgáltatód vagy az általad választott ACME-kliens útmutatója szerint. A deploy/nginx.conf kész mintát tartalmaz; a domain és a tanúsítványútvonal átírandó. Tanúsítvány nélkül a TLS-es blokk nem indul el.

Az Nginx lényege: a 443-as HTTPS-kérések továbbítása a 127.0.0.1:3000 címre. A böngésző az Nginxet éri el. A Node-port ne legyen nyilvánosan elérhető. A mintában a proxy megőrzi a Host fejlécet, felülírja az IP-fejléceket, nem gyorsítótáraz, és nem puffereli az alkalmazás válaszait. A 3 MB-os kéréskorlát mellett az alkalmazás továbbra is legfeljebb 2 MB-os tervet fogad.

A sablon telepítése után az Nginx beállítását ellenőrizd, és csak sikeres ellenőrzés után töltsd újra:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

A deploy/shockcraft.service mintát másold /etc/systemd/system/shockcraft.service néven. Előtte hozd létre a shockcraft rendszerfelhasználót, add meg a tényleges projekt- és Node.js-útvonalat, valamint a környezeti fájl helyét. A mintában /usr/bin/node szerepel; ezt a command -v node paranccsal ellenőrizheted. A forrás és a titkos fájl legyen olvasható a szolgáltatás számára.

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now shockcraft
sudo systemctl status shockcraft
sudo journalctl -u shockcraft -n 80 --no-pager
```

A folyamatos futtatást a systemd felügyeli és hiba után újraindítja. A terminálban kézzel indított példányt állítsd le, mielőtt a szolgáltatást elindítod ugyanazon a porton.

## 6. Átvételi próba és hibaelhárítás

Az első éles használat előtt ellenőrizd a következő folyamatot a saját domainen:

1. Nyisd meg HTTPS-en az oldalt. Töltsd le a telepítési PDF-et a Tervsegédből.
2. Regisztrálj egy saját e-mailes fiókot, módosíts egy tervet és mentsd.
3. Jelentkezz ki, lépj vissza, és ellenőrizd a mentett változatot.
4. Egy második tesztfiók ne lássa az első fiók személyes tervét.
5. Készíts terv-PDF-et és anyagkimutatást, majd indítsd újra a szolgáltatást. A mentett tervnek ezután is vissza kell töltenie.

Gyakori hibák:

- 502 Bad Gateway: a Node.js-folyamat nem fut, rossz a port, vagy az Nginx nem éri el.
- 503 / adatbázis nem érhető el: MYSQL_URL, jogosultság, tűzfal, TLS vagy hiányzó táblák. Ellenőrizd az /api/health végpontot és a szervernaplót. Titkos kapcsolati adatot ne tegyél nyilvános naplóba.
- 403 / érvénytelen kérés: az APP_ORIGIN eltér a böngésző címétől, vagy hibás a proxybeállítás.
- A belépés után ismét vendég mód: ellenőrizd a HTTPS-t, a Host fejlécet és a böngésző sütibeállításait. A sütik HttpOnly és SameSite=Lax tulajdonságúak; nyilvános címen Secure védelemmel készülnek.
- Buildhiba: megfelelő Node-verzió, a lockfájlhoz tartozó csomagok és fejlesztői függőségek szükségesek. Ne tölts fel Windows alatt készült node_modules könyvtárat Linuxra.
- Portütközés: ne fusson egyszerre a kézi példány és a systemd ugyanazon a porton.

## 7. Mentés, frissítés és költözés

Frissítés előtt készíts adatbázismentést a szolgáltató mentési felületén vagy MySQL-mentőeszközzel. A users és plans táblák együtt tartják meg a tulajdonosi kapcsolatot. A sessions tábla is menthető, de elhagyásakor mindenki újra bejelentkezik. A böngészőből exportált JSON egy terv mentése, nem teljes fiókadatbázis-mentés.

Új verziót új kiadási könyvtárban telepíts és fordíts. A titkok maradjanak a kiadásokon kívül. Ellenőrizd az új verzió sémaváltozásait, állítsd át az aktuális kiadást, majd indítsd újra a szolgáltatást. Ellenőrizd az /api/health választ és a mentés-visszatöltés folyamatát. Hibánál térj vissza az előző kompatibilis kiadásra; sémaváltozás esetén a kód visszacserélése önmagában nem feltétlenül elegendő.

A Sites-ról saját MySQL-re váltás nem automatikus szinkronizálás. Egyszerű átvitelnél exportáld a tervet JSON-ba, hozz létre saját fiókot az új címen, importáld és mentsd. Több felhasználó teljes átvitelénél az adatbázisrekordokat az azonosítók megtartásával kell átmásolni; ehhez a docs/mysql.md további útmutatót ad.

A korábbi ChatGPT-fiókok tervrekordjai nem kapcsolódnak automatikusan az új e-mailes fiókokhoz. Ha a régi terv még meg van nyitva, frissítés előtt exportáld. A frissítés nem törli a régi adatbázisrekordokat.

## 8. Ellenőrzött állapot és források

Ellenőrizve: Node.js-es fordítás és önálló szerverindítás, a felület és a statikus betűkészlet kiszolgálása, valamint a hiányzó adatbázis szabályos hibajelzése. A saját regisztráció, bejelentkezés, kijelentkezés, fiókelkülönítés és mentés a Workers-változat helyi D1 adatbázisán tesztelve.

Mivel még nincs MySQL-szervered, a valódi MySQL-kapcsolatot, a cél tárhelyet, az Nginxet és a systemd szolgáltatást az első telepítéskor kell ellenőrizni. A mintafájlok nem telepítenek semmit automatikusan a gépeden.

Jelenleg nincs e-mailes címellenőrzés vagy elfelejtettjelszó-levélküldés. Felhasználónként több külön projekt menthető és nyitható meg. A kimutatás a rajzolt geometria alapján számol; nem végez villamos méretezést.

Hivatalos műszaki háttér: a Node.js env-file beállítása, a vinext standalone kimenete és az Nginx proxy-beállításai. Az útmutatóban szereplő alkalmazásparancsok a Villanyrajz csomag saját parancsai.

- Node.js: https://nodejs.org/api/cli.html#--env-filefile
- vinext: https://github.com/cloudflare/vinext
- Nginx: https://nginx.org/en/docs/http/ngx_http_proxy_module.html

## Projektdíjak és Stripe

Az első projekt ingyenes, további projektenként egyszeri 3 490 Ft fizetendő. Az adminfiók, a titkosítókulcs, a Stripe-kulcsok és a webhook beállítását a [Stripe telepítési útmutató](stripe.md) tartalmazza.

## Jelszó-visszaállítás és e-mail-megerősítés

A Resend, a feladói domain és az adminpanel beállítását az [E-mail beállítási útmutató](email.md) írja le. Frissítéskor MySQL-en futtasd újra az adatbázis-előkészítő lépést az új fiókmezők hozzáadásához.

## Automatikus AAM számlázás

A Számlázz.hu Számla Agent beállítását, a teszt- és éles kulcsok kezelését, az új adatbázistáblákat és a hibás számlázás rendezését a [számlázási útmutató](szamlazz-hu.md) írja le. Új fizetéshez mentett számlázási profil és bekapcsolt számlázás szükséges.
