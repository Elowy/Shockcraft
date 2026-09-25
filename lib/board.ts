import type {Plan} from './plan';

export const moduleTypes=['MCB','RCD','RCBO','SPD','MAIN','DISTRIBUTION','PE','NEUTRAL','EPH','BUSBAR','TERMINAL'] as const;
export const moduleLabels:Record<typeof moduleTypes[number],string>={MCB:'Kismegszakító',RCD:'Áram-védőkapcsoló',RCBO:'Kombinált védelem',SPD:'Túlfeszültség-védelem',MAIN:'Főkapcsoló',DISTRIBUTION:'Fővezetéki leágazó',PE:'PE-sín',NEUTRAL:'Nullasín (N)',EPH:'EPH-sín',BUSBAR:'Fázissín',TERMINAL:'Sorkapocs'};
export const moduleWidths:Record<typeof moduleTypes[number],number>={MCB:1,RCD:4,RCBO:2,SPD:4,MAIN:4,DISTRIBUTION:4,PE:4,NEUTRAL:4,EPH:4,BUSBAR:4,TERMINAL:2};
export const moduleShort:Record<typeof moduleTypes[number],string>={MCB:'MCB',RCD:'ÁVK',RCBO:'RCBO',SPD:'SPD',MAIN:'I/O',DISTRIBUTION:'FVL',PE:'PE',NEUTRAL:'N',EPH:'EPH',BUSBAR:'L-sín',TERMINAL:'X'};
export type Endpoint={kind:'circuit'|'module';id:string;port:string};
export type Port={id:string;label:string;signal:string};
export const endpointKey=(e:Endpoint)=>JSON.stringify([e.kind,e.id,e.port]);
export const wireColor=(signal:string)=>signal==='N'?'#267bbd':signal==='PE'?'#419350':signal==='L2'?'#555d68':signal==='L3'?'#87919b':'#a36a36';
export function circuitPorts(c:Plan['circuits'][number]):Port[]{return [...(c.phase==='3P'?['L1','L2','L3']:['L']),'N','PE'].map(id=>({id,label:c.conductorNames?.[id as keyof NonNullable<typeof c.conductorNames>]||`${c.name} / ${id==='L'?c.phase:id}`,signal:id==='L'?c.phase:id}))}
export function modulePorts(m:Plan['modules'][number],plan:Plan):Port[]{
 const c=plan.circuits.find(c=>c.id===m.circuit);
 const multi=(prefix:string,signal:string,count=8)=>Array.from({length:count},(_,i)=>({id:`${prefix}${i+1}`,label:`${prefix}${i+1}`,signal}));
 if(['PE','EPH','NEUTRAL','BUSBAR'].includes(m.type)){const s=m.type==='NEUTRAL'?'N':m.type==='BUSBAR'?'L':'PE';return multi(s==='L'?'L-':s,s)}
 if(m.type==='DISTRIBUTION')return ['L1','L2','L3','N'].flatMap(s=>multi(s+'-',s,4));
 if(m.type==='TERMINAL')return ['L','N','PE'].flatMap(s=>multi(s+'-',s,2));
 const phases=(m.type==='MCB'||m.type==='RCBO')?(c?.phase==='3P'?['L1','L2','L3']:['L']):['L1','L2','L3'];
 const signals=[...phases,...(m.type!=='MCB'?['N']:[]),...(m.type==='SPD'?['PE']:[])];
 return signals.flatMap(s=>(m.type==='SPD'?['']:['in','out']).map(dir=>({id:s+(dir?'-'+dir:''),label:s+(dir==='in'?' · be':dir==='out'?' · ki':''),signal:s==='L'&&c&&c.phase!=='3P'?c.phase:s})));
}
export function endpointInfo(plan:Plan,e:Endpoint){const entity=e.kind==='circuit'?plan.circuits.find(c=>c.id===e.id):plan.modules.find(m=>m.id===e.id);if(!entity)return null;const port=(e.kind==='circuit'?circuitPorts(entity as Plan['circuits'][number]):modulePorts(entity as Plan['modules'][number],plan)).find(p=>p.id===e.port);return port?{...port,building:entity.building,name:entity.name,text:e.kind==='circuit'?port.label:entity.name+' / '+port.label}:null}
export function compatible(a:string,b:string){return a===b||(a==='L'&&b.startsWith('L'))||(b==='L'&&a.startsWith('L'))}
export function validateBoard(plan:Plan){
 const occupied=new Set<string>(),pairs=new Set<string>();
 for(const w of plan.boardWires){const a=endpointInfo(plan,w.from),b=endpointInfo(plan,w.to);if(!a||!b||a.building!==w.building||b.building!==w.building)throw Error('A bekötés végpontja hiányzik vagy másik épülethez tartozik.');
  if(w.from.kind===w.to.kind&&w.from.id===w.to.id||w.from.kind==='circuit'&&w.to.kind==='circuit')throw Error('Két különböző készüléket, vagy egy áramkört és egy készüléket válassz.');
  if(!compatible(a.signal,b.signal))throw Error('Eltérő fázisú, nulla- vagy PE-kapcsok nem köthetők össze.');
  const pair=[endpointKey(w.from),endpointKey(w.to)].sort().join('|');if(pairs.has(pair))throw Error('Ez a bekötés már szerepel.');pairs.add(pair);
  for(const e of [w.from,w.to])if(e.kind==='circuit'){const key=endpointKey(e);if(occupied.has(key))throw Error('Az áramköri szál már be van kötve.');occupied.add(key);const other=e===w.from?w.to:w.from;const m=plan.modules.find(m=>m.id===other.id);if(m&&['MCB','RCBO'].includes(m.type)&&m.circuit!==e.id)throw Error('A védelmi készülék áramkör-hozzárendelése eltér a bekötéstől.');}
 }
}
export function connectBoard(plan:Plan,wire:Plan['boardWires'][number]){
 const end=[wire.from,wire.to].find(e=>e.kind==='circuit'),target=[wire.from,wire.to].find(e=>e.kind==='module');
 if(end&&target){const m=plan.modules.find(m=>m.id===target.id);if(m&&['MCB','RCBO'].includes(m.type)){if(m.circuit&&m.circuit!==end.id)throw Error('Ez a védelmi készülék már másik áramkörhöz tartozik.');m.circuit=end.id}}
 plan.boardWires.push(wire);validateBoard(plan);
}
export function removeBoardLinks(plan:Plan,kind:Endpoint['kind'],id:string){plan.boardWires=plan.boardWires.filter(w=>![w.from,w.to].some(e=>e.kind===kind&&e.id===id))}
// Phase/assignment edits may change the available poles. Keep only valid links.
export function pruneBoardLinks(plan:Plan){plan.boardWires=plan.boardWires.filter(w=>{const a=endpointInfo(plan,w.from),b=endpointInfo(plan,w.to);if(!a||!b||!compatible(a.signal,b.signal))return false;const c=[w.from,w.to].find(e=>e.kind==='circuit'),m=[w.from,w.to].find(e=>e.kind==='module');const device=m&&plan.modules.find(x=>x.id===m.id);return !(c&&device&&['MCB','RCBO'].includes(device.type)&&device.circuit!==c.id)})}
