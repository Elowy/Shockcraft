import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {env} from '../db/node-env';
import type {Database} from '../db/database';
import {billingStatus,claimProject,encryptConfig,projectAccess} from '../lib/billing';
import {projectKey} from '../lib/projects';
import {checkout,confirmCheckout,stripeClient} from '../lib/stripe-payments';
import {fulfillSubscription,syncSubscription,subscriptionPortal} from '../lib/stripe-subscriptions';
import {makeSession} from '../lib/auth';
import {GET,PUT} from '../lib/plan-api';
import {POST as webhook} from '../app/api/stripe/webhook/route';
const sql=new DatabaseSync(':memory:');for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('drizzle/'+f,'utf8').replaceAll('--> statement-breakpoint',''));
type Params=(string|number|null)[];
const db:Database={kind:'d1',async first<T>(s:string,p:Params=[]){return (sql.prepare(s).get(...p)||null) as T|null},async all<T>(s:string,p:Params=[]){return sql.prepare(s).all(...p) as T[]},async run(s,p=[]){return Number(sql.prepare(s).run(...p).changes)}};
Object.assign(env,{
 ADMIN_USER_ID:'other-admin',APP_ORIGIN:'http://127.0.0.1:5180',BILLING_ENCRYPTION_KEY:'1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
 DB:{prepare(s:string){return {bind(...p:Params){return {
  first:()=>db.first(s,p),all:async()=>({results:await db.all(s,p)}),run:async()=>({meta:{changes:await db.run(s,p)}})
 }}}}}
});
const user={userId:'subscriber',email:'subscriber@example.test',displayName:'Test'},other={...user,userId:'other'};
await db.run('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)',[user.userId,user.email,'Test','unused',Date.now()]);
const config={enabled:true,mode:'live' as const,test:{secretKey:'sk_test_fake',webhookSecret:'whsec_test'},live:{secretKey:'sk_live_fake',webhookSecret:'whsec_live'}};
await db.run('INSERT INTO billing_settings VALUES (?,?,?,?)',['stripe',await encryptConfig(config),1,'2026']);
let remoteStatus='active',invoicePaid=false,cancelAtEnd=false,periodEnd=Math.floor(Date.now()/1000)+30*86400,remoteSessionStatus='open';let orderId='';let requests:string[]=[];
const fakeSubscription=()=>({id:'sub_local',object:'subscription',livemode:true,customer:'cus_local',status:remoteStatus,cancel_at_period_end:cancelAtEnd,metadata:{order_id:orderId,user_id:user.userId},items:{data:[{quantity:1,current_period_end:periodEnd,price:{currency:'huf',unit_amount:249000,recurring:{interval:'month',interval_count:1}}}]},latest_invoice:{id:'in_local',customer:'cus_local',status:invoicePaid?'paid':'open',currency:'huf',amount_paid:invoicePaid?249000:0,parent:{subscription_details:{subscription:'sub_local'}},lines:{data:[{parent:{subscription_item_details:{subscription:'sub_local'}},period:{end:periodEnd}}]}}});
const fakeSession=()=>({id:'cs_live_local_subscription',object:'checkout.session',mode:'subscription',status:remoteSessionStatus,payment_status:invoicePaid?'paid':'unpaid',livemode:true,client_reference_id:user.userId,metadata:{order_id:orderId,user_id:user.userId},subscription:'sub_local',url:'https://checkout.stripe.com/c/pay/local'});
globalThis.fetch=async (input,init)=>{const url=String(input),body=new URLSearchParams(String(init?.body||''));assert.ok(url.startsWith('https://api.stripe.com/'));if(url.includes('/checkout/sessions')&&init?.method==='POST'){assert.equal(body.get('success_url'),'http://127.0.0.1:5180/tervezo?payment=success&session_id={CHECKOUT_SESSION_ID}');assert.equal(body.get('cancel_url'),'http://127.0.0.1:5180/tervezo?payment=cancelled');assert.equal(body.get('mode'),'subscription');assert.equal(body.get('line_items[0][price_data][unit_amount]'),'249000');assert.equal(body.get('line_items[0][price_data][recurring][interval]'),'month');assert.equal(body.get('subscription_data[metadata][user_id]'),user.userId);orderId=body.get('metadata[order_id]')!;requests.push(new Headers(init.headers).get('idempotency-key')!);return Response.json(fakeSession())}if(url.includes('/checkout/sessions/'))return Response.json(fakeSession());if(url.includes('/subscriptions/sub_local'))return Response.json(fakeSubscription());if(url.includes('/billing_portal/configurations')){assert.equal(body.get('features[subscription_cancel][mode]'),'at_period_end');return Response.json({id:'bpc_local'})}if(url.includes('/billing_portal/sessions')){assert.equal(body.get('return_url'),'http://127.0.0.1:5180/tervezo?payment=manage');assert.equal(body.get('customer'),'cus_local');return Response.json({url:'https://billing.stripe.com/p/session/local'})}throw Error('Unexpected mocked Stripe route: '+url)};
await Promise.all([checkout(db,user,crypto.randomUUID(),'subscription'),checkout(db,user,crypto.randomUUID(),'subscription')]);assert.equal(new Set(requests).size,1,'concurrent clicks share one Stripe idempotency key');assert.equal((await db.all('SELECT id FROM billing_orders')).length,1,'one pending subscription order');
remoteSessionStatus='complete';await fulfillSubscription(db,fakeSession() as never,'live');assert.equal((await billingStatus(db,user)).subscription.active,false,'unpaid subscription cannot grant access');invoicePaid=true;await Promise.all([fulfillSubscription(db,fakeSession() as never,'live'),fulfillSubscription(db,fakeSession() as never,'live')]);assert.equal((await billingStatus(db,user)).subscription.active,true);
await assert.rejects(()=>checkout(db,user,crypto.randomUUID(),'subscription'),/Már van/);await assert.rejects(()=>confirmCheckout(db,other,'cs_live_local_subscription'),/nem található/);
const freeId=crypto.randomUUID(),paidId=crypto.randomUUID(),subId=crypto.randomUUID();
assert.equal(await claimProject(db,user,freeId),true);await db.run('INSERT INTO billing_grants VALUES (?,?,?,?,?)',['paid',user.userId,projectKey(user.userId,paidId),'live',Date.now()]);await db.run('INSERT INTO billing_grants VALUES (?,?,?,?,?)',['unused-paid',user.userId,null,'live',Date.now()]);
assert.equal(await claimProject(db,user,subId),true);assert.equal((await billingStatus(db,user)).paid,1,'subscription does not consume prepaid project credits');
const plan={version:1,name:'Subscription project',plot:{name:'Telek',w:40,h:30,nodes:[],routes:[]},buildings:[{id:'house',name:'Ház',x:2,y:2,w:10,h:10,floors:[{id:'floor',name:'Földszint',elevation:0,rooms:[],walls:[],devices:[],routes:[]}]}],circuits:[],modules:[]};
for(const id of [freeId,paidId,subId])await db.run('INSERT INTO plans VALUES (?,?,?,?)',[projectKey(user.userId,id),JSON.stringify(plan),1,'2026']);
const cookie=(await makeSession(db,user.userId,new Headers({host:'127.0.0.1:5180'}),0)).split(';')[0];const headers={host:'127.0.0.1:5180',Cookie:cookie,Origin:'http://127.0.0.1:5180'};const get=(id:string)=>GET(new Request('http://127.0.0.1:5180/api/plan?projectId='+id,{headers}));
assert.equal((await get(subId)).status,200);cancelAtEnd=true;await syncSubscription(db,'sub_local','live');assert.equal((await get(subId)).status,200,'cancellation retains paid time');assert.equal((await billingStatus(db,user)).subscription.cancelAtPeriodEnd,true);
assert.match(await subscriptionPortal(db,user,'live'),/^https:\/\/billing.stripe.com/);await assert.rejects(()=>subscriptionPortal(db,other,'live'),/nincs/);
await db.run('UPDATE billing_subscriptions SET paid_until = ?',[Date.now()-1]);assert.equal((await get(subId)).status,402,'expiry locks server reads without webhook');assert.equal((await get(freeId)).status,200);assert.equal((await get(paidId)).status,200);
const list=await GET(new Request('http://127.0.0.1:5180/api/plan?list=1',{headers}));assert.equal((await list.json() as {projects:{id:string;locked:boolean}[]}).projects.find(p=>p.id===subId)?.locked,true);
assert.equal((await PUT(new Request('http://127.0.0.1:5180/api/plan',{method:'PUT',headers,body:JSON.stringify({plan,projectId:subId,userId:user.userId,revision:1})}))).status,402,'expiry locks writes too');
remoteStatus='past_due';invoicePaid=false;await syncSubscription(db,'sub_local','live');assert.equal(await projectAccess(db,user,projectKey(user.userId,subId)),false,'failed renewal cannot extend paid time');
invoicePaid=true;remoteStatus='active';periodEnd+=30*86400;cancelAtEnd=false;await syncSubscription(db,'sub_local','live');assert.equal((await get(subId)).status,200,'renewal restores existing projects');
remoteStatus='canceled';const staleEvent=JSON.stringify({id:'evt_old',object:'event',type:'customer.subscription.updated',livemode:true,data:{object:{id:'sub_local',status:'active'}}});const signature=stripeClient(config.live.secretKey).webhooks.generateTestHeaderString({payload:staleEvent,secret:config.live.webhookSecret});assert.equal((await webhook(new Request('http://127.0.0.1:5180/api/stripe/webhook',{method:'POST',headers:{'stripe-signature':signature},body:staleEvent}))).status,200);assert.equal((await get(subId)).status,402,'stale event cannot reactivate canceled subscription');
assert.equal((await db.first<{n:number}>('SELECT COUNT(*) AS n FROM plans'))?.n,3,'no project data deleted');
console.log('PASS: fixed monthly HUF amount, concurrent checkout deduplication, signed stale webhook, paid-period expiry, cancellation, failed renewal, restored access, permanent paid/free access, API read/write locks, prepaid credits retained, owner isolation and portal. No real charges.');
