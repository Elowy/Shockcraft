import assert from 'node:assert/strict';
import {seed,validatePlan} from '../lib/plan';
import {floorLength} from '../lib/geometry';
import {routePointDraft,readRoutePoints,insertRoutePoint,removeRoutePoint} from '../lib/route-points';
const plan=validatePlan(structuredClone(seed)),floor=plan.buildings[0].floors[0],route=floor.routes[0];
const snapshot=JSON.stringify(plan),draft=routePointDraft(route,floor),before=floorLength(route,floor);
assert.equal(draft[0].x,'12.5');assert.equal(draft.at(-1)!.y,'6.5');
const inserted=insertRoutePoint(draft,0,route,floor);assert.equal(inserted.length,draft.length+1);assert.deepEqual(removeRoutePoint(inserted,1),draft);
assert.equal(floorLength({...route,points:readRoutePoints(inserted,route,floor)},floor).total,before.total);
const adjusted=structuredClone(inserted);adjusted[1]={x:'13,75',y:'9.25'};const points=readRoutePoints(adjusted,route,floor);assert.deepEqual(points[1],{x:550,y:370});
assert.equal(floorLength({...route,points},floor).vertical,before.vertical);
// Anchored endpoints ignore draft edits and still follow their devices.
adjusted[0]={x:'',y:'NaN'};floor.devices.find(d=>d.id===route.startId)!.x=600;assert.equal(readRoutePoints(adjusted,route,floor)[0].x,600);
for(const value of ['', '-1','50.01','Infinity','NaN','0x10']){const bad=structuredClone(draft);bad[1].x=value;assert.throws(()=>readRoutePoints(bad,route,floor));}
assert.throws(()=>removeRoutePoint(draft,0));assert.throws(()=>removeRoutePoint(draft,draft.length-1));assert.throws(()=>insertRoutePoint(draft,-1,route,floor));
const max=Array.from({length:300},()=>({x:'1',y:'1'}));assert.throws(()=>insertRoutePoint(max,0,route,floor));assert.throws(()=>readRoutePoints([...max,{x:'1',y:'1'}],route,floor));
const free={...route,startId:'',endId:''};assert.deepEqual(readRoutePoints([{x:'0',y:'50'},{x:'50',y:'0'}],free,floor),[{x:0,y:2000},{x:2000,y:0}]);
floor.devices.find(d=>d.id===route.startId)!.x=500;assert.equal(JSON.stringify(plan),snapshot);
route.points=points;assert.doesNotThrow(()=>validatePlan(plan));
console.log('PASS: insert/remove round trip, exact coordinates and comma decimals, linked endpoints, horizontal vs vertical length, invalid inputs, bounds, capacity, immutable helpers and save validation.');
