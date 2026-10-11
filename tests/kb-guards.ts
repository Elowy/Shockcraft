// Statikus őrök a kézikönyv (Tudástár/Kalkulátorok) kódjára (docs/tudastar-terv.md 3.8, 10.6):
// importgráf-tiltólista (db, auth, billing, pdf, lib/plan futásidőben, lib/sizing.ts, zod, next/headers, a content/ forrásvázlatok és a scripts/
// generátor …), nincs getAccount/cookies/headers/fetch, a kliensszigetek nem húzzák be a Tudástár cikktörzseit, regiszterét és parserét,
// dangerouslySetInnerHTML csak a JSON-LD-ben és a téma-indítóban, a tervező csak a lib/kb/links.ts-t importálja, fejlécek, kulcsok.
// Futtatás: node_modules/.bin/tsx tests/kb-guards.ts
import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {dirname,join,relative,resolve} from 'node:path';

const ROOT=resolve('.');
const KB_SEARCH_MODULE='lib/kb/content/generated/search.ts';
const walk=(dir:string):string[]=>readdirSync(dir).flatMap(f=>{const p=join(dir,f);return statSync(p).isDirectory()?walk(p):/\.(ts|tsx)$/.test(f)?[p]:[]});
const rel=(p:string)=>relative(ROOT,p).split('\\').join('/');
// Az app/layout.tsx a kalkulátoroldalak szülő-layoutja: ha cookies()/headers()-t hívna, minden kalkulátoroldal dinamikussá válna.
// A Tesztek: a sziget (components/quiz) és a lib/quiz futásidejű modulja; a lib/quiz/schema.ts (zod) csak szkript és teszt, ezért nem gyökér.
const ROOTS=[...walk('app/(kezikonyv)'),...walk('components/kezikonyv'),...walk('components/calc'),...walk('components/quiz'),...walk('lib/calc'),...walk('lib/kb'),...walk('lib/quiz').filter(f=>!f.endsWith('lib/quiz/schema.ts')),'app/layout.tsx','app/sitemap.ts','app/robots.ts','lib/site-origin.ts','lib/sizing-formulas.ts','components/home-page.tsx','components/public-shell.tsx'].map(p=>resolve(p));
assert.ok(ROOTS.length>60,'a gyökérfájlok megvannak ('+ROOTS.length+')');

