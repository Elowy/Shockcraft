// A TS ábramotor (lib/kb/circuit.ts) egyenértékűsége a Python-szimulátorral (content/tudastar/r3-sim/sim.py, a referencia):
//  1. a rögzített referencia (tests/fixtures/kb-circuit-reference.json, generátora: scripts/kb-circuit-reference.py) a mostani
//     szimulátorforrásból és netlistákból készült (forrás-ujjlenyomat; ha van python3, a generátor --check-je is lefut),
//  2. mind a 20 netlistára: a teljes kiértékelés (minden állapotkombináció kimenetei, hibák, figyelmeztetések, váltó-tulajdonság,
//     szakaszok, a földelési rendszer ellenőrzött jellemzői, PASS) és a szöveges vezetéktábla azonos,
//  3. állásonként a hálózatok (union-find halmazok) és az energizált (fázis alatti) hálózatok azonosak,
//  4. a mutánskészleten (szándékosan elrontott netlisták) a PASS/FAIL, a hibakódok, a hibaüzenetek és a kimenetek azonosak,
//  5. a nyilvános felület (simulate, truthTable, wireTable, staticNets) és a cikkek szimulációs blokkjainak ujjlenyomatai.
// Futtatás: node --no-warnings --import tsx tests/kb-circuit.ts
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {COLORS,loadNetlist,netlistFingerprint,runNetlist,simulate,staticNets,truthTable,wireTable,type Circuit,type Netlist} from '../lib/kb/circuit';

const R3='content/tudastar/r3',SIM='content/tudastar/r3-sim',REF='tests/fixtures/kb-circuit-reference.json';
const fnvText=(s:string)=>{let h=0x811c9dc5;for(const ch of s){h^=ch.codePointAt(0)!;h=Math.imul(h,0x01000193)>>>0}return h.toString(16).padStart(8,'0')};
/** Kanonikus JSON rendezett kulcsokkal (a Python json.dumps(sort_keys=True, separators=(',',':'), ensure_ascii=False) megfelelője). */
const canon=(v:unknown):string=>{
 if(v===null||typeof v!=='object')return JSON.stringify(v)??'null';
 if(Array.isArray(v))return '['+v.map(canon).join(',')+']';
 const o=v as Record<string,unknown>;
 return '{'+Object.keys(o).filter(k=>o[k]!==undefined).sort().map(k=>JSON.stringify(k)+':'+canon(o[k])).join(',')+'}';
};
type Ref={format:string;sim:Record<string,string>;skipped:number;
 netlists:{file:string;report:Record<string,unknown>;wires:Record<string,unknown>[];states:{states:Record<string,string>;nets:string;count:number;live:string[]}[]}[];
 mutants:{file:string;ops:{op:'set'|'del';path:(string|number)[];value?:unknown}[];pass:boolean;codes:string[];errors:string;rows:string;combinations:number}[]};
const ref=JSON.parse(readFileSync(REF,'utf8')) as Ref;
const files=readdirSync(R3).filter(f=>f.endsWith('.netlist.json')).sort();
const load=(f:string)=>JSON.parse(readFileSync(join(R3,f),'utf8')) as Netlist;

// ------------------------------------------------------------------ 1. A referencia frissessége
assert.equal(ref.format,'kb-circuit-reference/1');
for(const [f,fp] of Object.entries(ref.sim))assert.equal(fnvText(readFileSync(join(SIM,f),'utf8').replace(/\r\n/g,'\n')),fp,SIM+'/'+f+' változott a referencia óta – futtasd: python3 -I scripts/kb-circuit-reference.py (és kövesd a lib/kb/circuit.ts-ben)');
assert.deepEqual(ref.netlists.map(n=>n.file),files,'a referencia mind a 20 netlistát tartalmazza');
assert.equal(files.length,20,'20 netlista');
const py=spawnSync('python3',['-I','scripts/kb-circuit-reference.py','--check'],{encoding:'utf8',timeout:240000});
let pyChecked=false;
if(py.error&&(py.error as NodeJS.ErrnoException).code==='ENOENT')console.log('figyelmeztetés: nincs python3 – a rögzített referenciát és a szimulátor forrás-ujjlenyomatát vetettük össze');
else{assert.equal(py.status,0,'a Python-referencia elavult:\n'+py.stdout+py.stderr);pyChecked=true}

