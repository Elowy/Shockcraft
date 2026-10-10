import {CalcError,type CalcDef,type Issue} from '../core';
import {SQRT3} from '../formulas';
import {si,step,u} from '../fields';

const tanOf=(c:number)=>Math.sqrt(1-c*c)/c;

const def:CalcDef={
 slug:'fazisjavitas',title:'Fázisjavítás (meddőkompenzálás)',category:'teljesitmeny',tier:'T1',version:1,updated:'2026-10-10',
 short:'A kívánt cos φ eléréséhez szükséges kondenzátorteljesítmény (Qc = P · (tan φ1 − tan φ2)) és kapacitás delta, csillag vagy egyfázisú kapcsolásban.',
 keywords:['fázisjavítás','meddőkompenzálás','cos fi javítás','kondenzátor','kvar','meddő','kompenzálás'],
 synonyms:['fazisjavitas','meddo kompenzalas','cosfi javitas','kompenzalo kondenzator'],
 fields:[
  {id:'P',kind:'number',label:'Hatásos teljesítmény',symbol:'P',units:'power',defaultUnit:'kW',default:'10',positive:true,max:1e9},
  {id:'cos1',kind:'number',label:'Jelenlegi cos φ',symbol:'cos φ1',default:'0,7',positive:true,max:1},
  {id:'cos2',kind:'number',label:'Kívánt cos φ',symbol:'cos φ2',default:'0,95',positive:true,max:1},
  {id:'kotes',kind:'select',label:'Kondenzátorok kapcsolása',style:'select',default:'delta',options:[{value:'delta',label:'Háromfázisú, delta (Δ)',short:'Δ'},{value:'csillag',label:'Háromfázisú, csillag (Y)',short:'Y'},{value:'1f',label:'Egyfázisú',short:'1f'}]},
  {id:'Uv',kind:'number',label:'Vonali feszültség',symbol:'U',unit:'V',default:'400',positive:true,max:1e5,showIf:{field:'kotes',is:['delta','csillag']}},
  {id:'U',kind:'number',label:'Feszültség',symbol:'U',unit:'V',default:'230',positive:true,max:1e5,showIf:{field:'kotes',is:['1f']}},
  {id:'f',kind:'number',label:'Frekvencia',symbol:'f',unit:'Hz',default:'50',positive:true,max:1000},
 ],
 compute(v){
  const P=v.n('P'),c1=v.n('cos1'),c2=v.n('cos2'),k=v.s('kotes'),U=k==='1f'?v.n('U'):v.n('Uv'),f=v.n('f'),w=2*Math.PI*f;
  if(!(c2>c1))throw new CalcError('A kívánt cos φ legyen nagyobb a jelenleginél.','cos2');
  const t1=tanOf(c1),t2=tanOf(c2),Qc=P*(t1-t2);
  const C=k==='delta'?Qc/(3*w*U*U):Qc/(w*U*U);
  const kI=k==='1f'?1:SQRT3,I1=P/(kI*U*c1),I2=P/(kI*U*c2);
  const cFormula=k==='delta'?'C = Qc / (3 · ω · U²) (kondenzátoronként)':k==='csillag'?'C = Qc / (ω · U²) (kondenzátoronként, U/√3 feszültségen)':'C = Qc / (ω · U²)';
  const issues:Issue[]=[];
  if(c2>0.98)issues.push({level:'warn',text:'0,98 fölötti cél esetén kis terhelésnél túlkompenzálás (kapacitív üzem) léphet fel; jellemzően fokozatszabályozott telep kell.'});
  return {
   results:[{id:'Qc',label:'Szükséges kondenzátorteljesítmény',value:Qc,unit:'var',text:si(Qc,'var'),primary:true},{id:'C',label:'Kapacitás kondenzátoronként',value:C,unit:'F',text:si(C,'F'),primary:true},{id:'I1',label:'Áram fázisjavítás előtt',value:I1,unit:'A',text:u(I1,'A')},{id:'I2',label:'Áram fázisjavítás után',value:I2,unit:'A',text:u(I2,'A')}],
   steps:[step('tan φ','tan φ = √(1 − cos² φ) / cos φ',`tan φ1 = ${u(t1,'')}; tan φ2 = ${u(t2,'')}`,u(t1-t2,'')+' különbség'),step('Kondenzátorteljesítmény','Qc = P · (tan φ1 − tan φ2)',`Qc = ${si(P,'W')} · (${u(t1,'')} − ${u(t2,'')})`,si(Qc,'var')),step('Kapacitás',cFormula,`C = ${si(Qc,'var')} / (${k==='delta'?'3 · ':''}2π · ${u(f,'Hz')} · (${u(U,'V')})²)`,si(C,'F'))],
   issues,assumptions:['Szinuszos feszültség, a terhelés hatásos teljesítménye állandó.',k==='1f'?'Egyfázisú kondenzátor a fogyasztóval párhuzamosan.':'Szimmetrikus háromfázisú telep, három azonos kondenzátor.'],
  };
 },
 formulas:['Qc = P · (tan φ1 − tan φ2)','Δ: C = Qc / (3 · ω · U²)','Y és 1f: C = Qc / (ω · U²), ω = 2π · f'],
 notes:{good:['Egyedi fázisjavítás (pl. motor) kondenzátorteljesítményének előzetes becslése.','A fázisjavítás áramcsökkentő hatásának szemléltetése.'],bad:['Fázisjavító telep tervezésére felharmonikusokkal terhelt hálózatban (rezonanciaveszély).','A kondenzátorok bekötésére: a kisütő ellenállás és a védelem szakember feladata.']},
 safety:['alap','kalkulator','beavatkozas'],
 notCovered:['felharmonikusok és rezonancia (fojtós telep szükségessége)','túlkompenzálás kis terhelésnél, fokozatszabályozás','a kondenzátor feszültségtűrése, kisütése és védelme (MSZ EN 60831)','kapcsolási tranziensek','az elosztói engedélyes meddőelszámolási szabályai'],
 examples:[
  {title:'10 kW, 0,7 → 0,95, delta, 400 V',input:{P:'10','P.e':'kW',cos1:'0,7',cos2:'0,95',kotes:'delta',Uv:'400',f:'50'},expect:{Qc:6915.20,C:4.58578e-5}},
  {title:'10 kW, 0,7 → 0,95, csillag, 400 V',input:{P:'10','P.e':'kW',cos1:'0,7',cos2:'0,95',kotes:'csillag',Uv:'400',f:'50'},expect:{C:1.37574e-4}},
  {title:'Egyfázisú 1 kW, 0,6 → 0,95, 230 V',input:{P:'1','P.e':'kW',cos1:'0,6',cos2:'0,95',kotes:'1f',U:'230',f:'50'},expect:{Qc:1004.65,C:6.04518e-5,I1:7.24638,I2:4.57666}},
 ],
 related:['latszolagos-meddo-teljesitmeny','teljesitmeny','reaktancia-rezonancia','motor-aram'],articles:[],
 sources:['Meddőteljesítmény-kompenzálás: Qc = P · (tan φ1 − tan φ2) – alapösszefüggés','MSZ EN 60831 (önregeneráló fázisjavító kondenzátorok) – a „nem vizsgált” tételekhez'],
};
export default def;
