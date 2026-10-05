import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
import path from 'node:path';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:5180';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw Error('Loopback only.');
const dbPath=path.resolve(process.env.TEST_D1_PATH||'');
if(!dbPath.startsWith(path.resolve('.wrangler/state')+path.sep)||!dbPath.endsWith('.sqlite'))throw Error('Use the local preview database under .wrangler/state.');
const db=new DatabaseSync(dbPath);db.exec('PRAGMA busy_timeout=5000');
function fixture(){const id=randomUUID(),token=randomBytes(32).toString('hex'),now=Date.now();db.prepare('INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)').run(id,id+'@example.test','Archive test','unusable-test-hash',now);db.prepare('INSERT INTO sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)').run(createHash('sha256').update(token).digest('hex'),id,now+3600000,now);return{id,cookie:'shockcraft_session='+token}}
const user=fixture(),other=fixture();
async function call(method,body,cookie=user.cookie,query='',origin=base){const r=await fetch(base+'/api/plan'+query,{method,headers:{Connection:'close',Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:body===undefined?undefined:JSON.stringify(body)});const text=await r.text();let data;try{data=JSON.parse(text)}catch{throw Error(method+' '+query+' returned '+r.status+': '+text.slice(0,150))}return{status:r.status,data}}
const plan={version:1,name:'Archiválási teszt',plot:{name:'Telek',w:40,h:30},buildings:[],circuits:[],modules:[]},projectId=randomUUID();
const save=(revision,p=projectId)=>call('PUT',{plan,revision,projectId:p,userId:user.id});
const state=(revision,value,cookie=user.cookie,uid=user.id)=>call('PATCH',{projectId,revision,state:value,userId:uid},cookie);
assert.equal((await save(0)).status,200);
const before=db.prepare('SELECT data FROM plans WHERE id=?').get('account:'+user.id+':project:'+projectId).data;
assert.equal((await state(1,'archived','')).status,401);
assert.equal((await call('PATCH',{projectId,revision:1,state:'archived',userId:user.id},user.cookie,'','https://attacker.invalid')).status,403);
assert.equal((await state(1,'trash',other.cookie,other.id)).status,404);
assert.equal((await state(1,'trash',user.cookie,other.id)).status,409);
assert.equal((await state(1,'invalid')).status,400);
assert.equal((await state(1,'archived')).status,200);
assert.equal((await call('GET',undefined,user.cookie,'?list=1')).data.projects.length,0);
let all=(await call('GET',undefined,user.cookie,'?list=1&scope=all')).data.projects;assert.equal(all[0].state,'archived');assert.ok(all[0].stateChangedAt);
assert.equal((await call('GET',undefined,user.cookie,'?projectId='+projectId)).status,409);
assert.equal((await save(1)).status,409);assert.equal((await save(2)).status,409);
assert.equal((await state(1,'active')).status,409);
assert.equal((await state(2,'trash')).status,200);
assert.equal((await state(3,'archived')).status,400);
assert.equal((await save(0,randomUUID())).status,402,'trash cannot reclaim a free grant');
assert.equal((await state(3,'active')).status,200);
assert.equal((await call('GET',undefined,user.cookie,'?projectId='+projectId)).status,200);
assert.equal(db.prepare('SELECT data FROM plans WHERE id=?').get('account:'+user.id+':project:'+projectId).data,before);
assert.equal((await save(1)).status,409);assert.equal((await save(4)).status,200);
// Both competing state changes use the same revision: exactly one must succeed.
assert.deepEqual((await Promise.all([state(5,'archived'),state(5,'trash')])).map(r=>r.status).sort(),[200,409]);
assert.equal((await state(6,'active')).status,200);
// Expired subscription grant remains locked after trash/restore.
const lockedId=randomUUID(),lockedKey='account:'+user.id+':project:'+lockedId;
db.prepare('INSERT INTO plans (id,data,revision,updated_at) VALUES (?,?,1,?)').run(lockedKey,before,new Date().toISOString());
db.prepare('INSERT INTO billing_grants (id,user_id,project_id,mode,created_at) VALUES (?,?,?,?,?)').run('fixture:'+lockedId,user.id,lockedKey,'sub_live',Date.now());
async function lockedState(revision,value){return call('PATCH',{projectId:lockedId,revision,state:value,userId:user.id})}
assert.equal((await lockedState(1,'trash')).status,200);assert.equal((await lockedState(2,'active')).status,200);
assert.equal((await call('GET',undefined,user.cookie,'?projectId='+lockedId)).status,402);
assert.equal((await save(3,lockedId)).status,402);
assert.ok((await call('GET',undefined,user.cookie,'?list=1')).data.projects.find(p=>p.id===lockedId).locked);
assert.equal(db.prepare('SELECT project_id FROM billing_grants WHERE id=?').get('free:'+user.id).project_id,'account:'+user.id+':project:'+projectId);
db.close();
console.log('PASS: ownership, CSRF, state transitions, list filters, unchanged plan data/grants, inactive read/write prevention, stale and concurrent saves, no new free slot, expired subscription stays locked. Local fixtures only.');
