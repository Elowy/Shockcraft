import assert from 'node:assert/strict';
import {seed,validatePlan} from '../lib/plan';
import {newQuote,addQuoteLine,quoteIssues} from '../lib/quote';
import {CLIENT_LIMIT,emptyWorkbook,validateWorkbook,workbookError,projectStatus,workbookViolation,clientCustomerText,clientSiteText,clientLabel,fillQuoteFromClient,clientForProject,taskClient,taskFrozen,dueBucket,addDays,sortTasks,dueCount,newTask,taskTarget,upsertClient,setClientArchived,removeClient,assignClient,upsertTask,setTaskStatus,removeTask,clearDoneTasks,type Workbook,type Client,type Task} from '../lib/workbook';
const T='2026-10-01T10:00:00.000Z',today='2026-10-09';
const K='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',L='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222',C='33333333-3333-4333-8333-333333333333',D='44444444-4444-4444-8444-444444444444',M='55555555-5555-4555-8555-555555555555';
const client=(o:Partial<Client>={}):Client=>({id:K,name:'Kiss Anna',company:'',taxNumber:'',postalCode:'',city:'',address:'',phone:'',email:'',note:'',archived:false,createdAt:T,updatedAt:T,...o});
const task=(o:Partial<Task>={}):Task=>({...newTask({title:'Felmérés',note:'',due:'',projectId:null,clientId:null},T),...o});
const wb=(o:Partial<Workbook>={}):Workbook=>({...emptyWorkbook(),...o});
const rejects=(v:unknown,re?:RegExp)=>{assert.throws(()=>validateWorkbook(v));if(re){try{validateWorkbook(v)}catch(e){assert.match(workbookError(e),re)}}};

// 1. Alapállapot és alapértékek
assert.deepEqual(validateWorkbook(emptyWorkbook()),{version:1,clients:[],assignments:[],tasks:[]});
const minimal=validateWorkbook({version:1,clients:[{id:K,name:' Kiss Anna ',createdAt:T,updatedAt:T}],assignments:[],tasks:[{id:L,title:'Felmérés',createdAt:T,updatedAt:T}]});
assert.deepEqual(minimal.clients[0],client());
assert.deepEqual(minimal.tasks[0],{id:L,projectId:null,clientId:null,title:'Felmérés',note:'',due:'',status:'todo',doneAt:null,createdAt:T,updatedAt:T});

// 2. Elutasítások, magyar üzenetekkel
rejects(wb({clients:[client(),client()]}),/Ismétlődő ügyfélazonosító/);
const t1=task();rejects(wb({tasks:[t1,{...t1}]}),/Ismétlődő teendőazonosító/);
rejects(wb({clients:[client(),client({id:L})],assignments:[{projectId:A,clientId:K},{projectId:A,clientId:L}]}),/csak egy ügyfél/);
rejects(wb({assignments:[{projectId:A,clientId:K}]}),/hozzárendelt ügyfél nem található/);
rejects(wb({tasks:[task({clientId:K})]}),/teendő ügyfele nem található/);
rejects(wb({clients:[client()],tasks:[task({clientId:K,projectId:A})]}),/ügyfele a projektből jön/);
rejects(wb({clients:[client({name:'  '})]}),/nevét/);
rejects(wb({tasks:[task({title:''})]}),/Add meg a teendőt/);
rejects(wb({clients:[client({name:'Kiss\x07Anna'})]}),/Érvénytelen karakter/);
rejects(wb({clients:[client({name:'Kiss\nAnna'})]}),/sortörés/);
assert.equal(validateWorkbook(wb({clients:[client({note:'első sor\nmásodik sor'})]})).clients[0].note,'első sor\nmásodik sor','a megjegyzésben a sortörés megengedett');
rejects(wb({clients:[client({taxNumber:'123'})]}),/adószám/);
rejects(wb({clients:[client({postalCode:'12345'})]}),/négy számjegy/);
rejects(wb({clients:[client({email:'nem-email'})]}),/e-mail/);
rejects(wb({clients:[client({phone:'hívj fel'})]}),/telefonszám/);
rejects(wb({tasks:[task({due:'2026-02-30'})]}),/dátum/);
rejects(wb({tasks:[task({projectId:'../x'})]}),/projektazonosító/);
rejects(wb({clients:Array.from({length:CLIENT_LIMIT+1},(_,i)=>client({id:crypto.randomUUID(),name:'Ügyfél '+i}))}),/500 ügyfél/);
rejects(wb({clients:[client({id:'nem-uuid'})]}),/Érvénytelen azonosító/);
rejects({version:1,clients:'x',assignments:[],tasks:[]},/^Érvénytelen ügyfél- vagy teendőadatok\.$/);
assert.equal(workbookError(Error('belső')),'Érvénytelen ügyfél- vagy teendőadatok.');
assert.equal(validateWorkbook(wb({clients:[client({taxNumber:'12345678-1-12',postalCode:'1234',phone:'+36 (30) 123-4567',email:'anna@example.test'})]})).clients[0].taxNumber,'12345678-1-12');

