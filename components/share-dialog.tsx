'use client';
import {useState} from 'react';
import {Copy,Link2,Share2,Trash2} from 'lucide-react';
import {toast} from 'sonner';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from './ui/dialog';
import {Choice} from './plan-controls';
import {DEFAULT_SHARE_DAYS,SHARE_DAYS,SHARE_LABEL_MAX} from '@/lib/share';
import {createShare,fetchShares,revokeShare,type SharesResponse} from '@/lib/share-client';

// Tulajdonosi megosztás: csak olvasható, lejáró, visszavonható link a szerverre mentett változathoz.
// A dialógus a plans táblát nem írja, ezért az automatikus mentéshez nem kell hozzányúlni.
type Props={userId:string;projectId:string;saved:boolean;dirty:boolean;busy:boolean};
const when=(value:number)=>new Date(value).toLocaleString('hu-HU');
export function ShareDialog({userId,projectId,saved,dirty,busy}:Props){
 const [open,setOpen]=useState(false),[loading,setLoading]=useState(false),[working,setWorking]=useState(false),[error,setError]=useState(''),[data,setData]=useState<SharesResponse|null>(null);
 const [label,setLabel]=useState(''),[days,setDays]=useState(String(DEFAULT_SHARE_DAYS)),[allowPdf,setAllowPdf]=useState(false),[link,setLink]=useState(''),[confirm,setConfirm]=useState<string|null>(null);
 async function refresh(){setLoading(true);setError('');try{setData(await fetchShares(userId,projectId))}catch(e){setError(e instanceof Error?e.message:'A megosztások most nem tölthetők be.')}finally{setLoading(false)}}
 // A betöltés a megnyitáskor indul (nem effektben); bezáráskor az egyszer látható link is törlődik.
 function toggle(value:boolean){if(working)return;setOpen(value);setLink('');setConfirm(null);setError('');if(value&&saved&&userId)void refresh()}
 async function submit(e:React.FormEvent){e.preventDefault();if(working)return;setWorking(true);setError('');setLink('');setConfirm(null);
  try{const d=await createShare(userId,projectId,{label,days:Number(days),allowPdf});setLink(d.link);setLabel('');setAllowPdf(false);toast.success('A megosztási link elkészült.');await refresh()}
  catch(e){setError(e instanceof Error?e.message:'A link nem hozható létre.')}finally{setWorking(false)}}
 async function revoke(target:string){setWorking(true);setError('');try{await revokeShare(userId,projectId,target==='all'?{all:true}:{id:target});setConfirm(null);toast.success(target==='all'?'Minden link visszavonva.':'A link visszavonva.');await refresh()}catch(e){setError(e instanceof Error?e.message:'A visszavonás nem sikerült.')}finally{setWorking(false)}}
 async function copy(){try{await navigator.clipboard.writeText(link);toast.success('A link a vágólapra került.')}catch{toast.error('A másolás nem sikerült. Jelöld ki a linket, és másold ki kézzel.')}}
 const status=data?.status,shares=data?.shares||[],limit=data?.limit||10,canPdf=!!data?.canPdf;
 const disabled=working||loading||!saved||status!=='active'||shares.length>=limit;
 return <><button className="share-button" disabled={busy||!userId} title={userId?'Csak olvasható link a tervhez':'A megosztáshoz jelentkezz be.'} aria-label="Terv megosztása" onClick={()=>toggle(true)}><Share2/><span>Megosztás</span></button>
 <Dialog open={open} onOpenChange={toggle}><DialogContent className="share-dialog"><DialogHeader><DialogTitle>Terv megosztása</DialogTitle><DialogDescription>Csak olvasható linket készíthetsz a megrendelőnek vagy egy kollégának. Bejelentkezés nélkül megnyitható, lejár, és bármikor visszavonható. A megtekintő a legutóbb mentett változatot látja, árajánlat és háttéralaprajz nélkül.</DialogDescription></DialogHeader>
  {(!saved||status==='missing')&&<p className="warning">Előbb mentsd a projektet. A link mindig a szerverre mentett változatot mutatja.</p>}
  {saved&&dirty&&<p className="warning">Nem mentett módosításaid vannak: a megtekintő csak a mentés után látja őket.</p>}
  {status==='inactive'&&<p className="warning">A projekt archivált vagy lomtárban van, ezért a linkjei szünetelnek. Új link nem készíthető.</p>}
  {status==='locked'&&<p className="warning">A projekt az előfizetéshez tartozik, és az előfizetés lejárt: a linkjei szünetelnek.</p>}
  {error&&<p className="auth-error" role="alert">{error}</p>}
  {saved&&<>
   <form className="share-form" onSubmit={e=>void submit(e)}>
    <label className="field"><span>Kinek szól? (csak te látod)</span><input aria-label="Kinek szól? (csak te látod)" value={label} maxLength={SHARE_LABEL_MAX} placeholder="pl. Kovács úr – megrendelő" disabled={working} onChange={e=>setLabel(e.target.value)}/></label>
    <Choice label="Érvényesség" value={days} onChange={setDays} items={SHARE_DAYS.map(d=>[String(d),d+' nap'] as [string,string])}/>
    <label className="share-check"><input type="checkbox" checked={allowPdf&&canPdf} disabled={!canPdf||working} onChange={e=>setAllowPdf(e.target.checked)}/>A megtekintő PDF-et is letölthet</label>
    <small className="report-note">{canPdf?'A letöltést minden használatkor újra ellenőrizzük.':'Ennél a projektnél a letöltés engedélyezéséhez aktív havi előfizetés kell. Az ingyenes és az egyszer megvásárolt projekt előfizetés nélkül is engedélyezheti.'}</small>
    <button type="submit" className="primary" disabled={disabled}><Link2/>{working?'Folyamatban…':'Link létrehozása'}</button>
   </form>
   {link&&<div className="share-link-once" role="status"><input readOnly aria-label="Megosztási link" value={link} onFocus={e=>e.currentTarget.select()}/><button type="button" onClick={()=>void copy()}><Copy/> Link másolása</button><p>Ezt a linket csak most látod. Aki megkapja, bejelentkezés nélkül megnyithatja a lejáratig. Csak annak küldd el, akinek szól; ha rossz helyre került, vond vissza.</p></div>}
   <h3>Érvényes linkek ({shares.length}/{limit})</h3>
   {loading?<p role="status">Megosztások betöltése…</p>:!shares.length?<p>Ehhez a projekthez még nincs érvényes megosztási link.</p>:<div className="share-list">{shares.map(s=><div key={s.id}><div className="share-entry"><span><b>{s.label||'Címke nélküli link'}</b><small>Létrehozva: {when(s.createdAt)} · Lejár: {when(s.expiresAt)} · {s.allowPdf?'PDF letölthető':'Csak megtekintés'} · {s.lastViewedAt?'Utoljára megnyitva: '+when(s.lastViewedAt):'Még nem nyitották meg'}</small></span>{status!=='active'&&<span className="share-tag">Szünetel</span>}<button type="button" className="danger" disabled={working} aria-label={'Visszavonás: '+(s.label||'címke nélküli link')} onClick={()=>setConfirm(s.id)}><Trash2/> Visszavonás</button></div>
    {confirm===s.id&&<div className="project-state-confirm"><p>Biztosan visszavonod? A link azonnal megszűnik, és nem állítható vissza.</p><div className="project-actions"><button type="button" disabled={working} onClick={()=>setConfirm(null)}>Mégse</button><button type="button" className="danger" disabled={working} onClick={()=>void revoke(s.id)}>Visszavonom</button></div></div>}</div>)}</div>}
   {shares.length>0&&(confirm==='all'?<div className="project-state-confirm"><p>A projekt összes megosztási linkje azonnal megszűnik.</p><div className="project-actions"><button type="button" disabled={working} onClick={()=>setConfirm(null)}>Mégse</button><button type="button" className="danger" disabled={working} onClick={()=>void revoke('all')}>Mindet visszavonom</button></div></div>:<button type="button" disabled={working} onClick={()=>setConfirm('all')}><Trash2/> Összes link visszavonása</button>)}
  </>}
  <p className="report-note">Archiválás és lejárt előfizetés esetén a linkek szünetelnek; visszaállítás után a lejáratig újra működnek. Lomtárba helyezéskor és jelszó-visszaállításkor minden link véglegesen megszűnik.</p>
 </DialogContent></Dialog></>;
}
