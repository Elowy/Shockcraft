import assert from 'node:assert/strict';
import {CATALOG_LIMIT,LIMIT_ERROR,BYTES_ERROR,accountDefault,catalogError,emptyCatalog,productLabel,productLine,removeProduct,searchProducts,setAccountDefault,setProductArchived,skuKey,toSnapshot,upsertProduct,validateCatalog,type Catalog,type Product} from '../lib/catalog';
import {catalogCsv,decodeCsv,mergeCatalogCsv,parseCatalogCsv,parseHuf,parseUnit} from '../lib/catalog-csv';
import {SAMPLE_PRODUCTS,addSampleProducts} from '../lib/catalog-sample';
import {cableRef,refCategory,refLabel,refUnit,validRef} from '../lib/product-refs';
import {quoteLineSchema} from '../lib/quote-schema';
import {addQuoteLine} from '../lib/quote';

const T='2026-10-09T08:00:00.000Z',T2='2026-10-10T08:00:00.000Z';
const A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222',C='33333333-3333-4333-8333-333333333333',D='44444444-4444-4444-8444-444444444444';
let seq=0;const nextId=()=>`aaaaaaaa-aaaa-4aaa-8aaa-${String(++seq).padStart(12,'0')}`;
const product=(id:string,name:string,extra:Partial<Product>={}):Product=>({id,manufacturer:'',family:'',sku:'',name,unit:'db',price:null,labor:null,archived:false,sample:false,updatedAt:T,...extra});
const catalog=(products:Product[],defaults:Catalog['defaults']=[]):Catalog=>validateCatalog({version:1,products,defaults});
const rejects=(v:unknown,re?:RegExp)=>{let error='';assert.throws(()=>{try{validateCatalog(v)}catch(e){error=catalogError(e);throw e}});if(re)assert.match(error,re)};

// 1. Alapértékek
assert.deepEqual(validateCatalog(emptyCatalog()),{version:1,products:[],defaults:[]});
assert.deepEqual(validateCatalog({version:1,products:[{id:A,name:'Dugalj',unit:'db',updatedAt:T}]}).products[0],product(A,'Dugalj'));
assert.deepEqual(validateCatalog({version:1,products:[]}).defaults,[]);

// 2. Elutasítások magyar üzenettel
const base={version:1,products:[product(A,'Dugalj')],defaults:[]};
const withP=(p:Partial<Product>)=>({...base,products:[{...product(A,'Dugalj'),...p}]});
rejects(withP({name:'  '}),/megnevezés/);
rejects(withP({unit:'doboz' as 'db'}),/db vagy m/);
rejects(withP({price:-1}),/negatív/);
rejects(withP({price:1_000_000.01}),/1 000 000/);
rejects(withP({price:Infinity}));
rejects(withP({price:'12' as unknown as number}),/szám/);
rejects(withP({name:'Dug\x07alj'}),/Érvénytelen karakter/);
rejects(withP({sku:'75\n3120'}),/sortörés/);
rejects(withP({name:'x'.repeat(241)}),/240/);
rejects({...base,products:[product(A,'Egy'),product(A,'Kettő')]},/Ismétlődő termékazonosító/);
rejects({...base,products:[product(A,'Egy',{manufacturer:'Legrand',sku:'753120'}),product(B,'Kettő',{manufacturer:' legrand ',sku:'753120 '})]},/Ismétlődő cikkszám: legrand 753120/);
assert.equal(catalog([product(A,'Egy',{manufacturer:'Legrand',sku:'753120'}),product(B,'Kettő',{manufacturer:'Schneider',sku:'753120'})]).products.length,2);
rejects({...base,products:[product(A,'Egy',{sku:'X1'}),product(B,'Kettő',{sku:'x1'})]},/\(gyártó nélkül\)/);
rejects({...base,defaults:[{ref:'device:socket',productId:A,label:''},{ref:'device:socket',productId:A,label:''}]},/csak egy fiók-alapértelmezés/);
rejects({...base,defaults:[{ref:'device:socket',productId:B,label:''}]},/nem található/);
rejects({...base,defaults:[{ref:'foo:bar',productId:A,label:''}]},/hozzárendelés/);
rejects({...base,products:Array.from({length:CATALOG_LIMIT+1},(_,i)=>product(`aaaaaaaa-aaaa-4aaa-8aaa-${String(i).padStart(12,'0')}`,'T'+i))},/2000/);
rejects({...base,products:[product('nem-uuid','Dugalj')]},/azonosító/);
rejects({version:2,products:[],defaults:[]},/Érvénytelen termékadatok/);
assert.equal(catalogError(new SyntaxError('Unexpected token')),'Érvénytelen termékadatok.');
assert.equal(catalogError(new TypeError('x is undefined')),'Érvénytelen termékadatok.');
assert.equal(catalogError(Error('Saját magyar hiba.')),'Saját magyar hiba.');

