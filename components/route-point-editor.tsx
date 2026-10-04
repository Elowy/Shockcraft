'use client';
import {useState} from 'react';
import {Plus,Trash2,Route} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from './ui/dialog';
import {floorLength,type FloorRoute} from '@/lib/geometry';
import {routePointDraft,readRoutePoints,insertRoutePoint,removeRoutePoint,type PointDraft} from '@/lib/route-points';
import type {Floor,Point} from '@/lib/plan';
const fmt=(n:number)=>n.toLocaleString('hu-HU',{maximumFractionDigits:2});
export function RoutePointEditor({route,floor,onApply}:{route:FloorRoute;floor:Floor;onApply:(points:Point[])=>void}){
 const [open,setOpen]=useState(false),[draft,setDraft]=useState<PointDraft[]>([]);
 let points:Point[]|null=null,error='';
 if(open)try{points=readRoutePoints(draft,route,floor)}catch(e){error=e instanceof Error?e.message:'Ellenőrizd a koordinátákat.'}
 const length=points?floorLength({...route,points},floor):null;
 function edit(i:number,key:'x'|'y',value:string){setDraft(prev=>prev.map((p,j)=>i===j?{...p,[key]:value}:p))}
 return <><button className="route-point-trigger" onClick={()=>{setDraft(routePointDraft(route,floor));setOpen(true)}}><Route/> Töréspontok szerkesztése</button>
 <Dialog open={open} onOpenChange={setOpen}><DialogContent className="route-point-dialog"><DialogHeader><DialogTitle>Nyomvonal töréspontjai</DialogTitle><DialogDescription>{route.name} · A koordináták a szint rajzi origójától mért méterek. A kapcsolt végpontokat a szerelvény mozgatásával változtathatod meg.</DialogDescription></DialogHeader>
 <div className="route-point-summary" role="status"><b>{draft.length} pont</b><span>{length?`${fmt(length.total)} m teljes hossz · ebből ${fmt(length.vertical)} m függőleges`:'A hosszhoz javítsd a koordinátákat.'}</span></div>
 <div className="route-point-list">{draft.map((p,i)=>{const linked=i===0?route.startId:i===draft.length-1?route.endId:'';const device=linked?floor.devices.find(d=>d.id===linked):null;return <div className="route-point-entry" key={i}>
  <div className="route-point-row"><span className="route-point-label"><b>{i===0?'Kezdőpont':i===draft.length-1?'Végpont':i+'. töréspont'}</b>{device&&<small>{device.name} · rögzített</small>}</span>
  {(['x','y'] as const).map(key=><label key={key}><span>{key.toUpperCase()} (m)</span><input aria-label={`${i+1}. pont ${key.toUpperCase()} (m)`} inputMode="decimal" value={p[key]} disabled={!!linked} onChange={e=>edit(i,key,e.target.value)}/></label>)}
  <button className="iconbutton" aria-label={`${i}. töréspont törlése`} title="Töréspont törlése" disabled={i===0||i===draft.length-1} onClick={()=>setDraft(removeRoutePoint(draft,i))}><Trash2/></button></div>
  {i<draft.length-1&&<button className="route-point-insert" disabled={!!error||draft.length>=300} onClick={()=>setDraft(insertRoutePoint(draft,i,route,floor))} aria-label={`Pont beszúrása a(z) ${i+1}. szakaszba`}><Plus/> Pont beszúrása</button>}
 </div>})}</div>
 {error&&<p className="route-point-error" role="alert">{error}</p>}
 <p className="report-note">Az új pont a szakasz közepére kerül. Pont törlésekor a két szomszédját közvetlenül összekötjük; ez ferde szakaszt is létrehozhat. A módosítás az Alkalmazás után kerül a tervbe.</p>
 <div className="route-point-actions"><button onClick={()=>setOpen(false)}>Mégse</button><button className="primary" disabled={!points} onClick={()=>{if(points){onApply(points);setOpen(false)}}}>Alkalmazás</button></div>
 </DialogContent></Dialog></>;
}
