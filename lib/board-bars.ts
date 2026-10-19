import type {Plan} from './plan';
import {boards,inBoard} from './board-size';
import {BAR_MAX_TERMINALS,autoBarsOn,BAR_MIN_TERMINALS,barPortIndex,barShortName,boardBars,endpointInfo,endpointKey,type Bar,type BoardWire,type Endpoint,type Port} from './board';

// Tokozati PE- és N-sínek automatikus bekötése. Az automatikus vezetékek NEM tárolt adatok: mindig a terv aktuális állapotából számolódnak,
// ezért a régi tervek változatlanok maradnak, és az automatikus vezeték soha nem foglal le olyan kaput, amelyet a felhasználó kézzel bekötött.
// A tervező kézi (tárolt) vezetéke mindig felülírja az automatikusat. L-vezetőt, N–PE kötést és két N-sín közötti kötést nem hoz létre.

export type RcdGroup={status:'none'|'rcd'|'unresolved';rcdId?:string;reason?:string};
const norm=(s:string)=>s.trim().toLocaleLowerCase('hu');
const shortName=(s:string)=>norm(s.split(' · ')[0]);
type Circuit=Plan['circuits'][number];
type Mod=Plan['modules'][number];

// A kézi (tárolt) vezetékek készülék és áramkör szerinti indexe a betáplálás visszakövetéséhez (egy hívás = egy átfutás a vezetékeken).
type Index={mods:Map<string,Mod>;wires:Map<string,BoardWire[]>;cwires:Map<string,BoardWire[]>};
const indexOf=(plan:Plan):Index=>{
 const wires=new Map<string,BoardWire[]>(),cwires=new Map<string,BoardWire[]>();
 const put=(map:Map<string,BoardWire[]>,id:string,w:BoardWire)=>{const list=map.get(id);if(list)list.push(w);else map.set(id,[w])};
 for(const w of plan.boardWires)for(const e of [w.from,w.to]){if(e.kind==='module')put(wires,e.id,w);else if(e.kind==='circuit')put(cwires,e.id,w)}
 return {mods:new Map(plan.modules.map(m=>[m.id,m])),wires,cwires};
};
const L_IN=/^L[123]?-in$/,L_OUT=/^L[123]?-out$/,PASS=new Set(['BUSBAR','DISTRIBUTION','TERMINAL']),nodeOf=(port:string)=>port.replace(/-\d+$/,'');
// Egy készülék L-bemenetének (az SPD L-kapcsainak), illetve egy áramkör saját L-szálainak betáplálása a kézi vezetékeken visszakövetve. Forrás: az ÁVK vagy a főkapcsoló L-kimenete (a főkapcsoló L-bemenete is „főkapcsolói” betáplálás);
// az RCBO L-kimenete külön forrás (maradékáram-védett, N-sín nincs hozzá), kivéve az áramkör saját RCBO-ját: az átvezet az L-bemenetére. Átvezet: a fázissín, a leágazó és a sorkapocs (egy csomópont azonos nevű L-kapcsai azonos potenciálon vannak);
// a kismegszakító L-kimenete a hozzá tartozó L-bemenetre (a kismegszakító átvezeti a fázist); egy kismegszakító, RCBO vagy ÁVK L-bemeneti kapcsa (és az SPD L-kapcsa) ugyanaz a csomópont,
// mint a hozzá kötött másik L-bemenet (áthidalás), ezért a követés ugyanazon a kapcson folytatódik. A követés körmentes (egy vezeték egyszer szerepel). A saját kimenetét nem számolja.
type Feed={rcds:Set<string>;rcbos:Set<string>;main:boolean};
const CIRCUIT_L=/^L[123]?$/,SPD_L=/^L[123]$/;
function feedOf(ix:Index,module?:Mod,circuit?:Circuit):Feed{
 const rcds=new Set<string>(),rcbos=new Set<string>(),seen=new Set<string>();let main=false;
 // Az elért kapocs: a készülék típusa és a kapocs dönt.
 const reach=(x:Mod,port:string)=>{
  if(L_OUT.test(port)){
   if(x.type==='RCD')rcds.add(x.id);
   else if(x.type==='MAIN')main=true;
   else if(x.type==='RCBO'&&!(circuit&&x.circuit===circuit.id))rcbos.add(x.id);
   else if(x.type==='MCB'||x.type==='RCBO')walk(x.id,p=>p===port.replace(/-out$/,'-in'));
  }
  else if(L_IN.test(port)){
   if(x.type==='MAIN')main=true;
   else if(x.type==='MCB'||x.type==='RCBO'||x.type==='RCD')walk(x.id,p=>p===port);
  }
  else if(PASS.has(x.type)&&port.startsWith('L')){const key=nodeOf(port);walk(x.id,p=>p.startsWith('L')&&nodeOf(p)===key)}
  else if(x.type==='SPD'&&SPD_L.test(port))walk(x.id,p=>p===port);
 };
 const walk=(id:string,match:(port:string)=>boolean)=>{
  for(const w of ix.wires.get(id)??[]){
   if(seen.has(w.id))continue;
   const other=w.from.kind==='module'&&w.from.id===id&&match(w.from.port)?w.to:w.to.kind==='module'&&w.to.id===id&&match(w.to.port)?w.from:undefined;
   if(!other||other.kind!=='module')continue;
   const x=ix.mods.get(other.id);if(!x)continue;seen.add(w.id);
   reach(x,other.port);
  }
 };
 if(module)walk(module.id,module.type==='SPD'?p=>SPD_L.test(p):p=>L_IN.test(p));
 // Az áramkör saját L-szálának kézi vezetéke is bizonyíték (pl. kimenő sorkapocs, fázissín, közvetlenül az ÁVK L-kimenete), akkor is, ha a betápláló védelem nincs az áramkörhöz rendelve.
 if(circuit)for(const w of ix.cwires.get(circuit.id)??[]){
  const [mine,other]=w.from.kind==='circuit'&&w.from.id===circuit.id?[w.from,w.to]:[w.to,w.from];
  const x=other.kind==='module'?ix.mods.get(other.id):undefined;
  if(!x||seen.has(w.id)||!CIRCUIT_L.test(mine.port))continue;seen.add(w.id);reach(x,other.port);
 }
 if(module){rcds.delete(module.id);rcbos.delete(module.id)}
 return {rcds,rcbos,main};
}

