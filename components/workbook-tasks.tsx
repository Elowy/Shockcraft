"use client";
import {useState,type ReactNode} from 'react';
import {Pencil,Plus,Save,Trash2} from 'lucide-react';
import {Field} from './plan-controls';
import {addDays,dueBucket,formatDay,newTask,nowStamp,taskSchema,taskStatuses,taskStatusLabels,workbookErrorMap,type ProjectStatus,type Task,type TaskStatus} from '@/lib/workbook';

type Frozen=Exclude<ProjectStatus,'active'>;
const frozenLabels:Record<Frozen,string>={archived:'Archivált projekt',trash:'Lomtárban lévő projekt',locked:'Zárolt projekt – előfizetéssel szerkeszthető',missing:'Nem található projekt'};
const frozenTitles:Record<Frozen,string>={archived:'Az archivált projekt teendője csak olvasható. Állítsd vissza a projektet a Projektek menüben; a teendő törölhető.',trash:'A lomtárban lévő projekt teendője csak olvasható. Állítsd vissza a projektet a Projektek menüben; a teendő törölhető.',locked:'A zárolt projekt teendője az előfizetés megújításáig csak olvasható; a teendő törölhető.',missing:'A projekt nem található vagy nincs elmentve, ezért a teendő csak olvasható; törölhető.'};
export type TaskHandlers={today:string;frozenOf:(t:Task)=>ProjectStatus|null;onStatus:(t:Task,status:TaskStatus)=>void;onSave:(t:Task)=>Promise<boolean>;onDelete:(t:Task)=>void};

export function TaskList({tasks,context,frozenOf,onStatus,onSave,onDelete,today}:TaskHandlers&{tasks:Task[];context?:(t:Task)=>ReactNode}){
 const [editing,setEditing]=useState(''),[confirm,setConfirm]=useState('');
 return <div className="workbook-tasks">{tasks.map(t=>{
  const frozen=frozenOf(t) as Frozen|null,overdue=dueBucket(t,today)==='overdue',why=frozen?frozenTitles[frozen]:undefined,ctx=context?.(t);
  if(editing===t.id)return <TaskForm key={t.id} initial={t} target={{projectId:t.projectId,clientId:t.clientId}} today={today} onSubmit={async v=>{const ok=await onSave(v);if(ok)setEditing('');return ok}} onCancel={()=>setEditing('')}/>;
  return <div key={t.id} className={['workbook-task',overdue&&'overdue',t.status==='done'&&'done',frozen&&'frozen'].filter(Boolean).join(' ')}>
   <select aria-label={'Állapot: '+t.title} value={t.status} disabled={!!frozen} title={why} onChange={e=>onStatus(t,e.target.value as TaskStatus)}>{taskStatuses.map(s=><option key={s} value={s}>{taskStatusLabels[s]}</option>)}</select>
   <div><span className="workbook-task-title">{t.title}</span>{t.note&&<small className="workbook-task-note">{t.note}</small>}{ctx&&<small>{ctx}</small>}{frozen&&<span className="workbook-tag" title={why}>{frozenLabels[frozen]}</span>}</div>
   <span className="workbook-task-due">{t.due?(overdue?'Lejárt: ':'')+formatDay(t.due):'Nincs határidő'}</span>
   {confirm===t.id?<div className="workbook-task-actions confirming"><span>Törlöd a teendőt? Nem vonható vissza.</span><button type="button" className="danger" onClick={()=>{setConfirm('');onDelete(t)}}><Trash2/> Törlés</button><button type="button" onClick={()=>setConfirm('')}>Mégse</button></div>
   :<div className="workbook-task-actions"><button type="button" disabled={!!frozen} title={why||'Teendő szerkesztése'} aria-label={'Szerkesztés: '+t.title} onClick={()=>{setConfirm('');setEditing(t.id)}}><Pencil/> Szerkesztés</button><button type="button" className="danger" aria-label={'Törlés: '+t.title} onClick={()=>setConfirm(t.id)}><Trash2/> Törlés</button></div>}
  </div>})}</div>;
}

export function TaskForm({initial,target,today,full=false,onSubmit,onCancel}:{initial?:Task;target:Pick<Task,'projectId'|'clientId'>;today:string;full?:boolean;onSubmit:(t:Task)=>Promise<boolean>;onCancel?:()=>void}){
 const [title,setTitle]=useState(initial?.title||''),[due,setDue]=useState(initial?.due||''),[note,setNote]=useState(initial?.note||''),[error,setError]=useState('');
 const blocked=!initial&&full;
 async function submit(){if(blocked)return;const now=nowStamp(),candidate=initial?{...initial,title,note,due,updatedAt:now}:newTask({...target,title,note,due},now);const r=taskSchema.safeParse(candidate,{errorMap:workbookErrorMap});if(!r.success){setError(r.error.issues[0]?.message||'Érvénytelen teendő.');return}setError('');if(await onSubmit(r.data)&&!initial){setTitle('');setNote('');setDue('')}}
 return <form className="workbook-task-form" onSubmit={e=>{e.preventDefault();void submit()}}>
  <Field label="Teendő*" value={title} onChange={setTitle}/>
  <label className="field"><span>Határidő</span><input aria-label="Határidő" type="date" value={due} onChange={e=>setDue(e.target.value)}/></label>
  <div className="workbook-due-quick" role="group" aria-label="Határidő gyorsválasztás"><button type="button" onClick={()=>setDue(today)}>Ma</button><button type="button" onClick={()=>setDue(addDays(today,1))}>Holnap</button><button type="button" onClick={()=>setDue(addDays(today,7))}>1 hét múlva</button><button type="button" onClick={()=>setDue('')}>Nincs határidő</button></div>
  <label className="field"><span>Megjegyzés</span><textarea aria-label="Megjegyzés" value={note} maxLength={500} rows={2} onChange={e=>setNote(e.target.value)}/></label>
  {error&&<small className="auth-error" role="alert">{error}</small>}
  {blocked&&<p className="auth-error">Elérted az 1000 teendős korlátot. Töröld a régi, kész teendőket.</p>}
  <div className="project-actions"><button type="submit" className="primary" disabled={blocked}>{initial?<Save/>:<Plus/>}{initial?'Mentés':'Hozzáadás'}</button>{onCancel&&<button type="button" onClick={onCancel}>Mégse</button>}</div>
 </form>;
}