// 3. Árséma-paritás az ajánlati egységárral
const line=addQuoteLine();
for(const v of [0,12.34,1_000_000,null]){assert.ok(validateCatalog(withP({price:v})));assert.ok(quoteLineSchema.parse({...line,material:v}))}
for(const v of [-0.01,1_000_000.01,Infinity,NaN]){rejects(withP({price:v}));assert.throws(()=>quoteLineSchema.parse({...line,material:v}))}

// 4. Módosítók (a bemenet nem változik)
const c0=catalog([product(A,'Dugalj',{manufacturer:'Legrand',sku:'753120',price:1500})]),frozen=JSON.stringify(c0);
const c1=upsertProduct(c0,product(B,'Kapcsoló'),T2);assert.equal(c1.products.length,2);assert.equal(c1.products[1].updatedAt,T2);
const c2=upsertProduct(c1,{...c1.products[0],price:1600},T2);assert.equal(c2.products.length,2);assert.equal(c2.products[0].price,1600);assert.equal(c2.products[0].updatedAt,T2);
assert.throws(()=>upsertProduct(c2,product(C,'Másik',{manufacturer:'LEGRAND',sku:'753120'}),T2),e=>/Ismétlődő cikkszám/.test(catalogError(e)));
const c3=setAccountDefault(c2,'device:socket',A,'Dugalj');assert.deepEqual(c3.defaults,[{ref:'device:socket',productId:A,label:'Dugalj'}]);
assert.deepEqual(setAccountDefault(c3,'device:socket',B,'Dugalj').defaults,[{ref:'device:socket',productId:B,label:'Dugalj'}]);
assert.deepEqual(setAccountDefault(c3,'device:socket',null,'').defaults,[]);
assert.equal(accountDefault(c3,'device:socket')?.id,A);assert.equal(accountDefault(c3,'device:double'),undefined);
const c4=setProductArchived(c3,A,true,T2);assert.equal(c4.products[0].archived,true);assert.equal(accountDefault(c4,'device:socket'),undefined);
const c5=removeProduct(c3,A);assert.deepEqual(c5.products.map(p=>p.id),[B]);assert.deepEqual(c5.defaults,[]);
assert.equal(JSON.stringify(c0),frozen);

// 5. Címke és PDF-sor
const snap=toSnapshot(product(A,'Valena Life dugalj',{manufacturer:'Legrand',family:'Valena Life',sku:'753120',price:1500,labor:2500}));
assert.equal('sample' in snap,false);assert.equal(toSnapshot(product(A,'x',{sample:true})).sample,true);
assert.equal(productLabel(snap),'Legrand Valena Life · 753120 · Valena Life dugalj');
assert.equal(productLine(snap,'Dugalj'),'Termék: Legrand Valena Life · Valena Life dugalj');
assert.equal(productLine(snap,'Dugalj','sku'),'Termék: Legrand Valena Life · Valena Life dugalj · Cikkszám: 753120');
assert.equal(productLine(snap,' Valena Life dugalj '),'Termék: Legrand Valena Life');
assert.equal(productLine(snap,'Dugalj','none'),'');assert.equal(productLine(undefined,'Dugalj'),'');
assert.equal(productLine({...snap,sample:true},'Dugalj','sku'),'');

