import type {CalcDef,Issue} from '../core';
import {SIZING_NOT_COVERED,loopResistance,maxLoopImpedance} from '../../sizing-formulas';
import {floorLength,step,u} from '../fields';
import {atMost,fmtLimit,fmtLimitPair,fmtNum,loopRemedies} from '../../sizing-formulas';
import {SIZING_TABLES as T,constantRef,instantaneousRef} from '../../sizing-tables';
import {curveField,ratingField,tag} from '../sizing-fields';

/** A méretezés „Mit nem vizsgál” listája a kalkulátorhoz igazítva: a kalkulátor a védővezető keresztmetszetét külön kéri (A_PE),
 * és legfeljebb 35 mm²-t enged, ezért ezek nem „nem vizsgált” tételek; helyettük a védővezető méretezése nem vizsgált. */
const NOT_COVERED=[
 ...SIZING_NOT_COVERED.map(x=>x.startsWith('alumínium vezető')?'alumínium vezető, gumiszigetelésű (60 °C-os) vezeték':x),
 'a védővezető keresztmetszetének méretezése és zárlati szilárdsága (543.1)',
 'az elosztó előtti hálózat impedanciájának változása és a mérési bizonytalanság',
];

const def:CalcDef={
 slug:'hurokimpedancia',title:'Hurokimpedancia és zárlati áram',category:'vedelem',tier:'T1',tables:true,version:1,updated:'2026-10-10',
 short:'Hurokimpedancia az áramkör végén a hosszból és a keresztmetszetekből, a zárlati áram és a pillanatkioldáshoz tartozó legnagyobb hossz TN-rendszerben.',
 keywords:['hurokimpedancia','Zs','zárlati áram','Ik','érintésvédelem','lekapcsolás','TN rendszer','Ze','hurokellenállás'],
 synonyms:['hurok impedancia','zarlati aram','zs max','hibahurok'],
 fields:[
  {id:'Ze',kind:'number',label:'Hurokimpedancia az elosztónál',symbol:'Ze',unit:'Ω',default:'0,35',min:0,max:20,help:'Mért vagy az elosztói engedélyestől kapott érték az áramkör kezdetén.'},
  {id:'L',kind:'number',label:'Vezetékhossz (egy irányban)',symbol:'L',unit:'m',default:'25',positive:true,max:5000},
  {id:'A',kind:'number',label:'Fázisvezető keresztmetszete',symbol:'A',unit:'mm²',default:'2,5',positive:true,max:35,help:'Rézvezető, legfeljebb 35 mm² (a segédszámítás tartománya).'},
  {id:'Ape',kind:'number',label:'Védővezető keresztmetszete',symbol:'A_PE',unit:'mm²',optional:true,positive:true,max:35,placeholder:'= fázisvezető',help:'Üresen a fázisvezetővel azonos. A védővezető méretezését (543.1) a kalkulátor nem vizsgálja.'},
  curveField,ratingField,
 ],
 compute(v){
  const Ze=v.n('Ze'),L=v.n('L'),A=v.n('A'),Ape=v.opt('Ape')??A,curve=v.s('gorbe') as 'B'|'C'|'D',In=Number(v.s('In'));
  const R=loopResistance(L,A,Ape),Zs=Ze+R,Ik=T.cmin*T.u0/Zs,max=maxLoopImpedance(curve,In),per=T.rho1*(1/A+1/Ape),Lmax=Math.max(0,(max-Ze)/per);
  const m=instantaneousRef(curve),ok=atMost(Zs,max),[zT,mT]=fmtLimitPair(Zs,max,3),maxT=fmtLimit(max,3),floored=fmtNum(max,6)!==maxT,issues:Issue[]=[];
  if(Ze>=max)issues.push({level:'warn',text:'Már az elosztónál mért hurokimpedancia is eléri a megengedett értéket: ezzel a védelemmel az áramkör nem rövidíthető le eléggé.'});
  return {
   results:[{id:'Zs',label:'Hurokimpedancia az áramkör végén',value:Zs,unit:'Ω',text:zT+'\u00a0Ω',primary:true},{id:'Ik',label:'Zárlati (hiba-) áram',value:Ik,unit:'A',text:u(Ik,'A')},{id:'ZsMax',label:`Megengedett hurokimpedancia (${curve}${In})`,value:max,unit:'Ω',text:maxT+'\u00a0Ω'+(floored?' (lefelé kerekítve)':'')},{id:'Lmax',label:'Legnagyobb hossz ezzel a védelemmel',value:Lmax,unit:'m',text:floorLength(Lmax).text}],
   steps:[
    step('Vezeték hurokellenállása','R = ρ1 · L · (1/A + 1/A_PE)',`R = ${u(T.rho1,'Ω·mm²/m',4)} ${tag(constantRef('rho1'))} · ${u(L,'m')} · (1/${u(A,'mm²')} + 1/${u(Ape,'mm²')})`,u(R,'Ω',3)),
    step('Hurokimpedancia','Zs = Ze + R',`Zs = ${u(Ze,'Ω',3)} + ${u(R,'Ω',3)}`,u(Zs,'Ω',3)),
    step('Zárlati áram','Ik = cmin · U0 / Zs',`Ik = ${fmtNum(T.cmin)} · ${u(T.u0,'V')} / ${u(Zs,'Ω',3)}`,u(Ik,'A'),'MSZ HD 60364-4-41 411.4.4'),
    step('Megengedett érték','Zs,max = cmin · U0 / (m · In)',`Zs,max = ${fmtNum(T.cmin)} · ${u(T.u0,'V')} / (${m.value} ${tag(m)} · ${In} A)`,maxT+'\u00a0Ω'+(floored?' (lefelé kerekítve)':'')),
    step('Legnagyobb hossz','Lmax = max(0; (Zs,max − Ze) / (ρ1 · (1/A + 1/A_PE)))',`Lmax = max(0; (${maxT}\u00a0Ω − ${u(Ze,'Ω',3)}) / ${u(per,'Ω/m',5)})`,floorLength(Lmax).step),
   ],
   issues,verdict:{ok,text:ok?`Számítás szerint a pillanatkioldás feltétele teljesül: Zs = ${zT} Ω ≤ ${mT} Ω.`:`Számítás szerint a pillanatkioldás feltétele nem teljesül: Zs = ${zT} Ω > ${mT} Ω. Lehetséges megoldás: ${loopRemedies(curve,Ze>=max)} – a döntés a tervező feladata.`},
   assumptions:['TN-rendszer; a hurok a fázis- és a védővezetőn záródik.','Rézvezető, ρ1 = '+u(T.rho1,'Ω·mm²/m',4)+' (üzemi hőmérséklet); a vezeték reaktanciája elhanyagolva.','Kismegszakító (MSZ EN 60898-1) pillanatkioldási tartományának felső határa: '+curve+' → '+m.value+' · In.'],
  };
 },
 formulas:['Zs = Ze + ρ1 · L · (1/A + 1/A_PE)','Ik = cmin · U0 / Zs','Zs ≤ Zs,max = cmin · U0 / (m · In)','Lmax = max(0; (Zs,max − Ze) / (ρ1 · (1/A + 1/A_PE)))'],
 notes:{good:['Hosszú áramkörök (kert, melléképület) lekapcsolási feltételének előzetes ellenőrzése.','Mért hurokimpedancia és a számított érték összevetése.'],bad:['A helyszíni mérés kiváltására: a kész berendezés hurokimpedanciáját mérni kell.','TT-rendszerre és ÁVK-val védett áramkörök igazolására.']},
 safety:['alap','meretezes'],notCovered:NOT_COVERED,
 examples:[
  {title:'Ze = 0,35 Ω, 25 m, 2,5/2,5 mm², B16',input:{Ze:'0,35',L:'25',A:'2,5',gorbe:'B',In:'16'},expect:{Zs:0.8,Ik:287.5,ZsMax:2.875,Lmax:140.278}},
  {title:'Ze = 0,5 Ω, 40 m, 1,5 mm², B10',input:{Ze:'0,5',L:'40',A:'1,5',gorbe:'B',In:'10'},expect:{Zs:1.7,Ik:135.294,Lmax:136.667}},
  {title:'Ze = 0,35 Ω, 25 m, 2,5 mm², C16',input:{Ze:'0,35',L:'25',A:'2,5',gorbe:'C',In:'16'},expect:{ZsMax:1.4375,Lmax:60.4167}},
  {title:'Csökkentett PE: 2,5/1,5 mm², 20 m, Ze = 0,3 Ω',input:{Ze:'0,3',L:'20',A:'2,5',Ape:'1,5',gorbe:'B',In:'16'},expect:{Zs:0.78,Ik:294.872,Lmax:107.292}},
 ],
 related:['kismegszakito','keresztmetszet','feszultseges','vezetek-ellenallas'],articles:[],
 sources:['MSZ HD 60364-4-41:2007 411.4.4 (Zs · Ia ≤ U0)','MSZ EN 60898-1 (pillanatkioldás: B 5 · In, C 10 · In, D 20 · In)','ρ1, cmin, U0: a lib/sizing-tables.ts értékei'],
};
export default def;
