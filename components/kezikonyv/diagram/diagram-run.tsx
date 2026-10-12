'use client';
// A bekötési ábra nézetváltója és Működés nézete (kliensszigete; csak közzétett ábránál töltődik – docs/tudastar-terv.md 2.4, 3.4).
// A két nézet SVG-jét és a kapcsolóállás-táblázatot a szerver rendereli (components/kezikonyv/diagram/diagram-figure.tsx); a sziget
// csak a nézetet váltja (osztállyal, nem `hidden`-nel: nyomtatáskor és JS nélkül minden nézet látszik), és az állás változásakor a
// Működés SVG-n átírja a kiemelést: a vezetékek, a halo- és csíkozórétegek (data-wire, data-halo, data-stripe) „is-cur” (áramút),
// „is-live” (feszültség alatt) vagy „is-broken” (szakadt) osztályt kapnak, az érintkezők (data-sel/data-state) közül csak az aktuális
// állásé látszik, a működő fogyasztók (data-out) „is-on”-t kapnak. Az állások eredményét a szerver előre kiszámolta (lib/kb/circuit.ts
// szimuláció a jelenetben) – a böngészőbe szimulátor és netlista nem kerül, csak az állásonkénti vezeték-azonosítók és a szöveg.
import {useEffect,useMemo,useRef,useState,type KeyboardEvent,type ReactNode} from 'react';

export type RunSelector={id:string;label:string;scenario:boolean;states:readonly {name:string;label:string;pressed:boolean}[]};
export type RunState={key:string;cur:readonly string[];live:readonly string[];broken:readonly string[];on:readonly string[];text:readonly string[]};
export type RunData={uid:string;selectors:readonly RunSelector[];states:readonly RunState[];initial:Readonly<Record<string,string>>};

const VIEWS=[{id:'bekotes',label:'Bekötés'},{id:'mukodes',label:'Működés'}] as const;
type View=typeof VIEWS[number]['id'];

