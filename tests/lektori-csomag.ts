// Lektori csomag: elavulás- és tartalomteszt.
// Futtatás: node --no-warnings --import tsx tests/lektori-csomag.ts   (a repó gyökeréből)
// Ha elbukik, mert a docs/ fájlok elavultak: node --import tsx scripts/lektori-csomag.ts (folyamat: docs/lektoralas.md).
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync} from 'node:fs';
import {CLAUSES,INSTALL_METHODS,INSULATIONS,SIZING_REVIEW,SIZING_TABLES,SOURCES,fingerprint,groupingFactor,insulationLabels,methodLabels,reviewText,reviewedContent,tablesApproved,tablesFingerprint,temperatureFactor,type SizingReview} from '../lib/sizing-tables';
import {SIZING_NOT_COVERED,atMost,checkStatusLabels,circuitSizing,correctedIz,designCurrent,loopResistance,maxLengthForDrop,maxLoopImpedance,minSectionFor,parseCable,statusLabels,voltageDropPercent,type CircuitSizingResult} from '../lib/sizing';
import {circuitSizingSchema,planSizingSchema} from '../lib/sizing-schema';
import {seed,validatePlan} from '../lib/plan';
import {mainResults,parseInputs,runCalc,type Raw} from '../lib/calc/core';
import {CALCULATORS,bySlug,calcFingerprint} from '../lib/calc/registry';
import {T1_SLUGS,TABLE_GATED,type ExpertReview} from '../lib/calc/release';
import {sourceFingerprint} from '../scripts/calc-source';
import {DIAGRAM_ORDER,EDITION,EDITIONS,ID_PREFIXES,articleDiagrams,bekId,calcBadgeTexts,cssColor,diagramPairs,diagramRefProblems,ID_REF,NAME_PLACES,PARTS,PATHS,PDF_PLACEHOLDERS,T1_ORDER,allIds,allItems,approvedFingerprints,approvedTexts,assumptionsText,buildPackage,pdfDiagramStyles,pdfInline,calcPairs,checkOutputs,committedEditions,contentFingerprint,declaration,editionLabel,editionProblems,eol,exact,formulasText,kalId,leafPaths,notCoveredFrom,packageProblems,packageTexts,parseEditions,partFingerprint,pdfText,r3Questions,r3QuestionSections,INTERNAL_NOTES,questionProblems,ARTICLES_FROM,PDF_MIN_LABEL_PT,articlePairs,articleRefProblems,figureRef,pdfProblems,renderPdf,readFont,releaseRefProblems,render,reviewRefProblems,selectCombos,verifiedText,type CalcExpect,type CommittedEdition,type Edition,type Expect,type Package,type ProgramCheck,type RuleItem,type Scenario} from '../scripts/lektori-csomag';
import {loadNetlist,netlistFingerprint,runNetlist,wireTable,type Netlist} from '../lib/kb/circuit';
import {diagramSource,netlistFiles} from '../scripts/kb-content/diagrams';
import type {KbRelease} from '../lib/kb/release';
import {CIRCUIT_RULES} from '../lib/kb/circuit-rules';
import {articleFromDraft} from '../scripts/kb-content/generate';
import {BLOCKED,articleId,flatten,r3Articles} from '../scripts/lektori-csomag-cikkek';
import {r3RecordGaps} from '../lib/kb/content/gate';

const pkg=buildPackage(),font=readFont(),out=render(pkg,font),md=out.md;
const T=SIZING_TABLES;

// (a) A generált fájlok naprakészek, és a kiadás (EDITIONS utolsó bejegyzése) a tartalomhoz tartozik.
assert.deepEqual(checkOutputs(pkg,font),[],'A lektori csomag elavult – futtasd: node --import tsx scripts/lektori-csomag.ts');
assert.equal(EDITION,EDITIONS[EDITIONS.length-1]);
assert.equal(EDITION.content,pkg.fingerprints.content,'tartalmi változásnál új kiadás kell (EDITIONS)');
assert.deepEqual(editionProblems(pkg,null),[],'az EDITIONS előzménylista érvényes');
// A nem tervezet kiadás bejegyzése részenként rögzíti a jóváhagyható ujjlenyomatokat (a jóváhagyások ehhez kötődnek).
assert.ok(!EDITION.draft,'az aktuális kiadás kiküldhető (nem tervezet)');
assert.deepEqual([EDITION.tables,EDITION.formulas,EDITION.calcs,EDITION.diagrams,EDITION.articles],[pkg.fingerprints.tables,pkg.fingerprints.formulas,calcPairs(pkg),diagramPairs(pkg),articlePairs(pkg)]);
// Az LK-4 az 1–3. részt változatlanul hozza (a 3. rész kalkulátoronkénti ujjlenyomat-párjai és az 1–2. rész ujjlenyomata azonos az LK-3-éval).
{const lk3=EDITIONS.find(e=>e.number===3)!;assert.ok(EDITION.number>=4&&lk3.tables===EDITION.tables&&lk3.formulas===EDITION.formulas&&JSON.stringify(lk3.calcs)===JSON.stringify(EDITION.calcs),'az 1–3. rész változatlan')}
assert.ok(editionProblems(pkg,null,[...EDITIONS.slice(0,-1),{...EDITION,diagrams:undefined}]).some(p=>p.includes('ábránkénti ujjlenyomat-pár')),'az LK-4-től kötelező a diagrams');
assert.ok(editionProblems(pkg,null,[...EDITIONS.slice(0,-1),{...EDITION,diagrams:{...EDITION.diagrams,'valtokapcsolo-106':'00000000/00000000'}}]).some(p=>p.includes('eltérnek az LK-')),'az ábra ujjlenyomat-párja is a bejegyzés része');
assert.ok(ARTICLES_FROM===4&&EDITION.number>=ARTICLES_FROM);
assert.ok(editionProblems(pkg,null,[...EDITIONS.slice(0,-1),{...EDITION,articles:undefined}]).some(p=>p.includes('cikkenkénti tartalmi ujjlenyomat')),'az LK-4-től kötelező az articles');
assert.ok(editionProblems(pkg,null,[...EDITIONS.slice(0,-1),{...EDITION,articles:{...EDITION.articles,kismegszakito:'00000000'}}]).some(p=>p.includes('eltérnek az LK-')),'a cikk ujjlenyomata is a bejegyzés része');
assert.ok(editionProblems(pkg,null,[...EDITIONS.slice(0,-1),{...EDITION,articles:{...EDITION.articles,kismegszakito:'xyz'}}]).some(p=>p.includes('cikkenkénti tartalmi ujjlenyomat')),'érvénytelen cikk-ujjlenyomat');
assert.ok(EDITIONS.filter(e=>e.number<=2).every(e=>e.draft&&e.sent===undefined),'az LK-1 és az LK-2 belső tervezet');
// A git HEAD-ben lévő EDITIONS: a korábbi és a kiküldött (sent) kiadás nem írható át, a kiadásszám nem mehet vissza; csak a még ki
// nem küldött utolsó kiadás tartalma változhat (pl. a commitolt, de lektornak még nem küldött LK-3).
const asCommitted=(es:readonly Edition[]):CommittedEdition[]=>es.map(e=>({number:e.number,date:e.date,content:e.content,...(e.sent!==undefined?{sent:e.sent}:{})}));
const committed=asCommitted(EDITIONS),lastC=committed.length-1;
assert.deepEqual(editionProblems(pkg,committed),[]);
assert.deepEqual(editionProblems(pkg,committed.map((c,i)=>i===lastC?{...c,content:'deadbeef'}:c)),[],'ki nem küldött utolsó kiadás átírható');
assert.ok(editionProblems(pkg,committed.map((c,i)=>i===lastC?{...c,content:'deadbeef',sent:'2026-10-11'}:c)).some(p=>p.includes('kiküldött kiadás bejegyzése nem írható át')),'kiküldött kiadás nem írható át');
assert.ok(editionProblems(pkg,committed.map((c,i)=>i===1?{...c,content:'deadbeef'}:c)).some(p=>p.includes('LK-2')&&p.includes('nem írható át')),'korábbi kiadás (nem a legutóbbi commitolt) sem írható át');
assert.ok(editionProblems(pkg,committed.map((c,i)=>i===0?{...c,date:'2026-10-09'}:c)).some(p=>p.includes('LK-1')&&p.includes('nem írható át')));
assert.ok(editionProblems(pkg,[...committed,{number:EDITION.number+1,date:EDITION.date,content:'deadbeef'}]).some(p=>p.includes('nem mehet vissza')));
assert.ok(editionProblems(pkg,null,[...EDITIONS.slice(0,-1),{...EDITION,number:EDITION.number+1}]).some(p=>p.includes('egyesével')));
assert.ok(editionProblems(pkg,null,[...EDITIONS,{...EDITION,number:EDITION.number+1}]).some(p=>p.includes('korábbi kiadásé')));
assert.ok(editionProblems(pkg,null,[{...EDITIONS[0],sent:'2026-10-11'},...EDITIONS.slice(1)]).some(p=>p.includes('belső tervezet')),'tervezet nem küldhető ki');
assert.ok(editionProblems(pkg,null,[...EDITIONS.slice(0,-1),{...EDITION,tables:undefined}]).some(p=>p.includes('tables, formulas')));
assert.ok(editionProblems(pkg,null,[...EDITIONS.slice(0,-1),{...EDITION,calcs:{...EDITION.calcs,feszultseges:'00000000/00000000'}}]).some(p=>p.includes('eltérnek az LK-')),'a kalkulátor ujjlenyomat-párja is a bejegyzés része');
// A HEAD-beli EDITIONS a generátor forrásszövegéből olvasható (beágyazott calcs-objektum és megjegyzés mellett is).
assert.deepEqual(parseEditions(readFileSync('scripts/lektori-csomag.ts','utf8')),committed);
assert.deepEqual(parseEditions(`export const EDITIONS:readonly Edition[]=[\n {number:1,date:'2026-01-01',content:'0000000a',draft:true,note:'a {zárójel}, content:\\'ffffffff\\''},\n {number:2,date:'2026-01-02',content:'0000000b',sent:'2026-01-03',calcs:{'x':'1/2'}},\n];`),[{number:1,date:'2026-01-01',content:'0000000a'},{number:2,date:'2026-01-02',content:'0000000b',sent:'2026-01-03'}]);
assert.equal(parseEditions('nincs ilyen'),null);
const head=committedEditions();assert.ok(head===null||head.length>=3,'a HEAD EDITIONS-e olvasható');
// A --check mód a parancssorból is zöld, és nem ír.
const cli=execFileSync(process.execPath,['--import','tsx','scripts/lektori-csomag.ts','--check'],{encoding:'utf8'});
assert.ok(cli.includes('naprakész')&&cli.includes(pkg.fingerprints.tables),cli);
// Az elavulást észleli: más tartalomból más Markdown és más PDF készül, és új kiadás kell.
const changed=structuredClone(pkg) as Package;
const firstValue=allItems(changed).find(i=>i.kind==='value')!;if(firstValue.kind==='value')firstValue.value+=' (módosítva)';
assert.ok(checkOutputs(changed,font).some(p=>p.includes('lektori-csomag.md elavult')));
assert.notEqual(contentFingerprint(changed.parts),pkg.fingerprints.content,'tartalmi változás → új csomag-ujjlenyomat');
assert.ok(editionProblems({...changed,fingerprints:{...changed.fingerprints,content:contentFingerprint(changed.parts)}},null).some(p=>p.includes('eltérnek az LK-')));
assert.equal(contentFingerprint(pkg.parts),pkg.fingerprints.content);
// A csomag-ujjlenyomat a tételeken kívül a mátrixokat, a bevezetőt és a jóváhagyó lap szövegét is fedi.
const matrixChanged=structuredClone(pkg) as Package;
matrixChanged.parts[0].blocks.find(b=>b.matrix)!.matrix!.rows[0].cells[0]='999';
assert.notEqual(contentFingerprint(matrixChanged.parts),pkg.fingerprints.content,'mátrix → csomag-ujjlenyomat');
const texts=packageTexts();
assert.notEqual(contentFingerprint(pkg.parts,{...texts,approval:{...texts.approval,declaration:texts.approval.declaration.replace('nem terjed ki a csomag 6. részére','kiterjed a csomag 6. részére is')}}),pkg.fingerprints.content,'nyilatkozat → csomag-ujjlenyomat');
assert.notEqual(contentFingerprint(pkg.parts,{...texts,approval:{...texts.approval,calcNote:texts.approval.calcNote+' '}}),pkg.fingerprints.content,'kalkulátoronkénti döntés szövege → csomag-ujjlenyomat');
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
assert.ok(md.includes(`1. rész: ${tablesFingerprint()}; 2. rész: ${pkg.fingerprints.formulas}; 3. rész: ${pkg.fingerprints.calculators}; 4. rész: ${pkg.fingerprints.diagrams}`),'a jóváhagyó lap az ujjlenyomatokat mutatja');
assert.equal(pkg.fingerprints.calculators,partFingerprint(pkg.parts[2]));assert.ok(md.includes(`| Jóváhagyott csomagverzió és ujjlenyomatok | ${approvedFingerprints(pkg)} |`));
assert.ok(md.includes(`| Táblázatváltozat | ${T.version} |`));
assert.ok(md.includes(`| Csomagverzió | ${editionLabel()} |`));

