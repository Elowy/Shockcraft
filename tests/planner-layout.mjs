// Böngészős (Playwright) elrendezési regressziós teszt a tervezőhöz (/tervezo): a „néha a képernyő felét betakarja valami” hibák őre.
// Egy eldobható fiókot regisztrál, és a minta-tervvel (soha nem ment: nincs Mentés, nincs automatikus mentés) méretenként új böngészőkörnyezetet nyit.
//  1. A dokumentum soha nem görög: minden nézetfülön (Telek, Alaprajz, Elosztó, Áramkörök, Egyvonalas, Többvonalas) és az Elosztó „Bekötések” gombja után
//     scrollY = 0, scrollHeight ≤ innerHeight + 1, scrollWidth ≤ innerWidth + 1, a fejléc teteje 0.
//  2. 1050 px-ig a kijelölés (szerelvény, szoba, húzás 120 px, téglalapos kijelölés, ajtó lerakása) nem nyitja meg magától a tulajdonságpanelt,
//     a kijelölési címke látszik; a húzott szerelvény látható marad. Telek nézetben ugyanez (pont lerakása, csomópont kijelölése).
//  3. Kifejezett nyitás (címke, kapcsoló, „Csoport beállításai”): táblagépen a panel teteje ≥ a vászon teteje és minden fül, eszközgomb,
//     Visszavonás/Újra és a Nagyítás önmagát találja el; telefonon alsó lap (alja = a munkaterület alja, magassága ≤ max(55 % / 440 px, min(munkaterület − 64 px, 240 px))). X ≥ 44 px, aria-expanded.
//  4. Bezárás: Escape (a panelben fókusszal is, a fókusz a kapcsolóra tér vissza), Delete, szintváltás, fülváltás, „Kijelölés megszüntetése”; oldalsáv: Escape, háttérréteg.
//  5. Töréspont: nagy ablakban kijelölés + Escape, majd szűkítés → nincs átfedés; nyitott panel/oldalsáv átméretezés után zárva.
//  6. 1051 px-től a panel dokkolt marad (a régi megjelenés: szélesség, kitöltés, nincs panelfej, nincs címke).
//  7. A fülek nem lógnak rá az eszköztárra: minden eszköztár-gomb középpontja önmagát találja el.
//  8. Telek nézet: pont lerakása/csomópont kijelölése nem nyitja a panelt; a kapcsoló nyitja (teteje ≥ a telki vászon teteje), az Escape zárja.
//  9. Sötét módban a panel és a címke háttere átlátszatlan, a szöveg kontrasztos.
// 10. A kijelölés nem rendezi át a fejlécsávot/eszköztárat: a vászon teteje és magassága ±1 px-en belül marad (nem „ugrik” a lenyomás alatt), a kapcsoló mérete nem változik.
// 11. Szellemkattintás: a kijelölő koppintásból származó kattintás nem aktiválhatja a (ugyanott megjelenő) kijelölési címke gombjait – érintésnél a vászon bal felső sarkába
//     húzott szerelvényre koppintva a panel zárva és a kijelölés megmarad; a lenyomás nélküli kattintás (szintetikus) a címkén Alaprajz, Elosztó és Telek nézetben sem hat.
// 12. Fókusz: a címke „Tulajdonságok” gombja a panel bezáró X-ére, a „Kijelölés megszüntetése” a kapcsolóra viszi a fókuszt (Alaprajz és Telek), nem a törzsre.
// 13. Rövid ablak (844x390, 911x512, 667x375): a kapcsolóval nyitott panel (Alaprajz és Telek) a vászon tetejétől indul (nem takarja az eszköztárat), és használható magasságú.
// 14. Billentyűzetes elérés: a címke gombjai Enterrel / szóközzel működnek (click, detail 0), a fókusz a panel X-ére, ill. a kapcsolóra kerül (Alaprajz és Telek).
// Használat (build + wrangler preview után): BASE=http://127.0.0.1:8787 node tests/planner-layout.mjs
// Környezeti változók: SIZES=1024x768,390x844 (csak ezek a méretek; a töréspont-váltásokhoz 1400x900), JOBS=3 (párhuzamos ablakméretek),
// SHOTS=<mappa> (a hibás lépések képernyőképei, alapból a rendszer ideiglenes mappájában), VERBOSE=1 (vizsgálatonkénti idők).
// Playwright: a helyi node_modules-ból, különben a globális telepítésből (npm root -g); böngészőt nem telepít. Kilépési kód: 0 = minden rendben, 1 = hiba.
import {execSync} from 'node:child_process';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {AsyncLocalStorage} from 'node:async_hooks';

const BASE=(process.env.BASE||'http://127.0.0.1:8787').replace(/\/$/,'');
if(!['127.0.0.1','localhost','[::1]'].includes(new URL(BASE).hostname))throw Error('Csak helyi (loopback) kiszolgáló használható: a teszt fiókot hoz létre.');
const SHOTS=(process.env.SHOTS||join(tmpdir(),'planner-layout-shots')).replace(/\/?$/,'/');
let pw;
try{pw=await import('playwright')}catch{pw=await import(pathToFileURL(join(execSync('npm root -g').toString().trim(),'playwright','index.mjs')).href)}

// A vizsgált ablakméretek ([szélesség, magasság, érintéses]); a töréspontok: 1050 px (keskeny) és 760 px (telefon), lásd hooks/use-media-query.ts.
const ALL=[[1920,1080],[1440,900],[1366,768],[1280,720],[1093,614],[1051,800],[1050,800],[1024,768],[911,512],[900,700],[844,390,1],[820,1180,1],[768,1024],[667,375,1],[390,844,1],[360,740,1]]
 .map(([w,h,t])=>({w,h,touch:!!t,name:w+'x'+h+(t?' (érintés)':''),narrow:w<=1050,phone:w<=760,stat:{checks:0,bad:0}}));
const only=(process.env.SIZES||'').split(',').filter(Boolean);
const SIZES=only.length?ALL.filter(s=>only.includes(s.w+'x'+s.h)):ALL;
const TOOLBAR_SIZES=['1093x614','1280x720','844x390','390x844'];
// A kijelölés nem mozgathatja a vásznat: a lenyomás pillanatában megugró vászon alól kicsúszik a húzott elem. A néhány px-es (keret/kitöltés miatti) eltérést megengedjük.
const SHIFT=1;
const TABS=['Telek','Alaprajz','Elosztó','Áramkörök','Egyvonalas','Többvonalas'];

// ---- Eredménygyűjtés: a hibák nem szakítják meg a futást, a végén összegzés és kilépési kód.
// A vizsgálatok ablakméretenként párhuzamosan futnak: a „hol” (ablakméret · vizsgálat) a futási környezetből (AsyncLocalStorage) jön.
const fails=[],als=new AsyncLocalStorage(),VERBOSE=!!process.env.VERBOSE;let checks=0;
const ok=(cond,msg)=>{checks++;const s=als.getStore(),st=s?.size?.stat;if(st)st.checks++;if(!cond){const f={where:s?.where||'',msg};s?.own.push(f);fails.push(f);if(st)st.bad++}};
const f1=n=>Math.round(n*10)/10;

// ---- Böngészőben futó segédek (init script): láthatóság, takarás, címke.
function installHelpers(){
 const label=e=>(e.getAttribute('aria-label')||e.getAttribute('title')||e.textContent||'').replace(/\s+/g,' ').trim();
 const vis=e=>{if(!e||!e.isConnected)return false;const r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return false;const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>0};
 const all=(css,text)=>[...document.querySelectorAll(css)].filter(e=>vis(e)&&(!text||label(e)===text));
 const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,r:r.right,b:r.bottom,cx:r.x+r.width/2,cy:r.y+r.height/2}};
 const desc=e=>!e?'semmi':e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\s+/).slice(0,2).join('.'):'')+(label(e)?' „'+label(e).slice(0,30)+'”':'');
 const hit=e=>{const r=rect(e);if(r.cx<0||r.cy<0||r.cx>=innerWidth||r.cy>=innerHeight)return {ok:false,why:'a nézeten kívül van ('+Math.round(r.cx)+', '+Math.round(r.cy)+')'};const h=document.elementFromPoint(r.cx,r.cy);return h&&(h===e||e.contains(h))?{ok:true}:{ok:false,why:'takarja: '+desc(h)}};
 const frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(r,60))));
 // A szerkesztő saját görgető tárolója (.center) a vászon tetejére görgetve: így a vászon látszik, és a mérések ehhez az állapothoz tartoznak.
 const focusCanvas=async()=>{const c=document.querySelector('.center .canvas,.center .board-view');if(c)c.scrollIntoView({block:'start',inline:'nearest'});await frame()};
 // Az SVG-elem helyi origójának képernyőkoordinátája (szerelvény, telki csomópont).
 const origin=g=>{const m=g.getScreenCTM();return {x:m.e,y:m.f}};
 const state=()=>{
  const panel=all('aside.right.opened,aside.plot-inspector.opened')[0],chip=all('.selection-chip')[0],tg=all('.planbar .inspector-toggle,.plot-properties-toggle')[0],lw=all('.leftwrap.opened')[0],sc=all('.drawer-scrim')[0];
  const cs=panel&&getComputedStyle(panel);
  return {
   anyOpened:document.querySelectorAll('aside.right.opened,aside.plot-inspector.opened').length,
   panel:panel?{...rect(panel),hit:hit(panel),pos:cs.position,bg:cs.backgroundColor}:null,
   chip:chip?{...rect(chip),hit:hit(chip.querySelector('.selection-open')||chip),text:(chip.querySelector('span')||chip).textContent.trim(),btns:[...chip.querySelectorAll('button')].map(b=>rect(b).h)}:null,
   toggle:tg?{exp:tg.getAttribute('aria-expanded'),cls:tg.className,text:tg.textContent.trim(),label:tg.getAttribute('aria-label'),...rect(tg)}:null,
   drawer:!!lw,scrim:!!sc
  };
 };
 window.__pl={label,vis,all,rect,desc,hit,frame,focusCanvas,origin,state};
}

