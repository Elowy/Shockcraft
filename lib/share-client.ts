import {validatePlan} from './plan';
import type {ShareProjectStatus,ShareSummary,SharedView} from './share';

export class ShareError extends Error{status:number;code?:string;constructor(message:string,status:number,code?:string){super(message);this.status=status;this.code=code}}
export type SharesResponse={userId:string;projectId:string;status:ShareProjectStatus;canPdf:boolean;limit:number;shares:ShareSummary[]};
export type CreatedShare={userId:string;projectId:string;link:string;share:ShareSummary};
type Failure={error?:string;code?:string};
const OFFLINE='A szerver nem érhető el. Ellenőrizd az internetkapcsolatot, és próbáld újra.';
async function call<T>(url:string,init:RequestInit):Promise<T>{
 let r:Response;try{r=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(15000),...init})}catch{throw new ShareError(OFFLINE,0)}
 const d=await r.json().catch(()=>({})) as Partial<T>&Failure;
 if(!r.ok)throw new ShareError(d.error||'A művelet nem sikerült.',r.status,d.code);
 return d as T;
}
// Tulajdonosi hívások: a válasznak ugyanarra a fiókra és projektre kell vonatkoznia.
function owned<T extends {userId:string;projectId:string}>(d:T,userId:string,projectId:string){if(d.userId!==userId||d.projectId!==projectId)throw new ShareError('A bejelentkezett fiók vagy a projekt megváltozott. Frissítsd az oldalt.',409,'ACCOUNT_CHANGED');return d}
const json=(method:string,body:unknown):RequestInit=>({method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
export async function fetchShares(userId:string,projectId:string){return owned(await call<SharesResponse>('/api/plan-share?projectId='+encodeURIComponent(projectId),{}),userId,projectId)}
export async function createShare(userId:string,projectId:string,input:{label:string;days:number;allowPdf:boolean}){return owned(await call<CreatedShare>('/api/plan-share',json('POST',{projectId,userId,...input})),userId,projectId)}
export async function revokeShare(userId:string,projectId:string,target:{id:string}|{all:true}){return owned(await call<{userId:string;projectId:string;removed:number}>('/api/plan-share',json('DELETE',{projectId,userId,...target})),userId,projectId)}

// Nyilvános hívások: munkamenet-süti és Referer nélkül, a token csak a POST törzsében utazik.
const shared=(token:string,purpose:'view'|'pdf'):RequestInit=>({method:'POST',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,purpose})});
export async function openSharedPlan(token:string):Promise<SharedView>{
 const d=await call<SharedView>('/api/shared-plan',shared(token,'view'));
 return {plan:validatePlan(d.plan),updatedAt:String(d.updatedAt||''),expiresAt:Number(d.expiresAt)||0,pdf:d.pdf===true,backgroundFloors:Array.isArray(d.backgroundFloors)?d.backgroundFloors.filter((v):v is string=>typeof v==='string'):[]};
}
// Fail closed: hálózati hiba vagy nem 200-as válasz esetén nincs letöltés.
export async function checkSharedPdf(token:string):Promise<{allowed:boolean;error?:string}>{
 try{const d=await call<{pdf?:boolean}>('/api/shared-plan',shared(token,'pdf'));return d.pdf===true?{allowed:true}:{allowed:false,error:'A letöltés most nem érhető el.'}}
 catch(e){return {allowed:false,error:e instanceof Error?e.message:'A letöltés most nem érhető el.'}}
}
