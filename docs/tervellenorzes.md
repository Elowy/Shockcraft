# Tervellenőrzés

Az **Eszközök → Tervellenőrzés** nézet a teljes projekt alaprajzi adatait és az elosztó készülékeinek áramkör-hozzárendelését vizsgálja. Épületre és találattípusra szűrhető. Egy találatra kattintva megnyílik az érintett alaprajz vagy elosztó, és kijelölődik az elem.

**Hiányzó adatok:** áramkör nélküli dugalj, kapcsoló vagy lámpakiállás; üres kábeljelölés az alaprajzi nyomvonalon; a méretezési segédszámítás szerint „nem számítható” áramkör (például hossz vagy értelmezhető kábeljelölés nélkül).

**Átnézendő tételek:** kapcsolt nyomvonal nélküli erősáramú szerelvény; szabad nyomvonalvég; azonos nevű szerelvények egy szinten; áramkör nélküli kismegszakító vagy RCBO; a méretezési segédszámítás szerint „nem felel meg” áramkör. Ezek szándékos állapotok is lehetnek, például tartalék készülék vagy még ki nem dolgozott nyomvonal.

A nyomvonal-kapcsolatot a megadott kezdő és végső szerelvény alapján ellenőrzi. A geometriai érintkezés vagy keresztezés önmagában nem tekinthető bekötésnek. Az RJ45- és telefonaljzatokat, kötődobozokat és elosztójeleket nem jelzi áramkör nélküli erősáramú fogyasztóként.

A lista a tervből újraszámítódik. A javítás után újra megnyitva már az aktuális adatok látszanak. Semmit nem módosít automatikusan. Havi előfizetés nélkül is használható egy hozzáférhető projektben. Az exportálási jogosultságokat nem módosítja.

Ez adatellenőrzés, nem villamos méretezés vagy szabványossági minősítés. Az adatellenőrzés maga nem vizsgálja a vezetékek terhelhetőségét, a védelmi készülékek megfelelőségét, illetve az összes lehetséges kapcsolási hibát. A Méretezés fül segédszámításának „nem felel meg” és „nem számítható” áramkörei viszont megjelennek a listában (tervezői ellenőrzést segítő számítás, nem szabványossági minősítés; a figyelmeztetések nem). A találatmentes lista nem jelent kész vagy jóváhagyott villamos tervet.
