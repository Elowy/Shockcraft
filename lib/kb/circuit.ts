// A Tudástár ábramotorjának áramköri magja (docs/tudastar-terv.md 3.4; docs/tudastar.md „Sémák és ábramotor”): a kb-netlista/1
// formátumú bekötési netlisták típusai, betöltése (szerkezeti ellenőrzés), szimulációja union-find-dal, az igazságtábla és a
// determinisztikus szöveges vezetéktábla. Tiszta modul (zod, React, fájlrendszer nélkül): a generátor, a tesztek, a lektori csomag és –
// közzétett ábránál – a Működés nézet kliensszigete is ezt használja.
//
// REFERENCIA: a content/tudastar/r3-sim/sim.py Python-szimulátor (a foldeles_ext.py és a vedelmek_biztonsag.py bővítéssel együtt). Ez a
// modul annak SORRÓL SORRA követett átirata: ugyanazokat a kimeneteket (fogyasztónként áram alatt van-e; dugalj, különbözeti áram,
// testen átfolyó áram, hibahurok, túláramvédelem, szigetelésfigyelő, érintés), ugyanazokat a biztonsági invariánsokat (I1–I17, S0–S9,
// E1–E7) és ugyanazt a vezetéktáblát adja. Az egyenértékűséget a tests/kb-circuit.ts ellenőrzi mind a 20 netlistára, minden
// állapotkombinációra és egy gépi mutánskészletre (a referencia: tests/fixtures/kb-circuit-reference.json, generátora a
// scripts/kb-circuit-reference.py, --check-kel). Ha a sim.py változik, a referenciát újra kell generálni, és ezt a modult követni kell.
import {fingerprint} from '@/lib/sizing-tables';

export const NETLIST_FORMAT='kb-netlista/1';

// ---------------------------------------------------------------- Típusok (kb-netlista/1)
export type NlTerminal={id:string;role:string;label?:string};
export type NlPair=readonly string[];
export type NlState={name:string;label?:string;connect?:readonly NlPair[];active?:boolean;broken?:boolean};
export type NlKey={id:string;label?:string;states:readonly NlState[]};
export type NlComponent={
 id:string;type:string;label?:string;short?:string;outputLabel?:string;symbol?:string;at?:string;class?:string;
 terminals:readonly NlTerminal[];states?:readonly NlState[]|null;keys?:readonly NlKey[]|null;bridges?:readonly NlPair[];
 poles?:readonly NlPair[];scenario?:boolean;parent?:string;impedance?:readonly string[];earthContact?:boolean;bonded?:boolean;kind?:string;megjegyzes?:string;
};
export type NlWire={id?:string;from:string;to:string;conductor:string;role?:string;color?:string|null;section?:string|null;label?:string};
export type NlSection={id:string;from:string;to:string;label?:string;kind?:string};
export type NlBreak={id:string;label?:string;wire:string;states:readonly NlState[]};
export type NlTouch={id:string;label?:string;a:string;b:string};
export type NlOutputs={
 lamps?:Record<string,boolean>;outlets?:Record<string,boolean>;currents?:Record<string,boolean>;trips?:Record<string,boolean>;
 consumers?:Record<string,string>;loops?:Record<string,string>;overcurrent?:Record<string,boolean>;imd?:Record<string,boolean>;touch?:Record<string,string>;
};
export type NlTruthRow={states:Record<string,string>}&NlOutputs;
export type Netlist={
 format?:string;id:string;title:string;short?:string;article?:string;figure?:string;version?:number;note?:string;
 components:readonly NlComponent[];sections?:readonly NlSection[];wires:readonly NlWire[];truthTable:readonly NlTruthRow[];
 checks?:{allPoleDisconnect?:readonly string[]};places?:Readonly<Record<string,{label?:string;inner?:string}>>;
 earthing?:{system:string};breaks?:readonly NlBreak[];touch?:readonly NlTouch[];compare?:readonly {label:string;states:Record<string,string>}[];
 layout?:unknown;
};

// ---------------------------------------------------------------- Szótár (sim.py)
const SOURCE_TYPES=new Set(['tap']);
const LOAD_TYPES=new Set(['lampa','fogyaszto']);
export const SWITCH_PREFIX='kapcsolo-';
const MULTIPOLE_SWITCH_TYPES=new Set(['kapcsolo-102','kapcsolo-103']);
const KNOWN_TYPES=new Set(['tap','lampa','fogyaszto','kapcsolo-101','kapcsolo-102','kapcsolo-103','kapcsolo-105','kapcsolo-106','kapcsolo-106-6','kapcsolo-107',
 'kotodoboz','kotoelem','sorkapocs','kismegszakito','fi-rele','pe-sin','n-sin','dugalj','ember','hibaut','fold','ellenallas','nyomogomb']);
const PHASE_SOURCE_ROLES=new Set(['L','L1','L2','L3']);
/** Kapocsszerep → vezetőosztály. */
export const ROLE_CLASS:Readonly<Record<string,string>>={L:'fazis',L1:'fazis',L2:'fazis',L3:'fazis',kapcsolt:'fazis',kozos:'fazis','valto-1':'fazis','valto-2':'fazis',
 N:'nulla','kapcsolt-N':'nulla',PE:'pe',E:'fold'};
const VIRTUAL_CONDUCTORS=['belső','érintés','hibahely'] as const;
/** Vezető (conductor) → osztály; a nem valódi erek („belső”, „érintés”, „hibahely”) osztálya „virtualis” (sim.py VIRTUAL_CONDUCTORS). */
export const CONDUCTOR_CLASS:Readonly<Record<string,string>>={L:'fazis',L1:'fazis',L2:'fazis',L3:'fazis','kapcsolt fázis':'fazis','váltóvezeték':'fazis','áthidaló':'fazis',
 N:'nulla','kapcsolt nulla':'nulla',PE:'pe',...Object.fromEntries(VIRTUAL_CONDUCTORS.map(c=>[c,'virtualis']))};
export const COLORS=new Set(['barna','kék','zöld-sárga','fekete','szürke']);
const CLASS_COLORS:Readonly<Record<string,ReadonlySet<string>>>={fazis:new Set(['barna','fekete','szürke']),nulla:new Set(['kék']),pe:new Set(['zöld-sárga'])};
export const PLAN_ROLES=new Set(['L','Lk','K1','K2','N','Nk','PE','L1','L2','L3','PEN']);
const RCD_TYPES=new Set(['fi-rele']);
const OUTLET_TYPES=new Set(['dugalj']);
const SCENARIO_TYPES=new Set(['ember','hibaut']);
const IMPEDANCE_TYPES=new Set(['ember','hibaut','ellenallas']);
const EARTH_TYPES=new Set(['fold']);
const SINGLE_POLE_DEVICE_TYPES=new Set(['kismegszakito','nyomogomb']);

// ---------------------------------------------------------------- Segédek
const has=(o:object|undefined|null,k:string)=>!!o&&Object.prototype.hasOwnProperty.call(o,k);
/** Python-szerű repr egy szövegre (a hibaüzenetekben: 'x'). */
const repr=(v:unknown)=>v===undefined||v===null?'None':typeof v==='string'?"'"+v+"'":typeof v==='boolean'?(v?'True':'False'):String(v);
const pyList=(xs:readonly unknown[])=>'['+xs.map(repr).join(', ')+']';
const sortedStr=(xs:Iterable<string>)=>[...xs].sort();
/** Az összes kombináció (itertools.product): a választók sorrendjében, az utolsó választó változik a leggyorsabban. */
function product<T>(lists:readonly (readonly T[])[]):T[][]{
 let out:T[][]=[[]];
 for(const l of lists){const next:T[][]=[];for(const p of out)for(const x of l)next.push([...p,x]);out=next}
 return out;
}

/** Union-find (sim.py UF). */
export class UF{
 private p=new Map<string,string>();
 constructor(items:Iterable<string>){for(const i of items)this.p.set(i,i)}
 find=(x:string):string=>{
  const p=this.p;
  if(!p.has(x))throw new Error('UF: ismeretlen elem: '+x);
  while(p.get(x)!==x){p.set(x,p.get(p.get(x)!)!);x=p.get(x)!}
  return x;
 };
 union(a:string,b:string){const ra=this.find(a),rb=this.find(b);if(ra!==rb)this.p.set(rb,ra)}
 /** A halmazok (rendezett elemlistával, a lista az első eleme szerint rendezve). */
 groups():string[][]{
  const g=new Map<string,string[]>();
  for(const k of this.p.keys()){const r=this.find(k);if(!g.has(r))g.set(r,[]);g.get(r)!.push(k)}
  return [...g.values()].map(x=>x.sort()).sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);
 }
}

export type Selector={id:string;comp:string|null;key:string|null;states:readonly NlState[];label:string;scenario?:boolean;kind?:'comp'|'break'};
export type Combo=Record<string,string>;
export type SimRow={states:Combo;ok:boolean;expected?:unknown}&NlOutputs;
export type SectionRow={id:string;label:string;kind?:string;from:string;to:string;count:number;conductors:string[]};
export type CircuitReport={
 id:string;fingerprint:string;system?:string;selectors:{id:string;label:string;states:string[]}[];loads:string[];rows:SimRow[];
 errors:string[];warnings:string[];combinations:number;toggle:Record<string,Record<string,boolean>>;sections:SectionRow[];verified?:string[];pass:boolean;
};
/** Egy állás szimulációja: kimenetek, a hálózatok (union-find halmazok), a fázis alatt álló („energizált”) és az áramot vivő
 * hálózatok, valamint az áramot vivő erek (`currentWires`, a rajz Működés nézetéhez – lásd pathWires). */
export type StateSim={outputs:NlOutputs;nets:string[][];live:string[][];current:string[][];currentWires:string[]};
type Viol=(code:string,msg:string)=>void;
type El={id:string;kind:'load'|'fault'|'electrode'|'person';terms:string[];a?:string;b?:string;edges:[string,string,string][]};

export const tkey=(c:string,t:string)=>c+'.'+t;

/** A netlista ujjlenyomata (FNV-1a a JSON-szövegen; a sim.py fingerprint()-jével azonos – a cikkek szimulációs blokkjai erre hivatkoznak). */
export const netlistFingerprint=(n:unknown)=>fingerprint(n);

/** A kapcsoló állásmodellje egyezik-e a típus fizikai felépítésével (sim.py switch_model_problem). ''=rendben, null=nem ellenőrzött típus. */
function switchModelProblem(c:NlComponent):string|null{
 const ty=c.type,tids=(c.terminals??[]).map(t=>t.id),cls:Record<string,string|undefined>={};
 for(const t of c.terminals??[])cls[t.id]=ROLE_CLASS[t.role];
 const groups:(readonly NlState[])[]=c.states!==undefined&&c.states!==null?[c.states]:(c.keys??[]).map(k=>k.states??[]);
 const pairs=(s:NlState)=>(s.connect??[]).map(p=>new Set(p));
 const same=(a:Set<string>,b:Set<string>)=>a.size===b.size&&[...a].every(x=>b.has(x));
 const setEq=(a:Set<string>,b:readonly string[])=>same(a,new Set(b));
 const matching=(ps:Set<string>[])=>{const seen=new Set<string>();for(const p of ps){if(p.size!==2||[...p].some(x=>seen.has(x)))return false;for(const x of p)seen.add(x)}return true};
 const is106=(states:readonly NlState[]):Set<string>|null=>{
  if(states.length!==2||states.some(s=>pairs(s).length!==1))return null;
  const a=pairs(states[0])[0],b=pairs(states[1])[0];
  const inter=[...a].filter(x=>b.has(x));
  if(a.size!==2||b.size!==2||same(a,b)||inter.length!==1)return null;
  return new Set([...a,...b]);
 };
 if(groups.some(g=>g.some(s=>pairs(s).some(p=>p.size!==2))))return 'egy állás saját magával köt össze kapcsot';
 const lens=(g:readonly NlState[])=>g.map(s=>pairs(s).length).sort((x,y)=>x-y).join(',');
 if(ty==='kapcsolo-101'){
  if(tids.length!==2||groups.length!==1)return 'két kapocs és egy billentyű kell';
  const g=groups[0];
  if(g.length!==2||lens(g)!=='0,1'||g.some(s=>pairs(s).some(p=>!setEq(p,tids))))return 'két állás kell: egy nyitott (nincs összeköttetés) és egy zárt (a két kapocs összekötve)';
  return '';
 }
 if(ty==='kapcsolo-102'){
  const fz=tids.filter(t=>cls[t]==='fazis'),nu=tids.filter(t=>cls[t]==='nulla');
  if(tids.length!==4||new Set(fz).size!==2||new Set(nu).size!==2||groups.length!==1)return 'négy kapocs (két fázis- és két nullaoldali) és EGY billentyű kell – a két pólus együtt mozog';
  const g=groups[0],all=g.flatMap(pairs);
  const uniq:Set<string>[]=[];for(const p of all)if(!uniq.some(u=>same(u,p)))uniq.push(p);
  const want=[new Set(fz),new Set(nu)];
  if(g.length!==2||lens(g)!=='0,2'||uniq.length!==2||!want.every(w=>uniq.some(u=>same(u,w))))return 'két állás kell: mindkét pólus nyitva, illetve mindkét pólus zárva (fázis a fázissal, nulla a nullával)';
  return '';
 }
 if(ty==='kapcsolo-105'){
  if(tids.length!==3||groups.length!==2)return 'három kapocs és két billentyű kell';
  const on:Set<string>[]=[];
  for(const g of groups){
   if(g.length!==2||lens(g)!=='0,1')return 'billentyűnként két állás kell: nyitott és zárt';
   on.push(g.flatMap(pairs)[0]);
  }
  const inter=[...on[0]].filter(x=>on[1].has(x)),uni=new Set([...on[0],...on[1]]);
  if(same(on[0],on[1])||inter.length!==1||!setEq(uni,tids))return 'a két billentyű közös betápkapocsról két külön kimenetet kapcsol';
  return '';
 }
 if(ty==='kapcsolo-106'){
  if(tids.length!==3||groups.length!==1)return 'három kapocs és egy billentyű kell';
  const s=is106(groups[0]);
  if(!s||!setEq(s,tids))return 'két állás kell: a közös kapocs hol az egyik, hol a másik kimenettel (nincs „ki” állás, nincs zárlatos állás)';
  return '';
 }
 if(ty==='kapcsolo-106-6'){
  if(tids.length!==6||groups.length!==2)return 'hat kapocs és két billentyű kell';
  const sets=groups.map(is106);
  if(sets.some(s=>s===null)||[...sets[0]!].some(x=>sets[1]!.has(x))||!setEq(new Set([...sets[0]!,...sets[1]!]),tids))return 'két független váltókapcsoló-billentyű kell, diszjunkt kapcsokkal (a közös kapcsok áthidalása vezeték vagy bridges)';
  return '';
 }
 if(ty==='kapcsolo-107'){
  if(tids.length!==4||groups.length!==1)return 'négy kapocs és egy billentyű kell';
  const g=groups[0];
  const eqStates=(a:NlState,b:NlState)=>{const pa=pairs(a),pb=pairs(b);const ua:Set<string>[]=[],ub:Set<string>[]=[];for(const p of pa)if(!ua.some(u=>same(u,p)))ua.push(p);for(const p of pb)if(!ub.some(u=>same(u,p)))ub.push(p);return ua.length===ub.length&&ua.every(x=>ub.some(y=>same(x,y)))};
  if(g.length!==2||g.some(s=>pairs(s).length!==2||!matching(pairs(s)))||eqStates(g[0],g[1]))return 'két állás kell, mindkettő a négy kapocs két diszjunkt párja, és a két állás különböző';
  return '';
 }
 return null;
}

