// Kalkulátorok forrás-ujjlenyomata (CI-ellenőrzéshez; futásidőben nem használjuk, mert a lefordított kód buildenként eltér).
// A definíció ujjlenyomata (calcFingerprint, lib/calc/registry.ts) a tartalmat (mezők, képletek, példák, szövegek) rögzíti, a compute
// függvényt nem. Ez a modul a compute-ot is lefedi: a lib/calc/defs/<slug>.ts és a futásidőben importált helyi moduljai
// (core, number, units, constants, fields, formulas, sizing-fields, lib/sizing-formulas.ts, lib/sizing-tables.ts, lib/phase-load.ts …)
// szövegének FNV-1a lenyomata – a lib/sizing-tables.ts SIZING_REVIEW-objektuma (a táblázatjóváhagyás adatai) nélkül (sourceText). A kiadási rekord `source` mezője ezt rögzíti (scripts/calc-release.ts record), a tests/calc.ts
// fájlból újraszámolva összeveti: ha a számítás, a levezetés vagy a kiírás kódja változik, a rekordot újra kell ellenőrizni.
import {existsSync,readFileSync,statSync} from 'node:fs';
import {dirname,join,relative,resolve} from 'node:path';
import {fingerprint} from '../lib/sizing-tables';

const ROOT=resolve(dirname(new URL(import.meta.url).pathname),'..');
const rel=(p:string)=>relative(ROOT,p).split('\\').join('/');

/** Futásidejű helyi importok (az `import type` kimarad: a viselkedést nem befolyásolja). */
function runtimeImports(file:string):string[]{
 const src=readFileSync(file,'utf8'),out:string[]=[];
 for(const m of src.matchAll(/(?:^|[;\n])\s*(?:import|export)\s+(type\s+)?([^;'"]*?)\s*from\s*['"]([^'"]+)['"]/g)){
  const clause=(m[2]??'').trim(),typeOnly=!!m[1]||/^\{\s*(?:type\s+\w+\s*(?:as\s+\w+\s*)?,?\s*)+\}$/.test(clause);
  if(!typeOnly)out.push(m[3]);
 }
 for(const m of src.matchAll(/(?:^|[;\n])\s*import\s*['"]([^'"]+)['"]/g))out.push(m[1]);
 return out;
}
function resolveLocal(from:string,spec:string):string|null{
 const base=spec.startsWith('@/')?join(ROOT,spec.slice(2)):spec.startsWith('.')?resolve(dirname(from),spec):null;
 if(!base)return null;
 for(const c of [base+'.ts',base+'.tsx',base,join(base,'index.ts')])if(existsSync(c)&&statSync(c).isFile()&&/\.tsx?$/.test(c))return c;
 return null;
}
/** A definíció és a futásidejű helyi függőségei (repóbeli útvonalak, rendezve). */
export function calcSourceFiles(slug:string):string[]{
 const start=join(ROOT,'lib/calc/defs',slug+'.ts');
 if(!existsSync(start))throw new Error('Ismeretlen kalkulátor: '+slug);
 // A core.ts (bemenet-értelmezés, runCalc) mindig része: a definíció gyakran csak típust importál belőle, a viselkedést mégis meghatározza.
 const seen=new Set<string>(),stack=[start,join(ROOT,'lib/calc/core.ts')];
 while(stack.length){
  const f=stack.pop()!;if(seen.has(f))continue;seen.add(f);
  for(const spec of runtimeImports(f)){const r=resolveLocal(f,spec);if(r&&!seen.has(r))stack.push(r)}
 }
 return [...seen].map(rel).sort();
}
/** A lenyomatból kihagyott blokk: a lib/sizing-tables.ts SIZING_REVIEW-ja (a táblázatok jóváhagyásának adatai). */
export const REVIEW_FILE='lib/sizing-tables.ts',REVIEW_DECL='export const SIZING_REVIEW:SizingReview=';
/** A `start` indexen álló `{` párja (karakterlánc-literálokon és megjegyzéseken átlépve); -1, ha nincs. */
function closingBrace(s:string,start:number):number{
 let depth=0;
 for(let i=start;i<s.length;i++){
  const c=s[i];
  if(c==='"'||c==="'"||c==='`'){for(i++;i<s.length&&s[i]!==c;i++)if(s[i]==='\\')i++;continue}
  if(c==='/'&&s[i+1]==='/'){const e=s.indexOf('\n',i);if(e<0)return -1;i=e;continue}
  if(c==='/'&&s[i+1]==='*'){const e=s.indexOf('*/',i+2);if(e<0)return -1;i=e+1;continue}
  if(c==='{')depth++;else if(c==='}'&&--depth===0)return i;
 }
 return -1;
}
/**
 * A lenyomatba kerülő szöveg. A lib/sizing-tables.ts SIZING_REVIEW-objektumát (állapot, jóváhagyó, dátum, ujjlenyomat, showName,
 * megjegyzés) kihagyjuk: ez a táblázatok jóváhagyásának adata, nem a számítás kódja, és a táblázat-kaput a tablesApproved() külön
 * kezeli. Enélkül a táblázatok jóváhagyásának rögzítése megváltoztatná a táblázatokat használó kalkulátorok forrás-ujjlenyomatát,
 * és a lektori csomagban jóváhagyott ujjlenyomat-pár soha nem egyezhetne a kiadási rekorddal (docs/lektoralas.md). Ha a deklaráció
 * nem található vagy nem zárul, a fájl teljes szövege marad (a változás így nem marad észrevétlen).
 */
export function sourceText(path:string,text:string):string{
 const t=text.replace(/\r\n/g,'\n');
 if(path!==REVIEW_FILE)return t;
 const at=t.indexOf(REVIEW_DECL);if(at<0||t.indexOf(REVIEW_DECL,at+1)>=0)return t;
 const open=at+REVIEW_DECL.length;if(t[open]!=='{')return t;
 const close=closingBrace(t,open);if(close<0||t[close+1]!==';')return t;
 return t.slice(0,open)+'{/* jóváhagyási adatok – a lenyomatból kihagyva */}'+t.slice(close+1);
}
/** A forrásfájlok szövegének lenyomata (sorvégek egységesítve; a SIZING_REVIEW-blokk nélkül, lásd sourceText). */
export function sourceFingerprint(slug:string):string{
 return fingerprint(calcSourceFiles(slug).map(f=>[f,sourceText(f,readFileSync(join(ROOT,f),'utf8'))]));
}
