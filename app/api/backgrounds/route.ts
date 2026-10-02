import {env} from 'cloudflare:workers';
import {withDatabase} from '@/db/database';
import {accountFromHeaders,privateHeaders,sameOrigin,digest} from '@/lib/auth';
import {getBillingConfig,isAdmin} from '@/lib/billing';
import {subscriptionStatus} from '@/lib/subscription-access';
import {jpegDimensions} from '@/lib/background';
export const dynamic='force-dynamic';
const limit=2_000_000;
type Bucket={put:(key:string,data:Uint8Array,options:unknown)=>Promise<unknown>;get:(key:string)=>Promise<{body:ReadableStream<Uint8Array>}|null>};
const bucket=()=>(env as unknown as {BACKGROUNDS:Bucket}).BACKGROUNDS;
export async function GET(req:Request){try{return await withDatabase(async db=>{
 const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:'Jelentkezz be.'},{status:401,headers:privateHeaders});
 const id=new URL(req.url).searchParams.get('asset')||'';if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))return new Response(null,{status:404,headers:privateHeaders});
 const object=await bucket().get('backgrounds/'+await digest(user.userId)+'/'+id+'.jpg');if(!object)return new Response(null,{status:404,headers:privateHeaders});
 return new Response(object.body,{headers:{...privateHeaders,'Content-Type':'image/jpeg','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'"}});
 })}catch{return Response.json({error:'A háttérkép nem tölthető be.'},{status:503,headers:privateHeaders})}}
export async function POST(req:Request){try{return await withDatabase(async db=>{
 const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:'Jelentkezz be.'},{status:401,headers:privateHeaders});
 if(!sameOrigin(req)||req.headers.get('x-shockcraft-user')!==user.userId)return Response.json({error:'A fiók megváltozott. Frissítsd az oldalt.'},{status:403,headers:privateHeaders});
 const {config}=await getBillingConfig(db),sub=await subscriptionStatus(db,user.userId,isAdmin(user)?config.mode:'live');if(!sub.active)return Response.json({error:'A háttér importálásához aktív havi előfizetés szükséges.'},{status:402,headers:privateHeaders});
 if(req.headers.get('content-type')!=='image/jpeg'||Number(req.headers.get('content-length'))>limit||!req.body)return Response.json({error:'Legfeljebb 2 MB-os JPEG kép tölthető fel.'},{status:413,headers:privateHeaders});
 const reader=req.body.getReader(),chunks:Uint8Array[]=[];let size=0;while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();return Response.json({error:'A kép túl nagy.'},{status:413,headers:privateHeaders})}chunks.push(value)}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}try{jpegDimensions(bytes)}catch{return Response.json({error:'Érvénytelen háttérkép.'},{status:400,headers:privateHeaders})}
 const assetId=crypto.randomUUID();await bucket().put('backgrounds/'+await digest(user.userId)+'/'+assetId+'.jpg',bytes,{httpMetadata:{contentType:'image/jpeg'}});
 return Response.json({assetId,userId:user.userId},{headers:privateHeaders});
 })}catch{return Response.json({error:'A háttér nem menthető. Próbáld újra; az eredeti terv megmaradt.'},{status:503,headers:privateHeaders})}}
