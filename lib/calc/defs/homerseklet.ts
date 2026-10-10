import {CalcError,type CalcDef} from '../core';
import {KELVIN_OFFSET,MATERIALS,type Material} from '../constants';
import {step,u} from '../fields';

const def:CalcDef={
 slug:'homerseklet',title:'Hőmérséklet: átváltás és ellenállás',category:'atvaltok',tier:'T0',version:1,updated:'2026-10-10',
 short:'Hőmérséklet átváltása °C, °F és K között, valamint réz- vagy alumíniumvezető ellenállása másik hőmérsékleten (R2 = R1 · (1 + α · Δθ)).',
 keywords:['hőmérséklet','celsius','fahrenheit','kelvin','átváltás','ellenállás hőmérsékletfüggése','alfa','tekercs hőmérséklet'],
 synonyms:['homerseklet atvaltas','celsius fahrenheit','kelvin','homerseklet ellenallas'],
 fields:[
  {id:'mod',kind:'select',label:'Mit számolsz?',style:'segmented',default:'atvaltas',options:[{value:'atvaltas',label:'Átváltás (°C, °F, K)'},{value:'ellenallas',label:'Ellenállás hőmérsékletfüggése',short:'R(θ)'}]},
  {id:'T',kind:'number',label:'Hőmérséklet',symbol:'T',default:'20',allowNegative:true,min:-1e4,max:1e5,showIf:{field:'mod',is:['atvaltas']}},
  {id:'egyseg',kind:'select',label:'Egység',style:'segmented',default:'C',options:[{value:'C',label:'°C',short:'°C'},{value:'F',label:'°F',short:'°F'},{value:'K',label:'K',short:'K'}],showIf:{field:'mod',is:['atvaltas']}},
  {id:'anyag',kind:'select',label:'Vezető anyaga',style:'segmented',default:'Cu',options:[{value:'Cu',label:'Réz (Cu)',short:'Cu'},{value:'Al',label:'Alumínium (Al)',short:'Al'}],showIf:{field:'mod',is:['ellenallas']}},
  {id:'R1',kind:'number',label:'Ismert ellenállás',symbol:'R1',units:'resistance',default:'10',positive:true,max:1e12,showIf:{field:'mod',is:['ellenallas']}},
  {id:'t1',kind:'number',label:'Ennek hőmérséklete',symbol:'θ1',unit:'°C',default:'20',allowNegative:true,min:-50,max:250,showIf:{field:'mod',is:['ellenallas']}},
  {id:'t2',kind:'number',label:'Keresett hőmérséklet',symbol:'θ2',unit:'°C',default:'70',allowNegative:true,min:-50,max:250,showIf:{field:'mod',is:['ellenallas']}},
 ],
 compute(v){
  if(v.s('mod')==='atvaltas'){
   const T=v.n('T'),e=v.s('egyseg'),K=e==='C'?T+KELVIN_OFFSET:e==='F'?(T-32)*5/9+KELVIN_OFFSET:T;
   if(K<-1e-9)throw new CalcError('Az abszolút nulla fok (0 K = −273,15 °C) alatti hőmérséklet nem lehetséges.','T');
   const C=K-KELVIN_OFFSET,F=C*9/5+32;
   return {results:[{id:'C',label:'Celsius',value:C,unit:'°C',text:u(C,'°C'),primary:e!=='C'},{id:'F',label:'Fahrenheit',value:F,unit:'°F',text:u(F,'°F'),primary:e==='C'},{id:'K',label:'Kelvin',value:K,unit:'K',text:u(K,'K'),primary:e!=='K'}],
    steps:[step('Kelvin','K = °C + 273,15; °C = (°F − 32) · 5/9','a megadott érték kelvinben',u(K,'K')),step('Fahrenheit','°F = °C · 9/5 + 32',`°F = ${u(C,'°C')} · 9/5 + 32`,u(F,'°F'))]};
  }
  const m=MATERIALS[v.s('anyag') as Material],R1=v.n('R1'),t1=v.n('t1'),t2=v.n('t2');
  const R2=R1*(1+m.alpha*(t2-20))/(1+m.alpha*(t1-20));
  return {results:[{id:'R2',label:'Ellenállás θ2-n',value:R2,unit:'Ω',text:u(R2,'Ω'),primary:true},{id:'ratio',label:'Arány R2 / R1',value:R2/R1,text:u(R2/R1,'')}],
   steps:[step('Ellenállás θ2-n','R2 = R1 · (1 + α · (θ2 − 20)) / (1 + α · (θ1 − 20))',`R2 = ${u(R1,'Ω')} · (1 + ${u(m.alpha,'1/K',5)} · (${u(t2,'°C')} − 20)) / (1 + ${u(m.alpha,'1/K',5)} · (${u(t1,'°C')} − 20))`,u(R2,'Ω'),m.source)],
   assumptions:['Lineáris hőmérsékletfüggés (−50 … +250 °C között jó közelítés tiszta fémre).']};
 },
 formulas:['K = °C + 273,15','°F = °C · 9/5 + 32','R2 = R1 · (1 + α · (θ2 − 20)) / (1 + α · (θ1 − 20))'],
 notes:{good:['Külföldi adatlapok hőmérsékleteinek átváltása.','Tekercs- vagy vezetékellenállás átszámítása üzemi hőmérsékletre.'],bad:['Motortekercs melegedésének hivatalos mérése (arra a gyártói és a vonatkozó szabvány szerinti eljárás vonatkozik).','Ötvözetek, félvezetők, NTC/PTC ellenállások hőmérsékletfüggésére.']},
 safety:['alap'],
 examples:[
  {title:'20 °C',input:{mod:'atvaltas',T:'20',egyseg:'C'},expect:{F:68,K:293.15}},
  {title:'−40 °C',input:{mod:'atvaltas',T:'-40',egyseg:'C'},expect:{F:-40}},
  {title:'0 K',input:{mod:'atvaltas',T:'0',egyseg:'K'},expect:{C:-273.15}},
  {title:'100 °F',input:{mod:'atvaltas',T:'100',egyseg:'F'},expect:{C:37.7778,K:310.928}},
  {title:'Réz 10 Ω 20 °C-ról 70 °C-ra',input:{mod:'ellenallas',anyag:'Cu',R1:'10',t1:'20',t2:'70'},expect:{R2:11.965}},
  {title:'Alumínium 5 Ω 20 °C-ról 80 °C-ra',input:{mod:'ellenallas',anyag:'Al',R1:'5',t1:'20',t2:'80'},expect:{R2:6.209}},
 ],
 related:['vezetek-ellenallas','mertekegyseg-atvalto'],articles:[],
 sources:['Hőmérsékleti skálák definíciói (0 °C = 273,15 K; °F = °C · 9/5 + 32)',MATERIALS.Cu.source,MATERIALS.Al.source],
};
export default def;