// ---------------------------------------------------------------- Áramot vivő erek (a rajz Működés nézetéhez)
/**
 * Az áramot vivő hálózatokon belül csak azok az erek visznek áramot, amelyek két áramkapocs – a működő fogyasztó L/N kapcsa, az áramot
 * vezető elem (hibahely, érintés, földelő, próbaellenállás) kapcsa vagy a táppont kapcsa – közötti úton fekszenek. A hálózat zsákutca-ágai
 * (pl. TN-S-ben a csillagponthoz kötött védővezető hibátlan állapotban, vagy egy nem használt váltóvezeték) feszültség alatt lehetnek,
 * de áramot nem visznek. Gráf: csúcs a kapocs, él az ér (a szakadt kivételével) és a készüléken belüli kötés (`inner`: híd, az
 * állás zárt érintkezője, földelésnél a föld kapcsolata); a nem áramkapocs leveleket addig metsszük, amíg van ilyen. A megmaradó erek
 * az áramút (hurokban mind a párhuzamos ág).
 * Csak a rajz kiemelését szolgálja: a kimenetek és az energizált hálózatok (a sim.py-jal összevetett rész) ettől függetlenek.
 */
function pathWires(wires:readonly NlWire[],inner:readonly (readonly [string,string])[],skip:ReadonlySet<string>,f:(x:string)=>string,current:readonly (readonly string[])[],terms:Iterable<string>):string[]{
 const inCur=new Set(current.map(n=>f(n[0])));
 const adj=new Map<string,Map<number,string>>(),edges:{a:string;b:string;wire:string|null}[]=[];
 const node=(k:string)=>{let m=adj.get(k);if(!m){m=new Map();adj.set(k,m)}return m};
 const add=(a:string,b:string,wire:string|null)=>{const i=edges.length;edges.push({a,b,wire});node(a).set(i,b);node(b).set(i,a)};
 wires.forEach((w,i)=>{const id=w.id||'#'+(i+1);if(!skip.has(id)&&inCur.has(f(w.from))&&f(w.from)===f(w.to))add(w.from,w.to,id)});
 for(const [a,b] of inner)if(inCur.has(f(a))&&f(a)===f(b))add(a,b,null);
 const keep=new Set([...terms].filter(t=>inCur.has(f(t))));
 const queue=[...adj.keys()].filter(k=>!keep.has(k)&&adj.get(k)!.size<=1);
 while(queue.length){
  const k=queue.pop()!,m=adj.get(k);if(!m)continue;
  adj.delete(k);
  for(const [i,o] of m){const om=adj.get(o);if(!om)continue;om.delete(i);if(!keep.has(o)&&om.size<=1)queue.push(o)}
 }
 const alive=new Set<number>();for(const m of adj.values())for(const i of m.keys())alive.add(i);
 return [...alive].sort((x,y)=>x-y).map(i=>edges[i].wire).filter((w):w is string=>w!==null);
}

// ---------------------------------------------------------------- Közös alap
abstract class Base{
 readonly data:Netlist;
 errors:string[]=[];warnings:string[]=[];
 comps=new Map<string,NlComponent>();
 terms=new Map<string,NlTerminal>();
 termComp=new Map<string,NlComponent>();
 selectors:Selector[]=[];
 loads:NlComponent[]=[];taps:NlComponent[]=[];
 sections=new Map<string,NlSection>();
 allPole=new Set<string>();
 private report?:CircuitReport;
 abstract readonly kind:'basic'|'earthing';
 constructor(data:Netlist){this.data=data}
 err(code:string,msg:string){this.errors.push('['+code+'] '+msg)}
 /** Készüléken belüli kötések egy állásban (pathWires): a hidak és a választók aktuális állásának zárt érintkezői. */
 innerLinks(combo:Combo):[string,string][]{
  const out:[string,string][]=[];
  for(const c of this.comps.values())for(const grp of c.bridges??[]){const ks=grp.map(t=>tkey(c.id,t)).filter(k=>this.terms.has(k));for(const k of ks.slice(1))out.push([ks[0],k])}
  for(const sel of this.selectors){
   if(!sel.comp)continue;
   const st=sel.states.find(x=>x.name===combo[sel.id]);
   for(const p of st?.connect??[]){const ka=tkey(sel.comp,p[0]),kb=tkey(sel.comp,p[1]);if(this.terms.has(ka)&&this.terms.has(kb))out.push([ka,kb])}
  }
  return out;
 }
 /** Az összes kombináció a választók sorrendjében. */
 combos():Combo[]{return product(this.selectors.map(s=>s.states.map(x=>x.name))).map(p=>Object.fromEntries(this.selectors.map((s,i)=>[s.id,p[i]])))}
 tlabel(key:string){const c=this.termComp.get(key)!,t=this.terms.get(key)!;return (c.label??c.id)+': '+(t.label??t.id)}
 sectionReport():SectionRow[]{
  const out:SectionRow[]=[];
  for(const [sid,s] of this.sections){
   const ws=(this.data.wires??[]).filter(w=>w.section===sid);
   out.push({id:sid,label:s.label??sid,kind:s.kind,from:s.from,to:s.to,count:ws.length,conductors:ws.map(wireName)});
  }
  return out;
 }
 run():CircuitReport{if(!this.report)this.report=this.compute();return this.report}
 protected abstract compute():CircuitReport;
 abstract simulate(combo:Combo):StateSim;
}

export const wireName=(w:NlWire)=>(w.label?w.conductor+' '+w.label:w.conductor)+' ('+(w.color??'None')+')';

// ---------------------------------------------------------------- Kapcsolási és védelmi netlisták (sim.py Netlist + vedelmek_biztonsag)
class BasicNetlist extends Base{
 readonly kind='basic' as const;
 private protectiveCache?:boolean;
 private protExpected=new Map<string,NlOutputs>();
 constructor(data:Netlist){super(data);this.structure()}

 private structure(){
  const d=this.data;
  for(const k of ['id','title','components','wires','truthTable'])if(!has(d,k))this.err('S0','hiányzó mező: '+k);
  if((d.format??NETLIST_FORMAT)!==NETLIST_FORMAT)this.warnings.push('ismeretlen formátum: '+d.format);
  for(const c of d.components??[]){
   const cid=c.id;
   if(!cid||this.comps.has(cid)){this.err('S1','hiányzó vagy ismétlődő komponens-id: '+repr(cid));continue}
   if(cid.includes('.'))this.err('S1','a komponens-id nem tartalmazhat pontot: '+cid);
   this.comps.set(cid,c);
   if(!KNOWN_TYPES.has(c.type))this.warnings.push('ismeretlen komponenstípus: '+cid+' ('+c.type+')');
   const seen=new Set<string>();
   for(const t of c.terminals??[]){
    const tid=t.id;
    if(!tid||seen.has(tid)){this.err('S1','hiányzó vagy ismétlődő kapocs-id: '+cid+'.'+tid);continue}
    seen.add(tid);
    if(!has(ROLE_CLASS,t.role))this.err('S2','ismeretlen kapocsszerep: '+cid+'.'+tid+' ('+t.role+')');
    const key=tkey(cid,tid);this.terms.set(key,t);this.termComp.set(key,c);
   }
   for(const grp of c.bridges??[])for(const t of grp)if(!this.terms.has(tkey(cid,t)))this.err('S1','ismeretlen kapocs a belső összeköttetésben: '+cid+'.'+t);
   const hasStates=c.states!==undefined&&c.states!==null,hasKeys=c.keys!==undefined&&c.keys!==null;
   if(hasStates&&hasKeys)this.err('S6',cid+': states és keys egyszerre nem adható meg');
   const groups:[string,string|null,readonly NlState[],string][]=[];
   if(hasStates)groups.push([cid,null,c.states!,c.label??cid]);
   for(const k of c.keys??[])groups.push([cid+'.'+k.id,k.id,k.states??[],(c.label??cid)+' – '+(k.label??k.id)]);
   for(const [sid,key,states,label] of groups){
    const names=states.map(s=>s.name);
    if(!states.length||new Set(names).size!==names.length||names.some(n=>n===undefined||n===null))this.err('S6',sid+': üres vagy ismétlődő állapotnevek');
    for(const s of states)for(const pair of s.connect??[]){
     if(pair.length!==2){this.err('S6',sid+'/'+s.name+': a connect elemei kapocspárok');continue}
     for(const t of pair){
      const tk=tkey(cid,t);
      if(!this.terms.has(tk))this.err('S6',sid+'/'+s.name+': ismeretlen kapocs '+tk);
      else if(this.terms.get(tk)!.role==='PE')this.err('I3',sid+'/'+s.name+': a kapcsoló a védővezetőt kapcsolja ('+tk+')');
     }
    }
    this.selectors.push({id:sid,comp:cid,key,states,label});
   }
   if((c.type??'').startsWith(SWITCH_PREFIX)&&!groups.length)this.err('S6',cid+': kapcsolónak nincs állapota (states/keys)');
   else if((c.type??'').startsWith(SWITCH_PREFIX)){
    const problem=switchModelProblem(c);
    if(problem===null)this.warnings.push(cid+': a(z) '+c.type+' típus belső modelljét a szimulátor nem ellenőrzi');
    else if(problem)this.err('S8',cid+': a kapcsoló belső modellje nem felel meg a(z) '+c.type+' típusnak: '+problem);
   }
  }
  this.loads=[...this.comps.values()].filter(c=>LOAD_TYPES.has(c.type));
  this.taps=[...this.comps.values()].filter(c=>SOURCE_TYPES.has(c.type));
  if(!this.taps.length)this.err('S5','nincs betáp (tap) komponens');
  for(const tp of this.taps){
   const roles=(tp.terminals??[]).map(t=>t.role);
   if(!roles.some(r=>PHASE_SOURCE_ROLES.has(r))||roles.filter(r=>r==='N').length!==1||roles.filter(r=>r==='PE').length!==1)this.err('S5',tp.id+': a betápnak L, N és PE kapocs kell');
  }
  if(!this.loads.length&&![...this.comps.values()].some(c=>OUTLET_TYPES.has(c.type)))this.err('S5','nincs fogyasztó (lampa) komponens');
  for(const ld of this.loads){
   const roles=(ld.terminals??[]).map(t=>t.role);
   if(roles.filter(r=>r==='L').length!==1||roles.filter(r=>r==='N').length!==1)this.err('S5',ld.id+': a fogyasztónak pontosan egy L és egy N kapcsa kell');
   if(ld.class!=='II'&&roles.filter(r=>r==='PE').length!==1)this.err('I2',ld.id+': I. osztályú (fémtestű) fogyasztó PE-kapocs nélkül');
  }
  for(const s of d.sections??[]){if(this.sections.has(s.id))this.err('S4','ismétlődő szakasz: '+s.id);this.sections.set(s.id,s)}
  const wids=new Set<string>();
  (d.wires??[]).forEach((w,i)=>{
   const wid=w.id||'#'+(i+1);
   if(wids.has(wid))this.err('S3','ismétlődő vezeték-id: '+wid);
   wids.add(wid);
   let ok=true;
   for(const end of ['from','to'] as const)if(!this.terms.has(w[end])){this.err('S3',wid+': ismeretlen végpont '+repr(w[end]));ok=false}
   const cond=w.conductor,col=w.color;
   if(CONDUCTOR_CLASS[cond]==='virtualis'){
    if((col!==undefined&&col!==null)||(w.section!==undefined&&w.section!==null))this.err('S3',wid+': a(z) „'+cond+'” kapcsolat nem valódi ér: nincs színe és szakasza');
    return;
   }
   if(!has(CONDUCTOR_CLASS,cond)){this.err('S3',wid+': ismeretlen vezető '+repr(cond));ok=false}
   if(!COLORS.has(col as string)){this.err('I8',wid+': ismeretlen szín '+repr(col));ok=false}
   if(w.role!==undefined&&w.role!==null&&!PLAN_ROLES.has(w.role))this.warnings.push(wid+': ismeretlen szerepkód '+w.role);
   if(!ok)return;
   const cls=CONDUCTOR_CLASS[cond];
   if(!CLASS_COLORS[cls].has(col!))this.err('I8',wid+': '+cond+' vezető '+col+' színnel (megengedett: '+sortedStr(CLASS_COLORS[cls]).join(', ')+')');
   for(const end of ['from','to'] as const){
    const tcls=ROLE_CLASS[this.terms.get(w[end])!.role];
    if(tcls!==cls){const code=cls==='pe'||tcls==='pe'?'I3':cls==='nulla'||tcls==='nulla'?'I6':'I9';this.err(code,wid+': '+cond+' vezető '+(tcls??'None')+' szerepű kapocsra fut ('+w[end]+')')}
   }
   const ca=this.termComp.get(w.from)!,cb=this.termComp.get(w.to)!;
   if(ca===cb&&cls!=='fazis')this.err('S3',wid+': komponensen belüli vezeték csak fázisoldali áthidaló lehet');
   for(const c of [ca,cb])if((c.type??'').startsWith(SWITCH_PREFIX)&&!MULTIPOLE_SWITCH_TYPES.has(c.type)&&cls!=='fazis')this.err(cls==='nulla'?'I6':'I3',wid+': '+cond+' vezető egypólusú kapcsolóra fut ('+c.id+')');
   const sec=w.section,locA=ca.at??ca.id,locB=cb.at??cb.id;
   if(this.sections.size){
    if(locA===locB){if(sec!==undefined&&sec!==null)this.err('S4',wid+': dobozon belüli vezeték nem tartozhat szakaszhoz ('+sec+')')}
    else if(!sec||!this.sections.has(sec))this.err('S4',wid+': hiányzó vagy ismeretlen szakasz '+repr(sec));
    else{const s=this.sections.get(sec)!;if(!(new Set([s.from,s.to]).size===new Set([locA,locB]).size&&[s.from,s.to].every(x=>x===locA||x===locB)&&[locA,locB].every(x=>x===s.from||x===s.to)))this.err('S4',wid+': a szakasz ('+sec+': '+s.from+'–'+s.to+') nem a vezeték két végét köti ('+locA+'–'+locB+')')}
   }
  });
  const apd=d.checks?.allPoleDisconnect??[];
  for(const lid of apd)if(!this.comps.has(lid)||!LOAD_TYPES.has(this.comps.get(lid)!.type))this.err('S5','checks.allPoleDisconnect: ismeretlen fogyasztó '+lid);
  this.allPole=new Set(apd);
 }

