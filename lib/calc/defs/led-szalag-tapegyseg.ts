import type {CalcDef,Issue,ResultItem} from '../core';
import {PSU_SIZES,nextAtLeast} from '../constants';
import {step,u} from '../fields';

const def:CalcDef={
 slug:'led-szalag-tapegyseg',title:'LED-szalag tápegysége',category:'vilagitas',tier:'T1',version:1,updated:'2026-10-10',
 short:'LED-szalag teljesítménye és árama a hosszból és a méterenkénti teljesítményből, tartalékkal; a következő jellemző tápegység-teljesítménnyel.',
 keywords:['LED szalag','LED szalag tápegység','tápegység méretezés','12V','24V','W/m','LED trafó','LED tápegység'],
 synonyms:['led szalag','led tap','led trafo','szalag tapegyseg'],
 fields:[
  {id:'L',kind:'number',label:'Szalaghossz',symbol:'L',unit:'m',default:'5',positive:true,max:1000},
  {id:'pm',kind:'number',label:'Teljesítmény méterenként',symbol:'P/m',unit:'W/m',default:'14,4',positive:true,max:200,help:'A szalag adatlapjáról.'},
  {id:'U',kind:'number',label:'Szalagfeszültség',symbol:'U',unit:'V',default:'24',positive:true,max:60,help:'Jellemzően 5, 12 vagy 24 V (törpefeszültség).'},
  {id:'r',kind:'number',label:'Teljesítménytartalék',symbol:'t',unit:'%',default:'20',min:0,max:100},
 ],
 compute(v){
  const L=v.n('L'),pm=v.n('pm'),U=v.n('U'),r=v.n('r'),P=L*pm,I=P/U,Pmin=P*(1+r/100),psu=nextAtLeast(Pmin,PSU_SIZES.value);
  const issues:Issue[]=[];
  if(psu===null)issues.push({level:'warn',text:'Ehhez a terheléshez egy tápegység helyett több szakaszra bontott betáplálás javasolt.'});
  const feed=U<=12?5:10;
  if(L>feed)issues.push({level:'info',text:`${u(L,'m')} hosszú szalagnál a feszültségesés miatt a túlsó vég halványabb lehet; ${U<=12?'12 V-os':'24 V-os'} szalagnál jellemzően ${feed} m-enként javasolt betáplálni – a gyártói adatlap az irányadó.`});
  const results:ResultItem[]=[{id:'P',label:'A szalag teljesítménye',value:P,unit:'W',text:u(P,'W')},{id:'I',label:'A szalag árama',value:I,unit:'A',text:u(I,'A')},{id:'Pmin',label:'Szükséges tápegység-teljesítmény',value:Pmin,unit:'W',text:u(Pmin,'W')}];
  if(psu!==null)results.push({id:'psu',label:'Javasolt tápegység (jellemző érték)',value:psu,unit:'W',text:psu+'\u00a0W',primary:true});
  return {results,steps:[step('Szalagteljesítmény','P = L · P/m',`P = ${u(L,'m')} · ${u(pm,'W/m')}`,u(P,'W')),step('Áram','I = P / U',`I = ${u(P,'W')} / ${u(U,'V')}`,u(I,'A')),step('Tartalékkal','Pmin = P · (1 + t)',`Pmin = ${u(P,'W')} · (1 + ${u(r,'%')})`,u(Pmin,'W'))].concat(psu!==null?[step('Tápegység','a legkisebb jellemző érték ≥ Pmin',PSU_SIZES.value.join(', ')+' W',psu+' W',PSU_SIZES.source)]:[]),issues,
   assumptions:['A méterenkénti teljesítmény a szalag névleges feszültségén érvényes.','Állandó feszültségű (CV) szalag és tápegység.']};
 },
 formulas:['P = L · P/m','I = P / U','Pmin = P · (1 + tartalék)'],
 notes:{good:['Állandó feszültségű LED-szalag tápegységének kiválasztása.','A szalag áramának becslése a vezeték és a kapcsoló kiválasztásához.'],bad:['Állandó áramú (CC) LED-ekhez.','A tápegység hálózati oldalának bekötésére és védelmére (az erősáramú rész szakember feladata).']},
 safety:['alap','kalkulator','beavatkozas'],
 notCovered:['a szalag menti feszültségesés pontos számítása','a tápegység hőmérséklete, beépítési módja és IP-védettsége','a bekapcsolási áramlökés és a kismegszakító kiválasztása','dimmerek és vezérlők kompatibilitása'],
 examples:[
  {title:'5 m × 14,4 W/m, 24 V, 20 % tartalék',input:{L:'5',pm:'14,4',U:'24',r:'20'},expect:{P:72,I:3,Pmin:86.4,psu:100}},
  {title:'10 m × 9,6 W/m, 12 V, 20 %',input:{L:'10',pm:'9,6',U:'12',r:'20'},expect:{P:96,I:8,Pmin:115.2,psu:120}},
  {title:'3 m × 4,8 W/m, 24 V, 25 %',input:{L:'3',pm:'4,8',U:'24',r:'25'},expect:{P:14.4,I:0.6,Pmin:18,psu:25}},
 ],
 related:['lumen-lux','aram-teljesitmenybol','transzformator','fogyasztas-koltseg'],articles:[],
 sources:['Teljesítmény-összefüggés (P = U · I)',PSU_SIZES.source],
};
export default def;
