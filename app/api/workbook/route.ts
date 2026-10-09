import {withDatabase} from '@/db/database';
import {accountFromHeaders,sameOrigin,privateHeaders as headers} from '@/lib/auth';
import {insertIgnore} from '@/lib/billing';
import {projectStates} from '@/lib/workbook-server';
import {CLIENT_LIMIT,TASK_LIMIT,WORKBOOK_BYTES,emptyWorkbook,validateWorkbook,workbookError,workbookViolation,projectStatus,type Workbook,type WorkbookViolation} from '@/lib/workbook';
export const dynamic='force-dynamic';
const SIGN_IN='Az ügyfél- és teendőkezeléshez jelentkezz be.',CONFLICT='Az ügyfél- és teendőlista egy másik ablakban megváltozott. Frissítsd a listát.';
const violations:Record<WorkbookViolation['code'],[number,string]>={PROJECT_INACTIVE:[409,'Archivált vagy lomtárban lévő projekthez nem adható és nem módosítható teendő vagy ügyfél. Előbb állítsd vissza a projektet a Projektek menüben.'],SUBSCRIPTION_REQUIRED:[402,'Ez a projekt az előfizetéshez tartozik: a teendői és az ügyfele az előfizetés megújításáig csak olvashatók (törölni lehet).'],SAVE_REQUIRED:[409,'A projektet előbb mentsd el, utána rendelhetsz hozzá ügyfelet és teendőt.']};
export async function GET(req:Request){
 if(req.headers.get('sec-fetch-site')==='cross-site')return Response.json({error:'Érvénytelen kérés.'},{status:403,headers});
 try{return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:SIGN_IN},{status:401,headers});
  const row=await db.first<{data:string;revision:number}>('SELECT data, revision FROM workbooks WHERE user_id = ?',[user.userId]);
  return Response.json({workbook:row?validateWorkbook(JSON.parse(row.data)):emptyWorkbook(),revision:row?.revision||0,userId:user.userId,projects:await projectStates(db,user),limits:{clients:CLIENT_LIMIT,tasks:TASK_LIMIT,bytes:WORKBOOK_BYTES}},{headers});
 })}catch(e){console.error('Workbook read failed',e instanceof Error?e.name:'Error');return Response.json({error:'Az ügyfelek és teendők most nem tölthetők be. Próbáld újra.'},{status:503,headers})}
}
export async function PUT(req:Request){
 try{const text=await req.text();if(new TextEncoder().encode(text).byteLength>WORKBOOK_BYTES)return Response.json({error:'Az ügyfél- és teendőlista legfeljebb 1 MB lehet. Töröld a régi, kész teendőket.',code:'TOO_LARGE'},{status:413,headers});
 return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:SIGN_IN},{status:401,headers});
  if(!sameOrigin(req))return Response.json({error:'Érvénytelen kérés.'},{status:403,headers});
  let raw:{workbook?:unknown;revision?:unknown;userId?:unknown},workbook:Workbook,revision:number;
  try{raw=JSON.parse(text);workbook=validateWorkbook(raw.workbook);if(typeof raw.revision!=='number'||!Number.isSafeInteger(raw.revision)||raw.revision<0)throw Error('revision');revision=raw.revision}catch(e){return Response.json({error:workbookError(e),code:'INVALID'},{status:400,headers})}
  if(raw.userId!==user.userId)return Response.json({error:'A bejelentkezett fiók megváltozott.',code:'ACCOUNT_CHANGED'},{status:409,headers});
  const row=await db.first<{data:string;revision:number}>('SELECT data, revision FROM workbooks WHERE user_id = ?',[user.userId]);
  if((row?.revision||0)!==revision)return Response.json({error:CONFLICT,code:'WORKBOOK_CONFLICT'},{status:409,headers});
  // Befagyasztás: új vagy módosított teendő/hozzárendelés csak saját, mentett, aktív és elérhető projekthez.
  const prev=row?validateWorkbook(JSON.parse(row.data)):emptyWorkbook(),projects=await projectStates(db,user);
  const v=workbookViolation(prev,workbook,projectStatus(projects));
  if(v){const [status,error]=violations[v.code];return Response.json({error,code:v.code,projectId:v.projectId},{status,headers})}
  const data=JSON.stringify(workbook),now=new Date().toISOString();
  const changed=revision>0?await db.run('UPDATE workbooks SET data = ?, updated_at = ?, revision = revision + 1 WHERE user_id = ? AND revision = ?',[data,now,user.userId,revision]):await db.run(insertIgnore(db,'INSERT INTO workbooks (user_id,data,revision,updated_at) VALUES (?,?,1,?)'),[user.userId,data,now]);
  if(!changed)return Response.json({error:CONFLICT,code:'WORKBOOK_CONFLICT'},{status:409,headers});
  return Response.json({workbook,revision:revision+1,userId:user.userId,projects},{headers});
 })}catch(e){console.error('Workbook save failed',e instanceof Error?e.name:'Error');return Response.json({error:'Nem sikerült menteni az ügyfeleket és teendőket. Próbáld újra.'},{status:503,headers})}
}