// Az áramkör ÁVK-csoportja. 1) kézi bekötés: a védelmi készülék L-bemenete vagy az áramkör saját L-szála (áthidaláson, kismegszakítón, fázissínen, sorkapcson át is) egy ÁVK L-kimenetére van kötve; RCBO mögül táplált áramkör nem azonosítható; 2) az ÁVK-csoport szövege:
// üres = nincs ÁVK (főnullasín); különben pontosan egy, ugyanazon elosztóban lévő ÁVK nevével egyező (a teljes név vagy a ' · ' előtti rész, kis-nagybetűtől
// és szóközöktől függetlenül); az RCBO-s áramkör szövege lehet az RCBO saját neve (teljes vagy a ' · ' előtti rész) vagy „RCBO” is: ez nem ÁVK-csoport, mint az üres szöveg.
// Ha a bekötés szerint a védelem a főkapcsolóról kap betáplálást (nincs ÁVK), de a szöveg ÁVK-t nevez meg, a kettő ellentmond: nem azonosítható.
export const rcdGroup=(plan:Plan,circuit:Circuit):RcdGroup=>groupOf(plan,circuit,indexOf(plan));
function groupOf(plan:Plan,circuit:Circuit,ix:Index):RcdGroup{
 const board=circuit.board||'',sameBoard=(m:Mod)=>m.building===circuit.building&&inBoard(m,board);
 const rcds=new Set<string>(),rcbos=new Set<string>();let main=false;
 const merge=(f:Feed)=>{f.rcds.forEach(id=>{if(sameBoard(ix.mods.get(id)!))rcds.add(id)});f.rcbos.forEach(id=>{if(sameBoard(ix.mods.get(id)!))rcbos.add(id)});main=main||f.main};
 for(const m of plan.modules)if(m.circuit===circuit.id&&(m.type==='MCB'||m.type==='RCBO')&&sameBoard(m))merge(feedOf(ix,m,circuit));
 merge(feedOf(ix,undefined,circuit));
 if(rcbos.size)return {status:'unresolved',reason:`A(z) „${circuit.name}” áramkör védelmi készüléke egy RCBO (${[...rcbos].map(id=>ix.mods.get(id)!.name).join(', ')}) mögül kap betáplálást.`};
 if(rcds.size===1&&!main)return {status:'rcd',rcdId:[...rcds][0]};
 if(rcds.size>1)return {status:'unresolved',reason:`A(z) „${circuit.name}” áramkör védelmi készüléke több ÁVK-ból kap betáplálást.`};
 if(rcds.size===1)return {status:'unresolved',reason:`A(z) „${circuit.name}” áramkör védelmi készüléke az ÁVK-ból és a főkapcsolóról is kap betáplálást.`};
 const text=norm(circuit.rcd);
 if(!text)return {status:'none'};
 const match=plan.modules.filter(m=>m.type==='RCD'&&sameBoard(m)&&(norm(m.name)===text||shortName(m.name)===text));
 if(!match.length&&plan.modules.some(m=>m.type==='RCBO'&&m.circuit===circuit.id&&sameBoard(m)&&(text==='rcbo'||norm(m.name)===text||shortName(m.name)===text)))return {status:'none'};
 if(match.length===1)return main?{status:'unresolved',reason:`A(z) „${circuit.rcd}” ÁVK-csoport ellentmond a bekötésnek (a védelem a főkapcsolóról kap betáplálást).`}:{status:'rcd',rcdId:match[0].id};
 return {status:'unresolved',reason:match.length?`A(z) „${circuit.rcd}” ÁVK-csoport több készülékre is illik.`:`A(z) „${circuit.rcd}” ÁVK-csoport nem található ebben az elosztóban.`};
}

