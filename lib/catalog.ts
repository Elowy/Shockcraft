import {z} from 'zod';
import type {ProductDisplay,ProductSnapshot} from './quote-schema';
import {validRef} from './product-refs';

// Fiókszintű termékkatalógus: egy JSON-blob felhasználónként, egyetlen revisionnel (product_catalogs tábla).
// Tiszta modul: a kliens (katalóguskezelő, ajánlat) és a szerver (/api/catalog) is ezt validálja.
export const CATALOG_LIMIT=2000,CATALOG_DEFAULT_LIMIT=300,CATALOG_BYTES=1_500_000,CSV_BYTES=2_000_000,CSV_ROWS=5000;
const FALLBACK='Érvénytelen termékadatok.',UNIT='Az egység db vagy m lehet.',PRICE_TYPE='Az ár szám legyen.';
// A parse-hoz adott hibatérkép felülírja a sémaszintűt (Zod 3), ezért a típus- és egységhiba szövege itt dől el;
// a nem testreszabott Zod-hibák is magyarul jelennek meg.
export const catalogErrorMap:z.ZodErrorMap=iss=>({message:iss.code==='invalid_type'&&iss.expected==='number'?PRICE_TYPE:iss.code==='invalid_enum_value'&&iss.options.includes('db')?UNIT:FALLBACK});
const ctrl=/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/;
const max=(n:number)=>`Legfeljebb ${n} karakter adható meg.`;
const line=(n:number,required?:string)=>(required?z.string().trim().min(1,required):z.string().trim()).max(n,max(n)).refine(v=>!ctrl.test(v)&&!/[\r\n]/.test(v),'Érvénytelen karakter vagy sortörés.');
// Határai azonosak az ajánlati egységárral (quote-schema price).
const money=z.number({invalid_type_error:PRICE_TYPE}).finite('Érvénytelen ár.').min(0,'Az ár nem lehet negatív.').max(1_000_000,'Az egységár legfeljebb 1 000 000 Ft lehet.').nullable();
const uuid=z.string().uuid('Érvénytelen azonosító.');

export const productSchema=z.object({id:uuid,manufacturer:line(80).default(''),family:line(120).default(''),sku:line(60).default(''),name:line(240,'Add meg a termék megnevezését.'),unit:z.enum(['db','m'],{errorMap:()=>({message:UNIT})}),price:money.default(null),labor:money.default(null),archived:z.boolean().default(false),sample:z.boolean().default(false),updatedAt:z.string().max(40)});
export const defaultSchema=z.object({ref:z.string().refine(validRef,'Érvénytelen hozzárendelés.'),productId:uuid,label:line(160).default('')});
export const catalogSchema=z.object({version:z.literal(1),products:z.array(productSchema).max(CATALOG_LIMIT,'Legfeljebb 2000 termék tárolható. Archiváld vagy töröld a nem használt termékeket.'),defaults:z.array(defaultSchema).max(CATALOG_DEFAULT_LIMIT,'Túl sok fiók-alapértelmezés.').default([])}).superRefine((c,ctx)=>{
 const fail=(message:string)=>ctx.addIssue({code:'custom',message});
 const ids=new Set(c.products.map(p=>p.id));
 if(ids.size!==c.products.length)fail('Ismétlődő termékazonosító.');
 const skus=new Set<string>();
 for(const p of c.products){if(!p.sku)continue;const k=skuKey(p);if(skus.has(k)){fail('Ismétlődő cikkszám: '+(p.manufacturer||'(gyártó nélkül)')+' '+p.sku+'.');break}skus.add(k)}
 if(new Set(c.defaults.map(d=>d.ref)).size!==c.defaults.length)fail('Egy típushoz csak egy fiók-alapértelmezés tartozhat.');
 if(c.defaults.some(d=>!ids.has(d.productId)))fail('Az alapértelmezett termék nem található.');
});

export type Product=z.infer<typeof productSchema>;
export type Catalog=z.infer<typeof catalogSchema>;
export type CatalogDefault=z.infer<typeof defaultSchema>;

