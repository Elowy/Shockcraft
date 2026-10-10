// Gyakran ismétlődő mezőleírók és formázók a kalkulátor-definíciókhoz.
import type {NumberField,SelectField,Step} from './core';
import {floorTo,formatNum,formatSI} from './number';

export const SYSTEM_OPTIONS={
 dc:{value:'dc',label:'Egyenáram (DC)',short:'DC'},
 '1f':{value:'1f',label:'Egyfázisú (230 V)',short:'1f'},
 '3f':{value:'3f',label:'Háromfázisú (400 V)',short:'3f'},
} as const;
export const systemField=(withDc=true,def='1f'):SelectField=>({id:'rendszer',kind:'select',label:'Rendszer',style:'segmented',default:def,options:withDc?[SYSTEM_OPTIONS.dc,SYSTEM_OPTIONS['1f'],SYSTEM_OPTIONS['3f']]:[SYSTEM_OPTIONS['1f'],SYSTEM_OPTIONS['3f']]});
/** Rendszerenként külön feszültségmező, saját alapértékkel (DC: 24 V, 1f: 230 V, 3f: 400 V vonali). */
export const voltageFields=(withDc=true):NumberField[]=>[
 ...(withDc?[{id:'Udc',kind:'number',label:'Feszültség',symbol:'U',unit:'V',default:'24',positive:true,max:1500,showIf:{field:'rendszer',is:['dc']}} satisfies NumberField]:[]),
 {id:'U',kind:'number',label:'Fázisfeszültség',symbol:'U',unit:'V',default:'230',positive:true,max:1000,showIf:{field:'rendszer',is:['1f']}},
 {id:'Uv',kind:'number',label:'Vonali feszültség',symbol:'U',unit:'V',default:'400',positive:true,max:1000,showIf:{field:'rendszer',is:['3f']},help:'Háromfázisú rendszerben a vonali (fázisok közötti) feszültség, jellemzően 400 V.'},
];
export const cosField=(def='1',showIf:NumberField['showIf']={field:'rendszer',is:['1f','3f']}):NumberField=>({id:'cos',kind:'number',label:'Teljesítménytényező',symbol:'cos φ',default:def,positive:true,max:1,showIf,help:'Ohmos terhelésnél 1; motoroknál és előtétes fényforrásoknál kisebb (adattábla).'});
/** A választott rendszer feszültsége a megfelelő mezőből. */
export const systemVoltage=(v:{n(id:string):number},system:string)=>system==='dc'?v.n('Udc'):system==='3f'?v.n('Uv'):v.n('U');

export const nb='\u00a0';
export const u=(n:number,unit:string,d?:number)=>formatNum(n,d)+(unit?nb+unit:'');
export const si=(n:number,unit:string)=>formatSI(n,unit);
export const step=(label:string,formula:string,substituted:string,result:string,ref?:string):Step=>({label,formula,substituted,result,ref});
export const pct=(n:number,d?:number)=>formatNum(n,d)+nb+'%';
/** Hossz lefelé kerekítve 0,1 m-re (biztonságos irány). A `note` csak akkor szöveg, ha a kerekítés látható eltérést okoz. */
export function floorLength(L:number){
 const f=floorTo(L,1),shown=u(f,'m',1),changed=formatNum(L)!==formatNum(f,1);
 return {value:f,text:shown+(changed?' (lefelé kerekítve)':''),step:u(L,'m')+(changed?' → lefelé kerekítve '+shown:'')};
}
