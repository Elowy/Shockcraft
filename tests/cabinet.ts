import assert from 'node:assert/strict';
import {seed,validatePlan} from '../lib/plan';
import {moduleTypes,moduleWidths,endpointKey} from '../lib/board';
import {connectTerminals,connectionIssue,connectionPlan,cabinetLayout,cabinetWirePoints} from '../lib/cabinet';
const moduleEnd=(id:string,port:string)=>({kind:'module' as const,id,port});
const circuitEnd=(id:string,port:string)=>({kind:'circuit' as const,id,port});
const plan=structuredClone(seed),original=JSON.stringify(plan);
let next=connectTerminals(plan,moduleEnd('m1','L1-out'),moduleEnd('m2','L-in'),'bridge');
assert.equal(JSON.stringify(plan),original,'preview/connection must not mutate the active plan');
assert.equal(next.boardWires.length,1);validatePlan(next);
assert.match(connectionIssue(next,moduleEnd('m2','L-in'),moduleEnd('m1','L1-out'))!,/létezik/,'reverse duplicate rejected');
assert.match(connectionIssue(plan,moduleEnd('m1','N-out'),moduleEnd('m2','L-in'))!,/Eltérő/);
assert.match(connectionIssue(plan,moduleEnd('m1','L2-out'),moduleEnd('m2','L-in'))!,/Eltérő/);
assert.match(connectionIssue(plan,moduleEnd('m1','L1-in'),moduleEnd('m1','L1-out'))!,/Másik/);
next=connectTerminals(next,circuitEnd('c1','L'),moduleEnd('m2','L-out'),'circuit');validatePlan(next);
assert.equal(next.boardWires[1].name,'Nappali dugaljak / L1');
assert.match(connectionIssue(next,circuitEnd('c1','L'),moduleEnd('m0','L1-out'))!,/már be van kötve/);
assert.match(connectionIssue(plan,circuitEnd('c2','N'),moduleEnd('m2','L-out'))!,/Eltérő/);
assert.match(connectionIssue(plan,moduleEnd('missing','L'),moduleEnd('m2','L-in'))!,/kapocs megváltozott/);
const spare=structuredClone(plan);spare.modules.push({id:'spare',name:'Új RCBO',type:'RCBO',row:1,slot:0,width:4,circuit:'',building:'house'});
spare.circuits[0].phase='3P';
const source=circuitEnd('c1','L2'),target=moduleEnd('spare','L2-out');
assert.ok(cabinetLayout(connectionPlan(spare,[source]),'house').pins.some(p=>endpointKey(p.end)===endpointKey(target)));
const assigned=connectTerminals(spare,source,target,'three-phase');assert.equal(assigned.modules.find(m=>m.id==='spare')!.circuit,'c1');validatePlan(assigned);
const conflict=structuredClone(plan);conflict.circuits[1].phase='L1';
assert.match(connectionIssue(conflict,circuitEnd('c2','L'),moduleEnd('m2','L-out'))!,/másik áramkör/);
const foreign=structuredClone(plan);foreign.modules[0].building='garage';
assert.match(connectionIssue(foreign,moduleEnd('m0','L1-out'),moduleEnd('m2','L-in'))!,/Másik épület/);
for(const type of moduleTypes){for(const width of [1,moduleWidths[type]]){
 const sample=structuredClone(plan);sample.modules=[{id:'test',name:type,type,row:0,slot:0,width,circuit:'',building:'house'}];
 const layout=cabinetLayout(sample,'house');
 assert.equal(new Set(layout.pins.map(p=>endpointKey(p.end))).size,layout.pins.length);
 for(const pin of layout.pins){assert.ok(pin.x>0&&pin.x<layout.width&&pin.y>0&&pin.y<layout.height);assert.ok(Number.isFinite(pin.escapeY))}
 assert.equal(cabinetLayout(sample,'garage').pins.length,0);
 const [a,b]=layout.pins;for(const point of cabinetWirePoints(a,b,1))assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y));
}}
// Tokozati sínek: nem foglalnak modulhelyet, a DIN-sorok alatt állnak, a kapcsaik a pins listában vannak, az áramköri kártyák lejjebb kerülnek.
{
 const layout=cabinetLayout(plan,'house');
 assert.deepEqual(layout.bars.map(b=>b.bar.label),['PE-sín','N-sín','N-sín · FI-01']);
 const lastRow=layout.rows.at(-1)!;assert.ok(layout.barsTop>=lastRow.y+lastRow.h,'a sínek a DIN-sorok alatt vannak');
 assert.ok(layout.circuitTop>layout.bars.at(-1)!.y+layout.bars.at(-1)!.h,'az áramköri kártyák a sínek alatt kezdődnek');
 const barPins=layout.pins.filter(p=>p.end.kind==='bar');
 assert.equal(barPins.length,layout.bars.reduce((n,b)=>n+b.bar.ports.length,0));assert.equal(new Set(layout.pins.map(p=>endpointKey(p.end))).size,layout.pins.length);
 for(const pin of barPins){assert.ok(pin.x>0&&pin.x<layout.width&&pin.y>layout.barsTop&&pin.y<layout.circuitTop);assert.ok(Number.isFinite(pin.escapeY))}
 assert.equal(layout.devices.length,5,'a sínek nem modulok');
 const off=structuredClone(plan);off.buildings[0].board={rows:4,modulesPerRow:18,autoBars:false};
 assert.equal(cabinetLayout(off,'house').bars.length,3,'autoBars:false mellett is vannak sínek');
 assert.equal(cabinetLayout(plan,'garage').bars.length,0,'az üres elosztónak nincs sínje');
 // Kézi bekötés a sín kapcsára: kör→sín; sín↔sín tilos; a nem létező sín kapcsa elavult.
 const bar=layout.bars.find(b=>b.bar.kind==='pe')!.bar,tEnd={kind:'bar' as const,id:bar.id,port:'T6'};
 const manual=connectTerminals(plan,circuitEnd('c1','PE'),tEnd,'manual-pe');validatePlan(manual);assert.equal(manual.boardWires.length,1);
 assert.match(connectionIssue(plan,circuitEnd('c1','N'),tEnd)!,/Eltérő/,'N nem köthető PE-sínre');
 const two=layout.bars.filter(b=>b.bar.signal==='N').map(b=>({kind:'bar' as const,id:b.bar.id,port:'T1'}));
 assert.match(connectionIssue(plan,two[0],two[1])!,/Két sín/);
 assert.match(connectionIssue(plan,circuitEnd('c1','PE'),{kind:'bar',id:'pe:nincs/',port:'T1'})!,/megváltozott/);
}
console.log('PASS: click connections, immutable changes, reverse duplicates, occupied circuits, phases/N isolation, three-phase assignment, building separation and all device terminal layouts.');
