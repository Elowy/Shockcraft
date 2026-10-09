import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {env} from '../db/node-env';
import {makeSession} from '../lib/auth';
import {GET,PUT} from '../app/api/catalog/route';
import {emptyCatalog,validateCatalog,type Catalog,type Product} from '../lib/catalog';
import type {Database} from '../db/database';
const sql=new DatabaseSync(':memory:');
const migrations=readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort();
assert.ok(migrations.some(f=>f.startsWith('0011_')),'a 0011-es migráció betöltődik');
for(const f of migrations)sql.exec(readFileSync('drizzle/'+f,'utf8').replaceAll('--> statement-breakpoint',''));
sql.exec('PRAGMA foreign_keys=ON');
type Params=(string|number|null)[];
const db:Database={kind:'d1',async first<T>(s:string,p:Params=[]){return (sql.prepare(s).get(...p)||null) as T|null},async all<T>(s:string,p:Params=[]){return sql.prepare(s).all(...p) as T[]},async run(s,p=[]){return Number(sql.prepare(s).run(...p).changes)}};
Object.assign(env,{APP_ORIGIN:'http://127.0.0.1:5180',ADMIN_USER_ID:'admin',DB:{prepare(s:string){return {bind(...p:Params){return {first:()=>db.first(s,p),all:async()=>({results:await db.all(s,p)}),run:async()=>({meta:{changes:await db.run(s,p)}})}}}}}});
for(const id of ['owner','other'])await db.run('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)',[id,id+'@example.test',id,'unused',1]);
const cookie=async(userId:string)=>(await makeSession(db,userId,new Headers({host:'127.0.0.1:5180'}),0)).split(';')[0];
const owner=await cookie('owner'),other=await cookie('other');
await db.run('INSERT INTO plans(id,data,revision,updated_at,state) VALUES (?,?,?,?,?)',['account:owner',JSON.stringify({name:'Projekt'}),3,'2026-01-01T00:00:00Z','active']);
const plansSnapshot=()=>JSON.stringify(sql.prepare('SELECT id,revision,data FROM plans ORDER BY id').all());
const plansBefore=plansSnapshot();
type Body={catalog:Catalog;revision:number;userId:string;error?:string;code?:string;limits?:{products:number;bytes:number}};
const url='http://127.0.0.1:5180/api/catalog';
async function check(r:Response){assert.match(r.headers.get('cache-control')||'',/no-store/);assert.match(r.headers.get('vary')||'',/Cookie/);return {status:r.status,body:await r.json() as Body}}
const get=(c:string|null,extra:Record<string,string>={})=>GET(new Request(url,{headers:{host:'127.0.0.1:5180',...(c?{cookie:c}:{}),...extra}})).then(check);
const put=(c:string|null,body:unknown,{origin=true}={})=>PUT(new Request(url,{method:'PUT',headers:{host:'127.0.0.1:5180','content-type':'application/json',...(c?{cookie:c}:{}),...(origin?{origin:'http://127.0.0.1:5180'}:{})},body:typeof body==='string'?body:JSON.stringify(body)})).then(check);
const stored=(userId='owner')=>sql.prepare('SELECT data,revision FROM product_catalogs WHERE user_id = ?').get(userId) as {data:string;revision:number}|undefined;
const T='2026-10-09T08:00:00.000Z',A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222';
const product=(id:string,name:string,extra:Partial<Product>={}):Product=>({id,manufacturer:'Legrand',family:'Valena Life',sku:'',name,unit:'db',price:1500,labor:null,archived:false,sample:false,updatedAt:T,...extra});
const first:Catalog={version:1,products:[product(A,'Valena Life dugalj',{sku:'753120'})],defaults:[{ref:'device:socket',productId:A,label:'Dugalj'}]};

// 1. Hitelesítés és cross-site
assert.equal((await get(null)).status,401);
assert.equal((await get(owner,{'sec-fetch-site':'cross-site'})).status,403);
assert.equal((await put(null,{catalog:first,revision:0,userId:'owner'})).status,401);

// 2. Üres katalógus
let r=await get(owner);assert.equal(r.status,200);assert.equal(r.body.revision,0);assert.deepEqual(r.body.catalog,emptyCatalog());assert.deepEqual(r.body.limits,{products:2000,bytes:1_500_000});assert.equal(r.body.userId,'owner');

