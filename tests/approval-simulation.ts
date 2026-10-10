// Szimulált jóváhagyás: a tesztsor a JÓVÁHAGYOTT állapotra is zöld-e – a valódi jóváhagyás rögzítése előtt.
// A gyermekfolyamatokban egy betöltési horog (module.register) a lib/sizing-tables.ts SIZING_REVIEW-ját jóváhagyottra, a
// lib/calc/release.ts RELEASES-ét két T1 lektori rekorddal bővítve tölti be – a lemezen lévő fájlok NEM változnak. Így a
// docs/lektoralas.md 4.1/3. és 4.2/3. lépése („tesztet nem kell átírni”) jóváhagyás előtt is igazolt.
// A tests/lektori-csomag.ts nincs a sorban: a generált csomag a jóváhagyási állapotot is mutatja, ezért jóváhagyás után újra kell generálni.
// Futtatás: node --no-warnings --import tsx tests/approval-simulation.ts
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {REVIEW_TEXTS,SIZING_REVIEW,reviewText,tablesApproved,tablesFingerprint,type SizingReview} from '../lib/sizing-tables';
import {bySlug,calcFingerprint,calcMeta,releaseInfo} from '../lib/calc/registry';
import {RELEASES,type ExpertReview} from '../lib/calc/release';
import {sourceFingerprint} from '../scripts/calc-source';

const SIM_SLUGS=['feszultseges','keresztmetszet'] as const;
type Variant={name:string;named:boolean};

// ---------------------------------------------------------------- Gyermekfolyamat: a szimulált állapot ellenőrzése
if(process.argv.includes('--child')){
 const named=process.argv.includes('--named');
 assert.equal(SIZING_REVIEW.status,'jóváhagyott','a horog betöltötte a szimulált jóváhagyást');
 assert.ok(tablesApproved(),'a szimulált jóváhagyás érvényes (aktuális ujjlenyomat)');
 assert.ok(reviewText().startsWith((named?REVIEW_TEXTS.named:REVIEW_TEXTS.anonymous).split('{')[0]));
 assert.equal(reviewText().includes('Szimulált Lektor'),named,'a név csak hozzájárulással jelenik meg');
 for(const slug of SIM_SLUGS){
  const d=bySlug(slug)!,info=releaseInfo(d);
  assert.equal(info.state,'kozzeteve',slug+': lektori rekorddal és jóváhagyott táblázatokkal közzétett ('+info.reason+')');
  assert.equal(info.badge.includes('Szimulált Lektor'),named,slug+': a jelvényen a név csak hozzájárulással');
  assert.ok(!calcMeta(d).note.includes('Szimulált Lektor'),slug+': a kalkulátorlista jelvénye név nélküli');
 }
 console.log('child ok');
 process.exit(0);
}

// ---------------------------------------------------------------- Szülő: horog előállítása és a tesztsor futtatása
const fp=tablesFingerprint();
assert.equal(tablesApproved(),SIZING_REVIEW.status==='jóváhagyott','a lemezen lévő állapot');
const review=(named:boolean):SizingReview=>({status:'jóváhagyott',qualification:'épületvillamossági tervező (szimuláció)',date:'2026-11-01',fingerprint:fp,
 approvalRef:'Szimulált jóváhagyás (tests/approval-simulation.ts) – nem valódi',showName:named,reviewer:named?'Szimulált Lektor':'',registry:named?'SZ-0000':'',note:'Szimuláció.'});
const record=(slug:string,named:boolean):ExpertReview=>{const d=bySlug(slug)!;return {kind:'lektoralt',qualification:'épületvillamossági tervező (szimuláció)',date:'2026-11-01',fingerprint:calcFingerprint(d),source:sourceFingerprint(slug),approvalRef:'Szimulált jóváhagyás – nem valódi',showName:named,...(named?{reviewer:'Szimulált Lektor',registry:'SZ-0000'}:{})}};
for(const slug of SIM_SLUGS)assert.ok(!RELEASES[slug],slug+': már van valódi rekordja – a szimulációt más kalkulátorral kell futtatni');

/** A horog: a két forrásfájl szövegét betöltéskor cseréli (a tsx a módosított TS-forrást fordítja). */
function hookSource(v:Variant):string{
 const rules=[
  {suffix:'/lib/sizing-tables.ts',pattern:'export const SIZING_REVIEW:SizingReview=\\{[\\s\\S]*?\\};\\n',replace:'export const SIZING_REVIEW:SizingReview='+JSON.stringify(review(v.named))+';\n'},
  {suffix:'/lib/calc/release.ts',pattern:'(export const RELEASES:Readonly<Record<string,ReleaseRecord>>=\\{)',replace:'$1\n'+SIM_SLUGS.map(s=>`'${s}':${JSON.stringify(record(s,v.named))},`).join('\n')},
 ];
 return `const RULES=${JSON.stringify(rules)};
export async function load(url,context,next){
 const r=await next(url,context);
 const rule=RULES.find(x=>url.split('?')[0].endsWith(x.suffix));
 if(!rule||r.source==null)return r;
 const src=String(r.source),out=src.replace(new RegExp(rule.pattern),rule.replace);
 if(out===src)throw new Error('approval-simulation: a csere nem talált: '+rule.suffix);
 return {...r,source:out};
}
`;
}

const dir=mkdtempSync(join(tmpdir(),'villanyrajz-approval-'));
const TESTS=['tests/sizing-tables.ts','tests/sizing.ts','tests/calc.ts','tests/calc-golden.ts','tests/kb-guards.ts'];
const variants:Variant[]=[{name:'név nélkül',named:false},{name:'névvel (hozzájárulással)',named:true}];
try{
 for(const v of variants){
  const hook=join(dir,(v.named?'named':'anonymous')+'-hooks.mjs'),reg=join(dir,(v.named?'named':'anonymous')+'-register.mjs');
  writeFileSync(hook,hookSource(v));
  writeFileSync(reg,`import {register} from 'node:module';register(${JSON.stringify(pathToFileURL(hook).href)});`);
  // A horog a tsx ELŐTT regisztrálódik, így a tsx a módosított forrást kapja (a később regisztrált horog fut előbb, és ezt hívja tovább).
  const run=(args:string[])=>spawnSync(process.execPath,['--no-warnings','--import',pathToFileURL(reg).href,'--import','tsx',...args],{encoding:'utf8',env:{...process.env},timeout:170000});
  const child=run(['tests/approval-simulation.ts','--child',...(v.named?['--named']:[])]);
  assert.equal(child.status,0,`szimuláció (${v.name}): az állapot ellenőrzése elbukott\n${child.stdout}\n${child.stderr}`);
  for(const t of v.named?['tests/sizing-tables.ts','tests/calc.ts']:TESTS){
   const r=run([t]);
   assert.equal(r.status,0,`szimulált jóváhagyás (${v.name}): ${t} elbukik a jóváhagyott állapotban – a teszt elvárását a SIZING_REVIEW-ból / RELEASES-ből kell levezetni\n${r.stdout.slice(-2000)}\n${r.stderr.slice(-3000)}`);
  }
 }
}finally{rmSync(dir,{recursive:true,force:true})}

console.log(`PASS: szimulált jóváhagyás – a SIZING_REVIEW jóváhagyottként (név nélkül és névvel), ${SIM_SLUGS.join(', ')} lektori rekorddal: ${TESTS.join(', ')} zöld; a lemezen lévő fájlok változatlanok.`);
