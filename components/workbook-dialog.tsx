"use client";
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {CalendarClock,CreditCard,FolderOpen,Trash2,UserPlus,Users} from 'lucide-react';
import {toast} from 'sonner';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from './ui/dialog';
import {Choice} from './plan-controls';
import {TaskForm,TaskList,type TaskHandlers} from './workbook-tasks';
import {ClientsPanel} from './workbook-clients';
import {fetchWorkbook,saveWorkbook,WorkbookError,type WorkbookResponse} from '@/lib/workbook-client';
import {TASK_LIMIT,assignClient,clearDoneTasks,clientForProject,clientLabel,clientSiteText,dueBucket,dueBucketLabels,dueCount,localDay,nowStamp,projectStatus,removeTask,setTaskStatus,sortTasks,taskClient,taskFrozen,taskTarget,upsertTask,type DueBucket,type ProjectStateRow,type Task,type Workbook} from '@/lib/workbook';
import type {ProjectSummary} from '@/lib/projects';

type Props={userId:string;projectId:string;projectName:string;projectSaved:boolean;busy:boolean;list:()=>Promise<ProjectSummary[]>;onOpenProject:(id:string)=>void;onBilling:()=>void};
type Tab='project'|'due'|'clients';
const buckets:DueBucket[]=['overdue','today','week','later','none'];
// Magyar névelő számok elé: az 1, az 5…, az 1000…; minden más „a”.
const article=(n:number)=>n===1||String(n).startsWith('5')||(n>=1000&&n<2000)?'az':'a';
export function WorkbookDialog({userId,projectId,projectName,projectSaved,busy,list,onOpenProject,onBilling}:Props){
 const [open,setOpen]=useState(false),[tab,setTab]=useState<Tab>('project'),[wb,setWb]=useState<Workbook|null>(null),[revision,setRevision]=useState(0),[rows,setRows]=useState<ProjectStateRow[]>([]),[names,setNames]=useState<Record<string,string>>({});
 const [working,setWorking]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(''),[conflict,setConflict]=useState(false),[billingHint,setBillingHint]=useState(false),[today,setToday]=useState(()=>localDay()),[badge,setBadge]=useState(0);
 const [showDone,setShowDone]=useState(false),[showFrozen,setShowFrozen]=useState(false),[dueTarget,setDueTarget]=useState(''),[confirmClear,setConfirmClear]=useState(false),[assignTo,setAssignTo]=useState('');
 function apply(d:WorkbookResponse){setWb(d.workbook);setRevision(d.revision);setRows(d.projects);setBadge(dueCount(d.workbook,projectStatus(d.projects),localDay()))}
 // Mountkor csak a jelvény frissül, így egy késve érkező válasz nem írja felül a megnyitott dialógus frissebb adatait.
 useEffect(()=>{if(!userId)return;let live=true;fetchWorkbook(userId).then(d=>{if(live)setBadge(dueCount(d.workbook,projectStatus(d.projects),localDay()))},()=>{});return()=>{live=false}},[userId]);
 // Hibánál a figyelmeztetés (és a „Lista frissítése” / „Előfizetés kezelése” gomb) görgetés nélkül is látható és billentyűzettel elérhető legyen;
 // a toast gombja a modális dialógus mellett nem kattintható, ezért a teendő a dialóguson belül marad.
 const alertRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=alertRef.current;if(!error||!el)return;el.scrollIntoView({block:'nearest'});el.focus({preventScroll:true})},[error]);
 function toggle(v:boolean){setOpen(v);if(v){setToday(localDay());setConfirmClear(false);void load()}}
 async function load(){if(!userId)return;setLoading(true);setError('');setConflict(false);setBillingHint(false);try{const [d,projects]=await Promise.all([fetchWorkbook(userId),list().catch(()=>[] as ProjectSummary[])]);apply(d);setNames(Object.fromEntries(projects.map(p=>[p.id,p.name])))}catch(e){setError(e instanceof Error?e.message:'Az ügyfelek és teendők most nem tölthetők be.')}finally{setLoading(false)}}
 async function persist(next:Workbook,message:string){if(working)return false;setWorking(true);setError('');setConflict(false);setBillingHint(false);try{apply(await saveWorkbook(userId,next,revision));toast.success(message);return true}catch(e){
  // A hiba toastban is megjelenik, a dialógus tetején lévő figyelmeztetés pedig a görgetési pozíciótól függetlenül előtérbe kerül (lásd alertRef).
  const msg=e instanceof Error?e.message:'Nem sikerült menteni az ügyfeleket és teendőket.';setError(msg);toast.error(msg);if(e instanceof WorkbookError){if(e.code==='WORKBOOK_CONFLICT')setConflict(true);if(e.status===402)setBillingHint(true)}return false}finally{setWorking(false)}}
 function go(t:Tab){setTab(t);setAssignTo('');setConfirmClear(false)}
 const statusOf=projectStatus(rows),nameOf=(id:string)=>names[id]||(id===projectId?projectName:'Névtelen projekt');
 function leave(action:()=>void){setOpen(false);action()}
 const context=(t:Task):ReactNode=>{if(!wb)return null;const c=taskClient(wb,t);if(!t.projectId)return t.clientId&&c?'Ügyfél: '+clientLabel(c):'Általános';const id=t.projectId,s=statusOf(id);
  return <>{'Projekt: '+nameOf(id)}{c&&' · Ügyfél: '+clientLabel(c)}{s==='active'&&id!==projectId&&<button type="button" className="workbook-link" onClick={()=>leave(()=>onOpenProject(id))}><FolderOpen/> Megnyitás</button>}{s==='locked'&&<button type="button" className="workbook-link" onClick={()=>leave(onBilling)}><CreditCard/> Előfizetés</button>}</>};
 const tasks:TaskHandlers={today,frozenOf:t=>taskFrozen(t,statusOf),onStatus:(t,s)=>{if(wb)void persist(setTaskStatus(wb,t.id,s,nowStamp()),'A teendő állapota mentve.')},onSave:t=>wb?persist(upsertTask(wb,t),'A teendő mentve.'):Promise.resolve(false),onDelete:t=>{if(wb)void persist(removeTask(wb,t.id),'A teendő törölve.')}};
 const full=!!wb&&wb.tasks.length>=TASK_LIMIT;
 function projectTab(w:Workbook){
  const assigned=clientForProject(w,projectId),site=assigned?clientSiteText(assigned):'',own=sortTasks(w.tasks.filter(t=>t.projectId===projectId));
  const options=w.clients.filter(c=>!c.archived||c.id===assigned?.id).sort((a,b)=>clientLabel(a).localeCompare(clientLabel(b),'hu')).map(c=>[c.id,clientLabel(c)] as [string,string]);
  return <section className="workbook-section"><h3>{projectName}</h3>
   {!projectSaved&&<p className="warning-banner">Mentsd el a projektet a Mentés gombbal, utána rendelhetsz hozzá ügyfelet és teendőt.</p>}
   <fieldset className="workbook-body" disabled={!projectSaved}>
    <h4>Ügyfél</h4>
    <div className="workbook-row"><Choice label="A projekt ügyfele" value={assigned?.id||''} onChange={v=>void persist(assignClient(w,projectId,v||null),'Az ügyfél-hozzárendelés mentve.')} items={[['','Nincs hozzárendelve'],...options]}/><button type="button" onClick={()=>{setTab('clients');setAssignTo(projectId)}}><UserPlus/> Új ügyfél…</button></div>
    {assigned&&<div className="workbook-client-card"><strong>{clientLabel(assigned)}</strong>{site&&<span>{site}</span>}{assigned.phone&&<a href={'tel:'+assigned.phone.replace(/[^0-9+]/g,'')}>{assigned.phone}</a>}{assigned.email&&<a href={'mailto:'+assigned.email}>{assigned.email}</a>}{assigned.note&&<small>{assigned.note}</small>}</div>}
    <p className="report-note">Az árajánlatba az Eszközök → Árazás / árajánlat fül „Ügyféladatok átvétele” gombjával kerül át.</p>
    <h4>Teendők</h4>
    {own.length?<TaskList {...tasks} tasks={own}/>:<p className="report-note">Ehhez a projekthez még nincs teendő.</p>}
    <TaskForm target={{projectId,clientId:null}} today={today} full={full} onSubmit={t=>persist(upsertTask(w,t),'A teendő hozzáadva.')}/>
   </fieldset>
  </section>;
 }
 function dueTab(w:Workbook){
  const visible=w.tasks.filter(t=>(showFrozen||taskFrozen(t,statusOf)===null)&&(showDone||t.status!=='done')),done=w.tasks.filter(t=>t.status==='done').length;
  const groups=[...buckets,...(showDone?['done' as const]:[])].map(b=>[b,sortTasks(visible.filter(t=>dueBucket(t,today)===b))] as const).filter(([,list])=>list.length);
  const items:[string,string][]=[['','Általános (projekt nélkül)'],...w.clients.filter(c=>!c.archived).sort((a,b)=>clientLabel(a).localeCompare(clientLabel(b),'hu')).map(c=>['c:'+c.id,'Ügyfél: '+clientLabel(c)] as [string,string]),...rows.filter(r=>statusOf(r.id)==='active').map(r=>['p:'+r.id,'Projekt: '+nameOf(r.id)] as [string,string])];
  // A választó és a mentés ugyanabból az ellenőrzött értékből dolgozik: az időközben archivált/törölt ügyfél vagy inaktív projekt általánossá válik.
  const {value:selected,target}=taskTarget(dueTarget,items.map(([v])=>v));
  return <section className="workbook-section">
   <label className="copy-option"><input type="checkbox" checked={showDone} onChange={e=>setShowDone(e.target.checked)}/>Kész teendők mutatása</label>
   <label className="copy-option"><input type="checkbox" checked={showFrozen} onChange={e=>setShowFrozen(e.target.checked)}/>Archivált, lomtáras és zárolt projektek teendői</label>
   {groups.length?groups.map(([b,list])=><section className="workbook-group" key={b}><h4>{dueBucketLabels[b]} ({list.length})</h4><TaskList {...tasks} tasks={list} context={context}/></section>):<p>Nincs esedékes teendő.</p>}
   <h4>Új teendő</h4>
   <Choice label="Hová tartozik?" value={selected} onChange={setDueTarget} items={items}/>
   <TaskForm target={target} today={today} full={full} onSubmit={t=>persist(upsertTask(w,t),'A teendő hozzáadva.')}/>
   {!!done&&!confirmClear&&<button type="button" onClick={()=>setConfirmClear(true)}><Trash2/> Kész teendők törlése ({done})</button>}
   {confirmClear&&<div className="project-state-confirm"><b>Kész teendők törlése</b><p>Törlöd mind {article(done)} {done} kész teendőt? Nem vonható vissza.</p><div className="project-actions"><button type="button" onClick={()=>setConfirmClear(false)}>Mégse</button><button type="button" className="danger" onClick={()=>void persist(clearDoneTasks(w),'A kész teendők törölve.').then(ok=>{if(ok)setConfirmClear(false)})}><Trash2/> Törlés</button></div></div>}
  </section>;
 }
 return <><button className="workbook-button" aria-label="Ügyfelek és teendők" title="Ügyfelek és teendők" disabled={busy} onClick={()=>toggle(true)}><Users/><span>Ügyfelek</span>{badge>0&&<b className="workbook-badge" aria-label={badge+' lejárt vagy mai teendő'}>{badge}</b>}</button>
 <Dialog open={open} onOpenChange={toggle}><DialogContent className="workbook-dialog"><DialogHeader><DialogTitle>Ügyfelek és teendők</DialogTitle><DialogDescription>Ügyféladatok, projekt-hozzárendelés és határidős teendők. A fiókodhoz tartoznak, a terv JSON-exportjába nem kerülnek bele.</DialogDescription></DialogHeader>
 {!userId?<p className="billing-notice">Az ügyfél- és feladatkezelés fiókhoz kötött: az adatokat a szerveren tároljuk, hogy minden eszközödön elérd. Jelentkezz be vagy regisztrálj a Fiók menüben; a nyitott terv megmarad.</p>:<>
  {loading&&<p role="status">Betöltés…</p>}
  {error&&<div role="alert" ref={alertRef} tabIndex={-1} className="workbook-alert"><p className="auth-error">{error}</p><div className="project-actions">{(conflict||!wb)&&<button type="button" disabled={loading||working} onClick={()=>void load()}>Lista frissítése</button>}{billingHint&&<button type="button" onClick={()=>leave(onBilling)}><CreditCard/> Előfizetés kezelése</button>}</div></div>}
  {wb&&<fieldset className="workbook-body" disabled={working||loading}>
   <div className="auth-tabs" role="group" aria-label="Ügyfelek és teendők nézet"><button type="button" className={tab==='project'?'active':''} aria-pressed={tab==='project'} onClick={()=>go('project')}><FolderOpen/> Ez a projekt</button><button type="button" className={tab==='due'?'active':''} aria-pressed={tab==='due'} onClick={()=>go('due')}><CalendarClock/> {badge>0?`Esedékes (${badge})`:'Esedékes'}</button><button type="button" className={tab==='clients'?'active':''} aria-pressed={tab==='clients'} onClick={()=>go('clients')}><Users/> Ügyfelek ({wb.clients.filter(c=>!c.archived).length})</button></div>
   {tab==='project'?projectTab(wb):tab==='due'?dueTab(wb):<ClientsPanel key={assignTo} wb={wb} rows={rows} statusOf={statusOf} nameOf={nameOf} tasks={tasks} context={context} assignTo={assignTo} persist={persist} onAssigned={()=>go('project')}/>}
  </fieldset>}
 </>}
 </DialogContent></Dialog></>;
}
