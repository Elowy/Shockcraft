import {CATALOG_LIMIT,CSV_ROWS,round2,skuKey,validateCatalog,type Catalog,type Product} from './catalog';
import {csvCell} from './plan-tools';
import {stripInvisible} from './quote-schema';

// Katalógus-CSV: kliensoldali feldolgozás (a szerver csak a validált katalógus-JSON-t kapja).
// Magyar Excel-mentések: „CSV (pontosvesszővel tagolt)” = Windows-1250, „CSV UTF-8” = BOM-os UTF-8, „Unicode szöveg” = UTF-16LE + tabulátor.
export type CsvEncoding='utf-8'|'utf-16le'|'windows-1250';
export type CsvDelimiter=';'|','|'\t';
export type CsvDraft={line:number;id?:string;manufacturer?:string;family?:string;sku?:string;name:string;unit:'db'|'m';price?:number|null;labor?:number|null};
export type CsvError={line:number;message:string};
export type CsvParse={drafts:CsvDraft[];errors:CsvError[];ignored:string[];delimiter:CsvDelimiter;headerLine:number};
export type CsvMerge={catalog:Catalog;added:number;updated:number;unchanged:number};

export function decodeCsv(bytes:Uint8Array):{text:string;encoding:CsvEncoding}{
 if(bytes[0]===0xff&&bytes[1]===0xfe)return {text:new TextDecoder('utf-16le').decode(bytes.subarray(2)),encoding:'utf-16le'};
 if(bytes[0]===0xef&&bytes[1]===0xbb&&bytes[2]===0xbf)return {text:new TextDecoder('utf-8').decode(bytes.subarray(3)),encoding:'utf-8'};
 try{return {text:new TextDecoder('utf-8',{fatal:true}).decode(bytes),encoding:'utf-8'}}catch{return {text:new TextDecoder('windows-1250').decode(bytes),encoding:'windows-1250'}}
}

