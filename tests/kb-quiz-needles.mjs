// A statikus kérdésbank (content/tudastar/kerdesek/<témakör>.json) KIADATLAN kérdéseinek szövegmintái: a kérdés szövege, a legalább
// 30 karakteres válaszlehetőségek, az indoklások és a magyarázat legalább 50 karakteres mondatai. Kiadatlan minden kérdés, amely nincs a
// lib/quiz/release/<témakör>.json kiadásban (a bank élesedéséig, lib/quiz/gate.ts: ≥ 150 jóváhagyott kérdés, témakörönként ≥ 10, ez az
// összes). A tests/kb-dist.mjs a build kimenetét, a tests/kb-routes.mjs a kiszolgált HTML-t nézi végig ezekkel: a lektorálatlan
// kérdések szövege sehol nem jelenhet meg. A közzétett tartalomban (Elmélet-vázlatok, kalkulátordefiníciók, számolós sablonok) is
// szereplő minták kimaradnak (a szerző egy cikkmondatot átvehet a magyarázatba – az nem szivárgás; az összevetés a vázlat jelölései nélkül).
// Ha a mappa még nincs meg (a kérdésszerző még nem adta le), üres a lista.
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';

const list=(dir,re)=>existsSync(dir)?readdirSync(dir).filter(f=>re.test(f)).sort().map(f=>join(dir,f)):[];
const questionsOf=(json)=>Array.isArray(json)?json:Array.isArray(json?.questions)?json.questions:[];

/** @returns {{id:string,topic:string,stem:string}[]} a forrás kiadatlan kérdései */
export function unreleasedQuestions(root='.'){
 const released=new Set();
 for(const f of list(join(root,'lib/quiz/release'),/^[a-z-]+\.json$/))if(!f.endsWith('manifest.json'))for(const q of questionsOf(JSON.parse(readFileSync(f,'utf8'))))released.add(q.id);
 const out=[];
 for(const f of list(join(root,'content/tudastar/kerdesek'),/\.json$/)){
  let json;try{json=JSON.parse(readFileSync(f,'utf8'))}catch{continue}
  for(const q of questionsOf(json))if(q&&typeof q.id==='string'&&!released.has(q.id))out.push(q);
 }
 return out;
}

/** @returns {string[]} a kiadatlan kérdések szövegmintái (legfeljebb 120 karakteres részletek) */
export function quizNeedles(root='.'){
 const out=new Set(),add=(s,min)=>{if(typeof s==='string'){const t=s.replace(/\s+/g,' ').trim();if(t.length>=min)out.add(t.slice(0,120))}};
 for(const q of unreleasedQuestions(root)){
  add(q.stem,25);
  for(const c of Array.isArray(q.choices)?q.choices:[]){add(c?.text,30);add(c?.why,40)}
  for(const s of String(q.explanation??'').split(/(?<=[.!?])\s+/))add(s,50);
 }
 // Összevetés jelölés nélkül: a vázlat kiemelése (_…_, **…**), a belső link ([[id|szöveg]]) és az alsó index (P_felvett) nem számít.
 const plain=(t)=>t.replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g,'$1').replace(/[*_`]/g,'').replace(/\s+/g,' ');
 const own=plain([...list(join(root,'content/tudastar/elmelet'),/\.md$/),...list(join(root,'lib/calc/defs'),/\.ts$/),join(root,'lib/quiz/templates.ts')]
  .filter(existsSync).map(f=>readFileSync(f,'utf8')).join('\n'));
 return [...out].filter(n=>!own.includes(plain(n)));
}
