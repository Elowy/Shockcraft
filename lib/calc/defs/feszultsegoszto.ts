import {CalcError,type CalcDef,type ResultItem,type Step} from '../core';
import {E24,E_SERIES_SOURCE,nextSeriesValue} from '../constants';
import {si,step} from '../fields';

const def:CalcDef={
 slug:'feszultsegoszto',title:'Feszültségosztó',category:'elektronika',tier:'T0',version:1,updated:'2026-10-10',
 short:'Ellenállásos feszültségosztó kimeneti feszültsége (terheléssel is), vagy az alsó ellenállás értéke a kívánt kimenethez, E24-es javaslattal.',
 keywords:['feszültségosztó','osztó','R1 R2','kimeneti feszültség','Uki','ellenállásosztó'],
 synonyms:['feszultsegoszto','feszultseg oszto','voltage divider'],
 fields:[
  {id:'mod',kind:'select',label:'Mit számolsz?',style:'segmented',default:'kimenet',options:[{value:'kimenet',label:'Kimeneti feszültség'},{value:'r2',label:'Alsó ellenállás (R2)',short:'R2 méretezés'}]},
  {id:'Ube',kind:'number',label:'Bemeneti feszültség',symbol:'Ube',units:'voltage',default:'12',positive:true,max:1e5},
  {id:'R1',kind:'number',label:'Felső ellenállás',symbol:'R1',units:'resistance',defaultUnit:'kohm',default:'10',positive:true,max:1e12},
  {id:'R2',kind:'number',label:'Alsó ellenállás',symbol:'R2',units:'resistance',defaultUnit:'kohm',default:'10',positive:true,max:1e12,showIf:{field:'mod',is:['kimenet']}},
  {id:'RL',kind:'number',label:'Terhelő ellenállás (nem kötelező)',symbol:'RL',units:'resistance',defaultUnit:'kohm',optional:true,positive:true,max:1e12,showIf:{field:'mod',is:['kimenet']},help:'A kimenetre kötött fogyasztó ellenállása; üresen terheletlen osztóval számol.'},
  {id:'Uki',kind:'number',label:'Kívánt kimeneti feszültség',symbol:'Uki',units:'voltage',default:'3,3',positive:true,max:1e5,showIf:{field:'mod',is:['r2']}},
 ],
 compute(v){
  const Ube=v.n('Ube'),R1=v.n('R1'),steps:Step[]=[];
  if(v.s('mod')==='kimenet'){
   const R2=v.n('R2'),RL=v.opt('RL'),R2e=RL?R2*RL/(R2+RL):R2;
   if(RL)steps.push(step('Terhelt alsó ág','R2e = R2 · RL / (R2 + RL)',`R2e = ${si(R2,'Ω')} · ${si(RL,'Ω')} / (${si(R2,'Ω')} + ${si(RL,'Ω')})`,si(R2e,'Ω')));
   const Uki=Ube*R2e/(R1+R2e),I=Ube/(R1+R2e);
   steps.push(step('Kimeneti feszültség',RL?'Uki = Ube · R2e / (R1 + R2e)':'Uki = Ube · R2 / (R1 + R2)',`Uki = ${si(Ube,'V')} · ${si(R2e,'Ω')} / (${si(R1,'Ω')} + ${si(R2e,'Ω')})`,si(Uki,'V')),step('Osztóáram','I = Ube / (R1 + R2e)',`I = ${si(Ube,'V')} / ${si(R1+R2e,'Ω')}`,si(I,'A')));
   return {results:[{id:'Uki',label:'Kimeneti feszültség',value:Uki,unit:'V',text:si(Uki,'V'),primary:true},{id:'I',label:'Osztóáram',value:I,unit:'A',text:si(I,'A')},{id:'P1',label:'R1 teljesítménye',value:I*I*R1,unit:'W',text:si(I*I*R1,'W')}],steps};
  }
  const Uki=v.n('Uki');
  if(!(Uki<Ube))throw new CalcError('A kimeneti feszültség csak kisebb lehet a bemenetinél.','Uki');
  const R2=R1*Uki/(Ube-Uki),e24=nextSeriesValue(R2,E24),Ue=Ube*e24/(R1+e24);
  steps.push(step('Alsó ellenállás','R2 = R1 · Uki / (Ube − Uki)',`R2 = ${si(R1,'Ω')} · ${si(Uki,'V')} / (${si(Ube,'V')} − ${si(Uki,'V')})`,si(R2,'Ω')),step('E24-es érték','a legkisebb E24-érték ≥ R2','E24: '+si(e24,'Ω')+' → Uki = Ube · R2 / (R1 + R2)',si(Ue,'V'),E_SERIES_SOURCE));
  const results:ResultItem[]=[{id:'R2',label:'Számított R2',value:R2,unit:'Ω',text:si(R2,'Ω'),primary:true},{id:'R2e24',label:'Javasolt E24-érték',value:e24,unit:'Ω',text:si(e24,'Ω')},{id:'Ue24',label:'Kimenet az E24-értékkel',value:Ue,unit:'V',text:si(Ue,'V')}];
  return {results,steps};
 },
 formulas:['Uki = Ube · R2 / (R1 + R2)','terhelve: R2 helyett R2 · RL / (R2 + RL)','R2 = R1 · Uki / (Ube − Uki)'],
 notes:{good:['Jelszintek, referenciafeszültségek, mérőbemenetek osztójának számítása.','A terhelés hatásának szemléltetése.'],bad:['Fogyasztó tápellátására: az osztó kimenete a terheléssel változik, és a veszteség nagy – erre stabilizátor kell.','Hálózati feszültség osztására: életveszélyes, szigetelési és biztonsági követelmények vonatkoznak rá.']},
 safety:['alap','kalkulator'],
 examples:[
  {title:'12 V, 10 kΩ / 10 kΩ',input:{mod:'kimenet',Ube:'12',R1:'10','R1.e':'kohm',R2:'10','R2.e':'kohm'},expect:{Uki:6,I:0.0006}},
  {title:'5 V, 10 kΩ / 4,7 kΩ',input:{mod:'kimenet',Ube:'5',R1:'10','R1.e':'kohm',R2:'4,7','R2.e':'kohm'},expect:{Uki:1.59864}},
  {title:'Terhelve: 12 V, 10/10 kΩ, RL = 10 kΩ',input:{mod:'kimenet',Ube:'12',R1:'10','R1.e':'kohm',R2:'10','R2.e':'kohm',RL:'10','RL.e':'kohm'},expect:{Uki:4}},
  {title:'R2 méretezése 12 V → 3,3 V, R1 = 10 kΩ',input:{mod:'r2',Ube:'12',R1:'10','R1.e':'kohm',Uki:'3,3'},expect:{R2:3793.10,R2e24:3900,Ue24:3.36691}},
 ],
 related:['eredo-ellenallas','ohm-torveny','led-elotet-ellenallas'],articles:[],
 sources:['Feszültségosztó (soros áramkör, Ohm-törvény) – alapösszefüggés',E_SERIES_SOURCE],
};
export default def;