// ---- Fiók és környezet
async function register(){
 const id=Date.now()+'-'+Math.random().toString(36).slice(2,8);
 const r=await fetch(BASE+'/api/auth/register',{method:'POST',headers:{Origin:BASE,'Content-Type':'application/json'},body:JSON.stringify({name:'Elrendezés teszt',email:'layout-'+id+'@example.test',password:'Elrendezes teszt '+id}),signal:AbortSignal.timeout(20000)});
 if(r.status!==200)throw Error('Regisztráció sikertelen: HTTP '+r.status+' '+(await r.text()).slice(0,200));
 const [name,...v]=(r.headers.get('set-cookie')||'').split(';')[0].split('=');
 if(!name||!v.length)throw Error('A regisztráció nem adott munkamenet-sütit.');
 return {name,value:v.join('=')};
}
let COOKIE;
const errorsAll=[];
// Új, tiszta böngészőkörnyezet (tiszta localStorage): a minta-terv betöltve, a hidratálás kész.
async function openEnv(browser,size,{scheme='light',w=size.w,h=size.h,url='/tervezo'}={}){
 const context=await browser.newContext({viewport:{width:w,height:h},isMobile:size.touch,hasTouch:size.touch,deviceScaleFactor:1,colorScheme:scheme});
 await context.addCookies([{...COOKIE,url:BASE}]);
 await context.addInitScript(()=>{try{localStorage.setItem('shockcraft-cookie-notice-v1',String(Date.now()))}catch{}});
 await context.addInitScript(installHelpers);
 const page=await context.newPage();page.setDefaultTimeout(10000);
 page.on('dialog',d=>d.accept().catch(()=>{}));
 const env={browser,context,page,size,touch:size.touch,cdp:null,errors:[]};
 page.on('pageerror',e=>{const m=String(e&&e.message||e);env.errors.push(m);errorsAll.push(size.name+': '+m)});
 if(size.touch)env.cdp=await context.newCDPSession(page);
 await page.goto(BASE+url,{waitUntil:'load'});
 await page.waitForFunction(()=>document.querySelector('#plan-svg')&&document.querySelectorAll('[data-device-id]').length>0&&!document.querySelector('.loading-plan')&&document.querySelector('button[aria-label="Projekt mentése"]')?.disabled===false,null,{timeout:30000});
 await settle(env);
 const dims=await page.evaluate(()=>[innerWidth,innerHeight]);
 ok(dims[0]===w&&dims[1]===h,`az ablakméret nem a kért: ${dims.join('x')} (várt ${w}x${h}) – a töréspontok nem mérhetők`);
 return env;
}
const settle=async env=>{await env.page.evaluate(()=>window.__pl.frame());await env.page.waitForTimeout(120)};
// Képernyőkép a hiba pillanatáról (a vizsgálat végén készülő kép már más állapotot mutat): a még kép nélküli hibákhoz csatolva.
async function flush(env){
 const s=als.getStore();if(!s)return;const bad=s.own.filter(f=>!f.shot);if(!bad.length)return;
 try{mkdirSync(SHOTS,{recursive:true});const file=SHOTS+(env.size.w+'x'+env.size.h+'-'+s.where.split(' · ').slice(1).join('-')+'-'+(++s.n)).replace(/[^a-z0-9-]+/gi,'_')+'.png';await env.page.screenshot({path:file});for(const f of bad)f.shot=file}catch{}
}
async function withEnv(browser,size,name,fn,opts){
 const store={where:size.name+' · '+name,own:[],size,n:0},t0=Date.now();
 await als.run(store,async()=>{
  let env;
  try{env=await openEnv(browser,size,opts);await fn(env)}
  catch(e){ok(false,'kivétel: '+String(e&&e.message||e).split('\n')[0].slice(0,300))}
  if(env)await flush(env);
  if(env)await env.context.close().catch(()=>{});
 });
 if(VERBOSE)console.log(`  ${store.where}: ${((Date.now()-t0)/1000).toFixed(1)} s, ${store.own.length} hiba`);
}

// ---- Bemenet: egér (asztali) vagy CDP-érintés (érintéses méretek)
const touchPt=(x,y)=>({x,y,id:1,radiusX:1,radiusY:1,force:1});
async function pdown(env,x,y){if(env.touch)await env.cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touchPt(x,y)]});else{await env.page.mouse.move(x,y);await env.page.mouse.down()}}
async function pmove(env,x,y){if(env.touch)await env.cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[touchPt(x,y)]});else await env.page.mouse.move(x,y)}
async function pup(env){if(env.touch)await env.cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await env.page.mouse.up()}
async function tapAt(env,x,y){await pdown(env,x,y);await env.page.waitForTimeout(40);await pup(env);await settle(env)}
async function dragTo(env,a,b,steps=8){await pdown(env,a.x,a.y);for(let i=1;i<=steps;i++){await pmove(env,a.x+(b.x-a.x)*i/steps,a.y+(b.y-a.y)*i/steps);await env.page.waitForTimeout(16)}await pup(env);await settle(env)}
// Valódi koppintás/kattintás egy gombra: előbb a takarás ellenőrzése (a fedett gomb hiba, és nem kattintunk rá).
async function press(env,css,text,what){
 const r=await env.page.evaluate(async([css,text])=>{const P=window.__pl,el=P.all(css,text)[0];if(!el)return null;el.scrollIntoView({block:'start',inline:'nearest'});await P.frame();return {...P.hit(el),...P.rect(el)}},[css,text]);
 if(!r){ok(false,`${what||css}: nem található / nem látható`);return false}
 if(!r.ok){ok(false,`${what||css}: nem kattintható, ${r.why}`);return false}
 if(env.touch)await env.page.touchscreen.tap(r.cx,r.cy);else await env.page.mouse.click(r.cx,r.cy);
 await settle(env);return true;
}
// Nézetfül váltása; ha a fület valami takarja, hibát jelez, de a fókuszálással (Radix automatikus aktiválás) tovább lép.
async function selectTab(env,name){
 const st=await env.page.evaluate(async name=>{const P=window.__pl,el=P.all('.view-tabs button',name)[0];if(!el)return null;el.scrollIntoView({block:'start',inline:'nearest'});await P.frame();return P.hit(el)},name);
 if(!st){ok(false,`„${name}” fül nem található`);return false}
 if(st.ok){const r=await env.page.evaluate(name=>window.__pl.rect(window.__pl.all('.view-tabs button',name)[0]),name);if(env.touch)await env.page.touchscreen.tap(r.cx,r.cy);else await env.page.mouse.click(r.cx,r.cy)}
 else{ok(false,`„${name}” fül nem kattintható, ${st.why}`);await env.page.evaluate(name=>window.__pl.all('.view-tabs button',name)[0].focus(),name)}
 await env.page.waitForFunction(name=>window.__pl.all('.view-tabs button',name)[0]?.getAttribute('data-state')==='active',name,{timeout:5000}).catch(()=>ok(false,`„${name}” fül nem vált aktívvá`));
 await settle(env);return true;
}
const key=async(env,k)=>{await env.page.keyboard.press(k);await settle(env)};
const blur=env=>env.page.evaluate(()=>document.activeElement&&document.activeElement.blur&&document.activeElement.blur());
const st=env=>env.page.evaluate(()=>window.__pl.state());
const doc=env=>env.page.evaluate(()=>({y:scrollY,x:scrollX,sh:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth,iw:innerWidth,ih:innerHeight,top:document.querySelector('.topbar')?.getBoundingClientRect().top,topH:document.querySelector('.topbar')?.getBoundingClientRect().height}));
async function checkDoc(env,what){const d=await doc(env);const b=fails.length;
 ok(d.y===0&&d.x===0,`${what}: a dokumentum görgetve (scrollY=${d.y}, scrollX=${d.x})`);
 ok(d.sh<=d.ih+1,`${what}: a dokumentum magasabb az ablaknál (scrollHeight=${d.sh} > innerHeight=${d.ih})`);
 ok(d.sw<=d.iw+1,`${what}: a dokumentum szélesebb az ablaknál (scrollWidth=${d.sw} > innerWidth=${d.iw})`);
 ok(d.top===0,`${what}: a fejléc nem a lap tetején van (top=${d.top})`);if(fails.length>b)await flush(env)}

