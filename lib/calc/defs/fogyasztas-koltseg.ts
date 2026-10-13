import type {CalcDef,Issue,ResultItem} from '../core';
import {formatFixed} from '../number';
import {step,u} from '../fields';

const huf=(n:number)=>formatFixed(n,0)+'\u00a0Ft';
const DAYS=365;

const def:CalcDef={
 slug:'fogyasztas-koltseg',title:'Fogyasztás és költség',category:'teljesitmeny',tier:'T0',version:1,updated:'2026-10-10',
 short:'Készülékek napi, havi és éves energiafogyasztása kWh-ban, és a költség a saját áramdíjaddal (kWh × Ft/kWh), legfeljebb 50 tételre.',
 keywords:['fogyasztás','energia','kWh','villanyszámla','áramdíj','költség','üzemeltetési költség','éves fogyasztás'],
 synonyms:['aramfogyasztas','villanyszamla','energiafogyasztas','kwh ar'],
 fields:[
  {id:'sorok',kind:'rows',label:'Készülékek',minRows:1,maxRows:50,default:'2000*0,25*1',help:'Soronként: teljesítmény (W), napi üzemidő (óra), darabszám.',columns:[
   {id:'P',label:'Teljesítmény',unit:'W',min:0,max:1e6},
   {id:'h',label:'Üzemidő naponta',unit:'h',min:0,max:24},
   {id:'db',label:'Darab',default:'1',integer:true,min:1,max:1000},
  ]},
  {id:'ar',kind:'number',label:'Áramdíj (saját tarifád)',symbol:'c',unit:'Ft/kWh',optional:true,min:0,max:10000,placeholder:'pl. 36 (példaérték)',help:'A tarifádat a villanyszámládon találod; a program nem tartalmaz árat.'},
 ],
 compute(v){
  const rows=v.rows('sorok'),price=v.opt('ar');
  const day=rows.reduce((s,[P,h,n])=>s+P*h*n,0)/1000,month=day*DAYS/12,year=day*DAYS;
  const results:ResultItem[]=[
   {id:'nap',label:'Napi fogyasztás',value:day,unit:'kWh',text:u(day,'kWh')},
   {id:'ho',label:'Havi fogyasztás',value:month,unit:'kWh',text:u(month,'kWh')},
   {id:'ev',label:'Éves fogyasztás',value:year,unit:'kWh',text:u(year,'kWh'),primary:price===undefined},
  ];
  const terms=rows.map(([P,h,n])=>`${u(P,'W')} · ${u(h,'h')}${n!==1?' · '+n:''}`).join(' + ');
  const steps=[step('Napi energia','E_nap = Σ (P · t · db) / 1000',`E_nap = (${terms}) / 1000`,u(day,'kWh')),step('Éves energia','E_év = E_nap · 365',`E_év = ${u(day,'kWh')} · 365`,u(year,'kWh')),step('Havi energia','E_hó = E_év / 12',`E_hó = ${u(year,'kWh')} / 12`,u(month,'kWh'))];
  const issues:Issue[]=[];
  if(price!==undefined){
   results.push({id:'ft_ho',label:'Havi költség',value:month*price,unit:'Ft',text:huf(month*price)},{id:'ft_ev',label:'Éves költség',value:year*price,unit:'Ft',text:huf(year*price),primary:true});
   steps.push(step('Havi költség','K_hó = E_hó · c',`K_hó = ${u(month,'kWh')} · ${u(price,'Ft/kWh')}`,huf(month*price)),step('Éves költség','K_év = E_év · c',`K_év = ${u(year,'kWh')} · ${u(price,'Ft/kWh')}`,huf(year*price)));
  }else issues.push({level:'info',text:'Add meg az áramdíjat (Ft/kWh) a költséghez. Az ár tarifánként és idővel változik, ezért a program nem tartalmaz árat.'});
  return {results,steps,issues,assumptions:['Az év 365 nap, a hónap az év tizenketted része (≈ 30,4 nap).','Állandó teljesítményfelvétel az üzemidő alatt; a készenléti fogyasztás és a termosztátos ki-be kapcsolás nincs benne.']};
 },
 formulas:['E = P · t (Wh), E[kWh] = P[W] · t[h] / 1000','E_év = E_nap · 365; E_hó = E_év / 12','Költség = E · áramdíj (Ft/kWh)'],
 notes:{good:['Háztartási készülékek fogyasztásának és költségének összevetése.','Annak becslése, mennyit jelent egy készülék cseréje évente.'],bad:['A villanyszámla pontos előrejelzése: a rendszerhasználati és egyéb díjakat, sávos tarifát nem tartalmazza.','Hőszivattyú, klíma, hűtő: a tényleges üzemidő az időjárástól és a termosztáttól függ.']},
 safety:['alap'],
 examples:[
  {title:'2000 W napi negyed órában, 36 Ft/kWh (példaérték)',input:{sorok:'2000*0,25*1',ar:'36'},expect:{nap:0.5,ev:182.5,ft_ev:6570}},
  {title:'Router és három izzó',input:{sorok:'10*24*1;60*5*3'},expect:{nap:1.14,ev:416.1}},
  {title:'Hűtő 100 W egész nap, 3 db 60 W 5 órát',input:{sorok:'100*24*1;60*5*3'},expect:{nap:3.3,ev:1204.5,ho:100.375}},
  {title:'1500 W napi 1 óra, 70 Ft/kWh (példaérték)',input:{sorok:'1500*1*1',ar:'70'},expect:{ev:547.5,ft_ev:38325,ft_ho:3193.75}},
 ],
 related:['aram-teljesitmenybol','teljesitmeny','akkumulator-uzemido','mertekegyseg-atvalto'],articles:[],
 sources:['Energia = teljesítmény × idő; 1 kWh = 1000 Wh – alapösszefüggés'],
};
export default def;
