import assert from 'node:assert/strict';
import {seed,validatePlan} from '../lib/plan';
import {boardBars,endpointInfo,endpointKey,validateBoard,connectBoard,removeBoardLinks,pruneBoardLinks,autoBarsOn,setAutoBars,moveBoardModule,type Endpoint} from '../lib/board';
import {autoBoardWires,boardBarPorts,boardWiring,effectiveBoardWires,rcdGroup} from '../lib/board-bars';
import {cabinetLayout} from '../lib/cabinet';
import {removeStructure} from '../lib/projects';
import {copyStructure} from '../lib/structure-copy';
import {sharedPlan} from '../lib/share';
import {buildSchematic} from '../lib/schematic';
type Plan=ReturnType<typeof validatePlan>;
const base=()=>validatePlan(structuredClone(seed));
const add=(p:Plan,id:string,type:Plan['modules'][number]['type'],row:number,slot:number,width:number,extra:Partial<Plan['modules'][number]>={})=>{p.modules.push({id,name:id,building:'house',type,row,slot,width,circuit:'',...extra})};
const circuit=(p:Plan,id:string,extra:Partial<Plan['circuits'][number]>={})=>{p.circuits.push({id,name:id,building:'house',phase:'L1',rating:16,curve:'B',cable:'3 × 2,5 mm²',rcd:'',...extra})};
const c=(id:string,port:string):Endpoint=>({kind:'circuit',id,port}),m=(id:string,port:string):Endpoint=>({kind:'module',id,port}),b=(id:string,port:string):Endpoint=>({kind:'bar',id,port});
const wire=(id:string,from:Endpoint,to:Endpoint)=>({id,name:id,building:'house',from,to});
const has=(wires:Plan['boardWires'],a:Endpoint,z:Endpoint)=>wires.some(w=>endpointKey(w.from)===endpointKey(a)&&endpointKey(w.to)===endpointKey(z)||endpointKey(w.from)===endpointKey(z)&&endpointKey(w.to)===endpointKey(a));
const touches=(wires:Plan['boardWires'],e:Endpoint)=>wires.filter(w=>[w.from,w.to].some(x=>endpointKey(x)===endpointKey(e)));
const viaBar=(wires:Plan['boardWires'],e:Endpoint,bar:string)=>touches(wires,e).filter(w=>[w.from,w.to].some(x=>x.kind==='bar'&&x.id===bar)).length===1&&touches(wires,e).length===1;
// Minden forgatókönyvben: a kézi + az automatikus vezetékek együtt érvényesek; nincs L-vezeték, N–PE kötés, sín–sín kötés; egyedi azonosítók és sínkapcsok.
function invariants(p:Plan,buildingId='house',boardId=''){
 const auto=autoBoardWires(p,buildingId,boardId),q=structuredClone(p);q.boardWires=[...p.boardWires,...auto.wires];
 validateBoard(q);validatePlan(q);
 assert.equal(new Set(auto.wires.map(w=>w.id)).size,auto.wires.length);assert.ok(auto.wires.every(w=>w.id.startsWith('auto:')&&w.building===buildingId));
 for(const w of auto.wires){
  const a=endpointInfo(q,w.from)!,z=endpointInfo(q,w.to)!;
  assert.ok(a&&z);assert.ok(a.signal==='N'||a.signal==='PE','csak N/PE automatikus');assert.equal(a.signal,z.signal,'soha N–PE');
  assert.ok(!(w.from.kind==='bar'&&w.to.kind==='bar'));assert.ok(!/^L/.test(w.from.port)&&!/^L/.test(w.to.port),'soha L-vezeték');
 }
 // egy N-sínt legfeljebb egy forrás (főkapcsoló vagy ÁVK N-kimenete) táplál; az ÁVK saját sínjét csak a saját N-kimenete
 for(const bar of boardBars(p,buildingId,boardId)){
  const feeders=auto.wires.filter(w=>[w.from,w.to].some(e=>e.kind==='bar'&&e.id===bar.id)&&[w.from,w.to].some(e=>e.kind==='module'&&e.port==='N-out'));
  assert.ok(feeders.length<=1,`a(z) ${bar.id} sín több forrásról táplált`);
  if(bar.kind==='rcd')assert.ok(feeders.every(w=>[w.from,w.to].some(e=>e.kind==='module'&&e.id===bar.rcdId)),'az ÁVK sínjét idegen N-kimenet nem táplálja');
 }
 const used=auto.wires.flatMap(w=>[w.from,w.to]).filter(e=>e.kind==='bar').map(endpointKey);
 assert.equal(new Set(used).size,used.length,'minden automatikus vezeték saját sínkapcsot kap');
 assert.deepEqual(auto,autoBoardWires(p,buildingId,boardId),'determinisztikus');
 return auto;
}

// 1) A sínek elosztónként: az üres elosztónak nincs sínje; a nem üresnek PE, N és ÁVK-nként egy N-sín.
{
 const p=base();
 assert.deepEqual(boardBars(p,'house','').map(x=>[x.id,x.label,x.signal,x.kind]),[['pe:house/','PE-sín','PE','pe'],['n:house/','N-sín','N','n'],['rcd:m1','N-sín · FI-01','N','rcd']]);
 assert.deepEqual(boardBars(p,'garage',''),[],'az üres garázs elosztónak nincs sínje');
 assert.deepEqual(autoBoardWires(p,'garage',''),{wires:[],warnings:[]});
 assert.deepEqual(boardBars(p,'house','nincs'),[]);
 p.buildings[1].extraBoards=[{id:'sub',name:'Alelosztó',rows:2,modulesPerRow:6}];
 assert.deepEqual(boardBars(p,'garage','sub'),[],'üres alelosztó');
 add(p,'sq','MCB',0,0,1,{building:'garage',board:'sub'});
 assert.deepEqual(boardBars(p,'garage','sub').map(x=>x.label),['PE-sín','N-sín']);
 assert.deepEqual(boardBars(p,'garage','sub').map(x=>x.id),['pe:garage/sub','n:garage/sub']);
 // csak áramkörrel is van sín; az RCD kétszer nem számít, a második ÁVK külön N-sínt kap
 const q=base();q.modules=[];q.boardWires=[];assert.equal(boardBars(q,'house','').length,2);
 add(p,'rx','RCD',1,0,4,{name:'FI-02 · 25 A'});assert.deepEqual(boardBars(p,'house','').map(x=>x.label),['PE-sín','N-sín','N-sín · FI-01','N-sín · FI-02']);
 // a sín nem foglal modulhelyet
 assert.equal(p.modules.filter(x=>x.building==='house').length,6);
}

// 2) Az ÁVK-csoport szabálya.
{
 const p=base();const g=(id:string)=>rcdGroup(p,p.circuits.find(x=>x.id===id)!);
 assert.deepEqual(g('c1'),{status:'rcd',rcdId:'m1'},'a név első tagja (FI-01) egyezik');
 p.circuits[0].rcd=' fi-01 ';assert.deepEqual(g('c1'),{status:'rcd',rcdId:'m1'},'kis-nagybetű és szóköz');
 p.circuits[0].rcd='fi-01 · 40 a / 30 ma · a';assert.deepEqual(g('c1'),{status:'rcd',rcdId:'m1'},'teljes név');
 p.circuits[0].rcd='';assert.deepEqual(g('c1'),{status:'none'},'üres szöveg: nincs ÁVK');
 p.circuits[0].rcd='FI-02';
 assert.deepEqual(g('c1'),{status:'unresolved',reason:'A(z) „FI-02” ÁVK-csoport nem található ebben az elosztóban.'});
 p.circuits[0].rcd='FI-0';assert.equal(g('c1').status,'unresolved','előtag nem egyezik');
 // több készülékre is illik
 add(p,'rx','RCD',1,0,4,{name:'FI-01 · 63 A'});p.circuits[0].rcd='FI-01';
 assert.deepEqual(g('c1'),{status:'unresolved',reason:'A(z) „FI-01” ÁVK-csoport több készülékre is illik.'});
 p.circuits[1].rcd='FI-01 · 40 A / 30 mA · A';assert.deepEqual(g('c2'),{status:'rcd',rcdId:'m1'},'a teljes név egyértelműsít');
 // a bekötés a szövegnél erősebb bizonyíték
 p.boardWires.push(wire('ev',m('rx','L1-out'),m('m2','L-in')));validatePlan(p);
 assert.deepEqual(g('c1'),{status:'rcd',rcdId:'rx'},'az ÁVK L-kimenetéről táplált védelem csoportja a bekötés szerinti');
 p.circuits[0].rcd='';assert.deepEqual(g('c1'),{status:'rcd',rcdId:'rx'});
 p.circuits[0].rcd='FI-77';assert.deepEqual(g('c1'),{status:'rcd',rcdId:'rx'});
 // két különböző ÁVK-ból táplált védelem: nem egyértelmű
 p.boardWires.push(wire('ev2',m('m1','L1-out'),m('m2','L-in')));
 assert.equal(g('c1').status,'unresolved');assert.match(g('c1').reason!,/több ÁVK/);
 // másik elosztóban lévő ÁVK nem számít
 const o=base();o.buildings[0].extraBoards=[{id:'sub',name:'Alelosztó',rows:2,modulesPerRow:6}];circuit(o,'sc',{board:'sub',rcd:'FI-01'});add(o,'sq','MCB',0,0,1,{board:'sub',circuit:'sc'});
 assert.equal(rcdGroup(o,o.circuits.find(x=>x.id==='sc')!).status,'unresolved','a főelosztó ÁVK-ja másik elosztó');
 const auto=invariants(o,'house','sub');
 assert.ok(has(auto.wires,c('sc','PE'),b('pe:house/sub','T1')),'a PE ilyenkor is bekötve');
 assert.equal(touches(auto.wires,c('sc','N')).length,0,'az N-szál bekötetlen');
 assert.equal(auto.warnings.length,1);assert.match(auto.warnings[0],/sc: A\(z\) „FI-01” ÁVK-csoport nem található ebben az elosztóban\./);
}

