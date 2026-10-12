// Tudástár tartalommotor és közzétételi kapu (docs/tudastar.md, docs/tudastar-terv.md 3.3, 4.3, 4.4, 10.6):
//  1. a generált modulok naprakészek (a content/tudastar/*.md vázlatokból újragenerálva azonosak),
//  2. front matter teljesség (zod-séma, minden mező átkerül),
//  3. tartalom-hűség: a közzétett cikk renderelt szövege = a forrásvázlat törzse normalizálva,
//  4. kapu: pontosan a 18 R1/R2 tétel közzétett („Belsőleg ellenőrizve”), R3 sehol (static params, sitemap, kereső, linkcél),
//     az R3 szövege nem kerül a build bemenetei közé; tartalmi és ábra-ujjlenyomat (a kirajzolt SVG, a szöveges megfelelő és az
//     ábraszínek is – mutációs próbával), a kategória/szekció kockázati alsó korlátja (mutációs próbával), felfüggesztés, R3 belső rekorddal,
//     a böngészőbe töltődő keresőindex = a szerver közzétett keresőtételei,
//  5. belső linkek érvényessége (R3-ra mutató link szövegként, „hamarosan – szakmai lektorálás alatt”), horgonyok,
//  6. szakszótár-horgonyok, 7. ábrák minden helyőrzőhöz, 8. forrás-ellenőrzési jelölés, 9. SEO-mezők, 10. inline-parser biztonság.
// Futtatás: node_modules/.bin/tsx tests/kb-content.ts
import assert from 'node:assert/strict';
import {cpSync,existsSync,mkdirSync,mkdtempSync,readFileSync,readdirSync,rmSync,statSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname,join,relative,resolve} from 'node:path';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ArticleBlocks} from '../components/kezikonyv/article/blocks';
import {ArticleFigure,FIGURES,figureDesc} from '../components/kezikonyv/figures';
import {CALCULATORS} from '../lib/calc/registry';
import {KB_CHANGES,changesFor} from '../lib/kb/content/changes';
import {KB_GLOSSARY,kbSeoTitle} from '../lib/kb/categories';
import {meetsRiskFloor,riskFloor} from '../lib/kb/content/categories';
import {contentFingerprint} from '../lib/kb/content/fingerprint';
import {KB_SEARCH_ITEMS} from '../lib/kb/content/generated/search';
import {inlineLinks,parseInline,plainText,slugify} from '../lib/kb/content/inline';
import {GLOSSARY_ID,KB_ARTICLES,KB_PENDING,articleHref,articlePages,articlesForCalc,bodyOf,glossaryTerms,isPublished,kbSearchItems,publishedArticles,releaseBadge,releaseInfo,resolveLink,termAliases,visibleArticles} from '../lib/kb/content/registry';
import type {KbBlock,KbMeta} from '../lib/kb/content/types';
import {KB_RELEASES,KB_SUSPENDED,type KbRelease} from '../lib/kb/release';
import {CHECKLIST} from '../scripts/kb-content/checklist';
import {FIG_CSS,FIG_DIR,FIG_INDEX,figureSource} from '../scripts/kb-content/figures';
import {OUT_DIR,R3_DIR,SECTION_DIRS,buildModel,figureIds,renderFiles} from '../scripts/kb-content/generate';
import {FRONT_KEYS,parseDraft,splitFrontMatter} from '../scripts/kb-content/parse';
import {frontMatterSchema} from '../scripts/kb-content/schema';
import {r3Needles} from './kb-r3-needles.mjs';

const ROOT=resolve('.');
const rel=(p:string)=>relative(ROOT,p).split('\\').join('/');
const mdFiles=(dir:string)=>readdirSync(dir).filter(f=>f.endsWith('.md')).sort().map(f=>join(dir,f));
const ELMELET=mdFiles(SECTION_DIRS.elmelet),R3=mdFiles(R3_DIR);
const EXPECTED=['elektromos-aram','elektromos-ellenallas','elektromos-feszultseg','elektromos-teljesitmeny','fenyforrasok-tipusai','ip-vedettseg','joule-lenz-torveny','kirchhoff-torvenyei','lampafoglalatok-es-lampatalpak','lumen-es-lux','ohm-torvenye','rovidzarlat-es-tulterheles','soros-es-parhuzamos-kapcsolas','szakszotar','szinhomerseklet','transzformator-mukodese','vezetek-es-kabeljelolesek','vezetekek-szinjelolese'];

// ------------------------------------------------------------------ 1. A generált modulok naprakészek
const model=buildModel(ROOT);
{
 const files=renderFiles(model),stale:string[]=[];
 for(const [p,c] of Object.entries(files))if(!existsSync(p)||readFileSync(p,'utf8')!==c)stale.push(p);
 for(const f of readdirSync(join(OUT_DIR,'bodies')))if(!files[OUT_DIR+'/bodies/'+f])stale.push(OUT_DIR+'/bodies/'+f+' (fölösleges)');
 assert.deepEqual(stale,[],'elavult generált fájl – futtasd: node_modules/.bin/tsx scripts/kb-content.ts build');
 assert.equal(model.articles.length,ELMELET.length,'minden elméleti vázlatból cikk lesz');
 assert.equal(model.pending.length,R3.length,'minden R3 vázlat csak szöveg nélküli csonk');
 assert.deepEqual(KB_ARTICLES.map(a=>a.id).sort(),EXPECTED,'a 17 cikk és a szakszótár');
}

