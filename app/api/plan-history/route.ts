import {withDatabase} from '@/db/database';
import {accountFromHeaders,sameOrigin,privateHeaders as headers} from '@/lib/auth';
import {projectAccess} from '@/lib/billing';
import {projectKey,validProjectId} from '@/lib/projects';
import {validatePlan} from '@/lib/plan';
import {saveWithHistory,HISTORY_LIMIT,type PlanVersion} from '@/lib/plan-versions';
export const dynamic='force-dynamic';
export async function GET(req:Request){
 try{return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:'Jelentkezz be a tervelőzményekhez.'},{status:401,headers});
  const id=new URL(req.url).searchParams.get('projectId');if(!validProjectId(id))return Response.json({error:'Érvénytelen projektazonosító.'},{status:400,headers});
  const key=projectKey(user.userId,id),nameSql=db.kind==='mysql'?"JSON_UNQUOTE(JSON_EXTRACT(data, '$.name'))":"json_extract(data, '$.name')";
  const current=await db.first<PlanVersion&{state:string}>(`SELECT revision, ${nameSql} AS name, updated_at AS savedAt, state FROM plans WHERE id = ?`,[key]);
  if(!current)return Response.json({error:'A projekt nem található.'},{status:404,headers});
  if(current.state!=='active')return Response.json({error:'Előbb állítsd vissza a projektet az Aktív listába.'},{status:409,headers});
  if(!await projectAccess(db,user,key))return Response.json({error:'A projekt előzményeihez is aktív előfizetés szükséges.'},{status:402,headers});
  const versions=await db.all<PlanVersion>(`SELECT revision, ${nameSql} AS name, saved_at AS savedAt FROM plan_versions WHERE project_id = ? ORDER BY revision DESC LIMIT ${HISTORY_LIMIT}`,[key]);
  return Response.json({projectId:id,userId:user.userId,current,versions,limit:HISTORY_LIMIT},{headers});
 })}catch{return Response.json({error:'A tervelőzmények nem tölthetők be. Próbáld újra.'},{status:503,headers})}
}
export async function POST(req:Request){
 try{const text=await req.text();if(text.length>4000)return Response.json({error:'A kérés túl nagy.'},{status:413,headers});
 return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:'Jelentkezz be a visszaállításhoz.'},{status:401,headers});
  if(!sameOrigin(req))return Response.json({error:'Érvénytelen kérés.'},{status:403,headers});
  let data;try{data=JSON.parse(text);if(!validProjectId(data.projectId)||!Number.isSafeInteger(data.revision)||data.revision<1||!Number.isSafeInteger(data.version)||data.version<1)throw Error()}catch{return Response.json({error:'Érvénytelen verzióazonosító.'},{status:400,headers})}
  if(data.userId!==user.userId)return Response.json({error:'A bejelentkezett fiók megváltozott.'},{status:409,headers});
  const key=projectKey(user.userId,data.projectId),current=await db.first<{revision:number;state:string}>('SELECT revision,state FROM plans WHERE id = ?',[key]);
  if(!current)return Response.json({error:'A projekt nem található.'},{status:404,headers});
  if(current.state!=='active')return Response.json({error:'Előbb állítsd vissza a projektet az Aktív listába.'},{status:409,headers});
  if(!await projectAccess(db,user,key))return Response.json({error:'A projekt visszaállításához újítsd meg az előfizetést.'},{status:402,headers});
  if(current.revision!==data.revision)return Response.json({error:'A projekt közben megváltozott. Nyisd meg újra a mentett projektet.'},{status:409,headers});
  const snapshot=await db.first<{data:string}>('SELECT data FROM plan_versions WHERE project_id = ? AND revision = ?',[key,data.version]);
  if(!snapshot)return Response.json({error:'Ez a korábbi változat már nem érhető el. Frissítsd a listát.'},{status:404,headers});
  const plan=validatePlan(JSON.parse(snapshot.data));
  if(!await saveWithHistory(db,key,JSON.stringify(plan),data.revision,new Date().toISOString()))return Response.json({error:'A projekt közben megváltozott. Nyisd meg újra a mentett projektet.'},{status:409,headers});
  return Response.json({projectId:data.projectId,userId:user.userId,plan,revision:data.revision+1},{headers});
 })}catch{return Response.json({error:'Nem sikerült visszaállítani. Ellenőrizd a projekt aktuális állapotát.'},{status:503,headers})}
}
