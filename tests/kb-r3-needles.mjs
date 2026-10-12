// Az R3 (lektorra váró) vázlatok szövegmintái: a címek, az összefoglalók és a legalább 50 karakteres mondatok
// (content/tudastar/r3/*.md). A tests/kb-content.ts a build bemeneteit (lib, components, app), a tests/kb-dist.mjs a build
// kimenetét (dist/), a tests/kb-routes.mjs a kiszolgált HTML-t nézi végig ezekkel: az R3 szövege sehol nem jelenhet meg.
// A közzétett R1/R2 vázlatok saját szövege kimarad (pl. az R3 cikk címe egy R2 cikkben linkfeliratként áll, és ott „hamarosan –
// szakmai lektorálás alatt” jelöléssel, szövegként jelenik meg).
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';

const md=(dir)=>readdirSync(dir).filter(f=>f.endsWith('.md')).sort().map(f=>join(dir,f));

/** @returns {{slug:string,section:string,category:string}[]} az R3 vázlatok azonosítói */
export function r3Items(root='.'){
 return md(join(root,'content/tudastar/r3')).map(f=>{const s=readFileSync(f,'utf8');return {slug:/^slug:\s*(\S+)/m.exec(s)[1],section:/^section:\s*(\S+)/m.exec(s)[1],category:/^category:\s*(\S+)/m.exec(s)[1]}});
}

/** @returns {string[]} az R3 szövegmintái (legfeljebb 120 karakteres, önmagukban is egyedi részletek) */
export function r3Needles(root='.'){
 const out=new Set();
 for(const f of md(join(root,'content/tudastar/r3'))){
  const src=readFileSync(f,'utf8').replace(/\r\n/g,'\n'),m=/^---\n([\s\S]*?)\n---\n/.exec(src),yaml=m?m[1]:'',body=m?src.slice(m[0].length):src;
  for(const k of ['title','summary']){const v=new RegExp('^'+k+':\\s*"(.*)"$','m').exec(yaml);if(v&&v[1].length>=25)out.add(v[1])}
  for(const line of body.split('\n')){
   const t=line.replace(/^[#>\-\s\d.|]+/,'').replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g,'$1').replace(/\*\*|`/g,'').trim();
   if(t.startsWith('[ÁBRA')||t.startsWith('<!--'))continue;
   for(const s of t.split(/(?<=[.!?])\s+/))if(s.length>=50&&!/^[|:\-\s]+$/.test(s))out.add(s.slice(0,120));
  }
 }
 const own=md(join(root,'content/tudastar/elmelet')).map(f=>readFileSync(f,'utf8')).join('\n');
 // A figyelmeztetés-könyvtár (lib/kb/safety.ts) közös szövege – pl. a `bekotes` veszély-doboz mondatai – nem R3 cikkszöveg: a vázlatok
 // veszély-doboza ezeket tartalmazza (a generátor ellenőrzi), a könyvtár maga a build része.
 const lib=readFileSync(join(root,'lib/kb/safety.ts'),'utf8');
 return [...out].filter(n=>!own.includes(n)&&!lib.includes(n));
}

/** A lektorra váró netlisták és elrendezések (content/tudastar/r3/*.netlist.json, content/tudastar/diagramok/*.json) minden emberi szövege:
 * címek, megjegyzések (note, megjegyzes – mondatonként), alkatrész-, kapocs-, szakasz-, állás-, hely- és vezetékfeliratok, az elrendezés
 * feliratai – legalább 12 karakter, és nem fordul elő a közzétett vázlatokban –, valamint az alkatrész: kapocs alak (a vezetéktábla
 * sora). A bekötési ábra (SVG, vezetéktábla, jelmagyarázat, állapotszöveg) ezekből készül, így a kiszolgált oldalakon és a build
 * kimenetében sem lehetnek (tests/kb-dist.mjs, tests/kb-routes.mjs, tests/kb-content.ts). */
const SKIP_KEYS=new Set(['id','format','netlist','fingerprint','figure','article','color','conductor','role','type','kind','from','to','at','wire','a','b','comp','section','sections_id','version','system','class','unit']);
function collect(v,out){
 if(typeof v==='string')out.push(v);
 else if(Array.isArray(v))for(const x of v)collect(x,out);
 else if(v&&typeof v==='object')for(const [k,x] of Object.entries(v)){if(!SKIP_KEYS.has(k))collect(x,out)}
}
/** Közös szakmai és termékszókincs: a tervező, a katalógus-mintakészlet, az ábramotor és a szimulátor kódjában is előforduló rövid kifejezések
 * (nem R3 szöveg, kódból nem származtathatók le). A lista csak bővülhet indoklással; egy új netlistafelirat nem kerülhet ide. */
const COMMON_VOCABULARY=new Set(['elosztón belül','földelőkapocs','érintésvédelmi osztály)','lekapcsolasig','a fogyasztó csatlakozásánál','keresztezett','Csillárkapcsoló']);
export function netlistNeedles(root='.'){
 const out=new Set(),add=(t)=>{const x=String(t).replace(/\s+/g,' ').trim();if(x.length>=12&&/[\p{L}]{3}/u.test(x))out.add(x.slice(0,120))};
 for(const f of readdirSync(join(root,'content/tudastar/r3')).filter(f=>f.endsWith('.netlist.json')).sort()){
  const n=JSON.parse(readFileSync(join(root,'content/tudastar/r3',f),'utf8'));
  const all=[];collect(n,all);
  for(const t of all)for(const sent of t.split(/(?<=[.!?])\s+/))add(sent);
  for(const c of n.components)for(const t of c.terminals)add((c.label??c.id)+': '+(t.label??t.id));
 }
 const ld=join(root,'content/tudastar/diagramok');
 for(const f of readdirSync(ld).filter(f=>f.endsWith('.json')).sort()){
  const l=JSON.parse(readFileSync(join(ld,f),'utf8')),all=[];
  for(const p of Object.values(l.parts??{})){collect(p.label??{},all);collect(p.tt??{},all);collect(p.tl&&Object.fromEntries(Object.entries(p.tl).map(([k,v])=>[k,typeof v==='object'&&!Array.isArray(v)?'':v])),all)}
  collect(l.places??[],all);collect(l.notes??[],all);
  for(const t of all)add(t);
 }
 const own=md(join(root,'content/tudastar/elmelet')).map(f=>readFileSync(f,'utf8')).join('\n');
 return [...out].filter(x=>!own.includes(x)&&!COMMON_VOCABULARY.has(x));
}
/** A bekötési ábra jelölői a kirajzolt HTML-ben (csak a renderelt SVG-ben fordulnak elő, a kódban nem). */
export const DIAGRAM_MARKERS=['data-diagram="','data-wire="','data-diagram-figure="'];

/** A HTML-ben a szöveg entitásokkal is állhat; a keresés a szövegcsomópontok egyszerűsített alakján fut. */
export const htmlText=(html)=>html.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;| /g,' ').replace(/\s+/g,' ');
/** A minta egyszerűsített alakja (a szóközök és a nem törő szóközök egységesen). */
export const needleText=(n)=>n.replace(/ /g,' ').replace(/\s+/g,' ');
