import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {seed,validatePlan,type Plan} from '../lib/plan';
import {materialList,materialsCsv} from '../lib/plan-tools';
import {addQuoteLine,materialKey,newQuote,quoteSource,quoteTotals,syncQuote} from '../lib/quote';
import {quoteSchema,type ProductSnapshot,type Quote} from '../lib/quote-schema';
import {createQuotePdf} from '../lib/quote-pdf';
import {productLine,validateCatalog,type Product} from '../lib/catalog';
import {applyAccountDefaults,availableAccountDefaults,followProjectProduct,pinLineProduct,productResolver,productSlots,projectProduct,refreshProductPrices,sampleInUse,setLineUnit,setProjectProduct,syncQuoteWithProducts,untypedCableMeters} from '../lib/quote-products';
import {addSampleProducts} from '../lib/catalog-sample';
import {sharedPlan} from '../lib/share';

// Fixture: az Emeleten két dugalj (30 és 110 cm), egy „3x2,5” jelölésű falon kívüli és egy jelölés nélküli nyomvonal, a telken villanyóra.
const plan:Plan=validatePlan(structuredClone(seed));
const upper=plan.buildings[0].floors.find(f=>f.id==='upper')!;
upper.devices.push({id:'cat-u1',name:'D-11',kind:'socket',x:100,y:100,angle:0,height:30,circuit:''},{id:'cat-u2',name:'D-12',kind:'socket',x:200,y:100,angle:0,height:110,circuit:''});
upper.routes.push({id:'cat-ur1',name:'N-11',points:[{x:0,y:0},{x:384,y:0}],mode:'outside',circuit:'',cable:'3x2,5'},{id:'cat-ur2',name:'N-12',points:[{x:0,y:40},{x:100,y:40}],mode:'outside',circuit:'',cable:''});
plan.plot.nodes.push({id:'cat-m1',name:'Mérő',kind:'meter',x:2,y:2,height:1});
const fixture=validatePlan(plan),planJson=JSON.stringify(fixture);
const T='2026-10-09T08:00:00.000Z';
const snap=(id:string,name:string,price:number|null,labor:number|null,extra:Partial<ProductSnapshot>={}):ProductSnapshot=>({id,manufacturer:'Legrand',family:'Valena Life',sku:'SKU-'+id.slice(0,4),name,unit:'db',price,labor,...extra});
const P1=snap('11111111-1111-4111-8111-111111111111','Valena dugalj',1500,3000),P2=snap('22222222-2222-4222-8222-222222222222','Fürdőszobai IP44 dugalj',2500,3500),P3=snap('33333333-3333-4333-8333-333333333333','Valena Life dugalj',1600,null),P4=snap('44444444-4444-4444-8444-444444444444','Ár nélküli dugalj',null,null);
const asProduct=(s:ProductSnapshot,extra:Partial<Product>={}):Product=>({id:s.id,manufacturer:s.manufacturer,family:s.family,sku:s.sku,name:s.name,unit:s.unit,price:s.price,labor:s.labor,archived:false,sample:!!s.sample,updatedAt:T,...extra});
const rows=materialList(fixture);
const sockets=(q:Quote)=>q.lines.filter(l=>l.name==='Dugalj');

// 1. Típuskulcsok; a materialKey és a quoteSource független a reftől
assert.ok(rows.filter(r=>r.item==='Dugalj').length===3&&rows.filter(r=>r.item==='Dugalj').every(r=>r.ref==='device:socket'));
assert.equal(rows.find(r=>r.item==='Kismegszakító'&&r.detail.includes('B16'))?.ref,'module:MCB:1:B16');
assert.equal(rows.find(r=>r.item==='Áram-védőkapcsoló')?.ref,'module:RCD:4');assert.equal(rows.find(r=>r.item==='Főkapcsoló')?.ref,'module:MAIN:4');
assert.equal(rows.find(r=>r.item==='3 × 2,5 mm²')?.ref,'cable:3x2.5');assert.equal(rows.find(r=>r.item==='3x2,5')?.ref,'cable:3x2.5');
const untypedRow=rows.find(r=>r.item==='Nincs kábeltípus')!;assert.equal('ref' in untypedRow,false);
assert.equal(rows.find(r=>r.category==='Telki pont')?.ref,'site:meter');
for(const r of rows)assert.equal(materialKey({...r,ref:'x'}),materialKey(r));
assert.equal(quoteSource(fixture),JSON.stringify(rows.map(r=>[JSON.stringify([r.category,r.location,r.item,r.detail,r.unit]),Math.round(r.quantity*1000)/1000])));

