import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {env} from '../db/node-env';
import {makeSession} from '../lib/auth';
import {GET,POST} from '../app/api/backgrounds/route';
import type {Database} from '../db/database';
const sql=new DatabaseSync(':memory:');
for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('drizzle/'+f,'utf8').replaceAll('--> statement-breakpoint',''));
type Params=(string|number|null)[];
const db:Database={kind:'d1',async first<T>(s:string,p:Params=[]){return (sql.prepare(s).get(...p)||null) as T|null},async all<T>(s:string,p:Params=[]){return sql.prepare(s).all(...p) as T[]},async run(s,p=[]){return Number(sql.prepare(s).run(...p).changes)}};
const objects=new Map<string,Uint8Array>();
Object.assign(env,{
 APP_ORIGIN:'http://127.0.0.1:5180',
 BACKGROUNDS:{async put(key:string,bytes:Uint8Array){objects.set(key,bytes)},async get(key:string){const bytes=objects.get(key);return bytes?{body:new Blob([bytes as BlobPart]).stream()}:null}},
 DB:{prepare(s:string){return {bind(...p:Params){return {first:()=>db.first(s,p),all:async()=>({results:await db.all(s,p)}),run:async()=>({meta:{changes:await db.run(s,p)}})}}}}}
});
for(const id of ['buyer','other'])await db.run('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)',[id,id+'@example.test',id,'unused',1]);
const cookies:Record<string,string>={};for(const id of ['buyer','other'])cookies[id]=(await makeSession(db,id,new Headers({host:'127.0.0.1:5180'}),0)).split(';')[0];
const jpeg=Uint8Array.from([255,216,255,192,0,11,8,0,100,0,200,1,1,17,0,255,217]);
const post=(user='buyer',body:Uint8Array=jpeg,origin='http://127.0.0.1:5180')=>POST(new Request('http://127.0.0.1:5180/api/backgrounds',{method:'POST',headers:{host:'127.0.0.1:5180',cookie:cookies[user]||'',origin,'x-shockcraft-user':user,'content-type':'image/jpeg'},body:body as BodyInit}));
assert.equal((await post('guest')).status,401);assert.equal((await post()).status,402);
await db.run('INSERT INTO billing_subscriptions VALUES (?,?,?,?,?,?,?,?,?,?)',['sub','buyer','live','order','customer','active',Date.now()+60000,0,1,1]);
assert.equal((await post('buyer',jpeg,'https://other.example')).status,403);
assert.equal((await post('buyer',new TextEncoder().encode('<svg>'))).status,400);
assert.equal((await post('buyer',new Uint8Array(2_000_001))).status,413);
const uploaded=await post();assert.equal(uploaded.status,200);const {assetId}=await uploaded.json() as {assetId:string};assert.equal(objects.size,1);
const get=(user:string)=>GET(new Request('http://127.0.0.1:5180/api/backgrounds?asset='+assetId,{headers:{host:'127.0.0.1:5180',cookie:cookies[user]||''}}));
assert.equal((await get('other')).status,404);assert.equal((await get('guest')).status,401);const own=await get('buyer');assert.equal(own.status,200);assert.deepEqual(new Uint8Array(await own.arrayBuffer()),jpeg);assert.match(own.headers.get('cache-control')||'',/no-store/);
await db.run('UPDATE billing_subscriptions SET paid_until=0');assert.equal((await post()).status,402);assert.equal((await get('buyer')).status,200);
console.log('Background API: authorization, subscription, size, validation and owner isolation passed.');
