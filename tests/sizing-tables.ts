import assert from 'node:assert/strict';
import {CLAUSES,INSTALL_METHODS,REVIEW_TEXTS,SECTIONS,SIZING_REVIEW,SIZING_TABLES,SOURCES,capacity,constantRef,conventionalRef,fingerprint,groupingFactor,instantaneousRef,reviewNameShown,reviewText,reviewedContent,tablesApproved,tablesFingerprint,temperatureFactor,validateSizingTables} from '../lib/sizing-tables';

// A táblázatok állapota a jóváhagyástól függ: szabályos jóváhagyás után is zöldnek kell maradnia.
const st=tablesApproved()?'jóváhagyott':'ellenőrizendő';

// 1. Belső összefüggések: üres hibalista.
assert.deepEqual(validateSizingTables(),[]);

// 2. PVC: oszlophossz, szigorú növekedés, A2 ≤ A1 ≤ B2 ≤ B1 ≤ C, 3 terhelt ér < 2 terhelt ér.
const pvc=SIZING_TABLES.ampacity.PVC;
for(const loaded of [2,3] as const)for(const m of INSTALL_METHODS){
 const col=pvc[loaded][m];assert.equal(col.length,8,`${loaded}/${m} hossza`);
 assert.ok(col.every((v,i)=>v>0&&(i===0||v>col[i-1])),`${loaded}/${m} szigorúan nő`);
}
for(let i=0;i<SECTIONS.length;i++){
 for(const loaded of [2,3] as const){const c=pvc[loaded];assert.ok(c.A2[i]<=c.A1[i]&&c.A1[i]<=c.B2[i]&&c.B2[i]<=c.B1[i]&&c.B1[i]<=c.C[i],`módsorrend ${loaded}/${SECTIONS[i]}`)}
 for(const m of INSTALL_METHODS)assert.ok(pvc[3][m][i]<pvc[2][m][i],`3 < 2 terhelt ér ${m}/${SECTIONS[i]}`);
}
// A hibás tábla tényleg hibát ad (az ellenőrző nem üres lista-gyár).
const broken=structuredClone(SIZING_TABLES);broken.ampacity.PVC[2].B2[3]=10;broken.grouping.factors[0]=0.9;
assert.ok(validateSizingTables(broken).length>=2);

// 3. Hőmérsékleti tényező: |k − √((70−θ)/40)| ≤ 0,006; a 30 °C-os érték 1.
SIZING_TABLES.ambient.steps.forEach((θ,i)=>assert.ok(Math.abs(SIZING_TABLES.ambient.PVC[i]-Math.sqrt((70-θ)/40))<=0.006,`kθ ${θ} °C`));
assert.equal(SIZING_TABLES.ambient.PVC[SIZING_TABLES.ambient.steps.indexOf(30)],1);

// 4. Csoportosítás: első tényező 1, nem nő.
const f=SIZING_TABLES.grouping.factors;assert.equal(f[0],1);assert.ok(f.every((v,i)=>i===0||v<=f[i-1]));

// 5. Forrásmegjelölések.
for(const [key,s] of Object.entries(SOURCES)){assert.ok(s.standard.trim(),key+' standard');assert.ok(s.item.trim(),key+' item')}

