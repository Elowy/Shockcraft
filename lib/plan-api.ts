import {claimProject,projectAccess,projectAccessChecker} from '@/lib/billing';
import {withDatabase,insertPlanSql} from '@/db/database';
import {validProjectId,projectKey,validProjectState,type ProjectState} from '@/lib/projects';
import {validatePlan} from '@/lib/plan';
import {saveWithHistory} from '@/lib/plan-versions';
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
   const rows=await db.all<{id:string;name:string;revision:number;updatedAt:string;state:ProjectState;stateChangedAt:string|null}>(`SELECT id, ${nameSql} AS name, revision, updated_at AS updatedAt, state, state_changed_at AS stateChangedAt FROM plans WHERE (id = ? OR (id >= ? AND id < ?))${params.get('scope')==='all'?'':" AND state = 'active'"} ORDER BY updated_at DESC, id ASC`,[prefix,prefix+':project:',prefix+':project;']);
   const allowed=await projectAccessChecker(db,user);return Response.json({projects:rows.map(r=>({...r,locked:!allowed(r.id),id:r.id===prefix?'default':r.id.slice((prefix+':project:').length)})),userId:user.userId},{headers});
  }
  const projectId=params.get('projectId')||'default';
  if(!validProjectId(projectId))return Response.json({error:'Érvénytelen projektazonosító.'},{status:400,headers});
  const legacy=params.get('legacy')==='1';
  // The old public shared plan stays read-only; copying it never changes a user's record.
  if(!legacy&&await db.first('SELECT id FROM plans WHERE id = ?',[projectKey(user.userId,projectId)])&&!await projectAccess(db,user,projectKey(user.userId,projectId)))return Response.json({error:'Ez a projekt az előfizetéshez tartozik. A megnyitásához újítsd meg az előfizetést.',code:'SUBSCRIPTION_REQUIRED'},{status:402,headers});
  const row=await db.first<{data:string;revision:number;state:ProjectState}>('SELECT data, revision, state FROM plans WHERE id = ?',[legacy?'main':projectKey(user.userId,projectId)]);
  if(row&&row.state!=='active')return Response.json({error:'A projekt archivált vagy a lomtárban van. Állítsd vissza a Projektek menüben.',code:'PROJECT_INACTIVE'},{status:409,headers});
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
  const existing=await db.first<{state:ProjectState}>('SELECT state FROM plans WHERE id = ?',[key]);
  if(existing&&existing.state!=='active')return Response.json({error:'A projekt archivált vagy a lomtárban van. Állítsd vissza a Projektek menüben.',code:'PROJECT_INACTIVE'},{status:409,headers});
  if(existing&&!await projectAccess(db,user,key))return Response.json({error:'Az előfizetés lejárt. A projekt mentéséhez újítsd meg az előfizetést.',code:'SUBSCRIPTION_REQUIRED'},{status:402,headers});
  if(rev===0&&!await db.first('SELECT id FROM plans WHERE id = ?',[key])&&!await claimProject(db,user,data.projectId))return Response.json({error:'Az első projekt ingyenes. További projekthely: egyszeri 3 490 Ft, vagy korlátlan projekt havi 2 490 Ft-ért.',code:'PAYMENT_REQUIRED'},{status:402,headers});
  const result=rev===0?await db.run(insertPlanSql(db),[key,JSON.stringify(data.plan),now]):await saveWithHistory(db,key,JSON.stringify(data.plan),rev,now);
  if(result===0)return Response.json({error:'A terv egy másik ablakban módosult. Exportáld a munkádat, majd töltsd újra az oldalt.'},{status:409,headers});
  return Response.json({revision:rev+1,projectId:data.projectId,userId:user.userId},{headers});
 })}catch(e){console.error('Save plan failed',e instanceof Error?e.name:'Error');return Response.json({error:'Nem sikerült menteni. A módosítások a nyitott oldalon megmaradtak.'},{status:503,headers})}
}
export async function PATCH(req:Request){
 try{const text=await req.text();if(text.length>4000)return Response.json({error:'A kérés túl nagy.'},{status:413,headers});
 return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);
  if(!user)return Response.json({error:'Jelentkezz be a projektkezeléshez.'},{status:401,headers});
  if(!sameOrigin(req))return Response.json({error:'Érvénytelen kérés.'},{status:403,headers});
  let data;try{data=JSON.parse(text);if(!validProjectId(data.projectId)||!validProjectState(data.state)||!Number.isInteger(data.revision)||data.revision<1)throw Error()}catch{return Response.json({error:'Érvénytelen projektművelet.'},{status:400,headers})}
  if(data.userId!==user.userId)return Response.json({error:'A bejelentkezett fiók megváltozott.'},{status:409,headers});
  const key=projectKey(user.userId,data.projectId),row=await db.first<{state:ProjectState;revision:number}>('SELECT state, revision FROM plans WHERE id = ?',[key]);
  if(!row)return Response.json({error:'A projekt nem található.'},{status:404,headers});
  if(row.revision!==data.revision)return Response.json({error:'A projekt közben megváltozott. Frissítsd a projektlistát, majd próbáld újra.'},{status:409,headers});
  if(row.state===data.state||row.state==='trash'&&data.state==='archived')return Response.json({error:'Ez az állapotváltás nem végezhető el.'},{status:400,headers});
  const now=new Date().toISOString();
  // Keep the plan and its entitlement. Revision guards also stop stale autosaves in other tabs.
  const changed=await db.run('UPDATE plans SET state = ?, state_changed_at = ?, revision = revision + 1 WHERE id = ? AND revision = ?',[data.state,now,key,data.revision]);
  if(!changed)return Response.json({error:'A projekt közben megváltozott. Frissítsd a projektlistát.'},{status:409,headers});
  return Response.json({projectId:data.projectId,userId:user.userId,revision:data.revision+1,state:data.state,stateChangedAt:now},{headers});
 })}catch{return Response.json({error:'A projekt állapota nem módosítható. Frissítsd a listát és próbáld újra.'},{status:503,headers})}
}
