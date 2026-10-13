'use client';
import {useMemo,useState} from 'react';
import {ArrowUpRight,ChevronRight,Trash2,TriangleAlert} from 'lucide-react';
import {toast} from 'sonner';
import {Choice} from '@/components/plan-controls';
import type {Plan} from '@/lib/plan';
import type {SearchResult} from '@/lib/plan-tools';
import {calcHref} from '@/lib/kb/links';
import {INSTALL_METHODS,INSULATIONS,SECTIONS,SIZING_TABLES,insulationLabels,methodLabels,reviewText,tablesApproved,type InstallMethod,type Insulation} from '@/lib/sizing-tables';
import {overrideKey,type CircuitSizing} from '@/lib/sizing-schema';
import {SIZING_DISCLAIMER,SIZING_NOT_COVERED,cableLabel,checkStatusLabels,fmtNum,hasSizingTarget,parseDecimalInput,projectSizing,refText,removeOverride,setBoardSizing,setCircuitLoad,setCircuitSizing,setPlanSizing,sizingCells,sizingContext,sizingTarget,statusLabels,upsertOverride,type CircuitSizingResult,type SizingContext,type SizingStatus,type Valued} from '@/lib/sizing';

type Change=(fn:(p:Plan)=>void)=>void;
/** Mélylink a Feszültségesés kalkulátorra az áramkör adataival (csak közzétett kalkulátorra; a T1 kiadásáig null, így nem jelenik meg). */
const dropCalcHref=(r:CircuitSizingResult,supply:'public'|'private')=>{
 const A=r.segments.every(s=>s.cable)?Math.min(...r.segments.map(s=>s.cable!.section)):null;
 return r.length===null||A===null?null:calcHref('feszultseges',{rendszer:r.phase==='3P'?'3f':'1f',I:+r.dropCurrent.toFixed(2),L:+r.length.toFixed(2),A,cos:r.cosPhi.value,hatar:supply+'-'+r.usage.value});
};
const filters:[string,string][]=[['all','Minden áramkör'],['fail',statusLabels.fail],['na',statusLabels.na],['warn',statusLabels.warn],['ok',statusLabels.ok]];
const methodItems:[string,string][]=INSTALL_METHODS.map(m=>[m,methodLabels[m]]);
const star=(v:Valued<unknown>)=>v.source==='alapérték'?'*':'';
const sourceText=(v:Valued<unknown>)=>v.source==='alapérték'?'alapérték':v.source;
const asDraft=(v:number|undefined)=>v===undefined?'':String(v).replace('.',',');

/** Számmező helyi piszkozattal: elhagyáskor vagy Enterre ment; üresen törli a beállítást. A tartomány a sémával egyezik.
 * Szöveges mező (nem type="number"): a tizedesvessző nem vész el, és görgetésre sem változik az érték. Nem kerekít. */
function NumberField({label,value,min,max,integer=false,placeholder,help,onCommit}:{label:string;value:number|undefined;min:number;max:number;integer?:boolean;placeholder?:string;help?:string;onCommit:(v:number|undefined)=>void}){
 const [draft,setDraft]=useState(asDraft(value));
 function commit(){
  const n=parseDecimalInput(draft);
  if(n===null){if(value!==undefined)onCommit(undefined);return}
  if(Number.isFinite(n)&&n>=min&&n<=max&&(!integer||Number.isInteger(n))){if(n!==value)onCommit(n);else setDraft(asDraft(value));return}
  toast.error(`${label}: ${fmtNum(min)} és ${fmtNum(max)} közötti ${integer?'egész ':''}számot adj meg${integer?'':' (tizedesvesszővel is)'}.`);setDraft(asDraft(value));
 }
 return <label className="field"><span>{label}</span><input type="text" inputMode={integer?'numeric':'decimal'} autoComplete="off" aria-label={label} value={draft} placeholder={placeholder} onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur()}}/>{help&&<small>{help}</small>}</label>;
}