// 3) A seed alapértelmezett automatikus vezetékei; betápláló készülékek; tárolt adat érintetlen.
{
 const p=base(),before=JSON.stringify(p);
 const auto=invariants(p);
 assert.equal(auto.wires.length,9);assert.deepEqual(auto.warnings,[]);
 assert.ok(has(auto.wires,m('m0','N-out'),b('n:house/','T1')),'MAIN N-out → főnullasín');
 assert.ok(has(auto.wires,m('m1','N-in'),b('n:house/','T2')),'ÁVK N-in ← főnullasín');
 assert.ok(has(auto.wires,m('m1','N-out'),b('rcd:m1','T1')),'ÁVK N-out → saját N-sín');
 for(const [i,id] of ['c1','c2','c3'].entries()){assert.ok(has(auto.wires,c(id,'PE'),b('pe:house/','T'+(i+1))));assert.ok(has(auto.wires,c(id,'N'),b('rcd:m1','T'+(i+2))))}
 assert.ok(auto.wires.every(w=>w.name.length>0&&w.name.length<=120));
 assert.equal(JSON.stringify(p),before,'az automatikus vezeték nem módosítja a tervet');assert.deepEqual(p.boardWires,[]);
 assert.deepEqual(boardBarPorts(p,'house','').map(x=>x.ports.length),[6,6,6]);
 // L-vezetéket soha nem hoz létre
 assert.ok(!auto.wires.some(w=>[w.from,w.to].some(e=>e.port==='L'||/^L\d/.test(e.port))));
 // az ÁVK-csoport szövegét nem írja át (a méretezés ezt olvassa)
 assert.equal(JSON.stringify(p.circuits.map(x=>x.rcd)),'["FI-01","FI-01","FI-01"]');
 // üres szövegű áramkör: főnullasín
 p.circuits[2].rcd='';const a2=invariants(p);assert.ok(has(a2.wires,c('c3','N'),b('n:house/','T3')),'ÁVK nélküli áramkör N-je a főnullasínre kerül');
}

// 4) SPD, RCBO és a betápláló készülékek.
{
 const p=base();
 add(p,'spd','SPD',1,0,4);
 circuit(p,'c4',{rcd:'FI-01',phase:'L1'});add(p,'q4','RCBO',1,4,2,{circuit:'c4'});
 circuit(p,'c5',{rcd:''});add(p,'q5','RCBO',1,6,2,{circuit:'c5'});
 circuit(p,'c6',{rcd:'FI-99'});add(p,'q6','RCBO',1,8,2,{circuit:'c6'});
 circuit(p,'c7',{rcd:'FI-01',phase:'3P'});add(p,'q7','MCB',1,10,1,{circuit:'c7'});
 const auto=invariants(p);
 assert.ok(has(auto.wires,m('spd','N'),b('n:house/','T3')),'SPD N → főnullasín');
 assert.ok(has(auto.wires,m('spd','PE'),b('pe:house/','T1')),'SPD PE → PE-sín');
 // RCBO: a saját N-je az RCBO N-out kapcsán; az N-in a csoport sínjéről
 const onBar=(e:Endpoint,bar:string)=>touches(auto.wires,e).filter(w=>[w.from,w.to].some(x=>x.kind==='bar'&&x.id===bar)).length===1;
 assert.ok(has(auto.wires,c('c4','N'),m('q4','N-out')));assert.ok(onBar(m('q4','N-in'),'rcd:m1'),'RCBO N-in ← ÁVK N-sín');
 assert.ok(touches(auto.wires,c('c4','N')).length===1&&touches(auto.wires,c('c4','N'))[0].id==='auto:c4:N');
 assert.ok(onBar(m('q5','N-in'),'n:house/'),'ÁVK nélküli RCBO N-in ← főnullasín');
 assert.ok(has(auto.wires,c('c5','N'),m('q5','N-out')));
 assert.equal(touches(auto.wires,m('q6','N-in')).length,0,'nem azonosítható csoport: nincs N-in vezeték');
 assert.ok(has(auto.wires,c('c6','N'),m('q6','N-out')),'az RCBO saját N-je ilyenkor is bekötve');assert.ok(onBar(c('c6','PE'),'pe:house/'));
 assert.equal(auto.warnings.length,1);assert.match(auto.warnings[0],/^q6: A\(z\) „FI-99” ÁVK-csoport nem található ebben az elosztóban\. Az N-bemenet/);
 // 3 fázisú, ÁVK mögötti MCB-s áramkör: N a csoport sínjén
 assert.ok(onBar(c('c7','N'),'rcd:m1'));
 assert.equal(touches(auto.wires,c('c7','L1')).length,0);
 // a védelem hozzárendelése nélküli RCBO-nak nincs csoportja → nincs N-in vezeték
 add(p,'q8','RCBO',1,12,2);assert.equal(touches(invariants(p).wires,m('q8','N-in')).length,0);
 // az RCBO-s áramkör bekötése az ÁVK L-kimenetéről (bizonyíték) a sínt is megváltoztatja
 add(p,'rx','RCD',2,0,4,{name:'FI-02'});p.boardWires.push(wire('ev',m('rx','L1-out'),m('q5','L-in')));validatePlan(p);
 {const a=invariants(p);assert.equal(touches(a.wires,m('q5','N-in')).filter(w=>[w.from,w.to].some(e=>e.kind==='bar'&&e.id==='rcd:rx')).length,1,'a bekötés szerinti ÁVK sínje')}
}

// 5) A kézi bekötés felülír; a sínkapcsok kihagyják a kézzel használtakat.
{
 const p=base();add(p,'nm','NEUTRAL',1,0,4);add(p,'pm','PE',1,4,4);
 p.boardWires.push(wire('x-n',c('c1','N'),m('nm','N1')),wire('x-pe',c('c1','PE'),m('pm','PE1')),wire('x-feed',m('m0','N-out'),m('nm','N2')),wire('x-t',c('c2','N'),b('rcd:m1','T1')));
 validatePlan(p);
 const auto=invariants(p);
 assert.equal(touches(auto.wires,c('c1','N')).length,0);assert.equal(touches(auto.wires,c('c1','PE')).length,0);
 assert.equal(touches(auto.wires,c('c2','N')).length,0,'a kézi bekötésű áramköri szál nem kap automatikusat');
 assert.equal(touches(auto.wires,m('m0','N-out')).length,0,'a kézi vezetékű készülékkapocsra nincs automatikus');
 assert.ok(touches(auto.wires,m('m1','N-out')).length===1&&touches(auto.wires,m('m1','N-out'))[0].to.port==='T2','az ÁVK N-out a legkisebb szabad kapcsot kapja (a T1-et kézi vezeték használja)');
 assert.ok(has(auto.wires,c('c3','N'),b('rcd:m1','T3')));
 // a kézi vezeték is szerepel a tényleges listában, elöl
 const eff=effectiveBoardWires(p);assert.deepEqual(eff.wires.slice(0,p.boardWires.length),p.boardWires);assert.equal(eff.auto.size,auto.wires.length);
 // kézi bekötés sínre a felhasználó által (felülírás): c1 N → N-sín · FI-01 T4
 const q=base();connectBoard(q,wire('o',c('c1','N'),b('rcd:m1','T4')));validatePlan(q);const a2=invariants(q);assert.equal(touches(a2.wires,c('c1','N')).length,0);
 assert.ok(!a2.wires.some(w=>[w.from,w.to].some(e=>e.kind==='bar'&&e.id==='rcd:m1'&&e.port==='T4')),'a kézzel használt T4 kapocsra nincs automatikus');
 // N → PE-sín tilos, sín–sín tilos, nem létező kapocs tilos
 assert.throws(()=>connectBoard(base(),wire('bad',c('c1','N'),b('pe:house/','T1'))),/Eltérő/);
 assert.throws(()=>connectBoard(base(),wire('bad',b('n:house/','T1'),b('rcd:m1','T1'))),/Két sín/);
 assert.throws(()=>connectBoard(base(),wire('bad',c('c1','N'),b('rcd:m1','T0'))));assert.throws(()=>connectBoard(base(),wire('bad',c('c1','N'),b('rcd:m1','T401'))));
 assert.throws(()=>connectBoard(base(),wire('bad',c('c1','N'),b('rcd:nincs','T1'))));assert.throws(()=>connectBoard(base(),wire('bad',c('c1','N'),b('n:garage/','T1'))),/hiányzik/,'üres elosztó sínje nem létezik');
 // a sínkapocs több kézi vezetéket is fogad, az áramköri szál csak egyet
 const r=base();connectBoard(r,wire('a1',c('c1','PE'),b('pe:house/','T1')));connectBoard(r,wire('a2',c('c2','PE'),b('pe:house/','T1')));
 assert.throws(()=>connectBoard(r,wire('a3',c('c1','PE'),b('pe:house/','T2'))),/már be van kötve/);
 // az RCBO-hoz kötés áramkör-hozzárendelést kíván (a meglévő szabály)
 const s=base();add(s,'qx','RCBO',1,0,2,{circuit:'c2'});assert.throws(()=>connectBoard(s,wire('w',c('c1','N'),m('qx','N-out'))),/másik áramkör/);
}

