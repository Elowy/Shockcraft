import type {CalcDef,ResultItem,Step} from '../core';
import {SQRT3} from '../formulas';
import {si,step,u} from '../fields';

const def:CalcDef={
 slug:'transzformator',title:'Transzformátor áttétele és áramai',category:'gepek',tier:'T0',version:1,updated:'2026-10-10',
 short:'Ideális transzformátor áttétele, primer és szekunder árama a névleges teljesítményből (1f és 3f), opcionálisan a szekunder menetszámmal.',
 keywords:['transzformátor','trafó','áttétel','menetszám','primer áram','szekunder áram','VA','kVA'],
 synonyms:['trafo','transzformator','attetel','menetszam'],
 fields:[
  {id:'rendszer',kind:'select',label:'Rendszer',style:'segmented',default:'1f',options:[{value:'1f',label:'Egyfázisú',short:'1f'},{value:'3f',label:'Háromfázisú',short:'3f'}]},
  {id:'U1',kind:'number',label:'Primer feszültség',symbol:'U1',units:'voltage',default:'230',positive:true,max:1e6},
  {id:'U2',kind:'number',label:'Szekunder feszültség',symbol:'U2',units:'voltage',default:'12',positive:true,max:1e6},
  {id:'S',kind:'number',label:'Névleges teljesítmény',symbol:'S',units:'apparent',default:'60',positive:true,max:1e9},
  {id:'N1',kind:'number',label:'Primer menetszám (nem kötelező)',symbol:'N1',unit:'menet',optional:true,integer:true,min:1,max:1e6},
 ],
 compute(v){
  const tri=v.s('rendszer')==='3f',U1=v.n('U1'),U2=v.n('U2'),S=v.n('S'),N1=v.opt('N1'),k=tri?SQRT3:1,kt=tri?'√3 · ':'';
  const a=U1/U2,I1=S/(k*U1),I2=S/(k*U2);
  const steps:Step[]=[step('Áttétel','a = U1 / U2',`a = ${u(U1,'V')} / ${u(U2,'V')}`,u(a,'')),step('Primer áram',`I1 = S / (${kt}U1)`,`I1 = ${si(S,'VA')} / (${kt}${u(U1,'V')})`,si(I1,'A')),step('Szekunder áram',`I2 = S / (${kt}U2)`,`I2 = ${si(S,'VA')} / (${kt}${u(U2,'V')})`,si(I2,'A'))];
  const results:ResultItem[]=[{id:'a',label:'Áttétel (U1/U2)',value:a,text:u(a,'')},{id:'I1',label:'Primer áram',value:I1,unit:'A',text:si(I1,'A')},{id:'I2',label:'Szekunder áram',value:I2,unit:'A',text:si(I2,'A'),primary:true}];
  if(N1){const N2=N1/a;results.push({id:'N2',label:'Szekunder menetszám',value:N2,unit:'menet',text:u(N2,'menet',1)});steps.push(step('Szekunder menetszám','N2 = N1 / a',`N2 = ${N1} / ${u(a,'')}`,u(N2,'menet',1)))}
  return {results,steps,assumptions:['Ideális (veszteségmentes) transzformátor: a valós szekunder feszültség terhelés alatt kisebb, üresjárásban nagyobb.',...(tri?['Háromfázisú: vonali feszültségek és vonali áramok, szimmetrikus terhelés.']:[])]};
 },
 formulas:['a = U1 / U2 = N1 / N2','1f: I = S / U','3f: I = S / (√3 · U)'],
 notes:{good:['Biztonsági (törpefeszültségű) transzformátor áramainak becslése, a szekunder vezeték és biztosíték előzetes kiválasztásához.','Elosztói transzformátor névleges áramainak becslése.'],bad:['Bekapcsolási áramlökés vagy zárlati áram számítására (a drop-feszültség, uk% kell hozzá).','Transzformátor tekercselésének méretezésére.']},
 safety:['alap','kalkulator'],
 examples:[
  {title:'230/12 V, 60 VA',input:{rendszer:'1f',U1:'230',U2:'12',S:'60','S.e':'VA'},expect:{I2:5,I1:0.26087,a:19.1667}},
  {title:'Háromfázisú 10/0,4 kV, 100 kVA',input:{rendszer:'3f',U1:'10','U1.e':'kV',U2:'400',S:'100','S.e':'kVA'},expect:{I1:5.7735,I2:144.338,a:25}},
  {title:'230/12 V, N1 = 1000 menet',input:{rendszer:'1f',U1:'230',U2:'12',S:'60','S.e':'VA',N1:'1000'},expect:{N2:52.1739}},
  {title:'230/24 V, 160 VA',input:{rendszer:'1f',U1:'230',U2:'24',S:'160','S.e':'VA'},expect:{I2:6.66667,I1:0.695652}},
 ],
 related:['teljesitmeny','aram-teljesitmenybol','led-szalag-tapegyseg'],articles:[],
 sources:['Ideális transzformátor összefüggései (U1/U2 = N1/N2 = I2/I1) – alapösszefüggés'],
};
export default def;
