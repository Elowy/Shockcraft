// Megosztható kalkulátorállapot az URL-ben: `<mező>=<nyers>`, egység: `<mező>.e=<egység>`, lista: `R=10;22;47`, sorok: `sorok=2000*0,25*1;60*5*3`.
// Az ismeretlen, rejtett vagy túl hosszú paramétert eldobjuk. A vessző és a pontosvessző olvashatóan (kódolatlanul) marad.
import {chosenUnit,fieldDefault,isVisible,rawValue,selectValue,splitList,splitRows,type CalcDef,type Raw} from './core';
import {unitById} from './units';

export const MAX_VALUE_LENGTH=40;
const enc=(s:string)=>encodeURIComponent(s).replace(/%2C/gi,',').replace(/%3B/gi,';');

/** A látható mezők nyers értékei (az üres, alapérték nélküli mezők nélkül) lekérdezési sztringként („?I=16&L=23,4”); üres állapotnál ''. */
export function encodeState(def:CalcDef,raw:Raw):string{
 const parts:string[]=[];
 for(const f of def.fields){
  if(!isVisible(def,f,raw))continue;
  if(f.kind==='select'){parts.push(f.id+'='+enc(selectValue(f,raw)));continue}
  const v=rawValue(f,raw).trim();
  // Az üres kötelező mezőt is kiírjuk („I=”), hogy a visszaállított állapot ne az alapértéket mutassa (veszteségmentes oda-vissza).
  if(v||fieldDefault(f)!=='')parts.push(f.id+'='+enc(v));
  if((f.kind==='number'||f.kind==='list')&&f.units&&v){const u=chosenUnit(f,raw)!;parts.push(f.id+'.e='+enc(u.id))}
 }
 return parts.length?'?'+parts.join('&'):'';
}

/** A lekérdezési sztring értelmezése a kalkulátor mezőire. Csak ismert mezőt és érvényes választást fogad el. */
export function decodeState(def:CalcDef,search:string):Raw{
 const out:Raw={};let params:URLSearchParams;
 try{params=new URLSearchParams(search.startsWith('?')?search.slice(1):search)}catch{return out}
 for(const f of def.fields){
  const v=params.get(f.id);
  if(v!==null){
   if(f.kind==='select'){if(f.options.some(o=>o.value===v))out[f.id]=v}
   else if(f.kind==='number'){if(v.length<=MAX_VALUE_LENGTH)out[f.id]=v.trim()}
   else if(f.kind==='list'){const items=splitList(v);if(v.length<=MAX_VALUE_LENGTH*f.maxItems&&items.length<=f.maxItems&&items.every(x=>x.length<=MAX_VALUE_LENGTH))out[f.id]=v.trim()}
   else{const rows=splitRows(v);if(v.length<=MAX_VALUE_LENGTH*f.maxRows&&rows.length<=f.maxRows&&rows.every(r=>r.length<=f.columns.length&&r.every(c=>c.length<=MAX_VALUE_LENGTH)))out[f.id]=v.trim()}
  }
  if((f.kind==='number'||f.kind==='list')&&f.units){const e=params.get(f.id+'.e');if(e!==null&&unitById(f.units,e))out[f.id+'.e']=e}
 }
 return out;
}