// 6) Elosztónkénti kapcsoló: autoBars:false → nincs automatikus vezeték, a sínek megmaradnak.
{
 const p=base();assert.equal(autoBarsOn(p.buildings[0],''),true);
 setAutoBars(p.buildings[0],'',false);
 assert.deepEqual(p.buildings[0].board,{rows:4,modulesPerRow:18,autoBars:false});assert.equal(autoBarsOn(p.buildings[0],''),false);
 validatePlan(p);assert.deepEqual(autoBoardWires(p,'house',''),{wires:[],warnings:[]});assert.equal(boardBars(p,'house','').length,3);
 assert.equal(boardBarPorts(p,'house','').length,3);assert.equal(effectiveBoardWires(p).wires.length,0);assert.equal(boardWiring(p,'house','').wires.length,0);
 assert.equal(cabinetLayout(p,'house').bars.length,3);
 setAutoBars(p.buildings[0],'',true);assert.equal(p.buildings[0].board!.autoBars,undefined);assert.equal(autoBoardWires(p,'house','').wires.length,9);
 // alelosztónál is (a főelosztótól függetlenül)
 p.buildings[0].extraBoards=[{id:'sub',name:'Alelosztó',rows:2,modulesPerRow:6}];circuit(p,'sc',{board:'sub'});add(p,'sq','MCB',0,0,1,{board:'sub',circuit:'sc'});
 assert.equal(autoBoardWires(p,'house','sub').wires.length,2);
 setAutoBars(p.buildings[0],'sub',false);assert.equal(p.buildings[0].extraBoards[0].autoBars,false);assert.equal(autoBoardWires(p,'house','sub').wires.length,0);assert.equal(autoBoardWires(p,'house','').wires.length,9,'a főelosztó változatlan');
 assert.equal(boards3(p),'main on, sub off');
 setAutoBars(p.buildings[0],'sub',true);assert.equal('autoBars' in p.buildings[0].extraBoards[0],false);
 // a hiányzó főelosztó-beállítás bekapcsolása nem hoz létre board objektumot
 const q=base();setAutoBars(q.buildings[0],'',true);assert.equal(q.buildings[0].board,undefined);
}
function boards3(p:Plan){return `main ${autoBarsOn(p.buildings[0],'')?'on':'off'}, sub ${autoBarsOn(p.buildings[0],'sub')?'on':'off'}`}

// 7) Terminálszám: max(6, a sínre futó vezetékek + 2).
{
 const p=base();for(let i=0;i<9;i++)circuit(p,'x'+i,{rcd:'FI-01'});
 const ports=boardBarPorts(p,'house','').find(x=>x.id==='rcd:m1')!.ports;
 const wiresOn=autoBoardWires(p,'house','').wires.filter(w=>[w.from,w.to].some(e=>e.id==='rcd:m1')).length;
 assert.equal(wiresOn,13);assert.equal(ports.length,wiresOn+2);assert.deepEqual(ports.slice(0,2).map(x=>x.id),['T1','T2']);assert.ok(ports.every(x=>x.signal==='N'));
 invariants(p);
 // a kézzel használt magas kapocs megmarad a listában
 const q=base();connectBoard(q,wire('hi',c('c1','PE'),b('pe:house/','T9')));assert.ok(boardBarPorts(q,'house','').find(x=>x.id==='pe:house/')!.ports.length>=9);validatePlan(q);
}

// 8) Törlés, tisztítás, áthelyezés.
{
 const p=base();connectBoard(p,wire('o',c('c1','N'),b('rcd:m1','T4')));connectBoard(p,wire('p',c('c1','PE'),b('pe:house/','T1')));
 const gone=structuredClone(p);removeBoardLinks(gone,'module','m1');gone.modules=gone.modules.filter(x=>x.id!=='m1');
 assert.deepEqual(gone.boardWires.map(w=>w.id),['p'],'az ÁVK törlése a saját N-sínjére kötött vezetéket is megszünteti');validatePlan(gone);
 assert.equal(endpointInfo(gone,b('rcd:m1','T4')),null,'a megszűnt sín kapcsa nem létezik');
 assert.deepEqual(boardBars(gone,'house','').map(x=>x.id),['pe:house/','n:house/']);
 // csak a modult törölve a vezetékek maradnak → a validáció elutasítja, a pruneBoardLinks tisztít
 const stale=structuredClone(p);stale.modules=stale.modules.filter(x=>x.id!=='m1');assert.throws(()=>validatePlan(stale));pruneBoardLinks(stale);assert.deepEqual(stale.boardWires.map(w=>w.id),['p']);validatePlan(stale);
 // a fázis vagy a hozzárendelés változása nem érinti a sínvezetékeket
 const ph=structuredClone(p);ph.circuits[0].phase='3P';pruneBoardLinks(ph);assert.equal(ph.boardWires.length,2);
 // az ÁVK nem helyezhető át, amíg a sínjén kézi vezeték van
 assert.throws(()=>{p.buildings[0].extraBoards=[{id:'sub',name:'Alelosztó',rows:2,modulesPerRow:6}];moveBoardModule(p,'m1','sub')},/Áthelyezés/);
 // üressé váló elosztóban nincs sín
 const e=base();e.modules=[];e.circuits=[];e.boardWires=[];assert.deepEqual(boardBars(e,'house',''),[]);assert.deepEqual(effectiveBoardWires(e).wires,[]);
}

// 9) Szerkezetmásolás, sablon, épület törlése: a sín-végpontok azonosítói a modul- és elosztóazonosítókból képződnek, ezért nincs mit átkötni.
{
 const p=base();connectBoard(p,wire('o',c('c1','N'),b('rcd:m1','T4')));connectBoard(p,wire('p',c('c1','PE'),b('pe:house/','T1')));
 const copied=copyStructure(p,{buildingId:'house',floorId:'ground',name:'Másolat',elevation:6,dx:0,dy:0,contents:true,keepCircuits:true,panels:true,background:false}).plan;
 assert.deepEqual(copied.boardWires,p.boardWires,'a szintmásolás nem érinti az elosztó bekötéseit és sínvégpontjait');assert.deepEqual(copied.modules,p.modules);
 assert.deepEqual(effectiveBoardWires(copied).wires,effectiveBoardWires(p).wires);
 const rm=structuredClone(p);removeStructure(rm,'house','ground');assert.equal(rm.boardWires.length,2,'szint törlése nem érinti az elosztót');
 removeStructure(rm,'house');assert.equal(rm.boardWires.length,0);assert.equal(rm.modules.length,0);validatePlan(rm);assert.equal(effectiveBoardWires(rm).wires.length,0);
}