// 6. Keresés
const s=catalog([product(A,'Árvíztűrő tükörfúrógép',{manufacturer:'Teszt'}),product(B,'Kábel 3×2,5 mm²',{unit:'m'}),product(C,'Archivált dugalj',{archived:true}),product(D,'Bemenet',{sku:'NYM-J'})]);
assert.deepEqual(searchProducts(s.products,'arvizturo').map(p=>p.id),[A]);
assert.deepEqual(searchProducts(s.products,'3x2,5').map(p=>p.id),[B]);
assert.deepEqual(searchProducts(s.products,'teszt fúró').map(p=>p.id),[A]);
assert.deepEqual(searchProducts(s.products,'',{unit:'m'}).map(p=>p.id),[B]);
assert.equal(searchProducts(s.products,'dugalj').length,0);assert.deepEqual(searchProducts(s.products,'dugalj',{archived:true}).map(p=>p.id),[C]);
assert.deepEqual(searchProducts(s.products,'nym-j').map(p=>p.id),[D]);

// 7. Dekódolás
const utf8=new TextEncoder().encode('Árvíztűrő');
assert.deepEqual(decodeCsv(new Uint8Array([0xef,0xbb,0xbf,...utf8])),{text:'Árvíztűrő',encoding:'utf-8'});
assert.deepEqual(decodeCsv(utf8),{text:'Árvíztűrő',encoding:'utf-8'});
const utf16=new Uint8Array(2+'Árvíztűrő'.length*2);utf16.set([0xff,0xfe]);[...'Árvíztűrő'].forEach((ch,i)=>{const code=ch.charCodeAt(0);utf16[2+i*2]=code&255;utf16[3+i*2]=code>>8});
assert.deepEqual(decodeCsv(utf16),{text:'Árvíztűrő',encoding:'utf-16le'});
assert.deepEqual(decodeCsv(new Uint8Array([0xc1,0x72,0x76,0xed,0x7a,0x74,0xfb,0x72,0xf5])),{text:'Árvíztűrő',encoding:'windows-1250'});

