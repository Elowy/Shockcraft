"use client";
import {useState} from 'react';
import {Cable,Plus,Trash2,ArrowRight,Unplug} from 'lucide-react';
import {toast} from 'sonner';
import {Choice} from './plan-controls';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from './ui/table';
import {type Plan,uid} from '@/lib/plan';
import {circuitPorts,modulePorts,moduleLabels,endpointInfo,endpointKey,compatible,connectBoard,wireColor,type Endpoint} from '@/lib/board';

function NameInput({value,label,onCommit}:{value:string;label:string;onCommit:(v:string)=>void}){
 const [draft,setDraft]=useState<string|null>(null);
 return <input aria-label={label} maxLength={120} value={draft??value} onChange={e=>setDraft(e.target.value)} onBlur={()=>{if(draft!==null){if(draft.trim())onCommit(draft.trim());setDraft(null)}}} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();if(e.key==='Escape'){setDraft(null)}}}/>;
}
export function BoardWiring({plan,buildingId,change,onModule}:{plan:Plan;buildingId:string;change:(fn:(p:Plan)=>void)=>void;onModule:(id:string)=>void}){
 const [fromModule,setFromModule]=useState(''),[fromPort,setFromPort]=useState(''),[toModule,setToModule]=useState(''),[toPort,setToPort]=useState(''),[wireName,setWireName]=useState('');
 const circuits=plan.circuits.filter(c=>c.building===buildingId),modules=plan.modules.filter(m=>m.building===buildingId),wires=plan.boardWires.filter(w=>w.building===buildingId);
 const targetOptions=(c:Plan['circuits'][number])=>modules.flatMap(m=>modulePorts(!m.circuit&&['MCB','RCBO'].includes(m.type)?{...m,circuit:c.id}:m,plan).map(p=>({end:{kind:'module',id:m.id,port:p.id} as Endpoint,signal:p.signal,label:m.name+' / '+p.label})));
 const source=modules.find(m=>m.id===fromModule),target=modules.find(m=>m.id===toModule),sourcePorts=source?modulePorts(source,plan):[],signal=sourcePorts.find(p=>p.id===fromPort)?.signal;
 function commitWire(from:Endpoint,to:Endpoint,name:string,replaceId?:string){try{const next=structuredClone(plan);if(replaceId)next.boardWires=next.boardWires.filter(w=>w.id!==replaceId);connectBoard(next,{id:uid(),name,building:buildingId,from,to});change(p=>{p.modules=next.modules;p.boardWires=next.boardWires});return true}catch(e){toast.error(e instanceof Error?e.message:'A bekötés nem hozható létre.');return false}}
 const remove=(id:string)=>change(p=>{p.boardWires=p.boardWires.filter(w=>w.id!==id)});
 const total=circuits.reduce((n,c)=>n+circuitPorts(c).length,0),bound=wires.filter(w=>w.from.kind==='circuit'||w.to.kind==='circuit').length;
 return <section id="board-wiring" className="board-wiring" aria-label="Elosztó bekötései">
  <div className="circuit-heading"><div><h2><Cable/> Áramköri bekötések</h2><p>{bound} / {total} szál bekötve</p></div></div>
  <p className="wiring-help">Minden áramkör külön vezetékszálakkal érkezik az elosztóba. Nevezd el a szálat, majd válaszd ki a készüléket és a kapcsát.</p>
  <div className="circuit-wiring-list">{circuits.map(c=><article className="circuit-wiring" key={c.id}>
   <header><strong>{c.name}</strong><span>{c.phase} · {c.cable}</span></header>
   {circuitPorts(c).map(port=>{const end:Endpoint={kind:'circuit',id:c.id,port:port.id},wire=wires.find(w=>[w.from,w.to].some(e=>endpointKey(e)===endpointKey(end))),other=wire?(wire.from.kind==='module'?wire.from:wire.to):null;
    const options=targetOptions(c);
    const items:[string,string][]=[['','Nincs bekötve'],...options.filter(o=>compatible(port.signal,o.signal)).map(o=>[endpointKey(o.end),o.label] as [string,string])];
    return <div className="conductor-row" key={port.id} style={{'--wire-color':wireColor(port.signal)} as React.CSSProperties}>
     <span className={'conductor-tag '+(port.signal==='PE'?'earth':'')}>{port.signal}</span>
     <NameInput value={port.label} label={`${c.name} ${port.signal} szál neve`} onCommit={v=>change(p=>{const cc=p.circuits.find(x=>x.id===c.id)!;cc.conductorNames={...cc.conductorNames,[port.id]:v};if(wire)p.boardWires.find(w=>w.id===wire.id)!.name=v})}/>
     <span className={'conductor-line '+(!wire?'unconnected':'')} aria-hidden="true"><ArrowRight/></span>
     <Choice label={`${c.name} ${port.signal} bekötése`} value={other?endpointKey(other):''} items={items} onChange={v=>{if(!v){if(wire)remove(wire.id);return}const o=options.find(o=>endpointKey(o.end)===v);if(o)commitWire(end,o.end,port.label,wire?.id)}}/>
    </div>
   })}
  </article>)}</div>
  {!circuits.length&&<p className="wiring-help">Hozz létre áramkört az áramkörjegyzékben a vezetékek bekötéséhez.</p>}
  <div className="wiring-jumpers"><h3>Készülékek közötti átkötés</h3><p className="wiring-help">Például főkapcsoló → leágazó, fázissín → kismegszakító vagy PE-sín → EPH-sín.</p>
   <form onSubmit={e=>{e.preventDefault();if(!fromModule||!toModule||!fromPort||!toPort)return;if(commitWire({kind:'module',id:fromModule,port:fromPort},{kind:'module',id:toModule,port:toPort},wireName.trim()||'Átkötés')){setWireName('');setToModule('');setToPort('')}}}>
    <div className="wiring-endpoints"><Choice label="Kiinduló készülék" value={fromModule} onChange={v=>{setFromModule(v);setFromPort('');setToPort('')}} items={ [['','Válassz készüléket'],...modules.map(m=>[m.id,m.name+' · '+moduleLabels[m.type]] as [string,string])] }/>
    <Choice label="Kiinduló kapocs" value={fromPort} onChange={v=>{setFromPort(v);setToPort('')}} items={ [['','Válassz kapcsot'],...sourcePorts.map(p=>[p.id,p.label] as [string,string])] }/>
    <Choice label="Célkészülék" value={toModule} onChange={v=>{setToModule(v);setToPort('')}} items={ [['','Válassz készüléket'],...modules.filter(m=>m.id!==fromModule).map(m=>[m.id,m.name+' · '+moduleLabels[m.type]] as [string,string])] }/>
    <Choice label="Célkapocs" value={toPort} onChange={setToPort} items={ [['','Válassz kapcsot'],...(target?modulePorts(target,plan):[]).filter(p=>!signal||compatible(signal,p.signal)).map(p=>[p.id,p.label] as [string,string])] }/></div>
    <div className="wiring-add"><label className="field"><span>Átkötés neve</span><input maxLength={120} value={wireName} onChange={e=>setWireName(e.target.value)} placeholder="Pl. L1 betáp → Q1"/></label><button className="primary" disabled={!fromModule||!fromPort||!toModule||!toPort} type="submit"><Plus/> Átkötés hozzáadása</button></div>
   </form>
  </div>
  <div className="circuit-heading"><h3>Bekötési jegyzék</h3><span>{wires.length} kapcsolat</span></div>
  {wires.length?<Table><TableHeader><TableRow><TableHead>Vezeték neve</TableHead><TableHead>Honnan</TableHead><TableHead>Hová</TableHead><TableHead/></TableRow></TableHeader><TableBody>{wires.map(w=><TableRow key={w.id}><TableCell><NameInput value={w.name} label={'Bekötés neve: '+w.name} onCommit={v=>change(p=>{p.boardWires.find(x=>x.id===w.id)!.name=v;const e=[w.from,w.to].find(e=>e.kind==='circuit');if(e){const c=p.circuits.find(c=>c.id===e.id)!;c.conductorNames={...c.conductorNames,[e.port]:v}}})}/></TableCell>{[w.from,w.to].map((e,i)=><TableCell key={i}>{e.kind==='module'?<button className="wiring-link" onClick={()=>onModule(e.id)}>{endpointInfo(plan,e)?.text}</button>:endpointInfo(plan,e)?.text}</TableCell>)}<TableCell><button className="iconbutton" aria-label={'Bekötés törlése: '+w.name} onClick={()=>remove(w.id)}><Trash2/></button></TableCell></TableRow>)}</TableBody></Table>:<p className="wiring-empty"><Unplug/> Még nincs bekötés megadva.</p>}
  <p className="wiring-help">A kapocsjelölések sematikusak; a konkrét készülék kapocskiosztását a gyártói rajz alapján ellenőrizd. A sínek helyfoglalása a készülék tulajdonságainál módosítható.</p>
 </section>;
}