export const emptyCatalog=():Catalog=>({version:1,products:[],defaults:[]});
export const validateCatalog=(v:unknown):Catalog=>catalogSchema.parse(v,{errorMap:catalogErrorMap});
// Csak a saját (sima Error) üzeneteink juthatnak ki; a JSON- és programhibák általános szöveget kapnak.
export function catalogError(e:unknown):string{return e instanceof z.ZodError?e.issues[0]?.message||FALLBACK:e instanceof Error&&e.name==='Error'&&e.message?e.message:FALLBACK}

export function skuKey(p:{manufacturer:string;sku:string}){return (p.manufacturer.trim()+'\u0000'+p.sku.trim()).toLocaleLowerCase('hu')}
export function toSnapshot(p:Product):ProductSnapshot{return {id:p.id,manufacturer:p.manufacturer,family:p.family,sku:p.sku,name:p.name,unit:p.unit,price:p.price,labor:p.labor,...(p.sample?{sample:true as const}:{})}}

type Labelled={manufacturer:string;family:string;sku:string;name:string};
export function productLabel(p:Labelled){return [[p.manufacturer,p.family].filter(Boolean).join(' '),p.sku,p.name].filter(Boolean).join(' · ')}
// Az ajánlat-PDF tételsora alá kerülő szöveg. A mintatermék nem kerül a PDF-be.
export function productLine(p:ProductSnapshot|undefined,lineName:string,mode:ProductDisplay='brand'):string{
 if(!p||p.sample||mode==='none')return '';
 const parts=[[p.manufacturer,p.family].filter(Boolean).join(' '),p.name.trim()!==lineName.trim()?p.name:'',mode==='sku'&&p.sku?'Cikkszám: '+p.sku:''].filter(Boolean);
 return parts.length?'Termék: '+parts.join(' · '):'';
}

export const normalizeSearch=(s:string)=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLocaleLowerCase('hu').replace(/×/g,'x');
export function searchProducts(products:Product[],query:string,{unit,archived=false}:{unit?:'db'|'m';archived?:boolean}={}):Product[]{
 const terms=normalizeSearch(query.trim()).split(/\s+/).filter(Boolean);
 return products.filter(p=>(archived||!p.archived)&&(!unit||p.unit===unit)&&terms.every(t=>normalizeSearch([p.manufacturer,p.family,p.sku,p.name].join(' ')).includes(t))).sort((a,b)=>productLabel(a).localeCompare(productLabel(b),'hu'));
}

export function upsertProduct(c:Catalog,p:Product,now:string):Catalog{
 const next={...p,updatedAt:now},found=c.products.some(x=>x.id===p.id);
 return validateCatalog({...c,products:found?c.products.map(x=>x.id===p.id?next:x):[...c.products,next]});
}
export function setProductArchived(c:Catalog,id:string,archived:boolean,now:string):Catalog{
 return validateCatalog({...c,products:c.products.map(p=>p.id===id?{...p,archived,updatedAt:now}:p)});
}
// A rá mutató fiók-alapértelmezés is törlődik; a tervekbe már átvett pillanatkép megmarad.
export function removeProduct(c:Catalog,id:string):Catalog{
 return validateCatalog({...c,products:c.products.filter(p=>p.id!==id),defaults:c.defaults.filter(d=>d.productId!==id)});
}
export function setAccountDefault(c:Catalog,ref:string,productId:string|null,label:string):Catalog{
 const rest=c.defaults.filter(d=>d.ref!==ref);
 if(productId===null)return validateCatalog({...c,defaults:rest});
 const entry={ref,productId,label},found=c.defaults.some(d=>d.ref===ref);
 return validateCatalog({...c,defaults:found?c.defaults.map(d=>d.ref===ref?entry:d):[...rest,entry]});
}
export function accountDefault(c:Catalog,ref:string):Product|undefined{
 const d=c.defaults.find(d=>d.ref===ref),p=d&&c.products.find(p=>p.id===d.productId);
 return p&&!p.archived?p:undefined;
}
