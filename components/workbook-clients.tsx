"use client";
import {useState,type ReactNode} from 'react';
import {Archive,Plus,RotateCcw,Save,Trash2,Unlink,UserRound} from 'lucide-react';
import {Choice,Field} from './plan-controls';
import {TaskForm,TaskList,type TaskHandlers} from './workbook-tasks';
import {TASK_LIMIT,assignClient,clientLabel,clientSchema,nowStamp,projectStatusLabels,removeClient,setClientArchived,sortTasks,upsertClient,upsertTask,workbookErrorMap,type Client,type ProjectStateRow,type ProjectStatus,type Task,type Workbook} from '@/lib/workbook';

type Fields='name'|'company'|'taxNumber'|'postalCode'|'city'|'address'|'phone'|'email'|'note';
const blank=():Client=>({id:crypto.randomUUID(),name:'',company:'',taxNumber:'',postalCode:'',city:'',address:'',phone:'',email:'',note:'',archived:false,createdAt:'',updatedAt:''});
const byLabel=(a:Client,b:Client)=>clientLabel(a).localeCompare(clientLabel(b),'hu');
type Props={wb:Workbook;rows:ProjectStateRow[];statusOf:(id:string)=>ProjectStatus;nameOf:(id:string)=>string;tasks:TaskHandlers;context:(t:Task)=>ReactNode;assignTo:string;persist:(next:Workbook,message:string)=>Promise<boolean>;onAssigned:()=>void};
export function ClientsPanel({wb,rows,statusOf,nameOf,tasks,context,assignTo,persist,onAssigned}:Props){
 const [search,setSearch]=useState(''),[archived,setArchived]=useState(false),[draft,setDraft]=useState<Client|null>(()=>assignTo?blank():null),[target,setTarget]=useState(assignTo),[errors,setErrors]=useState<Partial<Record<Fields,string>>>({}),[confirm,setConfirm]=useState(false);
 const stored=draft&&wb.clients.find(c=>c.id===draft.id),projectsOf=(id:string)=>wb.assignments.filter(a=>a.clientId===id).map(a=>a.projectId);
 const related=(c:Client)=>{const projects=new Set(projectsOf(c.id));return wb.tasks.filter(t=>t.clientId===c.id||!!t.projectId&&projects.has(t.projectId))};
 const query=search.trim().toLocaleLowerCase('hu');
 const visible=wb.clients.filter(c=>(archived||!c.archived)&&(!query||[c.name,c.company,c.city,c.phone,c.email].join(' ').toLocaleLowerCase('hu').includes(query))).sort(byLabel);
 function edit(c:Client|null){setDraft(c);setErrors({});setConfirm(false);setTarget('')}
 async function save(){if(!draft)return;const now=nowStamp(),r=clientSchema.safeParse({...draft,createdAt:draft.createdAt||now,updatedAt:now},{errorMap:workbookErrorMap});
  if(!r.success){const next:Partial<Record<Fields,string>>={};for(const i of r.error.issues){const k=String(i.path[0]) as Fields;next[k]??=i.message}setErrors(next);return}
  setErrors({});let next=upsertClient(wb,r.data);if(target)next=assignClient(next,target,r.data.id);
  if(await persist(next,stored?'Az ügyfél adatai mentve.':target?'Az ügyfél létrejött, és a projekthez rendeltük.':'Az ügyfél létrejött.')){const back=!!target;edit(null);if(back)onAssigned()}}
 const input=(label:string,key:Fields,extra:{type?:string;placeholder?:string;inputMode?:'numeric'}={})=><label className="field"><span>{label}</span><input aria-label={label} type={extra.type||'text'} placeholder={extra.placeholder} inputMode={extra.inputMode} value={draft?.[key]||''} onChange={e=>setDraft(d=>d&&{...d,[key]:e.target.value})}/>{errors[key]&&<small className="auth-error">{errors[key]}</small>}</label>;
 if(draft){
  const c=stored,assigned=c?projectsOf(c.id):[],own=c?sortTasks(related(c)):[],free=rows.filter(r=>statusOf(r.id)==='active'&&!wb.assignments.some(a=>a.projectId===r.id));
  return <div className="workbook-client-editor">
   <h3>{c?clientLabel(c):'Új ügyfél'}</h3>{target&&<p className="report-note">Mentés után ehhez a projekthez rendeljük: „{nameOf(target)}”.</p>}
   <form className="workbook-client-form" noValidate onSubmit={e=>{e.preventDefault();void save()}}>
    {input('Név*','name')}{input('Cégnév','company')}{input('Adószám','taxNumber',{placeholder:'12345678-1-12'})}{input('Irányítószám','postalCode',{inputMode:'numeric'})}{input('Település','city')}{input('Cím (utca, házszám)','address')}{input('Telefon','phone',{type:'tel'})}{input('E-mail','email',{type:'email'})}
    <label className="field wide"><span>Megjegyzés (belső, nem kerül az ajánlatba)</span><textarea aria-label="Megjegyzés (belső, nem kerül az ajánlatba)" value={draft.note} maxLength={1000} rows={3} onChange={e=>setDraft(d=>d&&{...d,note:e.target.value})}/>{errors.note&&<small className="auth-error">{errors.note}</small>}</label>
    <div className="project-actions wide"><button type="submit" className="primary"><Save/> Mentés</button><button type="button" onClick={()=>edit(null)}>Mégse</button>{c&&<button type="button" onClick={()=>void persist(setClientArchived(wb,c.id,!c.archived,nowStamp()),c.archived?'Az ügyfél visszaállítva.':'Az ügyfél archiválva.').then(ok=>{if(ok)edit(null)})}>{c.archived?<RotateCcw/>:<Archive/>}{c.archived?'Visszaállítás':'Archiválás'}</button>}{c&&<button type="button" className="danger" onClick={()=>setConfirm(true)}><Trash2/> Törlés</button>}</div>
   </form>
   {c&&confirm&&<div className="project-state-confirm"><b>Ügyfél törlése</b><p>Törlöd: {clientLabel(c)}? {assigned.length} projekt-hozzárendelés megszűnik, {wb.tasks.filter(t=>t.clientId===c.id).length} ügyfélhez kötött teendő általános teendő lesz. A korábban árajánlatba átvett adatok a tervekben megmaradnak.</p><div className="project-actions"><button type="button" onClick={()=>setConfirm(false)}>Mégse</button><button type="button" className="danger" onClick={()=>void persist(removeClient(wb,c.id,nowStamp()),'Az ügyfél törölve.').then(ok=>{if(ok)edit(null)})}><Trash2/> Végleges törlés</button></div></div>}
   {c&&<section className="workbook-section"><h4>Projektjei</h4>{assigned.length?<ul className="workbook-projects">{assigned.map(id=><li key={id}><span>{nameOf(id)}</span><span className="workbook-tag">{projectStatusLabels[statusOf(id)]}</span><button type="button" onClick={()=>void persist(assignClient(wb,id,null),'A hozzárendelés megszűnt.')}><Unlink/> Levétel</button></li>)}</ul>:<p className="report-note">Még nincs projekthez rendelve.</p>}
    {!!free.length&&<Choice label="Hozzárendelés projekthez" value="" onChange={v=>{if(v)void persist(assignClient(wb,v,c.id),'A projekt hozzárendelve.')}} items={[['','Válassz aktív projektet…'],...free.map(r=>[r.id,nameOf(r.id)] as [string,string])]}/>}</section>}
   {c&&<section className="workbook-section"><h4>Teendők</h4>{own.length?<TaskList {...tasks} tasks={own} context={context}/>:<p className="report-note">Ehhez az ügyfélhez még nincs teendő.</p>}<h4>Új teendő ehhez az ügyfélhez</h4><TaskForm target={{projectId:null,clientId:c.id}} today={tasks.today} full={wb.tasks.length>=TASK_LIMIT} onSubmit={t=>persist(upsertTask(wb,t),'A teendő hozzáadva.')}/></section>}
  </div>;
 }
 return <div className="workbook-clients">
  <div className="workbook-row"><Field label="Keresés (név, cég, település, telefon, e-mail)" value={search} onChange={setSearch}/><button type="button" className="primary" onClick={()=>edit(blank())}><Plus/> Új ügyfél</button></div>
  <label className="copy-option"><input type="checkbox" checked={archived} onChange={e=>setArchived(e.target.checked)}/>Archivált ügyfelek is</label>
  {visible.length?<div className="workbook-client-list">{visible.map(c=>{const n=projectsOf(c.id).length,m=related(c).filter(t=>t.status!=='done').length;return <button type="button" key={c.id} onClick={()=>edit(c)}><span><strong>{clientLabel(c)}</strong><small>{[c.city,c.phone,n+' projekt',m+' nyitott teendő'].filter(Boolean).join(' · ')}</small></span><UserRound/></button>})}</div>
  :<p>{wb.clients.length?'Nincs a keresésnek megfelelő ügyfél.':'Még nincs ügyfél. Az „Új ügyfél” gombbal rögzítheted az elsőt.'}</p>}
 </div>;
}