// 8. Feldolgozás
assert.equal(parseCatalogCsv('Megnevezés;Egység\nDugalj;db').delimiter,';');
assert.equal(parseCatalogCsv('Megnevezés,Egység,Ár\nDugalj,db,"1,5"').delimiter,',');
let p=parseCatalogCsv('Megnevezés\tEgység\tÁr\nDugalj\tdb\t1,5');assert.equal(p.delimiter,'\t');assert.equal(p.drafts[0].price,1.5);
p=parseCatalogCsv('Megnevezés;Egység;Cikkszám\r\n"Dugalj; fehér ""Valena""\r\nkerettel";db;"A1"\r\nKapcsoló;db;B2\r\n');
assert.deepEqual(p.drafts.map(d=>[d.line,d.name,d.sku]),[[2,'Dugalj; fehér "Valena" kerettel','A1'],[4,'Kapcsoló','B2']]);
p=parseCatalogCsv('Árlista 2026\nNagyker Kft.;;\nMEGNEVEZES;ME;Nettó anyagár (Ft);Cikkszám;Megjegyzés;Megnevezés 2\nDugalj;Db.;1 234,50 Ft;753120;x;y');
assert.equal(p.headerLine,3);assert.deepEqual(p.ignored,['Megjegyzés','Megnevezés 2']);assert.deepEqual(p.errors,[]);
assert.deepEqual(p.drafts,[{line:4,sku:'753120',name:'Dugalj',unit:'db',price:1234.5}]);
for(const [raw,v] of [['1 234,50 Ft',1234.5],['1.234,5',1234.5],['1,234.50',1234.5],['12.500',12500],['12,5',12.5],['1234.56',1234.56],['',null],['  ',null],['HUF 990',990],['1 000 Ft.',1000],['0',0],['1 000 000',1_000_000],['12,345',12.35]] as [string,number|null][])assert.equal(parseHuf(raw),v,raw);
for(const raw of ['abc','-5','2 000 000','1,2,3','12a'])assert.throws(()=>parseHuf(raw),/Érvénytelen ár/,raw);
assert.equal(parseUnit('Db.'),'db');assert.equal(parseUnit('fm'),'m');assert.equal(parseUnit('Méter'),'m');assert.equal(parseUnit('folyóméter'),'m');assert.equal(parseUnit('doboz'),null);
p=parseCatalogCsv('Megnevezés;Egység;Ár;Munkadíj\nA;doboz;1;2\n;db;1;2\nB;db;abc;2\nC;m;5;\nD;db;;3000\n'+'X'.repeat(241)+';db;;');
assert.deepEqual(p.errors.map(e=>e.line),[2,3,4,7]);assert.match(p.errors[0].message,/db vagy m lehet/);assert.match(p.errors[1].message,/megnevezését/);assert.match(p.errors[2].message,/Érvénytelen ár: abc/);assert.match(p.errors[3].message,/240/);
assert.deepEqual(p.drafts,[{line:5,name:'C',unit:'m',price:5,labor:null},{line:6,name:'D',unit:'db',price:null,labor:3000}]);
p=parseCatalogCsv('Gyártó;Cikkszám;Egység\nLegrand;1;db');assert.deepEqual(p.drafts,[]);assert.equal(p.errors.length,1);assert.equal(p.errors[0].line,0);assert.match(p.errors[0].message,/hiányzik a „Megnevezés”/);
p=parseCatalogCsv('Megnevezés;Ár\nDugalj;1');assert.match(p.errors[0].message,/hiányzik az „Egység”/);
p=parseCatalogCsv('Megnevezés;Egység\n'+'Dugalj;db\n'.repeat(5001));assert.deepEqual(p.drafts,[]);assert.deepEqual(p.errors.map(e=>e.message),['Legfeljebb 5000 sor importálható egyszerre.']);
assert.equal(parseCatalogCsv('Megnevezés;Egység\n'+'Dugalj;db\n'.repeat(5000)).drafts.length,5000);
p=parseCatalogCsv('Gyártó;Cikkszám;Megnevezés;Egység;Azonosító\nLegrand;753120;Dugalj;db;\nlegrand ;753120;Másik;db;\nSchneider;753120;Harmadik;db;\nX;;N1;db;'+A+'\nY;;N2;db;'+A);
assert.deepEqual(p.drafts.map(d=>d.line),[2,4,5]);assert.deepEqual(p.errors.map(e=>[e.line,e.message]),[[3,'Ez a termék már szerepelt a(z) 2. sorban.'],[6,'Ez a termék már szerepelt a(z) 5. sorban.']]);
p=parseCatalogCsv('Megnevezés;Egység;Nettó anyagár;Munkadíj\nDugalj;db;1270;1270\nOlcsó;db;;',{markupPercent:25,gross:true});
assert.deepEqual(p.drafts.map(d=>[d.price,d.labor]),[[1250,1270],[null,null]]);
p=parseCatalogCsv('Megnevezés;Egység;Nettó anyagár\nDrága;db;300000\nOlcsó;db;1000',{markupPercent:300});assert.deepEqual(p.drafts.map(d=>d.price),[4000]);assert.equal(p.errors[0].line,2);assert.match(p.errors[0].message,/meghaladja az 1 000 000/);
assert.equal(parseCatalogCsv('Megnevezés;Egység;Ár\nDugalj;db;100',{markupPercent:1000}).drafts[0].price,400,'az árrés legfeljebb 300%');
assert.equal(parseCatalogCsv('Megnevezés;Egység;Ár\nDugalj;db;100',{markupPercent:10}).drafts[0].price,110);
p=parseCatalogCsv('\n\nMegnevezés;Egység\n\n;;\nDugalj;db\n\n');assert.equal(p.headerLine,3);assert.deepEqual(p.drafts,[{line:6,name:'Dugalj',unit:'db'}]);
p=parseCatalogCsv('Megnevezés;Egység;Gyártó\n"\'=SUM(A1)";db;"\'+36"');assert.equal(p.drafts[0].name,'=SUM(A1)');assert.equal(p.drafts[0].manufacturer,'+36');
assert.equal(parseCatalogCsv('﻿Megnevezés;Egység\nDugalj;m').drafts[0].unit,'m');
assert.equal(parseCatalogCsv('Megnevezés;Egység\n"Dug\x07alj";db').errors.length,1);