type Imp={spec:string;typeOnly:boolean};
function imports(file:string,dynamic=true):Imp[]{
 const src=readFileSync(file,'utf8'),out:Imp[]=[];
 for(const m of src.matchAll(/(?:^|[;\n])\s*(import|export)\s+(type\s+)?([^;'"]*?)\s*from\s*['"]([^'"]+)['"]/g)){
  const clause=m[3]??'';const allTyped=!!m[2]||/^\{\s*(?:type\s+\w+\s*(?:as\s+\w+\s*)?,?\s*)+\}$/.test(clause.trim());
  out.push({spec:m[4],typeOnly:allTyped});
 }
 for(const m of src.matchAll(/(?:^|[;\n])\s*import\s*['"]([^'"]+)['"]/g))out.push({spec:m[1],typeOnly:false});
 if(dynamic)for(const m of src.matchAll(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/g))out.push({spec:m[1],typeOnly:false});
 for(const m of src.matchAll(/\brequire\(\s*['"]([^'"]+)['"]\s*\)/g))out.push({spec:m[1],typeOnly:false});
 return out;
}
function resolveSpec(from:string,spec:string):string|null{
 const base=spec.startsWith('@/')?join(ROOT,spec.slice(2)):spec.startsWith('.')?resolve(dirname(from),spec):null;
 if(!base)return null;
 for(const c of [base,base+'.ts',base+'.tsx',join(base,'index.ts'),join(base,'index.tsx')])if(existsSync(c)&&statSync(c).isFile())return c;
 return base; // pl. .css
}
/** Futásidejű (nem `import type`) zárás: repófájlok és csomagok. `dynamic:false`: a dinamikus `import()` nélkül (a kezdeti csomag). */
function closure(start:string[],{dynamic=true}:{dynamic?:boolean}={}){
 const files=new Set<string>(),packages=new Set<string>(),stack=[...start],parents=new Map<string,string>();
 while(stack.length){
  const f=stack.pop()!;if(files.has(f))continue;files.add(f);
  if(!/\.(ts|tsx)$/.test(f))continue;
  for(const i of imports(f,dynamic)){
   if(i.typeOnly)continue;
   const r=resolveSpec(f,i.spec);
   if(r===null){packages.add(i.spec);continue}
   if(!files.has(r)){parents.set(r,f);stack.push(r)}
  }
 }
 const chain=(f:string)=>{const c=[rel(f)];let p=parents.get(f);while(p){c.push(rel(p));p=parents.get(p)}return c.reverse().join(' → ')};
 return {files,packages,chain};
}

// 1) Importgráf-tiltólista
const all=closure(ROOTS);
const FORBIDDEN_FILES=[/^content\//,/^scripts\//,/^db\//,/^lib\/auth\.ts$/,/^lib\/billing\.ts$/,/^lib\/pdf-export\.ts$/,/^lib\/plan\.ts$/,/^lib\/sizing\.ts$/,/^lib\/sizing-schema\.ts$/,/^components\/plan-/,/^components\/phase-load-report/,/^components\/planner-access/,/^app\/tervezo\//,/^app\/api\//,/^lib\/subscription-access/,/^lib\/account-email/,/^lib\/secrets/];
for(const f of all.files){const r=rel(f);for(const re of FORBIDDEN_FILES)assert.ok(!re.test(r),'tiltott import: '+all.chain(f))}
const FORBIDDEN_PACKAGES=['zod','jspdf','next/headers','drizzle-orm','mysql2','bcryptjs','stripe','next/dynamic','node:fs','fs','node:path'];
// „x”, „x/…” és „x.js” alak is (pl. next/headers.js).
const forbiddenPackage=(p:string)=>FORBIDDEN_PACKAGES.some(x=>p===x||p.startsWith(x+'/')||p.startsWith(x+'.'));
for(const p of all.packages)assert.ok(!forbiddenPackage(p),'tiltott csomag: '+p);
assert.ok(forbiddenPackage('next/headers.js')&&forbiddenPackage('zod/v4')&&!forbiddenPackage('next/navigation'),'a csomagszűrő önellenőrzése');
// A kliensszigetek nem húznak be szerveroldali modult (env, registry) – a kalkulátoroldal JS-e kicsi marad.
for(const f of ROOTS.filter(f=>/^['"]use client['"]/.test(readFileSync(f,'utf8').trimStart()))){
 const c=closure([f]);
 for(const g of c.files)assert.ok(!/^lib\/(site-origin|calc\/registry)\.ts$/.test(rel(g)),'kliensből szerveroldali modul: '+c.chain(g));
 // A Tudástár cikktörzsei, regisztere, sorközi parsere és kiadási kapuja csak szerveroldali: a böngészőbe a szerver által átadott,
 // közzétett metaadat kerül („Folytasd”, a közzétett célok listája), cikkszöveg és parser nem. Egyetlen kivétel: a generált, csak
 // közzétett tételeket tartalmazó keresőindex (lib/kb/content/generated/search.ts), amelyet a kereső az első megnyitáskor tölt be.
 for(const g of c.files)assert.ok(!/^lib\/kb\/(content\/|release\.ts$)/.test(rel(g))||rel(g)===KB_SEARCH_MODULE,'kliensből Tudástár-tartalom vagy -kapu: '+c.chain(g));
 assert.ok(!c.packages.has('cloudflare:workers'),'kliensből cloudflare:workers: '+rel(f));
}
// A böngészőbe töltődő Tudástár-keresőindex: csak a kb-chrome tölti be, dinamikus importtal (saját JS-darab, nem minden oldal HTML-jében),
// futásidejű függősége nincs (csak `import type`), és csak a keresőtétel mezőit tartalmazza – cikktörzset, kaput, parsert nem.
{
 const importers=ROOTS.filter(f=>imports(f).some(i=>/generated\/search$/.test(i.spec))).map(rel);
 assert.deepEqual(importers,['components/kezikonyv/kb-chrome.tsx'],'a keresőindexet csak a kliensoldali kereső tölti be');
 assert.match(readFileSync('components/kezikonyv/kb-chrome.tsx','utf8'),/import\('@\/lib\/kb\/content\/generated\/search'\)/,'dinamikus importtal (lusta betöltés)');
 assert.deepEqual([...closure([resolve(KB_SEARCH_MODULE)]).files].map(rel),[KB_SEARCH_MODULE],'a keresőindexnek nincs futásidejű függősége');
 const src=readFileSync(KB_SEARCH_MODULE,'utf8');
 const keys=new Set([...src.matchAll(/"([a-zA-Z]+)":/g)].map(m=>m[1]));
 assert.deepEqual([...keys].sort(),['group','href','id','keywords','rank','summary','synonyms','title'],'a keresőindex csak keresőtétel-mezőket tartalmaz');
 assert.ok(src.length<80*1024,'a keresőindex kicsi ('+src.length+' B)');
}
for(const f of walk('components/calc/islands').filter(f=>!f.endsWith('index.ts'))){
 const c=closure([resolve(f)]),defs=[...c.files].map(rel).filter(r=>r.startsWith('lib/calc/defs/'));
 assert.equal(defs.length,1,rel(f)+': egy sziget pontosan egy definíciót húz be ('+defs.join(', ')+')');
}
// A Tesztek kliensszigete: a kezdeti csomagja (dinamikus importok nélkül) szerverkód nélküli – nincs benne kalkulátordefiníció,
// méretezési tábla, a Tesztek regisztere vagy kérdésbank-sémája (zod), a kalkulátor- és a Tudástár-regiszter; a kalkulátordefiníciókat
// (a kalkulátorok saját szigetén át, közös csomaggal) és (élesedés után) a kérdésbank témaköreit csak dinamikus importtal, a közzétett
// sablonokhoz tölti be (components/quiz/calc-defs.ts, lib/quiz/release/index.ts).
{
 const island=resolve('components/quiz/quiz-app.tsx');
 assert.match(readFileSync(island,'utf8').trimStart(),/^['"]use client['"]/,'a Tesztek szigete kliensoldali');
 // A kezdeti csomag (beállítás, tesztkód, eredmények) a motor, a sablonok és a kalkulátorkód nélkül: a futtatót (quiz-runner.tsx) csak
 // a teszt indításakor tölti be, dinamikus importtal.
 const init=closure([island],{dynamic:false}),files=[...init.files].map(rel);
 for(const r of files)assert.ok(!/^(lib\/(calc\/|sizing|quiz\/(registry|schema|engine|templates)\.ts$|kb\/content\/|kb\/release\.ts$|site-origin\.ts$)|components\/calc\/|components\/quiz\/(quiz-runner|calc-defs))/.test(r),'a Tesztek szigetének kezdeti csomagjában: '+init.chain(resolve(r)));
 for(const p of init.packages)assert.ok(!forbiddenPackage(p)&&p!=='cloudflare:workers','a Tesztek szigetében tiltott csomag: '+p);
 assert.deepEqual(imports(island).filter(i=>!i.typeOnly&&/quiz-runner/.test(i.spec)).map(i=>i.spec),['./quiz-runner'],'a futtató egyszer, dinamikusan');
 assert.match(readFileSync(island,'utf8'),/import\('\.\/quiz-runner'\)/,'a futtató dinamikus importtal');
 // A futtató sem húz be szerverkódot: a kalkulátordefiníciókat a kalkulátorszigeteken át, lustán tölti.
 const run=closure([resolve('components/quiz/quiz-runner.tsx')],{dynamic:false});
 for(const r of [...run.files].map(rel))assert.ok(!/^lib\/(calc\/defs\/|calc\/registry\.ts$|sizing|quiz\/(registry|schema)\.ts$|kb\/content\/|kb\/release\.ts$|site-origin\.ts$)/.test(r),'a Tesztek futtatójában: '+run.chain(resolve(r)));
 for(const p of run.packages)assert.ok(!forbiddenPackage(p)&&p!=='cloudflare:workers','a Tesztek futtatójában tiltott csomag: '+p);
 // A sziget csak a components/quiz/calc-defs.ts-en át tölt kalkulátordefiníciót: a kalkulátorok saját szigeteiből (dinamikusan), amelyek
 // pontosan egy definíciót húznak be (fent), és azt exportálják is.
 const dyn=imports(resolve('components/quiz/calc-defs.ts')).filter(i=>!i.typeOnly).map(i=>i.spec);
 assert.ok(dyn.length>=9&&dyn.every(x=>/^@\/components\/calc\/islands\/[a-z0-9-]+$/.test(x)),'calc-defs.ts: csak kalkulátorszigetek, dinamikusan ('+dyn.join(', ')+')');
 assert.deepEqual(imports(resolve('components/quiz/calc-defs.ts'),false).filter(i=>!i.typeOnly),[],'calc-defs.ts: statikus futásidejű import nincs');
 for(const x of dyn)assert.match(readFileSync(x.replace('@/','')+'.tsx','utf8'),/^export \{def\};$/m,x+': a definíciót is exportálja');
 // A kiadott kérdésbank betöltői: csak a saját témaköri JSON-fájljai, dinamikusan (élesedés előtt egy sincs).
 for(const i of imports(resolve('lib/quiz/release/index.ts')).filter(i=>!i.typeOnly))assert.match(i.spec,/^\.\/[a-z-]+\.json$/,'lib/quiz/release/index.ts: '+i.spec);
 // A zodos kérdésbank-séma és a kiadó/lektori szkriptek csak a scripts/ és a tests/ alól érhetők el.
 for(const f of [...walk('app'),...walk('components'),...walk('lib'),...walk('db')]){
  const r=rel(f);if(r==='lib/quiz/schema.ts')continue;
  for(const i of imports(f))assert.ok(!/(^|\/)quiz\/schema$|^@\/lib\/quiz\/schema$|scripts\//.test(i.spec),r+': '+i.spec+' (a kérdésbank-séma és a szkriptek csak kiadási és tesztidőben)');
 }
}
// A sizing-formulas csak a sizing-tables-t importálja.
assert.deepEqual(imports('lib/sizing-formulas.ts').map(i=>i.spec),['./sizing-tables']);

// 2) Tiltott hívások az oldalakban és a kalkulátorkódban
for(const f of ROOTS){
 const src=readFileSync(f,'utf8').replace(/\/\/.*$/gm,'').replace(/\/\*[\s\S]*?\*\//g,''),r=rel(f);
 for(const re of [/\bgetAccount\s*\(/,/\bcookies\s*\(/,/\bheaders\s*\(\s*\)/,/\bwithDatabase\b/,/\bgetDatabase\b/])assert.ok(!re.test(src),r+': tiltott hívás '+re);
 if(/^(lib\/calc|components\/calc)\//.test(r))assert.ok(!/\bfetch\s*\(/.test(src),r+': a kalkulátorkód nem kér hálózatot');
 if(src.includes('dangerouslySetInnerHTML'))assert.ok(['components/kezikonyv/json-ld.tsx','components/kezikonyv/theme-boot.tsx'].includes(r),r+': dangerouslySetInnerHTML csak a JSON-LD-ben és a téma-indítóban');
}
assert.match(readFileSync('components/kezikonyv/json-ld.tsx','utf8'),/replace\(\/<\/g,'\\\\u003c'\)/,'a JSON-LD escape-eli a „<” jelet');
// 3) Nincs `import dynamic from 'next/dynamic'` ott, ahol `export const dynamic` is van (vinext: „o is not a function”).
for(const f of [...walk('app'),...walk('components')]){const s=readFileSync(f,'utf8');assert.ok(!(/import\s+dynamic\s+from\s+['"]next\/dynamic['"]/.test(s)&&/export\s+const\s+dynamic\b/.test(s)),rel(f))}
// 4) A tervező a kézikönyvből csak a lib/kb/links.ts-t importálja (kb. 1 KB), a kalkulátormotort nem.
for(const f of ['components/plan-editor.tsx','components/plan-tools.tsx','components/phase-load-report.tsx','components/sizing-report.tsx']){
 const specs=imports(f).map(i=>i.spec);
 for(const s of specs.filter(s=>/lib\/(kb|calc)\//.test(s)))assert.equal(s,'@/lib/kb/links',f+': csak a lib/kb/links.ts importálható ('+s+')');
}
const links=closure([resolve('lib/kb/links.ts')]);
assert.deepEqual([...links.files].map(rel).sort(),['lib/calc/release.ts','lib/kb/categories.ts','lib/kb/links.ts','lib/sizing-tables.ts'],'a links.ts függőségei kicsik');
// 5) Fejlécek: a három forrás, CSP, nosniff, Referrer- és Permissions-Policy; a /megosztas szabálya megmaradt.
const cfg=readFileSync('next.config.ts','utf8');
for(const s of ["'/:root(tudastar|kalkulatorok)'","'/tudastar/:path*'","'/kalkulatorok/:path*'","frame-ancestors 'none'","X-Content-Type-Options","strict-origin-when-cross-origin","camera=(), microphone=(), geolocation=()","source:'/megosztas'"])assert.ok(cfg.includes(s),'next.config.ts: '+s);
// 6) Böngészőkulcsok: a kézikönyv csak shockcraft-kb-* kulcsot (és a közös shockcraft-theme-et) használ; a sütitáblázat felsorolja őket.
const keys=new Set<string>();for(const f of ROOTS)for(const m of readFileSync(f,'utf8').matchAll(/['"`](shockcraft-[a-z0-9-]+)['"`]/g))keys.add(m[1]);
for(const k of keys)assert.ok(k.startsWith('shockcraft-kb-')||['shockcraft-theme','shockcraft-theme-change','shockcraft-cookie-settings'].includes(k),'nem engedélyezett kulcs: '+k);
const legal=readFileSync('components/legal-page.tsx','utf8');
for(const k of [...keys].filter(k=>k.startsWith('shockcraft-kb-')&&!k.startsWith('shockcraft-kb-test')))assert.ok(legal.includes("'"+k+"'"),'sütitáblázat: '+k);
// 7) A statikus kalkulátoroldalak (ISR) beállításai és a gyökérlayout hidratálási jelzője.
for(const f of ['app/(kezikonyv)/kalkulatorok/page.tsx','app/(kezikonyv)/kalkulatorok/[slug]/page.tsx','app/(kezikonyv)/tudastar/page.tsx','app/(kezikonyv)/tudastar/tesztek/page.tsx','app/(kezikonyv)/tudastar/elmelet/page.tsx','app/(kezikonyv)/tudastar/elmelet/[slug]/page.tsx','app/(kezikonyv)/tudastar/elmelet/kategoria/[kategoria]/page.tsx','app/(kezikonyv)/tudastar/szotar/page.tsx']){const s=readFileSync(f,'utf8');assert.match(s,/export const dynamic='force-static'/,f);assert.match(s,/export const revalidate=3600/,f)}
// A paraméteres oldalak csak a generateStaticParams elemeit (a kiadási kapu szerint közzétett tételeket) szolgálják ki; minden más 404.
for(const f of ['app/(kezikonyv)/kalkulatorok/[slug]/page.tsx','app/(kezikonyv)/tudastar/elmelet/[slug]/page.tsx','app/(kezikonyv)/tudastar/elmelet/kategoria/[kategoria]/page.tsx'])assert.match(readFileSync(f,'utf8'),/export const dynamicParams=false/,f);
// A Tudástár minden útvonala a kézikönyv-csoportban van (közös keret, CSP-fejlécek, nincs fiók-/adatbázis-hívás).
assert.ok(!existsSync('app/tudastar'),'a Tudástár-útvonalak az app/(kezikonyv) csoportban vannak');
for(const f of walk('app/(kezikonyv)/tudastar'))assert.ok(!/['"]use client['"]/.test(readFileSync(f,'utf8').slice(0,40)),rel(f)+': a Tudástár-oldal szerverkomponens');
assert.match(readFileSync('app/layout.tsx','utf8'),/<html lang="hu" suppressHydrationWarning>/);
// 8) A definíciók „I_N”, „P_átl” jelölése a felületen alsó indexként jelenik meg: a képletek, a levezetés, a figyelmeztetések, a feltételezések és a források <Sub>-on át.
{const calc=readFileSync('components/calc/calculator.tsx','utf8'),page=readFileSync('app/(kezikonyv)/kalkulatorok/[slug]/page.tsx','utf8');
 for(const re of [/<Sub text=\{i\.text\}\/>/,/<Sub text=\{a\}\/>/,/<Sub text=\{s\.formula\}\/>/,/<Sub text=\{s\.substituted\}\/>/])assert.match(calc,re,'calculator.tsx: '+re);
 for(const re of [/<Sub text=\{f\}\/>/,/<Sub text=\{s\}\/>/])assert.match(page,re,'[slug]/page.tsx: '+re);}
console.log('PASS: importgráf ('+all.files.size+' fájl, '+all.packages.size+' csomag) tiltólista nélkül (content/, scripts/, node:fs sem), kliensszigetek szerveroldali modul és Tudástár-tartalom nélkül, a Tesztek szigete definíció, tábla, regiszter és zod nélkül (lusta betöltés), egy sziget = egy definíció, nincs getAccount/cookies/headers/fetch, dangerouslySetInnerHTML csak JSON-LD/téma, next/dynamic őr, tervező → csak links.ts, fejlécek, kulcsok, ISR-beállítások.');
