import type {Plan} from './plan';
import {floorLength,floorPoints} from './geometry';
import type {SearchResult} from './plan-tools';
export type RouteRow={target:SearchResult;location:string;circuitId:string;circuit:string;cable:string;mode:'inside'|'outside';start:string;end:string;freeEnds:number;horizontal:number;vertical:number;total:number};
export type RouteFilters={building:string;circuit:string;mode:string;query:string;freeOnly:boolean;sort:'name'|'longest'|'shortest'};
export const routeModeLabels={inside:'Falon belül',outside:'Falon kívül'};
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('hu');
export function routeRegister(plan:Plan):RouteRow[]{
 const circuits=new Map(plan.circuits.map(c=>[c.id,c.name]));
 return plan.buildings.flatMap(b=>b.floors.flatMap(f=>{
  const devices=new Map(f.devices.map(d=>[d.id,d]));
  return f.routes.map(r=>{
   const pts=floorPoints(r,f),length=floorLength(r,f),location=b.name+' / '+f.name;
   const start=devices.get(r.startId||''),end=devices.get(r.endId||'');
   return {target:{id:r.id,type:'routes' as const,buildingId:b.id,floorId:f.id,title:r.name,subtitle:location,x:pts.reduce((sum,p)=>sum+p.x,0)/pts.length,y:pts.reduce((sum,p)=>sum+p.y,0)/pts.length},location,circuitId:r.circuit,circuit:circuits.get(r.circuit)||'Nincs áramkör',cable:r.cable.trim()||'Nincs kábeljelölés',mode:r.mode,start:start?.name||'Szabad kezdőpont',end:end?.name||'Szabad végpont',freeEnds:Number(!start)+Number(!end),horizontal:length.horizontal,vertical:length.vertical,total:length.total};
  });
 }));
}
export function filterRouteRegister(rows:RouteRow[],filters:RouteFilters){
 const terms=normalize(filters.query.trim()).split(/\s+/).filter(Boolean);
 return rows.filter(r=>(filters.building==='all'||r.target.buildingId===filters.building)&&(filters.circuit==='all'||(filters.circuit==='unassigned'?!r.circuitId:r.circuitId===filters.circuit))&&(filters.mode==='all'||r.mode===filters.mode)&&(!filters.freeOnly||r.freeEnds>0)&&terms.every(t=>normalize([r.target.title,r.location,r.circuit,r.cable,r.start,r.end].join(' ')).includes(t))).sort((a,b)=>{
  const length=filters.sort==='longest'?b.total-a.total:filters.sort==='shortest'?a.total-b.total:0;
  return length||a.target.title.localeCompare(b.target.title,'hu')||a.location.localeCompare(b.location,'hu')||a.target.id.localeCompare(b.target.id);
 });
}
