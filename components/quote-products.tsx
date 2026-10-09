"use client";
import {useMemo,useState} from 'react';
import {PackageCheck,RefreshCw} from 'lucide-react';
import {toast} from 'sonner';
import type {CatalogState} from './use-catalog';
import type {PickTarget} from './product-picker';
import type {Plan} from '@/lib/plan';
import type {Quote} from '@/lib/quote-schema';
import {amount,money} from '@/lib/quote';
import {accountDefault,productLabel} from '@/lib/catalog';
import {applyAccountDefaults,availableAccountDefaults,productSlots,projectProduct,refreshProductPrices,sampleInUse,setProjectProduct,untypedCableMeters} from '@/lib/quote-products';

type Props={plan:Plan;quote:Quote;userId:string;catalog:CatalogState;onChange:(q:Quote)=>void;onPick:(t:PickTarget)=>void};
const priceText=(n:number|null|undefined)=>n===undefined?'–':n===null?'nincs ár':money(n);

// Az ajánlat „Termékek és katalógusárak” része: típusonkénti projektválasztás, fiók-alapértelmezések, árfrissítés.
// Minden módosítás az ajánlatszerkesztő update() útján megy, így a tervező Visszavonás gombjával visszavonható.
export function QuoteProducts({plan,quote:q,userId,catalog,onChange,onPick}:Props){
 const slots=useMemo(()=>productSlots(plan),[plan]),untyped=useMemo(()=>untypedCableMeters(plan),[plan]);
 const [open,setOpen]=useState(()=>slots.length>0&&slots.some(s=>!projectProduct(q,s.ref))),[confirm,setConfirm]=useState(false);
 const ready=!!userId&&catalog.status==='ready'&&!!catalog.catalog,c=ready?catalog.catalog:null;
 const available=useMemo(()=>c?availableAccountDefaults(plan,q,c):0,[plan,q,c]),chosen=slots.filter(s=>projectProduct(q,s.ref)).length,samples=sampleInUse(q);
 const bound=q.lines.some(l=>l.product)||!!q.productDefaults?.length;
 function run(action:()=>void,fallback:string){try{action()}catch(e){toast.error(e instanceof Error?e.message:fallback)}}
 function apply(){if(c)run(()=>{const r=applyAccountDefaults(plan,q,c);onChange(r.quote);toast.success(`Fiók-alapértelmezések alkalmazva: ${r.applied} típus, ${r.lines} tétel ára frissült.`)},'A fiók-alapértelmezések nem alkalmazhatók.')}
 function refresh(){if(c)run(()=>{const r=refreshProductPrices(q,c);onChange(r.quote);setConfirm(false);toast.success(`${r.updated} tétel ára frissült.`+(r.missing>0?` ${r.missing} termék nem található a katalógusban, ezek ára nem változott.`:''))},'Az árak nem frissíthetők.')}
 function clear(ref:string){run(()=>{onChange(setProjectProduct(plan,q,ref,null).quote);toast.success('A választás törölve; a tételek ára megmaradt.')},'A választás nem törölhető.')}
 return <details className="quote-products" open={open} onToggle={e=>setOpen(e.currentTarget.open)}>
  <summary>Termékek és katalógusárak – {chosen} / {slots.length} típushoz választva</summary>
  <p className="report-note">Típusonként egyszer válassz terméket: az ilyen tételek minden szinten és magasságon megkapják a termék nettó anyagárát és – ha megadtad – a munkadíj-javaslatát. A termékadat pillanatképként a projektbe kerül; a katalógus későbbi változása csak az „Árak frissítése a katalógusból” gombbal kerül át. Egy-egy tétel termékét a lenti táblában egyedileg is módosíthatod.</p>
  {!userId&&<p className="warning-banner">A termékkatalógus fiókhoz kötött; a tervben már szereplő termékválasztások megmaradnak.</p>}
  {userId&&catalog.status==='loading'&&<p role="status">Katalógus betöltése…</p>}
  {userId&&catalog.status==='error'&&<p className="auth-error" role="alert">{catalog.error} <button type="button" onClick={catalog.reload}>Újrapróbálás</button></p>}
  <div className="quote-product-actions">
   <button type="button" disabled={!ready||available===0} onClick={apply}><PackageCheck/> Fiók-alapértelmezések alkalmazása ({available})</button>
   <button type="button" disabled={!ready||!bound} onClick={()=>setConfirm(true)}><RefreshCw/> Árak frissítése a katalógusból</button>
  </div>
  {confirm&&<div className="project-state-confirm"><p>Frissíted a termékhez kötött tételek anyagárát a katalógus aktuális áraira? A kézzel módosított anyagár is felülíródik; a munkadíj csak ott töltődik ki, ahol üres. A tervező Visszavonás gombjával visszavonható.</p><div className="project-actions"><button type="button" onClick={()=>setConfirm(false)}>Mégse</button><button type="button" className="primary" disabled={!ready} onClick={refresh}>Frissítés</button></div></div>}
  {samples>0&&<p className="warning-banner">{samples} helyen mintatermék van kiválasztva. Add meg a valós terméket és árát a Termékkatalógus fülön, majd frissítsd az árakat.</p>}
  {untyped>0&&<p className="warning-banner">{amount(untyped)} m kábelnél nincs kábeljelölés, ezekhez típusonként nem választható termék. Add meg a nyomvonalak „Kábel jelölése” mezőjét, vagy válassz terméket a tételsorban.</p>}
  {!slots.length?<p className="warning-banner">A tervben még nincs termékhez köthető szerelvény, elosztókészülék vagy kábel.</p>:
  <div className="quote-product-table"><table><thead><tr><th>Típus</th><th>Mennyiség</th><th>Termék</th><th>Anyagár</th><th>Munkadíj</th><th><span className="sr-only">Műveletek</span></th></tr></thead><tbody>{slots.map(s=>{const p=projectProduct(q,s.ref),own=!p&&c?accountDefault(c,s.ref):undefined;return <tr key={s.ref}>
   <td><b>{s.label}</b><small>{s.category}</small></td>
   <td>{amount(s.quantity)} {s.unit}</td>
   <td>{p?<>{productLabel(p)}{p.sample&&<span className="catalog-badge">Minta</span>}</>:'Nincs kiválasztva'}{own&&own.unit===s.unit&&<small>Fiókodban: {productLabel(own)}</small>}</td>
   <td>{priceText(p?.price)}</td><td>{priceText(p?.labor)}</td>
   <td><div className="quote-product-buttons"><button type="button" disabled={!ready} onClick={()=>onPick({kind:'slot',ref:s.ref,label:s.label,unit:s.unit})}>{p?'Csere…':'Választás…'}</button>{p&&<button type="button" disabled={!userId} onClick={()=>clear(s.ref)}>Eltávolítás</button>}</div></td>
  </tr>})}</tbody></table></div>}
 </details>;
}
