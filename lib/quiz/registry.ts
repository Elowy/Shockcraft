// A Tesztek szerveroldali regisztere (oldalak, sitemap, keret, tesztek): a kiadási kapu (lib/quiz/gate.ts) kiértékelése a kalkulátorok
// kapujával (lib/calc/registry.ts) együtt, a sablonok ujjlenyomata, a kérdésbank állapota, a kiadás azonosítója és a kliensnek átadható,
// csak közzétett metaadat. A kliensszigetek ezt a modult nem importálják (tests/kb-guards.ts): a böngésző csak a szerver által átadott
// listát kapja, és csak a közzétett sablonok kalkulátorait tölti be (components/quiz/calc-defs.ts).
import type {CalcDef} from '@/lib/calc/core';
import {bySlug,releaseInfo as calcReleaseInfo} from '@/lib/calc/registry';
import {RELEASES,type ReleaseRecord} from '@/lib/calc/release';
import {calcPath} from '@/lib/kb/categories';
import {resolveLink} from '@/lib/kb/content/registry';
import {fingerprint,tablesApproved} from '@/lib/sizing-tables';
import {buildTemplateQuestion,type Question} from './engine';
import {QUIZ_SUSPENDED,TEMPLATE_CHECKS,bankLive,templateState,type TemplateCheck,type TemplateState} from './gate';
import {BANK_MANIFEST} from './release/index';
import {mulberry32,nextSeed} from './rng';
import {TEMPLATES,pickParams,type Template} from './templates';
import {TOPICS,TOPIC_IDS,topicLabel} from './topics';

export {TEMPLATES};
export const QUIZ_PATH='/tudastar/tesztek';

/** Rögzített seedekkel generált mintakérdések – a sablon ujjlenyomatának és a statikus (JS nélküli) mintafeladatnak az alapja. */
export function templateSamples(t:Template,def:CalcDef,count=8):Question[]{
 const out:Question[]=[];
 for(let seed=1;out.length<count&&seed<400;seed++){
  const rng=mulberry32(seed*7919),q=buildTemplateQuestion(t,def,pickParams(t,rng),nextSeed(rng));
  if(q)out.push(q);
 }
 return out;
}
/** Gyorsítótár sablon- és definícióobjektumonként (egy módosított másolat – pl. a tesztek mutációs próbája – saját lenyomatot kap). */
const FP=new WeakMap<Template,WeakMap<CalcDef,string>>();
/** A sablon tartalmi ujjlenyomata: metaadat, hibamodellek és a mintakérdések (szöveg, válaszok, magyarázat, levezetés). A levezetés a
 * kalkulátorból jön, így a kalkulátor kódjának vagy szövegének változása is új ujjlenyomatot ad. */
export function templateFingerprint(t:Template,def:CalcDef=bySlug(t.calc)!):string{
 let byDef=FP.get(t);if(!byDef){byDef=new WeakMap();FP.set(t,byDef)}
 const hit=byDef.get(def);if(hit)return hit;
 const {id,title,short,topic,calc,result,unit,difficulty,version,article}=t;
 const fp=fingerprint({id,title,short,topic,calc,result,unit,difficulty,version,article:article??null,models:t.models.map(m=>[m.id,m.why]),
  samples:templateSamples(t,def).map(q=>({stem:q.stem,choices:q.choices.map(c=>[c.id,c.text,c.why??'']),explanation:q.explanation,steps:q.steps}))});
 byDef.set(def,fp);return fp;
}

export type TemplateInfo={state:TemplateState;fingerprint:string;check?:TemplateCheck;calcState:string;reason:string};
const REASONS:Record<TemplateState,string>={kozzeteve:'',
 'kalkulatorra-var':'A kalkulátor még nem közzétett (T1-nél szakmai lektori jóváhagyás kell).','tablazatra-var':'A táblázatértékek tervezői jóváhagyása folyamatban.',
 'ellenorzesre-var':'Belső ellenőrzésre vár (nincs rekord a lib/quiz/gate.ts TEMPLATE_CHECKS táblájában).','ujraellenorzendo':'A sablon (vagy a kalkulátora) a rögzítés óta megváltozott; újra ellenőrizni kell.',
 felfuggesztve:'Felfüggesztve.'};
