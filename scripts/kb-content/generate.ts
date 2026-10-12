// A Tudástár tartalommotorjának generátora: content/tudastar/<szekció>/*.md → lib/kb/content/generated/*.ts (típusos, előre
// feldolgozott blokkok). A generált fájlok a repó részei (így mindkét build target – vinext/Vite és Node – statikusan, parser nélkül
// használja őket); a tests/kb-content.ts újragenerálja őket memóriában, és eltérés esetén megbukik (elavult generált fájl).
//
// Kapu a generálásban: az R3 (biztonságkritikus) vázlatból csak szöveg nélküli azonosító-csonk lesz (KB_PENDING), amíg a
// lib/kb/release.ts-ben nincs szakmai lektori („lektoralt”) rekordja – így a lektorra váró szöveg a buildbe sem kerül. A szekció és a
// kategória kockázati alsó korlátja (lib/kb/content/categories.ts `minRisk`, Sémák: R3) alatti besorolás generálási hiba: egy tévesen
// R1/R2-nek jelölt biztonságkritikus vázlat így belső rekorddal sem juthat ki. A böngészőbe töltődő keresőindex (generated/search.ts)
// csak a kapu szerint közzétett tételeket tartalmazza (lib/kb/content/gate.ts – ugyanaz a szabály, mint a szerveren).
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {byArticleOrder,categoryById,meetsRiskFloor,riskFloor} from '../../lib/kb/content/categories';
import {contentFingerprint} from '../../lib/kb/content/fingerprint';
import {gateState} from '../../lib/kb/content/gate';
import {inlinePlain} from '../../lib/kb/content/inline';
import {GLOSSARY_ID,searchItemsOf,termsOf} from '../../lib/kb/content/search-items';
import type {KbBlock,KbBody,KbMeta,KbPending,KbSource} from '../../lib/kb/content/types';
import {KB_RELEASES,KB_SUSPENDED,type KbRelease} from '../../lib/kb/release';
import type {SearchItem} from '../../lib/kb/search';
import {SAFETY} from '../../lib/kb/safety';
import {fingerprint} from '../../lib/sizing-tables';
import type {DiagramSource} from '../../components/kezikonyv/diagram/diagram-figure';
import {checkReasons} from './checklist';
import {diagramFiles,diagramSource} from './diagrams';
import {figureSource} from './figures';
import {parseDraft,pendingFields,type FrontMatter} from './parse';
import {frontMatterSchema} from './schema';

export const SECTION_DIRS={elmelet:'content/tudastar/elmelet',semak:'content/tudastar/semak'} as const;
export const R3_DIR='content/tudastar/r3';
export const OUT_DIR='lib/kb/content/generated';

export type GenArticle={file:string;meta:KbMeta;body:KbBody};
/** `diagrams`: a kapu szerint közzétett cikkek netlistás ábrái (netlista-id → netlista és elrendezés) – csak ezek kerülnek a buildbe. */
export type Model={articles:GenArticle[];pending:(KbPending&{file:string})[];search:SearchItem[];diagrams:Record<string,DiagramSource>};

const mdFiles=(root:string,dir:string)=>existsSync(join(root,dir))?readdirSync(join(root,dir)).filter(f=>f.endsWith('.md')).sort().map(f=>join(dir,f)):[];

/** A blokkok olvasható szövege (szószámláláshoz; az ábrák rajzleírása nélkül). */
export function blocksText(blocks:readonly KbBlock[]):string{
 const out:string[]=[];
 for(const b of blocks){
  switch(b.t){
   case 'rovid':out.push('Röviden: '+inlinePlain(b.text));break;
   case 'callout':out.push(b.label+': '+inlinePlain(b.text));break;
   case 'h2':case 'h3':case 'formula':out.push(inlinePlain(b.text));break;
   case 'p':out.push(...b.lines.map(inlinePlain));break;
   case 'ul':case 'ol':out.push(...b.items.map(inlinePlain));break;
   case 'table':out.push(...b.head.map(inlinePlain),...b.rows.flat().map(inlinePlain));break;
   case 'example':out.push(blocksText(b.blocks));break;
   case 'terms':for(const t of b.items)out.push(t.term,t.note??'',inlinePlain(t.text));break;
   case 'sim':out.push(blocksText(b.blocks));break;
   case 'figure':break;
  }
 }
 return out.filter(Boolean).join('\n');
}

