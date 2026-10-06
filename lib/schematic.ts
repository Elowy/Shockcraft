import {inBoard} from './board-size';
import type {Plan,Point} from './plan';
import {circuitPorts,modulePorts,moduleLabels,moduleShort,endpointKey,endpointInfo,wireColor,type Endpoint} from './board';
export type SchematicMode='single'|'multi';
export type Primitive=
 |{type:'line';points:Point[];color:string;width?:number;dash?:boolean}
 |{type:'rect';x:number;y:number;w:number;h:number;color:string;fill:string}
 |{type:'circle';x:number;y:number;r:number;color:string;fill:string}
 |{type:'text';x:number;y:number;text:string;size:number;color:string};
export type DiagramNode={id:string;kind:'module'|'circuit';name:string;x:number;y:number;w:number;h:number;drawing:Primitive[]};
export type DiagramEdge={id:string;name:string;detail:string;count:number;signal:string;points:Point[];drawing:Primitive[]};
export const schematicTitle=(mode:SchematicMode)=>mode==='single'?'Egyvonalas kapcsolási rajz':'Többvonalas kapcsolási rajz';
const ink='#263b49',muted='#5e7280';
const words=(value:string,max=33)=>{const result:string[]=[];let line='';for(const word of value.split(/\s+/)){if((line+' '+word).trim().length>max&&line){result.push(line);line=''}for(let i=0;i<word.length;i+=max){const part=word.slice(i,i+max);if(i){result.push(line);line=''}line+=(line?' ':'')+part}}if(line)result.push(line);return result};
export function buildSchematic(plan:Plan,buildingId:string,mode:SchematicMode,boardId=''){
 const modules=plan.modules.filter(m=>m.building===buildingId&&inBoard(m,boardId)).sort((a,b)=>a.row-b.row||a.slot-b.slot||a.id.localeCompare(b.id));
 const circuits=plan.circuits.filter(c=>c.building===buildingId&&inBoard(c,boardId));
 const wires=plan.boardWires.filter(w=>w.building===buildingId&&endpointInfo(plan,w.from)?.board===boardId&&endpointInfo(plan,w.to)?.board===boardId&&endpointInfo(plan,w.from)?.building===buildingId&&endpointInfo(plan,w.to)?.building===buildingId);
 const wireSignal=(wire:Plan['boardWires'][number])=>{const a=endpointInfo(plan,wire.from)!.signal,b=endpointInfo(plan,wire.to)!.signal;return a==='L'?b:a};
 const connected=new Set(wires.flatMap(w=>[endpointKey(w.from),endpointKey(w.to)]));
 const ports=new Map<string,Point>(),nodes:DiagramNode[]=[],edges:DiagramEdge[]=[];
 const missing=circuits.flatMap(c=>circuitPorts(c).filter(p=>!connected.has(endpointKey({kind:'circuit',id:c.id,port:p.id}))).map(p=>({circuit:c.name,signal:p.signal,name:p.label})));
 const key=(e:Pick<Endpoint,'kind'|'id'>)=>JSON.stringify([e.kind,e.id]);
 const body:Primitive[]=[];
 for(const kind of ['module','circuit'] as const){let y=70;
  const entities=kind==='module'?modules:circuits;
  for(const entity of entities){
   const m=kind==='module'?modules.find(m=>m.id===entity.id):undefined,c=kind==='circuit'?circuits.find(c=>c.id===entity.id):undefined;
   const x=kind==='module'?40:880,w=280;
   const entityPorts=m?modulePorts(m,plan):circuitPorts(c!);
   const title=words(entity.name),subtitle=words(m?moduleLabels[m.type]:`${c!.phase} · ${c!.curve}${c!.rating} A · ${c!.cable}`);
   const header=28+title.length*19+subtitle.length*17+(kind==='circuit'?12:0);
   const h=header+(mode==='multi'?entityPorts.length*24+16:52);
   const drawing:Primitive[]=[{type:'rect',x,y,w,h,color:'#a8bac4',fill:'#ffffff'}];
   title.forEach((text,i)=>drawing.push({type:'text',x:x+14,y:y+25+i*19,text,size:16,color:ink}));
   subtitle.forEach((text,i)=>drawing.push({type:'text',x:x+14,y:y+27+title.length*19+i*17,text,size:13,color:muted}));
   if(mode==='multi')entityPorts.forEach((p,i)=>{
    const py=y+header+18+i*24,px=kind==='module'?x+w:x;
    const bound=connected.has(endpointKey({kind,id:entity.id,port:p.id}));
    drawing.push({type:'text',x:x+14,y:py+4,text:p.label.length>34?p.label.slice(0,31)+'…':p.label,size:13,color:wireColor(p.signal)});
    drawing.push({type:'circle',x:px,y:py,r:4,color:wireColor(p.signal),fill:bound?wireColor(p.signal):'#ffffff'});
    ports.set(endpointKey({kind,id:entity.id,port:p.id}),{x:px,y:py});
   });else{
    const py=y+header+24,px=kind==='module'?x+w:x;
    ports.set(key({kind,id:entity.id}),{x:px,y:py});
    const bound=entityPorts.filter(p=>connected.has(endpointKey({kind,id:entity.id,port:p.id}))).length;
    drawing.push({type:'text',x:x+64,y:py+5,text:m?moduleShort[m.type]:`${bound} / ${entityPorts.length} szál bekötve`,size:14,color:ink});
    // Simplified switch, bus and outgoing-circuit signs; no manufacturer pole diagram is inferred.
    if(m&&['PE','EPH','NEUTRAL','BUSBAR','DISTRIBUTION','TERMINAL'].includes(m.type))drawing.push({type:'line',points:[{x:x+18,y:py-10},{x:x+18,y:py+10}],color:ink,width:4},{type:'line',points:[{x:x+18,y:py},{x:x+47,y:py}],color:ink});
    else if(!m)drawing.push({type:'line',points:[{x:x+14,y:py},{x:x+48,y:py},{x:x+40,y:py-7},{x:x+48,y:py},{x:x+40,y:py+7}],color:ink});
    else if(m.type==='SPD')drawing.push({type:'rect',x:x+14,y:py-13,w:38,h:26,color:ink,fill:'#fff'},{type:'line',points:[{x:x+37,y:py-10},{x:x+27,y:py+1},{x:x+38,y:py-1},{x:x+29,y:py+10}],color:ink});
    else drawing.push({type:'line',points:[{x:x+14,y:py},{x:x+24,y:py},{x:x+40,y:py-10}],color:ink},{type:'line',points:[{x:x+42,y:py},{x:x+52,y:py}],color:ink});
    drawing.push({type:'circle',x:px,y:py,r:4,color:ink,fill:bound?ink:'#ffffff'});
   }
   nodes.push({id:entity.id,kind,name:entity.name,x,y,w,h,drawing});y+=h+40;
  }
 }
 // Keep the two columns in shared rows, so printed pages can break between whole devices.
 const columns=[nodes.filter(n=>n.kind==='module'),nodes.filter(n=>n.kind==='circuit')];
 const breaks=[0];let rowTop=70;
 for(let i=0;i<Math.max(...columns.map(c=>c.length));i++){
  const row=columns.flatMap(c=>c[i]?[c[i]]:[]);
  for(const node of row){const delta=rowTop-node.y;node.y=rowTop;
   for(const shape of node.drawing){if(shape.type==='line')shape.points=shape.points.map(p=>({...p,y:p.y+delta}));else shape.y+=delta}
   for(const [id,p] of ports){const endpoint=JSON.parse(id) as string[];if(endpoint[0]===node.kind&&endpoint[1]===node.id)ports.set(id,{x:p.x,y:p.y+delta})}
  }
  rowTop+=Math.max(...row.map(n=>n.h))+40;breaks.push(rowTop-20);
 }
 const grouped=new Map<string,typeof wires>();
 for(const wire of wires){const group=mode==='multi'?wire.id:[key(wire.from),key(wire.to)].sort().join('|');const list=grouped.get(group)||[];list.push(wire);grouped.set(group,list)}
 let index=0;
 for(const [id,list] of grouped){const first=list[0],a=ports.get(mode==='multi'?endpointKey(first.from):key(first.from)),b=ports.get(mode==='multi'?endpointKey(first.to):key(first.to));if(!a||!b)continue;
  const signal=mode==='multi'?wireSignal(first):'',lane=360+(index%100)/Math.max(1,Math.min(grouped.size,100)-1)*460;
  const points=[a,{x:lane,y:a.y},{x:lane,y:b.y},b];
  const reference='V'+(index+1),name=reference+' · '+(mode==='multi'?first.name:`${list.length} vezető · ${Array.from(new Set(list.map(wireSignal))).join(', ')}`);
  const detail=list.map(w=>`${w.name}: ${endpointInfo(plan,w.from)!.text} ↔ ${endpointInfo(plan,w.to)!.text}`).join('\n');
  const color=mode==='multi'?wireColor(signal):ink;
  const drawing:Primitive[]=[{type:'line',points,color,width:2}];
  if(signal==='PE')drawing.push({type:'line',points,color:'#e5ba32',width:1,dash:true});
  const tag=reference+(mode==='single'?' / '+list.length+' szál':''),tagWidth=tag.length*7+8,tagX=lane>740?lane-tagWidth-5:lane+5;
  let tagY=(a.y+b.y)/2;for(const boundary of breaks)if(Math.abs(tagY-boundary)<20)tagY=boundary-24;
  drawing.push({type:'rect',x:tagX,y:tagY-13,w:tagWidth,h:18,color:'#d6e0e5',fill:'#ffffff'},{type:'text',x:tagX+4,y:tagY,text:tag,size:11,color:ink});
  edges.push({id,name,detail,count:list.length,signal,points,drawing});index++;
 }
 body.push({type:'text',x:40,y:34,text:'Elosztókészülékek',size:18,color:ink},{type:'text',x:880,y:34,text:'Elmenő áramkörök',size:18,color:ink});
 const height=Math.max(300,...nodes.map(n=>n.y+n.h+20));
 return {width:1200,height,breaks,nodes,edges,body,missing,wireCount:wires.length,drawing:[...body,...edges.flatMap(e=>e.drawing),...nodes.flatMap(n=>n.drawing)]};
}
