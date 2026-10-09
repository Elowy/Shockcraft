# Árazás és árajánlat

Az **Eszközök → Árazás / árajánlat** nézetben készíthető ügyfélnek szóló ajánlat. Projektenként egy szerkeszthető ajánlat tartozik a tervhez. Az adatok a projekt szokásos mentésében, automatikus mentésében és tervelőzményeiben is megmaradnak.

1. A **Tételek átvétele a tervből** gomb a teljes projekt és telek anyagkimutatását másolja át. Az árak üresek; piaci árakat nem feltételez a program.
2. Add meg az ajánlat azonosítóját, dátumát, ajánlatadó és ügyfél adatait, valamint szükség esetén az érvényességet és a munkavégzés helyét.
3. Tételenként írd be a nettó anyag-egységárat és munkadíj-egységárat forintban. Ha valamelyik díj nem merül fel, adj meg **0** értéket; az üres mező hiányzó árat jelent.
4. Saját tételként például kiszállás, mérés vagy munkadíj is felvehető. Egységek: db, m, óra, tétel. A **Bevonva** kapcsolóval egy tétel kihagyható az összegből és a PDF-ből, az árai megőrzése mellett.
5. Állítsd be a kábelráhagyást, nettó kedvezményt és az ajánlatra alkalmazandó áfát. AAM, 0%, 5%, 18%, 27% választható; a megfelelő beállítást az ajánlatadó választja ki.
6. Töltsd ki a feltételeket és megjegyzéseket, majd töltsd le a PDF-et. A PDF nem számla; a rendszer ebben a változatban nem küldi el automatikusan az ügyfélnek.

## Mennyiségek és számítás

A kábelhossz a rajzolt nyomvonalakból, a függőleges szakaszokkal együtt kerül át. Nyomvonalanként egy kábel szerepel. A kettős dugalj egy szerelvény. A ráhagyás csak a jelölt méteres tételekre vonatkozik, az anyagra és a munkadíjra egyaránt. A mennyiség legfeljebb három, az egységár és százalék két tizedesre szerkeszthető. Soronként külön kerekítjük az anyag- és munkadíjat két tizedesre, majd a nettó összegből levonjuk a kedvezményt, és erre számítjuk az áfát.

Hiányos árazásnál csak részösszeg látható; a PDF elkészítéséhez az összes bevont, pozitív mennyiségű tétel árát ki kell tölteni. Az ajánlat legfeljebb 500 sort, soronként 10 000 egységet és díjtípusonként 1 000 000 Ft nettó egységárat kezel.

## Tervmódosítás és frissítés

Az ajánlat az átvételkori mennyiségeket őrzi. Ha a terv anyagkimutatása módosul, figyelmeztetés jelenik meg. A **Mennyiségek frissítése** megerősítés után frissíti a tervből átvett mennyiségeket és leírásokat, megtartva a hozzájuk tartozó egységárakat. A már nem létező tervtételeket kihagyottként őrzi meg; a saját tételeket nem változtatja meg. A hely vagy típus átnevezése új tételként jelenhet meg, ezért frissítés után ellenőrizd az árazást.

A módosítások a tervező Visszavonás gombjával visszavonhatók. Az export pillanatában a jelenleg szerkesztett ajánlat kerül a PDF-be. A nyitott projekt első mentését továbbra is kézzel kell elvégezni.

## Exportjogosultság

A PDF-export jelenleg a meglévő, aktív havi előfizetést ellenőrző szabályt használja. Az első ingyenes és az egyszer megvásárolt projektek előfizetéstől független exportja külön backlog-tétel; ebben a változatban még nem módosult.