// 3. Ajánlatszöveg
const anna=client({postalCode:'1234',city:'Szanda',address:'Fő u. 1.',phone:'+36 30 123 4567',note:'Csak délután hívható.'});
assert.equal(clientCustomerText(anna),'Kiss Anna\n1234 Szanda, Fő u. 1.\nTelefon: +36 30 123 4567');
assert.equal(clientSiteText(anna),'1234 Szanda, Fő u. 1.');
const firm=client({company:'Minta Kft.',taxNumber:'12345678-2-13',city:'Vác',email:'iroda@minta.test'});
assert.equal(clientCustomerText(firm),'Minta Kft.\nKapcsolattartó: Kiss Anna\nVác\nAdószám: 12345678-2-13\nE-mail: iroda@minta.test');
assert.equal(clientSiteText(firm),'Vác');assert.equal(clientCustomerText(client()),'Kiss Anna');assert.equal(clientSiteText(client()),'');
assert.equal(clientLabel(firm),'Minta Kft. – Kiss Anna');assert.equal(clientLabel(client({archived:true})),'Kiss Anna (archivált)');
const long=client({company:'C'.repeat(160),name:'N'.repeat(160),address:'A'.repeat(200),city:'V'.repeat(100),note:'x'.repeat(1000),email:'e'.repeat(60)+'@example.test',phone:'1'.repeat(40)});
assert.ok(clientCustomerText({...long,address:'A'.repeat(2000)}).length===1500);assert.equal(clientSiteText({...long,address:'A'.repeat(2000)}).length,500);
assert.ok(!clientCustomerText(anna).includes('délután'),'a belső megjegyzés nem kerül az ajánlatba');

// 4. Árajánlat kitöltése
const q={...newQuote(),number:'AJ-1',supplier:'Teszt Villany',lines:[{...addQuoteLine(),material:1000,labor:500},{...addQuoteLine(),name:'Kiszállás',material:0,labor:8000}]};
const qBefore=JSON.stringify(q),filled=fillQuoteFromClient(q,anna);
assert.equal(filled.customer,clientCustomerText(anna));assert.equal(filled.site,'1234 Szanda, Fő u. 1.');assert.deepEqual(filled.lines,q.lines);
assert.equal(fillQuoteFromClient({...q,site:'Helyszín: Vác'},anna).site,'Helyszín: Vác','a kitöltött munkavégzési hely megmarad');
assert.ok(!quoteIssues(filled).includes('Add meg az ügyfél adatait.'));assert.ok(quoteIssues(q).includes('Add meg az ügyfél adatait.'));
assert.equal(JSON.stringify(q),qBefore,'a bemenet nem mutálódik');
const withQuote=validatePlan({...structuredClone(seed),quote:filled});assert.deepEqual(validatePlan(JSON.parse(JSON.stringify(withQuote))),withQuote,'export/import round-trip');assert.equal(withQuote.quote?.customer,filled.customer);

