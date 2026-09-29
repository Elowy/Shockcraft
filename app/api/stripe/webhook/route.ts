import {invoiceForCheckout,invoiceForPaidSubscription} from '@/lib/invoice-events';
import {fulfillSubscription,syncSubscription} from '@/lib/stripe-subscriptions';
import Stripe from 'stripe';
import {withDatabase} from '@/db/database';
import {getBillingConfig} from '@/lib/billing';
import {fulfillCheckout,stripeClient} from '@/lib/stripe-payments';
export async function POST(req:Request){const raw=await req.text();if(raw.length>1_000_000)return new Response('Payload too large',{status:413});const signature=req.headers.get('stripe-signature');if(!signature)return new Response('Missing signature',{status:400});try{return await withDatabase(async db=>{const {config}=await getBillingConfig(db);let event:Stripe.Event|null=null,mode:'test'|'live'='test';for(const candidate of ['test','live'] as const){const secret=config[candidate].webhookSecret;if(!secret)continue;try{event=await stripeClient(config[candidate].secretKey||'sk_test_placeholder').webhooks.constructEventAsync(raw,signature,secret,300,Stripe.createSubtleCryptoProvider());mode=candidate;break}catch{}}
 if(!event||event.livemode!==(mode==='live'))return new Response('Invalid signature',{status:400});
 if(event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded'){const session=event.data.object as Stripe.Checkout.Session;if(session.mode==='subscription')await fulfillSubscription(db,session,mode);else await fulfillCheckout(db,session,mode);await invoiceForCheckout(db,session,mode)}
 if(['customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','customer.subscription.paused','customer.subscription.resumed'].includes(event.type))await syncSubscription(db,(event.data.object as Stripe.Subscription).id,mode);
 if(['invoice.paid','invoice.payment_failed','invoice.payment_action_required'].includes(event.type)){const inv=event.data.object as Stripe.Invoice;const sub=inv.parent?.subscription_details?.subscription||(inv as unknown as {subscription?:string}).subscription;const id=typeof sub==='string'?sub:sub?.id;if(id)await syncSubscription(db,id,mode);if(event.type==='invoice.paid')await invoiceForPaidSubscription(db,inv.id,mode)}
 return Response.json({received:true});})}catch{console.error('Stripe webhook could not be processed');return new Response('Processing failed; retry required',{status:500})}}
