import type {Plan,Point} from './plan';
import {modulePorts,circuitPorts,endpointInfo,endpointKey,compatible,connectBoard,type Endpoint,type Port} from './board';

// Preview an unassigned protection device with the poles of the selected circuit.
export function connectionPlan(plan:Plan,ends:Endpoint[]):Plan{
 const circuit=ends.find(e=>e.kind==='circuit');if(!circuit)return plan;
 return {...plan,modules:plan.modules.map(m=>!m.circuit&&['MCB','RCBO'].includes(m.type)?{...m,circuit:circuit.id}:m)};
}
export function connectionIssue(plan:Plan,from:Endpoint,to:Endpoint):string|null{
 const preview=connectionPlan(plan,[from,to]),a=endpointInfo(preview,from),b=endpointInfo(preview,to);
 if(!a||!b)return 'A kapocs megváltozott. Válaszd ki először az áramköri szálat, majd a készülék kapcsát.';
 if(a.building!==b.building)return 'Másik épülethez tartozó kapocs.';
 if(from.kind===to.kind&&(from.id===to.id||from.kind==='circuit'))return 'Másik készülék vagy áramköri szál szükséges.';
 if(!compatible(a.signal,b.signal))return 'Eltérő fázisú, N- és PE-kapcsok nem köthetők össze.';
 const c=[from,to].find(e=>e.kind==='circuit'),m=[from,to].find(e=>e.kind==='module');
 const device=m&&plan.modules.find(x=>x.id===m.id);
 if(c&&device&&['MCB','RCBO'].includes(device.type)&&device.circuit&&device.circuit!==c.id)return 'A készülék már másik áramkörhöz tartozik.';
 const fk=endpointKey(from),tk=endpointKey(to);
 if(plan.boardWires.some(w=>[endpointKey(w.from),endpointKey(w.to)].includes(fk)&&[endpointKey(w.from),endpointKey(w.to)].includes(tk)))return 'Ez a bekötés már létezik.';
 if(c&&plan.boardWires.some(w=>[w.from,w.to].some(e=>endpointKey(e)===endpointKey(c))))return 'Ez az áramköri szál már be van kötve. Átkötés előtt bontsd a meglévő kapcsolatát.';
 if(plan.boardWires.length>=3000)return 'A terv elérte a 3000 bekötéses korlátot.';
 return null;
}
export function connectTerminals(plan:Plan,from:Endpoint,to:Endpoint,id:string){
 const issue=connectionIssue(plan,from,to);if(issue)throw Error(issue);
 const next=structuredClone(plan),preview=connectionPlan(plan,[from,to]);
 const c=[from,to].find(e=>e.kind==='circuit'),a=endpointInfo(preview,from)!,b=endpointInfo(preview,to)!;
 const name=(c?endpointInfo(preview,c)!.label:`${a.signal} · ${a.name} – ${b.name}`).slice(0,120);
 connectBoard(next,{id,name,building:a.building,from,to});return next;
}
export type CabinetPin=Point&{end:Endpoint;port:Port;side:'top'|'bottom';escapeY:number};
export function cabinetLayout(plan:Plan,buildingId:string){
 const unit=80,left=72,width=1584,modules=plan.modules.filter(m=>m.building===buildingId),circuits=plan.circuits.filter(c=>c.building===buildingId);
 const pins:CabinetPin[]=[],devices:{module:Plan['modules'][number];x:number;y:number;w:number;h:number}[]=[],rows:{y:number;bodyY:number;h:number}[]=[];
 let y=18;
 for(let row=0;row<4;row++){
  const items=modules.filter(m=>m.row===row).map(m=>{const ports=modulePorts(m,plan),columns=Math.max(1,Math.floor((m.width*unit-12)/30));
   const directional=ports.some(p=>p.id.endsWith('-in'));
   const split=directional?0:ports.length>columns?Math.ceil(ports.length/2):ports.length;
   const top=directional?ports.filter(p=>p.id.endsWith('-in')):ports.slice(0,split),bottom=directional?ports.filter(p=>p.id.endsWith('-out')):ports.slice(split);
   return {m,columns,top,bottom};
  });
  const topRows=Math.max(1,...items.map(m=>Math.ceil(m.top.length/m.columns))),bottomRows=Math.max(1,...items.map(m=>Math.ceil(m.bottom.length/m.columns)));
  const bodyY=items.length?y+60+topRows*30:y+40,h=items.length?60+topRows*30+92+bottomRows*30+40:144;
  rows.push({y,bodyY,h});
  for(const item of items){const {m,top,bottom,columns}=item,x=left+m.slot*unit+4,w=m.width*unit-8;
   devices.push({module:m,x,y:bodyY,w,h:92});
   for(const [side,ports] of [['top',top],['bottom',bottom]] as const)ports.forEach((port,i)=>{
    const r=Math.floor(i/columns),count=Math.min(columns,ports.length-r*columns),px=x+w*(i%columns+.5)/count;
    const py=side==='top'?bodyY-12-r*30:bodyY+104+r*30;
    pins.push({x:px,y:py,end:{kind:'module',id:m.id,port:port.id},port,side,escapeY:side==='top'?y+30:y+h-16});
   });
  }
  y+=h+14;
 }
 const circuitTop=y+40,cards=circuits.map((c,i)=>{const x=left+(i%3)*480,cy=circuitTop+Math.floor(i/3)*172,w=448;
  circuitPorts(c).forEach((port,j,ports)=>pins.push({x:x+w*(j+.5)/ports.length,y:cy+90,end:{kind:'circuit',id:c.id,port:port.id},port,side:'bottom',escapeY:cy+136}));
  return {circuit:c,x,y:cy,w,h:112};
 });
 return {width,height:circuitTop+Math.ceil(circuits.length/3)*172+24,rows,devices,cards,pins,circuitTop};
}
export function cabinetWirePoints(a:CabinetPin,b:CabinetPin,index:number):Point[]{
 const shift=(index%5)*4,ay=a.escapeY+(a.side==='top'?-shift:shift),by=b.escapeY+(b.side==='top'?-shift:shift);
 if(a.escapeY===b.escapeY)return [a,{x:a.x,y:ay},{x:b.x,y:ay},b];
 const channel=18+(index%10)*4;
 return [a,{x:a.x,y:ay},{x:channel,y:ay},{x:channel,y:by},{x:b.x,y:by},b];
}
