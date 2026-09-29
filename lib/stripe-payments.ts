import type {BillingProfile} from './invoice-profile';
import {invoiceForCheckout} from './invoice-events';
import {MONTHLY_AMOUNT} from './subscription-access';
import {fulfillSubscription,reserveSubscriptionCheckout} from './stripe-subscriptions';
import Stripe from 'stripe';
import type {Database} from '@/db/database';
import type {Account} from './auth';
import {billingEnv,getBillingConfig,insertIgnore,isAdmin,STRIPE_AMOUNT} from './billing';

export const stripeClient=(key:string)=>new Stripe(key,{httpClient:Stripe.createFetchHttpClient(),maxNetworkRetries:1,timeout:15000});
export type Order={kind:'project'|'subscription';id:string;user_id:string;amount:number;currency:string;mode:'test'|'live';status:string;session_id:string|null;created_at:number;updated_at:number};
export async function fulfillCheckout(db:Database,session:Stripe.Checkout.Session,mode:'test'|'live'){
 if(session.mode!=='payment'||session.payment_status!=='paid')return false;
 const orderId=session.metadata?.order_id;if(!orderId)return false;
 const order=await db.first<Order>('SELECT * FROM billing_orders WHERE id = ?',[orderId]);if(!order||order.kind==='subscription')return false;
 if(order.user_id!==session.client_reference_id||session.metadata?.user_id!==order.user_id||order.amount!==session.amount_total||order.currency!==session.currency||order.mode!==mode||session.livemode!==(mode==='live')||order.session_id&&order.session_id!==session.id)throw Error('A fizetés adatai eltérnek a rendeléstől.');
 await db.run('UPDATE billing_orders SET session_id = ?, status = ?, updated_at = ? WHERE id = ? AND (session_id IS NULL OR session_id = ?)',[session.id,'paid',Date.now(),order.id,session.id]);
 // The order ID is also the grant ID: retries and concurrent deliveries cannot add a second credit.
 await db.run(insertIgnore(db,'INSERT INTO billing_grants (id,user_id,project_id,mode,created_at) VALUES (?,?,?,?,?)'),['stripe:'+order.id,order.user_id,null,mode,Date.now()]);return true;
}
export async function checkout(db:Database,user:Account,requestId:string,kind:'project'|'subscription'='project',profile?:BillingProfile){
 const {config}=await getBillingConfig(db);const mode=config.mode;if(!config.enabled||!config[mode].secretKey||!config[mode].webhookSecret||mode==='test'&&!isAdmin(user))throw Error('Az online fizetés még nincs engedélyezve.');
 const origin=billingEnv().APP_ORIGIN;if(!origin)throw Error('Az oldal címe még nincs beállítva.');const parsed=new URL(origin);if(parsed.origin!==origin||parsed.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(parsed.hostname))throw Error('Hibás fizetési visszatérési cím.');
 if(kind==='subscription')requestId=await reserveSubscriptionCheckout(db,user,mode,requestId);
 const now=Date.now();if(!await db.first('SELECT id FROM billing_orders WHERE id = ? AND user_id = ?',[requestId,user.userId])){const recent=await db.first<{n:number}>('SELECT COUNT(*) AS n FROM billing_orders WHERE user_id = ? AND created_at > ?',[user.userId,now-15*60*1000]);if((recent?.n||0)>=10)throw Error('Túl sok fizetési kísérlet. Próbáld újra 15 perc múlva.')}await db.run(insertIgnore(db,'INSERT INTO billing_orders (id,user_id,amount,currency,mode,status,session_id,created_at,updated_at,kind) VALUES (?,?,?,?,?,?,?,?,?,?)'),[requestId,user.userId,kind==='subscription'?MONTHLY_AMOUNT:STRIPE_AMOUNT,'huf',mode,'pending',null,now,now,kind]);
 const order=(await db.first<Order>('SELECT * FROM billing_orders WHERE id = ?',[requestId]))!;
 if(order.user_id!==user.userId||order.mode!==mode||order.kind!==kind)throw Error('Érvénytelen fizetési kísérlet.');if(order.status==='paid')throw Error('Ezt a vásárlást már jóváírtuk. Frissítsd a projekthelyeket.');if(now-order.created_at>25*60*1000&&!order.session_id)throw Error('A fizetési kísérlet lejárt. Indíts új vásárlást.');
 if(profile)await db.run(insertIgnore(db,'INSERT INTO order_billing (order_id,data) VALUES (?,?)'),[order.id,JSON.stringify(profile)]);
 const stripe=stripeClient(config[mode].secretKey);
 const session=order.session_id?await stripe.checkout.sessions.retrieve(order.session_id):await stripe.checkout.sessions.create({mode:kind==='subscription'?'subscription':'payment',payment_method_types:['card'],client_reference_id:user.userId,customer_email:user.email,metadata:{order_id:order.id,user_id:user.userId},...(kind==='subscription'?{subscription_data:{metadata:{order_id:order.id,user_id:user.userId}}}:{}),line_items:[{quantity:1,price_data:{currency:'huf',unit_amount:order.amount,...(kind==='subscription'?{recurring:{interval:'month' as const}}:{}),product_data:{name:kind==='subscription'?'ShockCraft – korlátlan projektek':'ShockCraft – további projekt',description:kind==='subscription'?'Havi előfizetés. Lejárat után az előfizetéses projektek zárolódnak.':'Egyszeri díj, egy további projekthely.'}}}],success_url:origin+'/tervezo?payment=success&session_id={CHECKOUT_SESSION_ID}',cancel_url:origin+'/tervezo?payment=cancelled',expires_at:Math.floor(order.created_at/1000)+60*60,locale:'hu'},{idempotencyKey:'shockcraft-project-'+order.id});
 if(session.status==='expired')throw Error('A fizetési kísérlet lejárt. Indíts új vásárlást.');
 if(!session.url||new URL(session.url).hostname!=='checkout.stripe.com')throw Error('A fizetési oldal nem érhető el.');
 await db.run('UPDATE billing_orders SET session_id = ?, updated_at = ? WHERE id = ? AND (session_id IS NULL OR session_id = ?)',[session.id,Date.now(),order.id,session.id]);return session.url;
}
export async function confirmCheckout(db:Database,user:Account,sessionId:string){const order=await db.first<Order>('SELECT * FROM billing_orders WHERE session_id = ? AND user_id = ?',[sessionId,user.userId]);if(!order)throw Error('A fizetés nem található ebben a fiókban.');const {config}=await getBillingConfig(db);const key=config[order.mode].secretKey;if(!key)throw Error('A fizetés ellenőrzése jelenleg nem érhető el.');const session=await stripeClient(key).checkout.sessions.retrieve(sessionId);const confirmed=await (session.mode==='subscription'?fulfillSubscription(db,session,order.mode):fulfillCheckout(db,session,order.mode));if(confirmed)try{await invoiceForCheckout(db,session,order.mode)}catch{console.error('Invoice pending; payment entitlement retained')}return confirmed}
