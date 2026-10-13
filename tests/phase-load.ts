import assert from 'node:assert/strict';
import {seed,validatePlan} from '../lib/plan';
import {circuitLoad,phaseLoad,projectPhaseLoads,IMBALANCE_LIMIT} from '../lib/phase-load';
const p=validatePlan(structuredClone(seed));const before=JSON.stringify(p);
// Seed: c1 (L1) = kettős + dugalj + kötődoboz → 600 W; c2 (L2) = kettős → 400 W; c3 (L3) = váltókapcsoló + lámpa → 100 W.
const c1=circuitLoad(p,p.circuits[0]);assert.equal(c1.watts,600);assert.equal(c1.estimated,true);assert.equal(c1.devices,3);
let r=phaseLoad(p,'house');
assert.deepEqual([r.phases.L1.watts,r.phases.L2.watts,r.phases.L3.watts],[600,400,100]);assert.equal(r.total,1100);
assert.ok(Math.abs(r.phases.L1.current-600/230)<1e-9);
assert.ok(Math.abs(r.imbalance-(1100/3-100)/(1100/3)*100)<1e-9);assert.ok(r.issues.some(i=>i.code==='imbalance'));
assert.equal(JSON.stringify(p),before,'no mutation');
// Megadott terhelés felülírja a becslést; 0 W megadott érték.
p.circuits[0].load=400;p.circuits[2].load=400;r=phaseLoad(p,'house');
assert.equal(r.circuits[0].estimated,false);assert.equal(r.imbalance,0);assert.ok(!r.issues.some(i=>i.code==='imbalance'));
p.circuits[1].load=0;assert.ok(phaseLoad(p,'house').issues.some(i=>i.code==='noload'&&i.circuitId==='c2'));
// Túlterhelés: 4000 W / 230 V > 16 A.
p.circuits[1].load=4000;r=phaseLoad(p,'house');assert.ok(r.issues.some(i=>i.code==='overload'&&i.circuitId==='c2'));
// Háromfázisú áramkör egyenlően oszlik; 11 kW / 3 / 230 V ≈ 15,9 A < 16 A.
p.circuits[1].load=undefined;p.circuits.push({...p.circuits[0],id:'c3p',name:'Főzőlap',phase:'3P',load:11000,rating:16});
r=phaseLoad(p,'house');const hob=r.circuits.find(c=>c.circuit.id==='c3p')!;
assert.ok(Math.abs(hob.current-11000/3/230)<1e-9);assert.equal(hob.overload,false);
assert.ok(Math.abs(r.phases.L2.watts-(400+11000/3))<1e-9);
// Elosztónként külön: más elosztó áramköre nem számít bele.
p.buildings[0].extraBoards=[{id:'sub',name:'Alelosztó',rows:2,modulesPerRow:12}];
p.circuits.push({...p.circuits[0],id:'csub',name:'Műhely',board:'sub',load:2000});
assert.equal(phaseLoad(p,'house').circuits.some(c=>c.circuit.id==='csub'),false);assert.equal(phaseLoad(p,'house','sub').total,2000);
// Projekt-összesítés: csak az áramkörrel rendelkező elosztók.
assert.deepEqual(projectPhaseLoads(p).map(x=>x.building.id+':'+x.board.id),['house:','house:sub']);
assert.equal(projectPhaseLoads(p,'garage').length,0);
// Üres elosztó: nincs aszimmetria-figyelmeztetés.
assert.equal(phaseLoad(p,'garage').imbalance,0);assert.equal(phaseLoad(p,'garage').issues.length,0);
// Séma: a terhelés opcionális, negatív érték érvénytelen.
assert.doesNotThrow(()=>validatePlan(p));const bad=structuredClone(p);bad.circuits[0].load=-1;assert.throws(()=>validatePlan(bad));
assert.ok(IMBALANCE_LIMIT>0);
console.log('PASS: device-based estimate, explicit load override, per-phase watts/current, imbalance warning, overload, three-phase split, per-board scope, empty boards, schema.');