// 6. Lookupok.
assert.equal(capacity('B2','PVC',2,2.5)!.value,23);
assert.equal(capacity('C','PVC',3,6)!.value,41);
assert.equal(capacity('B2','PVC',2,3),null);
assert.equal(capacity('B2','PVC',2,0.75),null,'1,5 mm² alatt nincs táblázati érték');
const b2=capacity('B2','PVC',2,2.5)!;
assert.equal(b2.fallback,false);assert.equal(b2.ref.label,'Iz0');assert.equal(b2.ref.unit,'A');assert.equal(b2.ref.status,st);
assert.equal(b2.ref.source,'MSZ HD 60364-5-52:2011 B.52.2 · B2 · 2,5 mm² · 2 terhelt ér · PVC');
assert.equal(capacity('C','PVC',3,6)!.ref.source,'MSZ HD 60364-5-52:2011 B.52.4 · C · 6 mm² · 3 terhelt ér · PVC');
assert.equal(SIZING_TABLES.ampacity.XLPE,null,'az XLPE-tábla szándékosan nincs kitöltve');
const xlpe=capacity('B2','XLPE',2,2.5)!;
assert.equal(xlpe.value,23);assert.equal(xlpe.fallback,true);assert.ok(xlpe.ref.source.endsWith('(XLPE helyett PVC-érték)'));
const ov=capacity('B2','PVC',2,2.5,[{method:'B2',insulation:'PVC',loaded:2,section:2.5,iz:21,note:'Gyártói katalógus, 12. o.'}])!;
assert.equal(ov.value,21);assert.equal(ov.ref.status,'projekt-felülírás');assert.equal(ov.ref.source,'Projekt-felülírás: Gyártói katalógus, 12. o.');
assert.equal(capacity('B2','PVC',3,2.5,[{method:'B2',insulation:'PVC',loaded:2,section:2.5,iz:21,note:'Más terhelt érszám'}])!.value,20,'a felülírás csak pontos egyezésre érvényes');
const t33=temperatureFactor('PVC',33);assert.equal(t33.step,35);assert.equal(t33.value,0.94);assert.equal(t33.ref.label,'kθ');
assert.equal(temperatureFactor('PVC',41).value,0.79);
assert.equal(temperatureFactor('PVC',30).value,1);
assert.equal(temperatureFactor('XLPE',40).fallback,true);
// XLPE-sor hiányában: 30 °C felett a PVC-tényező (kisebb, mint az XLPE-é), 30 °C alatt 1 (a PVC 1,22 / 1,12 / 1,06 nagyobb lenne az XLPE-énél).
for(const θ of [10,15,20,25]){const x=temperatureFactor('XLPE',θ);assert.equal(x.value,1,θ+' °C');assert.equal(x.capped,true);assert.ok(x.ref.short.includes('30 °C alatt 1-re korlátozva'))}
assert.equal(temperatureFactor('XLPE',30).capped,false);assert.equal(temperatureFactor('XLPE',45).value,0.79);assert.equal(temperatureFactor('PVC',10).capped,false);
// RCBO: MSZ EN 61009-1; kismegszakító: MSZ EN 60898-1.
assert.equal(conventionalRef('RCBO').short,'MSZ EN 61009-1');assert.equal(conventionalRef('MCB').short,'MSZ EN 60898-1');assert.deepEqual(constantRef('conventionalFactor'),conventionalRef('MCB'));
assert.ok(instantaneousRef('C',SIZING_TABLES,'RCBO').source.startsWith('MSZ EN 61009-1 · C'));assert.equal(instantaneousRef('B').short,'MSZ EN 60898-1 · B');
assert.equal(constantRef('cmin').short,CLAUSES.cmin);
const g10=groupingFactor(10);assert.equal(g10.column,12);assert.equal(g10.value,0.45);assert.equal(g10.ref.label,'kcs');
assert.equal(groupingFactor(13).column,16);assert.equal(groupingFactor(17).column,20);assert.equal(groupingFactor(1).value,1);

// 7. Ujjlenyomat: 8 hexa jegy, determinisztikus; bármely számérték, forrásmegjelölés, szabványpont vagy leírás változására eltér.
const fp=tablesFingerprint();
assert.match(fp,/^[0-9a-f]{8}$/);
assert.equal(tablesFingerprint(),fp);
assert.equal(fingerprint(structuredClone(reviewedContent())),fp);
const variant=(edit:(c:ReturnType<typeof reviewedContent>)=>void)=>{const c=structuredClone(reviewedContent());edit(c);return fingerprint(c)};
assert.notEqual(variant(c=>{c.tables.ampacity.PVC[2].B2[1]=23.5}),fp,'táblázatérték');
assert.notEqual(variant(c=>{c.tables.cmin=0.95}),fp,'állandó');
assert.notEqual(variant(c=>{(c.sources.pvc3 as {item:string}).item+=' (módosítva)'}),fp,'forrásmegjelölés');
assert.notEqual(variant(c=>{(c.sources.loop as {standard:string}).standard+=':2099'}),fp,'szabványpont a forrásban');
assert.notEqual(variant(c=>{(c.clauses as {cmin:string}).cmin+='.9'}),fp,'hivatkozott szabványpont');
assert.notEqual(variant(c=>{c.methodLabels.B2+=' (módosítva)'}),fp,'szerelésimód-leírás');
assert.notEqual(variant(c=>{c.insulationLabels.PVC+=' (módosítva)'}),fp,'szigetelésleírás');
// Független (Pythonban számolt) FNV-1a referenciaértékek a JSON-szöveg kódpontjain.
assert.equal(fingerprint('a'),'61a1cfea');
assert.equal(fingerprint({x:'ő'}),'cf000a74');