// ---- A minta-terv elemei az Alaprajz nézetben
// Koppintható szerelvény (a középpontja önmagát találja el); a vászon előbb a nézetbe görgetve.
async function devices(env){
 return env.page.evaluate(async()=>{const P=window.__pl;await P.focusCanvas();const out=[];
  for(const g of document.querySelectorAll('#plan-svg [data-device-id]')){const o=P.origin(g),h=document.elementFromPoint(o.x,o.y);out.push({id:g.getAttribute('data-device-id'),x:o.x,y:o.y,ok:!!h&&g.contains(h)})}
  const c=P.rect(document.querySelector('.center .canvas'));return {list:out,canvas:c}});
}
async function canvasRect(env){return env.page.evaluate(()=>window.__pl.rect(document.querySelector('.center .canvas')))}
// Szoba belső pontja, ahol az elemek közül a szoba téglalapja a legfelső.
async function roomPoint(env){
 return env.page.evaluate(async()=>{const P=window.__pl;await P.focusCanvas();const svg=document.querySelector('#plan-svg');
  for(const r of svg.querySelectorAll('g > rect[fill*="plan-room"]')){const b=r.getBoundingClientRect();
   for(let i=1;i<10;i++)for(let j=1;j<10;j++){const x=b.x+b.width*i/10,y=b.y+b.height*j/10,h=document.elementFromPoint(x,y);if(h===r)return {x,y}}}
  return null});
}
// Fal közepe (a leghosszabb látható falszakaszok), ahová ajtó rakható.
async function wallPoints(env){
 return env.page.evaluate(async()=>{const P=window.__pl;await P.focusCanvas();const out=[];
  for(const l of document.querySelectorAll('#plan-svg [data-wall-host] line:not([stroke="transparent"])')){const b=l.getBoundingClientRect();out.push({x:b.x+b.width/2,y:b.y+b.height/2,len:Math.hypot(b.width,b.height)})}
  return out.sort((a,b)=>b.len-a.len).slice(0,6)});
}
async function selectDevice(env){
 const d=await devices(env),t=d.list.find(x=>x.ok);
 if(!t){ok(false,'nincs koppintható szerelvény az alaprajzon (mind takart)');return null}
 await tapAt(env,t.x,t.y);const c=await canvasRect(env);
 return {...t,canvas:d.canvas,shift:{dy:c.y-d.canvas.y,dh:c.h-d.canvas.h}};
}
// Két szerelvényt tartalmazó téglalapos kijelölés a „Többes kijelölés” eszközzel.
async function marquee(env){
 if(!await press(env,'.toolbar button','Többes kijelölés','„Többes kijelölés” eszköz'))return false;
 const d=await devices(env),c=d.canvas,xs=d.list.map(v=>v.x),ys=d.list.map(v=>v.y),m=28;
 const a={x:Math.max(c.x+3,Math.min(...xs)-m),y:Math.max(c.y+3,Math.min(...ys)-m)},b={x:Math.min(c.r-3,Math.max(...xs)+m),y:Math.min(c.b-3,Math.max(...ys)+m)};
 await dragTo(env,a,b,10);return true;
}
async function openChip(env,what){
 const had=await press(env,'.selection-chip .selection-open','Tulajdonságok',what||'címke „Tulajdonságok” gombja');
 await env.page.waitForTimeout(150);await settle(env);return had;
}

// ---- Vizsgálatok közös részei
async function panelGeometry(env,what,{canvasSel='.center .canvas,.center .board-view',bodySel='.work'}={}){
 const s=await st(env),size=env.size;
 if(!s.panel){ok(false,`${what}: a panel nem nyílt meg`);return s}
 ok(s.panel.hit.ok,`${what}: a nyitott panelt valami takarja (${s.panel.hit.why})`);
 ok(s.toggle?.exp==='true','aria-expanded nem „true” a nyitott panelnél ('+what+')');
 const g=await env.page.evaluate(([cs,bs])=>{const P=window.__pl,c=P.all(cs)[0],w=document.querySelector(bs),x=P.all('.inspector-close')[0];return {canvas:c?P.rect(c):null,work:P.rect(w),close:x?P.rect(x):null}},[canvasSel,bodySel]);
 if(size.phone){
  ok(Math.abs(s.panel.b-g.work.b)<=1.5,`${what}: telefonon az alsó lap alja nem a munkaterület alján van (alja ${f1(s.panel.b)} ≠ ${f1(g.work.b)})`);
  ok(s.panel.h<=Math.max(Math.min(g.work.h*.55,440),Math.min(g.work.h-64,240))+1.5,`${what}: telefonon az alsó lap túl magas (${f1(s.panel.h)} px a ${f1(g.work.h)} px-es munkaterületből = ${Math.round(s.panel.h/g.work.h*100)} %, megengedett ≤ max(55 % (legfeljebb 440 px), min(munkaterület − 64 px, 240 px)))`);
  ok(s.panel.x<=1&&s.panel.r>=size.w-1,`${what}: az alsó lap nem teljes szélességű (${f1(s.panel.x)}–${f1(s.panel.r)})`);
 }else{
  ok(s.panel.w<=size.w-56+1,`${what}: a panel szélessége ${f1(s.panel.w)} px > ablak − 56 (${size.w-56})`);
  ok(!g.canvas||s.panel.y>=g.canvas.y-1,`${what}: a panel teteje (${f1(s.panel.y)}) a vászon teteje (${f1(g.canvas?.y)}) fölé nyúlik`);
  ok(s.panel.r<=size.w+1&&s.panel.x>=0,`${what}: a panel kilóg az ablakból (${f1(s.panel.x)}–${f1(s.panel.r)})`);
 }
 ok(!g.close||(g.close.w>=43.5&&g.close.h>=43.5),`${what}: a bezáró X kisebb 44×44 px-nél (${g.close&&f1(g.close.w)}×${g.close&&f1(g.close.h)})`);
 ok(s.panel.h>=Math.min(100,g.work.h*.5),`${what}: a nyitott panel használhatatlanul alacsony (${f1(s.panel.h)} px a ${f1(g.work.h)} px-es munkaterületből)`);
 ok(size.phone||s.panel.h>=200,`${what}: a nyitott panel túl alacsony (${f1(s.panel.h)} px, táblagépen kell ≥ 200) – összenyomódott a szülője?`);
 await flush(env);return s;
}
// A fülek, az eszköztár gombjai, a Visszavonás/Újra, a nagyítás és a kapcsoló középpontja önmagát találja el.
// scroll=true: minden vezérlőt előbb a görgetőtároló tetejére görgetünk; scroll=false: csak azokat vizsgáljuk, amelyek éppen látszanak (a felhasználó nézete).
async function hitControls(env,what,groups,{scroll=true,allowEmpty=false}={}){
 const res=await env.page.evaluate(async([groups,scroll])=>{const P=window.__pl,out=[],c=P.rect(document.querySelector('.center'));
  for(const [css,text] of groups)for(const el of P.all(css,text)){
   if(scroll){el.scrollIntoView({block:'start',inline:'nearest'});await P.frame()}
   else{const r=P.rect(el);if(r.cy<c.y||r.cy>c.b||r.cx<0||r.cx>=innerWidth)continue}
   out.push({label:P.label(el)||P.desc(el),css,...P.hit(el)})}
  return out},[groups,scroll]);
 ok(res.length>0||allowEmpty,`${what}: nincs vizsgálható vezérlő`);
 for(const r of res)ok(r.ok,`${what}: „${r.label}” (${r.css}) nem érhető el, ${r.why}`);
 await flush(env);return res.length;
}
// Telefonon az alsó lap a munkaterület alsó felét takarja, ott a vászon (és a nagyítás) a lap mögé kerülhet: a nagyítást csak táblagépen követeljük meg.
const ctrl=size=>[['.view-tabs button'],['.planbar .inspector-toggle'],['.toolbar button'],...(size.phone?[]:[['.zoom button']])];

// ---- Vizsgálatok

// 1. A dokumentum soha nem görög.
async function t1DocumentScroll(browser,size){
 await withEnv(browser,size,'dokumentum nem görög',async env=>{
  await checkDoc(env,'betöltés után');
  for(const tab of TABS){
   await selectTab(env,tab);await env.page.waitForTimeout(250);
   await checkDoc(env,`„${tab}” nézet`);
   if(tab==='Elosztó'){
    if(await press(env,'.board-actions button','Bekötések','Elosztó „Bekötések” gomb')){
     await env.page.waitForTimeout(1100);await checkDoc(env,'Elosztó „Bekötések” után');
     const r=await env.page.evaluate(()=>{const e=document.getElementById('board-wiring'),b=e&&e.closest('.board-view');if(!e||!b)return null;const x=e.getBoundingClientRect(),y=b.getBoundingClientRect();return {t:x.top,bt:y.top,bb:y.bottom,st:b.scrollTop}});
     ok(r&&r.t>=r.bt-2&&r.t<r.bb,'Elosztó „Bekötések” után a „Bekötések” szakasz nem látszik a saját görgetőtárolóban'+(r?` (teteje ${f1(r.t)}, tároló ${f1(r.bt)}–${f1(r.bb)})`:' (nincs #board-wiring / .board-view)'));
    }
   }
  }
  ok(env.errors.length===0,'JS-hiba a lapon: '+env.errors.join(' | ').slice(0,300));
 });
}

