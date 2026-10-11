// A cikkek változásnaplója (docs/tudastar-terv.md 4.4 `changes[]`). Szerkesztőségi adat, nem része a tartalmi ujjlenyomatnak;
// minden tartalmi vagy ábramódosításhoz (új tartalmi vagy ábra-ujjlenyomat, új ellenőrzés) új bejegyzés tartozik. Ha egy tételhez nincs külön bejegyzés,
// az első közzététel sora jelenik meg a vázlat `updated`/`version` mezőjéből.
import type {KbChange,KbMeta} from './types';

const FIRST=(version:string):KbChange=>({date:'2026-10-10',version,kind:'elso-kozzetetel',summary:'Első közzétett változat: szerzői vázlat, független szakmai ellenőrzés (1. kör) és belső kettős ellenőrzés után. Szakmai lektorálásra vár.'});

/** Ábraváltozás (2026-10-11, a független ábra- és felületellenőrzés után): a tartalmi verzió nem változott, az ábra-ujjlenyomat igen. */
const FIG=(kind:'javitas'|'felulvizsgalat',summary:string):readonly KbChange[]=>[{date:'2026-10-11',version:'0.1',kind,summary},FIRST('0.1')];
const A11Y='Ábrák: a képernyőolvasó a szöveges megfelelőt egyszer olvassa fel (a figure leírásaként).';
const MOBILE=' Telefonon nagyobb, görgetés nélkül olvasható feliratok.';

export const KB_CHANGES:Readonly<Record<string,readonly KbChange[]>>={
 'elektromos-aram':FIG('felulvizsgalat',A11Y),
 'elektromos-ellenallas':FIG('felulvizsgalat',A11Y),
 'elektromos-feszultseg':FIG('felulvizsgalat',A11Y+MOBILE),
 'elektromos-teljesitmeny':FIG('felulvizsgalat',A11Y),
 'ohm-torvenye':FIG('felulvizsgalat',A11Y),
 'joule-lenz-torveny':FIG('felulvizsgalat',A11Y+MOBILE),
 'kirchhoff-torvenyei':FIG('javitas','A 2. ábrán a vízforraló feszültségnyila a fogyasztói irányrendszer szerint az áram irányába (az L felől az N felé) mutat, és bekerült az I áramnyíl. '+A11Y+MOBILE),
 'soros-es-parhuzamos-kapcsolas':FIG('javitas','Az 1. ábra párhuzamos paneljén a közös U feszültségnyíl az ágáramok irányába (lefelé) mutat, ugyanúgy, mint a soros panelen. '+A11Y),
 'rovidzarlat-es-tulterheles':FIG('felulvizsgalat','A 2. ábra (időáram-sáv) keskenyebb elrendezést kapott, telefonon is legalább 9–10 px-es feliratokkal. '+A11Y),
 'transzformator-mukodese':FIG('felulvizsgalat',A11Y+MOBILE),
 'fenyforrasok-tipusai':FIG('felulvizsgalat','Az 1. ábra keskeny elrendezést kapott (a felirat a sáv fölött), telefonon nem kell oldalra görgetni. '+A11Y),
 'lumen-es-lux':FIG('felulvizsgalat','Az 1. ábra két panelre bomlik (telefonon egymás alatt), és a távolságvonalak nem húzzák át a feliratokat. '+A11Y),
 'szinhomerseklet':FIG('felulvizsgalat','Az 1. ábra telefonon függőleges skálaként jelenik meg; a széles változaton a „6500” és a „10 000 K” felirat jól elkülönül. '+A11Y),
 'vezetek-es-kabeljelolesek':FIG('felulvizsgalat',A11Y+MOBILE),
 'vezetekek-szinjelolese':FIG('felulvizsgalat',A11Y+MOBILE),
 'ip-vedettseg':[
  {date:'2026-10-11',version:'0.2',kind:'javitas',summary:'A 2. ábra címe „méretarányosan” (korábban „valós méretarányban”), a rajz felirata „Méretarányos rajz”: a képernyőn a rajz nem valós méretű. Az 1. ábra keskenyebb, telefonon is olvasható; a szakmai tartalom nem változott. '+A11Y},
  FIRST('0.1'),
 ],
 'lampafoglalatok-es-lampatalpak':[
  {date:'2026-10-11',version:'0.2',kind:'biztonsagi-javitas',summary:'A szakmai lektor válaszáig kikerült a foglalat bekötésére vonatkozó mondat; helyette: a foglalat bekötése villanyszerelői feladat. A lámpatalp-ábra két panelre bomlik (telefonon egymás alatt), így minden talp látszik. '+A11Y},
  FIRST('0.1'),
 ],
};

export const changesFor=(meta:KbMeta):readonly KbChange[]=>KB_CHANGES[meta.id]??[
 {date:meta.updated,version:meta.version,kind:'elso-kozzetetel',summary:'Első közzétett változat: szerzői vázlat, független szakmai ellenőrzés (1. kör) és belső kettős ellenőrzés után. Szakmai lektorálásra vár.'},
];
export const CHANGE_LABELS:Record<KbChange['kind'],string>={'elso-kozzetetel':'első közzététel',javitas:'javítás',bovites:'bővítés','biztonsagi-javitas':'biztonsági javítás',felulvizsgalat:'felülvizsgálat'};
