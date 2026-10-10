import type {CalcDef,ResultItem} from '../core';
import {MCB_RATINGS} from '../constants';
import {SIZING_NOT_COVERED,maxLoopImpedance} from '../../sizing-formulas';
import {step,u} from '../fields';
import {atMost,fmtLimit,fmtNum} from '../../sizing-formulas';
import {SIZING_TABLES as T,instantaneousRef} from '../../sizing-tables';
import {ambientField,curveField,groupField,insulationField,izFor,izStep,loadedField,methodField,sectionField,tag} from '../sizing-fields';

const def:CalcDef={
 slug:'kismegszakito',title:'Kismegszakító-választás',category:'vedelem',tier:'T1',tables:true,version:1,updated:'2026-10-10',
 short:'A kismegszakító névleges árama az előnyös értéksorból, a terhelés és a vezeték terhelhetősége közé (Ib ≤ In ≤ Iz), a megengedett hurokimpedanciával.',
 keywords:['kismegszakító','biztosíték','automata','MCB','névleges áram','B16','C16','Ib In Iz','védelem kiválasztás'],
 synonyms:['biztositek','kismegszakito','automata biztositek','mcb','hany amperes biztositek'],
 fields:[
  {id:'Ib',kind:'number',label:'Tervezett terhelőáram',symbol:'Ib',unit:'A',default:'13',positive:true,max:500},
  sectionField(),methodField,insulationField,loadedField,ambientField,groupField,curveField,
 ],
 compute(v){
  const Ib=v.n('Ib'),A=Number(v.s('A')),x=izFor(v,A)!,curve=v.s('gorbe') as 'B'|'C'|'D';
  const ok=MCB_RATINGS.value.filter(r=>atMost(Ib,r)&&atMost(r,x.iz));
  const results:ResultItem[]=[{id:'Iz',label:'A vezeték javított terhelhetősége',value:x.iz,unit:'A',text:u(x.iz,'A')}];
  const steps=[izStep(x,A)];
  const assumptions=[...x.assumptions,'MSZ EN 60898-1 szerinti kismegszakító (I2 = 1,45 · In).','A jelleggörbét a fogyasztó bekapcsolási árama határozza meg (B: általános, C: motoros, induktív terhelés).'];
  if(!ok.length){
   steps.push(step('Feltétel','Ib ≤ In ≤ Iz',`${u(Ib,'A')} ≤ In ≤ ${u(x.iz,'A')}`,'nincs ilyen előnyös In','MSZ HD 60364-4-43 433.1'));
   return {results,steps,verdict:{ok:false,text:`Számítás szerint nincs olyan előnyös névleges áram (MSZ EN 60898-1), amelyre ${u(Ib,'A')} ≤ In ≤ ${u(x.iz,'A')} teljesül: nagyobb keresztmetszet, kedvezőbb szerelési mód vagy kisebb terhelés szükséges.`},assumptions};
  }
  const In=ok[0],max=ok[ok.length-1],zs=maxLoopImpedance(curve,In),zsT=fmtLimit(zs,3)+'\u00a0Ω'+(fmtNum(zs,6)!==fmtLimit(zs,3)?' (lefelé kerekítve)':''),m=instantaneousRef(curve);
  results.unshift({id:'In',label:'Legkisebb választható névleges áram',value:In,unit:'A',text:curve+In+' ('+In+'\u00a0A)',primary:true},{id:'InMax',label:'Legnagyobb megengedett névleges áram',value:max,unit:'A',text:max+'\u00a0A'});
  results.push({id:'I2',label:'Kioldási áram I2 = 1,45 · In',value:T.conventionalFactor*In,unit:'A',text:u(T.conventionalFactor*In,'A')},{id:'ZsMax',label:`Megengedett hurokimpedancia (${curve}${In})`,value:zs,unit:'Ω',text:zsT});
  steps.push(step('Feltétel','Ib ≤ In ≤ Iz',`${u(Ib,'A')} ≤ ${In} A ≤ ${u(x.iz,'A')}`,'In = '+In+' A (legfeljebb '+max+' A)','MSZ HD 60364-4-43 433.1; '+MCB_RATINGS.source),
   step('I2 feltétel','I2 = 1,45 · In ≤ 1,45 · Iz',`${fmtNum(T.conventionalFactor)} · ${In} A ≤ ${fmtNum(T.conventionalFactor)} · ${u(x.iz,'A')}`,'teljesül (kismegszakítónál In ≤ Iz-vel együtt)','MSZ EN 60898-1'),
   step('Megengedett hurokimpedancia','Zs,max = cmin · U0 / (m · In)',`Zs,max = ${fmtNum(T.cmin)} · ${u(T.u0,'V')} / (${m.value} ${tag(m)} · ${In} A)`,zsT,'MSZ HD 60364-4-41 411.4.4'));
  return {results,steps,verdict:{ok:true,text:`Számítás szerint ${curve}${In} kismegszakítóval teljesül az Ib ≤ In ≤ Iz feltétel (${u(Ib,'A')} ≤ ${In} A ≤ ${u(x.iz,'A')}). A hurokimpedanciát (Zs ≤ ${fmtLimit(zs,3)}\u00a0Ω) méréssel vagy számítással ellenőrizni kell.`},assumptions};
 },
 formulas:['Ib ≤ In ≤ Iz','I2 = 1,45 · In ≤ 1,45 · Iz','Zs,max = cmin · U0 / (m · In); m = 5 (B), 10 (C), 20 (D)'],
 notes:{good:['A kismegszakító névleges áramának előzetes kiválasztása adott vezetékhez és terheléshez.','Annak ellenőrzése, hogy egy meglévő védelem nem nagyobb-e a vezetéknél.'],bad:['Szelektivitás és zárlati megszakítóképesség (Icn) ellenőrzésére.','ÁVK (FI-relé) kiválasztására.']},
 safety:['alap','meretezes'],notCovered:SIZING_NOT_COVERED,
 examples:[
  {title:'Ib = 14 A, 2,5 mm², B2, B jelleggörbe',input:{Ib:'14',A:'2.5',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1',gorbe:'B'},expect:{In:16,InMax:20,Iz:23,ZsMax:2.875}},
  {title:'Ib = 18 A, 2,5 mm², B2',input:{Ib:'18',A:'2.5',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1',gorbe:'B'},expect:{In:20,ZsMax:2.3}},
  {title:'Ib = 10 A, 1,5 mm², C jelleggörbe',input:{Ib:'10',A:'1.5',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1',gorbe:'C'},expect:{In:10,InMax:16,ZsMax:2.3}},
  {title:'Ib = 22 A, 2,5 mm² (nincs választható érték)',input:{Ib:'22',A:'2.5',mod:'B2',szig:'PVC',erek:'2',temp:'30',csop:'1',gorbe:'B'},expect:{Iz:23}},
 ],
 related:['keresztmetszet','hurokimpedancia','terhelhetoseg-tablazat','aram-teljesitmenybol'],articles:[],
 sources:['MSZ HD 60364-4-43:2010 433.1','MSZ EN 60898-1 (I2 = 1,45 · In; pillanatkioldás)',MCB_RATINGS.source,'MSZ HD 60364-4-41:2007 411.4.4 – a lib/sizing-tables.ts értékeivel'],
};
export default def;