// 2. Típusonkénti csoportok
const slots=productSlots(fixture),slot=(ref:string)=>slots.find(s=>s.ref===ref)!;
assert.deepEqual([slot('device:socket').quantity,slot('device:socket').lines,slot('device:socket').label,slot('device:socket').unit],[3,3,'Dugalj','db']);
assert.ok(Math.abs(slot('cable:3x2.5').quantity-33)<1e-9);assert.equal(slot('cable:3x2.5').unit,'m');assert.equal(slot('cable:3x2.5').label,'Kábel: 3x2,5','az első (rendezett) sor jelölése');
assert.equal(slot('module:MCB:1:B16').quantity,2);assert.equal(slot('module:MCB:1:B16').label,'Kismegszakító · 1 modul · B16 A');
assert.equal(slots[0].label,'Dugalj');
const order=slots.map(s=>s.category);assert.deepEqual([...new Set(order)],['Szerelvény','Elosztókészülék','Kábel','Telki pont']);
assert.ok(Math.abs(untypedCableMeters(fixture)-2.5)<1e-9);

// 3. Projekt-alapértelmezés: a nem rögzített, egyező egységű sorok árazása
const q0=syncQuote(fixture,newQuote());
const manual=sockets(q0)[0].id,q=quoteSchema.parse({...q0,lines:q0.lines.map(l=>l.id===manual?{...l,material:2000}:l)}),qJson=JSON.stringify(q);
let r=setProjectProduct(fixture,q,'device:socket',P1);
assert.equal(r.changed,3);assert.ok(sockets(r.quote).every(l=>l.material===1500&&l.labor===3000&&l.product?.id===P1.id&&!('productPinned' in l)));
assert.deepEqual(r.quote.lines.filter(l=>l.name!=='Dugalj'),q.lines.filter(l=>l.name!=='Dugalj'));
assert.deepEqual(r.quote.productDefaults,[{ref:'device:socket',product:P1}]);assert.deepEqual(projectProduct(r.quote,'device:socket'),P1);
assert.equal(JSON.stringify(fixture),planJson);assert.equal(JSON.stringify(q),qJson);
assert.throws(()=>setProjectProduct(fixture,q,'cable:3x2.5',P1),/egysége eltér/);

// 4. Felülírási szabályok: a rögzített sort a típusválasztás nem írja felül; a null ár nem töröl
const pinnedId=sockets(r.quote).find(l=>l.detail.includes('Emelet')&&l.detail.includes('110 cm'))!.id;
let qp=pinLineProduct(r.quote,pinnedId,P2);const pinned=qp.lines.find(l=>l.id===pinnedId)!;assert.deepEqual([pinned.material,pinned.labor,pinned.productPinned,pinned.product?.id],[2500,3500,true,P2.id]);
r=setProjectProduct(fixture,qp,'device:socket',P3);assert.equal(r.changed,2);
assert.deepEqual(r.quote.lines.find(l=>l.id===pinnedId),pinned);
assert.ok(sockets(r.quote).filter(l=>l.id!==pinnedId).every(l=>l.material===1600&&l.labor===3000&&l.product?.id===P3.id),'null munkadíj nem töröl');
const q4=setProjectProduct(fixture,r.quote,'device:socket',P4).quote;
assert.ok(sockets(q4).filter(l=>l.id!==pinnedId).every(l=>l.material===1600&&l.labor===3000&&l.product?.id===P4.id));
qp=r.quote;

