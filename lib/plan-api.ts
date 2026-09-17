import {planDb} from '@/db/plan-store';
import {validatePlan} from '@/lib/plan';
import {getChatGPTUser} from '@/app/chatgpt-auth';
const headers={'Cache-Control':'private, no-store','Vary':'Cookie'};
export async function GET(req:Request){
 try{
  const user=await getChatGPTUser();
  if(!user)return Response.json({error:'A mentett tervekhez jelentkezz be.'},{status:401,headers});
  const db=planDb(),legacy=new URL(req.url).searchParams.get('legacy')==='1';
  // The old public shared plan stays read-only; copying it never changes a user's record.
  const row=await db.prepare('SELECT data, revision FROM plans WHERE id = ?').bind(legacy?'main':'user:'+user.userId).first<{data:string;revision:number}>();
  const old=!legacy&&!row?await db.prepare('SELECT id FROM plans WHERE id = ?').bind('main').first():null;
  return Response.json({plan:row?JSON.parse(row.data):null,revision:legacy?0:row?.revision??0,userId:user.userId,legacyAvailable:!!old},{headers});
 }catch(e){console.error('Load plan',e);return Response.json({error:'A tervadatbázis nem érhető el. Próbáld újra.'},{status:503,headers})}
}
export async function PUT(req:Request){
 try{
  const user=await getChatGPTUser();
  if(!user)return Response.json({error:'A mentéshez jelentkezz be újra. A nyitott terv megmaradt.'},{status:401,headers});
  const origin=req.headers.get('origin');
  if(origin&&origin!==new URL(req.url).origin)return Response.json({error:'Érvénytelen kérés.'},{status:403,headers});
  const text=await req.text();if(text.length>2_000_000)return Response.json({error:'A terv túl nagy.'},{status:413,headers});
  let data;try{data=JSON.parse(text);data.plan=validatePlan(data.plan);if(!Number.isInteger(data.revision)||data.revision<0)throw Error()}catch{return Response.json({error:'A terv adatai érvénytelenek.'},{status:400,headers})}
  if(data.userId!==user.userId)return Response.json({error:'A bejelentkezett fiók megváltozott. Exportáld a nyitott tervet, majd jelentkezz be újra.'},{status:409,headers});
  const rev=data.revision,now=new Date().toISOString(),db=planDb(),key='user:'+user.userId;
  const result=rev===0?await db.prepare('INSERT INTO plans (id,data,revision,updated_at) VALUES (?,?,1,?) ON CONFLICT(id) DO NOTHING').bind(key,JSON.stringify(data.plan),now).run():await db.prepare('UPDATE plans SET data = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?').bind(JSON.stringify(data.plan),now,key,rev).run();
  if(result.meta.changes===0)return Response.json({error:'A terv egy másik ablakban módosult. Exportáld a munkádat, majd töltsd újra az oldalt.'},{status:409,headers});
  return Response.json({revision:rev+1,userId:user.userId},{headers});
 }catch(e){console.error('Save plan',e);return Response.json({error:'Nem sikerült menteni. A módosítások a nyitott oldalon megmaradtak.'},{status:503,headers})}
}