export type AutoWires={wires:BoardWire[];warnings:string[]};
// Egy sínre kézzel kötött N-kapocs betápláló „gyökerei”: a főkapcsoló vagy az ÁVK N-kimenete; a sorkapocs, a fővezetéki leágazó és a nullasín-modul N-csomópontján át követve.
// Egy fogyasztói út (pl. áramkör N → sorkapocs → sín) nem betáplálás, ezért üres halmazt ad; a gyökér nélküli nullasín-modul önmaga a betápláló (a régi, DIN-es nullasín), de csak a főnullasínnél elfogadott forrás: az ÁVK sínjét csak a saját ÁVK-ja táplálhatja (lásd `foreign`).
function nRoots(ix:Index,x:Mod,port:string,seen=new Set<string>()):Set<string>{
 const roots=new Set<string>();
 if(x.type==='MAIN'||x.type==='RCD'){if(port==='N-out')roots.add(x.id);return roots}
 if(!(x.type==='NEUTRAL'||x.type==='DISTRIBUTION'||x.type==='TERMINAL')||!port.startsWith('N'))return roots;
 for(const w of ix.wires.get(x.id)??[]){
  const mine=[w.from,w.to].find(e=>e.kind==='module'&&e.id===x.id&&e.port.startsWith('N')),other=mine&&(mine===w.from?w.to:w.from);
  const y=other?.kind==='module'?ix.mods.get(other.id):undefined;
  if(!y||!other||seen.has(w.id))continue;seen.add(w.id);
  nRoots(ix,y,other.port,seen).forEach(r=>roots.add(r));
 }
 if(!roots.size&&x.type==='NEUTRAL')roots.add(x.id);
 return roots;
}
const conductor=(c:Circuit,key:'N'|'PE')=>c.conductorNames?.[key]?.trim()||key;
export function autoBoardWires(plan:Plan,buildingId:string,boardId=''):AutoWires{
 const building=plan.buildings.find(b=>b.id===buildingId),none:AutoWires={wires:[],warnings:[]};
 if(!building||!autoBarsOn(building,boardId))return none;
 const bars=boardBars(plan,buildingId,boardId);if(!bars.length)return none;
 const pe=bars.find(b=>b.kind==='pe')!,main=bars.find(b=>b.kind==='n')!,ix=indexOf(plan);
 // Kézi (tárolt) vezetékek foglalta kapuk és sínkapcsok.
 const taken=new Set<string>(),used=new Map<string,Set<number>>();
 for(const w of plan.boardWires)for(const e of [w.from,w.to]){taken.add(endpointKey(e));if(e.kind==='bar'){const set=used.get(e.id)??new Set<number>();set.add(barPortIndex(e.port));used.set(e.id,set)}}
 const modules=plan.modules.filter(m=>m.building===buildingId&&inBoard(m,boardId)).sort((a,b)=>a.row-b.row||a.slot-b.slot||a.id.localeCompare(b.id));
 const circuits=plan.circuits.filter(c=>c.building===buildingId&&inBoard(c,boardId));
 const wires:BoardWire[]=[],warnings:string[]=[],overflow=new Map<string,number>();
 const barFor=(g:RcdGroup)=>g.status==='rcd'?bars.find(b=>b.rcdId===g.rcdId):g.status==='none'?main:undefined;
 // A sínkapocs a legkisebb szabad sorszámú kapocs; a kézi vezetékek kapcsait kihagyja. Ha elfogytak a kapcsok, a bekötés kimarad (a sínenkénti összesítő figyelmeztetés a végén).
 const terminal=(bar:Bar)=>{const set=used.get(bar.id)??new Set<number>();used.set(bar.id,set);let n=1;while(set.has(n))n++;set.add(n);return n<=BAR_MAX_TERMINALS?'T'+n:''};
 const toBar=(key:string,end:Endpoint,bar:Bar,name:string,barFirst=false)=>{const port=terminal(bar);if(!port){overflow.set(bar.id,(overflow.get(bar.id)||0)+1);return}const other:Endpoint={kind:'bar',id:bar.id,port};wires.push({id:'auto:'+key,name:name.slice(0,120),building:buildingId,from:barFirst?other:end,to:barFirst?end:other})};
 const toPort=(key:string,end:Endpoint,target:Endpoint,name:string)=>{wires.push({id:'auto:'+key,name:name.slice(0,120),building:buildingId,from:end,to:target})};
 const mod=(m:Mod,port:string):Endpoint=>({kind:'module',id:m.id,port});
 const free=(m:Mod,port:string)=>!taken.has(endpointKey(mod(m,port)));
 const firstMain=modules.find(m=>m.type==='MAIN');
 // Az N-sín betáplálói. Természetes betápláló: az ÁVK a saját sínjét, az első főkapcsoló a főnullasínt táplálja (ha az N-kimenete szabad, az automatikus bekötés teszi); ide jönnek a kézzel rákötött
 // betáplálók is (főkapcsoló vagy ÁVK N-kimenete, nullasín-modul, ezek sorkapcson / leágazón át; lásd nRoots).
 // – Nincs betápláló, de a természetes betáplálója megvan az elosztóban (kézzel máshová kötötték): a sínre fogyasztót (áramkör, ÁVK/RCBO N-bemenet, SPD) nem kötünk, figyelmeztetünk, az N-szál bekötetlen marad.
 //   Főkapcsoló nélküli elosztónál (pl. kábelről táplált alelosztó) a főnullasínnek nincs természetes betáplálója, ott a fogyasztók rákerülnek.
 // – Két (vagy több) betápláló van (pl. az ÁVK N-kimenetét kézzel másik sínre kötötték): az automatikus bekötés a sínt nem táplálja és fogyasztót sem köt rá, figyelmeztetünk. A kézi vezetékeket nem bántja.
 // – Idegen betápláló van (pl. másik ÁVK N-kimenete az ÁVK sínjén, a főkapcsoló N-kimenete az ÁVK sínjén, ÁVK N-kimenete a főnullasínen): ugyanígy kezeljük; egyetlen idegen forrás sem tesz „táplált”-tá egy sínt.
 const natural=(bar:Bar)=>bar.kind==='rcd'?ix.mods.get(bar.rcdId!):bar.kind==='n'?firstMain:undefined;
 const roots=new Map<string,Set<string>>(),ids=new Set(bars.map(b=>b.id));
 for(const w of plan.boardWires){const e=w.from.kind==='bar'?w.from:w.to.kind==='bar'?w.to:undefined;if(!e||!ids.has(e.id))continue;const o=e===w.from?w.to:w.from,x=o.kind==='module'?ix.mods.get(o.id):undefined;if(!x)continue;const r=nRoots(ix,x,o.port);if(r.size){const set=roots.get(e.id)??new Set<string>();r.forEach(i=>set.add(i));roots.set(e.id,set)}}
 const sources=new Map<string,Set<string>>();
 for(const bar of bars)if(bar.kind!=='pe'){const set=new Set<string>(),f=natural(bar);if(f&&free(f,'N-out'))set.add(f.id);roots.get(bar.id)?.forEach(i=>set.add(i));sources.set(bar.id,set)}
 // Egy sín megengedett betáplálója: az ÁVK sínjét csak a saját ÁVK-ja, a főnullasínt főkapcsoló vagy gyökér nélküli nullasín-modul táplálhatja, ÁVK soha. Idegen forrásról (pl. másik ÁVK N-kimenete, vagy a főkapcsoló N-kimenete az ÁVK sínjén)
 // az áramkör N-je másik ÁVK nullájára kerülne, vagy megkerülné a saját ÁVK-ját; ezért az ilyen sínt is „nem táplált”-nak kezeljük (a kézi vezetékeket nem bántja).
 const foreign=(bar:Bar)=>[...sources.get(bar.id)!].filter(id=>bar.kind==='rcd'?id!==bar.rcdId:ix.mods.get(id)?.type==='RCD');
 const blocked=(bar:Bar)=>(sources.get(bar.id)?.size||0)>1||foreign(bar).length>0,names=(ids:string[])=>ids.map(id=>barShortName(ix.mods.get(id)?.name||id)).join(', '),sourceNames=(bar:Bar)=>names([...sources.get(bar.id)!]);
 const unfed=(bar:Bar)=>{
  const set=sources.get(bar.id);if(!set)return '';
  if(set.size>1)return `a(z) ${bar.label} ${set.size===2?'két':'több'} forrásról kap betáplálást (${sourceNames(bar)})`;
  const alien=foreign(bar);if(alien.length)return `a(z) ${bar.label} idegen forrásról kap betáplálást (${names(alien)})`;
  const feeder=natural(bar);
  return set.size||!feeder?'':`a(z) ${bar.label} nem kap betáplálást (a(z) ${bar.kind==='rcd'?barShortName(feeder.name):feeder.name} N-kimenete kézzel máshová van kötve)`;
 };
 for(const bar of bars){
  const set=sources.get(bar.id);if(!set)continue;
  if(set.size>1)warnings.push(`${bar.label}: ${set.size===2?'két':'több'} forrásról kap betáplálást (${sourceNames(bar)}); az automatikus bekötés nem táplálja, és nem köt rá fogyasztót.`);
  else if(foreign(bar).length)warnings.push(`${bar.label}: idegen forrásról kap betáplálást (${names(foreign(bar))}); az automatikus bekötés nem táplálja, és nem köt rá fogyasztót.`);
 }
 // Fogyasztó N-kapcsának bekötése sínre (nem táplált vagy többször táplált sínre nem kötünk, figyelmeztetünk).
 const consume=(prefix:string,what:string,key:string,end:Endpoint,bar:Bar,name:string,barFirst=false)=>{const why=unfed(bar);if(why)warnings.push(`${prefix}: ${why}, ezért az ${what} automatikus bekötése kimarad.`);else toBar(key,end,bar,name,barFirst)};
 // Az ÁVK N-bemenete és az SPD N-kapcsa arról a sínről jön, amelyiknek a csoportjából a készülék az L-oldali betáplálását kapja: egyetlen ÁVK mögött a felső ÁVK N-sínjéről (különben a nulla megkerülné a felső ÁVK toroidját), főkapcsolóról vagy betáplálás nélkül a főnullasínről.
 const viaFeed=(m:Mod,who:string,what:string,key:string,end:Endpoint,name:(bar:Bar)=>string,barFirst:boolean)=>{
  const f=feedOf(ix,m),up=f.rcds.size===1&&!f.main&&!f.rcbos.size?bars.find(b=>b.rcdId===[...f.rcds][0]):undefined;
  if(up)consume(m.name,what,key,end,up,name(up),barFirst);
  else if(f.rcbos.size)warnings.push(`${m.name}: ${who} egy RCBO mögül kap betáplálást, ezért az ${what} automatikus bekötése kimarad.`);
  else if(f.rcds.size)warnings.push(`${m.name}: ${who} L-oldali betáplálása nem egyértelmű (több ÁVK-ról vagy a főkapcsolóról is kap betáplálást), ezért az ${what} automatikus bekötése kimarad.`);
  else consume(m.name,what,key,end,main,name(main),barFirst);
 };
 // 1) Betápláló és védelmi készülékek N/PE kapcsai.
 for(const m of modules){
  if(m.type==='MAIN'&&free(m,'N-out')){
   // A főnullasínt egyetlen forrás táplálhatja: több főkapcsoló esetén csak az elsőé (sor, hely, azonosító szerint) kerül rá automatikusan.
   if(m===firstMain){if(!blocked(main))toBar(m.id+':N-out',mod(m,'N-out'),main,`N · ${m.name} → ${main.label}`)}
   else warnings.push(`${m.name}: több főkapcsoló van az elosztóban; az N-kimenete nem kerül automatikusan a főnullasínre.`);
  }
  if(m.type==='RCD'){
   const own=bars.find(b=>b.rcdId===m.id)!;
   if(free(m,'N-in'))viaFeed(m,'az ÁVK','N-bemenet',m.id+':N-in',mod(m,'N-in'),bar=>`N · ${bar.label} → ${m.name}`,true);
   if(free(m,'N-out')&&!blocked(own))toBar(m.id+':N-out',mod(m,'N-out'),own,`N · ${m.name} → ${own.label}`);
  }
  if(m.type==='RCBO'&&free(m,'N-in')){
   const c=circuits.find(c=>c.id===m.circuit);
   if(c){const g=groupOf(plan,c,ix),bar=barFor(g);
    if(bar)consume(m.name,'N-bemenet',m.id+':N-in',mod(m,'N-in'),bar,`N · ${bar.label} → ${m.name}`,true);
    else warnings.push(`${m.name}: ${g.reason} Az N-bemenet automatikus bekötése kimarad.`);
   }
  }
  if(m.type==='SPD'){
   if(free(m,'N'))viaFeed(m,'az SPD','N-kapocs',m.id+':N',mod(m,'N'),bar=>`N · ${m.name} → ${bar.label}`,false);
   if(free(m,'PE'))toBar(m.id+':PE',mod(m,'PE'),pe,`PE · ${m.name} → ${pe.label}`);
  }
 }
 // 2) Az áramkörök PE- és N-szálai (a vezetéknévben az áramkör saját vezetőneve, ha van).
 for(const c of circuits){
  const cp=(port:string):Endpoint=>({kind:'circuit',id:c.id,port});
  if(!taken.has(endpointKey(cp('PE'))))toBar(c.id+':PE',cp('PE'),pe,`${conductor(c,'PE')} · ${c.name} → ${pe.label}`);
  if(taken.has(endpointKey(cp('N'))))continue;
  const rcbo=modules.find(m=>m.type==='RCBO'&&m.circuit===c.id);
  if(rcbo){
   if(free(rcbo,'N-out'))toPort(c.id+':N',cp('N'),mod(rcbo,'N-out'),`${conductor(c,'N')} · ${c.name} → ${rcbo.name}`);
   else warnings.push(`${c.name}: a(z) ${rcbo.name} N-kimenetén kézi bekötés van, ezért az áramkör N-szálának automatikus bekötése kimarad.`);
   continue;
  }
  const g=groupOf(plan,c,ix),bar=barFor(g);
  if(bar)consume(c.name,'N-szál',c.id+':N',cp('N'),bar,`${conductor(c,'N')} · ${c.name} → ${bar.label}`);
  else warnings.push(`${c.name}: ${g.reason} Az N-szál automatikus bekötése kimarad.`);
 }
 for(const bar of bars){const n=overflow.get(bar.id);if(n)warnings.push(`${bar.label}: elfogytak a sínkapcsok (legfeljebb ${BAR_MAX_TERMINALS}), ezért ${n} automatikus bekötés kimarad.`)}
 return {wires,warnings};
}

