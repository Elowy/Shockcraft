// Az összes számolós sablon a tesztkód rögzített sorrendjében (lib/quiz/code.ts TEMPLATE_IDS) – a szerveren (regiszter, oldalak,
// sitemap) és a tesztekben. A böngésző ezt NEM importálja: a T0-sablonokat közvetlenül (lib/quiz/templates.ts), a T1-sablonokat
// (lib/quiz/templates-t1.ts) csak lustán, ha a szerver közzétettként adja át valamelyiket (components/quiz/quiz-runner.tsx; tests/kb-guards.ts).
import {TEMPLATE_IDS} from './code';
import {T0_TEMPLATES,type Template} from './templates';
import {T1_TEMPLATES} from './templates-t1';

const BY_ID=new Map([...T0_TEMPLATES,...T1_TEMPLATES].map(t=>[t.id,t]));
/** A sablonok a tesztkód sorrendjében (új sablon csak a lista VÉGÉRE kerülhet; tests/quiz.ts: minden azonosítóhoz pontosan egy sablon). */
export const TEMPLATES:readonly Template[]=TEMPLATE_IDS.map(id=>BY_ID.get(id)).filter((t):t is Template=>!!t);
export const templateById=(id:string)=>BY_ID.get(id);
