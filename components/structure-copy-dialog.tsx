"use client";
import {useState} from 'react';
import {Copy} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Field} from '@/components/plan-controls';
import {copiedName,copySource,copyStructure,suggestRoomOffset,type StructureCopyOptions} from '@/lib/structure-copy';
import type {Plan} from '@/lib/plan';
export function StructureCopyDialog({plan,buildingId,floorId,roomId,busy,onApply}:{plan:Plan;buildingId:string;floorId:string;roomId?:string;busy:boolean;onApply:(result:ReturnType<typeof copyStructure>)=>void}){
 const [open,setOpen]=useState(false);
 return <><button disabled={busy} onClick={()=>setOpen(true)}><Copy/>{roomId?'Szoba másolása':'Szint másolása'}</button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="structure-copy-dialog"><DialogHeader><DialogTitle>{roomId?'Szoba másolása':'Szint másolása'}</DialogTitle><DialogDescription>{roomId?'Készíts külön szerkeszthető másolatot ezen a szinten.':'Készíts új szintet ugyanebben az épületben.'} A művelet egy lépésben visszavonható.</DialogDescription></DialogHeader>{open&&<CopyForm plan={plan} buildingId={buildingId} floorId={floorId} roomId={roomId} busy={busy} onApply={result=>{onApply(result);setOpen(false)}}/>}</DialogContent></Dialog></>;
}
function CopyForm({plan,buildingId,floorId,roomId,busy,onApply}:{plan:Plan;buildingId:string;floorId:string;roomId?:string;busy:boolean;onApply:(result:ReturnType<typeof copyStructure>)=>void}){
 const b=plan.buildings.find(b=>b.id===buildingId)!,f=b.floors.find(f=>f.id===floorId)!,r=f.rooms.find(r=>r.id===roomId);
 const offset=roomId?suggestRoomOffset(f,roomId):{dx:0,dy:0};
 const [name,setName]=useState(()=>copiedName(r?.name||f.name,(r?f.rooms:b.floors).map(v=>v.name))),[elevation,setElevation]=useState(String(Math.min(100,Math.max(...b.floors.map(f=>f.elevation))+3))),[x,setX]=useState(String(offset.dx/40)),[y,setY]=useState(String(offset.dy/40));
 const [contents,setContents]=useState(true),[keepCircuits,setKeepCircuits]=useState(false),[panels,setPanels]=useState(false),[background,setBackground]=useState(true),[error,setError]=useState('');
 const options:StructureCopyOptions={buildingId,floorId,roomId,name,elevation:Number(elevation),dx:Number(x)*40,dy:Number(y)*40,contents,keepCircuits,panels,background};
 const source=copySource(plan,options),counts=source.items.reduce((n,i)=>({...n,[i.type]:(n[i.type]||0)+1}),{} as Record<string,number>);
 return <form onSubmit={e=>{e.preventDefault();setError('');if(busy)return;try{if(roomId?x.trim()===''||y.trim()==='':elevation.trim()==='')throw Error('Töltsd ki a számmezőket.');onApply(copyStructure(plan,options))}catch(e){setError(e instanceof Error?e.message:'A másolás nem sikerült.')}}}>
  <Field label="Másolat neve" value={name} onChange={setName}/>
  {roomId?<div className="pair"><Field label="Vízszintes eltolás (m)" type="number" step={.1} value={x} onChange={setX}/><Field label="Függőleges eltolás (m)" type="number" step={.1} value={y} onChange={setY}/></div>:<Field label="Új szint magassága (m)" type="number" min={-30} max={100} step={.1} value={elevation} onChange={setElevation}/>}
  <label className="copy-option"><input type="checkbox" checked={contents} onChange={e=>setContents(e.target.checked)}/>{roomId?'Szobán belüli elemek másolása':'Szerelvények és nyomvonalak másolása'}</label>
  {contents&&<><label className="copy-option"><input type="checkbox" checked={keepCircuits} onChange={e=>setKeepCircuits(e.target.checked)}/>Meglévő áramkör-hozzárendelések megtartása</label><label className="copy-option"><input type="checkbox" checked={panels} onChange={e=>setPanels(e.target.checked)}/>Alaprajzi elosztójelek másolása</label></>}
  {!roomId&&f.background&&<label className="copy-option"><input type="checkbox" checked={background} onChange={e=>setBackground(e.target.checked)}/>Háttéralaprajz megtartása a méretarányával</label>}
  <p className="copy-summary" role="status">A másolat tartalma: {counts.rooms||0} szoba, {counts.walls||0} fal, {counts.devices||0} szerelvény, {counts.routes||0} nyomvonal, {counts.dimensions||0} méretvonal.</p>
  {roomId&&<p>A szoba határán álló szerelvények is bekerülnek. A fal, nyomvonal és a méretvonal két mérési pontja csak teljes egészében a szobán belül másolódik. Az eltolás pozitív iránya jobbra és lefelé.</p>}
  {contents&&<p>{keepCircuits?'A másolatok ugyanazokhoz a meglévő áramkörökhöz tartoznak.':'A másolt szerelvények és nyomvonalak áramkörét utólag rendelheted hozzá.'} {panels?'Az elosztójel ugyanarra a szekrényre hivatkozik, új szekrényt nem hoz létre.':'Az alaprajzi elosztójelek kimaradnak.'} A kihagyott szerelvényhez vezető másolt nyomvonalvég szabad végpontként marad meg, a magasságával együtt.</p>}
  <p>A telki pontok, elosztószekrények, készülékek és belső bekötéseik nem másolódnak.</p>
  {error&&<p role="alert" className="error-banner">{error}</p>}
  <button className="primary" type="submit" disabled={busy||!name.trim()}><Copy/> Másolat létrehozása</button>
 </form>;
}