/** A sablon kapuja: a kalkulátor kapujából levezetve (T1-nél lektori rekord, táblázatosnál tablesApproved()), plusz a sablon saját rekordja. */
export function templateInfo(t:Template,records:Readonly<Record<string,ReleaseRecord>>=RELEASES,tablesOk=tablesApproved(),checks:Readonly<Record<string,TemplateCheck>>=TEMPLATE_CHECKS,suspended:ReadonlySet<string>=QUIZ_SUSPENDED):TemplateInfo{
 const def=bySlug(t.calc);
 if(!def)return {state:'kalkulatorra-var',fingerprint:'',calcState:'ismeretlen',reason:'Ismeretlen kalkulátor: '+t.calc};
 const calc=calcReleaseInfo(def,records,tablesOk),fp=templateFingerprint(t,def),check=checks[t.id];
 // A kalkulátor „táblázatra vár” állapota (rekord rendben, csak a táblázat-jóváhagyás hiányzik) a sablonnál is táblázatra várást jelent.
 const state=templateState({calcPublished:calc.state==='kozzeteve'||calc.state==='tablazatra-var',tables:!!def.tables,tablesOk,check,fingerprint:fp,suspended:suspended.has(t.id)});
 return {state,fingerprint:fp,...(check?{check}:{}),calcState:calc.state,reason:REASONS[state]};
}
const PUBLISHED:readonly Template[]=TEMPLATES.filter(t=>templateInfo(t).state==='kozzeteve');
export const publishedTemplates=()=>PUBLISHED;
/** Előnézetben (SHOCKCRAFT_KB_PREVIEW=1) minden sablon, amelynek a kalkulátora megépült; élesben csak a közzétettek. */
export const visibleTemplates=(preview=false)=>preview?TEMPLATES.filter(t=>!!bySlug(t.calc)):PUBLISHED;
/** A még nem közzétett sablonok (csak a címük jelenik meg „hamarosan” jelöléssel; kérdés, paraméter vagy link nem). */
export const pendingTemplates=(preview=false)=>TEMPLATES.filter(t=>!visibleTemplates(preview).includes(t));

/** A kérdésbank állapota: a generált manifest és a kapu mostani küszöbei együtt (ha a küszöb azóta szigorodott, a bank nem él). */
export function bankState(){
 const live=BANK_MANIFEST.live&&bankLive(BANK_MANIFEST.topics,TOPIC_IDS);
 return {live,manifest:BANK_MANIFEST,topics:TOPICS.map(t=>({id:t.id,label:t.label,count:BANK_MANIFEST.topics[t.id]??0}))};
}
/** A kiadás azonosítója a tesztkódban: a közzétett sablonok (azonosító, verzió, ujjlenyomat) és – ha él – a kérdésbank kiadása. */
export function quizRelease(preview=false){
 const b=bankState();
 return fingerprint({t:visibleTemplates(preview).map(t=>[t.id,t.version,templateFingerprint(t)]),b:b.live?b.manifest.release:null,p:preview});
}
/** A tesztoldal utolsó érdemi változása (sitemap): a közzétett sablonok ellenőrzési rekordjainak legkésőbbi dátuma. */
export const quizLastModified=()=>PUBLISHED.map(t=>TEMPLATE_CHECKS[t.id]?.date).filter((d):d is string=>!!d).sort().at(-1);
/** A „Tesztek” szekció közzétett tételeinek száma (a fül és a kezdőlapi kártya ettől függ): sablonok + élő bank kérdései. */
export const quizPublishedCount=(preview=false)=>visibleTemplates(preview).length+(bankState().live?BANK_MANIFEST.total:0);

export type QuizTemplateMeta={id:string;version:number;title:string;short:string;topic:string;topicLabel:string;calc:string;calcTitle:string;calcHref:string;article:{href:string;title:string}|null;difficulty:number;draft:boolean};
export function templateMeta(t:Template,preview=false):QuizTemplateMeta{
 const def=bySlug(t.calc)!,link=t.article?resolveLink(t.article.id,t.article.anchor,preview):null;
 return {id:t.id,version:t.version,title:t.title,short:t.short,topic:t.topic,topicLabel:topicLabel(t.topic),calc:t.calc,calcTitle:def.title,calcHref:calcPath(t.calc),
  article:link&&'href' in link?{href:link.href,title:link.title}:null,difficulty:t.difficulty,draft:!PUBLISHED.includes(t)};
}
/** A tesztoldal kliensszigetének adatai: csak közzétett (előnézetben: megépült) sablonok, a kiadás azonosítója, a bank állapota. */
export function quizClientData(preview=false){
 const b=bankState();
 return {release:quizRelease(preview),templates:visibleTemplates(preview).map(t=>templateMeta(t,preview)),
  bank:{live:b.live,topics:b.live?b.topics.filter(t=>t.count>0):[]}};
}
export type QuizClientData=ReturnType<typeof quizClientData>;
/** „Teszteld magad”: a cikkhez kötött közzétett sablonok. */
export const templatesForArticle=(articleId:string,preview=false)=>visibleTemplates(preview).filter(t=>t.article?.id===articleId);
/** A JS nélküli tartalék mintafeladata: az első közzétett sablon első (rögzített seedű) mintakérdése. */
export function staticSample(preview=false):{title:string;q:Question}|null{
 for(const t of visibleTemplates(preview)){const def=bySlug(t.calc),q=def?templateSamples(t,def,1)[0]:undefined;if(q)return {title:t.title,q}}
 return null;
}
/** A tesztoldal linkje előválasztással (a sziget olvassa): ?mod=gyakorlo|vizsga|hibaim, ?feladat=<sablon>,…, ?hossz=5|10|20. */
export const quizHref=(params:{feladat?:readonly string[];mod?:string;hossz?:number}={})=>{
 const q=[...(params.mod?['mod='+params.mod]:[]),...(params.feladat?.length?['feladat='+params.feladat.join(',')]:[]),...(params.hossz?['hossz='+params.hossz]:[])];
 return QUIZ_PATH+(q.length?'?'+q.join('&'):'');
};