 solve(combo:Combo,skip?:string):UF{
  const uf=new UF(this.terms.keys());
  for(const w of this.data.wires??[])if(this.terms.has(w.from)&&this.terms.has(w.to))uf.union(w.from,w.to);
  for(const c of this.comps.values())for(const grp of c.bridges??[]){
   const ks=grp.map(t=>tkey(c.id,t)).filter(k=>this.terms.has(k));
   for(const k of ks.slice(1))uf.union(ks[0],k);
  }
  for(const sel of this.selectors){
   if(skip!==undefined&&sel.comp===skip)continue;
   const st=sel.states.find(s=>s.name===combo[sel.id])!;
   for(const pair of st.connect??[]){const ka=tkey(sel.comp!,pair[0]),kb=tkey(sel.comp!,pair[1]);if(this.terms.has(ka)&&this.terms.has(kb))uf.union(ka,kb)}
  }
  return uf;
 }

 // --- védelmi bővítés (sim.py [vedelmek-bovites], vedelmek_biztonsag.py) ---
 private selState(combo:Combo,cid:string):NlState&{name:string|null}{
  const sel=this.selectors.find(s=>s.comp===cid&&s.key===null);
  if(!sel)return {name:null as unknown as string,connect:[]};
  return sel.states.find(s=>s.name===combo[sel.id])!;
 }
 private rcds(){return [...this.comps.values()].filter(c=>RCD_TYPES.has(c.type))}
 private poles(c:NlComponent):[string,string][]{return (c.poles??[]).map(p=>[p[0],p[1]] as [string,string])}
 private protClosed(combo:Combo){
  for(const c of this.rcds()){
   const st=this.selState(combo,c.id);
   const closed=new Set<string>();for(const p of st.connect??[]){closed.add(p[0]+'\u0000'+p[1]);closed.add(p[1]+'\u0000'+p[0])}
   const poles=this.poles(c);
   if(!poles.length||!poles.every(p=>closed.has(p[0]+'\u0000'+p[1])))return false;
  }
  return true;
 }
 isProtective():boolean{
  if(this.protectiveCache===undefined){
   const types=new Set([...this.comps.values()].map(c=>c.type));
   this.protectiveCache=[...types].some(t=>RCD_TYPES.has(t)||OUTLET_TYPES.has(t)||IMPEDANCE_TYPES.has(t)||EARTH_TYPES.has(t)||t==='nyomogomb');
   for(const c of this.rcds()){
    if(!this.poles(c).length)this.err('S7',c.id+': az áram-védőkapcsolónak meg kell adni a pólusait (poles: [[tápkapocs, terheléskapocs], ...])');
    for(const p of c.poles??[])if(p.length!==2||p.some(t=>!this.terms.has(tkey(c.id,t))))this.err('S7',c.id+': hibás pólus '+pyList(p));
   }
   for(const c of this.comps.values()){
    if(IMPEDANCE_TYPES.has(c.type)){
     const imp=c.impedance&&c.impedance.length?c.impedance:(c.terminals??[]).map(t=>t.id).slice(0,2);
     if(imp.length!==2||imp.some(t=>!this.terms.has(tkey(c.id,t))))this.err('S7',c.id+': az impedancia két kapcsa nem egyértelmű');
    }
    if(SCENARIO_TYPES.has(c.type)&&(c.states===undefined||c.states===null))this.err('S7',c.id+': hibahelyzetnek/érintésnek állapotai kellenek (nincs/fennáll, active)');
   }
   if(this.protectiveCache)this.modelChecks();
  }
  return this.protectiveCache;
 }
 /** vedelmek_biztonsag.py _model_checks: S9 (készülékmodell), I2/S5 (dugalj kapcsai). */
 private modelChecks(){
  const clsOf=(k:string)=>ROLE_CLASS[this.terms.get(k)!.role];
  for(const c of this.comps.values()){
   const ty=c.type,cid=c.id,tids=(c.terminals??[]).map(t=>t.id);
   if(RCD_TYPES.has(ty)){
    const poles=(c.poles??[]).filter(p=>p.length===2);
    const pcls:(string|null)[]=[];
    for(const p of poles){
     const cl=new Set(p.filter(t=>this.terms.has(tkey(cid,t))).map(t=>clsOf(tkey(cid,t))));
     if(cl.size!==1||cl.has('pe'))this.err('S9',cid+': a FI-relé pólusa ('+pyList(p)+') két azonos szerepű (fázis vagy nulla) kapocsból áll, PE nem lehet');
     pcls.push(cl.size===1?[...cl][0]:null);
    }
    if(poles.length&&(pcls.filter(x=>x==='nulla').length!==1||pcls.filter(x=>x==='fazis').length<1))this.err('S9',cid+': a FI-relének legalább egy fázis- és pontosan egy nullapólusa van (a nullavezető is átmegy az összegáramváltón)');
    const pset=poles.map(p=>[...p].sort().join('\u0000'));
    const psetS=new Set(pset);
    const states=c.states??[];
    for(const s of states){
     const cs=new Set((s.connect??[]).map(p=>[...p].sort().join('\u0000')));
     if(cs.size&&!(cs.size===psetS.size&&[...cs].every(x=>psetS.has(x))))this.err('S9',cid+'/'+s.name+': a FI-relé állása vagy minden pólust zár, vagy egyet sem (a kétpólusú FI a fázist és a nullát együtt bontja)');
    }
    if(psetS.size&&!states.some(s=>{const cs=new Set((s.connect??[]).map(p=>[...p].sort().join('\u0000')));return cs.size===psetS.size&&[...cs].every(x=>psetS.has(x))}))this.err('S9',cid+': a FI-relének nincs bekapcsolt (minden pólust záró) állása');
   }else if(ty==='kismegszakito'||ty==='nyomogomb'){
    const states=c.states??[];
    if(tids.length!==2||tids.some(t=>clsOf(tkey(cid,t))!=='fazis')){this.err('S9',cid+': az egypólusú '+ty+' két fázisszerepű kapoccsal modellezhető');continue}
    const pair=[...tids].sort().join('\u0000');
    const kinds:boolean[]=[];
    for(const s of states){
     const cs=new Set((s.connect??[]).map(p=>[...p].sort().join('\u0000')));
     if(!(cs.size===0||(cs.size===1&&cs.has(pair))))this.err('S9',cid+'/'+s.name+': az állás vagy nyitott, vagy a két kapcsot köti össze');
     kinds.push(cs.size>0);
    }
    if(states.length>1&&(kinds.every(Boolean)||!kinds.some(Boolean)))this.err('S9',cid+': a többállású '+ty+' egyik állása nyitott, egy másik zárt kell legyen (különben sosem bont / sosem zár)');
    if(ty==='kismegszakito'&&states.length&&!kinds.some(Boolean))this.err('S9',cid+': a kismegszakítónak nincs bekapcsolt állása');
   }
   if(OUTLET_TYPES.has(ty)){
    const roles=tids.map(t=>clsOf(tkey(cid,t)));
    if(roles.filter(r=>r==='pe').length!==1)this.err('I2',cid+': a védőérintkezős dugaljnak pontosan egy védőérintkező- (PE) kapcsa kell');
    if(roles.filter(r=>r==='fazis').length!==1||roles.filter(r=>r==='nulla').length!==1)this.err('S5',cid+': a dugaljnak pontosan egy fázis- és egy nullakapcsa kell');
   }
  }
  for(const c of this.comps.values())if(c.type==='nyomogomb'&&c.parent!==undefined&&c.parent!==null){
   const par=this.comps.get(c.parent);
   if(!par||!RCD_TYPES.has(par.type))this.err('S9',c.id+': a próbagomb szülője ('+c.parent+') nem FI-relé');
  }
 }
 private scenarioSels(){return this.selectors.filter(s=>{const c=this.comps.get(s.comp!)!;return SCENARIO_TYPES.has(c.type)||!!c.scenario})}
 private protExpect(i:number,key:string,row:NlTruthRow){
  if(!this.isProtective())return;
  const want:NlOutputs={};
  const sets:[keyof NlOutputs,Set<string>][]=[
   ['outlets',new Set([...this.comps.values()].filter(c=>OUTLET_TYPES.has(c.type)).map(c=>c.id))],
   ['currents',new Set([...this.comps.values()].filter(c=>SCENARIO_TYPES.has(c.type)).map(c=>c.id))],
   ['trips',new Set(this.rcds().map(c=>c.id))],
  ];
  for(const [k,ids] of sets){
   if(!ids.size){if(has(row,k))this.err('I10','truthTable['+i+']: „'+k+'” kulcs, de nincs ilyen elem');continue}
   const got=row[k] as Record<string,unknown>|undefined;
   if(!got||typeof got!=='object'||Array.isArray(got)||!(Object.keys(got).length===ids.size&&Object.keys(got).every(x=>ids.has(x)))){this.err('I10','truthTable['+i+']: a(z) „'+k+'” köre eltér (várt: '+pyList(sortedStr(ids))+')');continue}
   (want as Record<string,unknown>)[k]=Object.fromEntries(sortedStr(ids).map(x=>[x,!!got[x]]));
  }
  this.protExpected.set(key,want);
 }
 /** A védelmi kimenetek egy állásban (sim.py _prot_eval + vedelmek_biztonsag I4). `conductingOut`: a vezető (áramot vivő) elemek kapocspárjai. */
 private protEval(combo:Combo,uf:UF,L:Set<string>,N:Set<string>,PE:Set<string>,lamps:Record<string,boolean>,tag:string,viol:Viol,conductingOut?:[string,string][]):NlOutputs{
  if(!this.isProtective())return {};
  const f=uf.find;
  const earth=[...this.comps.values()].filter(c=>EARTH_TYPES.has(c.type)).flatMap(c=>(c.terminals??[]).map(t=>tkey(c.id,t.id)));
  const E=new Set(earth.map(f));
  const RET=new Set([...N,...PE,...E]);
  for(const k of earth)if(N.has(f(k))||L.has(f(k)))viol('I1','a föld (talaj) '+k+' a nulla- vagy fázisvezetővel egy hálózaton ('+tag+')');
  const out:NlOutputs={};
  const outlets:Record<string,boolean>={};
  for(const c of this.comps.values())if(OUTLET_TYPES.has(c.type)){
   const ls=(c.terminals??[]).filter(t=>ROLE_CLASS[t.role]==='fazis').map(t=>tkey(c.id,t.id));
   const ns=(c.terminals??[]).filter(t=>t.role==='N').map(t=>tkey(c.id,t.id));
   outlets[c.id]=!!(ls.length&&ns.length&&ls.some(x=>L.has(f(x)))&&ns.some(x=>N.has(f(x))));
  }
  const conducting:[string,string][]=[];
  for(const c of this.comps.values())if(outlets[c.id]){
   const tl=(c.terminals??[]).filter(t=>ROLE_CLASS[t.role]==='fazis'&&L.has(f(tkey(c.id,t.id)))).map(t=>tkey(c.id,t.id))[0];
   const tn=(c.terminals??[]).filter(t=>t.role==='N'&&N.has(f(tkey(c.id,t.id)))).map(t=>tkey(c.id,t.id))[0];
   conducting.push([tl,tn]);
  }
  for(const ld of this.loads)if(lamps[ld.id]){
   const tl=tkey(ld.id,ld.terminals.find(t=>t.role==='L')!.id),tn=tkey(ld.id,ld.terminals.find(t=>t.role==='N')!.id);
   conducting.push([tl,tn]);
  }
  const currents:Record<string,boolean>={};
  for(const c of this.comps.values()){
   if(!IMPEDANCE_TYPES.has(c.type))continue;
   const st=this.selState(combo,c.id);
   const active=st.name!==null?(st.active??true):true;
   const imp=c.impedance&&c.impedance.length?c.impedance:(c.terminals??[]).map(t=>t.id).slice(0,2);
   const a=tkey(c.id,imp[0]),b=tkey(c.id,imp[1]),ra=f(a),rb=f(b);
   const cond=!!(active&&((L.has(ra)&&RET.has(rb))||(L.has(rb)&&RET.has(ra))));
   if(SCENARIO_TYPES.has(c.type))currents[c.id]=cond;
   if(cond)conducting.push([a,b]);
  }
  const trips:Record<string,boolean>={};
  const srcs=[...this.taps.flatMap(tp=>(tp.terminals??[]).map(t=>tkey(tp.id,t.id))),...earth];
  for(const c of this.rcds()){
   const st=this.selState(combo,c.id);
   const closed=new Set<string>();for(const p of st.connect??[]){closed.add(p[0]+'\u0000'+p[1]);closed.add(p[1]+'\u0000'+p[0])}
   const poles=this.poles(c);
   if(!poles.length||!poles.every(p=>closed.has(p[0]+'\u0000'+p[1]))){trips[c.id]=false;continue}
   const zf=this.solve(combo,c.id).find;
   const zone=new Set(poles.map(([,ld])=>zf(tkey(c.id,ld)))),supply=new Set(poles.map(([sp])=>zf(tkey(c.id,sp))));
   const bypass=[...zone].some(z=>supply.has(z))||srcs.some(s=>zone.has(zf(s)));
   if(bypass)viol('I12',c.id+': a védett oldal a FI-relé pólusait megkerülve is összeköttetésben van a táp oldallal ('+tag+')');
   let residual=false;
   for(const [a,b] of conducting){const ia=zone.has(zf(a)),ib=zone.has(zf(b));if(ia!==ib||(bypass&&(ia||ib)))residual=true}
   trips[c.id]=residual;
  }
  const normal=this.scenarioSels().every(s=>combo[s.id]===s.states[0].name);
  if(normal)for(const [rid,t] of Object.entries(trips))if(t)viol('I11',rid+': normál üzemben is különbözeti áram folyna – kioldana ('+tag+')');
  if(Object.keys(outlets).length)out.outlets=outlets;
  if(Object.keys(currents).length)out.currents=currents;
  if(Object.keys(trips).length)out.trips=trips;
  // vedelmek_biztonsag I4 a dugaljakra
  for(const [cid,live] of Object.entries(out.outlets??{})){
   const c=this.comps.get(cid)!;
   if(!live&&(c.terminals??[]).some(t=>ROLE_CLASS[t.role]==='fazis'&&L.has(f(tkey(cid,t.id)))))viol('I4',cid+': a dugalj feszültségmentesnek számít, de a fázis kapcsa feszültség alatt van ('+tag+')');
  }
  if(conductingOut)conductingOut.push(...conducting);
  return out;
 }

