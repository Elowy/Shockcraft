import type {Plan} from './plan';
import {boards,inBoard,moveModule,DEFAULT_BOARD} from './board-size';

export const moduleTypes=['MCB','RCD','RCBO','SPD','MAIN','DISTRIBUTION','PE','NEUTRAL','EPH','BUSBAR','TERMINAL'] as const;
export const moduleLabels:Record<typeof moduleTypes[number],string>={MCB:'Kismegszakító',RCD:'Áram-védőkapcsoló',RCBO:'Kombinált védelem',SPD:'Túlfeszültség-védelem',MAIN:'Főkapcsoló',DISTRIBUTION:'Fővezetéki leágazó',PE:'PE-sín',NEUTRAL:'Nullasín (N)',EPH:'EPH-sín',BUSBAR:'Fázissín',TERMINAL:'Sorkapocs'};
export const moduleWidths:Record<typeof moduleTypes[number],number>={MCB:1,RCD:4,RCBO:2,SPD:4,MAIN:4,DISTRIBUTION:4,PE:4,NEUTRAL:4,EPH:4,BUSBAR:4,TERMINAL:2};
export const moduleShort:Record<typeof moduleTypes[number],string>={MCB:'MCB',RCD:'ÁVK',RCBO:'RCBO',SPD:'SPD',MAIN:'I/O',DISTRIBUTION:'FVL',PE:'PE',NEUTRAL:'N',EPH:'EPH',BUSBAR:'L-sín',TERMINAL:'X'};
export type Endpoint={kind:'circuit'|'module'|'bar';id:string;port:string};
export type BoardWire=Plan['boardWires'][number];
export type Port={id:string;label:string;signal:string};
export const endpointKey=(e:Endpoint)=>JSON.stringify([e.kind,e.id,e.port]);
export const wireColor=(signal:string)=>signal==='N'?'#267bbd':signal==='PE'?'#419350':signal==='L2'?'#555d68':signal==='L3'?'#87919b':'#a36a36';
// Tokozati (nem DIN-sínre szerelt) PE- és N-sínek. Nem tárolt adatok: az elosztó tartalmából származnak, nem foglalnak modulhelyet.
// Sínje csak a nem üres elosztónak van (legalább egy modul vagy áramkör); az ÁVK-nként külön N-sín azonosítója a készülék azonosítójából képződik.
export type Bar={id:string;label:string;signal:'PE'|'N';kind:'pe'|'n'|'rcd';rcdId?:string};
export const BAR_MIN_TERMINALS=6,BAR_MAX_TERMINALS=400;
// Elosztónkénti kapcsoló (a főelosztó a building.board, az alelosztó az extraBoards eleme): a hiányzó érték (régi tervek, új elosztók) bekapcsoltat jelent.
// Szándékosan nem a lib/board-size.ts-ben: azt a Fázisterhelés kalkulátor kiadási rekordjának forrás-ujjlenyomata is lefedi.
type PlanBuilding=Plan['buildings'][number];
const boardSettings=(building:PlanBuilding|undefined,boardId=''):{autoBars?:boolean}|undefined=>boardId?building?.extraBoards?.find(v=>v.id===boardId):building?.board;
export const autoBarsOn=(building:PlanBuilding|undefined,boardId='')=>boardSettings(building,boardId)?.autoBars!==false;
export function setAutoBars(building:PlanBuilding,boardId:string,on:boolean){
 const target=boardId?building.extraBoards?.find(v=>v.id===boardId):on?building.board:(building.board??={...DEFAULT_BOARD});
 if(!target)return;if(on)delete target.autoBars;else target.autoBars=false;
}
// Az ÁVK-t nem lehet másik elosztóba tenni, amíg a saját N-sínjére kézi vezeték fut (a sín vele együtt költözne).
export function moveBoardModule(plan:Plan,moduleId:string,boardId:string){
 if(plan.boardWires.some(w=>[w.from,w.to].some(e=>e.kind==='bar'&&e.id==='rcd:'+moduleId)))throw Error('Áthelyezés előtt bontsd a készülék bekötéseit és áramkör-hozzárendelését.');
 moveModule(plan,moduleId,boardId);
}
export const barShortName=(name:string)=>name.split(' · ')[0].trim();
export const barPortIndex=(port:string)=>{const n=/^T([1-9]\d{0,2})$/.exec(port);return n&&Number(n[1])<=BAR_MAX_TERMINALS?Number(n[1]):0};
export function boardBars(plan:Plan,buildingId:string,boardId=''):Bar[]{
 const building=plan.buildings.find(b=>b.id===buildingId);
 if(!building||!boards(building).some(v=>v.id===boardId))return [];
 const modules=plan.modules.filter(m=>m.building===buildingId&&inBoard(m,boardId));
 if(!modules.length&&!plan.circuits.some(c=>c.building===buildingId&&inBoard(c,boardId)))return [];
 const rcds=modules.filter(m=>m.type==='RCD').sort((a,b)=>a.row-b.row||a.slot-b.slot||a.id.localeCompare(b.id));
 return [{id:`pe:${buildingId}/${boardId}`,label:'PE-sín',signal:'PE',kind:'pe'},{id:`n:${buildingId}/${boardId}`,label:'N-sín',signal:'N',kind:'n'},...rcds.map(m=>({id:'rcd:'+m.id,label:'N-sín · '+barShortName(m.name),signal:'N' as const,kind:'rcd' as const,rcdId:m.id}))];
}
export function findBar(plan:Plan,id:string){
 if(id.startsWith('rcd:')){const m=plan.modules.find(m=>m.id===id.slice(4)&&m.type==='RCD');if(!m)return null;const bar=boardBars(plan,m.building,m.board||'').find(b=>b.id===id);return bar?{bar,building:m.building,board:m.board||''}:null}
 const kind=id.startsWith('pe:')?'pe:':id.startsWith('n:')?'n:':'';if(!kind)return null;
 const rest=id.slice(kind.length);
 for(const b of plan.buildings)if(rest.startsWith(b.id+'/')){const board=rest.slice(b.id.length+1),bar=boardBars(plan,b.id,board).find(x=>x.id===id);if(bar)return {bar,building:b.id,board}}
 return null;
}
export function circuitPorts(c:Plan['circuits'][number]):Port[]{return [...(c.phase==='3P'?['L1','L2','L3']:['L']),'N','PE'].map(id=>({id,label:c.conductorNames?.[id as keyof NonNullable<typeof c.conductorNames>]||`${c.name} / ${id==='L'?c.phase:id}`,signal:id==='L'?c.phase:id}))}
export function modulePorts(m:Plan['modules'][number],plan:Plan):Port[]{
 const c=plan.circuits.find(c=>c.id===m.circuit);
 const multi=(prefix:string,signal:string,count=8)=>Array.from({length:count},(_,i)=>({id:`${prefix}${i+1}`,label:`${prefix}${i+1}`,signal}));
 if(['PE','EPH','NEUTRAL','BUSBAR'].includes(m.type)){const s=m.type==='NEUTRAL'?'N':m.type==='BUSBAR'?'L':'PE';return multi(s==='L'?'L-':s,s)}
 if(m.type==='DISTRIBUTION')return ['L1','L2','L3','N'].flatMap(s=>multi(s+'-',s,4));
 if(m.type==='TERMINAL')return ['L','N','PE'].flatMap(s=>multi(s+'-',s,2));
 const phases=(m.type==='MCB'||m.type==='RCBO')?(c?.phase==='3P'?['L1','L2','L3']:['L']):['L1','L2','L3'];
 const signals=[...phases,...(m.type!=='MCB'?['N']:[]),...(m.type==='SPD'?['PE']:[])];
 return signals.flatMap(s=>(m.type==='SPD'?['']:['in','out']).map(dir=>({id:s+(dir?'-'+dir:''),label:s+(dir==='in'?' · be':dir==='out'?' · ki':''),signal:s==='L'&&c&&c.phase!=='3P'?c.phase:s})));
}
export function endpointInfo(plan:Plan,e:Endpoint){
 if(e.kind==='bar'){const f=findBar(plan,e.id),n=barPortIndex(e.port);return f&&n?{id:e.port,label:e.port,signal:f.bar.signal as string,building:f.building,board:f.board,name:f.bar.label,text:f.bar.label+' / '+e.port}:null}
 const entity=e.kind==='circuit'?plan.circuits.find(c=>c.id===e.id):plan.modules.find(m=>m.id===e.id);if(!entity)return null;const port=(e.kind==='circuit'?circuitPorts(entity as Plan['circuits'][number]):modulePorts(entity as Plan['modules'][number],plan)).find(p=>p.id===e.port);return port?{...port,building:entity.building,board:entity.board||'',name:entity.name,text:e.kind==='circuit'?port.label:entity.name+' / '+port.label}:null}
