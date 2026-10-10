import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {join} from 'node:path';
import {seed,validatePlan,type Plan} from '../lib/plan';
import {circuitReport} from '../lib/circuit-report';
import {checkPlan} from '../lib/plan-checks';
import {createPlanPdf} from '../lib/pdf-export';
import {sharedPlan} from '../lib/share';
import {SIZING_TABLES,tablesApproved,temperatureFactor} from '../lib/sizing-tables';
import {atMost,boardSizing,checkStatusLabels,circuitSizing,designCurrent,fmtPair,hasSizingTarget,loopResistance,maxLengthForDrop,maxLoopImpedance,minSectionFor,parseCable,parseDecimalInput,projectSizing,removeOverride,resultLabel,setBoardSizing,setCircuitLoad,setCircuitSizing,setPlanSizing,sizingContext,sizingPdfRows,sizingReasonRows,sizingTarget,statusLabels,upsertOverride,voltageDropPercent,SIZING_DISCLAIMER,SIZING_PDF_LEGEND,type CircuitSizingResult} from '../lib/sizing';

const fresh=()=>validatePlan(structuredClone(seed));
const near=(a:number|null|undefined,b:number,e=1e-6)=>assert.ok(a!==null&&a!==undefined&&Math.abs(a-b)<e,`${a} != ${b}`);
const size=(p:Plan,id:string)=>circuitSizing(p,id)!;
const check=(r:CircuitSizingResult,code:string)=>r.checks.find(c=>c.code===code)!;
const circuit=(p:Plan,id:string)=>p.circuits.find(c=>c.id===id)!;
const route=(p:Plan,id:string)=>p.buildings.flatMap(b=>b.floors).flatMap(f=>f.routes).find(r=>r.id===id)!;
// Kézzel számolt állandók (a táblázatokból): ρ1 = 0,0225 Ω·mm²/m, U0 = 230 V.
const rho=0.0225,U0=230;
// A táblázatok állapota a jóváhagyástól függ (a tesztnek jóváhagyás után is zöldnek kell maradnia).
const st=tablesApproved()?'jóváhagyott':'ellenőrizendő';

// 1. parseCable
const ok=(text:string)=>{const r=parseCable(text);assert.ok(r.ok,text+': '+JSON.stringify(r));return r.cable};
const bad=(text:string,code:string)=>{const r=parseCable(text);assert.ok(!r.ok&&r.code===code,text+' → '+JSON.stringify(r))};
const cableMsg=(text:string)=>{const r=parseCable(text);return r.ok?'':r.message};
assert.deepEqual({...ok('3 × 2,5 mm²'),text:''},{text:'',cores:3,section:2.5,insulation:null});
for(const t of ['3x2.5','3X2,5','3x2,5mm2','3*2,5','3 x 2.5 mm^2'])assert.equal(ok(t).section,2.5,t);
assert.equal(ok('NYM-J 3x1,5').insulation,'PVC');assert.equal(ok('NYM-J 3x1,5').section,1.5);
assert.deepEqual([ok('5G6').cores,ok('5G6').section],[5,6]);
assert.deepEqual([ok('H07V-U 2,5 mm²').cores,ok('H07V-U 2,5 mm²').section,ok('H07V-U 2,5 mm²').insulation],[null,2.5,'PVC']);
assert.equal(ok('MCu 2,5').section,2.5);assert.equal(ok('MCu 2,5').cores,null);
assert.equal(ok('N2XH 3×4').insulation,'XLPE');assert.equal(ok('N2XH 3×4').section,4);
assert.equal(ok('NHXH-J 3x1,5').insulation,null);
for(const t of ['NAYY 4x16','Al 4x16','alu 3x2,5','AYKY 4x10'])bad(t,'aluminium');
assert.equal(ok('alá 3x2,5').section,2.5,'az „alá” szó nem alumínium');
bad('','empty');bad('   ','empty');bad('Cat6','unknown');
bad('3 × 2,5 + 1 × 1,5','reduced');bad('3x2,5 / 1,5 mm2','reduced');
assert.equal(ok('4x2.5/2.5').section,2.5);
bad('3 × 3 mm²','nonstandard');bad('3 × 50 mm²','large');
assert.equal(ok('2 × 0,75').section,0.75);
const msg=parseCable('Cat6');assert.ok(!msg.ok&&msg.message.includes('3 × 2,5 mm²'));

// Képletek kézzel számolt értékekkel.
near(designCurrent(2300,'L1',1),10);near(designCurrent(6900,'3P',1),10);near(designCurrent(2300,'L1',0.5),20);
near(voltageDropPercent({b:2,length:10,current:10,section:2.5,cosPhi:1}),2*10*10*rho/2.5/U0*100);
near(loopResistance(10,2.5),rho*10*(2/2.5));near(loopResistance(10,2.5,1.5),rho*10*(1/2.5+1/1.5));
near(maxLoopImpedance('B',16),230/80);near(maxLoopImpedance('C',16),230/160);near(maxLoopImpedance('D',16),230/320);
near(maxLengthForDrop(5,2,16,2.5,1),0.05*230/(2*16*rho/2.5));
assert.equal(minSectionFor(25,'B2','PVC',2,1,1),4);assert.equal(minSectionFor(16,'B2','PVC',2,0.87,0.7),4);assert.equal(minSectionFor(200,'A2','PVC',3,1,1),null);

