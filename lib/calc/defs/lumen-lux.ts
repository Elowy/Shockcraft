import type {CalcDef} from '../core';
import {step,u} from '../fields';

const def:CalcDef={
 slug:'lumen-lux',title:'Lumen és lux (lámpák száma)',category:'vilagitas',tier:'T0',version:1,updated:'2026-10-10',
 short:'Hány lámpatest kell a kívánt megvilágításhoz? Hatásfok-módszer: N = E · A / (Φ · η · k), és a megvalósuló átlagos megvilágítás luxban.',
 keywords:['lumen','lux','megvilágítás','lámpák száma','világítás tervezés','fényáram','lm','lx'],
 synonyms:['lumen lux','hany lampa','megvilagitas','vilagitas szamitas'],
 fields:[
  {id:'mod',kind:'select',label:'Mit számolsz?',style:'segmented',default:'darab',options:[{value:'darab',label:'Lámpák száma'},{value:'megvilagitas',label:'Megvilágítás',short:'megvilágítás'}]},
  {id:'A',kind:'number',label:'Helyiség alapterülete',symbol:'A',unit:'m²',default:'20',positive:true,max:1e5},
  {id:'E',kind:'number',label:'Kívánt átlagos megvilágítás',symbol:'E',unit:'lx',default:'500',positive:true,max:1e5,showIf:{field:'mod',is:['darab']},help:'Tájékoztató példák: lakószoba 100–300 lx, iroda és munkahely 500 lx; a követelményt a vonatkozó szabvány adja.'},
  {id:'N',kind:'number',label:'Lámpatestek száma',symbol:'N',unit:'db',default:'7',integer:true,min:1,max:10000,showIf:{field:'mod',is:['megvilagitas']}},
  {id:'fi',kind:'number',label:'Egy lámpatest fényárama',symbol:'Φ',unit:'lm',default:'4000',positive:true,max:1e7},
  {id:'eta',kind:'number',label:'Kihasználási tényező',symbol:'η',default:'0,5',min:0.05,max:1,help:'A helyiség és a lámpatest jellemzőitől függ (gyártói adat); példaérték: 0,5.'},
  {id:'k',kind:'number',label:'Karbantartási tényező',symbol:'k',default:'0,8',min:0.1,max:1,help:'Az öregedés és szennyeződés miatti csökkenés; példaérték: 0,8.'},
 ],
 compute(v){
  const A=v.n('A'),fi=v.n('fi'),eta=v.n('eta'),k=v.n('k'),eff=fi*eta*k;
  if(v.s('mod')==='darab'){
   const E=v.n('E'),exact=E*A/eff,N=Math.ceil(exact-1e-9),Eact=N*eff/A;
   return {results:[{id:'N',label:'Szükséges lámpatestek',value:N,unit:'db',text:N+'\u00a0db',primary:true},{id:'E',label:'Megvalósuló átlagos megvilágítás',value:Eact,unit:'lx',text:u(Eact,'lx')},{id:'Nexact',label:'Számított (nem kerekített) darabszám',value:exact,text:u(exact,'')},{id:'fiTotal',label:'Szükséges összes fényáram',value:E*A/(eta*k),unit:'lm',text:u(E*A/(eta*k),'lm')}],
    steps:[step('Lámpák száma','N = E · A / (Φ · η · k)',`N = ${u(E,'lx')} · ${u(A,'m²')} / (${u(fi,'lm')} · ${u(eta,'')} · ${u(k,'')})`,u(exact,'')+' → '+N+' db (felfelé kerekítve)'),step('Megvalósuló megvilágítás','E = N · Φ · η · k / A',`E = ${N} · ${u(fi,'lm')} · ${u(eta,'')} · ${u(k,'')} / ${u(A,'m²')}`,u(Eact,'lx'))],
    assumptions:['Átlagos megvilágítás egyenletes elrendezésnél; az egyenletességet és a káprázást nem vizsgálja.']};
  }
  const N=v.n('N'),E=N*eff/A;
  return {results:[{id:'E',label:'Átlagos megvilágítás',value:E,unit:'lx',text:u(E,'lx'),primary:true}],steps:[step('Megvilágítás','E = N · Φ · η · k / A',`E = ${N} · ${u(fi,'lm')} · ${u(eta,'')} · ${u(k,'')} / ${u(A,'m²')}`,u(E,'lx'))],assumptions:['Átlagos megvilágítás egyenletes elrendezésnél.']};
 },
 formulas:['N = E · A / (Φ · η · k)','E = N · Φ · η · k / A','1 lx = 1 lm/m²'],
 notes:{good:['Előzetes becslés a lámpatestek számára és a fényforrás kiválasztására.','LED-csere előtt a régi és az új megvilágítás összevetése.'],bad:['Munkahelyi világítás igazolására – ahhoz pontonkénti fénytechnikai számítás kell.','Vészvilágítás tervezésére.']},
 safety:['alap'],
 examples:[
  {title:'20 m², 500 lx, 4000 lm, η = 0,5, k = 0,8',input:{mod:'darab',A:'20',E:'500',fi:'4000',eta:'0,5',k:'0,8'},expect:{N:7,E:560}},
  {title:'12 m², 300 lx, 800 lm',input:{mod:'darab',A:'12',E:'300',fi:'800',eta:'0,5',k:'0,8'},expect:{N:12,E:320}},
  {title:'15 m², 6 db 1000 lm',input:{mod:'megvilagitas',A:'15',N:'6',fi:'1000',eta:'0,5',k:'0,8'},expect:{E:160}},
  {title:'30 m², 200 lx, 1500 lm, η = 0,6',input:{mod:'darab',A:'30',E:'200',fi:'1500',eta:'0,6',k:'0,8'},expect:{N:9,E:216}},
 ],
 related:['led-szalag-tapegyseg','fogyasztas-koltseg','mertekegyseg-atvalto'],articles:[],
 sources:['Hatásfok- (kihasználási tényező-) módszer az átlagos megvilágításra – fénytechnikai alapösszefüggés (1 lx = 1 lm/m²)'],
};
export default def;