// 2. Nincs automatikus nyitás 1050 px-ig.
async function t2NoAutoOpen(browser,size){
 let env_;
 const noPanel=async what=>{const s=await st(env_);ok(s.anyOpened===0&&!s.panel,`${what}: magától kinyílt a tulajdonságpanel`);return s};
 const chipOk=async(what,re)=>{const s=await st(env_);ok(!!s.chip,`${what}: nincs kijelölési címke`);if(s.chip){ok(s.chip.hit.ok,`${what}: a kijelölési címke nem látszik / takart (${s.chip.hit.why})`);if(re)ok(re.test(s.chip.text),`${what}: a címke szövege „${s.chip.text}”`)}return s};
 await withEnv(browser,size,'szerelvény kijelölése',async env=>{env_=env;
  const tg0=(await st(env)).toggle;
  const t=await selectDevice(env);if(!t)return;
  await noPanel('szerelvény kijelölése');const s=await chipOk('szerelvény kijelölése',/^Kijelölve: \S/);
  ok(tg0&&s.toggle&&Math.abs(tg0.w-s.toggle.w)<=.5&&Math.abs(tg0.h-s.toggle.h)<=.5,`a kijelöléstől a „Tulajdonságok” kapcsoló mérete változik (${tg0&&f1(tg0.w)}×${tg0&&f1(tg0.h)} → ${s.toggle&&f1(s.toggle.w)}×${s.toggle&&f1(s.toggle.h)}): átrendeződik a fejlécsáv`);
  ok(Math.abs(t.shift.dy)<=SHIFT&&Math.abs(t.shift.dh)<=SHIFT,`a kijelöléstől a vászon megugrik: teteje ${f1(t.shift.dy)} px-szel, magassága ${f1(t.shift.dh)} px-szel változott (megengedett ±${SHIFT} px) – a kijelölés átrendezi a fejlécsávot (a kapcsoló mérete változik)`);
  ok(s.toggle&&/has-selection/.test(s.toggle.cls),'a kapcsoló nem jelzi a kijelölést (has-selection): '+JSON.stringify(s.toggle));
  ok(s.toggle?.exp==='false','zárt panelnél aria-expanded nem „false”');
  const tall=size.touch?43.5:35.5;for(const h of s.chip?.btns||[])ok(h>=tall,`a kijelölési címke gombja alacsony (${f1(h)} px, kell ≥ ${size.touch?44:36})`);
  // Egy másik szerelvényt koppintva a címke követi a kijelölést; a panel továbbra sem nyílik.
  const d=await devices(env),o=d.list.filter(x=>x.ok&&x.id!==t.id)[0];
  if(o){await tapAt(env,o.x,o.y);await noPanel('második szerelvény kijelölése');await chipOk('második szerelvény kijelölése')}
 });
 await withEnv(browser,size,'szoba kijelölése',async env=>{env_=env;
  const p=await roomPoint(env);if(!p){ok(false,'nem találtam szobafelületet a koppintáshoz');return}
  await tapAt(env,p.x,p.y);await noPanel('szoba kijelölése');await chipOk('szoba kijelölése',/^Kijelölve: \S/);
 });
 await withEnv(browser,size,'szerelvény húzása 120 px',async env=>{env_=env;
  const d=await devices(env),c=d.canvas,t=d.list.find(x=>x.ok);if(!t){ok(false,'nincs koppintható szerelvény');return}
  const cands=[[120,0],[-120,0],[0,120],[0,-120],[84,84],[-84,-84],[84,-84],[-84,84]].map(([dx,dy])=>({x:t.x+dx,y:t.y+dy}))
   .filter(q=>q.x>c.x+24&&q.x<c.r-24&&q.y>c.y+24&&q.y<c.b-24&&!(q.x<c.x+320&&q.y<c.y+64));
  const to=cands[0];if(!to){ok(false,`nincs hely a 120 px-es húzásra a vásznon (${f1(c.w)}×${f1(c.h)})`);return}
  await dragTo(env,{x:t.x,y:t.y},to,10);
  await noPanel('szerelvény húzása');await chipOk('szerelvény húzása');
  const r=await env.page.evaluate(id=>{const g=document.querySelector('#plan-svg [data-device-id="'+id+'"]');if(!g)return null;const o=window.__pl.origin(g),h=document.elementFromPoint(o.x,o.y);return {x:o.x,y:o.y,inSvg:!!(h&&h.closest('#plan-svg')),hit:window.__pl.desc(h)}},t.id);
  ok(!!r,'a húzott szerelvény eltűnt a rajzról');
  if(r){ok(Math.hypot(r.x-t.x,r.y-t.y)>=60,`a szerelvény nem mozdult el a húzásra (elmozdulás ${f1(Math.hypot(r.x-t.x,r.y-t.y))} px)`);
   ok(r.inSvg,`a húzott szerelvény új helyén (${Math.round(r.x)}, ${Math.round(r.y)}) nem a rajz látszik, hanem: ${r.hit}`);
   ok(Math.hypot(r.x-to.x,r.y-to.y)<=24,`a húzott szerelvény nem a lerakás helyén áll: ${f1(Math.hypot(r.x-to.x,r.y-to.y))} px-re az ujjtól/egértől (a lenyomás után megugrott a vászon?)`)}
 });
 await withEnv(browser,size,'téglalapos kijelölés',async env=>{env_=env;
  if(!await marquee(env))return;
  await noPanel('téglalapos kijelölés');await chipOk('téglalapos kijelölés',/^\d+ elem kijelölve$/);
  const m=await env.page.evaluate(()=>{const e=window.__pl.all('.multi-context')[0];return e?e.textContent:''});
  ok(/\d+ elem kijelölve/.test(m),'a többes kijelölés sávja („.multi-context”) nem jelzi a kijelölést: '+m.slice(0,80));
 });
 await withEnv(browser,size,'ajtó lerakása',async env=>{env_=env;
  if(!await press(env,'.toolbar button','Ajtó / ablak','„Ajtó / ablak” eszköz'))return;
  const ws=await wallPoints(env);let placed=false;
  for(const w of ws){await tapAt(env,w.x,w.y);const s=await st(env);if(s.chip){placed=true;break}}
  ok(placed,'az ajtó nem rakható le a falra (nincs kijelölés a lerakás után)');
  await noPanel('ajtó lerakása');if(placed)await chipOk('ajtó lerakása',/^Kijelölve: \S/);
 });
}

// 3. Kifejezett nyitás: a címke, a kapcsoló és a „Csoport beállításai”.
async function t3ExplicitOpen(browser,size){
 await withEnv(browser,size,'nyitás a címkéről',async env=>{
  if(!await selectDevice(env))return;
  if(!await openChip(env))return;
  const s=await panelGeometry(env,'nyitás a címkéről');await checkDoc(env,'nyitott panel (címkéről)');
  const fo=await env.page.evaluate(()=>({inClose:!!document.activeElement?.closest('#editor-inspector')&&document.activeElement.classList.contains('inspector-close'),what:window.__pl.desc(document.activeElement)}));
  ok(fo.inClose,'a címke „Tulajdonságok” gombja után a fókusz nem a panel bezáró X-ére került, hanem: '+fo.what);
  ok(!s.chip,'a kijelölési címke nyitott panel mellett is látszik');
  ok(s.panel&&s.panel.pos==='absolute','a keskeny nézet panelje nem átfedő (position≠absolute): '+s.panel?.pos);
  await settle(env);await hitControls(env,'nyitott panel mellett',ctrl(size));
  if(!size.phone){const wz=await env.page.evaluate(()=>window.__pl.all('.zoom button').map(b=>window.__pl.label(b)));
   ok(wz.includes('Nagyítás')&&wz.includes('Kicsinyítés'),'a nagyítás gombjai nem látszanak a nyitott panel mellett: '+wz.join(','))}
  // A panel tartalma a végéig görgethető, az X (a panelfej) a helyén marad.
  const sc=await env.page.evaluate(async()=>{const b=document.querySelector('#editor-inspector .inspector-body');b.scrollTop=1e5;await window.__pl.frame();const x=document.querySelector('#editor-inspector .inspector-close').getBoundingClientRect();return {top:x.top,h:x.height,pt:document.querySelector('#editor-inspector').getBoundingClientRect().top}});
  ok(Math.abs(sc.top-sc.pt)<=1.5,`a panel aljára görgetve a bezáró X elmozdult (${f1(sc.top)} ≠ ${f1(sc.pt)})`);
 });
 await withEnv(browser,size,'nyitás a kapcsolóról',async env=>{
  if(!await selectDevice(env))return;
  // A tulajdonság-kapcsoló a fejlécsávban van: a görgetőtároló tetejére görgetve érhető el.
  await env.page.evaluate(async()=>{document.querySelector('.center').scrollTop=0;await window.__pl.frame()});
  if(!await press(env,'.planbar .inspector-toggle','Tulajdonságok','kapcsoló „Tulajdonságok”'))return;
  await env.page.waitForTimeout(150);await settle(env);
  await panelGeometry(env,'nyitás a kapcsolóról');await checkDoc(env,'nyitott panel (kapcsolóról)');
  // Görgetés nélkül, a felhasználó tényleges nézetében (a görgetőtároló tetején): a panel nem takarhat látszó vezérlőt.
  if(!size.phone)await hitControls(env,'a kapcsolóval nyitott panel mellett (görgetés nélkül)',ctrl(size),{scroll:false});
  await hitControls(env,'a kapcsolóval nyitott panel mellett',ctrl(size));
  // Újra a kapcsolóra koppintva a panel zárul, a kapcsoló aria-expanded=false.
  await env.page.evaluate(async()=>{document.querySelector('.center').scrollTop=0;await window.__pl.frame()});
  if(await press(env,'.planbar .inspector-toggle','Tulajdonságok','kapcsoló (bezárás)')){const s=await st(env);ok(!s.panel&&s.toggle?.exp==='false','a kapcsoló nem zárta a panelt')}
 });
 await withEnv(browser,size,'csoport beállításai',async env=>{
  if(!await marquee(env))return;
  if(!await press(env,'.multi-context button','Csoport beállításai','„Csoport beállításai”'))return;
  await env.page.waitForTimeout(150);await settle(env);
  await panelGeometry(env,'csoport beállításai');await checkDoc(env,'nyitott panel (csoport beállításai)');
 });
}