// Egy elosztó tényleges vezetékei: a kézi (tárolt) és az automatikus vezetékek. Az automatikusakat az `auto` azonosítóhalmaz jelöli.
export type EffectiveWires={wires:BoardWire[];auto:Set<string>;warnings:string[]};
export function boardWiring(plan:Plan,buildingId:string,boardId=''):EffectiveWires{
 const explicit=plan.boardWires.filter(w=>{const a=endpointInfo(plan,w.from),b=endpointInfo(plan,w.to);return w.building===buildingId&&a?.board===boardId&&b?.board===boardId&&a.building===buildingId&&b.building===buildingId});
 const auto=autoBoardWires(plan,buildingId,boardId);
 return {wires:[...explicit,...auto.wires],auto:new Set(auto.wires.map(w=>w.id)),warnings:auto.warnings};
}
// A teljes terv tényleges vezetékei (minden épület minden elosztójával). A figyelmeztetések előtt az elosztó neve áll.
export function effectiveBoardWires(plan:Plan):EffectiveWires{
 const wires=[...plan.boardWires],auto=new Set<string>(),warnings:string[]=[];
 for(const b of plan.buildings)for(const v of boards(b)){const a=autoBoardWires(plan,b.id,v.id);wires.push(...a.wires);a.wires.forEach(w=>auto.add(w.id));warnings.push(...a.warnings.map(t=>`${b.name} / ${v.name}: ${t}`))}
 return {wires,auto,warnings};
}