/** A törzs ábra-helyőrzőinek azonosítói, sorrendben (a kidolgozott példákban állók is). */
export function figureIds(blocks:readonly KbBlock[]):string[]{
 const out:string[]=[];
 const walk=(bs:readonly KbBlock[])=>{for(const b of bs){if(b.t==='figure')out.push(b.id);else if(b.t==='example'||b.t==='sim')walk(b.blocks)}};
 walk(blocks);
 return out;
}

/** Az R3 cikk kötelező elemei (docs/tudastar-terv.md 2.4, 4.2, 8.1): az első blokk a nem zárható veszély-doboz, amely tartalmazza a
 * figyelmeztetés-könyvtár (lib/kb/safety.ts) `safety` tételének mondatait; „Régi berendezésben”, „Gyakori hibák”, „Mikor hívj
 * szakembert?” szakasz; a netlistás bekötési cikkben „Hogyan működik?” és a szerelés lépései a feszültségmentesítéssel kezdve; minden
 * front matterbeli ábrához helyőrző. Hiba esetén a generálás megáll – félkész R3 oldal nem jöhet létre. */
export function checkR3(file:string,f:FrontMatter,blocks:readonly KbBlock[]){
 const lib=f.safety?SAFETY[f.safety as keyof typeof SAFETY]:undefined;
 if(!lib)throw new Error(file+': ismeretlen figyelmeztetés-könyvtári tétel (safety): '+f.safety);
 const first=blocks[0],norm=(x:string)=>inlinePlain(x).replace(/\s+/g,' ').toLowerCase();
 if(!first||first.t!=='callout'||first.kind!=='veszely')throw new Error(file+': az R3 cikk első blokkja a „> **Veszély – …**” doboz kell legyen');
 const box=norm(first.label+'. '+first.text);
 for(const sentence of (lib.title+': '+lib.text).split(/(?<=[.!?])\s+/).map(x=>norm(x).replace(/[.!?]$/,'')))if(!box.includes(sentence.replace(/^életveszély: /,'')))throw new Error(file+': a veszély-doboz nem tartalmazza a könyvtári szöveget („'+sentence+'”) – lib/kb/safety.ts '+f.safety);
 const h2=blocks.filter((b):b is Extract<KbBlock,{t:'h2'}>=>b.t==='h2').map(b=>inlinePlain(b.text));
 const need=['Régi berendezésben','Gyakori hibák','Mikor hívj szakembert?'];
 const diagrams=(f.figures??[]).filter(x=>x.netlist);
 const wiring=f.section==='semak'&&f.category==='kapcsolasok'&&diagrams.length>0;
 if(wiring)need.unshift('Hogyan működik?');
 for(const h of need)if(!h2.includes(h))throw new Error(file+': hiányzó R3 szakasz: „'+h+'”');
 if(wiring){
  const i=blocks.findIndex(b=>b.t==='h2'&&/^(A szerelés menete|Bekötés lépésről lépésre)/.test(inlinePlain(b.text)));
  if(i<0)throw new Error(file+': hiányzik a szerelés lépéseinek szakasza („A szerelés menete szakembernek” / „Bekötés lépésről lépésre”)');
  const ol=blocks.slice(i+1).find(b=>b.t==='ol'||b.t==='h2');
  if(!ol||ol.t!=='ol'||!/^\*\*Feszültségmentesítés\b/.test(ol.items[0]))throw new Error(file+': a szerelés lépései a feszültségmentesítéssel kezdődjenek');
 }
 const ids=figureIds(blocks);
 for(const x of f.figures??[])if(!ids.includes(x.id))throw new Error(file+': a front matter ábrájának ('+x.id+') nincs helyőrzője');
}