// 4. Bezárás.
async function t4Closing(browser,size){
 const open=async env=>{const t=await selectDevice(env);if(!t)return null;if(!await openChip(env))return null;const s=await st(env);if(!s.panel){ok(false,'a bezárási vizsgálat előfeltétele: a panel nem nyílt meg');return null}return t};
 const closed=async(env,what)=>{const s=await st(env);ok(!s.panel&&s.anyOpened===0,`${what}: a panel nyitva maradt`);return s};
 await withEnv(browser,size,'bezárás: Escape',async env=>{
  if(!await open(env))return;await blur(env);await key(env,'Escape');
  const s=await closed(env,'Escape (fókusz a törzsön)');ok(!s.chip,'Escape után a kijelölés megmaradt (címke látszik)');
 });
 await withEnv(browser,size,'bezárás: Escape a panelben',async env=>{
  if(!await open(env))return;
  const f=await env.page.evaluate(()=>{const i=document.querySelector('#editor-inspector input');if(!i)return false;i.focus();return document.activeElement===i});
  ok(f,'nincs beviteli mező a panelben a fókuszvizsgálathoz');
  await key(env,'Escape');await closed(env,'Escape a panelben (fókusz beviteli mezőn)');
  const a=await env.page.evaluate(()=>({tg:document.activeElement?.classList.contains('inspector-toggle'),what:window.__pl.desc(document.activeElement)}));
  ok(a.tg,'Escape után a fókusz nem a kapcsolóra tért vissza, hanem: '+a.what);
  // A bezáró X is visszaadja a fókuszt a kapcsolónak.
  if(await press(env,'.selection-chip .selection-open','Tulajdonságok','címke (újranyitás)')){await env.page.waitForTimeout(150);
   if(await press(env,'#editor-inspector .inspector-close',undefined,'panel bezáró X')){await closed(env,'bezáró X');const b=await env.page.evaluate(()=>document.activeElement?.classList.contains('inspector-toggle'));ok(b,'az X után a fókusz nem a kapcsolóra tért vissza')}}
 });
 await withEnv(browser,size,'bezárás: Delete',async env=>{
  const t=await open(env);if(!t)return;await blur(env);await key(env,'Delete');
  const s=await closed(env,'Delete (a kijelölt elem törlése)');ok(!s.chip,'Delete után a kijelölési címke látszik');
  const gone=await env.page.evaluate(id=>!document.querySelector('#plan-svg [data-device-id="'+id+'"]'),t.id);ok(gone,'Delete nem törölte a kijelölt szerelvényt');
 });
 await withEnv(browser,size,'bezárás: szintváltás',async env=>{
  if(size.phone){
   // Telefonon az oldalsáv (hamburger) maga zárja a panelt; a szintváltás zárja az oldalsávot és törli a kijelölést.
   if(!await selectDevice(env))return;
   if(!await press(env,'.topbar .mobile-toggle',undefined,'hamburger'))return;
   const s0=await st(env);ok(s0.drawer&&s0.scrim,'a hamburger nem nyitotta az oldalsávot / háttérréteget');
   if(await press(env,'.leftwrap.opened button','Emelet+3 m','„Emelet” szint')){const s=await st(env);ok(!s.panel&&!s.drawer&&!s.scrim,'szintváltás után nyitva maradt a panel vagy az oldalsáv');ok(!s.chip,'szintváltás után a kijelölés megmaradt')}
  }else{
   if(!await open(env))return;
   if(await press(env,'.leftwrap button','Emelet+3 m','„Emelet” szint')){const s=await closed(env,'szintváltás');ok(!s.chip,'szintváltás után a kijelölés megmaradt')}
  }
 });
 await withEnv(browser,size,'bezárás: fülváltás',async env=>{
  if(!await open(env))return;
  await selectTab(env,'Elosztó');let s=await closed(env,'fülváltás (Elosztó)');
  await selectTab(env,'Alaprajz');s=await closed(env,'visszaváltás az Alaprajzra');ok(!s.chip,'fülváltás után a kijelölés megmaradt');
 });
 await withEnv(browser,size,'bezárás: Kijelölés megszüntetése',async env=>{
  if(!await marquee(env))return;
  if(!await press(env,'.multi-context button','Csoport beállításai','„Csoport beállításai”'))return;
  await env.page.waitForTimeout(150);
  if(await press(env,'.multi-context button','Kijelölés megszüntetése','„Kijelölés megszüntetése” (sáv)')){const s=await closed(env,'„Kijelölés megszüntetése”');ok(!s.chip,'a kijelölés megszüntetése után a címke látszik')}
 });
 await withEnv(browser,size,'bezárás: címke X',async env=>{
  if(!await selectDevice(env))return;
  if(await press(env,'.selection-chip .selection-clear',undefined,'címke „Kijelölés megszüntetése” gombja')){const s=await st(env);ok(!s.chip&&!s.panel,'a címke X-e nem szüntette meg a kijelölést');
   const fo=await env.page.evaluate(()=>({tg:document.activeElement?.classList.contains('inspector-toggle'),what:window.__pl.desc(document.activeElement)}));
   ok(fo.tg,'a címke „Kijelölés megszüntetése” gombja után a fókusz nem a kapcsolóra került, hanem: '+fo.what);ok(s.toggle&&!/has-selection/.test(s.toggle.cls),'a kapcsoló kijelölés nélkül is figyelmeztet')}
 });
 if(size.phone){
  await withEnv(browser,size,'oldalsáv: Escape és háttérréteg',async env=>{
   if(!await press(env,'.topbar .mobile-toggle',undefined,'hamburger'))return;
   let s=await st(env);ok(s.drawer&&s.scrim,'az oldalsáv nem nyílt meg');
   await blur(env);await key(env,'Escape');s=await st(env);ok(!s.drawer&&!s.scrim,'Escape nem zárta az oldalsávot');
   await press(env,'.topbar .mobile-toggle',undefined,'hamburger');
   // A háttérréteg a drawer melletti sávban koppintható; a koppintás zárja az oldalsávot.
   const q=await env.page.evaluate(()=>{const d=window.__pl.rect(window.__pl.all('.leftwrap.opened')[0]);return {x:(d.r+innerWidth)/2,y:innerHeight/2,hit:window.__pl.desc(document.elementFromPoint((d.r+innerWidth)/2,innerHeight/2))}});
   ok(/drawer-scrim/.test(q.hit),'az oldalsáv mellett nem a háttérréteg van felül: '+q.hit);
   if(env.touch)await env.page.touchscreen.tap(q.x,q.y);else await env.page.mouse.click(q.x,q.y);await settle(env);
   s=await st(env);ok(!s.drawer&&!s.scrim,'a háttérréteg koppintása nem zárta az oldalsávot');
  });
  await withEnv(browser,size,'oldalsáv és panel kölcsönös kizárása',async env=>{
   if(!await open(env))return;
   if(await press(env,'.topbar .mobile-toggle',undefined,'hamburger')){const s=await st(env);ok(s.drawer&&!s.panel,'az oldalsáv és a panel egyszerre nyitva van (drawer='+s.drawer+', panel='+!!s.panel+')')}
  });
 }
}

// 5. Töréspont-váltás.
const docked=env=>env.page.evaluate(()=>{const a=window.__pl.all('#editor-inspector')[0];return a?{pos:getComputedStyle(a).position,cls:a.className}:null});
async function t5Breakpoints(browser,size){
 await withEnv(browser,size,'töréspont: Escape után szűkítés',async env=>{
  const t=await selectDevice(env);if(!t)return;
  let s=await st(env),dk=await docked(env);ok(dk&&dk.pos!=='absolute','1400-on a dokkolt panel nem látszik a kijelölés után');ok(!s.chip,'1400-on címke jelent meg');
  await blur(env);await key(env,'Escape');
  await env.page.setViewportSize({width:960,height:900});await settle(env);await env.page.waitForTimeout(200);
  s=await st(env);ok(s.anyOpened===0&&!s.panel,'1400 → 960 px után szellempanel jelent meg (Escape után)');
  const vis=await env.page.evaluate(()=>window.__pl.all('#editor-inspector').length);ok(vis===0,'960 px-en a (zárt) panel látszik');
 });
 await withEnv(browser,size,'töréspont: nyitás 1024-en, átméretezés',async env=>{
  await env.page.setViewportSize({width:1024,height:900});await settle(env);await env.page.waitForTimeout(200);
  if(!await selectDevice(env))return;if(!await openChip(env))return;
  let s=await st(env);ok(!!s.panel,'a panel nem nyílt meg 1024 px-en');
  await env.page.setViewportSize({width:1400,height:900});await settle(env);await env.page.waitForTimeout(200);
  s=await st(env);const dock=await env.page.evaluate(()=>{const a=window.__pl.all('#editor-inspector')[0];return a?{pos:getComputedStyle(a).position,cls:a.className}:null});
  ok(dock&&dock.pos!=='absolute'&&!/opened/.test(dock.cls),'1400 px-en a panel nem dokkolt, hanem átfedő / nyitott osztályú: '+JSON.stringify(dock));
  await env.page.setViewportSize({width:1000,height:900});await settle(env);await env.page.waitForTimeout(200);
  s=await st(env);ok(s.anyOpened===0&&!s.panel,'1024 → 1400 → 1000 px után a panel nyitva maradt (szellempanel)');
  const vis=await env.page.evaluate(()=>window.__pl.all('#editor-inspector').length);ok(vis===0,'1000 px-en a zárt panel látszik');
 });
 await withEnv(browser,size,'töréspont: oldalsáv 700 → 1200 → 700',async env=>{
  await env.page.setViewportSize({width:700,height:900});await settle(env);await env.page.waitForTimeout(200);
  if(!await press(env,'.topbar .mobile-toggle',undefined,'hamburger'))return;
  let s=await st(env);ok(s.drawer&&s.scrim,'700 px-en az oldalsáv nem nyílt meg');
  await env.page.setViewportSize({width:1200,height:900});await settle(env);await env.page.waitForTimeout(200);
  s=await st(env);ok(!s.drawer&&!s.scrim,'1200 px-en az oldalsáv / háttérréteg nyitva maradt');
  await env.page.setViewportSize({width:700,height:900});await settle(env);await env.page.waitForTimeout(200);
  s=await st(env);ok(!s.drawer&&!s.scrim,'1200 → 700 px után visszajött az oldalsáv / háttérréteg');
  const lw=await env.page.evaluate(()=>window.__pl.all('.leftwrap').length);ok(lw===0,'700 px-en a zárt oldalsáv látszik');
 });
 await withEnv(browser,size,'töréspont: forgatás 1180×820 ↔ 820×1180',async env=>{
  await env.page.setViewportSize({width:1180,height:820});await settle(env);await env.page.waitForTimeout(200);
  if(!await selectDevice(env))return;
  let s=await st(env),dk=await docked(env);ok(dk&&dk.pos!=='absolute'&&!s.chip,'1180 px-en a dokkolt panel nem látszik');
  await env.page.setViewportSize({width:820,height:1180});await settle(env);await env.page.waitForTimeout(200);
  s=await st(env);ok(s.anyOpened===0&&!s.panel,'1180 → 820 px (forgatás) után magától megnyílt a panel');
 });
}

