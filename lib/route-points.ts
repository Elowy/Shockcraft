import type {Floor,Point} from './plan';
import {floorPoints,type FloorRoute} from './geometry';
export type PointDraft={x:string;y:string};
export function routePointDraft(route:FloorRoute,floor:Floor):PointDraft[]{return floorPoints(route,floor).map(p=>({x:String(p.x/40),y:String(p.y/40)}))}
export function readRoutePoints(draft:PointDraft[],route:FloorRoute,floor:Floor):Point[]{
 if(draft.length<2||draft.length>300)throw Error('Egy nyomvonal 2–300 pontból állhat.');
 const actual=floorPoints(route,floor);
 return draft.map((p,i)=>{
  if(i===0&&route.startId)return {...actual[0]};
  if(i===draft.length-1&&route.endId)return {...actual[actual.length-1]};
  const values=[p.x,p.y].map(v=>v.trim().replace(',','.'));
  if(values.some(v=>!/^\d+(?:\.\d+)?$/.test(v)||!Number.isFinite(Number(v))||Number(v)>50))throw Error(`${i+1}. pont: az X és Y értéke 0 és 50 méter között legyen.`);
  return {x:Number(values[0])*40,y:Number(values[1])*40};
 });
}
export function insertRoutePoint(draft:PointDraft[],after:number,route:FloorRoute,floor:Floor):PointDraft[]{
 if(draft.length>=300)throw Error('Legfeljebb 300 pont adható meg.');
 if(!Number.isInteger(after)||after<0||after>=draft.length-1)throw Error('Válassz létező szakaszt.');
 const points=readRoutePoints(draft,route,floor),a=points[after],b=points[after+1];
 return [...draft.slice(0,after+1),{x:String((a.x+b.x)/80),y:String((a.y+b.y)/80)},...draft.slice(after+1)];
}
export function removeRoutePoint(draft:PointDraft[],index:number):PointDraft[]{
 if(!Number.isInteger(index)||index<=0||index>=draft.length-1)throw Error('Csak köztes töréspont törölhető.');
 return draft.filter((_,i)=>i!==index);
}