/** Ismeretlen vagy más szekcióhoz tartozó kategória, illetve a kategória/szekció kockázati alsó korlátja (lib/kb/content/categories.ts
 * `minRisk`, Sémák: R3) alatti besorolás: generálási hiba. */
export function checkRiskFloor(file:string,m:{section:KbMeta['section'];category:string;risk:KbMeta['risk']}){
 const c=categoryById(m.category);
 if(!c||c.section!==m.section)throw new Error(file+': ismeretlen vagy a(z) '+m.section+' szekcióhoz nem tartozó kategória: '+m.category+' (lib/kb/content/categories.ts)');
 if(!meetsRiskFloor(m))throw new Error(file+': a(z) '+m.category+' kategória / '+m.section+' szekció biztonságkritikus, legalább '+riskFloor(m.section,m.category)+' besorolást kíván (most: '+m.risk+'); R3 csak szakmai lektor után, a '+R3_DIR+' mappából');
}

/** Egy vázlat → cikk. `root`: a repó gyökere (az ábrák forrás-ujjlenyomatához, scripts/kb-content/figures.ts). */
export function articleFromDraft(file:string,src:string,root:string):GenArticle{
 const {front,blocks}=parseDraft(src);
 const checked=frontMatterSchema.safeParse(front);
 if(!checked.success)throw new Error(file+': hibás front matter – '+checked.error.issues.map(i=>i.path.join('.')+': '+i.message).join('; '));
 const f:FrontMatter=front;
 checkRiskFloor(file,{section:f.section as KbMeta['section'],category:f.category,risk:f.risk as KbMeta['risk']});
 const sources:KbSource[]=f.sources.map(s=>{const reasons=checkReasons(s);return {standard:s.standard,kiadas:s.kiadas,pont:s.pont,...(reasons.length?{check:{reasons}}:{})}});
 const body:KbBody={blocks,sources};
 const core={id:f.slug,slug:f.slug,section:f.section as KbMeta['section'],category:f.category,title:f.title,navTitle:f.navTitle,summary:f.summary,risk:f.risk as KbMeta['risk'],
  audience:f.audience as KbMeta['audience'],keywords:f.keywords,synonyms:f.synonyms,related:f.related,calculators:f.calculators,ai:f.ai,version:f.version,updated:f.updated};
 if(f.risk==='R3')checkR3(file,f,blocks);
 // Netlistás bekötési ábrák (R3): ábra-id → netlistafájlok (a fő ábra és a változatai); a cikk ábra-ujjlenyomatában a netlista, az
 // elrendezés, a rajzoló modulok és a rajz stílusszabályai (scripts/kb-content/diagrams.ts) szerepelnek a FIGURES-bejegyzés helyett.
 const dg=(f.figures??[]).filter(x=>x.netlist).map(x=>({figure:x.id,files:[x.netlist!,...(x.variants??[])]}));
 const r3={...(f.safety?{safety:f.safety}:{}),...(f.plannerKinds?{plannerKinds:f.plannerKinds}:{}),
  ...(dg.length?{diagrams:dg.map(d=>({figure:d.figure,ids:d.files.map(x=>diagramFiles(root,x).netlist.id)}))}:{})};
 const coreR3={...core,...r3};
 const anchors=blocks.filter((b):b is Extract<KbBlock,{t:'h2'}>=>b.t==='h2').map(b=>({id:b.id,title:inlinePlain(b.text)}));
 const words=blocksText(blocks).split(/\s+/).filter(w=>/[\p{L}\p{N}]/u.test(w)).length;
 const figIds=figureIds(blocks),plain=figIds.filter(id=>!dg.some(d=>d.figure===id));
 const figures=dg.length?fingerprint({figures:figureSource(root,f.slug,plain),diagrams:dg.map(d=>({id:d.figure,src:diagramSource(root,d.files)}))}):figureSource(root,f.slug,plain);
 const meta:KbMeta={...coreR3,anchors,words,fingerprint:contentFingerprint(coreR3,body),figures};
 return {file,meta,body};
}