// 5. Dátumok és esedékesség
assert.equal(dueBucket(task({due:'2026-10-08'}),today),'overdue');assert.equal(dueBucket(task({due:today}),today),'today');
assert.equal(dueBucket(task({due:'2026-10-16'}),today),'week');assert.equal(dueBucket(task({due:'2026-10-17'}),today),'later');
assert.equal(dueBucket(task(),today),'none');assert.equal(dueBucket(task({due:'2026-10-01',status:'done'}),today),'done');
assert.equal(addDays('2026-12-28',7),'2027-01-04');assert.equal(addDays('2026-10-25',1),'2026-10-26');assert.equal(addDays('2026-03-29',1),'2026-03-30');assert.equal(addDays('2026-10-09',-9),'2026-09-30');
const s1=task({id:crypto.randomUUID(),title:'határidő nélkül',createdAt:'2026-01-01T00:00:00Z'}),s2=task({id:crypto.randomUUID(),title:'később',due:'2026-11-01'}),s3=task({id:crypto.randomUUID(),title:'korán, régebbi',due:'2026-10-02',createdAt:'2026-01-01T00:00:00Z'}),s4=task({id:crypto.randomUUID(),title:'korán, újabb',due:'2026-10-02',createdAt:'2026-02-01T00:00:00Z'}),s5=task({id:crypto.randomUUID(),title:'kész régen',status:'done',doneAt:'2026-01-01T00:00:00Z'}),s6=task({id:crypto.randomUUID(),title:'kész most',status:'done',doneAt:'2026-10-01T00:00:00Z'});
const unsorted=[s5,s1,s6,s2,s4,s3],unsortedBefore=JSON.stringify(unsorted);
assert.deepEqual(sortTasks(unsorted).map(t=>t.title),['korán, régebbi','korán, újabb','később','határidő nélkül','kész most','kész régen']);assert.equal(JSON.stringify(unsorted),unsortedBefore);
const statusOf=projectStatus([{id:'default',state:'active',locked:false},{id:A,state:'active',locked:false},{id:B,state:'archived',locked:false},{id:C,state:'trash',locked:false},{id:D,state:'active',locked:true}]);
assert.deepEqual(['default',A,B,C,D,M].map(statusOf),['active','active','archived','trash','locked','missing']);
const dueWb=wb({clients:[client()],tasks:[task({id:crypto.randomUUID(),due:'2026-10-01'}),task({id:crypto.randomUUID(),due:today,clientId:K}),task({id:crypto.randomUUID(),due:today,projectId:A}),task({id:crypto.randomUUID(),due:'2026-10-01',projectId:B}),task({id:crypto.randomUUID(),due:'2026-10-01',projectId:D}),task({id:crypto.randomUUID(),due:'2026-10-01',status:'done',doneAt:T}),task({id:crypto.randomUUID(),due:'2026-10-10'}),task({id:crypto.randomUUID()})]});
assert.equal(dueCount(dueWb,statusOf,today),3,'általános, ügyfélhez és aktív projekthez kötött lejárt/mai teendők');
assert.equal(taskFrozen(task({projectId:B}),statusOf),'archived');assert.equal(taskFrozen(task({projectId:A}),statusOf),null);assert.equal(taskFrozen(task(),statusOf),null);

// 6. Módosítók – mindegyik új objektumot ad, a bemenet változatlan
const base=wb({clients:[client(),client({id:L,name:'Nagy Béla'})],assignments:[{projectId:A,clientId:K},{projectId:'default',clientId:L}],tasks:[task({id:crypto.randomUUID(),clientId:K,title:'Ügyfélteendő'}),task({id:crypto.randomUUID(),projectId:A,title:'Projektteendő'})]});
const baseBefore=JSON.stringify(base),later='2026-10-09T12:00:00.000Z',evenLater='2026-10-10T12:00:00.000Z';
assert.equal(clientForProject(base,A)?.id,K);assert.equal(clientForProject(base,B),null);
assert.equal(taskClient(base,base.tasks[0])?.id,K);assert.equal(taskClient(base,base.tasks[1])?.id,K);assert.equal(taskClient(base,task()),null);
const pid=base.tasks[1].id;let w=setTaskStatus(base,pid,'done',later);assert.equal(w.tasks[1].doneAt,later);assert.equal(w.tasks[1].updatedAt,later);
w=setTaskStatus(w,pid,'done',evenLater);assert.equal(w.tasks[1].doneAt,later,'kész→kész megtartja a doneAt-ot');
w=setTaskStatus(w,pid,'todo',evenLater);assert.equal(w.tasks[1].doneAt,null);assert.equal(w.tasks[1].status,'todo');
const removed=removeClient(base,K,later);assert.deepEqual(removed.assignments,[{projectId:'default',clientId:L}]);assert.equal(removed.tasks[0].clientId,null);assert.equal(removed.tasks[0].updatedAt,later);assert.equal(removed.tasks[1].projectId,A);validateWorkbook(removed);
assert.deepEqual(assignClient(base,A,null).assignments,[{projectId:'default',clientId:L}]);assert.deepEqual(assignClient(base,A,L).assignments,[{projectId:'default',clientId:L},{projectId:A,clientId:L}]);
assert.equal(clearDoneTasks(setTaskStatus(base,pid,'done',later)).tasks.length,1);
assert.equal(setClientArchived(base,K,true,later).clients[0].archived,true);assert.equal(upsertClient(base,client({name:'Kiss Anna Mária'})).clients[0].name,'Kiss Anna Mária');assert.equal(upsertClient(base,client({id:crypto.randomUUID()})).clients.length,3);
const added=upsertTask(base,task({id:crypto.randomUUID(),title:'Új'}));assert.equal(added.tasks.length,3);assert.equal(removeTask(added,added.tasks[2].id).tasks.length,2);
assert.equal(JSON.stringify(base),baseBefore,'a módosítók nem mutálják a bemenetet');

