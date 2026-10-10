// A kalkulátormotor magja: mezőleírók, bemenet-értelmezés, futtatás. Tiszta modul (zod, lib/plan és hálózat nélkül);
// a /kalkulatorok oldalai, a későbbi cikkbe ágyazott kalkulátor, a tesztek és a tervező mélylinkjei is ezt használják.
import {checkRange,formatNum,parseNum,type NumOptions} from './number';
import {UNITS,unitById,type Unit,type UnitKind} from './units';

export type Tier='T0'|'T1'|'T2';
export type CategoryId='alapok'|'teljesitmeny'|'vezetekek'|'vedelem'|'vilagitas'|'gepek'|'elektronika'|'atvaltok';
export type SafetyId='alap'|'kalkulator'|'meretezes'|'beavatkozas';

type ShowIf={field:string;is:readonly string[]};
type FieldBase={id:string;label:string;help?:string;showIf?:ShowIf};
export type NumberField=FieldBase&NumOptions&{kind:'number';symbol?:string;unit?:string;units?:UnitKind;defaultUnit?:string;default?:string;optional?:boolean;placeholder?:string};
export type SelectOption={value:string;label:string;/** Rövid alak az összefoglalóban (pl. „3f”); ha nincs, a választás nem kerül bele. */short?:string};
export type SelectField=FieldBase&{kind:'select';options:readonly SelectOption[];default:string;style?:'segmented'|'select'};
export type ListField=FieldBase&NumOptions&{kind:'list';symbol?:string;unit?:string;units?:UnitKind;defaultUnit?:string;default?:string;minItems:number;maxItems:number};
export type RowColumn=NumOptions&{id:string;label:string;unit?:string;default?:string};
export type RowsField=FieldBase&{kind:'rows';columns:readonly RowColumn[];default?:string;minRows:number;maxRows:number};
export type FieldDef=NumberField|SelectField|ListField|RowsField;

/** Nyers bemenet: mezőazonosító → szöveg; egységválasztás: `<mező>.e` → egységazonosító. */
export type Raw=Record<string,string>;

export type ResultItem={id:string;label:string;value:number;unit?:string;text?:string;primary?:boolean;note?:string};
export type Step={label:string;formula:string;substituted:string;result:string;ref?:string};
export type Issue={level:'error'|'warn'|'info';field?:string;text:string};
export type Figure=
 |{kind:'power-triangle';P:number;Q:number;S:number;phi:number;units:[string,string,string]}
 |{kind:'drop-bar';value:number;limit:number;label:string}
 |{kind:'phase-bars';unit:string;phases:{label:string;value:number}[];neutral?:number}
 |{kind:'resistor';bands:string[];label:string};
export type ResultTable={caption:string;head:string[];rows:string[][]};
export type CalcOutput={results:ResultItem[];steps:Step[];issues?:Issue[];assumptions?:string[];figure?:Figure;table?:ResultTable;verdict?:{ok:boolean;text:string}};
export type CalcRun={ok:true;out:CalcOutput;issues:Issue[];summary:string}|{ok:false;issues:Issue[]};

export type CalcExample={title:string;input:Raw;expect:Record<string,number>;tol?:number};
export type CalcDef={
 slug:string;title:string;
 /** Egymondatos leírás; egyben a meta description (80–160 karakter). */
 short:string;
 category:CategoryId;keywords:readonly string[];synonyms?:readonly string[];tier:Tier;
 fields:readonly FieldDef[];compute:(v:Inputs)=>CalcOutput;
 /** A képletek szöveges alakja (levezetés feletti összefoglaló). */
 formulas:readonly string[];
 notes:{good:readonly string[];bad:readonly string[]};
 safety:readonly SafetyId[];
 /** Az első példa a kidolgozott példa (SSR); mind golden teszt. */
 examples:readonly CalcExample[];
 related:readonly string[];articles:readonly string[];sources:readonly string[];
 /** A számítás a lib/sizing-tables.ts értékeit használja: a táblázat állapota (reviewText) kiírandó. */
 tables?:boolean;
 /** T1: a „nem vizsgált” lista. */
 notCovered?:readonly string[];
 version:number;updated:string;
};

/** Szakmai (tartományon kívüli) hiba a compute-ból: magyar üzenet, opcionálisan mezőhöz kötve. */
export class CalcError extends Error{constructor(message:string,readonly field?:string){super(message);this.name='CalcError'}}
export const GENERIC_ERROR='Ezekkel az adatokkal az eredmény nem számítható. Ellenőrizd a bemeneteket.';

/** A compute bemenete: már ellenőrzött, alapegységre (SI) váltott értékek. */
export type Inputs={
 n(id:string):number;opt(id:string):number|undefined;s(id:string):string;list(id:string):number[];rows(id:string):number[][];
 /** A választott egység jele (pl. „kW”); a megadott (nem átváltott) érték: entered(id). */
 unit(id:string):string;entered(id:string):number|undefined;
};