// 2. Seed, beállítás nélkül.
let p=fresh();const before=JSON.stringify(p);
const c1=size(p,'c1');
// Vízszintes 360 + 320 + 120 px = 20 m; függőleges (2,6 − 1,5) + (2,6 − 0,3) = 3,4 m.
near(c1.length,23.4);near(c1.length,circuitReport(p,'c1')!.length.total);
assert.deepEqual(c1.segments[0].method,{value:'B2',source:'alapérték'});
assert.equal(c1.segments[0].panelLinked,true);assert.equal(c1.iz,23);
near(c1.ib,600/230);assert.equal(c1.ibSource,'becsült');assert.equal(c1.dropCurrentSource,'In');assert.equal(c1.dropCurrent,16);
near(c1.drop,2.930086956521739);near(c1.drop,2*23.4*16*rho/2.5/U0*100);
assert.equal(c1.dropLimit,5);assert.equal(c1.status,'ok');
assert.equal(c1.label,'Számítás szerint megfelel – feltételezésekkel; nem vizsgált: hurokimpedancia');assert.equal(resultLabel(c1),c1.label);
assert.ok(c1.assumptions.some(a=>a.strong&&a.text.includes('30 °C')));
assert.ok(c1.assumptions.some(a=>a.strong&&a.text.includes('Együtt vezetett')));
assert.ok(!c1.assumptions.some(a=>a.text.startsWith('cos φ')),'becsült terhelésnél a cos φ nem feltételezés');
assert.deepEqual(c1.checks.map(c=>c.code),['cable','section','cores','length','design-current','overload','i2','voltage-drop','loop']);
assert.equal(check(c1,'overload').calculation,`Iz0 = 23 A [B.52.2 · B2 · 2,5 mm² · 2 terhelt ér · ${st}] · kθ = 1 [B.52.14 · 30 °C · ${st}] · kcs = 1 [B.52.17 · 1 áramkör · ${st}] = 23 A; In = 16 A ≤ 23 A`);
assert.equal(check(c1,'i2').calculation,'I2 = 1,45 · 16 = 23,2 A ≤ 1,45 · 23 = 33,35 A');
assert.ok(check(c1,'voltage-drop').calculation.startsWith('ΔU = 2 · 23,4 m · 16 A · 0,0225 Ω·mm²/m / 2,5 mm² / 230 V · 100 = 2,93%'));
assert.ok(check(c1,'voltage-drop').calculation.endsWith('összesen 2,93% ≤ 5% (egyéb, közcélú hálózat)'));
assert.equal(check(c1,'cable').calculation,'Felismert: 3 × 2,5 mm²');
assert.ok(c1.refs.some(r=>r.label==='Iz0'&&r.value===23&&r.status===st));
assert.ok(!c1.refs.some(r=>r.label==='λ'||r.label==='m'),'csak a ténylegesen felhasznált értékek');
const c2=size(p,'c2');
assert.equal(c2.status,'na');assert.equal(c2.length,null);assert.equal(check(c2,'length').status,'na');assert.equal(check(c2,'voltage-drop').status,'na');
assert.equal(check(c2,'overload').status,'ok');assert.equal(c2.iz,23);assert.equal(c2.segments[0].routeId,null);
assert.ok(c2.assumptions.some(a=>a.text.startsWith('Nincs nyomvonal')));
const c3=size(p,'c3');
assert.equal(c3.iz,16.5);assert.equal(c3.dropLimit,3);assert.deepEqual(c3.usage,{value:'lighting',source:'automatikus'});
// Vízszintes 140 + 160 px = 7,5 m; függőleges (2,6 − 1,1) + 0 = 1,5 m → 9 m; becsült terhelés → In = 10 A.
near(c3.drop,1.1739130434782608);near(c3.drop,2*9*10*rho/1.5/U0*100);
assert.equal(check(c3,'length').status,'warn');assert.equal(c3.status,'warn');assert.equal(c3.label,'Figyelmeztetés');
for(const r of [c1,c2,c3])assert.equal(check(r,'loop').status,'skipped');
assert.equal(JSON.stringify(p),before,'a számítás nem módosítja a tervet');

// 3. Hőmérséklet és csoportosítás.
p=fresh();circuit(p,'c1').sizing={ambient:40,grouped:3};
let r=size(p,'c1');assert.equal(r.kTemp,0.87);assert.equal(r.kGroup,0.7);near(r.iz,23*0.87*0.7);near(r.iz,14.007);
assert.equal(check(r,'overload').status,'fail');assert.equal(check(r,'i2').status,'fail');assert.equal(r.status,'fail');
assert.ok(check(r,'overload').detail.includes('legalább 4 mm²'));
assert.deepEqual(r.ambient,{value:40,source:'megadott'});
circuit(p,'c1').rating=13;r=size(p,'c1');assert.equal(r.status,'ok');near(r.drop,2.380695652173913);near(r.drop,2*23.4*13*rho/2.5/U0*100);
circuit(p,'c1').sizing={ambient:33};r=size(p,'c1');assert.equal(r.kTemp,0.94);near(r.iz,21.62);
circuit(p,'c1').sizing={grouped:10};circuit(p,'c1').rating=16;r=size(p,'c1');assert.equal(r.kGroup,0.45);near(r.iz,10.35);assert.equal(r.status,'fail');

// 4. Módprioritás: áramköri > projekt > alapérték.
p=fresh();circuit(p,'c3').rating=16;circuit(p,'c3').sizing={method:'A2'};
r=size(p,'c3');assert.equal(r.iz,14);assert.equal(r.status,'fail');assert.equal(r.segments[0].method.source,'megadott');
p=fresh();p.sizing={methodOutside:'C'};r=size(p,'c3');assert.equal(r.iz,19.5);assert.equal(r.segments[0].method.source,'projekt');
assert.equal(size(p,'c1').segments[0].method.source,'alapérték','a falon kívüli projektmód nem érinti a falon belüli nyomvonalat');
p.sizing={methodInside:'A1'};assert.equal(size(p,'c2').iz,19.5,'nyomvonal nélkül a falon belüli projektmód érvényes');

// 5. Háromfázisú áramkör megadott hosszal.
p=fresh();p.circuits.push({id:'c3p',name:'Főzőlap',building:'house',phase:'3P',rating:25,curve:'C',cable:'5 × 6 mm²',rcd:'',load:11000,sizing:{method:'C',length:40}});
assert.doesNotThrow(()=>validatePlan(p));
r=size(p,'c3p');assert.equal(r.loaded,3);near(r.ib,15.942028985507246);near(r.ib,11000/(3*230));assert.equal(r.iz,41);
near(r.drop,1.0396975425330812);near(r.drop,1*40*(11000/690)*rho/6/U0*100);assert.equal(r.lengthSource,'megadott');
assert.equal(r.deviceAssumed,true);assert.equal(r.status,'ok');assert.equal(check(r,'cores').status,'ok');
assert.ok(r.assumptions.some(a=>a.text.includes('kismegszakító (MCB) feltételezve')));

