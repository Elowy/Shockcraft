// A lektori csomag 5. része – az R3 (biztonságkritikus) cikkvázlatok (content/tudastar/r3/*.md): a lektor a cikk SZÖVEGÉT is jóváhagyja,
// ezért a csomag cikkenként tartalmazza a teljes szöveget (veszély-doboz, szakaszok, táblák, források), a tartalmi ujjlenyomatot
// (lib/kb/content/fingerprint.ts – ez kerül a Tudástár kiadási rekordjába és a kiadás EDITIONS-bejegyzésébe), a cikk saját lektori
// kérdéseit és a Jóváhagyó lap cikkenkénti döntési sorát. A cikkszöveg és a bekötési ábra (4. rész) jóváhagyása együtt kell a cikk
// megjelenéséhez. A modul csak adatot állít elő (Markdown- és PDF-kirajzolás: scripts/lektori-csomag.ts); node:fs-t használ.
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {inlinePlain} from '../lib/kb/content/inline';
import type {KbBlock,KbSource} from '../lib/kb/content/types';
import {articleFromDraft} from './kb-content/generate';
import {NETLIST_DIR} from './kb-content/diagrams';
import {parseDraft,type FrontMatter} from './kb-content/parse';

export type ArticleData={
 slug:string;file:string;title:string;summary:string;fingerprint:string;words:number;safety:string;
 blocks:readonly KbBlock[];sources:readonly KbSource[];
 /** A cikk saját lektori kérdései (a front matterből). */
 questions:readonly string[];
 /** Az ábrák: front matter szerint – azonosító, a netlista (ha van) és a változatok. */
 figures:readonly {id:string;netlist?:string;variants:readonly string[];kind?:string}[];
 /** A cikk kiadását akadályozó, még hiányzó elem (ha van): a szöveg ettől függetlenül jóváhagyható. */
 blocked?:string;
};
/** A kiadást még akadályozó hiányok (R3 vázlatok, amelyekhez nem netlistás ábra vagy új nézet kell). Teszt: pontosan azok a vázlatok,
 * amelyekből a generátor (ábra-ujjlenyomattal) még nem tud cikket készíteni (tests/lektori-csomag.ts). */
export const BLOCKED:Readonly<Record<string,string>>={
 'kismegszakito':'a jelleggörbe-ábra (B/C/D kioldási tartományok) még nincs kész',
 'aram-vedokapcsolo-fi-rele':'az összegáramváltó elvét mutató ábra még nincs kész',
 'feszultsegmentesites-ot-szabalya':'a folyamatábra (az öt lépés) még nincs kész',
 'vilagitasi-kapcsolasok':'az áttekintő ábra a tervező szerelési rajzára épülne (Szerelési rajz nézet, még nincs kész)',
};
/** A cikkvázlatok (R3) a front matter `slug`-ja szerint rendezve; az ujjlenyomat a tartalmi (az ábra-ujjlenyomat a még nem kiadható
 * vázlatnál nem számolható). */
export function r3Articles(root='.'):ArticleData[]{
 const dir=join(root,NETLIST_DIR);
 return readdirSync(dir).filter(f=>f.endsWith('.md')).sort().map(f=>{
  const file=NETLIST_DIR+'/'+f,src=readFileSync(join(root,file),'utf8'),{front,blocks}=parseDraft(src) as {front:FrontMatter;blocks:KbBlock[]};
  const a=articleFromDraft(file,src,root,{figures:false});
  return {slug:front.slug,file,title:front.title,summary:front.summary,fingerprint:a.meta.fingerprint,words:a.meta.words,safety:front.safety??'',blocks,sources:a.body.sources,
   questions:front.lektorKerdesek??[],figures:(front.figures??[]).map(x=>({id:x.id,...(x.netlist?{netlist:x.netlist}:{}),variants:x.variants??[],...(x.kind?{kind:x.kind}:{})})),
   ...(BLOCKED[front.slug]?{blocked:BLOCKED[front.slug]}:{})};
 }).sort((a,b)=>a.slug<b.slug?-1:1);
}
export const articleId=(slug:string)=>'CIK-'+slug.toUpperCase();

