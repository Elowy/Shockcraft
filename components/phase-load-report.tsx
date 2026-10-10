'use client';
import {useState} from 'react';
import {Choice} from './plan-controls';
import {estimatedPower,IMBALANCE_LIMIT,phases,projectPhaseLoads} from '@/lib/phase-load';
import type {Plan} from '@/lib/plan';

const fmt=(n:number,d=1)=>n.toLocaleString('hu-HU',{maximumFractionDigits:d});
const kw=(w:number)=>fmt(w/1000,2)+' kW';
export function PhaseLoadReport({plan,sizingHint=true}:{plan:Plan;sizingHint?:boolean}){
 const [scope,setScope]=useState('all');
 const area=plan.buildings.some(b=>b.id===scope)?scope:'all';
 const loads=projectPhaseLoads(plan,area);
 return <section className="phase-load" aria-label="Fázisterhelés">
  <div className="report-controls"><Choice label="Fázisterhelés területe" value={area} onChange={setScope} items={[["all","Teljes projekt"],...plan.buildings.map(b=>[b.id,b.name] as [string,string])]}/></div>
  <p className="report-note">Elosztónként összesítjük az áramkörök terhelését. Ahol az áramkörjegyzékben nincs megadott terhelés, a hozzárendelt szerelvényekből becsülünk (dugalj {estimatedPower.socket} W, kettős dugalj {estimatedPower.double} W, lámpakiállás {estimatedPower.light} W). A háromfázisú áramkör terhelése egyenlően oszlik a fázisok között. Számítás 230 V fázisfeszültséggel, cos φ = 1 és egyidejűségi tényező nélkül; ez tájékoztató összesítés, nem méretezés.{sizingHint&&' A szerkesztő Eszközök → Méretezés fülén tervezői ellenőrzést segítő vezeték- és feszültségesés-számítás készíthető.'}</p>
  {loads.map(({building,board,load})=>{const max=Math.max(1,...phases.map(p=>load.phases[p].watts));return <div className="phase-load-board" key={building.id+':'+board.id}>
   <h3>{building.name} · {board.name}</h3>
   <div className="report-totals"><div><span>Összes terhelés</span><strong>{kw(load.total)}</strong></div><div><span>Aszimmetria</span><strong className={load.imbalance>IMBALANCE_LIMIT?'phase-warn':''}>{fmt(load.imbalance,0)}%</strong></div><div><span>Áramkörök</span><strong>{load.circuits.length} db</strong></div></div>
   <div className="phase-bars">{phases.map(p=><div key={p} className="phase-bar"><span>{p}</span><div aria-hidden="true"><i style={{width:load.phases[p].watts/max*100+'%'}}/></div><strong>{kw(load.phases[p].watts)} · {fmt(load.phases[p].current)} A</strong></div>)}</div>
   {!!load.issues.length&&<ul className="phase-issues">{load.issues.map((i,n)=><li key={n} className={i.code==='noload'?'':'phase-warn'}><b>{i.title}</b><small>{i.detail}</small></li>)}</ul>}
   <div className="report-table"><table><thead><tr><th>Áramkör</th><th>Fázis</th><th>Védelem</th><th>Terhelés</th><th>Áram</th></tr></thead><tbody>{load.circuits.map(c=><tr key={c.circuit.id}><td><b>{c.circuit.name}</b><small>{c.devices} szerelvény</small></td><td>{c.circuit.phase}</td><td>{c.circuit.curve}{c.circuit.rating} A</td><td>{fmt(c.watts,0)} W{c.estimated&&<small>becsült</small>}</td><td className={c.overload?'phase-warn':''}>{fmt(c.current)} A{c.circuit.phase==='3P'&&<small>fázisonként</small>}</td></tr>)}</tbody></table></div>
  </div>})}
  {!loads.length&&<p className="check-empty">Ezen a területen még nincs áramkör. Az elosztó áramkörjegyzékében hozhatsz létre egyet.</p>}
 </section>;
}
