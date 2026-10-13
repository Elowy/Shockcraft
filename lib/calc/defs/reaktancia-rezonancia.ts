import type {CalcDef} from '../core';
import {si,step} from '../fields';

const def:CalcDef={
 slug:'reaktancia-rezonancia',title:'Reaktancia és rezonancia',category:'elektronika',tier:'T0',version:1,updated:'2026-10-10',
 short:'Tekercs és kondenzátor reaktanciája adott frekvencián (XL = 2πfL, XC = 1/(2πfC)), valamint az LC-kör rezonanciafrekvenciája.',
 keywords:['reaktancia','induktív reaktancia','kapacitív reaktancia','rezonancia','rezonanciafrekvencia','XL','XC','LC kör','Thomson-képlet'],
 synonyms:['reaktancia','rezonancia frekvencia','thomson keplet','lc rezgokor'],
 fields:[
  {id:'mod',kind:'select',label:'Mit számolsz?',style:'segmented',default:'xl',options:[{value:'xl',label:'Induktív reaktancia',short:'XL'},{value:'xc',label:'Kapacitív reaktancia',short:'XC'},{value:'f0',label:'Rezonancia',short:'f0'}]},
  {id:'f',kind:'number',label:'Frekvencia',symbol:'f',units:'frequency',default:'50',positive:true,max:1e12,showIf:{field:'mod',is:['xl','xc']}},
  {id:'L',kind:'number',label:'Induktivitás',symbol:'L',units:'inductance',default:'100',positive:true,max:1e6,showIf:{field:'mod',is:['xl','f0']}},
  {id:'C',kind:'number',label:'Kapacitás',symbol:'C',units:'capacitance',default:'10',positive:true,max:1e3,showIf:{field:'mod',is:['xc','f0']}},
 ],
 compute(v){
  const m=v.s('mod'),w=(f:number)=>2*Math.PI*f;
  if(m==='xl'){const f=v.n('f'),L=v.n('L'),X=w(f)*L;return {results:[{id:'XL',label:'Induktív reaktancia',value:X,unit:'Ω',text:si(X,'Ω'),primary:true}],steps:[step('Induktív reaktancia','XL = 2π · f · L',`XL = 2π · ${si(f,'Hz')} · ${si(L,'H')}`,si(X,'Ω'))]}}
  if(m==='xc'){const f=v.n('f'),C=v.n('C'),X=1/(w(f)*C);return {results:[{id:'XC',label:'Kapacitív reaktancia',value:X,unit:'Ω',text:si(X,'Ω'),primary:true}],steps:[step('Kapacitív reaktancia','XC = 1 / (2π · f · C)',`XC = 1 / (2π · ${si(f,'Hz')} · ${si(C,'F')})`,si(X,'Ω'))]}}
  const L=v.n('L'),C=v.n('C'),f0=1/(2*Math.PI*Math.sqrt(L*C)),Z0=Math.sqrt(L/C);
  return {results:[{id:'f0',label:'Rezonanciafrekvencia',value:f0,unit:'Hz',text:si(f0,'Hz'),primary:true},{id:'Z0',label:'Reaktancia a rezonancián (XL = XC)',value:Z0,unit:'Ω',text:si(Z0,'Ω')}],steps:[step('Rezonanciafrekvencia','f0 = 1 / (2π · √(L · C))',`f0 = 1 / (2π · √(${si(L,'H')} · ${si(C,'F')}))`,si(f0,'Hz')),step('Reaktancia a rezonancián','XL = XC = √(L / C)',`√(${si(L,'H')} / ${si(C,'F')})`,si(Z0,'Ω'))]};
 },
 formulas:['XL = 2π · f · L','XC = 1 / (2π · f · C)','f0 = 1 / (2π · √(L · C))'],
 notes:{good:['Szűrők, fojtók, kondenzátorok viselkedésének becslése adott frekvencián.','Rezgőkörök hangolása.'],bad:['Valós tekercs ohmos ellenállásának és veszteségeinek figyelembevételére.','Hálózati fázisjavító telep rezonanciájának vizsgálatára (felharmonikus-szűrés tervezése szakember feladata).']},
 safety:['alap'],
 examples:[
  {title:'100 mH 50 Hz-en',input:{mod:'xl',f:'50',L:'100','L.e':'mH'},expect:{XL:31.4159}},
  {title:'10 µF 50 Hz-en',input:{mod:'xc',f:'50',C:'10','C.e':'uF'},expect:{XC:318.310}},
  {title:'10 mH és 100 nF rezonanciája',input:{mod:'f0',L:'10','L.e':'mH',C:'100','C.e':'nF'},expect:{f0:5032.92,Z0:316.228}},
  {title:'1 mH 1 kHz-en',input:{mod:'xl',f:'1','f.e':'kHz',L:'1','L.e':'mH'},expect:{XL:6.28319}},
 ],
 related:['eredo-kapacitas','fazisjavitas','latszolagos-meddo-teljesitmeny'],articles:[],
 sources:['Váltakozó áramú reaktancia és a Thomson-képlet – alapösszefüggések'],
};
export default def;
