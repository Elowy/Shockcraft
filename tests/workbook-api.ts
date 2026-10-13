import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {env} from '../db/node-env';
import {makeSession} from '../lib/auth';
import {GET,PUT} from '../app/api/workbook/route';
import {projectKey} from '../lib/projects';
import {emptyWorkbook,newTask,removeClient,removeTask,setTaskStatus,assignClient,upsertTask,upsertClient,validateWorkbook,type Workbook,type Client,type ProjectStateRow} from '../lib/workbook';
import type {Database} from '../db/database';
const sql=new DatabaseSync(':memory:');
for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('drizzle/'+f,'utf8').replaceAll('--> statement-breakpoint',''));
type Params=(string|number|null)[];
const db:Database={kind:'d1',async first<T>(s:string,p:Params=[]){return (sql.prepare(s).get(...p)||null) as T|null},async all<T>(s:string,p:Params=[]){return sql.prepare(s).all(...p) as T[]},async run(s,p=[]){return Number(sql.prepare(s).run(...p).changes)}};
Object.assign(env,{APP_ORIGIN:'http://127.0.0.1:5180',ADMIN_USER_ID:'admin',DB:{prepare(s:string){return {bind(...p:Params){return {first:()=>db.first(s,p),all:async()=>({results:await db.all(s,p)}),run:async()=>({meta:{changes:await db.run(s,p)}})}}}}}});
for(const id of ['owner','other'])await db.run('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)',[id,id+'@example.test',id,'unused',1]);
const cookie=async(userId:string)=>(await makeSession(db,userId,new Headers({host:'127.0.0.1:5180'}),0)).split(';')[0];
const owner=await cookie('owner'),other=await cookie('other');
const A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222',C='33333333-3333-4333-8333-333333333333',D='44444444-4444-4444-8444-444444444444',X='99999999-9999-4999-8999-999999999999';
const K='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',L='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',N='cccccccc-cccc-4ccc-8ccc-cccccccccccc',T='2026-10-09T08:00:00.000Z';
const plan=(id:string,state:string,updated:string)=>db.run('INSERT INTO plans(id,data,revision,updated_at,state) VALUES (?,?,?,?,?)',[projectKey('owner',id),JSON.stringify({name:'Projekt '+id}),3,updated,state]);
await plan('default','active','2026-01-01T00:00:00Z');await plan(A,'active','2026-01-02T00:00:00Z');await plan(B,'archived','2026-01-03T00:00:00Z');await plan(C,'trash','2026-01-04T00:00:00Z');await plan(D,'active','2026-01-05T00:00:00Z');
const grant=(id:string,project:string,mode:string)=>db.run('INSERT INTO billing_grants (id,user_id,project_id,mode,created_at) VALUES (?,?,?,?,?)',[id,'owner',projectKey('owner',project),mode,1]);
await grant('free:owner','default','free');await grant('paid-a',A,'live');await grant('sub-d',D,'sub_live');
const plansSnapshot=()=>JSON.stringify(sql.prepare('SELECT id,revision,data FROM plans ORDER BY id').all());
const plansBefore=plansSnapshot();
type Body={workbook:Workbook;revision:number;userId:string;projects:ProjectStateRow[];error?:string;code?:string;projectId?:string;limits?:{clients:number;tasks:number;bytes:number}};
const url='http://127.0.0.1:5180/api/workbook';
async function check(r:Response){assert.match(r.headers.get('cache-control')||'',/no-store/);assert.match(r.headers.get('vary')||'',/Cookie/);return {status:r.status,body:await r.json() as Body}}
const get=(c:string|null,extra:Record<string,string>={})=>GET(new Request(url,{headers:{host:'127.0.0.1:5180',...(c?{cookie:c}:{}),...extra}})).then(check);
const put=(c:string,body:unknown,{origin=true}={})=>PUT(new Request(url,{method:'PUT',headers:{host:'127.0.0.1:5180','content-type':'application/json',cookie:c,...(origin?{origin:'http://127.0.0.1:5180'}:{})},body:typeof body==='string'?body:JSON.stringify(body)})).then(check);
const stored=(userId='owner')=>sql.prepare('SELECT data,revision FROM workbooks WHERE user_id = ?').get(userId) as {data:string;revision:number}|undefined;
const client=(id:string,name:string):Client=>({id,name,company:'',taxNumber:'',postalCode:'',city:'',address:'',phone:'',email:'',note:'',archived:false,createdAt:T,updatedAt:T});
const task=(id:string,title:string,projectId:string|null,clientId:string|null=null)=>({...newTask({title,note:'',due:'2026-10-09',projectId,clientId},T),id});

