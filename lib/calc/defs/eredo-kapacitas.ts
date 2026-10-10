import type {CalcDef} from '../core';
import {parallelSum,seriesSum} from '../formulas';
import {si,step} from '../fields';

const def:CalcDef={
 slug:'eredo-kapacitas',title:'Eredő kapacitás (soros, párhuzamos)',category:'elektronika',tier:'T0',version:1,updated:'2026-10-10',
 short:'Párhuzamosan és sorosan kapcsolt kondenzátorok eredő kapacitása 2–20 tagra: párhuzamosan összeadódnak, sorosan a reciprokok összege.',
 keywords:['eredő kapacitás','kondenzátor','soros kondenzátor','párhuzamos kondenzátor','µF','nF','kapacitás'],
 synonyms:['eredo kapacitas','kondenzator kapcsolas','mikrofarad'],
 fields:[
  {id:'mod',kind:'select',label:'Kapcsolás',style:'segmented',default:'parhuzamos',options:[{value:'parhuzamos',label:'Párhuzamos',short:'párhuzamos'},{value:'soros',label:'Soros',short:'soros'}]},
  {id:'C',kind:'list',label:'Kapacitások',symbol:'C',units:'capacitance',default:'10; 22',minItems:2,maxItems:20,positive:true,max:1e3,help:'Pontosvesszővel elválasztva, pl. 10; 22.'},
 ],
 compute(v){
  const C=v.list('C'),par=v.s('mod')==='parhuzamos',Ce=par?seriesSum(C):parallelSum(C);
  const terms=C.map(x=>par?si(x,'F'):'1/'+si(x,'F')).join(' + ');
  return {results:[{id:'Ce',label:'Eredő kapacitás',value:Ce,unit:'F',text:si(Ce,'F'),primary:true}],
   steps:[step(par?'Párhuzamos eredő':'Soros eredő',par?'Ce = C1 + C2 + … + Cn':'1/Ce = 1/C1 + 1/C2 + … + 1/Cn',(par?'Ce = ':'1/Ce = ')+terms,si(Ce,'F'))],
   issues:par?[]:[{level:'info',text:'Soros kapcsolásnál a feszültség a kapacitásokkal fordított arányban oszlik meg; minden kondenzátor feszültségtűrését ellenőrizni kell.'}]};
 },
 formulas:['Párhuzamos: Ce = C1 + C2 + … + Cn','Soros: 1/Ce = 1/C1 + 1/C2 + … + 1/Cn'],
 notes:{good:['Kondenzátortelepek, szűrők eredő kapacitásának számítása.','Hiányzó érték pótlása több kondenzátor összekapcsolásával.'],bad:['Motorkondenzátor kiválasztására: annak értékét a motor gyártója adja meg.','Elektrolitkondenzátorok soros kapcsolásánál a kiegyenlítő ellenállások méretezésére.']},
 safety:['alap','kalkulator'],
 examples:[
  {title:'Párhuzamos: 10 és 22 µF',input:{mod:'parhuzamos',C:'10; 22','C.e':'uF'},expect:{Ce:32e-6}},
  {title:'Soros: 2 × 10 µF',input:{mod:'soros',C:'10; 10','C.e':'uF'},expect:{Ce:5e-6}},
  {title:'Soros: 1, 2 és 3 µF',input:{mod:'soros',C:'1; 2; 3','C.e':'uF'},expect:{Ce:5.45455e-7}},
  {title:'Párhuzamos: 100 nF és 220 nF',input:{mod:'parhuzamos',C:'100; 220','C.e':'nF'},expect:{Ce:3.2e-7}},
 ],
 related:['eredo-ellenallas','reaktancia-rezonancia','fazisjavitas'],articles:[],
 sources:['Kondenzátorok soros és párhuzamos kapcsolása (Q = C · U) – alapösszefüggés'],
};
export default def;