// 5. Eltávolítás, követés, „Nincs termék”, egységellenőrzés, saját tétel neve
const removed=setProjectProduct(fixture,qp,'device:socket',null);
assert.equal(removed.changed,2);assert.ok(sockets(removed.quote).filter(l=>l.id!==pinnedId).every(l=>!('product' in l)&&l.material===1600));
assert.equal('productDefaults' in removed.quote,false);assert.equal(removed.quote.lines.find(l=>l.id===pinnedId)?.product?.id,P2.id);
const followed=followProjectProduct(fixture,qp,pinnedId).lines.find(l=>l.id===pinnedId)!;
assert.equal('productPinned' in followed,false);assert.equal(followed.product?.id,P3.id);assert.equal(followed.material,1600);assert.equal(followed.labor,3500);
const unfollowed=followProjectProduct(fixture,removed.quote,pinnedId).lines.find(l=>l.id===pinnedId)!;assert.equal('productPinned' in unfollowed,false);assert.equal('product' in unfollowed,false);assert.equal(unfollowed.material,2500);
const none=pinLineProduct(qp,pinnedId,null).lines.find(l=>l.id===pinnedId)!;assert.equal(none.productPinned,true);assert.equal('product' in none,false);assert.equal(none.material,2500);
const kept=setProjectProduct(fixture,pinLineProduct(qp,pinnedId,null),'device:socket',P1).quote.lines.find(l=>l.id===pinnedId)!;assert.equal('product' in kept,false,'a „Nincs termék” rögzítés megmarad');
const cableLine=qp.lines.find(l=>l.unit==='m')!;assert.throws(()=>pinLineProduct(qp,cableLine.id,P1),/egysége eltér/);
assert.throws(()=>pinLineProduct(qp,'nincs-ilyen',P1),/nem található/);
const custom={...addQuoteLine(),unit:'db' as const};const qc=pinLineProduct({...qp,lines:[...qp.lines,custom]},custom.id,P2);
assert.equal(qc.lines.at(-1)?.name,P2.name);assert.equal(qc.lines.at(-1)?.material,2500);
const named={...addQuoteLine(),name:'Kiszállás',unit:'db' as const};assert.equal(pinLineProduct({...qp,lines:[...qp.lines,named]},named.id,P2).lines.at(-1)?.name,'Kiszállás');

// 6. Mennyiségfrissítés: csak az új tervsorok kapják meg a projektválasztást
const garage=structuredClone(fixture);garage.buildings[1].floors[0].devices.push({id:'cat-g1',name:'D-21',kind:'socket',x:50,y:50,angle:0,height:30,circuit:''});
const synced=syncQuoteWithProducts(garage,qp),plain=syncQuote(garage,qp);
assert.equal(synced.priced,1);const fresh=synced.quote.lines.find(l=>l.detail.startsWith('Garázs'))!;assert.deepEqual([fresh.product?.id,fresh.material,fresh.labor],[P3.id,1600,null]);
const old=(l:{detail:string})=>!l.detail.startsWith('Garázs');assert.deepEqual(synced.quote.lines.filter(old),plain.lines.filter(old));assert.equal(synced.quote.lines.length,plain.lines.length);
const noDefaults=syncQuote(fixture,newQuote()),again=syncQuoteWithProducts(garage,noDefaults);assert.equal(again.priced,0);
assert.deepEqual(again.quote.lines.map(l=>({...l,id:''})),syncQuote(garage,noDefaults).lines.map(l=>({...l,id:''})));

// 7. Fiók-alapértelmezések alkalmazása
const catalog=validateCatalog({version:1,products:[asProduct(P1),asProduct({...P2,id:'55555555-5555-4555-8555-555555555555',sku:'K2',name:'Kettős'},{archived:true}),asProduct({...P4,id:'66666666-6666-4666-8666-666666666666',sku:'MCB',name:'Kismegszakító B16',price:2100})],defaults:[{ref:'device:socket',productId:P1.id,label:'Dugalj'},{ref:'device:double',productId:'55555555-5555-4555-8555-555555555555',label:'Kettős dugalj'},{ref:'module:MCB:1:B16',productId:'66666666-6666-4666-8666-666666666666',label:''}]});
assert.equal(availableAccountDefaults(fixture,q,catalog),2);
let applied=applyAccountDefaults(fixture,q,catalog);assert.deepEqual([applied.applied,applied.lines],[2,4]);
assert.equal(applied.quote.lines.filter(l=>l.name==='Kismegszakító'&&l.detail.includes('B16')).every(l=>l.material===2100),true);
applied=applyAccountDefaults(fixture,qp,catalog);assert.equal(applied.applied,1);assert.deepEqual(projectProduct(applied.quote,'device:socket'),P3);
assert.equal(availableAccountDefaults(fixture,applied.quote,catalog),0);

