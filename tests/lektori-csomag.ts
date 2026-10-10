// Lektori csomag: elavulás- és tartalomteszt.
// Futtatás: node --no-warnings --import tsx tests/lektori-csomag.ts   (a repó gyökeréből)
// Ha elbukik, mert a docs/ fájlok elavultak: node --import tsx scripts/lektori-csomag.ts (folyamat: docs/lektoralas.md).
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {CLAUSES,INSTALL_METHODS,INSULATIONS,SIZING_REVIEW,SIZING_TABLES,SOURCES,fingerprint,groupingFactor,insulationLabels,methodLabels,reviewText,reviewedContent,tablesApproved,tablesFingerprint,temperatureFactor} from '../lib/sizing-tables';
import {SIZING_NOT_COVERED,atMost,checkStatusLabels,circuitSizing,correctedIz,designCurrent,loopResistance,maxLengthForDrop,maxLoopImpedance,minSectionFor,parseCable,statusLabels,voltageDropPercent,type CircuitSizingResult} from '../lib/sizing';
import {circuitSizingSchema,planSizingSchema} from '../lib/sizing-schema';
import {seed,validatePlan} from '../lib/plan';
import {EDITION,EDITIONS,ID_PREFIXES,ID_REF,PARTS,PATHS,PDF_PLACEHOLDERS,allIds,allItems,buildPackage,checkOutputs,contentFingerprint,declaration,editionLabel,editionProblems,eol,exact,leafPaths,notCoveredFrom,packageProblems,packageTexts,pdfText,readFont,render,verifiedText,type Expect,type Package,type ProgramCheck,type RuleItem,type Scenario} from '../scripts/lektori-csomag';

const pkg=buildPackage(),font=readFont(),out=render(pkg,font),md=out.md;
const T=SIZING_TABLES;

// (a) A generált fájlok naprakészek, és a kiadás (EDITIONS utolsó bejegyzése) a tartalomhoz tartozik.
assert.deepEqual(checkOutputs(pkg,font),[],'A lektori csomag elavult – futtasd: node --import tsx scripts/lektori-csomag.ts');
assert.equal(EDITION,EDITIONS[EDITIONS.length-1]);
assert.equal(EDITION.content,pkg.fingerprints.content,'tartalmi változásnál új kiadás kell (EDITIONS)');
assert.deepEqual(editionProblems(pkg,null),[],'az EDITIONS előzménylista érvényes');
// A kiadott (commitolt) kiadás tartalma nem írható át, és a kiadásszám nem mehet vissza.
assert.ok(editionProblems(pkg,{number:EDITION.number,content:'deadbeef'}).some(p=>p.includes('nem írható át')));
assert.ok(editionProblems(pkg,{number:EDITION.number+1,content:'deadbeef'}).some(p=>p.includes('nem mehet vissza')));
assert.deepEqual(editionProblems(pkg,{number:EDITION.number,content:EDITION.content}),[]);
assert.ok(editionProblems(pkg,null,[...EDITIONS.slice(0,-1),{...EDITION,number:EDITION.number+1}]).some(p=>p.includes('egyesével')));
assert.ok(editionProblems(pkg,null,[...EDITIONS,{...EDITION,number:EDITION.number+1}]).some(p=>p.includes('korábbi kiadásé')));
// A --check mód a parancssorból is zöld, és nem ír.
const cli=execFileSync(process.execPath,['--import','tsx','scripts/lektori-csomag.ts','--check'],{encoding:'utf8'});
assert.ok(cli.includes('naprakész')&&cli.includes(pkg.fingerprints.tables),cli);
// Az elavulást észleli: más tartalomból más Markdown és más PDF készül, és új kiadás kell.
const changed=structuredClone(pkg) as Package;
const firstValue=allItems(changed).find(i=>i.kind==='value')!;if(firstValue.kind==='value')firstValue.value+=' (módosítva)';
assert.ok(checkOutputs(changed,font).some(p=>p.includes('lektori-csomag.md elavult')));
assert.notEqual(contentFingerprint(changed.parts),pkg.fingerprints.content,'tartalmi változás → új csomag-ujjlenyomat');
assert.ok(editionProblems({...changed,fingerprints:{...changed.fingerprints,content:contentFingerprint(changed.parts)}},null).some(p=>p.includes('megváltozott')));
assert.equal(contentFingerprint(pkg.parts),pkg.fingerprints.content);
// A csomag-ujjlenyomat a tételeken kívül a mátrixokat, a bevezetőt és a jóváhagyó lap szövegét is fedi.
const matrixChanged=structuredClone(pkg) as Package;
matrixChanged.parts[0].blocks.find(b=>b.matrix)!.matrix!.rows[0].cells[0]='999';
assert.notEqual(contentFingerprint(matrixChanged.parts),pkg.fingerprints.content,'mátrix → csomag-ujjlenyomat');
const texts=packageTexts();
assert.notEqual(contentFingerprint(pkg.parts,{...texts,approval:{...texts.approval,declaration:texts.approval.declaration.replace('nem terjed ki a csomag 3–6. részére','kiterjed a csomag 3–6. részére is')}}),pkg.fingerprints.content,'nyilatkozat → csomag-ujjlenyomat');
assert.notEqual(contentFingerprint(pkg.parts,{...texts,intro:texts.intro.slice(1)}),pkg.fingerprints.content,'bevezető → csomag-ujjlenyomat');
// CRLF-es klónban sem jelez hamisan elavultat.
assert.equal(eol(md.replace(/\n/g,'\r\n')),md);

