'use client';
import {useMemo,useState} from 'react';
import {MapPin} from 'lucide-react';
import {Choice} from './plan-controls';
import {routeRegister,filterRouteRegister,routeModeLabels,type RouteFilters,type RouteTarget} from '@/lib/route-register';
import type {Plan} from '@/lib/plan';
const fmt=(n:number)=>n.toLocaleString('hu-HU',{maximumFractionDigits:2});
const initial:RouteFilters={building:'all',circuit:'all',mode:'all',query:'',freeOnly:false,sort:'name'};
export function RouteRegister({plan,onLocate}:{plan:Plan;onLocate:(r:RouteTarget)=>void}){
 const [filters,setFilters]=useState(initial),[limit,setLimit]=useState(100);
 const building=['all','plot','floors'].includes(filters.building)||plan.buildings.some(b=>b.id===filters.building)?filters.building:'all';
 const circuits=plan.circuits.filter(c=>building==='all'||building==='floors'||c.building===building);
 const circuit=filters.circuit==='unassigned'||circuits.some(c=>c.id===filters.circuit)?filters.circuit:'all';
 const rows=useMemo(()=>routeRegister(plan),[plan]);
 const visible=useMemo(()=>filterRouteRegister(rows,{...filters,building,circuit}),[rows,filters,building,circuit]);
 const totals=visible.reduce((sum,r)=>({horizontal:sum.horizontal+r.horizontal,vertical:sum.vertical+r.vertical,total:sum.total+r.total}),{horizontal:0,vertical:0,total:0});
 function patch(value:Partial<RouteFilters>){setFilters(f=>({...f,...value}));setLimit(100)}
 return <section className="route-register" aria-label="Nyomvonaljegyzék">
  <div className="route-register-filters"><Choice label="Nyomvonalak területe" value={building} onChange={v=>patch({building:v,circuit:'all',mode:'all',freeOnly:false})} items={[["all","Teljes projekt és telek"],["floors","Csak alaprajzi nyomvonalak"],["plot","Csak telki nyomvonalak"],...plan.buildings.map(b=>[b.id,b.name] as [string,string])]}/>{building!=='plot'&&<Choice label="Nyomvonalak áramköre" value={circuit} onChange={v=>patch({circuit:v})} items={[["all","Minden áramkör"],["unassigned","Nincs áramkör"],...circuits.map(c=>[c.id,c.name+' · '+plan.buildings.find(b=>b.id===c.building)?.name] as [string,string])]}/>}<Choice label="Vezetés szerinti szűrés" value={filters.mode} onChange={v=>patch({mode:v})} items={[["all","Minden vezetési mód"],...Object.entries(routeModeLabels).filter(([key])=>building==='plot'?!['inside','outside'].includes(key):building==='floors'?['inside','outside'].includes(key):true) as [string,string][]]}/><Choice label="Nyomvonalak rendezése" value={filters.sort} onChange={v=>patch({sort:v as RouteFilters['sort']})} items={[["name","Név szerint"],["longest","Leghosszabb elöl"],["shortest","Legrövidebb elöl"]]}/></div>
  <label className="field"><span>Keresés a nyomvonalak között</span><input aria-label="Keresés a nyomvonalak között" value={filters.query} onChange={e=>patch({query:e.target.value})} placeholder="Név, szint, kábeljelölés vagy végpont…"/></label>
  <div className="route-register-options">{building!=='plot'&&<label><input type="checkbox" checked={filters.freeOnly} onChange={e=>patch({freeOnly:e.target.checked})}/> Csak szabad alaprajzi végponttal</label>}<button onClick={()=>{setFilters(initial);setLimit(100)}}>Szűrők törlése</button></div>
  <div className="report-totals"><div><span>Szűrt nyomvonalak</span><strong>{visible.length} db</strong></div><div><span>Teljes hossz</span><strong>{fmt(totals.total)} m</strong></div><div><span>Ebből függőleges</span><strong>{fmt(totals.vertical)} m</strong></div></div>
  <p className="report-note">Alaprajzi és telki nyomvonalak, ráhagyás nélkül. A telki magasságok a közös telek-0 szinthez, az alaprajziak a saját szinthez képest értendők. Épületszűrésnél az alaprajzi szerelvényhez kapcsolt telki vezetékek is szerepelnek. Az áramkörszűrés csak az alaprajzi nyomvonalakra vonatkozik. Az elosztón belüli kapocsvezetékeknek itt nincs számított hosszuk.</p>
  <p className="report-note" role="status">{visible.length?`${visible.length} találat. Kattints a nyomvonalra a rajz és a tulajdonságok megnyitásához.`:'Nincs a szűrésnek megfelelő nyomvonal.'}</p>
  <div className="route-register-list">{visible.slice(0,limit).map(r=><button key={r.target.id} onClick={()=>onLocate(r.target)} aria-label={r.target.title+' nyomvonal megnyitása'}><span className="route-register-body"><b><span className="route-register-kind">{r.kind==='plot'?'Telek':'Alaprajz'}</span>{r.target.title}</b><small>{r.location} · {r.circuit}</small><span>{r.cable} · {routeModeLabels[r.mode]}</span><span>Kezdet: {r.start} · Vég: {r.end}</span><span>Vezetés: {fmt(r.plane)} m · végpontok: {fmt(r.startHeight)} / {fmt(r.endHeight)} m</span>{r.freeEnds>0&&<span className="route-register-free">{r.freeEnds} szabad végpont</span>}</span><span className="route-register-length"><b>{fmt(r.total)} m</b><small>{fmt(r.horizontal)} m vízszintes<br/>{fmt(r.vertical)} m függőleges</small><MapPin aria-hidden="true"/></span></button>)}</div>
  {visible.length>limit&&<button onClick={()=>setLimit(n=>n+100)}>További nyomvonalak ({visible.length-limit})</button>}
 </section>;
}