// 1. Hitelesítés és cross-site
assert.equal((await get(null)).status,401);
assert.equal((await get(owner,{'sec-fetch-site':'cross-site'})).status,403);

// 2. Üres munkafüzet és projektállapotok
let r=await get(owner);assert.equal(r.status,200);assert.equal(r.body.revision,0);assert.deepEqual(r.body.workbook,emptyWorkbook());assert.equal(r.body.userId,'owner');assert.deepEqual(r.body.limits,{clients:500,tasks:1000,bytes:1_000_000});
assert.equal(r.body.projects.length,5);
assert.deepEqual(Object.fromEntries(r.body.projects.map(p=>[p.id,[p.state,p.locked]])),{default:['active',false],[A]:['active',false],[B]:['archived',false],[C]:['trash',false],[D]:['active',true]});

// 3. Hibás PUT-kérések
const first={...emptyWorkbook(),clients:[client(K,'Kiss Anna')],assignments:[{projectId:'default',clientId:K}],tasks:[task(N,'Felmérés',A)]};
assert.equal((await put(owner,{workbook:first,revision:0,userId:'owner'},{origin:false})).status,403);
r=await put(owner,{workbook:first,revision:0,userId:'other'});assert.equal(r.status,409);assert.equal(r.body.code,'ACCOUNT_CHANGED');
r=await put(owner,{workbook:{...first,clients:[client(K,' ')]},revision:0,userId:'owner'});assert.equal(r.status,400);assert.equal(r.body.code,'INVALID');assert.match(r.body.error||'',/nevét/);
assert.equal((await put(owner,{workbook:first,revision:-1,userId:'owner'})).status,400);
assert.equal((await put(owner,{workbook:first,revision:'1',userId:'owner'})).status,400);
r=await put(owner,'{nem json');assert.equal(r.status,400);assert.equal(r.body.code,'INVALID');
r=await put(owner,'x'.repeat(1_000_001));assert.equal(r.status,413);assert.equal(r.body.code,'TOO_LARGE');
assert.equal(stored(),undefined,'hibás kérés nem ír');

// 4. Első mentés és ütközés
r=await put(owner,{workbook:first,revision:0,userId:'owner'});assert.equal(r.status,200);assert.equal(r.body.revision,1);assert.equal(r.body.userId,'owner');assert.equal(r.body.projects.length,5);
r=await put(owner,{workbook:first,revision:0,userId:'owner'});assert.equal(r.status,409);assert.equal(r.body.code,'WORKBOOK_CONFLICT');
let wb=(await get(owner)).body.workbook;assert.deepEqual(wb,validateWorkbook(first));

// 5. Projektállapot-szabályok rev 1-ről
const rejected=async(next:Workbook,status:number,code:string,projectId:string,rev=1)=>{const res=await put(owner,{workbook:next,revision:rev,userId:'owner'});assert.equal(res.status,status,code+' '+projectId);assert.equal(res.body.code,code);assert.equal(res.body.projectId,projectId);assert.equal(stored()?.revision,rev,'a hibás kérés nem változtat revisiont')};
await rejected(upsertTask(wb,task(crypto.randomUUID(),'Archivált projekt',B)),409,'PROJECT_INACTIVE',B);
await rejected(upsertTask(wb,task(crypto.randomUUID(),'Lomtár',C)),409,'PROJECT_INACTIVE',C);
await rejected(upsertTask(wb,task(crypto.randomUUID(),'Zárolt',D)),402,'SUBSCRIPTION_REQUIRED',D);
await rejected(upsertTask(wb,task(crypto.randomUUID(),'Ismeretlen',X)),409,'SAVE_REQUIRED',X);
await rejected(assignClient(wb,B,K),409,'PROJECT_INACTIVE',B);
const g1=crypto.randomUUID(),k1=crypto.randomUUID();
r=await put(owner,{workbook:upsertTask(upsertTask(wb,task(g1,'Általános',null)),task(k1,'Ügyfélhez kötött',null,K)),revision:1,userId:'owner'});assert.equal(r.status,200);assert.equal(r.body.revision,2);wb=r.body.workbook;

