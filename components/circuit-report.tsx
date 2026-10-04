'use client';
import {useMemo,useState} from 'react';
import {MapPin} from 'lucide-react';
import {Choice} from './plan-controls';
import {circuitReport} from '@/lib/circuit-report';
import type {Plan} from '@/lib/plan';
import type {SearchResult} from '@/lib/plan-tools';

const fmt=(n:number)=>n.toLocaleString('hu-HU',{maximumFractionDigits:2});
export function CircuitReport({plan,onLocate}:{plan:Plan;onLocate:(r:SearchResult)=>void}){
 const [scope,setScope]=useState('all'),[chosen,setChosen]=useState(''),[limit,setLimit]=useState(100);
 const area=plan.buildings.some(b=>b.id===scope)?scope:'all';
 const circuits=plan.circuits.filter(c=>area==='all'||c.building===area);
 const selected=circuits.find(c=>c.id===chosen)||circuits[0];
 const report=useMemo(()=>circuitReport(plan,selected?.id||''),[plan,selected?.id]);
 const locate=(r:SearchResult)=> <button className="circuit-report-item" key={r.type+r.id} onClick={()=>onLocate(r)} aria-label={r.title+' megnyitása'}><span><b>{r.title}</b><small>{r.subtitle}</small></span><MapPin aria-hidden="true"/></button>;
 return <section className="circuit-report" aria-label="Áramkörlista">
  <div className="report-controls"><Choice label="Áramkörlista területe" value={area} onChange={v=>{setScope(v);setLimit(100)}} items={[["all","Teljes projekt"],...plan.buildings.map(b=>[b.id,b.name] as [string,string])]}/>{!!circuits.length&&<Choice label="Áttekintett áramkör" value={selected.id} onChange={v=>{setChosen(v);setLimit(100)}} items={circuits.map(c=>[c.id,c.name+' · '+plan.buildings.find(b=>b.id===c.building)?.name])}/>}</div>
  {report?<>
   <p className="circuit-report-rating"><strong>{report.circuit.name}</strong><span>{report.circuit.phase} · {report.circuit.curve}{report.circuit.rating} A · {report.circuit.cable||'Nincs kábeltípus'}</span></p>
   <div className="report-totals"><div><span>Szerelvények</span><strong>{report.devices.length} db</strong></div><div><span>Nyomvonalhossz</span><strong>{fmt(report.length.total)} m</strong></div><div><span>Bekötött szálak</span><strong>{report.ports.filter(p=>p.target).length}/{report.ports.length}</strong></div></div>
   <p className="report-note">{fmt(report.length.horizontal)} m alaprajzi + {fmt(report.length.vertical)} m függőleges szakasz, ráhagyás nélkül. Csak az áramkörhöz rendelt nyomvonalakat számoljuk; a telki és az elosztón belüli vezetékeket nem.</p>
   <div className="circuit-report-sections">
    <details open><summary>Elosztóbekötések ({report.ports.length} szál)</summary><p className="report-note">A közvetlenül rögzített bekötések. A készülék áramkörhöz rendelése önmagában még nem jelent bekötést.</p>{report.ports.map(p=><div className="circuit-report-port" key={p.id}><strong>{p.signal}</strong><span>{p.label}</span>{p.target?<button onClick={()=>onLocate(p.target!)} aria-label={p.label+' bekötési pontjának megnyitása'}>{p.connection}<small>{p.wireName}</small></button>:<em>Nincs bekötve</em>}</div>)}</details>
    <details><summary>Hozzárendelt elosztókészülékek ({report.modules.length})</summary>{report.modules.map(locate)}{!report.modules.length&&<p className="report-note">Nincs hozzárendelt elosztókészülék.</p>}</details>
    <details open><summary>Szerelvények minden szinten ({report.devices.length})</summary>{report.devices.slice(0,limit).map(locate)}{!report.devices.length&&<p className="report-note">Még nincs szerelvény ehhez az áramkörhöz rendelve.</p>}{report.devices.length>limit&&<button onClick={()=>setLimit(n=>n+100)}>További szerelvények</button>}</details>
    <details><summary>Nyomvonalak ({report.routes.length})</summary>{report.routes.slice(0,limit).map(r=>locate({...r,subtitle:r.subtitle+' · '+fmt(r.total)+' m'}))}{!report.routes.length&&<p className="report-note">Még nincs nyomvonal ehhez az áramkörhöz rendelve.</p>}{report.routes.length>limit&&<button onClick={()=>setLimit(n=>n+100)}>További nyomvonalak</button>}</details>
   </div>
  </>:<p className="check-empty">Ezen a területen még nincs áramkör. Az Áramkörök nézetben hozhatsz létre egyet.</p>}
 </section>;
}
