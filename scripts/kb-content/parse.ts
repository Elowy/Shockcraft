// A Tudástár forrásvázlatainak (content/tudastar/<szekció>/*.md) feldolgozása: YAML front matter (a vázlatokban használt részhalmaz)
// és Markdown-törzs → típusos blokkok (lib/kb/content/types.ts). Tiszta modul, csak a generátor (scripts/kb-content.ts) és a tesztek
// használják – a futó alkalmazásba nem kerül (tests/kb-guards.ts). A szöveget NEM írja át: csak a formát alakítja.
//
// Formátumszabályok (docs/tudastar.md „Tartalomkészítés”):
//  - front matter: `kulcs: érték`, `kulcs: "idézett"`, `kulcs: [a, b, c]` (elválasztó: vessző + szóköz; a tizedesvessző az elem része: 3G2,5),
//    `sources:` alatt `- standard:` / `kiadás:` / `pont:` hármasok; a sorvégi `# megjegyzés` megmarad (ellenőrzési jelzés).
//  - törzs: `## ` / `### ` címsor, `> **Címke:** …` figyelmeztető doboz, `**Röviden:** …` összefoglaló, `- ` és `1. ` lista,
//    `| … |` táblázat, `[ÁBRA: abra-N …]` ábra-helyőrző, minden más bekezdés (a sortörések megmaradnak).
//  - sorközi jelölés: **…**, _…_, `…`, [[id#horgony|szöveg]]; a Markdown alsó index (I_eff) a mini-jelölés I_{eff} alakjára vált.
import {slugify} from '../../lib/kb/content/inline';
import type {KbBlock,KbTerm} from '../../lib/kb/content/types';

export type RawSource={standard:string;kiadas:string;pont:string;comments:string[]};
export type FrontMatter={
 slug:string;title:string;navTitle:string;summary:string;section:string;category:string;risk:string;
 audience:string[];keywords:string[];synonyms:string[];related:string[];calculators:string[];
 sources:RawSource[];ai:string;version:string;updated:string;
};
export const FRONT_KEYS=['slug','title','navTitle','summary','section','category','risk','audience','keywords','synonyms','related','calculators','sources','ai','version','updated'] as const;

export function splitFrontMatter(src:string):{yaml:string;body:string}{
 const t=src.replace(/\r\n/g,'\n');
 const m=/^---\n([\s\S]*?)\n---\n/.exec(t);
 if(!m)throw new Error('Hiányzó front matter (--- … ---).');
 return {yaml:m[1],body:t.slice(m[0].length)};
}

