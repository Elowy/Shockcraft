import {env} from 'cloudflare:workers';
import type {Database} from '@/db/database';
import {digest,type Account} from '@/lib/auth';
import {exportAccess,projectAccess} from '@/lib/billing';
import {projectKey,validProjectId} from '@/lib/projects';
import {SHARE_CLEANUP_RATE,SHARE_LIMITS,SHARE_PROJECT_LIMIT,SHARE_VIEW_TOUCH_MS,newShareToken,shareIpKey,sharedPlan,type ShareCreateInput,type ShareProjectStatus,type ShareSummary,type SharedView} from '@/lib/share';

// A nyilvános megosztott nézet fejlécei: ne kerüljön gyorsítótárba, keresőbe vagy Referer-be.
export const shareHeaders={'Cache-Control':'private, no-store, max-age=0','X-Robots-Tag':'noindex, nofollow, noarchive','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
// A billing a tulajdonos nevében fut; az isAdmin csak a userId-t nézi (lib/billing.ts).
export const ownerAccount=(userId:string):Account=>({userId,displayName:'',email:''});
// Ugyanaz a forrás, mint a bejelentkezési korlátnál (lib/auth.ts allowAttempt).
export function clientIp(req:Request){const node=(env as unknown as Record<string,string>).SHOCKCRAFT_NODE_RUNTIME==='1';return req.headers.get(node?'x-real-ip':'cf-connecting-ip')||''}
let missingIpLogged=false;

const WINDOW=15*60*1000,DAY=86_400_000;
// Saját névtér az auth_limits táblában: a megtekintés nem fogyasztja a bejelentkezés ip:/email: keretét.
export async function shareLimit(db:Database,scope:'share-ip'|'share-link'|'share-create',id:string,limit:number):Promise<boolean>{
 const bucket=Math.floor(Date.now()/WINDOW),key=await digest(scope+':'+id+':'+bucket),expires=(bucket+1)*WINDOW;
 const sql=db.kind==='mysql'?'INSERT INTO auth_limits (`key`,attempts,expires_at) VALUES (?,1,?) ON DUPLICATE KEY UPDATE attempts=attempts+1':'INSERT INTO auth_limits (`key`,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(`key`) DO UPDATE SET attempts=attempts+1';
 await db.run(sql,[key,expires]);
 const row=await db.first<{attempts:number}>('SELECT attempts FROM auth_limits WHERE `key` = ?',[key]);
 return !!row&&Number(row.attempts)<=limit;
}

export async function projectShareStatus(db:Database,user:Account,projectId:string):Promise<ShareProjectStatus>{
 const key=projectKey(user.userId,projectId),row=await db.first<{state:string}>('SELECT state FROM plans WHERE id = ?',[key]);
 if(!row)return 'missing';
 if(row.state!=='active')return 'inactive';
 if(!await projectAccess(db,user,key))return 'locked';
 return 'active';
}

type ShareRow={id:string;label:string;allow_pdf:number;created_at:number;expires_at:number;last_viewed_at:number|null};
const summary=(r:ShareRow):ShareSummary=>({id:r.id,label:r.label,allowPdf:Number(r.allow_pdf)===1,createdAt:Number(r.created_at),expiresAt:Number(r.expires_at),lastViewedAt:r.last_viewed_at===null||r.last_viewed_at===undefined?null:Number(r.last_viewed_at)});

// A link titkos részének lenyomatát soha nem olvassuk ki. A lejárt és jelszócsere előtti linkek itt törlődnek.
export async function listShares(db:Database,user:Account,projectId:string):Promise<ShareSummary[]>{
 const owner=await db.first<{auth_version:number}>('SELECT auth_version FROM users WHERE id = ?',[user.userId]);if(!owner)return [];
 await db.run('DELETE FROM plan_shares WHERE owner_id = ? AND (expires_at <= ? OR auth_version <> ?)',[user.userId,Date.now(),Number(owner.auth_version)]);
 // A LIMIT literál: a mysql2 execute a LIMIT ?-t nem kezeli.
 const rows=await db.all<ShareRow>('SELECT id, label, allow_pdf, created_at, expires_at, last_viewed_at FROM plan_shares WHERE owner_id = ? AND project_key = ? ORDER BY created_at DESC, id ASC LIMIT 50',[user.userId,projectKey(user.userId,projectId)]);
 return rows.map(summary);
}

const activeShareCount=async(db:Database,userId:string,key:string,now:number)=>Number((await db.first<{n:number}>('SELECT COUNT(*) AS n FROM plan_shares s JOIN users u ON u.id = s.owner_id WHERE s.owner_id = ? AND s.project_key = ? AND s.expires_at > ? AND s.auth_version = u.auth_version',[userId,key,now]))?.n||0);
export type CreateShareResult={ok:true;token:string;share:ShareSummary}|{ok:false;code:'RATE_LIMITED'|'SAVE_REQUIRED'|'PROJECT_INACTIVE'|'SUBSCRIPTION_REQUIRED'|'EXPORT_REQUIRED'|'SHARE_LIMIT'};
export async function createShare(db:Database,user:Account,input:Omit<ShareCreateInput,'userId'>):Promise<CreateShareResult>{
 if(!await shareLimit(db,'share-create',user.userId,SHARE_LIMITS.create))return {ok:false,code:'RATE_LIMITED'};
 const status=await projectShareStatus(db,user,input.projectId);
 if(status==='missing')return {ok:false,code:'SAVE_REQUIRED'};
 if(status==='inactive')return {ok:false,code:'PROJECT_INACTIVE'};
 if(status==='locked')return {ok:false,code:'SUBSCRIPTION_REQUIRED'};
 if(input.allowPdf&&!(await exportAccess(db,user,input.projectId)).allowed)return {ok:false,code:'EXPORT_REQUIRED'};
 const now=Date.now(),key=projectKey(user.userId,input.projectId);
 await db.run('DELETE FROM plan_shares WHERE expires_at <= ?',[now]);
 await db.run('DELETE FROM auth_limits WHERE expires_at <= ?',[now]);
 const token=newShareToken(),id=crypto.randomUUID(),expiresAt=now+input.days*DAY,hash=await digest(token);
 // Egyetlen feltételes utasítás: a projekt aktív állapota, a projektenkénti korlát és az auth_version a beszúrással
 // együtt dől el. Így a közben lomtárba tett projekt nem kap linket (ha a beszúrás előbb fut, a lomtár DELETE-je törli),
 // és párhuzamos kérések sem lépik túl a korlátot. Az auth_version a users sorból jön: egy közben lezajlott jelszócsere
 // után a link eleve érvénytelen.
 // MySQL-en a párhuzamos INSERT…SELECT holtpontba futhat; az egyetlen, visszagörgetett utasítás biztonságosan megismételhető.
 let changed=0;
 for(let attempt=1;;attempt++){
  try{changed=await db.run('INSERT INTO plan_shares (id,token_hash,owner_id,project_id,project_key,label,allow_pdf,auth_version,created_at,expires_at,last_viewed_at) SELECT ?,?,?,?,?,?,?,u.auth_version,?,?,NULL FROM users u WHERE u.id = ? AND EXISTS (SELECT 1 FROM plans p WHERE p.id = ? AND p.state = ?) AND (SELECT COUNT(*) FROM plan_shares s WHERE s.owner_id = u.id AND s.project_key = ? AND s.expires_at > ? AND s.auth_version = u.auth_version) < ?',[id,hash,user.userId,input.projectId,key,input.label,input.allowPdf?1:0,now,expiresAt,user.userId,key,'active',key,now,SHARE_PROJECT_LIMIT]);break}
  catch(e){if(db.kind!=='mysql'||(e as {code?:string})?.code!=='ER_LOCK_DEADLOCK'||attempt>=4)throw e}
 }
 if(!changed){
  // Nem került be: újraolvasva a pontos okot adjuk vissza (közben lomtárba/archívumba került, vagy betelt a korlát).
  const again=await projectShareStatus(db,user,input.projectId);
  if(again==='missing')return {ok:false,code:'SAVE_REQUIRED'};
  if(again==='inactive')return {ok:false,code:'PROJECT_INACTIVE'};
  if(again==='locked')return {ok:false,code:'SUBSCRIPTION_REQUIRED'};
  if(await activeShareCount(db,user.userId,key,now)>=SHARE_PROJECT_LIMIT)return {ok:false,code:'SHARE_LIMIT'};
  throw Error('Share insert failed');
 }
 return {ok:true,token,share:{id,label:input.label,allowPdf:input.allowPdf,createdAt:now,expiresAt,lastViewedAt:null}};
}

export async function revokeShares(db:Database,user:Account,projectId:string,id:string|null):Promise<number>{
 const key=projectKey(user.userId,projectId);
 return id?db.run('DELETE FROM plan_shares WHERE id = ? AND owner_id = ? AND project_key = ?',[id,user.userId,key]):db.run('DELETE FROM plan_shares WHERE owner_id = ? AND project_key = ?',[user.userId,key]);
}

export type OpenShareResult={ok:true;view:SharedView}|{ok:true;pdf:true}|{ok:false;code:'NOT_FOUND'|'RATE_LIMITED'|'PDF_UNAVAILABLE'};
// Minden kérés újraellenőriz mindent: lejárat, auth_version, projektállapot, a tulajdonos hozzáférése és exportjoga.
// A token csak SQL-paraméterként (hash) szerepel; JS-ben nincs token- vagy hash-összehasonlítás.
export async function openShare(db:Database,req:Request,token:string,purpose:'view'|'pdf'):Promise<OpenShareResult>{
 const ip=clientIp(req);
 // Hiányzó IP-fejlécnél (hibás proxybeállítás) közös keret: a nyilvános útvonal sosem marad korlát nélkül.
 if(!ip&&!missingIpLogged){missingIpLogged=true;console.warn('Shared plan: missing client IP header; check the proxy configuration')}
 if(!await shareLimit(db,'share-ip',shareIpKey(ip),SHARE_LIMITS.ip))return {ok:false,code:'RATE_LIMITED'};
 const now=Date.now();
 // A lejárt keretsorok takarítása ritkán itt is fut, hogy sok különböző IP-ről érkező kérés se növelje a táblát korlátlanul.
 if(Math.random()<SHARE_CLEANUP_RATE)await db.run('DELETE FROM auth_limits WHERE expires_at <= ?',[now]);
 const row=await db.first<{id:string;owner_id:string;project_id:string;project_key:string;allow_pdf:number;expires_at:number;last_viewed_at:number|null}>('SELECT s.id, s.owner_id, s.project_id, s.project_key, s.allow_pdf, s.expires_at, s.last_viewed_at FROM plan_shares s JOIN users u ON u.id = s.owner_id WHERE s.token_hash = ? AND s.expires_at > ? AND s.auth_version = u.auth_version',[await digest(token),now]);
 if(!row||!validProjectId(row.project_id)||row.project_key!==projectKey(row.owner_id,row.project_id))return {ok:false,code:'NOT_FOUND'};
 if(!await shareLimit(db,'share-link',row.id,SHARE_LIMITS.link))return {ok:false,code:'RATE_LIMITED'};
 const data=await db.first<{data:string;state:string;updated_at:string}>('SELECT data, state, updated_at FROM plans WHERE id = ?',[row.project_key]);
 if(!data||data.state!=='active')return {ok:false,code:'NOT_FOUND'};
 const owner=ownerAccount(row.owner_id);
 if(!await projectAccess(db,owner,row.project_key))return {ok:false,code:'NOT_FOUND'};
 const pdf=Number(row.allow_pdf)===1&&(await exportAccess(db,owner,row.project_id)).allowed;
 if(purpose==='pdf')return pdf?{ok:true,pdf:true}:{ok:false,code:'PDF_UNAVAILABLE'};
 const shared=sharedPlan(JSON.parse(data.data));
 const last=row.last_viewed_at===null||row.last_viewed_at===undefined?null:Number(row.last_viewed_at);
 if(last===null||last<now-SHARE_VIEW_TOUCH_MS)await db.run('UPDATE plan_shares SET last_viewed_at = ? WHERE id = ? AND (last_viewed_at IS NULL OR last_viewed_at < ?)',[now,row.id,now-SHARE_VIEW_TOUCH_MS]);
 return {ok:true,view:{plan:shared.plan,backgroundFloors:shared.backgroundFloors,updatedAt:data.updated_at,expiresAt:Number(row.expires_at),pdf}};
}
