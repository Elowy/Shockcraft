"use client";
import {useEffect,useState} from 'react';
import {Archive,BookCopy,Plus,Save,RotateCcw} from 'lucide-react';
import {toast} from 'sonner';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from './ui/dialog';
import {Field} from './plan-controls';
import {captureTemplate,insertTemplate,TEMPLATE_LIMIT,type PlanTemplate} from '@/lib/templates';
import type {Plan} from '@/lib/plan';
type LibraryResponse={templates:PlanTemplate[];revision:number;userId:string;error?:string};
type Props={plan:Plan;buildingId:string;floorId:string;roomId?:string;userId:string;busy:boolean;onApply:(result:ReturnType<typeof insertTemplate>)=>void};
export function TemplateLibrary(props:Props){
 const [open,setOpen]=useState(false);
 return <><button disabled={props.busy||!props.userId} onClick={()=>setOpen(true)}><BookCopy/>{props.roomId?'Szoba sablonként':'Sablonok'}</button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="template-dialog"><DialogHeader><DialogTitle>Saját sablonkönyvtár</DialogTitle><DialogDescription>Ments szobát vagy szintet, és használd fel más projektekben is. A sablonok a saját fiókodhoz tartoznak.</DialogDescription></DialogHeader>{open&&<LibraryForm {...props} onApply={result=>{props.onApply(result);setOpen(false)}}/>}</DialogContent></Dialog></>;
}
function LibraryForm({plan,buildingId,floorId,roomId,userId,busy,onApply}:Props){
 const b=plan.buildings.find(b=>b.id===buildingId)!,f=b.floors.find(f=>f.id===floorId)!,room=f.rooms.find(r=>r.id===roomId);
 const [templates,setTemplates]=useState<PlanTemplate[]>([]),[revision,setRevision]=useState(0),[ready,setReady]=useState(false),[working,setWorking]=useState(false),[error,setError]=useState('');
 const [saveName,setSaveName]=useState(room?.name||f.name),[contents,setContents]=useState(true),[search,setSearch]=useState(''),[archived,setArchived]=useState(false),[selected,setSelected]=useState('');
 const [name,setName]=useState(''),[x,setX]=useState(String(Math.min(48,Math.max(0,...f.rooms.map(r=>(r.x+r.w)/40))+1))),[y,setY]=useState('1'),[elevation,setElevation]=useState(String(Math.min(100,Math.max(...b.floors.map(f=>f.elevation))+3))),[include,setInclude]=useState(true);
 const chosen=templates.find(t=>t.id===selected),locked=busy||working||!ready;
 async function load(){setWorking(true);setError('');try{const r=await fetch('/api/templates',{cache:'no-store',signal:AbortSignal.timeout(15000)}),d=await r.json() as LibraryResponse;if(!r.ok||d.userId!==userId)throw Error(d.error||'A fiók megváltozott.');setTemplates(d.templates);setRevision(d.revision);setReady(true)}catch(e){setError(e instanceof Error?e.message:'Nem tölthető be.');setReady(false)}finally{setWorking(false)}}
 useEffect(()=>{void load()},[]);
 async function persist(next:PlanTemplate[]){setWorking(true);setError('');try{const r=await fetch('/api/templates',{method:'PUT',signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json'},body:JSON.stringify({templates:next,revision,userId})}),d=await r.json() as LibraryResponse;if(!r.ok||d.userId!==userId)throw Error(d.error||'Nem sikerült menteni.');setTemplates(d.templates);setRevision(d.revision);toast.success('Sablonkönyvtár a fiókodba mentve.');return true}catch(e){setError(e instanceof Error?e.message:'Nem sikerült menteni.');return false}finally{setWorking(false)}}
 function choose(t:PlanTemplate){setSelected(t.id);setName(t.name);setError('')}
 const filtered=templates.filter(t=>t.archived===archived&&t.name.toLocaleLowerCase('hu').includes(search.toLocaleLowerCase('hu')));
 return <div className="template-library">
  <section className="template-capture"><h3>{room?'Kijelölt szoba mentése':'Jelenlegi szint mentése'}</h3><p>{room?.name||f.name} · {b.name}</p><form onSubmit={async e=>{e.preventDefault();if(locked)return;try{const t=captureTemplate(plan,buildingId,floorId,roomId,saveName,contents);if(await persist([...templates,t])){setArchived(false);setSearch('');choose(t)}}catch(e){setError(e instanceof Error?e.message:'A sablon nem készíthető el.')}}}>
   <Field label="Sablon neve" value={saveName} onChange={setSaveName}/><label className="copy-option"><input type="checkbox" checked={contents} onChange={e=>setContents(e.target.checked)}/>Szerelvények és nyomvonalak mentése</label><button type="submit" disabled={locked||!saveName.trim()||templates.length>=TEMPLATE_LIMIT}><Save/> Mentés sablonként</button>
  </form></section>
  <section><div className="template-heading"><h3>Mentett sablonok <small>{templates.length} / {TEMPLATE_LIMIT}</small></h3><button disabled={working} onClick={()=>void load()}>Lista frissítése</button></div><Field label="Sablon keresése" value={search} onChange={setSearch}/><label className="copy-option"><input type="checkbox" checked={archived} onChange={e=>{setArchived(e.target.checked);setSelected('')}}/>Archivált sablonok</label>
   {working&&<p role="status">Sablonkönyvtár feldolgozása…</p>}{ready&&!filtered.length&&<p>Nincs ilyen {archived?'archivált ':''}sablon.</p>}
   <div className="template-list">{filtered.map(t=><button key={t.id} className={selected===t.id?'active':''} aria-pressed={selected===t.id} onClick={()=>choose(t)}><BookCopy/><span><strong>{t.name}</strong><small>{t.kind==='room'?'Szoba':'Szint'} · {t.floor.rooms.length} helyiség · {t.floor.devices.length} szerelvény · {t.floor.routes.length} nyomvonal</small></span></button>)}</div>
  </section>
  {chosen&&<section className="template-insert"><h3>{chosen.archived?'Archivált sablon':'Beillesztés: '+chosen.name}</h3><p>{chosen.kind==='room'?`${b.name} / ${f.name} szintre, külön szobaként.`:`${b.name} épületbe, új szintként.`}</p><Field label="Beillesztett elem / sablon neve" value={name} onChange={setName}/>
   <div className="template-heading"><button disabled={locked||!name.trim()} onClick={()=>void persist(templates.map(t=>t.id===chosen.id?{...t,name:name.trim()}:t))}>Sablon átnevezése</button><button disabled={locked} onClick={async()=>{if(await persist(templates.map(t=>t.id===chosen.id?{...t,archived:!t.archived}:t)))setSelected('')}}>{chosen.archived?<RotateCcw/>:<Archive/>}{chosen.archived?'Visszaállítás':'Archiválás'}</button></div>
   {!chosen.archived&&<form onSubmit={e=>{e.preventDefault();if(locked)return;setError('');try{if(chosen.kind==='room'?x.trim()===''||y.trim()==='':elevation.trim()==='')throw Error('Töltsd ki a számmezőket.');onApply(insertTemplate(plan,chosen,{buildingId,floorId,name,x:Number(x)*40,y:Number(y)*40,elevation:Number(elevation),contents:include}))}catch(e){setError(e instanceof Error?e.message:'A sablon nem illeszthető be.')}}}>
    {chosen.kind==='room'?<div className="pair"><Field label="Bal felső sarok X (m)" type="number" step={.1} value={x} onChange={setX}/><Field label="Bal felső sarok Y (m)" type="number" step={.1} value={y} onChange={setY}/></div>:<Field label="Új szint magassága (m)" type="number" min={-30} max={100} step={.1} value={elevation} onChange={setElevation}/>}
    <label className="copy-option"><input type="checkbox" checked={include} onChange={e=>setInclude(e.target.checked)}/>Szerelvények és nyomvonalak beillesztése</label><button className="primary" disabled={locked||!name.trim()} type="submit"><Plus/> Sablon beillesztése</button>
   </form>}
  </section>}
  <p className="template-note">A falak, ajtók, ablakok és méretvonalak megmaradnak. Az áramkör-hozzárendeléseket az új projektben állíthatod be. Az elosztójelek, elosztószekrények, telki elemek és háttérképek kimaradnak. A beillesztés visszavonható; a könyvtár változásai külön mentődnek.</p>
  {error&&<p className="error-banner" role="alert">{error}</p>}
 </div>;
}
