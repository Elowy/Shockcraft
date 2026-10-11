// Kereső: ékezet- és kisbetűfüggetlenség, szinonimák, egy elírás tűrése, rangsor, „Erre gondoltál?”; kalkulátorok, Tudástár-cikkek és szótári kifejezések.
// Futtatás: node_modules/.bin/tsx tests/kb-search.ts
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
import {calcMetas} from '../lib/calc/registry';
import {KB_SEARCH_ITEMS} from '../lib/kb/content/generated/search';
import {KB_PENDING,kbSearchItems} from '../lib/kb/content/registry';
import {editDistance,expandQuery,normalize,search,suggest,type SearchItem} from '../lib/kb/search';

const items:SearchItem[]=calcMetas().map(m=>({id:m.slug,title:m.title,href:m.href,group:'Kalkulátorok',keywords:m.keywords,synonyms:m.synonyms,summary:m.short,note:m.note}));
const first=(q:string)=>search(items,q)[0]?.item.id;
const top=(q:string,n=3)=>search(items,q).slice(0,n).map(h=>h.item.id);

assert.equal(normalize('Feszültség-ESÉS × 2,5 mm²'),'feszultseg eses x 2 5 mm2');
assert.equal(editDistance('kismegszakito','kismegszakitó'.normalize('NFD').replace(/[̀-ͯ]/g,'')),0);
assert.equal(editDistance('feszultseges','feszutlseges'),1,'betűcsere = 1 (Damerau)');
assert.ok(expandQuery('biztosíték').includes('kismegszakito'));