// 6. 1051 px-től a dokkolt elrendezés változatlan.
async function t6Desktop(browser,size){
 await withEnv(browser,size,'asztali, dokkolt panel',async env=>{
  const t=await selectDevice(env);if(!t)return;
  const g=await env.page.evaluate(()=>{const P=window.__pl,a=P.all('#editor-inspector')[0];if(!a)return null;const cs=getComputedStyle(a),b=P.all('#editor-inspector .inspector-body')[0],bar=document.querySelector('#editor-inspector .inspector-bar'),w=P.rect(document.querySelector('.work'));
   return {...P.rect(a),pos:cs.position,pad:[cs.paddingTop,cs.paddingRight,cs.paddingBottom,cs.paddingLeft].join(' '),ovy:cs.overflowY,bodyPad:b?getComputedStyle(b).padding:null,bar:bar?getComputedStyle(bar).display:null,work:w,toggle:P.all('.planbar .inspector-toggle').length,chip:P.all('.selection-chip').length,opened:a.classList.contains('opened'),scrim:P.all('.drawer-scrim').length,leftW:P.all('.leftwrap')[0]?.getBoundingClientRect().width}});
  if(!g){ok(false,'nincs látható dokkolt panel kijelölés után');return}
  const wide=size.w>1250,pad=wide?'26px 20px 26px 20px':'22px 16px 22px 16px';
  ok(g.pos!=='absolute'&&g.pos!=='fixed',`a panel nem dokkolt (position=${g.pos})`);
  ok(Math.abs(g.r-size.w)<=1,`a panel nem az ablak jobb szélén van (jobb szél ${f1(g.r)})`);
  ok(Math.abs(g.w-(wide?270:235))<=1,`a dokkolt panel szélessége ${f1(g.w)} px (a régi: ${wide?270:235})`);
  ok(g.pad===pad,`a dokkolt panel kitöltése „${g.pad}” (a régi: „${pad}”)`);
  ok(g.ovy==='auto',`a dokkolt panel overflow-y értéke ${g.ovy} (a régi: auto)`);
  ok(g.bodyPad==='0px',`a panel törzsének kitöltése ${g.bodyPad} (dokkolva 0 kell)`);
  ok(g.bar==='none',`a panelfej dokkolt módban látszik (display=${g.bar})`);
  ok(Math.abs(g.y-g.work.y)<=1&&Math.abs(g.b-g.work.b)<=1,`a dokkolt panel nem tölti ki a munkaterület magasságát (${f1(g.y)}–${f1(g.b)} a ${f1(g.work.y)}–${f1(g.work.b)} helyett)`);
  ok(g.toggle===0,'a kapcsoló dokkolt módban is látszik');ok(g.chip===0,'a kijelölési címke dokkolt módban is látszik');
  ok(!g.opened,'dokkolt módban a panelen ott az „opened” osztály');ok(g.scrim===0,'asztali nézetben háttérréteg látszik');
  ok(g.leftW>=200,'az oldalsáv nem látszik asztali nézetben');
  await settle(env);await hitControls(env,'asztali elrendezés',[['.view-tabs button'],['.toolbar button'],['.zoom button']]);
  await checkDoc(env,'asztali nézet kijelöléssel');
  // Telek nézet: a dokkolt telki panel látszik, címke nincs.
  await selectTab(env,'Telek');
  const p=await env.page.evaluate(()=>{const P=window.__pl,a=P.all('.plot-inspector')[0];return a?{pos:getComputedStyle(a).position,r:P.rect(a).r,toggle:P.all('.plot-properties-toggle').length,chip:P.all('.selection-chip').length}:null});
  ok(p&&p.pos!=='absolute'&&p.toggle===0&&p.chip===0,'a Telek nézet dokkolt panelje megváltozott: '+JSON.stringify(p));
 });
}

// 7. A fülek nem takarják az eszköztárat.
async function t7Toolbar(browser,size){
 await withEnv(browser,size,'fülek és eszköztár',async env=>{
  const pb=async what=>{const r=await env.page.evaluate(()=>{const p=document.querySelector('.planbar');return {sh:p.scrollHeight,ch:p.clientHeight}});ok(r.sh<=r.ch+1,`${what}: a fejlécsáv tartalma kilóg (scrollHeight ${r.sh} > ${r.ch})`)};
  await pb('alapeszköz');
  await hitControls(env,'alapeszköz',[['.view-tabs button'],['.planbar .inspector-toggle'],['.toolbar button']]);
  if(await press(env,'.toolbar button','Nyomvonal','„Nyomvonal” eszköz')){await pb('Nyomvonal eszköz');await hitControls(env,'Nyomvonal eszköz (kontextussáv)',[['.view-tabs button'],['.toolbar button'],['.contextbar button']])}
  if(await press(env,'.toolbar button','Többes kijelölés','„Többes kijelölés” eszköz')){await hitControls(env,'Többes kijelölés',[['.view-tabs button'],['.toolbar button']])}
  // Egy eszközgombra koppintva valóban az eszköz vált (nem a nézet).
  if(await press(env,'.toolbar button','Fal','„Fal” eszköz')){const a=await env.page.evaluate(()=>({tab:window.__pl.all('.view-tabs button').find(b=>b.getAttribute('data-state')==='active')?.textContent.trim(),tool:window.__pl.all('.toolbar button.active').map(b=>window.__pl.label(b))}));
   ok(a.tab==='Alaprajz'&&a.tool.includes('Fal'),'a „Fal” eszközre koppintás után: nézet='+a.tab+', aktív eszköz='+a.tool.join(','))}
 });
}