function CircuitForm({plan,r,onChange}:{plan:Plan;r:CircuitSizingResult;onChange:Change}){
 const c=plan.circuits.find(c=>c.id===r.circuitId);if(!c)return null;
 const cs:CircuitSizing=c.sizing??{},set=(patch:Parameters<typeof setCircuitSizing>[2])=>onChange(p=>setCircuitSizing(p,c.id,patch));
 return <div className="sizing-form">
  <Choice label="Szerelési mód" value={cs.method??''} onChange={v=>set({method:(v||undefined) as InstallMethod|undefined})} items={[['','Automatikus (nyomvonal szerint)'],...methodItems]}/>
  <Choice label="Szigetelés" value={cs.insulation??''} onChange={v=>set({insulation:(v||undefined) as Insulation|undefined})} items={[['','Automatikus (kábeljelölés / projekt)'],...INSULATIONS.map(i=>[i,insulationLabels[i]] as [string,string])]}/>
  <Choice label="Felhasználás" value={cs.usage??''} onChange={v=>set({usage:(v||undefined) as CircuitSizing['usage']})} items={[['','Automatikus'],['lighting','Világítás'],['other','Egyéb fogyasztó']]}/>
  <NumberField key={'load:'+String(c.load??'')} label="Terhelés (W)" value={c.load} min={0} max={200000} integer placeholder={r.ibSource==='becsült'?'becsült: '+fmtNum(r.watts,0):undefined} onCommit={v=>onChange(p=>setCircuitLoad(p,c.id,v))}/>
  <NumberField key={'ambient:'+String(cs.ambient??'')} label="Környezeti hőmérséklet (°C)" value={cs.ambient} min={10} max={60} integer placeholder={fmtNum(r.ambient.value)+' ('+sourceText(r.ambient)+')'} onCommit={v=>set({ambient:v})}/>
  <NumberField key={'grouped:'+String(cs.grouped??'')} label="Együtt vezetett áramkörök száma" value={cs.grouped} min={1} max={20} integer placeholder={fmtNum(r.grouped.value)+' ('+sourceText(r.grouped)+')'} onCommit={v=>set({grouped:v})}/>
  <NumberField key={'cos:'+String(cs.cosPhi??'')} label="cos φ" value={cs.cosPhi} min={0.5} max={1} placeholder={fmtNum(r.cosPhi.value)+' ('+sourceText(r.cosPhi)+')'} onCommit={v=>set({cosPhi:v})}/>
  <NumberField key={'length:'+String(cs.length??'')} label="Mértékadó hossz (m) – felülírás" value={cs.length} min={0.1} max={1000} placeholder={r.lengthSource==='nyomvonalak'&&r.length!==null?'nyomvonalak: '+fmtNum(r.length):'nincs megadva'} onCommit={v=>set({length:v})}/>
 </div>;
}

