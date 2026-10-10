// Vendégtárolás (kedvencek, előzmények, keresések): korlátok, duplikátumszűrés, sérült JSON, kivételt dobó tároló,
// csak belső útvonal, közös kulcs két mezővel, `storage` esemény. Futtatás: node_modules/.bin/tsx tests/kb-storage.ts
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {INTERNAL_PATH,KB_KEYS,createStore,isInternalPath,prefStore,pushFront,setSlashShortcut,slashShortcutOn,validEntry,validSearch,type KbEntry,type StorageLike} from '../lib/kb/storage';

class Fake implements StorageLike{m=new Map<string,string>();getItem(k:string){return this.m.get(k)??null}setItem(k:string,v:string){this.m.set(k,v)}removeItem(k:string){this.m.delete(k)}}
class Throwing implements StorageLike{getItem():string|null{throw new DOMException('denied','SecurityError')}setItem(){throw new DOMException('quota','QuotaExceededError')}removeItem(){throw new DOMException('denied','SecurityError')}}
const e=(id:string,at=1,href='/kalkulatorok/'+id):KbEntry=>({type:'calc',id,href,title:'Cím '+id,at});
const same=(a:KbEntry,b:KbEntry)=>a.type===b.type&&a.id===b.id;

// Kulcsok: mind shockcraft-kb- előtagú.
assert.ok(Object.values(KB_KEYS).every(k=>k.startsWith('shockcraft-kb-')));
// Csak belső útvonal.
for(const ok of ['/kalkulatorok','/kalkulatorok/ohm-torveny','/kalkulatorok/feszultseges?I=16&L=23,4&A=2,5','/tudastar/semak/valto#gyakori-hibak'])assert.ok(isInternalPath(ok),ok);
for(const bad of ['https://evil.test/kalkulatorok','//evil.test','/kalkulatorok/../admin','javascript:alert(1)','/admin','/kalkulatorok/<script>','/kalkulatorok/x"y'])assert.ok(!isInternalPath(bad),bad);
assert.ok(INTERNAL_PATH.test('/kalkulatorok/'));
assert.equal(validEntry({...e('ohm'),href:'https://evil.test'}),null);
assert.equal(validEntry({...e('ohm'),title:''}),null);
assert.equal(validEntry({...e('ohm'),type:'x'}),null);
assert.equal(validEntry({...e('ohm'),at:NaN}),null);
assert.deepEqual(validEntry({...e('ohm'),detail:'  16 A  ',extra:1}),{...e('ohm'),detail:'16 A'});
assert.equal(validSearch(''),null);assert.equal(validSearch('x'.repeat(81)),null);assert.equal(validSearch(' fi relé '),'fi relé');