// 10) Séma: a sín-végpont és az autoBars megmarad mentésnél, importnál és a megosztott nézetben.
{
 const p=base();p.buildings[0].board={rows:4,modulesPerRow:18,autoBars:false};
 p.buildings[0].extraBoards=[{id:'sub',name:'Alelosztó',rows:2,modulesPerRow:6,autoBars:false}];circuit(p,'sc',{board:'sub'});add(p,'sq','MCB',0,0,1,{board:'sub',circuit:'sc'});
 connectBoard(p,wire('o',c('c1','N'),b('rcd:m1','T4')));connectBoard(p,wire('o2',c('sc','PE'),b('pe:house/sub','T1')));
 const round=validatePlan(JSON.parse(JSON.stringify(p)));assert.deepEqual(round,p);
 assert.equal(round.buildings[0].board!.autoBars,false);assert.equal(round.buildings[0].extraBoards![0].autoBars,false);
 assert.equal(round.boardWires[0].to.kind,'bar');
 const shared=sharedPlan(JSON.parse(JSON.stringify(p))).plan;
 assert.equal(shared.buildings[0].board!.autoBars,false);assert.equal(shared.buildings[0].extraBoards![0].autoBars,false);assert.deepEqual(shared.boardWires,p.boardWires);
 assert.equal(effectiveBoardWires(shared).auto.size,0);
 const on=sharedPlan(JSON.parse(JSON.stringify(base()))).plan;assert.equal(effectiveBoardWires(on).auto.size,9,'a megosztott nézet ugyanazt az automatikus bekötést származtatja');
 // a régi terv (autoBars nélkül) bekapcsolva viselkedik
 const legacy=JSON.parse(JSON.stringify(seed));assert.equal(legacy.buildings[0].board,undefined);assert.equal(effectiveBoardWires(validatePlan(legacy)).auto.size,9);
 // a hosszú azonosítók is elférnek a végpont azonosítójában
 const long=base();long.buildings[0].id='h'.repeat(80);long.circuits.forEach(x=>x.building=long.buildings[0].id);long.modules.forEach(x=>x.building=long.buildings[0].id);
 const ln=autoBoardWires(long,long.buildings[0].id,'');assert.ok(ln.wires.every(w=>[w.from,w.to].every(e=>e.id.length<=200)));
 const q=structuredClone(long);q.boardWires=ln.wires.map(w=>({...w,id:w.id.slice(0,60)+Math.random().toString(36).slice(2,8),name:w.name.slice(0,120)}));validatePlan(q);
}
// 11) Több főkapcsoló: a főnullasínt egyetlen forrás táplálja (az első sor, hely, azonosító szerint), a többi figyelmeztetést kap.
{
 const p=base();add(p,'main2','MAIN',2,0,4);validatePlan(p);
 const auto=invariants(p),feeds=auto.wires.filter(w=>[w.from,w.to].some(e=>e.kind==='bar'&&e.id==='n:house/')&&[w.from,w.to].some(e=>e.port==='N-out'));
 assert.equal(feeds.length,1);assert.ok(viaBar(auto.wires,m('m0','N-out'),'n:house/'),'az első főkapcsoló (m0) táplálja a sínt');
 assert.equal(touches(auto.wires,m('main2','N-out')).length,0);
 assert.deepEqual(auto.warnings,['main2: több főkapcsoló van az elosztóban; az N-kimenete nem kerül automatikusan a főnullasínre.']);
 // a sorrend sor, hely, azonosító szerint: az előrébb lévő a „első”
 const q=base();add(q,'main2','MAIN',2,0,4);q.modules.find(x=>x.id==='m0')!.row=3;validatePlan(q);
 const a2=invariants(q);assert.equal(touches(a2.wires,m('main2','N-out')).filter(w=>[w.from,w.to].some(e=>e.kind==='bar'&&e.id==='n:house/')).length,1);assert.equal(touches(a2.wires,m('m0','N-out')).length,0);assert.match(a2.warnings[0],/^Főkapcsoló: több főkapcsoló/);
 // az első főkapcsoló N-kimenetén kézi vezeték van: arra nincs automatikus, a másodikra sincs (és figyelmeztet)
 const r=base();add(r,'main2','MAIN',2,0,4);add(r,'nm','NEUTRAL',3,0,4);r.boardWires.push(wire('x',m('m0','N-out'),m('nm','N1')));validatePlan(r);
 const a3=invariants(r);assert.equal(touches(a3.wires,m('m0','N-out')).length,0);assert.equal(touches(a3.wires,m('main2','N-out')).length,0);assert.equal(a3.warnings.length,2,'a második főkapcsoló figyelmeztetése + a nem táplált főnullasín miatt kimaradó ÁVK N-bemenet');assert.ok(a3.warnings.some(w=>/^main2: több főkapcsoló/.test(w)));assert.ok(a3.warnings.some(w=>/^FI-01 · 40 A \/ 30 mA · A: a\(z\) N-sín nem kap betáplálást \(a\(z\) Főkapcsoló N-kimenete kézzel máshová van kötve\), ezért az N-bemenet automatikus bekötése kimarad\.$/.test(w)));
 // ha a második főkapcsoló N-kimenetét a tervező kézzel bekötötte, nincs figyelmeztetés
 const t=base();add(t,'main2','MAIN',2,0,4);add(t,'nm','NEUTRAL',3,0,4);t.boardWires.push(wire('x',m('main2','N-out'),m('nm','N1')));validatePlan(t);assert.deepEqual(invariants(t).warnings,[]);
 // egyetlen főkapcsolónál (a seed) nincs figyelmeztetés
 assert.deepEqual(invariants(base()).warnings,[]);
}

// 12) Kaszkádolt ÁVK: az alsó ÁVK N-bemenete a felső ÁVK N-sínjéről jön (különben a felső ÁVK toroidját megkerülné a nulla); a kézi L-bekötés a bizonyíték.
{
 const p=base();add(p,'rcd2','RCD',1,0,4,{name:'FI-02 · 25 A'});p.boardWires.push(wire('cas',m('m1','L1-out'),m('rcd2','L1-in')));validatePlan(p);
 const auto=invariants(p);
 assert.ok(viaBar(auto.wires,m('rcd2','N-in'),'rcd:m1'),'az alsó ÁVK N-bemenete a felső ÁVK N-sínjéről');
 assert.ok(!touches(auto.wires,m('rcd2','N-in')).some(w=>[w.from,w.to].some(e=>e.kind==='bar'&&e.id==='n:house/')),'nem a főnullasínről');
 assert.ok(viaBar(auto.wires,m('rcd2','N-out'),'rcd:rcd2'));assert.deepEqual(auto.warnings,[]);
 // az alsó ÁVK mögötti áramkör N-je az alsó ÁVK sínjére kerül
 circuit(p,'c4',{rcd:'FI-02'});add(p,'q4','MCB',1,4,1,{circuit:'c4'});p.boardWires.push(wire('d',m('rcd2','L1-out'),m('q4','L-in')));validatePlan(p);
 assert.deepEqual(rcdGroup(p,p.circuits.find(x=>x.id==='c4')!),{status:'rcd',rcdId:'rcd2'});assert.ok(viaBar(invariants(p).wires,c('c4','N'),'rcd:rcd2'));
 // fázissínen át is a felső ÁVK a forrás
 const q=base();add(q,'rcd2','RCD',1,0,4,{name:'FI-02'});add(q,'bb','BUSBAR',2,0,4);q.boardWires.push(wire('a',m('m1','L2-out'),m('bb','L-1')),wire('z',m('bb','L-3'),m('rcd2','L2-in')));validatePlan(q);
 assert.ok(viaBar(invariants(q).wires,m('rcd2','N-in'),'rcd:m1'));
 // főkapcsolóról közvetlenül táplált ÁVK: főnullasín
 const r=base();add(r,'rcd2','RCD',1,0,4,{name:'FI-02'});r.boardWires.push(wire('a',m('m0','L1-out'),m('rcd2','L1-in')));validatePlan(r);
 {const a=invariants(r);assert.ok(viaBar(a.wires,m('rcd2','N-in'),'n:house/'));assert.deepEqual(a.warnings,[])}
 // több forrásról táplált ÁVK (két másik ÁVK, vagy ÁVK és főkapcsoló): nincs N-bemenet-vezeték, figyelmeztetés
 const t=base();add(t,'rcd2','RCD',1,0,4,{name:'FI-02'});add(t,'rcd3','RCD',2,0,4,{name:'FI-03'});t.boardWires.push(wire('a',m('m1','L1-out'),m('rcd3','L1-in')),wire('b2',m('rcd2','L2-out'),m('rcd3','L2-in')));validatePlan(t);
 {const a=invariants(t);assert.equal(touches(a.wires,m('rcd3','N-in')).length,0);assert.ok(a.warnings.some(w=>/^FI-03: az ÁVK L-oldali betáplálása nem egyértelmű/.test(w)));assert.ok(viaBar(a.wires,m('rcd3','N-out'),'rcd:rcd3'))}
 const u=base();add(u,'rcd2','RCD',1,0,4,{name:'FI-02'});u.boardWires.push(wire('a',m('m1','L1-out'),m('rcd2','L1-in')),wire('b2',m('m0','L2-out'),m('rcd2','L2-in')));validatePlan(u);
 {const a=invariants(u);assert.equal(touches(a.wires,m('rcd2','N-in')).length,0);assert.equal(a.warnings.length,1)}
 // a saját kimenetére visszakötött ÁVK nem önmaga forrása; a kézi N-bemenet-vezeték marad
 const v=base();add(v,'rcd2','RCD',1,0,4,{name:'FI-02'});add(v,'bb','BUSBAR',2,0,4);v.boardWires.push(wire('a',m('rcd2','L1-out'),m('bb','L-1')),wire('b2',m('bb','L-2'),m('rcd2','L1-in')));validatePlan(v);
 assert.ok(viaBar(invariants(v).wires,m('rcd2','N-in'),'n:house/'),'önmaga nem forrás → főnullasín');
 const w=base();add(w,'rcd2','RCD',1,0,4,{name:'FI-02'});w.boardWires.push(wire('cas',m('m1','L1-out'),m('rcd2','L1-in')),wire('hand',m('rcd2','N-in'),b('n:house/','T5')));validatePlan(w);
 assert.equal(touches(invariants(w).wires,m('rcd2','N-in')).length,0,'a kézi N-bemenet-vezeték felülír');
}

