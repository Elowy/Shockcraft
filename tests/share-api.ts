import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {env} from '../db/node-env';
import {makeSession,digest,allowAttempt} from '../lib/auth';
import {POST as view} from '../app/api/shared-plan/route';
import {GET,POST,DELETE} from '../app/api/plan-share/route';
import {PATCH} from '../app/api/plan/route';
import {claimProject} from '../lib/billing';
import {projectKey} from '../lib/projects';
import {seed,validatePlan} from '../lib/plan';
import {newQuote} from '../lib/quote';
import {openSharedPlan,checkSharedPdf,fetchShares,ShareError} from '../lib/share-client';
import type {ShareSummary} from '../lib/share';
import type {Database} from '../db/database';
const sql=new DatabaseSync(':memory:');
for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('drizzle/'+f,'utf8').replaceAll('--> statement-breakpoint',''));
type Params=(string|number|null)[];
const db:Database={kind:'d1',async first<T>(s:string,p:Params=[]){return (sql.prepare(s).get(...p)||null) as T|null},async all<T>(s:string,p:Params=[]){return sql.prepare(s).all(...p) as T[]},async run(s,p=[]){return Number(sql.prepare(s).run(...p).changes)}};
Object.assign(env,{APP_ORIGIN:'http://127.0.0.1:5180',ADMIN_USER_ID:'admin',DB:{prepare(s:string){return {bind(...p:Params){return {first:()=>db.first(s,p),all:async()=>({results:await db.all(s,p)}),run:async()=>({meta:{changes:await db.run(s,p)}})}}}}}});
const ORIGIN='http://127.0.0.1:5180',HOST='127.0.0.1:5180';
const OWNER=crypto.randomUUID(),OTHER=crypto.randomUUID();
await db.run('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)',[OWNER,'share-owner@example.test','Kovács Tervező','unused',1]);
await db.run('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)',[OTHER,'share-other@example.test','Másik Fiók','unused',1]);
const session=async(userId:string,version=0)=>(await makeSession(db,userId,new Headers({host:HOST}),version)).split(';')[0];
let owner=await session(OWNER);const other=await session(OTHER);
const A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222',C='33333333-3333-4333-8333-333333333333',U='44444444-4444-4444-8444-444444444444';

// Tervek: a default a legrégebbi (ingyenes hely), quote-tal és háttérrel; A egyszeri, B előfizetéses, C grant nélküli.
const assetId=crypto.randomUUID();
const secretPlan=validatePlan(structuredClone(seed));
secretPlan.quote={...newQuote(),customer:'Titkos Ügyfél Kft. 06301234567'};
secretPlan.buildings[0].floors.find(f=>f.id==='ground')!.background={assetId,name:'kovacs-alaprajz.jpg',x:0,y:0,w:400,h:300,opacity:.5,visible:true,calibrated:true};
const insertPlan=(userId:string,id:string,data:unknown,updated:string)=>db.run('INSERT INTO plans (id,data,revision,updated_at) VALUES (?,?,1,?)',[projectKey(userId,id),JSON.stringify(data),updated]);
await insertPlan(OWNER,'default',secretPlan,'2026-01-01T00:00:00.000Z');
assert.equal(await claimProject(db,{userId:OWNER,email:'share-owner@example.test',displayName:'Kovács Tervező'},'default'),true);
const plain=(name:string)=>({...validatePlan(structuredClone(seed)),name});
await insertPlan(OWNER,A,plain('A projekt'),'2026-01-02T00:00:00.000Z');await insertPlan(OWNER,B,plain('B projekt'),'2026-01-03T00:00:00.000Z');await insertPlan(OWNER,C,plain('C projekt'),'2026-01-04T00:00:00.000Z');
const grant=(id:string,project:string,mode:string)=>db.run('INSERT INTO billing_grants (id,user_id,project_id,mode,created_at) VALUES (?,?,?,?,?)',[id,OWNER,projectKey(OWNER,project),mode,2]);
await grant('paid-a',A,'live');await grant('sub-b',B,'sub_live');
const plansSnapshot=()=>JSON.stringify(sql.prepare('SELECT id,revision,data FROM plans ORDER BY id').all());
const plansBefore=plansSnapshot();