/** A teljes modell a forrásvázlatokból. Az R3 vázlat csak szakmai lektori rekorddal kerül be teljes szövegként. */
export function buildModel(root:string,releases:Readonly<Record<string,KbRelease>>=KB_RELEASES,suspended:ReadonlySet<string>=KB_SUSPENDED):Model{
 const articles:GenArticle[]=[],pending:Model['pending']=[];
 for(const [section,dir] of Object.entries(SECTION_DIRS))for(const file of mdFiles(root,dir)){
  const a=articleFromDraft(file,readFileSync(join(root,file),'utf8'),root);
  if(a.meta.section!==section)throw new Error(file+': a section mező ('+a.meta.section+') nem egyezik a mappával ('+section+')');
  if(a.meta.risk==='R3'&&releases[a.meta.id]?.kind!=='lektoralt')throw new Error(file+': R3 tartalom csak a '+R3_DIR+' mappában állhat lektori jóváhagyásig');
  articles.push(a);
 }
 for(const file of mdFiles(root,R3_DIR)){
  const src=readFileSync(join(root,file),'utf8'),p=pendingFields(src);
  if(p.risk!=='R3')throw new Error(file+': az r3 mappában csak R3 vázlat lehet');
  checkRiskFloor(file,{section:p.section as KbMeta['section'],category:p.category,risk:'R3'});
  if(releases[p.slug]?.kind==='lektoralt'){
   // Lektorált R3: teljes cikk. A Sémák netlistás ábráihoz és szimulációs blokkjaihoz az ábramotor kell (docs/tudastar.md, „R3 kiadása”);
   // amíg nincs, a parser ezekre hibát dob, így félkész R3 oldal nem jöhet létre.
   articles.push(articleFromDraft(file,src,root));
  }else pending.push({file,id:p.slug,slug:p.slug,section:p.section as KbPending['section'],category:p.category,risk:'R3'});
 }
 const ids=new Set<string>();
 for(const x of [...articles.map(a=>a.meta.id),...pending.map(p=>p.id)]){if(ids.has(x))throw new Error('Ismétlődő azonosító: '+x);ids.add(x)}
 // A böngészőbe töltődő keresőindex: csak a kapu szerint közzétett cikkek és (ha a szótár közzétett) a szótári kifejezések.
 const published=articles.filter(a=>gateState(a.meta,contentFingerprint(a.meta,a.body),releases,suspended).state==='kozzeteve');
 const glossary=published.find(a=>a.meta.id===GLOSSARY_ID);
 const search=searchItemsOf(published.map(a=>a.meta).sort(byArticleOrder),glossary?termsOf(glossary.body.blocks):[]);
 // A netlistás ábrák (netlista + elrendezés) CSAK a közzétett cikkekhez kerülnek a generált modulba (és így a buildbe).
 const diagrams:Record<string,DiagramSource>={};
 for(const a of published)for(const d of a.meta.diagrams??[]){
  const fig=readFigures(root,a.file).find(x=>x.id===d.figure)!;
  for(const file of [fig.netlist!,...(fig.variants??[])]){const x=diagramFiles(root,file);diagrams[x.netlist.id]={netlist:x.netlist,layout:x.layout}}
 }
 return {articles,pending,search,diagrams};
}
const readFigures=(root:string,file:string)=>parseDraft(readFileSync(join(root,file),'utf8')).front.figures??[];

const ident=(slug:string)=>'b_'+slug.replace(/-/g,'_');
const HEADER=(src:string)=>'// GENERÁLT FÁJL – ne szerkeszd kézzel. Forrás: '+src+'; generátor: node_modules/.bin/tsx scripts/kb-content.ts build (docs/tudastar.md).\n';
const list=(xs:readonly unknown[],indent=' ')=>xs.length?'[\n'+xs.map(x=>indent+' '+JSON.stringify(x)+',').join('\n')+'\n'+indent+']':'[]';