// 8. Árak frissítése a katalógusból
const handLabor=quoteSchema.parse({...qp,lines:qp.lines.map(l=>l.name==='Dugalj'&&l.id!==pinnedId&&l.detail.includes('Földszint')?{...l,labor:3200}:l)});
const nullLabor=quoteSchema.parse({...handLabor,lines:handLabor.lines.map(l=>l.name==='Dugalj'&&l.id!==pinnedId&&l.detail.includes('Emelet')?{...l,labor:null}:l)});
const priced=validateCatalog({version:1,products:[asProduct(P3,{price:1700,labor:2900})],defaults:[]});
let refreshed=refreshProductPrices(nullLabor,priced);
const ground=refreshed.quote.lines.filter(l=>l.name==='Dugalj'&&l.id!==pinnedId);
assert.ok(ground.every(l=>l.material===1700&&l.product?.price===1700));assert.deepEqual(projectProduct(refreshed.quote,'device:socket')?.price,1700);
assert.equal(ground.find(l=>l.detail.includes('Földszint'))?.labor,3200);assert.equal(ground.find(l=>l.detail.includes('Emelet'))?.labor,2900);
assert.equal(refreshed.missing,1);assert.equal(refreshed.updated,2);assert.deepEqual(refreshed.quote.lines.find(l=>l.id===pinnedId),nullLabor.lines.find(l=>l.id===pinnedId));
const relinked=validateCatalog({version:1,products:[asProduct(P3,{id:'77777777-7777-4777-8777-777777777777',manufacturer:'LEGRAND',price:1750})],defaults:[]});
refreshed=refreshProductPrices(nullLabor,relinked);assert.ok(refreshed.quote.lines.filter(l=>l.name==='Dugalj'&&l.id!==pinnedId).every(l=>l.material===1750&&l.product?.id==='77777777-7777-4777-8777-777777777777'));
const nullPrice=validateCatalog({version:1,products:[asProduct(P3,{price:null})],defaults:[]});
assert.ok(refreshProductPrices(nullLabor,nullPrice).quote.lines.filter(l=>l.name==='Dugalj'&&l.id!==pinnedId).every(l=>l.material===1600),'null katalógusár nem töröl');

// 9. Anyagkimutatás-CSV termékoszlopokkal
const withQuote={...fixture,quote:quoteSchema.parse({...qp,lines:qp.lines.map(l=>l.id===pinnedId?{...l,product:{...P2,name:'=X'}}:l)})};
const resolve=productResolver(withQuote),csv=materialsCsv(rows,10,resolve).split('\r\n');
const header=csv[0].replace('﻿','').split(';');assert.equal(header.length,12);assert.deepEqual(header.slice(-4),['"Gyártó"','"Termékcsalád"','"Cikkszám"','"Termék megnevezése"']);
const socketRows=csv.filter(l=>l.includes('"Dugalj"'));assert.equal(socketRows.length,3);assert.ok(socketRows.every(l=>l.includes('"Legrand";"Valena Life"')));
assert.ok(socketRows.some(l=>l.endsWith(`"'=X"`)));assert.ok(csv.filter(l=>l.includes('Kötődoboz')).every(l=>l.endsWith('"";"";"";""')));
assert.equal(materialsCsv(rows,10).split('\r\n')[0],'﻿"Csoport";"Hely";"Megnevezés";"Részletek";"Egység";"Terv szerinti mennyiség";"Ráhagyás (%)";"Ráhagyással"');
assert.equal(productResolver(fixture)(rows[0]),undefined);
const defaultsOnly={...fixture,quote:setProjectProduct(fixture,newQuote(),'device:socket',P1).quote};assert.equal(productResolver(defaultsOnly)(rows.find(r=>r.item==='Dugalj')!)?.id,P1.id);
const nonePinned={...fixture,quote:pinLineProduct(r.quote,pinnedId,null)};const pinnedRow=rows.find(row=>materialKey(row)===r.quote.lines.find(l=>l.id===pinnedId)!.sourceKey)!;assert.equal(productResolver(nonePinned)(pinnedRow),undefined);