// (b) Minden SIZING_TABLES-érték, forrásmegjelölés, szabványpont és leírás szerepel a csomagban a saját azonosítójával, kerekítés nélkül.
const rows=new Map<string,string>();
for(const line of md.split('\n'))if(line.includes('| ☐ | ☐ |')){const id=line.split(' | ')[0].slice(2);assert.ok(!rows.has(id),'ismétlődő tételsor: '+id);rows.set(id,line)}
const row=(id:string)=>{const r=rows.get(id);assert.ok(r,'hiányzó tétel: '+id);return r};
const has=(id:string,text:string)=>assert.ok(row(id).includes(text),`${id}: a sor nem tartalmazza: ${text}\n${rows.get(id)}`);
const num=(n:number)=>n.toLocaleString('hu-HU',{maximumFractionDigits:10,useGrouping:false});
has('T-KM-SOR',T.sections.map(num).join('; ')+' mm²');
for(const ins of INSULATIONS){
 const table=T.ampacity[ins];
 if(!table){assert.equal(ins,'XLPE');row('T-XLPE-IZ0');continue}
 for(const loaded of [2,3] as const)for(const m of INSTALL_METHODS)T.sections.forEach((s,i)=>has(`T-${ins}${loaded}-${m}-${s}`,`| ${m} · ${num(s)} mm² | ${num(table[loaded][m][i])} A |`));
}
T.ambient.steps.forEach((θ,i)=>has(`T-KT-${θ}`,`| PVC · ${θ} °C | ${num(T.ambient.PVC[i])} |`));
if(T.ambient.XLPE)T.ambient.steps.forEach((θ,i)=>has(`T-KT-XLPE-${θ}`,`| ${num(T.ambient.XLPE![i])} |`));else row('T-XLPE-KT');
T.grouping.counts.forEach((n,i)=>has(`T-KCS-${n}`,`| ${n} áramkör | ${num(T.grouping.factors[i])} |`));
const du={public:'KOZ',private:'SAJ'} as const,use={lighting:'VIL',other:'EGY'} as const;
for(const s of ['public','private'] as const)for(const u of ['lighting','other'] as const)has(`T-DU-${du[s]}-${use[u]}`,`| ${num(T.dropLimits[s][u])}% |`);
has('T-K-U0',`| ${num(T.u0)} V |`);has('T-K-RHO1',`| ${num(T.rho1)} Ω·mm²/m |`);has('T-K-LAMBDA',`| ${num(T.lambda)} Ω/m`);has('T-K-CMIN',`| ${num(T.cmin)} |`);
has('T-K-AMIN',`| ${num(T.minSection)} mm² |`);has('T-K-I2',`| ${num(T.conventionalFactor)} |`);has('T-K-I2','két szerepben');
for(const c of ['B','C','D'] as const)has('T-K-M-'+c,`| ${num(T.instantaneous[c])} · In |`);
for(const [key,s] of Object.entries(SOURCES))has('F-'+key.toUpperCase(),`| ${s.standard} | ${s.item} |`);
for(const [key,c] of Object.entries(CLAUSES))has('SZP-'+key.toUpperCase(),`| ${c} |`);
for(const m of INSTALL_METHODS)has('L-MOD-'+m,`| ${m} | ${methodLabels[m]} |`);
for(const i of INSULATIONS)has('L-SZIG-'+i,`| ${i} | ${insulationLabels[i]} |`);
// A táblázatértékek kiírása pontos: több tizedesjegyű érték sem kerekedik, a pontatlan kiírás megállítja a generátort.
assert.equal(exact(0.0000825),'0,0000825');assert.equal(exact(1.45),'1,45');assert.throws(()=>exact(1/3),/pontosan/);
// Általános lefedettség: a jóváhagyandó tartalom (reviewedContent) minden levele egy tételhez tartozik.
assert.deepEqual(packageProblems(pkg,reviewedContent()),[]);
assert.ok(leafPaths(reviewedContent()).length>=180,'a levelek bejárása működik');
assert.ok(packageProblems(pkg,{...reviewedContent(),tables:{...T,newConstant:1}}).includes('A csomag nem tartalmazza: tables.newConstant'));

