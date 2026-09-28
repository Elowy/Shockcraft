import {z} from 'zod';
import {withDatabase} from '@/db/database';
import {accountFromHeaders,allowAttempt,privateHeaders,sameOrigin,sessionCookie} from '@/lib/auth';
import {consumeAccountLink,mailConfig,mailReady,sendAccountLink,type MailUser} from '@/lib/account-email';
export const dynamic='force-dynamic';
const generic='Ha ehhez az e-mail-címhez tartozik fiók, elküldjük a visszaállító linket. Nézd meg a levélszemét mappát is. Új levelet egy perc múlva kérhetsz.';
const badLink='A hivatkozás érvénytelen, lejárt vagy már felhasználtad. Kérj új levelet.';
export async function GET(req:Request){try{return await withDatabase(async db=>{const user=await accountFromHeaders(db,req.headers);const {config}=await mailConfig(db);return Response.json({ready:mailReady(config),verified:user?.emailVerified??false},{headers:privateHeaders})})}catch{return Response.json({error:'A fiók állapota nem tölthető be.'},{status:503,headers:privateHeaders})}}
export async function POST(req:Request){
 const raw=await req.text();if(raw.length>4096)return Response.json({error:'Túl nagy kérés.'},{status:413,headers:privateHeaders});
 if(!sameOrigin(req))return Response.json({error:'Érvénytelen kérés.'},{status:403,headers:privateHeaders});
 const action=new URL(req.url).pathname.split('/').pop();
 try{return await withDatabase(async db=>{
  let data;try{data=JSON.parse(raw)}catch{return Response.json({error:'Hibás adatok.'},{status:400,headers:privateHeaders})}
  if(action==='forgot'||action==='resend'){
   const account=action==='resend'?await accountFromHeaders(db,req.headers):null;
   if(action==='resend'&&!account)return Response.json({error:'Jelentkezz be újra.'},{status:401,headers:privateHeaders});
   const email=z.string().trim().toLowerCase().email().max(254).safeParse(account?.email??data.email);
   if(!email.success)return Response.json({error:'Adj meg érvényes e-mail-címet.'},{status:400,headers:privateHeaders});
   if(!await allowAttempt(db,req,'mail:'+action+':'+email.data,3,30))return Response.json({error:'Túl sok levélkérés. Próbáld újra 15 perc múlva.'},{status:429,headers:{...privateHeaders,'Retry-After':'900'}});
   const {config}=await mailConfig(db);if(!mailReady(config))return Response.json({error:'A levélküldés még nincs beállítva. Kérjük, próbáld újra később.'},{status:503,headers:privateHeaders});
   const user=await db.first<MailUser>('SELECT id,email,auth_version,email_verified_at FROM users WHERE email = ?',[email.data]);
   if(action==='resend'&&user?.email_verified_at!==null&&user)return Response.json({message:'Az e-mail-címed már megerősítetted.',verified:true},{headers:privateHeaders});
   if(user){try{const sent=await sendAccountLink(db,user,action==='forgot'?'reset':'verify',config);if(action==='resend')return Response.json({message:sent?'A megerősítő levelet átadtuk a levélküldőnek. Nézd meg a postaládádat és a levélszemét mappát is.':'Az előző levél után várj egy percet az újraküldéssel.'},{headers:privateHeaders})}catch{console.error('Account email delivery failed');if(action==='resend')return Response.json({error:'A levelet nem sikerült elküldeni. Próbáld újra később.'},{status:503,headers:privateHeaders})}}
   // Same response for unknown addresses and failed delivery: never reveal account membership.
   return Response.json({message:generic},{headers:privateHeaders});
  }
  if(action==='verify'||action==='reset'){
   const input=z.object({token:z.string().regex(/^[a-f0-9]{64}$/),password:z.string().max(256).optional()}).safeParse(data);
   if(!input.success)return Response.json({error:badLink},{status:400,headers:privateHeaders});
   if(!await allowAttempt(db,req,'token:'+input.data.token,12,40))return Response.json({error:'Túl sok próbálkozás. Próbáld újra később.'},{status:429,headers:privateHeaders});
   if(!await consumeAccountLink(db,input.data.token,action,input.data.password))return Response.json({error:badLink},{status:400,headers:privateHeaders});
   return Response.json({message:action==='reset'?'A jelszavad megváltozott. Jelentkezz be az új jelszóval.':'Az e-mail-címedet megerősítetted.'},{headers:{...privateHeaders,...(action==='reset'?{'Set-Cookie':sessionCookie(req.headers.get('host')||'','',0)}:{})}});
  }
  return Response.json({error:'Ismeretlen művelet.'},{status:404,headers:privateHeaders});
 })}catch{return Response.json({error:'A művelet nem sikerült. Ellenőrizd az adatokat, majd próbáld újra.'},{status:400,headers:privateHeaders})}
}
