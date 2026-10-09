import {validateCatalog,CATALOG_BYTES,type Catalog} from './catalog';
export class CatalogError extends Error{status:number;code?:string;constructor(message:string,status:number,code?:string){super(message);this.status=status;this.code=code}}
export type CatalogResponse={catalog:Catalog;revision:number;userId:string};
async function call(init:RequestInit,userId:string):Promise<CatalogResponse>{
 let r:Response;try{r=await fetch('/api/catalog',{cache:'no-store',signal:AbortSignal.timeout(15000),...init})}catch{throw new CatalogError('A szerver nem érhető el. Ellenőrizd az internetkapcsolatot, és próbáld újra.',0)}
 const d=await r.json().catch(()=>({})) as Partial<CatalogResponse>&{error?:string;code?:string};
 if(!r.ok)throw new CatalogError(d.error||'A művelet nem sikerült.',r.status,d.code);
 if(d.userId!==userId)throw new CatalogError('A bejelentkezett fiók megváltozott. Frissítsd az oldalt.',409,'ACCOUNT_CHANGED');
 return {revision:d.revision||0,userId:d.userId,catalog:validateCatalog(d.catalog)};
}
export const fetchCatalog=(userId:string)=>call({},userId);
export function saveCatalog(userId:string,catalog:Catalog,revision:number){
 const body=JSON.stringify({catalog,revision,userId});
 if(new TextEncoder().encode(body).byteLength>CATALOG_BYTES)return Promise.reject(new CatalogError('A termékkatalógus legfeljebb 1,5 MB lehet. Archiváld vagy töröld a nem használt termékeket.',413,'TOO_LARGE'));
 return call({method:'PUT',headers:{'Content-Type':'application/json'},body},userId);
}