// (e) A PDF legenerálható, determinisztikus, ésszerű terjedelmű, és minden kiírt karakter szerepel a betűkészletben.
assert.ok(out.pdf.length>20000,'PDF mérete: '+out.pdf.length);
assert.ok(out.pages>=120&&out.pages<=260,'PDF oldalszáma: '+out.pages);
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
// A PDF-ben nincs szó közbeni sortörés (a render() különben hibával megáll); a túl keskeny oszlopot a generátor jelzi.
const narrow=structuredClone(pkg) as Package;narrow.parts[2].blocks[1].layout={widths:[8,8,120,28],align:'left'};
assert.throws(()=>render(narrow,font),/szó közben törik/);
// A szám és a mértékegysége, illetve az ezres csoportok nem válnak el sortöréssel: a tördelés csak sima szóköznél tör, és köztük
// nem törő szóköz marad (kiíráskor lesz sima szóközzé).
assert.equal(pdfInline('Ze = 0,5 Ω, I2 = 10 000 / (√3 · 400 V); 23\u202f°C, 1\u00a0000 m'),'Ze = 0,5\u00a0Ω, I2 = 10\u00a0000 / (я3 · 400\u00a0V); 23\u00a0°C, 1\u00a0000\u00a0m');
assert.equal(pdfInline('2 · 10 · 10 és 16 A, B16'),'2 · 10 · 10 és 16\u00a0A, B16');

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
const sp=(s:string)=>s.replace(/[\u00a0\u202f]/g,' ');
/** Kalkulátorfuttatás (lib/calc runCalc, a kalkulátoroldal motorja) és az elvárások összevetése (lásd CalcExpect). */
function calcErrors(slug:string,input:Raw,expect:CalcExpect):string[]{
 const d=bySlug(slug);if(!d)return ['nincs ilyen kalkulátor: '+slug];
 const r=runCalc(d,input),errors:string[]=[];
 for(const [key,want] of Object.entries(expect)){
  const colon=key.indexOf(':'),kind=colon<0?key:key.slice(0,colon),arg=colon<0?'':key.slice(colon+1);
  let got:unknown,ok:boolean;
  if(kind==='ok'){got=r.ok;ok=got===want}
  else if(kind==='error'||kind==='errorField'){const i=r.ok?undefined:r.issues.find(x=>x.level==='error');got=kind==='error'?(i?sp(i.text):undefined):i?.field;ok=kind==='error'?typeof got==='string'&&got.includes(String(want)):got===want}
  else if(!r.ok){got='nincs eredmény: '+r.issues.map(i=>i.text).join('; ');ok=false}
  else if(kind==='text'){got=sp(r.out.results.find(x=>x.id===arg)?.text??'');ok=got===want}
  else if(kind==='verdict'){got=r.out.verdict?.ok;ok=got===want}
  else if(kind==='verdictText'){got=sp(r.out.verdict?.text??'');ok=(got as string).includes(String(want))}
  else if(kind==='issue'||kind==='noIssue'){const t=r.issues.map(i=>sp(i.text));got=t;ok=t.some(x=>x.includes(String(want)))===(kind==='issue')}
  else if(kind==='issues'){got=r.issues.length;ok=got===want}
  else if(kind==='assumption'){const t=(r.out.assumptions??[]).map(sp);got=t;ok=t.some(x=>x.includes(String(want)))}
  else if(kind==='primary'){got=mainResults(r.out).map(x=>x.id).join(',');ok=got===want}
  else{const x=r.out.results.find(x=>x.id===key);got=x?x.value:null;ok=want===null?x===undefined:typeof want==='number'&&typeof got==='number'&&near(got,want)}
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
  case 'calc':return calcErrors(c.args[0],c.args[1],c.expect);
  case 'calcField':{const d=bySlug(c.args[0]);if(!d)return ['nincs ilyen kalkulátor'];return bool(!parseInputs(d,c.args[1]).issues.some(i=>i.field===c.args[2])===c.expect)}
  case 'calcNotCovered':return bool(JSON.stringify(bySlug(c.args[0])?.notCovered)===JSON.stringify(c.expect));
 }
}
const items=allItems(pkg),checks=items.flatMap(i=>(i.kind==='rule'?i.checks:i.checks??[]).map(c=>({id:i.id,c})));
for(const {id,c} of checks){const e=run(c);assert.deepEqual(e,[],`${id}: a példa nem egyezik a programmal (${c.fn} ${JSON.stringify(c.args)} → várt ${JSON.stringify(c.expect)}): ${e.join('; ')}`)}
assert.ok(checks.length>=150,'programmal összevetett esetek száma: '+checks.length);
// A kalkulátor-összevetés is tényleg jelez.
assert.equal(calcErrors('feszultseges',{},{pct:3,'text:Lmax':'x',verdict:false,issue:'nincs ilyen',primary:'dU'}).length,5);
assert.equal(calcErrors('feszultseges',{I:'0'},{ok:true}).length,1);assert.equal(calcErrors('feszultseges',{I:'0'},{pct:1}).length,1);
assert.equal(run({fn:'calcField',args:['feszultseges',{I:'1000'},'I'],expect:false}).length,1);
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