// 3. Elutasított PUT-ok (egyik sem ír)
assert.equal((await put(owner,{catalog:first,revision:0,userId:'owner'},{origin:false})).status,403);
r=await put(owner,{catalog:first,revision:0,userId:'other'});assert.equal(r.status,409);assert.equal(r.body.code,'ACCOUNT_CHANGED');
r=await put(owner,'{nem json');assert.equal(r.status,400);assert.equal(r.body.code,'INVALID');assert.equal(r.body.error,'Érvénytelen termékadatok.');
r=await put(owner,{catalog:{...first,products:[product(A,' ')]},revision:0,userId:'owner'});assert.equal(r.status,400);assert.equal(r.body.code,'INVALID');assert.match(r.body.error||'',/megnevezés/);
r=await put(owner,{catalog:{...first,products:[product(A,'Egy',{sku:'X'}),product(B,'Kettő',{sku:'x'})]},revision:0,userId:'owner'});assert.equal(r.status,400);assert.match(r.body.error||'',/Ismétlődő cikkszám/);
r=await put(owner,{catalog:{version:1,products:Array.from({length:2001},(_,i)=>product(`aaaaaaaa-aaaa-4aaa-8aaa-${String(i).padStart(12,'0')}`,'T'+i,{family:'',manufacturer:''})),defaults:[]},revision:0,userId:'owner'});assert.equal(r.status,400);assert.match(r.body.error||'',/2000/);
for(const revision of [-1,'1',1.5])assert.equal((await put(owner,{catalog:first,revision,userId:'owner'})).status,400);
r=await put(owner,'x'.repeat(1_500_001));assert.equal(r.status,413);assert.equal(r.body.code,'TOO_LARGE');
assert.equal(stored(),undefined,'hibás kérés nem ír');

// 4. Írás és ütközés (revision-CAS)
r=await put(owner,{catalog:first,revision:0,userId:'owner'});assert.equal(r.status,200);assert.equal(r.body.revision,1);assert.equal(r.body.userId,'owner');assert.deepEqual(r.body.catalog,validateCatalog(first));
assert.deepEqual(JSON.parse(stored()!.data),validateCatalog(first));assert.equal(stored()!.revision,1);
r=await put(owner,{catalog:first,revision:0,userId:'owner'});assert.equal(r.status,409);assert.equal(r.body.code,'CATALOG_CONFLICT');assert.match(r.body.error||'',/másik ablakban/);
const second={...first,products:[...first.products,product(B,'Kapcsoló',{price:null})]};
r=await put(owner,{catalog:second,revision:1,userId:'owner'});assert.equal(r.status,200);assert.equal(r.body.revision,2);
r=await put(owner,{catalog:first,revision:1,userId:'owner'});assert.equal(r.status,409);assert.equal(r.body.code,'CATALOG_CONFLICT');
r=await get(owner);assert.equal(r.body.revision,2);assert.deepEqual(r.body.catalog,validateCatalog(second));

// 5. Izoláció
r=await get(other);assert.equal(r.body.revision,0);assert.deepEqual(r.body.catalog,emptyCatalog());assert.equal(r.body.userId,'other');
r=await put(other,{catalog:first,revision:0,userId:'other'});assert.equal(r.status,200);assert.equal(r.body.revision,1);
assert.equal(stored('owner')!.revision,2);assert.deepEqual(JSON.parse(stored('owner')!.data),validateCatalog(second));
r=await put(other,{catalog:emptyCatalog(),revision:2,userId:'other'});assert.equal(r.status,409,'a másik fiók revisionje nem érvényes');

// 6. Kaszkád: a fiók törlésével a katalógus is törlődik
await db.run('DELETE FROM sessions WHERE user_id = ?',['other']);await db.run('DELETE FROM users WHERE id = ?',['other']);
assert.equal(stored('other'),undefined);assert.ok(stored('owner'));

// 7. Mellékhatás: a plans tábla változatlan
assert.equal(plansSnapshot(),plansBefore);

// 8. A tárolt, de már érvénytelen blob 503-at ad, nem szivárogtat
sql.prepare('UPDATE product_catalogs SET data = ? WHERE user_id = ?').run('{"version":2}','owner');
const original=console.error;console.error=()=>{};try{r=await get(owner)}finally{console.error=original}
assert.equal(r.status,503);assert.match(r.body.error||'',/nem tölthető be/);

console.log('PASS: catalog API auth, cross-site, empty state and limits, validation errors (Hungarian), size limit, account echo, revision CAS conflicts, isolation, cascade delete, no plan writes, corrupted blob 503.');
