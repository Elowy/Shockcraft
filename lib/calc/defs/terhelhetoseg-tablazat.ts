import type {CalcDef} from '../core';
import {SIZING_NOT_COVERED} from '../../sizing-formulas';
import {nb,step,u} from '../fields';
import {fmtNum} from '../../sizing-formulas';
import {SECTIONS} from '../../sizing-tables';
import {ambientField,groupField,insulationField,izFor,loadedField,methodField,tag} from '../sizing-fields';

export const sectionId=(s:number)=>'s'+String(s).replace('.','_');

const def:CalcDef={
 slug:'terhelhetoseg-tablazat',title:'Terhelhetőségi táblázat',category:'vezetekek',tier:'T1',tables:true,version:1,updated:'2026-10-10',
 short:'Rézvezetékek terhelhetősége (Iz0) 1,5–35 mm²-ig a választott szerelési módra, hőmérsékletre és csoportosításra javítva (Iz = Iz0 · kθ · kcs).',
 keywords:['terhelhetőség','terhelhetőségi táblázat','Iz','áramterhelhetőség','kábel terhelhetőség','szerelési mód','B2','A1'],
 synonyms:['terhelhetoseg','aramterhelhetoseg','kabel terhelhetoseg','iz tablazat'],
 fields:[methodField,insulationField,loadedField,ambientField,groupField],
 compute(v){
  const rows=SECTIONS.map(s=>({s,x:izFor(v,s)!}));
  const first=rows[0].x;
  return {
   results:[...rows.map(({s,x})=>({id:sectionId(s),label:fmtNum(s)+nb+'mm²',value:x.iz,unit:'A',text:u(x.iz,'A')})),{id:'kt',label:'Hőmérsékleti tényező kθ',value:first.kt,text:u(first.kt,'')+' '+tag(first.refs[1])},{id:'kg',label:'Csoportosítási tényező kcs',value:first.kg,text:u(first.kg,'')+' '+tag(first.refs[2])}],
   steps:[step('Javított terhelhetőség','Iz = Iz0 · kθ · kcs',`kθ = ${u(first.kt,'')} ${tag(first.refs[1])}; kcs = ${u(first.kg,'')} ${tag(first.refs[2])}`,'lásd a táblázatot','MSZ HD 60364-5-52 523, B.52.14, B.52.17')],
   table:{caption:'Terhelhetőség ('+v.s('mod')+', '+v.s('szig')+', '+v.s('erek')+' terhelt ér)',head:['Keresztmetszet','Iz0 (táblázat)','Iz (javított)','Forrás'],rows:rows.map(({s,x})=>[fmtNum(s)+nb+'mm²',u(x.iz0,'A'),u(x.iz,'A'),x.refs[0].short+' · '+x.refs[0].status])},
   assumptions:first.assumptions,
  };
 },
 formulas:['Iz = Iz0 · kθ · kcs'],
 notes:{good:['Gyors áttekintés: melyik keresztmetszet mekkora áramot bír az adott szerelési módban.','A Keresztmetszet-választás és a Kismegszakító-választás eredményeinek ellenőrzése.'],bad:['Gyártói adatlap helyett speciális kábelekre (pl. gumiszigetelésű, árnyékolt, hőálló).','Földben, szabad levegőn vagy kábeltálcán vezetett kábelekre (D, E, F, G mód).']},
 safety:['alap','meretezes'],notCovered:SIZING_NOT_COVERED,
 examples:[
  {title:'B2, PVC, 2 ér, 30 °C, 1 áramkör',input:{mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1'},expect:{s1_5:16.5,s2_5:23,s4:30,s35:111}},
  {title:'B2, 35 °C, 3 áramkör együtt',input:{mod:'B2',szig:'PVC',erek:'2',temp:'35',csop:'3'},expect:{s2_5:15.134,kt:0.94,kg:0.7}},
  {title:'C, 3 ér, 30 °C',input:{mod:'C',szig:'PVC',erek:'3',temp:'30',csop:'1'},expect:{s1_5:17.5,s6:41}},
 ],
 related:['keresztmetszet','kismegszakito','feszultseges'],articles:[],
 sources:['MSZ HD 60364-5-52:2011 B.52.2, B.52.4, B.52.14, B.52.17 – a lib/sizing-tables.ts értékeivel (jóváhagyás függőben)'],
};
export default def;
