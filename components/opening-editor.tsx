"use client";
import {toast} from 'sonner';
import {useEffect,useState} from 'react';
import {Plus,Trash2} from 'lucide-react';
import {Choice} from './plan-controls';
import {newOpening,openingLabel,roomEdges,type Opening,type WallHost} from '@/lib/architecture';
export function ArchitectureNumber({label,value,min,max,step=1,onChange}:{label:string;value:number;min:number;max:number;step?:number;onChange:(value:string)=>void}){
 const [draft,setDraft]=useState(String(value));useEffect(()=>setDraft(String(value)),[value]);
 function commit(){const n=Number(draft);if(draft.trim()!==''&&Number.isFinite(n)&&n>=min&&n<=max){if(n!==value)onChange(draft)}else toast.error(label+': '+min+' és '+max+' közötti értéket adj meg.');setDraft(String(value))}
 return <label className="field"><span>{label}</span><input aria-label={label} type="number" min={min} max={max} step={step} value={draft} onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur()}}/></label>;
}
export function OpeningEditor({host,onChange}:{host:WallHost;onChange:(openings:Opening[])=>void}){
 function apply(openings:Opening[]){try{onChange(openings)}catch(e){toast.error(e instanceof Error?e.message:'Nem módosítható.')}}
 function patch(id:string,key: keyof Opening,value:unknown){apply(host.openings.map(o=>o.id===id?{...o,[key]:value}:o))}
 return <section className="opening-editor" aria-label="Ajtók és ablakok"><h3>Ajtók és ablakok</h3><p>Az Ajtó / ablak eszközzel a falra kattintva is elhelyezheted. A nyílászáró együtt mozog a falával.</p><div className="opening-actions"><button onClick={()=>apply([...host.openings,newOpening('door')])}><Plus/> Ajtó</button><button onClick={()=>apply([...host.openings,newOpening('window')])}><Plus/> Ablak</button></div>
 {host.openings.map((o,i)=>{const [a,b]=host.edges[o.edge],length=Math.hypot(b.x-a.x,b.y-a.y);return <fieldset key={o.id}><legend>{openingLabel(o)} {i+1}</legend>
  <Choice label={'Típus '+(i+1)} value={o.kind} items={[['door','Ajtó'],['window','Ablak']]} onChange={v=>patch(o.id,'kind',v)}/>
  {host.type==='rooms'&&<Choice label={'Falszakasz '+(i+1)} value={String(o.edge)} items={roomEdges.map((s,i)=>[String(i),s])} onChange={v=>patch(o.id,'edge',+v)}/>}
  <ArchitectureNumber label={'Szélesség (cm) '+(i+1)} min={20} max={400} value={o.width} onChange={v=>patch(o.id,'width',+v)}/>
  <ArchitectureNumber label={'Közép távolsága a fal kezdetétől (cm) '+(i+1)} min={o.width/2} max={length/.4-o.width/2} step={10} value={+(o.position*length/.4).toFixed(1)} onChange={v=>patch(o.id,'position',+v*.4/length)}/>
  <ArchitectureNumber label={'Magasság (cm) '+(i+1)} min={20} max={400} value={o.height} onChange={v=>patch(o.id,'height',+v)}/>
  <ArchitectureNumber label={'Alsó él a padlótól (cm) '+(i+1)} min={0} max={400} value={o.sill} onChange={v=>patch(o.id,'sill',+v)}/>
  {o.kind==='door'&&<><Choice label={'Pánt oldala '+(i+1)} value={o.hinge} items={[['start','Fal kezdete felől'],['end','Fal vége felől']]} onChange={v=>patch(o.id,'hinge',v)}/><Choice label={'Nyitás oldala '+(i+1)} value={String(o.swing)} items={[['1',host.type==='rooms'?'Befelé':'Balra a fal irányától'],['-1',host.type==='rooms'?'Kifelé':'Jobbra a fal irányától']]} onChange={v=>patch(o.id,'swing',+v)}/></>}
  <button className="danger" onClick={()=>apply(host.openings.filter(v=>v.id!==o.id))}><Trash2/> {openingLabel(o)} {i+1} törlése</button>
 </fieldset>})}<p>A szobafalak kezdete a bal felső saroktól, az óramutató járásával egyezően értendő. A falvastagság a rajzi tengely két oldalán fele-fele arányban jelenik meg.</p></section>;
}