const baseUnit=(kind:UnitKind)=>(UNITS[kind] as readonly Unit[]).find(x=>x.factor===1);
export const fieldUnits=(f:NumberField|ListField):readonly Unit[]=>f.units?UNITS[f.units]:[];
export function chosenUnit(f:NumberField|ListField,raw:Raw):Unit|undefined{
 if(!f.units)return undefined;
 return unitById(f.units,raw[f.id+'.e'])??unitById(f.units,f.defaultUnit)??UNITS[f.units][0];
}
export const fieldDefault=(f:FieldDef)=>f.default??'';
/** A mező nyers értéke: a megadott, vagy (ha nincs megadva) az alapértelmezett. */
export const rawValue=(f:FieldDef,raw:Raw)=>raw[f.id]??fieldDefault(f);
export function isVisible(def:CalcDef,f:FieldDef,raw:Raw){
 if(!f.showIf)return true;
 const ctl=def.fields.find(x=>x.id===f.showIf!.field);
 return !!ctl&&f.showIf.is.includes(rawValue(ctl,raw));
}
export const visibleFields=(def:CalcDef,raw:Raw)=>def.fields.filter(f=>isVisible(def,f,raw));
/** Az alapértelmezett nyers állapot (minden mező az alapértékével). */
export function defaultRaw(def:CalcDef):Raw{
 const r:Raw={};
 for(const f of def.fields){r[f.id]=fieldDefault(f);if((f.kind==='number'||f.kind==='list')&&f.units)r[f.id+'.e']=chosenUnit(f,{})!.id}
 return r;
}
export function selectValue(f:SelectField,raw:Raw){const v=rawValue(f,raw);return f.options.some(o=>o.value===v)?v:f.default}

function rangeWithUnit(value:number,opt:NumOptions,unit:string){
 const r=checkRange(value,opt);
 return r.ok||!unit||!/^Leg/.test(r.message)?r:{...r,message:r.message.replace(/ (legyen|lehet)\.$/,'\u00a0'+unit+' $1.')};
}
function parseCell(text:string,opt:NumOptions,factor=1,unit=''){
 const p=parseNum(text,{integer:opt.integer,allowNegative:opt.allowNegative||(opt.min!==undefined&&opt.min<0),positive:opt.positive});
 if(!p.ok)return p;
 return rangeWithUnit(p.value*factor,{min:opt.min,max:opt.max,allowNegative:true},unit);
}
export const splitList=(s:string)=>s.split(';').map(x=>x.trim()).filter(x=>x!=='');
export const splitRows=(s:string)=>s.split(';').map(x=>x.trim()).filter(Boolean).map(r=>r.split('*').map(c=>c.trim()));

type Parsed={values:Map<string,number|string|number[]|number[][]|undefined>;entered:Map<string,number>;units:Map<string,Unit>;issues:Issue[]};
export function parseInputs(def:CalcDef,raw:Raw):Parsed{
 const values:Parsed['values']=new Map(),entered=new Map<string,number>(),units=new Map<string,Unit>(),issues:Issue[]=[];
 const err=(field:string,text:string)=>issues.push({level:'error',field,text});
 for(const f of visibleFields(def,raw)){
  const text=rawValue(f,raw);
  if(f.kind==='select'){values.set(f.id,selectValue(f,raw));continue}
  if(f.kind==='number'){
   const unit=chosenUnit(f,raw),factor=unit?.factor??1,base=f.units?baseUnit(f.units)?.label??'':f.unit??'';
   if(unit)units.set(f.id,unit);
   if(!text.trim()){if(f.optional)values.set(f.id,undefined);else err(f.id,'Add meg az értéket.');continue}
   const p=parseCell(text,f,factor,base);
   if(!p.ok){err(f.id,p.message);continue}
   values.set(f.id,p.value);entered.set(f.id,p.value/factor);continue;
  }
  if(f.kind==='list'){
   const unit=chosenUnit(f,raw),factor=unit?.factor??1,base=f.units?baseUnit(f.units)?.label??'':f.unit??'';
   if(unit)units.set(f.id,unit);
   const items=splitList(text);
   if(items.length<f.minItems){err(f.id,f.minItems===1?'Adj meg legalább egy értéket.':'Adj meg legalább '+f.minItems+' értéket, pontosvesszővel elválasztva (pl. 10; 22; 47).');continue}
   if(items.length>f.maxItems){err(f.id,'Legfeljebb '+f.maxItems+' érték adható meg.');continue}
   const out:number[]=[];let bad=false;
   items.forEach((s,i)=>{const p=parseCell(s,f,factor,base);if(!p.ok){if(!bad)err(f.id,(i+1)+'. érték: '+p.message);bad=true}else out.push(p.value)});
   if(!bad)values.set(f.id,out);continue;
  }
  // rows
  const rows=splitRows(text);
  if(rows.length<f.minRows){err(f.id,'Adj meg legalább '+f.minRows+' sort.');continue}
  if(rows.length>f.maxRows){err(f.id,'Legfeljebb '+f.maxRows+' sor adható meg.');continue}
  const out:number[][]=[];let bad=false;
  rows.forEach((cells,i)=>{
   const row:number[]=[];
   f.columns.forEach((c,j)=>{
    if(bad)return;
    const cell=cells[j]!==undefined&&cells[j]!==''?cells[j]:c.default??'';
    if(!cell){err(f.id,(i+1)+'. sor, '+c.label+': '+'Add meg az értéket.');bad=true;return}
    const p=parseCell(cell,c,1,c.unit??'');
    if(!p.ok){err(f.id,(i+1)+'. sor, '+c.label+': '+p.message);bad=true}else row.push(p.value);
   });
   if(cells.length>f.columns.length&&!bad){err(f.id,(i+1)+'. sor: túl sok oszlop.');bad=true}
   out.push(row);
  });
  if(!bad)values.set(f.id,out);
 }
 return {values,entered,units,issues};
}