/** Egy YAML-érték és az utána álló megjegyzés. */
function scalar(raw:string):{value:string|string[];comment:string}{
 const s=raw.trim();
 if(s.startsWith('"')){
  let j=1;while(j<s.length&&s[j]!=='"'){if(s[j]==='\\')j++;j++}
  if(j>=s.length)throw new Error('Lezáratlan idézőjel: '+s);
  const rest=s.slice(j+1).trim();
  if(rest&&!rest.startsWith('#'))throw new Error('Váratlan szöveg az idézőjel után: '+s);
  return {value:s.slice(1,j).replace(/\\(.)/g,'$1'),comment:rest.replace(/^#\s*/,'')};
 }
 if(s.startsWith('[')){
  const j=s.lastIndexOf(']');if(j<0)throw new Error('Lezáratlan lista: '+s);
  const rest=s.slice(j+1).trim();
  const inner=s.slice(1,j).trim();
  return {value:inner?inner.split(/,\s+/).map(x=>x.trim().replace(/^"(.*)"$/,'$1')).filter(Boolean):[],comment:rest.replace(/^#\s*/,'')};
 }
 const h=s.search(/\s#/);
 return h<0?{value:s,comment:''}:{value:s.slice(0,h).trim(),comment:s.slice(h).trim().replace(/^#\s*/,'')};
}

/** A vázlatokban használt YAML-részhalmaz feldolgozása. Ismeretlen szerkezetre hibát dob (a generátor ne találgasson). */
export function parseFrontMatter(yaml:string):FrontMatter{
 const out:Record<string,unknown>={};const sources:RawSource[]=[];
 const lines=yaml.split('\n');
 for(let i=0;i<lines.length;i++){
  const line=lines[i];if(!line.trim())continue;
  const top=/^([A-Za-z][\w]*):(?:\s(.*))?$/.exec(line);
  if(!top)throw new Error('Nem értelmezhető front matter sor: '+line);
  const [,key,rest]=top;
  if(key==='sources'){
   while(i+1<lines.length&&/^\s+/.test(lines[i+1])){
    i++;
    const item=/^\s+-\s+(\w+):\s(.*)$/.exec(lines[i]),cont=/^\s+(\S+?):\s(.*)$/.exec(lines[i]);
    if(item){sources.push({standard:'',kiadas:'',pont:'',comments:[]});}
    const m=item??cont;if(!m||!sources.length)throw new Error('Nem értelmezhető forrássor: '+lines[i]);
    const field=m[1]==='kiadás'?'kiadas':m[1];
    if(!['standard','kiadas','pont'].includes(field))throw new Error('Ismeretlen forrásmező: '+m[1]);
    const v=scalar(m[2]),src=sources[sources.length-1];
    if(typeof v.value!=='string')throw new Error('A forrásmező szöveg: '+lines[i]);
    (src as Record<string,unknown>)[field]=v.value;
    if(v.comment)src.comments.push((field==='kiadas'?'kiadás':field)+': '+v.comment);
   }
   continue;
  }
  const v=scalar(rest??'');
  out[key]=v.value;
 }
 for(const k of Object.keys(out))if(!(FRONT_KEYS as readonly string[]).includes(k))throw new Error('Ismeretlen front matter mező: '+k);
 const str=(k:string)=>{const v=out[k];if(typeof v!=='string')throw new Error('Hiányzó vagy nem szöveges mező: '+k);return v};
 const list=(k:string)=>{const v=out[k];if(!Array.isArray(v))throw new Error('Hiányzó vagy nem lista mező: '+k);return v as string[]};
 return {slug:str('slug'),title:str('title'),navTitle:str('navTitle'),summary:str('summary'),section:str('section'),category:str('category'),risk:str('risk'),
  audience:list('audience'),keywords:list('keywords'),synonyms:list('synonyms'),related:list('related'),calculators:list('calculators'),
  sources,ai:str('ai'),version:str('version'),updated:str('updated')};
}

/** Lektorra váró (R3) vázlat: csak az azonosító mezők (a szöveg nem kerülhet a generált modulokba). */
export function pendingFields(src:string):{slug:string;section:string;category:string;risk:string;review:string}{
 const {yaml}=splitFrontMatter(src);
 const get=(k:string)=>{const m=new RegExp('^'+k+':\\s*(.*)$','m').exec(yaml);if(!m)throw new Error('Hiányzó mező: '+k);return String(scalar(m[1]).value)};
 return {slug:get('slug'),section:get('section'),category:get('category'),risk:get('risk'),review:get('review')};
}

/** Markdown alsó index → mini-jelölés: „I_eff” → „I_{eff}” (a szó eleji _dőlt_ jelölést nem érinti). */
export const subscripts=(s:string)=>s.replace(/([\p{L}\p{N}])_([\p{L}\p{N}]+)(?![\p{L}\p{N}_])/gu,'$1_{$2}');

type Raw={t:'para';lines:string[]}|{t:'bullets';items:string[]}|{t:'numbered';items:string[]}|{t:'rows';rows:string[]}|{t:'quote';lines:string[]};

const cells=(row:string)=>{const s=row.trim().replace(/^\|/,'').replace(/\|$/,'');return s.split('|').map(c=>c.trim())};

/** Önálló képletsor: egysoros bekezdés „=” jellel, legfeljebb 100 karakter, nem kettősponttal végződik, és az első „=” előtti rész
 * képletszerű (nincs benne 5 betűsnél hosszabb szó). Csak megjelenítés: a szöveg nem változik. */
export function isFormula(line:string){
 if(line.length>100||!line.includes(' = ')||/:\s*$/.test(line))return false;
 const pre=line.slice(0,line.indexOf(' = '));
 return pre.length<=30&&!(pre.match(/\p{L}+/gu)??[]).some(w=>w.length>=5);
}

function parseFigure(line:string):KbBlock{
 const m=/^\[ÁBRA:\s*(abra-\d+)\s*([\s\S]*)\]$/.exec(line.trim());
 if(!m)throw new Error('Nem értelmezhető ábra-helyőrző: '+line.slice(0,80));
 const [,id,rest]=m;
 const titleField=/(?:^|[\s.;])title:\s*„([^”]+)”/.exec(rest)?.[1]??null;
 const descField=/(?:^|[\s.;])desc:\s*„([^”]+)”/.exec(rest)?.[1]??null;
 let caption:string|null=null;
 const quoted=/^„([^”]+)”/.exec(rest);
 if(quoted)caption=quoted[1];
 else{const dash=/^–\s*(.+?[.?!])(?:\s|$)/.exec(rest);if(dash)caption=dash[1].replace(/\.$/,'')}
 if(!caption)throw new Error('Az ábra-helyőrzőnek nincs címe: '+id);
 return {t:'figure',id,caption,title:titleField??caption,desc:descField,spec:rest.trim()};
}

/** Szakszótár-tétel: „**Kifejezés** (kiegészítés) – meghatározás”. */
export function parseTerm(item:string):KbTerm{
 const m=/^\*\*(.+?)\*\*/.exec(item);if(!m)throw new Error('Nem értelmezhető szótári tétel: '+item.slice(0,60));
 const term=m[1];let i=m[0].length,note:string|null=null;
 if(item.startsWith(' (',i)){
  let depth=0,j=i+1;
  for(;j<item.length;j++){if(item[j]==='(')depth++;else if(item[j]===')'&&--depth===0)break}
  if(j>=item.length)throw new Error('Lezáratlan zárójel a szótári tételben: '+term);
  note=item.slice(i+2,j);i=j+1;
 }
 if(!item.startsWith(' – ',i))throw new Error('A szótári tételben a kifejezés után „ – ” kell: '+term);
 return {id:slugify(term),term,note,text:item.slice(i+3)};
}

const EXAMPLE_START=/^\*\*(Kidolgozott példa|Kidolgozott példák|Számpélda|Háromfázisú példa)\b/;
const computational=(b:KbBlock):boolean=>b.t==='formula'||(b.t==='p'&&b.lines.every(l=>/[=≈]/.test(l)||/^Ellenőrzés\b/.test(l)))||((b.t==='ul'||b.t==='ol')&&b.items.every(x=>/[=≈]/.test(x)));
const endsWithColon=(b:KbBlock)=>b.t==='p'?/:\s*$/.test(b.lines[b.lines.length-1]):b.t==='formula'?/:\s*$/.test(b.text):false;

/** A „Kidolgozott példa …” bekezdés és a közvetlenül hozzá tartozó számítási sorok (képlet, „=”-es sorok, „Ellenőrzés …”) egy blokkba. */
function groupExamples(blocks:KbBlock[]):KbBlock[]{
 const out:KbBlock[]=[];
 for(let i=0;i<blocks.length;i++){
  const b=blocks[i];
  if(b.t==='p'&&EXAMPLE_START.test(b.lines[0])){
   const group:KbBlock[]=[b];
   while(i+1<blocks.length){
    const n=blocks[i+1],prev=group[group.length-1];
    if(!['p','formula','ul','ol','table'].includes(n.t)||(n.t==='table'&&!endsWithColon(prev)))break;
    if(n.t==='p'&&n.lines[0].startsWith('**'))break; // új, félkövérrel kezdődő bekezdés: új gondolat (pl. „**Motorok.**”)
    if(!(computational(n)||endsWithColon(prev)))break;
    group.push(n);i++;
   }
   out.push({t:'example',blocks:group});
  }else out.push(b);
 }
 return out;
}

/** Markdown-törzs → blokkok. `glossary`: a szakszótár betűs (egy-két betűs) szakaszai alatti listák szótári tételek. */
export function parseBody(body:string,{glossary=false}:{glossary?:boolean}={}):KbBlock[]{
 const raw:(Raw|KbBlock)[]=[];let cur:Raw|null=null;
 const flush=()=>{if(cur)raw.push(cur);cur=null};
 for(const line0 of body.split('\n')){
  const line=line0.replace(/\s+$/,'');
  if(!line.trim()){flush();continue}
  if(/^##\s/.test(line)){flush();raw.push({t:'h2',id:'',text:subscripts(line.replace(/^##\s+/,''))});continue}
  if(/^###\s/.test(line)){flush();raw.push({t:'h3',id:'',text:subscripts(line.replace(/^###\s+/,''))});continue}
  if(/^#/.test(line))throw new Error('Nem támogatott címsorszint: '+line);
  if(line.startsWith('<'))throw new Error('HTML-elem vagy -megjegyzés (pl. szimulációs blokk) nem támogatott – az R3 Sémákhoz az ábramotor kell: '+line.slice(0,60));
  if(line.startsWith('[ÁBRA:')){flush();raw.push(parseFigure(line));continue}
  if(line.startsWith('>')){if(cur?.t!=='quote'){flush();cur={t:'quote',lines:[]}}cur.lines.push(line.replace(/^>\s?/,''));continue}
  if(line.startsWith('|')){if(cur?.t!=='rows'){flush();cur={t:'rows',rows:[]}}cur.rows.push(line);continue}
  if(/^- /.test(line)){if(cur?.t!=='bullets'){flush();cur={t:'bullets',items:[]}}cur.items.push(line.slice(2));continue}
  if(/^\d+\.\s/.test(line)){if(cur?.t!=='numbered'){flush();cur={t:'numbered',items:[]}}cur.items.push(line.replace(/^\d+\.\s+/,''));continue}
  if(/^\s/.test(line))throw new Error('Behúzott sor (beágyazott lista?) nem támogatott: '+line);
  if(cur?.t!=='para'){flush();cur={t:'para',lines:[]}}
  cur.lines.push(line);
 }
 flush();
 const blocks:KbBlock[]=[];const ids=new Set<string>();let letter=false;
 const uniq=(base:string)=>{let id=base||'szakasz',n=2;while(ids.has(id))id=base+'-'+n++;ids.add(id);return id};
 for(const r of raw){
  switch(r.t){
   case 'h2':{
    letter=glossary&&/^[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]?$/.test(r.text);
    blocks.push({t:'h2',id:uniq(letter?'betu-'+slugify(r.text):slugify(r.text)),text:r.text});break;
   }
   case 'h3':blocks.push({t:'h3',id:uniq(slugify(r.text)),text:r.text});break;
   case 'quote':{
    const text=subscripts(r.lines.join(' ').trim()),m=/^\*\*(Figyelem):\*\*\s+([\s\S]*)$/.exec(text);
    if(!m)throw new Error('Csak „> **Figyelem:** …” doboz támogatott: '+text.slice(0,60));
    blocks.push({t:'callout',kind:'figyelem',label:m[1],text:m[2]});break;
   }
   case 'rows':{
    const rows=r.rows.filter(x=>!/^\|\s*:?-{3,}/.test(x)).map(x=>cells(x).map(subscripts));
    const [head,...rest]=rows;
    if(!head||rest.some(x=>x.length!==head.length))throw new Error('Szabálytalan táblázat: '+r.rows[0]);
    blocks.push({t:'table',head,rows:rest});break;
   }
   case 'bullets':blocks.push(letter?{t:'terms',items:r.items.map(x=>{const t=parseTerm(subscripts(x));return t})}:{t:'ul',items:r.items.map(subscripts)});break;
   case 'numbered':blocks.push({t:'ol',items:r.items.map(subscripts)});break;
   case 'para':{
    const lines=r.lines.map(subscripts);
    const rov=/^\*\*Röviden:\*\*\s+([\s\S]*)$/.exec(lines.join('\n'));
    if(rov){blocks.push({t:'rovid',text:rov[1].replace(/\n/g,' ')});break}
    blocks.push(lines.length===1&&isFormula(lines[0])?{t:'formula',text:lines[0]}:{t:'p',lines});break;
   }
   default:blocks.push(r);
  }
 }
 // A szótári tételek horgonya is egyedi legyen (a címsorokkal együtt).
 for(const b of blocks)if(b.t==='terms')(b.items as KbTerm[]).forEach(t=>{t.id=uniq(t.id)});
 return groupExamples(blocks);
}

export function parseDraft(src:string){
 const {yaml,body}=splitFrontMatter(src);
 const front=parseFrontMatter(yaml);
 return {front,blocks:parseBody(body,{glossary:front.slug==='szakszotar'})};
}