// Elvárt első találatok (ékezet nélkül is, szinonimával is).
assert.equal(first('biztosíték'),'kismegszakito');
assert.equal(first('biztositek'),'kismegszakito');
assert.equal(first('kábel vastagság'),'keresztmetszet');
assert.equal(first('feszültségesés'),'feszultseges');
assert.equal(first('fesz eses'),'feszultseges');
assert.equal(first('ohm'),'ohm-torveny');
assert.equal(first('OHM TORVENY'),'ohm-torveny');
assert.equal(first('lóerő'),'mertekegyseg-atvalto');
assert.equal(first('awg'),'mertekegyseg-atvalto');
assert.equal(first('színkód'),'ellenallas-szinkod');
assert.equal(first('trafo'),'transzformator');
assert.equal(first('akku'),'akkumulator-uzemido');
assert.equal(first('nullavezeto aram'),'fazisterheles');
assert.equal(first('villanyszámla'),'fogyasztas-koltseg');
assert.equal(first('cosfi javitas'),'fazisjavitas');
assert.equal(first('led szalag'),'led-szalag-tapegyseg');
assert.equal(first('hurokimpedancia'),'hurokimpedancia');
// Egy elírás (5 betűnél hosszabb szó).
assert.equal(first('feszutlseges'),'feszultseges');
assert.equal(first('kondenzatr'),'eredo-kapacitas');
assert.equal(first('teljesítmény'),'teljesitmeny','azonos címtalálatnál az általánosabb (rövidebb) cím az első');
assert.ok(top('teljesítmény').includes('latszolagos-meddo-teljesitmeny'),'a többi teljesítmény-kalkulátor is a találatok elején');
assert.equal(first('meddő teljesítmény'),'latszolagos-meddo-teljesitmeny');
// Rangsor: a cím erősebb a leírásnál.
assert.equal(first('áram'),'aram-teljesitmenybol');
// Nincs találat → javaslat.
assert.equal(search(items,'qqqqzz').length,0);
assert.equal(suggest(items,'tranzformator')?.id,'transzformator');
assert.equal(suggest(items,'xy'),null);
// A kiadatlan kalkulátor találat, de link nélkül, és azonos erősségnél a közzétett előrébb kerül.
const h=search(items,'kismegszakító');assert.equal(h[0].item.href,null);assert.ok(h.some(x=>x.item.href));
// Rövid szinonima (hp → le) nem illeszkedik előtagként (led, levezetés); a rövid lekérdezés javaslata legfeljebb egy elírás.
assert.equal(first('hp'),'mertekegyseg-atvalto');assert.ok(!top('hp',10).includes('led-elotet-ellenallas'),'hp: '+top('hp',10).join(', '));
assert.ok(search(items,'hp').length<=3,'hp: kevés, releváns találat ('+search(items,'hp').map(x=>x.item.id).join(', ')+')');
assert.equal(first('LE'),'mertekegyseg-atvalto','a teljes kulcsszó („kW LE”) megelőzi a „LED” előtagot');
assert.equal(suggest(items,'rcd'),null,'„RCD” → nincs értelmetlen javaslat (LED)');
assert.equal(suggest(items,'lde')?.id,'led-elotet-ellenallas','egy elírás rövid lekérdezésnél is');
// Tudástár: a közzétett cikkek és a szakszótár kifejezései ugyanabban a keresőben – a böngésző a generált indexet (KB_SEARCH_ITEMS) a kereső
// első megnyitásakor tölti be, és a kalkulátorok tételeivel (ezeket a Shell adja át) együtt keres; a kettő egyezését a tests/kb-content.ts őrzi.
const kb=kbSearchItems(false),all:SearchItem[]=[...KB_SEARCH_ITEMS,...items];
assert.deepEqual(KB_SEARCH_ITEMS.map(i=>i.id),kb.map(i=>i.id),'a betöltött index = a szerver közzétett keresőtételei');
const firstAll=(q:string)=>search(all,q)[0]?.item.id,topAll=(q:string,n=3)=>search(all,q).slice(0,n).map(h=>h.item.id);
assert.ok(kb.some(i=>i.group==='Elmélet')&&kb.some(i=>i.group==='Szakkifejezések'),'cikkek és szótári kifejezések');
for(const i of kb){assert.ok(i.href&&/^\/tudastar\/(elmelet\/[a-z0-9-]+|szotar(#[a-z0-9-]+)?)$/.test(i.href),'közzétett, belső cél: '+i.href);assert.ok(!KB_PENDING.some(p=>i.id===p.id||i.href!.endsWith('/'+p.slug)),'R3 nincs a keresőben: '+i.id)}
for(const [q,id] of [['színjelölés','vezetekek-szinjelolese'],['szinjeloles','vezetekek-szinjelolese'],['zöld-sárga','vezetekek-szinjelolese'],['barna','vezetekek-szinjelolese'],
 ['ip65','ip-vedettseg'],['IP44','ip-vedettseg'],['E27','lampafoglalatok-es-lampatalpak'],['GU10','lampafoglalatok-es-lampatalpak'],['H07V-K','vezetek-es-kabeljelolesek'],['NYM','vezetek-es-kabeljelolesek'],
 ['kirchhoff','kirchhoff-torvenyei'],['rövidzárlat','rovidzarlat-es-tulterheles'],['hőhatás','joule-lenz-torveny'],['kelvin','szinhomerseklet'],['színhőmérséklet','szinhomerseklet'],
 ['soros kapcsolás','soros-es-parhuzamos-kapcsolas'],['fényáram','lumen-es-lux'],['effektív érték','elektromos-aram'],['feszültség','elektromos-feszultseg'],['kwh','elektromos-teljesitmeny'],
 // Szótári kifejezések (szinonimával, ékezet nélkül): /tudastar/szotar#<horgony>
 ['fi rele','szotar-aram-vedokapcsolo-fi-rele'],['rcd','szotar-aram-vedokapcsolo-fi-rele'],['avk','szotar-aram-vedokapcsolo-fi-rele'],['pen','szotar-pen-vezeto'],['védővezető','szotar-vedovezeto'],
 ['konnektor','szotar-dugalj'],['106','szotar-valtokapcsolo']] as const)assert.equal(firstAll(q),id,q+' → '+topAll(q,5).join(', '));
// Egy szavas keresésnél a cikk és a kalkulátor előrébb kerül a szótári kifejezésnél (a kifejezés súlya kisebb), de a kifejezés is a találatok elején van.
assert.equal(firstAll('ohm'),'ohm-torveny');assert.ok(topAll('ohm',2).includes('ohm-torvenye'),'ohm: a kalkulátor és a cikk');
assert.ok(topAll('trafo',3).includes('transzformator-mukodese')&&topAll('trafo',3).includes('szotar-transzformator'),'trafo: '+topAll('trafo',3).join(', '));
assert.ok(topAll('teljesítmény',5).includes('elektromos-teljesitmeny'),'teljesítmény: a cikk az első öt között');
assert.equal(search(all,'fi rele').find(h=>h.item.id==='szotar-aram-vedokapcsolo-fi-rele')?.item.href,'/tudastar/szotar#aram-vedokapcsolo-fi-rele');
assert.equal(suggest(all,'kirhhof')?.id,'kirchhoff-torvenyei','„Erre gondoltál?” cikkcímre is');
// Az index (a kalkulátorok és a Tudástár könnyű metaadatai, cikktörzs nélkül) kicsi.
const size=gzipSync(JSON.stringify(all)).length;assert.ok(size<40*1024,'index ≤ 40 KB gz ('+size+')');
// A minden oldallal érkező rész (a kalkulátorok tételei) a HEAD-beli méret körül marad; a Tudástár-index csak a kereső megnyitásakor töltődik.
const inline=gzipSync(JSON.stringify(items)).length,lazy=gzipSync(JSON.stringify(KB_SEARCH_ITEMS)).length;
assert.ok(inline<6*1024,'az oldalba ágyazott keresőtételek (kalkulátorok) ≤ 6 KB gz ('+inline+')');
assert.ok(!JSON.stringify(kb).includes('Kidolgozott példa'),'cikktörzs nem kerül az indexbe');
console.log('PASS: normalizálás, szinonimák (biztosíték → kismegszakító, kábel vastagság → keresztmetszet, rcd → FI-relé), elírás-tűrés, rangsor, javaslat, kiadatlan találat link nélkül, cikkek és szótári kifejezések ('+kb.length+' tétel, R3 nélkül); index '+size+' B gz (oldalba ágyazva '+inline+' B, lustán töltve '+lazy+' B).');
