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
const encoder=new TextEncoder();
async function encryptionKey(){const raw=billingEnv().BILLING_ENCRYPTION_KEY;if(!raw||!/^[a-f0-9]{64}$/i.test(raw))throw Error('A fizetési titkosítókulcs nincs beállítva.');return crypto.subtle.importKey('raw',Uint8Array.from(raw.match(/../g)!,x=>parseInt(x,16)),{name:'AES-GCM'},false,['encrypt','decrypt'])}
export async function encryptConfig(value:BillingConfig){const iv=crypto.getRandomValues(new Uint8Array(12)),data=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},await encryptionKey(),encoder.encode(JSON.stringify(value))));return JSON.stringify({v:1,iv:Array.from(iv),data:Array.from(data)})}
export async function getBillingConfig(db:Database){const row=await db.first<{data:string;revision:number}>('SELECT data, revision FROM billing_settings WHERE id = ?',['stripe']);if(!row)return{config:defaults(),revision:0};const v=JSON.parse(row.data);const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(v.iv)},await encryptionKey(),new Uint8Array(v.data));return{config:JSON.parse(new TextDecoder().decode(plain)) as BillingConfig,revision:row.revision}}
export function insertIgnore(db:Database,sql:string){return db.kind==='mysql'?sql.replace(/^INSERT INTO/,'INSERT IGNORE INTO'):sql+' ON CONFLICT DO NOTHING'}
export async function ensureFreeGrant(db:Database,userId:string){const prefix=projectKey(userId,'default');const old=await db.first<{id:string}>('SELECT id FROM plans WHERE id = ? OR (id >= ? AND id < ?) ORDER BY updated_at ASC, id ASC LIMIT 1',[prefix,prefix+':project:',prefix+':project;']);await db.run(insertIgnore(db,'INSERT INTO billing_grants (id,user_id,project_id,mode,created_at) VALUES (?,?,?,?,?)'),['free:'+userId,userId,old?.id||null,'free',Date.now()])}
export async function billingStatus(db:Database,user:Account){await ensureFreeGrant(db,user.userId);const {config}=await getBillingConfig(db);const admin=isAdmin(user),mode=admin?config.mode:'live';const grants=await db.all<{mode:string}>('SELECT mode FROM billing_grants WHERE user_id = ? AND project_id IS NULL',[user.userId]);const free=grants.filter(g=>g.mode==='free').length,paid=grants.filter(g=>g.mode===mode).length;return{price:PROJECT_PRICE,free,paid,available:free+paid,mode,admin,ready:config.enabled&&config.mode===mode&&!!config[mode].secretKey&&!!config[mode].webhookSecret}}
export async function claimProject(db:Database,user:Account,projectId:string){
 await ensureFreeGrant(db,user.userId);const key=projectKey(user.userId,projectId);const {config}=await getBillingConfig(db),mode=isAdmin(user)?config.mode:'live';
 if(await db.first('SELECT id FROM billing_grants WHERE user_id = ? AND project_id = ? AND (mode = ? OR mode = ?)',[user.userId,key,'free',mode]))return true;
 for(let i=0;i<4;i++){const grant=await db.first<{id:string}>('SELECT id FROM billing_grants WHERE user_id = ? AND project_id IS NULL AND (mode = ? OR mode = ?) ORDER BY created_at ASC, id ASC LIMIT 1',[user.userId,'free',mode]);if(!grant)return false;try{if(await db.run('UPDATE billing_grants SET project_id = ? WHERE id = ? AND user_id = ? AND project_id IS NULL',[key,grant.id,user.userId]))return true}catch{if(await db.first('SELECT id FROM billing_grants WHERE user_id = ? AND project_id = ?',[user.userId,key]))return true;throw Error('A projekthely foglalása nem sikerült.')}}return false;
}
