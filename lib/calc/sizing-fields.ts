// A méretezési (T1, táblázatalapú) kalkulátorok közös mezői és Iz-számítása.
// Minden szám a lib/sizing-tables.ts-ből, minden képlet a lib/sizing-formulas.ts-ből jön – ugyanaz, amit a tervező Méretezés füle használ.
import type {Inputs,NumberField,SelectField,Step} from './core';
import {MCB_RATINGS} from './constants';
import {fmtNum} from '../sizing-formulas';
import {INSTALL_METHODS,INSULATIONS,SECTIONS,capacity,groupingFactor,insulationLabels,methodLabels,temperatureFactor,type InstallMethod,type Insulation,type TableRef} from '../sizing-tables';
import {step,u} from './fields';

export const methodField:SelectField={id:'mod',kind:'select',label:'Szerelési mód',style:'select',default:'B2',options:INSTALL_METHODS.map(m=>({value:m,label:methodLabels[m],short:m}))};
export const insulationField:SelectField={id:'szig',kind:'select',label:'Szigetelés',style:'select',default:'PVC',options:INSULATIONS.map(i=>({value:i,label:insulationLabels[i]}))};
export const loadedField:SelectField={id:'erek',kind:'select',label:'Terhelt erek',style:'segmented',default:'2',options:[{value:'2',label:'2 ér (egyfázisú)',short:'1f'},{value:'3',label:'3 ér (háromfázisú)',short:'3f'}]};
export const ambientField:NumberField={id:'temp',kind:'number',label:'Környezeti hőmérséklet',symbol:'θ',unit:'°C',default:'30',integer:true,min:10,max:60,help:'Levegő; a táblázat referenciája 30 °C.'};
export const groupField:NumberField={id:'csop',kind:'number',label:'Együtt vezetett áramkörök száma',symbol:'n',unit:'db',default:'1',integer:true,min:1,max:20,help:'Kötegelve, felületen, beágyazva vagy zártan együtt futó terhelt áramkörök (a sajátot is beleértve).'};
export const sectionField=(id='A',label='Keresztmetszet',def='2,5'):SelectField=>({id,kind:'select',label,style:'select',default:def.replace(',','.'),options:SECTIONS.map(s=>({value:String(s),label:fmtNum(s)+' mm²',short:fmtNum(s)+' mm²'}))});
export const curveField:SelectField={id:'gorbe',kind:'select',label:'Kioldási jelleggörbe',style:'segmented',default:'B',options:(['B','C','D'] as const).map(c=>({value:c,label:c,short:c}))};
export const ratingField:SelectField={id:'In',kind:'select',label:'Névleges áram',style:'select',default:'16',options:MCB_RATINGS.value.map(r=>({value:String(r),label:r+' A',short:r+' A'}))};

export const tag=(r:TableRef)=>'['+r.short+' · '+r.status+']';

/** Iz = Iz0 · kθ · kcs egy keresztmetszetre, forrásmegjelöléssel és a feltételezésekkel. */
export function izFor(v:Inputs,section:number){
 const method=v.s('mod') as InstallMethod,ins=v.s('szig') as Insulation,loaded=Number(v.s('erek')) as 2|3,amb=v.n('temp'),n=v.n('csop');
 const cap=capacity(method,ins,loaded,section),kt=temperatureFactor(ins,amb),kg=groupingFactor(n);
 if(!cap)return null;
 const iz=cap.value*kt.value*kg.value;
 const assumptions:string[]=['Rézvezető, a táblázat szerinti referencia-szerelési móddal; hőszigetelésben futó hosszú szakasz nélkül.'];
 if(cap.fallback||kt.fallback)assumptions.push('XLPE-szigetelés: a programban nincs jóváhagyott XLPE-táblázat, ezért a PVC-értékekkel számol (kedvezőtlenebb irányban).');
 return {method,ins,loaded,amb,n,iz0:cap.value,kt:kt.value,kg:kg.value,iz,refs:[cap.ref,kt.ref,kg.ref],assumptions};
}
export function izStep(x:NonNullable<ReturnType<typeof izFor>>,section:number):Step{
 return step('Javított terhelhetőség','Iz = Iz0 · kθ · kcs',`Iz = ${u(x.iz0,'A')} ${tag(x.refs[0])} · ${u(x.kt,'')} ${tag(x.refs[1])} · ${u(x.kg,'')} ${tag(x.refs[2])}`,u(x.iz,'A'),'MSZ HD 60364-5-52 523; '+fmtNum(section)+' mm²');
}
