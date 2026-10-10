// Vendégtárolás a böngészőben (könyvjelzők/kedvencek, előzmények, keresések) – fiók és süti nélkül.
// Minden hozzáférés try/catch-ben; sérült JSON → alaphelyzet; kivételt dobó tároló (privát mód) → memóriabeli tartalék és jelzés.
// Csak belső relatív útvonal fogadható el. Kulcsok: shockcraft-kb-* (a components/legal-page.tsx sütitáblázatában felsorolva).

export type StorageLike={getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void};
export const KB_KEYS={bookmarks:'shockcraft-kb-bookmarks-v1',recent:'shockcraft-kb-recent-v1'} as const;

/** Belső, relatív útvonal: /kalkulatorok vagy /tudastar alatt, opcionális lekérdezéssel és horgonnyal. */
export const INTERNAL_PATH=/^\/(?:kalkulatorok|tudastar)(?:\/[a-z0-9-]+)*\/?(?:\?[^#\s<>"']{0,600})?(?:#[a-z0-9-]{1,80})?$/;
export const isInternalPath=(s:unknown):s is string=>typeof s==='string'&&s.length<=800&&INTERNAL_PATH.test(s);

export type EntryType='calc'|'article'|'schema'|'section'|'quiz';
export type KbEntry={type:EntryType;id:string;href:string;title:string;detail?:string;at:number};
const TYPES:readonly EntryType[]=['calc','article','schema','section','quiz'];
/** Kézi validálás (zod nélkül, kliensoldal). */
export function validEntry(x:unknown):KbEntry|null{
 if(!x||typeof x!=='object')return null;
 const o=x as Record<string,unknown>;
 if(!TYPES.includes(o.type as EntryType)||typeof o.id!=='string'||!/^[a-z0-9-]{1,80}(?:#[a-z0-9-]{1,80})?$/.test(o.id)||!isInternalPath(o.href)||typeof o.title!=='string'||!o.title.trim()||o.title.length>160||typeof o.at!=='number'||!Number.isFinite(o.at))return null;
 const e:KbEntry={type:o.type as EntryType,id:o.id,href:o.href,title:o.title.trim(),at:o.at};
 if(typeof o.detail==='string'&&o.detail.trim())e.detail=o.detail.trim().slice(0,160);
 return e;
}
export const validSearch=(x:unknown):string|null=>typeof x==='string'&&x.trim()&&x.length<=80?x.trim():null;

type Payload=Record<string,unknown>&{v:number};
export type Store<T>={
 get():readonly T[];set(items:readonly T[]):void;
 subscribe(fn:()=>void):()=>void;
 /** A `storage` esemény kezelése (másik lap írt); a böngészőben automatikus, tesztben kézzel hívható. */
 handleStorage(key:string|null):void;
 /** Gyorsítótár és memóriabeli tartalék törlése (újraolvasás a tárolóból). */
 reset():void;
 /** Igaz, ha a böngésző nem engedi a mentést (privát mód, tiltott tárhely): ilyenkor csak a lap memóriájában él. */
 blocked():boolean;
 readonly serverSnapshot:readonly T[];
};

const browserStorage=():StorageLike|null=>{try{return typeof window!=='undefined'?window.localStorage:null}catch{return null}};
/** Memóriabeli tartalék kulcsonként (közös az azonos kulcsú tárolók között), ha a böngésző nem enged írni. */
const memoryByKey=new Map<string,Payload>();
const EMPTY:readonly never[]=Object.freeze([]);

/** Egy kulcs egy mezőjére (pl. `items`, `searches`) épülő lista-tároló; a kulcs többi mezőjét írásnál megőrzi. */
export function createStore<T>({key,field='items',version,validate,max,storage=browserStorage,dedupe}:{key:string;field?:string;version:number;validate:(x:unknown)=>T|null;max:number;storage?:()=>StorageLike|null;dedupe?:(a:T,b:T)=>boolean}):Store<T>{
 let cache:readonly T[]|null=null,isBlocked=false,attached=false;
 const listeners=new Set<()=>void>();
 const emit=()=>{for(const fn of [...listeners])fn()};
 function readPayload():Payload{
  const memory=memoryByKey.get(key);if(memory)return memory;
  try{
   const s=storage();const raw=s?.getItem(key);
   if(!raw)return {v:version};
   const data=JSON.parse(raw);
   return data&&typeof data==='object'&&!Array.isArray(data)&&data.v===version?data as Payload:{v:version};
  }catch(e){if(!(e instanceof SyntaxError))isBlocked=true;return {v:version}}
 }
 function clean(list:unknown):T[]{
  const out:T[]=[];
  if(Array.isArray(list))for(const x of list){const v=validate(x);if(v!==null&&!(dedupe&&out.some(o=>dedupe(o,v))))out.push(v);if(out.length>=max)break}
  return out;
 }
 const store:Store<T>={
  serverSnapshot:EMPTY as readonly T[],
  get(){if(cache===null)cache=Object.freeze(clean(readPayload()[field]));return cache},
  set(items){
   const next=Object.freeze(clean(items));
   const payload={...readPayload(),v:version,[field]:next};
   try{const s=storage();if(!s)throw new Error('nincs tároló');s.setItem(key,JSON.stringify(payload));isBlocked=false;memoryByKey.delete(key)}
   catch{isBlocked=true;memoryByKey.set(key,payload)}
   cache=next;emit();
  },
  subscribe(fn){
   listeners.add(fn);
   if(!attached&&typeof window!=='undefined'){attached=true;window.addEventListener('storage',e=>store.handleStorage(e.key))}
   return ()=>{listeners.delete(fn)};
  },
  handleStorage(k){if(k===null||k===key){cache=null;emit()}},
  reset(){memoryByKey.delete(key);cache=null;emit()},
  blocked:()=>isBlocked,
 };
 return store;
}

const sameEntry=(a:KbEntry,b:KbEntry)=>a.type===b.type&&a.id===b.id;
export const bookmarkStore=createStore<KbEntry>({key:KB_KEYS.bookmarks,version:1,validate:validEntry,max:300,dedupe:sameEntry});
export const recentStore=createStore<KbEntry>({key:KB_KEYS.recent,version:1,validate:validEntry,max:30,dedupe:sameEntry});
export const searchStore=createStore<string>({key:KB_KEYS.recent,field:'searches',version:1,validate:validSearch,max:8,dedupe:(a,b)=>a===b});

/** Elem a lista elejére (azonos típus+azonosító esetén csere). */
export const pushFront=<T>(list:readonly T[],item:T,same:(a:T,b:T)=>boolean)=>[item,...list.filter(x=>!same(x,item))];
export const addBookmark=(e:KbEntry)=>bookmarkStore.set(pushFront(bookmarkStore.get(),e,sameEntry));
export const removeBookmark=(type:EntryType,id:string)=>bookmarkStore.set(bookmarkStore.get().filter(x=>!(x.type===type&&x.id===id)));
export const isBookmarked=(list:readonly KbEntry[],type:EntryType,id:string)=>list.some(x=>x.type===type&&x.id===id);
export const addRecent=(e:KbEntry)=>recentStore.set(pushFront(recentStore.get(),e,sameEntry));
export const addSearch=(q:string)=>{const v=validSearch(q);if(v)searchStore.set(pushFront(searchStore.get(),v,(a,b)=>a===b))};
/** „Minden Tudástár-adat törlése”: a könyvjelzők, az előzmények és a keresések. A téma (shockcraft-theme) a tervezővel közös, megmarad. */
export function clearAll(storage:()=>StorageLike|null=browserStorage){
 try{const s=storage();for(const k of Object.values(KB_KEYS))s?.removeItem(k)}catch{}
 for(const s of [bookmarkStore,recentStore,searchStore])s.reset();
}