// Magyar és angol számformátum: „1 234,50 Ft”, „1.234,5”, „1,234.50”, „12.500” (= 12 500); az utolsó elválasztó a tizedesjel.
// Ezres tagolás csak nem 0-val kezdődő első csoporttal: a „0.500” tizedestört (0,5), nem 500.
export function parseHuf(raw:string):number|null{
 let s=raw.replace(/[\s  ]/g,'').replace(/^(huf|ft)|(huf|ft)\.?$/gi,'');
 if(!s)return null;
 if(/^[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/.test(s))s=s.replace(/\./g,'').replace(',','.');
 else if(s.includes(',')&&s.includes('.')){const dec=s.lastIndexOf(',')>s.lastIndexOf('.')?',':'.';s=s.replaceAll(dec===','?'.':',','').replace(',','.')}
 else if(s.includes(','))s=s.replace(',','.');
 const n=/^\d+(\.\d+)?$/.test(s)?round2(Number(s)):NaN;
 if(!Number.isFinite(n)||n<0||n>1_000_000)throw Error('Érvénytelen ár: '+raw.trim()+'.');
 return n;
}
const plain=(s:string)=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLocaleLowerCase('hu');
export function parseUnit(raw:string):'db'|'m'|null{
 const u=plain(raw).trim().replace(/\.$/,'').trim();
 return ['db','darab','pcs','pc'].includes(u)?'db':['m','fm','meter','folyometer','mtr'].includes(u)?'m':null;
}

type Field='id'|'manufacturer'|'family'|'sku'|'name'|'unit'|'price'|'labor';
const HEADERS:Record<Field,string[]>={id:['azonosito','id'],manufacturer:['gyarto','marka','brand','manufacturer'],family:['termekcsalad','csalad','sorozat','series'],sku:['cikkszam','sku','termekkod','gyartoicikkszam','rendelesiszam'],name:['megnevezes','nev','termeknev','termekmegnevezes','termek','name'],unit:['egyseg','me','mennyisegiegyseg','mertekegyseg','unit'],price:['ar','nettoar','egysegar','nettoegysegar','listaar','nettolistaar','anyagar','nettoanyagar','price'],labor:['munkadij','nettomunkadij','labor']};
const headerKey=(s:string)=>plain(s).replace(/[^a-z0-9]/g,'').replace(/(ft|huf)$/,'');
function headerField(s:string):Field|undefined{const k=headerKey(s);return (Object.keys(HEADERS) as Field[]).find(f=>HEADERS[f].includes(k))}
const LIMITS:Partial<Record<Field,number>>={manufacturer:80,family:120,sku:60,name:240};
const MISSING_NAME='A CSV-ből hiányzik a „Megnevezés” oszlop. Az első sorok egyike a fejléc legyen (pl. Gyártó; Cikkszám; Megnevezés; Egység; Nettó anyagár (Ft)).';

// Az első 10 nem üres fizikai sorban, idézőjelen kívül a leggyakoribb elválasztó; döntetlennél a pontosvessző.
function detectDelimiter(text:string):CsvDelimiter{
 const count={';':0,',':0,'\t':0} as Record<CsvDelimiter,number>;let quoted=false,lines=0,content=false;
 for(const ch of text){
  if(ch==='"')quoted=!quoted;
  else if(ch==='\n'){if(content&&++lines>=10)break;content=false}
  else if(!quoted&&(ch===';'||ch===','||ch==='\t'))count[ch]++;
  if(ch.trim())content=true;
 }
 return ([';',',','\t'] as CsvDelimiter[]).reduce((best,d)=>count[d]>count[best]?d:best,';');
}
// RFC 4180-szerű tagolás: idézett mező, "" escape, sortörés idézőjelen belül; minden rekordhoz a kezdősora tartozik.
// A fájl végéig le nem zárt idézőjel (unclosed: a nyitó sor száma) a további sorokat elnyelné, ezért a hívó fájlhibának veszi.
function records(text:string,delimiter:CsvDelimiter):{rows:{line:number;cells:string[]}[];unclosed:number}{
 const out:{line:number;cells:string[]}[]=[];let cells:string[]=[],cell='',quoted=false,atStart=true,line=1,start=1,opened=0;
 const endCell=()=>{cells.push(cell);cell='';atStart=true};
 const endRecord=()=>{endCell();out.push({line:start,cells});cells=[]};
 for(let i=0;i<text.length;i++){
  const ch=text[i];
  if(quoted){
   if(ch==='"'){if(text[i+1]==='"'){cell+='"';i++}else quoted=false}
   else{if(ch==='\n'||ch==='\r'&&text[i+1]!=='\n')line++;cell+=ch}
   continue;
  }
  if(ch==='"'&&atStart){quoted=true;atStart=false;opened=line;continue}
  if(ch===delimiter){endCell();continue}
  if(ch==='\r'||ch==='\n'){if(ch==='\r'&&text[i+1]==='\n')i++;endRecord();line++;start=line;continue}
  cell+=ch;atStart=false;
 }
 if(cell||cells.length)endRecord();
 return {rows:out,unclosed:quoted?opened:0};
}
// A csvCell (és a catalogCsv) képletvédelmének visszafordítása: pontosan egy aposztróf marad le; a cellán belüli sortörés és
// tabulátor szóközzé válik, a láthatatlan és irányváltó karakter kimarad (mint a katalógussémában).
const cleanCell=(s:string)=>stripInvisible(s).replace(/^'(?='*\s*[=+@-])/,'').replace(/[\r\n\t]+/g,' ').trim();
const ctrl=/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/;

