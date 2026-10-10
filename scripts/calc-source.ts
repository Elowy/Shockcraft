// Kalkulátorok forrás-ujjlenyomata (CI-ellenőrzéshez; futásidőben nem használjuk, mert a lefordított kód buildenként eltér).
// A definíció ujjlenyomata (calcFingerprint, lib/calc/registry.ts) a tartalmat (mezők, képletek, példák, szövegek) rögzíti, a compute
// függvényt nem. Ez a modul a compute-ot is lefedi: a lib/calc/defs/<slug>.ts és a futásidőben importált helyi moduljai
// (core, number, units, constants, fields, formulas, sizing-fields, lib/sizing-formulas.ts, lib/sizing-tables.ts, lib/phase-load.ts …)
// szövegének FNV-1a lenyomata. A kiadási rekord `source` mezője ezt rögzíti (scripts/calc-release.ts record), a tests/calc.ts
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
/** A forrásfájlok szövegének lenyomata (sorvégek egységesítve). */
export function sourceFingerprint(slug:string):string{
 return fingerprint(calcSourceFiles(slug).map(f=>[f,readFileSync(join(ROOT,f),'utf8').replace(/\r\n/g,'\n')]));
}