export function DiagramViews({data,bekotes,mukodes,truth}:{data:RunData;bekotes:ReactNode;mukodes:ReactNode;truth:ReactNode}){
 const [view,setView]=useState<View>('bekotes');
 const [combo,setCombo]=useState<Record<string,string>>({...data.initial});
 const panel=useRef<HTMLDivElement>(null),tabs=useRef<(HTMLButtonElement|null)[]>([]);
 const key=data.selectors.map(s=>combo[s.id]).join('|');
 const state=useMemo(()=>data.states.find(s=>s.key===key),[data.states,key]);
 useEffect(()=>{
  const root=panel.current;if(!root||!state)return;
  const cur=new Set(state.cur),live=new Set(state.live),broken=new Set(state.broken),on=new Set(state.on);
  for(const el of root.querySelectorAll<SVGElement>('[data-wire],[data-halo],[data-stripe]')){
   const id=el.getAttribute('data-wire')??el.getAttribute('data-halo')??el.getAttribute('data-stripe')??'';
   el.classList.toggle('is-cur',cur.has(id));el.classList.toggle('is-broken',!cur.has(id)&&broken.has(id));el.classList.toggle('is-live',!cur.has(id)&&!broken.has(id)&&live.has(id));
  }
  for(const el of root.querySelectorAll<SVGElement>('[data-sel][data-state]'))el.classList.toggle('is-off',combo[el.getAttribute('data-sel')!]!==el.getAttribute('data-state'));
  for(const el of root.querySelectorAll<SVGElement>('[data-out]'))el.classList.toggle('is-on',on.has(el.getAttribute('data-out')!));
  for(const tr of root.querySelectorAll<HTMLTableRowElement>('tr[data-key]')){const c=tr.getAttribute('data-key')===key;tr.classList.toggle('is-current',c);if(c)tr.setAttribute('aria-current','true');else tr.removeAttribute('aria-current')}
 },[state,combo,key]);
 // Nyomtatáskor a csukott <details> (kapcsolóállás- és vezetéktábla) is kinyílik, utána visszacsukódik.
 useEffect(()=>{
  const fig=panel.current?.closest('figure');if(!fig)return;
  let opened:HTMLDetailsElement[]=[];
  const before=()=>{opened=[...fig.querySelectorAll('details')].filter(d=>!d.open);for(const d of opened)d.open=true};
  const after=()=>{for(const d of opened)d.open=false;opened=[]};
  window.addEventListener('beforeprint',before);window.addEventListener('afterprint',after);
  return ()=>{window.removeEventListener('beforeprint',before);window.removeEventListener('afterprint',after)};
 },[]);
 // A rajzkeret csak akkor görgethető régió (Tab-megálló, címke), ha a rajz valóban túlcsordul rajta (keskeny képernyőn); a szerver a
 // tabindex-et és a címkét alapból ráteszi (JS nélkül és nyomtatásban is érvényes), itt vesszük el és adjuk vissza a túlcsordulás szerint.
 useEffect(()=>{
  const fig=panel.current?.closest('figure');if(!fig||typeof ResizeObserver==='undefined')return;
  const frames=[...fig.querySelectorAll<HTMLElement>('.kk-dg-frame')];
  const fit=(el:HTMLElement)=>{
   const over=el.scrollWidth>el.clientWidth+1;
   if(over){el.setAttribute('tabindex','0');el.setAttribute('role','region');const l=el.getAttribute('data-scroll-label');if(l)el.setAttribute('aria-label',l)}
   else{el.removeAttribute('tabindex');el.removeAttribute('role');el.removeAttribute('aria-label')}
  };
  const ro=new ResizeObserver(es=>{for(const e of es)fit(e.target as HTMLElement)});
  for(const el of frames){fit(el);ro.observe(el);const svg=el.firstElementChild;if(svg)ro.observe(svg)}
  return ()=>ro.disconnect();
 },[]);
 const set=(id:string,name:string)=>setCombo(c=>({...c,[id]:name}));
 const onTabKey=(e:KeyboardEvent<HTMLButtonElement>,i:number)=>{
  const n=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:e.key==='Home'?0:e.key==='End'?VIEWS.length-1:null;
  if(n===null)return;e.preventDefault();const j=(n+VIEWS.length)%VIEWS.length;setView(VIEWS[j].id);tabs.current[j]?.focus();
 };
 const groups=[{label:'Kapcsolók és készülékek',items:data.selectors.filter(s=>!s.scenario)},{label:'Hibahelyzetek és érintések',items:data.selectors.filter(s=>s.scenario)}].filter(g=>g.items.length);
 const changed=data.selectors.some(s=>combo[s.id]!==data.initial[s.id]);
 return <>
  <div className="kk-dg-tabs" role="tablist" aria-label="Az ábra nézete">
   {VIEWS.map((v,i)=><button key={v.id} type="button" role="tab" id={data.uid+'-tab-'+v.id} aria-selected={view===v.id} aria-controls={data.uid+'-p-'+v.id}
    tabIndex={view===v.id?0:-1} ref={el=>{tabs.current[i]=el}} onClick={()=>setView(v.id)} onKeyDown={e=>onTabKey(e,i)}>{v.label}</button>)}
  </div>
  <div role="tabpanel" id={data.uid+'-p-bekotes'} aria-labelledby={data.uid+'-tab-bekotes'} className={'kk-dg-view'+(view==='bekotes'?'':' kk-dg-view-hidden')} data-view="bekotes">
   <p className="kk-dg-view-title">Bekötés</p>
   {bekotes}
  </div>
  <div role="tabpanel" id={data.uid+'-p-mukodes'} aria-labelledby={data.uid+'-tab-mukodes'} className={'kk-dg-view'+(view==='mukodes'?'':' kk-dg-view-hidden')} data-view="mukodes" ref={panel}>
   <p className="kk-dg-view-title">Működés</p>
   <div className="kk-dg-run">
    {groups.map(g=><fieldset key={g.label} className="kk-dg-switches"><legend>{g.label}</legend>
     {g.items.map(s=>{
      const st=s.states.find(x=>x.name===combo[s.id])??s.states[0];
      if(s.states.length<2)return <p key={s.id} className="kk-dg-fixed">{s.label}: <b>{st.label}</b></p>;
      const next=s.states[(s.states.indexOf(st)+1)%s.states.length];
      return s.states.length===2
       // A kétállású gomb neve állandó (a felirat), az állást az aria-pressed hordozza; a látható állásszöveg a képernyőolvasónak rejtett.
       ?<button key={s.id} type="button" aria-pressed={st.pressed} onClick={()=>set(s.id,next.name)}>{s.label}<small aria-hidden="true">{st.label}</small></button>
       :<button key={s.id} type="button" onClick={()=>set(s.id,next.name)}>{s.label}<small>{st.label}</small></button>;
     })}
    </fieldset>)}
    <p className="kk-dg-reset"><button type="button" disabled={!changed} onClick={()=>setCombo({...data.initial})}>Alapállás</button></p>
    <div className="kk-dg-status" aria-live="polite" aria-atomic="true">
     <p className="kk-dg-status-title">Állapot:</p>
     <ul>{(state?.text??[]).map((t,i)=><li key={i}>{t}</li>)}</ul>
    </div>
   </div>
   {mukodes}
   {truth}
  </div>
 </>;
}