// 6. Feszültségesés megadott terheléssel.
p=fresh();p.circuits.push({id:'cfar',name:'Távoli dugalj',building:'house',phase:'L1',rating:16,curve:'B',cable:'3 × 1,5 mm²',rcd:'',load:3000,sizing:{method:'C',length:30}});
r=size(p,'cfar');assert.equal(r.iz,19.5);near(r.drop,5.103969754253308);near(r.drop,2*30*(3000/230)*rho/1.5/U0*100);
assert.equal(check(r,'voltage-drop').status,'fail');assert.equal(r.status,'fail');
assert.ok(check(r,'voltage-drop').detail.includes('legfeljebb kb. '));
assert.ok(r.assumptions.some(a=>a.strong&&a.text==='cos φ = 1 (alapérték).'));
setCircuitSizing(p,'cfar',{cosPhi:0.9});r=size(p,'cfar');near(r.ib,14.492753623188404);
const sin=Math.sqrt(1-0.81);near(r.drop,5.117153569583486);near(r.drop,2*30*(3000/230/0.9)*(rho*0.9/1.5+0.00008*sin)/U0*100);
assert.ok(r.refs.some(x=>x.label==='λ'),'cos φ < 1 esetén λ is felhasznált érték');
setCircuitSizing(p,'cfar',{cosPhi:undefined});setCircuitLoad(p,'cfar',undefined);r=size(p,'cfar');
assert.equal(r.dropCurrent,16);near(r.drop,6.260869565217391);assert.equal(check(r,'voltage-drop').status,'warn');assert.equal(r.status,'warn');
setCircuitLoad(p,'cfar',4000);r=size(p,'cfar');near(r.ib,17.391304347826086);assert.equal(check(r,'design-current').status,'fail');

// 7. Legkisebb keresztmetszet.
p=fresh();circuit(p,'c1').cable='3 × 1 mm²';route(p,'r1').cable='3 × 1 mm²';
r=size(p,'c1');assert.equal(check(r,'section').status,'fail');assert.equal(check(r,'section').calculation,'A = 1 mm² < 1,5 mm²');assert.equal(check(r,'overload').status,'na');assert.equal(r.status,'fail');

// 8. Elosztó előtti feszültségesés.
p=fresh();p.sizing={boards:[{building:'house',board:'',upstreamDrop:2.5}]};
r=size(p,'c1');near(r.dropTotal,5.430086956521739);assert.equal(check(r,'voltage-drop').status,'warn');
setCircuitLoad(p,'c1',600);r=size(p,'c1');near(r.drop,0.47773156899810953);near(r.dropTotal,2.9777315689981094);assert.equal(check(r,'voltage-drop').status,'ok');
assert.deepEqual(r.upstreamDrop,{value:2.5,source:'megadott'});

// 9. Hurokimpedancia (Zs megadva).
p=fresh();p.sizing={boards:[{building:'house',board:'',zs:0.35}]};
r=size(p,'c1');near(r.zs,0.7712);near(r.zs,0.35+rho*23.4*(1/2.5+1/2.5));near(r.zsMax,2.875);assert.equal(check(r,'loop').status,'ok');
assert.ok(r.refs.some(x=>x.label==='m'&&x.value===5)&&r.refs.some(x=>x.label==='cmin'));
assert.ok(r.assumptions.some(a=>a.text==='Földelési rendszer: TN (alapérték).'));
circuit(p,'c1').curve='C';r=size(p,'c1');near(r.zsMax,1.4375);assert.equal(check(r,'loop').status,'ok');
circuit(p,'c1').curve='D';r=size(p,'c1');near(r.zsMax,0.71875);assert.equal(check(r,'loop').status,'warn');
circuit(p,'c1').rcd='';r=size(p,'c1');assert.equal(check(r,'loop').status,'fail');
setPlanSizing(p,{earthing:'TT'});r=size(p,'c1');assert.equal(check(r,'loop').status,'skipped');
p=fresh();const statusWithout=size(p,'c1').status;assert.equal(check(size(p,'c1'),'loop').status,'skipped');assert.equal(statusWithout,'ok');

// 10. Kábel-fallback.
p=fresh();route(p,'r1').cable='Cat6';r=size(p,'c1');assert.equal(check(r,'cable').status,'warn');assert.equal(r.segments[0].cableSource,'áramkör');assert.equal(r.iz,23);
p=fresh();circuit(p,'c2').cable='NAYY 3x2,5';r=size(p,'c2');assert.equal(check(r,'cable').status,'na');assert.ok(check(r,'cable').detail.startsWith('Az áramkör kábele: Alumínium'));
circuit(p,'c2').cable='';r=size(p,'c2');assert.equal(check(r,'cable').status,'na');assert.equal(r.status,'na');assert.equal(r.cableText,'nem értelmezhető');
p=fresh();route(p,'r1').cable='3 × 4 mm²';r=size(p,'c1');assert.equal(check(r,'cable').status,'warn');assert.ok(check(r,'cable').detail.includes('(4 mm²) eltér az áramkörétől (2,5 mm²)'));
assert.equal(r.iz,30);near(r.drop,2*23.4*16*rho/4/U0*100);
p=fresh();route(p,'r1').cable='NAYY 3x2,5';r=size(p,'c1');assert.equal(check(r,'cable').status,'na','alumínium nyomvonalnál nem cseréljük rézre');

// 11. Projekt-felülírás.
p=fresh();p.sizing={overrides:[{method:'B2',insulation:'PVC',loaded:2,section:2.5,iz:21,note:'Gyártói katalógus, 12. o.'}]};
r=size(p,'c1');assert.equal(r.iz,21);assert.ok(r.refs.some(x=>x.status==='projekt-felülírás'));
assert.ok(check(r,'overload').calculation.includes('projekt-felülírás'));

// 12. XLPE: PVC-tartalék, feltételezésként.
p=fresh();circuit(p,'c1').cable='N2XH 3x2,5';route(p,'r1').cable='N2XH 3x2,5';
r=size(p,'c1');assert.deepEqual(r.segments[0].insulation,{value:'XLPE',source:'kábeljelölés'});assert.equal(r.iz,23);
assert.ok(r.assumptions.some(a=>a.text.includes('PVC-táblázat értékeivel')));

// 13. Több szint.
p=fresh();p.buildings[0].floors.find(f=>f.id==='upper')!.routes.push({id:'r-up',name:'Emeleti folytatás',points:[{x:200,y:200},{x:400,y:200}],mode:'inside',circuit:'c1',cable:'3 × 2,5 mm²'});
p=validatePlan(p);r=size(p,'c1');assert.equal(check(r,'length').status,'warn');assert.ok(check(r,'length').detail.includes('több szinten'));
near(r.length,23.4+5+2*(2.6-2.6));

