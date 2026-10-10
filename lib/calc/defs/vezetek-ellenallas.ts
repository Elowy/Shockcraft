import {CalcError,type CalcDef,type Issue} from '../core';
import {MATERIALS,type Material} from '../constants';
import {rhoAt,wireResistance} from '../formulas';
import {step,u} from '../fields';
import {SIZING_TABLES,reviewText} from '../../sizing-tables';

const def:CalcDef={
 slug:'vezetek-ellenallas',title:'Vezeték-ellenállás',category:'vezetekek',tier:'T0',version:1,updated:'2026-10-10',
 short:'Réz- vagy alumíniumvezeték ellenállása hosszból, keresztmetszetből és hőmérsékletből: R = ρ20 · (1 + α · Δθ) · l / A, oda-vissza ×2.',
 keywords:['vezeték ellenállás','kábel ellenállás','fajlagos ellenállás','ρ','rho','réz','alumínium','ohm per km','hurokellenállás'],
 synonyms:['vezetek ellenallas','kabel ellenallas','rez ellenallas','alu ellenallas'],
 fields:[
  {id:'anyag',kind:'select',label:'Vezető anyaga',style:'segmented',default:'Cu',options:[{value:'Cu',label:'Réz (Cu)',short:'Cu'},{value:'Al',label:'Alumínium (Al)',short:'Al'}]},
  {id:'mod',kind:'select',label:'Fajlagos ellenállás',style:'select',default:'rho20',options:[{value:'rho20',label:'Hőmérséklet szerint (ρ20 és α)'},{value:'rho1',label:'Feszültségesés-számításhoz (ρ1, réz, méretezési táblázat)'}]},
  {id:'L',kind:'number',label:'Hossz (egy irányban)',symbol:'l',units:'length',default:'100',positive:true,max:1e5},
  {id:'A',kind:'number',label:'Keresztmetszet',symbol:'A',unit:'mm²',default:'2,5',positive:true,max:1000},
  {id:'theta',kind:'number',label:'Vezetőhőmérséklet',symbol:'θ',unit:'°C',default:'20',min:-50,max:250,allowNegative:true,showIf:{field:'mod',is:['rho20']}},
  {id:'ut',kind:'select',label:'Áramút',style:'segmented',default:'2',options:[{value:'1',label:'Egy vezető'},{value:'2',label:'Oda-vissza (2 vezető)',short:'oda-vissza'}]},
 ],
 compute(v){
  const mat=v.s('anyag') as Material,m=MATERIALS[mat],mode=v.s('mod'),L=v.n('L'),A=v.n('A'),n=Number(v.s('ut'));
  const issues:Issue[]=[];let rho:number,rhoStep;
  if(mode==='rho1'){
   if(mat!=='Cu')throw new CalcError('A méretezési táblázat ρ1 értéke csak rézvezetőre van rögzítve. Alumíniumnál válaszd a hőmérséklet szerinti módot.','anyag');
   rho=SIZING_TABLES.rho1;rhoStep=step('Fajlagos ellenállás','ρ1 (üzemi hőmérséklet, G.52.2)','ρ1 a méretezési táblázatból',u(rho,'Ω·mm²/m',4),'MSZ HD 60364-5-52 G.52.2');
   issues.push({level:'info',text:'ρ1 a programban rögzített méretezési táblázatból. '+reviewText()});
  }else{
   const theta=v.n('theta');rho=rhoAt(m.rho20,m.alpha,theta);
   rhoStep=step('Fajlagos ellenállás θ-n','ρθ = ρ20 · (1 + α · (θ − 20 °C))',`ρθ = ${u(m.rho20,'Ω·mm²/m',6)} · (1 + ${u(m.alpha,'1/K',5)} · (${u(theta,'°C')} − 20 °C))`,u(rho,'Ω·mm²/m',6),m.source);
  }
  const R=wireResistance(rho,L,A,n),perKm=rho*1000/A;
  return {
   results:[{id:'R',label:'Ellenállás',value:R,unit:'Ω',text:u(R,'Ω'),primary:true},{id:'rho',label:'Fajlagos ellenállás',value:rho,unit:'Ω·mm²/m',text:u(rho,'Ω·mm²/m',6)},{id:'Rkm',label:'Egy vezető ellenállása kilométerenként',value:perKm,unit:'Ω/km',text:u(perKm,'Ω/km')}],
   steps:[rhoStep,step('Ellenállás',n===2?'R = ρ · 2 · l / A':'R = ρ · l / A',`R = ${u(rho,'Ω·mm²/m',6)} · ${n===2?'2 · ':''}${u(L,'m')} / ${u(A,'mm²')}`,u(R,'Ω'))],
   issues,assumptions:['Egyenáramú ellenállás; a váltakozó áramú bőrhatás kis keresztmetszeten elhanyagolható.','A hőmérséklet a vezető hőmérséklete, nem a környezeté.'],
  };
 },
 formulas:['R = ρθ · l / A','ρθ = ρ20 · (1 + α · (θ − 20 °C))','oda-vissza áramút: R = ρθ · 2 · l / A'],
 notes:{
  good:['Hosszú vezeték ellenállásának becslése (pl. kerti lámpa, melléképület betáplálása).','Mért és számított hurokellenállás összevetése.'],
  bad:['Terhelhetőség vagy keresztmetszet kiválasztása: ahhoz a szerelési mód, a hőmérséklet és a védelem is kell (tervezői feladat).','Sodrott, többszálas vagy ónozott vezetők pontos gyártói értékeinek kiváltása.'],
 },
 safety:['alap','kalkulator'],
 examples:[
  {title:'100 m, 2,5 mm² réz, 20 °C, egy vezető',input:{anyag:'Cu',mod:'rho20',L:'100',A:'2,5',theta:'20',ut:'1'},expect:{R:0.68964,Rkm:6.8964}},
  {title:'100 m, 2,5 mm² réz, 70 °C, oda-vissza',input:{anyag:'Cu',mod:'rho20',L:'100',A:'2,5',theta:'70',ut:'2'},expect:{R:1.65031,rho:0.0206289}},
  {title:'50 m, 16 mm² alumínium, oda-vissza',input:{anyag:'Al',mod:'rho20',L:'50',A:'16',theta:'20',ut:'2'},expect:{R:0.17665}},
  {title:'23,4 m, 2,5 mm², ρ1 (feszültségeséshez)',input:{anyag:'Cu',mod:'rho1',L:'23,4',A:'2,5',ut:'2'},expect:{R:0.4212}},
  {title:'1 km, 1,5 mm² réz, 0 °C',input:{anyag:'Cu',mod:'rho20',L:'1','L.e':'km',A:'1,5',theta:'0',ut:'1'},expect:{R:10.5906}},
 ],
 related:['feszultseges','hurokimpedancia','homerseklet','ohm-torveny'],articles:[],
 sources:[MATERIALS.Cu.source,MATERIALS.Al.source,'ρ1: MSZ HD 60364-5-52 G.52.2 (a lib/sizing-tables.ts értéke)'],
};
export default def;
