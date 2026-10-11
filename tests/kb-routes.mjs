// Build utáni füstteszt a kalkulátor- és a Tudástár-oldalakra – mindkét targeten (Sites: `npm run start`, Node: `npm run start:node`).
// Használat: BASE=http://127.0.0.1:8787 node tests/kb-routes.mjs
// Ellenőrzi: 200/404, második kérésre s-maxage, CSP és nosniff, nincs Set-Cookie, abszolút canonical, og:site_name/og:locale, sitemap (csak közzétett), robots, érvényes JSON-LD,
// title ≤ 60 minden Tudástár- és kalkulátoroldalon; R3: 404 (perjellel a végén és RSC-kéréssel is), a csak R3 kategóriák 404-e, és sem link, sem szöveg
// a főoldalon, a hubon, a kalkulátoroldalakon és a Tudástár-oldalakon.
// A közzétett kalkulátorok körét nem égetjük be: a hub linkjeiből olvassuk (a hub, az oldalak és a sitemap ugyanazt a kiadási kaput követi,
// lib/calc/release.ts), és minden definícióra (lib/calc/defs) ellenőrizzük, hogy hub-link ⇔ 200 ⇔ sitemap; a többi 404.
import assert from 'node:assert/strict';
import {readdirSync} from 'node:fs';
import {htmlText,needleText,r3Items,r3Needles} from './kb-r3-needles.mjs';

