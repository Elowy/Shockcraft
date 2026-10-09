'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {toast} from 'sonner';
import {CatalogError,fetchCatalog,saveCatalog} from '@/lib/catalog-client';
import type {Catalog} from '@/lib/catalog';

export type CatalogState={catalog:Catalog|null;revision:number;status:'idle'|'loading'|'ready'|'error';error:string;conflict:boolean;saving:boolean;reload:()=>void;save:(next:Catalog,message:string)=>Promise<boolean>};
type Data=Pick<CatalogState,'catalog'|'revision'|'status'|'error'|'conflict'>&{owner:string};

// Fiókszintű katalógus betöltése és mentése (revision-CAS). A setState csak promise-callbackben és eseménykezelőben fut.
// A katalógus módosítása nem kerül a tervező visszavonási vermébe.
export function useCatalog(userId:string):CatalogState{
 const [data,setData]=useState<Data>(()=>({catalog:null,revision:0,status:userId?'loading':'idle',error:'',conflict:false,owner:userId}));
 const [nonce,setNonce]=useState(0),[saving,setSaving]=useState(false);
 // A legutóbbi revision (és a fiók, amelyhez tartozik): két gyors mentés így nem küld elavult revisiont.
 const rev=useRef({owner:'',revision:0}),busy=useRef(false);
 useEffect(()=>{if(!userId)return;let live=true;fetchCatalog(userId).then(d=>{if(live){rev.current={owner:userId,revision:d.revision};setData({catalog:d.catalog,revision:d.revision,status:'ready',error:'',conflict:false,owner:userId})}},(e:unknown)=>{if(live)setData({catalog:null,revision:0,status:'error',error:e instanceof Error?e.message:'A termékkatalógus most nem tölthető be. Próbáld újra.',conflict:false,owner:userId})});return()=>{live=false}},[userId,nonce]);
 const reload=useCallback(()=>{setData(s=>({...s,status:'loading',error:'',conflict:false}));setNonce(n=>n+1)},[]);
 const save=useCallback(async(next:Catalog,message:string)=>{
  if(busy.current)return false;
  if(rev.current.owner!==userId){toast.error('A termékkatalógus még nem töltődött be. Próbáld újra.');return false}
  busy.current=true;setSaving(true);
  try{const d=await saveCatalog(userId,next,rev.current.revision);rev.current={owner:userId,revision:d.revision};setData({catalog:d.catalog,revision:d.revision,status:'ready',error:'',conflict:false,owner:userId});toast.success(message);return true}
  catch(e){if(e instanceof CatalogError&&e.code==='CATALOG_CONFLICT')setData(s=>({...s,conflict:true}));toast.error(e instanceof Error?e.message:'Nem sikerült menteni a termékkatalógust. Próbáld újra.');return false}
  finally{busy.current=false;setSaving(false)}
 },[userId]);
 // Fiókváltáskor a régi fiók adata nem látszik (és nem menthető) az új betöltéséig.
 const current:Data=data.owner===userId?data:{catalog:null,revision:0,status:userId?'loading':'idle',error:'',conflict:false,owner:userId};
 return {catalog:current.catalog,revision:current.revision,status:current.status,error:current.error,conflict:current.conflict,saving,reload,save};
}