// ------------------------------------------------------------------ 2. Front matter teljesség
for(const file of ELMELET){
 const src=readFileSync(file,'utf8'),{front}=parseDraft(src),{yaml}=splitFrontMatter(src);
 const r=frontMatterSchema.safeParse(front);assert.ok(r.success,file+': '+(r.success?'':JSON.stringify(r.error.issues)));
 for(const k of FRONT_KEYS)assert.ok(new RegExp('^'+k+':','m').test(yaml),file+': hiányzó front matter mező: '+k);
 const meta=KB_ARTICLES.find(a=>a.slug===front.slug)!;assert.ok(meta,file);
 for(const k of ['slug','title','navTitle','summary','section','category','risk','ai','version','updated'] as const)assert.equal(meta[k],front[k],file+': '+k);
 for(const k of ['audience','keywords','synonyms','related','calculators'] as const)assert.deepEqual([...meta[k]],front[k],file+': '+k);
 const body=bodyOf(meta);
 assert.deepEqual(body.sources.map(s=>[s.standard,s.kiadas,s.pont]),front.sources.map(s=>[s.standard,s.kiadas,s.pont]),file+': források');
 assert.equal(meta.id,meta.slug);
 assert.equal(file,join(SECTION_DIRS.elmelet,meta.slug+'.md'),'a fájlnév a slug');
}

