// A statikus kérdésbank sémája és szabályai (docs/tudastar-terv.md 7. pont) – CSAK teszt- és kiadási időben (scripts/quiz-release.ts,
// scripts/quiz-csv.ts, tests/quiz.ts). zodot használ: a kliensbe és a szerver futásidejű kódjába nem kerülhet (tests/kb-guards.ts).
// Forrás: content/tudastar/kerdesek/<tema>.json – vagy kérdések tömbje, vagy {topic?, version?, note?, questions:[…]}.
// Kiegészítés a tervhez: a még nem lektorált vázlat `source`-a „AI-tervezet”, `review`-ja „lektorra-var” lehet; közzétenni csak
// jóváhagyott kérdést lehet: review = {state:'jovahagyott', qualification, date, approvalRef, fingerprint}, ahol a fingerprint a kérdés
// mostani tartalmi ujjlenyomata (questionFingerprint), a source „saját”, „AI-tervezet, lektorált” vagy „licencelt”, és nincs retired.
import {z} from 'zod';
import {fingerprint} from '../sizing-tables';
import type {BankQuestion} from './engine';
import {QUIZ_NOTICE,TOPIC_IDS,type TopicId} from './topics';

export const SOURCES=['saját','AI-tervezet, lektorált','licencelt','AI-tervezet'] as const;
export const PUBLISHABLE_SOURCES:readonly string[]=['saját','AI-tervezet, lektorált','licencelt'];
export const ID_PATTERN=/^q-[a-z]{2,4}-\d{4}$/;