// (c) Az azonosítók egyediek, ismert előtagúak, és a szövegek csak létező azonosítóra hivatkoznak.
const ids=allIds(pkg);
assert.equal(new Set(ids).size,ids.length,'ismétlődő azonosító: '+ids.filter((x,i)=>ids.indexOf(x)!==i).join(', '));
for(const id of ids){assert.ok(ID_PREFIXES.some(p=>id===p||id.startsWith(p+'-')),'ismeretlen előtag: '+id);if(id.includes('-'))assert.deepEqual(id.match(ID_REF),[id],'az azonosító hivatkozásként felismerhető: '+id)}
assert.deepEqual([...rows.keys()].sort(),allItems(pkg).map(i=>i.id).sort(),'minden tételnek pontosan egy kitölthető sora van');
assert.ok(packageProblems({...pkg,parts:[...pkg.parts,{no:9,title:'próba',intro:[],blocks:[{id:'X',title:'x',source:'',intro:[],minutes:0,items:[{kind:'rule',id:'D-PROBA',title:'p',rule:'lásd D-NINCS',rationale:'',example:'',source:'',checks:[]}]}]}]},reviewedContent()).some(p=>p.includes('D-NINCS')));

// (d) A csomag ujjlenyomata egyezik a programéval (tablesFingerprint / reviewedContent).
assert.equal(pkg.fingerprints.tables,tablesFingerprint());
assert.equal(pkg.fingerprints.tables,fingerprint(reviewedContent()));
assert.ok(md.includes(`| 1. rész – táblázat-ujjlenyomat | ${tablesFingerprint()} `),'a fejléc a táblázat-ujjlenyomatot mutatja');
assert.ok(md.includes(`1. rész: ${tablesFingerprint()}; 2. rész: ${pkg.fingerprints.formulas}`),'a jóváhagyó lap az ujjlenyomatokat mutatja');
assert.ok(md.includes(`| Táblázatváltozat | ${T.version} |`));
assert.ok(md.includes(`| Csomagverzió | ${editionLabel()} |`));