// (g) Jóváhagyás: a SIZING_REVIEW csak aláírt lektori jóváhagyás után „jóváhagyott”; ekkor az approvalRef pontosan egy kiküldött,
// nem tervezet csomagkiadást (LK-n) nevez meg annak csomag-ujjlenyomatával, és abban a kiadásban az 1. rész a jóváhagyott, a 2. rész a
// mostani ujjlenyomatú (reviewRefProblems). A kalkulátorok lektori rekordja ugyanígy, a kalkulátor ujjlenyomat-párjával (releaseRefProblems).
if(SIZING_REVIEW.status==='jóváhagyott'){
 assert.equal(SIZING_REVIEW.fingerprint,pkg.fingerprints.tables);
 assert.deepEqual(reviewRefProblems(SIZING_REVIEW,pkg.fingerprints.formulas),[],'a táblázatjóváhagyás hivatkozása (approvalRef) hibás, vagy a 2. rész a jóváhagyás óta megváltozott: új jóváhagyás kell');
 assert.ok(tablesApproved()&&md.includes('| Jóváhagyási állapot (1. rész) | jóváhagyott – '));
}else{
 assert.equal(tablesApproved(),false);
 assert.ok(md.includes('| Jóváhagyási állapot (1. rész) | ellenőrizendő – jogosult tervező még nem hagyta jóvá |'));
}
assert.deepEqual(releaseRefProblems(),[]);
// Szimulált kiküldött kiadás (az LK-n bejegyzés sent mezővel) a hivatkozás-ellenőrzések próbájához.
const sentEditions:Edition[]=[...EDITIONS.slice(0,-1),{...EDITION,sent:'2026-10-11'}];
const tablesRef=`Lektori csomag ${editionLabel()}, csomag: ${EDITION.content}, 1. rész: ${EDITION.tables}, 2. rész: ${EDITION.formulas}; jóváhagyó lap: iktatás 1`;
const review=(approvalRef:string,over:Partial<SizingReview>={}):SizingReview=>({...SIZING_REVIEW,status:'jóváhagyott',qualification:'villamos tervező',date:'2026-11-01',fingerprint:pkg.fingerprints.tables,approvalRef,showName:false,reviewer:'',registry:'',...over});
assert.deepEqual(reviewRefProblems(review(tablesRef),pkg.fingerprints.formulas,sentEditions),[]);
assert.deepEqual(reviewRefProblems({...review(tablesRef),status:'ellenőrizendő'},pkg.fingerprints.formulas,EDITIONS),[],'jóváhagyás nélkül nincs mit ellenőrizni');
assert.ok(reviewRefProblems(review(tablesRef),pkg.fingerprints.formulas,EDITIONS)[0].includes('nincs kiküldöttként jelölve'),'ki nem küldött kiadásra nem hivatkozhat');
assert.ok(reviewRefProblems(review('Lektori csomag LK-2, csomag: 4f9723b6'),pkg.fingerprints.formulas,sentEditions)[0].includes('belső tervezet'),'tervezet kiadásra nem hivatkozhat');
assert.ok(reviewRefProblems(review(tablesRef),'00000000',sentEditions).some(p=>p.includes('2. rész (képletek) a jóváhagyás óta megváltozott')));
assert.ok(reviewRefProblems(review(tablesRef,{fingerprint:'00000000'}),pkg.fingerprints.formulas,sentEditions).some(p=>p.includes('1. részének ujjlenyomata')));
assert.ok(reviewRefProblems(review(`Lektori csomag LK-${EDITION.number}, csomag: ${EDITION.content}`),pkg.fingerprints.formulas,sentEditions).some(p=>p.includes('1. és 2. részének ujjlenyomata')));
const approvedEditions=(note:string)=>[...note.matchAll(/(?<![\p{L}\d])LK-(\d+)(?![\p{L}\d])/gu)].map(m=>Number(m[1]));
assert.deepEqual(approvedEditions('Lektori csomag LK-12 (2026. 10. 10.)'),[12]);assert.deepEqual(approvedEditions('LK-1, LK-1x'),[1]);assert.deepEqual(approvedEditions('XLK-1 LK-10'),[10]);
const pair=EDITION.calcs!.feszultseges,[pfp,psrc]=pair.split('/');
const rec=(approvalRef:string,over:Partial<ExpertReview>={}):ExpertReview=>({kind:'lektoralt',qualification:'villamos tervező',date:'2026-11-01',fingerprint:pfp,source:psrc,approvalRef,...over});
const calcRef=`Lektori csomag ${editionLabel()}, csomag: ${EDITION.content}, kalkulátor: ${pair}; jóváhagyó lap: iktatás 1`;
assert.deepEqual(releaseRefProblems({feszultseges:rec(calcRef)},sentEditions),[]);
assert.ok(releaseRefProblems({feszultseges:rec(calcRef)},EDITIONS)[0].includes('nincs kiküldöttként jelölve'));
assert.ok(releaseRefProblems({feszultseges:rec('LK-1, csomag: 48479e60')},sentEditions)[0].includes('belső tervezet'),'az LK-1/LK-2 belső tervezetre hivatkozó rekord hibás');
assert.ok(releaseRefProblems({feszultseges:rec('LK-2, csomag: 4f9723b6')},sentEditions)[0].includes('belső tervezet'));
assert.ok(releaseRefProblems({feszultseges:rec(calcRef,{fingerprint:'deadbeef'})},sentEditions)[0].includes('nem ezt a változatot'),'a jóváhagyás után megváltozott kalkulátor régi hivatkozással nem rögzíthető');
assert.ok(releaseRefProblems({feszultseges:rec(`Lektori csomag LK-${EDITION.number}, csomag: ${EDITION.content}`)},sentEditions)[0].includes('ujjlenyomat-párja'));
assert.ok(releaseRefProblems({feszultseges:rec('')},sentEditions)[0].includes('pontosan egy'));
assert.ok(releaseRefProblems({feszultseges:rec(`LK-${EDITION.number} és LK-1`)},sentEditions)[0].includes('pontosan egy'));
assert.ok(releaseRefProblems({feszultseges:rec(`LK-${EDITION.number+1}`)},sentEditions)[0].includes('nincs az EDITIONS-ben'));
assert.ok(releaseRefProblems({feszultseges:rec(`LK-${EDITION.number}, kalkulátor: ${pair}`)},sentEditions)[0].includes('csomag-ujjlenyomata'));
assert.deepEqual(releaseRefProblems({'ohm-torveny':rec('')}),[],'T0 rekordot a csomag nem köt');

