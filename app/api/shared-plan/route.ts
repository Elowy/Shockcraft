import {withDatabase} from '@/db/database';
import {sameOrigin} from '@/lib/auth';
import {shareViewSchema} from '@/lib/share';
import {openShare,shareHeaders as headers} from '@/lib/share-server';
export const dynamic='force-dynamic';
// Nyilvános, bejelentkezés nélküli nézet. Munkamenet-sütit nem olvas; a token csak a POST törzsében érkezhet
// (a query, a path és a süti nem számít). Minden hibaág ugyanazt a 404-es választ adja.
const UNAVAILABLE={code:'SHARE_UNAVAILABLE',error:'A megosztott terv nem érhető el. Lehet, hogy a link lejárt, a tervező visszavonta vagy szünetelteti, vagy nem a teljes linket nyitottad meg. Kérj új linket a tervezőtől.'};
const notFound=()=>Response.json(UNAVAILABLE,{status:404,headers});
export async function POST(req:Request){
 try{const raw=await req.text();if(raw.length>300)return Response.json({code:'TOO_LARGE',error:'Túl nagy kérés.'},{status:413,headers});
  if(!sameOrigin(req))return Response.json({code:'FORBIDDEN',error:'Érvénytelen kérés.'},{status:403,headers});
  let input;try{input=shareViewSchema.parse(JSON.parse(raw))}catch{return notFound()}
  const {token,purpose}=input;
  return await withDatabase(async db=>{
   const result=await openShare(db,req,token,purpose);
   if(!result.ok){
    if(result.code==='RATE_LIMITED')return Response.json({code:'RATE_LIMITED',error:'Túl sok kérés érkezett rövid idő alatt. Próbáld újra 15 perc múlva.'},{status:429,headers:{...headers,'Retry-After':'900'}});
    if(result.code==='PDF_UNAVAILABLE')return Response.json({code:'PDF_UNAVAILABLE',error:'A letöltés ennél a megosztásnál most nem érhető el.'},{status:403,headers});
    return notFound();
   }
   return Response.json('pdf' in result?{pdf:true}:result.view,{headers});
  });
 }catch(e){console.error('Shared plan failed',e instanceof Error?e.name:'Error');return Response.json({code:'UNAVAILABLE',error:'A megosztott terv most nem tölthető be. Próbáld újra később.'},{status:503,headers})}
}