function CircuitDetails({plan,r,onChange,onLocate,ctx}:{plan:Plan;r:CircuitSizingResult;onChange?:Change;onLocate:(t:SearchResult)=>void;ctx:SizingContext}){
 const seg=r.governing??r.segments[0],cells=sizingCells(r);
 // Az ugrási célt csak kattintáskor számoljuk; a gomb tiltásához elég a létezés.
 const locate=()=>{const t=sizingTarget(plan,r.circuitId,ctx);if(t)onLocate(t)};
 return <details className="sizing-circuit">
  <summary>
   <span className="sizing-name"><ChevronRight className="sizing-chevron" aria-hidden="true"/><span><b>{r.name}</b><small>{r.phase} · {r.curve}{r.rating} A{r.device==='RCBO'?' · RCBO':''}</small></span></span>
   <span className="sizing-col">{r.cable?r.cableText:'nem értelmezhető'}{r.cable&&seg&&<small>{seg.method.value}{star(seg.method)} · {seg.insulation.value}{star(seg.insulation)}</small>}</span>
   <span className="sizing-col">{cells.current}</span>
   <span className="sizing-col">{r.length===null?'–':fmtNum(r.length)+' m'}</span>
   <span className="sizing-col">{cells.drop}</span>
   <span><span className={'sizing-badge '+r.status}>{r.label}</span></span>
  </summary>
  <div className="sizing-body">
   <h4>Ellenőrzések</h4>
   <ul className="sizing-checks">{r.checks.map(c=><li key={c.code}>
    <div className="sizing-check-head"><span className={'sizing-badge '+c.status}>{checkStatusLabels[c.status]}</span> <b>{c.title}</b>{c.clause&&c.clause!=='–'&&<small>{c.clause}</small>}</div>
    {c.formula&&<code>{c.formula}</code>}
    {c.calculation&&<p>{c.calculation}</p>}
    {c.detail&&<p className="report-note">{c.detail}</p>}
   </li>)}</ul>
   <h4>Felhasznált értékek</h4>
   <ul className="sizing-refs">{r.refs.map((x,i)=><li key={i}>{refText(x)}</li>)}</ul>
   {!!r.assumptions.length&&<><h4>Feltételezések</h4><ul className="sizing-assumptions">{r.assumptions.map(a=><li key={a.text} className={a.strong?'strong':undefined}>{a.text}</li>)}</ul>{r.assumptions.some(a=>a.strong)&&<p className="report-note">A kiemelt feltételezések nem a biztonság javára közelítenek (a valós helyzet kedvezőtlenebb lehet): add meg a tényleges értéket.</p>}</>}
   <h4>Szakaszok</h4>
   <ul className="sizing-segments">{r.segments.map((s,i)=><li key={s.routeId??'virtual'+i}><span>{s.name} · {s.routeId===null?'hossz nélkül':fmtNum(s.length)+' m'} · {s.cable?cableLabel(s.cable):'nincs kábel'}{s.cableSource?' ('+s.cableSource+')':''} · {s.method.value} ({sourceText(s.method)}) · {s.insulation.value} ({sourceText(s.insulation)}) · Iz {s.iz===null?'–':fmtNum(s.iz)} A</span>{s.target&&<button type="button" onClick={()=>onLocate(s.target!)}><ArrowUpRight aria-hidden="true"/> Megnyitás</button>}</li>)}</ul>
   {onChange&&<><h4>Az áramkör méretezési adatai</h4><p className="report-note">Minden mező üresen hagyható: ekkor a projekt alapértéke vagy az automatikus érték érvényes (a mezőben halványan látszik). Tizedesvessző és -pont is használható. A módosítás az ablak bezárása után a szerkesztő Visszavonás gombjával (Ctrl+Z) vonható vissza.</p><CircuitForm plan={plan} r={r} onChange={onChange}/></>}
   <div className="sizing-links"><button type="button" disabled={!hasSizingTarget(plan,r.circuitId,ctx)} onClick={locate}><ArrowUpRight aria-hidden="true"/> Ugrás az áramkörhöz</button>{(()=>{const href=dropCalcHref(r,plan.sizing?.supply??'public');return href&&<a className="guide-link" href={href} target="_blank" rel="noopener">Feszültségesés a kalkulátorban ↗<span className="sr-only"> (új lapon)</span></a>})()}</div>
  </div>
 </details>;
}

function BoardSettings({plan,building,board,onChange}:{plan:Plan;building:string;board:string;onChange:Change}){
 const entry=plan.sizing?.boards?.find(x=>x.building===building&&x.board===board);
 return <details className="sizing-settings"><summary>Elosztó betáplálása</summary><div className="sizing-form">
  <NumberField key={'up:'+String(entry?.upstreamDrop??'')} label="Elosztó előtti feszültségesés (%)" value={entry?.upstreamDrop} min={0} max={10} placeholder="0 (alapérték)" onCommit={v=>onChange(p=>setBoardSizing(p,building,board,{upstreamDrop:v}))}/>
  <NumberField key={'zs:'+String(entry?.zs??'')} label="Hurokimpedancia az elosztónál, Zs (Ω)" value={entry?.zs} min={0.01} max={20} help="Mért vagy szolgáltatói érték. Üresen hagyva a hurokellenőrzés kimarad." onCommit={v=>onChange(p=>setBoardSizing(p,building,board,{zs:v}))}/>
 </div></details>;
}