// 8. Telek nézet.
async function t8Plot(browser,size){
 await withEnv(browser,size,'Telek nézet',async env=>{
  await selectTab(env,'Telek');await env.page.waitForSelector('svg[aria-label="Telki villamos hálózat"]');await settle(env);
  const focus=()=>env.page.evaluate(async()=>{const c=document.querySelector('.plot-main .canvas');if(c)c.scrollIntoView({block:'start',inline:'nearest'});await window.__pl.frame();return window.__pl.rect(c)});
  const nodes=()=>env.page.evaluate(()=>[...document.querySelectorAll('svg[aria-label="Telki villamos hálózat"] g[transform][style*="grab"]:not([data-route-id])')].map(g=>{const o=window.__pl.origin(g),h=document.elementFromPoint(o.x,o.y);return {x:o.x,y:o.y,ok:!!h&&g.contains(h)}}));
  const noPlotPanel=async what=>{const s=await st(env);ok(s.anyOpened===0&&!s.panel,`${what}: magától kinyílt a telki tulajdonságpanel`);return s};
  await focus();const n0=(await nodes()).length;
  // Pont lerakása
  if(!await press(env,'.plot-editor .toolbar button','Pont elhelyezése','„Pont elhelyezése” eszköz'))return;
  await focus();
  const spot=await env.page.evaluate(async()=>{await window.__pl.frame();const svg=document.querySelector('svg[aria-label="Telki villamos hálózat"]'),p0=svg.querySelector('g > rect[fill*="plot-fill"]').getBoundingClientRect(),cr=document.querySelector('.plot-main .canvas').getBoundingClientRect(),ce=document.querySelector('.center').getBoundingClientRect();
   // A telek téglalapjának a látható részén (rövid ablakban a telek alja a nézeten kívül lehet) keresünk üres pontot.
   const r={x:Math.max(p0.x,cr.x,ce.x)+8,y:Math.max(p0.y,cr.y,ce.y)+8,right:Math.min(p0.right,cr.right,ce.right,innerWidth)-8,bottom:Math.min(p0.bottom,cr.bottom,ce.bottom,innerHeight)-8};r.width=r.right-r.x;r.height=r.bottom-r.y;
   for(const [u,v] of [[.8,.8],[.2,.8],[.8,.2],[.5,.5],[.65,.65],[.35,.65],[.2,.2],[.5,.8]]){const x=r.x+r.width*u,y=r.y+r.height*v,h=document.elementFromPoint(x,y);if(h&&(h===svg||h.parentNode===svg||h.tagName==='rect'&&!h.closest('[style*=grab]')))return {x,y}}return null});
  if(!spot){ok(false,'nincs üres hely a telki vásznon a pont lerakásához');return}
  await tapAt(env,spot.x,spot.y);
  ok((await nodes()).length===n0+1,'a pont lerakása nem hozott létre új csomópontot');
  let s=await noPlotPanel('pont lerakása');ok(!!s.chip&&s.chip.hit.ok,'pont lerakása után nincs látható kijelölési címke');
  ok(s.toggle&&/has-selection/.test(s.toggle.cls),'a telki kapcsoló nem jelzi a kijelölést');
  // Csomópont kijelölése
  await press(env,'.plot-editor .toolbar button','Kijelölés és mozgatás','„Kijelölés” eszköz');await focus();
  const ns=(await nodes()).filter(n=>n.ok);
  if(!ns.length){ok(false,'nincs koppintható csomópont');return}
  await key(env,'Escape');
  // A kijelölés megszűnése átrendezheti a fejlécsávot: a célt az Escape után újra megmérjük, és a kijelölés okozta ugrást is vizsgáljuk.
  const c1=await focus(),ns2=(await nodes()).filter(n=>n.ok);
  if(!ns2.length){ok(false,'nincs koppintható csomópont az Escape után');return}
  await tapAt(env,ns2[0].x,ns2[0].y);const c2=await env.page.evaluate(()=>window.__pl.rect(document.querySelector('.plot-main .canvas')));
  ok(Math.abs(c2.y-c1.y)<=SHIFT&&Math.abs(c2.h-c1.h)<=SHIFT,`a telki kijelöléstől a vászon megugrik: teteje ${f1(c2.y-c1.y)} px-szel, magassága ${f1(c2.h-c1.h)} px-szel változott (megengedett ±${SHIFT} px) – a kijelölés átrendezi az eszköztárat (a kapcsoló mérete változik)`);
  s=await noPlotPanel('csomópont kijelölése');ok(!!s.chip,'csomópont kijelölése után nincs címke');
  const reselect=async()=>{await focus();const n=(await nodes()).filter(x=>x.ok);if(n.length)await tapAt(env,n[0].x,n[0].y)};
  await syntheticClicks(env,'telki címke');
  // A címke „Tulajdonságok” gombja a panel X-ére, a „Kijelölés megszüntetése” a kapcsolóra viszi a fókuszt.
  if(await press(env,'.selection-chip .selection-open','Tulajdonságok','telki címke „Tulajdonságok” gombja')){await env.page.waitForTimeout(150);await settle(env);
   const fo=await env.page.evaluate(()=>({inClose:!!document.activeElement?.closest('#plot-inspector')&&document.activeElement.classList.contains('inspector-close'),what:window.__pl.desc(document.activeElement)}));
   ok(fo.inClose,'a telki címke „Tulajdonságok” gombja után a fókusz nem a panel bezáró X-ére került, hanem: '+fo.what);
   await blur(env);await key(env,'Escape');await reselect()}
  if(await press(env,'.selection-chip .selection-clear',undefined,'telki címke „Kijelölés megszüntetése” gombja')){
   const fo=await env.page.evaluate(()=>({tg:document.activeElement?.classList.contains('plot-properties-toggle'),what:window.__pl.desc(document.activeElement)}));
   ok(fo.tg,'a telki címke „Kijelölés megszüntetése” gombja után a fókusz nem a kapcsolóra került, hanem: '+fo.what);
   await reselect()}
  // A kapcsoló nyitja
  if(!await press(env,'.plot-properties-toggle',undefined,'telki kapcsoló'))return;
  await env.page.waitForTimeout(150);await settle(env);
  s=await panelGeometry(env,'a telki kapcsolóval nyitott panel',{canvasSel:'.plot-main .canvas',bodySel:'.work'});await checkDoc(env,'nyitott telki panel');
  if(!size.phone)await hitControls(env,'nyitott telki panel mellett (görgetés nélkül)',[['.view-tabs button'],['.plot-editor .toolbar button']],{scroll:false,allowEmpty:true});
  await hitControls(env,'nyitott telki panel mellett',[['.view-tabs button'],['.plot-editor .toolbar button']]);
  // Escape zár
  await blur(env);await key(env,'Escape');s=await st(env);ok(s.anyOpened===0&&!s.panel,'Escape nem zárta a telki panelt');
  // Üres kattintás zár: új kijelölés + nyitás, majd üres terület koppintása
  await focus();await tapAt(env,ns2[0].x,ns2[0].y);
  if(await press(env,'.plot-properties-toggle',undefined,'telki kapcsoló (újranyitás)')){
   await env.page.waitForTimeout(150);
   const e=await env.page.evaluate(async()=>{const svg=document.querySelector('svg[aria-label="Telki villamos hálózat"]'),c=document.querySelector('.plot-main .canvas').getBoundingClientRect(),r=svg.querySelector('g > rect[fill*="plot-fill"]').getBoundingClientRect(),p=document.querySelector('.plot-inspector').getBoundingClientRect();
    // üres pont: a telek téglalapján, a panelen kívül
    for(const [u,v] of [[.1,.9],[.1,.5],[.5,.95],[.9,.9]]){const x=r.x+r.width*u,y=r.y+r.height*v;if(x>=c.x&&x<c.right&&y>=c.y&&y<c.bottom&&!(x>=p.left&&x<=p.right&&y>=p.top&&y<=p.bottom)){const h=document.elementFromPoint(x,y);if(h&&!h.closest('[style*=grab]')&&h.closest('svg'))return {x,y}}}return null});
   if(e){await tapAt(env,e.x,e.y);s=await st(env);ok(s.anyOpened===0&&!s.panel,'üres kattintás nem zárta a telki panelt');ok(!s.chip,'üres kattintás után a telki kijelölés megmaradt')}
  }
  // Escape a panelben lévő fókusszal: a fókusz visszatér a kapcsolóra
  await focus();await tapAt(env,ns2[0].x,ns2[0].y);
  if(await press(env,'.plot-properties-toggle',undefined,'telki kapcsoló (harmadszor)')){
   await env.page.waitForTimeout(150);
   const f=await env.page.evaluate(()=>{const i=document.querySelector('.plot-inspector input');if(!i)return false;i.focus();return document.activeElement===i});
   if(f){await key(env,'Escape');s=await st(env);ok(s.anyOpened===0&&!s.panel,'Escape a telki panelben nem zárta a panelt');
    const a=await env.page.evaluate(()=>document.activeElement?.classList.contains('plot-properties-toggle'));ok(a,'Escape után a fókusz nem a telki kapcsolóra tért vissza')}
  }
 });
}

// 11. Szellemkattintás a kijelölési címkén.
// Lenyomás nélküli (szintetikus) kattintás a címke mindkét gombján: nem hathat; a billentyűzetes aktiválás (click, detail 0) viszont igen.
async function syntheticClicks(env,what){
 const before=await st(env);
 if(!before.chip){ok(false,`${what}: nincs kijelölési címke a szellemkattintás vizsgálatához`);return}
 await env.page.evaluate(()=>{for(const sel of ['.selection-open','.selection-clear']){const b=document.querySelector('.selection-chip '+sel);if(b)b.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,detail:1}))}});
 await settle(env);
 const after=await st(env);
 ok(after.anyOpened===0&&!after.panel,`${what}: a lenyomás nélküli kattintás megnyitotta a tulajdonságpanelt (szellemkattintás)`);
 ok(!!after.chip&&after.chip.text===before.chip.text,`${what}: a lenyomás nélküli kattintás megszüntette a kijelölést (szellemkattintás): ${after.chip?after.chip.text:'nincs címke'}`);
}
// A nézet mozgatása az eszköztár „Nézet mozgatása” eszközével (húzás), majd vissza a „Kijelölés” eszközre.
async function panBy(env,dx,dy){
 if(!await press(env,'.toolbar button','Nézet mozgatása','„Nézet mozgatása” eszköz'))return false;
 await env.page.evaluate(()=>window.__pl.focusCanvas());
 // A húzás kezdő- és végpontja a vászon látható részén marad (rövid ablakban a vászon alja a nézeten kívül lehet).
 const v=await env.page.evaluate(()=>{const c=window.__pl.rect(document.querySelector('.center .canvas')),e=document.querySelector('.center').getBoundingClientRect();return {cx:(Math.max(c.x,0)+Math.min(c.r,innerWidth))/2,cy:(Math.max(c.y,e.top)+Math.min(c.b,e.bottom,innerHeight))/2}}),a={x:v.cx-dx/2,y:v.cy-dy/2};
 await dragTo(env,a,{x:a.x+dx,y:a.y+dy},10);
 return press(env,'.toolbar button','Kijelölés','„Kijelölés” eszköz');
}
async function t11Ghost(browser,size){
 await withEnv(browser,size,'szellemkattintás',async env=>{
  const t=await selectDevice(env);if(!t)return;
  const s0=await st(env);if(!s0.chip){ok(false,'szellemkattintás: nincs kijelölési címke');return}
  const g=await env.page.evaluate(()=>{const P=window.__pl,c=P.rect(document.querySelector('.center .canvas')),o=P.rect(P.all('.selection-chip .selection-open')[0]),x=P.rect(P.all('.selection-chip .selection-clear')[0]);return {open:{x:o.cx-c.x,y:o.cy-c.y},clear:{x:x.cx-c.x,y:x.cy-c.y}}});
  await syntheticClicks(env,'szellemkattintás (lenyomás nélküli kattintás)');
  for(const [name,off] of [['„Tulajdonságok” gomb',g.open],['„Kijelölés megszüntetése” gomb',g.clear]]){
   await blur(env);await key(env,'Escape');
   let at=null,last=null;const fx=[1,1];
   // A szerelvényt a címke gombjának helyére toljuk. A húzás és az elmozdulás aránya a vászon méretétől függ (a rajz illesztése, a lenyomás utáni küszöb):
   // minden körben megmérjük a tényleges elmozdulást, és az arányt javítjuk (legfeljebb 8 közelítés).
   for(let i=0;i<8;i++){
    const d=await devices(env),me=d.list.find(x=>x.id===t.id);if(!me)break;
    if(last){for(const k of [0,1]){const want=last.cmd[k],got=k?me.y-last.at.y:me.x-last.at.x;if(Math.abs(want)>8&&got*want>0)fx[k]=Math.min(6,Math.max(.2,got/want))}}
    const goal={x:d.canvas.x+off.x,y:d.canvas.y+off.y},ex=goal.x-me.x,ey=goal.y-me.y;
    if(me.ok&&Math.hypot(ex,ey)<=3){at=goal;break}
    const cmd=[ex/fx[0],ey/fx[1]];last={cmd,at:{x:me.x,y:me.y}};
    if(!await panBy(env,cmd[0],cmd[1]))break;
   }
   if(!at){ok(false,`szellemkattintás: a szerelvény nem vihető a címke ${name}ja alá`);continue}
   await tapAt(env,at.x,at.y);
   const s=await st(env);
   ok(s.anyOpened===0&&!s.panel,`érintés a címke helyére készülő ${name}ra (a szerelvény koppintása): magától kinyílt a panel`);
   ok(!!s.chip&&/^Kijelölve: \S/.test(s.chip.text),`érintés a címke helyére készülő ${name}ra (a szerelvény koppintása): a kijelölés elveszett (${s.chip?s.chip.text:'nincs címke'})`);
  }
 });
}