// 9. Összefésülés
const m0=catalog([product(A,'Dugalj',{manufacturer:'Legrand',family:'Valena',sku:'753120',price:1500,labor:2500}),product(B,'Kapcsoló',{sku:'K-1',price:900}),product(C,'Minta dugalj (minta)',{sample:true}),product(D,'Duplán',{manufacturer:'X',sku:'DUP'})]),m0s=JSON.stringify(m0);
let m=mergeCatalogCsv(m0,[{line:2,id:A,name:'Dugalj',unit:'db',price:1600}],T2,nextId);assert.deepEqual([m.added,m.updated,m.unchanged],[0,1,0]);assert.equal(m.catalog.products[0].price,1600);assert.equal(m.catalog.products[0].labor,2500);assert.equal(m.catalog.products[0].updatedAt,T2);
m=mergeCatalogCsv(m0,[{line:2,manufacturer:'LEGRAND',sku:'753120',name:'Dugalj fehér',unit:'db',price:null,labor:null}],T2,nextId);assert.deepEqual([m.added,m.updated],[0,1]);assert.deepEqual([m.catalog.products[0].name,m.catalog.products[0].price,m.catalog.products[0].labor,m.catalog.products[0].manufacturer],['Dugalj fehér',1500,2500,'LEGRAND']);
m=mergeCatalogCsv(m0,[{line:2,sku:'k-1',name:'Kapcsoló',unit:'db',price:950}],T2,nextId);assert.deepEqual([m.added,m.updated],[0,1]);assert.equal(m.catalog.products[1].price,950);
const ambiguous=catalog([...m0.products,product('55555555-5555-4555-8555-555555555555','Duplán 2',{manufacturer:'Y',sku:'DUP'})]);
m=mergeCatalogCsv(ambiguous,[{line:2,sku:'DUP',name:'Harmadik',unit:'db'}],T2,nextId);assert.deepEqual([m.added,m.updated],[1,0]);assert.equal(m.catalog.products.length,6);
m=mergeCatalogCsv(m0,[{line:2,manufacturer:'',sku:'753120',name:'Gyártó nélkül',unit:'db'}],T2,nextId);assert.equal(m.added,1,'gyártóoszloppal a skuKey számít');
m=mergeCatalogCsv(m0,[{line:2,id:A,manufacturer:'',family:'',sku:'',name:'Dugalj',unit:'db',price:null,labor:null}],T2,nextId);assert.deepEqual([m.updated,m.unchanged],[0,1]);assert.deepEqual(m.catalog,m0,'üres cella nem töröl');
m=mergeCatalogCsv(m0,[{line:2,id:C,name:'Minta dugalj (minta)',unit:'db',price:1200}],T2,nextId);assert.equal(m.catalog.products[2].sample,false);assert.equal(m.catalog.products[2].price,1200);
m=mergeCatalogCsv(m0,[{line:2,id:C,name:'Minta dugalj (minta)',unit:'db'}],T2,nextId);assert.equal(m.catalog.products[2].sample,true);assert.equal(m.unchanged,1);
const newUuid='66666666-6666-4666-8666-666666666666';m=mergeCatalogCsv(m0,[{line:2,id:newUuid,name:'Új',unit:'m',price:12},{line:3,id:'nem-uuid',name:'Új 2',unit:'db'}],T2,nextId);
assert.deepEqual(m.catalog.products.slice(4),[product(newUuid,'Új',{unit:'m',price:12,updatedAt:T2}),product(`aaaaaaaa-aaaa-4aaa-8aaa-${String(seq).padStart(12,'0')}`,'Új 2',{updatedAt:T2})]);
assert.throws(()=>mergeCatalogCsv(m0,[{line:2,id:B,manufacturer:'Legrand',sku:'753120',name:'Ütköző',unit:'db'}],T2,nextId),e=>/Ismétlődő cikkszám/.test(catalogError(e)));
const nearFull=catalog(Array.from({length:CATALOG_LIMIT},(_,i)=>product(`bbbbbbbb-bbbb-4bbb-8bbb-${String(i).padStart(12,'0')}`,'T'+i)));
assert.throws(()=>mergeCatalogCsv(nearFull,[{line:2,name:'Egy túl sok',unit:'db'}],T2,nextId),e=>/2000/.test(catalogError(e)));
assert.equal(JSON.stringify(m0),m0s);

