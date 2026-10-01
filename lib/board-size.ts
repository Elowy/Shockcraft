import type {Plan} from './plan';
export type BoardSize={rows:number;modulesPerRow:number};
export const DEFAULT_BOARD:BoardSize={rows:4,modulesPerRow:18};
export const MAX_BOARD_ROWS=12,MAX_BOARD_COLUMNS=36;
export function boardSize(building?:{board?:BoardSize}):BoardSize{return building?.board??DEFAULT_BOARD}
export function boardSizeIssue(plan:Plan,buildingId:string,size:BoardSize){
 if(!Number.isInteger(size.rows)||size.rows<1||size.rows>MAX_BOARD_ROWS||!Number.isInteger(size.modulesPerRow)||size.modulesPerRow<1||size.modulesPerRow>MAX_BOARD_COLUMNS)return '1–12 sor és soronként 1–36 modulhely adható meg.';
 if(!plan.buildings.some(b=>b.id===buildingId))return 'Az épület nem található.';
 const outside=plan.modules.filter(m=>m.building===buildingId&&(m.row>=size.rows||m.slot+m.width>size.modulesPerRow));
 if(outside.length)return `${outside.length} készülék kilógna az új elosztóból (${outside.slice(0,3).map(m=>m.name).join(', ')}). Előbb helyezd át őket, vagy válassz nagyobb méretet.`;
 return null;
}
export function findModulePlace(plan:Plan,buildingId:string,width:number){
 const size=boardSize(plan.buildings.find(b=>b.id===buildingId));
 for(let row=0;row<size.rows;row++)for(let slot=0;slot<=size.modulesPerRow-width;slot++)if(!plan.modules.some(m=>m.building===buildingId&&m.row===row&&m.slot<slot+width&&slot<m.slot+m.width))return {row,slot};
 return null;
}
