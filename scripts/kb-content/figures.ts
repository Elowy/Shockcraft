// Az ábrák forrás-ujjlenyomata (docs/tudastar.md „Állapotgép, ujjlenyomat, közzétételi kapu”). A tartalmi ujjlenyomat a vázlat
// [ÁBRA: …] helyőrzőjét fedi; a ténylegesen kirajzolt SVG-t és a szöveges megfelelőt nem. Ez a modul cikkenként azt rögzíti, amit az
// olvasó lát:
//  - a FIGURES-jegyzék (components/kezikonyv/figures/index.tsx) cikkhez tartozó bejegyzéseinek forrássora (komponens, `desc` – a
//    szöveges megfelelő, ha a helyőrző nem ad –, `wide`),
//  - a bejegyzés komponensét exportáló modul és annak futásidejű helyi importjai (pl. kit.tsx) teljes szövege,
//  - az ábrák színszerződése a stíluslapból: a vezeték- és rézszín-tokenek minden előfordulása (világos, sötét, nyomtatás) és az
//    ábraosztályok (.kk-fig-svg .f-*, .s-*, .t-*).
// A lenyomat a cikk metaadatába (`figures`) és a kiadási rekordba kerül (lib/kb/release.ts); a kapu csak egyezés esetén enged
// (lib/kb/content/gate.ts). A modulszintű lenyomat szándékosan szigorú: egy közös modul változása minden ábráját használó cikket
// újraellenőrzésre küld. Csak a generátor és a tesztek használják (node:fs).
import {existsSync,readFileSync,statSync} from 'node:fs';
import {dirname,join,relative,resolve} from 'node:path';
import {fingerprint} from '../../lib/sizing-tables';

export const FIG_DIR='components/kezikonyv/figures';
export const FIG_INDEX=FIG_DIR+'/index.tsx';
export const FIG_CSS='app/(kezikonyv)/kezikonyv.css';

const read=(root:string,f:string)=>readFileSync(join(root,f),'utf8').replace(/\r\n/g,'\n');

/** A FIGURES egy bejegyzése: pontosan egy sor `'<slug>/<abra-N>':{C:<Komponens>…},` alakban (különben hiba – a lenyomat ne találgasson). */
export function figureEntry(index:string,key:string):{line:string;component:string}{
 const lines=index.split('\n').filter(l=>l.trimStart().startsWith("'"+key+"':{"));
 if(lines.length!==1)throw new Error(FIG_INDEX+': a(z) '+key+' ábra bejegyzése nem található pontosan egy sorban ('+lines.length+')');
 const c=/:\{C:([A-Za-z_]\w*)/.exec(lines[0]);
 if(!c)throw new Error(FIG_INDEX+': a(z) '+key+' bejegyzésében nincs C:<Komponens>');
 return {line:lines[0].trim(),component:c[1]};
}
/** A komponenst exportáló modul (az index.tsx `import {…} from './modul'` sorából). */
function componentModule(root:string,index:string,component:string):string{
 for(const m of index.matchAll(/import\s*\{([^}]*)\}\s*from\s*'(\.\/[^']+)'/g)){
  const names=m[1].split(',').map(x=>x.trim().replace(/^type\s+/,'').split(/\s+as\s+/).pop()!.trim());
  if(names.includes(component)){const f=join(FIG_DIR,m[2].slice(2)+'.tsx');if(!existsSync(join(root,f)))throw new Error('Hiányzó ábramodul: '+f);return f}
 }
 throw new Error(FIG_INDEX+': a(z) '+component+' komponens importja nem található');
}
/** A modul és futásidejű helyi (./, ../, @/) importjainak zárása, repó-relatív útvonalakkal, rendezve (`import type` kimarad). */
export function localClosure(root:string,file:string):string[]{
 const seen=new Set<string>(),stack=[file];
 while(stack.length){
  const f=stack.pop()!;if(seen.has(f))continue;seen.add(f);
  const src=read(root,f);
  for(const m of src.matchAll(/(?:^|[;\n])\s*(?:import|export)\s+(type\s+)?([^;'"]*?)\s*from\s*['"]([^'"]+)['"]/g)){
   const clause=(m[2]??'').trim(),typeOnly=!!m[1]||/^\{\s*(?:type\s+\w+\s*(?:as\s+\w+\s*)?,?\s*)+\}$/.test(clause);
   const spec=m[3];if(typeOnly)continue;
   const base=spec.startsWith('@/')?join(root,spec.slice(2)):spec.startsWith('.')?resolve(join(root,dirname(f)),spec):null;
   if(!base)continue;
   const hit=[base+'.tsx',base+'.ts',base].find(c=>existsSync(c)&&statSync(c).isFile()&&/\.tsx?$/.test(c));
   if(hit)stack.push(relative(root,hit).split('\\').join('/'));
  }
 }
 return [...seen].sort();
}
/** Az ábrák színszerződése a stíluslapból (a tokenértékek és az ábraosztályok, sorrendben). */
export function figureCss(css:string):string[]{
 return [...[...css.matchAll(/--kk-(?:wire|copper)[a-z0-9-]*\s*:[^;}]+/g)].map(m=>m[0].replace(/\s+/g,'')),
  ...[...css.matchAll(/\.kk-fig-svg \.[fst]-[a-z0-9-]+\{[^}]*\}/g)].map(m=>m[0])];
}
/** Egy cikk ábráinak forrás-ujjlenyomata ('' ha nincs ábrája). `ids`: a cikk ábra-helyőrzőinek azonosítói (abra-1, abra-2 …) sorrendben. */
export function figureSource(root:string,slug:string,ids:readonly string[]):string{
 if(!ids.length)return '';
 const index=read(root,FIG_INDEX),entries:string[]=[],files=new Set<string>();
 for(const id of ids){const e=figureEntry(index,slug+'/'+id);entries.push(e.line);for(const f of localClosure(root,componentModule(root,index,e.component)))files.add(f)}
 return fingerprint({entries,files:[...files].sort().map(f=>({file:f,src:read(root,f)})),css:figureCss(read(root,FIG_CSS))});
}
