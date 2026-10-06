'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {History} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from './ui/dialog';
import {backupKey,listBackups,writeBackup,clearSavedBackups,discardBackup,type DraftBackup} from '@/lib/draft-backup';
import {type Plan,validatePlan} from '@/lib/plan';

export function useDraftBackup({plan,owner,projectId,revision,saved,ready}:{plan:Plan;owner:string;projectId:string;revision:number;saved:string;ready:boolean}){
 const writer=useRef(''),latest=useRef({plan,owner,projectId,revision,saved,ready});
 latest.current={plan,owner,projectId,revision,saved,ready};
 const [message,setMessage]=useState(''),[available,setAvailable]=useState(0);
 function refresh(){const state=latest.current;try{setAvailable(listBackups(localStorage,state.owner).filter(b=>b.writer!==writer.current||b.projectId!==state.projectId).length)}catch{setMessage('A böngésző helyreállítási tárhelye nem olvasható.')}}
 function flush(){const state=latest.current;if(!state.ready||!state.owner)return false;
  try{const safe=validatePlan(state.plan),text=JSON.stringify(safe);if(text===state.saved){if(writer.current)localStorage.removeItem(backupKey(state.owner,state.projectId,writer.current));clearSavedBackups(localStorage,state.owner,state.projectId,state.saved);setMessage('');refresh();return true}
   if(!writer.current)writer.current=crypto.randomUUID();
   writeBackup(localStorage,{version:1,owner:state.owner,projectId:state.projectId,writer:writer.current,revision:state.revision,updatedAt:new Date().toISOString(),plan:safe});setMessage('Helyreállítási másolat ebben a böngészőben.');return true;
  }catch{setMessage('A helyi másolat nem frissült. Ellenőrizd a terv adatait és a böngésző tárhelyét.');return false;}
 }
 useEffect(()=>{refresh()},[owner,projectId,ready]);
 useEffect(()=>{if(!ready)return;const timer=setTimeout(flush,600);return()=>clearTimeout(timer)},[plan,owner,projectId,revision,saved,ready]);
 useEffect(()=>{const hide=()=>flush(),visibility=()=>{if(document.visibilityState==='hidden')flush()};window.addEventListener('pagehide',hide);window.addEventListener('beforeunload',hide);document.addEventListener('visibilitychange',visibility);return()=>{window.removeEventListener('pagehide',hide);window.removeEventListener('beforeunload',hide);document.removeEventListener('visibilitychange',visibility)}},[]);
 return {message,available,flush,refresh};
}

export function SaveProtection({historyAction,owner,enabled,onEnabled,saving,status,backupMessage,available,busy,onRestore,onOpenChange}:{historyAction?:ReactNode;owner:string;enabled:boolean;onEnabled:(v:boolean)=>void;saving:boolean;status:string;backupMessage:string;available:number;busy:boolean;onRestore:(b:DraftBackup)=>Promise<boolean>;onOpenChange:(open:boolean)=>void}){
 const [open,setOpen]=useState(false),[rows,setRows]=useState<DraftBackup[]>([]),[error,setError]=useState(''),[restoring,setRestoring]=useState(false),[discard,setDiscard]=useState<DraftBackup|null>(null);
 function toggle(value:boolean){if(restoring)return;setOpen(value);onOpenChange(value);if(value){setDiscard(null);setError('');try{setRows(listBackups(localStorage,owner))}catch{setError('A helyreállítási másolatok nem olvashatók.')}}}
 async function restore(row:DraftBackup){setRestoring(true);try{if(await onRestore(row)){setOpen(false);onOpenChange(false)}}catch(e){setError(e instanceof Error?e.message:'Nem sikerült helyreállítani.')}finally{setRestoring(false)}}
 return <><div className="save-protection"><label><input type="checkbox" checked={enabled} onChange={e=>onEnabled(e.target.checked)}/> Automatikus mentés</label><span role="status">{saving?'Automatikus mentés folyamatban…':status}</span>{historyAction}<button disabled={busy} onClick={()=>toggle(true)}><History/> Helyreállítás{available>0?` (${available})`:''}</button>{backupMessage&&<small>{backupMessage}</small>}</div>
 <Dialog open={open} onOpenChange={toggle}><DialogContent className="recovery-dialog"><DialogHeader><DialogTitle>Munka helyreállítása</DialogTitle><DialogDescription>Ezen a böngészőn megőrzött tervmásolatok, a saját fiókodhoz. Ha közben újabb szervermentés készült, külön új projektként állítjuk vissza a másolatot. Annak első mentésére a szokásos projekthely-szabályok vonatkoznak.</DialogDescription></DialogHeader>
 <p className="report-note">A helyreállítás lecseréli a nyitott tervet. Annak mentetlen változata előtte helyi másolatként megmarad. Az elérhetőséget helyreállítás előtt ellenőrizzük; zárolt projektet itt sem lehet megnyitni.</p>
 {error&&<p className="auth-error" role="alert">{error}</p>}
 <div className="recovery-list">{rows.map(b=><div key={b.projectId+b.writer}><button disabled={restoring||busy||!!discard} onClick={()=>void restore(b)}><span><b>{b.plan.name}</b><small>{new Date(b.updatedAt).toLocaleString('hu-HU')} · {b.revision?'Mentett projekt munkapéldánya':'Még el nem mentett projekt'}</small></span><span>Helyreállítás</span></button><button className="recovery-discard" disabled={restoring||busy||!!discard} onClick={()=>setDiscard(b)}>Helyi másolat elvetése</button></div>)}</div>{!rows.length&&!error&&<p>Nincs helyreállításra váró terv ebben a böngészőben.</p>}
 {discard&&<div className="recovery-confirm"><p>Biztosan elveted a(z) „{discard.plan.name}” helyi másolatát? Ez nem vonható vissza. A szerverre mentett projekt megmarad.</p><button onClick={()=>setDiscard(null)}>Mégse</button><button onClick={()=>{try{discardBackup(localStorage,discard);setRows(listBackups(localStorage,owner));setError('')}catch(e){setError(e instanceof Error?e.message:'A másolat nem törölhető.')}setDiscard(null)}}>Másolat végleges elvetése</button></div>}
 <p className="report-note">A böngészőadatok törlése ezeket a másolatokat is törli. A háttéralaprajzokhoz az eredeti háttérfájloknak is elérhetőnek kell maradniuk.</p>
 </DialogContent></Dialog></>;
}
