import {type Plan,labels} from './plan';
import {circuitPorts,endpointInfo,moduleLabels} from './board';
import {floorLength,floorPoints} from './geometry';
import type {SearchResult} from './plan-tools';

export function circuitReport(plan:Plan,circuitId:string){
 const circuit=plan.circuits.find(c=>c.id===circuitId);
 const building=plan.buildings.find(b=>b.id===circuit?.building);
 if(!circuit||!building)return null;
 const devices:SearchResult[]=[],routes:(SearchResult&{horizontal:number;vertical:number;total:number})[]=[];
 for(const floor of building.floors){
  const base={buildingId:building.id,floorId:floor.id};
  const location=building.name+' / '+floor.name;
  for(const d of floor.devices.filter(d=>d.circuit===circuit.id))devices.push({...base,id:d.id,type:'devices',title:d.name,subtitle:location+' · '+labels[d.kind]+' · '+d.height+' cm',x:d.x,y:d.y});
  for(const r of floor.routes.filter(r=>r.circuit===circuit.id)){
   const points=floorPoints(r,floor),length=floorLength(r,floor);
   routes.push({...base,id:r.id,type:'routes',title:r.name,subtitle:location+' · '+(r.cable.trim()||'Nincs kábeltípus')+' · '+(r.mode==='inside'?'Falon belül':'Falon kívül'),x:points.reduce((s,p)=>s+p.x,0)/points.length,y:points.reduce((s,p)=>s+p.y,0)/points.length,...length});
  }
 }
 const moduleTarget=(id:string):SearchResult|null=>{
  const m=plan.modules.find(m=>m.id===id&&m.building===building.id);
  return m?{id:m.id,type:'modules',buildingId:building.id,floorId:building.floors[0]?.id||'',title:m.name,subtitle:building.name+' · '+moduleLabels[m.type]+' · '+(m.row+1)+'. sor',x:0,y:0}:null;
 };
 const modules=plan.modules.filter(m=>m.building===building.id&&m.circuit===circuit.id).map(m=>moduleTarget(m.id)!);
 const ports=circuitPorts(circuit).map(port=>{
  const wire=plan.boardWires.find(w=>w.building===building.id&&[w.from,w.to].some(e=>e.kind==='circuit'&&e.id===circuit.id&&e.port===port.id));
  const other=wire&&(wire.from.kind==='circuit'&&wire.from.id===circuit.id?wire.to:wire.from);
  const info=other&&endpointInfo(plan,other),target=other?.kind==='module'?moduleTarget(other.id):null;
  return {...port,wireName:wire?.name||'',connection:info?.text||'',target};
 });
 const length=routes.reduce((sum,r)=>({horizontal:sum.horizontal+r.horizontal,vertical:sum.vertical+r.vertical,total:sum.total+r.total}),{horizontal:0,vertical:0,total:0});
 return {circuit,devices,routes,modules,ports,length};
}
