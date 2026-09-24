import {type Plan,newFloor,uid} from './plan';
import {nodeHeight} from './geometry';

export type ProjectSummary={id:string;name:string;revision:number;updatedAt:string};
export const validProjectId=(id:unknown):id is string=>typeof id==='string'&&(id==='default'||/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
export function projectKey(userId:string,id:string){return 'account:'+userId+(id==='default'?'':':project:'+id)}
export function blankProject(name:string):Plan{return {version:1,name,plot:{name:'Saját telek',w:40,h:30,nodes:[],routes:[]},buildings:[{id:uid(),name:'Új épület',x:2,y:2,w:10,h:8,floors:[newFloor('Földszint',0)]}],circuits:[],modules:[]}}
// Removing a floor keeps the independent plot network and its absolute heights.
export function removeStructure(plan:Plan,buildingId:string,floorId?:string){
 const building=plan.buildings.find(b=>b.id===buildingId);if(!building)return;
 const removed=building.floors.filter(f=>!floorId||f.id===floorId);
 const devices=new Set(removed.flatMap(f=>f.devices.map(d=>d.id)));
 for(const n of plan.plot.nodes)if(n.deviceId&&devices.has(n.deviceId)){n.height=nodeHeight(n,plan);n.deviceId=''}
 if(floorId)building.floors=building.floors.filter(f=>f.id!==floorId);
 else{plan.buildings=plan.buildings.filter(b=>b.id!==buildingId);plan.circuits=plan.circuits.filter(c=>c.building!==buildingId);plan.modules=plan.modules.filter(m=>m.building!==buildingId)}
}
