'use client';
import {useMemo,useRef,useState} from 'react';
import {Cable,Minus,Plus,X,Trash2} from 'lucide-react';
import {toast} from 'sonner';
import {uid,type Plan} from '@/lib/plan';
import {endpointInfo,endpointKey,moduleShort,moduleLabels,wireColor,type Endpoint} from '@/lib/board';
import {cabinetLayout,cabinetWirePoints,connectionPlan,connectionIssue,connectTerminals,type CabinetPin} from '@/lib/cabinet';

const shorten=(s:string,n:number)=>s.length>n?s.slice(0,Math.max(1,n-1))+'…':s;
export function BoardCabinet({plan,buildingId,boardId='',selectedModule,change,onSelect}:{plan:Plan;buildingId:string;boardId?:string;selectedModule?:string;change:(fn:(p:Plan)=>void)=>void;onSelect:(id:string|null)=>void}){
 const [start,setStart]=useState<Endpoint|null>(null),[selectedWire,setSelectedWire]=useState(''),[showWires,setShowWires]=useState(true),[zoom,setZoom]=useState(75),[notice,setNotice]=useState('');
 const scroll=useRef<HTMLDivElement>(null);
 const source=start&&endpointInfo(plan,start)?.building===buildingId&&endpointInfo(plan,start)?.board===boardId?start:null;
 const preview=useMemo(()=>connectionPlan(plan,source?[source]:[]),[plan,source]);
 const layout=useMemo(()=>cabinetLayout(preview,buildingId,boardId),[preview,buildingId,boardId]);
 const wires=plan.boardWires.filter(w=>w.building===buildingId&&endpointInfo(plan,w.from)?.board===boardId),wire=wires.find(w=>w.id===selectedWire);
 const pinMap=new Map(layout.pins.map(p=>[endpointKey(p.end),p]));
 const connected=new Set(wires.flatMap(w=>[endpointKey(w.from),endpointKey(w.to)]));
 const fromText=source?endpointInfo(plan,source)?.text:'';
 function cancel(){setStart(null);setNotice('');setSelectedWire('')}
 function pick(end:Endpoint){
  onSelect(null);setSelectedWire('');
  if(!source){setStart(end);setNotice('Válassz egy kiemelt célkapcsot.');return}
  if(endpointKey(source)===endpointKey(end)){cancel();return}
  try{const next=connectTerminals(plan,source,end,uid());change(p=>{p.modules=next.modules;p.boardWires=next.boardWires});setStart(null);setNotice('Bekötés létrehozva. A Visszavonás gombbal visszaállítható.');toast.success('Bekötés létrehozva.')}
  catch(e){const message=e instanceof Error?e.message:'A bekötés nem hozható létre.';setNotice(message);toast.error(message)}
 }
 function pin(p:CabinetPin){const key=endpointKey(p.end),active=!!source&&key===endpointKey(source),issue=source&&!active?connectionIssue(plan,source,p.end):null,color=wireColor(p.port.signal);
  const label=endpointInfo(preview,p.end)?.text||p.port.label,tip=active?'Kiinduló kapocs. Újabb kattintás: megszakítás.':issue||'Kattints a bekötéshez.';
  return <g className={'cabinet-pin'+(active?' chosen':source&&!issue?' available':issue?' unavailable':'')} key={key} role="button" tabIndex={0} aria-pressed={active} aria-label={'Kapocs: '+label} onClick={()=>pick(p.end)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();pick(p.end)}}}>
   <title>{label+' · '+tip}</title><rect x={p.x-14} y={p.y-13} width="28" height="28" fill="transparent"/>
   <circle className="pin-halo" cx={p.x} cy={p.y} r="12"/><circle cx={p.x} cy={p.y} r="7" fill={connected.has(key)?color:'var(--background)'} stroke={color} strokeWidth="2.5"/>
   {p.port.signal==='PE'&&<path d={`M${p.x-5} ${p.y}h10`} stroke="#efd34a" strokeWidth="3"/>}
   <text x={p.x} y={p.side==='top'?p.y-17:p.y+23} textAnchor="middle" fontSize="12" fill="var(--foreground)">{p.end.kind==='circuit'||p.port.id.replace(/-(in|out)$/,'')==='L'?p.port.signal:p.port.id.replace(/-(in|out)$/,'')}</text>
  </g>;
 }
 return <section className="interactive-cabinet" aria-label="Kattintható elosztóbekötések" onKeyDown={e=>{if(e.key==='Escape'&&(source||wire)){e.stopPropagation();cancel()}if(e.key==='Delete'&&(source||wire))e.stopPropagation()}}>
  <div className="cabinet-connect-toolbar"><strong><Cable/> Bekötés két kattintással</strong><label><input type="checkbox" checked={showWires} onChange={e=>setShowWires(e.target.checked)}/> Vezetékek</label><div className="cabinet-zoom"><button aria-label="Elosztó kicsinyítése" disabled={zoom<=50} onClick={()=>setZoom(v=>v-25)}><Minus/></button><span>{zoom}%</span><button aria-label="Elosztó nagyítása" disabled={zoom>=150} onClick={()=>setZoom(v=>v+25)}><Plus/></button></div></div>
  <p className="cabinet-hint">Kattints egy kapocsra, majd a célkapocsra. Felül a bemenetek, alul a kimenetek; az áramköri szálak a szekrény alatt találhatók. A készülék közepére kattintva a tulajdonságait szerkesztheted.</p>
  <div className="cabinet-connect-status" role="status"><span>{source?<><b>{fromText}</b> · {notice}</>:notice||'Válassz kiinduló kapcsot. Az üres kör szabad, a kitöltött kör bekötött kapcsot jelöl.'}</span>{source&&<button onClick={cancel}><X/> Mégse · Esc</button>}</div>
  {wire&&<div className="cabinet-wire-detail"><span><b>{wire.name}</b><small>{endpointInfo(plan,wire.from)?.text} ↔ {endpointInfo(plan,wire.to)?.text}</small></span><button className="danger" onClick={()=>{change(p=>{p.boardWires=p.boardWires.filter(w=>w.id!==wire.id)});setSelectedWire('');setNotice('Bekötés bontva. A Visszavonás gombbal visszaállítható.')}}><Trash2/> Bekötés bontása</button><button aria-label="Bekötés kijelölésének megszüntetése" onClick={()=>setSelectedWire('')}><X/></button></div>}
  <nav className="cabinet-jump" aria-label="Elosztó gyorsnavigáció"><button onClick={()=>scroll.current?.scrollTo({top:0,left:0,behavior:'smooth'})}>Készülékekhez</button><button onClick={()=>scroll.current?.scrollTo({top:(layout.circuitTop-45)*zoom/100,left:0,behavior:'smooth'})}>Áramköri szálakhoz</button></nav>
  <div ref={scroll} className="cabinet-scroll" tabIndex={0} aria-label="Görgethető elosztószekrény"><svg role="group" aria-label="Elosztókészülékek és kattintható kapcsok" width={layout.width*zoom/100} height={layout.height*zoom/100} viewBox={`0 0 ${layout.width} ${layout.height}`}>
   {layout.rows.map((row,i)=><g key={i}><rect className="cabinet-row-bg" x="62" y={row.y} width={layout.railWidth+20} height={row.h} rx="6"/><text x="76" y={row.y+22} fontSize="14" fill="var(--muted-foreground)">{i+1}. sor</text><rect x="72" y={row.bodyY+35} width={layout.railWidth} height="22" fill="var(--border)"/>{Array.from({length:layout.size.modulesPerRow},(_,j)=><g key={j}><line x1={72+j*80} x2={72+j*80} y1={row.bodyY} y2={row.bodyY+92} stroke="var(--border)"/><text x={112+j*80} y={row.bodyY+52} textAnchor="middle" fontSize="13" fill="var(--muted-foreground)">{j+1}</text></g>)}</g>)}
   {layout.devices.map(d=>{const m=d.module,c=plan.circuits.find(c=>c.id===m.circuit),n=Math.floor(d.w/8);return <g className={'cabinet-device'+(selectedModule===m.id?' selected':'')} key={m.id} role="button" tabIndex={0} aria-label={'Készülék: '+m.name} onClick={()=>{cancel();onSelect(m.id)}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cancel();onSelect(m.id)}}}><title>{m.name+' · '+moduleLabels[m.type]+' · '+(m.slot+1)+'. modulhely'}</title><rect x={d.x} y={d.y} width={d.w} height={d.h} rx="4"/><text x={d.x+d.w/2} y={d.y+22} textAnchor="middle" fontSize="13">{moduleShort[m.type]}</text><text x={d.x+d.w/2} y={d.y+48} textAnchor="middle" fontSize="17" fontWeight="600">{c?c.curve+c.rating+' A':moduleShort[m.type]}</text><text x={d.x+d.w/2} y={d.y+75} textAnchor="middle" fontSize="13">{shorten(m.name,n)}</text></g>})}
   <text x="72" y={layout.circuitTop-17} fontSize="18" fill="var(--foreground)">Áramköri szálak</text>
   {layout.cards.map(d=><g key={d.circuit.id}><rect className="cabinet-circuit" x={d.x} y={d.y} width={d.w} height={d.h} rx="6"/><text x={d.x+16} y={d.y+27} fill="var(--foreground)" fontSize="16"><title>{d.circuit.name}</title>{shorten(d.circuit.name,43)}</text><text x={d.x+16} y={d.y+52} fill="var(--muted-foreground)" fontSize="14">{d.circuit.phase} · {d.circuit.curve}{d.circuit.rating} A · {shorten(d.circuit.cable,34)}</text></g>)}
   {!layout.cards.length&&<text x="72" y={layout.circuitTop+20} fontSize="16" fill="var(--muted-foreground)">Az áramkörjegyzékben létrehozott áramkörök szálai itt jelennek meg.</text>}
   {showWires&&wires.map((w,i)=>{const a=pinMap.get(endpointKey(w.from)),b=pinMap.get(endpointKey(w.to));if(!a||!b)return null;const points=cabinetWirePoints(a,b,i).map(p=>`${p.x},${p.y}`).join(' '),signal=a.port.signal==='L'?b.port.signal:a.port.signal,highlight=wire?.id===w.id||source&&[w.from,w.to].some(e=>endpointKey(e)===endpointKey(source)),dim=!!wire&&!highlight||!!source&&!highlight;
    return <g className="cabinet-wire" key={w.id} opacity={dim ? 0.2 : 1} role="button" tabIndex={0} aria-label={'Vezeték: '+w.name} onClick={()=>{setStart(null);setSelectedWire(w.id);onSelect(null)}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setStart(null);setSelectedWire(w.id);onSelect(null)}}}><title>{w.name+': '+endpointInfo(plan,w.from)?.text+' ↔ '+endpointInfo(plan,w.to)?.text}</title><polyline points={points} fill="none" stroke="transparent" strokeWidth="14"/><polyline points={points} fill="none" stroke={wireColor(signal)} strokeWidth={highlight?4:2.5}/>{signal==='PE'&&<polyline points={points} fill="none" stroke="#efd34a" strokeWidth="1.5" strokeDasharray="7 5"/>}</g>;
   })}
   {layout.pins.map(pin)}
  </svg></div>
  {wires.length>0&&<details className="cabinet-connections"><summary>Bekötések kiválasztása ({wires.length})</summary><div>{wires.map(w=><button key={w.id} aria-pressed={selectedWire===w.id} onClick={()=>{setStart(null);setSelectedWire(w.id);onSelect(null)}}><b>{w.name}</b><small>{endpointInfo(plan,w.from)?.text} ↔ {endpointInfo(plan,w.to)?.text}</small></button>)}</div></details>}
 </section>;
}
