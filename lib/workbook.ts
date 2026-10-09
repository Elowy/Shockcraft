import {z} from 'zod';
import {isoDay,quoteSchema,type Quote} from './quote-schema';
import {validProjectId,type ProjectState} from './projects';

// Fiókszintű ügyfél- és teendő-munkafüzet: egy JSON-blob felhasználónként, egyetlen revisionnel (workbooks tábla).
export const CLIENT_LIMIT=500,TASK_LIMIT=1000,ASSIGNMENT_LIMIT=1000,WORKBOOK_BYTES=1_000_000;
const FALLBACK='Érvénytelen ügyfél- vagy teendőadatok.';
export const workbookErrorMap:z.ZodErrorMap=()=>({message:FALLBACK}); // a nem testreszabott Zod-hibák is magyarul
const ctrl=/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/;
const max=(n:number)=>`Legfeljebb ${n} karakter adható meg.`;
const line=(n:number,required?:string)=>(required?z.string().trim().min(1,required):z.string().trim()).max(n,max(n)).refine(v=>!ctrl.test(v)&&!/[\r\n]/.test(v),'Érvénytelen karakter vagy sortörés.');
const multi=(n:number)=>z.string().trim().max(n,max(n)).refine(v=>!ctrl.test(v),'Érvénytelen karakter.');
const pattern=(re:RegExp,message:string,n:number)=>z.string().trim().max(n,message).refine(v=>v===''||re.test(v),message).default('');
const stamp=z.string().max(40);
const projectRef=z.string().refine(validProjectId,'Érvénytelen projektazonosító.');
const uuid=z.string().uuid('Érvénytelen azonosító.');

export const clientSchema=z.object({id:uuid,name:line(160,'Add meg az ügyfél nevét.'),company:line(160).default(''),taxNumber:pattern(/^\d{8}-[1-5]-\d{2}$/,'Az adószám formátuma: 12345678-1-12.',13),postalCode:pattern(/^\d{4}$/,'Az irányítószám négy számjegy.',4),city:line(100).default(''),address:line(200).default(''),phone:pattern(/^[0-9+()\/. -]{6,40}$/,'Érvénytelen telefonszám.',40),email:z.string().trim().max(254,'Érvénytelen e-mail-cím.').refine(v=>v===''||z.string().email().safeParse(v).success,'Érvénytelen e-mail-cím.').default(''),note:multi(1000).default(''),archived:z.boolean().default(false),createdAt:stamp,updatedAt:stamp});
export const taskStatuses=['todo','doing','done'] as const;
export const taskStatusLabels:Record<typeof taskStatuses[number],string>={todo:'Teendő',doing:'Folyamatban',done:'Kész'};
export const taskSchema=z.object({id:uuid,projectId:projectRef.nullable().default(null),clientId:uuid.nullable().default(null),title:line(200,'Add meg a teendőt.'),note:multi(500).default(''),due:isoDay.default(''),status:z.enum(taskStatuses).default('todo'),doneAt:stamp.nullable().default(null),createdAt:stamp,updatedAt:stamp}).refine(t=>!(t.projectId&&t.clientId),{message:'Projekthez kötött teendő ügyfele a projektből jön.',path:['clientId']});
export const assignmentSchema=z.object({projectId:projectRef,clientId:uuid});
export const workbookSchema=z.object({version:z.literal(1),clients:z.array(clientSchema).max(CLIENT_LIMIT,'Legfeljebb 500 ügyfél tárolható. Archiváld vagy töröld a régieket.'),assignments:z.array(assignmentSchema).max(ASSIGNMENT_LIMIT,'Túl sok projekt–ügyfél hozzárendelés.'),tasks:z.array(taskSchema).max(TASK_LIMIT,'Legfeljebb 1000 teendő tárolható. Töröld a régi, kész teendőket.')}).superRefine((w,ctx)=>{
 const fail=(message:string)=>ctx.addIssue({code:'custom',message});
 const clients=new Set(w.clients.map(c=>c.id));
 if(clients.size!==w.clients.length)fail('Ismétlődő ügyfélazonosító.');
 if(new Set(w.tasks.map(t=>t.id)).size!==w.tasks.length)fail('Ismétlődő teendőazonosító.');
 if(new Set(w.assignments.map(a=>a.projectId)).size!==w.assignments.length)fail('Egy projekthez csak egy ügyfél rendelhető.');
 if(w.assignments.some(a=>!clients.has(a.clientId)))fail('A hozzárendelt ügyfél nem található.');
 if(w.tasks.some(t=>t.clientId!==null&&!clients.has(t.clientId)))fail('A teendő ügyfele nem található.');
});

