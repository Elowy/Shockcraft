import Stripe from 'stripe';
import type {Database} from '@/db/database';
import type {Account} from './auth';
import {getBillingConfig,insertIgnore} from './billing';
import {stripeClient,type Order} from './stripe-payments';
import {MONTHLY_AMOUNT,subscriptionStatus,type SubscriptionRow} from './subscription-access';
import {publicOrigin} from './account-email';
const objectId=(v:string|{id:string}|null|undefined)=>typeof v==='string'?v:v?.id;

// Fetch current Stripe state for every event; never apply an old webhook snapshot.
// The revision check prevents concurrent, slower fetches overwriting a newer result.
export async function syncSubscription(db:Database,id:string,mode:'test'|'live'){
 const {config}=await getBillingConfig(db);if(!config[mode].secretKey)throw Error('A Stripe-kulcs nincs beállítva.');const stripe=stripeClient(config[mode].secretKey);
 for(let attempt=0;attempt<4;attempt++){
  const before=await db.first<SubscriptionRow>('SELECT * FROM billing_subscriptions WHERE id = ?',[id]);
  const sub=await stripe.subscriptions.retrieve(id,{expand:['latest_invoice']});
  if(sub.livemode!==(mode==='live'))throw Error('Hibás előfizetési környezet.');
  const order=await db.first<Order>('SELECT * FROM billing_orders WHERE id = ?',[sub.metadata.order_id||'']);
  if(!order||order.kind!=='subscription')return false;
  const item=sub.items.data[0],customer=objectId(sub.customer);
  if(order.mode!==mode||order.user_id!==sub.metadata.user_id||!customer||sub.items.data.length!==1||item.quantity!==1||item.price.currency!=='huf'||item.price.unit_amount!==MONTHLY_AMOUNT||item.price.recurring?.interval!=='month'||item.price.recurring.interval_count!==1)throw Error('Az előfizetés adatai eltérnek a rendeléstől.');
  if(before&&(before.user_id!==order.user_id||before.mode!==mode||before.order_id!==order.id||before.customer_id!==customer))throw Error('Az előfizetés tulajdonosa eltér.');
  let paidUntil=before?.paid_until||0;
  const invoice=sub.latest_invoice&&typeof sub.latest_invoice!=='string'?sub.latest_invoice:null;
  if(invoice?.status==='paid'&&invoice.amount_paid===MONTHLY_AMOUNT&&invoice.currency==='huf'&&objectId(invoice.customer)===customer&&objectId(invoice.parent?.subscription_details?.subscription)===sub.id){
   const line=invoice.lines.data.find(l=>l.parent?.subscription_item_details?.subscription===sub.id);
   if(line)paidUntil=Math.max(paidUntil,Math.min(item.current_period_end,line.period.end)*1000);
  }
  await db.run(insertIgnore(db,'INSERT INTO billing_subscriptions (id,user_id,mode,order_id,customer_id,status,paid_until,cancel_at_period_end,revision,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)'),[sub.id,order.user_id,mode,order.id,customer,'incomplete',0,0,0,Date.now()]);
  const changed=await db.run('UPDATE billing_subscriptions SET status = ?, paid_until = ?, cancel_at_period_end = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?',[sub.status,paidUntil,sub.cancel_at_period_end?1:0,Date.now(),sub.id,before?.revision||0]);
  if(!changed)continue;
  if(paidUntil>0)await db.run('UPDATE billing_orders SET status = ?, updated_at = ? WHERE id = ?',['paid',Date.now(),order.id]);
  return (await subscriptionStatus(db,order.user_id,mode)).active;
 }
 throw Error('Az előfizetés párhuzamosan módosult. Próbáld újra.');
}
export async function fulfillSubscription(db:Database,session:Stripe.Checkout.Session,mode:'test'|'live'){
 if(session.mode!=='subscription')return false;
 const order=await db.first<Order>('SELECT * FROM billing_orders WHERE id = ?',[session.metadata?.order_id||'']);if(!order||order.kind!=='subscription')return false;
 if(order.user_id!==session.client_reference_id||order.user_id!==session.metadata?.user_id||order.mode!==mode||session.livemode!==(mode==='live')||order.session_id&&order.session_id!==session.id)throw Error('Az előfizetés tulajdonosa eltér.');
 const id=objectId(session.subscription);if(!id)return false;
 await db.run('UPDATE billing_orders SET session_id = ?, updated_at = ? WHERE id = ? AND (session_id IS NULL OR session_id = ?)',[session.id,Date.now(),order.id,session.id]);
 return syncSubscription(db,id,mode);
}
export async function refreshSubscriptions(db:Database,userId:string,mode:'test'|'live'){
 const rows=await db.all<{id:string}>('SELECT id FROM billing_subscriptions WHERE user_id = ? AND mode = ? AND status NOT IN (?,?)',[userId,mode,'canceled','incomplete_expired']);
 for(const row of rows)await syncSubscription(db,row.id,mode);
}
export async function reserveSubscriptionCheckout(db:Database,user:Account,mode:'test'|'live',requestId:string){
 await refreshSubscriptions(db,user.userId,mode);
 if((await subscriptionStatus(db,user.userId,mode)).ongoing)throw Error('Már van előfizetésed. Az Előfizetés kezelése gombbal folytathatod.');
 const {config}=await getBillingConfig(db),stripe=stripeClient(config[mode].secretKey),id=mode+':'+user.userId;
 for(let i=0;i<4;i++){
  const slot=await db.first<{order_id:string;expires_at:number}>('SELECT order_id,expires_at FROM subscription_checkouts WHERE id = ?',[id]);
  if(slot){
   let expired=false;
   const old=await db.first<Order>('SELECT * FROM billing_orders WHERE id = ?',[slot.order_id]);
   if(old?.session_id){const session=await stripe.checkout.sessions.retrieve(old.session_id);if(session.status==='complete'){await fulfillSubscription(db,session,mode);if((await subscriptionStatus(db,user.userId,mode)).ongoing)throw Error('Már van előfizetésed. Frissítsd az állapotot.')}else if(session.status==='open')return slot.order_id;else if(session.status==='expired')expired=true}
   if(slot.expires_at>Date.now()&&!old?.session_id)return slot.order_id;
   if(slot.expires_at>Date.now()&&old?.status==='pending'&&!expired)throw Error('Az előző fizetési kísérlet lezárása még folyamatban van.');
   if(requestId===slot.order_id)requestId=crypto.randomUUID();
   if(await db.run('UPDATE subscription_checkouts SET order_id = ?, expires_at = ? WHERE id = ? AND order_id = ?',[requestId,Date.now()+65*60000,id,slot.order_id]))return requestId;
  }else if(await db.run(insertIgnore(db,'INSERT INTO subscription_checkouts (id,order_id,expires_at) VALUES (?,?,?)'),[id,requestId,Date.now()+65*60000]))return requestId;
 }
 throw Error('A fizetés előkészítése folyamatban van. Próbáld újra.');
}
export async function subscriptionPortal(db:Database,user:Account,mode:'test'|'live'){
 const row=await db.first<SubscriptionRow>('SELECT * FROM billing_subscriptions WHERE user_id = ? AND mode = ? ORDER BY updated_at DESC LIMIT 1',[user.userId,mode]);if(!row)throw Error('Még nincs kezelhető előfizetés.');
 const {config}=await getBillingConfig(db),stripe=stripeClient(config[mode].secretKey);
 const portalConfig=await stripe.billingPortal.configurations.create({business_profile:{headline:'ShockCraft – előfizetés kezelése'},features:{customer_update:{enabled:false},invoice_history:{enabled:true},payment_method_update:{enabled:true},subscription_cancel:{enabled:true,mode:'at_period_end'},subscription_update:{enabled:false}}},{idempotencyKey:'shockcraft-monthly-portal-v1'});
 const portal=await stripe.billingPortal.sessions.create({customer:row.customer_id,configuration:portalConfig.id,return_url:publicOrigin()+'/?payment=manage'});
 if(new URL(portal.url).hostname!=='billing.stripe.com')throw Error('A kezelőfelület nem érhető el.');return portal.url;
}
