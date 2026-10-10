// Build utáni füstteszt a kalkulátoroldalakra – mindkét targeten (Sites: `npm run start`, Node: `npm run start:node`).
// Használat: BASE=http://127.0.0.1:8787 node tests/kb-routes.mjs
// Ellenőrzi: 200/404, második kérésre s-maxage, CSP és nosniff, nincs Set-Cookie, abszolút canonical, sitemap (csak közzétett), robots, érvényes JSON-LD.
import assert from 'node:assert/strict';

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
assert.match(hub.text,/Villamos kalkulátorok/);assert.match(hub.text,/Hamarosan – szakmai lektorálás alatt/);
assert.ok(!hub.text.includes('href="/kalkulatorok/feszultseges"'),'a kiadatlan T1 nem kap linket a hubon');
const ohm=await page('/kalkulatorok/ohm-torveny');
assert.match(ohm.text,/<h1>Ohm-törvény<\/h1>/);assert.match(ohm.text,/Belsőleg ellenőrizve/);assert.match(ohm.text,/Kidolgozott példa/);
await page('/kalkulatorok/fazisterheles?mod=W&P1=600&P2=400&P3=100');
for(const p of ['/kalkulatorok/feszultseges','/kalkulatorok/keresztmetszet','/kalkulatorok/nincs-ilyen'])await page(p,{status:404});
const sm=await get('/sitemap.xml');
assert.equal(sm.status,200);
if(sm.text.includes('<loc>')){assert.match(sm.text,/\/kalkulatorok\/ohm-torveny<\/loc>/);assert.ok(!sm.text.includes('/kalkulatorok/feszultseges'),'sitemap: csak közzétett')}
const rb=await get('/robots.txt');
assert.equal(rb.status,200);assert.match(rb.text,/Disallow: \/api\//);assert.match(rb.text,/Disallow: \/tudastar\/konyvjelzok/);
console.log(results.join('\n'));
console.log('PASS: '+BASE+' – hub, kalkulátoroldalak, 404-ek, fejlécek, cache, canonical, JSON-LD, sitemap, robots.');