// 10. Oda-vissza (export → import): változatlan
const round=catalog([...m0.products,product('77777777-7777-4777-8777-777777777777','-10 °C-ig működő "kültéri" dugalj; IP44',{manufacturer:'=Gyártó',price:1234.5,labor:0.1}),product('88888888-8888-4888-8888-888888888888','Archivált kábel',{unit:'m',archived:true,price:99})]);
const csv=catalogCsv(round);
assert.ok(csv.startsWith('﻿"Azonosító";"Gyártó";"Termékcsalád";"Cikkszám";"Megnevezés";"Egység";"Nettó anyagár (Ft)";"Munkadíj (Ft)"\r\n'));assert.ok(!csv.includes('Archivált kábel'));assert.ok(csv.includes('"1234,5"'));assert.ok(csv.includes(`"'=Gyártó"`));
const bytes=new TextEncoder().encode(csv),decoded=decodeCsv(bytes);assert.equal(decoded.encoding,'utf-8');
const back=parseCatalogCsv(decoded.text);assert.deepEqual(back.errors,[]);assert.equal(back.drafts.length,5);
const rt=mergeCatalogCsv(round,back.drafts,T2,nextId);assert.deepEqual(rt.catalog,round);assert.deepEqual([rt.added,rt.updated,rt.unchanged],[0,0,5]);
assert.equal(back.drafts[4].name,'-10 °C-ig működő "kültéri" dugalj; IP44');

// 11. Mintakészlet
assert.equal(SAMPLE_PRODUCTS.length,25);assert.ok(SAMPLE_PRODUCTS.every(s=>validRef(s.ref)&&s.name.endsWith('(minta)')&&s.unit===refUnit(s.ref)));
const sample=addSampleProducts(emptyCatalog(),T,nextId);assert.equal(sample.added,25);assert.equal(sample.catalog.products.length,25);
assert.ok(sample.catalog.products.every(p=>p.price===null&&p.labor===null&&p.sample&&p.manufacturer===''&&p.sku===''&&p.family===''&&p.name.endsWith('(minta)')));
assert.equal(sample.catalog.defaults.length,25);assert.equal(sample.catalog.defaults.find(d=>d.ref==='cable:3x2.5')?.label,'Kábel: 3 × 2,5 mm²');
const again=addSampleProducts(sample.catalog,T2,nextId);assert.equal(again.added,0);assert.deepEqual(again.catalog,sample.catalog);
const mine=catalog([product(A,'Saját dugalj')],[{ref:'device:socket',productId:A,label:'Dugalj'}]);const withSample=addSampleProducts(mine,T,nextId).catalog;
assert.equal(withSample.defaults.find(d=>d.ref==='device:socket')?.productId,A);assert.equal(withSample.products.length,26);

// 12. Típuskulcsok
for(const [text,ref] of [['3 × 2,5 mm²','cable:3x2.5'],['3x2,5','cable:3x2.5'],['3X2.5 mm2','cable:3x2.5'],['NYM-J 3×2,5 mm2','cable:nym-j3x2.5'],['5 × 10 mm²','cable:5x10'],['3*1,5','cable:3x1.5'],['',undefined],[' ',undefined],['Nincs kábeltípus',undefined]] as [string,string|undefined][])assert.equal(cableRef(text),ref,text);
assert.ok(cableRef('x'.repeat(200))!.length<=116);assert.ok(validRef(cableRef('NYM-J 3×2,5 mm2')!));
assert.ok(validRef('device:socket')&&validRef('module:MCB:1:B16')&&validRef('site:meter'));
for(const bad of ['foo:bar','device:','device:a b','cable:\x07','x'.repeat(121),'device:'+'x'.repeat(114)])assert.equal(validRef(bad),false,bad);
assert.equal(refLabel('module:MCB:1:B16'),'Kismegszakító · 1 modul · B16 A');assert.equal(refLabel('module:RCD:4'),'Áram-védőkapcsoló · 4 modul');
assert.equal(refLabel('site:meter'),'Telki pont: Villanyóra');assert.equal(refLabel('device:socket'),'Dugalj');assert.equal(refLabel('cable:3x2.5','3 × 2,5 mm²'),'Kábel: 3 × 2,5 mm²');assert.equal(refLabel('cable:3x2.5'),'Kábel: 3x2.5');assert.equal(refLabel('device:toString'),'device:toString');
assert.equal(refCategory('module:MCB:1:B16'),'Elosztókészülék');assert.equal(refCategory('constructor:x'),undefined);assert.equal(refUnit('cable:3x2.5'),'m');
assert.equal(skuKey({manufacturer:' Legrand ',sku:'753120 '}),skuKey({manufacturer:'legrand',sku:'753120'}));

