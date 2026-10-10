// Statikus őrök a kézikönyv (Tudástár/Kalkulátorok) kódjára (docs/tudastar-terv.md 3.8, 10.6):
// importgráf-tiltólista (db, auth, billing, pdf, lib/plan futásidőben, lib/sizing.ts, zod, next/headers …), nincs getAccount/cookies/headers/fetch,
// dangerouslySetInnerHTML csak a JSON-LD-ben és a téma-indítóban, a tervező csak a lib/kb/links.ts-t importálja, fejlécek, kulcsok.
// Futtatás: node_modules/.bin/tsx tests/kb-guards.ts
import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {dirname,join,relative,resolve} from 'node:path';

const ROOT=resolve('.');
const walk=(dir:string):string[]=>readdirSync(dir).flatMap(f=>{const p=join(dir,f);return statSync(p).isDirectory()?walk(p):/\.(ts|tsx)$/.test(f)?[p]:[]});
const rel=(p:string)=>relative(ROOT,p).split('\\').join('/');
// Az app/layout.tsx a kalkulátoroldalak szülő-layoutja: ha cookies()/headers()-t hívna, minden kalkulátoroldal dinamikussá válna.
const ROOTS=[...walk('app/(kezikonyv)'),...walk('components/kezikonyv'),...walk('components/calc'),...walk('lib/calc'),...walk('lib/kb'),'app/layout.tsx','app/sitemap.ts','app/robots.ts','lib/site-origin.ts','lib/sizing-formulas.ts'].map(p=>resolve(p));
assert.ok(ROOTS.length>60,'a gyökérfájlok megvannak ('+ROOTS.length+')');

type Imp={spec:string;typeOnly:boolean};
function imports(file:string):Imp[]{
 const src=readFileSync(file,'utf8'),out:Imp[]=[];
 for(const m of src.matchAll(/(?:^|[;\n])\s*(import|export)\s+(type\s+)?([^;'"]*?)\s*from\s*['"]([^'"]+)['"]/g)){
  const clause=m[3]??'';const allTyped=!!m[2]||/^\{\s*(?:type\s+\w+\s*(?:as\s+\w+\s*)?,?\s*)+\}$/.test(clause.trim());
  out.push({spec:m[4],typeOnly:allTyped});
 }
 for(const m of src.matchAll(/(?:^|[;\n])\s*import\s*['"]([^'"]+)['"]/g))out.push({spec:m[1],typeOnly:false});
 for(const m of src.matchAll(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/g))out.push({spec:m[1],typeOnly:false});
 for(const m of src.matchAll(/\brequire\(\s*['"]([^'"]+)['"]\s*\)/g))out.push({spec:m[1],typeOnly:false});
 return out;
}
function resolveSpec(from:string,spec:string):string|null{
 const base=spec.startsWith('@/')?join(ROOT,spec.slice(2)):spec.startsWith('.')?resolve(dirname(from),spec):null;
 if(!base)return null;
 for(const c of [base,base+'.ts',base+'.tsx',join(base,'index.ts'),join(base,'index.tsx')])if(existsSync(c)&&statSync(c).isFile())return c;
 return base; // pl. .css
}
/** Futásidejű (nem `import type`) zárás: repófájlok és csomagok. */
function closure(start:string[]){
 const files=new Set<string>(),packages=new Set<string>(),stack=[...start],parents=new Map<string,string>();
 while(stack.length){
  const f=stack.pop()!;if(files.has(f))continue;files.add(f);
  if(!/\.(ts|tsx)$/.test(f))continue;
  for(const i of imports(f)){
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
const FORBIDDEN_FILES=[/^db\//,/^lib\/auth\.ts$/,/^lib\/billing\.ts$/,/^lib\/pdf-export\.ts$/,/^lib\/plan\.ts$/,/^lib\/sizing\.ts$/,/^lib\/sizing-schema\.ts$/,/^components\/plan-/,/^components\/phase-load-report/,/^components\/planner-access/,/^app\/tervezo\//,/^app\/api\//,/^lib\/subscription-access/,/^lib\/account-email/,/^lib\/secrets/];
for(const f of all.files){const r=rel(f);for(const re of FORBIDDEN_FILES)assert.ok(!re.test(r),'tiltott import: '+all.chain(f))}
const FORBIDDEN_PACKAGES=['zod','jspdf','next/headers','drizzle-orm','mysql2','bcryptjs','stripe','next/dynamic'];
// „x”, „x/…” és „x.js” alak is (pl. next/headers.js).
const forbiddenPackage=(p:string)=>FORBIDDEN_PACKAGES.some(x=>p===x||p.startsWith(x+'/')||p.startsWith(x+'.'));
for(const p of all.packages)assert.ok(!forbiddenPackage(p),'tiltott csomag: '+p);
assert.ok(forbiddenPackage('next/headers.js')&&forbiddenPackage('zod/v4')&&!forbiddenPackage('next/navigation'),'a csomagszűrő önellenőrzése');
// A kliensszigetek nem húznak be szerveroldali modult (env, registry) – a kalkulátoroldal JS-e kicsi marad.
for(const f of ROOTS.filter(f=>/^['"]use client['"]/.test(readFileSync(f,'utf8').trimStart()))){
 const c=closure([f]);
 for(const g of c.files)assert.ok(!/^lib\/(site-origin|calc\/registry)\.ts$/.test(rel(g)),'kliensből szerveroldali modul: '+c.chain(g));
 assert.ok(!c.packages.has('cloudflare:workers'),'kliensből cloudflare:workers: '+rel(f));
}
for(const f of walk('components/calc/islands').filter(f=>!f.endsWith('index.ts'))){
 const c=closure([resolve(f)]),defs=[...c.files].map(rel).filter(r=>r.startsWith('lib/calc/defs/'));
 assert.equal(defs.length,1,rel(f)+': egy sziget pontosan egy definíciót húz be ('+defs.join(', ')+')');
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
for(const f of ['app/(kezikonyv)/kalkulatorok/page.tsx','app/(kezikonyv)/kalkulatorok/[slug]/page.tsx']){const s=readFileSync(f,'utf8');assert.match(s,/export const dynamic='force-static'/);assert.match(s,/export const revalidate=3600/)}
assert.match(readFileSync('app/layout.tsx','utf8'),/<html lang="hu" suppressHydrationWarning>/);
console.log('PASS: importgráf ('+all.files.size+' fájl, '+all.packages.size+' csomag) tiltólista nélkül, kliensszigetek szerveroldali modul nélkül, egy sziget = egy definíció, nincs getAccount/cookies/headers/fetch, dangerouslySetInnerHTML csak JSON-LD/téma, next/dynamic őr, tervező → csak links.ts, fejlécek, kulcsok, ISR-beállítások.');
