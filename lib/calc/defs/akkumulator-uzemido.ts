import type {CalcDef} from '../core';
import {step,u} from '../fields';

/** Óra → „5 óra 46 perc”. */
function hoursText(h:number){const m=Math.round(h*60);const hh=Math.floor(m/60),mm=m%60;return hh?hh+' óra'+(mm?' '+mm+' perc':''):mm+' perc'}

const def:CalcDef={
 slug:'akkumulator-uzemido',title:'Akkumulátor üzemideje',category:'gepek',tier:'T0',version:1,updated:'2026-10-10',
 short:'Meddig bírja az akkumulátor? Üzemidő a kapacitásból, feszültségből, a kisütési mélységből és az átalakítás hatásfokából (t = C · U · DoD · η / P).',
 keywords:['akkumulátor','akku','üzemidő','Ah','mAh','kapacitás','szünetmentes','UPS','inverter','napelem akkumulátor'],
 synonyms:['akku uzemido','meddig biri','ups uzemido','akkumulator kapacitas'],
 fields:[
  {id:'C',kind:'number',label:'Kapacitás',symbol:'C',units:'charge',default:'100',positive:true,max:1e6},
  {id:'U',kind:'number',label:'Névleges feszültség',symbol:'U',unit:'V',default:'12',positive:true,max:2000},
  {id:'dod',kind:'number',label:'Felhasználható kisütési mélység',symbol:'DoD',unit:'%',default:'50',positive:true,max:100,help:'Ólomakkumulátornál jellemzően 50 %, lítiumnál 80–90 % (gyártói adat).'},
  {id:'eta',kind:'number',label:'Átalakítási hatásfok',symbol:'η',default:'0,9',min:0.05,max:1,help:'Inverter vagy DC–DC átalakító hatásfoka; közvetlen DC-fogyasztónál 1.'},
  {id:'P',kind:'number',label:'Fogyasztó teljesítménye',symbol:'P',units:'power',default:'60',positive:true,max:1e8},
 ],
 compute(v){
  const C=v.n('C'),U=v.n('U'),dod=v.n('dod'),eta=v.n('eta'),P=v.n('P');
  const E=C*U,Eu=E*dod/100*eta,t=Eu/P,I=P/(U*eta);
  return {
   results:[{id:'t',label:'Becsült üzemidő',value:t,unit:'h',text:u(t,'h')+' ('+hoursText(t)+')',primary:true},{id:'E',label:'Névleges energia',value:E,unit:'Wh',text:u(E,'Wh')},{id:'Eu',label:'Felhasználható energia',value:Eu,unit:'Wh',text:u(Eu,'Wh')},{id:'I',label:'Akkumulátoráram',value:I,unit:'A',text:u(I,'A')}],
   steps:[step('Névleges energia','E = C · U',`E = ${u(C,'Ah')} · ${u(U,'V')}`,u(E,'Wh')),step('Felhasználható energia','Ef = E · DoD · η',`Ef = ${u(E,'Wh')} · ${u(dod,'%')} · ${u(eta,'')}`,u(Eu,'Wh')),step('Üzemidő','t = Ef / P',`t = ${u(Eu,'Wh')} / ${u(P,'W')}`,u(t,'h'))],
   assumptions:['Állandó terhelés; a nagy kisütőáram miatti kapacitáscsökkenés (Peukert-hatás), az öregedés és a hőmérséklet nincs benne.'],
  };
 },
 formulas:['E = C · U','t = C · U · DoD · η / P','I_akku = P / (U · η)'],
 notes:{good:['Szünetmentes táp, kerti vagy hordozható rendszer előzetes méretezése.','Különböző akkumulátorok összehasonlítása.'],bad:['Nagy áramú (pl. motorindító) terhelés üzemideje.','Hideg környezetben vagy öreg akkumulátorral: a valós kapacitás jóval kisebb lehet.']},
 safety:['alap','kalkulator'],
 examples:[
  {title:'100 Ah, 12 V, 50 %, η = 0,9, 60 W',input:{C:'100','C.e':'Ah',U:'12',dod:'50',eta:'0,9',P:'60'},expect:{t:9,E:1200,Eu:540}},
  {title:'200 Ah, 12 V, 80 %, η = 0,9, 300 W',input:{C:'200','C.e':'Ah',U:'12',dod:'80',eta:'0,9',P:'300'},expect:{t:5.76}},
  {title:'2000 mAh, 3,7 V, 100 %, 1 W',input:{C:'2000','C.e':'mAh',U:'3,7',dod:'100',eta:'1',P:'1'},expect:{t:7.4}},
  {title:'50 Ah, 24 V, 50 %, η = 0,85, 100 W',input:{C:'50','C.e':'Ah',U:'24',dod:'50',eta:'0,85',P:'100'},expect:{t:5.1,I:4.90196}},
 ],
 related:['fogyasztas-koltseg','aram-teljesitmenybol','led-szalag-tapegyseg'],articles:[],
 sources:['Energiamérleg: E = C · U, t = E / P – alapösszefüggés'],
};
export default def;