function inputsOf(p:Parsed,def:CalcDef):Inputs{
 const get=(id:string)=>{if(!p.values.has(id))throw new Error('Ismeretlen vagy rejtett mező: '+def.slug+'.'+id);return p.values.get(id)};
 return {
  n:id=>{const v=get(id);if(typeof v!=='number')throw new Error('Hiányzó szám: '+id);return v},
  opt:id=>{const v=p.values.get(id);return typeof v==='number'?v:undefined},
  s:id=>String(get(id)),
  list:id=>get(id) as number[],
  rows:id=>get(id) as number[][],
  unit:id=>p.units.get(id)?.label??(def.fields.find(f=>f.id===id) as NumberField|undefined)?.unit??'',
  entered:id=>p.entered.get(id),
 };
}

/** Rövid összefoglaló a bemenetekről (előzményekhez, másoláshoz): „16 A, 23,4 m, 2,5 mm²”. */
export function summarize(def:CalcDef,raw:Raw,max=4):string{
 const parts:string[]=[];
 for(const f of visibleFields(def,raw)){
  if(parts.length>=max)break;
  if(f.kind==='select'){const o=f.options.find(o=>o.value===selectValue(f,raw));if(o?.short)parts.push(o.short);continue}
  const text=rawValue(f,raw).trim();if(!text)continue;
  if(f.kind==='number'){const p=parseNum(text,{allowNegative:true}),unit=chosenUnit(f,raw)?.label??f.unit??'';if(p.ok)parts.push(formatNum(p.value)+(unit?'\u00a0'+unit:''))}
  else if(f.kind==='list')parts.push(splitList(text).length+' érték');
  else parts.push(splitRows(text).length+' sor');
 }
 return parts.join(', ');
}

/** A fő eredmény(ek): a primary jelölésűek; ha egy sincs (pl. nincs választható érték), az első eredmény – a fő doboz sosem üres. */
export const mainResults=(out:CalcOutput)=>{const p=out.results.filter(r=>r.primary);return p.length?p:out.results.slice(0,1)};
/** Futtatás: soha nem dob, és NaN/Infinity nem juthat ki az eredményben. */
export function runCalc(def:CalcDef,raw:Raw):CalcRun{
 try{
  const parsed=parseInputs(def,raw);
  if(parsed.issues.length)return {ok:false,issues:parsed.issues};
  const out=def.compute(inputsOf(parsed,def));
  if(!out||!Array.isArray(out.results)||!out.results.length||out.results.some(r=>typeof r.value!=='number'||!Number.isFinite(r.value)))return {ok:false,issues:[{level:'error',text:GENERIC_ERROR}]};
  return {ok:true,out,issues:out.issues??[],summary:summarize(def,raw)};
 }catch(e){
  if(e instanceof CalcError)return {ok:false,issues:[{level:'error',field:e.field,text:e.message}]};
  return {ok:false,issues:[{level:'error',text:GENERIC_ERROR}]};
 }
}

/** Relatív egyezés golden-ellenőrzéshez: |kapott − elvárt| ≤ tol · |elvárt|; elvárt = 0 esetén abszolút 1e-12.
 * (Szándékosan nem tol · max(1, |elvárt|): 1 alatti értéknél – pl. 3,2e-7 F – az abszolút tűrés semmit nem ellenőrizne.) */
export const closeTo=(got:number,want:number,tol=1e-4)=>want===0?Math.abs(got)<=1e-12:Math.abs(got-want)<=tol*Math.abs(want);
/** Golden-példa ellenőrzése: minden elvárt eredmény relatív tűrésen belül (closeTo). */
export function checkExample(def:CalcDef,ex:CalcExample):string[]{
 const run=runCalc(def,ex.input);
 if(!run.ok)return [def.slug+' / '+ex.title+': '+run.issues.map(i=>i.text).join('; ')];
 const errors:string[]=[];const tol=ex.tol??1e-4;
 for(const [id,want] of Object.entries(ex.expect)){
  const got=run.out.results.find(r=>r.id===id)?.value;
  if(got===undefined){errors.push(def.slug+' / '+ex.title+': nincs „'+id+'” eredmény');continue}
  if(!closeTo(got,want,tol))errors.push(def.slug+' / '+ex.title+': '+id+' = '+got+', elvárt '+want);
 }
 return errors;
}