export function parseCatalogCsv(input:string,{markupPercent=0,gross=false}:{markupPercent?:number;gross?:boolean}={}):CsvParse{
 const text=input.replace(/^﻿/,''),delimiter=detectDelimiter(text);
 const {rows:parsed,unclosed}=records(text,delimiter),all=parsed.filter(r=>r.cells.some(c=>c.trim()));
 const fail=(message:string):CsvParse=>({drafts:[],errors:[{line:0,message}],ignored:[],delimiter,headerLine:0});
 if(unclosed)return fail(`Lezáratlan idézőjel a(z) ${unclosed}. sorban; az utána következő sorok nem dolgozhatók fel. Javítsd a fájlt (a cellán belüli idézőjelet duplázd: ""), és próbáld újra.`);
 const headerIndex=all.slice(0,10).findIndex(r=>r.cells.some(c=>headerField(c)==='name'));
 if(headerIndex<0)return fail(MISSING_NAME);
 const header=all[headerIndex],columns=new Map<Field,number>(),ignored:string[]=[];
 header.cells.forEach((h,i)=>{const f=headerField(h);if(f&&!columns.has(f))columns.set(f,i);else if(h.trim())ignored.push(h.trim())});
 if(!columns.has('unit'))return {...fail('A CSV-ből hiányzik az „Egység” oszlop (db vagy m).'),headerLine:header.line};
 const rows=all.slice(headerIndex+1);
 if(rows.length>CSV_ROWS)return {...fail('Legfeljebb 5000 sor importálható egyszerre.'),ignored,headerLine:header.line};
 const markup=Math.max(0,Math.min(300,Number.isFinite(markupPercent)?markupPercent:0));
 const drafts:CsvDraft[]=[],errors:CsvError[]=[],seenId=new Map<string,number>(),seenSku=new Map<string,number>();
 for(const r of rows){
  try{
   const get=(f:Field)=>{const i=columns.get(f);if(i===undefined)return undefined;const v=cleanCell(r.cells[i]??''),n=LIMITS[f];if(n&&v.length>n)throw Error(`Legfeljebb ${n} karakter adható meg.`);if(ctrl.test(v))throw Error('Érvénytelen karakter vagy sortörés.');return v};
   const name=get('name')||'';if(!name)throw Error('Add meg a termék megnevezését.');
   const unit=parseUnit(get('unit')||'');if(!unit)throw Error('Az egység csak db vagy m lehet (a dobos vagy csomagos árat számold át egységárra).');
   const id=get('id'),manufacturer=get('manufacturer'),family=get('family'),sku=get('sku'),rawPrice=get('price'),rawLabor=get('labor');
   let price=rawPrice===undefined?undefined:parseHuf(rawPrice);const labor=rawLabor===undefined?undefined:parseHuf(rawLabor);
   if(typeof price==='number'&&(gross||markup)){price=round2(price/(gross?1.27:1)*(1+markup/100));if(price>1_000_000)throw Error('Az átszámított ár meghaladja az 1 000 000 Ft-ot.')}
   const key=sku?skuKey({manufacturer:manufacturer||'',sku}):'',first=(id&&seenId.get(id))||(key&&seenSku.get(key));
   if(first)throw Error(`Ez a termék már szerepelt a(z) ${first}. sorban.`);
   if(id)seenId.set(id,r.line);if(key)seenSku.set(key,r.line);
   drafts.push({line:r.line,...(id!==undefined?{id}:{}),...(manufacturer!==undefined?{manufacturer}:{}),...(family!==undefined?{family}:{}),...(sku!==undefined?{sku}:{}),name,unit,...(price!==undefined?{price}:{}),...(labor!==undefined?{labor}:{})});
  }catch(e){errors.push({line:r.line,message:e instanceof Error?e.message:'Érvénytelen sor.'})}
 }
 return {drafts,errors,ignored,delimiter,headerLine:header.line};
}

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Párosítás: azonosító → gyártó+cikkszám (vagy gyártóoszlop nélkül az egyértelmű cikkszám) → új termék.
// Hiányzó oszlop, üres szövegcella és üres ár nem töröl meglévő értéket; a név és az egység mindig íródik.
export function mergeCatalogCsv(c:Catalog,drafts:CsvDraft[],now:string,newId:()=>string=()=>crypto.randomUUID()):CsvMerge{
 const products=c.products.map(p=>({...p})),byId=new Map(products.map((p,i)=>[p.id,i])),used=new Set(byId.keys());
 let added=0,updated=0,unchanged=0;
 // Cikkszám-indexek (gyártó+cikkszám, illetve csak cikkszám → növekvő indexek): soronként állandó idejű keresés, a lista
 // végigpásztázása 5000 sornál másodpercekre fagyasztaná a lapot. Az első index ugyanaz, amit a findIndex adna.
 const byKey=new Map<string,number[]>(),byPlain=new Map<string,number[]>(),plainSku=(sku:string)=>sku.trim().toLocaleLowerCase('hu');
 const keys=(p:Product)=>p.sku?[[byKey,skuKey(p)],[byPlain,plainSku(p.sku)]] as const:[];
 const link=(p:Product,i:number)=>{for(const [m,k] of keys(p)){const a=m.get(k)||[];a.push(i);a.sort((x,y)=>x-y);m.set(k,a)}};
 const unlink=(p:Product,i:number)=>{for(const [m,k] of keys(p)){const a=(m.get(k)||[]).filter(x=>x!==i);if(a.length)m.set(k,a);else m.delete(k)}};
 products.forEach(link);
 const bySku=(d:CsvDraft)=>{
  const sku=d.sku?.trim();if(!sku)return undefined;
  if(d.manufacturer!==undefined)return byKey.get(skuKey({manufacturer:d.manufacturer,sku}))?.[0];
  const hits=byPlain.get(plainSku(sku));
  return hits?.length===1?hits[0]:undefined;
 };
 for(const d of drafts){
  const index=(d.id!==undefined?byId.get(d.id):undefined)??bySku(d);
  if(index===undefined){
   const id=d.id&&UUID.test(d.id)&&!used.has(d.id.toLowerCase())?d.id.toLowerCase():newId();used.add(id);
   const p:Product={id,manufacturer:d.manufacturer||'',family:d.family||'',sku:d.sku||'',name:d.name,unit:d.unit,price:d.price??null,labor:d.labor??null,archived:false,sample:false,updatedAt:now};
   const i=products.push(p)-1;byId.set(id,i);link(p,i);added++;continue;
  }
  const old=products[index],next:Product={...old,name:d.name,unit:d.unit};
  for(const f of ['manufacturer','family','sku'] as const){const v=d[f];if(v)next[f]=v}
  if(typeof d.price==='number')next.price=d.price;
  if(typeof d.labor==='number')next.labor=d.labor;
  if((['manufacturer','family','sku','name','unit','price','labor'] as const).some(f=>next[f]!==old[f])){unlink(old,index);products[index]={...next,sample:false,updatedAt:now};link(products[index],index);updated++}else unchanged++;
 }
 if(products.length>CATALOG_LIMIT)throw Error(`A CSV ${drafts.length} érvényes sorából ${added} új termék lenne, így a katalógusban ${products.length} termék lenne. Legfeljebb 2000 termék tárolható (az archiváltak is beleszámítanak): töröld a nem használt termékeket, vagy importálj kevesebb sort.`);
 return {catalog:validateCatalog({...c,products}),added,updated,unchanged};
}

// Két tizedes, kitevő nélkül (a String(1e-7) „1e-7” lenne, amit az import elutasít).
const csvPrice=(n:number|null)=>n===null?'':String(round2(n)).replace('.',',');
// A már aposztróffal védett képletszerű szöveg („'=X”) még egy aposztrófot kap, mert az import pontosan egyet vesz le róla.
const cell=(s:string)=>csvCell(/^'+\s*[=+@-]/.test(s)?"'"+s:s);
// Excel-barát export: BOM, pontosvessző, CRLF; csak a nem archivált termékek. Oda-vissza importálva nem változtat.
export function catalogCsv(c:Catalog):string{
 const data=[['Azonosító','Gyártó','Termékcsalád','Cikkszám','Megnevezés','Egység','Nettó anyagár (Ft)','Munkadíj (Ft)'],...c.products.filter(p=>!p.archived).map(p=>[p.id,p.manufacturer,p.family,p.sku,p.name,p.unit,csvPrice(p.price),csvPrice(p.labor)])];
 return '﻿'+data.map(row=>row.map(cell).join(';')).join('\r\n');
}
