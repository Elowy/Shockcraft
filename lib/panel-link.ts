import {type Plan,uid} from './plan';
import {nodeHeight} from './geometry';
export function findLinkedPanel(plan:Plan,nodeId:string){const n=plan.plot.nodes.find(n=>n.id===nodeId);for(const b of plan.buildings)for(const f of b.floors){const device=f.devices.find(d=>d.id===n?.deviceId);if(device)return {building:b,floor:f,device}}return null}
// Mutates the editor's transaction copy, so placement and linking undo together.
export function placePanel(plan:Plan,nodeId:string,floorId:string){
 const existing=findLinkedPanel(plan,nodeId);if(existing)return existing;
 const node=plan.plot.nodes.find(n=>n.id===nodeId);if(!node||!['main','panel','sub'].includes(node.kind))throw Error('Válassz elosztószekrényt.');
 const building=plan.buildings.find(b=>b.floors.some(f=>f.id===floorId));const floor=building?.floors.find(f=>f.id===floorId);if(!building||!floor)throw Error('Válassz létező szintet.');
 const room=floor.rooms[0];let x=room?.x??200,y=room?room.y+room.h/2:200;
 for(let i=0;i<20&&floor.devices.some(d=>Math.hypot(d.x-x,d.y-y)<28);i++)y=Math.min(2000,y+32);
 const height=Math.max(0,Math.min(1000,Math.round((nodeHeight(node,plan)-floor.elevation)*100)));
 const device={id:uid(),name:node.name,kind:'panel' as const,x,y,angle:0,height,circuit:''};
 floor.devices.push(device);node.deviceId=device.id;return {building,floor,device};
}
