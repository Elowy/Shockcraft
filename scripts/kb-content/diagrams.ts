// A netlistás bekötési ábrák forrásai és ujjlenyomata (docs/tudastar.md „Sémák és ábramotor”). Csak a generátor
// (scripts/kb-content.ts), a lektori csomag (scripts/lektori-csomag.ts) és a tesztek használják (node:fs) – a futó alkalmazás a
// netlistát és az elrendezést csak a közzétett cikkekhez generált lib/kb/content/generated/diagrams.ts-ből látja.
//
// Egy ábra = netlista (content/tudastar/r3/<fájl>.netlist.json) + elrendezés (content/tudastar/diagramok/<netlista-id>.json). Az ábra
// ujjlenyomata (`diagramSource`) lefedi:
//  - a netlista és az elrendezés teljes szövegét,
//  - a rajzoló modulokat: components/kezikonyv/diagram/diagram-figure.tsx és futásidejű helyi importjainak zárása (scene.ts,
//    symbols.tsx, bekotes.tsx, diagram-run.tsx, lib/kb/circuit.ts) – a lib/sizing-tables.ts kivételével, amelyből a circuit.ts csak az
//    FNV-1a függvényt importálja (a méretezési táblázatok jóváhagyása így nem küldi újraellenőrzésre a bekötési ábrákat),
//  - a rajz színszerződését a stíluslapból: az ér-tokenek minden előfordulása és az ábra (.kk-dg*) szabályai.
// A cikk `figures` ujjlenyomatába (scripts/kb-content/figures.ts) ez kerül a netlistás ábrák helyére; így a netlista, az elrendezés,
// egy szimbólum vagy a rajzoló kód bármely módosítása a cikket „újraellenőrzendő” állapotba teszi (lektori újraellenőrzés).
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import type {DgLayout} from '../../components/kezikonyv/diagram/scene';
import {netlistFingerprint,type Netlist} from '../../lib/kb/circuit';
import {fingerprint} from '../../lib/sizing-tables';
import {FIG_CSS,figureCss,localClosure} from './figures';

export const NETLIST_DIR='content/tudastar/r3';
export const LAYOUT_DIR='content/tudastar/diagramok';
export const DIAGRAM_RENDERER='components/kezikonyv/diagram/diagram-figure.tsx';
const EXCLUDED=new Set(['lib/sizing-tables.ts']);

export type Reader=(root:string,f:string)=>string;
const disk:Reader=(root,f)=>readFileSync(join(root,f),'utf8').replace(/\r\n/g,'\n');

export type DiagramFiles={file:string;netlistPath:string;layoutPath:string;netlist:Netlist;layout:DgLayout};
/** Egy netlistafájl ábrája: a netlista és a hozzá tartozó elrendezés (a netlista id-je szerint). Hiány vagy elavult elrendezés: hiba. */
export function diagramFiles(root:string,file:string,read:Reader=disk):DiagramFiles{
 const netlistPath=NETLIST_DIR+'/'+file;
 if(!existsSync(join(root,netlistPath)))throw new Error('Ismeretlen netlista: '+netlistPath);
 const netlist=JSON.parse(read(root,netlistPath)) as Netlist,layoutPath=LAYOUT_DIR+'/'+netlist.id+'.json';
 if(!existsSync(join(root,layoutPath)))throw new Error(netlistPath+': nincs elrendezése ('+layoutPath+')');
 const layout=JSON.parse(read(root,layoutPath)) as DgLayout;
 if(layout.format!=='kb-diagram/1'||layout.id!==netlist.id||layout.netlist!==file)throw new Error(layoutPath+': az elrendezés fejléce nem ehhez a netlistához tartozik');
 // Ha a netlista az elrendezés elkészülte óta változott, a rajzot újra kell nézni (és az elrendezés ujjlenyomatát frissíteni).
 if(layout.fingerprint!==netlistFingerprint(netlist))throw new Error(layoutPath+': elavult elrendezés – a netlista ujjlenyomata '+netlistFingerprint(netlist)+', az elrendezésé '+layout.fingerprint+'; nézd át a rajzot, és frissítsd');
 return {file,netlistPath,layoutPath,netlist,layout};
}
/** Az összes netlista (fájlnév szerint rendezve). */
export const netlistFiles=(root:string)=>readdirSync(join(root,NETLIST_DIR)).filter(f=>f.endsWith('.netlist.json')).sort();
/** A rajzoló modulok (a renderelő és helyi importjainak zárása, a kivételekkel). */
export const rendererFiles=(root:string)=>localClosure(root,DIAGRAM_RENDERER).filter(f=>!EXCLUDED.has(f));
/** A stíluslap szabályai környezettel (a @media/@supports/@layer fejlécek láncával) – az at-rule fejléc a szabály része (a
 * `@media (min-width:48rem)` módosítása más rajzot ad). Megjegyzések nélkül. */
