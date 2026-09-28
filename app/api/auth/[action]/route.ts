import {mailConfig,mailReady,sendAccountLink} from '@/lib/account-email';
import {z} from 'zod';
import {withDatabase} from '@/db/database';
import {allowAttempt,digest,hashPassword,makeSession,passwordValid,privateHeaders,readToken,sameOrigin,sessionCookie,verifyPassword} from '@/lib/auth';
export const dynamic='force-dynamic';
const credentials=z.object({email:z.string().trim().toLowerCase().email().max(254),password:z.string().max(256),name:z.string().trim().min(1).max(100).optional()});
export async function POST(req:Request){
  const raw=await req.text();
  if(raw.length>4096)return Response.json({error:'Túl nagy kérés.'},{status:413,headers:privateHeaders});
  if(!sameOrigin(req))return Response.json({error:'Érvénytelen kérés. Frissítsd az oldalt.'},{status:403,headers:privateHeaders});
  const action=new URL(req.url).pathname.split('/').pop();
  if(!['login','register','logout'].includes(action||''))return Response.json({error:'Ismeretlen művelet.'},{status:404,headers:privateHeaders});
  try{return await withDatabase(async db=>{
    if(action==='logout'){const token=readToken(req.headers);if(token)await db.run('DELETE FROM sessions WHERE token_hash = ?',[await digest(token)]);return Response.json({ok:true},{headers:{...privateHeaders,'Set-Cookie':sessionCookie(req.headers.get('host')||'','',0)}})}
    let data;try{data=credentials.parse(JSON.parse(raw))}catch{return Response.json({error:'Adj meg érvényes e-mail-címet és jelszót.'},{status:400,headers:privateHeaders})}
    if(!await allowAttempt(db,req,data.email))return Response.json({error:'Túl sok próbálkozás. Próbáld újra 15 perc múlva.'},{status:429,headers:{...privateHeaders,'Retry-After':'900'}});
    if(!passwordValid(data.password))return Response.json({error:action==='register'?'A jelszó legalább 12 karakter, legfeljebb 72 bájt lehet.':'Hibás e-mail-cím vagy jelszó.'},{status:400,headers:privateHeaders});
    let user=await db.first<{id:string;email:string;name:string;password_hash:string;auth_version:number;email_verified_at:number|null}>('SELECT id,email,name,password_hash,auth_version,email_verified_at FROM users WHERE email = ?',[data.email]);
    if(action==='register'){
      if(!data.name)return Response.json({error:'Add meg a nevedet.'},{status:400,headers:privateHeaders});
      if(user)return Response.json({error:'Ezzel az e-mail-címmel már létezik fiók. Jelentkezz be.'},{status:409,headers:privateHeaders});
      const id=crypto.randomUUID(),passwordHash=await hashPassword(data.password);
      try{await db.run('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)',[id,data.email,data.name,passwordHash,Date.now()])}catch(e){if(await db.first('SELECT id FROM users WHERE email = ?',[data.email]))return Response.json({error:'Ezzel az e-mail-címmel már létezik fiók.'},{status:409,headers:privateHeaders});throw e}
      user={id,email:data.email,name:data.name,password_hash:passwordHash,auth_version:0,email_verified_at:null};
      try{const {config}=await mailConfig(db);if(mailReady(config))await sendAccountLink(db,user,'verify',config)}catch{console.error('Registration email delivery failed')}
    }else if(!await verifyPassword(data.password,user?.password_hash)||!user)return Response.json({error:'Hibás e-mail-cím vagy jelszó.'},{status:401,headers:privateHeaders});
    const cookie=await makeSession(db,user.id,req.headers,user.auth_version);
    return Response.json({account:{userId:user.id,displayName:user.name,email:user.email,emailVerified:user.email_verified_at!==null}},{headers:{...privateHeaders,'Set-Cookie':cookie}});
  })}catch(e){console.error('Account operation failed',e instanceof Error?e.name:'Error');return Response.json({error:'A fiókadatbázis nem érhető el. Próbáld újra később.'},{status:503,headers:privateHeaders})}
}
