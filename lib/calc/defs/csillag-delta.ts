import type {CalcDef} from '../core';
import {deltaToStar,starToDelta} from '../formulas';
import {si,step,u} from '../fields';

const r=(id:string,label:string,def:string,mode:string)=>({id,kind:'number' as const,label,symbol:id,units:'resistance' as const,default:def,positive:true,max:1e12,showIf:{field:'mod',is:[mode]}});

const def:CalcDef={
 slug:'csillag-delta',title:'Csillag–delta átalakítás',category:'alapok',tier:'T0',version:1,updated:'2026-10-10',
 short:'Ellenállás-hálózat csillag (Y) és delta (Δ) kapcsolásának egyenértékű átszámítása mindkét irányba, képlettel és behelyettesítéssel.',
 keywords:['csillag delta','csillag-delta átalakítás','Y delta','Y-Δ','háromszög kapcsolás','ellenállás hálózat'],
 synonyms:['csillag delta','y delta','haromszog csillag','delta csillag'],
 fields:[
  {id:'mod',kind:'select',label:'Átalakítás',style:'segmented',default:'y2d',options:[{value:'y2d',label:'Csillag → delta',short:'Y → Δ'},{value:'d2y',label:'Delta → csillag',short:'Δ → Y'}]},
  r('R1','Az 1. csomóponti ág','10','y2d'),r('R2','A 2. csomóponti ág','20','y2d'),r('R3','A 3. csomóponti ág','30','y2d'),
  r('R12','Az 1–2 csomópont közötti ág','30','d2y'),r('R23','A 2–3 csomópont közötti ág','30','d2y'),r('R31','A 3–1 csomópont közötti ág','30','d2y'),
 ],
 compute(v){
  if(v.s('mod')==='y2d'){
   const [R1,R2,R3]=['R1','R2','R3'].map(id=>v.n(id)),d=starToDelta(R1,R2,R3);
   const S=`${si(R1,'Ω')} · ${si(R2,'Ω')} + ${si(R2,'Ω')} · ${si(R3,'Ω')} + ${si(R3,'Ω')} · ${si(R1,'Ω')}`;
   return {results:[{id:'R12',label:'R12',value:d.r12,unit:'Ω',text:si(d.r12,'Ω'),primary:true},{id:'R23',label:'R23',value:d.r23,unit:'Ω',text:si(d.r23,'Ω'),primary:true},{id:'R31',label:'R31',value:d.r31,unit:'Ω',text:si(d.r31,'Ω'),primary:true}],
    steps:[step('Szorzatösszeg','Σ = R1·R2 + R2·R3 + R3·R1','Σ = '+S,u(d.sum,'Ω²')),step('R12','R12 = Σ / R3',`R12 = ${u(d.sum,'Ω²')} / ${si(R3,'Ω')}`,si(d.r12,'Ω')),step('R23','R23 = Σ / R1',`R23 = ${u(d.sum,'Ω²')} / ${si(R1,'Ω')}`,si(d.r23,'Ω')),step('R31','R31 = Σ / R2',`R31 = ${u(d.sum,'Ω²')} / ${si(R2,'Ω')}`,si(d.r31,'Ω'))]};
  }
  const [R12,R23,R31]=['R12','R23','R31'].map(id=>v.n(id)),y=deltaToStar(R12,R23,R31);
  return {results:[{id:'R1',label:'R1',value:y.r1,unit:'Ω',text:si(y.r1,'Ω'),primary:true},{id:'R2',label:'R2',value:y.r2,unit:'Ω',text:si(y.r2,'Ω'),primary:true},{id:'R3',label:'R3',value:y.r3,unit:'Ω',text:si(y.r3,'Ω'),primary:true}],
   steps:[step('Összeg','ΣR = R12 + R23 + R31',`ΣR = ${si(R12,'Ω')} + ${si(R23,'Ω')} + ${si(R31,'Ω')}`,si(y.sum,'Ω')),step('R1','R1 = R12 · R31 / ΣR',`R1 = ${si(R12,'Ω')} · ${si(R31,'Ω')} / ${si(y.sum,'Ω')}`,si(y.r1,'Ω')),step('R2','R2 = R12 · R23 / ΣR',`R2 = ${si(R12,'Ω')} · ${si(R23,'Ω')} / ${si(y.sum,'Ω')}`,si(y.r2,'Ω')),step('R3','R3 = R23 · R31 / ΣR',`R3 = ${si(R23,'Ω')} · ${si(R31,'Ω')} / ${si(y.sum,'Ω')}`,si(y.r3,'Ω'))]};
 },
 formulas:['Y → Δ: R12 = (R1R2 + R2R3 + R3R1) / R3 (és ciklikusan)','Δ → Y: R1 = R12 · R31 / (R12 + R23 + R31) (és ciklikusan)','szimmetrikus esetben: RΔ = 3 · RY'],
 notes:{good:['Ellenállás-hálózatok egyszerűsítése (hídkapcsolás eredőjének számítása).','Háromfázisú szimmetrikus fogyasztók csillag- és deltakapcsolású egyenértékének szemléltetése.'],bad:['Motor csillag–delta indításának méretezésére: ott a teljesítmény és az áram aránya a lényeg (1/3).','Komplex impedanciákra – ez a kalkulátor csak ohmos ellenállásokkal számol.']},
 safety:['alap'],
 examples:[
  {title:'Csillag 10, 20, 30 Ω → delta',input:{mod:'y2d',R1:'10',R2:'20',R3:'30'},expect:{R12:36.6667,R23:110,R31:55}},
  {title:'Szimmetrikus delta 3 × 30 Ω → csillag',input:{mod:'d2y',R12:'30',R23:'30',R31:'30'},expect:{R1:10,R2:10,R3:10}},
  {title:'Visszafelé: 36,6667 / 110 / 55 Ω → csillag',input:{mod:'d2y',R12:'36,666667',R23:'110',R31:'55'},expect:{R1:10,R2:20,R3:30}},
  {title:'Szimmetrikus csillag 3 × 1 kΩ → delta',input:{mod:'y2d',R1:'1','R1.e':'kohm',R2:'1','R2.e':'kohm',R3:'1','R3.e':'kohm'},expect:{R12:3000}},
 ],
 related:['eredo-ellenallas','ohm-torveny'],articles:[],
 sources:['Kennelly-féle csillag–delta átalakítás – hálózatelméleti alapösszefüggés'],
};
export default def;