// ---------------------------------------------------------------- Szöveg (Markdown és PDF közös bejárása)
/** A cikktörzs lapos sorlistája: a PDF és a Markdown ugyanezt rajzolja ki. */
export type Flat=
 |{k:'callout';label:string;text:string}
 |{k:'p';text:string;style?:'rovid'|'formula'|'h3'}
 |{k:'h2';text:string}
 |{k:'list';items:string[];ordered:boolean}
 |{k:'table';head:string[];rows:string[][]}
 |{k:'figure';id:string;caption:string};
export function flatten(blocks:readonly KbBlock[]):Flat[]{
 const out:Flat[]=[];
 const walk=(bs:readonly KbBlock[])=>{
  for(const b of bs){
   switch(b.t){
    case 'rovid':out.push({k:'p',text:'Röviden: '+inlinePlain(b.text),style:'rovid'});break;
    case 'callout':out.push({k:'callout',label:inlinePlain(b.label),text:inlinePlain(b.text)});break;
    case 'h2':out.push({k:'h2',text:inlinePlain(b.text)});break;
    case 'h3':out.push({k:'p',text:inlinePlain(b.text),style:'h3'});break;
    case 'p':out.push({k:'p',text:b.lines.map(inlinePlain).join(' ')});break;
    case 'formula':out.push({k:'p',text:inlinePlain(b.text),style:'formula'});break;
    case 'ul':out.push({k:'list',items:b.items.map(inlinePlain),ordered:false});break;
    case 'ol':out.push({k:'list',items:b.items.map(inlinePlain),ordered:true});break;
    case 'table':out.push({k:'table',head:b.head.map(inlinePlain),rows:b.rows.map(r=>r.map(inlinePlain))});break;
    case 'figure':out.push({k:'figure',id:b.id,caption:inlinePlain(b.caption)});break;
    case 'sim':case 'example':walk(b.blocks);break;
    case 'terms':for(const t of b.items)out.push({k:'p',text:inlinePlain(t.term)+': '+inlinePlain(t.text)});break;
   }
  }
 };
 walk(blocks);
 return out;
}
/** A cikk forrásai (standard, kiadás, pont) táblázatsorokként. */
export const sourceRows=(a:ArticleData)=>a.sources.map(s=>[s.standard,s.kiadas,s.pont]);
/** A szó szerinti olvasási idő becslése (perc): 110 szó/perc a gondos, szakmai átolvasáshoz + kérdésenként 4 perc + döntés 5 perc. */
export const articleMinutes=(a:ArticleData)=>Math.ceil(a.words/110)+4*a.questions.length+5;
const cell=(s:string)=>s.replace(/\|/g,'\\|').replace(/\n/g,' ');
/** A cikktörzs Markdown-sorai (a blokk címe ### szintű, a cikk szakaszai ####). */
export function mdArticle(a:ArticleData,figureRef:(figId:string)=>string):string[]{
 const o:string[]=[];
 for(const x of flatten(a.blocks)){
  switch(x.k){
   case 'callout':o.push('> **'+x.label+'.** '+x.text,'');break;
   case 'h2':o.push('#### '+x.text,'');break;
   case 'p':o.push(x.style==='h3'?'**'+x.text+'**':x.style==='formula'?'    '+x.text:x.text,'');break;
   case 'list':o.push(...x.items.map((i,n)=>(x.ordered?`${n+1}. `:'- ')+i),'');break;
   case 'table':o.push('| '+x.head.join(' | ')+' |','|'+x.head.map(()=>'---').join('|')+'|',...x.rows.map(r=>'| '+r.map(cell).join(' | ')+' |'),'');break;
   case 'figure':o.push('*Ábra ('+x.id+'): '+x.caption+' – '+figureRef(x.id)+'*','');break;
  }
 }
 if(a.sources.length)o.push('**Források és szabványpontok:**','','| Szabvány | Kiadás | Pont |','|---|---|---|',...sourceRows(a).map(r=>'| '+r.map(cell).join(' | ')+' |'),'');
 return o;
}
