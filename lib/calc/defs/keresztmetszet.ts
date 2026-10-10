import {CalcError,type CalcDef} from '../core';
import {SIZING_NOT_COVERED,minSectionFor} from '../formulas';
import {nb,step,u} from '../fields';
import {SECTIONS} from '../../sizing-tables';
import {fmtNum} from '../../sizing-formulas';
import {ambientField,groupField,insulationField,izFor,izStep,loadedField,methodField} from '../sizing-fields';

const def:CalcDef={
 slug:'keresztmetszet',title:'Keresztmetszet-választás',category:'vezetekek',tier:'T1',tables:true,version:1,updated:'2026-10-10',
 short:'A legkisebb rézvezeték-keresztmetszet, amelynek javított terhelhetősége (Iz = Iz0 · kθ · kcs) eléri a védelem névleges áramát – a Méretezés fül táblázataival.',
 keywords:['keresztmetszet','kábel vastagság','vezeték vastagság','mm2','terhelhetőség','Iz','kábelválasztás','hány négyzetes'],
 synonyms:['kabel vastagsag','vezetek vastagsag','keresztmetszet valasztas','hany negyzetes','kabel meretezes'],
 fields:[
  {id:'In',kind:'number',label:'A védelem névleges árama',symbol:'In',unit:'A',default:'20',positive:true,max:500},
  methodField,insulationField,loadedField,ambientField,groupField,
 ],
 compute(v){
  const In=v.n('In'),x=izFor(v,SECTIONS[0])!;
  const A=minSectionFor(In,x.method,x.ins,x.loaded,x.kt,x.kg);
  if(A===null)throw new CalcError('A segédszámítás táblázatában (legfeljebb '+fmtNum(SECTIONS[SECTIONS.length-1])+' mm²) nincs olyan keresztmetszet, amely ezzel a szerelési móddal elegendő. Válassz kedvezőbb szerelési módot vagy kisebb védelmet; a tervezést szakember végezze.','In');
  const z=izFor(v,A)!;
  return {
   results:[{id:'A',label:'Legkisebb keresztmetszet (számítás szerint)',value:A,unit:'mm²',text:fmtNum(A)+nb+'mm²',primary:true},{id:'Iz',label:'Javított terhelhetőség',value:z.iz,unit:'A',text:u(z.iz,'A')},{id:'Iz0',label:'Táblázati terhelhetőség',value:z.iz0,unit:'A',text:u(z.iz0,'A')},{id:'kt',label:'Hőmérsékleti tényező kθ',value:z.kt,text:u(z.kt,'')},{id:'kg',label:'Csoportosítási tényező kcs',value:z.kg,text:u(z.kg,'')}],
   steps:[izStep(z,A),step('Feltétel','In ≤ Iz (433.1)',`${u(In,'A')} ≤ ${u(z.iz,'A')}`,'teljesül '+fmtNum(A)+' mm²-nél','MSZ HD 60364-4-43 433.1')],
   verdict:{ok:true,text:`Számítás szerint ${fmtNum(A)} mm² a legkisebb keresztmetszet, amelyre In ≤ Iz teljesül (${u(In,'A')} ≤ ${u(z.iz,'A')}).`},
   table:{caption:'Javított terhelhetőség keresztmetszetenként',head:['Keresztmetszet','Iz0','Iz = Iz0 · kθ · kcs','In ≤ Iz?'],rows:SECTIONS.map(s=>{const y=izFor(v,s)!;return [fmtNum(s)+nb+'mm²',u(y.iz0,'A'),u(y.iz,'A'),In<=y.iz+1e-9*y.iz?'igen':'nem']})},
   assumptions:[...z.assumptions,'A legkisebb keresztmetszet (1,5 mm² réz) a táblázat első sora.','Csak a túlterhelés elleni védelem feltétele (In ≤ Iz); a feszültségesést és a hurokimpedanciát külön kell ellenőrizni.'],
  };
 },
 formulas:['Iz = Iz0 · kθ · kcs','feltétel: Ib ≤ In ≤ Iz (MSZ HD 60364-4-43 433.1)'],
 notes:{good:['Egy áramkör vezeték-keresztmetszetének előzetes ellenőrzése a védelem névleges áramához.','A tervező Méretezés fülén kapott javaslat gyors ellenőrzése.'],bad:['Tervezői méretezés kiváltására (feszültségesés, zárlati szilárdság, hurokimpedancia is kell).','Földben vagy szabad levegőn vezetett kábelre, alumíniumvezetőre.']},
 safety:['alap','meretezes'],notCovered:SIZING_NOT_COVERED,
 examples:[
  {title:'In = 20 A, B2, PVC, 2 ér, 30 °C',input:{In:'20',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1'},expect:{A:2.5,Iz:23}},
  {title:'Ugyanez 3 áramkörrel együtt vezetve',input:{In:'20',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'3'},expect:{A:4,Iz:21}},
  {title:'In = 16 A, A1, 2 ér',input:{In:'16',mod:'A1',szig:'PVC',erek:'2',temp:'30',csop:'1'},expect:{A:2.5,Iz:19.5}},
  {title:'In = 32 A, C, 3 ér',input:{In:'32',mod:'C',szig:'PVC',erek:'3',temp:'30',csop:'1'},expect:{A:4,Iz:32}},
  {title:'In = 25 A, B2, 35 °C',input:{In:'25',mod:'B2',szig:'PVC',erek:'2',temp:'35',csop:'1'},expect:{A:4,Iz:28.2}},
 ],
 related:['terhelhetoseg-tablazat','kismegszakito','feszultseges','hurokimpedancia'],articles:[],
 sources:['MSZ HD 60364-5-52:2011 B.52.2, B.52.4 (Iz0), B.52.14 (kθ), B.52.17 (kcs) – a lib/sizing-tables.ts értékeivel','MSZ HD 60364-4-43:2010 433.1'],
};
export default def;
