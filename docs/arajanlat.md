# Árazás és árajánlat

Az **Eszközök → Árazás / árajánlat** nézetben készíthető ügyfélnek szóló ajánlat. Projektenként egy szerkeszthető ajánlat tartozik a tervhez. Az adatok a projekt szokásos mentésében, automatikus mentésében és tervelőzményeiben is megmaradnak.

1. A **Tételek átvétele a tervből** gomb a teljes projekt és telek anyagkimutatását másolja át. Az árak üresek, kivéve, ha a projekthez termékeket választottál a termékkatalógusból (lásd `docs/termekkatalogus.md`); piaci árakat nem feltételez a program.
2. Add meg az ajánlat azonosítóját, dátumát, ajánlatadó és ügyfél adatait, valamint szükség esetén az érvényességet és a munkavégzés helyét. Ha a projekthez a felső sáv **Ügyfelek** gombjával ügyfelet rendeltél, az **Ügyféladatok átvétele** gomb kitölti az ügyfél adatait (és az üres munkavégzési helyet) a nyilvántartásból; lásd `docs/ugyfelek-teendok.md`.
3. Tételenként írd be a nettó anyag-egységárat és munkadíj-egységárat forintban. Ha valamelyik díj nem merül fel, adj meg **0** értéket; az üres mező hiányzó árat jelent.
4. Saját tételként például kiszállás, mérés vagy munkadíj is felvehető. Egységek: db, m, óra, tétel. A **Bevonva** kapcsolóval egy tétel kihagyható az összegből és a PDF-ből, az árai megőrzése mellett.
5. Állítsd be a kábelráhagyást, nettó kedvezményt és az ajánlatra alkalmazandó áfát. AAM, 0%, 5%, 18%, 27% választható; a megfelelő beállítást az ajánlatadó választja ki.
6. Töltsd ki a feltételeket és megjegyzéseket, majd töltsd le a PDF-et. A PDF nem számla; a rendszer ebben a változatban nem küldi el automatikusan az ügyfélnek.

## Termékek és katalógusárak

Az ajánlatszerkesztő **Termékek és katalógusárak** része a saját, fiókszintű termékkatalógusból (Eszközök → Termékkatalógus) dolgozik:

- **Típusonként egyszer** választható termék (például minden dugaljhoz ugyanaz): a tervből átvett, ilyen típusú tételek minden szinten és magasságon megkapják a termék nettó anyagárát és – ha meg van adva – a munkadíj-javaslatát. Az ár nélküli termék nem töröl meglévő árat.
- **Soronként** eltérő termék vagy „Nincs termék” is megadható a tételtábla „Termék választása…” gombjával; az egyedi választást a típusválasztás nem írja felül, a „Projekt-alapértelmezés követése” visszaállítja.
- A **Fiók-alapértelmezések alkalmazása** a még választás nélküli típusokra átveszi a fiókban ajánlott termékeket.
- Az **Árak frissítése a katalógusból** megerősítés után a termékhez kötött tételek anyagárát a katalógus aktuális árára cseréli (a kézzel módosítottat is); a munkadíjat csak ott tölti ki, ahol üres.
- A termékadat pillanatképként a tervbe kerül; a **Mennyiségek frissítése** csak az újonnan létrejött tételeket árazza a típusválasztásból, a meglévők árait nem változtatja.
- A PDF-ben a tétel neve alatt „Termék: …” sor jelenik meg; a **Termékadatok a PDF-ben** választó szerint gyártóval, termékcsaláddal és megnevezéssel (alapértelmezés), cikkszámmal együtt, vagy egyáltalán nem. A mintatermék nem kerül a PDF-be.

Minden ilyen művelet a tervező Visszavonás gombjával visszavonható. Részletek: `docs/termekkatalogus.md`.

## Mennyiségek és számítás

A kábelhossz a rajzolt nyomvonalakból, a függőleges szakaszokkal együtt kerül át. Nyomvonalanként egy kábel szerepel. A kettős dugalj egy szerelvény. A ráhagyás csak a jelölt méteres tételekre vonatkozik, az anyagra és a munkadíjra egyaránt. A mennyiség legfeljebb három, az egységár és százalék két tizedesre szerkeszthető. Soronként külön kerekítjük az anyag- és munkadíjat két tizedesre, majd a nettó összegből levonjuk a kedvezményt, és erre számítjuk az áfát.

Hiányos árazásnál csak részösszeg látható; a PDF elkészítéséhez az összes bevont, pozitív mennyiségű tétel árát ki kell tölteni. Az ajánlat legfeljebb 500 sort, soronként 10 000 egységet és díjtípusonként 1 000 000 Ft nettó egységárat kezel.

## Tervmódosítás és frissítés

Az ajánlat az átvételkori mennyiségeket őrzi. Ha a terv anyagkimutatása módosul, figyelmeztetés jelenik meg. A **Mennyiségek frissítése** megerősítés után frissíti a tervből átvett mennyiségeket és leírásokat, megtartva a hozzájuk tartozó egységárakat. A már nem létező tervtételeket kihagyottként őrzi meg; a saját tételeket nem változtatja meg. A hely vagy típus átnevezése új tételként jelenhet meg, ezért frissítés után ellenőrizd az árazást.

A módosítások a tervező Visszavonás gombjával visszavonhatók. Az export pillanatában a jelenleg szerkesztett ajánlat kerül a PDF-be. A nyitott projekt első mentését továbbra is kézzel kell elvégezni.

## Exportjogosultság

Az árajánlat-PDF a többi exporttal azonos, projektenkénti szabályt követi: az első ingyenes és az egyszer megvásárolt projektben előfizetés nélkül, az előfizetéses projektekben aktív előfizetéssel tölthető le. Az útiköltség km × Ft/km vagy fix összegként adható meg; a kedvezmény után, az áfa előtt adódik hozzá.