// 14. Séma.
p=fresh();p.sizing={methodInside:'A2',methodOutside:'C',insulation:'PVC',ambient:35,grouped:2,supply:'private',earthing:'TN',boards:[{building:'house',board:'',upstreamDrop:1,zs:0.4}],overrides:[{method:'B2',insulation:'XLPE',loaded:2,section:2.5,iz:28,note:'Gyártói adat'}]};
circuit(p,'c1').sizing={method:'B1',insulation:'PVC',ambient:25,grouped:4,length:30,cosPhi:0.95,usage:'other'};
assert.doesNotThrow(()=>validatePlan(p));
const invalid:[string,(q:Plan)=>void][]=[
 ['method D1',q=>{(q.circuits[0] as {sizing?:unknown}).sizing={method:'D1'}}],
 ['ambient 5',q=>{q.circuits[0].sizing={ambient:5}}],
 ['grouped 0',q=>{q.circuits[0].sizing={grouped:0}}],
 ['cosPhi 0,4',q=>{q.circuits[0].sizing={cosPhi:0.4}}],
 ['override section 3',q=>{q.sizing={overrides:[{method:'B2',insulation:'PVC',loaded:2,section:3,iz:20,note:'Valami'}]}}],
 ["override note ''",q=>{q.sizing={overrides:[{method:'B2',insulation:'PVC',loaded:2,section:2.5,iz:20,note:''}]}}],
 ['elosztó zs 0',q=>{q.sizing={boards:[{building:'house',board:'',zs:0}]}}],
];
for(const [name,mutate] of invalid){const q=fresh();mutate(q);assert.throws(()=>validatePlan(q),Error,name)}
const pruned=fresh();pruned.sizing={boards:[{building:'nincs',board:'',zs:1},{building:'house',board:'',zs:0.3},{building:'house',board:'',zs:0.9}],overrides:[{method:'B2',insulation:'PVC',loaded:2,section:2.5,iz:21,note:'Első'},{method:'B2',insulation:'PVC',loaded:2,section:2.5,iz:19,note:'Második'}]};
const v=validatePlan(pruned);assert.deepEqual(v.sizing!.boards,[{building:'house',board:'',zs:0.3}]);assert.equal(v.sizing!.overrides!.length,1);assert.equal(v.sizing!.overrides![0].note,'Első');
const orphan=fresh();orphan.sizing={boards:[{building:'nincs',board:''}]};assert.equal('sizing' in validatePlan(orphan),false,'csak árva bejegyzésből álló beállítás eltűnik');
assert.equal('sizing' in validatePlan(structuredClone(seed)),false);
assert.ok(validatePlan(structuredClone(seed)).circuits.every(c=>!('sizing' in c)));
assert.deepEqual(validatePlan(JSON.parse(JSON.stringify(p))),validatePlan(p));
const vp=validatePlan(p);assert.deepEqual(validatePlan(JSON.parse(JSON.stringify(vp))),vp,'JSON round-trip');

// 15. Mutáló segédek.
p=fresh();setCircuitSizing(p,'c1',{ambient:40});assert.deepEqual(circuit(p,'c1').sizing,{ambient:40});
setCircuitSizing(p,'c1',{ambient:undefined});assert.equal(circuit(p,'c1').sizing,undefined);assert.ok(!('sizing' in circuit(p,'c1')));
setBoardSizing(p,'house','',{zs:0.4});setBoardSizing(p,'house','',{upstreamDrop:1});assert.deepEqual(p.sizing,{boards:[{building:'house',board:'',zs:0.4,upstreamDrop:1}]});
setBoardSizing(p,'house','',{zs:undefined,upstreamDrop:undefined});assert.equal(p.sizing,undefined);
const o={method:'B2' as const,insulation:'PVC' as const,loaded:2 as const,section:2.5,iz:21,note:'Első forrás'};
const sizingOf=(q:Plan)=>q.sizing;
upsertOverride(p,o);upsertOverride(p,{...o,iz:22,note:'Második forrás'});assert.equal(sizingOf(p)!.overrides!.length,1);assert.equal(sizingOf(p)!.overrides![0].iz,22);
removeOverride(p,'B2|PVC|2|2.5');assert.equal(p.sizing,undefined);
setPlanSizing(p,{supply:'private'});assert.deepEqual(p.sizing,{supply:'private'});setPlanSizing(p,{supply:undefined});assert.equal(p.sizing,undefined);
setCircuitLoad(p,'c1',1200);assert.equal(circuit(p,'c1').load,1200);setCircuitLoad(p,'c1',undefined);assert.ok(!('load' in circuit(p,'c1')));
assert.doesNotThrow(()=>validatePlan(p));

// 16. Tervellenőrzés.
assert.ok(!checkPlan(fresh()).some(i=>i.code.startsWith('sizing-')),'opció nélkül változatlan');
let issues=checkPlan(fresh(),{sizing:true}).filter(i=>i.code.startsWith('sizing-'));
assert.equal(issues.length,1);assert.equal(issues[0].code,'sizing-na');assert.equal(issues[0].level,'missing');
assert.equal(issues[0].target.type,'modules');assert.equal(issues[0].target.id,'m3');assert.equal(issues[0].target.title,'Hálószoba dugaljak');
assert.ok(issues[0].detail.endsWith('Részletek: Eszközök → Méretezés.'));assert.ok(issues[0].detail.includes('Nincs az áramkörhöz rendelt alaprajzi nyomvonal'));
p=fresh();circuit(p,'c1').rating=25;
const all=checkPlan(p,{sizing:true});issues=all.filter(i=>i.code.startsWith('sizing-'));
const failIssue=issues.find(i=>i.code==='sizing-fail')!;assert.equal(failIssue.level,'review');assert.equal(failIssue.target.id,'m2');assert.equal(failIssue.title,'Méretezési segédszámítás: nem felel meg');
assert.ok(failIssue.detail.startsWith('In ≤ Iz: ')&&!failIssue.detail.includes('I2 ≤'),'az I2-feltétel MCB-nél ismétlés, nem foglal helyet');
assert.equal(new Set(all.map(i=>i.id)).size,all.length);
assert.deepEqual(checkPlan(fresh()),checkPlan(fresh(),{sizing:false}));

// 17. sizingTarget.
p=fresh();assert.equal(sizingTarget(p,'c1')!.id,'m2');assert.equal(sizingTarget(p,'c1')!.subtitle,'Családi ház / Főelosztó · Q1');
p.modules=p.modules.filter(m=>m.circuit!=='c1');const t=sizingTarget(p,'c1')!;assert.equal(t.type,'routes');assert.equal(t.id,'r1');assert.equal(t.floorId,'ground');
p.circuits.push({id:'lonely',name:'Tartalék',building:'house',phase:'L1',rating:16,curve:'B',cable:'3 × 2,5 mm²',rcd:''});assert.equal(sizingTarget(p,'lonely'),null);
assert.equal(sizingTarget(p,'nincs'),null);assert.equal(circuitSizing(p,'nincs'),null);

