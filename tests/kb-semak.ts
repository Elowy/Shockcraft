// A Sémák (R3 bekötési cikkek) sablonja és kapuja SZIMULÁLT JÓVÁHAGYÁSSAL (docs/tudastar.md „Sémák és ábramotor”, docs/tudastar-terv.md 2.4):
// a lektorra váró vázlatokból memóriában – a lib/kb/release.ts és a generált fájlok érintése nélkül – egy próba-lektori rekorddal
// készül cikk, és a generátor, a kapu, a részletoldal (ArticleView a netlistás ábrákkal) és a gyűjtőoldal (SemakIndex) sablonja ezen
// a NEM közzétett mintán fut. A valós állapot közben változatlan: egy séma sem közzétett, a generált ábramodul üres, a Sémák fül és
// útvonal nem létezik (a kiszolgált oldalakat a tests/kb-routes.mjs, a buildet a tests/kb-dist.mjs nézi).
//  1. valós állapot: KB_DIAGRAMS üres, nincs közzétett séma, a Sémák szekció nem látszik, az R3 vázlatoknak nincs rekordja,
//  2. szimulált jóváhagyás: a generátor a cikket és CSAK a közzétett cikk ábráit (netlista + elrendezés) adná a buildhez; a generált
//     ábramodul a szimulált rekord nélkül üres,
//  3. kapu: az ábra (elrendezés, netlista, szimbólum) módosítása után a rekord „újraellenőrzendő”, az ábra kiesik a buildből; belső
//     (nem lektori) rekorddal R3 nem közzétehető,
//  4. a részletoldal anatómiája (terv 2.4): veszély-doboz (a figyelmeztetés-könyvtár szövegével) az első helyen, ábra nézetváltóval
//     (Bekötés | Működés), vezetéktábla <details>-ben, kapcsolóállás-táblázat, „Hogyan működik?”, a szerelés lépései a
//     feszültségmentesítéssel kezdve, „Régi berendezésben”, „Gyakori hibák”, „Mikor hívj szakembert?”, a szimulációs táblák, a vázlat
//     minden bekezdése; a változatok (2–4 × 107) és a több ábrás cikk (dugalj, földelési rendszerek),
//  5. a gyűjtőoldal: veszély-doboz, kategóriaszakaszok, kártyánként mini-ábra, „Röviden” és mélylink, Számítások,
//  6. a generátor R3-ellenőrzése (mutációs próba): hiányzó veszély-doboz vagy könyvtári mondat, hiányzó kötelező szakasz, a szerelés
//     nem a feszültségmentesítéssel kezdődik, elavult elrendezés – mind generálási hiba.
// Futtatás: node --no-warnings --import tsx tests/kb-semak.ts
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ArticleView} from '../components/kezikonyv/article/article-view';
import {PENDING_NOTE} from '../components/kezikonyv/article/inline';
import {SemakIndex,type SemakItem} from '../components/kezikonyv/semak/semak-index';
import {contentFingerprint} from '../lib/kb/content/fingerprint';
import {gateState} from '../lib/kb/content/gate';
import {KB_DIAGRAMS} from '../lib/kb/content/generated/diagrams';
import {KB_CATEGORIES,KB_PENDING,articlePages,diagramsOf,publishedArticles,releaseBadge,visibleArticles} from '../lib/kb/content/registry';
import {inlinePlain} from '../lib/kb/content/inline';
import type {KbBlock} from '../lib/kb/content/types';
import {visibleSections} from '../lib/kb/categories';
import {KB_RELEASES,KB_SUSPENDED,type KbExpertReview,type KbRelease} from '../lib/kb/release';
import {SAFETY} from '../lib/kb/safety';
import {articleFromDraft,buildModel,renderFiles,OUT_DIR} from '../scripts/kb-content/generate';
import {LAYOUT_DIR} from '../scripts/kb-content/diagrams';
import {parseDraft} from '../scripts/kb-content/parse';

