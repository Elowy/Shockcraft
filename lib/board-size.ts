import type {Plan} from './plan';
export type BoardSize={rows:number;modulesPerRow:number};
export const DEFAULT_BOARD:BoardSize={rows:4,modulesPerRow:18};
export const MAX_BOARD_ROWS=12,MAX_BOARD_COLUMNS=36;
type Building={board?:BoardSize;boardName?:string;extraBoards?:({id:string;name:string}&BoardSize)[]};
export function boards(building?:Building){return [{id:'',name:building?.boardName||'Főelosztó',...(building?.board??DEFAULT_BOARD)},...(building?.extraBoards||[])]}
export function boardSize(building?:Building,boardId=''):BoardSize{const b=boards(building).find(b=>b.id===boardId)??DEFAULT_BOARD;return {rows:b.rows,modulesPerRow:b.modulesPerRow}}
export function boardName(building?:Building,boardId=''){return boards(building).find(b=>b.id===boardId)?.name||'Hiányzó elosztó'}
export function inBoard(entity:{board?:string},boardId=''){return (entity.board||'')===boardId}
export function boardSizeIssue(plan:Plan,buildingId:string,size:BoardSize,boardId=''){
 if(!Number.isInteger(size.rows)||size.rows<1||size.rows>MAX_BOARD_ROWS||!Number.isInteger(size.modulesPerRow)||size.modulesPerRow<1||size.modulesPerRow>MAX_BOARD_COLUMNS)return '1–12 sor és soronként 1–36 modulhely adható meg.';
 if(!plan.buildings.some(b=>b.id===buildingId&&boards(b).some(v=>v.id===boardId)))return 'Az épület nem található.';
 const outside=plan.modules.filter(m=>m.building===buildingId&&inBoard(m,boardId)&&(m.row>=size.rows||m.slot+m.width>size.modulesPerRow));
 if(outside.length)return `${outside.length} készülék kilógna az új elosztóból (${outside.slice(0,3).map(m=>m.name).join(', ')}). Előbb helyezd át őket, vagy válassz nagyobb méretet.`;
 return null;
}
export function findModulePlace(plan:Plan,buildingId:string,width:number,boardId=''){
 const size=boardSize(plan.buildings.find(b=>b.id===buildingId),boardId);
 for(let row=0;row<size.rows;row++)for(let slot=0;slot<=size.modulesPerRow-width;slot++)if(!plan.modules.some(m=>m.building===buildingId&&inBoard(m,boardId)&&m.row===row&&m.slot<slot+width&&slot<m.slot+m.width))return {row,slot};
 return null;
}

export function boardDeleteIssue(plan:Plan,buildingId:string,boardId:string){
 if(!boardId)return 'A főelosztó nem törölhető, de átnevezhető.';
 if(plan.circuits.some(c=>c.building===buildingId&&inBoard(c,boardId))||plan.modules.some(m=>m.building===buildingId&&inBoard(m,boardId)))return 'Előbb töröld vagy helyezd át az elosztó áramköreit és készülékeit.';
 if(plan.buildings.find(b=>b.id===buildingId)?.floors.some(f=>f.devices.some(d=>d.kind==='panel'&&inBoard(d,boardId))))return 'Az elosztóhoz alaprajzi jel tartozik. Előbb módosítsd a jel elosztó-hozzárendelését.';
 return null;
}
export function circuitBoardIssue(plan:Plan,circuitId:string,boardId:string){
 const c=plan.circuits.find(c=>c.id===circuitId),b=plan.buildings.find(b=>b.id===c?.building);
 if(!c||!b||!boards(b).some(b=>b.id===boardId))return 'Az áramkör vagy az elosztó nem található.';
 if(inBoard(c,boardId))return null;
 if(plan.modules.some(m=>m.circuit===circuitId)||plan.boardWires.some(w=>[w.from,w.to].some(e=>e.kind==='circuit'&&e.id===circuitId)))return 'Áthelyezés előtt bontsd az áramkör bekötéseit és készülék-hozzárendeléseit. Az alaprajzi szerelvények megmaradnak.';
 return null;
}
export function moveModule(plan:Plan,moduleId:string,boardId:string){
 const m=plan.modules.find(m=>m.id===moduleId),b=plan.buildings.find(b=>b.id===m?.building);
 if(!m||!b||!boards(b).some(v=>v.id===boardId))throw Error('A készülék vagy az elosztó nem található.');
 if(inBoard(m,boardId))return;
 if(m.circuit||plan.boardWires.some(w=>[w.from,w.to].some(e=>e.kind==='module'&&e.id===m.id)))throw Error('Áthelyezés előtt bontsd a készülék bekötéseit és áramkör-hozzárendelését.');
 const place=findModulePlace(plan,b.id,m.width,boardId);if(!place)throw Error('A célelosztóban nincs elegendő szabad modulhely.');
 Object.assign(m,{board:boardId,...place});
}
