// Build utáni füstteszt a kalkulátoroldalakra – mindkét targeten (Sites: `npm run start`, Node: `npm run start:node`).
// Használat: BASE=http://127.0.0.1:8787 node tests/kb-routes.mjs
// Ellenőrzi: 200/404, második kérésre s-maxage, CSP és nosniff, nincs Set-Cookie, abszolút canonical, og:site_name/og:locale, sitemap (csak közzétett), robots, érvényes JSON-LD.
// A közzétett kalkulátorok körét nem égetjük be: a hub linkjeiből olvassuk (a hub, az oldalak és a sitemap ugyanazt a kiadási kaput követi,
// lib/calc/release.ts), és minden definícióra (lib/calc/defs) ellenőrizzük, hogy hub-link ⇔ 200 ⇔ sitemap; a többi 404.
import assert from 'node:assert/strict';
import {readdirSync} from 'node:fs';

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
for(const s of SLUGS)if(s!=='ohm-torveny'&&s!=='fazisterheles')await page('/kalkulatorok/'+s,{status:published.has(s)?200:404});
const nf=await page('/kalkulatorok/nincs-ilyen',{status:404});
assert.match(nf.text,/<title>[^<]*Nem található[^<]*<\/title>/,'a 404 saját címet kap');
const sm=await get('/sitemap.xml');
assert.equal(sm.status,200);
if(sm.text.includes('<loc>')){
 const inMap=new Set([...sm.text.matchAll(/\/kalkulatorok\/([a-z0-9-]+)<\/loc>/g)].map(m=>m[1]));
 assert.deepEqual([...inMap].sort(),[...published].sort(),'sitemap = közzétett kalkulátorok');
}
console.log('Közzétett: '+published.size+'; kiadatlan (404): '+(unpublished.join(', ')||'–'));
const rb=await get('/robots.txt');
assert.equal(rb.status,200);assert.match(rb.text,/Disallow: \/api\//);assert.match(rb.text,/Disallow: \/tudastar\/konyvjelzok/);
console.log(results.join('\n'));
console.log('PASS: '+BASE+' – hub, kalkulátoroldalak, 404-ek, fejlécek, cache, canonical, JSON-LD, sitemap, robots.');