const ROOT=process.cwd();
const R3='content/tudastar/r3/';
const draft=(slug:string)=>articleFromDraft(R3+slug+'.md',readFileSync(R3+slug+'.md','utf8'),ROOT);
/** Próba-lektori rekord – CSAK memóriában, a lib/kb/release.ts-be soha nem kerülhet (fejlesztő vagy MI nem írhat lektori rekordot). */
const simulated=(a:ReturnType<typeof draft>):KbExpertReview=>({kind:'lektoralt',section:a.meta.section,risk:'R3',qualification:'SZIMULÁLT – csak teszt',date:'2026-10-12',fingerprint:a.meta.fingerprint,figures:a.meta.figures,approvalRef:'TESZT',secondReader:'TESZT'});
const text=(html:string)=>html.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/ /g,' ').replace(/\s+/g,' ');

// ------------------------------------------------------------------ 1. Valós állapot
assert.deepEqual(KB_DIAGRAMS,{},'a generált ábramodul üres: egy séma sem közzétett');
assert.equal(articlePages(false,'semak').length,0);assert.equal(publishedArticles('semak').length,0);assert.equal(visibleArticles(true,'semak').length,0,'előnézetben sincs (a törzs nem generálódik)');
assert.ok(!visibleSections({elmelet:1,semak:0}).some(s=>s.id==='semak'),'a Sémák fül nem látszik');
for(const p of KB_PENDING)assert.ok(!(p.id in KB_RELEASES),p.id+': R3-nak nincs rekordja');
assert.ok(!readFileSync('lib/kb/release.ts','utf8').includes('SZIMULÁLT'),'a próbarekord nem kerülhet a release.ts-be');

// ------------------------------------------------------------------ 2. Szimulált jóváhagyás: generátor
const SAMPLE='valtokapcsolo-106-bekotese';
const a=draft(SAMPLE),rec=simulated(a);
const records:Record<string,KbRelease>={...KB_RELEASES,[SAMPLE]:rec};
const model=buildModel(ROOT,records);
const gen=model.articles.find(x=>x.meta.id===SAMPLE)!;
assert.ok(gen,'a szimulált rekorddal a vázlatból cikk lesz');
assert.equal(gateState(gen.meta,contentFingerprint(gen.meta,gen.body),records,KB_SUSPENDED).state,'kozzeteve');
assert.deepEqual(Object.keys(model.diagrams),['valtokapcsolo-106'],'csak a közzétett cikk ábrája kerül a buildbe');
const files=renderFiles(model);
assert.ok(files[OUT_DIR+'/bodies/'+SAMPLE+'.ts'],'a törzs generálódna');
assert.ok(files[OUT_DIR+'/diagrams.ts'].includes('"valtokapcsolo-106":{"netlist":'),'az ábra (netlista + elrendezés) generálódna');
assert.ok(!files[OUT_DIR+'/diagrams.ts'].includes('keresztkapcsolo-107'),'más (nem közzétett) ábra nem');
assert.deepEqual(gen.meta.diagrams,[{figure:'abra-1',ids:['valtokapcsolo-106']}]);
assert.equal(gen.meta.safety,'bekotes');
// a szimulált rekord nélkül (a valós release.ts-szel) a generált ábramodul üres – ez van a repóban
assert.equal(renderFiles(buildModel(ROOT))[OUT_DIR+'/diagrams.ts'],readFileSync(join(OUT_DIR,'diagrams.ts'),'utf8'));
assert.ok(renderFiles(buildModel(ROOT))[OUT_DIR+'/diagrams.ts'].includes('KB_DIAGRAMS:Readonly<Record<string,DiagramSource>>={};'));

