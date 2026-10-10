import {CalcError,type CalcDef} from '../core';
import {AWG_SOURCE,HP_W,KWH_J,LE_W,awgDiameter,awgLabel} from '../constants';
import {si,step,u} from '../fields';
import {formatNum} from '../number';

const area=(d:number)=>Math.PI/4*d*d;
/** A legvékonyabb AWG-huzal, amelynek keresztmetszete ≥ A (n = −3 … 40). */
function awgAtLeast(A:number){for(let n=40;n>=-3;n--)if(area(awgDiameter(n))>=A*(1-1e-9))return n;return null}

const def:CalcDef={
 slug:'mertekegyseg-atvalto',title:'Mértékegység-átváltó',category:'atvaltok',tier:'T0',version:1,updated:'2026-10-10',
 short:'Villamos átváltások egy helyen: kW – LE – hp, AWG – mm², huzalátmérő – keresztmetszet és kWh – MJ, képlettel és forrással.',
 keywords:['átváltás','mértékegység','kW LE','lóerő','hp','AWG','mm2','átmérő','keresztmetszet','kWh MJ','joule'],
 synonyms:['atvalto','mertekegyseg','loero','awg mm2','kw le','kw loero'],
 fields:[
  {id:'mod',kind:'select',label:'Átváltás',style:'select',default:'teljesitmeny',options:[
   {value:'teljesitmeny',label:'Teljesítmény: kW – LE – hp',short:'teljesítmény'},{value:'awg',label:'AWG → mm²',short:'AWG'},
   {value:'keresztmetszet',label:'mm² → átmérő és AWG',short:'mm²'},{value:'atmero',label:'Huzalátmérő → mm²',short:'átmérő'},
   {value:'energia',label:'Energia: kWh – MJ',short:'energia'}]},
  {id:'P',kind:'number',label:'Teljesítmény',symbol:'P',units:'motorPower',default:'7,5',min:0,max:1e9,showIf:{field:'mod',is:['teljesitmeny']}},
  {id:'awg',kind:'number',label:'AWG-szám',symbol:'n',default:'12',integer:true,min:-3,max:40,allowNegative:true,help:'1/0 = 0, 2/0 = −1, 3/0 = −2, 4/0 = −3.',showIf:{field:'mod',is:['awg']}},
  {id:'A',kind:'number',label:'Keresztmetszet',symbol:'A',unit:'mm²',default:'2,5',positive:true,max:1000,showIf:{field:'mod',is:['keresztmetszet']}},
  {id:'d',kind:'number',label:'Huzalátmérő',symbol:'d',unit:'mm',default:'1,78',positive:true,max:100,showIf:{field:'mod',is:['atmero']}},
  {id:'E',kind:'number',label:'Energia',symbol:'E',units:'energyAll',default:'1',min:0,max:1e12,showIf:{field:'mod',is:['energia']}},
 ],
 compute(v){
  const m=v.s('mod');
  if(m==='teljesitmeny'){
   const W=v.n('P');
   return {results:[{id:'kW',label:'Kilowatt',value:W/1000,unit:'kW',text:u(W/1000,'kW'),primary:v.unit('P')!=='kW'},{id:'LE',label:'Metrikus lóerő',value:W/LE_W,unit:'LE',text:u(W/LE_W,'LE'),primary:v.unit('P')!=='LE'},{id:'hp',label:'Angolszász lóerő',value:W/HP_W,unit:'hp',text:u(W/HP_W,'hp')},{id:'W',label:'Watt',value:W,unit:'W',text:u(W,'W')}],
    steps:[step('Watt','P[W] = érték · egység',`P = ${u(v.entered('P')!,v.unit('P'))}`,u(W,'W')),step('Lóerő','LE = P / 735,49875 W; hp = P / 745,7 W',`LE = ${u(W,'W')} / 735,49875 W`,u(W/LE_W,'LE'))]};
  }
  if(m==='awg'){
   const n=v.n('awg'),d=awgDiameter(n),A=area(d);
   return {results:[{id:'mm2',label:'Keresztmetszet',value:A,unit:'mm²',text:u(A,'mm²'),primary:true},{id:'d',label:'Átmérő',value:d,unit:'mm',text:u(d,'mm')}],
    steps:[step('Átmérő','d = 0,127 mm · 92^((36 − n) / 39)',`d = 0,127 mm · 92^((36 − ${n<0?'('+formatNum(n)+')':n}) / 39)`,u(d,'mm'),AWG_SOURCE),step('Keresztmetszet','A = π · d² / 4',`A = π · (${u(d,'mm')})² / 4`,u(A,'mm²'))],
    issues:[{level:'info',text:'AWG '+awgLabel(n)+': tömör huzal névleges keresztmetszete. A sodrott vezetők és az európai mm²-sor értékei ettől eltérnek.'}]};
  }
  if(m==='keresztmetszet'){
   const A=v.n('A'),d=Math.sqrt(4*A/Math.PI),n=awgAtLeast(A);
   if(n===null)throw new CalcError('Ekkora keresztmetszethez nincs AWG-érték (a legnagyobb a 4/0, kb. 107 mm²).','A');
   const An=area(awgDiameter(n));
   return {results:[{id:'d',label:'Tömör huzal átmérője',value:d,unit:'mm',text:u(d,'mm'),primary:true},{id:'awg',label:'Legközelebbi nem kisebb AWG',value:n,text:'AWG '+awgLabel(n)+' ('+u(An,'mm²')+')'}],
    steps:[step('Átmérő','d = √(4 · A / π)',`d = √(4 · ${u(A,'mm²')} / π)`,u(d,'mm')),step('AWG','a legnagyobb n, amelyre A(n) ≥ A','AWG '+awgLabel(n)+': '+u(An,'mm²'),'AWG '+awgLabel(n),AWG_SOURCE)]};
  }
  if(m==='atmero'){
   const d=v.n('d'),A=area(d);
   return {results:[{id:'mm2',label:'Keresztmetszet',value:A,unit:'mm²',text:u(A,'mm²'),primary:true}],steps:[step('Keresztmetszet','A = π · d² / 4',`A = π · (${u(d,'mm')})² / 4`,u(A,'mm²'))],
    issues:[{level:'info',text:'Sodrott vezetőnél a szálak összkeresztmetszete számít (szálátmérő² · π/4 · szálszám), nem a külső átmérő.'}]};
  }
  const Wh=v.n('E'),J=Wh/1000*KWH_J;
  return {results:[{id:'kWh',label:'Kilowattóra',value:Wh/1000,unit:'kWh',text:u(Wh/1000,'kWh'),primary:v.unit('E')!=='kWh'},{id:'MJ',label:'Megajoule',value:J/1e6,unit:'MJ',text:u(J/1e6,'MJ'),primary:v.unit('E')==='kWh'},{id:'J',label:'Joule',value:J,unit:'J',text:si(J,'J')},{id:'Wh',label:'Wattóra',value:Wh,unit:'Wh',text:u(Wh,'Wh')}],
   steps:[step('Joule','1 kWh = 3,6 MJ (1 Wh = 3600 J)',`E = ${u(Wh,'Wh')} · 3600 J/Wh`,si(J,'J'))]};
 },
 formulas:['1 LE = 735,49875 W; 1 hp = 745,69987 W','AWG: d = 0,127 mm · 92^((36 − n)/39), A = π · d² / 4','1 kWh = 3,6 MJ'],
 notes:{good:['Motor-adattáblák (LE, hp) és amerikai huzalméretek (AWG) átszámítása.','Huzalátmérő mérése után a keresztmetszet ellenőrzése.'],bad:['AWG-vezető egyenértékének megállapítása a hazai mm²-sorban: a terhelhetőséget a kábel adatlapja adja.','Sodrott vezető külső átmérőjéből keresztmetszet.']},
 safety:['alap'],
 examples:[
  {title:'7,5 kW lóerőben',input:{mod:'teljesitmeny',P:'7,5','P.e':'kW'},expect:{LE:10.1972,hp:10.0577,W:7500}},
  {title:'AWG 12 mm²-ben',input:{mod:'awg',awg:'12'},expect:{mm2:3.30877,d:2.05253}},
  {title:'2,5 mm² átmérője és AWG-je',input:{mod:'keresztmetszet',A:'2,5'},expect:{d:1.78412,awg:13}},
  {title:'1,78 mm átmérő',input:{mod:'atmero',d:'1,78'},expect:{mm2:2.48846}},
  {title:'1 kWh joule-ban',input:{mod:'energia',E:'1','E.e':'kWh'},expect:{MJ:3.6,J:3.6e6}},
  {title:'10 LE kW-ban',input:{mod:'teljesitmeny',P:'10','P.e':'LE'},expect:{kW:7.35499}},
  {title:'AWG 4/0 (−3)',input:{mod:'awg',awg:'-3'},expect:{mm2:107.219}},
 ],
 related:['teljesitmeny','motor-aram','homerseklet','vezetek-ellenallas'],articles:[],
 sources:['1 LE = 75 kp·m/s = 735,49875 W; 1 hp = 550 ft·lbf/s ≈ 745,69987 W (definíciók)',AWG_SOURCE,'1 kWh = 3,6 MJ (definíció)'],
};
export default def;
