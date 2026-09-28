import {z} from 'zod';
import {withDatabase} from '@/db/database';
import {accountFromHeaders,privateHeaders,sameOrigin} from '@/lib/auth';
import {billingEnv,insertIgnore,isAdmin} from '@/lib/billing';
import {mailConfig,publicOrigin} from '@/lib/account-email';
import {seal} from '@/lib/secrets';
export async function GET(req:Request){try{return await withDatabase(async db=>{if(!isAdmin(await accountFromHeaders(db,req.headers)))return Response.json({error:'Adminisztrátori jogosultság szükséges.'},{status:403,headers:privateHeaders});const {config,revision}=await mailConfig(db);return Response.json({enabled:config.enabled,from:config.from,keyConfigured:!!config.apiKey,revision,encryptionReady:/^[a-f0-9]{64}$/i.test(billingEnv().BILLING_ENCRYPTION_KEY||'')},{headers:privateHeaders})})}catch{return Response.json({error:'A levélküldés beállításai nem tölthetők be.'},{status:503,headers:privateHeaders})}}
export async function POST(req:Request){const raw=await req.text();if(!sameOrigin(req))return Response.json({error:'Érvénytelen kérés.'},{status:403,headers:privateHeaders});if(raw.length>4096)return Response.json({error:'Túl nagy kérés.'},{status:413,headers:privateHeaders});try{return await withDatabase(async db=>{
 if(!isAdmin(await accountFromHeaders(db,req.headers)))return Response.json({error:'Adminisztrátori jogosultság szükséges.'},{status:403,headers:privateHeaders});
 const data=z.object({enabled:z.boolean(),from:z.string().trim().max(254),apiKey:z.string().trim().max(500),revision:z.number().int().nonnegative()}).parse(JSON.parse(raw));
 const {config,revision}=await mailConfig(db);if(data.revision!==revision)return Response.json({error:'Másik ablakban módosult. Frissítsd az oldalt.'},{status:409,headers:privateHeaders});
 if(data.from&&!z.string().email().safeParse(data.from).success)throw Error();
 if(data.apiKey&&!/^re_[a-zA-Z0-9_-]+$/.test(data.apiKey))throw Error();
 const next={enabled:data.enabled,from:data.from,apiKey:data.apiKey||config.apiKey};
 if(next.enabled){if(!next.from||!next.apiKey)return Response.json({error:'A bekapcsoláshoz feladói cím és Resend API-kulcs szükséges.'},{status:400,headers:privateHeaders});publicOrigin()}
 const encrypted=await seal(next),now=new Date().toISOString();const changed=revision===0?await db.run(insertIgnore(db,'INSERT INTO mail_settings (id,data,revision,updated_at) VALUES (?,?,?,?)'),['resend',encrypted,1,now]):await db.run('UPDATE mail_settings SET data = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?',[encrypted,now,'resend',revision]);
 return Response.json(changed?{ok:true}:{error:'A beállítások megváltoztak. Frissítsd az oldalt.'},{status:changed?200:409,headers:privateHeaders});
 })}catch{return Response.json({error:'Nem sikerült menteni. Ellenőrizd a feladói címet, a kulcsot és a szerver titkosítási beállítását.'},{status:400,headers:privateHeaders})}}