export type Workbook=z.infer<typeof workbookSchema>;
export type Client=z.infer<typeof clientSchema>;
export type Task=z.infer<typeof taskSchema>;
export type Assignment=z.infer<typeof assignmentSchema>;
export type TaskStatus=typeof taskStatuses[number];
export type ProjectStatus='active'|'archived'|'trash'|'locked'|'missing';
export type ProjectStateRow={id:string;state:ProjectState;locked:boolean};
export type WorkbookViolation={code:'PROJECT_INACTIVE'|'SUBSCRIPTION_REQUIRED'|'SAVE_REQUIRED';projectId:string};
export const projectStatusLabels:Record<ProjectStatus,string>={active:'Aktív',archived:'Archivált',trash:'Lomtár',locked:'Zárolt',missing:'Nem található'};

export const emptyWorkbook=():Workbook=>({version:1,clients:[],assignments:[],tasks:[]});
export const validateWorkbook=(v:unknown):Workbook=>workbookSchema.parse(v,{errorMap:workbookErrorMap});
export const workbookError=(e:unknown)=>e instanceof z.ZodError?e.issues[0]?.message||FALLBACK:FALLBACK;
export function projectStatus(rows:ProjectStateRow[]):(id:string)=>ProjectStatus{const byId=new Map(rows.map(r=>[r.id,r]));return id=>{const r=byId.get(id);return !r?'missing':r.state!=='active'?r.state:r.locked?'locked':'active'}}
export function violationCode(s:ProjectStatus):WorkbookViolation['code']|null{return s==='active'?null:s==='locked'?'SUBSCRIPTION_REQUIRED':s==='missing'?'SAVE_REQUIRED':'PROJECT_INACTIVE'}
// Csak az új vagy módosított, projekthez kötött teendő és hozzárendelés számít; törlés és levétel mindig engedett.
const signature=(t:Task)=>JSON.stringify([t.projectId,t.clientId,t.title,t.note,t.due,t.status,t.doneAt]);
export function workbookViolation(prev:Workbook,next:Workbook,status:(id:string)=>ProjectStatus):WorkbookViolation|null{
 const check=(projectId:string)=>{const code=violationCode(status(projectId));return code?{code,projectId}:null};
 const tasks=new Map(prev.tasks.map(t=>[t.id,signature(t)]));
 for(const t of next.tasks)if(t.projectId&&tasks.get(t.id)!==signature(t)){const v=check(t.projectId);if(v)return v}
 const assigned=new Map(prev.assignments.map(a=>[a.projectId,a.clientId]));
 for(const a of next.assignments)if(assigned.get(a.projectId)!==a.clientId){const v=check(a.projectId);if(v)return v}
 return null;
}

export const clientLabel=(c:Client)=>(c.company?c.company+' – '+c.name:c.name)+(c.archived?' (archivált)':'');
const siteLine=(c:Client)=>[[c.postalCode,c.city].filter(Boolean).join(' '),c.address].filter(Boolean).join(', ');
export const clientCustomerText=(c:Client)=>[c.company||c.name,c.company&&'Kapcsolattartó: '+c.name,siteLine(c),c.taxNumber&&'Adószám: '+c.taxNumber,c.phone&&'Telefon: '+c.phone,c.email&&'E-mail: '+c.email].filter(Boolean).join('\n').slice(0,1500);
export const clientSiteText=(c:Client)=>siteLine(c).slice(0,500);
// Pillanatkép: a tételek és az árak nem változnak, a munkavégzés helye csak üres mezőnél töltődik ki.
export const fillQuoteFromClient=(q:Quote,c:Client):Quote=>quoteSchema.parse({...q,customer:clientCustomerText(c),site:q.site.trim()?q.site:clientSiteText(c)});

export function clientForProject(w:Workbook,projectId:string):Client|null{const a=w.assignments.find(a=>a.projectId===projectId);return a&&w.clients.find(c=>c.id===a.clientId)||null}
export function taskClient(w:Workbook,t:Task):Client|null{return t.clientId?w.clients.find(c=>c.id===t.clientId)||null:t.projectId?clientForProject(w,t.projectId):null}
export function taskFrozen(t:Task,status:(id:string)=>ProjectStatus):ProjectStatus|null{if(!t.projectId)return null;const s=status(t.projectId);return s==='active'?null:s}