// 8. Jóváhagyás: csak kitöltött, az aktuális ujjlenyomathoz kötött blokk érvényes. A program magától nem jóváhagyott.
assert.equal(typeof SIZING_REVIEW.showName,'boolean','a név megjelenítéséről kifejezetten dönteni kell (alapértelmezés: false)');
// Adatvédelem: a lib/sizing-tables.ts a kliensoldali kódba (tervező, nyilvános kalkulátoroldalak) is bekerül, ezért a jóváhagyó neve és
// névjegyzéki száma csak a megjelenítéshez adott hozzájárulással (showName: true) szerepelhet benne; különben a név csak az aláírt lapon van.
if(SIZING_REVIEW.showName)assert.ok(SIZING_REVIEW.reviewer.trim()&&SIZING_REVIEW.registry.trim(),'hozzájárulással a név és a névjegyzéki szám kitöltött');
else assert.ok(!SIZING_REVIEW.reviewer.trim()&&!SIZING_REVIEW.registry.trim(),'hozzájárulás (showName: true) nélkül a jóváhagyó neve és névjegyzéki száma nem szerepelhet a lib/sizing-tables.ts-ben');
if(SIZING_REVIEW.status==='jóváhagyott'){
 assert.ok(SIZING_REVIEW.qualification.trim()&&SIZING_REVIEW.date.trim()&&SIZING_REVIEW.approvalRef.trim(),'a jogosultság, a dátum és a jóváhagyás hivatkozása kötelező');
 assert.equal(SIZING_REVIEW.fingerprint,tablesFingerprint(),'a jóváhagyás óta megváltozott egy táblázatérték, forrásmegjelölés vagy leírás: új jóváhagyás kell');
 assert.ok(tablesApproved());
 assert.ok(reviewText().startsWith(reviewNameShown(SIZING_REVIEW)?REVIEW_TEXTS.named.split('{')[0]:REVIEW_TEXTS.anonymous.split('{')[0]));
}else{
 assert.equal(SIZING_REVIEW.status,'ellenőrizendő');
 assert.equal(SIZING_REVIEW.showName,false,'jóváhagyás nélkül nincs megjeleníthető név');
 assert.equal(tablesApproved(),false);
 assert.ok(reviewText().startsWith('Ellenőrizendő: a táblázatértékeket jogosult villamos tervező még nem hagyta jóvá.'));
 assert.ok(reviewText().includes(SIZING_TABLES.version)&&reviewText().includes(fp));
}
// A jóváhagyás érvénye nem függ a név megjelenítésétől; a név csak kifejezett hozzájárulással (showName: true) jelenik meg, a név
// nélküli változat a jóváhagyó lapon megadott jogosultságot írja ki (tervező és érintésvédelmi szabványossági felülvizsgáló is lehet).
const approved={...SIZING_REVIEW,status:'jóváhagyott' as const,qualification:'érintésvédelmi szabványossági felülvizsgáló',date:'2026-10-10',fingerprint:fp,approvalRef:'Lektori csomag LK-9',showName:false,reviewer:'',registry:''};
const named={...approved,showName:true,reviewer:'Minta Tervező',registry:'V-123'};
assert.equal(tablesApproved(approved),true);assert.equal(tablesApproved(named),true);
const tail=' Táblázatváltozat: '+SIZING_TABLES.version+', ujjlenyomat: '+fp+'.';
assert.equal(reviewText(named),'A táblázatértékeket szakmailag lektorálta: Minta Tervező, érintésvédelmi szabványossági felülvizsgáló (V-123), 2026-10-10.'+tail);
assert.equal(reviewText(approved),'A táblázatértékeket szakmailag lektorálta: érintésvédelmi szabványossági felülvizsgáló, 2026-10-10.'+tail);
assert.ok(!/tervező/.test(reviewText(approved)),'a név nélküli változat nem állít a jóváhagyó lapon megadottól eltérő jogosultságot');
assert.equal(reviewText({...approved,reviewer:'Minta Tervező',registry:'V-123'}),reviewText(approved),'hozzájárulás nélkül a (hibásan kitöltött) név sem jelenik meg');
assert.equal(reviewText({...named,registry:''}),reviewText(approved),'hiányos név-adattal a név nélküli változat');
assert.ok(reviewText({...named,fingerprint:'00000000'}).startsWith('Ellenőrizendő:')&&!reviewText({...named,fingerprint:'00000000'}).includes('Minta'),'érvénytelen jóváhagyásnál a név akkor sem jelenik meg');
assert.ok(!/Jóváhagyta/.test(reviewText(named)+reviewText(approved)),'a szöveg a lektorálást jelzi, nem a terv jóváhagyását');
assert.equal(tablesApproved({...approved,fingerprint:'00000000'}),false,'más ujjlenyomatra adott jóváhagyás érvénytelen');
assert.equal(tablesApproved({...approved,qualification:' '}),false);
assert.equal(tablesApproved({...approved,approvalRef:''}),false,'hivatkozás (csomagkiadás, iktatás) nélkül érvénytelen');
assert.equal(tablesApproved({...approved,date:''}),false);
// A felirat-sablonok nem részei a táblázat-ujjlenyomatnak (reviewedContent), de a lektor ezekhez járul hozzá (lektori csomag):
// változásuk után a név csak új hozzájárulással jelenhet meg (docs/lektoralas.md). A rögzített szöveg ezt tudatos lépéssé teszi.
assert.deepEqual(REVIEW_TEXTS,{
 pending:'Ellenőrizendő: a táblázatértékeket jogosult villamos tervező még nem hagyta jóvá.',
 named:'A táblázatértékeket szakmailag lektorálta: {reviewer}, {qualification} ({registry}), {date}.',
 anonymous:'A táblázatértékeket szakmailag lektorálta: {qualification}, {date}.',
 tail:'Táblázatváltozat: {version}, ujjlenyomat: {fingerprint}.',
},'a jóváhagyás megjelenő szövege megváltozott: a lektori csomag új kiadása és – név megjelenítésénél – a lektor új hozzájárulása kell');
assert.ok(!JSON.stringify(reviewedContent()).includes('lektorálta'),'a sablonok nem részei a jóváhagyandó tartalomnak');

console.log('PASS: sizing tables – relations, temperature formula, grouping, sources, lookups with XLPE fallback and overrides, fingerprint and review gate.');