const limits=(l:{lighting:number;other:number})=>'(világítás '+fmtNum(l.lighting)+'%, egyéb '+fmtNum(l.other)+'%)';
function ProjectSettings({plan,onChange}:{plan:Plan;onChange:Change}){
 const s=plan.sizing??{};
 return <details className="sizing-settings"><summary>Projekt alapértékei</summary><div className="sizing-form">
  <Choice label="Falon belüli nyomvonal szerelési módja" value={s.methodInside??''} onChange={v=>onChange(p=>setPlanSizing(p,{methodInside:(v||undefined) as InstallMethod|undefined}))} items={[['','Nincs megadva – B2'],...methodItems]}/>
  <Choice label="Falon kívüli nyomvonal szerelési módja" value={s.methodOutside??''} onChange={v=>onChange(p=>setPlanSizing(p,{methodOutside:(v||undefined) as InstallMethod|undefined}))} items={[['','Nincs megadva – B2'],...methodItems]}/>
  <Choice label="Szigetelés" value={s.insulation??''} onChange={v=>onChange(p=>setPlanSizing(p,{insulation:(v||undefined) as Insulation|undefined}))} items={[['','Nincs megadva – PVC'],['PVC',insulationLabels.PVC],['XLPE',insulationLabels.XLPE]]}/>
  <NumberField key={'pa:'+String(s.ambient??'')} label="Környezeti hőmérséklet (°C)" value={s.ambient} min={10} max={60} integer placeholder="30 (alapérték)" onCommit={v=>onChange(p=>setPlanSizing(p,{ambient:v}))}/>
  <NumberField key={'pg:'+String(s.grouped??'')} label="Együtt vezetett áramkörök" value={s.grouped} min={1} max={20} integer placeholder="1 (alapérték)" onCommit={v=>onChange(p=>setPlanSizing(p,{grouped:v}))}/>
  <Choice label="Táplálás" value={s.supply??''} onChange={v=>onChange(p=>setPlanSizing(p,{supply:(v||undefined) as 'public'|'private'|undefined}))} items={[['','Nincs megadva – közcélú hálózat'],['public','Közcélú kisfeszültségű hálózat '+limits(SIZING_TABLES.dropLimits.public)],['private','Saját transzformátor / táppont '+limits(SIZING_TABLES.dropLimits.private)]]}/>
  <Choice label="Földelési rendszer" value={s.earthing??''} onChange={v=>onChange(p=>setPlanSizing(p,{earthing:(v||undefined) as 'TN'|'TT'|undefined}))} items={[['','Nincs megadva – TN'],['TN','TN'],['TT','TT (hurokellenőrzés nélkül)']]}/>
 </div></details>;
}

function Overrides({plan,onChange}:{plan:Plan;onChange:Change}){
 const [method,setMethod]=useState<string>('B2'),[insulation,setInsulation]=useState<string>('PVC'),[loaded,setLoaded]=useState('2'),[section,setSection]=useState('2.5'),[iz,setIz]=useState(''),[note,setNote]=useState('');
 const list=plan.sizing?.overrides??[];
 function save(){
  const value=Number(iz.replace(',','.'));
  if(!Number.isFinite(value)||value<1||value>1000||note.trim().length<3){toast.error('Adj meg 1 és 1000 A közötti értéket és legalább 3 karakteres forrást.');return}
  onChange(p=>upsertOverride(p,{method:method as InstallMethod,insulation:insulation as Insulation,loaded:loaded==='3'?3:2,section:Number(section),iz:value,note:note.trim().slice(0,200)}));
  setIz('');setNote('');toast.success('A felülírás bekerült a projektbe.');
 }
 return <details className="sizing-settings"><summary>Táblázat-felülírások (projekt)</summary>
  <p className="report-note">Gyártói vagy tervezői adat alapján egy Iz0 táblázati érték felülírható. A forrás megadása kötelező; a felülírt érték a számításban így jelölve szerepel.</p>
  {list.length?<ul className="sizing-segments">{list.map(o=><li key={overrideKey(o)}><span>{o.method} · {o.insulation} · {o.loaded} terhelt ér · {fmtNum(o.section)} mm² → {fmtNum(o.iz)} A – {o.note}</span><button type="button" aria-label={'Felülírás törlése: '+o.method+' '+fmtNum(o.section)+' mm²'} onClick={()=>onChange(p=>removeOverride(p,overrideKey(o)))}><Trash2 aria-hidden="true"/> Törlés</button></li>)}</ul>:<p className="report-note">Nincs projekt-felülírás.</p>}
  <div className="sizing-form">
   <Choice label="Szerelési mód" value={method} onChange={setMethod} items={INSTALL_METHODS.map(m=>[m,m] as [string,string])}/>
   <Choice label="Szigetelés" value={insulation} onChange={setInsulation} items={INSULATIONS.map(i=>[i,i] as [string,string])}/>
   <Choice label="Terhelt erek" value={loaded} onChange={setLoaded} items={[['2','2 terhelt ér'],['3','3 terhelt ér']]}/>
   <Choice label="Keresztmetszet" value={section} onChange={setSection} items={SECTIONS.map(s=>[String(s),fmtNum(s)+' mm²'] as [string,string])}/>
   <label className="field"><span>Iz0 (A)</span><input aria-label="Iz0 (A)" inputMode="decimal" value={iz} onChange={e=>setIz(e.target.value)}/></label>
   <label className="field"><span>Forrás (pl. gyártói katalógus, oldalszám)</span><input aria-label="Forrás (pl. gyártói katalógus, oldalszám)" maxLength={200} value={note} onChange={e=>setNote(e.target.value)}/></label>
  </div>
  <div><button type="button" onClick={save}>Felülírás mentése</button></div>
 </details>;
}

