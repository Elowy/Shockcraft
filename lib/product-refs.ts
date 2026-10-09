import {labels,siteLabels,type Kind} from './plan';
import {moduleLabels,moduleTypes} from './board';

// Gépi típuskulcs (ref) az anyagkimutatás soraihoz: ehhez köthető a projekt termékválasztása.
// A materialKey (és így a régi ajánlatok illesztése) ettől független, nem változik.
export type RefCategory='Szerelvény'|'Elosztókészülék'|'Kábel'|'Telki pont';
export const REF_CATEGORY_ORDER:RefCategory[]=['Szerelvény','Elosztókészülék','Kábel','Telki pont'];
export const deviceRef=(kind:Kind)=>`device:${kind}`;
export const moduleRef=(type:typeof moduleTypes[number],width:number,c?:{curve:string;rating:number})=>`module:${type}:${width}`+(c?`:${c.curve}${c.rating}`:'');
export const siteRef=(kind:keyof typeof siteLabels)=>`site:${kind}`;
// Szabad szöveges kábeljelölés normalizálása: „3 × 2,5 mm²”, „3x2,5” és „3X2.5 mm2” ugyanaz a típus.
export function cableRef(text:string):string|undefined{const n=text.normalize('NFKC').toLocaleLowerCase('hu').replace(/[\x00-\x1f\x7f]/g,'').replace(/mm2?/g,'').replace(/[×*]/g,'x').replace(/,/g,'.').replace(/\s+/g,'');return !n||n==='nincskábeltípus'?undefined:'cable:'+n.slice(0,110)}
export const validRef=(s:string)=>s.length<=120&&/^(device|module|site|cable):[^\s\x00-\x1f\x7f]+$/.test(s);
const categories:Record<string,RefCategory>={device:'Szerelvény',module:'Elosztókészülék',cable:'Kábel',site:'Telki pont'};
const own=<T extends object>(o:T,k:string):k is Extract<keyof T,string>=>Object.hasOwn(o,k);
export function refCategory(ref:string):RefCategory|undefined{const k=ref.split(':')[0];return own(categories,k)?categories[k]:undefined}
export const refUnit=(ref:string):'db'|'m'=>ref.startsWith('cable:')?'m':'db';
export function refLabel(ref:string,fallback=''):string{
 const [kind,a='',b='',c='']=ref.split(':');
 if(kind==='device'&&own(labels,a))return labels[a];
 if(kind==='module'&&own(moduleLabels,a)&&b)return moduleLabels[a]+' · '+b+' modul'+(c?' · '+c+' A':'');
 if(kind==='site'&&own(siteLabels,a))return 'Telki pont: '+siteLabels[a];
 if(kind==='cable'&&a)return 'Kábel: '+(fallback||ref.slice(6));
 return ref;
}