// ------------------------------------------------------------------ 2–3. A 20 netlista: teljes kiértékelés, vezetéktábla, hálózatok
const OUT_KEYS=['lamps','outlets','currents','trips','consumers','loops','overcurrent','imd','touch'] as const;
function normReport(c:Circuit){
 const r=runNetlist(c);
 return {id:r.id,fingerprint:r.fingerprint,system:r.system??null,selectors:r.selectors,loads:r.loads,
  rows:r.rows.map(row=>{const x:Record<string,unknown>={states:row.states,ok:!!row.ok};for(const k of OUT_KEYS)if(row[k]!==undefined)x[k]=row[k];return x}),
  errors:[...r.errors].sort(),warnings:[...r.warnings].sort(),combinations:r.combinations,toggle:r.toggle,sections:r.sections.map(s=>({id:s.id,label:s.label,kind:s.kind,from:s.from,to:s.to,count:s.count,conductors:s.conductors})),
  verified:r.verified??null,pass:r.pass};
}
let states=0;
for(const n of ref.netlists){
 const data=load(n.file),c=loadNetlist(data);
 assert.equal(canon(normReport(c)),canon(n.report),n.file+': a TS-kiértékelés eltér a Python-szimulátorétól');
 assert.equal(runNetlist(c).pass,true,n.file+': PASS');
 assert.deepEqual(wireTable(c).map(w=>({no:w.no,fromLabel:w.fromLabel,toLabel:w.toLabel,conductor:w.conductor,color:w.color,section:w.section})),n.wires,n.file+': a vezetéktábla eltér');
 for(const s of n.states){
  const sim=simulate(c,s.states);
  assert.equal(fnvText(canon(sim.nets)),s.nets,n.file+' '+JSON.stringify(s.states)+': a hálózatok eltérnek');
  assert.equal(sim.nets.length,s.count);
  assert.deepEqual(sim.live.map(x=>x[0]),s.live,n.file+' '+JSON.stringify(s.states)+': az energizált hálózatok eltérnek');
  states++;
 }
 assert.equal(n.states.length,runNetlist(c).combinations,n.file+': minden állapotkombináció');
}

// ------------------------------------------------------------------ 4. Mutánsok
const apply=(d:Netlist,ops:Ref['mutants'][number]['ops'])=>{
 const x=JSON.parse(JSON.stringify(d)) as Record<string,unknown>;
 for(const op of ops){
  let cur=x as Record<string|number,unknown>;
  for(const k of op.path.slice(0,-1))cur=cur[k] as Record<string|number,unknown>;
  const last=op.path[op.path.length-1];
  if(op.op==='set')cur[last]=JSON.parse(JSON.stringify(op.value));
  else if(Array.isArray(cur))cur.splice(last as number,1);
  else delete cur[last];
 }
 return x as unknown as Netlist;
};
const base=new Map(files.map(f=>[f,load(f)]));
let failing=0;
const codes=new Set<string>();
for(const m of ref.mutants){
 const c=loadNetlist(apply(base.get(m.file)!,m.ops)),r=runNetlist(c);
 const tag=m.file+' '+JSON.stringify(m.ops);
 const errs=[...r.errors].sort();
 assert.equal(r.pass,m.pass,tag+': PASS/FAIL eltér ('+errs.join(' | ')+')');
 assert.deepEqual(errs.map(e=>e.split(']')[0].slice(1)).sort(),m.codes,tag+': a hibakódok eltérnek');
 assert.equal(fnvText(canon(errs)),m.errors,tag+': a hibaüzenetek eltérnek:\n'+errs.join('\n'));
 const rows=r.rows.map(row=>{const x:Record<string,unknown>={states:row.states,ok:!!row.ok};for(const k of OUT_KEYS)if(row[k]!==undefined)x[k]=row[k];return x});
 assert.equal(fnvText(canon(rows)),m.rows,tag+': a kimenetek eltérnek');
 assert.equal(r.combinations,m.combinations,tag);
 if(!m.pass)failing++;
 for(const x of m.codes)codes.add(x);
}
assert.ok(ref.mutants.length>=1000&&failing>=0.85*ref.mutants.length,'mutánsok: '+ref.mutants.length+', ebből FAIL: '+failing);
for(const code of ['I1','I2','I3','I4','I5','I6','I7','I8','I10','I11','I12','I15','I16','I17','S5','S8','S9','E1','E2','E4','E5','E6','E7'])assert.ok(codes.has(code),'a mutánskészlet lefedi: '+code);