// 10. Séma és visszafelé kompatibilitás
const legacy={...fixture,quote:q};assert.deepEqual(validatePlan(JSON.parse(JSON.stringify(legacy))).quote,q);
const rich={...fixture,quote:quoteSchema.parse({...withQuote.quote,productDisplay:'sku'})};assert.deepEqual(validatePlan(JSON.parse(JSON.stringify(rich))).quote,rich.quote);
assert.throws(()=>quoteSchema.parse({...qp,productDefaults:[{ref:'device:socket',product:P1},{ref:'device:socket',product:P2}]}),/Ismétlődő termékválasztás/);
assert.throws(()=>quoteSchema.parse({...qp,lines:[{...qp.lines[0],product:{...P1,unit:'óra'}}]}));
assert.throws(()=>quoteSchema.parse({...qp,lines:[{...qp.lines[0],productPinned:false}]}));
assert.throws(()=>quoteSchema.parse({...qp,lines:[{...qp.lines[0],product:{...P1,name:''}}]}));
assert.throws(()=>quoteSchema.parse({...qp,productDisplay:'all'}));
assert.deepEqual(sampleInUse(qp),{types:0,lines:0});assert.deepEqual(sampleInUse(setProjectProduct(fixture,qp,'device:double',{...P1,sample:true}).quote),{types:1,lines:1},'1 típusválasztás + 1 kettősdugalj-sor');

// 11. Megosztás: a termék- és árinformáció az ajánlattal együtt kimarad
const shared=sharedPlan(JSON.parse(JSON.stringify(rich)));assert.equal(shared.plan.quote,undefined);
assert.ok(!JSON.stringify(shared).includes('Valena')&&!JSON.stringify(shared).includes('SKU-'));

// 12. PDF-füst mindhárom megjelenítési módban
const font=readFileSync('public/fonts/NotoSans-Regular.ttf').toString('base64');
const ready=quoteSchema.parse({...qp,number:'AJ-2026-007',supplier:'Teszt Villany Kft.',customer:'Minta Ügyfél',lines:qp.lines.map(l=>({...l,material:l.material??0,labor:l.labor??0}))});
assert.equal(quoteTotals(ready).unpriced,0);
for(const mode of ['brand','sku','none'] as const)assert.ok(createQuotePdf({...ready,productDisplay:mode},'Teszt',font).output('arraybuffer').byteLength>0);
assert.equal(productLine({...P1,sample:true},'x'),'');
assert.ok(createQuotePdf(ready,'Teszt',font).getNumberOfPages()>=1);