const BASE=(process.env.BASE||'http://127.0.0.1:8787').replace(/\/$/,'');
const get=async(path)=>{const r=await fetch(BASE+path,{redirect:'manual',headers:{'user-agent':'kb-routes-smoke'}});return {status:r.status,headers:r.headers,text:await r.text()}};
const results=[];
async function page(path,{status=200}={}){
 const a=await get(path);
 assert.equal(a.status,status,path+' → '+a.status);
 assert.equal(a.headers.get('set-cookie'),null,path+': nincs Set-Cookie');
 if(status!==200)return a;
 const csp=a.headers.get('content-security-policy')||'';
 assert.match(csp,/default-src 'self'/,path+': CSP');assert.match(csp,/frame-ancestors 'none'/);
 assert.equal(a.headers.get('x-content-type-options'),'nosniff',path+': nosniff');
 assert.equal(a.headers.get('referrer-policy'),'strict-origin-when-cross-origin');
 const canonical=a.text.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
 assert.ok(canonical&&/^https?:\/\//.test(canonical),path+': abszolút canonical ('+canonical+')');
 for(const m of a.text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))assert.doesNotThrow(()=>JSON.parse(m[1]),path+': JSON-LD');
 assert.ok(!/\bNaN\b|>undefined</.test(a.text),path+': nincs NaN/undefined');
 const b=await get(path);
 const cc=b.headers.get('cache-control')||'';
 results.push(path+' 200 · '+cc);
 assert.match(cc,/s-maxage=\d+/,path+': második kérésre s-maxage ('+cc+')');
 return a;
}
const hub=await page('/kalkulatorok');
assert.match(hub.text,/Villamos kalkulátorok/);
const SLUGS=readdirSync('lib/calc/defs').filter(f=>f.endsWith('.ts')).map(f=>f.slice(0,-3));
const published=new Set([...hub.text.matchAll(/href="\/kalkulatorok\/([a-z0-9-]+)"/g)].map(m=>m[1]).filter(s=>SLUGS.includes(s)));
assert.ok(published.has('ohm-torveny')&&published.size>=19,'a T0 kalkulátorok közzétettek ('+published.size+')');
const unpublished=SLUGS.filter(s=>!published.has(s));
if(unpublished.length)assert.match(hub.text,/Hamarosan – /,'a kiadatlan kalkulátor „Hamarosan” kártyaként látszik');
const ohm=await page('/kalkulatorok/ohm-torveny');
assert.match(ohm.text,/<h1>Ohm-törvény<\/h1>/);assert.match(ohm.text,/Belsőleg ellenőrizve|Szakmailag lektorálta/);assert.match(ohm.text,/Kidolgozott példa/);
for(const t of [hub.text,ohm.text]){assert.match(t,/<meta property="og:site_name" content="Villanyrajz"/,'og:site_name');assert.match(t,/<meta property="og:locale" content="hu_HU"/,'og:locale')}
const title=ohm.text.match(/<title>([^<]*)<\/title>/)?.[1]??'';assert.ok(title&&title.length<=60,'title ≤ 60: '+title);
await page('/kalkulatorok/fazisterheles?mod=W&P1=600&P2=400&P3=100');
const calcPages=[ohm];
for(const s of SLUGS)if(s!=='ohm-torveny'&&s!=='fazisterheles'){const r=await page('/kalkulatorok/'+s,{status:published.has(s)?200:404});if(published.has(s))calcPages.push(r)}
for(const x of calcPages){const t=x.text.match(/<title>([^<]*)<\/title>/)?.[1]??'';assert.ok(t&&t.length<=60,'kalkulátor title ≤ 60: '+t)}
const nf=await page('/kalkulatorok/nincs-ilyen',{status:404});
assert.match(nf.text,/<title>[^<]*Nem található[^<]*<\/title>/,'a 404 saját címet kap');
const sm=await get('/sitemap.xml');
assert.equal(sm.status,200);
if(sm.text.includes('<loc>')){
 const inMap=new Set([...sm.text.matchAll(/\/kalkulatorok\/([a-z0-9-]+)<\/loc>/g)].map(m=>m[1]));
 assert.deepEqual([...inMap].sort(),[...published].sort(),'sitemap = közzétett kalkulátorok');
}
console.log('Közzétett: '+published.size+'; kiadatlan (404): '+(unpublished.join(', ')||'–'));
// ---------------------------------------------------------------- Tudástár (lib/kb/release.ts kapu): kezdőlap, Elmélet, kategóriák, cikkek, szótár
// A közzétett cikkek körét itt sem égetjük be: az Elmélet-oldal linkjeiből olvassuk, és a sitemap, a 200-as oldalak és a 404-ek ugyanazt követik.
// Az R3 (lektorra váró) vázlatok: közvetlen URL-en 404, nincs rájuk link, nincsenek a sitemapben, és a szövegük egyik kiszolgált oldalon sincs.
const kbPages=[];
// A főoldal nem a kézikönyv-csoport része (saját fejlécek, CSP nélkül): csak a státuszt, a linkeket és a szöveget nézzük.
const home=await get('/');assert.equal(home.status,200,'/ → '+home.status);
const kb=await page('/tudastar');kbPages.push(kb);
assert.match(kb.text,/<h1>Villanyszerelő Tudástár<\/h1>/);
for(const h of ['/tudastar/elmelet','/kalkulatorok','/tudastar/szotar'])assert.ok(kb.text.includes('href="'+h+'"'),'a kezdőlap linkje: '+h);
const elm=await page('/tudastar/elmelet');kbPages.push(elm);
const ARTS=[...new Set([...elm.text.matchAll(/href="\/tudastar\/elmelet\/([a-z0-9-]+)"/g)].map(m=>m[1]))].filter(s=>s!=='kategoria');
const CATS=[...new Set([...elm.text.matchAll(/href="\/tudastar\/elmelet\/kategoria\/([a-z0-9-]+)"/g)].map(m=>m[1]))];
assert.ok(ARTS.length>=17&&ARTS.includes('ohm-torvenye')&&ARTS.includes('vezetekek-szinjelolese'),'közzétett cikkek: '+ARTS.length);
assert.ok(CATS.length>=4,'kategóriák: '+CATS.length);
for(const c of CATS)kbPages.push(await page('/tudastar/elmelet/kategoria/'+c));
for(const a of ARTS){
 const r=await page('/tudastar/elmelet/'+a);kbPages.push(r);
 assert.match(r.text,/Belsőleg ellenőrizve|Szakmailag lektorálta/,a+': jelvény');
 assert.match(r.text,/Röviden:/,a+': Röviden');assert.match(r.text,/id="forrasok"/,a+': források');assert.match(r.text,/Gyakori tévedések/,a+': Gyakori tévedések');
 assert.match(r.text,/"@type":"TechArticle"/,a+': TechArticle JSON-LD');assert.match(r.text,/"@type":"BreadcrumbList"/,a+': BreadcrumbList');
 const t=r.text.match(/<title>([^<]*)<\/title>/)?.[1]??'';assert.ok(t&&t.length<=60,a+': title ≤ 60: '+t);
 assert.match(r.text,/<meta name="description" content="[^"]{80,170}"/,a+': description');
}
const ohmArt=kbPages.find(p=>p.text.includes('<link rel="canonical" href="')&&/canonical" href="[^"]*\/tudastar\/elmelet\/ohm-torvenye"/.test(p.text));
assert.ok(ohmArt,'abszolút canonical a cikkoldalon');
assert.ok(ohmArt.text.includes('href="/kalkulatorok/ohm-torveny"'),'a cikk a kalkulátorra mutat');
assert.ok(ohm.text.includes('href="/tudastar/elmelet/ohm-torvenye"'),'a kalkulátor a cikkre mutat');
const glo=await page('/tudastar/szotar');kbPages.push(glo);
assert.match(glo.text,/"@type":"DefinedTermSet"/);for(const id of ['aram-vedokapcsolo-fi-rele','pen-vezeto','vedovezeto','ip-vedettseg'])assert.ok(glo.text.includes('id="'+id+'"'),'szótári horgony: #'+id);
// A címhossz (≤ 60, terv 3.7) minden Tudástár-oldalon: kezdőlap, Elmélet, kategóriák, cikkek, szótár.
for(const x of kbPages){const t=x.text.match(/<title>([^<]*)<\/title>/)?.[1]??'';assert.ok(t&&t.length<=60,'title ≤ 60: '+t)}
const R3=r3Items();assert.ok(R3.length>=13,'R3 vázlatok: '+R3.length);
// Minden oldal, ahová cikklink kerülhet: a Tudástár-oldalak, a főoldal, a kalkulátor-hub és minden közzétett kalkulátoroldal.
const served=[...kbPages,home,hub,...calcPages];
const needles=r3Needles().map(needleText);
const noR3Text=(label,html)=>{const t=htmlText(html);for(const n of needles)assert.ok(!t.includes(n),label+': R3 szöveg a kiszolgált oldalon: „'+n.slice(0,60)+'…”')};
/** Átirányítást követve (pl. perjel a cím végén) és RSC-kéréssel is 404, R3 szöveg nélkül. */
async function gone(path,headers={}){
 const r=await fetch(BASE+path,{redirect:'follow',headers:{'user-agent':'kb-routes-smoke',...headers}}),t=await r.text();
 assert.equal(r.status,404,path+(headers.RSC?' (RSC)':'')+' → '+r.status);noR3Text(path,t);
}
for(const p of R3){
 await page('/tudastar/'+p.section+'/'+p.slug,{status:404});
 if(p.section!=='elmelet')await page('/tudastar/elmelet/'+p.slug,{status:404});
 await gone('/tudastar/'+p.section+'/'+p.slug+'/');await gone('/tudastar/'+p.section+'/'+p.slug,{RSC:'1'});await gone('/tudastar/'+p.section+'/'+p.slug+'.rsc');
 for(const x of served)assert.ok(!x.text.includes('href="/tudastar/'+p.section+'/'+p.slug),'link R3 célra: '+p.slug);
}
// A csak R3 tételt tartalmazó kategóriák (és a Sémák szekció) oldala nem létezik.
const r3Cats=[...new Set(R3.map(p=>p.section+'/'+p.category))].filter(sc=>!sc.startsWith('elmelet/')||!CATS.includes(sc.slice(8)));
assert.ok(r3Cats.includes('elmelet/vedelmi-es-automatizalasi-eszkozok')&&r3Cats.includes('elmelet/erintesvedelem')&&r3Cats.includes('elmelet/munkabiztonsag'),'csak R3 kategóriák: '+r3Cats.join(', '));
for(const sc of r3Cats){const [sec,cat]=sc.split('/');await page('/tudastar/'+sec+'/kategoria/'+cat,{status:404});await gone('/tudastar/'+sec+'/kategoria/'+cat,{RSC:'1'});for(const x of served)assert.ok(!x.text.includes('href="/tudastar/'+sec+'/kategoria/'+cat+'"'),'link csak R3 kategóriára: '+cat)}
await gone('/tudastar/semak');await gone('/tudastar/semak/');
await page('/tudastar/elmelet/nincs-ilyen',{status:404});await page('/tudastar/elmelet/kategoria/nincs-ilyen',{status:404});
for(const x of served)noR3Text(x.text.match(/<link rel="canonical" href="([^"]+)"/)?.[1]??'?',x.text);
if(sm.text.includes('<loc>')){
 const inMap=new Set([...sm.text.matchAll(/\/tudastar\/elmelet\/([a-z0-9-]+)<\/loc>/g)].map(m=>m[1]));
 assert.deepEqual([...inMap].sort(),[...ARTS].sort(),'sitemap = közzétett cikkek');
 for(const u of ['/tudastar<','/tudastar/elmelet<','/tudastar/szotar<'])assert.ok(sm.text.includes(u.replace('<','</loc>')),'sitemap: '+u);
 for(const c of CATS)assert.ok(sm.text.includes('/tudastar/elmelet/kategoria/'+c+'</loc>'),'sitemap: kategória '+c);
 for(const p of R3)assert.ok(!sm.text.includes('/'+p.slug+'</loc>'),'R3 nincs a sitemapben: '+p.slug);
}
console.log('Tudástár: '+ARTS.length+' közzétett cikk, '+CATS.length+' kategória, szótár; R3 (404, perjellel és RSC-kéréssel is): '+R3.length+'; csak R3 kategória (404): '+r3Cats.length+'; R3-szöveg- és linkőr: '+served.length+' oldalon');
const rb=await get('/robots.txt');
assert.equal(rb.status,200);assert.match(rb.text,/Disallow: \/api\//);assert.match(rb.text,/Disallow: \/tudastar\/konyvjelzok/);
console.log(results.join('\n'));
console.log('PASS: '+BASE+' – hub, kalkulátoroldalak, Tudástár (kezdőlap, Elmélet, kategóriák, cikkek, szótár), R3 404 és szöveg nélkül, 404-ek, fejlécek, cache, canonical, JSON-LD, sitemap, robots.');