// 18. Csoportosítás.
p=fresh();assert.deepEqual(boardSizing(p,'house').map(r=>r.circuitId),['c1','c2','c3']);
assert.deepEqual(projectSizing(p,'garage'),[]);
p.buildings[0].extraBoards=[{id:'sub',name:'Emeleti elosztó',rows:2,modulesPerRow:6}];
p.circuits.push({...structuredClone(p.circuits[0]),id:'sub-c',name:'Emeleti dugaljak',board:'sub'});
p=validatePlan(p);const groups=projectSizing(p);
assert.deepEqual(groups.map(g=>g.board.id),['','sub']);assert.deepEqual(groups[1].results.map(r=>r.circuitId),['sub-c']);
assert.equal(groups[1].results[0].segments[0].routeId,null,'más elosztó áramkörének nincs nyomvonala');
setBoardSizing(p,'house','sub',{zs:0.5});assert.equal(size(p,'sub-c').zsBoard,0.5);assert.equal(size(p,'sub-c').zs,null,'nyomvonal nélkül a hurok nem számítható');assert.equal(check(size(p,'sub-c'),'loop').status,'na');
assert.equal(size(p,'c1').zsBoard,null,'az elosztó-beállítás elosztónként külön');

// 19. PDF.
const font=readFileSync('public/fonts/NotoSans-Regular.ttf').toString('base64');
const opts={scope:'board' as const,paper:'a4' as const,buildingId:'house',floorId:'ground'};
assert.equal(createPlanPdf(fresh(),opts,font).getNumberOfPages(),5);
assert.ok(createPlanPdf(fresh(),{...opts,sizing:true},font).getNumberOfPages()>=7);
const allPages=createPlanPdf(fresh(),{...opts,scope:'all'},font).getNumberOfPages(),allSizing=createPlanPdf(fresh(),{...opts,scope:'all',sizing:true},font).getNumberOfPages();
assert.ok(allSizing>22,String(allSizing));assert.ok(allSizing>=allPages+2);
const rows=sizingPdfRows(boardSizing(fresh(),'house'));
assert.deepEqual(rows[0],['Nappali dugaljak (L1)','B16 A · 3 × 2,5 mm², PVC* · B2*','≈2,61 / 16 / 23 A','23,4 m','2,93% / 5%','–','Számítás szerint megfelel – feltételezésekkel; nem vizsgált: hurokimpedancia']);
assert.ok(rows[0].join(' ').includes('23,4 m')&&rows[0].join(' ').includes('2,93% / 5%')&&rows[0][2].startsWith('≈'));
const reasons=sizingReasonRows(boardSizing(fresh(),'house'));
assert.deepEqual(reasons[0],['Felelősségi nyilatkozat','–',SIZING_DISCLAIMER]);assert.equal(reasons[1][0],'Táblázatok');assert.ok(reasons[1][2].startsWith(tablesApproved()?'Jóváhagyta: ':'Ellenőrizendő: '));
assert.equal(reasons.at(-1)![0],'Tervezői ellenőrzés');assert.equal(reasons.at(-2)![0],'Nem vizsgált');
assert.ok(reasons.some(r=>r[0]==='Hálószoba dugaljak'&&r[1]===checkStatusLabels.na+': Mértékadó hossz'));
p=fresh();p.sizing={boards:[{building:'house',board:'',zs:0.35}]};assert.equal(sizingPdfRows(boardSizing(p,'house'))[0][5],'0,77 / 2,88 Ω');assert.equal(sizingPdfRows(boardSizing(p,'house'))[1][5],'n. sz.');
circuit(p,'c1').sizing={length:12.5};assert.equal(sizingPdfRows(boardSizing(p,'house'))[0][3],'12,5 m (megadott)');

// 20. Szóhasználat és megosztás.
const forbidden=/szakmailag ellenőrzött|MSZ szerint megfelel|megfelel a szabványnak|szabványos méretezés/i;
const files=(dir:string):string[]=>readdirSync(dir).flatMap(n=>{const f=join(dir,n);return statSync(f).isDirectory()?files(f):/\.tsx?$/.test(n)?[f]:[]});
for(const f of ['components','lib','app'].flatMap(files))assert.ok(!forbidden.test(readFileSync(f,'utf8')),f+' tiltott kifejezést tartalmaz');
assert.equal(statusLabels.ok,'Számítás szerint megfelel');
p=fresh();p.sizing={overrides:[{method:'B2',insulation:'PVC',loaded:2,section:2.5,iz:21,note:'Belső jegyzet 4711'}],boards:[{building:'house',board:'',zs:0.35}]};circuit(p,'c1').sizing={ambient:40};
const shared=sharedPlan(p);assert.equal(shared.plan.sizing,undefined);assert.ok(shared.plan.circuits.every(c=>c.sizing===undefined));assert.ok(!JSON.stringify(shared).includes('4711'));
assert.ok(p.sizing&&circuit(p,'c1').sizing,'a megosztás nem módosítja a bemenetet');
// A táblázatállandók a számításban: U0 és ρ1 a sizing-tables.ts-ből jön.
assert.equal(SIZING_TABLES.u0,U0);assert.equal(SIZING_TABLES.rho1,rho);

