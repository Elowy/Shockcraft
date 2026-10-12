// A bekötési ábrák szimulátora (lib/kb/circuit.ts, a Python-referencia sim.py TypeScript-átirata) által MINDEN kapcsolóállásban ellenőrzött
// biztonsági szabályok magyar szövege: a lektori csomag 4. része („Biztonsági szabályok” blokk) ezt a táblát hozza, hogy a lektor a
// szabályokat – amelyek az ábra helyességének gépi alapját adják – jóváhagyhassa vagy kifogásolhassa. Tiszta adat; a tests/kb-circuit.ts
// egyezteti a circuit.ts által használt kódokkal (új szabály nem kerülhet be a táblába írása nélkül, és fordítva).
export type RuleScope='állás'|'földelés'|'szerkezet';
export type CircuitRule={code:string;scope:RuleScope;title:string;text:string;applies:string};

const ALL='minden ábra',PROT='dugalj-, kismegszakító- és FI-relé ábrák',EARTH='földelési rendszerek és EPH ábrák';

/** Állásonként ellenőrzött szabályok (I), a földelési rendszerek szerkezeti szabályai (E) és a szerkezeti ellenőrzés (S). */
export const CIRCUIT_RULES:readonly CircuitRule[]=[
 {code:'I1',scope:'állás',title:'Nincs zárlat',applies:ALL,text:'Egyetlen kapcsolóállásban sem kerülhet egy hálózatra két különböző szerepű forráskapocs (fázis és nulla, két fázis); a védelmi ábrákon a talaj (föld) sem a fázis- vagy a nullavezetővel.'},
 {code:'I2',scope:'állás',title:'A védővezető folytonos',applies:ALL,text:'Minden PE-kapocs a betáp védővezetőjén (PE-hálózaton) van; az I. osztályú (fémházas) fogyasztónak és a védőérintkezős dugaljnak pontosan egy PE-kapcsa van.'},
 {code:'I3',scope:'állás',title:'A védővezetőt semmi nem bonthatja',applies:ALL,text:'Kapcsoló vagy más kapcsolókészülék nem bonthatja a védővezetőt; védővezető csak PE szerepű kapocshoz csatlakozhat, és a PE-hálózaton csak PE szerepű kapocs lehet.'},
 {code:'I4',scope:'állás',title:'A kapcsoló a fázist bontja',applies:ALL,text:'Kikapcsolt állásban a lámpa (és a feszültségmentesnek jelzett dugalj) egyik kapcsa sem lehet fázis alatt: a kapcsoló a fázisvezetőt bontja, nem a nullát.'},
 {code:'I5',scope:'állás',title:'Polaritás',applies:ALL,text:'Fázis szerepű kötés nem kerülhet a nullavezetőre, nulla szerepű fázisra; a lámpa L kapcsa nem lehet a nullán, az N kapcsa nem lehet fázison (felcserélt polaritás).'},
 {code:'I6',scope:'állás',title:'A nullavezetőt nem bontja egypólusú készülék',applies:ALL,text:'A nullavezető nem haladhat át egypólusú kapcsolón vagy egypólusú védőkészüléken; csak többpólusú készülék bonthatja, amely a fázissal együtt bont.'},
 {code:'I7',scope:'állás',title:'A nullavezető folytonos',applies:ALL,text:'A fogyasztó nullakapcsa a nullavezetőn van, és a nullavezető kötése folytonos; az „összes pólust bontó” kapcsolónál kikapcsolt állásban a fázis és a nulla is bontott.'},
 {code:'I8',scope:'állás',title:'Az érszín a szerephez illik',applies:ALL,text:'A vezető színe a szerepének megfelel: a fázisvezető barna, fekete vagy szürke, a nullavezető kék, a védővezető zöld-sárga (a PEN-vezető zöld-sárga vagy kék); ismeretlen szín nem megengedett.'},
 {code:'I9',scope:'állás',title:'A vezető és a kapocs szerepe egyezik',applies:ALL,text:'A vezető fajtája (fázis, nulla, védő) megegyezik a két végén lévő kapocs szerepével; az eltérés a védővezetőnél I3, a nullavezetőnél I6 szabálysértés is.'},
 {code:'I10',scope:'állás',title:'Az igazságtábla egyezik a szimulációval',applies:ALL,text:'A kapcsolóállás-táblázat minden sora (a kapcsolók és hibahelyzetek minden kombinációja, minden fogyasztó, dugalj, védelem) azonos a szimuláció eredményével; hiányzó vagy többlet sor nincs.'},
 {code:'I11',scope:'állás',title:'Hibátlan üzemben a FI-relé nem old ki',applies:PROT,text:'Normál (hibamentes) üzemben nem folyik különbözeti áram, vagyis a FI-relé nem old ki.'},
 {code:'I12',scope:'állás',title:'A FI-relé nem kerülhető meg',applies:PROT,text:'A FI-relé védett oldala a pólusok megkerülésével nem lehet összeköttetésben a táp oldallal (az áramkör nem „kerüli meg” a FI-relét).'},
 {code:'I14',scope:'állás',title:'Külön áramkörök nulla- és fázisvezetője',applies:ALL,text:'Két külön áramkör nullavezetője nem köthető össze; a lámpa fázis- és nullavezetője ugyanabból az áramkörből jön.'},
 {code:'I15',scope:'állás',title:'Minden dugalj és fogyasztó kismegszakító mögött van',applies:PROT,text:'A dugalj és a fogyasztó fázisa kismegszakító (túláramvédelem) nélkül nem kaphat feszültséget.'},
 {code:'I16',scope:'állás',title:'Minden dugalj FI-relé mögött van',applies:PROT,text:'A dugalj fázisa és nullája is a FI-relé védett oldalán van.'},
 {code:'I17',scope:'állás',title:'A próbagomb működik',applies:PROT,text:'A FI-relé próbagombjának van megnyomott állása bekapcsolt FI-relé mellett, és megnyomására a FI-relé kiold.'},
 {code:'E1',scope:'földelés',title:'A földelési rendszer szerkezete',applies:EARTH,text:'A rendszernek (TN-C, TN-S, TN-C-S, TT, IT) megfelelő szerkezet: a csillagpont földelése (IT-nél földeletlen), a PEN/N/PE vezetők szétválasztása TN-C-S-ben pontosan egy helyen, a szétválasztás után nincs újra-összekötés és PEN, a fémházak a rendszerhez illő módon kötöttek (TN: vezetőn át a csillagponthoz; TT és IT: helyi földelőn).'},
 {code:'E2',scope:'földelés',title:'Kapcsolók és védelmek',applies:EARTH,text:'Kapcsolókészülék nem bonthatja a védővezetőt vagy a PEN-t; a túláramvédelem csak fázisvezetőt bonthat; a PEN és a PE nem haladhat át az áram-védőkapcsolón; egy pólus két kapcsa azonos szerepű.'},
 {code:'E3',scope:'földelés',title:'Fémházas fogyasztó védővezetője',applies:EARTH,text:'Az I. osztályú (fémházas) fogyasztónak van védővezető-kapcsa, amely a rendszer szerint csatlakozik.'},
 {code:'E4',scope:'földelés',title:'Vezetőkkel nincs zárlat',applies:EARTH,text:'A jelképes hibahely és érintési pont nélkül, csak a szerelt vezetőkkel sehol nincs zárlat (fázis egy hálózaton más szerepűvel vagy a talajjal).'},
 {code:'E5',scope:'földelés',title:'Az első állás a hibamentes üzem',applies:EARTH,text:'A hibahely és az érintés első (alap-) állapota „nincs”: a táblázat a hibamentes üzemből indul.'},
 {code:'E6',scope:'földelés',title:'Vezetők és színek a földelési ábrán',applies:EARTH,text:'A vezető fajtája és színe az összekötött kapcsok szerepéhez illik; a földelővezető egyik vége földelőkapocs, a másik PE- vagy PEN-kapocs; az EPH-vezető idegen vezetőképes részt köt a PE-hez.'},
 {code:'E7',scope:'földelés',title:'A FI-relé a földelési ábrán sem kerülhető meg',applies:EARTH,text:'A FI-relé védett oldala a pólusok megkerülésével nem érintkezhet a táp oldallal vagy a talajjal.'},
 {code:'S',scope:'szerkezet',title:'Szerkezeti (formai) ellenőrzések (S0–S9)',applies:ALL,text:'A bemenet formai és modellszerű helyessége: a komponens-, kapocs-, vezeték- és szakaszazonosítók egyediek; a kapocsszerepek és vezetőfajták ismertek; minden vezeték mindkét vége létezik; a szakaszok, az állapotok és a szakadások hibátlanok; a kapcsolókészülékek modellje (kismegszakító, FI-relé pólusai, nyomógomb, többállású választó) érvényes. Szakmai kérdés nincs bennük.'},
];
/** A szabálykódok, amelyeket a circuit.ts használ (a tests/kb-circuit.ts ezzel veti össze a táblát; az S0–S9 egy sorba vonva). */
export const RULE_CODES=CIRCUIT_RULES.map(r=>r.code);