// (e) A PDF legenerálható, determinisztikus, ésszerű terjedelmű, és minden kiírt karakter szerepel a betűkészletben.
assert.ok(out.pdf.length>20000,'PDF mérete: '+out.pdf.length);
assert.ok(out.pages>=12&&out.pages<=45,'PDF oldalszáma: '+out.pages);
assert.ok(out.pdf.equals(render(pkg,font).pdf),'a PDF determinisztikus');
assert.ok(out.pdf.subarray(0,5).toString()==='%PDF-');
assert.ok(md.includes(declaration(out.pages))&&declaration(out.pages).includes(`${out.pages} oldalas`),'a nyilatkozat a PDF oldalszámát rögzíti');
/** A TrueType-betűkészlet cmap-táblájában szereplő kódpontok (4-es és 12-es formátum). */
function cmapOf(buf:Buffer):Set<number>{
 const tables=buf.readUInt16BE(4);let off=-1;
 for(let i=0;i<tables;i++){const r=12+i*16;if(buf.toString('latin1',r,r+4)==='cmap')off=buf.readUInt32BE(r+8)}
 assert.ok(off>=0,'nincs cmap-tábla');
 const set=new Set<number>();
 for(let i=0,n=buf.readUInt16BE(off+2);i<n;i++){
  const so=off+buf.readUInt32BE(off+4+i*8+4),format=buf.readUInt16BE(so);
  if(format===4){
   const seg=buf.readUInt16BE(so+6)/2,ends=so+14,starts=ends+seg*2+2,deltas=starts+seg*2,ranges=deltas+seg*2;
   for(let s=0;s<seg;s++){
    const end=buf.readUInt16BE(ends+s*2),start=buf.readUInt16BE(starts+s*2),delta=buf.readInt16BE(deltas+s*2),ro=buf.readUInt16BE(ranges+s*2);
    for(let c=start;c<=end&&c!==0xffff;c++){let g=ro===0?(c+delta)&0xffff:buf.readUInt16BE(ranges+s*2+ro+(c-start)*2);if(ro!==0&&g)g=(g+delta)&0xffff;if(g)set.add(c)}
   }
  }else if(format===12){for(let g=0,n12=buf.readUInt32BE(so+12);g<n12;g++){const b=so+16+g*12;for(let c=buf.readUInt32BE(b);c<=buf.readUInt32BE(b+4);c++)set.add(c)}}
 }
 return set;
}
const glyphs=cmapOf(readFileSync(PATHS.font));
assert.ok(glyphs.has(0x151)&&glyphs.has(0x171)&&!glyphs.has(0x2264),'a cmap-olvasó működik (ő, ű van; ≤ nincs)');
const missing=[...new Set(out.texts.join(''))].filter(ch=>ch.codePointAt(0)!>32&&!glyphs.has(ch.codePointAt(0)!));
assert.deepEqual(missing,[],'a PDF-be kiírt, a NotoSans-ból hiányzó karakterek: '+missing.join(' '));
for(const ph of PDF_PLACEHOLDERS)assert.ok(glyphs.has(ph.codePointAt(0)!),'a helyőrző betű szerepel a betűkészletben: '+ph);
assert.ok(!/[Ѐ-ӿ]/u.test(md),'a csomag szövege nem tartalmaz cirill betűt (a PDF helyőrzői)');
assert.ok(!out.texts.some(t=>/<=|>=|gyök/.test(t)),'a ≤ ≥ √ jeleket a PDF kirajzolja, nem helyettesíti');
assert.equal(pdfText('Ib ≤ In ≈ √3 → ✓'),'Ib <= In ~ gyök 3 -> pipa');

