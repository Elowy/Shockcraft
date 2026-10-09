import {z} from 'zod';
import type {Floor,Point} from './plan';
export const openingSchema=z.object({id:z.string().min(1).max(80),kind:z.enum(['door','window']),edge:z.number().int().min(0).max(3),position:z.number().finite().min(0).max(1),width:z.number().finite().min(20).max(400),height:z.number().finite().min(20).max(400),sill:z.number().finite().min(0).max(400),hinge:z.enum(['start','end']),swing:z.union([z.literal(1),z.literal(-1)])});
export type Opening=z.infer<typeof openingSchema>;
export type WallHost={type:'rooms'|'walls';id:string;name:string;thickness:number;edges:[Point,Point][];openings:Opening[]};
export const openingLabel=(o:Opening)=>o.kind==='door'?'Ajtó':'Ablak';
export const roomEdges=['Felső fal','Jobb fal','Alsó fal','Bal fal'];
export function wallHosts(f:Floor):WallHost[]{return [
 ...f.walls.map(w=>({type:'walls' as const,id:w.id,name:'Fal',thickness:w.thickness??17.5,edges:[[w.a,w.b]] as [Point,Point][],openings:w.openings||[]})),
 ...f.rooms.map(r=>{const a={x:r.x,y:r.y},b={x:r.x+r.w,y:r.y},c={x:r.x+r.w,y:r.y+r.h},d={x:r.x,y:r.y+r.h};return {type:'rooms' as const,id:r.id,name:r.name,thickness:r.thickness??17.5,edges:[[a,b],[b,c],[c,d],[d,a]] as [Point,Point][],openings:r.openings||[]}})
]}
const distance=(a:Point,b:Point)=>Math.hypot(b.x-a.x,b.y-a.y);
export function openingGeometry(host:WallHost,o:Opening){
 const [a,b]=host.edges[o.edge]||host.edges[0],length=distance(a,b),u={x:(b.x-a.x)/(length||1),y:(b.y-a.y)/(length||1)},n={x:-u.y,y:u.x},width=o.width*.4,center=length*o.position,half=host.thickness*.2;
 const xy=(x:number,y:number):Point=>({x:a.x+u.x*x+n.x*y,y:a.y+u.y*x+n.y*y});
 const start=xy(center-width/2,0),end=xy(center+width/2,0),lines:Point[][]=[ [xy(center-width/2,-half),xy(center-width/2,half)],[xy(center+width/2,-half),xy(center+width/2,half)] ];
 if(o.kind==='window'){for(const y of [-half,0,half])lines.push([xy(center-width/2,y),xy(center+width/2,y)])}
 else {const at=o.hinge==='start'?center-width/2:center+width/2,sign=o.hinge==='start'?1:-1;lines.push([xy(at,0),xy(at,o.swing*width)]);lines.push(Array.from({length:25},(_,i)=>{const angle=i/24*Math.PI/2;return xy(at+sign*width*Math.cos(angle),o.swing*width*Math.sin(angle))}))}
 return {start,end,center:xy(center,0),lines,bounds:[start,end,...lines.flat()],length};
}
export function allOpenings(f:Floor){return wallHosts(f).flatMap(host=>host.openings.map(opening=>({host,opening,geometry:openingGeometry(host,opening)})))}
// Returns a cut interval only for a collinear wall. This also cuts coincident shared room walls.
function interval(a:Point,b:Point,start:Point,end:Point):[number,number]|null{
 const length=distance(a,b);if(length<.00001)return null;const ux=(b.x-a.x)/length,uy=(b.y-a.y)/length;
 if(Math.abs((start.x-a.x)*uy-(start.y-a.y)*ux)>.01||Math.abs((end.x-a.x)*uy-(end.y-a.y)*ux)>.01)return null;
 const t=(p:Point)=>(p.x-a.x)*ux+(p.y-a.y)*uy,lo=Math.max(0,Math.min(t(start),t(end))),hi=Math.min(length,Math.max(t(start),t(end)));
 return hi>lo+.001?[lo,hi]:null;
}
export function solidWallSegments(f:Floor,host:WallHost){
 const openings=allOpenings(f);
 return host.edges.flatMap(([a,b])=>{const length=distance(a,b);if(!length)return [];const cuts=openings.map(o=>interval(a,b,o.geometry.start,o.geometry.end)).filter((v):v is [number,number]=>!!v).sort((x,y)=>x[0]-y[0]);
  const xy=(t:number)=>({x:a.x+(b.x-a.x)*t/length,y:a.y+(b.y-a.y)*t/length}),result:[Point,Point][]=[];let end=0;
  for(const [lo,hi] of cuts){if(lo>end)result.push([xy(end),xy(lo)]);end=Math.max(end,hi)}if(end<length)result.push([xy(end),b]);return result;
 });
}
export function validateArchitecture(f:Floor,register?:(id:string)=>void){
 const openings=allOpenings(f);
 for(let i=0;i<openings.length;i++){const {host,opening:o,geometry:g}=openings[i];register?.(o.id);
  if(!host.edges[o.edge]||g.length<o.width*.4-.001||o.position*g.length<o.width*.2-.001||(1-o.position)*g.length<o.width*.2-.001)throw Error('A nyílászáró nem fér el a kiválasztott falon. Ellenőrizd a szélességet és a helyét.');
  for(let j=0;j<i;j++)if(interval(g.start,g.end,openings[j].geometry.start,openings[j].geometry.end))throw Error('Két nyílászáró átfedi egymást. Válassz másik helyet vagy falszakaszt.');
 }
}
export function nearestOpeningHost(f:Floor,p:Point,width:number,radius=20){
 let best:{host:WallHost;edge:number;position:number;distance:number}|null=null;
 for(const host of wallHosts(f))host.edges.forEach(([a,b],edge)=>{const length=distance(a,b),half=width*.2;if(length<half*2||!length)return;const u={x:(b.x-a.x)/length,y:(b.y-a.y)/length},at=Math.max(half,Math.min(length-half,(p.x-a.x)*u.x+(p.y-a.y)*u.y)),q={x:a.x+u.x*at,y:a.y+u.y*at},d=distance(p,q);if(d<=radius&&(!best||d<best.distance))best={host,edge,position:at/length,distance:d}});
 return best as {host:WallHost;edge:number;position:number;distance:number}|null;
}
export function newOpening(kind:Opening['kind'],edge=0,position=.5):Opening{return {id:crypto.randomUUID(),kind,edge,position,width:kind==='door'?90:120,height:kind==='door'?210:120,sill:kind==='door'?0:90,hinge:'start',swing:1}}