// 6. A archiválása után a teendője befagy, a törlése engedett
await db.run('UPDATE plans SET state = ? WHERE id = ?',['archived',projectKey('owner',A)]);
await rejected(setTaskStatus(wb,N,'doing',T),409,'PROJECT_INACTIVE',A,2);
await rejected(upsertClient(setTaskStatus(wb,N,'done',T),client(L,'Nagy Béla')),409,'PROJECT_INACTIVE',A,2);
assert.equal((await get(owner)).body.workbook.clients.length,1,'atomikus: az új ügyfél sem mentődött');
r=await put(owner,{workbook:upsertClient(wb,client(L,'Nagy Béla')),revision:2,userId:'owner'});assert.equal(r.status,200);assert.equal(r.body.revision,3);wb=r.body.workbook;
r=await put(owner,{workbook:removeTask(wb,N),revision:3,userId:'owner'});assert.equal(r.status,200);assert.equal(r.body.revision,4);wb=r.body.workbook;assert.ok(!wb.tasks.some(t=>t.id===N));

// 7. SQL-lel beírt, zárolt projekthez kötött teendő: módosítás 402, törlés engedett
const locked=crypto.randomUUID();sql.prepare('UPDATE workbooks SET data = ? WHERE user_id = ?').run(JSON.stringify(upsertTask(wb,task(locked,'Zárolt teendő',D))),'owner');
wb=(await get(owner)).body.workbook;assert.equal(stored()?.revision,4);
await rejected(setTaskStatus(wb,locked,'done',T),402,'SUBSCRIPTION_REQUIRED',D,4);
r=await put(owner,{workbook:removeTask(wb,locked),revision:4,userId:'owner'});assert.equal(r.status,200);assert.equal(r.body.revision,5);wb=r.body.workbook;

// 8. Ügyfél törlése
r=await put(owner,{workbook:{...wb,clients:wb.clients.filter(c=>c.id!==K)},revision:5,userId:'owner'});assert.equal(r.status,400);assert.equal(r.body.code,'INVALID');
r=await put(owner,{workbook:removeClient(wb,K,T),revision:5,userId:'owner'});assert.equal(r.status,200);assert.equal(r.body.revision,6);wb=r.body.workbook;
assert.equal(wb.tasks.find(t=>t.id===k1)?.clientId,null);assert.deepEqual(wb.assignments,[]);assert.deepEqual(wb.clients.map(c=>c.id),[L]);

// 9. Izoláció
const ownerRow=JSON.stringify(stored());
r=await get(other);assert.equal(r.status,200);assert.equal(r.body.revision,0);assert.deepEqual(r.body.workbook,emptyWorkbook());assert.deepEqual(r.body.projects,[]);assert.equal(r.body.userId,'other');
r=await put(other,{workbook:{...emptyWorkbook(),tasks:[task(crypto.randomUUID(),'Idegen projekt',A)]},revision:0,userId:'other'});assert.equal(r.status,409);assert.equal(r.body.code,'SAVE_REQUIRED');assert.equal(r.body.projectId,A);
r=await put(other,{workbook:{...emptyWorkbook(),tasks:[task(crypto.randomUUID(),'Alapprojekt',null)].map(t=>({...t,projectId:'default'}))},revision:0,userId:'other'});assert.equal(r.status,409);assert.equal(r.body.code,'SAVE_REQUIRED');
r=await put(other,{workbook:first,revision:6,userId:'owner'});assert.equal(r.status,409);assert.equal(r.body.code,'ACCOUNT_CHANGED');
assert.equal(JSON.stringify(stored()),ownerRow,'a tulajdonos munkafüzete változatlan');assert.equal(stored('other'),undefined);

// 10. Autosave-invariáns: a plans sorai (id, revision, data) változatlanok
assert.equal(plansSnapshot(),plansBefore);
console.log('PASS: ügyfél- és teendőkezelés API');
