import {withDatabase} from '@/db/database';
import {accountFromHeaders,privateHeaders} from '@/lib/auth';
import {exportAccess,getBillingConfig,isAdmin} from '@/lib/billing';
import {validProjectId} from '@/lib/projects';
import {subscriptionStatus} from '@/lib/subscription-access';

const exportErrors={
 PROJECT_INACTIVE:{status:409,error:'A projekt archivált vagy a lomtárban van. Állítsd vissza a Projektek menüben.'},
 SAVE_REQUIRED:{status:409,error:'Előbb mentsd a projektet. Az ingyenes vagy egyszer megvásárolt projekt mentés után előfizetés nélkül is exportálható.'},
 SUBSCRIPTION_REQUIRED:{status:402,error:'Ennek a projektnek az exportálása aktív havi előfizetéssel használható.'}
} as const;
export const dynamic='force-dynamic';
// purpose=export&projectId=… checks one owned project; without it the monthly-only import rule applies.
export async function GET(req:Request){
 try{return await withDatabase(async db=>{
  const account=await accountFromHeaders(db,req.headers);
  if(!account)return Response.json({error:'Az importáláshoz és exportáláshoz jelentkezz be újra.'},{status:401,headers:privateHeaders});
  const params=new URL(req.url).searchParams;
  if(params.get('purpose')==='export'){
   const projectId=params.get('projectId')||'';
   if(!validProjectId(projectId))return Response.json({error:'Érvénytelen projektazonosító.'},{status:400,headers:privateHeaders});
   const access=await exportAccess(db,account,projectId);
   if(!access.allowed){const e=exportErrors[access.code];return Response.json({error:e.error,code:access.code},{status:e.status,headers:privateHeaders})}
   return Response.json({userId:account.userId,projectId,export:true,via:access.via},{headers:privateHeaders});
  }
  const {config}=await getBillingConfig(db);
  const subscription=await subscriptionStatus(db,account.userId,isAdmin(account)?config.mode:'live');
  if(!subscription.active)return Response.json({error:'Az importálás aktív havi előfizetéssel használható.',code:'SUBSCRIPTION_REQUIRED'},{status:402,headers:privateHeaders});
  return Response.json({userId:account.userId,paidUntil:subscription.paidUntil},{headers:privateHeaders});
 })}catch{return Response.json({error:'A jogosultság most nem ellenőrizhető. Próbáld újra.'},{status:503,headers:privateHeaders})}
}
