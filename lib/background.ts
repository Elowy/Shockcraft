import {z} from 'zod';
export const backgroundSchema=z.object({assetId:z.string().uuid(),name:z.string().min(1).max(180),x:z.number().finite().min(0).max(2000),y:z.number().finite().min(0).max(2000),w:z.number().finite().min(4).max(2000),h:z.number().finite().min(4).max(2000),opacity:z.number().min(.1).max(1),visible:z.boolean(),calibrated:z.boolean()}).refine(b=>b.x+b.w<=2000&&b.y+b.h<=2000,'A háttér túlnyúlik az 50 × 50 méteres rajzterületen.');
export type Background=z.infer<typeof backgroundSchema>;
export const backgroundUrl=(id:string)=>'/api/backgrounds?asset='+encodeURIComponent(id);
export function calibratedSize(a:{x:number;y:number},b:{x:number;y:number},meters:number,ratio:number){
 const distance=Math.hypot(a.x-b.x,(a.y-b.y)*ratio);
 if(!Number.isFinite(meters)||meters<=0||meters>100||distance<.005||!Number.isFinite(ratio)||ratio<=0)throw Error('Jelölj ki két különböző pontot, és adj meg érvényes távolságot.');
 const w=meters*40/distance,h=w*ratio;
 if(w<4||h<4||w>2000||h>2000)throw Error('A háttér mérete 0,1–50 méter között lehet. Ellenőrizd a pontokat és a távolságot.');
 return {w,h};
}
export function jpegDimensions(bytes:Uint8Array){
 if(bytes.length<12||bytes[0]!==255||bytes[1]!==216)throw Error('Csak JPEG háttérkép tárolható.');
 let offset=2;
 while(offset+4<bytes.length){if(bytes[offset++]!==255)throw Error('Hibás JPEG.');while(bytes[offset]===255)offset++;const marker=bytes[offset++];if(marker===217||marker===218)break;const len=(bytes[offset]<<8)|bytes[offset+1];if(len<2||offset+len>bytes.length)break;
  if([192,193,194].includes(marker)){const h=(bytes[offset+3]<<8)|bytes[offset+4],w=(bytes[offset+5]<<8)|bytes[offset+6];if(w<1||h<1||w>3200||h>3200)throw Error('A háttérkép legfeljebb 3200 képpontos lehet.');return {w,h};}offset+=len;
 }throw Error('Nem olvasható JPEG kép.');
}
