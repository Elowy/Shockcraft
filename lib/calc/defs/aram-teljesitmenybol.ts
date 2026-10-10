import type {CalcDef,Issue} from '../core';
import {MCB_RATINGS,nextAtLeast} from '../constants';
import {currentFromPower} from '../formulas';
import {cosField,si,step,systemField,systemVoltage,u,voltageFields} from '../fields';

const def:CalcDef={
 slug:'aram-teljesitmenybol',title:'Áram teljesítményből',category:'teljesitmeny',tier:'T0',version:1,updated:'2026-10-10',
 short:'Mekkora áramot vesz fel egy fogyasztó? I = P / (U · cos φ · η), háromfázisnál √3-mal, a következő kismegszakító-értékkel tájékoztatásul.',
 keywords:['áram','amper','teljesítményből áram','hány amper','fogyasztó árama','kW amper','watt amper'],
 synonyms:['aram szamitas','hany amper','kw to amper','watt to amper','aramfelvetel'],
 fields:[
  systemField(true,'1f'),
  {id:'P',kind:'number',label:'Teljesítmény',symbol:'P',units:'power',default:'3000',positive:true,max:1e8},
  ...voltageFields(true),cosField('1'),
  {id:'eta',kind:'number',label:'Hatásfok',symbol:'η',default:'1',positive:true,max:1,help:'Ha a P a leadott (pl. tengely-) teljesítmény, add meg a hatásfokot; egyébként 1.'},
 ],
 compute(v){
  const sys=v.s('rendszer') as 'dc'|'1f'|'3f',U=systemVoltage(v,sys),P=v.n('P'),eta=v.n('eta'),cos=sys==='dc'?1:v.n('cos');
  const I=currentFromPower(sys,P,U,cos,eta);
  const formula=sys==='3f'?'I = P / (√3 · U · cos φ · η)':sys==='dc'?'I = P / (U · η)':'I = P / (U · cos φ · η)';
  const subst=sys==='3f'?`I = ${si(P,'W')} / (√3 · ${u(U,'V')} · ${u(cos,'')} · ${u(eta,'')})`:sys==='dc'?`I = ${si(P,'W')} / (${u(U,'V')} · ${u(eta,'')})`:`I = ${si(P,'W')} / (${u(U,'V')} · ${u(cos,'')} · ${u(eta,'')})`;
  const mcb=nextAtLeast(I,MCB_RATINGS.value),issues:Issue[]=[];
  if(sys!=='dc')issues.push({level:'info',text:mcb?`A következő kismegszakító-névleges áram az előnyös értéksorból (MSZ EN 60898-1): ${mcb} A – csak tájékoztató: a védelmet a vezeték terhelhetősége (Ib ≤ In ≤ Iz) és a hurokimpedancia alapján kell kiválasztani.`:'Az áram meghaladja a kismegszakítók szokásos tartományát (125 A).'});
  return {
   results:[{id:'I',label:'Áram',value:I,unit:'A',text:si(I,'A'),primary:true},...(sys!=='dc'&&mcb?[{id:'mcb',label:'Következő kismegszakító-érték (tájékoztató)',value:mcb,unit:'A',text:mcb+'\u00a0A'}]:[])],
   steps:[step('Áram',formula,subst,si(I,'A'))],issues,
   assumptions:sys==='3f'?['Szimmetrikus háromfázisú terhelés; az áram vonali (fázis-) áram.']:[],
  };
 },
 formulas:['DC: I = P / (U · η)','1f: I = P / (U · cos φ · η)','3f: I = P / (√3 · U · cos φ · η)'],
 notes:{
  good:['Fogyasztó áramfelvételének becslése adattábla-teljesítményből (pl. vízmelegítő, főzőlap, kazán).','Annak ellenőrzése, hogy egy fogyasztó nagyságrendileg melyik áramkörre fér rá.'],
  bad:['Védelem kiválasztására: a kismegszakító névleges árama a vezetéktől is függ (Ib ≤ In ≤ Iz).','Motorok indítási áramára: az a névleges áram többszöröse is lehet (lásd Motor névleges árama).'],
 },
 safety:['alap','kalkulator'],
 examples:[
  {title:'3000 W egyfázisú fogyasztó',input:{rendszer:'1f',P:'3000',U:'230',cos:'1',eta:'1'},expect:{I:13.0435,mcb:16}},
  {title:'11 kW háromfázisú fűtés',input:{rendszer:'3f',P:'11','P.e':'kW',Uv:'400',cos:'1',eta:'1'},expect:{I:15.8771,mcb:16}},
  {title:'60 W, 12 V egyenáram',input:{rendszer:'dc',P:'60',Udc:'12',eta:'1'},expect:{I:5}},
  {title:'2 kW, cos φ = 0,9, η = 0,95',input:{rendszer:'1f',P:'2','P.e':'kW',U:'230',cos:'0,9',eta:'0,95'},expect:{I:10.1704,mcb:13}},
  {title:'7,2 kW háromfázisú, cos φ = 0,95',input:{rendszer:'3f',P:'7200',Uv:'400',cos:'0,95',eta:'1'},expect:{I:10.9393,mcb:13}},
 ],
 related:['teljesitmeny','motor-aram','fazisterheles','latszolagos-meddo-teljesitmeny'],articles:[],
 sources:['Teljesítmény-összefüggés átrendezve (I = P / (U · cos φ · η))',MCB_RATINGS.source],
};
export default def;