export const nowStamp=()=>new Date().toISOString();
export const localDay=(d=new Date())=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
export function addDays(day:string,n:number){const [y,m,d]=day.split('-').map(Number);return new Date(Date.UTC(y,m-1,d+n)).toISOString().slice(0,10)}
export const formatDay=(day:string)=>new Date(day+'T12:00:00').toLocaleDateString('hu-HU');
export type DueBucket='overdue'|'today'|'week'|'later'|'none'|'done';
export const dueBucketLabels:Record<DueBucket,string>={overdue:'Lejárt',today:'Ma',week:'Következő 7 nap',later:'Később',none:'Határidő nélkül',done:'Kész'};
export function dueBucket(t:Task,today:string):DueBucket{return t.status==='done'?'done':!t.due?'none':t.due<today?'overdue':t.due===today?'today':t.due<=addDays(today,7)?'week':'later'}
const cmp=(a:string,b:string)=>a<b?-1:a>b?1:0;
export function sortTasks(tasks:Task[]):Task[]{
 const open=tasks.filter(t=>t.status!=='done').sort((a,b)=>Number(!a.due)-Number(!b.due)||cmp(a.due,b.due)||cmp(a.createdAt,b.createdAt));
 const done=tasks.filter(t=>t.status==='done').sort((a,b)=>cmp(b.doneAt||'',a.doneAt||''));
 return [...open,...done];
}
export const dueCount=(w:Workbook,status:(id:string)=>ProjectStatus,today:string)=>w.tasks.filter(t=>t.status!=='done'&&!!t.due&&t.due<=today&&taskFrozen(t,status)===null).length;

export function newTask(fields:Pick<Task,'title'|'note'|'due'|'projectId'|'clientId'>,now=nowStamp()):Task{return {id:crypto.randomUUID(),projectId:fields.projectId,clientId:fields.clientId,title:fields.title,note:fields.note,due:fields.due,status:'todo',doneAt:null,createdAt:now,updatedAt:now}}
// Az „Esedékes” fül célválasztója: '' (általános), 'c:'+ügyfél vagy 'p:'+projekt. A már nem választható érték (archivált/törölt ügyfél, inaktív projekt) általánossá válik, így a felület és a mentés mindig ugyanazt a célt használja.
export function taskTarget(value:string,options:readonly string[]):{value:string;target:Pick<Task,'projectId'|'clientId'>}{const v=options.includes(value)?value:'';return {value:v,target:v.startsWith('c:')?{projectId:null,clientId:v.slice(2)}:v.startsWith('p:')?{projectId:v.slice(2),clientId:null}:{projectId:null,clientId:null}}}
export function upsertClient(w:Workbook,c:Client):Workbook{return {...w,clients:w.clients.some(x=>x.id===c.id)?w.clients.map(x=>x.id===c.id?c:x):[...w.clients,c]}}
export function setClientArchived(w:Workbook,id:string,archived:boolean,now:string):Workbook{return {...w,clients:w.clients.map(c=>c.id===id?{...c,archived,updatedAt:now}:c)}}
// Az ügyfél törlése a hozzárendeléseit is törli; a közvetlenül hozzá kötött teendők általános teendővé válnak.
export function removeClient(w:Workbook,id:string,now:string):Workbook{return {...w,clients:w.clients.filter(c=>c.id!==id),assignments:w.assignments.filter(a=>a.clientId!==id),tasks:w.tasks.map(t=>t.clientId===id?{...t,clientId:null,updatedAt:now}:t)}}
export function assignClient(w:Workbook,projectId:string,clientId:string|null):Workbook{const rest=w.assignments.filter(a=>a.projectId!==projectId);return {...w,assignments:clientId?[...rest,{projectId,clientId}]:rest}}
export function upsertTask(w:Workbook,t:Task):Workbook{return {...w,tasks:w.tasks.some(x=>x.id===t.id)?w.tasks.map(x=>x.id===t.id?t:x):[...w.tasks,t]}}
export function setTaskStatus(w:Workbook,id:string,status:TaskStatus,now:string):Workbook{return {...w,tasks:w.tasks.map(t=>t.id!==id?t:{...t,status,doneAt:status==='done'?(t.status==='done'&&t.doneAt?t.doneAt:now):null,updatedAt:now})}}
export function removeTask(w:Workbook,id:string):Workbook{return {...w,tasks:w.tasks.filter(t=>t.id!==id)}}
export function clearDoneTasks(w:Workbook):Workbook{return {...w,tasks:w.tasks.filter(t=>t.status!=='done')}}
