// Figyelmeztetés-könyvtár (verziózott). Az `alap` szöveg a terv 8. pontja szerinti; a többi a kalkulátorokhoz tartozik.
// A szövegek szakmai és jogi jóváhagyásra várnak (docs/tudastar-terv.md 8. pont); R2/R3 tartalom csak a jóváhagyás után kerülhet ki.
import type {SafetyId} from '@/lib/calc/core';

export const SAFETY_VERSION=1;
export const SAFETY:Record<SafetyId,{title:string;text:string;closable:false}>={
 alap:{title:'Fontos',closable:false,text:'Tájékoztató szakmai ismeretanyag. Nem helyettesíti a hatályos szabványokat, az elosztói engedélyes előírásait, a gyártói utasításokat és a szakember helyszíni döntését. Villamos szerelést csak szakképzett személy végezhet; a mérőhelyi és csatlakozási munkákra az elosztói engedélyes szabályai vonatkoznak.'},
 kalkulator:{title:'A számításról',closable:false,text:'A kalkulátor a megadott adatokból, a feltüntetett képletekkel és feltételezésekkel számol. Az eredmény tájékoztató: kivitelezési vagy beszerzési döntés előtt szakember ellenőrizze.'},
 meretezes:{title:'Figyelem: szabványhoz kötött számítás',closable:false,text:'Nem tervezői méretezés, szabványossági igazolás vagy szakvélemény. A táblázatértékeket, a feltételezéseket és az eredményt jogosult villamos tervezőnek kell ellenőriznie; a kész berendezés megfelelőségét méréssel kell igazolni.'},
 beavatkozas:{title:'Csak szakember',closable:false,text:'Az eredmény alapján végzett szerelést, bekötést vagy beállítást csak szakképzett villanyszerelő végezheti, feszültségmentesítés után.'},
};
