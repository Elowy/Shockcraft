import {boardName} from './board-size';
import {labels,type Plan} from './plan';
import {moduleLabels} from './board';
import type {SearchResult} from './plan-tools';

export type CheckLevel='missing'|'review';
export type PlanCheck={id:string;code:string;level:CheckLevel;title:string;detail:string;target:SearchResult};
export const checkLevels={missing:'Hiányzó adat',review:'Átnézendő tétel'};
/** Checks recorded data only; it does not infer electrical connections from overlapping lines. */
export function checkPlan(plan:Plan):PlanCheck[]{
 const issues:PlanCheck[]=[];
 const add=(code:string,level:CheckLevel,title:string,detail:string,target:SearchResult)=>issues.push({id:code+':'+target.id,code,level,title,detail,target});
 for(const b of plan.buildings){
  for(const f of b.floors){
   const location=b.name+' / '+f.name;
   const devices=new Map(f.devices.map(d=>[d.id,d]));
   const connected=new Set(f.routes.flatMap(r=>[r.startId,r.endId]).filter(Boolean));
   const names=new Map<string,number>();
   const normalize=(s:string)=>s.trim().toLocaleLowerCase('hu-HU');
   for(const d of f.devices)names.set(normalize(d.name),(names.get(normalize(d.name))||0)+1);
   for(const d of f.devices){
    const target:SearchResult={id:d.id,type:'devices',buildingId:b.id,floorId:f.id,title:d.name,subtitle:location+' · '+labels[d.kind],x:d.x,y:d.y};
    const power=d.kind==='socket'||d.kind==='double'||d.kind==='light'||d.kind.startsWith('switch');
    if(power&&!d.circuit)add('device-circuit','missing','Nincs megadva áramkör','Rendelj áramkört a szerelvényhez a tulajdonságainál.',target);
    if(power&&!connected.has(d.id))add('device-route','review','Nincs kapcsolt nyomvonal','Egyetlen nyomvonal végpontja sem hivatkozik erre a szerelvényre. A rajzi érintkezés önmagában nem jelent rögzített kapcsolatot.',target);
    if((names.get(normalize(d.name))||0)>1)add('device-name','review','Ismétlődő szerelvénynév','Ezen a szinten több szerelvény viseli ezt a nevet. Egyedi jelöléssel könnyebb megkülönböztetni őket.',target);
   }
   for(const r of f.routes){
    const points=r.points.map(p=>({...p})),start=devices.get(r.startId||''),end=devices.get(r.endId||'');
    if(start)points[0]=start;if(end)points[points.length-1]=end;
    const target:SearchResult={id:r.id,type:'routes',buildingId:b.id,floorId:f.id,title:r.name,subtitle:location+' · Nyomvonal',x:points.reduce((s,p)=>s+p.x,0)/points.length,y:points.reduce((s,p)=>s+p.y,0)/points.length};
    if(!r.cable.trim())add('route-cable','missing','Hiányzó kábeljelölés','Add meg a kábel típusát vagy jelölését a nyomvonal tulajdonságainál.',target);
    if(!r.startId||!r.endId)add('route-endpoint','review','Szabad nyomvonalvég',(!r.startId&&!r.endId?'Mindkét végpont':!r.startId?'A kezdőpont':'A végpont')+' önálló rajzi pont. Ha szerelvényhez tartozik, válaszd ki a nyomvonal tulajdonságainál. A szabad végpont szándékos is lehet.',target);
   }
  }
  for(const m of plan.modules.filter(m=>m.building===b.id)){
   if((m.type==='MCB'||m.type==='RCBO')&&!m.circuit)add('module-circuit','review','Áramkör nélküli védelmi készülék','Ha a készülék nem tartalék, rendeld a megfelelő áramkörhöz.',{id:m.id,type:'modules',buildingId:b.id,floorId:b.floors[0]?.id||'',title:m.name,subtitle:b.name+' / '+boardName(b,m.board)+' · '+moduleLabels[m.type]+' · '+(m.row+1)+'. sor',x:0,y:0});
  }
 }
 return issues.sort((a,b)=>Number(a.level==='review')-Number(b.level==='review')||a.target.subtitle.localeCompare(b.target.subtitle,'hu')||a.target.title.localeCompare(b.target.title,'hu')||a.code.localeCompare(b.code));
}
