import {withDatabase} from '@/db/database';
import {accountFromHeaders,sameOrigin,privateHeaders as headers} from '@/lib/auth';
import {exportAccess} from '@/lib/billing';
import {publicOrigin} from '@/lib/account-email';
import {validProjectId} from '@/lib/projects';
import {SHARE_PROJECT_LIMIT,shareCreateSchema,shareInputError,shareLink,shareRevokeSchema} from '@/lib/share';
import {createShare,listShares,projectShareStatus,revokeShares,type CreateShareResult} from '@/lib/share-server';
export const dynamic='force-dynamic';
// Tulajdonosi megosztáskezelés: a projektkulcsot mindig a munkamenetből számoljuk, nyers kulcsot vagy owner-id-t a kliens nem küldhet.
const SIGN_IN='A megosztáshoz jelentkezz be.',FORBIDDEN='Érvénytelen kérés.',UNAVAILABLE='A megosztás most nem érhető el. Próbáld újra.';
const ACCOUNT_CHANGED={code:'ACCOUNT_CHANGED',error:'A bejelentkezett fiók megváltozott. Frissítsd az oldalt.'};
const failures:Record<Exclude<CreateShareResult,{ok:true}>['code'],[number,string]>={
 RATE_LIMITED:[429,'Túl sok megosztási kérés. Próbáld újra 15 perc múlva.'],
 SAVE_REQUIRED:[409,'Előbb mentsd a projektet. A link mindig a szerverre mentett változatot mutatja.'],
 PROJECT_INACTIVE:[409,'Archivált vagy lomtárban lévő projekt nem osztható meg. Előbb állítsd vissza a Projektek menüben.'],
 SUBSCRIPTION_REQUIRED:[402,'Ez a projekt az előfizetéshez tartozik. A megosztáshoz újítsd meg az előfizetést.'],
 EXPORT_REQUIRED:[402,'Ennél a projektnél a PDF-letöltés engedélyezéséhez aktív havi előfizetés szükséges. Letöltés nélküli link előfizetés nélkül is készíthető.'],
 SHARE_LIMIT:[409,'Egy projekthez legfeljebb 10 érvényes link tartozhat. Előbb vonj vissza egy régit.'],
};
const failed=(e:unknown)=>{console.error('Plan share failed',e instanceof Error?e.name:'Error');return Response.json({error:UNAVAILABLE},{status:503,headers})};
export async function GET(req:Request){
 if(req.headers.get('sec-fetch-site')==='cross-site')return Response.json({error:FORBIDDEN},{status:403,headers});
 try{return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:SIGN_IN},{status:401,headers});
  const projectId=new URL(req.url).searchParams.get('projectId')||'';
  if(!validProjectId(projectId))return Response.json({error:'Érvénytelen projektazonosító.',code:'INVALID'},{status:400,headers});
  const status=await projectShareStatus(db,user,projectId);
  const canPdf=status==='active'&&(await exportAccess(db,user,projectId)).allowed;
  return Response.json({userId:user.userId,projectId,status,canPdf,limit:SHARE_PROJECT_LIMIT,shares:await listShares(db,user,projectId)},{headers});
 })}catch(e){return failed(e)}
}
export async function POST(req:Request){
 try{const raw=await req.text();if(raw.length>2000)return Response.json({code:'TOO_LARGE',error:'Túl nagy kérés.'},{status:413,headers});
 return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:SIGN_IN},{status:401,headers});
  if(!sameOrigin(req))return Response.json({error:FORBIDDEN},{status:403,headers});
  let data;try{data=shareCreateSchema.parse(JSON.parse(raw))}catch(e){return Response.json({code:'INVALID',error:shareInputError(e)},{status:400,headers})}
  if(data.userId!==user.userId)return Response.json(ACCOUNT_CHANGED,{status:409,headers});
  // Az oldal címe a beszúrás előtt: hibás beállításnál nem marad árva, soha meg nem jelenő link.
  let origin:string;try{origin=publicOrigin()}catch{console.error('Plan share failed: APP_ORIGIN is missing or invalid');return Response.json({error:UNAVAILABLE},{status:503,headers})}
  const result=await createShare(db,user,{projectId:data.projectId,label:data.label,days:data.days,allowPdf:data.allowPdf});
  if(!result.ok){const [status,error]=failures[result.code];return Response.json({code:result.code,error},{status,headers:result.code==='RATE_LIMITED'?{...headers,'Retry-After':'900'}:headers})}
  // A nyers token csak ebben a válaszban szerepel, egyszer.
  return Response.json({userId:user.userId,projectId:data.projectId,link:shareLink(origin,result.token),share:result.share},{headers});
 })}catch(e){return failed(e)}
}
export async function DELETE(req:Request){
 try{const raw=await req.text();if(raw.length>1000)return Response.json({code:'TOO_LARGE',error:'Túl nagy kérés.'},{status:413,headers});
 return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:SIGN_IN},{status:401,headers});
  if(!sameOrigin(req))return Response.json({error:FORBIDDEN},{status:403,headers});
  let data;try{data=shareRevokeSchema.parse(JSON.parse(raw))}catch(e){return Response.json({code:'INVALID',error:shareInputError(e)},{status:400,headers})}
  if(data.userId!==user.userId)return Response.json(ACCOUNT_CHANGED,{status:409,headers});
  const removed=await revokeShares(db,user,data.projectId,data.id||null);
  if(data.id&&!removed)return Response.json({code:'NOT_FOUND',error:'A link már nem létezik.'},{status:404,headers});
  return Response.json({userId:user.userId,projectId:data.projectId,removed},{headers});
 })}catch(e){return failed(e)}
}
