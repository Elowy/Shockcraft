import {uid,validatePlan,type Floor,type Plan,type Point} from './plan';
import {floorLength,floorPoints} from './geometry';
import {floorItems,selectInBox,selectionLabels,type FloorSelection} from './floor-selection';

export type StructureCopyOptions={buildingId:string;floorId:string;roomId?:string;name:string;elevation:number;dx:number;dy:number;contents:boolean;keepCircuits:boolean;panels:boolean;background:boolean};
export function copiedName(name:string,used:string[]){
 const base=name.replace(/ – másolat(?: \d+)?$/,'').slice(0,100),names=new Set(used.map(s=>s.toLocaleLowerCase('hu')));
 for(let n=1;n<=used.length+1;n++){const candidate=base+' – másolat'+(n===1?'':' '+n);if(!names.has(candidate.toLocaleLowerCase('hu')))return candidate}
 throw Error('Nem sikerült egyedi nevet létrehozni.');
}
export function copySource(plan:Plan,options:Pick<StructureCopyOptions,'buildingId'|'floorId'|'roomId'|'contents'|'panels'>){
 const building=plan.buildings.find(b=>b.id===options.buildingId),floor=building?.floors.find(f=>f.id===options.floorId);
 if(!building||!floor)throw Error('A másolandó szint nem található.');
 const room=options.roomId?floor.rooms.find(r=>r.id===options.roomId):undefined;
 if(options.roomId&&!room)throw Error('A másolandó szoba nem található.');
 let items:FloorSelection[]=room?selectInBox(floor,{x:room.x,y:room.y},{x:room.x+room.w,y:room.y+room.h}).filter(i=>i.type!=='rooms'||i.id===room.id):floorItems(floor);
 if(room&&!options.contents)items=[{type:'rooms',id:room.id}];
 else if(!options.contents)items=items.filter(i=>i.type!=='devices'&&i.type!=='routes');
 if(!options.panels)items=items.filter(i=>i.type!=='devices'||floor.devices.find(d=>d.id===i.id)?.kind!=='panel');
 return {building,floor,room,items};
}
export function suggestRoomOffset(floor:Floor,roomId:string){
 const room=floor.rooms.find(r=>r.id===roomId);if(!room)return {dx:40,dy:40};
 const right=Math.max(...floor.rooms.map(r=>r.x+r.w))+40,bottom=Math.max(...floor.rooms.map(r=>r.y+r.h))+40;
 for(const p of [{x:right,y:room.y},{x:room.x,y:bottom},{x:40,y:bottom},{x:right,y:40}])if(p.x+room.w<=2000&&p.y+room.h<=2000)return {dx:p.x-room.x,dy:p.y-room.y};
 return {dx:40,dy:40};
}
export function copyStructure(plan:Plan,options:StructureCopyOptions){
 const {building,floor,room,items}=copySource(plan,options);
 const name=options.name.trim();if(!name||name.length>120)throw Error('A név 1–120 karakter hosszú lehet.');
 if(!room&&building.floors.length>=30)throw Error('Egy épületben legfeljebb 30 szint lehet.');
 if(!room&&(!Number.isFinite(options.elevation)||options.elevation< -30||options.elevation>100))throw Error('A szintmagasság −30 és 100 méter közé eshet.');
 if(room&&(!Number.isFinite(options.dx)||!Number.isFinite(options.dy)))throw Error('Adj meg érvényes eltolást.');
 const dx=room?options.dx:0,dy=room?options.dy:0,ids=new Map(items.map(i=>[i.id,uid()]));
 const shift=(p:Point)=>{const q={x:p.x+dx,y:p.y+dy};if(q.x<0||q.y<0||q.x>2000||q.y>2000)throw Error('A másolat túlnyúlna az 50 × 50 méteres rajzterületen. Csökkentsd az eltolást.');return q};
 const draft=structuredClone(plan),targetBuilding=draft.buildings.find(b=>b.id===building.id)!;
 const target:Floor=room?targetBuilding.floors.find(f=>f.id===floor.id)!:{id:uid(),name,elevation:options.elevation,rooms:[],walls:[],devices:[],routes:[],dimensions:[]};
 const limits={rooms:200,walls:1000,devices:2000,routes:2000,dimensions:500};
 for(const type of Object.keys(limits) as FloorSelection['type'][]){if((target[type]?.length||0)+items.filter(i=>i.type===type).length>limits[type])throw Error('A szintre legfeljebb '+limits[type]+' '+selectionLabels[type]+' kerülhet. A másolat már nem fér bele ebbe a korlátba.')}
 for(const item of items){
  const id=ids.get(item.id)!;
  if(item.type==='rooms'){
   const src=floor.rooms.find(r=>r.id===item.id)!;shift({x:src.x+src.w,y:src.y+src.h});
   target.rooms.push({...structuredClone(src),...shift(src),id,name:room?name:src.name,openings:src.openings?.map(o=>({...o,id:uid()}))});
  }
  if(item.type==='walls'){const src=floor.walls.find(w=>w.id===item.id)!;target.walls.push({...structuredClone(src),id,a:shift(src.a),b:shift(src.b),openings:src.openings?.map(o=>({...o,id:uid()}))})}
  if(item.type==='devices'){const src=floor.devices.find(d=>d.id===item.id)!;target.devices.push({...structuredClone(src),...shift(src),id,name:room?copiedName(src.name,target.devices.map(d=>d.name)):src.name,circuit:options.keepCircuits?src.circuit:''})}
  if(item.type==='routes'){
   const src=floor.routes.find(r=>r.id===item.id)!,length=floorLength(src,floor);
   target.routes.push({...structuredClone(src),id,name:room?copiedName(src.name,target.routes.map(r=>r.name)):src.name,points:floorPoints(src,floor).map(shift),startId:ids.get(src.startId||'')||'',endId:ids.get(src.endId||'')||'',startHeight:length.start*100,endHeight:length.end*100,circuit:options.keepCircuits?src.circuit:''});
  }
  if(item.type==='dimensions'){const src=floor.dimensions!.find(d=>d.id===item.id)!;(target.dimensions??=[]).push({...structuredClone(src),id,name:room?copiedName(src.name,(target.dimensions||[]).map(d=>d.name)):src.name,a:shift(src.a),b:shift(src.b)})}
 }
 if(!room){if(options.background&&floor.background)target.background=structuredClone(floor.background);targetBuilding.floors.push(target)}
 return {plan:validatePlan(draft),floorId:target.id,items:items.map(item=>({...item,id:ids.get(item.id)!}))};
}
