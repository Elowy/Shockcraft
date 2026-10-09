import {MONTHLY_PRICE,subscriptionStatus} from './subscription-access';
import {seal,unseal} from './secrets';
import {env} from 'cloudflare:workers';
import type {Database} from '@/db/database';
import type {Account} from '@/lib/auth';
import {projectKey} from '@/lib/projects';

export const PROJECT_PRICE=3490,STRIPE_AMOUNT=349000;
export const billingEnv=()=>env as unknown as Record<string,string|undefined>;
// Pin an existing account ID. An unverified email address cannot confer admin rights.
export function isAdmin(user:Account|null){return !!user&&!!billingEnv().ADMIN_USER_ID&&user.userId===billingEnv().ADMIN_USER_ID}
export type BillingConfig={enabled:boolean;mode:'test'|'live';test:{secretKey:string;webhookSecret:string};live:{secretKey:string;webhookSecret:string}};
const defaults=():BillingConfig=>({enabled:false,mode:'test',test:{secretKey:'',webhookSecret:''},live:{secretKey:'',webhookSecret:''}});
export const encryptConfig=(value:BillingConfig)=>seal(value);
export async function getBillingConfig(db:Database){const row=await db.first<{data:string;revision:number}>('SELECT data, revision FROM billing_settings WHERE id = ?',['stripe']);return {config:row?await unseal<BillingConfig>(row.data):defaults(),revision:row?.revision||0}}
export function insertIgnore(db:Database,sql:string){return db.kind==='mysql'?sql.replace(/^INSERT INTO/,'INSERT IGNORE INTO'):sql+' ON CONFLICT DO NOTHING'}
export async function ensureFreeGrant(db:Database,userId:string){const prefix=projectKey(userId,'default');const old=await db.first<{id:string}>('SELECT id FROM plans WHERE id = ? OR (id >= ? AND id < ?) ORDER BY updated_at ASC, id ASC LIMIT 1',[prefix,prefix+':project:',prefix+':project;']);await db.run(insertIgnore(db,'INSERT INTO billing_grants (id,user_id,project_id,mode,created_at) VALUES (?,?,?,?,?)'),['free:'+userId,userId,old?.id||null,'free',Date.now()])}
export async function billingStatus(db:Database,user:Account){await ensureFreeGrant(db,user.userId);const {config}=await getBillingConfig(db);const admin=isAdmin(user),mode=admin?config.mode:'live';const grants=await db.all<{mode:string}>('SELECT mode FROM billing_grants WHERE user_id = ? AND project_id IS NULL',[user.userId]);const free=grants.filter(g=>g.mode==='free').length,paid=grants.filter(g=>g.mode===mode).length;return{price:PROJECT_PRICE,monthlyPrice:MONTHLY_PRICE,subscription:await subscriptionStatus(db,user.userId,mode),free,paid,available:free+paid,mode,admin,ready:config.enabled&&config.mode===mode&&!!config[mode].secretKey&&!!config[mode].webhookSecret}}
export async function claimProject(db:Database,user:Account,projectId:string){
 await ensureFreeGrant(db,user.userId);const key=projectKey(user.userId,projectId);const {config}=await getBillingConfig(db),mode=isAdmin(user)?config.mode:'live';
 if(await db.first('SELECT id FROM billing_grants WHERE user_id = ? AND project_id = ? AND (mode = ? OR mode = ?)',[user.userId,key,'free',mode]))return true;
 const sub=await subscriptionStatus(db,user.userId,mode);
 if(sub.active){const free=await db.first<{id:string}>('SELECT id FROM billing_grants WHERE user_id = ? AND mode = ? AND project_id IS NULL',[user.userId,'free']);if(free&&await db.run('UPDATE billing_grants SET project_id = ? WHERE id = ? AND project_id IS NULL',[key,free.id]))return true;await db.run(insertIgnore(db,'INSERT INTO billing_grants (id,user_id,project_id,mode,created_at) VALUES (?,?,?,?,?)'),['subscription:'+user.userId+':'+projectId,user.userId,key,'sub_'+mode,Date.now()]);return true}
 for(let i=0;i<4;i++){const grant=await db.first<{id:string}>('SELECT id FROM billing_grants WHERE user_id = ? AND project_id IS NULL AND (mode = ? OR mode = ?) ORDER BY created_at ASC, id ASC LIMIT 1',[user.userId,'free',mode]);if(!grant)return false;try{if(await db.run('UPDATE billing_grants SET project_id = ? WHERE id = ? AND user_id = ? AND project_id IS NULL',[key,grant.id,user.userId]))return true}catch{if(await db.first('SELECT id FROM billing_grants WHERE user_id = ? AND project_id = ?',[user.userId,key]))return true;throw Error('A projekthely foglalása nem sikerült.')}}return false;
}

export async function projectAccessChecker(db:Database,user:Account){
 await ensureFreeGrant(db,user.userId);const {config}=await getBillingConfig(db),mode=isAdmin(user)?config.mode:'live';
 const grants=await db.all<{mode:string;project_id:string|null}>('SELECT mode,project_id FROM billing_grants WHERE user_id = ?',[user.userId]);
 const sub=await subscriptionStatus(db,user.userId,mode);
 return (key:string)=>{const matching=grants.filter(g=>g.project_id===key);if(matching.some(g=>g.mode==='free'||g.mode===mode))return true;if(matching.some(g=>g.mode==='sub_'+mode))return sub.active;return !matching.length&&(sub.status==='none'||sub.active);};
}
// Export is per project: free and one-off project slots export without a subscription;
// subscription-held and legacy (ungranted) projects require an active subscription.
export type ExportAccess={allowed:true;via:'subscription'|'project'}|{allowed:false;code:'PROJECT_INACTIVE'|'SAVE_REQUIRED'|'SUBSCRIPTION_REQUIRED'};
export async function exportAccess(db:Database,user:Account,projectId:string):Promise<ExportAccess>{
 await ensureFreeGrant(db,user.userId);const key=projectKey(user.userId,projectId),{config}=await getBillingConfig(db),mode=isAdmin(user)?config.mode:'live';
 const row=await db.first<{state:string}>('SELECT state FROM plans WHERE id = ?',[key]);
 if(row&&row.state!=='active')return {allowed:false,code:'PROJECT_INACTIVE'};
 if((await subscriptionStatus(db,user.userId,mode)).active)return {allowed:true,via:'subscription'};
 if(!row)return {allowed:false,code:'SAVE_REQUIRED'};
 if(await db.first('SELECT id FROM billing_grants WHERE user_id = ? AND project_id = ? AND (mode = ? OR mode = ?)',[user.userId,key,'free',mode]))return {allowed:true,via:'project'};
 return {allowed:false,code:'SUBSCRIPTION_REQUIRED'};
}
export async function projectAccess(db:Database,user:Account,key:string){return (await projectAccessChecker(db,user))(key)}