/** A generált fájlok tartalma (relatív útvonal → szöveg). */
export function renderFiles(model:Model):Record<string,string>{
 const files:Record<string,string>={};
 const metas=model.articles.map(a=>a.meta);
 files[OUT_DIR+'/articles.ts']=HEADER('content/tudastar/*')+
  '// A közzétehető cikkek könnyű metaadata (kliensre is átadható) és a lektorra váró R3 vázlatok szöveg nélküli azonosítói.\n'+
  "import type {KbMeta,KbPending} from '../types';\n\n"+
  'export const KB_ARTICLES:readonly KbMeta[]='+list(metas,'')+';\n\n'+
  '/** Lektorra vár (R3): csak azonosítók – a cím, az összefoglaló és a törzs a lektori jóváhagyásig nem kerül a buildbe. */\n'+
  'export const KB_PENDING:readonly KbPending[]='+list(model.pending.map(({id,slug,section,category,risk})=>({id,slug,section,category,risk})),'')+';\n';
 for(const a of model.articles){
  files[OUT_DIR+'/bodies/'+a.meta.slug+'.ts']=HEADER(a.file)+
   "import type {KbBody} from '../../types';\n\n"+
   'const body:KbBody={\n blocks:'+list(a.body.blocks)+',\n sources:'+list(a.body.sources)+',\n};\nexport default body;\n';
 }
 files[OUT_DIR+'/search.ts']=HEADER('content/tudastar/* és lib/kb/release.ts')+
  '// A Tudástár keresőindexe a böngészőnek: CSAK a kapu szerint közzétett cikkek és szótári kifejezések könnyű metaadata (cím, összefoglaló,\n'+
  '// kulcsszavak, szinonimák), cikktörzs nélkül. A kereső az első megnyitáskor tölti be (components/kezikonyv/kb-chrome.tsx), és a szerver\n'+
  '// által átadott közzétett célokra szűri; így nem kerül minden oldal HTML-jébe. A kiadási rekord változása után újra kell generálni.\n'+
  "import type {SearchItem} from '../../search';\n\n"+
  'export const KB_SEARCH_ITEMS:readonly SearchItem[]='+list(model.search,'')+';\n';
 files[OUT_DIR+'/diagrams.ts']=HEADER('content/tudastar/r3/*.netlist.json, content/tudastar/diagramok/*.json és lib/kb/release.ts')+
  '// A netlistás bekötési ábrák (netlista + elrendezés) – CSAK a kapu szerint közzétett cikkekéi; a lektorra váró (R3) ábrák nem kerülnek\n'+
  '// a buildbe. Csak szerveroldal (lib/kb/content/registry.ts) importálja; kliensszigetbe nem kerülhet (tests/kb-guards.ts).\n'+
  "import type {DiagramSource} from '@/components/kezikonyv/diagram/diagram-figure';\n\n"+
  'export const KB_DIAGRAMS:Readonly<Record<string,DiagramSource>>='+(Object.keys(model.diagrams).length?'{\n'+Object.entries(model.diagrams).sort(([a],[b])=>a<b?-1:1).map(([k,v])=>' '+JSON.stringify(k)+':'+JSON.stringify(v)+',').join('\n')+'\n}':'{}')+';\n';
 files[OUT_DIR+'/bodies/index.ts']=HEADER('content/tudastar/*')+
  '// A cikktörzsek – CSAK szerveroldal (lib/kb/content/registry.ts) importálja; kliensszigetbe nem kerülhet (tests/kb-guards.ts).\n'+
  "import type {KbBody} from '../../types';\n"+
  model.articles.map(a=>'import '+ident(a.meta.slug)+" from './"+a.meta.slug+"';").join('\n')+'\n\n'+
  'export const KB_BODIES:Readonly<Record<string,KbBody>>={\n'+model.articles.map(a=>" '"+a.meta.slug+"':"+ident(a.meta.slug)+',').join('\n')+'\n};\n';
 return files;
}
