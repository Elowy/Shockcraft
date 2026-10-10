import {CalcError,type CalcDef} from '../core';
import {parallelSum,seriesSum} from '../formulas';
import {si,step} from '../fields';

const list=(xs:number[])=>xs.map(x=>si(x,'Ω')).join(' + ');
const inv=(xs:number[])=>xs.map(x=>'1/'+si(x,'Ω')).join(' + ');

const def:CalcDef={
 slug:'eredo-ellenallas',title:'Eredő ellenállás (soros, párhuzamos)',category:'alapok',tier:'T0',version:1,updated:'2026-10-10',
 short:'Soros és párhuzamos ellenállások eredője 2–20 tagra, valamint a hiányzó párhuzamos tag kiszámítása a kívánt eredőből.',
 keywords:['eredő ellenállás','soros ellenállás','párhuzamos ellenállás','replusz','ellenállások kapcsolása','Re'],
 synonyms:['eredo ellenallas','soros kapcsolas','parhuzamos kapcsolas','replusz'],
 fields:[
  {id:'mod',kind:'select',label:'Kapcsolás',style:'segmented',default:'soros',options:[{value:'soros',label:'Soros',short:'soros'},{value:'parhuzamos',label:'Párhuzamos',short:'párhuzamos'},{value:'hianyzo',label:'Hiányzó párhuzamos tag',short:'hiányzó tag'}]},
  {id:'R',kind:'list',label:'Ellenállások',symbol:'R',units:'resistance',default:'10; 22; 47',minItems:2,maxItems:20,positive:true,max:1e12,help:'Pontosvesszővel elválasztva, pl. 10; 22; 47.',showIf:{field:'mod',is:['soros','parhuzamos']}},
  {id:'Re',kind:'number',label:'Kívánt eredő',symbol:'Re',units:'resistance',default:'8',positive:true,max:1e12,showIf:{field:'mod',is:['hianyzo']}},
  {id:'Rk',kind:'list',label:'Ismert párhuzamos ágak',symbol:'R',units:'resistance',default:'10',minItems:1,maxItems:19,positive:true,max:1e12,help:'Pontosvesszővel elválasztva.',showIf:{field:'mod',is:['hianyzo']}},
 ],
 compute(v){
  const m=v.s('mod');
  if(m==='soros'){const R=v.list('R'),Re=seriesSum(R);return {results:[{id:'Re',label:'Eredő ellenállás',value:Re,unit:'Ω',text:si(Re,'Ω'),primary:true}],steps:[step('Soros eredő','Re = R1 + R2 + … + Rn','Re = '+list(R),si(Re,'Ω'))],issues:[{level:'info',text:'Soros kapcsolásban az eredő mindig nagyobb a legnagyobb tagnál.'}]}}
  if(m==='parhuzamos'){const R=v.list('R'),Re=parallelSum(R);return {results:[{id:'Re',label:'Eredő ellenállás',value:Re,unit:'Ω',text:si(Re,'Ω'),primary:true},{id:'G',label:'Eredő vezetés',value:1/Re,unit:'S',text:si(1/Re,'S')}],steps:[step('Párhuzamos eredő','1/Re = 1/R1 + 1/R2 + … + 1/Rn','1/Re = '+inv(R),si(Re,'Ω'))],issues:[{level:'info',text:'Párhuzamos kapcsolásban az eredő mindig kisebb a legkisebb tagnál.'}]}}
  const Re=v.n('Re'),Rk=v.list('Rk'),g=1/Re-Rk.reduce((s,x)=>s+1/x,0);
  if(!(g>1e-15))throw new CalcError('A kívánt eredő nem lehet nagyobb vagy egyenlő az ismert ágak párhuzamos eredőjénél ('+si(parallelSum(Rk),'Ω')+').','Re');
  const Rx=1/g;
  return {results:[{id:'Rx',label:'Hiányzó ellenállás',value:Rx,unit:'Ω',text:si(Rx,'Ω'),primary:true}],steps:[step('Hiányzó tag','1/Rx = 1/Re − (1/R1 + … + 1/Rn)',`1/Rx = 1/${si(Re,'Ω')} − (${inv(Rk)})`,si(Rx,'Ω'))]};
 },
 formulas:['Soros: Re = R1 + R2 + … + Rn','Párhuzamos: 1/Re = 1/R1 + 1/R2 + … + 1/Rn','Két tag: Re = R1 · R2 / (R1 + R2)'],
 notes:{good:['Fűtőbetétek, ellenállás-hálózatok, előtétek eredőjének számítása.','Egy szükséges párhuzamos ellenállás meghatározása a kívánt eredőhöz.'],bad:['Váltakozó áramú impedanciák (L, C) eredőjére – ott a fázisszög is számít.','Hőmérsékletfüggő elemekre (izzószál, NTC) üzemi állapotban.']},
 safety:['alap','kalkulator'],
 examples:[
  {title:'Soros: 10, 22 és 47 Ω',input:{mod:'soros',R:'10; 22; 47','R.e':'ohm'},expect:{Re:79}},
  {title:'Párhuzamos: 10, 22 és 47 Ω',input:{mod:'parhuzamos',R:'10; 22; 47','R.e':'ohm'},expect:{Re:5.99768}},
  {title:'Párhuzamos: 2 × 100 Ω',input:{mod:'parhuzamos',R:'100;100','R.e':'ohm'},expect:{Re:50,G:0.02}},
  {title:'Hiányzó tag: 8 Ω eredő 10 Ω mellé',input:{mod:'hianyzo',Re:'8','Re.e':'ohm',Rk:'10','Rk.e':'ohm'},expect:{Rx:40}},
  {title:'Soros: 1 kΩ és 2,2 kΩ',input:{mod:'soros',R:'1; 2,2','R.e':'kohm'},expect:{Re:3200}},
  {title:'Hiányzó tag: 1 kΩ eredő 2,2 és 4,7 kΩ mellé',input:{mod:'hianyzo',Re:'1','Re.e':'kohm',Rk:'2,2; 4,7','Rk.e':'kohm'},expect:{Rx:3005.81}},
 ],
 related:['ohm-torveny','eredo-kapacitas','csillag-delta','feszultsegoszto'],articles:[],
 sources:['Kirchhoff-törvények: soros és párhuzamos kapcsolás eredője – alapösszefüggés'],
};
export default def;
