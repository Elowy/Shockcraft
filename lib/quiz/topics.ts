// A Tesztek témakörei (docs/tudastar-terv.md 7. pont) – tiszta adat, kliensen is fut. A sorrend a tesztkód témaköri bitmaszkjának
// alapja (lib/quiz/engine.ts): új témakör csak a lista VÉGÉRE kerülhet, a meglévők sorrendje és azonosítója nem változhat.

export const TOPICS=[
 {id:'alapfogalmak-szamitasok',label:'Alapfogalmak és számítások'},
 {id:'kapcsolasok',label:'Kapcsolások'},
 {id:'vedelmi-eszkozok',label:'Védelmi eszközök'},
 {id:'erintesvedelem',label:'Érintésvédelem'},
 {id:'foldelesi-rendszerek',label:'Földelési rendszerek'},
 {id:'kabelek-vezetekek',label:'Kábelek és vezetékek'},
 {id:'meres',label:'Mérés'},
 {id:'gepek',label:'Villamos gépek'},
 {id:'vilagitas',label:'Világítás'},
 {id:'munkabiztonsag',label:'Munkabiztonság'},
] as const;
export type TopicId=typeof TOPICS[number]['id'];
export const TOPIC_IDS:readonly TopicId[]=TOPICS.map(t=>t.id);
export const isTopic=(x:unknown):x is TopicId=>typeof x==='string'&&(TOPIC_IDS as readonly string[]).includes(x);
export const topicLabel=(id:string)=>TOPICS.find(t=>t.id===id)?.label??id;

/** A minden képernyőn kötelező jelölés (docs/tudastar-terv.md 7. és 8. pont). */
export const QUIZ_NOTICE='Gyakorló teszt – nem hivatalos vizsgakérdések; az eredmény nem igazolás.';
