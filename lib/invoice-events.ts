import type Stripe from 'stripe';
import type {Database} from '@/db/database';
import {getBillingConfig} from './billing';
import {stripeClient,type Order} from './stripe-payments';
import {billingProfileSchema} from './invoice-profile';
import {invoiceConfig,queueInvoice,huDate,type InvoicePayload} from './invoicing';
const objectId=(v:string|{id:string}|null|undefined)=>typeof v==='string'?v:v?.id;
async function payload(db:Database,order:Order,paid:number,description:string,period?:string){const row=await db.first<{data:string}>('SELECT data FROM order_billing WHERE order_id = ?',[order.id]);if(!row)return null;const {config}=await invoiceConfig(db);return {buyer:billingProfileSchema.parse(JSON.parse(row.data)),gross:order.amount,paidDate:huDate(paid),description,period,prefix:config.prefix,replyTo:config.replyTo} satisfies InvoicePayload}
export async function invoiceForCheckout(db:Database,session:Stripe.Checkout.Session,mode:'test'|'live'){
 const order=await db.first<Order>('SELECT * FROM billing_orders WHERE id = ?',[session.metadata?.order_id||'']);if(!order)return;
 if(session.livemode!==(mode==='live')||order.mode!==mode||order.user_id!==session.client_reference_id||order.user_id!==session.metadata?.user_id||order.session_id!==session.id)throw Error('Eltérő számlázási tulajdonos.');
 if(!await db.first('SELECT order_id FROM order_billing WHERE order_id = ?',[order.id]))return;
 if(session.mode==='subscription'){const {config}=await getBillingConfig(db);const subId=objectId(session.subscription);if(!subId)return;const sub=await stripeClient(config[mode].secretKey).subscriptions.retrieve(subId);const invoice=objectId(sub.latest_invoice);if(invoice)await invoiceForPaidSubscription(db,invoice,mode);return}
 if(session.mode!=='payment'||session.payment_status!=='paid'||order.status!=='paid'||session.amount_total!==order.amount||session.currency!=='huf')return;
 const {config}=await getBillingConfig(db);const piId=objectId(session.payment_intent);if(!piId)throw Error('Hiányzó fizetési azonosító.');const pi=await stripeClient(config[mode].secretKey).paymentIntents.retrieve(piId,{expand:['latest_charge']});const charge=pi.latest_charge;if(pi.status!=='succeeded'||pi.amount_received!==order.amount||pi.currency!=='huf'||!charge||typeof charge==='string'||!charge.paid||!charge.captured)throw Error('Nem igazolt bankkártyás fizetés.');
 const p=await payload(db,order,charge.created,'Villanyrajz – további projekthely');if(p&&!await queueInvoice(db,'SC-'+mode+'-'+session.id,order.user_id,mode,p))throw Error('A számlázás nincs bekapcsolva.');
}
export async function invoiceForPaidSubscription(db:Database,invoiceId:string,mode:'test'|'live'){
 const {config}=await getBillingConfig(db),stripe=stripeClient(config[mode].secretKey);const invoice=await stripe.invoices.retrieve(invoiceId);const subId=objectId(invoice.parent?.subscription_details?.subscription);if(!subId||invoice.status!=='paid'||!invoice.status_transitions.paid_at)return;
 const sub=await stripe.subscriptions.retrieve(subId),order=await db.first<Order>('SELECT * FROM billing_orders WHERE id = ?',[sub.metadata.order_id||'']);if(!order||order.kind!=='subscription')return;
 if(order.mode!==mode||invoice.livemode!==(mode==='live')||sub.livemode!==(mode==='live')||order.user_id!==sub.metadata.user_id||objectId(sub.customer)!==objectId(invoice.customer)||invoice.amount_paid!==order.amount||invoice.currency!=='huf'||!['subscription_create','subscription_cycle'].includes(invoice.billing_reason||''))throw Error('Eltérő előfizetéses számlaadatok.');
 const line=invoice.lines.data.find(l=>objectId(l.parent?.subscription_item_details?.subscription)===subId);if(!line)throw Error('Hiányzó számlázási időszak.');
 const p=await payload(db,order,invoice.status_transitions.paid_at,'Villanyrajz – korlátlan projektek havi előfizetés',huDate(line.period.start)+' – '+huDate(line.period.end));if(p&&!await queueInvoice(db,'SC-'+mode+'-'+invoice.id,order.user_id,mode,p))throw Error('A számlázás nincs bekapcsolva.');
}