/** Méretezési segédszámítás fül. `onChange` nélkül csak olvasható (minden beállító rész rejtve). */
export function SizingReport({plan,onChange,onLocate}:{plan:Plan;onChange?:Change;onLocate:(t:SearchResult)=>void}){
 const [scope,setScope]=useState('all'),[filter,setFilter]=useState('all');
 const area=plan.buildings.some(b=>b.id===scope)?scope:'all';
 const groups=useMemo(()=>projectSizing(plan,area),[plan,area]);
 const ctx=useMemo(()=>sizingContext(plan),[plan]);
 const all=groups.flatMap(g=>g.results),count=(s:SizingStatus)=>all.filter(r=>r.status===s).length;
 const visible=(r:CircuitSizingResult)=>filter==='all'||r.status===filter;
 return <section className="sizing-report" aria-label="Méretezési segédszámítás">
  <div className="sizing-disclaimer" role="note"><TriangleAlert aria-hidden="true"/><p><b>Méretezési segédszámítás – nem tervezői méretezés.</b> {SIZING_DISCLAIMER}</p></div>
  <p className={'sizing-review'+(tablesApproved()?'':' pending')} role="status">{reviewText()}</p>
  <div className="report-controls"><Choice label="Méretezés területe" value={area} onChange={setScope} items={[['all','Teljes projekt'],...plan.buildings.map(b=>[b.id,b.name] as [string,string])]}/><Choice label="Találatok" value={filter} onChange={setFilter} items={filters}/></div>
  <div className="report-totals"><div><span>{statusLabels.ok}</span><strong>{count('ok')}</strong></div><div><span>{statusLabels.warn}</span><strong>{count('warn')}</strong></div><div><span>{statusLabels.fail}</span><strong>{count('fail')}</strong></div><div><span>{statusLabels.na}</span><strong>{count('na')}</strong></div></div>
  {groups.map(({building,board,results})=>{const shown=results.filter(visible);return <div className="sizing-board" key={building.id+':'+board.id}>
   <h3>{building.name} · {board.name}</h3>
   {onChange&&<BoardSettings plan={plan} building={building.id} board={board.id} onChange={onChange}/>}
   {shown.length?<><div className="sizing-head" aria-hidden="true"><span>Áramkör</span><span>Kábel / mód</span><span>Ib / In / Iz</span><span>Hossz</span><span>ΔU / határ</span><span>Eredmény</span></div>
    {shown.map(r=><CircuitDetails key={r.circuitId} plan={plan} r={r} onChange={onChange} onLocate={onLocate} ctx={ctx}/>)}</>:<p className="report-note">Nincs a szűrésnek megfelelő áramkör.</p>}
  </div>})}
  {!groups.length&&<p className="check-empty">Ezen a területen még nincs áramkör. Az elosztó áramkörjegyzékében hozhatsz létre egyet.</p>}
  <p className="report-note">* = feltételezett (alap)érték; ≈ = a szerelvényekből becsült terhelés; n. sz. = nem számítható; – = nem vizsgált / nincs adat. A hossz a nyomvonalak soros összege (elágazásnál felülbecsül). Egy áramkör sorára kattintva látszik a képlet, a behelyettesítés, a forrás és a beállítás.</p>
  {onChange&&<ProjectSettings plan={plan} onChange={onChange}/>}
  {onChange&&<Overrides plan={plan} onChange={onChange}/>}
  <details className="sizing-settings"><summary>Mit nem vizsgál a számítás</summary><ul>{SIZING_NOT_COVERED.map(s=><li key={s}>{s}</li>)}</ul></details>
 </section>;
}
