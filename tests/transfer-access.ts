import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {env} from '../db/node-env';
import {makeSession} from '../lib/auth';
import {GET} from '../app/api/transfer-access/route';
import {checkTransferAccess} from '../lib/transfer-access';
import type {Database} from '../db/database';
const sql=new DatabaseSync(':memory:');
for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('drizzle/'+f,'utf8').replaceAll('--> statement-breakpoint',''));
type Params=(string|number|null)[];
const db:Database={kind:'d1',async first<T>(s:string,p:Params=[]){return (sql.prepare(s).get(...p)||null) as T|null},async all<T>(s:string,p:Params=[]){return sql.prepare(s).all(...p) as T[]},async run(s,p=[]){return Number(sql.prepare(s).run(...p).changes)}};
Object.assign(env,{
 ADMIN_USER_ID:'admin',
 DB:{prepare(s:string){return {bind(...p:Params){return {
  first:()=>db.first(s,p),all:async()=>({results:await db.all(s,p)}),run:async()=>({meta:{changes:await db.run(s,p)}})
 }}}}}
});
for(const id of ['buyer','admin'])await db.run('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)',[id,id+'@example.test',id,'unused',1]);
const request=async(userId:string)=>new Request('http://127.0.0.1:5180/api/transfer-access',{headers:{host:'127.0.0.1:5180',cookie:(await makeSession(db,userId,new Headers({host:'127.0.0.1:5180'}),0)).split(';')[0]}});
const buyer=await request('buyer'),admin=await request('admin');
assert.equal((await GET(new Request(buyer.url))).status,401);
assert.equal((await GET(buyer)).status,402,'free account has no transfer access');
await db.run('INSERT INTO billing_grants VALUES (?,?,?,?,?)',['paid-project','buyer',null,'live',1]);
assert.equal((await GET(buyer)).status,402,'one-off purchase does not unlock transfers');
assert.equal((await GET(admin)).status,402,'admin is not exempt');
await db.run('INSERT INTO billing_subscriptions (id,user_id,mode,order_id,customer_id,status,paid_until,cancel_at_period_end,revision,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',['sub','buyer','live','order','customer','active',Date.now()+60000,0,1,1]);
const active=await GET(buyer);assert.equal(active.status,200);assert.match(active.headers.get('cache-control')||'',/no-store/);
await db.run('UPDATE billing_subscriptions SET cancel_at_period_end = 1');assert.equal((await GET(buyer)).status,200,'scheduled cancellation keeps paid time');
await db.run('UPDATE billing_subscriptions SET paid_until = ?',[Date.now()-1]);assert.equal((await GET(buyer)).status,402,'expiry enforced without a webhook');
await db.run('UPDATE billing_subscriptions SET status = ?, paid_until = ?',['past_due',Date.now()-1]);assert.equal((await GET(buyer)).status,402,'failed unpaid renewal stays locked');
await db.run('UPDATE billing_subscriptions SET status = ?, paid_until = ?',['active',Date.now()+60000]);assert.equal((await GET(buyer)).status,200,'renewal restores transfer access');
await db.run('UPDATE billing_subscriptions SET status = ?',['canceled']);assert.equal((await GET(buyer)).status,402);
await db.run('UPDATE billing_subscriptions SET status = ?, mode = ?',['active','test']);assert.equal((await GET(buyer)).status,402,'ordinary accounts cannot use test subscriptions');
await db.run('UPDATE billing_subscriptions SET user_id = ?',['admin']);assert.equal((await GET(admin)).status,200,'admin can test a paid test subscription');
globalThis.fetch=async()=>GET(admin);
assert.equal((await checkTransferAccess('buyer')).allowed,false,'switched account cannot export the previous account plan');
assert.equal((await checkTransferAccess('admin')).allowed,true);
await db.run('UPDATE billing_subscriptions SET paid_until = ?',[Date.now()-1]);assert.equal((await checkTransferAccess('admin')).subscriptionRequired,true,'open dialogs must recheck');
globalThis.fetch=async()=>{throw Error('offline')};assert.equal((await checkTransferAccess('admin')).allowed,false,'network failure fails closed');
console.log('PASS: authenticated monthly-only transfers, one-off/free denial, paid cancellation period, expiry, renewal, test/live separation, account switching, no-cache and network failure.');
