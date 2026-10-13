// Böngészős (Playwright) ellenőrzés a Tudástár és a kalkulátorok kiszolgált oldalain – a tests/kb-routes.mjs (HTTP-szintű) kiegészítése:
//  1. 320 px széles nézetben a sitemap egyik oldalán (/, /tudastar…, /kalkulatorok…) sincs vízszintes görgetés (scrollWidth ≤ clientWidth),
//  2. az ábrák felirata telefonon is olvasható: a tényleges betűméret (font-size × a getScreenCTM nagyítása) 320 px-en ≥ 9, 390 px-en
//     ≥ 10 px; egyik ábra sem lóg ki a keretéből, és nincs olyan, amelyet oldalra kellene görgetni,
//  3. a szövegközi linkek (.kk-prose a) linknek látszanak (aláhúzás és a környező szövegtől eltérő szín), a „hamarosan” jelölés nem,
//  4. JS nélkül a csak szkripttel működő cikkműveletek (Kedvenc, Megosztás, Nyomtatás) rejtve vannak,
//  5. az érintési célok (belső tartalomjegyzék, kategórialisták, morzsamenü, összecsukható szakaszok) 390 px-en legalább 44 px magasak,
//  6. a Tesztek (ha közzétett) 320 px-en: beállítás, gyakorló és vizsga, visszajelzés, eredmény görgetés nélkül, 44 px-es érintési célok;
//     390 px-en a fókuszban levő mező mellett a sáv helyén álló gomb koppintásra és kattintásra is működik (az alsó sáv nem nyeli el);
//     billentyűzettel a fókusz a megerősítéseknél és a műveletek után sem esik a dokumentum elejére; élő régiók; linkek jelölése;
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
  // 6b. Az alsó sáv nem nyeli el a kattintást (review): szövegmező vagy legördülő lista fókuszában a sáv rejtve van, és a helyén álló
  //     gombra koppintva (érintéssel és egérrel is) a művelet lefut – a sáv csak késleltetve tér vissza.
  for(const touch of [true,false]){
   const c2=await browser.newContext({viewport:{width:390,height:844},isMobile:touch,hasTouch:touch}),pg=await c2.newPage();
   await pg.addInitScript(()=>{try{localStorage.setItem('shockcraft-cookie-notice-v1',String(Date.now()))}catch{}});
   const tapAtBottom=async(loc)=>{
    // A gomb közepe a nézet alsó 64 px-ébe (a sáv helyére) kerül.
    await pg.evaluate(()=>window.scrollTo(0,0));
    const b0=await loc.boundingBox(),vh=pg.viewportSize().height,target=vh-30;
    await pg.evaluate(dy=>window.scrollBy(0,dy),b0.y+b0.height/2-target);
    const b=await loc.boundingBox(),y=b.y+b.height/2;
    assert.ok(y>vh-64&&y<vh,'a gomb a sáv helyén: '+y.toFixed(0)+' / '+vh);
    const hidden=await pg.evaluate(()=>{const st=getComputedStyle(document.querySelector('.kk-bottom-nav'));return st.visibility==='hidden'||st.display==='none'});
    assert.ok(hidden,'fókuszban levő mezőnél a sáv rejtve');
    if(touch)await pg.touchscreen.tap(b.x+b.width/2,y);else await pg.mouse.click(b.x+b.width/2,y);
   };
   await pg.goto(BASE+'/tudastar/tesztek?mod=vizsga&hossz=5',{waitUntil:'load'});
   await pg.locator('.kk-quiz-setup').waitFor();
   const sel=pg.locator('.kk-quiz-minutes select');await sel.focus();await sel.selectOption({index:1});await sel.focus();
   await tapAtBottom(pg.locator('.kk-quiz-setup button[type=submit]'));
   await pg.locator('#kerdes-cim').waitFor({timeout:5000});
   await pg.evaluate(()=>sessionStorage.clear());await pg.goto(BASE+'/tudastar/tesztek',{waitUntil:'load'});
   const code=pg.locator('.kk-quiz-code input');await code.waitFor();await code.fill('g5-s1-1-0123abcd');await code.focus();
   await tapAtBottom(pg.locator('.kk-quiz-code button[type=submit]'));
   await pg.locator('#kodpanel-cim').waitFor({timeout:5000});
   await c2.close();
  }
  out.push('Tesztek 390 px: fókuszban levő mező mellett a sáv helyén álló gomb koppintásra és kattintásra is működik');
  // 6c. Billentyűzet és fókusz: a megerősítéseknél és a műveletek után a fókusz nem esik a dokumentum elejére; az élő régió üresen sem
  //     display:none; a linkek (feladattípusok, „Hogyan működik?”, visszajelzés) színnel és aláhúzással jelöltek.
  {
   const c3=await browser.newContext({viewport:{width:1000,height:900}}),pg=await c3.newPage();
   await pg.addInitScript(()=>{try{localStorage.setItem('shockcraft-cookie-notice-v1',String(Date.now()))}catch{}});
   const active=()=>pg.evaluate(()=>{const a=document.activeElement;return a?a.tagName+':'+(a.textContent||'').trim().slice(0,40):'-'});
   const press=async(loc)=>{await loc.focus();await pg.keyboard.press('Enter')};
   await pg.goto(BASE+'/tudastar/tesztek?mod=vizsga&hossz=5',{waitUntil:'load'});
   const linkLook=await pg.evaluate(()=>[...document.querySelectorAll('.kk-method a,.kk-quiz-type-links a')].map(a=>{const s=getComputedStyle(a),p=getComputedStyle(a.closest('li,span,div').parentElement);return {t:(a.textContent||'').trim().slice(0,20),under:s.textDecorationLine.includes('underline'),color:s.color!==p.color}}));
   assert.ok(linkLook.length>=10&&linkLook.every(l=>l.under&&l.color),'Tesztek: a linkek színnel és aláhúzással jelöltek '+JSON.stringify(linkLook.filter(l=>!l.under||!l.color)));
   await press(pg.locator('.kk-quiz-setup button[type=submit]'));await pg.locator('#kerdes-cim').waitFor();
   assert.notEqual(await pg.evaluate(()=>getComputedStyle(document.querySelector('.kk-quiz-alert')).display),'none','az időkorlát élő régiója üresen sem display:none');
   await press(pg.getByRole('button',{name:'Teszt megszakítása'}));assert.match(await active(),/^BUTTON:Folytatom/,'megszakítás: a fókusz a „Folytatom” gombon');
   await pg.keyboard.press('Enter');assert.match(await active(),/^BUTTON:Teszt megszakítása/,'„Folytatom” után vissza a kiváltó gombra');
   await press(pg.getByRole('button',{name:'Időkorlát kikapcsolása'}));assert.match(await active(),/^P:Időkorlát nélkül/,'időkorlát kikapcsolása után a jelzésen');
   await press(pg.locator('.kk-quiz-map').getByRole('button',{name:'Teszt beadása'}));assert.match(await active(),/^BUTTON:Igen, beadom/,'beadás: a fókusz a megerősítésen');
   await press(pg.getByRole('button',{name:'Vissza a kérdésekhez'}));assert.match(await active(),/^BUTTON:Teszt beadása/,'mégse: vissza a kiváltó gombra');
   await press(pg.locator('.kk-quiz-map').getByRole('button',{name:'Teszt beadása'}));await pg.keyboard.press('Enter');
   await pg.locator('#eredmeny-cim').waitFor();assert.match(await active(),/^H2:Eredmény/,'eredmény: a fókusz a címen');
   await press(pg.getByRole('button',{name:'Új teszt'}));await pg.locator('.kk-quiz-setup').waitFor();assert.match(await active(),/^H2:Új teszt/,'új teszt: a fókusz a beállítás címén');
   await press(pg.getByRole('button',{name:'Eredmények törlése'}));assert.match(await active(),/^BUTTON:Mégse/,'törlés: a fókusz a „Mégse” gombon');
   await pg.keyboard.press('Enter');assert.match(await active(),/^BUTTON:Eredmények törlése/,'mégse: vissza a kiváltó gombra');
   await press(pg.getByRole('button',{name:'Eredmények törlése'}));await press(pg.getByRole('button',{name:'Igen, törlöm'}));assert.match(await active(),/^H2:Új teszt/,'törlés után a beállítás címén');
   // Gyakorló: a visszajelzés linkjei linkként jelöltek; az élő régió csak az ítéletet mondja.
   await pg.goto(BASE+'/tudastar/tesztek?hossz=5',{waitUntil:'load'});
   await press(pg.locator('.kk-quiz-setup button[type=submit]'));await pg.locator('#kerdes-cim').waitFor();
   await pg.locator('.kk-quiz-choice').first().click();await pg.getByRole('button',{name:'Ellenőrzés'}).click();await pg.locator('.kk-quiz-feedback').waitFor();
   const fb=await pg.evaluate(()=>({links:[...document.querySelectorAll('.kk-quiz-links a')].map(a=>{const s=getComputedStyle(a);return s.textDecorationLine.includes('underline')}),
    live:[...document.querySelectorAll('.kk-quiz-card [aria-live]')].map(e=>(e.textContent||'').length)}));
   assert.ok(fb.links.length>=2&&fb.links.every(Boolean),'a visszajelzés linkjei aláhúzottak');
   assert.ok(fb.live.length===1&&fb.live[0]>0&&fb.live[0]<200,'az élő régió csak az ítéletet és a helyes választ mondja ('+fb.live.join(',')+' karakter)');
   await c3.close();
   out.push('Tesztek: fókusz a megerősítéseknél, mégse után, időkorlát kikapcsolása, eredmény, új teszt és törlés után; élő régiók; linkek jelölése');
  }
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
