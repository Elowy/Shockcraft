import {boards,inBoard} from './board-size';
import type {Kind,Plan} from './plan';

/** Becsült teljesítmény szerelvénytípusonként (W), ha az áramkörnél nincs megadott terhelés. */
export const estimatedPower:Partial<Record<Kind,number>>={socket:200,double:400,light:100};
export const PHASE_VOLTAGE=230,IMBALANCE_LIMIT=20;
export const phases=['L1','L2','L3'] as const;
export type Phase=typeof phases[number];
type Circuit=Plan['circuits'][number];
export type CircuitLoad={circuit:Circuit;watts:number;estimated:boolean;devices:number;current:number;overload:boolean};
export type PhaseLoadIssue={code:'overload'|'imbalance'|'noload';title:string;detail:string;circuitId?:string};
export type PhaseLoad={buildingId:string;boardId:string;circuits:CircuitLoad[];phases:Record<Phase,{watts:number;current:number}>;total:number;imbalance:number;issues:PhaseLoadIssue[]};
const fmt=(n:number,d=1)=>n.toLocaleString('hu-HU',{maximumFractionDigits:d});

export function circuitLoad(plan:Plan,circuit:Circuit):CircuitLoad{
 const devices=plan.buildings.find(b=>b.id===circuit.building)?.floors.flatMap(f=>f.devices).filter(d=>d.circuit===circuit.id)||[];
 const estimated=circuit.load===undefined,watts=estimated?devices.reduce((s,d)=>s+(estimatedPower[d.kind]||0),0):circuit.load!;
 // Háromfázisú áramkörnél a terhelést egyenletesen osztjuk a három fázis között.
 const current=watts/(circuit.phase==='3P'?3:1)/PHASE_VOLTAGE;
 return {circuit,watts,estimated,devices:devices.length,current,overload:current>circuit.rating};
}

/** Egy elosztó áramköreinek fázisonkénti összesítése (cos φ = 1, egyidejűségi tényező nélkül). */
export function phaseLoad(plan:Plan,buildingId:string,boardId=''):PhaseLoad{
 const circuits=plan.circuits.filter(c=>c.building===buildingId&&inBoard(c,boardId)).map(c=>circuitLoad(plan,c));
 const watts:Record<Phase,number>={L1:0,L2:0,L3:0};
 for(const c of circuits){if(c.circuit.phase==='3P')for(const p of phases)watts[p]+=c.watts/3;else watts[c.circuit.phase]+=c.watts}
 const total=phases.reduce((s,p)=>s+watts[p],0),avg=total/3;
 const imbalance=avg>0?Math.max(...phases.map(p=>Math.abs(watts[p]-avg)))/avg*100:0;
 const issues:PhaseLoadIssue[]=[];
 for(const c of circuits){
  if(c.overload)issues.push({code:'overload',circuitId:c.circuit.id,title:c.circuit.name+': a terhelés meghaladja a védelmet',detail:fmt(c.current)+' A számított áram > '+c.circuit.curve+c.circuit.rating+' A kismegszakító. Ellenőrizd a terhelést vagy a védelmet.'});
  else if(!c.watts)issues.push({code:'noload',circuitId:c.circuit.id,title:c.circuit.name+': nincs terhelés',detail:c.estimated?'Nincs becsülhető szerelvény hozzárendelve. Add meg a terhelést az áramkörjegyzékben.':'A megadott terhelés 0 W.'});
 }
 if(total>0&&imbalance>IMBALANCE_LIMIT)issues.push({code:'imbalance',title:'Kiegyenlítetlen fázisterhelés',detail:'A legnagyobb eltérés az átlagtól '+fmt(imbalance,0)+'% (határ: '+IMBALANCE_LIMIT+'%). Érdemes egyes áramköröket másik fázisra tenni.'});
 return {buildingId,boardId,circuits,phases:Object.fromEntries(phases.map(p=>[p,{watts:watts[p],current:watts[p]/PHASE_VOLTAGE}])) as PhaseLoad['phases'],total,imbalance,issues};
}

/** Az összes épület összes elosztójának összesítése, csak ahol van áramkör. */
export function projectPhaseLoads(plan:Plan,buildingId='all'){
 return plan.buildings.filter(b=>buildingId==='all'||b.id===buildingId).flatMap(b=>boards(b).map(board=>({building:b,board,load:phaseLoad(plan,b.id,board.id)}))).filter(x=>x.load.circuits.length);
}
