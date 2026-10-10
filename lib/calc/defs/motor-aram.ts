import type {CalcDef,Issue,ResultItem,Step} from '../core';
import {currentFromPower} from '../formulas';
import {si,step,u} from '../fields';

const def:CalcDef={
 slug:'motor-aram',title:'Motor névleges árama',category:'gepek',tier:'T1',version:1,updated:'2026-10-10',
 short:'Villanymotor névleges áramának becslése a leadott teljesítményből, a feszültségből, a cos φ-ből és a hatásfokból, opcionálisan az indítási árammal.',
 keywords:['motor áram','motor névleges áram','villanymotor','kW amper motor','indítási áram','háromfázisú motor','egyfázisú motor'],
 synonyms:['motoraram','motor amper','motor kw','inditasi aram'],
 fields:[
  {id:'rendszer',kind:'select',label:'Rendszer',style:'segmented',default:'3f',options:[{value:'1f',label:'Egyfázisú (230 V)',short:'1f'},{value:'3f',label:'Háromfázisú (400 V)',short:'3f'}]},
  {id:'P',kind:'number',label:'Leadott (tengely-) teljesítmény',symbol:'P',units:'motorPower',default:'5,5',positive:true,max:1e7},
  {id:'U',kind:'number',label:'Feszültség',symbol:'U',unit:'V',default:'230',positive:true,max:1e4,showIf:{field:'rendszer',is:['1f']}},
  {id:'Uv',kind:'number',label:'Vonali feszültség',symbol:'U',unit:'V',default:'400',positive:true,max:1e4,showIf:{field:'rendszer',is:['3f']}},
  {id:'cos',kind:'number',label:'Teljesítménytényező',symbol:'cos φ',default:'0,85',positive:true,max:1},
  {id:'eta',kind:'number',label:'Hatásfok',symbol:'η',default:'0,87',positive:true,max:1},
  {id:'k',kind:'number',label:'Indítási áramarány Ia/In (nem kötelező)',symbol:'Ia/In',optional:true,min:1,max:15,help:'Adattábláról vagy katalógusból; közvetlen indításnál jellemzően 5–8.'},
 ],
 compute(v){
  const tri=v.s('rendszer')==='3f',P=v.n('P'),U=tri?v.n('Uv'):v.n('U'),cos=v.n('cos'),eta=v.n('eta'),k=v.opt('k');
  const I=currentFromPower(tri?'3f':'1f',P,U,cos,eta),Pin=P/eta,S=Pin/cos;
  const steps:Step[]=[step('Felvett teljesítmény','P1 = P / η',`P1 = ${si(P,'W')} / ${u(eta,'')}`,si(Pin,'W')),step('Névleges áram',tri?'In = P / (√3 · U · cos φ · η)':'In = P / (U · cos φ · η)',tri?`In = ${si(P,'W')} / (√3 · ${u(U,'V')} · ${u(cos,'')} · ${u(eta,'')})`:`In = ${si(P,'W')} / (${u(U,'V')} · ${u(cos,'')} · ${u(eta,'')})`,u(I,'A'))];
  const results:ResultItem[]=[{id:'I',label:'Becsült névleges áram',value:I,unit:'A',text:u(I,'A'),primary:true},{id:'Pin',label:'Felvett hatásos teljesítmény',value:Pin,unit:'W',text:si(Pin,'W')},{id:'S',label:'Látszólagos teljesítmény',value:S,unit:'VA',text:si(S,'VA')}];
  if(k!==undefined){results.push({id:'Ia',label:'Becsült indítási áram',value:I*k,unit:'A',text:u(I*k,'A')});steps.push(step('Indítási áram','Ia = (Ia/In) · In',`Ia = ${u(k,'')} · ${u(I,'A')}`,u(I*k,'A')))}
  const issues:Issue[]=[{level:'info',text:'A motor adattábláján szereplő névleges áram az irányadó; ez a számítás csak becslés, ha az adattábla nem olvasható.'}];
  return {results,steps,issues,assumptions:['Névleges terhelés, névleges feszültség és frekvencia.',...(tri?['Szimmetrikus háromfázisú motor; vonali áram.']:[])]};
 },
 formulas:['3f: In = P / (√3 · U · cos φ · η)','1f: In = P / (U · cos φ · η)','Ia = (Ia/In) · In'],
 notes:{good:['Hiányos adattáblájú motor áramának becslése.','A kábel- és védelemválasztás előtti nagyságrendi becslés.'],bad:['Motorvédő kapcsoló vagy hőrelé beállítására: ahhoz az adattábla névleges árama kell.','Frekvenciaváltós, csillag–delta indítású vagy részterhelésű üzem áramára.']},
 safety:['alap','kalkulator','beavatkozas'],
 notCovered:['az indítás módja (közvetlen, csillag–delta, lágyindító, frekvenciaváltó)','részterhelés, túlterhelés és üzemmód (S1–S10)','a motorvédelem beállítása és szelektivitása','a tápkábel méretezése és feszültségesése indításkor','egyfázisú motor kondenzátora'],
 examples:[
  {title:'5,5 kW, 400 V, cos φ = 0,85, η = 0,87',input:{rendszer:'3f',P:'5,5','P.e':'kW',Uv:'400',cos:'0,85',eta:'0,87'},expect:{I:10.7350}},
  {title:'Egyfázisú 0,75 kW, 230 V, 0,8, 0,7',input:{rendszer:'1f',P:'0,75','P.e':'kW',U:'230',cos:'0,8',eta:'0,7'},expect:{I:5.82298}},
  {title:'7,5 kW, 400 V, 0,86, 0,89, Ia/In = 7',input:{rendszer:'3f',P:'7,5','P.e':'kW',Uv:'400',cos:'0,86',eta:'0,89',k:'7'},expect:{I:14.1433,Ia:99.0034}},
  {title:'10 LE, 400 V, 0,85, 0,88',input:{rendszer:'3f',P:'10','P.e':'LE',Uv:'400',cos:'0,85',eta:'0,88'},expect:{I:14.1925}},
 ],
 related:['aram-teljesitmenybol','teljesitmeny','mertekegyseg-atvalto','fazisjavitas'],articles:[],
 sources:['Villamos gépek teljesítmény-összefüggése (P = √3 · U · I · cos φ · η)','1 LE = 735,49875 W; 1 hp ≈ 745,7 W (definíció)'],
};
export default def;