// (f) A 2. rész példái és döntései a program függvényeivel és a mintaterv számításával ugyanazt adják.
const near=(a:number,b:number)=>Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(b));
/** A mintaterv (lib/plan seed) egy áramköre a forgatókönyv módosításaival, a lib/sizing circuitSizing() számításával. */
function scenario(s:Scenario):CircuitSizingResult{
 const p=structuredClone(seed),c=p.circuits.find(x=>x.id===s.circuit);
 assert.ok(c,'nincs ilyen áramkör a mintatervben: '+s.circuit);
 if(s.set)Object.assign(c,s.set);
 const routes=p.buildings.flatMap(b=>b.floors.flatMap(f=>f.routes.filter(r=>r.circuit===c.id).map(r=>({r,f}))));
 if(s.routeCable!==undefined)for(const {r} of routes)r.cable=s.routeCable;
 if(s.extraRoute!==undefined){assert.ok(routes.length,'az áramkörnek nincs nyomvonala');const {r,f}=routes[0];f.routes.push({...structuredClone(r),id:'lk-extra',name:'Kiegészítő szakasz',cable:s.extraRoute})}
 if(s.sizing)c.sizing={...s.sizing};
 if(s.plan||s.board)p.sizing={...(p.sizing??{}),...(s.plan??{}),...(s.board?{boards:[{building:c.building,board:c.board??'',...s.board}]}:{})};
 if(s.module!==undefined){const m=p.modules.find(x=>x.circuit===c.id&&(x.type==='MCB'||x.type==='RCBO'));assert.ok(m,'nincs védelmi modul');if(s.module===null)p.modules=p.modules.filter(x=>x!==m);else m.type=s.module}
 if(s.noDevices)for(const d of p.buildings.flatMap(b=>b.floors.flatMap(f=>f.devices)))if(d.circuit===c.id)d.circuit='';
 const r=circuitSizing(validatePlan(p),c.id);assert.ok(r);return r;
}
function scenarioErrors(s:Scenario,expect:Expect):string[]{
 const r=scenario(s),errors:string[]=[];
 for(const [key,want] of Object.entries(expect)){
  const colon=key.indexOf(':'),kind=colon<0?key:key.slice(0,colon),arg=colon<0?'':key.slice(colon+1);
  let got:unknown,ok:boolean;
  if(kind==='check'){got=r.checks.find(c=>c.code===arg)?.status;ok=got===want}
  else if(kind==='detail'||kind==='clause'){const c=r.checks.find(c=>c.code===arg);got=kind==='detail'?c?.detail:c?.clause;ok=typeof got==='string'&&got.includes(String(want))}
  else if(kind==='ref'){got=r.refs.find(x=>x.label===arg)?.status;ok=got===want}
  else if(kind==='assumes'||kind==='assumesStrong'){got=r.assumptions.map(a=>(a.strong?'[kiemelt] ':'')+a.text);ok=r.assumptions.some(a=>(kind==='assumes'||a.strong)&&a.text.includes(String(want)))}
  else{got=key.split('.').reduce<unknown>((o,k)=>o===null||o===undefined?o:(o as Record<string,unknown>)[k],r);ok=typeof want==='number'&&typeof got==='number'?near(got,want):got===want}
  if(!ok)errors.push(`${key}: várt ${JSON.stringify(want)}, kapott ${JSON.stringify(got)}`);
 }
 return errors;
}
function schemaOk(scope:'circuit'|'plan'|'board'|'override',field:string,value:unknown):boolean{
 switch(scope){
  case 'circuit':return circuitSizingSchema.safeParse({[field]:value}).success;
  case 'plan':return planSizingSchema.safeParse({[field]:value}).success;
  case 'board':return planSizingSchema.safeParse({boards:[{building:'b',board:'',[field]:value}]}).success;
  case 'override':return planSizingSchema.safeParse({overrides:[{method:'B2',insulation:'PVC',loaded:2,section:2.5,iz:30,note:'adatlap',[field]:value}]}).success;
 }
}
function run(c:ProgramCheck):string[]{
 const bool=(ok:boolean)=>ok?[]:['eltér'];
 switch(c.fn){
  case 'designCurrent':return bool(near(designCurrent(...c.args),c.expect));
  case 'correctedIz':return bool(near(correctedIz(...c.args),c.expect));
  case 'voltageDropPercent':return bool(near(voltageDropPercent(...c.args),c.expect));
  case 'loopResistance':return bool(near(loopResistance(...c.args),c.expect));
  case 'maxLoopImpedance':return bool(near(maxLoopImpedance(...c.args),c.expect));
  case 'maxLengthForDrop':return bool(near(maxLengthForDrop(...c.args),c.expect));
  case 'minSectionFor':{const [In,m,ins,loaded,kt,kg,ovr]=c.args;return bool(minSectionFor(In,m,ins,loaded,kt,kg,ovr)===c.expect)}
  case 'atMost':return bool(atMost(...c.args)===c.expect);
  case 'temperatureFactor':return bool(temperatureFactor(...c.args).value===c.expect);
  case 'groupingFactor':return bool(groupingFactor(...c.args).value===c.expect);
  case 'parseCable':{const r=parseCable(c.args[0]),e=c.expect;return bool(e.ok?r.ok&&r.cable.section===e.section&&r.cable.insulation===e.insulation:!r.ok&&r.code===e.code)}
  case 'circuitSizing':return scenarioErrors(c.args[0],c.expect);
  case 'schema':return bool(schemaOk(...c.args)===c.expect);
  case 'notCovered':return bool(JSON.stringify(SIZING_NOT_COVERED)===JSON.stringify(c.expect));
  case 'labels':{const e=c.expect;return bool(statusLabels.ok===e.ok&&statusLabels.warn===e.warn&&statusLabels.fail===e.fail&&statusLabels.na===e.na&&checkStatusLabels.ok===e.checkOk&&checkStatusLabels.skipped===e.skipped)}
 }
}
const items=allItems(pkg),checks=items.flatMap(i=>(i.kind==='rule'?i.checks:i.checks??[]).map(c=>({id:i.id,c})));
for(const {id,c} of checks){const e=run(c);assert.deepEqual(e,[],`${id}: a példa nem egyezik a programmal (${c.fn} ${JSON.stringify(c.args)} → várt ${JSON.stringify(c.expect)}): ${e.join('; ')}`)}
assert.ok(checks.length>=150,'programmal összevetett esetek száma: '+checks.length);
// A forgatókönyv-ellenőrzés tényleg jelez (rossz elvárásra hibát ad).
assert.ok(scenarioErrors({circuit:'c1'},{status:'fail'}).length===1&&scenarioErrors({circuit:'c1',routeCable:'3 × 3 mm²'},{status:'na'}).length===1);
const rules=items.filter((i):i is RuleItem=>i.kind==='rule');
for(const r of rules){assert.ok(r.rule&&r.rationale&&r.example&&r.source,r.id+': hiányos tétel');assert.ok(r.checks.length,r.id+': nincs a programmal összevetett eset');assert.ok(md.includes(`**Összevetés.** ${verifiedText(r.checks)}`),r.id+': hiányzik az összevetés jelölése')}
for(const i of items.filter(i=>i.id.startsWith('D-JEL-')))assert.ok(i.kind==='value'&&i.checks?.length,i.id+': a kulcsszó-besorolás nincs a programmal összevetve');
assert.equal(verifiedText([]),'Programmal összevetve: nem – a tételt csak ez a leírás rögzíti.');
// A tételek a megkövetelt képleteket és döntéseket lefedik.
for(const id of ['K-IB','K-IZ','K-TUL','K-I2','K-DU1','K-DU3','K-ZS','D-ALAP-MOD','D-ALAP-SZIG','D-ALAP-TEMP','D-ALAP-CSOP','D-ALAP-COS','D-KEREK','D-XLPE','D-BLOKK','D-TURES','D-FELULIR','D-ALLAPOT','D-HATOKOR'])assert.ok(rules.some(r=>r.id===id),'hiányzó tétel: '+id);
// A D-BLOKK a helyettesítést a program szerint írja le: a nem szabványos keresztmetszet nem tiltja.
const blokk=rules.find(r=>r.id==='D-BLOKK')!;
assert.ok(blokk.rule.includes('nem szabványos keresztmetszet (pl. 3 mm²)')&&blokk.rule.includes('a másik forrás értelmezhető kábelével számol'));
// A szövegek nem állítanak a programnál szigorúbb vagy tágabb szabályt (a bírálatban talált hibák).
assert.ok(!/30 mA-es ÁVK/.test(md)&&!/hagyományos kioldó/.test(md)&&!/kombinált védelemnél \(RCBO\)/.test(md));
assert.ok(rules.find(r=>r.id==='K-ZS')!.rationale.includes('Zs · Ia ≤ U0,')&&!md.includes('Zs · Ia ≤ U0 · cmin'));
assert.ok(rules.find(r=>r.id==='K-ZS')!.question?.includes('Cmin = 0,95')&&md.includes('Kérdés a lektorhoz (T-K-CMIN)'));

