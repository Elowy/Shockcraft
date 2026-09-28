import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readdirSync,readFileSync} from 'node:fs';
import type {Database} from '../db/database';
import {env} from '../db/node-env';
import {seal} from '../lib/secrets';
import {accountFromHeaders,digest,hashPassword,makeSession,verifyPassword} from '../lib/auth';
import {consumeAccountLink,sendAccountLink,type MailUser} from '../lib/account-email';
import {POST as emailPost} from '../app/api/account-email/[action]/route';
import {POST as adminPost,GET as adminGet} from '../app/api/admin/email/route';
const sql=new DatabaseSync(':memory:');for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('drizzle/'+f,'utf8').replaceAll('--> statement-breakpoint',''));
type Params=(string|number|null)[];
const db:Database={kind:'d1',async first<T>(s:string,p:Params=[]){return (sql.prepare(s).get(...p)||null) as T|null},async all<T>(s:string,p:Params=[]){return sql.prepare(s).all(...p) as T[]},async run(s,p=[]){return Number(sql.prepare(s).run(...p).changes)}};
Object.assign(env,{
 ADMIN_USER_ID:'email-admin',APP_ORIGIN:'http://127.0.0.1:5180',BILLING_ENCRYPTION_KEY:'1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
 DB:{prepare(s:string){return {bind(...p:Params){return {
  first:()=>db.first(s,p),all:async()=>({results:await db.all(s,p)}),run:async()=>({meta:{changes:await db.run(s,p)}})
 }}}}}
});
const user:MailUser={id:'email-admin',email:'owner@example.test',auth_version:0,email_verified_at:null},password='Original local password 123!';
await db.run('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)',[user.id,user.email,'Owner',await hashPassword(password),Date.now()]);
const host=new Headers({host:'127.0.0.1:5180'});const cookie=(await makeSession(db,user.id,host,0)).split(';')[0];const headers=new Headers({host:'127.0.0.1:5180',cookie});
assert.equal((await accountFromHeaders(db,headers))?.emailVerified,false);
const config={enabled:true,apiKey:'re_fake_local_only',from:'noreply@example.test'};
await db.run('INSERT INTO mail_settings VALUES (?,?,?,?)',['resend',await seal(config),1,new Date().toISOString()]);
let mails:{to:string[];text:string}[]=[];let fail=false;
globalThis.fetch=async (input,init)=>{assert.equal(String(input),'https://api.resend.com/emails');assert.ok(new Headers(init?.headers).has('Idempotency-Key'));if(fail)return new Response('{}',{status:503});mails.push(JSON.parse(String(init?.body)));return Response.json({id:crypto.randomUUID()})};
const lastToken=()=>mails.at(-1)!.text.match(/#token=([a-f0-9]{64})/)![1];
assert.equal(await sendAccountLink(db,user,'verify',config),true);let token=lastToken();assert.ok(!JSON.stringify(await db.all('SELECT * FROM account_tokens')).includes(token),'only hashed token persisted');
assert.equal(await sendAccountLink(db,user,'verify',config),false,'send cooldown');assert.equal(mails.length,1);
assert.equal(await consumeAccountLink(db,token,'reset','New local password 123!'),false,'purpose isolation');
assert.equal(await consumeAccountLink(db,token,'verify'),true);assert.equal(await consumeAccountLink(db,token,'verify'),false,'single use');assert.equal((await accountFromHeaders(db,headers))?.emailVerified,true);
await sendAccountLink(db,user,'reset',config);token=lastToken();const updatedPassword='Updated local password 123!';
const results=await Promise.all([consumeAccountLink(db,token,'reset',updatedPassword),consumeAccountLink(db,token,'reset','Competing local password 123!')]);assert.equal(results.filter(Boolean).length,1,'atomic reset across concurrent requests');
assert.equal(await accountFromHeaders(db,headers),null,'old session revoked');
const lateCookie=(await makeSession(db,user.id,host,0)).split(';')[0];assert.equal(await accountFromHeaders(db,new Headers({host:'127.0.0.1:5180',cookie:lateCookie})),null,'concurrent old-password login cannot survive reset');
const row=(await db.first<{password_hash:string;auth_version:number}>('SELECT password_hash,auth_version FROM users WHERE id = ?',[user.id]))!;assert.equal(row.auth_version,1);assert.equal(await verifyPassword(password,row.password_hash),false);
assert.equal(await consumeAccountLink(db,token,'reset',updatedPassword),false);
const expired='e'.repeat(64);await db.run('INSERT INTO account_tokens VALUES (?,?,?,?,?,?,?)',[await digest(expired),user.id,user.email,'reset',1,Date.now()-1,Date.now()-1000]);assert.equal(await consumeAccountLink(db,expired,'reset',updatedPassword),false,'expired token');
const freshCookie=(await makeSession(db,user.id,host,1)).split(';')[0];
const req=(path:string,body:unknown,cookieValue='',origin='http://127.0.0.1:5180')=>new Request('http://127.0.0.1:5180'+path,{method:'POST',headers:{host:'127.0.0.1:5180',Origin:origin,Cookie:cookieValue,'Content-Type':'application/json'},body:JSON.stringify(body)});
assert.equal((await emailPost(req('/api/account-email/forgot',{email:user.email},'','https://evil.test'))).status,403);
assert.equal((await emailPost(req('/api/account-email/resend',{}))).status,401);
assert.equal((await adminGet(new Request('http://127.0.0.1:5180/api/admin/email'))).status,403);
const visible=await adminGet(new Request('http://127.0.0.1:5180/api/admin/email',{headers:{host:'127.0.0.1:5180',Cookie:freshCookie}}));assert.equal(visible.status,200);assert.ok(!(await visible.text()).includes(config.apiKey),'secret never returned');
assert.equal((await adminPost(req('/api/admin/email',{enabled:true,from:config.from,apiKey:'',revision:0},freshCookie))).status,409,'stale settings rejected');
const unknown=await emailPost(req('/api/account-email/forgot',{email:'unknown@example.test'}));const known=await emailPost(req('/api/account-email/forgot',{email:user.email}));assert.equal(unknown.status,200);assert.deepEqual(await known.json(),await unknown.json(),'no account enumeration in response');
await db.run('DELETE FROM auth_limits');fail=true;const failed=await emailPost(req('/api/account-email/forgot',{email:user.email}));assert.equal(failed.status,200);assert.equal((await failed.json() as {message:string}).message,(await (await emailPost(req('/api/account-email/forgot',{email:'another@example.test'}))).json() as {message:string}).message);
fail=false;await db.run('DELETE FROM auth_limits');mails=[];const fresh={...user,auth_version:1};await sendAccountLink(db,fresh,'reset',config);token=lastToken();assert.equal(await consumeAccountLink(db,token,'reset','short').catch(()=>false),false,'password policy');assert.equal(await consumeAccountLink(db,token,'reset',updatedPassword),true,'bad password does not consume token');
for(let i=0;i<3;i++)assert.equal((await emailPost(req('/api/account-email/forgot',{email:'throttle@example.test'}))).status,200);assert.equal((await emailPost(req('/api/account-email/forgot',{email:'throttle@example.test'}))).status,429);
console.log('PASS: hashed expiring links, purpose isolation, resend limits, concurrent single-use reset, session revocation including login race, verification, password policy, CSRF, generic reset responses, mail failure, admin authorization and masked secrets. No external emails sent.');
