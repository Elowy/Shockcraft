// Figyelmeztetés-könyvtár (verziózott). Az `alap` szöveg a terv 8. pontja szerinti; a többi a kalkulátorokhoz tartozik.
// A szövegek szakmai és jogi jóváhagyásra várnak (docs/tudastar-terv.md 8. pont). A kiadási szabály (docs/tudastar.md „Eltérések”):
// R3 tartalom csak szakmai lektor (és második olvasó) jóváhagyásával, a figyelmeztetés-könyvtár jóváhagyása után kerülhet ki. Az R1/R2
// tételek a mérvadó docs/tudastar-dontesek.md szerint belső kettős ellenőrzéssel jelennek meg (a döntés példái között az R2-es IP-kód és
// színjelölés is szerepel), a terv 8.1 pontjától eltérően a könyvtár jogi jóváhagyása előtt; ennek kifejezett tulajdonosi megerősítése
// nyitott (docs/BACKLOG.md). Ha a tulajdonos nem erősíti meg, a döntésben név szerint nem szereplő R2 tételek rekordját a lib/kb/release.ts-ből
// ki kell venni (rövidzárlat, kábeljelölés, lámpafoglalat, szakszótár).
import type {SafetyId} from '@/lib/calc/core';

export const SAFETY_VERSION=1;
/** A kalkulátoroké mellett a Tudástár saját figyelmeztetései (a lib/calc/core.ts SafetyId-ja a kalkulátorok forrás-ujjlenyomatának része, ezért nem bővül).
 * A `bekotes` és a `munkavegzes` az R3 cikkek nem zárható felső veszély-dobozának kötelező minimuma (docs/tudastar-terv.md 8.1): a vázlat
 * „> **Veszély – …**” doboza tartalmazza a mondataikat (a generátor ellenőrzi: scripts/kb-content/generate.ts checkR3). R3 tartalom
 * csak e szövegek szakmai és jogi jóváhagyása után jelenhet meg. */
export type KbSafetyId=SafetyId|'teszt'|'bekotes'|'munkavegzes';
export const SAFETY:Record<KbSafetyId,{title:string;text:string;closable:false}>={
 alap:{title:'Fontos',closable:false,text:'Tájékoztató szakmai ismeretanyag. Nem helyettesíti a hatályos szabványokat, az elosztói engedélyes előírásait, a gyártói utasításokat és a szakember helyszíni döntését. Villamos szerelést csak szakképzett személy végezhet; a mérőhelyi és csatlakozási munkákra az elosztói engedélyes szabályai vonatkoznak.'},
 kalkulator:{title:'A számításról',closable:false,text:'A kalkulátor a megadott adatokból, a feltüntetett képletekkel és feltételezésekkel számol. Az eredmény tájékoztató: kivitelezési vagy beszerzési döntés előtt szakember ellenőrizze.'},
 meretezes:{title:'Figyelem: szabványhoz kötött számítás',closable:false,text:'Nem tervezői méretezés, szabványossági igazolás vagy szakvélemény. A táblázatértékeket, a feltételezéseket és az eredményt jogosult villamos tervezőnek kell ellenőriznie; a kész berendezés megfelelőségét méréssel kell igazolni.'},
 teszt:{title:'A tesztekről',closable:false,text:'Gyakorló teszt – nem hivatalos vizsgakérdések; az eredmény nem igazolás. A feladatok a Tudástár belsőleg ellenőrzött kalkulátoraira épülnek; a gyakorlás nem helyettesíti a szakmai képzést, a hatályos előírásokat és a gyakorlati tapasztalatot.'},
 beavatkozas:{title:'Csak szakember',closable:false,text:'Az eredmény alapján végzett szerelést, bekötést vagy beállítást csak szakképzett villanyszerelő végezheti, feszültségmentesítés után.'},
 bekotes:{title:'Életveszély',closable:false,text:'áramütés- és tűzveszély. A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne szereld, hívj szakembert.'},
 munkavegzes:{title:'Életveszély',closable:false,text:'áramütés-, ív- és tűzveszély. A leírás szakembernek szól. Ha nem vagy villanyszerelő, ne dolgozz villamos berendezésen, hívj szakembert.'},
};