 private roots(uf:UF){
  const f=uf.find,L=new Set<string>(),N=new Set<string>(),PE=new Set<string>(),src:[string,string][]=[];
  for(const tp of this.taps)for(const t of tp.terminals??[]){
   const k=tkey(tp.id,t.id);src.push([k,t.role]);
   if(PHASE_SOURCE_ROLES.has(t.role))L.add(f(k));else if(t.role==='N')N.add(f(k));else if(t.role==='PE')PE.add(f(k));
  }
  return {L,N,PE,src};
 }

 /** Egy állás kiértékelése (sim.py run() ciklusmagja): kimenetek és a megsértett invariánsok. */
 private evalCombo(combo:Combo,viol:Viol,conductingOut?:[string,string][]){
  const uf=this.solve(combo),f=uf.find;
  const tag=Object.entries(combo).map(([k,v])=>k+'='+v).join(', ')||'(nincs kapcsoló)';
  const {L,N,PE,src}=this.roots(uf);
  for(let i=0;i<src.length;i++)for(let j=i+1;j<src.length;j++){
   const [ka,ra]=src[i],[kb,rb]=src[j];
   const ca=ka.split('.')[0],cb=kb.split('.')[0];
   if(f(ka)===f(kb)&&!(ca===cb&&ra===rb)){
    if(ca!==cb&&ra==='PE'&&rb==='PE')continue;
    if(ca!==cb&&ra==='N'&&rb==='N'){viol('I14','két áramkör nullavezetője összekötve ('+ka+'–'+kb+') ebben az állásban: '+tag);continue}
    viol('I1','zárlat '+ra+'–'+rb+' ('+ka+'–'+kb+') ebben az állásban: '+tag);
   }
  }
  const peMembers=new Set([...this.terms.keys()].filter(k=>PE.has(f(k))));
  for(const [k,t] of this.terms){
   if(t.role==='PE'&&!peMembers.has(k))viol('I2','a védővezető megszakad: '+k+' nincs a PE-hálózaton ('+tag+')');
   if(peMembers.has(k)&&t.role!=='PE')viol('I3','nem PE kapocs ('+k+', '+t.role+') a PE-hálózaton ('+tag+')');
  }
  const protClosed=this.protClosed(combo);
  for(const c of this.comps.values()){
   const ty=c.type??'';
   for(const t of c.terminals??[]){
    const k=tkey(c.id,t.id),r=f(k);
    if(SINGLE_POLE_DEVICE_TYPES.has(ty)&&N.has(r))viol('I6','a nullavezető egypólusú készüléken ('+ty+') halad át ('+k+'; '+tag+')');
    if(ty.startsWith(SWITCH_PREFIX)){
     if(!MULTIPOLE_SWITCH_TYPES.has(ty)&&N.has(r))viol('I6','a nullavezető egypólusú kapcsolón halad át ('+k+'; '+tag+')');
     if(ROLE_CLASS[t.role]==='fazis'&&N.has(r))viol('I5','fázisoldali kapcsolókapocs a nullavezetőn ('+k+'; '+tag+')');
     if(ROLE_CLASS[t.role]==='nulla'&&L.has(r))viol('I5','nullaoldali kapcsolókapocs fázison ('+k+'; '+tag+')');
    }else if(!LOAD_TYPES.has(ty)){
     if(t.role==='N'&&!N.has(r)&&protClosed)viol('I7','a nullavezető-kötés nem folytonos: '+k+' ('+tag+')');
     if(ROLE_CLASS[t.role]==='fazis'&&N.has(r))viol('I5','fázis szerepű kötés a nullavezetőn: '+k+' ('+tag+')');
     if(ROLE_CLASS[t.role]==='nulla'&&L.has(r))viol('I5','nulla szerepű kötés fázison: '+k+' ('+tag+')');
    }
   }
  }
  const lamps:Record<string,boolean>={};
  for(const ld of this.loads){
   const tl=tkey(ld.id,ld.terminals.find(t=>t.role==='L')!.id),tn=tkey(ld.id,ld.terminals.find(t=>t.role==='N')!.id);
   const rl=f(tl),rn=f(tn);
   const on=(L.has(rl)&&N.has(rn))||(N.has(rl)&&L.has(rn));
   lamps[ld.id]=on;
   if(N.has(rl)||L.has(rn))viol('I5',ld.id+': felcserélt polaritás (L-kapocs a nullán vagy N-kapocs fázison) ('+tag+')');
   if(!on&&(L.has(rl)||L.has(rn)))viol('I4',ld.id+': kikapcsolt állásban is fázist kap az L-kapocs – a kapcsoló nem a fázist bontja ('+tag+')');
   if(on&&this.taps.length>1){
    const [ph,nu]=L.has(rl)?[rl,rn]:[rn,rl];
    const tPh=new Set<string>(),tNu=new Set<string>();
    for(const tp of this.taps)for(const t of tp.terminals??[]){
     if(PHASE_SOURCE_ROLES.has(t.role)&&f(tkey(tp.id,t.id))===ph)tPh.add(tp.id);
     if(t.role==='N'&&f(tkey(tp.id,t.id))===nu)tNu.add(tp.id);
    }
    if(!(tPh.size===tNu.size&&[...tPh].every(x=>tNu.has(x))))viol('I14',ld.id+': a fázis ('+sortedStr(tPh).join(', ')+') és a nulla ('+sortedStr(tNu).join(', ')+') nem ugyanabból az áramkörből jön – kölcsönvett nulla ('+tag+')');
   }
   if(this.allPole.has(ld.id)){if(!on&&(N.has(rn)||L.has(rn)||N.has(rl)))viol('I7',ld.id+': kikapcsolva nem bont minden pólust ('+tag+')')}
   else if(!N.has(rn)&&protClosed)viol('I7',ld.id+': a nullavezető nem folytonos / kapcsolt ('+tag+')');
  }
  const ext=this.protEval(combo,uf,L,N,PE,lamps,tag,viol,conductingOut);
  return {uf,L,N,PE,lamps,ext,tag};
 }