// 13) A bekötés és az ÁVK-csoport szövegének ellentmondása: nem azonosítható (soha nem kerül idegen ÁVK N-sínjére); a fázissín/leágazó/sorkapocs átvezet.
{
 const g=(p:Plan,id='c1')=>rcdGroup(p,p.circuits.find(x=>x.id===id)!);
 const conflict=/^A\(z\) „FI-01” ÁVK-csoport ellentmond a bekötésnek \(a védelem a főkapcsolóról kap betáplálást\)\.$/;
 // Q1 L-bemenete közvetlenül a főkapcsoló L1-kimenetéről, a szöveg mégis FI-01
 const p=base();p.boardWires.push(wire('x1',m('m0','L1-out'),m('m2','L-in')));validatePlan(p);
 assert.equal(g(p).status,'unresolved');assert.match(g(p).reason!,conflict);
 {const a=invariants(p);assert.equal(touches(a.wires,c('c1','N')).length,0,'idegen ÁVK N-sínjére nem kerül');assert.ok(a.wires.some(w=>w.id==='auto:c1:PE'),'a PE ilyenkor is bekötve');
  assert.equal(a.warnings.length,1);assert.match(a.warnings[0],/^Nappali dugaljak: A\(z\) „FI-01” ÁVK-csoport ellentmond a bekötésnek .* Az N-szál automatikus bekötése kimarad\.$/);
  assert.ok(viaBar(a.wires,c('c2','N'),'rcd:m1'),'a többi áramkör változatlan')}
 // üres szöveg: a bekötés szerint nincs ÁVK → főnullasín (nincs ellentmondás)
 p.circuits[0].rcd='';assert.deepEqual(g(p),{status:'none'});assert.ok(viaBar(invariants(p).wires,c('c1','N'),'n:house/'));assert.deepEqual(invariants(p).warnings,[]);
 // olyan szöveg, amely nem azonosít ÁVK-t: a meglévő „nem található” indok
 p.circuits[0].rcd='FI-99';assert.deepEqual(g(p),{status:'unresolved',reason:'A(z) „FI-99” ÁVK-csoport nem található ebben az elosztóban.'});
 // fázissínen át a főkapcsoló a forrás (az ÁVK az RCD-ről, a főkapcsolóról külön)
 const q=base();add(q,'bb','BUSBAR',1,0,4);q.boardWires.push(wire('a',m('m0','L1-out'),m('bb','L-1')),wire('z',m('bb','L-2'),m('m2','L-in')));validatePlan(q);
 assert.equal(g(q).status,'unresolved');assert.match(g(q).reason!,conflict);q.circuits[0].rcd='';assert.deepEqual(g(q),{status:'none'});
 // fázissínen át az ÁVK a forrás: a bekötés a szövegnél erősebb, a szöveg lehet üres vagy téves
 const r=base();add(r,'bb','BUSBAR',1,0,4);r.boardWires.push(wire('a',m('m1','L1-out'),m('bb','L-1')),wire('z',m('bb','L-2'),m('m2','L-in')));validatePlan(r);
 for(const t of ['','FI-77','FI-01']){r.circuits[0].rcd=t;assert.deepEqual(g(r),{status:'rcd',rcdId:'m1'},'szöveg: '+JSON.stringify(t))}
 r.circuits[0].rcd='';assert.ok(viaBar(invariants(r).wires,c('c1','N'),'rcd:m1'),'fázissín mögötti áramkör N-je az ÁVK sínjén');
 // egy sínt az ÁVK és a főkapcsoló is táplál: ellentmondó betáplálás → nem azonosítható
 const s=base();add(s,'bb','BUSBAR',1,0,4);s.boardWires.push(wire('a',m('m1','L1-out'),m('bb','L-1')),wire('b2',m('m0','L1-out'),m('bb','L-3')),wire('z',m('bb','L-2'),m('m2','L-in')));validatePlan(s);
 assert.equal(g(s).status,'unresolved');assert.match(g(s).reason!,/az ÁVK-ból és a főkapcsolóról is kap betáplálást/);
 {const a=invariants(s);assert.equal(touches(a.wires,c('c1','N')).length,0);assert.equal(a.warnings.length,1)}
 // leágazó: csak az azonos fázisú kapcsok egy csomópont (L1-1 és L1-2 igen, L2-1 nem)
 const d=base();add(d,'dist','DISTRIBUTION',1,0,4);
 d.boardWires.push(wire('a',m('m1','L1-out'),m('dist','L1-1')),wire('b2',m('m0','L2-out'),m('dist','L2-1')),wire('z',m('dist','L1-2'),m('m2','L-in')));validatePlan(d);
 assert.deepEqual(g(d),{status:'rcd',rcdId:'m1'},'az L2 csomópont (főkapcsoló) nem számít');
 // sorkapocs L-1 / L-2 egy csomópont
 const t=base();add(t,'tk','TERMINAL',1,0,2);t.boardWires.push(wire('a',m('m1','L1-out'),m('tk','L-1')),wire('z',m('tk','L-2'),m('m2','L-in')));validatePlan(t);assert.deepEqual(g(t),{status:'rcd',rcdId:'m1'});
 // körbe kötött fázissínek: nem akad el, és nem ad forrást
 const u=base();add(u,'b1','BUSBAR',1,0,4);add(u,'b2','BUSBAR',2,0,4);
 u.boardWires.push(wire('a',m('b1','L-1'),m('b2','L-1')),wire('w2',m('b1','L-2'),m('b2','L-2')),wire('z',m('b1','L-3'),m('m2','L-in')));validatePlan(u);u.circuits[0].rcd='';
 assert.deepEqual(g(u),{status:'none'});
 // a betáplálás nélküli, névtelen sín nem ellentmondás: a szöveg dönt
 const w=base();add(w,'bb','BUSBAR',1,0,4);w.boardWires.push(wire('z',m('bb','L-2'),m('m2','L-in')));validatePlan(w);assert.deepEqual(g(w),{status:'rcd',rcdId:'m1'});
 // RCBO: a védelme a főkapcsolóról kap betáplálást, a szöveg ÁVK-t nevez meg → az N-in nem kerül sínre, a figyelmeztetés megjelenik, az áramkör N-je az RCBO N-out kapcsán marad
 const x=base();circuit(x,'c4',{rcd:'FI-01'});add(x,'q4','RCBO',1,0,2,{circuit:'c4'});x.boardWires.push(wire('f',m('m0','L1-out'),m('q4','L-in')));validatePlan(x);
 {const a=invariants(x);assert.equal(touches(a.wires,m('q4','N-in')).length,0);assert.ok(has(a.wires,c('c4','N'),m('q4','N-out')));assert.ok(a.warnings.some(w=>/^q4: A\(z\) „FI-01” ÁVK-csoport ellentmond a bekötésnek/.test(w)))}
}

