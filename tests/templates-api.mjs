import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
import path from 'node:path';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:5180';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw Error('Loopback only.');
const dbPath=path.resolve(process.env.TEST_D1_PATH||'');
if(!dbPath.startsWith(path.resolve('.wrangler/state')+path.sep)||!dbPath.endsWith('.sqlite'))throw Error('Use only the local preview database.');
const db=new DatabaseSync(dbPath);db.exec('PRAGMA busy_timeout=5000');
function fixture(){const id=randomUUID(),token=randomBytes(32).toString('hex'),now=Date.now();db.prepare('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)').run(id,id+'@example.test','Template test','unusable-test-hash',now);db.prepare('INSERT INTO sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)').run(createHash('sha256').update(token).digest('hex'),id,now+3600000,now);return{id,cookie:'shockcraft_session='+token}}
const user=fixture(),other=fixture();
async function call(method='GET',body,cookie=user.cookie,origin=base){const r=await fetch(base+'/api/templates',{method,headers:{Connection:'close',Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:body===undefined?undefined:JSON.stringify(body)});const text=await r.text();let data;try{data=JSON.parse(text)}catch{throw Error(method+" revision="+body?.revision+" status="+r.status+": "+text.slice(0,180))}return {status:r.status,data}}
const template={id:randomUUID(),name:'Nappali sablon',kind:'room',archived:false,floor:{id:'f',name:'Szint',elevation:0,rooms:[{id:'r',name:'Nappali',x:0,y:0,w:160,h:200}],walls:[],devices:[],routes:[]}};
const save=(templates,revision,cookie=user.cookie,userId=user.id,origin=base)=>call('PUT',{templates,revision,userId},cookie,origin);
try{
 assert.equal((await call('GET',undefined,'')).status,401);assert.equal((await save([template],0,'')).status,401);
 assert.equal((await save([template],0,user.cookie,user.id,'http://localhost:5180')).status,403);
 assert.equal((await save([template],0,user.cookie,other.id)).status,409);
 let r=await call();assert.equal(r.data.revision,0);assert.deepEqual(r.data.templates,[]);
 assert.equal((await save([template],0)).status,200);assert.equal((await call()).data.templates[0].name,template.name);
 assert.deepEqual((await call('GET',undefined,other.cookie)).data.templates,[],'account isolation');
 assert.equal((await save([template],0)).status,409,'stale first save');
 assert.deepEqual((await Promise.all([save([{...template,name:'Változat A'}],1),save([{...template,name:'Változat B'}],1)])).map(r=>r.status).sort(),[200,409]);
 assert.equal((await call()).data.revision,2);
 assert.equal((await save([{...template,archived:true}],2)).status,200);assert.equal((await call()).data.templates[0].archived,true);
 assert.equal((await save([template],3)).status,200);assert.equal((await call()).data.templates[0].archived,false);
 assert.equal((await save([template,template],4)).status,400);
 assert.equal((await save(Array.from({length:31},()=>({...template,id:randomUUID()})),4)).status,400);
 const bad=structuredClone(template);bad.floor.devices=[{id:'d',kind:'socket',name:'D',x:0,y:0,height:30,angle:0,circuit:'foreign'}];assert.equal((await save([bad],4)).status,400);
 assert.equal((await call('PUT',{templates:[template],revision:4,userId:user.id,padding:'x'.repeat(2_000_001)})).status,413);
 assert.equal((await call()).data.revision,4,'rejected mutations leave library unchanged');
 assert.equal(db.prepare('SELECT COUNT(*) AS n FROM billing_grants WHERE user_id=?').get(user.id).n,0,'no project entitlement side effects');
 console.log('PASS: template HTTP persistence, anonymous access rejection, ownership, CSRF, concurrent/stale writes, archive/restore, schema and size limits, unchanged project entitlements.');
}finally{for(const u of [user,other]){db.prepare('DELETE FROM template_libraries WHERE user_id=?').run(u.id);db.prepare('DELETE FROM sessions WHERE user_id=?').run(u.id);db.prepare('DELETE FROM users WHERE id=?').run(u.id)}db.close()}
