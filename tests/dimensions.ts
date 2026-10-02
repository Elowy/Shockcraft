import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {dimensionGeometry,dimensionSchema,type Dimension} from '../lib/dimensions';
import {newFloor,validatePlan,seed} from '../lib/plan';
import {translateFloor} from '../lib/geometry';
import {materialList} from '../lib/plan-tools';
import {createPlanPdf} from '../lib/pdf-export';
const d:Dimension={id:'measurement-test',name:'Átlós mérés',a:{x:100,y:100},b:{x:220,y:260},mode:'aligned',offset:40};
assert.equal(dimensionGeometry(d).length,5);
assert.equal(dimensionGeometry({...d,mode:'horizontal'}).length,3);
assert.equal(dimensionGeometry({...d,mode:'vertical'}).length,4);
assert.deepEqual(dimensionGeometry(d).a,{x:68,y:124});
assert.deepEqual(dimensionGeometry({...d,offset:-40}).a,{x:132,y:76});
assert.equal(dimensionGeometry({...d,a:d.b,b:d.a}).length,5);
const zero=dimensionGeometry({...d,b:d.a});assert.equal(zero.length,0);assert.ok(zero.bounds.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
const floor=newFloor('Mérés',0);floor.dimensions=[d];
const moved=translateFloor(floor,{type:'dimensions',id:d.id,dx:100,dy:200});
assert.deepEqual(moved.dimensions![0].a,{x:200,y:300});assert.equal(dimensionGeometry(moved.dimensions![0]).length,5);assert.deepEqual(floor.dimensions[0].a,{x:100,y:100});
const limited=translateFloor(floor,{type:'dimensions',id:d.id,dx:-1000,dy:2000}).dimensions![0];assert.equal(limited.a.x,0);assert.equal(limited.b.y,2000);assert.equal(dimensionGeometry(limited).length,5);
const endpoint=translateFloor(floor,{type:'dimensions',id:d.id,dx:40,dy:0,handle:1}).dimensions![0];assert.deepEqual(endpoint.a,d.a);assert.equal(endpoint.b.x,260);assert.notEqual(dimensionGeometry(endpoint).length,5);
const plan=validatePlan(seed),before=materialList(plan);plan.buildings[0].floors[0].dimensions=[d];
assert.deepEqual(validatePlan(JSON.parse(JSON.stringify(plan))).buildings[0].floors[0].dimensions,[d]);assert.deepEqual(materialList(plan),before);
const legacy=validatePlan(seed);assert.equal(legacy.buildings[0].floors[0].dimensions,undefined);
assert.equal(dimensionSchema.safeParse({...d,offset:Infinity}).success,false);assert.equal(dimensionSchema.safeParse({...d,a:{x:-1,y:20}}).success,false);
plan.buildings[0].floors[0].dimensions=[d,{...d}];assert.throws(()=>validatePlan(plan),/azonosító/);
plan.buildings[0].floors[0].dimensions=Array.from({length:501},(_,i)=>({...d,id:'limit'+i}));assert.throws(()=>validatePlan(plan));
const f=plan.buildings[0].floors[0];f.background=undefined;f.dimensions=[
 {...d,id:'qa-horizontal',a:{x:180,y:140},b:{x:760,y:140},mode:'horizontal',offset:-60},
 {...d,id:'qa-vertical',a:{x:180,y:140},b:{x:180,y:540},mode:'vertical',offset:-60},
 {...d,id:'qa-diagonal',a:{x:800,y:160},b:{x:920,y:320},mode:'aligned',offset:40},
];
const font=readFileSync('public/fonts/NotoSans-Regular.ttf').toString('base64');
for(const paper of ['a4','a3'] as const){const doc=createPlanPdf(validatePlan(plan),{scope:'floor',paper,buildingId:'house',floorId:'ground'},font);assert.ok(doc.getNumberOfPages()>=1);writeFileSync('.sites-runtime/dimensions-'+paper+'.pdf',Buffer.from(doc.output('arraybuffer')))}
console.log('PASS: distance/projection/offset/zero geometry, endpoint/group drag with boundary length preservation, legacy/JSON roundtrip, ID and limits validation, unchanged materials, A4/A3 PDF generation.');