export function compatible(a:string,b:string){return a===b||(a==='L'&&b.startsWith('L'))||(b==='L'&&a.startsWith('L'))}
export function validateBoard(plan:Plan){
 const occupied=new Set<string>(),pairs=new Set<string>();
 for(const w of plan.boardWires){const a=endpointInfo(plan,w.from),b=endpointInfo(plan,w.to);if(!a||!b||a.building!==w.building||b.building!==w.building)throw Error('A bekötés végpontja hiányzik vagy másik épülethez tartozik.');
  if(a.board!==b.board)throw Error('Külön elosztók kapcsai itt nem köthetők össze. Használd az alaprajzi vagy telki nyomvonalat.');
  if(w.from.kind==='bar'&&w.to.kind==='bar')throw Error('Két sín kapcsa nem köthető össze közvetlenül.');
  if(w.from.kind===w.to.kind&&w.from.id===w.to.id||w.from.kind==='circuit'&&w.to.kind==='circuit')throw Error('Két különböző készüléket, vagy egy áramkört és egy készüléket válassz.');
  if(!compatible(a.signal,b.signal))throw Error('Eltérő fázisú, nulla- vagy PE-kapcsok nem köthetők össze.');
  const pair=[endpointKey(w.from),endpointKey(w.to)].sort().join('|');if(pairs.has(pair))throw Error('Ez a bekötés már szerepel.');pairs.add(pair);
  for(const e of [w.from,w.to])if(e.kind==='circuit'){const key=endpointKey(e);if(occupied.has(key))throw Error('Az áramköri szál már be van kötve.');occupied.add(key);const other=e===w.from?w.to:w.from;const m=other.kind==='module'?plan.modules.find(m=>m.id===other.id):undefined;if(m&&['MCB','RCBO'].includes(m.type)&&m.circuit!==e.id)throw Error('A védelmi készülék áramkör-hozzárendelése eltér a bekötéstől.');}
 }
}
export function connectBoard(plan:Plan,wire:Plan['boardWires'][number]){
 const end=[wire.from,wire.to].find(e=>e.kind==='circuit'),target=[wire.from,wire.to].find(e=>e.kind==='module');
 if(end&&target){const m=plan.modules.find(m=>m.id===target.id);if(m&&['MCB','RCBO'].includes(m.type)){if(m.circuit&&m.circuit!==end.id)throw Error('Ez a védelmi készülék már másik áramkörhöz tartozik.');m.circuit=end.id}}
 plan.boardWires.push(wire);validateBoard(plan);
}
// Az ÁVK törlésekor a saját N-sínjére kötött vezetékek is megszűnnek.
export function removeBoardLinks(plan:Plan,kind:Endpoint['kind'],id:string){const own=kind==='module'?'rcd:'+id:'';plan.boardWires=plan.boardWires.filter(w=>![w.from,w.to].some(e=>e.kind===kind&&e.id===id||own&&e.kind==='bar'&&e.id===own))}
// Phase/assignment edits may change the available poles. Keep only valid links.
export function pruneBoardLinks(plan:Plan){plan.boardWires=plan.boardWires.filter(w=>{const a=endpointInfo(plan,w.from),b=endpointInfo(plan,w.to);if(!a||!b||a.building!==w.building||b.building!==w.building||a.board!==b.board||!compatible(a.signal,b.signal)||w.from.kind==='bar'&&w.to.kind==='bar')return false;const c=[w.from,w.to].find(e=>e.kind==='circuit'),m=[w.from,w.to].find(e=>e.kind==='module');const device=m&&plan.modules.find(x=>x.id===m.id);return !(c&&device&&['MCB','RCBO'].includes(device.type)&&device.circuit!==c.id)})}
