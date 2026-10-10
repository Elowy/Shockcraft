import {CalcError,type CalcDef,type SelectField} from '../core';
import {COLORS,COLOR_SOURCE} from '../constants';
import {si,step,u} from '../fields';

type Color=typeof COLORS[number];
const digits=COLORS.filter((c):c is Color&{digit:number}=>'digit' in c);
const mults=COLORS.filter((c):c is Color&{mult:number}=>'mult' in c);
const tols=COLORS.filter((c):c is Color&{tol:number}=>'tol' in c);
const fmtMult=(m:number)=>'× '+u(m,'');
const digitField=(id:string,label:string,def:string,showIf?:SelectField['showIf']):SelectField=>({id,kind:'select',label,style:'select',default:def,showIf,options:digits.map(c=>({value:c.id,label:c.label+' ('+c.digit+')'}))});
const color=(id:string)=>COLORS.find(c=>c.id===id)!;

const def:CalcDef={
 slug:'ellenallas-szinkod',title:'Ellenállás színkódja',category:'elektronika',tier:'T0',version:1,updated:'2026-10-10',
 short:'Négy- és ötsávos ellenállás-színkód visszafejtése: névleges érték, tűrés és a tűréssáv határai, a sávok rajzával (IEC 60062).',
 keywords:['színkód','ellenállás színkód','sávok','tűrés','gyűrűk','resistor color code','barna fekete piros'],
 synonyms:['szinkod','ellenallas szinkod','ellenallas gyuru','szines csikok'],
 fields:[
  {id:'savok',kind:'select',label:'Sávok száma',style:'segmented',default:'4',options:[{value:'4',label:'4 sáv',short:'4 sáv'},{value:'5',label:'5 sáv',short:'5 sáv'}]},
  digitField('s1','1. sáv (számjegy)','sarga'),digitField('s2','2. sáv (számjegy)','ibolya'),
  digitField('s3','3. sáv (számjegy)','fekete',{field:'savok',is:['5']}),
  {id:'szorzo',kind:'select',label:'Szorzó',style:'select',default:'piros',options:mults.map(c=>({value:c.id,label:c.label+' ('+fmtMult(c.mult)+')'}))},
  {id:'tures',kind:'select',label:'Tűrés',style:'select',default:'arany',options:tols.map(c=>({value:c.id,label:c.label.replace(/ \(.*\)$/,'')+' (±'+u(c.tol,'%')+')'}))},
 ],
 compute(v){
  const five=v.s('savok')==='5',ids=five?['s1','s2','s3']:['s1','s2'];
  const ds=ids.map(id=>color(v.s(id))),m=color(v.s('szorzo')),t=color(v.s('tures'));
  if(ds.some(d=>!('digit' in d))||!('mult' in m)||!('tol' in t))throw new CalcError('Érvénytelen színválasztás.');
  const num=Number(ds.map(d=>(d as {digit:number}).digit).join('')),mult=(m as {mult:number}).mult,tol=(t as {tol:number}).tol;
  const R=+(num*mult).toPrecision(12),lo=R*(1-tol/100),hi=R*(1+tol/100);
  const bands=[...ds,m,...(t.id==='nincs'?[]:[t])].map(c=>c.hex);
  return {
   results:[{id:'R',label:'Névleges érték',value:R,unit:'Ω',text:si(R,'Ω')+' ±'+u(tol,'%'),primary:true},{id:'tol',label:'Tűrés',value:tol,unit:'%',text:'±'+u(tol,'%')},{id:'min',label:'Legkisebb érték',value:lo,unit:'Ω',text:si(lo,'Ω')},{id:'max',label:'Legnagyobb érték',value:hi,unit:'Ω',text:si(hi,'Ω')}],
   steps:[step('Számjegyek és szorzó','R = (számjegyek) · szorzó',`R = ${num} ${fmtMult(mult)}`,si(R,'Ω'),COLOR_SOURCE),step('Tűréssáv','R · (1 ± tűrés)',`${si(R,'Ω')} · (1 ± ${u(tol,'%')})`,si(lo,'Ω')+' … '+si(hi,'Ω'))],
   figure:{kind:'resistor',bands,label:[...ds,m,t].map(c=>c.label.replace(/ \(.*\)$/,'')).join(' – ')},
   assumptions:['Az olvasás iránya: a tűréssáv (arany, ezüst) van jobb oldalon, kissé távolabb a többitől.'],
  };
 },
 formulas:['4 sáv: R = (10 · a + b) · szorzó','5 sáv: R = (100 · a + 10 · b + c) · szorzó','tűrés: R · (1 ± t)'],
 notes:{good:['Alkatrész azonosítása beszereléshez vagy javításhoz.','A jelölés és a mért érték összevetése (a mért érték a tűréssávon belül legyen).'],bad:['Hatsávos (hőmérsékleti tényezős) jelölésre.','Megégett, elszíneződött ellenállás azonosítására – ilyenkor mérj, és nézd a kapcsolási rajzot.']},
 safety:['alap'],
 examples:[
  {title:'Sárga – ibolya – piros – arany',input:{savok:'4',s1:'sarga',s2:'ibolya',szorzo:'piros',tures:'arany'},expect:{R:4700,tol:5,min:4465,max:4935}},
  {title:'Barna – fekete – narancs – arany',input:{savok:'4',s1:'barna',s2:'fekete',szorzo:'narancs',tures:'arany'},expect:{R:10000}},
  {title:'5 sáv: barna – fekete – fekete – barna – barna',input:{savok:'5',s1:'barna',s2:'fekete',s3:'fekete',szorzo:'barna',tures:'barna'},expect:{R:1000,tol:1}},
  {title:'Piros – piros – fekete – ezüst',input:{savok:'4',s1:'piros',s2:'piros',szorzo:'fekete',tures:'ezust'},expect:{R:22,tol:10}},
  {title:'Zöld – kék – arany – arany',input:{savok:'4',s1:'zold',s2:'kek',szorzo:'arany',tures:'arany'},expect:{R:5.6}},
 ],
 related:['eredo-ellenallas','led-elotet-ellenallas','feszultsegoszto'],articles:[],
 sources:[COLOR_SOURCE],
};
export default def;
