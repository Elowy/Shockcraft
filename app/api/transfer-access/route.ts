import {withDatabase} from '@/db/database';
import {accountFromHeaders,privateHeaders} from '@/lib/auth';
import {getBillingConfig,isAdmin} from '@/lib/billing';
import {subscriptionStatus} from '@/lib/subscription-access';

export const dynamic='force-dynamic';
export async function GET(req:Request){
 try{return await withDatabase(async db=>{
  const account=await accountFromHeaders(db,req.headers);
  if(!account)return Response.json({error:'Az importáláshoz és exportáláshoz jelentkezz be újra.'},{status:401,headers:privateHeaders});
  const {config}=await getBillingConfig(db);
  const subscription=await subscriptionStatus(db,account.userId,isAdmin(account)?config.mode:'live');
  if(!subscription.active)return Response.json({error:'Az importálás és exportálás aktív havi előfizetéssel használható.',code:'SUBSCRIPTION_REQUIRED'},{status:402,headers:privateHeaders});
  return Response.json({userId:account.userId,paidUntil:subscription.paidUntil},{headers:privateHeaders});
 })}catch{return Response.json({error:'Az előfizetés most nem ellenőrizhető. Próbáld újra.'},{status:503,headers:privateHeaders})}
}