// ------------------------------------------------------------------ 5. Nyilvános felület
{
 const c=loadNetlist(load('valtokapcsolo-106-bekotese.netlist.json'));
 assert.equal(netlistFingerprint(c.data),'909db559','a cikk szimulációs blokkja erre az ujjlenyomatra hivatkozik');
 const tt=truthTable(c);
 assert.deepEqual(tt.map(r=>[r.states.S1,r.states.S2,r.lamps!.E1]),[['0','0',true],['0','1',false],['1','0',false],['1','1',true]],'106: az igazságtábla');
 const on=simulate(c,{S1:'0',S2:'0'}),off=simulate(c,{S1:'0',S2:'1'});
 assert.equal(on.outputs.lamps!.E1,true);assert.equal(off.outputs.lamps!.E1,false);
 const netOf=(s:typeof on,k:string)=>s.nets.find(x=>x.includes(k))!;
 assert.ok(on.current.includes(netOf(on,'E1.L'))&&on.current.includes(netOf(on,'E1.N')),'bekapcsolva a lámpa két kapcsának hálózata áramot visz');
 assert.ok(!off.current.length,'kikapcsolva nincs áramút');
 assert.ok(off.live.some(n=>n.includes('KD.K1')),'kikapcsolt lámpa mellett is fázis alatt van az egyik váltóvezeték (a cikk állítása)');
 assert.throws(()=>simulate(c,{S1:'x'}),/ismeretlen állás/);
 const nets=staticNets(c);
 assert.equal(nets.get('T.N'),nets.get('E1.N'),'statikus hálózat: N');assert.notEqual(nets.get('T.L'),nets.get('E1.L'),'a kapcsoló bontja a fázist');
 const w=wireTable(c);
 assert.equal(w.length,12);assert.deepEqual(w[0],{no:1,id:'w1',from:'T.L',to:'KD.L',fromLabel:'Betáp: L',toLabel:'Kötődoboz: L-kötés',conductor:'L',color:'barna',section:'Elosztó – kötődoboz',role:'L'});
 for(const r of w)assert.ok(COLORS.has(r.color));
}
{
 // Földelési netlista: testzárlat TN-C-S-ben – fémes hurok, a túláramvédelem lekapcsolhat, az érintés a lekapcsolásig veszélyes.
 const c=loadNetlist(load('foldelesi-rendszerek-tn-c-s.netlist.json'));
 const s=simulate(c,{H1:'fennáll'});
 assert.equal(s.outputs.loops!.H1,'femes');assert.equal(s.outputs.overcurrent!.F1,true);assert.equal(s.outputs.touch!.U1,'lekapcsolasig');
 assert.ok(s.current.some(n=>n.includes('M1.PE')),'a hibaáram a védővezetőn folyik');
}
{
 // Áramot vivő erek (a Működés nézet kiemelése): a hálózat zsákutca-ágai nem visznek áramot.
 const wid=(c:ReturnType<typeof loadNetlist>,from:string,to:string)=>c.data.wires.find(w=>w.from===from&&w.to===to)!.id!;
 const v=loadNetlist(load('valtokapcsolo-106-bekotese.netlist.json')),on=simulate(v,{S1:'0',S2:'0'});
 const pe=v.data.wires.filter(w=>w.role==='PE').map(w=>w.id!);
 assert.ok(pe.length&&pe.every(w=>!on.currentWires.includes(w)),'106 bekapcsolva: a védővezető nem visz áramot');
 assert.ok(on.currentWires.includes(wid(v,'T.L','KD.L'))&&on.currentWires.includes(wid(v,'T.N','KD.N')),'106 bekapcsolva: a betáp L és N ere áramot visz');
 assert.equal(simulate(v,{S1:'0',S2:'1'}).currentWires.length,0,'106 kikapcsolva: nincs áramot vivő ér');
 const s=loadNetlist(load('foldelesi-rendszerek-tn-s.netlist.json'));
 const ok=simulate(s,{H1:'nincs'}),hiba=simulate(s,{H1:'fennáll'});
 const sPe=s.data.wires.filter(w=>w.role==='PE'&&(w.from==='M1.PE'||w.to==='M1.PE')).map(w=>w.id!);
 assert.ok(sPe.length&&sPe.every(w=>!ok.currentWires.includes(w)),'TN-S hibátlanul: a védővezető (bár a csillagponthoz kötött hálózat része) nem visz áramot');
 assert.ok(sPe.every(w=>hiba.currentWires.includes(w)),'TN-S testzárlatnál: a hibaáram a védővezetőn folyik');
 const h=loadNetlist(load('aram-vedokapcsolo-fi-rele-hibahelyzetek.netlist.json'));
 assert.ok(simulate(h,{P1:'fennáll'}).currentWires.includes(wid(h,'P1.b','FOLD.E')),'fázis–föld érintés: az áram a föld felé folyik');
 assert.ok(!simulate(h,{P1:'nincs'}).currentWires.includes(wid(h,'P1.b','FOLD.E')),'érintés nélkül a földérintés ere nem visz áramot');
 const it=loadNetlist(load('foldelesi-rendszerek-it.netlist.json'));
 assert.ok(!simulate(it,{}).currentWires.includes(wid(it,'TR.L1','SZF.A')),'IT: a szigetelésfigyelő mérővezetéke nem áramút');
}
{
 // FI-relé: a próbagomb megnyomva kiold; a hibahelyzetes netlistán a fázis–föld érintés kiold, a fázis–nulla érintés nem.
 const fi=loadNetlist(load('aram-vedokapcsolo-fi-rele.netlist.json'));
 assert.equal(simulate(fi,{T1:'megnyomva'}).outputs.trips!.Q1,true);
 const h=loadNetlist(load('aram-vedokapcsolo-fi-rele-hibahelyzetek.netlist.json'));
 assert.equal(simulate(h,{P1:'fennáll'}).outputs.trips!.Q1,true);
 assert.equal(simulate(h,{P2:'fennáll'}).outputs.trips!.Q1,false);
 assert.equal(simulate(h,{P2:'fennáll'}).outputs.currents!.P2,true);
}
// A cikkek szimulációs blokkjai az ujjlenyomatra hivatkoznak: minden hivatkozott netlista ujjlenyomata = a TS-é.
{
 let cited=0;
 for(const md of readdirSync(R3).filter(f=>f.endsWith('.md'))){
  const src=readFileSync(join(R3,md),'utf8');
  for(const m of src.matchAll(/<!-- sim:([a-z]+) ([^>]*?)-->\n([\s\S]*?)<!-- \/sim:\1 -->/g)){
   const srcs=[...m[2].matchAll(/src=(\S+)/g)].map(x=>x[1]),fps=[...m[3].matchAll(/`([0-9a-f]{8})`/g)].map(x=>x[1]);
   // Egyetlen netlistás blokk: a lábjegyzet ujjlenyomata; több netlistás (változatok, összehasonlítás): soronként, a forrás sorrendjében.
   if(srcs.length===1){for(const fp of fps){assert.equal(netlistFingerprint(load(srcs[0])),fp,md+': '+srcs[0]);cited++}}
   else{assert.deepEqual(fps,srcs.map(f=>netlistFingerprint(load(f))),md+': '+m[1]);cited+=fps.length}
  }
 }
 assert.ok(cited>=20,'a cikkek ujjlenyomat-hivatkozásai: '+cited);
}
console.log('PASS: TS = Python-szimulátor – 20 netlista ('+states+' állapotkombináció: kimenetek, hálózatok, energizált hálózatok, invariánsok, vezetéktábla), '+ref.mutants.length+' mutáns ('+failing+' FAIL, '+codes.size+' hibakód; PASS/FAIL, kódok, üzenetek és kimenetek azonosak)'+(pyChecked?', a Python-referencia --check-je zöld':', a rögzített referenciával')+'; áramot vivő erek (zsákutca-ág nem: TN-S védővezető hibátlanul, szigetelésfigyelő, földérintés a föld felé).');

