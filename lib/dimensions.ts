import {z} from 'zod';
const coordinate=z.number().finite().min(0).max(2000);
const point=z.object({x:coordinate,y:coordinate});
export const dimensionSchema=z.object({
 id:z.string().min(1).max(80),name:z.string().trim().min(1).max(120),
 a:point,b:point,mode:z.enum(['aligned','horizontal','vertical']),
 offset:z.number().finite().min(-400).max(400),
});
export type Dimension=z.infer<typeof dimensionSchema>;
export type DimensionMode=Dimension['mode'];
export const dimensionModes:[string,string][]=[['aligned','Közvetlen távolság'],['horizontal','Vízszintes méret'],['vertical','Függőleges méret']];
export function dimensionGeometry(d:Dimension){
 const dx=d.b.x-d.a.x,dy=d.b.y-d.a.y,len=Math.hypot(dx,dy);
 const normal=d.mode==='horizontal'?{x:0,y:1}:d.mode==='vertical'?{x:1,y:0}:len?{x:-dy/len,y:dx/len}:{x:0,y:1};
 const a={x:d.a.x+normal.x*d.offset,y:d.a.y+normal.y*d.offset};
 const b=d.mode==='horizontal'?{x:d.b.x,y:a.y}:d.mode==='vertical'?{x:a.x,y:d.b.y}:{x:d.b.x+normal.x*d.offset,y:d.b.y+normal.y*d.offset};
 const length=(d.mode==='horizontal'?Math.abs(dx):d.mode==='vertical'?Math.abs(dy):len)/40;
 const along=d.mode==='horizontal'?{x:1,y:0}:d.mode==='vertical'?{x:0,y:1}:len?{x:dx/len,y:dy/len}:{x:1,y:0};
 const tick=(p:{x:number;y:number})=>[{x:p.x-(along.x+normal.x)*5,y:p.y-(along.y+normal.y)*5},{x:p.x+(along.x+normal.x)*5,y:p.y+(along.y+normal.y)*5}];
 const label={x:(a.x+b.x)/2,y:(a.y+b.y)/2-10};
 const lines=[[d.a,a],[d.b,b],[a,b],tick(a),tick(b)];
 return {a,b,length,label,lines,bounds:[...lines.flat(),label],text:length.toLocaleString('hu-HU',{minimumFractionDigits:2,maximumFractionDigits:2})+' m'};
}
