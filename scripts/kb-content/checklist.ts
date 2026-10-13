// Mely forrásmegjelölések kiadása vagy pontszáma vár még szakmai ellenőrzésre (a felületen: „kiadás ellenőrzés alatt”).
// Két jel: (1) a lektori kérdéslista (content/tudastar/lektori-kerdesek-elmelet.md) név szerint kéri a kiadás, a honosítási év, a pont-,
// táblázat- vagy mellékletszám ellenőrzését – az alábbi tábla; (2) a vázlat YAML-megjegyzése („# lektor ellenőrizze …”) vagy az érték
// maga jelzi („… ellenőrizendő”). A tábla minden sorát a tests/kb-content.ts a kérdéslista szövegéhez köti (`question` ott szerepel).
// Ha a lektor válaszolt, a sort törölni kell, és a vázlatban a kiadást/pontot javítani – ez a cikk új ujjlenyomatát és újbóli
// ellenőrzését jelenti (docs/tudastar.md).
import type {RawSource} from './parse';

export type ChecklistItem={match:RegExp;question:string;ref:string};
export const CHECKLIST:readonly ChecklistItem[]=[
 {match:/^MSZ EN 50160\b/,question:'MSZ EN 50160',ref:'Alapfogalmak 1'},
 {match:/^MSZ HD 60364-4-41\b/,question:'MSZ HD 60364-4-41',ref:'Alapfogalmak 2'},
 {match:/^127\/1991\./,question:'127/1991. (X. 9.) Korm. rendelet',ref:'Alapfogalmak 5; Világítás és szakszótár 5'},
 {match:/^MSZ EN 60038\b/,question:'MSZ EN 60038',ref:'Alapfogalmak 6; Hálózatok és gépek 3'},
 {match:/^MSZ EN 60228\b/,question:'MSZ EN 60228:2005',ref:'Alapfogalmak 7'},
 {match:/^MSZ HD 60364-5-52\b/,question:'MSZ HD 60364-5-52:2011 pontszámai',ref:'Alapfogalmak 8'},
 {match:/^MSZ EN 60898-1\b/,question:'MSZ EN 60898-1 éve',ref:'Hálózatok és gépek 2–3; Világítás és szakszótár 6'},
 {match:/^IEC 60050-826\b/,question:'IEC 60050-826',ref:'Hálózatok és gépek 3; Világítás és szakszótár 6'},
 {match:/^MSZ EN 60076-1\b/,question:'MSZ EN 60076-1 honosítási éve',ref:'Hálózatok és gépek 3'},
 {match:/^MSZ EN 61558-2-6\b/,question:'MSZ EN 61558-2-6 kiadása',ref:'Hálózatok és gépek 3'},
 {match:/^IEC 60050-131\b/,question:'IEC 60050-131',ref:'Hálózatok és gépek 3'},
 {match:/^MSZ HD 361\b/,question:'MSZ HD 361 S3',ref:'Gyakorlati 6'},
 {match:/^MSZ EN 50525-/,question:'MSZ EN 50525-2-xx',ref:'Gyakorlati 6'},
 {match:/^MSZ HD 603\b/,question:'MSZ HD 603 S1',ref:'Gyakorlati 6'},
 {match:/^MSZ EN 50565\b/,question:'MSZ EN 50565',ref:'Gyakorlati 6'},
 {match:/MSZ EN 13501-6\b/,question:'MSZ EN 13501-6',ref:'Gyakorlati 6'},
 {match:/^IEC 60028\b/,question:'IEC 60028',ref:'Gyakorlati 6'},
 {match:/^MSZ EN 60529\b/,question:'MSZ EN 60529',ref:'Gyakorlati 8; Világítás és szakszótár 6'},
 {match:/^2011\/65\/EU\b/,question:'RoHS 2022-es módosító irányelveinek száma',ref:'Világítás és szakszótár 3'},
 {match:/244\/2009\/EK/,question:'244/2009/EK kivezetési ütemezésének pontos helye',ref:'Világítás és szakszótár 3'},
 {match:/^MSZ EN 12665\b/,question:'MSZ EN 12665',ref:'Világítás és szakszótár 5'},
 {match:/^MSZ EN 12464-1\b/,question:'MSZ EN 12464-1',ref:'Világítás és szakszótár 5'},
 {match:/^IEC 60050-195\b/,question:'IEC 60050-195',ref:'Világítás és szakszótár 6'},
 {match:/^MSZ HD 60364-1(?![\d-])/,question:'MSZ HD 60364-1,',ref:'Világítás és szakszótár 6'},
 {match:/^MSZ EN (IEC )?60445\b/,question:'MSZ EN 60445',ref:'Világítás és szakszótár 6'},
 {match:/^MSZ EN 61008\b/,question:'MSZ EN 61008/61009',ref:'Világítás és szakszótár 6'},
];

/** Az ellenőrzés okai egy forrásnál (üres tömb: nincs nyitott kérdés). */
export function checkReasons(s:RawSource):string[]{
 const out:string[]=[];
 for(const c of CHECKLIST)if(c.match.test(s.standard))out.push('Lektori kérdéslista: '+c.ref);
 for(const note of s.comments)if(/lektor|ellenőriz/i.test(note))out.push('A vázlat megjegyzése – '+note);
 if(/ellenőrizendő/.test(s.kiadas+' '+s.pont))out.push('A vázlat szerint ellenőrizendő.');
 return out;
}