// ------------------------------------------------------------------ 3. Kapu: az ábra változása újraellenőrzést kér
{
 // Az elrendezés egy pontjának elmozdítása (ideiglenes másolaton – a valódi fájl változatlan): új ábra-ujjlenyomat.
 const layoutFile=join(ROOT,LAYOUT_DIR,'valtokapcsolo-106.json'),orig=readFileSync(layoutFile,'utf8');
 const {mkdtempSync,cpSync,writeFileSync,rmSync}=await import('node:fs');const {tmpdir}=await import('node:os');
 const tmp=mkdtempSync(join(tmpdir(),'kb-semak-'));
 try{
  for(const d of ['content','components','lib','app'])cpSync(join(ROOT,d),join(tmp,d),{recursive:true});
  writeFileSync(join(tmp,LAYOUT_DIR,'valtokapcsolo-106.json'),orig.replace('"w7":[[124,118],[268,118]','"w7":[[124,118],[268,119]'));
  const m2=buildModel(tmp,records),g2=m2.articles.find(x=>x.meta.id===SAMPLE)!;
  assert.notEqual(g2.meta.figures,rec.figures,'új ábra-ujjlenyomat');assert.equal(g2.meta.fingerprint,rec.fingerprint,'a szöveg változatlan');
  assert.equal(gateState(g2.meta,contentFingerprint(g2.meta,g2.body),records,KB_SUSPENDED).state,'ujraellenorzendo','az ábra módosítása lektori újraellenőrzést kér');
  assert.deepEqual(m2.diagrams,{},'a nem közzétett (újraellenőrzendő) cikk ábrája nem kerül a buildbe');
  // egy szimbólum (a rajzoló kód) módosítása is
  const sym=join(tmp,'components/kezikonyv/diagram/symbols.tsx');writeFileSync(sym,readFileSync(sym,'utf8')+'\n');
  writeFileSync(join(tmp,LAYOUT_DIR,'valtokapcsolo-106.json'),orig);
  const g3=buildModel(tmp,records).articles.find(x=>x.meta.id===SAMPLE)!;
  assert.equal(gateState(g3.meta,contentFingerprint(g3.meta,g3.body),records,KB_SUSPENDED).state,'ujraellenorzendo','a szimbólumkészlet módosítása is');
 }finally{rmSync(tmp,{recursive:true,force:true})}
 // belső (nem lektori) rekorddal R3 nem közzétehető
 const internal:Record<string,KbRelease>={...KB_RELEASES,[SAMPLE]:{kind:'belso',section:'semak',risk:'R2' as never,by:'x',date:'2026-10-12',fingerprint:rec.fingerprint,figures:rec.figures,note:''}};
 assert.notEqual(gateState(gen.meta,contentFingerprint(gen.meta,gen.body),internal,KB_SUSPENDED).state,'kozzeteve');
 const mi=buildModel(ROOT,internal);
 assert.ok(!mi.articles.some(x=>x.meta.id===SAMPLE)&&mi.pending.some(p=>p.id===SAMPLE)&&!Object.keys(mi.diagrams).length,'belső rekord R3-ra: a generátor szöveg nélküli csonkot ad, ábrát nem');
}

