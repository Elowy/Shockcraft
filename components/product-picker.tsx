"use client";
import {useMemo,useState} from 'react';
import {Ban,Link2,RotateCcw} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from './ui/dialog';
import type {CatalogState} from './use-catalog';
import {accountDefault,searchProducts,type Product} from '@/lib/catalog';
import {money} from '@/lib/quote';

export type PickTarget={kind:'slot';ref:string;label:string;unit:'db'|'m'}|{kind:'line';lineId:string;label:string;unit:'db'|'m';fromPlan:boolean;pinned:boolean;ref?:string};
export type PickChoice={type:'product';product:Product;remember:boolean}|{type:'none'}|{type:'follow'};
type Props={target:PickTarget|null;catalog:CatalogState;onChoose:(t:PickTarget,c:PickChoice)=>void;onClose:()=>void};
const SHOWN=100;

// Egymásba ágyazott dialógus az ajánlatszerkesztőben: típushoz (slot) vagy egy tételsorhoz választ terméket.
export function ProductPicker({target,catalog,onChoose,onClose}:Props){
 return <Dialog open={!!target} onOpenChange={o=>{if(!o)onClose()}}>{target&&<DialogContent className="product-picker-dialog"><PickerBody key={target.kind==='slot'?'slot:'+target.ref:'line:'+target.lineId} target={target} catalog={catalog} onChoose={onChoose}/></DialogContent>}</Dialog>;
}

function PickerBody({target,catalog,onChoose}:{target:PickTarget;catalog:CatalogState;onChoose:(t:PickTarget,c:PickChoice)=>void}){
 const c=catalog.catalog,ref=target.ref;
 const [query,setQuery]=useState(''),[remember,setRemember]=useState(()=>!!ref&&!c?.defaults.some(d=>d.ref===ref));
 const preferred=c&&ref?accountDefault(c,ref):undefined,fallback=preferred?.unit===target.unit?preferred:undefined;
 const list=useMemo(()=>{if(!c)return [];const found=searchProducts(c.products,query,{unit:target.unit});return fallback&&found.some(p=>p.id===fallback.id)?[fallback,...found.filter(p=>p.id!==fallback.id)]:found},[c,query,target.unit,fallback]);
 const usable=!!c&&c.products.some(p=>!p.archived&&p.unit===target.unit);
 const choose=(choice:PickChoice)=>onChoose(target,choice);
 return <>
  <DialogHeader><DialogTitle>Termék választása</DialogTitle><DialogDescription>{target.label} · csak „{target.unit}” egységű termékek</DialogDescription></DialogHeader>
  {catalog.status==='loading'||catalog.status==='idle'?<p role="status">Katalógus betöltése…</p>:catalog.status==='error'||!c?<div><p className="auth-error" role="alert">{catalog.error||'A termékkatalógus most nem tölthető be.'}</p><button type="button" onClick={catalog.reload}><RotateCcw/> Újrapróbálás</button></div>:<>
   <label className="field"><span>Keresés a katalógusban</span><input autoFocus aria-label="Keresés a katalógusban" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Gyártó, család, cikkszám vagy megnevezés"/></label>
   {target.kind==='slot'&&<label className="copy-option"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>Új projektekben is ezt ajánld (fiók-alapértelmezés)</label>}
   {!usable?<p className="report-note">Nincs ilyen egységű termék a katalógusban. Vegyél fel egyet, vagy importálj CSV-t az Eszközök → Termékkatalógus fülön.</p>:<div className="product-picker-list">
    {list.slice(0,SHOWN).map(p=><button type="button" key={p.id} disabled={catalog.saving} onClick={()=>choose({type:'product',product:p,remember})}><span><b>{p.name}</b><small>{[[p.manufacturer,p.family].filter(Boolean).join(' '),p.sku,(p.price===null?'nincs ár':money(p.price))+' / '+p.unit+(p.labor!==null?' · munkadíj '+money(p.labor):'')].filter(Boolean).join(' · ')}</small></span><span className="product-picker-badges">{p.id===fallback?.id&&<span className="catalog-badge">Fiók-alapértelmezés</span>}{p.sample&&<span className="catalog-badge">Minta</span>}</span></button>)}
    {!list.length&&<p className="report-note">Nincs találat. Próbálj rövidebb keresést.</p>}
    {list.length>SHOWN&&<p className="report-note">Az első 100 találat látható. Pontosítsd a keresést.</p>}
   </div>}
  </>}
  {target.kind==='line'&&<div className="project-actions"><button type="button" onClick={()=>choose({type:'none'})}><Ban/> Nincs termék ehhez a tételhez</button>{target.fromPlan&&target.pinned&&<button type="button" onClick={()=>choose({type:'follow'})}><Link2/> Projekt-alapértelmezés követése</button>}</div>}
 </>;
}