// 14) RCBO: ha a modul N-kimenetén kézi vezeték van, az áramkör N-jére nincs automatikus vezeték (figyelmeztetés), az N-bemenet marad.
{
 const p=base();circuit(p,'c4',{rcd:'FI-01'});add(p,'q4','RCBO',1,0,2,{circuit:'c4'});add(p,'nm','NEUTRAL',2,0,4);p.boardWires.push(wire('x',m('q4','N-out'),m('nm','N1')));validatePlan(p);
 const a=invariants(p);
 assert.ok(!a.wires.some(w=>w.id==='auto:c4:N'));assert.equal(touches(a.wires,m('q4','N-out')).length,0,'a kézi vezetékű kapocsra nincs automatikus');assert.equal(touches(a.wires,c('c4','N')).length,0);
 assert.ok(viaBar(a.wires,c('c4','PE'),'pe:house/'),'a PE ettől még bekötve');assert.ok(viaBar(a.wires,m('q4','N-in'),'rcd:m1'));
 assert.deepEqual(a.warnings,['c4: a(z) q4 N-kimenetén kézi bekötés van, ezért az áramkör N-szálának automatikus bekötése kimarad.']);
 // az N-bemeneten kézi vezeték: arra nincs automatikus, az N-kimenet viszont igen
 const q=base();circuit(q,'c4',{rcd:'FI-01'});add(q,'q4','RCBO',1,0,2,{circuit:'c4'});q.boardWires.push(wire('y',m('q4','N-in'),b('n:house/','T9')));validatePlan(q);
 {const b2=invariants(q);assert.equal(touches(b2.wires,m('q4','N-in')).length,0);assert.ok(has(b2.wires,c('c4','N'),m('q4','N-out')));assert.deepEqual(b2.warnings,[])}
}
// 15) A bekötés mint bizonyíték: az L-bemenetek áthidalása, a csoport-kismegszakító (fázissínnel vagy anélkül), az RCBO mögötti védelem; körök; az ÁVK N-bemenete is ezt követi.
{
 const g=(p:Plan,id:string)=>rcdGroup(p,p.circuits.find(x=>x.id===id)!);
 const nBar=(a:ReturnType<typeof autoBoardWires>,id:string)=>a.wires.find(w=>w.id==='auto:'+id+':N');
 const onBarOf=(a:ReturnType<typeof autoBoardWires>,id:string)=>{const w=nBar(a,id);const e=w&&[w.from,w.to].find(x=>x.kind==='bar');return e?.id};
 // (a) szomszéd kismegszakító L-bemenetéről áthidalt védelem (szokásos áthidalás): Q1 L-in ← FI-01 L1-out, Q4 L-in ↔ Q1 L-in
 for(const text of ['','FI-02','FI-01']){
  const p=base();add(p,'rx','RCD',1,0,4,{name:'FI-02 · 40 A'});circuit(p,'c4',{rcd:text});add(p,'q4','MCB',1,4,1,{circuit:'c4'});
  p.boardWires.push(wire('a',m('m1','L1-out'),m('m2','L-in')),wire('j',m('m2','L-in'),m('q4','L-in')));validatePlan(p);
  assert.deepEqual(g(p,'c4'),{status:'rcd',rcdId:'m1'},'az áthidalás a szomszéd betáplálását örökíti, szöveg: '+JSON.stringify(text));
  const a=invariants(p);assert.equal(onBarOf(a,'c4'),'rcd:m1','az N a bekötés szerinti ÁVK sínjére kerül, nem a főnullasínre és nem a szöveg szerinti másikra');assert.deepEqual(a.warnings,[]);
  assert.deepEqual(g(p,'c1'),{status:'rcd',rcdId:'m1'});
 }
 // az áthidalás iránya mindegy, és az ÁVK-ra is vonatkozik: a főkapcsolóról táplált szomszéd + ÁVK-t megnevező szöveg = ellentmondás
 {const p=base();circuit(p,'c4',{rcd:'FI-01'});add(p,'q4','MCB',1,4,1,{circuit:'c4'});p.boardWires.push(wire('a',m('m0','L1-out'),m('m2','L-in')),wire('j',m('q4','L-in'),m('m2','L-in')));validatePlan(p);
  assert.equal(g(p,'c4').status,'unresolved');assert.match(g(p,'c4').reason!,/ellentmond a bekötésnek/);
  const a=invariants(p);assert.equal(nBar(a,'c4'),undefined);assert.equal(a.warnings.length,2,'Q1 (c1) és Q4 (c4) is ellentmond');
  p.circuits.find(x=>x.id==='c4')!.rcd='';assert.deepEqual(g(p,'c4'),{status:'none'});assert.equal(onBarOf(invariants(p),'c4'),'n:house/')}
 // áthidalás láncban és körben: a követés véges, és mindenki a forrás ÁVK-ját kapja
 {const p=base();for(const k of [4,5,6]){circuit(p,'c'+k,{rcd:''});add(p,'q'+k,'MCB',1,k,1,{circuit:'c'+k})}
  p.boardWires.push(wire('a',m('m1','L1-out'),m('m2','L-in')),wire('j4',m('m2','L-in'),m('q4','L-in')),wire('j5',m('q4','L-in'),m('q5','L-in')),wire('j6',m('q5','L-in'),m('q6','L-in')),wire('j7',m('q6','L-in'),m('m2','L-in')));validatePlan(p);
  for(const k of [4,5,6])assert.deepEqual(g(p,'c'+k),{status:'rcd',rcdId:'m1'},'lánc/kör, q'+k);
  assert.equal(onBarOf(invariants(p),'c6'),'rcd:m1');
  // forrás nélküli kör: a szöveg dönt
  const q=base();for(const k of [4,5,6]){circuit(q,'c'+k,{rcd:k===4?'FI-01':''});add(q,'q'+k,'MCB',1,k,1,{circuit:'c'+k})}
  q.boardWires.push(wire('j4',m('q4','L-in'),m('q5','L-in')),wire('j5',m('q5','L-in'),m('q6','L-in')),wire('j6',m('q6','L-in'),m('q4','L-in')));validatePlan(q);
  assert.deepEqual(g(q,'c4'),{status:'rcd',rcdId:'m1'});assert.deepEqual(g(q,'c5'),{status:'none'});invariants(q)}
 // három pólusú áthidalás és fázis szerinti követés: az L2 a főkapcsolóról, az L1 az ÁVK-ról
 {const p=base();circuit(p,'cg',{phase:'3P',rcd:''});add(p,'g','MCB',1,0,1,{circuit:'cg'});circuit(p,'c4',{rcd:''});add(p,'q4','MCB',1,4,1,{circuit:'c4'});circuit(p,'c5',{rcd:'',phase:'L2'});add(p,'q5','MCB',1,5,1,{circuit:'c5'});
  p.boardWires.push(wire('a',m('m1','L1-out'),m('g','L1-in')),wire('b2',m('m0','L2-out'),m('g','L2-in')),wire('c',m('g','L1-out'),m('q4','L-in')),wire('d',m('g','L2-out'),m('q5','L-in')));validatePlan(p);
  assert.deepEqual(g(p,'c4'),{status:'rcd',rcdId:'m1'},'a 3P csoport-kismegszakító L1 kimenete az L1 bemenetét követi');assert.deepEqual(g(p,'c5'),{status:'none'},'az L2 a főkapcsolóról jön');
  const a=invariants(p);assert.equal(onBarOf(a,'c4'),'rcd:m1');assert.equal(onBarOf(a,'c5'),'n:house/')}
 // (b) csoport-kismegszakító: ÁVK → QG → (fázissín →) Q4, üres szöveggel is és téves szöveggel is
 for(const text of ['','FI-02']){
  const p=base();add(p,'rx','RCD',1,8,4,{name:'FI-02'});circuit(p,'c4',{rcd:text});add(p,'q4','MCB',1,4,1,{circuit:'c4'});add(p,'qg','MCB',1,0,1);add(p,'bb','BUSBAR',2,0,4);
  p.boardWires.push(wire('a',m('m1','L1-out'),m('qg','L-in')),wire('b2',m('qg','L-out'),m('bb','L-1')),wire('c',m('bb','L-2'),m('q4','L-in')));validatePlan(p);
  assert.deepEqual(g(p,'c4'),{status:'rcd',rcdId:'m1'},'csoport-kismegszakító + fázissín, szöveg: '+JSON.stringify(text));
  const a=invariants(p);assert.equal(onBarOf(a,'c4'),'rcd:m1');assert.deepEqual(a.warnings,[]);
  // közvetlenül, fázissín nélkül is
  const q=base();circuit(q,'c4',{rcd:text});add(q,'q4','MCB',1,4,1,{circuit:'c4'});add(q,'qg','MCB',1,0,1);q.boardWires.push(wire('a',m('m1','L1-out'),m('qg','L-in')),wire('b2',m('qg','L-out'),m('q4','L-in')));validatePlan(q);
  assert.deepEqual(g(q,'c4'),{status:'rcd',rcdId:'m1'});assert.equal(onBarOf(invariants(q),'c4'),'rcd:m1');
 }
 // a főkapcsolóról táplált csoport-kismegszakító mögött nincs ÁVK
 {const p=base();circuit(p,'c4',{rcd:''});add(p,'q4','MCB',1,4,1,{circuit:'c4'});add(p,'qg','MCB',1,0,1);p.boardWires.push(wire('a',m('m0','L1-out'),m('qg','L-in')),wire('b2',m('qg','L-out'),m('q4','L-in')));validatePlan(p);
  assert.deepEqual(g(p,'c4'),{status:'none'});assert.equal(onBarOf(invariants(p),'c4'),'n:house/');
  p.circuits.find(x=>x.id==='c4')!.rcd='FI-01';assert.match(g(p,'c4').reason!,/ellentmond a bekötésnek/)}
 // a főkapcsoló L-bemenete (a főkapcsoló előtti betáplálás) is főkapcsolói betáplálás
 {const p=base();circuit(p,'c4',{rcd:''});add(p,'q4','MCB',1,4,1,{circuit:'c4'});p.boardWires.push(wire('a',m('m0','L1-in'),m('q4','L-in')));validatePlan(p);
  assert.deepEqual(g(p,'c4'),{status:'none'});p.circuits.find(x=>x.id==='c4')!.rcd='FI-01';assert.match(g(p,'c4').reason!,/ellentmond a bekötésnek/)}
 // az SPD L-kapcsa és az ÁVK L-bemenete is csomópont
 {const p=base();circuit(p,'c4',{rcd:''});add(p,'q4','MCB',1,4,1,{circuit:'c4'});add(p,'spd','SPD',2,0,4);p.boardWires.push(wire('a',m('m1','L1-out'),m('spd','L1')),wire('j',m('spd','L1'),m('q4','L-in')));validatePlan(p);
  assert.deepEqual(g(p,'c4'),{status:'rcd',rcdId:'m1'});
  const q=base();add(q,'rx','RCD',1,0,4,{name:'FI-02'});circuit(q,'c4',{rcd:''});add(q,'q4','MCB',1,8,1,{circuit:'c4'});q.boardWires.push(wire('a',m('m1','L1-out'),m('rx','L1-in')),wire('j',m('rx','L1-in'),m('q4','L-in')));validatePlan(q);
  assert.deepEqual(g(q,'c4'),{status:'rcd',rcdId:'m1'},'az ÁVK L-bemenetére kötött áthidalás az ÁVK betáplálóját örökíti (az ÁVK-val párhuzamos, nem az ÁVK mögötti)')}
 // (c) RCBO L-kimenetéről táplált kismegszakító: nem azonosítható (az RCBO N-sínje nincs), az N nem kerül a főnullasínre; szövegtől függetlenül
 for(const text of ['','FI-01']){
  const p=base();circuit(p,'c4',{rcd:''});add(p,'q4','RCBO',1,0,2,{circuit:'c4'});circuit(p,'c5',{rcd:text});add(p,'q5','MCB',1,4,1,{circuit:'c5'});
  p.boardWires.push(wire('a',m('q4','L-out'),m('q5','L-in')));validatePlan(p);
  assert.deepEqual(g(p,'c5'),{status:'unresolved',reason:'A(z) „c5” áramkör védelmi készüléke egy RCBO (q4) mögül kap betáplálást.'},'szöveg: '+JSON.stringify(text));
  const a=invariants(p);assert.equal(nBar(a,'c5'),undefined,'az N nem kerül főnullasínre');assert.ok(a.wires.some(w=>w.id==='auto:c5:PE'),'a PE bekötve');
  assert.deepEqual(a.warnings,['c5: A(z) „c5” áramkör védelmi készüléke egy RCBO (q4) mögül kap betáplálást. Az N-szál automatikus bekötése kimarad.']);
  assert.deepEqual(g(p,'c4'),{status:text===''?'none':'none'},'az RCBO saját csoportja a betáplálása szerint');
 }
 // fázissínen át is; az RCBO saját áramköre változatlan (az RCBO N-out kapcsán)
 {const p=base();circuit(p,'c4',{rcd:''});add(p,'q4','RCBO',1,0,2,{circuit:'c4'});circuit(p,'c5',{rcd:''});add(p,'q5','MCB',1,4,1,{circuit:'c5'});add(p,'bb','BUSBAR',2,0,4);
  p.boardWires.push(wire('a',m('q4','L-out'),m('bb','L-1')),wire('b2',m('bb','L-2'),m('q5','L-in')));validatePlan(p);
  assert.equal(g(p,'c5').status,'unresolved');const a=invariants(p);assert.equal(nBar(a,'c5'),undefined);assert.ok(has(a.wires,c('c4','N'),m('q4','N-out')));assert.equal(a.warnings.length,1)}
 // ÁVK az RCBO mögött: az ÁVK N-bemenete nincs bekötve (figyelmeztetés), az ÁVK saját N-sínje és a mögötte lévő áramkörök rendben
 {const p=base();circuit(p,'c4',{rcd:''});add(p,'q4','RCBO',1,0,2,{circuit:'c4'});add(p,'rx','RCD',2,0,4,{name:'FI-02'});circuit(p,'c5',{rcd:'FI-02'});add(p,'q5','MCB',2,4,1,{circuit:'c5'});
  p.boardWires.push(wire('a',m('q4','L-out'),m('rx','L1-in')),wire('b2',m('rx','L1-out'),m('q5','L-in')));validatePlan(p);
  const a=invariants(p);assert.equal(touches(a.wires,m('rx','N-in')).length,0);assert.ok(a.warnings.some(w=>/^FI-02: az ÁVK egy RCBO mögül kap betáplálást, ezért az N-bemenet automatikus bekötése kimarad\.$/.test(w)));
  assert.ok(viaBar(a.wires,m('rx','N-out'),'rcd:rx'));assert.equal(onBarOf(a,'c5'),'rcd:rx')}
 // (d) az ÁVK N-bemenete ugyanígy követ: áthidalás és kismegszakítón átvezetés is a felső ÁVK sínjére vezet
 {const p=base();add(p,'rx','RCD',1,0,4,{name:'FI-02'});p.boardWires.push(wire('a',m('m1','L1-out'),m('m2','L-in')),wire('j',m('m2','L-in'),m('rx','L1-in')));validatePlan(p);
  assert.ok(viaBar(invariants(p).wires,m('rx','N-in'),'rcd:m1'),'áthidalt ÁVK-bemenet: a felső ÁVK sínjéről');
  const q=base();add(q,'rx','RCD',1,0,4,{name:'FI-02'});add(q,'qg','MCB',2,0,1);q.boardWires.push(wire('a',m('m1','L1-out'),m('qg','L-in')),wire('b2',m('qg','L-out'),m('rx','L1-in')));validatePlan(q);
  assert.ok(viaBar(invariants(q).wires,m('rx','N-in'),'rcd:m1'),'kismegszakítón át táplált ÁVK: a felső ÁVK sínjéről');
  // főkapcsolóról kismegszakítón át: főnullasín
  const r=base();add(r,'rx','RCD',1,0,4,{name:'FI-02'});add(r,'qg','MCB',2,0,1);r.boardWires.push(wire('a',m('m0','L1-out'),m('qg','L-in')),wire('b2',m('qg','L-out'),m('rx','L1-in')));validatePlan(r);
  assert.ok(viaBar(invariants(r).wires,m('rx','N-in'),'n:house/'))}
}

