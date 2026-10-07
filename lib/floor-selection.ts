import type {Floor, Point} from './plan';
import {floorPoints, moveRoutePoints} from './geometry';

export type FloorSelection={type:'rooms'|'walls'|'devices'|'routes'|'dimensions';id:string};
export const selectionLabels={rooms:'szoba',walls:'fal',devices:'szerelvény',routes:'nyomvonal',dimensions:'méretvonal'};
export const selectionKey=(item:FloorSelection)=>item.type+':'+item.id;
export function floorItems(floor:Floor,devices=true,routes=true):FloorSelection[]{
 return (['rooms','walls','devices','routes','dimensions'] as const).flatMap(type=>
  type==='devices'&&!devices||type==='routes'&&!routes?[]:(floor[type]||[]).map(item=>({type,id:item.id})));
}
export function selectionPoints(floor:Floor,item:FloorSelection):Point[]{
 switch(item.type){
  case 'rooms':{const r=floor.rooms.find(r=>r.id===item.id);return r?[{x:r.x,y:r.y},{x:r.x+r.w,y:r.y+r.h}]:[];}
  case 'devices':{const d=floor.devices.find(d=>d.id===item.id);return d?[{x:d.x,y:d.y}]:[];}
  case 'walls':{const w=floor.walls.find(w=>w.id===item.id);return w?[w.a,w.b]:[];}
  case 'dimensions':{const d=floor.dimensions?.find(d=>d.id===item.id);return d?[d.a,d.b]:[];}
  case 'routes':{const r=floor.routes.find(r=>r.id===item.id);return r?floorPoints(r,floor):[];}
 }
}
export function uniqueSelection(items:FloorSelection[]){return [...new Map(items.map(item=>[selectionKey(item),item])).values()];}
export function selectInBox(floor:Floor,a:Point,b:Point,devices=true,routes=true){
 const left=Math.min(a.x,b.x),right=Math.max(a.x,b.x),top=Math.min(a.y,b.y),bottom=Math.max(a.y,b.y);
 return floorItems(floor,devices,routes).filter(item=>{const points=selectionPoints(floor,item);return points.length&&points.every(p=>p.x>=left&&p.x<=right&&p.y>=top&&p.y<=bottom)});
}
export function selectionBounds(floor:Floor,items:FloorSelection[]){
 const points=items.flatMap(item=>selectionPoints(floor,item));if(!points.length)return null;
 return points.reduce((box,p)=>({left:Math.min(box.left,p.x),right:Math.max(box.right,p.x),top:Math.min(box.top,p.y),bottom:Math.max(box.bottom,p.y)}),{left:Infinity,right:-Infinity,top:Infinity,bottom:-Infinity});
}
// Clamp one shared displacement, never individual items: their spacing must stay intact.
export function selectionDelta(floor:Floor,items:FloorSelection[],dx:number,dy:number){
 if(!Number.isFinite(dx)||!Number.isFinite(dy))return {dx:0,dy:0};
 const points=uniqueSelection(items).flatMap(item=>item.type==='rooms'?selectionPoints(floor,item).slice(0,1):selectionPoints(floor,item));
 if(!points.length)return {dx:0,dy:0};
 const bounds=points.reduce((b,p)=>({left:Math.min(b.left,p.x),right:Math.max(b.right,p.x),top:Math.min(b.top,p.y),bottom:Math.max(b.bottom,p.y)}),{left:Infinity,right:-Infinity,top:Infinity,bottom:-Infinity});
 return {dx:Math.max(-bounds.left,Math.min(2000-bounds.right,dx)),dy:Math.max(-bounds.top,Math.min(2000-bounds.bottom,dy))};
}
export function translateFloorSelection(floor:Floor,items:FloorSelection[],dx:number,dy:number):Floor{
 const delta=selectionDelta(floor,items,dx,dy);if(!delta.dx&&!delta.dy)return floor;
 const out=structuredClone(floor),selected=new Set(items.map(selectionKey));
 const has=(type:FloorSelection['type'],id:string)=>selected.has(type+':'+id);
 const shift=(p:Point)=>({x:p.x+delta.dx,y:p.y+delta.dy});
 for(const d of out.devices)if(has('devices',d.id))Object.assign(d,shift(d));
 for(const r of out.rooms)if(has('rooms',r.id))Object.assign(r,shift(r));
 for(const w of out.walls)if(has('walls',w.id)){w.a=shift(w.a);w.b=shift(w.b)}
 for(const d of out.dimensions||[])if(has('dimensions',d.id)){d.a=shift(d.a);d.b=shift(d.b)}
 for(const r of out.routes)if(has('routes',r.id)){
  // Use the original coordinates so selected devices and their endpoints move once.
  const points=moveRoutePoints(floorPoints(r,floor),delta.dx,delta.dy,{startLocked:!!r.startId&&!has('devices',r.startId),endLocked:!!r.endId&&!has('devices',r.endId),maxX:2000,maxY:2000});
  // A direct anchored route can gain two bends; retain the schema's point limit.
  if(points.length<=300)r.points=points;
 }
 return out;
}
