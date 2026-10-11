// A statikus kérdésbank kiadásának közös logikája (scripts/quiz-release.ts, scripts/quiz-csv.ts és tests/quiz.ts használja; zod itt engedett).
// Forrás: content/tudastar/kerdesek/<tema>.json (a szerző írja; ez a modul csak olvassa). Kimenet: lib/quiz/release/ – manifest.json és
// index.ts mindig; a témaköri fájlok (<tema>.json) CSAK élesedéskor (lib/quiz/gate.ts bankLive: ≥ 150 jóváhagyott kérdés, témakörönként ≥ 10).
// Az azonosítójegyzék (lib/quiz/id-registry.json) csak bővülhet: a jóváhagyott (kiadható) kérdések azonosítója a build-kor kerül bele, és
// onnan soha nem tűnhet el, nem kaphat másik témakört – így a böngészőben tárolt kérdésstatisztika soha nem kerül másik kérdéshez.
// A még lektorálatlan vázlatok azonosítója nem kerül a jegyzékbe (a szerző a lektorálásig átszámozhatja őket), de jegyzékbeli azonosítót
// más témakörben a vázlat sem használhat.
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {CALCULATORS} from '../../lib/calc/registry';
import {KB_ARTICLES,KB_PENDING} from '../../lib/kb/content/generated/articles';
import {KB_BODIES} from '../../lib/kb/content/generated/bodies/index';
import type {KbBlock} from '../../lib/kb/content/types';
import type {BankQuestion} from '../../lib/quiz/engine';
import {BANK_MIN_PER_TOPIC,BANK_MIN_TOTAL,bankLive,type BankManifest} from '../../lib/quiz/gate';
import {approvedQuestion,bankRules,parseBankFile,releasedQuestion,type BankFile,type DraftQuestion} from '../../lib/quiz/schema';
import {TOPIC_IDS,isTopic} from '../../lib/quiz/topics';
import {fingerprint} from '../../lib/sizing-tables';

export const BANK_DIR='content/tudastar/kerdesek';
export const RELEASE_DIR='lib/quiz/release';
export const REGISTRY_FILE='lib/quiz/id-registry.json';

export type Bank={files:BankFile[];errors:string[];ignored:string[]};
/** Egy cikk minden horgonya: a H2-k és H3-ak, az ábrák (abra-N) és a szótári tételek azonosítója (a beágyazott példablokkokban is). */
function blockAnchors(blocks:readonly KbBlock[]):string[]{
 return blocks.flatMap(b=>b.t==='h2'||b.t==='h3'||b.t==='figure'?[b.id]:b.t==='example'?blockAnchors(b.blocks):b.t==='terms'?b.items.map(i=>i.id):[]);
}
/** A cikkek és horgonyaik (a lektorra váró R3 csonknak nincs horgonylistája: null) és a kalkulátorok – a ref/calc ellenőrzéséhez. */
export function knownTargets(){
 const anchorsOf=(id:string,h2:readonly string[])=>[...new Set([...h2,...blockAnchors(KB_BODIES[id]?.blocks??[])])];
 const articles=new Map<string,readonly string[]|null>([...KB_ARTICLES.map(a=>[a.id,anchorsOf(a.id,a.anchors.map(x=>x.id))] as [string,readonly string[]]),...KB_PENDING.map(p=>[p.id,null] as [string,null])]);
 return {articles,calcs:new Set(CALCULATORS.map(c=>c.slug))};
}
/** A forrásfájlok beolvasása és ellenőrzése. Ha a mappa még nincs meg, üres bank (nem hiba). A nem témaköri JSON (pl. profilok.json) kimarad. */
export function loadBank(root:string,dir=BANK_DIR):Bank{
 const base=join(root,dir),files:BankFile[]=[],errors:string[]=[],ignored:string[]=[];
 if(!existsSync(base))return {files,errors,ignored};
 for(const f of readdirSync(base).filter(f=>f.endsWith('.json')).sort()){
  const topic=f.slice(0,-5);
  if(!isTopic(topic)){ignored.push(f);continue}
  let json:unknown;
  try{json=JSON.parse(readFileSync(join(base,f),'utf8'))}catch(e){errors.push(f+': érvénytelen JSON ('+(e as Error).message+')');continue}
  const parsed=parseBankFile(f,topic,json);files.push(parsed);errors.push(...parsed.errors);
 }
 errors.push(...bankRules(files,knownTargets()));
 return {files,errors,ignored};
}
export const allQuestions=(bank:Bank)=>bank.files.flatMap(f=>f.questions);

export type ReleaseModel={approved:Record<string,BankQuestion[]>;counts:Record<string,number>;live:boolean;manifest:BankManifest;files:Record<string,string>};
/** A kiadás: témakörönként a jóváhagyott (és a mostani tartalomra jóváhagyott) kérdések, belső lektori mezők nélkül. A témaköri fájlok csak
 * élesedéskor készülnek el; addig a manifest csak darabszámot tartalmaz, kérdésszöveget nem. */
