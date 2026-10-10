import {CalcError,type CalcDef,type ResultItem,type Step} from '../core';
import {si,step} from '../fields';

const pairs=[
 {value:'UR',label:'Feszültség és ellenállás (U, R)',short:'U, R ismert'},
 {value:'UI',label:'Feszültség és áram (U, I)',short:'U, I ismert'},
 {value:'IR',label:'Áram és ellenállás (I, R)',short:'I, R ismert'},
 {value:'PU',label:'Teljesítmény és feszültség (P, U)',short:'P, U ismert'},
 {value:'PI',label:'Teljesítmény és áram (P, I)',short:'P, I ismert'},
 {value:'PR',label:'Teljesítmény és ellenállás (P, R)',short:'P, R ismert'},
] as const;
const has=(k:string)=>pairs.filter(p=>p.value.includes(k)).map(p=>p.value);

const def:CalcDef={
 slug:'ohm-torveny',title:'Ohm-törvény',category:'alapok',tier:'T0',version:1,updated:'2026-10-10',
 short:'Két ismert értékből kiszámolja a feszültséget, az áramot, az ellenállást és a teljesítményt (U = I · R, P = U · I).',
 keywords:['ohm','ohm törvény','feszültség','áram','ellenállás','teljesítmény','U=IR','volt','amper'],
 synonyms:['ohm-torveny','ohmtorveny','u i r'],
 fields:[
  {id:'ismert',kind:'select',label:'Mit ismersz?',style:'select',default:'UR',options:pairs},
  {id:'U',kind:'number',label:'Feszültség',symbol:'U',units:'voltage',default:'230',positive:true,max:1e7,showIf:{field:'ismert',is:has('U')}},
  {id:'I',kind:'number',label:'Áram',symbol:'I',units:'current',default:'2',positive:true,max:1e6,showIf:{field:'ismert',is:has('I')}},
  {id:'R',kind:'number',label:'Ellenállás',symbol:'R',units:'resistance',default:'10',positive:true,max:1e12,showIf:{field:'ismert',is:has('R')}},
  {id:'P',kind:'number',label:'Teljesítmény',symbol:'P',units:'power',default:'100',positive:true,max:1e9,showIf:{field:'ismert',is:has('P')}},
 ],
 compute(v){
  const k=v.s('ismert');let U=0,I=0,R=0,P=0;const steps:Step[]=[];
  switch(k){
   case 'UR':U=v.n('U');R=v.n('R');I=U/R;P=U*I;steps.push(step('Áram','I = U / R',`I = ${si(U,'V')} / ${si(R,'Ω')}`,si(I,'A')),step('Teljesítmény','P = U · I',`P = ${si(U,'V')} · ${si(I,'A')}`,si(P,'W')));break;
   case 'UI':U=v.n('U');I=v.n('I');R=U/I;P=U*I;steps.push(step('Ellenállás','R = U / I',`R = ${si(U,'V')} / ${si(I,'A')}`,si(R,'Ω')),step('Teljesítmény','P = U · I',`P = ${si(U,'V')} · ${si(I,'A')}`,si(P,'W')));break;
   case 'IR':I=v.n('I');R=v.n('R');U=I*R;P=I*I*R;steps.push(step('Feszültség','U = I · R',`U = ${si(I,'A')} · ${si(R,'Ω')}`,si(U,'V')),step('Teljesítmény','P = I² · R',`P = (${si(I,'A')})² · ${si(R,'Ω')}`,si(P,'W')));break;
   case 'PU':P=v.n('P');U=v.n('U');I=P/U;R=U*U/P;steps.push(step('Áram','I = P / U',`I = ${si(P,'W')} / ${si(U,'V')}`,si(I,'A')),step('Ellenállás','R = U² / P',`R = (${si(U,'V')})² / ${si(P,'W')}`,si(R,'Ω')));break;
   case 'PI':P=v.n('P');I=v.n('I');U=P/I;R=P/(I*I);steps.push(step('Feszültség','U = P / I',`U = ${si(P,'W')} / ${si(I,'A')}`,si(U,'V')),step('Ellenállás','R = P / I²',`R = ${si(P,'W')} / (${si(I,'A')})²`,si(R,'Ω')));break;
   case 'PR':P=v.n('P');R=v.n('R');U=Math.sqrt(P*R);I=Math.sqrt(P/R);steps.push(step('Feszültség','U = √(P · R)',`U = √(${si(P,'W')} · ${si(R,'Ω')})`,si(U,'V')),step('Áram','I = √(P / R)',`I = √(${si(P,'W')} / ${si(R,'Ω')})`,si(I,'A')));break;
   default:throw new CalcError('Válaszd ki, melyik két értéket ismered.');
  }
  const known=new Set(k.split(''));
  const r=(id:'U'|'I'|'R'|'P',label:string,value:number,unit:string):ResultItem=>({id,label,value,unit,text:si(value,unit),primary:!known.has(id)});
  return {results:[r('U','Feszültség',U,'V'),r('I','Áram',I,'A'),r('R','Ellenállás',R,'Ω'),r('P','Teljesítmény',P,'W')],steps};
 },
 formulas:['U = I · R','I = U / R','R = U / I','P = U · I = I² · R = U² / R'],
 notes:{
  good:['Ohmos (lineáris) fogyasztók – fűtőszál, ellenállás – feszültségének, áramának és teljesítményének gyors becslése.','Egyenáramú körök és váltakozó áramú ohmos terhelések (cos φ = 1) számításához.'],
  bad:['Motorokhoz, LED-meghajtókhoz és más nemlineáris vagy induktív terhelésekhez: ott a cos φ és a hatásfok is számít (lásd a Teljesítmény kalkulátort).','Az izzólámpa hideg ellenállása jóval kisebb az üzemi értéknél – a bekapcsolási áram nem számolható így.'],
 },
 safety:['alap','kalkulator'],
 examples:[
  {title:'230 V, 10 Ω fűtőszál',input:{ismert:'UR',U:'230',R:'10'},expect:{I:23,P:5290}},
  {title:'12 V, 2 A',input:{ismert:'UI',U:'12',I:'2'},expect:{R:6,P:24}},
  {title:'0,5 A, 100 Ω',input:{ismert:'IR',I:'0,5',R:'100'},expect:{U:50,P:25}},
  {title:'60 W, 230 V',input:{ismert:'PU',P:'60',U:'230'},expect:{I:0.260870,R:881.667}},
  {title:'2 kW, 8,7 A',input:{ismert:'PI',P:'2','P.e':'kW',I:'8,7'},expect:{U:229.885,R:26.4236}},
  {title:'100 W, 4 Ω',input:{ismert:'PR',P:'100',R:'4'},expect:{U:20,I:5}},
  {title:'5 V, 220 Ω (mA-es áram)',input:{ismert:'UR',U:'5',R:'220'},expect:{I:0.0227273,P:0.113636}},
 ],
 related:['teljesitmeny','eredo-ellenallas','vezetek-ellenallas'],articles:[],
 sources:['Ohm-törvény és a Joule-törvény (P = U · I) – fizikai alapösszefüggések'],
};
export default def;
