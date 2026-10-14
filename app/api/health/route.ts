import {withDatabase} from '@/db/database';
export const dynamic='force-dynamic';
export async function GET(){try{await withDatabase(db=>db.first('SELECT 1 AS ready'));return Response.json({status:'ok'},{headers:{'Cache-Control':'no-store'}})}catch(error){console.error('[health] Az adatbázis nem érhető el:',error instanceof Error?error.message:error);return Response.json({status:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}})}}
