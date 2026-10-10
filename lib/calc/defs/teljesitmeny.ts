import type {CalcDef,Step} from '../core';
import {apparentPower,sinOf,SQRT3} from '../formulas';
import {cosField,si,step,systemField,systemVoltage,u,voltageFields} from '../fields';

const def:CalcDef={
 slug:'teljesitmeny',title:'Villamos teljesítmény',category:'teljesitmeny',tier:'T0',version:1,updated:'2026-10-10',
 short:'Hatásos, látszólagos és meddő teljesítmény egyen-, egyfázisú és háromfázisú hálózatban, cos φ-vel (P = √3 · U · I · cos φ).',
 keywords:['teljesítmény','watt','kW','háromfázisú teljesítmény','egyfázisú teljesítmény','cos fi','P=UI','hatásos teljesítmény'],
 synonyms:['teljesitmeny szamitas','3 fazis teljesitmeny','harom fazisu teljesitmeny','kw szamitas'],
 fields:[
  systemField(true,'3f'),...voltageFields(true),
  {id:'I',kind:'number',label:'Áram',symbol:'I',units:'current',default:'16',positive:true,max:1e5},
  cosField('0,9'),
 ],
 compute(v){
  const sys=v.s('rendszer') as 'dc'|'1f'|'3f',U=systemVoltage(v,sys),I=v.n('I'),steps:Step[]=[];
  if(sys==='dc'){
   const P=U*I;steps.push(step('Teljesítmény','P = U · I',`P = ${u(U,'V')} · ${u(I,'A')}`,si(P,'W')));
   return {results:[{id:'P',label:'Teljesítmény',value:P,unit:'W',text:si(P,'W'),primary:true}],steps};
  }
  const cos=v.n('cos'),sin=sinOf(cos),S=apparentPower(sys,U,I),P=S*cos,Q=S*sin,k=sys==='3f'?'√3 · ':'',kv=sys==='3f'?`${u(SQRT3,'',4)} · `:'';
  steps.push(
   step('Látszólagos teljesítmény',`S = ${k}U · I`,`S = ${kv}${u(U,'V')} · ${u(I,'A')}`,si(S,'VA')),
   step('Hatásos teljesítmény','P = S · cos φ',`P = ${si(S,'VA')} · ${u(cos,'')}`,si(P,'W')),
   step('Meddő teljesítmény','Q = S · sin φ, sin φ = √(1 − cos² φ)',`Q = ${si(S,'VA')} · ${u(sin,'')}`,si(Q,'var')),
  );
  return {
   results:[{id:'P',label:'Hatásos teljesítmény',value:P,unit:'W',text:si(P,'W'),primary:true},{id:'S',label:'Látszólagos teljesítmény',value:S,unit:'VA',text:si(S,'VA')},{id:'Q',label:'Meddő teljesítmény',value:Q,unit:'var',text:si(Q,'var')}],
   steps,figure:{kind:'power-triangle',P,Q,S,phi:Math.acos(cos)*180/Math.PI,units:['W','var','VA']},
   assumptions:sys==='3f'?['Szimmetrikus háromfázisú terhelés; az U a vonali feszültség, az I a vonali áram.']:[],
  };
 },
 formulas:['DC: P = U · I','1f: P = U · I · cos φ','3f: P = √3 · U · I · cos φ','S = P / cos φ, Q = S · sin φ'],
 notes:{
  good:['Egy fogyasztó vagy áramkör teljesítményének becslése mért vagy névleges áramból.','A hatásos, a meddő és a látszólagos teljesítmény kapcsolatának szemléltetése (teljesítményháromszög).'],
  bad:['Aszimmetrikus háromfázisú terhelésnél a √3-as képlet nem pontos – fázisonként számolj (lásd Fázisterhelés).','Torz (nem szinuszos) áramú fogyasztóknál (pl. kapcsolóüzemű tápegységek) a cos φ önmagában nem írja le a teljesítménytényezőt.'],
 },
 safety:['alap','kalkulator'],
 examples:[
  {title:'Háromfázisú, 400 V, 16 A, cos φ = 0,9',input:{rendszer:'3f',Uv:'400',I:'16',cos:'0,9'},expect:{P:9976.61,S:11085.1,Q:4831.89}},
  {title:'Egyfázisú, 230 V, 10 A, ohmos',input:{rendszer:'1f',U:'230',I:'10',cos:'1'},expect:{P:2300,S:2300,Q:0}},
  {title:'Egyenáram, 24 V, 5 A',input:{rendszer:'dc',Udc:'24',I:'5'},expect:{P:120}},
  {title:'Egyfázisú, 230 V, 5 A, cos φ = 0,8',input:{rendszer:'1f',U:'230',I:'5',cos:'0,8'},expect:{P:920,S:1150,Q:690}},
  {title:'Háromfázisú, 400 V, 32 A, cos φ = 0,85',input:{rendszer:'3f',Uv:'400',I:'32',cos:'0,85'},expect:{P:18844.7,S:22170.3}},
 ],
 related:['aram-teljesitmenybol','latszolagos-meddo-teljesitmeny','fazisterheles','ohm-torveny'],articles:[],
 sources:['Váltakozó áramú teljesítmény-összefüggések (P = U · I · cos φ; háromfázisú szimmetrikus terhelésre P = √3 · U · I · cos φ)','MSZ EN 60038 – 230/400 V névleges feszültség'],
};
export default def;
