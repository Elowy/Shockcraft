import {validateWorkbook,WORKBOOK_BYTES,type ProjectStateRow,type Workbook} from './workbook';
export class WorkbookError extends Error{status:number;code?:string;constructor(message:string,status:number,code?:string){super(message);this.status=status;this.code=code}}
export type WorkbookResponse={workbook:Workbook;revision:number;userId:string;projects:ProjectStateRow[]};
async function call(init:RequestInit,userId:string):Promise<WorkbookResponse>{
 let r:Response;try{r=await fetch('/api/workbook',{cache:'no-store',signal:AbortSignal.timeout(15000),...init})}catch{throw new WorkbookError('A szerver nem érhető el. Ellenőrizd az internetkapcsolatot, és próbáld újra.',0)}
 const d=await r.json().catch(()=>({})) as Partial<WorkbookResponse>&{error?:string;code?:string};
 if(!r.ok)throw new WorkbookError(d.error||'A művelet nem sikerült.',r.status,d.code);
 if(d.userId!==userId)throw new WorkbookError('A bejelentkezett fiók megváltozott. Frissítsd az oldalt.',409,'ACCOUNT_CHANGED');
 return {revision:d.revision||0,userId:d.userId,projects:d.projects||[],workbook:validateWorkbook(d.workbook)};
}
export const fetchWorkbook=(userId:string)=>call({},userId);
export function saveWorkbook(userId:string,workbook:Workbook,revision:number){
 const body=JSON.stringify({workbook,revision,userId});
 if(new TextEncoder().encode(body).byteLength>WORKBOOK_BYTES)return Promise.reject(new WorkbookError('Az ügyfél- és teendőlista legfeljebb 1 MB lehet. Töröld a régi, kész teendőket.',413,'TOO_LARGE'));
 return call({method:'PUT',headers:{'Content-Type':'application/json'},body},userId);
}
