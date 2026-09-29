import assert from 'node:assert/strict';
import {seed,validatePlan} from '../lib/plan';
import {connectBoard} from '../lib/board';
import {buildSchematic} from '../lib/schematic';
import {createPlanPdf} from '../lib/pdf-export';
import {readFileSync} from 'node:fs';

const plan=structuredClone(seed);
assert.equal(buildSchematic(plan,'house','single').edges.length,0,'assignment alone must not invent connections');
assert.equal(buildSchematic(plan,'house','multi').missing.length,9);
plan.modules.push({id:'terminal',name:'Kimenő sorkapocs',type:'TERMINAL',building:'house',row:1,slot:0,width:2,circuit:''});
for(const [port,target] of [['L','L-1'],['N','N-1'],['PE','PE-1']])connectBoard(plan,{id:'wire-'+port,name:'Nappali '+port,building:'house',from:{kind:'module',id:'terminal',port:target},to:{kind:'circuit',id:'c1',port}});
connectBoard(plan,{id:'feed',name:'Q1 betáplálás',building:'house',from:{kind:'module',id:'m1',port:'L1-out'},to:{kind:'module',id:'m2',port:'L-in'}});
validatePlan(plan);
const single=buildSchematic(plan,'house','single'),multi=buildSchematic(plan,'house','multi');
assert.equal(single.edges.length,2);assert.equal(single.edges[0].count,3);
assert.equal(multi.edges.length,4);assert.equal(multi.missing.length,6);
assert.deepEqual(multi.edges.slice(0,3).map(e=>e.signal),['L1','N','PE']);
assert.equal(new Set(multi.edges.slice(0,3).map(e=>e.points.at(-1)!.y)).size,3,'separate terminal coordinates');
assert.equal(buildSchematic(plan,'garage','multi').edges.length,0);
assert.equal(buildSchematic(plan,'garage','multi').nodes.length,0);
plan.circuits[0].conductorNames={L:'Új fázisnév'};
assert.match(buildSchematic(plan,'house','multi').edges[0].detail,/Új fázisnév/);
plan.boardWires=plan.boardWires.filter(w=>w.id!=='wire-L');
assert.equal(buildSchematic(plan,'house','multi').missing.length,7,'deleted connection reappears as missing');
plan.circuits[1].phase='3P';
assert.equal(buildSchematic(plan,'house','multi').missing.length,9,'three-phase circuit adds two poles');
plan.modules[0].name='Árvíztűrő tükörfúrógép '.repeat(5);
for(const mode of ['single','multi'] as const){
 const diagram=buildSchematic(plan,'house',mode);
 for(const p of diagram.drawing){
  const points=p.type==='line'?p.points:[{x:p.x,y:p.y}];
  for(const v of points){assert.ok(Number.isFinite(v.x)&&Number.isFinite(v.y));assert.ok(v.x>=0&&v.x<=diagram.width&&v.y>=0&&v.y<=diagram.height)}
 }
}
const font=readFileSync('public/fonts/NotoSans-Regular.ttf').toString('base64');
for(const paper of ['a4','a3'] as const)for(const scope of ['single','multi','all'] as const){
 const pdf=createPlanPdf(plan,{scope,paper,buildingId:'house',floorId:'ground'},font);
 assert.ok(pdf.getNumberOfPages()>0);assert.ok(pdf.output('arraybuffer').byteLength>10000);
}
console.log('PASS: real connections only, grouping, distinct poles, building isolation, rename/delete, three-phase, bounded geometry and A4/A3 PDF scopes.');