// 21. Ellenőrzői észrevételek – kézi levezetéssel.
// 21.1 Hossz-felülírás + kisebb nyomvonal-keresztmetszet: a ΔU és a Zs a legkisebb (1,5 mm²) keresztmetszettel számol.
p=fresh();route(p,'r1').cable='3 × 1,5 mm²';circuit(p,'c1').load=3000;circuit(p,'c1').sizing={length:30};
r=size(p,'c1');
// Ib = 3000 / 230 = 13,0435 A; ΔU = 2 · 30 · 13,0435 · 0,0225 / 1,5 / 230 · 100 = 5,104% > 5% → nem felel meg (megadott terhelés).
near(r.drop,2*30*(3000/230)*rho/1.5/U0*100);near(r.drop,5.103969754253308);assert.equal(r.iz,16.5);
assert.equal(check(r,'voltage-drop').status,'fail');assert.equal(r.status,'fail');
assert.ok(check(r,'voltage-drop').calculation.includes('/ 1,5 mm²'));
assert.ok(check(r,'cable').detail.includes('a legkisebb (1,5 mm²) keresztmetszettel számoltuk'));
// Lmax = 0,05 · 230 / (2 · 13,0435 · 0,0225 / 1,5) = 29,39 m → lefelé kerekítve 29,3 m.
assert.ok(check(r,'voltage-drop').detail.includes('legfeljebb kb. 29,3 m'),check(r,'voltage-drop').detail);
// Zs = 0,35 + 0,0225 · 30 · (1/1,5 + 1/1,5) = 1,25 Ω.
p.sizing={boards:[{building:'house',board:'',zs:0.35}]};near(size(p,'c1').zs,0.35+rho*30*(2/1.5));near(size(p,'c1').zs,1.25);
// 21.2 Vegyes keresztmetszet: ΔU = 2 · 16 · 0,0225 / 230 · 100 · (23,4/2,5 + 10/1,5) = 5,017% (becsült → figyelmeztetés);
// a javaslat a legkisebb keresztmetszettel: 0,05 · 230 / (2 · 16 · 0,0225 / 1,5) = 23,96 → 23,9 m (< 33,4 m).
p=fresh();p.buildings[0].floors.find(f=>f.routes.some(x=>x.id==='r1'))!.routes.push({id:'tol',name:'Toldás',points:[{x:100,y:100},{x:500,y:100}],mode:'inside',circuit:'c1',cable:'3 × 1,5 mm²'});
r=size(validatePlan(p),'c1');near(r.length,33.4);near(r.drop,2*16*rho/U0*100*(23.4/2.5+10/1.5));assert.equal(check(r,'voltage-drop').status,'warn');
assert.ok(check(r,'voltage-drop').detail.includes('A legkisebb (1,5 mm²) keresztmetszettel számolva legfeljebb kb. 23,9 m'),check(r,'voltage-drop').detail);
// 21.3 Lebegőpontos egyenlőség: Iz = 90 · 1 · 0,7 = 63 A (lebegőpontosan 62,999…); In = 63 A ≤ 63 A teljesül.
assert.ok(90*0.7<63,'a lebegőpontos szorzat valóban 63 alatti');assert.ok(atMost(63,90*0.7));
p=fresh();p.circuits.push({id:'k63',name:'Alelosztó',building:'house',phase:'L1',rating:63,curve:'C',cable:'3x25',rcd:'',load:10000,sizing:{grouped:3,length:10}});
r=size(p,'k63');assert.equal(check(r,'overload').status,'ok');assert.equal(check(r,'i2').status,'ok');assert.ok(check(r,'overload').calculation.endsWith('In = 63 A ≤ 63 A'));
assert.equal(minSectionFor(63,'B2','PVC',2,1,0.7),25);
// Ib = 4508 / (230 · 0,98) = 20 A (lebegőpontosan 20,000…04) ≤ In = 20 A.
p.circuits.push({id:'k20',name:'Ib = In',building:'house',phase:'L1',rating:20,curve:'C',cable:'3x4',rcd:'',load:4508,sizing:{cosPhi:0.98,length:5}});
assert.equal(check(size(p,'k20'),'design-current').status,'ok');
// 21.4 Gumiszigetelés (60 °C): nem számítható; az ismeretlen szigetelés PVC-feltételezése kiemelt.
for(const t of ['H07RN-F 3G1,5','H05RR-F 3x1,5','GT 3x2,5'])bad(t,'rubber');
assert.equal(ok('H07V-U 2,5 mm²').section,2.5,'a H07V nem gumi');
// A „gumi” szó ékezetes folytatással is (korábban a \w miatt „gumikábel”, „gumiszigetelésű” PVC-alapértéket kapott).
for(const t of ['gumikábel 3x2,5','gumiszigetelésű 3x2,5','Gumi kábel 3x2,5','Gumi kábel','GUMI 3x2,5','GUMIKÁBEL 3x2,5','Gumikábel 3G1,5','gumis 3x2,5','gumi','Gumi-kábel 3x2,5','gumikabel 3x2,5','gumiszigetelésű, 3 × 2,5 mm²','PVC/gumikábel 3x2,5','H07RN-F 3G2,5','h07rn-f 3g2,5','H05RR-F 3G1,5','H07RT 3x2,5'])bad(t,'rubber');
// Csak szókezdő „gumi” számít; a többi besorolás nem változott.
assert.equal(ok('ragumi 3x2,5').insulation,null,'szó belsejében nem gumi');assert.equal(ok('NYM-J 3x2,5').insulation,'PVC');assert.equal(ok('N2XH 3x2,5').insulation,'XLPE');
bad('Al gumikábel 4x16','aluminium');
p=fresh();p.circuits.push({id:'g',name:'Gumi',building:'house',phase:'L1',rating:16,curve:'B',cable:'H07RN-F 3G1,5',rcd:'',load:2000,sizing:{length:10}});
assert.equal(size(p,'g').status,'na');
for(const cable of ['gumikábel 3x2,5','gumiszigetelésű 3x2,5']){
 p=fresh();p.circuits.push({id:'g',name:'Gumi',building:'house',phase:'L1',rating:16,curve:'B',cable,rcd:'',load:2000,sizing:{length:10}});
 r=size(p,'g');assert.equal(r.status,'na',cable);assert.equal(r.iz,null,cable);
}
assert.ok(size(fresh(),'c1').assumptions.some(a=>a.strong&&a.text.startsWith('Szigetelés: PVC, 70 °C')&&a.text.includes('60 °C')));
// 21.5 U0 egyetlen forrásból: U0 = 220 V mellett Ib = 2200 / 220 = 10 A.
p=fresh();circuit(p,'c1').load=2200;(SIZING_TABLES as {u0:number}).u0=220;
try{r=size(p,'c1');near(r.ib,10);assert.ok(check(r,'design-current').calculation.includes('220 V')&&check(r,'design-current').calculation.includes('= 10 A'))}finally{(SIZING_TABLES as {u0:number}).u0=230}
// 21.6 RCBO: a forrás MSZ EN 61009-1.
p=fresh();p.modules.find(m=>m.circuit==='c1')!.type='RCBO';r=size(p,'c1');
assert.equal(r.device,'RCBO');assert.ok(check(r,'i2').clause.endsWith('MSZ EN 61009-1'));assert.ok(check(r,'i2').detail.startsWith('Kombinált védelemnél (RCBO) I2 = 1,45 · In (MSZ EN 61009-1)'));
assert.ok(r.refs.some(x=>x.label==='I2/In'&&x.source.startsWith('MSZ EN 61009-1')));assert.ok(!size(fresh(),'c1').refs.some(x=>x.source.includes('61009')));
// 21.7 Alumínium / 35 mm² feletti áramköri kábel réz nyomvonallal: nem számítható (nem cseréljük a nyomvonal kábelére).
for(const cable of ['NAYY 3x2,5','4x50']){
 p=fresh();p.buildings[0].floors[0].routes.push({id:'rx',name:'Új',points:[{x:100,y:100},{x:300,y:100}],mode:'inside',circuit:'c2',cable:'3 × 2,5 mm²'});circuit(p,'c2').cable=cable;
 r=size(validatePlan(p),'c2');assert.equal(r.status,'na',cable);assert.equal(check(r,'cable').status,'na');assert.equal(r.iz,null);assert.ok(check(r,'cable').detail.startsWith('Az áramkör kábele: ')&&check(r,'cable').detail.includes('nem helyettesítjük'));
}
p=fresh();circuit(p,'c1').cable='Cat6';r=size(p,'c1');assert.equal(check(r,'cable').status,'warn');assert.ok(check(r,'cable').detail.includes('Az áramkör kábeljelölése („Cat6”) nem értelmezhető'));assert.equal(r.iz,23);
// 21.8 Csökkentett N/PE-jelölés: nem számítható (a hurok PE = fázisvezető feltételezése nem konzervatív lenne).
for(const t of ['NYY-J 3x25+16','4x10+16','3x2,5/1,5','4x10+16 mm²','3x10+1x6'])bad(t,'reduced');
assert.equal(ok('NYY-J 4x10 0,6/1 kV').section,10,'a feszültségjelölés nem további ér');assert.equal(ok('3x16+16').section,16,'azonos keresztmetszetű további ér elfogadott');
p=fresh();p.circuits.push({id:'pe',name:'3P',building:'house',phase:'3P',rating:40,curve:'C',cable:'NYY-J 3x25+16',rcd:'',load:20000,sizing:{length:130}});p.sizing={boards:[{building:'house',board:'',zs:0.3}]};
r=size(p,'pe');assert.equal(r.status,'na');assert.equal(r.zs,null);
bad('3x4 + 2x4','ambiguous');assert.ok(cableMsg('3x4 + 2x4').includes('ér- vagy keresztmetszet'),'az érszám-eltérésnél nem „különböző keresztmetszet” az üzenet');
// 21.9 Kerekítés: ΔU = 2 · 39,96 · 16 · 0,0225 / 2,5 / 230 · 100 = 5,0037% → „5,004% > 5%”; Ib = 3681 / 230 = 16,0043 A → „16,004 A > In = 16 A”.
p=fresh();p.circuits.push({id:'d',name:'Esés',building:'house',phase:'L1',rating:16,curve:'B',cable:'3x2,5',rcd:'',load:3680,sizing:{length:39.96}});
r=size(p,'d');assert.equal(check(r,'voltage-drop').status,'fail');assert.ok(check(r,'voltage-drop').calculation.includes('összesen 5,004% > 5%'));assert.equal(sizingPdfRows([r])[0][4],'5,004% / 5%');
circuit(p,'d').load=3681;circuit(p,'d').sizing={length:5};assert.ok(check(size(p,'d'),'design-current').calculation.endsWith('= 16,004 A > In = 16 A'));
// Zs = 0,54 + 0,0225 · 10 · 0,8 = 0,72 Ω > Zs,max = 230 / (20 · 16) = 0,71875 Ω → a cella „0,72 / 0,719 Ω”.
p=fresh();p.sizing={boards:[{building:'house',board:'',zs:0.54}]};circuit(p,'c1').curve='D';circuit(p,'c1').sizing={length:10};
r=size(p,'c1');near(r.zs,0.72);assert.notEqual(check(r,'loop').status,'ok');assert.equal(sizingPdfRows([r])[0][5],'0,72 / 0,719 Ω');
assert.deepEqual(fmtPair(2.875,0.7712),['2,88','0,77']);assert.deepEqual(fmtPair(63,90*0.7),['63','63']);
// 21.10 Beviteli mező: tizedesvessző, ezres tagolás, kerekítés nélkül.
assert.equal(parseDecimalInput('40,5'),40.5);assert.equal(parseDecimalInput('0,355'),0.355);assert.equal(parseDecimalInput('1 000'),1000);assert.equal(parseDecimalInput('2 500,5'),2500.5);assert.equal(parseDecimalInput(',5'),0.5);assert.equal(parseDecimalInput('35'),35);
assert.equal(parseDecimalInput('  '),null);for(const t of ['40,5,1','-1','1.000,5','abc','4 05'])assert.ok(Number.isNaN(parseDecimalInput(t)),t);
// 21.11 Zs nélkül a hurokellenőrzés hiánya látszik a címkében és a PDF-indoklásban.
p=fresh();circuit(p,'c1').load=600;circuit(p,'c1').sizing={method:'B2',insulation:'PVC',ambient:30,grouped:1,cosPhi:1,usage:'other'};p.sizing={supply:'public',boards:[{building:'house',board:'',upstreamDrop:0}]};
r=size(validatePlan(p),'c1');assert.deepEqual(r.assumptions,[]);assert.equal(r.label,'Számítás szerint megfelel – nem vizsgált: hurokimpedancia');
assert.ok(sizingReasonRows([r]).some(x=>x[0]==='Nappali dugaljak'&&x[1]==='Nem vizsgált: Hurokimpedancia'));
const boardReasons=sizingReasonRows(boardSizing(fresh(),'house'));
assert.equal(boardReasons.filter(x=>x[1]==='Nem vizsgált: Hurokimpedancia').length,1,'azonos ok: egy összefoglaló sor');assert.equal(boardReasons.find(x=>x[1]==='Nem vizsgált: Hurokimpedancia')![0],'Minden áramkör');
assert.ok(SIZING_PDF_LEGEND.includes('≈ = becsült terhelés')&&SIZING_PDF_LEGEND.includes('– = nem vizsgált'));
// 21.12 XLPE PVC-tartalék: 30 °C alatt kθ = 1 (a PVC 1,22-es értéke helyett); felülírt XLPE Iz0 = 30 A → Iz = 30 · 1 · 1 = 30 A.
assert.equal(temperatureFactor('PVC',10).value,1.22);assert.equal(temperatureFactor('XLPE',10).value,1);assert.equal(temperatureFactor('XLPE',40).value,0.87);
p=fresh();circuit(p,'c1').cable='N2XH 3x2,5';route(p,'r1').cable='N2XH 3x2,5';circuit(p,'c1').sizing={ambient:10};p.sizing={overrides:[{method:'B2',insulation:'XLPE',loaded:2,section:2.5,iz:30,note:'Gyártói XLPE'}]};
r=size(p,'c1');assert.equal(r.kTemp,1);assert.equal(r.iz,30);assert.ok(check(r,'overload').calculation.includes('XLPE helyett PVC-sor, 30 °C alatt 1-re korlátozva'));
assert.ok(r.assumptions.some(a=>a.text.startsWith('XLPE-szigetelés: az Iz0 projekt-felülírásból')));
// 21.13 A „Felhasználás: egyéb” alapérték kiemelt (a világítási határ szigorúbb).
assert.ok(size(fresh(),'c1').assumptions.some(a=>a.strong&&a.text.startsWith('Felhasználás: egyéb fogyasztó')));
// 21.14 Becsült Ib > In: a feszültségesés a nagyobbal, Ib = 600 / 230 = 2,609 A; ΔU = 2 · 23,4 · 2,609 · 0,0225 / 2,5 / 230 · 100 = 0,478%.
p=fresh();circuit(p,'c1').rating=2;r=size(p,'c1');near(r.dropCurrent,600/230);assert.equal(r.dropCurrentSource,'Ib');near(r.drop,2*23.4*(600/230)*rho/2.5/U0*100);
assert.ok(!check(r,'voltage-drop').detail.includes('kedvezőtlen eset'));assert.ok(r.assumptions.some(a=>a.text.includes('a becsült terhelési árammal')));
// 21.15 Szóhasználat és a táblázatértékek egyetlen forrása.
assert.equal(checkStatusLabels.ok,'Rendben');assert.ok(!readFileSync('lib/sizing.ts','utf8').includes('karakterisztika'));
(SIZING_TABLES as {minSection:number}).minSection=2.5;
try{p=fresh();circuit(p,'c1').cable='3x1,5';route(p,'r1').cable='3x1,5';assert.ok(check(size(p,'c1'),'section').detail.endsWith('legkisebb keresztmetszet 2,5 mm².'))}finally{(SIZING_TABLES as {minSection:number}).minSection=1.5}
// 21.16 Indoklássor: a számítás és a magyarázat között mondathatár.
p=fresh();circuit(p,'c1').rating=25;assert.ok(sizingReasonRows([size(p,'c1')]).find(x=>x[1]==='Nem felel meg: In ≤ Iz')![2].includes('> 23 A. A védelem névleges árama'));
// 21.17 Terhelés és szerelvény nélkül az Ib ≤ In nem vizsgálható.
p=fresh();p.circuits.push({id:'u',name:'Tartalék',building:'house',phase:'L1',rating:20,curve:'B',cable:'3x2,5',rcd:'',sizing:{length:5}});
r=size(p,'u');assert.equal(check(r,'design-current').status,'skipped');assert.ok(sizingPdfRows([r])[0][2].startsWith('– / 20 / '));assert.ok(r.label.includes('nem vizsgált: Ib ≤ In, hurokimpedancia'));
p.circuits.push({id:'u2',name:'NAYY',building:'house',phase:'L1',rating:20,curve:'B',cable:'NAYY 4x16',rcd:''});assert.equal(sizingPdfRows([size(p,'u2')])[0][1],'B20 A · nem értelmezhető');
// 21.18 Ugrási cél létezése (olcsó ellenőrzés) egyezik a céllal.
p=fresh();p.circuits.push({id:'lonely',name:'Tartalék',building:'house',phase:'L1',rating:16,curve:'B',cable:'3 × 2,5 mm²',rcd:''});
const ctx=sizingContext(p);for(const c of p.circuits)assert.equal(hasSizingTarget(p,c.id,ctx),sizingTarget(p,c.id,ctx)!==null,c.id);
// 21.19 Kulcssorrend: törlés, majd azonos érték visszaírása után a nyers JSON egyezik a validálttal és a mentettel (nem ragad be a „nem mentett” állapot).
const roundTrip=(prep:(q:Plan)=>void,edits:((q:Plan)=>void)[],name:string)=>{
 const base=fresh();prep(base);let q=validatePlan(base);const saved=JSON.stringify(q);
 for(const e of edits){q=structuredClone(q);e(q)}
 assert.equal(JSON.stringify(q),JSON.stringify(validatePlan(q)),name+': nyers = validált');assert.equal(JSON.stringify(q),saved,name+': = mentett');
};
roundTrip(q=>{circuit(q,'c1').sizing={ambient:35,grouped:2}},[q=>setCircuitSizing(q,'c1',{ambient:undefined}),q=>setCircuitSizing(q,'c1',{ambient:35})],'áramköri hőmérséklet');
roundTrip(q=>{circuit(q,'c1').sizing={ambient:35}},[q=>setCircuitSizing(q,'c1',{ambient:undefined}),q=>setCircuitSizing(q,'c1',{ambient:35})],'egyetlen áramköri mező');
roundTrip(q=>{circuit(q,'c1').load=600;circuit(q,'c1').sizing={ambient:35}},[q=>setCircuitLoad(q,'c1',undefined),q=>setCircuitLoad(q,'c1',600)],'terhelés');
roundTrip(q=>{q.sizing={methodInside:'A1',ambient:35}},[q=>setPlanSizing(q,{methodInside:undefined}),q=>setPlanSizing(q,{methodInside:'A1'})],'projektmód');
roundTrip(q=>{q.sizing={ambient:35}},[q=>setPlanSizing(q,{ambient:undefined}),q=>setPlanSizing(q,{ambient:35})],'egyetlen projektmező');
roundTrip(q=>{q.sizing={boards:[{building:'house',board:'',upstreamDrop:1,zs:0.4}]}},[q=>setBoardSizing(q,'house','',{zs:undefined}),q=>setBoardSizing(q,'house','',{zs:0.4})],'elosztó Zs');
roundTrip(q=>{q.sizing={overrides:[{...o}],supply:'private'}},[q=>removeOverride(q,'B2|PVC|2|2.5'),q=>upsertOverride(q,{...o})],'felülírás');

console.log('PASS: cable parsing, formulas, reviewer fixes (governing section, float tolerance, rubber/reduced/aluminium cables, U0, RCBO, rounding, input parsing, loop labelling, XLPE kθ, key order), seed results, temperature/grouping, method priority, three-phase, voltage drop, minimum section, upstream drop, loop impedance, cable fallback, overrides, XLPE fallback, multi-floor, schema/pruning/round-trip, mutators, plan checks, targets, grouping, PDF, wording and share minimisation.');