// 13. Felülvizsgálati javítások
// 13a. Az ár két tizedesre kerekedik (űrlap, API, tárolt adat), így az oda-vissza CSV változatlan és kitevős alak sem keletkezik.
const dec=catalog([product(A,'Háromtizedes',{price:312.345,labor:0.005}),product(B,'Parányi',{price:1e-7,labor:999_999.999})]);
assert.deepEqual(dec.products.map(p=>[p.price,p.labor]),[[312.35,0.01],[0,1_000_000]]);
assert.deepEqual(validateCatalog(dec),dec,'a kerekítés idempotens');
const decCsv=catalogCsv(dec);assert.ok(!/\de[-+]?\d/i.test(decCsv),'kitevő nélküli export');assert.ok(decCsv.includes('"312,35";"0,01"'));
const decBack=parseCatalogCsv(decodeCsv(new TextEncoder().encode(decCsv)).text);assert.deepEqual(decBack.errors,[]);
const decRt=mergeCatalogCsv(dec,decBack.drafts,T2,nextId);assert.deepEqual([decRt.added,decRt.updated,decRt.unchanged],[0,0,2]);assert.deepEqual(decRt.catalog,dec);
// 13b. A „0.500” tizedestört (nem 500): az ezres tagolás első csoportja nem kezdődhet 0-val.
for(const [raw,v] of [['0.500',0.5],['0.250',0.25],['0.5',0.5],['1.500',1500],['999.999,5',999999.5],['0,500',0.5]] as [string,number][])assert.equal(parseHuf(raw),v,raw);
assert.deepEqual(parseCatalogCsv('Megnevezés,Egység,Ár\nA,db,"1,234.50"\nB,db,0.500').drafts.map(d=>d.price),[1234.5,0.5]);
// 13c. Lezáratlan idézőjel: fájlhiba a nyitó sor számával; a további sorok nem nyelődnek el csendben.
p=parseCatalogCsv('Megnevezés;Egység;Ár\nA;db;1\nB;db;2\n"Lezáratlan;db;100;\nElnyelt sor;db;1\nElnyelt sor 2;db;2\n');
assert.deepEqual(p.drafts,[]);assert.equal(p.errors.length,1);assert.equal(p.errors[0].line,0);assert.match(p.errors[0].message,/Lezáratlan idézőjel a\(z\) 4\. sorban/);
p=parseCatalogCsv('Megnevezés;Egység\n"Több\nsoros";db\n"Idézett ""jel""";db\n"Le nem zárt\n');assert.match(p.errors[0].message,/a\(z\) 5\. sorban/);
assert.deepEqual(parseCatalogCsv('Megnevezés;Egység\n"Több\nsoros";db\n"12"-es cső;db').drafts.map(d=>d.name),['Több soros','12-es cső']);
// 13d. Láthatatlan és irányváltó karakterek (C1, nulla szélességű, bidi, BOM): a séma és a CSV is csendben elhagyja őket.
const bidi=validateCatalog(withP({name:'ab‮dcba',manufacturer:'Gy\u0081ártó',family:'⁦Csa​lád⁩',sku:'75﻿3120'})).products[0];
assert.deepEqual([bidi.name,bidi.manufacturer,bidi.family,bidi.sku],['abdcba','Gyártó','Család','753120']);
rejects(withP({name:'‮​ '}),/megnevezését/);
p=parseCatalogCsv('Megnevezés;Egység;Gyártó\n"Dugalj‮";db;"Leg\u0098rand"');assert.deepEqual(p.errors,[]);assert.deepEqual([p.drafts[0].name,p.drafts[0].manufacturer],['Dugalj','Legrand']);
// 13e. Az aposztróffal kezdődő képletszerű szöveg is változatlanul ér vissza (az export még egy aposztrófot tesz elé).
const apos=catalog([product(A,"'=X"),product(B,"''+36 Teszt"),product(C,"'Sima")]);
const aposCsv=catalogCsv(apos);assert.ok(aposCsv.includes(`"''=X"`)&&aposCsv.includes(`"'''+36 Teszt"`)&&aposCsv.includes(`"'Sima"`));
const aposBack=parseCatalogCsv(decodeCsv(new TextEncoder().encode(aposCsv)).text);assert.deepEqual(aposBack.drafts.map(d=>d.name),["'=X","''+36 Teszt","'Sima"]);
assert.equal(mergeCatalogCsv(apos,aposBack.drafts,T2,nextId).unchanged,3);
// 13f. Összefésülés: a cikkszám-index követi a módosítást (a régi kulcs megszűnik, az új párosít), és nagy fájlnál sem négyzetes.
m=mergeCatalogCsv(m0,[{line:2,id:A,manufacturer:'Legrand',sku:'NEW-1',name:'Dugalj',unit:'db'},{line:3,manufacturer:'Legrand',sku:'753120',name:'Régi kód',unit:'db'},{line:4,sku:'new-1',name:'Dugalj 2',unit:'db'}],T2,nextId);
assert.deepEqual([m.added,m.updated,m.unchanged],[1,2,0]);assert.deepEqual([m.catalog.products[0].sku,m.catalog.products[0].name],['new-1','Dugalj 2'],'a cikkszám a CSV-ben írt alakot veszi fel');assert.equal(m.catalog.products.at(-1)?.name,'Régi kód');
const bigCatalog=catalog(Array.from({length:CATALOG_LIMIT},(_,i)=>product(`cccccccc-cccc-4ccc-8ccc-${String(i).padStart(12,'0')}`,'Termék '+i,{manufacturer:'Gyártó'+(i%37),sku:'SKU-'+i})));
let bigCsv='Gyártó;Cikkszám;Megnevezés;Egység;Ár\n';for(let i=0;i<5000;i++)bigCsv+=`Másik${i%50};X-${i};Új termék ${i};db;12\n`;
const bigDrafts=parseCatalogCsv(bigCsv).drafts;assert.equal(bigDrafts.length,5000);
let started=performance.now(),limitError='';try{mergeCatalogCsv(bigCatalog,bigDrafts,T2,nextId)}catch(e){limitError=catalogError(e)}
assert.ok(performance.now()-started<2500,'5000 sor 2000 termékes katalógusba: lineáris idő (korábban 5–12 s)');
assert.match(limitError,/5000 érvényes sorából 5000 új termék lenne, így a katalógusban 7000 termék lenne/);assert.match(limitError,/archiváltak is beleszámítanak/);
let updCsv='Gyártó;Cikkszám;Megnevezés;Egység;Ár\n';for(let i=0;i<CATALOG_LIMIT;i++)updCsv+=`Gyártó${i%37};SKU-${i};Termék ${i};db;${100+i}\n`;
started=performance.now();m=mergeCatalogCsv(bigCatalog,parseCatalogCsv(updCsv).drafts,T2,nextId);assert.ok(performance.now()-started<2500);assert.deepEqual([m.added,m.updated],[0,CATALOG_LIMIT]);
// 13g. Korlátüzenetek: az archivált termék is beleszámít, ezért archiválást nem javasolnak.
for(const msg of [LIMIT_ERROR,BYTES_ERROR]){assert.match(msg,/archivált/);assert.doesNotMatch(msg,/Archiváld/)}
// 13h. A kábeles fiók-alapértelmezés címkéje egyszer kapja a „Kábel:” előtagot (a tárolt címke már teljes felirat).
assert.equal(refLabel('cable:3x2.5','Kábel: 3 × 2,5 mm²'),'Kábel: 3 × 2,5 mm²');assert.equal(refLabel('cable:3x2.5','Kábel:'),'Kábel: 3x2.5');
for(const d of sample.catalog.defaults.filter(d=>d.ref.startsWith('cable:')))assert.equal(refLabel(d.ref,d.label).match(/Kábel:/g)?.length,1,d.ref);
assert.equal(refLabel('cable:3x1.5',sample.catalog.defaults.find(d=>d.ref==='cable:3x1.5')!.label),'Kábel: 3 × 1,5 mm²');

console.log('PASS: catalog schema and Hungarian errors, two-decimal prices, invisible-character stripping, unclosed quotes, 0.xxx prices, apostrophe round-trip, linear merge with limit message, idempotent cable label, price parity, mutators, labels and PDF line, search, decoding (UTF-8/UTF-16LE/Windows-1250), CSV parsing (delimiters, quoting, header search, Hungarian numbers, units, limits, duplicates, markup/gross, formula guard), merge rules, round-trip, sample set, refs.');
