import {withDatabase,insertPlanSql} from '@/db/database';
import {validatePlan} from '@/lib/plan';
import {accountFromHeaders,sameOrigin} from '@/lib/auth';
const headers={'Cache-Control':'private, no-store','Vary':'Cookie'};
export async function GET(req:Request){
 try{return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);
  if(!user)return Response.json({error:'A mentett tervekhez jelentkezz be.'},{status:401,headers});
  const legacy=new URL(req.url).searchParams.get('legacy')==='1';
  // The old public shared plan stays read-only; copying it never changes a user's record.
  const row=await db.first<{data:string;revision:number}>('SELECT data, revision FROM plans WHERE id = ?',[legacy?'main':'account:'+user.userId]);
  const old=!legacy&&!row?await db.first('SELECT id FROM plans WHERE id = ?',['main']):null;
  return Response.json({plan:row?JSON.parse(row.data):null,revision:legacy?0:row?.revision??0,userId:user.userId,legacyAvailable:!!old},{headers});
 })}catch(e){console.error('Load plan failed',e instanceof Error?e.name:'Error');return Response.json({error:'A tervadatbázis nem érhető el. Próbáld újra.'},{status:503,headers})}
}
export async function PUT(req:Request){
 try{const text=await req.text();if(text.length>2_000_000)return Response.json({error:'A terv túl nagy.'},{status:413,headers});
 return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);
  if(!user)return Response.json({error:'A mentéshez jelentkezz be újra. A nyitott terv megmaradt.'},{status:401,headers});
  if(!sameOrigin(req))return Response.json({error:'Érvénytelen kérés.'},{status:403,headers});
  let data;try{data=JSON.parse(text);data.plan=validatePlan(data.plan);if(!Number.isInteger(data.revision)||data.revision<0)throw Error()}catch{return Response.json({error:'A terv adatai érvénytelenek.'},{status:400,headers})}
  if(data.userId!==user.userId)return Response.json({error:'A bejelentkezett fiók megváltozott. Exportáld a nyitott tervet, majd jelentkezz be újra.'},{status:409,headers});
  const rev=data.revision,now=new Date().toISOString(),key='account:'+user.userId;
  const result=rev===0?await db.run(insertPlanSql(db),[key,JSON.stringify(data.plan),now]):await db.run('UPDATE plans SET data = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?',[JSON.stringify(data.plan),now,key,rev]);
  if(result===0)return Response.json({error:'A terv egy másik ablakban módosult. Exportáld a munkádat, majd töltsd újra az oldalt.'},{status:409,headers});
  return Response.json({revision:rev+1,userId:user.userId},{headers});
 })}catch(e){console.error('Save plan failed',e instanceof Error?e.name:'Error');return Response.json({error:'Nem sikerült menteni. A módosítások a nyitott oldalon megmaradtak.'},{status:503,headers})}
}
