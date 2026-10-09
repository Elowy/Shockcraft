import {withDatabase} from '@/db/database';
import {accountFromHeaders,sameOrigin} from '@/lib/auth';
import {validateTemplateLibrary,TEMPLATE_LIMIT} from '@/lib/templates';
const headers={'Cache-Control':'private, no-store','Vary':'Cookie'};
export const dynamic='force-dynamic';
export async function GET(req:Request){try{return await withDatabase(async db=>{
 const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:'A sablonokhoz jelentkezz be.'},{status:401,headers});
 const row=await db.first<{data:string;revision:number}>('SELECT data, revision FROM template_libraries WHERE user_id = ?',[user.userId]);
 return Response.json({templates:row?validateTemplateLibrary(JSON.parse(row.data)):[],revision:row?.revision||0,userId:user.userId,limit:TEMPLATE_LIMIT},{headers});
 })}catch{return Response.json({error:'A sablonkönyvtár nem tölthető be. Próbáld újra.'},{status:503,headers})}}
export async function PUT(req:Request){try{const text=await req.text();if(new TextEncoder().encode(text).byteLength>2_000_000)return Response.json({error:'A sablonkönyvtár legfeljebb 2 MB lehet.'},{status:413,headers});return await withDatabase(async db=>{
 const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:'A mentéshez jelentkezz be.'},{status:401,headers});
 if(!sameOrigin(req))return Response.json({error:'Érvénytelen kérés.'},{status:403,headers});
 let data;try{data=JSON.parse(text);data.templates=validateTemplateLibrary(data.templates);if(!Number.isSafeInteger(data.revision)||data.revision<0)throw Error()}catch{return Response.json({error:'Érvénytelen sablonadatok vagy túl sok sablon (legfeljebb 30). '},{status:400,headers})}
 if(data.userId!==user.userId)return Response.json({error:'A bejelentkezett fiók megváltozott.'},{status:409,headers});
 const params=[JSON.stringify(data.templates),new Date().toISOString(),user.userId,data.revision];
 const changed=data.revision?await db.run('UPDATE template_libraries SET data = ?, updated_at = ?, revision = revision + 1 WHERE user_id = ? AND revision = ?',params):await db.run(db.kind==='mysql'?'INSERT IGNORE INTO template_libraries (data,updated_at,user_id,revision) VALUES (?,?,?,1)':'INSERT INTO template_libraries (data,updated_at,user_id,revision) VALUES (?,?,?,1) ON CONFLICT(user_id) DO NOTHING',params.slice(0,3));
 if(!changed)return Response.json({error:'A sablonkönyvtár egy másik ablakban megváltozott. Frissítsd a listát.'},{status:409,headers});
 return Response.json({templates:data.templates,revision:data.revision+1,userId:user.userId},{headers});
 })}catch{return Response.json({error:'Nem sikerült menteni a sablonkönyvtárat. Próbáld újra.'},{status:503,headers})}}