type Body={error?:string;code?:string;userId?:string;projectId?:string;link?:string;share?:ShareSummary;shares?:ShareSummary[];status?:string;canPdf?:boolean;limit?:number;removed?:number;plan?:{name:string;quote?:unknown;buildings:{floors:{id:string;background?:unknown}[]}[]};pdf?:boolean;backgroundFloors?:string[];expiresAt?:number;updatedAt?:string};
type Reply={status:number;body:Body;text:string;headers:Headers};
const reply=async(r:Response):Promise<Reply>=>{const text=await r.text();return {status:r.status,text,body:JSON.parse(text) as Body,headers:r.headers}};
const ownerReq=(method:string,c:string|null,body?:unknown,extra:Record<string,string>={})=>new Request(ORIGIN+'/api/plan-share',{method,headers:{host:HOST,'content-type':'application/json',origin:ORIGIN,...(c?{cookie:c}:{}),...extra},body:typeof body==='string'?body:JSON.stringify(body)});
const create=(c:string|null,body:Record<string,unknown>,extra:Record<string,string>={})=>POST(ownerReq('POST',c,body,extra)).then(reply);
const revoke=(c:string|null,body:Record<string,unknown>|string,extra:Record<string,string>={})=>DELETE(ownerReq('DELETE',c,body,extra)).then(reply);
const list=(c:string|null,projectId:string,extra:Record<string,string>={})=>GET(new Request(ORIGIN+'/api/plan-share?projectId='+encodeURIComponent(projectId),{headers:{host:HOST,...(c?{cookie:c}:{}),...extra}})).then(reply);
const open=(body:unknown,{origin=true,ip='',query=''}:{origin?:boolean;ip?:string;query?:string}={})=>view(new Request(ORIGIN+'/api/shared-plan'+query,{method:'POST',headers:{host:HOST,'content-type':'application/json',...(origin?{origin:ORIGIN}:{}),...(ip?{'x-real-ip':ip}:{})},body:typeof body==='string'?body:JSON.stringify(body)})).then(reply);
const token=(link?:string)=>{const m=/#t=([a-f0-9]{64})$/.exec(link||'');assert.ok(m,'a link fragmentben hordozza a tokent');return m[1]};
const made=async(c:string,body:Record<string,unknown>)=>{const r=await create(c,body);assert.equal(r.status,200,r.text);return {token:token(r.body.link),id:r.body.share!.id}};
const shareRows=(key:string)=>(sql.prepare('SELECT COUNT(*) AS n FROM plan_shares WHERE project_key = ?').get(key) as {n:number}).n;

// 1. Létrehozás-őrök
assert.equal((await create(null,{projectId:'default',userId:OWNER})).status,401);
assert.equal((await create(owner,{projectId:'default',userId:OWNER},{origin:'https://evil.example'})).status,403);
let r=await create(owner,{projectId:'default',userId:OTHER});assert.equal(r.status,409);assert.equal(r.body.code,'ACCOUNT_CHANGED');
r=await create(owner,{projectId:'default',userId:OWNER,days:14});assert.equal(r.status,400);assert.equal(r.body.code,'INVALID');assert.equal(r.body.error,'Az érvényesség 1, 7, 30 vagy 90 nap lehet.');
r=await create(owner,{projectId:'default',userId:OWNER,role:'edit'});assert.equal(r.status,400);assert.equal(r.body.error,'A megadott adatok érvénytelenek.','angol Zod-üzenet nem jut ki');
r=await POST(ownerReq('POST',owner,'x'.repeat(2001))).then(reply);assert.equal(r.status,413);assert.equal(r.body.code,'TOO_LARGE');
r=await create(owner,{projectId:U,userId:OWNER});assert.equal(r.status,409);assert.equal(r.body.code,'SAVE_REQUIRED');
r=await create(other,{projectId:'default',userId:OTHER});assert.equal(r.status,409);assert.equal(r.body.code,'SAVE_REQUIRED','a másik fiók a saját kulcsán keres');
r=await create(owner,{projectId:'default',userId:OWNER,label:'Kovács úr – megrendelő'});
assert.equal(r.status,200);assert.match(r.body.link||'',/^http:\/\/127\.0\.0\.1:5180\/megosztas#t=[a-f0-9]{64}$/);assert.match(r.headers.get('cache-control')||'',/no-store/);assert.match(r.headers.get('vary')||'',/Cookie/);
assert.deepEqual([r.body.userId,r.body.projectId,r.body.share?.label,r.body.share?.allowPdf,r.body.share?.lastViewedAt],[OWNER,'default','Kovács úr – megrendelő',false,null]);
assert.equal(r.body.share!.expiresAt-r.body.share!.createdAt,30*86_400_000,'alapértelmezés 30 nap');
const t1=token(r.body.link),s1=r.body.share!.id;
assert.equal((await list(null,'default')).status,401);
assert.equal((await list(owner,'default',{'sec-fetch-site':'cross-site'})).status,403);
r=await list(owner,'../x');assert.equal(r.status,400);assert.equal(r.body.code,'INVALID');

// 2. Tárolás: csak a lenyomat; a token nem kerül listába vagy DB-be.
assert.equal((sql.prepare('SELECT token_hash FROM plan_shares WHERE id = ?').get(s1) as {token_hash:string}).token_hash,await digest(t1));
assert.ok(!JSON.stringify(sql.prepare('SELECT * FROM plan_shares').all()).includes(t1));
r=await list(owner,'default');assert.equal(r.status,200);assert.deepEqual([r.body.userId,r.body.projectId,r.body.status,r.body.canPdf,r.body.limit,r.body.shares?.length],[OWNER,'default','active',true,10,1]);
assert.match(r.headers.get('cache-control')||'',/no-store/);
assert.ok(!/token/i.test(r.text)&&!/[a-f0-9]{64}/.test(r.text),'a listában nincs token vagy lenyomat');
assert.deepEqual(Object.keys(r.body.shares![0]).sort(),['allowPdf','createdAt','expiresAt','id','label','lastViewedAt']);
r=await list(other,'default');assert.deepEqual([r.body.status,r.body.shares],['missing',[]]);

// 3. Nyilvános nézet: fehérlistás, adatminimalizált válasz, védő fejlécekkel.
r=await open({token:t1});assert.equal(r.status,200,r.text);
assert.deepEqual(Object.keys(r.body).sort(),['backgroundFloors','expiresAt','pdf','plan','updatedAt']);
assert.equal(r.body.plan?.name,secretPlan.name);assert.equal(r.body.plan?.quote,undefined);assert.ok(r.body.plan!.buildings.every(b=>b.floors.every(f=>f.background===undefined)));
assert.deepEqual(r.body.backgroundFloors,['ground']);assert.equal(r.body.pdf,false);assert.equal(r.body.updatedAt,'2026-01-01T00:00:00.000Z');
for(const secret of [OWNER,'share-owner@example.test','Kovács Tervező','account:',s1,'Kovács úr','Titkos Ügyfél',assetId,'kovacs-alaprajz','revision'])assert.ok(!r.text.includes(secret),'a válasz nem tartalmazhatja: '+secret);
const publicHeaders=(h:Headers)=>{assert.match(h.get('cache-control')||'',/no-store/);assert.match(h.get('x-robots-tag')||'',/noindex/);assert.equal(h.get('referrer-policy'),'no-referrer');assert.equal(h.get('x-content-type-options'),'nosniff');assert.equal(h.get('set-cookie'),null)};
publicHeaders(r.headers);
const viewed=(id:string)=>(sql.prepare('SELECT last_viewed_at FROM plan_shares WHERE id = ?').get(id) as {last_viewed_at:number|null}).last_viewed_at;
const firstView=viewed(s1);assert.ok(typeof firstView==='number'&&firstView>0);
await open({token:t1});assert.equal(viewed(s1),firstView,'10 percen belül nem frissül újra');

// 4. Egységes 404 minden hibaágon; a query-ben küldött token nem számít.
const unknown='0'.repeat(64),failures=[await open({token:unknown}),await open({token:'abc'}),await open({token:t1.toUpperCase()}),await open('{}'),await open({token:t1,extra:1}),await open('{}',{query:'?t='+t1}),await open('{nem json'),await open({token:t1,purpose:'json'})];
for(const f of failures){assert.equal(f.status,404);assert.equal(f.text,failures[0].text);publicHeaders(f.headers)}
assert.equal(failures[0].body.code,'SHARE_UNAVAILABLE');
const unavailable=failures[0].text;
r=await open({token:t1},{origin:false});assert.equal(r.status,403);assert.equal(r.body.code,'FORBIDDEN');publicHeaders(r.headers);
r=await open('x'.repeat(301));assert.equal(r.status,413);assert.equal(r.body.code,'TOO_LARGE');
const gone=async(t:string,message:string)=>{const g=await open({token:t});assert.equal(g.status,404,message);assert.equal(g.text,unavailable,message)};

// 5. PDF és billing: allow_pdf ÉS a tulajdonos aktuális exportjoga.
r=await open({token:t1,purpose:'pdf'});assert.equal(r.status,403);assert.equal(r.body.code,'PDF_UNAVAILABLE');
const t2=(await made(owner,{projectId:'default',userId:OWNER,allowPdf:true})).token;
r=await open({token:t2});assert.equal(r.body.pdf,true);
r=await open({token:t2,purpose:'pdf'});assert.equal(r.status,200);assert.deepEqual(r.body,{pdf:true});
r=await create(owner,{projectId:C,userId:OWNER,allowPdf:true});assert.equal(r.status,402);assert.equal(r.body.code,'EXPORT_REQUIRED');
r=await list(owner,C);assert.deepEqual([r.body.status,r.body.canPdf],['active',false]);
const c1=await made(owner,{projectId:C,userId:OWNER});
r=await open({token:c1.token});assert.equal(r.status,200);assert.equal(r.body.pdf,false);
sql.prepare('UPDATE plan_shares SET allow_pdf = 1 WHERE id = ?').run(c1.id);
r=await open({token:c1.token});assert.equal(r.body.pdf,false,'kézzel engedélyezett PDF exportjog nélkül sem');
r=await open({token:c1.token,purpose:'pdf'});assert.equal(r.status,403,'a billing-megkerülés zárva');
await db.run('INSERT INTO billing_subscriptions (id,user_id,mode,order_id,customer_id,status,paid_until,cancel_at_period_end,revision,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',['sub',OWNER,'live','order','customer','active',Date.now()+60000,0,1,1]);
const b1=await made(owner,{projectId:B,userId:OWNER,allowPdf:true});
r=await open({token:b1.token});assert.equal(r.status,200);assert.equal(r.body.pdf,true);
const a1=await made(owner,{projectId:A,userId:OWNER,allowPdf:true});
r=await open({token:a1.token});assert.equal(r.body.pdf,true);assert.ok(!r.text.includes(A),'a projekt-uuid nem kerül a válaszba');
await db.run('UPDATE billing_subscriptions SET paid_until = ?',[Date.now()-1]);
await gone(b1.token,'lejárt előfizetés: a sub_live projekt linkje szünetel');
r=await list(owner,B);assert.deepEqual([r.body.status,r.body.canPdf,r.body.shares?.length],['locked',false,1],'szünetel, nem törlődik');
r=await create(owner,{projectId:B,userId:OWNER});assert.equal(r.status,402);assert.equal(r.body.code,'SUBSCRIPTION_REQUIRED');
r=await open({token:a1.token});assert.equal(r.status,200);assert.equal(r.body.pdf,true,'egyszeri vásárlás: előfizetés nélkül is letölthető');
await gone(c1.token,'grant nélküli projekt: volt előfizetés, ezért zárolt');

// 12. Invariáns: a megosztás nem írja a terveket.
assert.equal(plansSnapshot(),plansBefore);

// 6. Életciklus: archiválás szüneteltet, lomtár véglegesen töröl.
await db.run('UPDATE plans SET state = ? WHERE id = ?',['archived',projectKey(OWNER,'default')]);
await gone(t1,'archivált projekt');
r=await create(owner,{projectId:'default',userId:OWNER});assert.equal(r.status,409);assert.equal(r.body.code,'PROJECT_INACTIVE');
r=await list(owner,'default');assert.deepEqual([r.body.status,r.body.canPdf,r.body.shares?.length],['inactive',false,2]);
await db.run('UPDATE plans SET state = ? WHERE id = ?',['active',projectKey(OWNER,'default')]);
r=await open({token:t1});assert.equal(r.status,200,'visszaállítás után a lejáratig újra él');
const patch=async(state:string)=>{const rev=(sql.prepare('SELECT revision FROM plans WHERE id = ?').get(projectKey(OWNER,'default')) as {revision:number}).revision;return PATCH(new Request(ORIGIN+'/api/plan',{method:'PATCH',headers:{host:HOST,'content-type':'application/json',origin:ORIGIN,cookie:owner},body:JSON.stringify({projectId:'default',state,revision:rev,userId:OWNER})}))};
assert.equal((await patch('trash')).status,200);
assert.equal(shareRows(projectKey(OWNER,'default')),0,'lomtár: a linkek törlődnek');
await gone(t1,'lomtáras projekt');await gone(t2,'lomtáras projekt');
assert.equal((await patch('active')).status,200);
await gone(t1,'a visszaállítás nem éleszti újra');

// 7. Lejárat
sql.prepare('UPDATE plan_shares SET expires_at = ? WHERE id = ?').run(Date.now()-1,a1.id);
await gone(a1.token,'lejárt link');
r=await list(owner,A);assert.deepEqual(r.body.shares,[]);
assert.equal(sql.prepare('SELECT id FROM plan_shares WHERE id = ?').get(a1.id),undefined,'a lejárt sor törlődött');

// 8. Visszavonás: IDOR-védelem, egyenként és mind.
const a2=await made(owner,{projectId:A,userId:OWNER});
for(const projectId of ['default',A]){r=await revoke(other,{projectId,userId:OTHER,id:a2.id});assert.equal(r.status,404);assert.equal(r.body.code,'NOT_FOUND')}
assert.equal((await open({token:a2.token})).status,200,'idegen visszavonás nem hat');
assert.equal((await revoke(owner,{projectId:A,userId:OWNER,id:a2.id},{origin:'https://evil.example'})).status,403);
assert.equal((await revoke(owner,{projectId:A,userId:OWNER,id:a2.id},{origin:''})).status,403);
r=await revoke(owner,{projectId:A,userId:OTHER,id:a2.id});assert.equal(r.status,409);assert.equal(r.body.code,'ACCOUNT_CHANGED');
r=await revoke(owner,{projectId:A,userId:OWNER,id:a2.id,all:true});assert.equal(r.status,400);assert.equal(r.body.error,'Adj meg pontosan egy linket, vagy kérd az összes visszavonását.');
r=await revoke(owner,'x'.repeat(1001));assert.equal(r.status,413);
assert.equal((await revoke(null,{projectId:A,userId:OWNER,id:a2.id})).status,401);
r=await revoke(owner,{projectId:A,userId:OWNER,id:a2.id});assert.equal(r.status,200);assert.deepEqual([r.body.userId,r.body.projectId,r.body.removed],[OWNER,A,1]);
await gone(a2.token,'visszavont link');
r=await revoke(owner,{projectId:A,userId:OWNER,id:a2.id});assert.equal(r.status,404,'már nem létezik');
const a3=await made(owner,{projectId:A,userId:OWNER}),a4=await made(owner,{projectId:A,userId:OWNER});
r=await revoke(owner,{projectId:A,userId:OWNER,all:true});assert.equal(r.body.removed,2);
await gone(a3.token,'összes visszavonva');await gone(a4.token,'összes visszavonva');
assert.equal(shareRows(projectKey(OWNER,B)),1,'más projekt linkje megmarad');

// 9. Jelszó-visszaállítás (auth_version) minden linket megszüntet.
const a5=await made(owner,{projectId:A,userId:OWNER});
assert.equal((await open({token:a5.token})).status,200);
await db.run('UPDATE users SET auth_version = auth_version + 1 WHERE id = ?',[OWNER]);
await gone(a5.token,'jelszócsere után');
owner=await session(OWNER,1);
r=await list(owner,A);assert.deepEqual(r.body.shares,[]);
assert.equal((sql.prepare('SELECT COUNT(*) AS n FROM plan_shares WHERE owner_id = ?').get(OWNER) as {n:number}).n,0,'a régi linkek takarítva');

// 10. Projektenként legfeljebb 10 érvényes link.
await insertPlan(OTHER,'default',plain('Másik terv'),'2026-02-01T00:00:00.000Z');
assert.equal(await claimProject(db,{userId:OTHER,email:'share-other@example.test',displayName:'Másik Fiók'},'default'),true);
const others:{token:string;id:string}[]=[];
for(let i=0;i<10;i++)others.push(await made(other,{projectId:'default',userId:OTHER,label:'Link '+(i+1)}));
r=await create(other,{projectId:'default',userId:OTHER});assert.equal(r.status,409);assert.equal(r.body.code,'SHARE_LIMIT');
r=await list(other,'default');assert.equal(r.body.shares?.length,10);assert.equal(r.body.shares?.[0].label,'Link 10','legújabb elöl');
assert.equal((await revoke(other,{projectId:'default',userId:OTHER,id:others[0].id})).status,200);
others.shift();others.push(await made(other,{projectId:'default',userId:OTHER,allowPdf:true}));

// 11. Saját rate-limit névtér; a bejelentkezési keret érintetlen.
for(let i=0;i<120;i++){const f=await open({token:unknown},{ip:'203.0.113.9'});assert.equal(f.status,404)}
r=await open({token:unknown},{ip:'203.0.113.9'});assert.equal(r.status,429);assert.equal(r.headers.get('retry-after'),'900');assert.equal(r.body.code,'RATE_LIMITED');publicHeaders(r.headers);
assert.equal(await allowAttempt(db,new Request(ORIGIN+'/',{headers:{'x-real-ip':'203.0.113.9'}}),'x@example.test'),true,'a login ip: kerete érintetlen');
assert.equal((await open({token:others[0].token},{ip:'198.51.100.7'})).status,200);
// IPv6: a /64-es előtag számít, a címek forgatása nem ad új keretet; az IPv4-be leképezett cím az IPv4 keretét fogyasztja.
for(let i=0;i<120;i++){const f=await open({token:unknown},{ip:'2001:db8:1:2::'+(i+1).toString(16)});assert.equal(f.status,404)}
r=await open({token:unknown},{ip:'2001:DB8:1:2:ffff:ffff:ffff:ffff'});assert.equal(r.status,429,'a /64-en belüli címforgatás nem ad új keretet');
assert.equal((await open({token:unknown},{ip:'2001:db8:1:3::1'})).status,404,'másik /64 saját keretet kap');
assert.equal((await open({token:unknown},{ip:'::ffff:203.0.113.9'})).status,429,'az IPv4-be leképezett cím az IPv4 keretét fogyasztja');

// 13. Kliens-segédek (fetch-mock a route-okra).
let captured:RequestInit|undefined;
const route=(handler:(req:Request)=>Promise<Response>,cookie='')=>async(input:string|URL|Request,init?:RequestInit)=>{captured=init;const headers=new Headers(init?.headers);headers.set('host',HOST);headers.set('origin',ORIGIN);if(cookie)headers.set('cookie',cookie);return handler(new Request(ORIGIN+String(input),{method:init?.method,headers,body:init?.body}))};
globalThis.fetch=route(view) as typeof fetch;
const pdfLink=others[others.length-1];
const shared=await openSharedPlan(pdfLink.token);assert.equal(shared.plan.name,'Másik terv');assert.equal(shared.pdf,true);assert.deepEqual(shared.backgroundFloors,[]);
assert.equal(captured?.credentials,'omit');assert.equal(captured?.referrerPolicy,'no-referrer');assert.equal(captured?.method,'POST');
assert.deepEqual(await checkSharedPdf(pdfLink.token),{allowed:true});
assert.equal((await checkSharedPdf(others[0].token)).allowed,false,'allow_pdf nélkül');
assert.equal((await checkSharedPdf(unknown)).allowed,false,'ismeretlen link');
await assert.rejects(openSharedPlan(unknown),(e:unknown)=>e instanceof ShareError&&e.status===404&&e.code==='SHARE_UNAVAILABLE');
globalThis.fetch=(async()=>{throw Error('offline')}) as typeof fetch;
assert.deepEqual((await checkSharedPdf(pdfLink.token)).allowed,false,'hálózati hiba: fail closed');
globalThis.fetch=route(GET,other) as typeof fetch;
assert.equal((await fetchShares(OTHER,'default')).shares.length,10);
await assert.rejects(fetchShares(OWNER,'default'),(e:unknown)=>e instanceof ShareError&&e.code==='ACCOUNT_CHANGED','fiókváltás észlelése');

// 14. Fióktörlés: FK CASCADE.
sql.prepare('DELETE FROM users WHERE id = ?').run(OTHER);
assert.equal((sql.prepare('SELECT COUNT(*) AS n FROM plan_shares WHERE owner_id = ?').get(OTHER) as {n:number}).n,0);
await gone(pdfLink.token,'törölt fiók linkje');
// 15. Versenyhelyzetek: a beszúrás egyetlen feltételes utasítás (aktív állapot + 10-es korlát + auth_version).
const RACE=crypto.randomUUID();
await db.run('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)',[RACE,'share-race@example.test','Verseny Fiók','unused',1]);
const race=await session(RACE),raceKey=projectKey(RACE,'default');
await insertPlan(RACE,'default',plain('Verseny terv'),'2026-03-01T00:00:00.000Z');
assert.equal(await claimProject(db,{userId:RACE,email:'share-race@example.test',displayName:'Verseny Fiók'},'default'),true);
const clearLimits=()=>sql.prepare('DELETE FROM auth_limits').run();
const raceCreate=()=>create(race,{projectId:'default',userId:RACE});
let burst=await Promise.all(Array.from({length:30},raceCreate));
assert.equal(burst.filter(b=>b.status===200).length,10,'30 párhuzamos kérésből pontosan 10 sikerül');
assert.ok(burst.every(b=>b.status===200||b.status===409&&b.body.code==='SHARE_LIMIT'),'a többi SHARE_LIMIT, nem 503');
assert.equal(shareRows(raceKey),10,'párhuzamosan sem lépi túl a korlátot');
assert.equal((await revoke(race,{projectId:'default',userId:RACE,all:true})).body.removed,10);clearLimits();
for(let i=0;i<9;i++)await made(race,{projectId:'default',userId:RACE});
burst=await Promise.all(Array.from({length:6},raceCreate));
assert.equal(burst.filter(b=>b.status===200).length,1,'9 meglévő mellett csak egy fér be');assert.equal(shareRows(raceKey),10);
// Létrehozás és lomtárba helyezés egyszerre, sokféle ütemezéssel: a lomtár után nem marad link, a visszaállítás sem éleszti újra.
const tick=async(n:number)=>{for(let i=0;i<n;i++)await new Promise(done=>setImmediate(done))};
const raceRevision=()=>(sql.prepare('SELECT revision FROM plans WHERE id = ?').get(raceKey) as {revision:number}).revision;
const raceState=(state:string,revision:number)=>PATCH(new Request(ORIGIN+'/api/plan',{method:'PATCH',headers:{host:HOST,'content-type':'application/json',origin:ORIGIN,cookie:race},body:JSON.stringify({projectId:'default',state,revision,userId:RACE})})).then(reply);
const orders=new Set<string>();
for(let n=0;n<60;n++){
 clearLimits();sql.prepare('DELETE FROM plan_shares WHERE owner_id = ?').run(RACE);sql.prepare('UPDATE plans SET state = ? WHERE id = ?').run('active',raceKey);
 const [c,p]=await Promise.all([raceCreate(),tick(n).then(()=>raceState('trash',raceRevision()))]);
 assert.equal(p.status,200,p.text);
 assert.ok(c.status===200||c.status===409&&c.body.code==='PROJECT_INACTIVE','létrehozás: '+c.status+' '+c.text);
 assert.equal(shareRows(raceKey),0,'lomtár után nem marad link (ütem: '+n+')');
 orders.add(c.status===200?'a létrehozás előbb':'a lomtár előbb');
 if(c.status===200){assert.equal((await raceState('active',raceRevision())).status,200);await gone(token(c.body.link),'lomtár + visszaállítás után sem él (ütem: '+n+')')}
}
assert.equal(orders.size,2,'mindkét sorrend előfordult');

// 16. Hiányzó IP-fejléc: közös keret, nem korlátlan. A lejárt keretsorokat a nyilvános útvonal is takarítja.
clearLimits();
for(let i=0;i<120;i++)assert.equal((await open({token:unknown})).status,404);
r=await open({token:unknown});assert.equal(r.status,429,'IP-fejléc nélkül is van keret');
assert.equal((await open({token:unknown},{ip:'198.51.100.99'})).status,404,'a valódi IP-vel érkező kérés saját keretet kap');
const expiredLimit=()=>sql.prepare('INSERT INTO auth_limits (`key`,attempts,expires_at) VALUES (?,?,?)').run('lejart-keret',1,Date.now()-1);
const limitLeft=()=>sql.prepare('SELECT 1 AS x FROM auth_limits WHERE `key` = ?').get('lejart-keret')!==undefined;
const random=Math.random;
try{
 expiredLimit();Math.random=()=>.99;await open({token:unknown},{ip:'198.51.100.98'});assert.equal(limitLeft(),true,'többnyire nem takarít');
 Math.random=()=>0;await open({token:unknown},{ip:'198.51.100.98'});assert.equal(limitLeft(),false,'ritkán a nyilvános útvonal is takarít');
}finally{Math.random=random}
// 17. Hiányzó APP_ORIGIN: 503, árva sor nélkül.
const appOrigin=(env as Record<string,unknown>).APP_ORIGIN;Object.assign(env,{APP_ORIGIN:''});
try{const before=shareRows(raceKey);sql.prepare('UPDATE plans SET state = ? WHERE id = ?').run('active',raceKey);clearLimits();
 r=await create(race,{projectId:'default',userId:RACE});assert.equal(r.status,503);assert.equal(shareRows(raceKey),before,'nem marad árva link')}
finally{Object.assign(env,{APP_ORIGIN:appOrigin})}
console.log('PASS: tervmegosztás API – létrehozás-őrök, csak lenyomat tárolva, adatminimalizált nyilvános nézet és fejlécek, egységes 404, PDF = allow_pdf + exportjog, archiválás/zárolás szüneteltet, lomtár/lejárat/visszavonás/jelszócsere/fióktörlés megszüntet, IDOR és CSRF, 10-es korlát (párhuzamosan is), lomtár–létrehozás verseny, saját rate limit (IPv6 /64, hiányzó IP-fejléc), fail-closed kliens.');
