"use client";
import {useEffect,useRef,useState} from 'react';
import {Move,X} from 'lucide-react';
import type {Floor} from '@/lib/plan';
import {selectionKey,selectionLabels,type FloorSelection} from '@/lib/floor-selection';
export function GroupSelection({floor,items,onChange,onMove}:{floor:Floor;items:FloorSelection[];onChange:(items:FloorSelection[])=>void;onMove:(dx:number,dy:number)=>void}){
 const [x,setX]=useState('0'),[y,setY]=useState('0');
 const panel=useRef<HTMLElement>(null);
 useEffect(()=>{panel.current?.closest('aside')?.scrollTo({top:0})},[]);
 const valid=x.trim()!==''&&y.trim()!==''&&Number.isFinite(Number(x))&&Number.isFinite(Number(y))&&(Number(x)!==0||Number(y)!==0);
 return <section ref={panel} className="group-selection" aria-label="Csoportos kijelölés">
  <h2><Move size={18}/> {items.length} kijelölt elem</h2>
  <p>Húzd bármelyik kijelölt elemet a csoport mozgatásához. Shift+kattintással hozzáadhatsz vagy kivehetsz elemeket.</p>
  <p>A csoport megtartja a távolságokat és szögeket; a falhoz igazítás ilyenkor szünetel. A szoba tartalma csak akkor mozog, ha azt is kijelölöd.</p>
  <form onSubmit={e=>{e.preventDefault();if(valid){onMove(Number(x)*.4,Number(y)*.4);setX('0');setY('0')}}}>
   <label>Vízszintes eltolás (cm)<input type="number" step="10" value={x} onChange={e=>setX(e.target.value)}/></label>
   <label>Függőleges eltolás (cm)<input type="number" step="10" value={y} onChange={e=>setY(e.target.value)}/></label>
   <small>Pozitív érték: jobbra / lefelé. A rajz szélén a mozgás megáll.</small>
   <button type="submit" disabled={!valid}><Move/> Csoport mozgatása</button>
  </form>
  <div className="group-members">{items.map(item=>{const data=(floor[item.type]||[]).find(v=>v.id===item.id);const name=data&&'name' in data?data.name:selectionLabels[item.type];return <div key={selectionKey(item)}><span>{name}<small>{selectionLabels[item.type]}</small></span><button className="iconbutton" aria-label={name+' kivétele a kijelölésből'} onClick={()=>onChange(items.filter(v=>selectionKey(v)!==selectionKey(item)))}><X/></button></div>})}</div>
  <button onClick={()=>onChange([])}>Kijelölés megszüntetése</button>
  <small>Nyílbillentyűk: 10 cm · Shift+nyíl: 1 m · Esc: kijelölés megszüntetése. A mozgatás egy lépésben visszavonható.</small>
 </section>;
}
