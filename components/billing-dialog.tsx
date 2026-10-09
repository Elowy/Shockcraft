"use client";
import {BillingProfileForm} from './billing-profile';
import {useEffect,useRef,useState} from 'react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from './ui/dialog';
export type BillingStatus={price:number;monthlyPrice:number;available:number;free:number;paid:number;mode:'test'|'live';ready:boolean;admin:boolean;subscription:{active:boolean;paidUntil:number;cancelAtPeriodEnd:boolean;status:string;manageable:boolean;ongoing:boolean}};
export function BillingDialog({open,onOpenChange,account,prepare,leave}:{open:boolean;onOpenChange:(v:boolean)=>void;account:boolean;prepare:()=>boolean;leave:(url:string)=>void}){
 const [status,setStatus]=useState<BillingStatus|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');const attempts=useRef<{project?:string;subscription?:string}>({});
 async function refresh(sync=false){if(!account)return;setBusy(true);setError('');try{
  const params=new URLSearchParams(location.search),session=params.get('session_id'),payment=params.get('payment');const confirm=payment==='success'&&session;
  const r=confirm||sync||payment==='manage'?await fetch('/api/billing',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(confirm?{action:'confirm',sessionId:session}:{action:'refresh'})}):await fetch('/api/billing',{cache:'no-store'});
  const d=await r.json() as BillingStatus & {error?:string;confirmed?:boolean};if(!r.ok)throw Error(d.error);setStatus(d);
  if(confirm){setMessage(d.confirmed?'A fizetést visszaigazoltuk. A jogosultságod használható.':'A fizetés visszaigazolására várunk. Frissítsd az állapotot később.');if(d.confirmed){params.delete('payment');params.delete('session_id');history.replaceState(null,'',location.pathname+(params.size?'?'+params:''))}}
  else if(payment==='cancelled')setMessage('A fizetési oldalt bezártad. A terved megmaradt.');
 }catch(e){setError(e instanceof Error?e.message:'A fizetési adatok nem tölthetők be.')}finally{setBusy(false)}}
 useEffect(()=>{if(open)void refresh()},[open,account]);
 async function pay(kind:'project'|'subscription'|'portal'){if(busy||kind!=='portal'&&!status?.ready)return;setBusy(true);setError('');try{
  if(kind!=='portal')attempts.current[kind]??=crypto.randomUUID();
  const r=await fetch('/api/billing',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(kind==='portal'?{action:'portal'}:{action:'checkout',kind,requestId:attempts.current[kind]})});
  const d=await r.json() as {error?:string;url:string};if(!r.ok){if(kind!=='portal'&&(d.error?.includes('lejárt')||d.error?.includes('már jóváírtuk')))delete attempts.current[kind];throw Error(d.error)}
  if(!prepare()){setBusy(false);return}leave(d.url);
 }catch(e){setError(e instanceof Error?e.message:'A fizetés nem indítható.');setBusy(false)}}
 const sub=status?.subscription;
 return <Dialog open={open} onOpenChange={v=>{if(!busy)onOpenChange(v)}}><DialogContent className="billing-dialog"><DialogHeader><DialogTitle>Projektek és előfizetés</DialogTitle><DialogDescription>Az első projekt fiókonként ingyenes, és előfizetés nélkül is exportálható. A tervimporthoz aktív havi előfizetés szükséges.</DialogDescription></DialogHeader>{!account?<p>Jelentkezz be vagy regisztrálj a vásárláshoz. A nyitott terved megmarad. Zárd be ezt az ablakot, majd válaszd a Belépés gombot.</p>:<>
 {sub?.active&&<div className="billing-notice" role="status"><strong>Korlátlan projektek · aktív előfizetés</strong><p>{sub.cancelAtPeriodEnd?'Az előfizetés nem újul meg. Hozzáférés eddig: ':'Kifizetett hozzáférés eddig: '}{new Date(sub.paidUntil).toLocaleString('hu-HU')}</p></div>}
 {sub&&!sub.active&&sub.status!=='none'&&<p className="billing-notice">Jelenleg nincs aktív előfizetéses hozzáférésed. Az első és az egyszeri díjjal megvásárolt projektek továbbra is használhatók. A többi projekted megmaradt; az előfizetés rendezése után újra megnyithatók.</p>}
 <BillingProfileForm/><div className="billing-options"><section className="billing-price"><h3>Korlátlan projektek</h3><strong>2 490 Ft <small>/ hó</small></strong><p>Automatikusan megújuló havi előfizetés. Korlátlan új projekt, tervimport és minden export: JSON, SVG, CSV, PDF / nyomtatás.</p><button className="primary" disabled={busy||!status?.ready||sub?.ongoing} onClick={()=>void pay('subscription')}>{sub?.active?'Aktív előfizetés':sub?.ongoing?'Előfizetés rendezése szükséges':'Előfizetek – 2 490 Ft/hó'}</button></section>
 <section className="billing-price"><h3>Egy további projekt</h3><strong>3 490 Ft</strong><p>Egyszeri díj. A megvásárolt projekt az előfizetés lejárta után is szerkeszthető és menthető. Exportálható (JSON, SVG, CSV, PDF); importálást nem tartalmaz.</p><button disabled={busy||!status?.ready} onClick={()=>void pay('project')}>Projekthely vásárlása</button></section></div>
 <p className="auth-note">Lemondás után a már kifizetett időszak végéig használhatod az előfizetést. Ezután az előfizetésből létrehozott további projektek megnyitása és mentése zárolódik, az adataik megmaradnak. Az első és az egyszeri díjjal megvásárolt projektjeid elérhetők maradnak.</p>
 {status&&<p>Felhasználható egyszeri projekthelyek: <b>{status.free} ingyenes, {status.paid} vásárolt</b>. Aktív előfizetés mellett a vásárolt helyeket megőrizzük.</p>}
 {status?.mode==='test'&&<p className="billing-notice">Adminisztrátori tesztüzem: valódi terhelés nélkül, külön tesztjogosultságokkal.</p>}{status&&!status.ready&&<p>Új vásárlás még nem indítható. A fizetést az üzemeltető tudja bekapcsolni.</p>}
 {message&&<p role="status">{message}</p>}{error&&<p className="auth-error" role="alert">{error}</p>}<div className="project-actions">{sub?.manageable&&<button disabled={busy} onClick={()=>void pay('portal')}>Előfizetés kezelése / lemondás</button>}<button disabled={busy} onClick={()=>void refresh(true)}>{busy?'Folyamatban…':'Állapot frissítése'}</button></div>
 <p className="auth-note"><a href="/aszf" target="_blank" rel="noopener noreferrer">ÁSZF</a> · <a href="/adatvedelem" target="_blank" rel="noopener noreferrer">Adatvédelmi tájékoztató</a></p><p className="auth-note">A fizetés és a bankkártya kezelése a Stripe biztonságos oldalán történik.</p></>}</DialogContent></Dialog>;
}