// 16) Nem táplált sín: ha egy sín természetes betápláló kapcsa (az ÁVK N-kimenete; a főnullasínnél a főkapcsoló N-kimenete) kézzel máshová van kötve, a sínre fogyasztót nem kötünk,
// hanem figyelmeztetünk; így a szál bekötetlen marad (mint autoBars:false mellett), és nem látszik egy betáplálás nélküli sínre kötöttnek.
{
 const unfedWarn=(prefix:string,bar:string,feeder:string,what:string)=>`${prefix}: a(z) ${bar} nem kap betáplálást (a(z) ${feeder} N-kimenete kézzel máshová van kötve), ezért az ${what} automatikus bekötése kimarad.`;
 // (a) régi terv: az ÁVK N-kimenete és c1 N-je a DIN „Nullasín (N)” modulra kötve, c2 és c3 még nem
 {const p=base();add(p,'nn','NEUTRAL',1,0,4);p.boardWires.push(wire('w1',m('m1','N-out'),m('nn','N1')),wire('w2',c('c1','N'),m('nn','N2')));validatePlan(p);
  const a=invariants(p);
  assert.equal(touches(a.wires,c('c2','N')).length,0);assert.equal(touches(a.wires,c('c3','N')).length,0);
  assert.equal(a.wires.filter(w=>[w.from,w.to].some(e=>e.kind==='bar'&&e.id==='rcd:m1')).length,0,'a nem táplált ÁVK-sínre semmi nem kerül');
  assert.deepEqual(a.warnings,[unfedWarn('Hálószoba dugaljak','N-sín · FI-01','FI-01','N-szál'),unfedWarn('Világítás','N-sín · FI-01','FI-01','N-szál')]);
  assert.ok(has(a.wires,m('m0','N-out'),b('n:house/','T1')),'a főnullasín táplált');assert.ok(has(a.wires,m('m1','N-in'),b('n:house/','T2')));
  assert.ok(['c1','c2','c3'].every(id=>a.wires.some(w=>w.id==='auto:'+id+':PE')),'a PE ettől még bekötve');
  // a hiányzó N-szálak ugyanazok, mint autoBars:false mellett
  const off=structuredClone(p);off.buildings[0].board={rows:4,modulesPerRow:18,autoBars:false};
  const ms=(q:Plan)=>buildSchematic(q,'house','multi').missing.filter(x=>x.signal==='N').map(x=>x.circuit);
  assert.deepEqual(ms(p),ms(off));assert.deepEqual(ms(p),['Hálószoba dugaljak','Világítás']);
  assert.equal(buildSchematic(p,'house','multi').warnings.length,2);
  // ha az ÁVK-sínt a tervező kézzel a nullasín modulra köti (a sín táplált), a fogyasztók rákerülnek
  const q=structuredClone(p);q.boardWires.push(wire('w3',b('rcd:m1','T1'),m('nn','N3')));validatePlan(q);
  const a2=invariants(q);assert.deepEqual(a2.warnings,[]);assert.ok(viaBar(a2.wires,c('c2','N'),'rcd:m1')&&viaBar(a2.wires,c('c3','N'),'rcd:m1'));assert.ok(!a2.wires.some(w=>[w.from,w.to].some(e=>e.kind==='bar'&&e.id==='rcd:m1'&&e.port==='T1')),'a kézi T1 kapocs szabad marad')}
 // (b) a főkapcsoló N-kimenete kézzel az ÁVK N-bemenetére kötve (átkötés), ÁVK nélküli áramkörrel: a főnullasín nem táplált
 {const p=base();p.circuits[2].rcd='';p.boardWires.push(wire('j',m('m0','N-out'),m('m1','N-in')));validatePlan(p);
  const a=invariants(p);assert.equal(touches(a.wires,c('c3','N')).length,0);assert.deepEqual(a.warnings,[unfedWarn('Világítás','N-sín','Főkapcsoló','N-szál')]);
  assert.ok(viaBar(a.wires,c('c1','N'),'rcd:m1'),'az ÁVK sínje táplált, az áramkörei rendben');assert.ok(viaBar(a.wires,m('m1','N-out'),'rcd:m1'));assert.equal(touches(a.wires,m('m1','N-in')).length,0,'a kézi vezetékű N-bemenetre nincs automatikus');assert.equal(touches(p.boardWires,m('m1','N-in')).length,1);
  // SPD N-kapcsa és az ÁVK nélküli RCBO N-bemenete sem kerül a nem táplált főnullasínre
  add(p,'spd','SPD',1,0,4);circuit(p,'c4',{rcd:''});add(p,'q4','RCBO',1,4,2,{circuit:'c4'});validatePlan(p);
  const a2=invariants(p);assert.equal(touches(a2.wires,m('spd','N')).length,0);assert.equal(touches(a2.wires,m('q4','N-in')).length,0);assert.ok(has(a2.wires,m('spd','PE'),b('pe:house/','T1')));assert.ok(has(a2.wires,c('c4','N'),m('q4','N-out')),'az RCBO saját N-je nem sínre megy');
  assert.deepEqual(a2.warnings.map(w=>w.replace(/^[^:]+/,'')).sort(),[unfedWarn('','N-sín','Főkapcsoló','N-szál'),unfedWarn('','N-sín','Főkapcsoló','N-bemenet'),unfedWarn('','N-sín','Főkapcsoló','N-kapocs')].sort());
  assert.ok(a2.warnings.some(w=>w.startsWith('spd: ')&&w.endsWith('N-kapocs automatikus bekötése kimarad.')))}
 // (c) az ÁVK N-kimenete kézzel a főnullasínre kötve: az ÁVK-sín nem táplált, mögötte az áramkörök N-je bekötetlen
 {const p=base();p.boardWires.push(wire('x',m('m1','N-out'),b('n:house/','T5')));validatePlan(p);
  const a=invariants(p);assert.deepEqual(['c1','c2','c3'].map(id=>touches(a.wires,c(id,'N')).length),[0,0,0]);
  assert.deepEqual(a.warnings,[unfedWarn('Nappali dugaljak','N-sín · FI-01','FI-01','N-szál'),unfedWarn('Hálószoba dugaljak','N-sín · FI-01','FI-01','N-szál'),unfedWarn('Világítás','N-sín · FI-01','FI-01','N-szál')]);
  assert.ok(has(a.wires,m('m0','N-out'),b('n:house/','T1')),'a főnullasín táplált');assert.ok(a.wires.every(w=>!w.id.startsWith('auto:m1:N-out')),'a kézi vezetékű N-kimenetre nincs automatikus')}
 // (d) a sín kézzel közvetlenül az ÁVK N-kimenetéről táplált (a kézi betáplálás): táplált sín, a fogyasztók rákerülnek, a kézi kapocs szabad marad
 {const p=base();p.boardWires.push(wire('x',m('m1','N-out'),b('rcd:m1','T1')));validatePlan(p);
  const a=invariants(p);assert.deepEqual(a.warnings,[]);assert.ok(['c1','c2','c3'].every((id,i)=>has(a.wires,c(id,'N'),b('rcd:m1','T'+(i+2)))));
  // a főkapcsoló N-kimenete kézzel a főnullasínre: táplált
  const q=base();q.boardWires.push(wire('y',m('m0','N-out'),b('n:house/','T1')));validatePlan(q);
  assert.deepEqual(invariants(q).warnings,[])}
 // (e) főkapcsoló nélküli elosztó (kábelről táplált alelosztó): a főnullasínnek nincs természetes betáplálója, a fogyasztók rákerülnek, nincs figyelmeztetés
 {const p=base();p.buildings[0].extraBoards=[{id:'sub',name:'Alelosztó',rows:2,modulesPerRow:12}];
  circuit(p,'sc1',{board:'sub',rcd:''});add(p,'sq','MCB',0,0,1,{board:'sub',circuit:'sc1'});add(p,'srcd','RCD',0,4,4,{board:'sub',name:'FI-S · 25 A'});circuit(p,'sc2',{board:'sub',rcd:'FI-S'});add(p,'sq2','MCB',0,8,1,{board:'sub',circuit:'sc2'});add(p,'spd','SPD',1,0,4,{board:'sub'});validatePlan(p);
  const a=invariants(p,'house','sub');assert.deepEqual(a.warnings,[]);assert.ok(viaBar(a.wires,c('sc1','N'),'n:house/sub'));assert.ok(viaBar(a.wires,m('srcd','N-in'),'n:house/sub'));assert.ok(viaBar(a.wires,m('spd','N'),'n:house/sub'));assert.ok(viaBar(a.wires,c('sc2','N'),'rcd:srcd'));
  // az alelosztó ÁVK-jának N-kimenete kézzel máshová: az ÁVK-sín nem táplált, a főnullasín (főkapcsoló nélkül) továbbra is fogad
  add(p,'snm','NEUTRAL',1,4,4,{board:'sub'});p.boardWires.push(wire('sx',m('srcd','N-out'),m('snm','N1')));validatePlan(p);
  const a2=invariants(p,'house','sub');assert.equal(touches(a2.wires,c('sc2','N')).length,0);assert.deepEqual(a2.warnings,[unfedWarn('sc2','N-sín · FI-S','FI-S','N-szál')]);assert.ok(viaBar(a2.wires,c('sc1','N'),'n:house/sub'))}
 // (f) kaszkád: ha a felső ÁVK sínje nem táplált, az alsó ÁVK N-bemenete sem kerül rá
 {const p=base();add(p,'rx','RCD',1,0,4,{name:'FI-02'});add(p,'nn','NEUTRAL',2,0,4);p.boardWires.push(wire('cas',m('m1','L1-out'),m('rx','L1-in')),wire('w1',m('m1','N-out'),m('nn','N1')));validatePlan(p);
  const a=invariants(p);assert.equal(touches(a.wires,m('rx','N-in')).length,0);assert.ok(a.warnings.some(w=>w===unfedWarn('FI-02','N-sín · FI-01','FI-01','N-bemenet')));assert.ok(viaBar(a.wires,m('rx','N-out'),'rcd:rx'))}
 // (g) az alapeset és az autoBars:false változatlan
 assert.deepEqual(invariants(base()).warnings,[]);
 {const p=base();p.buildings[0].board={rows:4,modulesPerRow:18,autoBars:false};p.boardWires.push(wire('x',m('m1','N-out'),b('n:house/','T5')));validatePlan(p);assert.deepEqual(autoBoardWires(p,'house',''),{wires:[],warnings:[]})}
}
console.log('PASS: tokozati sínek elosztónként (üres elosztó nélkül), ÁVK-csoport (bekötés – áthidalás, kismegszakítón és fázissínen át is, RCBO mögött – → szöveg → figyelmeztetés; ellentmondás), RCBO, betápláló készülékek (több főkapcsoló, kaszkádolt ÁVK), nem táplált sín, kézi felülírás és sínkapocs-kihagyás, elosztónkénti kapcsoló, terminálszám, törlés/tisztítás, szerkezetmásolás, séma és megosztás.');