// (g) Jóváhagyás: a SIZING_REVIEW csak aláírt lektori jóváhagyás után „jóváhagyott”; ekkor a megjegyzés pontosan egy, létező
// csomagkiadást (LK-n) nevez meg annak csomag-ujjlenyomatával, és a 2. rész jelenlegi ujjlenyomatát rögzíti.
const approvedEditions=(note:string)=>[...note.matchAll(/(?<![\p{L}\d])LK-(\d+)(?![\p{L}\d])/gu)].map(m=>Number(m[1]));
assert.deepEqual(approvedEditions('Lektori csomag LK-12 (2026. 10. 10.)'),[12]);assert.deepEqual(approvedEditions('LK-1, LK-1x'),[1]);assert.deepEqual(approvedEditions('XLK-1 LK-10'),[10]);
if(SIZING_REVIEW.status==='jóváhagyott'){
 assert.equal(SIZING_REVIEW.fingerprint,pkg.fingerprints.tables);
 const named=approvedEditions(SIZING_REVIEW.note);
 assert.equal(named.length,1,'a SIZING_REVIEW.note pontosan egy csomagkiadást (LK-n) nevezzen meg');
 const approved=EDITIONS.find(e=>e.number===named[0]);
 assert.ok(approved,`a SIZING_REVIEW.note-ban szereplő LK-${named[0]} nincs az EDITIONS-ben`);
 assert.ok(SIZING_REVIEW.note.includes(approved.content),`a SIZING_REVIEW.note-ban szerepeljen az LK-${approved.number} csomag-ujjlenyomata (${approved.content})`);
 assert.ok(SIZING_REVIEW.note.includes(pkg.fingerprints.formulas),'a 2. rész (képletek) a jóváhagyás óta megváltozott, vagy az ujjlenyomata hiányzik a SIZING_REVIEW.note-ból: új jóváhagyás kell');
 assert.ok(tablesApproved()&&md.includes('| Jóváhagyási állapot | jóváhagyott – '));
}else{
 assert.equal(tablesApproved(),false);
 assert.ok(md.includes('| Jóváhagyási állapot | ellenőrizendő – jogosult tervező még nem hagyta jóvá |'));
}

