import {materialList,type MaterialRow} from './plan-tools';
import {quoteSchema,type Quote,type QuoteLine} from './quote-schema';
import type {Plan} from './plan';
export const money=(n:number)=>n.toLocaleString('hu-HU',{minimumFractionDigits:0,maximumFractionDigits:2})+' Ft';
export const amount=(n:number)=>n.toLocaleString('hu-HU',{maximumFractionDigits:3});
export const materialKey=(r:MaterialRow)=>JSON.stringify([r.category,r.location,r.item,r.detail,r.unit]);
export const quoteSource=(p:Plan)=>JSON.stringify(materialList(p).map(r=>[materialKey(r),Math.round(r.quantity*1000)/1000]));
export function newQuote():Quote{const date=new Date(),day=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');return {version:1,number:'',date:day,validUntil:'',supplier:'',customer:'',site:'',notes:'',vat:'AAM',discount:0,allowance:10,sourceSignature:'',lines:[]}}
export function addQuoteLine():QuoteLine{return {id:crypto.randomUUID(),name:'Egyéb munka',detail:'',unit:'tétel',quantity:1,material:null,labor:null,included:true,allowance:false}}
// Explicit refresh keeps unit prices; dropped source rows become excluded, retaining their entered prices.
export function syncQuote(plan:Plan,input:Quote):Quote{
 const q=structuredClone(input),rows=materialList(plan),keys=new Set(rows.map(materialKey));
 const old=new Map(q.lines.filter(l=>l.sourceKey).map(l=>[l.sourceKey,l]));
 q.lines=[...rows.map(r=>{const key=materialKey(r),previous=old.get(key);return {...(previous||addQuoteLine()),sourceKey:key,name:r.item,detail:r.location+(r.detail?' · '+r.detail:''),unit:r.unit,quantity:Math.round(r.quantity*1000)/1000,allowance:r.unit==='m',included:previous?.included??true}}),...q.lines.filter(l=>!l.sourceKey||!keys.has(l.sourceKey)).map(l=>l.sourceKey?{...l,included:false}:l)];
 q.sourceSignature=quoteSource(plan);return quoteSchema.parse(q);
}
const rounded=(numerator:bigint,denominator:bigint)=>Number((numerator+denominator/BigInt(2))/denominator);
const cents=(n:number)=>Math.round((n+Number.EPSILON)*100);
export function lineTotal(line:QuoteLine,q:Pick<Quote,'allowance'>){
 const base=Math.round(line.quantity*1000),milli=line.allowance&&line.unit==='m'?rounded(BigInt(base)*BigInt(10000+Math.round(q.allowance*100)),BigInt(10000)):base;
 const material=line.material===null?0:rounded(BigInt(milli)*BigInt(cents(line.material)),BigInt(1000)),labor=line.labor===null?0:rounded(BigInt(milli)*BigInt(cents(line.labor)),BigInt(1000));
 return {quantity:milli/1000,material:material/100,labor:labor/100,total:(material+labor)/100,materialCents:material,laborCents:labor};
}
export function travelCost(q:Pick<Quote,'travel'>):number{const t=q.travel;if(!t)return 0;return t.mode==='per_km'?Math.round(t.km*t.ratePerKm):t.fixed}
export function quoteTotals(input:Quote){const q=quoteSchema.parse(input),rows=q.lines.filter(l=>l.included),parts=rows.map(l=>lineTotal(l,q)),material=parts.reduce((s,v)=>s+v.materialCents,0),labor=parts.reduce((s,v)=>s+v.laborCents,0),subtotal=material+labor,discount=rounded(BigInt(subtotal)*BigInt(Math.round(q.discount*100)),BigInt(10000)),net=subtotal-discount,travel=Math.round(travelCost(q)*100),vatBase=net+travel,vat=rounded(BigInt(vatBase)*BigInt(q.vat==='AAM'?0:+q.vat),BigInt(100));return {material:material/100,labor:labor/100,subtotal:subtotal/100,discount:discount/100,net:net/100,travel:travel/100,vat:vat/100,total:(vatBase+vat)/100,unpriced:rows.filter(l=>l.quantity>0&&(l.material===null||l.labor===null)).length,count:rows.length}}
export function quoteIssues(q:Quote){const totals=quoteTotals(q);return [!q.number.trim()?'Add meg az ajánlat azonosítóját.':'',!q.date?'Add meg a kiállítás dátumát.':'',!q.supplier.trim()?'Add meg az ajánlatadó adatait.':'',!q.customer.trim()?'Add meg az ügyfél adatait.':'',!totals.count?'Az ajánlatnak nincs bevont tétele.':'',totals.unpriced?`${totals.unpriced} tételnél hiányzik az anyagár vagy a munkadíj. Ingyenes tételnél adj meg 0-t.`:'',q.lines.some(l=>l.included&&!l.name.trim())?'Minden bevont tételnek adj nevet.':''].filter(Boolean)}