 protected compute():CircuitReport{
  const d=this.data;
  const rep:CircuitReport={id:d.id,fingerprint:netlistFingerprint(d),selectors:this.selectors.map(s=>({id:s.id,label:s.label,states:s.states.map(x=>x.name)})),
   loads:this.loads.map(l=>l.id),rows:[],errors:this.errors,warnings:this.warnings,combinations:0,toggle:{},sections:[],pass:false};
  // A sim.py a szerkezeti hibás netlistát itt abbahagyja; a vedelmek_biztonsag run() ezután is lefuttatja a védelmi modellellenőrzést.
  if(this.errors.some(e=>/^\[(S0|S1|S5|S6)\]/.test(e))){this.isProtective();return rep}
  const selIds=this.selectors.map(s=>s.id);
  const expected=new Map<string,Record<string,boolean>>();
  (d.truthTable??[]).forEach((row,i)=>{
   const st=row.states??{};
   if(!(Object.keys(st).length===selIds.length&&Object.keys(st).every(x=>selIds.includes(x)))){this.err('I10','truthTable['+i+']: a kapcsolók köre eltér ('+pyList(sortedStr(Object.keys(st)))+' ≠ '+pyList(sortedStr(selIds))+')');return}
   for(const [sid,name] of Object.entries(st))if(!this.selectors.find(s=>s.id===sid)!.states.some(x=>x.name===name))this.err('I10','truthTable['+i+']: '+sid+' ismeretlen állapota '+repr(name));
   const key=JSON.stringify(selIds.map(s=>st[s]));
   if(expected.has(key))this.err('I10','truthTable['+i+']: ismétlődő sor ('+selIds.map(s=>repr(st[s])).join(', ')+(selIds.length===1?',':'')+')');
   const lamps=row.lamps??{};
   const ids=new Set(this.loads.map(l=>l.id));
   if(!(Object.keys(lamps).length===ids.size&&Object.keys(lamps).every(x=>ids.has(x))))this.err('I10','truthTable['+i+']: a lámpák köre eltér');
   expected.set(key,lamps);
   this.protExpect(i,key,row);
  });
  const violations=new Set<string>();
  const viol:Viol=(code,msg)=>{violations.add('['+code+'] '+msg)};
  let n=0;
  for(const combo of this.combos()){
   n++;
   const {lamps,ext,tag}=this.evalCombo(combo,viol);
   const row:SimRow={states:{...combo},lamps,ok:false,...ext};
   const key=JSON.stringify(selIds.map(s=>combo[s]));
   const exp=expected.get(key);
   if(exp===undefined){this.err('I10','truthTable: hiányzó sor ('+tag+')');row.ok=false}
   else{
    row.expected=exp;
    row.ok=sameRecord(exp,lamps);
    if(!row.ok)this.err('I10','eltérés a truthTable-től ('+tag+'): várt '+pyDict(exp)+', szimulált '+pyDict(lamps));
    for(const [k2,v2] of Object.entries(ext)){
     const e2=(this.protExpected.get(key) as Record<string,unknown>|undefined)?.[k2];
     if(!sameRecord(e2 as Record<string,boolean>|undefined,v2 as Record<string,boolean>)){row.ok=false;this.err('I10','eltérés a truthTable-től ('+tag+'): '+k2+' várt '+pyDict(e2 as Record<string,boolean>|undefined)+', szimulált '+pyDict(v2 as Record<string,boolean>))}
    }
   }
   rep.rows.push(row);
  }
  if(expected.size>n)this.err('I10','a truthTable-ben nem létező állás is szerepel');
  for(const v of violations)this.errors.push(v);
  rep.combinations=n;
  const rows=new Map(rep.rows.map(r=>[JSON.stringify(selIds.map(s=>r.states[s])),r.lamps!]));
  for(const ld of this.loads){
   rep.toggle[ld.id]={};
   this.selectors.forEach((sel,i)=>{
    const names=sel.states.map(x=>x.name);
    if(names.length!==2)return;
    let always=true;
    for(const [keyJson,lamps] of rows){
     const key=JSON.parse(keyJson) as string[],other=[...key];
     other[i]=key[i]===names[0]?names[1]:names[0];
     if(rows.get(JSON.stringify(other))![ld.id]===lamps[ld.id]){always=false;break}
    }
    rep.toggle[ld.id][sel.id]=always;
   });
  }
  rep.sections=this.sectionReport();
  rep.pass=!this.errors.length;
  // vedelmek_biztonsag.py run(): I15, I16, I17
  if(!this.isProtective()||!rep.rows.length)return rep;
  const added:[string,string][]=[];
  const mcbs=new Set([...this.comps.values()].filter(c=>c.type==='kismegszakito').map(c=>c.id));
  const rcdIds=new Set(this.rcds().map(c=>c.id));
  const outlets=[...this.comps.values()].filter(c=>OUTLET_TYPES.has(c.type));
  if(mcbs.size){
   const f=this.unionWithout(mcbs).find,Lr=this.srcRoots(f,PHASE_SOURCE_ROLES);
   for(const c of [...outlets,...this.loads])if((c.terminals??[]).some(t=>ROLE_CLASS[t.role]==='fazis'&&Lr.has(f(tkey(c.id,t.id)))))added.push(['I15',c.id+': a fázis kismegszakító nélkül is eljut ide – az áramkörnek nincs túláramvédelme']);
  }
  if(rcdIds.size&&outlets.length){
   const f=this.unionWithout(rcdIds).find,Sr=this.srcRoots(f,new Set([...PHASE_SOURCE_ROLES,'N']));
   for(const c of outlets)if((c.terminals??[]).some(t=>(ROLE_CLASS[t.role]==='fazis'||ROLE_CLASS[t.role]==='nulla')&&Sr.has(f(tkey(c.id,t.id)))))added.push(['I16',c.id+': a dugalj fázisa vagy nullája FI-relé nélkül is a betáphoz csatlakozik – nincs kiegészítő védelem']);
  }
  for(const c of this.comps.values()){
   if(c.type!=='nyomogomb'||!c.parent||!RCD_TYPES.has(this.comps.get(c.parent)?.type??''))continue;
   const sel=this.selectors.find(s=>s.comp===c.id);
   const pressed=(sel?.states??[]).filter(s=>(s.connect??[]).length).map(s=>s.name);
   const par=this.comps.get(c.parent)!;
   const pset=new Set((par.poles??[]).map(p=>[...p].sort().join('\u0000')));
   const psel=this.selectors.find(s=>s.comp===par.id);
   const closed=(psel?.states??[]).filter(s=>{const cs=new Set((s.connect??[]).map(p=>[...p].sort().join('\u0000')));return cs.size===pset.size&&[...cs].every(x=>pset.has(x))}).map(s=>s.name);
   const hit=rep.rows.filter(r=>pressed.includes(r.states[sel?sel.id:'\u0000'])&&closed.includes(r.states[psel?psel.id:'\u0000']));
   if(!pressed.length||!hit.length)added.push(['I17',c.id+': a próbagombnak nincs megnyomott állása bekapcsolt FI-relé mellett']);
   for(const r of hit)if(!r.trips?.[par.id]){added.push(['I17',c.id+': a próbagomb megnyomására a(z) '+par.id+' nem old ki ('+Object.entries(r.states).map(([k,v])=>k+'='+v).join(', ')+')']);break}
  }
  for(const [code,msg] of added)this.err(code,msg);
  if(added.length)rep.pass=false;
  return rep;
 }
 private unionWithout(skip:Set<string>){
  const uf=new UF(this.terms.keys());
  for(const w of this.data.wires??[])if(this.terms.has(w.from)&&this.terms.has(w.to))uf.union(w.from,w.to);
  for(const c of this.comps.values())for(const grp of c.bridges??[]){const ks=grp.map(t=>tkey(c.id,t)).filter(k=>this.terms.has(k));for(const k of ks.slice(1))uf.union(ks[0],k)}
  for(const sel of this.selectors){
   if(skip.has(sel.comp!))continue;
   for(const st of sel.states)for(const p of st.connect??[]){const ka=tkey(sel.comp!,p[0]),kb=tkey(sel.comp!,p[1]);if(this.terms.has(ka)&&this.terms.has(kb))uf.union(ka,kb)}
  }
  return uf;
 }
 private srcRoots(f:(x:string)=>string,roles:Set<string>){return new Set(this.taps.flatMap(tp=>(tp.terminals??[]).filter(t=>roles.has(t.role)).map(t=>f(tkey(tp.id,t.id)))))}

 simulate(combo:Combo):StateSim{
  this.run(); // a kiértékelés sorrendje (és vele a hibalista) a sim.py-éval azonos marad
  const conducting:[string,string][]=[];
  const {uf,L,lamps,ext}=this.evalCombo(combo,()=>{},conducting);
  const nets=uf.groups(),f=uf.find;
  const live=nets.filter(n=>L.has(f(n[0])));
  // Áramot vivő hálózatok: a működő fogyasztók, a feszültség alatti dugaljak és az áramot vezető impedanciák (érintés, hibahely,
  // próbaellenállás) kapcsainak hálózatai. A dugalj csak akkor, ha fogyasztó csatlakozik rá (a zsinóron át): a fogyasztó maga áramot vesz fel.
  const roots=new Set<string>();
  // Áramkapcsok (pathWires): a táppont kapcsai, a működő fogyasztók L/N kapcsai, a vezető elemek kapcsai és a föld (ebben a
  // modellben a földön át a táppontig vezető visszaút nincs megrajzolva, a föld kapcsa ezért a hurok vége).
  const terms:string[]=[...this.taps,...[...this.comps.values()].filter(c=>c.type==='fold')].flatMap(tp=>(tp.terminals??[]).map(t=>tkey(tp.id,t.id)));
  for(const ld of this.loads)if(lamps[ld.id])for(const t of ld.terminals)if(t.role==='L'||t.role==='N'){roots.add(f(tkey(ld.id,t.id)));terms.push(tkey(ld.id,t.id))}
  for(const [a,b] of conducting){
   const ca=this.termComp.get(a),cb=this.termComp.get(b);
   if(ca&&OUTLET_TYPES.has(ca.type)&&cb&&OUTLET_TYPES.has(cb.type))continue;
   roots.add(f(a));roots.add(f(b));terms.push(a,b);
  }
  const current=nets.filter(n=>roots.has(f(n[0])));
  return {outputs:{lamps,...ext},nets,live,current,currentWires:pathWires(this.data.wires??[],this.innerLinks(combo),new Set(),f,current,terms)};
 }
}

const sameRecord=(a:Record<string,unknown>|undefined,b:Record<string,unknown>|undefined)=>{
 if(!a||!b)return a===b;
 const ka=Object.keys(a),kb=Object.keys(b);
 return ka.length===kb.length&&ka.every(k=>has(b,k)&&a[k]===b[k]);
};
const pyDict=(o:Record<string,unknown>|undefined)=>o===undefined?'None':'{'+Object.entries(o).map(([k,v])=>repr(k)+': '+repr(v)).join(', ')+'}';

// ---------------------------------------------------------------- Földelési netlisták (foldeles_ext.py)
const SYSTEMS=['TN-C','TN-S','TN-C-S','TT','IT'];
export const SOIL='__talaj__';
const PHASE_ROLES=['L1','L2','L3'];
export const ROLE_CLASS_E:Readonly<Record<string,string>>={L:'fazis',L1:'fazis',L2:'fazis',L3:'fazis',N:'nulla',PE:'pe',PEN:'pen',FK:'foldelo',E:'fold',idegen:'idegen'};
export const CONDUCTORS_E:Readonly<Record<string,readonly [string,ReadonlySet<string>]>>={
 L:['fazis',new Set(['barna','fekete','szürke'])],L1:['fazis',new Set(['barna'])],L2:['fazis',new Set(['fekete'])],L3:['fazis',new Set(['szürke'])],
 N:['nulla',new Set(['kék'])],PE:['pe',new Set(['zöld-sárga'])],PEN:['pen',new Set(['zöld-sárga','kék'])],'földelővezető':['foldelovezeto',new Set(['zöld-sárga'])],
 'EPH-vezető':['eph',new Set(['zöld-sárga'])],
};
const VIRTUAL_E=new Set(['hibahely','érintés','belső']);
const T_LOADS=new Set(['fogyaszto','lampa']),T_OCPD=new Set(['kismegszakito']),T_RCD=new Set(['fi-rele']),T_FAULT=new Set(['hibaut']);
const T_ELECTRODE=new Set(['foldelo']),T_EARTH=new Set(['fold']),T_EXTRANEOUS=new Set(['idegen']),T_IMD=new Set(['szigetelesfigyelo']);
const T_SPLIT='pen-szetvalaszto',T_PENTERM='pen-kapocs';
const T_PASSIVE=new Set([T_SPLIT,T_PENTERM,'pe-sin','n-sin','fofoldelo-sin','kotodoboz','sorkapocs','kotoelem']);
const KNOWN_E=new Set(['tap',...T_LOADS,...T_OCPD,...T_RCD,...T_FAULT,...T_ELECTRODE,...T_EARTH,...T_EXTRANEOUS,...T_IMD,...T_PASSIVE]);
const NOT_WITH_PHASE=new Set(['nulla','pe','pen','foldelo','fold','idegen']);
export const OUT_KEYS=['lamps','consumers','loops','trips','overcurrent','imd','touch'] as const;

/** Áramút-feltétel (foldeles_ext.py carrying): azok az élek, amelyeken át egyszerű út vezet két különböző címkéjű forráscsomópont között. */
export function carrying(labels:Map<string,string>,edges:readonly [string,string,string][]):Set<string>{
 const adj=new Map<string,[string,string][]>();
 for(const [eid,u,v] of edges){
  if(u===v)continue;
  if(!adj.has(u))adj.set(u,[]);adj.get(u)!.push([eid,v]);
  if(!adj.has(v))adj.set(v,[]);adj.get(v)!.push([eid,u]);
 }
 const res=new Set<string>();
 const dfs=(node:string,lab:string,visited:Set<string>,path:string[])=>{
  for(const [eid,w] of adj.get(node)??[]){
   if(visited.has(w))continue;
   if(labels.has(w)){if(labels.get(w)!==lab){for(const p of path)res.add(p);res.add(eid)}continue}
   visited.add(w);path.push(eid);
   dfs(w,lab,visited,path);
   path.pop();visited.delete(w);
  }
 };
 for(const [s,lab] of labels)dfs(s,lab,new Set([s]),[]);
 return res;
}

class EarthingNetlist extends Base{
 readonly kind='earthing' as const;
 system:string|undefined;
 cls=new Map<string,string|undefined>();
 ocpds:NlComponent[]=[];rcds:NlComponent[]=[];faults:NlComponent[]=[];electrodes:NlComponent[]=[];extraneous:NlComponent[]=[];imds:NlComponent[]=[];
 splits:NlComponent[]=[];penterms:NlComponent[]=[];
 star:string|null=null;
 breakWire=new Map<string,string>();
 touch:NlTouch[]=[];
 constructor(data:Netlist){super(data);this.structure()}