const text=(max:number)=>z.string().trim().min(1).max(max);
const choiceSchema=z.object({id:z.string().regex(/^[a-z0-9-]{1,20}$/),text:text(300),correct:z.boolean(),why:text(600).optional()}).strict();
export const approvalSchema=z.object({
 state:z.literal('jovahagyott'),qualification:z.string().trim().min(3).max(200),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
 approvalRef:z.string().trim().min(3).max(400),fingerprint:z.string().regex(/^[0-9a-f]{8}$/),
}).strict();
export const questionSchema=z.object({
 id:z.string().regex(ID_PATTERN),version:z.number().int().min(1).max(999),topic:z.enum(TOPIC_IDS as unknown as [TopicId,...TopicId[]]),
 difficulty:z.union([z.literal(1),z.literal(2),z.literal(3)]),type:z.enum(['single','multi','truefalse']),
 stem:text(600),figure:z.object({kind:text(40),id:text(80)}).strict().optional(),
 choices:z.array(choiceSchema).min(2).max(5),explanation:text(1500),
 ref:z.string().regex(/^[a-z0-9-]+#[a-z0-9-]+$/),calc:z.string().regex(/^[a-z0-9-]+$/).optional(),
 shuffle:z.boolean(),family:z.string().regex(/^[a-z0-9-]{2,60}$/).optional(),
 review:z.union([z.literal('lektorra-var'),approvalSchema]),source:z.enum(SOURCES),retired:z.boolean().optional(),
 /** Belső szerzői megjegyzés a lektornak – soha nem kerül a kiadásba. */
 note:text(1000).optional(),
}).strict();
export type DraftQuestion=z.infer<typeof questionSchema>;
export const fileSchema=z.union([z.array(z.unknown()),z.object({topic:z.string().optional(),version:z.number().optional(),note:z.string().optional(),questions:z.array(z.unknown())}).strict()]);

/** Gépi szűrő (docs/tudastar-terv.md 4.5): tiltott kifejezések és idegen gyakorlat. A kötelező „nem hivatalos vizsgakérdések” jelölés kivétel. */
// (A szóközök \s+ alakban: a forrás így maga nem tartalmazza a tiltott kifejezést – a tests/sizing.ts a lib/ szövegét is átnézi.)
export const FORBIDDEN:readonly RegExp[]=[/\bszabványos\b/i,/megfelel\s+a\s+szabványnak/i,/szakmailag\s+ellenőrzött/i,/hivatalos vizsgakérdés/i,/vizsgán ezek jönnek/i,/garantáltan/i,/bárki elvégezheti/i,/csináld magad/i,/\bGFCI\b/,/\b120 ?V\b/,/\b60 ?Hz\b/,/\bNEC\b/,/ring final/i,/fehér nullavezető/i,/ПУЭ/];
export const forbiddenIn=(s:string)=>{const t=s.split(QUIZ_NOTICE).join(' ').replace(/nem hivatalos vizsgakérdés/gi,' ');return FORBIDDEN.filter(re=>re.test(t)).map(re=>re.source)};
/** „Mindegyik” / „egyik sem” típusú válasz: csak rögzített sorrenddel (shuffle: false) megengedett. */
export const ALL_NONE=/\b(mindegyik|egyik sem|egyik fenti sem|mindkettő|az összes fenti|valamennyi fenti)\b/i;
/** Tagadó kérdés (pl. „Melyik állítás nem igaz?”): a tagadószó csupa nagybetűs (NEM) legyen. */
export const NEGATED_LOWER=/^(?:[Mm]elyik|[Mm]elyek|[Mm]ely|[Mm]i|[Mm]it|[Mm]ik|[Hh]ol|[Mm]ikor|[Hh]ány|[Kk]i)\b[^?]*\bnem\b[^?]*\?/;
const sentences=(s:string)=>s.split(/(?<=[.!?…])\s+/).map(x=>x.trim()).filter(x=>/\p{L}/u.test(x)).length;

/** A kérdés tartalmi ujjlenyomata (FNV-1a, a lib/sizing-tables.ts fingerprint()-jével): minden megjelenő és működést befolyásoló mező,
 * a belső lektori mezők (review, source, retired, note) nélkül. A jóváhagyás erre szól; bármely tartalmi változás új ujjlenyomatot ad. */
export function questionFingerprint(q:Pick<DraftQuestion,'id'|'version'|'topic'|'difficulty'|'type'|'stem'|'figure'|'choices'|'explanation'|'ref'|'calc'|'shuffle'|'family'>){
 const {id,version,topic,difficulty,type,stem,figure,choices,explanation,ref,calc,shuffle,family}=q;
 return fingerprint({id,version,topic,difficulty,type,stem,figure:figure??null,choices:choices.map(c=>({id:c.id,text:c.text,correct:c.correct,why:c.why??null})),explanation,ref,calc:calc??null,shuffle,family:family??null});
}

/** Egy kérdés szabályai a sémán túl (terv 7. pont). Üres tömb = rendben. */
export function questionRules(q:DraftQuestion):string[]{
 const e:string[]=[],ok=q.choices.filter(c=>c.correct).length,bad=q.choices.length-ok;
 if(q.type==='single'&&(q.choices.length<3||ok!==1))e.push('egyválasztós: 3–5 válasz, pontosan 1 helyes');
 if(q.type==='multi'&&(q.choices.length<3||ok<2||bad<1))e.push('többválasztós: 3–5 válasz, legalább 2 helyes és legalább 1 hibás');
 if(q.type==='truefalse'&&(q.choices.length!==2||ok!==1))e.push('igaz/hamis: pontosan 2 válasz, 1 helyes');
 if(new Set(q.choices.map(c=>c.id)).size!==q.choices.length)e.push('ismétlődő válaszazonosító');
 if(new Set(q.choices.map(c=>c.text.toLocaleLowerCase('hu'))).size!==q.choices.length)e.push('ismétlődő válaszszöveg');
 if(q.shuffle&&q.choices.some(c=>ALL_NONE.test(c.text)))e.push('„mindegyik”/„egyik sem” típusú válasz csak shuffle: false mellett');
 if(NEGATED_LOWER.test(q.stem))e.push('tagadó kérdésben a tagadószó kiemelve (NEM) álljon');
 if(sentences(q.explanation)<2)e.push('a magyarázat legalább két mondat');
 for(const s of [q.stem,q.explanation,...q.choices.flatMap(c=>[c.text,c.why??''])]){const f=forbiddenIn(s);if(f.length)e.push('tiltott kifejezés: '+f.join(', '))}
 return [...new Set(e)];
}

export type Approval=z.infer<typeof approvalSchema>;
/** Közzétehető-e: jóváhagyott, a jóváhagyás a mostani tartalomra szól, a forrás közzétehető, nincs visszavonva. */
export function approvedQuestion(q:DraftQuestion):boolean{
 return typeof q.review==='object'&&q.review.state==='jovahagyott'&&q.review.fingerprint===questionFingerprint(q)&&PUBLISHABLE_SOURCES.includes(q.source)&&!q.retired;
}
/** A kiadott alak: a belső lektori mezők (review, source, retired, note) nélkül. */
export function releasedQuestion(q:DraftQuestion):BankQuestion{
 const {id,version,topic,difficulty,type,stem,figure,choices,explanation,ref,calc,shuffle,family}=q;
 return {id,version,topic,difficulty,type,stem,...(figure?{figure}:{}),choices:choices.map(c=>({id:c.id,text:c.text,correct:c.correct,...(c.why?{why:c.why}:{})})),explanation,ref,...(calc?{calc}:{}),shuffle,...(family?{family}:{})};
}

export type BankFile={file:string;topic:string;questions:DraftQuestion[];errors:string[]};
/** Egy forrásfájl ellenőrzése: a JSON alakja, a séma, a szabályok és a témakör (= a fájl neve). */
export function parseBankFile(file:string,topic:string,json:unknown):BankFile{
 const errors:string[]=[],questions:DraftQuestion[]=[];
 const shape=fileSchema.safeParse(json);
 if(!shape.success)return {file,topic,questions,errors:[file+': a fájl kérdések tömbje vagy {questions:[…]} objektum legyen']};
 const list=Array.isArray(shape.data)?shape.data:shape.data.questions;
 if(!Array.isArray(shape.data)&&shape.data.topic!==undefined&&shape.data.topic!==topic)errors.push(file+': a topic mező ('+shape.data.topic+') eltér a fájlnévtől');
 list.forEach((raw,i)=>{
  const r=questionSchema.safeParse(raw),label=file+' #'+(i+1)+(raw&&typeof raw==='object'&&'id' in raw?' ('+String((raw as {id:unknown}).id)+')':'');
  if(!r.success){errors.push(label+': '+r.error.issues.slice(0,4).map(x=>(x.path.join('.')||'(gyökér)')+' – '+x.message).join('; '));return}
  if(r.data.topic!==topic)errors.push(label+': a témakör ('+r.data.topic+') eltér a fájlnévtől ('+topic+')');
  for(const m of questionRules(r.data))errors.push(label+': '+m);
  questions.push(r.data);
 });
 return {file,topic,questions,errors};
}
/** A teljes bank keresztszabályai: egyedi azonosító, ismert hivatkozott cikk (és – generált cikknél – horgony), ismert kalkulátor. */
export function bankRules(files:readonly BankFile[],known:{articles:ReadonlyMap<string,readonly string[]|null>;calcs:ReadonlySet<string>}):string[]{
 const e:string[]=[],seen=new Map<string,string>();
 for(const f of files)for(const q of f.questions){
  const prev=seen.get(q.id);if(prev)e.push(q.id+': ismétlődő azonosító ('+prev+', '+f.file+')');else seen.set(q.id,f.file);
  const [art,anchor]=q.ref.split('#');
  if(!known.articles.has(art))e.push(q.id+': ismeretlen cikk a ref-ben: '+art);
  else{const anchors=known.articles.get(art);if(anchors&&!anchors.includes(anchor))e.push(q.id+': ismeretlen horgony a ref-ben: '+q.ref)}
  if(q.calc&&!known.calcs.has(q.calc))e.push(q.id+': ismeretlen kalkulátor: '+q.calc);
 }
 return e;
}
