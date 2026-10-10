import type {CalcDef,Issue} from '../core';
import {neutralCurrent} from '../formulas';
import {pct,si,step,u} from '../fields';
import {IMBALANCE_LIMIT,PHASE_VOLTAGE,phases,phaseTotals} from '../../phase-load';

const pf=(id:string,label:string,mode:'A'|'W',def:string)=>mode==='A'
 ?{id,kind:'number' as const,label,symbol:'I',unit:'A',default:def,min:0,max:1e4,showIf:{field:'mod',is:['A']}}
 :{id,kind:'number' as const,label,symbol:'P',units:'power' as const,default:def,min:0,max:1e7,showIf:{field:'mod',is:['W']}};

const def:CalcDef={
 slug:'fazisterheles',title:'Fázisterhelés és nullavezető-áram',category:'teljesitmeny',tier:'T0',version:1,updated:'2026-10-10',
 short:'Háromfázisú terhelés fázisonkénti összesítése: aszimmetria a fázisátlaghoz képest és a nullavezető árama azonos cos φ mellett.',
 keywords:['fázisterhelés','aszimmetria','nullavezető áram','N áram','L1 L2 L3','fáziskiegyenlítés','háromfázisú terhelés'],
 synonyms:['fazisterheles','fazis aszimmetria','nulla aram','nullavezeto aram'],
 fields:[
  {id:'mod',kind:'select',label:'Megadás',style:'segmented',default:'A',options:[{value:'A',label:'Áramok (A)'},{value:'W',label:'Teljesítmények (W, 230 V)',short:'W'}]},
  pf('L1','L1 fázisáram','A','10'),pf('L2','L2 fázisáram','A','10'),pf('L3','L3 fázisáram','A','0'),
  pf('P1','L1 terhelés','W','600'),pf('P2','L2 terhelés','W','400'),pf('P3','L3 terhelés','W','100'),
 ],
 compute(v){
  const mode=v.s('mod');
  const watts=mode==='A'?[v.n('L1'),v.n('L2'),v.n('L3')].map(i=>i*PHASE_VOLTAGE):[v.n('P1'),v.n('P2'),v.n('P3')];
  const t=phaseTotals(phases.map((phase,i)=>({phase,watts:watts[i]})));
  const I=phases.map(p=>t.phases[p].current),IN=neutralCurrent(I[0],I[1],I[2]),avg=t.total/3;
  const dev=watts.map(w=>Math.abs(w-avg)),maxDev=Math.max(...dev),c=I.map(x=>u(x,'',3));
  const issues:Issue[]=[];
  if(t.total>0&&t.imbalance>IMBALANCE_LIMIT)issues.push({level:'warn',text:`A legnagyobb eltérés az átlagtól ${pct(t.imbalance,1)} (tájékoztató határ: ${pct(IMBALANCE_LIMIT,0)}). Érdemes egyes áramköröket másik fázisra tenni.`});
  return {
   results:[
    ...phases.map((p,i)=>({id:'I'+(i+1),label:p+' áram',value:I[i],unit:'A',text:u(I[i],'A')})),
    {id:'total',label:'Összes terhelés',value:t.total,unit:'W',text:si(t.total,'W')},
    {id:'imbalance',label:'Aszimmetria (eltérés az átlagtól)',value:t.imbalance,unit:'%',text:pct(t.imbalance,1),primary:true},
    {id:'IN',label:'Nullavezető árama',value:IN,unit:'A',text:u(IN,'A'),primary:true},
   ],
   steps:[
    mode==='W'?step('Fázisáramok','I = P / 230 V',phases.map((p,i)=>`${p}: ${u(watts[i],'W')} / 230 V`).join('; '),I.map(x=>u(x,'A')).join('; '))
     :step('Fázisteljesítmények','P = I · 230 V',phases.map((p,i)=>`${p}: ${u(I[i],'A')} · 230 V`).join('; '),watts.map(w=>si(w,'W')).join('; ')),
    step('Átlag','P_átl = (P1 + P2 + P3) / 3',`P_átl = (${watts.map(w=>si(w,'W')).join(' + ')}) / 3`,si(avg,'W')),
    step('Legnagyobb eltérés','max(|P1 − P_átl|; |P2 − P_átl|; |P3 − P_átl|)',`max(${dev.map(d=>si(d,'W')).join('; ')})`,si(maxDev,'W')),
    step('Aszimmetria','max |Pi − P_átl| / P_átl · 100',t.total>0?`${si(maxDev,'W')} / ${si(avg,'W')} · 100`:'nincs terhelés (P_átl = 0)',pct(t.imbalance,1)),
    step('Nullavezető-áram','I_N = √(I1² + I2² + I3² − I1·I2 − I2·I3 − I3·I1)',`I_N = √(${c[0]}² + ${c[1]}² + ${c[2]}² − ${c[0]}·${c[1]} − ${c[1]}·${c[2]} − ${c[2]}·${c[0]})`,u(IN,'A')),
   ],
   issues,figure:{kind:'phase-bars',unit:'A',phases:phases.map((p,i)=>({label:p,value:I[i]})),neutral:IN},
   assumptions:['230 V fázisfeszültség, azonos cos φ minden fázisban (a nullavezető-áram képlete csak így érvényes).',...(mode==='W'?['Teljesítmény megadásakor cos φ = 1 (I = P / 230 V); kisebb cos φ-nél a fázis- és a nullavezető-áram 1/cos φ-szer nagyobb.']:[]),'Szinuszos áramok: a felharmonikusok (pl. LED-meghajtók, számítógépek) a nullavezető áramát jelentősen növelhetik.','Egyidejűségi tényező nélkül.'],
  };
 },
 formulas:['I = P / 230 V','aszimmetria = max |Pi − P_átl| / P_átl · 100 %','I_N = √(I1² + I2² + I3² − I1·I2 − I2·I3 − I3·I1)'],
 notes:{good:['A lakáselosztó áramköreinek fázisokra osztása, a kiegyenlítés ellenőrzése.','A tervező Fázisterhelés fülének összesítése egy elosztóra (onnan előtöltve nyitható).'],bad:['Felharmonikusokkal terhelt hálózat nullavezetőjének méretezése.','Eltérő cos φ-jű fázisok (pl. motor és fűtés vegyesen) pontos nullavezető-árama.']},
 safety:['alap','kalkulator'],
 examples:[
  {title:'10 A, 10 A, 0 A',input:{mod:'A',L1:'10',L2:'10',L3:'0'},expect:{IN:10,imbalance:100,total:4600}},
  {title:'Szimmetrikus 16 A',input:{mod:'A',L1:'16',L2:'16',L3:'16'},expect:{IN:0,imbalance:0}},
  {title:'Mintaterv: 600, 400 és 100 W',input:{mod:'W',P1:'600',P2:'400',P3:'100'},expect:{total:1100,imbalance:72.7273,IN:1.89517}},
  {title:'20 A, 10 A, 5 A',input:{mod:'A',L1:'20',L2:'10',L3:'5'},expect:{IN:13.2288,imbalance:71.4286}},
  {title:'Csak egy fázis: 16 A',input:{mod:'A',L1:'16',L2:'0',L3:'0'},expect:{IN:16,imbalance:200}},
 ],
 related:['teljesitmeny','aram-teljesitmenybol','fogyasztas-koltseg'],articles:[],
 sources:['Háromfázisú fázorösszeg: I_N = |I1 + I2·a² + I3·a| azonos fázisszögeknél – alapösszefüggés','A tervező Fázisterhelés-összesítése (lib/phase-load.ts: 230 V, 20 % tájékoztató határ)'],
};
export default def;