 private structure(){
  const d=this.data;
  this.system=d.earthing?.system;
  for(const k of ['id','title','components','wires','truthTable'])if(!has(d,k))this.err('S0','hiányzó mező: '+k);
  if((d.format??NETLIST_FORMAT)!==NETLIST_FORMAT)this.warnings.push('ismeretlen formátum: '+d.format);
  if(!SYSTEMS.includes(this.system as string))this.err('E1','ismeretlen földelési rendszer: '+repr(this.system)+' (várt: '+SYSTEMS.join(', ')+')');
  for(const c of d.components??[]){
   const cid=c.id;
   if(!cid||this.comps.has(cid)||String(cid).includes('.')){this.err('S1','hiányzó, ismétlődő vagy pontot tartalmazó komponens-id: '+repr(cid));continue}
   this.comps.set(cid,c);
   if(!KNOWN_E.has(c.type))this.warnings.push('ismeretlen komponenstípus: '+cid+' ('+c.type+')');
   const seen=new Set<string>();
   for(const t of c.terminals??[]){
    const tid=t.id;
    if(!tid||seen.has(tid)){this.err('S1','hiányzó vagy ismétlődő kapocs-id: '+cid+'.'+tid);continue}
    seen.add(tid);
    if(!has(ROLE_CLASS_E,t.role))this.err('S2','ismeretlen kapocsszerep: '+cid+'.'+tid+' ('+t.role+')');
    this.terms.set(tkey(cid,tid),t);this.termComp.set(tkey(cid,tid),c);
   }
   for(const grp of c.bridges??[])for(const t of grp)if(!this.terms.has(tkey(cid,t)))this.err('S1','ismeretlen kapocs a belső összeköttetésben: '+cid+'.'+t);
  }
  for(const [k,t] of this.terms)this.cls.set(k,ROLE_CLASS_E[t.role]);
  const byt=(ts:Set<string>)=>[...this.comps.values()].filter(c=>ts.has(c.type));
  this.taps=byt(new Set(['tap']));this.loads=byt(T_LOADS);
  this.ocpds=byt(T_OCPD);this.rcds=byt(T_RCD);this.faults=byt(T_FAULT);
  this.electrodes=byt(T_ELECTRODE);this.extraneous=byt(T_EXTRANEOUS);this.imds=byt(T_IMD);
  this.splits=byt(new Set([T_SPLIT]));this.penterms=byt(new Set([T_PENTERM]));
  this.buildSelectors();
  this.checkComponents();
  this.checkWires();
  for(const tp of d.touch??[]){
   if(!tp.id||!this.terms.has(tp.a)||!this.terms.has(tp.b)){this.err('S8','hibás érintési pont: '+JSON.stringify(tp));continue}
   this.touch.push(tp);
  }
  this.allPole=new Set();
 }
 private buildSelectors(){
  for(const c of this.comps.values()){
   if(c.keys&&c.keys.length)this.err('S6',c.id+': a földelési netlistában nincs többbillentyűs választó');
   if(c.states===undefined||c.states===null){
    if(T_FAULT.has(c.type)||(c.type??'').startsWith(SWITCH_PREFIX)||T_OCPD.has(c.type)||T_RCD.has(c.type))this.err('S6',c.id+': hiányzó állapotok (states)');
    continue;
   }
   const states=c.states,names=states.map(s=>s.name);
   if(!states.length||new Set(names).size!==names.length||names.some(n=>n===undefined||n===null)){this.err('S6',c.id+': üres vagy ismétlődő állapotnevek');continue}
   for(const s of states)for(const pair of s.connect??[])if(pair.length!==2||pair.some(t=>!this.terms.has(tkey(c.id,t))))this.err('S6',c.id+'/'+s.name+': hibás kapocspár '+pyList(pair));
   const scen=T_FAULT.has(c.type)||!!c.scenario;
   if(T_FAULT.has(c.type)){
    if(states.some(s=>typeof s.active!=='boolean'))this.err('S6',c.id+': a hibahely állapotainak active (igen/nem) mező kell');
    else if(states[0].active)this.err('E5',c.id+': a hibahely első (normál) állapota nem lehet aktív');
   }
   this.selectors.push({id:c.id,comp:c.id,key:null,states,label:c.label??c.id,scenario:scen,kind:'comp'});
  }
  const wids=new Set((this.data.wires??[]).map((w,i)=>w.id||'#'+(i+1)));
  for(const b of this.data.breaks??[]){
   const bid=b.id,states=b.states??[],names=states.map(s=>s.name);
   if(!bid||this.comps.has(bid)||this.selectors.some(s=>s.id===bid)){this.err('S6','szakadás: hiányzó vagy ütköző azonosító '+repr(bid));continue}
   if(!wids.has(b.wire)){this.err('S6',bid+': ismeretlen vezeték '+repr(b.wire));continue}
   if(states.length<2||new Set(names).size!==names.length||names.some(n=>n===undefined||n===null)){this.err('S6',bid+': legalább két, egyedi nevű állapot kell');continue}
   if(states[0].broken)this.err('E5',bid+': az első (normál) állapot nem lehet szakadt');
   if(!states.some(s=>s.broken))this.err('S6',bid+': nincs szakadt állapot');
   this.breakWire.set(bid,b.wire);
   this.selectors.push({id:bid,comp:null,key:null,states,label:b.label??bid,scenario:true,kind:'break'});
  }
 }
 private checkComponents(){
  const sys=this.system;
  if(this.taps.length!==1){this.err('S5','pontosan egy táppont (tap) kell, van: '+this.taps.length);this.star=null}
  else{
   const tp=this.taps[0],roles=(tp.terminals??[]).map(t=>t.role),stars=(tp.terminals??[]).filter(t=>t.role==='N'||t.role==='PEN');
   if(!roles.some(r=>PHASE_ROLES.includes(r)))this.err('S5',tp.id+': a táppontnak fázis kapcsa (L1/L2/L3) kell');
   if(stars.length!==1){this.err('S5',tp.id+': pontosan egy csillagpont-kapocs (N vagy PEN) kell');this.star=null}
   else{
    this.star=tkey(tp.id,stars[0].id);
    const want=sys==='TN-C'||sys==='TN-C-S'?'PEN':'N';
    if(stars[0].role!==want)this.err('E1',sys+': a táppont csillagpont-kapcsának szerepe '+want+' legyen ('+this.star+')');
    const pes=tp.terminals.filter(t=>t.role==='PE');
    if(sys==='TN-S'){if(pes.length!==1||!(tp.bridges??[]).some(g=>g.includes(stars[0].id)&&g.includes(pes[0].id)))this.err('E1','TN-S: a táppontnál a PE a csillagpontban (híddal) kapcsolódik az N-hez')}
    else if(pes.length)this.err('E1',sys+': a táppontnak nincs külön PE-kapcsa');
   }
  }
  for(const ld of this.loads){
   const roles=(ld.terminals??[]).map(t=>t.role),act=roles.filter(r=>ROLE_CLASS_E[r]==='fazis'||ROLE_CLASS_E[r]==='nulla');
   if(act.length<2||!act.some(r=>ROLE_CLASS_E[r]==='fazis'))this.err('S5',ld.id+': a fogyasztónak legalább két aktív kapcsa kell, köztük fázis');
   if(ld.class!=='II'&&roles.filter(r=>r==='PE').length!==1)this.err('E3',ld.id+': I. osztályú (fémházas) fogyasztó PE-kapocs nélkül');
  }
  for(const c of this.faults){
   const ts=c.terminals??[];
   if(ts.length!==2||this.cls.get(tkey(c.id,ts[0].id))!=='fazis'||this.cls.get(tkey(c.id,ts[1].id))!=='pe')this.err('S7',c.id+': a testzárlat két kapcsa: fázisoldali (a) és fémház (PE, b)');
  }
  for(const c of this.electrodes)if(JSON.stringify((c.terminals??[]).map(t=>t.role))!=='["FK"]')this.err('S7',c.id+': a földelőnek egy kapcsa van (FK)');
  for(const c of this.extraneous)if(JSON.stringify((c.terminals??[]).map(t=>t.role))!=='["idegen"]')this.err('S7',c.id+': az idegen vezetőképes résznek egy kapcsa van (idegen)');
  for(const c of [...this.splits,...this.penterms]){
   const roles=(c.terminals??[]).map(t=>t.role).sort();
   if(JSON.stringify(roles)!=='["N","PE","PEN"]'||!(c.bridges??[]).some(g=>g.length===3))this.err('S7',c.id+': PEN-, N- és PE-kapocs kell, egy belső összeköttetéssel');
  }
  for(const sel of this.selectors){
   if(sel.kind!=='comp'||sel.scenario)continue;
   const c=this.comps.get(sel.comp!)!;
   for(const s of sel.states)for(const pair of s.connect??[]){
    const cl=new Set(pair.map(t=>this.cls.get(tkey(c.id,t))));
    if(cl.has('pe')||cl.has('pen'))this.err('E2',c.id+'/'+s.name+': a kapcsolókészülék a védővezetőt vagy a PEN-t kapcsolja '+pyList(pair));
    else if(T_OCPD.has(c.type)&&!(cl.size===1&&cl.has('fazis')))this.err('E2',c.id+'/'+s.name+': a túláramvédelem csak fázisvezetőt bonthat '+pyList(pair));
    else if(cl.size!==1||![...cl].every(x=>x==='fazis'||x==='nulla'))this.err('E2',c.id+'/'+s.name+': eltérő szerepű kapcsok összekötése '+pyList(pair));
   }
  }
  for(const c of this.rcds){
   const poles=c.poles??[];
   if(!poles.length)this.err('S7',c.id+': az áram-védőkapcsolónak meg kell adni a pólusait');
   for(const p of poles){
    if(p.length!==2||p.some(t=>!this.terms.has(tkey(c.id,t)))){this.err('S7',c.id+': hibás pólus '+pyList(p));continue}
    const cl=new Set(p.map(t=>this.cls.get(tkey(c.id,t))));
    if(cl.has('pe')||cl.has('pen'))this.err('E2',c.id+': a PEN vagy a PE nem haladhat át az áram-védőkapcsolón '+pyList(p));
    else if(cl.size!==1)this.err('E2',c.id+': a pólus két kapcsa eltérő szerepű '+pyList(p));
   }
  }
 }
 private checkWires(){
  for(const s of this.data.sections??[]){if(this.sections.has(s.id))this.err('S4','ismétlődő szakasz: '+s.id);this.sections.set(s.id,s)}
  const seen=new Set<string>();
  (this.data.wires??[]).forEach((w,i)=>{
   const wid=w.id||'#'+(i+1);
   if(seen.has(wid))this.err('S3','ismétlődő vezeték-id: '+wid);
   seen.add(wid);
   if(!this.terms.has(w.from)||!this.terms.has(w.to)){this.err('S3',wid+': ismeretlen végpont');return}
   const cond=w.conductor,col=w.color,ca=this.cls.get(w.from),cb=this.cls.get(w.to);
   if(VIRTUAL_E.has(cond)){
    if((col!==undefined&&col!==null)||(w.section!==undefined&&w.section!==null))this.err('S3',wid+': a(z) „'+cond+'” kapcsolat nem valódi ér: nincs színe és szakasza');
    if(ca!==cb)this.err('E6',wid+': a(z) „'+cond+'” kapcsolat eltérő szerepű kapcsokat köt ('+w.from+', '+w.to+')');
    return;
   }
   if(!has(CONDUCTORS_E,cond)){this.err('S3',wid+': ismeretlen vezető '+repr(cond));return}
   const [kind,colors]=CONDUCTORS_E[cond];
   if(!colors.has(col as string))this.err('E6',wid+': '+cond+' vezető '+repr(col)+' színnel (megengedett: '+sortedStr(colors).join(', ')+')');
   const ends=new Set([ca,cb]);
   if(['fazis','nulla','pe','pen'].includes(kind)){if(!(ends.size===1&&ends.has(kind)))this.err('E6',wid+': '+cond+' vezető '+ca+'/'+cb+' szerepű kapcsokat köt ('+w.from+', '+w.to+')')}
   else if(kind==='foldelovezeto'){
    const other=[w.from,w.to].filter(k=>this.cls.get(k)!=='foldelo');
    if(other.length!==1)this.err('E6',wid+': a földelővezető egyik vége földelőkapocs, a másik nem');
    else{const o=other[0],ok=this.cls.get(o)==='pe'||this.cls.get(o)==='pen'||(this.cls.get(o)==='nulla'&&o===this.star);if(!ok)this.err('E6',wid+': a földelővezető csak PE-, PEN- vagy (a táppontnál) csillagpont-kapocsra köthető ('+o+')')}
   }else if(kind==='eph'){
    if(![...ends].every(x=>x==='pe'||x==='idegen')||!ends.has('pe'))this.err('E6',wid+': az EPH-vezető PE-kapcsot köt idegen vezetőképes részhez vagy PE-kapcsot PE-kapocshoz');
   }
   const compA=this.termComp.get(w.from)!,compB=this.termComp.get(w.to)!;
   if(compA===compB)this.err('S3',wid+': komponensen belüli vezeték (használj bridges mezőt)');
   if(this.sections.size){
    const la=compA.at??compA.id,lb=compB.at??compB.id,sec=w.section;
    if(la===lb){if(sec!==undefined&&sec!==null)this.err('S4',wid+': helyen belüli vezeték nem tartozhat szakaszhoz ('+sec+')')}
    else if(!sec||!this.sections.has(sec))this.err('S4',wid+': hiányzó vagy ismeretlen szakasz '+repr(sec));
    else{const s=this.sections.get(sec)!;if(!([s.from,s.to].every(x=>x===la||x===lb)&&[la,lb].every(x=>x===s.from||x===s.to)))this.err('S4',wid+': a szakasz ('+sec+') nem a vezeték két végét köti ('+la+'–'+lb+')')}
   }
  });
 }
 normal():Combo{return Object.fromEntries(this.selectors.map(s=>[s.id,s.states[0].name]))}
 private stateOf(sel:Selector,combo:Combo){return sel.states.find(s=>s.name===combo[sel.id])!}
 nets(combo:Combo,openComps:ReadonlySet<string>=new Set(),skipBridges:ReadonlySet<string>=new Set(),keepBroken=false):UF{
  const uf=new UF([...this.terms.keys(),SOIL]);
  const broken=new Set<string>();
  if(!keepBroken)for(const sel of this.selectors)if(sel.kind==='break'&&this.stateOf(sel,combo).broken)broken.add(this.breakWire.get(sel.id)!);
  (this.data.wires??[]).forEach((w,i)=>{
   if(broken.has(w.id||'#'+(i+1)))return;
   if(this.terms.has(w.from)&&this.terms.has(w.to))uf.union(w.from,w.to);
  });
  for(const c of this.comps.values()){
   if(!skipBridges.has(c.id))for(const grp of c.bridges??[]){const ks=grp.map(t=>tkey(c.id,t)).filter(k=>this.terms.has(k));for(const k of ks.slice(1))uf.union(ks[0],k)}
   if(T_EARTH.has(c.type))for(const t of c.terminals??[])uf.union(SOIL,tkey(c.id,t.id));
  }
  for(const sel of this.selectors){
   if(sel.kind!=='comp'||openComps.has(sel.comp!))continue;
   for(const p of this.stateOf(sel,combo).connect??[]){const ka=tkey(sel.comp!,p[0]),kb=tkey(sel.comp!,p[1]);if(this.terms.has(ka)&&this.terms.has(kb))uf.union(ka,kb)}
  }
  return uf;
 }
 labels(f:(x:string)=>string,combo?:string,viol?:Viol):Map<string,string>{
  const labels=new Map<string,string>();
  if(!this.taps.length)return labels;
  const tp=this.taps[0];
  for(const t of tp.terminals??[]){
   const r=t.role,lab=PHASE_ROLES.includes(r)?r:r==='L'?'L1':'0',n=f(tkey(tp.id,t.id));
   if(labels.has(n)&&labels.get(n)!==lab&&viol)viol('E4','zárlat vezetőkkel: '+labels.get(n)+'–'+lab+' egy hálózaton ('+combo+')');
   if(!labels.has(n))labels.set(n,lab);
  }
  return labels;
 }
 elements(combo:Combo,f:(x:string)=>string):El[]{
  const els:El[]=[];
  for(const ld of this.loads){
   const act=(ld.terminals??[]).filter(t=>ROLE_CLASS_E[t.role]==='fazis'||ROLE_CLASS_E[t.role]==='nulla').map(t=>tkey(ld.id,t.id));
   const hub='@'+ld.id;
   els.push({id:ld.id,kind:'load',terms:act,edges:act.map((k,i)=>[ld.id+'#'+i,hub,f(k)] as [string,string,string])});
  }
  for(const c of this.faults){
   const sel=this.selectors.find(s=>s.comp===c.id)!;
   if(!this.stateOf(sel,combo).active)continue;
   const [a,b]=c.terminals.map(t=>tkey(c.id,t.id));
   els.push({id:c.id,kind:'fault',terms:[a,b],a,b,edges:[[c.id,f(a),f(b)]]});
  }
  for(const c of [...this.electrodes,...this.extraneous.filter(x=>x.earthContact)]){
   const k=tkey(c.id,c.terminals[0].id);
   els.push({id:c.id,kind:'electrode',terms:[k,SOIL],edges:[[c.id,f(k),f(SOIL)]]});
  }
  return els;
 }
 private static edges(els:readonly El[],kinds?:ReadonlySet<string>){return els.filter(el=>!kinds||kinds.has(el.kind)).flatMap(el=>el.edges)}
 rcdTrip(combo:Combo,rcd:NlComponent,carryingIds:ReadonlySet<string>,els:readonly El[],viol?:Viol,tag=''):boolean{
  const sel=this.selectors.find(s=>s.comp===rcd.id);
  const closed=new Set<string>();for(const p of sel?this.stateOf(sel,combo).connect??[]:[]){closed.add(p[0]+'\u0000'+p[1]);closed.add(p[1]+'\u0000'+p[0])}
  const poles=(rcd.poles??[]).map(p=>[p[0],p[1]] as [string,string]);
  if(!poles.length||!poles.every(p=>closed.has(p[0]+'\u0000'+p[1])))return false;
  const zf=this.nets(combo,new Set([rcd.id])).find;
  const zone=new Set(poles.map(([,ld])=>zf(tkey(rcd.id,ld)))),supply=new Set(poles.map(([sp])=>zf(tkey(rcd.id,sp))));
  const srcs=this.taps.length?this.taps[0].terminals.map(t=>tkey(this.taps[0].id,t.id)):[];
  const bypass=[...zone].some(z=>supply.has(z))||srcs.some(s=>zone.has(zf(s)))||zone.has(zf(SOIL));
  if(bypass&&viol)viol('E7',rcd.id+': a védett oldal a FI-relé pólusait megkerülve is a táp oldallal vagy a földdel érintkezik ('+tag+')');
  for(const el of els){
   if(!carryingIds.has(el.id))continue;
   const inside=new Set(el.terms.map(t=>zone.has(zf(t))));
   if(inside.size>1||(bypass&&inside.has(true)))return true;
  }
  return false;
 }
 touchHazard(combo:Combo,tp:NlTouch,open:ReadonlySet<string>=new Set()):{haz:boolean;cidP:Set<string>;elsP:El[]}{
  const f=this.nets(combo,open).find,labels=this.labels(f),els=this.elements(combo,f);
  const cur=carrying(labels,EarthingNetlist.edges(els));
  const carryingIds=new Set(els.filter(el=>el.edges.some(e=>cur.has(e[0]))).map(el=>el.id));
  const na=f(tp.a),nb=f(tp.b);
  const person:El={id:'@ember',kind:'person',terms:[tp.a,tp.b],edges:[['@ember',na,nb]]};
  const elsP=[...els,person];
  const curP=carrying(labels,EarthingNetlist.edges(elsP));
  const through=curP.has('@ember');
  const inFaultPath=els.some(el=>el.kind==='fault'&&carryingIds.has(el.id)&&(f(el.b!)===na||f(el.b!)===nb));
  const cidP=new Set(elsP.filter(el=>el.edges.some(e=>curP.has(e[0]))).map(el=>el.id));
  return {haz:through||inFaultPath,cidP,elsP};
 }
 evaluate(combo:Combo,viol?:Viol):{out:NlOutputs;labels:Map<string,string>;f:(x:string)=>string;cur:Set<string>;els:El[]}{
  const tag=Object.entries(combo).map(([k,v])=>k+'='+v).join(', ')||'(nincs választó)';
  const f=this.nets(combo).find;
  if(viol){
   const groups=new Map<string,Set<string|undefined>>();
   for(const k of this.terms.keys()){const r=f(k);if(!groups.has(r))groups.set(r,new Set());groups.get(r)!.add(this.cls.get(k))}
   const soilRoot=f(SOIL);
   for(const [root,cl] of groups){
    const inter=[...cl].filter(x=>x!==undefined&&NOT_WITH_PHASE.has(x)) as string[];
    if(cl.has('fazis')&&(inter.length||root===soilRoot)){const other=inter.length?sortedStr(inter):['talaj'];viol('E4','zárlat vezetőkkel: fázisvezető és '+other.join('/')+' szerepű kapocs egy hálózaton ('+tag+')')}
   }
  }
  const labels=this.labels(f,tag,viol),els=this.elements(combo,f);
  const cur=carrying(labels,EarthingNetlist.edges(els));
  const carryingIds=new Set(els.filter(el=>el.edges.some(e=>cur.has(e[0]))).map(el=>el.id));
  const out:NlOutputs={};
  if(this.loads.length){
   const lamps:Record<string,boolean>={},cons:Record<string,string>={};
   for(const ld of this.loads){
    const el=els.find(e=>e.id===ld.id)!;
    const labs=el.terms.map(k=>labels.get(f(k)));
    const works=!labs.includes(undefined)&&new Set(labs).size===labs.length;
    lamps[ld.id]=works;
    cons[ld.id]=works?'mukodik':carryingIds.has(ld.id)?'rendellenes':'nem-mukodik';
   }
   out.lamps=lamps;out.consumers=cons;
  }
  const faultsOn=els.filter(el=>el.kind==='fault');
  const metal=carrying(labels,EarthingNetlist.edges(els,new Set(['fault'])));
  const earthy=carrying(labels,EarthingNetlist.edges(els,new Set(['fault','electrode'])));
  if(this.faults.length){
   const loops:Record<string,string>={};
   for(const c of this.faults)loops[c.id]=!faultsOn.some(el=>el.id===c.id)?'nincs-hiba':metal.has(c.id)?'femes':earthy.has(c.id)?'fold':'nincs-hurok';
   out.loops=loops;
  }
  const oc:Record<string,boolean>={};
  for(const dev of this.ocpds){
   const sel=this.selectors.find(s=>s.comp===dev.id)!;
   let hit=false;
   if((this.stateOf(sel,combo).connect??[]).length){
    const fo=this.nets(combo,new Set([dev.id])).find,labO=this.labels(fo),elsO=this.elements(combo,fo);
    const metalO=carrying(labO,EarthingNetlist.edges(elsO,new Set(['fault'])));
    hit=Object.entries(out.loops??{}).some(([fid,v])=>v==='femes'&&!metalO.has(fid));
   }
   oc[dev.id]=hit;
  }
  if(Object.keys(oc).length)out.overcurrent=oc;
  const trips:Record<string,boolean>={};
  for(const r of this.rcds)trips[r.id]=this.rcdTrip(combo,r,carryingIds,els,viol,tag);
  if(Object.keys(trips).length)out.trips=trips;
  if(this.imds.length){
   const ins=faultsOn.some(el=>{const la=labels.get(f(el.a!));return la!==undefined&&(PHASE_ROLES.includes(la)||la==='0')&&labels.get(f(el.b!))===undefined});
   out.imd=Object.fromEntries(this.imds.map(c=>[c.id,ins]));
  }
  if(this.touch.length){
   const auto=[...Object.entries(oc).filter(([,v])=>v).map(([k])=>k),...Object.entries(trips).filter(([,v])=>v).map(([k])=>k)];
   const tv:Record<string,string>={};
   for(const tp of this.touch){
    const {haz,cidP,elsP}=this.touchHazard(combo,tp);
    if(!haz)tv[tp.id]='nincs';
    else if(auto.some(dv=>!this.touchHazard(combo,tp,new Set([dv])).haz))tv[tp.id]='lekapcsolasig';
    else if(this.rcds.some(r=>!auto.includes(r.id)&&this.rcdTrip(combo,r,cidP,elsP)&&!this.touchHazard(combo,tp,new Set([r.id])).haz))tv[tp.id]='erintesre';
    else tv[tp.id]='tartosan';
   }
   out.touch=tv;
  }
  return {out,labels,f,cur,els};
 }
 systemChecks():string[]{
  if(this.errors.length||this.star===null)return [];
  const ok:string[]=[],sys=this.system!,norm=this.normal(),f=this.nets(norm).find,star=f(this.star),soil=f(SOIL);
  const elK=new Map(this.electrodes.map(c=>[c.id,f(tkey(c.id,c.terminals[0].id))]));
  const elVals=new Set(elK.values());
  const body=new Map<string,string>();for(const ld of this.loads)for(const t of ld.terminals)if(t.role==='PE')body.set(ld.id,f(tkey(ld.id,t.id)));
  const penWires=(this.data.wires??[]).filter(w=>w.conductor==='PEN');
  if(star===soil)this.err('E1','a csillagpont vezetővel a talajhoz kötött (földelőn át kell)');
  if(['TN-C','TN-S','TN-C-S','TT'].includes(sys)){
   if(elVals.has(star))ok.push('a csillagpont közvetlenül földelt (üzemi földelő)');
   else this.err('E1',sys+': a táppont csillagpontja nincs közvetlenül földelve');
  }else{
   if(elVals.has(star)||[...this.terms.keys()].some(k=>this.cls.get(k)==='pe'&&f(k)===star))this.err('E1','IT: a csillagpont nem lehet közvetlenül földelve vagy a védővezetőhöz kötve');
   else ok.push('a csillagpont nincs közvetlenül földelve');
  }
  if(sys.startsWith('TN')){
   const bad=[...body].filter(([,n])=>n!==star).map(([l])=>l);
   if(bad.length)this.err('E1',sys+': a fémház nincs vezetőn át a csillagponthoz kötve: '+bad.join(', '));
   else if(body.size)ok.push('minden fémház vezetőn át a csillagponthoz kötött');
  }else{
   const bad=[...body].filter(([,n])=>n===star||!elVals.has(n)).map(([l])=>l);
   if(bad.length)this.err('E1',sys+': a fémház nem a helyi földelőn van, vagy a csillagponthoz kötött: '+bad.join(', '));
   else if(body.size)ok.push('a fémházak védővezetője helyi földelőn van, vezetőn át nem kapcsolódik a csillagponthoz');
  }
  const placesOf=(w:NlWire)=>{const a=this.termComp.get(w.from)!,b=this.termComp.get(w.to)!;return new Set([a.at??a.id,b.at??b.id])};
  if(sys==='TN-C'){
   if(!penWires.length||this.splits.length||!this.penterms.length)this.err('E1','TN-C: PEN-vezető és a fogyasztónál PEN-kapocs kell, PEN-szétválasztási pont nélkül');
   const cross=(this.data.wires??[]).filter(w=>(w.conductor==='N'||w.conductor==='PE')&&placesOf(w).size>1).map(w=>w.id);
   if(cross.length)this.err('E1','TN-C: külön nulla- vagy védővezető nem futhat két hely között: '+pyList(cross));
   const loadPlaces=new Set(this.loads.map(ld=>ld.at??ld.id));
   if(this.penterms.some(c=>!loadPlaces.has(c.at??c.id)))this.err('E1','TN-C: a PEN-kapocs a fogyasztó csatlakozásánál van');
   if(!this.errors.length)ok.push('a PEN-vezető a táppontól a fogyasztó csatlakozásáig fut, külön nulla- és védővezető nélkül');
  }else if(sys==='TN-C-S'){
   if(this.splits.length!==1||this.penterms.length)this.err('E1','TN-C-S: pontosan egy PEN-szétválasztási pont kell');
   else{
    const sp=this.splits[0],g=this.nets(norm,new Set(),new Set([sp.id])).find;
    const pick=(r:string)=>sp.terminals.filter(t=>t.role===r).map(t=>g(tkey(sp.id,t.id)));
    const [pen,n,pe]=[...pick('PEN'),...pick('N'),...pick('PE')];
    const st=g(this.star);
    if(pen!==st)this.err('E1','TN-C-S: a szétválasztási pont PEN-kapcsa nem a csillagpontról kapja a PEN-t');
    if(n===pe)this.err('E1','TN-C-S: a szétválasztás után a nulla- és a védővezető újra egyesül');
    if(st===n||st===pe)this.err('E1','TN-C-S: a szétválasztás után a nulla- vagy a védővezető a szétválasztási pontot megkerülve is a csillagponthoz kötött');
    if(penWires.some(w=>g(w.from)!==st||g(w.to)!==st))this.err('E1','TN-C-S: PEN-vezető a szétválasztási pont után is van');
    const ws=this.data.wires??[];
    if(!ws.some(w=>w.conductor==='N'&&placesOf(w).size>1)||!ws.some(w=>w.conductor==='PE'&&placesOf(w).size>1))this.err('E1','TN-C-S: a szétválasztás után külön nulla- és védővezető fut');
    if(!this.errors.length)ok.push('a PEN-vezető egyetlen ponton válik szét, utána a nulla- és a védővezető nem egyesül újra');
   }
  }else if(sys==='TN-S'){
   if(penWires.length||this.splits.length||this.penterms.length)this.err('E1','TN-S: nincs PEN-vezető és PEN-szétválasztás');
   const tp=this.taps[0],g=this.nets(norm,new Set(),new Set([tp.id])).find;
   const tn=tp.terminals.filter(t=>t.role==='N').map(t=>g(tkey(tp.id,t.id))),tpe=tp.terminals.filter(t=>t.role==='PE').map(t=>g(tkey(tp.id,t.id)));
   if(tn.length&&tpe.length&&tn[0]===tpe[0])this.err('E1','TN-S: a nulla- és a védővezető a táppont után is össze van kötve');
   else if(!this.errors.length)ok.push('a nulla- és a védővezető csak a csillagpontban kapcsolódik, külön fut a fogyasztóig');
  }else if(penWires.length||this.splits.length||this.penterms.length)this.err('E1',sys+': nincs PEN-vezető');
  if(sys==='IT'&&!this.imds.length)this.warnings.push('IT: nincs szigetelésfigyelő a netlistában');
  for(const c of this.extraneous)if(c.bonded){
   const k=f(tkey(c.id,c.terminals[0].id));
   if(![...this.terms.keys()].some(x=>this.cls.get(x)==='pe'&&f(x)===k))this.err('E1',c.id+': az idegen vezetőképes rész normál állapotban nincs az EPH-hoz kötve');
   else if(!ok.includes('az idegen vezetőképes részek EPH-val a védővezető-rendszerhez kötöttek'))ok.push('az idegen vezetőképes részek EPH-val a védővezető-rendszerhez kötöttek');
  }
  return ok;
 }
 protected compute():CircuitReport{
  const d=this.data;
  const rep:CircuitReport={id:d.id,fingerprint:netlistFingerprint(d),system:this.system,selectors:this.selectors.map(s=>({id:s.id,label:s.label,states:s.states.map(x=>x.name)})),
   loads:this.loads.map(l=>l.id),rows:[],errors:this.errors,warnings:this.warnings,combinations:0,toggle:Object.fromEntries(this.loads.map(l=>[l.id,{}])),sections:[],pass:false};
  if(this.errors.some(e=>/^\[(S0|S1|S2|S5|S6|S7|S8)\]/.test(e)))return rep;
  rep.verified=this.systemChecks();
  const violations=new Set<string>();
  const viol:Viol=(code,msg)=>{violations.add('['+code+'] '+msg)};
  const selIds=this.selectors.map(s=>s.id);
  const expected=new Map<string,NlTruthRow>();
  (d.truthTable??[]).forEach((row,i)=>{
   const st=row.states??{};
   if(!(Object.keys(st).length===selIds.length&&Object.keys(st).every(x=>selIds.includes(x)))||selIds.some(s=>!this.selectors.find(q=>q.id===s)!.states.some(x=>x.name===st[s]))){this.err('I10','truthTable['+i+']: hibás vagy hiányos állapotmegadás '+pyDict(st));return}
   const key=JSON.stringify(selIds.map(s=>st[s]));
   if(expected.has(key))this.err('I10','truthTable['+i+']: ismétlődő sor ('+selIds.map(s=>repr(st[s])).join(', ')+(selIds.length===1?',':'')+')');
   expected.set(key,row);
  });
  let n=0;
  const normal=this.normal();
  for(const combo of this.combos()){
   n++;
   const {out}=this.evaluate(combo,viol);
   const row:SimRow={states:combo,...out,ok:true};
   const key=JSON.stringify(selIds.map(s=>combo[s]));
   const exp=expected.get(key);
   if(exp===undefined){this.err('I10','truthTable: hiányzó sor ('+pyDict(combo)+')');row.ok=false}
   else{
    row.expected=Object.fromEntries(OUT_KEYS.filter(k=>has(exp,k)||has(out,k)).map(k=>[k,exp[k]??null]));
    row.ok=true;
    for(const k of OUT_KEYS){
     if(has(out,k)!==has(exp,k)){row.ok=false;this.err('I10','truthTable ('+pyDict(combo)+'): a(z) „'+k+'” kulcs '+(has(out,k)?'hiányzik':'fölösleges'))}
     else if(has(out,k)&&!sameRecord(exp[k] as Record<string,unknown>,out[k] as Record<string,unknown>)){row.ok=false;this.err('I10','eltérés a truthTable-től ('+pyDict(combo)+'): '+k+' várt '+pyDict(exp[k] as Record<string,unknown>)+', szimulált '+pyDict(out[k] as Record<string,unknown>))}
    }
   }
   if(selIds.every(s=>combo[s]===normal[s])){
    const bad=[...Object.entries(out.consumers??{}).filter(([,v])=>v!=='mukodik').map(([k])=>k),...Object.entries(out.loops??{}).filter(([,v])=>v!=='nincs-hiba').map(([k])=>k),
     ...(['trips','overcurrent','imd'] as const).flatMap(k=>Object.values(out[k]??{}).filter(Boolean).map(()=>k)),...Object.entries(out.touch??{}).filter(([,v])=>v!=='nincs').map(([k])=>k)];
    if(bad.length)viol('E5','normál állapotban rendellenes kimenet: '+bad.join(', '));
   }
   rep.rows.push(row);
  }
  if(expected.size>n)this.err('I10','a truthTable-ben nem létező állás is szerepel');
  this.errors.push(...violations);
  rep.combinations=n;
  rep.sections=this.sectionReport();
  rep.pass=!this.errors.length;
  return rep;
 }
 simulate(combo:Combo):StateSim{
  this.run();
  const {out,labels,f,cur,els}=this.evaluate(combo);
  const uf=this.nets(combo),nets=uf.groups();
  const live=nets.filter(n=>{const l=labels.get(f(n[0]));return l!==undefined&&PHASE_ROLES.includes(l)});
  const roots=new Set<string>(),terms:string[]=this.taps.flatMap(tp=>(tp.terminals??[]).map(t=>tkey(tp.id,t.id)));
  for(const el of els)if(el.edges.some(e=>cur.has(e[0])))for(const t of el.terms){roots.add(f(t));terms.push(t)}
  const current=nets.filter(n=>roots.has(f(n[0])));
  const broken=new Set(this.selectors.filter(sel=>sel.kind==='break'&&this.stateOf(sel,combo).broken).map(sel=>this.breakWire.get(sel.id)!));
  const inner=[...this.innerLinks(combo),...[...this.comps.values()].filter(c=>T_EARTH.has(c.type)).flatMap(c=>(c.terminals??[]).map(t=>[tkey(c.id,t.id),SOIL] as [string,string]))];
  return {outputs:out,nets,live,current,currentWires:pathWires(this.data.wires??[],inner,broken,uf.find,current,terms)};
 }
}