// ------------------------------------------------------------------ 3. Tartalom-hűség (forrásvázlat ↔ renderelt törzs)
/** A forrásvázlat törzse olvasható szövegként: Markdown-jelölés, ábra-helyőrzők és táblázatelválasztók nélkül (a parsertől független). */
function sourceText(md:string,glossary:boolean){
 const out:string[]=[];let letter=false;
 for(const raw of splitFrontMatter(md).body.split('\n')){
  let l=raw.trim();if(!l)continue;
  if(l.startsWith('[ÁBRA:'))continue;
  if(/^\|[\s:|-]+\|$/.test(l)&&/-{3}/.test(l))continue;
  if(l.startsWith('## '))letter=glossary&&/^## [A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]?$/.test(l);
  l=l.replace(/^#{2,3}\s+/,'').replace(/^>\s?/,'').replace(/^-\s+/,'').replace(/^\d+\.\s+/,'');
  if(l.startsWith('|'))l=l.replace(/^\||\|$/g,'').split('|').map(c=>c.trim()).join(' ');
  if(letter&&raw.startsWith('- **'))l=l.replace(/^(\*\*.+?\*\*(?: \((?:[^()]|\([^()]*\))*\))?) – /,'$1 ');
  out.push(l);
 }
 return norm(out.join(' ').replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g,'$1').replace(/\[\[([^\]]+)\]\]/g,'$1').replace(/\*\*/g,'').replace(/`/g,'')
  .replace(/(^|[\s(„"'\-–—/])_(\S(?:[^_]*?\S)?)_(?=$|[\s.,;:!?)”"'\-–—/])/g,'$1$2').replace(/([\p{L}\p{N}])_([\p{L}\p{N}]+)/gu,'$1$2'));
}
const INLINE_TAGS=/<\/?(?:strong|em|sub|sup|code|a|span|dfn)\b[^>]*>/g;
function renderedText(html:string){
 let h=html;
 h=h.replace(/<figure\b[\s\S]*?<\/figure>/g,' ');
 h=h.replace(/<span[^>]*data-kb-extra=""[^>]*>[\s\S]*?<\/span>/g,'');
 h=h.replace(/<svg\b[\s\S]*?<\/svg>/g,'');
 h=h.replace(INLINE_TAGS,'').replace(/<[^>]+>/g,' ');
 return norm(h.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&#39;/g,"'").replace(/&nbsp;/g,' '));
}
const norm=(s:string)=>s.replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
const resolvePublished=(id:string,anchor:string|null)=>resolveLink(id,anchor,false);
let compared=0;
for(const meta of publishedArticles()){
 const file=join(SECTION_DIRS[meta.section],meta.slug+'.md'),src=readFileSync(file,'utf8');
 const html=renderToStaticMarkup(createElement(ArticleBlocks,{blocks:bodyOf(meta).blocks,ctx:{slug:meta.slug,resolve:resolvePublished}}));
 const a=sourceText(src,meta.id===GLOSSARY_ID),b=renderedText(html);
 if(a!==b){let i=0;while(i<a.length&&a[i]===b[i])i++;assert.fail(meta.id+': a renderelt szöveg eltér a vázlattól a(z) '+i+'. karakternél:\n  vázlat:   …'+a.slice(Math.max(0,i-60),i+80)+'\n  renderelt: …'+b.slice(Math.max(0,i-60),i+80))}
 assert.ok(a.length>2000,meta.id+': érdemi szöveg');
 // A renderelt HTML-ben nincs nem várt jelölés és nincs „undefined”/„NaN”.
 assert.ok(!/\*\*|\[\[|\]\]|\bundefined\b|\bNaN\b/.test(b),meta.id+': maradt jelölés a renderelt szövegben');
 compared++;
}
assert.equal(compared,18,'mind a 18 közzétett tétel szövege egyezik a vázlattal');

// ------------------------------------------------------------------ 4. Közzétételi kapu
const pub=publishedArticles().map(a=>a.id).sort();
assert.deepEqual(pub,EXPECTED,'pontosan a 18 R1/R2 tétel közzétett');
for(const a of KB_ARTICLES){
 const info=releaseInfo(a);
 assert.equal(info.state,'kozzeteve',a.id+': '+info.reason);
 assert.ok(a.risk==='R1'||a.risk==='R2',a.id+': csak R1/R2 közzétett');
 assert.equal(info.badge,'Belsőleg ellenőrizve',a.id);
 assert.equal(KB_RELEASES[a.id].kind,'belso');
 assert.equal(a.fingerprint,contentFingerprint(a,bodyOf(a)),a.id+': a generált ujjlenyomat a tartalomé');
 assert.equal(KB_RELEASES[a.id].fingerprint,a.fingerprint,a.id+': a kiadási rekord ujjlenyomata egyezik (különben: scripts/kb-content.ts record)');
 assert.equal(KB_RELEASES[a.id].section,a.section);assert.equal(KB_RELEASES[a.id].risk,a.risk);
}
// Ábra-ujjlenyomat: a rekord rögzíti, a generált meta a forrásból (komponens, kit.tsx, FIGURES-bejegyzés, ábraszínek) számolt értéket hordja.
for(const a of KB_ARTICLES){
 const ids=figureIds(bodyOf(a).blocks);
 assert.equal(a.figures,figureSource(ROOT,a.slug,ids),a.id+': a generált ábra-ujjlenyomat a forrásé');
 assert.equal(KB_RELEASES[a.id].figures??'',a.figures,a.id+': a kiadási rekord ábra-ujjlenyomata egyezik (különben: scripts/kb-content.ts record)');
 assert.equal(!!a.figures,ids.length>0,a.id+': ábra-ujjlenyomat pontosan az ábrás cikkeknél');
 assert.ok(meetsRiskFloor(a),a.id+': a kategória kockázati alsó korlátja ('+riskFloor(a.section,a.category)+')');
}
for(const id of Object.keys(KB_RELEASES))assert.ok(KB_ARTICLES.some(a=>a.id===id),'rekord ismeretlen tételhez: '+id);
// Változásnapló: a legutóbbi bejegyzés a mostani verzióé, és nem régebbi a kiadási rekordnál (minden új ellenőrzéshez bejegyzés tartozik).
for(const a of KB_ARTICLES){
 const last=changesFor(a)[0];
 assert.equal(last.version,a.version,a.id+': a változásnapló legutóbbi bejegyzése a mostani verzióé');
 assert.ok(last.date>=KB_RELEASES[a.id].date,a.id+': a rekord ('+KB_RELEASES[a.id].date+') újabb a változásnapló legutóbbi bejegyzésénél ('+last.date+')');
 if(a.figures)assert.ok(KB_CHANGES[a.id]?.some(c=>c.date==='2026-10-11'),a.id+': az ábra-ujjlenyomat bevezetésének (2026-10-11) bejegyzése');
}
// A böngészőbe (a kereső első megnyitásakor) töltődő index pontosan a szerver közzétett keresőtételei – R3 és nem közzétett tétel nélkül.
assert.deepEqual(JSON.parse(JSON.stringify(KB_SEARCH_ITEMS)),JSON.parse(JSON.stringify(kbSearchItems(false))),'generated/search.ts = kbSearchItems(false) (különben: scripts/kb-content.ts build)');
assert.deepEqual(Object.keys(KB_SEARCH_ITEMS[0]).sort(),['group','href','id','keywords','summary','synonyms','title'],'a keresőindex csak könnyű metaadat');
assert.ok(KB_SEARCH_ITEMS.every(i=>i.summary.length<=200),'az összefoglalók rövidek (cikktörzs nincs benne)');
assert.equal(KB_SUSPENDED.size,0);
// R3: nincs rekord, nincs törzs, szöveg nélküli csonk.
const R3_IDS=R3.map(f=>/^slug:\s*(\S+)/m.exec(readFileSync(f,'utf8'))![1]);
assert.deepEqual(KB_PENDING.map(p=>p.id).sort(),[...R3_IDS].sort());
for(const p of KB_PENDING){
 assert.equal(p.risk,'R3');assert.ok(!(p.id in KB_RELEASES),p.id+': R3-nak nincs rekordja (csak szakmai lektor után)');
 assert.deepEqual(Object.keys(p).sort(),['category','id','risk','section','slug'],p.id+': a csonk szöveget nem tartalmaz');
 assert.ok(!existsSync(join(OUT_DIR,'bodies',p.slug+'.ts')),p.id+': R3 törzs nem generálódik');
 assert.deepEqual(resolveLink(p.id,null),{pending:true},p.id+': R3 nem linkcél');
}
// Állapotgép: módosított tartalom → újraellenőrzendő; R3 belső rekorddal → lektorra vár; felfüggesztés.
{
 const m=KB_ARTICLES.find(a=>a.id==='ohm-torvenye')!;
 const changed:KbMeta={...m,title:m.title+' (módosítva)'};
 assert.notEqual(contentFingerprint(changed,bodyOf(m)),m.fingerprint,'a cím változása új ujjlenyomatot ad');
 const blocks=bodyOf(m).blocks.map(b=>b.t==='rovid'?{...b,text:b.text+'!'}:b);
 assert.notEqual(contentFingerprint(m,{...bodyOf(m),blocks}),m.fingerprint,'a törzs változása új ujjlenyomatot ad');
 assert.equal(releaseInfo({...m,fingerprint:'deadbeef'}).state,'ujraellenorzendo');
 assert.equal(releaseInfo(m,{}).state,'vazlat');
 assert.equal(releaseInfo(m,KB_RELEASES,new Set(['ohm-torvenye'])).state,'felfuggesztve');
 const r3:KbMeta={...m,risk:'R3'};
 const internalR3:Record<string,KbRelease>={'ohm-torvenye':{...(KB_RELEASES['ohm-torvenye'] as Extract<KbRelease,{kind:'belso'}>),risk:'R3' as never}};
 assert.notEqual(releaseInfo(r3,internalR3).state,'kozzeteve','R3 belső rekorddal nem közzétehető');
 const expert:Record<string,KbRelease>={'ohm-torvenye':{kind:'lektoralt',section:'elmelet',risk:'R1',qualification:'teszt',date:'2026-10-10',fingerprint:m.fingerprint,figures:m.figures,approvalRef:'teszt'}};
 assert.equal(releaseInfo(m,expert).badge,'Szakmailag lektorálta: teszt · 2026-10-10');
 // A lektor neve csak kifejezett hozzájárulással (showName) és csak a cikk saját oldalán jelenhet meg; a listán (kártya) név nélkül.
 const named:KbRelease={...expert['ohm-torvenye'] as Extract<KbRelease,{kind:'lektoralt'}>,showName:true,reviewer:'Teszt Elek',registry:'01-2345'};
 assert.equal(releaseInfo(m,{'ohm-torvenye':named}).badge,'Szakmailag lektorálta: Teszt Elek, teszt · 2026-10-10');
 assert.equal(releaseBadge(named,false),'Szakmailag lektorálta: teszt · 2026-10-10','a lista jelvénye név nélküli');
 assert.ok(!releaseInfo(m,{'ohm-torvenye':{...named,showName:false}}).badge.includes('Teszt Elek'),'hozzájárulás nélkül nincs név');
 assert.ok(!releaseInfo(m,{'ohm-torvenye':named}).badge.includes('01-2345'),'a névjegyzéki szám nem jelenik meg a jelvényben');
 // A Tudástár jelvényének (név is lehet benne) felhasználói rögzítettek: a cikk saját oldala (article-view: ReviewLine, nyomtatási sor) és a
 // registry (definíció). A lista a név nélküli releaseBadge(…,false)-t hívja. Új hely csak a lektor hozzájárulásával kerülhet be.
 const walkTs=(d:string):string[]=>readdirSync(d).flatMap(f=>{const p=join(d,f);return statSync(p).isDirectory()?walkTs(p):/\.tsx?$/.test(f)?[p]:[]});
 // (A kalkulátoroldal saját, a kalkulátor-lektorhoz tartozó jelvényét a tests/lektori-csomag.ts őrzi.)
 const kbFiles=['app/(kezikonyv)/tudastar','components/kezikonyv','lib/kb','app/sitemap.ts','components/home-page.tsx','components/public-shell.tsx'].flatMap(p=>statSync(p).isDirectory()?walkTs(p):[p]).map(rel);
 const users=kbFiles.filter(f=>/\.badge\b|\bexpertShown\(|\breleaseBadge\([^)]*\)/.test(readFileSync(f,'utf8').replace(/releaseBadge\([^)]*,false\)/g,''))).sort();
 assert.deepEqual(users,['components/kezikonyv/article/article-view.tsx','lib/kb/content/registry.ts'],'a Tudástár lektori neve új helyen jelenne meg');
 assert.match(readFileSync('components/kezikonyv/article/article-list.tsx','utf8'),/releaseBadge\(info\.record!,false\)/,'a cikk-kártya jelvénye név nélküli');
}
// Mutációs próbák egy ideiglenes másolaton (a repó fájljai nem változnak): (a) ábra – a komponens, a FIGURES szöveges megfelelője és
// az ábraszín-token módosítása új ábra-ujjlenyomatot ad, és a tétel kiesik a közzétettek közül; (b) a biztonságkritikus kategóriába
// (érintésvédelem) vagy a Sémák szekcióba tett R2 vázlat generálási hiba, és a kapu sem engedi.
{
 const tmp=mkdtempSync(join(tmpdir(),'kb-mut-'));
 try{
  for(const d of ['content/tudastar',FIG_DIR,FIG_CSS]){mkdirSync(dirname(join(tmp,d)),{recursive:true});cpSync(d,join(tmp,d),{recursive:true})}
  const szin=KB_ARTICLES.find(a=>a.id==='vezetekek-szinjelolese')!,ids=figureIds(bodyOf(szin).blocks);
  assert.equal(figureSource(tmp,szin.slug,ids),szin.figures,'a másolat ábra-ujjlenyomata azonos');
  const mutate=(f:string,from:string,to:string)=>{const p=join(tmp,f),src=readFileSync(p,'utf8');assert.ok(src.includes(from),f+': '+from);writeFileSync(p,src.replace(from,to))};
  const restore=(f:string)=>cpSync(f,join(tmp,f));
  const gone=(label:string)=>{const fig=figureSource(tmp,szin.slug,ids);assert.notEqual(fig,szin.figures,label+': új ábra-ujjlenyomat');
   const info=releaseInfo({...szin,figures:fig});assert.equal(info.state,'ujraellenorzendo',label+': '+info.reason);assert.match(info.reason,/ábrák/)};
  mutate(FIG_DIR+'/vezetekek-ip.tsx',"['L1','barna','f-l1-swatch']","['L1','kék','f-n']");gone('L1 ↔ N színcsere a komponensben');restore(FIG_DIR+'/vezetekek-ip.tsx');
  mutate(FIG_INDEX,'L1 barna, L2 fekete','L1 kék, L2 fekete');gone('a FIGURES szöveges megfelelője');restore(FIG_INDEX);
  mutate(FIG_CSS,'--kk-wire-l1:#8a4b22','--kk-wire-l1:#2563b8');gone('az L1 színtoken');restore(FIG_CSS);
  mutate(FIG_CSS,'--kk-wire-l1-swatch:#8a4b22','--kk-wire-l1-swatch:#2563b8');gone('az L1 színminta-token');restore(FIG_CSS);
  mutate(FIG_DIR+'/kit.tsx','role="img"','role="img" data-x="1"');gone('a közös kit.tsx');restore(FIG_DIR+'/kit.tsx');
  assert.equal(figureSource(tmp,szin.slug,ids),szin.figures,'visszaállítva azonos');
  // (b) Kockázati alsó korlát: R2 vázlat biztonságkritikus kategóriában, illetve a Sémák szekcióban.
  const ip=readFileSync(join(SECTION_DIRS.elmelet,'ip-vedettseg.md'),'utf8');
  const copy=(dir:string,slug:string,edit:(s:string)=>string)=>{mkdirSync(join(tmp,dir),{recursive:true});writeFileSync(join(tmp,dir,slug+'.md'),edit(ip.replace('slug: ip-vedettseg','slug: '+slug)))};
  copy(SECTION_DIRS.elmelet,'ip-masolat',s=>s.replace('category: tovabbi-informaciok','category: erintesvedelem'));
  assert.throws(()=>buildModel(tmp),/biztonságkritikus.*legalább R3/,'R2 az érintésvédelem kategóriában: generálási hiba');
  rmSync(join(tmp,SECTION_DIRS.elmelet,'ip-masolat.md'));
  copy(SECTION_DIRS.semak,'ip-sema',s=>s.replace('section: elmelet','section: semak').replace('category: tovabbi-informaciok','category: kapcsolasok'));
  assert.throws(()=>buildModel(tmp),/biztonságkritikus.*legalább R3/,'R2 a Sémák szekcióban: generálási hiba');
  rmSync(join(tmp,SECTION_DIRS.semak),{recursive:true});
  copy(SECTION_DIRS.elmelet,'ip-ismeretlen',s=>s.replace('category: tovabbi-informaciok','category: nincs-ilyen'));
  assert.throws(()=>buildModel(tmp),/ismeretlen vagy/,'ismeretlen kategória: generálási hiba');
  rmSync(join(tmp,SECTION_DIRS.elmelet,'ip-ismeretlen.md'));
  assert.doesNotThrow(()=>buildModel(tmp),'a visszaállított másolat generálható');
 }finally{rmSync(tmp,{recursive:true,force:true})}
 // A kapu is: a rekord és az ujjlenyomat ellenére sem közzétett, ha a besorolás a korlát alatt van.
 const ip=KB_ARTICLES.find(a=>a.id==='ip-vedettseg')!;
 for(const m of [{...ip,category:'erintesvedelem'},{...ip,category:'vedelmi-es-automatizalasi-eszkozok'},{...ip,category:'munkabiztonsag'},{...ip,section:'semak' as const,category:'kapcsolasok'},{...ip,section:'semak' as const,category:'foldeles'},{...ip,category:'nincs-ilyen'}]){
  const info=releaseInfo(m);assert.equal(info.state,'lektorra-var',m.section+'/'+m.category+': '+info.reason);assert.equal(info.badge,'');
 }
 assert.equal(riskFloor('semak','tovabbi-informaciok'),'R3','a Sémák szekció mindig R3');
}
// Statikus paraméterek, sitemap, kereső, kalkulátoroldalak: ugyanabból a kapuból.
assert.deepEqual(articlePages(false,'elmelet').map(a=>a.slug).sort(),EXPECTED.filter(x=>x!==GLOSSARY_ID),'cikkoldalak: a közzétettek, a szótár külön útvonalon');
assert.deepEqual(visibleArticles(true).map(a=>a.id).sort(),EXPECTED,'előnézetben sincs R3 (a törzse nem is generálódik)');
{
 const page=readFileSync('app/(kezikonyv)/tudastar/elmelet/[slug]/page.tsx','utf8');
 assert.match(page,/export function generateStaticParams\(\)\{return articlePages\(kbPreview\(\),'elmelet'\)/);
 for(const re of [/export const dynamicParams=false/,/export const dynamic='force-static'/,/export const revalidate=3600/])assert.match(page,re);
 const cat=readFileSync('app/(kezikonyv)/tudastar/elmelet/kategoria/[kategoria]/page.tsx','utf8');
 assert.match(cat,/generateStaticParams\(\)\{return categoriesWithArticles\('elmelet',kbPreview\(\)\)/);assert.match(cat,/export const dynamicParams=false/);
 const sm=readFileSync('app/sitemap.ts','utf8');assert.match(sm,/publishedArticles\(\)/);assert.match(sm,/categoriesWithArticles\('elmelet'\)/);
}
const items=kbSearchItems(false);
for(const id of R3_IDS)assert.ok(!items.some(i=>i.id===id||i.href?.includes('/'+id)),id+': R3 nem kerül a keresőbe');
assert.ok(items.filter(i=>i.group==='Elmélet').length===17&&items.filter(i=>i.id.startsWith('szotar-')).length===glossaryTerms().length,'a kereső a 17 cikket, a szótárt és minden kifejezést tartalmaz');
for(const c of CALCULATORS)for(const a of articlesForCalc(c.slug))assert.ok(isPublished(a)&&a.calculators.includes(c.slug));
assert.ok(articlesForCalc('ohm-torveny').some(a=>a.id==='ohm-torvenye'),'a kalkulátoroldal a cikkre mutat');

// R3 szövege nem kerül a build bemenetei közé (forrásszint; a lefordított kimenetet a tests/kb-dist.mjs, a kiszolgált HTML-t a tests/kb-routes.mjs nézi).
{
 const needles=r3Needles();assert.ok(needles.length>300,'R3 mondatminták: '+needles.length);
 const walk=(d:string):string[]=>readdirSync(d).flatMap(f=>{const p=join(d,f);return statSync(p).isDirectory()?(f==='node_modules'?[]:walk(p)):/\.(tsx?|css|json|mjs)$/.test(f)?[p]:[]});
 const files=[...walk('lib'),...walk('components'),...walk('app')];
 for(const f of files){const s=readFileSync(f,'utf8');for(const n of needles)assert.ok(!s.includes(n),rel(f)+': R3 szöveg került a build bemenetébe: „'+n.slice(0,60)+'…”')}
}

// ------------------------------------------------------------------ 5. Belső linkek, horgonyok, kapcsolódók
const walkBlocks=(bs:readonly KbBlock[],fn:(b:KbBlock)=>void)=>{for(const b of bs){fn(b);if(b.t==='example')walkBlocks(b.blocks,fn)}};
const textsOf=(b:KbBlock):string[]=>b.t==='p'?[...b.lines]:b.t==='ul'||b.t==='ol'?[...b.items]:b.t==='table'?[...b.head,...b.rows.flat()]:b.t==='terms'?b.items.map(t=>t.text):'text' in b?[b.text]:[];
let links=0,pendingLinks=0;
for(const meta of KB_ARTICLES){
 const body=bodyOf(meta),h2=body.blocks.filter((b):b is Extract<KbBlock,{t:'h2'}>=>b.t==='h2');
 assert.deepEqual(meta.anchors.map(a=>a.id),h2.map(h=>h.id),meta.id+': az anchors a H2-k');
 const ids=new Set<string>();walkBlocks(body.blocks,b=>{const id=b.t==='h2'||b.t==='h3'||b.t==='figure'?b.id:null;if(id){assert.ok(!ids.has(id),meta.id+': ismétlődő id '+id);assert.match(id,/^[a-z0-9-]+$/);ids.add(id)}});
 for(const page of ['tartalom','kapcsolodo','kapcsolodo-cim','forrasok','forrasok-cim','valtozasok','kereses','kedvencek','fontos','lablec'])assert.ok(!ids.has(page),meta.id+': ütközés az oldal-azonosítóval: '+page);
 walkBlocks(body.blocks,b=>{for(const t of textsOf(b))for(const l of inlineLinks(t)){
  links++;
  const target=KB_ARTICLES.find(a=>a.id===l.to),pend=KB_PENDING.find(p=>p.id===l.to);
  assert.ok(target||pend,meta.id+': ismeretlen linkcél: '+l.to);
  if(target&&l.anchor)assert.ok(target.anchors.some(a=>a.id===l.anchor),meta.id+': nem létező horgony: '+l.to+'#'+l.anchor);
  if(pend){pendingLinks++;assert.deepEqual(resolveLink(l.to,l.anchor),{pending:true})}
  else assert.ok(resolveLink(l.to,l.anchor)&&'href' in resolveLink(l.to,l.anchor)!,meta.id+': közzétett cél linkje');
 }});
 for(const r of meta.related)assert.ok(KB_ARTICLES.some(a=>a.id===r)||KB_PENDING.some(p=>p.id===r),meta.id+': ismeretlen kapcsolódó cikk: '+r);
 for(const c of meta.calculators)assert.ok(CALCULATORS.some(d=>d.slug===c),meta.id+': ismeretlen kalkulátor: '+c);
 // R3-ra mutató link szövegként, „hamarosan” jelöléssel; R3-ra nincs href.
 const html=renderToStaticMarkup(createElement(ArticleBlocks,{blocks:body.blocks,ctx:{slug:meta.slug,resolve:resolvePublished}}));
 for(const p of KB_PENDING)assert.ok(!html.includes('href="/tudastar/'+p.section+'/'+p.slug),meta.id+': link R3 célra: '+p.slug);
 if(walkBlocksHasPending(body.blocks))assert.match(html,/hamarosan – szakmai lektorálás alatt/,meta.id+': a lektorra váró cél jelölése');
}
function walkBlocksHasPending(bs:readonly KbBlock[]){let f=false;walkBlocks(bs,b=>{for(const t of textsOf(b))for(const l of inlineLinks(t))if(KB_PENDING.some(p=>p.id===l.to))f=true});return f}
assert.ok(links>60&&pendingLinks>15,'belső linkek: '+links+', ebből lektorra váró célra: '+pendingLinks);
assert.equal(resolveLink('elektromos-aram','az-effektiv-ertek')&&'href' in resolveLink('elektromos-aram','az-effektiv-ertek')!?(resolveLink('elektromos-aram','az-effektiv-ertek') as {href:string}).href:'', '/tudastar/elmelet/elektromos-aram#az-effektiv-ertek');
assert.equal((resolveLink('szakszotar',null) as {href:string}).href,KB_GLOSSARY,'a szakszótár saját útvonalon');

// ------------------------------------------------------------------ 6. Szakszótár-horgonyok
{
 const terms=glossaryTerms();assert.ok(terms.length>=40&&terms.length<=70,'szótár: 40–60 körüli tétel ('+terms.length+')');
 const ids=new Set<string>();
 for(const t of terms){assert.match(t.id,/^[a-z0-9-]+$/);assert.ok(!ids.has(t.id),'ismétlődő szótári horgony: '+t.id);ids.add(t.id);assert.equal(t.id.replace(/-\d+$/,''),slugify(t.term));assert.ok(t.text.length>40,t.term)}
 const meta=KB_ARTICLES.find(a=>a.id===GLOSSARY_ID)!;for(const a of meta.anchors)assert.ok(!ids.has(a.id),'a betű-horgony nem ütközik: '+a.id);
 for(const id of ['aram-vedokapcsolo-fi-rele','pen-vezeto','ip-vedettseg','kismegszakito','nullavezeto','vedovezeto'])assert.ok(ids.has(id),'szótári horgony: #'+id);
 assert.deepEqual(termAliases(terms.find(t=>t.id==='aram-vedokapcsolo-fi-rele')!).slice(0,3),['ÁVK','RCD','FI-kapcsoló']);
 const html=renderToStaticMarkup(createElement(ArticleBlocks,{blocks:bodyOf(meta).blocks,ctx:{slug:meta.slug,resolve:resolvePublished}}));
 for(const t of terms)assert.ok(html.includes('id="'+t.id+'"'),'a horgony megjelenik: '+t.id);
 for(const it of kbSearchItems(false).filter(i=>i.id.startsWith('szotar-')))assert.ok(ids.has(it.href!.split('#')[1]),'a kereső szótári linkje létező horgonyra mutat: '+it.href);
}

// ------------------------------------------------------------------ 7. Ábrák: minden helyőrzőhöz saját SVG
{
 const used=new Set<string>();let n=0;
 for(const meta of KB_ARTICLES)walkBlocks(bodyOf(meta).blocks,b=>{if(b.t!=='figure')return;n++;const key=meta.slug+'/'+b.id;used.add(key);
  assert.ok(FIGURES[key],'hiányzó ábra: '+key);assert.ok(figureDesc(meta.slug,b).length>40,key+': szöveges megfelelő');assert.ok(b.title.length>3,key+': cím');
  // A cikkben az SVG csak a címet kapja névként (a szöveges megfelelő a figcaption-ben, a <figure> leírásaként áll – egyszer); a több
  // panelből álló ábra paneljei saját, rövid leírást kapnak (aria-describedby → <desc>).
  const html=renderToStaticMarkup(createElement(FIGURES[key].C,{uid:'t',title:b.title,desc:''}));
  const svgs=html.match(/<svg\b[^>]*>/g)??[];assert.ok(svgs.length>=1,key);
  for(const s of svgs){
   assert.match(s,/role="img"/,key);
   const lab=/aria-labelledby="([^" ]+)"/.exec(s);assert.ok(lab,key+': egyetlen aria-labelledby (a <title>)');
   assert.ok(new RegExp('<title id="'+lab![1]+'">[^<]{3,}</title>').test(html),key+': title '+lab![1]);
   const des=/aria-describedby="([^"]+)"/.exec(s);if(des)assert.ok(new RegExp('<desc id="'+des[1]+'">[^<]{20,}</desc>').test(html),key+': desc '+des[1]);
  }
  if(svgs.length===1)assert.ok(!html.includes('<desc'),key+': az egyetlen SVG-ből álló ábra nem ismétli a szöveges megfelelőt');
  const fig=renderToStaticMarkup(createElement(ArticleFigure,{slug:meta.slug,block:b,n:1}));
  assert.match(fig,new RegExp('<figure[^>]*aria-labelledby="fig-'+b.id+'-cap"[^>]*aria-describedby="fig-'+b.id+'-txt"'),key+': a figure neve az ábraaláírás, leírása a szöveges megfelelő');
  assert.match(fig,new RegExp('<span id="fig-'+b.id+'-cap"><strong>1\\. ábra\\.</strong> '),key+': a név csak „N. ábra. Cím”');
  assert.ok(!FIGURES[key].wide||/kk-fig-wide/.test(fig),key);
  assert.ok(!/<image\b|<img\b|https?:\/\/(?!www\.w3\.org)|data:image/.test(html),key+': nincs külső vagy beágyazott kép');
  assert.ok(!/\bNaN\b|undefined/.test(html),key+': nincs NaN');
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(html.replace(/stop-color="#[0-9a-f]{6}"/gi,'')),key+': színek csak tokenekből (kivétel: a színhőmérséklet valós fényszínei)');
 });
 assert.equal(n,22,'22 ábra-helyőrző');
 assert.deepEqual(Object.keys(FIGURES).sort(),[...used].sort(),'nincs fölösleges ábra-bejegyzés');
 const css=readFileSync('app/(kezikonyv)/kezikonyv.css','utf8');
 for(const t of ['--kk-wire-pe:','--kk-wire-pe-stripe:','--kk-copper:','--kk-wire-l2-swatch:'])assert.equal(css.split(t).length-1,3,'ábratoken világos, sötét és nyomtatási értékkel: '+t);
}

// ------------------------------------------------------------------ 8. „kiadás ellenőrzés alatt” – lektori kérdéslista és a vázlat megjegyzései
{
 const q=readFileSync('content/tudastar/lektori-kerdesek-elmelet.md','utf8');
 for(const c of CHECKLIST)assert.ok(q.includes(c.question),'a kérdéslistán szerepel: '+c.question);
 let flagged=0,total=0;
 for(const file of ELMELET){
  const {front}=parseDraft(readFileSync(file,'utf8')),meta=KB_ARTICLES.find(a=>a.slug===front.slug)!;
  bodyOf(meta).sources.forEach((s,i)=>{total++;if(s.check)flagged++;
   const commented=front.sources[i].comments.some(c=>/lektor|ellenőriz/i.test(c));
   if(commented||CHECKLIST.some(c=>c.match.test(s.standard)))assert.ok(s.check&&s.check.reasons.length,meta.id+': ellenőrzés alatti forrás jelölése: '+s.standard);
   else assert.ok(!s.check,meta.id+': indokolatlan jelölés: '+s.standard);
  });
 }
 assert.ok(flagged>40&&flagged<total,'jelölt források: '+flagged+'/'+total);
 const meta=KB_ARTICLES.find(a=>a.id==='elektromos-feszultseg')!;
 assert.ok(bodyOf(meta).sources.find(s=>s.standard==='MSZ EN 50160')?.check,'MSZ EN 50160 (Alapfogalmak 1)');
}

// ------------------------------------------------------------------ 9. Szerkezet, SEO, szóhasználat
const FORBIDDEN=[/\bszabványos\b/i,/megfelel a szabványnak/i,/szakmailag ellenőrzött/i,/hivatalos vizsgakérdés/i,/garantáltan/i,/bárki elvégezheti/i,/csináld magad/i,/\bGFCI\b/,/\b120 ?V\b/,/\b60 ?Hz\b/,/\bNEC\b/,/ring final/i,/fehér nullavezető/i];
for(const meta of KB_ARTICLES){
 const body=bodyOf(meta);
 assert.ok(meta.summary.length>=80&&meta.summary.length<=160,meta.id+': summary 80–160');
 assert.ok(meta.title.length<=70&&meta.navTitle.length<=34,meta.id+': title ≤ 70, navTitle ≤ 34');
 const seo=kbSeoTitle(meta.title,meta.navTitle);assert.ok(seo.length<=60&&seo.toLowerCase().includes(meta.navTitle.split(/[ ,]/)[0].toLowerCase()),meta.id+': SEO-cím ≤ 60: '+seo);
 assert.equal(body.blocks.filter(b=>b.t==='rovid').length,1,meta.id+': pontosan egy Röviden-doboz');
 assert.ok(meta.anchors.some(a=>a.title==='Gyakori tévedések'),meta.id+': Gyakori tévedések szakasz');
 if(meta.risk==='R2')assert.ok(body.blocks.some(b=>b.t==='callout'&&b.kind==='figyelem'),meta.id+': R2 → Figyelem-doboz');
 else assert.ok(!body.blocks.some(b=>b.t==='callout'),meta.id+': R1-nél nincs Figyelem-doboz (csak az alapfigyelmeztetés)');
 assert.ok(body.sources.length>=1);
 assert.ok(meta.words>=500,meta.id+': terjedelem ≥ 500 szó ('+meta.words+')');
 const text=body.blocks.map(b=>JSON.stringify(b)).join(' ');
 for(const re of FORBIDDEN)assert.ok(!re.test(text),meta.id+': tiltott vagy idegen kifejezés: '+re);
 assert.equal(articleHref(meta),meta.id===GLOSSARY_ID?'/tudastar/szotar':'/tudastar/elmelet/'+meta.slug);
}

// ------------------------------------------------------------------ 10. Sorközi jelölés: biztonság és alsó index
assert.equal(plainText(parseInline('<script>alert(1)</script> **x**')),'<script>alert(1)</script> x');
{
 const html=renderToStaticMarkup(createElement(ArticleBlocks,{blocks:[{t:'p',lines:['<script>alert(1)</script> [[ohm-torvenye|Ohm]] I_{eff} _dőlt_ `<b>`']}],ctx:{slug:'x',resolve:resolvePublished}}));
 assert.ok(!html.includes('<script')&&html.includes('&lt;script&gt;'),'a <script> szövegként jelenik meg');
 assert.match(html,/<a href="\/tudastar\/elmelet\/ohm-torvenye">Ohm<\/a>/);assert.match(html,/I<sub>eff<\/sub>/);assert.match(html,/<em>dőlt<\/em>/);assert.match(html,/<code>&lt;b&gt;<\/code>/);
}
assert.deepEqual(parseInline('a_b c_d'),[{k:'text',v:'a_b c_d'}],'a szó belsejében álló aláhúzás nem dőlt');
assert.deepEqual(parseInline('[[nem létező cél]]'),[{k:'text',v:'[[nem létező cél]]'}],'érvénytelen link szöveg marad');
// A forrásvázlatok nem tartalmaznak nyers HTML-t vagy külső képet.
for(const f of [...ELMELET])assert.ok(!/<img|<script|!\[[^\]]*\]\(/i.test(readFileSync(f,'utf8')),f+': nincs <img>, <script> vagy Markdown-kép');

console.log('PASS: generált modulok naprakészek ('+model.articles.length+' cikk, '+model.pending.length+' R3 csonk), front matter teljes, '+compared+' cikk szövege = vázlat, kapu (18 közzétett, R3 sehol; tartalmi és ábra-ujjlenyomat, kockázati alsó korlát – mutációs próbával; keresőindex = közzétett tételek), '+links+' belső link ('+pendingLinks+' lektorra váró célra szövegként), '+glossaryTerms().length+' szótári horgony, 22 ábra, forrásjelölések, SEO, inline-biztonság.');
