import type {CalcDef,Step} from '../core';
import {formatCompare} from '../number';
import {SIZING_NOT_COVERED,maxLengthForDrop,voltageDropPercent} from '../../sizing-formulas';
import {floorLength,nb,pct,step,u} from '../fields';
import {SIZING_TABLES as T,dropLimitRef} from '../../sizing-tables';
import {tag} from '../sizing-fields';

const limits=[['public','other'],['public','lighting'],['private','other'],['private','lighting']] as const;
const limitLabel=(s:'public'|'private',w:'lighting'|'other')=>(s==='public'?'Közcélú hálózat':'Saját táppont')+', '+(w==='lighting'?'világítás':'egyéb fogyasztó')+' ('+u(T.dropLimits[s][w],'%')+')';

const def:CalcDef={
 slug:'feszultseges',title:'Feszültségesés',category:'vezetekek',tier:'T1',tables:true,version:1,updated:'2026-10-10',
 short:'Feszültségesés rézvezetéken egy-, háromfázisú és egyenáramú körben, a megengedett legnagyobb hosszal – a tervező Méretezés fülével azonos képlettel.',
 keywords:['feszültségesés','feszültség esés','vezeték hossz','kábel hossz','ΔU','G.52.1','esés százalék','maximális hossz'],
 synonyms:['feszultseges','feszultseg eses','delta u','kabel hossz','max kabelhossz'],
 fields:[
  {id:'rendszer',kind:'select',label:'Rendszer',style:'segmented',default:'1f',options:[{value:'1f',label:'Egyfázisú (230 V)',short:'1f'},{value:'3f',label:'Háromfázisú (400 V)',short:'3f'},{value:'dc',label:'Egyenáram',short:'DC'}]},
  {id:'I',kind:'number',label:'Terhelőáram',symbol:'I',unit:'A',default:'16',positive:true,max:1000},
  {id:'L',kind:'number',label:'Vezetékhossz (egy irányban)',symbol:'L',units:'length',default:'23,4',positive:true,max:1e4},
  {id:'A',kind:'number',label:'Keresztmetszet',symbol:'A',unit:'mm²',default:'2,5',positive:true,max:1000},
  {id:'cos',kind:'number',label:'Teljesítménytényező',symbol:'cos φ',default:'1',positive:true,max:1,showIf:{field:'rendszer',is:['1f','3f']}},
  {id:'Udc',kind:'number',label:'Névleges feszültség',symbol:'U',unit:'V',default:'24',positive:true,max:1500,showIf:{field:'rendszer',is:['dc']}},
  {id:'hatar',kind:'select',label:'Határérték (G.52.1, tájékoztató)',style:'select',default:'public-other',showIf:{field:'rendszer',is:['1f','3f']},options:limits.map(([s,w])=>({value:s+'-'+w,label:limitLabel(s,w)}))},
  {id:'hatarDc',kind:'number',label:'Megengedett esés',symbol:'ΔU',unit:'%',default:'3',positive:true,max:50,showIf:{field:'rendszer',is:['dc']}},
 ],
 compute(v){
  const sys=v.s('rendszer'),I=v.n('I'),L=v.n('L'),A=v.n('A'),steps:Step[]=[];
  let p:number,volts:number,Lmax:number,limit:number,limitText:string;
  if(sys==='dc'){
   const U=v.n('Udc');limit=v.n('hatarDc');volts=2*L*I*T.rho1/A;p=volts/U*100;Lmax=limit/100*U/(2*I*T.rho1/A);limitText=u(limit,'%')+' (megadott)';
   steps.push(step('Feszültségesés','ΔU = 2 · L · I · ρ1 / A',`ΔU = 2 · ${u(L,'m')} · ${u(I,'A')} · ${u(T.rho1,'Ω·mm²/m',4)} / ${u(A,'mm²')}`,u(volts,'V')),step('Százalékban','ΔU% = ΔU / U · 100',`ΔU% = ${u(volts,'V')} / ${u(U,'V')} · 100`,pct(p,3)));
  }else{
   const [s,w]=v.s('hatar').split('-') as ['public'|'private','lighting'|'other'],ref=dropLimitRef(s,w),cos=v.n('cos'),b=sys==='1f'?2:1,Un=sys==='1f'?T.u0:400;
   limit=ref.value;limitText=u(limit,'%')+' '+tag(ref);
   p=voltageDropPercent({b,length:L,current:I,section:A,cosPhi:cos});volts=p/100*Un;Lmax=maxLengthForDrop(limit,b,I,A,cos);
   const sin=Math.sqrt(Math.max(0,1-cos*cos));
   steps.push(step('Feszültségesés (%)',`ΔU% = ${b} · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100`,`ΔU% = ${b} · ${u(L,'m')} · ${u(I,'A')} · (${u(T.rho1,'Ω·mm²/m',4)} · ${u(cos,'')} / ${u(A,'mm²')} + ${u(T.lambda,'Ω/m',5)} · ${u(sin,'')}) / ${u(T.u0,'V')} · 100`,pct(p,3),'MSZ HD 60364-5-52 G.52.2'),
    step('Feszültségesés (V)',sys==='1f'?'ΔU = ΔU% · 230 V':'ΔU (vonali) = ΔU% · 400 V',`ΔU = ${pct(p,3)} · ${u(Un,'V')}`,u(volts,'V')));
  }
  steps.push(step('Legnagyobb hossz a határig','Lmax = ΔU%határ / ΔU% · L (az esés a hosszal arányos)',`Lmax = ${pct(limit)} / ${pct(p,3)} · ${u(L,'m')}`,floorLength(Lmax).step));
  const ok=p<=limit+1e-9*limit,[a,bT]=formatCompare(p,limit);
  return {
   results:[{id:'dU',label:'Feszültségesés',value:volts,unit:'V',text:u(volts,'V')},{id:'pct',label:'Feszültségesés',value:p,unit:'%',text:a+nb+'%',primary:true},{id:'Lmax',label:'Legnagyobb hossz a határig',value:Lmax,unit:'m',text:floorLength(Lmax).text},{id:'limit',label:'Határérték',value:limit,unit:'%',text:limitText}],
   steps,figure:{kind:'drop-bar',value:p,limit,label:'ΔU'},verdict:{ok,text:ok?`Számítás szerint a határon belül: ${a} % ≤ ${bT} %.`:`Számítás szerint meghaladja a határt: ${a} % > ${bT} %.`},
   assumptions:['Rézvezető; ρ1 = '+u(T.rho1,'Ω·mm²/m',4)+' (üzemi hőmérséklet), λ = '+u(T.lambda,'Ω/m',5)+' (G.52.2).','A teljes terhelés a vezeték végén; az elosztó előtti (fővezeték) esés nincs benne.',...(sys==='3f'?['Szimmetrikus háromfázisú terhelés.']:[]),...(sys==='dc'?['Egyenáram: λ = 0, oda-vissza vezeték.']:[])],
  };
 },
 formulas:['ΔU% = b · L · I · (ρ1 · cos φ / A + λ · sin φ) / U0 · 100 (b = 2 egyfázisú, 1 háromfázisú)','DC: ΔU = 2 · L · I · ρ1 / A','Lmax = ΔU%határ · U0 / (100 · b · I · (ρ1 · cos φ / A + λ · sin φ))'],
 notes:{good:['Hosszú leágazások (kert, melléképület, garázs) keresztmetszetének előzetes ellenőrzése.','A tervező Méretezés fülén kapott érték gyors ellenőrzése.'],bad:['Tervezői méretezés kiváltására: a terhelhetőség, a zárlati védelem és a hurokimpedancia is számít.','Motorindítás pillanatnyi feszültségesésére.']},
 safety:['alap','meretezes'],
 notCovered:SIZING_NOT_COVERED,
 examples:[
  {title:'1f, 16 A, 23,4 m, 2,5 mm²',input:{rendszer:'1f',I:'16',L:'23,4',A:'2,5',cos:'1',hatar:'public-other'},expect:{dU:6.73920,pct:2.93009,Lmax:39.9306}},
  {title:'3f, 32 A, 50 m, 6 mm², cos φ = 0,9',input:{rendszer:'3f',I:'32',L:'50',A:'6',cos:'0,9',hatar:'public-other'},expect:{pct:2.37208,dU:9.48834}},
  {title:'DC 24 V, 5 A, 10 m, 1,5 mm²',input:{rendszer:'dc',I:'5',L:'10',A:'1,5',Udc:'24',hatarDc:'5'},expect:{dU:1.5,pct:6.25,Lmax:8}},
  {title:'Világítás, 1f, 10 A, 30 m, 1,5 mm²',input:{rendszer:'1f',I:'10',L:'30',A:'1,5',cos:'1',hatar:'public-lighting'},expect:{pct:3.91304,Lmax:23}},
 ],
 related:['keresztmetszet','hurokimpedancia','vezetek-ellenallas','terhelhetoseg-tablazat'],articles:[],
 sources:['MSZ HD 60364-5-52:2011, 525 és G melléklet (G.52.1 határértékek, G.52.2 képlet) – a lib/sizing-tables.ts értékeivel','MSZ EN 60038 (230/400 V)'],
};
export default def;