// (h) Szerkezet: helyőrzők, jóváhagyó lap, szóhasználat, a név megjelenésének leírása.
assert.deepEqual(pkg.parts.map(p=>p.no),[1,2,3,4,5,6]);assert.equal(PARTS.length,6);
for(const p of pkg.parts.filter(p=>p.no<=5))assert.ok(!p.placeholder&&p.blocks.length,p.no+'. rész kész');
for(const p of pkg.parts.filter(p=>p.no>=6))assert.ok(p.placeholder&&!p.blocks.length,p.no+'. rész helyőrző');
assert.ok(!md.includes('A Sémák ábráinak elkészülte után kerül be'),'a 4. rész már nem helyőrző');
for(const t of ['## Jóváhagyó lap','### 3. rész – kalkulátoronkénti döntés','### Döntés és aláírás','Jóváhagyó neve','Kamarai / névjegyzéki szám','Jogosultság megnevezése','| Hely |','| Dátum |','| Aláírás |','### Teendő eltérés esetén','Mit jelent a jóváhagyás – és mit nem?','### Becsült ráfordítás','### Hogyan kell kitölteni?','a többi, pipálatlanul hagyott tétel egyezőnek számít','Megjegyzés a blokkhoz (forrás, kiadás)','külön mellékletben'])assert.ok(md.includes(t),'hiányzik: '+t);
assert.ok(!/szakmailag ellenőrzött|MSZ szerint megfelel|megfelel a szabványnak|szabványos méretezés/i.test(md),'tiltott kifejezés');
// A név megjelenése a program pontos szövegével és helyeivel van leírva: névvel (hozzájárulással) és név nélkül, a jogosultsággal.
const base:SizingReview={status:'jóváhagyott',qualification:'[jogosultság]',date:'[dátum]',fingerprint:tablesFingerprint(),approvalRef:'[hivatkozás]',showName:true,reviewer:'[név]',registry:'[névjegyzéki szám]',note:''};
const shown={named:reviewText(base),anonymous:reviewText({...base,showName:false,reviewer:'',registry:''})};
assert.deepEqual(approvedTexts(),shown);assert.ok(shown.named.includes('[név]')&&!shown.anonymous.includes('[név]')&&!shown.anonymous.includes('[névjegyzéki szám]')&&shown.anonymous.includes('[jogosultság]'));
for(const t of [shown.named,shown.anonymous])assert.ok(md.split(t).length>=3,'a jóváhagyási szöveg a bevezetőben és a hozzájárulásban is szerepel: '+t);
// A kalkulátor saját oldalának lektori jelölése (lib/calc/registry.ts): név csak hozzájárulással, különben a jogosultság; a
// kalkulátorlistán és a keresőben (calcMeta.note) mindig név nélkül.
const badges=calcBadgeTexts();
assert.equal(badges.named,'Szakmailag lektorálta: [név], [jogosultság] · [dátum]; Szakmai lektor: [név], [jogosultság]');
assert.equal(badges.anonymous,'Szakmailag lektorálta: [jogosultság] · [dátum]; Szakmai lektor: [jogosultság]');
assert.equal(badges.list,'Szakmailag lektorálta: [jogosultság] · [dátum]','a kalkulátorlista jelvénye hozzájárulással is név nélküli');
for(const t of [badges.named,badges.anonymous])assert.ok(md.split(t).length>=3,'a kalkulátorjelvény szövege a bevezetőben és a hozzájárulásban: '+t);
assert.ok(md.includes('a kalkulátorlistán (/kalkulatorok) és a keresőben a jelvény mindig név nélküli: „'+badges.list+'”')&&md.includes('A kalkulátorlistán és a keresőben a jelvény név nélküli.'));
assert.ok(md.includes('hozzájárulás nélkül a programban sem rögzítjük')&&md.includes('a program nevemet és névjegyzéki számomat nem rögzíti'),'a csomag kimondja, hogy hozzájárulás nélkül a név a programba sem kerül');
// A lektor neve (jelvény, lábléc-sor) csak a kalkulátor saját oldalán jelenhet meg: a jelvényt vagy a lektor megnevezését használó fájlok
// listája rögzített (új hely csak a hozzájárulás szövegének bővítésével és a lektor új hozzájárulásával kerülhet be).
const walk=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):/\.tsx?$/.test(e.name)?[dir+'/'+e.name]:[]);
// A Tudástár-cikkek saját lektori rekordjai (lib/kb/release.ts) ettől a csomagtól független hozzájáruláshoz kötöttek; a nevük megjelenési
// helyeit (csak a cikk saját oldala, a listán név nélkül) a tests/kb-content.ts őrzi – ezért azok a fájlok itt kimaradnak.
const KB_OWN=/^(lib\/kb\/content\/|components\/kezikonyv\/article\/)/;
const badgeUsers=['app','components','lib'].flatMap(walk).filter(f=>f!=='lib/calc/registry.ts'&&!KB_OWN.test(f)&&/\b(?:expertMeta|expertShown|releaseBadge)\(|\.badge\b/.test(readFileSync(f,'utf8'))).sort();
assert.deepEqual(badgeUsers,['app/(kezikonyv)/kalkulatorok/[slug]/page.tsx'],'a lektor neve új helyen jelenne meg (pl. a kalkulátorlista kártyáján): bővítsd a hozzájárulás szövegét (CONSENT), és kérd a lektor hozzájárulását');
assert.ok(md.includes('„Táblázatok – Állapot” sorában')&&md.includes('Tervezői ellenőrzés'));
assert.ok(md.includes('A jóváhagyás érvénye a hozzájárulástól nem függ.'));
// A reviewText() minden megjelenési helye a hozzájárulás szövegében (NAME_PLACES) szerepel: új hely csak a felsorolással és a lektor
// hozzájárulásával kerülhet be. A forráskódban a reviewText()-et hívó fájlok:
const callers=['app','components','lib'].flatMap(walk).filter(f=>/\breviewText\(/.test(readFileSync(f,'utf8'))&&f!=='lib/sizing-tables.ts').sort();
assert.deepEqual(callers,['app/(kezikonyv)/kalkulatorok/[slug]/page.tsx','components/sizing-report.tsx','lib/calc/defs/vezetek-ellenallas.ts','lib/sizing.ts'],'a jóváhagyó neve új helyen jelenne meg: bővítsd a NAME_PLACES-t (és kérd a lektor hozzájárulását)');
for(const d of CALCULATORS.filter(c=>c.tables))assert.ok(NAME_PLACES().includes(d.title),'NAME_PLACES: '+d.title);
assert.ok(NAME_PLACES().includes('Méretezés fülén')&&NAME_PLACES().includes('terv-PDF')&&NAME_PLACES().includes('Vezeték-ellenállás'));
// A 2. rész kötése pontosan van leírva (a program csak az 1. részt köti ujjlenyomathoz).
assert.ok(md.includes('A 2. rész (képletek, döntések) jóváhagyását a program állapota nem követi.'));
// A „Mit nem vizsgál” lista a program listája (SIZING_NOT_COVERED), szó szerint.
assert.deepEqual(pkg.notCovered,SIZING_NOT_COVERED);
assert.ok(rules.find(r=>r.id==='D-HATOKOR')!.rule.includes(SIZING_NOT_COVERED.join('; ')));
// A docs/meretezes.md „Mit nem vizsgál” listája szó szerint a programé (eltérésnél a dokumentációt kell igazítani).
const docList=notCoveredFrom(readFileSync(PATHS.sizingDoc,'utf8'));
assert.deepEqual(docList,SIZING_NOT_COVERED,`a ${PATHS.sizingDoc} „Mit nem vizsgál” listája eltér a program SIZING_NOT_COVERED listájától. Eltérő tételek: ${[...SIZING_NOT_COVERED.filter(x=>!docList.includes(x)),...docList.filter(x=>!SIZING_NOT_COVERED.includes(x))].map(x=>'„'+x+'”').join(', ')}`);
assert.throws(()=>notCoveredFrom('# Üres'),/Mit nem vizsgál/);

// (i) 3. rész: minden T1 kalkulátor (a release.ts T1_SLUGS listája) saját blokkot kap, a mostani ujjlenyomat-párral; minden mezője
// tételként, a számmezők korlátai a tartomány szélein, minden eredménye legalább egy kézzel számolt példában a runCalc-kal összevetve.
assert.deepEqual([...T1_ORDER].sort(),[...T1_SLUGS].sort(),'a 3. rész a release.ts összes T1 kalkulátorát tartalmazza');
const part3=pkg.parts[2];
assert.deepEqual(part3.blocks.map(b=>b.id),['KAL-KOZOS',...T1_ORDER.map(kalId)]);
assert.equal(kalId('led-szalag-tapegyseg'),'KAL-LED-SZALAG-TAPEGYSEG');
for(const slug of T1_ORDER){
 const d=bySlug(slug)!,b=part3.blocks.find(x=>x.id===kalId(slug))!,fp=calcFingerprint(d),src=sourceFingerprint(slug);
 assert.ok(b.intro.join(' ').includes(`Tartalmi ujjlenyomat: ${fp}; forrás-ujjlenyomat: ${src}`),slug+': az ujjlenyomat-pár a blokk elején');
 const row=pkg.calcs.find(c=>c.slug===slug)!;assert.deepEqual([row.fingerprint,row.source,row.gated],[fp,src,TABLE_GATED.has(slug)]);
 assert.ok(md.includes(`| ${d.title} | ${kalId(slug)} | ${fp} | ${src} | ${TABLE_GATED.has(slug)?'igen':'nem'} | ☐ Jóváhagyom · ☐ Javítás után / nem |`),slug+': kalkulátoronkénti döntés sora');
 assert.ok(b.title===d.title&&b.source===d.sources.join('; '));
 for(const f of d.fields){const it=b.items.find(i=>i.id===kalId(slug)+'-BEM-'+f.id.toUpperCase());assert.ok(it&&it.kind==='value',slug+'.'+f.id+': bemenet tétele');if(f.kind==='number')assert.ok((it.checks??[]).filter(c=>c.fn==='calcField').length>=3,slug+'.'+f.id+': korlátok összevetve')}
 for(const id of ['HAT','NV','KEPLET','FELT'])assert.ok(b.items.some(i=>i.id===kalId(slug)+'-'+id),slug+': '+id);
 const kep=b.items.find(i=>i.id===kalId(slug)+'-KEPLET')!;assert.ok(kep.kind==='value'&&kep.value===formulasText(d.formulas)&&md.includes(formulasText(d.formulas)),slug+': a képletek szó szerint, számozva');
 assert.ok(d.formulas.every((f,n)=>kep.kind==='value'&&kep.value.includes(`${n+1}) ${f}`)),slug+': minden képlet külön számozott sor');
 // A FELT tétel minden feltételezés-sort tartalmaz, amelyet a kalkulátor bármely választómező-kombinációban vagy példában kiír;
 // a nem mindig megjelenő sorok a feltételükkel („csak ha …”).
 const felt=b.items.find(i=>i.id===kalId(slug)+'-FELT')!;assert.ok(felt.kind==='value');
 const always=new Set<string>(),shownAll=new Set<string>(),combos=selectCombos(d);let okRuns=0;
 for(const raw of [...combos,...d.examples.map(e=>e.input)]){const r=runCalc(d,raw);if(!r.ok)continue;okRuns++;const a=r.out.assumptions??[];a.forEach(x=>shownAll.add(x));if(okRuns===1)a.forEach(x=>always.add(x));else for(const x of [...always])if(!a.includes(x))always.delete(x)}
 assert.ok(shownAll.size&&okRuns>=combos.length,slug+': a kombinációk lefutnak');
 const entries=felt.value.split(/ (?=\d+\) )/);
 for(const a of shownAll){
  const e=entries.find(x=>x.endsWith(' '+a));assert.ok(e,slug+': a FELT tételből hiányzik egy kiírt feltételezés: '+a);
  assert.equal(e.includes('(csak ha '),!always.has(a),slug+': '+(always.has(a)?'mindig megjelenő sor feltétellel':'feltételes sor feltétel nélkül')+': '+a);
 }
 assert.equal(entries.length,shownAll.size,slug+': a FELT tétel csak kiírt feltételezést tartalmaz');
 assert.ok(!felt.value.includes(') (csak ha egyes bemeneteknél)'),slug+': minden feltételes sor feltétele választómezőhöz köthető');
 const calcs=b.items.flatMap(i=>i.kind==='rule'?i.checks:[]).filter((c):c is Extract<ProgramCheck,{fn:'calc'}>=>c.fn==='calc'&&c.args[0]===slug);
 const worked=calcs.filter(c=>Object.entries(c.expect).filter(([k,v])=>!k.includes(':')&&typeof v==='number').length>=2);
 assert.ok(worked.length>=2,slug+': legalább 2 kézzel számolt példa a runCalc-kal összevetve');
 const ids=runCalc(d,{}).ok?(runCalc(d,{}) as {out:{results:{id:string}[]}}).out.results.map(r=>r.id):[];
 const all=new Set([...d.examples.flatMap(ex=>{const r=runCalc(d,ex.input);return r.ok?r.out.results.map(x=>x.id):[]}),...ids]);
 for(const id of all)assert.ok(calcs.some(c=>typeof c.expect[id]==='number'),slug+': a(z) „'+id+'” eredmény egy példában sincs összevetve');
 assert.ok(b.items.find(i=>i.id===kalId(slug)+'-NV')!.checks?.some(c=>c.fn==='calcNotCovered'),slug+': a Nem vizsgált lista összevetve');
}
// A táblázatértékeket a 3. rész nem ismétli: a szövegek az 1. rész azonosítóira hivatkoznak (pl. ρ1 = T-K-RHO1).
const p3text=JSON.stringify(part3.blocks.slice(1).map(b=>b.items.map(i=>i.kind==='rule'?[i.rule,i.rationale,i.source]:[i.value])));
for(const id of ['T-K-RHO1','T-K-LAMBDA','T-K-U0','T-K-CMIN','T-K-I2','T-KM-SOR','T-KCS-3','T-KT-35','T-DU-KOZ-EGY'])assert.ok(p3text.includes(id),'3. rész hivatkozik: '+id);
assert.ok(!/\bA2 – többeres kábel/.test(p3text),'a szerelésimód-leírásokat (L-MOD-…) nem ismétli');
// Konkrét feltételes sorok: a hurokimpedancia mindhárom jelleggörbéje, az XLPE-tartalék, az egyenáramú ρ1 (λ nélkül).
const feltOf=(slug:string)=>{const i=part3.blocks.flatMap(b=>b.items).find(i=>i.id===kalId(slug)+'-FELT')!;return i.kind==='value'?i.value:''};
for(const [c,m] of [['B',5],['C',10],['D',20]] as const)assert.ok(feltOf('hurokimpedancia').includes(`(csak ha Kioldási jelleggörbe: „${c}”) Kismegszakító (MSZ EN 60898-1) pillanatkioldási tartományának felső határa: ${c} → ${m} · In.`));
for(const slug of ['keresztmetszet','kismegszakito','terhelhetoseg-tablazat'])assert.ok(/\(csak ha Szigetelés: „XLPE[^”]*”\) XLPE-szigetelés: a programban nincs jóváhagyott XLPE-táblázat/.test(feltOf(slug)),slug+': XLPE-tartalék feltétellel');
assert.ok(/\(csak ha Rendszer: „Egyenáram”\) Rézvezető; ρ1 = [^λ]*\(üzemi hőmérséklet, G\.52\.2\)\./.test(feltOf('feszultseges'))&&/\(csak ha Rendszer: „Egyfázisú \(230 V\)” vagy „Háromfázisú \(400 V\)”\) Rézvezető; ρ1 = .*λ =/.test(feltOf('feszultseges')),'DC-nél λ nélkül');
assert.equal(assumptionsText([{text:'a.',when:null},{text:'b.',when:'X: „y”'}]),'1) a. 2) (csak ha X: „y”) b.');
// A „Nem vizsgált” lista nem mond ellent a bevitelnek (Hurokimpedancia: saját A_PE, legfeljebb 35 mm²).
const hurNc=bySlug('hurokimpedancia')!.notCovered!;assert.ok(!hurNc.some(x=>/csökkentett keresztmetszetű N- vagy PE-ér|35 mm² feletti/.test(x))&&hurNc.some(x=>x.includes('543.1')));
// A kalkulátorok példái a tervező méretezésével is egyeznek (pl. ΔU 23,4 m-en = a mintaterv c1 áramkörének esése, K-DU1).
assert.ok(near(scenario({circuit:'c1',set:{load:3680}}).drop!,voltageDropPercent({b:2,length:23.4,current:16,section:2.5,cosPhi:1})));

// (j) 4. rész – bekötési ábrák: mind a 20 netlista saját BEK-blokkot kap a megadott sorrendben, a mostani netlista- és ábra-ujjlenyomattal
// (scripts/kb-content/diagrams.ts – ugyanez kerül a cikk kiadási rekordjába), a program vezetéktáblájával és minden kapcsolóállással; a
// TS = Python egyezést a generátor a rögzített referencián ellenőrzi (eltérésnél meg sem áll össze a csomag); a PDF a rajzot vektorosan,
// a stíluslap színeivel rajzolja; a jóváhagyó lapon ábránként Jóváhagyom / Javítással / Elutasítom és a második olvasó mezői.
const part4=pkg.parts[3];
assert.equal(part4.no,4);
const nlById=new Map(netlistFiles('.').map(f=>{const n=JSON.parse(readFileSync('content/tudastar/r3/'+f,'utf8')) as Netlist;return [n.id,{f,n}]}));
const diagramBlocks=part4.blocks.filter(b=>b.diagram);
assert.deepEqual(diagramBlocks.map(b=>b.id),DIAGRAM_ORDER.map(bekId),'a 20 ábra a megadott sorrendben');
assert.equal(diagramBlocks.length,20);
// A 4. rész rendje: a biztonsági szabályok blokkja, majd csoportonként a közös kérdések blokkja és a csoport ábrái.
assert.deepEqual(part4.blocks.map(b=>b.id),['BEK-SZABALYOK','BEK-VIL-KERDESEK',...DIAGRAM_ORDER.slice(0,9).map(bekId),'BEK-VED-KERDESEK',...DIAGRAM_ORDER.slice(9,14).map(bekId),'BEK-FOLD-KERDESEK',...DIAGRAM_ORDER.slice(14).map(bekId)]);
for(const b of diagramBlocks){
 const d=b.diagram!;assert.ok(d,b.id+': ábra');
 const {f,n}=nlById.get(d.netlistId)!,c=loadNetlist(n),rep=runNetlist(c);
 assert.equal(d.netlistFp,netlistFingerprint(n),b.id+': netlista-ujjlenyomat');
 assert.equal(d.diagramFp,diagramSource('.',[f]),b.id+': ábra-ujjlenyomat (a cikk rekordjáé is ebből áll)');
 assert.deepEqual(d.wires,wireTable(c).map(w=>[String(w.no),w.fromLabel,w.toLabel,w.conductor,w.color,w.section]),b.id+': vezetéktábla');
 assert.equal(d.truth.rows.length,rep.combinations,b.id+': minden állás');
 assert.ok(d.python.includes('azonos eredményt ad ('+rep.combinations+' állás')&&d.python.includes('a modell és a bekötés szakmai helyességét nem'),b.id+': TS = Python, és a gépi egyezés nem szakmai igazolás');
 assert.ok(d.prims.some(p=>p.k==='poly'&&p.data?.wire),b.id+': a rajz vezetékei');
 assert.ok(!d.prims.some(p=>(p.cls??'').includes('is-off')),b.id+': csak az alapállás érintkezői');
 assert.deepEqual(b.items.map(i=>i.id),[b.id+'-RAJZ',b.id+'-VEZ',...(d.sections.length?[b.id+'-SZAK']:[]),b.id+'-ALL'],b.id+': tételek');
 const row=pkg.diagrams.find(x=>x.block===b.id)!;assert.deepEqual([row.netlistFp,row.diagramFp],[d.netlistFp,d.diagramFp]);
 assert.ok(md.includes(`| ${b.title} | ${b.id} | ${d.netlistFp} | ${d.diagramFp} | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |`),b.id+': ábránkénti döntés sora');
 assert.ok(md.includes(`**Döntés (${b.id}):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom`),b.id+': döntés a blokk végén');
 assert.ok(md.includes('Netlista-ujjlenyomat: '+d.netlistFp),b.id+': a netlista ujjlenyomata a blokk elején');
}
// Kérdések: a témakör közös kérdései (content/tudastar/lektori-kerdesek-r3.md) külön blokkban (BEK-<csoport>-KERDESEK), egyedi azonosítóval
// (BEK-<csoport>-Q<n>) és válaszmezővel; a cikk saját kérdései az 5. rész cikkblokkjában (CIK-<CIKK>-Q<n>). A belső jegyzetek szakasza kimarad.
for(const [gid,sec] of [['VIL','Világítási kapcsolások (101–107)'],['VED','Dugalj, kismegszakító, FI-relé'],['FOLD','Földelési rendszerek, EPH, feszültségmentesítés']] as const){
 const qs=r3Questions(sec);assert.ok(qs.length>=5,sec);
 const b=part4.blocks.find(x=>x.id===`BEK-${gid}-KERDESEK`)!;assert.ok(b&&!b.items.length&&!b.diagram,gid+': közös kérdések blokkja');
 assert.deepEqual(b.questions!.map(q=>q.text),qs,gid+': a kérdések szó szerint a lektori kérdéslistából');
 assert.deepEqual(b.questions!.map(q=>q.id),qs.map((_,n)=>`BEK-${gid}-Q${n+1}`),gid+': egyedi azonosítók');
}
{
 const all=pkg.parts.flatMap(pt=>pt.blocks.flatMap(b=>b.questions??[]));
 assert.equal(new Set(all.map(q=>q.id)).size,all.length,'minden kérdésnek egyedi azonosítója van');
 assert.ok(all.length>=40,'a kérdések száma: '+all.length);
 for(const q of all){assert.deepEqual(questionProblems(q.id,q.text),[],q.id);assert.ok(md.includes(`**Kérdés a lektorhoz (${q.id}).** ${q.text}`)&&md.includes(`Válasz (${q.id}):`),q.id+': kérdés és válaszmező a Markdownban');if(/-Q\d+$/.test(q.id))assert.ok(allIds(pkg).includes(q.id),q.id+': szerepel az azonosítók között')}
 // A kérdés lektori nyelven szól: belső szerep, fájlnév, útvonal, kódjelölés, terv-hivatkozás, üzleti döntés nem lehet benne.
 for(const bad of ['Koordináció: a lektor ne lássa','a check_foo.py ellenőrzi','lásd lib/kb/circuit.ts','a `sim` azt mondja','a terv 3.4 szerint','a tulajdonos dönti el','Szerkesztői: x','I12 szabály és a front matter'])assert.ok(questionProblems('X-Q1',bad).length>=1,'a tiltólista elkapja: '+bad);
 assert.deepEqual(questionProblems('X-Q1','A kék ér kapcsolt fázisként használható-e a nullavezető nélküli szakaszban?'),[]);
 // A lektori kérdéslista szakaszai: három csoport és a belső jegyzetek; a belső jegyzetek szövege a csomagba nem kerül.
 assert.deepEqual(r3QuestionSections(),['Világítási kapcsolások (101–107)','Dugalj, kismegszakító, FI-relé','Földelési rendszerek, EPH, feszültségmentesítés',INTERNAL_NOTES]);
 const notes=readFileSync('content/tudastar/lektori-kerdesek-r3.md','utf8').split('## '+INTERNAL_NOTES)[1].split('\n').map(l=>l.replace(/^\s*(?:[-*]|\d+\.)\s+/,'').trim()).filter(l=>l.length>=30);
 assert.ok(notes.length>=3,'a belső jegyzetek szakasza nem üres');
 for(const n of notes)assert.ok(!md.includes(n.slice(0,60)),'belső jegyzet került a csomagba: '+n.slice(0,60));
 assert.ok(!md.includes(INTERNAL_NOTES),'a belső jegyzetek szakaszának címe sincs a csomagban');
}
// A jóváhagyó lap: ábránkénti döntés és a második olvasó (R3).
for(const t of ['### 4. rész – ábránkénti döntés','### 5. rész – cikkenkénti döntés','### 4–5. rész – második olvasó','| Második olvasó jogosultsága |','| Függetlenségi nyilatkozat: a program szerzőitől, fejlesztőitől és a csomag összeállítóitól független vagyok (igen / nem) |'])assert.ok(md.includes(t),'hiányzik: '+t);
assert.ok(declaration(out.pages).includes('4. (bekötési ábrák és biztonsági szabályok)')&&declaration(out.pages).includes('5. (R3 cikkvázlatok)')&&declaration(out.pages).includes('második olvasó'));
assert.ok(declaration(out.pages).includes('nem terjed ki a csomag 6. részére'),'a nyilatkozat a 6. részt (helyőrző) kizárja');
// PDF: a rajz a stíluslap színeivel (világos téma), és a rajz feliratai is a betűkészletből (a glyph-ellenőrzés fedi őket).
{
 const st=pdfDiagramStyles();
 assert.equal(cssColor(st.tokens,st.rules['w-l1'].stroke),'#8a4b22','L1/L barna');assert.equal(cssColor(st.tokens,st.rules['w-n'].stroke),'#2563b8','N kék');
 assert.equal(cssColor(st.tokens,st.rules['w-pe'].stroke),'#2e8b3e','PE zöld');assert.equal(cssColor(st.tokens,st.rules['w-pes'].stroke),'#f2c200','PE sárga csík');
 assert.equal(cssColor(st.tokens,st.rules['w-gap'].stroke),'#ffffff','a keresztezési rés a lap színe');
 assert.equal(st.rules['w-pes']['stroke-dasharray'],'5 5');
 for(const t of ['Kötődoboz','Betáp','Lakáselosztó','Föld (talaj)','IΔn'])assert.ok(out.texts.includes(t),'a PDF-rajz felirata: '+t);
}
// Az R3 cikk lektori rekordja (lib/kb/release.ts) a 4. rész kiküldött kiadásához kötött: az approvalRef az LK-n kiadást, annak
// csomag-ujjlenyomatát és a cikk ábráinak ujjlenyomat-párjait nevezi meg; eltérő (azóta módosított) ábra esetén hiba.
{
 const sent=[...EDITIONS.slice(0,-1),{...EDITION,sent:'2026-10-13'}];
 const pairs=diagramPairs(pkg),arts=articleDiagrams(pkg),ids=arts['valtokapcsolo-106-bekotese'];
 assert.deepEqual(ids,['valtokapcsolo-106']);
 const r=(ref:string):KbRelease=>({kind:'lektoralt',section:'semak',risk:'R3',qualification:'x',date:'2026-10-14',fingerprint:'00000000',approvalRef:ref,secondReader:'y'});
 const okRef=`LK-${EDITION.number} (${EDITION.content}); valtokapcsolo-106: ${pairs['valtokapcsolo-106']}`;
 assert.deepEqual(diagramRefProblems({'valtokapcsolo-106-bekotese':r(okRef)},arts,pairs,sent),[]);
 assert.ok(diagramRefProblems({'valtokapcsolo-106-bekotese':r(okRef)},arts,pairs,EDITIONS)[0].includes('kiküldöttként'),'ki nem küldött kiadásra nem hivatkozhat');
 assert.ok(diagramRefProblems({'valtokapcsolo-106-bekotese':r(okRef)},arts,{...pairs,'valtokapcsolo-106':'909db559/00000000'},sent)[0].includes('nem ezt az ábrát'),'az ábra azóta változott');
 assert.ok(diagramRefProblems({'valtokapcsolo-106-bekotese':r(`LK-${EDITION.number} (${EDITION.content})`)},arts,pairs,sent)[0].includes('ujjlenyomat-párja'),'a pár hiányzik a hivatkozásból');
 assert.deepEqual(diagramRefProblems({},arts,pairs),[],'most nincs R3 rekord');
}


// (k) 4. rész eleje: a szimulátor biztonsági szabályai (lib/kb/circuit-rules.ts) tételenként jóváhagyhatók; az ábra csak velük együtt.
{
 const rb=part4.blocks.find(b=>b.id==='BEK-SZABALYOK')!;
 assert.deepEqual(rb.items.map(i=>i.id),CIRCUIT_RULES.map(r=>'BEK-SZAB-'+r.code),'minden szabály tétel, a kódok sorrendjében');
 assert.ok(CIRCUIT_RULES.length>=24&&new Set(CIRCUIT_RULES.map(r=>r.code)).size===CIRCUIT_RULES.length);
 for(const r of CIRCUIT_RULES){const it=rb.items.find(i=>i.id==='BEK-SZAB-'+r.code)!;assert.ok(it.kind==='value'&&it.label.startsWith(r.code+' – ')&&it.value.startsWith(r.text),r.code+': a szabály szövege szó szerint');assert.ok(md.includes(r.text),r.code+': a Markdownban')}
 assert.ok(md.includes('a szimuláció ideális vezetőkkel, igen/nem alapon számol: áramerősséget, feszültséget és lekapcsolási időt nem'),'a szimuláció korlátja kimondva');
}

// (l) 5. rész: az R3 cikkvázlatok szövege. A lektor a SZÖVEGET is jóváhagyja: minden vázlat saját CIK-blokkot kap a teljes szöveggel, a tartalmi
// ujjlenyomattal (ez kerül az EDITIONS-be és a Tudástár kiadási rekordjába), a kérdésekkel és a döntési sorral; a kiadást még akadályozó
// hiányt a csomag megnevezi.
const part5=pkg.parts[4],arts=r3Articles();
assert.equal(part5.no,5);
assert.equal(arts.length,13,'13 R3 vázlat');
assert.deepEqual(readdirSync('content/tudastar/r3').filter(f=>f.endsWith('.md')).sort(),arts.map(a=>a.file.split('/').pop()!).sort(),'minden R3 vázlat benne van');
assert.deepEqual(part5.blocks.map(b=>b.id),arts.map(a=>articleId(a.slug)),'minden vázlat saját blokkot kap, azonosító szerint rendezve');
assert.deepEqual(pkg.articles.map(a=>a.slug),arts.map(a=>a.slug));
// A BLOCKED lista pontosan azokat a vázlatokat nevezi meg, amelyekből a generátor (ábra-ujjlenyomattal) még nem tud cikket készíteni.
{
 const notBuildable=arts.filter(a=>{try{articleFromDraft(a.file,readFileSync(a.file,'utf8'),'.');return false}catch{return true}}).map(a=>a.slug).sort();
 assert.deepEqual(notBuildable,Object.keys(BLOCKED).sort(),'a BLOCKED lista nem az éppen nem kiadható vázlatokat nevezi meg');
 assert.equal(Object.keys(BLOCKED).length,4);
}
for(const a of arts){
 const id=articleId(a.slug),b=part5.blocks.find(x=>x.id===id)!,row=pkg.articles.find(x=>x.slug===a.slug)!;
 const full=articleFromDraft(a.file,readFileSync(a.file,'utf8'),'.',{figures:false});
 assert.equal(a.fingerprint,full.meta.fingerprint,id+': a tartalmi ujjlenyomat a Tudástár-motoré');
 assert.deepEqual([row.block,row.fingerprint,row.blocked],[id,a.fingerprint,BLOCKED[a.slug]],id+': a cikksor');
 assert.ok(b.article&&b.title===a.title&&b.intro.join(' ').includes('Tartalmi ujjlenyomat: '+a.fingerprint),id+': blokk és ujjlenyomat');
 assert.ok(md.includes(`| ${a.title} | ${id} | ${a.fingerprint} | ${BLOCKED[a.slug]??'–'} | ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom |`),id+': cikkenkénti döntés sora');
 assert.ok(md.includes(`**Döntés (${id}):** ☐ Jóváhagyom · ☐ Javítással · ☐ Elutasítom`),id+': döntés a blokk végén');
 assert.deepEqual(b.items.map(i=>i.id),[id+'-SZOVEG',id+'-FORRAS',...(a.figures.some(f=>f.netlist)?[id+'-ABRA']:[])],id+': tételek');
 // A teljes szöveg a csomagban van: minden bekezdés, lista- és táblázatsor, a veszély-doboz szövege, a források.
 let n=0;
 for(const x of flatten(a.blocks)){
  const texts=x.k==='callout'?[x.label,x.text]:x.k==='p'?[x.text]:x.k==='h2'?[x.text]:x.k==='list'?x.items:x.k==='table'?[...x.head,...x.rows.flat()]:[x.caption];
  for(const t of texts){n++;assert.ok(md.includes(t.replace(/\|/g,'\\|')),id+': a cikk szövege hiányzik a csomagból: '+t.slice(0,60))}
 }
 assert.ok(n>=8,id+': a cikknek van szövege');
 for(const src of a.sources)assert.ok(md.includes(`| ${src.standard} | ${src.kiadas} | ${src.pont} |`),id+': forrás: '+src.standard);
 assert.ok(flatten(a.blocks).some(x=>x.k==='callout'),id+': van veszély-doboz');
 // A cikk saját kérdései egyedi azonosítóval és válaszmezővel; az ábrahelyőrző a 4. rész blokkjára vagy a hiányra mutat.
 assert.deepEqual((b.questions??[]).map(q=>q.text),a.questions,id+': saját kérdések');
 a.questions.forEach((q,k)=>assert.ok((b.questions??[])[k].id===`${id}-Q${k+1}`&&md.includes(`Válasz (${id}-Q${k+1}):`),id+': kérdés-azonosító'));
 // A 4. részre csak valódi BEK-blokkal mutathat (a netlista nélküli ábra nincs a csomagban: az csak kiadást akadályozó hiány lehet).
 for(const f of flatten(a.blocks).filter(x=>x.k==='figure')){
  const fid=(f as {id:string}).id,ref=figureRef(a,fid),fm=a.figures.find(x=>x.id===fid);
  if(fm?.netlist)assert.ok(/^a rajz a 4\. részben: BEK-[A-Z0-9-]+(, BEK-[A-Z0-9-]+)*$/.test(ref)&&ref.split(', ').every(r=>md.includes('### '+r.replace(/^a rajz a 4\. részben: /,'')+' – ')),id+': ábrahivatkozás a 4. rész létező blokkjára ('+ref+')');
  else assert.ok(!!a.blocked&&ref==='ez az ábra még nincs kész (a cikk kiadását akadályozza)',id+': a netlista nélküli '+fid+' ábra nincs a csomagban – csak kiadást akadályozó hiány lehet ('+ref+')');
 }
 const hasBlock=md.includes(`### ${id} – ${a.title}`);assert.ok(hasBlock,id+': blokkcím');
}
// A blokkolt cikkeknél a hiány a blokk bevezetőjében és az 5. rész állapotsorában is szerepel.
for(const [slug,why] of Object.entries(BLOCKED)){
 const b=part5.blocks.find(x=>x.id===articleId(slug))!;
 assert.ok(b.intro.join(' ').includes(why)&&md.includes(`${slug} – ${why}`),slug+': a hiány a bevezetőben és az 5. rész állapotsorában');
}
assert.equal(part5.blocks.filter(b=>b.intro.join(' ').includes('kiadásához a szöveg jóváhagyásán túl még hiányzik')).length,4);
// Becsült idő: a szöveg szó szerinti átolvasása (110 szó/perc) + kérdésenként 4 perc + döntés 5 perc.
for(const a of arts)assert.equal(part5.blocks.find(x=>x.id===articleId(a.slug))!.minutes,Math.ceil(a.words/110)+4*a.questions.length+5);
// Az 5. rész a lektor ráfordításában is szerepel.
assert.ok(md.includes('a lektori kérdésekre kérdésenként 4 percet, az 5. részben a cikkvázlatok gondos átolvasását'),'a ráfordítás-becslés leírja az 5. részt');

// A cikkek a Tudástár lektori rekordjához kötődnek (R3: csak lektor után; a rekord teljes és a kiadott csomag ujjlenyomatára hivatkozik).
{
 const sent=[...EDITIONS.slice(0,-1),{...EDITION,sent:'2026-10-13'}],ap=articlePairs(pkg),fp=ap['kismegszakito'];
 const rec=(over:Partial<Extract<KbRelease,{kind:'lektoralt'}>>={}):KbRelease=>({kind:'lektoralt',section:'semak',risk:'R3',qualification:'villamos tervező',date:'2026-10-14',fingerprint:fp,approvalRef:`LK-${EDITION.number} (${EDITION.content}); kismegszakito: ${fp}`,secondReader:'második olvasó',...over});
 assert.deepEqual(articleRefProblems({kismegszakito:rec()},ap,sent),[],'érvényes, teljes rekord');
 assert.deepEqual(articleRefProblems({},ap,sent),[],'most nincs R3 rekord');
 assert.ok(articleRefProblems({kismegszakito:rec()},ap,EDITIONS)[0].includes('kiküldöttként'),'ki nem küldött kiadásra nem hivatkozhat');
 assert.ok(articleRefProblems({kismegszakito:rec({fingerprint:'00000000'})},ap,sent).some(p=>p.includes('nem ezt a szöveget')),'a szöveg azóta változott: a rekord ujjlenyomata nem az LK-é');
 assert.ok(articleRefProblems({kismegszakito:rec({approvalRef:`LK-${EDITION.number} (${EDITION.content})`})},ap,sent).some(p=>p.includes('approvalRef')),'az approvalRef nevezze meg a cikk ujjlenyomatát');
 assert.ok(articleRefProblems({'ismeretlen-cikk':rec()},ap,sent).some(p=>p.includes('nincs a csomag 5. részében')),'a csomagban nem szereplő cikk nem hagyható jóvá');
 assert.ok(articleRefProblems({kismegszakito:rec({secondReader:undefined})},ap,sent).some(p=>p.includes('hiányos')&&p.includes('secondReader')),'R3-nál második olvasó kell');
 assert.ok(articleRefProblems({kismegszakito:rec({qualification:''})},ap,sent).some(p=>p.includes('hiányos')),'jogosultság nélkül hiányos');
 assert.deepEqual(r3RecordGaps(rec()),[]);
 assert.ok(r3RecordGaps(rec({date:''})).some(g=>g.includes('(date)'))&&r3RecordGaps(rec({approvalRef:' '})).some(g=>g.includes('(approvalRef)'))&&r3RecordGaps(rec({secondReader:''})).some(g=>g.includes('(secondReader)')));
}

// (m) A KIRAJZOLT PDF ellenőrzése a modellel szemben (pdfProblems): minden blokk, tábla, ábra, kérdés és válaszmező kirajzolódott; mutációs
// próbák: szándékosan hibás kirajzolás (PdfFaults) esetén az ellenőrzés elbukik.
{
 assert.deepEqual(pdfProblems(pkg,out.info,out.texts),[],'a PDF teljes');
 const m=out.info.margins;assert.ok(m.left>=10&&m.right<=200&&m.top>=10&&m.bottom<=290,'margók');
 for(const b of pkg.parts.flatMap(pt=>pt.blocks)){const bi=out.info.blocks[b.id];assert.ok(bi&&bi.pages[0]>=1&&bi.pages[1]<=out.pages,b.id+': oldaltartomány');if(b.diagram)assert.ok(bi.diagram!.minPt>=PDF_MIN_LABEL_PT,b.id+': ábrafelirat ≥ '+PDF_MIN_LABEL_PT+' pt: '+bi.diagram!.minPt.toFixed(2))}
 const probe=(faults:Parameters<typeof renderPdf>[2],expect:RegExp,what:string)=>{const r=renderPdf(pkg,font,faults);assert.ok(pdfProblems(pkg,r.info,r.texts).some(p=>expect.test(p)),'a PDF-ellenőrzés nem veszi észre: '+what)};
 const nid='valtokapcsolo-106';
 probe({skipDiagram:nid},/az ábra nem rajzolódott ki/,'a hiányzó ábrát');
 probe({skipTruth:nid},/kapcsolóállás-táblázat 0 sora/,'a hiányzó kapcsolóállás-táblázatot');
 probe({truncateWires:{id:nid,rows:1}},/vezetéktábla 1 sora/,'a csonkolt vezetéktáblát');
 probe({diagramScale:{id:nid,scale:1.5}},/kilóg a lap margójáról/,'a margóról kilógó ábrát');
 probe({diagramScale:{id:nid,scale:0.15}},/legkisebb ábrafelirat/,'a túl kicsi ábrafeliratot');
 // A hiányzó kérdés-azonosító vagy cikkcím a kirajzolt szövegben is észrevehető.
 const missing=out.texts.filter(t=>!t.includes('BEK-VIL-Q1'));
 assert.ok(pdfProblems(pkg,out.info,missing).some(p=>p.includes('BEK-VIL-Q1')),'a PDF szövegéből hiányzó kérdés-azonosítót jelzi');
}

const counts=pkg.parts.map(p=>p.blocks.reduce((s,b)=>s+b.items.length,0));
console.log(`PASS: lektori csomag – ${editionLabel()}, ${counts[0]+counts[1]+counts[2]+counts[3]+counts[4]} tétel (1. rész ${counts[0]}, 2. rész ${counts[1]}, 3. rész ${counts[2]}, 4. rész ${counts[3]} – 20 bekötési ábra, 5. rész ${counts[4]} – ${arts.length} cikkvázlat), ${checks.length} programmal összevetett eset, ${out.pages} PDF-oldal; naprakész, ujjlenyomatok: 1. rész ${pkg.fingerprints.tables}, 2. rész ${pkg.fingerprints.formulas}, 3. rész ${pkg.fingerprints.calculators}, 4. rész ${pkg.fingerprints.diagrams}, 5. rész ${pkg.fingerprints.articles}.`);
