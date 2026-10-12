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
/** A rajz színszerződése a stíluslapból: az ér-tokenek (figureCss) és a .kk-dg* szabályok. */
export function diagramCss(css:string):string[]{
 return [...figureCss(css).filter(x=>x.startsWith('--')),...[...css.matchAll(/[^{}]*\.kk-dg[^{}]*\{[^}]*\}/g)].map(m=>m[0].trim())];
}
/** Netlistás ábrák forrás-ujjlenyomata (a cikkhez tartozó ábrák netlistafájljai, sorrendben). `read`: a fájlolvasó (a tesztek
 * mutációs próbájához cserélhető). */
export function diagramSource(root:string,files:readonly string[],read:Reader=disk):string{
 if(!files.length)return '';
 const diagrams=files.map(f=>{const d=diagramFiles(root,f,read);return {netlist:read(root,d.netlistPath),layout:read(root,d.layoutPath)}});
 return fingerprint({diagrams,files:rendererFiles(root).map(f=>({file:f,src:read(root,f)})),css:diagramCss(read(root,FIG_CSS))});
}
