import type {Floor,Point} from './plan';
import {wallHosts,solidWallSegments} from './architecture';
export type WallSnap={point:Point;a:Point;b:Point;angle:number;distance:number};
const axis=(a:number)=>(a%180+180)%180;
const angleDifference=(a:number,b:number)=>Math.min(Math.abs(axis(a)-axis(b)),180-Math.abs(axis(a)-axis(b)));
/** Drawing units are 40 per metre. Ignore zero-length walls and snap to the finite segment. */
export function wallSnap(p:Point,f:Floor,preferredAngle=0,radius=20):WallSnap|null{
 const segments=wallHosts(f).flatMap(host=>solidWallSegments(f,host));
 let best:WallSnap|null=null;
 for(const [a,b] of segments){const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;if(length<.000001)continue;
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/length)),point={x:a.x+t*dx,y:a.y+t*dy};
  if(point.x<0||point.y<0||point.x>2000||point.y>2000)continue;
  const distance=Math.hypot(p.x-point.x,p.y-point.y),angle=axis(Math.atan2(dy,dx)*180/Math.PI);
  if(distance>radius)continue;
  if(!best||distance<best.distance-1e-7||(Math.abs(distance-best.distance)<1e-7&&angleDifference(angle,preferredAngle)<angleDifference(best.angle,preferredAngle)))best={point,a,b,angle,distance};
 }return best;
}
export function devicePlacement(p:Point,f:Floor,kind:string,angle:number,snap:boolean,rotate:boolean,bypass=false){const match=snap&&!bypass&&kind!=='light'?wallSnap(p,f,angle):null;return {...(match?.point||p),angle:match&&rotate?match.angle:angle,snap:match};}
