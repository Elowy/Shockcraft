import {z} from 'zod';
import {floorSchema,uid,validatePlan,type Plan,type Floor,type Point} from './plan';
import {copySource,copiedName} from './structure-copy';
import {floorLength,floorPoints} from './geometry';
import {floorItems} from './floor-selection';

export const TEMPLATE_LIMIT=30;
export const templateSchema=z.object({id:z.string().uuid(),name:z.string().trim().min(1).max(120),kind:z.enum(['room','floor']),archived:z.boolean().default(false),floor:floorSchema});
export type PlanTemplate=z.infer<typeof templateSchema>;
export function templatePlan(floor:Floor):Plan{return {version:1,name:'Sablon',plot:{name:'Telek',w:40,h:30,nodes:[],routes:[]},buildings:[{id:'template-building',name:'Épület',x:0,y:0,w:10,h:10,floors:[floor]}],circuits:[],modules:[],boardWires:[]}}
export function validateTemplate(input:unknown):PlanTemplate{
 const t=templateSchema.parse(input);
 if(t.floor.background||t.floor.devices.some(d=>d.kind==='panel'||d.circuit||d.board)||t.floor.routes.some(r=>r.circuit))throw Error('A sablon nem tartalmazhat háttérképet, elosztóhivatkozást vagy áramkör-hozzárendelést.');
 if(t.kind==='room'&&t.floor.rooms.length!==1)throw Error('A szobasablon pontosan egy szobát tartalmazhat.');
 if(!floorItems(t.floor).length)throw Error('Üres szint nem menthető sablonként.');
 t.floor=validatePlan(templatePlan(t.floor)).buildings[0].floors[0];
 return t;
}
export function validateTemplateLibrary(value:unknown){const list=z.array(templateSchema).max(TEMPLATE_LIMIT).parse(value).map(validateTemplate);if(new Set(list.map(t=>t.id)).size!==list.length)throw Error('Ismétlődő sablonazonosító.');return list}
export function captureTemplate(plan:Plan,buildingId:string,floorId:string,roomId:string|undefined,name:string,contents=true):PlanTemplate{
 const {floor,items}=copySource(plan,{buildingId,floorId,roomId,contents,panels:false});
 const keep=new Set(items.map(i=>i.id)),out:Floor={id:uid(),name:'Sablon',elevation:0,rooms:[],walls:[],devices:[],routes:[],dimensions:[]};
 out.rooms=structuredClone(floor.rooms.filter(r=>keep.has(r.id)));
 out.walls=structuredClone(floor.walls.filter(w=>keep.has(w.id)));
 out.devices=floor.devices.filter(d=>keep.has(d.id)).map(d=>{const copy={...structuredClone(d),circuit:''};delete copy.board;return copy});
 out.dimensions=structuredClone((floor.dimensions||[]).filter(d=>keep.has(d.id)));
 out.routes=floor.routes.filter(r=>keep.has(r.id)).map(r=>{const length=floorLength(r,floor);return {...structuredClone(r),circuit:'',points:floorPoints(r,floor),startId:out.devices.some(d=>d.id===r.startId)?r.startId:'',endId:out.devices.some(d=>d.id===r.endId)?r.endId:'',startHeight:length.start*100,endHeight:length.end*100}});
 return validateTemplate({id:uid(),name,kind:roomId?'room':'floor',archived:false,floor:out});
}
export function insertTemplate(plan:Plan,input:PlanTemplate,options:{buildingId:string;floorId:string;name:string;x:number;y:number;elevation:number;contents:boolean}){
 const t=validateTemplate(input);if(t.archived)throw Error('Először állítsd vissza az archivált sablont.');
 const draft=structuredClone(plan),b=draft.buildings.find(b=>b.id===options.buildingId);if(!b)throw Error('Válassz célépületet.');
 const source=structuredClone(t.floor),name=options.name.trim();if(!name||name.length>120)throw Error('A név 1–120 karakter hosszú lehet.');
 if(!options.contents){source.devices=[];source.routes=[]}
 const dx=t.kind==='room'?options.x-source.rooms[0].x:0,dy=t.kind==='room'?options.y-source.rooms[0].y:0;
 const shift=(p:Point)=>{const q={x:p.x+dx,y:p.y+dy};if(!Number.isFinite(q.x)||!Number.isFinite(q.y)||q.x<0||q.y<0||q.x>2000||q.y>2000)throw Error('A sablon nem fér el az 50 × 50 méteres rajzterületen.');return q};
 const ids=new Map(floorItems(source).map(i=>[i.id,uid()]));
 const target=t.kind==='room'?b.floors.find(f=>f.id===options.floorId):{id:uid(),name,elevation:options.elevation,rooms:[],walls:[],devices:[],routes:[],dimensions:[]} as Floor;
 if(!target)throw Error('Válassz célszintet.');
 for(const r of source.rooms){shift({x:r.x+r.w,y:r.y+r.h});target.rooms.push({...r,...shift(r),id:ids.get(r.id)!,name:t.kind==='room'?name:r.name,openings:r.openings?.map(o=>({...o,id:uid()}))})}
 for(const w of source.walls)target.walls.push({...w,id:ids.get(w.id)!,a:shift(w.a),b:shift(w.b),openings:w.openings?.map(o=>({...o,id:uid()}))});
 for(const d of source.devices)target.devices.push({...d,...shift(d),id:ids.get(d.id)!,name:copiedName(d.name,target.devices.map(v=>v.name))});
 for(const r of source.routes)target.routes.push({...r,id:ids.get(r.id)!,name:copiedName(r.name,target.routes.map(v=>v.name)),points:r.points.map(shift),startId:ids.get(r.startId||'')||'',endId:ids.get(r.endId||'')||''});
 for(const d of source.dimensions||[])(target.dimensions??=[]).push({...d,id:ids.get(d.id)!,a:shift(d.a),b:shift(d.b)});
 if(t.kind==='floor')b.floors.push(target);
 return {plan:validatePlan(draft),floorId:target.id,items:floorItems(source).map(i=>({...i,id:ids.get(i.id)!}))};
}
