import {materialList,type MaterialRow} from './plan-tools';
import {materialKey,syncQuote} from './quote';
import {quoteSchema,type ProductSnapshot,type Quote,type QuoteLine} from './quote-schema';
import {REF_CATEGORY_ORDER,refCategory,refLabel,refUnit,type RefCategory} from './product-refs';
import {accountDefault,skuKey,toSnapshot,type Catalog,type Product} from './catalog';
import type {Plan} from './plan';

// Ajánlat ↔ termék. A projekt termékválasztása a plan.quote-ban él (productDefaults + soronkénti pillanatkép),
// így visszavonható, a tervvel mentődik, és a megosztott nézetbe az ajánlattal együtt nem kerül át.
// Írási szabály: a sor anyagára/munkadíja csak explicit műveletnél változik; a null termékár soha nem töröl árat.
// Minden művelet új objektumot ad (a bemenetet nem módosítja), és a végén quoteSchema.parse-t hív.

// Opcionális kulcs törlése (nem undefined értékadás: a Zod megtartaná az {x:undefined} kulcsot).
function without<T extends object,K extends keyof T>(o:T,...keys:K[]):Omit<T,K>{const copy={...o};for(const k of keys)delete copy[k];return copy}
const priced=(l:QuoteLine,p:ProductSnapshot):QuoteLine=>({...l,product:p,material:p.price??l.material,labor:p.labor??l.labor});
// Árfrissítésnél a munkadíj csak üres helyre kerül: a kézzel megadott munkadíj marad.
const refreshed=(l:QuoteLine,p:ProductSnapshot):QuoteLine=>({...l,product:p,material:p.price??l.material,labor:l.labor??p.labor});
// materialKey → ref a terv aktuális anyagkimutatásából (a tervből átvett ajánlati sorok sourceKey-jéhez).
export const refIndex=(plan:Plan)=>new Map(materialList(plan).flatMap(r=>r.ref?[[materialKey(r),r.ref] as const]:[]));
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const UNIT_MISMATCH='A termék egysége eltér a tétel egységétől.';

export type ProductSlot={ref:string;label:string;category:RefCategory;unit:'db'|'m';quantity:number;lines:number};
// Típusonkénti csoportok a terv anyagkimutatásából (ráhagyás nélküli mennyiséggel).
export function productSlots(plan:Plan):ProductSlot[]{
 const slots=new Map<string,ProductSlot>();
 for(const r of materialList(plan)){
  if(!r.ref)continue;const category=refCategory(r.ref);if(!category)continue;
  const old=slots.get(r.ref);
  if(old){old.quantity+=r.quantity;old.lines++}else slots.set(r.ref,{ref:r.ref,label:refLabel(r.ref,r.item),category,unit:refUnit(r.ref),quantity:r.quantity,lines:1});
 }
 return [...slots.values()].sort((a,b)=>REF_CATEGORY_ORDER.indexOf(a.category)-REF_CATEGORY_ORDER.indexOf(b.category)||a.label.localeCompare(b.label,'hu'));
}
// A kábeljelölés nélküli nyomvonalak hossza: ezekhez típusonként nem választható termék.
export function untypedCableMeters(plan:Plan){return materialList(plan).filter(r=>r.category==='Kábel'&&!r.ref).reduce((s,r)=>s+r.quantity,0)}
export function projectProduct(q:Quote,ref:string):ProductSnapshot|undefined{return q.productDefaults?.find(d=>d.ref===ref)?.product}

export function setProjectProduct(plan:Plan,q:Quote,ref:string,product:ProductSnapshot|null):{quote:Quote;changed:number}{
 if(product&&product.unit!==refUnit(ref))throw Error(UNIT_MISMATCH);
 const refs=refIndex(plan),rest=(q.productDefaults||[]).filter(d=>d.ref!==ref),found=rest.length!==(q.productDefaults||[]).length;
 const defaults=product?(found?(q.productDefaults||[]).map(d=>d.ref===ref?{ref,product}:d):[...rest,{ref,product}]):rest;
 let changed=0;
 const lines=q.lines.map(l=>{
  if(!l.sourceKey||l.productPinned||refs.get(l.sourceKey)!==ref)return l;
  const next=product?(l.unit===product.unit?priced(l,product):l):l.product?without(l,'product'):l;
  if(!same(next,l))changed++;return next;
 });
 const base=without(q,'productDefaults');
 return {quote:quoteSchema.parse(defaults.length?{...base,productDefaults:defaults,lines}:{...base,lines}),changed};
}