// 7. workbookViolation-mátrix
const frozen=wb({clients:[client()],assignments:[{projectId:B,clientId:K}],tasks:[task({id:A,projectId:A,title:'aktív'}),task({id:B,projectId:B,title:'archivált'}),task({id:C,projectId:C,title:'lomtár'}),task({id:D,projectId:D,title:'zárolt'}),task({id:M,projectId:M,title:'hiányzó'})]});
const code=(next:Workbook,prev=frozen)=>workbookViolation(prev,next,statusOf)?.code??null;
const status=(id:string)=>({...frozen,tasks:frozen.tasks.map(t=>t.id===id?{...t,status:'doing' as const}:t)});
assert.equal(code(frozen),null,'befagyott projekt változatlan teendője');
assert.equal(code(status(B)),'PROJECT_INACTIVE');assert.equal(code(status(C)),'PROJECT_INACTIVE');assert.equal(code(status(D)),'SUBSCRIPTION_REQUIRED');assert.equal(code(status(A)),null);
assert.deepEqual(workbookViolation(frozen,status(D),statusOf),{code:'SUBSCRIPTION_REQUIRED',projectId:D});
assert.equal(code(upsertTask(frozen,task({id:crypto.randomUUID(),projectId:M}))),'SAVE_REQUIRED','új teendő nem mentett projekten');
for(const id of [B,C,D,M])assert.equal(code(removeTask(frozen,id)),null,'befagyott vagy hiányzó projekt teendőjének törlése');
assert.equal(code(assignClient(frozen,C,K)),'PROJECT_INACTIVE','új hozzárendelés lomtáras projekthez');
assert.equal(code(assignClient(frozen,B,null)),null,'archivált projekt hozzárendelésének törlése');
const withL=upsertClient(frozen,client({id:L,name:'Nagy Béla'}));assert.equal(code(assignClient(withL,B,L),withL),'PROJECT_INACTIVE','ügyfélcsere archivált projekten');
assert.equal(code({...frozen,tasks:frozen.tasks.map(t=>t.id===A?{...t,projectId:B}:t)}),'PROJECT_INACTIVE','áthelyezés aktívból archiváltba');
assert.equal(code({...frozen,tasks:frozen.tasks.map(t=>t.id===B?{...t,projectId:A}:t)}),null,'áthelyezés archiváltból aktívba');
assert.equal(code(upsertTask(upsertTask(frozen,task({id:crypto.randomUUID(),title:'általános'})),task({id:crypto.randomUUID(),clientId:K}))),null,'általános és ügyfélhez kötött teendő');
const reordered=JSON.parse(JSON.stringify({...frozen,tasks:frozen.tasks.map(t=>Object.fromEntries(Object.entries(t).reverse()))}));assert.equal(code(reordered),null,'eltérő kulcssorrend');
assert.equal(code({...frozen,tasks:frozen.tasks.map(t=>({...t,updatedAt:later}))}),null,'csak az updatedAt változott');
assert.equal(code(removeClient(frozen,K,later)),null,'ügyfél törlése befagyott hozzárendeléssel együtt');
// 8. Az „Esedékes” fül célválasztója: a felület és a mentés ugyanazt a célt használja
const opts=['','c:'+K,'p:'+A];
assert.deepEqual(taskTarget('c:'+K,opts),{value:'c:'+K,target:{projectId:null,clientId:K}});
assert.deepEqual(taskTarget('p:'+A,opts),{value:'p:'+A,target:{projectId:A,clientId:null}});
assert.deepEqual(taskTarget('',opts),{value:'',target:{projectId:null,clientId:null}});
assert.deepEqual(taskTarget('c:'+L,opts),{value:'',target:{projectId:null,clientId:null}},'időközben archivált vagy törölt ügyfél → általános');
assert.deepEqual(taskTarget('p:'+B,opts),{value:'',target:{projectId:null,clientId:null}},'időközben inaktív projekt → általános');
const general=upsertTask(wb({clients:[client({archived:true})]}),newTask({title:'Új',note:'',due:'',...taskTarget('c:'+K,['']).target},T));
assert.equal(general.tasks[0].clientId,null,'archivált ügyfélhez nem kerül csendben teendő');validateWorkbook(general);
console.log('PASS: ügyfél- és teendőkezelés');
