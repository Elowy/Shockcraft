import {withDatabase} from '@/db/database';
import {accountFromHeaders,sameOrigin,privateHeaders as headers} from '@/lib/auth';
import {insertIgnore} from '@/lib/billing';
import {BYTES_ERROR,CATALOG_BYTES,CATALOG_LIMIT,emptyCatalog,validateCatalog,catalogError,type Catalog} from '@/lib/catalog';
export const dynamic='force-dynamic';
// Fiókszintű termékkatalógus: a kulcs kizárólag a munkamenet userId-ja; nincs előfizetés- és projektellenőrzés, a plans táblához nem nyúl.
const SIGN_IN='A termékkatalógushoz jelentkezz be.',CONFLICT='A termékkatalógus egy másik ablakban megváltozott. Frissítsd a listát.';
export async function GET(req:Request){
 if(req.headers.get('sec-fetch-site')==='cross-site')return Response.json({error:'Érvénytelen kérés.'},{status:403,headers});
 try{return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:SIGN_IN},{status:401,headers});
  const row=await db.first<{data:string;revision:number}>('SELECT data, revision FROM product_catalogs WHERE user_id = ?',[user.userId]);
  return Response.json({catalog:row?validateCatalog(JSON.parse(row.data)):emptyCatalog(),revision:row?.revision||0,userId:user.userId,limits:{products:CATALOG_LIMIT,bytes:CATALOG_BYTES}},{headers});
 })}catch(e){console.error('Catalog read failed',e instanceof Error?e.name:'Error');return Response.json({error:'A termékkatalógus most nem tölthető be. Próbáld újra.'},{status:503,headers})}
}
export async function PUT(req:Request){
 try{const text=await req.text();if(new TextEncoder().encode(text).byteLength>CATALOG_BYTES)return Response.json({error:BYTES_ERROR,code:'TOO_LARGE'},{status:413,headers});
 return await withDatabase(async db=>{
  const user=await accountFromHeaders(db,req.headers);if(!user)return Response.json({error:SIGN_IN},{status:401,headers});
  if(!sameOrigin(req))return Response.json({error:'Érvénytelen kérés.'},{status:403,headers});
  let raw:{catalog?:unknown;revision?:unknown;userId?:unknown},catalog:Catalog,revision:number;
  try{raw=JSON.parse(text);catalog=validateCatalog(raw.catalog);if(typeof raw.revision!=='number'||!Number.isSafeInteger(raw.revision)||raw.revision<0)throw Error('Érvénytelen verziószám.');revision=raw.revision}catch(e){return Response.json({error:catalogError(e),code:'INVALID'},{status:400,headers})}
  if(raw.userId!==user.userId)return Response.json({error:'A bejelentkezett fiók megváltozott.',code:'ACCOUNT_CHANGED'},{status:409,headers});
  // Optimista zárolás: csak a kliens által ismert revisiont írjuk felül; első mentésnél a beszúrás ütközése is 409.
  // A korlát a tárolt blobra vonatkozik: a séma kiegészítő alapértékei (üres mezők, null árak) a minimális törzsnél nagyobb adatot adhatnak.
  const data=JSON.stringify(catalog),now=new Date().toISOString();
  if(new TextEncoder().encode(data).byteLength>CATALOG_BYTES)return Response.json({error:BYTES_ERROR,code:'TOO_LARGE'},{status:413,headers});
  const changed=revision>0?await db.run('UPDATE product_catalogs SET data = ?, updated_at = ?, revision = revision + 1 WHERE user_id = ? AND revision = ?',[data,now,user.userId,revision]):await db.run(insertIgnore(db,'INSERT INTO product_catalogs (user_id,data,revision,updated_at) VALUES (?,?,1,?)'),[user.userId,data,now]);
  if(!changed)return Response.json({error:CONFLICT,code:'CATALOG_CONFLICT'},{status:409,headers});
  return Response.json({catalog,revision:revision+1,userId:user.userId},{headers});
 })}catch(e){console.error('Catalog save failed',e instanceof Error?e.name:'Error');return Response.json({error:'Nem sikerült menteni a termékkatalógust. Próbáld újra.'},{status:503,headers})}
}