// ---------------------------------------------------------------- Nyilvános felület
export type Circuit=BasicNetlist|EarthingNetlist;

/** Betöltés és szerkezeti ellenőrzés (sim.py load): az „earthing” mezős netlista a földelési bővítéssel, a többi az alapszimulátorral. */
export function loadNetlist(data:Netlist):Circuit{
 if(data&&typeof data==='object'&&data.earthing)return new EarthingNetlist(data);
 return new BasicNetlist(data);
}
/** A teljes kiértékelés (sim.py run): minden állapotkombináció, az igazságtábla összevetése, az invariánsok, a váltó-tulajdonság, a szakaszok. */
export const runNetlist=(c:Circuit)=>c.run();
/** Egy állás szimulációja (union-find): fogyasztónként áram alatt van-e, a hálózatok és az energizált (fázis alatti) hálózatok. */
export function simulate(c:Circuit,state:Combo):StateSim{
 const combo:Combo={};
 for(const s of c.selectors){
  const v=state[s.id]??s.states[0].name;
  if(!s.states.some(x=>x.name===v))throw new Error(c.data.id+': ismeretlen állás: '+s.id+'='+v);
  combo[s.id]=v;
 }
 return c.simulate(combo);
}
/** Az igazságtábla (a szimuláció sorai, minden állapotkombináció): állások és kimenetek. */
export function truthTable(c:Circuit):({states:Combo}&NlOutputs)[]{
 return c.run().rows.map(r=>{const {states,...rest}=r;const out:Record<string,unknown>={};for(const k of ['lamps','outlets','currents','trips','consumers','loops','overcurrent','imd','touch'])if(has(rest,k))out[k]=(rest as Record<string,unknown>)[k];return {states,...out}});
}
export type WireRow={no:number;id:string;from:string;to:string;fromLabel:string;toLabel:string;conductor:string;color:string;section:string;role?:string};
/** A szöveges vezetéktábla (sim.py md_wires): a valódi erek (a „belső”, „érintés”, „hibahely” kapcsolat nem ér) a netlista sorrendjében. */
export function wireTable(c:Circuit):WireRow[]{
 const out:WireRow[]=[];
 const ws=(c.data.wires??[]).filter(w=>CONDUCTOR_CLASS[w.conductor]!=='virtualis');
 ws.forEach((w,i)=>{
  const sec=w.section;
  let secL=sec&&c.sections.has(sec)?c.sections.get(sec)!.label??sec:'dobozon belül';
  if(!sec||!c.sections.has(sec)){const fc=c.termComp.get(w.from)!,loc=fc.at??fc.id;secL=c.data.places?.[loc]?.inner||secL}
  out.push({no:i+1,id:w.id||'#'+(c.data.wires.indexOf(w)+1),from:w.from,to:w.to,fromLabel:c.tlabel(w.from),toLabel:c.tlabel(w.to),conductor:w.conductor+(w.label?' '+w.label:''),color:w.color??'',section:secL,...(w.role?{role:w.role}:{})});
 });
 return out;
}
/** A statikus (állásfüggetlen) hálózatok: a vezetékek és a belső áthidalások szerinti halmazok. A hálózat azonosítója a legkisebb kapocskulcs. */
export function staticNets(c:Circuit):Map<string,string>{
 const uf=new UF(c.terms.keys());
 for(const w of c.data.wires??[])if(c.terms.has(w.from)&&c.terms.has(w.to))uf.union(w.from,w.to);
 for(const comp of c.comps.values())for(const grp of comp.bridges??[]){const ks=grp.map(t=>tkey(comp.id,t)).filter(k=>c.terms.has(k));for(const k of ks.slice(1))uf.union(ks[0],k)}
 const out=new Map<string,string>();
 for(const g of uf.groups())for(const k of g)out.set(k,g[0]);
 return out;
}
/** Állás → kanonikus szöveg (a választók sorrendjében). */
export const comboKey=(c:Circuit,combo:Combo)=>c.selectors.map(s=>s.id+'='+combo[s.id]).join(', ');
