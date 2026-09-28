import {claimProject} from '@/lib/billing';
import {withDatabase,insertPlanSql} from '@/db/database';
import {validProjectId,projectKey} from '@/lib/projects';
import {validatePlan} from '@/lib/plan';
import {accountFromHeaders,sameOrigin} from '@/lib/auth';
const headers={'Cache-Control':'private, no-store','Vary':'Cookie'};
export async function GET(req:Request){
 try{return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);
  if(!user)return Response.json({error:'A mentett tervekhez jelentkezz be.'},{status:401,headers});
  const params=new URL(req.url).searchParams;
  if(params.get('list')==='1'){
   const prefix='account:'+user.userId;
   const nameSql=db.kind==='mysql'?"JSON_UNQUOTE(JSON_EXTRACT(data, '$.name'))":"json_extract(data, '$.name')";
   const rows=await db.all<{id:string;name:string;revision:number;updatedAt:string}>(`SELECT id, ${nameSql} AS name, revision, updated_at AS updatedAt FROM plans WHERE id = ? OR (id >= ? AND id < ?) ORDER BY updated_at DESC, id ASC`,[prefix,prefix+':project:',prefix+':project;']);
   return Response.json({projects:rows.map(r=>({...r,id:r.id===prefix?'default':r.id.slice((prefix+':project:').length)})),userId:user.userId},{headers});
  }
  const projectId=params.get('projectId')||'default';
  if(!validProjectId(projectId))return Response.json({error:'Érvénytelen projektazonosító.'},{status:400,headers});
  const legacy=params.get('legacy')==='1';
  // The old public shared plan stays read-only; copying it never changes a user's record.
  const row=await db.first<{data:string;revision:number}>('SELECT data, revision FROM plans WHERE id = ?',[legacy?'main':projectKey(user.userId,projectId)]);
  if(!legacy&&projectId!=='default'&&!row)return Response.json({error:'A projekt nem található.'},{status:404,headers});
  const old=!legacy&&!row?await db.first('SELECT id FROM plans WHERE id = ?',['main']):null;
  return Response.json({plan:row?JSON.parse(row.data):null,revision:legacy?0:row?.revision??0,projectId,userId:user.userId,legacyAvailable:!!old},{headers});
 })}catch(e){console.error('Load plan failed',e instanceof Error?e.name:'Error');return Response.json({error:'A tervadatbázis nem érhető el. Próbáld újra.'},{status:503,headers})}
}
export async function PUT(req:Request){
 try{const text=await req.text();if(text.length>2_000_000)return Response.json({error:'A terv túl nagy.'},{status:413,headers});
 return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);
  if(!user)return Response.json({error:'A mentéshez jelentkezz be újra. A nyitott terv megmaradt.'},{status:401,headers});
  if(!sameOrigin(req))return Response.json({error:'Érvénytelen kérés.'},{status:403,headers});
  let data;try{data=JSON.parse(text);data.plan=validatePlan(data.plan);data.projectId??='default';if(!validProjectId(data.projectId))throw Error();if(!Number.isInteger(data.revision)||data.revision<0)throw Error()}catch{return Response.json({error:'A terv adatai érvénytelenek.'},{status:400,headers})}
  if(data.userId!==user.userId)return Response.json({error:'A bejelentkezett fiók megváltozott. Exportáld a nyitott tervet, majd jelentkezz be újra.'},{status:409,headers});
  const rev=data.revision,now=new Date().toISOString(),key=projectKey(user.userId,data.projectId);
  if(rev===0&&!await db.first('SELECT id FROM plans WHERE id = ?',[key])&&!await claimProject(db,user,data.projectId))return Response.json({error:'Az első projekt ingyenes. Egy további projekthely egyszeri díja 3 490 Ft.',code:'PAYMENT_REQUIRED'},{status:402,headers});
  const result=rev===0?await db.run(insertPlanSql(db),[key,JSON.stringify(data.plan),now]):await db.run('UPDATE plans SET data = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?',[JSON.stringify(data.plan),now,key,rev]);
  if(result===0)return Response.json({error:'A terv egy másik ablakban módosult. Exportáld a munkádat, majd töltsd újra az oldalt.'},{status:409,headers});
  return Response.json({revision:rev+1,projectId:data.projectId,userId:user.userId},{headers});
 })}catch(e){console.error('Save plan failed',e instanceof Error?e.name:'Error');return Response.json({error:'Nem sikerült menteni. A módosítások a nyitott oldalon megmaradtak.'},{status:503,headers})}
}
