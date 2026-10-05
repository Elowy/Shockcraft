# Automatikus mentés és helyreállítás

A tervező fejlécében az **Automatikus mentés** kapcsoló alapértelmezetten be van kapcsolva. A már legalább egyszer elmentett projekt az utolsó változtatás után 5 másodperccel a saját fiókba mentődik. Az új projekt, import vagy projektmásolat első mentését a **Mentés** gombbal kell elindítani; automatikus mentés nem foglal új projekthelyet. A kapcsoló a nyitott szerkesztőre vonatkozik.

A mentés ugyanazt a szerveroldali jogosultság- és verzióellenőrzést használja, mint a kézi mentés. A visszavonás is módosítás, ezért annak eredménye szintén automatikusan mentődik. Mentés közben tovább szerkeszthetsz; a közben készült változtatások a következő mentésbe kerülnek.

Hálózati hiba, lejárt belépés, előfizetési korlátozás, hibás tervadat vagy párhuzamos módosítás esetén az automatikus mentés szünetel, és a felület jelzi az okot. Nincs végtelen automatikus újrapróbálkozás. A hiba rendezése után a **Mentés** gombbal próbáld újra. A sikeres kézi mentés feloldja a szüneteltetést. A 15 másodperc után megszakadó kérés eredménye bizonytalan lehet; az újrapróbálás nem írhat felül újabb szerververziót.

## Helyi munkamásolat

A módosítások után 600 ms szünettel külön helyreállítási másolat készül a böngésző localStorage tárhelyére. Lapelhagyáskor és háttérbe kerüléskor is megkíséreljük a frissítést. Ez akkor is működik, ha a fiókba mentés kapcsolója ki van kapcsolva. A másolat a legutolsó érvényes tervállapotot tárolja; félkész szövegmező vagy hibás adat esetén a korábbi másolat marad meg. A még be nem fejezett rajzolási vázlat nem része a tervnek.

A másolatokat fiók, projekt és böngészőlap szerint különítjük el. Az egyidejűleg nyitott lapok nem írják felül egymás munkamásolatát. A helyreállítás nem projektverzió-történet: laponként és projektenként az utolsó munkamásolat marad meg. A sikeresen elmentett, azonos tartalmú másolatok kitakaríthatók; a más tartalmúak megmaradnak. Az eredeti mentésre való visszavonás a jelenlegi lap saját munkamásolatát eltávolítja.

## Helyreállítás

Nyisd meg a **Helyreállítás** ablakot. A böngésző megőrzött másolatai névvel és időponttal jelennek meg. Újratöltés után a mentett szerverváltozat nyílik meg, a helyi munka visszatöltése tudatos választás.

Helyreállítás előtt a jelenlegi munka helyi másolatot kap, és a program ellenőrzi a forrásprojekt elérhetőségét. Zárolt projekt nem állítható helyre a jogosultság megkerülésével. Ha az eredeti szerververzió nem változott, ugyanaz a projekt folytatható. Ha közben másik lap újabb verziót mentett, a munkamásolat külön új projektként nyílik meg, kézi első mentéssel és a szokásos projekthely-szabályokkal. A szerverre mentett újabb tervet nem írjuk felül.

A felesleges helyi másolat a listában, külön megerősítéssel elvethető. Ez nem törli a szerverprojektet. A kijelentkezés nem törli automatikusan a másolatokat; a felület csak az aktuális fiók másolatait mutatja. Közös gépen a böngésző webhelyadatait is kezeld ennek megfelelően.

## Korlátok

A helyi másolat ugyanazon a böngészőn és webhelycímen érhető el. A tárhely letiltása, megtelése vagy törlése megakadályozhatja a helyi védelmet; ezt a felület jelzi. Hirtelen összeomláskor az utolsó helyi írás óta készült módosítás elveszhet. A háttéralaprajzot a terv továbbra is az eredeti háttérfájlra hivatkozva tárolja. A helyi védelem nem helyettesíti a szerver biztonsági mentését, és nem ad import/export-jogosultságot.
