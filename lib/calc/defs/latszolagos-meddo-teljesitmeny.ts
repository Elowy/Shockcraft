import {CalcError,type CalcDef,type Step} from '../core';
import {si,step,u} from '../fields';

const modes=[
 {value:'PQ',label:'P és Q ismert',short:'P, Q'},{value:'PS',label:'P és S ismert',short:'P, S'},
 {value:'Pcos',label:'P és cos φ ismert',short:'P, cos φ'},{value:'Scos',label:'S és cos φ ismert',short:'S, cos φ'},
] as const;
const deg=(r:number)=>r*180/Math.PI;

const def:CalcDef={
 slug:'latszolagos-meddo-teljesitmeny',title:'Látszólagos és meddő teljesítmény',category:'teljesitmeny',tier:'T0',version:1,updated:'2026-10-10',
 short:'A teljesítményháromszög két ismert adatából kiszámolja a hiányzókat: S² = P² + Q², cos φ = P / S, tan φ = Q / P.',
 keywords:['látszólagos teljesítmény','meddő teljesítmény','VA','var','kVA','kvar','cos fi','tan fi','teljesítményháromszög','teljesítménytényező'],
 synonyms:['latszolagos teljesitmeny','meddo teljesitmeny','teljesitmeny haromszog','cosfi','tgfi'],
 fields:[
  {id:'mod',kind:'select',label:'Mit ismersz?',style:'select',default:'PQ',options:modes},
  {id:'P',kind:'number',label:'Hatásos teljesítmény',symbol:'P',units:'power',defaultUnit:'kW',default:'3',positive:true,max:1e9,showIf:{field:'mod',is:['PQ','PS','Pcos']}},
  {id:'Q',kind:'number',label:'Meddő teljesítmény',symbol:'Q',units:'reactive',defaultUnit:'kvar',default:'4',min:0,max:1e9,showIf:{field:'mod',is:['PQ']}},
  {id:'S',kind:'number',label:'Látszólagos teljesítmény',symbol:'S',units:'apparent',defaultUnit:'kVA',default:'5',positive:true,max:1e9,showIf:{field:'mod',is:['PS','Scos']}},
  {id:'cos',kind:'number',label:'Teljesítménytényező',symbol:'cos φ',default:'0,8',positive:true,max:1,showIf:{field:'mod',is:['Pcos','Scos']}},
 ],
 compute(v){
  const m=v.s('mod');let P=0,Q=0,S=0;const steps:Step[]=[];
  if(m==='PQ'){P=v.n('P');Q=v.n('Q');S=Math.hypot(P,Q);steps.push(step('Látszólagos teljesítmény','S = √(P² + Q²)',`S = √((${si(P,'W')})² + (${si(Q,'var')})²)`,si(S,'VA')))}
  else if(m==='PS'){P=v.n('P');S=v.n('S');if(S<P*(1-1e-12))throw new CalcError('A látszólagos teljesítmény (S) nem lehet kisebb a hatásosnál (P).','S');Q=Math.sqrt(Math.max(0,S*S-P*P));steps.push(step('Meddő teljesítmény','Q = √(S² − P²)',`Q = √((${si(S,'VA')})² − (${si(P,'W')})²)`,si(Q,'var')))}
  else if(m==='Pcos'){P=v.n('P');const c=v.n('cos');S=P/c;Q=S*Math.sqrt(1-c*c);steps.push(step('Látszólagos teljesítmény','S = P / cos φ',`S = ${si(P,'W')} / ${u(c,'')}`,si(S,'VA')),step('Meddő teljesítmény','Q = S · sin φ',`Q = ${si(S,'VA')} · ${u(Math.sqrt(1-c*c),'')}`,si(Q,'var')))}
  else{S=v.n('S');const c=v.n('cos');P=S*c;Q=S*Math.sqrt(1-c*c);steps.push(step('Hatásos teljesítmény','P = S · cos φ',`P = ${si(S,'VA')} · ${u(c,'')}`,si(P,'W')),step('Meddő teljesítmény','Q = S · sin φ',`Q = ${si(S,'VA')} · ${u(Math.sqrt(1-c*c),'')}`,si(Q,'var')))}
  if(!(S>0))throw new CalcError('Legalább az egyik teljesítmény legyen nagyobb nullánál.');
  const cos=P/S,phi=Math.atan2(Q,P),tan=P>0?Q/P:NaN;
  steps.push(step('Teljesítménytényező','cos φ = P / S',`cos φ = ${si(P,'W')} / ${si(S,'VA')}`,u(cos,'')+' (φ = '+u(deg(phi),'°',2)+')'));
  if(P>0)steps.push(step('tan φ','tan φ = Q / P',`tan φ = ${si(Q,'var')} / ${si(P,'W')}`,u(tan,'')));
  return {
   results:[{id:'P',label:'Hatásos teljesítmény',value:P,unit:'W',text:si(P,'W'),primary:m==='Scos'},{id:'Q',label:'Meddő teljesítmény',value:Q,unit:'var',text:si(Q,'var'),primary:m!=='PQ'},{id:'S',label:'Látszólagos teljesítmény',value:S,unit:'VA',text:si(S,'VA'),primary:m==='PQ'||m==='Pcos'},{id:'cos',label:'cos φ',value:cos,text:u(cos,'')},{id:'phi',label:'Fázisszög φ',value:deg(phi),unit:'°',text:u(deg(phi),'°',2)},...(P>0?[{id:'tan',label:'tan φ',value:tan,text:u(tan,'')}]:[])],
   steps,figure:{kind:'power-triangle',P,Q,S,phi:deg(phi),units:['W','var','VA']},
   assumptions:['Szinuszos feszültség és áram; a meddő teljesítmény induktív (pozitív).'],
  };
 },
 formulas:['S² = P² + Q²','cos φ = P / S','tan φ = Q / P','Q = S · sin φ'],
 notes:{
  good:['A teljesítményháromszög adatainak átszámítása (pl. adattábla kVA-értékéből kW).','Fázisjavítás előtti állapot felmérése (Q, tan φ).'],
  bad:['Felharmonikusokkal terhelt hálózatban a torzítási teljesítmény miatt S² > P² + Q².','Kapacitív (negatív) meddő teljesítmény előjeles kezelésére.'],
 },
 safety:['alap','kalkulator'],
 examples:[
  {title:'3 kW és 4 kvar',input:{mod:'PQ',P:'3','P.e':'kW',Q:'4','Q.e':'kvar'},expect:{S:5000,cos:0.6,tan:1.33333,phi:53.1301}},
  {title:'8 kW, cos φ = 0,8',input:{mod:'Pcos',P:'8','P.e':'kW',cos:'0,8'},expect:{S:10000,Q:6000}},
  {title:'10 kVA, cos φ = 0,6',input:{mod:'Scos',S:'10','S.e':'kVA',cos:'0,6'},expect:{P:6000,Q:8000}},
  {title:'1000 W, 1250 VA',input:{mod:'PS',P:'1000','P.e':'W',S:'1250','S.e':'VA'},expect:{Q:750,cos:0.8}},
  {title:'Tisztán ohmos: 2 kW, 0 kvar',input:{mod:'PQ',P:'2','P.e':'kW',Q:'0','Q.e':'kvar'},expect:{S:2000,cos:1,tan:0,phi:0}},
 ],
 related:['teljesitmeny','fazisjavitas','aram-teljesitmenybol'],articles:[],
 sources:['Szinuszos váltakozó áramú teljesítményháromszög (S² = P² + Q²) – alapösszefüggés'],
};
export default def;