// A sínek kapcsai: T1…Tk, k = max(6, a sínre futó vezetékek száma + 2, a legnagyobb kézzel használt kapocs sorszáma), hogy kézi vezeték kapcsa soha ne szűnjön meg.
export type BarInfo=Bar&{building:string;board:string;ports:Port[]};
export function boardBarPorts(plan:Plan,buildingId:string,boardId='',wiring?:EffectiveWires):BarInfo[]{
 const bars=boardBars(plan,buildingId,boardId);if(!bars.length)return [];
 const eff=wiring??boardWiring(plan,buildingId,boardId),count=new Map<string,number>(),top=new Map<string,number>();
 for(const w of [...eff.wires,...plan.boardWires])for(const e of [w.from,w.to])if(e.kind==='bar')top.set(e.id,Math.max(top.get(e.id)||0,barPortIndex(e.port)));
 for(const w of eff.wires)for(const e of [w.from,w.to])if(e.kind==='bar')count.set(e.id,(count.get(e.id)||0)+1);
 return bars.map(bar=>{const k=Math.min(BAR_MAX_TERMINALS,Math.max(BAR_MIN_TERMINALS,(count.get(bar.id)||0)+2,top.get(bar.id)||0));
  return {...bar,building:buildingId,board:boardId,ports:Array.from({length:k},(_,i)=>({id:'T'+(i+1),label:'T'+(i+1),signal:bar.signal}))}});
}