// A bekötési ábrák szimulátorának biztonsági szabályai (lib/kb/circuit-rules.ts – a lektori csomag 4. részének „Biztonsági szabályok”
// blokkja): pontosan azok a kódok szerepelnek a táblában, amelyeket a circuit.ts használ (az S0–S9 egy sorban); minden szabálynak
// van szövege, hatóköre, és a kódok egyediek.
{
 const {CIRCUIT_RULES}=await import('../lib/kb/circuit-rules');
 const src=readFileSync('lib/kb/circuit.ts','utf8'),used=new Set<string>();
 for(const m of src.matchAll(/(?:viol|err)\('([ISE]\d{1,2})'|\['(I\d{1,2})'/g)){const c=m[1]??m[2];used.add(/^S\d/.test(c)?'S':c)}
 for(const m of src.matchAll(/'(I\d{1,2})'/g))used.add(m[1]);
 const listed=CIRCUIT_RULES.map(r=>r.code);
 assert.equal(new Set(listed).size,listed.length,'a szabálykódok egyediek');
 assert.deepEqual([...used].sort(),[...listed].sort(),'a circuit.ts kódjai = a szabálytábla kódjai: '+[...used].filter(x=>!listed.includes(x)).concat(listed.filter(x=>!used.has(x))).join(', '));
 for(const r of CIRCUIT_RULES)assert.ok(r.text.length>=40&&r.title&&r.applies,r.code+': a szabálynak van szövege');
 console.log('PASS: '+CIRCUIT_RULES.length+' biztonsági szabály a lektori csomag számára (a szimulátor kódjaival egyezik)');
}