// 14. Billentyűzetes elérés: a címke gombjai Enterrel / szóközzel működnek (click, detail 0 – a szellemkattintás-őr ezt nem nyelheti el), és a fókusz a helyére kerül
//     (nyitás: a panel X-ére, kijelölés megszüntetése: a kapcsolóra) – Alaprajzon és Telek nézetben is.
async function kbdChip(env,what,{panelSel,toggleSel,select}){
 const focusBtn=sel=>env.page.evaluate(sel=>{const b=document.querySelector(sel);if(!b)return false;b.focus({preventScroll:true});return document.activeElement===b},sel);
 const where=()=>env.page.evaluate(([p,t])=>({inClose:!!document.activeElement?.closest(p)&&document.activeElement.classList.contains('inspector-close'),onToggle:!!document.activeElement?.matches(t),what:window.__pl.desc(document.activeElement)}),[panelSel,toggleSel]);
 if(!await select())return;
 if(!await focusBtn('.selection-chip .selection-open')){ok(false,`${what}: a címke „Tulajdonságok” gombja nem fókuszálható`);return}
 await key(env,'Enter');await env.page.waitForTimeout(150);await settle(env);
 let s=await st(env);
 ok(!!s.panel&&s.toggle?.exp==='true',`${what}: az Enter nem nyitotta meg a tulajdonságpanelt a címke gombján`);
 ok((await where()).inClose,`${what}: az Enterrel nyitás után a fókusz nem a panel bezáró X-ére került, hanem: ${(await where()).what}`);
 await key(env,'Escape');
 if(!await select())return;
 if(!await focusBtn('.selection-chip .selection-clear')){ok(false,`${what}: a címke „Kijelölés megszüntetése” gombja nem fókuszálható`);return}
 await key(env,' ');await env.page.waitForTimeout(150);await settle(env);
 s=await st(env);
 ok(!s.chip&&!s.panel,`${what}: a szóköz nem szüntette meg a kijelölést a címke gombján`);
 const w=await where();ok(w.onToggle,`${what}: a szóközzel törlés után a fókusz nem a kapcsolóra került, hanem: ${w.what}`);
}
async function t14Keyboard(browser,size){
 await withEnv(browser,size,'billentyűs címke',async env=>{
  await kbdChip(env,'Alaprajz',{panelSel:'#editor-inspector',toggleSel:'.planbar .inspector-toggle',select:async()=>!!await selectDevice(env)});
  await selectTab(env,'Telek');await env.page.waitForSelector('svg[aria-label="Telki villamos hálózat"]');await settle(env);
  const node=async()=>env.page.evaluate(async()=>{const c=document.querySelector('.plot-main .canvas');if(c)c.scrollIntoView({block:'start',inline:'nearest'});await window.__pl.frame();
   // A minta-tervben nincs telki pont: a (szintén kijelölhető) épület téglalapjának közepe.
   for(const g of document.querySelectorAll('svg[aria-label="Telki villamos hálózat"] g[style*="grab"]:not([data-route-id])')){const r=g.querySelector('rect')?.getBoundingClientRect();if(!r)continue;const x=r.x+r.width/2,y=r.y+r.height/2,h=document.elementFromPoint(x,y);if(h&&g.contains(h))return {x,y}}return null});
  await kbdChip(env,'Telek',{panelSel:'#plot-inspector',toggleSel:'.plot-properties-toggle',select:async()=>{const n=await node();if(!n){ok(false,'Telek: nincs koppintható épület vagy csomópont a billentyűs vizsgálathoz');return false}await tapAt(env,n.x,n.y);return true}});
 });
}

// 9. Sötét mód.
async function t9Dark(browser,size){
 await withEnv(browser,size,'sötét mód',async env=>{
  if(!await press(env,'.topbar button','Sötét mód','sötét mód kapcsoló'))return;
  const th=await env.page.evaluate(()=>document.documentElement.dataset.theme||document.documentElement.className);ok(/dark/.test(th),'a sötét mód nem kapcsolt be: '+th);
  // A böngésző által számolt szín (rgb/oklch/color-mix) átlátszatlanságát és fényességét vászonnal normalizáljuk.
  const probe=el=>env.page.evaluate(sel=>{const e=document.querySelector(sel);if(!e)return null;const cv=document.createElement('canvas');cv.width=cv.height=1;const x=cv.getContext('2d',{willReadFrequently:true});
   const px=c=>{x.clearRect(0,0,1,1);x.fillStyle='#ff00ff';x.fillStyle=c;x.fillRect(0,0,1,1);return [...x.getImageData(0,0,1,1).data]};
   const cs=getComputedStyle(e),bg=px(cs.backgroundColor),fg=px(cs.color),L=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
   const a=L(fg),b=L(bg);return {bgRaw:cs.backgroundColor,alpha:bg[3],contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)}},el);
  if(!await selectDevice(env))return;
  let s=await st(env);ok(!!s.chip,'sötét módban nincs kijelölési címke');
  const chip=await probe('.selection-chip');if(chip){ok(chip.alpha===255,`sötét módban a kijelölési címke háttere nem átlátszatlan (${chip.bgRaw})`);ok(chip.contrast>=4.5,`sötét módban a címke kontrasztja ${f1(chip.contrast)}:1 (< 4,5)`)}
  if(!await openChip(env))return;
  s=await st(env);ok(!!s.panel,'sötét módban a panel nem nyílt meg');
  for(const sel of ['#editor-inspector']){const p=await probe(sel);ok(p&&p.alpha===255,`sötét módban a panel háttere nem átlátszatlan (${p&&p.bgRaw}, alfa ${p&&p.alpha}/255)`);ok(p&&p.contrast>=4.5,`sötét módban a panel kontrasztja ${p&&f1(p.contrast)}:1 (< 4,5)`)}
  for(const sel of ['#editor-inspector .inspector-bar']){const p=await probe(sel);if(p&&p.alpha!==0)ok(p.alpha===255,`sötét módban a panelfej háttere részben átlátszó (${p.bgRaw})`)}
  if(size.phone){
   // A háttérréteg és az oldalsáv sötét módban: a panelt a hamburger zárja, az oldalsáv hátterének átlátszatlannak kell lennie.
   if(await press(env,'.topbar .mobile-toggle',undefined,'hamburger')){const d=await probe('.leftwrap.opened');ok(d&&d.alpha===255,`sötét módban az oldalsáv háttere nem átlátszatlan (${d&&d.bgRaw})`);
    const sc=await probe('.drawer-scrim');ok(sc&&sc.alpha>=100,`sötét módban a háttérréteg alig sötétít (alfa ${sc&&sc.alpha}/255)`)}
  }
 },{scheme:'light'});
}

// ---- Futtatás
const t0=Date.now();
const browser=await pw.chromium.launch();
const JOBS=Math.max(1,+(process.env.JOBS||3));
const lines=new Map();
async function runSize(size){
 const ts=Date.now();
 await t1DocumentScroll(browser,size);
 if(size.narrow){await t2NoAutoOpen(browser,size);await t3ExplicitOpen(browser,size);await t4Closing(browser,size);await t11Ghost(browser,size);await t14Keyboard(browser,size);await t8Plot(browser,size)}
 else await t6Desktop(browser,size);
 if(TOOLBAR_SIZES.includes(size.w+'x'+size.h))await t7Toolbar(browser,size);
 if(size.w===1024&&size.h===768||size.w===390&&size.h===844)await t9Dark(browser,size);
 lines.set(size.name,`${size.stat.bad?'HIBA':'OK  '} ${size.name.padEnd(18)} ${String(size.stat.checks).padStart(4)} ellenőrzés, ${size.stat.bad} hiba, ${((Date.now()-ts)/1000).toFixed(1)} s`);
}
try{
 COOKIE=await register();
 const queue=[...SIZES];
 await Promise.all(Array.from({length:JOBS},async()=>{for(let s;(s=queue.shift());)await runSize(s)}));
 if(!only.length||only.includes('1400x900')){const size={name:'töréspont-váltás',w:1400,h:900,touch:false,narrow:false,phone:false,stat:{checks:0,bad:0}},ts=Date.now();await t5Breakpoints(browser,size);lines.set(size.name,`${size.stat.bad?'HIBA':'OK  '} ${size.name.padEnd(18)} ${String(size.stat.checks).padStart(4)} ellenőrzés, ${size.stat.bad} hiba, ${((Date.now()-ts)/1000).toFixed(1)} s`)}
 ok(errorsAll.length===0,'JS-hiba a lapon: '+[...new Set(errorsAll)].join(' | ').slice(0,400));
}finally{await browser.close()}
for(const l of lines.values())console.log(l);

const secs=((Date.now()-t0)/1000).toFixed(0);
console.log('');
if(fails.length){
 console.log('HIBÁK ('+fails.length+'):');
 for(const f of fails)console.log(' - ['+f.where+'] '+f.msg+(f.shot?'\n     képernyőkép: '+f.shot:''));
 console.log(`\nFAIL: ${fails.length} hiba a ${checks} ellenőrzésből, ${SIZES.length} ablakméret, ${secs} s.`);
 process.exit(1);
}
console.log(`PASS: a tervező elrendezése rendben (${checks} ellenőrzés, ${SIZES.length} ablakméret${only.length&&!only.includes('1400x900')?'':' + töréspont-váltások'}, ${secs} s): a dokumentum sosem görög, 1050 px-ig a panel csak kérésre nyílik és zárul, 1051 px-től dokkolt, az eszköztár nem takart, a kijelölés nem mozgatja a vásznat, sötét módban átlátszatlan.`);