// Korlát és duplikátumszűrés; a módosítás eljut a feliratkozóhoz.
const fake=new Fake();
const store=createStore<KbEntry>({key:KB_KEYS.recent,version:1,validate:validEntry,max:30,storage:()=>fake,dedupe:same});
let calls=0;const off=store.subscribe(()=>calls++);
assert.deepEqual(store.get(),[]);assert.equal(store.serverSnapshot.length,0);
for(let i=0;i<40;i++)store.set(pushFront(store.get(),e('c'+i,i),same));
assert.equal(store.get().length,30);assert.equal(store.get()[0].id,'c39');assert.equal(calls,40);
store.set(pushFront(store.get(),e('c20',99),same));
assert.equal(store.get()[0].id,'c20');assert.equal(store.get().filter(x=>x.id==='c20').length,1,'nincs duplikátum');
assert.equal(store.get(),store.get(),'stabil pillanatkép (useSyncExternalStore)');
off();
// Közös kulcs, másik mező: a keresések írása megőrzi az előzményeket és fordítva.
const searches=createStore<string>({key:KB_KEYS.recent,field:'searches',version:1,validate:validSearch,max:8,storage:()=>fake,dedupe:(a,b)=>a===b});
for(let i=0;i<12;i++)searches.set(pushFront(searches.get(),'q'+i,(a,b)=>a===b));
assert.equal(searches.get().length,8);
const raw=JSON.parse(fake.getItem(KB_KEYS.recent)!);assert.equal(raw.v,1);assert.equal(raw.items.length,30);assert.equal(raw.searches.length,8);
// Másik lap írt (storage esemény) → újraolvasás.
fake.setItem(KB_KEYS.recent,JSON.stringify({v:1,items:[e('masik')],searches:[]}));
assert.equal(store.get()[0].id,'c20','gyorsítótár az esemény előtt');
let notified=0;store.subscribe(()=>notified++);store.handleStorage(KB_KEYS.recent);
assert.equal(notified,1);assert.deepEqual(store.get().map(x=>x.id),['masik']);
store.handleStorage('mas-kulcs');assert.equal(notified,1,'más kulcs nem érinti');
// Sérült JSON, ismeretlen verzió, hamis elemek → alaphelyzet / szűrés.
const f2=new Fake();const s2=()=>createStore<KbEntry>({key:KB_KEYS.bookmarks,version:1,validate:validEntry,max:300,storage:()=>f2,dedupe:same});
f2.setItem(KB_KEYS.bookmarks,'{nem json');assert.deepEqual(s2().get(),[]);assert.equal(s2().blocked(),false);
f2.setItem(KB_KEYS.bookmarks,JSON.stringify({v:99,items:[e('a')]}));assert.deepEqual(s2().get(),[]);
f2.setItem(KB_KEYS.bookmarks,JSON.stringify([e('a')]));assert.deepEqual(s2().get(),[]);
f2.setItem(KB_KEYS.bookmarks,JSON.stringify({v:1,items:[e('a'),{...e('b'),href:'https://x.test/'},e('a'),null,42,e('c')]}));
assert.deepEqual(s2().get().map(x=>x.id),['a','c']);
// Kivételt dobó tároló (privát mód): nem dob, memóriában él tovább, és jelzi.
const t=createStore<KbEntry>({key:KB_KEYS.bookmarks,version:1,validate:validEntry,max:300,storage:()=>new Throwing(),dedupe:same});
assert.doesNotThrow(()=>t.get());assert.deepEqual(t.get(),[]);
assert.doesNotThrow(()=>t.set([e('x')]));assert.equal(t.blocked(),true);assert.deepEqual(t.get().map(x=>x.id),['x']);
t.set(pushFront(t.get(),e('y'),same));assert.deepEqual(t.get().map(x=>x.id),['y','x']);
// Tároló nélkül (SSR): üres, nem dob.
const none=createStore<KbEntry>({key:'shockcraft-kb-test-ssr',version:1,validate:validEntry,max:300,storage:()=>null});
assert.deepEqual(none.get(),[]);assert.doesNotThrow(()=>none.set([e('z')]));
// A „/” gyorsbillentyű kikapcsolható (WCAG 2.1.4); alapállapotban nincs tárolt kulcs, visszakapcsoláskor a kulcs törlődik.
{const mem=new Map<string,string>(),st:StorageLike={getItem:k=>mem.get(k)??null,setItem:(k,v)=>{mem.set(k,v)},removeItem:k=>{mem.delete(k)}};
 assert.equal(slashShortcutOn(prefStore.get()),true);
 setSlashShortcut(false,()=>st);assert.equal(slashShortcutOn(prefStore.get()),false);
 setSlashShortcut(true,()=>st);assert.equal(slashShortcutOn(prefStore.get()),true);assert.equal(mem.has(KB_KEYS.prefs),false,'visszakapcsolva nincs kulcs');
 assert.equal(slashShortcutOn(['slash']),false);assert.equal(slashShortcutOn([]),true);}
// A jogi sütitáblázat felsorolja a kulcsokat.
const legal=readFileSync('components/legal-page.tsx','utf8');
for(const k of Object.values(KB_KEYS))assert.ok(legal.includes("'"+k+"'"),'sütitáblázat: '+k);
console.log('PASS: belső útvonal, validálás, 30/8/300 korlát, duplikátumszűrés, közös kulcs két mezővel, storage esemény, sérült JSON, dobó tároló memóriás tartalékkal, SSR, sütitáblázat.');