export function releaseModel(bank:Bank,min=BANK_MIN_TOTAL,per=BANK_MIN_PER_TOPIC):ReleaseModel{
 const approved:Record<string,BankQuestion[]>={},counts:Record<string,number>={};
 for(const t of TOPIC_IDS){
  const qs=allQuestions(bank).filter(q=>q.topic===t&&approvedQuestion(q)).sort((a,b)=>a.id<b.id?-1:1).map(releasedQuestion);
  approved[t]=qs;counts[t]=qs.length;
 }
 const live=bankLive(counts,TOPIC_IDS,min,per),total=Object.values(counts).reduce((s,x)=>s+x,0);
 const manifest:BankManifest={version:1,release:fingerprint(live?approved:{counts}),live,total,topics:counts,minTotal:min,minPerTopic:per};
 const files:Record<string,string>={[RELEASE_DIR+'/manifest.json']:JSON.stringify(manifest,null,1)+'\n',[RELEASE_DIR+'/index.ts']:renderIndex(manifest,live?TOPIC_IDS.filter(t=>counts[t]>0):[])};
 if(live)for(const t of TOPIC_IDS)if(counts[t])files[RELEASE_DIR+'/'+t+'.json']=JSON.stringify(approved[t],null,1)+'\n';
 return {approved,counts,live,manifest,files};
}
function renderIndex(m:BankManifest,topics:readonly string[]){
 return [
  '// GENERÁLT FÁJL – node_modules/.bin/tsx scripts/quiz-release.ts build (a content/tudastar/kerdesek/*.json jóváhagyott kérdéseiből). Kézzel ne szerkeszd.',
  '// A kérdésbank élesedéséig (lib/quiz/gate.ts: legalább '+m.minTotal+' jóváhagyott kérdés, témakörönként legalább '+m.minPerTopic+') témaköri fájl nem készül,',
  '// és a betöltők listája üres: kérdésszöveg így nem kerülhet a build bemeneteibe. Élesedés után a kliens témakörönként, lustán tölti be a kérdéseket.',
  "import type {BankQuestion} from '../engine';",
  "import type {BankManifest} from '../gate';",
  '',
  'export const BANK_MANIFEST:BankManifest='+JSON.stringify(m)+';',
  'export const BANK_LOADERS:Readonly<Record<string,()=>Promise<readonly BankQuestion[]>>>={',
  ...topics.map(t=>" '"+t+"':()=>import('./"+t+".json').then(m=>m.default as unknown as readonly BankQuestion[]),"),
  '};',
  '',
 ].join('\n');
}
/** A lemezen lévő kiadás eltérései a kiszámítottól (a fölösleges témaköri fájl is eltérés). */
export function staleRelease(root:string,files:Record<string,string>):string[]{
 const out:string[]=[];
 for(const [p,c] of Object.entries(files)){const f=join(root,p);if(!existsSync(f)||readFileSync(f,'utf8')!==c)out.push(p)}
 const dir=join(root,RELEASE_DIR);
 if(existsSync(dir))for(const f of readdirSync(dir))if(!files[RELEASE_DIR+'/'+f])out.push(RELEASE_DIR+'/'+f+' (fölösleges)');
 return out;
}

// ---------------------------------------------------------------------------------------------------- Azonosítójegyzék (csak bővülhet)
export type IdRegistry={version:1;ids:Record<string,string>};
export const EMPTY_REGISTRY:IdRegistry={version:1,ids:{}};
export function readRegistry(root:string):IdRegistry{
 const f=join(root,REGISTRY_FILE);if(!existsSync(f))return EMPTY_REGISTRY;
 const j=JSON.parse(readFileSync(f,'utf8'));
 if(!j||j.version!==1||typeof j.ids!=='object')throw new Error(REGISTRY_FILE+': érvénytelen formátum');
 return j as IdRegistry;
}
/** Az új jegyzék: a régi minden bejegyzése változatlanul, plusz a jóváhagyott kérdések új azonosítói. Témakörváltás (vázlatnál is) hiba. */
export function extendRegistry(prev:IdRegistry,questions:readonly DraftQuestion[]):{registry:IdRegistry;errors:string[];added:string[]}{
 const ids:Record<string,string>={...prev.ids},errors:string[]=[],added:string[]=[];
 for(const q of questions){
  const t=ids[q.id];
  if(t!==undefined&&t!==q.topic)errors.push(q.id+': az azonosító korábban a(z) '+t+' témakörhöz tartozott – azonosító nem kaphat új témakört (új azonosítót kell adni).');
  else if(t===undefined&&approvedQuestion(q)){ids[q.id]=q.topic;added.push(q.id)}
 }
 const sorted=Object.fromEntries(Object.entries(ids).sort(([a],[b])=>a<b?-1:1));
 return {registry:{version:1,ids:sorted},errors,added};
}
export const renderRegistry=(r:IdRegistry)=>JSON.stringify(r,null,1)+'\n';
/** „Csak bővülhet”: a régi jegyzék minden azonosítója megvan az újban, ugyanazzal a témakörrel. */
export function registryShrinks(prev:IdRegistry,next:IdRegistry):string[]{
 return Object.entries(prev.ids).filter(([id,t])=>next.ids[id]!==t).map(([id,t])=>id+' ('+t+') '+(next.ids[id]===undefined?'eltűnt':'témakört váltott: '+next.ids[id]));
}
