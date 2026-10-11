// Böngészős (Playwright) ellenőrzés a Tudástár és a kalkulátorok kiszolgált oldalain – a tests/kb-routes.mjs (HTTP-szintű) kiegészítése:
//  1. 320 px széles nézetben a sitemap egyik oldalán (/, /tudastar…, /kalkulatorok…) sincs vízszintes görgetés (scrollWidth ≤ clientWidth),
//  2. az ábrák felirata telefonon is olvasható: a tényleges betűméret (font-size × a getScreenCTM nagyítása) 320 px-en ≥ 9, 390 px-en
//     ≥ 10 px; egyik ábra sem lóg ki a keretéből, és nincs olyan, amelyet oldalra kellene görgetni,
//  3. a szövegközi linkek (.kk-prose a) linknek látszanak (aláhúzás és a környező szövegtől eltérő szín), a „hamarosan” jelölés nem,
//  4. JS nélkül a csak szkripttel működő cikkműveletek (Kedvenc, Megosztás, Nyomtatás) rejtve vannak,
//  5. az érintési célok (belső tartalomjegyzék, kategórialisták, morzsamenü, összecsukható szakaszok) 390 px-en legalább 44 px magasak,
//  6. a Tesztek (ha közzétett) 320 px-en: beállítás, gyakorló és vizsga, visszajelzés, eredmény görgetés nélkül, 44 px-es érintési célok;
//     JS nélkül a sziget rejtve, a mintafeladat látszik.
// Használat (build vagy dev szerver után): BASE=http://127.0.0.1:8787 node tests/kb-figures.mjs
// Playwright: a helyi node_modules-ból, különben a globális telepítésből (npm root -g); böngészőt nem telepít.
import assert from 'node:assert/strict';
import {execSync} from 'node:child_process';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const BASE=(process.env.BASE||'http://127.0.0.1:8787').replace(/\/$/,'');
let pw;
try{pw=await import('playwright')}catch{pw=await import(pathToFileURL(join(execSync('npm root -g').toString().trim(),'playwright','index.mjs')).href)}
const browser=await pw.chromium.launch();
const out=[];
try{
 // A vizsgált oldalak: a sitemap (az APP_ORIGIN-t a BASE-re cserélve); ha a sitemap üres (nincs APP_ORIGIN), a hubokból gyűjtve.
 const sm=await (await fetch(BASE+'/sitemap.xml')).text();
 let paths=[...sm.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)<\/loc>/g)].map(m=>m[1]).filter(p=>p==='/'||/^\/(tudastar|kalkulatorok)/.test(p));
 if(!paths.length){
  const grab=async(p,re)=>[...(await (await fetch(BASE+p)).text()).matchAll(re)].map(m=>m[1]);
  paths=['/','/tudastar','/tudastar/elmelet','/tudastar/szotar','/kalkulatorok',...new Set([...await grab('/tudastar/elmelet',/href="(\/tudastar\/elmelet\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)"/g),...await grab('/kalkulatorok',/href="(\/kalkulatorok\/[a-z0-9-]+)"/g)])];
 }
 paths=[...new Set(paths)];
 const articles=paths.filter(p=>/^\/tudastar\/(elmelet\/(?!kategoria)[a-z0-9-]+|szotar)$/.test(p));
 assert.ok(paths.length>=40&&articles.length>=17,'vizsgált oldalak: '+paths.length+', cikkek: '+articles.length);

 // 1. Nincs vízszintes görgetés 320 px-en.
 {const ctx=await browser.newContext({viewport:{width:320,height:800}}),page=await ctx.newPage(),bad=[];
  for(const p of paths){
   await page.goto(BASE+p,{waitUntil:'load'});
   const r=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
   if(r.sw>r.cw+1)bad.push(p+' ('+r.sw+' > '+r.cw+')');
  }
  await ctx.close();assert.deepEqual(bad,[],'vízszintes görgetés 320 px-en');out.push('320 px: '+paths.length+' oldal, vízszintes görgetés nélkül');}

 // 2. Ábrák: betűméret és keret.
 for(const [w,min] of [[320,9],[390,10]]){
  const ctx=await browser.newContext({viewport:{width:w,height:900}}),page=await ctx.newPage(),bad=[];let n=0,smallest=99;
  for(const p of articles){
   await page.goto(BASE+p,{waitUntil:'load'});
   const r=await page.evaluate(()=>{
    const res=[];
    for(const svg of document.querySelectorAll('figure .kk-fig-svg')){
     if(!svg.getBoundingClientRect().width)continue; // rejtett változat (pl. a széles skála keskeny képernyőn)
     const frame=svg.closest('.kk-fig-frame'),fb=frame.getBoundingClientRect(),sb=svg.getBoundingClientRect();
     const id=svg.closest('figure').id,scale=svg.getScreenCTM()?.a??1;
     let min=99;for(const t of svg.querySelectorAll('text'))min=Math.min(min,parseFloat(getComputedStyle(t).fontSize)*scale);
     res.push({id,min,over:sb.right>fb.right+1||sb.left<fb.left-1,scroll:frame.scrollWidth>frame.clientWidth+1});
    }
    return res;
   });
   for(const f of r){n++;smallest=Math.min(smallest,f.min);
    if(f.min<min)bad.push(p+'#'+f.id+': '+f.min.toFixed(1)+' px');
    if(f.over||f.scroll)bad.push(p+'#'+f.id+': kilóg a keretből / görgetni kell');}
  }
  await ctx.close();assert.deepEqual(bad,[],'ábrák '+w+' px-en (legalább '+min+' px-es felirat, keretben)');
  out.push(w+' px: '+n+' ábra-SVG, a legkisebb felirat '+smallest.toFixed(1)+' px');
 }

 // 3. Linkek és „hamarosan” jelölés (világos és sötét témában).
 for(const theme of ['light','dark']){
  const ctx=await browser.newContext({viewport:{width:390,height:900},colorScheme:theme}),page=await ctx.newPage();
  await page.addInitScript(t=>{try{localStorage.setItem('shockcraft-theme',t)}catch{}},theme);
  await page.goto(BASE+'/tudastar/szotar',{waitUntil:'load'});
  const r=await page.evaluate(()=>{
   const links=[...document.querySelectorAll('.kk-prose a')],pend=[...document.querySelectorAll('.kk-pending')];
   const look=(el)=>{const s=getComputedStyle(el),ps=getComputedStyle(el.parentElement);return {under:s.textDecorationLine.includes('underline'),color:s.color!==ps.color,border:s.borderBottomStyle!=='none'&&parseFloat(s.borderBottomWidth)>0}};
   return {links:links.length,linkOk:links.filter(a=>{const l=look(a);return l.under&&l.color}).length,pend:pend.length,pendLinky:pend.filter(e=>{const l=look(e);return l.under||l.border}).length,theme:document.documentElement.dataset.theme};
  });
  await ctx.close();
  assert.equal(r.theme,theme,'a téma beállt');
  assert.ok(r.links>=30,theme+': szövegközi linkek a szótárban ('+r.links+')');
  assert.equal(r.linkOk,r.links,theme+': minden szövegközi link aláhúzott és a szövegtől eltérő színű');
  assert.ok(r.pend>=1&&r.pendLinky===0,theme+': a „hamarosan” jelölés nem néz ki linknek ('+r.pendLinky+'/'+r.pend+')');
  out.push(theme+': '+r.links+' szövegközi link linkként jelölve, '+r.pend+' „hamarosan” jelölés link nélkül');
 }

 // 4. JS nélkül a cikkműveletek rejtve.
 {const ctx=await browser.newContext({viewport:{width:390,height:900},javaScriptEnabled:false}),page=await ctx.newPage();
  await page.goto(BASE+'/tudastar/elmelet/ohm-torvenye',{waitUntil:'load'});
  const vis=await page.evaluate(()=>[...document.querySelectorAll('.kk-actions')].map(e=>getComputedStyle(e).display));
  await ctx.close();assert.ok(vis.length>=1&&vis.every(d=>d==='none'),'JS nélkül a .kk-actions rejtett: '+vis.join(','));out.push('JS nélkül: a cikkműveletek rejtve');}

 // 5. Érintési célok 390 px-en.
 {const ctx=await browser.newContext({viewport:{width:390,height:900}}),page=await ctx.newPage(),bad=[];
  for(const p of ['/tudastar','/tudastar/elmelet','/tudastar/elmelet/ohm-torvenye']){
   await page.goto(BASE+p,{waitUntil:'load'});
   await page.evaluate(()=>{for(const d of document.querySelectorAll('.kk-toc-inline,.kk-changes'))d.open=true});
   const r=await page.evaluate(()=>[...document.querySelectorAll('.kk-toc-inline a,.kk-toc-inline summary,.kk-changes summary,.kk-cat-grid li a,.kk-crumbs a,.kk-category h2 a')].filter(e=>e.getClientRects().length).map(e=>({t:(e.textContent||'').trim().slice(0,30),h:e.getBoundingClientRect().height})));
   for(const x of r)if(x.h<43.5)bad.push(p+': '+x.t+' ('+x.h.toFixed(0)+' px)');
  }
  await ctx.close();assert.deepEqual(bad,[],'44 px-nél kisebb érintési cél');out.push('390 px: az érintési célok legalább 44 px magasak');}

 // 6. Tesztek (ha közzétett): 320 px-en a beállítás, a futó gyakorló és vizsga, a visszajelzés és az eredmény is vízszintes görgetés
 //    nélkül; az érintési célok (válaszok, gombok, kérdéstérkép) legalább 44 px magasak; JS nélkül a sziget rejtve, a mintafeladat látszik.
 if(paths.includes('/tudastar/tesztek')){
  const ctx=await browser.newContext({viewport:{width:320,height:700},isMobile:true,hasTouch:true}),page=await ctx.newPage(),bad=[],small=[];
  await page.addInitScript(()=>{try{localStorage.setItem('shockcraft-cookie-notice-v1',String(Date.now()))}catch{}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=async(label)=>{
   const r=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,
    t:[...document.querySelectorAll('.kk-quiz .kk-quiz-choice,.kk-quiz .kk-button,.kk-quiz-map ol button,.kk-quiz-links a,.kk-quiz-actions button')].filter(e=>e.getClientRects().length).map(e=>({t:(e.textContent||'').trim().slice(0,30),h:e.getBoundingClientRect().height}))}));
   if(r.sw>r.cw+1)bad.push(label+' ('+r.sw+' > '+r.cw+')');
   for(const x of r.t)if(x.h<43.5)small.push(label+': '+x.t+' ('+x.h.toFixed(0)+' px)');
  };
  for(const mode of ['gyakorlo','vizsga']){
   await page.goto(BASE+'/tudastar/tesztek?hossz=5&mod='+mode,{waitUntil:'load'});
   await page.locator('.kk-quiz-setup').waitFor();await check(mode+': beállítás');
   await page.locator('.kk-quiz-setup button[type=submit]').click();await page.locator('#kerdes-cim').waitFor();await check(mode+': kérdés');
   for(let i=0;i<5;i++){
    await page.locator('.kk-quiz-choice').nth(i%4).click();
    if(mode==='gyakorlo'){await page.getByRole('button',{name:'Ellenőrzés'}).click();await page.locator('.kk-quiz-feedback').waitFor();if(i===0)await check(mode+': visszajelzés')}
    const next=page.locator('.kk-quiz-card .kk-quiz-actions .kk-button.primary');
    if(i<4){await next.click();await page.locator('#kerdes-cim').filter({hasText:(i+2)+'.'}).waitFor()}
    else{await next.click();if(mode==='vizsga'&&await page.getByRole('button',{name:'Igen, beadom'}).count())await page.getByRole('button',{name:'Igen, beadom'}).click()}
   }
   await page.locator('#eredmeny-cim').waitFor();await check(mode+': eredmény');
   await page.evaluate(()=>{for(const d of document.querySelectorAll('.kk-quiz-review details'))d.open=true});await check(mode+': eredmény, kinyitott magyarázatokkal');
  }
  await ctx.close();
  assert.deepEqual(errors,[],'Tesztek: oldalhiba');assert.deepEqual(bad,[],'Tesztek: vízszintes görgetés 320 px-en');assert.deepEqual(small,[],'Tesztek: 44 px-nél kisebb érintési cél');
  const nojs=await browser.newContext({viewport:{width:320,height:700},javaScriptEnabled:false}),np=await nojs.newPage();
  await np.goto(BASE+'/tudastar/tesztek',{waitUntil:'load'});
  const r=await np.evaluate(()=>({island:getComputedStyle(document.querySelector('.kk-quiz-island')).display,sample:getComputedStyle(document.querySelector('.kk-quiz-sample')).display,sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
  await nojs.close();
  assert.ok(r.island==='none'&&r.sample!=='none'&&r.sw<=r.cw+1,'Tesztek JS nélkül: a sziget rejtve, a mintafeladat látszik, görgetés nélkül '+JSON.stringify(r));
  out.push('Tesztek 320 px: beállítás, gyakorló (kérdés, visszajelzés), vizsga, eredmény görgetés nélkül, érintési célok ≥ 44 px; JS nélkül mintafeladat');
 }
}finally{await browser.close()}
console.log(out.join('\n'));
console.log('PASS: '+BASE+' – nincs vízszintes görgetés, olvasható és keretben maradó ábrák, linkszerű linkek, JS nélküli állapot, érintési célok, Tesztek 320 px-en.');