// Soronkénti, egyedi választás: a projekt-alapértelmezés nem írja felül. null = kifejezetten „Nincs termék”.
export function pinLineProduct(q:Quote,lineId:string,product:ProductSnapshot|null):Quote{
 const l=q.lines.find(l=>l.id===lineId);if(!l)throw Error('A tétel nem található.');
 let next:QuoteLine;
 if(product){
  if(product.unit!==l.unit)throw Error(UNIT_MISMATCH);
  next={...priced(l,product),productPinned:true};
  if(!l.sourceKey&&(l.name.trim()===''||l.name==='Egyéb munka'))next.name=product.name;
 }else next={...without(l,'product'),productPinned:true};
 return quoteSchema.parse({...q,lines:q.lines.map(x=>x.id===lineId?next:x)});
}
export function followProjectProduct(plan:Plan,q:Quote,lineId:string):Quote{
 const l=q.lines.find(l=>l.id===lineId);if(!l)throw Error('A tétel nem található.');
 const ref=l.sourceKey?refIndex(plan).get(l.sourceKey):undefined,p=ref?projectProduct(q,ref):undefined,free=without(l,'productPinned');
 const next=p&&p.unit===l.unit?priced(free,p):without(free,'product');
 return quoteSchema.parse({...q,lines:q.lines.map(x=>x.id===lineId?next:x)});
}

// A syncQuote burka: csak az újonnan létrejött tervsorok kapják meg a projekt termékválasztását és árát.
export function syncQuoteWithProducts(plan:Plan,q:Quote):{quote:Quote;priced:number}{
 const known=new Set(q.lines.map(l=>l.id)),next=syncQuote(plan,q);
 if(!q.productDefaults?.length)return {quote:next,priced:0};
 const refs=refIndex(plan);let count=0;
 const lines=next.lines.map(l=>{
  if(known.has(l.id)||!l.sourceKey)return l;
  const ref=refs.get(l.sourceKey),p=ref?projectProduct(q,ref):undefined;
  if(!p||p.unit!==l.unit)return l;count++;return priced(l,p);
 });
 return {quote:quoteSchema.parse({...next,lines}),priced:count};
}

function accountSlots(plan:Plan,q:Quote,c:Catalog){return productSlots(plan).flatMap(s=>{if(projectProduct(q,s.ref))return [];const p=accountDefault(c,s.ref);return p&&p.unit===s.unit?[{slot:s,product:p}]:[]})}
export function availableAccountDefaults(plan:Plan,q:Quote,c:Catalog){return accountSlots(plan,q,c).length}
// A fiók-alapértelmezések csak a még választás nélküli típusokra kerülnek; meglévő projektválasztást nem írnak felül.
export function applyAccountDefaults(plan:Plan,q:Quote,c:Catalog):{quote:Quote;applied:number;lines:number}{
 let quote=quoteSchema.parse(q),applied=0,lines=0;
 for(const {slot,product} of accountSlots(plan,q,c)){const r=setProjectProduct(plan,quote,slot.ref,toSnapshot(product));quote=r.quote;applied++;lines+=r.changed}
 return {quote,applied,lines};
}

// Árak frissítése a katalógusból: azonosító, ennek hiányában gyártó+cikkszám alapján (archivált termék is).
// Az anyagár a friss árra változik (null ár nem töröl), a munkadíj csak ott töltődik, ahol üres.
export function refreshProductPrices(q:Quote,c:Catalog):{quote:Quote;updated:number;missing:number}{
 const byId=new Map(c.products.map(p=>[p.id,p])),bySku=new Map<string,Product>();
 for(const p of c.products)if(p.sku&&!bySku.has(skuKey(p)))bySku.set(skuKey(p),p);
 const missing=new Set<string>();
 const fresh=(s:ProductSnapshot)=>{const p=byId.get(s.id)??(s.sku?bySku.get(skuKey(s)):undefined);if(!p){missing.add(s.id);return undefined}return p.unit===s.unit?toSnapshot(p):undefined};
 const productDefaults=q.productDefaults?.map(d=>{const p=fresh(d.product);return p?{...d,product:p}:d});
 let updated=0;
 const lines=q.lines.map(l=>{
  if(!l.product)return l;const p=fresh(l.product);if(!p)return l;
  const next=refreshed(l,p);if(next.material!==l.material||next.labor!==l.labor)updated++;return next;
 });
 return {quote:quoteSchema.parse({...q,...(productDefaults?{productDefaults}:{}),lines}),updated,missing:missing.size};
}

// Az anyagkimutatás sorának terméke: a rögzített soré, különben a sor pillanatképe vagy a projekt típusválasztása.
export function productResolver(plan:Plan):(row:MaterialRow)=>ProductSnapshot|undefined{
 const q=plan.quote;if(!q)return ()=>undefined;
 const lines=new Map(q.lines.flatMap(l=>l.sourceKey?[[l.sourceKey,l] as const]:[])),defaults=new Map((q.productDefaults||[]).map(d=>[d.ref,d.product]));
 return row=>{const l=lines.get(materialKey(row));if(l?.productPinned)return l.product;return l?.product??(row.ref?defaults.get(row.ref):undefined)};
}
export function sampleInUse(q:Quote){return (q.productDefaults||[]).filter(d=>d.product.sample).length+q.lines.filter(l=>l.product?.sample).length}
