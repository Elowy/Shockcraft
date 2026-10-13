import {validateCatalog,type Catalog,type Product} from './catalog';
import {refLabel} from './product-refs';

// Általános, ár, gyártó és cikkszám nélküli mintatételek („(minta)” végű névvel). Valós gyártói adatot a Villanyrajz nem szállít;
// a mintatermék adata nem kerül az ajánlat PDF-jébe.
export const SAMPLE_PRODUCTS:{ref:string;name:string;unit:'db'|'m';fallback?:string}[]=[
 {ref:'device:socket',name:'Dugalj 2P+F, süllyesztett (minta)',unit:'db'},
 {ref:'device:double',name:'Kettős dugalj 2×(2P+F) (minta)',unit:'db'},
 {ref:'device:switch1',name:'Egypólusú kapcsoló (minta)',unit:'db'},
 {ref:'device:switch2',name:'Kétpólusú kapcsoló (minta)',unit:'db'},
 {ref:'device:switch5',name:'Csillárkapcsoló (minta)',unit:'db'},
 {ref:'device:switch6',name:'Váltókapcsoló (minta)',unit:'db'},
 {ref:'device:switch7',name:'Keresztkapcsoló (minta)',unit:'db'},
 {ref:'device:rj45',name:'RJ45 adataljzat, Cat6 (minta)',unit:'db'},
 {ref:'device:phone',name:'Telefonaljzat (minta)',unit:'db'},
 {ref:'device:light',name:'Lámpakiállás csatlakozóval (minta)',unit:'db'},
 {ref:'device:box',name:'Kötődoboz, süllyesztett (minta)',unit:'db'},
 {ref:'device:panel',name:'Lakáselosztó doboz (minta)',unit:'db'},
 {ref:'module:MAIN:4',name:'Főkapcsoló 4P (minta)',unit:'db'},
 {ref:'module:RCD:4',name:'Áram-védőkapcsoló 4P 40 A / 30 mA (minta)',unit:'db'},
 {ref:'module:RCD:2',name:'Áram-védőkapcsoló 2P 40 A / 30 mA (minta)',unit:'db'},
 {ref:'module:MCB:1:B10',name:'Kismegszakító 1P B10 (minta)',unit:'db'},
 {ref:'module:MCB:1:B16',name:'Kismegszakító 1P B16 (minta)',unit:'db'},
 {ref:'module:MCB:1:B20',name:'Kismegszakító 1P B20 (minta)',unit:'db'},
 {ref:'module:MCB:3:C16',name:'Kismegszakító 3P C16 (minta)',unit:'db'},
 {ref:'module:RCBO:2:B16',name:'Kombinált védelem 1P+N B16 30 mA (minta)',unit:'db'},
 {ref:'module:SPD:4',name:'Túlfeszültség-levezető 4P (minta)',unit:'db'},
 {ref:'cable:3x1.5',name:'Kábel 3×1,5 mm² (minta)',unit:'m',fallback:'3 × 1,5 mm²'},
 {ref:'cable:3x2.5',name:'Kábel 3×2,5 mm² (minta)',unit:'m',fallback:'3 × 2,5 mm²'},
 {ref:'cable:5x1.5',name:'Kábel 5×1,5 mm² (minta)',unit:'m',fallback:'5 × 1,5 mm²'},
 {ref:'cable:5x2.5',name:'Kábel 5×2,5 mm² (minta)',unit:'m',fallback:'5 × 2,5 mm²'},
];

// Idempotens: a már meglévő (azonos nevű) mintatermék nem duplikálódik. Fiók-alapértelmezést csak még üres típushoz állít.
export function addSampleProducts(c:Catalog,now:string,newId:()=>string=()=>crypto.randomUUID()):{catalog:Catalog;added:number}{
 const products=[...c.products],defaults=[...c.defaults];let added=0;
 for(const s of SAMPLE_PRODUCTS){
  let p=products.find(p=>p.sample&&p.name===s.name&&p.unit===s.unit);
  if(!p){p={id:newId(),manufacturer:'',family:'',sku:'',name:s.name,unit:s.unit,price:null,labor:null,archived:false,sample:true,updatedAt:now} satisfies Product;products.push(p);added++}
  if(!p.archived&&!defaults.some(d=>d.ref===s.ref))defaults.push({ref:s.ref,productId:p.id,label:refLabel(s.ref,s.fallback)});
 }
 return {catalog:validateCatalog({...c,products,defaults}),added};
}