// ------------------------------------------------------------------ 4. Részletoldal
const info={state:'kozzeteve' as const,record:rec,badge:releaseBadge(rec),reason:''};
const page=(g:typeof gen,dg:Record<string,import('../components/kezikonyv/diagram/diagram-figure').DiagramSource[]>)=>renderToStaticMarkup(createElement(ArticleView,{meta:g.meta,body:g.body,info,preview:false,origin:'https://example.test',diagrams:dg}));
const dg=diagramsOf(gen.meta,model.diagrams);
assert.deepEqual(Object.keys(dg),['abra-1']);
const html=page(gen,dg),t=text(html);
const body=html.slice(html.indexOf('data-kb-body'));
// veszély-doboz az első blokk, a könyvtár szövegével
assert.match(body,/^data-kb-body=""><aside class="kk-callout kk-callout-danger" role="note" aria-label="Életveszély">/,'a törzs első eleme a veszély-doboz');
for(const s of SAFETY.bekotes.text.split(/(?<=\.)\s+/))assert.ok(t.toLowerCase().includes(s.replace(/\.$/,'').toLowerCase()),'a könyvtári mondat: '+s);
// ábra nézetváltóval
assert.ok(html.includes('role="tablist"')&&html.includes('>Bekötés</button>')&&html.includes('>Működés</button>'),'nézetváltó');
assert.ok(html.includes('data-diagram="valtokapcsolo-106" data-view="bekotes"')&&html.includes('data-diagram="valtokapcsolo-106" data-view="mukodes"'));
const fig=/<figure class="kk-dg"[\s\S]*?<\/figure>/.exec(html)![0];
assert.equal((fig.match(/aria-pressed="(true|false)"/g)??[]).length,2,'K1 és K2 gombja');
assert.ok(html.includes('aria-live="polite"'));
assert.equal((html.match(/<tr data-key="/g)??[]).length,4,'a kapcsolóállás-táblázat 4 állása');
assert.match(html,/<details class="kk-dg-wires"><summary>Vezetékek táblázatban \(12 ér\)<\/summary>/);
assert.ok(t.includes('Így látod a tervezőben'));
assert.ok(!/\shidden(=|\s|>)/.test(html),'nézetváltás osztállyal');
// kötelező szakaszok, sorrendben; a szerelés a feszültségmentesítéssel kezdődik
const h2=[...html.matchAll(/<h2 id="[^"]+">(.*?)<\/h2>/g)].map(m=>text(m[1]).trim());
const order=['Hogyan működik?','A szerelés menete szakembernek','Régi berendezésben','Gyakori hibák','Mikor hívj szakembert?'].map(h=>h2.indexOf(h));
assert.ok(order.every((x,i)=>x>=0&&(i===0||x>order[i-1])),'a kötelező szakaszok sorrendben: '+h2.join(' | '));
assert.match(html,/A szerelés menete szakembernek<\/h2>[\s\S]*?<ol><li><strong>Feszültségmentesítés<\/strong>/,'az első lépés a feszültségmentesítés');
assert.ok(html.includes('data-sim="allapotok"')&&html.includes('data-sim="vezetekek"')&&html.includes('data-sim="szakaszok"'),'a szimulációs táblák');
// a vázlat minden bekezdése, listaeleme és táblázatcellája megjelenik (a szöveget a generátor nem írja át)
{
 const walk=(bs:readonly KbBlock[],out:string[])=>{for(const b of bs){if(b.t==='p')out.push(...b.lines);else if(b.t==='ul'||b.t==='ol')out.push(...b.items);else if(b.t==='table')out.push(...b.head,...b.rows.flat());else if(b.t==='rovid'||b.t==='h2'||b.t==='h3'||b.t==='formula')out.push(b.text);else if(b.t==='callout')out.push(b.text);else if(b.t==='sim'||b.t==='example')walk(b.blocks,out)}return out};
 // a lektorra váró linkcél jelölése („(hamarosan – szakmai lektorálás alatt)”) a megjelenítés része, nem a vázlaté
 const squeezed=t.split('('+PENDING_NOTE+')').join('').replace(/\s+/g,'');
 for(const s of walk(gen.body.blocks,[])){const want=inlinePlain(s).replace(/\s+/g,'');assert.ok(squeezed.includes(want),'a vázlat szövege megjelenik: '+inlinePlain(s).slice(0,60))}
}
// változatok: a keresztkapcsolás fő ábrája és a 2–4 × 107 változat
{
 const k=draft('keresztkapcsolo-107-bekotese'),rk=simulated(k);
 const mk=buildModel(ROOT,{...KB_RELEASES,[k.meta.id]:rk}),gk=mk.articles.find(x=>x.meta.id===k.meta.id)!;
 assert.deepEqual(Object.keys(mk.diagrams).sort(),['keresztkapcsolo-107','keresztkapcsolo-107-2x107','keresztkapcsolo-107-3x107','keresztkapcsolo-107-4x107']);
 const hk=page(gk,diagramsOf(gk.meta,mk.diagrams));
 assert.equal((hk.match(/<figure class="kk-dg" id="abra-1(-[234])?"/g)??[]).length,4,'a fő ábra és 3 változat');
 assert.equal((hk.match(/role="tablist"/g)??[]).length,4);
}
// több ábrás cikk: dugalj (2), földelési rendszerek (5)
for(const [slug,n] of [['dugalj-bekotese',2],['foldelesi-rendszerek',5]] as const){
 const d=draft(slug),md=buildModel(ROOT,{...KB_RELEASES,[d.meta.id]:simulated(d)}),gd=md.articles.find(x=>x.meta.id===d.meta.id)!;
 const hd=page(gd,diagramsOf(gd.meta,md.diagrams));
 assert.equal((hd.match(/<figure class="kk-dg" id="abra-\d+"/g)??[]).length,n,slug+': '+n+' ábra');
 assert.match(hd,/^[\s\S]*data-kb-body=""><aside class="kk-callout kk-callout-danger"/,slug+': veszély-doboz');
}

// ------------------------------------------------------------------ 5. Gyűjtőoldal
{
 const items:SemakItem[]=[{meta:gen.meta,body:gen.body,href:'/tudastar/semak/'+SAMPLE,listBadge:releaseBadge(rec,false),diagrams:dg}];
 const cats=KB_CATEGORIES.filter(c=>c.section==='semak');
 const h=renderToStaticMarkup(createElement(SemakIndex,{categories:cats,items,calcs:[{slug:'aram-teljesitmenybol',title:'Áram teljesítményből',short:'I = P / (U · cos φ)'}]}));
 assert.match(h,/^<aside class="kk-callout kk-callout-danger" role="note" aria-label="Életveszély">/,'felső veszély-doboz a könyvtárból');
 assert.ok(text(h).includes(SAFETY.bekotes.text),'a könyvtár szövege');
 assert.ok(h.includes('id="kapcsolasok"')&&!h.includes('id="foldeles"'),'csak a tartalommal rendelkező kategória');
 assert.ok(h.includes('class="kk-semak-mini"')&&h.includes('data-diagram="valtokapcsolo-106"'),'mini-ábra');
 assert.ok(h.includes('href="/tudastar/semak/'+SAMPLE+'"'),'mélylink');
 const rovid=gen.body.blocks.find(b=>b.t==='rovid')!;assert.ok(rovid.t==='rovid'&&text(h).includes(inlinePlain(rovid.text).slice(0,80)),'„Röviden”');
 assert.ok(h.includes('id="szamitasok"')&&h.includes('href="/kalkulatorok/aram-teljesitmenybol"'),'Számítások');
}

// ------------------------------------------------------------------ 6. A generátor R3-ellenőrzése (mutációs próba)
{
 const src=readFileSync(R3+SAMPLE+'.md','utf8');
 const fails=(name:string,mut:(s:string)=>string,re:RegExp)=>{const m=mut(src);assert.notEqual(m,src,name+': a mutáció nem változtatott');assert.throws(()=>articleFromDraft(R3+SAMPLE+'.md',m,ROOT),re,name)};
 fails('veszély-doboz hiányzik',s=>s.replace(/^> \*\*Veszély – [^\n]*\n\n/m,''),/első blokkja/);
 fails('könyvtári mondat hiányzik',s=>s.replace('Ha nem vagy villanyszerelő, ne szereld, hívj szakembert. ',''),/könyvtári szöveget/);
 fails('„Gyakori hibák” hiányzik',s=>s.replace('## Gyakori hibák','## Tipikus hibák'),/Gyakori hibák/);
 fails('„Hogyan működik?” hiányzik',s=>s.replace('## Hogyan működik?','## A működés'),/Hogyan működik/);
 fails('a szerelés nem a feszültségmentesítéssel kezdődik',s=>s.replace('1. **Feszültségmentesítés**','1. **Előkészítés**'),/feszültségmentesítéssel/);
 fails('ismeretlen könyvtári tétel',s=>s.replace('safety: bekotes','safety: valami'),/safety|front matter/);
 fails('ábra helyőrző nélkül',s=>s.replace(/^\[ÁBRA: abra-1 [^\n]*\n/m,''),/helyőrzője/);
 // a front matter ábrája a netlistára mutat (az elavult elrendezés hibáját a tests/kb-diagram.ts próbálja ki)
 const {front}=parseDraft(src);assert.equal(front.figures?.[0].netlist,'valtokapcsolo-106-bekotese.netlist.json');
 // a nem netlistás (sematikus) ábrához saját komponens kell: amíg nincs, az R3 cikk nem adható ki
 assert.throws(()=>draft('kismegszakito'),/kismegszakito\/abra-1/);
}
console.log('PASS: Sémák sablon szimulált jóváhagyással – valós állapot (0 közzétett séma, üres ábramodul, nincs fül), generátor (csak a közzétett cikk ábrája), kapu (ábra- és szimbólummódosítás → újraellenőrzendő, belső rekord R3-ra nem), részletoldal (veszély-doboz, nézetváltó, Működés, táblák, kötelező szakaszok, feszültségmentesítés elöl, a vázlat teljes szövege, változatok, több ábra), gyűjtőoldal, R3-ellenőrzés mutációs próbával.');