// (h) Szerkezet: helyőrzők, jóváhagyó lap, szóhasználat, a név megjelenésének leírása.
assert.deepEqual(pkg.parts.map(p=>p.no),[1,2,3,4,5,6]);assert.equal(PARTS.length,6);
for(const p of pkg.parts.filter(p=>p.no>=3))assert.ok(p.placeholder&&!p.blocks.length,p.no+'. rész helyőrző');
assert.ok(md.toLowerCase().includes('a kalkulátorok elkészülte után kerül be'));
for(const t of ['## Jóváhagyó lap','### Döntés és aláírás','Jóváhagyó neve','Kamarai / névjegyzéki szám','Jogosultság megnevezése','| Hely |','| Dátum |','| Aláírás |','### Teendő eltérés esetén','Mit jelent a jóváhagyás – és mit nem?','### Becsült ráfordítás','### Hogyan kell kitölteni?','a többi, pipálatlanul hagyott tétel egyezőnek számít','Megjegyzés a blokkhoz (forrás, kiadás)','külön mellékletben'])assert.ok(md.includes(t),'hiányzik: '+t);
assert.ok(!/szakmailag ellenőrzött|MSZ szerint megfelel|megfelel a szabványnak|szabványos méretezés/i.test(md),'tiltott kifejezés');
// A név megjelenése a program pontos szövegével és helyeivel van leírva.
const shown=reviewText({status:'jóváhagyott',reviewer:'[név]',registry:'[névjegyzéki szám]',date:'[dátum]',fingerprint:tablesFingerprint(),note:''});
assert.ok(md.split(shown).length>=3,'a jóváhagyási szöveg a bevezetőben és a hozzájárulásban is szerepel');
assert.ok(md.includes('„Táblázatok – Állapot” sorában')&&md.includes('Tervezői ellenőrzés'));
// A 2. rész kötése pontosan van leírva (a program csak az 1. részt köti ujjlenyomathoz).
assert.ok(md.includes('A 2. rész (képletek, döntések) jóváhagyását a program állapota nem követi.'));
// A „Mit nem vizsgál” lista a program listája (SIZING_NOT_COVERED), szó szerint.
assert.deepEqual(pkg.notCovered,SIZING_NOT_COVERED);
assert.ok(rules.find(r=>r.id==='D-HATOKOR')!.rule.includes(SIZING_NOT_COVERED.join('; ')));
const docList=notCoveredFrom(readFileSync(PATHS.sizingDoc,'utf8'));
if(JSON.stringify(docList)!==JSON.stringify(SIZING_NOT_COVERED))console.warn(`Figyelem: a ${PATHS.sizingDoc} „Mit nem vizsgál” listája eltér a program SIZING_NOT_COVERED listájától (a csomag a programét mutatja). Eltérő tételek: ${[...SIZING_NOT_COVERED.filter(x=>!docList.includes(x)),...docList.filter(x=>!SIZING_NOT_COVERED.includes(x))].map(x=>'„'+x+'”').join(', ')}.`);
assert.throws(()=>notCoveredFrom('# Üres'),/Mit nem vizsgál/);

const counts=pkg.parts.map(p=>p.blocks.reduce((s,b)=>s+b.items.length,0));
console.log(`PASS: lektori csomag – ${editionLabel()}, ${counts[0]+counts[1]} tétel (1. rész ${counts[0]}, 2. rész ${counts[1]}), ${checks.length} programmal összevetett eset, ${out.pages} PDF-oldal; naprakész, ujjlenyomat ${pkg.fingerprints.tables}.`);