// 13. Felülvizsgálati javítások
// 13a. Egységeltérés: az árfrissítés csak egyező egységű sort ír; az egységváltás leveszi a termékkötést és az egyedi jelölést.
const own={...addQuoteLine(),unit:'db' as const};let qu=pinLineProduct(quoteSchema.parse({...qp,lines:[...qp.lines,own]}),own.id,P1);
const mismatch=quoteSchema.parse({...qu,lines:qu.lines.map(l=>l.id===own.id?{...l,unit:'tétel',name:'Komplett szerelés',material:20000}:l)});
const freshP1=validateCatalog({version:1,products:[asProduct(P1,{price:1700})],defaults:[]});
let rf=refreshProductPrices(mismatch,freshP1);assert.deepEqual(rf.quote.lines.find(l=>l.id===own.id),mismatch.lines.find(l=>l.id===own.id),'a tétel egységű sor nem kap Ft/db árat');assert.equal(rf.updated,0);
qu=setLineUnit(qu,own.id,'tétel');const unbound=qu.lines.find(l=>l.id===own.id)!;
assert.equal(unbound.unit,'tétel');assert.equal('product' in unbound,false);assert.equal('productPinned' in unbound,false);assert.equal(unbound.material,1500,'az ár marad');
assert.deepEqual(setLineUnit(qu,own.id,'tétel'),qu,'azonos egység: nincs változás');
const noneLine=pinLineProduct(qp,pinnedId,null);assert.equal('productPinned' in setLineUnit(noneLine,pinnedId,'óra').lines.find(l=>l.id===pinnedId)!,false);
assert.deepEqual(setLineUnit(qp,pinnedId,'db'),qp);
rf=refreshProductPrices(qu,freshP1);assert.equal(rf.quote.lines.find(l=>l.id===own.id)?.material,1500);
// 13b. A mintatermék neve nem kerül a saját tételsorba (és így a PDF-be sem); valós terméknél a név átmásolódik.
const sampleSnap={...P2,id:'99999999-9999-4999-8999-999999999999',manufacturer:'',family:'',sku:'',name:'Dugalj 2P+F, süllyesztett (minta)',price:null,labor:null,sample:true as const};
for(const name of ['','Egyéb munka']){const blank={...addQuoteLine(),name,unit:'db' as const};const pinnedSample=pinLineProduct({...qp,lines:[...qp.lines,blank]},blank.id,sampleSnap).lines.at(-1)!;assert.equal(pinnedSample.name,name);assert.equal(pinnedSample.product?.sample,true)}
// 13c. Számlálók: a hozzárendelt és az árában is változott sorok külön (az ár nélküli termék nem „frissít árat”).
const qPriced=setProjectProduct(fixture,q,'device:socket',P1);assert.deepEqual([qPriced.changed,qPriced.priced],[3,3]);
const qNoPrice=setProjectProduct(fixture,q,'device:socket',P4);assert.deepEqual([qNoPrice.changed,qNoPrice.priced],[3,0]);
const appliedPriced=applyAccountDefaults(fixture,q,catalog);assert.deepEqual([appliedPriced.applied,appliedPriced.lines,appliedPriced.priced],[2,4,4]);
const samples=addSampleProducts(validateCatalog({version:1,products:[],defaults:[]}),T,(()=>{let i=0;return()=>`dddddddd-dddd-4ddd-8ddd-${String(++i).padStart(12,'0')}`})()).catalog;
const appliedSamples=applyAccountDefaults(fixture,q,samples);assert.ok(appliedSamples.applied>0&&appliedSamples.lines>0);assert.equal(appliedSamples.priced,0);
// 13d. Mintajelzés: a típusválasztás és a sor külön számít (nem duplán).
assert.deepEqual(sampleInUse(appliedSamples.quote),{types:appliedSamples.applied,lines:appliedSamples.lines});
// 13e. A pillanatkép szövegmezőiből (idegen JSON) a vezérlő-, láthatatlan és irányváltó karakter kimarad; a régi terv betölthető marad.
const dirty={...P1,manufacturer:'Leg‮rand',family:'Valena\tLife',sku:'75​3120\u0007',name:'⁦Dugalj⁩'};
const cleaned=quoteSchema.parse({...qp,lines:[{...qp.lines[0],product:dirty}]});assert.deepEqual(cleaned.lines[0].product,{...P1,manufacturer:'Legrand',family:'Valena Life',sku:'753120',name:'Dugalj'});
assert.deepEqual(quoteSchema.parse(cleaned),cleaned,'idempotens');
const invisibleName=quoteSchema.parse({...qp,productDefaults:[{ref:'device:socket',product:{...P1,name:'‮'}}]});assert.equal(invisibleName.productDefaults?.[0].product.name,'Névtelen termék');assert.deepEqual(quoteSchema.parse(invisibleName),invisibleName);
assert.ok(validatePlan(JSON.parse(JSON.stringify({...fixture,quote:{...qp,lines:[{...qp.lines[0],product:dirty}]}}))).quote);

console.log('PASS: unit-safe price refresh and unit change, sample name not copied, assigned vs repriced counters, sample counts by type/line, snapshot text sanitising, refs with unchanged materialKey/quoteSource, product slots, project defaults and pinned overrides, null-price rule, removal/follow/none, sync of new rows, account defaults, price refresh (labor only where empty), materials CSV columns, schema round-trips, share minimisation, quote PDF in all display modes.');
