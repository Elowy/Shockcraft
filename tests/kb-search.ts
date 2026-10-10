// Kereső: ékezet- és kisbetűfüggetlenség, szinonimák, egy elírás tűrése, rangsor, „Erre gondoltál?”.
// Futtatás: node_modules/.bin/tsx tests/kb-search.ts
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
import {calcMetas} from '../lib/calc/registry';
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
assert.ok(top('teljesitmeny').includes('teljesitmeny'));
// Rangsor: a cím erősebb a leírásnál.
assert.equal(first('áram'),'aram-teljesitmenybol');
// Nincs találat → javaslat.
assert.equal(search(items,'qqqqzz').length,0);
assert.equal(suggest(items,'tranzformator')?.id,'transzformator');
assert.equal(suggest(items,'xy'),null);
// A kiadatlan kalkulátor találat, de link nélkül, és azonos erősségnél a közzétett előrébb kerül.
const h=search(items,'kismegszakító');assert.equal(h[0].item.href,null);assert.ok(h.some(x=>x.item.href));
// Az index (a kalkulátorok metaadatai) kicsi.
const size=gzipSync(JSON.stringify(items)).length;assert.ok(size<40*1024,'index ≤ 40 KB gz ('+size+')');
console.log('PASS: normalizálás, szinonimák (biztosíték → kismegszakító, kábel vastagság → keresztmetszet), elírás-tűrés, rangsor, javaslat, kiadatlan találat link nélkül; index '+size+' B gz.');
