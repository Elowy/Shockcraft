import type {Plan,Floor,Point} from './plan';
export type FloorRoute=Floor['routes'][number];
export type SiteNode=Plan['plot']['nodes'][number];
export type SiteRoute=Plan['plot']['routes'][number];
export function polylineLength(points:Point[],units=1){return points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-points[i].x,p.y-points[i].y)/units,0)}
export function floorPoints(r:FloorRoute,f:Floor){const pts=r.points.map(p=>({...p}));const start=f.devices.find(d=>d.id===r.startId),end=f.devices.find(d=>d.id===r.endId);if(start)pts[0]={x:start.x,y:start.y};if(end)pts[pts.length-1]={x:end.x,y:end.y};return pts}
export function floorLength(r:FloorRoute,f:Floor){const plane=(r.planeHeight??260)/100;const a=f.devices.find(d=>d.id===r.startId),b=f.devices.find(d=>d.id===r.endId);const start=(a?.height??r.startHeight??r.planeHeight??260)/100,end=(b?.height??r.endHeight??r.planeHeight??260)/100;const horizontal=polylineLength(floorPoints(r,f),40),vertical=Math.abs(start-plane)+Math.abs(end-plane);return {horizontal,vertical,total:horizontal+vertical,start,end,plane}}
export function nodeHeight(n:SiteNode,p:Plan){for(const b of p.buildings)for(const f of b.floors){const d=f.devices.find(d=>d.id===n.deviceId);if(d)return f.elevation+d.height/100}return n.height}
export function sitePoints(r:SiteRoute,p:Plan){const a=p.plot.nodes.find(n=>n.id===r.from),b=p.plot.nodes.find(n=>n.id===r.to);return a&&b?[{x:a.x,y:a.y},...r.via,{x:b.x,y:b.y}]:[]}
export function siteLength(r:SiteRoute,p:Plan){const a=p.plot.nodes.find(n=>n.id===r.from),b=p.plot.nodes.find(n=>n.id===r.to);const horizontal=polylineLength(sitePoints(r,p));const start=a?nodeHeight(a,p):r.level,end=b?nodeHeight(b,p):r.level;const vertical=Math.abs(start-r.level)+Math.abs(end-r.level);return {horizontal,vertical,total:horizontal+vertical,start,end,plane:r.level}}
export function detachDevice(f:Floor,id:string){const d=f.devices.find(d=>d.id===id);if(!d)return;for(const r of f.routes){const pts=floorPoints(r,f);if(r.startId===id){r.points=pts;r.startHeight=d.height;r.startId=''}if(r.endId===id){r.points=pts;r.endHeight=d.height;r.endId=''}}}
export type FloorDrag={type:'rooms'|'walls'|'devices'|'routes'|'dimensions';id:string;dx:number;dy:number;handle?:number;segment?:number;angle?:number};
export function moveRoutePoints(points:Point[],dx:number,dy:number,options:{startLocked:boolean;endLocked:boolean;handle?:number;segment?:number;maxX:number;maxY:number}){
 if(!dx&&!dy)return points.map(p=>({...p}));
 const {startLocked,endLocked,handle,segment,maxX,maxY}=options;
 const shift=(p:Point)=>({x:Math.max(0,Math.min(maxX,p.x+dx)),y:Math.max(0,Math.min(maxY,p.y+dy))});
 const locked=(i:number)=>(i===0&&startLocked)||(i===points.length-1&&endLocked);
 if(handle!==undefined)return points.map((p,i)=>i===handle&&!locked(i)?shift(p):{...p});
 // A direct anchored connection needs bends before its run can move.
 const direct=points.length===2&&startLocked&&endLocked;
 return points.flatMap((p,i)=>{
  const active=segment===undefined||i===segment||i===segment+1;
  if(!active)return [{...p}];
  if(locked(i)){if(segment!==undefined||direct)return i===0?[{...p},shift(p)]:[shift(p),{...p}];return [{...p}]}
  return [shift(p)];
 });
}
export function translateFloor(f:Floor,drag:FloorDrag){const out=structuredClone(f),{type,id,dx,dy,handle}=drag;
 const shift=(p:Point)=>({x:Math.max(0,Math.min(2000,p.x+dx)),y:Math.max(0,Math.min(2000,p.y+dy))});
 if(type==='devices'){const d=out.devices.find(d=>d.id===id);if(d){Object.assign(d,shift(d));if(drag.angle!==undefined)d.angle=drag.angle}}
 if(type==='rooms'){const r=out.rooms.find(r=>r.id===id);if(r)Object.assign(r,shift(r))}
 if(type==='walls'){const w=out.walls.find(w=>w.id===id);if(w){w.a=shift(w.a);w.b=shift(w.b)}}
 if(type==='routes'){const r=out.routes.find(r=>r.id===id);if(r)r.points=moveRoutePoints(floorPoints(r,f),dx,dy,{startLocked:!!r.startId,endLocked:!!r.endId,handle,segment:drag.segment,maxX:2000,maxY:2000})}
 if(type==='dimensions'){const d=out.dimensions?.find(d=>d.id===id);if(d){if(handle===0)d.a=shift(d.a);else if(handle===1)d.b=shift(d.b);else{const x=Math.max(-Math.min(d.a.x,d.b.x),Math.min(2000-Math.max(d.a.x,d.b.x),dx)),y=Math.max(-Math.min(d.a.y,d.b.y),Math.min(2000-Math.max(d.a.y,d.b.y),dy));d.a={x:d.a.x+x,y:d.a.y+y};d.b={x:d.b.x+x,y:d.b.y+y}}}}
 return out;
}
