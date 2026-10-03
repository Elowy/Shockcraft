'use client';
import {useMemo,useState} from 'react';
import {ArrowUpRight,ClipboardCheck} from 'lucide-react';
import {Choice} from '@/components/plan-controls';
import {checkPlan,checkLevels} from '@/lib/plan-checks';
import type {Plan} from '@/lib/plan';
import type {SearchResult} from '@/lib/plan-tools';

export function PlanChecks({plan,onLocate}:{plan:Plan;onLocate:(target:SearchResult)=>void}){
 const [scope,setScope]=useState('all'),[level,setLevel]=useState('all'),[limit,setLimit]=useState(100);
 const issues=useMemo(()=>checkPlan(plan),[plan]);
 const effectiveScope=plan.buildings.some(b=>b.id===scope)?scope:'all';
 const scoped=issues.filter(i=>effectiveScope==='all'||i.target.buildingId===effectiveScope);
 const visible=scoped.filter(i=>level==='all'||i.level===level);
 const missing=scoped.filter(i=>i.level==='missing').length;
 return <section className="plan-checks" aria-label="Tervellenőrzés eredménye">
  <p className="report-note">A megadott tervadatok teljességét és a rögzített kapcsolatokat vizsgáljuk. Ez a nézet nem végez villamos méretezést vagy szabványossági ellenőrzést.</p>
  <div className="report-controls"><Choice label="Ellenőrzés területe" value={effectiveScope} onChange={v=>{setScope(v);setLimit(100)}} items={[["all","Teljes projekt"],...plan.buildings.map(b=>[b.id,b.name] as [string,string])]}/><Choice label="Találatok szűrése" value={level} onChange={v=>{setLevel(v);setLimit(100)}} items={[["all","Minden találat"],["missing","Hiányzó adatok"],["review","Átnézendő tételek"]]}/></div>
  <div className="check-totals"><span><strong>{missing}</strong> hiányzó adat</span><span><strong>{scoped.length-missing}</strong> átnézendő tétel</span></div>
  <p className="report-note" role="status">{visible.length?visible.length+' találat. Válassz egyet az érintett elem megnyitásához.':'Nincs találat a kiválasztott feltételekkel.'}</p>
  {visible.length?<div className="check-results">{visible.slice(0,limit).map(issue=><button key={issue.id} onClick={()=>onLocate(issue.target)} aria-label={issue.title+' – '+issue.target.title+' megnyitása'}>
   <span className="check-result-body"><span className={'check-badge '+issue.level}>{checkLevels[issue.level]}</span><strong>{issue.title}</strong><b>{issue.target.title}</b><small>{issue.target.subtitle}</small><span className="check-detail">{issue.detail}</span></span><ArrowUpRight aria-hidden="true"/>
  </button>)}</div>:<div className="check-empty"><ClipboardCheck aria-hidden="true"/><span>{scoped.length?'Másik szűrővel további tételeket nézhetsz át.':'A jelenlegi ellenőrzések nem találtak hiányzó adatot vagy átnézendő kapcsolatot.'}</span></div>}
  {visible.length>limit&&<button onClick={()=>setLimit(n=>n+100)}>További találatok ({visible.length-limit})</button>}
 </section>;
}