export type CssRule={ctx:readonly string[];sel:string;body:string};
export function cssRules(css:string):CssRule[]{
 const out:CssRule[]=[];
 const walk=(src:string,ctx:readonly string[])=>{
  let i=0;
  while(i<src.length){
   const open=src.indexOf('{',i);if(open<0)break;
   const head=src.slice(i,open).trim();
   let depth=1,j=open+1;
   while(j<src.length&&depth>0){const c=src[j];if(c==='{')depth++;else if(c==='}')depth--;j++}
   const inner=src.slice(open+1,j-1);
   if(/^@(media|supports|layer)\b/.test(head))walk(inner,[...ctx,head.replace(/\s+/g,' ')]);
   else out.push({ctx,sel:head.replace(/\s+/g,' '),body:inner.trim()});
   i=j;
  }
 };
 walk(css.replace(/\/\*[\s\S]*?\*\//g,''),[]);
 return out;
}
const ruleText=(r:CssRule)=>(r.ctx.length?r.ctx.join(' ')+' ':'')+r.sel+'{'+r.body+'}';
/** A szabályok által hivatkozott minden --kk-* token minden deklarációja (világos, sötét, nyomtatás – a környezetével), a tokenértékekben
 * hivatkozott további tokenekkel együtt (zárás). */
export function tokenDeclarations(rules:readonly CssRule[],used:readonly CssRule[]):string[]{
 const decls=rules.flatMap(r=>[...r.body.matchAll(/(--kk-[a-z0-9-]+)\s*:\s*([^;}]+)/g)].map(m=>({name:m[1],value:m[2].trim(),at:(r.ctx.length?r.ctx.join(' ')+' ':'')+r.sel})));
 const need=new Set<string>(),stack:string[]=[];
 const refs=(text:string)=>{for(const m of text.matchAll(/var\((--kk-[a-z0-9-]+)/g))if(!need.has(m[1])){need.add(m[1]);stack.push(m[1])}};
 for(const r of used)refs(r.body);
 while(stack.length){const n=stack.pop()!;for(const d of decls)if(d.name===n)refs(d.value)}
 return decls.filter(d=>need.has(d.name)).map(d=>d.at+'|'+d.name+':'+d.value);
}
/** A rajz színszerződése a stíluslapból: az ér-tokenek (figureCss), az ábra .kk-dg* szabályai a @media/@supports fejlécükkel, és az
 * általuk használt minden --kk-* token értéke (világos, sötét, nyomtatás). */
export function diagramCss(css:string):string[]{
 const rules=cssRules(css),mine=rules.filter(r=>r.sel.split(',').some(x=>x.includes('.kk-dg')));
 return [...figureCss(css).filter(x=>x.startsWith('--')),...mine.map(ruleText),...tokenDeclarations(rules,mine)];
}
/** A veszély-doboz és a cikk megjelenítése (R3): a doboz és a cikktörzs renderelő moduljai és a doboz (.kk-callout*) szabályai a használt
 * tokenekkel – az R3 cikk `figures` ujjlenyomatának része (a lektor azt a megjelenítést hagyja jóvá, amelyben a veszély-doboz látszik). */
export const RISK_VIEW_FILES=['components/kezikonyv/article/blocks.tsx','components/kezikonyv/article/article-view.tsx','components/kezikonyv/article/inline.tsx'] as const;
export function riskViewSource(root:string,read:Reader=disk):string{
 const rules=cssRules(read(root,FIG_CSS)),mine=rules.filter(r=>r.sel.split(',').some(x=>x.includes('.kk-callout')));
 return fingerprint({files:RISK_VIEW_FILES.map(f=>({file:f,src:read(root,f)})),css:mine.map(ruleText),tokens:tokenDeclarations(rules,mine)});
}
/** Netlistás ábrák forrás-ujjlenyomata (a cikkhez tartozó ábrák netlistafájljai, sorrendben). `read`: a fájlolvasó (a tesztek
 * mutációs próbájához cserélhető). */
export function diagramSource(root:string,files:readonly string[],read:Reader=disk):string{
 if(!files.length)return '';
 const diagrams=files.map(f=>{const d=diagramFiles(root,f,read);return {netlist:read(root,d.netlistPath),layout:read(root,d.layoutPath)}});
 return fingerprint({diagrams,files:rendererFiles(root).map(f=>({file:f,src:read(root,f)})),css:diagramCss(read(root,FIG_CSS))});
}
