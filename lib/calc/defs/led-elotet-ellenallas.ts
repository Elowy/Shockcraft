import {CalcError,type CalcDef,type Issue} from '../core';
import {E24,E_SERIES_SOURCE,RESISTOR_POWERS,nextAtLeast,nextSeriesValue} from '../constants';
import {si,step,u} from '../fields';

const def:CalcDef={
 slug:'led-elotet-ellenallas',title:'LED előtét-ellenállás',category:'elektronika',tier:'T0',version:1,updated:'2026-10-10',
 short:'Soros előtét-ellenállás egy vagy több sorba kötött LED-hez: R = (U − n · Uf) / I, a következő E24-es értékkel és a szükséges teljesítménnyel.',
 keywords:['LED ellenállás','előtét ellenállás','LED előtét','nyitófeszültség','Uf','LED áram','soros ellenállás LED'],
 synonyms:['led elotet','led ellenallas','elotet ellenallas','led resistor'],
 fields:[
  {id:'Us',kind:'number',label:'Tápfeszültség',symbol:'U',unit:'V',default:'12',positive:true,max:1000},
  {id:'Uf',kind:'number',label:'Egy LED nyitófeszültsége',symbol:'Uf',unit:'V',default:'2',positive:true,max:50,help:'Adatlapi érték; tájékoztatásul: piros ≈ 2 V, fehér/kék ≈ 3–3,3 V.'},
  {id:'I',kind:'number',label:'LED-áram',symbol:'I',units:'current',defaultUnit:'mA',default:'20',positive:true,max:10},
  {id:'n',kind:'number',label:'Sorba kötött LED-ek száma',symbol:'n',unit:'db',default:'1',integer:true,min:1,max:100},
 ],
 compute(v){
  const Us=v.n('Us'),Uf=v.n('Uf'),I=v.n('I'),n=v.n('n'),Ur=Us-n*Uf;
  // Relatív tűrés: 9,9 V − 3 · 3,3 V lebegőpontosan 1,8e-15 V lenne, ami értelmetlen, pikoohmos eredményt adna.
  if(!(Ur>1e-9*Us))throw new CalcError(`A LED-ek nyitófeszültségének összege (${u(n*Uf,'V')}) nem kisebb a tápfeszültségnél: nincs mire méretezni az ellenállást.`,'Us');
  const R=Ur/I,Re=nextSeriesValue(R,E24),Ia=Ur/Re,P=Ia*Ia*Re,Prated=nextAtLeast(2*P,RESISTOR_POWERS.value),issues:Issue[]=[];
  if(Ur/Us<0.1)issues.push({level:'warn',text:'Az ellenálláson eső feszültség kicsi a tápfeszültséghez képest: a tápfeszültség kis ingadozása is nagyot változtat a LED áramán. Áramgenerátoros meghajtót érdemes használni.'});
  if(Prated===null)issues.push({level:'warn',text:'A szükséges teljesítmény nagy: áramgenerátoros LED-meghajtó javasolt.'});
  return {
   results:[{id:'R',label:'Számított ellenállás',value:R,unit:'Ω',text:si(R,'Ω'),primary:true},{id:'Re24',label:'Javasolt E24-érték',value:Re,unit:'Ω',text:si(Re,'Ω'),primary:true},{id:'Ia',label:'LED-áram az E24-értékkel',value:Ia,unit:'A',text:si(Ia,'A')},{id:'P',label:'Ellenállás disszipációja',value:P,unit:'W',text:si(P,'W')},...(Prated!==null?[{id:'Prated',label:'Javasolt névleges teljesítmény (2× tartalék)',value:Prated,unit:'W',text:u(Prated,'W')}]:[])],
   steps:[step('Ellenálláson eső feszültség','UR = U − n · Uf',`UR = ${u(Us,'V')} − ${n} · ${u(Uf,'V')}`,u(Ur,'V')),step('Ellenállás','R = UR / I',`R = ${u(Ur,'V')} / ${si(I,'A')}`,si(R,'Ω')),step('E24-érték és áram','a legkisebb E24-érték ≥ R; I = UR / R(E24)',`I = ${u(Ur,'V')} / ${si(Re,'Ω')}`,si(Ia,'A'),E_SERIES_SOURCE),step('Teljesítmény','P = I² · R',`P = (${si(Ia,'A')})² · ${si(Re,'Ω')}`,si(P,'W'))],
   issues,assumptions:['A nyitófeszültség állandó (valójában az árammal és a hőmérséklettel kissé változik).','A nagyobb E24-érték miatt az áram kissé kisebb a kívántnál (a LED javára).'],
  };
 },
 formulas:['R = (U − n · Uf) / I','P = I² · R'],
 notes:{good:['Jelző-LED-ek, kis teljesítményű LED-láncok előtétjének méretezése törpefeszültségről.'],bad:['Teljesítmény-LED-ekhez és LED-szalagokhoz (azokhoz gyári meghajtó vagy szalagtápegység kell).','Hálózati (230 V) LED-áramkörhöz.']},
 safety:['alap','kalkulator'],
 examples:[
  {title:'12 V, piros LED (2 V), 20 mA',input:{Us:'12',Uf:'2',I:'20','I.e':'mA',n:'1'},expect:{R:500,Re24:510,Ia:0.0196078,P:0.196078,Prated:0.5}},
  {title:'5 V, fehér LED (3,2 V), 20 mA',input:{Us:'5',Uf:'3,2',I:'20','I.e':'mA',n:'1'},expect:{R:90,Re24:91}},
  {title:'12 V, 3 sorba kötött LED (3 V), 20 mA',input:{Us:'12',Uf:'3',I:'20','I.e':'mA',n:'3'},expect:{R:150,Re24:150,P:0.06,Prated:0.125}},
  {title:'24 V, 2 LED (2,1 V), 10 mA',input:{Us:'24',Uf:'2,1',I:'10','I.e':'mA',n:'2'},expect:{R:1980,Re24:2000}},
 ],
 related:['ohm-torveny','ellenallas-szinkod','led-szalag-tapegyseg'],articles:[],
 sources:['Ohm-törvény a soros előtétre',E_SERIES_SOURCE,RESISTOR_POWERS.source],
};
export default def;
