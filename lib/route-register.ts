import type {Plan} from './plan';
import {floorLength,floorPoints,siteLength,sitePoints} from './geometry';
import {boardName} from './board-size';
import {siteLabels} from './plan';
import type {SearchResult} from './plan-tools';
export type RouteTarget=SearchResult|(Omit<SearchResult,'type'>&{type:'siteRoutes'});
export type RouteRow={target:RouteTarget;kind:'floor'|'plot';buildingIds:string[];location:string;circuitId:string;circuit:string;cable:string;mode:'inside'|'outside'|'underground'|'surface'|'overhead';start:string;end:string;freeEnds:number;horizontal:number;vertical:number;total:number;plane:number;startHeight:number;endHeight:number};
export type RouteFilters={building:string;circuit:string;mode:string;query:string;freeOnly:boolean;sort:'name'|'longest'|'shortest'};
export const routeModeLabels={inside:'Falon belül',outside:'Falon kívül',underground:'Föld alatt',surface:'Felszínen / falon',overhead:'Magasban'};
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('hu');
export function routeRegister(plan:Plan):RouteRow[]{
 const circuits=new Map(plan.circuits.map(c=>[c.id,c.name]));
 const floors:RouteRow[]=plan.buildings.flatMap(b=>b.floors.flatMap(f=>{
  const devices=new Map(f.devices.map(d=>[d.id,d]));
  return f.routes.map(r=>{
   const pts=floorPoints(r,f),length=floorLength(r,f),location=b.name+' / '+f.name;
   const start=devices.get(r.startId||''),end=devices.get(r.endId||'');
   return {kind:'floor',buildingIds:[b.id],target:{id:r.id,type:'routes' as const,buildingId:b.id,floorId:f.id,title:r.name,subtitle:location,x:pts.reduce((sum,p)=>sum+p.x,0)/pts.length,y:pts.reduce((sum,p)=>sum+p.y,0)/pts.length},location,circuitId:r.circuit,circuit:circuits.get(r.circuit)||'Nincs áramkör',cable:r.cable.trim()||'Nincs kábeljelölés',mode:r.mode,start:start?.name||'Szabad kezdőpont',end:end?.name||'Szabad végpont',freeEnds:Number(!start)+Number(!end),horizontal:length.horizontal,vertical:length.vertical,total:length.total,plane:length.plane,startHeight:length.start,endHeight:length.end};
  });
 }));
 const linked=new Map(plan.buildings.flatMap(b=>b.floors.flatMap(f=>f.devices.map(d=>[d.id,{buildingId:b.id,text:b.name+' / '+f.name+(d.kind==='panel'?' / '+boardName(b,d.board):'')}] as const))));
 const nodes=new Map(plan.plot.nodes.map(n=>[n.id,n]));
 const endpoint=(id:string)=>{const n=nodes.get(id),link=n?.deviceId?linked.get(n.deviceId):undefined;return {buildingId:link?.buildingId,text:n?n.name+' · '+siteLabels[n.kind]+(link?' · '+link.text:''):'Hiányzó pont'}};
 const plot:RouteRow[]=plan.plot.routes.map(r=>{
  const start=endpoint(r.from),end=endpoint(r.to),length=siteLength(r,plan),pts=sitePoints(r,plan),location='Telek / '+plan.plot.name;
  return {kind:'plot',buildingIds:[...new Set([start.buildingId,end.buildingId].filter((v):v is string=>!!v))],target:{id:r.id,type:'siteRoutes',buildingId:'',floorId:'',title:r.name,subtitle:location,x:pts.length?pts.reduce((n,p)=>n+p.x,0)/pts.length:0,y:pts.length?pts.reduce((n,p)=>n+p.y,0)/pts.length:0},location,circuitId:'',circuit:'Telki összekötés',cable:r.cable.trim()||'Nincs kábeljelölés',mode:r.mode,start:start.text,end:end.text,freeEnds:0,horizontal:length.horizontal,vertical:length.vertical,total:length.total,plane:length.plane,startHeight:length.start,endHeight:length.end};
 });
 return [...floors,...plot];
}
export function filterRouteRegister(rows:RouteRow[],filters:RouteFilters){
 const terms=normalize(filters.query.trim()).split(/\s+/).filter(Boolean);
 return rows.filter(r=>(filters.building==='all'||(filters.building==='plot'?r.kind==='plot':filters.building==='floors'?r.kind==='floor':r.buildingIds.includes(filters.building)))&&(filters.circuit==='all'||r.kind==='floor'&&(filters.circuit==='unassigned'?!r.circuitId:r.circuitId===filters.circuit))&&(filters.mode==='all'||r.mode===filters.mode)&&(!filters.freeOnly||r.freeEnds>0)&&terms.every(t=>normalize([r.target.title,r.location,r.circuit,r.cable,r.start,r.end,routeModeLabels[r.mode]].join(' ')).includes(t))).sort((a,b)=>{
  const length=filters.sort==='longest'?b.total-a.total:filters.sort==='shortest'?a.total-b.total:0;
  return length||a.target.title.localeCompare(b.target.title,'hu')||a.location.localeCompare(b.location,'hu')||a.target.id.localeCompare(b.target.id);
 });
}
